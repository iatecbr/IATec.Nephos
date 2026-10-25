/**
 * Tests of `nph-radio` (P82), in a real browser (P21, item 5): resolved color, real
 * hover, keyboard focus, the Tab order, forms and measures only exist where there is
 * layout.
 *
 * They prove the contract accepted in Figma (frame `1196:311`, set `848:66`) and the
 * decisions D1 to D5 of DSA-18: the API, the semantics read from the browser
 * accessibility tree, the group by name, the person checking it by pointer and keyboard,
 * the native events, the form, the measures, the colors and the focus in both schemes,
 * the motion, the invalid input, the composition warnings and the token contract.
 *
 * Color schemes are switched at the root (`data-nph-color-scheme` on `html`). In a part
 * of the screen with another brand and another scheme, the brand and the scheme go on the
 * same element (P67).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-radio.css?raw';
import '../nph-field/nph-field';
import { NPH_RADIO_DEFAULT_VALUE, NphRadio } from './nph-radio';

interface RadioSpec {
  text?: string;
  label?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  checkedAttribute?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

const SHIFTS: RadioSpec[] = [
  { name: 'shift', value: 'morning', text: 'Morning' },
  { name: 'shift', value: 'afternoon', text: 'Afternoon' },
  { name: 'shift', value: 'night', text: 'Night' },
];

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

function radio(spec: RadioSpec): NphRadio {
  const element = document.createElement('nph-radio');
  if (spec.checkedAttribute) element.setAttribute('checked', '');
  if (spec.text !== undefined) element.text = spec.text;
  if (spec.label !== undefined) element.label = spec.label;
  if (spec.name !== undefined) element.name = spec.name;
  if (spec.value !== undefined) element.value = spec.value;
  if (spec.checked !== undefined) element.checked = spec.checked;
  if (spec.disabled) element.disabled = true;
  if (spec.invalid) element.invalid = true;
  return element;
}

async function settle(radios: NphRadio[]): Promise<void> {
  await Promise.all(radios.map((element) => element.updateComplete));
}

async function mount(spec: RadioSpec = { text: 'Card', name: 'payment' }, parent: Node = document.body): Promise<NphRadio> {
  const element = radio(spec);
  parent.appendChild(element);
  await element.updateComplete;
  return element;
}

async function mountGroup(specs: RadioSpec[] = SHIFTS, parent: Node = document.body): Promise<NphRadio[]> {
  const radios = specs.map(radio);
  for (const element of radios) parent.appendChild(element);
  await settle(radios);
  return radios;
}

function part(element: NphRadio, selector: string): HTMLElement {
  const found = element.shadowRoot?.querySelector<HTMLElement>(selector);
  if (!found) throw new Error(`no ${selector}`);
  return found;
}

const circle = (element: NphRadio): HTMLElement => part(element, '.circle');
const dot = (element: NphRadio): HTMLElement => part(element, '.dot');
const target = (element: NphRadio): HTMLElement => part(element, '.target');
const textOf = (element: NphRadio): HTMLElement => part(element, '.text');

function checkedOf(radios: NphRadio[]): boolean[] {
  return radios.map((element) => element.checked);
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

/** Records the `input` and `change` events of an element, in order. */
function listen(element: EventTarget): string[] {
  const seen: string[] = [];
  element.addEventListener('input', () => seen.push('input'));
  element.addEventListener('change', () => seen.push('change'));
  return seen;
}

/** Brands read from the generated CSS; the default is the `:root` one. */
const DEFAULT_BRAND = /:root,\s*\[data-nph-brand="([\w-]+)"\]/.exec(tokensCss)?.[1] ?? '';
const BRANDS = [...new Set([...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? ''))];
const OTHER_BRAND = BRANDS.find((brand) => brand !== DEFAULT_BRAND) ?? '';

/** A part of the screen with a brand and a scheme on the same element (P67). */
function scope(brand = OTHER_BRAND, scheme: 'light' | 'dark' = 'dark'): HTMLElement {
  const element = document.createElement('div');
  element.setAttribute('data-nph-brand', brand);
  element.setAttribute('data-nph-color-scheme', scheme);
  document.body.append(element);
  return element;
}

