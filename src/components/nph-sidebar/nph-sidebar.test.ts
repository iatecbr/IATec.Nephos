/**
 * Tests of `nph-sidebar` (P116), in a real browser (P21, item 5): geometry of the panels,
 * keyboard focus, the top layer and the modal dialog only exist where there is layout.
 *
 * They check the API and its defaults, the invalid input, the three modes, the loading state,
 * the flyout panels (where they open, what closes them, where the focus goes), the mobile menu
 * (the dialog, the scrim, the focus), the events, the focus of the collapse and close buttons
 * on `focus/border`, and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import disclosureCss from '../nph-collapsible/nph-collapsible.disclosure.css?raw';
import componentCss from './nph-sidebar.css?raw';
import { NPH_SIDEBAR_MODES, NPH_SIDEBAR_NAVIGATION_MODES, NphSidebar } from './nph-sidebar';
import type { NphSidebarEntry } from './nph-sidebar';
import type { NphSidebarItem } from '../nph-sidebar-item/nph-sidebar-item';
import type { NphSidebarRailButton } from '../nph-sidebar-rail-button/nph-sidebar-rail-button';
import type { NphSidebarSubitem } from '../nph-sidebar-subitem/nph-sidebar-subitem';

beforeAll(async () => {
  /* Room for a panel next to a menu: the default viewport of the browser tests is a phone. */
  await page.viewport(1280, 900);
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

const ITEMS: NphSidebarEntry[] = [
  { type: 'label', text: 'Main' },
  { label: 'Home', icon: 'house', href: '#home', active: true, value: 'home' },
  { label: 'Inbox', icon: 'inbox', href: '#inbox', counter: 12, value: 'inbox' },
  {
    type: 'group',
    label: 'Reports',
    icon: 'folder',
    value: 'reports',
    children: [
      { label: 'Monthly', href: '#monthly' },
      { label: 'Annual', href: '#annual', disabled: true },
      {
        label: 'By team',
        options: [
          { label: 'Alpha', href: '#alpha' },
          { label: 'Beta', href: '#beta', active: true },
        ],
      },
    ],
  },
  { type: 'label', text: 'Admin' },
  { type: 'group', label: 'Settings', icon: 'gear', value: 'settings', children: [{ label: 'Profile', href: '#profile' }] },
];

const TEXT = {
  label: 'Main menu',
  collapseLabel: 'Collapse menu',
  expandLabel: 'Expand menu',
  closeLabel: 'Close menu',
  searchLabel: 'Search',
  cornerLabel: 'All applications',
};

async function settle(sidebar: NphSidebar): Promise<void> {
  await sidebar.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  for (const inner of sidebar.shadowRoot?.querySelectorAll('nph-sidebar-item, nph-sidebar-subitem, nph-sidebar-rail-button, nph-button, nph-input, nph-tooltip, nph-skeleton') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
}

async function mount(props: Partial<NphSidebar> = {}): Promise<NphSidebar> {
  const host = document.createElement('div');
  host.style.blockSize = '640px';
  const sidebar = document.createElement('nph-sidebar');
  Object.assign(sidebar, { items: ITEMS, ...TEXT, ...props });
  host.append(sidebar);
  document.body.append(host);
  await settle(sidebar);
  return sidebar;
}

const root = (sidebar: NphSidebar): ShadowRoot => sidebar.shadowRoot as ShadowRoot;
const one = <T extends HTMLElement>(sidebar: NphSidebar, selector: string): T | null => root(sidebar).querySelector<T>(selector);
const all = <T extends HTMLElement>(sidebar: NphSidebar, selector: string): T[] => [...root(sidebar).querySelectorAll<T>(selector)];
const item = (sidebar: NphSidebar, path: number): NphSidebarItem => one(sidebar, `nph-sidebar-item[data-path="${path}"]`) as NphSidebarItem;
const rail = (sidebar: NphSidebar, path: number): NphSidebarRailButton =>
  one(sidebar, `nph-sidebar-rail-button[data-path="${path}"]`) as NphSidebarRailButton;
const subitem = (sidebar: NphSidebar, path: string): NphSidebarSubitem => one(sidebar, `nph-sidebar-subitem[data-path="${path}"]`) as NphSidebarSubitem;
const flyouts = (sidebar: NphSidebar): HTMLElement[] => all(sidebar, '.flyout');
const innerControl = (host: HTMLElement): HTMLElement => host.shadowRoot?.querySelector('.control') as HTMLElement;
/** The element that has the focus, inside shadow roots too. */
function deepActive(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

/** Tab from a field placed before the menu until `target` has the focus: the keyboard's focus, so `:focus-visible` holds. */
async function tabTo(sidebar: NphSidebar, target: Element): Promise<void> {
  const before = document.createElement('input');
  (sidebar.parentElement as HTMLElement).before(before);
  before.focus();
  for (let press = 0; press < 40; press += 1) {
    await userEvent.keyboard('{Tab}');
    if (deepActive() === target) return;
  }
  throw new Error('the focus never reached the target');
}

const pause = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** A panel is entered when its enter transition has finished. */
async function entered(sidebar: NphSidebar): Promise<void> {
  await settle(sidebar);
  await vi.waitFor(() => {
    for (const panel of flyouts(sidebar)) {
      expect(getComputedStyle(panel).opacity).toBe('1');
      expect(getComputedStyle(panel).translate).toBe('none');
    }
  });
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));

/** The name and description the browser computes for an element, read from its accessibility tree. */
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
  it('registers nph-sidebar once and has open Shadow DOM, no slot and no part', async () => {
    expect(customElements.get('nph-sidebar')).toBe(NphSidebar);
    const sidebar = await mount();
    expect(sidebar.shadowRoot?.mode).toBe('open');
    expect(root(sidebar).querySelector('slot')).toBeNull();
    expect(root(sidebar).querySelector('[part]')).toBeNull();
  });

  it('the public API is exactly P116', () => {
    const declared = [...(NphSidebar as unknown as { elementProperties: Map<string, { state?: boolean }> }).elementProperties]
      .filter(([, options]) => options.state !== true)
      .map(([name]) => name);
    expect(declared.sort()).toEqual(
      [
        'closeLabel',
        'collapseLabel',
        'cornerLabel',
        'emptyText',
        'errorText',
        'expandLabel',
        'hideCollapseButton',
        'hideCornerButton',
        'items',
        'label',
        'loading',
        'logoHref',
        'logoLabel',
        'logoMarkSrc',
        'logoSrc',
        'mode',
        'navigation',
        'open',
        'searchLabel',
        'searchPlaceholder',
        'searchValue',
      ].sort(),
    );
  });

  it('has the defaults: expanded, closed, ready, both buttons on', () => {
    const sidebar = document.createElement('nph-sidebar');
    expect(sidebar.mode).toBe('expanded');
    expect(sidebar.open).toBe(false);
    expect(sidebar.loading).toBe(false);
    expect(sidebar.hideCollapseButton).toBe(false);
    expect(sidebar.hideCornerButton).toBe(false);
    expect(sidebar.items).toEqual([]);
    expect(NPH_SIDEBAR_MODES).toEqual(['expanded', 'collapsed', 'mobile']);
    expect(sidebar.navigation).toBe('flyout');
    expect(NPH_SIDEBAR_NAVIGATION_MODES).toEqual(['flyout', 'panel-menu']);
  });

  it('reflects mode, open and loading, which the CSS reads', async () => {
    const sidebar = await mount({ mode: 'collapsed', loading: true });
    expect(sidebar.getAttribute('mode')).toBe('collapsed');
    expect(sidebar.hasAttribute('loading')).toBe(true);
    sidebar.mode = 'mobile';
    sidebar.open = true;
    await settle(sidebar);
    expect(sidebar.hasAttribute('open')).toBe(true);
  });
});

describe('invalid input', () => {
  it('a mode outside the three renders nothing and complains once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const sidebar = await mount({ mode: 'wide' as never });
    expect(root(sidebar).childElementCount).toBe(0);
    expect(getComputedStyle(sidebar).display).toBe('none');
    expect(error.mock.calls.filter((call) => /mode "wide" does not exist/.test(String(call[0])))).toHaveLength(1);
    sidebar.requestUpdate();
    await sidebar.updateComplete;
    expect(error.mock.calls.filter((call) => /mode "wide"/.test(String(call[0])))).toHaveLength(1);
  });

  it('a missing label warns once and still draws, as nph-input does', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const sidebar = await mount({ label: '' });
    expect(one(sidebar, 'nav')).not.toBeNull();
    expect(error.mock.calls.filter((call) => /label is empty/.test(String(call[0])))).toHaveLength(1);
  });

  it('a button with no name is not drawn, with one error each', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const sidebar = await mount({ collapseLabel: '', expandLabel: '' });
    expect(one(sidebar, '.toggle')).toBeNull();
    sidebar.mode = 'mobile';
    sidebar.closeLabel = '';
    await settle(sidebar);
    expect(one(sidebar, '.close')).toBeNull();
    const messages = error.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((message) => /collapse-label and expand-label are empty/.test(message))).toHaveLength(1);
    expect(messages.filter((message) => /close-label is empty/.test(message))).toHaveLength(1);
  });

  it('every entry that cannot be drawn is left out with its own error, and the rest is drawn', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bad = [
      { label: 'No icon', icon: 'not-an-icon', href: '#x' },
      { label: 'No href', icon: 'house' },
      { type: 'group', label: 'No children', icon: 'folder', children: [] },
      { type: 'group', label: 'Both', icon: 'folder', children: [{ label: 'Sub', href: '#s', options: [{ label: 'A', href: '#a' }] }] },
      { type: 'group', label: 'Current options', icon: 'folder', children: [{ label: 'Sub', active: true, options: [{ label: 'A', href: '#a' }] }] },
      { type: 'group', label: 'Empty options', icon: 'folder', children: [{ label: 'Sub', options: [] }] },
      { type: 'tab', label: 'Tab', icon: 'house' },
      { type: 'label', text: '' },
      null,
      { label: 'Fine', icon: 'house', href: '#fine' },
    ] as unknown as NphSidebarEntry[];
    const sidebar = await mount({ items: bad });
    expect(all(sidebar, 'nph-sidebar-item')).toHaveLength(1);
    const messages = error.mock.calls.map((call) => String(call[0]));
    for (const cause of [/not a core name/, /needs an href/, /needs children/, /has options and an href/, /has options and is active/, /needs at least one option/, /type "tab"/, /label with no text/, /not an entry/]) {
      expect(messages.filter((message) => cause.test(message)).length, String(cause)).toBeGreaterThanOrEqual(1);
    }
    expect(new Set(messages).size).toBe(messages.length);
  });

  it('an empty list is a mount: the panel, and no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const sidebar = await mount({ items: [] });
    expect(one(sidebar, 'nav')).not.toBeNull();
    expect(error).not.toHaveBeenCalled();
  });
});

