/**
 * Tests of `nph-togglebutton` (P73), in a real browser (P21, item 5): resolved
 * color, real hover, keyboard focus, transitions and measures only exist where
 * there is layout.
 *
 * They prove the contract accepted in Figma (frame `1512:27498`, set `1512:719`):
 * the API, the off and on colors at rest and on hover in both schemes, the box
 * measures, the focus pair, the toggle and its event, disabled, invalid, the icon
 * swap, the accessible name, the invalid input, the motion and the token contract.
 *
 * Color schemes are switched at the root (`data-nph-color-scheme` on `html`). In a
 * part of the screen with another brand and another scheme, `color/primary-border`,
 * `elevation/subtle` and `focus/halo` resolve the local value, so the brand and the
 * scheme go on the same element (P67).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-togglebutton.css?raw';
import {
  NPH_TOGGLEBUTTON_AUTO_ICONS,
  NPH_TOGGLEBUTTON_CHANGE_EVENT,
  NPH_TOGGLEBUTTON_ICON_KEYWORDS,
  NphTogglebutton,
} from './nph-togglebutton';
import type { NphTogglebuttonChangeDetail } from './nph-togglebutton';

type Props = Partial<Pick<NphTogglebutton, 'pressed' | 'invalid' | 'disabled' | 'text' | 'label' | 'iconStart' | 'iconEnd'>>;

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

async function mount(props: Props = { text: 'Bold' }, parent: HTMLElement = document.body): Promise<NphTogglebutton> {
  const element = document.createElement('nph-togglebutton');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

function control(element: NphTogglebutton): HTMLButtonElement {
  const button = element.shadowRoot?.querySelector<HTMLButtonElement>('button');
  if (!button) throw new Error('no inner <button>');
  return button;
}

function surface(element: NphTogglebutton): HTMLElement {
  const area = element.shadowRoot?.querySelector<HTMLElement>('.surface');
  if (!area) throw new Error('no inner area');
  return area;
}

/** The `nph-icon` elements drawn inside the piece, in order. */
function icons(element: NphTogglebutton): HTMLElement[] {
  return [...(element.shadowRoot?.querySelectorAll<HTMLElement>('nph-icon') ?? [])];
}

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
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

