/**
 * `nph-toggle-group` — the group of `nph-togglebutton` on the same subject, side by
 * side in a toolbar.
 *
 * Contract accepted in Figma (frame `1580:61`, set `1580:60`), decisions D1 to D3 of
 * the task DSA-23, sheet `fichas/nph-toggle-group.md`, `design.md` and decision P76 —
 * nph-toggle-group: API and semantics:
 * - the default slot takes `nph-togglebutton` children. Each child names itself with
 *   a `value` ATTRIBUTE that the group reads (`getAttribute('value')`): one word with no
 *   whitespace. The button ignores it, has no `value` property, and P73 is not amended.
 *   A change of that attribute on a direct child is observed and the group settles;
 * - `label`: the name of the group. The host is the `role="group"`, and `label`
 *   becomes its `aria-label`. A name the consumer puts on the host (`aria-label` or
 *   `aria-labelledby`) is also a name;
 * - `selection`: `single` (default) or `multiple`. In `single`, checking a button
 *   unchecks the others, and a click on the checked button does nothing (D3);
 * - `value`: the checked buttons, as the `value` of each. The attribute takes tokens
 *   separated by spaces (`value="bold italic"`); the property is a `string[]`. In
 *   `single` it holds zero or one item. The group is the source of truth: it writes
 *   `pressed` on every child from `value`, and with no value none is checked (D3);
 * - own event `nph-value-change` (bubbles, composed, not cancelable) with
 *   `detail: { value }`, fired only when the person changes the selection. Setting
 *   `value` from code never fires it. The `nph-change` of each button is not stopped;
 * - no size, no `disabled` or `invalid` (they stay on each button), no `::part`, no
 *   color property, no form association, and the group itself is never focusable;
 * - invalid input does not render and emits `console.error` only in development, one
 *   per cause (the rule of P21): `selection` outside `single` and `multiple`, and no
 *   name. A problem in the composition renders anyway and emits `console.warn` only
 *   in development (D2): fewer than two buttons, a child that is not an
 *   `nph-togglebutton`, a button without `value`, a `value` with more than one word, a
 *   repeated `value`, a value that matches no button, buttons with text mixed with icon-only buttons (D4), and more
 *   than one value in `single`.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-togglebutton/nph-togglebutton';
import type { NphTogglebutton } from '../nph-togglebutton/nph-togglebutton';
import toggleGroupCss from './nph-toggle-group.css?inline';

const TAG = 'nph-toggle-group';

const BUTTON_TAG = 'nph-togglebutton';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The event the group fires when the person changes the selection. */
export const NPH_TOGGLE_GROUP_VALUE_CHANGE_EVENT = 'nph-value-change';

/** The `nph-change` event of `nph-togglebutton`, which the group listens to. */
const BUTTON_CHANGE_EVENT = 'nph-change';

export const NPH_TOGGLE_GROUP_SELECTIONS = ['single', 'multiple'] as const;
export type NphToggleGroupSelection = (typeof NPH_TOGGLE_GROUP_SELECTIONS)[number];

export interface NphToggleGroupValueChangeDetail {
  /** The `value` of the checked buttons, in the order of the buttons. */
  readonly value: readonly string[];
}

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

function isSelection(value: string): value is NphToggleGroupSelection {
  return (NPH_TOGGLE_GROUP_SELECTIONS as readonly string[]).includes(value);
}

function isButton(element: Element): element is NphTogglebutton {
  return element.localName === BUTTON_TAG;
}

/** The `value` attribute of a button as written, trimmed; empty when absent. */
function rawValueOf(button: Element): string {
  return (button.getAttribute('value') ?? '').trim();
}

/** A value with whitespace inside is two words to the `value` attribute of the group. */
function hasInnerWhitespace(value: string): boolean {
  return /\s/.test(value);
}

/**
 * The `value` a button announces to the group: one word with no whitespace. Empty when the
 * attribute is absent, blank or holds more than one word, so such a button never joins the
 * selection (P76, item 2).
 */
function valueOf(button: Element): string {
  const value = rawValueOf(button);
  return hasInnerWhitespace(value) ? '' : value;
}

