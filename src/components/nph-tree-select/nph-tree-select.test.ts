/**
 * Tests of `nph-tree-select` (DSA-94), in a real browser (P21, item 5): the top layer, the keyboard, the form
 * and the accessibility tree only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `7145:9081`, sets `6339:8107` and
 * `6339:8110`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-94 and decision D-1: the API
 * and the invalid input, the roles and the active descendant, the three modes, the keyboard and the pointer,
 * the filter that keeps the ancestors, the cascade and the chips, the form, the load on demand, the panel in
 * the top layer and its measures, and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-tree-select.css?raw';
import '../nph-field/nph-field';
import '../nph-label/nph-label';
import type { NphTreeNode } from '../nph-tree/nph-tree.model';
import type { NphTreeLoadDetail } from '../nph-tree/nph-tree';
import { NPH_TREE_SELECT_MODES, NPH_TREE_SELECT_SIZES, NphTreeSelect } from './nph-tree-select';
import { chipNodes, filterTree, pathOf, typeaheadRow } from './nph-tree-select.logic';
import { buildModel, computeChecks } from '../nph-tree/nph-tree.model';

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

const ITEMS: NphTreeNode[] = [
  {
    id: 'docs',
    label: 'Documents',
    children: [
      {
        id: 'contracts',
        label: 'Contracts',
        children: [
          { id: 'c2025', label: 'Contract 2025.pdf' },
          { id: 'c2026', label: 'Contract 2026.pdf' },
        ],
      },
      { id: 'reports', label: 'Reports' },
    ],
  },
  { id: 'images', label: 'Images', children: [{ id: 'logo', label: 'Logo.png' }] },
  { id: 'readme', label: 'Read-me.txt' },
];

const TEXTS = {
  placeholder: 'Select an item',
  removeLabel: 'Remove',
  clearLabel: 'Clear',
  emptyHeading: 'No items',
  emptyDescription: 'This folder has no items yet.',
  noResultHeading: 'No results',
  noResultDescription: 'Check what you typed.',
  errorText: "Couldn't load.",
  retryText: 'Try again',
  label: 'Folder',
};

async function mount(props: Partial<NphTreeSelect> = {}, parent: HTMLElement = document.body): Promise<NphTreeSelect> {
  const element = document.createElement('nph-tree-select');
  Object.assign(element, { items: ITEMS, ...TEXTS, ...props });
  parent.append(element);
  await settle(element);
  return element;
}

async function settle(element: NphTreeSelect): Promise<void> {
  await element.updateComplete;
  await frame();
  await element.updateComplete;
  for (const inner of element.shadowRoot?.querySelectorAll('nph-icon, nph-checkbox, nph-empty, nph-skeleton, nph-spinner, nph-badge') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
}

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms));
const root = (element: NphTreeSelect): ShadowRoot => element.shadowRoot as ShadowRoot;
const control = (element: NphTreeSelect): HTMLElement => root(element).querySelector('.control') as HTMLElement;
/** The element that holds the DOM focus: the control in single, the text field otherwise. */
const field = (element: NphTreeSelect): HTMLElement => (root(element).querySelector('.field') ?? control(element)) as HTMLElement;
const panel = (element: NphTreeSelect): HTMLElement => root(element).querySelector('.panel') as HTMLElement;
const rows = (element: NphTreeSelect): HTMLElement[] => [...root(element).querySelectorAll<HTMLElement>('[role="treeitem"]')];
const row = (element: NphTreeSelect, key: string): HTMLElement => {
  const found = rows(element).find((item) => item.dataset.key === key);
  if (!found) throw new Error(`no row ${key}`);
  return found;
};
const keysOf = (element: NphTreeSelect): string[] => rows(element).map((item) => item.dataset.key ?? '');
const activeOf = (element: NphTreeSelect): Element | null => (field(element) as HTMLElement & { ariaActiveDescendantElement: Element | null }).ariaActiveDescendantElement;
const activeKey = (element: NphTreeSelect): string | null => (activeOf(element) as HTMLElement | null)?.dataset.key ?? null;
const isOpen = (element: NphTreeSelect): boolean => panel(element).matches(':popover-open');
const chipLabels = (element: NphTreeSelect): string[] => [...root(element).querySelectorAll('.chip-label')].map((chip) => chip.textContent?.trim() ?? '');

async function press(element: NphTreeSelect, key: string): Promise<void> {
  await userEvent.keyboard(key);
  await settle(element);
}

