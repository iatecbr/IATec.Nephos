/**
 * Tests of the rich option inside the lists that own it (DSA-91, P134), in a real browser.
 *
 * They prove what the `nph-select`, the `nph-combobox` and the `nph-multi-combobox` give the
 * rich look of `nph-option` (`rich`, `description`): the option is turned on by its own
 * attribute, the list tells the option whether the active option came by the keyboard or by the
 * pointer (so only the keyboard draws the focus border and the halo), a pointer position the
 * browser repeats is not a move, the description reaches the screen reader while the focus stays on the field, and the
 * plain option next to a rich one keeps the look it had. The option alone is proved in
 * `nph-option.rich.test.ts`.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import { NphCombobox } from '../nph-combobox/nph-combobox';
import type { NphComboboxEntry } from '../nph-combobox/nph-combobox';
import { entryProblems } from '../nph-combobox/nph-combobox.list';
import { NphMultiCombobox } from '../nph-multi-combobox/nph-multi-combobox';
import { NphOption } from '../nph-option/nph-option';
import { NphSelect } from '../nph-select/nph-select';

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

const trigger = (select: NphSelect): HTMLElement => select.shadowRoot?.querySelector('.trigger') as HTMLElement;
const optionAt = (select: NphSelect, index: number): NphOption => select.querySelectorAll('nph-option')[index] as NphOption;

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

async function settle(root: ParentNode = document.body): Promise<void> {
  const elements = [...root.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-select, nph-option, nph-combobox, nph-multi-combobox')];
  await Promise.all(elements.map((element) => element.updateComplete));
  await frame();
  await Promise.all(elements.map((element) => element.updateComplete));
}

function colorOf(token: string): string {
  const probe = document.createElement('div');
  probe.style.backgroundColor = `var(${token})`;
  document.body.append(probe);
  const value = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return value;
}

function ringOf(option: Element): { border: string; halo: string; layer: string } {
  const root = option.shadowRoot as ShadowRoot;
  const display = (selector: string): string => getComputedStyle(root.querySelector(selector) as Element).display;
  return { border: display('.focus-border'), halo: display('.focus-halo'), layer: display('.layer') };
}

interface AxProbe {
  role: string;
  name: string;
  description: string;
}

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
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    const own = nodes[0];
    return { role: String(own?.role?.value ?? ''), name: String(own?.name?.value ?? ''), description: String(own?.description?.value ?? '') };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

/** A real pointer position over an element: the list hears a `pointermove` there. */
function moveOver(element: Element, x = 4, y = 4): void {
  const box = element.getBoundingClientRect();
  element.dispatchEvent(
    new PointerEvent('pointermove', { bubbles: true, composed: true, clientX: box.left + x, clientY: box.top + y }),
  );
}

