/**
 * `nph-carousel` — a strip of slides where one part shows at a time, and the person moves on with
 * arrows, indicators or by dragging.
 *
 * Contract accepted in Figma (documentation frame `5173:1429`, root `5164:663`, sets `5165:1094`,
 * `5164:771` and `5164:687`), recorded as text in the evidence of the `figma-docs-accepted` gate of
 * DSA-87, sheet `fichas/nph-carousel.md` and decision P129 — nph-carousel: API and semantics. It
 * follows the WAI-ARIA APG Carousel pattern, with the indicators as a tab group:
 * - ONE tag. The Figma has no slide component: the slides are the direct element children of the
 *   carousel, with free content. The carousel puts each one in its own slide box in the shadow root
 *   by MANUAL slot assignment, so it writes no attribute on a child;
 * - `layout` (the Figma `layout`): `single` (default, `único`, one whole slide), `several` (`vários`,
 *   as many whole slides as fit the container width, at least one) or `peek` (`espiada`, the whole
 *   current slide and the edge of the neighbor, `carousel/peek-size` wide). Reflects, because the
 *   internal CSS selects the slide width by it;
 * - `index`: the first slide in view, from zero. In `single` and `peek` it is the current slide; in
 *   `several` the current page is derived from it, so a resize never rewrites it and never fires an
 *   event. Reflects. A value out of range shows the nearest slide and the property keeps what was written;
 * - own event `nph-slide-change` (bubbles, composed), `detail: { index }`, fired only when the person
 *   changes the slide by arrow, indicator, key or drag, never when code writes `index`;
 * - no wrap-around: the arrow on the side with no slide is disabled (native `disabled`, out of the
 *   Tab order, as the task DSA-87 asks) and, when it had the focus, the focus goes to the current
 *   indicator, or to the other arrow;
 * - `hide-arrows` and `hide-indicators`: both are on by default in Figma, so the properties turn
 *   them off (precedent: `hide-collapse-button` of `nph-resizable`). `counter` shows "position of
 *   total", off by default. Above five pages the indicators go off and the counter comes on by
 *   itself (decision 10 of the approval round); in `several` it counts pages. With a single page
 *   there is nothing to go through, so no controls bar is drawn;
 * - names, already localized by the product or, without them, by the `lang` nearest to the
 *   carousel (Portuguese, the default, English or Spanish, as `nph-tabs`, P127): `label` or the host
 *   `aria-label` names the region; `previous-label`, `next-label`, `indicators-label`,
 *   `slide-label`, `page-label` and `position-label` replace the default names. The three last ones
 *   are templates with the placeholders `{position}` and `{total}`;
 * - the transition of the strip uses `motion/state-duration` and `motion/state-easing` and is
 *   instant under `prefers-reduced-motion`. Drag or swipe on the track moves one step per gesture
 *   (a quarter of a step, or a quick flick); arrows or indicators stay the way that needs no drag;
 * - no automatic rotation, no vertical carousel, no thumbnails and no wrap-around in v1;
 * - no `::part`, no color property, no form association;
 * - invalid input does not render and emits `console.error` only in development, one per cause
 *   (the rule of P21): `layout` outside the three values. A problem in the composition renders anyway
 *   and emits `console.warn` only in development: fewer than two slides, a region with no name, both
 *   arrows and indicators off, and indicators off with no counter.
 *
 * SEMANTICS — a `region` with `aria-roledescription="carousel"`; the track is `aria-live="polite"`;
 * the indicators are a `tablist` of native buttons with `role="tab"`, `aria-selected` and
 * `aria-controls`; each slide is a `tabpanel` named "position of total" with
 * `aria-roledescription="slide"` (a `group` when there are no indicators); a slide that is not in
 * view is `inert`, so its content leaves the Tab order and the accessibility tree.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import carouselCss from './nph-carousel.css?inline';

const TAG = 'nph-carousel';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The event the carousel fires when the person changes the slide. */
export const NPH_CAROUSEL_SLIDE_CHANGE_EVENT = 'nph-slide-change';

