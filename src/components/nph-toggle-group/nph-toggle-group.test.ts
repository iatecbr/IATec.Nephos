/**
 * Tests of `nph-toggle-group` (P76), in a real browser (P21, item 5): measures, the
 * Tab order and real clicks only exist where there is layout.
 *
 * They prove the contract accepted in Figma (frame `1580:61`, set `1580:60`) and the
 * decisions D1 to D3 of DSA-23: the API, the space between buttons, the semantics of
 * the group, single and multiple selection, the click that does nothing on the checked
 * button, the own event, the composition warnings, the invalid input and the token
 * contract. Color, state and focus belong to `nph-togglebutton`: here the tests only
 * prove that the group adds none.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-toggle-group.css?raw';
import { NPH_TOGGLE_GROUP_SELECTIONS, NPH_TOGGLE_GROUP_VALUE_CHANGE_EVENT, NphToggleGroup } from './nph-toggle-group';
import type { NphToggleGroupValueChangeDetail } from './nph-toggle-group';
import type { NphTogglebutton } from '../nph-togglebutton/nph-togglebutton';

interface ButtonSpec {
  value?: string | null;
  text?: string;
  label?: string;
  disabled?: boolean;
  invalid?: boolean;
  iconStart?: string;
}

interface GroupSpec {
  label?: string | null;
  selection?: string;
  value?: string[];
  buttons?: ButtonSpec[];
}

const ALIGNMENT: ButtonSpec[] = [
  { value: 'left', label: 'Left', iconStart: 'align-left' },
  { value: 'center', label: 'Center', iconStart: 'align-center' },
  { value: 'right', label: 'Right', iconStart: 'align-right' },
];

const VIEW: ButtonSpec[] = [
  { value: 'list', text: 'List' },
  { value: 'grid', text: 'Grid' },
  { value: 'table', text: 'Table' },
];

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

function button(spec: ButtonSpec): NphTogglebutton {
  const element = document.createElement('nph-togglebutton');
  if (spec.value !== null && spec.value !== undefined) element.setAttribute('value', spec.value);
  if (spec.text !== undefined) element.text = spec.text;
  if (spec.label !== undefined) element.label = spec.label;
  if (spec.disabled) element.disabled = true;
  if (spec.invalid) element.invalid = true;
  if (spec.iconStart !== undefined) element.iconStart = spec.iconStart;
  return element;
}

async function mount(spec: GroupSpec = {}, parent: HTMLElement = document.body): Promise<NphToggleGroup> {
  const group = document.createElement('nph-toggle-group');
  if (spec.label !== null) group.label = spec.label ?? 'Alignment';
  if (spec.selection !== undefined) group.selection = spec.selection;
  if (spec.value !== undefined) group.value = spec.value;
  group.append(...(spec.buttons ?? ALIGNMENT).map(button));
  parent.append(group);
  await group.updateComplete;
  await Promise.all(buttonsOf(group).map((child) => child.updateComplete));
  return group;
}

function buttonsOf(group: HTMLElement): NphTogglebutton[] {
  return [...group.querySelectorAll<NphTogglebutton>(':scope > nph-togglebutton')];
}

function inner(element: NphTogglebutton): HTMLButtonElement {
  const control = element.shadowRoot?.querySelector<HTMLButtonElement>('button');
  if (!control) throw new Error('no inner <button>');
  return control;
}

async function settle(group: NphToggleGroup): Promise<void> {
  await group.updateComplete;
  await Promise.all(buttonsOf(group).map((child) => child.updateComplete));
}

/** The checked state of each button, in order. */
function pressedOf(group: HTMLElement): boolean[] {
  return buttonsOf(group).map((child) => child.pressed);
}

