/**
 * Tests of `nph-table` (P97), in a real browser (P21, item 5): resolved color, measures,
 * scrolling, the fixed header, real hover and keyboard focus only exist where there is
 * layout.
 *
 * They prove the contract accepted in Figma (frame `2584:66651`, set `1370:113`): the API,
 * the native table with its header, body and footer, the alignment of each column, the
 * two-level header, the two sizes, the frame, the fixed header, the stripe, the hover and
 * the grid; the caption that names the table; the scroll area that becomes a focusable
 * region when it overflows; every composite cell with the piece it takes; the no-value
 * dash; the truncated text with its tooltip and focus; the expanding row, the tree and the
 * expanded item; the events; the empty body; the invalid input and the token contract.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-table.css?raw';
import {
  NPH_TABLE_ALIGNS,
  NPH_TABLE_CELL_TYPES,
  NPH_TABLE_DASH,
  NPH_TABLE_ICONS,
  NPH_TABLE_MAX_LEVEL,
  NPH_TABLE_SIZES,
  NPH_TABLE_STATUSES,
  NPH_TABLE_STATUS_ICON,
  NphTable,
} from './nph-table';
import type { NphTableColumn, NphTableRow, NphTableRowActionDetail, NphTableRowToggleDetail } from './nph-table';
import type { NphButton } from '../nph-button/nph-button';

type Props = Partial<
  Pick<
    NphTable,
    | 'size'
    | 'framed'
    | 'stickyHeader'
    | 'striped'
    | 'grid'
    | 'caption'
    | 'description'
    | 'total'
    | 'label'
    | 'noValueLabel'
    | 'emptyHeading'
    | 'emptyDescription'
    | 'columns'
    | 'rows'
    | 'footer'
  >
>;

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

/** An abstract picture, as a data URI: valid, and it carries no person. */
const IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#2980b9"/></svg>')}`;

const COLUMNS: NphTableColumn[] = [
  { key: 'unit', header: 'Unit' },
  { key: 'amount', header: 'Amount', align: 'end' },
];

const ROWS: NphTableRow[] = [
  { key: 'north', cells: { unit: 'North', amount: 1200 } },
  { key: 'south', cells: { unit: 'South', amount: 800 } },
  { key: 'east', cells: { unit: 'East', amount: null } },
  { key: 'west', cells: { unit: 'West', amount: 50 } },
];

async function mount(props: Props = {}, parent: HTMLElement = document.body): Promise<NphTable> {
  const element = document.createElement('nph-table');
  Object.assign(element, { caption: 'Payments', columns: COLUMNS, rows: ROWS, noValueLabel: 'no value', ...props });
  parent.append(element);
  await element.updateComplete;
  return element;
}

function root(element: NphTable): ShadowRoot {
  return element.shadowRoot as ShadowRoot;
}

function table(element: NphTable): HTMLTableElement {
  return root(element).querySelector('table') as HTMLTableElement;
}

function bodyRows(element: NphTable): HTMLTableRowElement[] {
  return [...root(element).querySelectorAll<HTMLTableRowElement>('tbody tr.row')];
}

function cellsOf(row: HTMLTableRowElement): HTMLTableCellElement[] {
  return [...row.querySelectorAll<HTMLTableCellElement>(':scope > td:not(.chevron-column)')];
}

function scrollArea(element: NphTable): HTMLElement {
  return root(element).querySelector('.scroll') as HTMLElement;
}

function innerButton(button: Element | null | undefined): HTMLButtonElement {
  return (button as NphButton).shadowRoot?.querySelector('button') as HTMLButtonElement;
}

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

function px(token: string, parent: HTMLElement = document.body): number {
  return parseFloat(resolved('width', token, parent));
}

function color(token: string, parent: HTMLElement = document.body): string {
  return resolved('color', token, parent);
}

interface AxNode {
  ignored: boolean;
  role: string;
  name: string;
}

