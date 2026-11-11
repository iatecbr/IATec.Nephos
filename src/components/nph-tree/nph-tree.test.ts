/**
 * Tests of `nph-tree` (P118), in a real browser (P21, item 5): hover, keyboard focus, the cut label
 * and its balloon, the roles and names the browser computes and the motion only exist where there is
 * layout.
 *
 * They prove the contract accepted in Figma (documentation frame `5876:216753`, sets `5485:350`,
 * `5485:421` and `5485:766`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-75:
 * the API, the invalid input, the roles and names, the Tab stop and the keys of the APG tree view, the
 * three selections and the cascade, the load on demand with its error row, the empty tree, the colors
 * and the measures of each state, the focus, the combined states, the motion and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-tree.css?raw';
import { NPH_TREE_SELECTIONS, NPH_TREE_SKELETON_ROWS, NphTree } from './nph-tree';
import type { NphTreeCheckDetail, NphTreeLoadDetail, NphTreeNode, NphTreeSelectDetail, NphTreeToggleDetail } from './nph-tree';
import { BRANDS } from '../../shared/docs/brands';
import type { NphTooltip } from '../nph-tooltip/nph-tooltip';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.load('600 14px "Noto Sans"');
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

const NODES: NphTreeNode[] = [
  {
    id: 'docs',
    label: 'Documents',
    children: [
      {
        id: 'reports',
        label: 'Reports',
        children: [
          { id: 'q1', label: 'Q1.pdf' },
          { id: 'q2', label: 'Q2.pdf' },
        ],
      },
      { id: 'notes', label: 'Notes.txt' },
    ],
  },
  { id: 'images', label: 'Images', children: [{ id: 'logo', label: 'Logo.png' }] },
  { id: 'readme', label: 'Readme.md' },
];

const TEXTS = {
  label: 'Files',
  emptyHeading: 'No items',
  emptyDescription: 'This folder has no items yet.',
  errorText: "Couldn't load.",
  retryText: 'Try again',
};

/** A tree in a block of its own width. */
async function mount(props: Partial<NphTree> = {}, width = '20rem'): Promise<NphTree> {
  const holder = document.createElement('div');
  holder.style.inlineSize = width;
  const tree = document.createElement('nph-tree');
  Object.assign(tree, { items: NODES, ...TEXTS, ...props });
  holder.append(tree);
  document.body.append(holder);
  await settle(tree);
  return tree;
}

async function settle(tree: NphTree): Promise<void> {
  await tree.updateComplete;
  await frame();
  for (const inner of tree.shadowRoot?.querySelectorAll('nph-icon, nph-checkbox, nph-tooltip, nph-empty, nph-skeleton, nph-spinner') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
  await tree.updateComplete;
}

const root = (tree: NphTree): ShadowRoot => tree.shadowRoot as ShadowRoot;
const item = (tree: NphTree, key: string): HTMLElement =>
  [...root(tree).querySelectorAll<HTMLElement>('[role="treeitem"]')].find((element) => element.dataset.key === key) as HTMLElement;
const face = (tree: NphTree, key: string): HTMLElement => item(tree, key).querySelector('.face') as HTMLElement;
const labelOf = (tree: NphTree, key: string): HTMLElement => item(tree, key).querySelector('.label') as HTMLElement;
const toggleOf = (tree: NphTree, key: string): HTMLElement => item(tree, key).querySelector('.toggle') as HTMLElement;
const keys = (tree: NphTree): string[] => [...root(tree).querySelectorAll<HTMLElement>('[role="treeitem"]')].map((element) => element.dataset.key ?? '');
const focusedKey = (tree: NphTree): string | null => (root(tree).activeElement as HTMLElement | null)?.dataset.key ?? null;
const tooltips = (tree: NphTree): NphTooltip[] => [...root(tree).querySelectorAll<NphTooltip>('nph-tooltip')];

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

/** The events the tree fires, collected until the end of the test. */
function collect<T>(tree: NphTree, name: string): T[] {
  const seen: T[] = [];
  tree.addEventListener(name, (event) => seen.push((event as CustomEvent<T>).detail), { signal: listeners.signal });
  return seen;
}

interface AxProbe {
  role: string;
  name: string;
  properties: Record<string, unknown>;
  chain: string[];
}

/** The node the browser itself builds for an element in its accessibility tree, and the roles above it. */
async function axNode(element: Element): Promise<AxProbe> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: true });
    const byId = new Map(nodes.map((node) => [node.nodeId, node]));
    const own = nodes[0];
    const chain: string[] = [];
    let parent = own?.parentId === undefined ? undefined : byId.get(own.parentId);
    while (parent !== undefined) {
      if (parent.ignored !== true) chain.push(String(parent.role?.value ?? ''));
      parent = parent.parentId === undefined ? undefined : byId.get(parent.parentId);
    }
    const properties = Object.fromEntries((own?.properties ?? []).map((property) => [property.name, property.value.value]));
    return { role: String(own?.role?.value ?? ''), name: String(own?.name?.value ?? ''), properties, chain };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

/** Puts the focus on the Tab stop of the tree by the keyboard, so the focus ring counts. */
async function enter(tree: NphTree): Promise<void> {
  const before = document.createElement('button');
  before.textContent = 'before';
  tree.parentElement?.before(before);
  before.focus();
  await userEvent.tab();
  await tree.updateComplete;
}

describe('registration and API', () => {
  it('defines the tag once and has the defaults of the contract', async () => {
    expect(customElements.get('nph-tree')).toBe(NphTree);
    const tree = await mount({ items: [] });
    expect(tree.selection).toBe('none');
    expect(tree.selected).toBeNull();
    expect(tree.checked).toEqual([]);
    expect(tree.expanded).toEqual([]);
    expect(tree.icons).toBe(false);
    expect(tree.checkStrictly).toBe(false);
    expect(tree.loading).toBe(false);
  });

  it('lists the three selections of the Figma `seleção`', () => {
    expect([...NPH_TREE_SELECTIONS]).toEqual(['none', 'single', 'multiple']);
  });

  it('reflects selection, icons, check-strictly and loading', async () => {
    const tree = await mount({ selection: 'single', icons: true, checkStrictly: true, loading: true });
    expect(tree.getAttribute('selection')).toBe('single');
    expect(tree.hasAttribute('icons')).toBe(true);
    expect(tree.hasAttribute('check-strictly')).toBe(true);
    expect(tree.hasAttribute('loading')).toBe(true);
    tree.setAttribute('selection', 'multiple');
    expect(tree.selection).toBe('multiple');
    tree.setAttribute('check-strictly', '');
    expect(tree.checkStrictly).toBe(true);
  });

  it('draws one item per open node and none for the children of a closed branch', async () => {
    const tree = await mount();
    expect(keys(tree)).toEqual(['docs', 'images', 'readme']);
    tree.expanded = ['docs'];
    await settle(tree);
    expect(keys(tree)).toEqual(['docs', 'reports', 'notes', 'images', 'readme']);
    tree.expanded = ['docs', 'reports'];
    await settle(tree);
    expect(keys(tree)).toEqual(['docs', 'reports', 'q1', 'q2', 'notes', 'images', 'readme']);
  });

  it('the host takes the layout of the container: a block with no overflow of its own', async () => {
    const tree = await mount();
    expect(getComputedStyle(tree).display).toBe('block');
    expect(getComputedStyle(tree).overflow).toBe('visible');
    expect(getComputedStyle(tree).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(tree).borderTopWidth).toBe('0px');
  });

  it('draws a branch for `children` and for `branch: true`, and a leaf for the rest', async () => {
    const tree = await mount({ items: [{ id: 'a', label: 'A', children: [{ id: 'b', label: 'B' }] }, { id: 'c', label: 'C', branch: true }, { id: 'd', label: 'D' }] });
    expect(item(tree, 'a').hasAttribute('aria-expanded')).toBe(true);
    expect(item(tree, 'c').getAttribute('aria-expanded')).toBe('false');
    expect(item(tree, 'd').hasAttribute('aria-expanded')).toBe(false);
  });
});

describe('invalid input', () => {
  const cases: [string, Partial<NphTree>, RegExp][] = [
    ['`items` that is not a list', { items: 'x' as unknown as NphTreeNode[] }, /not a list/],
    ['a node with no id', { items: [{ label: 'A' } as NphTreeNode] }, /no `id`/],
    ['a node with no label', { items: [{ id: 'a', label: ' ' }] }, /no `label`/],
    ['a repeated id', { items: [{ id: 'a', label: 'A' }, { id: 'a', label: 'B' }] }, /repeated/],
    ['a repeated id in another level', { items: [{ id: 'a', label: 'A', children: [{ id: 'a', label: 'B' }] }] }, /repeated/],
    ['`children` that is not a list', { items: [{ id: 'a', label: 'A', children: 'x' as unknown as NphTreeNode[] }] }, /not a list/],
    ['a selection outside the list', { selection: 'multi' as unknown as 'single' }, /does not exist/],
  ];

  for (const [name, props, message] of cases) {
    it(`${name}: draws nothing and says so once`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const tree = await mount(props);
      expect(tree.hasAttribute('data-nph-rendered')).toBe(false);
      expect(getComputedStyle(tree).display).toBe('none');
      expect(root(tree).querySelector('[role="treeitem"], nph-empty, .skeleton')).toBeNull();
      expect(error).toHaveBeenCalledTimes(1);
      expect(String(error.mock.calls[0]?.[0])).toMatch(message);
      tree.requestUpdate();
      await tree.updateComplete;
      expect(error).toHaveBeenCalledTimes(1);
    });
  }

  it('draws again, with no leftover, once the input is fixed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const tree = await mount({ items: [{ id: 'a', label: 'A' }, { id: 'a', label: 'B' }] });
    expect(tree.hasAttribute('data-nph-rendered')).toBe(false);
    tree.items = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }];
    await settle(tree);
    expect(tree.hasAttribute('data-nph-rendered')).toBe(true);
    expect(keys(tree)).toEqual(['a', 'b']);
  });

  it('an empty `items` is a mount: the empty tree, no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tree = await mount({ items: [] });
    expect(error).not.toHaveBeenCalled();
    expect(tree.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('an id the tree does not know in selected, checked or expanded is ignored in silence', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tree = await mount({ selection: 'multiple', selected: 'ghost', checked: ['ghost'], expanded: ['ghost'] });
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(keys(tree)).toEqual(['docs', 'images', 'readme']);
  });
});

