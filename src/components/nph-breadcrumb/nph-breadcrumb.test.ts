/**
 * Tests of `nph-breadcrumb` (P109), in a real browser (P21, item 5): hover, keyboard focus, the top
 * layer of the menu and the measures only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `4512:4741`, sets `4490:2886`,
 * `4490:2678` and `4490:2697`, separator `1635:16`), recorded in the evidence of the
 * `figma-docs-accepted` gate of DSA-66: the API, the invalid input, the trail of 2, 3 and 4 levels
 * and the collapsed one, the icons, the link and the current page, the ellipsis and its menu, the
 * width of the menu between the floor and the ceiling, the roles and names the browser computes,
 * the colors and measures of each state, the focus, the right-to-left mirror, the single line and
 * the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-breadcrumb.css?raw';
import {
  NPH_BREADCRUMB_MAX_LEVELS,
  NPH_BREADCRUMB_MIN_COLLAPSED_LEVELS,
  NPH_BREADCRUMB_MIN_LEVELS,
  NphBreadcrumb,
} from './nph-breadcrumb';
import type { NphBreadcrumbLevel } from './nph-breadcrumb';
import type { NphDropdownMenu } from '../nph-dropdown-menu/nph-dropdown-menu';
import type { NphIcon } from '../nph-icon/nph-icon';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

/**
 * Takes the trails out of the page. A menu taken out while it is shown, or still leaving, logs a
 * lookup error in development, so each one is closed and left to leave first.
 */
/** The listeners a test puts on the page; aborted at the end of each test, so none leaks into the next. */
let listeners = new AbortController();

async function clearPage(): Promise<void> {
  for (const trail of document.querySelectorAll('nph-breadcrumb')) {
    const shown = trail.shadowRoot?.querySelector('nph-dropdown-menu');
    if (shown?.shadowRoot?.querySelector('.panel')?.matches(':popover-open')) {
      shown.open = false;
      await shown.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  document.body.replaceChildren();
}

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  listeners.abort();
  listeners = new AbortController();
  await clearPage();
  document.documentElement.removeAttribute('dir');
  vi.restoreAllMocks();
});

const PATH: NphBreadcrumbLevel[] = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Nephos', href: '#nephos' },
  { label: 'Components' },
];

/** The same path with an icon on every level. */
const PATH_WITH_ICONS: NphBreadcrumbLevel[] = [
  { label: 'Home', href: '#home', icon: 'house' },
  { label: 'Projects', href: '#projects', icon: 'folder' },
  { label: 'Nephos', href: '#nephos', icon: 'star' },
  { label: 'Components', icon: 'file' },
];

/** Six levels: the collapsed trail hides the three in the middle. */
const LONG_PATH: NphBreadcrumbLevel[] = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Nephos', href: '#nephos' },
  { label: 'Design system', href: '#design-system' },
  { label: 'Navigation', href: '#navigation' },
  { label: 'Breadcrumb' },
];

async function mount(props: Partial<NphBreadcrumb> = {}): Promise<NphBreadcrumb> {
  const trail = document.createElement('nph-breadcrumb');
  Object.assign(trail, { levels: PATH, label: 'Breadcrumb', ...props });
  document.body.append(trail);
  await trail.updateComplete;
  return trail;
}

/** A collapsed trail, settled: the icons and the menu have rendered and the menu found its button. */
async function mountCollapsed(props: Partial<NphBreadcrumb> = {}): Promise<NphBreadcrumb> {
  const trail = await mount({ levels: LONG_PATH, collapsed: true, ellipsisLabel: 'Show hidden levels', ...props });
  await settle(trail);
  return trail;
}