describe('the expanded menu', () => {
  it('is a navigation landmark with its name, and the pieces are the ones of DSA-53 by instance', async () => {
    const sidebar = await mount();
    const nav = one(sidebar, 'nav') as HTMLElement;
    expect(nav.getAttribute('aria-label')).toBe('Main menu');
    const node = await axNode(nav);
    expect(node.role).toBe('navigation');
    expect(node.name).toBe('Main menu');
    expect(all(sidebar, 'nph-sidebar-item').map((element) => (element as NphSidebarItem).label)).toEqual(['Home', 'Inbox', 'Reports', 'Settings']);
    expect(all(sidebar, 'nph-sidebar-rail-button')).toHaveLength(0);
    expect(item(sidebar, 3).type).toBe('group');
    expect(item(sidebar, 2).counter).toBe(12);
    expect(item(sidebar, 1).active).toBe(true);
    expect(item(sidebar, 2).active).toBe(false);
    expect(item(sidebar, 2).href).toBe('#inbox');
  });

  it('draws the group labels above their groups, without uppercase, in heading-2xs and sidebar/group-label', async () => {
    const sidebar = await mount();
    const labels = all(sidebar, '.group-label');
    expect(labels.map((label) => label.textContent?.trim())).toEqual(['Main', 'Admin']);
    const style = getComputedStyle(labels[0] as HTMLElement);
    expect(style.textTransform).toBe('none');
    expect(style.color).toBe(resolved('color', '--nph-sidebar-group-label'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-heading-2xs-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-heading-2xs-font-weight'));
    const group = (labels[0] as HTMLElement).parentElement as HTMLElement;
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-labelledby')).toBe((labels[0] as HTMLElement).id);
  });

  it('the active item carries aria-current and the group opens its subitems, indented, with aria-expanded and aria-controls', async () => {
    const sidebar = await mount();
    expect(innerControl(item(sidebar, 2)).getAttribute('aria-current')).toBeNull();
    const home = all<NphSidebarItem>(sidebar, 'nph-sidebar-item')[0] as NphSidebarItem;
    expect(innerControl(home).getAttribute('aria-current')).toBe('page');
    const group = item(sidebar, 3);
    const list = one(sidebar, '#subitems-3') as HTMLElement;
    expect(list.hasAttribute('hidden')).toBe(true);
    const button = innerControl(group) as HTMLElement & { ariaControlsElements: readonly Element[] | null };
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.ariaControlsElements).toEqual([list]);
    await userEvent.click(button);
    await settle(sidebar);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(list.hasAttribute('hidden')).toBe(false);
    expect(all(sidebar, 'nph-sidebar-subitem').map((element) => (element as NphSidebarSubitem).label)).toEqual(['Monthly', 'Annual', 'By team', 'Profile']);
    const label = (innerControl(group).querySelector('.label') as HTMLElement).getBoundingClientRect().left;
    const first = (innerControl(subitem(sidebar, '3/0')).querySelector('.label') as HTMLElement).getBoundingClientRect().left;
    expect(first).toBeCloseTo(label, 0);
  });

  it('a group toggled by the person fires nph-group-toggle once, with its value, and the list is new: the objects of the consumer stay', async () => {
    const sidebar = await mount();
    const original = sidebar.items;
    const events: Array<{ value: string; expanded: boolean }> = [];
    const leaked = vi.fn();
    document.body.addEventListener('nph-toggle', leaked);
    sidebar.addEventListener('nph-group-toggle', (event) => {
      expect(event.composed).toBe(true);
      events.push({ ...event.detail });
    });
    await userEvent.click(innerControl(item(sidebar, 3)));
    await settle(sidebar);
    expect(events).toEqual([{ value: 'reports', expanded: true }]);
    expect(leaked).not.toHaveBeenCalled();
    expect(sidebar.items).not.toBe(original);
    expect((original[3] as { expanded?: boolean }).expanded).toBeUndefined();
    expect((sidebar.items[3] as { expanded?: boolean }).expanded).toBe(true);
    expect(item(sidebar, 3).expanded).toBe(true);
  });

  it('a group opened from the data starts open, and setting items from code fires nothing', async () => {
    const seen = vi.fn();
    const open: NphSidebarEntry[] = [{ ...(ITEMS[3] as object), expanded: true } as NphSidebarEntry];
    const sidebar = document.createElement('nph-sidebar');
    sidebar.addEventListener('nph-group-toggle', seen);
    Object.assign(sidebar, { items: open, ...TEXT });
    document.body.append(sidebar);
    await settle(sidebar);
    expect(item(sidebar, 0).expanded).toBe(true);
    expect(one(sidebar, '.subitems')?.hasAttribute('hidden')).toBe(false);
    expect(seen).not.toHaveBeenCalled();
  });

  it('the logo is a link with the name of the product, full in the expanded mode', async () => {
    const sidebar = await mount({ logoSrc: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>', logoLabel: 'Nephos', logoHref: '#home' });
    const logo = one(sidebar, 'a.logo') as HTMLAnchorElement;
    expect(logo.getAttribute('href')).toBe('#home');
    expect(logo.getAttribute('aria-label')).toBe('Nephos');
    expect(logo.querySelector('img')?.getAttribute('alt')).toBe('');
    const node = await axNode(logo);
    expect(node.role).toBe('link');
    expect(node.name).toBe('Nephos');
    expect(Number.parseFloat(getComputedStyle(logo).maxHeight)).toBeCloseTo(px('--nph-sidebar-logo-max-height'), 0);
  });

  it('a logo without an href is an image named by logo-label; without a src, there is no logo', async () => {
    const sidebar = await mount({ logoSrc: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>', logoLabel: 'Nephos' });
    expect(one(sidebar, 'a.logo')).toBeNull();
    expect(one(sidebar, 'span.logo img')?.getAttribute('alt')).toBe('Nephos');
    sidebar.logoSrc = '';
    await settle(sidebar);
    expect(one(sidebar, '.logo')).toBeNull();
  });

  it('measures: the panel width, the panel padding, the corner radius and the 1 px border in sidebar/panel-border', async () => {
    const sidebar = await mount();
    const panel = one(sidebar, '.panel') as HTMLElement;
    const style = getComputedStyle(panel);
    expect(panel.getBoundingClientRect().width).toBeCloseTo(px('--nph-sidebar-panel-width'), 0);
    expect(Number.parseFloat(style.paddingLeft)).toBeCloseTo(px('--nph-sidebar-panel-spacing'), 0);
    expect(Number.parseFloat(style.paddingTop)).toBeCloseTo(px('--nph-space-section'), 0);
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-sidebar-panel-radius'));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-sidebar-panel-border'));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-sidebar-panel-background'));
    expect(style.boxShadow).toBe('none');
    expect(panel.getBoundingClientRect().height).toBeCloseTo(640, 0);
  });

  it('the search is an nph-input on the sidebar/search-* tokens, with one separator after it, and fires nph-search-change', async () => {
    const sidebar = await mount();
    const search = one(sidebar, 'nph-search, nph-input.search') as HTMLElement & { value: string; label: string; type: string };
    expect(search.label).toBe('Search');
    expect(search.type).toBe('search');
    const field = (search.shadowRoot as ShadowRoot).querySelector('.control') as HTMLElement;
    expect(getComputedStyle(field).borderTopColor).toBe(resolved('color', '--nph-sidebar-search-border'));
    expect(getComputedStyle(field).borderBottomColor).toBe(resolved('color', '--nph-input-border-bottom'));
    expect(getComputedStyle(field).backgroundColor).toBe(resolved('background-color', '--nph-sidebar-search-background'));
    expect(search.getBoundingClientRect().width).toBeCloseTo((one(sidebar, '.nav') as HTMLElement).getBoundingClientRect().width, 0);
    const separators = all(sidebar, '.separator');
    expect(separators).toHaveLength(1);
    const events: string[] = [];
    sidebar.addEventListener('nph-search-change', (event) => events.push(event.detail.value));
    await userEvent.click((search.shadowRoot as ShadowRoot).querySelector('input') as HTMLInputElement);
    await userEvent.keyboard('rep');
    expect(events).toEqual(['r', 're', 'rep']);
    expect(sidebar.searchValue).toBe('rep');
    sidebar.searchLabel = '';
    await settle(sidebar);
    expect(one(sidebar, '.search')).toBeNull();
    expect(all(sidebar, '.separator')).toHaveLength(0);
  });

  it('the corner button is an nph-button primary solid with the label, fires nph-corner-action and can be hidden', async () => {
    const sidebar = await mount();
    const corner = one(sidebar, '.corner') as HTMLElement & { text: string; severity: string; emphasis: string };
    expect(corner.text).toBe('All applications');
    expect(corner.severity).toBe('primary');
    expect(corner.emphasis).toBe('solid');
    const seen = vi.fn();
    sidebar.addEventListener('nph-corner-action', seen);
    await userEvent.click(corner);
    expect(seen).toHaveBeenCalledTimes(1);
    sidebar.cornerLabel = '';
    await settle(sidebar);
    expect(one(sidebar, '.corner')).toBeNull();
    sidebar.cornerLabel = 'All applications';
    sidebar.hideCornerButton = true;
    await settle(sidebar);
    expect(one(sidebar, '.corner')).toBeNull();
  });

  it('the corner button keeps the default focus of nph-button: the primary color border, not focus/border', async () => {
    const sidebar = await mount();
    const corner = one(sidebar, '.corner') as HTMLElement;
    const inner = (corner.shadowRoot as ShadowRoot).querySelector('.control') as HTMLElement;
    await tabTo(sidebar, inner);
    expect(getComputedStyle(inner, '::before').borderTopColor).toBe(resolved('color', '--nph-color-primary'));
  });

  it('the navigation scrolls, top and foot stay: many items do not move the corner button', async () => {
    const many: NphSidebarEntry[] = Array.from({ length: 40 }, (_unused, index) => ({ label: `Page ${index}`, icon: 'house', href: `#p${index}` }));
    const sidebar = await mount({ items: many });
    const list = one(sidebar, '.list') as HTMLElement;
    expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
    expect(getComputedStyle(list).overflowY).toBe('auto');
    const corner = one(sidebar, '.corner') as HTMLElement;
    const before = corner.getBoundingClientRect().top;
    list.scrollTop = list.scrollHeight;
    expect(corner.getBoundingClientRect().top).toBe(before);
    expect((one(sidebar, '.panel') as HTMLElement).getBoundingClientRect().height).toBeCloseTo(640, 0);
    const top = one(sidebar, '.top') as HTMLElement;
    expect(getComputedStyle(top).overflowY).toBe('visible');
  });

  it('the list leaves room for the focus halo of its lines: the first line is not clipped', async () => {
    const sidebar = await mount();
    const first = all<NphSidebarItem>(sidebar, 'nph-sidebar-item')[0] as NphSidebarItem;
    await tabTo(sidebar, innerControl(first));
    const list = one(sidebar, '.list') as HTMLElement;
    const ring = px('--nph-border-width') + px('--nph-focus-ring-width');
    const link = innerControl(first).getBoundingClientRect();
    expect(link.left - list.getBoundingClientRect().left).toBeGreaterThanOrEqual(ring - 0.5);
  });
});

describe('the collapse and close buttons with no logo', () => {
  const end = (sidebar: NphSidebar, selector: string): { button: DOMRect; row: DOMRect } => ({
    button: (one(sidebar, selector) as HTMLElement).getBoundingClientRect(),
    row: (one(sidebar, '.top') as HTMLElement).getBoundingClientRect(),
  });

  it('expanded: the collapse button is at the end of the row, not at the start', async () => {
    const sidebar = await mount();
    expect(one(sidebar, '.logo')).toBeNull();
    const { button, row } = end(sidebar, '.toggle');
    expect(button.right).toBeCloseTo(row.right, 0);
    expect(button.left).toBeGreaterThan(row.left + button.width);
  });

  it('mobile: the close button is at the end of the row, not at the start', async () => {
    const sidebar = await mount({ mode: 'mobile', open: true });
    expect(one(sidebar, '.logo')).toBeNull();
    const { button, row } = end(sidebar, '.close');
    expect(button.right).toBeCloseTo(row.right, 0);
    expect(button.left).toBeGreaterThan(row.left + button.width);
  });

  it('collapsed: the collapse button stays centered below the mark area', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    expect(one(sidebar, '.logo')).toBeNull();
    const { button, row } = end(sidebar, '.toggle');
    expect(button.left + button.width / 2).toBeCloseTo(row.left + row.width / 2, 0);
  });

  it('with a logo, the button is still at the end of the row', async () => {
    const sidebar = await mount({ logoSrc: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"/>', logoLabel: 'Nephos' });
    const { button, row } = end(sidebar, '.toggle');
    expect(button.right).toBeCloseTo(row.right, 0);
  });
});

describe('the collapse button and the collapsed menu', () => {
  it('the collapse button names the action, carries aria-expanded and draws the sidebar icon (DSA-72 D-1)', async () => {
    const sidebar = await mount();
    const toggle = one(sidebar, '.toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-label')).toBe('Collapse menu');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const place = toggle.querySelector('.toggle-place') as HTMLElement;
    expect(place.querySelector('nph-icon')?.getAttribute('name')).toBe('sidebar');
    expect(place.getBoundingClientRect().width).toBeCloseTo(px('--nph-icon-size-md'), 0);
    expect(place.getBoundingClientRect().height).toBeCloseTo(px('--nph-icon-size-md'), 0);
    expect(toggle.getBoundingClientRect().width).toBeCloseTo(px('--nph-control-height-default'), 0);
    const node = await axNode(toggle);
    expect(node.role).toBe('button');
    expect(node.name).toBe('Collapse menu');
  });

  it('a click switches to collapsed, fires nph-mode-change once, and the focus stays on the collapse button', async () => {
    const sidebar = await mount();
    const seen: string[] = [];
    sidebar.addEventListener('nph-mode-change', (event) => {
      expect(event.composed).toBe(true);
      seen.push(event.detail.mode);
    });
    await userEvent.click(one(sidebar, '.toggle') as HTMLElement);
    await settle(sidebar);
    expect(sidebar.mode).toBe('collapsed');
    expect(seen).toEqual(['collapsed']);
    const toggle = one(sidebar, '.toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-label')).toBe('Expand menu');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(root(sidebar).activeElement).toBe(toggle);
    await userEvent.keyboard('{Enter}');
    await settle(sidebar);
    expect(sidebar.mode).toBe('expanded');
    expect(seen).toEqual(['collapsed', 'expanded']);
  });

  it('setting mode from code fires nothing; the width follows the mode: layout/sidebar-collapsed', async () => {
    const sidebar = await mount();
    const seen = vi.fn();
    sidebar.addEventListener('nph-mode-change', seen);
    sidebar.mode = 'collapsed';
    await settle(sidebar);
    await vi.waitFor(() => expect(sidebar.getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-sidebar-collapsed'), 0));
    expect(seen).not.toHaveBeenCalled();
    const panel = one(sidebar, '.panel') as HTMLElement;
    const style = getComputedStyle(panel);
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-sidebar-rail-radius'));
    expect(Number.parseFloat(style.paddingLeft)).toBeCloseTo(px('--nph-sidebar-rail-padding'), 0);
  });

  it('the collapsed menu has rail buttons in place of the items, no search, no labels, and the corner as an icon button', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    expect(all(sidebar, 'nph-sidebar-item')).toHaveLength(0);
    expect(all(sidebar, 'nph-sidebar-rail-button').map((element) => (element as NphSidebarRailButton).label)).toEqual(['Home', 'Inbox', 'Reports', 'Settings']);
    expect(one(sidebar, '.search')).toBeNull();
    expect(all(sidebar, '.separator')).toHaveLength(0);
    expect(all(sidebar, '.group-label')).toHaveLength(0);
    expect(rail(sidebar, 2).counter).toBe(12);
    expect(rail(sidebar, 3).type).toBe('group');
    const corner = one(sidebar, '.corner') as HTMLElement & { text: string; iconStart: string; label: string };
    expect(corner.text).toBe('');
    expect(corner.iconStart).toBe('plus');
    expect(corner.label).toBe('All applications');
    const logoRow = one(sidebar, '.top') as HTMLElement;
    expect(getComputedStyle(logoRow).flexDirection).toBe('column');
  });

  it('the collapsed menu uses the mark of the logo, with the logo as a fallback', async () => {
    const full = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9"/>';
    const mark = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"/>';
    const sidebar = await mount({ mode: 'collapsed', logoSrc: full, logoMarkSrc: mark, logoLabel: 'Nephos', logoHref: '#home' });
    expect(one(sidebar, 'a.logo img')?.getAttribute('src')).toBe(mark);
    sidebar.logoMarkSrc = '';
    await settle(sidebar);
    expect(one(sidebar, 'a.logo img')?.getAttribute('src')).toBe(full);
    const logo = one(sidebar, 'a.logo') as HTMLElement;
    expect(Number.parseFloat(getComputedStyle(logo).maxHeight)).toBeCloseTo(px('--nph-sidebar-logo-mark-size'), 0);
  });

  it('every rail button has its balloon with the name, and a link has no flyout', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    const inbox = rail(sidebar, 2);
    expect((inbox.shadowRoot?.querySelector('nph-tooltip') as HTMLElement & { text: string }).text).toBe('Inbox');
    expect(flyouts(sidebar)).toHaveLength(0);
  });
});

describe('the collapsed menu marks the group that holds the current page (DSA-72 D-3)', () => {
  it('the rail button of a group with the current page inside is active; a group without it, and a link that is not current, are not', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    expect(rail(sidebar, 3).active).toBe(true);
    expect(rail(sidebar, 5).active).toBe(false);
    expect(rail(sidebar, 1).active).toBe(true);
    expect(rail(sidebar, 2).active).toBe(false);
    const solid = (path: number): string | null => (rail(sidebar, path).shadowRoot?.querySelector('.icon') as HTMLElement).getAttribute('variant');
    expect(solid(3)).toBe('solid');
    expect(solid(5)).toBe('light');
    const control = (path: number): HTMLElement => rail(sidebar, path).shadowRoot?.querySelector('.control') as HTMLElement;
    expect(getComputedStyle(control(3)).backgroundColor).toBe(resolved('background-color', '--nph-sidebar-rail-background-active'));
    expect(getComputedStyle(control(5)).backgroundColor).not.toBe(resolved('background-color', '--nph-sidebar-rail-background-active'));
    expect(control(3).hasAttribute('aria-current')).toBe(false);
  });

  it('it follows the current page: a new page in another group moves the active look, with no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const sidebar = await mount({ mode: 'collapsed' });
    const moved = structuredClone(ITEMS) as unknown as Array<{ children?: Array<{ active?: boolean; options?: Array<{ active?: boolean }> }> }>;
    for (const option of moved[3]?.children?.[2]?.options ?? []) delete option.active;
    const profile = moved[5]?.children?.[0];
    if (profile !== undefined) profile.active = true;
    sidebar.items = moved as unknown as NphSidebarEntry[];
    await settle(sidebar);
    expect(rail(sidebar, 3).active).toBe(false);
    expect(rail(sidebar, 5).active).toBe(true);
    expect(error).not.toHaveBeenCalled();
  });

  it('a group with the current page inside shows the active look with its flyout open too', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    expect(rail(sidebar, 3).active).toBe(true);
    expect(rail(sidebar, 3).expanded).toBe(true);
  });
});

