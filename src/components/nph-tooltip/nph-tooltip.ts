/**
 * `nph-tooltip` — the balloon for any element.
 *
 * Contract accepted in Figma (frame `1237:5`, board `1241:3`, component `1237:3`),
 * recorded as text in the evidence of the `figma-docs-accepted` gates of DSA-42 and
 * DSA-48, and decision P77 (which amends P65 and P62.6, amended on 22/10/2026):
 * - a floating text balloon attached to an element that receives focus. Keyboard
 *   focus opens it at once; the pointer opens it after resting `motion/hover-delay`
 *   on the element. It closes when the pointer leaves the element and the balloon,
 *   on blur or with Esc. It stays open while the pointer is over the balloon
 *   (WCAG 1.4.13);
 * - click, Enter and Space run the action of the element: they neither open nor
 *   close the balloon. A click during the wait cancels it;
 * - a disabled element, or one that does not receive focus, gets no balloon: without
 *   focus, a keyboard user never sees it;
 * - it never opens on touch: without hover, essential information never lives only
 *   in the balloon. The touch target is the element, at its own size; the icon-only
 *   button has no visible name there, an accepted exception;
 * - text only. It has no title, icon, action, link, arrow or border. The text fits
 *   whole in up to two lines: no ellipsis and no broken word. Longer text is a
 *   content error, and the component does not cut it;
 * - top by default; it flips when it does not fit; it may also sit bottom, left or
 *   right. The Figma component has no side property (D1): the side is behavior.
 *   `side` is the code way to ask for a preferred side, not a Figma property;
 * - it enters on `motion/enter-duration` and leaves on `motion/exit-duration`.
 *
 * API — five properties (P77; `text` and `open` come from P65):
 * - `text`, the balloon text, already localized by the consuming application;
 * - `for`, the `id` of the element that opens it, looked up in the SAME root as the
 *   tooltip (`getRootNode()`), like the native `<label for>`;
 * - `side`, the preferred side: `top` (default), `bottom`, `left` or `right`;
 * - `open`, the state. The tooltip turns it on and off by itself; the consumer may
 *   turn it on to show the balloon open, and the same closing rules apply;
 * - `relation`, what the balloon is to the element: `description` (default) or
 *   `name`, for the icon-only button, whose action name is the balloon text.
 *
 * HOW IT ATTACHES — it listens on the element found by `for` and adds its own `id`
 * to the `aria-describedby` of that element, or to its `aria-labelledby` with
 * `relation="name"` (never overwriting what is there, and following a change of its
 * own `id`). An element whose focus lives inside a shadow root cannot be referenced
 * from outside: the component that owns that shadow root renders its own tooltip
 * next to the focusable element, in the same root.
 *
 * ACCESSIBILITY — the host is `role="tooltip"` from mount, open or closed, and its
 * `aria-label` mirrors `text`, so the element has its description, or its name,
 * before the balloon opens (the browser does not read text that is `display: none`).
 * With `relation="name"` the text is announced once, as the name, and never also as
 * the description. The balloon is never focusable: focus stays on the element. Two
 * independent holds keep it open, the pointer (over the element or the balloon)
 * and the focus (visible focus on the element); it closes when both are gone.
 *
 * LAYER — the balloon is a `popover="manual"`, so it lives in the top layer: no
 * `z-index` and no clipping by an ancestor with `overflow`. Placement is measured
 * in JavaScript; CSS anchor positioning is not relied on.
 */
