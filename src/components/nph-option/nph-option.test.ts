/**
 * Tests of `nph-option` (P91), in a real browser (P21, item 5).
 *
 * They prove the contract of `nph-select / opção` (`1357:136`) and D3, D5 and D6:
 * the API, the role and the states through `ElementInternals`, the value, the
 * start (icon, avatar, dot), the measures, the active and selected looks and their
 * precedence, the owner contract, the invalid input and the token contract. The
 * option inside the list is proved in the `nph-select` tests.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-option.css?raw';
import {
  NPH_OPTION_CHANGED,
  NPH_OPTION_STARTS,
  NPH_OPTION_STATUSES,
  NphOption,
  collapsedText,
} from './nph-option';

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

/** A plain list holder, as wide as a select list. */
async function mount(source: string): Promise<NphOption> {
  const holder = document.createElement('div');
  holder.style.inlineSize = 'var(--nph-layout-input-width)';
  holder.innerHTML = source;
  document.body.append(holder);
  const element = holder.querySelector('nph-option') as NphOption;
  await element.updateComplete;
  return element;
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

function part(element: NphOption, selector: string): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>(selector) ?? null;
}

describe('registration and API', () => {
  it('defines nph-option, with its defaults', async () => {
    const element = await mount('<nph-option>Finance</nph-option>');
    expect(customElements.get('nph-option')).toBe(NphOption);
    expect(element.start).toBe('none');
    expect(element.icon).toBe('globe');
    expect(element.src).toBe('');
    expect(element.status).toBeNull();
    expect(element.secondary).toBe('');
    expect(element.disabled).toBe(false);
    expect(element.selected).toBe(false);
    expect(element.active).toBe(false);
    expect(NPH_OPTION_STARTS).toEqual(['none', 'icon', 'avatar', 'dot']);
    expect(NPH_OPTION_STATUSES).toEqual(['neutral', 'info', 'warning', 'success', 'error', 'help']);
  });

  it('value reflects; without the attribute, it is the label text with its white space collapsed', async () => {
    const element = await mount('<nph-option>  Customer\n   success  </nph-option>');
    expect(element.value).toBe('Customer success');
    expect(collapsedText(element)).toBe('Customer success');
    element.value = 'cs';
    expect(element.getAttribute('value')).toBe('cs');
    expect(element.value).toBe('cs');
  });

  it('disabled reflects; selected and active are never reflected', async () => {
    const element = await mount('<nph-option>Finance</nph-option>');
    element.disabled = true;
    element.selected = true;
    element.active = true;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(true);
    expect(element.hasAttribute('selected')).toBe(false);
    expect(element.hasAttribute('active')).toBe(false);
  });

  it('writes no ARIA attribute on its own host: role and states come from ElementInternals', async () => {
    const element = await mount('<nph-option>Finance</nph-option>');
    element.selected = true;
    element.disabled = true;
    await element.updateComplete;
    expect([...element.attributes].map((attribute) => attribute.name).filter((name) => name === 'role' || name.startsWith('aria-'))).toEqual([]);
    expect(element.matches(':state(selected)')).toBe(true);
  });

  it('has no part, no event of its own and no color property', async () => {
    const element = await mount('<nph-option secondary="Team">Finance</nph-option>');
    expect(element.shadowRoot?.querySelectorAll('[part]').length).toBe(0);
    const declared = [...(NphOption as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['color', 'variant', 'marker', 'checkbox', 'label']) {
      expect(declared).not.toContain(name);
    }
  });
});

describe('anatomy and measures', () => {
  it('padding and gap space/inline, radius/inner, text/label-md in color/popover-foreground, 36 px tall', async () => {
    const element = await mount('<nph-option start="icon">Finance</nph-option>');
    const style = getComputedStyle(element);
    expect(style.paddingTop).toBe(resolved('padding-top', '--nph-space-inline'));
    expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-inline'));
    expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-inner'));
    expect(style.color).toBe(resolved('color', '--nph-color-popover-foreground'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(element.getBoundingClientRect().height).toBeCloseTo(36, 1);
  });

  it('start icon: nph-icon md, hidden from the screen reader', async () => {
    const element = await mount('<nph-option start="icon" icon="house">Home</nph-option>');
    const icon = part(element, 'nph-icon.start') as HTMLElement;
    expect(icon.getAttribute('name')).toBe('house');
    expect(icon.getAttribute('size')).toBe('md');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getBoundingClientRect().width).toBeCloseTo(px('--nph-icon-size-md'), 1);
  });

  it('start avatar: nph-avatar sm with the photo, hidden; the option measures 40 px', async () => {
    const element = await mount('<nph-option start="avatar" src="photo.png">Ana Souza</nph-option>');
    const avatar = part(element, 'nph-avatar.start') as HTMLElement;
    expect(avatar.getAttribute('size')).toBe('sm');
    expect(avatar.getAttribute('src')).toBe('photo.png');
    expect(avatar.getAttribute('aria-hidden')).toBe('true');
    expect(element.getBoundingClientRect().height).toBeCloseTo(40, 1);
  });

  it('start dot: a space/inline circle centered in an icon/size-md box, hidden (D6)', async () => {
    const element = await mount('<nph-option start="dot" status="success">Active</nph-option>');
    const box = part(element, '.dot-box') as HTMLElement;
    const dot = part(element, '.dot') as HTMLElement;
    expect(box.getAttribute('aria-hidden')).toBe('true');
    expect(box.getBoundingClientRect().width).toBeCloseTo(px('--nph-icon-size-md'), 1);
    expect(dot.getBoundingClientRect().width).toBeCloseTo(px('--nph-space-inline'), 1);
    expect(dot.getBoundingClientRect().height).toBeCloseTo(px('--nph-space-inline'), 1);
    expect(getComputedStyle(dot).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
    const outer = box.getBoundingClientRect();
    const inner = dot.getBoundingClientRect();
    expect(inner.left - outer.left).toBeCloseTo(outer.right - inner.right, 1);
  });

  const colors: ReadonlyArray<readonly [string, string]> = [
    ['neutral', '--nph-color-muted-foreground'],
    ['info', '--nph-status-info'],
    ['warning', '--nph-status-warning'],
    ['success', '--nph-status-success'],
    ['error', '--nph-status-error'],
    ['help', '--nph-status-help'],
  ];
  for (const [status, token] of colors) {
    it(`the ${status} dot is ${token.replace('--nph-', '')}`, async () => {
      const element = await mount(`<nph-option start="dot" status="${status}">State</nph-option>`);
      expect(getComputedStyle(part(element, '.dot') as HTMLElement).backgroundColor).toBe(resolved('background-color', token));
    });
  }

  it('with no status, the dot follows the text color: popover-foreground, accent-foreground when active (D6)', async () => {
    const element = await mount('<nph-option start="dot">State</nph-option>');
    const dot = part(element, '.dot') as HTMLElement;
    expect(getComputedStyle(dot).backgroundColor).toBe(resolved('color', '--nph-color-popover-foreground'));
    element.active = true;
    expect(getComputedStyle(dot).backgroundColor).toBe(resolved('color', '--nph-color-accent-foreground'));
  });

  it('secondary: text/label-md in color/muted-foreground, space/inline-tight after the label', async () => {
    const element = await mount('<nph-option secondary="Product designer">Ana Souza</nph-option>');
    const label = part(element, '.label') as HTMLElement;
    const secondary = part(element, '.secondary') as HTMLElement;
    expect(secondary.textContent).toBe('Product designer');
    expect(getComputedStyle(secondary).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(secondary.getBoundingClientRect().left - label.getBoundingClientRect().right).toBeCloseTo(px('--nph-space-inline-tight'), 1);
  });

  it('an empty secondary turns it off', async () => {
    const element = await mount('<nph-option secondary="   ">Ana Souza</nph-option>');
    expect(part(element, '.secondary')).toBeNull();
  });

  it('label and secondary stay on one line with an ellipsis (D3)', async () => {
    const element = await mount('<nph-option secondary="A secondary text that is also far too long to fit">An option label that is far too long to fit in the list</nph-option>');
    for (const selector of ['.label', '.secondary']) {
      const text = part(element, selector) as HTMLElement;
      expect(getComputedStyle(text).whiteSpace).toBe('nowrap');
      expect(getComputedStyle(text).textOverflow).toBe('ellipsis');
    }
    expect((part(element, '.label') as HTMLElement).scrollWidth).toBeGreaterThan((part(element, '.label') as HTMLElement).clientWidth);
    expect(element.getBoundingClientRect().height).toBeCloseTo(36, 1);
    expect(element.getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-input-width'), 1);
  });
});

describe('states and precedence (D5)', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: active has the hover look, color/accent with color/accent-foreground`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount('<nph-option>Finance</nph-option>');
      expect(getComputedStyle(element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      element.active = true;
      expect(element.matches(':state(active)')).toBe(true);
      expect(getComputedStyle(element).backgroundColor).toBe(resolved('background-color', '--nph-color-accent'));
      expect(getComputedStyle(element).color).toBe(resolved('color', '--nph-color-accent-foreground'));
    });

    it(`${scheme}: selected is color/primary-surface with the check in color/primary, and wins over active`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount('<nph-option>Finance</nph-option>');
      element.selected = true;
      element.active = true;
      await element.updateComplete;
      expect(getComputedStyle(element).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
      const check = part(element, 'nph-icon.check') as HTMLElement;
      expect(check.getAttribute('name')).toBe('check');
      expect(check.getAttribute('size')).toBe('sm');
      expect(check.getAttribute('aria-hidden')).toBe('true');
      expect(getComputedStyle(check).color).toBe(resolved('color', '--nph-color-primary'));
    });
  }

  it('the check shows only while selected', async () => {
    const element = await mount('<nph-option>Finance</nph-option>');
    expect(part(element, '.check')).toBeNull();
    element.selected = true;
    await element.updateComplete;
    expect(part(element, '.check')).not.toBeNull();
    element.selected = false;
    await element.updateComplete;
    expect(part(element, '.check')).toBeNull();
  });

  it('disabled: state/disabled-opacity on the whole option; selected and disabled keeps the selected look (D-3)', async () => {
    const element = await mount('<nph-option disabled>Finance</nph-option>');
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    element.selected = true;
    await element.updateComplete;
    expect(getComputedStyle(element).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
  });
});

describe('owner contract', () => {
  it('a change of a property tells the owning list, through the symbol', async () => {
    const owner = document.createElement('div') as HTMLDivElement & { [NPH_OPTION_CHANGED]: (option: NphOption) => void };
    const heard = vi.fn();
    owner[NPH_OPTION_CHANGED] = heard;
    owner.innerHTML = '<nph-option>Finance</nph-option>';
    document.body.append(owner);
    const element = owner.querySelector('nph-option') as NphOption;
    await element.updateComplete;
    heard.mockClear();
    element.start = 'icon';
    await element.updateComplete;
    expect(heard).toHaveBeenCalledWith(element);
  });

  it('a parent that is not an owner hears nothing and nothing breaks', async () => {
    const element = await mount('<nph-option>Finance</nph-option>');
    element.secondary = 'Team';
    await element.updateComplete;
    expect(part(element, '.secondary')?.textContent).toBe('Team');
  });
});

describe('invalid input', () => {
  const cases: ReadonlyArray<readonly [string, string, number]> = [
    ['a start that does not exist', 'start="checkbox"', 1],
    ['a status that does not exist', 'start="dot" status="danger"', 1],
    ['an icon outside the core', 'start="icon" icon="not-a-core-name"', 1],
    ['accumulates the causes', 'start="x" status="y" icon="z"', 3],
  ];
  for (const [name, attributes, count] of cases) {
    it(`${name}: nothing and ${count} error(s) in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const element = await mount(`<nph-option ${attributes}>Finance</nph-option>`);
      expect(error).toHaveBeenCalledTimes(count);
      for (const call of error.mock.calls) {
        expect(String(call[0])).toContain('[nph-option]');
      }
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect(element.getBoundingClientRect().height).toBe(0);
    });
  }

  it('changing selected or active does not repeat the errors', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount('<nph-option start="x">Finance</nph-option>');
    element.selected = true;
    element.active = true;
    element.disabled = true;
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, and these are the ones the evidence names', () => {
    expect(used).toEqual(
      new Set([
        '--nph-space-inline',
        '--nph-radius-inner',
        '--nph-color-popover-foreground',
        '--nph-text-label-md-font-family',
        '--nph-text-label-md-font-size',
        '--nph-text-label-md-font-weight',
        '--nph-text-label-md-line-height',
        '--nph-text-label-md-letter-spacing',
        '--nph-icon-size-md',
        '--nph-radius-full',
        '--nph-color-muted-foreground',
        '--nph-status-info',
        '--nph-status-warning',
        '--nph-status-success',
        '--nph-status-error',
        '--nph-status-help',
        '--nph-space-inline-tight',
        '--nph-color-primary',
        '--nph-color-accent',
        '--nph-color-accent-foreground',
        '--nph-color-primary-surface',
        '--nph-state-disabled-opacity',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('never consumes a core or theme token, and has no literal color, measure or duration', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });
});