async function settle(trail: NphBreadcrumb): Promise<void> {
  await trail.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  for (const inner of trail.shadowRoot?.querySelectorAll('nph-icon, nph-dropdown-menu') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
}

const nav = (trail: NphBreadcrumb): HTMLElement => trail.shadowRoot?.querySelector('nav') as HTMLElement;
const list = (trail: NphBreadcrumb): HTMLElement => trail.shadowRoot?.querySelector('ol') as HTMLElement;
const parts = (trail: NphBreadcrumb): HTMLElement[] => [...(trail.shadowRoot?.querySelectorAll('li') ?? [])] as HTMLElement[];
const links = (trail: NphBreadcrumb): HTMLAnchorElement[] =>
  [...(trail.shadowRoot?.querySelectorAll('a.link') ?? [])] as HTMLAnchorElement[];
const current = (trail: NphBreadcrumb): HTMLElement => trail.shadowRoot?.querySelector('.current') as HTMLElement;
const separators = (trail: NphBreadcrumb): HTMLElement[] =>
  [...(trail.shadowRoot?.querySelectorAll('.separator') ?? [])] as HTMLElement[];
const ellipsis = (trail: NphBreadcrumb): HTMLButtonElement => trail.shadowRoot?.querySelector('button.ellipsis') as HTMLButtonElement;
const menu = (trail: NphBreadcrumb): NphDropdownMenu => trail.shadowRoot?.querySelector('nph-dropdown-menu') as NphDropdownMenu;
const levelIcons = (trail: NphBreadcrumb): NphIcon[] => [...(trail.shadowRoot?.querySelectorAll('.level-icon') ?? [])] as NphIcon[];
const panel = (trail: NphBreadcrumb): HTMLElement => menu(trail).shadowRoot?.querySelector('.panel') as HTMLElement;
const menuItems = (trail: NphBreadcrumb): HTMLElement[] =>
  [...(menu(trail).shadowRoot?.querySelectorAll('.item') ?? [])] as HTMLElement[];
const labelOf = (element: Element): string => (element.querySelector('.label')?.textContent ?? '').trim();

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Opens the menu with a click on the ellipsis and waits for the panel to be shown. */
async function openMenu(trail: NphBreadcrumb): Promise<void> {
  await userEvent.click(ellipsis(trail));
  await settle(trail);
  await wait(300);
}

/** The node the browser itself builds for an element in its accessibility tree (as in `nph-sidebar-item`). */
async function axNode(element: Element): Promise<{ role: string; name: string }> {
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
    return { role: String(node?.role?.value ?? ''), name: String(node?.name?.value ?? '') };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-breadcrumb')).toBe(NphBreadcrumb);
    expect(document.createElement('nph-breadcrumb')).toBeInstanceOf(NphBreadcrumb);
  });

  it('the public API is exactly P109', () => {
    const declared = [...(NphBreadcrumb as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(['collapsed', 'ellipsisLabel', 'hostName', 'label', 'levels'].sort());
    expect(NPH_BREADCRUMB_MIN_LEVELS).toBe(2);
    expect(NPH_BREADCRUMB_MAX_LEVELS).toBe(4);
    expect(NPH_BREADCRUMB_MIN_COLLAPSED_LEVELS).toBe(4);
  });

  it('has the defaults: no levels, not collapsed, no name', () => {
    const trail = document.createElement('nph-breadcrumb');
    expect(trail.levels).toEqual([]);
    expect(trail.collapsed).toBe(false);
    expect(trail.label).toBeNull();
    expect(trail.ellipsisLabel).toBeNull();
  });

  it('`levels` is a property only; `collapsed`, `label` and `ellipsis-label` come from attributes', async () => {
    const trail = document.createElement('nph-breadcrumb');
    trail.setAttribute('levels', '[{"label":"Home","href":"#h"},{"label":"Now"}]');
    trail.setAttribute('collapsed', '');
    trail.setAttribute('label', 'Path');
    trail.setAttribute('ellipsis-label', 'More');
    expect(trail.levels).toEqual([]);
    expect(trail.collapsed).toBe(true);
    expect(trail.label).toBe('Path');
    expect(trail.ellipsisLabel).toBe('More');
  });

  it('declares no slot, no part, no event of its own and no color property', async () => {
    const trail = await mountCollapsed();
    expect(trail.shadowRoot?.querySelector('slot')).toBeNull();
    expect(trail.shadowRoot?.querySelector('[part]')).toBeNull();
    expect(componentCss).not.toMatch(/::part|--nph-breadcrumb-[a-z-]+\s*:/);
  });

  it('`collapsed` reflects', async () => {
    const trail = await mount({ levels: LONG_PATH, collapsed: true, ellipsisLabel: 'More' });
    expect(trail.hasAttribute('collapsed')).toBe(true);
    trail.levels = PATH;
    trail.collapsed = false;
    await trail.updateComplete;
    expect(trail.hasAttribute('collapsed')).toBe(false);
  });
});

describe('invalid input', () => {
  const cases: Array<[string, Partial<NphBreadcrumb>, RegExp]> = [
    ['levels that is not a list', { levels: 'Home' as never }, /`levels` is not a list/],
    ['no level', { levels: [] }, /has 0 level\(s\)/],
    ['one level', { levels: [{ label: 'Home' }] }, /has 1 level\(s\)/],
    ['five levels on a trail that is not collapsed', { levels: [...LONG_PATH.slice(0, 4), { label: 'Now' }] }, /levels has 5 levels/],
    ['a collapsed trail with three levels', { levels: PATH.slice(1), collapsed: true, ellipsisLabel: 'More' }, /collapsed trail needs 4 levels or more/],
    ['a level without a label', { levels: [{ label: '', href: '#h' }, { label: 'Now' }] }, /level 1 has no `label`/],
    ['a link without href', { levels: [{ label: 'Home' }, { label: 'Now' }] }, /level 1 is a link and needs an `href`/],
    ['the current page with an href', { levels: [{ label: 'Home', href: '#h' }, { label: 'Now', href: '#n' }] }, /current page and has no `href`/],
    ['an icon outside the core', { levels: [{ label: 'Home', href: '#h', icon: 'rocket' }, { label: 'Now', icon: 'file' }] }, /icon "rocket" of level 1 does not belong/],
    ['icons on only some levels', { levels: [{ label: 'Home', href: '#h', icon: 'house' }, { label: 'Now' }] }, /only some levels have an `icon`/],
    ['a collapsed trail without ellipsis-label', { levels: LONG_PATH, collapsed: true }, /needs `ellipsis-label`/],
    ['a collapsed trail with a blank ellipsis-label', { levels: LONG_PATH, collapsed: true, ellipsisLabel: '   ' }, /needs `ellipsis-label`/],
  ];

  for (const [cause, props, message] of cases) {
    it(`${cause}: renders nothing and complains once`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const trail = await mount(props);
      expect(trail.shadowRoot?.childElementCount).toBe(0);
      expect(trail.hasAttribute('data-nph-rendered')).toBe(false);
      expect(getComputedStyle(trail).display).toBe('none');
      const messages = error.mock.calls.map((call) => String(call[0]));
      expect(messages.filter((text) => message.test(text))).toHaveLength(1);
      expect(messages.every((text) => text.startsWith('[nph-breadcrumb]'))).toBe(true);
    });
  }

  it('a re-render with the same bad input stays silent', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const trail = await mount({ levels: [] });
    trail.label = 'Another name';
    await trail.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a rejected input keeps no hidden levels: the menu follows the path once the trail recovers', async () => {
    const trail = await mountCollapsed();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    trail.levels = [{ label: 'Start', href: '#start' }, { label: 'One', href: '#one' }, { label: 'Two', href: '#two' }, { label: 'Three', href: '#three' }, { label: 'Four' }];
    trail.ellipsisLabel = '';
    await trail.updateComplete;
    expect(trail.hasAttribute('data-nph-rendered')).toBe(false);
    trail.ellipsisLabel = 'Show hidden levels';
    await settle(trail);
    expect(menu(trail).items).toEqual([
      { value: '1', text: 'One' },
      { value: '2', text: 'Two' },
    ]);
  });

  it('draws again, with no leftover, once the input is fixed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const trail = await mount({ levels: [] });
    trail.levels = PATH;
    await trail.updateComplete;
    expect(trail.hasAttribute('data-nph-rendered')).toBe(true);
    expect(links(trail)).toHaveLength(3);
  });

  it('a trail with no accessible name draws, and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const trail = await mount({ label: null });
    expect(trail.hasAttribute('data-nph-rendered')).toBe(true);
    expect(nav(trail).hasAttribute('aria-label')).toBe(false);
    trail.levels = [...PATH];
    await trail.updateComplete;
    const messages = warn.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((text) => /no accessible name/.test(text))).toHaveLength(1);
  });

  it('the hidden attribute of the consumer still hides a valid trail', async () => {
    const trail = await mount();
    expect(getComputedStyle(trail).display).toBe('block');
    trail.hidden = true;
    await trail.updateComplete;
    expect(getComputedStyle(trail).display).toBe('none');
  });
});

