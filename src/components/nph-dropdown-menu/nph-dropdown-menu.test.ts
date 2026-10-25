/**
 * Tests of `nph-dropdown-menu` (P92), in a real browser (P21, item 5): the top layer, the
 * placement, real hover, keyboard focus and measures only exist where there is layout.
 *
 * They prove the contract accepted in Figma (board `1365:118`, menu `1365:63`, item set
 * `1365:57`, parts `1365:58`, `1365:60` and `2359:47364`), recorded in the evidence of the
 * `figma-docs-accepted` gate of DSA-45: the API, the invalid input, the trigger, opening and
 * closing, the keyboard, the activation and its event, the roles and names the browser
 * computes, the colors at rest and on hover, the solid icon on hover, the measures, the
 * placement and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-dropdown-menu.css?raw';
import { NPH_DROPDOWN_MENU_SIZES, NphDropdownMenu, groupsOf } from './nph-dropdown-menu';
import type { NphDropdownMenuEntry, NphDropdownMenuItemSelectDetail } from './nph-dropdown-menu';
import '../nph-button/nph-button';

beforeAll(async () => {
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

const ITEMS: NphDropdownMenuEntry[] = [
  { value: 'rename', text: 'Rename', icon: 'pen-to-square' },
  { value: 'duplicate', text: 'Duplicate', icon: 'share', shortcut: '⌘D' },
  { type: 'separator' },
  { value: 'delete', text: 'Delete', icon: 'trash', severity: 'destructive' },
];

interface Setup {
  menu: NphDropdownMenu;
  trigger: HTMLButtonElement;
}

async function mount(items: NphDropdownMenuEntry[] = ITEMS, props: Partial<NphDropdownMenu> = {}): Promise<Setup> {
  const trigger = document.createElement('button');
  trigger.id = 'actions';
  trigger.type = 'button';
  trigger.textContent = 'Actions';
  const menu = document.createElement('nph-dropdown-menu');
  menu.setAttribute('for', 'actions');
  menu.items = items;
  Object.assign(menu, props);
  document.body.append(trigger, menu);
  await menu.updateComplete;
  return { menu, trigger };
}

async function settle(menu: NphDropdownMenu): Promise<void> {
  await menu.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
}

const panel = (menu: NphDropdownMenu): HTMLElement => menu.shadowRoot?.querySelector('.panel') as HTMLElement;
const items = (menu: NphDropdownMenu): HTMLElement[] => [...(menu.shadowRoot?.querySelectorAll<HTMLElement>('.item') ?? [])];
const itemOf = (menu: NphDropdownMenu, value: string): HTMLElement => {
  const index = menu.items.findIndex((entry) => 'value' in entry && entry.value === value);
  return menu.shadowRoot?.querySelector(`.item[data-index="${index}"]`) as HTMLElement;
};
const active = (menu: NphDropdownMenu): Element | null => menu.shadowRoot?.activeElement ?? null;
const shown = (menu: NphDropdownMenu): boolean => panel(menu)?.matches(':popover-open') ?? false;

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));

/** The node the browser itself builds for an element in its accessibility tree (as in `nph-checkbox`). */
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

function events(menu: NphDropdownMenu): NphDropdownMenuItemSelectDetail[] {
  const seen: NphDropdownMenuItemSelectDetail[] = [];
  menu.addEventListener('nph-item-select', (event) => seen.push(event.detail));
  return seen;
}

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-dropdown-menu')).toBe(NphDropdownMenu);
    expect(document.createElement('nph-dropdown-menu')).toBeInstanceOf(NphDropdownMenu);
  });

  it('has the defaults of the evidence: closed, size default, no header', () => {
    const menu = document.createElement('nph-dropdown-menu');
    expect(menu.open).toBe(false);
    expect(menu.size).toBe('default');
    expect(menu.header).toBeNull();
    expect(menu.items).toEqual([]);
    expect(menu.label).toBe('');
  });

  it('the public API is exactly P92', () => {
    const declared = [...(NphDropdownMenu as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(['for', 'header', 'items', 'label', 'open', 'size']);
    expect(NPH_DROPDOWN_MENU_SIZES).toEqual(['default', 'compact']);
  });

  it('reflects for, open and size', async () => {
    const { menu } = await mount();
    menu.open = true;
    menu.size = 'compact';
    await settle(menu);
    expect(menu.getAttribute('for')).toBe('actions');
    expect(menu.hasAttribute('open')).toBe(true);
    expect(menu.getAttribute('size')).toBe('compact');
  });

  it('has no slot and no part, and takes no room in the flow', async () => {
    const { menu } = await mount();
    expect(menu.shadowRoot?.querySelector('slot, [part]')).toBeNull();
    const box = menu.getBoundingClientRect();
    expect(box.width).toBe(0);
    expect(box.height).toBe(0);
  });
});

