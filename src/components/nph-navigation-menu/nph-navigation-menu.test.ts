/**
 * Tests of `nph-navigation-menu` (P110), in a real browser (P21, item 5): hover, keyboard focus, the top
 * layer of the panel and the measures only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `3977:7913`, sets `3969:7897`,
 * `3957:6662` and `3957:6722`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-62:
 * the API, the invalid input, the bar of triggers and links, the panel with grouped links, the current
 * state, the narrow width with the Menu button, the opening and closing by click, key, pointer and Esc,
 * the roles and names the browser computes, the colors and measures of each state, the focus, the
 * right-to-left writing and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-navigation-menu.css?raw';
import { NphNavigationMenu, NPH_NAVIGATION_MENU_LINK_PROTOCOLS, isSafeHref } from './nph-navigation-menu';
import type { NphNavigationMenuItem } from './nph-navigation-menu';
import type { NphIcon } from '../nph-icon/nph-icon';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

/** The listeners a test puts on the page; aborted at the end of each test, so none leaks into the next. */
let listeners = new AbortController();

afterEach(async () => {
  vi.useRealTimers();
  await userEvent.unhover(document.body).catch(() => {});
  listeners.abort();
  listeners = new AbortController();
  document.body.replaceChildren();
  document.documentElement.removeAttribute('dir');
  document.body.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

const ITEMS: NphNavigationMenuItem[] = [
  {
    type: 'trigger',
    label: 'Products',
    value: 'products',
    groups: [
      {
        label: 'Build',
        links: [
          { title: 'Components', href: '#components', description: 'Reusable blocks', icon: 'file' },
          { title: 'Tokens', href: '#tokens', description: 'Named values', icon: 'tag' },
        ],
      },
      { label: 'Manage', links: [{ title: 'Guides', href: '#guides', description: 'Step by step', icon: 'folder' }] },
    ],
  },
  {
    type: 'trigger',
    label: 'Resources',
    value: 'resources',
    groups: [{ links: [{ title: 'Docs', href: '#docs' }, { title: 'Blog', href: '#blog' }] }],
  },
  { label: 'Pricing', href: '#pricing' },
];

async function mount(props: Partial<NphNavigationMenu> = {}): Promise<NphNavigationMenu> {
  const menu = document.createElement('nph-navigation-menu');
  Object.assign(menu, { items: ITEMS, label: 'Main', menuLabel: 'Menu', ...props });
  document.body.append(menu);
  await settle(menu);
  return menu;
}

async function settle(menu: NphNavigationMenu): Promise<void> {
  await menu.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  for (const inner of menu.shadowRoot?.querySelectorAll('nph-icon, nph-tooltip') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
  await menu.updateComplete;
}

const root = (menu: NphNavigationMenu): ShadowRoot => menu.shadowRoot as ShadowRoot;
const q = <T extends HTMLElement = HTMLElement>(menu: NphNavigationMenu, selector: string): T => root(menu).querySelector(selector) as T;
const qa = <T extends HTMLElement = HTMLElement>(menu: NphNavigationMenu, selector: string): T[] => [...root(menu).querySelectorAll(selector)] as T[];
const inside = <T extends HTMLElement = HTMLElement>(element: HTMLElement, selector: string): T[] => [...element.querySelectorAll(selector)] as T[];
const trigger = (menu: NphNavigationMenu, index: number): HTMLButtonElement => q(menu, `#trigger-${String(index)}`);
const panel = (menu: NphNavigationMenu, index: number): HTMLElement => q(menu, `#panel-${String(index)}`);
const list = (menu: NphNavigationMenu): HTMLElement => q(menu, '#panel-list');
const menuButton = (menu: NphNavigationMenu): HTMLButtonElement => q(menu, '.menu-button');
const topItems = (menu: NphNavigationMenu): HTMLElement[] => qa(menu, '.top');
const isShown = (element: HTMLElement): boolean => element.matches(':popover-open');
const shownPanels = (menu: NphNavigationMenu): string[] => qa(menu, '.panel').filter(isShown).map((element) => element.id);

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

/**
 * The hover waits. The wait is the `motion/hover-delay` token, 300 ms, and the tests of the pointer drive a
 * fake clock (`setTimeout` and `clearTimeout` only) and send the `pointerenter` and `pointerleave` that the
 * browser sends to the entry of a trigger. So the wait is exact, "not before" and "after" are proved on the
 * millisecond, and no test sits on real time, which an overloaded runner stretches. A real mouse is proved by
 * its own test, which waits for the state and never for a time.
 */
const DELAY = 300;

function useClock(): void {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
}

/** Moves the fake clock and lets the piece draw what the timers changed. */
async function elapse(menu: NphNavigationMenu, ms: number): Promise<void> {
  vi.advanceTimersByTime(ms);
  await settle(menu);
}

function mouse(element: Element, type: 'pointerenter' | 'pointerleave'): void {
  element.dispatchEvent(new PointerEvent(type, { pointerType: 'mouse' }));
}

/** The entry (the `li`) of the top item at this index: the panel is inside it, so is the pointer over it. */
const entry = (menu: NphNavigationMenu, index: number): HTMLElement => qa(menu, '.entry')[index] as HTMLElement;
const over = (menu: NphNavigationMenu, index: number): void => mouse(entry(menu, index), 'pointerenter');
const out = (menu: NphNavigationMenu, index: number): void => mouse(entry(menu, index), 'pointerleave');

/** A click as a mouse sends it: `detail` is the click count, which a click by code or by key leaves at 0. */
function mouseClick(element: Element): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, detail: 1 }));
}

/** Opens a panel by click and waits for it to be shown and placed. */
async function openByClick(menu: NphNavigationMenu, index: number): Promise<void> {
  await userEvent.click(trigger(menu, index));
  await settle(menu);
  await frame();
}

/** The node the browser itself builds for an element in its accessibility tree. */
async function axNode(element: Element): Promise<{ role: string; name: string; description: string; ignored: boolean }> {
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
      ignored: node?.ignored === true,
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-navigation-menu')).toBe(NphNavigationMenu);
    expect(document.createElement('nph-navigation-menu')).toBeInstanceOf(NphNavigationMenu);
  });

  it('the public API is exactly P110', () => {
    const declared = [...(NphNavigationMenu as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(['active', 'hostName', 'items', 'label', 'menuLabel', 'narrow', 'open'].sort());
    expect([...NPH_NAVIGATION_MENU_LINK_PROTOCOLS]).toEqual(['http:', 'https:', 'mailto:', 'tel:']);
  });

  it('has the defaults: no items, wide, closed, no name', () => {
    const menu = document.createElement('nph-navigation-menu');
    expect(menu.items).toEqual([]);
    expect(menu.narrow).toBe(false);
    expect(menu.open).toBe(false);
    expect(menu.active).toBeNull();
    expect(menu.label).toBeNull();
    expect(menu.menuLabel).toBeNull();
  });

  it('`items` is a property only; `narrow`, `open`, `active`, `label` and `menu-label` come from attributes', () => {
    const menu = document.createElement('nph-navigation-menu');
    menu.setAttribute('items', '[{"label":"A","href":"#a"}]');
    menu.setAttribute('narrow', '');
    menu.setAttribute('open', '');
    menu.setAttribute('active', 'products');
    menu.setAttribute('label', 'Main');
    menu.setAttribute('menu-label', 'Menu');
    expect(menu.items).toEqual([]);
    expect(menu.narrow).toBe(true);
    expect(menu.open).toBe(true);
    expect(menu.active).toBe('products');
    expect(menu.label).toBe('Main');
    expect(menu.menuLabel).toBe('Menu');
  });

  it('declares no slot, no part, no event of its own and no color property', async () => {
    const menu = await mount({ open: true });
    expect(root(menu).querySelector('slot')).toBeNull();
    expect(root(menu).querySelector('[part]')).toBeNull();
    expect(componentCss).not.toMatch(/::part|--nph-navigation-menu-[a-z-]+\s*:/);
    const events: string[] = [];
    for (const name of ['nph-open', 'nph-close', 'nph-select', 'nph-change', 'nph-item-select', 'toggle', 'change']) {
      menu.addEventListener(name, () => events.push(name), { signal: listeners.signal });
    }
    await openByClick(menu, 1);
    await userEvent.keyboard('{Escape}');
    expect(events.filter((name) => name.startsWith('nph-'))).toEqual([]);
  });

  it('`narrow` and `open` reflect', async () => {
    const menu = await mount({ narrow: true, open: true });
    expect(menu.hasAttribute('narrow')).toBe(true);
    expect(menu.hasAttribute('open')).toBe(true);
    menu.narrow = false;
    menu.open = false;
    await menu.updateComplete;
    expect(menu.hasAttribute('narrow')).toBe(false);
    expect(menu.hasAttribute('open')).toBe(false);
  });

  it('isSafeHref takes the four protocols and a relative address and refuses the rest', () => {
    for (const href of ['https://example.com', 'http://example.com', 'mailto:a@b.co', 'tel:+5511', '/a', 'a/b', '#top', '?x=1']) {
      expect(isSafeHref(href), href).toBe(true);
    }
    for (const href of ['javascript:alert(1)', 'java\nscript:alert(1)', ' JaVa\tScRiPt:x', 'data:text/html,x', 'vbscript:x']) {
      expect(isSafeHref(href), href).toBe(false);
    }
  });
});