describe('nph-select with rich options', () => {
  const OPTIONS = `
    <nph-option rich value="free" description="For one person and one project.">Free</nph-option>
    <nph-option rich value="team" description="For a team that shares projects.">Team</nph-option>
    <nph-option rich value="company" disabled description="Billed by contract.">Company</nph-option>
    <nph-option value="plain">Plain option</nph-option>`;

  async function mount(): Promise<NphSelect> {
    const holder = document.createElement('div');
    holder.innerHTML = `<nph-select label="Plan">${OPTIONS}</nph-select>`;
    document.body.append(holder);
    await settle(holder);
    return holder.querySelector('nph-select') as NphSelect;
  }


  it('an option is rich by its own attribute: one list holds the rich and the plain option', async () => {
    const select = await mount();
    expect([0, 1, 2, 3].map((index) => optionAt(select, index).rich)).toEqual([true, true, true, false]);
    expect(optionAt(select, 0).shadowRoot?.querySelector('.description')?.textContent).toBe('For one person and one project.');
    expect(optionAt(select, 3).shadowRoot?.querySelector('.description')).toBeNull();
  });

  it('the keyboard makes the active option draw the layer, the focus border and the halo', async () => {
    const select = await mount();
    trigger(select).focus();
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    const first = optionAt(select, 0);
    expect(first.active).toBe(true);
    expect(first.keyboard).toBe(true);
    expect(ringOf(first)).toEqual({ border: 'block', halo: 'block', layer: 'block' });
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    expect(ringOf(first)).toEqual({ border: 'none', halo: 'none', layer: 'none' });
    expect(ringOf(optionAt(select, 1))).toEqual({ border: 'block', halo: 'block', layer: 'block' });
  });

  it('the list skips the disabled option, as it does today', async () => {
    const select = await mount();
    trigger(select).focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    await settle();
    expect(optionAt(select, 3).active).toBe(true);
    expect(optionAt(select, 2).active).toBe(false);
  });

  it('the pointer paints the layer and no focus border or halo', async () => {
    const select = await mount();
    trigger(select).click();
    await settle();
    moveOver(optionAt(select, 1));
    await settle();
    const second = optionAt(select, 1);
    expect(second.active).toBe(true);
    expect(second.keyboard).toBe(false);
    expect(ringOf(second)).toEqual({ border: 'none', halo: 'none', layer: 'block' });
  });

  it('a click on the trigger opens with no focus ring, and the first arrow brings it', async () => {
    const select = await mount();
    await userEvent.click(trigger(select));
    await settle();
    expect(optionAt(select, 0).active).toBe(true);
    expect(ringOf(optionAt(select, 0)).border).toBe('none');
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    expect(optionAt(select, 1).keyboard).toBe(true);
    expect(ringOf(optionAt(select, 1)).border).toBe('block');
  });

  it('after the keyboard, the pointer moving brings the pointer look back; the same position does not', async () => {
    const select = await mount();
    trigger(select).focus();
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    /* The list slides in as it opens: measure the positions once it rests. */
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    moveOver(optionAt(select, 1), 6, 6);
    await settle();
    expect(optionAt(select, 1).keyboard).toBe(false);
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    expect(optionAt(select, 3).keyboard).toBe(true);
    /* The browser repeats the last position when the list scrolls under a parked pointer: no move. */
    const parked = optionAt(select, 1);
    const box = parked.getBoundingClientRect();
    parked.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true, clientX: box.left + 6, clientY: box.top + 6 }));
    await settle();
    expect(optionAt(select, 1).active).toBe(true);
    expect(optionAt(select, 1).keyboard).toBe(true);
  });

  it('a real pointer over a list taller than its limit: the keyboard moves the active option and the ring follows it', async () => {
    const holder = document.createElement('div');
    const many = Array.from({ length: 10 }, (_, index) => `<nph-option rich value="v${index}" description="Description ${index}.">Option ${index}</nph-option>`).join('');
    holder.innerHTML = `<nph-select label="Plan">${many}</nph-select>`;
    document.body.append(holder);
    await settle(holder);
    const select = holder.querySelector('nph-select') as NphSelect;
    await userEvent.click(trigger(select));
    await settle();
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    const scroller = select.shadowRoot?.querySelector('.scroller') as HTMLElement;
    expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
    await userEvent.hover(optionAt(select, 1));
    await settle();
    expect(optionAt(select, 1).active).toBe(true);
    expect(optionAt(select, 1).keyboard).toBe(false);
    for (let step = 0; step < 6; step += 1) {
      await userEvent.keyboard('{ArrowDown}');
    }
    await settle();
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    const active = [...select.querySelectorAll('nph-option')].filter((item) => (item as NphOption).active) as NphOption[];
    expect(active).toHaveLength(1);
    expect(active[0]).toBe(optionAt(select, 7));
    expect(active[0]?.keyboard).toBe(true);
    expect(ringOf(active[0] as NphOption)).toEqual({ border: 'block', halo: 'block', layer: 'block' });
    expect(scroller.scrollTop).toBeGreaterThan(0);
  });

  it('the active option is the one the field points to, with the label as the name and the description as the description', async () => {
    const select = await mount();
    trigger(select).focus();
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    const pointed = (trigger(select) as HTMLElement & { ariaActiveDescendantElement: Element | null }).ariaActiveDescendantElement;
    expect(pointed).toBe(optionAt(select, 0));
    const node = await axNode(optionAt(select, 0));
    expect(node.role).toBe('option');
    expect(node.name).toBe('Free');
    expect(node.description).toBe('For one person and one project.');
  });

  it('a plain option in the same list keeps the full accent when active, with no ring, even by the keyboard', async () => {
    const select = await mount();
    trigger(select).focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    await settle();
    const plain = optionAt(select, 3);
    expect(plain.active).toBe(true);
    expect(plain.keyboard).toBe(true);
    expect(getComputedStyle(plain).backgroundColor).toBe(colorOf('--nph-color-accent'));
    expect(plain.shadowRoot?.querySelector('.focus-border')).toBeNull();
  });

  it('the chosen rich option has the check and no selected background; the plain one keeps the surface', async () => {
    const select = await mount();
    select.value = 'free';
    await settle();
    const rich = optionAt(select, 0);
    expect(rich.selected).toBe(true);
    expect(getComputedStyle(rich).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(rich.shadowRoot?.querySelector('.check')).not.toBeNull();
    select.value = 'plain';
    await settle();
    expect(getComputedStyle(optionAt(select, 3)).backgroundColor).toBe(colorOf('--nph-color-primary-surface'));
  });

  it('the list keeps the halo clipped at its edge: the scroll box is the one of the select', async () => {
    const select = await mount();
    const scroller = select.shadowRoot?.querySelector('.scroller') as HTMLElement;
    expect(getComputedStyle(scroller).overflowY).toBe('auto');
    const probe = document.createElement('div');
    probe.style.paddingTop = 'var(--nph-space-inline-tight)';
    document.body.append(probe);
    expect(getComputedStyle(scroller).paddingTop).toBe(getComputedStyle(probe).paddingTop);
  });
});

