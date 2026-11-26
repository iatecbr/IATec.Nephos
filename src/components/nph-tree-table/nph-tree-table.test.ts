/**
 * Tests of `nph-tree-table` (DSA-102), in a real browser (P21, item 5): resolved color, measures,
 * real clicks and keyboard focus only exist where there is layout.
 *
 * They prove the contract accepted in Figma (frame `7812:13461`, sets `7617:6784` and
 * `7604:167`): the table is an `nph-data-table` that draws a hierarchy; the tree cell with its
 * indent, chevron and cut text; the treegrid roles and the keyboard of the APG with one row as
 * the Tab stop; the selection with the cascade and the partial parent; the on-demand load with
 * the busy row; the branch error row with Try again; the row focus drawn as halo and border; the
 * floor of the tree column; the invalid input and the token contract.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-tree-table.css?raw';
import { NphDataTable } from '../nph-data-table/nph-data-table';
import type { NphDataTableColumn, NphDataTableSelectionChangeDetail } from '../nph-data-table/nph-data-table';
import { NphTable } from '../nph-table/nph-table';
import type { NphTableRowToggleDetail } from '../nph-table/nph-table';
import type { NphButton } from '../nph-button/nph-button';
import type { NphCheckbox } from '../nph-checkbox/nph-checkbox';
import { NphTreeTable } from './nph-tree-table';
import type { NphTreeTableLoadDetail, NphTreeTableRow } from './nph-tree-table';

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const COLUMNS: NphDataTableColumn[] = [
  { key: 'unit', header: 'Unit', sortable: true },
  { key: 'owner', header: 'Owner' },
  { key: 'people', header: 'People', align: 'end', sortable: true },
];

function leaf(key: string, name: string, extra: Partial<NphTreeTableRow> = {}): NphTreeTableRow {
  return { key, name, cells: { unit: name, owner: 'Ana Souza', people: 10 }, ...extra };
}

/** West Region (open) with Oregon (open, two cities) and Nevada (closed, one city); East, not loaded. */
function tree(): NphTreeTableRow[] {
  return [
    leaf('south', 'West Region', {
      open: true,
      toggleLabel: 'Open West Region',
      children: [
        leaf('pr', 'Oregon', {
          open: true,
          toggleLabel: 'Open Oregon',
          children: [leaf('cur', 'Curitiba'), leaf('lon', 'Londrina')],
        }),
        leaf('sc', 'Nevada', { toggleLabel: 'Open Nevada', children: [leaf('flo', 'Eugene')] }),
      ],
    }),
    leaf('se', 'East Region', { branch: true, toggleLabel: 'Open East Region' }),
  ];
}

const SELECTION = { selectable: true, selectAllLabel: 'Select all', selectLabel: 'Select {name}' };
const TEXTS = { errorText: "Couldn't load.", retryText: 'Try again' };

type Props = Partial<Record<keyof NphTreeTable, unknown>>;

async function mount(props: Props = {}): Promise<NphTreeTable> {
  const element = document.createElement('nph-tree-table');
  Object.assign(element, { caption: 'People by region', columns: COLUMNS, rows: tree(), ...TEXTS, ...props });
  document.body.append(element);
  await settle(element);
  return element;
}

/** The table and the pieces it draws, after their own renders. */
async function settle(element: NphTreeTable): Promise<void> {
  await element.updateComplete;
  const pieces = [...root(element).querySelectorAll('*'), ...element.children].filter(
    (node): node is HTMLElement & { updateComplete: Promise<unknown> } => 'updateComplete' in node,
  );
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  await element.updateComplete;
}

function root(element: NphTreeTable): ShadowRoot {
  return element.shadowRoot as ShadowRoot;
}

/** Every row of the treegrid, the error rows included. */
function treeRows(element: NphTreeTable): HTMLTableRowElement[] {
  return [...root(element).querySelectorAll<HTMLTableRowElement>('tbody tr[data-tree-row]')];
}

function rowOf(element: NphTreeTable, key: string): HTMLTableRowElement {
  return treeRows(element).find((row) => row.getAttribute('data-tree-row') === `row ${key}`) as HTMLTableRowElement;
}

function errorRowOf(element: NphTreeTable, key: string): HTMLTableRowElement | undefined {
  return treeRows(element).find((row) => row.getAttribute('data-tree-row') === `error ${key}`);
}

function keysOf(element: NphTreeTable): string[] {
  return treeRows(element).map((row) => (row.getAttribute('data-tree-row') ?? '').replace(/^(row|error) /, (_, kind: string) => (kind === 'error' ? '!' : '')));
}

function boxOf(element: NphTreeTable, key: string): NphCheckbox {
  return rowOf(element, key).querySelector('nph-checkbox') as NphCheckbox;
}

function headerBox(element: NphTreeTable): NphCheckbox {
  return root(element).querySelector('thead nph-checkbox') as NphCheckbox;
}

function chevronOf(element: NphTreeTable, key: string): NphButton | null {
  return rowOf(element, key).querySelector<NphButton>('nph-button.chevron');
}

function textOf(element: NphTreeTable, key: string): HTMLElement {
  return rowOf(element, key).querySelector('.cut') as HTMLElement;
}

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

function px(token: string): number {
  return parseFloat(resolved('width', token));
}

function color(token: string): string {
  return resolved('color', token);
}

/** Listens for an event of the table and records its details. */
function record<T>(element: HTMLElement, name: string): T[] {
  const seen: T[] = [];
  element.addEventListener(name, (event) => seen.push((event as CustomEvent<T>).detail));
  return seen;
}