export class NphToggleGroup extends LitElement {
  static override styles = unsafeCSS(toggleGroupCss);

  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'aria-label', 'aria-labelledby'];
  }

  static override properties = {
    label: { type: String },
    selection: { type: String },
    value: {
      attribute: 'value',
      converter: {
        fromAttribute: (attribute: string | null): string[] =>
          attribute === null ? [] : attribute.split(/\s+/).filter((token) => token !== ''),
      },
    },
  };

  /** The name of the group, already localized by the consuming application. */
  declare label: string;
  /** `single` or `multiple`. */
  declare selection: string;
  /** The `value` of the checked buttons. Changing it from code does not fire the event. */
  declare value: string[];

  private valid = false;
  private labelApplied = false;
  private applyingSemantics = false;
  private accessibleNameChanged = false;
  /** The composition warnings already shown, so a problem that stays does not repeat. */
  private shownWarnings = new Set<string>();
  /** Watches the `value` attribute of the direct children, which raises no `slotchange`. */
  private readonly childValueObserver = new MutationObserver((records) => this.onChildValueMutation(records));

  constructor() {
    super();
    this.label = '';
    this.selection = 'single';
    this.value = [];
    this.addEventListener('click', (event) => this.guardCheckedClick(event), { capture: true });
    this.addEventListener(BUTTON_CHANGE_EVENT, (event) => this.onButtonChange(event));
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      (name === 'aria-label' || name === 'aria-labelledby') &&
      oldValue !== newValue &&
      !this.applyingSemantics
    ) {
      this.accessibleNameChanged = true;
      this.requestUpdate();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* One observer on the host covers the current set of children: the records are
       filtered to the direct buttons, so a child added or removed later needs no wiring. */
    this.childValueObserver.observe(this, { attributes: true, attributeFilter: ['value'], subtree: true });
    this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.childValueObserver.disconnect();
  }

  /** A direct button got a new `value` attribute: the group settles and checks again. */
  private onChildValueMutation(records: MutationRecord[]): void {
    const changed = records.some(
      (record) => record.target instanceof Element && record.target.parentElement === this && isButton(record.target),
    );
    if (changed && this.valid) {
      this.syncButtons();
      this.checkComposition();
    }
  }

  private buttons(): NphTogglebutton[] {
    return [...this.children].filter(isButton);
  }

  private selectableButtons(): NphTogglebutton[] {
    const values = new Set<string>();
    return this.buttons().filter((button) => {
      const value = valueOf(button);
      if (value === '' || values.has(value)) {
        return false;
      }
      values.add(value);
      return true;
    });
  }

  /** The direct child button a click or event came from, if any. */
  private buttonOf(target: EventTarget | null): NphTogglebutton | undefined {
    return target instanceof Element && target.parentElement === this && isButton(target) ? target : undefined;
  }

  /**
   * D3: in single selection, a click on the checked button does nothing. It is stopped
   * on the way down, before the button toggles, so the button does not flicker and no
   * event leaves it. A disabled button is left to its own rule.
   */
  private guardCheckedClick(event: Event): void {
    if (!this.valid || this.selection !== 'single') {
      return;
    }
    const button = event.composedPath().map((node) => this.buttonOf(node)).find((found) => found !== undefined);
    if (button !== undefined && this.selectableButtons().includes(button) && button.pressed && !button.disabled) {
      event.stopPropagation();
    }
  }

  /** A button the person toggled: the group settles the others, then tells the consumer. */
  private onButtonChange(event: Event): void {
    const changed = this.buttonOf(event.target);
    if (!this.valid || changed === undefined) {
      return;
    }
    if (!this.selectableButtons().includes(changed)) {
      this.syncButtons();
      return;
    }
    if (this.selection === 'single') {
      for (const other of this.buttons()) {
        if (other !== changed) {
          other.pressed = false;
        }
      }
    }
    this.value = this.checkedValues();
    this.dispatchEvent(
      new CustomEvent<NphToggleGroupValueChangeDetail>(NPH_TOGGLE_GROUP_VALUE_CHANGE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  }

  private checkedValues(): string[] {
    return this.selectableButtons()
      .filter((button) => button.pressed)
      .map(valueOf);
  }

  /** The group is the source of truth: `pressed` of every child follows `value`. */
  private syncButtons(): void {
    const selectable = new Set(this.selectableButtons());
    for (const button of this.buttons()) {
      const value = valueOf(button);
      button.pressed = selectable.has(button) && this.value.includes(value);
    }
  }

  /** Composition problems: they render anyway, and each shows once while it lasts. */
  private checkComposition(): void {
    const warnings = new Set<string>();
    const buttons = this.buttons();
    const others = [...this.children].filter((child) => !isButton(child));

    if (buttons.length < 2) {
      warnings.add('fewer than two buttons: for a single option, use nph-togglebutton without a group.');
    }
    if (others.length > 0) {
      warnings.add('only nph-togglebutton is a child of the group; the other elements are not part of the selection.');
    }
    const raw = buttons.map(rawValueOf);
    if (raw.some((value) => value === '')) {
      warnings.add('every nph-togglebutton needs a value attribute: a button without it never joins the selection.');
    }
    if (raw.some(hasInnerWhitespace)) {
      warnings.add('a value attribute is one word with no whitespace: a button with more than one word never joins the selection.');
    }
    const values = buttons.map(valueOf);
    const named = values.filter((value) => value !== '');
    if (new Set(named).size !== named.length) {
      warnings.add('two buttons have the same value attribute: the value of the group cannot tell them apart.');
    }
    const unmatched = this.value.filter((value) => !named.includes(value));
    if (unmatched.length > 0) {
      warnings.add(`value "${unmatched.join(' ')}" matches no button: nothing is checked for it.`);
    }
    const withText = buttons.filter((button) => (button.text ?? '').trim() !== '').length;
    if (withText > 0 && withText < buttons.length) {
      warnings.add('buttons with text and icon-only buttons are mixed: choose one for the whole group.');
    }

    for (const warning of warnings) {
      if (!this.shownWarnings.has(warning)) {
        devWarn(warning);
      }
    }
    this.shownWarnings = warnings;
  }

  /** The host is the group: its role and its name come from here, as in `nph-icon`. */
  private applySemantics(): void {
    this.applyingSemantics = true;
    try {
      this.setAttribute('role', 'group');
      const label = (this.label ?? '').trim();
      if (label !== '') {
        this.setAttribute('aria-label', label);
        this.labelApplied = true;
      } else if (this.labelApplied) {
        this.removeAttribute('aria-label');
        this.labelApplied = false;
      }
    } finally {
      this.applyingSemantics = false;
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    this.applySemantics();

    /* Only the inputs that decide validity are checked again, so the errors do not repeat. */
    if (
      changed.has('label') ||
      changed.has('selection') ||
      this.accessibleNameChanged ||
      !this.hasUpdated
    ) {
      this.accessibleNameChanged = false;
      const selection = this.selection ?? '';
      const named = ['aria-label', 'aria-labelledby'].some((name) => (this.getAttribute(name) ?? '').trim() !== '');
      let valid = true;

      if (!isSelection(selection)) {
        devError(`selection "${selection}" is not "single" or "multiple".`);
        valid = false;
      }
      if (!named) {
        devError('the group needs a name: set label, aria-label or aria-labelledby, so the subject is announced.');
        valid = false;
      }
      this.valid = valid;
      this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
    }

    if (this.valid && this.selection === 'single' && this.value.length > 1) {
      devWarn('single selection takes one value: only the first is kept.');
      this.value = [this.value[0] ?? ''];
    }
  }

  protected override updated(): void {
    if (this.valid) {
      this.syncButtons();
      this.checkComposition();
    }
  }

  private onSlotChange(): void {
    this.syncButtons();
    this.checkComposition();
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    return html`<slot @slotchange=${this.onSlotChange}></slot>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphToggleGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-toggle-group': NphToggleGroup;
  }
  interface HTMLElementEventMap {
    'nph-value-change': CustomEvent<NphToggleGroupValueChangeDetail>;
  }
}
