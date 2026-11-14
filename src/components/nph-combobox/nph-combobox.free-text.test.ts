/**
 * Tests of the free text variant of `nph-combobox` (P122), in a real browser (P21, item 5).
 *
 * They prove the contract accepted in Figma (documentation `6047:3760`, root `6040:2120`, set
 * `6040:3286`) and the decisions of P122: the field without the arrow and its end padding
 * (`combobox/free-text-padding-end`); the typed text as the value, in the form and in the events;
 * the keyboard of the variant, where no suggestion is active while typing; the list that closes
 * with no `nph-empty` while a status region says there is no suggestion; the loading list; the
 * IME composition; the combined states; and the accessibility tree. The arrow variant has its
 * own file, `nph-combobox.test.ts`, and none of its tests changes with this variant.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import '../nph-field/nph-field';
import { NphOption } from '../nph-option/nph-option';
import designMd from '../../../design.md?raw';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-combobox.css?raw';
import { NphCombobox } from './nph-combobox';
import type { NphComboboxEntry } from './nph-combobox';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('600 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const PLACES = ['United Kingdom', 'United States', 'Uruguay', 'Unity', 'Brazil', 'Canada'];

function places(labels: readonly string[] = PLACES): NphComboboxEntry[] {
  /* The value of an option is not used by the free text variant: it is a different string on purpose. */
  return labels.map((label, index) => ({ value: `id-${index}`, text: label }));
}

const FREE = 'label="Location" free-text no-suggestions-label="No suggestions"';

