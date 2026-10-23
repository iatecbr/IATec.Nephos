/**
 * `nph-radio` — the circle the person checks to choose one option in a group; checking
 * one unchecks the others.
 *
 * Contract accepted in Figma (frame `1196:311`, set `848:66`), decisions D1 to D5 of the
 * task DSA-18, sheet `fichas/nph-radio.md`, `design.md` and decision P82 — nph-radio: API
 * and semantics. The form pattern follows P80 and the field contract follows P83:
 * - the host IS the control. It is form-associated (`ElementInternals`), its role is
 *   `radio` with `aria-checked` and `aria-disabled` set through the internals, and it takes
 *   the focus itself. There is no inner `<input>`: an input inside a shadow root is in
 *   another tree than its siblings, so native exclusivity and arrow keys would not reach
 *   them, and it would not join the form outside;
 * - `checked`: the current state (the Figma `marcado`). It does not reflect. The `checked`
 *   ATTRIBUTE is the initial state and the state `form.reset()` returns to; a later change
 *   of the attribute moves the current state only while the piece is not dirty (neither the
 *   person nor code changed `checked`), the rule of the native radio;
 * - `name` and `value` reflect, because the form reads the attributes of the host. `value`
 *   is `on` by default, and the default is also written as the attribute. Only the checked
 *   radio enters the `FormData`, under `name`;
 * - the group is not an element: radios with the same non-empty `name`, in the same root
 *   (`getRootNode()`, never `document`) and with the same form owner, are one group.
 *   Checking one unchecks the others, from the person or from code. A radio without a
 *   name is a group of one;
 * - keyboard (WAI-ARIA APG, Radio Group): one Tab stop per group, on the checked radio or,
 *   with none checked, on the first one that responds. The arrow keys move the focus to the
 *   next or previous radio that responds, wrapping, and check it; Space checks the focused
 *   one. The piece owns the `tabindex` of the host;
 * - a click on the piece (circle or text), `click()` or a `<label for>` checks it. A click
 *   on the checked radio changes nothing and fires nothing, but the `click` still bubbles;
 * - events: when the person checks it, the host fires the native `input` (bubbles,
 *   composed) and then `change` (bubbles). A change from code never fires them;
 * - `text`: the visible text, which is also the accessible name. Without it, the piece is
 *   only the 24 × 24 circle (the Figma `mostrar rótulo` off) and needs `label`;
 * - `label`: the accessible name when there is no text, never visible. A name the consumer
 *   puts on the host (`aria-label` or `aria-labelledby`) also counts;
 * - `invalid`: the error border. It is visual only: `aria-invalid` is not supported on the
 *   `radio` role, and the error belongs to the group, in `nph-field`;
 * - `disabled`, or a `<fieldset disabled>` around it: the whole piece at
 *   `state/disabled-opacity`, out of the Tab order and the arrow keys. `disabled` wins over
 *   `invalid` (D7);
 * - `static nphFieldRole = 'radio'`: `nph-field` wraps the options in a `radiogroup` (P83);
 * - no size, no indeterminate, no `required`, no slot, no `::part`, no color property;
 * - invalid input does not render and emits `console.error` only in development (P21
 *   rule): no accessible name. A problem in the composition renders anyway and emits
 *   `console.warn` only in development, once while it lasts: no `name`, and a group of one.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import radioCss from './nph-radio.css?inline';

const TAG = 'nph-radio';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The value a checked radio submits when it has none, as the native radio does. */
export const NPH_RADIO_DEFAULT_VALUE = 'on';

/** The arrow keys that move to the next radio of the group, and to the previous one. */
const NEXT_KEYS = ['ArrowDown', 'ArrowRight'];
const PREVIOUS_KEYS = ['ArrowUp', 'ArrowLeft'];

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
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

/** An empty string is no attribute: an empty `name` is not written on the host. */
const nameConverter = {
  fromAttribute: (attribute: string | null): string => attribute ?? '',
  toAttribute: (value: string | null): string | null => (value === null || value === '' ? null : value),
};

