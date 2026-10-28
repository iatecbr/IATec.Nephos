/**
 * Tests of `nph-pagination` (P99), in a real browser (P21, item 5): hover, keyboard focus,
 * the top layer of the balloon and of the list, and the measures only exist where there is
 * layout.
 *
 * They prove the contract accepted in Figma (board `1640:196`, set `1640:194`), recorded in
 * the evidence of the `figma-docs-accepted` gate of DSA-54, with the pending decisions D-1 to
 * D-5 in their default: the API, the invalid input, the six types, the window of numbers, the
 * position text, the arrows and their destinations, the event, items per page, go to page,
 * the roles and names the browser computes, the colors and measures of each state, the focus,
 * and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-pagination.css?raw';
import { NPH_PAGINATION_CHANGE_EVENT, NPH_PAGINATION_TYPES, NphPagination, pageSlots } from './nph-pagination';
import type { NphPaginationChangeDetail } from './nph-pagination';
import type { NphIcon } from '../nph-icon/nph-icon';
import type { NphInput } from '../nph-input/nph-input';
import type { NphSelect } from '../nph-select/nph-select';
import type { NphTooltip } from '../nph-tooltip/nph-tooltip';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.load('600 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const LABELS = {
  label: 'Pagination',
  pageLabel: 'Page {page}',
  firstLabel: 'First page',
  previousLabel: 'Previous page',
  nextLabel: 'Next page',
  lastLabel: 'Last page',
};

async function mount(props: Partial<NphPagination> = {}): Promise<NphPagination> {
  const pagination = document.createElement('nph-pagination');
  Object.assign(pagination, { ...LABELS, pageCount: 10, ...props });
  document.body.append(pagination);
  await settle(pagination);
  return pagination;
}

async function settle(pagination: NphPagination): Promise<void> {
  await pagination.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  for (const inner of pagination.shadowRoot?.querySelectorAll('nph-icon, nph-tooltip, nph-select, nph-option, nph-input') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
}

const root = (pagination: NphPagination): ShadowRoot => pagination.shadowRoot as ShadowRoot;
const nav = (pagination: NphPagination): HTMLElement | null => root(pagination).querySelector('nav');
const bar = (pagination: NphPagination): HTMLElement => root(pagination).querySelector('.bar') as HTMLElement;
const pages = (pagination: NphPagination): HTMLButtonElement[] => [...root(pagination).querySelectorAll<HTMLButtonElement>('.page')];
const current = (pagination: NphPagination): HTMLButtonElement | null => root(pagination).querySelector('.page[aria-current="page"]');
const arrow = (pagination: NphPagination, which: string): HTMLButtonElement | null => root(pagination).querySelector(`#${which}`);
const position = (pagination: NphPagination): string =>
  [...root(pagination).querySelectorAll('.position')].map((element) => element.textContent?.trim() ?? '').join(' | ');
/** The numbers and the ellipses, in order, as the person reads them. */
const slots = (pagination: NphPagination): string[] =>
  [...root(pagination).querySelectorAll('.page, .ellipsis')].map((element) =>
    element.classList.contains('ellipsis') ? '…' : (element.textContent?.trim() ?? ''),
  );

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));

/** The node the browser itself builds for an element in its accessibility tree (as in `nph-sidebar-item`). */
async function axNode(element: Element): Promise<{ role: string; name: string; description: string }> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    const node = nodes[0];
    return {
      role: String(node?.role?.value ?? ''),
      name: String(node?.name?.value ?? ''),
      description: String(node?.description?.value ?? ''),
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

function listen(pagination: NphPagination): NphPaginationChangeDetail[] {
  const seen: NphPaginationChangeDetail[] = [];
  pagination.addEventListener(NPH_PAGINATION_CHANGE_EVENT, (event) => seen.push(event.detail));
  return seen;
}

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-pagination')).toBe(NphPagination);
    expect(document.createElement('nph-pagination')).toBeInstanceOf(NphPagination);
  });

  it('the public API is exactly P99', () => {
    const declared = [...(NphPagination as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(
      [
        'firstLabel',
        'goToLabel',
        'goToPage',
        'label',
        'lastLabel',
        'nextLabel',
        'page',
        'pageCount',
        'pageLabel',
        'pageSize',
        'pageSizeLabel',
        'pageSizes',
        'positionText',
        'previousLabel',
        'totalItems',
        'type',
      ].sort(),
    );
    expect([...NPH_PAGINATION_TYPES]).toEqual(['numbered', 'simple', 'edges', 'range', 'compact', 'table']);
    expect(NPH_PAGINATION_CHANGE_EVENT).toBe('nph-page-change');
  });

  it('has the defaults of the set: numbered, on the first page', () => {
    const pagination = document.createElement('nph-pagination');
    expect(pagination.type).toBe('numbered');
    expect(pagination.page).toBe(1);
    expect(pagination.pageCount).toBeNull();
    expect(pagination.goToPage).toBe(false);
    expect(pagination.pageSizes).toEqual([]);
  });

  it('reads the attributes, page-sizes as a list', async () => {
    document.body.innerHTML = `<nph-pagination type="table" page="3" total-items="250" page-size="25" page-sizes="[10, 25, 50]"
      label="Pagination" page-label="Page {page}" first-label="First" previous-label="Previous" next-label="Next" last-label="Last"
      position-text="{start}–{end} of {total}" page-size-label="Items per page"></nph-pagination>`;
    const pagination = document.querySelector('nph-pagination') as NphPagination;
    await settle(pagination);
    expect(pagination.page).toBe(3);
    expect(pagination.pageSizes).toEqual([10, 25, 50]);
    expect(pagination.hasAttribute('data-nph-rendered')).toBe(true);
    expect(position(pagination)).toBe('51–75 of 250');
  });

  it('page reflects, and so does type', async () => {
    const pagination = await mount({ page: 4 });
    expect(pagination.getAttribute('page')).toBe('4');
    expect(pagination.getAttribute('type')).toBe('numbered');
  });

  it('has no slot and no part', async () => {
    const pagination = await mount();
    expect(root(pagination).querySelector('slot')).toBeNull();
    expect(root(pagination).querySelector('[part]')).toBeNull();
  });
});