describe('registration and API', () => {
  it('defines nph-tree-table once, as an nph-data-table and an nph-table', () => {
    expect(customElements.get('nph-tree-table')).toBe(NphTreeTable);
    expect(document.createElement('nph-tree-table')).toBeInstanceOf(NphDataTable);
    expect(document.createElement('nph-tree-table')).toBeInstanceOf(NphTable);
  });

  it('the public API is the one of nph-data-table plus the two texts of the error row', () => {
    const own = (tag: typeof NphTreeTable | typeof NphDataTable) =>
      [...(tag as unknown as { elementProperties: Map<string, { state?: boolean }> }).elementProperties]
        .filter(([, options]) => options.state !== true)
        .map(([name]) => name);
    const parent = own(NphDataTable);
    const declared = own(NphTreeTable);
    expect(declared.slice(0, parent.length)).toEqual(parent);
    expect(declared.slice(parent.length)).toEqual(['errorText', 'retryText']);
  });

  it('the data table still leaves the children out: its tree is nph-table\'s', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = document.createElement('nph-data-table');
    Object.assign(element, { caption: 'People', columns: COLUMNS, rows: tree() });
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('[role="treegrid"]')).toBeNull();
  });
});

describe('the tree column', () => {
  it('is a treegrid whose rows carry their level, their place among the siblings and the open state', async () => {
    const element = await mount();
    expect(root(element).querySelector('table')?.getAttribute('role')).toBe('treegrid');
    expect(keysOf(element)).toEqual(['south', 'pr', 'cur', 'lon', 'sc', 'se']);
    const attrs = (key: string) => {
      const row = rowOf(element, key);
      return ['aria-level', 'aria-posinset', 'aria-setsize', 'aria-expanded'].map((name) => row.getAttribute(name));
    };
    expect(attrs('south')).toEqual(['1', '1', '2', 'true']);
    expect(attrs('pr')).toEqual(['2', '1', '2', 'true']);
    expect(attrs('cur')).toEqual(['3', '1', '2', null]);
    expect(attrs('sc')).toEqual(['2', '2', '2', 'false']);
    expect(attrs('se')).toEqual(['1', '2', '2', 'false']);
  });

  it('indents one table/expand-indent plus table/cell-gap per level, and a leaf keeps the space of the chevron', async () => {
    const element = await mount();
    const step = px('--nph-table-expand-indent') + px('--nph-table-cell-gap');
    const left = (key: string) => textOf(element, key).getBoundingClientRect().left;
    expect(left('pr') - left('south')).toBeCloseTo(step, 0);
    expect(left('cur') - left('pr')).toBeCloseTo(step, 0);
    /* Oregon and Nevada are siblings: the text of a branch and of a leaf of a level align. */
    expect(left('lon')).toBeCloseTo(left('cur'), 0);
  });

  it('the chevron is the compact ghost icon-only nph-button, right when closed and down when open', async () => {
    const element = await mount();
    const open = chevronOf(element, 'south') as NphButton;
    const closed = chevronOf(element, 'sc') as NphButton;
    expect([open.getAttribute('icon-start'), closed.getAttribute('icon-start')]).toEqual(['chevron-down', 'chevron-right']);
    expect([open.getAttribute('emphasis'), open.getAttribute('size')]).toEqual(['ghost', 'compact']);
    expect(open.getAttribute('label')).toBe('Open West Region');
    expect(chevronOf(element, 'cur')).toBeNull();
  });

  it('a branch that came back with no children is a leaf: no chevron, no aria-expanded, and the space stays', async () => {
    const rows = tree();
    rows[1] = leaf('se', 'East Region', { branch: true, children: [], toggleLabel: 'Open East Region' });
    const element = await mount({ rows });
    const row = rowOf(element, 'se');
    expect(row.hasAttribute('aria-expanded')).toBe(false);
    expect(chevronOf(element, 'se')).toBeNull();
    expect(textOf(element, 'se').getBoundingClientRect().left).toBeCloseTo(textOf(element, 'south').getBoundingClientRect().left, 0);
  });

  it('draws up to three levels: a row below the third is left out, and one error says so', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const rows = tree();
    const parana = (rows[0]?.children as NphTreeTableRow[])[0] as NphTreeTableRow;
    (parana.children as NphTreeTableRow[])[0] = leaf('cur', 'Curitiba', { toggleLabel: 'Open Curitiba', children: [leaf('x', 'Fourth level')] });
    const element = await mount({ rows });
    expect(keysOf(element)).not.toContain('cur');
    expect(error.mock.calls.filter((call) => String(call[0]).includes('tree goes down to 3 levels'))).toHaveLength(1);
  });

  it('keeps tree-table/tree-column-min-width as the floor of the column when the page gives no width', async () => {
    const element = await mount();
    const header = root(element).querySelector('thead th') as HTMLElement;
    expect(header.getBoundingClientRect().width).toBeGreaterThanOrEqual(px('--nph-tree-table-tree-column-min-width') - 1);
    expect(getComputedStyle(header).minInlineSize).toBe(`${px('--nph-tree-table-tree-column-min-width')}px`);
  });

  it('takes the width the page gives the column, and cuts a long text with an ellipsis and the whole text in the tooltip', async () => {
    const long = 'A region whose name is much too long to fit the column the page gave it';
    const rows = tree();
    rows[0] = { ...(rows[0] as NphTreeTableRow), cells: { unit: long, owner: 'Ana', people: 1 } };
    const element = await mount({ rows, columns: [{ ...COLUMNS[0], width: '320px' }, ...COLUMNS.slice(1)] });
    const header = root(element).querySelector('thead th') as HTMLElement;
    expect(header.getBoundingClientRect().width).toBeCloseTo(320, 0);
    const cut = textOf(element, 'south');
    expect(cut.scrollWidth).toBeGreaterThan(cut.clientWidth);
    expect(getComputedStyle(cut).textOverflow).toBe('ellipsis');
    const tooltip = rowOf(element, 'south').querySelector('nph-tooltip') as HTMLElement;
    expect(tooltip.getAttribute('text')).toBe(long);
    expect(tooltip.getAttribute('relation')).toBe('name');
  });

  it('opens and closes through the chevron, with nph-row-toggle, and a click on the rest of the row does nothing', async () => {
    const element = await mount();
    const seen = record<NphTableRowToggleDetail>(element, 'nph-row-toggle');
    await userEvent.click((chevronOf(element, 'sc') as NphButton));
    await settle(element);
    expect(seen).toEqual([{ row: 'sc', open: true }]);
    expect(keysOf(element)).toContain('flo');
    await userEvent.click(rowOf(element, 'pr').querySelectorAll('td')[1] as HTMLElement);
    await settle(element);
    expect(seen).toHaveLength(1);
    expect(rowOf(element, 'pr').getAttribute('aria-expanded')).toBe('true');
  });
});

