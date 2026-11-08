/**
 * `nph-hover-card` — the read-only preview card anchored to a link.
 *
 * Contract accepted in Figma (documentation frame `4422:2418`, component set `4406:1105`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-68, and decision P112:
 * - a text link that opens a card with a title, a description and a meta line, to sum up the
 *   destination without taking the person away from the page. The card is read only: no button,
 *   link or field inside, and it never takes focus. Everything the card shows also exists at the
 *   destination;
 * - the pointer resting on the link opens it after `hover-card/open-delay` (600 ms); it closes
 *   `hover-card/close-delay` (300 ms) after the pointer leaves the link and the card, and the
 *   pointer can go onto the card without closing it (WCAG 1.4.13). Keyboard focus on the link opens
 *   it with no wait, and Esc closes it;
 * - on touch there is no hover: tapping the link follows it to the destination;
 * - bottom by default; it may sit top, left or right and flips when it does not fit. An optional
 *   arrow points to the link; the distance from the link is `hover-card/offset` (4), to the card
 *   or to the arrow tip;
 * - the arrow and the meta icon are decorative (`aria-hidden`).
 *
 * API (P112):
 * - `href`, the destination of the link, required. Only `http:`, `https:` or a relative address;
 * - the default slot, the text of the link (the Figma `texto do gatilho`);
 * - `heading`, the title of the card, required (the Figma `título`; not `title`, which is the
 *   native tooltip attribute);
 * - `description`, the summary of the destination, optional;
 * - `meta`, the short text of the meta line (the Figma `meta`): empty turns the line off (the
 *   Figma `mostrar meta`); `meta-icon`, the core name of its icon, `clock` by default (the Figma
 *   `ícone da meta`); `meta-title`, the full date, which becomes the `title` of the meta text;
 * - `side`: `bottom` (default), `top`, `left` or `right`; `arrow`, the optional arrow;
 * - `open`, the state. The card turns it on and off by itself; the consumer may turn it on to show
 *   the card open, and the same closing rules apply;
 * - slot `media`, optional, at the start of the card: the avatar, image or badge of the three
 *   required examples. The Figma set has no slot for them (D-1 of P112).
 *
 * The texts are already localized by the consuming application, and so is the time: the piece
 * writes no word and computes no relative time.
 *
 * LAYER — the card is a `popover="manual"`, so it lives in the top layer: no `z-index` and no
 * clipping by an ancestor with `overflow`. Placement is measured in JavaScript; CSS anchor
 * positioning is not relied on.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import styles from './nph-hover-card.css?inline';

const TAG = 'nph-hover-card';

/** The four sides the card may sit on, `bottom` first (the default). */
export const NPH_HOVER_CARD_SIDES = ['bottom', 'top', 'left', 'right'] as const;

export type NphHoverCardSide = (typeof NPH_HOVER_CARD_SIDES)[number];

/** The protocols a link may use; a relative address is resolved against the page. */
export const NPH_HOVER_CARD_LINK_PROTOCOLS = ['http:', 'https:'] as const;

const OPPOSITE: Record<NphHoverCardSide, NphHoverCardSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/**
 * Whether an address may be the `href` of the link. It is parsed as the browser would — tabs and
 * line breaks are removed and a scheme is read in any letter case — so `javascript:` cannot hide.
 */
export function isSafeHref(href: string): boolean {
  try {
    return (NPH_HOVER_CARD_LINK_PROTOCOLS as readonly string[]).includes(new URL(href, document.baseURI).protocol);
  } catch {
    return false;
  }
}

/** A duration as the browser resolves it (`300ms` or `0.3s`), in milliseconds. */
function milliseconds(value: string): number | null {
  const match = /^(-?\d*\.?\d+)(ms|s)$/.exec(value.trim());
  if (match === null) {
    return null;
  }
  const amount = Number.parseFloat(match[1] as string);
  return match[2] === 's' ? amount * 1000 : amount;
}