describe('the window of numbers', () => {
  it('shows every page up to seven', () => {
    expect(pageSlots(1, 1)).toEqual([1]);
    expect(pageSlots(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('above seven, always seven slots: start, middle and end', () => {
    expect(pageSlots(1, 10)).toEqual([1, 2, 3, 4, 5, 'gap-end', 10]);
    expect(pageSlots(4, 10)).toEqual([1, 2, 3, 4, 5, 'gap-end', 10]);
    expect(pageSlots(5, 10)).toEqual([1, 'gap-start', 4, 5, 6, 'gap-end', 10]);
    expect(pageSlots(6, 10)).toEqual([1, 'gap-start', 5, 6, 7, 'gap-end', 10]);
    expect(pageSlots(7, 10)).toEqual([1, 'gap-start', 6, 7, 8, 9, 10]);
    expect(pageSlots(10, 10)).toEqual([1, 'gap-start', 6, 7, 8, 9, 10]);
    for (let page = 1; page <= 40; page += 1) {
      expect(pageSlots(page, 40)).toHaveLength(7);
      expect(pageSlots(page, 40)).toContain(page);
    }
  });

  it('the first and the last page are always shown', async () => {
    const pagination = await mount({ page: 5 });
    expect(slots(pagination)).toEqual(['1', '…', '4', '5', '6', '…', '10']);
  });

  it('the bar keeps its width from the start to the middle (the do of the evidence)', async () => {
    const pagination = await mount({ page: 2, pageCount: 20 });
    const start = bar(pagination).getBoundingClientRect().width;
    pagination.page = 10;
    await settle(pagination);
    const middle = bar(pagination).getBoundingClientRect().width;
    expect(Math.abs(middle - start)).toBeLessThanOrEqual(1);
  });

  it('the ellipsis takes no click and is hidden from the screen reader', async () => {
    const pagination = await mount({ page: 5 });
    const ellipsis = root(pagination).querySelector('.ellipsis') as HTMLElement;
    expect(ellipsis.getAttribute('aria-hidden')).toBe('true');
    expect(ellipsis.tagName).toBe('SPAN');
    expect((ellipsis.querySelector('nph-icon') as NphIcon).name).toBe('ellipsis');
    const seen = listen(pagination);
    await userEvent.click(ellipsis);
    expect(seen).toEqual([]);
  });
});

describe('the six types', () => {
  it('numbered: numbers, with Previous and Next written', async () => {
    const pagination = await mount({ previousLabel: 'Previous', nextLabel: 'Next' });
    expect(slots(pagination)).toEqual(['1', '2', '3', '4', '5', '…', '10']);
    expect(arrow(pagination, 'previous')?.textContent?.trim()).toBe('Previous');
    expect(arrow(pagination, 'next')?.textContent?.trim()).toBe('Next');
    expect(arrow(pagination, 'first')).toBeNull();
    expect(arrow(pagination, 'last')).toBeNull();
    expect(root(pagination).querySelector('nph-tooltip')).toBeNull();
    expect(position(pagination)).toBe('');
  });

  it('simple: the arrows and the position text between them', async () => {
    const pagination = await mount({ type: 'simple', page: 5, positionText: 'Page {page} of {count}' });
    expect(pages(pagination)).toHaveLength(0);
    expect(position(pagination)).toBe('Page 5 of 10');
    /* D-4: previous arrow, position text, next arrow, inside the bar (the balloons sit beside their arrows). */
    const order = [...bar(pagination).children].filter((child) => child.tagName !== 'NPH-TOOLTIP').map((child) => child.id || child.className);
    expect(order).toEqual(['previous', 'position', 'next']);
  });

  it('edges: numbers with first, previous, next and last', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    const order = [...bar(pagination).querySelectorAll('button')].map((button) => button.id || button.textContent?.trim());
    expect(order).toEqual(['first', 'previous', '1', '4', '5', '6', '10', 'next', 'last']);
  });

  it('range: the arrows and the range of items', async () => {
    const pagination = await mount({ type: 'range', page: 5, pageCount: null, totalItems: 250, pageSize: 25, positionText: '{start}–{end} of {total}' });
    expect(position(pagination)).toBe('101–125 of 250');
    expect(pages(pagination)).toHaveLength(0);
  });

  it('range: the last page ends at the total', async () => {
    const pagination = await mount({ type: 'range', page: 11, pageCount: null, totalItems: 260, pageSize: 25, positionText: '{start}–{end} of {total}' });
    expect(position(pagination)).toBe('251–260 of 260');
    expect(arrow(pagination, 'next')?.disabled).toBe(true);
  });

  it('compact: the arrows and "5 of 10"', async () => {
    const pagination = await mount({ type: 'compact', page: 5, positionText: '{page} of {count}' });
    expect(position(pagination)).toBe('5 of 10');
  });

  it('table: items per page, the range and the bar with first and last, in this order', async () => {
    const pagination = await table({ page: 5 });
    const order = [...(nav(pagination) as HTMLElement).children].map((child) => child.className);
    expect(order).toEqual(['field', 'position', 'bar']);
    expect(position(pagination)).toBe('101–125 of 250');
    expect(arrow(pagination, 'first')).not.toBeNull();
    expect(arrow(pagination, 'last')).not.toBeNull();
    expect(slots(pagination)).toEqual(['1', '…', '4', '5', '6', '…', '10']);
  });

  it('inside the shadow root of another component, the numbers still follow the language of the page', async () => {
    const holder = document.createElement('div');
    holder.lang = 'pt-BR';
    document.body.append(holder);
    const outer = document.createElement('div');
    holder.append(outer);
    const shadow = outer.attachShadow({ mode: 'open' });
    const pagination = document.createElement('nph-pagination');
    Object.assign(pagination, { ...LABELS, type: 'range', totalItems: 12500, pageSize: 1000, page: 2, positionText: '{start}–{end} de {total}' });
    shadow.append(pagination);
    await settle(pagination);
    expect(position(pagination)).toBe('1.001–2.000 de 12.500');
  });

  it('the numbers follow the language of the page', async () => {
    const holder = document.createElement('div');
    holder.lang = 'pt-BR';
    document.body.append(holder);
    const pagination = document.createElement('nph-pagination');
    Object.assign(pagination, { ...LABELS, type: 'range', totalItems: 12500, pageSize: 1000, page: 2, positionText: '{start}–{end} de {total}' });
    holder.append(pagination);
    await settle(pagination);
    expect(position(pagination)).toBe('1.001–2.000 de 12.500');
  });
});

async function table(props: Partial<NphPagination> = {}): Promise<NphPagination> {
  return mount({
    type: 'table',
    pageCount: null,
    totalItems: 250,
    pageSize: 25,
    pageSizes: [10, 25, 50, 100],
    positionText: '{start}–{end} of {total}',
    pageSizeLabel: 'Items per page',
    ...props,
  });
}

describe('position in the list', () => {
  it('start: the first page is current, first and previous disabled', async () => {
    const pagination = await mount({ type: 'edges', page: 1 });
    expect(current(pagination)?.textContent?.trim()).toBe('1');
    expect(arrow(pagination, 'first')?.disabled).toBe(true);
    expect(arrow(pagination, 'previous')?.disabled).toBe(true);
    expect(arrow(pagination, 'next')?.disabled).toBe(false);
    expect(arrow(pagination, 'last')?.disabled).toBe(false);
  });

  it('middle: every arrow active and an ellipsis on both sides', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    for (const which of ['first', 'previous', 'next', 'last']) {
      expect(arrow(pagination, which)?.disabled).toBe(false);
    }
    expect(root(pagination).querySelectorAll('.ellipsis')).toHaveLength(2);
  });

  it('end: the last page is current, next and last disabled — and the arrows are still there', async () => {
    const pagination = await mount({ type: 'edges', page: 10 });
    expect(current(pagination)?.textContent?.trim()).toBe('10');
    expect(arrow(pagination, 'next')?.disabled).toBe(true);
    expect(arrow(pagination, 'last')?.disabled).toBe(true);
  });

  it('a single page: both sides disabled', async () => {
    const pagination = await mount({ pageCount: 1 });
    expect(slots(pagination)).toEqual(['1']);
    expect(arrow(pagination, 'previous')?.disabled).toBe(true);
    expect(arrow(pagination, 'next')?.disabled).toBe(true);
  });
});

describe('moving', () => {
  it('a number moves to that page and fires nph-page-change once', async () => {
    const pagination = await mount({ page: 5 });
    const seen = listen(pagination);
    await userEvent.click(pages(pagination).find((button) => button.textContent?.trim() === '6') as HTMLElement);
    await settle(pagination);
    expect(pagination.page).toBe(6);
    expect(seen).toEqual([{ page: 6, pageSize: null }]);
    expect(current(pagination)?.textContent?.trim()).toBe('6');
  });

  it('the current page does not fire again', async () => {
    const pagination = await mount({ page: 5 });
    const seen = listen(pagination);
    await userEvent.click(current(pagination) as HTMLElement);
    expect(seen).toEqual([]);
  });

  it('each arrow goes to its destination', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    const seen = listen(pagination);
    for (const [which, expected] of [
      ['next', 6],
      ['previous', 5],
      ['last', 10],
      ['first', 1],
    ] as const) {
      await userEvent.click(arrow(pagination, which) as HTMLElement);
      await settle(pagination);
      expect(pagination.page, which).toBe(expected);
    }
    expect(seen.map((detail) => detail.page)).toEqual([6, 5, 10, 1]);
  });

  it('the event bubbles and crosses shadow roots', async () => {
    const pagination = await mount({ page: 5 });
    let event: CustomEvent<NphPaginationChangeDetail> | undefined;
    document.body.addEventListener('nph-page-change', (fired) => (event = fired), { once: true });
    await userEvent.click(arrow(pagination, 'next') as HTMLElement);
    expect(event?.bubbles).toBe(true);
    expect(event?.composed).toBe(true);
  });

  it('setting page from code fires nothing', async () => {
    const pagination = await mount({ page: 5 });
    const seen = listen(pagination);
    pagination.page = 8;
    await settle(pagination);
    expect(seen).toEqual([]);
    expect(current(pagination)?.textContent?.trim()).toBe('8');
  });

  it('a disabled arrow lets no click through', async () => {
    const pagination = await mount({ page: 1 });
    const seen = listen(pagination);
    (arrow(pagination, 'previous') as HTMLButtonElement).click();
    expect(seen).toEqual([]);
    expect(pagination.page).toBe(1);
  });

  it('the keyboard moves with Enter and Space', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    (arrow(pagination, 'next') as HTMLButtonElement).focus();
    await userEvent.keyboard('{Enter}');
    await settle(pagination);
    expect(pagination.page).toBe(6);
    await userEvent.keyboard(' ');
    await settle(pagination);
    expect(pagination.page).toBe(7);
  });

  it('reaching the end by the arrow keeps the keyboard in the bar: the focus goes to the current page', async () => {
    const pagination = await mount({ type: 'edges', page: 9 });
    (arrow(pagination, 'next') as HTMLButtonElement).focus();
    await userEvent.keyboard('{Enter}');
    await settle(pagination);
    expect(arrow(pagination, 'next')?.disabled).toBe(true);
    expect(root(pagination).activeElement).toBe(current(pagination));
  });

  it('where there are no numbers, it goes to the opposite arrow', async () => {
    const pagination = await mount({ type: 'compact', page: 2, positionText: '{page} of {count}' });
    (arrow(pagination, 'previous') as HTMLButtonElement).focus();
    await userEvent.keyboard('{Enter}');
    await settle(pagination);
    expect(arrow(pagination, 'previous')?.disabled).toBe(true);
    expect(root(pagination).activeElement).toBe(arrow(pagination, 'next'));
  });
});

