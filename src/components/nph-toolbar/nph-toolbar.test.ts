/**
 * Tests of `nph-toolbar` (P104), in a real browser (P21, item 5): measures, the Tab order,
 * real keys and the focus only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation `2944:6528`, set `2105:426`) and
 * the decisions D-1 to D-5 of DSA-55: the API, the paint of each type, the zones, the count,
 * the size every piece follows, the hover of the bulk bar, the toolbar keyboard pattern, the
 * applied filters strip with its focus rule and its announcements, the composition warnings,
 * the invalid input and the token contract. Color, state and focus of the pieces belong to
 * the pieces: here the tests only prove what the bar adds.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import semanticTokens from '../../tokens/source/semantic.tokens.json';
import componentCss from './nph-toolbar.css?raw';
import { NPH_TOOLBAR_SIZES, NPH_TOOLBAR_TYPES, NphToolbar } from './nph-toolbar';
import '../nph-button/nph-button';
import '../nph-checkbox/nph-checkbox';
import '../nph-chip/nph-chip';
import '../nph-input/nph-input';
import '../nph-separator/nph-separator';
import '../nph-toggle-group/nph-toggle-group';
import '../nph-togglebutton/nph-togglebutton';

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  document.documentElement.removeAttribute('dir');
  vi.restoreAllMocks();
});

/** Mounts markup in the body and waits for every Lit element in it. */
async function mount(markup: string, parent: HTMLElement = document.body): Promise<NphToolbar> {
  const host = document.createElement('div');
  host.innerHTML = markup;
  parent.append(...host.childNodes);
  const bar = parent.querySelector<NphToolbar>('nph-toolbar');
  if (bar === null) throw new Error('no nph-toolbar');
  await settle(parent);
  return bar;
}

