/**
 * `nph-popconfirm` — the short confirmation anchored to a trigger and opened by it.
 *
 * Contract accepted in Figma (documentation frame `7389:104`, set `7222:3568`), recorded as text
 * in the evidence of the `figma-docs-accepted` gate of DSA-99 and in `fichas/nph-popconfirm.md`.
 * It asks a question about the action the person just requested and offers two ways out: Cancel
 * and the verb of the result. It is of the same family as `nph-popover` (surface, position, arrow,
 * one layer at a time) and follows its trigger wiring:
 * - `for`: the `id` of the element that opens it, looked up in the SAME root as the popconfirm
 *   (`getRootNode()`), like `nph-popover`. The trigger stays outside the component. The
 *   popconfirm writes `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls` on it, and the
 *   `nph-button` that carries them draws the open trigger;
 * - `open`: the state. Reflects. The trigger turns it on and off; the consumer may set it;
 * - `heading`: the title, always present, the question about the action. It names the
 *   `alertdialog`. `description`: optional, the consequence; it describes the `alertdialog`;
 * - `type` (the Figma `tipo`): `default`, `warning` or `destructive`. It changes the icon, the
 *   background of the icon box, the button that takes the focus on open and the Confirm button;
 * - `size`: `sm` (default) or `md`. `side`: `bottom` (default), `top`, `right` or `left`. `align`:
 *   `start`, `center` (default) or `end`. `arrow`: off by default, decorative;
 * - `hide-icon`: turns the type icon off (the Figma `ícone`, on by default). With no `description`
 *   there is no description (the Figma `descrição`);
 * - `confirm-label` and `cancel-label`: the texts of the two buttons, already localized and
 *   required. Confirm says the verb of the result, never Yes; Cancel says Cancel;
 * - `loading`: Confirm takes the `nph-button` loading state and the surface stays open;
 * - `return-focus-to` (property only): where the focus goes on close when the trigger is gone;
 * - own events, both `bubbles` and `composed`:
 *   `nph-confirm` (cancelable) fires when Confirm is pressed. Unless `preventDefault()` is called,
 *   the popconfirm closes. A slow confirm calls `preventDefault()`, sets `loading`, and sets `open`
 *   to `false` on success;
 *   `nph-cancel` fires before it closes when the person asks to give up, with
 *   `detail: { source }`: the Cancel button (`cancel-button`), Esc (`escape`), a press outside
 *   (`outside`), the trigger pressed again (`trigger`) or another layer taking the focus
 *   (`other-layer`). It is cancelable, except `other-layer`. It also fires while Confirm loads.
 *   Setting `open` from code fires nothing;
 * - no color property, no slot and no `::part`.
 *
 * LAYER — the surface is a `popover="manual"`, so it lives in the top layer, as `nph-popover`: no
 * `z-index` and no clipping by an ancestor. The page stays usable (it is not modal).
 *
 * FOCUS — `role="alertdialog"` with no `aria-modal` (item 8 of the accepted decisions). On open
 * the focus goes to Cancel in `warning` and `destructive` and to Confirm in `default`. Tab and
 * Shift+Tab move only between the two buttons, in the order they appear on screen. Esc, Cancel and
 * Confirm give the focus back to the trigger (or to `return-focus-to`, when the trigger is gone);
 * a press outside leaves it where the person pressed (item 9). Esc closes the popconfirm only.
 *
 * Invalid input does not render and emits `console.error` only in development, one per cause while
 * it lasts (the rule of P21): `for` empty or matching no element in the same root, an empty
 * `heading`, `confirm-label` or `cancel-label`, and a `type`, `size`, `side` or `align` outside
 * the lists.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-icon/nph-icon';
import '../nph-separator/nph-separator';
import popconfirmCss from './nph-popconfirm.css?inline';

const TAG = 'nph-popconfirm';

/** The event the popconfirm fires when Confirm is pressed. */
export const NPH_POPCONFIRM_CONFIRM_EVENT = 'nph-confirm';
/** The event the popconfirm fires when the person gives up. */
export const NPH_POPCONFIRM_CANCEL_EVENT = 'nph-cancel';

