/**
 * `nph-command` — the command palette: a dialog with a search field, a list of commands by group
 * and a footer of keyboard hints. The person opens it, types, sees only the commands that match and
 * runs one with Enter.
 *
 * Contract accepted in Figma (documentation frame `6076:4910`, root `6067:3610`, set
 * `6068:3936`), recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-80, sheet
 * `fichas/nph-command.md`, `design.md` and decision P123 — nph-command: API and semantics:
 * - ONE tag. It draws a `nph-dialog` in its own shadow root and the palette inside it, so the
 *   field, the list and the items share one root and `aria-activedescendant`, `aria-controls` and
 *   `aria-labelledby` stay inside it. The dialog uses the options DSA-80 brought to it (title
 *   for screen readers only, no padding, no close button, a veil click closes) and the close origins
 *   `open-key` and `command-run`;
 * - `items`: the entries, as `nph-dropdown-menu` takes them (P92): a command `{ value, text,
 *   description, icon, severity, shortcut, count, tag, disabled }` and a group label
 *   `{ type: 'label', text }`. No separator (groups are told apart by space), no selection, switch,
 *   submenu, loading or avatar: the evidence leaves them out of v1. An invalid entry is left out;
 * - `open`: the state. Reflects. It follows the dialog: Esc, a veil click, the open key and a command
 *   run set it to `false`. The field is empty and the first command is active each time it opens;
 * - `query`, `filter` and `loading`: the typed text, who filters (`contains`, the search of
 *   `nph-combobox` with no difference of case or accent; or `none`, when the consumer answers from
 *   a server) and the `carregando` content;
 * - the texts, already localized, as in `nph-dialog`: `label` (the name of the dialog and of the
 *   field), `placeholder`, `loading-label` (the loading row), `empty-heading` and
 *   `empty-description` (the `vazio` content), `results-label` (the sentence the screen reader
 *   hears with the number of results, `{count}` is replaced by it) and `hint-navigate`, `hint-open`
 *   and `hint-close`, the words of the footer. The keys `↑↓`, `↵` and `esc` are legends of keys, not
 *   words. `hide-footer` turns the footer off, which is on by default;
 * - events: `nph-run` (bubbles, composed) with `detail: { value }`, when the person runs a command;
 *   the palette then closes with `nph-close` and `source: 'command-run'` (the dialog's own event, which
 *   crosses the shadow root). `nph-search` (bubbles, composed) with `detail: { query }`, when the
 *   person types;
 * - keyboard: the combobox of the APG with a listbox, inside a modal dialog. The focus stays on the
 *   field and `aria-activedescendant` points to the active command. Up and Down move without
 *   wrapping and skip a disabled command, Home and End go to the first and the last, Enter runs, Esc
 *   closes, Tab stays on the field. The first command is active while typing (DSA-46 D-5). The
 *   pointer over a command makes it active (DSA-45 D-6). A group label never takes focus;
 * - `global-shortcut`: off by default. On, the component listens to Ctrl+K and ⌘K in the document and
 *   opens or closes the palette. With the palette open, the key closes it whether the attribute
 *   is on or not. The consumer owns the shortcut otherwise;
 * - no `::part`, no slot, no color property, no width property;
 * - invalid input emits `console.error` only in development, one per cause and accumulating (P21
 *   rule): an empty `label` or a `filter` outside the two draw nothing; `loading` without
 *   `loading-label`, an empty `empty-heading`, an empty `results-label` and a hint without its word
 *   draw what they can and say what is missing.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-badge/nph-badge';
import '../nph-dialog/nph-dialog';
import '../nph-empty/nph-empty';
import '../nph-icon/nph-icon';
import '../nph-kbd/nph-kbd';
import '../nph-separator/nph-separator';
import '../nph-spinner/nph-spinner';
import { highlighted, matches } from '../nph-combobox/nph-combobox.list';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import type { NphDialog } from '../nph-dialog/nph-dialog';
import commandCss from './nph-command.css?inline';

const TAG = 'nph-command';

/** The event fired when the person runs a command. */
export const NPH_COMMAND_RUN_EVENT = 'nph-run';