/** The node the browser itself computes for an element, from its accessibility tree. */
async function axNode(element: Element): Promise<AxNode> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', {
      query: '[data-ax-probe]',
      includeUserAgentShadowDOM: false,
    });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    const node = nodes[0];
    return {
      ignored: Boolean(node?.ignored),
      role: String(node?.role?.value ?? ''),
      name: String(node?.name?.value ?? ''),
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('defines nph-table only once', () => {
    expect(customElements.get('nph-table')).toBe(NphTable);
  });

  it('the public API is the one of P97', () => {
    const declared = [...(NphTable as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual([
      'size',
      'framed',
      'stickyHeader',
      'striped',
      'grid',
      'caption',
      'description',
      'total',
      'label',
      'noValueLabel',
      'emptyHeading',
      'emptyDescription',
      'columns',
      'rows',
      'footer',
    ]);
  });

  it('the lists are the ones of Figma and P97', () => {
    expect([...NPH_TABLE_SIZES]).toEqual(['default', 'large']);
    expect([...NPH_TABLE_ALIGNS]).toEqual(['start', 'end']);
    expect([...NPH_TABLE_STATUSES]).toEqual(['success', 'error']);
    expect([...NPH_TABLE_CELL_TYPES]).toEqual([
      'text',
      'person',
      'badge',
      'icon-text',
      'thumbnail',
      'link',
      'truncated',
      'status',
      'button',
      'actions',
      'mixed-actions',
      'rating',
      'loading',
    ]);
    expect(NPH_TABLE_MAX_LEVEL).toBe(3);
    expect(NPH_TABLE_STATUS_ICON).toEqual({ success: 'circle-check', error: 'circle-xmark' });
    expect(NPH_TABLE_ICONS).toEqual({
      edit: 'pen-to-square',
      more: 'ellipsis-vertical',
      closed: 'chevron-right',
      open: 'chevron-down',
      rating: 'star',
    });
  });

  it('the defaults: default size, no frame, no fixed header, no stripe, no grid, no footer', async () => {
    const element = document.createElement('nph-table');
    expect(element.size).toBe('default');
    expect([element.framed, element.stickyHeader, element.striped, element.grid]).toEqual([false, false, false, false]);
    expect(element.footer).toBeNull();
    expect(element.columns).toEqual([]);
    expect(element.rows).toEqual([]);
  });

  it('the flags reflect, so the internal CSS reads them', async () => {
    const element = await mount({ framed: true, stickyHeader: true, striped: true, grid: true, size: 'large' });
    for (const attribute of ['framed', 'sticky-header', 'striped', 'grid']) {
      expect(element.hasAttribute(attribute), attribute).toBe(true);
    }
    expect(element.getAttribute('size')).toBe('large');
  });
});

describe('the native table', () => {
  it('draws a table with a header of column headers and a body of cells', async () => {
    const element = await mount();
    const headers = [...table(element).querySelectorAll('thead th')];
    expect(headers.map((th) => th.textContent?.trim())).toEqual(['Unit', 'Amount']);
    for (const th of headers) expect(th.getAttribute('scope')).toBe('col');
    expect(bodyRows(element).map((row) => cellsOf(row).map((td) => td.textContent?.trim()))).toEqual([
      ['North', '1200'],
      ['South', '800'],
      ['East', `${NPH_TABLE_DASH}no value`],
      ['West', '50'],
    ]);
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('a number column aligns to the end, with tabular figures, and its header and footer follow it', async () => {
    const element = await mount({ footer: { unit: 'Total', amount: 2050 } });
    const [unitHeader, amountHeader] = [...table(element).querySelectorAll('thead th')] as HTMLElement[];
    const [unitCell, amountCell] = cellsOf(bodyRows(element)[0] as HTMLTableRowElement);
    const [unitFoot, amountFoot] = [...table(element).querySelectorAll('tfoot td')] as HTMLElement[];
    for (const start of [unitHeader, unitCell, unitFoot]) expect(getComputedStyle(start as HTMLElement).textAlign).toBe('start');
    for (const end of [amountHeader, amountCell, amountFoot]) {
      expect(getComputedStyle(end as HTMLElement).textAlign).toBe('end');
      expect(getComputedStyle(end as HTMLElement).fontVariantNumeric).toBe('tabular-nums');
    }
  });

  it('the footer has the background and the typography of the header', async () => {
    const element = await mount({ footer: { unit: 'Total', amount: 2050 } });
    const header = table(element).querySelector('thead th') as HTMLElement;
    const foot = table(element).querySelector('tfoot td') as HTMLElement;
    expect(foot.textContent?.trim()).toBe('Total');
    expect(getComputedStyle(foot).backgroundColor).toBe(resolved('background-color', '--nph-table-header-background'));
    expect(getComputedStyle(header).backgroundColor).toBe(resolved('background-color', '--nph-table-header-background'));
    for (const cell of [header, foot]) {
      expect(getComputedStyle(cell).fontWeight).toBe(resolved('font-weight', '--nph-text-heading-xs-font-weight'));
      expect(getComputedStyle(cell).fontSize).toBe(resolved('font-size', '--nph-text-heading-xs-font-size'));
    }
  });

  it('a footer with no value for any column is not drawn', async () => {
    const element = await mount({ footer: { other: 'x' } });
    expect(table(element).querySelector('tfoot')).toBeNull();
  });

  it('the cell text is text/body-md in table/foreground; the header text is table/foreground too', async () => {
    const element = await mount();
    const td = cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[0] as HTMLElement;
    expect(getComputedStyle(td).fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
    expect(getComputedStyle(td).color).toBe(color('--nph-table-foreground'));
    expect(getComputedStyle(table(element).querySelector('thead th') as HTMLElement).color).toBe(color('--nph-table-foreground'));
  });

  it('the row divider is table/border-width in table/border', async () => {
    const element = await mount();
    const td = cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[0] as HTMLElement;
    expect(parseFloat(getComputedStyle(td).borderBottomWidth)).toBe(px('--nph-table-border-width'));
    expect(getComputedStyle(td).borderBottomColor).toBe(color('--nph-table-border'));
  });

  it('the column width set in use is the content width of the header', async () => {
    const element = await mount({ columns: [{ key: 'unit', header: 'Unit', width: '10rem' }, COLUMNS[1] as NphTableColumn] });
    const th = table(element).querySelector('thead th') as HTMLElement;
    expect(th.style.inlineSize).toBe('10rem');
  });
});

describe('two-level header', () => {
  const columns: NphTableColumn[] = [
    { key: 'unit', header: 'Unit' },
    { key: 'web', header: 'Web', align: 'end', group: 'Accesses' },
    { key: 'app', header: 'App', align: 'end', group: 'Accesses' },
    { key: 'total', header: 'Total', align: 'end' },
  ];

  it('the group title spans the columns it groups; the others take both header rows', async () => {
    const element = await mount({ columns, rows: [{ key: 'a', cells: { unit: 'North', web: 1, app: 2, total: 3 } }] });
    const [first, second] = [...table(element).querySelectorAll('thead tr')] as HTMLTableRowElement[];
    const top = [...(first as HTMLTableRowElement).cells];
    expect(top.map((cell) => [cell.textContent?.trim(), cell.getAttribute('scope'), cell.colSpan, cell.rowSpan])).toEqual([
      ['Unit', 'col', 1, 2],
      ['Accesses', 'colgroup', 2, 1],
      ['Total', 'col', 1, 2],
    ]);
    expect([...(second as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim())).toEqual(['Web', 'App']);
    expect(table(element).querySelectorAll('colgroup')).toHaveLength(3);
    expect(table(element).querySelectorAll('colgroup')[1]?.querySelectorAll('col')).toHaveLength(2);
  });

  it('the group title takes the same header piece', async () => {
    const element = await mount({ columns, rows: [] , emptyHeading: 'Nothing'});
    const group = table(element).querySelector('th[scope="colgroup"]') as HTMLElement;
    expect(getComputedStyle(group).backgroundColor).toBe(resolved('background-color', '--nph-table-header-background'));
    expect(getComputedStyle(group).fontWeight).toBe(resolved('font-weight', '--nph-text-heading-xs-font-weight'));
  });
});

describe('sizes', () => {
  for (const [size, height, sides] of [
    ['default', '--nph-table-row-height', '--nph-table-cell-padding-inline'],
    ['large', '--nph-table-row-height-large', '--nph-table-container-padding'],
  ] as const) {
    it(`${size}: the row is ${height} and the cell sides ${sides}`, async () => {
      const element = await mount({ size });
      const td = cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[0] as HTMLElement;
      expect(td.getBoundingClientRect().height).toBeCloseTo(px(height), 0);
      expect(parseFloat(getComputedStyle(td).paddingLeft)).toBe(px(sides));
      expect(parseFloat(getComputedStyle(td).paddingTop)).toBe(px('--nph-table-cell-padding-block'));
    });
  }
});

describe('frame, stripe, hover and grid', () => {
  it('without a frame, the scroll area has no border', async () => {
    const element = await mount();
    expect(getComputedStyle(scrollArea(element)).borderTopStyle).toBe('none');
  });

  it('the frame is table/border in table/border-width with the corner table/radius; the last row leaves its divider to it', async () => {
    const element = await mount({ framed: true });
    const area = getComputedStyle(scrollArea(element));
    expect(parseFloat(area.borderTopWidth)).toBe(px('--nph-table-border-width'));
    expect(area.borderTopColor).toBe(color('--nph-table-border'));
    expect(parseFloat(area.borderTopLeftRadius)).toBe(px('--nph-table-radius'));
    expect(area.backgroundColor).toBe(resolved('background-color', '--nph-table-background'));
    const last = cellsOf(bodyRows(element).at(-1) as HTMLTableRowElement)[0] as HTMLElement;
    expect(getComputedStyle(last).borderBottomStyle).toBe('none');
  });

  it('the stripe paints every other row of data in table/row-striped-background', async () => {
    const element = await mount({ striped: true });
    const stripe = resolved('background-color', '--nph-table-row-striped-background');
    const plain = resolved('background-color', '--nph-table-background');
    expect(bodyRows(element).map((row) => row.classList.contains('striped'))).toEqual([false, true, false, true]);
    expect(bodyRows(element).map((row) => getComputedStyle(cellsOf(row)[0] as HTMLElement).backgroundColor)).toEqual([plain, stripe, plain, stripe]);
  });

  it('without striped, no row is painted', async () => {
    const element = await mount();
    const plain = resolved('background-color', '--nph-table-background');
    for (const row of bodyRows(element)) {
      expect(getComputedStyle(cellsOf(row)[0] as HTMLElement).backgroundColor).toBe(plain);
    }
  });

  it('the stripe counts only the rows of data: an open expanded item does not shift it', async () => {
    const rows: NphTableRow[] = [
      { key: 'a', cells: { unit: 'A', amount: 1 }, detail: { name: 'Item A' }, open: true, toggleLabel: 'Details of A' },
      { key: 'b', cells: { unit: 'B', amount: 2 } },
      { key: 'c', cells: { unit: 'C', amount: 3 } },
    ];
    const element = await mount({ striped: true, rows });
    expect(root(element).querySelectorAll('tbody tr.detail')).toHaveLength(1);
    expect(bodyRows(element).map((row) => row.classList.contains('striped'))).toEqual([false, true, false]);
  });

  it('hover paints the whole row in table/row-hover-background, over the stripe too', async () => {
    const element = await mount({ striped: true });
    const row = bodyRows(element)[1] as HTMLTableRowElement;
    await userEvent.hover(cellsOf(row)[0] as HTMLElement);
    const hover = resolved('background-color', '--nph-table-row-hover-background');
    await vi.waitFor(() => {
      for (const td of cellsOf(row)) expect(getComputedStyle(td).backgroundColor).toBe(hover);
    });
  });

  it('the grid draws the vertical line between the columns of the body', async () => {
    const element = await mount({ grid: true });
    const [first, second] = cellsOf(bodyRows(element)[0] as HTMLTableRowElement) as HTMLElement[];
    expect(getComputedStyle(first as HTMLElement).borderLeftStyle).toBe('none');
    expect(parseFloat(getComputedStyle(second as HTMLElement).borderLeftWidth)).toBe(px('--nph-table-border-width'));
    expect(getComputedStyle(second as HTMLElement).borderLeftColor).toBe(color('--nph-table-border'));
  });

  it('without the grid, there is no vertical line', async () => {
    const element = await mount();
    const second = cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[1] as HTMLElement;
    expect(getComputedStyle(second).borderLeftStyle).toBe('none');
  });
});

describe('caption and name', () => {
  it('the caption title names the table and the description describes it', async () => {
    const element = await mount({ caption: 'Payments', description: 'By unit, in October' });
    const t = table(element);
    expect(t.getAttribute('aria-labelledby')).toBe('caption');
    expect(t.getAttribute('aria-describedby')).toBe('description');
    expect(root(element).getElementById('caption')?.textContent).toBe('Payments');
    expect(root(element).getElementById('description')?.textContent).toBe('By unit, in October');
    const node = await axNode(t);
    expect(node.role).toBe('table');
    expect(node.name).toBe('Payments');
  });

  it('the caption text is table/caption-foreground for the description, up to table/caption-max-width, at table/stack-gap from the table', async () => {
    const element = await mount({ caption: 'Payments', description: 'By unit' });
    const description = root(element).getElementById('description') as HTMLElement;
    expect(getComputedStyle(description).color).toBe(color('--nph-table-caption-foreground'));
    const text = root(element).querySelector('.caption-text') as HTMLElement;
    expect(parseFloat(getComputedStyle(text).maxWidth)).toBe(px('--nph-table-caption-max-width'));
    const caption = root(element).querySelector('.caption') as HTMLElement;
    expect(parseFloat(getComputedStyle(caption).marginBottom)).toBe(px('--nph-table-stack-gap'));
  });

  it('the total is an nph-badge secondary beside the title', async () => {
    const element = await mount({ total: '4 units' });
    const badge = root(element).querySelector('.caption-title nph-badge') as HTMLElement;
    expect(badge.getAttribute('severity')).toBe('secondary');
    expect(badge.getAttribute('text')).toBe('4 units');
  });

  it('the main action of the caption goes in the slot action, at table/caption-action-gap', async () => {
    const element = document.createElement('nph-table');
    Object.assign(element, { caption: 'Payments', columns: COLUMNS, rows: ROWS, noValueLabel: 'no value' });
    const action = document.createElement('button');
    action.slot = 'action';
    action.textContent = 'Export';
    element.append(action);
    document.body.append(element);
    await element.updateComplete;
    const slot = root(element).querySelector('slot[name="action"]') as HTMLSlotElement;
    expect(slot.assignedElements()).toEqual([action]);
    expect(parseFloat(getComputedStyle(root(element).querySelector('.caption') as HTMLElement).columnGap)).toBe(px('--nph-table-caption-action-gap'));
  });

  it('without a caption, label is the accessible name and no caption is drawn', async () => {
    const element = await mount({ caption: '', label: 'Payments by unit' });
    expect(root(element).querySelector('.caption')).toBeNull();
    expect(table(element).getAttribute('aria-label')).toBe('Payments by unit');
    expect(table(element).hasAttribute('aria-labelledby')).toBe(false);
    expect((await axNode(table(element))).name).toBe('Payments by unit');
  });

  it('without a caption and a label, the table renders and warns once in development', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const element = await mount({ caption: '' });
    element.striped = true;
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(warn.mock.calls.filter(([message]) => String(message).includes('no name'))).toHaveLength(1);
  });
});

describe('scroll area', () => {
  const wide: NphTableColumn[] = Array.from({ length: 8 }, (_, index) => ({ key: `c${index}`, header: `Column number ${index}` }));
  const wideRows: NphTableRow[] = [{ key: 'a', cells: Object.fromEntries(wide.map((column) => [column.key, 'Some long value'])) }];

  it('when the table fits, the scroll area is not a stop of the Tab order', async () => {
    const element = await mount();
    const area = scrollArea(element);
    expect(area.hasAttribute('tabindex')).toBe(false);
    expect(area.hasAttribute('role')).toBe(false);
  });

  it('when the columns do not fit, the scroll area scrolls and becomes a focusable region named by the caption', async () => {
    const frame = document.createElement('div');
    frame.style.inlineSize = '20rem';
    document.body.append(frame);
    const element = await mount({ columns: wide, rows: wideRows }, frame);
    const area = scrollArea(element);
    await vi.waitFor(() => expect(area.getAttribute('tabindex')).toBe('0'));
    expect(area.scrollWidth).toBeGreaterThan(area.clientWidth);
    expect(area.getAttribute('role')).toBe('region');
    expect(area.getAttribute('aria-labelledby')).toBe('caption');
    const node = await axNode(area);
    expect(node.role).toBe('region');
    expect(node.name).toBe('Payments');
  });

  it('keyboard focus on the scroll area draws the ring focus/border in table/focus-ring-width', async () => {
    const frame = document.createElement('div');
    frame.style.inlineSize = '20rem';
    document.body.append(frame);
    const element = await mount({ columns: wide, rows: wideRows }, frame);
    const area = scrollArea(element);
    await vi.waitFor(() => expect(area.getAttribute('tabindex')).toBe('0'));
    await userEvent.keyboard('{Tab}');
    expect(root(element).activeElement).toBe(area);
    const style = getComputedStyle(area);
    expect(style.outlineStyle).toBe('solid');
    expect(parseFloat(style.outlineWidth)).toBe(px('--nph-table-focus-ring-width'));
    expect(style.outlineColor).toBe(color('--nph-focus-border'));
  });

  it('the ring is the same with the frame, the fixed header and the large size', async () => {
    const frame = document.createElement('div');
    frame.style.inlineSize = '20rem';
    document.body.append(frame);
    const element = await mount({ columns: wide, rows: wideRows, framed: true, stickyHeader: true, size: 'large' }, frame);
    const area = scrollArea(element);
    await vi.waitFor(() => expect(area.getAttribute('tabindex')).toBe('0'));
    area.focus({ focusVisible: true } as FocusOptions);
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await userEvent.keyboard('{Tab}');
    const style = getComputedStyle(area);
    expect(parseFloat(style.outlineWidth)).toBe(px('--nph-table-focus-ring-width'));
    expect(style.outlineColor).toBe(color('--nph-focus-border'));
  });

  it('the scrollbar is table/scrollbar-width wide, with the thumb and the track of the table', async () => {
    /* The headless browser hides scrollbars, so the drawn width cannot be measured: the
       style the browser computes for the scrollbar parts is read instead. */
    const element = await mount();
    const area = scrollArea(element);
    const bar = getComputedStyle(area, '::-webkit-scrollbar');
    expect(parseFloat(bar.width)).toBe(px('--nph-table-scrollbar-width'));
    expect(parseFloat(bar.height)).toBe(px('--nph-table-scrollbar-width'));
    const thumb = getComputedStyle(area, '::-webkit-scrollbar-thumb');
    expect(thumb.backgroundColor).toBe(resolved('background-color', '--nph-table-scrollbar-thumb'));
    expect(parseFloat(thumb.borderTopLeftRadius)).toBe(px('--nph-table-scrollbar-radius'));
    const track = getComputedStyle(area, '::-webkit-scrollbar-track');
    expect(track.backgroundColor).toBe(resolved('background-color', '--nph-table-scrollbar-track'));
  });

  it('the table is held at table/max-width', async () => {
    const element = await mount();
    expect(parseFloat(getComputedStyle(element).maxWidth)).toBe(px('--nph-table-max-width'));
  });
});

describe('fixed header', () => {
  const many: NphTableRow[] = Array.from({ length: 20 }, (_, index) => ({ key: `r${index}`, cells: { unit: `Unit ${index}`, amount: index } }));

  it('the body scrolls up to table/body-max-height and the header stays in place', async () => {
    const element = await mount({ stickyHeader: true, rows: many });
    const area = scrollArea(element);
    expect(parseFloat(getComputedStyle(area).maxHeight)).toBe(px('--nph-table-body-max-height'));
    expect(area.scrollHeight).toBeGreaterThan(area.clientHeight);
    const header = table(element).querySelector('thead th') as HTMLElement;
    const before = header.getBoundingClientRect().top;
    area.scrollTop = 200;
    await vi.waitFor(() => expect(area.scrollTop).toBeGreaterThan(0));
    expect(header.getBoundingClientRect().top).toBe(before);
    expect(getComputedStyle(table(element).querySelector('thead') as HTMLElement).position).toBe('sticky');
  });

  it('the line under the fixed header is the sticky divider in table/sticky-divider-color', async () => {
    const element = await mount({ stickyHeader: true, rows: many });
    const header = table(element).querySelector('thead th') as HTMLElement;
    const shadow = getComputedStyle(header).boxShadow;
    expect(shadow).toContain(color('--nph-table-sticky-divider-color'));
    expect(shadow).toContain(`0px ${px('--nph-table-sticky-divider-width')}px ${px('--nph-table-sticky-divider-blur')}px ${px('--nph-table-sticky-divider-spread')}px`);
  });

  it('without the fixed header, the header scrolls with the page and has no shadow', async () => {
    const element = await mount({ rows: many });
    expect(getComputedStyle(table(element).querySelector('thead') as HTMLElement).position).toBe('static');
    expect(getComputedStyle(table(element).querySelector('thead th') as HTMLElement).boxShadow).toBe('none');
  });
});

describe('no value', () => {
  it('a missing value is the dash, read as no-value-label', async () => {
    const element = await mount();
    const cell = cellsOf(bodyRows(element)[2] as HTMLTableRowElement)[1] as HTMLElement;
    expect(cell.querySelector('[aria-hidden="true"]')?.textContent).toBe(NPH_TABLE_DASH);
    expect(cell.querySelector('.hidden')?.textContent).toBe('no value');
    expect((await axNode(cell)).name).toBe('no value');
  });

  it('null, undefined and the empty string are all no value', async () => {
    const element = await mount({
      rows: [
        { key: 'a', cells: { unit: null, amount: undefined } },
        { key: 'b', cells: { unit: '', amount: 1 } },
      ],
    });
    expect(root(element).querySelectorAll('.no-value')).toHaveLength(3);
  });

  it('without no-value-label, the dash renders and the table warns once in development', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const element = await mount({ noValueLabel: '' });
    element.grid = true;
    await element.updateComplete;
    expect(root(element).querySelector('.no-value')?.textContent).toBe(NPH_TABLE_DASH);
    expect(warn.mock.calls.filter(([message]) => String(message).includes('no-value-label'))).toHaveLength(1);
  });
});

describe('composite cells', () => {
  async function single(cell: unknown, column: Partial<NphTableColumn> = {}): Promise<{ element: NphTable; td: HTMLElement }> {
    const element = await mount({
      columns: [{ key: 'c', header: 'Content', ...column }],
      rows: [{ key: 'ana', cells: { c: cell as never } }],
    });
    return { element, td: cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[0] as HTMLElement };
  }

  it('text with a second line: the second line in table/muted-foreground and text/body-sm', async () => {
    const { td } = await single({ type: 'text', text: 'Invoice 12', secondary: 'Due on Friday' });
    const second = td.querySelector('.secondary') as HTMLElement;
    expect(td.querySelector('.text')?.textContent).toBe('Invoice 12');
    expect(second.textContent).toBe('Due on Friday');
    expect(getComputedStyle(second).color).toBe(color('--nph-table-muted-foreground'));
    expect(getComputedStyle(second).fontSize).toBe(resolved('font-size', '--nph-text-body-sm-font-size'));
  });

  it('person: an nph-avatar md with the name, at table/cell-gap', async () => {
    const { td } = await single({ type: 'person', text: 'Ana Souza', secondary: 'Finance', src: IMAGE });
    const avatar = td.querySelector('nph-avatar') as HTMLElement;
    expect(avatar.getAttribute('size')).toBe('md');
    expect(avatar.getAttribute('src')).toBe(IMAGE);
    expect(td.querySelector('.text')?.textContent).toBe('Ana Souza');
    expect(parseFloat(getComputedStyle(td.querySelector('.pieces') as HTMLElement).columnGap)).toBe(px('--nph-table-cell-gap'));
  });

  it('badge: an nph-badge light with the severity of the cell', async () => {
    const { td } = await single({ type: 'badge', text: 'Paid', severity: 'success' });
    const badge = td.querySelector('nph-badge') as HTMLElement;
    expect([badge.getAttribute('emphasis'), badge.getAttribute('severity'), badge.getAttribute('text')]).toEqual(['light', 'success', 'Paid']);
  });

  it('icon and text: an nph-icon of the core at table/icon-size', async () => {
    const { td } = await single({ type: 'icon-text', icon: 'calendar', text: 'Monthly' });
    const icon = td.querySelector('nph-icon') as HTMLElement;
    expect(icon.getAttribute('name')).toBe('calendar');
    await vi.waitFor(() => expect(icon.getBoundingClientRect().height).toBe(px('--nph-table-icon-size')));
  });

  it('the icons follow table/icon-size when it is set on the table, not icon/size-sm', async () => {
    const { element, td } = await single({ type: 'icon-text', icon: 'calendar', text: 'Monthly' });
    element.style.setProperty('--nph-table-icon-size', '2rem');
    const icon = td.querySelector('nph-icon') as HTMLElement;
    await vi.waitFor(() => expect(icon.getBoundingClientRect().height).toBe(32));
  });

  it('thumbnail: an nph-image sm, the table/thumbnail-size box with the table/thumbnail-radius corner over table/muted-background', async () => {
    const { td } = await single({ type: 'thumbnail', src: IMAGE, alt: 'Blue mug', text: 'Mug' });
    const image = td.querySelector('nph-image') as HTMLElement;
    expect([image.getAttribute('size'), image.getAttribute('src'), image.getAttribute('alt')]).toEqual(['sm', IMAGE, 'Blue mug']);
    await vi.waitFor(() => expect(image.getBoundingClientRect().width).toBe(px('--nph-table-thumbnail-size')));
    expect(parseFloat(getComputedStyle(image).borderTopLeftRadius)).toBe(px('--nph-table-thumbnail-radius'));
    expect(getComputedStyle(image).backgroundColor).toBe(resolved('background-color', '--nph-table-muted-background'));
  });

  it('link: an underlined link in table/link-foreground', async () => {
    const { td } = await single({ type: 'link', text: 'Receipt', href: '#receipt' });
    const link = td.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('#receipt');
    expect(getComputedStyle(link).textDecorationLine).toBe('underline');
    expect(getComputedStyle(link).color).toBe(color('--nph-table-link-foreground'));
  });

  it('link in dark mode: theme/brand-200 through table/link-foreground', async () => {
    const frame = document.createElement('div');
    frame.setAttribute('data-nph-color-scheme', 'dark');
    document.body.append(frame);
    const element = await mount({ columns: [{ key: 'c', header: 'C' }], rows: [{ key: 'a', cells: { c: { type: 'link', text: 'Receipt', href: '#r' } } }] }, frame);
    const link = root(element).querySelector('a') as HTMLElement;
    expect(getComputedStyle(link).color).toBe(color('--nph-table-link-foreground', frame));
    expect(color('--nph-table-link-foreground', frame)).toBe(color('--nph-theme-brand-200', frame));
  });

  it('truncated: the cell is focusable, cut at the column width, with the whole text in the tooltip and in the name', async () => {
    const text = 'A long description that does not fit in the column';
    const { element, td } = await single({ type: 'truncated', text }, { width: '6rem' });
    expect(td.getAttribute('tabindex')).toBe('0');
    const cut = td.querySelector('.cut') as HTMLElement;
    expect(getComputedStyle(cut).textOverflow).toBe('ellipsis');
    expect(cut.scrollWidth).toBeGreaterThan(cut.clientWidth);
    const tooltip = td.querySelector('nph-tooltip') as HTMLElement;
    expect(tooltip.getAttribute('for')).toBe(td.id);
    expect(tooltip.getAttribute('relation')).toBe('name');
    expect(tooltip.getAttribute('text')).toBe(text);
    expect(root(element).getElementById(td.id)).toBe(td);
    expect((await axNode(td)).name).toBe(text);
  });

  it('truncated: keyboard focus draws the ring focus/border in table/focus-ring-width inside the cell, and opens the tooltip', async () => {
    const { td } = await single({ type: 'truncated', text: 'A long description that does not fit' }, { width: '6rem' });
    await userEvent.keyboard('{Tab}');
    const style = getComputedStyle(td);
    expect(style.outlineStyle).toBe('solid');
    expect(parseFloat(style.outlineWidth)).toBe(px('--nph-table-focus-ring-width'));
    expect(style.outlineColor).toBe(color('--nph-focus-border'));
    expect(parseFloat(style.outlineOffset)).toBe(-px('--nph-table-focus-ring-width'));
    await vi.waitFor(() => expect(td.querySelector('nph-tooltip')?.hasAttribute('open')).toBe(true));
  });

  it('truncated without a column width: renders, does not cut, and warns once in development', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { element } = await single({ type: 'truncated', text: 'Text' });
    element.grid = true;
    await element.updateComplete;
    expect(warn.mock.calls.filter(([message]) => String(message).includes('no width'))).toHaveLength(1);
  });

  for (const status of NPH_TABLE_STATUSES) {
    it(`status ${status}: the ${NPH_TABLE_STATUS_ICON[status]} icon in table/status-${status}-icon, with its name`, async () => {
      const { td } = await single({ type: 'status', status, text: status === 'success' ? 'Paid' : 'Failed' });
      const icon = td.querySelector('nph-icon') as HTMLElement;
      expect(icon.getAttribute('name')).toBe(NPH_TABLE_STATUS_ICON[status]);
      expect(getComputedStyle(td.querySelector('.status') as HTMLElement).color).toBe(color(`--nph-table-status-${status}-icon`));
      expect(td.querySelector('.text')?.textContent).toBe(status === 'success' ? 'Paid' : 'Failed');
      expect(getComputedStyle(td.querySelector('.text') as HTMLElement).color).toBe(color('--nph-table-foreground'));
    });
  }

  it('button: an nph-button secondary light compact, and the cell takes table/action-cell-padding-block', async () => {
    const { td } = await single({ type: 'button', text: 'Pay', action: 'pay' });
    const button = td.querySelector('nph-button') as HTMLElement;
    expect(['severity', 'emphasis', 'size', 'text'].map((name) => button.getAttribute(name))).toEqual(['secondary', 'light', 'compact', 'Pay']);
    expect(parseFloat(getComputedStyle(td).paddingTop)).toBe(px('--nph-table-action-cell-padding-block'));
  });

  it('actions: Edit and more as icon-only nph-button secondary ghost, 36 high, at table/cell-gap-tight, named per row', async () => {
    const { td } = await single({ type: 'actions', editLabel: 'Edit Ana Souza', moreLabel: 'More actions of Ana Souza' });
    const [edit, more] = [...td.querySelectorAll('nph-button')] as HTMLElement[];
    for (const [button, icon, label] of [
      [edit, NPH_TABLE_ICONS.edit, 'Edit Ana Souza'],
      [more, NPH_TABLE_ICONS.more, 'More actions of Ana Souza'],
    ] as const) {
      expect(['severity', 'emphasis', 'icon-start', 'label'].map((name) => (button as HTMLElement).getAttribute(name))).toEqual(['secondary', 'ghost', icon, label]);
      await vi.waitFor(() => expect(innerButton(button).getBoundingClientRect().height).toBe(px('--nph-control-height-default')));
    }
    expect(parseFloat(getComputedStyle(td.querySelector('.pieces') as HTMLElement).columnGap)).toBe(px('--nph-table-cell-gap-tight'));
  });

  it('mixed actions: a written Edit and the more as nph-button secondary light compact, at table/cell-gap', async () => {
    const { td } = await single({ type: 'mixed-actions', text: 'Edit', moreLabel: 'More actions of Ana Souza' });
    const [edit, more] = [...td.querySelectorAll('nph-button')] as HTMLElement[];
    expect(['severity', 'emphasis', 'size', 'text'].map((name) => (edit as HTMLElement).getAttribute(name))).toEqual(['secondary', 'light', 'compact', 'Edit']);
    expect(['severity', 'emphasis', 'size', 'icon-start', 'label'].map((name) => (more as HTMLElement).getAttribute(name))).toEqual([
      'secondary',
      'light',
      'compact',
      NPH_TABLE_ICONS.more,
      'More actions of Ana Souza',
    ]);
    await vi.waitFor(() => expect(innerButton(more).getBoundingClientRect().height).toBe(px('--nph-control-height-compact')));
    expect(parseFloat(getComputedStyle(td.querySelector('.pieces') as HTMLElement).columnGap)).toBe(px('--nph-table-cell-gap'));
  });

  it('rating: one solid star in table/rating-foreground and the score as a number', async () => {
    const { td } = await single({ type: 'rating', text: '4.8' });
    const star = td.querySelector('nph-icon') as HTMLElement;
    expect([star.getAttribute('name'), star.getAttribute('variant')]).toEqual(['star', 'solid']);
    expect(getComputedStyle(td.querySelector('.rating') as HTMLElement).color).toBe(color('--nph-table-rating-foreground'));
    expect(td.querySelector('.text')?.textContent).toBe('4.8');
  });

  it('loading: an nph-skeleton line in place of the content', async () => {
    const { td } = await single({ type: 'loading' });
    expect(td.querySelector('nph-skeleton')?.getAttribute('shape')).toBe('line');
  });
});

describe('events', () => {
  async function actions(): Promise<NphTable> {
    return mount({
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'pay', header: 'Pay' },
        { key: 'actions', header: 'Actions' },
        { key: 'mixed', header: 'Mixed' },
      ],
      rows: [
        {
          key: 'ana',
          cells: {
            name: 'Ana Souza',
            pay: { type: 'button', text: 'Pay', action: 'pay' },
            actions: { type: 'actions', editLabel: 'Edit Ana', moreLabel: 'More of Ana' },
            mixed: { type: 'mixed-actions', text: 'Edit', moreLabel: 'More of Ana' },
          },
        },
      ],
    });
  }

  it('each button of a cell fires nph-row-action with the row and the action', async () => {
    const element = await actions();
    const received: NphTableRowActionDetail[] = [];
    element.addEventListener('nph-row-action', (event) => received.push(event.detail));
    const buttons = [...root(element).querySelectorAll('nph-button')];
    for (const button of buttons) innerButton(button).click();
    expect(received).toEqual([
      { row: 'ana', action: 'pay' },
      { row: 'ana', action: 'edit' },
      { row: 'ana', action: 'more' },
      { row: 'ana', action: 'edit' },
      { row: 'ana', action: 'more' },
    ]);
  });

  it('nph-row-action bubbles and is not composed', async () => {
    const element = await actions();
    const parent = document.createElement('div');
    element.before(parent);
    parent.append(element);
    let event: CustomEvent | null = null;
    parent.addEventListener('nph-row-action', (received) => (event = received));
    innerButton(root(element).querySelector('nph-button')).click();
    expect(event).not.toBeNull();
    expect((event as unknown as CustomEvent).bubbles).toBe(true);
    expect((event as unknown as CustomEvent).composed).toBe(false);
  });

  it('the keyboard activates a cell button too', async () => {
    const element = await actions();
    const received: string[] = [];
    element.addEventListener('nph-row-action', (event) => received.push(event.detail.action));
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Enter}');
    expect(received).toEqual(['pay']);
  });

  it('setting rows from code fires nothing', async () => {
    const element = await mount();
    const listener = vi.fn();
    element.addEventListener('nph-row-action', listener);
    element.addEventListener('nph-row-toggle', listener);
    element.rows = [...ROWS].reverse();
    await element.updateComplete;
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('expanding row', () => {
  const rows: NphTableRow[] = [
    {
      key: 'order-1',
      cells: { unit: 'Order 1', amount: 120 },
      toggleLabel: 'Details of order 1',
      detail: {
        name: 'Blue mug',
        description: 'Ceramic, 300 ml',
        src: IMAGE,
        alt: 'Blue mug',
        values: [
          { label: 'Quantity', value: '2' },
          { label: 'Price', value: '60' },
        ],
        badge: { text: 'In stock', severity: 'success' },
      },
    },
    { key: 'order-2', cells: { unit: 'Order 2', amount: 80 } },
  ];

  it('a chevron column comes first; a row without detail keeps its place empty', async () => {
    const element = await mount({ rows });
    const [first, second] = bodyRows(element) as HTMLTableRowElement[];
    expect((first as HTMLTableRowElement).cells[0]?.classList.contains('chevron-column')).toBe(true);
    expect((first as HTMLTableRowElement).cells[0]?.querySelector('nph-button')).not.toBeNull();
    expect((second as HTMLTableRowElement).cells[0]?.querySelector('nph-button')).toBeNull();
    expect(table(element).querySelector('thead td.chevron-column')).not.toBeNull();
  });

  it('the chevron column is only as wide as the chevron and its sides; the first data column starts after it', async () => {
    const element = await mount({ rows });
    const td = bodyRows(element)[0]?.cells[0] as HTMLTableCellElement;
    const button = innerButton(td.querySelector('.chevron'));
    await vi.waitFor(() => expect(button.getBoundingClientRect().width).toBeGreaterThan(0));
    const expected = button.getBoundingClientRect().width + 2 * px('--nph-table-cell-padding-inline');
    expect(td.getBoundingClientRect().width).toBeCloseTo(expected, 0);
    const first = cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[0] as HTMLElement;
    expect(first.getBoundingClientRect().left).toBeCloseTo(td.getBoundingClientRect().right, 0);
  });

  it('the chevron is an icon-only nph-button secondary ghost compact, closed to the right, named by toggleLabel', async () => {
    const element = await mount({ rows });
    const chevron = root(element).querySelector('.chevron') as HTMLElement;
    expect(['severity', 'emphasis', 'size', 'icon-start', 'label', 'aria-expanded'].map((name) => chevron.getAttribute(name))).toEqual([
      'secondary',
      'ghost',
      'compact',
      'chevron-right',
      'Details of order 1',
      'false',
    ]);
    await vi.waitFor(() => expect(innerButton(chevron).getBoundingClientRect().height).toBe(px('--nph-control-height-compact')));
  });

  it('the chevron opens the expanded item under the row, points down and fires nph-row-toggle', async () => {
    const element = await mount({ rows });
    const received: NphTableRowToggleDetail[] = [];
    element.addEventListener('nph-row-toggle', (event) => received.push(event.detail));
    innerButton(root(element).querySelector('.chevron')).click();
    await element.updateComplete;
    expect(received).toEqual([{ row: 'order-1', open: true }]);
    const chevron = root(element).querySelector('.chevron') as HTMLElement;
    expect(chevron.getAttribute('icon-start')).toBe('chevron-down');
    expect(chevron.getAttribute('aria-expanded')).toBe('true');
    const detail = root(element).querySelector('tr.detail') as HTMLTableRowElement;
    expect(detail.previousElementSibling).toBe(bodyRows(element)[0]);
    expect(chevron.getAttribute('aria-controls')).toBe(detail.id);
    expect((detail.cells[0] as HTMLTableCellElement).colSpan).toBe(3);
  });

  it('opening replaces rows with a new list where only that row changed; the consumer list stays as it was', async () => {
    const element = await mount({ rows });
    innerButton(root(element).querySelector('.chevron')).click();
    await element.updateComplete;
    expect(element.rows).not.toBe(rows);
    expect(element.rows[0]?.open).toBe(true);
    expect(rows[0]?.open).toBeUndefined();
    expect(element.rows[1]).toBe(rows[1]);
    innerButton(root(element).querySelector('.chevron')).click();
    await element.updateComplete;
    expect(element.rows[0]?.open).toBe(false);
    expect(root(element).querySelector('tr.detail')).toBeNull();
  });

  it('the expanded item: photo nph-image lg, name, description, values with the label on top, and badge', async () => {
    const element = await mount({ rows: [{ ...(rows[0] as NphTableRow), open: true }] });
    const item = root(element).querySelector('tr.detail .item') as HTMLElement;
    const image = item.querySelector('nph-image') as HTMLElement;
    expect([image.getAttribute('size'), image.getAttribute('src'), image.getAttribute('alt')]).toEqual(['lg', IMAGE, 'Blue mug']);
    await vi.waitFor(() => expect(image.getBoundingClientRect().width).toBe(px('--nph-table-thumbnail-size-large')));
    expect(item.querySelector('.name')?.textContent).toBe('Blue mug');
    expect(item.querySelector('.secondary')?.textContent).toBe('Ceramic, 300 ml');
    const values = [...item.querySelectorAll('.value')].map((value) => [value.querySelector('dt')?.textContent, value.querySelector('dd')?.textContent]);
    expect(values).toEqual([
      ['Quantity', '2'],
      ['Price', '60'],
    ]);
    const label = item.querySelector('dt') as HTMLElement;
    const value = item.querySelector('dd') as HTMLElement;
    expect(label.getBoundingClientRect().bottom).toBeLessThanOrEqual(value.getBoundingClientRect().top + 0.5);
    const badge = item.querySelector('nph-badge') as HTMLElement;
    expect([badge.getAttribute('emphasis'), badge.getAttribute('severity'), badge.getAttribute('text')]).toEqual(['light', 'success', 'In stock']);
  });

  it('a row that loads shows the chevron loading, and the click does not open it', async () => {
    const element = await mount({ rows: [{ ...(rows[0] as NphTableRow), loading: true }] });
    const chevron = root(element).querySelector('.chevron') as HTMLElement;
    expect(chevron.hasAttribute('loading')).toBe(true);
    const listener = vi.fn();
    element.addEventListener('nph-row-toggle', listener);
    innerButton(chevron).click();
    await element.updateComplete;
    expect(listener).not.toHaveBeenCalled();
    expect(root(element).querySelector('tr.detail')).toBeNull();
  });
});

describe('tree', () => {
  const tree: NphTableRow[] = [
    {
      key: 'south',
      cells: { unit: 'South region', amount: 30 },
      toggleLabel: 'Units of the South region',
      children: [
        {
          key: 'porto',
          cells: { unit: 'Porto Alegre', amount: 20 },
          toggleLabel: 'Units of Porto Alegre',
          children: [{ key: 'downtown', cells: { unit: 'Downtown', amount: 20 } }],
        },
        { key: 'curitiba', cells: { unit: 'Curitiba', amount: 10 } },
      ],
    },
    { key: 'north', cells: { unit: 'North region', amount: 5 } },
  ];

  it('closed, only the first level shows, each row with aria-level 1', async () => {
    const element = await mount({ rows: tree });
    expect(bodyRows(element).map((row) => [cellsOf(row)[0]?.textContent?.trim(), row.getAttribute('aria-level')])).toEqual([
      ['South region', '1'],
      ['North region', '1'],
    ]);
    expect(table(element).querySelector('td.chevron-column')).toBeNull();
  });

  it('the chevron sits in the first cell; without children the space of the chevron stays, so the text aligns', async () => {
    const element = await mount({ rows: tree });
    const [south, north] = bodyRows(element) as HTMLTableRowElement[];
    expect(cellsOf(south as HTMLTableRowElement)[0]?.querySelector('.chevron')).not.toBeNull();
    const spacer = cellsOf(north as HTMLTableRowElement)[0]?.querySelector('.tree-spacer') as HTMLElement;
    expect(spacer.getBoundingClientRect().width).toBe(px('--nph-table-expand-indent'));
    const left = (row: HTMLTableRowElement) => (cellsOf(row)[0]?.querySelector('.text') as HTMLElement).getBoundingClientRect().left;
    expect(left(north as HTMLTableRowElement)).toBe(left(south as HTMLTableRowElement));
  });

  it('open, the levels show under their parent, each indented by table/expand-indent plus table/cell-gap', async () => {
    const element = await mount({
      rows: [{ ...(tree[0] as NphTableRow), open: true, children: [{ ...(tree[0]?.children?.[0] as NphTableRow), open: true }, tree[0]?.children?.[1] as NphTableRow] }, tree[1] as NphTableRow],
    });
    const rows = bodyRows(element);
    expect(rows.map((row) => [cellsOf(row)[0]?.textContent?.trim(), row.getAttribute('aria-level')])).toEqual([
      ['South region', '1'],
      ['Porto Alegre', '2'],
      ['Downtown', '3'],
      ['Curitiba', '2'],
      ['North region', '1'],
    ]);
    const step = px('--nph-table-expand-indent') + px('--nph-table-cell-gap');
    const left = (row: HTMLTableRowElement) => (cellsOf(row)[0]?.querySelector('.text') as HTMLElement).getBoundingClientRect().left;
    const base = left(rows[0] as HTMLTableRowElement);
    expect(left(rows[1] as HTMLTableRowElement) - base).toBeCloseTo(step, 1);
    expect(left(rows[2] as HTMLTableRowElement) - base).toBeCloseTo(2 * step, 1);
    expect(left(rows[3] as HTMLTableRowElement) - base).toBeCloseTo(step, 1);
  });

  it('the chevron of a level opens it and fires nph-row-toggle with its key', async () => {
    const element = await mount({ rows: tree });
    const received: NphTableRowToggleDetail[] = [];
    element.addEventListener('nph-row-toggle', (event) => received.push(event.detail));
    innerButton(root(element).querySelector('.chevron')).click();
    await element.updateComplete;
    expect(received).toEqual([{ row: 'south', open: true }]);
    expect(bodyRows(element)).toHaveLength(4);
    const chevron = root(element).querySelector('.chevron') as HTMLElement;
    expect([chevron.getAttribute('icon-start'), chevron.getAttribute('aria-expanded')]).toEqual(['chevron-down', 'true']);
    const nested = bodyRows(element)[1]?.querySelector('.chevron') as HTMLElement;
    innerButton(nested).click();
    await element.updateComplete;
    expect(received.at(-1)).toEqual({ row: 'porto', open: true });
    expect(bodyRows(element).map((row) => row.getAttribute('aria-level'))).toEqual(['1', '2', '3', '2', '1']);
  });
});

describe('empty body', () => {
  it('with no row, the body holds the nph-empty and the header stays visible', async () => {
    const element = await mount({ rows: [], emptyHeading: 'No payment found', emptyDescription: 'Change the filters.' });
    expect(table(element).querySelectorAll('thead th')).toHaveLength(2);
    const td = root(element).querySelector('tr.empty td') as HTMLTableCellElement;
    expect(td.colSpan).toBe(2);
    const empty = td.querySelector('nph-empty') as HTMLElement;
    expect([empty.getAttribute('heading'), empty.getAttribute('description')]).toEqual(['No payment found', 'Change the filters.']);
    expect(parseFloat(getComputedStyle(td).paddingTop)).toBe(px('--nph-table-empty-padding'));
    expect(parseFloat(getComputedStyle(td).paddingBottom)).toBe(px('--nph-table-empty-padding'));
  });

  it('with no row and no empty-heading, the body is blank and the table reports it', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ rows: [] });
    expect(root(element).querySelector('nph-empty')).toBeNull();
    expect(error.mock.calls.filter(([message]) => String(message).includes('empty-heading'))).toHaveLength(1);
  });
});

