/**
 * `nph-data-table` — the table to search, sort, select and act on records.
 *
 * Contract accepted in Figma (frame `2875:17577`, set `2633:69628`), recorded as text in the
 * evidence of the `figma-docs-accepted` gate of DSA-58, sheet `fichas/nph-data-table.md` and
 * decision P105 — nph-data-table: API and semantics:
 * - it IS an `nph-table` (P97, P101): it extends its class and takes every attribute and
 *   property of it — `size`, `framed`, `sticky-header`, `striped`, `grid`, `caption`,
 *   `description`, `total`, `label`, `no-value-label`, `empty-heading`,
 *   `empty-description`, `columns`, `rows`, `footer` — with the same cells, chevron and
 *   expanded item. It draws its own parts through the extension points of `nph-table`;
 * - the data is controlled: `rows` arrive already searched, sorted and paged. The table keeps
 *   what the person chose — `sort-key` and `sort-direction`, `selected`, `page` and
 *   `page-size` — and says so in events; it never filters, sorts or cuts a list;
 * - sorting: a column with `sortable` draws its header as a button the size of the cell, with
 *   the arrow of the direction; the sorted header carries `aria-sort`. A click sorts another
 *   column ascending and turns the sorted one around (`nph-sort-change`, `{ key, direction }`);
 * - selection: `selectable` adds the column of `nph-checkbox`, the header box named
 *   `select-all-label` and the row box named `select-label` with `{name}` (the row `name`).
 *   `selected` is the list of row keys; the header box checks or unchecks the rows drawn and
 *   is indeterminate when only part of them is checked (`nph-selection-change`,
 *   `{ selected }`). A selected row takes the background and the mark at the inline start;
 * - the bars: the light-DOM `nph-toolbar` in the slot `toolbar` (tipo página) shows above the
 *   table, and the one in the slot `bulk` (tipo em massa) takes its place while a row is
 *   selected, with `count-text` written from `selected-text` (`{count}`, `{total}`);
 * - row actions: `actions` holds the entries of an `nph-dropdown-menu` opened by the ⋮ of
 *   each row, an icon-only `nph-button` secondary ghost named `actions-label` with `{name}`.
 *   An entry fires `nph-row-action` (`{ row, action }`), the event of `nph-table`;
 * - ajuste: `switch-header` adds a column with an `nph-switch` per row, named `switch-label`
 *   with `{name}`, on when the row has `switched` (`nph-row-switch`, `{ row, checked }`);
 * - states: `loading` puts an `nph-skeleton` in the cells, the header visible; with no row
 *   and `clear-label`, the body holds the `nph-empty` and the button that clears the search
 *   (`nph-filter-clear`);
 * - the footer: `page`, `page-size`, `page-sizes` and `total-items` draw the `nph-pagination`
 *   outside the scroll area in `pagination-layout` `wide` (its tipo tabela), `middle` (the
 *   label and the `nph-select` of items per page, and tipo intervalo) or `narrow` (tipo
 *   intervalo only); a single page draws no footer (`nph-page-change`, `{ page, pageSize }`);
 * - invalid input (P21 rule): what `nph-table` rejects renders nothing. A `sort-direction` or
 *   a `pagination-layout` outside its list, a row with `children` (the tree is `nph-table`'s),
 *   a control without its name: each cause emits one `console.error` in development and only
 *   the part it names is left out.
 */