describe('groups', () => {
  it('a label opens a group, a separator closes it, and items alone form a group with no name', () => {
    const groups = groupsOf([
      { value: 'a', text: 'A' },
      { type: 'label', text: 'View' },
      { value: 'b', text: 'B' },
      { value: 'c', text: 'C' },
      { type: 'separator' },
      { value: 'd', text: 'D' },
      { type: 'separator' },
      { type: 'label', text: 'Empty' },
      { type: 'separator' },
    ]);
    expect(groups.map((group) => ({ label: group.label, separated: group.separated, values: group.rows.map((row) => row.entry.value) }))).toEqual([
      { label: '', separated: false, values: ['a'] },
      { label: 'View', separated: false, values: ['b', 'c'] },
      { label: '', separated: true, values: ['d'] },
    ]);
  });

  it('an empty group is dropped and its separator goes to the next group', () => {
    const groups = groupsOf([
      { value: 'a', text: 'A' },
      { type: 'separator' },
      { type: 'label', text: 'Empty' },
      { type: 'separator' },
      { value: 'b', text: 'B' },
    ]);
    expect(groups.map((group) => [group.label, group.separated])).toEqual([
      ['', false],
      ['', true],
    ]);
  });

  it('a separator before the first group draws nothing', () => {
    expect(groupsOf([{ type: 'separator' }, { value: 'a', text: 'A' }])[0]?.separated).toBe(false);
  });
});

describe('invalid input', () => {
  const cases: Array<[string, () => Promise<Setup | NphDropdownMenu>, RegExp]> = [
    [
      'for is empty',
      async () => {
        const menu = document.createElement('nph-dropdown-menu');
        menu.items = ITEMS;
        document.body.append(menu);
        await settle(menu);
        return menu;
      },
      /for is empty/,
    ],
    [
      'for matches no element',
      async () => {
        const menu = document.createElement('nph-dropdown-menu');
        menu.setAttribute('for', 'nowhere');
        menu.items = ITEMS;
        document.body.append(menu);
        await settle(menu);
        await settle(menu);
        return menu;
      },
      /matches no element/,
    ],
    ['no valid item', () => mount([{ type: 'label', text: 'Alone' }]), /no valid item/],
    ['a size outside the two', () => mount(ITEMS, { size: 'large' as never }), /size "large" does not exist/],
  ];

  for (const [name, build, message] of cases) {
    it(`${name}: draws nothing, does not open and reports once`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const built = await build();
      const menu = built instanceof NphDropdownMenu ? built : built.menu;
      await settle(menu);
      expect(menu.hasAttribute('data-nph-rendered')).toBe(false);
      expect(menu.shadowRoot?.querySelector('.panel')).toBeNull();
      menu.open = true;
      await settle(menu);
      expect(menu.open).toBe(false);
      const matching = error.mock.calls.filter(([text]) => message.test(String(text)));
      expect(matching).toHaveLength(1);
    });
  }

  it('an invalid entry is left out, one error per cause, and the rest renders', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { menu } = await mount([
      { value: 'ok', text: 'Fine' },
      { value: '', text: 'No value' },
      { value: 'no-text', text: '  ' },
      { value: 'bad', text: 'Bad', severity: 'loud' as never },
      { value: 'both', text: 'Both', switch: true, selection: 'multiple' },
      { value: 'sub', text: 'Sub', submenu: true, selection: 'single' },
    ]);
    await settle(menu);
    expect(items(menu)).toHaveLength(1);
    const messages = error.mock.calls.map(([text]) => String(text));
    expect(messages.some((text) => /needs a value/.test(text))).toBe(true);
    expect(messages.some((text) => /needs text/.test(text))).toBe(true);
    expect(messages.some((text) => /severity "loud"/.test(text))).toBe(true);
    expect(messages.some((text) => /not a choice/.test(text))).toBe(true);
    expect(messages.some((text) => /neither a choice nor a switch/.test(text))).toBe(true);
    const before = error.mock.calls.length;
    menu.size = 'compact';
    await settle(menu);
    expect(error.mock.calls.length).toBe(before);
  });

  it('finds a trigger rendered one frame after the menu', async () => {
    const menu = document.createElement('nph-dropdown-menu');
    menu.setAttribute('for', 'late');
    menu.items = ITEMS;
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    document.body.append(menu);
    const trigger = document.createElement('button');
    trigger.id = 'late';
    document.body.append(trigger);
    await settle(menu);
    await settle(menu);
    expect(menu.hasAttribute('data-nph-rendered')).toBe(true);
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(error).not.toHaveBeenCalled();
  });

  it('looks the trigger up in its own root, never in the document', async () => {
    const outside = document.createElement('button');
    outside.id = 'actions';
    document.body.append(outside);
    const host = document.createElement('div');
    document.body.append(host);
    const root = host.attachShadow({ mode: 'open' });
    const inner = document.createElement('button');
    inner.id = 'actions';
    const menu = document.createElement('nph-dropdown-menu');
    menu.setAttribute('for', 'actions');
    menu.items = ITEMS;
    root.append(inner, menu);
    await settle(menu);
    expect(inner.getAttribute('aria-haspopup')).toBe('menu');
    expect(outside.hasAttribute('aria-haspopup')).toBe(false);
  });
});

describe('the trigger', () => {
  it('carries aria-haspopup="menu" and aria-expanded, which follows the state', async () => {
    const { menu, trigger } = await mount();
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    menu.open = true;
    await settle(menu);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps an aria-haspopup the consumer wrote, and removes only its own on disconnect', async () => {
    const { menu, trigger } = await mount();
    menu.remove();
    expect(trigger.hasAttribute('aria-haspopup')).toBe(false);
    expect(trigger.hasAttribute('aria-expanded')).toBe(false);
    trigger.setAttribute('aria-haspopup', 'true');
    document.body.append(menu);
    await settle(menu);
    menu.remove();
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
  });

  it('follows a change of for to another element', async () => {
    const { menu, trigger } = await mount();
    const other = document.createElement('button');
    other.id = 'other';
    document.body.append(other);
    menu.setAttribute('for', 'other');
    await settle(menu);
    expect(trigger.hasAttribute('aria-haspopup')).toBe(false);
    expect(other.getAttribute('aria-haspopup')).toBe('menu');
  });
});

