/**
 * `nph-popover` — the non-modal floating surface anchored to a trigger and opened by it.
 *
 * Contract accepted in Figma (documentation frame `4749:5857`, set `4727:1544`), recorded as
 * text in the evidence of the `figma-docs-accepted` gate of DSA-67, sheet
 * `fichas/nph-popover.md`, `design.md` and decision P111 — nph-popover: API and semantics:
 * - `for`: the `id` of the element that opens the popover, looked up in the SAME root as the
 *   popover (`getRootNode()`), like `nph-tooltip` (P77) and `nph-dropdown-menu` (P92). The
 *   trigger stays outside the component. The popover writes `aria-haspopup="dialog"`,
 *   `aria-expanded` and `aria-controls` (the `id` of the host) on it, and the `nph-button` that
 *   carries them draws the open trigger (P111, amends P68);
 * - `open`: the state. Reflects. The trigger turns it on and off; the consumer may set it;
 * - `heading`: the title, always present. The `<h2>` of the surface and its accessible name;
 * - `description`: optional, the support text below the title, which describes the surface;
 * - `side` (the Figma `lado`): `bottom` (default), `top`, `right` or `left`. `align` (the
 *   `alinhamento`): `start`, `center` (default) or `end`. They state where the surface opens:
 *   the popover turns to the opposite side when the one asked for does not fit and the other
 *   does, and never leaves the window. The sides are physical; `start` and `end` follow the
 *   writing direction on the top and bottom sides;
 * - `arrow` (the `seta`): optional, off by default, decorative (`aria-hidden`);
 * - `size`: `sm`, `md` (default) or `lg`. It changes only the width;
 * - `closable` (the `fechar`): draws the close button; `close-label` is its accessible name,
 *   already localized, and is required while the button is shown;
 * - the default slot is the body (the `corpo`, an `nph-field` for instance); the `footer` slot
 *   takes the action buttons (the `rodapé`), and the divider comes with it;
 * - own event `nph-close` (bubbles, composed, cancelable) with `detail: { source }`, fired before
 *   it closes when the person asks: Esc (`escape`), a press outside (`outside`), the close button
 *   (`close-button`) or the focus leaving the surface (`focus-out`). `preventDefault()` keeps it
 *   open. Setting `open` from code, the trigger and a footer action never fire it: the action is
 *   a button of the consumer, which closes the popover by setting `open` to `false`;
 * - no color property and no `::part`.
 *
 * LAYER — the surface is a `popover="manual"`, so it lives in the top layer, as the
 * `nph-dropdown-menu` panel (P92) and the `nph-tooltip` balloon (P77): no `z-index` and no
 * clipping by an ancestor. It follows the trigger on scroll and resize. The page stays usable
 * (it is not modal) and nothing traps the Tab key.
 *
 * FOCUS — on open, it goes to the first element with `autofocus` in the body or the footer;
 * otherwise to the first focusable element of the body, then of the footer, then to the close
 * button, then to the surface itself (the rule of `nph-dialog`, P87). On close, it goes back to
 * the trigger when it was inside the popover; a press outside or the focus leaving the surface
 * leaves it where the person put it. Esc closes the popover only, not a dialog around it (P77).
 *
 * Invalid input does not render and emits `console.error` only in development, one per cause
 * while it lasts (the rule of P21): `for` empty or matching no element in the same root, an empty
 * `heading`, and a `side`, an `align` or a `size` outside the lists. An empty `close-label` with
 * the close button on draws the popover without the button and says why.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-separator/nph-separator';
import popoverCss from './nph-popover.css?inline';

const TAG = 'nph-popover';

/** The event the popover fires when the person asks to close it. */
export const NPH_POPOVER_CLOSE_EVENT = 'nph-close';

export const NPH_POPOVER_SIDES = ['bottom', 'top', 'right', 'left'] as const;
export type NphPopoverSide = (typeof NPH_POPOVER_SIDES)[number];

