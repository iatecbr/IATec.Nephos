/**
 * `nph-combobox` — the field where the person types to filter a list of options and picks one.
 *
 * Contract accepted in Figma (board `1359:142`, documentation `1766:2400`, set `1359:115`,
 * list `1359:141`, option `1357:136`), sheet `fichas/nph-combobox.md`, `design.md` and
 * decision P95 — nph-combobox: API and semantics. The form pattern is P80; the field
 * contract is P83; the option and the layer are those of P91:
 * - `options`: the entries of the list, as data, as the `items` of `nph-dropdown-menu`
 *   (P92): an option `{ value, text, secondary, start, icon, src, status, disabled }`, a
 *   group label `{ type: 'label', text }` and a separator `{ type: 'separator' }`. The
 *   combobox draws each option as an `nph-option` in its own shadow root, so the typed
 *   stretch can be highlighted inside the label (P95). An invalid entry is left out;
 * - `size`: `default` or `large`. Reflects, because the internal CSS selects the height by
 *   it;
 * - `value`: the current value, the value of the chosen option. The `value` ATTRIBUTE is
 *   the initial value and the value of `form.reset()`, as in `nph-input` (P80). The chosen
 *   option is the first option with that value; the value is kept until such an option
 *   arrives (P91). The text of the field is the text of the chosen option;
 * - `placeholder`: the invitation before a choice (the Figma `conteúdo=placeholder`);
 * - `start`: `search` (default, the magnifying glass), `icon` or `avatar` (the Figma
 *   `início`). With `icon`, the icon of the chosen option when its own start is `icon`,
 *   otherwise `icon`; with `avatar`, the photo of the chosen option, otherwise the empty
 *   avatar, as in `nph-select`;
 * - `icon`: a core name of `nph-icon`, default `globe` (the Figma `ícone início`);
 * - `clearable` and `clear-label`: the clear button (the Figma `limpar`) and its accessible
 *   name. It erases the chosen option and the typed text;
 * - `filter`: `contains` (default), the list keeps the options whose text contains the
 *   typed text, with no difference of case or accent; `none`, the consumer filters the
 *   `options` itself, as a search that answers from a server;
 * - `loading` and `loading-label`: the `carregando` list, the `nph-spinner` and its name;
 * - `creatable` and `create-label`: the `criar` list, a row that offers the typed text as a
 *   new item;
 * - `empty-heading` and `empty-description`: the `vazio` list, the `nph-empty` when nothing
 *   matches;
 * - the `shortcuts` slot: the `atalhos` footer, with the `nph-kbd` keys of the consumer;
 * - `open`: the list is open. Reflects. Opening and closing fire no event;
 * - `name`, `required`, `invalid`, `disabled`, `label` and `description`: as in
 *   `nph-select` (P83, P91);
 * - `query`: the typed text. Setting it from code writes it in the field and filters the
 *   list, and fires nothing;
 * - events: the host fires `input` (bubbles, composed) and then `change` (bubbles) only
 *   when the person changes the value: a choice, the clear button or the create row. The
 *   native `input` of the inner field stops in the shadow root, because typing does not
 *   change the value; `nph-search` (bubbles, composed), with `detail: { query }`, says the
 *   typed text changed. `nph-create`, with `detail: { text }`, says the person chose the
 *   create row; the value becomes the text, and the consumer adds the option;
 * - keyboard: the editable combobox of the APG, with list autocomplete and automatic
 *   selection. The focus stays on the inner field; the active option is pointed to by
 *   `aria-activedescendant`. Typing opens and filters the list and makes the first match
 *   active; the arrows move; Enter chooses; Escape closes; Tab closes without choosing;
 * - no `::part`, no color property, no width property: the width is `layout/input-width`;
 * - invalid input does not render and emits `console.error` only in development, one per
 *   cause and accumulating (P21 rule): a `size` outside the two, a `start` outside the
 *   three, an `icon` outside the core and a `filter` outside the two. `clearable` without
 *   `clear-label` draws no clear button, `creatable` without `create-label` draws no create
 *   row, and `loading` without `loading-label` draws an unnamed spinner, each with one
 *   error. A combobox with no accessible name renders and warns once.
 *
 * LAYER — the list is a `popover="manual"`, so it lives in the top layer, as the
 * `nph-select` list (P91): no `z-index` and no clipping by an ancestor. It opens
 * `space/inline-tight` below the field, with the width of the field, turns up when it does
 * not fit below and fits above, and follows the field on scroll and resize.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

import '../nph-avatar/nph-avatar';
import '../nph-empty/nph-empty';
import '../nph-icon/nph-icon';
import '../nph-spinner/nph-spinner';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import { NPH_OPTION_DEFAULT_ICON } from '../nph-option/nph-option';
import comboboxCss from './nph-combobox.css?inline';
import {
  comboboxListStyles,
  entryProblems,
  filterGroups,
  groupsOf,
  isOption,
  renderCreate,
  renderGroup,
  renderOption,
  trimmed,
} from './nph-combobox.list';
import type { NphComboboxEntry, NphComboboxGroup, NphComboboxOption } from './nph-combobox.list';

export type { NphComboboxEntry, NphComboboxLabel, NphComboboxOption, NphComboboxSeparator } from './nph-combobox.list';

const TAG = 'nph-combobox';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The two sizes of the set. */
export const NPH_COMBOBOX_SIZES = ['default', 'large'] as const;
export type NphComboboxSize = (typeof NPH_COMBOBOX_SIZES)[number];