describe('warnings: drawn, and said once', () => {
  it('a tree with no name draws and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tree = await mount({ label: null });
    expect(keys(tree)).toHaveLength(3);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toMatch(/no accessible name/);
    tree.requestUpdate();
    await tree.updateComplete;
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('the host aria-label, the host aria-labelledby or the label give the name', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const byAria = document.createElement('nph-tree');
    Object.assign(byAria, { items: NODES });
    byAria.setAttribute('aria-label', 'Folders');
    const byRef = document.createElement('nph-tree');
    Object.assign(byRef, { items: NODES });
    byRef.setAttribute('aria-labelledby', 'heading');
    document.body.append(byAria, byRef);
    await settle(byAria);
    await settle(byRef);
    await mount();
    expect(warn).not.toHaveBeenCalled();
  });

  it('an error row with no texts, and an empty tree with no heading, warn once each', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await mount({
      errorText: null,
      retryText: null,
      emptyHeading: null,
      items: [{ id: 'a', label: 'A', branch: true, error: true }],
      expanded: ['a'],
    });
    const messages = warn.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((message) => /error-text/.test(message))).toHaveLength(1);
    expect(messages.filter((message) => /retry-text/.test(message))).toHaveLength(1);
    const other = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await mount({ items: [], emptyHeading: null });
    expect(other.mock.calls.map((call) => String(call[0])).filter((message) => /empty-heading/.test(message))).toHaveLength(1);
  });
});

