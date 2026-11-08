/**
 * Tests of `nph-context-menu` (P113), in a real browser (P21, item 5): the top layer, the
 * placement at a point, real hover, keyboard focus and measures only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation `4838:27591`, set `4819:15828`),
 * recorded in the evidence of the `figma-docs-accepted` gate of DSA-69: the API, the invalid
 * input, the object that takes the right click, the opening by pointer, keyboard and long press,
 * the placement and its collisions, closing, the keyboard, the activation and its event, the
 * submenu, the roles and names the browser computes, the colors and measures, and the token
 * contract.
 */
/* cspell:ignore supr */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-context-menu.css?raw';
import { NPH_CONTEXT_MENU_SIZES, NphContextMenu, groupsOf, keyShortcutsOf } from './nph-context-menu';
import type { NphContextMenuEntry, NphContextMenuItemSelectDetail } from './nph-context-menu';

/* The default window of the browser run is 414 wide: too narrow for a menu and its submenu side by side. */
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
  vi.restoreAllMocks();
});

const SUBMENU: NphContextMenuEntry[] = [
  { value: 'copy-link', text: 'Copy link', icon: 'link' },
  { value: 'download', text: 'Download file', icon: 'download' },
  { type: 'separator' },
  { value: 'more', text: 'More options', icon: 'ellipsis' },
];

const ITEMS: NphContextMenuEntry[] = [
  { value: 'back', text: 'Back', icon: 'arrow-left', shortcut: 'Alt+←' },
  { value: 'reload', text: 'Reload', icon: 'rotate-right', shortcut: 'Ctrl+R' },
  { value: 'copy', text: 'Copy link', icon: 'link', shortcut: 'Ctrl+C' },
  { value: 'edit', text: 'Edit', icon: 'pen', shortcut: 'Ctrl+E' },
  { value: 'share', text: 'Share', icon: 'share', submenu: SUBMENU },
  { type: 'separator' },
  { value: 'delete', text: 'Delete', icon: 'trash', severity: 'destructive', shortcut: 'Del' },
];

interface Setup {
  menu: NphContextMenu;
  object: HTMLElement;
}

async function mount(items: NphContextMenuEntry[] = ITEMS, props: Partial<NphContextMenu> = {}): Promise<Setup> {
  const object = document.createElement('div');
  object.id = 'object';
  object.tabIndex = 0;
  object.textContent = 'File';
  object.style.cssText = 'position: fixed; left: 40px; top: 40px; width: 240px; height: 120px;';
  const menu = document.createElement('nph-context-menu');
  menu.setAttribute('for', 'object');
  menu.items = items;
  Object.assign(menu, props);
  document.body.append(object, menu);
  await menu.updateComplete;
  return { menu, object };
}

async function settle(menu: NphContextMenu): Promise<void> {
  await menu.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
}

const panel = (menu: NphContextMenu, level = 0): HTMLElement => menu.shadowRoot?.querySelector(`.panel[data-level="${level}"]`) as HTMLElement;
const items = (menu: NphContextMenu, level = 0): HTMLElement[] => [...(panel(menu, level)?.querySelectorAll<HTMLElement>('.item') ?? [])];
const byText = (menu: NphContextMenu, text: string, level = 0): HTMLElement =>
  items(menu, level).find((element) => element.querySelector('.text')?.textContent === text) as HTMLElement;
const active = (menu: NphContextMenu): Element | null => menu.shadowRoot?.activeElement ?? null;
const shown = (menu: NphContextMenu, level = 0): boolean => panel(menu, level)?.matches(':popover-open') ?? false;

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

function events(menu: NphContextMenu): NphContextMenuItemSelectDetail[] {
  const seen: NphContextMenuItemSelectDetail[] = [];
  menu.addEventListener('nph-item-select', (event) => seen.push((event as CustomEvent<NphContextMenuItemSelectDetail>).detail));
  return seen;
}

/** A right click: the `contextmenu` event of a mouse at a point of the window. */
function rightClick(target: Element, x: number, y: number): MouseEvent {
  const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, composed: true, clientX: x, clientY: y, button: 2 });
  target.dispatchEvent(event);
  return event;
}

/** The enter transition is over: the panel is opaque and in its place. */
async function entered(menu: NphContextMenu, level = 0): Promise<void> {
  await vi.waitFor(() => {
    const style = getComputedStyle(panel(menu, level));
    expect(style.opacity).toBe('1');
    expect(style.translate).toBe('none');
  });
}

async function openAt(setup: Setup, x = 100, y = 80): Promise<NphContextMenu> {
  rightClick(setup.object, x, y);
  await settle(setup.menu);
  await entered(setup.menu);
  return setup.menu;
}

async function openSubmenuOf(menu: NphContextMenu, value = 'share'): Promise<void> {
  menu.openSubmenu = value;
  await settle(menu);
  await entered(menu, 1);
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-context-menu')).toBe(NphContextMenu);
    expect(NPH_CONTEXT_MENU_SIZES).toEqual(['default', 'compact']);
  });

  it('has the defaults of the evidence: closed, size default, no submenu open', () => {
    const menu = document.createElement('nph-context-menu');
    expect(menu.open).toBe(false);
    expect(menu.size).toBe('default');
    expect(menu.openSubmenu).toBe('');
    expect(menu.items).toEqual([]);
    expect(menu.for).toBeNull();
    expect(menu.label).toBe('');
  });

  it('the public API is exactly P113', () => {
    const properties = Object.keys((NphContextMenu as unknown as { properties: Record<string, unknown> }).properties).sort();
    expect(properties).toEqual(['for', 'items', 'label', 'open', 'openSubmenu', 'size']);
  });

  it('reflects for, open, size and open-submenu', async () => {
    const { menu } = await mount();
    menu.open = true;
    menu.size = 'compact';
    menu.openSubmenu = 'share';
    await settle(menu);
    expect(menu.getAttribute('for')).toBe('object');
    expect(menu.hasAttribute('open')).toBe(true);
    expect(menu.getAttribute('size')).toBe('compact');
    expect(menu.getAttribute('open-submenu')).toBe('share');
  });

  it('has no slot and no part, and takes no room in the flow', async () => {
    const { menu } = await mount();
    expect(menu.shadowRoot?.querySelector('slot')).toBeNull();
    expect(menu.shadowRoot?.querySelector('[part]')).toBeNull();
    const box = menu.getBoundingClientRect();
    expect(box.width).toBe(0);
    expect(box.height).toBe(0);
  });
});

describe('groups', () => {
  it('a label opens a group, a separator closes it, and items alone form a group with no name', () => {
    const groups = groupsOf([
      { value: 'a', text: 'A' },
      { type: 'separator' },
      { type: 'label', text: 'Name' },
      { value: 'b', text: 'B' },
      { value: 'c', text: 'C' },
    ]);
    expect(groups.map((group) => [group.label, group.rows.map((row) => row.entry.value), group.separated])).toEqual([
      ['', ['a'], false],
      ['Name', ['b', 'c'], true],
    ]);
  });

  it('an empty group is dropped and its separator goes to the next group', () => {
    const groups = groupsOf([{ value: 'a', text: 'A' }, { type: 'separator' }, { type: 'label', text: 'Empty' }, { type: 'separator' }, { value: 'b', text: 'B' }]);
    expect(groups.map((group) => group.rows.map((row) => row.entry.value))).toEqual([['a'], ['b']]);
    expect(groups[1]?.separated).toBe(true);
  });
});

