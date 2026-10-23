/**
 * Tests of `nph-slider` (P94), in a real browser (P21, item 5): the pointer, the keyboard,
 * the form submission, the measures and the accessibility tree only exist where there is
 * layout and a form.
 *
 * They prove the contract accepted in Figma (board `1636:46`, frame `1925:642`, set
 * `1636:44`) and P94: the API, the scale and its rounding, the keyboard and the pointer, the
 * events, the form association (value, range entries, reset, restore, disabled fieldset),
 * the accessible name and description, the optional parts, the states and their precedence,
 * the value balloon, the field contract of P83 with the real `nph-field`, the invalid input
 * and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-slider.css?raw';
import '../nph-field/nph-field';
import '../nph-label/nph-label';
import type { NphInput } from '../nph-input/nph-input';
import type { NphTooltip } from '../nph-tooltip/nph-tooltip';
import { NPH_SLIDER_MODES, NPH_SLIDER_ORIENTATIONS, NphSlider } from './nph-slider';

type Props = Partial<
  Pick<
    NphSlider,
    | 'orientation'
    | 'mode'
    | 'min'
    | 'max'
    | 'step'
    | 'value'
    | 'start'
    | 'end'
    | 'name'
    | 'text'
    | 'limits'
    | 'marks'
    | 'inputs'
    | 'steppers'
    | 'startLabel'
    | 'endLabel'
    | 'decreaseLabel'
    | 'increaseLabel'
    | 'label'
    | 'description'
    | 'required'
    | 'disabled'
    | 'invalid'
  >
>;

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const RANGE: Props = { mode: 'range', label: 'Price', startLabel: 'Minimum price', endLabel: 'Maximum price' };

async function mount(props: Props = { label: 'Volume' }, parent: HTMLElement = document.body): Promise<NphSlider> {
  const element = document.createElement('nph-slider');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

/** Mounts from markup, so the attributes arrive as a parser would give them. */
async function markup(source: string, parent: HTMLElement = document.body): Promise<HTMLElement> {
  const holder = document.createElement('div');
  holder.innerHTML = source;
  parent.append(holder);
  const pieces = [...holder.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>('nph-slider, nph-label, nph-field')];
  await Promise.all(pieces.map((element) => element.updateComplete));
  return holder;
}

function thumbs(element: NphSlider): HTMLElement[] {
  return [...(element.shadowRoot?.querySelectorAll<HTMLElement>('[role="slider"]') ?? [])];
}

function thumb(element: NphSlider, index = 0): HTMLElement {
  const found = thumbs(element)[index];
  if (!found) throw new Error(`no thumb ${index}`);
  return found;
}

function track(element: NphSlider): HTMLElement {
  const found = element.shadowRoot?.querySelector<HTMLElement>('.track');
  if (!found) throw new Error('no track');
  return found;
}

function fields(element: NphSlider): NphInput[] {
  return [...(element.shadowRoot?.querySelectorAll<NphInput>('nph-input') ?? [])];
}