describe('the flyout panel of the collapsed menu', () => {
  it('opens on a click, next to the rail button, space/inline to the side and top aligned, with the name as the title', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    const opener = rail(sidebar, 3);
    await userEvent.click(innerControl(opener));
    await entered(sidebar);
    const [panel] = flyouts(sidebar) as [HTMLElement];
    expect(panel.matches(':popover-open')).toBe(true);
    expect(panel.getAttribute('data-level')).toBe('2');
    const box = panel.getBoundingClientRect();
    const anchor = opener.getBoundingClientRect();
    expect(box.left).toBeCloseTo(anchor.right + px('--nph-space-inline'), 0);
    expect(box.top).toBeCloseTo(anchor.top, 0);
    expect((panel.querySelector('.flyout-title') as HTMLElement).textContent?.trim()).toBe('Reports');
    expect(panel.getAttribute('aria-labelledby')).toBe((panel.querySelector('.flyout-title') as HTMLElement).id);
    const options = [...panel.querySelectorAll('.option')].map((option) => option.textContent?.trim());
    expect(options).toEqual(['Monthly', 'Annual', 'By team']);
  });

  it('draws the panel in its tokens: background, border, flyout radius, elevation, option height, title color', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    const [panel] = flyouts(sidebar) as [HTMLElement];
    const style = getComputedStyle(panel);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-sidebar-flyout-background'));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-sidebar-flyout-border'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-sidebar-flyout-radius'));
    expect(style.boxShadow).toBe(resolved('box-shadow', '--nph-elevation-dropdown'));
    expect(getComputedStyle(panel.querySelector('.flyout-title') as HTMLElement).color).toBe(resolved('color', '--nph-sidebar-flyout-title'));
    const option = panel.querySelector('.option') as HTMLElement;
    expect(option.getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 0);
    expect(getComputedStyle(option).color).toBe(resolved('color', '--nph-sidebar-flyout-foreground'));
    expect(Number.parseFloat(getComputedStyle(option).paddingLeft)).toBeCloseTo(px('--nph-sidebar-item-padding'), 0);
    expect(getComputedStyle(option).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-sidebar-item-radius'));
  });

  it('hover does not open it; Enter and Space do, with aria-expanded and aria-controls, and the focus stays on the opener', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    const opener = rail(sidebar, 3);
    await userEvent.hover(innerControl(opener));
    await pause(300);
    expect(flyouts(sidebar)).toHaveLength(0);
    innerControl(opener).focus();
    await userEvent.keyboard('{Enter}');
    await entered(sidebar);
    const button = innerControl(opener) as HTMLElement & { ariaControlsElements: readonly Element[] | null };
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.ariaControlsElements).toEqual(flyouts(sidebar));
    expect(opener.shadowRoot?.activeElement).toBe(button);
    await userEvent.keyboard(' ');
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.ariaControlsElements).toBeNull();
  });

  it('the next Tab enters the panel, because it follows its opener; Shift+Tab comes back', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    const opener = rail(sidebar, 3);
    innerControl(opener).focus();
    await userEvent.keyboard('{Enter}');
    await entered(sidebar);
    await userEvent.keyboard('{Tab}');
    const [panel] = flyouts(sidebar) as [HTMLElement];
    expect(root(sidebar).activeElement?.closest('.flyout')).toBe(panel);
    expect(root(sidebar).activeElement?.textContent?.trim()).toBe('Monthly');
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(opener.shadowRoot?.activeElement).toBe(innerControl(opener));
  });

  it('Esc closes it and gives the focus back to the opener; opening it closes the balloon of the opener', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    const opener = rail(sidebar, 3);
    innerControl(opener).focus();
    const balloon = opener.shadowRoot?.querySelector('nph-tooltip') as HTMLElement & { open: boolean };
    balloon.open = true;
    await userEvent.keyboard('{Enter}');
    await entered(sidebar);
    expect(balloon.open).toBe(false);
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Escape}');
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
    expect(opener.shadowRoot?.activeElement).toBe(innerControl(opener));
    expect(opener.expanded).toBe(false);
  });

  it('a click outside closes it; a click on another rail button opens that one in its place', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    await userEvent.click(innerControl(rail(sidebar, 5)));
    await entered(sidebar);
    expect(flyouts(sidebar)).toHaveLength(1);
    expect((flyouts(sidebar)[0] as HTMLElement).querySelector('.flyout-title')?.textContent?.trim()).toBe('Settings');
    expect(rail(sidebar, 3).expanded).toBe(false);
    expect(rail(sidebar, 5).expanded).toBe(true);
    await userEvent.click(document.body);
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
    expect(rail(sidebar, 5).expanded).toBe(false);
  });

  it('the focus leaving the menu closes it', async () => {
    const outside = document.createElement('button');
    document.body.append(outside);
    const sidebar = await mount({ mode: 'collapsed' });
    innerControl(rail(sidebar, 3)).focus();
    await userEvent.keyboard('{Enter}');
    await entered(sidebar);
    outside.focus();
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
  });

  it('the focus moving to another line of the menu, opener of another panel included, closes it; to its own panel does not', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    const opener = rail(sidebar, 3);
    innerControl(opener).focus();
    await userEvent.keyboard('{Enter}');
    await entered(sidebar);
    await userEvent.keyboard('{Tab}');
    expect(flyouts(sidebar)).toHaveLength(1);
    innerControl(opener).focus();
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(1);
    innerControl(rail(sidebar, 5)).focus();
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
  });

  it('a click on a link of the panel follows it and closes the panel', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    const link = root(sidebar).querySelector('.flyout a[href="#monthly"]') as HTMLAnchorElement;
    link.addEventListener('click', (event) => event.preventDefault());
    await userEvent.click(link);
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
  });

  it('a disabled option has no href and no hover, and an option with options shows chevron-right', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    const [panel] = flyouts(sidebar) as [HTMLElement];
    const disabled = panel.querySelectorAll('.option')[1] as HTMLElement;
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
    expect(disabled.hasAttribute('href')).toBe(false);
    expect(getComputedStyle(disabled).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    const withOptions = panel.querySelectorAll('.option')[2] as HTMLButtonElement;
    expect(withOptions.tagName).toBe('BUTTON');
    expect(withOptions.getAttribute('aria-expanded')).toBe('false');
    expect(withOptions.querySelector('nph-icon')?.getAttribute('name')).toBe('chevron-right');
  });

  it('the third level opens next to the option, one panel per level, and Esc closes only the innermost', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    const opener = rail(sidebar, 3);
    innerControl(opener).focus();
    await userEvent.keyboard('{Enter}');
    await entered(sidebar);
    const option = root(sidebar).querySelector('.flyout .option[data-path="3/2"]') as HTMLButtonElement;
    option.focus();
    await userEvent.keyboard('{Enter}');
    await entered(sidebar);
    expect(flyouts(sidebar)).toHaveLength(2);
    const third = root(sidebar).querySelector('.flyout[data-level="3"]') as HTMLElement;
    expect(option.getAttribute('aria-expanded')).toBe('true');
    expect(third.getBoundingClientRect().left).toBeCloseTo(option.getBoundingClientRect().right + px('--nph-space-inline'), 0);
    expect(third.getBoundingClientRect().top).toBeCloseTo(option.getBoundingClientRect().top, 0);
    expect(third.querySelector('.flyout-title')?.textContent?.trim()).toBe('By team');
    expect([...third.querySelectorAll('.option')].map((entry) => entry.textContent?.trim())).toEqual(['Alpha', 'Beta']);
    expect(third.querySelector('.option[data-active]')?.getAttribute('aria-current')).toBe('page');
    expect((option.getAttribute('data-active'))).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(1);
    expect(root(sidebar).activeElement).toBe(option);
    expect(opener.expanded).toBe(true);
    await userEvent.keyboard('{Escape}');
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
    expect(opener.shadowRoot?.activeElement).toBe(innerControl(opener));
  });

  it('an option that holds the current page keeps the active look and the arrow when open and when hovered (T11)', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    const option = root(sidebar).querySelector('.flyout .option[data-path="3/2"]') as HTMLButtonElement;
    await userEvent.click(option);
    await entered(sidebar);
    const style = getComputedStyle(option);
    expect(option.hasAttribute('data-open')).toBe(true);
    expect(option.hasAttribute('data-active')).toBe(true);
    expect(style.color).toBe(resolved('color', '--nph-sidebar-item-foreground-active'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(option.querySelector('nph-icon')).not.toBeNull();
    await userEvent.hover(option);
    expect(getComputedStyle(option).backgroundColor).toBe(resolved('background-color', '--nph-sidebar-flyout-option-hover'));
    expect(getComputedStyle(option).color).toBe(resolved('color', '--nph-sidebar-item-foreground-active'));
  });

  it('an open option without the current page is in color/primary-text with Regular weight, and the hover has its background', async () => {
    const items: NphSidebarEntry[] = [
      { type: 'group', label: 'Reports', icon: 'folder', children: [{ label: 'By team', options: [{ label: 'Alpha', href: '#alpha' }] }] },
    ];
    const sidebar = await mount({ mode: 'collapsed', items });
    await userEvent.click(innerControl(rail(sidebar, 0)));
    await entered(sidebar);
    const option = root(sidebar).querySelector('.flyout .option[data-path="0/0"]') as HTMLButtonElement;
    await userEvent.click(option);
    await entered(sidebar);
    const style = getComputedStyle(option);
    expect(option.hasAttribute('data-active')).toBe(false);
    expect(style.color).toBe(resolved('color', '--nph-sidebar-item-foreground-open'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-body-md-font-weight'));
  });

  it('stays inside the screen: a rail button near the bottom moves the panel up, and the distance to the opener holds on the side', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    const host = sidebar.parentElement as HTMLElement;
    host.style.blockSize = `${window.innerHeight}px`;
    const many: NphSidebarEntry[] = [
      ...Array.from({ length: 9 }, (_unused, index) => ({ label: `Page ${index}`, icon: 'house', href: `#p${index}` })),
      { type: 'group', label: 'Last', icon: 'folder', children: Array.from({ length: 6 }, (_unused, index) => ({ label: `Child ${index}`, href: `#c${index}` })) },
    ];
    sidebar.items = many;
    await settle(sidebar);
    const opener = rail(sidebar, 9);
    opener.scrollIntoView({ block: 'end' });
    await userEvent.click(innerControl(opener));
    await entered(sidebar);
    const box = (flyouts(sidebar)[0] as HTMLElement).getBoundingClientRect();
    expect(box.bottom).toBeLessThanOrEqual(window.innerHeight + 0.5);
    expect(box.top).toBeGreaterThanOrEqual(-0.5);
  });

  it('a panel taller than the window scrolls, and its options keep control/height-default instead of shrinking', async () => {
    await page.viewport(1280, 260);
    try {
      const many: NphSidebarEntry[] = [
        { type: 'group', label: 'Many', icon: 'folder', children: Array.from({ length: 12 }, (_unused, index) => ({ label: `Child ${index}`, href: `#c${index}` })) },
      ];
      const sidebar = await mount({ mode: 'collapsed', items: many });
      await userEvent.click(innerControl(rail(sidebar, 0)));
      await entered(sidebar);
      const [panel] = flyouts(sidebar) as [HTMLElement];
      expect(panel.getBoundingClientRect().height).toBeLessThanOrEqual(window.innerHeight + 0.5);
      expect(panel.scrollHeight).toBeGreaterThan(panel.clientHeight);
      expect(getComputedStyle(panel).overflowY).toBe('auto');
      for (const option of panel.querySelectorAll<HTMLElement>('.option')) {
        expect(option.getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 0);
      }
    } finally {
      await page.viewport(1280, 900);
    }
  });

  it('with a large font in a narrow window, the panel keeps its minimum inside the window', async () => {
    await page.viewport(320, 800);
    document.documentElement.style.fontSize = '200%';
    try {
      const sidebar = await mount({ mode: 'collapsed' });
      await userEvent.click(innerControl(rail(sidebar, 3)));
      await entered(sidebar);
      const [panel] = flyouts(sidebar) as [HTMLElement];
      const box = panel.getBoundingClientRect();
      expect(box.width).toBeLessThanOrEqual(window.innerWidth + 0.5);
      expect(box.left).toBeGreaterThanOrEqual(-0.5);
      expect(box.right).toBeLessThanOrEqual(window.innerWidth + 0.5);
    } finally {
      document.documentElement.style.fontSize = '';
      await page.viewport(1280, 900);
    }
  });

  it('in the collapsed menu the counter of an active first rail button, with its outline, is not clipped on top', async () => {
    const items: NphSidebarEntry[] = [{ label: 'Inbox', icon: 'inbox', href: '#inbox', counter: 12, active: true }];
    const sidebar = await mount({ mode: 'collapsed', items });
    await settle(sidebar);
    const list = one(sidebar, '.list') as HTMLElement;
    const pill = (rail(sidebar, 0).shadowRoot as ShadowRoot).querySelector('.counter') as HTMLElement;
    const outline = Number.parseFloat(getComputedStyle(pill).outlineWidth);
    expect(outline).toBeGreaterThan(0);
    expect(pill.getBoundingClientRect().top - outline).toBeGreaterThanOrEqual(list.getBoundingClientRect().top - 0.5);
    /* The room is given back: the first button starts where it would without it. */
    const panel = one(sidebar, '.nav') as HTMLElement;
    const without = innerControl(rail(sidebar, 0)).getBoundingClientRect().top - panel.getBoundingClientRect().top;
    expect(without).toBeGreaterThan(0);
  });

  it('a panel that does not fit at the end goes to the other side of the opener', async () => {
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;inset-block:0;inset-inline-end:0;';
    const sidebar = document.createElement('nph-sidebar');
    Object.assign(sidebar, { items: ITEMS, mode: 'collapsed', ...TEXT });
    host.append(sidebar);
    document.body.append(host);
    await settle(sidebar);
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    const box = (flyouts(sidebar)[0] as HTMLElement).getBoundingClientRect();
    const anchor = rail(sidebar, 3).getBoundingClientRect();
    expect(box.right).toBeLessThanOrEqual(anchor.left - px('--nph-space-inline') + 0.5);
    expect(box.right).toBeLessThanOrEqual(window.innerWidth + 0.5);
  });

  it('leaving collapsed closes the panels; a path that is gone from the list closes it too', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    sidebar.items = ITEMS.slice(0, 3);
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
    sidebar.items = ITEMS;
    await settle(sidebar);
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    sidebar.mode = 'expanded';
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
  });
});

