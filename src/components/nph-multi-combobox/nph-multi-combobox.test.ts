/**
 * Tests of `nph-multi-combobox` (P96), in a real browser (P21, item 5): the top layer, the
 * keyboard, the form and the accessibility tree only exist where there is layout.
 *
 * They prove the contract accepted in Figma (board `1467:25660`, set `1467:25652`, chip
 * `1467:24879`, the `nph-combobox` list `1359:141`, option `1357:136`), D1 to D3 and the
 * pending decisions D-1 to D-4 in their default: the API, the list of `nph-combobox` with
 * `nph-option` rows in the `checkbox` marker (P91 amended by P96, P95), the chips and their
 * remove buttons, the counter, the values and the form association (P80), the field contract
 * (P83), the accessible name, the pointer and the keyboard, the events, the list in the top
 * layer, the measures, the states and their precedence, the invalid input and the token
 * contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-multi-combobox.css?raw';
import listCss from '../nph-combobox/nph-combobox.list.css?raw';
import '../nph-field/nph-field';
import type { NphBadge } from '../nph-badge/nph-badge';
import type { NphCheckbox } from '../nph-checkbox/nph-checkbox';
import type { NphComboboxEntry } from '../nph-combobox/nph-combobox';
import { NphOption } from '../nph-option/nph-option';
import { NPH_MULTI_COMBOBOX_CHIP_ICON, NPH_MULTI_COMBOBOX_SIZES, NphMultiCombobox } from './nph-multi-combobox';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 12px "Noto Sans"');
  await document.fonts.load('600 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

const COUNTRIES = ['Argentina', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Mexico', 'Paraguay', 'Peru', 'Uruguay', 'Venezuela'];

function countries(labels: readonly string[] = COUNTRIES): NphComboboxEntry[] {
  return labels.map((label) => ({ value: label.toLowerCase(), text: label }));
}

const BASE = 'label="Countries" remove-label="Remove"';

async function settle(root: ParentNode = document.body): Promise<void> {
  const elements = [...root.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-multi-combobox, nph-field, nph-label')];
  await Promise.all(elements.map((element) => element.updateComplete));
  await Promise.all(elements.map((element) => element.updateComplete));
  const inner = elements.flatMap((element) => [...(element.shadowRoot?.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-option, nph-empty, nph-badge, nph-icon') ?? [])]);
  await Promise.all(inner.map((element) => element.updateComplete));
  const boxes = inner.flatMap((element) => [...(element.shadowRoot?.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-checkbox') ?? [])]);
  await Promise.all(boxes.map((element) => element.updateComplete));
}

/** Mounts from markup, then sets the options and the values as properties, as a framework would. */
async function mount(
  attributes = BASE,
  entries: readonly NphComboboxEntry[] = countries(),
  values: readonly string[] | null = null,
  parent: HTMLElement = document.body,
): Promise<NphMultiCombobox> {
  const holder = document.createElement('div');
  holder.innerHTML = `<nph-multi-combobox ${attributes}></nph-multi-combobox>`;
  const element = holder.querySelector('nph-multi-combobox') as NphMultiCombobox;
  element.options = entries;
  if (values !== null) {
    element.defaultValue = values;
  }
  parent.append(holder);
  await settle(holder);
  return element;
}

function control(element: NphMultiCombobox): HTMLElement {
  const box = element.shadowRoot?.querySelector<HTMLElement>('.control');
  if (!box) throw new Error('no control');
  return box;
}

function field(element: NphMultiCombobox): HTMLInputElement {
  const input = element.shadowRoot?.querySelector<HTMLInputElement>('.field');
  if (!input) throw new Error('no field');
  return input;
}

function list(element: NphMultiCombobox): HTMLElement {
  const box = element.shadowRoot?.querySelector<HTMLElement>('.list');
  if (!box) throw new Error('no list');
  return box;
}

function listbox(element: NphMultiCombobox): HTMLElement {
  return element.shadowRoot?.querySelector<HTMLElement>('.listbox') as HTMLElement;
}

function rows(element: NphMultiCombobox): NphOption[] {
  return [...(element.shadowRoot?.querySelectorAll<NphOption>('nph-option') ?? [])];
}

function texts(element: NphMultiCombobox): string[] {
  return rows(element).map((row) => row.textContent?.replace(/\s+/g, ' ').trim() ?? '');
}

function row(element: NphMultiCombobox, text: string): NphOption {
  const found = rows(element).find((item) => item.textContent?.trim() === text);
  if (!found) throw new Error(`no row ${text}`);
  return found;
}

function chips(element: NphMultiCombobox): HTMLElement[] {
  return [...(element.shadowRoot?.querySelectorAll<HTMLElement>('.chip') ?? [])];
}

function chipTexts(element: NphMultiCombobox): string[] {
  return chips(element).map((chip) => chip.querySelector('.chip-label')?.textContent?.trim() ?? '');
}

function removeButtons(element: NphMultiCombobox): HTMLButtonElement[] {
  return [...(element.shadowRoot?.querySelectorAll<HTMLButtonElement>('.remove') ?? [])];
}

