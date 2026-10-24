/**
 * `nph-dialog` — the modal window that blocks the page until the person finishes or
 * cancels a short task.
 *
 * Contract accepted in Figma (board `1368:27`, frame `2277:2`, set `2268:52262`, parts
 * `.nph-dialog/destaque` `2268:52091` and `.nph-dialog/conteúdo` `2311:5339`), recorded as
 * text in the evidence of the `figma-docs-accepted` gate of DSA-44, sheet
 * `fichas/nph-dialog.md`, `design.md` and decision P87 — nph-dialog: API and semantics:
 * - `heading`: the title, always present. It is the `<h2>` of the header and the name of
 *   the dialog on screen and for the screen reader;
 * - `description`: the support sentence below the title, which completes the name;
 * - `size`: `sm`, `md` (default) or `lg` — the Figma `tamanho` P, M and G. It sets the
 *   width CEILING: the dialog hugs its content, from `layout/dialog-min-width` up to
 *   `layout/dialog-sm`, `-md` or `-lg`;
 * - `actions`: `inline` (default) or `stacked` — the Figma `ações`. `stacked` puts the
 *   footer buttons one per line, the primary on top, below the `md` breakpoint (D1);
 * - `hide-close`: turns off the close button, which is on by default. `close-label` is
 *   its accessible name, already localized, and is required while the button is shown;
 * - `header-separator` and `footer-separator`: the lines that separate long content from
 *   the header and the footer;
 * - `open`: the state, the only way to open and close it. The dialog sets it to `false`
 *   itself when the person closes it;
 * - the default slot is the content area (the Figma `mostrar conteúdo` is whether the
 *   slot has content); the `footer` slot takes the action buttons (the Figma `rodapé`);
 * - own event `nph-close` (bubbles, composed, cancelable) with `detail: { source }`,
 *   fired before it closes when the person asks: Esc (`escape`) or the close button
 *   (`close-button`). `preventDefault()` keeps it open. Setting `open` from code never
 *   fires it;
 * - no highlight icon yet (D3), no `::part` and no color property.
 *
 * LAYER — the window is a native `<dialog>` opened with `showModal()`: it lives in the
 * top layer (no `z-index`, no clipping), the rest of the page is inert, and the veil
 * `overlay/scrim` is its `::backdrop`, outside the piece. Only the content scrolls.
 *
 * FOCUS — on open, it goes to the first element with `autofocus` in the content or the
 * footer; otherwise to the first focusable element of the content, then of the footer,
 * then to the close button, then to the window itself, looking into open shadow roots and
 * slots as the person sees them. On close, it goes back to the
 * element that had it. The page stays inert while the dialog is open, so Tab never
 * reaches it; no Tab trap is written in JavaScript.
 *
 * Invalid input does not render and emits `console.error` only in development, one per
 * cause while it lasts (the rule of P21): an empty `heading`, a `size` or an `actions`
 * outside the lists. An empty `close-label` with the close button on draws the dialog
 * without the button and says why. Opening a dialog over another opens it and emits
 * `console.warn` in development: the board says to finish or close the first one.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-separator/nph-separator';
import dialogCss from './nph-dialog.css?inline';

const TAG = 'nph-dialog';

/** The event the dialog fires when the person asks to close it. */
export const NPH_DIALOG_CLOSE_EVENT = 'nph-close';

export const NPH_DIALOG_SIZES = ['sm', 'md', 'lg'] as const;
export type NphDialogSize = (typeof NPH_DIALOG_SIZES)[number];

export const NPH_DIALOG_ACTIONS = ['inline', 'stacked'] as const;
export type NphDialogActions = (typeof NPH_DIALOG_ACTIONS)[number];

/** What the person used to ask for the close. */
export type NphDialogCloseSource = 'escape' | 'close-button';

export interface NphDialogCloseDetail {
  readonly source: NphDialogCloseSource;
}

/** Native elements that can take focus; a host that delegates focus counts too. */
const FOCUSABLE =
  'a[href], area[href], button, input, select, textarea, iframe, summary, [tabindex], [contenteditable]:not([contenteditable="false"]), audio[controls], video[controls]';

/** Development messages; outside a bundler with `import.meta.env`, they stay silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/* ----- shared by every dialog on the page ---------------------------------- */

