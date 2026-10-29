/**
 * Tests of `nph-data-table` (P105), in a real browser (P21, item 5): resolved color, measures,
 * real clicks and keyboard focus only exist where there is layout.
 *
 * They prove the contract accepted in Figma (frame `2875:17577`, set `2633:69628`): the table
 * is an `nph-table` and keeps what it draws; the sortable header, a button the size of the
 * cell with the arrow of the direction, `aria-sort` and the ring inside the cell; the selection
 * column, the header box checked, indeterminate or unchecked, the selected row with its
 * background and its mark; the page bar and the bulk bar that takes its place with the count;
 * the ⋮ with the menu of the row; the switch column; loading and empty by search; the footer
 * in its three layouts; the events; the invalid input and the token contract.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import '../nph-toolbar/nph-toolbar';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-data-table.css?raw';
import { NphTable } from '../nph-table/nph-table';
import type { NphTableRowActionDetail } from '../nph-table/nph-table';
import type { NphButton } from '../nph-button/nph-button';
import type { NphCheckbox } from '../nph-checkbox/nph-checkbox';
import type { NphDropdownMenu } from '../nph-dropdown-menu/nph-dropdown-menu';
import type { NphPagination, NphPaginationChangeDetail } from '../nph-pagination/nph-pagination';
import type { NphSelect } from '../nph-select/nph-select';
import type { NphSwitch } from '../nph-switch/nph-switch';
import {
  NPH_DATA_TABLE_ICONS,
  NPH_DATA_TABLE_PAGINATION_LAYOUTS,
  NPH_DATA_TABLE_SORT_DIRECTIONS,
  NphDataTable,
} from './nph-data-table';
import type {
  NphDataTableColumn,
  NphDataTableRow,
  NphDataTableRowSwitchDetail,
  NphDataTableSelectionChangeDetail,
  NphDataTableSortChangeDetail,
} from './nph-data-table';

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const COLUMNS: NphDataTableColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'unit', header: 'Unit' },
  { key: 'amount', header: 'Amount', align: 'end', sortable: true },
];

const ROWS: NphDataTableRow[] = [
  { key: 'ana', name: 'Ana Souza', cells: { name: 'Ana Souza', unit: 'North', amount: 1200 } },
  { key: 'bruno', name: 'Bruno Lima', cells: { name: 'Bruno Lima', unit: 'South', amount: 800 }, switched: true },
  { key: 'carla', name: 'Carla Dias', cells: { name: 'Carla Dias', unit: 'East', amount: 50 } },
];

const ACTIONS = [
  { value: 'edit', text: 'Edit' },
  { type: 'separator' as const },
  { value: 'delete', text: 'Delete', severity: 'destructive' as const },
];

type Props = Partial<Record<keyof NphDataTable, unknown>>;

async function mount(props: Props = {}, children = ''): Promise<NphDataTable> {
  const element = document.createElement('nph-data-table');
  element.innerHTML = children;
  Object.assign(element, { caption: 'People by unit', columns: COLUMNS, rows: ROWS, ...props });
  document.body.append(element);
  await settle(element);
  return element;
}

/** The table and the pieces it draws, after their own renders. */
async function settle(element: NphDataTable): Promise<void> {
  await element.updateComplete;
  const pieces = [...root(element).querySelectorAll('*'), ...element.children].filter(
    (node): node is HTMLElement & { updateComplete: Promise<unknown> } => 'updateComplete' in node,
  );
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  await element.updateComplete;
}

const SELECTION: Props = { selectable: true, selectAllLabel: 'Select all', selectLabel: 'Select {name}' };
const MORE: Props = { actions: ACTIONS, actionsLabel: 'More actions for {name}' };
const SWITCH: Props = { switchHeader: 'Active', switchLabel: 'Active: {name}' };
const PAGES: Props = {
  page: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50],
  totalItems: 45,
  paginationLabel: 'Pagination',
  pageLabel: 'Page {page}',
  firstLabel: 'First page',
  previousLabel: 'Previous page',
  nextLabel: 'Next page',
  lastLabel: 'Last page',
  positionText: '{start}–{end} of {total}',
  pageSizeLabel: 'Items per page',
};

function root(element: NphDataTable): ShadowRoot {
  return element.shadowRoot as ShadowRoot;
}

function bodyRows(element: NphDataTable): HTMLTableRowElement[] {
  return [...root(element).querySelectorAll<HTMLTableRowElement>('tbody tr.row')];
}

function headers(element: NphDataTable): HTMLTableCellElement[] {
  return [...root(element).querySelectorAll<HTMLTableCellElement>('thead tr > *')];
}

function headerBox(element: NphDataTable): NphCheckbox {
  return root(element).querySelector('thead nph-checkbox') as NphCheckbox;
}

function rowBoxes(element: NphDataTable): NphCheckbox[] {
  return [...root(element).querySelectorAll<NphCheckbox>('tbody nph-checkbox')];
}

