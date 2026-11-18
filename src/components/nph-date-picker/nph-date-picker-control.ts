/**
 * The control row of `nph-date-picker` — the Figma piece `date-picker / controle` (`6618:52542`): the date text
 * (an `nph-input`) and, in the single date and in the End field, the calendar button, side by side.
 *
 * It exists only because the `nph-field` names and describes ONE control (P83), and here the row holds an `nph-input` and a button.
 * The row takes the field contract (`label`, `description`, `invalid`, `required` and `disabled`) in the place of the
 * input and hands it to the `nph-input` it holds; the calendar button keeps its own name (its tooltip), and `disabled` goes to
 * it too. It draws nothing of its own and is NOT a public element: it has no folder, no sheet and no entry of the package, and
 * the manifest drops it (P133, item 3). `focus()` on the row focuses the input, as a click on the label of the field does.
 *
 * @internal
 * @ignore
 */
import { LitElement, html, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import controlCss from './nph-date-picker-control.css?inline';

const TAG = 'nph-date-picker-control';

export class NphDatePickerControl extends LitElement {
  static override styles = unsafeCSS(controlCss);

  static override properties = {
    label: { type: String },
    description: { type: String },
    invalid: { type: Boolean },
    required: { type: Boolean },
    disabled: { type: Boolean },
  };

  declare label: string;
  declare description: string;
  declare invalid: boolean;
  declare required: boolean;
  declare disabled: boolean;

  constructor() {
    super();
    this.label = '';
    this.description = '';
    this.invalid = false;
    this.required = false;
    this.disabled = false;
  }

  /** The input the field writes on, and the calendar button that fades with it. */
  private get input(): (HTMLElement & Record<string, unknown>) | null {
    return this.querySelector<HTMLElement & Record<string, unknown>>('nph-input');
  }

  protected override updated(): void {
    this.forward();
  }

  private forward(): void {
    const input = this.input;
    if (input !== null) {
      this.assign(input, 'label', this.label);
      this.assign(input, 'description', this.description);
      this.assign(input, 'invalid', this.invalid);
      this.assign(input, 'required', this.required);
      this.assign(input, 'disabled', this.disabled);
    }
    for (const button of this.querySelectorAll<HTMLElement & Record<string, unknown>>('nph-button')) {
      this.assign(button, 'disabled', this.disabled);
    }
  }

  private assign(element: Record<string, unknown>, key: string, value: unknown): void {
    if (element[key] !== value) {
      element[key] = value;
    }
  }

  override focus(options?: FocusOptions): void {
    this.input?.focus(options);
  }

  private onSlotChange(): void {
    this.forward();
  }

  protected override render(): TemplateResult {
    return html`<slot @slotchange=${this.onSlotChange}></slot>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphDatePickerControl);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-date-picker-control': NphDatePickerControl;
  }
}