export const NPH_POPOVER_ALIGNMENTS = ['start', 'center', 'end'] as const;
export type NphPopoverAlignment = (typeof NPH_POPOVER_ALIGNMENTS)[number];

export const NPH_POPOVER_SIZES = ['sm', 'md', 'lg'] as const;
export type NphPopoverSize = (typeof NPH_POPOVER_SIZES)[number];

/** What the person used to ask for the close. */
export type NphPopoverCloseSource = 'escape' | 'outside' | 'close-button' | 'focus-out';

export interface NphPopoverCloseDetail {
  readonly source: NphPopoverCloseSource;
}

/** Native elements that can take focus; a host that delegates focus counts too. */
const FOCUSABLE =
  'a[href], area[href], button, input, select, textarea, iframe, summary, [tabindex], [contenteditable]:not([contenteditable="false"]), audio[controls], video[controls]';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

let nextId = 0;

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/* ----- focus helpers (the rule of P87, copied: there is no shared helper) -------- */

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

/** `root` and what it draws, in the composed order the person sees: into open shadow roots and slots. */
function* composed(root: Element): Generator<Element> {
  yield root;
  const children =
    root instanceof HTMLSlotElement ? root.assignedElements({ flatten: true }) : [...(root.shadowRoot ?? root).children];
  for (const child of children) {
    yield* composed(child);
  }
}

/** The elements of `roots` and what they draw that may take focus, in composed order. */
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
      element instanceof HTMLSlotElement ? element.assignedElements({ flatten: true }) : [...(element.shadowRoot ?? element).children];
    children.forEach(visit);
  };
  roots.forEach(visit);
  return found;
}