function activeOf(element: NphMultiCombobox): Element | null {
  const id = field(element).getAttribute('aria-activedescendant');
  return id === null ? null : (element.shadowRoot?.getElementById(id) ?? null);
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function press(element: NphMultiCombobox, key: string): Promise<void> {
  await userEvent.keyboard(key);
  await settle(element.parentElement ?? document.body);
}

async function focus(element: NphMultiCombobox): Promise<void> {
  field(element).focus();
  await settle(element.parentElement ?? document.body);
}

async function type(element: NphMultiCombobox, text: string): Promise<void> {
  await focus(element);
  await userEvent.keyboard(text);
  await settle(element.parentElement ?? document.body);
}

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

function px(token: string): number {
  return Number.parseFloat(resolved('width', token));
}

interface AXNode {
  role?: { value?: string };
  name?: { value?: string };
  description?: { value?: string };
  properties?: Array<{ name: string; value: { value?: unknown } }>;
  ignored?: boolean;
}

/** The node of an element in the accessibility tree of Chromium, looked up through the DOM domain. */
async function accessibleNodeOf(target: Element): Promise<AXNode> {
  const session = cdp();
  await session.send('Accessibility.enable');
  target.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    return (nodes[0] ?? {}) as AXNode;
  } finally {
    target.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('defines nph-multi-combobox and draws its options as nph-option with the checkbox marker', async () => {
    const element = await mount();
    expect(customElements.get('nph-multi-combobox')).toBe(NphMultiCombobox);
    element.open = true;
    await settle();
    expect(rows(element)).toHaveLength(COUNTRIES.length);
    for (const option of rows(element)) {
      expect(option).toBeInstanceOf(NphOption);
      expect(option.marker).toBe('checkbox');
    }
  });

  it('defaults: size default, no counter, no chip icon, closed, no value', async () => {
    const element = await mount('');
    expect(element.size).toBe('default');
    expect(element.counter).toBe(false);
    expect(element.subject).toBe('');
    expect(element.chipIcon).toBe(false);
    expect(element.removeLabel).toBe('');
    expect(element.open).toBe(false);
    expect(element.value).toEqual([]);
    expect(element.defaultValue).toEqual([]);
    expect(element.query).toBe('');
    expect(element.name).toBeNull();
    expect(NPH_MULTI_COMBOBOX_SIZES).toEqual(['default', 'large']);
    expect(NPH_MULTI_COMBOBOX_CHIP_ICON).toBe('tag');
  });

  it('reflects size, counter, open, name, required, disabled and invalid', async () => {
    const element = await mount();
    element.size = 'large';
    element.counter = true;
    element.subject = 'Countries';
    element.name = 'countries';
    element.required = true;
    element.invalid = true;
    element.open = true;
    await settle();
    for (const name of ['counter', 'open', 'required', 'invalid']) {
      expect(element.hasAttribute(name), name).toBe(true);
    }
    expect(element.getAttribute('size')).toBe('large');
    expect(element.getAttribute('name')).toBe('countries');
    element.disabled = true;
    await settle();
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  it('the inner field is an editable combobox that controls a listbox of several choices in the same root', async () => {
    const element = await mount();
    const input = field(element);
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-controls')).toBe('listbox');
    expect(listbox(element).getAttribute('role')).toBe('listbox');
    expect(listbox(element).getAttribute('aria-multiselectable')).toBe('true');
  });

  it('has no part, no slot, no width or color property, and no nphFieldRole (single control, P83)', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelectorAll('[part]').length).toBe(0);
    expect(element.shadowRoot?.querySelectorAll('slot').length).toBe(0);
    const declared = [...(NphMultiCombobox as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['width', 'color', 'variant', 'filter', 'creatable', 'loading']) {
      expect(declared).not.toContain(name);
    }
    expect((NphMultiCombobox as unknown as { nphFieldRole?: unknown }).nphFieldRole).toBeUndefined();
  });

  it('the value and its default are lists: copies, strings only, each value once', async () => {
    const element = await mount();
    element.value = ['peru', 'chile', 'peru'];
    expect(element.value).toEqual(['peru', 'chile']);
    const copy = element.value;
    copy.push('brazil');
    expect(element.value).toEqual(['peru', 'chile']);
    element.value = 'peru' as unknown as string[];
    expect(element.value).toEqual([]);
    element.value = null as unknown as string[];
    expect(element.value).toEqual([]);
  });
});

describe('chips (the internal nph-multi-combobox / chip)', () => {
  it('one chip per chosen option, in the order of the value; the placeholder only with nothing chosen', async () => {
    const element = await mount(`${BASE} placeholder="Search countries"`);
    expect(chips(element)).toHaveLength(0);
    expect(field(element).placeholder).toBe('Search countries');
    element.value = ['peru', 'brazil'];
    await settle();
    expect(chipTexts(element)).toEqual(['Peru', 'Brazil']);
    expect(field(element).placeholder).toBe('');
  });

  it('a value with no option is kept, with no chip, until its option arrives', async () => {
    const element = await mount(BASE, countries(['Brazil']), ['peru', 'brazil']);
    expect(chipTexts(element)).toEqual(['Brazil']);
    expect(element.value).toEqual(['peru', 'brazil']);
    element.options = countries();
    await settle();
    expect(chipTexts(element)).toEqual(['Peru', 'Brazil']);
  });

  it('the chip: color/primary-surface, radius/full, text/label-sm in color/primary-on-surface, padding space/inline, gap space/inline-tight', async () => {
    for (const scheme of ['light', 'dark'] as const) {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount(BASE, countries(), ['peru']);
      const chip = chips(element)[0] as HTMLElement;
      const style = getComputedStyle(chip);
      expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
      expect(style.color).toBe(resolved('color', '--nph-color-primary-on-surface'));
      expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
      expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-inline'));
      expect(style.paddingRight).toBe(resolved('padding-right', '--nph-space-inline'));
      expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline-tight'));
      const label = getComputedStyle(chip.querySelector('.chip-label') as HTMLElement);
      expect(label.fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
      expect(label.fontWeight).toBe(resolved('font-weight', '--nph-text-label-sm-font-weight'));
      element.parentElement?.remove();
    }
  });

  it('the remove target is 24 x 24: the xmark of icon/size-sm with space/inline-tight around it, in the chip text color', async () => {
    const element = await mount(BASE, countries(), ['peru']);
    const button = removeButtons(element)[0] as HTMLButtonElement;
    const box = button.getBoundingClientRect();
    const target = px('--nph-icon-size-sm') + 2 * px('--nph-space-inline-tight');
    expect(target).toBe(24);
    expect(box.width).toBeCloseTo(target, 0);
    expect(box.height).toBeCloseTo(target, 0);
    const icon = button.querySelector('nph-icon') as HTMLElement & { name: string; size: string };
    expect(icon.name).toBe('xmark');
    expect(icon.size).toBe('sm');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(getComputedStyle(button).color).toBe(resolved('color', '--nph-color-primary-on-surface'));
  });

  it('the remove button is named by remove-label and the option it removes', async () => {
    const element = await mount(BASE, countries(), ['peru']);
    const node = await accessibleNodeOf(removeButtons(element)[0] as HTMLButtonElement);
    expect(node.role?.value).toBe('button');
    expect(node.name?.value).toBe('Remove Peru');
  });

  it('a long label stays on one line with an ellipsis, and the chip stops before the end of the field (D3)', async () => {
    const long = 'The United Kingdom of Great Britain and Northern Ireland and its overseas territories';
    const element = await mount(BASE, [{ value: 'uk', text: long }], ['uk']);
    const chip = chips(element)[0] as HTMLElement;
    const label = chip.querySelector('.chip-label') as HTMLElement;
    const style = getComputedStyle(label);
    expect(style.whiteSpace).toBe('nowrap');
    expect(style.textOverflow).toBe('ellipsis');
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    const content = (element.shadowRoot?.querySelector('.content') as HTMLElement).getBoundingClientRect();
    expect(chip.getBoundingClientRect().right).toBeLessThanOrEqual(content.right + 0.5);
    expect(chip.getBoundingClientRect().height).toBeCloseTo(24, 0);
  });

  it('chip-icon: the icon of an icon option, tag for an option with no icon (D-3), in the chip text color', async () => {
    const element = await mount(`${BASE} chip-icon`, [
      { value: 'team', text: 'Team', start: 'icon', icon: 'user' },
      { value: 'globe', text: 'World', start: 'icon' },
      { value: 'tag', text: 'Urgent' },
    ], ['team', 'globe', 'tag']);
    const icons = chips(element).map((chip) => chip.querySelector('.chip-icon') as HTMLElement & { name: string; size: string });
    expect(icons.map((icon) => icon.name)).toEqual(['user', 'globe', 'tag']);
    for (const icon of icons) {
      expect(icon.size).toBe('sm');
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(getComputedStyle(icon).color).toBe(resolved('color', '--nph-color-primary-on-surface'));
    }
  });

  it('without chip-icon, a chip has no icon', async () => {
    const element = await mount(BASE, [{ value: 'team', text: 'Team', start: 'icon', icon: 'user' }], ['team']);
    expect(chips(element)[0]?.querySelector('.chip-icon')).toBeNull();
  });

  it('the chips stay on one line while they fit, then go down and the field grows; between them space/inline-tight both ways', async () => {
    const element = await mount(BASE, countries(), ['peru', 'chile']);
    const one = control(element).getBoundingClientRect().height;
    expect(one).toBeCloseTo(px('--nph-control-height-default'), 0);
    const [first, second] = chips(element) as [HTMLElement, HTMLElement];
    expect(second.getBoundingClientRect().top).toBeCloseTo(first.getBoundingClientRect().top, 0);
    expect(second.getBoundingClientRect().left - first.getBoundingClientRect().right).toBeCloseTo(px('--nph-space-inline-tight'), 0);
    element.value = COUNTRIES.map((country) => country.toLowerCase());
    await settle();
    expect(control(element).getBoundingClientRect().height).toBeGreaterThan(one);
    const tops = [...new Set(chips(element).map((chip) => Math.round(chip.getBoundingClientRect().top)))];
    expect(tops.length).toBeGreaterThan(1);
    const lineGap = getComputedStyle(element.shadowRoot?.querySelector('.content') as HTMLElement).rowGap;
    expect(lineGap).toBe(resolved('row-gap', '--nph-space-inline-tight'));
    for (const chip of chips(element)) {
      expect(chip.getBoundingClientRect().height).toBeGreaterThan(0);
    }
  });

  it('remove-label missing draws no remove button and emits one error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount('label="Countries"', countries(), ['peru']);
    expect(chipTexts(element)).toEqual(['Peru']);
    expect(removeButtons(element)).toHaveLength(0);
    expect(error.mock.calls.filter((call) => String(call[0]).includes('remove-label'))).toHaveLength(1);
  });

  it('a disabled field: chips in color/muted with the label in color/muted-foreground, no remove button', async () => {
    const element = await mount(`${BASE} disabled chip-icon`, countries(), ['peru']);
    const chip = chips(element)[0] as HTMLElement;
    const style = getComputedStyle(chip);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
    expect(style.color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(style.paddingTop).toBe(resolved('padding-top', '--nph-space-inline-tight'));
    expect(removeButtons(element)).toHaveLength(0);
    expect(getComputedStyle(chip.querySelector('.chip-icon') as HTMLElement).color).toBe(resolved('color', '--nph-color-muted-foreground'));
  });
});

describe('counter', () => {
  it('the subject and an nph-badge primary solid with how many are chosen, instead of the chips (D1)', async () => {
    const element = await mount(`${BASE} counter subject="Countries"`, countries(), ['peru', 'chile', 'brazil']);
    expect(chips(element)).toHaveLength(0);
    const subject = element.shadowRoot?.querySelector('.subject') as HTMLElement;
    expect(subject.textContent?.trim()).toBe('Countries');
    expect(getComputedStyle(subject).color).toBe(resolved('color', '--nph-color-foreground'));
    expect(getComputedStyle(subject).fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
    const badge = element.shadowRoot?.querySelector('nph-badge') as NphBadge;
    expect(badge.severity).toBe('primary');
    expect(badge.emphasis).toBe('solid');
    expect(badge.text).toBe('3');
  });

  it('the subject does not change with each choice; the counter does', async () => {
    const element = await mount(`${BASE} counter subject="Countries"`, countries(), ['peru']);
    element.value = ['peru', 'chile'];
    await settle();
    expect(element.shadowRoot?.querySelector('.subject')?.textContent?.trim()).toBe('Countries');
    expect((element.shadowRoot?.querySelector('nph-badge') as NphBadge).text).toBe('2');
  });

  it('the field stays on one line with many choices', async () => {
    const element = await mount(`${BASE} counter subject="Countries"`, countries(), COUNTRIES.map((country) => country.toLowerCase()));
    expect(control(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 0);
  });

  it('with nothing chosen, the placeholder (D-2); the typed text sits after the counter (D-4)', async () => {
    const element = await mount(`${BASE} counter subject="Countries" placeholder="Search countries"`);
    expect(element.shadowRoot?.querySelector('.subject')).toBeNull();
    expect(element.shadowRoot?.querySelector('nph-badge')).toBeNull();
    expect(field(element).placeholder).toBe('Search countries');
    element.value = ['peru'];
    await settle();
    const badge = element.shadowRoot?.querySelector('nph-badge') as HTMLElement;
    expect(field(element).getBoundingClientRect().left).toBeGreaterThanOrEqual(badge.getBoundingClientRect().right);
  });

  it('counter without subject draws the counter alone and emits one error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount(`${BASE} counter`, countries(), ['peru']);
    expect(element.shadowRoot?.querySelector('.subject')).toBeNull();
    expect(element.shadowRoot?.querySelector('nph-badge')).not.toBeNull();
    expect(error.mock.calls.filter((call) => String(call[0]).includes('subject'))).toHaveLength(1);
  });
});

describe('the list: the nph-combobox list with the checkbox marker', () => {
  it('a chosen option is checked, without the selected background', async () => {
    const element = await mount(BASE, countries(), ['peru']);
    element.open = true;
    await settle();
    const option = row(element, 'Peru');
    expect(option.selected).toBe(true);
    const box = option.shadowRoot?.querySelector('nph-checkbox') as NphCheckbox;
    expect(box.checked).toBe(true);
    expect(getComputedStyle(option).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(option.shadowRoot?.querySelector('.check')).toBeNull();
    expect((row(element, 'Chile').shadowRoot?.querySelector('nph-checkbox') as NphCheckbox).checked).toBe(false);
  });

  it('the checkbox sits at the start of the option, before its own start (D-1)', async () => {
    const element = await mount(BASE, [{ value: 'team', text: 'Team', start: 'icon', icon: 'user' }]);
    element.open = true;
    await settle();
    const option = row(element, 'Team');
    const box = option.shadowRoot?.querySelector('nph-checkbox') as HTMLElement;
    const start = option.shadowRoot?.querySelector('.start') as HTMLElement;
    expect(box.getBoundingClientRect().right).toBeLessThanOrEqual(start.getBoundingClientRect().left);
  });

  it('typing filters with no difference of case or accent, and highlights the typed stretch', async () => {
    /* Built from a code point, so the accented name is data, not a literal of another language. */
    const accented = `Z${String.fromCharCode(0xfc)}rich`;
    const element = await mount(BASE, countries([accented, 'Zug', 'Basel']));
    await type(element, 'ZUR');
    expect(texts(element)).toEqual([accented]);
    expect(row(element, accented).querySelector('.match')?.textContent).toBe(accented.slice(0, 3));
  });

  it('groups: group labels and an nph-separator between groups', async () => {
    const element = await mount(BASE, [
      { type: 'label', text: 'South' },
      { value: 'br', text: 'Brazil' },
      { type: 'separator' },
      { type: 'label', text: 'North' },
      { value: 'ca', text: 'Canada' },
    ]);
    element.open = true;
    await settle();
    const labels = [...(element.shadowRoot?.querySelectorAll('.group-label') ?? [])].map((label) => label.textContent?.trim());
    expect(labels).toEqual(['South', 'North']);
    expect(element.shadowRoot?.querySelectorAll('nph-separator')).toHaveLength(1);
  });

  it('empty: the nph-empty when nothing matches', async () => {
    const element = await mount(`${BASE} empty-heading="No country" empty-description="Try another name"`);
    await type(element, 'zzz');
    expect(element.open).toBe(true);
    expect(rows(element)).toHaveLength(0);
    const empty = element.shadowRoot?.querySelector('nph-empty') as HTMLElement & { heading: string; description: string };
    expect(empty.heading).toBe('No country');
    expect(empty.description).toBe('Try another name');
  });

  it('with nothing to show and no empty-heading, the list closes', async () => {
    const element = await mount();
    await type(element, 'zzz');
    expect(element.open).toBe(false);
  });

  it('the rows are options of the listbox, with the selected state; the box, the glass and the arrow are hidden', async () => {
    const element = await mount(BASE, countries(), ['brazil']);
    element.open = true;
    await settle();
    const node = await accessibleNodeOf(row(element, 'Brazil'));
    expect(node.role?.value).toBe('option');
    expect(node.name?.value).toBe('Brazil');
    expect(node.properties?.find((property) => property.name === 'selected')?.value.value).toBe(true);
    const box = row(element, 'Brazil').shadowRoot?.querySelector('nph-checkbox') as HTMLElement;
    expect(box.hasAttribute('inert')).toBe(true);
    expect(box.getAttribute('aria-hidden')).toBe('true');
    expect(element.shadowRoot?.querySelector('.search')?.getAttribute('aria-hidden')).toBe('true');
    expect(element.shadowRoot?.querySelector('.arrow')?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('values and form association', () => {
  async function inForm(attributes: string, values: readonly string[] | null = null): Promise<{ form: HTMLFormElement; element: NphMultiCombobox }> {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount(attributes, countries(), values, form);
    return { form, element };
  }

  it('the host knows its form and the form data carries one name=value per chosen option, as select multiple', async () => {
    const { form, element } = await inForm(`${BASE} name="countries"`, ['peru', 'chile']);
    expect(element.form).toBe(form);
    expect(new FormData(form).getAll('countries')).toEqual(['peru', 'chile']);
  });

  it('the entries take the current name; with no name, nothing is submitted', async () => {
    const { form, element } = await inForm(BASE, ['peru']);
    expect([...new FormData(form).keys()]).toEqual([]);
    element.name = 'places';
    await settle();
    expect(new FormData(form).getAll('places')).toEqual(['peru']);
    element.name = 'countries';
    await settle();
    expect(new FormData(form).has('places')).toBe(false);
    expect(new FormData(form).getAll('countries')).toEqual(['peru']);
  });

  it('a value with no option stays out of the form data', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    await mount(`${BASE} name="countries"`, countries(['Peru']), ['peru', 'atlantis'], form);
    expect(new FormData(form).getAll('countries')).toEqual(['peru']);
  });

  it('typed text is not a value', async () => {
    const { form, element } = await inForm(`${BASE} name="countries"`);
    await type(element, 'Bra');
    expect(new FormData(form).has('countries')).toBe(false);
  });

  it('defaultValue moves the value while the choice is clean; after a change, only reset goes back to it', async () => {
    const { form, element } = await inForm(`${BASE} name="countries"`, ['peru']);
    element.defaultValue = ['chile'];
    expect(element.value).toEqual(['chile']);
    element.value = ['brazil'];
    element.defaultValue = ['canada'];
    expect(element.value).toEqual(['brazil']);
    const fired = vi.fn();
    element.addEventListener('input', fired);
    element.addEventListener('change', fired);
    form.reset();
    await settle();
    expect(element.value).toEqual(['canada']);
    expect(chipTexts(element)).toEqual(['Canada']);
    expect(fired).not.toHaveBeenCalled();
  });

  it('reset also clears the typed text', async () => {
    const { form, element } = await inForm(`${BASE} name="countries"`);
    await type(element, 'Bra');
    form.reset();
    await settle();
    expect(element.query).toBe('');
    expect(field(element).value).toBe('');
  });

  it('required with nothing chosen is valueMissing, with the browser message', async () => {
    const { element } = await inForm(`${BASE} name="countries" required`);
    expect(element.validity.valueMissing).toBe(true);
    expect(element.validationMessage).not.toBe('');
    expect(element.checkValidity()).toBe(false);
    element.value = ['peru'];
    await settle();
    expect(element.validity.valid).toBe(true);
  });

  it('a disabled fieldset disables the piece: out of the form data, no list, no remove button', async () => {
    const form = document.createElement('form');
    form.innerHTML = '<fieldset disabled></fieldset>';
    document.body.append(form);
    const element = await mount(`${BASE} name="countries"`, countries(), ['peru'], form.querySelector('fieldset') as HTMLElement);
    expect(new FormData(form).has('countries')).toBe(false);
    expect(element.matches(':disabled')).toBe(true);
    expect(field(element).disabled).toBe(true);
    expect(removeButtons(element)).toHaveLength(0);
  });

  it('Enter with the list closed submits the form; with the list open it checks and does not submit', async () => {
    const { form, element } = await inForm(`${BASE} name="countries"`);
    const submitted = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submitted);
    await type(element, 'Per');
    expect(element.open).toBe(true);
    await press(element, '{Enter}');
    await wait(10);
    expect(element.value).toEqual(['peru']);
    expect(submitted).not.toHaveBeenCalled();
    await press(element, '{Escape}');
    await press(element, '{Enter}');
    await wait(10);
    expect(submitted).toHaveBeenCalledTimes(1);
  });

  it('restores the values on history navigation (formStateRestoreCallback), and fires nothing', async () => {
    const element = await mount();
    const fired = vi.fn();
    element.addEventListener('change', fired);
    const state = new FormData();
    state.append('value', 'canada');
    state.append('value', 'peru');
    element.formStateRestoreCallback(state);
    await settle();
    expect(element.value).toEqual(['canada', 'peru']);
    expect(fired).not.toHaveBeenCalled();
  });
});

describe('accessible name, description and focus', () => {
  it('label names the combobox and the listbox', async () => {
    const element = await mount();
    const node = await accessibleNodeOf(field(element));
    expect(node.role?.value).toBe('combobox');
    expect(node.name?.value).toBe('Countries');
    expect(listbox(element).getAttribute('aria-label')).toBe('Countries');
  });

  it('an associated label names the combobox, and a click on it focuses the text field, not a remove button', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<label for="places">Places</label><nph-multi-combobox id="places" remove-label="Remove"></nph-multi-combobox>';
    const element = holder.querySelector('nph-multi-combobox') as NphMultiCombobox;
    element.options = countries();
    element.defaultValue = ['peru'];
    document.body.append(holder);
    await settle(holder);
    const node = await accessibleNodeOf(field(element));
    expect(node.name?.value).toBe('Places');
    await userEvent.click(holder.querySelector('label') as HTMLElement);
    await settle(holder);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    await nextFrame();
    expect(document.activeElement).toBe(element);
  });

  it('a link inside the associated label keeps its own action and takes no focus to the field (Copilot, round 1)', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<label for="places">Places <a href="#help">Help</a></label><nph-multi-combobox id="places" remove-label="Remove"></nph-multi-combobox>';
    const element = holder.querySelector('nph-multi-combobox') as NphMultiCombobox;
    element.options = countries();
    document.body.append(holder);
    await settle(holder);
    let prevented: boolean | null = null;
    const record = (event: Event): void => {
      prevented = event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener('click', record);
    (holder.querySelector('a') as HTMLAnchorElement).click();
    document.removeEventListener('click', record);
    expect(prevented).toBe(false);
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
  });

  it('the label listener is released when the field leaves the page and heard again when it comes back (Copilot, round 1)', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<label for="places">Places</label><nph-multi-combobox id="places" remove-label="Remove"></nph-multi-combobox>';
    const element = holder.querySelector('nph-multi-combobox') as NphMultiCombobox;
    element.options = countries();
    element.defaultValue = ['peru'];
    document.body.append(holder);
    await settle(holder);
    const label = holder.querySelector('label') as HTMLLabelElement;
    const released = vi.spyOn(label, 'removeEventListener');
    element.remove();
    expect(released).toHaveBeenCalledWith('click', expect.any(Function));
    holder.append(element);
    await settle(holder);
    await userEvent.click(label);
    await settle(holder);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
  });

  it('a label that wraps the field keeps the click on a remove button', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<label>Places <nph-multi-combobox remove-label="Remove"></nph-multi-combobox></label>';
    const element = holder.querySelector('nph-multi-combobox') as NphMultiCombobox;
    element.options = countries();
    element.defaultValue = ['peru', 'chile'];
    document.body.append(holder);
    await settle(holder);
    await userEvent.click(removeButtons(element)[0] as HTMLButtonElement);
    await settle(holder);
    expect(element.value).toEqual(['chile']);
  });

  it('mounting takes no focus', async () => {
    await mount(BASE, countries(), ['peru']);
    await nextFrame();
    expect(document.activeElement).toBe(document.body);
  });

  it('focus() on the host goes to the text field', async () => {
    const element = await mount(BASE, countries(), ['peru']);
    element.focus();
    expect(element.shadowRoot?.activeElement).toBe(field(element));
  });

  it('description is the accessible description, never visible', async () => {
    const element = await mount(`${BASE} description="Where you have lived"`);
    const node = await accessibleNodeOf(field(element));
    expect(node.description?.value).toBe('Where you have lived');
    const box = element.shadowRoot?.querySelector('.description') as HTMLElement;
    expect(getComputedStyle(box).clipPath).toBe('inset(50%)');
  });

  it('open, the combobox is expanded and points to the active option', async () => {
    const element = await mount();
    await focus(element);
    await press(element, '{ArrowDown}');
    expect(field(element).getAttribute('aria-expanded')).toBe('true');
    expect(activeOf(element)).toBe(row(element, 'Argentina'));
  });

  it('a field with no name warns once in development, after the first frame', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await mount('remove-label="Remove"');
    await nextFrame();
    await nextFrame();
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('[nph-multi-combobox]') && String(call[0]).includes('accessible name'))).toHaveLength(1);
  });

  it('invalid writes aria-invalid; required writes aria-required', async () => {
    const element = await mount(`${BASE} invalid required`);
    expect(field(element).getAttribute('aria-invalid')).toBe('true');
    expect(field(element).getAttribute('aria-required')).toBe('true');
  });
});

describe('pointer', () => {
  it('a click on the field opens; a click on an option checks it and keeps the list open', async () => {
    const element = await mount();
    await userEvent.click(field(element));
    await settle();
    expect(element.open).toBe(true);
    await userEvent.click(row(element, 'Chile'));
    await settle();
    expect(element.value).toEqual(['chile']);
    expect(element.open).toBe(true);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    await userEvent.click(row(element, 'Chile'));
    await settle();
    expect(element.value).toEqual([]);
  });

  it('a click on the arrow opens and closes the list, keeping the focus on the field', async () => {
    const element = await mount();
    const arrow = element.shadowRoot?.querySelector('.arrow') as HTMLElement;
    await userEvent.click(arrow);
    await settle();
    expect(element.open).toBe(true);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    await userEvent.click(arrow);
    await settle();
    expect(element.open).toBe(false);
  });

  it('a click on a remove button removes that option only, keeps the focus on the field and opens nothing', async () => {
    const element = await mount(BASE, countries(), ['peru', 'chile']);
    await userEvent.click(removeButtons(element)[0] as HTMLButtonElement);
    await settle();
    expect(element.value).toEqual(['chile']);
    expect(element.open).toBe(false);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
  });

  it('a press outside closes without choosing', async () => {
    const element = await mount();
    await userEvent.click(field(element));
    await settle();
    await userEvent.click(document.body, { position: { x: 1, y: window.innerHeight - 2 } });
    await settle();
    expect(element.open).toBe(false);
    expect(element.value).toEqual([]);
  });

  it('a disabled option is not checked', async () => {
    const element = await mount(BASE, [
      { value: 'a', text: 'Argentina' },
      { value: 'b', text: 'Brazil', disabled: true },
    ]);
    element.open = true;
    await settle();
    await userEvent.click(row(element, 'Brazil'), { force: true });
    await settle();
    expect(element.value).toEqual([]);
  });
});

describe('keyboard (APG editable combobox, several choices)', () => {
  it('typing opens the list and makes the first match active', async () => {
    const element = await mount();
    await type(element, 'c');
    expect(element.open).toBe(true);
    expect(texts(element)).toEqual(['Canada', 'Chile', 'Colombia', 'Mexico']);
    expect(activeOf(element)).toBe(row(element, 'Canada'));
  });

  it('closed: ArrowDown opens on the first option, ArrowUp on the last; Alt+ArrowDown opens without moving', async () => {
    const element = await mount();
    await focus(element);
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(row(element, 'Argentina'));
    await press(element, '{Escape}');
    await press(element, '{ArrowUp}');
    expect(activeOf(element)).toBe(row(element, 'Venezuela'));
    await press(element, '{Escape}');
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    expect(element.open).toBe(true);
    expect(activeOf(element)).toBeNull();
  });

  it('arrows move without wrapping; Page Up and Page Down jump; disabled options are skipped', async () => {
    const entries = countries();
    (entries[1] as { disabled?: boolean }).disabled = true;
    const element = await mount(BASE, entries);
    await focus(element);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(row(element, 'Canada'));
    await press(element, '{ArrowUp}');
    await press(element, '{ArrowUp}');
    expect(activeOf(element)).toBe(row(element, 'Argentina'));
    await press(element, '{PageDown}');
    expect(activeOf(element)).toBe(row(element, 'Venezuela'));
    await press(element, '{PageUp}');
    expect(activeOf(element)).toBe(row(element, 'Argentina'));
  });

  it('Enter checks or unchecks the active option, keeps the list open, clears the typed text and keeps the option active', async () => {
    const element = await mount();
    await type(element, 'per');
    await press(element, '{Enter}');
    expect(element.value).toEqual(['peru']);
    expect(element.open).toBe(true);
    expect(element.query).toBe('');
    expect(field(element).value).toBe('');
    expect(texts(element)).toHaveLength(COUNTRIES.length);
    expect(activeOf(element)).toBe(row(element, 'Peru'));
    await press(element, '{Enter}');
    expect(element.value).toEqual([]);
  });

  it('Alt+ArrowUp closes without choosing; Enter with no active option closes', async () => {
    const element = await mount();
    await focus(element);
    await press(element, '{ArrowDown}');
    await press(element, '{Alt>}{ArrowUp}{/Alt}');
    expect(element.open).toBe(false);
    expect(element.value).toEqual([]);
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    await press(element, '{Enter}');
    expect(element.open).toBe(false);
  });

  it('Escape closes without choosing and does not reach a dialog around it', async () => {
    const element = await mount();
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    await focus(element);
    await press(element, '{ArrowDown}');
    await press(element, '{Escape}');
    expect(element.open).toBe(false);
    expect(outer).not.toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }));
    document.body.removeEventListener('keydown', outer);
  });

  it('Escape with the list closed clears the typed text; with none, it passes on', async () => {
    const element = await mount();
    await type(element, 'zzz');
    expect(element.open).toBe(false);
    await press(element, '{Escape}');
    expect(field(element).value).toBe('');
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    await press(element, '{Escape}');
    expect(outer).toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }));
    document.body.removeEventListener('keydown', outer);
  });

  it('Tab closes without choosing and the focus moves on', async () => {
    const holder = document.createElement('div');
    document.body.append(holder);
    const element = await mount(BASE, countries(), null, holder);
    const after = document.createElement('button');
    after.textContent = 'After';
    holder.append(after);
    await focus(element);
    await press(element, '{ArrowDown}');
    await press(element, '{Tab}');
    expect(element.open).toBe(false);
    expect(element.value).toEqual([]);
    expect(document.activeElement).toBe(after);
  });

  it('the remove buttons are in the Tab order before the text field; Enter on one removes it and the focus goes to the next one, then to the field', async () => {
    const element = await mount(BASE, countries(), ['peru', 'chile']);
    const before = document.createElement('button');
    before.textContent = 'Before';
    element.parentElement?.prepend(before);
    before.focus();
    await press(element, '{Tab}');
    expect(element.shadowRoot?.activeElement).toBe(removeButtons(element)[0]);
    await press(element, '{Tab}');
    expect(element.shadowRoot?.activeElement).toBe(removeButtons(element)[1]);
    await press(element, '{Tab}');
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    await press(element, '{Shift>}{Tab}{/Shift}');
    await press(element, '{Shift>}{Tab}{/Shift}');
    expect(element.shadowRoot?.activeElement).toBe(removeButtons(element)[0]);
    await press(element, '{Enter}');
    expect(element.value).toEqual(['chile']);
    expect(element.shadowRoot?.activeElement).toBe(removeButtons(element)[0]);
    await press(element, ' ');
    expect(element.value).toEqual([]);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
  });

  it('a pointer click on a remove button that has the keyboard focus sends the focus to the text (Copilot, round 2)', async () => {
    const element = await mount(BASE, countries(), ['peru', 'chile']);
    const before = document.createElement('button');
    element.parentElement?.prepend(before);
    before.focus();
    await press(element, '{Tab}');
    expect(element.shadowRoot?.activeElement).toBe(removeButtons(element)[0]);
    await userEvent.click(removeButtons(element)[0] as HTMLButtonElement);
    await settle();
    expect(element.value).toEqual(['chile']);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    await userEvent.keyboard('ar');
    await settle();
    expect(element.query).toBe('ar');
  });

  it('after a choice clears a filter, the active option is in the view of the list (Copilot, round 2)', async () => {
    const labels = Array.from({ length: 30 }, (_, index) => `Country ${String(index + 1).padStart(2, '0')}`);
    const element = await mount(BASE, countries(labels));
    await type(element, 'Country 30');
    await press(element, '{Enter}');
    expect(element.value).toEqual(['country 30']);
    expect(element.query).toBe('');
    await nextFrame();
    await nextFrame();
    const scroller = (element.shadowRoot?.querySelector('.scroller') as HTMLElement).getBoundingClientRect();
    const active = (activeOf(element) as HTMLElement).getBoundingClientRect();
    expect(activeOf(element)).toBe(row(element, 'Country 30'));
    expect(active.top).toBeGreaterThanOrEqual(scroller.top - 0.5);
    expect(active.bottom).toBeLessThanOrEqual(scroller.bottom + 0.5);
  });

  it('Home and End stay in the text', async () => {
    const element = await mount();
    await type(element, 'ar');
    await press(element, '{Home}');
    expect(field(element).selectionStart).toBe(0);
    expect(element.open).toBe(true);
  });

  it('a disabled field does not open and is not in the tab order', async () => {
    const element = await mount(`${BASE} disabled`);
    field(element).focus();
    expect(element.shadowRoot?.activeElement).not.toBe(field(element));
    element.open = true;
    await settle();
    expect(element.open).toBe(false);
  });
});