function sortButton(element: NphDataTable, key: string): HTMLButtonElement | null {
  const index = COLUMNS.findIndex((column) => column.key === key);
  const th = root(element).querySelectorAll('thead th[scope="col"]')[index];
  return th?.querySelector('button') ?? null;
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

function shown(element: Element): boolean {
  return element.getClientRects().length > 0;
}

describe('registration and API', () => {
  it('defines nph-data-table once, as an nph-table', () => {
    expect(customElements.get('nph-data-table')).toBe(NphDataTable);
    expect(document.createElement('nph-data-table')).toBeInstanceOf(NphTable);
  });

  it('the public API is the one of nph-table plus the one of P105', () => {
    const declared = [...(NphDataTable as unknown as { elementProperties: Map<string, { state?: boolean }> }).elementProperties]
      .filter(([, options]) => options.state !== true)
      .map(([name]) => name);
    const table = [...(NphTable as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.slice(0, table.length)).toEqual(table);
    expect(declared.slice(table.length)).toEqual([
      'sortKey',
      'sortDirection',
      'selectable',
      'selected',
      'selectAllLabel',
      'selectLabel',
      'selectedText',
      'actions',
      'actionsLabel',
      'switchHeader',
      'switchLabel',
      'loading',
      'clearLabel',
      'page',
      'pageSize',
      'pageSizes',
      'totalItems',
      'paginationLayout',
      'paginationLabel',
      'pageLabel',
      'firstLabel',
      'previousLabel',
      'nextLabel',
      'lastLabel',
      'positionText',
      'pageSizeLabel',
    ]);
  });

  it('the lists are the ones of the contract and P105', () => {
    expect([...NPH_DATA_TABLE_SORT_DIRECTIONS]).toEqual(['ascending', 'descending']);
    expect([...NPH_DATA_TABLE_PAGINATION_LAYOUTS]).toEqual(['wide', 'middle', 'narrow']);
    expect(NPH_DATA_TABLE_ICONS).toEqual({ sortable: 'arrow-up-arrow-down', ascending: 'arrow-up', more: 'ellipsis-vertical' });
  });

  it('the defaults: nothing sorted, no selection, no actions, no switch column, not loading, the middle footer', () => {
    const element = document.createElement('nph-data-table');
    expect([element.sortKey, element.sortDirection]).toEqual(['', '']);
    expect([element.selectable, element.loading]).toEqual([false, false]);
    expect(element.selected).toEqual([]);
    expect(element.actions).toEqual([]);
    expect(element.switchHeader).toBe('');
    expect([element.page, element.pageSize, element.totalItems]).toEqual([1, null, null]);
    expect(element.paginationLayout).toBe('middle');
  });

  it('selectable, loading and pagination-layout reflect', async () => {
    const element = await mount({ ...SELECTION, loading: true, paginationLayout: 'wide' });
    expect(element.hasAttribute('selectable')).toBe(true);
    expect(element.hasAttribute('loading')).toBe(true);
    expect(element.getAttribute('pagination-layout')).toBe('wide');
  });
});

describe('it is an nph-table', () => {
  it('draws the native table of nph-table, named by its caption, with the cells of the data', async () => {
    const element = await mount();
    const table = root(element).querySelector('table') as HTMLTableElement;
    expect(table.getAttribute('aria-labelledby')).toBe('caption');
    expect(root(element).getElementById('caption')?.textContent).toBe('People by unit');
    expect(bodyRows(element).map((row) => row.cells[0]?.textContent?.trim())).toEqual(['Ana Souza', 'Bruno Lima', 'Carla Dias']);
    expect(bodyRows(element)[0]?.cells[2]?.classList.contains('end')).toBe(true);
  });

  it('keeps framed, sticky-header, grid and size large of nph-table', async () => {
    const element = await mount({ framed: true, stickyHeader: true, grid: true, size: 'large' });
    const scroll = root(element).querySelector('.scroll') as HTMLElement;
    expect(getComputedStyle(scroll).borderTopColor).toBe(color('--nph-table-border'));
    expect(getComputedStyle(root(element).querySelector('thead') as HTMLElement).position).toBe('sticky');
    expect(bodyRows(element)[0]?.getBoundingClientRect().height).toBe(px('--nph-table-row-height-large'));
  });

  it('caption, bar, table and footer are data-table/stack-gap apart', async () => {
    const element = await mount({ ...PAGES }, '<nph-toolbar slot="toolbar" type="page" label="Table actions"><nph-button text="New"></nph-button></nph-toolbar>');
    expect(getComputedStyle(element).rowGap).toBe(`${px('--nph-data-table-stack-gap')}px`);
    const caption = root(element).querySelector('.caption') as HTMLElement;
    const bars = root(element).querySelector('.bars') as HTMLElement;
    const scroll = root(element).querySelector('.scroll') as HTMLElement;
    const footer = root(element).querySelector('.pagination') as HTMLElement;
    const gap = px('--nph-data-table-stack-gap');
    expect(Math.round(bars.getBoundingClientRect().top - caption.getBoundingClientRect().bottom)).toBe(gap);
    expect(Math.round(scroll.getBoundingClientRect().top - bars.getBoundingClientRect().bottom)).toBe(gap);
    expect(Math.round(footer.getBoundingClientRect().top - scroll.getBoundingClientRect().bottom)).toBe(gap);
  });

  it('nph-row-toggle and the expanded item of nph-table still work', async () => {
    const rows: NphDataTableRow[] = [{ ...ROWS[0], detail: { name: 'Ana Souza' }, toggleLabel: 'Details of Ana Souza' } as NphDataTableRow];
    const element = await mount({ rows, ...SELECTION });
    const chevron = root(element).querySelector('nph-button.chevron') as NphButton;
    await userEvent.click(chevron);
    await settle(element);
    expect(root(element).querySelector('tr.detail')).not.toBeNull();
    /* The selection column counts in the span of the expanded item. */
    expect(root(element).querySelector('tr.detail > td')?.getAttribute('colspan')).toBe(String(1 + 1 + COLUMNS.length));
  });

  it('a row with children is drawn without them, with an error in development: the tree is nph-table\'s', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const rows: NphDataTableRow[] = [
      { key: 'north', name: 'North', toggleLabel: 'Open North', cells: { name: 'North' }, children: [{ key: 'n1', cells: { name: 'N1' } }] },
    ];
    const element = await mount({ rows });
    expect(root(element).querySelector('table')?.getAttribute('role')).toBeNull();
    expect(bodyRows(element)).toHaveLength(1);
    expect(spy.mock.calls.some(([message]) => String(message).includes('does not draw a tree'))).toBe(true);
  });
});

describe('sorting', () => {
  it('a sortable header is a button the size of the cell, with the header as its name; the others stay text', async () => {
    const element = await mount();
    const button = sortButton(element, 'name') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('Name');
    /* The whole cell inside its divider: the ring drawn inside the button is inside the cell. */
    const th = button.closest('th') as HTMLTableCellElement;
    const box = button.getBoundingClientRect();
    expect([Math.round(box.width), Math.round(box.height)]).toEqual([th.clientWidth, th.clientHeight]);
    expect(getComputedStyle(th).paddingTop).toBe('0px');
    expect(sortButton(element, 'unit')).toBeNull();
  });

  it('in size large too, the button fills the cell: the cell keeps no padding of its own', async () => {
    const element = await mount({ size: 'large' });
    const button = sortButton(element, 'name') as HTMLButtonElement;
    const th = button.closest('th') as HTMLTableCellElement;
    const box = button.getBoundingClientRect();
    expect([Math.round(box.width), Math.round(box.height)]).toEqual([th.clientWidth, th.clientHeight]);
    expect(getComputedStyle(th).paddingLeft).toBe('0px');
    expect(getComputedStyle(button).paddingLeft).toBe(`${px('--nph-table-container-padding')}px`);
  });

  it('an unsorted sortable column shows the two-way arrow in data-table/sort-icon-foreground and no aria-sort', async () => {
    const element = await mount();
    const button = sortButton(element, 'name') as HTMLButtonElement;
    const arrow = button.querySelector('nph-icon') as HTMLElement;
    expect(arrow.getAttribute('name')).toBe(NPH_DATA_TABLE_ICONS.sortable);
    expect(getComputedStyle(arrow).color).toBe(color('--nph-data-table-sort-icon-foreground'));
    expect(button.closest('th')?.hasAttribute('aria-sort')).toBe(false);
  });

  it('the sorted column carries aria-sort and the arrow of the direction in data-table/sort-icon-active-foreground', async () => {
    const element = await mount({ sortKey: 'amount', sortDirection: 'descending' });
    const button = sortButton(element, 'amount') as HTMLButtonElement;
    const arrow = button.querySelector('nph-icon') as HTMLElement;
    expect(button.closest('th')?.getAttribute('aria-sort')).toBe('descending');
    expect(arrow.getAttribute('name')).toBe(NPH_DATA_TABLE_ICONS.ascending);
    expect(getComputedStyle(arrow).transform).not.toBe('none');
    expect(getComputedStyle(arrow).color).toBe(color('--nph-data-table-sort-icon-active-foreground'));
    element.sortDirection = 'ascending';
    await settle(element);
    expect(getComputedStyle(arrow).transform).toBe('none');
    expect(sortButton(element, 'name')?.closest('th')?.hasAttribute('aria-sort')).toBe(false);
  });

  it('a number column keeps the label and the arrow at the end of the cell', async () => {
    const element = await mount();
    const button = sortButton(element, 'amount') as HTMLButtonElement;
    expect(getComputedStyle(button).justifyContent).toBe('flex-end');
    const arrow = button.querySelector('nph-icon') as HTMLElement;
    const padding = parseFloat(getComputedStyle(button).paddingRight);
    expect(Math.round(button.getBoundingClientRect().right - arrow.getBoundingClientRect().right)).toBe(Math.round(padding));
  });

  it('a click sorts ascending, the next one descending and back, firing nph-sort-change', async () => {
    const element = await mount();
    const events: NphDataTableSortChangeDetail[] = [];
    element.addEventListener('nph-sort-change', (event) => events.push(event.detail));
    await userEvent.click(sortButton(element, 'name') as HTMLButtonElement);
    await userEvent.click(sortButton(element, 'name') as HTMLButtonElement);
    await userEvent.click(sortButton(element, 'name') as HTMLButtonElement);
    await userEvent.click(sortButton(element, 'amount') as HTMLButtonElement);
    expect(events).toEqual([
      { key: 'name', direction: 'ascending' },
      { key: 'name', direction: 'descending' },
      { key: 'name', direction: 'ascending' },
      { key: 'amount', direction: 'ascending' },
    ]);
    expect([element.sortKey, element.sortDirection]).toEqual(['amount', 'ascending']);
  });

  it('the event bubbles, is not composed, and setting the sort from code fires nothing', async () => {
    const element = await mount();
    const spy = vi.fn();
    element.addEventListener('nph-sort-change', spy);
    element.sortKey = 'name';
    element.sortDirection = 'ascending';
    await settle(element);
    expect(spy).not.toHaveBeenCalled();
    await userEvent.click(sortButton(element, 'amount') as HTMLButtonElement);
    const event = spy.mock.calls[0]?.[0] as CustomEvent;
    expect([event.bubbles, event.composed]).toEqual([true, false]);
  });

  it('keyboard focus on the sortable header draws focus/border in table/focus-ring-width inside the cell', async () => {
    const element = await mount();
    await userEvent.keyboard('{Tab}');
    const button = sortButton(element, 'name') as HTMLButtonElement;
    expect(root(element).activeElement).toBe(button);
    const style = getComputedStyle(button);
    expect(style.outlineStyle).toBe('solid');
    expect(style.outlineColor).toBe(color('--nph-focus-border'));
    expect(parseFloat(style.outlineWidth)).toBe(px('--nph-table-focus-ring-width'));
    expect(parseFloat(style.outlineOffset)).toBe(-px('--nph-table-focus-ring-width'));
  });

  it('a header that does not sort takes no focus', async () => {
    const element = await mount({ columns: [{ key: 'name', header: 'Name' }] });
    await userEvent.keyboard('{Tab}');
    expect(root(element).activeElement).toBeNull();
  });

  it('a sort-direction outside the list errors in development and no column is drawn sorted', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ sortKey: 'name', sortDirection: 'up' });
    expect(spy.mock.calls.some(([message]) => String(message).includes('sort-direction "up"'))).toBe(true);
    expect(root(element).querySelector('th[aria-sort]')).toBeNull();
  });

  it('a sort-key that is not a sortable column warns in development', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await mount({ sortKey: 'unit', sortDirection: 'ascending' });
    expect(spy.mock.calls.some(([message]) => String(message).includes('sort-key "unit"'))).toBe(true);
  });
});