async function open(element: NphTreeSelect): Promise<void> {
  field(element).focus();
  await press(element, '{ArrowDown}');
  await wait(0);
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

describe('the pure rules', () => {
  it('the filter keeps the matches and the ancestors of every match, and opens those ancestors', () => {
    const { items, open: opened } = filterTree(ITEMS, 'contr');
    expect(items.map((node) => node.id)).toEqual(['docs']);
    expect(items[0]?.children?.map((node) => node.id)).toEqual(['contracts']);
    expect(items[0]?.children?.[0]?.children?.map((node) => node.id)).toEqual(['c2025', 'c2026']);
    expect([...opened].sort()).toEqual(['contracts', 'docs']);
  });

  it('the filter has no difference of case, and an empty query keeps everything', () => {
    expect(filterTree([{ id: 'a', label: 'Summary' }], 'SUMMARY').items).toHaveLength(1);
    expect(filterTree(ITEMS, '  ').items).toHaveLength(ITEMS.length);
    expect(filterTree(ITEMS, 'nothing here').items).toEqual([]);
  });

  it('a whole branch checked is one chip, the parent', () => {
    const states = computeChecks(ITEMS, new Set(['contracts']), true);
    expect(chipNodes(ITEMS, states).map((node) => node.id)).toEqual(['contracts']);
    const part = computeChecks(ITEMS, new Set(['c2025']), true);
    expect(chipNodes(ITEMS, part).map((node) => node.id)).toEqual(['c2025']);
  });

  it('the path goes from the first level down to the item', () => {
    expect(pathOf(ITEMS, 'c2025')).toEqual(['Documents', 'Contracts', 'Contract 2025.pdf']);
    expect(pathOf(ITEMS, 'nope')).toEqual([]);
  });

  it('the letter search goes to the next visible item that starts with it, around the end, and cycles', () => {
    const visible = buildModel(ITEMS, [], () => false).visible;
    expect(typeaheadRow(visible, null, 'i')?.key).toBe('images');
    expect(typeaheadRow(visible, 'images', 'i')?.key).toBe('images');
    expect(typeaheadRow(visible, 'readme', 'd')?.key).toBe('docs');
    expect(typeaheadRow(visible, null, 'c')).toBeNull();
  });
});

describe('API and invalid input', () => {
  it('the defaults are single and default, and the lists are the ones of the contract', async () => {
    const element = await mount();
    expect(element.mode).toBe('single');
    expect(element.size).toBe('default');
    expect(NPH_TREE_SELECT_MODES).toEqual(['single', 'search', 'multiple']);
    expect(NPH_TREE_SELECT_SIZES).toEqual(['default', 'large']);
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('a mode, a size or items outside the contract draw nothing and say why, once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bad = await mount({ mode: 'many' });
    expect(bad.shadowRoot?.querySelector('.control')).toBeNull();
    expect(bad.hasAttribute('data-nph-rendered')).toBe(false);
    await bad.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toMatch(/mode "many"/);
    const badSize = await mount({ size: 'huge' });
    expect(badSize.shadowRoot?.querySelector('.control')).toBeNull();
    const badItems = await mount({ items: [{ id: 'a', label: 'A' }, { id: 'a', label: 'B' }] });
    expect(badItems.shadowRoot?.querySelector('.control')).toBeNull();
    expect(String(error.mock.calls.at(-1)?.[0])).toMatch(/repeated/);
  });

  it('setting the value from code fires no event', async () => {
    const element = await mount();
    const seen = vi.fn();
    element.addEventListener('change', seen);
    element.addEventListener('input', seen);
    element.value = 'c2025';
    await settle(element);
    expect(seen).not.toHaveBeenCalled();
    expect(root(element).querySelector('.value')?.textContent?.trim()).toBe('Contract 2025.pdf');
  });

  it('the value attribute is the default until the person or the code sets one', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<nph-tree-select value="images" label="Folder"></nph-tree-select>';
    document.body.append(holder);
    const element = holder.firstElementChild as NphTreeSelect;
    element.items = ITEMS;
    await settle(element);
    expect(element.value).toBe('images');
  });
});

describe('roles and names', () => {
  it('the single field is a combobox that has a tree popup, and says whether it is open', async () => {
    const element = await mount();
    const box = control(element);
    expect(box.getAttribute('role')).toBe('combobox');
    expect(box.getAttribute('aria-haspopup')).toBe('tree');
    expect(box.getAttribute('aria-expanded')).toBe('false');
    expect(box.getAttribute('aria-controls')).toBe('tree');
    await open(element);
    expect(box.getAttribute('aria-expanded')).toBe('true');
    const tree = root(element).querySelector('#tree') as HTMLElement;
    expect(tree.getAttribute('role')).toBe('tree');
    expect(tree.hasAttribute('aria-multiselectable')).toBe(false);
  });

  it('the editable modes give the role to the text field, and the multiple tree is multiselectable', async () => {
    const search = await mount({ mode: 'search' });
    expect(field(search).tagName).toBe('INPUT');
    expect(field(search).getAttribute('role')).toBe('combobox');
    expect(field(search).getAttribute('aria-haspopup')).toBe('tree');
    const multiple = await mount({ mode: 'multiple' });
    await open(multiple);
    expect(root(multiple).querySelector('#tree')?.getAttribute('aria-multiselectable')).toBe('true');
  });

  it('DOM focus stays on the field while the panel is open and the field points at the active item', async () => {
    const element = await mount();
    await open(element);
    expect(root(element).activeElement).toBe(control(element));
    const active = activeOf(element);
    expect(active).not.toBeNull();
    expect(active?.getAttribute('role')).toBe('treeitem');
    expect(root(element).contains(active)).toBe(true);
    expect(activeKey(element)).toBe('docs');
    await press(element, '{ArrowDown}');
    expect(activeKey(element)).toBe('images');
    expect(root(element).activeElement).toBe(control(element));
  });

  it('every item carries its level, its size, its position and its expanded state', async () => {
    const element = await mount({ expanded: ['docs'] });
    await open(element);
    const contracts = row(element, 'contracts');
    expect(contracts.getAttribute('aria-level')).toBe('2');
    expect(contracts.getAttribute('aria-setsize')).toBe('2');
    expect(contracts.getAttribute('aria-posinset')).toBe('1');
    expect(contracts.getAttribute('aria-expanded')).toBe('false');
    expect(row(element, 'docs').getAttribute('aria-expanded')).toBe('true');
    expect(row(element, 'readme').hasAttribute('aria-expanded')).toBe(false);
  });

  it('the whole path of the chosen item follows the label in the name of the field', async () => {
    const element = await mount({ value: 'c2025' });
    await settle(element);
    expect(root(element).querySelector('.path')?.textContent).toBe('Documents, Contracts, Contract 2025.pdf');
    expect(root(element).querySelector('.value')?.textContent?.trim()).toBe('Contract 2025.pdf');
    expect(control(element).getAttribute('aria-label')).toBe('Folder, Documents, Contracts, Contract 2025.pdf');
  });

  it('the label of the nph-field names the field and the tree, and the field passes its error and its state', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<nph-field label="Destination" help="Where it goes"><nph-tree-select></nph-tree-select></nph-field>';
    document.body.append(holder);
    const element = holder.querySelector('nph-tree-select') as NphTreeSelect;
    const { label: _unused, ...texts } = TEXTS;
    Object.assign(element, { items: ITEMS, ...texts });
    await settle(element);
    await open(element);
    expect(element.label).toBe('Destination');
    expect(control(element).getAttribute('aria-label')).toBe('Destination');
    expect(root(element).querySelector('#tree')?.getAttribute('aria-label')).toBe('Destination');
    expect(element.description).toBe('Where it goes');
    (holder.querySelector('nph-field') as HTMLElement & { error: string }).error = 'Choose a folder';
    await settle(element);
    expect(element.invalid).toBe(true);
    expect(element.description).toBe('Choose a folder');
  });
});