describe('events', () => {
  it('checking an option fires input and then change; input crosses shadow roots', async () => {
    const element = await mount();
    const order: string[] = [];
    element.addEventListener('input', (event) => order.push(`input:${event.composed}`));
    element.addEventListener('change', (event) => order.push(`change:${event.composed}`));
    await type(element, 'per');
    await press(element, '{Enter}');
    expect(order).toEqual(['input:true', 'change:false']);
  });

  it('removing a chip fires input and change', async () => {
    const element = await mount(BASE, countries(), ['peru']);
    const fired = vi.fn();
    element.addEventListener('change', fired);
    await userEvent.click(removeButtons(element)[0] as HTMLButtonElement);
    expect(fired).toHaveBeenCalledTimes(1);
  });

  it('typing fires no input or change on the host', async () => {
    const element = await mount();
    const fired = vi.fn();
    element.addEventListener('input', fired);
    element.addEventListener('change', fired);
    await type(element, 'per');
    field(element).dispatchEvent(new Event('change', { bubbles: true }));
    expect(fired).not.toHaveBeenCalled();
  });

  it('query set before the element is upgraded is kept and filters the list (Copilot, round 1)', async () => {
    const tag = 'nph-multi-combobox-late-query';
    const element = document.createElement(tag) as NphMultiCombobox;
    element.setAttribute('label', 'Countries');
    (element as unknown as { query: string }).query = 'br';
    (element as unknown as { options: NphComboboxEntry[] }).options = countries();
    document.body.append(element);
    customElements.define(tag, class extends NphMultiCombobox {});
    await settle();
    await (element as NphMultiCombobox).updateComplete;
    expect(element.query).toBe('br');
    expect(field(element).value).toBe('br');
    element.open = true;
    await element.updateComplete;
    expect(texts(element)).toEqual(['Brazil']);
    element.query = 'chi';
    await element.updateComplete;
    expect(field(element).value).toBe('chi');
    expect(texts(element)).toEqual(['Chile']);
  });

  it('setting value, defaultValue, query or open from code fires nothing', async () => {
    const element = await mount();
    const fired = vi.fn();
    element.addEventListener('input', fired);
    element.addEventListener('change', fired);
    element.value = ['peru'];
    element.defaultValue = ['chile'];
    element.query = 'br';
    element.open = true;
    await settle();
    expect(fired).not.toHaveBeenCalled();
    expect(field(element).value).toBe('br');
    expect(texts(element)).toEqual(['Brazil']);
  });

  it('the form data is up to date when change runs', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount(`${BASE} name="countries"`, countries(), null, form);
    let seen: string[] = [];
    element.addEventListener('change', () => {
      seen = new FormData(form).getAll('countries').map(String);
    });
    await type(element, 'per');
    await press(element, '{Enter}');
    expect(seen).toEqual(['peru']);
  });
});

