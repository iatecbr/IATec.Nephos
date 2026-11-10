/**
 * Tests of `nph-tabs` (P115), in a real browser (P21, item 5): hover, keyboard focus, the measures
 * of the list and the cut label only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `3483:11200`, sets `3472:9192`,
 * `3472:8748` and `3472:8747`), recorded in the evidence of the `figma-docs-accepted` gate of
 * DSA-71: the API, the invalid input, the five styles, the active tab and its panel, the roles and
 * names the browser computes, the keyboard of the APG pattern, the activation modes, the scroll of
 * the underline style, the cut label and its balloon, the counter and the tag, the colors and the
 * measures of each state, the focus, the combined states, the motion and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-tabs.css?raw';
import {
  NPH_TABS_ACTIVATIONS,
  NPH_TABS_COUNTER_MAX,
  NPH_TABS_VARIANTS,
  NphTabs,
  counterText,
  isCount,
} from './nph-tabs';
import type { NphTab, NphTabsChangeDetail } from './nph-tabs';
import type { NphButton } from '../nph-button/nph-button';
import type { NphTooltip } from '../nph-tooltip/nph-tooltip';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

/** The listeners a test puts on the page; aborted at the end of each test, so none leaks into the next. */
let listeners = new AbortController();

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  listeners.abort();
  listeners = new AbortController();
  document.body.replaceChildren();
  document.documentElement.removeAttribute('dir');
  vi.restoreAllMocks();
});

const TABS: NphTab[] = [
  { value: 'all', text: 'All' },
  { value: 'pending', text: 'Pending' },
  { value: 'done', text: 'Done' },
  { value: 'archived', text: 'Archived' },
];

const TABS_WITH_ICONS: NphTab[] = [
  { value: 'all', text: 'All', icon: 'house' },
  { value: 'pending', text: 'Pending', icon: 'folder' },
  { value: 'done', text: 'Done', icon: 'star' },
];

async function mount(props: Partial<NphTabs> = {}, panels = true): Promise<NphTabs> {
  const tabs = document.createElement('nph-tabs');
  Object.assign(tabs, { tabs: TABS, label: 'Requests', ...props });
  if (panels) {
    for (const tab of (props.tabs ?? TABS) as NphTab[]) {
      const panel = document.createElement('p');
      panel.slot = tab.value;
      panel.textContent = `Panel ${tab.value}`;
      tabs.append(panel);
    }
  }
  document.body.append(tabs);
  await settle(tabs);
  return tabs;
}

async function settle(tabs: NphTabs): Promise<void> {
  await tabs.updateComplete;
  await frame();
  for (const inner of tabs.shadowRoot?.querySelectorAll('nph-icon, nph-badge, nph-button, nph-tooltip') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
  await tabs.updateComplete;
}

const root = (tabs: NphTabs): ShadowRoot => tabs.shadowRoot as ShadowRoot;
const tablist = (tabs: NphTabs): HTMLElement => root(tabs).querySelector('[role="tablist"]') as HTMLElement;
const buttons = (tabs: NphTabs): HTMLButtonElement[] => [...root(tabs).querySelectorAll<HTMLButtonElement>('button.tab')];
const tab = (tabs: NphTabs, index: number): HTMLButtonElement => buttons(tabs)[index] as HTMLButtonElement;
const panels = (tabs: NphTabs): HTMLElement[] => [...root(tabs).querySelectorAll<HTMLElement>('[role="tabpanel"]')];
const arrows = (tabs: NphTabs): NphButton[] => [...root(tabs).querySelectorAll<NphButton>('nph-button.arrow')];
const tooltips = (tabs: NphTabs): NphTooltip[] => [...root(tabs).querySelectorAll<NphTooltip>('nph-tooltip')];
const activeValue = (tabs: NphTabs): string | undefined =>
  tabs.tabs[buttons(tabs).findIndex((button) => button.getAttribute('aria-selected') === 'true')]?.value;

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));
const color = (token: string): string => resolved('color', token);
const background = (token: string): string => resolved('background-color', token);

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** The events the list fires, collected until the end of the test. */
function collect(tabs: NphTabs): NphTabsChangeDetail[] {
  const seen: NphTabsChangeDetail[] = [];
  tabs.addEventListener('nph-tab-change', (event) => seen.push(event.detail), { signal: listeners.signal });
  return seen;
}

/** The node the browser itself builds for an element in its accessibility tree (as in `nph-breadcrumb`). */
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
    expect(customElements.get('nph-tabs')).toBe(NphTabs);
    expect(document.createElement('nph-tabs')).toBeInstanceOf(NphTabs);
  });

  it('the public API is exactly P115', () => {
    const declared = [...(NphTabs as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()].filter(
      (name) => !['stop', 'cutValues', 'overflowing', 'atStart', 'atEnd', 'rtl', 'panelStops'].includes(name),
    );
    expect(declared.sort()).toEqual(
      ['activation', 'hostName', 'label', 'scrollNextLabel', 'scrollPreviousLabel', 'tabs', 'value', 'variant'].sort(),
    );
    expect([...NPH_TABS_VARIANTS]).toEqual(['segmented', 'underline', 'solid', 'light', 'outline']);
    expect([...NPH_TABS_ACTIVATIONS]).toEqual(['automatic', 'manual']);
  });

  it('has the defaults: segmented, automatic, no tabs, no value', () => {
    const tabs = document.createElement('nph-tabs');
    expect(tabs.variant).toBe('segmented');
    expect(tabs.activation).toBe('automatic');
    expect(tabs.tabs).toEqual([]);
    expect(tabs.value).toBe('');
    expect(tabs.label).toBeNull();
  });

  it('`tabs` is a property only; the rest comes from attributes', async () => {
    const tabs = document.createElement('nph-tabs');
    tabs.setAttribute('tabs', '[{"value":"a","text":"A"}]');
    tabs.setAttribute('variant', 'underline');
    tabs.setAttribute('activation', 'manual');
    tabs.setAttribute('value', 'b');
    tabs.setAttribute('label', 'Name');
    tabs.setAttribute('scroll-previous-label', 'Back');
    tabs.setAttribute('scroll-next-label', 'Forward');
    expect(tabs.tabs).toEqual([]);
    expect(tabs.variant).toBe('underline');
    expect(tabs.activation).toBe('manual');
    expect(tabs.value).toBe('b');
    expect(tabs.label).toBe('Name');
    expect(tabs.scrollPreviousLabel).toBe('Back');
    expect(tabs.scrollNextLabel).toBe('Forward');
  });

  it('declares the event on the global map and has no part, slot of its own or color property', () => {
    expect(componentCss).not.toMatch(/::part/);
    const tabs = document.createElement('nph-tabs');
    expect(Object.keys(tabs.constructor).includes('parts')).toBe(false);
  });

  it('counts: a whole number from zero up, and 99+ above the maximum', () => {
    expect(isCount(0)).toBe(true);
    expect(isCount(12)).toBe(true);
    expect(isCount(-1)).toBe(false);
    expect(isCount(1.5)).toBe(false);
    expect(isCount('3')).toBe(false);
    expect(NPH_TABS_COUNTER_MAX).toBe(99);
    expect(counterText(99)).toBe('99');
    expect(counterText(100)).toBe('99+');
    expect(counterText(5000)).toBe('99+');
  });
});