import { html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

import '../nph-button/nph-button';
import '../nph-checkbox/nph-checkbox';
import '../nph-dropdown-menu/nph-dropdown-menu';
import '../nph-empty/nph-empty';
import '../nph-icon/nph-icon';
import '../nph-option/nph-option';
import '../nph-pagination/nph-pagination';
import '../nph-select/nph-select';
import '../nph-skeleton/nph-skeleton';
import '../nph-switch/nph-switch';
import { NphTable } from '../nph-table/nph-table';
import type { NphTableColumn, NphTableRow, NphTableRowActionDetail } from '../nph-table/nph-table';
import type { NphCheckbox } from '../nph-checkbox/nph-checkbox';
import type { NphDropdownMenuEntry, NphDropdownMenuItemSelectDetail } from '../nph-dropdown-menu/nph-dropdown-menu';
import type { NphPaginationChangeDetail } from '../nph-pagination/nph-pagination';
import type { NphSelect } from '../nph-select/nph-select';
import type { NphSwitch } from '../nph-switch/nph-switch';
import tableCss from '../nph-table/nph-table.css?inline';
import dataTableCss from './nph-data-table.css?inline';

const TAG = 'nph-data-table';

/** The directions of a sorted column, the values of `aria-sort`. Empty: no column is sorted. */
export const NPH_DATA_TABLE_SORT_DIRECTIONS = ['ascending', 'descending'] as const;
export type NphDataTableSortDirection = (typeof NPH_DATA_TABLE_SORT_DIRECTIONS)[number];

/** The footer by the width of the table's space: tipo tabela, the middle case or tipo intervalo. */
export const NPH_DATA_TABLE_PAGINATION_LAYOUTS = ['wide', 'middle', 'narrow'] as const;
export type NphDataTablePaginationLayout = (typeof NPH_DATA_TABLE_PAGINATION_LAYOUTS)[number];

/** The core icons of the sortable header (pending decision D-2): descending turns `ascending`. */
export const NPH_DATA_TABLE_ICONS = {
  sortable: 'arrow-up-arrow-down',
  ascending: 'arrow-up',
  more: 'ellipsis-vertical',
} as const;

/** The id of the `nph-select` of items per page, unique in the shadow root. */
const PAGE_SIZE_ID = 'page-size';

export interface NphDataTableColumn extends NphTableColumn {
  /** The header is a button that sorts the column. */
  readonly sortable?: boolean;
}

export interface NphDataTableRow extends NphTableRow {
  /** The name of the record, already localized, such as `Ana Souza`: it fills `{name}`. */
  readonly name?: string;
  /** The `nph-switch` of the ajuste column is on. */
  readonly switched?: boolean;
}

export interface NphDataTableSortChangeDetail {
  readonly key: string;
  readonly direction: NphDataTableSortDirection;
}

export interface NphDataTableSelectionChangeDetail {
  /** The keys of every selected row, the ones on other pages too. */
  readonly selected: readonly string[];
}

export interface NphDataTableRowSwitchDetail {
  readonly row: string;
  readonly checked: boolean;
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

/** Development warning; outside a bundler with `import.meta.env`, it stays silent. */
function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** A whole number from `min`, or `null`. */
function whole(value: unknown, min: number): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= min ? value : null;
}

/** The `input` of the inner fields is composed: it stops here, it is not the table's. */
function stop(event: Event): void {
  event.stopPropagation();
}

export class NphDataTable extends NphTable {
  /* The table's own style first, then the parts of the data table over it. */
  static override styles = unsafeCSS(`${tableCss}\n${dataTableCss}`);

  static override properties = {
    ...NphTable.properties,
    sortKey: { type: String, attribute: 'sort-key' },
    sortDirection: { type: String, attribute: 'sort-direction' },
    selectable: { type: Boolean, reflect: true },
    selected: { attribute: false },
    selectAllLabel: { type: String, attribute: 'select-all-label' },
    selectLabel: { type: String, attribute: 'select-label' },
    selectedText: { type: String, attribute: 'selected-text' },
    actions: { attribute: false },
    actionsLabel: { type: String, attribute: 'actions-label' },
    switchHeader: { type: String, attribute: 'switch-header' },
    switchLabel: { type: String, attribute: 'switch-label' },
    loading: { type: Boolean, reflect: true },
    clearLabel: { type: String, attribute: 'clear-label' },
    page: { type: Number },
    pageSize: { type: Number, attribute: 'page-size' },
    pageSizes: { type: Array, attribute: 'page-sizes' },
    totalItems: { type: Number, attribute: 'total-items' },
    paginationLayout: { type: String, attribute: 'pagination-layout', reflect: true },
    paginationLabel: { type: String, attribute: 'pagination-label' },
    pageLabel: { type: String, attribute: 'page-label' },
    firstLabel: { type: String, attribute: 'first-label' },
    previousLabel: { type: String, attribute: 'previous-label' },
    nextLabel: { type: String, attribute: 'next-label' },
    lastLabel: { type: String, attribute: 'last-label' },
    positionText: { type: String, attribute: 'position-text' },
    pageSizeLabel: { type: String, attribute: 'page-size-label' },
    hasToolbar: { state: true },
    hasBulk: { state: true },
  };

  declare columns: readonly NphDataTableColumn[];
  declare rows: readonly NphDataTableRow[];
  /** The key of the sorted column; empty, none is sorted. */
  declare sortKey: string;
  /** `ascending` or `descending`, for the column of `sort-key`. */
  declare sortDirection: NphDataTableSortDirection | '';
  /** Adds the selection column. */
  declare selectable: boolean;
  /** The keys of the selected rows. */
  declare selected: readonly string[];
  /** The name of the header box, already localized, such as `Selecionar todas`. */
  declare selectAllLabel: string;
  /** The name of a row box, with `{name}`, such as `Selecionar {name}`. */
  declare selectLabel: string;
  /** The count of the bulk bar, with `{count}` and `{total}`, such as `{count} de {total} selecionadas`. */
  declare selectedText: string;
  /** The entries of the menu of the ⋮; empty, there is no actions column. */
  declare actions: readonly NphDropdownMenuEntry[];
  /** The name of the ⋮ of a row, with `{name}`, such as `Mais ações de {name}`. */
  declare actionsLabel: string;
  /** The title of the ajuste column; empty, there is no ajuste column. */
  declare switchHeader: string;
  /** The name of the `nph-switch` of a row, with `{name}`. */
  declare switchLabel: string;
  /** The cells hold an `nph-skeleton` while the rows load. */
  declare loading: boolean;
  /** The text of the button that clears the search in the empty body, such as `Limpar filtro`. */
  declare clearLabel: string;
  declare page: number;
  declare pageSize: number | null;
  declare pageSizes: readonly number[];
  declare totalItems: number | null;
  declare paginationLayout: NphDataTablePaginationLayout;
  declare paginationLabel: string;
  declare pageLabel: string;
  declare firstLabel: string;
  declare previousLabel: string;
  declare nextLabel: string;
  declare lastLabel: string;
  declare positionText: string;
  declare pageSizeLabel: string;
  private declare hasToolbar: boolean;
  private declare hasBulk: boolean;

  /** Causes already reported, so a cause is reported once per instance. */
  private readonly told = new Set<string>();
  /** The parts whose name is missing, left out of this render. */
  private withSelection = false;
  private withActions = false;
  private withSwitch = false;
  /** The place of each drawn row, for the ids of the ⋮ and its menu. */
  private places = new Map<string, number>();
  /** The focus was in the bulk bar before this render. */
  private focusInBulk = false;

  constructor() {
    super();
    this.sortKey = '';
    this.sortDirection = '';
    this.selectable = false;
    this.selected = [];
    this.selectAllLabel = '';
    this.selectLabel = '';
    this.selectedText = '';
    this.actions = [];
    this.actionsLabel = '';
    this.switchHeader = '';
    this.switchLabel = '';
    this.loading = false;
    this.clearLabel = '';
    this.page = 1;
    this.pageSize = null;
    this.pageSizes = [];
    this.totalItems = null;
    this.paginationLayout = 'middle';
    this.paginationLabel = '';
    this.pageLabel = '';
    this.firstLabel = '';
    this.previousLabel = '';
    this.nextLabel = '';
    this.lastLabel = '';
    this.positionText = '';
    this.pageSizeLabel = '';
    this.hasToolbar = false;
    this.hasBulk = false;
  }

  private fail(cause: string, message: string): void {
    if (!this.told.has(`error ${cause}`)) {
      this.told.add(`error ${cause}`);
      devError(message);
    }
  }

  private caution(cause: string, message: string): void {
    if (!this.told.has(`warn ${cause}`)) {
      this.told.add(`warn ${cause}`);
      devWarn(message);
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    /* The tree is nph-table's: a row of the data table does not open children. */
    if (changed.has('rows') && Array.isArray(this.rows) && this.rows.some((row) => Array.isArray(row?.children))) {
      this.fail('children', 'a row has children: the data table does not draw a tree, which is nph-table\'s. The children are left out.');
      this.rows = this.rows.map((row) => (Array.isArray(row?.children) ? { ...row, children: undefined } : row));
    }
    super.willUpdate(changed);

    if (this.sortDirection !== '' && !oneOf(NPH_DATA_TABLE_SORT_DIRECTIONS, this.sortDirection)) {
      this.fail(
        `sort ${String(this.sortDirection)}`,
        `sort-direction "${String(this.sortDirection)}" does not exist. Use "ascending", "descending" or leave it empty. No column is drawn sorted.`,
      );
    }
    if (!oneOf(NPH_DATA_TABLE_PAGINATION_LAYOUTS, this.paginationLayout)) {
      this.fail(
        `layout ${String(this.paginationLayout)}`,
        `pagination-layout "${String(this.paginationLayout)}" does not exist. Use ${NPH_DATA_TABLE_PAGINATION_LAYOUTS.map((value) => `"${value}"`).join(', ')}. The footer is left out.`,
      );
    }
    const sortKey = trimmed(this.sortKey);
    if (sortKey !== '' && !this.validColumns.some((column) => (column as NphDataTableColumn).sortable === true && column.key.trim() === sortKey)) {
      this.caution(`sort key ${sortKey}`, `sort-key "${sortKey}" is not a sortable column: no column is drawn sorted.`);
    }

    this.withSelection = this.selectable && this.named('selection', [
      ['select-all-label', this.selectAllLabel],
      ['select-label', this.selectLabel],
    ]);
    this.withActions = Array.isArray(this.actions) && this.actions.length > 0 && this.named('actions', [['actions-label', this.actionsLabel]]);
    this.withSwitch = trimmed(this.switchHeader) !== '' && this.named('switch', [['switch-label', this.switchLabel]]);

    const rows = this.visibleRows as readonly NphDataTableRow[];
    this.places = new Map(rows.map((row, index) => [row.key.trim(), index]));
    if ((this.withSelection || this.withActions || this.withSwitch) && rows.some((row) => trimmed(row.name) === '')) {
      this.fail('row name', 'a row has no name: its box, its ⋮ and its switch need the name of the record for {name}. Their controls are left out of that row.');
    }

    /* The bulk bar leaves while the focus is in it: the focus goes to the header box after the render. */
    this.focusInBulk = this.bulkElements().some((element) => element.matches(':focus-within'));
  }

  /** Whether every name a part needs is given; otherwise the part is left out. */
  private named(part: string, names: ReadonlyArray<readonly [string, unknown]>): boolean {
    const missing = names.filter(([, value]) => trimmed(value) === '').map(([name]) => name);
    if (missing.length > 0) {
      this.fail(`${part} name`, `${missing.join(' and ')} ${missing.length === 1 ? 'is' : 'are'} empty: the ${part} column needs the names of its controls. The column is left out.`);
      return false;
    }
    return true;
  }

  protected override updated(): void {
    super.updated();
    const count = trimmed(this.selectedText);
    if (count !== '') {
      const text = count.replaceAll('{count}', this.format(this.selectedKeys().length)).replaceAll('{total}', this.format(this.recordCount()));
      for (const element of this.bulkElements()) {
        if (element.localName === 'nph-toolbar' && element.getAttribute('count-text') !== text) {
          element.setAttribute('count-text', text);
        }
      }
    }
    if (this.focusInBulk && !this.bulkShown()) {
      this.focusInBulk = false;
      this.renderRoot.querySelector<HTMLElement>('thead nph-checkbox')?.focus();
    }
  }

  /* ----- state ------------------------------------------------------------------- */

  private selectedKeys(): readonly string[] {
    return Array.isArray(this.selected) ? this.selected : [];
  }

  private isSelected(key: string): boolean {
    return this.selectedKeys().includes(key);
  }

  /** The total of records: `total-items`, or the rows drawn when it is not given. */
  private recordCount(): number {
    return whole(this.totalItems, 0) ?? this.visibleRows.length;
  }

  private bulkShown(): boolean {
    return this.hasBulk && this.selectedKeys().length > 0;
  }

  private bulkElements(): Element[] {
    return [...this.children].filter((child) => child.getAttribute('slot') === 'bulk');
  }

  /** The rows a control can be drawn for: the ones with a name. */
  private nameOf(row: NphDataTableRow): string {
    return trimmed(row.name);
  }

  private fill(template: string, name: string): string {
    return template.trim().replaceAll('{name}', name);
  }

  /**
   * The language of the page: the nearest `lang`, crossing the shadow roots the table lives
   * in, as `nph-pagination` reads it.
   */
  private language(): string | undefined {
    let node: Element | null = this;
    while (node !== null) {
      const found: Element | null = node.closest('[lang]');
      if (found !== null) return found.getAttribute('lang') || undefined;
      const root = node.getRootNode();
      node = root instanceof ShadowRoot ? root.host : null;
    }
    return undefined;
  }

  private format(value: number): string {
    try {
      return new Intl.NumberFormat(this.language()).format(value);
    } catch {
      return String(value);
    }
  }

  /* ----- what the person does ------------------------------------------------------ */

  private sortBy(column: NphDataTableColumn): void {
    const key = column.key.trim();
    const direction: NphDataTableSortDirection = this.sortedKey() === key && this.sortDirection === 'ascending' ? 'descending' : 'ascending';
    this.sortKey = key;
    this.sortDirection = direction;
    this.dispatchEvent(new CustomEvent<NphDataTableSortChangeDetail>('nph-sort-change', { detail: { key, direction }, bubbles: true }));
  }

  /** The key of the column drawn sorted, or empty. */
  private sortedKey(): string {
    return oneOf(NPH_DATA_TABLE_SORT_DIRECTIONS, this.sortDirection) ? trimmed(this.sortKey) : '';
  }

  private select(keys: readonly string[], checked: boolean): void {
    const current = this.selectedKeys();
    const next = checked ? [...current, ...keys.filter((key) => !current.includes(key))] : current.filter((key) => !keys.includes(key));
    this.selected = next;
    this.dispatchEvent(
      new CustomEvent<NphDataTableSelectionChangeDetail>('nph-selection-change', { detail: { selected: next }, bubbles: true }),
    );
  }

  /** The keys of the drawn rows that have a box. */
  private selectableKeys(): string[] {
    return (this.visibleRows as readonly NphDataTableRow[]).filter((row) => this.nameOf(row) !== '').map((row) => row.key.trim());
  }

  private onSelectAll(event: Event): void {
    const keys = this.selectableKeys();
    const all = keys.length > 0 && keys.every((key) => this.isSelected(key));
    /* The box shows what the table decides: the render draws it again from `selected`. */
    (event.currentTarget as NphCheckbox).checked = !all;
    this.select(keys, !all);
  }

  private onSelectRow(row: NphDataTableRow, event: Event): void {
    this.select([row.key.trim()], (event.currentTarget as NphCheckbox).checked);
  }

  private onSwitch(row: NphDataTableRow, event: Event): void {
    this.dispatchEvent(
      new CustomEvent<NphDataTableRowSwitchDetail>('nph-row-switch', {
        detail: { row: row.key.trim(), checked: (event.currentTarget as NphSwitch).checked },
        bubbles: true,
      }),
    );
  }

  private onAction(row: NphDataTableRow, event: CustomEvent<NphDropdownMenuItemSelectDetail>): void {
    this.dispatchEvent(
      new CustomEvent<NphTableRowActionDetail>('nph-row-action', { detail: { row: row.key.trim(), action: event.detail.value }, bubbles: true }),
    );
  }

  private onClear(): void {
    this.dispatchEvent(new CustomEvent('nph-filter-clear', { bubbles: true }));
  }

  /** The `nph-pagination` moved: the table keeps the page and the size, and the event goes on. */
  private onPage(event: CustomEvent<NphPaginationChangeDetail>): void {
    this.page = event.detail.page;
    this.pageSize = event.detail.pageSize ?? this.pageSize;
  }

  /** Items per page of the middle footer: the first item on screen stays on screen. */
  private onPageSize(event: Event): void {
    event.stopPropagation();
    const size = Number((event.currentTarget as NphSelect).value);
    const current = whole(this.pageSize, 1);
    if (whole(size, 1) === null || size === current) return;
    const first = (Math.max(1, this.page) - 1) * (current ?? size) + 1;
    this.pageSize = size;
    this.page = Math.max(1, Math.ceil(first / size));
    this.dispatchEvent(
      new CustomEvent<NphPaginationChangeDetail>('nph-page-change', {
        detail: { page: this.page, pageSize: size },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onSlotChange(event: Event): void {
    const slot = event.currentTarget as HTMLSlotElement;
    const filled = slot.assignedElements().length > 0;
    if (slot.name === 'bulk') this.hasBulk = filled;
    else this.hasToolbar = filled;
  }

  /* ----- the extension points of nph-table (P105) ------------------------------------ */

  protected override get leadingColumns(): number {
    return this.withSelection ? 1 : 0;
  }

  protected override get trailingColumns(): number {
    return (this.withSwitch ? 1 : 0) + (this.withActions ? 1 : 0);
  }

  protected override rowClasses(row: NphTableRow): string {
    return this.withSelection && this.isSelected(row.key.trim()) ? 'selected' : '';
  }

  protected override renderAboveTable(): TemplateResult {
    const bulk = this.bulkShown();
    return html`<div class="bars" ?hidden=${!bulk && !this.hasToolbar}>
      <slot name="toolbar" ?hidden=${bulk} @slotchange=${this.onSlotChange}></slot>
      <slot name="bulk" ?hidden=${!bulk} @slotchange=${this.onSlotChange}></slot>
    </div>`;
  }

  protected override renderLeadingHeaders(rowspan: number): TemplateResult | typeof nothing {
    if (!this.withSelection) return nothing;
    const keys = this.selectableKeys();
    const count = keys.filter((key) => this.isSelected(key)).length;
    /* A cell of the header row, not a column header: the box names itself (as the chevron column). */
    return html`<td class="select" rowspan=${rowspan === 1 ? nothing : rowspan}>
      <nph-checkbox
        label=${this.selectAllLabel.trim()}
        .checked=${live(keys.length > 0 && count === keys.length)}
        .indeterminate=${live(count > 0 && count < keys.length)}
        ?disabled=${keys.length === 0 || this.loading}
        @input=${stop}
        @change=${this.onSelectAll}
      ></nph-checkbox>
    </td>`;
  }

  protected override renderTrailingHeaders(rowspan: number): TemplateResult | typeof nothing {
    const span = rowspan === 1 ? nothing : rowspan;
    return html`${this.withSwitch ? html`<th scope="col" class="switch" rowspan=${span}>${this.switchHeader.trim()}</th>` : nothing}${this
      .withActions
      ? html`<td class="actions" rowspan=${span}></td>`
      : nothing}`;
  }

  protected override renderHeaderCell(column: NphTableColumn, rowspan: number): TemplateResult {
    if ((column as NphDataTableColumn).sortable !== true) return super.renderHeaderCell(column, rowspan);
    const sorted = this.sortedKey() === column.key.trim();
    const direction = sorted ? (this.sortDirection as NphDataTableSortDirection) : '';
    return html`<th
      scope="col"
      class=${`${this.alignClass(column)} sortable`}
      rowspan=${rowspan === 1 ? nothing : rowspan}
      style=${this.widthStyle(column)}
      aria-sort=${direction === '' ? nothing : direction}
    >
      <button type="button" class=${`sort ${direction}`.trim()} @click=${() => this.sortBy(column as NphDataTableColumn)}>
        <span class="label">${column.header}</span>
        <nph-icon class="arrow" size="sm" name=${direction === '' ? NPH_DATA_TABLE_ICONS.sortable : NPH_DATA_TABLE_ICONS.ascending}></nph-icon>
      </button>
    </th>`;
  }

  protected override renderLeadingCells(row: NphTableRow): TemplateResult | typeof nothing {
    if (!this.withSelection) return nothing;
    const name = this.nameOf(row as NphDataTableRow);
    return html`<td class="select">
      ${name === '' || this.loading
        ? nothing
        : html`<nph-checkbox
            label=${this.fill(this.selectLabel, name)}
            .checked=${live(this.isSelected(row.key.trim()))}
            @input=${stop}
            @change=${(event: Event) => this.onSelectRow(row as NphDataTableRow, event)}
          ></nph-checkbox>`}
    </td>`;
  }

  protected override renderTrailingCells(row: NphTableRow): TemplateResult | typeof nothing {
    const data = row as NphDataTableRow;
    const name = this.nameOf(data);
    const place = this.places.get(row.key.trim()) ?? 0;
    const switchCell = this.withSwitch
      ? html`<td class="switch">
          ${name === ''
            ? nothing
            : html`<nph-switch
                label=${this.fill(this.switchLabel, name)}
                .checked=${live(Boolean(data.switched))}
                @input=${stop}
                @change=${(event: Event) => this.onSwitch(data, event)}
              ></nph-switch>`}
        </td>`
      : nothing;
    const actionsCell = this.withActions
      ? html`<td class="actions">
          ${name === ''
            ? nothing
            : html`<nph-button
                  id=${`more-${place}`}
                  severity="secondary"
                  emphasis="ghost"
                  icon-start=${NPH_DATA_TABLE_ICONS.more}
                  label=${this.fill(this.actionsLabel, name)}
                ></nph-button>
                <nph-dropdown-menu
                  for=${`more-${place}`}
                  .items=${this.actions}
                  @nph-item-select=${(event: CustomEvent<NphDropdownMenuItemSelectDetail>) => this.onAction(data, event)}
                ></nph-dropdown-menu>`}
        </td>`
      : nothing;
    return html`${switchCell}${actionsCell}`;
  }

  protected override renderBody(): TemplateResult {
    const columns = this.validColumns;
    if (this.loading) {
      /* As many skeleton rows as the rows shown, or the page size (pending decision D-5). */
      const count = Math.max(1, this.visibleRows.length || (whole(this.pageSize, 1) ?? 1));
      const chevron = this.columnCount - this.leadingColumns - columns.length - this.trailingColumns;
      const empty = (length: number, name: string) => Array.from({ length }, () => html`<td class=${name}></td>`);
      return html`<tbody>
        ${Array.from(
          { length: count },
          () => html`<tr class="row loading">
            ${empty(this.leadingColumns, 'select')}${empty(chevron, 'chevron-column')}${columns.map(
              (column) => html`<td class=${this.alignClass(column)} aria-busy="true"><nph-skeleton shape="line"></nph-skeleton></td>`,
            )}${this.withSwitch ? empty(1, 'switch') : nothing}${this.withActions ? empty(1, 'actions') : nothing}
          </tr>`,
        )}
      </tbody>`;
    }
    const clear = trimmed(this.clearLabel);
    if ((this.rows ?? []).length === 0 && clear !== '' && trimmed(this.emptyHeading) !== '') {
      return html`<tbody>
        <tr class="empty">
          <td colspan=${this.columnCount}>
            <div class="empty-search">
              <nph-empty heading=${this.emptyHeading.trim()} description=${trimmed(this.emptyDescription)}></nph-empty>
              <nph-button severity="secondary" emphasis="outline" text=${clear} @click=${this.onClear}></nph-button>
            </div>
          </td>
        </tr>
      </tbody>`;
    }
    return super.renderBody();
  }

  protected override renderBelowTable(): TemplateResult | typeof nothing {
    const size = whole(this.pageSize, 1);
    const total = whole(this.totalItems, 0);
    if (!oneOf(NPH_DATA_TABLE_PAGINATION_LAYOUTS, this.paginationLayout) || size === null || total === null || total <= size) {
      return nothing;
    }
    const layout = this.paginationLayout;
    const sizes = Array.isArray(this.pageSizes) ? this.pageSizes.filter((value) => whole(value, 1) !== null) : [];
    const page = Math.max(1, whole(this.page, 1) ?? 1);
    const pagination = html`<nph-pagination
      type=${layout === 'wide' ? 'table' : 'range'}
      .page=${page}
      .totalItems=${total}
      .pageSize=${size}
      .pageSizes=${layout === 'wide' ? sizes : []}
      label=${trimmed(this.paginationLabel)}
      page-label=${trimmed(this.pageLabel)}
      first-label=${trimmed(this.firstLabel)}
      previous-label=${trimmed(this.previousLabel)}
      next-label=${trimmed(this.nextLabel)}
      last-label=${trimmed(this.lastLabel)}
      position-text=${trimmed(this.positionText)}
      page-size-label=${layout === 'wide' ? trimmed(this.pageSizeLabel) : ''}
      @nph-page-change=${this.onPage}
    ></nph-pagination>`;
    const label = trimmed(this.pageSizeLabel);
    const pageSize =
      layout === 'middle' && sizes.length > 0 && label !== ''
        ? html`<label class="page-size-label" for=${PAGE_SIZE_ID}>${label}</label>
            <nph-select id=${PAGE_SIZE_ID} .value=${String(size)} .label=${label} @input=${stop} @change=${this.onPageSize}>
              ${sizes.map((value) => html`<nph-option value=${String(value)}>${this.format(value)}</nph-option>`)}
            </nph-select>`
        : nothing;
    return html`<div class="pagination">${pageSize}${pagination}</div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphDataTable);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-data-table': NphDataTable;
  }
  interface HTMLElementEventMap {
    'nph-sort-change': CustomEvent<NphDataTableSortChangeDetail>;
    'nph-selection-change': CustomEvent<NphDataTableSelectionChangeDetail>;
    'nph-row-switch': CustomEvent<NphDataTableRowSwitchDetail>;
    'nph-filter-clear': CustomEvent<undefined>;
  }
}
