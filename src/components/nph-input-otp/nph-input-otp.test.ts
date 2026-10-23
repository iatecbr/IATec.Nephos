/**
 * Tests of `nph-input-otp` (P85), in a real browser (P21, item 5): resolved color,
 * real typing, paste, keyboard focus, measures and the accessibility tree only exist
 * where there is layout.
 *
 * They prove the contract accepted in Figma (board `1633:122`, set `1633:120`, cell
 * set `1633:29`): the API, the cells and their measures, the colors in both schemes,
 * typing, paste and the active cell, the states (hover, focus, error, error with focus,
 * disabled), the mask, the form (P80), the contract with the field (P83), the
 * accessible name and description, the invalid input and the token contract.
 *
 * Color schemes are switched at the root (`data-nph-color-scheme` on `html`). In a
 * part of the screen with another brand and another scheme, `focus/halo` resolves the
 * local value, so the brand and the scheme go on the same element (P67).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-input-otp.css?raw';
import '../nph-field/nph-field';
import { NPH_INPUT_OTP_LENGTHS, NPH_INPUT_OTP_MASK, NPH_INPUT_OTP_SIZES, NphInputOtp } from './nph-input-otp';

type Props = Partial<
  Pick<
    NphInputOtp,
    'length' | 'size' | 'invalid' | 'disabled' | 'masked' | 'required' | 'name' | 'value' | 'label' | 'description'
  >
>;

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

async function mount(props: Props = { label: 'Verification code' }, parent: HTMLElement = document.body): Promise<NphInputOtp> {
  const element = document.createElement('nph-input-otp');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

/** Mounts from markup, so the attributes are what the parser sets. */
async function fromHtml(markup: string): Promise<NphInputOtp> {
  document.body.insertAdjacentHTML('beforeend', markup);
  const element = document.body.querySelector<NphInputOtp>('nph-input-otp:last-of-type');
  if (!element) throw new Error('no nph-input-otp');
  await element.updateComplete;
  return element;
}

function native(element: NphInputOtp): HTMLInputElement {
  const input = element.shadowRoot?.querySelector<HTMLInputElement>('input');
  if (!input) throw new Error('no inner <input>');
  return input;
}

function cells(element: NphInputOtp): HTMLElement[] {
  return [...(element.shadowRoot?.querySelectorAll<HTMLElement>('.cell') ?? [])];
}

function texts(element: NphInputOtp): string[] {
  return cells(element).map((cell) => cell.textContent ?? '');
}

function activeIndex(element: NphInputOtp): number {
  return cells(element).findIndex((cell) => cell.hasAttribute('data-active'));
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

/** Brands read from the generated CSS; the default is the `:root` one. */
const DEFAULT_BRAND = /:root,\s*\[data-nph-brand="([\w-]+)"\]/.exec(tokensCss)?.[1] ?? '';
const BRANDS = [...new Set([...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? ''))];
const OTHER_BRAND = BRANDS.find((brand) => brand !== DEFAULT_BRAND) ?? '';

/** A part of the screen with a brand and a scheme on the same element (P67). */
function scope(brand = OTHER_BRAND, scheme: 'light' | 'dark' = 'dark'): HTMLElement {
  const part = document.createElement('div');
  part.setAttribute('data-nph-brand', brand);
  part.setAttribute('data-nph-color-scheme', scheme);
  document.body.append(part);
  return part;
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

/** The halo of a computed `box-shadow`: its color and its spread. */
function halo(cell: HTMLElement): { color: string; spread: number } | null {
  const value = getComputedStyle(cell).boxShadow;
  if (value === 'none') return null;
  const color = value.match(/rgba?\([^)]*\)/)?.[0] ?? '';
  const lengths = value.replace(color, '').match(/-?[\d.]+px/g) ?? [];
  return { color, spread: Number.parseFloat(lengths[3] ?? '0') };
}

/** Focuses the field from the keyboard, as a person would. */
async function tabInto(element: NphInputOtp): Promise<void> {
  const before = document.createElement('input');
  element.before(before);
  before.focus();
  await userEvent.tab();
  expect(element.shadowRoot?.activeElement).toBe(native(element));
  await element.updateComplete;
}

/** Pastes text on the inner input, as the clipboard would. */
async function paste(element: NphInputOtp, text: string): Promise<void> {
  const data = new DataTransfer();
  data.setData('text', text);
  native(element).dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true, composed: true }));
  await element.updateComplete;
}