describe('the list in the top layer', () => {
  it('opens space/inline-tight below the field, with its width', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    await nextFrame();
    const anchor = control(element).getBoundingClientRect();
    expect(list(element).matches(':popover-open')).toBe(true);
    expect(list(element).getAttribute('data-side')).toBe('bottom');
    await wait(400);
    const box = list(element).getBoundingClientRect();
    expect(box.top - anchor.bottom).toBeCloseTo(px('--nph-space-inline-tight'), 0);
    expect(box.width).toBeCloseTo(anchor.width, 0);
    expect(box.left).toBeCloseTo(anchor.left, 0);
  });

  it('follows the field when the chips make it grow', async () => {
    const element = await mount();
    await focus(element);
    await press(element, '{ArrowDown}');
    await wait(400);
    element.value = COUNTRIES.map((country) => country.toLowerCase());
    await settle();
    await wait(100);
    const anchor = control(element).getBoundingClientRect();
    const box = list(element).getBoundingClientRect();
    expect(box.top - anchor.bottom).toBeCloseTo(px('--nph-space-inline-tight'), 0);
  });

  it('the inside scrolls within layout/max-list-height', async () => {
    const element = await mount(BASE, countries([...COUNTRIES, 'Aruba', 'Belize', 'Cuba', 'Haiti', 'Jamaica']));
    element.open = true;
    await settle();
    const scroller = element.shadowRoot?.querySelector('.scroller') as HTMLElement;
    expect(scroller.getBoundingClientRect().height).toBeCloseTo(px('--nph-layout-max-list-height'), 0);
  });

  it('closing leaves the top layer after the exit transition; removing the field closes it', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    element.open = false;
    await settle();
    const duration = parseFloat(getComputedStyle(list(element)).transitionDuration) * 1000;
    await wait(duration + 50);
    expect(list(element).matches(':popover-open')).toBe(false);
    element.open = true;
    await settle();
    element.remove();
    expect(element.open).toBe(false);
  });
});