describe('the levels', () => {
  it('draws two levels: the link and the current page', async () => {
    const trail = await mount({ levels: PATH.slice(2) });
    expect(parts(trail)).toHaveLength(2);
    expect(links(trail).map(labelOf)).toEqual(['Nephos']);
    expect(labelOf(current(trail))).toBe('Components');
    expect(separators(trail)).toHaveLength(1);
  });

  it('draws three levels', async () => {
    const trail = await mount({ levels: PATH.slice(1) });
    expect(links(trail).map(labelOf)).toEqual(['Projects', 'Nephos']);
    expect(labelOf(current(trail))).toBe('Components');
    expect(separators(trail)).toHaveLength(2);
  });

  it('draws four levels', async () => {
    const trail = await mount();
    expect(links(trail).map(labelOf)).toEqual(['Home', 'Projects', 'Nephos']);
    expect(labelOf(current(trail))).toBe('Components');
    expect(separators(trail)).toHaveLength(3);
    expect(ellipsis(trail)).toBeNull();
    expect(menu(trail)).toBeNull();
  });

  it('the links lead where the path says, and the current page is not a link', async () => {
    const trail = await mount();
    expect(links(trail).map((link) => link.getAttribute('href'))).toEqual(['#home', '#projects', '#nephos']);
    expect(current(trail).tagName).toBe('SPAN');
    expect(current(trail).closest('a')).toBeNull();
    expect(current(trail).hasAttribute('tabindex')).toBe(false);
  });

  it('the collapsed trail draws the first level, the ellipsis and the last two', async () => {
    const trail = await mountCollapsed();
    expect(parts(trail)).toHaveLength(4);
    expect(links(trail).map(labelOf)).toEqual(['Home', 'Navigation']);
    expect(labelOf(current(trail))).toBe('Breadcrumb');
    expect(parts(trail)[1]?.contains(ellipsis(trail))).toBe(true);
    expect(separators(trail)).toHaveLength(3);
  });

  it('a collapsed trail of four levels hides exactly one', async () => {
    const trail = await mountCollapsed({ levels: PATH });
    expect(links(trail).map(labelOf)).toEqual(['Home', 'Nephos']);
    expect(menu(trail).items).toEqual([{ value: '1', text: 'Projects' }]);
  });

  it('follows a new path with no leftover', async () => {
    const trail = await mount();
    trail.levels = PATH.slice(2);
    await trail.updateComplete;
    expect(parts(trail)).toHaveLength(2);
  });

  it('the text of a level is its label, on one line', async () => {
    const trail = await mount({ levels: [{ label: 'A very long label that would break in two lines in a narrow box', href: '#a' }, { label: 'Now' }] });
    trail.style.inlineSize = '120px';
    expect(links(trail)[0]?.getBoundingClientRect().height).toBeCloseTo(px('--nph-breadcrumb-line-height'), 0);
  });
});