describe('nph-combobox with rich options', () => {
  const ENTRIES: NphComboboxEntry[] = [
    { value: 'ana', text: 'Ana Souza', start: 'avatar', rich: true, description: 'Design lead' },
    { value: 'bruno', text: 'Bruno Lima', start: 'avatar', rich: true },
    { value: 'carla', text: 'Carla Rocha', rich: true, description: 'Engineering', disabled: true },
    { value: 'diana', text: 'Diana Alves' },
  ];

  async function mount(attributes = ''): Promise<NphCombobox> {
    const holder = document.createElement('div');
    holder.innerHTML = `<nph-combobox label="Assignee" create-label="Create" ${attributes}></nph-combobox>`;
    const element = holder.querySelector('nph-combobox') as NphCombobox;
    element.options = ENTRIES;
    document.body.append(holder);
    await settle(holder);
    return element;
  }

  const field = (element: NphCombobox): HTMLElement => element.shadowRoot?.querySelector('.field') as HTMLElement;
  const rows = (element: NphCombobox): NphOption[] => [...(element.shadowRoot?.querySelectorAll('nph-option') ?? [])] as NphOption[];

  it('the data of an option turns the rich look on: rich and description reach the option', async () => {
    const element = await mount();
    field(element).focus();
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    const list = rows(element);
    expect(list.map((row) => row.rich)).toEqual([true, true, true, false]);
    expect(list[0]?.description).toBe('Design lead');
    expect(list[1]?.description).toBe('');
    expect(list[1]?.shadowRoot?.querySelector('.description')).toBeNull();
  });

  it('the keyboard brings the focus border and the halo; the pointer does not', async () => {
    const element = await mount();
    field(element).focus();
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    const list = rows(element);
    expect(list[0]?.active).toBe(true);
    expect(ringOf(list[0] as NphOption)).toEqual({ border: 'block', halo: 'block', layer: 'block' });
    moveOver(list[1] as NphOption);
    await settle();
    expect(rows(element)[1]?.active).toBe(true);
    expect(ringOf(rows(element)[1] as NphOption)).toEqual({ border: 'none', halo: 'none', layer: 'block' });
  });

  it('typing is the keyboard: the first match is active with the focus border', async () => {
    const element = await mount();
    field(element).focus();
    await userEvent.keyboard('Ana');
    await settle();
    const match = rows(element).find((row) => row.active) as NphOption;
    expect(match.keyboard).toBe(true);
    expect(ringOf(match).border).toBe('block');
  });

  it('the create row stays a plain option with no ring, even by the keyboard', async () => {
    const element = await mount('creatable');
    field(element).focus();
    await userEvent.keyboard('Zed');
    await settle();
    const create = rows(element).find((row) => row.classList.contains('create')) as NphOption;
    expect(create).toBeDefined();
    expect(create.rich).toBe(false);
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    expect(create.shadowRoot?.querySelector('.focus-border')).toBeNull();
  });

  it('the description is the description of the option the field points to', async () => {
    const element = await mount();
    field(element).focus();
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    const node = await axNode(rows(element)[0] as NphOption);
    expect(node.name).toBe('Ana Souza');
    expect(node.description).toBe('Design lead');
  });

  it('an entry with a rich that is not a boolean, or a description that is not text, is rejected with one cause each', () => {
    expect(entryProblems({ value: 'a', text: 'A', rich: 'yes' })).toEqual(['an option rich "yes" is not a boolean']);
    expect(entryProblems({ value: 'a', text: 'A', description: 3 })).toEqual(['an option description is not a string']);
    expect(entryProblems({ value: 'a', text: 'A', rich: true, description: 'Short.' })).toEqual([]);
  });
});

