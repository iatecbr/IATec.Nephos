/**
 * Tests of `nph-combobox` (P95), in a real browser (P21, item 5): the top layer, the
 * keyboard, the form and the accessibility tree only exist where there is layout.
 *
 * They prove the contract accepted in Figma (board `1359:142`, set `1359:115`, list
 * `1359:141`, option `1357:136`) and the pending decisions D-1 to D-5 in their default: the
 * API, the list as data with `nph-option` rows (P91), the search and its highlight, the
 * groups, the states of the list (results, search, status, groups, loading, create, empty,
 * shortcuts), the value and the form association (P80), the field contract (P83), the
 * accessible name, the pointer and the keyboard of the editable combobox, the events, the
 * start of the field, the list in the top layer, the states and their precedence, the
 * invalid input and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-combobox.css?raw';
import listCss from './nph-combobox.list.css?raw';
import '../nph-field/nph-field';
import '../nph-kbd/nph-kbd';
import { NphOption } from '../nph-option/nph-option';
import { NPH_COMBOBOX_FILTERS, NPH_COMBOBOX_SIZES, NPH_COMBOBOX_STARTS, NphCombobox } from './nph-combobox';
import type { NphComboboxEntry } from './nph-combobox';
import { filterGroups, groupsOf, matchRange } from './nph-combobox.list';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
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

async function settle(root: ParentNode = document.body): Promise<void> {
  const elements = [...root.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-combobox, nph-field, nph-label')];
  await Promise.all(elements.map((element) => element.updateComplete));
  await Promise.all(elements.map((element) => element.updateComplete));
  const inner = elements.flatMap((element) => [...(element.shadowRoot?.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-option, nph-empty, nph-spinner') ?? [])]);
  await Promise.all(inner.map((element) => element.updateComplete));
}

/** Mounts from markup, then sets the options as a property, as a framework would. */
async function mount(attributes = 'label="Country"', entries: readonly NphComboboxEntry[] = countries(), parent: HTMLElement = document.body): Promise<NphCombobox> {
  const holder = document.createElement('div');
  holder.innerHTML = `<nph-combobox ${attributes}></nph-combobox>`;
  const element = holder.querySelector('nph-combobox') as NphCombobox;
  element.options = entries;
  parent.append(holder);
  await settle(holder);
  return element;
}

function control(element: NphCombobox): HTMLElement {
  const box = element.shadowRoot?.querySelector<HTMLElement>('.control');
  if (!box) throw new Error('no control');
  return box;
}

function field(element: NphCombobox): HTMLInputElement {
  const input = element.shadowRoot?.querySelector<HTMLInputElement>('.field');
  if (!input) throw new Error('no field');
  return input;
}

function list(element: NphCombobox): HTMLElement {
  const box = element.shadowRoot?.querySelector<HTMLElement>('.list');
  if (!box) throw new Error('no list');
  return box;
}

function listbox(element: NphCombobox): HTMLElement {
  return element.shadowRoot?.querySelector<HTMLElement>('.listbox') as HTMLElement;
}

function rows(element: NphCombobox): NphOption[] {
  return [...(element.shadowRoot?.querySelectorAll<NphOption>('nph-option') ?? [])];
}

function texts(element: NphCombobox): string[] {
  return rows(element).map((row) => row.textContent?.replace(/\s+/g, ' ').trim() ?? '');
}

function row(element: NphCombobox, text: string): NphOption {
  const found = rows(element).find((item) => item.textContent?.trim() === text);
  if (!found) throw new Error(`no row ${text}`);
  return found;
}

function activeOf(element: NphCombobox): Element | null {
  const id = field(element).getAttribute('aria-activedescendant');
  return id === null ? null : (element.shadowRoot?.getElementById(id) ?? null);
}

