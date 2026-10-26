/**
 * `nph-multi-combobox` — the field where the person searches a closed list and picks several
 * options, shown as chips inside the field.
 *
 * Contract accepted in Figma (board `1467:25660`, set `1467:25652`, chip `1467:24879`, the
 * `nph-combobox` list `1359:141`, option `1357:136`), sheet `fichas/nph-multi-combobox.md`,
 * `design.md` and decision P96 — nph-multi-combobox: API and semantics. The form pattern is
 * P80; the field contract is P83; the option is that of P91, with the `checkbox` marker P96
 * adds; the list is the `nph-combobox` list of P95 (D2):
 * - `options`: the entries of the list, as in `nph-combobox` (P95): an option `{ value, text,
 *   secondary, start, icon, src, status, disabled }`, a group label `{ type: 'label', text }`
 *   and a separator `{ type: 'separator' }`. Each option is an `nph-option` with the
 *   `checkbox` marker, checked while chosen. An invalid entry is left out;
 * - `size`: `default` or `large`. Reflects, because the internal CSS selects the height by
 *   it;
 * - `value`: the chosen values, in the order the person chose them. Property only. The chips
 *   follow it; a value with no option in the list is kept until such an option arrives, with
 *   no chip and out of the form data (P91);
 * - `defaultValue`: the values of `form.reset()`, property only. While the person has not
 *   changed the choice and code has not set `value`, setting it moves `value` too, as the
 *   `value` attribute of `nph-input` (P80);
 * - `placeholder`: the invitation while nothing is chosen (the Figma `conteúdo=placeholder`);
 * - `counter` and `subject`: the Figma `conteúdo=contador`. The field stays on one line and
 *   shows `subject`, the subject of the field (D1), and an `nph-badge` with how many options
 *   are chosen, instead of the chips. Reflects;
 * - `chip-icon`: the Figma `ícone início` of the chip. Each chip shows the icon of its option
 *   (an option with `start: 'icon'`), or `tag` for an option with no icon (D-3);
 * - `remove-label`: the word the remove button of each chip says before the option, as
 *   `Remove`, so the button reads "Remove Brazil";
 * - `empty-heading` and `empty-description`: the `vazio` list, the `nph-empty` when nothing
 *   matches;
 * - `open`: the list is open. Reflects. Opening and closing fire no event;
 * - `query`: the typed text. Setting it from code writes it in the field and filters the
 *   list, and fires nothing;
 * - `name`, `required`, `invalid`, `disabled`, `label` and `description`: as in
 *   `nph-combobox` (P83, P95). `required` asks for at least one choice;
 * - events: the host fires `input` (bubbles, composed) and then `change` (bubbles) only when
 *   the person changes the choice: an option checked or unchecked in the list, or a chip
 *   removed. The native `input` of the inner field stops in the shadow root, because typing
 *   does not change the value;
 * - keyboard: the editable combobox of the APG with a list of several choices. The focus
 *   stays on the inner field; the active option is pointed to by `aria-activedescendant`.
 *   Typing opens and filters the list and makes the first match active; the arrows move;
 *   Enter checks or unchecks the active option and keeps the list open; Escape closes; Tab
 *   closes without choosing. The remove buttons of the chips are in the Tab order;
 * - no `::part`, no color property, no width property: the width is
 *   `layout/multi-combobox-width`, and the consumer stretches it to the form;
 * - invalid input does not render and emits `console.error` only in development (P21 rule):
 *   a `size` outside the two. Chips without `remove-label` draw no remove button, and
 *   `counter` without `subject` draws the counter alone, each with one error. A field with
 *   no accessible name renders and warns once.
 *
 * CHIP — the Figma `nph-multi-combobox / chip` is not a public piece: each chip is markup in
 * the shadow root of the field, a pill in `color/primary-surface` with the label on one line
 * (D3) and a remove button.
 *
 * LAYER — the list is a `popover="manual"`, in the top layer, as the `nph-combobox` list
 * (P95): `space/inline-tight` below the field, with the width of the field, turned up when it
 * does not fit below and fits above, following the field on scroll, on resize and when the
 * field grows with the chips.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

import '../nph-badge/nph-badge';
import '../nph-empty/nph-empty';
import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import { NPH_OPTION_DEFAULT_ICON } from '../nph-option/nph-option';
import type { NphComboboxEntry, NphComboboxOption } from '../nph-combobox/nph-combobox';
import { comboboxListStyles, entryProblems, filterGroups, groupsOf, isOption, renderGroup, renderOption, trimmed } from '../nph-combobox/nph-combobox.list';
import type { NphComboboxGroup } from '../nph-combobox/nph-combobox.list';
import multiComboboxCss from './nph-multi-combobox.css?inline';

const TAG = 'nph-multi-combobox';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The two sizes of the set. */
export const NPH_MULTI_COMBOBOX_SIZES = ['default', 'large'] as const;
export type NphMultiComboboxSize = (typeof NPH_MULTI_COMBOBOX_SIZES)[number];

