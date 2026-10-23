/**
 * `nph-field` — the form field: label, control, help text and error message.
 *
 * Contract accepted in Figma (frame `1194:21863`, set `657:50`), decisions D1 to D8 of
 * the task DSA-28, sheet `fichas/nph-field.md`, `design.md` and decision P83 —
 * nph-field: API, semantics and the field–control contract:
 * - `label`: the label text, drawn by an `nph-label`, and the accessible name of the
 *   control. `required` shows the asterisk; `info` and `infoLabel` (`info-label`) go
 *   to the `nph-label` as they are and draw its information icon (D1);
 * - `help`: the help line (the Figma `mostrar apoio` and `texto de apoio`);
 * - `error`: the error message. Filling it in is what makes the field invalid: there is
 *   no `state` property. The error replaces the help on the message line (D2 to D4);
 * - `counter`: the counter text (the Figma `contador` and `texto do contador`), shown
 *   as it comes. The field counts nothing; how the text is counted belongs to the
 *   consumer or to the control;
 * - `disabled`: passed to the control. It hides the error (D8). The field draws no
 *   opacity of its own: the control fades itself, and the label and the message line
 *   never fade;
 * - a text that is empty turns its part off. With no help, no error and no counter, the
 *   message line is not rendered and keeps no height (D5);
 * - the default slot takes the control (the Figma `⮑ controle`), or the options of a
 *   group of checkboxes, radios or switches, stacked (D7);
 * - no event of its own, no `::part`, no size or color property, no form association.
 *
 * WHY THE FIELD WRITES PROPERTIES ON THE CONTROL — an id reference (`for`,
 * `aria-labelledby`, `aria-describedby`) does not cross a shadow root, and the slot
 * does not merge trees (P77, item 2). The control is a light DOM child of the field
 * and its focus lives in its own shadow root: nothing in the shadow root of the field
 * can name or describe it by reference. So the field passes the text and the state,
 * and each control applies them to its focusable element, in its own root. That is the
 * field–control contract of P83:
 * - a control (`static nphFieldRole` absent or `'control'`) receives `label`, the
 *   accessible name; `description`, the text of the visible message line; `invalid`;
 *   `required`; and `disabled`;
 * - an option (`'option'`, checkbox and switch; `'radio'`, radio) brings its own name.
 *   The field wraps the slot in a `group` (or `radiogroup`) named by `label` and
 *   described by the message line, in the same root, and writes only `invalid` and
 *   `disabled` on each option;
 * - inside a field, the field is the source of `label`, `description`, `invalid` and
 *   `required`. `disabled` adds up: the field turns it on while it is disabled and
 *   gives back only what it turned on;
 * - a custom element not yet defined receives nothing until it is defined, because its
 *   role is not known before that.
 *
 * The `nph-label` has no Shadow DOM (P62.1) and its CSS is global, so the field adopts
 * the same stylesheet in its own root. The label is used WITHOUT `for`: a click on its
 * text moves the focus to the control (`focus()` on the host), and a click on the
 * information icon does not.
 *
 * Invalid input: `label` empty emits `console.error` only in development and the field
 * renders anyway, so a missing translation does not hide the control (P83, as P62.6
 * keeps the label). A problem in the composition renders anyway and emits
 * `console.warn` only in development, one per cause while it lasts: no control, more
 * than one control, a control mixed with options, radios mixed with other options, and
 * an element that does not take the field–control contract.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-label/nph-label';
import labelCss from '../nph-label/nph-label.css?inline';
import fieldCss from './nph-field.css?inline';

const TAG = 'nph-field';

/** How an element of the slot joins the field, read from the static `nphFieldRole` of its class. */
export const NPH_FIELD_ROLES = ['control', 'option', 'radio'] as const;
export type NphFieldRole = (typeof NPH_FIELD_ROLES)[number];

/** The properties the field writes on a control (P83). An option takes only `invalid` and `disabled`. */
export interface NphFieldControl extends HTMLElement {
  label: string;
  description: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

/** The `id` of the message text inside the shadow root, which the group points to. */
const MESSAGE_ID = 'message';

const CONTROL_KEYS = ['label', 'description', 'invalid', 'required', 'disabled'] as const;
const OPTION_KEYS = ['invalid', 'disabled'] as const;

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

function isCustomElementName(element: Element): boolean {
  return element.localName.includes('-');
}

/**
 * The role an element declares, or `undefined` while its custom element is not defined.
 * A native element and an absent or unknown value are a control.
 */
function roleOf(element: Element): NphFieldRole | undefined {
  if (!isCustomElementName(element)) {
    return 'control';
  }
  const definition = customElements.get(element.localName) as { nphFieldRole?: unknown } | undefined;
  if (definition === undefined) {
    return undefined;
  }
  const role = definition.nphFieldRole;
  return (NPH_FIELD_ROLES as readonly unknown[]).includes(role) ? (role as NphFieldRole) : 'control';
}

/** Writes one property only when it changes, so the control does not update for nothing. */
function assign(element: Element, key: string, value: unknown): void {
  const target = element as unknown as Record<string, unknown>;
  if (target[key] !== value) {
    target[key] = value;
  }
}

export class NphField extends LitElement {
  static override styles = [unsafeCSS(labelCss), unsafeCSS(fieldCss)];

