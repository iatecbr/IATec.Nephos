/**
 * `nph-input` — the one-line field to type or edit a value.
 *
 * Contract accepted in Figma (frame `1195:532`, set `622:18359`), sheet
 * `fichas/nph-input.md`, `design.md` and decision P80 — nph-input: API and
 * semantics, the reference of the form controls. The field contract is P83:
 * - `type`: `text` (default), `email`, `tel`, `url` or `search` (D1). Password,
 *   number and mask are out of v1;
 * - `size`: `compact`, `default` or `large`. Reflects, because the internal CSS
 *   selects the measures by it: `large` changes only the height; `compact` changes
 *   the height and the end padding (P80, amendment of 28/10/2026);
 * - `value`: the current value. The `value` ATTRIBUTE is the initial value and the
 *   value of `form.reset()`, as in the native `<input>`: it applies only while the
 *   person has not edited the field and setting the property has not made it dirty;
 * - `placeholder`, `required`, `autocomplete` (WCAG 1.3.5) and `name`, passed to
 *   the inner native `<input>`. `name` reflects because the form reads the
 *   attribute of the host: without it, the value is left out of the form data;
 * - `invalid`: the `erro` state, an error border and `aria-invalid`. The sentence
 *   belongs to `nph-field`; `invalid` is not a constraint of the form;
 * - `disabled`: native `disabled` on the inner field and on the clear button. It
 *   wins over `invalid`. A disabled `<fieldset>` disables the piece too;
 * - `label`: the accessible name in text, never visible, for a field with no
 *   associated label. An associated label (`<label for>` pointing to the host, as
 *   `nph-label for` does) wins over it;
 * - `description`: the accessible description in text, never visible: the help or
 *   the error sentence `nph-field` writes;
 * - `icon-start`: `none` (default) or a core name of `nph-icon`, decorative;
 * - `icon-end`: `none` (default) or a core name of `nph-icon`. It turns on the end
 *   button, which ALWAYS clears the value; the name only swaps the art (D2). The
 *   button shows only when there is a value, and `clear-label` is its accessible
 *   name;
 * - events: the native ones. `input` from the inner field crosses the shadow root;
 *   `change` does not, so the host fires it again. Clearing fires both. Setting
 *   `value` from code never fires them. These are form controls, so they do not
 *   follow the `nph-change` reasoning of P73 (item 3); P80 records why;
 * - form association (`ElementInternals`): the host is labelable, contributes
 *   `name=value`, restores its value on reset and on history navigation, mirrors
 *   the validity of the inner field and submits its form on Enter;
 * - no slot, no `::part`, no color property;
 * - invalid input does not render and emits `console.error` only in development,
 *   one per cause and accumulating (P21 rule, adopted by P80): a `type` outside
 *   the five, a `size` outside the three and an icon outside `none` and the core.
 *   `icon-end` without `clear-label` renders the field without the clear button,
 *   with one error (as `info` without `info-label` in P62.6). A field with no
 *   accessible name renders and warns once in development: the label may arrive
 *   after the first render.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import inputCss from './nph-input.css?inline';

const TAG = 'nph-input';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The five types of v1 (D1). */
export const NPH_INPUT_TYPES = ['text', 'email', 'tel', 'url', 'search'] as const;
export type NphInputType = (typeof NPH_INPUT_TYPES)[number];

/** The three sizes of the set. */
export const NPH_INPUT_SIZES = ['compact', 'default', 'large'] as const;
export type NphInputSize = (typeof NPH_INPUT_SIZES)[number];

/** The keyword that turns an icon off; any other value is a core icon name. */
export const NPH_INPUT_NO_ICON = 'none';

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

/** Development warning, for a composition that still renders. */
function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/** An absent attribute (null or undefined) is the default, `none`. */
function iconValue(value: string | null | undefined): string {
  return value === null || value === undefined ? NPH_INPUT_NO_ICON : value.trim();
}