/** The dialogs shown right now. */
const shownDialogs = new Set<NphDialog>();

/**
 * Background scroll lock (P87). A modal `<dialog>` makes the page inert, but the wheel
 * over the veil still scrolls it. While any dialog is shown, the root does not scroll;
 * the width of the scrollbar that disappears is given back as padding, measured at run
 * time, so the page does not shift. The values the root had are restored at the end.
 */
let locks = 0;

/** Each axis on its own: the `overflow` shorthand reads empty when only one axis is set. */
const LOCKED_PROPERTIES = ['overflow-x', 'overflow-y', 'padding-inline-end'] as const;
let savedRootStyle: { property: string; value: string; priority: string }[] | null = null;

function lockScroll(): void {
  locks += 1;
  if (locks > 1) {
    return;
  }
  const root = document.documentElement;
  const scrollbar = window.innerWidth - root.clientWidth;
  savedRootStyle = LOCKED_PROPERTIES.map((property) => ({
    property,
    value: root.style.getPropertyValue(property),
    priority: root.style.getPropertyPriority(property),
  }));
  if (scrollbar > 0) {
    const padding = parseFloat(getComputedStyle(root).paddingInlineEnd) || 0;
    root.style.setProperty('padding-inline-end', `${padding + scrollbar}px`);
  }
  root.style.setProperty('overflow-x', 'hidden');
  root.style.setProperty('overflow-y', 'hidden');
}

function unlockScroll(): void {
  if (locks === 0) {
    return;
  }
  locks -= 1;
  if (locks > 0 || savedRootStyle === null) {
    return;
  }
  const root = document.documentElement;
  for (const { property, value, priority } of savedRootStyle) {
    if (value === '') {
      root.style.removeProperty(property);
    } else {
      root.style.setProperty(property, value, priority);
    }
  }
  savedRootStyle = null;
}

/** The element that has the focus, inside shadow roots too. */
function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

/** `node` is `ancestor` or sits inside it, going up across shadow roots. */
function within(node: Node | null, ancestor: Node): boolean {
  let current: Node | null = node;
  while (current !== null) {
    if (current === ancestor) {
      return true;
    }
    current = current.parentNode ?? (current instanceof ShadowRoot ? current.host : null);
  }
  return false;
}

/**
 * `root` and what it draws, in the composed order the person sees: into open shadow
 * roots, and from a slot to what is assigned to it (or its fallback).
 */
function* composed(root: Element): Generator<Element> {
  yield root;
  const children =
    root instanceof HTMLSlotElement
      ? root.assignedElements({ flatten: true })
      : [...(root.shadowRoot ?? root).children];
  for (const child of children) {
    yield* composed(child);
  }
}

/**
 * The elements of `roots` and what they draw that may take focus, in composed order. A
 * negative `tabindex` takes the element out; on a shadow host it takes out everything the
 * host draws, slots included, as sequential navigation does. An ordinary ancestor with it
 * keeps its children.
 */
function focusables(roots: readonly Element[]): HTMLElement[] {
  const found: HTMLElement[] = [];
  const visit = (element: Element): void => {
    const tabindex = element.getAttribute('tabindex');
    const skipped = tabindex !== null && Number.parseInt(tabindex, 10) < 0;
    if (skipped && element.shadowRoot !== null) {
      return;
    }
    if (
      !skipped &&
      element instanceof HTMLElement &&
      (element.matches(FOCUSABLE) || element.shadowRoot?.delegatesFocus === true)
    ) {
      found.push(element);
    }
    const children =
      element instanceof HTMLSlotElement
        ? element.assignedElements({ flatten: true })
        : [...(element.shadowRoot ?? element).children];
    children.forEach(visit);
  };
  roots.forEach(visit);
  return found;
}

/**
 * `element` is turned off, or sits inside something turned off, up to `stop`: native
 * `:disabled` on the element itself (the browser already applies the rule of a disabled
 * `<fieldset>`, which spares its first `<legend>`), `aria-disabled="true"` (a part a piece
 * keeps focusable, such as the thumb of a disabled `nph-slider` or the native button of a
 * loading `nph-button`) or `disabled` on a custom element.
 */