describe('items per page', () => {
  it('is an nph-select with the options of page-sizes, at page-size, with its visible label', async () => {
    const pagination = await table();
    const select = root(pagination).querySelector('nph-select') as NphSelect;
    expect(select.value).toBe('25');
    expect([...select.querySelectorAll('nph-option')].map((option) => option.getAttribute('value'))).toEqual(['10', '25', '50', '100']);
    const label = root(pagination).querySelector('label[for="page-size"]') as HTMLLabelElement;
    expect(label.textContent?.trim()).toBe('Items per page');
    expect(select.getBoundingClientRect().width).toBeCloseTo(px('--nph-pagination-page-size-width'), 0);
  });

  it('choosing another size keeps the first item on screen and fires the event with the size', async () => {
    const pagination = await table({ page: 5 });
    const seen = listen(pagination);
    const select = root(pagination).querySelector('nph-select') as NphSelect;
    await userEvent.click(select);
    await settle(pagination);
    const option = [...select.querySelectorAll('nph-option')].find((item) => item.getAttribute('value') === '50') as HTMLElement;
    await userEvent.click(option);
    await settle(pagination);
    /* Item 101 was first on screen: with 50 per page it is on page 3. */
    expect(pagination.pageSize).toBe(50);
    expect(pagination.page).toBe(3);
    expect(seen).toEqual([{ page: 3, pageSize: 50 }]);
    expect(position(pagination)).toBe('101–150 of 250');
  });

  it('the input and change of the inner select do not leave the piece', async () => {
    const pagination = await table({ page: 5 });
    const seen = vi.fn();
    pagination.addEventListener('input', seen);
    pagination.addEventListener('change', seen);
    const select = root(pagination).querySelector('nph-select') as NphSelect;
    await userEvent.click(select);
    await settle(pagination);
    await userEvent.click([...select.querySelectorAll('nph-option')].find((item) => item.getAttribute('value') === '10') as HTMLElement);
    expect(seen).not.toHaveBeenCalled();
  });
});