describe('selection', () => {
  it('puts the box in a column of its own at the start, with no indent, named from the data', async () => {
    const element = await mount(SELECTION);
    const cells = [...rowOf(element, 'cur').querySelectorAll(':scope > td')];
    expect(cells[0]?.classList.contains('select')).toBe(true);
    expect(boxOf(element, 'cur').label).toBe('Select Curitiba');
    expect(headerBox(element).label).toBe('Select all');
    const left = (key: string) => boxOf(element, key).getBoundingClientRect().left;
    expect(left('cur')).toBeCloseTo(left('south'), 0);
  });

  it('checking a parent checks its loaded children, the closed ones too, and reports every checked row', async () => {
    const element = await mount(SELECTION);
    const seen = record<NphDataTableSelectionChangeDetail>(element, 'nph-selection-change');
    await userEvent.click(boxOf(element, 'south'));
    await settle(element);
    expect(new Set(seen[0]?.selected)).toEqual(new Set(['south', 'pr', 'cur', 'lon', 'sc', 'flo']));
    expect(boxOf(element, 'cur').checked).toBe(true);
    expect(rowOf(element, 'cur').classList.contains('selected')).toBe(true);
  });

  it('a parent with only part of its children checked is indeterminate, and is not reported as checked', async () => {
    const element = await mount(SELECTION);
    const seen = record<NphDataTableSelectionChangeDetail>(element, 'nph-selection-change');
    await userEvent.click(boxOf(element, 'cur'));
    await settle(element);
    expect(seen[0]?.selected).toEqual(['cur']);
    for (const key of ['pr', 'south']) {
      expect([boxOf(element, key).checked, boxOf(element, key).indeterminate]).toEqual([false, true]);
      expect(rowOf(element, key).classList.contains('selected')).toBe(false);
    }
    expect([boxOf(element, 'lon').checked, boxOf(element, 'lon').indeterminate]).toEqual([false, false]);
  });

  it('a parent whose loaded children are all checked becomes checked, and unchecking one takes it out again', async () => {
    const element = await mount(SELECTION);
    const seen = record<NphDataTableSelectionChangeDetail>(element, 'nph-selection-change');
    await userEvent.click(boxOf(element, 'cur'));
    await userEvent.click(boxOf(element, 'lon'));
    await settle(element);
    expect(new Set(seen[1]?.selected)).toEqual(new Set(['cur', 'lon', 'pr']));
    expect(boxOf(element, 'pr').checked).toBe(true);
    await userEvent.click(boxOf(element, 'lon'));
    await settle(element);
    expect(seen[2]?.selected).toEqual(['cur']);
    expect(boxOf(element, 'pr').indeterminate).toBe(true);
  });

  it('unchecking a parent unchecks its loaded children', async () => {
    const element = await mount({ ...SELECTION, selected: ['pr'] });
    expect(boxOf(element, 'cur').checked).toBe(true);
    const seen = record<NphDataTableSelectionChangeDetail>(element, 'nph-selection-change');
    await userEvent.click(boxOf(element, 'pr'));
    await settle(element);
    expect(seen[0]?.selected).toEqual([]);
    expect(boxOf(element, 'lon').checked).toBe(false);
  });

  it('a parent whose children are not loaded is checked by itself, and the children that arrive later come checked', async () => {
    const element = await mount(SELECTION);
    const seen = record<NphDataTableSelectionChangeDetail>(element, 'nph-selection-change');
    await userEvent.click(boxOf(element, 'se'));
    await settle(element);
    expect(seen).toEqual([{ selected: ['se'] }]);
    const rows = tree();
    rows[1] = leaf('se', 'East Region', { open: true, toggleLabel: 'Open East Region', selected: undefined, children: [leaf('sp', 'São Paulo'), leaf('rj', 'Rio de Janeiro')] } as Partial<NphTreeTableRow>);
    element.rows = rows;
    await settle(element);
    expect(boxOf(element, 'sp').checked).toBe(true);
    expect(seen).toHaveLength(2);
    expect(new Set(seen[1]?.selected)).toEqual(new Set(['se', 'sp', 'rj']));
  });

  it('the header box checks the rows drawn, open children included, and is indeterminate with only part of them', async () => {
    const element = await mount(SELECTION);
    expect([headerBox(element).checked, headerBox(element).indeterminate]).toEqual([false, false]);
    await userEvent.click(boxOf(element, 'cur'));
    await settle(element);
    expect([headerBox(element).checked, headerBox(element).indeterminate]).toEqual([false, true]);
    await userEvent.click(headerBox(element));
    await settle(element);
    expect(boxOf(element, 'se').checked).toBe(true);
    expect([headerBox(element).checked, headerBox(element).indeterminate]).toEqual([true, false]);
    await userEvent.click(headerBox(element));
    await settle(element);
    expect(element.selected).toEqual([]);
  });

  it('a click on the rest of the row neither checks the box nor opens the branch', async () => {
    const element = await mount(SELECTION);
    await userEvent.click(rowOf(element, 'sc').querySelectorAll('td')[3] as HTMLElement);
    await settle(element);
    expect(boxOf(element, 'sc').checked).toBe(false);
    expect(rowOf(element, 'sc').getAttribute('aria-expanded')).toBe('false');
  });

  it('the selected row takes data-table/row-selected-background on every cell, and the bar data-table/row-selected-indicator', async () => {
    const element = await mount({ ...SELECTION, selected: ['cur'] });
    const row = rowOf(element, 'cur');
    const background = resolved('background-color', '--nph-data-table-row-selected-background');
    for (const cell of row.querySelectorAll('td')) expect(getComputedStyle(cell).backgroundColor).toBe(background);
    const bar = getComputedStyle(row.querySelector('td') as Element, '::after');
    expect(bar.backgroundColor).toBe(resolved('background-color', '--nph-data-table-row-selected-indicator'));
    expect(parseFloat(bar.width)).toBeCloseTo(px('--nph-data-table-row-selected-indicator-width'), 1);
    expect(bar.position).toBe('absolute');
  });

  it('the tree cell takes the same background as the other cells in rest and in hover', async () => {
    const element = await mount();
    const row = rowOf(element, 'cur');
    const cells = [...row.querySelectorAll('td')];
    const rest = getComputedStyle(cells[0] as Element).backgroundColor;
    for (const cell of cells) expect(getComputedStyle(cell).backgroundColor).toBe(rest);
    await userEvent.hover(cells[1] as HTMLElement);
    const hover = resolved('background-color', '--nph-table-row-hover-background');
    for (const cell of cells) expect(getComputedStyle(cell).backgroundColor).toBe(hover);
  });

  it('a row with no name has no box and stays out of the cascade', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const rows = tree();
    const parana = (rows[0]?.children as NphTreeTableRow[])[0] as NphTreeTableRow;
    (parana.children as NphTreeTableRow[])[1] = { key: 'lon', cells: { unit: 'Londrina', owner: 'Ana', people: 1 } };
    const element = await mount({ ...SELECTION, rows });
    expect(rowOf(element, 'lon').querySelector('nph-checkbox')).toBeNull();
    await userEvent.click(boxOf(element, 'cur'));
    await settle(element);
    expect(boxOf(element, 'pr').checked).toBe(true);
  });
});