describe('single', () => {
  it('a click opens the panel in the top layer with the path to the chosen item open', async () => {
    const element = await mount({ value: 'c2025' });
    await userEvent.click(control(element));
    await settle(element);
    expect(isOpen(element)).toBe(true);
    expect(element.open).toBe(true);
    expect(keysOf(element)).toEqual(['docs', 'contracts', 'c2025', 'c2026', 'reports', 'images', 'readme']);
    expect(activeKey(element)).toBe('c2025');
    expect(row(element, 'c2025').hasAttribute('data-selected')).toBe(true);
    expect(row(element, 'c2025').getAttribute('aria-selected')).toBe('true');
  });

  it('a click on an item chooses it, closes the panel, keeps the focus and fires input and change once', async () => {
    const element = await mount({ expanded: ['docs'] });
    const input = vi.fn();
    const change = vi.fn();
    element.addEventListener('input', input);
    element.addEventListener('change', change);
    await userEvent.click(control(element));
    await settle(element);
    await userEvent.click(row(element, 'reports'));
    await settle(element);
    expect(element.value).toBe('reports');
    expect(element.open).toBe(false);
    expect(input).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledTimes(1);
    expect(root(element).activeElement).toBe(control(element));
    expect(root(element).querySelector('.value')?.textContent?.trim()).toBe('Reports');
  });

  it('a click on the chevron only opens or closes the branch', async () => {
    const element = await mount();
    const toggle = vi.fn();
    element.addEventListener('nph-tree-toggle', (event) => toggle((event as CustomEvent).detail));
    await userEvent.click(control(element));
    await settle(element);
    await userEvent.click(row(element, 'docs').querySelector('.toggle') as HTMLElement);
    await settle(element);
    expect(toggle).toHaveBeenCalledWith({ id: 'docs', expanded: true });
    expect(element.open).toBe(true);
    expect(element.value).toBe('');
    expect(keysOf(element)).toContain('contracts');
  });

  it('choosing the same item again fires nothing', async () => {
    const element = await mount({ value: 'readme' });
    const change = vi.fn();
    element.addEventListener('change', change);
    await userEvent.click(control(element));
    await settle(element);
    await userEvent.click(row(element, 'readme'));
    await settle(element);
    expect(change).not.toHaveBeenCalled();
  });

  it('the keys: open on the chosen item, move, open and close a branch, choose, and Esc closes without choosing', async () => {
    const element = await mount();
    field(element).focus();
    await press(element, '{ArrowDown}');
    expect(element.open).toBe(true);
    expect(activeKey(element)).toBe('docs');
    await press(element, '{ArrowRight}');
    expect(keysOf(element)).toContain('contracts');
    expect(activeKey(element)).toBe('docs');
    await press(element, '{ArrowRight}');
    expect(activeKey(element)).toBe('contracts');
    await press(element, '{ArrowLeft}');
    expect(activeKey(element)).toBe('docs');
    await press(element, '{ArrowLeft}');
    expect(keysOf(element)).not.toContain('contracts');
    await press(element, '{End}');
    expect(activeKey(element)).toBe('readme');
    await press(element, '{Home}');
    expect(activeKey(element)).toBe('docs');
    await press(element, '{Escape}');
    expect(element.open).toBe(false);
    expect(element.value).toBe('');
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    await press(element, '{Enter}');
    expect(element.value).toBe('images');
    expect(element.open).toBe(false);
    expect(root(element).activeElement).toBe(control(element));
  });

  it('Alt+Up chooses the active item and closes; Tab closes without choosing and the focus moves on', async () => {
    const element = await mount();
    const after = document.createElement('button');
    document.body.append(after);
    field(element).focus();
    await press(element, '{ArrowDown}{ArrowDown}');
    await press(element, '{Alt>}{ArrowUp}{/Alt}');
    expect(element.value).toBe('images');
    expect(element.open).toBe(false);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    await userEvent.tab();
    await settle(element);
    expect(element.open).toBe(false);
    expect(element.value).toBe('images');
    expect(document.activeElement).toBe(after);
  });

  it('the asterisk opens the siblings of the active item', async () => {
    const element = await mount();
    await open(element);
    await press(element, '*');
    expect(keysOf(element)).toEqual(expect.arrayContaining(['contracts', 'reports', 'logo']));
  });

  it('a letter on the closed field opens on the next visible item that starts with it, and the value does not change (D-1)', async () => {
    const element = await mount();
    field(element).focus();
    await press(element, 'i');
    expect(element.open).toBe(true);
    expect(activeKey(element)).toBe('images');
    expect(element.value).toBe('');
  });

  it('a letter on the open panel moves the active item, the same letter cycles, and a quick search keeps its Space (D-1)', async () => {
    const items: NphTreeNode[] = [
      { id: 'a1', label: 'Alpha' },
      { id: 'a2', label: 'Apple' },
      { id: 'sp', label: 'Sky blue' },
      { id: 'sa', label: 'Sky red' },
    ];
    const element = await mount({ items });
    await open(element);
    await press(element, 'a');
    expect(activeKey(element)).toBe('a2');
    await wait(600);
    await press(element, 'a');
    expect(activeKey(element)).toBe('a1');
    await wait(600);
    await press(element, 's');
    await press(element, 'k');
    await press(element, 'y');
    await press(element, ' ');
    await press(element, 'r');
    expect(activeKey(element)).toBe('sa');
    expect(element.value).toBe('');
  });

  it('the letters move over visible items only: a closed branch is not opened', async () => {
    const element = await mount();
    await open(element);
    await press(element, 'c');
    expect(activeKey(element)).toBe('docs');
    expect(keysOf(element)).not.toContain('contracts');
  });

  it('a disabled item takes the focus by the arrows and chooses nothing', async () => {
    const items: NphTreeNode[] = [{ id: 'x', label: 'Locked', disabled: true }, { id: 'y', label: 'Open' }];
    const element = await mount({ items });
    await open(element);
    expect(activeKey(element)).toBe('x');
    await press(element, '{Enter}');
    expect(element.value).toBe('');
    expect(element.open).toBe(true);
  });

  it('a press outside closes the panel and keeps the value', async () => {
    const element = await mount({ value: 'readme' });
    await userEvent.click(control(element));
    await settle(element);
    expect(element.open).toBe(true);
    await userEvent.click(document.body);
    await settle(element);
    expect(element.open).toBe(false);
    expect(element.value).toBe('readme');
  });

  it('hover paints the item but does not move the active item', async () => {
    const element = await mount({ expanded: ['docs'] });
    await open(element);
    await userEvent.hover(row(element, 'reports'));
    await settle(element);
    expect(activeKey(element)).toBe('docs');
  });

  it('the active item draws the focus of the tree item by the keyboard only', async () => {
    const element = await mount();
    await open(element);
    expect(row(element, 'docs').hasAttribute('data-focus')).toBe(true);
    const ring = getComputedStyle(row(element, 'docs'), '::before');
    expect(ring.borderTopColor).toBe(resolved('color', '--nph-tree-focus-border'));
    expect(Number.parseFloat(ring.borderTopWidth)).toBe(px('--nph-tree-focus-border-width'));
    const halo = getComputedStyle(row(element, 'docs'), '::after');
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-tree-focus-halo'));
    expect(Number.parseFloat(halo.borderTopWidth)).toBe(px('--nph-tree-focus-halo-width'));
    element.open = false;
    await settle(element);
    await userEvent.click(control(element));
    await settle(element);
    expect(row(element, 'docs').hasAttribute('data-focus')).toBe(false);
  });
});