/** The first submit button whose form owner is the form, as the default button of HTML. */
function defaultButton(form: HTMLFormElement): HTMLButtonElement | HTMLInputElement | undefined {
  const tree = form.getRootNode() as ParentNode;
  for (const element of tree.querySelectorAll<HTMLButtonElement | HTMLInputElement>('button, input')) {
    if (element.form !== form) {
      continue;
    }
    if (element instanceof HTMLButtonElement && element.type === 'submit') {
      return element;
    }
    if (element instanceof HTMLInputElement && (element.type === 'submit' || element.type === 'image')) {
      return element;
    }
  }
  return undefined;
}

export class NphInput extends LitElement {
  static override styles = unsafeCSS(inputCss);

  /* Host focus, and a click on the label or the frame, go to the inner native `<input>`. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* The host takes part in the form: labelable, with a value and a validity of its own. */
  static formAssociated = true;

  static override properties = {
    type: { type: String },
    /* `size` reflects because the internal CSS selects the height by it. */
    size: { type: String, reflect: true },
    /* The `value` attribute is the default, read by hand (see `attributeChangedCallback`). */
    value: { attribute: false, noAccessor: true },
    placeholder: { type: String },
    /* `name` reflects because the form reads the attribute of the host, not the property. */
    name: { type: String, reflect: true },
    autocomplete: { type: String },
    /* The reflected booleans are read by the internal CSS and by the consumer's selectors. */
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    label: { type: String },
    description: { type: String },
    iconStart: { type: String, attribute: 'icon-start' },
    iconEnd: { type: String, attribute: 'icon-end' },
    clearLabel: { type: String, attribute: 'clear-label' },
  };

  declare type: string;
  declare size: string;
  /** The example before typing, already localized by the consuming application. */
  declare placeholder: string;
  /** Name of the entry in the form data. */
  declare name: string | null;
  /** The purpose of the value for autofill, such as `email` (WCAG 1.3.5). */
  declare autocomplete: string;
  declare required: boolean;
  declare disabled: boolean;
  declare invalid: boolean;
  /** Accessible name in text, never visible. An associated label wins over it. */
  declare label: string;
  /** Accessible description in text, never visible: the help or the error sentence. */
  declare description: string;
  /** `none` or a core icon name. Decorative. */
  declare iconStart: string;
  /** `none` or a core icon name: the art of the clear button. */
  declare iconEnd: string;
  /** Accessible name of the clear button. Required with `icon-end`. */
  declare clearLabel: string;