describe('invalid input', () => {
  function errors(spy: ReturnType<typeof vi.spyOn>): string[] {
    return spy.mock.calls.map(([message]: unknown[]) => String(message));
  }

  for (const [name, props, fragment] of [
    ['a size outside the two', { size: 'small' as never }, 'size "small"'],
    ['no column', { columns: [] }, 'columns is empty'],
    ['a column without a key', { columns: [{ key: '', header: 'X' }] }, 'no key'],
    ['a repeated column key', { columns: [{ key: 'a', header: 'A' }, { key: 'a', header: 'B' }] }, 'repeats'],
    ['a column without a header', { columns: [{ key: 'a', header: ' ' }] }, 'no header'],
    ['an align outside the two', { columns: [{ key: 'a', header: 'A', align: 'left' as never }] }, 'align "left"'],
  ] as const) {
    it(`${name}: renders nothing and reports it once`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const element = await mount(props as Props);
      element.striped = true;
      await element.updateComplete;
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect(root(element).querySelector('table')).toBeNull();
      expect(getComputedStyle(element).display).toBe('none');
      expect(errors(error).filter((message) => message.includes(fragment))).toHaveLength(1);
    });
  }

  for (const [name, row, fragment] of [
    ['a row without a key', { key: '', cells: { unit: 'X' } }, 'a row has no key'],
    ['a row with detail and children', { key: 'x', cells: {}, toggleLabel: 'X', detail: { name: 'X' }, children: [] }, 'both detail and children'],
    ['a row that opens without toggleLabel', { key: 'x', cells: {}, detail: { name: 'X' } }, 'no toggleLabel'],
    ['a detail without a name', { key: 'x', cells: {}, toggleLabel: 'X', detail: { name: '' } }, 'has no name'],
  ] as const) {
    it(`${name}: the row is left out and the rest of the table renders`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const element = await mount({ rows: [row as unknown as NphTableRow, ROWS[0] as NphTableRow] });
      expect(bodyRows(element)).toHaveLength(1);
      expect(errors(error).filter((message) => message.includes(fragment))).toHaveLength(1);
    });
  }

  it('a repeated row key: the repeated row is left out', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ rows: [ROWS[0] as NphTableRow, ROWS[0] as NphTableRow] });
    expect(bodyRows(element)).toHaveLength(1);
    expect(errors(error).filter((message) => message.includes('repeats'))).toHaveLength(1);
  });

  it('children below the third level: the row is left out', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const deep: NphTableRow = {
      key: 'l1',
      cells: { unit: '1' },
      toggleLabel: 'Open 1',
      open: true,
      children: [
        {
          key: 'l2',
          cells: { unit: '2' },
          toggleLabel: 'Open 2',
          open: true,
          children: [{ key: 'l3', cells: { unit: '3' }, toggleLabel: 'Open 3', children: [{ key: 'l4', cells: { unit: '4' } }] }],
        },
      ],
    };
    const element = await mount({ rows: [deep] });
    expect(bodyRows(element).map((row) => cellsOf(row)[0]?.textContent?.trim())).toEqual(['1', '2']);
    expect(errors(error).filter((message) => message.includes('3 levels'))).toHaveLength(1);
  });

  for (const [name, cell, fragment] of [
    ['an unknown type', { type: 'category', text: 'X' }, 'type "category"'],
    ['a text cell without text', { type: 'text', text: '' }, 'needs text'],
    ['a badge severity outside the list', { type: 'badge', text: 'X', severity: 'pink' }, 'severity "pink"'],
    ['an icon outside the core', { type: 'icon-text', icon: 'unicorn', text: 'X' }, 'icon "unicorn"'],
    ['a status outside the two', { type: 'status', status: 'warning', text: 'X' }, 'status "warning"'],
    ['a button without action', { type: 'button', text: 'Pay', action: '' }, 'text and action'],
    ['actions without names', { type: 'actions', editLabel: 'Edit', moreLabel: '' }, 'editLabel and moreLabel'],
    ['a link without href', { type: 'link', text: 'Receipt', href: '' }, 'text and href'],
    ['a number that is not finite', Number.NaN, 'not finite'],
  ] as const) {
    it(`${name}: the cell is drawn blank and the table reports it once`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const element = await mount({ columns: [{ key: 'c', header: 'C' }], rows: [{ key: 'a', cells: { c: cell as never } }] });
      element.striped = true;
      await element.updateComplete;
      const td = cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[0] as HTMLElement;
      expect(td.children).toHaveLength(0);
      expect(td.textContent?.trim()).toBe('');
      expect(errors(error).filter((message) => message.includes(fragment))).toHaveLength(1);
    });
  }
});