describe('selection', () => {
  it('adds the column of nph-checkbox: the header box and one box per row, named from the data', async () => {
    const element = await mount(SELECTION);
    expect(headerBox(element).label).toBe('Select all');
    expect(rowBoxes(element).map((box) => box.label)).toEqual(['Select Ana Souza', 'Select Bruno Lima', 'Select Carla Dias']);
    expect(headers(element)[0]?.classList.contains('select')).toBe(true);
  });

  it('the column is data-table/selection-column-width in default, and the box sits with the cell padding in large', async () => {
    const element = await mount(SELECTION);
    const cell = bodyRows(element)[0]?.cells[0] as HTMLTableCellElement;
    expect(cell.getBoundingClientRect().width).toBe(px('--nph-data-table-selection-column-width'));
    element.size = 'large';
    await settle(element);
    const box = rowBoxes(element)[0] as HTMLElement;
    const padding = px('--nph-table-container-padding');
    expect(cell.getBoundingClientRect().width).toBe(box.getBoundingClientRect().width + 2 * padding);
  });

  it('the selection and the switch columns keep the row height, in the header too', async () => {
    const element = await mount({ ...SELECTION, ...SWITCH });
    const height = px('--nph-table-row-height');
    expect(root(element).querySelector('thead tr')?.getBoundingClientRect().height).toBe(height);
    for (const row of bodyRows(element)) expect(row.getBoundingClientRect().height).toBe(height);
    element.size = 'large';
    await settle(element);
    expect(bodyRows(element)[0]?.getBoundingClientRect().height).toBe(px('--nph-table-row-height-large'));
  });

  it('checking a row selects it, paints its background and its mark, and fires nph-selection-change', async () => {
    const element = await mount(SELECTION);
    const spy = vi.fn();
    element.addEventListener('nph-selection-change', spy);
    await userEvent.click(rowBoxes(element)[1] as NphCheckbox);
    await settle(element);
    expect(element.selected).toEqual(['bruno']);
    expect((spy.mock.calls[0]?.[0] as CustomEvent<NphDataTableSelectionChangeDetail>).detail).toEqual({ selected: ['bruno'] });
    const row = bodyRows(element)[1] as HTMLTableRowElement;
    expect(row.classList.contains('selected')).toBe(true);
    for (const cell of row.cells) {
      expect(getComputedStyle(cell).backgroundColor).toBe(resolved('background-color', '--nph-data-table-row-selected-background'));
    }
    const mark = getComputedStyle(row.cells[0] as HTMLElement).boxShadow;
    expect(mark).toContain(resolved('color', '--nph-data-table-row-selected-indicator'));
    expect(mark).toContain(`${px('--nph-data-table-row-selected-indicator-width')}px 0px 0px 0px inset`);
  });

  it('the selected row keeps its background under the pointer and over the stripe', async () => {
    const element = await mount({ ...SELECTION, striped: true, selected: ['bruno'] });
    const row = bodyRows(element)[1] as HTMLTableRowElement;
    await userEvent.hover(row.cells[1] as HTMLElement);
    expect(getComputedStyle(row.cells[1] as HTMLElement).backgroundColor).toBe(resolved('background-color', '--nph-data-table-row-selected-background'));
  });

  it('the header box is unchecked, indeterminate or checked from the drawn rows', async () => {
    const element = await mount(SELECTION);
    expect([headerBox(element).checked, headerBox(element).indeterminate]).toEqual([false, false]);
    element.selected = ['ana'];
    await settle(element);
    expect([headerBox(element).checked, headerBox(element).indeterminate]).toEqual([false, true]);
    element.selected = ['ana', 'bruno', 'carla'];
    await settle(element);
    expect([headerBox(element).checked, headerBox(element).indeterminate]).toEqual([true, false]);
  });

  it('the header box checks the drawn rows and keeps the rows selected on other pages; again, it unchecks them', async () => {
    const element = await mount({ ...SELECTION, selected: ['elsewhere', 'ana'] });
    await userEvent.click(headerBox(element));
    await settle(element);
    expect(element.selected).toEqual(['elsewhere', 'ana', 'bruno', 'carla']);
    expect(rowBoxes(element).every((box) => box.checked)).toBe(true);
    await userEvent.click(headerBox(element));
    await settle(element);
    expect(element.selected).toEqual(['elsewhere']);
    expect(rowBoxes(element).some((box) => box.checked)).toBe(false);
  });

  it('the unchecked box border is data-table/checkbox-border', async () => {
    const element = await mount(SELECTION);
    const box = rowBoxes(element)[0]?.shadowRoot?.querySelector('.box') as HTMLElement;
    expect(getComputedStyle(box).borderTopColor).toBe(color('--nph-data-table-checkbox-border'));
  });

  it('the input of the boxes stays inside the table', async () => {
    const element = await mount(SELECTION);
    const spy = vi.fn();
    element.addEventListener('input', spy);
    await userEvent.click(rowBoxes(element)[0] as NphCheckbox);
    expect(spy).not.toHaveBeenCalled();
  });

  it('without its names the column is left out, with an error in development', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ selectable: true, selectLabel: 'Select {name}' });
    expect(headerBox(element)).toBeNull();
    expect(rowBoxes(element)).toHaveLength(0);
    expect(spy.mock.calls.some(([message]) => String(message).includes('select-all-label is empty'))).toBe(true);
  });

  it('a row without a name has no box, with an error in development', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const rows = [{ key: 'x', cells: { name: 'X' } }, ...ROWS];
    const element = await mount({ ...SELECTION, rows });
    expect(rowBoxes(element)).toHaveLength(ROWS.length);
    expect(spy.mock.calls.some(([message]) => String(message).includes('a row has no name'))).toBe(true);
  });
});

