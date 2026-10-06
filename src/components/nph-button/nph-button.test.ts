/**
 * Tests of `nph-button` (P68), in a real browser (P21, item 5): resolved color,
 * real hover, keyboard focus and measurements only exist where there is layout.
 *
 * Color schemes are switched at the root (`data-nph-color-scheme` on `html`).
 * In a part of the screen with another brand and another scheme, `status/on-solid` and
 * `focus/halo` resolve the local value (P67).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-button.css?raw';
import { NPH_BUTTON_EMPHASES, NPH_BUTTON_SEVERITIES, NPH_BUTTON_SIZES, NphButton } from './nph-button';
import type { NphButtonEmphasis, NphButtonSeverity, NphButtonSize } from './nph-button';

type Props = Partial<
  Pick<NphButton, 'severity' | 'emphasis' | 'size' | 'text' | 'iconStart' | 'iconEnd' | 'label' | 'disabled' | 'loading'>
>;

/** Tokens of each pair, read variant by variant in `461:13009`. */
interface Pair {
  bg: string | null;
  bgHover: string;
  fg: string;
  fgHover?: string;
  border?: string;
  borderHover?: string;
}

const SOLID: Readonly<Record<NphButtonSeverity, Pair>> = {
  primary: { bg: '--nph-color-primary', bgHover: '--nph-color-primary-hover', fg: '--nph-color-primary-foreground' },
  secondary: { bg: '--nph-color-secondary', bgHover: '--nph-color-secondary-hover', fg: '--nph-color-secondary-foreground' },
  info: { bg: '--nph-status-info', bgHover: '--nph-status-info-hover', fg: '--nph-status-on-solid' },
  warn: { bg: '--nph-status-warning', bgHover: '--nph-status-warning-hover', fg: '--nph-status-on-solid' },
  help: { bg: '--nph-status-help', bgHover: '--nph-status-help-hover', fg: '--nph-status-on-solid' },
  danger: { bg: '--nph-color-destructive', bgHover: '--nph-color-destructive-hover', fg: '--nph-color-destructive-foreground' },
  success: { bg: '--nph-status-success', bgHover: '--nph-status-success-hover', fg: '--nph-status-on-solid' },
};

const LIGHT_AND_OUTLINE = {
  primary: {
    bg: '--nph-color-primary-surface',
    bgHover: '--nph-color-primary-surface-hover',
    fg: '--nph-color-primary-on-surface',
    fgHover: '--nph-color-primary-on-surface-hover',
  },
  danger: {
    bg: '--nph-color-destructive-surface',
    bgHover: '--nph-color-destructive-surface-hover',
    fg: '--nph-color-destructive-on-surface',
    fgHover: '--nph-color-destructive-on-surface-hover',
  },
} as const;

const PAIRS: ReadonlyArray<readonly [NphButtonSeverity, NphButtonEmphasis, Pair]> = [
  ...NPH_BUTTON_SEVERITIES.map((severity) => [severity, 'solid', SOLID[severity]] as const),
  ['primary', 'outline', { ...LIGHT_AND_OUTLINE.primary, border: LIGHT_AND_OUTLINE.primary.fg, borderHover: LIGHT_AND_OUTLINE.primary.fgHover }],
  ['secondary', 'outline', { bg: '--nph-color-muted', bgHover: '--nph-color-secondary-surface-hover', fg: '--nph-color-secondary-foreground', border: '--nph-color-secondary-foreground', borderHover: '--nph-color-secondary-foreground' }],
  ['danger', 'outline', { ...LIGHT_AND_OUTLINE.danger, border: LIGHT_AND_OUTLINE.danger.fg, borderHover: LIGHT_AND_OUTLINE.danger.fgHover }],
  ['primary', 'light', LIGHT_AND_OUTLINE.primary],
  ['secondary', 'light', { bg: '--nph-color-secondary-light', bgHover: '--nph-color-secondary-light-hover', fg: '--nph-color-secondary-foreground' }],
  ['danger', 'light', LIGHT_AND_OUTLINE.danger],
  ['primary', 'ghost', { bg: null, bgHover: '--nph-color-primary-surface', fg: '--nph-color-primary-on-surface' }],
  ['secondary', 'ghost', { bg: null, bgHover: '--nph-color-muted', fg: '--nph-color-secondary-foreground' }],
  ['danger', 'ghost', { bg: null, bgHover: '--nph-color-destructive-surface', fg: '--nph-color-destructive-on-surface' }],
];