async function settle(root: ParentNode = document.body): Promise<void> {
  const elements = [...root.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-combobox, nph-field, nph-label')];
  await Promise.all(elements.map((element) => element.updateComplete));
  await Promise.all(elements.map((element) => element.updateComplete));
  const inner = elements.flatMap((element) => [...(element.shadowRoot?.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-option, nph-empty, nph-spinner') ?? [])]);
  await Promise.all(inner.map((element) => element.updateComplete));
}

async function mount(attributes = FREE, entries: readonly NphComboboxEntry[] = places(), parent: HTMLElement = document.body): Promise<NphCombobox> {
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

function announced(element: NphCombobox): string {
  return element.shadowRoot?.querySelector('.announce')?.textContent?.trim() ?? '';
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

/** The names of the events a combobox fires, in order, with the value each one saw. */
function record(element: NphCombobox, names: readonly string[] = ['input', 'change', 'nph-search']): string[] {
  const seen: string[] = [];
  for (const name of names) {
    element.addEventListener(name, (event) => {
      seen.push(name === 'nph-search' ? `${name}:${(event as CustomEvent<{ query: string }>).detail.query}` : `${name}:${element.value}`);
    });
  }
  return seen;
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
  properties?: Array<{ name: string; value: { value?: unknown } }>;
}

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

describe('free text: API and anatomy', () => {
  it('free-text is off by default, reflects, and the variant has no arrow area and no divider', async () => {
    const plain = await mount('label="Country"');
    expect(plain.freeText).toBe(false);
    expect(plain.hasAttribute('free-text')).toBe(false);
    expect(plain.noSuggestionsLabel).toBe('');
    const element = await mount();
    expect(element.freeText).toBe(true);
    expect(element.hasAttribute('free-text')).toBe(true);
    expect(element.shadowRoot?.querySelector('.arrow')).toBeNull();
    element.freeText = false;
    await settle();
    expect(element.hasAttribute('free-text')).toBe(false);
    expect(element.shadowRoot?.querySelector('.arrow')).not.toBeNull();
  });

  for (const size of ['default', 'large'] as const) {
    it(`${size}: the end padding is combobox/free-text-padding-end, with and without the clear button, and the field keeps its height`, async () => {
      const end = px('--nph-combobox-free-text-padding-end');
      const start = px('--nph-space-control-padding');
      expect(end).toBe(start);
      const element = await mount(`${FREE} size="${size}" clearable clear-label="Clear" placeholder="Type or pick"`);
      expect(Number.parseFloat(getComputedStyle(control(element)).paddingRight)).toBe(end);
      expect(Number.parseFloat(getComputedStyle(control(element)).paddingLeft)).toBe(start);
      expect(control(element).getBoundingClientRect().height).toBeCloseTo(px(`--nph-control-height-${size}`), 0);
      expect(clearButton(element)).toBeNull();
      await type(element, 'Br');
      const button = clearButton(element) as HTMLButtonElement;
      expect(button).not.toBeNull();
      expect(Number.parseFloat(getComputedStyle(control(element)).paddingRight)).toBe(end);
      /* The 24 × 24 target ends combobox/free-text-padding-end from the inner edge of the border. */
      const target = button.getBoundingClientRect();
      const box = control(element).getBoundingClientRect();
      const border = px('--nph-border-width');
      expect(target.width).toBeCloseTo(px('--nph-icon-size-sm') + 2 * px('--nph-space-inline-tight'), 0);
      expect(box.right - border - target.right).toBeCloseTo(end, 0);
    });
  }

  it('the text stops combobox/free-text-padding-end from the border without the clear button', async () => {
    const element = await mount(`${FREE} placeholder="Type or pick"`);
    const box = control(element).getBoundingClientRect();
    const input = field(element).getBoundingClientRect();
    expect(box.right - px('--nph-border-width') - input.right).toBeCloseTo(px('--nph-combobox-free-text-padding-end'), 0);
  });

  it('the start is the magnifying glass, or the icon property; an avatar start does not exist here', async () => {
    const search = await mount();
    expect((search.shadowRoot?.querySelector('.start') as HTMLElement & { name: string }).name).toBe('magnifying-glass');
    expect(search.shadowRoot?.querySelector('.start')?.getAttribute('aria-hidden')).toBe('true');
    const icon = await mount(`${FREE} start="icon"`);
    expect((icon.shadowRoot?.querySelector('.start') as HTMLElement & { name: string }).name).toBe('globe');
    const other = await mount(`${FREE} start="icon" icon="house"`);
    expect((other.shadowRoot?.querySelector('.start') as HTMLElement & { name: string }).name).toBe('house');
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const avatar = await mount(`${FREE} start="avatar"`);
    expect(avatar.hasAttribute('data-nph-rendered')).toBe(false);
    expect(avatar.shadowRoot?.querySelector('.control')).toBeNull();
    expect(error.mock.calls.filter((call) => String(call[0]).includes('avatar') && String(call[0]).includes('free-text'))).toHaveLength(1);
  });

  it('free-text without no-suggestions-label emits one error and still draws; creatable and the empty texts are ignored with a warning', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount('label="Location" free-text creatable create-label="Create" empty-heading="Nothing"');
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(error.mock.calls.filter((call) => String(call[0]).includes('no-suggestions-label'))).toHaveLength(1);
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('creatable is ignored'))).toHaveLength(1);
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('empty-heading and empty-description are ignored'))).toHaveLength(1);
    await type(element, 'Uni');
    expect(rows(element).some((item) => item.classList.contains('create'))).toBe(false);
    await type(element, 'zzz');
    expect(element.shadowRoot?.querySelector('nph-empty')).toBeNull();
  });

  it('turning free-text on or off in a live element closes the list and drops what was active', async () => {
    const element = await mount('label="Location" no-suggestions-label="No suggestions"');
    await focus(element);
    await press(element, '{ArrowDown}');
    expect(element.open).toBe(true);
    element.freeText = true;
    await settle();
    expect(element.open).toBe(false);
    expect(activeOf(element)).toBeNull();
    expect(element.shadowRoot?.querySelector('.arrow')).toBeNull();
  });
});

describe('free text: the typed text is the value', () => {
  it('typing makes the text the value and the query, and the form data carries it, also when empty', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount(`${FREE} name="location"`, places(), form);
    expect(new FormData(form).get('location')).toBe('');
    await type(element, 'Mars');
    expect(element.value).toBe('Mars');
    expect(element.query).toBe('Mars');
    expect(new FormData(form).get('location')).toBe('Mars');
    await press(element, '{Backspace}{Backspace}{Backspace}{Backspace}');
    expect(new FormData(form).get('location')).toBe('');
  });

  it('a text that is in no suggestion stays as the value on Tab, and is not replaced by a suggestion', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<button>after</button>';
    document.body.append(holder);
    const element = await mount();
    await type(element, 'UX Coordination');
    const seen = record(element);
    await press(element, '{Tab}');
    expect(element.value).toBe('UX Coordination');
    expect(field(element).value).toBe('UX Coordination');
    expect(element.open).toBe(false);
    expect(seen).toEqual(['change:UX Coordination']);
  });

  it('with a suggestion that contains the text, leaving the field keeps the typed text, not the suggestion', async () => {
    const element = await mount();
    await type(element, 'Uni');
    expect(texts(element)).toEqual(['United Kingdom', 'United States', 'Unity']);
    (document.body.appendChild(document.createElement('button'))).focus();
    await settle();
    expect(element.value).toBe('Uni');
    expect(field(element).value).toBe('Uni');
    expect(element.open).toBe(false);
  });

  it('an outside click closes the list and keeps the text, and the change settles', async () => {
    const element = await mount();
    await type(element, 'Uni');
    const seen = record(element, ['change']);
    expect(element.open).toBe(true);
    await userEvent.click(document.body, { position: { x: 1, y: window.innerHeight - 2 } });
    await settle();
    expect(element.open).toBe(false);
    expect(element.value).toBe('Uni');
    expect(seen).toEqual(['change:Uni']);
  });

  it('the value attribute is the initial text and the value of form.reset(); setting it from code fires nothing, not even a change on leaving', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount(`${FREE} name="location" value="Lisbon"`, places(), form);
    expect(field(element).value).toBe('Lisbon');
    const seen = record(element);
    element.value = 'Porto';
    await settle();
    expect(field(element).value).toBe('Porto');
    await focus(element);
    (document.body.appendChild(document.createElement('button'))).focus();
    await settle();
    form.reset();
    await settle();
    expect(element.value).toBe('Lisbon');
    expect(field(element).value).toBe('Lisbon');
    expect(seen).toEqual([]);
  });

  it('query is the text: writing it writes the field, filters the list and fires nothing', async () => {
    const element = await mount();
    const seen = record(element);
    element.query = 'Uru';
    element.open = true;
    await settle();
    expect(element.value).toBe('Uru');
    expect(field(element).value).toBe('Uru');
    expect(texts(element)).toEqual(['Uruguay']);
    expect(seen).toEqual([]);
  });

  it('required with no text is valueMissing, with the message of a text field, and the saved state is the text', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount(`${FREE} name="location" required`, places(), form);
    expect(element.validity.valueMissing).toBe(true);
    expect(element.validationMessage).not.toBe('');
    await type(element, 'a');
    expect(element.validity.valid).toBe(true);
    element.formStateRestoreCallback('Oslo');
    await settle();
    expect(element.value).toBe('Oslo');
    expect(field(element).value).toBe('Oslo');
  });

  it('a disabled fieldset disables it: out of the form data, no list, no clear button', async () => {
    const form = document.createElement('form');
    form.innerHTML = '<fieldset disabled></fieldset>';
    document.body.append(form);
    const element = await mount(`${FREE} name="location" value="Lisbon" clearable clear-label="Clear"`, places(), form.querySelector('fieldset') as HTMLElement);
    expect(new FormData(form).has('location')).toBe(false);
    expect(field(element).disabled).toBe(true);
    expect(clearButton(element)).toBeNull();
  });
});