describe('invalid input', () => {
  const trigger1 = (links: unknown[], extra: Record<string, unknown> = {}): NphNavigationMenuItem =>
    ({ type: 'trigger', label: 'Products', groups: [{ links }], ...extra }) as unknown as NphNavigationMenuItem;
  const ok = { title: 'One', href: '#one' };

  const cases: Array<[string, Partial<NphNavigationMenu>, RegExp]> = [
    ['items that is not a list', { items: 'Home' as never }, /items is not a list/],
    ['no item', { items: [] }, /items is empty/],
    ['an item that is not an object', { items: [null as never] }, /item 1 is not an object/],
    ['an item with an unknown type', { items: [{ type: 'menu', label: 'A' } as never] }, /item 1 has type "menu"/],
    ['a link without a label', { items: [{ label: '', href: '#a' }] }, /item 1 has no `label`/],
    ['a link without href', { items: [{ label: 'A' }] }, /item 1 is a link and needs an `href`/],
    ['a javascript: href', { items: [{ label: 'A', href: 'javascript:alert(1)' }] }, /item 1 has an unsafe `href`/],
    ['a javascript: href split by a line break', { items: [{ label: 'A', href: 'java\nscript:alert(1)' }] }, /item 1 has an unsafe `href`/],
    ['a data: href on a panel link', { items: [trigger1([{ title: 'One', href: 'data:text/html,x' }])] }, /link 1 of group 1 of item 1 has an unsafe `href`/],
    ['an unsafe href on a disabled link', { items: [{ label: 'A', href: 'javascript:x', disabled: true }] }, /item 1 has an unsafe `href`/],
    ['a trigger without a label', { items: [trigger1([ok], { label: '' })] }, /item 1 has no `label`/],
    ['a trigger without groups', { items: [{ type: 'trigger', label: 'A', groups: [] } as never] }, /item 1 is a trigger and needs `groups`/],
    ['a group without links', { items: [{ type: 'trigger', label: 'A', groups: [{ links: [] }] } as never] }, /group 1 of item 1 has no `links`/],
    ['a panel link without a title', { items: [trigger1([{ title: '', href: '#a' }])] }, /link 1 of group 1 of item 1 has no `title`/],
    ['a panel link without href', { items: [trigger1([{ title: 'One' }])] }, /link 1 of group 1 of item 1 is a link and needs an `href`/],
    ['an icon outside the core', { items: [trigger1([{ ...ok, icon: 'rocket' }])] }, /icon "rocket" of link 1 of group 1 of item 1 does not belong/],
    ['two triggers with the same value', { items: [trigger1([ok], { value: 'a' }), trigger1([ok], { value: 'a' })] }, /repeats the trigger `value` "a"/],
    [
      'two current links',
      { items: [{ label: 'A', href: '#a', current: true }, trigger1([{ ...ok, current: true }])] },
      /2 links are `current`/,
    ],
    ['a narrow bar without menu-label', { narrow: true, menuLabel: null }, /needs `menu-label`/],
    ['a narrow bar with a blank menu-label', { narrow: true, menuLabel: '   ' }, /needs `menu-label`/],
  ];

  for (const [cause, props, message] of cases) {
    it(`${cause}: renders nothing and complains once`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const menu = await mount(props);
      expect(root(menu).childElementCount).toBe(0);
      expect(menu.hasAttribute('data-nph-rendered')).toBe(false);
      expect(getComputedStyle(menu).display).toBe('none');
      const messages = error.mock.calls.map((call) => String(call[0]));
      expect(messages.filter((text) => message.test(text))).toHaveLength(1);
      expect(messages.every((text) => text.startsWith('[nph-navigation-menu]'))).toBe(true);
    });
  }

  it('a re-render with the same bad input stays silent', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const menu = await mount({ items: [] });
    menu.label = 'Another name';
    await menu.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('draws again, with no leftover, once the input is fixed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const menu = await mount({ items: [] });
    menu.items = ITEMS;
    await menu.updateComplete;
    expect(menu.hasAttribute('data-nph-rendered')).toBe(true);
    expect(topItems(menu)).toHaveLength(3);
  });

  it('takes http, https, mailto, tel, a relative path and a fragment as destinations', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    for (const href of ['https://example.com/a', 'http://example.com', 'mailto:team@example.com', 'tel:+5511999999999', '/projects', 'projects/one', '#top', '?page=2']) {
      const menu = await mount({ items: [{ label: 'A', href }] });
      expect(menu.hasAttribute('data-nph-rendered'), href).toBe(true);
      menu.remove();
    }
    expect(error).not.toHaveBeenCalled();
  });

  it('a disabled link needs no href', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const menu = await mount({ items: [{ label: 'A', disabled: true }, trigger1([{ title: 'One', disabled: true }])] });
    expect(menu.hasAttribute('data-nph-rendered')).toBe(true);
    expect(error).not.toHaveBeenCalled();
  });

  it('a bar with no accessible name draws, and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const menu = await mount({ label: null });
    expect(menu.hasAttribute('data-nph-rendered')).toBe(true);
    expect(q(menu, 'nav').hasAttribute('aria-label')).toBe(false);
    menu.items = [...ITEMS];
    await menu.updateComplete;
    expect(warn.mock.calls.map((call) => String(call[0])).filter((text) => /no accessible name/.test(text))).toHaveLength(1);
  });

  it('the hidden attribute of the consumer still hides a valid bar', async () => {
    const menu = await mount();
    expect(getComputedStyle(menu).display).toBe('block');
    menu.hidden = true;
    await menu.updateComplete;
    expect(getComputedStyle(menu).display).toBe('none');
  });
});

