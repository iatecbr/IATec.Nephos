/**
 * Tests of `nph-input` (P69), in a real browser (P21, item 5): resolved color, real
 * hover, keyboard focus, form participation and measurements only exist where there
 * is layout.
 *
 * Color schemes are switched at the root (`data-nph-color-scheme` on `html`).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-input.css?raw';
import '../nph-label/nph-label';
import { NPH_INPUT_SIZES, NphInput } from './nph-input';
import type { NphInputSize } from './nph-input';

type Props = Partial<
  Pick<
    NphInput,
    'size' | 'value' | 'placeholder' | 'iconStart' | 'clearable' | 'clearLabel' | 'invalid' | 'disabled' | 'required' | 'name' | 'label'
  >
>;

const HEIGHT: Readonly<Record<NphInputSize, string>> = {
  default: '--nph-control-height-default',
  large: '--nph-control-height-large',
};

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

async function mount(props: Props = { label: 'Email' }, parent: HTMLElement = document.body): Promise<NphInput> {
  const element = document.createElement('nph-input');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

function field(element: NphInput): HTMLDivElement {
  const box = element.shadowRoot?.querySelector<HTMLDivElement>('.field');
  if (!box) throw new Error('no .field');
  return box;
}

function control(element: NphInput): HTMLInputElement {
  const input = element.shadowRoot?.querySelector<HTMLInputElement>('input');
  if (!input) throw new Error('no inner <input>');
  return input;
}

function clearButton(element: NphInput): HTMLButtonElement | null {
  return element.shadowRoot?.querySelector<HTMLButtonElement>('button.clear') ?? null;
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** Border color, taken from the `inset` `box-shadow`. */
function borderColor(element: NphInput): string {
  const shadow = getComputedStyle(field(element)).boxShadow;
  return shadow === 'none' ? 'none' : (shadow.match(/rgba?\([^)]*\)/)?.[0] ?? shadow);
}

async function frame(): Promise<void> {
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
}