describe('the icons', () => {
  it('without icons, none is drawn: only the separators', async () => {
    const trail = await mount();
    expect(levelIcons(trail)).toHaveLength(0);
  });

  it('with icons, every level has its own: light on a link, solid on the current page', async () => {
    const trail = await mount({ levels: PATH_WITH_ICONS });
    await settle(trail);
    const icons = levelIcons(trail);
    expect(icons.map((icon) => icon.name)).toEqual(['house', 'folder', 'star', 'file']);
    expect(icons.map((icon) => icon.variant)).toEqual(['light', 'light', 'light', 'solid']);
    expect(icons.every((icon) => icon.size === 'sm')).toBe(true);
    expect(current(trail).contains(icons[3] as NphIcon)).toBe(true);
  });

  it('the level icon is before the label, at breadcrumb/item-icon-size and breadcrumb/item-icon-gap from it', async () => {
    const trail = await mount({ levels: PATH_WITH_ICONS });
    await settle(trail);
    const link = links(trail)[0] as HTMLElement;
    const icon = link.querySelector('.level-icon') as HTMLElement;
    const label = link.querySelector('.label') as HTMLElement;
    const box = icon.getBoundingClientRect();
    expect(box.width).toBeCloseTo(px('--nph-breadcrumb-item-icon-size'), 0);
    expect(box.height).toBeCloseTo(px('--nph-breadcrumb-item-icon-size'), 0);
    expect(label.getBoundingClientRect().left - box.right).toBeCloseTo(px('--nph-breadcrumb-item-icon-gap'), 0);
  });

  it('the level icon takes the color of its label', async () => {
    const trail = await mount({ levels: PATH_WITH_ICONS });
    await settle(trail);
    expect(getComputedStyle(levelIcons(trail)[0] as NphIcon).color).toBe(getComputedStyle(links(trail)[0] as HTMLElement).color);
    expect(getComputedStyle(levelIcons(trail)[3] as NphIcon).color).toBe(getComputedStyle(current(trail)).color);
  });

  it('the icons are decorative: the name of the level is its label', async () => {
    const trail = await mount({ levels: PATH_WITH_ICONS });
    await settle(trail);
    expect((await axNode(links(trail)[0] as HTMLElement)).name).toBe('Home');
    expect(levelIcons(trail).every((icon) => (icon.label ?? '') === '')).toBe(true);
  });
});