describe('the third level of the expanded menu', () => {
  it('a subitem with options opens a panel next to it, as a disclosure with aria-expanded and aria-controls', async () => {
    const open: NphSidebarEntry[] = [{ ...(ITEMS[3] as object), expanded: true } as NphSidebarEntry];
    const sidebar = await mount({ items: open });
    const opener = subitem(sidebar, '0/2');
    const button = innerControl(opener) as HTMLElement & { ariaControlsElements: readonly Element[] | null };
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(button);
    await entered(sidebar);
    const [panel] = flyouts(sidebar) as [HTMLElement];
    expect(panel.getAttribute('data-level')).toBe('3');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.ariaControlsElements).toEqual([panel]);
    expect(panel.getBoundingClientRect().left).toBeCloseTo(opener.getBoundingClientRect().right + px('--nph-space-inline'), 0);
    expect(panel.getBoundingClientRect().top).toBeCloseTo(opener.getBoundingClientRect().top, 0);
    expect(panel.querySelector('.flyout-title')?.textContent?.trim()).toBe('By team');
    await userEvent.keyboard('{Escape}');
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
    expect(opener.shadowRoot?.activeElement).toBe(button);
  });
});

describe('the mobile menu', () => {
  it('closed, it draws nothing in the page; open, it is a modal dialog in the top layer with the menu and the name', async () => {
    const sidebar = await mount({ mode: 'mobile' });
    const dialog = one(sidebar, 'dialog.panel') as HTMLDialogElement;
    expect(dialog.open).toBe(false);
    expect(getComputedStyle(sidebar).display).toBe('contents');
    sidebar.open = true;
    await settle(sidebar);
    expect(dialog.open).toBe(true);
    expect(dialog.matches(':modal')).toBe(true);
    expect(dialog.getAttribute('aria-label')).toBe('Main menu');
    const node = await axNode(dialog);
    expect(node.role).toBe('dialog');
    expect(one(sidebar, 'nav')?.getAttribute('aria-label')).toBe('Main menu');
    await vi.waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));
  });

  it('closed, the dialog stays display none: nothing in it takes the focus or a click', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const sidebar = await mount({ mode: 'mobile', logoSrc: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>', logoHref: '#home', logoLabel: 'Nephos' });
    const dialog = one(sidebar, 'dialog.panel') as HTMLDialogElement;
    expect(getComputedStyle(dialog).display).toBe('none');
    expect((one(sidebar, '.close') as HTMLElement).checkVisibility()).toBe(false);
    before.focus();
    for (let press = 0; press < 12; press += 1) {
      await userEvent.keyboard('{Tab}');
      expect(sidebar.contains(deepActive()) || deepActive()?.getRootNode() === root(sidebar) || document.activeElement === sidebar).toBe(false);
    }
    const hits = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    expect(hits).not.toContain(sidebar);
  });

  it('the menu floats sidebar/mobile-offset from the start, top and bottom edges, at sidebar/panel-width', async () => {
    const sidebar = await mount({ mode: 'mobile', open: true });
    const dialog = one(sidebar, 'dialog.panel') as HTMLDialogElement;
    await vi.waitFor(() => expect(getComputedStyle(dialog).translate).toBe('none'));
    const box = dialog.getBoundingClientRect();
    const offset = px('--nph-sidebar-mobile-offset');
    expect(box.left).toBeCloseTo(offset, 0);
    expect(box.top).toBeCloseTo(offset, 0);
    expect(box.bottom).toBeCloseTo(window.innerHeight - offset, 0);
    expect(box.width).toBeCloseTo(px('--nph-sidebar-panel-width'), 0);
  });

  it('the scrim is the backdrop, in sidebar/scrim', async () => {
    const sidebar = await mount({ mode: 'mobile', open: true });
    const dialog = one(sidebar, 'dialog.panel') as HTMLDialogElement;
    await vi.waitFor(() => expect(getComputedStyle(dialog, '::backdrop').opacity).toBe('1'));
    expect(getComputedStyle(dialog, '::backdrop').backgroundColor).toBe(resolved('background-color', '--nph-sidebar-scrim'));
  });

  it('shows the close button, no collapse button, the search, the full logo and the expanded list', async () => {
    const sidebar = await mount({ mode: 'mobile', open: true, logoSrc: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>', logoLabel: 'Nephos' });
    expect(one(sidebar, '.close')).not.toBeNull();
    expect(one(sidebar, '.toggle')).toBeNull();
    expect(one(sidebar, '.search')).not.toBeNull();
    expect(all(sidebar, 'nph-sidebar-item')).toHaveLength(4);
    const close = one(sidebar, '.close') as HTMLElement & { iconStart: string; label: string; emphasis: string; severity: string };
    expect(close.iconStart).toBe('xmark');
    expect(close.label).toBe('Close menu');
    expect(close.emphasis).toBe('ghost');
    expect(close.severity).toBe('primary');
  });

  it('the close button closes it after nph-close with source close-button; the product can veto it', async () => {
    const sidebar = await mount({ mode: 'mobile', open: true });
    const sources: string[] = [];
    let veto = true;
    sidebar.addEventListener('nph-close', (event) => {
      expect(event.cancelable).toBe(true);
      expect(event.composed).toBe(true);
      sources.push((event as CustomEvent<{ source: string }>).detail.source);
      if (veto) event.preventDefault();
    });
    await userEvent.click(one(sidebar, '.close') as HTMLElement);
    await settle(sidebar);
    expect(sidebar.open).toBe(true);
    veto = false;
    await userEvent.click(one(sidebar, '.close') as HTMLElement);
    await settle(sidebar);
    expect(sidebar.open).toBe(false);
    expect(sources).toEqual(['close-button', 'close-button']);
    await vi.waitFor(() => expect((one(sidebar, 'dialog.panel') as HTMLDialogElement).open).toBe(false));
  });

  it('Esc closes it with source escape, and the focus goes back to the button that opened it', async () => {
    const opener = document.createElement('button');
    opener.textContent = 'Menu';
    document.body.append(opener);
    const sidebar = await mount({ mode: 'mobile' });
    opener.focus();
    sidebar.open = true;
    await settle(sidebar);
    const sources: string[] = [];
    sidebar.addEventListener('nph-close', (event) => sources.push(event.detail.source));
    await userEvent.keyboard('{Escape}');
    await vi.waitFor(() => expect(sidebar.open).toBe(false));
    await vi.waitFor(() => expect((one(sidebar, 'dialog.panel') as HTMLDialogElement).open).toBe(false));
    expect(sources).toEqual(['escape']);
    expect(document.activeElement).toBe(opener);
  });

  it('a click on the scrim closes it with source scrim; a click inside the menu does not', async () => {
    const sidebar = await mount({ mode: 'mobile', open: true });
    const dialog = one(sidebar, 'dialog.panel') as HTMLDialogElement;
    await vi.waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));
    const sources: string[] = [];
    sidebar.addEventListener('nph-close', (event) => sources.push(event.detail.source));
    const box = dialog.getBoundingClientRect();
    await userEvent.click(one(sidebar, '.group-label') as HTMLElement);
    expect(sources).toEqual([]);
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: box.right + 40, clientY: box.top + 40 }));
    await settle(sidebar);
    expect(sources).toEqual(['scrim']);
    expect(sidebar.open).toBe(false);
  });

  it('the focus is trapped inside: the page behind is inert, and Tab stays in the menu', async () => {
    const behind = document.createElement('button');
    behind.textContent = 'Behind';
    document.body.append(behind);
    const sidebar = await mount({ mode: 'mobile', open: true });
    await settle(sidebar);
    for (let press = 0; press < 40; press += 1) {
      await userEvent.keyboard('{Tab}');
      expect(document.activeElement).not.toBe(behind);
    }
  });

  it('setting open from code fires nothing; opening it again after a close works', async () => {
    const sidebar = await mount({ mode: 'mobile' });
    const seen = vi.fn();
    sidebar.addEventListener('nph-close', seen);
    sidebar.open = true;
    await settle(sidebar);
    sidebar.open = false;
    await settle(sidebar);
    await vi.waitFor(() => expect((one(sidebar, 'dialog.panel') as HTMLDialogElement).open).toBe(false));
    sidebar.open = true;
    await settle(sidebar);
    expect((one(sidebar, 'dialog.panel') as HTMLDialogElement).open).toBe(true);
    expect(seen).not.toHaveBeenCalled();
  });

  it('a flyout inside the mobile menu: Esc closes it first, and the menu stays open', async () => {
    const open: NphSidebarEntry[] = [{ ...(ITEMS[3] as object), expanded: true } as NphSidebarEntry];
    const sidebar = await mount({ mode: 'mobile', open: true, items: open });
    await settle(sidebar);
    const opener = subitem(sidebar, '0/2');
    innerControl(opener).focus();
    await userEvent.keyboard('{Enter}');
    await entered(sidebar);
    expect(flyouts(sidebar)).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
    expect(sidebar.open).toBe(true);
  });

  it('leaving the mobile mode while open releases the page', async () => {
    const sidebar = await mount({ mode: 'mobile', open: true });
    const behind = document.createElement('button');
    document.body.append(behind);
    sidebar.mode = 'expanded';
    await settle(sidebar);
    expect(document.querySelector(':modal')).toBeNull();
    behind.focus();
    expect(document.activeElement).toBe(behind);
  });
});

