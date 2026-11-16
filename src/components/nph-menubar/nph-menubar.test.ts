/**
 * Tests of `nph-menubar` (P126), in a real browser (P21, item 5): the top layer, the placement below
 * the top item, real hover, keyboard focus, the measured overflow and the colors only exist where
 * there is layout.
 *
 * They prove the contract accepted in Figma (documentation `6432:8686`, root `6410:7413`), recorded in
 * the evidence of the `figma-docs-accepted` gate of DSA-83: the API, the semantics of the APG menubar
 * pattern, the keyboard table ("Default behavior"), the pointer, the event, the overflow and the narrow
 * button, the placement and its collisions, the invalid input, the colors and measures, the look of a
 * top item that is open and in focus at once, the motion, and the token contract.
 */
/* cspell:ignore supr */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-menubar.css?raw';
import { NphMenubar, flattenSubmenus, groupsOf, keyShortcutsOf } from './nph-menubar';
import type { NphMenubarEntry, NphMenubarItemSelectDetail, NphMenubarMenu } from './nph-menubar';

/* The default window of the browser run is 414 wide: too narrow for a panel and its submenu side by side. */
beforeAll(async () => {
  await page.viewport(1024, 768);
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterAll(async () => {
  await page.viewport(414, 896);
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  document.documentElement.removeAttribute('dir');
  window.scrollTo(0, 0);
  vi.restoreAllMocks();
});

/** Fixtures are frozen: a mutation of the consumer's objects would throw. */
function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

const RECENT: NphMenubarEntry[] = [
  { value: 'annual', text: 'annual-report.pdf' },
  { value: 'budget', text: 'budget-2026.xlsx' },
  { value: 'minutes', text: 'meeting-minutes.docx' },
];

const FILE: NphMenubarMenu = {
  value: 'file',
  label: 'File',
  items: [
    { value: 'new', text: 'New', icon: 'pen', shortcut: 'Ctrl+N' },
    { value: 'open', text: 'Open', icon: 'link', shortcut: 'Ctrl+O' },
    { value: 'recent', text: 'Recent', submenu: RECENT },
    { type: 'separator' },
    { value: 'delete', text: 'Delete', icon: 'trash', severity: 'destructive', shortcut: 'Del' },
  ],
};

const EDIT: NphMenubarMenu = {
  value: 'edit',
  label: 'Edit',
  items: [
    { value: 'undo', text: 'Undo', shortcut: 'Ctrl+Z' },
    { value: 'redo', text: 'Redo', shortcut: 'Ctrl+Y', disabled: true },
    { value: 'cut', text: 'Cut', shortcut: 'Ctrl+X' },
    { value: 'copy', text: 'Copy', shortcut: 'Ctrl+C' },
    { value: 'paste', text: 'Paste', shortcut: 'Ctrl+V' },
  ],
};

const VIEW: NphMenubarMenu = {
  value: 'view',
  label: 'View',
  items: [
    { type: 'label', text: 'Show' },
    { value: 'ruler', text: 'Ruler', selection: 'multiple', checked: true },
    { value: 'grid', text: 'Grid', selection: 'multiple' },
    { type: 'separator' },
    { type: 'label', text: 'Density' },
    { value: 'comfortable', text: 'Comfortable', selection: 'single', checked: true },
    { value: 'compact', text: 'Compact', selection: 'single' },
  ],
};

const HELP: NphMenubarMenu = {
  value: 'help',
  label: 'Help',
  items: [
    { value: 'about', text: 'About' },
    { value: 'shortcuts', text: 'Keyboard shortcuts' },
  ],
};

const MENUS: readonly NphMenubarMenu[] = freeze([FILE, EDIT, VIEW, HELP]);

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

const FIXED = 'position: fixed; left: 40px; top: 40px; width: 640px;';

/** The bar in a fixed box, with a button before it and one after it, so Tab has somewhere to come from and go to. */
async function mount(menus: readonly NphMenubarMenu[] = MENUS, props: Partial<NphMenubar> = {}, style = FIXED, attributes: Record<string, string> = {}): Promise<NphMenubar> {
  const before = document.createElement('button');
  before.id = 'before';
  before.textContent = 'Before';
  before.style.cssText = 'position: fixed; left: 700px; top: 360px;';
  const after = document.createElement('button');
  after.id = 'after';
  after.textContent = 'After';
  after.style.cssText = 'position: fixed; left: 700px; top: 420px;';
  const host = document.createElement('div');
  host.style.cssText = style;
  const bar = document.createElement('nph-menubar');
  bar.menus = menus;
  bar.label = 'Editor menu';
  Object.assign(bar, props);
  for (const [name, value] of Object.entries(attributes)) {
    bar.setAttribute(name, value);
  }
  host.append(bar);
  document.body.append(before, host, after);
  await bar.updateComplete;
  await settle(bar);
  return bar;
}

async function settle(bar: NphMenubar): Promise<void> {
  await bar.updateComplete;
  await frame();
  await bar.updateComplete;
}

const root = (bar: NphMenubar): ShadowRoot => bar.shadowRoot as ShadowRoot;
const panel = (bar: NphMenubar, level = 0): HTMLElement => root(bar).querySelector(`.panel[data-level="${level}"]`) as HTMLElement;
const items = (bar: NphMenubar, level = 0): HTMLElement[] => [...(panel(bar, level)?.querySelectorAll<HTMLElement>('.item') ?? [])];
const textOf = (element: Element): string => element.querySelector('.text')?.textContent?.trim() ?? '';
const byText = (bar: NphMenubar, text: string, level = 0): HTMLElement => items(bar, level).find((element) => textOf(element) === text) as HTMLElement;
const labelsOf = (bar: NphMenubar, level = 0): string[] => items(bar, level).map(textOf);
const tops = (bar: NphMenubar): HTMLElement[] => [...root(bar).querySelectorAll<HTMLElement>('.bar > button.top')];
const topOf = (bar: NphMenubar, label: string): HTMLElement => tops(bar).find((element) => element.textContent?.trim() === label) as HTMLElement;
const topLabels = (bar: NphMenubar): string[] => tops(bar).map((element) => element.textContent?.trim() ?? '');
const active = (bar: NphMenubar): Element | null => root(bar).activeElement;
const shown = (bar: NphMenubar, level = 0): boolean => panel(bar, level)?.matches(':popover-open') ?? false;
const idOf = (id: string): HTMLElement => document.getElementById(id) as HTMLElement;
const errorsOf = (spy: ReturnType<typeof vi.spyOn>): string[] =>
  spy.mock.calls.map((call: unknown[]) => String(call[0])).filter((message: string) => message.startsWith('[nph-menubar]'));

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));

/** The node the browser itself builds for an element in its accessibility tree (as in `nph-dropdown-menu`). */
async function axNode(element: Element): Promise<{ role: string; name: string; ignored: boolean }> {
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
    return { role: String(node?.role?.value ?? ''), name: String(node?.name?.value ?? ''), ignored: node?.ignored === true };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

function events(bar: NphMenubar): NphMenubarItemSelectDetail[] {
  const seen: NphMenubarItemSelectDetail[] = [];
  bar.addEventListener('nph-item-select', (event) => seen.push((event as CustomEvent<NphMenubarItemSelectDetail>).detail));
  return seen;
}

/** The enter transition is over: the panel is opaque and in its place. */
async function entered(bar: NphMenubar, level = 0): Promise<void> {
  await vi.waitFor(() => {
    const style = getComputedStyle(panel(bar, level));
    expect(style.opacity).toBe('1');
    expect(style.translate).toBe('none');
  });
}

/** A panel opened from code: it takes no focus. */
async function openFromCode(bar: NphMenubar, value = 'file'): Promise<void> {
  bar.openMenu = value;
  await settle(bar);
  await entered(bar);
}

async function openSubmenuFromCode(bar: NphMenubar, value = 'recent'): Promise<void> {
  bar.openSubmenu = value;
  await settle(bar);
  await entered(bar, 1);
}

/** Tab from the button before the bar: the keyboard enters on the top item that holds the Tab stop. */
async function tabIn(bar: NphMenubar): Promise<void> {
  idOf('before').focus();
  await userEvent.keyboard('{Tab}');
  await settle(bar);
}

async function press(bar: NphMenubar, keys: string): Promise<void> {
  await userEvent.keyboard(keys);
  await settle(bar);
}

/** The keyboard on the top item of that label, with no panel open. */
async function focusTop(bar: NphMenubar, label: string): Promise<void> {
  await tabIn(bar);
  const target = tops(bar).findIndex((element) => element.textContent?.trim() === label);
  const stop = tops(bar).findIndex((element) => element === active(bar));
  if (target > stop) {
    await press(bar, '{ArrowRight}'.repeat(target - stop));
  }
  expect(active(bar)).toBe(topOf(bar, label));
}

/** A panel opened by the keyboard, with the focus on its first item. */
async function openByKeyboard(bar: NphMenubar, label = 'File', key = '{ArrowDown}'): Promise<void> {
  await focusTop(bar, label);
  await press(bar, key);
  await vi.waitFor(() => expect(shown(bar)).toBe(true));
  await entered(bar);
}

/** The width of the box that holds exactly `count` top items and the overflow item, measured on the probe row. */
function boxFor(bar: NphMenubar, count: number): number {
  const widths = [...root(bar).querySelectorAll<HTMLElement>('.probe > [data-probe]')].map((probe) => probe.getBoundingClientRect().width);
  const more = (root(bar).querySelector('.probe > [data-probe-more]') as HTMLElement).getBoundingClientRect().width;
  const gap = px('--nph-menubar-bar-gap');
  return widths.slice(0, count).reduce((sum, width) => sum + width + gap, 0) + more + 1;
}

const resize = (bar: NphMenubar, width: number): void => {
  (bar.parentElement as HTMLElement).style.width = `${width}px`;
};

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-menubar')).toBe(NphMenubar);
  });

  it('has the defaults of the contract: nothing open, no narrow bar, no texts', () => {
    const bar = document.createElement('nph-menubar');
    expect(bar.menus).toEqual([]);
    expect(bar.openMenu).toBe('');
    expect(bar.openSubmenu).toBe('');
    expect(bar.label).toBe('');
    expect(bar.moreLabel).toBe('');
    expect(bar.narrow).toBe(false);
    expect(bar.menuLabel).toBe('');
  });

  it('the public API is exactly the one of P126: the internal state is not part of it', () => {
    const properties = (NphMenubar as unknown as { properties: Record<string, { state?: boolean }> }).properties;
    const publicNames = Object.entries(properties)
      .filter(([, config]) => config.state !== true)
      .map(([name]) => name)
      .sort();
    expect(publicNames).toEqual(['label', 'menuLabel', 'menus', 'moreLabel', 'narrow', 'openMenu', 'openSubmenu']);
  });

  it('has no slot and no part', async () => {
    const bar = await mount();
    expect(root(bar).querySelector('slot')).toBeNull();
    expect(root(bar).querySelector('[part]')).toBeNull();
  });

  it('reflects open-menu, open-submenu and narrow, and the attributes drive the properties', async () => {
    const bar = await mount();
    bar.openMenu = 'file';
    bar.openSubmenu = 'recent';
    await settle(bar);
    expect(bar.getAttribute('open-menu')).toBe('file');
    expect(bar.getAttribute('open-submenu')).toBe('recent');
    bar.setAttribute('open-submenu', '');
    bar.removeAttribute('open-menu');
    await settle(bar);
    expect(bar.openMenu || '').toBe('');
    expect(bar.openSubmenu).toBe('');
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
    bar.narrow = true;
    bar.menuLabel = 'Menu';
    await settle(bar);
    expect(bar.hasAttribute('narrow')).toBe(true);
  });

  it('a closed bar reports empty open-menu and open-submenu, and Esc or a choice writes them back', async () => {
    const bar = await mount();
    await openByKeyboard(bar);
    expect(bar.openMenu).toBe('file');
    await press(bar, '{Escape}');
    expect(bar.openMenu).toBe('');
    expect(bar.getAttribute('open-menu') ?? '').toBe('');
  });
});

