/**
 * `nph-checkbox` — the checkbox with its own text, for independent options or one option
 * the person turns on or off.
 *
 * Contract accepted in Figma (frame `1194:1033`, set `740:18776`), sheet
 * `fichas/nph-checkbox.md`, `design.md` and decision P81 — nph-checkbox: API, semantics
 * and form participation, which follows the form pattern of P80 and the field contract of
 * P83:
 * - `checked` and `indeterminate`: the Figma `marcado` (`true` and `indeterminado`). They do
 *   not reflect. The `checked` attribute is the default state, the one a form reset goes back
 *   to; the property is the current state. Once the person toggles the piece, or code sets
 *   `checked`, the piece is dirty and a later change of the attribute no longer moves the
 *   current state, as in the native checkbox. `indeterminate` shows the `minus` mark whatever
 *   `checked` is; a click of the person clears it and toggles `checked`;
 * - `text`: the plain text next to the box, the name of the control. Without it, the piece is
 *   only the box, at 24 × 24, and needs `label`;
 * - `label`: the accessible name of the piece without text (`aria-label` on the inner input).
 *   With text, it is not used;
 * - `invalid`: error border on the box and `aria-invalid` on the inner input. The error
 *   sentence stays outside the piece;
 * - `disabled`: the whole piece at `state/disabled-opacity`, out of the Tab order and out of
 *   the form data. A disabled `<fieldset>` has the same effect. `disabled` wins over
 *   `invalid`: the error border and `aria-invalid` are suppressed;
 * - form association through `ElementInternals`: `name` and `value` (default `on`) are the
 *   attributes of the host, as in the native checkbox; a checked piece submits `name=value`;
 *   reset, a disabled fieldset and state restoration work as in the native checkbox; there is
 *   no `required` and no constraint validation;
 * - events: the native `input` of the inner input crosses the shadow root on its own; the
 *   piece fires `change` on the host (bubbles, not composed) after it. Both only when the
 *   person toggles the piece; setting `checked` or `indeterminate` from code fires nothing;
 * - `nphFieldRole` is `option`: inside `nph-field`, the piece is an option of a group (P83);
 * - no size (the box is always `icon/size-sm`), no slot, no `::part`, no color property;
 * - invalid input does not render and emits `console.error` only in development (P21 rule):
 *   no text and no label.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

import '../nph-icon/nph-icon';
import checkboxCss from './nph-checkbox.css?inline';

const TAG = 'nph-checkbox';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The value a checked piece submits when the `value` attribute is absent, as in the native checkbox. */
export const NPH_CHECKBOX_DEFAULT_VALUE = 'on';