describe('the loading state, the empty state and the error', () => {
  it('loading draws nph-skeleton rows in place of the items, keeps the logo, the search and the corner, and marks the list busy', async () => {
    const sidebar = await mount({ loading: true, logoSrc: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>', logoLabel: 'Nephos' });
    expect(all(sidebar, 'nph-sidebar-item')).toHaveLength(0);
    expect(all(sidebar, '.skeleton nph-skeleton')).toHaveLength(6);
    expect(one(sidebar, '.list')?.getAttribute('aria-busy')).toBe('true');
    expect(one(sidebar, '.search')).not.toBeNull();
    expect(one(sidebar, '.corner')).not.toBeNull();
    expect(one(sidebar, '.logo')).not.toBeNull();
    sidebar.loading = false;
    await settle(sidebar);
    expect(one(sidebar, '.list')?.hasAttribute('aria-busy')).toBe(false);
    expect(all(sidebar, 'nph-sidebar-item')).toHaveLength(4);
  });

  it('loading in the collapsed menu draws rail-sized blocks', async () => {
    const sidebar = await mount({ loading: true, mode: 'collapsed' });
    const blocks = all(sidebar, '.skeleton-rail');
    expect(blocks).toHaveLength(6);
    expect((blocks[0] as HTMLElement).getBoundingClientRect().width).toBeCloseTo(px('--nph-sidebar-rail-button-size'), 0);
    expect((blocks[0]?.querySelector('nph-skeleton') as HTMLElement & { shape: string }).shape).toBe('block');
  });

  it('an empty list shows the empty text in place of the list; with an error text, the error wins and is an alert', async () => {
    const sidebar = await mount({ items: [], emptyText: 'No pages yet' });
    expect(one(sidebar, '.message')?.textContent?.trim()).toBe('No pages yet');
    expect(one(sidebar, '.message')?.getAttribute('role')).toBeNull();
    sidebar.errorText = 'The menu did not load';
    sidebar.items = ITEMS;
    await settle(sidebar);
    expect(one(sidebar, '.message')?.textContent?.trim()).toBe('The menu did not load');
    expect(one(sidebar, '.message')?.getAttribute('role')).toBe('alert');
    expect(all(sidebar, 'nph-sidebar-item')).toHaveLength(0);
  });
});

describe('more actions of an item', () => {
  it('the action chosen is fired again on the host, with its value and the value of the item', async () => {
    const withActions: NphSidebarEntry[] = [
      {
        label: 'Inbox',
        icon: 'inbox',
        href: '#inbox',
        value: 'inbox',
        actionsLabel: 'More actions',
        actions: [{ value: 'rename', text: 'Rename' }],
      },
    ];
    const sidebar = await mount({ items: withActions });
    const inbox = item(sidebar, 0);
    await settle(sidebar);
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    const seen: Array<Record<string, unknown>> = [];
    sidebar.addEventListener('nph-item-select', (event) => seen.push({ ...(event as unknown as CustomEvent<Record<string, unknown>>).detail }));
    const menu = inbox.shadowRoot?.querySelector('nph-dropdown-menu') as HTMLElement;
    menu.dispatchEvent(new CustomEvent('nph-item-select', { bubbles: true, detail: { value: 'rename', checked: null } }));
    expect(seen).toEqual([{ value: 'rename', checked: null, item: 'inbox' }]);
  });
});

describe('focus of the collapse and close buttons', () => {
  it('the collapse button draws the focus/border border and the focus/halo halo outside, in the control radii', async () => {
    const sidebar = await mount();
    const toggle = one(sidebar, '.toggle') as HTMLElement;
    await tabTo(sidebar, toggle);
    const border = getComputedStyle(toggle, '::before');
    const halo = getComputedStyle(toggle, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
  });

  it('the close button takes focus/border through the focus hook of nph-button; the corner button does not', async () => {
    const sidebar = await mount({ mode: 'mobile', open: true });
    const close = one(sidebar, '.close') as HTMLElement;
    const corner = one(sidebar, '.corner') as HTMLElement;
    expect(getComputedStyle(close).getPropertyValue('--nph-button-focus-border').trim()).not.toBe('');
    expect(getComputedStyle(corner).getPropertyValue('--nph-button-focus-border').trim()).toBe('');
    const inner = (close.shadowRoot as ShadowRoot).querySelector('.control') as HTMLElement;
    await tabTo(sidebar, inner);
    expect(getComputedStyle(inner, '::before').borderTopColor).toBe(resolved('color', '--nph-focus-border'));
  });
});

describe('the colors in dark mode, per brand', () => {
  it('the panel, the flyout and the active rail button follow the scheme of the page', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    const sidebar = await mount({ mode: 'collapsed' });
    const panel = one(sidebar, '.panel') as HTMLElement;
    expect(getComputedStyle(panel).backgroundColor).toBe(resolved('background-color', '--nph-sidebar-panel-background'));
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    const [flyout] = flyouts(sidebar) as [HTMLElement];
    expect(getComputedStyle(flyout).backgroundColor).toBe(resolved('background-color', '--nph-sidebar-flyout-background'));
    expect(getComputedStyle(flyout.querySelector('.flyout-title') as HTMLElement).color).toBe(resolved('color', '--nph-sidebar-flyout-title'));
  });
});

/* ----- the panel menu (DSA-76, P124) ------------------------------------------------------- */

/** Two groups with the third level: the current page is in the subgroup of the first, so both are born open. */
const PM_ITEMS: NphSidebarEntry[] = [
  { type: 'label', text: 'Main' },
  { label: 'Home', icon: 'house', href: '#home', value: 'home' },
  {
    type: 'group',
    label: 'Registries',
    icon: 'folder',
    value: 'registries',
    children: [
      { label: 'Units', href: '#units' },
      {
        label: 'Institutions',
        value: 'institutions',
        tooltip: 'Institutions of the registry',
        options: [
          { label: 'Schools', href: '#schools' },
          { label: 'Hospitals', href: '#hospitals', active: true },
        ],
      },
    ],
  },
  { type: 'label', text: 'System' },
  {
    type: 'group',
    label: 'Settings',
    icon: 'gear',
    value: 'settings',
    children: [
      { label: 'Profile', href: '#profile' },
      { label: 'Billing', value: 'billing', options: [{ label: 'Plans', href: '#plans' }] },
    ],
  },
];

/** The same list with the current page moved: the product sends a new list at every navigation. */
function navigated(to: 'hospitals' | 'profile'): NphSidebarEntry[] {
  const copy = structuredClone(PM_ITEMS) as NphSidebarEntry[];
  const registries = copy[2] as unknown as { children: Array<{ options?: Array<{ active?: boolean }>; active?: boolean }> };
  delete (registries.children[1]?.options?.[1] as { active?: boolean }).active;
  if (to === 'hospitals') {
    (registries.children[1]?.options?.[1] as { active?: boolean }).active = true;
  } else {
    const settings = copy[4] as unknown as { children: Array<{ active?: boolean }> };
    (settings.children[0] as { active?: boolean }).active = true;
  }
  return copy;
}

const mountMenu = (props: Partial<NphSidebar> = {}): Promise<NphSidebar> => mount({ navigation: 'panel-menu', items: PM_ITEMS, ...props });
const subgroup = (sidebar: NphSidebar, path: string): HTMLButtonElement => one(sidebar, `.subgroup[data-path="${path}"]`) as HTMLButtonElement;
const blockOf = (sidebar: NphSidebar, key: string): HTMLElement => one(sidebar, `.block[data-block="${key}"]`) as HTMLElement;
const panelState = (sidebar: NphSidebar): string[] => all(sidebar, '.block').map((element) => element.dataset['state'] ?? '');
const labelLeft = (control: HTMLElement): number => (control.querySelector('.label, .subgroup-label') as HTMLElement).getBoundingClientRect().left;

/** The blocks have stopped moving: every one is steady, open or closed. */
async function steady(sidebar: NphSidebar): Promise<void> {
  await settle(sidebar);
  await vi.waitFor(() => expect(panelState(sidebar).every((state) => state === 'open' || state === 'closed')).toBe(true), { timeout: 2000 });
  await settle(sidebar);
}

/** Shows the reduced-motion preference for the length of a function. */
async function withReducedMotion(run: () => Promise<void>): Promise<void> {
  const session = cdp();
  try {
    await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
    await run();
  } finally {
    await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  }
  await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
}

describe('the panel menu: the navigation property', () => {
  it('a navigation outside the two renders nothing and complains once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const sidebar = await mount({ navigation: 'accordion' as never });
    expect(sidebar.hasAttribute('data-nph-rendered')).toBe(false);
    expect(root(sidebar).querySelector('.panel')).toBeNull();
    sidebar.requestUpdate();
    await settle(sidebar);
    expect(error.mock.calls.filter(([message]) => String(message).includes('navigation "accordion"'))).toHaveLength(1);
  });

  it('is chosen by the attribute, does not reflect, and the default flyout draws no block', async () => {
    const sidebar = document.createElement('nph-sidebar');
    sidebar.setAttribute('navigation', 'panel-menu');
    Object.assign(sidebar, { items: PM_ITEMS, ...TEXT });
    document.body.append(sidebar);
    await settle(sidebar);
    expect(sidebar.navigation).toBe('panel-menu');
    expect(all(sidebar, '.block').length).toBeGreaterThan(0);
    const flyout = await mount();
    expect(flyout.hasAttribute('navigation')).toBe(false);
    expect(all(flyout, '.block')).toHaveLength(0);
    expect(all(flyout, '.subitems').length).toBeGreaterThan(0);
  });
});

describe('the panel menu: the groups that are open', () => {
  it('the group of the current page and its parent are born open, the others closed, with no flyout panel', async () => {
    const sidebar = await mountMenu();
    expect(item(sidebar, 2).expanded).toBe(true);
    expect(subgroup(sidebar, '2/1').getAttribute('aria-expanded')).toBe('true');
    expect(item(sidebar, 4).expanded).toBe(false);
    expect(subgroup(sidebar, '4/1').getAttribute('aria-expanded')).toBe('false');
    expect(one(sidebar, '#block-2')?.hasAttribute('hidden')).toBe(false);
    expect(one(sidebar, '#block-2-1')?.hasAttribute('hidden')).toBe(false);
    expect(one(sidebar, '#block-4')?.hasAttribute('hidden')).toBe(true);
    expect(one(sidebar, '#block-4-1')?.hasAttribute('hidden')).toBe(true);
    expect(flyouts(sidebar)).toHaveLength(0);
    expect(all<NphSidebarSubitem>(sidebar, 'nph-sidebar-subitem').some((element) => element.options)).toBe(false);
    expect(innerControl(subitem(sidebar, '2/1/1')).getAttribute('aria-current')).toBe('page');
    expect(all(sidebar, '[aria-current="page"]')).toHaveLength(0);
  });

  it('several stay open at once: opening one closes none of the others, in the group and in the subgroup', async () => {
    const sidebar = await mountMenu();
    await userEvent.click(innerControl(item(sidebar, 4)));
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(true);
    expect(item(sidebar, 4).expanded).toBe(true);
    await userEvent.click(subgroup(sidebar, '4/1'));
    await steady(sidebar);
    expect(subgroup(sidebar, '4/1').getAttribute('aria-expanded')).toBe('true');
    expect(subgroup(sidebar, '2/1').getAttribute('aria-expanded')).toBe('true');
    expect(item(sidebar, 2).expanded).toBe(true);
  });

  it('a group the person closes stays closed, with no new mark, even when the current page is inside it', async () => {
    const sidebar = await mountMenu();
    await userEvent.click(innerControl(item(sidebar, 2)));
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(false);
    expect(one(sidebar, '#block-2')?.hasAttribute('hidden')).toBe(true);
    expect(innerControl(item(sidebar, 2)).getAttribute('aria-expanded')).toBe('false');
    expect(item(sidebar, 2).hasAttribute('active')).toBe(false);
  });

  it('the choice survives the new list the product sends at each navigation: closed stays closed while the page is the same, opened stays open, the group of a new current page opens', async () => {
    const sidebar = await mountMenu();
    await userEvent.click(innerControl(item(sidebar, 2)));
    await userEvent.click(innerControl(item(sidebar, 4)));
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(false);
    /* The same page in a new list, as the product sends at every render: the closed group stays closed. */
    sidebar.items = navigated('hospitals');
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(false);
    expect(item(sidebar, 4).expanded).toBe(true);
    /* The product moves the current page into a group that is already open. */
    sidebar.items = navigated('profile');
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(false);
    expect(item(sidebar, 4).expanded).toBe(true);
    /* And back to the first one, which the person had closed: a new current page opens its parents (DSA-76 D-3). */
    sidebar.items = navigated('hospitals');
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(true);
    expect(subgroup(sidebar, '2/1').getAttribute('aria-expanded')).toBe('true');
    expect(item(sidebar, 4).expanded).toBe(true);
  });

  it('a new current page opens its parents and fires no nph-group-toggle: it is not a choice of the person', async () => {
    const sidebar = await mountMenu();
    await userEvent.click(innerControl(item(sidebar, 2)));
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(false);
    const events: unknown[] = [];
    sidebar.addEventListener('nph-group-toggle', (event) => events.push(event.detail));
    sidebar.items = navigated('profile');
    await steady(sidebar);
    sidebar.items = navigated('hospitals');
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(true);
    expect(events).toEqual([]);
  });

  it('the current page that goes away for a moment and comes back is the same page: a closed group stays closed', async () => {
    const sidebar = await mountMenu();
    const none = structuredClone(PM_ITEMS) as NphSidebarEntry[];
    const registries = none[2] as unknown as { children: Array<{ options?: Array<{ active?: boolean }> }> };
    delete (registries.children[1]?.options?.[1] as { active?: boolean }).active;
    await userEvent.click(innerControl(item(sidebar, 2)));
    await steady(sidebar);
    sidebar.items = none;
    await steady(sidebar);
    sidebar.items = navigated('hospitals');
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(false);
  });

  it('a page named by its value is the same page when the product reorders the options', async () => {
    const list = (order: 'a' | 'b'): NphSidebarEntry[] => [
      {
        type: 'group',
        value: 'docs',
        label: 'Docs',
        icon: 'folder',
        children: [
          {
            value: 'kinds',
            label: 'Kinds',
            options:
              order === 'a'
                ? [
                    { value: 'one', label: 'One', href: '#one', active: true },
                    { value: 'two', label: 'Two', href: '#two' },
                  ]
                : [
                    { value: 'two', label: 'Two', href: '#two' },
                    { value: 'one', label: 'One', href: '#one', active: true },
                  ],
          },
        ],
      } as unknown as NphSidebarEntry,
    ];
    const sidebar = await mountMenu({ items: list('a') });
    expect(item(sidebar, 0).expanded).toBe(true);
    await userEvent.click(innerControl(item(sidebar, 0)));
    await steady(sidebar);
    expect(item(sidebar, 0).expanded).toBe(false);
    sidebar.items = list('b');
    await steady(sidebar);
    expect(item(sidebar, 0).expanded).toBe(false);
  });

  it('the group the page was born open in is not closed when the current page moves to another group, and the other is born open', async () => {
    const sidebar = await mountMenu();
    expect(item(sidebar, 4).expanded).toBe(false);
    sidebar.items = navigated('profile');
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(true);
    expect(item(sidebar, 4).expanded).toBe(true);
    expect(subgroup(sidebar, '2/1').getAttribute('aria-expanded')).toBe('true');
  });

  it('an expanded the product writes seeds a group and wins over the birth; a repeat of it does not undo the person; a new value does', async () => {
    const withData = (expanded: boolean | undefined): NphSidebarEntry[] => {
      const list = structuredClone(PM_ITEMS) as NphSidebarEntry[];
      if (expanded !== undefined) (list[2] as unknown as { expanded?: boolean }).expanded = expanded;
      return list;
    };
    const sidebar = await mountMenu({ items: withData(false) });
    expect(item(sidebar, 2).expanded).toBe(false);
    await userEvent.click(innerControl(item(sidebar, 2)));
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(true);
    sidebar.items = withData(false);
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(true);
    sidebar.items = withData(true);
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(true);
    sidebar.items = withData(false);
    await steady(sidebar);
    expect(item(sidebar, 2).expanded).toBe(false);
  });

  it('a subgroup takes expanded from the data too, and a plain child ignores it', async () => {
    const list = structuredClone(PM_ITEMS) as NphSidebarEntry[];
    const settings = list[4] as unknown as { expanded?: boolean; children: Array<{ expanded?: boolean }> };
    settings.expanded = true;
    (settings.children[1] as { expanded?: boolean }).expanded = true;
    (settings.children[0] as { expanded?: boolean }).expanded = true;
    const sidebar = await mountMenu({ items: list });
    expect(subgroup(sidebar, '4/1').getAttribute('aria-expanded')).toBe('true');
    expect(all(sidebar, '.subgroup')).toHaveLength(2);
  });

  it('the person opening or closing fires nph-group-toggle with the value, for a group and for a subgroup, and the objects of the product stay', async () => {
    const sidebar = await mountMenu();
    const original = sidebar.items;
    const events: Array<{ value: string; expanded: boolean }> = [];
    const leaked = vi.fn();
    document.body.addEventListener('nph-toggle', leaked);
    sidebar.addEventListener('nph-group-toggle', (event) => events.push({ ...event.detail }));
    await userEvent.click(subgroup(sidebar, '2/1'));
    await userEvent.click(innerControl(item(sidebar, 2)));
    await steady(sidebar);
    expect(events).toEqual([
      { value: 'institutions', expanded: false },
      { value: 'registries', expanded: false },
    ]);
    expect(leaked).not.toHaveBeenCalled();
    expect(sidebar.items).toBe(original);
    expect((original[2] as { expanded?: boolean }).expanded).toBeUndefined();
    /* Setting items from code fires nothing. */
    sidebar.items = navigated('profile');
    await steady(sidebar);
    expect(events).toHaveLength(2);
  });
});

describe('the panel menu: roles, keyboard and focus', () => {
  it('the group and the subgroup are buttons with aria-expanded and aria-controls pointing to a block, and no menu or tree role', async () => {
    const sidebar = await mountMenu();
    const group = innerControl(item(sidebar, 2)) as HTMLElement & { ariaControlsElements: readonly Element[] | null };
    expect(group.getAttribute('aria-expanded')).toBe('true');
    expect(group.ariaControlsElements).toEqual([one(sidebar, '#block-2')]);
    const button = subgroup(sidebar, '2/1');
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('aria-controls')).toBe('block-2-1');
    expect(one(sidebar, `#${button.getAttribute('aria-controls')}`)).not.toBeNull();
    expect(root(sidebar).querySelector('[role="menu"], [role="tree"], [role="menuitem"]')).toBeNull();
    expect(one(sidebar, 'nav')?.getAttribute('aria-label')).toBe('Main menu');
    expect((await axNode(button)).role).toBe('button');
    expect((await axNode(button)).name).toBe('Institutions');
  });

  it('Enter and Space on the subgroup and on the group open and close it, and the focus stays on the button', async () => {
    const sidebar = await mountMenu();
    const button = subgroup(sidebar, '4/1');
    await tabTo(sidebar, innerControl(item(sidebar, 4)));
    await userEvent.keyboard('{Enter}');
    await steady(sidebar);
    expect(item(sidebar, 4).expanded).toBe(true);
    expect(deepActive()).toBe(innerControl(item(sidebar, 4)));
    await tabTo(sidebar, button);
    await userEvent.keyboard('{Enter}');
    await steady(sidebar);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(deepActive()).toBe(button);
    await userEvent.keyboard(' ');
    await steady(sidebar);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(deepActive()).toBe(button);
  });

  it('a closed block is out of the Tab order, an open one is in it, and the first child comes on the next Tab', async () => {
    const sidebar = await mountMenu();
    const closed = one(sidebar, '#block-4') as HTMLElement;
    expect(getComputedStyle(closed).display).toBe('none');
    await tabTo(sidebar, innerControl(item(sidebar, 4)));
    await userEvent.keyboard('{Tab}');
    expect(closed.contains(root(sidebar).activeElement)).toBe(false);
    await tabTo(sidebar, innerControl(item(sidebar, 4)));
    await userEvent.keyboard('{Enter}');
    await steady(sidebar);
    await userEvent.keyboard('{Tab}');
    expect(closed.contains(root(sidebar).activeElement)).toBe(true);
  });

  it('Esc does nothing in the expanded panel menu, and a click outside closes nothing', async () => {
    const sidebar = await mountMenu();
    const before = panelState(sidebar);
    await tabTo(sidebar, subgroup(sidebar, '2/1'));
    await userEvent.keyboard('{Escape}');
    await userEvent.click(document.body);
    await steady(sidebar);
    expect(panelState(sidebar)).toEqual(before);
    expect(subgroup(sidebar, '2/1').getAttribute('aria-expanded')).toBe('true');
  });

  it('a disabled subgroup is a disabled button out of the Tab order, at state/disabled-opacity, with no tooltip; open and disabled keeps the open look and the arrow up', async () => {
    const list = structuredClone(PM_ITEMS) as NphSidebarEntry[];
    const registries = list[2] as unknown as { children: Array<{ disabled?: boolean }> };
    (registries.children[1] as { disabled?: boolean }).disabled = true;
    const sidebar = await mountMenu({ items: list });
    const button = subgroup(sidebar, '2/1');
    expect(button.disabled).toBe(true);
    expect(getComputedStyle(button).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.querySelector('nph-icon')?.getAttribute('name')).toBe('chevron-up');
    expect(getComputedStyle(button).fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(one(sidebar, 'nph-tooltip[for="subgroup-2-1"]')).toBeNull();
    await tabTo(sidebar, innerControl(item(sidebar, 2)));
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Tab}');
    expect(deepActive()).not.toBe(button);
  });

  it('hover paints panel-menu/subgroup-background-hover, open or closed, and moves no focus', async () => {
    const sidebar = await mountMenu();
    await userEvent.click(innerControl(item(sidebar, 4)));
    await steady(sidebar);
    const closed = subgroup(sidebar, '4/1');
    const open = subgroup(sidebar, '2/1');
    expect(getComputedStyle(closed).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await userEvent.hover(closed);
    expect(getComputedStyle(closed).backgroundColor).toBe(resolved('background-color', '--nph-panel-menu-subgroup-background-hover'));
    expect(deepActive()).not.toBe(closed);
    await userEvent.hover(open);
    expect(getComputedStyle(open).backgroundColor).toBe(resolved('background-color', '--nph-panel-menu-subgroup-background-hover'));
    expect(getComputedStyle(open).color).toBe(resolved('color', '--nph-panel-menu-subgroup-foreground-open'));
  });

  it('the focus of the subgroup is a border in panel-menu/focus-border outside it and a halo in panel-menu/focus-ring outside the border; a click draws none', async () => {
    const sidebar = await mountMenu();
    const button = subgroup(sidebar, '2/1');
    await tabTo(sidebar, button);
    const border = getComputedStyle(button, '::before');
    const halo = getComputedStyle(button, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-panel-menu-focus-border'));
    expect(border.borderTopWidth).toBe(`${px('--nph-panel-menu-focus-border-width')}px`);
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-panel-menu-focus-border-radius'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-panel-menu-focus-ring'));
    expect(halo.borderTopWidth).toBe(`${px('--nph-panel-menu-focus-ring-width')}px`);
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-panel-menu-focus-radius'));
    const box = button.getBoundingClientRect();
    const frame = (button.parentElement as HTMLElement).getBoundingClientRect();
    expect(box.width).toBeCloseTo(frame.width, 0);
    await userEvent.click(innerControl(item(sidebar, 4)));
    await steady(sidebar);
    await userEvent.click(subgroup(sidebar, '4/1'));
    expect(getComputedStyle(subgroup(sidebar, '4/1'), '::before').content).toBe('none');
  });

  it('the cut label has a tooltip at the right of the subgroup, and its label is cut on one line with an ellipsis', async () => {
    const list = structuredClone(PM_ITEMS) as NphSidebarEntry[];
    const registries = list[2] as unknown as { children: Array<{ label: string }> };
    (registries.children[1] as { label: string }).label = 'Reports of the registry and the long names of the institutions';
    const sidebar = await mountMenu({ items: list });
    const tooltip = one(sidebar, 'nph-tooltip[for="subgroup-2-1"]') as HTMLElement & { text: string; side: string };
    expect(tooltip.text).toBe('Institutions of the registry');
    expect(tooltip.side).toBe('right');
    const label = subgroup(sidebar, '2/1').querySelector('.subgroup-label') as HTMLElement;
    expect(getComputedStyle(label).textOverflow).toBe('ellipsis');
    expect(getComputedStyle(label).whiteSpace).toBe('nowrap');
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  });
});

