/**
 * `nph-tooltip` — the balloon for any element.
 *
 * Contract accepted in Figma (frame `1237:5`, board `1241:3`, component `1237:3`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-42, and
 * decision P77 (which amends P65 and P62.6):
 * - a floating text balloon attached to ANY element. It opens on hover and on
 *   keyboard focus, with no delay, and closes when the pointer leaves the element
 *   and the balloon, on blur or with Esc. It stays open while the pointer is over
 *   the balloon (WCAG 1.4.13);
 * - it never opens on touch: without hover, essential information never lives only
 *   in the balloon. The touch target is the element, at its own size;
 * - text only. It has no title, icon, action, link, arrow or border. The text fits
 *   whole in up to two lines: no ellipsis and no broken word. Longer text is a
 *   content error, and the component does not cut it;
 * - top by default; it flips when it does not fit; it may also sit bottom, left or
 *   right. The Figma component has no side property (D1): the side is behavior.
 *   `side` is the code way to ask for a preferred side, not a Figma property;
 * - it enters on `motion/enter-duration` and leaves on `motion/exit-duration`.
 *
 * API — four properties (P77; `text` and `open` come from P65):
 * - `text`, the balloon text, already localized by the consuming application;
 * - `for`, the `id` of the element that opens it, looked up in the SAME root as the
 *   tooltip (`getRootNode()`), like the native `<label for>`;
 * - `side`, the preferred side: `top` (default), `bottom`, `left` or `right`;
 * - `open`, the state. The tooltip turns it on and off by itself; the consumer may
 *   turn it on to show the balloon open, and the same closing rules apply.
 *
 * HOW IT ATTACHES — it listens on the element found by `for` and adds its own `id`
 * to the `aria-describedby` of that element (never overwriting what is there). An
 * element whose focus lives inside a shadow root cannot be described from outside:
 * the component that owns that shadow root renders its own tooltip next to the
 * focusable element, in the same root.
 *
 * ACCESSIBILITY — the host is `role="tooltip"` from mount, open or closed, and its
 * `aria-label` mirrors `text`, so the described element has its description before
 * the balloon opens (the browser does not read text that is `display: none`). The balloon is never focusable: focus stays on the element. Two
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
  };

  /** The balloon text. Empty or only spaces: nothing is shown. */
  declare text: string;

  /** `id` of the element that opens the balloon, in the same root as the tooltip. */
  declare for: string | null;

  /** Preferred side. The balloon flips to the opposite one when it does not fit. */
  declare side: NphTooltipSide;

  /** The balloon is shown. Set by the component; the consumer may set it too. */
  declare open: boolean;

  private target: Element | null = null;
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
  /** The last relevant pointer interaction was a touch. A key press clears it. */
  private touched = false;

  private shown = false;
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
  }

  protected override updated(changed: PropertyValues<this>): void {
    /* An update that lands after the element left the DOM has nothing to attach to. */
    if (!this.isConnected) {
      return;
    }
    if (changed.has('for') || this.target === null || !this.target.isConnected) {
      this.attach();
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
    this.rootObserver = new MutationObserver(() => {
      /*
       * Re-attach only when the element came, went or was replaced. With no element
       * before and none now there is nothing to do: the one-frame retry of `attach()`
       * owns that case, and a second look from here would report it too early.
       */
      if (this.target === null ? this.lookUp() !== null : !this.target.isConnected || this.lookUp() !== this.target) {
        this.attach();
        this.syncVisibility();
      }
    });
    this.rootObserver.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['id'] });
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
    this.describe(true);
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
    this.describe(false);
    this.target = null;
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
      node = node instanceof ShadowRoot ? node.host : node.parentNode;
    }
  }

  private clearScrollTargets(): void {
    for (const target of this.scrollTargets) {
      target.removeEventListener('scroll', this.onViewportChange, true);
    }
    this.scrollTargets.length = 0;
  }

  /** Adds or removes this tooltip's id in the `aria-describedby` of the element. */
  private describe(add: boolean): void {
    const target = this.target;
    if (target === null || !this.id) {
      return;
    }
    const ids = (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    const has = ids.includes(this.id);
    if (add && !has) {
      ids.push(this.id);
    } else if (!add && has) {
      ids.splice(ids.indexOf(this.id), 1);
    } else {
      return;
    }
    if (ids.length > 0) {
      target.setAttribute('aria-describedby', ids.join(' '));
    } else {
      target.removeAttribute('aria-describedby');
    }
  }

  /* ----- holds: the pointer and the focus --------------------------------- */

  /** Opens while any hold is on, unless Esc dismissed it; closes when all are gone. */
  private sync(): void {
    const any = this.overTarget || this.overBalloon || this.hasFocus;
    if (!any) {
      this.dismissed = false;
    }
    const want = any && !this.dismissed;
    if (this.open !== want) {
      this.open = want;
    }
  }

  private readonly onTargetEnter = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.overTarget = true;
    this.sync();
  };

  private readonly onTargetLeave = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.overTarget = false;
    this.sync();
  };

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
    const onLabel = path.some(
      (node) => node instanceof HTMLLabelElement && (node.htmlFor === target.id || node.contains(target)),
    );
    this.touched = event.pointerType === 'touch' && (onTarget || onLabel);
  };

  /* The keyboard is back, including when focus remains on a control after touch. */
  private readonly onAnyKeydown = (): void => {
    this.touched = false;
    if (this.focusedElement?.matches(':focus-visible')) {
      this.hasFocus = true;
      this.sync();
    }
  };

  private readonly onTargetFocusIn = (event: FocusEvent): void => {
    const focused = event.composedPath()[0];
    this.focusedElement = focused instanceof Element ? focused : null;
    const visible = focused instanceof Element && focused.matches(':focus-visible');
    if (this.touched || !visible) {
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
    return this.content !== '' && this.validSide && this.target !== null;
  }

  private syncVisibility(): void {
    const bubble = this.bubble;
    if (bubble === null) {
      return;
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