describe('invalid input', () => {
  const errors = () => vi.spyOn(console, 'error').mockImplementation(() => {});

  async function drawn(entries: NphContextMenuEntry[] | undefined, props: Partial<NphContextMenu> = {}): Promise<NphContextMenu> {
    const { menu } = await mount(entries, props);
    await settle(menu);
    return menu;
  }

  it('for empty draws nothing and says why, once', async () => {
    const spy = errors();
    const menu = document.createElement('nph-context-menu');
    menu.items = ITEMS;
    document.body.append(menu);
    await menu.updateComplete;
    expect(menu.shadowRoot?.querySelector('.panel')).toBeNull();
    expect(menu.hasAttribute('data-nph-rendered')).toBe(false);
    expect(spy.mock.calls.filter((call) => String(call[0]).includes('for is empty'))).toHaveLength(1);
    menu.requestUpdate();
    await menu.updateComplete;
    expect(spy.mock.calls.filter((call) => String(call[0]).includes('for is empty'))).toHaveLength(1);
  });

  it('for that matches nothing draws nothing after one frame, and says why', async () => {
    const spy = errors();
    const menu = document.createElement('nph-context-menu');
    menu.setAttribute('for', 'nobody');
    menu.items = ITEMS;
    document.body.append(menu);
    await menu.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await menu.updateComplete;
    expect(menu.shadowRoot?.querySelector('.panel')).toBeNull();
    expect(spy.mock.calls.some((call) => String(call[0]).includes('matches no element'))).toBe(true);
  });

  it('with no valid item draws nothing and says why', async () => {
    const spy = errors();
    const menu = await drawn([{ type: 'separator' }, { value: '', text: '' }]);
    expect(panel(menu)).toBeNull();
    expect(spy.mock.calls.some((call) => String(call[0]).includes('no valid item'))).toBe(true);
  });

  it('a size outside the two draws nothing', async () => {
    const spy = errors();
    const menu = await drawn(ITEMS, { size: 'large' as never });
    expect(panel(menu)).toBeNull();
    expect(spy.mock.calls.some((call) => String(call[0]).includes('size "large"'))).toBe(true);
  });

  it('an invalid entry is left out, one error per cause, and the rest renders', async () => {
    const spy = errors();
    const menu = await drawn([
      { value: 'ok', text: 'Fine' },
      { value: 'no-text', text: ' ' },
      { value: 'bad', text: 'Bad severity', severity: 'loud' as never },
      { value: 'bad-selection', text: 'Bad selection', selection: 'some' as never },
    ]);
    expect(items(menu).map((element) => element.querySelector('.text')?.textContent)).toEqual(['Fine']);
    const messages = spy.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((message) => message.includes('needs text'))).toHaveLength(1);
    expect(messages.some((message) => message.includes('severity "loud"'))).toBe(true);
    expect(messages.some((message) => message.includes('selection "some"'))).toBe(true);
  });

  it('a submenu item with a choice, a shortcut, no valid item or a list that is not one is left out', async () => {
    const spy = errors();
    const menu = await drawn([
      { value: 'ok', text: 'Fine' },
      { value: 'choice', text: 'Choice', selection: 'single', submenu: SUBMENU },
      { value: 'shortcut', text: 'Shortcut', shortcut: 'Ctrl+K', submenu: SUBMENU },
      { value: 'empty', text: 'Empty', submenu: [{ type: 'separator' }] },
      { value: 'wrong', text: 'Wrong', submenu: 'x' as never },
    ]);
    expect(items(menu).map((element) => element.querySelector('.text')?.textContent)).toEqual(['Fine']);
    const messages = spy.mock.calls.map((call) => String(call[0]));
    expect(messages.some((message) => message.includes('not a choice'))).toBe(true);
    expect(messages.some((message) => message.includes('carries no shortcut'))).toBe(true);
    expect(messages.some((message) => message.includes('submenu has no valid item'))).toBe(true);
    expect(messages.some((message) => message.includes('must be a list'))).toBe(true);
  });

  it('a submenu inside a submenu is left out: one level only', async () => {
    const spy = errors();
    const menu = await drawn([{ value: 'a', text: 'A', submenu: [{ value: 'b', text: 'B', submenu: [{ value: 'c', text: 'C' }] }, { value: 'd', text: 'D' }] }]);
    menu.openSubmenu = 'a';
    menu.open = true;
    await settle(menu);
    expect(items(menu, 1).map((element) => element.querySelector('.text')?.textContent)).toEqual(['D']);
    expect(spy.mock.calls.some((call) => String(call[0]).includes('one level only'))).toBe(true);
  });

  it('finds an object rendered one frame after the menu', async () => {
    const menu = document.createElement('nph-context-menu');
    menu.setAttribute('for', 'late');
    menu.items = ITEMS;
    document.body.append(menu);
    await menu.updateComplete;
    const late = document.createElement('div');
    late.id = 'late';
    document.body.append(late);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await menu.updateComplete;
    expect(panel(menu)).not.toBeNull();
    const event = rightClick(late, 20, 20);
    expect(event.defaultPrevented).toBe(true);
  });

  it('looks the object up in its own root, never in the document', async () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    const inside = document.createElement('div');
    inside.id = 'shadow-object';
    const menu = document.createElement('nph-context-menu');
    menu.setAttribute('for', 'shadow-object');
    menu.items = ITEMS;
    root.append(inside, menu);
    const outside = document.createElement('div');
    outside.id = 'shadow-object';
    document.body.append(outside, host);
    await menu.updateComplete;
    expect(rightClick(outside, 10, 10).defaultPrevented).toBe(false);
    expect(rightClick(inside, 10, 10).defaultPrevented).toBe(true);
  });
});

describe('opening by pointer', () => {
  it('the right click opens the menu with its top start corner at the point, and the browser menu is cancelled', async () => {
    const setup = await mount();
    const event = rightClick(setup.object, 120, 90);
    expect(event.defaultPrevented).toBe(true);
    await settle(setup.menu);
    await vi.waitFor(() => expect(getComputedStyle(panel(setup.menu)).opacity).toBe('1'));
    expect(shown(setup.menu)).toBe(true);
    const box = panel(setup.menu).getBoundingClientRect();
    expect(box.left).toBeCloseTo(120, 0);
    expect(box.top).toBeCloseTo(90, 0);
    expect(setup.menu.open).toBe(true);
  });

  it('opens at the point, wherever the click lands inside the object', async () => {
    const setup = await mount();
    await openAt(setup, 200, 150);
    const box = panel(setup.menu).getBoundingClientRect();
    expect(box.left).toBeCloseTo(200, 0);
    expect(box.top).toBeCloseTo(150, 0);
  });

  it('a right click elsewhere while open moves the menu to the new point', async () => {
    const setup = await mount();
    await openAt(setup, 100, 80);
    rightClick(setup.object, 220, 140);
    await settle(setup.menu);
    const box = panel(setup.menu).getBoundingClientRect();
    expect(box.left).toBeCloseTo(220, 0);
    expect(box.top).toBeCloseTo(140, 0);
  });

  it('the first item takes the focus but does not show it', async () => {
    const setup = await mount();
    /* A real pointer press first: it is what tells the browser the person is using the mouse. */
    await userEvent.click(setup.object);
    await openAt(setup);
    expect(active(setup.menu)).toBe(items(setup.menu)[0]);
    expect(items(setup.menu)[0]?.matches(':focus-visible')).toBe(false);
  });

  it('a right click on the menu itself never opens another one', async () => {
    const setup = await mount();
    await openAt(setup);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, composed: true, clientX: 5, clientY: 5, button: 2 });
    items(setup.menu)[0]?.dispatchEvent(event);
    expect(panel(setup.menu).getBoundingClientRect().left).toBeCloseTo(100, 0);
  });

  it('an object that is not the one named by for opens nothing', async () => {
    const setup = await mount();
    const other = document.createElement('div');
    document.body.append(other);
    expect(rightClick(other, 10, 10).defaultPrevented).toBe(false);
    await settle(setup.menu);
    expect(shown(setup.menu)).toBe(false);
  });
});

