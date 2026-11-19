/**
 * `nph-rich-option` — the card of a form choice with a title and a description, where the
 * whole card checks the option.
 *
 * Contract accepted in Figma (frame `6935:11785`, set `6910:6828`), task DSA-91, sheet
 * `fichas/nph-rich-option.md`, `design.md` and decision P134 — nph-rich-option: API and
 * semantics. The rich look of the option of the `nph-select` and `nph-combobox` list is the
 * `rich` attribute of `nph-option`, not this tag. The form pattern follows P80, P81 and P82:
 * - WHO HOLDS THE ROLE AND THE FOCUS: the card. The host IS the control, as the host of
 *   `nph-radio` is: its role is `checkbox`, `radio` or `switch` with `aria-checked` and
 *   `aria-disabled` set through `ElementInternals`, and it takes the focus itself. The control
 *   drawn at its start (`nph-checkbox`, `nph-radio` or `nph-switch`, default size) is a visual
 *   indicator: `inert` and hidden from the screen reader, as the box of `nph-option` (P92).
 *   The other path, the real control holding the focus with the card drawing `:focus-within`,
 *   needs a way to hide the focus ring of the control, which the three controls do not have
 *   (no `::part`, no property), and Figma draws the focus around the whole card, none on the
 *   control;
 * - `control`: `checkbox` (default), `radio` or `switch`. Reflects, because the internal CSS
 *   and the group read it;
 * - `checked`: the current state. It does not reflect. The `checked` ATTRIBUTE is the initial
 *   state and the one `form.reset()` returns to; a later change of the attribute moves the
 *   current state only while the card is not dirty (neither the person nor code changed
 *   `checked`), the rule of the native controls;
 * - `name` and `value` reflect, because the form reads the attributes of the host. `value` is
 *   `on` by default. A checked checkbox or radio card enters the `FormData` under `name`; the
 *   switch is not a form member, as `nph-switch` is not (a choice that goes with a submission
 *   is a checkbox);
 * - the group of radio cards is not an element: cards with `control="radio"` and the same
 *   non-empty `name`, in the same root and with the same form owner, are one group. Checking one
 *   unchecks the others. One Tab stop per group, on the checked card or, with none checked, on
 *   the first that responds; the arrow keys move the focus to the next or previous card that
 *   responds, wrapping, and check it; Space checks the focused one (WAI-ARIA APG, Radio Group).
 *   Checkbox and switch cards are one Tab stop each, and Space toggles them. Enter checks
 *   nothing, as in `nph-checkbox` and `nph-radio`. The card owns the `tabindex` of the host;
 * - a click anywhere on the card (the whole card is the click area), `click()` or a
 *   `<label for>` checks it or toggles it. A click on a checked radio card changes nothing;
 * - events: when the person checks or toggles the card, the host fires the native `input`
 *   (bubbles, composed) and then `change` (bubbles). A change from code never fires them;
 * - `text`: the title, the name of the control (`aria-label` through the internals; an id does
 *   not cross a shadow root). It wraps. It is required, as the `text` of the three controls;
 * - `description`: the second line, the description of the control (`aria-description`
 *   through the internals). Empty turns it off. Already localized;
 * - `icon`: a core name of `nph-icon`, drawn `light` in a `rich-option/icon-size` box after the
 *   control. Empty (default) turns it off;
 * - `shortcut`: the keys drawn at the end, separated by spaces, each in an `nph-kbd`. Empty
 *   (default) turns it off. Never with the `switch`. It is only a visual hint (D-2): the card
 *   binds no key. `keyShortcuts` is the `aria-keyshortcuts` value (`Meta+K`), written only when
 *   the product says the key is bound; a disabled card announces none;
 * - `invalid`: the error outline. Visual only: `aria-invalid` is not supported on the `radio`
 *   and `switch` roles, and the written message belongs to the `nph-field` of the group (P83);
 * - `disabled`, or a `<fieldset disabled>` around it: the whole card at
 *   `rich-option/disabled-opacity`, out of the Tab order and the arrow keys, with no click.
 *   `disabled` wins over `invalid` (T11);
 * - `static nphFieldRole = 'option'`: `nph-field` wraps the cards in a `group`. A group of
 *   radio cards inside the field is read as a `group` and not as a `radiogroup`: a known limit
 *   (P134), because the field reads the role of the class, not of the instance;
 * - the hover of the control does not follow the hover of the card: the control is inert and
 *   takes no hover from outside, the known limit of DSA-45 D-3;
 * - no slot, no `::part`, no color property;
 * - invalid input does not render and emits `console.error` only in development, one per cause
 *   and accumulating (P21 rule): a `control` outside the three, an `icon` outside the core, a
 *   `shortcut` with the `switch`, and no `text`.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-checkbox/nph-checkbox';
import '../nph-icon/nph-icon';
import '../nph-kbd/nph-kbd';
import '../nph-radio/nph-radio';
import '../nph-switch/nph-switch';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import richOptionCss from './nph-rich-option.css?inline';

const TAG = 'nph-rich-option';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The three controls of the card (the Figma `controle`). */
export const NPH_RICH_OPTION_CONTROLS = ['checkbox', 'radio', 'switch'] as const;
export type NphRichOptionControl = (typeof NPH_RICH_OPTION_CONTROLS)[number];