/**
 * Development error, following the `nph-icon` pattern. Outside a bundler that defines
 * `import.meta.env`, optional chaining keeps it silent.
 */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export class NphHoverCard extends LitElement {
  static override styles = unsafeCSS(styles);

  static override properties = {
    href: { type: String },
    heading: { type: String },
    description: { type: String },
    meta: { type: String },
    metaIcon: { type: String, attribute: 'meta-icon' },
    metaTitle: { type: String, attribute: 'meta-title' },
    /* `side`, `arrow` and `open` reflect so the consumer can style and check the state. */
    side: { type: String, reflect: true },
    arrow: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
  };

  /** The destination of the link. Required. */
  declare href: string | null;

  /** The title of the card. Required. */
  declare heading: string;

  /** The summary of the destination. Optional. */
  declare description: string;

  /** The text of the meta line. Empty turns the line off. */
  declare meta: string;

  /** The core name of the icon of the meta line, `clock` by default. */
  declare metaIcon: string;

  /** The full date, as the `title` of the meta text. Optional. */
  declare metaTitle: string;

  /** Preferred side. The card flips to the opposite one when it does not fit. */
  declare side: NphHoverCardSide;

  /** Draws the arrow that points to the link. */
  declare arrow: boolean;

  /** The card is shown. Set by the component; the consumer may set it too. */
  declare open: boolean;

  /** Where the pointer and the focus are, physically. */
  /** The pointer rests on the link long enough to open the card: a hold. */
  private overLink = false;
  /** The pointer is on the link, at once: only what Esc and the end of the dismissal look at. */
  private pointerOnLink = false;
  private overCard = false;
  private hasFocus = false;
  /** Esc was pressed: the card stays closed until the pointer and the focus are both gone. */
  private dismissed = false;

  private shown = false;
  private hasMedia = false;
  /** The pointer rests on the link: the card opens when the wait ends. */
  private waitTimer: number | undefined;
  private closeTimer: number | undefined;
  private exitTimer: number | undefined;
  private frame: number | undefined;
  private reported = '';
  private resizeObserver: ResizeObserver | undefined;
  /** Tells when an ancestor with `overflow` clips the link out of sight, which the window check cannot see. */
  private intersectionObserver: IntersectionObserver | undefined;
  private linkClipped = false;
  private readonly scrollTargets: EventTarget[] = [];

  constructor() {
    super();
    this.href = null;
    this.heading = '';
    this.description = '';
    this.meta = '';
    this.metaIcon = 'clock';
    this.metaTitle = '';
    this.side = 'bottom';
    this.arrow = false;
    this.open = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated) {
      /* Moved in the DOM: the card was hidden on disconnect, so draw it again if it was open. */
      this.requestUpdate();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cancelWait();
    this.cancelClose();
    this.hideNow();
    this.overLink = false;
    this.pointerOnLink = false;
    this.overCard = false;
    this.hasFocus = false;
    this.dismissed = false;
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
      this.frame = undefined;
    }
  }

  private get card(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('.card');
  }

  private get link(): HTMLAnchorElement | null {
    return this.renderRoot.querySelector<HTMLAnchorElement>('.link');
  }

  private get validSide(): boolean {
    return (NPH_HOVER_CARD_SIDES as readonly string[]).includes(this.side);
  }

  private get hasMeta(): boolean {
    return text(this.meta) !== '';
  }

  private get safeHref(): boolean {
    return text(this.href) !== '' && isSafeHref(text(this.href));
  }

  /** The first reason the card cannot be drawn, or `null`. The link is drawn anyway. */
  private get problem(): { cause: string; message: string } | null {
    if (text(this.href) === '') {
      return { cause: 'href empty', message: 'href is required: it is the destination of the link; the card was not drawn.' };
    }
    if (!this.safeHref) {
      return {
        cause: `href ${this.href ?? ''}`,
        message: `href is unsafe. A link takes ${NPH_HOVER_CARD_LINK_PROTOCOLS.join(' or ')} or a relative address; the card was not drawn.`,
      };
    }
    if (text(this.heading) === '') {
      return { cause: 'heading empty', message: 'heading is required: it is the title of the card; the card was not drawn.' };
    }
    if (!this.validSide) {
      return { cause: `side ${this.side}`, message: 'side must be bottom, top, left or right; the card was not drawn.' };
    }
    if (this.hasMeta && !isCoreName(text(this.metaIcon))) {
      return {
        cause: `meta-icon ${this.metaIcon}`,
        message: `meta-icon "${this.metaIcon}" does not belong to the Nephos core; the card was not drawn.`,
      };
    }
    return null;
  }

  private get drawable(): boolean {
    return this.problem === null;
  }

  private report(cause: string, message: string): void {
    if (this.reported !== cause) {
      this.reported = cause;
      devError(message);
    }
  }

  protected override willUpdate(): void {
    const problem = this.problem;
    if (problem === null) {
      this.reported = '';
      this.setAttribute('data-nph-rendered', '');
    } else {
      this.removeAttribute('data-nph-rendered');
      this.report(problem.cause, problem.message);
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (!this.isConnected) {
      return;
    }
    /* A close timer left by an earlier opening must not close a card that was turned on again. */
    if (changed.has('open') && this.open) {
      this.cancelClose();
    }
    this.syncVisibility();
  }

  /* ----- holds: the pointer and the focus --------------------------------- */

  /**
   * Opens while any hold is on, unless Esc dismissed it; closes when all are gone, after the
   * close delay, or at once when `immediate` (the focus left).
   */
  private sync(immediate = false): void {
    const any = this.overLink || this.overCard || this.hasFocus;
    /* The dismissal by Esc ends only when the pointer and the focus are both gone, not when the wait is pending. */
    if (!this.present) {
      this.dismissed = false;
    }
    if (any && !this.dismissed) {
      this.cancelClose();
      if (!this.open) {
        this.open = true;
      }
      return;
    }
    if (any) {
      /* Dismissed with Esc: it stays closed while a hold remains. */
      this.cancelClose();
      if (this.open) {
        this.open = false;
      }
      return;
    }
    if (!this.open) {
      return;
    }
    if (immediate) {
      this.cancelClose();
      this.open = false;
      return;
    }
    this.scheduleClose();
  }

  /** The pointer is on the link or the card, or the focus is on the link: whether Esc has anything to dismiss. */
  private get present(): boolean {
    return this.pointerOnLink || this.overCard || this.hasFocus;
  }

  /** A delay token as the browser resolves it, in milliseconds. */
  private delay(token: string): number {
    const value = milliseconds(getComputedStyle(this).getPropertyValue(token));
    if (value === null) {
      this.report(`delay ${token}`, `${token} is not defined (load tokens.css); the card uses no wait.`);
      return 0;
    }
    return Math.max(value, 0);
  }

  private cancelWait(): void {
    if (this.waitTimer !== undefined) {
      clearTimeout(this.waitTimer);
      this.waitTimer = undefined;
    }
  }

  private cancelClose(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }

  private scheduleClose(): void {
    if (this.closeTimer !== undefined) {
      return;
    }
    this.closeTimer = window.setTimeout(() => {
      this.closeTimer = undefined;
      if (!this.overLink && !this.overCard && !this.hasFocus) {
        this.open = false;
      }
    }, this.delay('--nph-hover-card-close-delay'));
  }

  private readonly onLinkEnter = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.cancelWait();
    this.cancelClose();
    if (!this.drawable) return;
    this.pointerOnLink = true;
    /* Still on screen (open, or leaving: `shown` outlives `open` by the exit): coming back keeps it, with no new wait. */
    const wait = this.open || this.shown ? 0 : this.delay('--nph-hover-card-open-delay');
    if (wait === 0) {
      this.overLink = true;
      this.sync();
      return;
    }
    this.waitTimer = window.setTimeout(() => {
      this.waitTimer = undefined;
      this.overLink = true;
      this.sync();
    }, wait);
  };

  private readonly onLinkLeave = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.cancelWait();
    this.pointerOnLink = false;
    this.overLink = false;
    this.sync();
  };

  /** A click follows the link: it ends the wait, nothing opens. */
  private readonly onLinkPointerDown = (): void => {
    this.cancelWait();
  };

  private readonly onCardEnter = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.overCard = true;
    this.sync();
  };

  private readonly onCardLeave = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.overCard = false;
    this.sync();
  };

  /** Keyboard focus only: a mouse click on a link does not match `:focus-visible`. */
  private readonly onLinkFocus = (event: FocusEvent): void => {
    const link = event.currentTarget as Element;
    if (!this.drawable || !link.matches(':focus-visible')) {
      this.hasFocus = false;
      return;
    }
    this.hasFocus = true;
    this.sync();
  };

  private readonly onLinkBlur = (): void => {
    this.hasFocus = false;
    this.sync(true);
  };

  /* Esc, only while shown, in the capture phase: the dialog around does not close with it. */
  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.open) {
      return;
    }
    /* Dismissed only while something still holds it: Esc during the close delay has nothing to wait out. */
    this.dismissed = this.present;
    this.cancelWait();
    this.cancelClose();
    this.open = false;
    event.stopPropagation();
    event.preventDefault();
  };

  /* ----- showing and hiding ------------------------------------------------ */

  private syncVisibility(): void {
    const card = this.card;
    if (card === null) {
      return;
    }
    if (this.open && this.drawable) {
      if (this.waitTimer !== undefined) {
        this.cancelWait();
        this.overLink = true;
      }
      this.show(card);
    } else if (this.shown) {
      this.hide(card);
    }
  }

  private show(card: HTMLElement): void {
    if (this.exitTimer !== undefined) {
      clearTimeout(this.exitTimer);
      this.exitTimer = undefined;
    }
    if (!this.shown) {
      this.shown = true;
      try {
        card.showPopover();
      } catch {
        /* Not connected, or already showing: nothing to do. */
      }
      document.addEventListener('keydown', this.onDocumentKeydown, true);
      window.addEventListener('scroll', this.onViewportChange, true);
      window.addEventListener('resize', this.onViewportChange);
      this.resizeObserver = new ResizeObserver(this.onViewportChange);
      const link = this.link;
      if (link) this.resizeObserver.observe(link);
      this.resizeObserver.observe(card);
      this.linkClipped = false;
      if (link && typeof IntersectionObserver !== 'undefined') {
        this.intersectionObserver = new IntersectionObserver((entries) => {
          const last = entries.at(-1);
          if (last === undefined) return;
          const clipped = !last.isIntersecting;
          if (clipped !== this.linkClipped) {
            this.linkClipped = clipped;
            this.onViewportChange();
          }
        });
        this.intersectionObserver.observe(link);
      }
      this.updateScrollTargets();
      this.place(card);
      /* The first style is opacity 0; the next one starts the enter transition. */
      void card.offsetWidth;
    } else {
      this.place(card);
    }
    card.setAttribute('data-open', '');
  }

  /** Starts the exit; the card leaves the top layer when the exit ends. */
  private hide(card: HTMLElement): void {
    card.removeAttribute('data-open');
    if (this.exitTimer !== undefined) {
      return;
    }
    const duration = Number.parseFloat(getComputedStyle(card).transitionDuration) * 1000;
    const finish = (): void => {
      this.exitTimer = undefined;
      this.hideNow();
    };
    if (!(duration > 0)) {
      finish();
      return;
    }
    this.exitTimer = window.setTimeout(finish, duration);
  }

  private hideNow(): void {
    if (this.exitTimer !== undefined) {
      clearTimeout(this.exitTimer);
      this.exitTimer = undefined;
    }
    document.removeEventListener('keydown', this.onDocumentKeydown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.clearScrollTargets();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = undefined;
    this.linkClipped = false;
    this.shown = false;
    const card = this.card;
    if (card) {
      card.removeAttribute('data-open');
      try {
        card.hidePopover();
      } catch {
        /* Already hidden. */
      }
    }
  }

  /* ----- placement ---------------------------------------------------------- */

  private updateScrollTargets(): void {
    this.clearScrollTargets();
    let node: Node | null = this.link;
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

  private readonly onViewportChange = (): void => {
    if (this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      const card = this.card;
      if (card && this.shown) this.place(card);
    });
  };

  /** The margin that carries the distance to the link, per side, read back in pixels. */
  private gap(card: HTMLElement, side: NphHoverCardSide): number {
    card.setAttribute('data-side', side);
    const style = getComputedStyle(card);
    const margin = { top: style.marginBottom, bottom: style.marginTop, left: style.marginRight, right: style.marginLeft };
    return Number.parseFloat(margin[side]) || 0;
  }

  /** Draws the arrow for the resolved side, in the pixels the browser gave its box. */
  private drawArrow(card: HTMLElement, side: NphHoverCardSide, along: number): void {
    const arrow = card.querySelector<SVGSVGElement>('.arrow');
    const path = arrow?.querySelector('path');
    if (!arrow || !path) return;
    const box = arrow.getBoundingClientRect();
    const w = box.width;
    const h = box.height;
    arrow.setAttribute('viewBox', `0 0 ${String(w)} ${String(h)}`);
    const tip = {
      bottom: `M0 ${String(h)} L${String(w / 2)} 0 L${String(w)} ${String(h)}`,
      top: `M0 0 L${String(w / 2)} ${String(h)} L${String(w)} 0`,
      right: `M${String(w)} 0 L0 ${String(h / 2)} L${String(w)} ${String(h)}`,
      left: `M0 0 L${String(w)} ${String(h / 2)} L0 ${String(h)}`,
    };
    path.setAttribute('d', tip[side]);
    if (side === 'top' || side === 'bottom') {
      arrow.style.left = `${String(along)}px`;
      arrow.style.top = '';
    } else {
      arrow.style.top = `${String(along)}px`;
      arrow.style.left = '';
    }
  }

  private place(card: HTMLElement): void {
    const link = this.link;
    if (link === null) return;
    const anchor = link.getBoundingClientRect();
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    /* The link is scrolled out of the window, or clipped by a scrolling ancestor: the card goes with it, not stuck to the edge. */
    const visible =
      !this.linkClipped && anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width;
    card.style.visibility = visible ? '' : 'hidden';
    if (!visible) {
      return;
    }
    /* Measure at the origin first: the size does not depend on where it sits. */
    card.style.top = '0px';
    card.style.left = '0px';
    const { width, height } = card.getBoundingClientRect();

    const room = (side: NphHoverCardSide): number => {
      const needed = (side === 'top' || side === 'bottom' ? height : width) + this.gap(card, side);
      const free = {
        top: anchor.top,
        bottom: view.height - anchor.bottom,
        left: anchor.left,
        right: view.width - anchor.right,
      }[side];
      return free - needed;
    };

    const preferred = this.side;
    let side: NphHoverCardSide = preferred;
    if (room(preferred) < 0) {
      const opposite = OPPOSITE[preferred];
      if (room(opposite) >= 0) {
        side = opposite;
      } else {
        /* Neither fits: the side with the most room. */
        side = NPH_HOVER_CARD_SIDES.reduce((best, next) => (room(next) > room(best) ? next : best), preferred);
      }
    }

    const style = getComputedStyle(card);
    const gap = this.gap(card, side);
    /* The tokens are in `rem`: the probe gives them back in pixels. */
    const probe = card.querySelector('.probe')?.getBoundingClientRect();
    const inset = probe?.width ?? 0;
    const arrowWidth = probe?.height ?? 0;
    /* The tip, with or without the arrow, sits on the center of the link, `arrow-inset` from the card corner. */
    const shift = inset + arrowWidth / 2;
    const rtl = style.direction === 'rtl';
    const cx = anchor.left + anchor.width / 2;
    const cy = anchor.top + anchor.height / 2;
    let x: number;
    let y: number;
    if (side === 'top' || side === 'bottom') {
      x = rtl ? cx + shift - width : cx - shift;
      y = side === 'top' ? anchor.top - gap - height : anchor.bottom + gap;
    } else {
      y = cy - shift;
      x = side === 'left' ? anchor.left - gap - width : anchor.right + gap;
    }
    /* Never outside the window; the margin box starts at `top`/`left`, so add the margin back. */
    x = Math.min(Math.max(x, 0), Math.max(view.width - width, 0));
    y = Math.min(Math.max(y, 0), Math.max(view.height - height, 0));
    card.style.left = `${String(x - Number.parseFloat(style.marginLeft))}px`;
    card.style.top = `${String(y - Number.parseFloat(style.marginTop))}px`;
    card.setAttribute('data-side', side);

    if (this.arrow) {
      /*
       * The arrow stays on the center of the link when the window pushed the card, inside the
       * corners. Its box is positioned from the padding edge of the card, so the border comes off.
       */
      const border = Number.parseFloat(style.borderTopWidth) || 0;
      const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;
      const length = side === 'top' || side === 'bottom' ? width : height;
      const center = side === 'top' || side === 'bottom' ? cx - x : cy - y;
      const min = Math.max(radius - border, 0);
      const max = Math.max(length - 2 * border - radius - arrowWidth, min);
      const along = Math.min(Math.max(center - border - arrowWidth / 2, min), max);
      this.drawArrow(card, side, along);
    }
  }

  /* ----- render -------------------------------------------------------------- */

  private readonly onMediaChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    const has = slot.assignedNodes({ flatten: true }).length > 0;
    if (has !== this.hasMedia) {
      this.hasMedia = has;
      this.requestUpdate();
    }
  };

  protected override render(): TemplateResult {
    const drawable = this.drawable;
    const description = text(this.description);
    const meta = text(this.meta);
    const metaTitle = text(this.metaTitle);
    return html`<a
        class="link"
        href=${this.safeHref ? text(this.href) : nothing}
        @pointerenter=${this.onLinkEnter}
        @pointerleave=${this.onLinkLeave}
        @pointerdown=${this.onLinkPointerDown}
        @focus=${this.onLinkFocus}
        @blur=${this.onLinkBlur}
        ><slot></slot></a
      ><div
        class="card"
        popover="manual"
        @pointerenter=${this.onCardEnter}
        @pointerleave=${this.onCardLeave}
      >
        ${drawable
          ? html`<div class="media" ?hidden=${!this.hasMedia}>
                <slot name="media" @slotchange=${this.onMediaChange}></slot>
              </div>
              <span class="probe" aria-hidden="true"></span>
              <div class="heading">${text(this.heading)}</div>
              ${description === '' ? nothing : html`<div class="description">${description}</div>`}
              ${meta === ''
                ? nothing
                : html`<div class="meta">
                    <nph-icon class="meta-icon" name=${text(this.metaIcon)} size="sm" aria-hidden="true"></nph-icon>
                    <span class="meta-text" title=${metaTitle === '' ? nothing : metaTitle}>${meta}</span>
                  </div>`}
              ${this.arrow
                ? html`<svg class="arrow" aria-hidden="true" focusable="false"><path /></svg>`
                : nothing}`
          : nothing}
      </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphHoverCard);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-hover-card': NphHoverCard;
  }
}
