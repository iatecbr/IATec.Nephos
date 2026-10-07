/**
 * Tests of `nph-radio` (P69), in a real browser (P21, item 5): resolved color, real
 * hover, keyboard focus and group navigation, form participation and measurements
 * only exist where there is layout.
 *
 * Color schemes are switched at the root (`data-nph-color-scheme` on `html`).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-radio.css?raw';
import { NphRadio } from './nph-radio';

type Props = Partial<Pick<NphRadio, 'checked' | 'text' | 'hideText' | 'invalid' | 'disabled' | 'name' | 'value'>>;

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

async function mount(props: Props = { text: 'Pix' }, parent: HTMLElement = document.body): Promise<NphRadio> {
  const element = document.createElement('nph-radio');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

/** Mounts a group in the same container and waits for every member. */
async function group(names: string[], props: Props = {}, parent: HTMLElement = document.body): Promise<NphRadio[]> {
  const radios = names.map((text) => {
    const element = document.createElement('nph-radio');
    Object.assign(element, { name: 'payment', value: text.toLowerCase(), text, ...props });
    parent.append(element);
    return element;
  });
  await settle(radios);
  return radios;
}

async function settle(radios: NphRadio[]): Promise<void> {
  for (let pass = 0; pass < 3; pass += 1) {
    await Promise.all(radios.map((radio) => radio.updateComplete));
  }
}

function row(element: NphRadio): HTMLElement {
  const node = element.shadowRoot?.querySelector<HTMLElement>('.row');
  if (!node) throw new Error('no .row');
  return node;
}

function circle(element: NphRadio): HTMLElement {
  return element.shadowRoot?.querySelector<HTMLElement>('.circle') as HTMLElement;
}

function target(element: NphRadio): HTMLElement {
  return element.shadowRoot?.querySelector<HTMLElement>('.target') as HTMLElement;
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

function borderColor(element: NphRadio): string {
  const shadow = getComputedStyle(circle(element)).boxShadow;
  return shadow === 'none' ? 'none' : (shadow.match(/rgba?\([^)]*\)/)?.[0] ?? shadow);
}

function focused(radios: NphRadio[]): number {
  return radios.findIndex((radio) => radio.shadowRoot?.activeElement === row(radio));
}