/** WCAG relative luminance and contrast ratio, from computed `rgb()` colors. */
function luminance(color: string): number {
  const [r = 0, g = 0, b = 0] = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map((channel) => {
    const value = Number(channel) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** The items of a computed comma list; commas inside `cubic-bezier(...)` do not split. */
function listOf(value: string): string[] {
  return value.split(/,\s(?![^(]*\))/);
}

/** The color and the spread of the one `box-shadow` layer, or `none`. */
function halo(element: HTMLElement): { color: string; spread: string } | 'none' {
  const value = getComputedStyle(element).boxShadow;
  if (value === 'none') return 'none';
  const color = value.match(/rgba?\([^)]*\)/)?.[0] ?? '';
  const lengths = value.replace(color, '').trim().split(/\s+/);
  return { color, spread: lengths[3] ?? '' };
}

interface AxNode {
  role: string;
  name: string;
  checked: string;
  disabled: boolean;
  invalid: string;
}

/**
 * The node the browser itself computes for an element in its accessibility tree. The
 * role and the state come from `ElementInternals`, which a DOM library cannot read.
 */
async function ax(element: Element): Promise<AxNode> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    /* The tests run in a frame: look the element up through the DOM domain, piercing into it. */
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]' });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    const node = nodes[0];
    const property = (name: string): unknown => node?.properties?.find((entry: { name: string }) => entry.name === name)?.value?.value;
    return {
      role: String(node?.role?.value ?? ''),
      name: String(node?.name?.value ?? ''),
      checked: String(property('checked') ?? ''),
      disabled: property('disabled') === true,
      invalid: String(property('invalid') ?? ''),
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

/** Waits one animation frame, the delay of the composition check. */
async function frame(): Promise<void> {
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
}

describe('registration and API', () => {
  it('defines nph-radio only once', () => {
    expect(customElements.get('nph-radio')).toBe(NphRadio);
  });

  it('the public API is exactly the one in P82', () => {
    const declared = Object.keys(Object.fromEntries((NphRadio as unknown as { elementProperties: Map<string, unknown> }).elementProperties));
    expect(new Set(declared)).toEqual(new Set(['checked', 'disabled', 'invalid', 'name', 'value', 'text', 'label']));
  });

  it('the defaults: unchecked, enabled, valid, no name, value on, no text and no label', () => {
    const element = document.createElement('nph-radio');
    expect([element.checked, element.disabled, element.invalid, element.name, element.value, element.text, element.label]).toEqual([
      false,
      false,
      false,
      '',
      NPH_RADIO_DEFAULT_VALUE,
      '',
      '',
    ]);
    expect(NPH_RADIO_DEFAULT_VALUE).toBe('on');
  });

  it('is form-associated and declares its role for nph-field (P83)', () => {
    expect((NphRadio as unknown as { formAssociated?: boolean }).formAssociated).toBe(true);
    expect((NphRadio as unknown as { nphFieldRole?: string }).nphFieldRole).toBe('radio');
  });

  it('name, value, disabled and invalid reflect; checked, text and label do not; an empty name writes no attribute', async () => {
    const element = await mount({ text: 'Card', name: 'payment', value: 'card', disabled: true, invalid: true });
    element.checked = true;
    await element.updateComplete;
    expect(element.getAttribute('name')).toBe('payment');
    expect(element.getAttribute('value')).toBe('card');
    expect(element.hasAttribute('disabled')).toBe(true);
    expect(element.hasAttribute('invalid')).toBe(true);
    expect(element.hasAttribute('checked')).toBe(false);
    expect(element.hasAttribute('text')).toBe(false);
    expect(element.hasAttribute('label')).toBe(false);
    element.name = '';
    await element.updateComplete;
    expect(element.hasAttribute('name')).toBe(false);
  });

  it('has open Shadow DOM, no slot, no part, and no other focusable element inside', async () => {
    const element = await mount();
    expect(element.shadowRoot?.mode).toBe('open');
    expect(element.shadowRoot?.querySelector('slot, [part]')).toBeNull();
    expect(element.shadowRoot?.querySelectorAll('a, button, input, select, textarea, [tabindex]').length).toBe(0);
  });

  it('has no size, indeterminate, required or color property', () => {
    const declared = [...(NphRadio as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['size', 'indeterminate', 'required', 'color', 'variant', 'state']) {
      expect(declared).not.toContain(name);
    }
  });

  it('declares no own event in the global event map', () => {
    /* Typed proof: `nph-change` stays the one of nph-togglebutton; the radio fires native events. */
    const event: HTMLElementEventMap['change'] = new Event('change');
    expect(event.type).toBe('change');
  });
});

describe('semantics, read from the browser accessibility tree', () => {
  it('the host is a radio, named by its text, with its state', async () => {
    const element = await mount({ text: 'Credit card', name: 'payment' });
    expect(await ax(element)).toMatchObject({ role: 'radio', name: 'Credit card', checked: 'false', disabled: false });
    element.checked = true;
    await element.updateComplete;
    expect((await ax(element)).checked).toBe('true');
  });

  it('without text, the name is label, and the label is never visible', async () => {
    const element = await mount({ label: 'Pix', name: 'payment' });
    expect(await ax(element)).toMatchObject({ role: 'radio', name: 'Pix' });
    expect(element.shadowRoot?.querySelector('.text')).toBeNull();
    expect(element.shadowRoot?.textContent?.trim()).toBe('');
  });

  it('with text, the text is the name and label is not used', async () => {
    const element = await mount({ text: 'Pix', label: 'Something else', name: 'payment' });
    expect((await ax(element)).name).toBe('Pix');
  });

  it('a name the consumer puts on the host also counts', async () => {
    const element = radio({ name: 'payment' });
    element.setAttribute('aria-label', 'Boleto');
    document.body.append(element);
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect((await ax(element)).name).toBe('Boleto');
  });

  it('disabled is announced', async () => {
    const element = await mount({ text: 'Card', name: 'payment', disabled: true });
    expect((await ax(element)).disabled).toBe(true);
  });

  it('invalid stays visual: no aria-invalid on the radio role', async () => {
    const element = await mount({ text: 'Card', name: 'payment', invalid: true });
    const node = await ax(element);
    expect(['', 'false']).toContain(node.invalid);
    expect(element.hasAttribute('aria-invalid')).toBe(false);
  });

  it('a <label for> names the radio and is one of its labels', async () => {
    const label = document.createElement('label');
    label.htmlFor = 'pix';
    label.textContent = 'Pix';
    document.body.append(label);
    const element = radio({ label: 'Pix', name: 'payment' });
    element.id = 'pix';
    document.body.append(element);
    await element.updateComplete;
    expect([...element.labels]).toEqual([label]);
  });
});

describe('the group', () => {
  it('checking one unchecks the others with the same name in the same root', async () => {
    const radios = await mountGroup();
    radios[0]!.checked = true;
    expect(checkedOf(radios)).toEqual([true, false, false]);
    radios[2]!.checked = true;
    expect(checkedOf(radios)).toEqual([false, false, true]);
  });

  it('a change from code fires no event', async () => {
    const radios = await mountGroup();
    const seen = listen(document.body);
    radios[1]!.checked = true;
    radios[1]!.checked = false;
    expect(seen).toEqual([]);
  });

  it('radios with another name are another group', async () => {
    const shifts = await mountGroup();
    const other = await mount({ text: 'Card', name: 'payment', checked: true });
    shifts[0]!.checked = true;
    expect(other.checked).toBe(true);
  });

  it('radios in different roots are different groups', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const outside = await mount({ text: 'Morning', name: 'shift', checked: true });
    const inside = await mount({ text: 'Night', name: 'shift' }, shadow);
    inside.checked = true;
    expect([outside.checked, inside.checked]).toEqual([true, true]);
  });

  it('radios in different forms are different groups', async () => {
    const first = document.createElement('form');
    const second = document.createElement('form');
    document.body.append(first, second);
    const a = await mount({ text: 'Morning', name: 'shift', checked: true }, first);
    const b = await mount({ text: 'Night', name: 'shift' }, second);
    b.checked = true;
    expect([a.checked, b.checked]).toEqual([true, true]);
  });

  it('without a name, a radio is a group of one', async () => {
    const a = await mount({ text: 'Morning', checked: true });
    const b = await mount({ text: 'Night' });
    b.checked = true;
    expect([a.checked, b.checked]).toEqual([true, true]);
  });

  it('two checked in the markup: the last one wins', async () => {
    const box = document.createElement('div');
    box.innerHTML = `
      <nph-radio name="shift" text="Morning" checked></nph-radio>
      <nph-radio name="shift" text="Afternoon" checked></nph-radio>
      <nph-radio name="shift" text="Night"></nph-radio>`;
    document.body.append(box);
    const radios = [...box.querySelectorAll('nph-radio')];
    await settle(radios);
    expect(checkedOf(radios)).toEqual([false, true, false]);
  });

  it('two checked in the markup with checked before name: the last one still wins', async () => {
    const box = document.createElement('div');
    box.innerHTML = `
      <nph-radio checked name="shift" text="Morning"></nph-radio>
      <nph-radio checked name="shift" text="Afternoon"></nph-radio>
      <nph-radio name="shift" text="Night"></nph-radio>`;
    document.body.append(box);
    const radios = [...box.querySelectorAll('nph-radio')];
    await settle(radios);
    expect(checkedOf(radios)).toEqual([false, true, false]);
  });

  it('a change of name off the page settles the group at once, and the radio renamed last wins', async () => {
    const box = document.createElement('div');
    const a = radio({ name: 'shift', text: 'Morning', checked: true });
    const b = radio({ name: 'payment', text: 'Card', checked: true });
    box.append(a, b);
    b.name = 'shift';
    expect([a.checked, b.checked]).toEqual([false, true]);
    b.setAttribute('name', 'payment');
    a.checked = true;
    expect([a.checked, b.checked]).toEqual([true, true]);
    a.setAttribute('name', 'payment');
    expect([a.checked, b.checked]).toEqual([true, false]);
    document.body.append(box);
    await settle([a, b]);
    expect([a.checked, b.checked]).toEqual([true, false]);
  });

  it('a checked radio that arrives unchecks the group it joins', async () => {
    const radios = await mountGroup([{ ...SHIFTS[0], checked: true }, SHIFTS[1]!]);
    const arriving = radio({ ...SHIFTS[2], checkedAttribute: true });
    document.body.append(arriving);
    await arriving.updateComplete;
    expect([...checkedOf(radios), arriving.checked]).toEqual([false, false, true]);
  });

  it('checked radios that connect in one batch: the last one to connect wins', async () => {
    const box = document.createElement('div');
    const a = radio({ name: 'shift', text: 'Morning', checked: true });
    const b = radio({ name: 'shift', text: 'Night', checked: true });
    box.append(a, b);
    document.body.append(box);
    await settle([a, b]);
    expect([a.checked, b.checked]).toEqual([false, true]);
    /* A checked radio that arrives later still unchecks the registered ones. */
    const c = radio({ name: 'shift', text: 'Afternoon', checked: true });
    box.prepend(c);
    await c.updateComplete;
    expect([c.checked, a.checked, b.checked]).toEqual([true, false, false]);
  });

  it('checked radios that connect in one batch inside a form: the last one wins, and the form sends it', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const box = document.createElement('div');
    const a = radio({ name: 'shift', value: 'morning', text: 'Morning', checked: true });
    const b = radio({ name: 'shift', value: 'night', text: 'Night', checked: true });
    box.append(a, b);
    form.append(box);
    await settle([a, b]);
    expect([a.checked, b.checked]).toEqual([false, true]);
    expect([...new FormData(form).entries()]).toEqual([['shift', 'night']]);
  });

  it('a change of name moves the radio to another group', async () => {
    const radios = await mountGroup([{ ...SHIFTS[0], checked: true }, SHIFTS[1]!]);
    const moving = await mount({ text: 'Card', name: 'payment', checked: true });
    moving.name = 'shift';
    await settle([...radios, moving]);
    expect([...checkedOf(radios), moving.checked]).toEqual([false, false, true]);
  });
});

describe('the person checks it', () => {
  it('a click on the circle checks it and fires input then change, once', async () => {
    const radios = await mountGroup();
    const seen = listen(radios[1]!);
    await userEvent.click(circle(radios[1]!));
    expect(checkedOf(radios)).toEqual([false, true, false]);
    expect(seen).toEqual(['input', 'change']);
  });

  it('a click on the text checks it too', async () => {
    const radios = await mountGroup();
    await userEvent.click(textOf(radios[2]!));
    expect(checkedOf(radios)).toEqual([false, false, true]);
  });

  it('a click on the checked radio changes nothing and fires nothing, but the click still bubbles', async () => {
    const radios = await mountGroup([{ ...SHIFTS[0], checked: true }, SHIFTS[1]!, SHIFTS[2]!]);
    const seen = listen(document.body);
    const clicks: EventTarget[] = [];
    document.body.addEventListener('click', (event) => clicks.push(event.target as EventTarget));
    await userEvent.click(circle(radios[0]!));
    expect(checkedOf(radios)).toEqual([true, false, false]);
    expect(seen).toEqual([]);
    expect(clicks).toEqual([radios[0]]);
  });

  it('the events: input bubbles and is composed; change bubbles and is not; neither is cancelable', async () => {
    const element = await mount();
    const events: Event[] = [];
    element.addEventListener('input', (event) => events.push(event));
    element.addEventListener('change', (event) => events.push(event));
    element.click();
    expect(events.map((event) => [event.type, event.bubbles, event.composed, event.cancelable])).toEqual([
      ['input', true, true, false],
      ['change', true, false, false],
    ]);
    expect(events[0]?.target).toBe(element);
  });

  it('the input event crosses the shadow root of a host around the radio', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const element = await mount({ text: 'Card', name: 'payment' }, shadow);
    const seen = listen(host);
    element.click();
    expect(seen).toEqual(['input']);
  });

  it('click() on the host and a click on a <label for> check it', async () => {
    const radios = await mountGroup();
    radios[1]!.click();
    expect(checkedOf(radios)).toEqual([false, true, false]);
    const label = document.createElement('label');
    label.htmlFor = 'night';
    label.textContent = 'Night shift';
    radios[2]!.id = 'night';
    document.body.append(label);
    await userEvent.click(label);
    expect(checkedOf(radios)).toEqual([false, false, true]);
  });

  it('a disabled radio is not checked, fires nothing and stops the click', async () => {
    const element = await mount({ text: 'Card', name: 'payment', disabled: true });
    const seen = listen(document.body);
    const clicks: Event[] = [];
    document.body.addEventListener('click', (event) => clicks.push(event));
    element.click();
    expect(element.checked).toBe(false);
    expect(seen).toEqual([]);
    expect(clicks).toEqual([]);
  });

  it('the event finds the new state already set', async () => {
    const radios = await mountGroup();
    const states: boolean[][] = [];
    radios[2]!.addEventListener('change', () => states.push(checkedOf(radios)));
    radios[2]!.click();
    expect(states).toEqual([[false, false, true]]);
  });
});