export const NPH_POPCONFIRM_TYPES = ['default', 'warning', 'destructive'] as const;
export type NphPopconfirmType = (typeof NPH_POPCONFIRM_TYPES)[number];

export const NPH_POPCONFIRM_SIZES = ['sm', 'md'] as const;
export type NphPopconfirmSize = (typeof NPH_POPCONFIRM_SIZES)[number];

export const NPH_POPCONFIRM_SIDES = ['bottom', 'top', 'right', 'left'] as const;
export type NphPopconfirmSide = (typeof NPH_POPCONFIRM_SIDES)[number];

export const NPH_POPCONFIRM_ALIGNMENTS = ['start', 'center', 'end'] as const;
export type NphPopconfirmAlignment = (typeof NPH_POPCONFIRM_ALIGNMENTS)[number];

/** What the person used to give up. */
export type NphPopconfirmCancelSource = 'cancel-button' | 'escape' | 'outside' | 'trigger' | 'other-layer';

export interface NphPopconfirmCancelDetail {
  readonly source: NphPopconfirmCancelSource;
}

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

let nextId = 0;

/** The popconfirms shown right now, in the order they were shown: Esc belongs to the last one. */
const shownPopconfirms: NphPopconfirm[] = [];

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/** The element that has the focus, inside shadow roots too. */
function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

/** `node` is `ancestor` or sits inside it, going out of shadow roots and slots the way the person sees it. */
function within(node: Node | null, ancestor: Node): boolean {
  let current: Node | null = node;
  while (current !== null) {
    if (current === ancestor) {
      return true;
    }
    current = (current as Element).assignedSlot ?? current.parentNode ?? (current instanceof ShadowRoot ? current.host : null);
  }
  return false;
}

/** The arrow of the side the surface resolved to: its points and its view box. */
const ARROW_SHAPE: Readonly<Record<NphPopconfirmSide, { viewBox: string; points: string }>> = {
  /* Surface below the trigger: the arrow is on the top edge and points up. */
  bottom: { viewBox: '0 0 2 1', points: '0,1 1,0 2,1' },
  /* Surface above the trigger: the arrow is on the bottom edge and points down. */
  top: { viewBox: '0 0 2 1', points: '0,0 1,1 2,0' },
  /* Surface to the right of the trigger: the arrow is on the left edge and points left. */
  right: { viewBox: '0 0 1 2', points: '1,0 0,1 1,2' },
  /* Surface to the left of the trigger: the arrow is on the right edge and points right. */
  left: { viewBox: '0 0 1 2', points: '0,0 1,1 0,2' },
};

const OPPOSITE: Readonly<Record<NphPopconfirmSide, NphPopconfirmSide>> = {
  bottom: 'top',
  top: 'bottom',
  right: 'left',
  left: 'right',
};

/** The icon of each type: a question for a step, an alert for a loss (Figma, "Icon and image"). */
const TYPE_ICON: Readonly<Record<NphPopconfirmType, 'circle-question' | 'triangle-exclamation'>> = {
  default: 'circle-question',
  warning: 'triangle-exclamation',
  destructive: 'triangle-exclamation',
};

/** The `nph-icon` size that carries each `size`: `popconfirm/icon-size-sm` is `icon/size-sm`, `-md` is `icon/size-lg`. */
const ICON_SIZE: Readonly<Record<NphPopconfirmSize, 'sm' | 'lg'>> = { sm: 'sm', md: 'lg' };

interface ButtonHost extends HTMLElement {
  updateComplete: Promise<boolean>;
}

export class NphPopconfirm extends LitElement {
  static override styles = unsafeCSS(popconfirmCss);