import { LitElement, html, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import styles from './nph-tooltip.css?inline';

const TAG = 'nph-tooltip';

/** The four sides the balloon may sit on, in the order `top` first (the default). */
export const NPH_TOOLTIP_SIDES = ['top', 'bottom', 'left', 'right'] as const;

export type NphTooltipSide = (typeof NPH_TOOLTIP_SIDES)[number];

/** What the balloon is to the element: its description (the default) or its name. */
export const NPH_TOOLTIP_RELATIONS = ['description', 'name'] as const;

export type NphTooltipRelation = (typeof NPH_TOOLTIP_RELATIONS)[number];

const REFERENCE: Record<NphTooltipRelation, string> = {
  description: 'aria-describedby',
  name: 'aria-labelledby',
};

/**
 * Keys that do not bring the focus hold back: Enter and Space run the action of the
 * element, Esc dismisses, and Tab moves the focus anyway.
 */
const KEYS_WITHOUT_HOLD = new Set(['Enter', ' ', 'Spacebar', 'Escape', 'Esc', 'Tab']);

/** A duration as the browser resolves it (`300ms` or `0.3s`), in milliseconds. */
function milliseconds(value: string): number | null {
  const match = /^(-?\d*\.?\d+)(ms|s)$/.exec(value.trim());
  if (match === null) {
    return null;
  }
  const amount = Number.parseFloat(match[1] as string);
  return match[2] === 's' ? amount * 1000 : amount;
}

const OPPOSITE: Record<NphTooltipSide, NphTooltipSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

let nextId = 0;

/**
 * Development error, following the `nph-icon` pattern. Outside a bundler that
 * defines `import.meta.env`, optional chaining keeps it silent.
 */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphTooltip extends LitElement {
  static override styles = unsafeCSS(styles);

  static override properties = {
    text: { type: String },
    for: { type: String, reflect: true },
    side: { type: String },
    /* `open` reflects so the consumer can style and check the state. */
    open: { type: Boolean, reflect: true },
    relation: { type: String },
  };

  /** The balloon text. Empty or only spaces: nothing is shown. */
  declare text: string;

  /** `id` of the element that opens the balloon, in the same root as the tooltip. */
  declare for: string | null;

  /** Preferred side. The balloon flips to the opposite one when it does not fit. */
  declare side: NphTooltipSide;

  /** The balloon is shown. Set by the component; the consumer may set it too. */
  declare open: boolean;

  /** The balloon describes the element (`description`) or names it (`name`). */
  declare relation: NphTooltipRelation;

  private target: Element | null = null;
  /** The reference this tooltip wrote on the element: where, under which id, and whether it added it. */
  private reference: { target: Element; attribute: string; id: string; added: boolean } | null = null;
  private rootObserver: MutationObserver | undefined;
  private observedRoot: Node | null = null;
  private readonly scrollTargets: EventTarget[] = [];

  /** Where the pointer and the focus are, physically. */
  private overTarget = false;
  private overBalloon = false;
  private hasFocus = false;
  private focusedElement: Element | null = null;
  /** Esc was pressed: the balloon stays closed until the pointer and the focus are both gone. */
  private dismissed = false;
  /** A pointer action on the target or its label suppresses focus opening; a key press clears it. */
  private pointerFocusSuppressed = false;

  private shown = false;
  /** The pointer rests on the element: it opens when the wait ends. */
  private waitTimer: number | undefined;
  private closeTimer: number | undefined;
  private retryFrame: number | undefined;
  private retried = false;
  private reported = '';
  private resizeObserver: ResizeObserver | undefined;

  constructor() {
    super();
    this.text = '';
    this.for = null;
    this.side = 'top';
    this.open = false;
    this.relation = 'description';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.observeRoot();
    this.setAttribute('role', 'tooltip');
    if (!this.id) {
      this.id = `${TAG}-${++nextId}`;
    }
    if (this.hasUpdated) {
      /* Moved in the DOM: attach again and show again if it was open. */
      this.requestUpdate();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.rootObserver?.disconnect();
    this.rootObserver = undefined;
    this.detach();
    this.observedRoot = null;
    this.cancelWait();
    this.hideNow();
    if (this.retryFrame !== undefined) {
      cancelAnimationFrame(this.retryFrame);
      this.retryFrame = undefined;
    }
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
      this.frame = undefined;
    }
    this.retried = false;
  }

  private get content(): string {
    return (this.text ?? '').trim();
  }

  private get validSide(): boolean {
    return (NPH_TOOLTIP_SIDES as readonly string[]).includes(this.side);
  }

  private get validRelation(): boolean {
    return (NPH_TOOLTIP_RELATIONS as readonly string[]).includes(this.relation);
  }

  /**
   * The element receives focus: not disabled (natively, or a custom element with a
   * `disabled` attribute), and in the Tab order or a host that delegates its focus.
   */
  private get focusable(): boolean {
    const target = this.target;
    if (target === null || target.matches(':disabled') || target.hasAttribute('disabled')) {
      return false;
    }
    if ((target instanceof HTMLElement || target instanceof SVGElement) && target.tabIndex >= 0) {
      return true;
    }
    return target.shadowRoot?.delegatesFocus === true;
  }

  /** Disabled is a passing state of a focusable element; anything else is an assembly error. */
  private reportUnfocusable(): void {
    const target = this.target;
    if (target === null || this.focusable || target.matches(':disabled') || target.hasAttribute('disabled')) {
      return;
    }
    this.report(
      `unfocusable ${this.for}`,
      `for "${this.for}" points at an element that does not receive focus; the balloon is not drawn there.`,
    );
  }

  private get bubble(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('.bubble');
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('text')) {
      /*
       * Chromium reads the description of the element through the flat tree when the
       * balloon is shown, but not while it is hidden (`display: none` has no text).
       * `aria-label` on the referenced element is read either way, so the host mirrors
       * the text: the element is described before the balloon opens.
       */
      if (this.content === '') {
        this.removeAttribute('aria-label');
      } else {
        this.setAttribute('aria-label', this.content);
      }
    }
    if (changed.has('for')) {
      this.retried = false;
    }
    if (changed.has('side') && !this.validSide) {
      this.report(`side "${this.side}"`, 'side must be top, bottom, left or right; the balloon was not drawn.');
    } else if (changed.has('side')) {
      this.reported = '';
    }
    if (changed.has('relation') && !this.validRelation) {
      this.report(`relation "${this.relation}"`, 'relation must be description or name; the balloon was not drawn.');
    } else if ((changed.has('relation') || changed.has('text')) && this.relation === 'name' && this.content === '') {
      this.report('name without text', 'relation="name" needs text: it is the accessible name of the element.');
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    /* An update that lands after the element left the DOM has nothing to attach to. */
    if (!this.isConnected) {
      return;
    }
    if (changed.has('for') || this.target === null || !this.target.isConnected) {
      this.attach();
    }
    if (changed.has('relation')) {
      this.associate();
    }
    this.syncVisibility();
  }

  /* ----- target ----------------------------------------------------------- */

  private report(cause: string, message: string): void {
    if (this.reported !== cause) {
      this.reported = cause;
      devError(message);
    }
  }

  private lookUp(): Element | null {
    const id = (this.for ?? '').trim();
    if (id === '') {
      return null;
    }
    const root = this.getRootNode() as Document | ShadowRoot;
    const found = typeof root.getElementById === 'function' ? root.getElementById(id) : null;
    return found instanceof Element ? found : null;
  }

  private observeRoot(): void {
    const root = this.getRootNode();
    if (root === this.observedRoot) {
      return;
    }
    this.rootObserver?.disconnect();
    this.observedRoot = root;
    this.rootObserver = new MutationObserver((records) => {
      const moved = records.some((record) => record.type === 'childList' || record.attributeName === 'id');
      /*
       * Re-attach only when the element came, went or was replaced. With no element
       * before and none now there is nothing to do: the one-frame retry of `attach()`
       * owns that case, and a second look from here would report it too early.
       */
      if (moved && (this.target === null ? this.lookUp() !== null : !this.target.isConnected || this.lookUp() !== this.target)) {
        this.attach();
        this.syncVisibility();
      }
      if (moved && this.isConnected) {
        /* Its own `id` changed: the reference on the element follows it. */
        if (!this.id) {
          this.id = `${TAG}-${++nextId}`;
        }
        this.associate();
      }
      /* Only the element's own state: a toggle elsewhere in the root costs nothing. */
      const target = this.target;
      const targetStateChanged =
        target !== null &&
        records.some(
          (record) =>
            (record.target === target && record.attributeName !== 'id') ||
            (record.attributeName === 'disabled' &&
              record.target instanceof HTMLFieldSetElement &&
              record.target.contains(target)),
        );
      if (targetStateChanged) {
        this.onTargetStateChange();
      }
    });
    this.rootObserver.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['id', 'disabled', 'tabindex'],
    });
  }

  private attach(): void {
    const next = this.lookUp();
    if (next !== null && next === this.target) {
      return;
    }
    this.detach();
    if (next === null) {
      this.noTarget();
      return;
    }
    this.retried = false;
    this.target = next;
    next.addEventListener('pointerenter', this.onTargetEnter as EventListener);
    next.addEventListener('pointerleave', this.onTargetLeave as EventListener);
    this.observedRoot?.addEventListener('pointerdown', this.onAnyPointerDown as EventListener, true);
    document.addEventListener('keydown', this.onAnyKeydown, true);
    next.addEventListener('focusin', this.onTargetFocusIn as EventListener);
    next.addEventListener('focusout', this.onTargetFocusOut as EventListener);
    if (this.resizeObserver !== undefined) {
      this.resizeObserver.observe(next);
      this.updateScrollTargets();
      this.onViewportChange();
    }
    this.associate();
    if (this.reported.startsWith('for ')) {
      this.reported = '';
    }
  }

  /** The element is not there (yet): a second look one frame later, then the error. */
  private noTarget(): void {
    if ((this.for ?? '').trim() === '') {
      this.report('for empty', 'for is required: it is the id of the element that opens the balloon; the balloon was not drawn.');
      return;
    }
    if (this.retried) {
      this.report(
        `for ${this.for}`,
        `for "${this.for}" matches no element in the same root as the tooltip; the balloon was not drawn.`,
      );
      return;
    }
    if (this.retryFrame !== undefined) {
      return;
    }
    this.retried = true;
    this.retryFrame = requestAnimationFrame(() => {
      this.retryFrame = undefined;
      this.attach();
      this.syncVisibility();
    });
  }

  private detach(): void {
    const target = this.target;
    if (target === null) {
      return;
    }
    target.removeEventListener('pointerenter', this.onTargetEnter as EventListener);
    target.removeEventListener('pointerleave', this.onTargetLeave as EventListener);
    this.observedRoot?.removeEventListener('pointerdown', this.onAnyPointerDown as EventListener, true);
    document.removeEventListener('keydown', this.onAnyKeydown, true);
    target.removeEventListener('focusin', this.onTargetFocusIn as EventListener);
    target.removeEventListener('focusout', this.onTargetFocusOut as EventListener);
    this.resizeObserver?.unobserve(target);
    this.clearScrollTargets();
    this.cancelWait();
    this.target = null;
    this.associate();
    this.overTarget = false;
    this.overBalloon = false;
    this.hasFocus = false;
    this.focusedElement = null;
    this.dismissed = false;
  }

  private updateScrollTargets(): void {
    this.clearScrollTargets();
    let node: Node | null = this.target;
    while (node !== null) {
      if (node instanceof Element || node instanceof ShadowRoot) {
        node.addEventListener('scroll', this.onViewportChange, true);
        this.scrollTargets.push(node);
      }
      /* The flat tree: a slotted node goes through its slot, inside the shadow root around it. */
      node = node instanceof ShadowRoot ? node.host : ((node as Element).assignedSlot ?? node.parentNode);
    }
  }

  private clearScrollTargets(): void {
    for (const target of this.scrollTargets) {
      target.removeEventListener('scroll', this.onViewportChange, true);
    }
    this.scrollTargets.length = 0;
  }

  /**
   * Keeps one reference on the element: this tooltip's current `id` in the attribute
   * of its relation. A stale one (an old id, the other attribute, the old element) is
   * removed first, and only if this tooltip added it; the other ids stay.
   */
  private associate(): void {
    const target = this.target;
    const wanted =
      target !== null && this.id && this.validRelation
        ? { target, attribute: REFERENCE[this.relation], id: this.id }
        : null;
    const current = this.reference;
    if (
      current !== null &&
      wanted !== null &&
      current.target === wanted.target &&
      current.attribute === wanted.attribute &&
      current.id === wanted.id
    ) {
      return;
    }
    if (current !== null && current.added) {
      const ids = (current.target.getAttribute(current.attribute) ?? '').split(/\s+/).filter(Boolean);
      const at = ids.indexOf(current.id);
      if (at >= 0) {
        ids.splice(at, 1);
        if (ids.length > 0) {
          current.target.setAttribute(current.attribute, ids.join(' '));
        } else {
          current.target.removeAttribute(current.attribute);
        }
      }
    }
    this.reference = null;
    if (wanted === null) {
      return;
    }
    const ids = (wanted.target.getAttribute(wanted.attribute) ?? '').split(/\s+/).filter(Boolean);
    const added = !ids.includes(wanted.id);
    if (added) {
      ids.push(wanted.id);
      wanted.target.setAttribute(wanted.attribute, ids.join(' '));
    }
    this.reference = { ...wanted, added };
  }

  /* ----- holds: the pointer and the focus --------------------------------- */

  /** Opens while any hold is on, unless Esc dismissed it; closes when all are gone. */
  private sync(): void {
    const any = this.overTarget || this.overBalloon || this.hasFocus;
    if (!any) {
      this.dismissed = false;
    }
    const want = any && !this.dismissed && this.focusable;
    if (this.open !== want) {
      this.open = want;
    }
  }

  /** How long the pointer rests before the balloon opens: the `motion/hover-delay` token. */
  private hoverDelay(): number {
    const delay = milliseconds(getComputedStyle(this).getPropertyValue('--nph-motion-hover-delay'));
    if (delay === null) {
      this.report('hover delay', 'motion/hover-delay is not defined (load tokens.css); the balloon opens on hover with no wait.');
      return 0;
    }
    return Math.max(delay, 0);
  }

  private cancelWait(): void {
    if (this.waitTimer !== undefined) {
      clearTimeout(this.waitTimer);
      this.waitTimer = undefined;
    }
  }

  private readonly onTargetEnter = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.cancelWait();
    if (!this.focusable) {
      this.reportUnfocusable();
      return;
    }
    /* Still on screen (open, or leaving): coming back keeps it, with no new wait. */
    const delay = this.shown ? 0 : this.hoverDelay();
    if (delay === 0) {
      this.overTarget = true;
      this.sync();
      return;
    }
    this.waitTimer = window.setTimeout(() => {
      this.waitTimer = undefined;
      this.overTarget = true;
      this.sync();
    }, delay);
  };

  private readonly onTargetLeave = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.cancelWait();
    this.overTarget = false;
    this.sync();
  };

  /** The element was disabled, or left the Tab order: it loses the balloon at once. */
  private onTargetStateChange(): void {
    if (this.focusable) {
      this.requestUpdate();
      return;
    }
    this.cancelWait();
    this.overTarget = false;
    this.hasFocus = false;
    if (this.open) {
      this.open = false;
    }
  }

  private readonly onBalloonEnter = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.overBalloon = true;
    this.sync();
  };

  private readonly onBalloonLeave = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.overBalloon = false;
    this.sync();
  };

  /* A tap can focus the element directly or through an associated label. */
  private readonly onAnyPointerDown = (event: PointerEvent): void => {
    const target = this.target;
    if (target === null) {
      return;
    }
    const path = event.composedPath();
    const onTarget = path.includes(target);
    /* A click runs the action and does not open the balloon: it ends the wait (rule 3). */
    if (onTarget && event.pointerType !== 'touch') {
      this.cancelWait();
    }
    const onLabel = path.some(
      (node) => node instanceof HTMLLabelElement && (node.htmlFor === target.id || node.contains(target)),
    );
    this.pointerFocusSuppressed = onTarget || onLabel;
  };

  /*
   * The keyboard is back, including when focus remains on a control after touch. Enter,
   * Space, Esc and Tab do not bring the focus hold back (see `KEYS_WITHOUT_HOLD`); Esc
   * also ends a wait, without being intercepted: there is no balloon to close yet.
   */
  private readonly onAnyKeydown = (event: KeyboardEvent): void => {
    this.pointerFocusSuppressed = false;
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.cancelWait();
    }
    if (KEYS_WITHOUT_HOLD.has(event.key)) {
      return;
    }
    if (this.focusedElement?.matches(':focus-visible')) {
      this.hasFocus = true;
      this.sync();
    }
  };

  private readonly onTargetFocusIn = (event: FocusEvent): void => {
    const focused = event.composedPath()[0];
    this.focusedElement = focused instanceof Element ? focused : null;
    const visible = focused instanceof Element && focused.matches(':focus-visible');
    if (this.pointerFocusSuppressed || !visible) {
      this.hasFocus = false;
      return;
    }
    this.hasFocus = true;
    this.sync();
  };

  private readonly onTargetFocusOut = (): void => {
    this.hasFocus = false;
    this.focusedElement = null;
    this.sync();
  };

  /* Esc, only while open, in the capture phase: the dialog around does not close with it. */
  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.open) {
      return;
    }
    this.dismissed = true;
    this.open = false;
    event.stopPropagation();
    event.preventDefault();
  };

  /* ----- showing and hiding ------------------------------------------------ */

  private get showable(): boolean {
    return this.content !== '' && this.validSide && this.validRelation && this.target !== null && this.focusable;
  }

  private syncVisibility(): void {
    const bubble = this.bubble;
    if (bubble === null) {
      return;
    }
    if (this.open && this.target !== null) {
      this.reportUnfocusable();
    }
    if (this.open && this.showable) {
      this.show(bubble);
    } else if (this.shown) {
      this.hide(bubble);
    }
  }

  private show(bubble: HTMLElement): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      this.shown = true;
      try {
        bubble.showPopover();
      } catch {
        /* Not connected, or already showing: nothing to do. */
      }
      document.addEventListener('keydown', this.onDocumentKeydown, true);
      window.addEventListener('scroll', this.onViewportChange, true);
      window.addEventListener('resize', this.onViewportChange);
      this.resizeObserver = new ResizeObserver(this.onViewportChange);
      if (this.target) this.resizeObserver.observe(this.target);
      this.updateScrollTargets();
      this.place(bubble);
      /* The first style is opacity 0; the next one starts the enter transition. */
      void bubble.offsetWidth;
    } else {
      this.place(bubble);
    }
    bubble.setAttribute('data-open', '');
  }

  /** Starts the exit; the balloon leaves the top layer when the exit ends. */
  private hide(bubble: HTMLElement): void {
    bubble.removeAttribute('data-open');
    if (this.closeTimer !== undefined) {
      return;
    }
    const duration = parseFloat(getComputedStyle(bubble).transitionDuration) * 1000;
    const finish = (): void => {
      this.closeTimer = undefined;
      this.hideNow();
    };
    if (!(duration > 0)) {
      finish();
      return;
    }
    this.closeTimer = window.setTimeout(finish, duration);
  }

  private hideNow(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    document.removeEventListener('keydown', this.onDocumentKeydown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.clearScrollTargets();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.shown = false;
    const bubble = this.bubble;
    if (bubble) {
      bubble.removeAttribute('data-open');
      try {
        bubble.hidePopover();
      } catch {
        /* Already hidden. */
      }
    }
  }

  /* ----- placement ---------------------------------------------------------- */

  private frame: number | undefined;

  private readonly onViewportChange = (): void => {
    if (this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      const bubble = this.bubble;
      if (bubble && this.shown) this.place(bubble);
    });
  };

  /** Margin that carries the distance to the element, per side, read back in pixels. */
  private gap(bubble: HTMLElement, side: NphTooltipSide): number {
    bubble.setAttribute('data-side', side);
    const style = getComputedStyle(bubble);
    const margin = { top: style.marginBottom, bottom: style.marginTop, left: style.marginRight, right: style.marginLeft };
    return parseFloat(margin[side]) || 0;
  }

  private place(bubble: HTMLElement): void {
    const target = this.target;
    if (target === null) return;
    const anchor = target.getBoundingClientRect();
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    /* The element is scrolled out of the window: the balloon goes with it, not stuck to the edge. */
    const visible = anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width;
    bubble.style.visibility = visible ? '' : 'hidden';
    if (!visible) {
      return;
    }
    bubble.style.maxWidth = '';
    bubble.style.maxHeight = '';
    const styleBeforeSizing = getComputedStyle(bubble);
    const maxWidth = parseFloat(styleBeforeSizing.maxWidth);
    const maxHeight = parseFloat(styleBeforeSizing.maxHeight);
    bubble.style.maxWidth = `min(var(--nph-layout-max-tooltip-width), ${view.width}px)`;
    bubble.style.maxHeight = 'none';
    /* Measure at the origin first: the size does not depend on where it sits. */
    bubble.style.top = '0px';
    bubble.style.left = '0px';
    const naturalHeight = bubble.getBoundingClientRect().height;
    if (view.width >= maxWidth || naturalHeight <= maxHeight) {
      bubble.style.maxHeight = '';
    }
    const { width, height } = bubble.getBoundingClientRect();

    const room = (side: NphTooltipSide): number => {
      const needed = (side === 'top' || side === 'bottom' ? height : width) + this.gap(bubble, side);
      const free = {
        top: anchor.top,
        bottom: view.height - anchor.bottom,
        left: anchor.left,
        right: view.width - anchor.right,
      }[side];
      return free - needed;
    };

    const preferred = this.side;
    let side: NphTooltipSide = preferred;
    if (room(preferred) < 0) {
      const opposite = OPPOSITE[preferred];
      if (room(opposite) >= 0) {
        side = opposite;
      } else {
        /* Neither fits: the side with the most room. */
        side = NPH_TOOLTIP_SIDES.reduce((best, next) => (room(next) > room(best) ? next : best), preferred);
      }
    }

    const gap = this.gap(bubble, side);
    let x: number;
    let y: number;
    if (side === 'top' || side === 'bottom') {
      x = anchor.left + anchor.width / 2 - width / 2;
      y = side === 'top' ? anchor.top - gap - height : anchor.bottom + gap;
    } else {
      y = anchor.top + anchor.height / 2 - height / 2;
      x = side === 'left' ? anchor.left - gap - width : anchor.right + gap;
    }
    /* Never outside the window; the margin box starts at `top`/`left`, so add the margin back. */
    x = Math.min(Math.max(x, 0), Math.max(view.width - width, 0));
    y = Math.min(Math.max(y, 0), Math.max(view.height - height, 0));
    const style = getComputedStyle(bubble);
    bubble.style.left = `${x - parseFloat(style.marginLeft)}px`;
    bubble.style.top = `${y - parseFloat(style.marginTop)}px`;
    bubble.setAttribute('data-side', side);
  }

  protected override render(): TemplateResult {
    return html`<div
      class="bubble"
      popover="manual"
      @pointerenter=${this.onBalloonEnter}
      @pointerleave=${this.onBalloonLeave}
    >${this.content}</div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphTooltip);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-tooltip': NphTooltip;
  }
}
