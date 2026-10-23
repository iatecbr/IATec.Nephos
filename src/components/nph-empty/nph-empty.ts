/**
 * `nph-empty` — the empty state of an area with no content.
 *
 * Contract accepted in Figma (board `1463:25260`, frame `2003:688`, component
 * `1463:25238`), recorded as text in the evidence of the `figma-docs-accepted` gate of
 * DSA-40, and decision P84:
 * - an illustration, a title that says what is missing and a description that says what
 *   to do. One component, with no variant;
 * - `heading` is the Figma property `título`, required. It is not `title`, the global
 *   HTML attribute, which the browser shows as a native tooltip;
 * - `description` is the Figma property `descrição`. The boolean `texto da descrição` is
 *   not a property: it is the presence of a non-empty `description`, as `texto` is the
 *   presence of `text` in `nph-togglebutton` (P73);
 * - the illustration is not chosen by hand. Both files are rendered, stacked, and the
 *   scheme flags `scheme/is-light` and `scheme/is-dark` (1 or 0) set their opacity, so the
 *   one made for the current color scheme is the one that shows;
 * - the piece has no action, no focus, no slot, no event and no `::part`. Loading is the
 *   state of the piece that receives it, not of this one;
 * - accessibility: the host has no role; the title and the description are plain text and
 *   are read; the illustration is decorative, `alt=""` and `aria-hidden`. Announcing that a
 *   search found nothing belongs to the piece that receives the `nph-empty`;
 * - invalid input: with no `heading` (empty or only spaces) the piece draws nothing and
 *   emits `console.error` only in development, with no visual fallback (the rule of P21,
 *   adopted by P84 as in P66 and P69).
 *
 * The two illustration files ship as files of the package, not inlined: `?no-inline`
 * makes the library build emit them next to the code and point to them with
 * `new URL(..., import.meta.url)` (P84).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import emptyCss from './nph-empty.css?inline';
import illustrationLight from '../../../assets/illustrations/empty-no-option-found.png?no-inline';
import illustrationDark from '../../../assets/illustrations/empty-no-option-found-dark.png?no-inline';

const TAG = 'nph-empty';

/** Internal mark, not API: present only when the piece has a heading. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

/** The text with the spaces at both ends removed; `null` and `undefined` become empty. */
function trimmed(value: string | null | undefined): string {
  return (value ?? '').trim();
}

export class NphEmpty extends LitElement {
  static override styles = unsafeCSS(emptyCss);

  static override properties = {
    heading: { type: String },
    description: { type: String },
  };

  /** What is missing. Required: without it the piece draws nothing. */
  declare heading: string;

  /** What the person can do. Optional: empty, only the heading shows. */
  declare description: string;

  constructor() {
    super();
    this.heading = '';
    this.description = '';
  }

  protected override willUpdate(): void {
    const valid = trimmed(this.heading) !== '';
    if (!valid) {
      devError('"heading" is required: it says what is missing. The piece draws nothing without it.');
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
  }

  protected override render(): TemplateResult | typeof nothing {
    const heading = trimmed(this.heading);
    if (heading === '') return nothing;
    const description = trimmed(this.description);
    return html`
      <div class="illustration">
        <img class="light" src=${illustrationLight} alt="" aria-hidden="true" width="120" height="87" decoding="async" />
        <img class="dark" src=${illustrationDark} alt="" aria-hidden="true" width="120" height="87" decoding="async" />
      </div>
      <div class="text">
        <p class="heading">${heading}</p>
        ${description === '' ? nothing : html`<p class="description">${description}</p>`}
      </div>
    `;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphEmpty);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-empty': NphEmpty;
  }
}