describe('helpers', () => {
  it('writes the shortcut in the syntax of aria-keyshortcuts', () => {
    expect(keyShortcutsOf('Ctrl+N')).toBe('Control+N');
    expect(keyShortcutsOf('⌘D')).toBe('Meta+D');
    expect(keyShortcutsOf('⌘⇧K')).toBe('Meta+Shift+K');
    expect(keyShortcutsOf('Ctrl+Shift+k')).toBe('Control+Shift+K');
    expect(keyShortcutsOf('Del')).toBe('Delete');
    expect(keyShortcutsOf('Alt+←')).toBe('Alt+ArrowLeft');
    expect(keyShortcutsOf('Supr')).toBe('Delete');
    expect(keyShortcutsOf('F2')).toBe('F2');
  });

  it('a label opens a group, a separator closes it, and items alone form a group with no name', () => {
    const groups = groupsOf([
      { value: 'a', text: 'A' },
      { type: 'separator' },
      { type: 'label', text: 'Name' },
      { value: 'b', text: 'B' },
    ]);
    expect(groups.map((group) => [group.label, group.rows.map((row) => row.entry.value), group.separated])).toEqual([
      ['', ['a'], false],
      ['Name', ['b'], true],
    ]);
  });

  it('an item with a submenu becomes a group label followed by its items, in one level, and a disabled one takes its items with it', () => {
    const flat = flattenSubmenus([
      { value: 'a', text: 'A' },
      { value: 'recent', text: 'Recent', submenu: [{ value: 'one', text: 'One' }, { value: 'two', text: 'Two' }] },
      { value: 'b', text: 'B' },
      { value: 'old', text: 'Old', disabled: true, submenu: [{ value: 'three', text: 'Three' }] },
    ]);
    expect(flat.map((entry) => (entry.type === 'separator' ? '-' : entry.type === 'label' ? `[${entry.text}]` : entry.value))).toEqual(['a', '-', '[Recent]', 'one', 'two', '-', 'b', '-', '[Old]', 'three']);
    expect(flat.every((entry) => entry.type !== undefined || !('submenu' in entry) || entry.submenu === undefined)).toBe(true);
    expect(flat.find((entry) => entry.type === undefined && entry.value === 'three')).toMatchObject({ disabled: true });
    expect(flat.find((entry) => entry.type === undefined && entry.value === 'one')).not.toHaveProperty('disabled');
  });
});

describe('render and ARIA', () => {
  it('the bar is a menubar named by label', async () => {
    const bar = await mount();
    const node = await axNode(root(bar).querySelector('.bar') as HTMLElement);
    expect(node.role).toBe('menubar');
    expect(node.name).toBe('Editor menu');
  });

  it('the host aria-label names the bar when there is no label', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bar = await mount(MENUS, { label: '' }, FIXED, { 'aria-label': 'Main commands' });
    const node = await axNode(root(bar).querySelector('.bar') as HTMLElement);
    expect(node.name).toBe('Main commands');
    expect(errorsOf(spy)).toEqual([]);
  });

  it('each top item is a native button with the menuitem role, aria-haspopup and aria-expanded', async () => {
    const bar = await mount();
    expect(topLabels(bar)).toEqual(['File', 'Edit', 'View', 'Help']);
    for (const element of tops(bar)) {
      expect(element.tagName).toBe('BUTTON');
      expect(element.getAttribute('role')).toBe('menuitem');
      expect(element.getAttribute('aria-haspopup')).toBe('menu');
      expect(element.getAttribute('aria-expanded')).toBe('false');
      expect(element.hasAttribute('aria-controls')).toBe(false);
    }
    const node = await axNode(topOf(bar, 'Edit'));
    expect(node.role).toBe('menuitem');
    expect(node.name).toBe('Edit');
  });

  it('there is one Tab stop: the first top item, then the one used last', async () => {
    const bar = await mount();
    const stops = (): string[] => tops(bar).filter((element) => element.tabIndex === 0).map((element) => element.textContent?.trim() ?? '');
    expect(stops()).toEqual(['File']);
    await tabIn(bar);
    expect(active(bar)).toBe(topOf(bar, 'File'));
    await press(bar, '{End}');
    expect(stops()).toEqual(['Help']);
    await press(bar, '{Tab}');
    expect(document.activeElement).toBe(idOf('after'));
    idOf('before').focus();
    await userEvent.keyboard('{Tab}');
    expect(active(bar)).toBe(topOf(bar, 'Help'));
  });

  it('the Tab stop is the first top item that is not disabled', async () => {
    const bar = await mount([{ ...FILE, disabled: true }, EDIT, VIEW]);
    expect(tops(bar).filter((element) => element.tabIndex === 0).map((element) => element.textContent?.trim())).toEqual(['Edit']);
    await tabIn(bar);
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
  });

  it('the open panel is a menu named by its top item, and the top item points to it', async () => {
    const bar = await mount();
    await openFromCode(bar, 'edit');
    const menu = panel(bar).querySelector('[role="menu"]') as HTMLElement;
    const node = await axNode(menu);
    expect(node.role).toBe('menu');
    expect(node.name).toBe('Edit');
    const top = topOf(bar, 'Edit');
    expect(top.getAttribute('aria-expanded')).toBe('true');
    expect(top.getAttribute('aria-controls')).toBe(menu.id);
    expect(topOf(bar, 'File').getAttribute('aria-expanded')).toBe('false');
  });

  it('each item has its role, its state and the text as its name', async () => {
    const bar = await mount();
    await openFromCode(bar, 'view');
    const ruler = byText(bar, 'Ruler');
    const grid = byText(bar, 'Grid');
    const comfortable = byText(bar, 'Comfortable');
    const compact = byText(bar, 'Compact');
    expect(ruler.getAttribute('role')).toBe('menuitemcheckbox');
    expect(ruler.getAttribute('aria-checked')).toBe('true');
    expect(grid.getAttribute('role')).toBe('menuitemcheckbox');
    expect(grid.getAttribute('aria-checked')).toBe('false');
    expect(comfortable.getAttribute('role')).toBe('menuitemradio');
    expect(comfortable.getAttribute('aria-checked')).toBe('true');
    expect(compact.getAttribute('aria-checked')).toBe('false');
    for (const [element, role, name] of [
      [ruler, 'menuitemcheckbox', 'Ruler'],
      [comfortable, 'menuitemradio', 'Comfortable'],
    ] as const) {
      const node = await axNode(element);
      expect(node.role).toBe(role);
      expect(node.name).toBe(name);
    }
    const groups = [...panel(bar).querySelectorAll<HTMLElement>('[role="group"]')];
    const names: string[] = [];
    for (const group of groups) {
      names.push((await axNode(group)).name);
    }
    expect(names).toEqual(['Show', 'Density']);
  });

  it('a common item has the menuitem role and no aria-checked', async () => {
    const bar = await mount();
    await openFromCode(bar);
    expect(byText(bar, 'New').getAttribute('role')).toBe('menuitem');
    expect(byText(bar, 'New').hasAttribute('aria-checked')).toBe(false);
  });

  it('the shortcut goes in aria-keyshortcuts, not in the name; the icon and the arrow are not read', async () => {
    const bar = await mount();
    await openFromCode(bar);
    const created = byText(bar, 'New');
    expect(created.getAttribute('aria-keyshortcuts')).toBe('Control+N');
    expect((await axNode(created)).name).toBe('New');
    expect(byText(bar, 'Delete').getAttribute('aria-keyshortcuts')).toBe('Delete');
    expect(byText(bar, 'Recent').hasAttribute('aria-keyshortcuts')).toBe(false);
    for (const icon of panel(bar).querySelectorAll('nph-icon')) {
      expect((await axNode(icon)).ignored).toBe(true);
    }
  });

  it('a disabled top item is aria-disabled, takes the focus and opens nothing', async () => {
    const bar = await mount([FILE, { ...EDIT, disabled: true }, VIEW]);
    const seen = vi.fn();
    bar.addEventListener('nph-item-select', seen);
    const edit = topOf(bar, 'Edit');
    expect(edit.getAttribute('aria-disabled')).toBe('true');
    expect(topOf(bar, 'File').hasAttribute('aria-disabled')).toBe(false);
    await focusTop(bar, 'Edit');
    expect(active(bar)).toBe(edit);
    await press(bar, '{ArrowDown}');
    await press(bar, '{Enter}');
    await press(bar, ' ');
    expect(bar.openMenu).toBe('');
    expect(shown(bar)).toBe(false);
    expect(edit.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(edit, { force: true });
    await settle(bar);
    expect(bar.openMenu).toBe('');
    expect(seen).not.toHaveBeenCalled();
  });

  it('a disabled item is aria-disabled, takes the focus and does not run', async () => {
    const bar = await mount();
    const seen = events(bar);
    await openByKeyboard(bar, 'Edit');
    await press(bar, '{ArrowDown}');
    const redo = byText(bar, 'Redo');
    expect(redo.getAttribute('aria-disabled')).toBe('true');
    expect(active(bar)).toBe(redo);
    await press(bar, '{Enter}');
    await press(bar, ' ');
    await userEvent.click(redo, { force: true });
    await settle(bar);
    expect(seen).toEqual([]);
    expect(bar.openMenu).toBe('edit');
    expect(shown(bar)).toBe(true);
  });

  it('the pointer over a disabled item does not take the focus to it', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'Edit');
    const undo = byText(bar, 'Undo');
    expect(active(bar)).toBe(undo);
    await userEvent.hover(byText(bar, 'Redo'), { force: true });
    await settle(bar);
    expect(active(bar)).toBe(undo);
  });

  it('an item with a submenu carries aria-haspopup, aria-expanded and aria-controls to its submenu', async () => {
    const bar = await mount();
    await openFromCode(bar);
    const recent = byText(bar, 'Recent');
    expect(recent.getAttribute('aria-haspopup')).toBe('menu');
    expect(recent.getAttribute('aria-expanded')).toBe('false');
    expect(recent.hasAttribute('aria-controls')).toBe(false);
    expect(byText(bar, 'New').hasAttribute('aria-expanded')).toBe(false);
    await openSubmenuFromCode(bar);
    expect(recent.getAttribute('aria-expanded')).toBe('true');
    const menu = panel(bar, 1).querySelector('[role="menu"]') as HTMLElement;
    expect(recent.getAttribute('aria-controls')).toBe(menu.id);
    const node = await axNode(menu);
    expect(node.role).toBe('menu');
    expect(node.name).toBe('Recent');
  });
});