describe('single with search', () => {
  it('typing opens the panel, filters the tree keeping the ancestors, and the first match is active', async () => {
    const element = await mount({ mode: 'search' });
    field(element).focus();
    await userEvent.keyboard('Contr');
    await settle(element);
    expect(element.open).toBe(true);
    expect(keysOf(element)).toEqual(['docs', 'contracts', 'c2025', 'c2026']);
    expect(activeKey(element)).toBe('contracts');
    expect(row(element, 'docs').getAttribute('aria-expanded')).toBe('true');
  });

  it('Enter chooses the active match, the field shows its label and the filter is gone', async () => {
    const element = await mount({ mode: 'search' });
    field(element).focus();
    await userEvent.keyboard('2026');
    await settle(element);
    await press(element, '{Enter}');
    expect(element.value).toBe('c2026');
    expect(element.open).toBe(false);
    expect((field(element) as HTMLInputElement).value).toBe('Contract 2026.pdf');
    await open(element);
    expect(keysOf(element)).toContain('readme');
  });

  it('with no match the panel says so, with the texts of the owner', async () => {
    const element = await mount({ mode: 'search' });
    field(element).focus();
    await userEvent.keyboard('zzz');
    await settle(element);
    expect(rows(element)).toHaveLength(0);
    const empty = root(element).querySelector('nph-empty') as HTMLElement;
    expect(empty.getAttribute('heading')).toBe('No results');
    expect(empty.getAttribute('description')).toBe('Check what you typed.');
  });

  it('Esc closes the panel and the typed text goes back to the chosen label; on a closed field it clears the text', async () => {
    const element = await mount({ mode: 'search', value: 'readme' });
    field(element).focus();
    await userEvent.keyboard('x');
    await settle(element);
    await press(element, '{Escape}');
    expect(element.open).toBe(false);
    expect((field(element) as HTMLInputElement).value).toBe('Read-me.txt');
  });

  it('the clear target erases the text and gives the focus back to the field', async () => {
    const element = await mount({ mode: 'search' });
    field(element).focus();
    await userEvent.keyboard('Contr');
    await settle(element);
    await userEvent.click(root(element).querySelector('.clear') as HTMLElement);
    await settle(element);
    expect((field(element) as HTMLInputElement).value).toBe('');
    expect(root(element).activeElement).toBe(field(element));
    expect(keysOf(element)).toEqual(['docs', 'images', 'readme']);
  });

  it('Right and Left act on the branch of the active item while the focus stays on the field', async () => {
    const element = await mount({ mode: 'search' });
    await open(element);
    await press(element, '{ArrowRight}');
    expect(keysOf(element)).toContain('contracts');
    expect(root(element).activeElement).toBe(field(element));
  });
});