function clearButton(element: NphCombobox): HTMLButtonElement | null {
  return element.shadowRoot?.querySelector<HTMLButtonElement>('.clear') ?? null;
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function press(element: NphCombobox, key: string): Promise<void> {
  await userEvent.keyboard(key);
  await settle(element.parentElement ?? document.body);
}

async function focus(element: NphCombobox): Promise<void> {
  field(element).focus();
  await settle(element.parentElement ?? document.body);
}

async function type(element: NphCombobox, text: string): Promise<void> {
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

describe('the list module (shared with nph-multi-combobox)', () => {
  it('matches with no difference of case or accent, in the original text', () => {
    expect(matchRange('São Paulo', 'sao')).toEqual([0, 3]);
    expect(matchRange('Brazil', 'zil')).toEqual([3, 6]);
    expect(matchRange('Brazil', 'xyz')).toBeNull();
    expect(matchRange('Brazil', '  ')).toBeNull();
    /* An emoji or a flag before the name takes two UTF-16 units: the highlight still lands on the match. */
    expect(matchRange('\u{1F600} Brazil', 'Bra')).toEqual([3, 6]);
    expect(matchRange('\u{1F1E7}\u{1F1F7} Brasil', 'bra')).toEqual([5, 8]);
  });

  it('a label opens a group and a separator closes one, as in nph-dropdown-menu', () => {
    const groups = groupsOf([
      { value: 'a', text: 'A' },
      { type: 'separator' },
      { type: 'label', text: 'South' },
      { value: 'b', text: 'B' },
      { type: 'label', text: 'North' },
      { value: 'c', text: 'C' },
      { type: 'label', text: 'Empty' },
    ]);
    expect(groups.map((group) => [group.label, group.separated, group.options.length])).toEqual([
      ['', false, 1],
      ['South', true, 1],
      ['North', false, 1],
    ]);
  });

  it('filtering drops an empty group and carries its line to the next one', () => {
    const groups = groupsOf([{ type: 'label', text: 'A' }, { value: 'x', text: 'Xa' }, { type: 'separator' }, { type: 'label', text: 'B' }, { value: 'y', text: 'Yb' }, { type: 'separator' }, { type: 'label', text: 'C' }, { value: 'z', text: 'Zb' }]);
    expect(filterGroups(groups, 'b').map((group) => [group.label, group.separated])).toEqual([
      ['B', false],
      ['C', true],
    ]);
  });
});

describe('registration and API', () => {
  it('defines nph-combobox and draws its options as nph-option (P91)', async () => {
    expect(customElements.get('nph-combobox')).toBe(NphCombobox);
    const element = await mount();
    element.open = true;
    await settle();
    expect(rows(element).every((item) => item instanceof NphOption)).toBe(true);
    expect(rows(element)).toHaveLength(COUNTRIES.length);
  });

  it('defaults: size default, start search, icon globe, filter contains, closed, no value', async () => {
    const element = await mount();
    expect(element.size).toBe('default');
    expect(element.start).toBe('search');
    expect(element.icon).toBe('globe');
    expect(element.filter).toBe('contains');
    expect(element.open).toBe(false);
    expect(element.clearable).toBe(false);
    expect(element.loading).toBe(false);
    expect(element.creatable).toBe(false);
    expect(element.required).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.invalid).toBe(false);
    expect(element.value).toBe('');
    expect(element.query).toBe('');
    expect(NPH_COMBOBOX_SIZES).toEqual(['default', 'large']);
    expect(NPH_COMBOBOX_STARTS).toEqual(['search', 'icon', 'avatar']);
    expect(NPH_COMBOBOX_FILTERS).toEqual(['contains', 'none']);
  });

  it('reflects size, open, name, required, disabled and invalid', async () => {
    const element = await mount();
    Object.assign(element, { size: 'large', name: 'country', required: true, disabled: true, invalid: true });
    await element.updateComplete;
    for (const name of ['size', 'name', 'required', 'disabled', 'invalid']) {
      expect(element.hasAttribute(name), name).toBe(true);
    }
    element.disabled = false;
    element.open = true;
    await element.updateComplete;
    expect(element.hasAttribute('open')).toBe(true);
  });

  it('the inner field is an editable combobox with list autocomplete that controls a listbox in the same root', async () => {
    const element = await mount();
    const input = field(element);
    expect(input.localName).toBe('input');
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-controls')).toBe(listbox(element).id);
    expect(listbox(element).getAttribute('role')).toBe('listbox');
    expect(list(element).getAttribute('popover')).toBe('manual');
  });

  it('has no part, and its only slot is the shortcuts footer', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelectorAll('[part]').length).toBe(0);
    const slots = [...(element.shadowRoot?.querySelectorAll('slot') ?? [])];
    expect(slots.map((slot) => slot.name)).toEqual(['shortcuts']);
  });

  it('has no width, color or multiple property, and no nphFieldRole (single control, P83)', () => {
    const declared = [...(NphCombobox as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['width', 'color', 'variant', 'multiple', 'error', 'help']) {
      expect(declared).not.toContain(name);
    }
    expect((NphCombobox as unknown as { nphFieldRole?: unknown }).nphFieldRole).toBeUndefined();
  });
});

describe('value: the attribute is the default, the property is the current value', () => {
  it('the value attribute chooses the option of that value, and the field shows its text', async () => {
    const element = await mount('label="Country" value="chile"');
    expect(element.value).toBe('chile');
    expect(field(element).value).toBe('Chile');
  });

  it('without a choice, the field shows the placeholder', async () => {
    const element = await mount('label="Country" placeholder="Search a country"');
    expect(field(element).value).toBe('');
    expect(field(element).placeholder).toBe('Search a country');
  });

  it('the property sets the current value and stops the attribute from applying', async () => {
    const element = await mount('label="Country" value="chile"');
    element.value = 'peru';
    await settle();
    element.setAttribute('value', 'brazil');
    await settle();
    expect(element.value).toBe('peru');
    expect(field(element).value).toBe('Peru');
  });

  it('the value is kept until an option of that value arrives', async () => {
    const element = await mount('label="Country" value="bolivia"', countries());
    expect(field(element).value).toBe('');
    element.options = [...countries(), { value: 'bolivia', text: 'Bolivia' }];
    await settle();
    expect(field(element).value).toBe('Bolivia');
  });
});

describe('form association', () => {
  async function inForm(attributes: string): Promise<{ form: HTMLFormElement; element: NphCombobox }> {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount(attributes, countries(), form);
    return { form, element };
  }

  it('the host knows its form and the form data carries name=value', async () => {
    const { form, element } = await inForm('label="Country" name="country" value="peru"');
    expect(element.form).toBe(form);
    expect(new FormData(form).get('country')).toBe('peru');
  });

  it('with no choice, or with typed text and no choice, the entry is left out of the form data', async () => {
    const { form, element } = await inForm('label="Country" name="country"');
    expect(new FormData(form).has('country')).toBe(false);
    await type(element, 'Bra');
    expect(new FormData(form).has('country')).toBe(false);
  });

  it('form.reset() goes back to the value attribute, and fires nothing', async () => {
    const { form, element } = await inForm('label="Country" name="country" value="peru"');
    element.value = 'chile';
    await settle();
    const fired = vi.fn();
    element.addEventListener('input', fired);
    element.addEventListener('change', fired);
    form.reset();
    await settle();
    expect(element.value).toBe('peru');
    expect(field(element).value).toBe('Peru');
    expect(fired).not.toHaveBeenCalled();
  });

  it('required with no choice is valueMissing, with the browser message', async () => {
    const { element } = await inForm('label="Country" name="country" required');
    expect(element.validity.valueMissing).toBe(true);
    expect(element.validationMessage).not.toBe('');
    element.value = 'peru';
    await settle();
    expect(element.validity.valid).toBe(true);
  });

  it('a disabled fieldset disables the piece: out of the form data, no list', async () => {
    const form = document.createElement('form');
    form.innerHTML = '<fieldset disabled></fieldset>';
    document.body.append(form);
    const element = await mount('label="Country" name="country" value="peru"', countries(), form.querySelector('fieldset') as HTMLElement);
    expect(new FormData(form).has('country')).toBe(false);
    expect(element.matches(':disabled')).toBe(true);
    expect(field(element).disabled).toBe(true);
  });

  it('Enter with the list closed submits the form; with the list open it chooses and does not submit', async () => {
    const { form, element } = await inForm('label="Country" name="country"');
    const submitted = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submitted);
    await type(element, 'Per');
    expect(element.open).toBe(true);
    await press(element, '{Enter}');
    await wait(10);
    expect(element.value).toBe('peru');
    expect(submitted).not.toHaveBeenCalled();
    await press(element, '{Enter}');
    await wait(10);
    expect(submitted).toHaveBeenCalledTimes(1);
  });

  it('restores the value on history navigation (formStateRestoreCallback)', async () => {
    const element = await mount();
    element.formStateRestoreCallback('canada');
    await settle();
    expect(element.value).toBe('canada');
  });
});