describe('the bars', () => {
  const BARS = `<nph-toolbar slot="toolbar" type="page" label="Table actions"><nph-button text="New person"></nph-button></nph-toolbar>
    <nph-toolbar slot="bulk" type="bulk" label="Selection"><nph-button severity="secondary" emphasis="ghost" text="Clear selection"></nph-button></nph-toolbar>`;

  it('the page bar shows above the table and the bulk bar does not, while no row is selected', async () => {
    const element = await mount(SELECTION, BARS);
    const [page, bulk] = [element.querySelector('[slot="toolbar"]'), element.querySelector('[slot="bulk"]')] as HTMLElement[];
    expect(shown(page as HTMLElement)).toBe(true);
    expect(shown(bulk as HTMLElement)).toBe(false);
    const scroll = root(element).querySelector('.scroll') as HTMLElement;
    expect((page as HTMLElement).getBoundingClientRect().bottom).toBeLessThan(scroll.getBoundingClientRect().top);
  });

  it('with a selected row the bulk bar takes the place of the page bar, with the count written from selected-text', async () => {
    const element = await mount({ ...SELECTION, selectedText: '{count} of {total} selected', selected: ['ana', 'carla'] }, BARS);
    const [page, bulk] = [element.querySelector('[slot="toolbar"]'), element.querySelector('[slot="bulk"]')] as HTMLElement[];
    expect(shown(page as HTMLElement)).toBe(false);
    expect(shown(bulk as HTMLElement)).toBe(true);
    expect(bulk?.getAttribute('count-text')).toBe('2 of 3 selected');
    element.totalItems = 1200;
    element.lang = 'pt-BR';
    element.requestUpdate();
    await settle(element);
    expect(bulk?.getAttribute('count-text')).toBe('2 of 1.200 selected');
  });

  it('when the selection empties while the focus is in the bulk bar, the focus goes to the header box', async () => {
    const element = await mount({ ...SELECTION, selected: ['ana'] }, BARS);
    const clear = element.querySelector('[slot="bulk"] nph-button') as NphButton;
    clear.addEventListener('click', () => (element.selected = []));
    await userEvent.click(clear);
    await settle(element);
    expect(root(element).activeElement).toBe(headerBox(element));
  });

  it('when the last rows leave with the selection, the header box is disabled and the focus goes to a sortable header', async () => {
    const element = await mount({ ...SELECTION, emptyHeading: 'No person', selected: ['ana'] }, BARS);
    const clear = element.querySelector('[slot="bulk"] nph-button') as NphButton;
    clear.addEventListener('click', () => {
      element.rows = [];
      element.selected = [];
    });
    await userEvent.click(clear);
    await settle(element);
    expect(headerBox(element).disabled).toBe(true);
    expect(root(element).activeElement).toBe(sortButton(element, 'name'));
  });

  it('another bulk bar in the slot takes the count too', async () => {
    const element = await mount({ ...SELECTION, selectedText: '{count} selected', selected: ['ana'] }, BARS);
    element.querySelector('[slot="bulk"]')?.remove();
    const other = document.createElement('nph-toolbar');
    Object.assign(other, { type: 'bulk', label: 'Selection' });
    other.slot = 'bulk';
    element.append(other);
    await settle(element);
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    await settle(element);
    expect(other.getAttribute('count-text')).toBe('1 selected');
  });

  it('without bars no space is left for them', async () => {
    const element = await mount();
    expect(shown(root(element).querySelector('.bars') as HTMLElement)).toBe(false);
  });
});