describe('free text: events', () => {
  it('the native input of the field is the input of the host, once per keystroke, with the value already up to date', async () => {
    const element = await mount();
    const seen = record(element, ['input']);
    document.addEventListener('input', () => seen.push('document'), { once: true });
    await type(element, 'Br');
    expect(seen).toEqual(['input:B', 'document', 'input:Br']);
  });

  it('change waits for the text to settle: not while typing, once on Enter, and not again when nothing moved', async () => {
    const element = await mount();
    const seen = record(element, ['change']);
    await type(element, 'Bra');
    expect(seen).toEqual([]);
    await press(element, '{Enter}');
    expect(seen).toEqual(['change:Bra']);
    expect(element.open).toBe(false);
    expect(element.value).toBe('Bra');
    (document.body.appendChild(document.createElement('button'))).focus();
    await settle();
    expect(seen).toEqual(['change:Bra']);
  });

  it('a text that comes back to the last settled one fires no change', async () => {
    const element = await mount(`${FREE} value="Rio"`);
    const seen = record(element, ['change']);
    await type(element, 'x{Backspace}');
    (document.body.appendChild(document.createElement('button'))).focus();
    await settle();
    expect(element.value).toBe('Rio');
    expect(seen).toEqual([]);
  });

  it('nph-search says the text once per change, also when a pick or the clear button changes it', async () => {
    const element = await mount(`${FREE} clearable clear-label="Clear"`);
    const seen = record(element, ['nph-search']);
    await type(element, 'Un');
    await press(element, '{ArrowDown}{Enter}');
    expect(element.value).toBe('United Kingdom');
    await userEvent.click(clearButton(element) as HTMLButtonElement);
    await settle();
    expect(seen).toEqual(['nph-search:U', 'nph-search:Un', 'nph-search:United Kingdom', 'nph-search:']);
  });
});

