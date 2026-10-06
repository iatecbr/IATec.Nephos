/**
 * `nph-label` — the label of a form control.
 *
 * Approved contract (spec `nph-label`; Decision Register, `nph-label`
 * section; decisions by Indiane on 27-08-2026):
 * - the label is ONLY text. It has no box, border, background, icon or shadow;
 * - `required` appends an asterisk to the end of the text, in `status/error`;
 * - there is NO layout, weight or state property. Position belongs to
 *   `nph-field`; an error does not change the label; disabled fades the whole
 *   control, through `nph-field`, not through a state of its own;
 * - help and error message belong to `nph-field`, never to this piece.
 *
 * EXCEPTION TO P01 — this is the only Nephos component WITHOUT Shadow DOM.
 * The native association between label and control does not cross the Shadow
 * DOM boundary: `for` would not reach an `id` in the document and clicking
 * the label would not move the cursor to the field. Since that is the reason
 * a label exists, encapsulation yields. Decision by Indiane on 27-08-2026,
 * after the alternative of delegating the association to `nph-field` was
 * discarded because it blocked the P0 cut — `nph-field` does not exist yet.
 *
 * API — three properties, all three coming from the same decision:
 * - `required`, the only one foreseen in the Register;
 * - `for`, which mirrors the native `<label>` attribute and is the
 *   association mechanism chosen by the 27-08 decision;
 * - `text`, which carries the label text. It is a property, not content
 *   between the tags, because without Shadow DOM there is no `<slot>`: Lit
 *   renders inside the element itself and would replace any child written by
 *   the consumer. `for` and `text` were not in the Register and need
 *   technical confirmation before becoming contract.
 *
 * ACCESSIBILITY — the asterisk is DECORATIVE for assistive technology and
 * carries `aria-hidden`. The required state must reach the screen reader
 * through the control itself, with `required`, not through hidden text inside
 * the label. Two reasons: the required state belongs to the field, not to the
 * label, and hidden text would require a Portuguese string inside the
 * component, forbidden by the trilingual plan — no `nph-*` knows a language.
 *
 * Besides that, a form that uses `required` needs a visible legend
 * explaining the asterisk convention. That is a screen rule, checked in the
 * composition review, not something the component can enforce on its own.
 */
import { LitElement, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-label.css';

const TAG = 'nph-label';

export class NphLabel extends LitElement {
  static override properties = {
    text: { type: String },
    required: { type: Boolean, reflect: true },
    for: { type: String, reflect: true },
  };

  /** The label text. Arrives already localized by the consuming application. */
  declare text: string;

  /** Required field. Appends the asterisk to the end of the text. */
  declare required: boolean;

  /** `id` of the control this label names. Mirrors the native attribute. */
  declare for: string | null;

  constructor() {
    super();
    this.text = '';
    this.required = false;
    this.for = null;
  }

  /**
   * Renders in the light DOM, not in Shadow DOM. See the P01 exception note at the top.
   * Without this, `for` would not reach the control and the label would lose its function.
   */
  protected override createRenderRoot(): HTMLElement {
    return this;
  }

  protected override render(): TemplateResult {
    return html`<label class="nph-label__text" for=${this.for ?? nothing}
      >${this.text}${this.required
        ? html`<span class="nph-label__required" aria-hidden="true">*</span>`
        : nothing}</label
    >`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphLabel);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-label': NphLabel;
  }
}