describe('semantics', () => {
  it('is a navigation landmark, named by label, with an ordered list', async () => {
    const trail = await mount();
    expect(nav(trail).getAttribute('aria-label')).toBe('Breadcrumb');
    expect(list(trail).tagName).toBe('OL');
    expect(parts(trail).every((part) => part.parentElement === list(trail))).toBe(true);
    const node = await axNode(nav(trail));
    expect(node.role).toBe('navigation');
    expect(node.name).toBe('Breadcrumb');
  });

  it('the host aria-label is the name when there is no label; the label wins when both exist', async () => {
    const trail = document.createElement('nph-breadcrumb');
    trail.levels = PATH;
    trail.setAttribute('aria-label', 'You are here');
    document.body.append(trail);
    await trail.updateComplete;
    expect(nav(trail).getAttribute('aria-label')).toBe('You are here');
    trail.label = 'Path';
    await trail.updateComplete;
    expect(nav(trail).getAttribute('aria-label')).toBe('Path');
  });

  it('the current page is the only aria-current, with the value page', async () => {
    const trail = await mount();
    const marked = [...(trail.shadowRoot?.querySelectorAll('[aria-current]') ?? [])];
    expect(marked).toEqual([current(trail)]);
    expect(current(trail).getAttribute('aria-current')).toBe('page');
  });

  it('every level above is a link in the browser tree; the separators are hidden from it', async () => {
    const trail = await mount();
    for (const link of links(trail)) {
      expect((await axNode(link)).role).toBe('link');
    }
    expect(separators(trail).every((separator) => separator.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('the separator is the nph-icon chevron-right at breadcrumb/icon-size', async () => {
    const trail = await mount();
    await settle(trail);
    for (const separator of separators(trail)) {
      const icon = separator.querySelector('nph-icon') as NphIcon;
      expect(icon.name).toBe('chevron-right');
      expect(icon.size).toBe('sm');
      expect(icon.getBoundingClientRect().width).toBeCloseTo(px('--nph-breadcrumb-icon-size'), 0);
    }
  });

  it('the links take Tab in path order; the current page and the separators take none', async () => {
    const trail = await mount();
    await userEvent.keyboard('{Tab}');
    expect(trail.shadowRoot?.activeElement).toBe(links(trail)[0]);
    await userEvent.keyboard('{Tab}');
    expect(trail.shadowRoot?.activeElement).toBe(links(trail)[1]);
    await userEvent.keyboard('{Tab}');
    expect(trail.shadowRoot?.activeElement).toBe(links(trail)[2]);
    await userEvent.keyboard('{Tab}');
    expect(trail.shadowRoot?.activeElement).toBeNull();
  });
});

describe('the ellipsis', () => {
  it('is a native button of the shadow root, with its own accessible name', async () => {
    const trail = await mountCollapsed();
    const button = ellipsis(trail);
    expect(button.tagName).toBe('BUTTON');
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Show hidden levels');
    const node = await axNode(button);
    expect(node.role).toBe('button');
    expect(node.name).toBe('Show hidden levels');
  });

  it('the icon inside is the nph-icon ellipsis at breadcrumb/icon-size, centered', async () => {
    const trail = await mountCollapsed();
    const icon = ellipsis(trail).querySelector('nph-icon') as NphIcon;
    expect(icon.name).toBe('ellipsis');
    expect(icon.size).toBe('sm');
    const outer = ellipsis(trail).getBoundingClientRect();
    const inner = icon.getBoundingClientRect();
    expect(inner.width).toBeCloseTo(px('--nph-breadcrumb-icon-size'), 0);
    expect(inner.left + inner.width / 2).toBeCloseTo(outer.left + outer.width / 2, 0);
    expect(inner.top + inner.height / 2).toBeCloseTo(outer.top + outer.height / 2, 0);
  });

  it('is breadcrumb/ellipsis-target-size wide and tall: 24 x 24', async () => {
    const trail = await mountCollapsed();
    const box = ellipsis(trail).getBoundingClientRect();
    expect(box.width).toBe(px('--nph-breadcrumb-ellipsis-target-size'));
    expect(box.height).toBe(px('--nph-breadcrumb-ellipsis-target-size'));
    expect(box.width).toBe(24);
    expect(box.height).toBe(24);
  });

  it('the menu finds the button by for and writes aria-haspopup and aria-expanded on it', async () => {
    const trail = await mountCollapsed();
    expect(menu(trail).getAttribute('for')).toBe(ellipsis(trail).id);
    expect(ellipsis(trail).getAttribute('aria-haspopup')).toBe('menu');
    expect(ellipsis(trail).getAttribute('aria-expanded')).toBe('false');
  });

  it('a click opens the menu and the button says it is expanded; a second click closes it', async () => {
    const trail = await mountCollapsed();
    await openMenu(trail);
    expect(menu(trail).open).toBe(true);
    expect(ellipsis(trail).getAttribute('aria-expanded')).toBe('true');
    await userEvent.click(ellipsis(trail));
    await settle(trail);
    expect(menu(trail).open).toBe(false);
    expect(ellipsis(trail).getAttribute('aria-expanded')).toBe('false');
  });

  it('Enter, Space and the down arrow open it from the keyboard', async () => {
    for (const key of ['{Enter}', ' ', '{ArrowDown}']) {
      const trail = await mountCollapsed();
      await userEvent.keyboard('{Tab}{Tab}');
      expect(trail.shadowRoot?.activeElement).toBe(ellipsis(trail));
      await userEvent.keyboard(key);
      await settle(trail);
      await wait(300);
      expect(menu(trail).open, key).toBe(true);
      expect(ellipsis(trail).getAttribute('aria-expanded'), key).toBe('true');
      await clearPage();
    }
  });

  it('Esc closes the menu and gives the focus back to the ellipsis', async () => {
    const trail = await mountCollapsed();
    await userEvent.keyboard('{Tab}{Tab}{Enter}');
    await settle(trail);
    await wait(300);
    expect(menu(trail).open).toBe(true);
    await userEvent.keyboard('{Escape}');
    await settle(trail);
    await wait(300);
    expect(menu(trail).open).toBe(false);
    expect(trail.shadowRoot?.activeElement).toBe(ellipsis(trail));
  });

  it('is in the Tab order between the first level and the last two', async () => {
    const trail = await mountCollapsed();
    await userEvent.keyboard('{Tab}');
    expect(trail.shadowRoot?.activeElement).toBe(links(trail)[0]);
    await userEvent.keyboard('{Tab}');
    expect(trail.shadowRoot?.activeElement).toBe(ellipsis(trail));
    await userEvent.keyboard('{Tab}');
    expect(trail.shadowRoot?.activeElement).toBe(links(trail)[1]);
  });
});

describe('the hidden levels menu', () => {
  it('holds the hidden levels, in path order, with no header and no group label', async () => {
    const trail = await mountCollapsed();
    await openMenu(trail);
    expect(menuItems(trail).map((item) => item.textContent?.trim())).toEqual(['Projects', 'Nephos', 'Design system']);
    expect(menu(trail).header).toBeNull();
    expect(menu(trail).shadowRoot?.querySelector('.header')).toBeNull();
    expect(menu(trail).shadowRoot?.querySelector('.group-label')).toBeNull();
    expect(menu(trail).shadowRoot?.querySelectorAll('.separator')).toHaveLength(0);
  });

  it('the menu items are text only, with no icon, even when the levels have icons (D-2)', async () => {
    const icons = ['house', 'folder', 'star', 'file', 'bell', 'gear'];
    const withIcons = LONG_PATH.map((level, index) => ({ ...level, icon: icons[index] as string }));
    const trail = await mountCollapsed({ levels: withIcons });
    await openMenu(trail);
    expect(menu(trail).items.every((entry) => !('icon' in entry))).toBe(true);
    expect(menu(trail).shadowRoot?.querySelector('.item nph-icon.icon')).toBeNull();
  });

  it('opens below the ellipsis, aligned to its start edge', async () => {
    const trail = await mountCollapsed();
    await openMenu(trail);
    const anchor = ellipsis(trail).getBoundingClientRect();
    const box = panel(trail).getBoundingClientRect();
    expect(box.top).toBeGreaterThanOrEqual(anchor.bottom);
    expect(box.left).toBeCloseTo(anchor.left, 0);
  });

  it('activating a hidden level clicks an anchor with its href: the same native click of a visible link', async () => {
    const trail = await mountCollapsed();
    /* The path is read while the event is dispatched: it is empty afterwards. */
    const seen: { anchor: HTMLElement; bubbles: boolean; composed: boolean; cancelable: boolean }[] = [];
    document.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        const anchor = event.composedPath()[0] as HTMLElement;
        if (anchor.tagName === 'A') {
          seen.push({ anchor, bubbles: event.bubbles, composed: event.composed, cancelable: event.cancelable });
        }
      },
      { capture: true, signal: listeners.signal },
    );
    await openMenu(trail);
    await userEvent.click(menuItems(trail)[1] as HTMLElement);
    await settle(trail);
    expect(seen).toHaveLength(1);
    const { anchor, bubbles, composed, cancelable } = seen[0] as (typeof seen)[number];
    expect(anchor.getAttribute('href')).toBe('#nephos');
    expect(bubbles).toBe(true);
    expect(composed).toBe(true);
    expect(cancelable).toBe(true);
    expect(trail.shadowRoot?.contains(anchor)).toBe(true);
    expect(menu(trail).open).toBe(false);
  });

  it('the proxy anchor is never drawn and never reached by the keyboard or the reader', async () => {
    const trail = await mountCollapsed();
    const proxy = trail.shadowRoot?.querySelector('a.proxy') as HTMLAnchorElement;
    expect(proxy.hasAttribute('hidden')).toBe(true);
    expect(getComputedStyle(proxy).display).toBe('none');
    expect(links(trail)).not.toContain(proxy);
  });

  it('a hidden level activated from the keyboard leads the same way', async () => {
    const trail = await mountCollapsed();
    const destinations: string[] = [];
    document.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        const anchor = event.composedPath()[0] as HTMLElement;
        if (anchor.tagName === 'A') destinations.push(anchor.getAttribute('href') ?? '');
      },
      { capture: true, signal: listeners.signal },
    );
    await userEvent.keyboard('{Tab}{Tab}{ArrowDown}');
    await settle(trail);
    await wait(300);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await settle(trail);
    expect(destinations).toEqual(['#nephos']);
    expect(trail.shadowRoot?.activeElement).toBe(ellipsis(trail));
  });

  it('the event of the menu does not leave the trail', async () => {
    const trail = await mountCollapsed();
    const seen = vi.fn();
    document.body.addEventListener('nph-item-select', seen, { signal: listeners.signal });
    document.addEventListener('click', (event) => event.preventDefault(), { capture: true, signal: listeners.signal });
    await openMenu(trail);
    await userEvent.click(menuItems(trail)[0] as HTMLElement);
    await settle(trail);
    expect(seen).not.toHaveBeenCalled();
  });

  it('follows a new path: the menu lists the new hidden levels', async () => {
    const trail = await mountCollapsed();
    trail.levels = [...LONG_PATH.slice(0, 3), { label: 'Extra', href: '#extra' }, ...LONG_PATH.slice(3)];
    await settle(trail);
    expect(menu(trail).items.map((entry) => (entry as { text: string }).text)).toEqual(['Projects', 'Nephos', 'Extra', 'Design system']);
  });
});