describe('semantics', () => {
  it('the host is a tree with the name of the label', async () => {
    const tree = await mount();
    const node = await axNode(tree);
    expect(node.role).toBe('tree');
    expect(node.name).toBe('Files');
  });

  it('the host aria-label and aria-labelledby name it, and win over the label', async () => {
    const tree = await mount();
    tree.setAttribute('aria-label', 'Folders');
    expect((await axNode(tree)).name).toBe('Folders');
    tree.removeAttribute('aria-label');
    const heading = document.createElement('h2');
    heading.id = 'tree-heading';
    heading.textContent = 'Project files';
    document.body.prepend(heading);
    tree.setAttribute('aria-labelledby', 'tree-heading');
    expect((await axNode(tree)).name).toBe('Project files');
  });

  it('the name of an item is its label, children not included', async () => {
    const tree = await mount({ expanded: ['docs'] });
    const docs = await axNode(item(tree, 'docs'));
    expect(docs.role).toBe('treeitem');
    expect(docs.name).toBe('Documents');
    expect((await axNode(item(tree, 'notes'))).name).toBe('Notes.txt');
  });

  it('an open branch owns its group, and the group owns the items of the next level', async () => {
    const tree = await mount({ expanded: ['docs', 'reports'] });
    const q1 = await axNode(item(tree, 'q1'));
    expect(q1.chain.slice(0, 5)).toEqual(['group', 'treeitem', 'group', 'treeitem', 'tree']);
    const group = root(tree).querySelector('[role="group"]') as HTMLElement;
    expect(item(tree, 'docs').getAttribute('aria-owns')).toBe(group.id);
    expect(item(tree, 'images').hasAttribute('aria-owns')).toBe(false);
  });

  it('every item carries its level, its size and its position', async () => {
    const tree = await mount({ expanded: ['docs', 'reports'] });
    const read = (key: string): string[] => ['aria-level', 'aria-setsize', 'aria-posinset'].map((name) => item(tree, key).getAttribute(name) ?? '');
    expect(read('docs')).toEqual(['1', '3', '1']);
    expect(read('reports')).toEqual(['2', '2', '1']);
    expect(read('notes')).toEqual(['2', '2', '2']);
    expect(read('q2')).toEqual(['3', '2', '2']);
    expect(read('readme')).toEqual(['1', '3', '3']);
  });

  it('aria-expanded sits on the branches only: true when open, false when closed', async () => {
    const tree = await mount({ expanded: ['docs'] });
    expect(item(tree, 'docs').getAttribute('aria-expanded')).toBe('true');
    expect(item(tree, 'reports').getAttribute('aria-expanded')).toBe('false');
    expect(item(tree, 'notes').hasAttribute('aria-expanded')).toBe(false);
  });

  it('with no selection, an item has neither aria-selected nor aria-checked', async () => {
    const tree = await mount();
    for (const key of keys(tree)) {
      expect(item(tree, key).hasAttribute('aria-selected'), key).toBe(false);
      expect(item(tree, key).hasAttribute('aria-checked'), key).toBe(false);
    }
    expect((await axNode(tree)).properties.multiselectable).not.toBe(true);
  });

  it('in single selection, every item has aria-selected and none has aria-checked', async () => {
    const tree = await mount({ selection: 'single', selected: 'images' });
    for (const key of keys(tree)) {
      expect(item(tree, key).getAttribute('aria-selected'), key).toBe(key === 'images' ? 'true' : 'false');
      expect(item(tree, key).hasAttribute('aria-checked'), key).toBe(false);
    }
    expect((await axNode(tree)).properties.multiselectable).not.toBe(true);
  });

  it('in multiple selection, every item has aria-checked, the parent is mixed, and the tree is multiselectable', async () => {
    const tree = await mount({ selection: 'multiple', checked: ['q1'], expanded: ['docs', 'reports'] });
    expect(item(tree, 'q1').getAttribute('aria-checked')).toBe('true');
    expect(item(tree, 'q2').getAttribute('aria-checked')).toBe('false');
    expect(item(tree, 'reports').getAttribute('aria-checked')).toBe('mixed');
    expect(item(tree, 'docs').getAttribute('aria-checked')).toBe('mixed');
    expect(item(tree, 'readme').getAttribute('aria-checked')).toBe('false');
    for (const key of keys(tree)) {
      expect(item(tree, key).hasAttribute('aria-selected'), key).toBe(false);
    }
    expect((await axNode(tree)).properties.multiselectable).toBe(true);
  });

  it('a disabled item is aria-disabled and still takes focus', async () => {
    const tree = await mount({ items: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B', disabled: true }, { id: 'c', label: 'C' }] });
    expect(item(tree, 'b').getAttribute('aria-disabled')).toBe('true');
    expect(item(tree, 'a').hasAttribute('aria-disabled')).toBe(false);
    item(tree, 'b').focus();
    expect(focusedKey(tree)).toBe('b');
  });

  it('the chevron, the icon, the box and the spinner are hidden from assistive technology', async () => {
    const tree = await mount({ selection: 'multiple', icons: true, items: [{ id: 'a', label: 'A', branch: true, loading: true }], expanded: ['a'] });
    expect(toggleOf(tree, 'a').getAttribute('aria-hidden')).toBe('true');
    const box = item(tree, 'a').querySelector('nph-checkbox') as HTMLElement;
    expect(box.hasAttribute('inert')).toBe(true);
    expect(box.getAttribute('aria-hidden')).toBe('true');
    expect(item(tree, 'a').querySelector('.node-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect((await axNode(item(tree, 'a'))).name).toBe('A');
  });

  it('the box is never disabled by the tree, so a disabled item fades it once', async () => {
    const tree = await mount({ selection: 'multiple', checked: ['a'], items: [{ id: 'a', label: 'A', disabled: true }] });
    const box = item(tree, 'a').querySelector('nph-checkbox') as HTMLElement;
    expect(box.hasAttribute('disabled')).toBe(false);
    expect(getComputedStyle(box).opacity).toBe('1');
    expect(getComputedStyle(face(tree, 'a')).opacity).toBe(resolved('opacity', '--nph-tree-item-disabled-opacity'));
  });
});

describe('the Tab stop', () => {
  it('has one Tab stop: the first item with no selection', async () => {
    const tree = await mount();
    const stops = [...root(tree).querySelectorAll<HTMLElement>('[role="treeitem"]')].filter((element) => element.tabIndex === 0);
    expect(stops.map((element) => element.dataset.key)).toEqual(['docs']);
  });

  it('is the selected item in single selection', async () => {
    const tree = await mount({ selection: 'single', selected: 'images' });
    expect(item(tree, 'images').tabIndex).toBe(0);
    expect(item(tree, 'docs').tabIndex).toBe(-1);
  });

  it('Tab enters the tree on the Tab stop, the next Tab leaves it, and Shift+Tab comes back to the same item', async () => {
    const tree = await mount({ selection: 'single', selected: 'readme' });
    const after = document.createElement('button');
    after.textContent = 'after';
    tree.parentElement?.after(after);
    await enter(tree);
    expect(focusedKey(tree)).toBe('readme');
    await userEvent.tab();
    expect(document.activeElement).toBe(after);
    await userEvent.tab({ shift: true });
    expect(focusedKey(tree)).toBe('readme');
  });

  it('the item with focus becomes the Tab stop', async () => {
    const tree = await mount();
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}');
    await tree.updateComplete;
    expect(item(tree, 'images').tabIndex).toBe(0);
    expect(item(tree, 'docs').tabIndex).toBe(-1);
  });

  it('when the item of the Tab stop leaves because its parent closes, the parent takes the stop', async () => {
    const tree = await mount({ expanded: ['docs'] });
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}');
    expect(focusedKey(tree)).toBe('reports');
    tree.expanded = [];
    await settle(tree);
    expect(item(tree, 'docs').tabIndex).toBe(0);
  });
});

describe('the keyboard', () => {
  const FOLDERS: NphTreeNode[] = [
    ...NODES,
    { id: 'archive', label: 'Archive', children: [{ id: 'old', label: 'Old.zip' }] },
  ];

  it('Down and Up move through the visible items, without opening or closing', async () => {
    const tree = await mount({ expanded: ['docs'] });
    await enter(tree);
    const seen = [focusedKey(tree)];
    for (let step = 0; step < 4; step += 1) {
      await userEvent.keyboard('{ArrowDown}');
      seen.push(focusedKey(tree));
    }
    expect(seen).toEqual(['docs', 'reports', 'notes', 'images', 'readme']);
    await userEvent.keyboard('{ArrowDown}');
    expect(focusedKey(tree)).toBe('readme');
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(focusedKey(tree)).toBe('notes');
    expect(tree.expanded).toEqual(['docs']);
  });

  it('Down and Up pass through a disabled item, which takes focus', async () => {
    const tree = await mount({ items: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B', disabled: true }, { id: 'c', label: 'C' }] });
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}');
    expect(focusedKey(tree)).toBe('b');
    await userEvent.keyboard('{ArrowDown}');
    expect(focusedKey(tree)).toBe('c');
    await userEvent.keyboard('{ArrowUp}');
    expect(focusedKey(tree)).toBe('b');
  });

  it('Right opens a closed branch and keeps the focus; on an open branch goes down to the first child; on a leaf does nothing', async () => {
    const tree = await mount();
    const toggles = collect<NphTreeToggleDetail>(tree, 'nph-tree-toggle');
    await enter(tree);
    await userEvent.keyboard('{ArrowRight}');
    await settle(tree);
    expect(focusedKey(tree)).toBe('docs');
    expect(tree.expanded).toEqual(['docs']);
    expect(toggles).toEqual([{ id: 'docs', expanded: true }]);
    await userEvent.keyboard('{ArrowRight}');
    expect(focusedKey(tree)).toBe('reports');
    await userEvent.keyboard('{ArrowDown}{ArrowRight}');
    expect(focusedKey(tree)).toBe('notes');
    expect(toggles).toHaveLength(1);
  });

  it('Left closes an open branch; on a child goes up to the parent; on a closed root item does nothing', async () => {
    const tree = await mount({ expanded: ['docs'] });
    const toggles = collect<NphTreeToggleDetail>(tree, 'nph-tree-toggle');
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}{ArrowLeft}');
    expect(focusedKey(tree)).toBe('docs');
    await userEvent.keyboard('{ArrowLeft}');
    await settle(tree);
    expect(focusedKey(tree)).toBe('docs');
    expect(tree.expanded).toEqual([]);
    expect(toggles).toEqual([{ id: 'docs', expanded: false }]);
    await userEvent.keyboard('{ArrowLeft}');
    expect(focusedKey(tree)).toBe('docs');
    expect(toggles).toHaveLength(1);
  });

  it('Home and End go to the first and the last visible item', async () => {
    const tree = await mount({ expanded: ['docs'] });
    await enter(tree);
    await userEvent.keyboard('{End}');
    expect(focusedKey(tree)).toBe('readme');
    await userEvent.keyboard('{Home}');
    expect(focusedKey(tree)).toBe('docs');
  });

  it('the asterisk opens every closed branch among the siblings of the item with focus', async () => {
    const tree = await mount({ items: FOLDERS });
    const toggles = collect<NphTreeToggleDetail>(tree, 'nph-tree-toggle');
    await enter(tree);
    await userEvent.keyboard('*');
    await settle(tree);
    expect([...tree.expanded].sort()).toEqual(['archive', 'docs', 'images']);
    expect(toggles.map((detail) => detail.id).sort()).toEqual(['archive', 'docs', 'images']);
    expect(focusedKey(tree)).toBe('docs');
    expect(keys(tree)).toContain('logo');
    expect(keys(tree)).not.toContain('q1');
  });

  it('a letter goes to the next visible item whose label starts with it, around the end', async () => {
    const tree = await mount({ items: FOLDERS, expanded: ['docs'] });
    await enter(tree);
    await userEvent.keyboard('n');
    expect(focusedKey(tree)).toBe('notes');
    await userEvent.keyboard('r');
    expect(focusedKey(tree)).toBe('readme');
    await userEvent.keyboard('r');
    expect(focusedKey(tree)).toBe('reports');
    await userEvent.keyboard('A');
    expect(focusedKey(tree)).toBe('archive');
    await userEvent.keyboard('z');
    expect(focusedKey(tree)).toBe('archive');
  });

  it('Enter with no selection opens and closes a branch and does nothing on a leaf', async () => {
    const tree = await mount();
    await enter(tree);
    await userEvent.keyboard('{Enter}');
    await settle(tree);
    expect(tree.expanded).toEqual(['docs']);
    await userEvent.keyboard('{Enter}');
    await settle(tree);
    expect(tree.expanded).toEqual([]);
    await userEvent.keyboard('{End}{Enter}');
    expect(tree.expanded).toEqual([]);
  });

  it('Space with no selection does nothing and the page may scroll', async () => {
    const tree = await mount();
    await enter(tree);
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true, composed: true });
    item(tree, 'docs').dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(tree.expanded).toEqual([]);
  });

  it('in single selection Enter and Space choose the item, branches included, and do not open it', async () => {
    const tree = await mount({ selection: 'single' });
    const chosen = collect<NphTreeSelectDetail>(tree, 'nph-tree-select');
    await enter(tree);
    await userEvent.keyboard('{Enter}');
    await settle(tree);
    expect(tree.selected).toBe('docs');
    expect(tree.expanded).toEqual([]);
    await userEvent.keyboard('{ArrowDown}{ }');
    await settle(tree);
    expect(tree.selected).toBe('images');
    expect(chosen).toEqual([{ id: 'docs' }, { id: 'images' }]);
    await userEvent.keyboard('{Enter}');
    expect(chosen).toHaveLength(2);
  });

  it('in multiple selection Enter opens or closes a branch and checks a leaf; Space checks any item', async () => {
    const tree = await mount({ selection: 'multiple' });
    const checks = collect<NphTreeCheckDetail>(tree, 'nph-tree-check');
    await enter(tree);
    await userEvent.keyboard('{Enter}');
    await settle(tree);
    expect(tree.expanded).toEqual(['docs']);
    expect(checks).toHaveLength(0);
    await userEvent.keyboard('{End}{Enter}');
    expect(checks).toEqual([{ id: 'readme', checked: true, value: ['readme'] }]);
    await userEvent.keyboard('{Home}{ }');
    await settle(tree);
    expect(checks.at(-1)?.id).toBe('docs');
    expect(tree.expanded).toEqual(['docs']);
    expect(tree.checked).toEqual(['docs', 'reports', 'q1', 'q2', 'notes', 'readme']);
  });

  it('a disabled item takes focus and does nothing on Enter, Space, Right and Left', async () => {
    const tree = await mount({
      selection: 'single',
      items: [{ id: 'a', label: 'A', disabled: true, children: [{ id: 'b', label: 'B' }] }],
    });
    const events = ['nph-tree-toggle', 'nph-tree-select', 'nph-tree-check', 'nph-tree-load'].flatMap((name) => collect(tree, name));
    await enter(tree);
    await userEvent.keyboard('{Enter}{ }{ArrowRight}{ArrowLeft}');
    expect(events).toHaveLength(0);
    expect(tree.expanded).toEqual([]);
    expect(tree.selected).toBeNull();
  });

  it('the keys that belong to the tree do not scroll the page, and Tab and Esc are left alone', async () => {
    const tree = await mount();
    await enter(tree);
    for (const key of ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', '*', 'n']) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, composed: true });
      item(tree, focusedKey(tree) ?? 'docs').dispatchEvent(event);
      expect(event.defaultPrevented, key).toBe(true);
    }
    for (const key of ['Tab', 'Escape']) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, composed: true });
      item(tree, focusedKey(tree) ?? 'docs').dispatchEvent(event);
      expect(event.defaultPrevented, key).toBe(false);
    }
  });

  it('a key with Control, Alt or Meta is not the tree\'s', async () => {
    const tree = await mount();
    await enter(tree);
    for (const init of [{ ctrlKey: true }, { altKey: true }, { metaKey: true }]) {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true, composed: true, ...init });
      item(tree, 'docs').dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    }
    expect(focusedKey(tree)).toBe('docs');
  });

  it('in right-to-left writing Left opens and Right closes', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const tree = await mount();
    await enter(tree);
    await userEvent.keyboard('{ArrowLeft}');
    await settle(tree);
    expect(tree.expanded).toEqual(['docs']);
    await userEvent.keyboard('{ArrowLeft}');
    expect(focusedKey(tree)).toBe('reports');
    await userEvent.keyboard('{ArrowRight}');
    expect(focusedKey(tree)).toBe('docs');
    await userEvent.keyboard('{ArrowRight}');
    await settle(tree);
    expect(tree.expanded).toEqual([]);
  });
});