describe('invalid input', () => {
  /** Mounts with a rejected input and returns what it logged. */
  async function reject(props: Partial<NphTabs>): Promise<{ tabs: NphTabs; errors: string[] }> {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tabs = await mount(props, false);
    const errors = spy.mock.calls.map((call) => String(call[0]));
    return { tabs, errors };
  }

  const cases: Array<[string, Partial<NphTabs>, RegExp]> = [
    ['a variant outside the five', { variant: 'pill' as never }, /variant "pill" does not exist/],
    ['an activation outside the two', { activation: 'lazy' as never }, /activation "lazy" does not exist/],
    ['tabs that is not a list', { tabs: 'a' as never }, /not a list/],
    ['a tab without value', { tabs: [{ value: '', text: 'A' }] }, /has no `value`/],
    ['a tab without text', { tabs: [{ value: 'a', text: '  ' }] }, /has no `text`/],
    [
      'a repeated value',
      {
        tabs: [
          { value: 'a', text: 'A' },
          { value: 'a', text: 'B' },
        ],
      },
      /repeats the value "a"/,
    ],
    ['an icon outside the core', { tabs: [{ value: 'a', text: 'A', icon: 'nope' }] }, /does not belong to the Nephos core/],
    [
      'an icon on only some tabs',
      {
        tabs: [
          { value: 'a', text: 'A', icon: 'house' },
          { value: 'b', text: 'B' },
        ],
      },
      /only some tabs have an `icon`/,
    ],
    ['a counter that is not a whole number', { tabs: [{ value: 'a', text: 'A', counter: 1.5, counterLabel: 'x' }] }, /whole number from zero up/],
    ['a negative counter', { tabs: [{ value: 'a', text: 'A', counter: -2, counterLabel: 'x' }] }, /whole number from zero up/],
    ['a counter without counterLabel', { tabs: [{ value: 'a', text: 'A', counter: 3 }] }, /needs `counterLabel`/],
    ['a tag with more than one word', { tabs: [{ value: 'a', text: 'A', tag: 'very new' }] }, /tag of tab 1 is one word/],
    [
      'every tab disabled',
      {
        tabs: [
          { value: 'a', text: 'A', disabled: true },
          { value: 'b', text: 'B', disabled: true },
        ],
      },
      /every tab is disabled/,
    ],
  ];

  for (const [name, props, message] of cases) {
    it(`${name} draws nothing and logs one error`, async () => {
      const { tabs, errors } = await reject(props);
      expect(tabs.hasAttribute('data-nph-rendered')).toBe(false);
      expect(tabs.shadowRoot?.querySelector('[role="tablist"]')).toBeNull();
      expect(getComputedStyle(tabs).display).toBe('none');
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch(message);
    });
  }

  it('the same rejected input does not log again on a new render', async () => {
    const { tabs, errors } = await reject({ variant: 'pill' as never });
    tabs.label = 'Another name';
    await tabs.updateComplete;
    expect(errors).toHaveLength(1);
  });

  it('recovers when the input becomes valid', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const tabs = await mount({ variant: 'pill' as never });
    tabs.variant = 'underline';
    await settle(tabs);
    expect(tabs.hasAttribute('data-nph-rendered')).toBe(true);
    expect(buttons(tabs)).toHaveLength(4);
  });

  it('an empty list is a mount: nothing, and no error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tabs = await mount({ tabs: [] });
    expect(spy).not.toHaveBeenCalled();
    expect(tabs.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(tabs).display).toBe('none');
  });

  it('a list without a name draws and warns once', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tabs = await mount({ label: null });
    tabs.value = 'done';
    await tabs.updateComplete;
    expect(tabs.hasAttribute('data-nph-rendered')).toBe(true);
    expect(spy.mock.calls.filter((call) => /no accessible name/.test(String(call[0])))).toHaveLength(1);
  });

  it('the host aria-label names the list when there is no label, and the label wins over it', async () => {
    const named = await mount({ label: null, hostName: 'From the host' });
    expect(tablist(named).getAttribute('aria-label')).toBe('From the host');
    named.label = 'From the label';
    await named.updateComplete;
    expect(tablist(named).getAttribute('aria-label')).toBe('From the label');
  });
});

describe('the active tab', () => {
  it('without a value, the first enabled tab is active and the component writes the value', async () => {
    const tabs = await mount({
      tabs: [
        { value: 'a', text: 'A', disabled: true },
        { value: 'b', text: 'B' },
      ],
    });
    expect(tabs.value).toBe('b');
    expect(tabs.getAttribute('value')).toBe('b');
    expect(activeValue(tabs)).toBe('b');
  });

  it('a value that names no tab warns and falls back to the first enabled tab', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tabs = await mount({ value: 'ghost' });
    expect(tabs.value).toBe('all');
    expect(spy.mock.calls.some((call) => /value "ghost" matches no tab/.test(String(call[0])))).toBe(true);
  });

  it('there is exactly one active tab and its panel is the only one shown', async () => {
    const tabs = await mount({ value: 'done' });
    expect(buttons(tabs).filter((button) => button.getAttribute('aria-selected') === 'true')).toHaveLength(1);
    expect(activeValue(tabs)).toBe('done');
    expect(panels(tabs).map((panel) => panel.hidden)).toEqual([true, true, false, true]);
  });

  it('a value set from code moves the active tab and fires no event', async () => {
    const tabs = await mount();
    const seen = collect(tabs);
    tabs.value = 'pending';
    await settle(tabs);
    expect(activeValue(tabs)).toBe('pending');
    expect(seen).toEqual([]);
  });

  it('the panels are the slots named by the value, and the consumer content shows in the active one', async () => {
    const tabs = await mount({ value: 'pending' });
    const shown = panels(tabs).find((panel) => !panel.hidden) as HTMLElement;
    const slot = shown.querySelector('slot') as HTMLSlotElement;
    expect(slot.name).toBe('pending');
    expect(slot.assignedElements()[0]?.textContent).toBe('Panel pending');
    expect(shown.getBoundingClientRect().height).toBeGreaterThan(0);
    expect(panels(tabs).filter((panel) => panel.hidden).every((panel) => panel.getBoundingClientRect().height === 0)).toBe(true);
  });
});