describe('go to page', () => {
  const edges = (props: Partial<NphPagination> = {}) => mount({ type: 'edges', goToPage: true, goToLabel: 'Go to page', ...props });

  it('is an nph-input beside the bar, at pagination/page-input-width, with its visible label', async () => {
    const pagination = await edges();
    const order = [...(nav(pagination) as HTMLElement).children].map((child) => child.className);
    expect(order).toEqual(['bar', 'field']);
    const field = root(pagination).querySelector('nph-input') as NphInput;
    expect(field.getBoundingClientRect().width).toBeCloseTo(px('--nph-pagination-page-input-width'), 0);
    expect((root(pagination).querySelector('label[for="go-to"]') as HTMLElement).textContent?.trim()).toBe('Go to page');
  });

  it('typing a page and pressing Enter goes there and empties the field', async () => {
    const pagination = await edges();
    const seen = listen(pagination);
    const field = root(pagination).querySelector('nph-input') as NphInput;
    await userEvent.click(field);
    await userEvent.keyboard('7{Enter}');
    await settle(pagination);
    expect(pagination.page).toBe(7);
    expect(seen).toEqual([{ page: 7, pageSize: null }]);
    expect(field.value).toBe('');
  });

  it('a number past the end goes to the last page; text that is not a number is ignored', async () => {
    const pagination = await edges();
    const seen = listen(pagination);
    const field = root(pagination).querySelector('nph-input') as NphInput;
    await userEvent.click(field);
    await userEvent.keyboard('99{Enter}');
    await settle(pagination);
    expect(pagination.page).toBe(10);
    await userEvent.keyboard('abc{Enter}');
    await settle(pagination);
    expect(pagination.page).toBe(10);
    expect(seen.map((detail) => detail.page)).toEqual([10]);
  });

  it('the typing does not leave the piece as input', async () => {
    const pagination = await edges();
    const seen = vi.fn();
    pagination.addEventListener('input', seen);
    await userEvent.click(root(pagination).querySelector('nph-input') as NphInput);
    await userEvent.keyboard('3');
    expect(seen).not.toHaveBeenCalled();
  });
});