describe('regressions of the review of PR 119', () => {
  it('a row keeps its elements, and the focus on its chevron, when a row comes in before it', async () => {
    const tree: NphTableRow[] = [
      { key: 'south', cells: { unit: 'South', amount: 1 }, toggleLabel: 'Units of South', children: [] },
      { key: 'north', cells: { unit: 'North', amount: 2 } },
    ];
    const element = await mount({ rows: tree });
    const south = bodyRows(element)[0] as HTMLTableRowElement;
    const chevron = south.querySelector('.chevron') as HTMLElement;
    innerButton(chevron).focus();
    element.rows = [{ key: 'east', cells: { unit: 'East', amount: 3 } }, ...tree];
    await element.updateComplete;
    expect(bodyRows(element)[1]).toBe(south);
    expect(cellsOf(south)[0]?.textContent?.trim()).toBe('South');
    expect(root(element).activeElement).toBe(chevron);
    const received: NphTableRowToggleDetail[] = [];
    element.addEventListener('nph-row-toggle', (event) => received.push(event.detail));
    innerButton(chevron).click();
    expect(received).toEqual([{ row: 'south', open: true }]);
  });

  it('a table moved into a narrower box becomes a focusable region there', async () => {
    const wide: NphTableColumn[] = Array.from({ length: 8 }, (_, index) => ({ key: `c${index}`, header: `Column number ${index}` }));
    const rows: NphTableRow[] = [{ key: 'a', cells: Object.fromEntries(wide.map((column) => [column.key, 'Some long value'])) }];
    const roomy = document.createElement('div');
    roomy.style.inlineSize = '200rem';
    document.body.append(roomy);
    const element = await mount({ columns: wide, rows }, roomy);
    expect(scrollArea(element).hasAttribute('tabindex')).toBe(false);
    const narrow = document.createElement('div');
    narrow.style.inlineSize = '20rem';
    document.body.append(narrow);
    narrow.append(element);
    await vi.waitFor(() => expect(scrollArea(element).getAttribute('tabindex')).toBe('0'));
  });

  it('a size that becomes valid draws the rows again', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ size: 'small' as never });
    expect(root(element).querySelector('table')).toBeNull();
    element.size = 'default';
    await element.updateComplete;
    expect(bodyRows(element)).toHaveLength(ROWS.length);
  });

  it('an entry that is not a row does not break the chevron of the others', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({
      rows: [null as unknown as NphTableRow, { key: 'a', cells: { unit: 'A', amount: 1 }, toggleLabel: 'Details of A', detail: { name: 'Item A' } }],
    });
    innerButton(root(element).querySelector('.chevron')).click();
    await element.updateComplete;
    expect(root(element).querySelector('tr.detail')).not.toBeNull();
    expect(element.rows[0]).toBeNull();
  });
});