/** The event fired when the person types. */
export const NPH_COMMAND_SEARCH_EVENT = 'nph-search';

/** Who filters the list: the command (`contains`) or the consumer (`none`). */
export const NPH_COMMAND_FILTERS = ['contains', 'none'] as const;
export type NphCommandFilter = (typeof NPH_COMMAND_FILTERS)[number];

/** The two types of the item (the Figma `tipo`). */
export const NPH_COMMAND_SEVERITIES = ['default', 'destructive'] as const;
export type NphCommandSeverity = (typeof NPH_COMMAND_SEVERITIES)[number];

/** One command of the list. */
export interface NphCommandItem {
  type?: 'item';
  /** What `nph-run` reports. */
  value: string;
  /** The label, already localized by the consuming application. */
  text: string;
  description?: string;
  /** A core name of `nph-icon`: the start icon. Absent or empty: no icon. */
  icon?: string;
  severity?: NphCommandSeverity;
  /** The shortcut of the command, as text and already written for the platform, such as `⌘N`. */
  shortcut?: string;
  count?: number | string;
  /** One word in an `nph-badge`, such as `New`. */
  tag?: string;
  disabled?: boolean;
}

/** The name of the group that follows it. */
export interface NphCommandLabel {
  type: 'label';
  text: string;
}

export type NphCommandEntry = NphCommandItem | NphCommandLabel;

/** `nph-run`: the command the person ran. */
export interface NphCommandRunDetail {
  readonly value: string;
}

/** `nph-search`: the text the person typed. */
export interface NphCommandSearchDetail {
  readonly query: string;
}

/** The magnifying glass at the start of the field. */
const SEARCH_ICON = 'magnifying-glass';

let nextId = 0;

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : typeof value === 'number' ? String(value) : '';
}

/** A command as the list draws it: the entry and its place in the walk of the keyboard. */
interface Row {
  readonly entry: NphCommandItem;
  readonly id: string;
}

/** A group: the label that opens it (empty for none) and its commands. */
interface Group {
  readonly label: string;
  readonly rows: Row[];
}

/** The keys of the entry that the command does not take, and why. */
const NOT_IN_V1 = ['selection', 'switch', 'checked', 'submenu', 'loading', 'avatar'] as const;

/** The causes that keep an entry out of the list, one sentence each. */
function entryProblems(entry: unknown): string[] {
  if (typeof entry !== 'object' || entry === null) {
    return ['an entry is not an object'];
  }
  const candidate = entry as Record<string, unknown>;
  if (candidate.type === 'label') {
    return trimmed(candidate.text) === '' ? ['a label entry has no text'] : [];
  }
  if (candidate.type === 'separator') {
    return ['a separator entry does not exist here: groups are told apart by space and by their label'];
  }
  if (candidate.type !== undefined && candidate.type !== 'item') {
    return [`an entry type "${String(candidate.type)}" does not exist. Use item or label`];
  }
  const problems: string[] = [];
  if (typeof candidate.value !== 'string') {
    problems.push('a command has no string value');
  }
  if (trimmed(candidate.text) === '') {
    problems.push('a command has no text');
  }
  if (candidate.icon !== undefined && trimmed(candidate.icon) !== '' && !isCoreName(trimmed(candidate.icon))) {
    problems.push(`a command icon "${String(candidate.icon)}" is not a core name of nph-icon`);
  }
  if (candidate.severity !== undefined && !oneOf(NPH_COMMAND_SEVERITIES, candidate.severity)) {
    problems.push(`a command severity "${String(candidate.severity)}" does not exist. Use ${NPH_COMMAND_SEVERITIES.join(', ')}`);
  }
  for (const key of NOT_IN_V1) {
    if (candidate[key] !== undefined && candidate[key] !== false && candidate[key] !== 'none') {
      problems.push(`a command "${key}" does not exist in the palette (no submenu, selection or switch in v1)`);
    }
  }
  return problems;
}

export class NphCommand extends LitElement {
  static override styles = unsafeCSS(commandCss);

