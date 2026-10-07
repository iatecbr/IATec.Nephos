/**
 * Tests of `nph-checkbox` (P69), in a real browser (P21, item 5): resolved color, real
 * hover, keyboard focus, form participation and measurements only exist where there
 * is layout.
 *
 * Color schemes are switched at the root (`data-nph-color-scheme` on `html`).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-checkbox.css?raw';
import { NphCheckbox } from './nph-checkbox';

type Props = Partial<Pick<NphCheckbox, 'checked' | 'indeterminate' | 'text' | 'hideText' | 'invalid' | 'disabled' | 'name' | 'value'>>;

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

async function mount(props: Props = { text: 'Email' }, parent: HTMLElement = document.body): Promise<NphCheckbox> {
  const element = document.createElement('nph-checkbox');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

function box(element: NphCheckbox): HTMLInputElement {
  const input = element.shadowRoot?.querySelector<HTMLInputElement>('input');
  if (!input) throw new Error('no inner <input>');
  return input;
}

function target(element: NphCheckbox): HTMLElement {
  const node = element.shadowRoot?.querySelector<HTMLElement>('.target');
  if (!node) throw new Error('no .target');
  return node;
}

function mark(element: NphCheckbox): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>('.mark') ?? null;
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

function borderColor(element: NphCheckbox): string {
  const shadow = getComputedStyle(box(element)).boxShadow;
  return shadow === 'none' ? 'none' : (shadow.match(/rgba?\([^)]*\)/)?.[0] ?? shadow);
}

describe('registration and API', () => {
  it('defines nph-checkbox only once and is form-associated', () => {
    expect(customElements.get('nph-checkbox')).toBe(NphCheckbox);
    expect((NphCheckbox as unknown as { formAssociated: boolean }).formAssociated).toBe(true);
  });

  it('the public API is exactly the one in P69', () => {
    const declared = [...(NphCheckbox as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['checked', 'indeterminate', 'text', 'hideText', 'invalid', 'disabled', 'name', 'value']);
  });

  it('the defaults: unchecked, not indeterminate, value on', async () => {
    const element = await mount();
    expect([element.checked, element.indeterminate, element.value, element.hideText]).toEqual([false, false, 'on', false]);
  });

  it('has no slot and no ::part; the inner control is a native check box', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('slot')).toBeNull();
    expect(element.shadowRoot?.querySelector('[part]')).toBeNull();
    expect(box(element).type).toBe('checkbox');
  });
});

describe('anatomy and tokens', () => {
  it('24 × 24 target, 16 × 16 box with radius/inner, space/inline gap and label-md text', async () => {
    const element = await mount({ text: 'Email' });
    const iconSize = Number.parseFloat(resolved('width', '--nph-icon-size-sm'));
    const tight = Number.parseFloat(resolved('padding-left', '--nph-space-inline-tight'));
    const area = target(element).getBoundingClientRect();
    expect([area.width, area.height]).toEqual([iconSize + 2 * tight, iconSize + 2 * tight]);
    const square = box(element).getBoundingClientRect();
    expect([square.width, square.height]).toEqual([iconSize, iconSize]);
    expect(getComputedStyle(box(element)).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-inner'));
    const row = element.shadowRoot?.querySelector('.row') as HTMLElement;
    expect(getComputedStyle(row).columnGap).toBe(resolved('column-gap', '--nph-space-inline'));
    expect(getComputedStyle(row).fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(getComputedStyle(row).color).toBe(resolved('color', '--nph-color-foreground'));
  });

  it('the first line of text sits centered on the target', async () => {
    const element = await mount({ text: 'Email' });
    const text = element.shadowRoot?.querySelector('.text') as HTMLElement;
    const a = target(element).getBoundingClientRect();
    const b = text.getBoundingClientRect();
    const line = Number.parseFloat(resolved('line-height', '--nph-text-label-md-line-height'));
    const padding = Number.parseFloat(getComputedStyle(text).paddingTop);
    expect(b.top + padding + line / 2).toBeCloseTo(a.top + a.height / 2, 1);
  });

  it('a long word breaks inside the piece in a narrow container', async () => {
    const narrow = document.createElement('div');
    narrow.style.width = '80px';
    document.body.append(narrow);
    const element = await mount({ text: 'Notificationsandmessages' }, narrow);
    const text = element.shadowRoot?.querySelector('.text') as HTMLElement;
    expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(narrow.getBoundingClientRect().right + 0.5);
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
    it(`${scheme}: unchecked is color/background with color/input`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      expect(getComputedStyle(box(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
      expect(borderColor(element)).toBe(resolved('color', '--nph-color-input'));
      expect(mark(element)).toBeNull();
    });

    for (const [marked, icon] of [['checked', 'check'], ['indeterminate', 'minus']] as const) {
      it(`${scheme}: ${marked} is color/primary with color/input and the ${icon} mark in color/primary-foreground`, async () => {
        document.documentElement.setAttribute('data-nph-color-scheme', scheme);
        const element = await mount({ text: 'Email', [marked]: true });
        expect(getComputedStyle(box(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary'));
        expect(borderColor(element)).toBe(resolved('color', '--nph-color-input'));
        expect(mark(element)?.getAttribute('name')).toBe(icon);
        expect(mark(element)?.getAttribute('size')).toBe('sm');
        expect(getComputedStyle(mark(element) as HTMLElement).color).toBe(resolved('color', '--nph-color-primary-foreground'));
        await userEvent.hover(element.shadowRoot?.querySelector('.text') as HTMLElement);
        expect(borderColor(element)).toBe(resolved('color', '--nph-color-input-hover'));
        expect(getComputedStyle(box(element)).opacity).toBe(resolved('opacity', '--nph-state-hover-opacity'));
      });
    }

    it(`${scheme}: hover on the unchecked darkens only the border`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      await userEvent.hover(box(element));
      expect(borderColor(element)).toBe(resolved('color', '--nph-color-input-hover'));
      expect(getComputedStyle(box(element)).opacity).toBe('1');
    });

    it(`${scheme}: Tab draws focus/border and the focus/halo filling the target`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const before = document.createElement('input');
      document.body.append(before);
      const element = await mount();
      before.focus();
      await userEvent.tab();
      expect(element.shadowRoot?.activeElement).toBe(box(element));
      expect(borderColor(element)).toBe(resolved('color', '--nph-focus-border'));
      const halo = getComputedStyle(target(element), '::after');
      expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
      expect(halo.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
      expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-inner'));
      expect(Number.parseFloat(halo.width)).toBeCloseTo(target(element).getBoundingClientRect().width, 2);
    });

    it(`${scheme}: invalid is status/error; with focus, the halo is focus/halo-error`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount({ text: 'Email', invalid: true, checked: true });
      expect(borderColor(element)).toBe(resolved('color', '--nph-status-error'));
      expect(box(element).getAttribute('aria-invalid')).toBe('true');
      const before = document.createElement('input');
      document.body.prepend(before);
      before.focus();
      await userEvent.tab();
      expect(borderColor(element)).toBe(resolved('color', '--nph-status-error'));
      expect(getComputedStyle(target(element), '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
    });
  }

  it('hover keeps the status/error border of an invalid box', async () => {
    const element = await mount({ text: 'Email', invalid: true });
    await userEvent.hover(box(element));
    expect(borderColor(element)).toBe(resolved('color', '--nph-status-error'));
  });

  it('hover keeps the focus/border of a focused box', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount();
    before.focus();
    await userEvent.tab();
    await userEvent.hover(box(element));
    expect(borderColor(element)).toBe(resolved('color', '--nph-focus-border'));
  });

  it('a mouse click does not draw the focus', async () => {
    const element = await mount();
    await userEvent.click(box(element));
    expect(getComputedStyle(target(element), '::after').content).toBe('none');
  });

  it('disabled: state/disabled-opacity, out of Tab, no toggle, error hidden', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ text: 'Email', disabled: true, invalid: true });
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(borderColor(element)).toBe(resolved('color', '--nph-color-input'));
    expect(box(element).hasAttribute('aria-invalid')).toBe(false);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
    box(element).click();
    expect(element.checked).toBe(false);
  });
});

describe('interaction and events', () => {
  it('Space toggles; input crosses the shadow root and change reaches the host', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount();
    const inputs = vi.fn();
    const changes = vi.fn();
    element.addEventListener('input', inputs);
    element.addEventListener('change', changes);
    before.focus();
    await userEvent.tab();
    await userEvent.keyboard(' ');
    expect(element.checked).toBe(true);
    expect(element.hasAttribute('checked')).toBe(true);
    await userEvent.keyboard(' ');
    expect(element.checked).toBe(false);
    expect([inputs.mock.calls.length, changes.mock.calls.length]).toEqual([2, 2]);
  });

  it('a click on the text toggles', async () => {
    const element = await mount();
    await userEvent.click(element.shadowRoot?.querySelector('.text') as HTMLElement);
    expect(element.checked).toBe(true);
  });

  it('toggling clears indeterminate, as the native check box', async () => {
    const element = await mount({ text: 'Select all', indeterminate: true });
    expect(box(element).indeterminate).toBe(true);
    await userEvent.click(box(element));
    await element.updateComplete;
    expect(element.indeterminate).toBe(false);
    expect(element.checked).toBe(true);
    expect(mark(element)?.getAttribute('name')).toBe('check');
  });

  it('setting checked in code updates the box, with no event', async () => {
    const element = await mount();
    const changes = vi.fn();
    element.addEventListener('change', changes);
    element.checked = true;
    await element.updateComplete;
    expect(box(element).checked).toBe(true);
    expect(changes).not.toHaveBeenCalled();
  });

  it('Tab stops at each box', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const first = await mount({ text: 'Email' });
    const second = await mount({ text: 'SMS' });
    before.focus();
    await userEvent.tab();
    expect(first.shadowRoot?.activeElement).toBe(box(first));
    await userEvent.tab();
    expect(second.shadowRoot?.activeElement).toBe(box(second));
  });
});

describe('form', () => {
  it('submits value only when checked', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const email = await mount({ text: 'Email', name: 'channel', value: 'email', checked: true }, form);
    await mount({ text: 'SMS', name: 'channel', value: 'sms' }, form);
    expect(email.getAttribute('name')).toBe('channel');
    expect([...new FormData(form).entries()]).toEqual([['channel', 'email']]);
  });

  it('reset returns to the initial checked attribute', async () => {
    const form = document.createElement('form');
    form.innerHTML = '<nph-checkbox text="Email" name="c" checked></nph-checkbox>';
    document.body.append(form);
    const element = form.querySelector('nph-checkbox') as NphCheckbox;
    await element.updateComplete;
    element.checked = false;
    element.indeterminate = true;
    await element.updateComplete;
    form.reset();
    await element.updateComplete;
    expect([element.checked, element.indeterminate]).toEqual([true, false]);
  });

  it('a disabled fieldset disables the box without changing the property', async () => {
    const fieldset = document.createElement('fieldset');
    fieldset.disabled = true;
    document.body.append(fieldset);
    const element = await mount({ text: 'Email', invalid: true }, fieldset);
    await element.updateComplete;
    expect(element.disabled).toBe(false);
    expect(box(element).disabled).toBe(true);
    expect(box(element).hasAttribute('aria-invalid')).toBe(false);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(borderColor(element)).toBe(resolved('color', '--nph-color-input'));
  });
});

describe('accessible name', () => {
  it('the text names the box through the native label', async () => {
    const element = await mount({ text: 'Email' });
    expect(box(element).labels?.[0]?.textContent?.trim()).toBe('Email');
    expect(box(element).hasAttribute('aria-label')).toBe(false);
  });

  it('hide-text: only the box, 24 × 24, and the text becomes the aria-label', async () => {
    const element = await mount({ text: 'Select the row', hideText: true });
    expect(element.shadowRoot?.querySelector('.text')).toBeNull();
    expect(box(element).getAttribute('aria-label')).toBe('Select the row');
    const iconSize = Number.parseFloat(resolved('width', '--nph-icon-size-sm'));
    const tight = Number.parseFloat(resolved('padding-left', '--nph-space-inline-tight'));
    const host = element.getBoundingClientRect();
    expect([host.width, host.height]).toEqual([iconSize + 2 * tight, iconSize + 2 * tight]);
  });
});

describe('invalid input', () => {
  it('without text, it renders nothing and complains in development', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ text: '   ' });
    expect(element.shadowRoot?.childElementCount).toBe(0);
    expect(getComputedStyle(element).display).toBe('none');
    expect(errors.mock.calls.some((call) => String(call[0]).includes('text is empty'))).toBe(true);
  });
});