describe('the pointer', () => {
  it('a click on the chevron opens and closes the branch and does not select it', async () => {
    const tree = await mount({ selection: 'single' });
    const toggles = collect<NphTreeToggleDetail>(tree, 'nph-tree-toggle');
    const chosen = collect<NphTreeSelectDetail>(tree, 'nph-tree-select');
    await userEvent.click(toggleOf(tree, 'docs'));
    await settle(tree);
    expect(tree.expanded).toEqual(['docs']);
    await userEvent.click(toggleOf(tree, 'docs'));
    await settle(tree);
    expect(tree.expanded).toEqual([]);
    expect(toggles).toEqual([
      { id: 'docs', expanded: true },
      { id: 'docs', expanded: false },
    ]);
    expect(chosen).toHaveLength(0);
    expect(tree.selected).toBeNull();
  });

  it('with no selection, a click on the row opens and closes the branch', async () => {
    const tree = await mount();
    await userEvent.click(labelOf(tree, 'docs'));
    await settle(tree);
    expect(tree.expanded).toEqual(['docs']);
    await userEvent.click(labelOf(tree, 'docs'));
    await settle(tree);
    expect(tree.expanded).toEqual([]);
    await userEvent.click(labelOf(tree, 'readme'));
    expect(tree.expanded).toEqual([]);
  });

  it('in single selection a click on the row chooses the item and puts the focus on it', async () => {
    const tree = await mount({ selection: 'single' });
    const chosen = collect<NphTreeSelectDetail>(tree, 'nph-tree-select');
    await userEvent.click(labelOf(tree, 'images'));
    await settle(tree);
    expect(tree.selected).toBe('images');
    expect(focusedKey(tree)).toBe('images');
    expect(tree.expanded).toEqual([]);
    await userEvent.click(labelOf(tree, 'images'));
    expect(chosen).toEqual([{ id: 'images' }]);
  });

  it('in multiple selection a click on the row checks and unchecks it, and a click on the chevron only opens', async () => {
    const tree = await mount({ selection: 'multiple' });
    const checks = collect<NphTreeCheckDetail>(tree, 'nph-tree-check');
    await userEvent.click(labelOf(tree, 'readme'));
    await settle(tree);
    await userEvent.click(labelOf(tree, 'readme'));
    await settle(tree);
    expect(checks).toEqual([
      { id: 'readme', checked: true, value: ['readme'] },
      { id: 'readme', checked: false, value: [] },
    ]);
    await userEvent.click(toggleOf(tree, 'images'));
    await settle(tree);
    expect(tree.expanded).toEqual(['images']);
    expect(checks).toHaveLength(2);
    expect(tree.checked).toEqual([]);
  });

  it('a click on a disabled item and on its chevron does nothing', async () => {
    const tree = await mount({ selection: 'single', items: [{ id: 'a', label: 'A', disabled: true, children: [{ id: 'b', label: 'B' }] }] });
    const events = ['nph-tree-toggle', 'nph-tree-select'].flatMap((name) => collect(tree, name));
    await userEvent.click(labelOf(tree, 'a'));
    await userEvent.click(toggleOf(tree, 'a'));
    expect(events).toHaveLength(0);
    expect(tree.expanded).toEqual([]);
  });

  it('hover neither moves the focus nor selects, and a click outside clears nothing', async () => {
    const tree = await mount({ selection: 'single', selected: 'docs' });
    await enter(tree);
    expect(focusedKey(tree)).toBe('docs');
    await userEvent.hover(labelOf(tree, 'readme'));
    expect(focusedKey(tree)).toBe('docs');
    expect(tree.selected).toBe('docs');
    await userEvent.click(document.body);
    expect(tree.selected).toBe('docs');
  });

  it('the events cross the shadow root and bubble', async () => {
    const tree = await mount({ selection: 'single' });
    const seen: string[] = [];
    document.body.addEventListener('nph-tree-select', (event) => seen.push(String((event as CustomEvent<NphTreeSelectDetail>).detail.id)), { signal: listeners.signal });
    await userEvent.click(labelOf(tree, 'readme'));
    expect(seen).toEqual(['readme']);
  });

  it('the events fire only when the person acts, not when the code sets the state', async () => {
    const tree = await mount({ selection: 'multiple' });
    const events = ['nph-tree-toggle', 'nph-tree-select', 'nph-tree-check', 'nph-tree-load'].flatMap((name) => collect(tree, name));
    tree.expanded = ['docs'];
    tree.checked = ['q1'];
    tree.selected = 'docs';
    tree.selection = 'single';
    await settle(tree);
    expect(events).toHaveLength(0);
  });
});