/** The text boxes of the real accessibility tree of the test page, with name and description. */
async function textboxes(): Promise<Array<{ name: string; description: string }>> {
  const session = cdp();
  const send = session.send as unknown as (method: string, params?: object) => Promise<unknown>;
  const frames = (await send('Page.getFrameTree')) as { frameTree: { childFrames?: Array<{ frame: { id: string } }> } };
  const frameId = frames.frameTree.childFrames?.[0]?.frame.id;
  const tree = (await send('Accessibility.getFullAXTree', { frameId })) as {
    nodes: Array<{ role?: { value: string }; name?: { value: string }; description?: { value: string } }>;
  };
  return tree.nodes
    .filter((node) => node.role?.value === 'textbox')
    .map((node) => ({ name: node.name?.value ?? '', description: node.description?.value ?? '' }));
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

describe('registration and API', () => {
  it('defines nph-input-otp only once', () => {
    expect(customElements.get('nph-input-otp')).toBe(NphInputOtp);
  });

  it('the public API is exactly the one in P85', () => {
    const declared = [...(NphInputOtp as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['length', 'size', 'invalid', 'disabled', 'masked', 'required', 'name', 'value', 'label', 'description']);
  });

  it('the lists of length and size are the Figma ones', () => {
    expect([...NPH_INPUT_OTP_LENGTHS]).toEqual([6, 4]);
    expect([...NPH_INPUT_OTP_SIZES]).toEqual(['default', 'large']);
    expect(NPH_INPUT_OTP_MASK).toBe('•');
  });

  it('the defaults are six cells, default size, empty, valid and enabled', async () => {
    const element = await mount();
    expect([element.length, element.size, element.value]).toEqual([6, 'default', '']);
    expect([element.invalid, element.disabled, element.masked, element.required]).toEqual([false, false, false, false]);
    expect([element.name, element.description]).toEqual([null, '']);
    expect(element.hasAttribute('name')).toBe(false);
  });

  it('length, size, the booleans and name reflect; value, label and description do not', async () => {
    const element = await mount({
      label: 'Code',
      length: 4,
      size: 'large',
      invalid: true,
      disabled: true,
      masked: true,
      required: true,
      name: 'code',
      value: '12',
      description: 'Help',
    });
    expect(element.getAttribute('length')).toBe('4');
    expect(element.getAttribute('size')).toBe('large');
    for (const name of ['invalid', 'disabled', 'masked', 'required']) {
      expect(element.hasAttribute(name), name).toBe(true);
    }
    expect(element.getAttribute('name')).toBe('code');
    for (const name of ['value', 'label', 'description']) {
      expect(element.hasAttribute(name), name).toBe(false);
    }
  });

  it('has the open shadow root with delegated focus and is associated with forms', async () => {
    const element = await mount();
    expect(element.shadowRoot?.mode).toBe('open');
    expect(element.shadowRoot?.delegatesFocus).toBe(true);
    expect((NphInputOtp as unknown as { formAssociated?: boolean }).formAssociated).toBe(true);
  });
});

describe('the inner input', () => {
  it('is one native text input, with one-time-code and the length as maxlength', async () => {
    const element = await mount({ label: 'Code', length: 4 });
    const input = native(element);
    expect(element.shadowRoot?.querySelectorAll('input').length).toBe(1);
    expect(input.type).toBe('text');
    expect(input.getAttribute('autocomplete')).toBe('one-time-code');
    expect(input.maxLength).toBe(4);
    expect(input.getAttribute('inputmode')).toBe('text');
    expect(input.getAttribute('autocapitalize')).toBe('off');
    expect(input.getAttribute('autocorrect')).toBe('off');
    expect(input.getAttribute('spellcheck')).toBe('false');
  });

  it('the cells only draw: they are hidden from assistive technology', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('.cells')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('the input draws nothing of its own and covers the row of cells', async () => {
    const element = await mount({ label: 'Code', value: '123' });
    const input = native(element);
    const style = getComputedStyle(input);
    expect(style.color).toBe('rgba(0, 0, 0, 0)');
    expect(style.caretColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopWidth).toBe('0px');
    const box = input.getBoundingClientRect();
    const row = element.shadowRoot?.querySelector('.cells')?.getBoundingClientRect();
    expect(box.left).toBeCloseTo(row?.left ?? -1, 1);
    expect(box.width).toBeCloseTo(row?.width ?? -1, 1);
    expect(box.height).toBeCloseTo(row?.height ?? -1, 1);
  });
});

describe('measures and anatomy', () => {
  for (const [size, token] of [
    ['default', '--nph-control-height-default'],
    ['large', '--nph-control-height-large'],
  ] as const) {
    it(`${size}: every cell is a square of the control height, with the border, radius and background of the tokens`, async () => {
      const element = await mount({ label: 'Code', size });
      const side = px(token);
      expect(side).toBe(size === 'default' ? 36 : 44);
      for (const cell of cells(element)) {
        const box = cell.getBoundingClientRect();
        expect(box.width).toBeCloseTo(side, 2);
        expect(box.height).toBeCloseTo(side, 2);
        const style = getComputedStyle(cell);
        expect(style.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
        expect(style.borderTopColor).toBe(resolved('color', '--nph-color-input'));
        expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-control'));
        expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
        expect(style.paddingTop).toBe('0px');
      }
    });
  }

  it('the number of cells is the length: 6 or 4', async () => {
    expect(cells(await mount({ label: 'Code' })).length).toBe(6);
    expect(cells(await mount({ label: 'Code', length: 4 })).length).toBe(4);
  });

  it('the cells are space/inline apart, in one row', async () => {
    const element = await mount();
    const boxes = cells(element).map((cell) => cell.getBoundingClientRect());
    for (let index = 1; index < boxes.length; index += 1) {
      const [previous, current] = [boxes[index - 1], boxes[index]];
      expect((current?.left ?? 0) - (previous?.right ?? 0)).toBeCloseTo(px('--nph-space-inline'), 2);
      expect(current?.top).toBe(previous?.top);
    }
  });

  it('the character uses the five properties of text/code in color/foreground, centered', async () => {
    const element = await mount({ label: 'Code', value: 'A7' });
    const cell = cells(element)[0];
    if (!cell) throw new Error('no cell');
    const style = getComputedStyle(cell);
    expect(style.fontFamily).toBe(resolved('font-family', '--nph-text-code-font-family'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-code-font-size'));
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-text-code-line-height'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-code-font-weight'));
    expect(style.letterSpacing).toBe(resolved('letter-spacing', '--nph-text-code-letter-spacing'));
    expect(style.color).toBe(resolved('color', '--nph-color-foreground'));
    expect([style.justifyContent, style.alignItems]).toEqual(['center', 'center']);
  });

  it('the host is an inline box that takes no space without a valid input', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount();
    expect(getComputedStyle(element).display).toBe('inline-flex');
    const broken = await mount({ label: 'Code', length: 5 });
    expect(getComputedStyle(broken).display).toBe('none');
  });
});

describe('typing and editing', () => {
  it('typing fills one cell per character, letters and digits, with case as typed', async () => {
    const element = await mount();
    await tabInto(element);
    await userEvent.keyboard('a7K2');
    expect(element.value).toBe('a7K2');
    expect(texts(element)).toEqual(['a', '7', 'K', '2', '', '']);
  });

  it('a character that is not a letter or a digit is dropped', async () => {
    const element = await mount();
    await tabInto(element);
    await userEvent.keyboard('1- 2.é3');
    expect(element.value).toBe('123');
    expect(native(element).value).toBe('123');
  });

  it('a full field takes no more characters', async () => {
    const element = await mount({ label: 'Code', length: 4 });
    await tabInto(element);
    await userEvent.keyboard('123456');
    expect(element.value).toBe('1234');
  });

  it('Backspace removes the character before the caret', async () => {
    const element = await mount();
    await tabInto(element);
    await userEvent.keyboard('123{Backspace}');
    expect(element.value).toBe('12');
    expect(texts(element)).toEqual(['1', '2', '', '', '', '']);
  });

  it('the active cell follows the caret: the next empty cell, arrows, Home and End, the last cell when full', async () => {
    const element = await mount({ label: 'Code', length: 4 });
    await tabInto(element);
    expect(activeIndex(element)).toBe(0);
    await userEvent.keyboard('12');
    await element.updateComplete;
    expect(activeIndex(element)).toBe(2);
    await userEvent.keyboard('{ArrowLeft}');
    await vi.waitFor(() => expect(activeIndex(element)).toBe(1));
    await userEvent.keyboard('{Home}');
    await vi.waitFor(() => expect(activeIndex(element)).toBe(0));
    await userEvent.keyboard('{End}34');
    await vi.waitFor(() => expect(activeIndex(element)).toBe(3));
  });

  it('a click on a cell puts the caret on it, or at the end of the code', async () => {
    const element = await mount({ label: 'Code', value: '123' });
    const [first, , , , fifth] = cells(element);
    if (!first || !fifth) throw new Error('no cells');
    await userEvent.click(native(element), { position: { x: first.offsetLeft + 4, y: 4 } });
    await vi.waitFor(() => expect(activeIndex(element)).toBe(0));
    await userEvent.click(native(element), { position: { x: fifth.offsetLeft + 4, y: 4 } });
    await vi.waitFor(() => expect(activeIndex(element)).toBe(3));
  });

  it('focus puts the caret on the next empty cell and selects nothing', async () => {
    const element = await mount({ label: 'Code', value: '12' });
    await tabInto(element);
    expect([native(element).selectionStart, native(element).selectionEnd]).toEqual([2, 2]);
    expect(activeIndex(element)).toBe(2);
    await userEvent.keyboard('3');
    expect(element.value).toBe('123');
  });

  it('without focus, no cell is active', async () => {
    const element = await mount({ label: 'Code', value: '12' });
    expect(activeIndex(element)).toBe(-1);
  });
});

describe('paste', () => {
  it('a pasted code is cleaned and replaces the whole value', async () => {
    const element = await mount({ label: 'Code', value: '99' });
    await tabInto(element);
    await paste(element, '123-456');
    expect(element.value).toBe('123456');
    expect(native(element).value).toBe('123456');
    expect(activeIndex(element)).toBe(5);
  });

  it('a pasted code longer than the field is cut at the length', async () => {
    const element = await mount({ label: 'Code', length: 4 });
    await tabInto(element);
    await paste(element, ' A7K2Q9 ');
    expect(element.value).toBe('A7K2');
  });

  it('a paste with no letter or digit changes nothing and fires nothing', async () => {
    const element = await mount({ label: 'Code', value: '12' });
    const inputs = vi.fn();
    element.addEventListener('input', inputs);
    await tabInto(element);
    await paste(element, '— —');
    expect(element.value).toBe('12');
    expect(inputs).not.toHaveBeenCalled();
  });

  it('a paste fires one input event that reaches the host', async () => {
    const element = await mount();
    const inputs: Event[] = [];
    element.addEventListener('input', (event) => inputs.push(event));
    await tabInto(element);
    await paste(element, '482913');
    expect(inputs.length).toBe(1);
    expect(inputs[0]?.target).toBe(element);
    expect((inputs[0] as InputEvent).inputType).toBe('insertFromPaste');
  });
});

describe('events', () => {
  it('each typed character fires the native input on the host, with the value already cleaned', async () => {
    const element = await mount();
    const seen: string[] = [];
    element.addEventListener('input', (event) => {
      expect(event.target).toBe(element);
      seen.push((event.target as NphInputOtp).value);
    });
    await tabInto(element);
    await userEvent.keyboard('1a');
    expect(seen).toEqual(['1', '1a']);
  });

  it('a dropped character fires no input', async () => {
    const element = await mount();
    const inputs = vi.fn();
    element.addEventListener('input', inputs);
    await tabInto(element);
    await userEvent.keyboard('-');
    expect(inputs).not.toHaveBeenCalled();
  });

  it('the host fires change on blur when the value changed, once, bubbling', async () => {
    const element = await mount();
    const changes: Event[] = [];
    document.body.addEventListener('change', (event) => changes.push(event));
    await tabInto(element);
    await userEvent.keyboard('12');
    expect(changes.length).toBe(0);
    await userEvent.tab();
    expect(changes.length).toBe(1);
    expect(changes[0]?.target).toBe(element);
    expect(changes[0]?.bubbles).toBe(true);
  });

  it('no change on blur when the value is the same as at focus', async () => {
    const element = await mount({ label: 'Code', value: '12' });
    const changes = vi.fn();
    element.addEventListener('change', changes);
    await tabInto(element);
    await userEvent.keyboard('3{Backspace}');
    await userEvent.tab();
    expect(changes).not.toHaveBeenCalled();
  });

  it('setting value from code, by property or attribute, fires nothing', async () => {
    const element = await mount();
    const inputs = vi.fn();
    const changes = vi.fn();
    element.addEventListener('input', inputs);
    element.addEventListener('change', changes);
    element.value = '1234';
    element.setAttribute('value', '99');
    await element.updateComplete;
    expect(inputs).not.toHaveBeenCalled();
    expect(changes).not.toHaveBeenCalled();
  });
});

describe('value from code', () => {
  it('the value property draws the characters in the cells', async () => {
    const element = await mount({ label: 'Code', value: 'A7K2Q9' });
    expect(texts(element)).toEqual(['A', '7', 'K', '2', 'Q', '9']);
    expect(native(element).value).toBe('A7K2Q9');
  });

  it('a value with other characters or longer than the length is cleaned, cut and reported once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount({ label: 'Code', length: 4, value: '12-34-56' });
    expect(element.value).toBe('1234');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('[nph-input-otp]');
  });

  it('the value attribute is the initial value', async () => {
    const element = await fromHtml('<nph-input-otp label="Code" value="4829"></nph-input-otp>');
    expect(element.value).toBe('4829');
  });

  it('changing the value attribute after an edit does not replace what the person typed', async () => {
    const element = await fromHtml('<nph-input-otp label="Code" value="11"></nph-input-otp>');
    await tabInto(element);
    await userEvent.keyboard('2');
    element.setAttribute('value', '99');
    await element.updateComplete;
    expect(element.value).toBe('112');
  });

  it('a shorter length cuts the current value', async () => {
    const element = await mount({ label: 'Code', value: '123456' });
    element.length = 4;
    await element.updateComplete;
    expect(element.value).toBe('1234');
  });
});

describe('states', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: hover paints every cell border color/input-hover`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      await userEvent.hover(element);
      for (const cell of cells(element)) {
        expect(getComputedStyle(cell).borderTopColor).toBe(resolved('color', '--nph-color-input-hover'));
      }
    });

    it(`${scheme}: the active cell has the focus/border and the focus/halo outside`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      await tabInto(element);
      const [active, other] = cells(element);
      if (!active || !other) throw new Error('no cells');
      expect(getComputedStyle(active).borderTopColor).toBe(resolved('color', '--nph-focus-border'));
      expect(halo(active)).toEqual({ color: resolved('color', '--nph-focus-halo'), spread: px('--nph-focus-ring-width') });
      expect(getComputedStyle(other).borderTopColor).toBe(resolved('color', '--nph-color-input'));
      expect(halo(other)).toBeNull();
    });

    it(`${scheme}: invalid paints every border status/error; with focus, the halo is focus/halo-error`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount({ label: 'Code', invalid: true });
      for (const cell of cells(element)) {
        expect(getComputedStyle(cell).borderTopColor).toBe(resolved('color', '--nph-status-error'));
      }
      await tabInto(element);
      const active = cells(element)[0];
      if (!active) throw new Error('no cell');
      expect(getComputedStyle(active).borderTopColor).toBe(resolved('color', '--nph-status-error'));
      expect(halo(active)?.color).toBe(resolved('color', '--nph-focus-halo-error'));
      expect(native(element).getAttribute('aria-invalid')).toBe('true');
    });
  }

  it('invalid with hover keeps the error border', async () => {
    const element = await mount({ label: 'Code', invalid: true });
    await userEvent.hover(element);
    expect(getComputedStyle(cells(element)[0] as HTMLElement).borderTopColor).toBe(resolved('color', '--nph-status-error'));
  });

  it('the halo is out of the layout: focus does not move or resize a cell, and its outer radius is focus/radius-control', async () => {
    const element = await mount();
    const before = cells(element).map((cell) => cell.getBoundingClientRect().toJSON());
    native(element).focus();
    await element.updateComplete;
    expect(activeIndex(element)).toBe(0);
    expect(cells(element).map((cell) => cell.getBoundingClientRect().toJSON())).toEqual(before);
    expect(px('--nph-radius-control') + px('--nph-focus-ring-width')).toBe(
      Number.parseFloat(resolved('border-top-left-radius', '--nph-focus-radius-control')),
    );
    /* The halo of one cell does not reach the next one. */
    expect(px('--nph-space-inline')).toBeGreaterThan(px('--nph-focus-ring-width'));
  });

  it('with another brand and another scheme on the same element, the halo is the local one (P67)', async () => {
    const part = scope();
    const element = await mount({ label: 'Code' }, part);
    const local = resolved('color', '--nph-focus-halo', part);
    expect(local).not.toBe(resolved('color', '--nph-focus-halo'));
    await tabInto(element);
    expect(halo(cells(element)[0] as HTMLElement)?.color).toBe(local);
  });

  it('disabled: out of the Tab order, background color/muted, state/disabled-opacity, no hover', async () => {
    const element = await mount({ label: 'Code', disabled: true, value: '12' });
    expect(native(element).disabled).toBe(true);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    await userEvent.hover(element);
    for (const cell of cells(element)) {
      expect(getComputedStyle(cell).backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
      expect(getComputedStyle(cell).borderTopColor).toBe(resolved('color', '--nph-color-input'));
    }
    const before = document.createElement('input');
    element.before(before);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement).toBeNull();
  });

  it('disabled wins over invalid: no error border and no aria-invalid', async () => {
    const element = await mount({ label: 'Code', disabled: true, invalid: true });
    expect(getComputedStyle(cells(element)[0] as HTMLElement).borderTopColor).toBe(resolved('color', '--nph-color-input'));
    expect(native(element).hasAttribute('aria-invalid')).toBe(false);
  });

  it('an enabled field is at full opacity', async () => {
    expect(getComputedStyle(await mount()).opacity).toBe('1');
  });

  it('required is announced as aria-required, with no constraint validation', async () => {
    const element = await mount({ label: 'Code', required: true });
    expect(native(element).getAttribute('aria-required')).toBe('true');
    expect(native(element).required).toBe(false);
  });
});

describe('masked', () => {
  it('every filled cell shows a dot, and no character of the code is drawn', async () => {
    const element = await mount({ label: 'Code', masked: true, value: 'A7K' });
    expect(texts(element)).toEqual(['•', '•', '•', '', '', '']);
    expect(element.shadowRoot?.querySelector('.cells')?.textContent).not.toMatch(/[A7K]/);
  });

  it('the dot uses text/code and color/foreground, like the character', async () => {
    const element = await mount({ label: 'Code', masked: true, value: '1' });
    const style = getComputedStyle(cells(element)[0] as HTMLElement);
    expect(style.color).toBe(resolved('color', '--nph-color-foreground'));
    expect(style.fontFamily).toBe(resolved('font-family', '--nph-text-code-font-family'));
  });

  it('the mask is visual only: the input stays a text input and the value is the code', async () => {
    const element = await mount({ label: 'Code', masked: true, value: '42' });
    expect(native(element).type).toBe('text');
    expect(element.value).toBe('42');
  });
});

describe('form (P80)', () => {
  async function inForm(markup: string): Promise<{ form: HTMLFormElement; element: NphInputOtp }> {
    document.body.innerHTML = `<form>${markup}</form>`;
    const form = document.querySelector('form');
    const element = document.querySelector<NphInputOtp>('nph-input-otp');
    if (!form || !element) throw new Error('no form');
    await element.updateComplete;
    return { form, element };
  }

  it('the form data holds the name and the current value', async () => {
    const { form, element } = await inForm('<nph-input-otp label="Code" name="code"></nph-input-otp>');
    element.value = '4829';
    await element.updateComplete;
    expect(new FormData(form).get('code')).toBe('4829');
    expect(element.form).toBe(form);
  });

  it('without a name attribute, the field adds nothing to the form data', async () => {
    const { form, element } = await inForm('<nph-input-otp label="Code"></nph-input-otp>');
    element.value = '4829';
    await element.updateComplete;
    expect([...new FormData(form).keys()]).toEqual([]);
  });

  it('reset goes back to the value attribute, or to empty without it', async () => {
    const { form, element } = await inForm('<nph-input-otp label="Code" name="code" value="11"></nph-input-otp><nph-input-otp label="Other" name="other"></nph-input-otp>');
    const other = document.querySelectorAll<NphInputOtp>('nph-input-otp')[1];
    if (!other) throw new Error('no second field');
    element.value = '2222';
    other.value = '3333';
    form.reset();
    await element.updateComplete;
    expect(element.value).toBe('11');
    expect(other.value).toBe('');
    expect(new FormData(form).get('code')).toBe('11');
  });

  it('a disabled fieldset disables the field and takes it out of the form data', async () => {
    document.body.innerHTML = '<form><fieldset disabled><nph-input-otp label="Code" name="code" value="12"></nph-input-otp></fieldset></form>';
    const element = document.querySelector<NphInputOtp>('nph-input-otp');
    const form = document.querySelector('form');
    if (!element || !form) throw new Error('no field');
    await element.updateComplete;
    expect(native(element).disabled).toBe(true);
    expect(element.matches(':disabled')).toBe(true);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(new FormData(form).has('code')).toBe(false);
  });

  it('Enter submits the form through its submit button, after committing the change', async () => {
    const { form, element } = await inForm('<nph-input-otp label="Code" name="code"></nph-input-otp><button type="submit">Verify</button>');
    const order: string[] = [];
    element.addEventListener('change', () => order.push('change'));
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      order.push(`submit ${(event as SubmitEvent).submitter?.textContent ?? ''}`);
    });
    await tabInto(element);
    await userEvent.keyboard('12{Enter}');
    await vi.waitFor(() => expect(order).toEqual(['change', 'submit Verify']));
  });

  it('a consumer that cancels Enter keeps the form, as with a native field (P80)', async () => {
    const { form, element } = await inForm('<nph-input-otp label="Code" name="code"></nph-input-otp><button type="submit">Verify</button>');
    const submits = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submits);
    element.addEventListener('keydown', (event) => event.preventDefault());
    await tabInto(element);
    await userEvent.keyboard('{Enter}');
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(submits).not.toHaveBeenCalled();
  });

  it('Enter submits a form with no submit button, and does nothing with a disabled one', async () => {
    const { form, element } = await inForm('<nph-input-otp label="Code" name="code"></nph-input-otp>');
    const submits = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submits);
    await tabInto(element);
    await userEvent.keyboard('{Enter}');
    await vi.waitFor(() => expect(submits).toHaveBeenCalledTimes(1));
    form.insertAdjacentHTML('beforeend', '<button type="submit" disabled>Verify</button>');
    await userEvent.keyboard('{Enter}');
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(submits).toHaveBeenCalledTimes(1);
  });

  it('a label associated with the host moves the focus to the inner input', async () => {
    document.body.innerHTML = '<label for="otp">Verification code</label><nph-input-otp id="otp"></nph-input-otp>';
    const element = document.querySelector<NphInputOtp>('nph-input-otp');
    if (!element) throw new Error('no field');
    await element.updateComplete;
    await userEvent.click(document.querySelector('label') as HTMLLabelElement);
    expect(element.shadowRoot?.activeElement).toBe(native(element));
  });

  it('restores the state the browser hands back', async () => {
    const element = await mount();
    element.formStateRestoreCallback('7788');
    await element.updateComplete;
    expect(element.value).toBe('7788');
  });
});

describe('accessible name and description (P80, P83)', () => {
  it('label names the inner input when no label is associated', async () => {
    const element = await mount({ label: 'Verification code' });
    expect(native(element).getAttribute('aria-label')).toBe('Verification code');
    expect(await textboxes()).toEqual([{ name: 'Verification code', description: '' }]);
  });

  it('an associated label names the inner input first, in the real accessibility tree', async () => {
    document.body.innerHTML = '<label for="otp">Code sent by e-mail</label><nph-input-otp id="otp" label="Ignored"></nph-input-otp>';
    const element = document.querySelector<NphInputOtp>('nph-input-otp');
    if (!element) throw new Error('no field');
    await element.updateComplete;
    await nextFrame();
    expect(native(element).hasAttribute('aria-label')).toBe(false);
    expect((await textboxes())[0]?.name).toBe('Code sent by e-mail');
  });

  it('a label added later, or pointed at the field later, names it (P80)', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await fromHtml('<nph-input-otp id="otp"></nph-input-otp>');
    const label = document.createElement('label');
    label.textContent = 'Code sent by SMS';
    document.body.prepend(label);
    label.htmlFor = 'otp';
    await vi.waitFor(() => expect(native(element).ariaLabelledByElements).toEqual([label]));
    expect((await textboxes())[0]?.name).toBe('Code sent by SMS');
  });

  it('inside the nph-field, the field names, describes and marks the code field (P83)', async () => {
    document.body.innerHTML =
      '<nph-field label="Verification code" help="Sent to your e-mail" required><nph-input-otp name="code"></nph-input-otp></nph-field>';
    const field = document.querySelector('nph-field') as HTMLElement & { updateComplete: Promise<unknown>; error: string };
    const element = document.querySelector<NphInputOtp>('nph-input-otp');
    if (!element) throw new Error('no field');
    await field.updateComplete;
    await element.updateComplete;
    await nextFrame();
    expect([element.label, element.description, element.required, element.invalid]).toEqual(['Verification code', 'Sent to your e-mail', true, false]);
    expect(await textboxes()).toEqual([{ name: 'Verification code', description: 'Sent to your e-mail' }]);
    field.error = 'The code is wrong';
    await field.updateComplete;
    await element.updateComplete;
    expect(element.invalid).toBe(true);
    expect(native(element).getAttribute('aria-invalid')).toBe('true');
    expect((await textboxes())[0]?.description).toBe('The code is wrong');
  });

  it('description is the accessible description, clipped and never display: none', async () => {
    const element = await mount({ label: 'Code', description: 'Check your e-mail' });
    const description = element.shadowRoot?.querySelector<HTMLElement>('#description');
    expect(native(element).getAttribute('aria-describedby')).toBe('description');
    expect(description?.textContent).toBe('Check your e-mail');
    expect(getComputedStyle(description as HTMLElement).display).not.toBe('none');
    expect(getComputedStyle(description as HTMLElement).clipPath).toBe('inset(50%)');
    expect(await textboxes()).toEqual([{ name: 'Code', description: 'Check your e-mail' }]);
  });

  it('without description, there is no description element and no aria-describedby', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('#description')).toBeNull();
    expect(native(element).hasAttribute('aria-describedby')).toBe(false);
  });

  it('with no name, the field renders and warns once in development', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount({});
    await nextFrame();
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    await tabInto(element);
    await userEvent.tab();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('[nph-input-otp]');
  });

  it('a name set later stops the warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount({});
    await nextFrame();
    element.label = 'Code';
    await element.updateComplete;
    await tabInto(element);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(native(element).getAttribute('aria-label')).toBe('Code');
  });
});

describe('invalid input', () => {
  const cases: ReadonlyArray<readonly [string, Props, number]> = [
    ['length other than 4 or 6', { label: 'Code', length: 5 }, 1],
    ['size outside the list', { label: 'Code', size: 'small' }, 1],
    ['accumulates the causes', { label: 'Code', length: 8, size: 'huge' }, 2],
  ];
  for (const [name, props, count] of cases) {
    it(`${name}: nothing and ${count} error(s) in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const element = await mount(props);
      expect(error).toHaveBeenCalledTimes(count);
      for (const call of error.mock.calls) {
        expect(String(call[0])).toContain('[nph-input-otp]');
      }
      expect(element.shadowRoot?.querySelector('input')).toBeNull();
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect(element.getBoundingClientRect().width).toBe(0);
    });
  }

  it('changing a state does not repeat the errors', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Code', length: 5 });
    element.invalid = true;
    element.disabled = true;
    element.value = '12';
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a valid input set later draws the field', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Code', length: 5 });
    element.length = 4;
    await element.updateComplete;
    expect(cells(element).length).toBe(4);
  });
});