describe('look: measures and colors', () => {
  it('the top item: menubar/trigger-height, menubar/trigger-padding-x on each side, menubar/trigger-radius and a width that hugs the label', async () => {
    const bar = await mount();
    const top = topOf(bar, 'File');
    const style = getComputedStyle(top);
    expect(top.getBoundingClientRect().height).toBeCloseTo(px('--nph-menubar-trigger-height'), 1);
    expect(Number.parseFloat(style.paddingLeft)).toBeCloseTo(px('--nph-menubar-trigger-padding-x'), 1);
    expect(Number.parseFloat(style.paddingRight)).toBeCloseTo(px('--nph-menubar-trigger-padding-x'), 1);
    expect(Number.parseFloat(style.paddingTop)).toBe(0);
    expect(style.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-menubar-trigger-radius'));
    expect(style.borderBottomRightRadius).toBe(resolved('border-radius', '--nph-menubar-trigger-radius'));
    const label = top.querySelector('.top-label') as HTMLElement;
    expect(top.getBoundingClientRect().width).toBeCloseTo(label.getBoundingClientRect().width + 2 * px('--nph-menubar-trigger-padding-x'), 1);
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-text-label-md-line-height'));
  });

  it('the top items are menubar/bar-gap apart, and the bar has no background and no border of its own', async () => {
    const bar = await mount();
    const [first, second] = tops(bar).map((element) => element.getBoundingClientRect()) as [DOMRect, DOMRect];
    expect(second.left - first.right).toBeCloseTo(px('--nph-menubar-bar-gap'), 1);
    const strip = getComputedStyle(root(bar).querySelector('.bar') as HTMLElement);
    expect(strip.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(strip.borderTopWidth).toBe('0px');
    expect(Number.parseFloat(strip.paddingLeft)).toBe(0);
  });

  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: at rest the label is menubar/trigger-foreground and there is no background`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const bar = await mount();
      for (const element of tops(bar)) {
        const style = getComputedStyle(element);
        expect(style.color).toBe(resolved('color', '--nph-menubar-trigger-foreground'));
        expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      }
    });

    it(`${scheme}: hover paints menubar/trigger-background-hover with the label in menubar/trigger-foreground-hover`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const bar = await mount();
      const edit = topOf(bar, 'Edit');
      await userEvent.hover(edit);
      const style = getComputedStyle(edit);
      expect(style.backgroundColor).toBe(resolved('background-color', '--nph-menubar-trigger-background-hover'));
      expect(style.color).toBe(resolved('color', '--nph-menubar-trigger-foreground-hover'));
      expect(getComputedStyle(topOf(bar, 'File')).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    });

    it(`${scheme}: the top item whose panel is open has the hover look with no pointer on it`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const bar = await mount();
      await userEvent.unhover(document.body);
      await openFromCode(bar, 'view');
      const style = getComputedStyle(topOf(bar, 'View'));
      expect(style.backgroundColor).toBe(resolved('background-color', '--nph-menubar-trigger-background-hover'));
      expect(style.color).toBe(resolved('color', '--nph-menubar-trigger-foreground-hover'));
      expect(getComputedStyle(topOf(bar, 'File')).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    });
  }

  it('the keyboard focus is the focus/border border and the focus/halo halo outside the item, with no background', async () => {
    const bar = await mount();
    await tabIn(bar);
    const top = topOf(bar, 'File');
    expect(top.matches(':focus-visible')).toBe(true);
    const border = getComputedStyle(top, '::before');
    const halo = getComputedStyle(top, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(Number.parseFloat(border.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    expect(border.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-focus-border-radius-control'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(Number.parseFloat(halo.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
    expect(halo.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-focus-radius-control-with-border'));
    const box = top.getBoundingClientRect();
    expect(Number.parseFloat(border.width)).toBeCloseTo(box.width + 2 * px('--nph-border-width'), 1);
    expect(Number.parseFloat(halo.width)).toBeCloseTo(box.width + 2 * (px('--nph-border-width') + px('--nph-focus-ring-width')), 1);
    expect(getComputedStyle(top).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(top).color).toBe(resolved('color', '--nph-menubar-trigger-foreground'));
  });

  it('a pointer press that focuses a top item draws no ring', async () => {
    const bar = await mount([FILE, { ...EDIT, disabled: true }, VIEW]);
    const edit = topOf(bar, 'Edit');
    await userEvent.click(edit, { force: true });
    await settle(bar);
    expect(active(bar)).toBe(edit);
    expect(edit.matches(':focus-visible')).toBe(false);
    expect(getComputedStyle(edit, '::before').content).toBe('none');
    expect(getComputedStyle(edit, '::after').content).toBe('none');
  });

  it('a disabled top item: state/disabled-opacity on the whole item and no hover', async () => {
    const bar = await mount([FILE, { ...EDIT, disabled: true }, VIEW]);
    const edit = topOf(bar, 'Edit');
    const style = getComputedStyle(edit);
    expect(style.opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(style.color).toBe(resolved('color', '--nph-menubar-trigger-foreground'));
    await userEvent.hover(edit, { force: true });
    expect(getComputedStyle(edit).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(edit).color).toBe(resolved('color', '--nph-menubar-trigger-foreground'));
    expect(getComputedStyle(topOf(bar, 'File')).opacity).toBe('1');
  });

  it('the first panel sits menubar/panel-offset below its top item, aligned to the start edge', async () => {
    const bar = await mount();
    await openFromCode(bar, 'edit');
    const top = topOf(bar, 'Edit').getBoundingClientRect();
    const box = panel(bar).getBoundingClientRect();
    expect(box.top - top.bottom).toBeCloseTo(px('--nph-menubar-panel-offset'), 1);
    expect(box.left).toBeCloseTo(top.left, 1);
    expect(panel(bar).dataset.side).toBe('bottom');
  });

  it('the panel and its items replicate the dropdown tokens: popover surface, border, radius, shadow, width and row height', async () => {
    const bar = await mount();
    await openFromCode(bar);
    const style = getComputedStyle(panel(bar));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-popover'));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-color-dropdown-border'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-dropdown-panel-radius'));
    expect(style.boxShadow).toBe(resolved('box-shadow', '--nph-elevation-dropdown'));
    expect(Number.parseFloat(style.paddingTop)).toBeCloseTo(px('--nph-space-inline-tight'), 1);
    expect(panel(bar).getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-input-width'), 0);
    const item = byText(bar, 'New');
    expect(item.getBoundingClientRect().height).toBeCloseTo(px('--nph-icon-size-md') + 2 * px('--nph-space-inline'), 0);
    expect(getComputedStyle(item).borderTopLeftRadius).toBe(resolved('border-radius', '--nph-dropdown-item-radius'));
    const shortcut = item.querySelector('.shortcut') as HTMLElement;
    expect(getComputedStyle(shortcut).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    const destructive = byText(bar, 'Delete');
    expect(getComputedStyle(destructive.querySelector('.text') as HTMLElement).color).toBe(resolved('color', '--nph-dropdown-item-destructive-foreground'));
  });

  it('the item in the panel hovers in color/primary-surface and turns its icon solid', async () => {
    const bar = await mount();
    await openFromCode(bar);
    const item = byText(bar, 'Open');
    await userEvent.hover(item);
    expect(getComputedStyle(item).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
    expect(getComputedStyle(item.querySelector('.glyph-rest') as HTMLElement).display).toBe('none');
    expect(getComputedStyle(item.querySelector('.glyph-hover') as HTMLElement).display).not.toBe('none');
  });

  it('the item of the panel in keyboard focus has the border in focus/border and the halo in focus/halo', async () => {
    const bar = await mount();
    await openByKeyboard(bar);
    const item = items(bar)[0] as HTMLElement;
    expect(item.matches(':focus-visible')).toBe(true);
    const border = getComputedStyle(item, '::before');
    const halo = getComputedStyle(item, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(Number.parseFloat(border.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    expect(border.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-dropdown-item-focus-border-radius'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(Number.parseFloat(halo.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
    expect(halo.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-dropdown-item-focus-halo-radius'));
  });

  it('the submenu sits dropdown/submenu-offset beside the panel, on the line of the item that opened it', async () => {
    const bar = await mount();
    await openFromCode(bar);
    await openSubmenuFromCode(bar);
    const offset = px('--nph-dropdown-submenu-offset');
    expect(offset).toBeGreaterThan(0);
    const main = panel(bar).getBoundingClientRect();
    const sub = panel(bar, 1).getBoundingClientRect();
    expect(sub.left).toBeCloseTo(main.right + offset, 1);
    const first = (items(bar, 1)[0] as HTMLElement).getBoundingClientRect();
    expect(first.top).toBeCloseTo(byText(bar, 'Recent').getBoundingClientRect().top, 0);
    expect(panel(bar, 1).dataset.side).toBe('right');
    expect(sub.width).toBeCloseTo(main.width, 0);
  });

  it('the item that opened the submenu keeps the highlight, with the solid arrow', async () => {
    const bar = await mount();
    await openFromCode(bar);
    await openSubmenuFromCode(bar);
    const recent = byText(bar, 'Recent');
    expect(getComputedStyle(recent).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
    expect(getComputedStyle(recent.querySelector('.glyph-rest') as HTMLElement).display).toBe('none');
    expect(getComputedStyle(recent.querySelector('.glyph-hover') as HTMLElement).display).not.toBe('none');
  });

  it('a single choice that is checked shows the check, and a multiple choice shows the box', async () => {
    const bar = await mount();
    await openFromCode(bar, 'view');
    expect(byText(bar, 'Comfortable').querySelector('.check')).not.toBeNull();
    expect(byText(bar, 'Compact').querySelector('.check')).toBeNull();
    expect(getComputedStyle(byText(bar, 'Comfortable').querySelector('.text') as HTMLElement).color).toBe(resolved('color', '--nph-color-primary-text'));
    expect(byText(bar, 'Ruler').querySelector('nph-checkbox')).not.toBeNull();
    expect(byText(bar, 'Ruler').querySelector('nph-checkbox')?.hasAttribute('inert')).toBe(true);
  });

  it('the group label is text/label-sm in color/muted-foreground, and the separator is dropdown/separator', async () => {
    const bar = await mount();
    await openFromCode(bar, 'view');
    const label = panel(bar).querySelector('.group-label') as HTMLElement;
    expect(getComputedStyle(label).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(getComputedStyle(label).fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
    const separator = panel(bar).querySelector('.separator') as HTMLElement;
    expect(getComputedStyle(separator).backgroundColor).toBe(resolved('background-color', '--nph-dropdown-separator'));
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('every menubar token, and dropdown/submenu-offset, is read by the CSS', () => {
    const emitted = [...new Set([...tokensCss.matchAll(/^\s*(--nph-menubar-[a-z0-9-]+):/gm)].map((match) => match[1] as string))];
    expect(emitted.sort()).toEqual([
      '--nph-menubar-bar-gap',
      '--nph-menubar-panel-offset',
      '--nph-menubar-trigger-background-hover',
      '--nph-menubar-trigger-foreground',
      '--nph-menubar-trigger-foreground-hover',
      '--nph-menubar-trigger-height',
      '--nph-menubar-trigger-padding-x',
      '--nph-menubar-trigger-radius',
    ]);
    expect(emitted.filter((name) => !used.has(name))).toEqual([]);
    expect(used.has('--nph-dropdown-submenu-offset')).toBe(true);
  });

  it('uses the global tokens the evidence gives to the parts with none of their own', () => {
    for (const name of [
      '--nph-focus-border',
      '--nph-focus-halo',
      '--nph-focus-ring-width',
      '--nph-border-width',
      '--nph-focus-border-radius-control',
      '--nph-focus-radius-control-with-border',
      '--nph-state-disabled-opacity',
      '--nph-text-label-md-font-size',
      '--nph-dropdown-panel-radius',
      '--nph-dropdown-item-radius',
      '--nph-dropdown-item-focus-border-radius',
      '--nph-dropdown-item-focus-halo-radius',
      '--nph-dropdown-separator',
      '--nph-dropdown-item-destructive-foreground',
      '--nph-motion-enter-duration',
      '--nph-motion-exit-duration',
      '--nph-motion-hover-duration',
    ]) {
      expect(used, name).toContain(name);
    }
  });

  it('never consumes a core or theme token: components use the semantic layer only', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, measure or duration', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/);
    expect(cssWithoutComments).not.toMatch(/\btransition:\s*(none|all)\b/);
  });
});

describe('keyboard on the bar', () => {
  it('Tab enters on the top item held as the Tab stop and leaves the bar', async () => {
    const bar = await mount();
    await tabIn(bar);
    expect(active(bar)).toBe(topOf(bar, 'File'));
    expect(topOf(bar, 'File').matches(':focus-visible')).toBe(true);
    await press(bar, '{Tab}');
    expect(document.activeElement).toBe(idOf('after'));
    await press(bar, '{Shift>}{Tab}{/Shift}');
    expect(active(bar)).toBe(topOf(bar, 'File'));
  });

  it('Right and Left move between the top items and wrap', async () => {
    const bar = await mount();
    await tabIn(bar);
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
    await press(bar, '{ArrowRight}{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'Help'));
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'File'));
    await press(bar, '{ArrowLeft}');
    expect(active(bar)).toBe(topOf(bar, 'Help'));
    await press(bar, '{ArrowLeft}');
    expect(active(bar)).toBe(topOf(bar, 'View'));
    expect(bar.openMenu).toBe('');
  });

  it('Home and End go to the first and the last top item', async () => {
    const bar = await mount();
    await tabIn(bar);
    await press(bar, '{End}');
    expect(active(bar)).toBe(topOf(bar, 'Help'));
    await press(bar, '{Home}');
    expect(active(bar)).toBe(topOf(bar, 'File'));
  });

  it('the arrows reach a disabled top item, which takes the focus', async () => {
    const bar = await mount([FILE, { ...EDIT, disabled: true }, VIEW]);
    await tabIn(bar);
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'View'));
  });

  for (const [name, key] of [
    ['Enter', '{Enter}'],
    ['Space', ' '],
    ['Down', '{ArrowDown}'],
  ] as const) {
    it(`${name} on a top item opens its panel and focuses the first item, with the ring`, async () => {
      const bar = await mount();
      await focusTop(bar, 'Edit');
      await press(bar, key);
      await vi.waitFor(() => expect(shown(bar)).toBe(true));
      expect(bar.openMenu).toBe('edit');
      expect(topOf(bar, 'Edit').getAttribute('aria-expanded')).toBe('true');
      expect(active(bar)).toBe(items(bar)[0]);
      expect(textOf(active(bar) as Element)).toBe('Undo');
      expect(active(bar)?.matches(':focus-visible')).toBe(true);
    });
  }

  it('Up on a top item opens its panel and focuses the last item', async () => {
    const bar = await mount();
    await focusTop(bar, 'File');
    await press(bar, '{ArrowUp}');
    await vi.waitFor(() => expect(shown(bar)).toBe(true));
    expect(active(bar)).toBe(items(bar).at(-1));
    expect(textOf(active(bar) as Element)).toBe('Delete');
  });

  it('with a panel open, Right and Left switch menus and the focus stays on the top item, with the new panel open', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowRight}');
    expect(bar.openMenu).toBe('edit');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
    expect(topOf(bar, 'Edit').matches(':focus-visible')).toBe(true);
    await vi.waitFor(() => expect(labelsOf(bar)).toEqual(['Undo', 'Redo', 'Cut', 'Copy', 'Paste']));
    await press(bar, '{ArrowRight}');
    expect(bar.openMenu).toBe('view');
    expect(active(bar)).toBe(topOf(bar, 'View'));
    await press(bar, '{ArrowLeft}{ArrowLeft}');
    expect(bar.openMenu).toBe('file');
    expect(active(bar)).toBe(topOf(bar, 'File'));
    await press(bar, '{ArrowLeft}');
    expect(bar.openMenu).toBe('help');
    expect(active(bar)).toBe(topOf(bar, 'Help'));
    await press(bar, '{ArrowRight}');
    expect(bar.openMenu).toBe('file');
    expect(topOf(bar, 'File').getAttribute('aria-expanded')).toBe('true');
    expect(topOf(bar, 'Help').getAttribute('aria-expanded')).toBe('false');
  });

  it('with a panel open and the focus on the top item, Down goes into the panel and Up goes to its last item', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
    await press(bar, '{ArrowDown}');
    expect(active(bar)).toBe(items(bar)[0]);
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'View'));
    await press(bar, '{ArrowUp}');
    expect(textOf(active(bar) as Element)).toBe('Compact');
  });

  it('with a panel open, Home and End on the top item go to the first and the last top item and open their panels', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowRight}');
    await press(bar, '{End}');
    expect(bar.openMenu).toBe('help');
    expect(active(bar)).toBe(topOf(bar, 'Help'));
    await press(bar, '{Home}');
    expect(bar.openMenu).toBe('file');
  });

  it('the arrows onto a disabled top item close the panel and focus it', async () => {
    const bar = await mount([FILE, { ...EDIT, disabled: true }, VIEW]);
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
    expect(bar.openMenu).toBe('');
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
  });

  it('right to left: the arrows are swapped on the bar', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const bar = await mount();
    await tabIn(bar);
    await press(bar, '{ArrowLeft}');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'File'));
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'Help'));
  });
});

describe('keyboard in the panel', () => {
  it('Up and Down move between the items and wrap, Home and End go to the ends', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    const list = items(bar);
    await press(bar, '{ArrowDown}');
    expect(active(bar)).toBe(list[1]);
    await press(bar, '{ArrowUp}{ArrowUp}');
    expect(active(bar)).toBe(list.at(-1));
    await press(bar, '{ArrowDown}');
    expect(active(bar)).toBe(list[0]);
    await press(bar, '{End}');
    expect(active(bar)).toBe(list.at(-1));
    await press(bar, '{Home}');
    expect(active(bar)).toBe(list[0]);
  });

  it('a typed character goes to the next item that starts with it, and the same character again goes on', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'Edit');
    await press(bar, 'p');
    expect(active(bar)).toBe(byText(bar, 'Paste'));
    await sleep(600);
    await press(bar, 'c');
    expect(active(bar)).toBe(byText(bar, 'Cut'));
    await press(bar, 'c');
    expect(active(bar)).toBe(byText(bar, 'Copy'));
    await sleep(600);
    await press(bar, 'u');
    expect(active(bar)).toBe(byText(bar, 'Undo'));
  });

  it('letters typed together search for the whole word, and a letter with no match keeps the focus', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'Edit');
    await press(bar, 'c');
    await press(bar, 'o');
    expect(active(bar)).toBe(byText(bar, 'Copy'));
    await sleep(600);
    await press(bar, 'z');
    expect(active(bar)).toBe(byText(bar, 'Copy'));
  });

  it('a disabled item takes the focus and does not run on Enter or Space', async () => {
    const bar = await mount();
    const seen = events(bar);
    await openByKeyboard(bar, 'Edit');
    await press(bar, '{ArrowDown}');
    expect(active(bar)).toBe(byText(bar, 'Redo'));
    await press(bar, '{Enter}');
    await press(bar, ' ');
    expect(seen).toEqual([]);
    expect(bar.openMenu).toBe('edit');
  });

  it('Right on an item with a submenu opens it and focuses its first item; Left closes it and gives the focus back to the parent', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowDown}{ArrowDown}');
    expect(active(bar)).toBe(byText(bar, 'Recent'));
    await press(bar, '{ArrowRight}');
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    expect(bar.openSubmenu).toBe('recent');
    expect(bar.getAttribute('open-submenu')).toBe('recent');
    await vi.waitFor(() => expect(active(bar)).toBe(items(bar, 1)[0]));
    expect(items(bar, 1)[0]?.matches(':focus-visible')).toBe(true);
    expect(labelsOf(bar, 1)).toEqual(['annual-report.pdf', 'budget-2026.xlsx', 'meeting-minutes.docx']);
    await press(bar, '{ArrowLeft}');
    expect(bar.openSubmenu).toBe('');
    expect(active(bar)).toBe(byText(bar, 'Recent'));
    expect(bar.openMenu).toBe('file');
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(false));
  });

  it('Enter and Space on an item with a submenu open it and focus its first item', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowDown}{ArrowDown}');
    await press(bar, '{Enter}');
    await vi.waitFor(() => expect(active(bar)).toBe(items(bar, 1)[0]));
    await press(bar, '{ArrowLeft}');
    expect(bar.openSubmenu).toBe('');
    await press(bar, ' ');
    await vi.waitFor(() => expect(active(bar)).toBe(items(bar, 1)[0]));
    expect(bar.openMenu).toBe('file');
  });

  it('the arrows move inside the submenu with wrap', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowDown}{ArrowDown}{ArrowRight}');
    await vi.waitFor(() => expect(active(bar)).toBe(items(bar, 1)[0]));
    await press(bar, '{ArrowUp}');
    expect(active(bar)).toBe(items(bar, 1).at(-1));
    await press(bar, '{ArrowDown}');
    expect(active(bar)).toBe(items(bar, 1)[0]);
  });

  it('Right on an item with no submenu goes to the next menu, with the focus on its top item', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    expect(active(bar)).toBe(byText(bar, 'New'));
    await press(bar, '{ArrowRight}');
    expect(bar.openMenu).toBe('edit');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
    await vi.waitFor(() => expect(labelsOf(bar)).toEqual(['Undo', 'Redo', 'Cut', 'Copy', 'Paste']));
  });

  it('Left at the first level goes to the previous menu, wrapping, with the focus on its top item', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowLeft}');
    expect(bar.openMenu).toBe('help');
    expect(active(bar)).toBe(topOf(bar, 'Help'));
    await press(bar, '{ArrowDown}');
    await press(bar, '{ArrowLeft}');
    expect(bar.openMenu).toBe('view');
    expect(active(bar)).toBe(topOf(bar, 'View'));
  });

  it('Enter activates the item, fires the event and closes the panel, giving the focus back to the top item', async () => {
    const bar = await mount();
    const seen = events(bar);
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowDown}{Enter}');
    expect(seen).toEqual([{ value: 'open', checked: null, menu: 'file' }]);
    expect(bar.openMenu).toBe('');
    expect(active(bar)).toBe(topOf(bar, 'File'));
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
  });

  it('Enter on a multiple choice and on a single choice also closes the panel', async () => {
    const bar = await mount();
    const seen = events(bar);
    await openByKeyboard(bar, 'View');
    await press(bar, '{Enter}');
    expect(seen).toEqual([{ value: 'ruler', checked: false, menu: 'view' }]);
    expect(bar.openMenu).toBe('');
    await press(bar, '{ArrowDown}');
    await vi.waitFor(() => expect(shown(bar)).toBe(true));
    await press(bar, '{End}{Enter}');
    expect(seen.at(-1)).toEqual({ value: 'compact', checked: true, menu: 'view' });
    expect(bar.openMenu).toBe('');
  });

  it('Space on a multiple and on a single choice checks it without closing the panel', async () => {
    const bar = await mount();
    const seen = events(bar);
    await openByKeyboard(bar, 'View');
    await press(bar, '{ArrowDown} ');
    expect(seen).toEqual([{ value: 'grid', checked: true, menu: 'view' }]);
    expect(bar.openMenu).toBe('view');
    expect(active(bar)).toBe(byText(bar, 'Grid'));
    expect(byText(bar, 'Grid').getAttribute('aria-checked')).toBe('true');
    await press(bar, '{End} ');
    expect(seen.at(-1)).toEqual({ value: 'compact', checked: true, menu: 'view' });
    expect(bar.openMenu).toBe('view');
    expect(byText(bar, 'Compact').getAttribute('aria-checked')).toBe('true');
    expect(byText(bar, 'Comfortable').getAttribute('aria-checked')).toBe('false');
    await press(bar, '{ArrowUp}{ArrowUp}{ArrowUp} ');
    expect(seen.at(-1)).toEqual({ value: 'ruler', checked: false, menu: 'view' });
  });

  it('Space on a plain item does the same as Enter: it runs and closes', async () => {
    const bar = await mount();
    const seen = events(bar);
    await openByKeyboard(bar, 'File');
    await press(bar, ' ');
    expect(seen).toEqual([{ value: 'new', checked: null, menu: 'file' }]);
    expect(bar.openMenu).toBe('');
    expect(active(bar)).toBe(topOf(bar, 'File'));
    await sleep(100);
    expect(bar.openMenu).toBe('');
  });

  it('Space right after a typed character activates the item it reached', async () => {
    const bar = await mount();
    const seen = events(bar);
    await openByKeyboard(bar, 'Edit');
    await press(bar, 'p');
    await press(bar, ' ');
    expect(seen.map((detail) => detail.value)).toEqual(['paste']);
  });

  it('right to left: Left opens the submenu and Right closes it; Right goes to the previous menu', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowDown}{ArrowDown}{ArrowLeft}');
    await vi.waitFor(() => expect(bar.openSubmenu).toBe('recent'));
    await press(bar, '{ArrowRight}');
    expect(bar.openSubmenu).toBe('');
    expect(active(bar)).toBe(byText(bar, 'Recent'));
    await press(bar, '{Home}{ArrowRight}');
    expect(bar.openMenu).toBe('help');
    expect(active(bar)).toBe(topOf(bar, 'Help'));
  });
});

describe('closing by keyboard', () => {
  it('Esc closes one level at a time: the submenu, then the panel, and the focus goes back to the item that opened it', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowDown}{ArrowDown}{ArrowRight}');
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    await press(bar, '{Escape}');
    expect(bar.openSubmenu).toBe('');
    expect(bar.openMenu).toBe('file');
    expect(active(bar)).toBe(byText(bar, 'Recent'));
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(false));
    await press(bar, '{Escape}');
    expect(bar.openMenu).toBe('');
    expect(active(bar)).toBe(topOf(bar, 'File'));
    expect(topOf(bar, 'File').getAttribute('aria-expanded')).toBe('false');
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
  });

  it('Esc does not reach the page while something is open', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    const seen = vi.fn();
    document.addEventListener('keydown', seen);
    await userEvent.keyboard('{Escape}');
    document.removeEventListener('keydown', seen);
    expect(seen).not.toHaveBeenCalled();
    expect(bar.openMenu).toBe('');
  });

  it('Esc with the panel closed does nothing and is not intercepted', async () => {
    const bar = await mount();
    await tabIn(bar);
    const seen = vi.fn();
    document.addEventListener('keydown', seen);
    await userEvent.keyboard('{Escape}');
    document.removeEventListener('keydown', seen);
    expect(seen).toHaveBeenCalled();
    expect(seen.mock.calls[0]?.[0].defaultPrevented).toBe(false);
    expect(bar.openMenu).toBe('');
    expect(active(bar)).toBe(topOf(bar, 'File'));
  });

  it('Esc with the focus on a top item whose panel is open closes it and keeps the focus there', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
    await press(bar, '{Escape}');
    expect(bar.openMenu).toBe('');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
  });

  it('Tab in a panel closes it and the focus leaves the bar', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{Tab}');
    expect(bar.openMenu).toBe('');
    expect(document.activeElement).toBe(idOf('after'));
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
  });

  it('Shift+Tab in a panel closes it and the focus goes to what comes before the bar', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{Shift>}{Tab}{/Shift}');
    expect(bar.openMenu).toBe('');
    expect(document.activeElement).toBe(idOf('before'));
  });

  it('Tab on a top item whose panel is open closes the panel and leaves the bar', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowRight}');
    await press(bar, '{Tab}');
    expect(bar.openMenu).toBe('');
    expect(document.activeElement).toBe(idOf('after'));
  });
});

describe('pointer', () => {
  it('a click on a top item opens its panel and gives the first item the focus, without the ring', async () => {
    const bar = await mount();
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    await entered(bar);
    expect(bar.openMenu).toBe('file');
    expect(shown(bar)).toBe(true);
    expect(active(bar)).toBe(items(bar)[0]);
    expect(items(bar)[0]?.matches(':focus-visible')).toBe(false);
  });

  it('a click on the open top item closes it and keeps the focus on the top item', async () => {
    const bar = await mount();
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    await entered(bar);
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    expect(bar.openMenu).toBe('');
    expect(topOf(bar, 'File').getAttribute('aria-expanded')).toBe('false');
    expect(active(bar)).toBe(topOf(bar, 'File'));
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
  });

  it('with a panel open, the pointer entering another top item switches to it and moves the focus to that top item', async () => {
    const bar = await mount();
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    topOf(bar, 'Edit').dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    await settle(bar);
    expect(bar.openMenu).toBe('edit');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
    expect(topOf(bar, 'File').getAttribute('aria-expanded')).toBe('false');
    await vi.waitFor(() => expect(labelsOf(bar)).toEqual(['Undo', 'Redo', 'Cut', 'Copy', 'Paste']));
    expect(items(bar).some((element) => element === active(bar))).toBe(false);
  });

  it('the real pointer moving over another top item switches the panel too', async () => {
    const bar = await mount();
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    await userEvent.hover(topOf(bar, 'View'));
    await settle(bar);
    expect(bar.openMenu).toBe('view');
    expect(active(bar)).toBe(topOf(bar, 'View'));
  });

  it('with no panel open the pointer over a top item opens nothing', async () => {
    const bar = await mount();
    await userEvent.hover(topOf(bar, 'Edit'));
    topOf(bar, 'View').dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    await settle(bar);
    expect(bar.openMenu).toBe('');
    expect(shown(bar)).toBe(false);
  });

  it('a touch pointer entering a top item does not switch the panel', async () => {
    const bar = await mount();
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    topOf(bar, 'Edit').dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }));
    await settle(bar);
    expect(bar.openMenu).toBe('file');
  });

  it('the pointer over a disabled top item does not switch to it', async () => {
    const bar = await mount([FILE, { ...EDIT, disabled: true }, VIEW]);
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    topOf(bar, 'Edit').dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    await settle(bar);
    expect(bar.openMenu).toBe('file');
  });

  it('the pointer over an item highlights it and takes the focus to it', async () => {
    const bar = await mount();
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    await entered(bar);
    await userEvent.hover(byText(bar, 'Open'));
    expect(active(bar)).toBe(byText(bar, 'Open'));
    expect(getComputedStyle(byText(bar, 'Open')).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
  });

  it('the pointer over an item with a submenu opens it after motion/hover-delay, and over an item with none closes it', async () => {
    const bar = await mount();
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    await entered(bar);
    const delay = Number.parseFloat(resolved('transition-delay', '--nph-motion-hover-delay')) * 1000;
    expect(delay).toBeGreaterThan(0);
    const start = performance.now();
    await userEvent.hover(byText(bar, 'Recent'));
    expect(bar.openSubmenu).toBe('');
    await vi.waitFor(() => expect(bar.openSubmenu).toBe('recent'), { timeout: 2000 });
    expect(performance.now() - start).toBeGreaterThanOrEqual(delay - 60);
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    await userEvent.hover(byText(bar, 'New'));
    await vi.waitFor(() => expect(bar.openSubmenu).toBe(''), { timeout: 2000 });
    expect(bar.openMenu).toBe('file');
  });

  it('the pointer inside the submenu keeps it open', async () => {
    const bar = await mount();
    await openFromCode(bar);
    await openSubmenuFromCode(bar);
    await userEvent.hover(byText(bar, 'Recent'));
    await userEvent.hover(byText(bar, 'budget-2026.xlsx', 1));
    await sleep(600);
    expect(bar.openSubmenu).toBe('recent');
  });

  it('a click on an item with a submenu opens the submenu and runs nothing', async () => {
    const bar = await mount();
    const seen = events(bar);
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    await entered(bar);
    await userEvent.click(byText(bar, 'Recent'));
    await vi.waitFor(() => expect(bar.openSubmenu).toBe('recent'));
    expect(seen).toEqual([]);
    expect(bar.openMenu).toBe('file');
  });

  it('a click on a common item fires the event, closes the panel and gives the focus back to the top item', async () => {
    const bar = await mount();
    const seen = events(bar);
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    await entered(bar);
    await userEvent.click(byText(bar, 'Open'));
    await settle(bar);
    expect(seen).toEqual([{ value: 'open', checked: null, menu: 'file' }]);
    expect(bar.openMenu).toBe('');
    expect(active(bar)).toBe(topOf(bar, 'File'));
  });

  it('a click on a multiple choice fires the event and keeps the panel open; on a single choice it closes', async () => {
    const bar = await mount();
    const seen = events(bar);
    await userEvent.click(topOf(bar, 'View'));
    await settle(bar);
    await entered(bar);
    await userEvent.click(byText(bar, 'Grid'));
    await settle(bar);
    expect(seen).toEqual([{ value: 'grid', checked: true, menu: 'view' }]);
    expect(bar.openMenu).toBe('view');
    await userEvent.click(byText(bar, 'Ruler'));
    await settle(bar);
    expect(seen.at(-1)).toEqual({ value: 'ruler', checked: false, menu: 'view' });
    expect(bar.openMenu).toBe('view');
    await userEvent.click(byText(bar, 'Compact'));
    await settle(bar);
    expect(seen.at(-1)).toEqual({ value: 'compact', checked: true, menu: 'view' });
    expect(bar.openMenu).toBe('');
  });

  it('a press outside closes the panel and leaves the focus where the person pressed', async () => {
    const bar = await mount();
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    await entered(bar);
    await userEvent.click(idOf('after'));
    await settle(bar);
    expect(bar.openMenu).toBe('');
    expect(document.activeElement).toBe(idOf('after'));
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
  });

  it('a press on the page that takes no focus closes the panel and does not return the focus to the top item', async () => {
    const bar = await mount();
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    await entered(bar);
    await userEvent.click(document.body, { position: { x: 900, y: 600 } });
    await settle(bar);
    expect(bar.openMenu).toBe('');
    expect(active(bar)).not.toBe(topOf(bar, 'File'));
  });

  it('a press inside the panel, outside an item, keeps it open', async () => {
    const bar = await mount();
    await userEvent.click(topOf(bar, 'File'));
    await settle(bar);
    await entered(bar);
    const box = panel(bar).getBoundingClientRect();
    await userEvent.click(panel(bar), { position: { x: 1, y: Math.round(box.height / 2) } });
    await settle(bar);
    expect(bar.openMenu).toBe('file');
    expect(shown(bar)).toBe(true);
  });

  it('a press inside the submenu keeps both panels open', async () => {
    const bar = await mount();
    await openFromCode(bar);
    await openSubmenuFromCode(bar);
    const box = panel(bar, 1).getBoundingClientRect();
    await userEvent.click(panel(bar, 1), { position: { x: 1, y: Math.round(box.height / 2) } });
    await settle(bar);
    expect(bar.openMenu).toBe('file');
    expect(bar.openSubmenu).toBe('recent');
  });
});

describe('the event and the state of the choices', () => {
  it('nph-item-select bubbles and carries value, checked and menu only', async () => {
    const bar = await mount();
    const outer = vi.fn();
    document.body.addEventListener('nph-item-select', outer);
    const seen = events(bar);
    await openByKeyboard(bar, 'File');
    await press(bar, '{Enter}');
    document.body.removeEventListener('nph-item-select', outer);
    expect(outer).toHaveBeenCalledTimes(1);
    expect(Object.keys(seen[0] ?? {}).sort()).toEqual(['checked', 'menu', 'value']);
    expect(seen[0]).toEqual({ value: 'new', checked: null, menu: 'file' });
  });

  it('an item of the submenu reports its own value and the real top menu, closes everything and gives the focus back', async () => {
    const bar = await mount();
    const seen = events(bar);
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowDown}{ArrowDown}{ArrowRight}');
    await vi.waitFor(() => expect(active(bar)).toBe(items(bar, 1)[0]));
    await press(bar, '{ArrowDown}{Enter}');
    expect(seen).toEqual([{ value: 'budget', checked: null, menu: 'file' }]);
    expect(bar.openMenu).toBe('');
    expect(bar.openSubmenu).toBe('');
    expect(active(bar)).toBe(topOf(bar, 'File'));
  });

  it('a single choice is exclusive inside its group and leaves the other groups alone', async () => {
    const menu: NphMenubarMenu = freeze({
      value: 'layout',
      label: 'Layout',
      items: [
        { value: 'list', text: 'List', selection: 'single', checked: true },
        { value: 'grid', text: 'Grid', selection: 'single' },
        { type: 'separator' },
        { value: 'small', text: 'Small', selection: 'single', checked: true },
        { value: 'large', text: 'Large', selection: 'single' },
      ],
    });
    const bar = await mount([menu]);
    const seen = events(bar);
    await userEvent.click(topOf(bar, 'Layout'));
    await settle(bar);
    await entered(bar);
    await userEvent.click(byText(bar, 'Grid'));
    await settle(bar);
    expect(seen).toEqual([{ value: 'grid', checked: true, menu: 'layout' }]);
    const entries = (bar.menus[0] as NphMenubarMenu).items as unknown as { value?: string; checked?: boolean }[];
    expect(entries.filter((entry) => entry.checked).map((entry) => entry.value)).toEqual(['grid', 'small']);
    expect(bar.openMenu).toBe('');
  });

  it('a multiple choice toggles', async () => {
    const bar = await mount();
    const seen = events(bar);
    await openByKeyboard(bar, 'View');
    await press(bar, '{ArrowDown} ');
    await press(bar, ' ');
    expect(seen.map((detail) => [detail.value, detail.checked])).toEqual([
      ['grid', true],
      ['grid', false],
    ]);
  });

  it('menus is replaced by a new list that carries the new state, and no object of the consumer changes', async () => {
    const before = JSON.stringify(MENUS);
    const bar = await mount();
    const original = bar.menus;
    await userEvent.click(topOf(bar, 'View'));
    await settle(bar);
    await entered(bar);
    await userEvent.click(byText(bar, 'Compact'));
    await settle(bar);
    expect(bar.menus).not.toBe(original);
    expect(bar.menus).not.toBe(MENUS);
    expect(JSON.stringify(MENUS)).toBe(before);
    expect(bar.menus[0]).toBe(FILE);
    expect(bar.menus[1]).toBe(EDIT);
    expect(bar.menus[2]).not.toBe(VIEW);
    const density = (bar.menus[2] as NphMenubarMenu).items.filter((entry) => entry.type === undefined || entry.type === 'item') as { value: string; checked?: boolean }[];
    expect(density.filter((entry) => entry.checked).map((entry) => entry.value)).toEqual(['ruler', 'compact']);
    await userEvent.click(topOf(bar, 'View'));
    await settle(bar);
    await entered(bar);
    expect(byText(bar, 'Compact').getAttribute('aria-checked')).toBe('true');
    expect(byText(bar, 'Comfortable').getAttribute('aria-checked')).toBe('false');
    expect(byText(bar, 'Ruler').getAttribute('aria-checked')).toBe('true');
  });

  it('the state of a choice inside a submenu is rewritten too, without touching the consumer', async () => {
    const menu: NphMenubarMenu = freeze({
      value: 'tools',
      label: 'Tools',
      items: [
        {
          value: 'sort',
          text: 'Sort by',
          submenu: [
            { value: 'name', text: 'Name', selection: 'single', checked: true },
            { value: 'date', text: 'Date', selection: 'single' },
            { type: 'separator' },
            { value: 'reverse', text: 'Reverse', selection: 'multiple' },
          ],
        },
        { value: 'x', text: 'X' },
      ],
    });
    const bar = await mount([menu]);
    const seen = events(bar);
    await openFromCode(bar, 'tools');
    await openSubmenuFromCode(bar, 'sort');
    await userEvent.click(byText(bar, 'Reverse', 1));
    await settle(bar);
    expect(seen).toEqual([{ value: 'reverse', checked: true, menu: 'tools' }]);
    expect(bar.openMenu).toBe('tools');
    expect(bar.openSubmenu).toBe('sort');
    const sort = (bar.menus[0] as NphMenubarMenu).items[0] as unknown as { submenu: { value?: string; checked?: boolean }[] };
    expect(sort.submenu.find((entry) => entry.value === 'reverse')?.checked).toBe(true);
    expect(sort.submenu.find((entry) => entry.value === 'name')?.checked).toBe(true);
    expect(bar.menus[0]).not.toBe(menu);
    await userEvent.click(byText(bar, 'Date', 1));
    await settle(bar);
    const after = (bar.menus[0] as NphMenubarMenu).items[0] as unknown as { submenu: { value?: string; checked?: boolean }[] };
    expect(after.submenu.filter((entry) => entry.checked).map((entry) => entry.value)).toEqual(['date', 'reverse']);
  });

  it('changing menus or open-menu from code fires nothing', async () => {
    const bar = await mount();
    const seen = events(bar);
    bar.openMenu = 'view';
    await settle(bar);
    bar.menus = [{ ...VIEW, items: [{ value: 'x', text: 'X', selection: 'multiple', checked: true }] }, FILE];
    await settle(bar);
    bar.openMenu = '';
    await settle(bar);
    expect(seen).toEqual([]);
  });

  it('a disabled item with a submenu does not open it', async () => {
    const bar = await mount([{ value: 'm', label: 'M', items: [{ value: 'sub', text: 'Sub', disabled: true, submenu: RECENT }, { value: 'x', text: 'X' }] }]);
    await openByKeyboard(bar, 'M');
    await press(bar, '{Enter}');
    await press(bar, '{ArrowRight}');
    await sleep(100);
    expect(bar.openSubmenu).toBe('');
    expect(shown(bar, 1)).toBe(false);
  });

  it('disabling the item while its submenu is open closes the submenu', async () => {
    const bar = await mount();
    await openFromCode(bar);
    await openSubmenuFromCode(bar);
    bar.menus = [
      { ...FILE, items: FILE.items.map((entry) => (entry.type === undefined && entry.value === 'recent' ? { ...entry, disabled: true } : entry)) },
      EDIT,
    ];
    await settle(bar);
    expect(bar.openSubmenu).toBe('');
    expect(byText(bar, 'Recent').getAttribute('aria-expanded')).toBe('false');
    expect(byText(bar, 'Recent').getAttribute('aria-disabled')).toBe('true');
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(false));
  });
});

describe('overflow', () => {
  const WITH_MORE = { moreLabel: 'More' };

  it('with room for everything, every menu is a top item and there is no overflow item', async () => {
    const bar = await mount(MENUS, WITH_MORE);
    expect(topLabels(bar)).toEqual(['File', 'Edit', 'View', 'Help']);
    expect(root(bar).querySelector('[data-more]')).toBeNull();
  });

  it('in a box narrower than the bar, the items that do not fit go into the last top item, in one line', async () => {
    const bar = await mount(MENUS, WITH_MORE);
    resize(bar, boxFor(bar, 2));
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['File', 'Edit', 'More']));
    const more = topOf(bar, 'More');
    expect(more.getAttribute('role')).toBe('menuitem');
    expect(more.getAttribute('aria-haspopup')).toBe('menu');
    expect(more.getAttribute('aria-expanded')).toBe('false');
    const rects = tops(bar).map((element) => element.getBoundingClientRect());
    expect(new Set(rects.map((rect) => Math.round(rect.top))).size).toBe(1);
    const barBox = (root(bar).querySelector('.bar') as HTMLElement).getBoundingClientRect();
    expect(barBox.right).toBeLessThanOrEqual(bar.getBoundingClientRect().right + 1);
    expect(more.getBoundingClientRect().left - (rects[1] as DOMRect).right).toBeCloseTo(px('--nph-menubar-bar-gap'), 1);
  });

  it('the overflow item opens a panel with the hidden menus as items with a submenu', async () => {
    const bar = await mount(MENUS, WITH_MORE);
    resize(bar, boxFor(bar, 2));
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['File', 'Edit', 'More']));
    await userEvent.click(topOf(bar, 'More'));
    await settle(bar);
    await entered(bar);
    expect(topOf(bar, 'More').getAttribute('aria-expanded')).toBe('true');
    expect(labelsOf(bar)).toEqual(['View', 'Help']);
    for (const element of items(bar)) {
      expect(element.getAttribute('aria-haspopup')).toBe('menu');
      expect(element.querySelector('.arrow')).not.toBeNull();
    }
    const node = await axNode(panel(bar).querySelector('[role="menu"]') as HTMLElement);
    expect(node.name).toBe('More');
    await userEvent.click(byText(bar, 'View'));
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    await settle(bar);
    expect(labelsOf(bar, 1)).toEqual(['Ruler', 'Grid', 'Comfortable', 'Compact']);
    expect(byText(bar, 'Ruler', 1).getAttribute('role')).toBe('menuitemcheckbox');
  });

  it('a menu that already has a submenu shows those items under a group label, in one level', async () => {
    const bar = await mount(MENUS, WITH_MORE);
    resize(bar, boxFor(bar, 0));
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['More']));
    await userEvent.click(topOf(bar, 'More'));
    await settle(bar);
    await entered(bar);
    expect(labelsOf(bar)).toEqual(['File', 'Edit', 'View', 'Help']);
    await userEvent.click(byText(bar, 'File'));
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    await settle(bar);
    const groups = [...panel(bar, 1).querySelectorAll<HTMLElement>('.group')].map((group) => [
      group.querySelector('.group-label')?.textContent?.trim() ?? '',
      [...group.querySelectorAll('.item')].map(textOf),
    ]);
    expect(groups).toEqual([
      ['', ['New', 'Open']],
      ['Recent', ['annual-report.pdf', 'budget-2026.xlsx', 'meeting-minutes.docx']],
      ['', ['Delete']],
    ]);
    expect(items(bar, 1).some((element) => element.hasAttribute('aria-haspopup'))).toBe(false);
  });

  it('growing the box brings the items back, and the overflow item goes away', async () => {
    const bar = await mount(MENUS, WITH_MORE);
    resize(bar, boxFor(bar, 1));
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['File', 'More']));
    resize(bar, boxFor(bar, 2));
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['File', 'Edit', 'More']));
    resize(bar, 640);
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['File', 'Edit', 'View', 'Help']));
    expect(root(bar).querySelector('[data-more]')).toBeNull();
  });

  it('the overflow item is part of the keyboard of the bar: End reaches it, Right wraps from it, and Down opens its panel', async () => {
    const bar = await mount(MENUS, WITH_MORE);
    resize(bar, boxFor(bar, 2));
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['File', 'Edit', 'More']));
    await tabIn(bar);
    await press(bar, '{End}');
    expect(active(bar)).toBe(topOf(bar, 'More'));
    await press(bar, '{ArrowRight}');
    expect(active(bar)).toBe(topOf(bar, 'File'));
    await press(bar, '{ArrowLeft}');
    expect(active(bar)).toBe(topOf(bar, 'More'));
    await press(bar, '{ArrowDown}');
    await vi.waitFor(() => expect(shown(bar)).toBe(true));
    expect(active(bar)).toBe(items(bar)[0]);
    expect(topOf(bar, 'More').getAttribute('aria-expanded')).toBe('true');
    await press(bar, '{ArrowRight}');
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    expect(labelsOf(bar, 1)).toEqual(['Ruler', 'Grid', 'Comfortable', 'Compact']);
    await press(bar, '{Escape}');
    expect(bar.openSubmenu).toBe('');
    expect(active(bar)).toBe(byText(bar, 'View'));
    await press(bar, '{Escape}');
    expect(active(bar)).toBe(topOf(bar, 'More'));
  });

  it('with the overflow panel open, Left switches to the neighbor top item and Right on the overflow item wraps to the first', async () => {
    const bar = await mount(MENUS, WITH_MORE);
    resize(bar, boxFor(bar, 2));
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['File', 'Edit', 'More']));
    await userEvent.click(topOf(bar, 'More'));
    await settle(bar);
    await entered(bar);
    await userEvent.hover(byText(bar, 'Help'));
    await press(bar, '{ArrowLeft}');
    expect(bar.openMenu).toBe('edit');
    expect(active(bar)).toBe(topOf(bar, 'Edit'));
    await press(bar, '{ArrowRight}');
    expect(topOf(bar, 'More').getAttribute('aria-expanded')).toBe('true');
    expect(active(bar)).toBe(topOf(bar, 'More'));
    await press(bar, '{ArrowRight}');
    expect(bar.openMenu).toBe('file');
  });

  it('an item chosen from the overflow panel reports the real top menu, and the state is kept when the bar grows', async () => {
    const bar = await mount(MENUS, WITH_MORE);
    const seen = events(bar);
    resize(bar, boxFor(bar, 2));
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['File', 'Edit', 'More']));
    await userEvent.click(topOf(bar, 'More'));
    await settle(bar);
    await entered(bar);
    await userEvent.click(byText(bar, 'View'));
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    await userEvent.click(byText(bar, 'Compact', 1));
    await settle(bar);
    expect(seen).toEqual([{ value: 'compact', checked: true, menu: 'view' }]);
    expect(bar.openMenu).toBe('');
    expect(active(bar)).toBe(topOf(bar, 'More'));
    resize(bar, 640);
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['File', 'Edit', 'View', 'Help']));
    await userEvent.click(topOf(bar, 'View'));
    await settle(bar);
    await entered(bar);
    expect(byText(bar, 'Compact').getAttribute('aria-checked')).toBe('true');
    expect(byText(bar, 'Comfortable').getAttribute('aria-checked')).toBe('false');
  });

  it('an item of a menu with a submenu, chosen from the overflow panel, reports the real top menu', async () => {
    const bar = await mount(MENUS, WITH_MORE);
    const seen = events(bar);
    resize(bar, boxFor(bar, 0));
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['More']));
    await userEvent.click(topOf(bar, 'More'));
    await settle(bar);
    await entered(bar);
    await userEvent.click(byText(bar, 'File'));
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    await userEvent.click(byText(bar, 'meeting-minutes.docx', 1));
    await settle(bar);
    expect(seen).toEqual([{ value: 'minutes', checked: null, menu: 'file' }]);
  });

  it('a hidden menu that is disabled shows as a disabled item, and a panel open on a menu that moves into the overflow closes', async () => {
    const bar = await mount([FILE, EDIT, { ...VIEW, disabled: true }, HELP], WITH_MORE);
    resize(bar, boxFor(bar, 2));
    await vi.waitFor(() => expect(topLabels(bar)).toEqual(['File', 'Edit', 'More']));
    await userEvent.click(topOf(bar, 'More'));
    await settle(bar);
    await entered(bar);
    expect(byText(bar, 'View').getAttribute('aria-disabled')).toBe('true');
    expect(byText(bar, 'Help').hasAttribute('aria-disabled')).toBe(false);
  });

  it('without more-label nothing overflows and the bar warns once in development', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bar = await mount(MENUS, WITH_MORE);
    const narrow = boxFor(bar, 2);
    bar.moreLabel = '';
    await settle(bar);
    resize(bar, narrow);
    await sleep(150);
    await settle(bar);
    expect(topLabels(bar)).toEqual(['File', 'Edit', 'View', 'Help']);
    expect(root(bar).querySelector('[data-more]')).toBeNull();
    const warnings = errorsOf(spy).filter((message) => message.includes('more-label'));
    expect(warnings).toHaveLength(1);
    resize(bar, narrow - 20);
    await sleep(150);
    bar.requestUpdate();
    await settle(bar);
    expect(errorsOf(spy).filter((message) => message.includes('more-label'))).toHaveLength(1);
  });

  it('a bar that fits without more-label warns about nothing', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await mount();
    await sleep(100);
    expect(errorsOf(spy)).toEqual([]);
  });
});

describe('narrow', () => {
  const NARROW = { narrow: true, menuLabel: 'Menu' };

  it('draws only the button with the bars icon, named by menu-label, with no menubar', async () => {
    const bar = await mount(MENUS, NARROW);
    const button = root(bar).querySelector('.narrow-button') as HTMLElement;
    expect(button).not.toBeNull();
    expect(button.getAttribute('icon-start')).toBe('bars');
    expect(button.getAttribute('label')).toBe('Menu');
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(root(bar).querySelector('[role="menubar"]')).toBeNull();
    expect(root(bar).querySelector('.bar')).toBeNull();
    expect(tops(bar)).toEqual([]);
    const native = button.shadowRoot?.querySelector('button') as HTMLElement;
    const node = await axNode(native);
    expect(node.role).toBe('button');
    expect(node.name).toBe('Menu');
  });

  it('the button opens one panel with every menu as an item with a submenu', async () => {
    const bar = await mount(MENUS, NARROW);
    const button = root(bar).querySelector('.narrow-button') as HTMLElement;
    await userEvent.click(button);
    await settle(bar);
    await entered(bar);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(labelsOf(bar)).toEqual(['File', 'Edit', 'View', 'Help']);
    for (const element of items(bar)) {
      expect(element.getAttribute('aria-haspopup')).toBe('menu');
    }
    const node = await axNode(panel(bar).querySelector('[role="menu"]') as HTMLElement);
    expect(node.role).toBe('menu');
    expect(node.name).toBe('Menu');
  });

  it('a menu that already has a submenu shows those items under a group label, in one level', async () => {
    const bar = await mount(MENUS, NARROW);
    await userEvent.click(root(bar).querySelector('.narrow-button') as HTMLElement);
    await settle(bar);
    await entered(bar);
    await userEvent.click(byText(bar, 'File'));
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    await settle(bar);
    expect(labelsOf(bar, 1)).toEqual(['New', 'Open', 'annual-report.pdf', 'budget-2026.xlsx', 'meeting-minutes.docx', 'Delete']);
    expect([...panel(bar, 1).querySelectorAll('.group-label')].map((label) => label.textContent?.trim())).toEqual(['Recent']);
    expect(items(bar, 1).some((element) => element.hasAttribute('aria-haspopup'))).toBe(false);
  });

  it('an item chosen from the narrow panel reports the real top menu and closes, giving the focus back to the button', async () => {
    const bar = await mount(MENUS, NARROW);
    const seen = events(bar);
    const button = root(bar).querySelector('.narrow-button') as HTMLElement;
    await userEvent.click(button);
    await settle(bar);
    await entered(bar);
    await userEvent.click(byText(bar, 'Edit'));
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    await userEvent.click(byText(bar, 'Copy', 1));
    await settle(bar);
    expect(seen).toEqual([{ value: 'copy', checked: null, menu: 'edit' }]);
    expect(bar.openMenu).toBe('');
    expect(active(bar)).toBe(button);
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
  });

  it('the choices keep their state in the narrow panel and the consumer objects stay as they were', async () => {
    const before = JSON.stringify(MENUS);
    const bar = await mount(MENUS, NARROW);
    const seen = events(bar);
    await userEvent.click(root(bar).querySelector('.narrow-button') as HTMLElement);
    await settle(bar);
    await entered(bar);
    await userEvent.click(byText(bar, 'View'));
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    await userEvent.click(byText(bar, 'Compact', 1));
    await settle(bar);
    expect(seen).toEqual([{ value: 'compact', checked: true, menu: 'view' }]);
    expect(JSON.stringify(MENUS)).toBe(before);
    expect(bar.menus[2]).not.toBe(VIEW);
    expect(bar.menus[0]).toBe(FILE);
  });

  it('the keyboard works on the button: Enter opens, Right opens the submenu, Esc closes level by level', async () => {
    const bar = await mount(MENUS, NARROW);
    const button = root(bar).querySelector('.narrow-button') as HTMLElement;
    idOf('before').focus();
    await userEvent.keyboard('{Tab}');
    await settle(bar);
    expect(active(bar)).toBe(button);
    await press(bar, '{Enter}');
    await vi.waitFor(() => expect(shown(bar)).toBe(true));
    expect(active(bar)).toBe(items(bar)[0]);
    await press(bar, '{ArrowDown}{ArrowRight}');
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    expect(textOf(active(bar) as Element)).toBe('Undo');
    await press(bar, '{Escape}');
    expect(bar.openSubmenu).toBe('');
    expect(active(bar)).toBe(byText(bar, 'Edit'));
    await press(bar, '{Escape}');
    expect(active(bar)).toBe(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('narrow does not measure the width: no overflow item, even in a small box', async () => {
    const bar = await mount(MENUS, { ...NARROW, moreLabel: 'More' }, 'position: fixed; left: 40px; top: 40px; width: 60px;');
    await sleep(100);
    expect(tops(bar)).toEqual([]);
    expect(root(bar).querySelector('.probe')).toBeNull();
    expect(root(bar).querySelector('.narrow-button')).not.toBeNull();
  });

  it('going back to the wide bar draws the top items again', async () => {
    const bar = await mount(MENUS, NARROW);
    bar.narrow = false;
    await settle(bar);
    expect(topLabels(bar)).toEqual(['File', 'Edit', 'View', 'Help']);
    expect(root(bar).querySelector('.narrow-button')).toBeNull();
  });

  it('narrow with no menu-label draws nothing and says why, once', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bar = await mount(MENUS, { narrow: true });
    expect(root(bar).querySelector('.root')).toBeNull();
    expect(root(bar).querySelector('.narrow-button')).toBeNull();
    expect(bar.hasAttribute('data-nph-rendered')).toBe(false);
    expect(bar.getBoundingClientRect().height).toBe(0);
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('menu-label');
    bar.requestUpdate();
    await settle(bar);
    expect(errorsOf(spy)).toHaveLength(1);
  });
});

describe('placement', () => {
  const view = (): { width: number; height: number } => ({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight });
  const pad = 4;

  it('turns up when it does not fit below, with menubar/panel-offset from the top item', async () => {
    const { height } = view();
    const bar = await mount([FILE], {}, `position: fixed; left: 40px; top: ${height - 60}px; width: 300px;`);
    await openFromCode(bar);
    const box = panel(bar).getBoundingClientRect();
    const top = topOf(bar, 'File').getBoundingClientRect();
    expect(panel(bar).dataset.side).toBe('top');
    expect(box.bottom).toBeCloseTo(top.top - px('--nph-menubar-panel-offset'), 1);
    expect(box.left).toBeCloseTo(top.left, 1);
    expect(box.top).toBeGreaterThanOrEqual(pad);
  });

  it('shifts sideways near the right edge and keeps 4 px from the window edge', async () => {
    const { width } = view();
    const bar = await mount([FILE], {}, `position: fixed; left: ${width - 100}px; top: 40px; width: 100px;`);
    await openFromCode(bar);
    const box = panel(bar).getBoundingClientRect();
    expect(box.right).toBeCloseTo(width - pad, 1);
    expect(box.left).toBeGreaterThan(0);
    expect(box.top).toBeCloseTo(topOf(bar, 'File').getBoundingClientRect().bottom + px('--nph-menubar-panel-offset'), 1);
  });

  it('keeps 4 px from the left edge when the top item sits at the start of the window in right-to-left writing', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const bar = await mount([FILE], {}, 'position: fixed; left: 0px; top: 40px; width: 150px;');
    await openFromCode(bar);
    expect(panel(bar).getBoundingClientRect().left).toBeCloseTo(pad, 1);
  });

  it('shrinks to the free space and scrolls when it is taller than the room, with 4 px from the bottom edge', async () => {
    const many: NphMenubarMenu = { value: 'many', label: 'Many', items: Array.from({ length: 60 }, (_, index) => ({ value: `item-${index}`, text: `Item ${index}` })) };
    const { height } = view();
    const bar = await mount([many], {}, 'position: fixed; left: 40px; top: 40px; width: 300px;');
    await openFromCode(bar, 'many');
    const box = panel(bar).getBoundingClientRect();
    expect(getComputedStyle(panel(bar)).overflowY).toBe('auto');
    expect(box.bottom).toBeCloseTo(height - pad, 0);
    expect(box.top).toBeCloseTo(topOf(bar, 'Many').getBoundingClientRect().bottom + px('--nph-menubar-panel-offset'), 1);
    expect(panel(bar).scrollHeight).toBeGreaterThan(panel(bar).clientHeight);
  });

  it('a tall panel that opens upward shrinks to the room above and keeps 4 px from the top edge', async () => {
    const many: NphMenubarMenu = { value: 'many', label: 'Many', items: Array.from({ length: 60 }, (_, index) => ({ value: `item-${index}`, text: `Item ${index}` })) };
    const { height } = view();
    const bar = await mount([many], {}, `position: fixed; left: 40px; top: ${height - 200}px; width: 300px;`);
    await openFromCode(bar, 'many');
    const box = panel(bar).getBoundingClientRect();
    expect(panel(bar).dataset.side).toBe('top');
    expect(box.top).toBeCloseTo(pad, 0);
    expect(box.bottom).toBeCloseTo(topOf(bar, 'Many').getBoundingClientRect().top - px('--nph-menubar-panel-offset'), 1);
    expect(getComputedStyle(panel(bar)).overflowY).toBe('auto');
  });

  it('a short panel does not scroll', async () => {
    const bar = await mount();
    await openFromCode(bar);
    expect(getComputedStyle(panel(bar)).overflowY).toBe('visible');
  });

  it('a panel opened from code is hidden while its top item is out of the window, and comes back with it', async () => {
    const tall = document.createElement('div');
    tall.style.cssText = 'height: 4000px;';
    document.body.append(tall);
    const bar = await mount(MENUS, { openMenu: 'file' }, 'position: absolute; left: 40px; top: 2000px; width: 640px;');
    expect(panel(bar).style.visibility).toBe('hidden');
    window.scrollTo(0, 1900);
    await vi.waitFor(() => expect(panel(bar).style.visibility).toBe(''));
    await entered(bar);
    expect(panel(bar).getBoundingClientRect().top).toBeCloseTo(topOf(bar, 'File').getBoundingClientRect().bottom + px('--nph-menubar-panel-offset'), 0);
    window.scrollTo(0, 0);
    await vi.waitFor(() => expect(panel(bar).style.visibility).toBe('hidden'));
  });

  it('follows the top item when the page scrolls', async () => {
    const tall = document.createElement('div');
    tall.style.cssText = 'height: 3000px;';
    document.body.append(tall);
    const bar = await mount(MENUS, {}, 'position: absolute; left: 40px; top: 200px; width: 640px;');
    await openFromCode(bar);
    const before = panel(bar).getBoundingClientRect().top;
    window.scrollTo(0, 120);
    await vi.waitFor(() => expect(panel(bar).getBoundingClientRect().top).toBeCloseTo(before - 120, 0));
    expect(bar.openMenu).toBe('file');
    window.scrollTo(0, 0);
  });

  it('follows the top item when a container around the bar scrolls', async () => {
    const container = document.createElement('div');
    container.style.cssText = 'position: fixed; left: 0; top: 0; width: 500px; height: 300px; overflow: auto;';
    const inner = document.createElement('div');
    inner.style.cssText = 'height: 1200px; padding: 60px 40px;';
    container.append(inner);
    const bar = document.createElement('nph-menubar');
    bar.menus = MENUS;
    bar.label = 'Editor menu';
    inner.append(bar);
    document.body.append(container);
    await bar.updateComplete;
    await openFromCode(bar);
    const before = panel(bar).getBoundingClientRect().top;
    container.scrollTop = 20;
    await vi.waitFor(() => expect(panel(bar).getBoundingClientRect().top).toBeCloseTo(before - 20, 0));
  });

  it('follows the top item when the window is resized', async () => {
    try {
      const bar = await mount(MENUS, {}, 'position: fixed; right: 20px; top: 40px; width: 300px;');
      await openFromCode(bar);
      const before = panel(bar).getBoundingClientRect().left;
      await page.viewport(800, 768);
      await vi.waitFor(() => expect(panel(bar).getBoundingClientRect().left).toBeCloseTo(before - 224, 0));
      expect(panel(bar).getBoundingClientRect().left).toBeCloseTo(topOf(bar, 'File').getBoundingClientRect().left, 1);
    } finally {
      await page.viewport(1024, 768);
    }
  });

  it('the submenu turns to the other side when there is no room on the right, with the gap between the panels', async () => {
    const { width } = view();
    const bar = await mount([FILE], {}, `position: fixed; left: ${width - 300}px; top: 40px; width: 300px;`);
    await openFromCode(bar);
    await openSubmenuFromCode(bar);
    const main = panel(bar).getBoundingClientRect();
    const sub = panel(bar, 1).getBoundingClientRect();
    expect(panel(bar, 1).dataset.side).toBe('left');
    expect(sub.right).toBeCloseTo(main.left - px('--nph-dropdown-submenu-offset'), 1);
    expect(sub.left).toBeGreaterThanOrEqual(pad);
    expect((items(bar, 1)[0] as HTMLElement).getBoundingClientRect().top).toBeCloseTo(byText(bar, 'Recent').getBoundingClientRect().top, 0);
  });

  it('the submenu keeps 4 px from the bottom edge and shrinks when it does not fit', async () => {
    const tall: NphMenubarMenu = {
      value: 'tall',
      label: 'Tall',
      items: [{ value: 'sub', text: 'Sub', submenu: Array.from({ length: 40 }, (_, index) => ({ value: `s-${index}`, text: `Sub ${index}` })) }],
    };
    const bar = await mount([tall], {}, 'position: fixed; left: 40px; top: 40px; width: 300px;');
    await openFromCode(bar, 'tall');
    await openSubmenuFromCode(bar, 'sub');
    const sub = panel(bar, 1).getBoundingClientRect();
    expect(sub.top).toBeGreaterThanOrEqual(pad - 0.5);
    expect(sub.bottom).toBeLessThanOrEqual(view().height - pad + 0.5);
    expect(getComputedStyle(panel(bar, 1)).overflowY).toBe('auto');
  });

  it('right to left: the panel is aligned to the end edge of its top item', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const bar = await mount();
    await openFromCode(bar, 'edit');
    const top = topOf(bar, 'Edit').getBoundingClientRect();
    const box = panel(bar).getBoundingClientRect();
    expect(box.right).toBeCloseTo(top.right, 1);
    expect(box.top - top.bottom).toBeCloseTo(px('--nph-menubar-panel-offset'), 1);
  });

  it('right to left: the first top item is at the start of the bar, on the right', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const bar = await mount();
    const [first, second] = tops(bar).map((element) => element.getBoundingClientRect()) as [DOMRect, DOMRect];
    expect(first.left).toBeGreaterThan(second.left);
  });

  it('right to left: the submenu opens to the left of the panel, with the gap between them', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const bar = await mount();
    await openFromCode(bar);
    await openSubmenuFromCode(bar);
    const main = panel(bar).getBoundingClientRect();
    const sub = panel(bar, 1).getBoundingClientRect();
    expect(panel(bar, 1).dataset.side).toBe('left');
    expect(sub.right).toBeCloseTo(main.left - px('--nph-dropdown-submenu-offset'), 1);
  });

  it('right to left: with no room on the left the submenu turns to the right', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const bar = await mount([FILE], {}, 'position: fixed; left: 0px; top: 40px; width: 150px;');
    await openFromCode(bar);
    await openSubmenuFromCode(bar);
    const main = panel(bar).getBoundingClientRect();
    const sub = panel(bar, 1).getBoundingClientRect();
    expect(panel(bar, 1).dataset.side).toBe('right');
    expect(sub.left).toBeCloseTo(main.right + px('--nph-dropdown-submenu-offset'), 1);
  });

  it('right to left: the arrow of an item with a submenu is mirrored', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const bar = await mount();
    await openFromCode(bar);
    expect(getComputedStyle(byText(bar, 'Recent').querySelector('.arrow') as HTMLElement).scale).toBe('-1 1');
  });
});

describe('invalid input', () => {
  const spyOnErrors = (): ReturnType<typeof vi.spyOn> => vi.spyOn(console, 'error').mockImplementation(() => {});

  it('menus that is not a list draws nothing and says why, once', async () => {
    const spy = spyOnErrors();
    const bar = await mount('nope' as never);
    expect(root(bar).querySelector('.root')).toBeNull();
    expect(bar.hasAttribute('data-nph-rendered')).toBe(false);
    expect(bar.getBoundingClientRect().height).toBe(0);
    expect(errorsOf(spy)).toHaveLength(1);
    bar.requestUpdate();
    await settle(bar);
    expect(errorsOf(spy)).toHaveLength(1);
  });

  it('an empty list draws nothing and says why, once', async () => {
    const spy = spyOnErrors();
    const bar = await mount([]);
    expect(root(bar).querySelector('.root')).toBeNull();
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('no valid menu');
  });

  it('with no valid menu at all it draws nothing, one error per cause', async () => {
    const spy = spyOnErrors();
    const bar = await mount([{ value: '', label: 'A', items: [{ value: 'a', text: 'A' }] }, { value: 'b', label: ' ', items: [{ value: 'a', text: 'A' }] }]);
    expect(root(bar).querySelector('.root')).toBeNull();
    const messages = errorsOf(spy);
    expect(messages.filter((message) => message.includes('needs a value'))).toHaveLength(1);
    expect(messages.filter((message) => message.includes('needs a label'))).toHaveLength(1);
    expect(messages.filter((message) => message.includes('no valid menu'))).toHaveLength(1);
  });

  it('a menu with no value is left out, once, and the rest renders', async () => {
    const spy = spyOnErrors();
    const bar = await mount([{ label: 'Bad', items: [{ value: 'a', text: 'A' }] } as never, FILE]);
    expect(topLabels(bar)).toEqual(['File']);
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('needs a value');
  });

  it('a menu with no label is left out, once, and the rest renders', async () => {
    const spy = spyOnErrors();
    const bar = await mount([{ value: 'bad', label: '  ', items: [{ value: 'a', text: 'A' }] }, FILE]);
    expect(topLabels(bar)).toEqual(['File']);
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('needs a label');
  });

  it('a menu with no valid item is left out, once', async () => {
    const spy = spyOnErrors();
    const bar = await mount([{ value: 'empty', label: 'Empty', items: [{ type: 'separator' }] }, FILE]);
    expect(topLabels(bar)).toEqual(['File']);
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('no valid item');
  });

  it('a menu whose items are not a list is left out, once', async () => {
    const spy = spyOnErrors();
    const bar = await mount([{ value: 'bad', label: 'Bad', items: 'x' as never }, FILE]);
    expect(topLabels(bar)).toEqual(['File']);
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('items must be a list');
  });

  it('two menus with the same value: the second is left out, once', async () => {
    const spy = spyOnErrors();
    const bar = await mount([FILE, { ...EDIT, value: 'file' }, VIEW]);
    expect(topLabels(bar)).toEqual(['File', 'View']);
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('already has this value');
  });

  it('two items of a menu with the same value: the second is left out, once', async () => {
    const spy = spyOnErrors();
    const bar = await mount([{ value: 'm', label: 'M', items: [{ value: 'a', text: 'First' }, { value: 'a', text: 'Second' }, { value: 'b', text: 'Third' }] }]);
    await openFromCode(bar, 'm');
    expect(labelsOf(bar)).toEqual(['First', 'Third']);
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('already has this value');
  });

  it('the same item value in two different menus is fine', async () => {
    const spy = spyOnErrors();
    const bar = await mount([
      { value: 'one', label: 'One', items: [{ value: 'same', text: 'A' }] },
      { value: 'two', label: 'Two', items: [{ value: 'same', text: 'B' }] },
    ]);
    expect(topLabels(bar)).toEqual(['One', 'Two']);
    expect(errorsOf(spy)).toEqual([]);
  });

  it('an invalid item is left out, one error per cause, and the rest renders', async () => {
    const spy = spyOnErrors();
    const bar = await mount([
      {
        value: 'm',
        label: 'M',
        items: [
          { value: 'ok', text: 'Fine' },
          { value: 'no-text', text: ' ' },
          { value: '', text: 'No value' },
          { value: 'bad', text: 'Bad severity', severity: 'loud' as never },
          { value: 'bad-selection', text: 'Bad selection', selection: 'some' as never },
        ],
      },
    ]);
    await openFromCode(bar, 'm');
    expect(labelsOf(bar)).toEqual(['Fine']);
    const messages = errorsOf(spy);
    expect(messages).toHaveLength(4);
    expect(messages.filter((message) => message.includes('needs text'))).toHaveLength(1);
    expect(messages.filter((message) => message.includes('needs a value'))).toHaveLength(1);
    expect(messages.filter((message) => message.includes('severity "loud"'))).toHaveLength(1);
    expect(messages.filter((message) => message.includes('selection "some"'))).toHaveLength(1);
  });

  it('a submenu item with a choice, a shortcut, no valid item or a list that is not one is left out', async () => {
    const spy = spyOnErrors();
    const bar = await mount([
      {
        value: 'm',
        label: 'M',
        items: [
          { value: 'ok', text: 'Fine' },
          { value: 'choice', text: 'Choice', selection: 'single', submenu: [{ value: 'c1', text: 'C1' }] },
          { value: 'shortcut', text: 'Shortcut', shortcut: 'Ctrl+K', submenu: [{ value: 's1', text: 'S1' }] },
          { value: 'empty', text: 'Empty', submenu: [{ type: 'separator' }] },
          { value: 'wrong', text: 'Wrong', submenu: 'x' as never },
        ],
      },
    ]);
    await openFromCode(bar, 'm');
    expect(labelsOf(bar)).toEqual(['Fine']);
    const messages = errorsOf(spy);
    expect(messages).toHaveLength(4);
    expect(messages.some((message) => message.includes('not a choice'))).toBe(true);
    expect(messages.some((message) => message.includes('carries no shortcut'))).toBe(true);
    expect(messages.some((message) => message.includes('submenu has no valid item'))).toBe(true);
    expect(messages.some((message) => message.includes('must be a list'))).toBe(true);
  });

  it('a submenu inside a submenu is left out: one level only', async () => {
    const spy = spyOnErrors();
    const bar = await mount([
      {
        value: 'm',
        label: 'M',
        items: [{ value: 'a', text: 'A', submenu: [{ value: 'b', text: 'B', submenu: [{ value: 'c', text: 'C' }] }, { value: 'd', text: 'D' }] }],
      },
    ]);
    await openFromCode(bar, 'm');
    await openSubmenuFromCode(bar, 'a');
    expect(labelsOf(bar, 1)).toEqual(['D']);
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('one level only');
  });

  it('an open-menu that names nothing is reported once and closes', async () => {
    const spy = spyOnErrors();
    const bar = await mount(MENUS, { openMenu: 'nope' });
    expect(shown(bar)).toBe(false);
    expect(bar.openMenu).toBe('');
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('open-menu "nope"');
    bar.requestUpdate();
    await settle(bar);
    expect(errorsOf(spy)).toHaveLength(1);
  });

  it('an open-menu set from code to a name that does not exist is reported once', async () => {
    const spy = spyOnErrors();
    const bar = await mount();
    bar.openMenu = 'ghost';
    await settle(bar);
    expect(bar.openMenu).toBe('');
    expect(errorsOf(spy).filter((message) => message.includes('open-menu "ghost"'))).toHaveLength(1);
    expect(errorsOf(spy)).toHaveLength(1);
  });

  it('an open-submenu that names nothing is reported once and closes', async () => {
    const spy = spyOnErrors();
    const bar = await mount(MENUS, { openMenu: 'file', openSubmenu: 'nope' });
    await settle(bar);
    expect(bar.openSubmenu).toBe('');
    expect(shown(bar, 1)).toBe(false);
    expect(shown(bar)).toBe(true);
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('open-submenu "nope"');
    bar.requestUpdate();
    await settle(bar);
    expect(errorsOf(spy)).toHaveLength(1);
  });

  it('an open-submenu that names an item with no submenu is reported', async () => {
    const spy = spyOnErrors();
    const bar = await mount(MENUS, { openMenu: 'file', openSubmenu: 'new' });
    await settle(bar);
    expect(bar.openSubmenu).toBe('');
    expect(errorsOf(spy).some((message) => message.includes('open-submenu "new"'))).toBe(true);
  });

  it('a bar with no accessible name draws and warns once', async () => {
    const spy = spyOnErrors();
    const bar = await mount(MENUS, { label: '' });
    expect(topLabels(bar)).toEqual(['File', 'Edit', 'View', 'Help']);
    expect(errorsOf(spy)).toHaveLength(1);
    expect(errorsOf(spy)[0]).toContain('accessible name');
  });

  it('a bar that becomes invalid while a panel is open closes it and leaves the top layer', async () => {
    spyOnErrors();
    const bar = await mount();
    await openFromCode(bar);
    bar.menus = [];
    await settle(bar);
    expect(panel(bar)).toBeNull();
    expect(root(bar).querySelector('.root')).toBeNull();
  });

  it('open-menu set from code shows the panel and takes no focus', async () => {
    const bar = await mount();
    idOf('before').focus();
    bar.openMenu = 'edit';
    await settle(bar);
    await entered(bar);
    expect(shown(bar)).toBe(true);
    expect(topOf(bar, 'Edit').getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(idOf('before'));
    expect(root(bar).activeElement).toBeNull();
  });

  it('open-menu in the markup shows the panel at the first render, and open-submenu shows the submenu', async () => {
    const bar = await mount(MENUS, {}, FIXED, { 'open-menu': 'file', 'open-submenu': 'recent' });
    await vi.waitFor(() => expect(shown(bar, 1)).toBe(true));
    expect(shown(bar)).toBe(true);
    expect(labelsOf(bar, 1)).toEqual(['annual-report.pdf', 'budget-2026.xlsx', 'meeting-minutes.docx']);
    expect(root(bar).activeElement).toBeNull();
  });

  it('closing from code leaves the top layer after the exit', async () => {
    const bar = await mount();
    await openFromCode(bar);
    bar.openMenu = '';
    await settle(bar);
    expect(topOf(bar, 'File').getAttribute('aria-expanded')).toBe('false');
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
  });
});

describe('top item open and in keyboard focus at once', () => {
  /* Pending design decision (DSA-83, "Open for the code"): this asserts the two looks composed. */
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: the hover-open background and label compose with the focus border and halo`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const bar = await mount();
      await openByKeyboard(bar, 'File');
      await press(bar, '{ArrowRight}');
      const edit = topOf(bar, 'Edit');
      expect(active(bar)).toBe(edit);
      expect(edit.getAttribute('aria-expanded')).toBe('true');
      expect(edit.matches(':focus-visible')).toBe(true);
      const style = getComputedStyle(edit);
      expect(style.backgroundColor).toBe(resolved('background-color', '--nph-menubar-trigger-background-hover'));
      expect(style.color).toBe(resolved('color', '--nph-menubar-trigger-foreground-hover'));
      const border = getComputedStyle(edit, '::before');
      const halo = getComputedStyle(edit, '::after');
      expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
      expect(Number.parseFloat(border.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
      expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
      expect(Number.parseFloat(halo.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
    });
  }

  it('the focus ring leaves with the focus and the open look stays while the panel is open', async () => {
    const bar = await mount();
    await openByKeyboard(bar, 'File');
    await press(bar, '{ArrowRight}');
    await press(bar, '{ArrowDown}');
    const edit = topOf(bar, 'Edit');
    expect(edit.matches(':focus-visible')).toBe(false);
    expect(getComputedStyle(edit, '::before').content).toBe('none');
    expect(getComputedStyle(edit).backgroundColor).toBe(resolved('background-color', '--nph-menubar-trigger-background-hover'));
  });
});

describe('motion', () => {
  it('opening and closing use the enter and exit roles, on opacity and a 4 px slide', async () => {
    const bar = await mount();
    await openFromCode(bar);
    const open = getComputedStyle(panel(bar));
    expect(open.transitionDuration).toBe(resolved('transition-duration', '--nph-motion-enter-duration'));
    expect(open.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-enter-easing'));
    expect(open.transitionProperty).toBe('opacity, translate');
    bar.openMenu = '';
    await settle(bar);
    const closing = getComputedStyle(panel(bar));
    expect(closing.transitionDuration).toBe(resolved('transition-duration', '--nph-motion-exit-duration'));
    expect(closing.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-exit-easing'));
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
    expect(Number.parseFloat(getComputedStyle(panel(bar)).translate.split(' ')[1] ?? 'NaN')).toBeCloseTo(-px('--nph-space-inline-tight'), 1);
    expect(getComputedStyle(panel(bar)).opacity).toBe('0');
  });

  it('a panel that opens upward slides from below', async () => {
    const { height } = { height: document.documentElement.clientHeight };
    const bar = await mount([FILE], {}, `position: fixed; left: 40px; top: ${height - 60}px; width: 300px;`);
    await openFromCode(bar);
    bar.openMenu = '';
    await settle(bar);
    await vi.waitFor(() => expect(shown(bar)).toBe(false));
    expect(Number.parseFloat(getComputedStyle(panel(bar)).translate.split(' ')[1] ?? 'NaN')).toBeCloseTo(px('--nph-space-inline-tight'), 1);
  });

  it('with reduced motion the slide goes away and only the opacity moves, in motion/hover-duration', async () => {
    const session = cdp();
    const bar = await mount();
    try {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      await openFromCode(bar);
      expect(getComputedStyle(panel(bar)).transitionDuration).toBe(resolved('transition-duration', '--nph-motion-hover-duration'));
      bar.openMenu = '';
      await settle(bar);
      expect(getComputedStyle(panel(bar)).transitionDuration).toBe(resolved('transition-duration', '--nph-motion-hover-duration'));
      await vi.waitFor(() => expect(shown(bar)).toBe(false));
      expect(getComputedStyle(panel(bar)).translate).toBe('none');
    } finally {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    }
    await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
  });
});