describe('selection', () => {
  it('single: the chosen item shows the selected look, the bar and the medium weight, and only that one', async () => {
    const tree = await mount({ selection: 'single', selected: 'images' });
    const chosen = item(tree, 'images');
    expect(chosen.hasAttribute('data-selected')).toBe(true);
    expect(getComputedStyle(face(tree, 'images')).backgroundColor).toBe(background('--nph-tree-item-background-selected'));
    expect(getComputedStyle(face(tree, 'images')).color).toBe(color('--nph-tree-item-foreground-selected'));
    expect(getComputedStyle(face(tree, 'images')).fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(getComputedStyle(face(tree, 'docs')).fontWeight).toBe(resolved('font-weight', '--nph-text-body-md-font-weight'));
    expect(getComputedStyle(face(tree, 'docs')).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    const bar = getComputedStyle(face(tree, 'images'), '::before');
    expect(bar.backgroundColor).toBe(background('--nph-tree-indicator-background'));
    expect(Number.parseFloat(bar.width)).toBe(px('--nph-tree-indicator-width'));
    expect(getComputedStyle(face(tree, 'docs'), '::before').content).toBe('none');
  });

  it('single: the chevron and the icon of the selected item take the color of its label', async () => {
    const tree = await mount({ selection: 'single', selected: 'images', icons: true });
    expect(getComputedStyle(toggleOf(tree, 'images')).color).toBe(color('--nph-tree-toggle-foreground-selected'));
    expect(getComputedStyle(item(tree, 'images').querySelector('.node-icon') as HTMLElement).color).toBe(color('--nph-tree-icon-foreground-selected'));
    expect(getComputedStyle(toggleOf(tree, 'docs')).color).toBe(color('--nph-tree-toggle-foreground'));
    expect(getComputedStyle(item(tree, 'docs').querySelector('.node-icon') as HTMLElement).color).toBe(color('--nph-tree-icon-foreground'));
  });

  it('single: the `selected` property moves with the person and with the code', async () => {
    const tree = await mount({ selection: 'single' });
    await userEvent.click(labelOf(tree, 'readme'));
    expect(tree.selected).toBe('readme');
    tree.selected = 'docs';
    await settle(tree);
    expect(item(tree, 'docs').getAttribute('aria-selected')).toBe('true');
    expect(item(tree, 'readme').getAttribute('aria-selected')).toBe('false');
  });

  it('multiple: checking a parent checks the enabled children, closed branches included, and says the whole list', async () => {
    const tree = await mount({ selection: 'multiple' });
    const checks = collect<NphTreeCheckDetail>(tree, 'nph-tree-check');
    await userEvent.click(labelOf(tree, 'docs'));
    await settle(tree);
    expect(checks).toEqual([{ id: 'docs', checked: true, value: ['docs', 'reports', 'q1', 'q2', 'notes'] }]);
    expect(tree.checked).toEqual(['docs', 'reports', 'q1', 'q2', 'notes']);
    expect(item(tree, 'docs').getAttribute('aria-checked')).toBe('true');
  });

  it('multiple: unchecking a child leaves the parent and the grandparent mixed and keeps the siblings checked', async () => {
    const tree = await mount({ selection: 'multiple', checked: ['docs'], expanded: ['docs', 'reports'] });
    expect(item(tree, 'q1').getAttribute('aria-checked')).toBe('true');
    expect(item(tree, 'notes').getAttribute('aria-checked')).toBe('true');
    const checks = collect<NphTreeCheckDetail>(tree, 'nph-tree-check');
    await userEvent.click(labelOf(tree, 'q1'));
    await settle(tree);
    expect(checks).toEqual([{ id: 'q1', checked: false, value: ['q2', 'notes'] }]);
    expect(item(tree, 'q1').getAttribute('aria-checked')).toBe('false');
    expect(item(tree, 'q2').getAttribute('aria-checked')).toBe('true');
    expect(item(tree, 'notes').getAttribute('aria-checked')).toBe('true');
    expect(item(tree, 'reports').getAttribute('aria-checked')).toBe('mixed');
    expect(item(tree, 'docs').getAttribute('aria-checked')).toBe('mixed');
  });

  it('multiple: checking the last child of a parent checks the parent', async () => {
    const tree = await mount({ selection: 'multiple', checked: ['q1'], expanded: ['docs', 'reports'] });
    await userEvent.click(labelOf(tree, 'q2'));
    await settle(tree);
    expect(tree.checked).toEqual(['reports', 'q1', 'q2']);
    expect(item(tree, 'reports').getAttribute('aria-checked')).toBe('true');
    expect(item(tree, 'docs').getAttribute('aria-checked')).toBe('mixed');
  });

  it('multiple: a mixed parent gets checked, and a checked one unchecked, with its whole branch', async () => {
    const tree = await mount({ selection: 'multiple', checked: ['q1'], expanded: ['docs'] });
    expect(item(tree, 'reports').getAttribute('aria-checked')).toBe('mixed');
    await userEvent.click(labelOf(tree, 'reports'));
    await settle(tree);
    expect(tree.checked).toEqual(['reports', 'q1', 'q2']);
    await userEvent.click(labelOf(tree, 'reports'));
    await settle(tree);
    expect(tree.checked).toEqual([]);
  });

  it('multiple: a disabled item stays out of the count and out of the cascade, and keeps its own state', async () => {
    const items: NphTreeNode[] = [
      {
        id: 'p',
        label: 'P',
        children: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B', disabled: true },
          { id: 'c', label: 'C', disabled: true },
        ],
      },
    ];
    const tree = await mount({ selection: 'multiple', items, checked: ['c'], expanded: ['p'] });
    expect(item(tree, 'c').getAttribute('aria-checked')).toBe('true');
    expect(item(tree, 'p').getAttribute('aria-checked')).toBe('false');
    await userEvent.click(labelOf(tree, 'p'));
    await settle(tree);
    expect(tree.checked).toEqual(['p', 'a', 'c']);
    expect(item(tree, 'b').getAttribute('aria-checked')).toBe('false');
    expect(item(tree, 'c').getAttribute('aria-checked')).toBe('true');
    await userEvent.click(labelOf(tree, 'p'));
    await settle(tree);
    expect(tree.checked).toEqual(['c']);
    expect(item(tree, 'c').getAttribute('aria-checked')).toBe('true');
  });

  it('multiple: a parent whose children are all disabled is checked by its own mark', async () => {
    const items: NphTreeNode[] = [{ id: 'p', label: 'P', children: [{ id: 'a', label: 'A', disabled: true }] }];
    const tree = await mount({ selection: 'multiple', items });
    await userEvent.click(labelOf(tree, 'p'));
    await settle(tree);
    expect(tree.checked).toEqual(['p']);
  });

  it('multiple, check-strictly: every item is independent and nothing is mixed', async () => {
    const tree = await mount({ selection: 'multiple', checkStrictly: true, expanded: ['docs', 'reports'] });
    await userEvent.click(labelOf(tree, 'q1'));
    await settle(tree);
    expect(tree.checked).toEqual(['q1']);
    expect(item(tree, 'reports').getAttribute('aria-checked')).toBe('false');
    await userEvent.click(labelOf(tree, 'docs'));
    await settle(tree);
    expect(tree.checked).toEqual(['docs', 'q1']);
    expect(item(tree, 'q2').getAttribute('aria-checked')).toBe('false');
    for (const key of keys(tree)) {
      expect(item(tree, key).getAttribute('aria-checked'), key).not.toBe('mixed');
    }
  });

  it('multiple: the box shows checked, unchecked and mixed, and a checked parent whose children load later checks them', async () => {
    const tree = await mount({ selection: 'multiple', checked: ['q1'], expanded: ['docs', 'reports'] });
    const box = (key: string) => item(tree, key).querySelector('nph-checkbox') as HTMLElement & { checked: boolean; indeterminate: boolean };
    expect([box('q1').checked, box('q1').indeterminate]).toEqual([true, false]);
    expect([box('q2').checked, box('q2').indeterminate]).toEqual([false, false]);
    expect([box('reports').checked, box('reports').indeterminate]).toEqual([false, true]);
    const lazy = await mount({ selection: 'multiple', checked: ['lazy'], expanded: ['lazy'], items: [{ id: 'lazy', label: 'Lazy', branch: true }] });
    lazy.items = [{ id: 'lazy', label: 'Lazy', branch: true, children: [{ id: 'x', label: 'X' }, { id: 'y', label: 'Y' }] }];
    await settle(lazy);
    expect(item(lazy, 'x').getAttribute('aria-checked')).toBe('true');
    expect(item(lazy, 'lazy').getAttribute('aria-checked')).toBe('true');
  });
});

describe('load on demand', () => {
  const LAZY: NphTreeNode[] = [{ id: 'remote', label: 'Remote', branch: true }, { id: 'local', label: 'Local' }];

  it('opening a branch with no children asks for them, loads with the spinner in place of the chevron, and sets aria-busy', async () => {
    const tree = await mount({ items: LAZY });
    const loads = collect<NphTreeLoadDetail>(tree, 'nph-tree-load');
    await userEvent.click(toggleOf(tree, 'remote'));
    await settle(tree);
    expect(loads).toEqual([{ id: 'remote', retry: false }]);
    expect(item(tree, 'remote').getAttribute('aria-busy')).toBe('true');
    expect(item(tree, 'remote').getAttribute('aria-expanded')).toBe('true');
    expect(toggleOf(tree, 'remote').querySelector('nph-spinner')?.getAttribute('size')).toBe('sm');
    expect(toggleOf(tree, 'remote').querySelector('nph-icon')).toBeNull();
    expect(root(tree).querySelector('[role="group"]')).toBeNull();
    expect(getComputedStyle(toggleOf(tree, 'remote').querySelector('nph-spinner') as HTMLElement).color).toBe(color('--nph-color-primary'));
  });

  it('a branch that is already loading, or opened by the code, asks for nothing', async () => {
    const tree = await mount({ items: [{ id: 'a', label: 'A', branch: true, loading: true }, ...LAZY], expanded: ['remote'] });
    const loads = collect<NphTreeLoadDetail>(tree, 'nph-tree-load');
    await userEvent.click(toggleOf(tree, 'a'));
    expect(loads).toHaveLength(0);
    expect(item(tree, 'remote').getAttribute('aria-busy')).toBe('true');
  });

  it('the children arrive and the spinner gives the chevron back', async () => {
    const tree = await mount({ items: LAZY });
    await userEvent.click(toggleOf(tree, 'remote'));
    await settle(tree);
    tree.items = [{ id: 'remote', label: 'Remote', branch: true, children: [{ id: 'one', label: 'One' }] }, LAZY[1] as NphTreeNode];
    await settle(tree);
    expect(item(tree, 'remote').hasAttribute('aria-busy')).toBe(false);
    expect(toggleOf(tree, 'remote').querySelector('nph-icon')).not.toBeNull();
    expect(keys(tree)).toEqual(['remote', 'one', 'local']);
  });

  it('a branch that failed shows the error row in place of the children, with its phrase and its action', async () => {
    const tree = await mount({ items: [{ id: 'remote', label: 'Remote', branch: true, error: true }], expanded: ['remote'] });
    const row = root(tree).querySelector('.error-item') as HTMLElement;
    expect(row).not.toBeNull();
    expect(row.getAttribute('role')).toBe('treeitem');
    expect(row.getAttribute('aria-level')).toBe('2');
    expect(row.querySelector('.error-text')?.textContent).toBe("Couldn't load.");
    expect(row.querySelector('.retry')?.textContent).toBe('Try again');
    expect(row.querySelector('nph-icon')?.getAttribute('name')).toBe('triangle-exclamation');
    expect(getComputedStyle(row.querySelector('nph-icon') as HTMLElement).color).toBe(color('--nph-tree-error-icon-foreground'));
    expect(getComputedStyle(row.querySelector('.retry') as HTMLElement).fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(getComputedStyle(row.querySelector('.error-text') as HTMLElement).color).toBe(color('--nph-tree-item-foreground'));
    expect((await axNode(row)).name).toBe("Couldn't load. Try again");
    expect(row.getBoundingClientRect().height).toBe(px('--nph-tree-item-height'));
    expect(item(tree, 'remote').getAttribute('aria-owns')).toBe((row.closest('[role="group"]') as HTMLElement).id);
  });

  it('the error row is aligned to the indent of the children', async () => {
    const tree = await mount({
      items: [{ id: 'a', label: 'A', children: [{ id: 'child', label: 'Child' }, { id: 'remote', label: 'Remote', branch: true, error: true }] }],
      expanded: ['a', 'remote'],
    });
    const child = item(tree, 'child').getBoundingClientRect().left;
    const nested = (root(tree).querySelector('.error-item') as HTMLElement).getBoundingClientRect().left;
    const parent = item(tree, 'remote').getBoundingClientRect().left;
    expect(nested - parent).toBeCloseTo(px('--nph-tree-indent'), 0);
    expect(item(tree, 'remote').getBoundingClientRect().left).toBeCloseTo(child, 0);
  });

  it('Enter and a click on the error row try again: the row turns into loading and the consumer is asked', async () => {
    const tree = await mount({ items: [{ id: 'remote', label: 'Remote', branch: true, error: true }], expanded: ['remote'] });
    const loads = collect<NphTreeLoadDetail>(tree, 'nph-tree-load');
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}');
    expect(focusedKey(tree)).toBe('remote\u0000error');
    await userEvent.keyboard('{Enter}');
    await settle(tree);
    expect(loads).toEqual([{ id: 'remote', retry: true }]);
    expect(root(tree).querySelector('.error-item')).toBeNull();
    expect(item(tree, 'remote').getAttribute('aria-busy')).toBe('true');
    expect(focusedKey(tree)).toBe('remote');
    tree.items = [{ id: 'remote', label: 'Remote', branch: true, error: true }];
    await settle(tree);
    expect(root(tree).querySelector('.error-item')).not.toBeNull();
    await userEvent.click(root(tree).querySelector('.retry') as HTMLElement);
    await settle(tree);
    expect(loads).toHaveLength(2);
  });

  it('on the error row Left goes up to the branch and Right does nothing', async () => {
    const tree = await mount({ items: [{ id: 'remote', label: 'Remote', branch: true, error: true }], expanded: ['remote'] });
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}{ArrowRight}');
    expect(focusedKey(tree)).toBe('remote\u0000error');
    await userEvent.keyboard('{ArrowLeft}');
    expect(focusedKey(tree)).toBe('remote');
  });

  it('the error row takes the hover and the focus of an item', async () => {
    const tree = await mount({ items: [{ id: 'remote', label: 'Remote', branch: true, error: true }], expanded: ['remote'] });
    const row = root(tree).querySelector('.error-item') as HTMLElement;
    const rowFace = row.querySelector('.face') as HTMLElement;
    await userEvent.hover(rowFace);
    expect(getComputedStyle(rowFace).backgroundColor).toBe(background('--nph-tree-item-background-hover'));
    await userEvent.unhover(rowFace);
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}');
    expect(getComputedStyle(row, '::after').borderTopColor).toBe(color('--nph-tree-focus-border'));
  });

  it('the first load of the tree shows three skeleton rows at the height of the item, and the tree is busy', async () => {
    const tree = await mount({ items: [], loading: true });
    const rows = [...root(tree).querySelectorAll<HTMLElement>('.skeleton-row')];
    expect(rows).toHaveLength(NPH_TREE_SKELETON_ROWS);
    for (const row of rows) {
      expect(row.getBoundingClientRect().height).toBe(px('--nph-tree-item-height'));
      expect(row.querySelector('nph-skeleton')?.getAttribute('shape')).toBe('line');
    }
    expect(root(tree).querySelector('.skeleton')?.getAttribute('aria-hidden')).toBe('true');
    expect(root(tree).querySelector('nph-empty')).toBeNull();
    const node = await axNode(tree);
    expect(node.properties.busy).toBeTruthy();
  });

  it('`loading` with items draws the items', async () => {
    const tree = await mount({ loading: true });
    expect(root(tree).querySelector('.skeleton')).toBeNull();
    expect(keys(tree)).toHaveLength(3);
  });
});