describe('accessible name and description', () => {
  it('label names the combobox and the listbox', async () => {
    const element = await mount('label="Country"');
    const node = await accessibleNodeOf(field(element));
    expect(node.role?.value).toBe('combobox');
    expect(node.name?.value).toBe('Country');
    expect(listbox(element).getAttribute('aria-label')).toBe('Country');
  });

  it('description is the accessible description, never visible', async () => {
    const element = await mount('label="Country" description="Where you live"');
    const node = await accessibleNodeOf(field(element));
    expect(node.description?.value).toBe('Where you live');
    const box = element.shadowRoot?.querySelector('.description') as HTMLElement;
    expect(getComputedStyle(box).clipPath).toBe('inset(50%)');
  });

  it('the rows are options of the listbox with their state; the start, the arrow and the divider are hidden', async () => {
    const element = await mount('label="Country" value="brazil"');
    element.open = true;
    await settle();
    const node = await accessibleNodeOf(row(element, 'Brazil'));
    expect(node.role?.value).toBe('option');
    expect(node.name?.value).toBe('Brazil');
    expect(node.properties?.find((property) => property.name === 'selected')?.value.value).toBe(true);
    expect(element.shadowRoot?.querySelector('.start')?.getAttribute('aria-hidden')).toBe('true');
    expect(element.shadowRoot?.querySelector('.arrow')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('a highlighted option keeps its whole text as its name', async () => {
    const element = await mount();
    await type(element, 'raz');
    const node = await accessibleNodeOf(row(element, 'Brazil'));
    expect(node.name?.value).toBe('Brazil');
  });

  it('open, the combobox is expanded and points to the active option', async () => {
    const element = await mount();
    await focus(element);
    await press(element, '{ArrowDown}');
    expect(field(element).getAttribute('aria-expanded')).toBe('true');
    expect(activeOf(element)).toBe(row(element, 'Argentina'));
  });

  it('a combobox with no name warns once in development, after the first frame', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await mount('');
    await nextFrame();
    await nextFrame();
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('[nph-combobox]') && String(call[0]).includes('accessible name'))).toHaveLength(1);
  });

  it('invalid writes aria-invalid; required writes aria-required', async () => {
    const element = await mount('label="Country" invalid required');
    expect(field(element).getAttribute('aria-invalid')).toBe('true');
    expect(field(element).getAttribute('aria-required')).toBe('true');
  });
});

describe('the search and its highlight', () => {
  it('typing opens the list, filters it with no difference of case or accent, and makes the first match active (D-5)', async () => {
    const element = await mount('label="Country"', [...countries(), { value: 'sp', text: 'São Tomé' }]);
    await type(element, 'sa');
    expect(element.open).toBe(true);
    expect(texts(element)).toEqual(['São Tomé']);
    expect(activeOf(element)).toBe(row(element, 'São Tomé'));
    await press(element, '{Backspace}{Backspace}u');
    expect(texts(element)).toEqual(['Paraguay', 'Peru', 'Uruguay', 'Venezuela']);
    expect(activeOf(element)).toBe(row(element, 'Paraguay'));
  });

  it('the typed stretch is in text/highlight-weight and the rest in color/muted-foreground', async () => {
    const element = await mount();
    await type(element, 'raz');
    const option = row(element, 'Brazil');
    const match = option.querySelector('.match') as HTMLElement;
    const rest = [...option.querySelectorAll<HTMLElement>('.rest')];
    expect(match.textContent).toBe('raz');
    expect(rest.map((part) => part.textContent)).toEqual(['B', 'il']);
    expect(getComputedStyle(match).fontWeight).toBe(resolved('font-weight', '--nph-text-highlight-weight'));
    expect(getComputedStyle(rest[0] as HTMLElement).color).toBe(resolved('color', '--nph-color-muted-foreground'));
  });

  it('with no typed text there is no highlight', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    expect(element.shadowRoot?.querySelectorAll('.match').length).toBe(0);
  });

  it('nph-search says the typed text; the native input of the inner field does not leave the shadow root', async () => {
    const element = await mount();
    const searched = vi.fn();
    const inputs = vi.fn();
    element.addEventListener('nph-search', (event) => searched(event.detail.query));
    document.addEventListener('input', inputs);
    try {
      await type(element, 'Ch');
      expect(searched.mock.calls.map((call) => call[0])).toEqual(['C', 'Ch']);
      expect(inputs).not.toHaveBeenCalled();
      expect(element.query).toBe('Ch');
      expect(element.value).toBe('');
    } finally {
      document.removeEventListener('input', inputs);
    }
  });

  it('query set from code writes the text, filters the list and fires nothing', async () => {
    const element = await mount();
    const fired = vi.fn();
    element.addEventListener('nph-search', fired);
    element.query = 'raz';
    element.open = true;
    await settle();
    expect(field(element).value).toBe('raz');
    expect(texts(element)).toEqual(['Brazil']);
    expect(activeOf(element)).toBe(row(element, 'Brazil'));
    expect(fired).not.toHaveBeenCalled();
    element.query = '';
    await settle();
    expect(texts(element)).toHaveLength(COUNTRIES.length);
  });

  it('filter none keeps every option: the consumer filters, and the highlight stays', async () => {
    const element = await mount('label="Country" filter="none"');
    await type(element, 'raz');
    expect(texts(element)).toHaveLength(COUNTRIES.length);
    expect(row(element, 'Brazil').querySelector('.match')?.textContent).toBe('raz');
  });

  it('leaving the field without choosing gives the field the chosen text again', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<button>after</button>';
    document.body.append(holder);
    const element = await mount('label="Country" value="peru"');
    const searched = vi.fn();
    element.addEventListener('nph-search', (event) => searched(event.detail.query));
    await type(element, 'Bra');
    (holder.querySelector('button') as HTMLButtonElement).focus();
    await settle();
    expect(element.open).toBe(false);
    expect(field(element).value).toBe('Peru');
    expect(element.value).toBe('peru');
    expect(searched.mock.calls.at(-1)?.[0]).toBe('');
  });
});