export const NPH_CAROUSEL_LAYOUTS = ['single', 'several', 'peek'] as const;
export type NphCarouselLayout = (typeof NPH_CAROUSEL_LAYOUTS)[number];

export interface NphCarouselSlideChangeDetail {
  /** The first slide in view, from zero. */
  readonly index: number;
}

/** Above this number of pages the indicators go off and the counter comes on (decision 10). */
export const NPH_CAROUSEL_MAX_INDICATORS = 5;

/** A drag shorter than this, in pixels, is a click and moves nothing. */
export const NPH_CAROUSEL_DRAG_SLOP = 6;
/** A drag of this fraction of a step changes the slide. */
export const NPH_CAROUSEL_DRAG_FRACTION = 0.25;
/** A flick faster than this, in pixels per millisecond, changes the slide, with at least `NPH_CAROUSEL_FLICK_DISTANCE`. */
export const NPH_CAROUSEL_FLICK_VELOCITY = 0.4;
export const NPH_CAROUSEL_FLICK_DISTANCE = 10;
/** Past the ends, the strip follows the pointer by this fraction only. */
const RESISTANCE = 0.3;

/* The default names are Portuguese and Spanish on purpose (P127): the spelling proof reads English only. */
/* cspell:disable */
/** The default names, by language: the `lang` nearest to the carousel decides (P127). */
const NAMES = {
  pt: {
    previous: 'Slide anterior',
    next: 'Próximo slide',
    indicators: 'Escolher o slide',
    slide: 'Slide {position} de {total}',
    page: 'Ir para a página {position}',
    position: '{position} de {total}',
  },
  en: {
    previous: 'Previous slide',
    next: 'Next slide',
    indicators: 'Choose a slide',
    slide: 'Slide {position} of {total}',
    page: 'Go to page {position}',
    position: '{position} of {total}',
  },
  es: {
    previous: 'Diapositiva anterior',
    next: 'Diapositiva siguiente',
    indicators: 'Elegir una diapositiva',
    slide: 'Diapositiva {position} de {total}',
    page: 'Ir a la página {position}',
    position: '{position} de {total}',
  },
} as const;
/* cspell:enable */
type NameKey = keyof (typeof NAMES)['en'];

/** The elements a drag must leave to themselves: text fields and anything editable. */
const DRAG_EXEMPT = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

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

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isLayout(value: string): value is NphCarouselLayout {
  return (NPH_CAROUSEL_LAYOUTS as readonly string[]).includes(value);
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(Math.max(value, low), high);
}

/** A template with `{position}` and `{total}` filled in. */
function fill(template: string, position: number, total: number): string {
  return template.replaceAll('{position}', String(position)).replaceAll('{total}', String(total));
}

/** One control the focus can sit on, and what the carousel needs to know to hand it over. */
type Control = HTMLElement & { disabled?: boolean };

export class NphCarousel extends LitElement {
  static override styles = unsafeCSS(carouselCss);

