/**
 * `nph-tooltip` — the help bubble.
 *
 * Contract accepted in Figma (frame `1237:5`, component `1237:3`) and
 * decisions by Indiane on 01-10-2026 (Decision Register: L11.5 for behavior
 * and scope; L11.6 and L11.7 for anatomy):
 * - text only. It has no title, icon, action, arrow or border;
 * - the text follows the width up to `layout/max-tooltip-width` and then
 *   wraps. It fits whole, in up to two lines: no ellipsis and no broken word.
 *   Longer text is a content error, and the component does not cut it;
 * - it opens only through activation of the trigger that uses it (in
 *   `nph-label`, the `info` trigger), and never on hover. Opening, closing
 *   and positioning belong to the consumer: this component only shows the
 *   text when `open` is on.
 *
 * API — two properties (P65):
 * - `text`, the bubble text, already localized by the consuming application;
 * - `open`, which shows the bubble. Reflects to the attribute.
 *
 * ACCESSIBILITY — the bubble opens by activation and focus stays on the
 * trigger, so the text must be announced without receiving focus. That is why
 * the host is a `role="status"` live region, present in the DOM BEFORE
 * opening: the screen reader only announces changes inside a region that
 * already existed. The bubble is not focusable.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import styles from './nph-tooltip.css?inline';

const TAG = 'nph-tooltip';

export class NphTooltip extends LitElement {
  static override styles = unsafeCSS(styles);

  static override properties = {
    text: { type: String },
    /* `open` reflects so the consumer can style and check the state. */
    open: { type: Boolean, reflect: true },
  };

  /** The bubble text. Empty or only spaces: nothing is shown. */
  declare text: string;

  /** Shows the bubble. The consumer turns it on and off. */
  declare open: boolean;

  constructor() {
    super();
    this.text = '';
    this.open = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'status');
  }

  protected override render(): TemplateResult | typeof nothing {
    const content = (this.text ?? '').trim();
    if (!this.open || content === '') {
      return nothing;
    }
    return html`<div class="bubble">${content}</div>`;
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
