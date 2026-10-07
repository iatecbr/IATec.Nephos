/**
 * `nph-checkbox` — the check box with its own text beside it.
 *
 * Contract accepted in Figma (frame `1194:1033`, set `740:18776`) and P69:
 * - `checked` and `indeterminate` (the Figma `marcado`: false, true or
 *   indeterminado). `indeterminate` only on the item that summarizes a group
 *   checked in part; it is not an answer from the person, and it shows the
 *   `minus` mark whatever `checked` is, like the native check box;
 * - `text`: the text beside the box and the accessible name. It is part of the
 *   piece, not an `nph-label`;
 * - `hide-text` (the `mostrar rótulo` turned off): the text leaves the screen
 *   and becomes the `aria-label` of the box, which stays at 24 × 24;
 * - `invalid` (the `erro`): border in `status/error` and `aria-invalid`. The
 *   error sentence stays outside the piece;
 * - `disabled`: native, the whole piece at `state/disabled-opacity`. It wins
 *   over `invalid`, which does not show while disabled;
 * - `name` and `value` (default `on`): the piece is form-associated and
 *   submits `value` only when checked;
 * - native keyboard: Tab stops at each box, Space toggles; a click on the text
 *   toggles too. Toggling clears `indeterminate`. `input` crosses the shadow
 *   root; `change` is dispatched again on the host, because it is not composed;
 * - no slot, no event of its own, no color property and no `::part`;
 * - invalid input does not render and emits `console.error` only in
 *   development: `text` empty. Unlike the mount state of `nph-kbd` and
 *   `nph-badge` (P66, P68), a box without text would be an operable control
 *   without a name (WCAG 4.1.2).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

import '../nph-icon/nph-icon';
import checkboxCss from './nph-checkbox.css?inline';

const TAG = 'nph-checkbox';

/** Internal marker, not API. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphCheckbox extends LitElement {
  static override styles = unsafeCSS(checkboxCss);

  /* Host focus goes to the inner native check box. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* Takes part in `<form>`, `<fieldset disabled>` and form reset. */
  static formAssociated = true;

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    checked: { type: Boolean, reflect: true },
    indeterminate: { type: Boolean, reflect: true },
    text: { type: String },
    hideText: { type: Boolean, reflect: true, attribute: 'hide-text' },
    invalid: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    /* `name` reflects because the form reads the host attribute. */
    name: { type: String, reflect: true },
    value: { type: String },
  };

  declare checked: boolean;
  declare indeterminate: boolean;
  /** The text beside the box, already localized by the consuming application. */
  declare text: string;
  declare hideText: boolean;
  declare invalid: boolean;
  declare disabled: boolean;
  declare name: string;
  declare value: string;

  private readonly internals: ElementInternals;
  private valid = false;
  private formDisabled = false;
  private defaultChecked: boolean | null = null;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.checked = false;
    this.indeterminate = false;
    this.text = '';
    this.hideText = false;
    this.invalid = false;
    this.disabled = false;
    this.name = '';
    this.value = 'on';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* The `checked` attribute at the first connection is the reset value. */
    if (this.defaultChecked === null) {
      this.defaultChecked = this.hasAttribute('checked');
    }
  }

  formResetCallback(): void {
    this.checked = this.defaultChecked ?? false;
    this.indeterminate = false;
  }

  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled;
    this.requestUpdate();
  }

  protected override willUpdate(_changed: PropertyValues): void {
    const text = (this.text ?? '').trim();
    this.valid = text !== '';
    if (!this.valid) {
      devError('text is empty: the box needs text, which is its accessible name.');
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    this.internals.setFormValue(this.valid && this.checked ? (this.value ?? 'on') : null);
  }

  private onChange(event: Event): void {
    const box = event.target as HTMLInputElement;
    this.checked = box.checked;
    this.indeterminate = false;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const text = this.text.trim();
    const marked = this.checked || this.indeterminate;
    return html`<label class="row">
      <span class="target">
        <input
          class="box"
          type="checkbox"
          .checked=${live(this.checked)}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled || this.formDisabled}
          aria-invalid=${this.invalid && !this.disabled && !this.formDisabled ? 'true' : nothing}
          aria-label=${this.hideText ? text : nothing}
          @change=${(event: Event) => this.onChange(event)}
        />
        ${marked
          ? html`<nph-icon class="mark" name=${this.indeterminate ? 'minus' : 'check'} size="sm"></nph-icon>`
          : nothing}
      </span>
      ${this.hideText ? nothing : html`<span class="text">${text}</span>`}
    </label>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphCheckbox);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-checkbox': NphCheckbox;
  }
}