  static override properties = {
    label: { type: String },
    /* `required` and `disabled` reflect like the native attributes, so the CSS of the
       consumer can read the state of the field (`nph-field[disabled]`). */
    required: { type: Boolean, reflect: true },
    info: { type: String },
    infoLabel: { type: String, attribute: 'info-label' },
    help: { type: String },
    error: { type: String },
    counter: { type: String },
    disabled: { type: Boolean, reflect: true },
  };

  /** The label text and the accessible name of the control. Already localized. */
  declare label: string;
  /** Required field: the asterisk on the label and `required` on the control. */
  declare required: boolean;
  /** The text of the explanation behind the information icon. Already localized. */
  declare info: string;
  /** The accessible name of the information icon. Already localized. */
  declare infoLabel: string;
  /** The help line. Already localized. */
  declare help: string;
  /** The error message. Filled in, the field is invalid. Already localized. */
  declare error: string;
  /** The counter text, shown as it comes, such as `12/500`. */
  declare counter: string;
  /** Disabled field: passed to the control; it hides the error. */
  declare disabled: boolean;

  /** The elements of the slot, in order. */
  private elements: Element[] = [];
  /** The elements the field wrote on, with the role it wrote for, to clean up when they leave. */
  private managed = new Map<Element, NphFieldRole>();
  /** The elements the field disabled, to give back only those. */
  private forcedDisabled = new WeakSet<Element>();
  /** The custom elements already waited for, so `whenDefined` is asked once per name. */
  private awaited = new Set<string>();
  /** The composition warnings already shown, so a problem that stays does not repeat. */
  private shownWarnings = new Set<string>();
  private reported = '';

  constructor() {
    super();
    this.label = '';
    this.required = false;
    this.info = '';
    this.infoLabel = '';
    this.help = '';
    this.error = '';
    this.counter = '';
    this.disabled = false;
  }

  private get labelText(): string {
    return (this.label ?? '').trim();
  }

  private get errorText(): string {
    return (this.error ?? '').trim();
  }

  private get helpText(): string {
    return (this.help ?? '').trim();
  }

  private get counterText(): string {
    return (this.counter ?? '').trim();
  }

  /** The field is invalid when the error is filled in and the field is not disabled (D8). */
  private get invalid(): boolean {
    return this.errorText !== '' && !this.disabled;
  }

  /** The text of the message line: the error when shown, the help otherwise. */
  private get messageText(): string {
    return this.invalid ? this.errorText : this.helpText;
  }

  /** The defined elements of the slot, by role. */
  private get roles(): Map<Element, NphFieldRole> {
    const roles = new Map<Element, NphFieldRole>();
    for (const element of this.elements) {
      const role = roleOf(element);
      if (role !== undefined) {
        roles.set(element, role);
      }
    }
    return roles;
  }

  /** `radio` when any option is a radio, `option` when any element is an option, `control` otherwise. */
  private get mode(): NphFieldRole {
    const roles = [...this.roles.values()];
    if (roles.includes('radio')) {
      return 'radio';
    }
    return roles.includes('option') ? 'option' : 'control';
  }

  /** The control the field names: the first element with the role `control`, in single mode. */
  private get control(): HTMLElement | undefined {
    if (this.mode !== 'control') {
      return undefined;
    }
    const found = [...this.roles].find(([, role]) => role === 'control');
    return found?.[0] as HTMLElement | undefined;
  }

  /**
   * Reads the elements of the default slot — the element children with no `slot`
   * attribute — before the render, so the role of the wrapper is right on the first
   * one. A custom element not yet defined is waited for once per name.
   */
  private readSlot(): void {
    this.elements = [...this.children].filter((child) => !child.hasAttribute('slot'));
    for (const element of this.elements) {
      if (roleOf(element) === undefined && !this.awaited.has(element.localName)) {
        this.awaited.add(element.localName);
        void customElements.whenDefined(element.localName).then(() => this.requestUpdate());
      }
    }
  }

  private onSlotChange(): void {
    this.requestUpdate();
  }