describe('groups, status, loading, create, empty and shortcuts', () => {
  const grouped: NphComboboxEntry[] = [
    { type: 'label', text: 'South America' },
    { value: 'brazil', text: 'Brazil' },
    { value: 'chile', text: 'Chile' },
    { type: 'separator' },
    { type: 'label', text: 'North America' },
    { value: 'canada', text: 'Canada' },
  ];

  it('groups: group labels in the look of nph-dropdown-menu and an nph-separator between groups', async () => {
    const element = await mount('label="Country"', grouped);
    element.open = true;
    await settle();
    const labels = [...(element.shadowRoot?.querySelectorAll<HTMLElement>('.group-label') ?? [])];
    expect(labels.map((label) => label.textContent?.trim())).toEqual(['South America', 'North America']);
    expect(getComputedStyle(labels[0] as HTMLElement).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(getComputedStyle(labels[0] as HTMLElement).fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
    expect(element.shadowRoot?.querySelectorAll('nph-separator').length).toBe(1);
    const group = element.shadowRoot?.querySelector('.group') as HTMLElement;
    expect(group.getAttribute('role')).toBe('group');
    expect(element.shadowRoot?.getElementById(group.getAttribute('aria-labelledby') ?? '')?.textContent?.trim()).toBe('South America');
  });

  it('a group with no match goes away, with its label and its line', async () => {
    const element = await mount('label="Country"', grouped);
    await type(element, 'can');
    expect(texts(element)).toEqual(['Canada']);
    expect(element.shadowRoot?.querySelectorAll('.group-label').length).toBe(1);
    expect(element.shadowRoot?.querySelectorAll('nph-separator').length).toBe(0);
  });

  it('status: an option with the dot of nph-option and its written label', async () => {
    const element = await mount('label="State"', [
      { value: 'open', text: 'Open', start: 'dot', status: 'success' },
      { value: 'late', text: 'Late', start: 'dot', status: 'error' },
    ]);
    element.open = true;
    await settle();
    const option = row(element, 'Open');
    expect(option.start).toBe('dot');
    expect(option.status).toBe('success');
    expect(option.shadowRoot?.querySelector('.dot')).not.toBeNull();
  });

  it('loading: the nph-spinner with loading-label, and no option', async () => {
    const element = await mount('label="Country" loading loading-label="Searching"');
    element.open = true;
    await settle();
    const spinner = element.shadowRoot?.querySelector('nph-spinner') as HTMLElement & { label: string };
    expect(spinner).not.toBeNull();
    expect(spinner.label).toBe('Searching');
    expect(rows(element)).toHaveLength(0);
    expect(spinner.closest('[role="status"]')).not.toBeNull();
  });

  it('new results after loading make the first match active again (D-5)', async () => {
    const element = await mount('label="Country" filter="none" loading-label="Searching"', []);
    element.addEventListener('nph-search', () => {
      element.loading = true;
    });
    await type(element, 'Br');
    expect(element.open).toBe(true);
    element.options = [{ value: 'brazil', text: 'Brazil' }];
    element.loading = false;
    await settle();
    expect(activeOf(element)).toBe(row(element, 'Brazil'));
  });

  it('create: the create row offers the typed text after the results, with the plus icon (D-1)', async () => {
    const element = await mount('label="Country" creatable create-label="Create"');
    await type(element, 'Per');
    const create = rows(element).at(-1) as NphOption;
    expect(create.classList.contains('create')).toBe(true);
    expect(create.icon).toBe('plus');
    expect(create.textContent?.trim()).toBe('Create “Per”');
    expect(texts(element)[0]).toBe('Peru');
  });

  it('an option added inside nph-create is in the form data and the validity when change runs', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount('label="Country" name="country" required creatable create-label="Create"', countries(), form);
    element.addEventListener('nph-create', (event) => {
      element.options = [...element.options, { value: event.detail.text, text: event.detail.text }];
    });
    let seen: { data: FormDataEntryValue | null; valid: boolean } | null = null;
    element.addEventListener('change', () => {
      seen = { data: new FormData(form).get('country'), valid: element.validity.valid };
    });
    const error = vi.spyOn(console, 'error');
    await type(element, 'Bolivia');
    await press(element, '{Enter}');
    expect(seen).toEqual({ data: 'Bolivia', valid: true });
    expect(error).not.toHaveBeenCalled();
  });

  it('the create row is hidden when an option already says the typed text', async () => {
    const element = await mount('label="Country" creatable create-label="Create"');
    await type(element, 'peru');
    expect(rows(element).some((item) => item.classList.contains('create'))).toBe(false);
  });

  it('choosing the create row fires nph-create, then input and change, and the value is the text', async () => {
    const element = await mount('label="Country" creatable create-label="Create"');
    const order: string[] = [];
    element.addEventListener('nph-create', (event) => {
      order.push(`create:${event.detail.text}`);
      element.options = [...element.options, { value: event.detail.text, text: event.detail.text }];
    });
    element.addEventListener('input', () => order.push('input'));
    element.addEventListener('change', () => order.push('change'));
    await type(element, 'Bolivia');
    await press(element, '{Enter}');
    expect(order).toEqual(['create:Bolivia', 'input', 'change']);
    expect(element.value).toBe('Bolivia');
    await settle();
    expect(field(element).value).toBe('Bolivia');
  });

  it('empty: the nph-empty in a live region when nothing matches in a closed list', async () => {
    const element = await mount('label="Country" empty-heading="No country found" empty-description="Check the spelling"');
    await type(element, 'xyz');
    expect(element.open).toBe(true);
    const empty = element.shadowRoot?.querySelector('nph-empty') as HTMLElement & { heading: string; description: string };
    expect(empty.heading).toBe('No country found');
    expect(empty.description).toBe('Check the spelling');
    expect(empty.closest('[role="status"]')).not.toBeNull();
  });

  it('with nothing to show and no empty-heading, the list closes', async () => {
    const element = await mount();
    await type(element, 'xyz');
    expect(element.open).toBe(false);
  });

  it('shortcuts: the slot draws the footer, with a color/border line above', async () => {
    const element = await mount();
    const footer = element.shadowRoot?.querySelector('.footer') as HTMLElement;
    expect(footer.hidden).toBe(true);
    const keys = document.createElement('span');
    keys.slot = 'shortcuts';
    keys.innerHTML = '<nph-kbd text="Enter"></nph-kbd> to choose';
    element.append(keys);
    element.open = true;
    await settle();
    await nextFrame();
    await settle();
    expect(footer.hidden).toBe(false);
    expect(getComputedStyle(footer).borderTopColor).toBe(resolved('color', '--nph-color-border'));
  });
});

describe('the rows Lit reuses', () => {
  it('an option with no icon keeps the default icon when it takes the row of one that had an icon', async () => {
    const element = await mount('label="Folder"', [
      { value: 'a', text: 'Alpha', start: 'icon', icon: 'folder' },
      { value: 'b', text: 'Beta', start: 'icon' },
    ]);
    element.open = true;
    await settle();
    await type(element, 'Bet');
    const option = row(element, 'Beta');
    expect(option.icon).toBe('globe');
    expect(option.hasAttribute('data-nph-rendered')).toBe(true);
  });
});

describe('pointer', () => {
  it('a click on the field opens; a click on an option chooses it and closes', async () => {
    const element = await mount();
    await userEvent.click(field(element));
    await settle();
    expect(element.open).toBe(true);
    await userEvent.click(row(element, 'Chile'));
    await settle();
    expect(element.value).toBe('chile');
    expect(element.open).toBe(false);
    expect(field(element).value).toBe('Chile');
    expect(element.shadowRoot?.activeElement).toBe(field(element));
  });

  it('a click on the arrow area opens and closes the list, keeping the focus on the field', async () => {
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

  it('a press outside closes without choosing', async () => {
    const element = await mount();
    await userEvent.click(field(element));
    await settle();
    await userEvent.click(document.body, { position: { x: 600, y: 600 } });
    await settle();
    expect(element.open).toBe(false);
    expect(element.value).toBe('');
  });

  it('the pointer over an option makes it active; a disabled option is not chosen', async () => {
    const element = await mount('label="Country"', [{ value: 'a', text: 'Argentina' }, { value: 'b', text: 'Brazil', disabled: true }]);
    await userEvent.click(field(element));
    await settle();
    await userEvent.hover(row(element, 'Argentina'));
    await settle();
    expect(row(element, 'Argentina').active).toBe(true);
    await userEvent.click(row(element, 'Brazil'), { force: true });
    await settle();
    expect(element.value).toBe('');
  });
});

describe('keyboard (APG editable combobox)', () => {
  it('closed: ArrowDown opens on the chosen option or the first; ArrowUp on the chosen or the last', async () => {
    const element = await mount();
    await focus(element);
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(row(element, 'Argentina'));
    await press(element, '{Escape}');
    await press(element, '{ArrowUp}');
    expect(activeOf(element)).toBe(row(element, 'Venezuela'));
    await press(element, '{Escape}');
    element.value = 'chile';
    await settle();
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(row(element, 'Chile'));
  });

  it('Alt+ArrowDown opens without moving', async () => {
    const element = await mount();
    await focus(element);
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    expect(element.open).toBe(true);
    expect(activeOf(element)).toBeNull();
  });

  it('arrows move without wrapping; Page Up and Page Down jump; disabled options are skipped', async () => {
    const entries = countries();
    (entries[1] as { disabled?: boolean }).disabled = true;
    const element = await mount('label="Country"', entries);
    await focus(element);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(row(element, 'Canada'));
    await press(element, '{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(activeOf(element)).toBe(row(element, 'Argentina'));
    await press(element, '{PageDown}');
    expect(activeOf(element)).toBe(row(element, 'Venezuela'));
    await press(element, '{PageUp}');
    expect(activeOf(element)).toBe(row(element, 'Argentina'));
  });

  it('Enter and Alt+ArrowUp choose the active option and close', async () => {
    const element = await mount();
    await focus(element);
    await press(element, '{ArrowDown}{ArrowDown}{Enter}');
    expect(element.value).toBe('brazil');
    expect(element.open).toBe(false);
    await press(element, '{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}');
    expect(element.value).toBe('canada');
  });

  it('Escape closes without choosing and does not reach a dialog around it', async () => {
    const element = await mount();
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    try {
      await type(element, 'Bra');
      await press(element, '{Escape}');
      expect(element.open).toBe(false);
      expect(element.value).toBe('');
      expect(outer).not.toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }));
    } finally {
      document.body.removeEventListener('keydown', outer);
    }
  });

  it('Escape with the list closed clears the typed text (D-4); with none, it passes on', async () => {
    const element = await mount('label="Country" value="peru"');
    await type(element, 'Bra');
    await press(element, '{Escape}');
    await press(element, '{Escape}');
    expect(element.query).toBe('');
    expect(field(element).value).toBe('Peru');
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    try {
      await press(element, '{Escape}');
      expect(outer).toHaveBeenCalled();
    } finally {
      document.body.removeEventListener('keydown', outer);
    }
  });

  it('Tab closes without choosing and the focus moves on (P91)', async () => {
    const element = await mount();
    const after = document.createElement('button');
    document.body.append(after);
    await type(element, 'Bra');
    await press(element, '{Tab}');
    expect(element.open).toBe(false);
    expect(element.value).toBe('');
    expect(document.activeElement).toBe(after);
  });

  it('Home and End stay in the text', async () => {
    const element = await mount();
    await type(element, 'Bra');
    await press(element, '{Home}');
    expect(field(element).selectionStart).toBe(0);
    expect(activeOf(element)).toBe(row(element, 'Brazil'));
  });

  it('a disabled combobox does not open and is not in the tab order', async () => {
    const element = await mount('label="Country" disabled');
    expect(field(element).disabled).toBe(true);
    element.open = true;
    await settle();
    expect(element.open).toBe(false);
  });

  it('the active option comes into view of the list, without scrolling the page', async () => {
    const element = await mount('label="Country"', countries([...COUNTRIES, 'Aruba', 'Belize', 'Cuba', 'Haiti', 'Jamaica']));
    await focus(element);
    await press(element, '{ArrowUp}');
    await nextFrame();
    const scroller = element.shadowRoot?.querySelector('.scroller') as HTMLElement;
    expect(scroller.scrollTop).toBeGreaterThan(0);
    expect(window.scrollY).toBe(0);
  });
});

describe('events', () => {
  it('a choice of a different value fires input and then change; input crosses shadow roots', async () => {
    const element = await mount();
    const order: string[] = [];
    element.addEventListener('input', (event) => order.push(`input:${String(event.composed)}`));
    element.addEventListener('change', () => order.push(`change:${element.value}`));
    await type(element, 'Chi');
    await press(element, '{Enter}');
    expect(order).toEqual(['input:true', 'change:chile']);
  });

  it('choosing the option already chosen fires nothing', async () => {
    const element = await mount('label="Country" value="chile"');
    const fired = vi.fn();
    element.addEventListener('input', fired);
    element.addEventListener('change', fired);
    await focus(element);
    await press(element, '{ArrowDown}{Enter}');
    expect(fired).not.toHaveBeenCalled();
  });

  it('setting value or open from code fires nothing', async () => {
    const element = await mount();
    const fired = vi.fn();
    for (const name of ['input', 'change', 'nph-search', 'nph-create']) element.addEventListener(name, fired);
    element.value = 'peru';
    element.open = true;
    await settle();
    expect(fired).not.toHaveBeenCalled();
  });

  it('the form data is up to date when change runs', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount('label="Country" name="country"', countries(), form);
    let seen: FormDataEntryValue | null = null;
    element.addEventListener('change', () => {
      seen = new FormData(form).get('country');
    });
    await type(element, 'Uru');
    await press(element, '{Enter}');
    expect(seen).toBe('uruguay');
  });
});

