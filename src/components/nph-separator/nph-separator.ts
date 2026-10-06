/**
 * `nph-separator` — the decorative one-line divider.
 *
 * Contract accepted in Figma (frame `1196:674`, set `762:6`) and P66:
 * - `orientation` `horizontal` (default) or `vertical`. Horizontal between
 *   stacked items; vertical between side-by-side items;
 * - one line of `border/width` in `color/border`. Thickness and color do not
 *   change: the divider carries no state;
 * - the instance fills the container. Horizontal fills the width in a block
 *   parent or column flex parent; vertical fills the height in a row flex
 *   parent or grid. Otherwise, the consumer gives the length;
 * - decorative: outside the accessibility tree, no focus, no text;
 * - invalid `orientation` does not render and emits `console.error` only in
 *   development, with no visual fallback.
 */
import { LitElement, unsafeCSS } from 'lit';

import separatorCss from './nph-separator.css?inline';

const TAG = 'nph-separator';

/** Internal mark, not API: present only when the orientation is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_SEPARATOR_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type NphSeparatorOrientation = (typeof NPH_SEPARATOR_ORIENTATIONS)[number];

function isOrientation(value: string): value is NphSeparatorOrientation {
  return (NPH_SEPARATOR_ORIENTATIONS as readonly string[]).includes(value);
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphSeparator extends LitElement {
  static override styles = unsafeCSS(separatorCss);

  static override properties = {
    /* `orientation` reflects because the internal CSS selects the line by it. */
    orientation: { type: String, reflect: true },
  };

  /** `horizontal` by default. */
  declare orientation: NphSeparatorOrientation;

  constructor() {
    super();
    this.orientation = 'horizontal';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
  }

  protected override willUpdate(): void {
    const orientation = this.orientation ?? '';
    const valid = isOrientation(orientation);
    if (!valid) {
      devError(`orientation "${orientation}" does not exist. Use "horizontal" or "vertical".`);
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSeparator);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-separator': NphSeparator;
  }
}