  private readonly internals: ElementInternals;
  private readonly labelObserver = new MutationObserver(() => this.syncName());
  private current = '';
  /** Edited by the person or set by code: the `value` attribute no longer applies. */
  private dirty = false;
  private valid = false;
  private clearable = false;
  /** After the first frame, a label rendered by another element has had its chance. */
  private settled = false;
  private warnedNoName = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.type = 'text';
    this.size = 'default';
    this.placeholder = '';
    this.name = null;
    this.autocomplete = '';
    this.required = false;
    this.disabled = false;
    this.invalid = false;
    this.label = '';
    this.description = '';
    this.iconStart = NPH_INPUT_NO_ICON;
    this.iconEnd = NPH_INPUT_NO_ICON;
    this.clearLabel = '';
    this.addEventListener('focusin', () => this.syncName());
    this.addEventListener('input', this.onInput, { capture: true });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.labelObserver.observe(this.getRootNode(), {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['for', 'id'],
    });
  }

  override disconnectedCallback(): void {
    this.labelObserver.disconnect();
    super.disconnectedCallback();
  }

  /** The current value. Setting it from code fires nothing. */
  get value(): string {
    return this.current;
  }

  set value(next: string) {
    const old = this.current;
    this.current = next === null || next === undefined ? '' : String(next);
    this.dirty = true;
    this.syncFieldValue();
    this.syncFormState();
    this.requestUpdate('value', old);
  }

  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'value'];
  }

  override attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    super.attributeChangedCallback(name, old, next);
    if (name === 'value' && !this.dirty) {
      this.applyDefault();
    }
  }

  /** The `value` attribute, as the default value. */
  private applyDefault(): void {
    const old = this.current;
    this.current = this.getAttribute('value') ?? '';
    this.syncFieldValue();
    this.syncFormState();
    this.requestUpdate('value', old);
  }

  /* --- The native surface of a form control --------------------------------- */

  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  get labels(): NodeList {
    return this.internals.labels;
  }

  get validity(): ValidityState {
    return this.internals.validity;
  }

  get validationMessage(): string {
    return this.internals.validationMessage;
  }

  get willValidate(): boolean {
    return this.internals.willValidate;
  }

  checkValidity(): boolean {
    return this.internals.checkValidity();
  }

  reportValidity(): boolean {
    return this.internals.reportValidity();
  }

  formResetCallback(): void {
    this.dirty = false;
    this.applyDefault();
  }

  formDisabledCallback(): void {
    this.requestUpdate();
  }

  formStateRestoreCallback(state: string | File | FormData | null): void {
    if (typeof state === 'string') {
      this.value = state;
    }
  }

  /* --- Validation of the input ---------------------------------------------- */

  protected override willUpdate(changed: PropertyValues): void {
    /* Only the inputs that decide validity are checked again, so the errors do not repeat on typing. */
    const decisive = ['type', 'size', 'iconStart', 'iconEnd', 'clearLabel'].some((name) => changed.has(name));
    if (!decisive) {
      return;
    }
    const type = (this.type ?? '').trim();
    const size = (this.size ?? '').trim();
    const start = iconValue(this.iconStart);
    const end = iconValue(this.iconEnd);
    let valid = true;

    if (!oneOf(NPH_INPUT_TYPES, type)) {
      devError(`type "${type}" is not in v1. Use ${NPH_INPUT_TYPES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_INPUT_SIZES, size)) {
      devError(`size "${size}" does not exist. Use ${NPH_INPUT_SIZES.join(', ')}.`);
      valid = false;
    }
    if (start !== NPH_INPUT_NO_ICON && !isCoreName(start)) {
      devError(`icon-start "${start}" is not "none" or a core name of nph-icon.`);
      valid = false;
    }
    if (end !== NPH_INPUT_NO_ICON && !isCoreName(end)) {
      devError(`icon-end "${end}" is not "none" or a core name of nph-icon.`);
      valid = false;
    }
    const clearName = (this.clearLabel ?? '').trim();
    if (valid && end !== NPH_INPUT_NO_ICON && clearName === '') {
      devError('icon-end turns on the clear button, which needs clear-label as its accessible name; the button was not drawn.');
    }

    this.valid = valid;
    this.clearable = valid && end !== NPH_INPUT_NO_ICON && clearName !== '';
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  /* --- The person types, clears, submits --------------------------------------- */

  private get field(): HTMLInputElement | null {
    return this.renderRoot?.querySelector<HTMLInputElement>('input') ?? null;
  }

  private get inactive(): boolean {
    return this.disabled || this.disabledByFieldset;
  }

  private get disabledByFieldset(): boolean {
    let ancestor = this.parentElement;
    while (ancestor !== null) {
      if (ancestor.localName === 'fieldset' && ancestor.hasAttribute('disabled')) {
        const firstLegend = [...ancestor.children].find((child) => child.localName === 'legend');
        if (firstLegend === undefined || !firstLegend.contains(this)) {
          return true;
        }
      }
      ancestor = ancestor.parentElement;
    }
    return false;
  }

  /**
   * The native `input` event crosses the shadow root on its own. Capture it at the host
   * so its value and form state are synchronized before consumer listeners run.
   */
  private onInput(): void {
    const field = this.field;
    if (field === null) {
      return;
    }
    const old = this.current;
    this.current = field.value;
    this.dirty = true;
    this.syncFormState();
    this.requestUpdate('value', old);
  }

  /** The native `change` event does not cross the shadow root: the host fires it again. */
  private onChange(): void {
    this.syncFormState();
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /**
   * Enter submits the form, as in a native field: the default button, or the form itself.
   * It is decided at the end of the propagation, as the default action of a native field,
   * so a consumer that cancels Enter anywhere on the path keeps the form.
   */
  private onKeydown(event: KeyboardEvent): void {
    const form = this.internals.form;
    const view = this.ownerDocument.defaultView;
    if (event.key !== 'Enter' || event.isComposing || form === null || view === null) {
      return;
    }
    view.setTimeout(() => {
      if (event.defaultPrevented) {
        return;
      }
      const submitter = defaultButton(form);
      if (submitter === undefined) {
        form.requestSubmit();
      } else if (!submitter.disabled) {
        submitter.click();
      }
    }, 0);
  }

  /** The clear button: empty value, focus back on the field, the same events as typing. */
  private clear(): void {
    if (this.inactive) {
      return;
    }
    const old = this.current;
    this.current = '';
    this.dirty = true;
    const field = this.field;
    if (field !== null) {
      field.value = '';
      field.focus();
      this.current = field.value;
    }
    this.syncFormState();
    this.requestUpdate('value', old);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* --- Form value, validity and accessible name -------------------------------- */

  protected override firstUpdated(): void {
    requestAnimationFrame(() => {
      this.settled = true;
      this.syncName();
    });
  }

  protected override updated(): void {
    const field = this.field;
    if (this.valid && field !== null && this.current !== field.value) {
      const old = this.current;
      this.current = field.value;
      this.requestUpdate('value', old);
    }
    this.syncFormState();
  }

  private syncFieldValue(): void {
    const field = this.field;
    if (field !== null) {
      field.value = this.current;
      this.current = field.value;
    }
  }

  private syncFormState(): void {
    const field = this.field;
    if (!this.valid || field === null) {
      this.internals.setFormValue(null);
      this.internals.setValidity({});
      return;
    }
    this.internals.setFormValue(this.current, this.current);
    if (!field.willValidate || field.validity.valid) {
      this.internals.setValidity({});
    } else {
      /* The flags and the message of the inner field: the message is the browser's, in the person's language. */
      this.internals.setValidity(field.validity, field.validationMessage, field);
    }
    this.syncName();
  }

  /**
   * The inner field is named by the labels associated with the host (the reference to
   * an element of an outer scope is valid from inside the shadow root), or by `label`.
   */
  private syncName(): void {
    const field = this.field;
    if (field === null) {
      return;
    }
    const labels = [...this.internals.labels] as Element[];
    const text = (this.label ?? '').trim();
    if (labels.length > 0) {
      field.ariaLabelledByElements = labels;
      field.removeAttribute('aria-label');
    } else {
      field.ariaLabelledByElements = null;
      if (text === '') {
        field.removeAttribute('aria-label');
      } else {
        field.setAttribute('aria-label', text);
      }
    }
    const named = labels.length > 0 || text !== '';
    if (named) {
      this.warnedNoName = false;
    } else if (this.settled && !this.warnedNoName) {
      this.warnedNoName = true;
      devWarn('the field has no accessible name: associate a label (nph-label for, or nph-field) or set label. The placeholder is not a name.');
    }
  }

  /* --- Drawing ---------------------------------------------------------------- */

  private glyph(name: string, className: string): TemplateResult | typeof nothing {
    return name === NPH_INPUT_NO_ICON ? nothing : html`<nph-icon class=${className} name=${name} size="sm"></nph-icon>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const inactive = this.inactive;
    const description = (this.description ?? '').trim();
    const autocomplete = (this.autocomplete ?? '').trim();
    const placeholder = this.placeholder ?? '';
    const showClear = this.clearable && this.current !== '' && !inactive;

    return html`<div class="control">
      ${this.glyph(iconValue(this.iconStart), 'icon-start')}
      <input
        class="field"
        type=${(this.type ?? '').trim()}
        .value=${this.current}
        placeholder=${placeholder === '' ? nothing : placeholder}
        autocomplete=${autocomplete === '' ? nothing : autocomplete}
        ?required=${this.required}
        ?disabled=${inactive}
        aria-invalid=${this.invalid && !inactive ? 'true' : nothing}
        aria-describedby=${description === '' ? nothing : 'description'}
        @change=${this.onChange}
        @keydown=${this.onKeydown}
      />
      ${showClear
        ? html`<button class="clear" type="button" aria-label=${(this.clearLabel ?? '').trim()} @click=${this.clear}>
            ${this.glyph(iconValue(this.iconEnd), 'icon-end')}
          </button>`
        : nothing}
      ${description === '' ? nothing : html`<span class="description" id="description">${description}</span>`}
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