/** The value a checked card submits when it has none, as the native checkbox and radio do. */
export const NPH_RICH_OPTION_DEFAULT_VALUE = 'on';

/** The arrow keys that move to the next card of a radio group, and to the previous one. */
const NEXT_KEYS = ['ArrowDown', 'ArrowRight'];
const PREVIOUS_KEYS = ['ArrowUp', 'ArrowLeft'];

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

/** An empty string is no attribute: an empty `name` is not written on the host. */
const nameConverter = {
  fromAttribute: (attribute: string | null): string => attribute ?? '',
  toAttribute: (value: string | null): string | null => (value === null || value === '' ? null : value),
};

/** A removed `value` attribute is the default again, so the property and the form agree. */
const valueConverter = {
  fromAttribute: (attribute: string | null): string => attribute ?? NPH_RICH_OPTION_DEFAULT_VALUE,
  toAttribute: (value: string): string => value,
};

/** The state kept for history restoration; an unchecked card needs one too, as the radio does. */
const RESTORE_CHECKED = 'nph-rich-option:checked';
const RESTORE_UNCHECKED = 'nph-rich-option:unchecked';

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

export class NphRichOption extends LitElement {
  static override styles = unsafeCSS(richOptionCss);

  /* The host joins forms through `ElementInternals`. */
  static formAssociated = true;

