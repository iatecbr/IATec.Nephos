/**
 * `nph-textarea` — the multi-line field to write a long text, such as a comment or a
 * message.
 *
 * Contract accepted in Figma (frame `1632:24`, documentation `1922:642`, set `1632:22`),
 * sheet `fichas/nph-textarea.md`, `design.md` and decision P93 — nph-textarea: API and
 * semantics. It follows the form pattern of P80 (nph-input) and the field contract of P83:
 * - `value`: the current value. The `value` ATTRIBUTE is the initial value and the value
 *   of `form.reset()`: it applies only while the person has not edited the field and
 *   setting the property has not made it dirty;
 * - `placeholder`, `required` and `name`, passed to the inner native `<textarea>`.
 *   `name` reflects because the form reads the attribute of the host;
 * - `readOnly` (attribute `readonly`): the Figma `leitura`. The person reads, selects and
 *   copies the text, and does not edit it. No hover, no error look, no footer;
 * - `invalid`: the `erro` state, an error border and `aria-invalid`. The sentence belongs
 *   to `nph-field`; `invalid` is not a constraint of the form;
 * - `disabled`: native `disabled` on the inner field and on the footer actions. It wins
 *   over `readOnly` and `invalid`. A disabled `<fieldset>` disables the piece too;
 * - `label` and `description`: the accessible name and description in text, never
 *   visible, that `nph-field` writes. An associated label wins over `label`;
 * - `counter`: the footer counter text, shown as it comes, such as `0/280`. The piece
 *   counts nothing and has no `maxlength`: a limit warns, it does not block typing;
 * - the `actions` slot: the footer actions, `nph-button` instances of the consumer. The
 *   footer shows when there is a counter or an action, never in `readOnly`;
 * - events: the native ones. `input` from the inner field crosses the shadow root;
 *   `change` does not, so the host fires it again. Setting `value` from code fires
 *   nothing. Enter writes a new line: it does not submit the form;
 * - the field grows with the text from `layout/textarea-min-height` and scrolls inside
 *   above `layout/textarea-max-height`. There is no resize handle;
 * - no `::part`, no color property, no size, no event of its own.
 *
 * There is no invalid input that draws nothing: the piece has no enumerated property. A
 * field with no accessible name, and a footer in `readOnly`, render and warn once each in
 * development.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import textareaCss from './nph-textarea.css?inline';

const TAG = 'nph-textarea';

/** Development warning, for a composition that still renders. */
function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

export class NphTextarea extends LitElement {
  static override styles = unsafeCSS(textareaCss);

  /* Host focus, and a click on the label or the frame, go to the inner native `<textarea>`. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* The host takes part in the form: labelable, with a value and a validity of its own. */
  static formAssociated = true;