describe('the clear button', () => {
  it('shows with a choice or typed text, has clear-label as its name and clears both', async () => {
    const element = await mount('label="Country" clearable clear-label="Clear country" value="peru"');
    const button = clearButton(element) as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Clear country');
    const order: string[] = [];
    element.addEventListener('input', () => order.push('input'));
    element.addEventListener('change', () => order.push('change'));
    await userEvent.click(button);
    await settle();
    expect(element.value).toBe('');
    expect(field(element).value).toBe('');
    expect(order).toEqual(['input', 'change']);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    expect(clearButton(element)).toBeNull();
    await type(element, 'Ar');
    expect(clearButton(element)).not.toBeNull();
  });

  it('clearing a search with no choice redraws the field, the button and the list', async () => {
    const element = await mount('label="Country" clearable clear-label="Clear"');
    await type(element, 'Ar');
    expect(clearButton(element)).not.toBeNull();
    await userEvent.click(clearButton(element) as HTMLButtonElement);
    await settle();
    expect(field(element).value).toBe('');
    expect(clearButton(element)).toBeNull();
    if (element.open) {
      expect(texts(element)).toHaveLength(COUNTRIES.length);
    }
  });

  it('setting the same value, or a reset to the same default, drops the typed text and shows the chosen text', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount('label="Country" name="country" value="peru"', countries(), form);
    await type(element, 'Bra');
    element.value = element.value;
    await settle();
    expect(field(element).value).toBe('Peru');
    await type(element, 'Chi');
    form.reset();
    await settle();
    expect(field(element).value).toBe('Peru');
    expect(element.query).toBe('');
  });

  it('the clear target is icon/size-sm with space/inline-tight around it', async () => {
    const element = await mount('label="Country" clearable clear-label="Clear" value="peru"');
    const box = (clearButton(element) as HTMLButtonElement).getBoundingClientRect();
    expect(box.width).toBeCloseTo(px('--nph-icon-size-sm') + 2 * px('--nph-space-inline-tight'), 0);
  });

  it('clearable without clear-label draws no button and emits one error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount('label="Country" clearable value="peru"');
    expect(clearButton(element)).toBeNull();
    expect(error.mock.calls.filter((call) => String(call[0]).includes('clear-label'))).toHaveLength(1);
  });

  it('a disabled combobox shows no clear button', async () => {
    const element = await mount('label="Country" clearable clear-label="Clear" value="peru" disabled');
    expect(clearButton(element)).toBeNull();
  });
});