describe('row actions', () => {
  it('the ⋮ is an icon-only nph-button secondary ghost, named per row, in a column data-table/action-column-width wide', async () => {
    const element = await mount(MORE);
    const buttons = [...root(element).querySelectorAll<NphButton>('td.actions nph-button')];
    expect(buttons.map((button) => button.label)).toEqual(['More actions for Ana Souza', 'More actions for Bruno Lima', 'More actions for Carla Dias']);
    expect(buttons[0]?.getAttribute('severity')).toBe('secondary');
    expect(buttons[0]?.getAttribute('emphasis')).toBe('ghost');
    expect(buttons[0]?.getAttribute('icon-start')).toBe(NPH_DATA_TABLE_ICONS.more);
    const cell = buttons[0]?.closest('td') as HTMLElement;
    expect(cell.getBoundingClientRect().width).toBe(px('--nph-data-table-action-column-width'));
    const box = (buttons[0] as HTMLElement).getBoundingClientRect();
    expect(Math.round(box.left - cell.getBoundingClientRect().left)).toBe(Math.round(cell.getBoundingClientRect().right - box.right));
  });

  it('the actions column keeps the row height of both sizes', async () => {
    const element = await mount(MORE);
    expect(bodyRows(element)[0]?.getBoundingClientRect().height).toBe(px('--nph-table-row-height'));
    element.size = 'large';
    await settle(element);
    expect(bodyRows(element)[0]?.getBoundingClientRect().height).toBe(px('--nph-table-row-height-large'));
  });

  it('the ⋮ opens the nph-dropdown-menu of the row, and an item fires nph-row-action', async () => {
    const element = await mount(MORE);
    const spy = vi.fn();
    element.addEventListener('nph-row-action', spy);
    const button = root(element).querySelectorAll<NphButton>('td.actions nph-button')[1] as NphButton;
    await userEvent.click(button);
    const menu = button.nextElementSibling as NphDropdownMenu;
    await menu.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    expect(menu.open).toBe(true);
    const item = menu.shadowRoot?.querySelectorAll<HTMLElement>('.item')[1] as HTMLElement;
    await userEvent.click(item);
    expect((spy.mock.calls[0]?.[0] as CustomEvent<NphTableRowActionDetail>).detail).toEqual({ row: 'bruno', action: 'delete' });
  });

  it('the header of the actions column is an empty cell, not a column header', async () => {
    const element = await mount(MORE);
    const last = headers(element).at(-1) as HTMLElement;
    expect(last.localName).toBe('td');
  });

  it('without actions-label the column is left out, with an error in development', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ actions: ACTIONS });
    expect(root(element).querySelector('td.actions')).toBeNull();
    expect(spy.mock.calls.some(([message]) => String(message).includes('actions-label is empty'))).toBe(true);
  });
});