describe('multiple', () => {
  it('Enter checks the active item and the panel stays open; the typed text is cleared', async () => {
    const element = await mount({ mode: 'multiple', expanded: ['docs'] });
    await open(element);
    await press(element, '{ArrowDown}{ArrowDown}');
    expect(activeKey(element)).toBe('reports');
    await press(element, '{Enter}');
    expect(element.values).toEqual(['reports']);
    expect(element.open).toBe(true);
    expect(chipLabels(element)).toEqual(['Reports']);
    expect(row(element, 'reports').getAttribute('aria-checked')).toBe('true');
    expect(activeKey(element)).toBe('reports');
  });

  it('checking a parent checks its children, a part checked is mixed, and a whole branch is one chip', async () => {
    const element = await mount({ mode: 'multiple', expanded: ['docs', 'contracts'] });
    await userEvent.click(control(element));
    await settle(element);
    await userEvent.click(row(element, 'contracts'));
    await settle(element);
    expect(element.values.sort()).toEqual(['c2025', 'c2026', 'contracts']);
    expect(chipLabels(element)).toEqual(['Contracts']);
    expect(row(element, 'docs').getAttribute('aria-checked')).toBe('mixed');
    await userEvent.click(row(element, 'c2025'));
    await settle(element);
    expect(element.values).toEqual(['c2026']);
    expect(chipLabels(element)).toEqual(['Contract 2026.pdf']);
    expect(row(element, 'contracts').getAttribute('aria-checked')).toBe('mixed');
  });

  it('each change fires input and change', async () => {
    const element = await mount({ mode: 'multiple' });
    const change = vi.fn();
    element.addEventListener('change', change);
    await open(element);
    await press(element, '{Enter}');
    await press(element, '{Enter}');
    expect(change).toHaveBeenCalledTimes(2);
    expect(element.values).toEqual([]);
  });

  it('the remove button of a chip unchecks the whole branch and gives the focus back to the field', async () => {
    const element = await mount({ mode: 'multiple', values: ['contracts', 'c2025', 'c2026'] });
    await settle(element);
    const remove = root(element).querySelector('.remove') as HTMLElement;
    expect(remove.getAttribute('aria-label')).toBe('Remove Contracts');
    await userEvent.click(remove);
    await settle(element);
    expect(element.values).toEqual([]);
    expect(chipLabels(element)).toEqual([]);
  });

  it('the chip repeats the icon of the item when the tree has icons, and has none when it does not (DSA-31 D-3)', async () => {
    const element = await mount({ mode: 'multiple', icons: true, values: ['contracts', 'c2025', 'c2026', 'readme'] });
    await settle(element);
    const icons = [...root(element).querySelectorAll('.chip .chip-icon')].map((icon) => icon.getAttribute('name'));
    expect(icons).toEqual(['folder', 'file']);
    const plain = await mount({ mode: 'multiple', values: ['readme'] });
    await settle(plain);
    expect(root(plain).querySelector('.chip .chip-icon')).toBeNull();
  });

  it('Alt+ArrowDown opens without moving the active item: there is none until the person moves', async () => {
    const element = await mount({ mode: 'multiple' });
    field(element).focus();
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    expect(element.open).toBe(true);
    expect(activeOf(element)).toBeNull();
    expect(rows(element).some((item) => item.hasAttribute('data-focus'))).toBe(false);
    await press(element, '{ArrowDown}');
    expect(activeKey(element)).toBe('docs');
  });

  it('the counter mode shows the subject and how many are chosen, on one line', async () => {
    const element = await mount({ mode: 'multiple', counter: true, subject: 'Folders', values: ['readme', 'images', 'logo'] });
    await settle(element);
    expect(root(element).querySelector('.subject')?.textContent?.trim()).toBe('Folders');
    expect(root(element).querySelector('.count')?.getAttribute('text')).toBe('2');
    expect(root(element).querySelectorAll('.chip')).toHaveLength(0);
  });

  it('typing filters the tree and Alt+Up closes without choosing', async () => {
    const element = await mount({ mode: 'multiple' });
    field(element).focus();
    await userEvent.keyboard('logo');
    await settle(element);
    expect(keysOf(element)).toEqual(['images', 'logo']);
    await press(element, '{Alt>}{ArrowUp}{/Alt}');
    expect(element.open).toBe(false);
    expect(element.values).toEqual([]);
  });

  it('a disabled child stays out of the cascade of its parent', async () => {
    const items: NphTreeNode[] = [{ id: 'p', label: 'Parent', children: [{ id: 'k1', label: 'One' }, { id: 'k2', label: 'Two', disabled: true }] }];
    const element = await mount({ mode: 'multiple', items, expanded: ['p'] });
    await userEvent.click(control(element));
    await settle(element);
    await userEvent.click(row(element, 'p'));
    await settle(element);
    expect(element.values.sort()).toEqual(['k1', 'p']);
  });
});