/** Waits for every Lit element under the parent, twice, so a slotchange can settle. */
async function settle(parent: ParentNode = document.body): Promise<void> {
  for (let round = 0; round < 3; round += 1) {
    const elements = [...parent.querySelectorAll('*')].filter(
      (element): element is Element & { updateComplete: Promise<unknown> } => 'updateComplete' in element,
    );
    await Promise.all(elements.map((element) => element.updateComplete));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

function part<T extends Element = HTMLElement>(bar: NphToolbar, selector: string): T {
  const found = bar.shadowRoot?.querySelector<T>(selector);
  if (!found) throw new Error(`no ${selector}`);
  return found;
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const color = (token: string) => resolved('color', token);
const length = (token: string) => resolved('padding-left', token);
const radius = (token: string) => resolved('border-top-left-radius', token);

/** A wide box, so the bar has room for its pieces and the zones can be measured. */
function wide(width = 1200): HTMLElement {
  const box = document.createElement('div');
  box.style.inlineSize = `${width}px`;
  document.body.append(box);
  return box;
}

/** The id of the element that holds the focus, through the shadow roots of the pieces. */
function focusedId(): string {
  return document.activeElement?.id ?? '';
}

function errors(): () => string[] {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  return () => spy.mock.calls.map((call) => String(call[0]));
}

function warnings(): () => string[] {
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  return () => spy.mock.calls.map((call) => String(call[0])).filter((message) => message.startsWith('[nph-toolbar]'));
}

const BULK = `<nph-toolbar label="Table actions" count-text="2 of 6 selected">
  <nph-checkbox slot="checkbox" id="all" label="Select all"></nph-checkbox>
  <nph-button id="clear" severity="secondary" emphasis="ghost" text="Clear selection"></nph-button>
  <nph-button slot="end" id="export" severity="secondary" emphasis="ghost" icon-start="download" text="Export"></nph-button>
  <nph-separator slot="end" orientation="vertical"></nph-separator>
  <nph-button slot="end" id="delete" severity="danger" emphasis="ghost" icon-start="trash" text="Delete"></nph-button>
</nph-toolbar>`;

const PAGE = `<button id="before">before</button>
<nph-toolbar type="page" label="People">
  <nph-input id="search" type="search" label="Search people" icon-start="magnifying-glass"></nph-input>
  <nph-button id="filter" severity="secondary" emphasis="ghost" icon-start="filter" text="Filter"></nph-button>
  <nph-toggle-group slot="center" id="view" label="View" value="list">
    <nph-togglebutton id="list" value="list" text="List"></nph-togglebutton>
    <nph-togglebutton id="grid" value="grid" text="Grid"></nph-togglebutton>
  </nph-toggle-group>
  <nph-button slot="end" id="download" severity="secondary" emphasis="ghost" icon-start="download" label="Download"></nph-button>
  <nph-button slot="end" id="create" text="New person"></nph-button>
</nph-toolbar>
<button id="after">after</button>`;

const FILTERS = `<nph-button id="open-filters" severity="secondary" emphasis="ghost" text="Filter"></nph-button>
<nph-toolbar type="applied-filters" label="Applied filters" trigger="open-filters"
  removed-text="Filter removed: {text}" cleared-text="All filters removed">
  <nph-chip id="status" text="Status: Approved" remove-label="Remove filter"></nph-chip>
  <nph-chip id="unit" text="Unit: Central" remove-label="Remove filter"></nph-chip>
  <nph-chip id="year" text="Year: 2026" remove-label="Remove filter"></nph-chip>
  <nph-button id="clear-filters" severity="secondary" emphasis="ghost" text="Clear filters"></nph-button>
</nph-toolbar>`;

describe('nph-toolbar — API', () => {
  it('the reactive API is exactly the one of P104', () => {
    const declared = [...(NphToolbar as unknown as { elementProperties: Map<string, { state?: boolean }> }).elementProperties]
      .filter(([, options]) => !options.state)
      .map(([name]) => name)
      .sort();
    expect(declared).toEqual(['clearedText', 'countText', 'label', 'removedText', 'size', 'trigger', 'type']);
  });

  it('the lists of the contract', () => {
    expect(NPH_TOOLBAR_TYPES).toEqual(['bulk', 'page', 'tools', 'floating', 'applied-filters']);
    expect(NPH_TOOLBAR_SIZES).toEqual(['compact', 'default', 'large']);
  });

  it('defaults to the bulk bar in the default size, both reflected', async () => {
    const bar = await mount('<nph-toolbar label="Table actions"></nph-toolbar>');
    expect(bar.type).toBe('bulk');
    expect(bar.size).toBe('default');
    expect(bar.getAttribute('type')).toBe('bulk');
    expect(bar.getAttribute('size')).toBe('default');
  });

  it('the host is the toolbar, named by label', async () => {
    const bar = await mount('<nph-toolbar label="Table actions"></nph-toolbar>');
    expect(bar.getAttribute('role')).toBe('toolbar');
    expect(bar.getAttribute('aria-label')).toBe('Table actions');
    bar.label = '';
    await bar.updateComplete;
    expect(bar.hasAttribute('aria-label')).toBe(false);
  });

  it('a name the consumer puts on the host is a name, and the bar renders', async () => {
    const report = errors();
    const bar = await mount('<span id="name">Editor</span><nph-toolbar type="tools" aria-labelledby="name"></nph-toolbar>');
    expect(bar.hasAttribute('data-nph-rendered')).toBe(true);
    expect(report()).toEqual([]);
  });

  it('the applied filters strip is a group, not a toolbar (D-3)', async () => {
    const bar = await mount(FILTERS);
    expect(bar.getAttribute('role')).toBe('group');
    expect(bar.getAttribute('aria-label')).toBe('Applied filters');
  });

  it('has no own event, no part and no slot outside the zones', async () => {
    const bar = await mount(BULK);
    expect(bar.shadowRoot?.querySelectorAll('[part]')).toHaveLength(0);
    const slots = [...(bar.shadowRoot?.querySelectorAll('slot') ?? [])].map((slot) => slot.name);
    expect(slots).toEqual(['checkbox', '', 'center', 'end']);
  });
});

describe('the paint of each type', () => {
  it('bulk: highlighted background, no border, the bulk sides and the bar radius', async () => {
    const bar = await mount(BULK);
    const style = getComputedStyle(part(bar, '.bar'));
    expect(style.backgroundColor).toBe(color('--nph-toolbar-bulk-background'));
    expect(style.borderTopStyle).toBe('none');
    expect(style.paddingLeft).toBe(length('--nph-toolbar-bulk-padding-x'));
    expect(style.paddingRight).toBe(length('--nph-toolbar-bulk-padding-x'));
    expect(style.paddingTop).toBe(length('--nph-toolbar-padding'));
    expect(style.borderTopLeftRadius).toBe(radius('--nph-toolbar-radius'));
    expect(style.boxShadow).toBe('none');
  });

  for (const type of ['page', 'tools']) {
    it(`${type}: background, border in its width, radius and padding of the bar`, async () => {
      const bar = await mount(`<nph-toolbar type="${type}" label="Area"></nph-toolbar>`);
      const style = getComputedStyle(part(bar, '.bar'));
      expect(style.backgroundColor).toBe(color('--nph-toolbar-background'));
      expect(style.borderTopColor).toBe(color('--nph-toolbar-border'));
      expect(style.borderTopWidth).toBe(length('--nph-toolbar-border-width'));
      expect(style.borderTopStyle).toBe('solid');
      expect(style.borderTopLeftRadius).toBe(radius('--nph-toolbar-radius'));
      expect(style.paddingLeft).toBe(length('--nph-toolbar-padding'));
      expect(style.boxShadow).toBe('none');
    });
  }

  it('floating: popover background, its border and radius, and the dropdown shadow', async () => {
    const bar = await mount('<nph-toolbar type="floating" label="Selection" count-text="3 of 12 selected"></nph-toolbar>');
    const style = getComputedStyle(part(bar, '.bar'));
    expect(style.backgroundColor).toBe(color('--nph-toolbar-floating-background'));
    expect(style.borderTopColor).toBe(color('--nph-toolbar-floating-border'));
    expect(style.borderTopLeftRadius).toBe(radius('--nph-toolbar-floating-radius'));
    expect(style.boxShadow).toBe(resolved('box-shadow', '--nph-elevation-dropdown'));
  });

  it('the dark scheme repaints the bar from the same tokens', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    const bar = await mount('<nph-toolbar type="page" label="People"></nph-toolbar>');
    expect(getComputedStyle(part(bar, '.bar')).backgroundColor).toBe(color('--nph-toolbar-background'));
  });

  it('the bar does not wrap: the pieces stay on one line', async () => {
    const box = document.createElement('div');
    box.style.inlineSize = '320px';
    document.body.append(box);
    const bar = await mount(PAGE, box);
    const tops = [...bar.querySelectorAll('nph-button')].map((button) => Math.round(button.getBoundingClientRect().top));
    expect(new Set(tops).size).toBe(1);
  });
});

describe('the zones', () => {
  it('the center shows only with content, in the middle of the bar', async () => {
    const without = await mount('<nph-toolbar type="page" label="People"><nph-button slot="end" text="New"></nph-button></nph-toolbar>');
    expect(getComputedStyle(part(without, '.center')).display).toBe('none');
    document.body.replaceChildren();
    const bar = await mount(PAGE, wide());
    const view = bar.querySelector('nph-toggle-group') as HTMLElement;
    const barBox = bar.getBoundingClientRect();
    const viewBox = view.getBoundingClientRect();
    const middle = barBox.left + barBox.width / 2;
    expect(Math.abs(viewBox.left + viewBox.width / 2 - middle)).toBeLessThan(2);
  });

  it('the end actions sit at the end edge, inside the padding', async () => {
    const bar = await mount(BULK, wide());
    const end = bar.querySelector('#delete') as HTMLElement;
    const padding = Number.parseFloat(length('--nph-toolbar-bulk-padding-x'));
    expect(Math.round(bar.getBoundingClientRect().right - end.getBoundingClientRect().right)).toBe(Math.round(padding));
  });

  it('toolbar/gap goes between the items', async () => {
    const bar = await mount(BULK, wide());
    const exportButton = bar.querySelector('#export') as HTMLElement;
    const separator = bar.querySelector('nph-separator') as HTMLElement;
    const gap = Number.parseFloat(length('--nph-toolbar-gap'));
    expect(Math.round(separator.getBoundingClientRect().left - exportButton.getBoundingClientRect().right)).toBe(Math.round(gap));
  });

  it('the divider takes the height of the pieces', async () => {
    const bar = await mount(BULK);
    const separator = bar.querySelector('nph-separator') as HTMLElement;
    const button = bar.querySelector('#delete') as HTMLElement;
    expect(separator.getBoundingClientRect().height).toBeCloseTo(button.getBoundingClientRect().height, 0);
  });

  it('the checkbox comes before the count, and the count before the start actions', async () => {
    const bar = await mount(BULK);
    const checkbox = bar.querySelector('#all') as HTMLElement;
    const count = part(bar, '.count');
    const clear = bar.querySelector('#clear') as HTMLElement;
    expect(checkbox.getBoundingClientRect().right).toBeLessThanOrEqual(count.getBoundingClientRect().left);
    expect(count.getBoundingClientRect().right).toBeLessThanOrEqual(clear.getBoundingClientRect().left);
  });

  it('the checkbox slot is drawn only in the bulk bar', async () => {
    const bar = await mount('<nph-toolbar type="page" label="People"></nph-toolbar>');
    expect(bar.shadowRoot?.querySelector('slot[name="checkbox"]')).toBeNull();
  });
});

describe('the count', () => {
  it('bulk: the text in label-md, in the bulk count color', async () => {
    const bar = await mount(BULK);
    const count = part(bar, '.count');
    expect(count.textContent).toBe('2 of 6 selected');
    const style = getComputedStyle(count);
    expect(style.color).toBe(color('--nph-toolbar-bulk-count-foreground'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-text-label-md-line-height'));
  });

  it('floating: the floating count color', async () => {
    const bar = await mount('<nph-toolbar type="floating" label="Selection" count-text="3 of 12 selected"></nph-toolbar>');
    expect(getComputedStyle(part(bar, '.count')).color).toBe(color('--nph-toolbar-floating-count-foreground'));
  });

  it('no count text, no count', async () => {
    const bar = await mount('<nph-toolbar label="Table actions"></nph-toolbar>');
    expect(bar.shadowRoot?.querySelector('.count')).toBeNull();
  });

  it('page and tools draw no count, and warn once', async () => {
    const report = warnings();
    const bar = await mount('<nph-toolbar type="page" label="People" count-text="2 of 6 selected"></nph-toolbar>');
    expect(bar.shadowRoot?.querySelector('.count')).toBeNull();
    expect(report()).toEqual(['[nph-toolbar] count-text shows only in the bulk and floating bars.']);
  });
});

describe('the size every piece follows', () => {
  const heights = { compact: '--nph-control-height-compact', default: '--nph-control-height-default', large: '--nph-control-height-large' };

  for (const size of NPH_TOOLBAR_SIZES) {
    it(`${size}: buttons, toggle group and search take the size of the bar`, async () => {
      const bar = await mount(PAGE.replace('type="page"', `type="page" size="${size}"`));
      for (const child of bar.querySelectorAll('nph-button, nph-toggle-group, nph-input')) {
        expect((child as HTMLElement & { size: string }).size, child.id).toBe(size);
      }
      for (const button of bar.querySelectorAll('nph-togglebutton')) {
        expect((button as HTMLElement & { size: string }).size).toBe(size);
      }
      const create = bar.querySelector('#create') as HTMLElement;
      expect(`${create.getBoundingClientRect().height}px`).toBe(resolved('height', heights[size]));
    });
  }

  it('the chip is compact in the compact strip and default in the other two', async () => {
    const bar = await mount(FILTERS.replace('type="applied-filters"', 'type="applied-filters" size="compact"'));
    const chips = () => [...bar.querySelectorAll('nph-chip')].map((chip) => (chip as HTMLElement & { size: string }).size);
    expect(chips()).toEqual(['compact', 'compact', 'compact']);
    bar.size = 'large';
    await settle();
    expect(chips()).toEqual(['default', 'default', 'default']);
    expect((bar.querySelector('#clear-filters') as HTMLElement & { size: string }).size).toBe('large');
  });

  it('a size set on a child is written back to the size of the bar', async () => {
    const bar = await mount(PAGE.replace('type="page"', 'type="page" size="compact"'));
    const create = bar.querySelector('#create') as HTMLElement;
    create.setAttribute('size', 'large');
    await settle();
    expect(create.getAttribute('size')).toBe('compact');
  });

  it('a child added later takes the size', async () => {
    const bar = await mount(PAGE.replace('type="page"', 'type="page" size="large"'));
    const added = document.createElement('nph-button');
    added.setAttribute('text', 'Import');
    added.setAttribute('slot', 'end');
    bar.append(added);
    await settle();
    expect(added.getAttribute('size')).toBe('large');
  });
});

describe('the hover of the bulk bar (D-1)', () => {
  const tokens = ['--nph-button-secondary-ghost-background-hover', '--nph-icon-button-secondary-ghost-background-hover'];

  it('points the secondary ghost hover, text and icon only, at the bulk hover token', async () => {
    const bar = await mount(BULK);
    const button = bar.querySelector('#export') as HTMLElement;
    const expected = getComputedStyle(document.documentElement).getPropertyValue('--nph-toolbar-bulk-action-background-hover').trim();
    for (const token of tokens) {
      expect(getComputedStyle(button).getPropertyValue(token).trim()).toBe(expected);
    }
  });

  it('the hovered action paints the bulk hover background', async () => {
    const bar = await mount(BULK);
    const button = bar.querySelector('#export') as HTMLElement;
    await userEvent.hover(button);
    const control = button.shadowRoot?.querySelector('button') as HTMLElement;
    await vi.waitFor(() =>
      expect(getComputedStyle(control).backgroundColor).toBe(color('--nph-toolbar-bulk-action-background-hover')),
    );
  });

  it('the other bars keep the hover of the pieces', async () => {
    const bar = await mount(PAGE);
    const button = bar.querySelector('#filter') as HTMLElement;
    for (const token of tokens) {
      expect(getComputedStyle(button).getPropertyValue(token).trim()).toBe(
        getComputedStyle(document.documentElement).getPropertyValue(token).trim(),
      );
    }
  });
});

describe('keyboard: the toolbar pattern of the APG (D-2)', () => {
  it('the actions are one Tab stop; the search keeps its own', async () => {
    await mount(PAGE);
    (document.getElementById('before') as HTMLElement).focus();
    await userEvent.tab();
    expect(focusedId()).toBe('search');
    await userEvent.tab();
    expect(focusedId()).toBe('filter');
    await userEvent.tab();
    expect(focusedId()).toBe('after');
    await userEvent.tab({ shift: true });
    expect(focusedId()).toBe('filter');
  });

  it('the arrows move between the actions in drawn order, toggle buttons included, and wrap', async () => {
    await mount(PAGE);
    (document.getElementById('filter') as HTMLElement).focus();
    const order: string[] = [];
    for (let step = 0; step < 5; step += 1) {
      await userEvent.keyboard('{ArrowRight}');
      order.push(focusedId());
    }
    expect(order).toEqual(['list', 'grid', 'download', 'create', 'filter']);
    await userEvent.keyboard('{ArrowLeft}');
    expect(focusedId()).toBe('create');
  });

  it('Home and End go to the first and the last action', async () => {
    await mount(PAGE);
    (document.getElementById('grid') as HTMLElement).focus();
    await userEvent.keyboard('{End}');
    expect(focusedId()).toBe('create');
    await userEvent.keyboard('{Home}');
    expect(focusedId()).toBe('filter');
  });

  it('the Tab stop follows the last action reached', async () => {
    await mount(PAGE);
    (document.getElementById('filter') as HTMLElement).focus();
    await userEvent.keyboard('{End}');
    await userEvent.tab();
    expect(focusedId()).toBe('after');
    await userEvent.tab({ shift: true });
    expect(focusedId()).toBe('create');
  });

  it('a click moves the Tab stop to the clicked action', async () => {
    await mount(PAGE);
    await userEvent.click(document.getElementById('download') as HTMLElement);
    expect((document.getElementById('download') as HTMLElement).hasAttribute('tabindex')).toBe(false);
    expect((document.getElementById('filter') as HTMLElement).getAttribute('tabindex')).toBe('-1');
  });

  it('the arrows in the search edit its text and do not move the focus', async () => {
    await mount(PAGE);
    const search = document.getElementById('search') as HTMLElement;
    search.focus();
    await userEvent.keyboard('ab{ArrowLeft}{ArrowRight}{Home}');
    expect(focusedId()).toBe('search');
  });

  it('a disabled action is skipped, and an action that becomes disabled gives the Tab stop away', async () => {
    const bar = await mount(PAGE);
    const download = document.getElementById('download') as HTMLElement & { disabled: boolean };
    download.disabled = true;
    await settle();
    (document.getElementById('grid') as HTMLElement).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(focusedId()).toBe('create');
    const create = document.getElementById('create') as HTMLElement & { disabled: boolean };
    (document.getElementById('before') as HTMLElement).focus();
    create.disabled = true;
    await settle();
    expect(bar.querySelector('#filter')?.hasAttribute('tabindex')).toBe(false);
    await userEvent.tab();
    await userEvent.tab();
    expect(focusedId()).toBe('filter');
  });

  it('a loading action is still an action', async () => {
    await mount(PAGE.replace('id="create"', 'id="create" loading'));
    (document.getElementById('download') as HTMLElement).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(focusedId()).toBe('create');
  });

  it('the checkbox of the bulk bar is an action', async () => {
    await mount(BULK);
    (document.getElementById('all') as HTMLElement).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(focusedId()).toBe('clear');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(focusedId()).toBe('delete');
  });

  it('in a right-to-left page, the arrows follow the reading direction', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    await mount(PAGE);
    (document.getElementById('filter') as HTMLElement).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(focusedId()).toBe('list');
  });

  it('a key with a modifier is left alone', async () => {
    await mount(PAGE);
    (document.getElementById('filter') as HTMLElement).focus();
    await userEvent.keyboard('{Control>}{ArrowRight}{/Control}');
    expect(focusedId()).toBe('filter');
  });

  it('a piece that leaves the bar gets its Tab order back', async () => {
    const bar = await mount(PAGE);
    const download = document.getElementById('download') as HTMLElement;
    expect(download.getAttribute('tabindex')).toBe('-1');
    document.body.append(download);
    await settle();
    expect(download.hasAttribute('tabindex')).toBe(false);
    bar.remove();
    await settle();
    expect((bar.querySelector('#create') as HTMLElement).hasAttribute('tabindex')).toBe(false);
  });

  it('the bar draws no focus of its own and the host takes no focus', async () => {
    const bar = await mount(PAGE);
    expect(bar.hasAttribute('tabindex')).toBe(false);
    expect(getComputedStyle(part(bar, '.bar')).outlineStyle).toBe('none');
  });
});

describe('the applied filters strip', () => {
  async function remove(id: string): Promise<void> {
    const chip = document.getElementById(id) as HTMLElement;
    chip.addEventListener('nph-remove', () => chip.remove(), { once: true });
    const x = chip.shadowRoot?.querySelector('button') as HTMLElement;
    await userEvent.click(x);
    await settle();
  }

  it('no background, no border, the gap between items and padding only at the start', async () => {
    const bar = await mount(FILTERS);
    const style = getComputedStyle(part(bar, '.strip'));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopStyle).toBe('none');
    expect(style.columnGap).toBe(length('--nph-toolbar-gap'));
    expect(style.rowGap).toBe(length('--nph-toolbar-gap'));
    expect(style.paddingLeft).toBe(length('--nph-toolbar-padding'));
    expect(style.paddingRight).toBe('0px');
  });

  it('the items wrap to a new line when they do not fit', async () => {
    const box = document.createElement('div');
    box.style.inlineSize = '240px';
    document.body.append(box);
    const bar = await mount(FILTERS, box);
    const tops = [...bar.querySelectorAll('nph-chip, nph-button')].map((item) => Math.round(item.getBoundingClientRect().top));
    expect(new Set(tops).size).toBeGreaterThan(1);
  });

  it('with no chip, the strip is not shown and takes no height; it shows from the first chip', async () => {
    const bar = await mount(FILTERS.replace(/<nph-chip[^>]*><\/nph-chip>/g, ''));
    expect(bar.getBoundingClientRect().height).toBe(0);
    const chip = document.createElement('nph-chip');
    chip.setAttribute('text', 'Status: Approved');
    chip.setAttribute('remove-label', 'Remove filter');
    bar.prepend(chip);
    await settle();
    expect(bar.getBoundingClientRect().height).toBeGreaterThan(0);
  });

  it('the strip never removes a chip by itself', async () => {
    const bar = await mount(FILTERS);
    const x = document.getElementById('unit')?.shadowRoot?.querySelector('button') as HTMLElement;
    await userEvent.click(x);
    await settle();
    expect(bar.querySelectorAll('nph-chip')).toHaveLength(3);
  });

  it('after a chip leaves, the focus goes to the next chip and the removal is announced', async () => {
    const bar = await mount(FILTERS);
    await remove('status');
    expect(focusedId()).toBe('unit');
    await vi.waitFor(() => expect(part(bar, '[role="status"]').textContent).toBe('Filter removed: Status: Approved'));
  });

  it('the last chip leaves: the focus goes to the previous chip', async () => {
    await mount(FILTERS);
    await remove('year');
    expect(focusedId()).toBe('unit');
  });

  it('no chip is left: the focus goes to the trigger, and the strip keeps announcing', async () => {
    const bar = await mount(FILTERS);
    await remove('status');
    await remove('unit');
    await remove('year');
    expect(focusedId()).toBe('open-filters');
    expect(bar.getBoundingClientRect().height).toBe(0);
    await vi.waitFor(() => expect(part(bar, '[role="status"]').textContent).toBe('Filter removed: Year: 2026'));
  });

  it('the same sentence twice is announced twice', async () => {
    const bar = await mount(
      FILTERS.replace('Unit: Central', 'Status: Approved').replace('id="unit"', 'id="again"'),
    );
    await remove('status');
    const status = part(bar, '[role="status"]');
    await vi.waitFor(() => expect(status.textContent).toBe('Filter removed: Status: Approved'));
    const texts: string[] = [];
    const observer = new MutationObserver(() => texts.push(status.textContent ?? ''));
    observer.observe(status, { childList: true, characterData: true, subtree: true });
    await remove('again');
    await vi.waitFor(() => expect(status.textContent).toBe('Filter removed: Status: Approved'));
    observer.disconnect();
    expect(texts).toContain('');
  });

  it('Limpar filtros empties the strip: the focus goes to the trigger and it is announced (D-4)', async () => {
    const bar = await mount(FILTERS);
    const clear = document.getElementById('clear-filters') as HTMLElement;
    clear.addEventListener('click', () => bar.querySelectorAll('nph-chip').forEach((chip) => chip.remove()), { once: true });
    await userEvent.click(clear);
    await settle();
    expect(focusedId()).toBe('open-filters');
    await vi.waitFor(() => expect(part(bar, '[role="status"]').textContent).toBe('All filters removed'));
  });

  it('a consumer that removes the chip later still gets the focus rule', async () => {
    await mount(FILTERS);
    const chip = document.getElementById('unit') as HTMLElement;
    const x = chip.shadowRoot?.querySelector('button') as HTMLElement;
    await userEvent.click(x);
    await new Promise((resolve) => setTimeout(resolve, 30));
    chip.remove();
    await settle();
    expect(focusedId()).toBe('year');
  });

  it('the focus is not taken back when it went somewhere else', async () => {
    await mount(`<button id="elsewhere">elsewhere</button>${FILTERS}`);
    const chip = document.getElementById('unit') as HTMLElement;
    const x = chip.shadowRoot?.querySelector('button') as HTMLElement;
    await userEvent.click(x);
    (document.getElementById('elsewhere') as HTMLElement).focus();
    chip.remove();
    await settle();
    expect(focusedId()).toBe('elsewhere');
  });

  it('a chip removed by code moves no focus and announces nothing', async () => {
    const bar = await mount(FILTERS);
    (document.getElementById('open-filters') as HTMLElement).focus();
    document.getElementById('unit')?.remove();
    await settle();
    expect(focusedId()).toBe('open-filters');
    expect(part(bar, '[role="status"]').textContent).toBe('');
  });

  it('a trigger that matches nothing warns when the focus needs it', async () => {
    const report = warnings();
    const bar = await mount(FILTERS.replace('trigger="open-filters"', 'trigger="missing"'));
    await remove('status');
    await remove('unit');
    await remove('year');
    expect(report()).toContain(
      '[nph-toolbar] trigger names no element in the same root: the focus has nowhere to go after the last filter.',
    );
    expect(bar.isConnected).toBe(true);
  });

  it('each X and the clear button are Tab stops of their own, with no arrow keys (D-3)', async () => {
    await mount(FILTERS);
    (document.getElementById('open-filters') as HTMLElement).focus();
    await userEvent.tab();
    expect(focusedId()).toBe('status');
    await userEvent.keyboard('{ArrowRight}');
    expect(focusedId()).toBe('status');
    await userEvent.tab();
    expect(focusedId()).toBe('unit');
    await userEvent.tab();
    await userEvent.tab();
    expect(focusedId()).toBe('clear-filters');
  });
});

describe('composition warnings: the bar still renders', () => {
  it('a valid bar warns nothing', async () => {
    const report = warnings();
    await mount(BULK);
    await mount(PAGE);
    await mount(FILTERS);
    expect(report()).toEqual([]);
  });

  it('more than one main action warns once', async () => {
    const report = warnings();
    await mount('<nph-toolbar type="page" label="People"><nph-button slot="end" text="A"></nph-button><nph-button slot="end" text="B"></nph-button></nph-toolbar>');
    expect(report()).toEqual(['[nph-toolbar] more than one main action: use one primary solid and the others in ghost.']);
  });

  it('a divider that opens or closes the bar warns', async () => {
    const report = warnings();
    await mount('<nph-toolbar type="tools" label="Editor"><nph-separator orientation="vertical"></nph-separator><nph-button text="Bold"></nph-button></nph-toolbar>');
    expect(report()).toEqual(['[nph-toolbar] a divider goes between groups of actions: it never opens or closes the bar.']);
  });

  it('the checkbox slot outside the bulk bar, or holding something else, warns', async () => {
    const report = warnings();
    await mount('<nph-toolbar type="floating" label="Selection"><nph-button slot="checkbox" severity="secondary" emphasis="ghost" text="X"></nph-button></nph-toolbar>');
    expect(report()).toEqual([
      '[nph-toolbar] the checkbox slot shows only in the bulk bar.',
      '[nph-toolbar] the checkbox slot takes one nph-checkbox.',
    ]);
  });

  it('the applied filters strip: other slots, other children, two buttons, the button first', async () => {
    const report = warnings();
    await mount(`<nph-toolbar type="applied-filters" label="Applied filters" trigger="t" removed-text="Removed {text}">
      <nph-button severity="secondary" emphasis="ghost" text="Clear"></nph-button>
      <nph-chip text="A: 1" remove-label="Remove"></nph-chip>
      <nph-button severity="secondary" emphasis="ghost" text="Clear again"></nph-button>
      <span>other</span>
      <nph-button slot="end" severity="secondary" emphasis="ghost" text="End"></nph-button>
    </nph-toolbar>`);
    expect(report()).toEqual([
      '[nph-toolbar] the applied filters strip has no checkbox, center or end slot: that content is not shown.',
      '[nph-toolbar] the applied filters strip takes removable nph-chip children and one nph-button to clear them.',
      '[nph-toolbar] the applied filters strip takes one nph-button, the one that clears every filter.',
      '[nph-toolbar] the clear button goes after the last chip.',
    ]);
  });

  it('the applied filters strip without trigger or removed-text warns', async () => {
    const report = warnings();
    await mount('<nph-toolbar type="applied-filters" label="Applied filters"><nph-chip text="A: 1" remove-label="Remove"></nph-chip></nph-toolbar>');
    expect(report()).toEqual([
      '[nph-toolbar] trigger is empty: after the last filter leaves, the focus has nowhere to go.',
      '[nph-toolbar] removed-text is empty: the removal of a filter is not announced.',
    ]);
  });

  it('a problem that stays does not repeat on the next change', async () => {
    const report = warnings();
    const bar = await mount('<nph-toolbar type="page" label="People" count-text="2"></nph-toolbar>');
    bar.append(document.createElement('nph-separator'));
    bar.lastElementChild?.remove();
    await settle();
    expect(report()).toHaveLength(1);
  });
});

describe('invalid input: it renders nothing and says why, once per cause', () => {
  it('a type outside the five', async () => {
    const report = errors();
    const bar = await mount('<nph-toolbar type="vertical" label="Area"></nph-toolbar>');
    expect(bar.hasAttribute('data-nph-rendered')).toBe(false);
    expect(bar.getBoundingClientRect().height).toBe(0);
    expect(report()).toEqual([
      '[nph-toolbar] type "vertical" does not exist. Use bulk, page, tools, floating, applied-filters.',
    ]);
  });

  it('a size outside the three, or padded with whitespace', async () => {
    const report = errors();
    await mount('<nph-toolbar size="small" label="Area"></nph-toolbar>');
    await mount('<nph-toolbar size=" large" label="Area"></nph-toolbar>');
    expect(report()).toEqual([
      '[nph-toolbar] size "small" does not exist. Use compact, default, large.',
      '[nph-toolbar] size " large" does not exist. Use compact, default, large.',
    ]);
  });

  it('no name at all, or a label of spaces', async () => {
    const report = errors();
    await mount('<nph-toolbar></nph-toolbar>');
    await mount('<nph-toolbar label="   "></nph-toolbar>');
    expect(report()).toEqual([
      '[nph-toolbar] the bar needs a name: set label, aria-label or aria-labelledby, so the area is announced.',
      '[nph-toolbar] the bar needs a name: set label, aria-label or aria-labelledby, so the area is announced.',
    ]);
  });

  it('an invalid bar manages no Tab stop', async () => {
    errors();
    const bar = await mount('<nph-toolbar type="page"><nph-button text="A"></nph-button><nph-button text="B"></nph-button></nph-toolbar>');
    for (const button of bar.querySelectorAll('nph-button')) {
      expect(button.hasAttribute('tabindex')).toBe(false);
    }
  });

  it('a valid value set later makes it draw, and no new error appears', async () => {
    const report = errors();
    const bar = await mount('<nph-toolbar type="vertical" label="Area"></nph-toolbar>');
    bar.type = 'page';
    await bar.updateComplete;
    expect(bar.hasAttribute('data-nph-rendered')).toBe(true);
    expect(report()).toHaveLength(1);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));
  const toolbarTokens = Object.keys(
    (semanticTokens as unknown as Record<string, Record<string, unknown>>).toolbar ?? {},
  ).map((name) => `--nph-toolbar-${name}`);

  it('the source has the 14 toolbar tokens of the evidence, and each is consumed here', () => {
    expect(toolbarTokens).toHaveLength(14);
    for (const property of toolbarTokens) {
      expect(tokensCss, property).toContain(`${property}:`);
      expect(used.has(property), property).toBe(true);
    }
  });

  it('besides them, only elevation/dropdown and text/label-md, all in tokens.css', () => {
    const others = [...used].filter((name) => !toolbarTokens.includes(name)).sort();
    expect(others).toEqual(
      [
        '--nph-elevation-dropdown',
        '--nph-text-label-md-font-family',
        '--nph-text-label-md-font-size',
        '--nph-text-label-md-font-weight',
        '--nph-text-label-md-letter-spacing',
        '--nph-text-label-md-line-height',
      ].sort(),
    );
    for (const name of others) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('points only the secondary ghost hover of nph-button at a toolbar token', () => {
    const declared = [...cssWithoutComments.matchAll(/(--nph-[a-z0-9-]+)\s*:/g)].map((match) => match[1]);
    expect(declared).toEqual(['--nph-button-secondary-ghost-background-hover', '--nph-icon-button-secondary-ghost-background-hover']);
    for (const name of declared) {
      expect(tokensCss, name).toContain(`${name ?? ''}:`);
    }
  });

  it('never consumes a core or theme token and writes no literal value', () => {
    expect(cssWithoutComments).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });
});