describe('regressions of the second review of PR 119', () => {
  for (const href of ['javascript:alert(document.domain)', 'java\nscript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,<p>x</p>', 'vbscript:msgbox(1)']) {
    it(`a link cell with the href ${JSON.stringify(href)} is drawn blank and reported`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const element = await mount({ columns: [{ key: 'c', header: 'C' }], rows: [{ key: 'a', cells: { c: { type: 'link', text: 'Receipt', href } } }] });
      expect(root(element).querySelector('a')).toBeNull();
      expect(error.mock.calls.filter(([message]) => String(message).includes('is not an http'))).toHaveLength(1);
    });
  }

  for (const href of ['https://example.com/r', 'http://example.com', 'mailto:ana@example.com', 'tel:+5511999999999', '/receipts/1', 'receipts/1', '#receipt', '?page=2']) {
    it(`a link cell with the href ${JSON.stringify(href)} renders`, async () => {
      const element = await mount({ columns: [{ key: 'c', header: 'C' }], rows: [{ key: 'a', cells: { c: { type: 'link', text: 'Receipt', href } } }] });
      expect(root(element).querySelector('a')?.getAttribute('href')).toBe(href);
    });
  }

  it('a loading cell in the first column of a tree shows its skeleton with a width', async () => {
    const element = await mount({ rows: [{ key: 'a', cells: { unit: { type: 'loading' }, amount: 1 }, toggleLabel: 'Open A', children: [] }] });
    const skeleton = root(element).querySelector('.tree nph-skeleton') as HTMLElement;
    await vi.waitFor(() => expect(skeleton.getBoundingClientRect().width).toBeGreaterThan(0));
  });

  it('a loading cell is busy, and stops being busy when the value arrives', async () => {
    const element = await mount({ rows: [{ key: 'a', cells: { unit: 'A', amount: { type: 'loading' } } }] });
    const td = cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[1] as HTMLElement;
    expect(td.getAttribute('aria-busy')).toBe('true');
    expect(cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[0]?.hasAttribute('aria-busy')).toBe(false);
    element.rows = [{ key: 'a', cells: { unit: 'A', amount: 10 } }];
    await element.updateComplete;
    expect(cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[1]?.hasAttribute('aria-busy')).toBe(false);
  });
});