  static override properties = {
    for: { type: String, reflect: true },
    /* The attributes below reflect: the internal CSS, and the consumer, select by them. */
    open: { type: Boolean, reflect: true },
    heading: { type: String },
    description: { type: String },
    type: { type: String, reflect: true },
    size: { type: String, reflect: true },
    side: { type: String, reflect: true },
    align: { type: String, reflect: true },
    arrow: { type: Boolean, reflect: true },
    hideIcon: { type: Boolean, reflect: true, attribute: 'hide-icon' },
    confirmLabel: { type: String, attribute: 'confirm-label' },
    cancelLabel: { type: String, attribute: 'cancel-label' },
    loading: { type: Boolean, reflect: true },
    returnFocusTo: { attribute: false },
    /* The side the surface resolved to: it draws the arrow. Internal state, not API. */
    resolvedSide: { state: true },
  };

  /** `id` of the element that opens the popconfirm, in the same root as the popconfirm. */
  declare for: string | null;
  /** The popconfirm is open. */
  declare open: boolean;
  /** The title: the question about the action, already localized. Required. */
  declare heading: string;
  /** The consequence, already localized. Empty: no description. */
  declare description: string;
  /** Chosen by the consequence of the action. `default` by default. */
  declare type: NphPopconfirmType;
  /** The width, the padding and the title. `sm` by default. */
  declare size: NphPopconfirmSize;
  /** Where the surface opens, relative to the trigger. `bottom` by default. */
  declare side: NphPopconfirmSide;
  /** How the surface aligns to the trigger on that side. `center` by default. */
  declare align: NphPopconfirmAlignment;
  /** Draws the arrow that points to the trigger. */
  declare arrow: boolean;
  /** Turns the type icon off. */
  declare hideIcon: boolean;
  /** The verb of the result, already localized. Required. */
  declare confirmLabel: string;
  /** The text of the Cancel button, already localized. Required. */
  declare cancelLabel: string;
  /** Confirm is running: it takes the `nph-button` loading state and the surface stays open. */
  declare loading: boolean;
  /** Where the focus goes on close when the trigger is gone. Property only. */
  declare returnFocusTo: HTMLElement | null;
  declare resolvedSide: NphPopconfirmSide;

  private readonly uid = `nph-popconfirm-${(nextId += 1)}`;
  private trigger: HTMLElement | null = null;
  private wroteHaspopup = false;
  private wroteId = false;
  private retryFrame: number | undefined;
  private reported: readonly string[] = [];
  private valid = false;
  private shown = false;
  private closeTimer: number | undefined;
  private frame: number | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private readonly scrollTargets: EventTarget[] = [];
  private openings = 0;
  /** The next close leaves the focus where the person put it. */
  private keepFocus = false;