  static override properties = {
    items: { attribute: false },
    /* `open` reflects: the consumer's selectors read it and the dialog is bound to it. */
    open: { type: Boolean, reflect: true },
    query: { attribute: false },
    filter: { type: String },
    loading: { type: Boolean },
    label: { type: String },
    placeholder: { type: String },
    loadingLabel: { type: String, attribute: 'loading-label' },
    emptyHeading: { type: String, attribute: 'empty-heading' },
    emptyDescription: { type: String, attribute: 'empty-description' },
    resultsLabel: { type: String, attribute: 'results-label' },
    hintNavigate: { type: String, attribute: 'hint-navigate' },
    hintOpen: { type: String, attribute: 'hint-open' },
    hintClose: { type: String, attribute: 'hint-close' },
    hideFooter: { type: Boolean, attribute: 'hide-footer' },
    globalShortcut: { type: Boolean, attribute: 'global-shortcut' },
  };

  /** The entries of the list: commands and group labels. */
  declare items: readonly NphCommandEntry[];
  /** The palette is open. */
  declare open: boolean;
  /** The typed text. Setting it from code writes it in the field and filters the list. */
  declare query: string;
  declare filter: string;
  /** The search is answering: the list shows the spinner and `loading-label`. */
  declare loading: boolean;
  /** The name of the dialog and of the field, already localized. Required. */
  declare label: string;
  declare placeholder: string;
  /** The text of the loading row, already localized. Required with `loading`. */
  declare loadingLabel: string;
  /** The title of the `nph-empty` when nothing matches. */
  declare emptyHeading: string;
  /** The description of the `nph-empty` when nothing matches. */
  declare emptyDescription: string;
  /** What the screen reader hears with the number of results; `{count}` becomes the number. */
  declare resultsLabel: string;
  declare hintNavigate: string;
  declare hintOpen: string;
  declare hintClose: string;
  /** Turns off the footer of hints, on by default. */
  declare hideFooter: boolean;
  /** Listens to Ctrl+K and ⌘K in the document and opens or closes the palette. */
  declare globalShortcut: boolean;

  private readonly uid = `nph-command-${(nextId += 1)}`;
  private valid = false;
  private groups: Group[] = [];
  private rows: Row[] = [];
  /** The `items` the entries were read from, and the entries that are valid. */
  private entriesSource: unknown = undefined;
  private entries: NphCommandEntry[] = [];
  /** The command the pointer or the keyboard is on, by its `value` position in `rows`. */
  private activeRow: Row | null = null;
  /** `items` or `loading` changed, so the first command is active again. */
  private resetActive = true;
  private wasLoading = false;
  /** The person typed since the palette opened; the announcement speaks only then. */
  private typed = false;
  private composing = false;
  private reported = new Set<string>();
  private dialogWatch: MutationObserver | undefined;
  /** The active command moved by the keyboard, so the list scrolls to it. */
  private reveal: 'keyboard' | 'start' | null = null;