describe('the width of the menu', () => {
  const MIN = 128;
  const MAX = 280;

  const withLabels = (labels: string[]): NphBreadcrumbLevel[] => [
    { label: 'Home', href: '#home' },
    ...labels.map((label, index) => ({ label, href: `#hidden-${String(index)}` })),
    { label: 'Penultimate', href: '#penultimate' },
    { label: 'Current' },
  ];

  it('has the floor and the ceiling of the tokens: 128 and 280', () => {
    expect(px('--nph-breadcrumb-menu-min-width')).toBe(MIN);
    expect(px('--nph-breadcrumb-menu-max-width')).toBe(MAX);
  });

  it('a short option does not take the menu under the floor', async () => {
    const trail = await mountCollapsed({ levels: withLabels(['Docs']) });
    await openMenu(trail);
    expect(panel(trail).getBoundingClientRect().width).toBe(MIN);
  });

  it('hugs the widest option between the floor and the ceiling', async () => {
    const narrow = await mountCollapsed({ levels: withLabels(['Reports and charts']) });
    await openMenu(narrow);
    const first = panel(narrow).getBoundingClientRect().width;
    expect(first).toBeGreaterThan(MIN);
    expect(first).toBeLessThan(MAX);
    await clearPage();
    const wider = await mountCollapsed({ levels: withLabels(['Reports and charts', 'Reports and charts of the year']) });
    await openMenu(wider);
    expect(panel(wider).getBoundingClientRect().width).toBeGreaterThan(first);
    expect(panel(wider).getBoundingClientRect().width).toBeLessThan(MAX);
  });

  it('an option past the ceiling is cut with an ellipsis, and the menu stops at 280', async () => {
    const long = 'A level label so long that it goes well past the ceiling of the hidden levels menu';
    const trail = await mountCollapsed({ levels: withLabels([long, 'Short']) });
    await openMenu(trail);
    expect(panel(trail).getBoundingClientRect().width).toBe(MAX);
    const text = menu(trail).shadowRoot?.querySelector('.text') as HTMLElement;
    expect(text.textContent?.trim()).toBe(long);
    expect(getComputedStyle(text).textOverflow).toBe('ellipsis');
    expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
  });

  it('holds only in the breadcrumb: a menu of its own keeps layout/input-width', async () => {
    const lone = document.createElement('nph-dropdown-menu');
    lone.items = [{ value: 'a', text: 'Docs' }];
    expect(getComputedStyle(lone).getPropertyValue('--nph-layout-input-width')).toBe('');
    expect(resolved('width', '--nph-layout-input-width')).toBe(`${String(MAX)}px`);
  });

  it('the rule is written in the CSS of the breadcrumb: the ceiling for every browser, the floor where calc-size exists', () => {
    expect(componentCss).toMatch(/--nph-layout-input-width:\s*fit-content\(var\(--nph-breadcrumb-menu-max-width\)\)/);
    expect(componentCss).toMatch(/@supports \(inline-size: calc-size\(fit-content, size\)\)/);
    expect(componentCss).toMatch(/calc-size\(fit-content, clamp\(var\(--nph-breadcrumb-menu-min-width\), size, var\(--nph-breadcrumb-menu-max-width\)\)\)/);
  });
});

