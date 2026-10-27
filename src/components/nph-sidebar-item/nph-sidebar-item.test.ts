/**
 * Tests of `nph-sidebar-item` (P98), in a real browser (P21, item 5): hover, keyboard focus,
 * the top layer of the menu and the balloon, and the measures only exist where there is
 * layout.
 *
 * They prove the contract accepted in Figma (board `1366:2`, documentation `2723:460`, set
 * `2251:51271`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-53: the
 * API, the invalid input, the link and the group, the counter, the disabled line, the
 * balloon, more actions with its menu and its event, the roles and names the browser
 * computes, the colors and measures of each state, the focus, and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-sidebar-item.css?raw';
import { NPH_SIDEBAR_ITEM_TOGGLE_EVENT, NPH_SIDEBAR_ITEM_TYPES, NphSidebarItem } from './nph-sidebar-item';
import type { NphSidebarItemToggleDetail } from './nph-sidebar-item';
import type { NphDropdownMenu, NphDropdownMenuEntry, NphDropdownMenuItemSelectDetail } from '../nph-dropdown-menu/nph-dropdown-menu';
import type { NphIcon } from '../nph-icon/nph-icon';
import type { NphTooltip } from '../nph-tooltip/nph-tooltip';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const ACTIONS: NphDropdownMenuEntry[] = [
  { value: 'rename', text: 'Rename', icon: 'pen-to-square' },
  { value: 'archive', text: 'Archive', icon: 'folder' },
];

async function mount(props: Partial<NphSidebarItem> = {}): Promise<NphSidebarItem> {
  const item = document.createElement('nph-sidebar-item');
  item.style.inlineSize = '240px';
  Object.assign(item, { label: 'Inbox', icon: 'inbox', href: '#inbox', ...props });
  document.body.append(item);
  await item.updateComplete;
  return item;
}

async function settle(item: NphSidebarItem): Promise<void> {
  await item.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  for (const inner of item.shadowRoot?.querySelectorAll('nph-icon, nph-button, nph-dropdown-menu, nph-tooltip') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
}

const control = (item: NphSidebarItem): HTMLElement => item.shadowRoot?.querySelector('.control') as HTMLElement;
const icon = (item: NphSidebarItem): NphIcon => item.shadowRoot?.querySelector('.icon') as NphIcon;
const arrow = (item: NphSidebarItem): NphIcon | null => item.shadowRoot?.querySelector('.arrow') as NphIcon | null;
const counter = (item: NphSidebarItem): HTMLElement | null => item.shadowRoot?.querySelector('.counter') as HTMLElement | null;
const actionsButton = (item: NphSidebarItem): HTMLElement | null => item.shadowRoot?.querySelector('nph-button') as HTMLElement | null;
const menu = (item: NphSidebarItem): NphDropdownMenu | null => item.shadowRoot?.querySelector('nph-dropdown-menu') as NphDropdownMenu | null;
const balloon = (item: NphSidebarItem): NphTooltip | null => item.shadowRoot?.querySelector('nph-tooltip') as NphTooltip | null;

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

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-sidebar-item')).toBe(NphSidebarItem);
    expect(document.createElement('nph-sidebar-item')).toBeInstanceOf(NphSidebarItem);
  });

  it('the public API is exactly P98', () => {
    const declared = [...(NphSidebarItem as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(
      ['actions', 'actionsLabel', 'active', 'counter', 'disabled', 'expanded', 'href', 'icon', 'label', 'tooltip', 'type'].sort(),
    );
    expect([...NPH_SIDEBAR_ITEM_TYPES]).toEqual(['link', 'group']);
    expect(NPH_SIDEBAR_ITEM_TOGGLE_EVENT).toBe('nph-toggle');
  });

  it('has the defaults of the set: a link, at rest, no counter, no balloon, no more actions', () => {
    const item = document.createElement('nph-sidebar-item');
    expect(item.type).toBe('link');
    expect(item.active).toBe(false);
    expect(item.expanded).toBe(false);
    expect(item.counter).toBeNull();
    expect(item.disabled).toBe(false);
    expect(item.tooltip).toBe('');
    expect(item.actions).toEqual([]);
    expect(item.actionsLabel).toBe('');
  });

  it('reflects type, active, expanded and disabled, which the CSS reads', async () => {
    const item = await mount({ type: 'group', href: '', expanded: true });
    expect(item.getAttribute('type')).toBe('group');
    expect(item.hasAttribute('expanded')).toBe(true);
    item.type = 'link';
    item.href = '#inbox';
    item.expanded = false;
    item.active = true;
    item.disabled = true;
    await item.updateComplete;
    expect(item.getAttribute('type')).toBe('link');
    expect(item.hasAttribute('active')).toBe(true);
    expect(item.hasAttribute('disabled')).toBe(true);
  });

  it('reads counter and actions-label from attributes', async () => {
    const item = document.createElement('nph-sidebar-item');
    item.setAttribute('label', 'Inbox');
    item.setAttribute('icon', 'inbox');
    item.setAttribute('href', '#inbox');
    item.setAttribute('counter', '3');
    item.setAttribute('actions-label', 'More actions');
    document.body.append(item);
    await item.updateComplete;
    expect(item.counter).toBe(3);
    expect(item.actionsLabel).toBe('More actions');
  });

  it('has no slot and no part', async () => {
    const item = await mount({ counter: 2, tooltip: 'Inbox', actions: ACTIONS, actionsLabel: 'More actions' });
    expect(item.shadowRoot?.querySelector('slot')).toBeNull();
    expect(item.shadowRoot?.querySelector('[part]')).toBeNull();
  });

  it('fills the width it receives', async () => {
    const item = await mount();
    expect(getComputedStyle(item).display).toBe('block');
    expect(control(item).getBoundingClientRect().width).toBeCloseTo(240, 0);
  });
});

describe('invalid input', () => {
  const cases: Array<[string, Partial<NphSidebarItem>, RegExp]> = [
    ['a type outside link and group', { type: 'counter' as never }, /type "counter" does not exist/],
    ['no icon', { icon: '' }, /needs an icon/],
    ['an icon outside the core', { icon: 'rocket' }, /"rocket" is not a core name/],
    ['a link without href', { href: '' }, /a link needs an href/],
    ['a group with href', { type: 'group' }, /a group has no href/],
    ['an active group', { type: 'group', href: '', active: true }, /a group is never active/],
    ['a group with a counter', { type: 'group', href: '', counter: 2 }, /a group has no counter/],
    ['a counter that is not a whole number', { counter: 1.5 }, /counter shows a whole number/],
    ['a negative counter', { counter: -1 }, /counter shows a whole number/],
    ['a counter given as text', { counter: Number.NaN }, /counter shows a whole number/],
    ['more actions without actions-label', { actions: ACTIONS }, /needs actions-label/],
  ];

  for (const [cause, props, message] of cases) {
    it(`${cause}: renders nothing and complains once`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const item = await mount(props);
      expect(item.shadowRoot?.childElementCount).toBe(0);
      expect(item.hasAttribute('data-nph-rendered')).toBe(false);
      expect(getComputedStyle(item).display).toBe('none');
      const messages = error.mock.calls.map((call) => String(call[0]));
      expect(messages.filter((text) => message.test(text))).toHaveLength(1);
      expect(messages.every((text) => text.startsWith('[nph-sidebar-item]'))).toBe(true);
    });
  }

  it('a counter attribute with text is invalid', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const item = document.createElement('nph-sidebar-item');
    item.setAttribute('label', 'Inbox');
    item.setAttribute('icon', 'inbox');
    item.setAttribute('href', '#inbox');
    item.setAttribute('counter', 'new');
    document.body.append(item);
    await item.updateComplete;
    expect(item.shadowRoot?.childElementCount).toBe(0);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('no label is a mount: nothing, and no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const item = await mount({ label: '', icon: '', href: '' });
    expect(item.shadowRoot?.childElementCount).toBe(0);
    expect(error).not.toHaveBeenCalled();
  });

  it('a disabled link needs no href', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const item = await mount({ href: '', disabled: true });
    expect(control(item)).not.toBeNull();
    expect(error).not.toHaveBeenCalled();
  });

  it('fixing the input renders the item', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const item = await mount({ icon: 'rocket' });
    item.icon = 'inbox';
    await item.updateComplete;
    expect(control(item)).not.toBeNull();
  });
});

describe('the link', () => {
  it('is an anchor with the href, the icon and the label', async () => {
    const item = await mount();
    const link = control(item);
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('#inbox');
    expect(icon(item).name).toBe('inbox');
    expect(icon(item).size).toBe('md');
    expect(item.shadowRoot?.querySelector('.label')?.textContent).toBe('Inbox');
    expect(arrow(item)).toBeNull();
    expect(counter(item)).toBeNull();
  });

  it('the browser computes a link named by the label; the icon is decorative', async () => {
    const item = await mount();
    await settle(item);
    const node = await axNode(control(item));
    expect(node.role).toBe('link');
    expect(node.name).toBe('Inbox');
  });

  it('at rest the icon is light; active it is solid, with aria-current="page"', async () => {
    const item = await mount();
    expect(icon(item).variant).toBe('light');
    expect(control(item).hasAttribute('aria-current')).toBe(false);
    item.active = true;
    await item.updateComplete;
    expect(icon(item).variant).toBe('solid');
    expect(control(item).getAttribute('aria-current')).toBe('page');
  });

  it('the click is the native click, which reaches the host', async () => {
    const item = await mount({ href: '#here' });
    const seen = vi.fn((event: Event) => event.preventDefault());
    item.addEventListener('click', seen);
    await userEvent.click(control(item));
    expect(seen).toHaveBeenCalledTimes(1);
  });

  it('a long label stays on one line and ends in an ellipsis', async () => {
    const item = await mount({ label: 'A very long name of a product area that does not fit in the line' });
    const label = item.shadowRoot?.querySelector('.label') as HTMLElement;
    const style = getComputedStyle(label);
    expect(style.textOverflow).toBe('ellipsis');
    expect(style.whiteSpace).toBe('nowrap');
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    expect(control(item).getBoundingClientRect().height).toBeCloseTo(px('--nph-sidebar-item-height'), 0);
  });
});

describe('the counter', () => {
  it('shows the number after the label, inside the name of the link', async () => {
    const item = await mount({ counter: 3 });
    await settle(item);
    expect(counter(item)?.textContent).toBe('3');
    const node = await axNode(control(item));
    expect(node.name).toBe('Inbox 3');
  });

  it('zero is a number and shows', async () => {
    const item = await mount({ counter: 0 });
    expect(counter(item)?.textContent).toBe('0');
  });

  it('is a pill at the end, in the badge tokens and text/label-sm', async () => {
    const item = await mount({ counter: 12 });
    const pill = counter(item) as HTMLElement;
    const style = getComputedStyle(pill);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-sidebar-item-badge-background'));
    expect(style.color).toBe(resolved('color', '--nph-sidebar-item-badge-foreground'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
    expect(pill.getBoundingClientRect().height).toBeCloseTo(px('--nph-icon-size-md'), 0);
    expect(Number.parseFloat(style.paddingInlineStart)).toBeCloseTo(px('--nph-space-inline'), 0);
    const line = control(item).getBoundingClientRect();
    expect(line.right - pill.getBoundingClientRect().right).toBeCloseTo(px('--nph-sidebar-item-padding'), 0);
  });
});

describe('the group', () => {
  it('is a button with aria-expanded and the arrow down; open, the arrow up and the solid icon', async () => {
    const item = await mount({ type: 'group', href: '' });
    const button = control(item);
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(arrow(item)?.name).toBe('chevron-down');
    expect(arrow(item)?.size).toBe('sm');
    expect(icon(item).variant).toBe('light');
    item.expanded = true;
    await item.updateComplete;
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(arrow(item)?.name).toBe('chevron-up');
    expect(icon(item).variant).toBe('solid');
  });

  it('the browser computes a button with its expanded state', async () => {
    const item = await mount({ type: 'group', href: '', label: 'Reports', icon: 'folder' });
    await settle(item);
    const node = await axNode(control(item));
    expect(node.role).toBe('button');
    expect(node.name).toBe('Reports');
  });

  it('a click toggles expanded and fires nph-toggle, which bubbles out of the shadow root', async () => {
    const item = await mount({ type: 'group', href: '' });
    const seen: NphSidebarItemToggleDetail[] = [];
    document.body.addEventListener('nph-toggle', (event) => {
      expect(event.composed).toBe(true);
      expect(event.cancelable).toBe(false);
      seen.push(event.detail);
    });
    await userEvent.click(control(item));
    await item.updateComplete;
    expect(item.expanded).toBe(true);
    await userEvent.click(control(item));
    await item.updateComplete;
    expect(item.expanded).toBe(false);
    expect(seen).toEqual([{ expanded: true }, { expanded: false }]);
  });

  it('Enter and Space toggle it from the keyboard', async () => {
    const item = await mount({ type: 'group', href: '' });
    control(item).focus();
    await userEvent.keyboard('{Enter}');
    await item.updateComplete;
    expect(item.expanded).toBe(true);
    await userEvent.keyboard(' ');
    await item.updateComplete;
    expect(item.expanded).toBe(false);
  });

  it('setting expanded from code fires nothing', async () => {
    const item = await mount({ type: 'group', href: '' });
    const seen = vi.fn();
    item.addEventListener('nph-toggle', seen);
    item.expanded = true;
    await item.updateComplete;
    expect(seen).not.toHaveBeenCalled();
  });

  it('a disabled group neither toggles nor fires', async () => {
    const item = await mount({ type: 'group', href: '', disabled: true });
    const seen = vi.fn();
    item.addEventListener('nph-toggle', seen);
    (control(item) as HTMLButtonElement).click();
    await item.updateComplete;
    expect(item.expanded).toBe(false);
    expect(seen).not.toHaveBeenCalled();
    expect((control(item) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('the disabled line', () => {
  it('is a link without href, with role link and aria-disabled, out of the Tab order', async () => {
    const before = document.createElement('button');
    before.textContent = 'before';
    document.body.append(before);
    const item = await mount({ disabled: true, tooltip: 'Inbox' });
    const after = document.createElement('button');
    after.textContent = 'after';
    document.body.append(after);
    const link = control(item);
    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('role')).toBe('link');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    before.focus();
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(after);
  });

  it('the browser still computes a link, disabled', async () => {
    const item = await mount({ disabled: true });
    await settle(item);
    const node = await axNode(control(item));
    expect(node.role).toBe('link');
    expect(node.name).toBe('Inbox');
  });

  it('lets no click through, and has no balloon and no more actions', async () => {
    const item = await mount({ disabled: true, tooltip: 'Inbox', actions: ACTIONS, actionsLabel: 'More actions' });
    const seen = vi.fn();
    item.addEventListener('click', seen);
    item.click();
    control(item).click();
    expect(seen).not.toHaveBeenCalled();
    expect(balloon(item)).toBeNull();
    expect(actionsButton(item)).toBeNull();
  });

  it('the whole line takes state/disabled-opacity and no hover', async () => {
    const item = await mount({ disabled: true });
    expect(getComputedStyle(item).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    await userEvent.hover(control(item));
    expect(getComputedStyle(control(item)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });
});

describe('colors, type and measures', () => {
  it('at rest: no background, sidebar/item-foreground and text/body-md', async () => {
    const item = await mount();
    const style = getComputedStyle(control(item));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.color).toBe(resolved('color', '--nph-sidebar-item-foreground'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-body-md-font-weight'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
  });

  it('on hover: sidebar/item-background-hover, the color of rest', async () => {
    const item = await mount();
    await userEvent.hover(control(item));
    const style = getComputedStyle(control(item));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-sidebar-item-background-hover'));
    expect(style.color).toBe(resolved('color', '--nph-sidebar-item-foreground'));
  });

  it('active: no background, sidebar/item-foreground-active and text/label-md', async () => {
    const item = await mount({ active: true });
    const style = getComputedStyle(control(item));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.color).toBe(resolved('color', '--nph-sidebar-item-foreground-active'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
  });

  it('open group: sidebar/item-foreground-open and text/label-md', async () => {
    const item = await mount({ type: 'group', href: '', expanded: true });
    const style = getComputedStyle(control(item));
    expect(style.color).toBe(resolved('color', '--nph-sidebar-item-foreground-open'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
  });

  it('height sidebar/item-height, padding sidebar/item-padding, gap space/control-padding, radius sidebar/item-radius', async () => {
    const item = await mount();
    const style = getComputedStyle(control(item));
    expect(control(item).getBoundingClientRect().height).toBeCloseTo(px('--nph-sidebar-item-height'), 0);
    expect(Number.parseFloat(style.paddingBlockStart)).toBeCloseTo(px('--nph-sidebar-item-padding'), 0);
    expect(Number.parseFloat(style.paddingInlineStart)).toBeCloseTo(px('--nph-sidebar-item-padding'), 0);
    expect(Number.parseFloat(style.columnGap)).toBeCloseTo(px('--nph-space-control-padding'), 0);
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-sidebar-item-radius'));
    const glyph = icon(item).getBoundingClientRect();
    expect(glyph.width).toBeCloseTo(px('--nph-icon-size-md'), 0);
  });
});

describe('focus', () => {
  it('keyboard focus draws the color/primary border and the focus/halo halo outside the line', async () => {
    const item = await mount();
    await userEvent.keyboard('{Tab}');
    expect(item.shadowRoot?.activeElement).toBe(control(item));
    const border = getComputedStyle(control(item), '::before');
    const halo = getComputedStyle(control(item), '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-color-primary'));
    expect(Number.parseFloat(border.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-sidebar-item'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(Number.parseFloat(halo.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-sidebar-item'));
    expect(Number.parseFloat(border.top)).toBeCloseTo(-px('--nph-border-width'), 1);
  });

  it('a mouse click gives no focus ring', async () => {
    const item = await mount({ type: 'group', href: '' });
    await userEvent.click(control(item));
    expect(getComputedStyle(control(item), '::before').content).toBe('none');
  });

  it('focus on the host goes to the inner control', async () => {
    const item = await mount();
    item.focus();
    expect(item.shadowRoot?.activeElement).toBe(control(item));
  });
});

describe('the balloon', () => {
  it('tooltip renders an nph-tooltip for the control, as its description', async () => {
    const item = await mount({ tooltip: 'Inbox of the team' });
    await settle(item);
    const tooltip = balloon(item) as NphTooltip;
    expect(tooltip.getAttribute('for')).toBe('control');
    expect(tooltip.text).toBe('Inbox of the team');
    expect(tooltip.relation).toBe('description');
    const node = await axNode(control(item));
    expect(node.name).toBe('Inbox');
    expect(node.description).toBe('Inbox of the team');
  });

  it('no tooltip, no balloon', async () => {
    const item = await mount();
    expect(balloon(item)).toBeNull();
  });

  it('keyboard focus opens it', async () => {
    const item = await mount({ tooltip: 'Inbox of the team' });
    await settle(item);
    await userEvent.keyboard('{Tab}');
    await settle(item);
    expect(balloon(item)?.open).toBe(true);
  });

  it('a click on the open balloon does not reach the host as a click on the line', async () => {
    const item = await mount({ tooltip: 'Inbox of the team' });
    await settle(item);
    const seen = vi.fn();
    item.addEventListener('click', seen);
    (balloon(item) as HTMLElement).click();
    expect(seen).not.toHaveBeenCalled();
  });
});

describe('more actions', () => {
  async function withActions(props: Partial<NphSidebarItem> = {}): Promise<NphSidebarItem> {
    const item = await mount({ actions: ACTIONS, actionsLabel: 'More actions', ...props });
    await settle(item);
    return item;
  }

  it('is the icon-only nph-button, ghost and compact, with ellipsis-vertical and its own name', async () => {
    const item = await withActions();
    const button = actionsButton(item) as HTMLElement & { emphasis: string; size: string; iconStart: string; label: string };
    expect(button.emphasis).toBe('ghost');
    expect(button.size).toBe('compact');
    expect(button.iconStart).toBe('ellipsis-vertical');
    expect(button.label).toBe('More actions');
    expect(control(item).contains(button)).toBe(false);
    expect(menu(item)?.getAttribute('for')).toBe(button.id);
    expect(menu(item)?.items).toBe(item.actions);
  });

  it('is hidden at rest and shown on hover, at the end of the line', async () => {
    const item = await withActions();
    const button = actionsButton(item) as HTMLElement;
    expect(getComputedStyle(button).opacity).toBe('0');
    expect(getComputedStyle(button).pointerEvents).toBe('none');
    await userEvent.hover(control(item));
    expect(getComputedStyle(button).opacity).toBe('1');
    const line = control(item).getBoundingClientRect();
    const box = button.getBoundingClientRect();
    expect(line.right - box.right).toBeCloseTo(px('--nph-sidebar-item-padding'), 0);
    expect(box.top + box.height / 2).toBeCloseTo(line.top + line.height / 2, 0);
  });

  it('Tab goes from the line to the button, which shows; Shift+Tab comes back', async () => {
    const item = await withActions();
    await userEvent.keyboard('{Tab}');
    expect(item.shadowRoot?.activeElement).toBe(control(item));
    expect(getComputedStyle(actionsButton(item) as HTMLElement).opacity).toBe('1');
    await userEvent.keyboard('{Tab}');
    expect(item.shadowRoot?.activeElement).toBe(actionsButton(item));
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(item.shadowRoot?.activeElement).toBe(control(item));
  });

  it('opens its menu, and the chosen action is fired on the host as nph-item-select', async () => {
    const item = await withActions();
    const seen: NphDropdownMenuItemSelectDetail[] = [];
    document.body.addEventListener('nph-item-select', (event) => seen.push(event.detail));
    await userEvent.hover(control(item));
    await userEvent.click(actionsButton(item) as HTMLElement);
    await settle(item);
    expect(menu(item)?.open).toBe(true);
    expect(actionsButton(item)?.getAttribute('aria-expanded')).toBe('true');
    const first = menu(item)?.shadowRoot?.querySelector('.item') as HTMLElement;
    await userEvent.click(first);
    await settle(item);
    expect(seen).toEqual([{ value: 'rename', checked: null }]);
  });

  it('the clicks on the button and in the menu are not a click on the line', async () => {
    const item = await withActions();
    const seen = vi.fn();
    item.addEventListener('click', seen);
    await userEvent.hover(control(item));
    await userEvent.click(actionsButton(item) as HTMLElement);
    await settle(item);
    await userEvent.click(menu(item)?.shadowRoot?.querySelector('.item') as HTMLElement);
    expect(seen).not.toHaveBeenCalled();
  });

  it('while it shows, the label leaves room for it', async () => {
    const item = await withActions({ counter: 4 });
    const before = (counter(item) as HTMLElement).getBoundingClientRect().right;
    await userEvent.hover(control(item));
    const button = (actionsButton(item) as HTMLElement).getBoundingClientRect();
    const after = (counter(item) as HTMLElement).getBoundingClientRect().right;
    expect(after).toBeLessThan(before);
    expect(after).toBeLessThanOrEqual(button.left);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, including the sidebar tokens of the evidence', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
    for (const name of [
      '--nph-sidebar-item-foreground',
      '--nph-sidebar-item-foreground-active',
      '--nph-sidebar-item-foreground-open',
      '--nph-sidebar-item-background-hover',
      '--nph-sidebar-item-badge-background',
      '--nph-sidebar-item-badge-foreground',
      '--nph-sidebar-item-height',
      '--nph-sidebar-item-padding',
      '--nph-sidebar-item-radius',
      '--nph-focus-border-radius-sidebar-item',
      '--nph-focus-radius-sidebar-item',
    ]) {
      expect(used, name).toContain(name);
    }
  });

  it('never consumes a core or theme token, nor the ring the evidence does not use', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/--nph-focus-border\)|--nph-focus-ring-sidebar|--nph-sidebar-item-background-active/);
  });

  it('the CSS has no literal color, measure or duration', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/);
  });
});