describe('accessibility: roles and names the browser computes', () => {
  it('the bar is a navigation named by label', async () => {
    const pagination = await mount();
    const node = await axNode(nav(pagination) as HTMLElement);
    expect(node.role).toBe('navigation');
    expect(node.name).toBe('Pagination');
  });

  it('page-label fills its markers with the page each number leads to, not the current one', async () => {
    const pagination = await mount({ page: 5, pageCount: null, totalItems: 250, pageSize: 25, pageLabel: 'Page {page}, items {start}–{end} of {total}' });
    const six = pages(pagination).find((button) => button.textContent?.trim() === '6') as HTMLButtonElement;
    expect(six.getAttribute('aria-label')).toBe('Page 6, items 126–150 of 250');
    expect(current(pagination)?.getAttribute('aria-label')).toBe('Page 5, items 101–125 of 250');
    const last = pages(pagination).at(-1) as HTMLButtonElement;
    expect(last.getAttribute('aria-label')).toBe('Page 10, items 226–250 of 250');
  });

  it('each number is a button named by page-label; the current one carries aria-current="page"', async () => {
    const pagination = await mount({ page: 5 });
    const five = current(pagination) as HTMLButtonElement;
    expect(five.getAttribute('aria-current')).toBe('page');
    expect((await axNode(five)).name).toBe('Page 5');
    const ten = pages(pagination).at(-1) as HTMLButtonElement;
    expect((await axNode(ten)).name).toBe('Page 10');
    expect(ten.hasAttribute('aria-current')).toBe(false);
  });

  it('the arrows are named by their tooltip text, once, as the name', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    for (const [which, name] of [
      ['first', 'First page'],
      ['previous', 'Previous page'],
      ['next', 'Next page'],
      ['last', 'Last page'],
    ] as const) {
      const node = await axNode(arrow(pagination, which) as HTMLElement);
      expect(node.role, which).toBe('button');
      expect(node.name, which).toBe(name);
      expect(node.description, which).toBe('');
    }
  });

  it('every icon is decorative', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    for (const icon of root(pagination).querySelectorAll('nph-icon')) {
      expect((icon as NphIcon).label ?? '').toBe('');
    }
  });
});