describe('regression of the third review of PR 119', () => {
  it('a focused button keeps its column, and its action, when a column comes in before it', async () => {
    const pay: NphTableColumn = { key: 'pay', header: 'Pay' };
    const refund: NphTableColumn = { key: 'refund', header: 'Refund' };
    const element = await mount({
      columns: [pay, refund],
      rows: [{ key: 'ana', cells: { pay: { type: 'button', text: 'Pay', action: 'pay' }, refund: { type: 'button', text: 'Refund', action: 'refund' }, note: 'x' } }],
    });
    const button = cellsOf(bodyRows(element)[0] as HTMLTableRowElement)[0]?.querySelector('nph-button') as HTMLElement;
    innerButton(button).focus();
    element.columns = [{ key: 'note', header: 'Note' }, pay, refund];
    await element.updateComplete;
    expect(root(element).activeElement).toBe(button);
    expect(button.getAttribute('text')).toBe('Pay');
    const received: string[] = [];
    element.addEventListener('nph-row-action', (event) => received.push(event.detail.action));
    innerButton(button).click();
    expect(received).toEqual(['pay']);
  });
});

describe('regression of the fourth review of PR 119', () => {
  it('a rejected row adds no chevron column and no tree indent to the valid rows', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({
      rows: [
        { key: 'bad', cells: { unit: 'Bad' }, toggleLabel: 'Bad', detail: { name: 'Bad' }, children: [] },
        { key: 'good', cells: { unit: 'Good', amount: 1 } },
      ],
    });
    expect(bodyRows(element).map((row) => cellsOf(row)[0]?.textContent?.trim())).toEqual(['Good']);
    expect(root(element).querySelector('.chevron-column')).toBeNull();
    expect(root(element).querySelector('.tree')).toBeNull();
    expect(bodyRows(element)[0]?.hasAttribute('aria-level')).toBe(false);
  });

  it('the valid descendants of a closed level still shape the table, and those of a rejected row do not', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({
      rows: [
        {
          key: 'closed',
          cells: { unit: 'Closed', amount: 1 },
          toggleLabel: 'Open closed',
          children: [{ key: 'child', cells: { unit: 'Child', amount: 1 }, toggleLabel: 'Details of child', detail: { name: 'Item' } }],
        },
        { key: 'rejected', cells: { unit: 'Rejected' }, children: [{ key: 'orphan', cells: { unit: 'Orphan' }, toggleLabel: 'X', detail: { name: 'X' } }] },
      ],
    });
    /* The closed level holds a row with detail: the chevron column is there before it opens. */
    expect(root(element).querySelector('thead .chevron-column')).not.toBeNull();
    expect(bodyRows(element).map((row) => cellsOf(row)[0]?.textContent?.trim())).toEqual(['Closed']);
  });
});