describe('colors, type and measures', () => {
  it('the link: breadcrumb/link-foreground, regular weight, Noto Sans 14 with a 20 line', async () => {
    const trail = await mount();
    const style = getComputedStyle(links(trail)[0] as HTMLElement);
    expect(style.color).toBe(resolved('color', '--nph-breadcrumb-link-foreground'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-breadcrumb-link-font-weight'));
    expect(style.fontWeight).toBe('400');
    expect(style.fontSize).toBe(resolved('font-size', '--nph-breadcrumb-font-size'));
    expect(style.fontSize).toBe('14px');
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-breadcrumb-line-height'));
    expect(style.lineHeight).toBe('20px');
    expect(style.fontFamily).toContain('Noto Sans');
    expect(style.letterSpacing).toBe(resolved('letter-spacing', '--nph-breadcrumb-letter-spacing'));
    expect(getComputedStyle(links(trail)[0]?.querySelector('.label') as HTMLElement).textDecorationLine).toBe('none');
  });

  it('the current page: breadcrumb/current-foreground and medium weight', async () => {
    const trail = await mount();
    const style = getComputedStyle(current(trail));
    expect(style.color).toBe(resolved('color', '--nph-breadcrumb-current-foreground'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-breadcrumb-current-font-weight'));
    expect(style.fontWeight).toBe('500');
    expect(style.cursor).not.toBe('pointer');
  });

  it('the current page has the highest contrast of the trail: a different color and a heavier weight than a link', async () => {
    const trail = await mount();
    expect(getComputedStyle(current(trail)).color).not.toBe(getComputedStyle(links(trail)[0] as HTMLElement).color);
    expect(Number(getComputedStyle(current(trail)).fontWeight)).toBeGreaterThan(Number(getComputedStyle(links(trail)[0] as HTMLElement).fontWeight));
  });

  it('on hover the link takes breadcrumb/link-foreground-hover and an underline', async () => {
    const trail = await mount();
    await userEvent.hover(links(trail)[0] as HTMLElement);
    const link = links(trail)[0] as HTMLElement;
    expect(getComputedStyle(link).color).toBe(resolved('color', '--nph-breadcrumb-link-foreground-hover'));
    expect(getComputedStyle(link.querySelector('.label') as HTMLElement).textDecorationLine).toBe('underline');
    await userEvent.unhover(link);
    expect(getComputedStyle(link).color).toBe(resolved('color', '--nph-breadcrumb-link-foreground'));
    expect(getComputedStyle(link.querySelector('.label') as HTMLElement).textDecorationLine).toBe('none');
  });

  it('the separator is breadcrumb/separator-foreground', async () => {
    const trail = await mount();
    expect(getComputedStyle(separators(trail)[0] as HTMLElement).color).toBe(resolved('color', '--nph-breadcrumb-separator-foreground'));
  });

  it('the gap between the parts is breadcrumb/gap: link, separator and link sit 32 px apart', async () => {
    const trail = await mount();
    expect(Number.parseFloat(getComputedStyle(list(trail)).columnGap)).toBe(px('--nph-breadcrumb-gap'));
    const first = links(trail)[0] as HTMLElement;
    const second = links(trail)[1] as HTMLElement;
    const between = second.getBoundingClientRect().left - first.getBoundingClientRect().right;
    expect(between).toBeCloseTo(2 * px('--nph-breadcrumb-gap') + px('--nph-breadcrumb-icon-size'), 0);
    expect(between).toBeCloseTo(32, 0);
    const separator = (separators(trail)[0] as HTMLElement).getBoundingClientRect();
    expect(separator.left - first.getBoundingClientRect().right).toBeCloseTo(px('--nph-breadcrumb-gap'), 0);
  });

  it('a link is 20 px tall: breadcrumb/line-height', async () => {
    const trail = await mount();
    expect((links(trail)[0] as HTMLElement).getBoundingClientRect().height).toBe(px('--nph-breadcrumb-line-height'));
  });

  it('the item radius is breadcrumb/item-radius on the link, the current page and the ellipsis', async () => {
    const trail = await mountCollapsed();
    const radius = resolved('border-top-left-radius', '--nph-breadcrumb-item-radius');
    expect(getComputedStyle(links(trail)[0] as HTMLElement).borderTopLeftRadius).toBe(radius);
    expect(getComputedStyle(current(trail)).borderTopLeftRadius).toBe(radius);
    expect(getComputedStyle(ellipsis(trail)).borderTopLeftRadius).toBe(radius);
  });

  it('the ellipsis at rest: no background, breadcrumb/ellipsis-foreground', async () => {
    const trail = await mountCollapsed();
    const style = getComputedStyle(ellipsis(trail));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.color).toBe(resolved('color', '--nph-breadcrumb-ellipsis-foreground'));
  });

  it('the ellipsis on hover: breadcrumb/ellipsis-background-hover and breadcrumb/ellipsis-foreground-hover', async () => {
    const trail = await mountCollapsed();
    await userEvent.hover(ellipsis(trail));
    const style = getComputedStyle(ellipsis(trail));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-breadcrumb-ellipsis-background-hover'));
    expect(style.color).toBe(resolved('color', '--nph-breadcrumb-ellipsis-foreground-hover'));
  });

  it('the ellipsis with the menu open keeps the hover look, with the pointer away', async () => {
    const trail = await mountCollapsed();
    await openMenu(trail);
    await userEvent.unhover(ellipsis(trail));
    await userEvent.hover(document.body);
    expect(ellipsis(trail).getAttribute('aria-expanded')).toBe('true');
    const style = getComputedStyle(ellipsis(trail));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-breadcrumb-ellipsis-background-hover'));
    expect(style.color).toBe(resolved('color', '--nph-breadcrumb-ellipsis-foreground-hover'));
  });

  it('the trail is theme-aware: the colors follow data-nph-color-scheme', async () => {
    const trail = await mount();
    const light = getComputedStyle(current(trail)).color;
    document.body.setAttribute('data-nph-color-scheme', 'dark');
    const dark = getComputedStyle(current(trail)).color;
    document.body.removeAttribute('data-nph-color-scheme');
    expect(dark).not.toBe(light);
  });
});

describe('focus', () => {
  it('keyboard focus on a link: breadcrumb/link-foreground-focus, the focus border and the halo outside', async () => {
    const trail = await mount();
    await userEvent.keyboard('{Tab}');
    const link = links(trail)[0] as HTMLElement;
    expect(trail.shadowRoot?.activeElement).toBe(link);
    expect(getComputedStyle(link).color).toBe(resolved('color', '--nph-breadcrumb-link-foreground-focus'));
    const border = getComputedStyle(link, '::before');
    const halo = getComputedStyle(link, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(Number.parseFloat(border.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(Number.parseFloat(halo.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
    expect(Number.parseFloat(border.top)).toBeCloseTo(-px('--nph-border-width'), 1);
  });

  it('keyboard focus on the ellipsis: the same border and halo, and the icon keeps the color of rest', async () => {
    const trail = await mountCollapsed();
    await userEvent.keyboard('{Tab}{Tab}');
    const button = ellipsis(trail);
    expect(trail.shadowRoot?.activeElement).toBe(button);
    const border = getComputedStyle(button, '::before');
    const halo = getComputedStyle(button, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
    expect(getComputedStyle(button).color).toBe(resolved('color', '--nph-breadcrumb-ellipsis-foreground'));
  });

  it('a mouse click gives no focus ring', async () => {
    const trail = await mountCollapsed();
    await userEvent.click(ellipsis(trail));
    expect(getComputedStyle(ellipsis(trail), '::before').content).toBe('none');
  });

  it('the current page takes no focus and shows none', async () => {
    const trail = await mount();
    expect(current(trail).tabIndex).toBe(-1);
    expect(getComputedStyle(current(trail), '::before').content).toBe('none');
  });
});

describe('writing direction and one line', () => {
  it('the separator points forward in left-to-right writing and mirrors in right-to-left', async () => {
    const trail = await mount();
    const icon = (separators(trail)[0] as HTMLElement).querySelector('nph-icon') as HTMLElement;
    expect(getComputedStyle(icon).scale).toBe('none');
    document.documentElement.setAttribute('dir', 'rtl');
    expect(getComputedStyle(icon).scale).toBe('-1 1');
  });

  it('in right-to-left writing the trail reads from the right, and the menu opens from the ellipsis', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const trail = await mountCollapsed();
    const first = links(trail)[0] as HTMLElement;
    const last = current(trail);
    expect(first.getBoundingClientRect().right).toBeGreaterThan(last.getBoundingClientRect().right);
    await openMenu(trail);
    expect(menu(trail).open).toBe(true);
  });

  it('never wraps: a trail wider than its box overflows on one line', async () => {
    const trail = await mount({ levels: PATH_WITH_ICONS });
    trail.style.inlineSize = '160px';
    await frame();
    const tops = new Set(parts(trail).map((part) => Math.round(part.getBoundingClientRect().top)));
    expect(tops.size).toBe(1);
    expect(list(trail).getBoundingClientRect().height).toBe(px('--nph-breadcrumb-line-height'));
    expect(getComputedStyle(list(trail)).flexWrap).toBe('nowrap');
  });

  it('keeps its own height when collapsed: the ellipsis button is the tallest part', async () => {
    const trail = await mountCollapsed();
    expect(list(trail).getBoundingClientRect().height).toBe(px('--nph-breadcrumb-ellipsis-target-size'));
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  /** The 22 `breadcrumb/*` tokens of the evidence. */
  const BREADCRUMB_TOKENS = [
    'link-foreground',
    'link-foreground-hover',
    'link-foreground-focus',
    'current-foreground',
    'separator-foreground',
    'ellipsis-foreground',
    'ellipsis-foreground-hover',
    'ellipsis-background-hover',
    'icon-size',
    'item-icon-size',
    'item-icon-gap',
    'item-radius',
    'gap',
    'menu-min-width',
    'menu-max-width',
    'ellipsis-target-size',
    'font-family',
    'font-size',
    'line-height',
    'letter-spacing',
    'link-font-weight',
    'current-font-weight',
  ].map((name) => `--nph-breadcrumb-${name}`);

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('consumes the 22 breadcrumb tokens of the evidence, and the focus tokens', () => {
    for (const name of BREADCRUMB_TOKENS) {
      expect(used, name).toContain(name);
    }
    expect(BREADCRUMB_TOKENS).toHaveLength(22);
    for (const name of [
      '--nph-focus-border',
      '--nph-border-width',
      '--nph-focus-border-radius-control',
      '--nph-focus-halo',
      '--nph-focus-ring-width',
      '--nph-focus-radius-control-with-border',
    ]) {
      expect(used, name).toContain(name);
    }
  });

  it('never consumes a core or theme token, nor a text style the evidence does not use', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/--nph-text-body-md/);
  });

  it('the CSS has no literal color, measure or duration', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/);
  });
});
