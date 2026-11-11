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
import componentCss from './nph-sidebar.css?raw';
import { NPH_SIDEBAR_MODES, NphSidebar } from './nph-sidebar';
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

describe('the collapse button and the collapsed menu', () => {
  it('the collapse button names the action, carries aria-expanded and keeps the place of the sidebar icon with a skeleton (D-1)', async () => {
    const sidebar = await mount();
    const toggle = one(sidebar, '.toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-label')).toBe('Collapse menu');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const place = toggle.querySelector('.toggle-place') as HTMLElement;
    expect(place.querySelector('nph-skeleton')).not.toBeNull();
    expect(place.getBoundingClientRect().width).toBeCloseTo(px('--nph-icon-size-md'), 0);
    expect(place.getBoundingClientRect().height).toBeCloseTo(px('--nph-icon-size-md'), 0);
    expect(toggle.getBoundingClientRect().width).toBeCloseTo(px('--nph-control-height-default'), 0);
    expect(toggle.querySelector('nph-icon')).toBeNull();
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

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)/g)].map((match) => match[1] ?? ''));
  const defined = new Set([...cssWithoutComments.matchAll(/(--nph-[a-z0-9-]+)\s*:/g)].map((match) => match[1] ?? ''));

  it('every custom property read exists in tokens.css, or is the one the component defines on its search or its close button', () => {
    for (const name of used) {
      if (defined.has(name)) continue;
      expect(tokensCss, name).toContain(`${name}:`);
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

  it('only redefines the two tokens of the search and the hook of the close button', () => {
    expect([...defined].filter((name) => !name.startsWith('--_')).sort()).toEqual(['--nph-button-focus-border', '--nph-color-background', '--nph-color-border', '--nph-color-input']);
  });
});