/** The shadow layers of a computed `box-shadow`, one string each. */
function shadowLayers(value: string): string[] {
  return value === 'none' ? [] : value.split(/,\s(?=rgba?\()/);
}

/** The color of the `inset` layer (the outline stroke), or `none`. */
function insetColor(element: HTMLElement): string {
  const layer = shadowLayers(getComputedStyle(element).boxShadow).find((part) => part.includes('inset'));
  return layer?.match(/rgba?\([^)]*\)/)?.[0] ?? 'none';
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

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/** The items of a computed comma list; commas inside `cubic-bezier(...)` do not split. */
function listOf(value: string): string[] {
  return value.split(/,\s(?![^(]*\))/);
}

describe('registration and API', () => {
  it('defines nph-togglebutton only once', () => {
    expect(customElements.get('nph-togglebutton')).toBe(NphTogglebutton);
  });

  it('the public API is exactly the one in P73', () => {
    const declared = [...(NphTogglebutton as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['pressed', 'invalid', 'disabled', 'text', 'label', 'iconStart', 'iconEnd']);
  });

  it('the defaults are off, valid and enabled, with the automatic icons', async () => {
    const element = await mount();
    expect([element.pressed, element.invalid, element.disabled]).toEqual([false, false, false]);
    expect([element.text, element.label]).toEqual(['Bold', '']);
    expect([element.iconStart, element.iconEnd]).toEqual(['auto', 'auto']);
    expect(getComputedStyle(control(element)).height).toBe(resolved('height', '--nph-control-height-default'));
  });

  it('the three booleans reflect to attributes, so the internal CSS can read them', async () => {
    const element = await mount({ text: 'Bold', pressed: true, invalid: true, disabled: true });
    expect(['pressed', 'invalid', 'disabled'].map((name) => element.hasAttribute(name))).toEqual([true, true, true]);
    element.pressed = false;
    await element.updateComplete;
    expect(element.hasAttribute('pressed')).toBe(false);
  });

  it('the attributes are pressed, invalid, disabled, text, label, icon-start and icon-end', async () => {
    const element = document.createElement('nph-togglebutton');
    element.setAttribute('pressed', '');
    element.setAttribute('invalid', '');
    element.setAttribute('disabled', '');
    element.setAttribute('text', 'Bold');
    element.setAttribute('label', 'Bold text');
    element.setAttribute('icon-start', 'plus');
    element.setAttribute('icon-end', 'none');
    document.body.append(element);
    await element.updateComplete;
    expect([element.pressed, element.invalid, element.disabled]).toEqual([true, true, true]);
    expect([element.text, element.label, element.iconStart, element.iconEnd]).toEqual(['Bold', 'Bold text', 'plus', 'none']);
  });

  it('the event name and the icon keywords are the contract ones', () => {
    expect(NPH_TOGGLEBUTTON_CHANGE_EVENT).toBe('nph-change');
    expect([...NPH_TOGGLEBUTTON_ICON_KEYWORDS]).toEqual(['auto', 'none']);
    expect([...NPH_TOGGLEBUTTON_AUTO_ICONS]).toEqual(['xmark', 'check']);
  });

  it('has the open shadow root with delegated focus', async () => {
    const element = await mount();
    expect(element.shadowRoot?.mode).toBe('open');
    expect(element.shadowRoot?.delegatesFocus).toBe(true);
  });
});

describe('colors, off and on, at rest and on hover, in both schemes', () => {
  for (const scheme of ['light', 'dark'] as const) {
    for (const pressed of [false, true]) {
      const state = pressed ? 'on' : 'off';

      it(`${scheme} · ${state}: track, inner area, label and icons at rest`, async () => {
        document.documentElement.setAttribute('data-nph-color-scheme', scheme);
        const element = await mount({ text: 'Bold', pressed });
        const track = getComputedStyle(control(element));
        const labelToken = pressed ? '--nph-color-foreground' : '--nph-color-muted-foreground';

        expect(track.backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
        expect(track.borderTopColor).toBe(resolved('color', '--nph-color-muted'));
        expect(track.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
        expect(track.color).toBe(resolved('color', labelToken));
        expect(getComputedStyle(element.shadowRoot?.querySelector('.text') as HTMLElement).color).toBe(resolved('color', labelToken));
        for (const icon of icons(element)) {
          expect(getComputedStyle(icon).color).toBe(resolved('color', labelToken));
        }

        const area = getComputedStyle(surface(element));
        if (pressed) {
          expect(area.backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
          expect(shadowLayers(area.boxShadow)[0]).toBe(shadowLayers(resolved('box-shadow', '--nph-elevation-subtle'))[0]);
          expect(insetColor(surface(element))).toBe(resolved('color', '--nph-color-primary-border'));
          const ring = shadowLayers(area.boxShadow).find((layer) => layer.includes('inset')) ?? '';
          expect(ring).toMatch(new RegExp(`inset$|inset `));
          expect(ring).toContain(` ${resolved('width', '--nph-border-width')}`);
        } else {
          expect(area.backgroundColor).toBe(TRANSPARENT);
          expect(area.boxShadow).toBe('none');
        }
      });

      it(`${scheme} · ${state}: on hover, the label and icons are foreground`, async () => {
        document.documentElement.setAttribute('data-nph-color-scheme', scheme);
        const element = await mount({ text: 'Bold', pressed });
        await userEvent.hover(control(element));
        const foreground = resolved('color', '--nph-color-foreground');
        await vi.waitFor(() => expect(getComputedStyle(control(element)).color).toBe(foreground));
        for (const icon of icons(element)) {
          expect(getComputedStyle(icon).color).toBe(foreground);
        }
        /* Hover changes only the label and icon color: the track and the inner area stay. */
        expect(getComputedStyle(control(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
        expect(getComputedStyle(surface(element)).backgroundColor).toBe(
          pressed ? resolved('background-color', '--nph-color-background') : TRANSPARENT,
        );
      });
    }
  }

  it('off, the inner area and the track have the same look: the inner area shows the track', async () => {
    const element = await mount({ text: 'Bold' });
    expect(getComputedStyle(surface(element)).backgroundColor).toBe(TRANSPARENT);
    expect(getComputedStyle(control(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
  });

  it('after the hover leaves, the off label goes back to color/muted-foreground', async () => {
    const element = await mount({ text: 'Bold' });
    await userEvent.hover(control(element));
    await vi.waitFor(() => expect(getComputedStyle(control(element)).color).toBe(resolved('color', '--nph-color-foreground')));
    await userEvent.unhover(control(element));
    await vi.waitFor(() => expect(getComputedStyle(control(element)).color).toBe(resolved('color', '--nph-color-muted-foreground')));
  });

  it('with a brand other than the default and the dark scheme on the same element, the on piece takes the local tokens (P67)', async () => {
    const part = scope();
    const element = await mount({ text: 'Bold', pressed: true }, part);
    const local = resolved('color', '--nph-color-primary-border', part);
    expect(local).not.toBe(resolved('color', '--nph-color-primary-border'));
    expect(insetColor(surface(element))).toBe(local);
    expect(getComputedStyle(surface(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-background', part));
    expect(shadowLayers(getComputedStyle(surface(element)).boxShadow)[0]).toBe(shadowLayers(resolved('box-shadow', '--nph-elevation-subtle', part))[0]);
    expect(getComputedStyle(control(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-muted', part));
  });

  it('toggling on, the colors change to the on ones', async () => {
    const element = await mount({ text: 'Bold' });
    element.pressed = true;
    await element.updateComplete;
    await vi.waitFor(() => {
      expect(getComputedStyle(surface(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
      expect(getComputedStyle(control(element)).color).toBe(resolved('color', '--nph-color-foreground'));
      expect(insetColor(surface(element))).toBe(resolved('color', '--nph-color-primary-border'));
    });
  });
});

describe('measures and anatomy', () => {
  it('the track: height, radius, border and padding on the four sides come from tokens', async () => {
    const element = await mount({ text: 'Bold' });
    const style = getComputedStyle(control(element));
    expect(style.boxSizing).toBe('border-box');
    expect(style.height).toBe(resolved('height', '--nph-control-height-default'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-control'));
    expect(style.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
    expect(style.borderTopStyle).toBe('solid');
    for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
      expect(style.getPropertyValue(`padding-${side.toLowerCase()}`), side).toBe(resolved('padding-left', '--nph-space-inline-tight'));
    }
  });

  it('the inner area: radius, side padding, no vertical padding and the gap between icon and label', async () => {
    const element = await mount({ text: 'Bold', iconStart: 'plus', iconEnd: 'check' });
    const style = getComputedStyle(surface(element));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-inner'));
    expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(style.paddingRight).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(style.paddingTop).toBe('0px');
    expect(style.paddingBottom).toBe('0px');
    expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline-tight'));
    /* The inner area fills what is left inside the border and the padding of the track. */
    const track = control(element).getBoundingClientRect();
    const inner = surface(element).getBoundingClientRect();
    const border = Number.parseFloat(resolved('width', '--nph-border-width'));
    const gap = Number.parseFloat(resolved('padding-left', '--nph-space-inline-tight'));
    expect(inner.height).toBeCloseTo(track.height - 2 * (border + gap), 2);
    expect(inner.top - track.top).toBeCloseTo(border + gap, 2);
  });

  it('the label uses the five properties of text/label-md and stays on one line', async () => {
    const element = await mount({ text: 'Bold' });
    const style = getComputedStyle(control(element));
    expect(style.fontFamily).toBe(resolved('font-family', '--nph-text-label-md-font-family'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-text-label-md-line-height'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(style.letterSpacing).toBe(resolved('letter-spacing', '--nph-text-label-md-letter-spacing'));
    expect(style.whiteSpace).toBe('nowrap');
  });

  it('the icons are nph-icon in icon/size-sm, light, with no label', async () => {
    const element = await mount({ text: 'Bold' });
    const drawn = icons(element);
    expect(drawn.length).toBe(4);
    for (const icon of drawn) {
      expect(icon.getAttribute('size')).toBe('sm');
      expect(icon.hasAttribute('variant')).toBe(false);
      expect(icon.hasAttribute('label')).toBe(false);
      const box = icon.getBoundingClientRect();
      const side = Number.parseFloat(resolved('width', '--nph-icon-size-sm'));
      expect([box.width, box.height]).toEqual([side, side]);
    }
  });

  it('with text, the order is start icon, label, end icon', async () => {
    const element = await mount({ text: 'Bold', iconStart: 'plus', iconEnd: 'check' });
    expect([...surface(element).children].map((node) => node.tagName.toLowerCase())).toEqual(['nph-icon', 'span', 'nph-icon']);
  });

  it('icon only is 50 x 36 and not square, hugging its content', async () => {
    const element = await mount({ iconStart: 'plus', label: 'Add' });
    const box = control(element).getBoundingClientRect();
    const px = (token: string, property = 'width') => Number.parseFloat(resolved(property, token));
    const expected =
      2 * px('--nph-border-width') + 2 * px('--nph-space-inline-tight') + 2 * px('--nph-space-control-padding') + px('--nph-icon-size-sm');
    expect(box.width).toBeCloseTo(expected, 2);
    expect(box.height).toBe(px('--nph-control-height-default', 'height'));
    /* The measures read from the accepted set: 50 x 36. */
    expect([box.width, box.height]).toEqual([50, 36]);
    expect(box.width).not.toBe(box.height);
    expect(element.getBoundingClientRect().width).toBe(box.width);
  });

  it('with text, the width follows the content: a longer text makes a wider piece, at the same height', async () => {
    const short = await mount({ text: 'B' });
    const long = await mount({ text: 'Bold and italic' });
    expect(long.getBoundingClientRect().width).toBeGreaterThan(short.getBoundingClientRect().width);
    expect(long.getBoundingClientRect().height).toBe(short.getBoundingClientRect().height);
  });

  it('the host is an inline box that takes no space without a valid input', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const valid = await mount({ text: 'Bold' });
    expect(getComputedStyle(valid).display).toBe('inline-flex');
    const invalid = await mount({});
    expect(getComputedStyle(invalid).display).toBe('none');
  });
});

describe('focus', () => {
  async function focused(props: Props): Promise<NphTogglebutton> {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount(props);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement).toBe(control(element));
    return element;
  }

  it('Tab shows the primary border and the halo just outside the track', async () => {
    const element = await focused({ text: 'Bold' });
    const button = control(element);
    const border = getComputedStyle(button, '::before');
    const halo = getComputedStyle(button, '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-color-primary'));
    expect(border.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(halo.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
    /* Just outside the track, without changing its size: 1 px of border and 4 px of halo. */
    const box = button.getBoundingClientRect();
    const borderWidth = Number.parseFloat(resolved('width', '--nph-border-width'));
    const ringWidth = Number.parseFloat(resolved('width', '--nph-focus-ring-width'));
    expect(Number.parseFloat(border.width)).toBeCloseTo(box.width + 2 * borderWidth, 2);
    expect(Number.parseFloat(border.height)).toBeCloseTo(box.height + 2 * borderWidth, 2);
    expect(Number.parseFloat(halo.width)).toBeCloseTo(box.width + 2 * (borderWidth + ringWidth), 2);
    expect(Number.parseFloat(halo.height)).toBeCloseTo(box.height + 2 * (borderWidth + ringWidth), 2);
    /* The focus ring does not change the size of the piece. */
    const twin = await mount({ text: 'Bold' });
    expect([box.width, box.height]).toEqual([control(twin).getBoundingClientRect().width, control(twin).getBoundingClientRect().height]);
  });

  it('on the on piece, the focus is the same pair', async () => {
    const element = await focused({ text: 'Bold', pressed: true });
    expect(getComputedStyle(control(element), '::before').borderTopColor).toBe(resolved('color', '--nph-color-primary'));
    expect(getComputedStyle(control(element), '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
  });

  it('invalid: the border is status/error and the halo is focus/halo-error', async () => {
    const element = await focused({ text: 'Bold', invalid: true });
    const button = control(element);
    expect(getComputedStyle(button, '::before').borderTopColor).toBe(resolved('color', '--nph-status-error'));
    expect(getComputedStyle(button, '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
    expect(getComputedStyle(button, '::before').borderTopWidth).toBe(resolved('width', '--nph-border-width'));
    expect(getComputedStyle(button, '::after').borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
  });

  it('icon only has the same focus pair, around the 50 x 36 track', async () => {
    const element = await focused({ iconStart: 'plus', label: 'Add' });
    const box = control(element).getBoundingClientRect();
    const borderWidth = Number.parseFloat(resolved('width', '--nph-border-width'));
    expect(Number.parseFloat(getComputedStyle(control(element), '::before').width)).toBeCloseTo(box.width + 2 * borderWidth, 2);
  });

  it('with another brand and another scheme on the same element, the halo is the local one (P67)', async () => {
    const part = scope();
    const before = document.createElement('input');
    part.append(before);
    const element = await mount({ text: 'Bold' }, part);
    const halo = resolved('color', '--nph-focus-halo', part);
    expect(halo).not.toBe(resolved('color', '--nph-focus-halo'));
    before.focus();
    await userEvent.tab();
    expect(getComputedStyle(control(element), '::after').borderTopColor).toBe(halo);
    expect(getComputedStyle(control(element), '::before').borderTopColor).toBe(resolved('color', '--nph-color-primary', part));
  });

  it('a mouse click draws no focus ring', async () => {
    const element = await mount({ text: 'Bold' });
    await userEvent.click(control(element));
    expect(getComputedStyle(control(element), '::before').content).toBe('none');
    expect(getComputedStyle(control(element), '::after').content).toBe('none');
  });

  it('host focus goes to the native button', async () => {
    const element = await mount({ text: 'Bold' });
    element.focus();
    expect(element.shadowRoot?.activeElement).toBe(control(element));
  });
});

describe('toggle and event', () => {
  function listen(element: NphTogglebutton): { events: CustomEvent<NphTogglebuttonChangeDetail>[]; clicks: ReturnType<typeof vi.fn> } {
    const events: CustomEvent<NphTogglebuttonChangeDetail>[] = [];
    element.addEventListener('nph-change', (event) => events.push(event));
    const clicks = vi.fn();
    element.addEventListener('click', clicks);
    return { events, clicks };
  }

  it('a mouse click toggles pressed and fires exactly one nph-change with the new state', async () => {
    const element = await mount({ text: 'Bold' });
    const { events } = listen(element);
    await userEvent.click(control(element));
    expect(element.pressed).toBe(true);
    expect(events.length).toBe(1);
    expect(events[0]?.detail).toEqual({ pressed: true });
    await userEvent.click(control(element));
    expect(element.pressed).toBe(false);
    expect(events.map((event) => event.detail.pressed)).toEqual([true, false]);
  });

  it('Enter and Space toggle too, one event each', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ text: 'Bold' });
    const { events } = listen(element);
    before.focus();
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect([element.pressed, events.length]).toEqual([true, 1]);
    await userEvent.keyboard(' ');
    expect([element.pressed, events.length]).toEqual([false, 2]);
    expect(events.map((event) => event.detail.pressed)).toEqual([true, false]);
  });

  it('the event bubbles, crosses the shadow root and is not cancelable', async () => {
    const element = await mount({ text: 'Bold' });
    const { events } = listen(element);
    const seen: Event[] = [];
    document.addEventListener('nph-change', (event) => seen.push(event), { once: true });
    await userEvent.click(control(element));
    expect(events[0]?.bubbles).toBe(true);
    expect(events[0]?.composed).toBe(true);
    expect(events[0]?.cancelable).toBe(false);
    expect(seen.length).toBe(1);
    expect(seen[0]?.target).toBe(element);
  });

  it('the native click still reaches the consumer, once per click', async () => {
    const element = await mount({ text: 'Bold' });
    const { clicks } = listen(element);
    await userEvent.click(control(element));
    expect(clicks).toHaveBeenCalledTimes(1);
  });

  it('a click called on the host toggles too, as the click of a native control would', async () => {
    const element = await mount({ text: 'Bold' });
    const { events } = listen(element);
    element.click();
    expect([element.pressed, events.length]).toEqual([true, 1]);
  });

  it('setting pressed from code, by property or attribute, never fires the event', async () => {
    const element = await mount({ text: 'Bold' });
    const { events } = listen(element);
    element.pressed = true;
    await element.updateComplete;
    element.setAttribute('pressed', '');
    element.removeAttribute('pressed');
    await element.updateComplete;
    element.toggleAttribute('pressed', true);
    await element.updateComplete;
    element.pressed = false;
    await element.updateComplete;
    expect(events.length).toBe(0);
    expect(element.pressed).toBe(false);
  });

  it('a piece that starts with pressed set fires nothing at mount', async () => {
    const events = vi.fn();
    document.addEventListener('nph-change', events);
    await mount({ text: 'Bold', pressed: true });
    document.removeEventListener('nph-change', events);
    expect(events).not.toHaveBeenCalled();
  });

  it('aria-pressed on the inner button follows the state, from the click and from code', async () => {
    const element = await mount({ text: 'Bold' });
    expect(control(element).getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(control(element));
    await element.updateComplete;
    expect(control(element).getAttribute('aria-pressed')).toBe('true');
    element.pressed = false;
    await element.updateComplete;
    expect(control(element).getAttribute('aria-pressed')).toBe('false');
  });

  it('the inner button is type=button, has no switch or checkbox role and does not submit a form', async () => {
    const form = document.createElement('form');
    const submit = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submit);
    document.body.append(form);
    const element = await mount({ text: 'Bold' }, form);
    expect(control(element).type).toBe('button');
    expect(control(element).hasAttribute('role')).toBe(false);
    expect(control(element).hasAttribute('aria-checked')).toBe(false);
    await userEvent.click(control(element));
    expect(submit).not.toHaveBeenCalled();
  });

  it('the piece is not associated with a form: it adds nothing to the form data', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount({ text: 'Bold', pressed: true }, form);
    expect([...new FormData(form).keys()]).toEqual([]);
    expect(form.elements.length).toBe(0);
    expect((element as unknown as { form?: unknown }).form).toBeUndefined();
  });
});

describe('disabled', () => {
  it('leaves the Tab order, does not toggle, fires nothing and stays at state/disabled-opacity', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ text: 'Bold', disabled: true });
    const clicks = vi.fn();
    const changes = vi.fn();
    element.addEventListener('click', clicks);
    element.addEventListener('nph-change', changes);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
    element.click();
    control(element).click();
    expect(clicks).not.toHaveBeenCalled();
    expect(changes).not.toHaveBeenCalled();
    expect(element.pressed).toBe(false);
    expect(control(element).disabled).toBe(true);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('an enabled piece is at full opacity', async () => {
    const element = await mount({ text: 'Bold' });
    expect(getComputedStyle(element).opacity).toBe('1');
  });

  it('on hover, the resting colors stay', async () => {
    const element = await mount({ text: 'Bold', disabled: true });
    const rest = getComputedStyle(control(element)).color;
    await userEvent.hover(element, { force: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(getComputedStyle(control(element)).color).toBe(rest);
    expect(rest).toBe(resolved('color', '--nph-color-muted-foreground'));
  });

  it('the on and disabled piece keeps the on look and the lower opacity', async () => {
    const element = await mount({ text: 'Bold', pressed: true, disabled: true });
    expect(getComputedStyle(surface(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    await userEvent.click(control(element), { force: true }).catch(() => {});
    expect(element.pressed).toBe(true);
  });

  it('enabling it again brings back the toggle', async () => {
    const element = await mount({ text: 'Bold', disabled: true });
    element.disabled = false;
    await element.updateComplete;
    await userEvent.click(control(element));
    expect(element.pressed).toBe(true);
  });
});

describe('invalid', () => {
  it('the border of the track is status/error; valid, it is color/muted', async () => {
    const valid = await mount({ text: 'Bold' });
    expect(getComputedStyle(control(valid)).borderTopColor).toBe(resolved('color', '--nph-color-muted'));
    const invalid = await mount({ text: 'Bold', invalid: true });
    expect(getComputedStyle(control(invalid)).borderTopColor).toBe(resolved('color', '--nph-status-error'));
    expect(getComputedStyle(control(invalid)).borderTopWidth).toBe(resolved('width', '--nph-border-width'));
  });

  it('invalid does not change the size, the colors of the label or the inner area', async () => {
    const valid = await mount({ text: 'Bold', pressed: true });
    const invalid = await mount({ text: 'Bold', pressed: true, invalid: true });
    expect(control(invalid).getBoundingClientRect().width).toBe(control(valid).getBoundingClientRect().width);
    expect(getComputedStyle(control(invalid)).color).toBe(getComputedStyle(control(valid)).color);
    expect(getComputedStyle(surface(invalid)).backgroundColor).toBe(getComputedStyle(surface(valid)).backgroundColor);
    expect(insetColor(surface(invalid))).toBe(insetColor(surface(valid)));
  });

  it('the error border shows in both schemes', async () => {
    for (const scheme of ['light', 'dark'] as const) {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount({ text: 'Bold', invalid: true });
      expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-status-error'));
      element.remove();
    }
  });

  it('disabled wins over invalid: the error border is suppressed and there is no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ text: 'Bold', invalid: true, disabled: true });
    expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-color-muted'));
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(error).not.toHaveBeenCalled();
    element.disabled = false;
    await element.updateComplete;
    await vi.waitFor(() => expect(getComputedStyle(control(element)).borderTopColor).toBe(resolved('color', '--nph-status-error')));
  });

  it('invalid does not add aria-invalid: the error message stays outside the piece', async () => {
    const element = await mount({ text: 'Bold', invalid: true });
    expect(control(element).hasAttribute('aria-invalid')).toBe(false);
    expect(element.hasAttribute('aria-invalid')).toBe(false);
  });
});

describe('icons', () => {
  it('auto draws the xmark and check pair, both rendered, both aria-hidden', async () => {
    const element = await mount({ text: 'Bold' });
    const drawn = icons(element);
    expect(drawn.map((icon) => icon.getAttribute('name'))).toEqual(['xmark', 'check', 'xmark', 'check']);
    for (const icon of drawn) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.hasAttribute('role')).toBe(false);
    }
    expect([...surface(element).children].map((node) => node.className)).toEqual(['glyphs', 'text', 'glyphs']);
  });

  it('off shows xmark, on shows check; the other one stays rendered at opacity 0', async () => {
    const element = await mount({ text: 'Bold' });
    const [off, on] = [...(element.shadowRoot?.querySelectorAll<HTMLElement>('.glyphs:first-child nph-icon') ?? [])];
    expect([off?.getAttribute('name'), on?.getAttribute('name')]).toEqual(['xmark', 'check']);
    expect([getComputedStyle(off as HTMLElement).opacity, getComputedStyle(on as HTMLElement).opacity]).toEqual(['1', '0']);
    element.pressed = true;
    await element.updateComplete;
    await vi.waitFor(() =>
      expect([getComputedStyle(off as HTMLElement).opacity, getComputedStyle(on as HTMLElement).opacity]).toEqual(['0', '1']),
    );
  });

  it('the pair is stacked in one cell: the piece has the width of a single icon', async () => {
    const element = await mount({ iconStart: 'auto', label: 'Mark' });
    const wrapper = element.shadowRoot?.querySelector('.glyphs') as HTMLElement;
    const side = Number.parseFloat(resolved('width', '--nph-icon-size-sm'));
    expect(wrapper.getBoundingClientRect().width).toBe(side);
    const [first, second] = icons(element).map((icon) => icon.getBoundingClientRect());
    expect([first?.left, first?.top]).toEqual([second?.left, second?.top]);
  });

  it('the swap is a cross-fade on opacity, with the state duration and easing as a pair', async () => {
    const element = await mount({ text: 'Bold' });
    for (const icon of icons(element)) {
      const style = getComputedStyle(icon);
      expect(style.transitionProperty).toBe('opacity');
      expect(style.transitionDuration).toBe(resolved('transition-duration', '--nph-motion-state-duration'));
      expect(style.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-state-easing'));
    }
  });

  it('the icons are visible only through opacity: no swap by removing nodes', async () => {
    const element = await mount({ text: 'Bold' });
    const before = icons(element);
    element.pressed = true;
    await element.updateComplete;
    expect(icons(element)).toEqual(before);
  });

  it('none draws no icon on that side', async () => {
    const element = await mount({ text: 'Bold', iconStart: 'none' });
    expect([...surface(element).children].map((node) => node.className)).toEqual(['text', 'glyphs']);
    element.iconEnd = 'none';
    await element.updateComplete;
    expect([...surface(element).children].map((node) => node.className)).toEqual(['text']);
    expect(icons(element).length).toBe(0);
  });

  it('a core name draws that one icon on that side, with no swap', async () => {
    const element = await mount({ text: 'Bold', iconStart: 'plus', iconEnd: 'chevron-down', pressed: true });
    expect(icons(element).map((icon) => icon.getAttribute('name'))).toEqual(['plus', 'chevron-down']);
    expect(element.shadowRoot?.querySelector('.glyphs')).toBeNull();
    for (const icon of icons(element)) {
      expect(getComputedStyle(icon).opacity).toBe('1');
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    }
    element.pressed = false;
    await element.updateComplete;
    expect(icons(element).map((icon) => icon.getAttribute('name'))).toEqual(['plus', 'chevron-down']);
  });

  it('start and end are independent: one fixed, one swapping', async () => {
    const element = await mount({ text: 'Bold', iconStart: 'plus' });
    expect([...surface(element).children].map((node) => node.className)).toEqual(['glyph-fixed', 'text', 'glyphs']);
  });

  it('icon only draws a single icon: the swapping pair from icon-start, or one fixed icon', async () => {
    const swap = await mount({ label: 'Mark' });
    expect(icons(swap).map((icon) => icon.getAttribute('name'))).toEqual(['xmark', 'check']);
    expect(swap.shadowRoot?.querySelector('.text')).toBeNull();
    const fixed = await mount({ label: 'Add', iconStart: 'plus' });
    expect(icons(fixed).map((icon) => icon.getAttribute('name'))).toEqual(['plus']);
  });

  it('icon only ignores icon-end, whatever its value', async () => {
    for (const iconEnd of ['plus', 'none', 'auto']) {
      const element = await mount({ label: 'Add', iconStart: 'check', iconEnd });
      expect(icons(element).map((icon) => icon.getAttribute('name')), iconEnd).toEqual(['check']);
      element.remove();
    }
  });

  it('the icon color is the label color on the on and off pieces (currentColor)', async () => {
    for (const pressed of [false, true]) {
      const element = await mount({ label: 'Add', iconStart: 'plus', pressed });
      const svg = icons(element)[0]?.shadowRoot?.querySelector('svg') as SVGElement;
      expect(getComputedStyle(svg).color).toBe(getComputedStyle(control(element)).color);
      element.remove();
    }
  });
});

describe('accessible name', () => {
  it('with text, the name is the text and there is no aria-label', async () => {
    const element = await mount({ text: 'Bold', label: 'ignored' });
    expect(control(element).hasAttribute('aria-label')).toBe(false);
    expect(control(element).textContent?.replace(/\s+/g, ' ').trim()).toBe('Bold');
  });

  it('icon only: aria-label comes from label and the icons are decorative', async () => {
    const element = await mount({ label: '  Italic  ' });
    expect(control(element).getAttribute('aria-label')).toBe('Italic');
    for (const icon of icons(element)) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('a text of only spaces counts as no text: the piece is icon only', async () => {
    const element = await mount({ text: '   ', label: 'Italic' });
    expect(control(element).getAttribute('aria-label')).toBe('Italic');
    expect(element.shadowRoot?.querySelector('.text')).toBeNull();
  });

  it('the text is trimmed', async () => {
    const element = await mount({ text: '  Bold  ' });
    expect(element.shadowRoot?.querySelector('.text')?.textContent).toBe('Bold');
  });

  it('removed or undefined text and label do not break the render', async () => {
    const element = await mount({ text: 'Bold', label: 'Bold text' });
    element.text = null as unknown as string;
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Bold text');
    element.text = 'Bold';
    element.setAttribute('text', 'Bold');
    await element.updateComplete;
    element.removeAttribute('text');
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Bold text');
    element.text = undefined as unknown as string;
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Bold text');
  });

  it('the inner button is exposed as a toggle button with the name and the state', async () => {
    const element = await mount({ text: 'Bold', pressed: true });
    const button = control(element);
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.disabled).toBe(false);
    expect(button.tabIndex).toBe(0);
    expect(button.querySelector('[tabindex]')).toBeNull();
  });
});

describe('invalid input', () => {
  const cases: ReadonlyArray<readonly [string, Props, number]> = [
    ['no text and no label', {}, 1],
    ['spaces only in text and no label', { text: '   ' }, 1],
    ['icon-start outside auto, none and the core', { text: 'Bold', iconStart: 'not-a-core-name' }, 1],
    ['icon-end outside auto, none and the core', { text: 'Bold', iconEnd: 'not-a-core-name' }, 1],
    ['an empty icon value', { text: 'Bold', iconStart: '' }, 1],
    ['both icons outside the core', { text: 'Bold', iconStart: 'nope', iconEnd: 'nada' }, 2],
    ['icon only with icon-start none', { label: 'Mark', iconStart: 'none' }, 1],
    ['accumulates the causes', { iconStart: 'nope', iconEnd: 'nada' }, 3],
    ['icon-end outside the core even when icon only (it is still validated)', { label: 'Mark', iconEnd: 'nada' }, 1],
  ];
  for (const [name, props, count] of cases) {
    it(`${name}: nothing and ${count} error(s) in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const element = await mount(props);
      expect(error).toHaveBeenCalledTimes(count);
      for (const call of error.mock.calls) {
        expect(String(call[0])).toContain('[nph-togglebutton]');
      }
      expect(element.shadowRoot?.querySelector('button')).toBeNull();
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect(element.getBoundingClientRect().width).toBe(0);
      expect(element.getBoundingClientRect().height).toBe(0);
    });
  }

  const valid: ReadonlyArray<readonly [string, Props]> = [
    ['text with both icons none', { text: 'Bold', iconStart: 'none', iconEnd: 'none' }],
    ['text with fixed icons', { text: 'Bold', iconStart: 'plus', iconEnd: 'check' }],
    ['icon only with the default icons', { label: 'Mark' }],
    ['icon only with a fixed icon and icon-end none', { label: 'Add', iconStart: 'plus', iconEnd: 'none' }],
    ['text with icon-start none and a label that is not used', { text: 'Bold', label: 'Bold text', iconStart: 'none' }],
    ['invalid and disabled together', { text: 'Bold', invalid: true, disabled: true }],
  ];
  for (const [name, props] of valid) {
    it(`${name}: draws and emits no error`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const element = await mount(props);
      expect(error).not.toHaveBeenCalled();
      expect(element.shadowRoot?.querySelector('button')).not.toBeNull();
      expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    });
  }

  it('there is no visual fallback and no toggle: an invalid piece does not fire the event', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ iconStart: 'nope', text: 'Bold' });
    const changes = vi.fn();
    element.addEventListener('nph-change', changes);
    element.click();
    expect(changes).not.toHaveBeenCalled();
    expect(element.pressed).toBe(false);
  });

  it('changing the state does not repeat the errors', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ text: 'Bold', iconStart: 'nope' });
    element.pressed = true;
    element.invalid = true;
    element.disabled = true;
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a valid input set later draws the piece, and removing icon-start goes back to auto', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ text: 'Bold', iconStart: 'nope' });
    element.setAttribute('icon-start', 'plus');
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    element.removeAttribute('icon-start');
    await element.updateComplete;
    expect(element.iconStart).toBeNull();
    expect(element.shadowRoot?.querySelector('.glyphs')).not.toBeNull();
  });
});

describe('motion', () => {
  const animated = (element: NphTogglebutton): HTMLElement[] => [control(element), surface(element), ...icons(element)];

  it('every change runs on the state duration and easing, as a pair', async () => {
    const element = await mount({ text: 'Bold' });
    const duration = resolved('transition-duration', '--nph-motion-state-duration');
    const easing = resolved('transition-timing-function', '--nph-motion-state-easing');
    expect(duration).not.toBe('0s');
    for (const part of animated(element)) {
      const style = getComputedStyle(part);
      expect(listOf(style.transitionDuration).every((value) => value === duration)).toBe(true);
      expect(listOf(style.transitionTimingFunction).every((value) => value === easing)).toBe(true);
    }
  });

  it('the track animates background, border and color; the inner area its background and shadow; the icons their opacity', async () => {
    const element = await mount({ text: 'Bold' });
    expect(getComputedStyle(control(element)).transitionProperty).toBe('background-color, border-color, color, box-shadow');
    expect(getComputedStyle(surface(element)).transitionProperty).toBe('background-color, box-shadow');
    for (const icon of icons(element)) {
      expect(getComputedStyle(icon).transitionProperty).toBe('opacity');
    }
  });

  it('width, height and position are never animated', async () => {
    const element = await mount({ text: 'Bold' });
    for (const part of animated(element)) {
      const properties = getComputedStyle(part).transitionProperty;
      expect(properties).not.toMatch(/\ball\b|width|height|inline-size|block-size|top|left|right|bottom|inset|transform|margin|padding/);
    }
    const before = control(element).getBoundingClientRect();
    element.pressed = true;
    await element.updateComplete;
    const after = control(element).getBoundingClientRect();
    expect([after.width, after.height]).toEqual([before.width, before.height]);
  });

  it('with reduced motion, the duration is 100 ms (core/duration/100 through its semantic alias), the easing stays and the colors still change', async () => {
    const session = cdp();
    try {
      await session.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      const element = await mount({ text: 'Bold' });
      const duration = resolved('transition-duration', '--nph-motion-hover-duration');
      expect(duration).toBe('0.1s');
      expect(duration).not.toBe(resolved('transition-duration', '--nph-motion-state-duration'));
      for (const part of animated(element)) {
        const style = getComputedStyle(part);
        expect(listOf(style.transitionDuration).every((value) => value === duration)).toBe(true);
        expect(listOf(style.transitionTimingFunction).every((value) => value === resolved('transition-timing-function', '--nph-motion-state-easing'))).toBe(true);
        expect(style.transitionProperty).not.toBe('none');
      }
      /* Reducing motion shortens the change; it does not remove the feedback. */
      element.pressed = true;
      await element.updateComplete;
      await vi.waitFor(() => {
        expect(getComputedStyle(control(element)).color).toBe(resolved('color', '--nph-color-foreground'));
        expect(getComputedStyle(surface(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
        expect(insetColor(surface(element))).toBe(resolved('color', '--nph-color-primary-border'));
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

describe('contrast, measured (WCAG 2.2 AA)', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: the off label and icons on the track are at least 4.5:1`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount({ text: 'Bold' });
      const label = getComputedStyle(control(element)).color;
      const track = getComputedStyle(control(element)).backgroundColor;
      expect(label).toBe(resolved('color', '--nph-color-muted-foreground'));
      expect(contrast(label, track), `${scheme} muted-foreground on muted`).toBeGreaterThanOrEqual(4.5);
      for (const icon of icons(element)) {
        expect(contrast(getComputedStyle(icon).color, track)).toBeGreaterThanOrEqual(4.5);
      }
    });

    it(`${scheme}: the hover label on the track and the on label on the inner area are at least 4.5:1`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const foreground = resolved('color', '--nph-color-foreground');
      expect(contrast(foreground, resolved('color', '--nph-color-muted'))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(foreground, resolved('color', '--nph-color-background'))).toBeGreaterThanOrEqual(4.5);
    });

    it(`${scheme}: the on outline is at least 3:1 on the track, in every brand`, async () => {
      for (const brand of BRANDS) {
        const part = scope(brand, scheme);
        const element = await mount({ text: 'Bold', pressed: true }, part);
        const outline = insetColor(surface(element));
        const track = getComputedStyle(control(element)).backgroundColor;
        expect(contrast(outline, track), `${scheme} ${brand}`).toBeGreaterThanOrEqual(3);
        part.remove();
      }
    });

    it(`${scheme}: the error border is at least 3:1 on the page background`, async () => {
      expect(contrast(resolved('color', '--nph-status-error'), resolved('color', '--nph-color-background'))).toBeGreaterThanOrEqual(3);
    });
  }

  it('the focus border (color/primary) is at least 3:1 on the page background in light, in every brand, and in dark in the default brand', () => {
    const failures: string[] = [];
    for (const scheme of ['light', 'dark'] as const) {
      for (const brand of BRANDS) {
        const part = scope(brand, scheme);
        const ratio = contrast(resolved('color', '--nph-color-primary', part), resolved('color', '--nph-color-background', part));
        if (ratio < 3) failures.push(`${scheme} ${brand}`);
        part.remove();
      }
    }
    expect(failures.filter((entry) => entry.startsWith('light'))).toEqual([]);
    expect(failures.includes(`dark ${DEFAULT_BRAND}`)).toBe(false);
  });

  /*
   * Known limit, measured and not assumed (design.md says that only focus/border
   * guarantees the 3:1 on the focus border; the brief for this piece uses color/primary):
   * - the border color/primary on the page background is below 3:1 in dark in two
   *   brands, gerencial (2.71) and rh (2.88);
   * - the halo is a soft ring, so the border against the halo is below 3:1 in dark in
   *   every brand (1.76 to 2.94) and in light in no brand (3.33 or more).
   * The test pins the exact list: if a token changes, it fails and the limit is rewritten.
   */
  it('known limit: the focus pairs under 3:1 are exactly the measured ones', () => {
    const border: string[] = [];
    const halo: string[] = [];
    for (const scheme of ['light', 'dark'] as const) {
      for (const brand of BRANDS) {
        const part = scope(brand, scheme);
        const primary = resolved('color', '--nph-color-primary', part);
        if (contrast(primary, resolved('color', '--nph-color-background', part)) < 3) border.push(`${scheme} ${brand}`);
        if (contrast(primary, resolved('color', '--nph-focus-halo', part)) < 3) halo.push(`${scheme} ${brand}`);
        part.remove();
      }
    }
    expect(border).toEqual(['dark gerencial', 'dark rh']);
    expect(halo.every((entry) => entry.startsWith('dark'))).toBe(true);
    expect(halo.length).toBe(BRANDS.length);
  });
});

describe('what the piece does not have', () => {
  it('has no slot and no part', async () => {
    const element = await mount({ text: 'Bold' });
    expect(element.shadowRoot?.querySelector('slot, [part]')).toBeNull();
  });

  it('has no size, no variant and no color property', () => {
    const declared = [...(NphTogglebutton as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['size', 'variant', 'severity', 'emphasis', 'color', 'value', 'checked', 'name', 'loading']) {
      expect(declared).not.toContain(name);
    }
  });

  it('has no form association', () => {
    expect((NphTogglebutton as unknown as { formAssociated?: boolean }).formAssociated).toBeUndefined();
  });

  it('draws only one native button, with no other focusable element inside', async () => {
    const element = await mount({ text: 'Bold' });
    expect(element.shadowRoot?.querySelectorAll('button').length).toBe(1);
    expect(element.shadowRoot?.querySelectorAll('a, input, select, textarea, [tabindex]').length).toBe(0);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, and these are the ones the contract names', () => {
    expect(used).toEqual(
      new Set([
        '--nph-color-muted',
        '--nph-border-width',
        '--nph-status-error',
        '--nph-radius-control',
        '--nph-space-inline-tight',
        '--nph-control-height-default',
        '--nph-radius-inner',
        '--nph-space-control-padding',
        '--nph-color-background',
        '--nph-elevation-subtle',
        '--nph-color-primary-border',
        '--nph-text-label-md-font-family',
        '--nph-text-label-md-font-size',
        '--nph-text-label-md-line-height',
        '--nph-text-label-md-font-weight',
        '--nph-text-label-md-letter-spacing',
        '--nph-color-muted-foreground',
        '--nph-color-foreground',
        '--nph-color-primary',
        '--nph-focus-halo',
        '--nph-focus-halo-error',
        '--nph-focus-border-radius-control',
        '--nph-focus-radius-control-with-border',
        '--nph-focus-ring-width',
        '--nph-state-disabled-opacity',
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

  it('design.md says what the tokens of the piece are for, and the evidence motion is the one it names', () => {
    for (const token of ['color/muted', 'color/primary-border', 'elevation/subtle', 'focus/halo-error', 'state/disabled-opacity', 'motion/hover-duration', 'motion/state-duration']) {
      expect(designMd, token).toContain(`  ${token}:`);
    }
    /* Reduced motion asks for core/duration/100; the piece uses its semantic alias, which design.md ties to the same core token. */
    const reducedEnd = designMd.indexOf('Reducing motion is NOT removing feedback');
    expect(reducedEnd).toBeGreaterThan(0);
    expect(designMd.slice(Math.max(0, reducedEnd - 400), reducedEnd)).toContain('core/duration/100');
    expect(designMd).toMatch(/motion\/hover-duration:\s*\n\s*css: '--nph-motion-hover-duration'\s*\n\s*alias: core\/duration\/100/);
    expect(designMd).toMatch(/motion\/state-duration:\s*\n\s*css: '--nph-motion-state-duration'\s*\n\s*alias: core\/duration\/200/);
    expect(designMd).toContain('Width, height and layout position');
  });

  it('design.md keeps the primary border for a chosen control and tells the dark outline reason', () => {
    expect(designMd).toMatch(/Outline of a chosen or active control/);
  });
});