describe('color schemes', () => {
  it('in dark mode the header is color/muted through table/header-background, and the stripe core/surface/800', async () => {
    const frame = document.createElement('div');
    frame.setAttribute('data-nph-color-scheme', 'dark');
    document.body.append(frame);
    const element = await mount({ striped: true }, frame);
    const th = table(element).querySelector('thead th') as HTMLElement;
    expect(getComputedStyle(th).backgroundColor).toBe(resolved('background-color', '--nph-color-muted', frame));
    expect(getComputedStyle(cellsOf(bodyRows(element)[1] as HTMLTableRowElement)[0] as HTMLElement).backgroundColor).toBe(
      resolved('background-color', '--nph-table-row-striped-background', frame),
    );
    expect(getComputedStyle(element).color).toBe(color('--nph-table-foreground', frame));
  });

  it('in light mode the header and the stripe take the same surface', async () => {
    const element = await mount({ striped: true });
    expect(resolved('background-color', '--nph-table-header-background')).toBe(resolved('background-color', '--nph-table-row-striped-background'));
    expect(getComputedStyle(table(element).querySelector('thead th') as HTMLElement).backgroundColor).toBe(
      resolved('background-color', '--nph-table-header-background'),
    );
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css, and these are the ones the contract names', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(new Set(used)).toEqual(
      new Set([
        '--nph-table-max-width',
        '--nph-table-foreground',
        '--nph-table-background',
        '--nph-table-muted-foreground',
        '--nph-table-caption-foreground',
        '--nph-table-header-background',
        '--nph-table-row-striped-background',
        '--nph-table-row-hover-background',
        '--nph-table-border',
        '--nph-table-border-width',
        '--nph-table-radius',
        '--nph-table-link-foreground',
        '--nph-table-status-success-icon',
        '--nph-table-status-error-icon',
        '--nph-table-rating-foreground',
        '--nph-table-row-height',
        '--nph-table-row-height-large',
        '--nph-table-cell-padding-block',
        '--nph-table-cell-padding-inline',
        '--nph-table-action-cell-padding-block',
        '--nph-table-container-padding',
        '--nph-table-cell-gap',
        '--nph-table-cell-gap-tight',
        '--nph-table-stack-gap',
        '--nph-table-empty-padding',
        '--nph-table-caption-max-width',
        '--nph-table-caption-action-gap',
        '--nph-table-body-max-height',
        '--nph-table-expand-indent',
        '--nph-table-icon-size',
        '--nph-table-focus-ring-width',
        '--nph-table-sticky-divider-color',
        '--nph-table-sticky-divider-width',
        '--nph-table-sticky-divider-spread',
        '--nph-table-sticky-divider-blur',
        '--nph-table-scrollbar-radius',
        '--nph-table-scrollbar-thumb',
        '--nph-table-scrollbar-track',
        '--nph-table-scrollbar-width',
        '--nph-focus-border',
        '--nph-text-body-md-font-family',
        '--nph-text-body-md-font-size',
        '--nph-text-body-md-font-weight',
        '--nph-text-body-md-line-height',
        '--nph-text-body-md-letter-spacing',
        '--nph-text-body-sm-font-family',
        '--nph-text-body-sm-font-size',
        '--nph-text-body-sm-font-weight',
        '--nph-text-body-sm-line-height',
        '--nph-text-body-sm-letter-spacing',
        '--nph-text-heading-xs-font-family',
        '--nph-text-heading-xs-font-size',
        '--nph-text-heading-xs-font-weight',
        '--nph-text-heading-xs-line-height',
        '--nph-text-heading-xs-letter-spacing',
        '--nph-text-heading-sm-font-family',
        '--nph-text-heading-sm-font-size',
        '--nph-text-heading-sm-font-weight',
        '--nph-text-heading-sm-line-height',
        '--nph-text-heading-sm-letter-spacing',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('the table/* tokens it does not consume directly are the ones nph-image carries, with the same values', () => {
    for (const name of ['thumbnail-size', 'thumbnail-size-large', 'thumbnail-radius', 'muted-background']) {
      expect(tokensCss).toContain(`--nph-table-${name}:`);
      expect(cssWithoutComments).not.toContain(`--nph-table-${name}`);
    }
    expect(px('--nph-table-thumbnail-size')).toBe(px('--nph-image-size-sm'));
    expect(px('--nph-table-thumbnail-size-large')).toBe(px('--nph-image-size-lg'));
    expect(px('--nph-table-thumbnail-radius')).toBe(px('--nph-image-radius-sm'));
    expect(resolved('background-color', '--nph-table-muted-background')).toBe(resolved('background-color', '--nph-image-background'));
  });

  it('never consumes a core or theme layer directly', () => {
    expect(cssWithoutComments).not.toMatch(/--nph-core-/);
    expect(cssWithoutComments).not.toMatch(/--nph-theme-/);
  });

  it('the CSS has no literal design value and no motion of its own', () => {
    /* The box relations written: `100%`, the `50%` of the clip and the multipliers of calc. */
    const withoutRelations = cssWithoutComments.replace(/\b(100|50)%/g, '').replace(/calc\((-1|2) \*/g, 'calc(');
    expect(withoutRelations).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(withoutRelations).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(withoutRelations).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
    expect(withoutRelations).not.toMatch(/\b(animation|transition|@keyframes)\b/);
  });
});