function turnedOff(element: Element, stop: Node): boolean {
  if (element.matches(':disabled')) {
    return true;
  }
  let current: Node | null = element;
  while (current !== null && current !== stop) {
    if (
      current instanceof Element &&
      (current.getAttribute('aria-disabled') === 'true' ||
        (current.localName.includes('-') && current.hasAttribute('disabled')))
    ) {
      return true;
    }
    current = current.parentNode ?? (current instanceof ShadowRoot ? current.host : null);
  }
  return false;
}

/** Focuses `element` and says whether the focus really landed in it. */
function tryFocus(element: HTMLElement): boolean {
  element.focus();
  return within(deepActiveElement(), element);
}

/* ----- the component -------------------------------------------------------- */

export class NphDialog extends LitElement {
  static override styles = unsafeCSS(dialogCss);

  static override properties = {
    heading: { type: String },
    description: { type: String },
    /* `size`, `actions`, the separators, `hide-close` and `open` reflect: the internal CSS selects by them. */
    size: { type: String, reflect: true },
    actions: { type: String, reflect: true },
    hideClose: { type: Boolean, attribute: 'hide-close', reflect: true },
    closeLabel: { type: String, attribute: 'close-label' },
    headerSeparator: { type: Boolean, attribute: 'header-separator', reflect: true },
    footerSeparator: { type: Boolean, attribute: 'footer-separator', reflect: true },
    open: { type: Boolean, reflect: true },
  };

  /** The title, already localized by the consuming application. Required. */
  declare heading: string;

  /** The support sentence below the title. Empty: no description. */
  declare description: string;

  /** The width ceiling. `md` by default. */
  declare size: NphDialogSize;

  /** How the footer buttons sit below the `md` breakpoint. `inline` by default. */
  declare actions: NphDialogActions;

  /** Turns off the close button. */
  declare hideClose: boolean;

  /** Accessible name of the close button, already localized. Required while it is shown. */
  declare closeLabel: string;

  declare headerSeparator: boolean;

  declare footerSeparator: boolean;

  /** The dialog is open. */
  declare open: boolean;

  private valid = false;
  private closeShown = false;
  private shown = false;
  private closeTimer: number | undefined;
  private openings = 0;
  private initialFocus: Element | null = null;
  /* A text node edited in place fires no `slotchange`: its edits are watched here. */
  private readonly textWatch = new MutationObserver(() => {
    this.syncRegions();
  });
  private returnFocus: Element | null = null;
  private reported: readonly string[] = [];

  constructor() {
    super();
    this.heading = '';
    this.description = '';
    this.size = 'md';
    this.actions = 'inline';
    this.hideClose = false;
    this.closeLabel = '';
    this.headerSeparator = false;
    this.footerSeparator = false;
    this.open = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.textWatch.observe(this, { characterData: true, subtree: true });
    if (this.hasUpdated) {
      /* Moved in the DOM: show again if it was open. */
      this.requestUpdate();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.textWatch.disconnect();
    this.leaveNow();
  }

  private get panel(): HTMLDialogElement | null {
    return this.renderRoot.querySelector<HTMLDialogElement>('dialog');
  }

  protected override willUpdate(_changed: PropertyValues<this>): void {
    const heading = (this.heading ?? '').trim();
    const size = this.size ?? '';
    const actions = this.actions ?? '';
    const errors: string[] = [];
    if (heading === '') {
      errors.push('heading is required: it is the name of the dialog; nothing was drawn.');
    }
    if (!oneOf(NPH_DIALOG_SIZES, size)) {
      errors.push(`size "${size}" does not exist. Use ${NPH_DIALOG_SIZES.join(', ')}; nothing was drawn.`);
    }
    if (!oneOf(NPH_DIALOG_ACTIONS, actions)) {
      errors.push(`actions "${actions}" does not exist. Use ${NPH_DIALOG_ACTIONS.join(', ')}; nothing was drawn.`);
    }
    this.valid = errors.length === 0;
    const label = (this.closeLabel ?? '').trim();
    this.closeShown = !this.hideClose && label !== '';
    if (this.valid && !this.hideClose && label === '') {
      errors.push('close-label is required while the close button is shown: it is its accessible name; the button was not drawn.');
    }
    for (const error of errors) {
      if (!this.reported.includes(error)) {
        devError(error);
      }
    }
    this.reported = errors;
  }

  protected override updated(_changed: PropertyValues<this>): void {
    /* An update that lands after the element left the DOM has nothing to show. */
    if (!this.isConnected) {
      return;
    }
    this.syncRegions();
    const panel = this.panel;
    if (this.open && this.valid && panel !== null) {
      this.enter(panel);
    } else if (this.shown) {
      if (panel === null) {
        this.leaveNow();
      } else {
        this.leave(panel);
      }
    }
  }

  /* ----- content and footer ------------------------------------------------- */

  /**
   * Shows the content area, the footer and the footer line only when their slot has
   * something. Set on the elements directly: the template does not bind `hidden`, so a
   * slot change needs no new render.
   */
  private syncRegions(): void {
    const filled = (slot: HTMLSlotElement | null): boolean =>
      slot !== null &&
      slot
        .assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim() !== '');
    const root = this.renderRoot;
    const hasContent = filled(root.querySelector<HTMLSlotElement>('slot:not([name])'));
    const hasFooter = filled(root.querySelector<HTMLSlotElement>('slot[name="footer"]'));
    const content = root.querySelector<HTMLElement>('.content');
    const footer = root.querySelector<HTMLElement>('.footer');
    const footerLine = root.querySelector<HTMLElement>('.line-footer');
    if (content) content.hidden = !hasContent;
    if (footer) footer.hidden = !hasFooter;
    if (footerLine) footerLine.hidden = !hasFooter;
  }