describe('the form', () => {
  it('the single choice submits its id, and with no name nothing', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount({ name: 'folder', value: 'images' }, form);
    expect(new FormData(form).get('folder')).toBe('images');
    element.name = null;
    await settle(element);
    expect([...new FormData(form).keys()]).toEqual([]);
  });

  it('the multiple choice submits one entry per checked item', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    await mount({ mode: 'multiple', name: 'folders', values: ['readme', 'logo'] }, form);
    expect(new FormData(form).getAll('folders')).toEqual(['readme', 'logo']);
  });

  it('required with no value is a value missing, and it clears when the person chooses', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount({ required: true }, form);
    expect(element.validity.valueMissing).toBe(true);
    expect(form.checkValidity()).toBe(false);
    element.value = 'readme';
    await settle(element);
    expect(element.validity.valueMissing).toBe(false);
  });

  it('a form reset goes back to the default', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount({}, form);
    element.value = 'images';
    form.reset();
    await settle(element);
    expect(element.value).toBe('');
  });
});

describe('disabled and error', () => {
  it('a disabled field does not open and takes no focus', async () => {
    const element = await mount({ disabled: true, value: 'readme' });
    /* `force`: the field is aria-disabled, so the click must not wait for it to become enabled. */
    await userEvent.click(control(element), { force: true });
    await settle(element);
    expect(element.open).toBe(false);
    expect(control(element).hasAttribute('tabindex')).toBe(false);
    expect(control(element).getAttribute('aria-disabled')).toBe('true');
  });

  it('a disabled fieldset disables it', async () => {
    const fieldset = document.createElement('fieldset');
    fieldset.disabled = true;
    document.body.append(fieldset);
    const element = await mount({}, fieldset);
    expect(control(element).getAttribute('aria-disabled')).toBe('true');
  });

  it('the invalid state is told by aria-invalid and by the border', async () => {
    const element = await mount({ invalid: true });
    expect(control(element).getAttribute('aria-invalid')).toBe('true');
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-status-error'));
  });
});

describe('load on demand, empty and first load', () => {
  it('a branch with no loaded children asks for them once when it opens, and shows the spinner in place of the chevron', async () => {
    const element = await mount({ items: [{ id: 'remote', label: 'Remote', branch: true }] });
    const loads: NphTreeLoadDetail[] = [];
    element.addEventListener('nph-tree-load', (event) => loads.push((event as CustomEvent<NphTreeLoadDetail>).detail));
    await open(element);
    await press(element, '{ArrowRight}');
    expect(loads).toEqual([{ id: 'remote', retry: false }]);
    expect(row(element, 'remote').getAttribute('aria-busy')).toBe('true');
    expect(row(element, 'remote').querySelector('nph-spinner')).not.toBeNull();
    await press(element, '{ArrowLeft}');
    await press(element, '{ArrowRight}');
    expect(loads).toHaveLength(1);
  });

  it('a branch that failed shows the error row, and Enter on it tries again with the focus on the field', async () => {
    const failing: NphTreeNode = { id: 'remote', label: 'Remote', branch: true, error: true };
    const element = await mount({ items: [failing], expanded: ['remote'] });
    const loads: NphTreeLoadDetail[] = [];
    element.addEventListener('nph-tree-load', (event) => loads.push((event as CustomEvent<NphTreeLoadDetail>).detail));
    await open(element);
    await press(element, '{ArrowDown}');
    const error = root(element).querySelector('.error-item') as HTMLElement;
    expect(error.getAttribute('aria-label')).toBe("Couldn't load. Try again");
    expect(activeKey(element)).toBe('remote\u0000error');
    await press(element, '{Enter}');
    expect(loads).toEqual([{ id: 'remote', retry: true }]);
    expect(root(element).activeElement).toBe(control(element));
  });

  it('a tree with no items shows the empty message; the first load shows the skeleton and a busy tree', async () => {
    const empty = await mount({ items: [] });
    await open(empty);
    expect(root(empty).querySelector('nph-empty')?.getAttribute('heading')).toBe('No items');
    const loading = await mount({ items: [], loading: true });
    await open(loading);
    expect(root(loading).querySelectorAll('nph-skeleton').length).toBeGreaterThan(0);
    expect(root(loading).querySelector('#tree')?.getAttribute('aria-busy')).toBe('true');
  });
});

