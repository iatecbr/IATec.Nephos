/**
 * Demonstration frame of the `nph-tree-table` Validation stories.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the framed figure and the stack of examples — is NOT a precedent for component CSS:
 * the table takes its measures from the `tree-table/*`, `data-table/*` and `table/*` tokens and every
 * piece from its own.
 *
 * The example is the one of the accepted documentation (`7812:13461`): people by region, with the
 * search and Filter in the page bar, the unit in the tree column, the selection column, the more of each
 * row and the footer. West Region is partial, Oregon and its two cities are selected, Nevada
 * is loading and Washington failed and shows the error row. The demonstration plays the consumer
 * for the load: opening East Region asks for its cities, and Try again answers with them. The
 * functions take the visible text as arguments: this file holds none, because every visible text comes
 * from the language dictionary of the page that calls it.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import '../nph-button/nph-button';
import '../nph-input/nph-input';
import '../nph-separator/nph-separator';
import '../nph-toolbar/nph-toolbar';
import './nph-tree-table';
import type { NphDropdownMenuEntry } from '../nph-dropdown-menu/nph-dropdown-menu';
import type { NphDataTableColumn } from '../nph-data-table/nph-data-table';
import type { NphTableSize } from '../nph-table/nph-table';
import type { NphTreeTable, NphTreeTableLoadDetail, NphTreeTableRow } from './nph-tree-table';

export type Scheme = 'light' | 'dark';

/** The text the examples show, from the dictionary of the calling page. */
export interface TreeTableText {
  caption: string;
  description: string;
  unit: string;
  owner: string;
  people: string;
  tableActions: string;
  selection: string;
  search: string;
  searchValue: string;
  filter: string;
  newUnit: string;
  clearSelection: string;
  download: string;
  edit: string;
  selectAll: string;
  select: string;
  more: string;
  open: string;
  selectedText: string;
  noValue: string;
  errorText: string;
  retryText: string;
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
  /** The places of the example: the two regions, the states and the cities. */
  places: {
    west: string;
    east: string;
    oregon: string;
    portland: string;
    salem: string;
    nevada: string;
    washington: string;
    boston: string;
    albany: string;
  };
  owners: string[];
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

function columns(t: TreeTableText): NphDataTableColumn[] {
  return [
    { key: 'unit', header: t.unit, sortable: true, width: '320px' },
    { key: 'owner', header: t.owner },
    { key: 'people', header: t.people, align: 'end', sortable: true },
  ];
}

function actions(t: TreeTableText): NphDropdownMenuEntry[] {
  return [
    { value: 'edit', text: t.edit, icon: 'pen-to-square' },
    { value: 'download', text: t.download, icon: 'download' },
  ];
}

function row(t: TreeTableText, key: string, name: string, people: number, ownerIndex: number, extra: Partial<NphTreeTableRow> = {}): NphTreeTableRow {
  return {
    key,
    name,
    cells: { unit: name, owner: t.owners[ownerIndex % t.owners.length] as string, people },
    toggleLabel: t.open.replaceAll('{name}', name),
    ...extra,
  };
}

/** The cities that answer the load of a branch, with keys of their own under it. */
function cities(t: TreeTableText, branch: string): NphTreeTableRow[] {
  return [row(t, `${branch}-boston`, t.places.boston, 480, 2), row(t, `${branch}-albany`, t.places.albany, 260, 3)];
}

/**
 * The people by region of the documentation. `failed` draws the error row under Washington and
 * `east` the state of East Region: closed with its children not loaded, loading, or failed.
 */
export function regionRows(
  t: TreeTableText,
  options: { east?: 'closed' | 'loading' | 'failed' | 'loaded'; washington?: 'failed' | 'closed' } = {},
): NphTreeTableRow[] {
  const { east = 'closed', washington = 'failed' } = options;
  const p = t.places;
  return [
    row(t, 'west', p.west, 920, 0, {
      open: true,
      children: [
        row(t, 'oregon', p.oregon, 310, 1, {
          open: true,
          children: [row(t, 'portland', p.portland, 190, 2), row(t, 'salem', p.salem, 120, 3)],
        }),
        row(t, 'nevada', p.nevada, 280, 1, { branch: true, open: true, loading: true }),
        row(t, 'washington', p.washington, 330, 0, washington === 'failed' ? { branch: true, error: true, open: true } : { branch: true }),
      ],
    }),
    row(
      t,
      'east',
      p.east,
      740,
      1,
      east === 'loaded'
        ? { open: true, children: cities(t, 'east') }
        : east === 'loading'
          ? { branch: true, open: true, loading: true }
          : east === 'failed'
            ? { branch: true, open: true, error: true }
            : { branch: true },
    ),
  ];
}

/** The page bar: the search, named by what it filters, Filter and New unit. */
function pageBar(t: TreeTableText, search = ''): TemplateResult {
  return html`<nph-toolbar slot="toolbar" type="page" label=${t.tableActions}>
    <nph-input type="search" label=${t.search} placeholder=${t.search} icon-start="magnifying-glass" .value=${search}></nph-input>
    <nph-button severity="secondary" emphasis="ghost" icon-start="filter" text=${t.filter}></nph-button>
    <nph-button slot="end" icon-start="plus" text=${t.newUnit}></nph-button>
  </nph-toolbar>`;
}

/** The bulk bar, without its own checkbox: the select-all box is in the table header. */
function bulkBar(t: TreeTableText): TemplateResult {
  return html`<nph-toolbar slot="bulk" type="bulk" label=${t.selection}>
    <nph-button severity="secondary" emphasis="ghost" text=${t.clearSelection} @click=${clearSelection}></nph-button>
    <nph-button slot="end" severity="secondary" emphasis="ghost" icon-start="download" text=${t.download}></nph-button>
  </nph-toolbar>`;
}

function clearSelection(event: Event): void {
  const table = (event.currentTarget as Element).closest('nph-tree-table');
  if (table !== null) table.selected = [];
}

export interface TreeTableOptions {
  size?: NphTableSize;
  framed?: boolean;
  /** The Figma `estado`. */
  state?: 'default' | 'loading' | 'empty';
  selectable?: boolean;
  withActions?: boolean;
  toolbar?: boolean;
  /** The state of East Region and of Washington. */
  east?: 'closed' | 'loading' | 'failed' | 'loaded';
  washington?: 'failed' | 'closed';
  /** The rows selected at the start. */
  selected?: string[];
  /** The footer; `none` for a single page. */
  layout?: 'middle' | 'none';
}

/** The people by region table, playing the consumer for the load of a branch. */
export function regionsTable(t: TreeTableText, options: TreeTableOptions = {}): TemplateResult {
  const {
    size = 'default',
    framed = true,
    state = 'default',
    selectable = true,
    withActions = true,
    toolbar = true,
    east = 'closed',
    washington = 'failed',
    selected = ['oregon', 'portland', 'salem'],
    layout = 'middle',
  } = options;

  /* The consumer: the first load of East Region fails, and Try again answers with its cities. */
  const onLoad = (event: CustomEvent<NphTreeTableLoadDetail>) => {
    const table = event.currentTarget as NphTreeTable;
    const { row: key, retry } = event.detail;
    window.setTimeout(() => {
      const answer = (rows: readonly NphTreeTableRow[]): NphTreeTableRow[] =>
        rows.map((candidate) => {
          if (candidate.key === key) {
            return retry || key !== 'east'
              ? { ...candidate, error: false, children: cities(t, key), loading: false }
              : { ...candidate, error: true, loading: false };
          }
          return candidate.children === undefined ? candidate : { ...candidate, children: answer(candidate.children) };
        });
      table.rows = answer(table.rows);
    }, 600);
  };

  const empty = state === 'empty';
  const rows = empty ? [] : regionRows(t, { east, washington });
  return html`<nph-tree-table
    size=${size}
    ?framed=${framed}
    ?loading=${state === 'loading'}
    caption=${t.caption}
    description=${t.description}
    no-value-label=${t.noValue}
    empty-heading=${t.emptyHeading}
    empty-description=${t.emptyDescription}
    clear-label=${t.clearFilter}
    error-text=${t.errorText}
    retry-text=${t.retryText}
    ?selectable=${selectable}
    select-all-label=${t.selectAll}
    select-label=${t.select}
    selected-text=${t.selectedText}
    actions-label=${t.more}
    pagination-layout="middle"
    pagination-label=${t.pagination}
    page-label=${t.page}
    first-label=${t.first}
    previous-label=${t.previous}
    next-label=${t.next}
    last-label=${t.last}
    position-text=${t.position}
    page-size-label=${t.pageSize}
    .columns=${columns(t)}
    .rows=${rows}
    .selected=${empty ? [] : selected}
    .actions=${withActions ? actions(t) : []}
    .page=${1}
    .pageSize=${layout === 'none' ? 10 : 2}
    .pageSizes=${[2, 5, 10]}
    .totalItems=${empty ? 0 : layout === 'none' ? 2 : 6}
    @nph-row-load=${onLoad}
  >
    ${toolbar ? html`${pageBar(t, empty ? t.searchValue : '')}${bulkBar(t)}` : nothing}
  </nph-tree-table>`;
}
