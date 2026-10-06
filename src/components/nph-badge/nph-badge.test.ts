/**
 * Tests of `nph-badge` (P68), in a real browser (P21, item 5): the resolved
 * color, the height and the font only exist where there is layout.
 *
 * Color schemes are switched at the root (`data-nph-color-scheme` on `html`).
 * In a part of the screen with another brand and another scheme, `status/on-solid`
 * resolves the local value (P67).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-badge.css?raw';
import { NPH_BADGE_EMPHASES, NPH_BADGE_SEVERITIES, NphBadge } from './nph-badge';
import type { NphBadgeEmphasis, NphBadgeSeverity } from './nph-badge';

/** Background and text pairs of set `878:30`, read from Figma. */
const PAIRS: Readonly<Record<NphBadgeEmphasis, Readonly<Record<NphBadgeSeverity, readonly [string, string]>>>> = {
  solid: {
    primary: ['--nph-color-primary', '--nph-color-primary-foreground'],
    secondary: ['--nph-color-secondary', '--nph-color-secondary-foreground'],
    info: ['--nph-status-info', '--nph-status-on-solid'],
    warn: ['--nph-status-warning', '--nph-status-on-solid'],
    help: ['--nph-status-help', '--nph-status-on-solid'],
    danger: ['--nph-color-destructive', '--nph-color-destructive-foreground'],
    success: ['--nph-status-success', '--nph-status-on-solid'],
  },
  light: {
    primary: ['--nph-color-primary-surface', '--nph-color-primary-on-surface'],
    secondary: ['--nph-color-secondary-light', '--nph-color-secondary-foreground'],
    info: ['--nph-status-info-surface', '--nph-status-info-foreground'],
    warn: ['--nph-status-warning-surface', '--nph-status-warning-foreground'],
    help: ['--nph-status-help-surface', '--nph-status-help-foreground'],
    danger: ['--nph-color-destructive-surface', '--nph-color-destructive-on-surface'],
    success: ['--nph-status-success-surface', '--nph-status-success-foreground'],
  },
};