describe('free text: keyboard', () => {
  it('typing opens the list with the matches highlighted and no suggestion active', async () => {
    const element = await mount();
    await type(element, 'Uni');
    expect(element.open).toBe(true);
    expect(field(element).getAttribute('aria-expanded')).toBe('true');
    expect(texts(element)).toEqual(['United Kingdom', 'United States', 'Unity']);
    expect(activeOf(element)).toBeNull();
    expect(rows(element).some((item) => item.active)).toBe(false);
    expect(row(element, 'United States').querySelector('.match')?.textContent).toBe('Uni');
    await type(element, 't');
    expect(activeOf(element)).toBeNull();
  });

  it('ArrowDown activates the first suggestion, moves, stops at the end, and the field text does not change', async () => {
    const element = await mount();
    await type(element, 'Uni');
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(row(element, 'United Kingdom'));
    await press(element, '{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(activeOf(element)).toBe(row(element, 'Unity'));
    expect(field(element).value).toBe('Uni');
    await press(element, '{ArrowUp}');
    expect(activeOf(element)).toBe(row(element, 'United States'));
  });

  it('typing again drops the active suggestion', async () => {
    const element = await mount();
    await type(element, 'Uni');
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).not.toBeNull();
    await press(element, 't');
    expect(activeOf(element)).toBeNull();
  });

  it('with the list closed, ArrowDown opens on the first suggestion and ArrowUp on the last', async () => {
    const element = await mount(`${FREE} value="Uni"`);
    await focus(element);
    await press(element, '{ArrowDown}');
    expect(element.open).toBe(true);
    expect(activeOf(element)).toBe(row(element, 'United Kingdom'));
    await press(element, '{Escape}');
    expect(element.open).toBe(false);
    expect(element.value).toBe('Uni');
    await press(element, '{ArrowUp}');
    expect(element.open).toBe(true);
    expect(activeOf(element)).toBe(row(element, 'Unity'));
  });

  it('Alt+ArrowDown opens without activating any suggestion', async () => {
    const element = await mount();
    await focus(element);
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    expect(element.open).toBe(true);
    expect(activeOf(element)).toBeNull();
    expect(texts(element)).toEqual(PLACES);
  });

  it('with the text in the field, the arrows show only the suggestions that contain it (DSA-79 D-2)', async () => {
    const element = await mount(`${FREE} value="Bra"`);
    await focus(element);
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    expect(texts(element)).toEqual(['Brazil']);
  });

  it('Enter picks the active suggestion: its text, not its value, goes to the field; input and change run, and the list closes', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const submitted = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submitted);
    const element = await mount(`${FREE} name="location"`, places(), form);
    const seen = record(element, ['input', 'change']);
    await type(element, 'Uni');
    await press(element, '{ArrowDown}{ArrowDown}{Enter}');
    await wait(10);
    expect(element.value).toBe('United States');
    expect(field(element).value).toBe('United States');
    expect(new FormData(form).get('location')).toBe('United States');
    expect(element.open).toBe(false);
    expect(seen).toEqual(['input:U', 'input:Un', 'input:Uni', 'input:United States', 'change:United States']);
    expect(submitted).not.toHaveBeenCalled();
  });

  it('Enter with no active suggestion keeps the text and closes the list, and does not submit', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const submitted = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submitted);
    const element = await mount(FREE, places(), form);
    await type(element, 'Uni');
    await press(element, '{Enter}');
    await wait(10);
    expect(element.value).toBe('Uni');
    expect(element.open).toBe(false);
    expect(submitted).not.toHaveBeenCalled();
    await press(element, '{Enter}');
    await wait(10);
    expect(submitted).toHaveBeenCalledTimes(1);
  });

  it('Enter with the list closed passes on, and the text settles before the form submits', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const order: string[] = [];
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      order.push('submit');
    });
    const element = await mount(FREE, places(), form);
    element.addEventListener('change', () => order.push('change'));
    /* No suggestion contains the text, so the list is already closed: Enter passes on. */
    await type(element, 'zz');
    expect(element.open).toBe(false);
    await press(element, '{Enter}');
    await wait(10);
    expect(order).toEqual(['change', 'submit']);
  });

  it('Alt+ArrowUp with a suggestion active picks it, as Enter does', async () => {
    const element = await mount();
    await type(element, 'Uni');
    await press(element, '{ArrowDown}{Alt>}{ArrowUp}{/Alt}');
    expect(element.value).toBe('United Kingdom');
    expect(element.open).toBe(false);
  });

  it('Escape closes the open list and keeps the text; with the list closed it clears the text with input and change; with no text it passes on', async () => {
    const element = await mount();
    await type(element, 'Uni');
    const bubbled = vi.fn();
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') bubbled();
    };
    document.addEventListener('keydown', onKeydown);
    try {
      await press(element, '{Escape}');
      expect(element.open).toBe(false);
      expect(element.value).toBe('Uni');
      expect(bubbled).not.toHaveBeenCalled();
      /* Enter with the list closed settles the text: the clear below then moves it off the settled one. */
      await press(element, '{Enter}');
      const seen = record(element, ['input', 'change']);
      await press(element, '{Escape}');
      expect(element.value).toBe('');
      expect(field(element).value).toBe('');
      expect(seen).toEqual(['input:', 'change:']);
      expect(bubbled).not.toHaveBeenCalled();
      await press(element, '{Escape}');
      expect(bubbled).toHaveBeenCalledTimes(1);
    } finally {
      document.removeEventListener('keydown', onKeydown);
    }
  });

  it('Page Down and Page Up jump ten, and a disabled suggestion is skipped', async () => {
    const entries = places();
    (entries[1] as { disabled?: boolean }).disabled = true;
    const element = await mount(FREE, entries);
    await focus(element);
    await press(element, '{ArrowDown}{ArrowDown}');
    expect(activeOf(element)).toBe(row(element, 'Uruguay'));
    await press(element, '{PageDown}');
    expect(activeOf(element)).toBe(row(element, 'Canada'));
    await press(element, '{PageUp}');
    expect(activeOf(element)).toBe(row(element, 'United Kingdom'));
  });

  it('a click on the field only takes the focus; it does not open the list (DSA-79 D-1)', async () => {
    const element = await mount();
    await userEvent.click(field(element));
    await settle();
    expect(element.open).toBe(false);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
  });

  it('a click on a suggestion puts its text in the field, closes the list and keeps the focus on the field', async () => {
    const element = await mount();
    await type(element, 'Uni');
    const seen = record(element, ['change']);
    await userEvent.click(row(element, 'Unity'));
    await settle();
    expect(element.value).toBe('Unity');
    expect(element.open).toBe(false);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    expect(seen).toEqual(['change:Unity']);
  });

  it('the pointer over a suggestion makes it active, and the keyboard goes on from there (DSA-45 D-6)', async () => {
    const element = await mount();
    await type(element, 'Uni');
    await userEvent.hover(row(element, 'United States'));
    await settle();
    expect(activeOf(element)).toBe(row(element, 'United States'));
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(row(element, 'Unity'));
  });

  it('a suggestion equal to the text shows as chosen, with the check, and the others do not', async () => {
    const element = await mount(`${FREE} value="Unity"`);
    await focus(element);
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    expect(rows(element).map((item) => [item.textContent?.trim(), item.selected])).toEqual([['Unity', true]]);
    element.value = 'Canada';
    await settle();
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    expect(row(element, 'Canada').selected).toBe(true);
  });
});