  /** A click on the label text moves the focus to the control; the information icon is left alone. */
  private onLabelClick(event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Element && target.closest('button, nph-tooltip') !== null) {
      return;
    }
    this.control?.focus();
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    this.readSlot();
    if (changed.has('label') || !this.hasUpdated) {
      if (this.labelText === '') {
        if (this.reported !== 'label') {
          this.reported = 'label';
          devError('label is required: it is the accessible name of the control. The field renders without it.');
        }
      } else {
        this.reported = '';
      }
    }
  }

  protected override updated(): void {
    this.syncElements();
    this.checkComposition();
  }

  /** Writes the contract on the elements of the slot and cleans up the ones that left. */
  private syncElements(): void {
    const roles = this.roles;
    const mode = this.mode;
    const control = this.control;
    const next = new Map<Element, NphFieldRole>();

    for (const [element, role] of roles) {
      if (mode === 'control' ? element === control : role !== 'control') {
        next.set(element, role);
      }
    }
    for (const [element, role] of this.managed) {
      if (next.get(element) !== role) {
        this.release(element, role);
      }
    }
    for (const [element, role] of next) {
      if (role === 'control') {
        assign(element, 'label', this.labelText);
        assign(element, 'description', this.messageText);
        assign(element, 'required', this.required);
      }
      assign(element, 'invalid', this.invalid);
      this.passDisabled(element);
    }
    this.managed = next;
  }

  /** `disabled` adds up: on while the field is disabled; given back only where the field turned it on. */
  private passDisabled(element: Element): void {
    const target = element as unknown as { disabled?: unknown };
    if (this.disabled) {
      if (target.disabled !== true) {
        target.disabled = true;
        this.forcedDisabled.add(element);
      }
    } else if (this.forcedDisabled.has(element)) {
      target.disabled = false;
      this.forcedDisabled.delete(element);
    }
  }

  /** An element that left the field, or changed role, loses what the field wrote on it. */
  private release(element: Element, role: NphFieldRole): void {
    if (role === 'control') {
      assign(element, 'label', '');
      assign(element, 'description', '');
      assign(element, 'required', false);
    }
    assign(element, 'invalid', false);
    if (this.forcedDisabled.has(element)) {
      assign(element, 'disabled', false);
      this.forcedDisabled.delete(element);
    }
  }

  /** Composition problems: they render anyway, and each shows once while it lasts. */
  private checkComposition(): void {
    const warnings = new Set<string>();
    const roles = this.roles;
    const values = [...roles.values()];
    const controls = values.filter((role) => role === 'control').length;
    const options = values.length - controls;

    if (this.elements.length === 0) {
      warnings.add('the field has no control: put the control in the default slot.');
    }
    if (options === 0 && controls > 1) {
      warnings.add('more than one control: the field names only the first one.');
    }
    if (options > 0 && controls > 0) {
      warnings.add('a control is mixed with options: in a group, the field takes only checkboxes, radios or switches.');
    }
    if (values.includes('radio') && values.includes('option')) {
      warnings.add('radios are mixed with other options: a group is either radios or checkboxes and switches.');
    }
    for (const [element, role] of roles) {
      const keys = role === 'control' ? CONTROL_KEYS : OPTION_KEYS;
      if (!isCustomElementName(element) || keys.some((key) => !(key in element))) {
        warnings.add(`<${element.localName}> does not take the field contract (P83): it is not named or described by the field.`);
      }
    }

    for (const warning of warnings) {
      if (!this.shownWarnings.has(warning)) {
        devWarn(warning);
      }
    }
    this.shownWarnings = warnings;
  }

  private renderMessage(): TemplateResult | typeof nothing {
    const text = this.messageText;
    const counter = this.counterText;
    if (text === '' && counter === '') {
      return nothing;
    }
    const kind = this.invalid ? 'error' : 'help';
    return html`<div class="message message--${kind}">
      ${text === '' ? nothing : html`<span class="message__text message__text--${kind}" id=${MESSAGE_ID}>${text}</span>`}
      ${counter === '' ? nothing : html`<span class="message__counter">${counter}</span>`}
    </div>`;
  }

  protected override render(): TemplateResult {
    const mode = this.mode;
    const group = mode !== 'control';
    const label = this.labelText;
    const described = group && this.messageText !== '';
    return html`<nph-label
        class="label"
        .text=${label}
        .required=${this.required}
        .info=${this.info ?? ''}
        .infoLabel=${this.infoLabel ?? ''}
        @click=${this.onLabelClick}
      ></nph-label>
      <div
        class="control ${group ? 'control--group' : ''}"
        role=${group ? (mode === 'radio' ? 'radiogroup' : 'group') : nothing}
        aria-label=${group && label !== '' ? label : nothing}
        aria-describedby=${described ? MESSAGE_ID : nothing}
        aria-invalid=${group && this.invalid ? 'true' : nothing}
        aria-required=${mode === 'radio' && this.required ? 'true' : nothing}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
      ${this.renderMessage()}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphField);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-field': NphField;
  }
}