  constructor() {
    super();
    this.for = null;
    this.open = false;
    this.heading = '';
    this.description = '';
    this.type = 'default';
    this.size = 'sm';
    this.side = 'bottom';
    this.align = 'center';
    this.arrow = false;
    this.hideIcon = false;
    this.confirmLabel = '';
    this.cancelLabel = '';
    this.loading = false;
    this.returnFocusTo = null;
    this.resolvedSide = 'bottom';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.attach();
    this.watchRoot();
    if (this.hasUpdated) {
      /* Moved in the DOM: show again if it was open. */
      this.requestUpdate();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.rootWatch.disconnect();
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

  private button(name: 'cancel' | 'confirm'): ButtonHost | null {
    return this.renderRoot?.querySelector<ButtonHost>(`.${name}`) ?? null;
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

  /** `aria-controls` names the host. The id the popconfirm generated is the only one it ever removes. */
  private syncControls(): void {
    const trigger = this.trigger;
    if (trigger === null) {
      return;
    }
    if (this.id === '') {
      this.id = this.uid;
    }
    this.wroteId = this.id === this.uid;
    trigger.setAttribute('aria-controls', this.id);
  }

  /** The root is watched, so a node that takes the place of the trigger under the same id is found again. */
  private readonly rootWatch = new MutationObserver(() => {
    if (!this.isConnected) {
      return;
    }
    if (this.lookUp() !== this.trigger) {
      this.attach();
    } else {
      this.syncControls();
    }
  });

  private watchRoot(): void {
    this.rootWatch.disconnect();
    this.rootWatch.observe(this.getRootNode(), { childList: true, subtree: true, attributes: true, attributeFilter: ['id'] });
  }

  /** Finds the trigger; an element rendered right after the popconfirm is found one frame later (P77 item 10). */
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
    found.addEventListener('focusout', this.onTriggerFocusout);
    if (!found.hasAttribute('aria-haspopup')) {
      found.setAttribute('aria-haspopup', 'dialog');
      this.wroteHaspopup = true;
    }
    this.syncControls();
    found.setAttribute('aria-expanded', String(this.open));
    if (this.shown) {
      this.resizeObserver?.disconnect();
      this.observeSizes();
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
    trigger.removeEventListener('focusout', this.onTriggerFocusout);
    trigger.removeAttribute('aria-expanded');
    trigger.removeAttribute('aria-controls');
    if (this.wroteHaspopup) {
      trigger.removeAttribute('aria-haspopup');
      this.wroteHaspopup = false;
    }
    if (this.wroteId && this.id === this.uid) {
      this.removeAttribute('id');
    }
    this.wroteId = false;
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
    if (!this.valid) {
      return;
    }
    if (this.open) {
      this.giveUp('trigger');
      return;
    }
    if (!this.triggerInactive) {
      this.open = true;
    }
  };

  /* ----- closing -------------------------------------------------------------- */

  /** The person gave up: the consumer hears it with its source and may veto, except for another layer. */
  private giveUp(source: NphPopconfirmCancelSource): void {
    if (!this.open) {
      return;
    }
    const allowed = this.dispatchEvent(
      new CustomEvent<NphPopconfirmCancelDetail>(NPH_POPCONFIRM_CANCEL_EVENT, {
        bubbles: true,
        composed: true,
        cancelable: source !== 'other-layer',
        detail: { source },
      }),
    );
    if (!allowed && source !== 'other-layer') {
      return;
    }
    /* A press outside and another layer put the focus somewhere: it stays there. */
    this.keepFocus = source === 'outside' || source === 'other-layer';
    this.open = false;
  }

  private readonly onConfirmClick = (): void => {
    if (!this.open || this.loading) {
      return;
    }
    const allowed = this.dispatchEvent(
      new CustomEvent(NPH_POPCONFIRM_CONFIRM_EVENT, { bubbles: true, composed: true, cancelable: true }),
    );
    if (allowed && this.isConnected) {
      this.keepFocus = false;
      this.open = false;
    }
  };

  private readonly onCancelClick = (): void => {
    this.giveUp('cancel-button');
  };

  /*
   * Esc runs in the bubbling phase, after the controls inside: a control that used the key stops it
   * or prevents its default, and the popconfirm stays open for that press.
   */
  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if ((event.key !== 'Escape' && event.key !== 'Esc') || !this.open || event.defaultPrevented) {
      return;
    }
    /* With more than one open, the key is for the last one shown. */
    if (shownPopconfirms.filter((popconfirm) => popconfirm.open).at(-1) !== this) {
      return;
    }
    /* Esc closes the popconfirm only, not a dialog around it: its default is taken. */
    event.stopPropagation();
    event.preventDefault();
    this.giveUp('escape');
  };

  /** A press outside the surface and its trigger closes it as Cancel, without moving the focus. */
  private readonly onDocumentPointerdown = (event: PointerEvent): void => {
    const path = event.composedPath();
    if (!path.includes(this) && (this.trigger === null || !path.includes(this.trigger))) {
      this.giveUp('outside');
    }
  };

  /** The focus went to another layer or to the page by code: it closes. A move to the trigger is its own click. */
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
    this.giveUp('other-layer');
  };

  private readonly onTriggerFocusout = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    if (!this.open || !(next instanceof Node) || within(next, this) || within(next, this.trigger as Node)) {
      return;
    }
    this.giveUp('other-layer');
  };