/** The three starts of the field (the Figma `início`: `lupa`, `ícone` and `avatar`). */
export const NPH_COMBOBOX_STARTS = ['search', 'icon', 'avatar'] as const;
export type NphComboboxStart = (typeof NPH_COMBOBOX_STARTS)[number];

/** Who filters the list: the combobox (`contains`) or the consumer (`none`). */
export const NPH_COMBOBOX_FILTERS = ['contains', 'none'] as const;
export type NphComboboxFilter = (typeof NPH_COMBOBOX_FILTERS)[number];

/** `nph-search`: the text the person typed. */
export interface NphComboboxSearchDetail {
  readonly query: string;
}

/** `nph-create`: the typed text the person chose to add as a new item. */
export interface NphComboboxCreateDetail {
  readonly text: string;
}

/** The magnifying glass of the `lupa` start. */
const SEARCH_ICON = 'magnifying-glass';

/** How many options Page Up and Page Down move, as in `nph-select`. */
const PAGE_STEP = 10;

/** The create row, among the rows the keyboard walks. */
const CREATE = Symbol('create');

type Row = NphComboboxOption | typeof CREATE;

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

/** An option the person can reach: not disabled. */
function available(row: Row): boolean {
  return row === CREATE || row.disabled !== true;
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

export class NphCombobox extends LitElement {
  static override styles = [unsafeCSS(comboboxCss), comboboxListStyles];

  /* Host focus, and a click on an associated label, go to the inner field. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* The host takes part in the form: labelable, with a value and a validity of its own. */
  static formAssociated = true;

  static override properties = {
    options: { attribute: false },
    /* `size` reflects because the internal CSS selects the height by it. */
    size: { type: String, reflect: true },
    /* The `value` attribute is the default, read by hand (see `attributeChangedCallback`). */
    value: { attribute: false, noAccessor: true },
    placeholder: { type: String },
    start: { type: String },
    icon: { type: String },
    clearable: { type: Boolean },
    clearLabel: { type: String, attribute: 'clear-label' },
    filter: { type: String },
    loading: { type: Boolean },
    loadingLabel: { type: String, attribute: 'loading-label' },
    creatable: { type: Boolean },
    createLabel: { type: String, attribute: 'create-label' },
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
  /** The invitation before a choice, already localized by the consuming application. */
  declare placeholder: string;
  declare start: string;
  /** A core icon name: the start of the field with `start="icon"`. */
  declare icon: string;
  /** Shows the clear button when there is a choice or typed text. */
  declare clearable: boolean;
  /** Accessible name of the clear button. Required with `clearable`. */
  declare clearLabel: string;
  declare filter: string;
  /** The search is answering: the list shows the spinner. */
  declare loading: boolean;
  /** Accessible name of the spinner. Required with `loading`. */
  declare loadingLabel: string;
  /** The list offers the typed text as a new item. */
  declare creatable: boolean;
  /** The words of the create row before the typed text, such as `Create`. Required with `creatable`. */
  declare createLabel: string;
  /** The title of the `nph-empty` when nothing matches. */
  declare emptyHeading: string;
  /** The description of the `nph-empty` when nothing matches. */
  declare emptyDescription: string;
  /** The list is open. */
  declare open: boolean;
  /** Name of the entry in the form data. */
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
  private readonly uid = `nph-combobox-${nextId++}`;
  private resizeObserver: ResizeObserver | undefined;
  private current = '';
  /** Chosen by the person or set by code: the `value` attribute no longer applies. */
  private dirty = false;
  private valid = false;
  /** The text the person typed; `null` while the field shows the chosen option. */
  private typed: string | null = null;
  /** The row the pointer or the keyboard is on, while the list is open. */
  private activeRow: Row | null = null;
  /** The list is in the top layer: from `showPopover()` until the exit transition ends. */
  private shown = false;
  private closeTimer: number | undefined;
  private frame: number | undefined;
  private hasShortcuts = false;
  /** The valid entries, kept until `options` changes. */
  private entries: NphComboboxEntry[] = [];
  /** After the first frame, a label rendered by another element has had its chance. */
  private settled = false;
  private warnedNoName = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.options = [];
    this.size = 'default';
    this.placeholder = '';
    this.start = 'search';
    this.icon = NPH_OPTION_DEFAULT_ICON;
    this.clearable = false;
    this.clearLabel = '';
    this.filter = 'contains';
    this.loading = false;
    this.loadingLabel = '';
    this.creatable = false;
    this.createLabel = '';
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
  }

  override disconnectedCallback(): void {
    this.labelObserver.disconnect();
    this.hideNow();
    this.open = false;
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
    this.typed = null;
    this.syncFormState();
    this.requestUpdate('value', old);
  }

  /**
   * The typed text; empty while the field shows the chosen option. Setting it from code
   * writes the text in the field and filters the list, as if typed, and fires nothing.
   */
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
    this.typed = null;
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

  private get allOptions(): NphComboboxOption[] {
    return this.entries.filter(isOption);
  }

  /** The chosen option: the first one with the current value. */
  private get selectedOption(): NphComboboxOption | null {
    return this.allOptions.find((option) => option.value === this.current) ?? null;
  }

  /** The groups the list shows: filtered by the typed text, unless the consumer filters. */
  private get visibleGroups(): NphComboboxGroup[] {
    const groups = groupsOf(this.entries);
    return this.filter === 'none' ? groups : filterGroups(groups, this.query);
  }

  /** The create row shows with typed text that no option already says, in a list that accepts it. */
  private get showsCreate(): boolean {
    const text = this.query.trim();
    if (!this.creatable || trimmed(this.createLabel) === '' || text === '' || this.loading) {
      return false;
    }
    const folded = text.toLocaleLowerCase();
    return !this.allOptions.some((option) => trimmed(option.text).toLocaleLowerCase() === folded);
  }

  /** The rows the keyboard walks, in order: the options shown, then the create row. */
  private get rows(): Row[] {
    if (this.loading) {
      return [];
    }
    const rows: Row[] = this.visibleGroups.flatMap((group) => [...group.options]);
    if (this.showsCreate) {
      rows.push(CREATE);
    }
    return rows;
  }

  private get availableRows(): Row[] {
    return this.rows.filter(available);
  }

  /** The list has something to show: rows, the spinner or the empty state. */
  private get hasContent(): boolean {
    return this.loading || this.rows.length > 0 || trimmed(this.emptyHeading) !== '';
  }

  /* --- Validation of the input ---------------------------------------------- */

  protected override willUpdate(changed: PropertyValues): void {
    const decisive = ['size', 'start', 'icon', 'filter'].some((name) => changed.has(name));
    if (decisive) {
      const size = (this.size ?? '').trim();
      const start = (this.start ?? '').trim();
      const icon = (this.icon ?? '').trim();
      const filter = (this.filter ?? '').trim();
      let valid = true;

      if (!oneOf(NPH_COMBOBOX_SIZES, size)) {
        devError(`size "${size}" does not exist. Use ${NPH_COMBOBOX_SIZES.join(' or ')}.`);
        valid = false;
      }
      if (!oneOf(NPH_COMBOBOX_STARTS, start)) {
        devError(`start "${start}" does not exist. Use ${NPH_COMBOBOX_STARTS.join(', ')}.`);
        valid = false;
      }
      if (!isCoreName(icon)) {
        devError(`icon "${icon}" is not a core name of nph-icon.`);
        valid = false;
      }
      if (!oneOf(NPH_COMBOBOX_FILTERS, filter)) {
        devError(`filter "${filter}" does not exist. Use ${NPH_COMBOBOX_FILTERS.join(' or ')}.`);
        valid = false;
      }

      this.valid = valid;
      this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
    }
    if (changed.has('options') || !this.hasUpdated) {
      this.entries = this.readEntries();
      this.syncFormState();
    }
    if (this.valid && changed.has('clearable') && this.clearable && trimmed(this.clearLabel) === '') {
      devError('clearable needs clear-label as the accessible name of the clear button; the button was not drawn.');
    }
    if (this.valid && changed.has('creatable') && this.creatable && trimmed(this.createLabel) === '') {
      devError('creatable needs create-label, the words of the create row; the row was not drawn.');
    }
    if (this.valid && changed.has('loading') && this.loading && trimmed(this.loadingLabel) === '') {
      devError('loading needs loading-label as the accessible name of the spinner.');
    }

    /* A disabled or invalid combobox, or one with nothing to show, does not open. */
    if (this.open && (!this.valid || this.inactive || !this.hasContent)) {
      this.open = false;
    }
    const reachable = this.availableRows;
    if (this.activeRow !== null && !reachable.includes(this.activeRow)) {
      this.activeRow = null;
    }
    /* New results, or a new query, while the list is open: the first match is active again (D-5). */
    if (this.open && this.query !== '' && this.activeRow === null && (changed.has('options') || changed.has('loading') || changed.has('query'))) {
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

  /** On opening: the chosen option when it is shown and can be reached, otherwise none. */
  private initialActive(): Row | null {
    const selected = this.selectedOption;
    return selected !== null && this.availableRows.includes(selected) ? selected : null;
  }

  /* --- The person types, opens, moves, chooses ----------------------------------- */

  private setActive(row: Row | null): void {
    if (row === this.activeRow) {
      return;
    }
    this.activeRow = row;
    this.requestUpdate();
  }

  /** Opens the list, with `row` active. */
  private openList(row: Row | null): void {
    if (this.inactive || !this.valid || !this.hasContent) {
      return;
    }
    this.activeRow = row;
    this.open = true;
  }

  private closeList(): void {
    this.open = false;
  }

  /** The typed text changes by the person: `nph-search` says it. */
  private setTyped(next: string | null): void {
    const before = this.query;
    this.typed = next;
    if (this.query !== before) {
      this.dispatchEvent(
        new CustomEvent<NphComboboxSearchDetail>('nph-search', { detail: { query: this.query }, bubbles: true, composed: true }),
      );
    }
  }

  /** The value changes by the person: `input` and then `change`, with the form data up to date. */
  private commit(next: string): void {
    const old = this.current;
    this.current = next;
    this.dirty = true;
    this.syncFormState();
    this.requestUpdate('value', old);
    if (this.current !== old) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /** The person chooses a row. The list closes and the field shows the chosen option. */
  private choose(row: Row): void {
    if (!available(row) || this.inactive) {
      return;
    }
    if (row === CREATE) {
      this.create();
      return;
    }
    this.closeList();
    this.setTyped(null);
    this.commit(row.value);
    this.field?.focus();
  }

  /** The create row: the typed text becomes the value, and `nph-create` asks the consumer to add it. */
  private create(): void {
    const text = this.query.trim();
    if (text === '') {
      return;
    }
    this.closeList();
    this.dispatchEvent(new CustomEvent<NphComboboxCreateDetail>('nph-create', { detail: { text }, bubbles: true, composed: true }));
    this.setTyped(null);
    this.commit(text);
    this.field?.focus();
  }

  /** The clear button: no choice and no typed text, the focus back on the field. */
  private clear(): void {
    if (this.inactive) {
      return;
    }
    this.setTyped(null);
    const field = this.field;
    if (field !== null) {
      field.value = '';
      field.focus();
    }
    this.commit('');
  }

  /** The row at a step from the active one, among those the person can reach. Never wraps. */
  private step(delta: number): Row | null {
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
   * the value. The list opens, is filtered, and the first match is active (D-5).
   */
  private onInput(event: Event): void {
    event.stopPropagation();
    const field = this.field;
    if (field === null || this.inactive) {
      return;
    }
    this.setTyped(field.value);
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
        this.openList(this.initialActive() ?? this.availableRows[0] ?? null);
      } else if (key === 'ArrowUp') {
        this.openList(this.initialActive() ?? this.availableRows.at(-1) ?? null);
      } else if (key === 'Enter') {
        this.submitLater(event);
        handled = false;
      } else if (key === 'Escape' && this.query !== '') {
        /* With the list closed, Escape clears the typed text (D-4); the field shows the choice again. */
        this.setTyped(null);
        this.requestUpdate();
        event.stopPropagation();
      } else {
        handled = false;
      }
    } else if (key === 'Enter' || (key === 'ArrowUp' && altKey)) {
      if (this.activeRow !== null) {
        this.choose(this.activeRow);
      } else {
        this.closeList();
      }
    } else if (key === 'Escape') {
      this.closeList();
      /* The Escape closes the list only, not a dialog around the combobox. */
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

  /** A click on the field opens the list; a click on the arrow area opens or closes it. */
  private onControlClick(event: MouseEvent): void {
    if (this.inactive) {
      return;
    }
    const path = event.composedPath();
    if (path.some((target) => target instanceof Element && target.classList.contains('clear'))) {
      return;
    }
    const onArrow = path.some((target) => target instanceof Element && target.classList.contains('arrow'));
    this.field?.focus();
    if (this.open && onArrow) {
      this.closeList();
    } else if (!this.open) {
      this.openList(this.initialActive());
    }
  }

  /** A press on the arrow area or the start keeps the focus on the field. */
  private onControlMousedown(event: MouseEvent): void {
    const path = event.composedPath();
    if (path.some((target) => target instanceof Element && (target.classList.contains('field') || target.classList.contains('clear')))) {
      return;
    }
    event.preventDefault();
  }

  /** The row an event happened on. */
  private rowOf(event: Event): Row | null {
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

  /** The rows as the last render drew them, by position. */
  private renderedRows: Row[] = [];

  /** A click during the exit of a closed list chooses nothing: the list is already closed. */
  private onListClick(event: MouseEvent): void {
    const row = this.rowOf(event);
    if (row !== null && this.open) {
      this.choose(row);
    }
  }

  private onListPointer(event: PointerEvent): void {
    const row = this.rowOf(event);
    if (row !== null && available(row)) {
      this.setActive(row);
    }
  }

  /** The list never takes the focus: it stays on the field. */
  private onListMousedown(event: MouseEvent): void {
    event.preventDefault();
  }

  private onShortcutsChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const has = slot.assignedNodes({ flatten: true }).length > 0;
    if (has !== this.hasShortcuts) {
      this.hasShortcuts = has;
      this.requestUpdate();
    }
  }

  /**
   * The focus left the combobox (Tab, a click elsewhere, code): the list closes without
   * choosing, and the field shows the chosen option again.
   */
  private readonly onFocusout = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    if (next instanceof Node && (this.contains(next) || this.renderRoot.contains(next))) {
      return;
    }
    this.closeList();
    if (this.typed !== null) {
      this.setTyped(null);
      this.requestUpdate();
    }
  };

  /** A press outside the combobox closes the list without choosing. */
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
   * Every ancestor in the flat tree, as in `nph-select`: the scroll of an element inside a
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

  /** The active row comes into the view of the list, without scrolling the page. */
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

  private syncFormState(): void {
    const selected = this.selectedOption;
    if (!this.valid) {
      this.internals.setFormValue(null);
      this.internals.setValidity({});
      return;
    }
    this.internals.setFormValue(selected === null ? null : selected.value, this.current);
    const missing = this.required && (selected === null || selected.value === '');
    if (missing) {
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
      devWarn('the combobox has no accessible name: associate a label (nph-label for, or nph-field) or set label. The placeholder is not a name.');
    }
  }

  /* --- Drawing ---------------------------------------------------------------- */

  /** The start of the field: the combobox decides the kind, the chosen option gives the art. */
  private startArt(selected: NphComboboxOption | null): TemplateResult {
    const start = (this.start ?? '').trim();
    if (start === 'icon') {
      const own = selected !== null && selected.start === 'icon' ? trimmed(selected.icon) : '';
      const name = own !== '' && isCoreName(own) ? own : (this.icon ?? '').trim();
      return html`<nph-icon class="start" name=${name} size="sm" aria-hidden="true"></nph-icon>`;
    }
    if (start === 'avatar') {
      const src = selected !== null && selected.start === 'avatar' ? trimmed(selected.src) : '';
      return html`<nph-avatar class="start" size="sm" src=${src} aria-hidden="true"></nph-avatar>`;
    }
    return html`<nph-icon class="start" name=${SEARCH_ICON} size="sm" aria-hidden="true"></nph-icon>`;
  }

  /** The inside of the list: the spinner, the groups and the create row, or the empty state. */
  private renderInside(selected: NphComboboxOption | null): TemplateResult {
    const rows: Row[] = [];
    const id = (row: Row): string => {
      rows.push(row);
      return `${this.uid}-${rows.length - 1}`;
    };
    let groups: TemplateResult[] = [];
    let create: TemplateResult | typeof nothing = nothing;
    let status: TemplateResult | typeof nothing = nothing;
    if (this.loading) {
      const name = trimmed(this.loadingLabel);
      status = html`<nph-spinner size="md" label=${name === '' ? nothing : name}></nph-spinner>`;
    } else {
      const query = this.query;
      groups = this.visibleGroups.map((group, position) =>
        renderGroup(
          group,
          `${this.uid}-group-${position}`,
          group.options.map((option) =>
            renderOption(option, {
              id: id(option),
              query,
              selected: option === selected,
              active: this.open && option === this.activeRow,
            }),
          ),
        ),
      );
      if (this.showsCreate) {
        create = renderCreate(trimmed(this.createLabel), query.trim(), { id: id(CREATE), active: this.open && this.activeRow === CREATE });
      }
      if (rows.length === 0 && trimmed(this.emptyHeading) !== '') {
        const description = trimmed(this.emptyDescription);
        status = html`<nph-empty heading=${trimmed(this.emptyHeading)} description=${description === '' ? nothing : description}></nph-empty>`;
      }
    }
    this.renderedRows = rows;
    return html`<div class="listbox" id="listbox" role="listbox">${groups}${create}</div>
      <div class="status" role="status">${status}</div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const inactive = this.inactive;
    const selected = this.selectedOption;
    const description = (this.description ?? '').trim();
    const placeholder = this.placeholder ?? '';
    const text = this.typed ?? (selected === null ? '' : trimmed(selected.text));
    const showClear = this.clearable && trimmed(this.clearLabel) !== '' && !inactive && (selected !== null || this.query !== '' || this.current !== '');

    return html`<div class="control" @click=${this.onControlClick} @mousedown=${this.onControlMousedown}>
        ${this.startArt(selected)}
        <input
          class="field"
          type="text"
          role="combobox"
          autocomplete="off"
          spellcheck="false"
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
        ${showClear
          ? html`<button class="clear" type="button" aria-label=${trimmed(this.clearLabel)} @click=${this.clear}>
              <nph-icon name="xmark" size="sm" aria-hidden="true"></nph-icon>
            </button>`
          : nothing}
        <span class="arrow" aria-hidden="true">
          <nph-icon name=${this.open ? 'chevron-up' : 'chevron-down'} size="sm"></nph-icon>
        </span>
        ${description === '' ? nothing : html`<span class="description" id="description">${description}</span>`}
      </div>
      <div
        class="list"
        popover="manual"
        @mousedown=${this.onListMousedown}
        @click=${this.onListClick}
        @pointermove=${this.onListPointer}
      >
        <div class="scroller">${this.renderInside(selected)}</div>
        <div class="footer" ?hidden=${!this.hasShortcuts}><slot name="shortcuts" @slotchange=${this.onShortcutsChange}></slot></div>
      </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphCombobox);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-combobox': NphCombobox;
  }
  interface HTMLElementEventMap {
    'nph-search': CustomEvent<NphComboboxSearchDetail>;
    'nph-create': CustomEvent<NphComboboxCreateDetail>;
  }
}