describe('the balloon', () => {
  it('each icon-only arrow carries an nph-tooltip as its name', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    const tooltips = [...root(pagination).querySelectorAll('nph-tooltip')] as NphTooltip[];
    expect(tooltips.map((tooltip) => [tooltip.for, tooltip.relation, tooltip.text])).toEqual([
      ['first', 'name', 'First page'],
      ['previous', 'name', 'Previous page'],
      ['next', 'name', 'Next page'],
      ['last', 'name', 'Last page'],
    ]);
  });

  it('keyboard focus on an active arrow opens it', async () => {
    const pagination = await mount({ type: 'compact', page: 5, positionText: '{page} of {count}' });
    (arrow(pagination, 'previous') as HTMLButtonElement).focus();
    await userEvent.keyboard('{Tab}');
    await settle(pagination);
    expect(root(pagination).activeElement).toBe(arrow(pagination, 'next'));
    const tooltip = root(pagination).querySelector('nph-tooltip[for="next"]') as NphTooltip;
    await expect.poll(() => tooltip.open).toBe(true);
  });

  it('a disabled arrow gives no balloon on hover', async () => {
    const pagination = await mount({ type: 'compact', page: 1, positionText: '{page} of {count}' });
    await userEvent.hover(arrow(pagination, 'previous') as HTMLElement);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const tooltip = root(pagination).querySelector('nph-tooltip[for="previous"]') as NphTooltip;
    expect(tooltip.open).toBe(false);
  });
});

describe('the first and last icon', () => {
  it('first and last use arrow-left-to-line; previous and next the chevrons (D-3)', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    const names = (which: string) => [...(arrow(pagination, which) as HTMLElement).querySelectorAll('nph-icon')].map((icon) => (icon as NphIcon).name);
    expect(names('first')).toEqual(['arrow-left-to-line', 'arrow-left-to-line']);
    expect(names('last')).toEqual(['arrow-left-to-line', 'arrow-left-to-line']);
    expect(names('previous')).toEqual(['chevron-left', 'chevron-left']);
    expect(names('next')).toEqual(['chevron-right', 'chevron-right']);
  });

  it('only the icon of the last arrow turns, not the button or its focus', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    const last = arrow(pagination, 'last') as HTMLElement;
    expect(getComputedStyle(last).transform).toBe('none');
    const glyph = last.querySelector('.glyph') as HTMLElement;
    expect(getComputedStyle(glyph).transform).toBe('matrix(-1, 0, 0, -1, 0, 0)');
    expect(getComputedStyle(arrow(pagination, 'first')?.querySelector('.glyph') as HTMLElement).transform).toBe('none');
  });

  it('light at rest, solid on hover', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    const next = arrow(pagination, 'next') as HTMLElement;
    const shown = () => [...next.querySelectorAll('nph-icon')].filter((icon) => getComputedStyle(icon).display !== 'none').map((icon) => icon.getAttribute('variant') ?? 'light');
    expect(shown()).toEqual(['light']);
    await userEvent.hover(next);
    expect(shown()).toEqual(['solid']);
  });
});

