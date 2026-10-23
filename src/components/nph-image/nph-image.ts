/**
 * `nph-image` — the image of a product, file or content in a fixed area, with loading,
 * empty and error states.
 *
 * Contract accepted in Figma (frame `2677:465` of board `2573:66090`, set `2573:66089`),
 * sheet `fichas/nph-image.md`, `design.md` and decision P90 — nph-image: API and semantics:
 * - `size`: `xs` (default, as in Figma), `sm`, `md`, `lg`, `xl`, `2xl` or `media`, the Figma
 *   `tamanho` (`mídia` is `media`). Reflects, because the internal CSS selects the box by
 *   it. The five named sizes and `xs` are squares of `image/size-*`; `media` takes the
 *   content width `image/media-width`;
 * - `ratio`: `1:1` (default), `4:3` or `16:9`, the Figma `proporção`. Reflects. Only
 *   `media` uses it; every other size is always square and ignores it, with no warning;
 * - `src`: the image address. There is no property for the Figma `estado` of the content:
 *   it derives from `src`. No `src` (after trim) is empty; a `src` waits (loading) until
 *   `load` shows it (loaded) or `error` fails it (error). A new `src` starts the wait
 *   again. The read-only `status` says which (`empty`, `loading`, `loaded`, `error`), and
 *   the host repeats the native `load` and `error` of the inner image (not bubbling, as the
 *   native ones), so the parent can write the text that explains a failure;
 * - `alt`: the accessible name, the description of the content. Empty or whitespace-only
 *   hides the image from the screen reader (`aria-hidden="true"` on the host); with text,
 *   the host takes `role="img"` and `aria-label`. The name holds in every state: the text
 *   that explains a failure belongs to the parent. The inner `<img>` always has `alt=""`;
 * - `interactive`: the image is clickable. The piece then draws an inner native
 *   `<button type="button">` that fills the frame, takes the focus (`delegatesFocus`) and
 *   carries the name in `aria-label`; the host has no role. Hover over a loaded image shows
 *   the veil `image/overlay` with the `nph-icon` `eye` in `image/on-overlay`; keyboard
 *   focus draws the ring `image/focus-border` in `focus/ring-width`. The click is the
 *   native `click` of the button. Without `interactive`, there is no hover or focus look
 *   and the piece is never focusable;
 * - `disabled`: the whole piece at `state/disabled-opacity`; with `interactive`, the inner
 *   button is natively `disabled` (out of the Tab order, no click, no veil);
 * - the spinner is the `nph-spinner` in `image/foreground`, shown only while loading, and
 *   the loading frame has no border. The Figma `giro` is the spinner's own rotation;
 * - empty and error draw the frame only: the illustrations are image assets that are not
 *   in the repository yet (pending decision D1 of DSA-51), so the two states look alike;
 * - no slot, no `::part`, no `nph-*` event, no form association;
 * - invalid `size` or `ratio` does not render and emits `console.error` only in
 *   development, one per cause (P90, same rule as P21, P66 and P74). `interactive`
 *   without `alt` renders and emits one `console.warn` in development.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import '../nph-spinner/nph-spinner';
import imageCss from './nph-image.css?inline';

const TAG = 'nph-image';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_IMAGE_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'media'] as const;
export type NphImageSize = (typeof NPH_IMAGE_SIZES)[number];

export const NPH_IMAGE_RATIOS = ['1:1', '4:3', '16:9'] as const;
export type NphImageRatio = (typeof NPH_IMAGE_RATIOS)[number];

/** Where the image is: no address, waiting for it, drawn, or failed. */
export type NphImageStatus = 'empty' | 'loading' | 'loaded' | 'error';

/** The `nph-icon` size of the hover eye, by image size: the three `image/icon-size-*`. */
export const NPH_IMAGE_EYE_SIZE: Record<NphImageSize, 'sm' | 'md' | 'lg'> = {
  xs: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'md',
  xl: 'lg',
  '2xl': 'lg',
  media: 'lg',
};

/** The `nph-spinner` size by image size: the spinner has only `sm` and `md`. */
export const NPH_IMAGE_SPINNER_SIZE: Record<NphImageSize, 'sm' | 'md'> = {
  xs: 'sm',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'md',
  '2xl': 'md',
  media: 'md',
};

export function isSize(value: string): value is NphImageSize {
  return (NPH_IMAGE_SIZES as readonly string[]).includes(value);
}

export function isRatio(value: string): value is NphImageRatio {
  return (NPH_IMAGE_RATIOS as readonly string[]).includes(value);
}