/** `element` is turned off, or sits inside something turned off, up to `stop`. */
function turnedOff(element: Element, stop: Node): boolean {
  if (element.matches(':disabled')) {
    return true;
  }
  let current: Node | null = element;
  while (current !== null && current !== stop) {
    if (
      current instanceof Element &&
      (current.getAttribute('aria-disabled') === 'true' || (current.localName.includes('-') && current.hasAttribute('disabled')))
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

/** The arrow of the side the surface resolved to: its box, its points and its view box. */
const ARROW_SHAPE: Readonly<Record<NphPopoverSide, { viewBox: string; points: string }>> = {
  /* Surface below the trigger: the arrow is on the top edge and points up. */
  bottom: { viewBox: '0 0 2 1', points: '0,1 1,0 2,1' },
  /* Surface above the trigger: the arrow is on the bottom edge and points down. */
  top: { viewBox: '0 0 2 1', points: '0,0 1,1 2,0' },
  /* Surface to the right of the trigger: the arrow is on the left edge and points left. */
  right: { viewBox: '0 0 1 2', points: '1,0 0,1 1,2' },
  /* Surface to the left of the trigger: the arrow is on the right edge and points right. */
  left: { viewBox: '0 0 1 2', points: '0,0 1,1 0,2' },
};

const OPPOSITE: Readonly<Record<NphPopoverSide, NphPopoverSide>> = {
  bottom: 'top',
  top: 'bottom',
  right: 'left',
  left: 'right',
};

export class NphPopover extends LitElement {
  static override styles = unsafeCSS(popoverCss);

  static override properties = {
    for: { type: String, reflect: true },
    /* The attributes below reflect: the internal CSS, and the consumer, select by them. */
    open: { type: Boolean, reflect: true },
    heading: { type: String },
    description: { type: String },
    side: { type: String, reflect: true },
    align: { type: String, reflect: true },
    arrow: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    closable: { type: Boolean, reflect: true },
    closeLabel: { type: String, attribute: 'close-label' },
    /* The side the surface resolved to: it draws the arrow. Internal state, not API. */
    resolvedSide: { state: true },
  };

  /** `id` of the element that opens the popover, in the same root as the popover. */
  declare for: string | null;
  /** The popover is open. */
  declare open: boolean;
  /** The title, already localized by the consuming application. Required. */
  declare heading: string;
  /** The support text below the title. Empty: no description. */
  declare description: string;
  /** Where the surface opens, relative to the trigger. `bottom` by default. */
  declare side: NphPopoverSide;
  /** How the surface aligns to the trigger on that side. `center` by default. */
  declare align: NphPopoverAlignment;
  /** Draws the arrow that points to the trigger. */
  declare arrow: boolean;
  /** The width. `md` by default. */
  declare size: NphPopoverSize;
  /** Draws the close button. */
  declare closable: boolean;
  /** Accessible name of the close button, already localized. Required while it is shown. */
  declare closeLabel: string;
  declare resolvedSide: NphPopoverSide;

  private readonly uid = `nph-popover-${(nextId += 1)}`;
  private trigger: HTMLElement | null = null;
  private wroteHaspopup = false;
  private wroteId = false;
  private retryFrame: number | undefined;
  private reported: readonly string[] = [];
  private valid = false;
  private closeShown = false;
  private shown = false;
  private closeTimer: number | undefined;
  private frame: number | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private readonly scrollTargets: EventTarget[] = [];
  private openings = 0;
  private initialFocus: Element | null = null;
  /** The next close leaves the focus where the person put it. */
  private keepFocus = false;

  constructor() {
    super();
    this.for = null;
    this.open = false;
    this.heading = '';
    this.description = '';
    this.side = 'bottom';
    this.align = 'center';
    this.arrow = false;
    this.size = 'md';
    this.closable = false;
    this.closeLabel = '';
    this.resolvedSide = 'bottom';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.attach();
    if (this.hasUpdated) {
      /* Moved in the DOM: show again if it was open. */
      this.requestUpdate();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.detach();
    this.hideNow();
    if (this.retryFrame !== undefined) {
      cancelAnimationFrame(this.retryFrame);
      this.retryFrame = undefined;
    }
  }

  private get surface(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('.surface') ?? null;
  }

  /* ----- the trigger ---------------------------------------------------------- */

  private lookUp(): HTMLElement | null {
    const id = (this.for ?? '').trim();
    if (id === '') {
      return null;
    }
    const root = this.getRootNode() as Document | ShadowRoot;
    const found = root.getElementById?.(id) ?? null;
    return found instanceof HTMLElement && found !== this ? found : null;
  }

  /** Finds the trigger; an element rendered right after the popover is found one frame later (P77 item 10). */
  private attach(retry = true): void {
    if (!this.isConnected) {
      return;
    }
    const found = this.lookUp();
    if (found !== null && found === this.trigger) {
      this.requestUpdate();
      return;
    }
    this.detach();
    if (found === null) {
      if (retry && (this.for ?? '').trim() !== '') {
        if (this.retryFrame !== undefined) cancelAnimationFrame(this.retryFrame);
        this.retryFrame = requestAnimationFrame(() => {
          this.retryFrame = undefined;
          this.attach(false);
        });
      }
      this.requestUpdate();
      return;
    }
    this.trigger = found;
    found.addEventListener('click', this.onTriggerClick);
    if (!found.hasAttribute('aria-haspopup')) {
      found.setAttribute('aria-haspopup', 'dialog');
      this.wroteHaspopup = true;
    }
    /* A reference to an id: the host, which holds the surface in its shadow root. */
    if (this.id === '') {
      this.id = this.uid;
      this.wroteId = true;
    }
    found.setAttribute('aria-controls', this.id);
    found.setAttribute('aria-expanded', String(this.open));
    if (this.shown) {
      this.resizeObserver?.disconnect();
      this.resizeObserver?.observe(found);
      const surface = this.surface;
      if (surface) this.resizeObserver?.observe(surface);
      this.updateScrollTargets();
      this.onViewportChange();
    }
    this.requestUpdate();
  }

  private detach(): void {
    const trigger = this.trigger;
    if (trigger === null) {
      return;
    }
    trigger.removeEventListener('click', this.onTriggerClick);
    trigger.removeAttribute('aria-expanded');
    trigger.removeAttribute('aria-controls');
    if (this.wroteHaspopup) {
      trigger.removeAttribute('aria-haspopup');
      this.wroteHaspopup = false;
    }
    if (this.wroteId) {
      this.removeAttribute('id');
      this.wroteId = false;
    }
    this.trigger = null;
  }

  /** A disabled or busy trigger opens nothing: `disabled`, `aria-disabled`, or the `loading` of `nph-button`. */
  private get triggerInactive(): boolean {
    const trigger = this.trigger;
    return (
      trigger === null ||
      trigger.matches(':disabled') ||
      trigger.hasAttribute('disabled') ||
      trigger.hasAttribute('loading') ||
      trigger.getAttribute('aria-disabled') === 'true'
    );
  }

  private readonly onTriggerClick = (): void => {
    if (!this.valid || (!this.open && this.triggerInactive)) {
      return;
    }
    this.open = !this.open;
  };

  /* ----- closing -------------------------------------------------------------- */

  /** Tells the consumer; returns whether the close may go on. */
  private requestClose(source: NphPopoverCloseSource): boolean {
    return this.dispatchEvent(
      new CustomEvent<NphPopoverCloseDetail>(NPH_POPOVER_CLOSE_EVENT, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { source },
      }),
    );
  }

  /** The person asked to close: the consumer may veto; otherwise it closes. */
  private close(source: NphPopoverCloseSource): void {
    if (!this.open || !this.requestClose(source)) {
      return;
    }
    /* A press outside and a focus that left put the focus somewhere: it stays there. */
    this.keepFocus = source === 'outside' || source === 'focus-out';
    this.open = false;
  }

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    /* During the exit the popover is already closed: a second Esc reaches the page. */
    if ((event.key !== 'Escape' && event.key !== 'Esc') || !this.open) {
      return;
    }
    /* Esc closes the popover only, not a dialog around it (P77 item 4). */
    event.stopPropagation();
    event.preventDefault();
    this.close('escape');
  };

  /** A press outside the surface and its trigger closes it, without moving the focus. */
  private readonly onDocumentPointerdown = (event: PointerEvent): void => {
    const path = event.composedPath();
    if (!path.includes(this) && (this.trigger === null || !path.includes(this.trigger))) {
      this.close('outside');
    }
  };

  /** The focus left the popover (Tab, code): it closes. A move to the trigger is its own click. */
  private readonly onFocusout = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    if (!(next instanceof Node)) {
      /* The window lost the focus, or the element left the page: nothing moved to somewhere else. */
      return;
    }
    const trigger = this.trigger;
    if (within(next, this) || (trigger !== null && within(next, trigger))) {
      return;
    }
    if (this.open) {
      this.close('focus-out');
    }
  };

  private readonly onCloseClick = (): void => {
    this.close('close-button');
  };

  /* ----- validity ------------------------------------------------------------- */

  private report(causes: string[]): void {
    for (const cause of causes) {
      if (!this.reported.includes(cause)) {
        devError(cause);
      }
    }
    this.reported = causes;
  }

  protected override willUpdate(changed: PropertyValues): void {
    /* Also on the first update: `for` may be set after the popover was connected. */
    if (changed.has('for') && this.isConnected) {
      this.attach();
    }
    const causes: string[] = [];
    if ((this.for ?? '').trim() === '') {
      causes.push('for is empty: it is the id of the element that opens the popover; nothing was drawn.');
    } else if (this.trigger === null && this.retryFrame === undefined) {
      causes.push(`for "${this.for}" matches no element in the same root as the popover; nothing was drawn.`);
    }
    if ((this.heading ?? '').trim() === '') {
      causes.push('heading is required: it is the name of the popover; nothing was drawn.');
    }
    const side = this.side ?? '';
    const align = this.align ?? '';
    const size = this.size ?? '';
    if (!oneOf(NPH_POPOVER_SIDES, side)) {
      causes.push(`side "${side}" does not exist. Use ${NPH_POPOVER_SIDES.join(', ')}; nothing was drawn.`);
    }
    if (!oneOf(NPH_POPOVER_ALIGNMENTS, align)) {
      causes.push(`align "${align}" does not exist. Use ${NPH_POPOVER_ALIGNMENTS.join(', ')}; nothing was drawn.`);
    }
    if (!oneOf(NPH_POPOVER_SIZES, size)) {
      causes.push(`size "${size}" does not exist. Use ${NPH_POPOVER_SIZES.join(', ')}; nothing was drawn.`);
    }
    const waiting = this.trigger === null && this.retryFrame !== undefined;
    this.valid = causes.length === 0 && !waiting;
    const label = (this.closeLabel ?? '').trim();
    this.closeShown = this.closable && label !== '';
    if (this.valid && this.closable && label === '') {
      causes.push('close-label is required while the close button is shown: it is its accessible name; the button was not drawn.');
    }
    if (!waiting) {
      this.report(causes);
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    /* While the trigger is still being looked up, `open` waits for it. */
    if (!this.valid && !waiting && this.open) {
      this.open = false;
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    /* An update that lands after the element left the DOM has nothing to show. */
    if (!this.isConnected) {
      return;
    }
    const open = this.open && this.valid;
    if (this.trigger !== null) {
      this.trigger.setAttribute('aria-expanded', String(open));
    }
    this.syncRegions();
    const surface = this.surface;
    if (surface === null) {
      /* The input became invalid while open: the surface is gone, and so are its listeners. */
      if (this.shown) this.hideNow();
      return;
    }
    if (open) {
      this.show(surface);
    } else if (changed.has('open') || !this.valid) {
      this.hide(surface);
    }
  }

  /* ----- body and footer ------------------------------------------------------ */

  /**
   * Shows the body and the footer only when their slot has something: with no footer there is no
   * divider, and with no body the part takes no room. Set on the elements directly, so a slot
   * change needs no new render.
   */
  private syncRegions(): void {
    const filled = (slot: HTMLSlotElement | null): boolean =>
      slot !== null &&
      slot.assignedNodes({ flatten: true }).some((node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim() !== '');
    const root = this.renderRoot;
    const hasBody = filled(root.querySelector<HTMLSlotElement>('slot:not([name])'));
    const hasFooter = filled(root.querySelector<HTMLSlotElement>('slot[name="footer"]'));
    const body = root.querySelector<HTMLElement>('.body');
    const footer = root.querySelector<HTMLElement>('.footer');
    const divider = root.querySelector<HTMLElement>('.divider');
    if (body) body.hidden = !hasBody;
    if (footer) footer.hidden = !hasFooter;
    if (divider) divider.hidden = !hasFooter;
  }

  private readonly onSlotChange = (): void => {
    this.syncRegions();
    this.onViewportChange();
  };

  /* ----- the layer ------------------------------------------------------------ */

  private show(surface: HTMLElement): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      this.shown = true;
      /* A flag left by a close that never reached the exit must not carry over to this opening. */
      this.keepFocus = false;
      try {
        surface.showPopover();
      } catch {
        /* Not connected, or already showing: nothing to do. */
      }
      document.addEventListener('keydown', this.onDocumentKeydown, true);
      document.addEventListener('pointerdown', this.onDocumentPointerdown, true);
      window.addEventListener('scroll', this.onViewportChange, true);
      window.addEventListener('resize', this.onViewportChange);
      this.resizeObserver = new ResizeObserver(() => this.onViewportChange());
      if (this.trigger) this.resizeObserver.observe(this.trigger);
      /* The surface too: inner pieces that render after the first measure make it grow. */
      this.resizeObserver.observe(surface);
      this.updateScrollTargets();
      this.place(surface);
      this.moveFocusIn(surface);
      void this.refocusWhenDrawn(surface, ++this.openings);
      /* The first style is the closed one; the next one starts the enter transition. */
      void surface.offsetWidth;
    } else {
      this.place(surface);
      /* New content may still be rendering its inner pieces: measure again on the next frame. */
      this.onViewportChange();
    }
    surface.setAttribute('data-open', '');
  }

  /** Starts the exit; the surface leaves the top layer when the exit ends. */
  private hide(surface: HTMLElement): void {
    surface.removeAttribute('data-open');
    if (this.closeTimer !== undefined || !this.shown) {
      return;
    }
    this.returnFocus();
    const duration = parseFloat(getComputedStyle(surface).transitionDuration) * 1000;
    if (!(duration > 0)) {
      this.hideNow();
      return;
    }
    this.closeTimer = window.setTimeout(() => {
      this.closeTimer = undefined;
      this.hideNow();
    }, duration);
  }

  /** On close the focus goes back to the trigger, if it was inside the popover and the person did not move it. */
  private returnFocus(): void {
    const keep = this.keepFocus;
    this.keepFocus = false;
    if (keep || this.trigger === null) {
      return;
    }
    if (within(deepActiveElement(), this)) {
      this.trigger.focus();
    }
  }

  private hideNow(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    document.removeEventListener('keydown', this.onDocumentKeydown, true);
    document.removeEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.clearScrollTargets();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.shown = false;
    this.initialFocus = null;
    const surface = this.surface;
    if (surface) {
      surface.removeAttribute('data-open');
      try {
        surface.hidePopover();
      } catch {
        /* Already hidden. */
      }
    }
  }

  /**
   * Every ancestor of the trigger in the flat tree, as in `nph-tooltip`: the scroll of an element
   * inside a shadow root does not reach `window`, so each ancestor and each root listens.
   */
  private updateScrollTargets(): void {
    this.clearScrollTargets();
    let node: Node | null = this.trigger ?? this;
    while (node !== null) {
      if (node instanceof Element || node instanceof ShadowRoot) {
        node.addEventListener('scroll', this.onViewportChange, true);
        this.scrollTargets.push(node);
      }
      node = node instanceof ShadowRoot ? node.host : ((node as Element).assignedSlot ?? node.parentNode);
    }
  }

  private clearScrollTargets(): void {
    for (const target of this.scrollTargets) {
      target.removeEventListener('scroll', this.onViewportChange, true);
    }
    this.scrollTargets.length = 0;
  }

  private readonly onViewportChange = (): void => {
    if (this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      const surface = this.surface;
      if (surface && this.shown) this.place(surface);
    });
  };

  /** The distance to the trigger, carried by the margin of the side that faces it, in pixels. */
  private gap(surface: HTMLElement, side: NphPopoverSide): number {
    surface.setAttribute('data-side', side);
    const style = getComputedStyle(surface);
    const margin = { bottom: style.marginTop, top: style.marginBottom, right: style.marginLeft, left: style.marginRight }[side];
    return parseFloat(margin) || 0;
  }

  /**
   * On the side asked for, aligned to the trigger. When it does not fit there and the opposite
   * side has more room, it turns to the opposite one. It never leaves the window.
   */
  private place(surface: HTMLElement): void {
    const trigger = this.trigger;
    if (trigger === null) return;
    const anchor = trigger.getBoundingClientRect();
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    /* The trigger is scrolled out of the window: the surface goes with it, not stuck to the edge. */
    const visible = anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width;
    surface.style.visibility = visible ? '' : 'hidden';
    if (!visible) {
      return;
    }
    const requested = oneOf(NPH_POPOVER_SIDES, this.side) ? this.side : 'bottom';
    const align = oneOf(NPH_POPOVER_ALIGNMENTS, this.align) ? this.align : 'center';
    /* The width is the token's; a narrower window holds it. */
    surface.style.maxWidth = `${view.width}px`;
    surface.style.top = '0px';
    surface.style.left = '0px';
    const { width, height } = surface.getBoundingClientRect();

    const room = (side: NphPopoverSide): number => {
      const gap = this.gap(surface, side);
      switch (side) {
        case 'bottom':
          return view.height - anchor.bottom - gap;
        case 'top':
          return anchor.top - gap;
        case 'right':
          return view.width - anchor.right - gap;
        default:
          return anchor.left - gap;
      }
    };
    const need = requested === 'bottom' || requested === 'top' ? height : width;
    const opposite = OPPOSITE[requested];
    const roomRequested = room(requested);
    const roomOpposite = room(opposite);
    const side = roomRequested >= need || roomOpposite <= roomRequested ? requested : opposite;
    const gap = this.gap(surface, side);

    const rtl = getComputedStyle(trigger).direction === 'rtl';
    /* `start` and `end` run along the inline axis on the top and bottom sides, and down the block axis on the others. */
    const along = (anchorStart: number, anchorEnd: number, size: number, reverse: boolean): number => {
      const startFirst = !reverse;
      if (align === 'center') return anchorStart + (anchorEnd - anchorStart - size) / 2;
      return (align === 'start') === startFirst ? anchorStart : anchorEnd - size;
    };
    const horizontalSide = side === 'bottom' || side === 'top';
    let x: number;
    let y: number;
    if (horizontalSide) {
      x = along(anchor.left, anchor.right, width, rtl);
      y = side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - height;
    } else {
      x = side === 'right' ? anchor.right + gap : anchor.left - gap - width;
      y = along(anchor.top, anchor.bottom, height, false);
    }
    const ideal = { x, y };
    x = Math.min(Math.max(x, 0), Math.max(view.width - width, 0));
    y = Math.min(Math.max(y, 0), Math.max(view.height - height, 0));
    const style = getComputedStyle(surface);
    surface.style.left = `${x - parseFloat(style.marginLeft)}px`;
    surface.style.top = `${y - parseFloat(style.marginTop)}px`;

    if (this.arrow) {
      this.placeArrow(surface, side, align, rtl, { width, height }, horizontalSide ? ideal.x - x : ideal.y - y);
    }
    if (this.resolvedSide !== side) {
      this.resolvedSide = side;
    }
  }

  /**
   * The arrow runs along the edge that faces the trigger: `start` and `end` keep it
   * `popover/arrow-inset` from that corner, `center` in the middle. When the window pushed the
   * surface sideways, the arrow slides back by the same amount, so the tip still points to the
   * trigger, and never gets closer to a corner than the inset.
   */
  private placeArrow(
    surface: HTMLElement,
    side: NphPopoverSide,
    align: NphPopoverAlignment,
    rtl: boolean,
    box: { width: number; height: number },
    shift: number,
  ): void {
    const horizontalSide = side === 'bottom' || side === 'top';
    const length = horizontalSide ? box.width : box.height;
    const arrowLength = this.measure(surface, '--nph-popover-arrow-width');
    const inset = this.measure(surface, '--nph-popover-arrow-inset');
    const low = inset;
    const high = Math.max(length - inset - arrowLength, low);
    /* The physical corner the alignment counts from: the inline start flips in right-to-left writing. */
    const fromLow = horizontalSide ? (align === 'start') !== rtl : align === 'start';
    let offset = align === 'center' ? (length - arrowLength) / 2 : fromLow ? low : high;
    offset = Math.min(Math.max(offset + shift, low), high);
    surface.style.setProperty('--_arrow-offset', `${offset}px`);
  }

  /** A token that is a length, in pixels. */
  private measure(element: HTMLElement, token: string): number {
    const probe = document.createElement('span');
    probe.style.cssText = `position:absolute;visibility:hidden;inline-size:var(${token});`;
    element.append(probe);
    const value = probe.getBoundingClientRect().width;
    probe.remove();
    return value;
  }

  /* ----- focus ---------------------------------------------------------------- */

  /** The focus rule of P87: autofocus, body, footer, close button, the surface. */
  private moveFocusIn(surface: HTMLElement): void {
    this.focusByRule(surface);
    this.initialFocus = deepActiveElement();
  }

  /** Focuses the first candidate that takes it, or the surface. */
  private focusByRule(surface: HTMLElement): void {
    const assigned = (selector: string): Element[] =>
      this.renderRoot.querySelector<HTMLSlotElement>(selector)?.assignedElements({ flatten: true }) ?? [];
    const body = assigned('slot:not([name])');
    const footer = assigned('slot[name="footer"]');
    const autofocus = [...body, ...footer]
      .flatMap((root) => [...composed(root)])
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element.hasAttribute('autofocus'));
    const close = this.renderRoot.querySelector<HTMLElement>('.close');
    const order = [...autofocus, ...focusables(body), ...focusables(footer), ...(close ? [close] : [])].filter(
      (candidate) => !turnedOff(candidate, this),
    );
    for (const candidate of order) {
      /* A piece may hand the focus to a part that is turned off, such as a loading `nph-button`. */
      const active = tryFocus(candidate) ? deepActiveElement() : null;
      if (active !== null && !turnedOff(active, this)) {
        return;
      }
    }
    surface.focus();
  }

  /**
   * A piece that has not drawn yet — the close button, or a control with `autofocus` — cannot
   * take the focus. Once they draw, the rule runs again, only for the same opening and only if
   * the focus is still where the rule put it: a move by the person is kept.
   */
  private async refocusWhenDrawn(surface: HTMLElement, opening: number): Promise<void> {
    const slots = [...this.renderRoot.querySelectorAll<HTMLSlotElement>('slot')];
    const pieces = [...slots.flatMap((slot) => [...composed(slot)]), ...this.renderRoot.querySelectorAll('.close')];
    const pending = pieces
      .map((piece) => (piece as Partial<{ updateComplete: Promise<unknown> }>).updateComplete)
      .filter((done): done is Promise<unknown> => done !== undefined);
    await Promise.all(pending);
    const kept = this.initialFocus !== null && deepActiveElement() === this.initialFocus;
    if (this.shown && this.open && opening === this.openings && kept) {
      this.moveFocusIn(surface);
    }
  }

  /* ----- drawing -------------------------------------------------------------- */

  private renderArrow(): TemplateResult | typeof nothing {
    if (!this.arrow) {
      return nothing;
    }
    const shape = ARROW_SHAPE[this.resolvedSide];
    return html`<svg class="arrow" viewBox=${shape.viewBox} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <polygon class="arrow-fill" points=${shape.points}></polygon>
      <polyline class="arrow-line" points=${shape.points}></polyline>
    </svg>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const description = (this.description ?? '').trim();
    return html`<div
      class="surface"
      popover="manual"
      role="dialog"
      tabindex="-1"
      aria-labelledby="heading"
      aria-describedby=${description !== '' ? 'description' : nothing}
      @focusout=${this.onFocusout}
    >
      <div class="content">
        <div class="header">
          <h2 id="heading" class="heading">${this.heading.trim()}</h2>
          ${this.closeShown
            ? html`<nph-button
                class="close"
                severity="secondary"
                emphasis="ghost"
                size="compact"
                icon-start="xmark"
                label=${(this.closeLabel ?? '').trim()}
                @click=${this.onCloseClick}
              ></nph-button>`
            : nothing}
        </div>
        ${description !== '' ? html`<p id="description" class="description">${description}</p>` : nothing}
        <div class="body"><slot @slotchange=${this.onSlotChange}></slot></div>
      </div>
      <nph-separator class="divider"></nph-separator>
      <div class="footer"><slot name="footer" @slotchange=${this.onSlotChange}></slot></div>
      ${this.renderArrow()}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphPopover);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-popover': NphPopover;
  }
}
