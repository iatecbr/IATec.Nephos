/**
 * `nph-skeleton` — the still shape that holds the place of content while it loads.
 *
 * Contract accepted in Figma (frame `1578:38`, set `1578:37`) and P69:
 * - `shape` `line` (default), `block`, `avatar-sm`, `avatar-md` or `avatar-lg`. It
 *   is the Figma property `forma`. `line` is the place of a text line, `block` of
 *   an image, chart or area, and `avatar-*` of an `nph-avatar` of the same size;
 * - a rectangle in `skeleton/background` (`color/skeleton`), with no border, no text and no animation. The
 *   piece is still: there is no pulse to reduce under reduced motion;
 * - the line is a box of `skeleton/line-box-height` with no fill, and the bar of
 *   `skeleton/line-height` is centered in it (DSA-127, Figma `1578:31`); the space between lines comes
 *   from the consumer. The line and the block stretch to the container width. The
 *   block height follows the content that will come in, so the consumer gives it;
 * - the avatar takes `avatar/size-*` and `avatar/radius-*`, like `nph-avatar`;
 * - decorative: outside the accessibility tree, no focus, no text. The loading
 *   container, not this piece, carries `aria-busy`;
 * - invalid `shape` does not render and emits `console.error` only in
 *   development, with no visual fallback (P69, same rule as P66).
 */
import { LitElement, html, nothing, unsafeCSS, type TemplateResult } from 'lit';

import skeletonCss from './nph-skeleton.css?inline';

const TAG = 'nph-skeleton';

/** Internal mark, not API: present only when the shape is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_SKELETON_SHAPES = ['line', 'block', 'avatar-sm', 'avatar-md', 'avatar-lg'] as const;
export type NphSkeletonShape = (typeof NPH_SKELETON_SHAPES)[number];

function isShape(value: string): value is NphSkeletonShape {
  return (NPH_SKELETON_SHAPES as readonly string[]).includes(value);
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphSkeleton extends LitElement {
  static override styles = unsafeCSS(skeletonCss);

  static override properties = {
    /* `shape` reflects because the internal CSS selects the box by it. */
    shape: { type: String, reflect: true },
  };

  /** `line` by default. */
  declare shape: NphSkeletonShape;

  constructor() {
    super();
    this.shape = 'line';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
  }

  protected override willUpdate(): void {
    const shape = this.shape ?? '';
    const valid = isShape(shape);
    if (!valid) {
      devError(`shape "${shape}" does not exist. Use ${NPH_SKELETON_SHAPES.map((value) => `"${value}"`).join(', ')}.`);
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
  }

  /** Only the line draws an inner bar; the other shapes paint the host itself. */
  protected override render(): TemplateResult | typeof nothing {
    return this.shape === 'line' ? html`<span class="bar"></span>` : nothing;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSkeleton);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-skeleton': NphSkeleton;
  }
}