describe('the empty tree', () => {
  it('shows the empty state in place of the list, with the texts it was given', async () => {
    const tree = await mount({ items: [] });
    const empty = root(tree).querySelector('nph-empty') as HTMLElement & { heading: string; description: string };
    expect(empty).not.toBeNull();
    expect(empty.getAttribute('heading')).toBe('No items');
    expect(empty.getAttribute('description')).toBe('This folder has no items yet.');
    expect(root(tree).querySelector('[role="treeitem"]')).toBeNull();
    expect((await axNode(tree)).role).not.toBe('tree');
  });

  it('goes back to the list when the items arrive', async () => {
    const tree = await mount({ items: [] });
    tree.items = NODES;
    await settle(tree);
    expect(root(tree).querySelector('nph-empty')).toBeNull();
    expect((await axNode(tree)).role).toBe('tree');
  });
});

describe('the focus when an item leaves', () => {
  it('goes to the nearest parent that is still drawn when the replaced items no longer have the item', async () => {
    const tree = await mount({ expanded: ['docs', 'reports'] });
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(focusedKey(tree)).toBe('q1');
    tree.items = [
      { id: 'docs', label: 'Documents', children: [{ id: 'reports', label: 'Reports', children: [{ id: 'q2', label: 'Q2.pdf' }] }] },
      NODES[1] as NphTreeNode,
    ];
    await settle(tree);
    expect(focusedKey(tree)).toBe('reports');
  });

  it('goes to the closed branch when its parent closes with the focus on a child', async () => {
    const tree = await mount({ expanded: ['docs'] });
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}');
    expect(focusedKey(tree)).toBe('reports');
    tree.expanded = [];
    await settle(tree);
    expect(focusedKey(tree)).toBe('docs');
  });

  it('a click on the chevron of an open parent, with the focus on its child, closes it and the focus goes up to the parent', async () => {
    const tree = await mount({ expanded: ['docs'] });
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.click(toggleOf(tree, 'docs'));
    await settle(tree);
    expect(tree.expanded).toEqual([]);
    expect(focusedKey(tree)).toBe('docs');
  });

  it('does not take the focus when it was not in the tree', async () => {
    const tree = await mount({ expanded: ['docs'] });
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    tree.items = [NODES[1] as NphTreeNode];
    await settle(tree);
    expect(document.activeElement).toBe(outside);
  });
});

describe('itemIdOf', () => {
  it('says the node of the row that holds an element, for a menu opened on the tree', async () => {
    const tree = await mount({ expanded: ['docs'] });
    expect(tree.itemIdOf(labelOf(tree, 'notes'))).toBe('notes');
    expect(tree.itemIdOf(toggleOf(tree, 'docs'))).toBe('docs');
    expect(tree.itemIdOf(item(tree, 'reports'))).toBe('reports');
    expect(tree.itemIdOf(document.body)).toBeNull();
    expect(tree.itemIdOf(null)).toBeNull();
  });

  it('answers the branch for its error row', async () => {
    const tree = await mount({ items: [{ id: 'remote', label: 'Remote', branch: true, error: true }], expanded: ['remote'] });
    expect(tree.itemIdOf(root(tree).querySelector('.retry'))).toBe('remote');
  });

  it('the first element of the composed path of a right click, or of the menu key, belongs to the node', async () => {
    const tree = await mount({ expanded: ['docs'] });
    const seen: (string | null)[] = [];
    document.body.addEventListener('contextmenu', (event) => seen.push(tree.itemIdOf(event.composedPath()[0] as Element)), { signal: listeners.signal });
    labelOf(tree, 'notes').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, composed: true, cancelable: true }));
    await enter(tree);
    await userEvent.keyboard('{ArrowDown}');
    item(tree, 'reports').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, composed: true, cancelable: true }));
    expect(seen).toEqual(['notes', 'reports']);
  });
});

describe('the measures', () => {
  it('the item is as high as `tree/item-height`, with `space/inline` on each side and the tight gap between its parts', async () => {
    const tree = await mount({ selection: 'multiple', icons: true });
    const row = item(tree, 'docs');
    expect(row.getBoundingClientRect().height).toBe(px('--nph-tree-item-height'));
    const style = getComputedStyle(face(tree, 'docs'));
    expect(Number.parseFloat(style.paddingLeft)).toBe(px('--nph-tree-item-padding-inline'));
    expect(Number.parseFloat(style.paddingRight)).toBe(px('--nph-tree-item-padding-inline'));
    expect(Number.parseFloat(style.columnGap)).toBe(px('--nph-tree-item-gap'));
    expect(Number.parseFloat(style.borderTopLeftRadius)).toBe(px('--nph-tree-item-radius'));
  });

  it('the chevron target is 24 by 24 and the leaf keeps its place, so the labels line up', async () => {
    const tree = await mount();
    const target = toggleOf(tree, 'images').getBoundingClientRect();
    expect(target.width).toBe(px('--nph-tree-toggle-icon-size') + 2 * px('--nph-tree-toggle-padding'));
    expect(target.height).toBe(target.width);
    expect(toggleOf(tree, 'readme').getBoundingClientRect().width).toBe(target.width);
    expect(labelOf(tree, 'readme').getBoundingClientRect().left).toBe(labelOf(tree, 'images').getBoundingClientRect().left);
    const chevron = toggleOf(tree, 'images').querySelector('nph-icon') as HTMLElement;
    expect(chevron.getAttribute('name')).toBe('chevron-right');
    expect(chevron.getBoundingClientRect().width).toBe(px('--nph-tree-toggle-icon-size'));
  });

  it('with the box and the icon on, the row runs chevron, box, icon, label, each part tight to the next', async () => {
    const tree = await mount({ selection: 'multiple', icons: true });
    const parts = ['.toggle', 'nph-checkbox', '.node-icon', '.label'].map((selector) => (item(tree, 'docs').querySelector(selector) as HTMLElement).getBoundingClientRect());
    for (let index = 1; index < parts.length; index += 1) {
      expect((parts[index] as DOMRect).left - (parts[index - 1] as DOMRect).right).toBeCloseTo(px('--nph-tree-item-gap'), 0);
    }
    expect((parts[1] as DOMRect).width).toBe(2 * px('--nph-tree-toggle-padding') + px('--nph-icon-size-sm'));
    expect((parts[2] as DOMRect).width).toBe(px('--nph-tree-icon-size'));
  });

  it('each level is indented by `tree/indent`, and the items stack with no space between them', async () => {
    const tree = await mount({ expanded: ['docs', 'reports'] });
    const left = (key: string): number => item(tree, key).getBoundingClientRect().left;
    expect(left('reports') - left('docs')).toBeCloseTo(px('--nph-tree-indent'), 0);
    expect(left('q1') - left('reports')).toBeCloseTo(px('--nph-tree-indent'), 0);
    expect(item(tree, 'reports').getBoundingClientRect().top).toBe(item(tree, 'docs').getBoundingClientRect().bottom);
    expect(item(tree, 'notes').getBoundingClientRect().top).toBe(item(tree, 'q2').getBoundingClientRect().bottom);
  });

  it('has `space/inline-tight` of room around the tree', async () => {
    const tree = await mount();
    const list = root(tree).querySelector('.tree') as HTMLElement;
    expect(Number.parseFloat(getComputedStyle(list).paddingTop)).toBe(px('--nph-tree-padding'));
    expect(item(tree, 'docs').getBoundingClientRect().left - tree.getBoundingClientRect().left).toBe(px('--nph-tree-padding'));
  });

  it('shows the folder, the open folder and the file when the icons are on, and nothing when they are off', async () => {
    const tree = await mount({ icons: true, expanded: ['docs'] });
    const icon = (key: string): HTMLElement => item(tree, key).querySelector('.node-icon') as HTMLElement;
    expect(icon('docs').getAttribute('name')).toBe('folder-open');
    expect(icon('images').getAttribute('name')).toBe('folder');
    expect(icon('notes').getAttribute('name')).toBe('file');
    expect(icon('notes').getAttribute('size')).toBe('sm');
    expect(icon('notes').getAttribute('variant')).toBe('light');
    tree.icons = false;
    await settle(tree);
    expect(root(tree).querySelector('.node-icon')).toBeNull();
  });
});