describe('registration and API', () => {
  it('defines nph-radio only once and is form-associated', () => {
    expect(customElements.get('nph-radio')).toBe(NphRadio);
    expect((NphRadio as unknown as { formAssociated: boolean }).formAssociated).toBe(true);
  });

  it('the public API is exactly the one in P69', () => {
    const declared = [...(NphRadio as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['checked', 'text', 'hideText', 'invalid', 'disabled', 'name', 'value']);
  });

  it('the defaults: unchecked, value on; no slot, no ::part, no native radio', async () => {
    const element = await mount();
    expect([element.checked, element.value]).toEqual([false, 'on']);
    expect(element.shadowRoot?.querySelector('slot')).toBeNull();
    expect(element.shadowRoot?.querySelector('[part]')).toBeNull();
    expect(element.shadowRoot?.querySelector('input')).toBeNull();
    expect(row(element).getAttribute('role')).toBe('radio');
  });
});

describe('anatomy and tokens', () => {
  it('24 × 24 target, 16 circle in radius/full and an 8 dot left by space/inline-tight', async () => {
    const element = await mount({ text: 'Pix', checked: true });
    const iconSize = Number.parseFloat(resolved('width', '--nph-icon-size-sm'));
    const tight = Number.parseFloat(resolved('padding-left', '--nph-space-inline-tight'));
    const area = target(element).getBoundingClientRect();
    expect([area.width, area.height]).toEqual([iconSize + 2 * tight, iconSize + 2 * tight]);
    const ring = circle(element).getBoundingClientRect();
    expect([ring.width, ring.height]).toEqual([iconSize, iconSize]);
    const dot = (element.shadowRoot?.querySelector('.dot') as HTMLElement).getBoundingClientRect();
    expect([dot.width, dot.height]).toEqual([iconSize - 2 * tight, iconSize - 2 * tight]);
    expect(getComputedStyle(circle(element)).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
    expect(getComputedStyle(row(element)).columnGap).toBe(resolved('column-gap', '--nph-space-inline'));
    expect(getComputedStyle(row(element)).fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
  });

  it('every token the CSS consumes exists in the generated CSS', () => {
    const used = new Set([...componentCss.matchAll(/var\((--nph-[\w-]+)\)/g)].map((match) => match[1]));
    expect(used.size).toBeGreaterThan(0);
    for (const token of used) {
      expect(tokensCss, token).toContain(`${token}:`);
    }
  });

  it('the CSS writes no hexadecimal, rgb or px value', () => {
    const withoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(withoutComments).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|\d+px/i);
  });
});

describe('marking and states, in both schemes', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: unchecked is color/background with color/input, no dot`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      expect(getComputedStyle(circle(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
      expect(borderColor(element)).toBe(resolved('color', '--nph-color-input'));
      expect(getComputedStyle(element.shadowRoot?.querySelector('.dot') as HTMLElement).display).toBe('none');
      await userEvent.hover(circle(element));
      expect(borderColor(element)).toBe(resolved('color', '--nph-color-input-hover'));
      expect(getComputedStyle(circle(element)).opacity).toBe('1');
    });

    it(`${scheme}: checked is color/primary with color/input and the dot in color/primary-foreground; hover`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount({ text: 'Pix', checked: true });
      expect(getComputedStyle(circle(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary'));
      expect(borderColor(element)).toBe(resolved('color', '--nph-color-input'));
      const dot = element.shadowRoot?.querySelector('.dot') as HTMLElement;
      expect(getComputedStyle(dot).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-foreground'));
      await userEvent.hover(element.shadowRoot?.querySelector('.text') as HTMLElement);
      expect(borderColor(element)).toBe(resolved('color', '--nph-color-input-hover'));
      expect(getComputedStyle(circle(element)).opacity).toBe(resolved('opacity', '--nph-state-hover-opacity'));
    });

    it(`${scheme}: Tab draws focus/border and the round focus/halo filling the target`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const before = document.createElement('input');
      document.body.append(before);
      const [first] = await group(['Pix', 'Card']);
      before.focus();
      await userEvent.tab();
      const element = first as NphRadio;
      expect(element.shadowRoot?.activeElement).toBe(row(element));
      expect(borderColor(element)).toBe(resolved('color', '--nph-focus-border'));
      const halo = getComputedStyle(target(element), '::after');
      expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
      expect(halo.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
      expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
    });

    it(`${scheme}: invalid is status/error; with focus, the halo is focus/halo-error`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const before = document.createElement('input');
      document.body.append(before);
      const element = await mount({ text: 'Pix', invalid: true, checked: true });
      expect(borderColor(element)).toBe(resolved('color', '--nph-status-error'));
      expect(row(element).getAttribute('aria-invalid')).toBe('true');
      before.focus();
      await userEvent.tab();
      expect(borderColor(element)).toBe(resolved('color', '--nph-status-error'));
      expect(getComputedStyle(target(element), '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
    });
  }

  it('hover keeps the status/error border of an invalid radio', async () => {
    const element = await mount({ text: 'Pix', invalid: true });
    await userEvent.hover(circle(element));
    expect(borderColor(element)).toBe(resolved('color', '--nph-status-error'));
  });

  it('hover keeps the focus/border of a focused radio', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const [first] = await group(['Pix', 'Card']);
    before.focus();
    await userEvent.tab();
    await userEvent.hover(circle(first as NphRadio));
    expect(borderColor(first as NphRadio)).toBe(resolved('color', '--nph-focus-border'));
  });

  it('a mouse click does not draw the focus', async () => {
    const [first] = await group(['Pix', 'Card']);
    await userEvent.click(circle(first as NphRadio));
    expect(getComputedStyle(target(first as NphRadio), '::after').content).toBe('none');
  });

  it('disabled: state/disabled-opacity, aria-disabled, no tabindex, no check by click', async () => {
    const element = await mount({ text: 'Pix', disabled: true });
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(row(element).getAttribute('aria-disabled')).toBe('true');
    expect(row(element).hasAttribute('tabindex')).toBe(false);
    row(element).click();
    expect(element.checked).toBe(false);
  });
});

describe('group and keyboard (WAI-ARIA APG, Radio Group)', () => {
  it('a single Tab stop per group: the checked one', async () => {
    const before = document.createElement('input');
    const after = document.createElement('input');
    document.body.append(before);
    const radios = await group(['Pix', 'Card', 'Slip']);
    document.body.append(after);
    radios[1]!.checked = true;
    await settle(radios);
    expect(radios.map((radio) => row(radio).getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
    before.focus();
    await userEvent.tab();
    expect(focused(radios)).toBe(1);
    await userEvent.tab();
    expect(document.activeElement).toBe(after);
  });

  it('without a checked one, the Tab stop is the first enabled one', async () => {
    const radios = await group(['Pix', 'Card', 'Slip']);
    radios[0]!.disabled = true;
    await settle(radios);
    expect(radios.map((radio) => row(radio).getAttribute('tabindex'))).toEqual([null, '0', '-1']);
  });

  it('the arrows move and check, wrapping around and skipping the disabled one', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const radios = await group(['Pix', 'Card', 'Slip', 'Cash']);
    radios[2]!.disabled = true;
    radios[0]!.checked = true;
    await settle(radios);
    const changes = vi.fn();
    const inputs = vi.fn();
    document.body.addEventListener('change', changes);
    document.body.addEventListener('input', inputs);
    before.focus();
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    await settle(radios);
    expect([focused(radios), radios.map((r) => r.checked)]).toEqual([1, [false, true, false, false]]);
    await userEvent.keyboard('{ArrowRight}');
    await settle(radios);
    expect([focused(radios), radios.map((r) => r.checked)]).toEqual([3, [false, false, false, true]]);
    await userEvent.keyboard('{ArrowDown}');
    await settle(radios);
    expect([focused(radios), radios.map((r) => r.checked)]).toEqual([0, [true, false, false, false]]);
    await userEvent.keyboard('{ArrowUp}');
    await settle(radios);
    expect(focused(radios)).toBe(3);
    await userEvent.keyboard('{ArrowLeft}');
    await settle(radios);
    expect(focused(radios)).toBe(1);
    expect([changes.mock.calls.length, inputs.mock.calls.length]).toEqual([5, 5]);
  });

  it('the arrows do not scroll the page', async () => {
    const radios = await group(['Pix', 'Card']);
    row(radios[0]!).focus();
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true, composed: true });
    row(radios[0]!).dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('Space checks the focused one; a second click does not uncheck', async () => {
    const radios = await group(['Pix', 'Card']);
    row(radios[0]!).focus();
    await userEvent.keyboard(' ');
    expect(radios[0]!.checked).toBe(true);
    await userEvent.click(row(radios[0]!));
    expect(radios[0]!.checked).toBe(true);
  });

  it('a click on the text checks and unchecks the others, with events only on the new one', async () => {
    const radios = await group(['Pix', 'Card']);
    radios[0]!.checked = true;
    await settle(radios);
    const first = vi.fn();
    const second = vi.fn();
    radios[0]!.addEventListener('change', first);
    radios[1]!.addEventListener('change', second);
    await userEvent.click(radios[1]!.shadowRoot?.querySelector('.text') as HTMLElement);
    await settle(radios);
    expect(radios.map((radio) => radio.checked)).toEqual([false, true]);
    expect([first.mock.calls.length, second.mock.calls.length]).toEqual([0, 1]);
  });

  it('checked = true in code unchecks the others, with no event', async () => {
    const radios = await group(['Pix', 'Card', 'Slip']);
    radios[0]!.checked = true;
    await settle(radios);
    const changes = vi.fn();
    document.body.addEventListener('change', changes);
    radios[2]!.checked = true;
    await settle(radios);
    expect(radios.map((radio) => radio.checked)).toEqual([false, false, true]);
    expect(changes).not.toHaveBeenCalled();
  });

  it('two checked at mount: the last one in document order stays', async () => {
    document.body.innerHTML =
      '<nph-radio name="m" text="A" checked></nph-radio><nph-radio name="m" text="B"></nph-radio><nph-radio name="m" text="C" checked></nph-radio>';
    const radios = [...document.querySelectorAll('nph-radio')] as NphRadio[];
    await settle(radios);
    expect(radios.map((radio) => radio.checked)).toEqual([false, false, true]);
  });

  it('two groups do not mix: own Tab stop, own position and own arrows', async () => {
    const shift = await group(['Morning', 'Afternoon'], { name: 'shift' });
    const bond = await group(['Employee', 'Contractor', 'Partner'], { name: 'bond' });
    shift[1]!.checked = true;
    bond[0]!.checked = true;
    await settle([...shift, ...bond]);
    expect(shift.map((r) => [r.checked, row(r).getAttribute('aria-posinset'), row(r).getAttribute('aria-setsize')])).toEqual([
      [false, '1', '2'],
      [true, '2', '2'],
    ]);
    expect(bond.map((r) => [row(r).getAttribute('aria-posinset'), row(r).getAttribute('aria-setsize')])).toEqual([
      ['1', '3'],
      ['2', '3'],
      ['3', '3'],
    ]);
    row(shift[1]!).focus();
    await userEvent.keyboard('{ArrowDown}');
    await settle([...shift, ...bond]);
    expect(shift.map((r) => r.checked)).toEqual([true, false]);
    expect(bond.map((r) => r.checked)).toEqual([true, false, false]);
  });

  it('without name, the radio is alone', async () => {
    const a = await mount({ text: 'A', checked: true });
    const b = await mount({ text: 'B', checked: true });
    expect([a.checked, b.checked]).toEqual([true, true]);
    expect(row(a).getAttribute('aria-setsize')).toBe('1');
  });
});

describe('form', () => {
  it('submits only the value of the checked one', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const radios = await group(['Pix', 'Card'], {}, form);
    expect([...new FormData(form).entries()]).toEqual([]);
    radios[1]!.checked = true;
    await settle(radios);
    expect([...new FormData(form).entries()]).toEqual([['payment', 'card']]);
  });

  it('a radio in another form is another group', async () => {
    const one = document.createElement('form');
    const two = document.createElement('form');
    document.body.append(one, two);
    const [a] = await group(['A'], { checked: true }, one);
    const [b] = await group(['B'], { checked: true }, two);
    expect([a!.checked, b!.checked]).toEqual([true, true]);
  });

  it('reset returns to the initial checked attribute', async () => {
    const form = document.createElement('form');
    form.innerHTML = '<nph-radio name="r" text="A" checked></nph-radio><nph-radio name="r" text="B"></nph-radio>';
    document.body.append(form);
    const radios = [...form.querySelectorAll('nph-radio')] as NphRadio[];
    await settle(radios);
    radios[1]!.checked = true;
    await settle(radios);
    form.reset();
    await settle(radios);
    expect(radios.map((radio) => radio.checked)).toEqual([true, false]);
  });

  it('a disabled fieldset takes the group out of Tab and hides the error', async () => {
    const fieldset = document.createElement('fieldset');
    fieldset.disabled = true;
    document.body.append(fieldset);
    const radios = await group(['Pix', 'Card'], { invalid: true }, fieldset);
    expect(radios.map((radio) => row(radio).hasAttribute('tabindex'))).toEqual([false, false]);
    expect(row(radios[0]!).hasAttribute('aria-invalid')).toBe(false);
    expect(getComputedStyle(radios[0]!).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(borderColor(radios[0]!)).toBe(resolved('color', '--nph-color-input'));
  });
});

describe('accessible name', () => {
  it('the text is the name from content; aria-checked follows checked', async () => {
    const element = await mount({ text: 'Pix', checked: true });
    expect(row(element).textContent?.trim()).toBe('Pix');
    expect(row(element).hasAttribute('aria-label')).toBe(false);
    expect(row(element).getAttribute('aria-checked')).toBe('true');
  });

  it('hide-text: only the circle, 24 × 24, and the text becomes the aria-label', async () => {
    const element = await mount({ text: 'Choose the plan', hideText: true });
    expect(element.shadowRoot?.querySelector('.text')).toBeNull();
    expect(row(element).getAttribute('aria-label')).toBe('Choose the plan');
    const iconSize = Number.parseFloat(resolved('width', '--nph-icon-size-sm'));
    const tight = Number.parseFloat(resolved('padding-left', '--nph-space-inline-tight'));
    const host = element.getBoundingClientRect();
    expect([host.width, host.height]).toEqual([iconSize + 2 * tight, iconSize + 2 * tight]);
  });
});

describe('invalid input', () => {
  it('without text, it renders nothing and complains in development', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ text: '' });
    expect(element.shadowRoot?.childElementCount).toBe(0);
    expect(getComputedStyle(element).display).toBe('none');
    expect(errors.mock.calls.some((call) => String(call[0]).includes('text is empty'))).toBe(true);
  });

  it('invalid and disabled together: nothing, one error (frame 1196:311, section 5)', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ text: 'Pix', invalid: true, disabled: true });
    expect(element.shadowRoot?.childElementCount).toBe(0);
    expect(errors.mock.calls.some((call) => String(call[0]).includes('do not combine'))).toBe(true);
  });
});