  private readonly onSlotChange = (): void => {
    this.syncRegions();
  };

  /* ----- opening and closing -------------------------------------------------- */

  private enter(panel: HTMLDialogElement): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      if (shownDialogs.size > 0) {
        devWarn('another nph-dialog is already open: do not open a dialog over another; finish or close the first one.');
      }
      this.shown = true;
      shownDialogs.add(this);
      this.returnFocus = deepActiveElement();
      lockScroll();
      if (!panel.open) {
        try {
          panel.showModal();
        } catch {
          /* The browser refused to show it: nothing opened, so nothing is held. A later update tries again. */
          this.leaveNow();
          return;
        }
      }
      this.moveFocusIn(panel);
      void this.refocusWhenDrawn(panel, ++this.openings);
      /* The first style is opacity 0; the next one starts the enter transition. */
      void panel.offsetWidth;
    }
    panel.setAttribute('data-open', '');
  }

  /** Starts the exit; the window leaves the top layer when the exit ends. */
  private leave(panel: HTMLDialogElement): void {
    panel.removeAttribute('data-open');
    if (this.closeTimer !== undefined) {
      return;
    }
    const duration = parseFloat(getComputedStyle(panel).transitionDuration) * 1000;
    const finish = (): void => {
      this.closeTimer = undefined;
      this.leaveNow();
    };
    if (!(duration > 0)) {
      finish();
      return;
    }
    this.closeTimer = window.setTimeout(finish, duration);
  }

  /** Closes at once, releases the page and gives the focus back. */
  private leaveNow(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      return;
    }
    this.shown = false;
    this.initialFocus = null;
    shownDialogs.delete(this);
    unlockScroll();
    const panel = this.panel;
    if (panel !== null) {
      panel.removeAttribute('data-open');
      if (panel.open) {
        panel.close();
      }
    }
    const back = this.returnFocus;
    this.returnFocus = null;
    if (back instanceof HTMLElement && back.isConnected) {
      back.focus();
    }
  }

  /** The focus rule of P87: autofocus, content, footer, close button, the window. */
  private moveFocusIn(panel: HTMLDialogElement): void {
    this.focusByRule(panel);
    this.initialFocus = deepActiveElement();
  }

  /** Focuses the first candidate that takes it, or the window. */
  private focusByRule(panel: HTMLDialogElement): void {
    const assigned = (selector: string): Element[] =>
      this.renderRoot.querySelector<HTMLSlotElement>(selector)?.assignedElements({ flatten: true }) ?? [];
    const content = assigned('slot:not([name])');
    const footer = assigned('slot[name="footer"]');
    const autofocus = [...content, ...footer]
      .flatMap((root) => [...composed(root)])
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element.hasAttribute('autofocus'));
    const close = this.renderRoot.querySelector<HTMLElement>('.close');
    const order = [...autofocus, ...focusables(content), ...focusables(footer), ...(close ? [close] : [])].filter(
      (candidate) => !turnedOff(candidate, this),
    );
    for (const candidate of order) {
      /* A piece may hand the focus to a part that is turned off, such as a loading `nph-button`. */
      const active = tryFocus(candidate) ? deepActiveElement() : null;
      if (active !== null && !turnedOff(active, this)) {
        return;
      }
    }
    panel.focus();
  }

  /**
   * A piece that has not drawn yet — the close button, or a control with `autofocus`,
   * when the dialog is connected already open — cannot take the focus. Once they draw,
   * the rule runs again, only for the same opening and only if the focus is still where
   * the rule put it: a move by the person is kept.
   */
  private async refocusWhenDrawn(panel: HTMLDialogElement, opening: number): Promise<void> {
    const slots = [...this.renderRoot.querySelectorAll<HTMLSlotElement>('slot')];
    const pieces = [...slots.flatMap((slot) => [...composed(slot)]), ...this.renderRoot.querySelectorAll('.close')];
    const pending = pieces
      .map((piece) => (piece as Partial<{ updateComplete: Promise<unknown> }>).updateComplete)
      .filter((done): done is Promise<unknown> => done !== undefined);
    await Promise.all(pending);
    /* The exact element, not the piece: a move between two parts of one piece is the person's too. */
    const kept = this.initialFocus !== null && deepActiveElement() === this.initialFocus;
    if (this.shown && opening === this.openings && kept) {
      this.moveFocusIn(panel);
    }
  }

  /** Tells the consumer; returns whether the close may go on. */
  private requestClose(source: NphDialogCloseSource, cancelable: boolean): boolean {
    return this.dispatchEvent(
      new CustomEvent<NphDialogCloseDetail>(NPH_DIALOG_CLOSE_EVENT, {
        bubbles: true,
        composed: true,
        cancelable,
        detail: { source },
      }),
    );
  }

  /*
   * Esc is a close request of the browser, which fires `cancel` on the `<dialog>`. The
   * dialog always holds it, so the exit animates and `open` changes on one path. The
   * browser may refuse the hold — a second Esc with no new activation by the person —
   * and then `cancel` is not cancelable and the window closes at once.
   */
  private readonly onCancel = (event: Event): void => {
    event.preventDefault();
    if (!event.cancelable) {
      this.requestClose('escape', false);
      this.open = false;
      this.leaveNow();
      return;
    }
    if (this.requestClose('escape', true)) {
      this.open = false;
    }
  };

  /*
   * The window closed by a path other than `open` (the browser): the state follows. The
   * event is queued, so it may arrive after the window opened again — removed and put
   * back in the same turn — and then it is old news.
   */
  private readonly onNativeClose = (): void => {
    if (this.shown && this.panel?.open !== true) {
      this.open = false;
      this.leaveNow();
    }
  };

  private readonly onCloseClick = (): void => {
    if (this.requestClose('close-button', true)) {
      this.open = false;
    }
  };

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const description = (this.description ?? '').trim();
    return html`<dialog
      class="panel"
      tabindex="-1"
      aria-labelledby="heading"
      aria-describedby=${description !== '' ? 'description' : nothing}
      @cancel=${this.onCancel}
      @close=${this.onNativeClose}
    >
      <header class="header">
        <div class="titles">
          <h2 id="heading" class="heading">${this.heading.trim()}</h2>
          ${description !== '' ? html`<p id="description" class="description">${description}</p>` : nothing}
        </div>
        ${this.closeShown
          ? html`<nph-button
              class="close"
              severity="secondary"
              emphasis="ghost"
              size="compact"
              icon-start="xmark"
              label=${this.closeLabel.trim()}
              @click=${this.onCloseClick}
            ></nph-button>`
          : nothing}
      </header>
      ${this.headerSeparator ? html`<nph-separator class="line line-header"></nph-separator>` : nothing}
      <div class="content"><slot @slotchange=${this.onSlotChange}></slot></div>
      ${this.footerSeparator ? html`<nph-separator class="line line-footer"></nph-separator>` : nothing}
      <div class="footer"><slot name="footer" @slotchange=${this.onSlotChange}></slot></div>
    </dialog>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphDialog);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-dialog': NphDialog;
  }
  interface HTMLElementEventMap {
    'nph-close': CustomEvent<NphDialogCloseDetail>;
  }
}