describe('free text: no suggestion', () => {
  it('the list closes with no nph-empty and a status region says there is no suggestion, until the text has one again', async () => {
    const element = await mount(`${FREE} empty-heading="Nothing found"`);
    expect(announced(element)).toBe('');
    await type(element, 'zzz');
    expect(element.open).toBe(false);
    expect(element.shadowRoot?.querySelector('nph-empty')).toBeNull();
    expect(announced(element)).toBe('No suggestions');
    expect(element.shadowRoot?.querySelector('.announce')?.getAttribute('role')).toBe('status');
    expect(element.value).toBe('zzz');
    await press(element, '{Backspace}{Backspace}{Backspace}B');
    expect(announced(element)).toBe('');
    expect(element.open).toBe(true);
    expect(texts(element)).toEqual(['Brazil']);
  });

  it('the region is outside the list, so it speaks while the list is closed, and it is quiet at rest, after leaving and when the text is empty', async () => {
    const element = await mount(`${FREE} value="zzz"`);
    expect(announced(element)).toBe('');
    await type(element, 'z');
    expect(announced(element)).toBe('No suggestions');
    expect(list(element).contains(element.shadowRoot?.querySelector('.announce') ?? null)).toBe(false);
    (document.body.appendChild(document.createElement('button'))).focus();
    await settle();
    expect(announced(element)).toBe('');
    await focus(element);
    await press(element, '{Backspace}{Backspace}{Backspace}{Backspace}');
    expect(announced(element)).toBe('');
  });

  it('the region is in the accessibility tree as a status', async () => {
    const element = await mount();
    await type(element, 'zzz');
    const node = await accessibleNodeOf(element.shadowRoot?.querySelector('.announce') as Element);
    expect(node.role?.value).toBe('status');
    expect(node.name?.value ?? '').toBe('');
  });

  it('a consumer that suggests with filter none says there is no suggestion when it answers with none', async () => {
    const element = await mount(`${FREE} filter="none"`, []);
    element.addEventListener('nph-search', () => {
      element.options = [];
    });
    await type(element, 'qq');
    expect(element.open).toBe(false);
    expect(announced(element)).toBe('No suggestions');
  });

  it('answers that arrive late reopen the list for a person still typing, and not after Escape', async () => {
    const element = await mount(`${FREE} filter="none"`, []);
    await type(element, 'Br');
    expect(element.open).toBe(false);
    /* A server that does not set loading: the region says there is no suggestion while it waits. */
    expect(announced(element)).toBe('No suggestions');
    element.options = [{ value: 'a', text: 'Brazil' }];
    await settle();
    expect(element.open).toBe(true);
    expect(announced(element)).toBe('');
    expect(activeOf(element)).toBeNull();
    await press(element, '{Escape}');
    element.options = [{ value: 'a', text: 'Brazil' }, { value: 'b', text: 'Brest' }];
    await settle();
    expect(element.open).toBe(false);
  });
});