describe('on-demand load', () => {
  it('opening a branch that is not loaded asks the page once, and the row is busy with the loading chevron', async () => {
    const element = await mount();
    const seen = record<NphTreeTableLoadDetail>(element, 'nph-row-load');
    await userEvent.click(chevronOf(element, 'se') as NphButton);
    await settle(element);
    expect(seen).toEqual([{ row: 'se', retry: false }]);
    const row = rowOf(element, 'se');
    expect(row.getAttribute('aria-busy')).toBe('true');
    expect(row.getAttribute('aria-expanded')).toBe('true');
    expect(chevronOf(element, 'se')?.hasAttribute('loading')).toBe(true);
    expect(rowOf(element, 'south').hasAttribute('aria-busy')).toBe(false);
  });

  it('draws no skeleton row for the branch, and the children arrive under the parent', async () => {
    const element = await mount();
    await userEvent.click(chevronOf(element, 'se') as NphButton);
    await settle(element);
    expect(root(element).querySelector('tbody tr.loading')).toBeNull();
    const rows = tree();
    rows[1] = leaf('se', 'East Region', { open: true, toggleLabel: 'Open East Region', children: [leaf('sp', 'São Paulo')] });
    element.rows = rows;
    await settle(element);
    expect(keysOf(element).slice(-2)).toEqual(['se', 'sp']);
    expect(rowOf(element, 'se').hasAttribute('aria-busy')).toBe(false);
    expect(chevronOf(element, 'se')?.hasAttribute('loading')).toBe(false);
  });

  it('opened by the keyboard, the focus stays on the row', async () => {
    const element = await mount();
    const seen = record<NphTreeTableLoadDetail>(element, 'nph-row-load');
    rowOf(element, 'se').focus();
    await userEvent.keyboard('{ArrowRight}');
    await settle(element);
    expect(seen).toEqual([{ row: 'se', retry: false }]);
    expect(root(element).activeElement).toBe(rowOf(element, 'se'));
    expect(rowOf(element, 'se').getAttribute('aria-busy')).toBe('true');
  });

  it('a row the page says is loading is busy, with no request of its own', async () => {
    const rows = tree();
    rows[1] = leaf('se', 'East Region', { branch: true, open: true, loading: true, toggleLabel: 'Open East Region' });
    const element = await mount({ rows });
    expect(rowOf(element, 'se').getAttribute('aria-busy')).toBe('true');
  });

  it('opening, closing and opening again an answered branch does not ask again', async () => {
    const element = await mount();
    const seen = record<NphTreeTableLoadDetail>(element, 'nph-row-load');
    await userEvent.click(chevronOf(element, 'sc') as NphButton);
    await userEvent.click(chevronOf(element, 'sc') as NphButton);
    await settle(element);
    expect(seen).toEqual([]);
  });
});