  constructor() {
    super();
    this.items = [];
    this.open = false;
    this.query = '';
    this.filter = 'contains';
    this.loading = false;
    this.label = '';
    this.placeholder = '';
    this.loadingLabel = '';
    this.emptyHeading = '';
    this.emptyDescription = '';
    this.resultsLabel = '';
    this.hintNavigate = '';
    this.hintOpen = '';
    this.hintClose = '';
    this.hideFooter = false;
    this.globalShortcut = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.globalShortcut) {
      document.addEventListener('keydown', this.onDocumentKeydown);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.onDocumentKeydown);
    this.dialogWatch?.disconnect();
    this.dialogWatch = undefined;
  }

  /* ----- the global shortcut ------------------------------------------------- */

  private static isOpenKey(event: KeyboardEvent): boolean {
    return (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k';
  }

  /** The browser keeps Ctrl+K for its own address bar: the palette takes it, and says so with `preventDefault`. */
  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.defaultPrevented || event.repeat || event.isComposing || !NphCommand.isOpenKey(event) || !this.valid) {
      return;
    }
    event.preventDefault();
    if (this.open) {
      this.dialog?.requestClose('open-key');
    } else {
      this.open = true;
    }
  };

  /* ----- the entries, the groups and the rows --------------------------------- */

  private report(causes: readonly string[]): void {
    for (const cause of causes) {
      if (!this.reported.has(cause)) {
        this.reported.add(cause);
        devError(cause);
      }
    }
  }

  /** Reads `items` again only when it is another list; one error per cause. */
  private readEntries(): void {
    if (this.entriesSource === this.items) {
      return;
    }
    this.entriesSource = this.items;
    const list = Array.isArray(this.items) ? (this.items as readonly unknown[]) : [];
    const kept: NphCommandEntry[] = [];
    for (const entry of list) {
      const problems = entryProblems(entry);
      if (problems.length > 0) {
        this.report(problems);
      } else {
        kept.push(entry as NphCommandEntry);
      }
    }
    this.entries = kept;
    this.resetActive = true;
  }

  /** The groups of the valid entries that match the query, a group with no command left dropped. */
  private buildGroups(): Group[] {
    const query = this.filter === 'contains' ? this.query : '';
    const groups: Array<{ label: string; entries: NphCommandItem[] }> = [];
    let current: { label: string; entries: NphCommandItem[] } | null = null;
    for (const entry of this.entries) {
      if (entry.type === 'label') {
        current = { label: trimmed(entry.text), entries: [] };
        groups.push(current);
        continue;
      }
      if (current === null) {
        current = { label: '', entries: [] };
        groups.push(current);
      }
      if (matches(trimmed(entry.text), query)) {
        current.entries.push(entry);
      }
    }
    let position = 0;
    return groups
      .filter((group) => group.entries.length > 0)
      .map((group) => ({
        label: group.label,
        rows: group.entries.map((entry) => ({ entry, id: `${this.uid}-item-${position++}` })),
      }));
  }

  private static available(row: Row): boolean {
    return row.entry.disabled !== true;
  }

  private get first(): Row | null {
    return this.rows.find(NphCommand.available) ?? null;
  }

  private get dialog(): NphDialog | null {
    return this.renderRoot?.querySelector<NphDialog>('nph-dialog') ?? null;
  }

  /* ----- the life of the element ----------------------------------------------- */

  protected override willUpdate(changed: PropertyValues<this>): void {
    const errors: string[] = [];
    const label = trimmed(this.label);
    if (label === '') {
      errors.push('label is required: it is the name of the dialog and of the field; nothing was drawn.');
    }
    if (!oneOf(NPH_COMMAND_FILTERS, this.filter)) {
      errors.push(`filter "${String(this.filter)}" does not exist. Use ${NPH_COMMAND_FILTERS.join(', ')}; nothing was drawn.`);
    }
    this.valid = errors.length === 0;
    if (this.valid) {
      if (this.loading && trimmed(this.loadingLabel) === '') {
        errors.push('loading-label is required with loading: it is the text of the loading row; the row has no text.');
      }
      if (trimmed(this.emptyHeading) === '') {
        errors.push('empty-heading is required: it is the title of the empty state; the empty state was not drawn.');
      }
      if (trimmed(this.resultsLabel) === '') {
        errors.push('results-label is required: it is what the screen reader hears with the number of results; nothing is announced.');
      }
      if (!this.hideFooter) {
        const missing = (
          [
            ['hint-navigate', this.hintNavigate],
            ['hint-open', this.hintOpen],
            ['hint-close', this.hintClose],
          ] as const
        ).filter(([, word]) => trimmed(word) === '');
        for (const [name] of missing) {
          errors.push(`${name} is required while the footer is shown: it is the word of the hint; the hint was not drawn.`);
        }
      }
    }
    this.report(errors);

    if (changed.has('open') && this.open) {
      this.query = '';
      this.typed = false;
      this.resetActive = true;
    }
    if (changed.has('globalShortcut')) {
      document.removeEventListener('keydown', this.onDocumentKeydown);
      if (this.globalShortcut && this.isConnected) {
        document.addEventListener('keydown', this.onDocumentKeydown);
      }
    }
    if (this.wasLoading && !this.loading) {
      this.resetActive = true;
    }
    this.wasLoading = this.loading;
    this.readEntries();
    if (changed.has('query') || changed.has('filter')) {
      this.resetActive = true;
    }
    this.groups = this.buildGroups();
    this.rows = this.groups.flatMap((group) => group.rows);
    if (this.loading) {
      /* While the answer is awaited the list shows the loading row: no command is drawn, so none is active and none runs. */
      this.groups = [];
      this.rows = [];
      this.activeRow = null;
    } else if (this.resetActive) {
      this.activeRow = this.first;
      this.resetActive = false;
      this.reveal = 'start';
    } else if (this.activeRow !== null) {
      /* The same command in the new rows, or the first when it left or went off. */
      const same = this.rows.find((row) => row.entry === this.activeRow?.entry && NphCommand.available(row));
      this.activeRow = same ?? this.first;
    }
  }

  protected override updated(): void {
    const dialog = this.dialog;
    if (dialog !== null && this.dialogWatch === undefined) {
      /*
       * The dialog sets `open` itself on every way out: Esc, the veil, `requestClose`, the browser
       * closing the window. The attribute is where all of them show, so the state follows it.
       */
      this.dialogWatch = new MutationObserver(() => {
        const current = this.dialog;
        if (current !== null && current.open !== this.open) {
          this.open = current.open;
        }
      });
      this.dialogWatch.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    }
    if (this.reveal !== null) {
      const mode = this.reveal;
      this.reveal = null;
      this.scrollToActive(mode);
    }
  }

  /** Brings the active command into view; the first of a group brings its label too. */
  private scrollToActive(mode: 'keyboard' | 'start'): void {
    const list = this.renderRoot.querySelector<HTMLElement>('.list');
    if (list === null) {
      return;
    }
    if (mode === 'start') {
      list.scrollTop = 0;
      return;
    }
    if (this.activeRow !== null && this.activeRow === this.rows[0]) {
      /* The first command brings the top of the list, with the label of its group and the padding. */
      list.scrollTop = 0;
      return;
    }
    const element = this.activeRow === null ? null : this.renderRoot.querySelector<HTMLElement>(`#${this.activeRow.id}`);
    const before = element?.previousElementSibling;
    if (before instanceof HTMLElement && before.classList.contains('group-label')) {
      before.scrollIntoView({ block: 'nearest' });
    }
    element?.scrollIntoView({ block: 'nearest' });
  }

  /* ----- the person at the field and at the list ------------------------------- */

  private move(to: Row | null): void {
    if (to === null || to === this.activeRow) {
      return;
    }
    this.activeRow = to;
    this.reveal = 'keyboard';
    this.requestUpdate();
  }

  private step(direction: 1 | -1): void {
    const available = this.rows.filter(NphCommand.available);
    if (available.length === 0) {
      return;
    }
    const at = this.activeRow === null ? -1 : available.indexOf(this.activeRow);
    if (at === -1) {
      this.move(direction === 1 ? (available[0] ?? null) : (available[available.length - 1] ?? null));
      return;
    }
    /* No wrap: the last command stops Down and the first stops Up. */
    this.move(available[at + direction] ?? null);
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.isComposing || this.composing) {
      return;
    }
    if (NphCommand.isOpenKey(event)) {
      event.preventDefault();
      this.dialog?.requestClose('open-key');
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.step(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.step(-1);
        break;
      case 'Home': {
        event.preventDefault();
        const available = this.rows.filter(NphCommand.available);
        this.move(available[0] ?? null);
        break;
      }
      case 'End': {
        event.preventDefault();
        const available = this.rows.filter(NphCommand.available);
        this.move(available[available.length - 1] ?? null);
        break;
      }
      case 'Enter':
        event.preventDefault();
        if (this.activeRow !== null) {
          this.run(this.activeRow);
        }
        break;
      case 'Tab':
        /* The field is the only stop of the dialog: the focus does not leave it. */
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  private readonly onInput = (event: Event): void => {
    const field = event.target as HTMLInputElement;
    this.query = field.value;
    this.typed = true;
    this.dispatchEvent(
      new CustomEvent<NphCommandSearchDetail>(NPH_COMMAND_SEARCH_EVENT, {
        bubbles: true,
        composed: true,
        detail: { query: this.query },
      }),
    );
  };

  private readonly onCompositionstart = (): void => {
    this.composing = true;
  };

  private readonly onCompositionend = (): void => {
    this.composing = false;
  };

  private rowOf(element: EventTarget | null): Row | null {
    const item = element instanceof Element ? element.closest<HTMLElement>('.item') : null;
    return this.rows.find((row) => row.id === item?.id) ?? null;
  }

  /** The pointer over a command makes it active, and the keyboard goes on from there (DSA-45 D-6). */
  private readonly onPointermove = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') {
      return;
    }
    const row = this.rowOf(event.target);
    if (row !== null && NphCommand.available(row) && row !== this.activeRow) {
      this.activeRow = row;
      this.requestUpdate();
    }
  };

  /** The focus stays on the field: a press on a command does not take it. */
  private readonly onPointerdown = (event: PointerEvent): void => {
    if (this.rowOf(event.target) !== null) {
      event.preventDefault();
    }
  };

  private readonly onClick = (event: MouseEvent): void => {
    const row = this.rowOf(event.target);
    if (row !== null && NphCommand.available(row)) {
      this.run(row);
    }
  };

  /** Tells the consumer which command ran, then closes the dialog with that origin. */
  private run(row: Row): void {
    if (!NphCommand.available(row)) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent<NphCommandRunDetail>(NPH_COMMAND_RUN_EVENT, {
        bubbles: true,
        composed: true,
        detail: { value: row.entry.value },
      }),
    );
    this.dialog?.requestClose('command-run');
  }

  /* ----- drawing ---------------------------------------------------------------- */

  /** The number of results, in the sentence of the consumer, or the empty state. */
  private get announcement(): string {
    if (!this.typed || this.loading) {
      return '';
    }
    if (this.rows.length === 0) {
      return trimmed(this.emptyHeading);
    }
    return trimmed(this.resultsLabel).replace(/\{count\}/g, String(this.rows.length));
  }

  private renderItem(row: Row): TemplateResult {
    const { entry } = row;
    const text = trimmed(entry.text);
    const description = trimmed(entry.description);
    const icon = trimmed(entry.icon);
    const shortcut = trimmed(entry.shortcut);
    const count = trimmed(entry.count);
    const tag = trimmed(entry.tag);
    const active = row === this.activeRow;
    const disabled = entry.disabled === true;
    const query = this.filter === 'contains' ? this.query : '';
    const describedBy = [description === '' ? '' : `${row.id}-description`, count === '' ? '' : `${row.id}-count`, tag === '' ? '' : `${row.id}-tag`]
      .filter((id) => id !== '')
      .join(' ');
    return html`<div
      class="item"
      id=${row.id}
      role="option"
      aria-selected=${active ? 'true' : 'false'}
      aria-disabled=${disabled ? 'true' : nothing}
      aria-labelledby="${row.id}-text"
      aria-describedby=${describedBy === '' ? nothing : describedBy}
      data-severity=${entry.severity ?? 'default'}
      ?data-active=${active}
      ?data-disabled=${disabled}
    >
      ${icon === ''
        ? nothing
        : html`<nph-icon class="icon" name=${icon} variant=${active ? 'solid' : 'light'} size="md" aria-hidden="true"></nph-icon>`}
      <span class="texts"
        ><span class="text" id="${row.id}-text">${highlighted(text, query)}</span>${description === ''
          ? nothing
          : html`<span class="description" id="${row.id}-description">${description}</span>`}</span
      >
      <span class="end"
        >${shortcut === '' ? nothing : html`<span class="shortcut" aria-hidden="true">${shortcut}</span>`}${count === ''
          ? nothing
          : html`<span class="count" id="${row.id}-count">${count}</span>`}${tag === ''
          ? nothing
          : html`<span class="slot" id="${row.id}-tag"><nph-badge class="tag" text=${tag}></nph-badge></span>`}</span
      >
    </div>`;
  }

  private renderGroup(group: Group, position: number): TemplateResult {
    const items = group.rows.map((row) => this.renderItem(row));
    if (group.label === '') {
      return html`<div class="group" role="group">${items}</div>`;
    }
    const labelId = `${this.uid}-group-${position}`;
    return html`<div class="group" role="group" aria-labelledby=${labelId}>
      <div class="group-label" id=${labelId}>${group.label}</div>
      ${items}
    </div>`;
  }

  private renderStatus(): TemplateResult | typeof nothing {
    if (this.loading) {
      const text = trimmed(this.loadingLabel);
      return html`<div class="status loading">
        <nph-spinner size="sm"></nph-spinner>${text === '' ? nothing : html`<span class="loading-text">${text}</span>`}
      </div>`;
    }
    if (this.rows.length === 0 && trimmed(this.emptyHeading) !== '') {
      const description = trimmed(this.emptyDescription);
      return html`<div class="status empty">
        <nph-empty heading=${trimmed(this.emptyHeading)} description=${description === '' ? nothing : description}></nph-empty>
      </div>`;
    }
    return nothing;
  }

  private renderFooter(): TemplateResult | typeof nothing {
    if (this.hideFooter) {
      return nothing;
    }
    const hints = [
      { keys: '↑↓', word: trimmed(this.hintNavigate) },
      { keys: '↵', word: trimmed(this.hintOpen) },
      { keys: 'esc', word: trimmed(this.hintClose) },
    ].filter((hint) => hint.word !== '');
    if (hints.length === 0) {
      return nothing;
    }
    return html`<nph-separator class="line"></nph-separator>
      <div class="footer">
        ${hints.map(
          (hint) =>
            html`<span class="hint"><nph-kbd aria-hidden="true" text=${hint.keys}></nph-kbd><span class="hint-word">${hint.word}</span></span>`,
        )}
      </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const label = this.label.trim();
    const active = this.activeRow;
    const listed = this.rows.length > 0 || this.loading;
    return html`<nph-dialog
      class="dialog"
      heading=${label}
      size="md"
      hide-heading
      no-padding
      hide-close
      close-on-backdrop
      .open=${this.open}
    >
      <div class="surface">
        <div class="search">
          <div class="control">
            <nph-icon class="start" name=${SEARCH_ICON} size="sm" aria-hidden="true"></nph-icon>
            <input
              class="field"
              type="text"
              role="combobox"
              autofocus
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              aria-label=${label}
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-expanded=${listed ? 'true' : 'false'}
              aria-controls="${this.uid}-listbox"
              aria-activedescendant=${active === null ? nothing : active.id}
              placeholder=${this.placeholder.trim() === '' ? nothing : this.placeholder.trim()}
              .value=${this.query}
              @input=${this.onInput}
              @keydown=${this.onKeydown}
              @compositionstart=${this.onCompositionstart}
              @compositionend=${this.onCompositionend}
            />
          </div>
        </div>
        <nph-separator class="line"></nph-separator>
        <div class="list" @pointermove=${this.onPointermove} @pointerdown=${this.onPointerdown} @click=${this.onClick}>
          <div
            class="listbox"
            id="${this.uid}-listbox"
            role="listbox"
            aria-label=${label}
            aria-busy=${this.loading ? 'true' : nothing}
            ?hidden=${!listed}
          >
            ${this.loading ? nothing : this.groups.map((group, position) => this.renderGroup(group, position))}
          </div>
          ${this.renderStatus()}
        </div>
        ${this.renderFooter()}
        <div class="announce" role="status" aria-live="polite">${this.announcement}</div>
      </div>
    </nph-dialog>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphCommand);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-command': NphCommand;
  }
  interface HTMLElementEventMap {
    'nph-run': CustomEvent<NphCommandRunDetail>;
    'nph-search': CustomEvent<NphCommandSearchDetail>;
  }
}