/** Focus per severity, the same in all emphases. */
const FOCUS: Readonly<Record<NphButtonSeverity, readonly [string, string]>> = {
  primary: ['--nph-color-primary', '--nph-focus-halo'],
  secondary: ['--nph-focus-border', '--nph-focus-halo'],
  info: ['--nph-status-info', '--nph-focus-halo-info'],
  warn: ['--nph-status-warning', '--nph-focus-halo-warn'],
  help: ['--nph-status-help', '--nph-focus-halo-help'],
  danger: ['--nph-color-destructive', '--nph-focus-halo-danger'],
  success: ['--nph-status-success', '--nph-focus-halo-success'],
};

const HEIGHT: Readonly<Record<NphButtonSize, string>> = {
  compact: '--nph-control-height-compact',
  default: '--nph-control-height-default',
  large: '--nph-control-height-large',
};

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

async function mount(props: Props = { text: 'Save' }): Promise<NphButton> {
  const element = document.createElement('nph-button');
  Object.assign(element, props);
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function control(element: NphButton): HTMLButtonElement {
  const button = element.shadowRoot?.querySelector<HTMLButtonElement>('button');
  if (!button) throw new Error('no inner <button>');
  return button;
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** A brand that is not the default, read from the generated CSS. */
const DEFAULT_BRAND = /:root,\s*\[data-nph-brand="([\w-]+)"\]/.exec(tokensCss)?.[1] ?? '';
const OTHER_BRAND =
  [...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? '').find((brand) => brand !== DEFAULT_BRAND) ?? '';

/** A part of the screen with another brand and another scheme, on the same element (P67). */
function scope(): HTMLElement {
  const part = document.createElement('div');
  part.setAttribute('data-nph-brand', OTHER_BRAND);
  part.setAttribute('data-nph-color-scheme', 'dark');
  document.body.append(part);
  return part;
}

/** The value of a token inside an element. */
function resolvedIn(parent: HTMLElement, property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** Outline stroke color, taken from the `inset` `box-shadow`. */
function insetColor(button: HTMLButtonElement): string {
  const shadow = getComputedStyle(button).boxShadow;
  return shadow === 'none' ? 'none' : (shadow.match(/rgba?\([^)]*\)/)?.[0] ?? shadow);
}

describe('registration and API', () => {
  it('defines nph-button only once', () => {
    expect(customElements.get('nph-button')).toBe(NphButton);
  });

  it('the public API is exactly the one in P68', () => {
    const declared = [...(NphButton as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['severity', 'emphasis', 'size', 'text', 'iconStart', 'iconEnd', 'label', 'disabled', 'loading']);
  });

  it('the defaults are primary, solid and default (size default by decision of 05-10-2026)', async () => {
    const element = await mount();
    expect([element.severity, element.emphasis, element.size]).toEqual(['primary', 'solid', 'default']);
    expect(getComputedStyle(control(element)).height).toBe(resolved('height', '--nph-control-height-default'));
    expect(element.disabled).toBe(false);
    expect(element.loading).toBe(false);
  });

  it('the values are the Figma ones, nothing more', () => {
    expect([...NPH_BUTTON_SEVERITIES]).toEqual(['primary', 'secondary', 'info', 'warn', 'help', 'danger', 'success']);
    expect([...NPH_BUTTON_EMPHASES]).toEqual(['solid', 'outline', 'light', 'ghost']);
    expect([...NPH_BUTTON_SIZES]).toEqual(['compact', 'default', 'large']);
  });

  it('the icon attributes are icon-start and icon-end', async () => {
    const element = document.createElement('nph-button');
    element.setAttribute('text', 'New');
    element.setAttribute('icon-start', 'plus');
    element.setAttribute('icon-end', 'chevron-down');
    document.body.append(element);
    await element.updateComplete;
    expect([element.iconStart, element.iconEnd]).toEqual(['plus', 'chevron-down']);
  });
});

describe('colors per severity and emphasis, at rest and on hover, in both schemes', () => {
  for (const scheme of ['light', 'dark'] as const) {
    for (const [severity, emphasis, pair] of PAIRS) {
      it(`${scheme} · ${severity} ${emphasis}`, async () => {
        document.documentElement.setAttribute('data-nph-color-scheme', scheme);
        const element = await mount({ severity, emphasis, size: 'default', text: 'Save', iconStart: 'plus' });
        const button = control(element);
        const icon = button.querySelector('nph-icon');
        const rest = getComputedStyle(button);
        expect(rest.backgroundColor).toBe(pair.bg ? resolved('background-color', pair.bg) : 'rgba(0, 0, 0, 0)');
        expect(rest.color).toBe(resolved('color', pair.fg));
        expect(icon && getComputedStyle(icon).color).toBe(resolved('color', pair.fg));
        expect(insetColor(button)).toBe(pair.border ? resolved('color', pair.border) : 'none');

        await userEvent.hover(button);
        const hover = getComputedStyle(button);
        expect(hover.backgroundColor).toBe(resolved('background-color', pair.bgHover));
        expect(hover.color).toBe(resolved('color', pair.fgHover ?? pair.fg));
        expect(insetColor(button)).toBe(pair.borderHover ? resolved('color', pair.borderHover) : 'none');
      });
    }
  }
});

describe('sizes and anatomy', () => {
  for (const size of NPH_BUTTON_SIZES) {
    it(`${size}: token height, padding, gap, radius and label-md text`, async () => {
      const element = await mount({ size, text: 'Save', iconStart: 'plus', iconEnd: 'chevron-down' });
      const button = control(element);
      const style = getComputedStyle(button);
      expect(style.height).toBe(resolved('height', HEIGHT[size]));
      expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-control-padding'));
      expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline-tight'));
      expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-control'));
      expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
      expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
      expect(style.whiteSpace).toBe('nowrap');
      const icons = [...button.querySelectorAll('nph-icon')];
      expect(icons.map((icon) => icon.getAttribute('size'))).toEqual(['sm', 'sm']);
      expect([...button.children].map((node) => node.tagName.toLowerCase())).toEqual(['nph-icon', 'span', 'nph-icon']);
    });

    it(`${size}: icon only is square and the icon follows the box`, async () => {
      const element = await mount({ size, iconStart: 'plus', label: 'Add' });
      const box = control(element).getBoundingClientRect();
      const height = Number.parseFloat(resolved('height', HEIGHT[size]));
      expect([box.width, box.height]).toEqual([height, height]);
      const expected = { compact: 'sm', default: 'md', large: 'lg' }[size];
      expect(control(element).querySelector('nph-icon')?.getAttribute('size')).toBe(expected);
    });
  }
});

describe('focus', () => {
  for (const severity of NPH_BUTTON_SEVERITIES) {
    it(`${severity}: Tab shows the border in the severity color and the halo outside`, async () => {
      const before = document.createElement('input');
      document.body.append(before);
      const element = await mount({ severity, size: 'default', text: 'Save' });
      before.focus();
      await userEvent.tab();
      const button = control(element);
      expect(element.shadowRoot?.activeElement).toBe(button);
      const border = getComputedStyle(button, '::before');
      const halo = getComputedStyle(button, '::after');
      const [borderToken, haloToken] = FOCUS[severity];
      expect(border.borderTopColor).toBe(resolved('color', borderToken));
      expect(border.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
      expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
      expect(halo.borderTopColor).toBe(resolved('color', haloToken));
      expect(halo.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
      expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
      /* Outside, without changing the size: 1 px of border and 4 px of halo. */
      const box = button.getBoundingClientRect();
      const borderWidth = Number.parseFloat(resolved('width', '--nph-border-width'));
      const ringWidth = Number.parseFloat(resolved('width', '--nph-focus-ring-width'));
      expect(Number.parseFloat(border.width)).toBeCloseTo(box.width + 2 * borderWidth, 2);
      expect(Number.parseFloat(halo.height)).toBeCloseTo(box.height + 2 * (borderWidth + ringWidth), 2);
    });
  }

  it('in a part of the screen with another brand and another scheme, the solid text and the halo are the local ones (P67)', async () => {
    const part = scope();
    const before = document.createElement('input');
    const info = document.createElement('nph-button');
    Object.assign(info, { severity: 'info', text: 'Save' });
    const primary = document.createElement('nph-button');
    Object.assign(primary, { severity: 'primary', text: 'Save' });
    part.append(info, before, primary);
    await Promise.all([info.updateComplete, primary.updateComplete]);
    const onSolid = resolvedIn(part, 'color', '--nph-status-on-solid');
    const halo = resolvedIn(part, 'color', '--nph-focus-halo');
    expect(onSolid).not.toBe(resolved('color', '--nph-status-on-solid'));
    expect(halo).not.toBe(resolved('color', '--nph-focus-halo'));
    expect(getComputedStyle(control(info)).color).toBe(onSolid);
    before.focus();
    await userEvent.tab();
    expect(primary.shadowRoot?.activeElement).toBe(control(primary));
    expect(getComputedStyle(control(primary), '::after').borderTopColor).toBe(halo);
  });

  it('a mouse click does not draw the focus', async () => {
    const element = await mount({ text: 'Save' });
    await userEvent.click(control(element));
    expect(getComputedStyle(control(element), '::before').content).toBe('none');
  });

  it('host focus goes to the native button', async () => {
    const element = await mount({ text: 'Save' });
    element.focus();
    expect(element.shadowRoot?.activeElement).toBe(control(element));
  });
});

describe('action and keyboard', () => {
  it('click, Enter and Space fire click on the host', async () => {
    const element = await mount({ text: 'Save' });
    const clicks = vi.fn();
    element.addEventListener('click', clicks);
    await userEvent.click(control(element));
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(clicks).toHaveBeenCalledTimes(3);
  });

  it('the inner button is type=button: it does not submit a form', async () => {
    const element = await mount();
    expect(control(element).type).toBe('button');
  });
});

describe('disabled', () => {
  it('leaves the Tab order, does not fire click and stays at state/disabled-opacity', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ text: 'Save', disabled: true });
    const clicks = vi.fn();
    element.addEventListener('click', clicks);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
    element.click();
    control(element).click();
    expect(clicks).not.toHaveBeenCalled();
    expect(control(element).disabled).toBe(true);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('on hover, the colors stay the resting ones', async () => {
    const element = await mount({ text: 'Save', disabled: true });
    const rest = getComputedStyle(control(element)).backgroundColor;
    await userEvent.hover(element, { force: true });
    expect(getComputedStyle(control(element)).backgroundColor).toBe(rest);
  });
});

describe('loading', () => {
  it('the spinner replaces the start icon, the end one disappears and the text stays', async () => {
    const element = await mount({ text: 'Save', iconStart: 'plus', iconEnd: 'chevron-down', loading: true });
    const button = control(element);
    expect([...button.children].map((node) => node.tagName.toLowerCase())).toEqual(['nph-spinner', 'span']);
    expect(button.querySelector('nph-spinner')?.getAttribute('size')).toBe('sm');
    expect(button.querySelector('nph-spinner')?.getAttribute('aria-hidden')).toBe('true');
    expect(button.querySelector('.text')?.textContent).toBe('Save');
  });

  it('stays focusable, announces busy and does not fire click', async () => {
    /* Tab starts from a field before the button, not from the focus the previous test left behind. */
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ text: 'Save', loading: true });
    const clicks = vi.fn();
    element.addEventListener('click', clicks);
    before.focus();
    await userEvent.tab();
    expect([document.activeElement?.tagName, element.shadowRoot?.activeElement?.tagName]).toEqual(['NPH-BUTTON', 'BUTTON']);
    await userEvent.keyboard('{Enter}');
    await userEvent.click(control(element), { force: true });
    element.click();
    expect(clicks).not.toHaveBeenCalled();
    expect(control(element).getAttribute('aria-disabled')).toBe('true');
    expect(control(element).getAttribute('aria-busy')).toBe('true');
    expect(getComputedStyle(element).opacity).toBe('1');
  });

  it('in icon only, the spinner is sm in compact and md in default and large', async () => {
    const sizes: Record<NphButtonSize, string> = { compact: 'sm', default: 'md', large: 'md' };
    for (const size of NPH_BUTTON_SIZES) {
      const element = await mount({ size, iconStart: 'plus', label: 'Add', loading: true });
      const children = [...control(element).children];
      expect(children.map((node) => node.tagName.toLowerCase())).toEqual(['nph-spinner']);
      expect(children[0]?.getAttribute('size')).toBe(sizes[size]);
      element.remove();
    }
  });

  it('the spinner inherits the text color', async () => {
    const element = await mount({ severity: 'danger', emphasis: 'light', text: 'Delete', loading: true });
    const spinner = control(element).querySelector('nph-spinner');
    expect(spinner && getComputedStyle(spinner).color).toBe(resolved('color', '--nph-color-destructive-on-surface'));
  });
});

describe('accessible name', () => {
  it('with text, the name is the text and there is no aria-label', async () => {
    const element = await mount({ text: 'Save', label: 'ignored' });
    expect(control(element).hasAttribute('aria-label')).toBe(false);
    expect(control(element).textContent?.trim()).toBe('Save');
  });

  it('icon only: aria-label comes from label and the icon is decorative', async () => {
    const element = await mount({ iconEnd: 'xmark', label: 'Close' });
    expect(control(element).getAttribute('aria-label')).toBe('Close');
    expect(control(element).querySelector('nph-icon')?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('mount and invalid input', () => {
  it('removed or undefined text becomes icon only, without breaking the render', async () => {
    const element = await mount({ text: 'Save', iconStart: 'plus', label: 'Add' });
    element.removeAttribute('text');
    element.text = null as unknown as string;
    await element.updateComplete;
    expect(control(element).querySelector('.text')).toBeNull();
    expect(control(element).getAttribute('aria-label')).toBe('Add');
    element.text = undefined as unknown as string;
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Add');
  });

  it('no text and no icon is a mount: nothing and no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({});
    expect(element.shadowRoot?.querySelector('button')).toBeNull();
    expect(element.getBoundingClientRect().width).toBe(0);
    expect(error).not.toHaveBeenCalled();
  });

  const cases: ReadonlyArray<readonly [string, Props, number]> = [
    ['severity outside the list', { severity: 'neutral' as NphButtonSeverity, text: 'Save' }, 1],
    ['emphasis outside the list', { emphasis: 'link' as NphButtonEmphasis, text: 'Save' }, 1],
    ['outline in info (B1)', { severity: 'info', emphasis: 'outline', text: 'Save' }, 1],
    ['ghost in success (B1)', { severity: 'success', emphasis: 'ghost', text: 'Save' }, 1],
    ['size outside the list', { size: 'small' as NphButtonSize, text: 'Save' }, 1],
    ['icon outside the core', { text: 'Save', iconStart: 'not-a-core-name' }, 1],
    ['icon only without label', { iconStart: 'plus' }, 1],
    ['two icons without text', { iconStart: 'plus', iconEnd: 'xmark', label: 'More' }, 1],
    ['accumulates the causes', { severity: 'neutral' as NphButtonSeverity, size: 'small' as NphButtonSize, iconStart: 'not-a-core-name', text: 'Save' }, 3],
  ];
  for (const [name, props, count] of cases) {
    it(`${name}: nothing and ${count} error(s)`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const element = await mount(props);
      expect(error).toHaveBeenCalledTimes(count);
      expect(element.shadowRoot?.querySelector('button')).toBeNull();
      expect(element.getBoundingClientRect().width).toBe(0);
    });
  }
});

describe('what the button does not have', () => {
  it('has no slot or part', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('slot, [part]')).toBeNull();
  });
});

describe('token contract', () => {
  it('every consumed token exists in the generated CSS', () => {
    const consumed = new Set(componentCss.match(/--nph-[a-z0-9-]+/g) ?? []);
    for (const token of consumed) {
      expect(tokensCss, token).toContain(`${token}:`);
    }
  });

  it('there is no literal color or measurement value in the component CSS', () => {
    const rules = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(rules).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\d+px|rgba?\(/);
  });
});