describe('the panel', () => {
  it('opens below the field, aligned to its start, tree-select/panel-offset away, with the token as minimum width', async () => {
    const element = await mount();
    await open(element);
    await wait(400);
    const field0 = control(element).getBoundingClientRect();
    const box = panel(element).getBoundingClientRect();
    expect(panel(element).getAttribute('data-side')).toBe('bottom');
    expect(box.left).toBeCloseTo(field0.left, 0);
    expect(box.top - field0.bottom).toBeCloseTo(px('--nph-tree-select-panel-offset'), 0);
    expect(box.width).toBeGreaterThanOrEqual(px('--nph-tree-select-panel-width'));
  });

  it('the multiple choice panel is at least as wide as the multiple token, and a stretched field gives its width', async () => {
    const holder = document.createElement('div');
    holder.style.inlineSize = '700px';
    document.body.append(holder);
    const element = await mount({ mode: 'multiple' }, holder);
    element.style.inlineSize = '600px';
    await open(element);
    expect(panel(element).getBoundingClientRect().width).toBeCloseTo(600, 0);
    const narrow = await mount({ mode: 'multiple' });
    await open(narrow);
    expect(panel(narrow).getBoundingClientRect().width).toBeGreaterThanOrEqual(px('--nph-tree-select-panel-width-multiple'));
  });

  it('above the maximum height the tree scrolls inside the panel, and the width does not shrink', async () => {
    const many: NphTreeNode[] = Array.from({ length: 40 }, (_, index) => ({ id: `n${String(index)}`, label: `Item ${String(index)}` }));
    const element = await mount({ items: many });
    await open(element);
    const scroller = root(element).querySelector('.scroller') as HTMLElement;
    expect(scroller.getBoundingClientRect().height).toBeLessThanOrEqual(px('--nph-tree-select-panel-max-height') + 1);
    expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
    await press(element, '{End}');
    const active = activeOf(element) as HTMLElement;
    const box = scroller.getBoundingClientRect();
    expect(active.getBoundingClientRect().bottom).toBeLessThanOrEqual(box.bottom + 1);
  });

  it('with no room below it opens above, at the same distance', async () => {
    const holder = document.createElement('div');
    holder.style.cssText = `position: fixed; inset-inline-start: 20px; inset-block-end: 4px;`;
    document.body.append(holder);
    const element = await mount({ expanded: ['docs', 'contracts'] }, holder);
    await open(element);
    await wait(400);
    const field0 = control(element).getBoundingClientRect();
    const box = panel(element).getBoundingClientRect();
    expect(panel(element).getAttribute('data-side')).toBe('top');
    expect(field0.top - box.bottom).toBeCloseTo(px('--nph-tree-select-panel-offset'), 0);
  });

  it('draws the panel tokens: background, outline, radius and the dropdown shadow', async () => {
    const element = await mount();
    await open(element);
    const style = getComputedStyle(panel(element));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-tree-select-panel-background'));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-tree-select-panel-border'));
    expect(Number.parseFloat(style.borderTopWidth)).toBe(px('--nph-tree-select-panel-border-width'));
    expect(Number.parseFloat(style.borderTopLeftRadius)).toBe(px('--nph-tree-select-panel-radius'));
    expect(style.boxShadow).not.toBe('none');
  });

  it('the first load shows the skeleton in the new background, which differs from the panel in dark', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    const element = await mount({ items: [], loading: true });
    await open(element);
    const shape = root(element).querySelector('nph-skeleton') as HTMLElement;
    const inner = getComputedStyle(shape).backgroundColor;
    expect(inner).not.toBe(getComputedStyle(panel(element)).backgroundColor);
  });
});

describe('the whole label of a cut item', () => {
  const LONG = 'A very long folder name that cannot fit in the panel of two hundred and eighty pixels';
  const cutItems: NphTreeNode[] = [
    { id: 'long', label: LONG },
    { id: 'short', label: 'Short' },
  ];
  const balloons = (element: NphTreeSelect): Array<HTMLElement & { open: boolean; text: string; for: string; relation: string }> =>
    [...root(element).querySelectorAll('nph-tooltip')] as Array<HTMLElement & { open: boolean; text: string; for: string; relation: string }>;

  it('only a cut label gets a balloon, pointing at its row, with the whole text as its name', async () => {
    const element = await mount({ items: cutItems });
    await open(element);
    await settle(element);
    const found = balloons(element);
    expect(found).toHaveLength(1);
    expect(found[0]?.text).toBe(LONG);
    expect(found[0]?.relation).toBe('name');
    expect(found[0]?.for).toBe(row(element, 'long').id);
    expect(row(element, 'long').getAttribute('tabindex')).toBe('-1');
  });

  it('the active item opens its balloon at once when the keyboard put it there, with the focus on the field', async () => {
    const element = await mount({ items: cutItems });
    await open(element);
    await settle(element);
    expect(activeKey(element)).toBe('long');
    expect(balloons(element)[0]?.open).toBe(true);
    expect(root(element).activeElement).toBe(control(element));
    await press(element, '{ArrowDown}');
    expect(balloons(element)[0]?.open).toBe(false);
  });

  it('the pointer opens it after motion/hover-delay and closes it when it leaves', async () => {
    const element = await mount({ items: cutItems });
    await userEvent.click(control(element));
    await settle(element);
    expect(balloons(element)).toHaveLength(1);
    await userEvent.hover(row(element, 'long'));
    expect(balloons(element)[0]?.open).toBe(false);
    await wait(700);
    await settle(element);
    expect(balloons(element)[0]?.open).toBe(true);
    await userEvent.unhover(row(element, 'long'));
    await wait(50);
    expect(balloons(element)[0]?.open).toBe(false);
    expect(root(element).activeElement).toBe(control(element));
  });

  it('a click on a cut item still chooses it: the row takes no focus from the field', async () => {
    const element = await mount({ items: cutItems });
    await userEvent.click(control(element));
    await settle(element);
    await userEvent.click(row(element, 'long'));
    await settle(element);
    expect(element.value).toBe('long');
    expect(root(element).activeElement).toBe(control(element));
  });
});