/** The address the image gets: `src` without surrounding spaces, empty when missing. */
function normalizeSrc(src: string | null | undefined): string {
  return (src ?? '').trim();
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

/** Development warning; outside a bundler with `import.meta.env`, it stays silent. */
function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

export class NphImage extends LitElement {
  static override styles = unsafeCSS(imageCss);

  /* Host focus goes to the inner native `<button>`, when there is one. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    /* `size` and `ratio` reflect because the internal CSS selects the box by them. */
    size: { type: String, reflect: true },
    ratio: { type: String, reflect: true },
    src: { type: String },
    alt: { type: String },
    /* `interactive` and `disabled` reflect because the internal CSS reads them. */
    interactive: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  /** `xs` by default, as in Figma. */
  declare size: NphImageSize;
  /** `1:1` by default. Only `media` uses it. */
  declare ratio: NphImageRatio;
  /** The image address. Without it, the piece draws the empty state. */
  declare src: string;
  /** Accessible name. Empty or whitespace-only hides the image from the screen reader. */
  declare alt: string;
  /** The image is clickable: an inner native button takes the focus and the click. */
  declare interactive: boolean;
  /** The whole piece at the disabled opacity; the inner button, when there is one, is disabled. */
  declare disabled: boolean;

  private valid = false;
  private sizeValid = false;
  private ratioValid = false;
  private loadStatus: 'loading' | 'loaded' | 'error' = 'loading';
  private warnedNoName = false;

  constructor() {
    super();
    this.size = 'xs';
    this.ratio = '1:1';
    this.src = '';
    this.alt = '';
    this.interactive = false;
    this.disabled = false;
  }

  /** The state drawn now. Read-only, not reflected: it derives from `src` and the load. */
  get status(): NphImageStatus {
    return normalizeSrc(this.src) === '' ? 'empty' : this.loadStatus;
  }

  protected override willUpdate(changed: PropertyValues): void {
    /* Each cause is checked again only when its own property changes, so an error does not
       repeat on other updates. */
    if (changed.has('size')) {
      const size = this.size ?? '';
      this.sizeValid = isSize(size);
      if (!this.sizeValid) {
        devError(`size "${size}" does not exist. Use ${NPH_IMAGE_SIZES.map((value) => `"${value}"`).join(', ')}.`);
      }
    }
    if (changed.has('ratio')) {
      const ratio = this.ratio ?? '';
      this.ratioValid = isRatio(ratio);
      if (!this.ratioValid) {
        devError(`ratio "${ratio}" does not exist. Use ${NPH_IMAGE_RATIOS.map((value) => `"${value}"`).join(', ')}.`);
      }
    }
    const valid = this.sizeValid && this.ratioValid;
    /* The image is drawn again when the piece becomes valid: the wait starts over. */
    if (valid && !this.valid) {
      this.loadStatus = 'loading';
    }
    this.valid = valid;
    this.toggleAttribute(RENDERED_ATTRIBUTE, valid);

    /* The wait starts over only when the address the image gets changes: `render` trims
       `src`, so a change in the surrounding spaces hands the same address to the same
       `<img>`, no new `load` or `error` comes, and the status must stay. On the first
       update the previous value is `undefined`, which counts as the empty address. */
    if (changed.has('src') && normalizeSrc(changed.get('src') as string | undefined) !== normalizeSrc(this.src)) {
      this.loadStatus = 'loading';
    }

    const named = (this.alt ?? '').trim() !== '';
    if (valid && this.interactive && !named) {
      if (!this.warnedNoName) {
        devWarn('an interactive image needs an alt: the button has no accessible name.');
        this.warnedNoName = true;
      }
    } else {
      this.warnedNoName = false;
    }
    this.applySemantics();
  }

  /**
   * Semantics on the HOST, as `nph-avatar`: it is what assistive technology sees. A
   * clickable image gives the name to its inner button and the host has no role.
   */
  private applySemantics(): void {
    const alt = (this.alt ?? '').trim();
    if (this.valid && this.interactive) {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.removeAttribute('aria-hidden');
    } else if (this.valid && alt !== '') {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', alt);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Only the `<img>` that is drawn now, with the address the image gets now, may set the
   * status. An image that was removed (`src` went A, empty, B) can still fire the `load` or
   * `error` of its pending request, and that late event must not touch the current image.
   */
  private onImageEvent(event: Event, status: 'loaded' | 'error'): void {
    const image = event.currentTarget as HTMLImageElement;
    if (image !== this.renderRoot.querySelector('img') || image.getAttribute('src') !== normalizeSrc(this.src)) {
      return;
    }
    this.loadStatus = status;
    this.requestUpdate();
    /* The parent writes the text that explains a failure, so it must hear about it: the host
       repeats the native `load` or `error` of the inner image, which does not cross the
       shadow root. Like the native one, it does not bubble. */
    this.dispatchEvent(new Event(status === 'loaded' ? 'load' : 'error'));
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const src = normalizeSrc(this.src);
    const status = this.status;
    /* The listeners come before `src`, so an image that is already cached is not missed. */
    const image =
      src === ''
        ? nothing
        : html`<img
            alt=""
            ?hidden=${status !== 'loaded'}
            @load=${(event: Event) => this.onImageEvent(event, 'loaded')}
            @error=${(event: Event) => this.onImageEvent(event, 'error')}
            src=${src}
          />`;
    const spinner =
      status === 'loading' ? html`<nph-spinner size=${NPH_IMAGE_SPINNER_SIZE[this.size]}></nph-spinner>` : nothing;
    /* The border is an overlay after the content, so it paints over the image. */
    const border = html`<span class=${status === 'loading' ? 'border loading' : 'border'}></span>`;

    if (!this.interactive) {
      return html`${image}${spinner}${border}`;
    }
    const veil =
      status === 'loaded'
        ? html`<span class="veil"><nph-icon name="eye" size=${NPH_IMAGE_EYE_SIZE[this.size]}></nph-icon></span>`
        : nothing;
    const alt = (this.alt ?? '').trim();
    return html`<button
      class="control"
      type="button"
      aria-label=${alt === '' ? nothing : alt}
      ?disabled=${this.disabled}
    >
      ${image}${spinner}${veil}${border}
    </button>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphImage);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-image': NphImage;
  }
}