describe('registration and API', () => {
  it('defines nph-input only once and is form-associated', () => {
    expect(customElements.get('nph-input')).toBe(NphInput);
    expect((NphInput as unknown as { formAssociated: boolean }).formAssociated).toBe(true);
  });

  it('the public API is exactly the one in P69', () => {
    const declared = [...(NphInput as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual([
      'size',
      'value',
      'placeholder',
      'iconStart',
      'clearable',
      'clearLabel',
      'invalid',
      'disabled',
      'required',
      'name',
      'label',
    ]);
  });

  it('the sizes are the Figma ones, nothing more, and default is the default', async () => {
    expect([...NPH_INPUT_SIZES]).toEqual(['default', 'large']);
    const element = await mount();
    expect(element.size).toBe('default');
    expect(element.getAttribute('size')).toBe('default');
  });

  it('the attributes are icon-start and clear-label', async () => {
    const element = document.createElement('nph-input');
    element.setAttribute('label', 'Search');
    element.setAttribute('icon-start', 'magnifying-glass');
    element.setAttribute('clear-label', 'Clear');
    document.body.append(element);
    await element.updateComplete;
    expect([element.iconStart, element.clearLabel]).toEqual(['magnifying-glass', 'Clear']);
  });

  it('has no slot, no ::part and type text only', async () => {
    const element = await mount({ label: 'Email', iconStart: 'magnifying-glass', value: 'a', clearable: true, clearLabel: 'Clear' });
    expect(element.shadowRoot?.querySelector('slot')).toBeNull();
    expect(element.shadowRoot?.querySelector('[part]')).toBeNull();
    expect(control(element).type).toBe('text');
  });
});

describe('anatomy and tokens', () => {
  for (const size of NPH_INPUT_SIZES) {
    it(`${size}: token height and width, padding, gap, radius, border and body-md text`, async () => {
      const element = await mount({ size, label: 'Search', iconStart: 'magnifying-glass', value: 'Ana', clearable: true, clearLabel: 'Clear' });
      const box = field(element);
      const style = getComputedStyle(box);
      expect(style.height).toBe(resolved('height', HEIGHT[size]));
      expect(style.width).toBe(resolved('width', '--nph-layout-input-width'));
      expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-control-padding'));
      expect(style.paddingRight).toBe(resolved('padding-right', '--nph-space-control-padding'));
      expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline'));
      expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-control'));
      expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
      expect(borderColor(element)).toBe(resolved('color', '--nph-color-input'));
      const text = getComputedStyle(control(element));
      expect(text.fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
      expect(text.lineHeight).toBe(resolved('line-height', '--nph-text-body-md-line-height'));
      expect(text.color).toBe(resolved('color', '--nph-color-foreground'));
      const icon = box.querySelector('nph-icon');
      expect(icon?.getAttribute('size')).toBe('sm');
      expect(icon && getComputedStyle(icon).color).toBe(resolved('color', '--nph-color-muted-foreground'));
      const clear = clearButton(element);
      const target = clear?.getBoundingClientRect();
      const tight = Number.parseFloat(resolved('padding-left', '--nph-space-inline-tight'));
      const iconSize = Number.parseFloat(resolved('width', '--nph-icon-size-sm'));
      expect([target?.width, target?.height]).toEqual([iconSize + 2 * tight, iconSize + 2 * tight]);
      expect(clear && getComputedStyle(clear).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    });
  }

  it('in a container narrower than the token, the field shrinks to it', async () => {
    const narrow = document.createElement('div');
    narrow.style.width = '100px';
    document.body.append(narrow);
    const element = await mount({ label: 'Email', value: 'ana@example.com' }, narrow);
    expect(element.getBoundingClientRect().width).toBe(100);
    expect(field(element).getBoundingClientRect().width).toBe(100);
  });

  it('the placeholder is color/muted-foreground', async () => {
    const element = await mount({ label: 'Email', placeholder: 'name@example.com' });
    expect(getComputedStyle(control(element), '::placeholder').color).toBe(resolved('color', '--nph-color-muted-foreground'));
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

describe('states', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: hover darkens the border to color/input-hover`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      await userEvent.hover(field(element));
      expect(borderColor(element)).toBe(resolved('color', '--nph-color-input-hover'));
    });

    it(`${scheme}: focus draws focus/border and the focus/halo outside, touching it`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const before = document.createElement('input');
      document.body.append(before);
      const element = await mount();
      before.focus();
      await userEvent.tab();
      expect(element.shadowRoot?.activeElement).toBe(control(element));
      expect(borderColor(element)).toBe(resolved('color', '--nph-focus-border'));
      const halo = getComputedStyle(field(element), '::after');
      expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
      expect(halo.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
      expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control'));
      const ring = Number.parseFloat(resolved('width', '--nph-focus-ring-width'));
      expect(Number.parseFloat(halo.width)).toBeCloseTo(field(element).getBoundingClientRect().width + 2 * ring, 2);
    });

    it(`${scheme}: invalid is status/error; with focus, the halo is focus/halo-error`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount({ label: 'Email', invalid: true });
      expect(borderColor(element)).toBe(resolved('color', '--nph-status-error'));
      await userEvent.hover(field(element));
      expect(borderColor(element)).toBe(resolved('color', '--nph-status-error'));
      control(element).focus();
      expect(borderColor(element)).toBe(resolved('color', '--nph-status-error'));
      expect(getComputedStyle(field(element), '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
      expect(control(element).getAttribute('aria-invalid')).toBe('true');
    });

    it(`${scheme}: the clear focus keeps the field border and rings the clear target`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount({ label: 'Search', value: 'Ana', clearable: true, clearLabel: 'Clear' });
      control(element).focus();
      await userEvent.tab();
      const clear = clearButton(element);
      expect(element.shadowRoot?.activeElement).toBe(clear);
      expect(borderColor(element)).toBe(resolved('color', '--nph-color-input'));
      expect(getComputedStyle(field(element), '::after').content).toBe('none');
      const border = getComputedStyle(clear as HTMLButtonElement, '::before');
      const halo = getComputedStyle(clear as HTMLButtonElement, '::after');
      expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
      expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
      expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
      expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
    });
  }

  it('hover keeps the focus/border of a focused field', async () => {
    const element = await mount();
    await userEvent.click(control(element));
    await userEvent.hover(field(element));
    expect(borderColor(element)).toBe(resolved('color', '--nph-focus-border'));
  });

  it('invalid with focus on the clear keeps the status/error border (D8)', async () => {
    const element = await mount({ label: 'Search', value: 'Ana', invalid: true, clearable: true, clearLabel: 'Clear' });
    clearButton(element)?.focus();
    expect(borderColor(element)).toBe(resolved('color', '--nph-status-error'));
  });

  it('disabled: color/muted background, state/disabled-opacity, out of Tab, error hidden', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ label: 'Email', value: 'Ana', disabled: true, invalid: true, clearable: true, clearLabel: 'Clear' });
    expect(getComputedStyle(field(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(borderColor(element)).toBe(resolved('color', '--nph-color-input'));
    expect(control(element).disabled).toBe(true);
    expect(control(element).hasAttribute('aria-invalid')).toBe(false);
    expect(clearButton(element)).toBeNull();
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
  });
});

describe('value, events and clear', () => {
  it('typing updates value, input crosses the shadow root and change reaches the host', async () => {
    const element = await mount();
    const inputs = vi.fn();
    const changes = vi.fn();
    element.addEventListener('input', inputs);
    element.addEventListener('change', changes);
    await userEvent.click(control(element));
    await userEvent.keyboard('Ana');
    expect(element.value).toBe('Ana');
    expect(inputs).toHaveBeenCalledTimes(3);
    control(element).blur();
    expect(changes).toHaveBeenCalledTimes(1);
  });

  it('setting value in code updates the inner field', async () => {
    const element = await mount();
    element.value = 'Bia';
    await element.updateComplete;
    expect(control(element).value).toBe('Bia');
  });

  it('the clear button shows only with clearable, a value and outside disabled', async () => {
    const element = await mount({ label: 'Search', clearable: true, clearLabel: 'Clear' });
    expect(clearButton(element)).toBeNull();
    element.value = 'Ana';
    await element.updateComplete;
    expect(clearButton(element)?.getAttribute('aria-label')).toBe('Clear');
    expect(clearButton(element)?.type).toBe('button');
    expect(clearButton(element)?.querySelector('nph-icon')?.getAttribute('name')).toBe('xmark');
  });

  it('clearing empties the value, fires input and change, and returns the focus to the field', async () => {
    const element = await mount({ label: 'Search', value: 'Ana', clearable: true, clearLabel: 'Clear' });
    const inputs = vi.fn();
    const changes = vi.fn();
    element.addEventListener('input', inputs);
    element.addEventListener('change', changes);
    await userEvent.click(clearButton(element) as HTMLButtonElement);
    await element.updateComplete;
    expect(element.value).toBe('');
    expect(control(element).value).toBe('');
    expect([inputs.mock.calls.length, changes.mock.calls.length]).toEqual([1, 1]);
    expect(element.shadowRoot?.activeElement).toBe(control(element));
    expect(clearButton(element)).toBeNull();
  });
});

describe('form', () => {
  it('submits the value under name, and nothing else', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount({ label: 'Email', name: 'email', value: 'ana@example.com' }, form);
    expect(element.getAttribute('name')).toBe('email');
    expect([...new FormData(form).entries()]).toEqual([['email', 'ana@example.com']]);
  });

  it('Enter submits the form', async () => {
    const form = document.createElement('form');
    const submits = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submits);
    document.body.append(form);
    const element = await mount({ label: 'Email', name: 'email' }, form);
    await userEvent.click(control(element));
    await userEvent.keyboard('{Enter}');
    expect(submits).toHaveBeenCalledTimes(1);
  });

  it('required: the field carries required and the form is invalid while empty, anchored on the field', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount({ label: 'Email', name: 'email', required: true }, form);
    expect(control(element).required).toBe(true);
    expect(form.checkValidity()).toBe(false);
    expect((element as unknown as { matches(selector: string): boolean }).matches(':invalid')).toBe(true);
    element.value = 'ana@example.com';
    await element.updateComplete;
    expect(form.checkValidity()).toBe(true);
  });

  it('reset returns to the initial value attribute', async () => {
    const form = document.createElement('form');
    form.innerHTML = '<nph-input label="Email" name="email" value="first"></nph-input>';
    document.body.append(form);
    const element = form.querySelector('nph-input') as NphInput;
    await element.updateComplete;
    element.value = 'changed';
    await element.updateComplete;
    form.reset();
    await element.updateComplete;
    expect(element.value).toBe('first');
  });

  it('a disabled fieldset disables the field without changing the property', async () => {
    const fieldset = document.createElement('fieldset');
    fieldset.disabled = true;
    document.body.append(fieldset);
    const element = await mount({ label: 'Email', value: 'Ana', invalid: true, clearable: true, clearLabel: 'Clear' }, fieldset);
    await element.updateComplete;
    expect(element.disabled).toBe(false);
    expect(control(element).disabled).toBe(true);
    expect(control(element).hasAttribute('aria-invalid')).toBe(false);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(borderColor(element)).toBe(resolved('color', '--nph-color-input'));
  });
});

describe('accessible name', () => {
  it('label names the inner field', async () => {
    const element = await mount({ label: 'Email' });
    expect(control(element).getAttribute('aria-label')).toBe('Email');
  });

  it('nph-label for names the field, without the decorative asterisk', async () => {
    document.body.innerHTML = '<nph-label for="city" text="City" required></nph-label><nph-input id="city"></nph-input>';
    const element = document.querySelector('nph-input') as NphInput;
    await element.updateComplete;
    await frame();
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('City');
  });

  it('a label mounted after the field is read on the next frame', async () => {
    const element = await mount({}, document.body);
    element.id = 'late';
    const label = document.createElement('nph-label');
    label.setAttribute('for', 'late');
    label.setAttribute('text', 'Late');
    document.body.prepend(label);
    await frame();
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Late');
  });

  it('changing the text of nph-label renames the field', async () => {
    document.body.innerHTML = '<nph-label for="name" text="Name"></nph-label><nph-input id="name"></nph-input>';
    const label = document.querySelector('nph-label') as HTMLElement & { text: string; updateComplete: Promise<unknown> };
    const element = document.querySelector('nph-input') as NphInput;
    await frame();
    await element.updateComplete;
    label.text = 'Nombre';
    await label.updateComplete;
    await new Promise((resolve) => setTimeout(resolve));
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Nombre');
  });

  it('a label that appears much later is read on focusin (limit L-c)', async () => {
    const element = await mount({}, document.body);
    element.id = 'later';
    await frame();
    document.body.insertAdjacentHTML('afterbegin', '<label for="later">Later</label>');
    element.focus();
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Later');
  });

  it('a click on the associated label puts the focus in the inner field', async () => {
    document.body.innerHTML = '<nph-label for="click" text="Click"></nph-label><nph-input id="click"></nph-input>';
    const element = document.querySelector('nph-input') as NphInput;
    await element.updateComplete;
    await frame();
    await userEvent.click(document.querySelector('nph-label label') as HTMLElement);
    expect(element.shadowRoot?.activeElement).toBe(control(element));
  });
});

describe('invalid input', () => {
  it('accumulates one error per cause and renders nothing', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ size: 'compact' as NphInputSize, iconStart: 'not-an-icon', clearable: true, label: 'Email' });
    expect(element.shadowRoot?.childElementCount).toBe(0);
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(element).display).toBe('none');
    const messages = errors.mock.calls.map((call) => String(call[0]));
    expect(messages.some((message) => message.includes('size "compact"'))).toBe(true);
    expect(messages.some((message) => message.includes('icon-start "not-an-icon"'))).toBe(true);
    expect(messages.some((message) => message.includes('clear-label'))).toBe(true);
  });

  it('no label at all still renders, with no error: the association may come later', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({});
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(errors).not.toHaveBeenCalled();
  });
});