describe('the resting border, the heights and the arrow area, by mode', () => {
  const MODES = [
    ['single', 'select'],
    ['search', 'combobox'],
    ['multiple', 'multi-combobox'],
  ] as const;
  for (const [mode, mirrored] of MODES) {
    it(`${mode}: the resting border is ${mirrored}/border on top and sides and ${mirrored}/border-bottom below; hover, focus and error paint the whole border`, async () => {
      const element = await mount({ mode });
      const style = (): CSSStyleDeclaration => getComputedStyle(control(element));
      expect(style().borderTopColor).toBe(resolved('color', `--nph-${mirrored}-border`));
      expect(style().borderLeftColor).toBe(resolved('color', `--nph-${mirrored}-border`));
      expect(style().borderBottomColor).toBe(resolved('color', `--nph-${mirrored}-border-bottom`));
      expect(control(element).getBoundingClientRect().height).toBeCloseTo(px(`--nph-${mirrored}-height`), 1);
      await userEvent.hover(control(element));
      expect(style().borderTopColor).toBe(resolved('color', '--nph-color-input-hover'));
      expect(style().borderBottomColor).toBe(resolved('color', '--nph-color-input-hover'));
      await userEvent.unhover(control(element));
      element.invalid = true;
      await element.updateComplete;
      expect(style().borderTopColor).toBe(resolved('color', '--nph-status-error'));
      expect(style().borderBottomColor).toBe(resolved('color', '--nph-status-error'));
      element.invalid = false;
      element.disabled = true;
      await element.updateComplete;
      expect(style().borderTopColor).toBe(resolved('color', '--nph-color-input'));
      expect(style().borderBottomColor).toBe(resolved('color', '--nph-color-input'));
    });
  }
  it('focus paints the whole border in focus/border', async () => {
    const element = await mount({ mode: 'search' });
    field(element).focus();
    await element.updateComplete;
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(getComputedStyle(control(element)).borderBottomColor).toBe(resolved('color', '--nph-focus-border'));
  });
  it('the modes keep their own height in large: control/height-large, as a minimum in multiple', async () => {
    for (const mode of ['single', 'search', 'multiple'] as const) {
      const element = await mount({ mode, size: 'large' });
      expect(control(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-large'), 1);
    }
  });
  for (const mode of ['single', 'search'] as const) {
    it(`${mode}: the arrow area has no background and no divider, also disabled, and is control/height-default wide`, async () => {
      const element = await mount({ mode });
      const arrow = root(element).querySelector('.arrow') as HTMLElement;
      const style = getComputedStyle(arrow);
      expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(style.borderLeftWidth).toBe('0px');
      expect(arrow.getBoundingClientRect().width).toBeCloseTo(px('--nph-control-height-default'), 1);
      element.disabled = true;
      await element.updateComplete;
      expect(getComputedStyle(arrow).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(control(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
    });
  }
});
describe('sizes', () => {
  it('large changes the height of the field and not the panel', async () => {
    const normal = await mount();
    const large = await mount({ size: 'large' });
    expect(control(normal).getBoundingClientRect().height).toBe(px('--nph-select-height'));
    expect(control(large).getBoundingClientRect().height).toBe(px('--nph-control-height-large'));
    await open(large);
    expect(row(large, 'docs').getBoundingClientRect().height).toBe(px('--nph-tree-item-height'));
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) expect(tokensCss, name).toContain(`${name}:`);
  });

  it('consumes every one of the eight tree-select/* tokens', () => {
    const declared = [...new Set([...tokensCss.matchAll(/(--nph-tree-select-[a-z0-9-]+):/g)].map((match) => match[1] ?? ''))];
    expect(declared).toHaveLength(8);
    for (const name of declared) expect(used, name).toContain(name);
  });

  it('writes no core or theme token and no literal color', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  });

  it('checks a tree of the chips of every check state', () => {
    const states = computeChecks(ITEMS, new Set(['docs']), true);
    expect(chipNodes(ITEMS, states).map((node) => node.id)).toEqual(['docs']);
  });
});