  /** The Tab key moves only between Cancel and Confirm, in the order they appear on screen. */
  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') {
      return;
    }
    const cancel = this.button('cancel');
    const confirm = this.button('confirm');
    if (cancel === null || confirm === null) {
      return;
    }
    event.preventDefault();
    const stacked = this.renderRoot.querySelector('.actions')?.hasAttribute('data-stacked') === true;
    const order = stacked ? [confirm, cancel] : [cancel, confirm];
    const active = deepActiveElement();
    const index = order.findIndex((button) => within(active, button));
    let next: number;
    if (index < 0) {
      next = event.shiftKey ? order.length - 1 : 0;
    } else {
      next = (index + (event.shiftKey ? -1 : 1) + order.length) % order.length;
    }
    order[next]?.focus();
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
    /* Also on the first update: `for` may be set after the popconfirm was connected. */
    if (changed.has('for') && this.isConnected) {
      this.attach();
    }
    const causes: string[] = [];
    if ((this.for ?? '').trim() === '') {
      causes.push('for is empty: it is the id of the element that opens the popconfirm; nothing was drawn.');
    } else if (this.trigger === null && this.retryFrame === undefined) {
      causes.push(`for "${this.for}" matches no element in the same root as the popconfirm; nothing was drawn.`);
    }
    if ((this.heading ?? '').trim() === '') {
      causes.push('heading is required: it is the question and the name of the popconfirm; nothing was drawn.');
    }
    if ((this.confirmLabel ?? '').trim() === '') {
      causes.push('confirm-label is required: it is the verb of the result on the Confirm button; nothing was drawn.');
    }
    if ((this.cancelLabel ?? '').trim() === '') {
      causes.push('cancel-label is required: it is the text of the Cancel button; nothing was drawn.');
    }
    const lists: ReadonlyArray<readonly [string, readonly string[], string]> = [
      ['type', NPH_POPCONFIRM_TYPES, this.type ?? ''],
      ['size', NPH_POPCONFIRM_SIZES, this.size ?? ''],
      ['side', NPH_POPCONFIRM_SIDES, this.side ?? ''],
      ['align', NPH_POPCONFIRM_ALIGNMENTS, this.align ?? ''],
    ];
    for (const [name, list, value] of lists) {
      if (!oneOf(list, value)) {
        causes.push(`${name} "${value}" does not exist. Use ${list.join(', ')}; nothing was drawn.`);
      }
    }
    const waiting = this.trigger === null && this.retryFrame !== undefined;
    this.valid = causes.length === 0 && !waiting;
    /* An inactive trigger opens nothing, by the click or by `open` set from code or in the markup. */
    if (this.open && !this.shown && this.trigger !== null && this.triggerInactive) {
      this.open = false;
    }
    if (!waiting) {
      this.report(causes);
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    /* The surface is still in the DOM here: the focus goes back before an invalid input drops it. */
    if (!this.valid && this.shown && !(waiting && this.open)) {
      this.returnFocus();
    }
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

  /* ----- the layer ------------------------------------------------------------ */

  private observeSizes(): void {
    const surface = this.surface;
    if (this.trigger) this.resizeObserver?.observe(this.trigger);
    if (surface) {
      this.resizeObserver?.observe(surface);
      /* The buttons grow when a label changes or an inner piece renders: the stacking is measured again. */
      surface.querySelectorAll('.actions > *').forEach((button) => this.resizeObserver?.observe(button));
    }
  }

  private show(surface: HTMLElement): void {
    /* Opened again while it was leaving: the exit stops, and the focus rule runs again. */
    const reopening = this.closeTimer !== undefined;
    surface.inert = false;
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      this.shown = true;
      /*
       * One layer at a time, as `nph-popover`: the one that opens takes the focus, and the focus
       * leaving the open one closes it as `other-layer`, also while its Confirm loads.
       */
      shownPopconfirms.push(this);
      /* A flag left by a close that never reached the exit must not carry over to this opening. */
      this.keepFocus = false;
      try {
        surface.showPopover();
      } catch {
        /* Not connected, or already showing: nothing to do. */
      }
      document.addEventListener('keydown', this.onDocumentKeydown);
      document.addEventListener('pointerdown', this.onDocumentPointerdown, true);
      window.addEventListener('scroll', this.onViewportChange, true);
      window.addEventListener('resize', this.onViewportChange);
      this.resizeObserver = new ResizeObserver(() => this.onViewportChange());
      this.observeSizes();
      this.updateScrollTargets();
      this.place(surface);
      void this.focusInitial(surface, ++this.openings);
      /* The first style is the closed one; the next one starts the enter transition. */
      void surface.offsetWidth;
    } else {
      this.place(surface);
      /* Inner pieces may still be rendering: measure again on the next frame. */
      this.onViewportChange();
      if (reopening) {
        this.keepFocus = false;
        void this.focusInitial(surface, ++this.openings);
      }
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
    /* Leaving: the surface is still in the top layer until the exit ends, but nothing in it takes focus or a click. */
    surface.inert = true;
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

  /**
   * On close the focus goes back to the trigger or, if it is gone, to `return-focus-to`, when the
   * focus was inside the popconfirm and the person did not move it elsewhere (a press outside).
   */
  private returnFocus(): void {
    const keep = this.keepFocus;
    this.keepFocus = false;
    if (keep || !within(deepActiveElement(), this)) {
      return;
    }
    const target = this.trigger?.isConnected
      ? this.trigger
      : this.returnFocusTo?.isConnected
        ? this.returnFocusTo
        : null;
    target?.focus();
  }

  private hideNow(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    document.removeEventListener('keydown', this.onDocumentKeydown);
    document.removeEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.clearScrollTargets();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.shown = false;
    const position = shownPopconfirms.indexOf(this);
    if (position >= 0) shownPopconfirms.splice(position, 1);
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

  /** Every ancestor of the trigger in the flat tree: the scroll of an element in a shadow root does not reach `window`. */
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

  /* ----- position ------------------------------------------------------------- */

  /** The distance to the trigger, carried by the margin of the side that faces it, in pixels. */
  private gap(surface: HTMLElement, side: NphPopconfirmSide): number {
    surface.setAttribute('data-side', side);
    const style = getComputedStyle(surface);
    const margin = { bottom: style.marginTop, top: style.marginBottom, right: style.marginLeft, left: style.marginRight }[side];
    return parseFloat(margin) || 0;
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

  /**
   * The two buttons sit side by side. When they do not fit in the band (a long or translated label,
   * or a narrow window) they stack in a column, Confirm on top, each at the full width of the band
   * (D-2). The natural width is measured with the stacking off, so the answer does not depend on it.
   */
  private layoutActions(): void {
    const actions = this.renderRoot.querySelector<HTMLElement>('.actions');
    if (actions === null) {
      return;
    }
    actions.removeAttribute('data-stacked');
    const style = getComputedStyle(actions);
    const gap = parseFloat(style.columnGap) || 0;
    const usable = actions.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
    const widths = [...actions.children].map((button) => button.getBoundingClientRect().width);
    const natural = widths.reduce((sum, width) => sum + width, 0) + gap * Math.max(widths.length - 1, 0);
    if (usable > 0 && natural > usable + 0.5) {
      actions.setAttribute('data-stacked', '');
    }
  }

  /**
   * On the side asked for, aligned to the trigger. When it does not fit there and the opposite
   * side has more room, it turns to the opposite one. It never leaves the window, and it is never
   * wider than the window minus its margin.
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
    const requested = oneOf(NPH_POPCONFIRM_SIDES, this.side) ? this.side : 'bottom';
    const align = oneOf(NPH_POPCONFIRM_ALIGNMENTS, this.align) ? this.align : 'center';
    const margin = this.measure(surface, '--nph-layout-margin-compact');
    surface.style.maxWidth = `${Math.max(view.width - 2 * margin, 0)}px`;
    surface.style.top = '0px';
    surface.style.left = '0px';
    this.layoutActions();
    const { width, height } = surface.getBoundingClientRect();

    const room = (side: NphPopconfirmSide): number => {
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
      if (align === 'center') return anchorStart + (anchorEnd - anchorStart - size) / 2;
      return (align === 'start') === !reverse ? anchorStart : anchorEnd - size;
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
   * `popconfirm/arrow-inset` from that corner, `center` in the middle. When the window pushed the
   * surface sideways, the arrow slides back by the same amount, so the tip still points to the
   * trigger, and never gets closer to a corner than the inset.
   */
  private placeArrow(
    surface: HTMLElement,
    side: NphPopconfirmSide,
    align: NphPopconfirmAlignment,
    rtl: boolean,
    box: { width: number; height: number },
    shift: number,
  ): void {
    const horizontalSide = side === 'bottom' || side === 'top';
    const length = horizontalSide ? box.width : box.height;
    const arrowLength = this.measure(surface, '--nph-popconfirm-arrow-width');
    const inset = this.measure(surface, '--nph-popconfirm-arrow-inset');
    const low = inset;
    const high = Math.max(length - inset - arrowLength, low);
    /* The physical corner the alignment counts from: the inline start flips in right-to-left writing. */
    const fromLow = horizontalSide ? (align === 'start') !== rtl : align === 'start';
    let offset = align === 'center' ? (length - arrowLength) / 2 : fromLow ? low : high;
    offset = Math.min(Math.max(offset + shift, low), high);
    surface.style.setProperty('--_arrow-offset', `${offset}px`);
  }

  /* ----- focus ---------------------------------------------------------------- */

  /**
   * On open the focus goes to the least destructive action: Cancel in `warning` and `destructive`,
   * Confirm in `default`. The buttons have not drawn yet on the first opening, so the surface takes
   * the focus at once and the buttons take it when they are ready, only for the same opening and
   * only if the person has not moved it.
   */
  private async focusInitial(surface: HTMLElement, opening: number): Promise<void> {
    surface.focus();
    const cancel = this.button('cancel');
    const confirm = this.button('confirm');
    await Promise.all([cancel?.updateComplete, confirm?.updateComplete]);
    if (!(this.shown && this.open && opening === this.openings)) {
      return;
    }
    const kept = deepActiveElement() === surface || !within(deepActiveElement(), this);
    if (!kept) {
      return;
    }
    const target = this.type === 'default' ? confirm : cancel;
    target?.focus();
    if (target === null || !within(deepActiveElement(), target)) {
      surface.focus();
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
    const destructive = this.type === 'destructive';
    return html`<div
      class="surface"
      popover="manual"
      role="alertdialog"
      tabindex="-1"
      aria-labelledby="heading"
      aria-describedby=${description !== '' ? 'description' : nothing}
      @keydown=${this.onKeydown}
      @focusout=${this.onFocusout}
    >
      <div class="content">
        ${this.hideIcon
          ? nothing
          : html`<span class="icon-box" aria-hidden="true"
              ><nph-icon name=${TYPE_ICON[this.type]} variant="solid" size=${ICON_SIZE[this.size]}></nph-icon
            ></span>`}
        <div class="texts">
          <div id="heading" class="heading">${this.heading.trim()}</div>
          ${description !== '' ? html`<p id="description" class="description">${description}</p>` : nothing}
        </div>
      </div>
      <nph-separator class="divider"></nph-separator>
      <div class="actions">
        <nph-button
          class="cancel"
          severity="secondary"
          emphasis="solid"
          size="default"
          text=${this.cancelLabel.trim()}
          @click=${this.onCancelClick}
        ></nph-button>
        <nph-button
          class="confirm"
          severity=${destructive ? 'danger' : 'primary'}
          emphasis="solid"
          size="default"
          text=${this.confirmLabel.trim()}
          ?loading=${this.loading}
          @click=${this.onConfirmClick}
        ></nph-button>
      </div>
      ${this.renderArrow()}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphPopconfirm);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-popconfirm': NphPopconfirm;
  }
}