describe('contrast, measured (WCAG 2.2 AA)', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: the character is at least 4.5:1 and the border at least 3:1 on the cell, in every brand`, () => {
      for (const brand of BRANDS) {
        const part = scope(brand, scheme);
        const background = resolved('color', '--nph-color-background', part);
        expect(contrast(resolved('color', '--nph-color-foreground', part), background), `${scheme} ${brand}`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(resolved('color', '--nph-color-input', part), background), `${scheme} ${brand}`).toBeGreaterThanOrEqual(3);
        expect(contrast(resolved('color', '--nph-status-error', part), background), `${scheme} ${brand}`).toBeGreaterThanOrEqual(3);
        expect(contrast(resolved('color', '--nph-focus-border', part), background), `${scheme} ${brand}`).toBeGreaterThanOrEqual(3);
        part.remove();
      }
    });
  }
});

describe('what the piece does not have', () => {
  it('has no slot and no part', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('slot, [part]')).toBeNull();
  });

  it('has no color property, no variant, no readonly and no placeholder', () => {
    const declared = [...(NphInputOtp as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['color', 'severity', 'emphasis', 'variant', 'readonly', 'placeholder', 'type', 'pattern', 'inputmode']) {
      expect(declared).not.toContain(name);
    }
  });

  it('has only one focusable element inside', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelectorAll('a, button, select, textarea, [tabindex]').length).toBe(0);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, and these are the ones the contract names', () => {
    expect(used).toEqual(
      new Set([
        '--nph-state-disabled-opacity',
        '--nph-text-code-font-family',
        '--nph-text-code-font-size',
        '--nph-text-code-font-weight',
        '--nph-text-code-line-height',
        '--nph-text-code-letter-spacing',
        '--nph-space-inline',
        '--nph-control-height-default',
        '--nph-control-height-large',
        '--nph-border-width',
        '--nph-color-input',
        '--nph-radius-control',
        '--nph-color-background',
        '--nph-color-foreground',
        '--nph-color-input-hover',
        '--nph-status-error',
        '--nph-focus-border',
        '--nph-focus-ring-width',
        '--nph-focus-halo',
        '--nph-focus-halo-error',
        '--nph-color-muted',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('never consumes a core or theme token, nor color/link, which belongs to the resend action', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toContain('--nph-color-link');
  });

  it('the CSS has no literal color, measure or duration', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });

  it('design.md names every token of the piece, and color/link points at the resend action of this field', () => {
    for (const token of [
      'color/input',
      'color/input-hover',
      'color/background',
      'color/foreground',
      'color/muted',
      'status/error',
      'focus/border',
      'focus/halo',
      'focus/halo-error',
      'text/code',
      'state/disabled-opacity',
    ]) {
      expect(designMd, token).toContain(`  ${token}:`);
    }
    expect(designMd).toMatch(/color\/link:[\s\S]{0,200}resend-code action below the nph-input-otp/);
  });
});