describe('the bar', () => {
  it('draws the top items in order: a trigger is a button, a link is an anchor', async () => {
    const menu = await mount();
    expect(topItems(menu).map((item) => item.tagName)).toEqual(['BUTTON', 'BUTTON', 'A']);
    expect(topItems(menu).map((item) => (item.querySelector('.top-label') as HTMLElement).textContent)).toEqual(['Products', 'Resources', 'Pricing']);
    expect((topItems(menu)[2] as HTMLAnchorElement).getAttribute('href')).toBe('#pricing');
  });

  it('is a nav named by the label, else by the aria-label of the host', async () => {
    const menu = await mount();
    expect(q(menu, 'nav').getAttribute('aria-label')).toBe('Main');
    expect((await axNode(q(menu, 'nav'))).role).toBe('navigation');
    expect((await axNode(q(menu, 'nav'))).name).toBe('Main');
    const named = await mount({ label: null, hostName: 'Site' });
    expect(q(named, 'nav').getAttribute('aria-label')).toBe('Site');
    const both = await mount({ label: 'Label', hostName: 'Site' });
    expect(q(both, 'nav').getAttribute('aria-label')).toBe('Label');
  });

  it('a trigger carries the arrow, a decorative chevron-down; a link carries none', async () => {
    const menu = await mount();
    const arrows = qa<NphIcon>(menu, '.trigger-icon');
    expect(arrows).toHaveLength(2);
    expect(arrows.map((arrow) => arrow.name)).toEqual(['chevron-down', 'chevron-down']);
    expect(arrows.every((arrow) => arrow.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(topItems(menu)[2]?.querySelector('nph-icon')).toBeNull();
  });

  it('a trigger is a button with aria-expanded false and aria-controls pointing to its panel in the same root', async () => {
    const menu = await mount();
    const button = trigger(menu, 0);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe('panel-0');
    expect(root(menu).getElementById('panel-0')).toBe(panel(menu, 0));
    const node = await axNode(button);
    expect(node.role).toBe('button');
    expect(node.name).toBe('Products');
  });

  it('every panel starts closed: out of the top layer and out of the Tab order', async () => {
    const menu = await mount();
    expect(shownPanels(menu)).toEqual([]);
    await userEvent.keyboard('{Tab}{Tab}{Tab}{Tab}');
    expect(root(menu).activeElement?.closest('.panel') ?? null).toBeNull();
  });

  it('the top items sit bar-gap apart, on one line', async () => {
    const menu = await mount();
    const [first, second] = topItems(menu).map((item) => item.getBoundingClientRect());
    expect((second as DOMRect).left - (first as DOMRect).right).toBeCloseTo(px('--nph-navigation-menu-bar-gap'), 0);
    expect(new Set(topItems(menu).map((item) => Math.round(item.getBoundingClientRect().top))).size).toBe(1);
  });

  it('the top item has the padding, radius, gap and arrow size of its tokens', async () => {
    const menu = await mount();
    const style = getComputedStyle(trigger(menu, 0));
    expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-navigation-menu-trigger-padding-x'));
    expect(style.paddingTop).toBe(resolved('padding-top', '--nph-navigation-menu-trigger-padding-y'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-navigation-menu-trigger-radius'));
    expect(Number.parseFloat(style.columnGap)).toBe(px('--nph-navigation-menu-trigger-gap'));
    const arrow = q(menu, '.trigger-icon').getBoundingClientRect();
    expect(arrow.width).toBeCloseTo(px('--nph-navigation-menu-trigger-icon-size'), 0);
    expect(style.fontWeight).toBe('500');
    expect(style.fontSize).toBe('14px');
    expect(style.lineHeight).toBe('20px');
    expect(style.fontFamily).toContain('Noto Sans');
  });

  it('follows a new list of items with no leftover', async () => {
    const menu = await mount();
    menu.items = [ITEMS[2] as NphNavigationMenuItem];
    await menu.updateComplete;
    expect(topItems(menu)).toHaveLength(1);
    expect(qa(menu, '.panel')).toHaveLength(0);
  });
});

describe('the current page', () => {
  const withCurrent = (): NphNavigationMenuItem[] => [
    {
      type: 'trigger',
      label: 'Products',
      groups: [{ links: [{ title: 'Components', href: '#components', icon: 'file' }, { title: 'Tokens', href: '#tokens', current: true, icon: 'tag' }] }],
    },
    { label: 'Pricing', href: '#pricing', current: false },
    { label: 'Docs', href: '#docs' },
  ];

  it('a current top link carries aria-current page and the indicator', async () => {
    const menu = await mount({ items: [{ label: 'Pricing', href: '#pricing', current: true }, { label: 'Docs', href: '#docs' }] });
    const [current, other] = topItems(menu) as HTMLElement[];
    expect(current?.getAttribute('aria-current')).toBe('page');
    expect(current?.querySelector('.indicator')).not.toBeNull();
    expect(other?.hasAttribute('aria-current')).toBe(false);
    expect(other?.querySelector('.indicator')).toBeNull();
  });

  it('the indicator of a top item is its bottom edge, full width and current-indicator-width thick', async () => {
    const menu = await mount({ items: [{ label: 'Pricing', href: '#pricing', current: true }] });
    const item = topItems(menu)[0] as HTMLElement;
    const bar = item.querySelector('.indicator') as HTMLElement;
    const box = bar.getBoundingClientRect();
    const host = item.getBoundingClientRect();
    expect(box.width).toBeCloseTo(host.width, 0);
    expect(box.height).toBeCloseTo(px('--nph-navigation-menu-current-indicator-width'), 1);
    expect(box.bottom).toBeCloseTo(host.bottom, 0);
    expect(getComputedStyle(bar).backgroundColor).toBe(resolved('background-color', '--nph-navigation-menu-current-indicator-background'));
    expect(bar.getAttribute('aria-hidden')).toBe('true');
  });

  it('a current item shows the current text color, so the indicator never stands alone', async () => {
    const menu = await mount({ items: [{ label: 'Pricing', href: '#pricing', current: true }, { label: 'Docs', href: '#docs' }] });
    const [current, other] = topItems(menu) as HTMLElement[];
    expect(getComputedStyle(current as HTMLElement).color).toBe(resolved('color', '--nph-navigation-menu-current-foreground'));
    expect(getComputedStyle(other as HTMLElement).color).toBe(resolved('color', '--nph-navigation-menu-trigger-foreground'));
    expect(getComputedStyle(current as HTMLElement).color).not.toBe(getComputedStyle(other as HTMLElement).color);
  });

  it('a trigger that holds the current link is current too: aria-current true and the indicator', async () => {
    const menu = await mount({ items: withCurrent() });
    expect(trigger(menu, 0).getAttribute('aria-current')).toBe('true');
    expect(trigger(menu, 0).querySelector('.indicator')).not.toBeNull();
    expect(getComputedStyle(trigger(menu, 0)).color).toBe(resolved('color', '--nph-navigation-menu-current-foreground'));
  });

  it('the current panel link carries aria-current page, the start indicator, the current color and the solid icon', async () => {
    const menu = await mount({ items: withCurrent(), open: true });
    await settle(menu);
    const links = qa<HTMLAnchorElement>(menu, '#panel-0 .link');
    const [other, current] = links as [HTMLAnchorElement, HTMLAnchorElement];
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(other.hasAttribute('aria-current')).toBe(false);
    const bar = current.querySelector('.indicator') as HTMLElement;
    const box = bar.getBoundingClientRect();
    const host = current.getBoundingClientRect();
    expect(box.height).toBeCloseTo(host.height, 0);
    expect(box.width).toBeCloseTo(px('--nph-navigation-menu-current-indicator-width'), 1);
    expect(box.left).toBeCloseTo(host.left, 0);
    expect(getComputedStyle(current.querySelector('.title') as HTMLElement).color).toBe(resolved('color', '--nph-navigation-menu-current-foreground'));
    const icons = [other, current].map((link) => link.querySelector('nph-icon') as NphIcon);
    expect(icons.map((icon) => icon.variant)).toEqual(['light', 'solid']);
    expect(getComputedStyle(icons[1] as NphIcon).color).toBe(resolved('color', '--nph-navigation-menu-current-foreground'));
  });

  it('the indicator of the panel link goes to the right edge in right-to-left writing', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const menu = await mount({ items: withCurrent(), open: true });
    await settle(menu);
    const current = q(menu, '#panel-0 .link[data-current]');
    const bar = current.querySelector('.indicator') as HTMLElement;
    expect(bar.getBoundingClientRect().right).toBeCloseTo(current.getBoundingClientRect().right, 0);
  });

  it('a current item does not change on hover: the contract has no hover state for it', async () => {
    const menu = await mount({ items: [{ label: 'Pricing', href: '#pricing', current: true }] });
    await userEvent.hover(topItems(menu)[0] as HTMLElement);
    expect(getComputedStyle(topItems(menu)[0] as HTMLElement).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(topItems(menu)[0] as HTMLElement).color).toBe(resolved('color', '--nph-navigation-menu-current-foreground'));
  });

  it('the current panel link is a link named by its content', async () => {
    const menu = await mount({ items: withCurrent(), open: true });
    await settle(menu);
    const node = await axNode(q(menu, '#panel-0 .link[data-current]'));
    expect(node.role).toBe('link');
    expect(node.name).toBe('Tokens');
  });
});

describe('opening and closing', () => {
  it('a click opens the panel of the trigger: aria-expanded true and the panel in the top layer', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    expect(menu.open).toBe(true);
    expect(menu.active).toBe('products');
    expect(trigger(menu, 0).getAttribute('aria-expanded')).toBe('true');
    expect(shownPanels(menu)).toEqual(['panel-0']);
  });

  it('a second click closes it', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    await openByClick(menu, 0);
    expect(menu.open).toBe(false);
    expect(trigger(menu, 0).getAttribute('aria-expanded')).toBe('false');
    expect(shownPanels(menu)).toEqual([]);
  });

  it('only one panel is open at a time: a click on another trigger switches', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    await openByClick(menu, 1);
    expect(shownPanels(menu)).toEqual(['panel-1']);
    expect(trigger(menu, 0).getAttribute('aria-expanded')).toBe('false');
    expect(trigger(menu, 1).getAttribute('aria-expanded')).toBe('true');
    expect(menu.active).toBe('resources');
  });

  it('Enter and Space on a focused trigger open and close it', async () => {
    const menu = await mount();
    await userEvent.keyboard('{Tab}');
    expect(root(menu).activeElement).toBe(trigger(menu, 0));
    await userEvent.keyboard('{Enter}');
    await settle(menu);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    await userEvent.keyboard('{Enter}');
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
    await userEvent.keyboard(' ');
    await settle(menu);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    await userEvent.keyboard(' ');
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('Tab goes from the trigger into the links of the open panel, and back out to the next item', async () => {
    const menu = await mount();
    await userEvent.keyboard('{Tab}{Enter}');
    await settle(menu);
    await userEvent.keyboard('{Tab}');
    expect(root(menu).activeElement?.closest('.panel')?.id).toBe('panel-0');
    expect((root(menu).activeElement as HTMLElement).querySelector('.title')?.textContent).toBe('Components');
    await userEvent.keyboard('{Tab}{Tab}');
    expect((root(menu).activeElement as HTMLElement).querySelector('.title')?.textContent).toBe('Guides');
    await userEvent.keyboard('{Tab}');
    expect(root(menu).activeElement).toBe(trigger(menu, 1));
  });

  it('Esc closes the panel and gives the focus back to its trigger', async () => {
    const menu = await mount();
    await userEvent.keyboard('{Tab}{Enter}');
    await settle(menu);
    await userEvent.keyboard('{Tab}');
    expect(root(menu).activeElement?.closest('.panel')).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
    expect(menu.open).toBe(false);
    expect(root(menu).activeElement).toBe(trigger(menu, 0));
  });

  it('a click outside closes the panel', async () => {
    const outside = document.createElement('button');
    outside.textContent = 'Outside';
    document.body.append(outside);
    const menu = await mount();
    await openByClick(menu, 0);
    await userEvent.click(outside);
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('a click inside the panel, on its padding, keeps it open', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    const box = panel(menu, 0).getBoundingClientRect();
    await userEvent.click(panel(menu, 0), { position: { x: 1, y: Math.round(box.height / 2) } });
    await settle(menu);
    expect(shownPanels(menu)).toEqual(['panel-0']);
  });

  it('the focus leaving the bar closes the panel', async () => {
    const after = document.createElement('button');
    after.textContent = 'After';
    const menu = await mount({ items: [ITEMS[1] as NphNavigationMenuItem] });
    document.body.append(after);
    await userEvent.keyboard('{Tab}{Enter}');
    await settle(menu);
    await userEvent.keyboard('{Tab}{Tab}{Tab}');
    expect(document.activeElement).toBe(after);
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('following a link closes the panel and lets the click go on', async () => {
    const menu = await mount();
    const clicks: string[] = [];
    document.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        const anchor = event.composedPath()[0] as HTMLElement;
        if (anchor.closest('a')) clicks.push(anchor.closest('a')?.getAttribute('href') ?? '');
      },
      { capture: true, signal: listeners.signal },
    );
    await openByClick(menu, 0);
    await userEvent.click(q(menu, '#panel-0 .link'));
    await settle(menu);
    expect(clicks).toEqual(['#components']);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('`open` set by the consumer shows the first trigger that is not disabled', async () => {
    const items = [{ ...(ITEMS[0] as object), disabled: true }, ITEMS[1], ITEMS[2]] as NphNavigationMenuItem[];
    const menu = await mount({ items, open: true });
    expect(shownPanels(menu)).toEqual(['panel-1']);
    expect(trigger(menu, 1).getAttribute('aria-expanded')).toBe('true');
  });

  it('`open` with `active` shows the trigger that value names; an unknown value falls back to the first', async () => {
    const menu = await mount({ open: true, active: 'resources' });
    expect(shownPanels(menu)).toEqual(['panel-1']);
    menu.active = 'nowhere';
    await settle(menu);
    expect(shownPanels(menu)).toEqual(['panel-0']);
  });

  it('a trigger without a value is named by its index', async () => {
    const items = [{ type: 'trigger', label: 'A', groups: [{ links: [{ title: 'One', href: '#1' }] }] }, { type: 'trigger', label: 'B', groups: [{ links: [{ title: 'Two', href: '#2' }] }] }] as NphNavigationMenuItem[];
    const menu = await mount({ items, open: true, active: '1' });
    expect(shownPanels(menu)).toEqual(['panel-1']);
    await openByClick(menu, 0);
    expect(menu.active).toBe('0');
  });

  it('`open` with no trigger shows no panel', async () => {
    const menu = await mount({ items: [ITEMS[2] as NphNavigationMenuItem], open: true });
    expect(shownPanels(menu)).toEqual([]);
  });

  it('setting `open` back to false closes the panel', async () => {
    const menu = await mount({ open: true });
    menu.open = false;
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('a disabled trigger does not open and takes no focus', async () => {
    const items = [{ ...(ITEMS[0] as object), disabled: true }, ITEMS[2]] as NphNavigationMenuItem[];
    const menu = await mount({ items });
    expect(trigger(menu, 0).disabled).toBe(true);
    await userEvent.keyboard('{Tab}');
    expect(root(menu).activeElement).toBe(topItems(menu)[1]);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('a disabled link takes no focus and does not navigate', async () => {
    const menu = await mount({ items: [{ label: 'Off', href: '#off', disabled: true }, { label: 'On', href: '#on' }] });
    const off = topItems(menu)[0] as HTMLAnchorElement;
    expect(off.hasAttribute('href')).toBe(false);
    expect(off.getAttribute('aria-disabled')).toBe('true');
    await userEvent.keyboard('{Tab}');
    expect(root(menu).activeElement).toBe(topItems(menu)[1]);
  });
});

describe('the pointer', () => {
  it('resting on a trigger opens its panel after the hover delay, not a millisecond before', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    await elapse(menu, DELAY - 1);
    expect(shownPanels(menu)).toEqual([]);
    await elapse(menu, 1);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    expect(trigger(menu, 0).getAttribute('aria-expanded')).toBe('true');
  });

  it('the delay is the motion/hover-delay token', async () => {
    expect(resolved('transition-duration', '--nph-motion-hover-delay')).toBe('0.3s');
    expect(DELAY).toBe(300);
  });

  it('leaving the trigger closes the panel after the same wait, not a millisecond before', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    out(menu, 0);
    await elapse(menu, DELAY - 1);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    await elapse(menu, 1);
    expect(shownPanels(menu)).toEqual([]);
    expect(menu.open).toBe(false);
  });

  it('the panel stays open while the pointer is over it, and closes after the pointer leaves it', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    await elapse(menu, DELAY);
    /* From the trigger to the panel the pointer crosses the gap: it leaves the entry and comes back to it. */
    out(menu, 0);
    await elapse(menu, DELAY / 2);
    over(menu, 0);
    await elapse(menu, 10 * DELAY);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    out(menu, 0);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('a click on a panel the pointer opened keeps it open; a second click closes it', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    await elapse(menu, DELAY);
    mouseClick(trigger(menu, 0));
    await settle(menu);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    out(menu, 0);
    await elapse(menu, 10 * DELAY);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    mouseClick(trigger(menu, 0));
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('a panel opened by click stays open when the pointer leaves', async () => {
    useClock();
    const menu = await mount();
    mouseClick(trigger(menu, 0));
    await settle(menu);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    over(menu, 0);
    out(menu, 0);
    await elapse(menu, 10 * DELAY);
    expect(shownPanels(menu)).toEqual(['panel-0']);
  });

  it('moving from one trigger to another switches the panel', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    await elapse(menu, DELAY);
    out(menu, 0);
    over(menu, 1);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual(['panel-1']);
  });

  it('a link is not a trigger: resting on it opens nothing', async () => {
    useClock();
    const menu = await mount();
    over(menu, 2);
    await elapse(menu, 10 * DELAY);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('touch and pen do not open by hover: only the mouse does', async () => {
    useClock();
    const menu = await mount();
    for (const pointerType of ['touch', 'pen']) {
      entry(menu, 0).dispatchEvent(new PointerEvent('pointerenter', { pointerType }));
    }
    await elapse(menu, 10 * DELAY);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('a missing delay token opens at once and reports it once', async () => {
    useClock();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const menu = await mount();
    menu.style.setProperty('--nph-motion-hover-delay', 'soon');
    over(menu, 0);
    await elapse(menu, 1);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    out(menu, 0);
    over(menu, 1);
    await elapse(menu, 1);
    expect(shownPanels(menu)).toEqual(['panel-1']);
    expect(error.mock.calls.filter((call) => /motion\/hover-delay is not defined/.test(String(call[0])))).toHaveLength(1);
  });

  it('a real mouse opens the panel and closes it: it waits for the state, never for a time', async () => {
    const menu = await mount();
    menu.style.setProperty('--nph-motion-hover-delay', '40ms');
    await userEvent.hover(trigger(menu, 0));
    await vi.waitFor(() => expect(shownPanels(menu)).toEqual(['panel-0']), { timeout: 5000 });
    await userEvent.hover(document.body, { position: { x: 1, y: window.innerHeight - 2 } });
    await vi.waitFor(() => expect(shownPanels(menu)).toEqual([]), { timeout: 5000 });
    expect(menu.open).toBe(false);
  });
});

describe('the panel', () => {
  it('opens below its trigger, panel-offset away, aligned to its start edge', async () => {
    const menu = await mount();
    await openByClick(menu, 1);
    const box = panel(menu, 1).getBoundingClientRect();
    const anchor = trigger(menu, 1).getBoundingClientRect();
    expect(box.top - anchor.bottom).toBeCloseTo(px('--nph-navigation-menu-panel-offset'), 0);
    expect(box.left).toBeCloseTo(anchor.left, 0);
  });

  it('is a popover in the top layer: not clipped by an ancestor with overflow hidden', async () => {
    const box = document.createElement('div');
    box.style.cssText = 'overflow: hidden; block-size: 40px;';
    document.body.append(box);
    const menu = document.createElement('nph-navigation-menu');
    Object.assign(menu, { items: ITEMS, label: 'Main' });
    box.append(menu);
    await settle(menu);
    await openByClick(menu, 0);
    const rect = panel(menu, 0).getBoundingClientRect();
    expect(rect.bottom).toBeGreaterThan(box.getBoundingClientRect().bottom);
    const probe = document.elementFromPoint(rect.left + rect.width / 2, rect.bottom - 4);
    expect(probe).toBe(menu);
  });

  it('the wide panel hugs its content: two groups, each link panel-width wide, a vertical separator between them', async () => {
    /* Two groups of panel-width are wider than the narrow window of the runner. */
    const before = { width: window.innerWidth, height: window.innerHeight };
    await page.viewport(1200, 800);
    try {
      const menu = await mount();
      await openByClick(menu, 0);
      const links = qa(menu, '#panel-0 .link');
      expect(links).toHaveLength(3);
      for (const link of links) expect(link.getBoundingClientRect().width).toBeCloseTo(px('--nph-navigation-menu-panel-width'), 0);
      const groups = qa(menu, '#panel-0 .group');
      expect(groups).toHaveLength(2);
      const separators = qa(menu, '#panel-0 nph-separator');
      expect(separators).toHaveLength(1);
      expect(separators[0]?.getAttribute('orientation')).toBe('vertical');
      const [first, second] = groups.map((group) => group.getBoundingClientRect()) as [DOMRect, DOMRect];
      const line = (separators[0] as HTMLElement).getBoundingClientRect();
      expect(line.left).toBeGreaterThanOrEqual(first.right);
      expect(line.right).toBeLessThanOrEqual(second.left);
      expect(second.left - first.right).toBeCloseTo(2 * px('--nph-navigation-menu-group-gap') + line.width, 0);
      const shell = panel(menu, 0).getBoundingClientRect();
      const padding = px('--nph-navigation-menu-panel-padding');
      const border = px('--nph-navigation-menu-panel-border-width');
      expect(shell.width).toBeCloseTo(first.width + second.width + line.width + 2 * px('--nph-navigation-menu-group-gap') + 2 * padding + 2 * border, 0);
    } finally {
      await page.viewport(before.width, before.height);
    }
  });

  it('in a window narrower than the panel, the groups shrink to fit it and keep to one row', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    const shell = panel(menu, 0).getBoundingClientRect();
    expect(shell.width).toBeLessThanOrEqual(document.documentElement.clientWidth + 0.5);
    for (const group of qa(menu, '#panel-0 .group')) {
      expect(group.getBoundingClientRect().right).toBeLessThanOrEqual(shell.right);
    }
  });

  it('a panel with one group draws no separator and hugs its single column', async () => {
    const menu = await mount();
    await openByClick(menu, 1);
    expect(qa(menu, '#panel-1 nph-separator')).toHaveLength(0);
    const shell = panel(menu, 1).getBoundingClientRect();
    expect(shell.width).toBeCloseTo(px('--nph-navigation-menu-panel-width') + 2 * px('--nph-navigation-menu-panel-padding') + 2 * px('--nph-navigation-menu-panel-border-width'), 0);
  });

  it('the surface: panel-background, panel-border, panel-radius, padding and the dropdown elevation', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    const style = getComputedStyle(panel(menu, 0));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-navigation-menu-panel-background'));
    expect(style.borderTopColor).toBe(resolved('border-top-color', '--nph-navigation-menu-panel-border'));
    expect(Number.parseFloat(style.borderTopWidth)).toBe(px('--nph-navigation-menu-panel-border-width'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-navigation-menu-panel-radius'));
    expect(Number.parseFloat(style.paddingTop)).toBe(px('--nph-navigation-menu-panel-padding'));
    expect(style.boxShadow).toBe(resolved('box-shadow', '--nph-elevation-dropdown'));
  });

  it('a group label is text/label-sm in the muted color; a group without a label has none', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    const labels = qa(menu, '#panel-0 .group-label');
    expect(labels.map((label) => label.textContent)).toEqual(['Build', 'Manage']);
    const style = getComputedStyle(labels[0] as HTMLElement);
    expect(style.color).toBe(resolved('color', '--nph-navigation-menu-item-description-foreground'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-sm-font-weight'));
    expect(qa(menu, '#panel-1 .group-label')).toHaveLength(0);
    const group = labels[0]?.closest('.group') as HTMLElement;
    expect(group.getAttribute('role')).toBe('group');
    expect((await axNode(group)).name).toBe('Build');
  });

  it('a panel link: title, description and icon, with the padding, gap and radius of its tokens', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    const link = q(menu, '#panel-0 .link');
    const style = getComputedStyle(link);
    expect(style.paddingTop).toBe(resolved('padding-top', '--nph-navigation-menu-item-padding'));
    expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-navigation-menu-item-padding'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-navigation-menu-item-radius'));
    expect(Number.parseFloat(style.columnGap)).toBe(px('--nph-navigation-menu-item-gap'));
    const icon = link.querySelector('nph-icon') as NphIcon;
    expect(icon.getBoundingClientRect().width).toBeCloseTo(px('--nph-navigation-menu-item-icon-size'), 0);
    expect(getComputedStyle(icon).color).toBe(resolved('color', '--nph-navigation-menu-item-icon-foreground'));
    const title = link.querySelector('.title') as HTMLElement;
    const description = link.querySelector('.description') as HTMLElement;
    expect(getComputedStyle(title).color).toBe(resolved('color', '--nph-navigation-menu-item-title-foreground'));
    expect(getComputedStyle(title).fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(getComputedStyle(description).color).toBe(resolved('color', '--nph-navigation-menu-item-description-foreground'));
    expect(getComputedStyle(description).fontSize).toBe(resolved('font-size', '--nph-text-body-sm-font-size'));
    expect(description.getBoundingClientRect().top - title.getBoundingClientRect().bottom).toBeCloseTo(px('--nph-navigation-menu-item-text-gap'), 0);
  });

  it('a link without description or icon draws neither', async () => {
    const menu = await mount();
    await openByClick(menu, 1);
    const link = q(menu, '#panel-1 .link');
    expect(link.querySelector('nph-icon')).toBeNull();
    expect(link.querySelector('.description')).toBeNull();
  });

  it('the icon is light at rest and decorative, and the link is named by its content: the title and the description', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    const link = q(menu, '#panel-0 .link');
    const icon = link.querySelector('nph-icon') as NphIcon;
    expect(icon.variant).toBe('light');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    const node = await axNode(link);
    expect(node.role).toBe('link');
    expect(node.name).toBe('Components Reusable blocks');
  });

  it('on hover a panel link takes the item background, the accent title and the accent icon', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    const link = q(menu, '#panel-0 .link');
    await userEvent.hover(link);
    expect(getComputedStyle(link).backgroundColor).toBe(resolved('background-color', '--nph-navigation-menu-item-background-hover'));
    expect(getComputedStyle(link.querySelector('.title') as HTMLElement).color).toBe(resolved('color', '--nph-navigation-menu-item-title-foreground-hover'));
    expect(getComputedStyle(link.querySelector('nph-icon') as HTMLElement).color).toBe(resolved('color', '--nph-navigation-menu-item-icon-foreground-hover'));
  });

  it('a disabled panel link loses opacity, takes no focus and has no hover', async () => {
    const menu = await mount({
      items: [{ type: 'trigger', label: 'A', groups: [{ links: [{ title: 'Off', href: '#off', disabled: true }, { title: 'On', href: '#on' }] }] }],
      open: true,
    });
    await settle(menu);
    const [off, on] = qa<HTMLAnchorElement>(menu, '#panel-0 .link') as [HTMLAnchorElement, HTMLAnchorElement];
    expect(getComputedStyle(off).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(off.getAttribute('aria-disabled')).toBe('true');
    expect(off.hasAttribute('href')).toBe(false);
    await userEvent.hover(off);
    expect(getComputedStyle(off).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await userEvent.keyboard('{Tab}{Tab}');
    expect(root(menu).activeElement).toBe(on);
  });

  it('a long title and description are cut on one line, and the link keeps its width', async () => {
    const long = 'A title so long that it goes well past the width of the panel link and has to be cut right there';
    const menu = await mount({
      items: [{ type: 'trigger', label: 'A', groups: [{ links: [{ title: long, href: '#a', description: long, icon: 'file' }] }] }],
      open: true,
    });
    await settle(menu);
    const link = q(menu, '#panel-0 .link');
    expect(link.getBoundingClientRect().width).toBeCloseTo(px('--nph-navigation-menu-panel-width'), 0);
    for (const part of ['.title', '.description']) {
      const element = link.querySelector(part) as HTMLElement;
      expect(element.textContent).toBe(long);
      expect(getComputedStyle(element).textOverflow, part).toBe('ellipsis');
      expect(getComputedStyle(element).whiteSpace, part).toBe('nowrap');
      expect(element.scrollWidth, part).toBeGreaterThan(element.clientWidth);
      expect(element.getBoundingClientRect().height, part).toBeCloseTo(px(part === '.title' ? '--nph-text-label-md-line-height' : '--nph-text-body-sm-line-height'), 0);
    }
  });

  it('never leaves the window sideways: a trigger near the right edge keeps its panel inside', async () => {
    const menu = await mount();
    menu.style.cssText = 'display: block; margin-inline-start: calc(100vw - 120px);';
    await settle(menu);
    await openByClick(menu, 0);
    const box = panel(menu, 0).getBoundingClientRect();
    expect(box.right).toBeLessThanOrEqual(document.documentElement.clientWidth + 0.5);
    expect(box.left).toBeGreaterThanOrEqual(0);
  });

  it('follows the trigger when the page scrolls', async () => {
    const spacer = document.createElement('div');
    spacer.style.blockSize = '3000px';
    const menu = await mount();
    document.body.append(spacer);
    await openByClick(menu, 0);
    const before = panel(menu, 0).getBoundingClientRect().top - trigger(menu, 0).getBoundingClientRect().bottom;
    window.scrollTo(0, 10);
    await frame();
    await frame();
    const after = panel(menu, 0).getBoundingClientRect().top - trigger(menu, 0).getBoundingClientRect().bottom;
    window.scrollTo(0, 0);
    expect(after).toBeCloseTo(before, 0);
  });

  it('opens from the start edge in right-to-left writing', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const menu = await mount();
    await openByClick(menu, 1);
    const box = panel(menu, 1).getBoundingClientRect();
    const anchor = trigger(menu, 1).getBoundingClientRect();
    expect(box.right).toBeCloseTo(anchor.right, 0);
  });
});

describe('the narrow width', () => {
  it('draws the Menu button instead of the bar: no top items, a native button named by menu-label', async () => {
    const menu = await mount({ narrow: true });
    expect(topItems(menu)).toHaveLength(0);
    const button = menuButton(menu);
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('aria-label')).toBe('Menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe('panel-list');
    const node = await axNode(button);
    expect(node.role).toBe('button');
    expect(node.name).toBe('Menu');
  });

  it('the Menu button carries the bars icon, decorative, and a tooltip with its name', async () => {
    const menu = await mount({ narrow: true });
    const icon = menuButton(menu).querySelector('nph-icon') as NphIcon;
    expect(icon.name).toBe('bars');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    const tip = q(menu, 'nph-tooltip') as HTMLElement & { relation: string; text: string };
    expect(tip.getAttribute('for')).toBe('menu-button');
    expect(tip.relation).toBe('name');
    expect(tip.text).toBe('Menu');
  });

  it('the Menu button is control/height-default square, radius/control, ghost at rest', async () => {
    const menu = await mount({ narrow: true });
    const box = menuButton(menu).getBoundingClientRect();
    expect(box.width).toBe(px('--nph-control-height-default'));
    expect(box.height).toBe(px('--nph-control-height-default'));
    const style = getComputedStyle(menuButton(menu));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-control'));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.color).toBe(resolved('color', '--nph-color-secondary-foreground'));
    expect(box.width).toBeGreaterThan(24);
  });

  it('on hover and while open the Menu button takes the ghost hover background of the nph-icon-button', async () => {
    const menu = await mount({ narrow: true });
    await userEvent.hover(menuButton(menu));
    expect(getComputedStyle(menuButton(menu)).backgroundColor).toBe(resolved('background-color', '--nph-icon-button-secondary-ghost-background-hover'));
    await userEvent.click(menuButton(menu));
    await userEvent.hover(document.body, { position: { x: 1, y: window.innerHeight - 2 } });
    expect(getComputedStyle(menuButton(menu)).backgroundColor).toBe(resolved('background-color', '--nph-icon-button-secondary-ghost-background-hover'));
  });

  it('a click opens the list: aria-expanded true; a second click closes it', async () => {
    const menu = await mount({ narrow: true });
    await userEvent.click(menuButton(menu));
    await settle(menu);
    expect(menu.open).toBe(true);
    expect(menuButton(menu).getAttribute('aria-expanded')).toBe('true');
    expect(shownPanels(menu)).toEqual(['panel-list']);
    await userEvent.click(menuButton(menu));
    await settle(menu);
    expect(menu.open).toBe(false);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('the list is panel-width wide and opens below the Menu button, aligned to its start edge', async () => {
    const menu = await mount({ narrow: true, open: true });
    await settle(menu);
    const box = list(menu).getBoundingClientRect();
    expect(box.width).toBeCloseTo(px('--nph-navigation-menu-panel-width'), 0);
    const anchor = menuButton(menu).getBoundingClientRect();
    expect(box.top - anchor.bottom).toBeCloseTo(px('--nph-navigation-menu-panel-offset'), 0);
    expect(box.left).toBeCloseTo(anchor.left, 0);
  });

  it('lists the same items vertically: each trigger as a group with its label, the top links together', async () => {
    const menu = await mount({
      narrow: true,
      open: true,
      items: [
        { label: 'Home', href: '#home' },
        { label: 'Pricing', href: '#pricing', current: true },
        ITEMS[0] as NphNavigationMenuItem,
        ITEMS[1] as NphNavigationMenuItem,
      ],
    });
    await settle(menu);
    const sections = inside(list(menu), '.section');
    expect(sections).toHaveLength(3);
    expect(inside(sections[0] as HTMLElement, '.link .title').map((title) => title.textContent)).toEqual(['Home', 'Pricing']);
    expect(inside(sections[1] as HTMLElement, '.group-label').map((label) => label.textContent)).toEqual(['Products', 'Build', 'Manage']);
    expect(inside(sections[1] as HTMLElement, '.link .title').map((title) => title.textContent)).toEqual(['Components', 'Tokens', 'Guides']);
    expect(inside(sections[2] as HTMLElement, '.group-label').map((label) => label.textContent)).toEqual(['Resources']);
    expect(inside(list(menu), ':scope > .list > nph-separator')).toHaveLength(2);
    expect((await axNode(sections[1] as HTMLElement)).name).toBe('Products');
  });

  it('the current link is marked in the list, and the list links are as wide as the panel', async () => {
    const menu = await mount({ narrow: true, open: true, items: [{ label: 'Pricing', href: '#pricing', current: true }, ITEMS[1] as NphNavigationMenuItem] });
    await settle(menu);
    const current = q(menu, '#panel-list .link[data-current]');
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(current.querySelector('.indicator')).not.toBeNull();
    const inner = list(menu).getBoundingClientRect().width - 2 * px('--nph-navigation-menu-panel-padding') - 2 * px('--nph-navigation-menu-panel-border-width');
    expect(current.getBoundingClientRect().width).toBeCloseTo(inner, 0);
  });

  it('Esc closes the list and gives the focus back to the Menu button', async () => {
    const menu = await mount({ narrow: true });
    await userEvent.keyboard('{Tab}{Enter}');
    await settle(menu);
    expect(shownPanels(menu)).toEqual(['panel-list']);
    await userEvent.keyboard('{Tab}');
    expect(root(menu).activeElement?.closest('.panel')?.id).toBe('panel-list');
    await userEvent.keyboard('{Escape}');
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
    expect(root(menu).activeElement).toBe(menuButton(menu));
  });

  it('following a link of the list closes it', async () => {
    document.addEventListener('click', (event) => event.preventDefault(), { capture: true, signal: listeners.signal });
    const menu = await mount({ narrow: true, open: true });
    await settle(menu);
    await userEvent.click(q(menu, '#panel-list .link'));
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('a bar that changes width while open closes', async () => {
    const menu = await mount({ open: true });
    expect(shownPanels(menu)).toEqual(['panel-0']);
    menu.narrow = true;
    await settle(menu);
    expect(menu.open).toBe(false);
    expect(shownPanels(menu)).toEqual([]);
    menu.open = true;
    await settle(menu);
    expect(shownPanels(menu)).toEqual(['panel-list']);
    menu.narrow = false;
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('the focus ring of the Menu button: border and halo outside, by keyboard only', async () => {
    const menu = await mount({ narrow: true });
    await userEvent.click(menuButton(menu));
    await userEvent.click(menuButton(menu));
    expect(getComputedStyle(menuButton(menu), '::before').content).toBe('none');
    await userEvent.keyboard('{Tab}');
    await userEvent.hover(document.body, { position: { x: 1, y: window.innerHeight - 2 } });
    menuButton(menu).blur();
    await userEvent.keyboard('{Tab}');
    expect(root(menu).activeElement).toBe(menuButton(menu));
    const border = getComputedStyle(menuButton(menu), '::before');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
    const halo = getComputedStyle(menuButton(menu), '::after');
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
  });
});

describe('colors and states of the top item', () => {
  it('at rest: trigger-foreground and no background', async () => {
    const menu = await mount();
    const style = getComputedStyle(topItems(menu)[0] as HTMLElement);
    expect(style.color).toBe(resolved('color', '--nph-navigation-menu-trigger-foreground'));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('on hover a trigger and a link take trigger-background-hover and trigger-foreground-hover', async () => {
    const menu = await mount();
    for (const index of [1, 2]) {
      const item = topItems(menu)[index] as HTMLElement;
      await userEvent.hover(item);
      await userEvent.hover(item);
      expect(getComputedStyle(item).backgroundColor, String(index)).toBe(resolved('background-color', '--nph-navigation-menu-trigger-background-hover'));
      expect(getComputedStyle(item).color, String(index)).toBe(resolved('color', '--nph-navigation-menu-trigger-foreground-hover'));
    }
  });

  it('the open trigger keeps the hover look with the pointer away', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    await userEvent.hover(document.body, { position: { x: 1, y: window.innerHeight - 2 } });
    const style = getComputedStyle(trigger(menu, 0));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-navigation-menu-trigger-background-hover'));
    expect(style.color).toBe(resolved('color', '--nph-navigation-menu-trigger-foreground-hover'));
  });

  it('disabled: state/disabled-opacity on the whole item and no hover', async () => {
    const menu = await mount({ items: [{ label: 'Off', href: '#off', disabled: true }, { type: 'trigger', label: 'T', disabled: true, groups: [{ links: [{ title: 'One', href: '#1' }] }] }] });
    for (const item of topItems(menu)) {
      expect(getComputedStyle(item).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
      await userEvent.hover(item).catch(() => {});
      expect(getComputedStyle(item).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    }
  });

  it('is theme-aware: the colors follow data-nph-color-scheme', async () => {
    const menu = await mount({ items: [{ label: 'Pricing', href: '#pricing', current: true }] });
    const light = getComputedStyle(topItems(menu)[0] as HTMLElement).color;
    document.body.setAttribute('data-nph-color-scheme', 'dark');
    const dark = getComputedStyle(topItems(menu)[0] as HTMLElement).color;
    expect(dark).not.toBe(light);
  });

  it('the open panel takes the scheme of its ancestor too', async () => {
    document.body.setAttribute('data-nph-color-scheme', 'dark');
    const menu = await mount({ open: true });
    await settle(menu);
    const dark = getComputedStyle(panel(menu, 0)).backgroundColor;
    document.body.setAttribute('data-nph-color-scheme', 'light');
    expect(getComputedStyle(panel(menu, 0)).backgroundColor).not.toBe(dark);
  });
});

describe('focus', () => {
  it('keyboard focus on a top item: the focus border and the halo outside, with the radii of the control', async () => {
    const menu = await mount();
    await userEvent.keyboard('{Tab}');
    const item = trigger(menu, 0);
    expect(root(menu).activeElement).toBe(item);
    const border = getComputedStyle(item, '::before');
    const halo = getComputedStyle(item, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(Number.parseFloat(border.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(Number.parseFloat(halo.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
    expect(Number.parseFloat(border.top)).toBeCloseTo(-px('--nph-border-width'), 1);
    expect(getComputedStyle(item).color).toBe(resolved('color', '--nph-navigation-menu-trigger-foreground'));
  });

  it('keyboard focus on a panel link: the same border and halo, with the radii of the inner item', async () => {
    const menu = await mount();
    await userEvent.keyboard('{Tab}{Enter}');
    await settle(menu);
    await userEvent.keyboard('{Tab}');
    const link = root(menu).activeElement as HTMLElement;
    expect(link.classList.contains('link')).toBe(true);
    const border = getComputedStyle(link, '::before');
    const halo = getComputedStyle(link, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-inner'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-inner-with-border'));
  });

  it('a current item in focus keeps the current text and the indicator and adds the ring', async () => {
    const menu = await mount({ items: [{ label: 'Pricing', href: '#pricing', current: true }] });
    await userEvent.keyboard('{Tab}');
    const item = topItems(menu)[0] as HTMLElement;
    expect(root(menu).activeElement).toBe(item);
    expect(getComputedStyle(item).color).toBe(resolved('color', '--nph-navigation-menu-current-foreground'));
    expect(item.querySelector('.indicator')).not.toBeNull();
    expect(getComputedStyle(item, '::before').borderTopColor).toBe(resolved('color', '--nph-focus-border'));
  });

  it('a mouse click gives no focus ring', async () => {
    const menu = await mount();
    await userEvent.click(trigger(menu, 0));
    expect(getComputedStyle(trigger(menu, 0), '::before').content).toBe('none');
  });

  it('a disabled item shows no ring', async () => {
    const menu = await mount({ items: [{ label: 'Off', href: '#off', disabled: true }] });
    expect(getComputedStyle(topItems(menu)[0] as HTMLElement, '::before').content).toBe('none');
  });
});

describe('regressions of the Copilot review', () => {
  it('an instance that is removed and put back while open draws its panel again', async () => {
    const menu = await mount({ open: true });
    expect(shownPanels(menu)).toEqual(['panel-0']);
    menu.remove();
    document.body.append(menu);
    await settle(menu);
    await frame();
    expect(menu.open).toBe(true);
    expect(trigger(menu, 0).getAttribute('aria-expanded')).toBe('true');
    expect(shownPanels(menu)).toEqual(['panel-0']);
  });

  it('a hover wait that is running when the width changes does not open the narrow list', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    menu.narrow = true;
    await settle(menu);
    await elapse(menu, 10 * DELAY);
    expect(menu.open).toBe(false);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('`active` that names a disabled trigger shows no panel', async () => {
    const items = [{ ...(ITEMS[0] as object), disabled: true }, ITEMS[1], ITEMS[2]] as NphNavigationMenuItem[];
    const menu = await mount({ items, open: true, active: 'products' });
    expect(shownPanels(menu)).toEqual([]);
    expect(trigger(menu, 0).getAttribute('aria-expanded')).toBe('false');
  });

  it('a trigger disabled while its panel is open closes it', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    menu.items = [{ ...(ITEMS[0] as object), disabled: true }, ITEMS[1], ITEMS[2]] as NphNavigationMenuItem[];
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('resting the mouse on a disabled trigger opens nothing', async () => {
    useClock();
    const items = [{ ...(ITEMS[0] as object), disabled: true }, ITEMS[2]] as NphNavigationMenuItem[];
    const menu = await mount({ items });
    over(menu, 0);
    await elapse(menu, 10 * DELAY);
    expect(shownPanels(menu)).toEqual([]);
    expect(menu.open).toBe(false);
  });

  it('a narrow list taller than the room below the button scrolls inside, and keeps its links reachable', async () => {
    const links = Array.from({ length: 30 }, (_, index) => ({ title: `Link ${String(index)}`, href: `#l${String(index)}` }));
    const items = [{ type: 'trigger', label: 'Many', groups: [{ links }] }] as NphNavigationMenuItem[];
    const menu = await mount({ items, narrow: true, open: true });
    await settle(menu);
    await frame();
    const box = list(menu).getBoundingClientRect();
    expect(box.bottom).toBeLessThanOrEqual(document.documentElement.clientHeight + 0.5);
    expect(getComputedStyle(list(menu)).overflowY).toBe('auto');
    expect(list(menu).scrollHeight).toBeGreaterThan(list(menu).clientHeight);
    list(menu).scrollTop = list(menu).scrollHeight;
    expect(list(menu).scrollTop).toBeGreaterThan(0);
  });

  it('a panel that fits does not scroll', async () => {
    const menu = await mount({ open: true });
    await settle(menu);
    expect(getComputedStyle(panel(menu, 0)).overflowY).toBe('visible');
    expect(panel(menu, 0).style.maxHeight).toBe('');
  });

  it('the links of a disabled trigger are disabled in the narrow list, and a disabled link of its own stays so', async () => {
    const items = [
      { type: 'trigger', label: 'Off', disabled: true, groups: [{ links: [{ title: 'One', href: '#1' }, { title: 'Two', href: '#2', disabled: true }] }] },
      ITEMS[1],
    ] as NphNavigationMenuItem[];
    const menu = await mount({ items, narrow: true, open: true });
    await settle(menu);
    const [one, two, docs] = qa<HTMLAnchorElement>(menu, '#panel-list .link') as [HTMLAnchorElement, HTMLAnchorElement, HTMLAnchorElement];
    for (const link of [one, two]) {
      expect(link.getAttribute('aria-disabled')).toBe('true');
      expect(link.hasAttribute('href')).toBe(false);
    }
    expect(docs.hasAttribute('href')).toBe(true);
    await userEvent.keyboard('{Tab}{Tab}');
    expect(root(menu).activeElement).toBe(docs);
  });
});

describe('regressions of the Copilot review, round 2', () => {
  it('a hover wait follows its trigger when the items are reordered, and opens nothing if it is gone', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    menu.items = [ITEMS[1], ITEMS[0], ITEMS[2]] as NphNavigationMenuItem[];
    await settle(menu);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual(['panel-1']);
    expect(menu.active).toBe('products');
    menu.open = false;
    out(menu, 1);
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
    over(menu, 1);
    menu.items = [ITEMS[1], ITEMS[2]] as NphNavigationMenuItem[];
    await settle(menu);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('a hover wait on a trigger that is disabled before it ends opens nothing', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    menu.items = [{ ...(ITEMS[0] as object), disabled: true }, ITEMS[1], ITEMS[2]] as NphNavigationMenuItem[];
    await settle(menu);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('a panel the pointer opened stays while a link inside has the focus, even if the pointer leaves', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    q(menu, '#panel-0 .link').focus();
    expect(root(menu).activeElement?.closest('.panel')?.id).toBe('panel-0');
    out(menu, 0);
    await elapse(menu, 10 * DELAY);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    expect(root(menu).activeElement?.closest('.panel')?.id).toBe('panel-0');
  });

  it('the focus leaving the bar with no new target closes the panel', async () => {
    const menu = await mount();
    await openByClick(menu, 0);
    (trigger(menu, 0) as HTMLElement).focus();
    (root(menu).activeElement as HTMLElement).blur();
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('the first Esc closes only the panel and leaves a modal dialog around the bar open', async () => {
    const dialog = document.createElement('dialog');
    document.body.append(dialog);
    const menu = document.createElement('nph-navigation-menu');
    Object.assign(menu, { items: ITEMS, label: 'Main' });
    dialog.append(menu);
    dialog.showModal();
    await settle(menu);
    await openByClick(menu, 0);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    await userEvent.keyboard('{Escape}');
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
    expect(dialog.open).toBe(true);
    dialog.close();
  });

  it('follows the trigger when a scroller inside another shadow root scrolls', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const outer = host.attachShadow({ mode: 'open' });
    const scroller = document.createElement('div');
    scroller.style.cssText = 'overflow: auto; block-size: 300px;';
    const spacer = document.createElement('div');
    spacer.style.blockSize = '2000px';
    const menu = document.createElement('nph-navigation-menu');
    Object.assign(menu, { items: ITEMS, label: 'Main' });
    scroller.append(menu, spacer);
    outer.append(scroller);
    await settle(menu);
    await openByClick(menu, 0);
    const gap = () => panel(menu, 0).getBoundingClientRect().top - trigger(menu, 0).getBoundingClientRect().bottom;
    const before = gap();
    scroller.scrollTop = 12;
    await frame();
    await frame();
    expect(gap()).toBeCloseTo(before, 0);
  });
});

describe('regressions of the Copilot review, round 3', () => {
  it('hovering another trigger does not take away the panel that holds the keyboard focus', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    await elapse(menu, DELAY);
    q(menu, '#panel-0 .link').focus();
    expect(root(menu).activeElement?.closest('.panel')?.id).toBe('panel-0');
    out(menu, 0);
    over(menu, 1);
    await elapse(menu, 10 * DELAY);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    expect(root(menu).activeElement?.closest('.panel')?.id).toBe('panel-0');
  });

  it('passing over a disabled trigger does not cancel the close of the panel the pointer left', async () => {
    useClock();
    const items = [ITEMS[0], { ...(ITEMS[1] as object), disabled: true }, ITEMS[2]] as NphNavigationMenuItem[];
    const menu = await mount({ items });
    over(menu, 0);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    out(menu, 0);
    over(menu, 1);
    await elapse(menu, DELAY / 2);
    out(menu, 1);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual([]);
  });

  it('a close that is running follows its trigger when the items are reordered', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    out(menu, 0);
    menu.items = [ITEMS[1], ITEMS[0], ITEMS[2]] as NphNavigationMenuItem[];
    await settle(menu);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual([]);
    expect(menu.open).toBe(false);
  });

  it('a close that is running closes when its trigger is removed', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    await elapse(menu, DELAY);
    out(menu, 0);
    menu.items = [ITEMS[1], ITEMS[2]] as NphNavigationMenuItem[];
    await settle(menu);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual([]);
    expect(menu.open).toBe(false);
  });

  it('items that become invalid during a hover wait cancel it, and no error is thrown', async () => {
    useClock();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    for (const bad of [null, [null]]) {
      /* The update that rejects the data comes first, as it does in the browser, where a microtask runs before a timer. */
      const menu = await mount();
      over(menu, 0);
      menu.items = bad as never;
      await menu.updateComplete;
      await elapse(menu, 10 * DELAY);
      menu.items = ITEMS;
      await settle(menu);
      expect(shownPanels(menu), String(bad)).toEqual([]);
      expect(menu.open, String(bad)).toBe(false);
      menu.remove();
    }
    expect(error).toHaveBeenCalled();
  });

  it('a hover wait that fires before the update that rejects the items reads nothing it cannot read', async () => {
    useClock();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const menu = await mount();
    over(menu, 0);
    menu.items = [null] as never;
    /* No await: the timer runs on the data the validation has not seen yet. */
    expect(() => vi.advanceTimersByTime(10 * DELAY)).not.toThrow();
    await settle(menu);
    expect(shownPanels(menu)).toEqual([]);
  });
});

describe('regressions of the Copilot review, round 4', () => {
  it('a close that is running does not close the panel the consumer selected meanwhile', async () => {
    useClock();
    const menu = await mount();
    over(menu, 0);
    await elapse(menu, DELAY);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    out(menu, 0);
    menu.active = 'resources';
    menu.items = [ITEMS[1], ITEMS[2]] as NphNavigationMenuItem[];
    await settle(menu);
    await elapse(menu, DELAY);
    expect(menu.open).toBe(true);
    expect(shownPanels(menu)).toEqual(['panel-0']);
    expect(trigger(menu, 0).textContent).toContain('Resources');
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  /** The 31 `navigation-menu/*` tokens of the evidence. */
  const NAVIGATION_MENU_TOKENS = [
    'trigger-foreground',
    'trigger-background-hover',
    'trigger-foreground-hover',
    'trigger-padding-x',
    'trigger-padding-y',
    'trigger-gap',
    'trigger-radius',
    'trigger-icon-size',
    'bar-gap',
    'panel-offset',
    'panel-background',
    'panel-border',
    'panel-border-width',
    'panel-radius',
    'panel-padding',
    'panel-width',
    'group-gap',
    'item-background-hover',
    'item-title-foreground',
    'item-title-foreground-hover',
    'item-description-foreground',
    'item-padding',
    'item-gap',
    'item-text-gap',
    'item-radius',
    'item-icon-size',
    'item-icon-foreground',
    'item-icon-foreground-hover',
    'current-foreground',
    'current-indicator-background',
    'current-indicator-width',
  ].map((name) => `--nph-navigation-menu-${name}`);

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('consumes the 31 navigation-menu tokens of the evidence, and the global ones the evidence names', () => {
    for (const name of NAVIGATION_MENU_TOKENS) {
      expect(used, name).toContain(name);
    }
    expect(NAVIGATION_MENU_TOKENS).toHaveLength(31);
    for (const name of [
      '--nph-focus-border',
      '--nph-border-width',
      '--nph-focus-halo',
      '--nph-focus-ring-width',
      '--nph-focus-border-radius-control',
      '--nph-focus-radius-control-with-border',
      '--nph-focus-border-radius-inner',
      '--nph-focus-radius-inner-with-border',
      '--nph-state-disabled-opacity',
      '--nph-elevation-dropdown',
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
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/);
  });

  it('the tokens resolve to what the evidence says', () => {
    expect(px('--nph-navigation-menu-panel-width')).toBe(280);
    expect(px('--nph-navigation-menu-current-indicator-width')).toBe(2);
  });
});