describe('measures and anatomy', () => {
  it('width layout/multi-combobox-width; minimum height control/height-default and large', async () => {
    const element = await mount();
    expect(element.getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-multi-combobox-width'), 0);
    expect(control(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 0);
    element.size = 'large';
    await settle();
    expect(control(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-large'), 0);
  });

  it('the consumer stretches it to the width of the form', async () => {
    const holder = document.createElement('div');
    holder.style.inlineSize = '600px';
    document.body.append(holder);
    const element = await mount(BASE, countries(), null, holder);
    element.style.inlineSize = '100%';
    expect(element.getBoundingClientRect().width).toBeCloseTo(600, 0);
  });

  it('the field: color/background, border color/input, radius/control, padding space/control-padding and space/inline-tight, gap space/inline', async () => {
    const element = await mount();
    const style = getComputedStyle(control(element));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-color-input'));
    expect(Number.parseFloat(style.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-control'));
    expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(style.paddingRight).toBe(resolved('padding-right', '--nph-space-control-padding'));
    expect(style.paddingTop).toBe(resolved('padding-top', '--nph-space-inline-tight'));
    expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline'));
  });

  it('the magnifying glass at the start and the chevron-down at the end, icon/size-sm in color/muted-foreground', async () => {
    const element = await mount();
    const search = element.shadowRoot?.querySelector('.search') as HTMLElement & { name: string; size: string };
    const arrow = element.shadowRoot?.querySelector('.arrow') as HTMLElement & { name: string; size: string };
    expect(search.name).toBe('magnifying-glass');
    expect(arrow.name).toBe('chevron-down');
    for (const icon of [search, arrow]) {
      expect(icon.size).toBe('sm');
      expect(getComputedStyle(icon).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    }
    const box = control(element).getBoundingClientRect();
    expect(search.getBoundingClientRect().left).toBeCloseTo(box.left + px('--nph-border-width') + px('--nph-space-control-padding'), 0);
    expect(arrow.getBoundingClientRect().right).toBeCloseTo(box.right - px('--nph-border-width') - px('--nph-space-control-padding'), 0);
  });

  it('the typed text: text/body-md in color/foreground, with the caret in color/foreground; the placeholder in color/muted-foreground', async () => {
    const element = await mount(`${BASE} placeholder="Search"`);
    const style = getComputedStyle(field(element));
    expect(style.color).toBe(resolved('color', '--nph-color-foreground'));
    expect(style.caretColor).toBe(resolved('color', '--nph-color-foreground'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
    expect(getComputedStyle(field(element), '::placeholder').color).toBe(resolved('color', '--nph-color-muted-foreground'));
  });

  it('the typed text comes after the chips, on their line while it fits', async () => {
    const element = await mount(BASE, countries(), ['peru']);
    await type(element, 'ch');
    const chip = chips(element)[0] as HTMLElement;
    expect(field(element).getBoundingClientRect().left).toBeGreaterThanOrEqual(chip.getBoundingClientRect().right);
    expect(control(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 0);
  });
});

describe('states and precedence', () => {
  it('hover: color/input-hover', async () => {
    const element = await mount();
    await userEvent.hover(control(element));
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-color-input-hover'));
  });

  it('focus: focus/border and the focus/halo outside, radius focus/radius-control; open keeps it', async () => {
    const element = await mount();
    await focus(element);
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    const halo = getComputedStyle(control(element), '::after');
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(Number.parseFloat(halo.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control'));
    await press(element, '{ArrowDown}');
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border'));
  });

  it('keyboard focus on a remove button: the field keeps its resting border; the focus border and halo sit around the 24 x 24 target only', async () => {
    const element = await mount(BASE, countries(), ['peru']);
    const before = document.createElement('button');
    element.parentElement?.prepend(before);
    before.focus();
    await press(element, '{Tab}');
    const button = removeButtons(element)[0] as HTMLButtonElement;
    expect(button.matches(':focus-visible')).toBe(true);
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-color-input'));
    expect(getComputedStyle(control(element), '::after').content).toBe('none');
    const border = getComputedStyle(button, '::before');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
    const halo = getComputedStyle(button, '::after');
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
  });

  it('error: status/error at rest and on focus; focus/halo-error on focus', async () => {
    const element = await mount(`${BASE} invalid`);
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-status-error'));
    await focus(element);
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-status-error'));
    expect(getComputedStyle(control(element), '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
  });

  it('disabled wins: color/muted, color/input, state/disabled-opacity on the whole piece', async () => {
    const element = await mount(`${BASE} invalid disabled`);
    expect(getComputedStyle(control(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-color-input'));
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(field(element).hasAttribute('aria-invalid')).toBe(false);
  });

  it('disabling an open field closes it', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    element.disabled = true;
    await settle();
    expect(element.open).toBe(false);
  });
});

describe('inside nph-field (P83)', () => {
  it('the field names the combobox, describes it and passes required, invalid and disabled', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<nph-field label="Countries" help="Where you have lived" required><nph-multi-combobox remove-label="Remove"></nph-multi-combobox></nph-field>';
    const element = holder.querySelector('nph-multi-combobox') as NphMultiCombobox;
    element.options = countries();
    document.body.append(holder);
    await settle(holder);
    await settle(holder);
    expect(element.label).toBe('Countries');
    expect(element.required).toBe(true);
    expect(element.description).toBe('Where you have lived');
    const node = await accessibleNodeOf(field(element));
    expect(node.name?.value).toBe('Countries');
    expect(node.description?.value).toBe('Where you have lived');
    const outer = holder.querySelector('nph-field') as HTMLElement & { error: string; disabled: boolean };
    outer.error = 'Choose a country';
    await settle(holder);
    expect(element.invalid).toBe(true);
    expect(element.description).toBe('Choose a country');
    outer.disabled = true;
    await settle(holder);
    expect(element.disabled).toBe(true);
  });

  it('a click on the label of the field focuses the text field, not a remove button', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<nph-field label="Countries"><nph-multi-combobox remove-label="Remove"></nph-multi-combobox></nph-field>';
    const element = holder.querySelector('nph-multi-combobox') as NphMultiCombobox;
    element.options = countries();
    element.defaultValue = ['peru'];
    document.body.append(holder);
    await settle(holder);
    await settle(holder);
    const outer = holder.querySelector('nph-field') as HTMLElement;
    const label = outer.shadowRoot?.querySelector('nph-label') as HTMLElement;
    await userEvent.click(label, { position: { x: 4, y: 4 } });
    await settle(holder);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
  });
});

describe('invalid input', () => {
  it('a size that does not exist: nothing and one error in development', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount(`${BASE} size="small"`);
    expect(error.mock.calls.filter((call) => String(call[0]).includes('[nph-multi-combobox]'))).toHaveLength(1);
    expect(element.shadowRoot?.querySelector('.control')).toBeNull();
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(element.getBoundingClientRect().width).toBe(0);
  });

  it('an invalid piece adds nothing to the form data', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const form = document.createElement('form');
    document.body.append(form);
    await mount(`${BASE} name="countries" size="small"`, countries(), ['peru'], form);
    expect(new FormData(form).has('countries')).toBe(false);
  });

  it('an invalid entry is left out, with one error per cause', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount(BASE, [
      { value: 'a', text: 'Argentina' },
      { value: 'b', text: '' },
      { value: 'c', text: 'Chile', start: 'nope' as 'none', status: 'bad' as 'info' },
      { type: 'label', text: '' },
    ]);
    element.open = true;
    await settle();
    expect(texts(element)).toEqual(['Argentina']);
    expect(error.mock.calls.filter((call) => String(call[0]).includes('[nph-multi-combobox]'))).toHaveLength(4);
  });

  it('a valid input set later draws the piece', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount(`${BASE} size="small"`);
    element.size = 'default';
    await settle();
    expect(element.shadowRoot?.querySelector('.control')).not.toBeNull();
  });
});

describe('token contract', () => {
  const strip = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = (css: string): Set<string> => new Set([...strip(css).matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used(componentCss)) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('the field and the chip consume the tokens the evidence names', () => {
    const all = used(componentCss);
    for (const name of [
      '--nph-layout-multi-combobox-width',
      '--nph-color-background',
      '--nph-color-input',
      '--nph-border-width',
      '--nph-radius-control',
      '--nph-control-height-default',
      '--nph-control-height-large',
      '--nph-space-control-padding',
      '--nph-space-inline-tight',
      '--nph-space-inline',
      '--nph-color-muted-foreground',
      '--nph-color-foreground',
      '--nph-text-body-md-font-size',
      '--nph-color-primary-surface',
      '--nph-color-primary-on-surface',
      '--nph-radius-full',
      '--nph-text-label-sm-font-size',
      '--nph-color-input-hover',
      '--nph-focus-border',
      '--nph-focus-halo',
      '--nph-focus-ring-width',
      '--nph-focus-radius-control',
      '--nph-focus-border-radius-control',
      '--nph-focus-radius-control-with-border',
      '--nph-status-error',
      '--nph-focus-halo-error',
      '--nph-color-muted',
      '--nph-state-disabled-opacity',
    ]) {
      expect(all, name).toContain(name);
    }
  });

  it('never consumes a core or theme token: components use the semantic layer only', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, measure or duration', () => {
    expect(strip(componentCss)).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(strip(componentCss)).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(strip(componentCss)).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });

  it('the list takes the style of the nph-combobox list, with no copy of its own', () => {
    expect(strip(componentCss)).not.toMatch(/\.list\b|\.scroller\b|\.group-label\b/);
    expect(listCss).toContain('.list');
  });
});