describe('opening and closing', () => {
  it('a click on the trigger opens the menu below it, focused on the first item', async () => {
    const { menu, trigger } = await mount();
    await userEvent.click(trigger);
    await settle(menu);
    expect(menu.open).toBe(true);
    expect(shown(menu)).toBe(true);
    expect(active(menu)).toBe(items(menu)[0]);
  });

  it('a second click on the trigger closes it, and it does not open again', async () => {
    const { menu, trigger } = await mount();
    await userEvent.click(trigger);
    await settle(menu);
    await userEvent.click(trigger);
    await settle(menu);
    expect(menu.open).toBe(false);
  });

  it('opened by keyboard, a mouse click on the trigger closes it too', async () => {
    const { menu, trigger } = await mount();
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await settle(menu);
    expect(menu.open).toBe(true);
    await userEvent.click(trigger);
    await settle(menu);
    expect(menu.open).toBe(false);
  });

  it('Enter, Space and the down arrow open on the first item; the up arrow on the last', async () => {
    for (const [key, which] of [
      ['{Enter}', 0],
      [' ', 0],
      ['{ArrowDown}', 0],
      ['{ArrowUp}', -1],
    ] as const) {
      const { menu, trigger } = await mount();
      trigger.focus();
      await userEvent.keyboard(key);
      await settle(menu);
      expect(menu.open, key).toBe(true);
      expect(active(menu), key).toBe(items(menu).at(which));
      document.body.replaceChildren();
    }
  });

  it('Esc closes, gives the focus back to the trigger and does not reach the page', async () => {
    const { menu, trigger } = await mount();
    const outer = vi.fn();
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await settle(menu);
    document.addEventListener('keydown', outer);
    await userEvent.keyboard('{Escape}');
    await settle(menu);
    document.removeEventListener('keydown', outer);
    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
    expect(outer).not.toHaveBeenCalled();
  });

  it('with the menu closed, Esc is not intercepted', async () => {
    await mount();
    const outer = vi.fn();
    document.addEventListener('keydown', outer);
    await userEvent.keyboard('{Escape}');
    document.removeEventListener('keydown', outer);
    expect(outer).toHaveBeenCalledTimes(1);
  });

  it('a press outside closes it without moving the focus elsewhere', async () => {
    const { menu, trigger } = await mount();
    const elsewhere = document.createElement('button');
    elsewhere.textContent = 'Elsewhere';
    document.body.append(elsewhere);
    await userEvent.click(trigger);
    await settle(menu);
    await userEvent.click(elsewhere);
    await settle(menu);
    expect(menu.open).toBe(false);
  });

  it('a press inside the panel, outside an item, keeps it open', async () => {
    const { menu, trigger } = await mount([{ type: 'label', text: 'Group' }, ...ITEMS]);
    await userEvent.click(trigger);
    await settle(menu);
    await userEvent.click(menu.shadowRoot?.querySelector('.group-label') as HTMLElement);
    await settle(menu);
    expect(menu.open).toBe(true);
  });

  it('Tab closes it and the focus moves on', async () => {
    const { menu, trigger } = await mount();
    const next = document.createElement('button');
    next.textContent = 'Next';
    document.body.append(next);
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await settle(menu);
    await userEvent.tab();
    await settle(menu);
    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(next);
  });

  it('open set by the consumer shows the panel and does not move the focus', async () => {
    const { menu, trigger } = await mount();
    trigger.focus();
    menu.open = true;
    await settle(menu);
    expect(shown(menu)).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('closing leaves the top layer after the exit', async () => {
    const { menu } = await mount();
    menu.open = true;
    await settle(menu);
    menu.open = false;
    await settle(menu);
    await vi.waitFor(() => expect(shown(menu)).toBe(false));
  });

  it('opens from an nph-button, whose own button takes the focus back', async () => {
    const button = document.createElement('nph-button');
    button.id = 'more';
    button.setAttribute('text', 'More');
    const menu = document.createElement('nph-dropdown-menu');
    menu.setAttribute('for', 'more');
    menu.items = ITEMS;
    document.body.append(button, menu);
    await settle(menu);
    await userEvent.click(button);
    await settle(menu);
    expect(menu.open).toBe(true);
    await userEvent.keyboard('{Escape}');
    await settle(menu);
    expect(document.activeElement).toBe(button);
    expect(button.shadowRoot?.activeElement?.tagName).toBe('BUTTON');
  });
});

describe('focus visibility', () => {
  it('opened by keyboard, the first item shows the focus', async () => {
    const { menu, trigger } = await mount();
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await settle(menu);
    expect(items(menu)[0]?.matches(':focus-visible')).toBe(true);
  });

  it('opened by a mouse click, the first item has the focus but does not show it', async () => {
    const { menu, trigger } = await mount();
    await userEvent.click(trigger);
    await settle(menu);
    expect(active(menu)).toBe(items(menu)[0]);
    expect(items(menu)[0]?.matches(':focus-visible')).toBe(false);
  });

  it('the focus is the color/primary border and the focus/halo halo, outside the item box', async () => {
    const { menu, trigger } = await mount();
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await settle(menu);
    const item = items(menu)[0] as HTMLElement;
    const border = getComputedStyle(item, '::before');
    const halo = getComputedStyle(item, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-color-primary'));
    expect(Number.parseFloat(border.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    expect(border.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-focus-border-radius-inner'));
    expect(Number.parseFloat(border.top)).toBeCloseTo(-px('--nph-border-width'), 1);
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(Number.parseFloat(halo.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
    expect(halo.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-focus-radius-inner-with-border'));
    expect(Number.parseFloat(halo.top)).toBeCloseTo(-(px('--nph-border-width') + px('--nph-focus-ring-width')), 1);
  });
});

describe('keyboard in the menu', () => {
  async function opened(entries: NphDropdownMenuEntry[] = ITEMS): Promise<Setup> {
    const setup = await mount(entries);
    setup.trigger.focus();
    await userEvent.keyboard('{Enter}');
    await settle(setup.menu);
    return setup;
  }

  it('the arrows move with wrap', async () => {
    const { menu } = await opened();
    const all = items(menu);
    await userEvent.keyboard('{ArrowDown}');
    expect(active(menu)).toBe(all[1]);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(active(menu)).toBe(all[0]);
    await userEvent.keyboard('{ArrowUp}');
    expect(active(menu)).toBe(all.at(-1));
  });

  it('Home and End go to the ends', async () => {
    const { menu } = await opened();
    await userEvent.keyboard('{End}');
    expect(active(menu)).toBe(items(menu).at(-1));
    await userEvent.keyboard('{Home}');
    expect(active(menu)).toBe(items(menu)[0]);
  });

  it('a typed character goes to the next item that starts with it', async () => {
    const { menu } = await opened();
    await userEvent.keyboard('d');
    expect(active(menu)).toBe(itemOf(menu, 'duplicate'));
    await userEvent.keyboard('d');
    expect(active(menu)).toBe(itemOf(menu, 'delete'));
  });

  it('a disabled or loading item takes the focus', async () => {
    const { menu } = await opened([
      { value: 'a', text: 'A' },
      { value: 'b', text: 'B', disabled: true },
      { value: 'c', text: 'C', loading: true },
    ]);
    await userEvent.keyboard('{ArrowDown}');
    expect(active(menu)).toBe(itemOf(menu, 'b'));
    await userEvent.keyboard('{ArrowDown}');
    expect(active(menu)).toBe(itemOf(menu, 'c'));
  });
});

describe('activation and the event', () => {
  it('a common item fires nph-item-select with checked null, closes and gives the focus back', async () => {
    const { menu, trigger } = await mount();
    const seen = events(menu);
    trigger.focus();
    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');
    await settle(menu);
    expect(seen).toEqual([{ value: 'duplicate', checked: null }]);
    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('a click on an item activates it, and Space does too', async () => {
    const { menu, trigger } = await mount();
    const seen = events(menu);
    await userEvent.click(trigger);
    await settle(menu);
    await userEvent.click(itemOf(menu, 'rename'));
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await settle(menu);
    await userEvent.keyboard(' ');
    expect(seen).toEqual([
      { value: 'rename', checked: null },
      { value: 'rename', checked: null },
    ]);
  });

  it('the event bubbles, is not composed and carries a typed detail', async () => {
    const { menu, trigger } = await mount();
    let received: Event | null = null;
    document.body.addEventListener('nph-item-select', (event) => (received = event));
    await userEvent.click(trigger);
    await settle(menu);
    await userEvent.click(itemOf(menu, 'rename'));
    const event = received as unknown as CustomEvent<NphDropdownMenuItemSelectDetail>;
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(false);
    expect(event.target).toBe(menu);
  });

  it('single choice is exclusive inside its group, closes the menu and leaves other groups alone', async () => {
    const entries: NphDropdownMenuEntry[] = [
      { type: 'label', text: 'View' },
      { value: 'list', text: 'List', selection: 'single', checked: true },
      { value: 'grid', text: 'Grid', selection: 'single' },
      { type: 'separator' },
      { type: 'label', text: 'Sort' },
      { value: 'name', text: 'Name', selection: 'single', checked: true },
    ];
    const { menu, trigger } = await mount(entries);
    const original = entries[1];
    const seen = events(menu);
    await userEvent.click(trigger);
    await settle(menu);
    await userEvent.click(itemOf(menu, 'grid'));
    await settle(menu);
    expect(seen).toEqual([{ value: 'grid', checked: true }]);
    expect(menu.open).toBe(false);
    const state = menu.items.filter((entry) => 'value' in entry).map((entry) => [(entry as { value: string }).value, (entry as { checked?: boolean }).checked]);
    expect(state).toEqual([
      ['list', false],
      ['grid', true],
      ['name', true],
    ]);
    expect(menu.items).not.toBe(entries);
    expect(original).toEqual({ value: 'list', text: 'List', selection: 'single', checked: true });
  });

  it('multiple choice and a switch toggle and keep the menu open, with the focus on the item', async () => {
    const { menu, trigger } = await mount([
      { value: 'archived', text: 'Archived', selection: 'multiple' },
      { value: 'sync', text: 'Sync', switch: true, checked: true },
    ]);
    const seen = events(menu);
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await settle(menu);
    await userEvent.keyboard(' ');
    await settle(menu);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await settle(menu);
    expect(seen).toEqual([
      { value: 'archived', checked: true },
      { value: 'sync', checked: false },
    ]);
    expect(menu.open).toBe(true);
    expect(active(menu)).toBe(itemOf(menu, 'sync'));
    expect(itemOf(menu, 'archived').getAttribute('aria-checked')).toBe('true');
    expect((itemOf(menu, 'archived').querySelector('nph-checkbox') as HTMLElement & { checked: boolean }).checked).toBe(true);
    expect(itemOf(menu, 'sync').querySelector('nph-switch')?.hasAttribute('checked')).toBe(false);
  });

  it('a click on the inert box or track hovers and activates the item, and no event of the inner piece escapes', async () => {
    const { menu, trigger } = await mount([
      { value: 'archived', text: 'Archived', selection: 'multiple' },
      { value: 'sync', text: 'Sync', switch: true },
    ]);
    const seen = events(menu);
    const escaped: string[] = [];
    for (const type of ['input', 'change']) document.addEventListener(type, () => escaped.push(type));
    await userEvent.click(trigger);
    await settle(menu);
    const checkbox = itemOf(menu, 'archived').querySelector('nph-checkbox') as HTMLElement;
    const toggle = itemOf(menu, 'sync').querySelector('nph-switch') as HTMLElement;
    await userEvent.hover(checkbox, { force: true });
    expect(getComputedStyle(itemOf(menu, 'archived')).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
    await userEvent.click(checkbox, { force: true });
    await userEvent.click(toggle, { force: true });
    expect(seen).toEqual([
      { value: 'archived', checked: true },
      { value: 'sync', checked: true },
    ]);
    expect(escaped).toEqual([]);
  });

  it('a single choice already checked fires again, with checked true, and closes', async () => {
    const { menu, trigger } = await mount([
      { value: 'list', text: 'List', selection: 'single', checked: true },
      { value: 'grid', text: 'Grid', selection: 'single' },
    ]);
    const seen = events(menu);
    await userEvent.click(trigger);
    await settle(menu);
    await userEvent.click(itemOf(menu, 'list'));
    await settle(menu);
    expect(seen).toEqual([{ value: 'list', checked: true }]);
    expect(menu.open).toBe(false);
  });

  it('a disabled or loading item does not activate', async () => {
    const { menu, trigger } = await mount([
      { value: 'off', text: 'Off', disabled: true },
      { value: 'busy', text: 'Busy', loading: true },
    ]);
    const seen = events(menu);
    await userEvent.click(trigger);
    await settle(menu);
    await userEvent.click(itemOf(menu, 'off'), { force: true });
    await userEvent.click(itemOf(menu, 'busy'), { force: true });
    expect(seen).toEqual([]);
    expect(menu.open).toBe(true);
  });

  it('changing items or open from code fires nothing', async () => {
    const { menu } = await mount();
    const seen = events(menu);
    menu.open = true;
    menu.items = [{ value: 'x', text: 'X', selection: 'multiple', checked: true }];
    await settle(menu);
    menu.open = false;
    await settle(menu);
    expect(seen).toEqual([]);
  });

  it('a submenu item activates as a common item: the nested menu is out of scope', async () => {
    const { menu, trigger } = await mount([{ value: 'move', text: 'Move to', submenu: true }]);
    const seen = events(menu);
    await userEvent.click(trigger);
    await settle(menu);
    await userEvent.click(itemOf(menu, 'move'));
    expect(seen).toEqual([{ value: 'move', checked: null }]);
  });
});

describe('roles and names the browser computes', () => {
  it('the menu is named by the trigger, or by label', async () => {
    const { menu } = await mount();
    menu.open = true;
    await settle(menu);
    const list = menu.shadowRoot?.querySelector('[role="menu"]') as HTMLElement;
    expect(await axNode(list)).toMatchObject({ role: 'menu', name: 'Actions' });
    menu.label = 'File actions';
    await settle(menu);
    expect(await axNode(list)).toMatchObject({ role: 'menu', name: 'File actions' });
  });

  it('each item has its role, its state and the label as its name', async () => {
    const { menu } = await mount([
      { value: 'rename', text: 'Rename', icon: 'pen-to-square', shortcut: 'F2', description: 'Change the name' },
      { value: 'list', text: 'List', selection: 'single', checked: true },
      { value: 'archived', text: 'Archived', selection: 'multiple' },
      { value: 'sync', text: 'Sync', switch: true, checked: true },
      { value: 'off', text: 'Off', disabled: true },
    ]);
    menu.open = true;
    await settle(menu);
    await expect.element(page.getByRole('menuitem', { name: 'Rename', exact: true })).toBeInTheDocument();
    await expect.element(page.getByRole('menuitemradio', { name: 'List', checked: true })).toBeInTheDocument();
    await expect.element(page.getByRole('menuitemcheckbox', { name: 'Archived', checked: false })).toBeInTheDocument();
    await expect.element(page.getByRole('menuitemcheckbox', { name: 'Sync', checked: true })).toBeInTheDocument();
    await expect.element(page.getByRole('menuitem', { name: 'Off', disabled: true })).toBeInTheDocument();
    const rename = itemOf(menu, 'rename');
    const described = (rename.getAttribute('aria-describedby') ?? '').split(' ').map((id) => menu.shadowRoot?.getElementById(id)?.textContent?.trim());
    expect(described).toEqual(['Change the name', 'F2']);
  });

  it('a group with a label is a named group; the header sits outside the menu', async () => {
    const { menu } = await mount([{ type: 'label', text: 'View' }, ...ITEMS], { header: { name: 'Ana Souza', status: 'Online' } });
    menu.open = true;
    await settle(menu);
    await expect.element(page.getByRole('group', { name: 'View' })).toBeInTheDocument();
    const header = menu.shadowRoot?.querySelector('.header') as HTMLElement;
    expect(header.closest('[role="menu"]')).toBeNull();
    expect(header.textContent).toContain('Ana Souza');
    expect(header.textContent).toContain('Online');
  });

  it('the inner checkbox and switch are inert: no focus, no role of their own, never disabled', async () => {
    const { menu } = await mount([
      { value: 'archived', text: 'Archived', selection: 'multiple', disabled: true },
      { value: 'sync', text: 'Sync', switch: true, disabled: true },
    ]);
    menu.open = true;
    await settle(menu);
    const checkbox = itemOf(menu, 'archived').querySelector('nph-checkbox') as HTMLElement;
    const toggle = itemOf(menu, 'sync').querySelector('nph-switch') as HTMLElement;
    for (const piece of [checkbox, toggle]) {
      expect(piece.inert).toBe(true);
      expect(piece.hasAttribute('disabled')).toBe(false);
      expect(piece.hasAttribute('data-nph-rendered')).toBe(true);
    }
    /* The browser leaves the inner controls out of its accessibility tree. */
    expect((await axNode(checkbox.shadowRoot?.querySelector('input') as Element)).ignored).toBe(true);
    expect((await axNode(toggle.shadowRoot?.querySelector('button') as Element)).ignored).toBe(true);
    expect(await axNode(itemOf(menu, 'archived'))).toMatchObject({ role: 'menuitemcheckbox', name: 'Archived', ignored: false });
  });

  it('a loading item is busy and shows only the spinner at the end', async () => {
    const { menu } = await mount([{ value: 'busy', text: 'Exporting', shortcut: 'E', count: 3, loading: true }]);
    menu.open = true;
    await settle(menu);
    const item = itemOf(menu, 'busy');
    expect(item.getAttribute('aria-busy')).toBe('true');
    expect(item.getAttribute('aria-disabled')).toBe('true');
    expect([...(item.querySelector('.end')?.children ?? [])].map((child) => child.tagName.toLowerCase())).toEqual(['nph-spinner']);
  });

  it('a submenu item announces a menu', async () => {
    const { menu } = await mount([{ value: 'move', text: 'Move to', submenu: true }]);
    menu.open = true;
    await settle(menu);
    expect(itemOf(menu, 'move').getAttribute('aria-haspopup')).toBe('menu');
  });
});

describe('anatomy, measures and colors', () => {
  async function openMenu(entries: NphDropdownMenuEntry[] = ITEMS, props: Partial<NphDropdownMenu> = {}): Promise<NphDropdownMenu> {
    const { menu } = await mount(entries, props);
    menu.open = true;
    await settle(menu);
    await vi.waitFor(() => expect(getComputedStyle(panel(menu)).opacity).toBe('1'));
    return menu;
  }

  it('the panel: color/popover, color/dropdown-border, radius/container, elevation/dropdown, layout/input-width and space/inline-tight', async () => {
    const menu = await openMenu();
    const style = getComputedStyle(panel(menu));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-popover'));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-color-dropdown-border'));
    expect(Number.parseFloat(style.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    expect(style.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-radius-container'));
    expect(style.boxShadow).toBe(resolved('box-shadow', '--nph-elevation-dropdown'));
    expect(panel(menu).getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-input-width'), 0);
    expect(Number.parseFloat(style.paddingTop)).toBeCloseTo(px('--nph-space-inline-tight'), 1);
  });

  it('opens space/inline-tight below the trigger, aligned to its start edge', async () => {
    const { menu, trigger } = await mount();
    trigger.style.marginInlineStart = '40px';
    menu.open = true;
    await settle(menu);
    await vi.waitFor(() => expect(getComputedStyle(panel(menu)).translate).toBe('none'));
    const anchor = trigger.getBoundingClientRect();
    const box = panel(menu).getBoundingClientRect();
    expect(box.top - anchor.bottom).toBeCloseTo(px('--nph-space-inline-tight'), 0);
    expect(box.left).toBeCloseTo(anchor.left, 0);
  });

  it('turns up when it does not fit below and fits above', async () => {
    const { menu, trigger } = await mount();
    trigger.style.position = 'fixed';
    trigger.style.bottom = '0px';
    menu.open = true;
    await settle(menu);
    await vi.waitFor(() => expect(getComputedStyle(panel(menu)).translate).toBe('none'));
    const anchor = trigger.getBoundingClientRect();
    const box = panel(menu).getBoundingClientRect();
    expect(anchor.top - box.bottom).toBeCloseTo(px('--nph-space-inline-tight'), 0);
    expect(panel(menu).getAttribute('data-side')).toBe('top');
  });

  it('rows of 36 in default, 28 in compact and 40 with multiple choice, from their content', async () => {
    const menu = await openMenu([
      { value: 'a', text: 'Rename', icon: 'pen' },
      { value: 'b', text: 'Archived', selection: 'multiple' },
      { value: 'c', text: 'Sync', switch: true },
      { value: 'd', text: 'Beta', tag: 'New', icon: 'gear' },
    ]);
    const md = px('--nph-icon-size-md');
    const inline = px('--nph-space-inline');
    const tight = px('--nph-space-inline-tight');
    expect(itemOf(menu, 'a').getBoundingClientRect().height).toBeCloseTo(md + 2 * inline, 0);
    expect(itemOf(menu, 'b').getBoundingClientRect().height).toBeCloseTo(px('--nph-icon-size-sm') + 2 * tight + 2 * inline, 0);
    expect(itemOf(menu, 'c').getBoundingClientRect().height).toBeCloseTo(md + 2 * inline, 0);
    expect(itemOf(menu, 'd').getBoundingClientRect().height).toBeCloseTo(md + 2 * inline, 0);
    menu.size = 'compact';
    await settle(menu);
    expect(itemOf(menu, 'a').getBoundingClientRect().height).toBeCloseTo(md + 2 * tight, 0);
  });

  it('the item: radius/inner, no background at rest, text/body-md in color/popover-foreground, cut with an ellipsis', async () => {
    const menu = await openMenu([{ value: 'a', text: 'A very long label that does not fit in the width of the menu at all', icon: 'pen' }]);
    const item = itemOf(menu, 'a');
    const style = getComputedStyle(item);
    expect(style.borderTopLeftRadius).toBe(resolved('border-radius', '--nph-radius-inner'));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    const text = item.querySelector('.text') as HTMLElement;
    expect(getComputedStyle(text).color).toBe(resolved('color', '--nph-color-popover-foreground'));
    expect(getComputedStyle(text).fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
    expect(getComputedStyle(text).textOverflow).toBe('ellipsis');
    expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
  });

  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: hover paints color/primary-surface and turns the start icon and the arrow solid in dropdown/item-hover-icon-foreground`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const menu = await openMenu([{ value: 'move', text: 'Move to', icon: 'share', submenu: true }]);
      const item = itemOf(menu, 'move');
      const visible = () =>
        [...item.querySelectorAll('nph-icon')]
          .filter((icon) => getComputedStyle(icon).display !== 'none')
          .map((icon) => `${icon.getAttribute('name')}:${icon.getAttribute('variant') ?? 'light'}`);
      expect(visible()).toEqual(['share:light', 'chevron-right:light']);
      await userEvent.hover(item);
      expect(getComputedStyle(item).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
      expect(visible()).toEqual(['share:solid', 'chevron-right:solid']);
      for (const icon of item.querySelectorAll<HTMLElement>('.glyph-hover')) {
        expect(getComputedStyle(icon).color).toBe(resolved('color', '--nph-dropdown-item-hover-icon-foreground'));
      }
      expect(getComputedStyle(item.querySelector('.text') as HTMLElement).color).toBe(resolved('color', '--nph-color-popover-foreground'));
    });

    it(`${scheme}: the destructive item is color/destructive-on-surface and hovers in color/destructive-surface, with no solid swap`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const menu = await openMenu([{ value: 'delete', text: 'Delete', icon: 'trash', severity: 'destructive', shortcut: 'Del' }]);
      const item = itemOf(menu, 'delete');
      const destructive = resolved('color', '--nph-color-destructive-on-surface');
      expect(getComputedStyle(item.querySelector('.text') as HTMLElement).color).toBe(destructive);
      expect(getComputedStyle(item.querySelector('.shortcut') as HTMLElement).color).toBe(destructive);
      await userEvent.hover(item);
      expect(getComputedStyle(item).backgroundColor).toBe(resolved('background-color', '--nph-color-destructive-surface'));
      const solid = [...item.querySelectorAll('nph-icon[variant="solid"]')].filter((icon) => getComputedStyle(icon).display !== 'none');
      expect(solid).toHaveLength(0);
      expect(getComputedStyle(item.querySelector('.glyph-rest') as HTMLElement).color).toBe(destructive);
    });
  }

  it('a disabled item: state/disabled-opacity on the whole row, and no hover', async () => {
    const menu = await openMenu([{ value: 'off', text: 'Off', icon: 'pen', disabled: true }]);
    const item = itemOf(menu, 'off');
    expect(getComputedStyle(item).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    await userEvent.hover(item, { force: true });
    expect(getComputedStyle(item).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('single choice, checked: text/label-md in color/primary-hover and the solid check at the end', async () => {
    const menu = await openMenu([
      { value: 'list', text: 'List', icon: 'list', selection: 'single', checked: true },
      { value: 'grid', text: 'Grid', icon: 'grid-2', selection: 'single' },
    ]);
    const checked = itemOf(menu, 'list');
    const text = checked.querySelector('.text') as HTMLElement;
    expect(getComputedStyle(text).color).toBe(resolved('color', '--nph-color-primary-hover'));
    expect(getComputedStyle(text).fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(getComputedStyle(checked.querySelector('.icon') as HTMLElement).color).toBe(resolved('color', '--nph-color-primary-hover'));
    const check = checked.querySelector('.check') as HTMLElement;
    expect(check.getAttribute('name')).toBe('check');
    expect(check.getAttribute('variant')).toBe('solid');
    expect(check.getAttribute('size')).toBe('sm');
    expect(itemOf(menu, 'grid').querySelector('.check')).toBeNull();
    expect(getComputedStyle(itemOf(menu, 'grid').querySelector('.text') as HTMLElement).color).toBe(resolved('color', '--nph-color-popover-foreground'));
  });

  it('the parts at the end: shortcut in text/caption, counter pill, tag in nph-badge, arrow sm', async () => {
    const menu = await openMenu([{ value: 'inbox', text: 'Inbox', icon: 'paper-plane', shortcut: 'G I', count: 12, tag: 'New', submenu: true }]);
    const item = itemOf(menu, 'inbox');
    const shortcut = item.querySelector('.shortcut') as HTMLElement;
    expect(getComputedStyle(shortcut).fontSize).toBe(resolved('font-size', '--nph-text-caption-font-size'));
    expect(getComputedStyle(shortcut).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    const count = item.querySelector('.count') as HTMLElement;
    expect(count.textContent).toBe('12');
    expect(getComputedStyle(count).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-hover'));
    expect(getComputedStyle(count).color).toBe(resolved('color', '--nph-color-primary-foreground'));
    expect(count.getBoundingClientRect().height).toBeCloseTo(px('--nph-icon-size-md'), 0);
    expect(item.querySelector('nph-badge')?.getAttribute('text')).toBe('New');
    expect(item.querySelector('.arrow')?.getAttribute('size')).toBe('sm');
  });

  it('the description: text/caption in color/muted-foreground, below the label', async () => {
    const menu = await openMenu([{ value: 'a', text: 'Export', description: 'As a PDF file' }]);
    const item = itemOf(menu, 'a');
    const description = item.querySelector('.description') as HTMLElement;
    expect(getComputedStyle(description).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(description.getBoundingClientRect().top).toBeGreaterThanOrEqual((item.querySelector('.text') as HTMLElement).getBoundingClientRect().bottom - 1);
  });

  it('the group label: text/label-sm in color/muted-foreground', async () => {
    const menu = await openMenu([{ type: 'label', text: 'View' }, ...ITEMS]);
    const label = menu.shadowRoot?.querySelector('.group-label') as HTMLElement;
    expect(getComputedStyle(label).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(getComputedStyle(label).fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
    expect(Number.parseFloat(getComputedStyle(label).paddingLeft)).toBeCloseTo(px('--nph-space-inline'), 1);
    expect(Number.parseFloat(getComputedStyle(label).paddingTop)).toBeCloseTo(px('--nph-space-inline-tight'), 1);
  });

  it('the profile header: avatar md, name and status, and a separator below', async () => {
    const menu = await openMenu(ITEMS, { header: { name: 'Ana Souza', status: 'ana@example.com' } });
    const header = menu.shadowRoot?.querySelector('.header') as HTMLElement;
    expect(header.querySelector('nph-avatar')?.getAttribute('size')).toBe('md');
    expect(Number.parseFloat(getComputedStyle(header).paddingTop)).toBeCloseTo(px('--nph-space-inline'), 1);
    expect(getComputedStyle(header.querySelector('.header-status') as HTMLElement).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(header.nextElementSibling?.tagName.toLowerCase()).toBe('nph-separator');
  });

  it('the separator: nph-separator with space/inline-tight above and below', async () => {
    const menu = await openMenu();
    const separator = menu.shadowRoot?.querySelector('[role="menu"] nph-separator') as HTMLElement;
    expect(Number.parseFloat(getComputedStyle(separator).marginTop)).toBeCloseTo(px('--nph-space-inline-tight'), 1);
    expect(Number.parseFloat(getComputedStyle(separator).marginBottom)).toBeCloseTo(px('--nph-space-inline-tight'), 1);
  });

  it('a menu taller than the room scrolls inside, and only then', async () => {
    const many: NphDropdownMenuEntry[] = Array.from({ length: 60 }, (_, index) => ({ value: `v${index}`, text: `Item ${index}` }));
    const menu = await openMenu(many);
    expect(panel(menu).getBoundingClientRect().bottom).toBeLessThanOrEqual(document.documentElement.clientHeight + 1);
    expect(getComputedStyle(panel(menu)).overflowY).toBe('auto');
    menu.items = ITEMS;
    await settle(menu);
    expect(getComputedStyle(panel(menu)).overflowY).toBe('visible');
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, including the four of this task', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
    for (const name of ['--nph-color-dropdown-border', '--nph-focus-border-radius-inner', '--nph-focus-radius-inner-with-border', '--nph-dropdown-item-hover-icon-foreground']) {
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

  it('design.md names the tokens of the dropdown and the hover rule', () => {
    for (const token of ['color/dropdown-border', 'dropdown/item-hover-icon-foreground', 'color/primary-surface', 'elevation/dropdown']) {
      expect(designMd, token).toContain(`  ${token}:`);
    }
    expect(designMd).toMatch(/hover of the nph-dropdown-menu item is color\/primary-surface/);
    expect(designMd).toMatch(/right-from-bracket, right-to-bracket/);
  });
});