describe('nph-multi-combobox with rich options', () => {
  async function mount(): Promise<NphMultiCombobox> {
    const holder = document.createElement('div');
    holder.innerHTML = '<nph-multi-combobox label="People"></nph-multi-combobox>';
    const element = holder.querySelector('nph-multi-combobox') as NphMultiCombobox;
    element.options = [
      { value: 'ana', text: 'Ana Souza', start: 'avatar', rich: true, description: 'Design lead' },
      { value: 'bruno', text: 'Bruno Lima', start: 'avatar', rich: true },
    ];
    document.body.append(holder);
    await settle(holder);
    return element;
  }

  const field = (element: NphMultiCombobox): HTMLElement => element.shadowRoot?.querySelector('.field') as HTMLElement;
  const rows = (element: NphMultiCombobox): NphOption[] => [...(element.shadowRoot?.querySelectorAll('nph-option') ?? [])] as NphOption[];

  it('the rich option with the checkbox marker: the box, the description, and the ring only by the keyboard', async () => {
    const element = await mount();
    field(element).focus();
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    const list = rows(element);
    expect(list.every((row) => row.marker === 'checkbox' && row.rich)).toBe(true);
    expect(list[0]?.shadowRoot?.querySelector('nph-checkbox')).not.toBeNull();
    expect(ringOf(list[0] as NphOption)).toEqual({ border: 'block', halo: 'block', layer: 'block' });
    moveOver(list[1] as NphOption);
    await settle();
    expect(ringOf(rows(element)[1] as NphOption)).toEqual({ border: 'none', halo: 'none', layer: 'block' });
  });

  it('a chosen rich option keeps the checked box and takes no selected background', async () => {
    const element = await mount();
    field(element).focus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await settle();
    const first = rows(element)[0] as NphOption;
    expect(first.selected).toBe(true);
    expect(getComputedStyle(first).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect((first.shadowRoot?.querySelector('nph-checkbox') as unknown as { checked: boolean }).checked).toBe(true);
  });
});

describe('the lists import the option contract and nothing else', () => {
  it('every token the rich look needs is in the generated CSS', () => {
    for (const name of ['--nph-select-option-focus-border', '--nph-select-option-focus-halo', '--nph-select-option-background-hover-opacity', '--nph-rich-option-background-hover-opacity']) {
      expect(tokensCss).toContain(`${name}:`);
    }
  });

  it('the option class is shared: one definition for the select and the combobox lists', () => {
    expect(customElements.get('nph-option')).toBe(NphOption);
  });
});