describe('the panel menu: the measures', () => {
  it('the subgroup is a 36 high button with 10 on the sides, 8 on top and bottom, corner 12, 8 between the label and a 16 arrow, in the tokens', async () => {
    const sidebar = await mountMenu();
    const button = subgroup(sidebar, '2/1');
    const style = getComputedStyle(button);
    expect(button.getBoundingClientRect().height).toBeCloseTo(px('--nph-panel-menu-subgroup-height'), 0);
    expect(style.paddingLeft).toBe(`${px('--nph-panel-menu-subgroup-padding-x')}px`);
    expect(style.paddingTop).toBe(`${px('--nph-panel-menu-subgroup-padding-y')}px`);
    expect(style.borderTopLeftRadius).toBe(`${px('--nph-panel-menu-subgroup-radius')}px`);
    expect(style.columnGap).toBe(`${px('--nph-panel-menu-subgroup-gap')}px`);
    const arrow = button.querySelector('.subgroup-arrow') as HTMLElement;
    expect(arrow.getBoundingClientRect().width).toBeCloseTo(px('--nph-panel-menu-subgroup-icon-size'), 0);
    expect(arrow.getBoundingClientRect().height).toBeCloseTo(px('--nph-panel-menu-subgroup-icon-size'), 0);
    expect(arrow.getBoundingClientRect().right).toBeCloseTo(button.getBoundingClientRect().right - px('--nph-panel-menu-subgroup-padding-x'), 0);
    expect(style.color).toBe(resolved('color', '--nph-panel-menu-subgroup-foreground-open'));
    expect(getComputedStyle(subgroup(sidebar, '4/1')).color).toBe(resolved('color', '--nph-panel-menu-subgroup-foreground'));
    expect(getComputedStyle(subgroup(sidebar, '4/1')).fontWeight).toBe(resolved('font-weight', '--nph-text-body-md-font-weight'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
  });

  it('the arrow is chevron-down closed and chevron-up open, at the end of the row', async () => {
    const sidebar = await mountMenu();
    expect(subgroup(sidebar, '4/1').querySelector('nph-icon')?.getAttribute('name')).toBe('chevron-down');
    expect(subgroup(sidebar, '2/1').querySelector('nph-icon')?.getAttribute('name')).toBe('chevron-up');
    await userEvent.click(innerControl(item(sidebar, 4)));
    await userEvent.click(subgroup(sidebar, '4/1'));
    await steady(sidebar);
    expect(subgroup(sidebar, '4/1').querySelector('nph-icon')?.getAttribute('name')).toBe('chevron-up');
    expect(subgroup(sidebar, '4/1').getAttribute('aria-expanded')).toBe('true');
  });

  it('the group line is 1 px in panel-menu/guide-background, 10 from the edge, and the column of items is 12 from it', async () => {
    const sidebar = await mountMenu();
    const edge = item(sidebar, 2).getBoundingClientRect().left;
    const nest = one(sidebar, '#block-2 > .nest') as HTMLElement;
    const guide = nest.querySelector(':scope > .guide') as HTMLElement;
    const column = nest.querySelector(':scope > .column') as HTMLElement;
    expect(guide.getBoundingClientRect().left - edge).toBeCloseTo(px('--nph-panel-menu-nest-padding'), 0);
    expect(guide.getBoundingClientRect().width).toBeCloseTo(px('--nph-panel-menu-guide-width'), 0);
    expect(getComputedStyle(guide).backgroundColor).toBe(resolved('background-color', '--nph-panel-menu-guide-background'));
    expect(column.getBoundingClientRect().left - guide.getBoundingClientRect().right).toBeCloseTo(px('--nph-panel-menu-nest-gap'), 0);
    expect(guide.getBoundingClientRect().height).toBeCloseTo(column.getBoundingClientRect().height, 0);
    expect(guide.getAttribute('aria-hidden')).toBe('true');
  });

  it('the text of the subitem starts 33 from the edge in the second level and 56 in the third', async () => {
    const sidebar = await mountMenu();
    const edge = item(sidebar, 2).getBoundingClientRect().left;
    expect(labelLeft(innerControl(subitem(sidebar, '2/0'))) - edge).toBeCloseTo(33, 0);
    expect(labelLeft(subgroup(sidebar, '2/1')) - edge).toBeCloseTo(33, 0);
    expect(labelLeft(innerControl(subitem(sidebar, '2/1/0'))) - edge).toBeCloseTo(56, 0);
  });

  it('the rows are panel-menu/item-gap apart, the section is panel-menu/section-gap below the list, and the label is panel-menu/label-gap from its items', async () => {
    const sidebar = await mountMenu();
    const home = item(sidebar, 1).getBoundingClientRect();
    const group = item(sidebar, 2).getBoundingClientRect();
    expect(group.top - home.bottom).toBeCloseTo(px('--nph-panel-menu-item-gap'), 0);
    const sections = all(sidebar, '.section');
    const firstBottom = (sections[0] as HTMLElement).getBoundingClientRect().bottom;
    const label = one(sidebar, '.group-label[id="group-label-3"]') as HTMLElement;
    expect(label.getBoundingClientRect().top - firstBottom).toBeCloseTo(px('--nph-panel-menu-section-gap'), 0);
    const settings = item(sidebar, 4).getBoundingClientRect();
    expect(settings.top - label.getBoundingClientRect().bottom).toBeCloseTo(px('--nph-panel-menu-label-gap'), 0);
    expect(getComputedStyle(label).paddingTop).toBe('0px');
  });

  it('a closed group takes no room below its row: the next row is panel-menu/item-gap away, as with no block', async () => {
    const sidebar = await mountMenu({ items: [{ type: 'group', label: 'A', icon: 'folder', children: [{ label: 'A1', href: '#a' }] }, { label: 'B', icon: 'house', href: '#b' }] as NphSidebarEntry[] });
    const a = item(sidebar, 0).getBoundingClientRect();
    const b = item(sidebar, 1).getBoundingClientRect();
    expect(b.top - a.bottom).toBeCloseTo(px('--nph-panel-menu-item-gap'), 0);
  });
});

describe('the panel menu: the block grows in place', () => {
  it('opens in collapsible/expand-duration and collapsible/expand-easing, animating only the rows of the grid (DSA-98)', async () => {
    const sidebar = await mountMenu();
    const block = blockOf(sidebar, 'group:settings');
    const style = getComputedStyle(block);
    expect(style.transitionProperty).toBe('grid-template-rows');
    expect(style.transitionDuration).toBe(resolved('transition-duration', '--nph-collapsible-expand-duration'));
    expect(style.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-collapsible-expand-easing'));
    const cssWithoutComments = disclosureCss.replace(/\/\*[\s\S]*?\*\//g, '');
    const properties = [...cssWithoutComments.matchAll(/transition-property:\s*([^;]+);/g)].map((match) => (match[1] ?? '').trim());
    expect(properties.filter((value) => value.includes('grid-template-rows'))).toEqual(['grid-template-rows']);
  });

  it('shares the growth with the nph-collapsible: the block carries the shared hook and the piece writes no growth of its own', () => {
    const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(cssWithoutComments).not.toMatch(/transition-property:\s*[^;]*grid-template-rows/);
    expect(cssWithoutComments).not.toMatch(/grid-template-rows\s*:/);
    expect(cssWithoutComments).not.toMatch(/panel-menu-expand/);
    expect(disclosureCss).toContain('[data-disclosure]');
    expect(NphSidebar.styles).toHaveLength(2);
  });

  it('goes through opening to open and through closing to closed; visible while it moves, hidden and inert only when steady or closing', async () => {
    const sidebar = await mountMenu();
    const block = blockOf(sidebar, 'group:settings');
    const content = one(sidebar, '#block-4') as HTMLElement;
    expect(block.dataset['state']).toBe('closed');
    /* The native click is synchronous: the phase is read in the frame the render commits, not a window of the clock. */
    innerControl(item(sidebar, 4)).click();
    await sidebar.updateComplete;
    expect(block.dataset['state']).toBe('opening');
    expect(content.hasAttribute('hidden')).toBe(false);
    await vi.waitFor(() => expect(block.dataset['state']).toBe('open'), { timeout: 2000 });
    innerControl(item(sidebar, 4)).click();
    await sidebar.updateComplete;
    expect(block.dataset['state']).toBe('closing');
    expect(content.hasAttribute('hidden')).toBe(false);
    expect(content.hasAttribute('inert')).toBe(true);
    await vi.waitFor(() => expect(block.dataset['state']).toBe('closed'), { timeout: 2000 });
    expect(content.hasAttribute('hidden')).toBe(true);
    expect(content.hasAttribute('inert')).toBe(false);
  });

  it('the height goes through the sizes between closed and open, in both directions, and pushes what is below', async () => {
    const sidebar = await mountMenu();
    const block = blockOf(sidebar, 'group:settings');
    const below = item(sidebar, 4);
    const closed = block.getBoundingClientRect().height;
    expect(closed).toBe(0);
    /* The transition itself is held at its middle, so the measure does not depend on the clock. */
    const middle = async (): Promise<number> => {
      const transition = block.getAnimations().find((animation) => (animation as CSSTransition).transitionProperty === 'grid-template-rows');
      expect(transition).toBeDefined();
      (transition as Animation).pause();
      (transition as Animation).currentTime = Number((transition as Animation).effect?.getTiming().duration) / 2;
      const height = block.getBoundingClientRect().height;
      (transition as Animation).finish();
      return height;
    };
    innerControl(below).click();
    await sidebar.updateComplete;
    const during = await middle();
    await vi.waitFor(() => expect(block.dataset['state']).toBe('open'), { timeout: 2000 });
    const open = block.getBoundingClientRect().height;
    expect(during).toBeGreaterThan(closed);
    expect(during).toBeLessThan(open);
    innerControl(below).click();
    await sidebar.updateComplete;
    const shrinking = await middle();
    expect(shrinking).toBeGreaterThan(closed);
    expect(shrinking).toBeLessThan(open);
    await vi.waitFor(() => expect(block.dataset['state']).toBe('closed'), { timeout: 2000 });
    expect(block.getBoundingClientRect().height).toBe(0);
  });

  it('the clip cuts while the block moves and lets the focus halo of the lines show when it is open and steady', async () => {
    const sidebar = await mountMenu();
    const block = blockOf(sidebar, 'group:registries');
    const clip = block.querySelector(':scope > .clip') as HTMLElement;
    expect(block.dataset['state']).toBe('open');
    expect(getComputedStyle(clip).overflow).toBe('visible');
    innerControl(item(sidebar, 2)).click();
    await sidebar.updateComplete;
    expect(getComputedStyle(clip).overflow).toBe('hidden');
    await steady(sidebar);
  });

  it('the arrow of the subgroup turns 180 degrees as the block moves, with the duration of the expansion', async () => {
    const sidebar = await mountMenu();
    const arrow = subgroup(sidebar, '2/1').querySelector('.subgroup-arrow') as HTMLElement;
    expect(arrow.getAnimations()).toHaveLength(0);
    subgroup(sidebar, '2/1').click();
    await sidebar.updateComplete;
    expect(arrow.getAnimations().length).toBeGreaterThan(0);
    const timing = (arrow.getAnimations()[0] as Animation).effect?.getTiming();
    expect(Number(timing?.duration)).toBeCloseTo(Number.parseFloat(resolved('transition-duration', '--nph-collapsible-expand-duration')) * 1000, 0);
    await steady(sidebar);
  });

  it('the arrow of the group of the first level turns 180 degrees too, in the duration of the block (DSA-76 D-2)', async () => {
    const sidebar = await mountMenu();
    const arrowOf = (path: number): HTMLElement => item(sidebar, path).shadowRoot?.querySelector('.arrow') as HTMLElement;
    const arrow = arrowOf(4);
    expect(arrow.getAnimations()).toHaveLength(0);
    await userEvent.click(innerControl(item(sidebar, 4)));
    await sidebar.updateComplete;
    expect(arrow.getAnimations().length).toBeGreaterThan(0);
    const animation = arrow.getAnimations()[0] as Animation;
    const keyframes = (animation.effect as KeyframeEffect).getKeyframes();
    expect(keyframes.map((frame) => frame['transform'])).toEqual(['rotate(180deg)', 'rotate(0deg)']);
    expect(Number(animation.effect?.getTiming().duration)).toBeCloseTo(Number.parseFloat(resolved('transition-duration', '--nph-collapsible-expand-duration')) * 1000, 0);
    await steady(sidebar);
    await userEvent.click(innerControl(item(sidebar, 4)));
    await sidebar.updateComplete;
    expect(arrowOf(4).getAnimations().length).toBeGreaterThan(0);
    await steady(sidebar);
  });

  it('with reduced motion nothing moves: the block opens and closes at once, with no phase and no turn', async () => {
    await withReducedMotion(async () => {
      const sidebar = await mountMenu();
      const block = blockOf(sidebar, 'group:settings');
      expect(getComputedStyle(block).transitionDuration).toBe('0s');
      await userEvent.click(innerControl(item(sidebar, 4)));
      await sidebar.updateComplete;
      expect(block.dataset['state']).toBe('open');
      expect(one(sidebar, '#block-4')?.hasAttribute('hidden')).toBe(false);
      expect((item(sidebar, 4).shadowRoot?.querySelector('.arrow') as HTMLElement).getAnimations()).toHaveLength(0);
      const arrow = subgroup(sidebar, '2/1').querySelector('.subgroup-arrow') as HTMLElement;
      await userEvent.click(subgroup(sidebar, '2/1'));
      await sidebar.updateComplete;
      expect(arrow.getAnimations()).toHaveLength(0);
      expect(blockOf(sidebar, 'group:registries/institutions').dataset['state']).toBe('closed');
    });
  });
});

describe('the panel menu: loading, the collapsed menu and the mobile menu', () => {
  it('loading swaps the list for skeleton rows, one per first-level item, with an icon place and a line, no section label, aria-busy and out of the Tab order', async () => {
    const sidebar = await mountMenu({ loading: true });
    const rows = all(sidebar, '.panel-skeleton-row');
    expect(rows).toHaveLength(3);
    expect(all(sidebar, '.group-label')).toHaveLength(0);
    expect(one(sidebar, '.list')?.getAttribute('aria-busy')).toBe('true');
    expect(one(sidebar, '.skeleton')?.getAttribute('aria-hidden')).toBe('true');
    const row = rows[0] as HTMLElement;
    expect(row.getBoundingClientRect().height).toBeCloseTo(px('--nph-panel-menu-skeleton-row-height'), 0);
    expect(getComputedStyle(row).paddingLeft).toBe(`${px('--nph-panel-menu-skeleton-row-padding')}px`);
    expect(getComputedStyle(row).columnGap).toBe(`${px('--nph-panel-menu-skeleton-gap')}px`);
    const icon = row.querySelector('.panel-skeleton-icon') as HTMLElement;
    expect(icon.getBoundingClientRect().width).toBeCloseTo(px('--nph-panel-menu-skeleton-icon-size'), 0);
    expect(row.querySelectorAll('nph-skeleton')).toHaveLength(2);
    expect(rows[1]?.getBoundingClientRect().top).toBeCloseTo((row.getBoundingClientRect().bottom) + px('--nph-panel-menu-item-gap'), 0);
    expect(all(sidebar, 'nph-sidebar-item')).toHaveLength(0);
  });

  it('loading with no item yet keeps the six rows of the sidebar', async () => {
    const sidebar = await mountMenu({ loading: true, items: [] });
    expect(all(sidebar, '.panel-skeleton-row')).toHaveLength(6);
  });

  it('the collapsed menu follows the nph-sidebar: the rail and its flyout panels, the same data', async () => {
    const sidebar = await mountMenu({ mode: 'collapsed' });
    expect(all(sidebar, '.block')).toHaveLength(0);
    expect(all(sidebar, 'nph-sidebar-rail-button').length).toBe(3);
    await userEvent.click(innerControl(rail(sidebar, 2)));
    await entered(sidebar);
    expect(flyouts(sidebar)).toHaveLength(1);
    const option = one(sidebar, '.flyout .option[data-path="2/1"]') as HTMLElement;
    expect(option.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(option);
    await entered(sidebar);
    expect(flyouts(sidebar)).toHaveLength(2);
  });

  it('going from collapsed to expanded keeps what the person opened, and closes the panels', async () => {
    const sidebar = await mountMenu();
    await userEvent.click(innerControl(item(sidebar, 4)));
    await steady(sidebar);
    sidebar.mode = 'collapsed';
    await settle(sidebar);
    await userEvent.click(innerControl(rail(sidebar, 2)));
    await entered(sidebar);
    sidebar.mode = 'expanded';
    await steady(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
    expect(item(sidebar, 4).expanded).toBe(true);
    expect(item(sidebar, 2).expanded).toBe(true);
  });

  it('changing the navigation closes an open flyout panel', async () => {
    const sidebar = await mount({ mode: 'collapsed' });
    await userEvent.click(innerControl(rail(sidebar, 3)));
    await entered(sidebar);
    expect(flyouts(sidebar)).toHaveLength(1);
    sidebar.navigation = 'panel-menu';
    await settle(sidebar);
    expect(flyouts(sidebar)).toHaveLength(0);
  });

  it('the mobile menu draws the panel menu inside the dialog, and Esc closes the menu, not a block', async () => {
    const sidebar = await mountMenu({ mode: 'mobile', open: true });
    await settle(sidebar);
    const dialog = one(sidebar, 'dialog.panel') as HTMLDialogElement;
    expect(dialog.open).toBe(true);
    expect(dialog.querySelectorAll('.block').length).toBeGreaterThan(0);
    expect(item(sidebar, 2).expanded).toBe(true);
    const closed = vi.fn();
    sidebar.addEventListener('nph-close', closed);
    await userEvent.keyboard('{Escape}');
    expect(closed).toHaveBeenCalledTimes(1);
    expect(closed.mock.calls[0]?.[0].detail.source).toBe('escape');
  });
});

describe('the default navigation is untouched by the panel menu', () => {
  it('flyout: a group opens its subitems from the data and rewrites the list, and a subitem with options opens a flyout panel', async () => {
    const sidebar = await mount();
    const original = sidebar.items;
    await userEvent.click(innerControl(item(sidebar, 3)));
    await settle(sidebar);
    expect(sidebar.items).not.toBe(original);
    expect(all(sidebar, '.subgroup')).toHaveLength(0);
    expect(all(sidebar, '.block')).toHaveLength(0);
    await userEvent.click(innerControl(subitem(sidebar, '3/2')));
    await entered(sidebar);
    expect(flyouts(sidebar)).toHaveLength(1);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  /* What the piece reads is its own style and the growth it shares with the nph-collapsible (DSA-98). */
  const readCss = `${cssWithoutComments}\n${disclosureCss.replace(/\/\*[\s\S]*?\*\//g, '')}`;
  const used = new Set([...readCss.matchAll(/var\((--nph-[a-z0-9-]+)/g)].map((match) => match[1] ?? ''));
  const defined = new Set([...cssWithoutComments.matchAll(/(--nph-[a-z0-9-]+)\s*:/g)].map((match) => match[1] ?? ''));

  it('every custom property read exists in tokens.css, or is the one the component defines on its search or its close button', () => {
    for (const name of used) {
      if (defined.has(name)) continue;
      expect(tokensCss, name).toContain(`${name}:`);
    }
    /* The panel menu (DSA-76): every token of the family is read. */
    const family = [...new Set([...tokensCss.matchAll(/(--nph-panel-menu-[a-z-]+):/g)].map((match) => match[1] ?? ''))];
    expect(family.length).toBeGreaterThan(0);
    for (const name of family) {
      expect(used, name).toContain(name);
    }
    for (const name of [
      '--nph-sidebar-panel-background',
      '--nph-sidebar-panel-border',
      '--nph-sidebar-panel-radius',
      '--nph-sidebar-panel-spacing',
      '--nph-sidebar-panel-width',
      '--nph-sidebar-rail-radius',
      '--nph-sidebar-rail-padding',
      '--nph-layout-sidebar-collapsed',
      '--nph-sidebar-section-gap',
      '--nph-sidebar-separator',
      '--nph-sidebar-search-background',
      '--nph-sidebar-search-border',
      '--nph-sidebar-logo-max-height',
      '--nph-sidebar-logo-mark-size',
      '--nph-sidebar-group-label',
      '--nph-sidebar-flyout-background',
      '--nph-sidebar-flyout-border',
      '--nph-sidebar-flyout-radius',
      '--nph-sidebar-flyout-title',
      '--nph-sidebar-flyout-foreground',
      '--nph-sidebar-flyout-option-hover',
      '--nph-sidebar-item-foreground-active',
      '--nph-sidebar-item-foreground-open',
      '--nph-sidebar-item-padding',
      '--nph-sidebar-item-radius',
      '--nph-sidebar-scrim',
      '--nph-sidebar-mobile-offset',
      '--nph-focus-border',
      '--nph-focus-halo',
      '--nph-focus-ring-width',
      '--nph-state-disabled-opacity',
      '--nph-space-section',
      '--nph-control-height-default',
      '--nph-icon-size-md',
      '--nph-elevation-dropdown',
      '--nph-motion-expand-duration',
      '--nph-collapsible-expand-duration',
      '--nph-collapsible-expand-easing',
      '--nph-motion-enter-duration',
      '--nph-motion-exit-duration',
    ]) {
      expect(used, name).toContain(name);
    }
  });

  it('never consumes a core or theme token, nor the pieces the evidence leaves out, and has no literal value', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/--nph-sidebar-group-line|--nph-sidebar-item-background-active|--nph-focus-ring-sidebar|--nph-sidebar-ring|--nph-color-primary\)/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/);
    expect(cssWithoutComments).not.toMatch(/uppercase/);
  });

  it('only redefines the tokens of the search and the hook of the close button', () => {
    expect([...defined].filter((name) => !name.startsWith('--_')).sort()).toEqual(['--nph-button-focus-border', '--nph-color-background', '--nph-input-border', '--nph-separator-border']);
  });
});