function pxOf(value: string): number {
  return Number.parseFloat(value);
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** Records the events of the group. */
function listen(group: NphToggleGroup): string[][] {
  const seen: string[][] = [];
  group.addEventListener(NPH_TOGGLE_GROUP_VALUE_CHANGE_EVENT, (event) => seen.push([...event.detail.value]));
  return seen;
}

describe('registration and API', () => {
  it('defines nph-toggle-group only once', () => {
    expect(customElements.get('nph-toggle-group')).toBe(NphToggleGroup);
  });

  it('the public API is exactly the one in P76', () => {
    const declared = [...(NphToggleGroup as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['label', 'selection', 'value']);
    expect([...NPH_TOGGLE_GROUP_SELECTIONS]).toEqual(['single', 'multiple']);
  });

  it('the defaults are single selection with no value', async () => {
    const group = await mount();
    expect(group.selection).toBe('single');
    expect(group.value).toEqual([]);
    expect(pressedOf(group)).toEqual([false, false, false]);
  });

  it('has open Shadow DOM with the slot as its only child, and no part', async () => {
    const group = await mount();
    expect(group.shadowRoot?.mode).toBe('open');
    expect(group.shadowRoot?.children.length).toBe(1);
    expect(group.shadowRoot?.firstElementChild?.localName).toBe('slot');
    expect(group.shadowRoot?.querySelector('[part]')).toBeNull();
  });

  it('has no size, disabled, invalid, max, orientation or color property', () => {
    const declared = [...(NphToggleGroup as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['size', 'disabled', 'invalid', 'max', 'orientation', 'color', 'variant', 'text', 'pressed']) {
      expect(declared).not.toContain(name);
    }
    expect((NphToggleGroup as unknown as { formAssociated?: boolean }).formAssociated).toBeUndefined();
  });

  it('reads the value attribute as tokens separated by spaces', async () => {
    const group = document.createElement('nph-toggle-group');
    group.setAttribute('label', 'Formatting');
    group.setAttribute('selection', 'multiple');
    group.setAttribute('value', '  bold   italic ');
    group.append(...[{ value: 'bold', label: 'Bold' }, { value: 'italic', label: 'Italic' }, { value: 'underline', label: 'Underline' }].map(button));
    document.body.append(group);
    await settle(group);
    expect(group.value).toEqual(['bold', 'italic']);
    expect(pressedOf(group)).toEqual([true, true, false]);
  });

  it('leaves nph-togglebutton alone: no value property, only the attribute the group reads', async () => {
    const group = await mount();
    const [first] = buttonsOf(group);
    expect(first && 'value' in first).toBe(false);
    expect(first?.getAttribute('value')).toBe('left');
  });
});

describe('layout', () => {
  it('spaces the buttons by space/inline and never joins them', async () => {
    const group = await mount();
    const boxes = buttonsOf(group).map((child) => child.getBoundingClientRect());
    const gap = pxOf(resolved('width', '--nph-space-inline'));
    expect(gap).toBe(8);
    for (let index = 1; index < boxes.length; index += 1) {
      const previous = boxes[index - 1];
      const current = boxes[index];
      expect(Math.round((current?.left ?? 0) - (previous?.right ?? 0))).toBe(gap);
    }
    expect(getComputedStyle(group).columnGap).toBe(`${gap}px`);
  });

  it('the space is larger than the reach of the focus border and halo of a button', async () => {
    const gap = pxOf(resolved('width', '--nph-space-inline'));
    const border = pxOf(resolved('width', '--nph-border-width'));
    const ring = pxOf(resolved('width', '--nph-focus-ring-width'));
    expect(gap).toBeGreaterThan(2 * border + ring);
  });

  it('keeps the height of the buttons and the width of each button', async () => {
    const group = await mount();
    const height = pxOf(resolved('height', '--nph-control-height-default'));
    for (const child of buttonsOf(group)) {
      expect(Math.round(child.getBoundingClientRect().height)).toBe(height);
    }
    expect(Math.round(group.getBoundingClientRect().height)).toBe(height);
    expect(Math.round(buttonsOf(group)[0]?.getBoundingClientRect().width ?? 0)).toBe(50);
    const total = buttonsOf(group).reduce((sum, child) => sum + child.getBoundingClientRect().width, 0);
    expect(Math.round(group.getBoundingClientRect().width)).toBe(Math.round(total + 2 * 8));
  });

  it('has no background, border, outline, opacity, padding or transition of its own', async () => {
    const group = await mount();
    const style = getComputedStyle(group);
    expect(style.display).toBe('inline-flex');
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopWidth).toBe('0px');
    expect(style.outlineStyle).toBe('none');
    expect(style.opacity).toBe('1');
    expect(style.paddingTop).toBe('0px');
    expect(style.transitionDuration).toBe('0s');
  });

  it('adds no color: a button in the group paints as the same button alone, in both schemes and in another brand', async () => {
    const BRANDS = [...new Set([...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? ''))];
    const paint = async (element: NphTogglebutton) => {
      await Promise.all(element.shadowRoot?.getAnimations().map((animation) => animation.finished) ?? []);
      const area = element.shadowRoot?.querySelector<HTMLElement>('.surface') as HTMLElement;
      return [
        getComputedStyle(inner(element)).color,
        getComputedStyle(inner(element)).backgroundColor,
        getComputedStyle(inner(element)).borderTopColor,
        getComputedStyle(area).backgroundColor,
        getComputedStyle(area).boxShadow,
      ];
    };
    for (const scheme of ['light', 'dark'] as const) {
      for (const brand of [undefined, BRANDS.at(-1)]) {
        const part = document.createElement('div');
        part.setAttribute('data-nph-color-scheme', scheme);
        if (brand !== undefined) part.setAttribute('data-nph-brand', brand);
        document.body.append(part);
        const group = await mount({ value: ['center'] }, part);
        const alone = document.createElement('nph-togglebutton');
        alone.label = 'Center';
        alone.pressed = true;
        part.append(alone);
        await alone.updateComplete;
        expect(await paint(buttonsOf(group)[1] as NphTogglebutton), `${scheme} ${brand}`).toEqual(await paint(alone));
        part.remove();
      }
    }
  });
});

describe('semantics', () => {
  it('the host is a group named by label', async () => {
    const group = await mount({ label: 'Alignment' });
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Alignment');
  });

  it('a change of label renames the group, and an emptied label removes its own name', async () => {
    const group = await mount({ label: 'Alignment' });
    group.label = 'Text alignment';
    await group.updateComplete;
    expect(group.getAttribute('aria-label')).toBe('Text alignment');
    group.label = '';
    await group.updateComplete;
    expect(group.hasAttribute('aria-label')).toBe(false);
  });

  it('a name the consumer puts on the host is also a name: aria-label and aria-labelledby', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const named = document.createElement('nph-toggle-group');
    named.setAttribute('aria-label', 'View');
    named.append(...VIEW.map(button));
    const heading = document.createElement('h2');
    heading.id = 'subject';
    heading.textContent = 'Subject';
    const labelled = document.createElement('nph-toggle-group');
    labelled.setAttribute('aria-labelledby', 'subject');
    labelled.append(...VIEW.map(button));
    document.body.append(heading, named, labelled);
    await Promise.all([named.updateComplete, labelled.updateComplete]);
    expect(named.hasAttribute('data-nph-rendered')).toBe(true);
    expect(labelled.hasAttribute('data-nph-rendered')).toBe(true);
    expect(named.getAttribute('aria-label')).toBe('View');
    expect(error).not.toHaveBeenCalled();
  });

  it('the buttons stay buttons with aria-pressed inside the group', async () => {
    const group = await mount({ value: ['center'] });
    expect(buttonsOf(group).map((child) => inner(child).getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false']);
    expect(buttonsOf(group).map((child) => inner(child).getAttribute('aria-label'))).toEqual(['Left', 'Center', 'Right']);
    expect(group.querySelector('[role="radio"], [aria-checked]')).toBeNull();
  });

  it('the group is not focusable and takes no Tab stop of its own', async () => {
    const group = await mount();
    expect(group.hasAttribute('tabindex')).toBe(false);
    expect(group.shadowRoot?.querySelector('[tabindex]')).toBeNull();
    group.focus();
    expect(document.activeElement).not.toBe(group);
  });

  it('Tab walks one stop per button, in order, and skips a disabled one', async () => {
    const group = await mount({
      buttons: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center', disabled: true }, { value: 'right', label: 'Right' }],
    });
    const stops: (Element | null)[] = [];
    for (let step = 0; step < 2; step += 1) {
      await userEvent.tab();
      stops.push(document.activeElement);
    }
    expect(stops).toEqual([buttonsOf(group)[0], buttonsOf(group)[2]]);
  });
});

describe('single selection', () => {
  it('with no value, none is checked until the first click (D3)', async () => {
    const group = await mount();
    expect(pressedOf(group)).toEqual([false, false, false]);
  });

  it('starts with the value it receives, and a markup pressed does not override it', async () => {
    const group = document.createElement('nph-toggle-group');
    group.label = 'Alignment';
    group.value = ['right'];
    const spec = ALIGNMENT.map(button);
    spec[0]?.setAttribute('pressed', '');
    group.append(...spec);
    document.body.append(group);
    await settle(group);
    expect(pressedOf(group)).toEqual([false, false, true]);
  });

  it('checking a button unchecks the others and says the new value once', async () => {
    const group = await mount({ value: ['left'] });
    const seen = listen(group);
    await userEvent.click(inner(buttonsOf(group)[2] as NphTogglebutton));
    await settle(group);
    expect(pressedOf(group)).toEqual([false, false, true]);
    expect(group.value).toEqual(['right']);
    expect(seen).toEqual([['right']]);
    expect(buttonsOf(group).map((child) => inner(child).getAttribute('aria-pressed'))).toEqual(['false', 'false', 'true']);
  });

  it('the first click checks the first choice from an empty group', async () => {
    const group = await mount();
    const seen = listen(group);
    await userEvent.click(inner(buttonsOf(group)[1] as NphTogglebutton));
    await settle(group);
    expect(pressedOf(group)).toEqual([false, true, false]);
    expect(seen).toEqual([['center']]);
  });

  it('a click on the checked button does nothing: stays checked, no event, no flicker (D3)', async () => {
    const group = await mount({ value: ['center'] });
    const checked = buttonsOf(group)[1] as NphTogglebutton;
    const groupEvents = listen(group);
    const buttonEvents = vi.fn();
    const clicks = vi.fn();
    checked.addEventListener('nph-change', buttonEvents);
    checked.addEventListener('click', clicks);
    const states: (string | null)[] = [];
    new MutationObserver(() => states.push(inner(checked).getAttribute('aria-pressed'))).observe(inner(checked), {
      attributes: true,
      attributeFilter: ['aria-pressed'],
    });
    await userEvent.click(inner(checked));
    await settle(group);
    expect(checked.pressed).toBe(true);
    expect(group.value).toEqual(['center']);
    expect(groupEvents).toEqual([]);
    expect(buttonEvents).not.toHaveBeenCalled();
    expect(clicks).not.toHaveBeenCalled();
    expect(states).toEqual([]);
  });

  it('Enter and Space on the checked button do nothing either', async () => {
    const group = await mount({ value: ['left'] });
    const seen = listen(group);
    await userEvent.tab();
    expect(document.activeElement).toBe(buttonsOf(group)[0]);
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await settle(group);
    expect(pressedOf(group)).toEqual([true, false, false]);
    expect(seen).toEqual([]);
  });

  it('Enter and Space on an unchecked button check it', async () => {
    const group = await mount({ value: ['left'] });
    const seen = listen(group);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await settle(group);
    expect(pressedOf(group)).toEqual([false, true, false]);
    await userEvent.tab();
    await userEvent.keyboard(' ');
    await settle(group);
    expect(pressedOf(group)).toEqual([false, false, true]);
    expect(seen).toEqual([['center'], ['right']]);
  });

  it('click() on a checked button host does nothing, and on an unchecked one it checks it', async () => {
    const group = await mount({ value: ['left'] });
    const seen = listen(group);
    buttonsOf(group)[0]?.click();
    await settle(group);
    expect(pressedOf(group)).toEqual([true, false, false]);
    buttonsOf(group)[2]?.click();
    await settle(group);
    expect(pressedOf(group)).toEqual([false, false, true]);
    expect(seen).toEqual([['right']]);
  });

  it('a disabled button is not changed by the person, and keeps its own rule', async () => {
    const group = await mount({
      value: ['left'],
      buttons: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center', disabled: true }, { value: 'right', label: 'Right' }],
    });
    const seen = listen(group);
    buttonsOf(group)[1]?.click();
    await settle(group);
    expect(pressedOf(group)).toEqual([true, false, false]);
    expect(seen).toEqual([]);
  });

  it('setting value from code moves the check and never says anything', async () => {
    const group = await mount({ value: ['left'] });
    const seen = listen(group);
    const changes = vi.fn();
    group.addEventListener('nph-change', changes);
    group.value = ['right'];
    await settle(group);
    expect(pressedOf(group)).toEqual([false, false, true]);
    group.value = [];
    await settle(group);
    expect(pressedOf(group)).toEqual([false, false, false]);
    expect(seen).toEqual([]);
    expect(changes).not.toHaveBeenCalled();
  });

  it('a value with two items keeps the first and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ value: ['left', 'right'] });
    expect(group.value).toEqual(['left']);
    expect(pressedOf(group)).toEqual([true, false, false]);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('a value that matches no button checks nothing and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ value: ['justify'] });
    expect(pressedOf(group)).toEqual([false, false, false]);
    expect(warn).toHaveBeenCalledTimes(1);
    group.value = ['justify'];
    await settle(group);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('with an invalid button, the error border stays on the button and the group adds nothing', async () => {
    const group = await mount({
      buttons: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center', invalid: true }, { value: 'right', label: 'Right' }],
    });
    expect(buttonsOf(group).map((child) => child.invalid)).toEqual([false, true, false]);
    expect(group.hasAttribute('invalid')).toBe(false);
    expect(getComputedStyle(group).borderTopWidth).toBe('0px');
  });
});

describe('multiple selection', () => {
  const FORMATTING: ButtonSpec[] = [
    { value: 'bold', label: 'Bold', iconStart: 'bold' },
    { value: 'italic', label: 'Italic', iconStart: 'italic' },
    { value: 'underline', label: 'Underline', iconStart: 'underline' },
  ];

  it('checks and unchecks freely and accumulates the value in the order of the buttons', async () => {
    const group = await mount({ selection: 'multiple', buttons: FORMATTING });
    const seen = listen(group);
    await userEvent.click(inner(buttonsOf(group)[2] as NphTogglebutton));
    await userEvent.click(inner(buttonsOf(group)[0] as NphTogglebutton));
    await settle(group);
    expect(pressedOf(group)).toEqual([true, false, true]);
    expect(group.value).toEqual(['bold', 'underline']);
    await userEvent.click(inner(buttonsOf(group)[2] as NphTogglebutton));
    await settle(group);
    expect(group.value).toEqual(['bold']);
    expect(seen).toEqual([['underline'], ['bold', 'underline'], ['bold']]);
  });

  it('a click on a checked button unchecks it, with no block', async () => {
    const group = await mount({ selection: 'multiple', buttons: FORMATTING, value: ['italic'] });
    await userEvent.click(inner(buttonsOf(group)[1] as NphTogglebutton));
    await settle(group);
    expect(pressedOf(group)).toEqual([false, false, false]);
    expect(group.value).toEqual([]);
  });

  it('the nph-change of each button is not stopped: an ancestor still hears it', async () => {
    const parent = document.createElement('div');
    document.body.append(parent);
    const group = await mount({ selection: 'multiple', buttons: FORMATTING }, parent);
    const heard: boolean[] = [];
    parent.addEventListener('nph-change', (event) => heard.push((event as CustomEvent<{ pressed: boolean }>).detail.pressed));
    await userEvent.click(inner(buttonsOf(group)[0] as NphTogglebutton));
    expect(heard).toEqual([true]);
  });

  it('the event bubbles, crosses the shadow root and cannot be canceled', async () => {
    const parent = document.createElement('div');
    document.body.append(parent);
    const group = await mount({ selection: 'multiple', buttons: FORMATTING }, parent);
    let received: CustomEvent<NphToggleGroupValueChangeDetail> | undefined;
    parent.addEventListener('nph-value-change', (event) => {
      received = event;
    });
    await userEvent.click(inner(buttonsOf(group)[0] as NphTogglebutton));
    expect(received?.bubbles).toBe(true);
    expect(received?.composed).toBe(true);
    expect(received?.cancelable).toBe(false);
    expect(received?.detail.value).toEqual(['bold']);
  });

  it('changing selection to single at run time keeps the first value and warns', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ selection: 'multiple', buttons: FORMATTING, value: ['bold', 'italic'] });
    expect(pressedOf(group)).toEqual([true, true, false]);
    group.selection = 'single';
    await settle(group);
    expect(group.value).toEqual(['bold']);
    expect(pressedOf(group)).toEqual([true, false, false]);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe('the buttons of the group', () => {
  it('a button added later joins the coordination, and one removed leaves it', async () => {
    const group = await mount({ value: ['left'] });
    const added = button({ value: 'justify', label: 'Justify', iconStart: 'align-left' });
    group.append(added);
    await settle(group);
    await new Promise((resolve) => setTimeout(resolve));
    await userEvent.click(inner(added));
    await settle(group);
    expect(pressedOf(group)).toEqual([false, false, false, true]);
    expect(group.value).toEqual(['justify']);
    added.remove();
    await group.updateComplete;
    expect(buttonsOf(group).length).toBe(3);
  });

  it('a button that gets its value after the first render is picked up by the next update', async () => {
    const group = await mount({ buttons: [{ label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] });
    expect(pressedOf(group)).toEqual([false, false, false]);
    buttonsOf(group)[0]?.setAttribute('value', 'left');
    group.value = ['left'];
    await settle(group);
    expect(pressedOf(group)).toEqual([true, false, false]);
  });
});

describe('composition warnings: the group still renders (D2, D4)', () => {
  async function warnings(spec: GroupSpec): Promise<{ group: NphToggleGroup; warn: ReturnType<typeof vi.spyOn>; error: ReturnType<typeof vi.spyOn> }> {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = await mount(spec);
    return { group, warn, error };
  }

  it('fewer than two buttons: renders and warns once (D2)', async () => {
    const { group, warn, error } = await warnings({ buttons: [{ value: 'only', label: 'Only', iconStart: 'bold' }] });
    expect(group.hasAttribute('data-nph-rendered')).toBe(true);
    expect(group.getBoundingClientRect().width).toBeGreaterThan(0);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
  });

  it('no buttons at all: renders (empty) and warns once', async () => {
    const { group, warn } = await warnings({ buttons: [] });
    expect(group.hasAttribute('data-nph-rendered')).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('two, three and many buttons do not warn: no maximum in code (D2)', async () => {
    for (const count of [2, 3, 7]) {
      const buttons = Array.from({ length: count }, (_, index) => ({ value: `v${index}`, text: `Option ${index}` }));
      const { warn } = await warnings({ buttons });
      expect(warn, String(count)).not.toHaveBeenCalled();
      document.body.replaceChildren();
    }
  });

  it('a child that is not an nph-togglebutton warns and stays in the page', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const group = await mount({ buttons: VIEW });
    const stranger = document.createElement('span');
    group.append(stranger);
    await settle(group);
    await new Promise((resolve) => setTimeout(resolve));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(stranger.isConnected).toBe(true);
  });

  it('a button without value, or with an empty one, warns once and never joins the selection', async () => {
    const { group, warn } = await warnings({
      value: ['list'],
      buttons: [{ value: 'list', text: 'List' }, { text: 'Grid' }, { value: '  ', text: 'Table' }],
    });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(pressedOf(group)).toEqual([true, false, false]);
  });

  it('a repeated value warns once', async () => {
    const { warn } = await warnings({ buttons: [{ value: 'a', text: 'A' }, { value: 'a', text: 'B' }] });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('buttons with text mixed with icon-only buttons warn once (D4)', async () => {
    const { group, warn, error } = await warnings({ buttons: [{ value: 'a', text: 'List' }, { value: 'b', label: 'Grid' }] });
    expect(group.hasAttribute('data-nph-rendered')).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
  });

  it('all with text, or all icon-only, do not warn', async () => {
    const { warn } = await warnings({ buttons: VIEW });
    expect(warn).not.toHaveBeenCalled();
    document.body.replaceChildren();
    const icons = await warnings({ buttons: ALIGNMENT });
    expect(icons.warn).not.toHaveBeenCalled();
  });

  it('a problem that stays does not repeat when the person toggles', async () => {
    const { group, warn } = await warnings({ buttons: [{ value: 'a', text: 'A' }, { value: 'a', text: 'B' }] });
    await userEvent.click(inner(buttonsOf(group)[0] as NphTogglebutton));
    await settle(group);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe('invalid input: it renders nothing and says why, once per cause', () => {
  it('a selection outside single and multiple', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = await mount({ selection: 'radio' });
    expect(group.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(group).display).toBe('none');
    expect(group.getBoundingClientRect().width).toBe(0);
    expect(group.shadowRoot?.querySelector('slot')).toBeNull();
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('no name at all', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = await mount({ label: null });
    expect(group.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(group).display).toBe('none');
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a label of spaces is no name', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = await mount({ label: '   ' });
    expect(group.hasAttribute('data-nph-rendered')).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('both causes together say two things', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await mount({ label: null, selection: 'radio' });
    expect(error).toHaveBeenCalledTimes(2);
  });

  it('a valid value set later makes it draw, and no new error appears', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = await mount({ selection: 'radio', value: ['left'] });
    expect(error).toHaveBeenCalledTimes(1);
    group.selection = 'single';
    await settle(group);
    expect(group.hasAttribute('data-nph-rendered')).toBe(true);
    expect(pressedOf(group)).toEqual([true, false, false]);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a valid group does not log anything', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await mount();
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('the CSS consumes only space/inline, and the token exists in tokens.css', () => {
    expect(used).toEqual(new Set(['--nph-space-inline']));
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('design.md names space/inline for the buttons of a group', () => {
    const entry = /space\/inline:\s*\n\s*css: '--nph-space-inline'[\s\S]*?use: "([^"]*)"/.exec(designMd);
    expect(entry?.[1]).toMatch(/buttons of a group/);
  });

  it('never consumes a core or theme token and writes no literal value', () => {
    expect(cssWithoutComments).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b\d+(\.\d+)?(px|rem|em|ms|s)\b/);
    expect(cssWithoutComments).not.toMatch(/\bcolor\s*:|background|border|outline|transition|animation|opacity|padding|margin/);
  });
});