describe('the switch column', () => {
  it('adds a column titled switch-header, before the actions, with an nph-switch per row named from the data', async () => {
    const element = await mount({ ...SWITCH, ...MORE });
    const titles = headers(element).map((cell) => cell.textContent?.trim());
    expect(titles.slice(-2)).toEqual(['Active', '']);
    const switches = [...root(element).querySelectorAll<NphSwitch>('td.switch nph-switch')];
    expect(switches.map((piece) => piece.label)).toEqual(['Active: Ana Souza', 'Active: Bruno Lima', 'Active: Carla Dias']);
    expect(switches.map((piece) => piece.checked)).toEqual([false, true, false]);
  });

  it('turning a switch fires nph-row-switch with the row and the new state', async () => {
    const element = await mount(SWITCH);
    const spy = vi.fn();
    element.addEventListener('nph-row-switch', spy);
    await userEvent.click(root(element).querySelector('td.switch nph-switch') as NphSwitch);
    expect((spy.mock.calls[0]?.[0] as CustomEvent<NphDataTableRowSwitchDetail>).detail).toEqual({ row: 'ana', checked: true });
  });
});

describe('loading and empty by search', () => {
  it('loading puts an nph-skeleton in the cells of data, one row per row shown, with the header visible', async () => {
    const element = await mount({ ...SELECTION, ...MORE, loading: true });
    const rows = bodyRows(element);
    expect(rows).toHaveLength(ROWS.length);
    expect(rows[0]?.querySelectorAll('nph-skeleton')).toHaveLength(COLUMNS.length);
    expect(rows[0]?.querySelectorAll('[aria-busy="true"]')).toHaveLength(COLUMNS.length);
    expect(rows[0]?.cells).toHaveLength(1 + COLUMNS.length + 1);
    expect(shown(root(element).querySelector('thead') as HTMLElement)).toBe(true);
    expect(headerBox(element).disabled).toBe(true);
  });

  it('loading with no row draws as many skeleton rows as the page size', async () => {
    const element = await mount({ rows: [], emptyHeading: 'No person', loading: true, pageSize: 5 });
    expect(bodyRows(element)).toHaveLength(5);
  });

  it('empty by search: the nph-empty and the button that clears the search, data-table/empty-gap apart', async () => {
    const element = await mount({ rows: [], emptyHeading: 'No result for "zz"', emptyDescription: 'Check the search.', clearLabel: 'Clear filter' });
    const empty = root(element).querySelector('nph-empty') as HTMLElement;
    const button = root(element).querySelector('.empty-search nph-button') as NphButton;
    expect(empty.getAttribute('heading')).toBe('No result for "zz"');
    expect(button.text).toBe('Clear filter');
    expect(Math.round(button.getBoundingClientRect().top - empty.getBoundingClientRect().bottom)).toBe(px('--nph-data-table-empty-gap'));
    expect(shown(root(element).querySelector('thead') as HTMLElement)).toBe(true);
    const spy = vi.fn();
    element.addEventListener('nph-filter-clear', spy);
    await userEvent.click(button);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('without clear-label, an empty body is the one of nph-table', async () => {
    const element = await mount({ rows: [], emptyHeading: 'No person' });
    expect(root(element).querySelector('nph-empty')).not.toBeNull();
    expect(root(element).querySelector('.empty-search')).toBeNull();
  });
});

describe('the footer', () => {
  function pagination(element: NphDataTable): NphPagination | null {
    return root(element).querySelector('nph-pagination');
  }

  it('middle: the label and the nph-select of items per page, then the nph-pagination the range type', async () => {
    const element = await mount(PAGES);
    const footer = root(element).querySelector('.pagination') as HTMLElement;
    const label = footer.querySelector('label') as HTMLElement;
    const select = footer.querySelector('nph-select') as NphSelect;
    expect(label.textContent?.trim()).toBe('Items per page');
    expect(getComputedStyle(label).color).toBe(color('--nph-data-table-page-size-label-foreground'));
    expect(select.getBoundingClientRect().width).toBe(px('--nph-data-table-page-size-width'));
    expect(pagination(element)?.type).toBe('range');
    expect(getComputedStyle(footer).columnGap).toBe(`${px('--nph-data-table-pagination-gap')}px`);
    /* Outside the scroll area. */
    expect(footer.closest('.scroll')).toBeNull();
  });

  it('wide: the nph-pagination the table type, with its own items per page', async () => {
    const element = await mount({ ...PAGES, paginationLayout: 'wide' });
    expect(pagination(element)?.type).toBe('table');
    expect(pagination(element)?.pageSizes).toEqual([10, 20, 50]);
    expect(root(element).querySelector('.pagination > nph-select')).toBeNull();
  });

  it('narrow: only the nph-pagination the range type', async () => {
    const element = await mount({ ...PAGES, paginationLayout: 'narrow' });
    expect(pagination(element)?.type).toBe('range');
    expect(root(element).querySelector('.pagination > nph-select')).toBeNull();
  });

  it('a single page draws no footer', async () => {
    const element = await mount({ ...PAGES, totalItems: 8 });
    expect(root(element).querySelector('.pagination')).toBeNull();
  });

  it('moving in the nph-pagination keeps the page in the table and the event leaves it', async () => {
    const element = await mount(PAGES);
    const events: NphPaginationChangeDetail[] = [];
    element.addEventListener('nph-page-change', (event) => events.push(event.detail));
    const next = pagination(element)?.shadowRoot?.querySelector<HTMLElement>('.next') as HTMLElement;
    await userEvent.click(next);
    await settle(element);
    expect(element.page).toBe(2);
    expect(events).toEqual([{ page: 2, pageSize: 10 }]);
  });

  it('items per page keeps the first item on screen and fires nph-page-change', async () => {
    const element = await mount({ ...PAGES, page: 3 });
    const events: NphPaginationChangeDetail[] = [];
    element.addEventListener('nph-page-change', (event) => events.push(event.detail));
    const input = vi.fn();
    element.addEventListener('input', input);
    const select = root(element).querySelector('.pagination nph-select') as NphSelect;
    select.value = '20';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(element);
    /* Item 21 was first on page 3 of 10; with 20 per page, it is on page 2. */
    expect([element.page, element.pageSize]).toEqual([2, 20]);
    expect(events).toEqual([{ page: 2, pageSize: 20 }]);
    expect(input).not.toHaveBeenCalled();
  });

  it('items per page counts from the page drawn, never past the last one of the total', async () => {
    const element = await mount({ ...PAGES, page: 5, pageSize: 10, totalItems: 25 });
    const events: NphPaginationChangeDetail[] = [];
    element.addEventListener('nph-page-change', (event) => events.push(event.detail));
    const select = root(element).querySelector('.pagination nph-select') as NphSelect;
    select.value = '20';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(element);
    /* Page 3 of 10 is the last of 25 items; its first item, 21, is on page 2 of 20. */
    expect(events).toEqual([{ page: 2, pageSize: 20 }]);
  });

  it('wide without page-sizes keeps the navigation, in the range type', async () => {
    const element = await mount({ ...PAGES, paginationLayout: 'wide', pageSizes: [] });
    expect(pagination(element)?.type).toBe('range');
    expect(pagination(element)?.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('when items per page fits every record, the footer leaves and the focus stays in the table', async () => {
    const element = await mount({ ...PAGES, pageSize: 5, pageSizes: [5, 20], totalItems: 12 });
    const select = root(element).querySelector('.pagination nph-select') as NphSelect;
    select.focus();
    select.value = '20';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(element);
    expect(root(element).querySelector('.pagination')).toBeNull();
    expect(root(element).activeElement).toBe(sortButton(element, 'name'));
  });

  it('a pagination-layout outside the list errors in development and the footer is left out', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ ...PAGES, paginationLayout: 'auto' });
    expect(root(element).querySelector('.pagination')).toBeNull();
    expect(spy.mock.calls.some(([message]) => String(message).includes('pagination-layout "auto"'))).toBe(true);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css, and these are the ones the contract names', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(new Set(used)).toEqual(
      new Set([
        '--nph-data-table-stack-gap',
        '--nph-data-table-selection-column-width',
        '--nph-data-table-checkbox-border',
        '--nph-data-table-sort-icon-foreground',
        '--nph-data-table-sort-icon-active-foreground',
        '--nph-data-table-row-selected-background',
        '--nph-data-table-row-selected-indicator',
        '--nph-data-table-row-selected-indicator-width',
        '--nph-data-table-action-column-width',
        '--nph-data-table-empty-gap',
        '--nph-data-table-pagination-gap',
        '--nph-data-table-page-size-label-foreground',
        '--nph-data-table-page-size-width',
        '--nph-table-cell-gap',
        '--nph-table-cell-padding-block',
        '--nph-table-cell-padding-inline',
        '--nph-table-container-padding',
        '--nph-table-focus-ring-width',
        '--nph-table-icon-size',
        '--nph-table-border-width',
        '--nph-focus-border',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('every data-table/* token is consumed', () => {
    const declared = [...tokensCss.matchAll(/(--nph-data-table-[a-z0-9-]+):/g)].map((match) => match[1] as string);
    expect(declared).toHaveLength(13);
    for (const name of declared) {
      expect(cssWithoutComments, name).toContain(`var(${name})`);
    }
  });

  it('never consumes a core or theme layer directly', () => {
    expect(cssWithoutComments).not.toMatch(/--nph-core-/);
    expect(cssWithoutComments).not.toMatch(/--nph-theme-/);
  });

  it('the CSS has no literal design value and no motion of its own', () => {
    /* The box relations written: `100%`, half a turn and the multipliers of calc. */
    const withoutRelations = cssWithoutComments.replace(/\b100%/g, '').replace(/0\.5turn/g, '').replace(/calc\(-1 \*/g, 'calc(');
    expect(withoutRelations).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(withoutRelations).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(withoutRelations).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
    expect(withoutRelations).not.toMatch(/\b(animation|transition|@keyframes)\b/);
  });
});