/** The two marks of the box: checked shows the first, indeterminate the second. */
export const NPH_CHECKBOX_MARKS = ['check', 'minus'] as const;

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphCheckbox extends LitElement {
  static override styles = unsafeCSS(checkboxCss);

  /* Host focus goes to the inner native input. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* The host is the form control: it submits, resets and follows a disabled fieldset. */
  static formAssociated = true;

  /** Inside `nph-field`, the piece is an option of a group (contract of the field, P83). */
  static readonly nphFieldRole = 'option';

  static override properties = {
    /* `checked` has its own accessor: its attribute is the default state, not the current one. */
    checked: { type: Boolean, attribute: false, noAccessor: true },
    indeterminate: { type: Boolean },
    /* `invalid` reflects because the internal CSS reads it. */
    invalid: { type: Boolean, reflect: true },
    /*
     * `disabled` has its own accessor over the attribute, as the native one: the attribute is
     * set at once, so the host matches `:disabled` and the form hears it outside an update.
     */
    disabled: { type: Boolean, attribute: false, noAccessor: true },
    text: { type: String },
    label: { type: String },
    /*
     * `name` and `value` are the host attributes, with their own accessors. They are declared so
     * that a value set before the element is defined is taken back at the first update.
     */
    name: { type: String, attribute: false, noAccessor: true },
    value: { type: String, attribute: false, noAccessor: true },
  };

  /* The attributes the piece reads by hand: the default state, `disabled` and the two form attributes. */
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'checked', 'disabled', 'name', 'value'];
  }

  /** Partly checked: the item that summarizes a group checked only in part. */
  declare indeterminate: boolean;
  declare invalid: boolean;
  /** The text next to the box, already localized by the consuming application. */
  declare text: string;
  /** Accessible name of the piece without text. With text, it is not used. */
  declare label: string;

  private readonly internals: ElementInternals;
  private checkedState = false;
  /* Dirty, as the native checkedness: the attribute no longer moves the current state. */
  private dirty = false;
  private formDisabled = false;
  private valid = false;
  /* Set while `click()` dispatches its own event, so the host does not activate it twice. */
  private ownClick = false;
  /* Set when the host heard the `input` of the inner input for the current toggle. */
  private heardInput = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.indeterminate = false;
    this.invalid = false;
    this.text = '';
    this.label = '';
    /* In disabled, a click neither toggles nor reaches the consumer, as on a native disabled control. */
    this.addEventListener('click', (event) => this.blockInactive(event), { capture: true });
    this.addEventListener('click', (event) => this.activateFromOutside(event));
    /*
     * The `input` of the inner input is heard on the host, in capture and first: the state moves
     * before any listener the consumer puts on the host runs, even one that stops the event.
     */
    this.addEventListener('input', (event) => this.onInput(event), { capture: true });
  }

  /** The current state. Setting it from code makes the piece dirty and fires no event. */
  get checked(): boolean {
    return this.checkedState;
  }

  set checked(value: boolean) {
    this.moveChecked(Boolean(value), true);
  }

  /** Disabled: the `disabled` attribute of the host. A disabled `<fieldset>` has the same effect. */
  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', Boolean(value));
  }

  /** The name of the entry in the form data: the `name` attribute of the host. */
  get name(): string {
    return this.getAttribute('name') ?? '';
  }

  set name(value: string) {
    this.setAttribute('name', String(value));
  }

  /** What a checked piece submits: the `value` attribute of the host, `on` when absent. */
  get value(): string {
    return this.getAttribute('value') ?? NPH_CHECKBOX_DEFAULT_VALUE;
  }

  set value(value: string) {
    this.setAttribute('value', String(value));
  }

  /** The form that owns the piece, or `null`. */
  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  override attributeChangedCallback(name: string, old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, old, value);
    if (name === 'checked' && !this.dirty) {
      this.moveChecked(value !== null, false);
    } else if (name === 'disabled') {
      this.syncInactive();
      this.requestUpdate('disabled', old !== null);
    } else if (name === 'name' || name === 'value') {
      this.syncFormValue();
    }
  }

  /** A form reset goes back to the default state and clears the dirty flag and the partial state. */
  formResetCallback(): void {
    this.indeterminate = false;
    this.moveChecked(this.hasAttribute('checked'), false);
  }

  /** A disabled `<fieldset>` disables the piece as its own `disabled` does; the callback hears both. */
  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled;
    this.syncInactive();
    this.requestUpdate();
  }

  /** Back and forward in the browser, or autofill, restore the checked state. */
  formStateRestoreCallback(state: File | string | FormData | null): void {
    if (typeof state !== 'string') {
      return;
    }
    this.moveChecked(state === 'checked', true);
  }

  /**
   * Moves the current state. The inner input and the form data follow at once, so a listener
   * that reads them right after, or a click right after, sees the new state before the render.
   */
  private moveChecked(value: boolean, dirty: boolean): void {
    const previous = this.checkedState;
    this.checkedState = value;
    this.dirty = dirty;
    const input = this.input;
    if (input !== null) {
      input.checked = value;
    }
    this.syncFormValue();
    this.requestUpdate('checked', previous);
  }

  /**
   * A checked piece submits `name=value`; unchecked, nothing. A piece that draws nothing (no text
   * and no label) submits nothing either: the person can neither see nor uncheck it. The state is
   * kept for restoration.
   */
  private syncFormValue(): void {
    const submits = this.checkedState && this.valid;
    this.internals.setFormValue(submits ? this.value : null, this.checkedState ? 'checked' : 'unchecked');
  }

  /** The inner input is enabled or disabled at once, so a click right after sees the new state. */
  private syncInactive(): void {
    const input = this.input;
    if (input !== null) {
      input.disabled = this.inactive;
    }
  }

  private get inactive(): boolean {
    return this.disabled || this.formDisabled;
  }

  /* Before the first connection there is no shadow root yet, and so no input. */
  private get input(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector('input') ?? null;
  }

  private blockInactive(event: Event): void {
    if (this.inactive) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  /**
   * `click()` on the host, as on a native checkbox: one `click` event, dispatched on the host and
   * cancelable; when nothing cancels it, the piece toggles and fires `input` and `change`. A
   * disabled or invalid piece does nothing.
   */
  override click(): void {
    if (this.inactive || !this.valid) {
      return;
    }
    this.ownClick = true;
    let proceed: boolean;
    try {
      proceed = this.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
    } finally {
      this.ownClick = false;
    }
    if (proceed) {
      this.activate();
    }
  }

  /**
   * A click dispatched on the host by someone else, such as a `<label for>` outside: the piece
   * toggles without a second `click`. A click that comes from inside the shadow root has already
   * toggled the inner input, and a click already canceled does nothing. Known limit: a
   * cancellation made later, by an ancestor in bubbling, comes after the toggle.
   */
  private activateFromOutside(event: Event): void {
    if (this.ownClick || event.composedPath()[0] !== this || event.defaultPrevented || this.inactive || !this.valid) {
      return;
    }
    this.activate();
  }

  /** The activation of a native checkbox: it toggles, clears the partial state, then `input` and `change`. */
  private activate(): void {
    const input = this.input;
    if (input === null) {
      return;
    }
    input.checked = !input.checked;
    input.indeterminate = false;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /** The native `input` of the inner input. On the host the target is retargeted, so the inner input is read. */
  private onInput(event: Event): void {
    const input = this.input;
    if (input === null || event.composedPath()[0] !== input) {
      return;
    }
    this.heardInput = true;
    this.indeterminate = false;
    this.moveChecked(input.checked, true);
  }

  /**
   * The native `change` does not cross the shadow root: the host fires its own. When an ancestor
   * stopped the `input` before it reached the host, the state is taken from the inner input here;
   * when the host heard it, what consumers changed since then is kept.
   */
  private onChange(): void {
    const input = this.input;
    if (!this.heardInput && input !== null) {
      this.indeterminate = false;
      this.moveChecked(input.checked, true);
    }
    this.heardInput = false;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  protected override willUpdate(changed: PropertyValues): void {
    /* Only the inputs that decide validity are checked again, so the error does not repeat on a toggle. */
    if (!changed.has('text') && !changed.has('label')) {
      return;
    }
    const text = (this.text ?? '').trim();
    const label = (this.label ?? '').trim();
    this.valid = text !== '' || label !== '';
    if (!this.valid) {
      devError('without text, the piece needs a label: it is the accessible name of the box alone.');
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    this.syncFormValue();
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const text = (this.text ?? '').trim();
    const label = (this.label ?? '').trim();
    const [check, minus] = NPH_CHECKBOX_MARKS;
    const showsError = this.invalid && !this.inactive;

    return html`<label class="control">
      <span class="target">
        <input
          class="native"
          type="checkbox"
          .checked=${live(this.checked)}
          .indeterminate=${live(this.indeterminate)}
          ?disabled=${this.inactive}
          aria-label=${text === '' ? label : nothing}
          aria-invalid=${showsError ? 'true' : nothing}
          @change=${this.onChange}
        />
        <span class="box" aria-hidden="true"
          ><nph-icon class="mark mark-check" name=${check} size="sm"></nph-icon
          ><nph-icon class="mark mark-minus" name=${minus} size="sm"></nph-icon
        ></span>
      </span>
      ${text === '' ? nothing : html`<span class="text">${text}</span>`}
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