describe('keyboard (APG Radio Group)', () => {
  async function before(): Promise<HTMLInputElement> {
    const input = document.createElement('input');
    document.body.prepend(input);
    input.focus();
    return input;
  }

  it('one Tab stop per group: on the checked radio', async () => {
    const radios = await mountGroup([SHIFTS[0]!, { ...SHIFTS[1], checked: true }, SHIFTS[2]!]);
    const after = document.createElement('input');
    document.body.append(after);
    await before();
    await userEvent.tab();
    expect(document.activeElement).toBe(radios[1]);
    await userEvent.tab();
    expect(document.activeElement).toBe(after);
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(radios[1]);
    expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
  });

  it('with none checked, the stop is the first radio that responds', async () => {
    const radios = await mountGroup([{ ...SHIFTS[0], disabled: true }, SHIFTS[1]!, SHIFTS[2]!]);
    await before();
    await userEvent.tab();
    expect(document.activeElement).toBe(radios[1]);
    expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual([null, '0', '-1']);
  });

  it('arrow down and right move to the next radio, check it and fire the events', async () => {
    const radios = await mountGroup([{ ...SHIFTS[0], checked: true }, SHIFTS[1]!, SHIFTS[2]!]);
    const seen = listen(document.body);
    radios[0]!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(radios[1]);
    expect(checkedOf(radios)).toEqual([false, true, false]);
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(radios[2]);
    expect(checkedOf(radios)).toEqual([false, false, true]);
    expect(seen).toEqual(['input', 'change', 'input', 'change']);
    expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);
  });

  it('arrow up and left move to the previous radio, and both ends wrap', async () => {
    const radios = await mountGroup([{ ...SHIFTS[0], checked: true }, SHIFTS[1]!, SHIFTS[2]!]);
    radios[0]!.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(radios[2]);
    expect(checkedOf(radios)).toEqual([false, false, true]);
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(radios[1]);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(document.activeElement).toBe(radios[0]);
    expect(checkedOf(radios)).toEqual([true, false, false]);
  });

  it('the arrow keys skip a disabled radio', async () => {
    const radios = await mountGroup([{ ...SHIFTS[0], checked: true }, { ...SHIFTS[1], disabled: true }, SHIFTS[2]!]);
    radios[0]!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(radios[2]);
    expect(checkedOf(radios)).toEqual([false, false, true]);
  });

  it('Space checks the focused radio; Enter does not', async () => {
    const radios = await mountGroup();
    const seen = listen(document.body);
    radios[0]!.focus();
    await userEvent.keyboard('{Enter}');
    expect(checkedOf(radios)).toEqual([false, false, false]);
    await userEvent.keyboard(' ');
    expect(checkedOf(radios)).toEqual([true, false, false]);
    await userEvent.keyboard(' ');
    expect(seen).toEqual(['input', 'change']);
  });

  it('the arrow keys and Space do not scroll the page', async () => {
    const radios = await mountGroup();
    const prevented: string[] = [];
    document.addEventListener('keydown', (event) => event.defaultPrevented && prevented.push(event.key));
    radios[0]!.focus();
    await userEvent.keyboard(' {ArrowDown}{ArrowUp}{ArrowLeft}{ArrowRight}');
    expect(prevented).toEqual([' ', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']);
  });

  it('a hidden radio, by itself or by an ancestor, is skipped by the arrow keys and takes no Tab stop', async () => {
    for (const hide of ['self', 'ancestor'] as const) {
      const radios = await mountGroup([SHIFTS[0]!, SHIFTS[1]!, SHIFTS[2]!]);
      const middle = radios[1]!;
      if (hide === 'self') {
        middle.style.display = 'none';
      } else {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'none';
        middle.before(wrapper);
        wrapper.append(middle);
      }
      radios[0]!.checked = true;
      radios[0]!.checked = false;
      expect(radios.map((element) => element.getAttribute('tabindex')), hide).toEqual(['0', '-1', '-1']);
      radios[0]!.focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(document.activeElement, hide).toBe(radios[2]);
      expect(checkedOf(radios), hide).toEqual([false, false, true]);
      /* Code can still check the hidden radio. */
      middle.checked = true;
      expect(checkedOf(radios), hide).toEqual([false, true, false]);
      document.body.replaceChildren();
    }
  });

  it('the hidden attribute hides the radio, and the keyboard skips it', async () => {
    const radios = await mountGroup([SHIFTS[0]!, SHIFTS[1]!, SHIFTS[2]!]);
    radios[1]!.hidden = true;
    expect(getComputedStyle(radios[1]!).display).toBe('none');
    radios[0]!.checked = true;
    expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    radios[0]!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(radios[2]);
    expect(checkedOf(radios)).toEqual([false, false, true]);
    radios[1]!.hidden = false;
    expect(getComputedStyle(radios[1]!).display).toBe('inline-flex');
  });

  it('a hidden first radio does not hold the Tab stop of a group with none checked', async () => {
    const radios = radio({ ...SHIFTS[0] });
    radios.style.display = 'none';
    document.body.append(radios);
    const rest = await mountGroup([SHIFTS[1]!, SHIFTS[2]!]);
    await radios.updateComplete;
    expect([radios, ...rest].map((element) => element.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
  });

  it('a disabled radio leaves the Tab order', async () => {
    const element = await mount({ text: 'Card', name: 'payment', disabled: true });
    expect(element.hasAttribute('tabindex')).toBe(false);
    await before();
    await userEvent.tab();
    expect(document.activeElement).not.toBe(element);
  });

  it('a radio added or removed later joins or leaves the roving order', async () => {
    const radios = await mountGroup([SHIFTS[0]!, SHIFTS[1]!]);
    expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual(['0', '-1']);
    const first = radio({ name: 'shift', value: 'dawn', text: 'Dawn' });
    document.body.prepend(first);
    await first.updateComplete;
    expect([first, ...radios].map((element) => element.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    first.remove();
    expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual(['0', '-1']);
  });

  it('the piece owns the tabindex of the host', async () => {
    const element = radio({ text: 'Card', name: 'payment' });
    element.setAttribute('tabindex', '5');
    document.body.append(element);
    await element.updateComplete;
    expect(element.getAttribute('tabindex')).toBe('0');
  });
});

describe('the form', () => {
  async function inForm(specs: RadioSpec[] = SHIFTS): Promise<{ form: HTMLFormElement; radios: NphRadio[] }> {
    const form = document.createElement('form');
    document.body.append(form);
    const radios = await mountGroup(specs, form);
    return { form, radios };
  }

  it('only the checked radio enters the FormData, under its name', async () => {
    const { form, radios } = await inForm();
    expect([...new FormData(form).entries()]).toEqual([]);
    radios[1]!.click();
    expect([...new FormData(form).entries()]).toEqual([['shift', 'afternoon']]);
    radios[2]!.checked = true;
    expect([...new FormData(form).entries()]).toEqual([['shift', 'night']]);
  });

  it('without value, a checked radio sends on; a value set later is the one sent', async () => {
    const { form, radios } = await inForm([{ name: 'agree', text: 'I agree' }]);
    radios[0]!.checked = true;
    expect([...new FormData(form).entries()]).toEqual([['agree', 'on']]);
    radios[0]!.value = 'yes';
    await radios[0]!.updateComplete;
    expect([...new FormData(form).entries()]).toEqual([['agree', 'yes']]);
  });

  it('a name set from code reaches the form, because it reflects', async () => {
    const { form, radios } = await inForm([{ text: 'Card', value: 'card', checked: true }]);
    expect([...new FormData(form).entries()]).toEqual([]);
    radios[0]!.name = 'payment';
    await radios[0]!.updateComplete;
    expect([...new FormData(form).entries()]).toEqual([['payment', 'card']]);
  });

  it('form, labels and the validity surface are the ones of the internals', async () => {
    const { form, radios } = await inForm();
    const element = radios[0]!;
    expect(element.form).toBe(form);
    expect(element.labels.length).toBe(0);
    expect(element.willValidate).toBe(true);
    expect(element.validity.valid).toBe(true);
    expect(element.validationMessage).toBe('');
    expect(element.checkValidity()).toBe(true);
    expect(element.reportValidity()).toBe(true);
  });

  it('reset returns to the checked attribute, not to the last state', async () => {
    const { form, radios } = await inForm([SHIFTS[0]!, { ...SHIFTS[1], checkedAttribute: true }, SHIFTS[2]!]);
    expect(checkedOf(radios)).toEqual([false, true, false]);
    radios[2]!.click();
    expect(checkedOf(radios)).toEqual([false, false, true]);
    form.reset();
    expect(checkedOf(radios)).toEqual([false, true, false]);
    expect([...new FormData(form).entries()]).toEqual([['shift', 'afternoon']]);
  });

  it('the attribute moves the state only while the piece is not dirty', async () => {
    const element = await mount({ text: 'Card', name: 'payment' });
    element.setAttribute('checked', '');
    expect(element.checked).toBe(true);
    element.removeAttribute('checked');
    expect(element.checked).toBe(false);
    element.checked = true;
    element.removeAttribute('checked');
    element.setAttribute('checked', '');
    element.removeAttribute('checked');
    expect(element.checked).toBe(true);
  });

  it('a fieldset disabled around it disables it: out of Tab, no click, :disabled, opacity', async () => {
    const form = document.createElement('form');
    const fieldset = document.createElement('fieldset');
    form.append(fieldset);
    document.body.append(form);
    const radios = await mountGroup(SHIFTS, fieldset);
    fieldset.disabled = true;
    await settle(radios);
    expect(radios.every((element) => element.matches(':disabled'))).toBe(true);
    expect(radios.every((element) => !element.hasAttribute('tabindex'))).toBe(true);
    radios[0]!.click();
    expect(radios[0]!.checked).toBe(false);
    expect(getComputedStyle(radios[0]!).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect((await ax(radios[0]!)).disabled).toBe(true);
    fieldset.disabled = false;
    await settle(radios);
    expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('the form attribute ties the radio to another form', async () => {
    const form = document.createElement('form');
    form.id = 'checkout';
    document.body.append(form);
    const element = radio({ text: 'Card', name: 'payment', value: 'card', checked: true });
    element.setAttribute('form', 'checkout');
    document.body.append(element);
    await element.updateComplete;
    expect(element.form).toBe(form);
    expect([...new FormData(form).entries()]).toEqual([['payment', 'card']]);
  });

  it('a radio that moves to a form where it is alone becomes the Tab stop of that group', async () => {
    const { radios } = await inForm([{ ...SHIFTS[0], checked: true }, SHIFTS[1]!]);
    const other = document.createElement('form');
    other.id = 'other';
    document.body.append(other);
    radios[1]!.setAttribute('form', 'other');
    await settle(radios);
    expect(radios[1]!.form).toBe(other);
    expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual(['0', '0']);
  });

  it('the default value is also written as the attribute', async () => {
    const element = await mount({ text: 'Card', name: 'payment' });
    expect(element.getAttribute('value')).toBe(NPH_RADIO_DEFAULT_VALUE);
  });

  it('removing the value attribute gives back on, in the property, the event and the form', async () => {
    const { form, radios } = await inForm([{ name: 'agree', value: 'yes', text: 'I agree' }]);
    const element = radios[0]!;
    element.removeAttribute('value');
    await element.updateComplete;
    expect(element.value).toBe(NPH_RADIO_DEFAULT_VALUE);
    const values: string[] = [];
    element.addEventListener('change', (event) => values.push((event.target as NphRadio).value));
    element.click();
    expect(values).toEqual([NPH_RADIO_DEFAULT_VALUE]);
    expect([...new FormData(form).entries()]).toEqual([['agree', NPH_RADIO_DEFAULT_VALUE]]);
  });

  it('a radio that is not drawn submits nothing, and submits again once it has a name', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { form, radios } = await inForm([{ name: 'payment', value: 'card', text: 'Card', checked: true }, { name: 'payment', value: 'pix', text: 'Pix' }]);
    expect([...new FormData(form).entries()]).toEqual([['payment', 'card']]);
    radios[0]!.text = '';
    await radios[0]!.updateComplete;
    expect(radios[0]!.hasAttribute('data-nph-rendered')).toBe(false);
    expect([...new FormData(form).entries()]).toEqual([]);
    radios[0]!.text = 'Card';
    await radios[0]!.updateComplete;
    expect([...new FormData(form).entries()]).toEqual([['payment', 'card']]);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('the restore state of an unchecked radio is explicit: it is not checked again by its attribute', async () => {
    const { radios } = await inForm([{ ...SHIFTS[0], checkedAttribute: true }, SHIFTS[1]!]);
    const restore = (element: NphRadio, state: unknown): void =>
      (element as unknown as { formStateRestoreCallback(value: unknown, mode: string): void }).formStateRestoreCallback(state, 'restore');
    /* The two states the radio writes with setFormValue; the browser hands them back on history navigation. */
    restore(radios[1]!, 'nph-radio:checked');
    restore(radios[0]!, 'nph-radio:unchecked');
    expect(checkedOf(radios)).toEqual([false, true]);
    restore(radios[1]!, 'nph-radio:unchecked');
    expect(checkedOf(radios)).toEqual([false, false]);
    /* In restore mode, a value is not a restore state. */
    restore(radios[0]!, radios[0]!.value);
    expect(checkedOf(radios)).toEqual([false, false]);
  });

  it('autocomplete checks the radio whose value it is, compared only with value', async () => {
    const { radios } = await inForm([SHIFTS[0]!, SHIFTS[1]!, { name: 'shift', value: 'nph-radio:unchecked', text: 'Odd' }]);
    const fill = (element: NphRadio, state: unknown): void =>
      (element as unknown as { formStateRestoreCallback(value: unknown, mode: string): void }).formStateRestoreCallback(state, 'autocomplete');
    fill(radios[1]!, 'afternoon');
    expect(checkedOf(radios)).toEqual([false, true, false]);
    /* A value that looks like a restore marker is just a value in autocomplete. */
    fill(radios[2]!, 'nph-radio:unchecked');
    expect(checkedOf(radios)).toEqual([false, false, true]);
    fill(radios[0]!, 'nph-radio:checked');
    expect(radios[0]!.checked).toBe(false);
  });
});

describe('inside nph-field (P83)', () => {
  async function inField(attributes: Record<string, string> = {}): Promise<{ field: HTMLElement; radios: NphRadio[] }> {
    const field = document.createElement('nph-field');
    field.setAttribute('label', 'Work shift');
    for (const [key, value] of Object.entries(attributes)) field.setAttribute(key, value);
    document.body.append(field);
    const radios = await mountGroup([{ ...SHIFTS[0], checked: true }, SHIFTS[1]!, SHIFTS[2]!], field);
    await (field as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    return { field, radios };
  }

  const wrapper = (field: HTMLElement): HTMLElement | null => field.shadowRoot?.querySelector<HTMLElement>('[role="radiogroup"]') ?? null;

  it('the field wraps the radios in a radiogroup named by its label, and the radios keep their names', async () => {
    const { field, radios } = await inField();
    await vi.waitFor(() => expect(wrapper(field)?.getAttribute('aria-label')).toBe('Work shift'));
    expect(await ax(radios[1]!)).toMatchObject({ role: 'radio', name: 'Afternoon' });
  });

  it('the group by name, the Tab stop and the arrow keys work inside the field', async () => {
    const { field, radios } = await inField();
    await vi.waitFor(() => expect(wrapper(field)).not.toBeNull());
    expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    radios[0]!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(radios[1]);
    expect(checkedOf(radios)).toEqual([false, true, false]);
  });

  it('an error on the field makes every radio invalid, and the radiogroup carries aria-invalid', async () => {
    const { field, radios } = await inField({ error: 'Choose a shift.' });
    await vi.waitFor(() => expect(radios.every((element) => element.invalid)).toBe(true));
    await vi.waitFor(() => expect(getComputedStyle(circle(radios[1]!)).borderTopColor).toBe(resolved('color', '--nph-status-error')));
    expect(wrapper(field)?.getAttribute('aria-invalid')).toBe('true');
    expect(radios.some((element) => element.hasAttribute('aria-invalid'))).toBe(false);
    field.removeAttribute('error');
    await vi.waitFor(() => expect(radios.every((element) => !element.invalid)).toBe(true));
  });

  it('a disabled field disables the radios, which fade once: the field draws no opacity of its own', async () => {
    const { field, radios } = await inField({ disabled: '' });
    await vi.waitFor(() => expect(radios.every((element) => element.disabled)).toBe(true));
    expect(radios.every((element) => !element.hasAttribute('tabindex'))).toBe(true);
    expect(getComputedStyle(radios[0]!).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(getComputedStyle(field).opacity).toBe('1');
    field.removeAttribute('disabled');
    await vi.waitFor(() => expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']));
  });
});

describe('measures (D3, D4)', () => {
  it('circle icon/size-sm, touch area 24 × 24, dot 8, fully round', async () => {
    const element = await mount({ text: 'Card', name: 'payment', checked: true });
    const size = px('--nph-icon-size-sm');
    const tight = px('--nph-space-inline-tight');
    expect(size).toBe(16);
    expect(circle(element).getBoundingClientRect()).toMatchObject({ width: size, height: size });
    expect(target(element).getBoundingClientRect()).toMatchObject({ width: size + 2 * tight, height: size + 2 * tight });
    expect(target(element).getBoundingClientRect().width).toBe(24);
    expect(dot(element).getBoundingClientRect()).toMatchObject({ width: 8, height: 8 });
    expect(getComputedStyle(circle(element)).borderTopWidth).toBe(resolved('width', '--nph-border-width'));
    expect(getComputedStyle(circle(element)).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
    /* The dot is centered in the circle. */
    const c = circle(element).getBoundingClientRect();
    const d = dot(element).getBoundingClientRect();
    expect(d.left - c.left).toBeCloseTo(c.right - d.right, 3);
    expect(d.top - c.top).toBeCloseTo(c.bottom - d.bottom, 3);
  });

  it('space/inline is measured from the edge of the touch area to the text', async () => {
    const element = await mount();
    expect(textOf(element).getBoundingClientRect().left - target(element).getBoundingClientRect().right).toBe(px('--nph-space-inline'));
  });

  it('without text, the piece is the 24 × 24 touch area', async () => {
    const element = await mount({ label: 'Pix', name: 'payment' });
    expect(element.getBoundingClientRect()).toMatchObject({ width: 24, height: 24 });
  });

  it('the text wraps to the available width, and the circle stays with the first line (D4, D6)', async () => {
    const box = document.createElement('div');
    box.style.inlineSize = '160px';
    document.body.append(box);
    const element = await mount({ text: 'A long option that needs two lines at least', name: 'payment' }, box);
    const line = Number.parseFloat(resolved('line-height', '--nph-text-label-md-line-height'));
    const text = textOf(element).getBoundingClientRect();
    const area = target(element).getBoundingClientRect();
    expect(element.getBoundingClientRect().width).toBeLessThanOrEqual(160);
    expect(text.height).toBeGreaterThanOrEqual(2 * line);
    /* Top of the piece, not centered on the block of text. */
    expect(area.top).toBe(element.getBoundingClientRect().top);
    /* The center of the circle is the center of the first line. */
    const firstLineCenter = text.top + (24 - line) / 2 + line / 2;
    expect(area.top + area.height / 2).toBeCloseTo(firstLineCenter, 3);
  });

  it('the text uses text/label-md', async () => {
    const element = await mount();
    const style = getComputedStyle(textOf(element));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-text-label-md-line-height'));
  });

  it('checking it changes no size or position', async () => {
    const element = await mount();
    const before = element.getBoundingClientRect();
    element.checked = true;
    await element.updateComplete;
    const after = element.getBoundingClientRect();
    expect([after.left, after.top, after.width, after.height]).toEqual([before.left, before.top, before.width, before.height]);
  });
});

describe('colors in each state, in both schemes and in another brand (D1, D2)', () => {
  const places: [string, () => HTMLElement][] = [
    ['light', () => document.body],
    [
      'dark',
      () => {
        document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
        return document.body;
      },
    ],
    [`${OTHER_BRAND} dark`, () => scope()],
  ];

  for (const [where, place] of places) {
    it(`${where}: unchecked is color/background with a color/input border; checked is color/primary with the dot`, async () => {
      const parent = place();
      const element = await mount({ text: 'Card', name: 'payment' }, parent);
      await vi.waitFor(() => {
        expect(getComputedStyle(circle(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-background', parent));
        expect(getComputedStyle(circle(element)).borderTopColor).toBe(resolved('color', '--nph-color-input', parent));
        expect(getComputedStyle(dot(element)).opacity).toBe('0');
      });
      element.checked = true;
      await element.updateComplete;
      await vi.waitFor(() => {
        expect(getComputedStyle(circle(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary', parent));
        expect(getComputedStyle(circle(element)).borderTopColor).toBe(resolved('color', '--nph-color-input', parent));
        expect(getComputedStyle(dot(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-foreground', parent));
        expect(getComputedStyle(dot(element)).opacity).toBe('1');
      });
      expect(getComputedStyle(textOf(element)).color).toBe(resolved('color', '--nph-color-foreground', parent));
    });

    it(`${where}: error is a status/error border, checked or not, and the checked fill stays`, async () => {
      const parent = place();
      const element = await mount({ text: 'Card', name: 'payment', invalid: true }, parent);
      await vi.waitFor(() => expect(getComputedStyle(circle(element)).borderTopColor).toBe(resolved('color', '--nph-status-error', parent)));
      element.checked = true;
      await element.updateComplete;
      await vi.waitFor(() => {
        expect(getComputedStyle(circle(element)).borderTopColor).toBe(resolved('color', '--nph-status-error', parent));
        expect(getComputedStyle(circle(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary', parent));
      });
    });

    it(`${where}: focus is a focus/border border and a focus/halo halo over the touch area; with error, status/error and focus/halo-error`, async () => {
      const parent = place();
      const [plain, wrong] = await mountGroup(
        [
          { text: 'Card', name: 'a' },
          { text: 'Pix', name: 'b', invalid: true },
        ],
        parent,
      );
      const input = document.createElement('input');
      parent.prepend(input);
      input.focus();
      await userEvent.tab();
      expect(document.activeElement).toBe(plain);
      await vi.waitFor(() => {
        expect(getComputedStyle(circle(plain!)).borderTopColor).toBe(resolved('color', '--nph-focus-border', parent));
        expect(halo(circle(plain!))).toEqual({ color: resolved('color', '--nph-focus-halo', parent), spread: resolved('width', '--nph-focus-ring-width') });
      });
      await userEvent.tab();
      expect(document.activeElement).toBe(wrong);
      await vi.waitFor(() => {
        expect(getComputedStyle(circle(wrong!)).borderTopColor).toBe(resolved('color', '--nph-status-error', parent));
        expect(halo(circle(wrong!))).toEqual({ color: resolved('color', '--nph-focus-halo-error', parent), spread: resolved('width', '--nph-focus-ring-width') });
      });
      expect(halo(circle(plain!))).toBe('none');
    });
  }

  it('the halo covers exactly the 24 × 24 touch area and is fully round', async () => {
    const element = await mount();
    element.focus();
    await userEvent.keyboard('{Shift}');
    const reach = px('--nph-icon-size-sm') + 2 * px('--nph-focus-ring-width');
    expect(reach).toBe(target(element).getBoundingClientRect().width);
    expect(getComputedStyle(circle(element)).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
  });

  it('a mouse click does not show the focus', async () => {
    const element = await mount();
    await userEvent.click(circle(element));
    expect(document.activeElement).toBe(element);
    expect(halo(circle(element))).toBe('none');
  });

  it('hover: the border is color/input-hover; checked on hover also takes state/hover-opacity on the circle', async () => {
    const element = await mount();
    await userEvent.hover(textOf(element));
    await vi.waitFor(() => expect(getComputedStyle(circle(element)).borderTopColor).toBe(resolved('color', '--nph-color-input-hover')));
    expect(getComputedStyle(circle(element)).opacity).toBe('1');
    element.checked = true;
    await element.updateComplete;
    await vi.waitFor(() => expect(getComputedStyle(circle(element)).opacity).toBe(resolved('opacity', '--nph-state-hover-opacity')));
    expect(getComputedStyle(element).opacity).toBe('1');
  });

  it('disabled: state/disabled-opacity on the whole piece, text included, no hover; disabled wins over error (D7)', async () => {
    const element = await mount({ text: 'Card', name: 'payment', disabled: true, invalid: true });
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(getComputedStyle(textOf(element)).color).toBe(resolved('color', '--nph-color-foreground'));
    await userEvent.hover(textOf(element), { force: true }).catch(() => {});
    await vi.waitFor(() => expect(getComputedStyle(circle(element)).borderTopColor).toBe(resolved('color', '--nph-color-input')));
  });
});

describe('contrast, measured (WCAG 2.2 AA)', () => {
  it('the circle outline (color/input) is at least 3:1 on color/background, in both schemes', () => {
    for (const scheme of ['light', 'dark'] as const) {
      const part = scope(DEFAULT_BRAND, scheme);
      expect(contrast(resolved('color', '--nph-color-input', part), resolved('color', '--nph-color-background', part)), scheme).toBeGreaterThanOrEqual(3);
      part.remove();
    }
  });

  it('the text is at least 4.5:1 on color/background, in both schemes', () => {
    for (const scheme of ['light', 'dark'] as const) {
      const part = scope(DEFAULT_BRAND, scheme);
      expect(contrast(resolved('color', '--nph-color-foreground', part), resolved('color', '--nph-color-background', part)), scheme).toBeGreaterThanOrEqual(4.5);
      part.remove();
    }
  });

  it('the dot is at least 3:1 on the checked fill, and the error border at least 3:1 on the background, in every brand and scheme', () => {
    const failures: string[] = [];
    for (const scheme of ['light', 'dark'] as const) {
      for (const brand of BRANDS) {
        const part = scope(brand, scheme);
        if (contrast(resolved('color', '--nph-color-primary-foreground', part), resolved('color', '--nph-color-primary', part)) < 3) failures.push(`dot ${scheme} ${brand}`);
        if (contrast(resolved('color', '--nph-status-error', part), resolved('color', '--nph-color-background', part)) < 3) failures.push(`error ${scheme} ${brand}`);
        part.remove();
      }
    }
    expect(failures).toEqual([]);
  });

  /*
   * Known limit, measured and not assumed: design.md says focus/border measures 2.92:1
   * against the halo in the default brand, in light mode, because no halo tone reaches 3:1; every
   * other pair meets it. The test pins the exact list: if a token changes, it fails and the
   * limit is rewritten.
   */
  it('known limit: the focus border under 3:1 against the halo is exactly the light default brand', () => {
    const below: string[] = [];
    for (const scheme of ['light', 'dark'] as const) {
      for (const brand of BRANDS) {
        const part = scope(brand, scheme);
        if (contrast(resolved('color', '--nph-focus-border', part), resolved('color', '--nph-focus-halo', part)) < 3) below.push(`${scheme} ${brand}`);
        part.remove();
      }
    }
    expect(below).toEqual([`light ${DEFAULT_BRAND}`]);
  });
});

describe('motion (D5)', () => {
  const animated = (element: NphRadio): HTMLElement[] => [circle(element), dot(element)];

  it('the fill, the border and the dot change on the state duration and easing, as a pair', async () => {
    const element = await mount();
    const duration = resolved('transition-duration', '--nph-motion-state-duration');
    const easing = resolved('transition-timing-function', '--nph-motion-state-easing');
    expect(duration).not.toBe('0s');
    expect(getComputedStyle(circle(element)).transitionProperty).toBe('background-color, border-color, opacity');
    expect(getComputedStyle(dot(element)).transitionProperty).toBe('opacity');
    for (const part of animated(element)) {
      const style = getComputedStyle(part);
      expect(listOf(style.transitionDuration).every((value) => value === duration)).toBe(true);
      expect(listOf(style.transitionTimingFunction).every((value) => value === easing)).toBe(true);
    }
  });

  it('width, height and position are never animated', async () => {
    const element = await mount();
    for (const part of animated(element)) {
      expect(getComputedStyle(part).transitionProperty).not.toMatch(/\ball\b|width|height|inline-size|block-size|top|left|right|bottom|inset|transform|margin|padding/);
    }
    /* The other boxes have no transition of their own. */
    for (const part of [element, target(element), textOf(element)]) {
      expect(getComputedStyle(part).transitionDuration).toBe('0s');
    }
  });

  it('with reduced motion, the duration is 100 ms (core/duration/100 through its semantic alias), the easing stays and the colors still change', async () => {
    const session = cdp();
    try {
      await session.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      const element = await mount();
      const duration = resolved('transition-duration', '--nph-motion-hover-duration');
      expect(duration).toBe('0.1s');
      for (const part of animated(element)) {
        const style = getComputedStyle(part);
        expect(listOf(style.transitionDuration).every((value) => value === duration)).toBe(true);
        expect(listOf(style.transitionTimingFunction).every((value) => value === resolved('transition-timing-function', '--nph-motion-state-easing'))).toBe(true);
      }
      element.checked = true;
      await element.updateComplete;
      await vi.waitFor(() => {
        expect(getComputedStyle(circle(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary'));
        expect(getComputedStyle(dot(element)).opacity).toBe('1');
      });
    } finally {
      /* Back to the test browser's default; `features: []` does not undo it. */
      await session.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
      });
    }
    await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
  });
});

describe('invalid input: it renders nothing and says why, once', () => {
  it('no text, no label and no name on the host', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ name: 'payment' });
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(element.shadowRoot?.childElementCount).toBe(0);
    expect(getComputedStyle(element).display).toBe('none');
    expect(element.hasAttribute('tabindex')).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('[nph-radio]');
  });

  it('a text of spaces is no name', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ text: '   ', name: 'payment' });
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('an empty aria-labelledby, or one of spaces, is no name', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    for (const reference of ['', '   ']) {
      const element = radio({ name: 'payment' });
      element.setAttribute('aria-labelledby', reference);
      document.body.append(element);
      await element.updateComplete;
      expect(element.hasAttribute('data-nph-rendered'), JSON.stringify(reference)).toBe(false);
      expect(element.hasAttribute('tabindex')).toBe(false);
    }
    expect(error).toHaveBeenCalledTimes(2);
  });

  it('checking it does not repeat the error; a text set later draws it with no new error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ name: 'payment' });
    element.checked = true;
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
    element.text = 'Card';
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('an undrawn radio is not the Tab stop of its group', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const radios = await mountGroup([{ name: 'shift' }, SHIFTS[1]!, SHIFTS[2]!]);
    expect(radios.map((element) => element.getAttribute('tabindex'))).toEqual([null, '0', '-1']);
  });

  it('a valid radio logs nothing', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await mountGroup();
    await frame();
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('composition warnings: it still renders (a radio never shows alone)', () => {
  it('a radio without name warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const element = await mount({ text: 'Card' });
    await frame();
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('without name');
    element.checked = true;
    await element.updateComplete;
    await frame();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('a group of one warns once; a second radio ends the problem', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await mount({ text: 'Card', name: 'payment' });
    await frame();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('single radio');
    await mount({ text: 'Pix', name: 'payment' });
    await frame();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('radios parsed together do not warn, and there is no maximum', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const box = document.createElement('div');
    box.innerHTML = Array.from({ length: 7 }, (_, index) => `<nph-radio name="many" text="Option ${index}"></nph-radio>`).join('');
    document.body.append(box);
    await settle([...box.querySelectorAll('nph-radio')]);
    await frame();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, and these are the ones the contract names', () => {
    expect(used).toEqual(
      new Set([
        '--nph-space-inline',
        '--nph-state-disabled-opacity',
        '--nph-space-inline-tight',
        '--nph-color-input',
        '--nph-focus-halo',
        '--nph-icon-size-sm',
        '--nph-border-width',
        '--nph-radius-full',
        '--nph-color-background',
        '--nph-color-primary-foreground',
        '--nph-color-primary',
        '--nph-color-input-hover',
        '--nph-state-hover-opacity',
        '--nph-status-error',
        '--nph-focus-halo-error',
        '--nph-focus-ring-width',
        '--nph-focus-border',
        '--nph-text-label-md-line-height',
        '--nph-color-foreground',
        '--nph-text-label-md-font-family',
        '--nph-text-label-md-font-size',
        '--nph-text-label-md-font-weight',
        '--nph-text-label-md-letter-spacing',
        '--nph-motion-state-duration',
        '--nph-motion-state-easing',
        '--nph-motion-hover-duration',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('never consumes a core or theme token: components use the semantic layer only', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, measure or duration', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s)\b/);
    expect(cssWithoutComments).not.toMatch(/\btransition:\s*none\b|\btransition:\s*all\b/);
  });

  it('design.md names every token of the piece, and the reduced motion it uses is the alias of core/duration/100', () => {
    for (const token of [
      'color/background',
      'color/input',
      'color/input-hover',
      'color/primary',
      'color/primary-foreground',
      'color/foreground',
      'status/error',
      'state/hover-opacity',
      'state/disabled-opacity',
      'focus/border',
      'focus/halo',
      'focus/halo-error',
      'focus/ring-width',
      'radius/full',
      'icon/size-sm',
      'border/width',
      'space/inline-tight',
      'space/inline',
      'motion/state-duration',
      'motion/hover-duration',
    ]) {
      expect(designMd, token).toContain(`  ${token}:`);
    }
    expect(designMd).toMatch(/motion\/hover-duration:\s*\n\s*css: '--nph-motion-hover-duration'\s*\n\s*alias: core\/duration\/100/);
    expect(designMd).toContain('Applies to checkbox, radio and switch');
  });
});