/** The icon of a chip whose option has none: the default instance of the Figma `⮑ ícone` (D-3). */
export const NPH_MULTI_COMBOBOX_CHIP_ICON = 'tag';

/** Interactive content inside a label: a click on it keeps its own action (HTML, the label element). */
const INTERACTIVE = 'a[href], button, input, select, textarea, details, summary, iframe, embed, [tabindex], [contenteditable=""], [contenteditable="true"]';

/** How many options Page Up and Page Down move, as in `nph-combobox`. */
const PAGE_STEP = 10;

let nextId = 0;

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

/** A list of values: strings only, each once, in their order. Anything else is an empty list. */
function valuesOf(next: unknown): string[] {
  if (next === null || next === undefined || typeof next === 'string' || typeof (next as Iterable<unknown>)[Symbol.iterator] !== 'function') {
    return [];
  }
  const kept: string[] = [];
  for (const value of next as Iterable<unknown>) {
    const text = String(value);
    if (!kept.includes(text)) {
      kept.push(text);
    }
  }
  return kept;
}

/** The browser's message for a required choice with nothing chosen, in the person's language. */
function valueMissingMessage(): string {
  const probe = document.createElement('select');
  probe.required = true;
  return probe.validationMessage;
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

export class NphMultiCombobox extends LitElement {
  static override styles = [unsafeCSS(multiComboboxCss), comboboxListStyles];

  /*
   * Host focus delegates into the shadow root. The first focusable element there is the first
   * remove button, so `focus` and a click on an associated label are sent to the text field
   * (see `focus` and `onLabelClick`).
   */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* The host takes part in the form: labelable, with values and a validity of its own. */
  static formAssociated = true;

  static override properties = {
    options: { attribute: false },
    /* `size` reflects because the internal CSS selects the height by it. */
    size: { type: String, reflect: true },
    /* The value and its default are lists: properties only, with their own accessors. */
    value: { attribute: false, noAccessor: true },
    defaultValue: { attribute: false, noAccessor: true },
    /* `query` has its own accessor too; declared so a value set before the upgrade is kept. */
    query: { attribute: false, noAccessor: true },
    placeholder: { type: String },
    /* `counter` reflects: the internal CSS keeps the field on one line by it. */
    counter: { type: Boolean, reflect: true },
    subject: { type: String },
    chipIcon: { type: Boolean, attribute: 'chip-icon' },
    removeLabel: { type: String, attribute: 'remove-label' },
    emptyHeading: { type: String, attribute: 'empty-heading' },
    emptyDescription: { type: String, attribute: 'empty-description' },
    /* `open` reflects: the internal CSS and the consumer's selectors read it. */
    open: { type: Boolean, reflect: true },
    /* `name` reflects because the form reads the attribute of the host, not the property. */
    name: { type: String, reflect: true },
    /* The reflected booleans are read by the internal CSS and by the consumer's selectors. */
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    label: { type: String },
    description: { type: String },
  };

  /** The entries of the list: options, group labels and separators. */
  declare options: readonly NphComboboxEntry[];
  declare size: string;
  /** The invitation while nothing is chosen, already localized by the consuming application. */
  declare placeholder: string;
  /** Shows the subject and how many are chosen, on one line, instead of the chips. */
  declare counter: boolean;
  /** The subject of the field in counter mode, such as `Countries`. Required with `counter`. */
  declare subject: string;
  /** Each chip shows the icon of its option, or `tag` for an option with no icon. */
  declare chipIcon: boolean;
  /** The word the remove button says before the option, such as `Remove`. Required for the button. */
  declare removeLabel: string;
  /** The title of the `nph-empty` when nothing matches. */
  declare emptyHeading: string;
  /** The description of the `nph-empty` when nothing matches. */
  declare emptyDescription: string;
  /** The list is open. */
  declare open: boolean;
  /** Name of the entries in the form data. */
  declare name: string | null;
  declare required: boolean;
  declare disabled: boolean;
  declare invalid: boolean;
  /** Accessible name in text, never visible. An associated label wins over it. */
  declare label: string;
  /** Accessible description in text, never visible: the help or the error sentence. */
  declare description: string;

  private readonly internals: ElementInternals;
  private readonly labelObserver = new MutationObserver(() => this.syncName());
  private readonly scrollTargets: EventTarget[] = [];
  private readonly uid = `nph-multi-combobox-${nextId++}`;
  private resizeObserver: ResizeObserver | undefined;
  private current: string[] = [];
  private defaults: string[] = [];
  /** Changed by the person or set by code: `defaultValue` no longer moves the value. */
  private dirty = false;
  private valid = false;
  /** The text the person typed; `null` with no typed text. */
  private typed: string | null = null;
  /** The option the pointer or the keyboard is on, while the list is open. */
  private activeRow: NphComboboxOption | null = null;
  /** The list is in the top layer: from `showPopover()` until the exit transition ends. */
  private shown = false;
  private closeTimer: number | undefined;
  private frame: number | undefined;
  /** The valid entries, kept until `options` changes. */
  private entries: NphComboboxEntry[] = [];
  /** The `options` the entries were read from. */
  private entriesSource: unknown = undefined;
  /** After the first frame, a label rendered by another element has had its chance. */
  private settled = false;
  private warnedNoName = false;
  /** The labels that send their click to the text field; released on disconnect. */
  private readonly labelsHeard = new Set<Element>();

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.options = [];
    this.size = 'default';
    this.placeholder = '';
    this.counter = false;
    this.subject = '';
    this.chipIcon = false;
    this.removeLabel = '';
    this.emptyHeading = '';
    this.emptyDescription = '';
    this.open = false;
    this.name = null;
    this.required = false;
    this.disabled = false;
    this.invalid = false;
    this.label = '';
    this.description = '';
    this.addEventListener('focusin', () => this.syncName());
    this.addEventListener('focusout', this.onFocusout);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.labelObserver.observe(this.getRootNode(), {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['for', 'id'],
    });
    /* Back in the page: the labels are heard again. */
    this.syncName();
  }

  override disconnectedCallback(): void {
    this.labelObserver.disconnect();
    this.releaseLabels([]);
    this.hideNow();
    this.open = false;
    super.disconnectedCallback();
  }

  /**
   * The focus of the host goes to the text field, never to the first remove button, which
   * comes first in the shadow root: `nph-field` and a click on the label focus the host.
   */
  override focus(options?: FocusOptions): void {
    const field = this.field;
    if (field === null) {
      super.focus(options);
    } else {
      field.focus(options);
    }
  }

  /**
   * A click on an associated label would focus the first remove button, the focus delegate of
   * the shadow root: it goes to the text field, as on a native field. A click inside the field
   * itself (a label that wraps it) keeps its own target.
   */
  private readonly onLabelClick = (event: Event): void => {
    const label = event.currentTarget as Element;
    if (event.defaultPrevented || ![...this.internals.labels].includes(label) || event.composedPath().includes(this)) {
      return;
    }
    /* A link, a button or another control inside the label keeps its own action, as on a native label. */
    const path = event.composedPath();
    const inside = path.slice(0, Math.max(path.indexOf(label), 0));
    if (inside.some((target) => target instanceof Element && target.matches(INTERACTIVE))) {
      return;
    }
    event.preventDefault();
    if (!this.inactive) {
      this.focus();
    }
  };

  /** Stops hearing every label outside `keep`. */
  private releaseLabels(keep: readonly Element[]): void {
    for (const label of [...this.labelsHeard]) {
      if (!keep.includes(label)) {
        label.removeEventListener('click', this.onLabelClick);
        this.labelsHeard.delete(label);
      }
    }
  }

  /** The chosen values, in the order the person chose them. Setting them from code fires nothing. */
  get value(): string[] {
    return [...this.current];
  }

  set value(next: readonly string[]) {
    const old = this.current;
    this.current = valuesOf(next);
    this.dirty = true;
    this.syncFormState();
    this.requestUpdate('value', old);
  }

  /** The values of `form.reset()`. While the choice is not dirty, they are the value too. */
  get defaultValue(): string[] {
    return [...this.defaults];
  }

  set defaultValue(next: readonly string[]) {
    const old = this.defaults;
    this.defaults = valuesOf(next);
    this.requestUpdate('defaultValue', old);
    if (!this.dirty) {
      this.applyDefault();
    }
  }

  private applyDefault(): void {
    const old = this.current;
    this.current = [...this.defaults];
    this.syncFormState();
    this.requestUpdate('value', old);
  }

  /** The typed text. Setting it from code writes the text in the field and filters the list, and fires nothing. */
  get query(): string {
    return this.typed ?? '';
  }

  set query(next: string) {
    const text = next === null || next === undefined ? '' : String(next);
    const old = this.query;
    this.typed = text === '' ? null : text;
    if (this.query !== old) {
      this.activeRow = null;
      this.requestUpdate('query', old);
    }
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
    this.typed = null;
    this.applyDefault();
  }

  formDisabledCallback(): void {
    this.requestUpdate();
  }

  /** The saved state is the list of values. Restoring fires nothing. */
  formStateRestoreCallback(state: string | File | FormData | null): void {
    if (state instanceof FormData) {
      this.value = state.getAll('value').map(String);
    }
  }

  /* --- Entries and rows ---------------------------------------------------------- */

  /** The valid entries; an invalid one is left out with one error per cause. */
  private readEntries(): NphComboboxEntry[] {
    const list = Array.isArray(this.options) ? this.options : [];
    const kept: NphComboboxEntry[] = [];
    for (const entry of list) {
      const problems = entryProblems(entry);
      if (problems.length === 0) {
        kept.push(entry);
      } else {
        for (const problem of problems) {
          devError(`${problem}; the entry was left out.`);
        }
      }
    }
    return kept;
  }

  /** Reads the entries again when `options` is another list than the one read; each list once. */
  private refreshEntries(): boolean {
    if (this.entriesSource === this.options && this.hasUpdated) {
      return false;
    }
    this.entriesSource = this.options;
    this.entries = this.readEntries();
    return true;
  }

  private get allOptions(): NphComboboxOption[] {
    return this.entries.filter(isOption);
  }

  /** The option of each value: the first option with that value. */
  private get optionByValue(): Map<string, NphComboboxOption> {
    const map = new Map<string, NphComboboxOption>();
    for (const option of this.allOptions) {
      if (!map.has(option.value)) {
        map.set(option.value, option);
      }
    }
    return map;
  }

  /** The chosen options, in the order of the value; a value with no option is left out. */
  private get chosenOptions(): NphComboboxOption[] {
    const map = this.optionByValue;
    return this.current.flatMap((value) => {
      const option = map.get(value);
      return option === undefined ? [] : [option];
    });
  }

  /** The groups the list shows, filtered by the typed text. */
  private get visibleGroups(): NphComboboxGroup[] {
    return filterGroups(groupsOf(this.entries), this.query);
  }

  /** The options the keyboard walks, in order. */
  private get rows(): NphComboboxOption[] {
    return this.visibleGroups.flatMap((group) => [...group.options]);
  }

  private get availableRows(): NphComboboxOption[] {
    return this.rows.filter((option) => option.disabled !== true);
  }

  /** The list has something to show: options or the empty state. */
  private get hasContent(): boolean {
    return this.rows.length > 0 || trimmed(this.emptyHeading) !== '';
  }

  /* --- Validation of the input ---------------------------------------------- */

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has('size')) {
      const size = (this.size ?? '').trim();
      this.valid = oneOf(NPH_MULTI_COMBOBOX_SIZES, size);
      if (!this.valid) {
        devError(`size "${size}" does not exist. Use ${NPH_MULTI_COMBOBOX_SIZES.join(' or ')}.`);
      }
      this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    }
    if (this.refreshEntries()) {
      this.syncFormState();
    }
    if (this.valid && changed.has('removeLabel') && trimmed(this.removeLabel) === '') {
      devError('the chips need remove-label, the word their remove button says before the option; the buttons were not drawn.');
    }
    if (this.valid && (changed.has('counter') || changed.has('subject')) && this.counter && trimmed(this.subject) === '') {
      devError('counter needs subject, the subject of the field before the counter; the counter was drawn alone.');
    }

    /* A disabled or invalid field, or one with nothing to show, does not open. */
    if (this.open && (!this.valid || this.inactive || !this.hasContent)) {
      this.open = false;
    }
    const reachable = this.availableRows;
    if (this.activeRow !== null && !reachable.includes(this.activeRow)) {
      this.activeRow = null;
    }
    /* A new query, or new options, while the list is open: the first match is active again. */
    if (this.open && this.query !== '' && this.activeRow === null && (changed.has('options') || changed.has('query'))) {
      this.activeRow = reachable[0] ?? null;
    }
    if (!this.open) {
      this.activeRow = null;
    }
  }

  /* --- State ---------------------------------------------------------------------- */

  private get control(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('.control') ?? null;
  }

  private get field(): HTMLInputElement | null {
    return this.renderRoot?.querySelector<HTMLInputElement>('.field') ?? null;
  }

  private get list(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('.list') ?? null;
  }

  private get scroller(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('.scroller') ?? null;
  }

  private get removeButtons(): HTMLButtonElement[] {
    return [...(this.renderRoot?.querySelectorAll<HTMLButtonElement>('.remove') ?? [])];
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

  /** The remove buttons draw only with their word, and never on a disabled field. */
  private get removable(): boolean {
    return trimmed(this.removeLabel) !== '' && !this.inactive;
  }

  /* --- The person types, opens, moves, chooses ----------------------------------- */

  private setActive(row: NphComboboxOption | null): void {
    if (row === this.activeRow) {
      return;
    }
    this.activeRow = row;
    this.requestUpdate();
  }

  /** Opens the list, with `row` active. */
  private openList(row: NphComboboxOption | null): void {
    if (this.inactive || !this.valid || !this.hasContent) {
      return;
    }
    this.activeRow = row;
    this.open = true;
  }

  private closeList(): void {
    this.open = false;
  }

  /** The values change by the person: `input` and then `change`, with the form data up to date. */
  private commit(next: string[]): void {
    const old = this.current;
    this.current = next;
    this.dirty = true;
    this.syncFormState();
    this.requestUpdate('value', old);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /**
   * The person checks or unchecks an option. The list stays open, the typed text is cleared,
   * so the whole list shows again, and the option stays active.
   */
  private toggle(option: NphComboboxOption): void {
    if (option.disabled === true || this.inactive) {
      return;
    }
    const chosen = this.current.includes(option.value);
    const next = chosen ? this.current.filter((value) => value !== option.value) : [...this.current, option.value];
    this.typed = null;
    this.activeRow = option;
    this.commit(next);
    this.field?.focus();
  }

  /**
   * The remove button of a chip. Pressed from the keyboard, the focus goes to the remove
   * button now in its place, or to the field after the last one; pressed by the pointer, the
   * focus stays on the field.
   */
  private async removeChoice(option: NphComboboxOption, event: Event): Promise<void> {
    if (this.inactive) {
      return;
    }
    const button = event.currentTarget as HTMLButtonElement;
    const index = this.removeButtons.indexOf(button);
    const fromKeyboard = this.renderRoot instanceof ShadowRoot && this.renderRoot.activeElement === button;
    this.commit(this.current.filter((value) => value !== option.value));
    await this.updateComplete;
    const next = fromKeyboard ? this.removeButtons[index] : undefined;
    if (next === undefined) {
      this.field?.focus();
    } else {
      next.focus();
    }
  }

  /** The option at a step from the active one, among those the person can reach. Never wraps. */
  private step(delta: number): NphComboboxOption | null {
    const reachable = this.availableRows;
    if (reachable.length === 0) {
      return null;
    }
    const index = this.activeRow === null ? -1 : reachable.indexOf(this.activeRow);
    if (index === -1) {
      return delta > 0 ? (reachable[0] ?? null) : (reachable.at(-1) ?? null);
    }
    const next = Math.min(Math.max(index + delta, 0), reachable.length - 1);
    return reachable[next] ?? null;
  }

  /**
   * The native `input` of the inner field does not leave the shadow root: typing does not change
   * the value. The list opens, is filtered, and the first match is active.
   */
  private onInput(event: Event): void {
    event.stopPropagation();
    const field = this.field;
    if (field === null || this.inactive) {
      return;
    }
    this.typed = field.value === '' ? null : field.value;
    this.activeRow = this.availableRows[0] ?? null;
    if (this.query === '' && !this.open) {
      this.requestUpdate();
      return;
    }
    this.openList(this.activeRow);
    this.requestUpdate();
  }

  /** The native `change` of the inner field is not the change of the value. */
  private onFieldChange(event: Event): void {
    event.stopPropagation();
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.isComposing || this.inactive) {
      return;
    }
    const { key, altKey } = event;
    let handled = true;

    if (!this.open) {
      if (key === 'ArrowDown' && altKey) {
        this.openList(null);
      } else if (key === 'ArrowDown') {
        this.openList(this.availableRows[0] ?? null);
      } else if (key === 'ArrowUp') {
        this.openList(this.availableRows.at(-1) ?? null);
      } else if (key === 'Enter') {
        this.submitLater(event);
        handled = false;
      } else if (key === 'Escape' && this.query !== '') {
        /* With the list closed, Escape clears the typed text, as in `nph-combobox`. */
        this.typed = null;
        this.requestUpdate();
        event.stopPropagation();
      } else {
        handled = false;
      }
    } else if (key === 'Enter') {
      if (this.activeRow !== null) {
        this.toggle(this.activeRow);
      } else {
        this.closeList();
      }
    } else if (key === 'ArrowUp' && altKey) {
      this.closeList();
    } else if (key === 'Escape') {
      this.closeList();
      /* The Escape closes the list only, not a dialog around the field. */
      event.stopPropagation();
    } else if (key === 'Tab') {
      /* Tab closes without choosing, and the focus moves on (P91). */
      this.closeList();
      handled = false;
    } else if (key === 'ArrowDown') {
      this.setActive(this.step(1));
    } else if (key === 'ArrowUp') {
      this.setActive(this.step(-1));
    } else if (key === 'PageDown') {
      this.setActive(this.step(PAGE_STEP));
    } else if (key === 'PageUp') {
      this.setActive(this.step(-PAGE_STEP));
    } else {
      handled = false;
    }

    if (handled) {
      event.preventDefault();
    }
  }

  /**
   * Enter with the list closed submits the form, as in `nph-input` (P80): the default
   * button, or the form itself, at the end of the propagation, so a consumer that cancels
   * Enter keeps the form.
   */
  private submitLater(event: KeyboardEvent): void {
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

  private isRemoveButton(target: EventTarget): boolean {
    return target instanceof Element && target.classList.contains('remove');
  }

  /** A click on the field opens the list; a click on the arrow opens or closes it. */
  private onControlClick(event: MouseEvent): void {
    if (this.inactive) {
      return;
    }
    const path = event.composedPath();
    if (path.some((target) => this.isRemoveButton(target))) {
      return;
    }
    const onArrow = path.some((target) => target instanceof Element && target.classList.contains('arrow'));
    this.field?.focus();
    if (this.open && onArrow) {
      this.closeList();
    } else if (!this.open) {
      this.openList(null);
    }
  }

  /** A press anywhere on the field but its text keeps the focus where it is, on the field. */
  private onControlMousedown(event: MouseEvent): void {
    const path = event.composedPath();
    if (path.some((target) => target instanceof Element && target.classList.contains('field'))) {
      return;
    }
    event.preventDefault();
  }

  /** The option an event happened on. */
  private rowOf(event: Event): NphComboboxOption | null {
    for (const target of event.composedPath()) {
      if (target instanceof HTMLElement && target.localName === 'nph-option' && target.id.startsWith(`${this.uid}-`)) {
        const index = Number(target.id.slice(this.uid.length + 1));
        return this.renderedRows[index] ?? null;
      }
      if (target === this) {
        break;
      }
    }
    return null;
  }

  /** The options as the last render drew them, by position. */
  private renderedRows: NphComboboxOption[] = [];

  /** A click during the exit of a closed list chooses nothing: the list is already closed. */
  private onListClick(event: MouseEvent): void {
    const row = this.rowOf(event);
    if (row !== null && this.open) {
      this.toggle(row);
    }
  }

  private onListPointer(event: PointerEvent): void {
    const row = this.rowOf(event);
    if (row !== null && row.disabled !== true) {
      this.setActive(row);
    }
  }

  /** The list never takes the focus: it stays on the field. */
  private onListMousedown(event: MouseEvent): void {
    event.preventDefault();
  }

  /**
   * The focus left the field (Tab, a click elsewhere, code): the list closes without choosing,
   * and the typed text is cleared. A move to a remove button stays inside.
   */
  private readonly onFocusout = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    if (next instanceof Node && (this.contains(next) || this.renderRoot.contains(next))) {
      return;
    }
    this.closeList();
    if (this.typed !== null) {
      this.typed = null;
      this.requestUpdate();
    }
  };

  /** A press outside the field closes the list without choosing. */
  private readonly onDocumentPointerdown = (event: PointerEvent): void => {
    if (!event.composedPath().includes(this)) {
      this.closeList();
    }
  };

  /* --- The layer ------------------------------------------------------------------ */

  private show(list: HTMLElement): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      this.shown = true;
      try {
        list.showPopover();
      } catch {
        /* Not connected, or already showing: nothing to do. */
      }
      document.addEventListener('pointerdown', this.onDocumentPointerdown, true);
      window.addEventListener('scroll', this.onViewportChange, true);
      window.addEventListener('resize', this.onViewportChange);
      this.resizeObserver = new ResizeObserver(this.onViewportChange);
      this.resizeObserver.observe(this);
      this.resizeObserver.observe(list);
      this.updateScrollTargets();
      this.place(list);
      /* The first style is the closed one; the next one starts the enter transition. */
      void list.offsetWidth;
    } else {
      this.place(list);
    }
    list.setAttribute('data-open', '');
  }

  /** Starts the exit; the list leaves the top layer when the exit ends. */
  private hide(list: HTMLElement): void {
    list.removeAttribute('data-open');
    if (this.closeTimer !== undefined || !this.shown) {
      return;
    }
    const duration = parseFloat(getComputedStyle(list).transitionDuration) * 1000;
    if (!(duration > 0)) {
      this.hideNow();
      return;
    }
    this.closeTimer = window.setTimeout(() => {
      this.closeTimer = undefined;
      this.hideNow();
    }, duration);
  }

  private hideNow(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    document.removeEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.clearScrollTargets();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.shown = false;
    const list = this.list;
    if (list) {
      list.removeAttribute('data-open');
      try {
        list.hidePopover();
      } catch {
        /* Already hidden. */
      }
    }
  }

  /**
   * Every ancestor in the flat tree, as in `nph-combobox`: the scroll of an element inside a
   * shadow root does not reach `window`, so each ancestor and each root listens.
   */
  private updateScrollTargets(): void {
    this.clearScrollTargets();
    let node: Node | null = this;
    while (node !== null) {
      if (node instanceof Element || node instanceof ShadowRoot) {
        node.addEventListener('scroll', this.onViewportChange, true);
        this.scrollTargets.push(node);
      }
      /* The flat tree: a slotted node goes through its slot, inside the shadow root around it. */
      node = node instanceof ShadowRoot ? node.host : ((node as Element).assignedSlot ?? node.parentNode);
    }
  }

  private clearScrollTargets(): void {
    for (const target of this.scrollTargets) {
      target.removeEventListener('scroll', this.onViewportChange, true);
    }
    this.scrollTargets.length = 0;
  }

  private readonly onViewportChange = (): void => {
    if (this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      const list = this.list;
      if (list && this.shown) this.place(list);
    });
  };

  /** The distance to the field, carried by the margin of the side that faces it, in pixels. */
  private gap(list: HTMLElement, side: 'top' | 'bottom'): number {
    list.setAttribute('data-side', side);
    const style = getComputedStyle(list);
    return parseFloat(side === 'bottom' ? style.marginTop : style.marginBottom) || 0;
  }

  /** Below the field, with its width; above it when it does not fit below and fits above (P91). */
  private place(list: HTMLElement): void {
    const control = this.control;
    if (control === null) return;
    const anchor = control.getBoundingClientRect();
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    /* The field is scrolled out of the window: the list goes with it, not stuck to the edge. */
    const visible = anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width;
    list.style.visibility = visible ? '' : 'hidden';
    if (!visible) {
      return;
    }
    list.style.width = `${anchor.width}px`;
    list.style.top = '0px';
    list.style.left = '0px';
    const { height } = list.getBoundingClientRect();
    const below = view.height - anchor.bottom - this.gap(list, 'bottom') - height;
    const above = anchor.top - this.gap(list, 'top') - height;
    const side = below >= 0 || below >= above ? 'bottom' : 'top';
    const gap = this.gap(list, side);
    let y = side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - height;
    let x = anchor.left;
    x = Math.min(Math.max(x, 0), Math.max(view.width - anchor.width, 0));
    y = Math.min(Math.max(y, 0), Math.max(view.height - height, 0));
    const style = getComputedStyle(list);
    list.style.left = `${x - parseFloat(style.marginLeft)}px`;
    list.style.top = `${y - parseFloat(style.marginTop)}px`;
  }

  /** The active option comes into the view of the list, without scrolling the page. */
  private revealActive(): void {
    const scroller = this.scroller;
    const index = this.activeRow === null ? -1 : this.renderedRows.indexOf(this.activeRow);
    const row = index === -1 ? null : (this.renderRoot.querySelector(`#${this.uid}-${index}`) as HTMLElement | null);
    if (scroller === null || row === null) {
      return;
    }
    const box = scroller.getBoundingClientRect();
    const item = row.getBoundingClientRect();
    if (item.top < box.top) {
      scroller.scrollTop -= box.top - item.top;
    } else if (item.bottom > box.bottom) {
      scroller.scrollTop += item.bottom - box.bottom;
    }
  }

  /* --- Form value, validity and accessible name -------------------------------- */

  protected override firstUpdated(): void {
    requestAnimationFrame(() => {
      this.settled = true;
      this.syncName();
    });
  }

  protected override updated(changed: PropertyValues): void {
    const field = this.field;
    if (field !== null) {
      const index = this.activeRow === null ? -1 : this.renderedRows.indexOf(this.activeRow);
      if (this.open && index !== -1) {
        field.setAttribute('aria-activedescendant', `${this.uid}-${index}`);
      } else {
        field.removeAttribute('aria-activedescendant');
      }
    }
    const list = this.list;
    if (list === null) {
      /* Invalid input removed the list: nothing is shown, so a later valid input opens it again. */
      if (this.shown) {
        this.hideNow();
      }
    } else if (this.open) {
      this.show(list);
      this.revealActive();
    } else if (changed.has('open') || this.shown) {
      this.hide(list);
    }
    this.syncFormState();
  }

  /**
   * One entry `name=value` per chosen option, as `<select multiple>`: a `FormData` value is
   * submitted with its own keys, so each entry takes the current `name`. With no `name`,
   * nothing is submitted. The saved state is the whole list of values.
   */
  private syncFormState(): void {
    if (!this.valid) {
      this.internals.setFormValue(null);
      this.internals.setValidity({});
      return;
    }
    const chosen = this.chosenOptions;
    const state = new FormData();
    for (const value of this.current) {
      state.append('value', value);
    }
    const name = this.name ?? '';
    if (name === '') {
      this.internals.setFormValue(null, state);
    } else {
      const data = new FormData();
      for (const option of chosen) {
        data.append(name, option.value);
      }
      this.internals.setFormValue(data, state);
    }
    if (this.required && chosen.length === 0) {
      this.internals.setValidity({ valueMissing: true }, valueMissingMessage(), this.field ?? undefined);
    } else {
      this.internals.setValidity({});
    }
    this.syncName();
  }

  /**
   * The field and the listbox are named by the labels associated with the host (the
   * reference to an element of an outer scope is valid from inside the shadow root), or by
   * `label`.
   */
  private syncName(): void {
    const field = this.field;
    const listbox = this.renderRoot?.querySelector<HTMLElement>('.listbox') ?? null;
    if (field === null || listbox === null) {
      return;
    }
    const labels = [...this.internals.labels] as Element[];
    /* Only the labels of the host now, and only while it is in the page. */
    this.releaseLabels(this.isConnected ? labels : []);
    for (const label of this.isConnected ? labels : []) {
      if (!this.labelsHeard.has(label)) {
        this.labelsHeard.add(label);
        label.addEventListener('click', this.onLabelClick);
      }
    }
    const text = (this.label ?? '').trim();
    for (const element of [field, listbox]) {
      if (labels.length > 0) {
        element.ariaLabelledByElements = labels;
        element.removeAttribute('aria-label');
      } else {
        element.ariaLabelledByElements = null;
        if (text === '') {
          element.removeAttribute('aria-label');
        } else {
          element.setAttribute('aria-label', text);
        }
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

  /** The icon of a chip: the icon of its option, or `tag` for an option with no icon (D-3). */
  private chipIconName(option: NphComboboxOption): string {
    if (option.start !== 'icon') {
      return NPH_MULTI_COMBOBOX_CHIP_ICON;
    }
    const name = trimmed(option.icon) || NPH_OPTION_DEFAULT_ICON;
    return isCoreName(name) ? name : NPH_MULTI_COMBOBOX_CHIP_ICON;
  }

  /** One chip: the icon when `chip-icon` is on, the label on one line, and the remove button. */
  private renderChip(option: NphComboboxOption, removable: boolean): TemplateResult {
    const text = trimmed(option.text);
    return html`<span class="chip" role="listitem">
      ${this.chipIcon ? html`<nph-icon class="chip-icon" name=${this.chipIconName(option)} size="sm" aria-hidden="true"></nph-icon>` : nothing}
      <span class="chip-label">${text}</span>
      ${removable
        ? html`<button class="remove" type="button" aria-label=${`${trimmed(this.removeLabel)} ${text}`} @click=${(event: Event) => this.removeChoice(option, event)}>
            <nph-icon name="xmark" size="sm" aria-hidden="true"></nph-icon>
          </button>`
        : nothing}
    </span>`;
  }

  /** What sits before the text field: the chips, or the subject and the counter. */
  private renderChosen(chosen: NphComboboxOption[]): TemplateResult | typeof nothing {
    if (chosen.length === 0) {
      return nothing;
    }
    if (this.counter) {
      const subject = trimmed(this.subject);
      return html`${subject === '' ? nothing : html`<span class="subject">${subject}</span>`}
        <nph-badge class="count" severity="primary" emphasis="solid" text=${String(chosen.length)}></nph-badge>`;
    }
    const removable = this.removable;
    return html`<span class="chips" role="list">${chosen.map((option) => this.renderChip(option, removable))}</span>`;
  }

  /** The inside of the list: the groups, or the empty state. */
  private renderInside(): TemplateResult {
    const rows: NphComboboxOption[] = [];
    const chosen = new Set(this.chosenOptions);
    const query = this.query;
    const groups = this.visibleGroups.map((group, position) =>
      renderGroup(
        group,
        `${this.uid}-group-${position}`,
        group.options.map((option) => {
          rows.push(option);
          return renderOption(option, {
            id: `${this.uid}-${rows.length - 1}`,
            query,
            selected: chosen.has(option),
            active: this.open && option === this.activeRow,
            marker: 'checkbox',
          });
        }),
      ),
    );
    let status: TemplateResult | typeof nothing = nothing;
    if (rows.length === 0 && trimmed(this.emptyHeading) !== '') {
      const description = trimmed(this.emptyDescription);
      status = html`<nph-empty heading=${trimmed(this.emptyHeading)} description=${description === '' ? nothing : description}></nph-empty>`;
    }
    this.renderedRows = rows;
    return html`<div class="listbox" id="listbox" role="listbox" aria-multiselectable="true">${groups}</div>
      <div class="status" role="status">${status}</div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const inactive = this.inactive;
    const chosen = this.chosenOptions;
    const description = (this.description ?? '').trim();
    const placeholder = chosen.length === 0 ? (this.placeholder ?? '') : '';
    const text = this.typed ?? '';
    /* The text field is as wide as its text or its placeholder, and takes the rest of the line. */
    const width = Math.max(text.length, placeholder.length) + 1;

    return html`<div class="control" @click=${this.onControlClick} @mousedown=${this.onControlMousedown}>
        <nph-icon class="search" name="magnifying-glass" size="sm" aria-hidden="true"></nph-icon>
        <span class="content">
          ${this.renderChosen(chosen)}
          <input
            class="field"
            type="text"
            role="combobox"
            autocomplete="off"
            spellcheck="false"
            size=${width}
            .value=${live(text)}
            placeholder=${placeholder === '' ? nothing : placeholder}
            ?disabled=${inactive}
            aria-autocomplete="list"
            aria-expanded=${this.open ? 'true' : 'false'}
            aria-controls="listbox"
            aria-required=${this.required ? 'true' : nothing}
            aria-invalid=${this.invalid && !inactive ? 'true' : nothing}
            aria-describedby=${description === '' ? nothing : 'description'}
            @input=${this.onInput}
            @change=${this.onFieldChange}
            @keydown=${this.onKeydown}
          />
        </span>
        <nph-icon class="arrow" name="chevron-down" size="sm" aria-hidden="true"></nph-icon>
        ${description === '' ? nothing : html`<span class="description" id="description">${description}</span>`}
      </div>
      <div class="list" popover="manual" @mousedown=${this.onListMousedown} @click=${this.onListClick} @pointermove=${this.onListPointer}>
        <div class="scroller" tabindex="-1">${this.renderInside()}</div>
      </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphMultiCombobox);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-multi-combobox': NphMultiCombobox;
  }
}