beforeAll(async () => {
  await document.fonts.load('500 12px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

async function mount(props: Partial<Pick<NphBadge, 'severity' | 'emphasis' | 'text' | 'icon'>> = { text: 'Label' }): Promise<NphBadge> {
  const element = document.createElement('nph-badge');
  Object.assign(element, props);
  document.body.append(element);
  await element.updateComplete;
  return element;
}

/** The value the browser gives a token, in the same property. */
function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** A brand that is not the default one, read from the generated CSS. */
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

describe('registration and API', () => {
  it('defines nph-badge only once', () => {
    expect(customElements.get('nph-badge')).toBe(NphBadge);
  });

  it('the public API is exactly severity, emphasis, text and icon', () => {
    const declared = [...(NphBadge as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['severity', 'emphasis', 'text', 'icon']);
  });

  it('the defaults are primary and solid, as in set 878:30', async () => {
    const element = await mount();
    expect(element.severity).toBe('primary');
    expect(element.emphasis).toBe('solid');
    expect(element.getAttribute('severity')).toBe('primary');
    expect(element.getAttribute('emphasis')).toBe('solid');
  });

  it('the values are those of Figma, nothing more', () => {
    expect([...NPH_BADGE_SEVERITIES]).toEqual(['primary', 'secondary', 'info', 'warn', 'help', 'danger', 'success']);
    expect([...NPH_BADGE_EMPHASES]).toEqual(['solid', 'light']);
  });
});

describe('colors by severity and emphasis, in both schemes', () => {
  it('in a part of the screen with another brand and another scheme, the solid text is the local one (P67)', async () => {
    const part = scope();
    const element = document.createElement('nph-badge');
    Object.assign(element, { severity: 'info', text: 'Label' });
    part.append(element);
    await element.updateComplete;
    const onSolid = resolvedIn(part, 'color', '--nph-status-on-solid');
    expect(onSolid).not.toBe(resolved('color', '--nph-status-on-solid'));
    expect(getComputedStyle(element).color).toBe(onSolid);
  });

  for (const scheme of ['light', 'dark'] as const) {
    for (const emphasis of NPH_BADGE_EMPHASES) {
      for (const severity of NPH_BADGE_SEVERITIES) {
        it(`${scheme} · ${severity} ${emphasis}: background and text on the tokens`, async () => {
          document.documentElement.setAttribute('data-nph-color-scheme', scheme);
          const element = await mount({ severity, emphasis, text: 'Label', icon: 'circle-info' });
          const [bg, fg] = PAIRS[emphasis][severity];
          const style = getComputedStyle(element);
          expect(style.backgroundColor).toBe(resolved('background-color', bg));
          expect(style.color).toBe(resolved('color', fg));
          const icon = element.shadowRoot?.querySelector('nph-icon');
          expect(icon && getComputedStyle(icon).color).toBe(resolved('color', fg));
        });
      }
    }
  }
});

describe('anatomy', () => {
  it('measures 24 in height, with padding, gap and radius from the tokens', async () => {
    const element = await mount({ text: 'Label', icon: 'circle-info' });
    const style = getComputedStyle(element);
    expect(element.getBoundingClientRect().height).toBe(24);
    expect(style.paddingTop).toBe(resolved('padding-top', '--nph-space-inline-tight'));
    expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline-tight'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-sm-font-weight'));
  });

  it('the icon comes before the text, at sm', async () => {
    const element = await mount({ text: 'Label', icon: 'circle-info' });
    const children = [...(element.shadowRoot?.children ?? [])].filter((node) => node.tagName !== 'STYLE');
    expect(children.map((node) => node.tagName.toLowerCase())).toEqual(['nph-icon', 'span']);
    expect(children[0]?.getAttribute('size')).toBe('sm');
  });

  it('the text stays on a single line', async () => {
    const element = await mount({ text: 'Under review' });
    expect(getComputedStyle(element).whiteSpace).toBe('nowrap');
  });
});

describe('what the badge does not have', () => {
  it('does not receive focus and has no role', async () => {
    const element = await mount();
    element.focus();
    expect(document.activeElement).not.toBe(element);
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
    expect(element.hasAttribute('role')).toBe(false);
    expect(element.shadowRoot?.querySelector('button, a, [tabindex]')).toBeNull();
  });

  it('has no slot', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('slot')).toBeNull();
  });

  it('the CSS changes nothing on hover or focus', () => {
    expect(componentCss).not.toMatch(/:hover|:focus|:active/);
  });

  it('the text is the accessible name; the icon is decorative', async () => {
    const element = await mount({ text: 'Approved', icon: 'circle-check' });
    expect(element.shadowRoot?.querySelector('.text')?.textContent).toBe('Approved');
    expect(element.shadowRoot?.querySelector('nph-icon')?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('mounting and invalid input', () => {
  it('null or undefined text does not break: there is no badge', async () => {
    const element = await mount({ text: 'Label' });
    element.text = null as unknown as string;
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.text')).toBeNull();
    element.text = undefined as unknown as string;
    await element.updateComplete;
    expect(element.getBoundingClientRect().width).toBe(0);
  });

  it('without text there is no badge: 0 x 0 and no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ text: '   ' });
    const box = element.getBoundingClientRect();
    expect([box.width, box.height]).toEqual([0, 0]);
    expect(error).not.toHaveBeenCalled();
  });

  it('emits one error per cause and draws nothing', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({
      severity: 'neutral' as NphBadgeSeverity,
      emphasis: 'outline' as NphBadgeEmphasis,
      icon: 'not-a-core-name',
      text: 'Label',
    });
    expect(error).toHaveBeenCalledTimes(3);
    expect(element.shadowRoot?.querySelector('.text')).toBeNull();
    expect(element.getBoundingClientRect().width).toBe(0);
  });
});

describe('token contract', () => {
  it('every consumed token exists in the generated CSS', () => {
    const consumed = new Set(componentCss.match(/--nph-[a-z0-9-]+/g) ?? []);
    for (const token of consumed) {
      expect(tokensCss, token).toContain(`${token}:`);
    }
  });

  it('there is no literal color or measure value in the component CSS', () => {
    const rules = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(rules).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\d+px|rgba?\(/);
  });
});
