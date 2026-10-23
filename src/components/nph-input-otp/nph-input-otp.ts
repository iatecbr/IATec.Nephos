/**
 * `nph-input-otp` — the short code field, one cell per character, for a code sent by
 * SMS or e-mail.
 *
 * Contract accepted in Figma (board `1633:122`, set `1633:120`, cell set `1633:29`),
 * sheet `fichas/nph-input-otp.md`, `design.md` and decision P85 — nph-input-otp: API
 * and semantics. The form pattern is the one of P80 (`nph-input`) and the contract with
 * the field is the one of P83 (`nph-field`):
 * - one native `<input>` inside the shadow root, transparent and laid over the row of
 *   cells. The cells only draw: they are `aria-hidden`, and the code is one value with
 *   one name. `autocomplete="one-time-code"` lets the browser offer a code it received;
 * - `length`: 6 (default) or 4 cells, the Figma `digitos`;
 * - `size`: `default` (36) or `large` (44), the same in every cell;
 * - `invalid`: the Figma `state=erro`, error border on every cell and `aria-invalid`;
 * - `disabled`: out of the Tab order, background `color/muted` and the whole field at
 *   `state/disabled-opacity`. A disabled `<fieldset>` disables it too. `disabled` wins
 *   over `invalid`;
 * - `masked`: the Figma `ocultar dígito`, brought to the host because the cells are not
 *   public. Every filled cell shows a dot. The mask is visual only: the input stays
 *   `type="text"`, so a screen reader reads the code;
 * - `value`: the code. Only ASCII letters and digits are kept, up to `length`. The
 *   attribute `value` is the initial value and the value of `form.reset()`; the
 *   property is the current value, as in a native input;
 * - `label` and `description`: the accessible name and description, as text, that the
 *   `nph-field` writes (P83). A `<label>` associated with the host names the field first;
 *   `label` is the name when there is no associated label;
 * - `required`: announced as `aria-required`. There is no constraint validation: the
 *   error sentence belongs to the `nph-field`;
 * - `name`: reflects, because the form reads the attribute of the host;
 * - events: the native `input` of the inner input crosses the shadow root on its own;
 *   the host fires `change` when the value is committed (blur or Enter). Setting
 *   `value` from code never fires either. Enter submits the form, as a native input does;
 * - no slot, no `::part`, no color property and no own event;
 * - invalid input does not render and emits `console.error` only in development, one
 *   per cause (the rule of P21): `length` other than 4 or 6, and `size` outside the
 *   list. No accessible name renders anyway and emits `console.warn` only in
 *   development, once while it lasts: the name may arrive after the first draw.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

import inputOtpCss from './nph-input-otp.css?inline';

const TAG = 'nph-input-otp';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_INPUT_OTP_LENGTHS = [6, 4] as const;
export type NphInputOtpLength = (typeof NPH_INPUT_OTP_LENGTHS)[number];

export const NPH_INPUT_OTP_SIZES = ['default', 'large'] as const;
export type NphInputOtpSize = (typeof NPH_INPUT_OTP_SIZES)[number];

/** The character a masked cell shows in place of the one typed. */
export const NPH_INPUT_OTP_MASK = '•';

/** What the code may hold: ASCII letters and digits. */
const NOT_ALLOWED = /[^A-Za-z0-9]/g;

/** Development messages; outside a bundler with `import.meta.env`, they stay silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

function isLength(value: number): value is NphInputOtpLength {
  return (NPH_INPUT_OTP_LENGTHS as readonly number[]).includes(value);
}

function isSize(value: string): value is NphInputOtpSize {
  return (NPH_INPUT_OTP_SIZES as readonly string[]).includes(value);
}

/** Keeps only letters and digits; case stays as typed. */
function clean(value: string): string {
  return value.replace(NOT_ALLOWED, '');
}

/** The first submit button whose form owner is the form, as the default button of HTML (P80). */
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

export class NphInputOtp extends LitElement {
  static override styles = unsafeCSS(inputOtpCss);