function list(element: NphCombobox): HTMLElement {
  const box = element.shadowRoot?.querySelector<HTMLElement>('.list');
  if (!box) throw new Error('no list');
  return box;
}

describe('free text: loading and IME', () => {
  it('loading shows the named spinner in the list with aria-busy, and the answer comes with no suggestion active', async () => {
    const element = await mount(`${FREE} filter="none" loading-label="Searching"`, []);
    element.addEventListener('nph-search', () => {
      element.loading = true;
    });
    await type(element, 'Br');
    expect(element.open).toBe(true);
    const spinner = element.shadowRoot?.querySelector('nph-spinner') as HTMLElement & { label: string };
    expect(spinner.label).toBe('Searching');
    expect(list(element).getAttribute('aria-busy')).toBe('true');
    /* The busy list does not hide the name of its spinner from the accessibility tree. */
    const spinnerNode = await accessibleNodeOf(spinner);
    expect(spinnerNode.name?.value).toBe('Searching');
    expect(announced(element)).toBe('');
    element.options = [{ value: 'a', text: 'Brazil' }];
    element.loading = false;
    await settle();
    expect(list(element).hasAttribute('aria-busy')).toBe(false);
    expect(texts(element)).toEqual(['Brazil']);
    expect(activeOf(element)).toBeNull();
  });

  it('the arrow variant keeps no aria-busy: the loading attribute of the list is a free text rule', async () => {
    const element = await mount('label="Country" loading loading-label="Searching"');
    element.open = true;
    await settle();
    expect(list(element).hasAttribute('aria-busy')).toBe(false);
  });

  it('an IME composition updates the value but does not suggest, search or open until it ends', async () => {
    const element = await mount();
    await focus(element);
    const searched = record(element, ['nph-search']);
    const inputs = record(element, ['input']);
    field(element).dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, composed: true }));
    field(element).value = 'Uni';
    field(element).dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, isComposing: true }));
    await settle();
    expect(element.value).toBe('Uni');
    expect(element.open).toBe(false);
    expect(searched).toEqual([]);
    expect(inputs).toEqual(['input:Uni']);
    field(element).dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, composed: true, data: 'Uni' }));
    await settle();
    expect(element.open).toBe(true);
    expect(searched).toEqual(['nph-search:Uni']);
    expect(texts(element)).toEqual(['United Kingdom', 'United States', 'Unity']);
  });
});