  static override properties = {
    /* The `value` attribute is the default, read by hand (see `attributeChangedCallback`). */
    value: { attribute: false, noAccessor: true },
    placeholder: { type: String },
    /* `name` reflects because the form reads the attribute of the host, not the property. */
    name: { type: String, reflect: true },
    /* The reflected booleans are read by the internal CSS and by the consumer's selectors. */
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, reflect: true, attribute: 'readonly' },
    invalid: { type: Boolean, reflect: true },
    label: { type: String },
    description: { type: String },
    counter: { type: String },
  };

  /** The invitation before writing, already localized by the consuming application. */
  declare placeholder: string;
  /** Name of the entry in the form data. */
  declare name: string | null;
  declare required: boolean;
  declare disabled: boolean;
  /** The Figma `leitura`: a text the person reads and does not edit. */
  declare readOnly: boolean;
  declare invalid: boolean;
  /** Accessible name in text, never visible. An associated label wins over it. */
  declare label: string;
  /** Accessible description in text, never visible: the help or the error sentence. */
  declare description: string;
  /** The footer counter text, shown as it comes. Already localized. */
  declare counter: string;

  private readonly internals: ElementInternals;
  private readonly labelObserver = new MutationObserver(() => this.syncName());
  private current = '';
  /** Edited by the person or set by code: the `value` attribute no longer applies. */
  private dirty = false;
  /** There is at least one element in the `actions` slot. */
  private hasActions = false;
  /** The actions the piece disabled, to give back only those. */
  private readonly forcedDisabled = new WeakSet<Element>();
  /** The actions the piece wrote on, to give back what it forced when they leave. */
  private managedActions = new Set<Element>();
  /** After the first frame, a label rendered by another element has had its chance. */
  private settled = false;
  private warnedNoName = false;
  private warnedReadOnlyFooter = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.placeholder = '';
    this.name = null;
    this.required = false;
    this.disabled = false;
    this.readOnly = false;
    this.invalid = false;
    this.label = '';
    this.description = '';
    this.counter = '';
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

  /* --- The person writes ------------------------------------------------------ */

  private get field(): HTMLTextAreaElement | null {
    return this.renderRoot?.querySelector<HTMLTextAreaElement>('textarea') ?? null;
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

  private onActionsChange(): void {
    this.requestUpdate();
  }

  /* --- Footer ------------------------------------------------------------------ */

  /** The elements of the `actions` slot: light DOM children with `slot="actions"`. */
  private get actions(): Element[] {
    return [...this.children].filter((child) => child.getAttribute('slot') === 'actions');
  }

  private get counterText(): string {
    return (this.counter ?? '').trim();
  }

  /** The footer has content: a counter or an action. */
  private get footerContent(): boolean {
    return this.counterText !== '' || this.hasActions;
  }

  protected override willUpdate(_changed: PropertyValues): void {
    this.hasActions = this.actions.length > 0;
    if (this.readOnly && this.footerContent) {
      if (!this.warnedReadOnlyFooter) {
        this.warnedReadOnlyFooter = true;
        devWarn('the footer does not apply to readonly: there is nothing to send. The counter and the actions were not drawn.');
      }
    } else {
      this.warnedReadOnlyFooter = false;
    }
  }

  /** `disabled` adds up on the actions: on while the piece is inactive; given back only where it was turned on. */
  private syncActions(): void {
    const inactive = this.inactive;
    const next = new Set(this.actions);
    for (const element of this.managedActions) {
      if (!next.has(element)) {
        this.giveBack(element);
      }
    }
    for (const element of next) {
      const target = element as unknown as { disabled?: unknown };
      if (!('disabled' in element)) {
        continue;
      }
      if (inactive) {
        if (target.disabled !== true) {
          target.disabled = true;
          this.forcedDisabled.add(element);
        }
      } else {
        this.giveBack(element);
      }
    }
    this.managedActions = next;
  }

  private giveBack(element: Element): void {
    if (this.forcedDisabled.has(element)) {
      (element as unknown as { disabled: boolean }).disabled = false;
      this.forcedDisabled.delete(element);
    }
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
    if (field !== null && this.current !== field.value) {
      const old = this.current;
      this.current = field.value;
      this.requestUpdate('value', old);
    }
    this.syncFormState();
    this.syncActions();
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
    if (field === null) {
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

  protected override render(): TemplateResult {
    const inactive = this.inactive;
    const readOnly = this.readOnly && !inactive;
    const description = (this.description ?? '').trim();
    const placeholder = this.placeholder ?? '';
    const counter = this.counterText;
    const footer = this.footerContent && !this.readOnly;

    return html`<div class="control">
      <textarea
        class="field"
        .value=${this.current}
        placeholder=${placeholder === '' ? nothing : placeholder}
        ?required=${this.required}
        ?readonly=${readOnly}
        ?disabled=${inactive}
        aria-invalid=${this.invalid && !inactive && !readOnly ? 'true' : nothing}
        aria-describedby=${description === '' ? nothing : 'description'}
        @change=${this.onChange}
      ></textarea>
      <div class="footer" ?hidden=${!footer}>
        ${counter === '' ? nothing : html`<span class="counter">${counter}</span>`}
        <div class="actions"><slot name="actions" @slotchange=${this.onActionsChange}></slot></div>
      </div>
      ${description === '' ? nothing : html`<span class="description" id="description">${description}</span>`}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphTextarea);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-textarea': NphTextarea;
  }
}