  /** Inside `nph-field`, the card is one option of a group (contract of the field, P83). */
  static readonly nphFieldRole = 'option';

  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'checked'];
  }

  static override properties = {
    /* `control` reflects: the internal CSS and the radio group read it. */
    control: { type: String, reflect: true },
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
    description: { type: String },
    icon: { type: String },
    shortcut: { type: String },
    keyShortcuts: { type: String, attribute: 'key-shortcuts' },
  };

  /** `checkbox` (default), `radio` or `switch`. */
  declare control: string;
  declare disabled: boolean;
  declare invalid: boolean;
  /** The group and the key in the `FormData`. Empty: a group of one, not submitted. */
  declare name: string;
  /** What a checked card submits. */
  declare value: string;
  /** The title, already localized; it is also the accessible name. */
  declare text: string;
  /** The second line, already localized. Empty turns it off. */
  declare description: string;
  /** A core icon name. Empty turns the icon off. */
  declare icon: string;
  /** The keys of the shortcut hint, separated by spaces. Empty turns it off. */
  declare shortcut: string;
  /** The `aria-keyshortcuts` value, only when the product binds the key. */
  declare keyShortcuts: string;

  private readonly internals: ElementInternals;
  private checkedState = false;
  /** True once the person or code changed `checked`: the attribute stops moving it. */
  private dirty = false;
  /** Set by a `<fieldset disabled>` around the card. */
  private formDisabled = false;
  private valid = false;
  /** True from the end of `connectedCallback` until the card leaves the page. */
  private registered = false;
  /** The root and name the card had when connected, to settle that group when it leaves. */
  private connectedRoot: Document | ShadowRoot | null = null;
  private connectedName = '';

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.internals.ariaChecked = 'false';
    this.control = 'checkbox';
    this.disabled = false;
    this.invalid = false;
    this.name = '';
    this.value = NPH_RICH_OPTION_DEFAULT_VALUE;
    this.text = '';
    this.description = '';
    this.icon = '';
    this.shortcut = '';
    this.keyShortcuts = '';
    /* `click()` called on the host itself also stops when the card does not respond. */
    this.addEventListener('click', (event) => this.blockInactive(event), { capture: true });
    this.addEventListener('click', () => this.activate());
    this.addEventListener('keydown', (event) => this.onKeydown(event));
  }

  /** The current state. Changing it from code unchecks the radio group and fires nothing. */
  get checked(): boolean {
    return this.checkedState;
  }

  set checked(value: boolean) {
    this.dirty = true;
    this.applyChecked(Boolean(value));
  }

  /** The form that owns the card, as on a native control. */
  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.connectedRoot = this.getRootNode() as Document | ShadowRoot;
    this.connectedName = this.name ?? '';
    /* A checked radio card that arrives unchecks the group it joins; the last one to connect wins. */
    if (this.checkedState) {
      this.uncheckOthers(true);
    }
    this.registered = true;
    this.syncInternals();
    this.syncGroup();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.registered = false;
    this.removeAttribute('tabindex');
    this.settleNamed(this.connectedRoot, this.connectedName);
    this.connectedRoot = null;
  }

  override attributeChangedCallback(name: string, old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, old, value);
    if (name === 'checked' && !this.dirty) {
      this.applyChecked(value !== null);
    }
  }

  formAssociatedCallback(): void {
    if (this.checkedState) {
      this.uncheckOthers(true);
    }
    this.syncGroup();
  }

  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled;
    this.syncInternals();
    this.syncGroup();
    this.requestUpdate();
  }

  formResetCallback(): void {
    this.dirty = false;
    this.applyChecked(this.hasAttribute('checked'));
  }

  /** `restore` brings back the state written by `syncInternals`; `autocomplete` brings a value. */
  formStateRestoreCallback(state: unknown, mode: 'restore' | 'autocomplete' = 'restore'): void {
    this.dirty = true;
    this.applyChecked(mode === 'autocomplete' ? state === this.value : state === RESTORE_CHECKED);
  }

  /** Disabled, inside a disabled fieldset, or not drawn: the card does not respond. */
  private get inactive(): boolean {
    return this.disabled || this.formDisabled || !this.valid;
  }

  private get isRadio(): boolean {
    return this.control === 'radio';
  }

  /** The keyboard reaches the card: it responds and it is shown. */
  private get reachable(): boolean {
    return !this.inactive && this.checkVisibility();
  }

  /** Sets the state, unchecks the radio group when it turns on, and settles the form and the focus. */
  private applyChecked(value: boolean): void {
    const old = this.checkedState;
    if (old === value) {
      return;
    }
    this.checkedState = value;
    this.requestUpdate('checked', old);
    if (value && this.isRadio) {
      this.uncheckOthers();
    }
    this.syncInternals();
    this.syncGroup();
  }

  /** The other cards of the group lose the check; they do not become dirty, as in the native radio. */
  private uncheckOthers(onlyRegistered = false): void {
    for (const card of this.group()) {
      if (card !== this && card.checkedState && (!onlyRegistered || card.registered)) {
        card.checkedState = false;
        card.requestUpdate('checked', true);
        card.syncInternals();
      }
    }
  }

  /**
   * Radio cards with the same non-empty name, in the same root and with the same form owner,
   * in tree order. Any other card is a group of one.
   */
  private group(): NphRichOption[] {
    const name = this.name ?? '';
    const root = this.getRootNode();
    if (!this.isRadio || name === '' || root === this) {
      return [this];
    }
    const form = this.internals.form;
    return [...(root as ParentNode).querySelectorAll(TAG)].filter(
      (element): element is NphRichOption =>
        element instanceof NphRichOption && element.isRadio && element.name === name && element.internals.form === form,
    );
  }

  /** Settles every radio card named `name` in `root`, after one of them left or changed group. */
  private settleNamed(root: Node | null, name: string): void {
    if (root === null || root === this || name === '' || !('querySelectorAll' in root)) {
      return;
    }
    for (const element of (root as ParentNode).querySelectorAll(TAG)) {
      if (element instanceof NphRichOption && element !== this && element.name === name) {
        element.syncGroup();
      }
    }
  }

  /**
   * One Tab stop per group: a radio group has it on the checked card that responds, or on the
   * first one that responds; a checkbox or switch card is its own stop.
   */
  private syncGroup(): void {
    const members = this.group();
    const responsive = members.filter((card) => card.reachable);
    const stop = responsive.find((card) => card.checkedState) ?? responsive[0];
    for (const card of members) {
      if (card.inactive) {
        card.removeAttribute('tabindex');
      } else {
        card.setAttribute('tabindex', card.isRadio && card !== stop ? '-1' : '0');
      }
    }
  }

  /** Role, state, name, description, availability and the value the form receives. */
  private syncInternals(): void {
    const control = oneOf(NPH_RICH_OPTION_CONTROLS, this.control) ? this.control : 'checkbox';
    this.internals.role = control;
    this.internals.ariaChecked = this.checkedState ? 'true' : 'false';
    this.internals.ariaDisabled = this.disabled || this.formDisabled ? 'true' : null;
    const keys = (this.keyShortcuts ?? '').trim();
    this.internals.ariaKeyShortcuts = keys === '' || this.inactive ? null : keys;
    const description = (this.description ?? '').trim();
    this.internals.ariaDescription = description === '' ? null : description;
    const text = (this.text ?? '').trim();
    this.internals.ariaLabel = text === '' ? null : text;
    /* A card that is not drawn submits nothing, and so does a switch, which is not a form member. */
    const submits = this.checkedState && this.valid && control !== 'switch';
    this.internals.setFormValue(submits ? this.value : null, this.checkedState ? RESTORE_CHECKED : RESTORE_UNCHECKED);
  }

  /** When the card does not respond, the click neither checks it nor reaches the consumer. */
  private blockInactive(event: Event): void {
    if (this.inactive) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  /** The person acted on the card: a radio card checks, a checkbox or switch card toggles. */
  private activate(): void {
    if (this.inactive) {
      return;
    }
    if (this.isRadio) {
      this.checkByPerson();
    } else {
      this.dirty = true;
      this.applyChecked(!this.checkedState);
      this.announce();
    }
  }

  /** The person checked the radio card: it takes the check and says so, once. */
  private checkByPerson(): void {
    if (this.inactive || this.checkedState) {
      return;
    }
    this.dirty = true;
    this.applyChecked(true);
    this.announce();
  }

  private announce(): void {
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private onKeydown(event: KeyboardEvent): void {
    if (this.inactive || event.altKey || event.ctrlKey || event.metaKey || event.target !== this) {
      return;
    }
    if (event.key === ' ') {
      event.preventDefault();
      this.activate();
      return;
    }
    if (!this.isRadio) {
      return;
    }
    const step = NEXT_KEYS.includes(event.key) ? 1 : PREVIOUS_KEYS.includes(event.key) ? -1 : 0;
    if (step === 0) {
      return;
    }
    event.preventDefault();
    const responsive = this.group().filter((card) => card.reachable);
    const index = responsive.indexOf(this);
    const next = responsive[(index + step + responsive.length) % responsive.length];
    if (next === undefined) {
      return;
    }
    next.focus();
    next.checkByPerson();
  }

  protected override willUpdate(changed: PropertyValues): void {
    /* A change of name or control settles both groups: a checked card unchecks the group it joins. */
    if (changed.has('name') && this.hasUpdated) {
      this.settleNamed(this.getRootNode(), String(changed.get('name') ?? ''));
      this.connectedName = this.name ?? '';
    }
    if ((changed.has('name') || changed.has('control')) && this.hasUpdated && this.checkedState && this.isRadio) {
      this.uncheckOthers();
    }
    const decisive = ['control', 'icon', 'shortcut', 'text'].some((name) => changed.has(name));
    if (decisive) {
      const control = (this.control ?? '').trim();
      const icon = (this.icon ?? '').trim();
      const shortcut = (this.shortcut ?? '').trim();
      const text = (this.text ?? '').trim();
      let valid = true;
      if (!oneOf(NPH_RICH_OPTION_CONTROLS, control)) {
        devError(`control "${control}" does not exist. Use ${NPH_RICH_OPTION_CONTROLS.join(', ')}.`);
        valid = false;
      }
      if (icon !== '' && !isCoreName(icon)) {
        devError(`icon "${icon}" is not a core name of nph-icon.`);
        valid = false;
      }
      if (shortcut !== '' && control === 'switch') {
        devError('a card with a switch takes no shortcut: the switch already acts on click.');
        valid = false;
      }
      if (text === '') {
        devError('without text, the card has no title: it is the accessible name of the control.');
        valid = false;
      }
      this.valid = valid;
      this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
    }
    this.syncInternals();
    this.syncGroup();
  }

  /** The control at the start of the card, drawn as a visual indicator of the card state. */
  private controlArt(text: string): TemplateResult {
    switch (this.control) {
      case 'radio':
        return html`<nph-radio class="control" inert aria-hidden="true" label=${text} .checked=${this.checkedState}></nph-radio>`;
      case 'switch':
        return html`<nph-switch class="control" inert aria-hidden="true" label=${text} .checked=${this.checkedState}></nph-switch>`;
      default:
        return html`<nph-checkbox class="control" inert aria-hidden="true" label=${text} .checked=${this.checkedState}></nph-checkbox>`;
    }
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const text = (this.text ?? '').trim();
    const description = (this.description ?? '').trim();
    const icon = (this.icon ?? '').trim();
    const keys = (this.shortcut ?? '').split(/\s+/).filter((key) => key !== '');
    return html`<span class="layer" aria-hidden="true"></span><span class="halo" aria-hidden="true"></span>${this.controlArt(text)}${icon === ''
        ? nothing
        : html`<nph-icon class="icon" name=${icon} size="md" aria-hidden="true"></nph-icon>`}
      <span class="texts"
        ><span class="title">${text}</span>${description === ''
          ? nothing
          : html`<span class="description" aria-hidden="true">${description}</span>`}</span
      >${keys.length === 0
        ? nothing
        : html`<span class="shortcut" aria-hidden="true">${keys.map((key) => html`<nph-kbd text=${key}></nph-kbd>`)}</span>`}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphRichOption);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-rich-option': NphRichOption;
  }
}