/** East failed to load, and its error row is drawn at the level of its children. */
function failed(): NphTreeTableRow[] {
  const rows = tree();
  rows[1] = leaf('se', 'East Region', { branch: true, error: true, open: true, toggleLabel: 'Open East Region' });
  return rows;
}

describe('branch error row', () => {
  it('takes the place of the children of a branch that failed, with its message and its action', async () => {
    const element = await mount({ rows: failed() });
    expect(keysOf(element).slice(-2)).toEqual(['se', '!se']);
    const row = errorRowOf(element, 'se') as HTMLTableRowElement;
    expect(row.querySelector('.error-text')?.textContent).toBe("Couldn't load.");
    expect(row.querySelector('.error-action')?.textContent).toBe('Try again');
    expect(row.querySelector('nph-icon')?.getAttribute('name')).toBe('triangle-exclamation');
    expect(row.querySelector('nph-icon')?.getAttribute('variant')).toBe('light');
    expect(row.getAttribute('aria-level')).toBe('2');
    expect(rowOf(element, 'se').getAttribute('aria-expanded')).toBe('true');
    expect(rowOf(element, 'se').hasAttribute('aria-busy')).toBe(false);
  });

  it('draws the icon under the text of the sibling rows of the children level, at both levels', async () => {
    const rows = tree();
    const santa = (rows[0]?.children as NphTreeTableRow[])[1] as NphTreeTableRow;
    (rows[0]?.children as NphTreeTableRow[])[1] = leaf('sc', 'Nevada', { branch: true, error: true, open: true, toggleLabel: 'Open Nevada', cells: santa.cells });
    rows[1] = leaf('se', 'East Region', { branch: true, error: true, open: true, toggleLabel: 'Open East Region' });
    const element = await mount({ rows });
    const iconLeft = (key: string) => (errorRowOf(element, key)?.querySelector('nph-icon') as HTMLElement).getBoundingClientRect().left;
    expect(iconLeft('se')).toBeCloseTo(textOf(element, 'pr').getBoundingClientRect().left, 0);
    expect(iconLeft('sc')).toBeCloseTo(textOf(element, 'cur').getBoundingClientRect().left, 0);
  });

  it('has the height of the data rows of the table, never below tree-table/row-height', async () => {
    const element = await mount({ rows: failed() });
    const error = (errorRowOf(element, 'se') as HTMLElement).getBoundingClientRect().height;
    const branch = rowOf(element, 'se').getBoundingClientRect().height;
    expect(error).toBeCloseTo(branch, 0);
    expect(error).toBeGreaterThanOrEqual(px('--nph-tree-table-row-height'));
  });

  it('takes the air tree-table/row-padding-block gives when the cells of the table hold buttons', async () => {
    const rows = failed().map((row) => ({ ...row, cells: { ...row.cells, owner: { type: 'button' as const, text: 'Edit', action: 'edit' } } }));
    const element = await mount({ rows });
    const row = errorRowOf(element, 'se') as HTMLElement;
    const cell = row.querySelector('td.error-cell') as HTMLElement;
    expect(getComputedStyle(cell).paddingTop).toBe(`${px('--nph-tree-table-row-padding-block')}px`);
    expect(getComputedStyle(cell).paddingInlineStart).toBe(`${px('--nph-tree-table-cell-padding-inline')}px`);
  });

  it('keeps the selection space with the width of the selection column, and is not selectable', async () => {
    for (const size of ['default', 'large']) {
      const element = await mount({ ...SELECTION, rows: failed(), size });
      const row = errorRowOf(element, 'se') as HTMLElement;
      expect(row.querySelector('nph-checkbox')).toBeNull();
      const space = row.querySelector('td.select') as HTMLElement;
      const column = root(element).querySelector('thead td.select') as HTMLElement;
      expect(space.getBoundingClientRect().width).toBeCloseTo(column.getBoundingClientRect().width, 0);
      document.body.replaceChildren();
    }
  });

  it('paints the row in tree-table/row-background, with the divider at the base, and the hover in -hover', async () => {
    const element = await mount({ rows: failed() });
    const row = errorRowOf(element, 'se') as HTMLElement;
    const cells = [...row.querySelectorAll('td')];
    for (const cell of cells) expect(getComputedStyle(cell).backgroundColor).toBe(resolved('background-color', '--nph-tree-table-row-background'));
    const divider = getComputedStyle(cells[0] as Element);
    expect(divider.borderBottomWidth).toBe(`${px('--nph-tree-table-border-width')}px`);
    expect(divider.borderBottomColor).toBe(resolved('border-bottom-color', '--nph-tree-table-border'));
    await userEvent.hover(cells[0] as HTMLElement);
    for (const cell of cells) expect(getComputedStyle(cell).backgroundColor).toBe(resolved('background-color', '--nph-tree-table-row-background-hover'));
    expect(getComputedStyle(row.querySelector('.error-block') as Element).color).toBe(color('--nph-tree-table-error-foreground-hover'));
  });

  it('colors the icon in tree-table/error-icon-foreground, in tree-table/error-icon-size', async () => {
    const element = await mount({ rows: failed() });
    const icon = errorRowOf(element, 'se')?.querySelector('nph-icon') as HTMLElement;
    expect(getComputedStyle(icon).color).toBe(color('--nph-tree-table-error-icon-foreground'));
    expect(icon.getBoundingClientRect().width).toBeCloseTo(px('--nph-tree-table-error-icon-size'), 0);
  });

  it('is read as the message and the action together', async () => {
    const element = await mount({ rows: failed() });
    const text = (errorRowOf(element, 'se') as HTMLElement).textContent?.replace(/\s+/g, ' ').trim();
    expect(text).toBe("Couldn't load. Try again");
  });

  it('a click tries again: the error row leaves, the branch is busy, and the page is asked', async () => {
    const element = await mount({ rows: failed() });
    const seen = record<NphTreeTableLoadDetail>(element, 'nph-row-load');
    await userEvent.click(errorRowOf(element, 'se') as HTMLElement);
    await settle(element);
    expect(seen).toEqual([{ row: 'se', retry: true }]);
    expect(errorRowOf(element, 'se')).toBeUndefined();
    expect(rowOf(element, 'se').getAttribute('aria-busy')).toBe('true');
    expect(chevronOf(element, 'se')?.hasAttribute('loading')).toBe(true);
  });

  it('Enter tries again, and the focus that was on the error row goes to the branch row', async () => {
    const element = await mount({ rows: failed() });
    const seen = record<NphTreeTableLoadDetail>(element, 'nph-row-load');
    (errorRowOf(element, 'se') as HTMLElement).focus();
    await userEvent.keyboard('{Enter}');
    await settle(element);
    expect(seen).toEqual([{ row: 'se', retry: true }]);
    expect(root(element).activeElement).toBe(rowOf(element, 'se'));
  });

  it('answers with the children, or with the error row again', async () => {
    const element = await mount({ rows: failed() });
    await userEvent.click(errorRowOf(element, 'se') as HTMLElement);
    await settle(element);
    const again = failed();
    element.rows = again;
    await settle(element);
    expect(errorRowOf(element, 'se')).toBeDefined();
    expect(rowOf(element, 'se').hasAttribute('aria-busy')).toBe(false);
    await userEvent.click(errorRowOf(element, 'se') as HTMLElement);
    await settle(element);
    const rows = tree();
    rows[1] = leaf('se', 'East Region', { open: true, toggleLabel: 'Open East Region', children: [leaf('sp', 'São Paulo')] });
    element.rows = rows;
    await settle(element);
    expect(errorRowOf(element, 'se')).toBeUndefined();
    expect(keysOf(element).slice(-2)).toEqual(['se', 'sp']);
  });

  it('closing and opening a failed branch shows the error row again, and only Try again asks for the load', async () => {
    const element = await mount({ rows: failed() });
    const seen = record<NphTreeTableLoadDetail>(element, 'nph-row-load');
    await userEvent.click(chevronOf(element, 'se') as NphButton);
    await settle(element);
    expect(errorRowOf(element, 'se')).toBeUndefined();
    await userEvent.click(chevronOf(element, 'se') as NphButton);
    await settle(element);
    expect(errorRowOf(element, 'se')).toBeDefined();
    expect(seen).toEqual([]);
  });

  it('warns once, in development, when the error row has no text', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const element = await mount({ rows: failed(), errorText: '', retryText: '' });
    element.rows = failed();
    await settle(element);
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('error-text'))).toHaveLength(1);
  });
});