describe('opening by keyboard', () => {
  it('Shift+F10 opens the menu below the object and the first item shows the focus', async () => {
    const { menu, object } = await mount();
    object.focus();
    await userEvent.keyboard('{Shift>}{F10}{/Shift}');
    await settle(menu);
    await vi.waitFor(() => expect(shown(menu)).toBe(true));
    await entered(menu);
    const box = panel(menu).getBoundingClientRect();
    const target = object.getBoundingClientRect();
    expect(box.left).toBeCloseTo(target.left, 0);
    expect(box.top).toBeCloseTo(target.bottom, 0);
    expect(active(menu)).toBe(items(menu)[0]);
    expect(items(menu)[0]?.matches(':focus-visible')).toBe(true);
  });

  it('the Menu key opens it the same way', async () => {
    const { menu, object } = await mount();
    object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(menu);
    await vi.waitFor(() => expect(shown(menu)).toBe(true));
    expect(items(menu)[0]?.matches(':focus-visible')).toBe(true);
  });

  it('the contextmenu event the browser adds to the key is the same gesture and opens nothing twice', async () => {
    const { menu, object } = await mount();
    object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(menu);
    const before = panel(menu).getBoundingClientRect().top;
    const event = rightClick(object, 10, 10);
    expect(event.defaultPrevented).toBe(true);
    await settle(menu);
    expect(panel(menu).getBoundingClientRect().top).toBeCloseTo(before, 0);
  });

  it('F10 alone and other keys open nothing', async () => {
    const { menu, object } = await mount();
    object.focus();
    await userEvent.keyboard('{F10}');
    await userEvent.keyboard('a');
    await settle(menu);
    expect(shown(menu)).toBe(false);
  });
});

describe('opening by a long press', () => {
  function touch(type: string, object: Element, x: number, y: number): void {
    object.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, composed: true, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y, pointerId: 7 }));
  }

  it('a touch held for about 700 ms opens the menu at the point, and a shorter one does not', async () => {
    const setup = await mount();
    touch('pointerdown', setup.object, 90, 70);
    await sleep(300);
    touch('pointerup', setup.object, 90, 70);
    await sleep(600);
    expect(shown(setup.menu)).toBe(false);
    touch('pointerdown', setup.object, 90, 70);
    await sleep(500);
    expect(shown(setup.menu)).toBe(false);
    await sleep(300);
    await settle(setup.menu);
    expect(shown(setup.menu)).toBe(true);
    await entered(setup.menu);
    const box = panel(setup.menu).getBoundingClientRect();
    expect(box.left).toBeCloseTo(90, 0);
    expect(box.top).toBeCloseTo(70, 0);
  });

  it('a touch that moves is a scroll, not a long press', async () => {
    const setup = await mount();
    touch('pointerdown', setup.object, 90, 70);
    await sleep(100);
    touch('pointermove', setup.object, 90, 110);
    await sleep(800);
    expect(shown(setup.menu)).toBe(false);
  });

  it('the menu of the browser that follows a touch is cancelled and does not open on its own', async () => {
    const setup = await mount();
    touch('pointerdown', setup.object, 90, 70);
    await sleep(100);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, composed: true, clientX: 90, clientY: 70, button: 0 });
    setup.object.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    await settle(setup.menu);
    expect(shown(setup.menu)).toBe(false);
    await sleep(800);
    expect(shown(setup.menu)).toBe(true);
  });

  it('the mouse never starts a long press', async () => {
    const setup = await mount();
    setup.object.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, pointerType: 'mouse', isPrimary: true, clientX: 90, clientY: 70 }));
    await sleep(850);
    expect(shown(setup.menu)).toBe(false);
  });
});

describe('placement', () => {
  it('turns to the left of the point when it does not fit on the right, and stays inside the window', async () => {
    const setup = await mount();
    const width = document.documentElement.clientWidth;
    await openAt(setup, width - 20, 80);
    const box = panel(setup.menu).getBoundingClientRect();
    expect(box.right).toBeCloseTo(width - 20, 0);
    expect(box.left).toBeGreaterThanOrEqual(0);
  });

  it('turns above the point when it does not fit below', async () => {
    const setup = await mount();
    const height = document.documentElement.clientHeight;
    await openAt(setup, 100, height - 20);
    const box = panel(setup.menu).getBoundingClientRect();
    expect(box.bottom).toBeCloseTo(height - 20, 0);
    expect(box.top).toBeGreaterThanOrEqual(0);
  });

  it('never leaves the window, and a menu taller than the window scrolls inside', async () => {
    const many: NphContextMenuEntry[] = Array.from({ length: 60 }, (_, index) => ({ value: `item-${index}`, text: `Item ${index}` }));
    const setup = await mount(many);
    await openAt(setup, 100, 50);
    const box = panel(setup.menu).getBoundingClientRect();
    const view = document.documentElement.clientHeight;
    expect(box.top).toBeGreaterThanOrEqual(0);
    expect(box.bottom).toBeLessThanOrEqual(view + 1);
    expect(getComputedStyle(panel(setup.menu)).overflowY).toBe('auto');
  });

  it('a short menu does not scroll', async () => {
    const setup = await mount();
    await openAt(setup);
    expect(getComputedStyle(panel(setup.menu)).overflowY).toBe('visible');
  });

  it('a menu opened from code sits at the start top corner of the object, with no focus move', async () => {
    const { menu, object } = await mount();
    object.focus();
    menu.open = true;
    await settle(menu);
    await vi.waitFor(() => expect(shown(menu)).toBe(true));
    await entered(menu);
    const box = panel(menu).getBoundingClientRect();
    const target = object.getBoundingClientRect();
    expect(box.left).toBeCloseTo(target.left, 0);
    expect(box.top).toBeCloseTo(target.top, 0);
    expect(document.activeElement).toBe(object);
  });

  it('right to left: the top end corner is at the point', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const setup = await mount();
    await openAt(setup, 400, 80);
    const box = panel(setup.menu).getBoundingClientRect();
    expect(box.right).toBeCloseTo(400, 0);
  });
});

