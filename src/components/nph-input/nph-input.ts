/**
 * `nph-input` — the one-line field to type or edit a value.
 *
 * Contract accepted in Figma (frame `1195:532`, set `622:18359`) and P69:
 * - `size`: `default` (default) or `large`. A form uses a single size;
 * - `value` and `placeholder`. The placeholder is an example, never the label;
 * - `icon-start`: one `nph-icon` core name before the value, at
 *   `icon/size-sm`, decorative;
 * - `clearable` with `clear-label`: the end icon (`xmark`) clears the value,
 *   inside its own 24 × 24 target with its own focus (the `foco-limpar`). It
 *   shows only with a value and outside disabled. Clearing empties the value,
 *   dispatches `input` and `change` on the host and returns the focus to the
 *   field. `clear-label` is its accessible name;
 * - `invalid` (the `erro`): border in `status/error` and `aria-invalid`. The
 *   error sentence belongs to `nph-field`, never inside the field;
 * - `required` reaches assistive technology through the control (P62.3);
 * - `disabled`: native, background `color/muted`, the whole field at
 *   `state/disabled-opacity`. It wins over `invalid`;
 * - accessible name: `label` or, without it, the text of the `<label>`
 *   elements associated with the host — what `nph-label for` produces —
 *   without the `aria-hidden` nodes (the asterisk). It is read again on the
 *   next frame after connecting, when an associated label changes and on
 *   `focusin`;
 * - `name`: the field is form-associated. It submits `value`, mirrors the
 *   validity of the inner field, resets to the initial `value` attribute and
 *   is disabled by a disabled `<fieldset>`. Enter submits the form, as a
 *   native field does;
 * - `input` crosses the shadow root; `change` is dispatched again on the host,
 *   because it is not composed. No event of its own;
 * - text only: mask, number and password are out of this batch. No slot, no
 *   color property and no `::part`;
 * - invalid input does not render and emits `console.error` only in
 *   development, one per cause and accumulating (P21 rule): `size` outside the
 *   list, `icon-start` outside the core, `clearable` without `clear-label`.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import inputCss from './nph-input.css?inline';

const TAG = 'nph-input';

/** Internal marker, not API. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_INPUT_SIZES = ['default', 'large'] as const;
export type NphInputSize = (typeof NPH_INPUT_SIZES)[number];

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

/** The text a person reads in a label: without the `aria-hidden` nodes. */
function readableText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }
  if (node instanceof Element && node.getAttribute('aria-hidden') === 'true') {
    return '';
  }
  return [...node.childNodes].map(readableText).join('');
}

export class NphInput extends LitElement {
  static override styles = unsafeCSS(inputCss);

