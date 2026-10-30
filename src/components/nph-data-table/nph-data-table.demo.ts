/**
 * Demonstration frame shared by the `nph-data-table` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index
 * it. The scenery here — the framed figure and the stack of examples — is NOT a precedent for
 * component CSS: the table takes its measures from the `data-table/*` and `table/*` tokens and
 * every piece from its own.
 *
 * The example is the one of the accepted documentation (`2875:17577`): people by unit, with the
 * search and Filter in the page bar, the person and the amount sortable, the selection column,
 * the more of each row and the footer. The demonstration plays the consumer: it sorts, cuts the
 * page and clears the search when the table says so, because the table itself never does. The
 * functions take the visible text as arguments: this file holds none, because every visible text
 * comes from the language dictionary of the page that calls it.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-input/nph-input';
import '../nph-separator/nph-separator';
import '../nph-toolbar/nph-toolbar';
import './nph-data-table';
import type { NphDropdownMenuEntry } from '../nph-dropdown-menu/nph-dropdown-menu';
import type { NphPaginationChangeDetail } from '../nph-pagination/nph-pagination';
import type { NphTableSize } from '../nph-table/nph-table';
import type {
  NphDataTable,
  NphDataTableColumn,
  NphDataTablePaginationLayout,
  NphDataTableRow,
  NphDataTableRowSwitchDetail,
  NphDataTableSortChangeDetail,
} from './nph-data-table';

export type Scheme = 'light' | 'dark';

/** The text the examples show, from the dictionary of the calling page. */
export interface DataTableText {
  caption: string;
  description: string;
  person: string;
  unit: string;
  amount: string;
  active: string;
  details: string;
  people: string[];
  units: string[];
  tableActions: string;
  selection: string;
  search: string;
  searchValue: string;
  filter: string;
  newPerson: string;
  clearSelection: string;
  download: string;
  delete: string;
  edit: string;
  selectAll: string;
  select: string;
  more: string;
  activeLabel: string;
  selectedText: string;
  noValue: string;
  emptyHeading: string;
  emptyDescription: string;
  clearFilter: string;
  pagination: string;
  page: string;
  first: string;
  previous: string;
  next: string;
  last: string;
  position: string;
  pageSize: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); box-sizing: border-box; min-inline-size: 0;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and dark mode, one under the other: a table needs the width. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', captions.light],
    ['dark', captions.dark],
  ];
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}
  </div>`;
}

/** One record of the example: the data the consumer keeps. */
interface Person {
  key: string;
  name: string;
  unit: string;
  amount: number | null;
  active: boolean;
}

/** The records of the example, the names and the units from the dictionary. */
function people(t: DataTableText): Person[] {
  const amounts = [1200, 860, null, 2400, 540, 1750, 930, 310, 1480, 2210, 670, 1990];
  return t.people.map((name, index) => ({
    key: `person-${index + 1}`,
    name,
    unit: t.units[index % t.units.length] as string,
    amount: amounts[index % amounts.length] as number | null,
    active: index % 3 !== 1,
  }));
}

function columns(t: DataTableText, withUnit = true): NphDataTableColumn[] {
  return [
    { key: 'person', header: t.person, sortable: true },
    ...(withUnit ? [{ key: 'unit', header: t.unit }] : []),
    { key: 'amount', header: t.amount, align: 'end' as const, sortable: true },
  ];
}

function rowOf(t: DataTableText, person: Person, detail: boolean): NphDataTableRow {
  return {
    key: person.key,
    name: person.name,
    switched: person.active,
    cells: { person: { type: 'person', text: person.name }, unit: person.unit, amount: person.amount },
    ...(detail ? { detail: { name: person.name, description: person.unit }, toggleLabel: t.details.replaceAll('{name}', person.name) } : {}),
  };
}

function actions(t: DataTableText): NphDropdownMenuEntry[] {
  return [
    { value: 'edit', text: t.edit, icon: 'pen-to-square' },
    { value: 'download', text: t.download, icon: 'download' },
    { type: 'separator' },
    { value: 'delete', text: t.delete, icon: 'trash', severity: 'destructive' },
  ];
}

/** The page bar: the search, named by what it filters, Filter and New person. */
function pageBar(t: DataTableText, search = ''): TemplateResult {
  return html`<nph-toolbar slot="toolbar" type="page" label=${t.tableActions}>
    <nph-input type="search" label=${t.search} placeholder=${t.search} icon-start="magnifying-glass" .value=${search}></nph-input>
    <nph-button severity="secondary" emphasis="ghost" icon-start="filter" text=${t.filter}></nph-button>
    <nph-button slot="end" icon-start="plus" text=${t.newPerson}></nph-button>
  </nph-toolbar>`;
}

/** The bulk bar, without its own checkbox: the select-all box is in the table header. */
function bulkBar(t: DataTableText): TemplateResult {
  return html`<nph-toolbar slot="bulk" type="bulk" label=${t.selection}>
    <nph-button severity="secondary" emphasis="ghost" text=${t.clearSelection} @click=${clearSelection}></nph-button>
    <nph-button slot="end" severity="secondary" emphasis="ghost" icon-start="download" text=${t.download}></nph-button>
    <nph-separator slot="end" orientation="vertical"></nph-separator>
    <nph-button slot="end" severity="danger" emphasis="ghost" icon-start="trash" text=${t.delete}></nph-button>
  </nph-toolbar>`;
}

function clearSelection(event: Event): void {
  const table = (event.currentTarget as Element).closest('nph-data-table');
  if (table !== null) table.selected = [];
}

export interface TableOptions {
  size?: NphTableSize;
  framed?: boolean;
  stickyHeader?: boolean;
  grid?: boolean;
  striped?: boolean;
  /** The Figma `estado`. */
  state?: 'default' | 'bulk' | 'empty' | 'loading';
  selectable?: boolean;
  withActions?: boolean;
  withSwitch?: boolean;
  withUnit?: boolean;
  /** The rows open by the chevron (the Figma `expande`). */
  detail?: boolean;
  toolbar?: boolean;
  caption?: boolean;
  description?: boolean;
  total?: boolean;
  /** The footer; `none` for a single page. */
  layout?: NphDataTablePaginationLayout | 'none';
  /** The sorted column at the start. */
  sort?: { key: string; direction: 'ascending' | 'descending' };
  /** How many records the example holds. */
  records?: number;
}

/** The people by unit table, playing the consumer for the sort, the page and the search. */
export function peopleTable(t: DataTableText, options: TableOptions = {}): TemplateResult {
  const {
    size = 'default',
    framed = true,
    stickyHeader = false,
    grid = false,
    striped = false,
    state = 'default',
    selectable = true,
    withActions = true,
    withSwitch = false,
    withUnit = true,
    detail = false,
    toolbar = true,
    caption = true,
    description = false,
    total = false,
    layout = 'middle',
    sort,
    records,
  } = options;
  const all = people(t).slice(0, records ?? t.people.length);
  let pageSize = layout === 'none' ? all.length : 5;
  let sorted = all;
  let page = 1;
  let sortKey = sort?.key ?? '';
  let direction = sort?.direction ?? '';

  const order = (list: Person[]): Person[] => {
    if (sortKey === '' || direction === '') return list;
    const sign = direction === 'ascending' ? 1 : -1;
    const value = (person: Person): string | number => (sortKey === 'amount' ? (person.amount ?? -1) : person.name);
    return [...list].sort((a, b) => (value(a) > value(b) ? sign : value(a) < value(b) ? -sign : 0));
  };
  const pageRows = (): NphDataTableRow[] => sorted.slice((page - 1) * pageSize, page * pageSize).map((person) => rowOf(t, person, detail));
  sorted = order(all);

  const onSort = (event: CustomEvent<NphDataTableSortChangeDetail>) => {
    sortKey = event.detail.key;
    direction = event.detail.direction;
    sorted = order(all);
    (event.currentTarget as NphDataTable).rows = pageRows();
  };
  const onPage = (event: CustomEvent<NphPaginationChangeDetail>) => {
    page = event.detail.page;
    pageSize = event.detail.pageSize ?? pageSize;
    (event.currentTarget as NphDataTable).rows = pageRows();
  };
  /* The consumer keeps the switch in its records, so a new page or a new order draws it again. */
  const onSwitch = (event: CustomEvent<NphDataTableRowSwitchDetail>) => {
    const person = all.find((candidate) => candidate.key === event.detail.row);
    if (person !== undefined) person.active = event.detail.checked;
  };
  const onClear = (event: Event) => {
    const table = event.currentTarget as NphDataTable;
    table.rows = pageRows();
    table.totalItems = all.length;
    const input = table.querySelector('nph-input');
    if (input !== null) input.value = '';
  };

  const empty = state === 'empty';
  const rows = empty ? [] : pageRows();
  const selected = state === 'bulk' ? rows.slice(0, 2).map((row) => row.key) : [];
  return html`<nph-data-table
    size=${size}
    ?framed=${framed}
    ?sticky-header=${stickyHeader}
    ?grid=${grid}
    ?striped=${striped}
    ?loading=${state === 'loading'}
    caption=${caption ? t.caption : nothing}
    description=${caption && description ? t.description : nothing}
    total=${caption && total ? String(all.length) : nothing}
    label=${caption ? nothing : t.caption}
    no-value-label=${t.noValue}
    empty-heading=${t.emptyHeading}
    empty-description=${t.emptyDescription}
    clear-label=${t.clearFilter}
    sort-key=${sortKey}
    sort-direction=${direction}
    ?selectable=${selectable}
    select-all-label=${t.selectAll}
    select-label=${t.select}
    selected-text=${t.selectedText}
    actions-label=${t.more}
    switch-header=${withSwitch ? t.active : nothing}
    switch-label=${t.activeLabel}
    pagination-layout=${layout === 'none' ? 'middle' : layout}
    pagination-label=${t.pagination}
    page-label=${t.page}
    first-label=${t.first}
    previous-label=${t.previous}
    next-label=${t.next}
    last-label=${t.last}
    position-text=${t.position}
    page-size-label=${t.pageSize}
    .columns=${columns(t, withUnit)}
    .rows=${rows}
    .selected=${selected}
    .actions=${withActions ? actions(t) : []}
    .page=${page}
    .pageSize=${pageSize}
    .pageSizes=${[5, 10, 20]}
    .totalItems=${empty ? 0 : all.length}
    @nph-sort-change=${onSort}
    @nph-page-change=${onPage}
    @nph-filter-clear=${onClear}
    @nph-row-switch=${onSwitch}
  >
    ${toolbar ? html`${pageBar(t, empty ? t.searchValue : '')}${bulkBar(t)}` : nothing}
  </nph-data-table>`;
}