describe('closing', () => {
  it('Esc closes, gives the focus back to the object and does not reach the page', async () => {
    const setup = await mount();
    setup.object.focus();
    await openAt(setup);
    const seen = vi.fn();
    document.addEventListener('keydown', seen);
    await userEvent.keyboard('{Escape}');
    document.removeEventListener('keydown', seen);
    await settle(setup.menu);
    expect(setup.menu.open).toBe(false);
    expect(document.activeElement).toBe(setup.object);
    expect(seen).not.toHaveBeenCalled();
  });

  it('closing leaves the top layer after the exit', async () => {
    const setup = await mount();
    await openAt(setup);
    setup.menu.open = false;
    await settle(setup.menu);
    await vi.waitFor(() => expect(shown(setup.menu)).toBe(false));
  });

  it('a second Esc during the exit reaches the page', async () => {
    const setup = await mount();
    await openAt(setup);
    await userEvent.keyboard('{Escape}');
    const seen = vi.fn();
    document.addEventListener('keydown', seen);
    await userEvent.keyboard('{Escape}');
    document.removeEventListener('keydown', seen);
    expect(seen).toHaveBeenCalled();
  });

  it('with the menu closed, Esc is not intercepted', async () => {
    await mount();
    const seen = vi.fn();
    document.addEventListener('keydown', seen);
    await userEvent.keyboard('{Escape}');
    document.removeEventListener('keydown', seen);
    expect(seen).toHaveBeenCalled();
  });

  it('a press outside closes it without moving the focus elsewhere', async () => {
    const setup = await mount();
    const outside = document.createElement('button');
    outside.textContent = 'Outside';
    outside.style.cssText = 'position: fixed; left: 400px; top: 300px;';
    document.body.append(outside);
    await openAt(setup);
    await userEvent.click(outside);
    await settle(setup.menu);
    expect(setup.menu.open).toBe(false);
    expect(document.activeElement).toBe(outside);
  });

  it('a press inside the panel, outside an item, keeps it open', async () => {
    const setup = await mount();
    await openAt(setup);
    const box = panel(setup.menu).getBoundingClientRect();
    await userEvent.click(panel(setup.menu), { position: { x: 1, y: Math.round(box.height / 2) } });
    await settle(setup.menu);
    expect(setup.menu.open).toBe(true);
  });

  it('a scroll of the page closes it', async () => {
    const tall = document.createElement('div');
    tall.style.cssText = 'height: 3000px;';
    document.body.append(tall);
    const setup = await mount();
    await openAt(setup);
    window.scrollTo(0, 120);
    await vi.waitFor(() => expect(setup.menu.open).toBe(false));
    window.scrollTo(0, 0);
  });

  it('a scroll of a container around the object closes it', async () => {
    const container = document.createElement('div');
    container.style.cssText = 'position: fixed; left: 0; top: 0; width: 300px; height: 150px; overflow: auto;';
    const inner = document.createElement('div');
    inner.style.cssText = 'height: 1000px;';
    const object = document.createElement('div');
    object.id = 'object';
    object.tabIndex = 0;
    object.style.cssText = 'height: 80px;';
    inner.append(object);
    container.append(inner);
    const menu = document.createElement('nph-context-menu');
    menu.setAttribute('for', 'object');
    menu.items = ITEMS;
    document.body.append(container, menu);
    await menu.updateComplete;
    rightClick(object, 50, 40);
    await settle(menu);
    await vi.waitFor(() => expect(menu.open).toBe(true));
    container.scrollTop = 40;
    await vi.waitFor(() => expect(menu.open).toBe(false));
  });

  it('a menu opened from code stays on a scroll and follows the object', async () => {
    const tall = document.createElement('div');
    tall.style.cssText = 'height: 3000px;';
    const object = document.createElement('div');
    object.id = 'object';
    object.style.cssText = 'position: absolute; left: 40px; top: 200px; width: 240px; height: 80px;';
    const menu = document.createElement('nph-context-menu');
    menu.setAttribute('for', 'object');
    menu.items = ITEMS;
    menu.open = true;
    document.body.append(tall, object, menu);
    await settle(menu);
    await entered(menu);
    const before = panel(menu).getBoundingClientRect().top;
    window.scrollTo(0, 120);
    await vi.waitFor(() => expect(panel(menu).getBoundingClientRect().top).toBeCloseTo(before - 120, 0));
    expect(menu.open).toBe(true);
    window.scrollTo(0, 0);
  });

  it('Tab closes it and the focus moves on from the object', async () => {
    const setup = await mount();
    setup.object.focus();
    const next = document.createElement('button');
    next.textContent = 'Next';
    document.body.append(next);
    rightClick(setup.object, 100, 80);
    await settle(setup.menu);
    await userEvent.keyboard('{Tab}');
    await settle(setup.menu);
    expect(setup.menu.open).toBe(false);
    expect(document.activeElement).toBe(next);
  });

  it('a menu that becomes invalid while open closes and leaves the top layer', async () => {
    const setup = await mount();
    await openAt(setup);
    setup.menu.items = [];
    await settle(setup.menu);
    expect(setup.menu.open).toBe(false);
    expect(panel(setup.menu)).toBeNull();
  });
});

describe('keyboard in the menu', () => {
  async function opened(): Promise<Setup> {
    const setup = await mount();
    setup.object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(setup.menu);
    await vi.waitFor(() => expect(active(setup.menu)).toBe(items(setup.menu)[0]));
    return setup;
  }

  it('the arrows move with wrap', async () => {
    const { menu } = await opened();
    const list = items(menu);
    await userEvent.keyboard('{ArrowDown}');
    expect(active(menu)).toBe(list[1]);
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(active(menu)).toBe(list.at(-1));
    await userEvent.keyboard('{ArrowDown}');
    expect(active(menu)).toBe(list[0]);
  });

  it('Home and End go to the ends', async () => {
    const { menu } = await opened();
    const list = items(menu);
    await userEvent.keyboard('{End}');
    expect(active(menu)).toBe(list.at(-1));
    await userEvent.keyboard('{Home}');
    expect(active(menu)).toBe(list[0]);
  });

  it('a typed character goes to the next item that starts with it', async () => {
    const { menu } = await opened();
    await userEvent.keyboard('r');
    expect(active(menu)).toBe(byText(menu, 'Reload'));
    await sleep(600);
    await userEvent.keyboard('d');
    expect(active(menu)).toBe(byText(menu, 'Delete'));
  });

  it('Space right after a typed character activates the item it reached', async () => {
    const { menu } = await opened();
    const seen = events(menu);
    await userEvent.keyboard('e');
    await userEvent.keyboard(' ');
    expect(seen.map((detail) => detail.value)).toEqual(['edit']);
  });

  it('a disabled item takes the focus but does not activate', async () => {
    const setup = await mount([
      { value: 'a', text: 'Alpha' },
      { value: 'b', text: 'Beta', disabled: true },
    ]);
    setup.object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(setup.menu);
    const seen = events(setup.menu);
    await userEvent.keyboard('{ArrowDown}');
    expect(active(setup.menu)).toBe(byText(setup.menu, 'Beta'));
    await userEvent.keyboard('{Enter}');
    expect(seen).toEqual([]);
    expect(setup.menu.open).toBe(true);
  });
});

