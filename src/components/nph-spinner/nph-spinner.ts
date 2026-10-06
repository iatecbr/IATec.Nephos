/**
 * `nph-spinner` — the waiting spinner with no known end time.
 *
 * Contract accepted in Figma (frame `1195:22210`, set `281:11`) and P66:
 * - `size` `sm` (default) or `md`. `sm` inside a button or field; `md` in a
 *   content area. `lg` does not exist;
 * - optional `label`. With no text beside it, the spinner needs an accessible
 *   name; with text beside it, it is decorative and stays outside the
 *   accessibility tree;
 * - the drawing is the `circle-notch` of `nph-icon`, never custom art;
 * - spins continuously at `motion/loop-duration` and `motion/loop-easing`. With
 *   reduced motion, the spin stops and the notice stays (WCAG 2.3.3);
 * - no focus, click, event, slot, color property or `::part`. The color inherits
 *   `currentColor` from the context;
 * - invalid `size` does not render and emits `console.error` only in
 *   development, with no visual fallback (P66, same rule as P21).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import spinnerCss from './nph-spinner.css?inline';

const TAG = 'nph-spinner';

/** Internal mark, not API: present only when the size is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_SPINNER_SIZES = ['sm', 'md'] as const;
export type NphSpinnerSize = (typeof NPH_SPINNER_SIZES)[number];

function isSpinnerSize(value: string): value is NphSpinnerSize {
  return (NPH_SPINNER_SIZES as readonly string[]).includes(value);
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphSpinner extends LitElement {
  static override styles = unsafeCSS(spinnerCss);

  static override properties = {
    /* `size` reflects because the internal CSS selects the box by it. */
    size: { type: String, reflect: true },
    label: { type: String },
  };

  /** `sm` by default; `md` in a content area. */
  declare size: NphSpinnerSize;

  /** Accessible name. Empty or only spaces makes the spinner decorative. */
  declare label: string | null;

  private valid = false;

  constructor() {
    super();
    this.size = 'sm';
    this.label = null;
  }

  protected override willUpdate(): void {
    const size = this.size ?? '';
    this.valid = isSpinnerSize(size);
    if (!this.valid) {
      devError(`size "${size}" does not exist. Use "sm" or "md" — there is no "lg" nor free value.`);
    }
    this.applySemantics();
  }

  /**
   * Semantics on the HOST. There is a name only when there is a valid drawing AND
   * text in `label`; otherwise the spinner leaves the accessibility tree.
   */
  private applySemantics(): void {
    const label = (this.label ?? '').trim();
    if (this.valid && label !== '') {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    return html`<nph-icon class="glyph" name="circle-notch" size=${this.size}></nph-icon>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSpinner);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-spinner': NphSpinner;
  }
}