describe('hover and focus', () => {
  it('hover paints the background and the label, and the chevron stays muted', async () => {
    const tree = await mount();
    await userEvent.hover(face(tree, 'images'));
    expect(getComputedStyle(face(tree, 'images')).backgroundColor).toBe(background('--nph-tree-item-background-hover'));
    expect(getComputedStyle(face(tree, 'images')).color).toBe(color('--nph-tree-item-foreground-hover'));
    expect(getComputedStyle(toggleOf(tree, 'images')).color).toBe(color('--nph-tree-toggle-foreground'));
    expect(getComputedStyle(face(tree, 'docs')).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('the selected item with the pointer over it stays equal to selected', async () => {
    const tree = await mount({ selection: 'single', selected: 'images' });
    await userEvent.hover(face(tree, 'images'));
    expect(getComputedStyle(face(tree, 'images')).backgroundColor).toBe(background('--nph-tree-item-background-selected'));
    expect(getComputedStyle(face(tree, 'images')).color).toBe(color('--nph-tree-item-foreground-selected'));
  });

  it('a disabled item has no hover', async () => {
    const tree = await mount({ items: [{ id: 'a', label: 'A', disabled: true }] });
    await userEvent.hover(face(tree, 'a'));
    expect(getComputedStyle(face(tree, 'a')).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('the focus is a border of `tree/focus-border-width` in `focus/border`, drawn inside the whole row, with the corner of the item', async () => {
    const tree = await mount();
    await enter(tree);
    const row = item(tree, 'docs');
    expect(row.matches(':focus-visible')).toBe(true);
    const ring = getComputedStyle(row, '::after');
    expect(Number.parseFloat(ring.borderTopWidth)).toBe(px('--nph-tree-focus-border-width'));
    expect(ring.borderTopColor).toBe(color('--nph-tree-focus-border'));
    expect(Number.parseFloat(ring.borderTopLeftRadius)).toBe(px('--nph-tree-focus-border-radius'));
    expect(Number.parseFloat(ring.width)).toBeCloseTo(row.getBoundingClientRect().width, 0);
    expect(Number.parseFloat(ring.height)).toBeCloseTo(row.getBoundingClientRect().height, 0);
    expect(getComputedStyle(row).boxShadow).toBe('none');
    expect(getComputedStyle(row).outlineStyle).toBe('none');
    expect(getComputedStyle(face(tree, 'readme'), '::after').content).toBe('none');
  });

  it('the focus wins over the hover: the item with focus takes no hover background, with the pointer over it', async () => {
    const tree = await mount();
    await enter(tree);
    await userEvent.hover(face(tree, 'docs'));
    expect(getComputedStyle(face(tree, 'docs')).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(face(tree, 'docs')).color).toBe(color('--nph-tree-item-foreground'));
    expect(getComputedStyle(item(tree, 'docs'), '::after').borderTopColor).toBe(color('--nph-tree-focus-border'));
  });

  it('on the selected item with focus the border covers the bar, and the selection stays by the background, the color and the weight', async () => {
    const tree = await mount({ selection: 'single', selected: 'docs' });
    await enter(tree);
    expect(getComputedStyle(face(tree, 'docs')).backgroundColor).toBe(background('--nph-tree-item-background-selected'));
    expect(getComputedStyle(face(tree, 'docs')).color).toBe(color('--nph-tree-item-foreground-selected'));
    expect(getComputedStyle(face(tree, 'docs')).fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    const ring = getComputedStyle(item(tree, 'docs'), '::after');
    expect(ring.borderTopColor).toBe(color('--nph-tree-focus-border'));
    const row = item(tree, 'docs').getBoundingClientRect();
    expect(Number.parseFloat(ring.width)).toBeCloseTo(row.width, 0);
    /* The border is drawn after the face, so it is on top of the bar. */
    const order = (item(tree, 'docs').querySelector('.face') as HTMLElement).compareDocumentPosition(item(tree, 'docs'));
    expect(order & Node.DOCUMENT_POSITION_CONTAINS).toBeTruthy();
  });

  it('a click shows no focus border: it is for the keyboard', async () => {
    const tree = await mount({ selection: 'single' });
    await userEvent.click(labelOf(tree, 'images'));
    expect(focusedKey(tree)).toBe('images');
    expect(item(tree, 'images').matches(':focus-visible')).toBe(false);
    expect(getComputedStyle(item(tree, 'images'), '::after').content).toBe('none');
  });
});

describe('combined states', () => {
  it('selected and disabled keeps the background, the bar and the label of the selection under the disabled opacity, on the whole face', async () => {
    const tree = await mount({ selection: 'single', selected: 'a', items: [{ id: 'a', label: 'A', disabled: true }] });
    expect(getComputedStyle(face(tree, 'a')).backgroundColor).toBe(background('--nph-tree-item-background-selected'));
    expect(getComputedStyle(face(tree, 'a')).color).toBe(color('--nph-tree-item-foreground-selected'));
    expect(getComputedStyle(face(tree, 'a'), '::before').backgroundColor).toBe(background('--nph-tree-indicator-background'));
    expect(getComputedStyle(face(tree, 'a')).opacity).toBe(resolved('opacity', '--nph-tree-item-disabled-opacity'));
    expect(getComputedStyle(item(tree, 'a')).opacity).toBe('1');
    expect(getComputedStyle(toggleOf(tree, 'a')).opacity).toBe('1');
  });

  it('a disabled item with focus keeps the focus border on top at full opacity', async () => {
    const tree = await mount({ items: [{ id: 'a', label: 'A', disabled: true }, { id: 'b', label: 'B' }] });
    await enter(tree);
    expect(focusedKey(tree)).toBe('a');
    const ring = getComputedStyle(item(tree, 'a'), '::after');
    expect(ring.borderTopColor).toBe(color('--nph-tree-focus-border'));
    expect(ring.opacity).toBe('1');
    expect(getComputedStyle(item(tree, 'a')).opacity).toBe('1');
    expect(getComputedStyle(face(tree, 'a')).opacity).toBe(resolved('opacity', '--nph-tree-item-disabled-opacity'));
  });

  it('in multiple selection a disabled item keeps its checked mark and the box stays in its default state', async () => {
    const tree = await mount({ selection: 'multiple', checked: ['a'], items: [{ id: 'a', label: 'A', disabled: true }] });
    const box = item(tree, 'a').querySelector('nph-checkbox') as HTMLElement & { checked: boolean };
    expect(box.checked).toBe(true);
    expect(item(tree, 'a').getAttribute('aria-checked')).toBe('true');
    expect(item(tree, 'a').hasAttribute('data-selected')).toBe(false);
  });

  it('`selected` does nothing in multiple selection, and `checked` does nothing in single selection', async () => {
    const multiple = await mount({ selection: 'multiple', selected: 'docs' });
    expect(multiple.shadowRoot?.querySelector('[data-selected]')).toBeNull();
    const single = await mount({ selection: 'single', checked: ['docs'] });
    expect(single.shadowRoot?.querySelector('nph-checkbox')).toBeNull();
    expect(item(single, 'docs').hasAttribute('aria-checked')).toBe(false);
  });
});

describe('the cut label and its balloon', () => {
  const LONG = 'A very long name for a folder that cannot fit in the row of the tree';
  const items: NphTreeNode[] = [
    { id: 'long', label: LONG },
    { id: 'short', label: 'Short' },
    { id: 'long-two', label: `${LONG} again` },
  ];

  it('is cut on one line with an ellipsis, and a short label is not', async () => {
    const tree = await mount({ items }, '14rem');
    await frame();
    await tree.updateComplete;
    const style = getComputedStyle(labelOf(tree, 'long'));
    expect(style.textOverflow).toBe('ellipsis');
    expect(style.whiteSpace).toBe('nowrap');
    expect(labelOf(tree, 'long').scrollWidth).toBeGreaterThan(labelOf(tree, 'long').clientWidth);
    expect(labelOf(tree, 'short').scrollWidth).toBeLessThanOrEqual(labelOf(tree, 'short').clientWidth);
    expect(item(tree, 'long').getBoundingClientRect().height).toBe(px('--nph-tree-item-height'));
  });

  it('has a balloon with the whole text for each cut label and none for the others, and the name stays the whole text', async () => {
    const tree = await mount({ items }, '14rem');
    await frame();
    await settle(tree);
    expect(tooltips(tree).map((balloon) => balloon.text)).toEqual([LONG, `${LONG} again`]);
    expect(tooltips(tree)[0]?.relation).toBe('name');
    expect(tooltips(tree)[0]?.getAttribute('for')).toBe(item(tree, 'long').id);
    expect((await axNode(item(tree, 'long'))).name).toBe(LONG);
    expect((await axNode(item(tree, 'short'))).name).toBe('Short');
  });

  it('measures again when the width changes, and drops the balloon when the label fits', async () => {
    const tree = await mount({ items }, '14rem');
    await frame();
    await settle(tree);
    expect(tooltips(tree)).toHaveLength(2);
    (tree.parentElement as HTMLElement).style.inlineSize = '80rem';
    await vi.waitFor(() => expect(tooltips(tree)).toHaveLength(0));
  });

  it('the balloon opens at once on the focus of the item by the keyboard', async () => {
    const tree = await mount({ items }, '14rem');
    await frame();
    await settle(tree);
    await enter(tree);
    const balloon = tooltips(tree)[0] as NphTooltip;
    await vi.waitFor(() => expect(balloon.open).toBe(true), { timeout: 1000 });
    await userEvent.keyboard('{ArrowDown}');
    await vi.waitFor(() => expect(balloon.open).toBe(false));
    await userEvent.keyboard('{ArrowDown}');
    await vi.waitFor(() => expect(tooltips(tree)[1]?.open).toBe(true), { timeout: 1000 });
  });

  it('the balloon opens on hover over an item that is not the Tab stop, after the hover delay, and the item gives the stop back', async () => {
    const withTail = [...items, { id: 'tail', label: 'Tail' }];
    const tree = await mount({ items: withTail }, '14rem');
    await frame();
    await settle(tree);
    expect(item(tree, 'long-two').tabIndex).toBe(-1);
    await userEvent.hover(labelOf(tree, 'long-two'));
    expect(item(tree, 'long-two').tabIndex).toBe(0);
    const balloon = tooltips(tree)[1] as NphTooltip;
    expect(balloon.open).toBe(false);
    await vi.waitFor(() => expect(balloon.open).toBe(true), { timeout: 3000 });
    expect(focusedKey(tree)).toBeNull();
    await userEvent.hover(labelOf(tree, 'tail'));
    expect(item(tree, 'long-two').tabIndex).toBe(-1);
    await vi.waitFor(() => expect(balloon.open).toBe(false));
    expect(item(tree, 'long').tabIndex).toBe(0);
  });

  it('there is still one Tab stop after the pointer has gone over cut items', async () => {
    const tree = await mount({ items }, '14rem');
    await frame();
    await settle(tree);
    await userEvent.hover(labelOf(tree, 'long-two'));
    await userEvent.hover(document.body);
    await tree.updateComplete;
    const stops = [...root(tree).querySelectorAll<HTMLElement>('[role="treeitem"]')].filter((element) => element.tabIndex === 0);
    expect(stops.map((element) => element.dataset.key)).toEqual(['long']);
  });
});

describe('motion', () => {
  it('the chevron turns a quarter in `motion/expand-duration` with `motion/expand-easing`', async () => {
    const tree = await mount();
    const chevron = toggleOf(tree, 'docs').querySelector('nph-icon') as HTMLElement;
    const style = getComputedStyle(chevron);
    expect(style.transitionProperty).toBe('transform');
    expect(style.transitionDuration).toBe(resolved('transition-duration', '--nph-motion-expand-duration'));
    expect(style.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-expand-easing'));
    expect(new DOMMatrix(style.transform).b).toBeCloseTo(0, 5);
    tree.expanded = ['docs'];
    await settle(tree);
    await wait(500);
    const turned = new DOMMatrix(getComputedStyle(chevron).transform);
    expect(turned.a).toBeCloseTo(0, 5);
    expect(turned.b).toBeCloseTo(1, 5);
  });

  it('with reduced motion the chevron swaps with no turning', async () => {
    const session = cdp();
    await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    try {
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      const tree = await mount();
      const chevron = toggleOf(tree, 'docs').querySelector('nph-icon') as HTMLElement;
      expect(getComputedStyle(chevron).transitionDuration).toBe('0s');
      tree.expanded = ['docs'];
      await settle(tree);
      expect(new DOMMatrix(getComputedStyle(chevron).transform).b).toBeCloseTo(1, 5);
    } finally {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    }
    await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
  });

  it('nothing else moves: the hover and the selection change at once', async () => {
    const tree = await mount();
    expect(getComputedStyle(face(tree, 'docs')).transitionDuration).toBe('0s');
    expect(getComputedStyle(item(tree, 'docs')).transitionDuration).toBe('0s');
  });
});

describe('right-to-left writing', () => {
  it('mirrors the indent, the closed chevron and the bar, and turns the open chevron down', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const tree = await mount({ selection: 'single', selected: 'docs', expanded: ['docs'] });
    const docs = item(tree, 'docs').getBoundingClientRect();
    const child = item(tree, 'reports').getBoundingClientRect();
    expect(docs.right - child.right).toBeCloseTo(px('--nph-tree-indent'), 0);
    const closed = toggleOf(tree, 'images').querySelector('nph-icon') as HTMLElement;
    expect(new DOMMatrix(getComputedStyle(closed).transform).a).toBeCloseTo(-1, 5);
    const open = toggleOf(tree, 'docs').querySelector('nph-icon') as HTMLElement;
    expect(new DOMMatrix(getComputedStyle(open).transform).b).toBeCloseTo(1, 5);
    const bar = getComputedStyle(face(tree, 'docs'), '::before');
    expect(Number.parseFloat(bar.right)).toBe(0);
  });
});

describe('forced colors', () => {
  it('tells the selection and the focus with system colors', async () => {
    const session = cdp();
    await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    try {
      expect(matchMedia('(forced-colors: active)').matches).toBe(true);
      const tree = await mount({ selection: 'single', selected: 'docs' });
      const probe = document.createElement('div');
      probe.style.backgroundColor = 'Highlight';
      probe.style.color = 'HighlightText';
      document.body.append(probe);
      const system = getComputedStyle(probe);
      expect(getComputedStyle(face(tree, 'docs')).backgroundColor).toBe(system.backgroundColor);
      expect(getComputedStyle(face(tree, 'docs')).color).toBe(system.color);
      expect(getComputedStyle(face(tree, 'docs'), '::before').backgroundColor).toBe(system.color);
      await enter(tree);
      expect(getComputedStyle(item(tree, 'docs'), '::after').borderTopColor).toBe(system.backgroundColor);
    } finally {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'none' }] });
    }
    await vi.waitFor(() => expect(matchMedia('(forced-colors: active)').matches).toBe(false));
  });
});

/** A brand whose colors differ from the ones the page loads by default. */
const OTHER_BRAND = BRANDS.at(-1) as string;

describe('color scheme', () => {
  /** The value a token resolves to inside a holder, where the color scheme attribute lives. */
  function inside(holder: HTMLElement, token: string): string {
    const probe = document.createElement('div');
    probe.style.backgroundColor = `var(${token})`;
    holder.append(probe);
    const value = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return value;
  }

  it('the colors follow data-nph-color-scheme set on a parent', async () => {
    const tree = await mount({ selection: 'single', selected: 'docs' });
    const holder = tree.parentElement as HTMLElement;
    const light = getComputedStyle(face(tree, 'docs')).backgroundColor;
    expect(light).toBe(inside(holder, '--nph-tree-item-background-selected'));
    holder.setAttribute('data-nph-color-scheme', 'dark');
    await frame();
    const dark = getComputedStyle(face(tree, 'docs')).backgroundColor;
    expect(dark).not.toBe(light);
    expect(dark).toBe(inside(holder, '--nph-tree-item-background-selected'));
  });

  it('the colors follow data-nph-brand set on a parent, with the scheme', async () => {
    const tree = await mount({ selection: 'single', selected: 'docs' });
    const holder = tree.parentElement as HTMLElement;
    const before = getComputedStyle(face(tree, 'docs')).backgroundColor;
    holder.setAttribute('data-nph-color-scheme', 'light');
    holder.setAttribute('data-nph-brand', OTHER_BRAND);
    await frame();
    const after = getComputedStyle(face(tree, 'docs')).backgroundColor;
    expect(after).not.toBe(before);
    expect(after).toBe(inside(holder, '--nph-tree-item-background-selected'));
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));
  const declared = [...new Set([...tokensCss.matchAll(/(--nph-tree-[a-z0-9-]+):/g)].map((match) => match[1] ?? ''))];

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('consumes every one of the twenty-five tree/* tokens', () => {
    expect(declared).toHaveLength(25);
    for (const name of declared) {
      expect(used, name).toContain(name);
    }
  });

  it('uses the two text roles, the movement pair and `color/primary` for the spinner', () => {
    for (const name of [
      '--nph-text-body-md-font-size',
      '--nph-text-label-md-font-weight',
      '--nph-motion-expand-duration',
      '--nph-motion-expand-easing',
      '--nph-color-primary',
    ]) {
      expect(used, name).toContain(name);
    }
  });

  it('never consumes a core or theme token', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, duration or measure', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    const measures = [...cssWithoutComments.matchAll(/-?\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/g)].map((match) => match[0]);
    expect(measures).toEqual([]);
  });
});