describe('activation and the event', () => {
  it('a common item fires nph-item-select with checked null and the origin, closes and gives the focus back', async () => {
    const setup = await mount();
    setup.object.focus();
    const seen = events(setup.menu);
    await openAt(setup);
    await userEvent.click(byText(setup.menu, 'Reload'));
    await settle(setup.menu);
    expect(seen).toHaveLength(1);
    expect(seen[0]).toEqual({ value: 'reload', checked: null, origin: setup.object });
    expect(setup.menu.open).toBe(false);
    expect(document.activeElement).toBe(setup.object);
  });

  it('the origin is the element under the pointer, so a row acts only on itself', async () => {
    const list = document.createElement('div');
    list.id = 'rows';
    list.style.cssText = 'position: fixed; left: 40px; top: 40px;';
    const rows = ['one', 'two'].map((name) => {
      const row = document.createElement('div');
      row.dataset.row = name;
      row.textContent = name;
      list.append(row);
      return row;
    });
    const menu = document.createElement('nph-context-menu');
    menu.setAttribute('for', 'rows');
    menu.items = ITEMS;
    document.body.append(list, menu);
    await menu.updateComplete;
    const seen = events(menu);
    rightClick(rows[1] as HTMLElement, 60, 70);
    await settle(menu);
    await userEvent.click(byText(menu, 'Edit'));
    expect(seen[0]?.origin).toBe(rows[1]);
  });

  it('opened from code, the origin is null', async () => {
    const { menu } = await mount();
    const seen = events(menu);
    menu.open = true;
    await settle(menu);
    await userEvent.click(byText(menu, 'Edit'));
    expect(seen[0]?.origin).toBeNull();
  });

  it('the event bubbles, is not composed and carries a typed detail', async () => {
    const setup = await mount();
    const outer = vi.fn();
    document.body.addEventListener('nph-item-select', outer);
    const seen = events(setup.menu);
    await openAt(setup);
    await userEvent.click(byText(setup.menu, 'Edit'));
    document.body.removeEventListener('nph-item-select', outer);
    expect(outer).toHaveBeenCalledTimes(1);
    expect((outer.mock.calls[0]?.[0] as Event).composed).toBe(false);
    expect(Object.keys(seen[0] ?? {}).sort()).toEqual(['checked', 'origin', 'value']);
  });

  it('single choice is exclusive inside its group, closes the menu and leaves other groups alone', async () => {
    const entries: NphContextMenuEntry[] = [
      { value: 'list', text: 'List', selection: 'single', checked: true },
      { value: 'grid', text: 'Grid', selection: 'single' },
      { type: 'separator' },
      { value: 'small', text: 'Small', selection: 'single', checked: true },
      { value: 'large', text: 'Large', selection: 'single' },
    ];
    const setup = await mount(entries);
    const seen = events(setup.menu);
    await openAt(setup);
    await userEvent.click(byText(setup.menu, 'Grid'));
    await settle(setup.menu);
    expect(seen[0]).toMatchObject({ value: 'grid', checked: true });
    const checked = (setup.menu.items as unknown as { value: string; checked?: boolean }[]).filter((entry) => entry.checked).map((entry) => entry.value);
    expect(checked).toEqual(['grid', 'small']);
    expect(entries.filter((entry) => 'checked' in entry && entry.checked).map((entry) => 'value' in entry && entry.value)).toEqual(['list', 'small']);
    expect(setup.menu.open).toBe(false);
  });

  it('multiple choice toggles and keeps the menu open, with the focus on the item', async () => {
    const setup = await mount([
      { value: 'a', text: 'Archived', selection: 'multiple', checked: true },
      { value: 'b', text: 'Shared', selection: 'multiple' },
    ]);
    const seen = events(setup.menu);
    await openAt(setup);
    await userEvent.click(byText(setup.menu, 'Shared'));
    await settle(setup.menu);
    expect(seen[0]).toMatchObject({ value: 'b', checked: true });
    expect(setup.menu.open).toBe(true);
    await userEvent.click(byText(setup.menu, 'Archived'));
    expect(seen[1]).toMatchObject({ value: 'a', checked: false });
  });

  it('a disabled item does not activate', async () => {
    const setup = await mount([{ value: 'off', text: 'Off', disabled: true }, { value: 'on', text: 'On' }]);
    const seen = events(setup.menu);
    await openAt(setup);
    await userEvent.click(byText(setup.menu, 'Off'), { force: true });
    expect(seen).toEqual([]);
    expect(setup.menu.open).toBe(true);
  });

  it('changing items or open from code fires nothing', async () => {
    const { menu } = await mount();
    const seen = events(menu);
    menu.open = true;
    await settle(menu);
    menu.items = [{ value: 'x', text: 'X', selection: 'multiple', checked: true }];
    await settle(menu);
    menu.open = false;
    await settle(menu);
    expect(seen).toEqual([]);
  });
});