  /* Host focus goes to the inner native field. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* Takes part in `<form>`, `<fieldset disabled>`, form reset and `<label for>`. */
  static formAssociated = true;

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    size: { type: String, reflect: true },
    value: { type: String },
    placeholder: { type: String },
    iconStart: { type: String, attribute: 'icon-start' },
    clearable: { type: Boolean },
    clearLabel: { type: String, attribute: 'clear-label' },
    invalid: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean },
    /* `name` reflects because the form reads the host attribute. */
    name: { type: String, reflect: true },
    label: { type: String },
  };

  declare size: NphInputSize;
  declare value: string;
  /** Example text, already localized by the consuming application. */
  declare placeholder: string;
  declare iconStart: string;
  declare clearable: boolean;
  /** Accessible name of the clear button, already localized. */
  declare clearLabel: string;
  declare invalid: boolean;
  declare disabled: boolean;
  declare required: boolean;
  declare name: string;
  /** Accessible name of the field when no label is associated with it. */
  declare label: string;

  private readonly internals: ElementInternals;
  private valid = false;
  private formDisabled = false;
  private defaultValue: string | null = null;
  private labelText = '';
  private labelObserver: MutationObserver | null = null;
  private frame = 0;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.size = 'default';
    this.value = '';
    this.placeholder = '';
    this.iconStart = '';
    this.clearable = false;
    this.clearLabel = '';
    this.invalid = false;
    this.disabled = false;
    this.required = false;
    this.name = '';
    this.label = '';
    this.addEventListener('focusin', () => this.readLabels());
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* The `value` attribute at the first connection is the reset value. */
    if (this.defaultValue === null) {
      this.defaultValue = this.getAttribute('value') ?? '';
    }
    /* `nph-label` draws its `<label>` in its own update: read on the next frame. */
    this.frame = requestAnimationFrame(() => this.readLabels());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    cancelAnimationFrame(this.frame);
    this.labelObserver?.disconnect();
    this.labelObserver = null;
  }

  formResetCallback(): void {
    this.value = this.defaultValue ?? '';
  }

  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled;
    this.requestUpdate();
  }

  /** Disabled by the property or by a disabled `<fieldset>`. */
  private get inactive(): boolean {
    return this.disabled || this.formDisabled;
  }

  /** Reads the associated labels again and watches them for text changes. */
  private readLabels(): void {
    const labels = [...(this.internals.labels as NodeListOf<HTMLLabelElement>)];
    this.labelObserver?.disconnect();
    if (labels.length > 0) {
      this.labelObserver ??= new MutationObserver(() => this.readLabels());
      for (const label of labels) {
        this.labelObserver.observe(label, { childList: true, characterData: true, subtree: true });
      }
    }
    const text = labels.map(readableText).join(' ').replace(/\s+/g, ' ').trim();
    if (text !== this.labelText) {
      this.labelText = text;
      this.requestUpdate();
    }
  }

  private field(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector<HTMLInputElement>('input') ?? null;
  }

  protected override willUpdate(_changed: PropertyValues): void {
    const size = this.size ?? '';
    const start = (this.iconStart ?? '').trim();
    let valid = true;

    if (!(NPH_INPUT_SIZES as readonly string[]).includes(size)) {
      devError(`size "${size}" does not exist. Use ${NPH_INPUT_SIZES.join(', ')}.`);
      valid = false;
    }
    if (start !== '' && !isCoreName(start)) {
      devError(`icon-start "${start}" is not a core name of nph-icon.`);
      valid = false;
    }
    if (this.clearable && (this.clearLabel ?? '').trim() === '') {
      devError('clearable needs clear-label: it is the accessible name of the clear button.');
      valid = false;
    }

    this.valid = valid;
    this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
    this.internals.setFormValue(valid ? (this.value ?? '') : null);
  }

  protected override updated(_changed: PropertyValues): void {
    const field = this.field();
    if (field) {
      this.internals.setValidity(field.validity, field.validationMessage, field);
    } else {
      this.internals.setValidity({});
    }
  }

  private onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
  }

  /** Enter submits the form, as a native field does: the inner field is not in the form. */
  private onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.isComposing) {
      this.internals.form?.requestSubmit();
    }
  }

  private onChange(): void {
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private onClear(): void {
    const field = this.field();
    this.value = '';
    if (field) field.value = '';
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
    field?.focus();
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const start = (this.iconStart ?? '').trim();
    const name = (this.label ?? '').trim() || this.labelText;
    const showClear = this.clearable && !this.inactive && (this.value ?? '') !== '';
    return html`<div class="field">
      ${start !== '' ? html`<nph-icon class="icon" name=${start} size="sm"></nph-icon>` : nothing}
      <input
        class="control"
        type="text"
        .value=${live(this.value ?? '')}
        placeholder=${(this.placeholder ?? '') !== '' ? this.placeholder : nothing}
        ?disabled=${this.inactive}
        ?required=${this.required}
        aria-invalid=${this.invalid && !this.inactive ? 'true' : nothing}
        aria-label=${name !== '' ? name : nothing}
        @input=${(event: Event) => this.onInput(event)}
        @change=${() => this.onChange()}
        @keydown=${(event: KeyboardEvent) => this.onKeydown(event)}
      />
      ${showClear
        ? html`<button class="clear" type="button" aria-label=${this.clearLabel.trim()} @click=${() => this.onClear()}>
            <nph-icon name="xmark" size="sm"></nph-icon>
          </button>`
        : nothing}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphInput);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-input': NphInput;
  }
}