describe('keyboard and focus', () => {
  it('makes one body row the Tab stop, the first, and moves it to the row the focus is in', async () => {
    const element = await mount();
    const stops = () => treeRows(element).filter((row) => row.getAttribute('tabindex') === '0').map((row) => row.getAttribute('data-tree-row'));
    expect(stops()).toEqual(['row south']);
    rowOf(element, 'lon').focus();
    await settle(element);
    expect(stops()).toEqual(['row lon']);
  });

  it('keeps the Tab stop on the error row while it is drawn', async () => {
    const element = await mount({ rows: failed() });
    (errorRowOf(element, 'se') as HTMLElement).focus();
    await settle(element);
    expect(errorRowOf(element, 'se')?.getAttribute('tabindex')).toBe('0');
    expect(rowOf(element, 'south').getAttribute('tabindex')).toBe('-1');
  });

  it('Tab goes from the row to its own box, chevron and cut text only, then leaves the table', async () => {
    const element = await mount({ ...SELECTION, actions: [{ value: 'edit', text: 'Edit' }], actionsLabel: 'More for {name}' });
    const after = document.createElement('button');
    document.body.append(after);
    rowOf(element, 'pr').focus();
    const visited: string[] = [];
    for (let step = 0; step < 10 && document.activeElement !== after; step += 1) {
      await userEvent.keyboard('{Tab}');
      const inside = root(element).activeElement;
      if (document.activeElement === element && inside !== null) {
        visited.push(`${inside.closest('tr')?.getAttribute('data-tree-row')}:${inside.localName}`);
      }
    }
    expect(document.activeElement).toBe(after);
    expect(visited.length).toBeGreaterThan(0);
    expect(new Set(visited.map((entry) => entry.split(':')[0]))).toEqual(new Set(['row pr']));
  });

  it('the box and the ⋮ of the rows that are not the Tab stop leave the Tab order, and a closed menu leaves no aria-expanded on a focusable host', async () => {
    const element = await mount({ ...SELECTION, actions: [{ value: 'edit', text: 'Edit' }], actionsLabel: 'More for {name}' });
    const stopRow = rowOf(element, 'south');
    const other = rowOf(element, 'pr');
    expect(stopRow.querySelector('nph-checkbox')?.hasAttribute('tabindex')).toBe(false);
    expect(stopRow.querySelector('.actions > nph-button')?.hasAttribute('tabindex')).toBe(false);
    expect(other.querySelector('nph-checkbox')?.getAttribute('tabindex')).toBe('-1');
    const more = other.querySelector('.actions > nph-button') as HTMLElement;
    expect(more.getAttribute('tabindex')).toBe('-1');
    expect(more.hasAttribute('aria-expanded')).toBe(false);
    expect(more.getAttribute('aria-haspopup')).toBe('menu');
    /* The native button of the ⋮ still reads a closed menu. */
    expect(more.shadowRoot?.querySelector('button')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('Down and Up walk the visible rows, the error row included, and Home and End go to the first and the last', async () => {
    const element = await mount({ rows: failed() });
    rowOf(element, 'south').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(root(element).activeElement).toBe(rowOf(element, 'pr'));
    await userEvent.keyboard('{End}');
    expect(root(element).activeElement).toBe(errorRowOf(element, 'se'));
    await userEvent.keyboard('{ArrowUp}');
    expect(root(element).activeElement).toBe(rowOf(element, 'se'));
    await userEvent.keyboard('{Home}');
    expect(root(element).activeElement).toBe(rowOf(element, 'south'));
  });

  it('Right opens a closed row and goes to the first cell of an open one; Left closes it and then goes to the parent', async () => {
    const element = await mount();
    rowOf(element, 'sc').focus();
    await userEvent.keyboard('{ArrowRight}');
    await settle(element);
    expect(rowOf(element, 'sc').getAttribute('aria-expanded')).toBe('true');
    expect(root(element).activeElement).toBe(rowOf(element, 'sc'));
    await userEvent.keyboard('{ArrowRight}');
    expect(root(element).activeElement).toBe(rowOf(element, 'sc').querySelector('td'));
    await userEvent.keyboard('{ArrowLeft}');
    expect(root(element).activeElement).toBe(rowOf(element, 'sc'));
    await userEvent.keyboard('{ArrowLeft}');
    await settle(element);
    expect(rowOf(element, 'sc').getAttribute('aria-expanded')).toBe('false');
    await userEvent.keyboard('{ArrowLeft}');
    expect(root(element).activeElement).toBe(rowOf(element, 'south'));
  });

  it('Left on the error row goes to its branch, and Enter on a row opens and closes it', async () => {
    const element = await mount({ rows: failed() });
    (errorRowOf(element, 'se') as HTMLElement).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(root(element).activeElement).toBe(rowOf(element, 'se'));
    await userEvent.keyboard('{Enter}');
    await settle(element);
    expect(rowOf(element, 'se').getAttribute('aria-expanded')).toBe('false');
    expect(errorRowOf(element, 'se')).toBeUndefined();
  });

  it('Space on the box checks it, and the cell keys move along the row', async () => {
    const element = await mount(SELECTION);
    const seen = record<NphDataTableSelectionChangeDetail>(element, 'nph-selection-change');
    boxOf(element, 'cur').focus();
    await userEvent.keyboard(' ');
    await settle(element);
    expect(seen[0]?.selected).toEqual(['cur']);
    const row = rowOf(element, 'cur');
    row.focus();
    await userEvent.keyboard('{ArrowRight}');
    const cells = [...row.querySelectorAll(':scope > td')];
    expect(root(element).activeElement).toBe(cells[0]);
    await userEvent.keyboard('{ArrowRight}{ArrowDown}');
    expect(root(element).activeElement).toBe([...rowOf(element, 'lon').querySelectorAll(':scope > td')][1]);
  });

  it('draws the row focus as the halo at the edge and the border inside it, with the corners of the tokens', async () => {
    const element = await mount();
    const row = rowOf(element, 'south');
    row.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowUp}');
    expect(row.matches(':focus-visible')).toBe(true);
    expect(getComputedStyle(row).outlineStyle).toBe('none');
    const halo = getComputedStyle(row, '::before');
    const border = getComputedStyle(row, '::after');
    expect(halo.borderTopWidth).toBe(`${px('--nph-tree-table-focus-halo-width')}px`);
    expect(halo.borderTopColor).toBe(color('--nph-tree-table-focus-halo'));
    expect(halo.borderTopLeftRadius).toBe(`${px('--nph-tree-table-focus-halo-radius')}px`);
    expect(border.borderTopWidth).toBe(`${px('--nph-tree-table-focus-border-width')}px`);
    expect(border.borderTopColor).toBe(color('--nph-tree-table-focus-border'));
    expect(border.borderTopLeftRadius).toBe(`${px('--nph-tree-table-focus-border-radius')}px`);
    /* Both stop one divider above the base of the row, and the border is one halo width inside the halo. */
    const height = row.getBoundingClientRect().height;
    expect(parseFloat(halo.height)).toBeCloseTo(height - px('--nph-tree-table-border-width'), 0);
    expect(parseFloat(border.top)).toBeCloseTo(px('--nph-tree-table-focus-halo-width'), 0);
    expect(parseFloat(border.height)).toBeCloseTo(height - px('--nph-tree-table-border-width') - 2 * px('--nph-tree-table-focus-halo-width'), 0);
  });

  it('draws the same focus on the error row, and a focused cell keeps the ring of nph-table', async () => {
    const element = await mount({ rows: failed() });
    const error = errorRowOf(element, 'se') as HTMLElement;
    error.focus();
    await userEvent.keyboard('{ArrowUp}{ArrowDown}');
    expect(getComputedStyle(error, '::before').borderTopWidth).toBe(`${px('--nph-tree-table-focus-halo-width')}px`);
    const row = rowOf(element, 'south');
    row.focus();
    await userEvent.keyboard('{ArrowRight}');
    const cell = root(element).activeElement as HTMLElement;
    expect(cell.localName).toBe('td');
    expect(getComputedStyle(cell).outlineWidth).toBe(`${px('--nph-table-focus-ring-width')}px`);
    expect(getComputedStyle(cell).outlineColor).toBe(resolved('outline-color', '--nph-focus-border'));
  });

  it('while the pointer is over a cut text, its row takes the Tab stop and the tooltip opens; it is given back when the pointer leaves the row', async () => {
    const long = 'A region whose name is much too long to fit the column the page gave it';
    const rows = tree();
    rows[0] = { ...(rows[0] as NphTreeTableRow), cells: { unit: long, owner: 'Ana', people: 1 } };
    rows[1] = { ...(rows[1] as NphTreeTableRow), cells: { unit: long, owner: 'Ana', people: 1 } };
    const element = await mount({ rows, columns: [{ ...COLUMNS[0], width: '320px' }, ...COLUMNS.slice(1)] });
    const stops = () => treeRows(element).filter((row) => row.getAttribute('tabindex') === '0').map((row) => row.getAttribute('data-tree-row'));
    expect(stops()).toEqual(['row south']);
    const target = rowOf(element, 'se').querySelector('td.truncated') as HTMLElement;
    await userEvent.hover(target);
    await vi.waitFor(() => expect(target.querySelector('nph-tooltip')?.hasAttribute('open')).toBe(true));
    await settle(element);
    expect(stops()).toEqual(['row se']);
    await userEvent.hover(rowOf(element, 'pr').querySelectorAll('td')[2] as HTMLElement);
    await settle(element);
    expect(stops()).toEqual(['row south']);
  });
});

describe('what it takes from the data table', () => {
  it('draws the loading state with the header in view and the skeleton rows', async () => {
    const element = await mount({ loading: true, ...SELECTION, pageSize: 3 });
    expect(root(element).querySelectorAll('tbody tr.loading').length).toBeGreaterThan(0);
    expect(root(element).querySelector('thead')).not.toBeNull();
    expect(root(element).querySelector('tbody nph-skeleton')).not.toBeNull();
  });

  it('draws the empty by search with the nph-empty and the button that clears the search', async () => {
    const element = await mount({ rows: [], emptyHeading: 'No region found', emptyDescription: 'Clear the filter.', clearLabel: 'Clear filter' });
    expect(root(element).querySelector('tbody nph-empty')?.getAttribute('heading')).toBe('No region found');
    expect(root(element).querySelector('tbody nph-button')?.getAttribute('text')).toBe('Clear filter');
  });

  it('sorts through the header and says so, as the data table does', async () => {
    const element = await mount();
    const seen = record<{ key: string; direction: string }>(element, 'nph-sort-change');
    await userEvent.click(root(element).querySelector('thead button.sort') as HTMLElement);
    expect(seen).toEqual([{ key: 'unit', direction: 'ascending' }]);
  });

  it('draws the footer of the pagination from the page size and the total of first level rows', async () => {
    const element = await mount({
      page: 1,
      pageSize: 2,
      totalItems: 5,
      paginationLayout: 'narrow',
      paginationLabel: 'Pagination',
      previousLabel: 'Previous',
      nextLabel: 'Next',
      positionText: '{start}–{end} of {total}',
    });
    expect(root(element).querySelector('nph-pagination')).not.toBeNull();
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css', () => {
    const used = new Set([...cssWithoutComments.matchAll(/var\((--[a-z0-9-]+)/g)].map((match) => match[1] as string));
    for (const name of used) expect(tokensCss, name).toContain(`${name}:`);
  });

  it('every tree-table/* token of the accepted contract is consumed; the five colors of DSA-120 are not read here', () => {
    /* The five colors DSA-120 added to the group serve its own task: the title, the caption, the page size label and the selected row. */
    const others = ['foreground', 'caption-foreground', 'page-size-label-foreground', 'row-background-selected', 'row-indicator-selected'].map(
      (name) => `--nph-tree-table-${name}`,
    );
    const declared = [...tokensCss.matchAll(/(--nph-tree-table-[a-z0-9-]+):/g)].map((match) => match[1] as string);
    const contract = declared.filter((name) => !others.includes(name));
    expect(contract).toHaveLength(21);
    for (const name of contract) expect(cssWithoutComments, name).toContain(`var(${name})`);
    for (const name of others) expect(cssWithoutComments, name).not.toContain(name);
  });

  it('never consumes a core or theme layer directly', () => {
    expect(cssWithoutComments).not.toMatch(/--nph-core-/);
    expect(cssWithoutComments).not.toMatch(/--nph-theme-/);
  });

  it('the CSS has no literal design value and no motion of its own', () => {
    const withoutRelations = cssWithoutComments.replace(/\b100%/g, '').replace(/calc\(-1 \*/g, 'calc(').replace(/ 2 \* var/g, ' var');
    expect(withoutRelations).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(withoutRelations).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(withoutRelations).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
    expect(withoutRelations).not.toMatch(/\b(animation|transition|@keyframes)\b/);
  });
});