describe('the submenu', () => {
  it('the right arrow opens it and moves the focus to its first item; the left arrow closes it and gives the focus back', async () => {
    const setup = await mount();
    setup.object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(setup.menu);
    await userEvent.keyboard('s');
    expect(active(setup.menu)).toBe(byText(setup.menu, 'Share'));
    await userEvent.keyboard('{ArrowRight}');
    await vi.waitFor(() => expect(shown(setup.menu, 1)).toBe(true));
    expect(setup.menu.openSubmenu).toBe('share');
    await vi.waitFor(() => expect(active(setup.menu)).toBe(items(setup.menu, 1)[0]));
    expect(items(setup.menu, 1)[0]?.matches(':focus-visible')).toBe(true);
    await userEvent.keyboard('{ArrowLeft}');
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe(''));
    expect(active(setup.menu)).toBe(byText(setup.menu, 'Share'));
    await vi.waitFor(() => expect(shown(setup.menu, 1)).toBe(false));
    expect(setup.menu.open).toBe(true);
  });

  it('Enter and Space on the item open it, and a click opens it too', async () => {
    const setup = await mount();
    setup.object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(setup.menu);
    await userEvent.keyboard('s{Enter}');
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe('share'));
    await userEvent.keyboard('{ArrowLeft}');
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe(''));
    await userEvent.keyboard(' ');
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe('share'));
    await userEvent.keyboard('{ArrowLeft}');
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe(''));
    await userEvent.click(byText(setup.menu, 'Share'));
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe('share'));
  });

  it('the right arrow on an item with no submenu does nothing', async () => {
    const setup = await mount();
    setup.object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(setup.menu);
    await userEvent.keyboard('{ArrowRight}');
    await sleep(100);
    expect(setup.menu.openSubmenu).toBe('');
  });

  it('hover opens it after motion/hover-delay and a pointer on an item with none closes it', async () => {
    const setup = await mount();
    await openAt(setup);
    const delay = Number.parseFloat(resolved('transition-delay', '--nph-motion-hover-delay'));
    expect(delay).toBeGreaterThan(0);
    await userEvent.hover(byText(setup.menu, 'Share'));
    expect(setup.menu.openSubmenu).toBe('');
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe('share'), { timeout: 2000 });
    await userEvent.hover(byText(setup.menu, 'Edit'));
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe(''), { timeout: 2000 });
  });

  it('the pointer inside the submenu keeps it open', async () => {
    const setup = await mount();
    await openAt(setup);
    await openSubmenuOf(setup.menu);
    await userEvent.hover(byText(setup.menu, 'Download file', 1));
    await sleep(600);
    expect(setup.menu.openSubmenu).toBe('share');
  });

  it('opens to the right, with its first item on the same line as the item that opened it', async () => {
    const setup = await mount();
    await openAt(setup, 60, 40);
    await openSubmenuOf(setup.menu);
    const parent = byText(setup.menu, 'Share').getBoundingClientRect();
    const first = items(setup.menu, 1)[0]?.getBoundingClientRect() as DOMRect;
    expect(first.top).toBeCloseTo(parent.top, 0);
    const main = panel(setup.menu).getBoundingClientRect();
    const sub = panel(setup.menu, 1).getBoundingClientRect();
    expect(sub.left).toBeGreaterThanOrEqual(main.right - 1);
    expect(panel(setup.menu, 1).dataset.side).toBe('right');
  });

  it('opens to the left only when there is no room on the right', async () => {
    const setup = await mount();
    const width = document.documentElement.clientWidth;
    await openAt(setup, width - px('--nph-layout-input-width') - 24, 40);
    await openSubmenuOf(setup.menu);
    const main = panel(setup.menu).getBoundingClientRect();
    const sub = panel(setup.menu, 1).getBoundingClientRect();
    expect(sub.right).toBeLessThanOrEqual(main.left + 1);
    expect(sub.left).toBeGreaterThanOrEqual(0);
    expect(panel(setup.menu, 1).dataset.side).toBe('left');
  });

  it('the item that opened it keeps the highlight, with the solid icon and arrow, and announces it', async () => {
    const setup = await mount();
    await openAt(setup);
    await openSubmenuOf(setup.menu);
    const parent = byText(setup.menu, 'Share');
    expect(parent.getAttribute('aria-haspopup')).toBe('menu');
    expect(parent.getAttribute('aria-expanded')).toBe('true');
    expect(parent.getAttribute('aria-controls')).toBe(panel(setup.menu, 1).querySelector('[role="menu"]')?.id);
    expect(getComputedStyle(parent).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
    for (const icon of parent.querySelectorAll<HTMLElement>('.glyph-rest')) {
      expect(getComputedStyle(icon).display).toBe('none');
    }
    for (const icon of parent.querySelectorAll<HTMLElement>('.glyph-hover')) {
      expect(getComputedStyle(icon).display).not.toBe('none');
      expect(getComputedStyle(icon).color).toBe(resolved('color', '--nph-dropdown-item-hover-icon-foreground'));
    }
    expect(byText(setup.menu, 'Edit').hasAttribute('aria-expanded')).toBe(false);
  });

  it('the submenu is a menu named by the item that opened it', async () => {
    const setup = await mount();
    await openAt(setup);
    await openSubmenuOf(setup.menu);
    const menu = panel(setup.menu, 1).querySelector('[role="menu"]') as HTMLElement;
    const node = await axNode(menu);
    expect(node.role).toBe('menu');
    expect(node.name).toBe('Share');
  });

  it('an item of the submenu fires the event with its own value, closes everything and gives the focus back', async () => {
    const setup = await mount();
    setup.object.focus();
    const seen = events(setup.menu);
    await openAt(setup);
    await openSubmenuOf(setup.menu);
    await userEvent.click(byText(setup.menu, 'Download file', 1));
    await settle(setup.menu);
    expect(seen).toEqual([{ value: 'download', checked: null, origin: setup.object }]);
    expect(setup.menu.open).toBe(false);
    expect(setup.menu.openSubmenu).toBe('');
    expect(document.activeElement).toBe(setup.object);
  });

  it('single and multiple choice inside the submenu keep their own group and the rewrite reaches the submenu', async () => {
    const setup = await mount([
      { value: 'view', text: 'View', submenu: [
        { value: 'list', text: 'List', selection: 'single', checked: true },
        { value: 'grid', text: 'Grid', selection: 'single' },
        { type: 'separator' },
        { value: 'names', text: 'Names', selection: 'multiple' },
      ] },
      { value: 'x', text: 'X' },
    ]);
    const seen = events(setup.menu);
    await openAt(setup);
    await openSubmenuOf(setup.menu, 'view');
    await userEvent.click(byText(setup.menu, 'Names', 1));
    await settle(setup.menu);
    expect(seen[0]).toMatchObject({ value: 'names', checked: true });
    expect(setup.menu.open).toBe(true);
    expect(setup.menu.openSubmenu).toBe('view');
    const view = setup.menu.items[0] as unknown as { submenu: { value?: string; checked?: boolean }[] };
    expect(view.submenu.find((entry) => entry.value === 'names')?.checked).toBe(true);
    expect(view.submenu.find((entry) => entry.value === 'list')?.checked).toBe(true);
  });

  it('Esc closes the submenu first and then the menu', async () => {
    const setup = await mount();
    setup.object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(setup.menu);
    await userEvent.keyboard('s{ArrowRight}');
    await vi.waitFor(() => expect(shown(setup.menu, 1)).toBe(true));
    await userEvent.keyboard('{Escape}');
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe(''));
    expect(setup.menu.open).toBe(true);
    expect(active(setup.menu)).toBe(byText(setup.menu, 'Share'));
    await userEvent.keyboard('{Escape}');
    await settle(setup.menu);
    expect(setup.menu.open).toBe(false);
    expect(document.activeElement).toBe(setup.object);
  });

  it('open-submenu set from code shows the submenu; an item that is not there is reported', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { menu } = await mount(ITEMS, { open: true, openSubmenu: 'share' });
    await settle(menu);
    await vi.waitFor(() => expect(shown(menu, 1)).toBe(true));
    menu.openSubmenu = 'nope';
    await settle(menu);
    expect(spy.mock.calls.some((call) => String(call[0]).includes('open-submenu "nope"'))).toBe(true);
  });

  it('a disabled item with a submenu does not open it', async () => {
    const setup = await mount([{ value: 'share', text: 'Share', disabled: true, submenu: SUBMENU }, { value: 'x', text: 'X' }]);
    setup.object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(setup.menu);
    await userEvent.keyboard('{Enter}{ArrowRight}');
    await sleep(100);
    expect(setup.menu.openSubmenu).toBe('');
  });

  it('right to left: the left arrow opens the submenu and the right arrow closes it', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const setup = await mount();
    setup.object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(setup.menu);
    await userEvent.keyboard('s{ArrowLeft}');
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe('share'));
    await userEvent.keyboard('{ArrowRight}');
    await vi.waitFor(() => expect(setup.menu.openSubmenu).toBe(''));
  });
});