/** A removed `value` attribute is the default again, so the property and the form agree. */
const valueConverter = {
  fromAttribute: (attribute: string | null): string => attribute ?? NPH_RADIO_DEFAULT_VALUE,
  toAttribute: (value: string): string => value,
};

/**
 * The state kept for history restoration. An unchecked radio needs one too: `null` is not
 * restored, and the radio would come back checked by its attribute.
 */
const RESTORE_CHECKED = 'nph-radio:checked';
const RESTORE_UNCHECKED = 'nph-radio:unchecked';

export class NphRadio extends LitElement {
  static override styles = unsafeCSS(radioCss);

  /* The host joins forms through `ElementInternals`. */
  static formAssociated = true;

  /** How `nph-field` wraps this control: options of a `radiogroup` (P83). */
  static readonly nphFieldRole = 'radio';

  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'checked', 'aria-label', 'aria-labelledby'];
  }

  static override properties = {
    /* The attribute is the initial state, read by hand: see `attributeChangedCallback`. */
    checked: { type: Boolean, attribute: false, noAccessor: true },
    /* Reflects: the attribute is what makes the host match `:disabled`. */
    disabled: { type: Boolean, reflect: true },
    /* Reflects: the internal CSS reads it. */
    invalid: { type: Boolean, reflect: true },
    /* Reflect: the form reads the attributes of the host, not the properties. */
    name: { type: String, reflect: true, converter: nameConverter },
    value: { type: String, reflect: true, converter: valueConverter },
    text: { type: String },
    label: { type: String },
  };

  declare disabled: boolean;
  declare invalid: boolean;
  /** The group and the key in the `FormData`. Empty: a group of one, not submitted. */
  declare name: string;
  /** What the checked radio submits. */
  declare value: string;
  /** The visible text, already localized; it is also the accessible name. */
  declare text: string;
  /** The accessible name when there is no text, never visible. */
  declare label: string;

  private readonly internals: ElementInternals;
  private checkedState = false;
  /** True once the person or code changed `checked`: the attribute stops moving it. */
  private dirty = false;
  /** Set by a `<fieldset disabled>` around the piece. */
  private formDisabled = false;
  private valid = false;
  private accessibleNameChanged = false;
  /** The root and name the piece had when connected, to settle that group when it leaves. */
  private connectedRoot: Document | ShadowRoot | null = null;
  private connectedName = '';
  /** The composition warnings already shown, so a problem that stays does not repeat. */
  private shownWarnings = new Set<string>();
  private compositionFrame = 0;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.internals.role = 'radio';
    this.internals.ariaChecked = 'false';
    this.disabled = false;
    this.invalid = false;
    this.name = '';
    this.value = NPH_RADIO_DEFAULT_VALUE;
    this.text = '';
    this.label = '';
    /* `click()` called on the host itself also stops when the piece does not respond. */
    this.addEventListener('click', (event) => this.blockInactive(event), { capture: true });
    this.addEventListener('click', () => this.checkByPerson());
    this.addEventListener('keydown', (event) => this.onKeydown(event));
  }

  /** The current state. Changing it from code unchecks the group and fires nothing. */
  get checked(): boolean {
    return this.checkedState;
  }

  set checked(value: boolean) {
    this.dirty = true;
    this.applyChecked(Boolean(value));
  }

  /** The form that owns the piece, as on a native control. */
  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  /** The `<label>` elements associated with the piece. */
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

  override connectedCallback(): void {
    super.connectedCallback();
    this.connectedRoot = this.getRootNode() as Document | ShadowRoot;
    this.connectedName = this.name ?? '';
    /* A checked radio that arrives unchecks the group it joins, as the native one does. */
    if (this.checkedState) {
      this.uncheckOthers();
    }
    this.syncGroup();
    this.scheduleCompositionCheck();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    cancelAnimationFrame(this.compositionFrame);
    this.settleNamed(this.connectedRoot, this.connectedName);
    this.connectedRoot = null;
  }

  override attributeChangedCallback(name: string, old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, old, value);
    if (name === 'checked' && !this.dirty) {
      this.applyChecked(value !== null);
    }
    if (name === 'aria-label' || name === 'aria-labelledby') {
      this.accessibleNameChanged = true;
      this.requestUpdate();
    }
  }

  formAssociatedCallback(): void {
    if (this.checkedState) {
      this.uncheckOthers();
    }
    this.settleNamed(this.connectedRoot, this.connectedName);
    this.syncGroup();
  }

  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled;
    this.syncInternals();
    this.syncGroup();
  }

  formResetCallback(): void {
    this.dirty = false;
    this.applyChecked(this.hasAttribute('checked'));
  }

  /** `restore` brings back the state written by `syncInternals`; `autocomplete` brings a value. */
  formStateRestoreCallback(state: unknown): void {
    this.dirty = true;
    this.applyChecked(state === RESTORE_CHECKED || (state !== RESTORE_UNCHECKED && state !== null && state === this.value));
  }

  /** Disabled, inside a disabled fieldset, or not drawn: the piece does not respond. */
  private get inactive(): boolean {
    return this.disabled || this.formDisabled || !this.valid;
  }

  /** Sets the state, unchecks the group when it turns on, and settles the form and the focus. */
  private applyChecked(value: boolean): void {
    const old = this.checkedState;
    if (old === value) {
      return;
    }
    this.checkedState = value;
    this.requestUpdate('checked', old);
    if (value) {
      this.uncheckOthers();
    }
    this.syncInternals();
    this.syncGroup();
  }

  /** The other radios of the group lose the check; they do not become dirty, as in the native radio. */
  private uncheckOthers(): void {
    for (const radio of this.group()) {
      if (radio !== this && radio.checkedState) {
        radio.checkedState = false;
        radio.requestUpdate('checked', true);
        radio.syncInternals();
      }
    }
  }

  /**
   * Radios with the same non-empty name, in the same root and with the same form owner, in
   * tree order. A detached tree is a root too, as for the native radio: markup parsed with
   * two checked radios keeps the last one before it reaches the page.
   */
  private group(): NphRadio[] {
    const name = this.name ?? '';
    const root = this.getRootNode();
    if (name === '' || root === this) {
      return [this];
    }
    const form = this.internals.form;
    return [...(root as ParentNode).querySelectorAll(TAG)].filter(
      (element): element is NphRadio => element instanceof NphRadio && element.name === name && element.internals.form === form,
    );
  }

  /** Settles every radio named `name` in `root`, after one of them left or changed group. */
  private settleNamed(root: Document | ShadowRoot | null, name: string): void {
    if (root === null || name === '') {
      return;
    }
    for (const element of root.querySelectorAll(TAG)) {
      if (element instanceof NphRadio && element !== this && element.name === name) {
        element.syncGroup();
        element.scheduleCompositionCheck();
      }
    }
  }

  /** One Tab stop per group: the checked radio that responds, or the first one that responds. */
  private syncGroup(): void {
    const members = this.group();
    const responsive = members.filter((radio) => !radio.inactive);
    const stop = responsive.find((radio) => radio.checkedState) ?? responsive[0];
    for (const radio of members) {
      if (radio.inactive) {
        radio.removeAttribute('tabindex');
      } else {
        radio.setAttribute('tabindex', radio === stop ? '0' : '-1');
      }
    }
  }

  /** State, availability and the value the form receives. */
  private syncInternals(): void {
    this.internals.ariaChecked = this.checkedState ? 'true' : 'false';
    this.internals.ariaDisabled = this.disabled || this.formDisabled ? 'true' : null;
    const value = this.value ?? NPH_RADIO_DEFAULT_VALUE;
    /* A radio that is not drawn (no accessible name) submits nothing, as in `nph-input`. */
    this.internals.setFormValue(this.checkedState && this.valid ? value : null, this.checkedState ? RESTORE_CHECKED : RESTORE_UNCHECKED);
  }

  /** When the piece does not respond, the click neither checks it nor reaches the consumer. */
  private blockInactive(event: Event): void {
    if (this.inactive) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  /** The person checked the piece: it takes the check and says so, once. */
  private checkByPerson(): void {
    if (this.inactive || this.checkedState) {
      return;
    }
    this.dirty = true;
    this.applyChecked(true);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private onKeydown(event: KeyboardEvent): void {
    if (this.inactive || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    if (event.key === ' ') {
      event.preventDefault();
      this.checkByPerson();
      return;
    }
    const step = NEXT_KEYS.includes(event.key) ? 1 : PREVIOUS_KEYS.includes(event.key) ? -1 : 0;
    if (step === 0) {
      return;
    }
    event.preventDefault();
    const responsive = this.group().filter((radio) => !radio.inactive);
    const index = responsive.indexOf(this);
    const next = responsive[(index + step + responsive.length) % responsive.length];
    if (next === undefined) {
      return;
    }
    next.focus();
    next.checkByPerson();
  }

  /** The composition is read one frame later, so siblings parsed after this one are found. */
  private scheduleCompositionCheck(): void {
    cancelAnimationFrame(this.compositionFrame);
    this.compositionFrame = requestAnimationFrame(() => this.checkComposition());
  }

  private checkComposition(): void {
    if (!this.isConnected) {
      return;
    }
    const name = this.name ?? '';
    const problems = new Map<string, string>();
    if (name === '') {
      problems.set('no-name', 'without name, the radio is a group of one: a radio never shows alone. Give the radios of the group the same name.');
    } else if (this.group().length < 2) {
      problems.set('alone', `the group "${name}" has a single radio: a radio never shows alone, so use two or more, or nph-checkbox.`);
    }
    for (const [cause, message] of problems) {
      if (!this.shownWarnings.has(cause)) {
        this.shownWarnings.add(cause);
        devWarn(message);
      }
    }
    for (const cause of [...this.shownWarnings]) {
      if (!problems.has(cause)) {
        this.shownWarnings.delete(cause);
      }
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has('name')) {
      const previous = (changed.get('name') as string | undefined) ?? '';
      if (this.isConnected) {
        if (this.checkedState) {
          this.uncheckOthers();
        }
        this.settleNamed(this.connectedRoot, previous);
        this.connectedName = this.name ?? '';
        this.scheduleCompositionCheck();
      }
    }

    /* Only the inputs that decide the name are checked again, so the error does not repeat on a check. */
    const decisive = this.accessibleNameChanged || changed.has('text') || changed.has('label');
    if (decisive) {
      this.accessibleNameChanged = false;
      const text = (this.text ?? '').trim();
      const label = (this.label ?? '').trim();
      const ownName =
        (this.getAttribute('aria-label') ?? '').trim() !== '' || (this.getAttribute('aria-labelledby') ?? '').trim() !== '';
      const valid = text !== '' || label !== '' || ownName;
      if (!valid) {
        devError('without text, the piece needs a label (or aria-label or aria-labelledby on the host): it is the accessible name of the radio.');
      }
      this.valid = valid;
      this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
      this.internals.ariaLabel = text !== '' ? text : label !== '' ? label : null;
    }

    if (changed.has('disabled') || changed.has('value') || decisive) {
      this.syncInternals();
    }
    if (changed.has('disabled') || changed.has('name') || decisive) {
      this.syncGroup();
    }
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const text = (this.text ?? '').trim();
    return html`<span class="target"
        ><span class=${this.checkedState ? 'circle checked' : 'circle'}><span class="dot"></span></span></span
      >${text === '' ? nothing : html`<span class="text">${text}</span>`}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphRadio);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-radio': NphRadio;
  }
}