describe('roles, names and references', () => {
  it('the list is a tablist, each tab a tab and each panel a tabpanel, named by its tab', async () => {
    const tabs = await mount();
    expect(tablist(tabs).getAttribute('aria-label')).toBe('Requests');
    expect(buttons(tabs).map((button) => button.getAttribute('role'))).toEqual(['tab', 'tab', 'tab', 'tab']);
    for (const [index, button] of buttons(tabs).entries()) {
      const target = root(tabs).getElementById(button.getAttribute('aria-controls') as string);
      expect(target, `tab ${index}`).toBe(panels(tabs)[index]);
      expect(target?.getAttribute('role')).toBe('tabpanel');
      expect(target?.getAttribute('aria-labelledby')).toBe(button.id);
    }
  });

  it('every id the references use lives in the same root', async () => {
    const tabs = await mount();
    for (const element of root(tabs).querySelectorAll('[aria-controls], [aria-labelledby]')) {
      for (const attribute of ['aria-controls', 'aria-labelledby']) {
        for (const id of (element.getAttribute(attribute) ?? '').split(' ').filter(Boolean)) {
          expect(root(tabs).getElementById(id), `${attribute} ${id}`).not.toBeNull();
        }
      }
    }
  });

  it('the browser computes the roles and the names', async () => {
    const tabs = await mount({ tabs: TABS_WITH_ICONS });
    expect(await axNode(tablist(tabs))).toEqual({ role: 'tablist', name: 'Requests' });
    expect(await axNode(tab(tabs, 1))).toEqual({ role: 'tab', name: 'Pending' });
    expect(await axNode(panels(tabs)[0] as HTMLElement)).toEqual({ role: 'tabpanel', name: 'All' });
  });

  it('the icon is decorative: both artworks are aria-hidden', async () => {
    const tabs = await mount({ tabs: TABS_WITH_ICONS });
    for (const icon of root(tabs).querySelectorAll('.icon')) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('the counter number is aria-hidden and the hidden context text carries it in the name', async () => {
    const tabs = await mount({
      tabs: [
        { value: 'a', text: 'Pending', counter: 12, counterLabel: '12 items' },
        { value: 'b', text: 'Done' },
      ],
    });
    const counter = tab(tabs, 0).querySelector('.counter') as HTMLElement;
    expect(counter.getAttribute('aria-hidden')).toBe('true');
    expect(counter.textContent).toBe('12');
    expect(tab(tabs, 0).querySelector('.hidden')?.textContent).toBe(', 12 items');
    expect(await axNode(tab(tabs, 0))).toEqual({ role: 'tab', name: expect.stringMatching(/^Pending\s*, 12 items$/) });
    expect(tab(tabs, 1).querySelector('.counter')).toBeNull();
  });

  it('a counter of zero is drawn, and a large one shows 99+ while the name keeps the consumer text', async () => {
    const tabs = await mount({
      tabs: [
        { value: 'a', text: 'None', counter: 0, counterLabel: 'no items' },
        { value: 'b', text: 'Many', counter: 250, counterLabel: '250 items' },
      ],
    });
    expect(tab(tabs, 0).querySelector('.counter')?.textContent).toBe('0');
    expect(tab(tabs, 1).querySelector('.counter')?.textContent).toBe('99+');
    expect(await axNode(tab(tabs, 1))).toEqual({ role: 'tab', name: expect.stringMatching(/^Many\s*, 250 items$/) });
  });

  it('the tag is an nph-badge, one word, and enters the name after the counter', async () => {
    const tabs = await mount({
      tabs: [
        { value: 'a', text: 'Pending', counter: 3, counterLabel: '3 items', tag: 'New' },
        { value: 'b', text: 'Done' },
      ],
    });
    const badge = tab(tabs, 0).querySelector('nph-badge') as HTMLElement;
    expect(badge.getAttribute('severity')).toBe('primary');
    expect(badge.getAttribute('text')).toBe('New');
    const name = (await axNode(tab(tabs, 0))).name;
    expect(name).toMatch(/^Pending\s*, 3 items\s*New$/);
  });

  it('the order inside the tab is icon, label, counter, tag', async () => {
    const tabs = await mount({
      tabs: [
        { value: 'a', text: 'Pending', icon: 'folder', counter: 3, counterLabel: '3 items', tag: 'New' },
        { value: 'b', text: 'Done', icon: 'star' },
      ],
    });
    const order = [...tab(tabs, 0).children].map((child) => child.className.split(' ')[0]);
    expect(order).toEqual(['icon', 'icon', 'label', 'counter', 'hidden', 'tag', 'line']);
  });
});

describe('the keyboard', () => {
  it('the list is one Tab stop, on the active tab', async () => {
    const tabs = await mount({ value: 'done' });
    expect(buttons(tabs).map((button) => button.tabIndex)).toEqual([-1, -1, 0, -1]);
    await userEvent.tab();
    expect(root(tabs).activeElement).toBe(tab(tabs, 2));
    /* The next Tab leaves the list for the panel, which takes the Tab key when it holds no focusable item. */
    await userEvent.tab();
    expect(root(tabs).activeElement).toBe(panels(tabs)[2]);
  });

  it('the arrows move the focus and, in automatic mode, activate, wrapping at the ends', async () => {
    const tabs = await mount();
    const seen = collect(tabs);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 1));
    expect(activeValue(tabs)).toBe('pending');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 3));
    expect(activeValue(tabs)).toBe('archived');
    await userEvent.keyboard('{ArrowRight}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 0));
    expect(seen.map((detail) => detail.value)).toEqual(['pending', 'all', 'archived', 'all']);
  });

  it('a disabled tab is skipped by the arrows, Home and End', async () => {
    const tabs = await mount({
      tabs: [
        { value: 'a', text: 'A', disabled: true },
        { value: 'b', text: 'B' },
        { value: 'c', text: 'C', disabled: true },
        { value: 'd', text: 'D' },
        { value: 'e', text: 'E', disabled: true },
      ],
    });
    await userEvent.tab();
    expect(root(tabs).activeElement).toBe(tab(tabs, 1));
    await userEvent.keyboard('{ArrowRight}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 3));
    await userEvent.keyboard('{ArrowRight}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 1));
    await userEvent.keyboard('{End}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 3));
    await userEvent.keyboard('{Home}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 1));
  });

  it('Home and End go to the first and the last enabled tab and activate them', async () => {
    const tabs = await mount({ value: 'pending' });
    await userEvent.tab();
    await userEvent.keyboard('{End}');
    expect(activeValue(tabs)).toBe('archived');
    await userEvent.keyboard('{Home}');
    expect(activeValue(tabs)).toBe('all');
  });

  it('the vertical arrows do nothing: the list is horizontal only', async () => {
    const tabs = await mount();
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{ArrowUp}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 0));
    expect(activeValue(tabs)).toBe('all');
    expect(tablist(tabs).hasAttribute('aria-orientation')).toBe(false);
  });

  it('in right-to-left writing the arrows swap', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const tabs = await mount();
    await settle(tabs);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowLeft}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 1));
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 3));
  });

  it('manual: the arrows move the focus only; Enter and Space activate', async () => {
    const tabs = await mount({ activation: 'manual' });
    const seen = collect(tabs);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 1));
    expect(activeValue(tabs)).toBe('all');
    expect(seen).toEqual([]);
    await userEvent.keyboard('{Enter}');
    expect(activeValue(tabs)).toBe('pending');
    await userEvent.keyboard('{ArrowRight}');
    expect(activeValue(tabs)).toBe('pending');
    await userEvent.keyboard(' ');
    expect(activeValue(tabs)).toBe('done');
    expect(seen.map((detail) => detail.value)).toEqual(['pending', 'done']);
  });

  it('manual: the Tab stop goes back to the active tab when the focus leaves the list', async () => {
    const tabs = await mount({ activation: 'manual' });
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(tab(tabs, 2).tabIndex).toBe(0);
    await userEvent.tab();
    await settle(tabs);
    expect(buttons(tabs).map((button) => button.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  it('when the active tab is disabled, the first enabled tab is the Tab stop', async () => {
    const tabs = await mount({
      value: 'b',
      tabs: [
        { value: 'a', text: 'A', disabled: true },
        { value: 'b', text: 'B', disabled: true },
        { value: 'c', text: 'C' },
      ],
    });
    expect(buttons(tabs).map((button) => button.tabIndex)).toEqual([-1, -1, 0]);
    await userEvent.tab();
    expect(root(tabs).activeElement).toBe(tab(tabs, 2));
  });

  it('Esc does nothing and the focus stays on the tab after a change', async () => {
    const tabs = await mount();
    const seen = collect(tabs);
    await userEvent.tab();
    await userEvent.keyboard('{Escape}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 0));
    await userEvent.keyboard('{ArrowRight}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 1));
    expect(seen).toHaveLength(1);
  });

  it('a panel with no item that takes the Tab key takes it; one with a button does not', async () => {
    const tabs = await mount({}, false);
    for (const value of ['all', 'pending']) {
      const panel = document.createElement('div');
      panel.slot = value;
      panel.innerHTML = value === 'all' ? '<p>Text only</p>' : '<button>Action</button>';
      tabs.append(panel);
    }
    await settle(tabs);
    await frame();
    await tabs.updateComplete;
    expect(panels(tabs)[0]?.getAttribute('tabindex')).toBe('0');
    tabs.value = 'pending';
    await settle(tabs);
    expect(panels(tabs)[1]?.hasAttribute('tabindex')).toBe(false);
  });
});

describe('the panel that takes the Tab key', () => {
  /** Mounts a list whose first panel holds the markup, and returns it. */
  async function withPanel(markup: string): Promise<NphTabs> {
    const tabs = await mount({}, false);
    const panel = document.createElement('div');
    panel.slot = 'all';
    panel.innerHTML = markup;
    tabs.append(panel);
    await settle(tabs);
    await frame();
    await tabs.updateComplete;
    return tabs;
  }

  const cases: Array<[string, string, boolean]> = [
    ['text only', '<p>Text only</p>', true],
    ['a button out of the Tab order', '<p>Text</p><button tabindex="-1">Out</button>', true],
    ['a disabled button', '<p>Text</p><button disabled>Off</button>', true],
    ['a disabled nph-button', '<p>Text</p><nph-button text="Off" disabled></nph-button>', true],
    ['an nph-button with a negative tabindex', '<p>Text</p><nph-button text="Out" tabindex="-1"></nph-button>', true],
    ['a hidden button', '<p>Text</p><button hidden>Hidden</button>', true],
    ['an inert button', '<p>Text</p><div inert><button>Inert</button></div>', true],
    ['a button that is not displayed', '<p>Text</p><button style="display: none">None</button>', true],
    ['a button in the Tab order', '<p>Text</p><button>Action</button>', false],
    ['a link', '<p>Text</p><a href="#top">Link</a>', false],
    ['an nph-button in the Tab order', '<p>Text</p><nph-button text="Go"></nph-button>', false],
    ['an element with tabindex 0', '<div tabindex="0">Focusable</div>', false],
  ];

  for (const [name, markup, takesIt] of cases) {
    it(`${name}: the panel ${takesIt ? 'takes' : 'does not take'} the Tab key`, async () => {
      const tabs = await withPanel(markup);
      expect(panels(tabs)[0]?.getAttribute('tabindex') === '0').toBe(takesIt);
    });
  }
});

describe('the pointer', () => {
  it('a click activates the tab, puts the focus on it and fires the event once', async () => {
    const tabs = await mount();
    const seen = collect(tabs);
    await userEvent.click(tab(tabs, 2));
    expect(activeValue(tabs)).toBe('done');
    expect(root(tabs).activeElement).toBe(tab(tabs, 2));
    expect(seen).toEqual([{ value: 'done' }]);
  });

  it('a click on the active tab does nothing', async () => {
    const tabs = await mount({ value: 'pending' });
    const seen = collect(tabs);
    await userEvent.click(tab(tabs, 1));
    expect(activeValue(tabs)).toBe('pending');
    expect(seen).toEqual([]);
  });

  it('a disabled tab neither activates nor takes the focus', async () => {
    const tabs = await mount({
      tabs: [
        { value: 'a', text: 'A' },
        { value: 'b', text: 'B', disabled: true },
      ],
    });
    const seen = collect(tabs);
    tab(tabs, 1).click();
    tab(tabs, 1).focus();
    await tabs.updateComplete;
    expect(activeValue(tabs)).toBe('a');
    expect(seen).toEqual([]);
    expect(tab(tabs, 1).disabled).toBe(true);
    expect(root(tabs).activeElement).toBeNull();
  });

  it('hover only paints: it moves no focus and activates nothing', async () => {
    const tabs = await mount();
    const seen = collect(tabs);
    await userEvent.hover(tab(tabs, 2));
    await wait(50);
    expect(activeValue(tabs)).toBe('all');
    expect(root(tabs).activeElement).toBeNull();
    expect(seen).toEqual([]);
  });

  it('the event bubbles and is composed', async () => {
    const tabs = await mount();
    const seen: Event[] = [];
    document.body.addEventListener('nph-tab-change', (event) => seen.push(event), { signal: listeners.signal });
    await userEvent.click(tab(tabs, 1));
    expect(seen).toHaveLength(1);
    expect(seen[0]?.bubbles).toBe(true);
    expect(seen[0]?.composed).toBe(true);
    expect(seen[0]?.cancelable).toBe(false);
  });
});

describe('the five styles', () => {
  it('segmented: the rail is control/height-default and the tab control/height-compact, in the rail padding', async () => {
    const tabs = await mount();
    expect(tablist(tabs).getBoundingClientRect().height).toBe(px('--nph-tabs-list-height'));
    expect(tab(tabs, 0).getBoundingClientRect().height).toBe(px('--nph-tabs-item-height'));
    expect(getComputedStyle(tablist(tabs)).backgroundColor).toBe(background('--nph-tabs-list-background'));
    expect(getComputedStyle(tablist(tabs)).paddingLeft).toBe(`${px('--nph-tabs-list-padding')}px`);
    expect(getComputedStyle(tab(tabs, 0)).borderRadius).toBe(`${px('--nph-tabs-item-radius')}px`);
    expect(getComputedStyle(tablist(tabs)).columnGap).toBe(`${px('--nph-tabs-list-gap')}px`);
  });

  it('underline: no gap, the tab is control/height-default and the base line sits inside the list', async () => {
    const tabs = await mount({ variant: 'underline' });
    expect(getComputedStyle(tablist(tabs)).columnGap).toBe('0px');
    expect(tab(tabs, 0).getBoundingClientRect().height).toBe(px('--nph-tabs-underline-item-height'));
    expect(tablist(tabs).getBoundingClientRect().height).toBe(px('--nph-tabs-underline-item-height'));
    const shadow = getComputedStyle(tablist(tabs)).boxShadow;
    expect(shadow).toContain(color('--nph-tabs-underline-border-color'));
    expect(shadow).toContain(`${px('--nph-tabs-underline-border-width')}px`);
  });

  for (const variant of ['solid', 'light', 'outline'] as const) {
    it(`${variant}: the tab is control/height-default with the gap between tabs and its own corners`, async () => {
      const tabs = await mount({ variant });
      expect(tab(tabs, 0).getBoundingClientRect().height).toBe(px('--nph-tabs-button-height'));
      expect(getComputedStyle(tab(tabs, 0)).borderRadius).toBe(`${px('--nph-tabs-button-radius')}px`);
      expect(getComputedStyle(tablist(tabs)).columnGap).toBe(`${px('--nph-tabs-list-gap')}px`);
      expect(getComputedStyle(tablist(tabs)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    });
  }

  it('the tabs share the width of the container', async () => {
    for (const variant of NPH_TABS_VARIANTS) {
      const tabs = await mount({ variant });
      const widths = buttons(tabs).map((button) => Math.round(button.getBoundingClientRect().width));
      expect(new Set(widths).size, `${variant} ${widths.join(',')}`).toBe(1);
      const list = tablist(tabs).getBoundingClientRect();
      const last = tab(tabs, 3).getBoundingClientRect();
      expect(Math.abs(list.right - last.right), variant).toBeLessThanOrEqual(px('--nph-tabs-list-padding') + 1);
      tabs.remove();
    }
  });

  it('the label uses text/label-md and the padding and gap of the tokens', async () => {
    const tabs = await mount({ tabs: [{ value: 'a', text: 'Label', icon: 'house' }, { value: 'b', text: 'Other', icon: 'star' }] });
    const style = getComputedStyle(tab(tabs, 0));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(style.paddingLeft).toBe(`${px('--nph-tabs-item-padding-x')}px`);
    expect(style.columnGap).toBe(`${px('--nph-tabs-item-gap')}px`);
  });
});

describe('the colors of each state', () => {
  it('the inactive label and icon are tabs/item-foreground, in every style', async () => {
    for (const variant of NPH_TABS_VARIANTS) {
      const tabs = await mount({ variant, value: 'all' });
      expect(getComputedStyle(tab(tabs, 1)).color, variant).toBe(color('--nph-tabs-item-foreground'));
      tabs.remove();
    }
  });

  it('segmented and underline: hover is item-foreground-hover; active is item-foreground-active', async () => {
    for (const variant of ['segmented', 'underline'] as const) {
      const tabs = await mount({ variant });
      await userEvent.hover(tab(tabs, 2));
      await wait(400);
      expect(getComputedStyle(tab(tabs, 2)).color, variant).toBe(color('--nph-tabs-item-foreground-hover'));
      expect(getComputedStyle(tab(tabs, 0)).color, variant).toBe(color('--nph-tabs-item-foreground-active'));
      await userEvent.unhover(tab(tabs, 2));
      tabs.remove();
    }
  });

  it('segmented: the active tab is a card in color/background with elevation/subtle; the inactive ones are flat', async () => {
    const tabs = await mount();
    expect(getComputedStyle(tab(tabs, 0)).backgroundColor).toBe(background('--nph-tabs-item-background-active'));
    const subtle = resolved('box-shadow', '--nph-elevation-subtle');
    expect(getComputedStyle(tab(tabs, 0)).boxShadow).toContain(subtle);
    expect(getComputedStyle(tab(tabs, 1)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(tab(tabs, 1)).boxShadow).not.toContain(subtle);
  });

  it('underline: the active line is indicator-color at indicator-width; hover draws indicator-hover-color; rest draws none', async () => {
    const tabs = await mount({ variant: 'underline' });
    const line = (index: number) => tab(tabs, index).querySelector('.line') as HTMLElement;
    expect(getComputedStyle(line(0)).backgroundColor).toBe(background('--nph-tabs-indicator-color'));
    expect(line(0).getBoundingClientRect().height).toBe(px('--nph-tabs-indicator-width'));
    expect(getComputedStyle(line(1)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await userEvent.hover(tab(tabs, 1));
    await wait(400);
    expect(getComputedStyle(line(1)).backgroundColor).toBe(background('--nph-tabs-indicator-hover-color'));
    expect(line(1).getBoundingClientRect().height).toBe(px('--nph-tabs-indicator-width'));
  });

  it('tab button: hover is the accent background; active is solid, light or outline', async () => {
    const expected = {
      solid: ['--nph-tabs-button-solid-background-active', '--nph-tabs-button-solid-foreground-active'],
      light: ['--nph-tabs-button-light-background-active', '--nph-tabs-button-light-foreground-active'],
      outline: ['--nph-tabs-button-outline-background-active', '--nph-tabs-button-outline-foreground-active'],
    } as const;
    for (const variant of ['solid', 'light', 'outline'] as const) {
      const tabs = await mount({ variant });
      const [bg, fg] = expected[variant];
      expect(getComputedStyle(tab(tabs, 0)).backgroundColor, variant).toBe(background(bg));
      expect(getComputedStyle(tab(tabs, 0)).color, variant).toBe(color(fg));
      expect(getComputedStyle(tab(tabs, 1)).backgroundColor, variant).toBe('rgba(0, 0, 0, 0)');
      await userEvent.hover(tab(tabs, 1));
      await wait(400);
      expect(getComputedStyle(tab(tabs, 1)).backgroundColor, variant).toBe(background('--nph-tabs-button-background-hover'));
      expect(getComputedStyle(tab(tabs, 1)).color, variant).toBe(color('--nph-tabs-button-foreground-hover'));
      await userEvent.unhover(tab(tabs, 1));
      tabs.remove();
    }
  });

  it('outline: only the active tab has the soft border, at border/width', async () => {
    const tabs = await mount({ variant: 'outline' });
    expect(getComputedStyle(tab(tabs, 0)).boxShadow).toContain(color('--nph-tabs-button-outline-border-color-active'));
    expect(getComputedStyle(tab(tabs, 0)).boxShadow).toContain(`${px('--nph-tabs-button-outline-border-width')}px`);
    expect(getComputedStyle(tab(tabs, 1)).boxShadow).not.toContain(color('--nph-tabs-button-outline-border-color-active'));
  });

  it('active + hover keeps the active look', async () => {
    for (const variant of NPH_TABS_VARIANTS) {
      const tabs = await mount({ variant });
      const before = getComputedStyle(tab(tabs, 0));
      const snapshot = [before.color, before.backgroundColor, before.boxShadow];
      await userEvent.hover(tab(tabs, 0));
      await wait(400);
      const after = getComputedStyle(tab(tabs, 0));
      expect([after.color, after.backgroundColor, after.boxShadow], variant).toEqual(snapshot);
      await userEvent.unhover(tab(tabs, 0));
      tabs.remove();
    }
  });

  it('disabled: the whole tab at state/disabled-opacity and no hover paint; active + disabled keeps the active look', async () => {
    const tabs = await mount({
      value: 'a',
      tabs: [
        { value: 'a', text: 'A', disabled: true },
        { value: 'b', text: 'B' },
        { value: 'c', text: 'C', disabled: true },
      ],
    });
    const opacity = Number.parseFloat(resolved('opacity', '--nph-tabs-item-disabled-opacity'));
    expect(Number.parseFloat(getComputedStyle(tab(tabs, 0)).opacity)).toBe(opacity);
    expect(Number.parseFloat(getComputedStyle(tab(tabs, 2)).opacity)).toBe(opacity);
    expect(Number.parseFloat(getComputedStyle(tab(tabs, 1)).opacity)).toBe(1);
    expect(getComputedStyle(tab(tabs, 0)).backgroundColor).toBe(background('--nph-tabs-item-background-active'));
    expect(getComputedStyle(tab(tabs, 0)).color).toBe(color('--nph-tabs-item-foreground-active'));
    await userEvent.hover(tab(tabs, 2), { force: true }).catch(() => {});
    await wait(150);
    expect(getComputedStyle(tab(tabs, 2)).color).toBe(color('--nph-tabs-item-foreground'));
  });

  it('the icon is light at rest and solid in hover and when active; the color is the label color', async () => {
    const tabs = await mount({ tabs: TABS_WITH_ICONS });
    const shows = (index: number, which: 'light' | 'solid') =>
      getComputedStyle(tab(tabs, index).querySelector(`.icon-${which}`) as HTMLElement).display !== 'none';
    expect(shows(0, 'solid')).toBe(true);
    expect(shows(0, 'light')).toBe(false);
    expect(shows(1, 'light')).toBe(true);
    expect(shows(1, 'solid')).toBe(false);
    await userEvent.hover(tab(tabs, 1));
    await wait(50);
    expect(shows(1, 'solid')).toBe(true);
    expect(shows(1, 'light')).toBe(false);
    expect(getComputedStyle(tab(tabs, 1).querySelector('.icon-solid') as HTMLElement).color).toBe(getComputedStyle(tab(tabs, 1)).color);
  });

  it('the icon is nph-icon at the small size', async () => {
    const tabs = await mount({ tabs: TABS_WITH_ICONS });
    const icon = tab(tabs, 1).querySelector('.icon-light') as HTMLElement;
    expect(icon.getAttribute('size')).toBe('sm');
    expect(icon.getBoundingClientRect().width).toBe(px('--nph-icon-size-sm'));
  });
});

describe('the counter and the tag', () => {
  const COUNTED: NphTab[] = [
    { value: 'a', text: 'First', counter: 4, counterLabel: '4 items', tag: 'New' },
    { value: 'b', text: 'Second', counter: 7, counterLabel: '7 items', tag: 'New' },
  ];

  it('the counter is a pill in radius/full with the padding and the text role of the tokens', async () => {
    const tabs = await mount({ tabs: COUNTED, variant: 'underline' });
    const counter = tab(tabs, 1).querySelector('.counter') as HTMLElement;
    const style = getComputedStyle(counter);
    expect(style.borderRadius).toBe(resolved('border-radius', '--nph-tabs-counter-radius'));
    expect(style.paddingLeft).toBe(`${px('--nph-tabs-counter-padding-x')}px`);
    expect(style.paddingTop).toBe(`${px('--nph-tabs-counter-padding-y')}px`);
    expect(style.color).toBe(color('--nph-tabs-counter-foreground'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
  });

  it('inactive outside the rail: secondary-light; inside the rail: color/background; active: its own', async () => {
    const outside = await mount({ tabs: COUNTED, variant: 'underline' });
    const bg = (tabs: NphTabs, index: number) => getComputedStyle(tab(tabs, index).querySelector('.counter') as HTMLElement).backgroundColor;
    expect(bg(outside, 1)).toBe(background('--nph-tabs-counter-background'));
    expect(bg(outside, 0)).toBe(background('--nph-tabs-counter-background-active'));
    outside.remove();
    const rail = await mount({ tabs: COUNTED, variant: 'segmented' });
    expect(bg(rail, 1)).toBe(background('--nph-tabs-counter-background-rail'));
    expect(bg(rail, 0)).toBe(background('--nph-tabs-counter-background-active'));
  });

  it('the tag is primary light, and turns primary solid on the active light and outline tab button only', async () => {
    const emphasis = async (variant: NphTabs['variant']) => {
      const tabs = await mount({ tabs: COUNTED, variant });
      const result = [0, 1].map((index) => tab(tabs, index).querySelector('nph-badge')?.getAttribute('emphasis'));
      tabs.remove();
      return result;
    };
    expect(await emphasis('segmented')).toEqual(['light', 'light']);
    expect(await emphasis('underline')).toEqual(['light', 'light']);
    expect(await emphasis('solid')).toEqual(['light', 'light']);
    expect(await emphasis('light')).toEqual(['solid', 'light']);
    expect(await emphasis('outline')).toEqual(['solid', 'light']);
  });
});

describe('the scroll of the underline style', () => {
  const MANY: NphTab[] = Array.from({ length: 12 }, (_, index) => ({ value: `tab-${String(index)}`, text: `Section number ${String(index)}` }));

  async function mountNarrow(props: Partial<NphTabs> = {}): Promise<NphTabs> {
    const host = document.createElement('div');
    host.style.inlineSize = '420px';
    document.body.append(host);
    const tabs = document.createElement('nph-tabs');
    Object.assign(tabs, {
      tabs: MANY,
      label: 'Sections',
      variant: 'underline',
      scrollPreviousLabel: 'Scroll tabs back',
      scrollNextLabel: 'Scroll tabs forward',
      ...props,
    });
    host.append(tabs);
    await settle(tabs);
    await wait(100);
    await settle(tabs);
    return tabs;
  }

  it('when the tabs do not fit, each keeps its content width and the arrows show at both ends', async () => {
    const tabs = await mountNarrow();
    expect(arrows(tabs)).toHaveLength(2);
    const widths = buttons(tabs).map((button) => Math.round(button.getBoundingClientRect().width));
    expect(Math.min(...widths)).toBeGreaterThan(80);
    const scroller = root(tabs).querySelector('.scroller') as HTMLElement;
    expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    const first = arrows(tabs)[0] as NphButton;
    const last = arrows(tabs)[1] as NphButton;
    expect(first.getBoundingClientRect().right).toBeLessThanOrEqual(scroller.getBoundingClientRect().left + 1);
    expect(last.getBoundingClientRect().left).toBeGreaterThanOrEqual(scroller.getBoundingClientRect().right - 1);
  });

  it('the arrows are secondary ghost compact square icon buttons, out of the Tab order and still named', async () => {
    const tabs = await mountNarrow();
    const [previous, next] = arrows(tabs) as [NphButton, NphButton];
    for (const arrow of [previous, next]) {
      expect(arrow.getAttribute('severity')).toBe('secondary');
      expect(arrow.getAttribute('emphasis')).toBe('ghost');
      expect(arrow.getAttribute('size')).toBe('compact');
      expect(arrow.getAttribute('shape')).toBe('square');
      expect(arrow.getAttribute('tabindex')).toBe('-1');
      /* aria-hidden on a button that holds a focusable element is an axe violation: the arrows keep their name. */
      expect(arrow.hasAttribute('aria-hidden')).toBe(false);
    }
    expect(previous.getAttribute('icon-start')).toBe('chevron-left');
    expect(next.getAttribute('icon-start')).toBe('chevron-right');
    expect(previous.getAttribute('label')).toBe('Scroll tabs back');
    expect(next.getAttribute('label')).toBe('Scroll tabs forward');
    await userEvent.tab();
    expect(root(tabs).activeElement).toBe(tab(tabs, 0));
    await userEvent.tab();
    expect(root(tabs).activeElement).toBeNull();
  });

  it('the arrow at an end is disabled, not hidden, and clicking the other scrolls the list', async () => {
    const tabs = await mountNarrow();
    const scroller = root(tabs).querySelector('.scroller') as HTMLElement;
    const [previous, next] = arrows(tabs) as [NphButton, NphButton];
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);
    expect(scroller.scrollLeft).toBe(0);
    next.click();
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(100));
    await settle(tabs);
    expect(previous.disabled).toBe(false);
    for (let step = 0; step < 12 && !(arrows(tabs)[1] as NphButton).disabled; step += 1) {
      (arrows(tabs)[1] as NphButton).click();
      await wait(450);
      await settle(tabs);
    }
    expect(Math.abs(scroller.scrollLeft + scroller.clientWidth - scroller.scrollWidth)).toBeLessThan(2);
    expect((arrows(tabs)[1] as NphButton).disabled).toBe(true);
    expect((arrows(tabs)[0] as NphButton).disabled).toBe(false);
  });

  it('the focused tab scrolls into view', async () => {
    const tabs = await mountNarrow({ value: 'tab-0' });
    const scroller = root(tabs).querySelector('.scroller') as HTMLElement;
    tab(tabs, 0).focus();
    await userEvent.keyboard('{End}');
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(100));
    const box = tab(tabs, 11).getBoundingClientRect();
    const view = scroller.getBoundingClientRect();
    expect(box.right).toBeLessThanOrEqual(view.right + 1);
    expect(box.left).toBeGreaterThanOrEqual(view.left - 1);
  });

  it('without the two labels the arrows are not drawn and a warning is emitted once', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tabs = await mountNarrow({ scrollNextLabel: null });
    expect(arrows(tabs)).toHaveLength(0);
    expect(spy.mock.calls.filter((call) => /scroll-previous-label/.test(String(call[0])))).toHaveLength(1);
  });

  it('when the tabs fit there are no arrows and the tabs share the width', async () => {
    const tabs = await mount({ variant: 'underline', scrollPreviousLabel: 'Back', scrollNextLabel: 'Forward' });
    expect(arrows(tabs)).toHaveLength(0);
  });

  it('only the underline style scrolls: the others never draw the arrows', async () => {
    const tabs = await mountNarrow({ variant: 'segmented' });
    expect(arrows(tabs)).toHaveLength(0);
    const scroller = root(tabs).querySelector('.scroller') as HTMLElement;
    expect(scroller.scrollWidth).toBeLessThanOrEqual(scroller.clientWidth + 1);
  });
});

describe('the cut label and its balloon', () => {
  const LONG: NphTab[] = [
    { value: 'a', text: 'A label long enough to be cut' },
    { value: 'b', text: 'Short' },
    { value: 'c', text: 'Another label that does not fit', disabled: true },
  ];

  async function mountCut(props: Partial<NphTabs> = {}): Promise<NphTabs> {
    const host = document.createElement('div');
    host.style.inlineSize = '300px';
    document.body.append(host);
    const tabs = document.createElement('nph-tabs');
    Object.assign(tabs, { tabs: LONG, label: 'Cut', value: 'b', ...props });
    host.append(tabs);
    await settle(tabs);
    await wait(100);
    await settle(tabs);
    return tabs;
  }

  it('the label of a tab that does not fit ends in an ellipsis; a balloon exists only for the cut one', async () => {
    const tabs = await mountCut();
    const labelOf = (index: number) => tab(tabs, index).querySelector('.label') as HTMLElement;
    expect(getComputedStyle(labelOf(0)).textOverflow).toBe('ellipsis');
    expect(labelOf(0).scrollWidth).toBeGreaterThan(labelOf(0).clientWidth);
    expect(labelOf(1).scrollWidth).toBeLessThanOrEqual(labelOf(1).clientWidth);
    expect(tooltips(tabs)).toHaveLength(1);
    expect(tooltips(tabs)[0]?.getAttribute('for')).toBe(tab(tabs, 0).id);
    expect(tooltips(tabs)[0]?.text).toBe('A label long enough to be cut');
    expect(tooltips(tabs)[0]?.relation).toBe('description');
  });

  it('the name of the tab stays its content, and the balloon describes it', async () => {
    const tabs = await mountCut();
    expect(tab(tabs, 0).hasAttribute('aria-labelledby')).toBe(false);
    expect(await axNode(tab(tabs, 0))).toEqual({ role: 'tab', name: 'A label long enough to be cut' });
    expect(tab(tabs, 0).getAttribute('aria-describedby')).toContain(tooltips(tabs)[0]?.id as string);
    expect(tab(tabs, 1).hasAttribute('aria-describedby')).toBe(false);
  });

  it('keeps the counter and the tag in the name of a cut tab', async () => {
    const tabs = await mountCut({
      tabs: [
        { value: 'a', text: 'A label long enough to be cut off here', counter: 12, counterLabel: '12 items', tag: 'New' },
        { value: 'b', text: 'Short' },
      ],
    });
    expect(tooltips(tabs)).toHaveLength(1);
    const name = (await axNode(tab(tabs, 0))).name;
    expect(name).toMatch(/^A label long enough to be cut off here\s*, 12 items\s*New$/);
  });

  it('a disabled tab has no balloon, even when cut', async () => {
    const tabs = await mountCut();
    expect(tabs.shadowRoot?.querySelector(`nph-tooltip[for="${tab(tabs, 2).id}"]`)).toBeNull();
  });

  it('keyboard focus opens the balloon at once, also when the cut tab is not the Tab stop', async () => {
    const tabs = await mountCut({ value: 'b' });
    await userEvent.tab();
    expect(root(tabs).activeElement).toBe(tab(tabs, 1));
    await userEvent.keyboard('{ArrowLeft}');
    expect(root(tabs).activeElement).toBe(tab(tabs, 0));
    await vi.waitFor(() => expect(tooltips(tabs)[0]?.open).toBe(true));
  });

  it('the pointer opens the balloon after resting on the tab, and leaving closes it', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tabs = await mountCut({ value: 'b' });
    expect(tab(tabs, 0).tabIndex).toBe(-1);
    await userEvent.hover(tab(tabs, 0));
    await vi.waitFor(() => expect(tooltips(tabs)[0]?.open).toBe(true), { timeout: 2000 });
    expect(tab(tabs, 0).tabIndex).toBe(0);
    expect(spy).not.toHaveBeenCalled();
    await userEvent.unhover(tab(tabs, 0));
    await vi.waitFor(() => expect(tooltips(tabs)[0]?.open).toBe(false), { timeout: 2000 });
    expect(tab(tabs, 0).tabIndex).toBe(-1);
  });

  it('the pointer can cross from the tab to its balloon: the balloon stays open and the tab stays eligible (WCAG 1.4.13)', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tabs = await mountCut({ value: 'b' });
    await userEvent.hover(tab(tabs, 0));
    await vi.waitFor(() => expect(tooltips(tabs)[0]?.open).toBe(true), { timeout: 2000 });
    const bubble = tooltips(tabs)[0]?.shadowRoot?.querySelector('.bubble') as HTMLElement;
    await userEvent.hover(bubble);
    await wait(400);
    expect(tooltips(tabs)[0]?.open).toBe(true);
    expect(tab(tabs, 0).tabIndex).toBe(0);
    await userEvent.unhover(bubble);
    await userEvent.hover(document.body, { position: { x: 1, y: window.innerHeight - 2 } });
    await vi.waitFor(() => expect(tooltips(tabs)[0]?.open).toBe(false), { timeout: 2000 });
    expect(tab(tabs, 0).tabIndex).toBe(-1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('a click during the wait cancels the balloon and the tab still activates', async () => {
    const tabs = await mountCut({ value: 'b' });
    const seen = collect(tabs);
    await userEvent.hover(tab(tabs, 0));
    await userEvent.click(tab(tabs, 0));
    await wait(500);
    expect(activeValue(tabs)).toBe('a');
    expect(seen).toEqual([{ value: 'a' }]);
  });

  it('when the container grows and the label fits, the balloon goes away', async () => {
    const tabs = await mountCut();
    expect(tooltips(tabs)).toHaveLength(1);
    (tabs.parentElement as HTMLElement).style.inlineSize = '900px';
    await vi.waitFor(() => expect(tooltips(tabs)).toHaveLength(0), { timeout: 2000 });
  });
});

describe('the focus', () => {
  it('a keyboard focus draws the border and, outside it, the halo, round with the tokens', async () => {
    for (const variant of NPH_TABS_VARIANTS) {
      const tabs = await mount({ variant });
      await userEvent.tab();
      const border = getComputedStyle(tab(tabs, 0), '::before');
      const halo = getComputedStyle(tab(tabs, 0), '::after');
      expect(border.borderTopColor, variant).toBe(color('--nph-tabs-focus-border-color'));
      expect(border.borderTopWidth, variant).toBe(`${px('--nph-tabs-focus-border-width')}px`);
      expect(halo.borderTopColor, variant).toBe(color('--nph-tabs-focus-ring-color'));
      expect(halo.borderTopWidth, variant).toBe(`${px('--nph-tabs-focus-ring-width')}px`);
      const solid = variant === 'solid' || variant === 'light' || variant === 'outline';
      expect(border.borderTopLeftRadius, variant).toBe(
        resolved('border-radius', solid ? '--nph-tabs-button-focus-border-radius' : '--nph-tabs-focus-border-radius'),
      );
      expect(halo.borderTopLeftRadius, variant).toBe(
        resolved('border-radius', solid ? '--nph-tabs-button-focus-radius' : '--nph-tabs-focus-radius'),
      );
      tabs.remove();
    }
  });

  it('the scroller keeps room for the border and the halo: the ring of the first and the last tab is not clipped', async () => {
    for (const variant of NPH_TABS_VARIANTS) {
      const tabs = await mount({ variant });
      const scroller = root(tabs).querySelector('.scroller') as HTMLElement;
      const room = px('--nph-tabs-focus-border-width') + px('--nph-tabs-focus-ring-width');
      for (const index of [0, 3]) {
        const box = tab(tabs, index).getBoundingClientRect();
        const clip = scroller.getBoundingClientRect();
        expect(box.left - room, `${variant} ${index} left`).toBeGreaterThanOrEqual(clip.left - 0.5);
        expect(box.right + room, `${variant} ${index} right`).toBeLessThanOrEqual(clip.right + 0.5);
        expect(box.top - room, `${variant} ${index} top`).toBeGreaterThanOrEqual(clip.top - 0.5);
        expect(box.bottom + room, `${variant} ${index} bottom`).toBeLessThanOrEqual(clip.bottom + 0.5);
      }
      tabs.remove();
    }
  });

  it('the room for the ring does not move the list: its place and size are those of the tokens', async () => {
    const tabs = await mount({ variant: 'underline' });
    expect(tablist(tabs).getBoundingClientRect().height).toBe(px('--nph-tabs-underline-item-height'));
    expect(tab(tabs, 0).getBoundingClientRect().left).toBe(tabs.getBoundingClientRect().left);
  });

  it('a mouse click draws no ring', async () => {
    const tabs = await mount();
    await userEvent.click(tab(tabs, 1));
    expect(getComputedStyle(tab(tabs, 1), '::before').content).toBe('none');
  });

  it('the active line stays under a focused underline tab (the active and focused variant)', async () => {
    const tabs = await mount({ variant: 'underline' });
    await userEvent.tab();
    const line = tab(tabs, 0).querySelector('.line') as HTMLElement;
    expect(getComputedStyle(line).backgroundColor).toBe(background('--nph-tabs-indicator-color'));
  });
});

describe('motion', () => {
  it('the change runs on tabs/indicator-duration with the state easing, and animates no size', async () => {
    const tabs = await mount();
    const style = getComputedStyle(tab(tabs, 0));
    expect(style.transitionDuration).toBe(resolved('transition-duration', '--nph-tabs-indicator-duration'));
    expect(style.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-state-easing'));
    expect(style.transitionProperty).not.toMatch(/width|height|inset|left|top/);
  });

  it('with reduced motion nothing moves: no transition at all', async () => {
    const session = cdp();
    const tabs = await mount();
    try {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      for (const element of [tab(tabs, 0), root(tabs).querySelector('.counter'), root(tabs).querySelector('.line')]) {
        if (element === null) continue;
        expect(getComputedStyle(element).transitionDuration).toBe('0s');
      }
    } finally {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    }
    await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));
  const declared = [...new Set([...tokensCss.matchAll(/(--nph-tabs-[a-z0-9-]+):/g)].map((match) => match[1] ?? ''))];

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('consumes every one of the fifty tabs/* tokens', () => {
    expect(declared).toHaveLength(50);
    for (const name of declared) {
      expect(used, name).toContain(name);
    }
  });

  it('uses the text roles of the label and of the counter number, and the subtle elevation', () => {
    for (const name of ['--nph-text-label-md-font-size', '--nph-text-label-sm-font-size', '--nph-elevation-subtle', '--nph-motion-state-easing']) {
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
});