describe('roles and names the browser computes', () => {
  it('the panel is a menu, named by label when it has one', async () => {
    const setup = await mount(ITEMS, { label: 'File actions' });
    await openAt(setup);
    const menu = panel(setup.menu).querySelector('[role="menu"]') as HTMLElement;
    const node = await axNode(menu);
    expect(node.role).toBe('menu');
    expect(node.name).toBe('File actions');
  });

  it('each item has its role, its state and the label as its name', async () => {
    const setup = await mount([
      { value: 'a', text: 'Plain' },
      { value: 'b', text: 'Radio', selection: 'single', checked: true },
      { value: 'c', text: 'Box', selection: 'multiple' },
      { value: 'd', text: 'Menu', submenu: SUBMENU },
    ]);
    await openAt(setup);
    const radio = byText(setup.menu, 'Radio');
    const box = byText(setup.menu, 'Box');
    expect(radio.getAttribute('role')).toBe('menuitemradio');
    expect(radio.getAttribute('aria-checked')).toBe('true');
    expect(box.getAttribute('role')).toBe('menuitemcheckbox');
    expect(box.getAttribute('aria-checked')).toBe('false');
    expect(byText(setup.menu, 'Plain').getAttribute('role')).toBe('menuitem');
    expect(byText(setup.menu, 'Plain').hasAttribute('aria-checked')).toBe(false);
    for (const label of ['Plain', 'Radio', 'Box', 'Menu']) {
      const node = await axNode(byText(setup.menu, label));
      expect(node.name).toBe(label);
    }
    expect((await axNode(radio)).role).toBe('menuitemradio');
    expect((await axNode(box)).role).toBe('menuitemcheckbox');
  });

  it('the shortcut goes in aria-keyshortcuts, not in the name, and the icon and arrow are not read', async () => {
    const setup = await mount();
    await openAt(setup);
    const reload = byText(setup.menu, 'Reload');
    expect(reload.getAttribute('aria-keyshortcuts')).toBe('Control+R');
    expect(reload.hasAttribute('aria-describedby')).toBe(false);
    expect((await axNode(reload)).name).toBe('Reload');
    expect(byText(setup.menu, 'Share').hasAttribute('aria-keyshortcuts')).toBe(false);
    expect(byText(setup.menu, 'Delete').getAttribute('aria-keyshortcuts')).toBe('Delete');
    for (const icon of panel(setup.menu).querySelectorAll('nph-icon')) {
      expect((await axNode(icon)).ignored).toBe(true);
    }
  });

  it('writes the shortcut in the syntax of aria-keyshortcuts', () => {
    expect(keyShortcutsOf('Ctrl+C')).toBe('Control+C');
    expect(keyShortcutsOf('⌘D')).toBe('Meta+D');
    expect(keyShortcutsOf('⌘⇧K')).toBe('Meta+Shift+K');
    expect(keyShortcutsOf('Ctrl+Shift+k')).toBe('Control+Shift+K');
    expect(keyShortcutsOf('Del')).toBe('Delete');
    expect(keyShortcutsOf('Alt+←')).toBe('Alt+ArrowLeft');
    expect(keyShortcutsOf('Shift+→')).toBe('Shift+ArrowRight');
    expect(keyShortcutsOf('Supr')).toBe('Delete');
    expect(keyShortcutsOf('F2')).toBe('F2');
  });

  it('two sets with no label, split by a separator, are two groups; a group with a label is named', async () => {
    const setup = await mount([
      { value: 'a', text: 'A' },
      { type: 'separator' },
      { type: 'label', text: 'Danger' },
      { value: 'b', text: 'B' },
    ]);
    await openAt(setup);
    const groups = [...panel(setup.menu).querySelectorAll<HTMLElement>('[role="group"]')];
    expect(groups).toHaveLength(2);
    expect((await axNode(groups[1] as HTMLElement)).name).toBe('Danger');
    expect(groups[0]?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('the inner checkbox is inert: no focus, no role of its own', async () => {
    const setup = await mount([{ value: 'a', text: 'Box', selection: 'multiple', checked: true }]);
    await openAt(setup);
    const checkbox = byText(setup.menu, 'Box').querySelector('nph-checkbox') as HTMLElement;
    expect(checkbox.hasAttribute('inert')).toBe(true);
    expect(checkbox.hasAttribute('disabled')).toBe(false);
  });
});

describe('anatomy, measures and colors', () => {
  it('the panel: color/popover, color/dropdown-border, dropdown/panel-radius, elevation/dropdown, layout/input-width and space/inline-tight', async () => {
    const setup = await mount();
    await openAt(setup);
    const style = getComputedStyle(panel(setup.menu));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-popover'));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-color-dropdown-border'));
    expect(Number.parseFloat(style.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    expect(style.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-dropdown-panel-radius'));
    expect(style.boxShadow).toBe(resolved('box-shadow', '--nph-elevation-dropdown'));
    expect(panel(setup.menu).getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-input-width'), 0);
    expect(Number.parseFloat(style.paddingTop)).toBeCloseTo(px('--nph-space-inline-tight'), 1);
  });

  it('the outline is color/border-subtle: the same color as the popover outline', async () => {
    const setup = await mount();
    await openAt(setup);
    expect(getComputedStyle(panel(setup.menu)).borderTopColor).toBe(resolved('color', '--nph-color-border-subtle'));
  });

  it('the submenu panel is equal to the first', async () => {
    const setup = await mount();
    await openAt(setup);
    await openSubmenuOf(setup.menu);
    const main = getComputedStyle(panel(setup.menu));
    const sub = getComputedStyle(panel(setup.menu, 1));
    for (const property of ['backgroundColor', 'borderTopColor', 'borderTopLeftRadius', 'boxShadow', 'paddingTop'] as const) {
      expect(sub[property], property).toBe(main[property]);
    }
    expect(panel(setup.menu, 1).getBoundingClientRect().width).toBeCloseTo(panel(setup.menu).getBoundingClientRect().width, 0);
  });

  it('rows of 36 in default, 28 in compact and 40 with multiple choice, from their content', async () => {
    const md = px('--nph-icon-size-md');
    const inline = px('--nph-space-inline');
    const tight = px('--nph-space-inline-tight');
    const entries: NphContextMenuEntry[] = [
      { value: 'a', text: 'A', icon: 'pen' },
      { value: 'm', text: 'M', selection: 'multiple' },
    ];
    const normal = await mount(entries);
    await openAt(normal);
    expect(byText(normal.menu, 'A').getBoundingClientRect().height).toBeCloseTo(md + 2 * inline, 0);
    expect(byText(normal.menu, 'M').getBoundingClientRect().height).toBeCloseTo(40, 0);
    document.body.replaceChildren();
    const compact = await mount(entries, { size: 'compact' });
    await openAt(compact);
    expect(byText(compact.menu, 'A').getBoundingClientRect().height).toBeCloseTo(md + 2 * tight, 0);
  });

  it('the item: dropdown/item-radius, no background at rest, text/body-md in color/popover-foreground, cut with an ellipsis', async () => {
    const setup = await mount([{ value: 'a', text: 'A very long label that does not fit in the width of the menu at all', icon: 'pen' }]);
    await openAt(setup);
    const item = items(setup.menu)[0] as HTMLElement;
    const style = getComputedStyle(item);
    expect(style.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-dropdown-item-radius'));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    const text = item.querySelector('.text') as HTMLElement;
    expect(getComputedStyle(text).color).toBe(resolved('color', '--nph-color-popover-foreground'));
    expect(getComputedStyle(text).fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
    expect(getComputedStyle(text).textOverflow).toBe('ellipsis');
    expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
    expect(Number.parseFloat(style.paddingLeft)).toBeCloseTo(px('--nph-space-inline'), 1);
  });

  it('the shortcut: text/caption in color/muted-foreground, at the end', async () => {
    const setup = await mount();
    await openAt(setup);
    const shortcut = byText(setup.menu, 'Reload').querySelector('.shortcut') as HTMLElement;
    expect(getComputedStyle(shortcut).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(getComputedStyle(shortcut).fontSize).toBe(resolved('font-size', '--nph-text-caption-font-size'));
    const item = byText(setup.menu, 'Reload').getBoundingClientRect();
    expect(shortcut.getBoundingClientRect().right).toBeLessThanOrEqual(item.right - px('--nph-space-inline') + 1);
  });

  it('the item with a submenu shows the arrow at the end and no shortcut', async () => {
    const setup = await mount();
    await openAt(setup);
    const share = byText(setup.menu, 'Share');
    expect(share.querySelector('.shortcut')).toBeNull();
    const arrow = share.querySelector('.arrow.glyph-rest') as HTMLElement;
    expect(arrow.getAttribute('name')).toBe('chevron-right');
    expect(arrow.getAttribute('size')).toBe('sm');
    expect(arrow.getAttribute('aria-hidden')).not.toBe('false');
  });

  it('the group label: text/label-sm in color/muted-foreground', async () => {
    const setup = await mount([{ type: 'label', text: 'Actions' }, { value: 'a', text: 'A' }]);
    await openAt(setup);
    const label = panel(setup.menu).querySelector('.group-label') as HTMLElement;
    expect(getComputedStyle(label).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(getComputedStyle(label).fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
  });

  it('the separator: nph-separator in dropdown/separator with space/inline-tight above and below', async () => {
    const setup = await mount();
    await openAt(setup);
    const separator = panel(setup.menu).querySelector('.separator') as HTMLElement;
    expect(getComputedStyle(separator).backgroundColor).toBe(resolved('background-color', '--nph-dropdown-separator'));
    expect(Number.parseFloat(getComputedStyle(separator).marginTop)).toBeCloseTo(px('--nph-space-inline-tight'), 1);
    expect(Number.parseFloat(getComputedStyle(separator).marginBottom)).toBeCloseTo(px('--nph-space-inline-tight'), 1);
  });

  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: hover paints color/primary-surface and turns the start icon solid in dropdown/item-hover-icon-foreground, light at rest`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const setup = await mount();
      await openAt(setup);
      const item = byText(setup.menu, 'Edit');
      const rest = item.querySelector('.glyph-rest') as HTMLElement;
      const hover = item.querySelector('.glyph-hover') as HTMLElement;
      expect(getComputedStyle(rest).display).not.toBe('none');
      expect(getComputedStyle(hover).display).toBe('none');
      expect(rest.getAttribute('variant') ?? 'light').toBe('light');
      expect(hover.getAttribute('variant')).toBe('solid');
      await userEvent.hover(item);
      expect(getComputedStyle(item).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
      expect(getComputedStyle(rest).display).toBe('none');
      expect(getComputedStyle(hover).display).not.toBe('none');
      expect(getComputedStyle(hover).color).toBe(resolved('color', '--nph-dropdown-item-hover-icon-foreground'));
      expect(getComputedStyle(item.querySelector('.text') as HTMLElement).color).toBe(resolved('color', '--nph-color-popover-foreground'));
    });

    it(`${scheme}: the destructive item is dropdown/item-destructive-foreground and hovers in dropdown/item-destructive-hover-*, with the solid icon`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const setup = await mount();
      await openAt(setup);
      const item = byText(setup.menu, 'Delete');
      const destructive = resolved('color', '--nph-dropdown-item-destructive-foreground');
      const text = item.querySelector('.text') as HTMLElement;
      const shortcut = item.querySelector('.shortcut') as HTMLElement;
      const rest = item.querySelector('.glyph-rest') as HTMLElement;
      const hover = item.querySelector('.glyph-hover') as HTMLElement;
      expect(getComputedStyle(text).color).toBe(destructive);
      expect(getComputedStyle(shortcut).color).toBe(destructive);
      expect(getComputedStyle(rest).color).toBe(destructive);
      await userEvent.hover(item);
      const over = resolved('color', '--nph-dropdown-item-destructive-hover-foreground');
      expect(getComputedStyle(item).backgroundColor).toBe(resolved('background-color', '--nph-dropdown-item-destructive-hover-background'));
      expect(getComputedStyle(text).color).toBe(over);
      expect(getComputedStyle(shortcut).color).toBe(over);
      expect(getComputedStyle(rest).display).toBe('none');
      expect(getComputedStyle(hover).display).not.toBe('none');
      expect(getComputedStyle(hover).color).toBe(over);
    });
  }

  it('the compact destructive item has the same colors on the 28 px row', async () => {
    const setup = await mount(ITEMS, { size: 'compact' });
    await openAt(setup);
    const item = byText(setup.menu, 'Delete');
    expect(item.getBoundingClientRect().height).toBeCloseTo(px('--nph-icon-size-md') + 2 * px('--nph-space-inline-tight'), 0);
    expect(getComputedStyle(item.querySelector('.text') as HTMLElement).color).toBe(resolved('color', '--nph-dropdown-item-destructive-foreground'));
    await userEvent.hover(item);
    expect(getComputedStyle(item).backgroundColor).toBe(resolved('background-color', '--nph-dropdown-item-destructive-hover-background'));
  });

  it('a disabled item: state/disabled-opacity on the whole row, light icon and no hover', async () => {
    const setup = await mount([{ value: 'off', text: 'Off', icon: 'pen', disabled: true }, { value: 'on', text: 'On' }]);
    await openAt(setup);
    const item = byText(setup.menu, 'Off');
    expect(getComputedStyle(item).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    await userEvent.hover(item, { force: true });
    expect(getComputedStyle(item).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(item.querySelector('.glyph-hover') as HTMLElement).display).toBe('none');
  });

  it('single choice, checked: text/label-md in color/primary-hover and the solid check at the end', async () => {
    const setup = await mount([{ value: 'a', text: 'List', icon: 'list', selection: 'single', checked: true }, { value: 'b', text: 'Grid', selection: 'single' }]);
    await openAt(setup);
    const item = byText(setup.menu, 'List');
    const text = item.querySelector('.text') as HTMLElement;
    expect(getComputedStyle(text).color).toBe(resolved('color', '--nph-color-primary-hover'));
    expect(getComputedStyle(text).fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    const check = item.querySelector('.check') as HTMLElement;
    expect(check.getAttribute('variant')).toBe('solid');
    expect(byText(setup.menu, 'Grid').querySelector('.check')).toBeNull();
  });

  it('multiple choice shows the nph-checkbox box at the start', async () => {
    const setup = await mount([{ value: 'a', text: 'Archived', icon: 'pen', selection: 'multiple', checked: true }]);
    await openAt(setup);
    const item = items(setup.menu)[0] as HTMLElement;
    const box = item.querySelector('nph-checkbox') as HTMLElement;
    expect(box).not.toBeNull();
    expect(box.compareDocumentPosition(item.querySelector('.icon') as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('the focus is the color/primary border and the focus/halo halo, with the item radii', async () => {
    const setup = await mount();
    setup.object.focus();
    await userEvent.keyboard('{ContextMenu}');
    await settle(setup.menu);
    const item = items(setup.menu)[0] as HTMLElement;
    const border = getComputedStyle(item, '::before');
    const halo = getComputedStyle(item, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-color-primary'));
    expect(Number.parseFloat(border.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    expect(border.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-dropdown-item-focus-border-radius'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(Number.parseFloat(halo.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
    expect(halo.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-dropdown-item-focus-halo-radius'));
    const rest = item.querySelector('.glyph-rest') as HTMLElement;
    expect(getComputedStyle(rest).display).toBe('none');
    expect(getComputedStyle(item.querySelector('.glyph-hover') as HTMLElement).display).not.toBe('none');
  });

  it('opening and closing use the enter and exit motion; reduced motion leaves opacity only', async () => {
    const setup = await mount();
    await openAt(setup);
    expect(getComputedStyle(panel(setup.menu)).transitionDuration).toBe(resolved('transition-duration', '--nph-motion-enter-duration'));
    setup.menu.open = false;
    await settle(setup.menu);
    expect(getComputedStyle(panel(setup.menu)).transitionDuration).toBe(resolved('transition-duration', '--nph-motion-exit-duration'));
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, and none is a context-menu token', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
    expect(tokensCss).not.toMatch(/--nph-context-menu-/);
  });

  it('uses the dropdown tokens of the item, the panel and the separator', () => {
    for (const name of [
      '--nph-dropdown-panel-radius',
      '--nph-dropdown-item-radius',
      '--nph-dropdown-item-focus-border-radius',
      '--nph-dropdown-item-focus-halo-radius',
      '--nph-dropdown-separator',
      '--nph-dropdown-item-destructive-foreground',
      '--nph-dropdown-item-destructive-hover-foreground',
      '--nph-dropdown-item-destructive-hover-background',
      '--nph-dropdown-item-hover-icon-foreground',
      '--nph-color-dropdown-border',
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