function steppers(element: NphSlider): HTMLElement[] {
  return [...(element.shadowRoot?.querySelectorAll<HTMLElement>('nph-button') ?? [])];
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

function px(token: string): number {
  return Number.parseFloat(resolved('width', token));
}

function color(token: string): string {
  return resolved('color', token);
}

/** A pointer press at a fraction of the track, from 0 to 1, and its release. */
function pointer(element: NphSlider, type: 'pointerdown' | 'pointermove' | 'pointerup', fraction: number): void {
  const box = track(element).getBoundingClientRect();
  const vertical = element.orientation === 'vertical';
  const clientX = vertical ? box.left + box.width / 2 : box.left + box.width * fraction;
  const clientY = vertical ? box.bottom - box.height * fraction : box.top + box.height / 2;
  track(element).dispatchEvent(
    new PointerEvent(type, { bubbles: true, composed: true, button: 0, pointerId: 1, isPrimary: true, clientX, clientY }),
  );
}

/** The node of a thumb in the accessibility tree of Chromium, as the `nph-input` test reads it. */
interface AXNode {
  role?: { value?: string };
  name?: { value?: string };
  description?: { value?: string };
}

async function accessibleNodeOf(target: HTMLElement): Promise<AXNode> {
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
  it('defines nph-slider only once', () => {
    expect(customElements.get('nph-slider')).toBe(NphSlider);
  });

  it('the public API is exactly the one in P94', () => {
    const declared = [...(NphSlider as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(
      [
        'decreaseLabel',
        'description',
        'disabled',
        'end',
        'endLabel',
        'increaseLabel',
        'inputs',
        'invalid',
        'label',
        'limits',
        'marks',
        'max',
        'min',
        'mode',
        'name',
        'orientation',
        'required',
        'start',
        'startLabel',
        'step',
        'steppers',
        'text',
        'value',
      ].sort(),
    );
  });

  it('the orientations and modes are the ones of the set', () => {
    expect([...NPH_SLIDER_ORIENTATIONS]).toEqual(['horizontal', 'vertical']);
    expect([...NPH_SLIDER_MODES]).toEqual(['single', 'range']);
  });

  it('the defaults: horizontal, single, 0 to 100 by 1, the value in the middle, no part turned on', async () => {
    const element = await mount();
    expect(element.orientation).toBe('horizontal');
    expect(element.mode).toBe('single');
    expect([element.min, element.max, element.step]).toEqual([0, 100, 1]);
    expect(element.value).toBe(50);
    expect(element.name).toBeNull();
    expect(element.text).toBe('');
    expect([element.limits, element.marks, element.inputs, element.steppers]).toEqual([false, false, false, false]);
    expect([element.required, element.disabled, element.invalid]).toEqual([false, false, false]);
    expect(thumbs(element)).toHaveLength(1);
  });

  it('range starts at the ends of the scale, with two thumbs', async () => {
    const element = await mount(RANGE);
    expect([element.start, element.end]).toEqual([0, 100]);
    expect(thumbs(element)).toHaveLength(2);
  });

  it('orientation, mode, name, required, disabled and invalid reflect to attributes', async () => {
    const element = await mount({ label: 'Volume', orientation: 'vertical', mode: 'range', name: 'volume', required: true, disabled: true, invalid: true });
    expect(element.getAttribute('orientation')).toBe('vertical');
    expect(element.getAttribute('mode')).toBe('range');
    expect(element.getAttribute('name')).toBe('volume');
    for (const name of ['required', 'disabled', 'invalid']) {
      expect(element.hasAttribute(name), name).toBe(true);
    }
  });

  it('is form-associated, with an open shadow root and delegated focus', async () => {
    const element = await mount();
    expect((NphSlider as unknown as { formAssociated: boolean }).formAssociated).toBe(true);
    expect(element.shadowRoot?.mode).toBe('open');
    expect(element.shadowRoot?.delegatesFocus).toBe(true);
  });

  it('host focus goes to the first thumb', async () => {
    const element = await mount(RANGE);
    element.focus();
    expect(element.shadowRoot?.activeElement).toBe(thumb(element, 0));
  });

  it('has no slot and no part, and the host has no tabindex', async () => {
    const element = await mount({ ...RANGE, limits: true, inputs: true, steppers: true, decreaseLabel: 'Less', increaseLabel: 'More' });
    expect(element.shadowRoot?.querySelector('slot, [part]')).toBeNull();
    expect(element.hasAttribute('tabindex')).toBe(false);
  });
});

describe('value: the attribute is the default, the property is the current value', () => {
  it('the value attribute is the initial value, rounded to the step and kept inside the scale', async () => {
    const holder = await markup('<nph-slider label="Volume" value="42.4"></nph-slider><nph-slider label="Volume" value="140"></nph-slider>');
    const [first, second] = [...holder.querySelectorAll('nph-slider')] as NphSlider[];
    expect(first?.value).toBe(42);
    expect(second?.value).toBe(100);
  });

  it('start and end attributes in range; start never passes end', async () => {
    const holder = await markup('<nph-slider mode="range" label="Price" start="80" end="20"></nph-slider>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    expect([element.start, element.end]).toEqual([20, 20]);
  });

  it('a decimal step keeps the digits of the step', async () => {
    const element = await mount({ label: 'Ratio', min: 0, max: 1, step: 0.1, value: 0.3 });
    expect(element.value).toBe(0.3);
    thumb(element).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(element.value).toBe(0.4);
  });

  it('a max off the step stops at the last step below it', async () => {
    const element = await mount({ label: 'Count', min: 0, max: 10, step: 3, value: 10 });
    expect(element.value).toBe(9);
  });

  it('the attribute applies while the slider is not dirty, and no longer after the property is set', async () => {
    const holder = await markup('<nph-slider label="Volume" value="10"></nph-slider>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    element.setAttribute('value', '20');
    expect(element.value).toBe(20);
    element.value = 30;
    element.setAttribute('value', '40');
    expect(element.value).toBe(30);
    expect(element.getAttribute('value')).toBe('40');
  });

  it('the value is not reflected: moving the slider never writes the attribute', async () => {
    const element = await mount();
    thumb(element).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(element.value).toBe(51);
    expect(element.hasAttribute('value')).toBe(false);
  });

  it('setting a value from code fires no event', async () => {
    const element = await mount(RANGE);
    const spy = vi.fn();
    element.addEventListener('input', spy);
    element.addEventListener('change', spy);
    element.start = 10;
    element.end = 90;
    await element.updateComplete;
    expect(spy).not.toHaveBeenCalled();
    expect([element.start, element.end]).toEqual([10, 90]);
  });
});

describe('keyboard', () => {
  it('arrows move one step; Right and Up raise, Left and Down lower', async () => {
    const element = await mount({ label: 'Volume', value: 50 });
    thumb(element).focus();
    await userEvent.keyboard('{ArrowRight}{ArrowUp}');
    expect(element.value).toBe(52);
    await userEvent.keyboard('{ArrowLeft}{ArrowDown}{ArrowDown}');
    expect(element.value).toBe(49);
  });

  it('Page Up and Page Down move a tenth of the scale; Home and End go to the ends', async () => {
    const element = await mount({ label: 'Volume', value: 50 });
    thumb(element).focus();
    await userEvent.keyboard('{PageUp}');
    expect(element.value).toBe(60);
    await userEvent.keyboard('{PageDown}{PageDown}');
    expect(element.value).toBe(40);
    await userEvent.keyboard('{Home}');
    expect(element.value).toBe(0);
    await userEvent.keyboard('{End}');
    expect(element.value).toBe(100);
  });

  it('in range, each thumb stops at the other, and Home and End stop there too', async () => {
    const element = await mount({ ...RANGE, start: 40, end: 60 });
    thumb(element, 0).focus();
    await userEvent.keyboard('{End}');
    expect(element.start).toBe(60);
    thumb(element, 1).focus();
    await userEvent.keyboard('{Home}');
    expect(element.end).toBe(60);
    await userEvent.keyboard('{ArrowLeft}');
    expect(element.end).toBe(60);
  });

  it('Tab goes through the thumbs in order', async () => {
    const element = await mount(RANGE);
    element.focus();
    await userEvent.keyboard('{Tab}');
    expect(element.shadowRoot?.activeElement).toBe(thumb(element, 1));
  });

  it('the ARIA values follow the value and the bounds of each thumb', async () => {
    const element = await mount({ ...RANGE, start: 20, end: 70 });
    const [start, end] = thumbs(element) as [HTMLElement, HTMLElement];
    expect([start.getAttribute('aria-valuemin'), start.getAttribute('aria-valuemax'), start.getAttribute('aria-valuenow')]).toEqual(['0', '70', '20']);
    expect([end.getAttribute('aria-valuemin'), end.getAttribute('aria-valuemax'), end.getAttribute('aria-valuenow')]).toEqual(['20', '100', '70']);
    expect(start.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('aria-valuetext is the number in the language of the page', async () => {
    const holder = document.createElement('div');
    holder.lang = 'pt-BR';
    document.body.append(holder);
    const element = await mount({ label: 'Ratio', min: 0, max: 2000, step: 0.5, value: 1234.5 }, holder);
    expect(thumb(element).getAttribute('aria-valuetext')).toBe('1.234,5');
  });
});

describe('pointer', () => {
  it('a press on the track moves the thumb there, focuses it and fires input; the release fires change', async () => {
    const element = await mount({ label: 'Volume', value: 50 });
    const events: string[] = [];
    element.addEventListener('input', () => events.push('input'));
    element.addEventListener('change', () => events.push('change'));
    pointer(element, 'pointerdown', 0.2);
    expect(element.value).toBe(20);
    expect(element.shadowRoot?.activeElement).toBe(thumb(element));
    pointer(element, 'pointermove', 0.3);
    expect(element.value).toBe(30);
    pointer(element, 'pointerup', 0.3);
    expect(events).toEqual(['input', 'input', 'change']);
  });

  it('a press and release that end on the same value fire no change', async () => {
    const element = await mount({ label: 'Volume', value: 50 });
    const change = vi.fn();
    element.addEventListener('change', change);
    pointer(element, 'pointerdown', 0.2);
    pointer(element, 'pointermove', 0.5);
    pointer(element, 'pointerup', 0.5);
    expect(change).not.toHaveBeenCalled();
  });

  it('in range, the press moves the nearest thumb', async () => {
    const element = await mount({ ...RANGE, start: 20, end: 80 });
    pointer(element, 'pointerdown', 0.7);
    pointer(element, 'pointerup', 0.7);
    expect([element.start, element.end]).toEqual([20, 70]);
    pointer(element, 'pointerdown', 0.3);
    pointer(element, 'pointerup', 0.3);
    expect([element.start, element.end]).toEqual([30, 70]);
  });

  it('vertical: the minimum is at the bottom', async () => {
    const element = await mount({ label: 'Volume', orientation: 'vertical', value: 50 });
    pointer(element, 'pointerdown', 0.9);
    pointer(element, 'pointerup', 0.9);
    expect(element.value).toBe(90);
    expect(thumb(element).getAttribute('aria-orientation')).toBe('vertical');
  });

  it('the balloon stays open while the thumb is dragged, and closes on release', async () => {
    const element = await mount({ label: 'Volume', value: 50 });
    const tooltip = element.shadowRoot?.querySelector('nph-tooltip') as NphTooltip;
    pointer(element, 'pointerdown', 0.4);
    await element.updateComplete;
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    expect(tooltip.text).toBe('40');
    pointer(element, 'pointerup', 0.4);
    await element.updateComplete;
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
  });
});

describe('the value balloon', () => {
  it('each thumb has an nph-tooltip that points at it, with the formatted value', async () => {
    const element = await mount({ ...RANGE, start: 1500, end: 2500, max: 5000 });
    const tooltips = [...(element.shadowRoot?.querySelectorAll<NphTooltip>('nph-tooltip') ?? [])];
    expect(tooltips.map((tooltip) => tooltip.getAttribute('for'))).toEqual(thumbs(element).map((item) => item.id));
    expect(tooltips.map((tooltip) => tooltip.text)).toEqual(['1,500', '2,500']);
  });

  it('opens on keyboard focus and sits above the thumb, following it', async () => {
    const holder = document.createElement('div');
    holder.style.paddingBlockStart = '120px';
    document.body.append(holder);
    const element = await mount({ label: 'Volume', value: 50 }, holder);
    const tooltip = element.shadowRoot?.querySelector('nph-tooltip') as NphTooltip;
    await userEvent.keyboard('{Tab}');
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    const before = tooltip.shadowRoot?.querySelector<HTMLElement>('[popover]')?.getBoundingClientRect();
    await userEvent.keyboard('{End}');
    await element.updateComplete;
    await tooltip.updateComplete;
    await nextFrame();
    const box = thumb(element).getBoundingClientRect();
    const after = tooltip.shadowRoot?.querySelector<HTMLElement>('[popover]')?.getBoundingClientRect();
    expect(after).toBeDefined();
    expect(Math.abs((after?.left ?? 0) + (after?.width ?? 0) / 2 - (box.left + box.width / 2))).toBeLessThan(1);
    expect(after?.bottom ?? 0).toBeLessThanOrEqual(box.top);
    expect(after?.left).not.toBe(before?.left);
  });

  it('disabled: no balloon', async () => {
    const element = await mount({ label: 'Volume', disabled: true });
    expect(element.shadowRoot?.querySelector('nph-tooltip')).toBeNull();
  });
});

describe('events', () => {
  it('input bubbles and crosses shadow roots; change bubbles and does not', async () => {
    const element = await mount();
    const seen: Array<[string, boolean, boolean]> = [];
    for (const type of ['input', 'change']) {
      element.addEventListener(type, (event) => seen.push([event.type, event.bubbles, event.composed]));
    }
    thumb(element).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(seen).toEqual([
      ['input', true, true],
      ['change', true, false],
    ]);
  });

  it('a key at the end of the scale fires nothing', async () => {
    const element = await mount({ label: 'Volume', value: 100 });
    const spy = vi.fn();
    element.addEventListener('input', spy);
    thumb(element).focus();
    await userEvent.keyboard('{ArrowRight}{End}');
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('form association', () => {
  it('single submits name=value', async () => {
    const holder = await markup('<form><nph-slider label="Volume" name="volume" value="30"></nph-slider></form>');
    const data = new FormData(holder.querySelector('form') as HTMLFormElement);
    expect(data.getAll('volume')).toEqual(['30']);
  });

  it('range submits two entries under the same name, start and end', async () => {
    const holder = await markup('<form><nph-slider mode="range" label="Price" start-label="Min" end-label="Max" name="price" start="10" end="90"></nph-slider></form>');
    const data = new FormData(holder.querySelector('form') as HTMLFormElement);
    expect(data.getAll('price')).toEqual(['10', '90']);
  });

  it('without a name, nothing is submitted', async () => {
    const holder = await markup('<form><nph-slider mode="range" label="Price" start-label="Min" end-label="Max"></nph-slider><nph-slider label="Volume"></nph-slider></form>');
    expect([...new FormData(holder.querySelector('form') as HTMLFormElement).keys()]).toEqual([]);
  });

  it('a name set later is read on the next submission', async () => {
    const holder = await markup('<form><nph-slider mode="range" label="Price" start-label="Min" end-label="Max" start="5"></nph-slider></form>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    element.name = 'price';
    await element.updateComplete;
    expect(new FormData(holder.querySelector('form') as HTMLFormElement).getAll('price')).toEqual(['5', '100']);
  });

  it('reset brings the attributes back and makes the slider clean again', async () => {
    const holder = await markup('<form><nph-slider label="Volume" name="volume" value="30"></nph-slider></form>');
    const form = holder.querySelector('form') as HTMLFormElement;
    const element = holder.querySelector('nph-slider') as NphSlider;
    thumb(element).focus();
    await userEvent.keyboard('{End}');
    expect(element.value).toBe(100);
    form.reset();
    expect(element.value).toBe(30);
    element.setAttribute('value', '35');
    expect(element.value).toBe(35);
  });

  it('restore: single takes the string, range takes "start end"', async () => {
    const single = await mount({ label: 'Volume' });
    single.formStateRestoreCallback('12');
    expect(single.value).toBe(12);
    const range = await mount(RANGE);
    range.formStateRestoreCallback('15 85');
    expect([range.start, range.end]).toEqual([15, 85]);
    range.formStateRestoreCallback(new FormData());
    expect([range.start, range.end]).toEqual([15, 85]);
  });

  it('a disabled fieldset disables it: out of the form data, out of Tab, and faded', async () => {
    const holder = await markup('<form><fieldset disabled><nph-slider label="Volume" name="volume"></nph-slider></fieldset></form>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    await element.updateComplete;
    expect(new FormData(holder.querySelector('form') as HTMLFormElement).has('volume')).toBe(false);
    expect(element.matches(':disabled')).toBe(true);
    expect(thumb(element).tabIndex).toBe(-1);
    expect(thumb(element).getAttribute('aria-disabled')).toBe('true');
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('the first legend of a disabled fieldset is not disabled', async () => {
    const holder = await markup('<fieldset disabled><legend><nph-slider label="Volume"></nph-slider></legend></fieldset>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    await element.updateComplete;
    expect(thumb(element).tabIndex).toBe(0);
  });

  it('the host exposes form and labels', async () => {
    const holder = await markup('<form><nph-label for="s" text="Volume"></nph-label><nph-slider id="s"></nph-slider></form>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    expect(element.form).toBe(holder.querySelector('form'));
    expect(element.labels).toHaveLength(1);
  });
});

describe('accessible name and description', () => {
  it('single: an associated label names the thumb', async () => {
    const holder = await markup('<nph-label for="s" text="Volume"></nph-label><nph-slider id="s"></nph-slider>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    await nextFrame();
    const node = await accessibleNodeOf(thumb(element));
    expect(node.role?.value).toBe('slider');
    expect(node.name?.value).toBe('Volume');
  });

  it('single: label, then text, name the thumb', async () => {
    const byLabel = await mount({ label: 'Volume', text: 'Brightness' });
    await nextFrame();
    expect((await accessibleNodeOf(thumb(byLabel))).name?.value).toBe('Volume');
    const byText = await mount({ text: 'Brightness' });
    await nextFrame();
    expect((await accessibleNodeOf(thumb(byText))).name?.value).toBe('Brightness');
  });

  it('range: the group takes the name of the slider, each thumb its own', async () => {
    const element = await mount(RANGE);
    await nextFrame();
    expect(track(element).getAttribute('role')).toBe('group');
    expect((await accessibleNodeOf(track(element))).name?.value).toBe('Price');
    expect((await accessibleNodeOf(thumb(element, 0))).name?.value).toBe('Minimum price');
    expect((await accessibleNodeOf(thumb(element, 1))).name?.value).toBe('Maximum price');
  });

  it('description is read as the description of each thumb', async () => {
    const element = await mount({ ...RANGE, description: 'Choose a price between 0 and 100.' });
    await nextFrame();
    for (const item of thumbs(element)) {
      expect((await accessibleNodeOf(item)).description?.value).toContain('Choose a price between 0 and 100.');
    }
  });

  it('without a name, it renders and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount({});
    await nextFrame();
    await nextFrame();
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('no accessible name'))).toHaveLength(1);
  });

  it('a range without start-label and end-label renders and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount({ mode: 'range', label: 'Price' });
    element.start = 10;
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('start-label and end-label'))).toHaveLength(1);
  });

  it('invalid marks each thumb aria-invalid; disabled wins', async () => {
    const element = await mount({ ...RANGE, invalid: true });
    for (const item of thumbs(element)) {
      expect(item.getAttribute('aria-invalid')).toBe('true');
    }
    element.disabled = true;
    await element.updateComplete;
    for (const item of thumbs(element)) {
      expect(item.hasAttribute('aria-invalid')).toBe(false);
      expect(item.getAttribute('aria-disabled')).toBe('true');
    }
  });

  it('required is accepted from nph-field, and no thumb is aria-required', async () => {
    const element = await mount({ label: 'Volume', required: true });
    expect(thumb(element).hasAttribute('aria-required')).toBe(false);
  });
});

describe('optional parts', () => {
  it('text: the nph-label and the current value above the track', async () => {
    const element = await mount({ text: 'Brightness', value: 70 });
    const label = element.shadowRoot?.querySelector('nph-label') as HTMLElement & { text: string };
    expect(label.text).toBe('Brightness');
    expect(element.shadowRoot?.querySelector('.current')?.textContent).toBe('70');
    const range = await mount({ ...RANGE, text: 'Price', start: 10, end: 90 });
    expect(range.shadowRoot?.querySelector('.current')?.textContent).toBe('10 – 90');
  });

  it('limits: the minimum and the maximum at the ends; vertical has the minimum at the bottom', async () => {
    const element = await mount({ label: 'Volume', limits: true });
    const limits = [...(element.shadowRoot?.querySelectorAll('.limit') ?? [])];
    expect(limits.map((item) => item.textContent)).toEqual(['0', '100']);
    const vertical = await mount({ label: 'Volume', orientation: 'vertical', limits: true });
    const [top, bottom] = [...(vertical.shadowRoot?.querySelectorAll('.limit') ?? [])] as HTMLElement[];
    expect([top?.textContent, bottom?.textContent]).toEqual(['100', '0']);
    expect((top as HTMLElement).getBoundingClientRect().top).toBeLessThan((bottom as HTMLElement).getBoundingClientRect().top);
  });

  it('marks: one per step, below the track, centered on its value', async () => {
    const element = await mount({ label: 'Rating', min: 1, max: 5, marks: true, value: 3 });
    const marks = [...(element.shadowRoot?.querySelectorAll<HTMLElement>('.mark') ?? [])];
    expect(marks.map((item) => item.textContent)).toEqual(['1', '2', '3', '4', '5']);
    const box = track(element).getBoundingClientRect();
    const middle = marks[2]?.getBoundingClientRect();
    expect(Math.abs((middle?.left ?? 0) + (middle?.width ?? 0) / 2 - (box.left + box.width / 2))).toBeLessThan(1);
    expect((middle?.top ?? 0) - box.bottom).toBeCloseTo(px('--nph-space-stack-tight'), 0);
  });

  it('inputs: one nph-input in single, one at each end in range, size default, named', async () => {
    const element = await mount({ label: 'Volume', inputs: true, value: 30 });
    expect(fields(element).map((item) => [item.value, item.label, item.size])).toEqual([['30', 'Volume', 'default']]);
    const range = await mount({ ...RANGE, inputs: true, start: 10, end: 90 });
    expect(fields(range).map((item) => [item.value, item.label])).toEqual([
      ['10', 'Minimum price'],
      ['90', 'Maximum price'],
    ]);
  });

  it('inputs: a field takes one part of the line and the track three (D5)', async () => {
    const element = await mount({ ...RANGE, inputs: true });
    const scale = element.shadowRoot?.querySelector('.scale') as HTMLElement;
    const sides = [...(element.shadowRoot?.querySelectorAll<HTMLElement>('.side') ?? [])];
    for (const side of sides) {
      expect(scale.getBoundingClientRect().width).toBeCloseTo(side.getBoundingClientRect().width * 3, 0);
    }
  });

  it('inputs: the number is applied on change, rounded and kept inside its bounds; text that is not a number goes back', async () => {
    const element = await mount({ ...RANGE, inputs: true, start: 10, end: 90 });
    const [start] = fields(element) as [NphInput];
    const events: string[] = [];
    element.addEventListener('input', () => events.push('input'));
    element.addEventListener('change', () => events.push('change'));
    const inner = start.shadowRoot?.querySelector('input') as HTMLInputElement;
    await userEvent.fill(inner, '95.6');
    await userEvent.keyboard('{Enter}');
    inner.blur();
    await element.updateComplete;
    expect(element.start).toBe(90);
    expect(events).toEqual(['input', 'change']);
    await userEvent.fill(inner, 'abc');
    inner.blur();
    await element.updateComplete;
    expect(element.start).toBe(90);
    expect(start.value).toBe('90');
  });

  it('inputs: typing in the field does not reach the consumer as input', async () => {
    const element = await mount({ label: 'Volume', inputs: true });
    const spy = vi.fn();
    element.addEventListener('input', spy);
    const inner = fields(element)[0]?.shadowRoot?.querySelector('input') as HTMLInputElement;
    await userEvent.type(inner, '1');
    expect(spy).not.toHaveBeenCalled();
  });

  it('steppers: secondary ghost icon-only buttons, minus and plus, named; each click is one step', async () => {
    const element = await mount({ label: 'Volume', steppers: true, decreaseLabel: 'Decrease volume', increaseLabel: 'Increase volume', value: 50 });
    const [minus, plus] = steppers(element) as [HTMLElement & { label: string }, HTMLElement & { label: string }];
    expect([minus.getAttribute('severity'), minus.getAttribute('emphasis'), minus.getAttribute('size'), minus.getAttribute('icon-start')]).toEqual([
      'secondary',
      'ghost',
      'default',
      'minus',
    ]);
    expect(plus.getAttribute('icon-start')).toBe('plus');
    expect([minus.label, plus.label]).toEqual(['Decrease volume', 'Increase volume']);
    const events: string[] = [];
    element.addEventListener('input', () => events.push('input'));
    element.addEventListener('change', () => events.push('change'));
    plus.click();
    plus.click();
    minus.click();
    expect(element.value).toBe(51);
    expect(events).toEqual(['input', 'change', 'input', 'change', 'input', 'change']);
  });

  it('steppers in range move the thumb used last, the start by default (D2)', async () => {
    const element = await mount({ ...RANGE, steppers: true, decreaseLabel: 'Less', increaseLabel: 'More', start: 20, end: 80 });
    const [minus, plus] = steppers(element) as [HTMLElement, HTMLElement];
    plus.click();
    expect([element.start, element.end]).toEqual([21, 80]);
    thumb(element, 1).focus();
    minus.click();
    expect([element.start, element.end]).toEqual([21, 79]);
  });

  it('the order beside the track: field, minus, minimum, track, maximum, plus, field (D1)', async () => {
    const element = await mount({ ...RANGE, limits: true, inputs: true, steppers: true, decreaseLabel: 'Less', increaseLabel: 'More' });
    const row = element.shadowRoot?.querySelector('.row') as HTMLElement;
    const order = [...row.children]
      .filter((child) => !child.classList.contains('marks-row'))
      .map((child) => (child.querySelector('nph-input') ? 'field' : child.querySelector('nph-button')?.getAttribute('icon-start') ?? (child.querySelector('.limit') ? 'limit' : 'track')));
    expect(order).toEqual(['field', 'minus', 'limit', 'track', 'limit', 'plus', 'field']);
    const boxes = [...row.children].map((child) => child.getBoundingClientRect());
    for (let index = 1; index < boxes.length; index += 1) {
      expect((boxes[index]?.left ?? 0) - (boxes[index - 1]?.right ?? 0)).toBeCloseTo(px('--nph-space-inline'), 0);
    }
  });
});

describe('measures and anatomy', () => {
  it('the default width is layout/input-width; the parent may stretch it', async () => {
    const element = await mount();
    expect(element.getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-input-width'), 0);
    element.style.inlineSize = '100%';
    const holder = document.createElement('div');
    holder.style.inlineSize = '640px';
    holder.append(element);
    document.body.append(holder);
    await element.updateComplete;
    expect(element.getBoundingClientRect().width).toBeCloseTo(640, 0);
  });

  it('the track is space/inline-tight thick, color/input empty and color/primary active, radius full', async () => {
    const element = await mount({ label: 'Volume', value: 25 });
    const rail = element.shadowRoot?.querySelector('.rail') as HTMLElement;
    const fill = element.shadowRoot?.querySelector('.fill') as HTMLElement;
    expect(rail.getBoundingClientRect().height).toBeCloseTo(px('--nph-space-inline-tight'), 1);
    expect(getComputedStyle(rail).backgroundColor).toBe(color('--nph-color-input'));
    expect(getComputedStyle(fill).backgroundColor).toBe(color('--nph-color-primary'));
    expect(fill.getBoundingClientRect().width).toBeCloseTo(rail.getBoundingClientRect().width / 4, 0);
  });

  it('range: the active part sits between the two thumbs', async () => {
    const element = await mount({ ...RANGE, start: 20, end: 60 });
    const fill = (element.shadowRoot?.querySelector('.fill') as HTMLElement).getBoundingClientRect();
    const [start, end] = thumbs(element).map((item) => item.getBoundingClientRect());
    expect(fill.left).toBeCloseTo((start?.left ?? 0) + (start?.width ?? 0) / 2, 0);
    expect(fill.right).toBeCloseTo((end?.left ?? 0) + (end?.width ?? 0) / 2, 0);
  });

  it('the thumb: icon/size-sm, color/background, border/width in color/primary-border, centered on its value', async () => {
    const element = await mount({ label: 'Volume', value: 50 });
    const item = thumb(element);
    const box = item.getBoundingClientRect();
    const style = getComputedStyle(item);
    expect(box.width).toBeCloseTo(px('--nph-icon-size-sm'), 1);
    expect(box.height).toBeCloseTo(px('--nph-icon-size-sm'), 1);
    expect(style.backgroundColor).toBe(color('--nph-color-background'));
    expect(style.borderTopColor).toBe(color('--nph-color-primary-border'));
    expect(Number.parseFloat(style.borderTopWidth)).toBeCloseTo(px('--nph-border-width'), 1);
    const line = track(element).getBoundingClientRect();
    expect(box.left + box.width / 2).toBeCloseTo(line.left + line.width / 2, 0);
  });

  it('the touch target is a circle of control/height-large centered on the thumb', async () => {
    const element = await mount();
    const before = getComputedStyle(thumb(element), '::before');
    const size = px('--nph-control-height-large');
    expect(Number.parseFloat(before.width)).toBeCloseTo(size, 0);
    expect(Number.parseFloat(before.height)).toBeCloseTo(size, 0);
    expect(before.borderRadius).not.toBe('0px');
  });

  it('the vertical track takes layout/input-width of height (D3)', async () => {
    const element = await mount({ label: 'Volume', orientation: 'vertical' });
    expect(track(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-layout-input-width'), 0);
  });

  it('the value beside the label is text/label-md in color/foreground; limits and marks are text/caption in color/muted-foreground', async () => {
    const element = await mount({ text: 'Brightness', limits: true });
    const current = getComputedStyle(element.shadowRoot?.querySelector('.current') as HTMLElement);
    expect(current.color).toBe(color('--nph-color-foreground'));
    expect(current.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    const limit = getComputedStyle(element.shadowRoot?.querySelector('.limit') as HTMLElement);
    expect(limit.color).toBe(color('--nph-color-muted-foreground'));
    expect(limit.fontSize).toBe(resolved('font-size', '--nph-text-caption-font-size'));
  });
});

describe('states and precedence', () => {
  it('focus: the border takes focus/border and the halo focus/halo, on keyboard focus', async () => {
    const element = await mount();
    await userEvent.keyboard('{Tab}');
    const item = thumb(element);
    expect(getComputedStyle(item).borderTopColor).toBe(color('--nph-focus-border'));
    const after = getComputedStyle(item, '::after');
    expect(after.display).toBe('block');
    expect(after.borderTopColor).toBe(color('--nph-focus-halo'));
    expect(Number.parseFloat(after.borderTopWidth)).toBeCloseTo(px('--nph-focus-ring-width'), 1);
  });

  it('error: the border is status/error; error with focus: the halo is focus/halo-error', async () => {
    const element = await mount({ label: 'Volume', invalid: true });
    expect(getComputedStyle(thumb(element)).borderTopColor).toBe(color('--nph-status-error'));
    expect(getComputedStyle(thumb(element), '::after').display).toBe('none');
    await userEvent.keyboard('{Tab}');
    expect(getComputedStyle(thumb(element)).borderTopColor).toBe(color('--nph-status-error'));
    expect(getComputedStyle(thumb(element), '::after').borderTopColor).toBe(color('--nph-focus-halo-error'));
  });

  it('the track does not change with the state', async () => {
    const element = await mount({ label: 'Volume', invalid: true });
    expect(getComputedStyle(element.shadowRoot?.querySelector('.fill') as HTMLElement).backgroundColor).toBe(color('--nph-color-primary'));
  });

  it('disabled: the whole slider fades once, out of Tab, and wins over invalid', async () => {
    const element = await mount({ ...RANGE, invalid: true, disabled: true });
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    for (const item of thumbs(element)) {
      expect(item.tabIndex).toBe(-1);
      expect(getComputedStyle(item).borderTopColor).toBe(color('--nph-color-primary-border'));
    }
  });

  it('disabled: the field and the buttons keep state=default, inert, and do not fade a second time', async () => {
    const element = await mount({ label: 'Volume', disabled: true, invalid: true, inputs: true, steppers: true, decreaseLabel: 'Less', increaseLabel: 'More' });
    const inner = [...fields(element), ...steppers(element)];
    expect(inner).toHaveLength(3);
    for (const part of inner) {
      expect(part.hasAttribute('inert'), part.localName).toBe(true);
      expect(part.hasAttribute('disabled'), part.localName).toBe(false);
      expect(getComputedStyle(part).opacity, part.localName).toBe('1');
    }
    expect(fields(element)[0]?.invalid).toBe(false);
  });

  it('disabled: keys, the pointer and the buttons do nothing', async () => {
    const element = await mount({ label: 'Volume', disabled: true, value: 50 });
    thumb(element).dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    pointer(element, 'pointerdown', 0.1);
    pointer(element, 'pointerup', 0.1);
    expect(element.value).toBe(50);
  });

  it('invalid passes the error state to the inner fields', async () => {
    const element = await mount({ ...RANGE, inputs: true, invalid: true });
    expect(fields(element).map((item) => item.invalid)).toEqual([true, true]);
  });
});

describe('inside nph-field (P83)', () => {
  it('takes the contract: the field names it, describes it, marks it invalid and disables it', async () => {
    const holder = await markup(
      '<nph-field label="Volume" help="Between 0 and 100." error="Choose a lower volume." invalid><nph-slider></nph-slider></nph-field>',
    );
    const element = holder.querySelector('nph-slider') as NphSlider;
    await element.updateComplete;
    await nextFrame();
    expect(element.label).toBe('Volume');
    expect(element.invalid).toBe(true);
    expect(element.description).toContain('Choose a lower volume.');
    expect((await accessibleNodeOf(thumb(element))).name?.value).toBe('Volume');
  });

  it('the field emits no composition warning for the slider', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await markup('<nph-field label="Volume"><nph-slider></nph-slider></nph-field>');
    await nextFrame();
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('[nph-field]'))).toHaveLength(0);
  });

  it('text inside nph-field warns: the label would show twice', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await markup('<nph-field label="Volume"><nph-slider text="Volume"></nph-slider></nph-field>');
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('text inside nph-field'))).toHaveLength(1);
  });

  it('a click on the label of the field focuses the thumb', async () => {
    const holder = await markup('<nph-field label="Volume"><nph-slider></nph-slider></nph-field>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    const field = holder.querySelector('nph-field') as HTMLElement;
    const label = field.shadowRoot?.querySelector('nph-label') ?? field.querySelector('nph-label');
    (label as HTMLElement).click();
    expect(element.shadowRoot?.activeElement).toBe(thumb(element));
  });
});

describe('invalid input', () => {
  const cases: ReadonlyArray<readonly [string, Props, number]> = [
    ['an orientation that does not exist', { label: 'Volume', orientation: 'diagonal' }, 1],
    ['a mode that does not exist', { label: 'Volume', mode: 'multiple' }, 1],
    ['min not below max', { label: 'Volume', min: 10, max: 10 }, 1],
    ['a step of zero', { label: 'Volume', step: 0 }, 1],
    ['a negative step', { label: 'Volume', step: -1 }, 1],
    ['accumulates the causes', { label: 'Volume', orientation: 'diagonal', mode: 'multiple', step: 0 }, 3],
  ];
  for (const [name, props, count] of cases) {
    it(`${name}: nothing and ${count} error(s) in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const element = await mount(props);
      expect(error).toHaveBeenCalledTimes(count);
      for (const call of error.mock.calls) {
        expect(String(call[0])).toContain('[nph-slider]');
      }
      expect(thumbs(element)).toHaveLength(0);
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect(element.getBoundingClientRect().width).toBe(0);
    });
  }

  it('an invalid slider adds nothing to the form data', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const holder = await markup('<form><nph-slider label="Volume" name="volume" step="0"></nph-slider></form>');
    expect(new FormData(holder.querySelector('form') as HTMLFormElement).has('volume')).toBe(false);
  });

  it('marks, inputs and steppers in vertical are not drawn, with one error each; the rest renders', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Volume', orientation: 'vertical', marks: true, inputs: true, steppers: true, decreaseLabel: 'Less', increaseLabel: 'More' });
    expect(error).toHaveBeenCalledTimes(3);
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(element.shadowRoot?.querySelector('.mark, nph-input, nph-button')).toBeNull();
  });

  it('steppers without the two names: the buttons are not drawn, one error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Volume', steppers: true, decreaseLabel: 'Less' });
    expect(error).toHaveBeenCalledTimes(1);
    expect(steppers(element)).toHaveLength(0);
    expect(thumbs(element)).toHaveLength(1);
  });

  it('limits with marks renders and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount({ label: 'Rating', min: 1, max: 5, limits: true, marks: true });
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('limits with marks'))).toHaveLength(1);
  });

  it('moving the slider and changing the state do not repeat the errors', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Volume', steppers: true });
    thumb(element).focus();
    await userEvent.keyboard('{ArrowRight}');
    element.invalid = true;
    element.disabled = true;
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a valid input set later draws the slider', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Volume', step: 0 });
    element.step = 5;
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(element.value).toBe(50);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, and these are the ones the evidence names', () => {
    expect(used).toEqual(
      new Set([
        '--nph-layout-input-width',
        '--nph-state-disabled-opacity',
        '--nph-space-stack-tight',
        '--nph-space-inline',
        '--nph-space-inline-tight',
        '--nph-color-foreground',
        '--nph-color-muted-foreground',
        '--nph-color-input',
        '--nph-color-primary',
        '--nph-color-primary-border',
        '--nph-color-background',
        '--nph-text-label-md-font-family',
        '--nph-text-label-md-font-size',
        '--nph-text-label-md-font-weight',
        '--nph-text-label-md-line-height',
        '--nph-text-label-md-letter-spacing',
        '--nph-text-caption-font-family',
        '--nph-text-caption-font-size',
        '--nph-text-caption-font-weight',
        '--nph-text-caption-line-height',
        '--nph-text-caption-letter-spacing',
        '--nph-icon-size-sm',
        '--nph-control-height-large',
        '--nph-radius-full',
        '--nph-border-width',
        '--nph-focus-border',
        '--nph-focus-halo',
        '--nph-focus-ring-width',
        '--nph-focus-halo-error',
        '--nph-status-error',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('never consumes a core or theme token: components use the semantic layer only', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, measure or duration, and no transition', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s)\b/);
    expect(cssWithoutComments).not.toMatch(/\btransition/);
  });
});

describe('regressions of the code review', () => {
  it('a decimal max on the step is reached: min 0, max 0.3, step 0.1', async () => {
    const element = await mount({ label: 'Ratio', min: 0, max: 0.3, step: 0.1, value: 0.3 });
    expect(element.value).toBe(0.3);
    expect(thumb(element).getAttribute('aria-valuemax')).toBe('0.3');
    element.value = 0;
    await element.updateComplete;
    thumb(element).focus();
    await userEvent.keyboard('{End}');
    expect(element.value).toBe(0.3);
    pointer(element, 'pointerdown', 0);
    pointer(element, 'pointermove', 1);
    pointer(element, 'pointerup', 1);
    expect(element.value).toBe(0.3);
  });

  it('a reversed pair from the attributes keeps the shown ends when a thumb moves', async () => {
    const holder = await markup('<nph-slider mode="range" label="Price" start-label="Min" end-label="Max" start="80" end="20"></nph-slider>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    expect([element.start, element.end]).toEqual([20, 20]);
    thumb(element, 1).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect([element.start, element.end]).toEqual([20, 21]);
  });

  it('focus() goes to the first thumb, also with steppers and with fields before the track', async () => {
    const withSteppers = await mount({ label: 'Volume', steppers: true, decreaseLabel: 'Less', increaseLabel: 'More' });
    withSteppers.focus();
    expect(withSteppers.shadowRoot?.activeElement).toBe(thumb(withSteppers, 0));
    const withFields = await mount({ ...RANGE, inputs: true });
    withFields.focus();
    expect(withFields.shadowRoot?.activeElement).toBe(thumb(withFields, 0));
  });

  it('a click on an associated label focuses the first thumb, also with fields before the track', async () => {
    const holder = await markup('<nph-label for="price" text="Price"></nph-label><nph-slider id="price" mode="range" inputs start-label="Min" end-label="Max"></nph-slider>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    (holder.querySelector('nph-label label') as HTMLLabelElement).click();
    expect(element.shadowRoot?.activeElement).toBe(thumb(element, 0));
  });

  it('inside nph-field with steppers, a click on the label of the field focuses the thumb', async () => {
    const holder = await markup('<nph-field label="Volume"><nph-slider steppers decrease-label="Less" increase-label="More"></nph-slider></nph-field>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    const field = holder.querySelector('nph-field') as HTMLElement;
    const label = field.shadowRoot?.querySelector('nph-label label') ?? field.querySelector('nph-label label');
    (label as HTMLElement).click();
    expect(element.shadowRoot?.activeElement).toBe(thumb(element));
  });

  it('a slider on the page takes no focus by itself', async () => {
    await mount({ label: 'Volume' });
    await nextFrame();
    await nextFrame();
    expect(document.activeElement).toBe(document.body);
  });

  it('disabling the slider during a drag ends it with no more input and no change', async () => {
    const element = await mount({ label: 'Volume', value: 50 });
    const events: string[] = [];
    element.addEventListener('input', () => events.push('input'));
    element.addEventListener('change', () => events.push('change'));
    pointer(element, 'pointerdown', 0.2);
    element.disabled = true;
    await element.updateComplete;
    pointer(element, 'pointermove', 0.8);
    pointer(element, 'pointerup', 0.8);
    expect(element.value).toBe(20);
    expect(events).toEqual(['input']);
  });

  it('a disabled fieldset during a drag ends it too', async () => {
    const holder = await markup('<fieldset><nph-slider label="Volume" value="50"></nph-slider></fieldset>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    const change = vi.fn();
    element.addEventListener('change', change);
    pointer(element, 'pointerdown', 0.2);
    (holder.querySelector('fieldset') as HTMLFieldSetElement).disabled = true;
    await element.updateComplete;
    pointer(element, 'pointermove', 0.8);
    pointer(element, 'pointerup', 0.8);
    expect(element.value).toBe(20);
    expect(change).not.toHaveBeenCalled();
  });

  for (const [direction, fraction, expected] of [
    ['right', 0.7, [50, 70]],
    ['left', 0.3, [30, 50]],
  ] as const) {
    it(`two thumbs on the same value separate to the ${direction} by the drag`, async () => {
      const element = await mount({ ...RANGE, start: 50, end: 50 });
      pointer(element, 'pointerdown', 0.5);
      pointer(element, 'pointermove', fraction);
      pointer(element, 'pointerup', fraction);
      expect([element.start, element.end]).toEqual([...expected]);
    });
  }

  it('a new label renames the thumb while it keeps the focus', async () => {
    const element = await mount({ label: 'Volume' });
    thumb(element).focus();
    element.label = 'Sound';
    await element.updateComplete;
    expect((await accessibleNodeOf(thumb(element))).name?.value).toBe('Sound');
    element.label = '';
    element.text = 'Brightness';
    await element.updateComplete;
    expect((await accessibleNodeOf(thumb(element))).name?.value).toBe('Brightness');
  });

  it('switching from single to range with an associated label gives the first thumb its start name', async () => {
    const holder = await markup('<nph-label for="s" text="Price"></nph-label><nph-slider id="s" start-label="Minimum price" end-label="Maximum price"></nph-slider>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    await nextFrame();
    expect((await accessibleNodeOf(thumb(element, 0))).name?.value).toBe('Price');
    element.mode = 'range';
    await element.updateComplete;
    expect((await accessibleNodeOf(thumb(element, 0))).name?.value).toBe('Minimum price');
    expect((await accessibleNodeOf(track(element))).name?.value).toBe('Price');
    element.mode = 'single';
    await element.updateComplete;
    expect(track(element).hasAttribute('aria-label')).toBe(false);
    expect((await accessibleNodeOf(thumb(element, 0))).name?.value).toBe('Price');
  });

  it('single: the field takes the name of an associated label', async () => {
    const holder = await markup('<nph-label for="v" text="Volume"></nph-label><nph-slider id="v" inputs></nph-slider>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    await element.updateComplete;
    expect(fields(element)[0]?.label).toBe('Volume');
  });

  it('inside nph-field, the fields take the description with the error sentence', async () => {
    const holder = await markup(
      '<nph-field label="Price" error="Choose a lower price."><nph-slider mode="range" inputs start-label="Min" end-label="Max"></nph-slider></nph-field>',
    );
    const element = holder.querySelector('nph-slider') as NphSlider;
    await element.updateComplete;
    for (const item of fields(element)) {
      expect(item.description).toContain('Choose a lower price.');
      expect(item.invalid).toBe(true);
    }
  });

  it('marks above the limit are not drawn, with one error, and the slider keeps its step', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Volume', min: 0, max: 100, step: 0.0001, marks: true, value: 50 });
    expect(element.shadowRoot?.querySelector('.mark')).toBeNull();
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('at most 100');
    thumb(element).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(element.value).toBe(50.0001);
  });

  it('a scale of exactly 100 marks still draws them', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Count', min: 1, max: 100, marks: true });
    expect(element.shadowRoot?.querySelectorAll('.mark')).toHaveLength(100);
    expect(error).not.toHaveBeenCalled();
  });

  it('disabling a focused invalid thumb drops the halo and the error border', async () => {
    const element = await mount({ label: 'Volume', invalid: true });
    await userEvent.keyboard('{Tab}');
    expect(getComputedStyle(thumb(element), '::after').display).toBe('block');
    element.disabled = true;
    await element.updateComplete;
    expect(getComputedStyle(thumb(element)).borderTopColor).toBe(color('--nph-color-primary-border'));
    expect(getComputedStyle(thumb(element), '::after').display).toBe('none');
  });

  it('an open balloon follows the thumb when the scale changes and the value does not', async () => {
    const holder = document.createElement('div');
    holder.style.paddingBlockStart = '120px';
    document.body.append(holder);
    const element = await mount({ label: 'Volume', value: 50 }, holder);
    const tooltip = element.shadowRoot?.querySelector('nph-tooltip') as NphTooltip;
    await userEvent.keyboard('{Tab}');
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    element.max = 200;
    await element.updateComplete;
    await tooltip.updateComplete;
    await nextFrame();
    const box = thumb(element).getBoundingClientRect();
    const balloon = tooltip.shadowRoot?.querySelector<HTMLElement>('[popover]')?.getBoundingClientRect();
    expect(Math.abs((balloon?.left ?? 0) + (balloon?.width ?? 0) / 2 - (box.left + box.width / 2))).toBeLessThan(1);
  });

  it('the name is kept as given in both modes, spaces included', async () => {
    const holder = await markup(
      '<form><nph-slider label="Volume" name=" volume " value="30"></nph-slider><nph-slider mode="range" label="Price" start-label="Min" end-label="Max" name=" price " start="10" end="90"></nph-slider></form>',
    );
    const data = new FormData(holder.querySelector('form') as HTMLFormElement);
    expect(data.getAll(' volume ')).toEqual(['30']);
    expect(data.getAll(' price ')).toEqual(['10', '90']);
  });

  it('Enter in a field applies the typed number, without leaving the field', async () => {
    const holder = await markup('<form><nph-slider mode="range" inputs label="Price" start-label="Min" end-label="Max" name="price" start="10" end="90"></nph-slider></form>');
    const element = holder.querySelector('nph-slider') as NphSlider;
    const events: string[] = [];
    element.addEventListener('input', () => events.push('input'));
    element.addEventListener('change', () => events.push('change'));
    const inner = fields(element)[0]?.shadowRoot?.querySelector('input') as HTMLInputElement;
    await userEvent.fill(inner, '40');
    await userEvent.keyboard('{Enter}');
    expect(element.start).toBe(40);
    expect(new FormData(holder.querySelector('form') as HTMLFormElement).getAll('price')).toEqual(['40', '90']);
    expect(events).toEqual(['input', 'change']);
    expect(fields(element)[0]?.shadowRoot?.activeElement).toBe(inner);
  });
});