describe('free text: the clear button', () => {
  it('shows when there is text, is named by clear-label, clears the text, closes the list and returns the focus to the field', async () => {
    const element = await mount(`${FREE} clearable clear-label="Clear location" value="Unity"`);
    const button = clearButton(element) as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Clear location');
    await focus(element);
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    expect(element.open).toBe(true);
    const seen = record(element, ['input', 'change']);
    await userEvent.click(button);
    await settle();
    expect(element.value).toBe('');
    expect(field(element).value).toBe('');
    expect(element.open).toBe(false);
    expect(seen).toEqual(['input:', 'change:']);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    expect(clearButton(element)).toBeNull();
  });

  it('is not drawn without clear-label, and not when the field is disabled', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount(`${FREE} clearable value="Unity"`);
    expect(clearButton(element)).toBeNull();
    expect(error.mock.calls.some((call) => String(call[0]).includes('clear-label'))).toBe(true);
    const disabled = await mount(`${FREE} clearable clear-label="Clear" value="Unity" disabled`);
    expect(clearButton(disabled)).toBeNull();
  });
});

describe('free text: states and precedence', () => {
  it('focus: focus/border with the focus/halo outside; open keeps it', async () => {
    const element = await mount();
    await focus(element);
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(getComputedStyle(control(element), '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border'));
  });

  it('error with focus keeps status/error with focus/halo-error; disabled wins over error', async () => {
    const element = await mount(`${FREE} invalid`);
    await focus(element);
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-status-error'));
    expect(getComputedStyle(control(element), '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
    const disabled = await mount(`${FREE} invalid disabled value="Unity"`);
    expect(getComputedStyle(control(disabled)).backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
    expect(getComputedStyle(control(disabled)).borderTopColor).toBe(resolved('color', '--nph-color-input'));
    expect(getComputedStyle(disabled).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('a disabled suggestion equal to the text keeps color/primary-surface and the check (DSA-29 D-3)', async () => {
    const element = await mount(`${FREE} value="Unity"`, [{ value: 'u', text: 'Unity', disabled: true }]);
    await focus(element);
    await press(element, '{Alt>}{ArrowDown}{/Alt}');
    const option = row(element, 'Unity');
    expect(option.selected).toBe(true);
    expect(option.hasAttribute('disabled')).toBe(true);
    expect(getComputedStyle(option).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
  });

  it('the focus on the clear button keeps the resting border of the field', async () => {
    const element = await mount(`${FREE} clearable clear-label="Clear" value="Unity"`);
    await focus(element);
    await press(element, '{Tab}');
    expect(element.shadowRoot?.activeElement).toBe(clearButton(element));
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-color-input'));
  });
});

describe('free text: accessibility tree', () => {
  it('the field is a combobox with list autocomplete that controls the listbox, and points to the active suggestion', async () => {
    const element = await mount();
    const node = await accessibleNodeOf(field(element));
    expect(node.role?.value).toBe('combobox');
    expect(node.name?.value).toBe('Location');
    const input = field(element);
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-controls')).toBe(element.shadowRoot?.querySelector('.listbox')?.id);
    await type(element, 'Uni');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
    await press(element, '{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).toBe(row(element, 'United Kingdom').id);
    const option = await accessibleNodeOf(row(element, 'United Kingdom'));
    expect(option.role?.value).toBe('option');
    expect(option.name?.value).toBe('United Kingdom');
  });

  it('inside nph-field, the label names the field and the clear button is a named button', async () => {
    const holder = document.createElement('div');
    holder.innerHTML = `<nph-field label="Event location"><nph-combobox free-text no-suggestions-label="No suggestions" clearable clear-label="Clear" value="Unity"></nph-combobox></nph-field>`;
    document.body.append(holder);
    const element = holder.querySelector('nph-combobox') as NphCombobox;
    element.options = places();
    await settle(holder);
    await wait(50);
    const node = await accessibleNodeOf(field(element));
    expect(node.name?.value).toBe('Event location');
    const button = await accessibleNodeOf(clearButton(element) as HTMLButtonElement);
    expect(button.role?.value).toBe('button');
    expect(button.name?.value).toBe('Clear');
  });
});

describe('free text: token contract', () => {
  const strip = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '');

  it('the end padding is the token of the evidence, generated as an alias of space/control-padding, and the CSS consumes it once', () => {
    expect(tokensCss).toMatch(/--nph-combobox-free-text-padding-end:\s*var\(--nph-space-control-padding\)/);
    const used = [...strip(componentCss).matchAll(/var\((--nph-combobox-free-text-padding-end)\)/g)];
    expect(used).toHaveLength(1);
    expect(strip(componentCss)).toMatch(/:host\(\[free-text\]\) \.control\s*\{[^}]*padding-inline-end:\s*var\(--nph-combobox-free-text-padding-end\)/);
  });

  it('design.md says the use of space/control-padding includes the end padding of the free text field', () => {
    expect(designMd).toContain('combobox/free-text-padding-end');
    expect(designMd).toMatch(/end padding of the nph-combobox free text field, with and without the clear button/);
  });

  it('the variant adds exactly two properties to the reactive API: freeText and noSuggestionsLabel', () => {
    const declared = [...(NphCombobox as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.filter((name) => ['freeText', 'noSuggestionsLabel'].includes(name)).sort()).toEqual(['freeText', 'noSuggestionsLabel']);
    expect(declared).not.toContain('variant');
  });
});