  /* The slides are the children of the host, and the carousel puts each one in its box by hand: it writes no `slot` attribute on a child. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, slotAssignment: 'manual' as const };

  static override properties = {
    /* Reflected: the internal CSS selects the slide width by the layout. */
    layout: { type: String, reflect: true },
    index: { type: Number, reflect: true },
    hideArrows: { type: Boolean, attribute: 'hide-arrows' },
    hideIndicators: { type: Boolean, attribute: 'hide-indicators' },
    counter: { type: Boolean },
    label: { type: String },
    /* The host `aria-label` is the accessible name when there is no `label`. It cannot be a property
     * called `ariaLabel`: that name is the native ARIA reflection of every element. */
    hostName: { type: String, attribute: 'aria-label' },
    previousLabel: { type: String, attribute: 'previous-label' },
    nextLabel: { type: String, attribute: 'next-label' },
    indicatorsLabel: { type: String, attribute: 'indicators-label' },
    slideLabel: { type: String, attribute: 'slide-label' },
    pageLabel: { type: String, attribute: 'page-label' },
    positionLabel: { type: String, attribute: 'position-label' },
    perPage: { state: true },
    dragging: { state: true },
  };

  /** `single`, `several` or `peek`. */
  declare layout: NphCarouselLayout;
  /** The first slide in view, from zero. */
  declare index: number;
  /** Turns both arrows off. */
  declare hideArrows: boolean;
  /** Turns the indicators off. */
  declare hideIndicators: boolean;
  /** Shows "position of total" after the next arrow. */
  declare counter: boolean;
  /** The accessible name of the region. Already localized. */
  declare label: string | null;
  /** The host `aria-label`, the accessible name when `label` is not given. */
  declare hostName: string | null;
  declare previousLabel: string | null;
  declare nextLabel: string | null;
  declare indicatorsLabel: string | null;
  declare slideLabel: string | null;
  declare pageLabel: string | null;
  declare positionLabel: string | null;
  /** How many whole slides fit in a page. Measured in `several`, one elsewhere. Not API. */
  declare protected perPage: number;
  declare protected dragging: boolean;

  private valid = false;
  private reportedError = '';
  private shownWarnings = new Set<string>();
  /** The slides are direct children: a child that comes or goes. */
  private readonly childObserver = new MutationObserver(() => this.requestUpdate());
  private resizeObserver: ResizeObserver | undefined;
  private observed: Element[] = [];
  /** Watches the `dir` of the host and of every parent: a new direction moves nothing that a resize would tell. */
  private directionObserver: MutationObserver | undefined;
  /** The control that holds the focus, so the focus can be handed over when it stops being focusable. */
  private focused: Control | null = null;
  private placed = false;
  private pointer: {
    id: number;
    startX: number;
    startY: number;
    lastX: number;
    lastTime: number;
    velocity: number;
    baseOffset: number;
    captured: boolean;
  } | null = null;
  private suppressClick = false;

  constructor() {
    super();
    this.layout = 'single';
    this.index = 0;
    this.hideArrows = false;
    this.hideIndicators = false;
    this.counter = false;
    this.label = null;
    this.hostName = null;
    this.previousLabel = null;
    this.nextLabel = null;
    this.indicatorsLabel = null;
    this.slideLabel = null;
    this.pageLabel = null;
    this.positionLabel = null;
    this.perPage = 1;
    this.dragging = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.childObserver.observe(this, { childList: true });
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    /* The font changes the width of the text once it loads. */
    document.fonts?.ready.then(() => this.onResize());
    this.directionObserver = new MutationObserver(() => this.requestUpdate());
    for (let node: Element | null = this; node !== null; node = this.parentOf(node)) {
      this.directionObserver.observe(node, { attributes: true, attributeFilter: ['dir'] });
    }
    /* A carousel moved to another place observes its parts again: the observers were disconnected when it left. */
    if (this.hasUpdated) this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.childObserver.disconnect();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.observed = [];
    this.directionObserver?.disconnect();
    this.directionObserver = undefined;
    this.pointer = null;
  }

  /* ----- the model ---------------------------------------------------------------------------- */

  private get slides(): HTMLElement[] {
    return [...this.children] as HTMLElement[];
  }

  private get count(): number {
    return this.children.length;
  }

  private get perPageNow(): number {
    return this.layout === 'several' ? Math.max(1, this.perPage) : 1;
  }

  private get pageCount(): number {
    return this.count === 0 ? 0 : Math.ceil(this.count / this.perPageNow);
  }

  /** The first slide of a page; the last page is aligned to the end, so it always shows whole slides. */
  private startOf(page: number): number {
    return Math.min(page * this.perPageNow, Math.max(0, this.count - this.perPageNow));
  }

  /** The current page, derived from the first slide in view. */
  private get page(): number {
    const index = Number.isFinite(this.index) ? Math.floor(this.index) : 0;
    const slide = clamp(index, 0, Math.max(0, this.count - 1));
    const last = Math.max(0, this.pageCount - 1);
    /* The last page is aligned to the end, so it also holds the slides before its own multiple. */
    if (slide >= this.startOf(last)) {
      return last;
    }
    return Math.min(Math.floor(slide / this.perPageNow), last);
  }

  /** The first slide that shows now. */
  private get shownStart(): number {
    return this.startOf(this.page);
  }

  private get indicatorsShown(): boolean {
    return !this.hideIndicators && this.pageCount >= 2 && this.pageCount <= NPH_CAROUSEL_MAX_INDICATORS;
  }

  private get counterShown(): boolean {
    return this.pageCount >= 2 && (this.counter || this.pageCount > NPH_CAROUSEL_MAX_INDICATORS);
  }

  private get arrowsShown(): boolean {
    return !this.hideArrows && this.pageCount >= 2;
  }

  private isRtl(): boolean {
    return getComputedStyle(this).direction === 'rtl';
  }

  /** The parent in the flat tree: a shadow root leads to its host. */
  private parentOf(element: Element): Element | null {
    if (element.parentElement !== null) {
      return element.parentElement;
    }
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root.host : null;
  }

  /* ----- names -------------------------------------------------------------------------------- */

  private name(): string | null {
    const label = trimmed(this.label);
    if (label !== '') return label;
    const host = trimmed(this.hostName);
    return host === '' ? null : host;
  }

  /** The language of the default names: the `lang` nearest to the carousel, through shadow roots. */
  private language(): keyof typeof NAMES {
    for (let node: Element | null = this; node !== null; node = this.parentOf(node)) {
      const lang = trimmed(node.getAttribute('lang')).toLowerCase();
      if (lang !== '') {
        return /^es(-|_|$)/.test(lang) ? 'es' : /^en(-|_|$)/.test(lang) ? 'en' : 'pt';
      }
    }
    return 'pt';
  }

  private nameOf(key: NameKey): string {
    const given: Record<NameKey, string | null> = {
      previous: this.previousLabel,
      next: this.nextLabel,
      indicators: this.indicatorsLabel,
      slide: this.slideLabel,
      page: this.pageLabel,
      position: this.positionLabel,
    };
    const own = trimmed(given[key]);
    return own !== '' ? own : NAMES[this.language()][key];
  }

  /* ----- validation and measuring ------------------------------------------------------------- */

  protected override willUpdate(): void {
    const layout = this.layout ?? '';
    this.valid = isLayout(layout);
    if (!this.valid) {
      const message = `layout "${layout}" does not exist. Use ${NPH_CAROUSEL_LAYOUTS.join(', ')}.`;
      if (message !== this.reportedError) {
        devError(message);
      }
      this.reportedError = message;
    } else {
      this.reportedError = '';
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  /** Composition problems: they render anyway, and each shows once while it lasts. */
  private checkComposition(): void {
    const warnings = new Set<string>();
    if (this.count < 2) {
      warnings.add('fewer than two slides: a carousel needs at least two. With two, prefer to show them together.');
    }
    if (this.name() === null) {
      warnings.add('the carousel has no accessible name. Give it a `label` or an `aria-label`.');
    }
    if (this.pageCount >= 2) {
      if (!this.arrowsShown && !this.indicatorsShown) {
        warnings.add('arrows and indicators are both off: only dragging is left, which not everyone can do. Keep one of them on.');
      }
      if (this.hideIndicators && !this.counterShown) {
        warnings.add('the indicators are off and so is the counter: the person does not know where they are. Turn `counter` on.');
      }
    }
    for (const warning of warnings) {
      if (!this.shownWarnings.has(warning)) {
        devWarn(warning);
      }
    }
    this.shownWarnings = warnings;
  }

  private get track(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('.track');
  }

  private get strip(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('.strip');
  }

  private get boxes(): HTMLElement[] {
    return [...this.renderRoot.querySelectorAll<HTMLElement>('.slide')];
  }

  /** The gap between slides, in pixels, as the CSS resolves it. */
  private gap(): number {
    const strip = this.strip;
    return strip === null ? 0 : Number.parseFloat(getComputedStyle(strip).columnGap) || 0;
  }

  /** How many whole slides fit the track: the widest slide decides, at least one. */
  private measurePerPage(): number {
    const track = this.track;
    if (track === null || this.layout !== 'several') {
      return 1;
    }
    const widest = Math.max(0, ...this.boxes.map((box) => box.offsetWidth));
    if (widest <= 0) {
      return 1;
    }
    const gap = this.gap();
    return Math.max(1, Math.floor((track.clientWidth + gap) / (widest + gap)));
  }

  private onResize(): void {
    if (!this.valid) {
      return;
    }
    const perPage = this.measurePerPage();
    if (perPage !== this.perPage) {
      this.perPage = perPage;
    }
    this.place();
  }

  /** The distance, from the start edge of the strip, where a slide starts; independent of the current transform. */
  private distanceOf(box: HTMLElement, strip: HTMLElement, rtl: boolean): number {
    const slide = box.getBoundingClientRect();
    const all = strip.getBoundingClientRect();
    return rtl ? all.right - slide.right : slide.left - all.left;
  }

  /** The offset of the strip that puts the first slide in view at the start edge, kept inside the strip. */
  private targetOffset(): number {
    const track = this.track;
    const strip = this.strip;
    const box = this.boxes[this.shownStart];
    if (track === null || strip === null || box === undefined) {
      return 0;
    }
    const rtl = this.isRtl();
    const max = Math.max(0, strip.offsetWidth - track.clientWidth);
    return clamp(this.distanceOf(box, strip, rtl), 0, max);
  }

  private transformFor(offset: number): string {
    return `translate3d(${String(this.isRtl() ? offset : -offset)}px, 0, 0)`;
  }

  /** Puts the strip where the current slide is. Not while the pointer drags it. */
  private place(): void {
    const strip = this.strip;
    if (strip === null || this.pointer?.captured === true) {
      return;
    }
    strip.style.transform = this.transformFor(this.targetOffset());
    if (!this.placed) {
      /* The first placement does not animate: the strip starts where it is. */
      this.placed = true;
      requestAnimationFrame(() => this.toggleAttribute('data-nph-ready', true));
    }
  }

  protected override updated(): void {
    if (!this.valid) {
      return;
    }
    /* The slides reach their boxes by hand. */
    const boxes = this.renderRoot.querySelectorAll<HTMLSlotElement>('slot');
    const slides = this.slides;
    boxes.forEach((slot, index) => {
      const element = slides[index];
      if (element !== undefined) {
        slot.assign(element);
      }
    });
    this.observeParts();
    const perPage = this.measurePerPage();
    if (perPage !== this.perPage) {
      this.perPage = perPage;
    }
    this.place();
    this.checkComposition();
    this.keepFocus();
  }

  /** The parts the size depends on: the track and every slide box. */
  private observeParts(): void {
    if (this.resizeObserver === undefined) {
      return;
    }
    const targets = [this.track, ...this.boxes].filter((node): node is HTMLElement => node !== null);
    const same = targets.length === this.observed.length && targets.every((node, index) => node === this.observed[index]);
    if (!same) {
      this.resizeObserver.disconnect();
      for (const target of targets) {
        this.resizeObserver.observe(target);
      }
      this.observed = targets;
    }
  }

  /* ----- focus -------------------------------------------------------------------------------- */

  /** The control that takes the focus when the one that had it stops being focusable: the current indicator, or the other arrow. */
  private fallback(from: Control): Control | null {
    const current = this.renderRoot.querySelector<Control>('.tab[tabindex="0"]');
    if (current !== null) {
      return current;
    }
    const arrows = [...this.renderRoot.querySelectorAll<Control>('.arrow')].filter((arrow) => arrow !== from && arrow.disabled !== true);
    return arrows[0] ?? null;
  }

  /**
   * An arrow that becomes disabled, or an indicator that goes away, takes the focus with it. The focus goes to the
   * current indicator, or to the other arrow, so it is not lost (APG, focusability of disabled controls).
   */
  private keepFocus(): void {
    const control = this.focused;
    if (control === null) {
      return;
    }
    const gone = !control.isConnected || control.disabled === true;
    if (!gone) {
      return;
    }
    this.focused = null;
    const next = this.fallback(control);
    if (next !== null) {
      /* The button inside `nph-button` is enabled in its own update. */
      const ready = (next as Control & { updateComplete?: Promise<unknown> }).updateComplete ?? Promise.resolve();
      void ready.then(() => {
        next.focus();
      });
    }
  }

  private controlOf(event: Event): Control | null {
    for (const node of event.composedPath()) {
      if (node instanceof HTMLElement && (node.classList.contains('arrow') || node.classList.contains('tab'))) {
        return node;
      }
    }
    return null;
  }

  private onFocusin(event: FocusEvent): void {
    this.focused = this.controlOf(event);
  }

  private onFocusout(event: FocusEvent): void {
    const control = this.focused;
    if (control === null) {
      return;
    }
    if (event.relatedTarget instanceof Node && !this.renderRoot.contains(event.relatedTarget)) {
      this.focused = null;
      return;
    }
    /*
     * A blur with nowhere to go is either the person leaving, or the control going away (removed, or disabled
     * by its own update). A frame later the control is still there, enabled and not focused only in the first case.
     */
    requestAnimationFrame(() => {
      if (this.focused === control && control.isConnected && control.disabled !== true && (this.renderRoot as ShadowRoot).activeElement !== control) {
        this.focused = null;
      }
    });
  }

  /* ----- moving ------------------------------------------------------------------------------- */

  /** Shows a page. Only a person's move fires the event; code writes `index` itself. */
  private goTo(page: number): void {
    const target = clamp(page, 0, Math.max(0, this.pageCount - 1));
    const start = this.startOf(target);
    if (start === this.shownStart) {
      /* The page is already the one that shows: the strip goes back to it (a short drag). */
      this.place();
      return;
    }
    this.index = start;
    this.dispatchEvent(
      new CustomEvent<NphCarouselSlideChangeDetail>(NPH_CAROUSEL_SLIDE_CHANGE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { index: start },
      }),
    );
  }

  /* ----- keys --------------------------------------------------------------------------------- */

  private tabButtons(): HTMLButtonElement[] {
    return [...this.renderRoot.querySelectorAll<HTMLButtonElement>('.tab')];
  }

  private onTabClick(page: number): void {
    this.goTo(page);
  }

  private onTabKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const last = this.pageCount - 1;
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      /* The arrow that points to the end of the line goes to the next slide, in either writing direction. */
      const forward = (event.key === 'ArrowRight') !== this.isRtl();
      next = clamp(this.page + (forward ? 1 : -1), 0, last);
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = last;
    } else {
      return;
    }
    event.preventDefault();
    this.goTo(next);
    this.tabButtons()[next]?.focus();
  }

  /* ----- drag --------------------------------------------------------------------------------- */

  /** The distance one gesture moves: one page. */
  private step(): number {
    const first = this.boxes[0];
    if (first === undefined) {
      return this.track?.clientWidth ?? 0;
    }
    return (first.offsetWidth + this.gap()) * this.perPageNow;
  }

  private onPointerDown(event: PointerEvent): void {
    if (this.pageCount < 2 || (event.pointerType === 'mouse' && event.button !== 0) || !event.isPrimary) {
      return;
    }
    if (event.composedPath().some((node) => node instanceof Element && node.matches(DRAG_EXEMPT))) {
      return;
    }
    this.pointer = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      baseOffset: this.targetOffset(),
      captured: false,
    };
  }

  /** Captures or releases the pointer; a pointer the browser does not know, such as a synthetic one, is left alone. */
  private capture(id: number, on: boolean): void {
    try {
      if (on) {
        this.track?.setPointerCapture(id);
      } else {
        this.track?.releasePointerCapture(id);
      }
    } catch {
      /* Capture only keeps the drag alive outside the track: without it the drag still works inside. */
    }
  }

  private onPointerMove(event: PointerEvent): void {
    const pointer = this.pointer;
    if (pointer === null || pointer.id !== event.pointerId) {
      return;
    }
    const moved = event.clientX - pointer.startX;
    if (!pointer.captured) {
      if (Math.abs(moved) < NPH_CAROUSEL_DRAG_SLOP || Math.abs(moved) < Math.abs(event.clientY - pointer.startY)) {
        return;
      }
      /* The pointer is captured only after the slop, so a click on a link in the slide is not broken. */
      pointer.captured = true;
      this.dragging = true;
      this.capture(event.pointerId, true);
    }
    const elapsed = event.timeStamp - pointer.lastTime;
    if (elapsed > 0) {
      pointer.velocity = (event.clientX - pointer.lastX) / elapsed;
    }
    pointer.lastX = event.clientX;
    pointer.lastTime = event.timeStamp;
    const strip = this.strip;
    const track = this.track;
    if (strip === null || track === null) {
      return;
    }
    const rtl = this.isRtl();
    const max = Math.max(0, strip.offsetWidth - track.clientWidth);
    /* In left-to-right text, dragging to the left moves the strip toward its end. */
    let offset = pointer.baseOffset - (rtl ? -moved : moved);
    if (offset < 0) offset *= RESISTANCE;
    if (offset > max) offset = max + (offset - max) * RESISTANCE;
    strip.style.transform = this.transformFor(offset);
  }

  private endDrag(event: PointerEvent, cancelled: boolean): void {
    const pointer = this.pointer;
    if (pointer === null || pointer.id !== event.pointerId) {
      return;
    }
    this.pointer = null;
    if (!pointer.captured) {
      return;
    }
    this.dragging = false;
    this.capture(event.pointerId, false);
    /* The click that follows the end of a drag is not a click. */
    this.suppressClick = true;
    setTimeout(() => {
      this.suppressClick = false;
    }, 0);
    if (cancelled) {
      this.place();
      return;
    }
    const moved = event.clientX - pointer.startX;
    /* Toward the end of the line: to the left in left-to-right text. */
    const toward = (this.isRtl() ? moved : -moved) > 0 ? 1 : -1;
    const speed = (this.isRtl() ? pointer.velocity : -pointer.velocity) * toward;
    const far = Math.abs(moved) >= this.step() * NPH_CAROUSEL_DRAG_FRACTION;
    const quick = speed >= NPH_CAROUSEL_FLICK_VELOCITY && Math.abs(moved) >= NPH_CAROUSEL_FLICK_DISTANCE;
    if (far || quick) {
      this.goTo(this.page + toward);
    } else {
      this.place();
    }
  }

  private onClickCapture(event: MouseEvent): void {
    if (this.suppressClick) {
      this.suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /* ----- rendering ---------------------------------------------------------------------------- */

  /** The slides a page shows, as the ids of their boxes: the tabs and the boxes live in the same shadow root, so ids are enough (P91). */
  private idsOfPage(page: number): string {
    const start = this.startOf(page);
    const ids: string[] = [];
    for (let slide = start; slide < Math.min(this.count, start + this.perPageNow); slide += 1) {
      ids.push(`slide-${String(slide)}`);
    }
    return ids.join(' ');
  }

  private renderArrow(previous: boolean, rtl: boolean): TemplateResult {
    const disabled = previous ? this.page <= 0 : this.page >= this.pageCount - 1;
    /* The arrow that points to the start of the line is the previous one in left-to-right text, and the next one in right-to-left. */
    const icon = previous !== rtl ? 'chevron-left' : 'chevron-right';
    return html`<nph-button
      class=${previous ? 'arrow arrow-previous' : 'arrow arrow-next'}
      severity="secondary"
      emphasis="solid"
      size="default"
      shape="circular"
      icon-start=${icon}
      label=${this.nameOf(previous ? 'previous' : 'next')}
      ?disabled=${disabled}
      @click=${() => this.goTo(this.page + (previous ? -1 : 1))}
    ></nph-button>`;
  }

  private renderTab(page: number): TemplateResult {
    const current = page === this.page;
    const total = this.pageCount;
    const several = this.layout === 'several';
    const name = several ? fill(this.nameOf('page'), page + 1, total) : fill(this.nameOf('slide'), page + 1, total);
    return html`<button
      class="tab"
      id=${`tab-${String(page)}`}
      type="button"
      role="tab"
      aria-selected=${current ? 'true' : 'false'}
      aria-controls=${this.idsOfPage(page)}
      aria-label=${name}
      tabindex=${current ? '0' : '-1'}
      @click=${() => this.onTabClick(page)}
    >
      <span class="marker" aria-hidden="true"></span>
    </button>`;
  }

  private renderControls(rtl: boolean): TemplateResult | typeof nothing {
    if (this.pageCount < 2) {
      return nothing;
    }
    const pages = [...Array(this.pageCount).keys()];
    return html`<div class="controls" @focusin=${(event: FocusEvent) => this.onFocusin(event)} @focusout=${(event: FocusEvent) => this.onFocusout(event)}>
      ${this.arrowsShown ? this.renderArrow(true, rtl) : nothing}
      ${this.indicatorsShown
        ? html`<div class="tabs" role="tablist" aria-label=${this.nameOf('indicators')} @keydown=${(event: KeyboardEvent) => this.onTabKeydown(event)}>
            ${pages.map((page) => this.renderTab(page))}
          </div>`
        : nothing}
      ${this.arrowsShown ? this.renderArrow(false, rtl) : nothing}
      ${this.counterShown
        ? html`<span class="counter">${fill(this.nameOf('position'), this.page + 1, this.pageCount)}</span>`
        : nothing}
    </div>`;
  }

  private renderSlide(index: number): TemplateResult {
    const start = this.shownStart;
    const visible = index >= start && index < start + this.perPageNow;
    const tabbed = this.indicatorsShown;
    return html`<div
      class="slide"
      id=${`slide-${String(index)}`}
      role=${tabbed ? 'tabpanel' : 'group'}
      aria-roledescription="slide"
      aria-label=${fill(this.nameOf('position'), index + 1, this.count)}
      ?inert=${!visible}
    >
      <slot></slot>
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const name = this.name();
    const rtl = this.isRtl();
    return html`<div
      class="root"
      role="region"
      aria-roledescription="carousel"
      aria-label=${name === null ? nothing : name}
      ?data-dragging=${this.dragging}
    >
      <div
        class="track"
        aria-live="polite"
        @pointerdown=${(event: PointerEvent) => this.onPointerDown(event)}
        @pointermove=${(event: PointerEvent) => this.onPointerMove(event)}
        @pointerup=${(event: PointerEvent) => this.endDrag(event, false)}
        @pointercancel=${(event: PointerEvent) => this.endDrag(event, true)}
        @click=${{ handleEvent: (event: MouseEvent) => this.onClickCapture(event), capture: true }}
        @dragstart=${(event: DragEvent) => event.preventDefault()}
      >
        <div class="strip">${this.slides.map((_slide, index) => this.renderSlide(index))}</div>
      </div>
      ${this.renderControls(rtl)}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphCarousel);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-carousel': NphCarousel;
  }
  interface HTMLElementEventMap {
    'nph-slide-change': CustomEvent<NphCarouselSlideChangeDetail>;
  }
}