describe('start of the field', () => {
  it('search draws the magnifying glass, hidden from the screen reader', async () => {
    const element = await mount();
    const start = element.shadowRoot?.querySelector('.start') as HTMLElement & { name: string };
    expect(start.localName).toBe('nph-icon');
    expect(start.name).toBe('magnifying-glass');
  });

  it('icon: icon before a choice, the icon of the chosen option after', async () => {
    const element = await mount('label="Country" start="icon" icon="globe"', [{ value: 'a', text: 'Archive', start: 'icon', icon: 'folder' }, { value: 'b', text: 'Basic' }]);
    const start = (): string => (element.shadowRoot?.querySelector('.start') as HTMLElement & { name: string }).name;
    expect(start()).toBe('globe');
    element.value = 'a';
    await settle();
    expect(start()).toBe('folder');
  });

  it('avatar: the empty avatar before a choice, the photo of the chosen option after', async () => {
    const element = await mount('label="Person" start="avatar"', [{ value: 'a', text: 'Ana', start: 'avatar', src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' }]);
    const avatar = (): HTMLElement & { src: string } => element.shadowRoot?.querySelector('nph-avatar') as HTMLElement & { src: string };
    expect(avatar().src).toBe('');
    element.value = 'a';
    await settle();
    expect(avatar().src).toContain('data:image/gif');
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

  it('turns up when it does not fit below and fits above', async () => {
    const spacer = document.createElement('div');
    spacer.style.height = `${window.innerHeight - 60}px`;
    document.body.append(spacer);
    const element = await mount();
    element.open = true;
    await settle();
    await nextFrame();
    expect(list(element).getAttribute('data-side')).toBe('top');
    await wait(400);
    const anchor = control(element).getBoundingClientRect();
    const box = list(element).getBoundingClientRect();
    expect(anchor.top - box.bottom).toBeCloseTo(px('--nph-space-inline-tight'), 0);
  });

  it('the inside scrolls within layout/max-list-height, with the border outside', async () => {
    const element = await mount('label="Country"', countries([...COUNTRIES, 'Aruba', 'Belize', 'Cuba', 'Haiti', 'Jamaica']));
    element.open = true;
    await settle();
    const scroller = element.shadowRoot?.querySelector('.scroller') as HTMLElement;
    expect(scroller.getBoundingClientRect().height).toBeCloseTo(px('--nph-layout-max-list-height'), 0);
    expect(list(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-layout-max-list-height') + 2 * px('--nph-border-width'), 0);
  });

  it('the list: color/popover, border color/input, radius/container, elevation/dropdown', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    const style = getComputedStyle(list(element));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-popover'));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-color-input'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-container'));
    expect(style.boxShadow).toBe(resolved('box-shadow', '--nph-elevation-dropdown'));
  });

  it('closing leaves the top layer after the exit transition', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    element.open = false;
    await settle();
    const duration = parseFloat(getComputedStyle(list(element)).transitionDuration) * 1000;
    await wait(duration + 50);
    expect(list(element).matches(':popover-open')).toBe(false);
  });

  it('removing the combobox from the page closes the list', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    element.remove();
    expect(element.open).toBe(false);
  });
});

describe('measures and anatomy', () => {
  it('width layout/input-width; height control/height-default and large', async () => {
    const element = await mount();
    expect(element.getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-input-width'), 0);
    expect(control(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 0);
    element.size = 'large';
    await settle();
    expect(control(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-large'), 0);
  });

  for (const size of ['default', 'large'] as const) {
    it(`${size}: the arrow area is control/height-${size} wide, the divider outside it, and as tall as the field minus its borders`, async () => {
      const element = await mount(`label="Country" size="${size}"`);
      const arrow = (element.shadowRoot?.querySelector('.arrow') as HTMLElement).getBoundingClientRect();
      const border = px('--nph-border-width');
      expect(arrow.width).toBeCloseTo(px(`--nph-control-height-${size}`) + border, 0);
      expect(arrow.height).toBeCloseTo(px(`--nph-control-height-${size}`) - 2 * border, 0);
      expect(arrow.right).toBeCloseTo(control(element).getBoundingClientRect().right - border, 0);
    });
  }

  it('the arrow area: color/accent, the color/border divider before it, radius/control-inner on the right', async () => {
    const element = await mount();
    const style = getComputedStyle(element.shadowRoot?.querySelector('.arrow') as HTMLElement);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-accent'));
    expect(style.borderLeftColor).toBe(resolved('color', '--nph-color-border'));
    expect(style.borderTopRightRadius).toBe(resolved('border-top-right-radius', '--nph-radius-control-inner'));
    expect(style.borderTopLeftRadius).toBe('0px');
  });

  it('the arrow turns up with the list open', async () => {
    const element = await mount();
    const arrow = (): string => (element.shadowRoot?.querySelector('.arrow nph-icon') as HTMLElement & { name: string }).name;
    expect(arrow()).toBe('chevron-down');
    element.open = true;
    await settle();
    expect(arrow()).toBe('chevron-up');
  });

  it('left padding space/control-padding, gap space/inline, right padding 0', async () => {
    const element = await mount();
    const style = getComputedStyle(control(element));
    expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline'));
    expect(style.paddingRight).toBe('0px');
  });
});

describe('states and precedence', () => {
  it('focus: focus/border and the focus/halo outside; open keeps it', async () => {
    const element = await mount();
    await focus(element);
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(getComputedStyle(control(element), '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    await press(element, '{ArrowDown}');
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border'));
  });

  it('error: status/error at rest and on focus; focus/halo-error on focus', async () => {
    const element = await mount('label="Country" invalid');
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-status-error'));
    await focus(element);
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-status-error'));
    expect(getComputedStyle(control(element), '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
  });

  it('disabled wins: color/muted, color/input, state/disabled-opacity on the whole piece', async () => {
    const element = await mount('label="Country" invalid disabled');
    expect(getComputedStyle(control(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-color-input'));
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('the selected option keeps color/primary-surface and the check in color/primary', async () => {
    const element = await mount('label="Country" value="peru"');
    element.open = true;
    await settle();
    const option = row(element, 'Peru');
    expect(getComputedStyle(option).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
    expect(getComputedStyle(option.shadowRoot?.querySelector('.check') as HTMLElement).color).toBe(resolved('color', '--nph-color-primary'));
  });

  it('disabling an open combobox closes it', async () => {
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
    holder.innerHTML = '<nph-field label="Country" help="Where you live" required><nph-combobox placeholder="Search"></nph-combobox></nph-field>';
    const element = holder.querySelector('nph-combobox') as NphCombobox;
    element.options = countries();
    document.body.append(holder);
    await settle(holder);
    await settle(holder);
    expect(element.label).toBe('Country');
    expect(element.required).toBe(true);
    expect(element.description).toBe('Where you live');
    const node = await accessibleNodeOf(field(element));
    expect(node.name?.value).toBe('Country');
    expect(node.description?.value).toBe('Where you live');
    const outer = holder.querySelector('nph-field') as HTMLElement & { error: string };
    outer.error = 'Choose a country';
    await settle(holder);
    expect(element.invalid).toBe(true);
    expect(element.description).toBe('Choose a country');
  });
});

describe('invalid input', () => {
  const cases: ReadonlyArray<readonly [string, string, number]> = [
    ['a size that does not exist', 'size="small"', 1],
    ['a start that does not exist', 'start="none"', 1],
    ['an icon outside the core', 'start="icon" icon="not-a-core-name"', 1],
    ['a filter that does not exist', 'filter="startsWith"', 1],
    ['accumulates the causes', 'size="small" start="dot" icon="nope" filter="x"', 4],
  ];
  for (const [name, attributes, count] of cases) {
    it(`${name}: nothing and ${count} error(s) in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const element = await mount(`label="Country" ${attributes}`);
      expect(error.mock.calls.filter((call) => String(call[0]).includes('[nph-combobox]'))).toHaveLength(count);
      expect(element.shadowRoot?.querySelector('.control')).toBeNull();
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect(element.getBoundingClientRect().width).toBe(0);
    });
  }

  it('an invalid piece adds nothing to the form data', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const form = document.createElement('form');
    document.body.append(form);
    await mount('label="Country" name="country" value="peru" size="small"', countries(), form);
    expect(new FormData(form).has('country')).toBe(false);
  });

  it('an invalid entry is left out, with one error per cause', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount('label="Country"', [
      { value: 'a', text: 'Argentina' },
      { value: 'b', text: '' },
      { value: 'c', text: 'Chile', start: 'nope' as 'none', status: 'bad' as 'info' },
      { type: 'label', text: '' },
    ]);
    element.open = true;
    await settle();
    expect(texts(element)).toEqual(['Argentina']);
    expect(error.mock.calls.filter((call) => String(call[0]).includes('[nph-combobox]'))).toHaveLength(4);
  });

  it('a valid input set later draws the piece', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount('label="Country" size="small"');
    element.size = 'default';
    await settle();
    expect(element.shadowRoot?.querySelector('.control')).not.toBeNull();
  });
});

describe('token contract', () => {
  const strip = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = (css: string): Set<string> => new Set([...strip(css).matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of [...used(componentCss), ...used(listCss)]) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('the field and the list consume the tokens the evidence names', () => {
    const all = new Set([...used(componentCss), ...used(listCss)]);
    for (const name of [
      '--nph-layout-input-width',
      '--nph-color-background',
      '--nph-color-input',
      '--nph-border-width',
      '--nph-radius-control',
      '--nph-control-height-default',
      '--nph-control-height-large',
      '--nph-space-control-padding',
      '--nph-space-inline',
      '--nph-color-border',
      '--nph-color-accent',
      '--nph-radius-control-inner',
      '--nph-radius-none',
      '--nph-color-input-hover',
      '--nph-focus-border',
      '--nph-focus-halo',
      '--nph-status-error',
      '--nph-focus-halo-error',
      '--nph-color-muted',
      '--nph-state-disabled-opacity',
      '--nph-color-popover',
      '--nph-radius-container',
      '--nph-layout-max-list-height',
      '--nph-text-highlight-weight',
      '--nph-color-muted-foreground',
      '--nph-space-inline-tight',
    ]) {
      expect(all, name).toContain(name);
    }
  });

  it('never consumes a core or theme token: components use the semantic layer only', () => {
    expect(componentCss + listCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, measure or duration', () => {
    for (const css of [componentCss, listCss]) {
      expect(strip(css)).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(strip(css)).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
      expect(strip(css)).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s)\b/);
    }
  });

  it('reduced motion keeps only the opacity', () => {
    expect(strip(listCss)).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*translate: none/);
  });
});