describe('colors and measures', () => {
  it('a number: pagination/item-size, pagination/item-radius, pagination/text-foreground, no background, text/label-md', async () => {
    const pagination = await mount({ page: 5 });
    const four = pages(pagination).find((button) => button.textContent?.trim() === '4') as HTMLElement;
    const style = getComputedStyle(four);
    const box = four.getBoundingClientRect();
    expect(box.width).toBeCloseTo(px('--nph-pagination-item-size'), 0);
    expect(box.height).toBeCloseTo(px('--nph-pagination-item-size'), 0);
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-pagination-item-radius'));
    expect(style.color).toBe(resolved('color', '--nph-pagination-text-foreground'));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
  });

  it('on hover: pagination/item-background-hover', async () => {
    const pagination = await mount({ page: 5 });
    const four = pages(pagination).find((button) => button.textContent?.trim() === '4') as HTMLElement;
    await userEvent.hover(four);
    expect(getComputedStyle(four).backgroundColor).toBe(resolved('background-color', '--nph-pagination-item-background-hover'));
  });

  it('the current page: pagination/item-background-active and text/label-md-strong, so color is not the only signal', async () => {
    const pagination = await mount({ page: 5 });
    const style = getComputedStyle(current(pagination) as HTMLElement);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-pagination-item-background-active'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-strong-font-weight'));
    expect(style.fontWeight).toBe('600');
  });

  it('an arrow: pagination/arrow-background, pagination/arrow-border inside, hover pagination/item-background-hover', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    const next = arrow(pagination, 'next') as HTMLElement;
    const style = getComputedStyle(next);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-pagination-arrow-background'));
    const border = resolved('color', '--nph-pagination-arrow-border');
    expect(style.boxShadow).toContain(border);
    expect(style.boxShadow).toContain(`${px('--nph-pagination-arrow-border-width')}px`);
    expect(style.boxShadow).toContain('inset');
    expect(next.getBoundingClientRect().width).toBeCloseTo(px('--nph-pagination-item-size'), 0);
    await userEvent.hover(next);
    expect(getComputedStyle(next).backgroundColor).toBe(resolved('background-color', '--nph-pagination-item-background-hover'));
  });

  it('the disabled arrow: pagination/disabled-opacity, no hover', async () => {
    const pagination = await mount({ type: 'edges', page: 1 });
    const first = arrow(pagination, 'first') as HTMLElement;
    expect(getComputedStyle(first).opacity).toBe(resolved('opacity', '--nph-pagination-disabled-opacity'));
    await userEvent.hover(first);
    expect(getComputedStyle(first).backgroundColor).toBe(resolved('background-color', '--nph-pagination-arrow-background'));
  });

  it('the bar: pagination/border in pagination/border-width, pagination/radius, padding and item gap', async () => {
    const pagination = await mount({ page: 5 });
    const style = getComputedStyle(bar(pagination));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-pagination-border'));
    expect(Number.parseFloat(style.borderTopWidth)).toBeCloseTo(px('--nph-pagination-border-width'), 1);
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-pagination-radius'));
    expect(Number.parseFloat(style.paddingLeft)).toBeCloseTo(px('--nph-pagination-padding-x'), 1);
    expect(Number.parseFloat(style.paddingTop)).toBeCloseTo(px('--nph-pagination-padding-y'), 1);
    expect(Number.parseFloat(style.columnGap)).toBeCloseTo(px('--nph-pagination-item-gap'), 1);
  });

  it('groups at pagination/group-gap, label and field at pagination/control-gap', async () => {
    const pagination = await table();
    expect(Number.parseFloat(getComputedStyle(nav(pagination) as HTMLElement).columnGap)).toBeCloseTo(px('--nph-pagination-group-gap'), 1);
    const field = root(pagination).querySelector('.field') as HTMLElement;
    expect(Number.parseFloat(getComputedStyle(field).columnGap)).toBeCloseTo(px('--nph-pagination-control-gap'), 1);
  });

  it('the written arrows of numbered grow with their text and keep the item height', async () => {
    const pagination = await mount({ previousLabel: 'Previous', nextLabel: 'Next' });
    const previous = (arrow(pagination, 'previous') as HTMLElement).getBoundingClientRect();
    expect(previous.width).toBeGreaterThan(px('--nph-pagination-item-size'));
    expect(previous.height).toBeCloseTo(px('--nph-pagination-item-size'), 0);
  });

  it('dark mode follows the scheme through the tokens', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    try {
      const pagination = await mount({ page: 5 });
      expect(getComputedStyle(current(pagination) as HTMLElement).backgroundColor).toBe(
        resolved('background-color', '--nph-pagination-item-background-active'),
      );
      expect(getComputedStyle(current(pagination) as HTMLElement).color).toBe(resolved('color', '--nph-pagination-text-foreground'));
    } finally {
      document.documentElement.removeAttribute('data-nph-color-scheme');
    }
  });
});