  /* Host focus, and a click on an associated label, go to the inner input. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* The host takes part in its form: name, value, reset, restore and fieldset disabled. */
  static formAssociated = true;

  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'value'];
  }

  static override properties = {
    /* The reflected ones are read by the internal CSS; `name` is read by the form. */
    length: { type: Number, reflect: true },
    size: { type: String, reflect: true },
    invalid: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    masked: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    value: { attribute: false },
    label: { type: String },
    description: { type: String },
  };

  /** 6 or 4 cells. */
  declare length: number;
  /** `default` or `large`. */
  declare size: string;
  declare invalid: boolean;
  declare disabled: boolean;
  /** Shows a dot in place of each character. */
  declare masked: boolean;
  /** Announced as `aria-required`; no constraint validation. */
  declare required: boolean;
  /** The name of the entry in the form data. */
  declare name: string | null;
  /** Accessible name, as text, when no label is associated with the host. */
  declare label: string;
  /** Accessible description, as text: the help or the error sentence of the field. */
  declare description: string;

  private readonly internals: ElementInternals;
  private current = '';
  /** Set once the person or the code changes the value: the attribute is then only the reset value. */
  private dirty = false;
  private valid = false;
  private focused = false;
  private caret = 0;
  /** A disabled `<fieldset>` around the host. */
  private formDisabled = false;
  /** The value when the field took focus, to know whether `change` is due. */
  private committed = '';
  private namelessWarned = false;
  /** Follows labels of the root that are added, removed or pointed elsewhere (P80). */
  private readonly labelObserver = new MutationObserver(() => this.applyName(false));

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.length = 6;
    this.size = 'default';
    this.invalid = false;
    this.disabled = false;
    this.masked = false;
    this.required = false;
    this.name = null;
    this.label = '';
    this.description = '';
    /* Registered first, in capture on the host: the value and the form data are settled
       before any listener of the consumer runs, as in `nph-input` (P80). */
    this.addEventListener('input', this.onInput, { capture: true });
  }

  /** The code: letters and digits only, up to `length`. Setting it from code fires nothing. */
  get value(): string {
    return this.current;
  }

  set value(next: string) {
    this.dirty = true;
    this.current = this.fit(String(next ?? ''), true);
    this.settle();
  }

  /**
   * A value set by code or by a reset: the form data follows at once, and the value at
   * focus moves with it, so leaving the field fires no `change` for it.
   */
  private settle(): void {
    this.committed = this.current;
    this.syncForm();
  }

  /** The form data, at once: nothing while the input is invalid and the field draws nothing. */
  private syncForm(): void {
    if (isLength(this.length) && isSize(this.size ?? '')) {
      this.internals.setFormValue(this.current, this.current);
    } else {
      this.internals.setFormValue(null);
    }
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

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'value' && !this.dirty) {
      this.applyDefault();
    }
  }

  /** The value the form gets back on reset: the `value` attribute, cleaned. */
  private applyDefault(): void {
    const previous = this.current;
    this.current = this.fit(this.getAttribute('value') ?? '', true);
    this.settle();
    this.requestUpdate('value', previous);
  }

  /** Cleans a value and cuts it at `length`; from code, what was dropped is reported. */
  private fit(value: string, fromCode: boolean): string {
    const max = isLength(this.length) ? this.length : NPH_INPUT_OTP_LENGTHS[0];
    const fitted = clean(value).slice(0, max);
    if (fromCode && fitted !== value) {
      devWarn(`value "${value}" keeps only letters and digits, up to ${max}: it became "${fitted}".`);
    }
    return fitted;
  }

  formResetCallback(): void {
    this.dirty = false;
    this.applyDefault();
  }

  formStateRestoreCallback(state: string | File | FormData | null): void {
    if (typeof state === 'string') {
      this.value = state;
    }
  }

  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled;
    this.requestUpdate();
  }

  /** The form that owns the host, if any. */
  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  /** The labels associated with the host. */
  get labels(): NodeList {
    return this.internals.labels;
  }

  private get inactive(): boolean {
    return this.disabled || this.formDisabled;
  }

  private input(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector('input') ?? null;
  }

  protected override willUpdate(changed: PropertyValues): void {
    /* Only the inputs that decide validity are checked again, so the errors do not repeat. */
    if (changed.has('length') || changed.has('size') || !this.hasUpdated) {
      let valid = true;
      if (!isLength(this.length)) {
        devError(`length "${String(this.length)}" is not 4 or 6.`);
        valid = false;
      }
      if (!isSize(this.size ?? '')) {
        devError(`size "${String(this.size)}" is not "default" or "large".`);
        valid = false;
      }
      this.valid = valid;
      this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
    }
    if (changed.has('length') && this.valid && this.current.length > this.length) {
      this.current = this.current.slice(0, this.length);
    }
    this.syncForm();
  }

  protected override firstUpdated(): void {
    /* The label of an `nph-label` is drawn after this field: look for a name on the next frame. */
    requestAnimationFrame(() => this.applyName(true));
  }

  protected override updated(changed: PropertyValues): void {
    this.applyName(changed.has('label') && changed.get('label') !== undefined);
  }

  /**
   * The bridge of P80: an associated label names the inner input through element
   * references, which cross into this shadow root; without one, `label` is the name.
   */
  private applyName(check: boolean): void {
    const input = this.input();
    if (input === null) {
      return;
    }
    const labels = [...this.internals.labels].filter((node): node is Element => node instanceof Element);
    const label = (this.label ?? '').trim();
    if (labels.length > 0) {
      input.ariaLabelledByElements = labels;
      input.removeAttribute('aria-label');
    } else {
      input.ariaLabelledByElements = null;
      if (label !== '') {
        input.setAttribute('aria-label', label);
      } else {
        input.removeAttribute('aria-label');
      }
    }
    const named = labels.length > 0 || label !== '';
    if (named) {
      this.namelessWarned = false;
    } else if (check && !this.namelessWarned) {
      devWarn('the field needs a name: put it in an nph-field, associate a label, or set label.');
      this.namelessWarned = true;
    }
  }

  /**
   * The person typed, deleted, pasted or the browser filled in a code. It runs in capture
   * on the host, before the listeners of the consumer, and reads the inner input itself.
   */
  private readonly onInput = (event: Event): void => {
    const input = this.input();
    if (input === null) {
      return;
    }
    const raw = input.value;
    const caret = input.selectionStart ?? raw.length;
    const next = this.fit(raw, false);
    const caretAfter = Math.min(this.fit(raw.slice(0, caret), false).length, next.length);
    const previous = this.current;
    if (raw !== next) {
      input.value = next;
      input.setSelectionRange(caretAfter, caretAfter);
    }
    this.caret = caretAfter;
    /* A character that was dropped changes nothing: no listener of the host hears it. */
    if (next === previous) {
      event.stopImmediatePropagation();
      this.requestUpdate();
      return;
    }
    this.dirty = true;
    this.current = next;
    this.syncForm();
    this.requestUpdate('value', previous);
  };

  /** A pasted code replaces the whole value, cleaned and cut at `length`. */
  private onPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') ?? '';
    const next = this.fit(text, false);
    event.preventDefault();
    if (next === '' || next === this.current) {
      return;
    }
    /* The native paste is stopped; the input event it would fire goes through `onInput`. */
    const input = event.target as HTMLInputElement;
    input.value = next;
    input.setSelectionRange(next.length, next.length);
    input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertFromPaste', data: text }));
  }

  /**
   * Enter submits the form, as in a native field: the default button, or the form itself.
   * It is decided at the end of the propagation, as the default action of a native field
   * (P80), so a consumer that cancels Enter anywhere on the path keeps the form.
   */
  private onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.isComposing) {
      return;
    }
    this.commit();
    const form = this.internals.form;
    const view = this.ownerDocument.defaultView;
    if (form === null || view === null) {
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

  /** The value differs from the one at focus: the host fires `change`, as a native input does. */
  private commit(): void {
    if (this.current !== this.committed) {
      this.committed = this.current;
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  private onFocus(event: FocusEvent): void {
    this.focused = true;
    this.committed = this.current;
    /* The selection is invisible: the caret goes to the next empty cell instead of selecting the code. */
    const input = event.target as HTMLInputElement;
    input.setSelectionRange(this.current.length, this.current.length);
    this.trackCaret();
    this.applyName(true);
  }

  private onBlur(): void {
    this.focused = false;
    this.commit();
    this.requestUpdate();
  }

  /** The active cell follows the caret. */
  private trackCaret(): void {
    const input = this.input();
    if (input === null) {
      return;
    }
    this.caret = input.selectionStart ?? this.current.length;
    this.requestUpdate();
  }

  /** A click on a cell puts the caret on that cell, or at the end of the code. */
  private onClick(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    const cells = [...(this.shadowRoot?.querySelectorAll<HTMLElement>('.cell') ?? [])];
    const index = cells.findIndex((cell) => event.clientX < cell.getBoundingClientRect().right);
    const position = Math.min(index === -1 ? cells.length : index, this.current.length);
    input.setSelectionRange(position, position);
    this.trackCaret();
  }

  /** The active cell: the caret, on the last cell when the code is full. */
  private activeCell(): number {
    if (!this.focused || this.inactive) {
      return -1;
    }
    return Math.min(this.caret, this.length - 1);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const active = this.activeCell();
    const description = (this.description ?? '').trim();
    const cells = Array.from({ length: this.length }, (_, index) => {
      const character = this.current[index] ?? '';
      const shown = character === '' ? '' : this.masked ? NPH_INPUT_OTP_MASK : character;
      return html`<span class="cell" ?data-active=${index === active}>${shown}</span>`;
    });
    return html`<span class="field">
      <span class="cells" aria-hidden="true">${cells}</span>
      <input
        class="native"
        type="text"
        autocomplete="one-time-code"
        inputmode="text"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        maxlength=${this.length}
        .value=${live(this.current)}
        ?disabled=${this.inactive}
        aria-invalid=${this.invalid && !this.inactive ? 'true' : nothing}
        aria-required=${this.required ? 'true' : nothing}
        aria-describedby=${description === '' ? nothing : 'description'}
        @paste=${this.onPaste}
        @keydown=${this.onKeydown}
        @focus=${this.onFocus}
        @blur=${this.onBlur}
        @click=${this.onClick}
        @selectionchange=${this.trackCaret}
        @keyup=${this.trackCaret}
      />
      ${description === '' ? nothing : html`<span id="description" class="description">${description}</span>`}
    </span>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphInputOtp);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-input-otp': NphInputOtp;
  }
}