describe('focus', () => {
  it('keyboard focus draws the focus/border border and the focus/halo halo outside the button', async () => {
    const pagination = await mount({ type: 'edges', page: 5 });
    (arrow(pagination, 'previous') as HTMLButtonElement).focus();
    await userEvent.keyboard('{Tab}');
    const focused = root(pagination).activeElement as HTMLElement;
    expect(focused.matches(':focus-visible')).toBe(true);
    const before = getComputedStyle(focused, '::before');
    const after = getComputedStyle(focused, '::after');
    expect(before.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(after.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(Number.parseFloat(after.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
  });

  it('a mouse click gives no focus ring', async () => {
    const pagination = await mount({ page: 5 });
    const four = pages(pagination).find((button) => button.textContent?.trim() === '4') as HTMLElement;
    await userEvent.click(four);
    expect(getComputedStyle(root(pagination).activeElement as HTMLElement, '::before').content).toBe('none');
  });

  it('Tab walks the arrows and the numbers in reading order, skipping the disabled arrows', async () => {
    const pagination = await mount({ type: 'edges', page: 1, pageCount: 3 });
    const before = document.createElement('button');
    document.body.prepend(before);
    before.focus();
    const visited: string[] = [];
    for (let step = 0; step < 5; step += 1) {
      await userEvent.keyboard('{Tab}');
      const focused = root(pagination).activeElement as HTMLElement;
      visited.push(focused.id || focused.textContent?.trim() || '');
    }
    expect(visited).toEqual(['1', '2', '3', 'next', 'last']);
  });
});

describe('invalid input', () => {
  const errors = () => vi.spyOn(console, 'error').mockImplementation(() => {});

  it.each([
    ['a type that does not exist', { type: 'pager' as never }],
    ['page 0', { page: 0 }],
    ['a page that is not whole', { page: 2.5 }],
    ['a negative page-count', { pageCount: -1 }],
    ['no page count at all', { pageCount: null }],
    ['range without total-items', { type: 'range' as const, pageSize: 25, positionText: '{start}–{end} of {total}' }],
    ['table without page-sizes', { type: 'table' as const, pageCount: null, totalItems: 250, pageSize: 25, positionText: 'x', pageSizeLabel: 'Items' }],
    ['page-sizes without page-size', { type: 'table' as const, pageCount: null, totalItems: 250, pageSize: 25, pageSizes: [10, 50], positionText: 'x', pageSizeLabel: 'Items' }],
    ['table without page-size-label', { type: 'table' as const, pageCount: null, totalItems: 250, pageSize: 25, pageSizes: [25], positionText: 'x' }],
    ['page-sizes outside table', { pageSizes: [10] }],
    ['go-to-page outside edges', { goToPage: true, goToLabel: 'Go' }],
    ['go-to-page without go-to-label', { type: 'edges' as const, goToPage: true }],
    ['no previous-label', { previousLabel: '' }],
    ['no last-label in edges', { type: 'edges' as const, lastLabel: '' }],
    ['no position-text in simple', { type: 'simple' as const }],
  ])('%s: renders nothing and says why', async (_cause, props) => {
    const spy = errors();
    const pagination = await mount(props as Partial<NphPagination>);
    expect(pagination.hasAttribute('data-nph-rendered')).toBe(false);
    expect(nav(pagination)).toBeNull();
    expect(getComputedStyle(pagination).display).toBe('none');
    expect(spy).toHaveBeenCalled();
    for (const call of spy.mock.calls) {
      expect(String(call[0])).toMatch(/^\[nph-pagination\] /);
    }
  });

  it('one error per cause, accumulating', async () => {
    const spy = errors();
    await mount({ type: 'edges', page: 0, previousLabel: '', goToPage: true });
    const messages = spy.mock.calls.map((call) => String(call[0]));
    expect(messages.some((message) => message.includes('page is a whole number'))).toBe(true);
    expect(messages.some((message) => message.includes('previous-label'))).toBe(true);
    expect(messages.some((message) => message.includes('go-to-label'))).toBe(true);
  });

  it('a count of zero is a mount: nothing, no error', async () => {
    const spy = errors();
    const pagination = await mount({ type: 'range', pageCount: null, totalItems: 0, pageSize: 25, positionText: '{start}–{end} of {total}' });
    expect(nav(pagination)).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it('valid again, it draws', async () => {
    errors();
    const pagination = await mount({ type: 'pager' as never });
    pagination.type = 'numbered';
    await settle(pagination);
    expect(nav(pagination)).not.toBeNull();
  });
});

describe('renders and warns once', () => {
  const warnings = () => vi.spyOn(console, 'warn').mockImplementation(() => {});

  it('page above the count draws the last page, without an event', async () => {
    const spy = warnings();
    const pagination = await mount({ page: 5 });
    const seen = listen(pagination);
    pagination.pageCount = 3;
    await settle(pagination);
    expect(current(pagination)?.textContent?.trim()).toBe('3');
    expect(arrow(pagination, 'next')?.disabled).toBe(true);
    expect(seen).toEqual([]);
    pagination.pageCount = 2;
    await settle(pagination);
    expect(spy.mock.calls.filter((call) => String(call[0]).includes('above the count'))).toHaveLength(1);
  });

  it('no label and no page-label: renders and warns once each', async () => {
    const spy = warnings();
    const pagination = await mount({ label: '', pageLabel: '' });
    expect(nav(pagination)).not.toBeNull();
    pagination.page = 2;
    await settle(pagination);
    const messages = spy.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((message) => message.includes('give label'))).toHaveLength(1);
    expect(messages.filter((message) => message.includes('page-label'))).toHaveLength(1);
    expect(current(pagination)?.hasAttribute('aria-label')).toBe(false);
  });

  it('a page-count that differs from total-items and page-size: the derived count wins', async () => {
    const spy = warnings();
    const pagination = await mount({ pageCount: 4, totalItems: 100, pageSize: 10 });
    expect(slots(pagination).at(-1)).toBe('10');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, including every pagination token of the evidence', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
    for (const name of [
      '--nph-pagination-border',
      '--nph-pagination-border-width',
      '--nph-pagination-radius',
      '--nph-pagination-padding-x',
      '--nph-pagination-padding-y',
      '--nph-pagination-item-gap',
      '--nph-pagination-group-gap',
      '--nph-pagination-control-gap',
      '--nph-pagination-item-size',
      '--nph-pagination-item-radius',
      '--nph-pagination-item-background-hover',
      '--nph-pagination-item-background-active',
      '--nph-pagination-text-foreground',
      '--nph-pagination-arrow-background',
      '--nph-pagination-arrow-border',
      '--nph-pagination-arrow-border-width',
      '--nph-pagination-page-size-width',
      '--nph-pagination-page-input-width',
      '--nph-pagination-disabled-opacity',
      '--nph-text-label-md-strong-font-weight',
      '--nph-focus-border',
      '--nph-focus-halo',
    ]) {
      expect(used, name).toContain(name);
    }
  });

  it('never consumes a core or theme token', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, measure or duration', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw|deg)\b/);
  });
});
