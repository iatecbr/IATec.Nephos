/**
 * Tests of `nph-switch` (P79), in a real browser (P21, item 5): resolved color, real
 * hover, keyboard focus, transitions and measures only exist where there is layout.
 *
 * They prove the contract accepted in Figma (frame `1549:2`, set `1548:56`) and the
 * answers D1 to D4 of the task DSA-27: the API, the off and on colors at rest and on
 * hover in both schemes, the track and knob measures, the label after the track, the
 * focus on the track, the toggle and its native events, disabled, invalid, the accessible
 * name, the invalid input, the motion, the measured contrast and the token contract.
 *
 * Color schemes are switched at the root (`data-nph-color-scheme` on `html`). In a part
 * of the screen with another brand and another scheme, `color/primary`,
 * `color/primary-border` and `focus/halo` resolve the local value, so the brand and the
 * scheme go on the same element (P67).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-switch.css?raw';
import { NphSwitch } from './nph-switch';
import '../nph-field/nph-field';

type Props = Partial<Pick<NphSwitch, 'checked' | 'invalid' | 'disabled' | 'text' | 'label'>>;

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

async function mount(props: Props = { text: 'Wi-Fi' }, parent: HTMLElement = document.body): Promise<NphSwitch> {
  const element = document.createElement('nph-switch');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

function control(element: NphSwitch): HTMLButtonElement {
  const button = element.shadowRoot?.querySelector<HTMLButtonElement>('button');
  if (!button) throw new Error('no inner <button>');
  return button;
}

function part(element: NphSwitch, selector: string): HTMLElement {
  const found = element.shadowRoot?.querySelector<HTMLElement>(selector);
  if (!found) throw new Error(`no ${selector}`);
  return found;
}

const track = (element: NphSwitch): HTMLElement => part(element, '.track');
const knobOff = (element: NphSwitch): HTMLElement => part(element, '.knob-off');
const knobOn = (element: NphSwitch): HTMLElement => part(element, '.knob-on');

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string, property = 'width'): number => Number.parseFloat(resolved(property, token));

/** Brands read from the generated CSS; the default is the `:root` one. */
const DEFAULT_BRAND = /:root,\s*\[data-nph-brand="([\w-]+)"\]/.exec(tokensCss)?.[1] ?? '';
const BRANDS = [...new Set([...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? ''))];
const OTHER_BRAND = BRANDS.find((brand) => brand !== DEFAULT_BRAND) ?? '';

/** A part of the screen with a brand and a scheme on the same element (P67). */
function scope(brand = OTHER_BRAND, scheme: 'light' | 'dark' = 'dark'): HTMLElement {
  const area = document.createElement('div');
  area.setAttribute('data-nph-brand', brand);
  area.setAttribute('data-nph-color-scheme', scheme);
  document.body.append(area);
  return area;
}

/** The color of the `inset` layer of a computed `box-shadow` (the outline stroke), or `none`. */
function insetColor(element: HTMLElement): string {
  const value = getComputedStyle(element).boxShadow;
  if (value === 'none' || !value.includes('inset')) return 'none';
  return value.match(/rgba?\([^)]*\)/)?.[0] ?? 'none';
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

/** The horizontal offset of a computed `transform` (`none` is 0). */
function translateX(element: HTMLElement): number {
  const value = getComputedStyle(element).transform;
  return value === 'none' ? 0 : new DOMMatrixReadOnly(value).m41;
}

/** The knob travel: track width, minus the knob, minus the gap on both sides. */
const travel = (): number => px('--nph-switch-track-width') - px('--nph-icon-size-sm') - 2 * px('--nph-space-inline-tight');

async function settled(element: NphSwitch): Promise<void> {
  await element.updateComplete;
  await Promise.all(element.shadowRoot?.getAnimations().map((animation) => animation.finished.catch(() => undefined)) ?? []);
}

describe('registration and API', () => {
  it('defines nph-switch only once', () => {
    expect(customElements.get('nph-switch')).toBe(NphSwitch);
  });

  it('the public API is exactly the one in P79', () => {
    const declared = [...(NphSwitch as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['checked', 'invalid', 'disabled', 'text', 'label']);
  });

  it('declares the option role the field reads (contract of the field, P83)', () => {
    expect(NphSwitch.nphFieldRole).toBe('option');
  });

  it('the defaults are off, valid and enabled', async () => {
    const element = await mount();
    expect([element.checked, element.invalid, element.disabled]).toEqual([false, false, false]);
    expect([element.text, element.label]).toEqual(['Wi-Fi', '']);
  });

  it('the three booleans reflect to attributes, so the internal CSS can read them', async () => {
    const element = await mount({ text: 'Wi-Fi', checked: true, invalid: true, disabled: true });
    expect(['checked', 'invalid', 'disabled'].map((name) => element.hasAttribute(name))).toEqual([true, true, true]);
    element.checked = false;
    await element.updateComplete;
    expect(element.hasAttribute('checked')).toBe(false);
  });

  it('the attributes are checked, invalid, disabled, text and label', async () => {
    const element = document.createElement('nph-switch');
    for (const name of ['checked', 'invalid', 'disabled']) element.setAttribute(name, '');
    element.setAttribute('text', 'Wi-Fi');
    element.setAttribute('label', 'Wireless network');
    document.body.append(element);
    await element.updateComplete;
    expect([element.checked, element.invalid, element.disabled]).toEqual([true, true, true]);
    expect([element.text, element.label]).toEqual(['Wi-Fi', 'Wireless network']);
  });

  it('has the open shadow root with delegated focus', async () => {
    const element = await mount();
    expect(element.shadowRoot?.mode).toBe('open');
    expect(element.shadowRoot?.delegatesFocus).toBe(true);
  });
});

describe('colors, off and on, at rest and on hover, in both schemes', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme} · off: track color/input with no outline, knob color/background, label color/foreground`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-input'));
      expect(insetColor(track(element))).toBe(TRANSPARENT);
      expect(getComputedStyle(knobOff(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
      expect(getComputedStyle(knobOn(element)).opacity).toBe('0');
      expect(getComputedStyle(part(element, '.text')).color).toBe(resolved('color', '--nph-color-foreground'));
    });

    it(`${scheme} · on: track color/primary with a color/primary-border outline inside, knob color/primary-foreground`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount({ text: 'Wi-Fi', checked: true });
      expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary'));
      expect(insetColor(track(element))).toBe(resolved('color', '--nph-color-primary-border'));
      expect(getComputedStyle(track(element)).boxShadow).toContain(`inset`);
      expect(getComputedStyle(track(element)).boxShadow).toContain(` ${resolved('width', '--nph-border-width')}`);
      expect(getComputedStyle(knobOn(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-foreground'));
      expect(getComputedStyle(knobOn(element)).opacity).toBe('1');
    });

    for (const checked of [false, true]) {
      const state = checked ? 'on' : 'off';
      const fill = checked ? '--nph-color-primary-hover' : '--nph-color-input-hover';
      it(`${scheme} · ${state}: on hover, the fill is ${fill.replace('--nph-', '').replace('-', '/')} and the outline stays`, async () => {
        document.documentElement.setAttribute('data-nph-color-scheme', scheme);
        const element = await mount({ text: 'Wi-Fi', checked });
        const outline = insetColor(track(element));
        await userEvent.hover(track(element));
        await vi.waitFor(() => expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', fill)));
        expect(insetColor(track(element))).toBe(outline);
      });
    }
  }

  it('hovering the label changes the track too: the whole piece is the target', async () => {
    const element = await mount();
    await userEvent.hover(part(element, '.text'));
    await vi.waitFor(() => expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-input-hover')));
    await userEvent.unhover(part(element, '.text'));
    await vi.waitFor(() => expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-input')));
  });

  it('with a brand other than the default and the dark scheme on the same element, the on piece takes the local tokens (P67)', async () => {
    const area = scope();
    const element = await mount({ text: 'Wi-Fi', checked: true }, area);
    const local = resolved('background-color', '--nph-color-primary', area);
    expect(local).not.toBe(resolved('background-color', '--nph-color-primary'));
    expect(getComputedStyle(track(element)).backgroundColor).toBe(local);
    expect(insetColor(track(element))).toBe(resolved('color', '--nph-color-primary-border', area));
    expect(getComputedStyle(knobOn(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-foreground', area));
  });

  it('toggling on, the colors change to the on ones', async () => {
    const element = await mount();
    element.checked = true;
    await settled(element);
    expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary'));
    expect(insetColor(track(element))).toBe(resolved('color', '--nph-color-primary-border'));
  });
});

describe('measures and anatomy', () => {
  it('the track is switch/track-width by icon/size-lg, fully rounded', async () => {
    const element = await mount();
    const box = track(element).getBoundingClientRect();
    expect([box.width, box.height]).toEqual([px('--nph-switch-track-width'), px('--nph-icon-size-lg', 'height')]);
    /* The measures read from the accepted set: 40 x 24. */
    expect([box.width, box.height]).toEqual([40, 24]);
    expect(getComputedStyle(track(element)).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
  });

  it('the knob is icon/size-sm, fully rounded, space/inline-tight from the track edge, on the left when off', async () => {
    const element = await mount();
    const outer = track(element).getBoundingClientRect();
    const gap = px('--nph-space-inline-tight', 'padding-left');
    for (const knob of [knobOff(element), knobOn(element)]) {
      const box = knob.getBoundingClientRect();
      expect([box.width, box.height]).toEqual([px('--nph-icon-size-sm'), px('--nph-icon-size-sm')]);
      expect(box.left - outer.left).toBeCloseTo(gap, 2);
      expect(box.top - outer.top).toBeCloseTo(gap, 2);
      expect(outer.bottom - box.bottom).toBeCloseTo(gap, 2);
      expect(getComputedStyle(knob).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
    }
  });

  it('on, the knob is on the right, space/inline-tight from the edge: it travels 16 px by transform', async () => {
    const element = await mount({ text: 'Wi-Fi', checked: true });
    await settled(element);
    const outer = track(element).getBoundingClientRect();
    const box = knobOn(element).getBoundingClientRect();
    expect(outer.right - box.right).toBeCloseTo(px('--nph-space-inline-tight', 'padding-left'), 2);
    expect(translateX(knobOn(element))).toBeCloseTo(travel(), 2);
    expect(travel()).toBe(16);
    /* The layout position does not move: the travel is only the transform. */
    expect(getComputedStyle(knobOn(element)).left).toBe(resolved('left', '--nph-space-inline-tight'));
  });

  it('the label comes after the track, space/inline from it, in the five properties of text/label-md', async () => {
    const element = await mount();
    const text = part(element, '.text');
    const style = getComputedStyle(text);
    expect(style.fontFamily).toBe(resolved('font-family', '--nph-text-label-md-font-family'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-text-label-md-line-height'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(style.letterSpacing).toBe(resolved('letter-spacing', '--nph-text-label-md-letter-spacing'));
    expect(text.getBoundingClientRect().left - track(element).getBoundingClientRect().right).toBeCloseTo(px('--nph-space-inline', 'column-gap'), 2);
    expect([...control(element).children].map((node) => node.className)).toEqual(['track', 'text']);
  });

  it('a long label wraps to the available width; the track stays at the top, aligned with the first line, and does not shrink (D1, D5)', async () => {
    const box = document.createElement('div');
    box.style.setProperty('inline-size', 'calc(var(--nph-switch-track-width) * 4)');
    document.body.append(box);
    const element = await mount({ text: 'Send me a weekly summary of the activity in every project I follow' }, box);
    const text = part(element, '.text').getBoundingClientRect();
    const line = px('--nph-text-label-md-line-height', 'height');
    expect(text.height).toBeGreaterThanOrEqual(2 * line);
    expect(element.getBoundingClientRect().width).toBeLessThanOrEqual(box.getBoundingClientRect().width);
    const outer = track(element).getBoundingClientRect();
    expect(outer.top).toBeCloseTo(text.top, 2);
    expect([outer.width, outer.height]).toEqual([px('--nph-switch-track-width'), px('--nph-icon-size-lg', 'height')]);
  });

  it('without text, the piece is only the track', async () => {
    const element = await mount({ label: 'Wi-Fi' });
    expect(element.shadowRoot?.querySelector('.text')).toBeNull();
    const box = element.getBoundingClientRect();
    expect([box.width, box.height]).toEqual([px('--nph-switch-track-width'), px('--nph-icon-size-lg', 'height')]);
  });

  it('the host is an inline box that takes no space without a valid input', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const valid = await mount();
    expect(getComputedStyle(valid).display).toBe('inline-flex');
    const invalid = await mount({});
    expect(getComputedStyle(invalid).display).toBe('none');
  });
});

describe('focus', () => {
  async function focused(props: Props, parent: HTMLElement = document.body): Promise<NphSwitch> {
    const before = document.createElement('input');
    parent.append(before);
    const element = await mount(props, parent);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement).toBe(control(element));
    return element;
  }

  for (const checked of [false, true]) {
    it(`${checked ? 'on' : 'off'}: Tab turns the track outline focus/border and shows the focus/halo outside the track, both fully rounded`, async () => {
      const element = await focused({ text: 'Wi-Fi', checked });
      const border = getComputedStyle(track(element), '::before');
      const halo = getComputedStyle(track(element), '::after');
      expect(border.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
      expect(border.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
      expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
      expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
      expect(halo.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
      expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
      /* The border is the track's own edge; the halo starts where the track ends. */
      const box = track(element).getBoundingClientRect();
      const ring = px('--nph-focus-ring-width');
      expect([Number.parseFloat(border.width), Number.parseFloat(border.height)]).toEqual([box.width, box.height]);
      expect(Number.parseFloat(halo.width)).toBeCloseTo(box.width + 2 * ring, 2);
      expect(Number.parseFloat(halo.height)).toBeCloseTo(box.height + 2 * ring, 2);
    });
  }

  it('invalid: the outline is status/error and the halo is focus/halo-error', async () => {
    const element = await focused({ text: 'Wi-Fi', invalid: true });
    expect(getComputedStyle(track(element), '::before').borderTopColor).toBe(resolved('color', '--nph-status-error'));
    expect(getComputedStyle(track(element), '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
  });

  it('the label gets no ring and the focus does not change the size of the piece', async () => {
    const element = await focused({ text: 'Wi-Fi' });
    expect(getComputedStyle(part(element, '.text'), '::after').content).toBe('none');
    expect(getComputedStyle(control(element)).outlineStyle).toBe('none');
    const twin = await mount();
    expect(control(element).getBoundingClientRect().width).toBe(control(twin).getBoundingClientRect().width);
  });

  it('with another brand and another scheme on the same element, the halo is the local one (P67)', async () => {
    const area = scope();
    const element = await focused({ text: 'Wi-Fi' }, area);
    const halo = resolved('color', '--nph-focus-halo', area);
    expect(halo).not.toBe(resolved('color', '--nph-focus-halo'));
    expect(getComputedStyle(track(element), '::after').borderTopColor).toBe(halo);
    expect(getComputedStyle(track(element), '::before').borderTopColor).toBe(resolved('color', '--nph-focus-border', area));
  });

  it('a mouse click draws no focus ring', async () => {
    const element = await mount();
    await userEvent.click(control(element));
    expect(getComputedStyle(track(element), '::before').content).toBe('none');
    expect(getComputedStyle(track(element), '::after').content).toBe('none');
  });

  it('host focus goes to the native button', async () => {
    const element = await mount();
    element.focus();
    expect(element.shadowRoot?.activeElement).toBe(control(element));
  });
});

describe('toggle and native events', () => {
  function listen(element: NphSwitch): { log: string[]; events: Event[] } {
    const log: string[] = [];
    const events: Event[] = [];
    for (const type of ['input', 'change']) {
      element.addEventListener(type, (event) => {
        log.push(`${type}:${String((event.target as NphSwitch).checked)}`);
        events.push(event);
      });
    }
    return { log, events };
  }

  it('a click on the track toggles checked and fires input, then change, once each', async () => {
    const element = await mount();
    const { log } = listen(element);
    await userEvent.click(track(element));
    expect(element.checked).toBe(true);
    expect(log).toEqual(['input:true', 'change:true']);
    await userEvent.click(track(element));
    expect(log).toEqual(['input:true', 'change:true', 'input:false', 'change:false']);
  });

  it('a click on the label toggles too: the whole piece is the target', async () => {
    const element = await mount();
    await userEvent.click(part(element, '.text'));
    expect(element.checked).toBe(true);
  });

  it('Enter and Space toggle too', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount();
    const { log } = listen(element);
    before.focus();
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(element.checked).toBe(true);
    await userEvent.keyboard(' ');
    expect(element.checked).toBe(false);
    expect(log).toEqual(['input:true', 'change:true', 'input:false', 'change:false']);
  });

  it('input bubbles and crosses shadow roots; change bubbles and does not, as on a native control', async () => {
    const element = await mount();
    const { events } = listen(element);
    const seen: string[] = [];
    document.addEventListener('input', () => seen.push('input'), { once: true });
    document.addEventListener('change', () => seen.push('change'), { once: true });
    await userEvent.click(track(element));
    const [input, change] = events;
    expect(input).toBeInstanceOf(Event);
    expect(input).not.toBeInstanceOf(CustomEvent);
    expect([input?.bubbles, input?.composed, input?.cancelable]).toEqual([true, true, false]);
    expect([change?.bubbles, change?.composed, change?.cancelable]).toEqual([true, false, false]);
    expect(seen).toEqual(['input', 'change']);
  });

  it('inside another shadow root, input reaches the outer host and change stays inside', async () => {
    const outer = document.createElement('div');
    document.body.append(outer);
    const root = outer.attachShadow({ mode: 'open' });
    const element = await mount({ text: 'Wi-Fi' }, root as unknown as HTMLElement);
    const seen: string[] = [];
    outer.addEventListener('input', () => seen.push('input'));
    outer.addEventListener('change', () => seen.push('change'));
    element.click();
    expect(seen).toEqual(['input']);
  });

  it('fires no nph-* event', async () => {
    const element = await mount();
    const custom = vi.fn();
    for (const type of ['nph-change', 'nph-checked-change', 'nph-value-change']) element.addEventListener(type, custom);
    await userEvent.click(track(element));
    expect(custom).not.toHaveBeenCalled();
  });

  it('the native click still reaches the consumer, once per click', async () => {
    const element = await mount();
    const clicks = vi.fn();
    element.addEventListener('click', clicks);
    await userEvent.click(track(element));
    expect(clicks).toHaveBeenCalledTimes(1);
  });

  it('a click called on the host toggles too, as the click of a native control would', async () => {
    const element = await mount();
    const { log } = listen(element);
    element.click();
    expect([element.checked, log]).toEqual([true, ['input:true', 'change:true']]);
  });

  it('setting checked from code, by property or attribute, never fires an event', async () => {
    const element = await mount();
    const { log } = listen(element);
    element.checked = true;
    await element.updateComplete;
    element.removeAttribute('checked');
    await element.updateComplete;
    element.toggleAttribute('checked', true);
    await element.updateComplete;
    element.checked = false;
    await element.updateComplete;
    expect(log).toEqual([]);
    expect(element.checked).toBe(false);
  });

  it('a piece that starts with checked set fires nothing at mount', async () => {
    const events = vi.fn();
    document.addEventListener('input', events);
    document.addEventListener('change', events);
    await mount({ text: 'Wi-Fi', checked: true });
    document.removeEventListener('input', events);
    document.removeEventListener('change', events);
    expect(events).not.toHaveBeenCalled();
  });

  it('aria-checked on the inner switch follows the state, from the click and from code', async () => {
    const element = await mount();
    expect(control(element).getAttribute('aria-checked')).toBe('false');
    await userEvent.click(track(element));
    await element.updateComplete;
    expect(control(element).getAttribute('aria-checked')).toBe('true');
    element.checked = false;
    await element.updateComplete;
    expect(control(element).getAttribute('aria-checked')).toBe('false');
  });

  it('the inner button is type=button, role=switch, has no aria-pressed and does not submit a form', async () => {
    const form = document.createElement('form');
    const submit = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submit);
    document.body.append(form);
    const element = await mount({ text: 'Wi-Fi' }, form);
    expect(control(element).type).toBe('button');
    expect(control(element).getAttribute('role')).toBe('switch');
    expect(control(element).hasAttribute('aria-pressed')).toBe(false);
    await userEvent.click(track(element));
    expect(submit).not.toHaveBeenCalled();
  });

  it('the piece is not associated with a form: it adds nothing to the form data', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = await mount({ text: 'Wi-Fi', checked: true }, form);
    expect([...new FormData(form).keys()]).toEqual([]);
    expect(form.elements.length).toBe(0);
    expect((NphSwitch as unknown as { formAssociated?: boolean }).formAssociated).toBeUndefined();
    expect((element as unknown as { form?: unknown }).form).toBeUndefined();
  });
});

describe('disabled', () => {
  it('leaves the Tab order, does not toggle, fires nothing and stays at state/disabled-opacity', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ text: 'Wi-Fi', disabled: true });
    const heard = vi.fn();
    for (const type of ['click', 'input', 'change']) element.addEventListener(type, heard);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
    element.click();
    control(element).click();
    expect(heard).not.toHaveBeenCalled();
    expect(element.checked).toBe(false);
    expect(control(element).disabled).toBe(true);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('an enabled piece is at full opacity', async () => {
    const element = await mount();
    expect(getComputedStyle(element).opacity).toBe('1');
  });

  it('on hover, the resting fill stays', async () => {
    const element = await mount({ text: 'Wi-Fi', disabled: true });
    await userEvent.hover(element, { force: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-input'));
  });

  it('on and disabled keeps the on look, with the color/primary-border outline (D4)', async () => {
    const element = await mount({ text: 'Wi-Fi', checked: true, disabled: true });
    expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary'));
    expect(insetColor(track(element))).toBe(resolved('color', '--nph-color-primary-border'));
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('enabling it again brings back the toggle', async () => {
    const element = await mount({ text: 'Wi-Fi', disabled: true });
    element.disabled = false;
    await element.updateComplete;
    await userEvent.click(track(element));
    expect(element.checked).toBe(true);
  });
});

describe('invalid', () => {
  for (const checked of [false, true]) {
    it(`${checked ? 'on' : 'off'}: the track outline is status/error and aria-invalid is set`, async () => {
      const element = await mount({ text: 'Wi-Fi', checked, invalid: true });
      expect(insetColor(track(element))).toBe(resolved('color', '--nph-status-error'));
      expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', checked ? '--nph-color-primary' : '--nph-color-input'));
      expect(control(element).getAttribute('aria-invalid')).toBe('true');
    });
  }

  it('the error outline shows in both schemes', async () => {
    for (const scheme of ['light', 'dark'] as const) {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount({ text: 'Wi-Fi', invalid: true });
      expect(insetColor(track(element))).toBe(resolved('color', '--nph-status-error'));
      element.remove();
    }
  });

  it('on hover with an error, the fill follows the hover and the outline stays status/error (D6)', async () => {
    const element = await mount({ text: 'Wi-Fi', invalid: true });
    await userEvent.hover(track(element));
    await vi.waitFor(() => expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-input-hover')));
    expect(insetColor(track(element))).toBe(resolved('color', '--nph-status-error'));
  });

  it('invalid does not change the size of the piece', async () => {
    const valid = await mount();
    const invalid = await mount({ text: 'Wi-Fi', invalid: true });
    expect(invalid.getBoundingClientRect().width).toBe(valid.getBoundingClientRect().width);
  });

  it('disabled wins over invalid: no error outline, no aria-invalid and no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ text: 'Wi-Fi', invalid: true, disabled: true });
    expect(insetColor(track(element))).toBe(TRANSPARENT);
    expect(control(element).hasAttribute('aria-invalid')).toBe(false);
    expect(error).not.toHaveBeenCalled();
    element.disabled = false;
    await settled(element);
    expect(insetColor(track(element))).toBe(resolved('color', '--nph-status-error'));
    expect(control(element).getAttribute('aria-invalid')).toBe('true');
  });

  it('a valid piece has no aria-invalid', async () => {
    const element = await mount();
    expect(control(element).hasAttribute('aria-invalid')).toBe(false);
  });
});

describe('accessible name and role', () => {
  it('with text, the name is the text, there is no aria-label and the track is hidden', async () => {
    const element = await mount({ text: 'Wi-Fi', label: 'ignored' });
    expect(control(element).hasAttribute('aria-label')).toBe(false);
    expect(control(element).textContent?.trim()).toBe('Wi-Fi');
    expect(track(element).getAttribute('aria-hidden')).toBe('true');
    await expect.element(page.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument();
  });

  it('without text, aria-label comes from label', async () => {
    const element = await mount({ label: '  Wi-Fi  ' });
    expect(control(element).getAttribute('aria-label')).toBe('Wi-Fi');
    await expect.element(page.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument();
  });

  it('the role carries the checked state', async () => {
    await mount({ text: 'Wi-Fi', checked: true });
    await expect.element(page.getByRole('switch', { name: 'Wi-Fi', checked: true })).toBeInTheDocument();
  });

  it('a text of only spaces counts as no text: the piece is only the track', async () => {
    const element = await mount({ text: '   ', label: 'Wi-Fi' });
    expect(control(element).getAttribute('aria-label')).toBe('Wi-Fi');
    expect(element.shadowRoot?.querySelector('.text')).toBeNull();
  });

  it('the text is trimmed', async () => {
    const element = await mount({ text: '  Wi-Fi  ' });
    expect(part(element, '.text').textContent).toBe('Wi-Fi');
  });

  it('removed or undefined text and label do not break the render', async () => {
    const element = await mount({ text: 'Wi-Fi', label: 'Wireless network' });
    element.text = null as unknown as string;
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Wireless network');
    element.setAttribute('text', 'Wi-Fi');
    await element.updateComplete;
    element.removeAttribute('text');
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Wireless network');
    element.text = undefined as unknown as string;
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Wireless network');
  });
});

describe('invalid input', () => {
  for (const [name, props] of [
    ['no text and no label', {}],
    ['spaces only in text and label', { text: '   ', label: '  ' }],
  ] as const) {
    it(`${name}: nothing drawn and one error in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const element = await mount(props);
      expect(error).toHaveBeenCalledTimes(1);
      expect(String(error.mock.calls[0]?.[0])).toContain('[nph-switch]');
      expect(element.shadowRoot?.querySelector('button')).toBeNull();
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect([element.getBoundingClientRect().width, element.getBoundingClientRect().height]).toEqual([0, 0]);
    });
  }

  it('an invalid piece does not toggle and fires nothing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({});
    const heard = vi.fn();
    element.addEventListener('input', heard);
    element.addEventListener('change', heard);
    element.click();
    expect(heard).not.toHaveBeenCalled();
    expect(element.checked).toBe(false);
  });

  it('changing the state does not repeat the error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({});
    element.checked = true;
    element.invalid = true;
    element.disabled = true;
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a valid input set later draws the piece', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({});
    element.setAttribute('label', 'Wi-Fi');
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(control(element).getAttribute('aria-label')).toBe('Wi-Fi');
  });

  it('invalid and disabled together draw the piece and emit no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ text: 'Wi-Fi', invalid: true, disabled: true });
    expect(error).not.toHaveBeenCalled();
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
  });
});

describe('motion', () => {
  it('the track fill and outline and the knob run on the state duration and easing, as a pair (D3)', async () => {
    const element = await mount();
    const duration = resolved('transition-duration', '--nph-motion-state-duration');
    const easing = resolved('transition-timing-function', '--nph-motion-state-easing');
    expect(duration).not.toBe('0s');
    expect(getComputedStyle(track(element)).transitionProperty).toBe('background-color, box-shadow');
    for (const knob of [knobOff(element), knobOn(element)]) {
      expect(getComputedStyle(knob).transitionProperty).toBe('transform, opacity');
    }
    for (const animated of [track(element), knobOff(element), knobOn(element)]) {
      const style = getComputedStyle(animated);
      expect(listOf(style.transitionDuration).every((value) => value === duration)).toBe(true);
      expect(listOf(style.transitionTimingFunction).every((value) => value === easing)).toBe(true);
    }
  });

  it('the knob slides by transform, never by layout position; width and height never animate', async () => {
    const element = await mount();
    for (const animated of [track(element), knobOff(element), knobOn(element)]) {
      expect(getComputedStyle(animated).transitionProperty).not.toMatch(/\ball\b|width|height|inline-size|block-size|top|left|right|bottom|inset|margin|padding/);
    }
    const before = knobOff(element).getBoundingClientRect();
    element.checked = true;
    await settled(element);
    expect(getComputedStyle(knobOff(element)).left).toBe(resolved('left', '--nph-space-inline-tight'));
    expect(translateX(knobOff(element))).toBeCloseTo(travel(), 2);
    expect(knobOff(element).getBoundingClientRect().left - before.left).toBeCloseTo(travel(), 2);
    expect(control(element).getBoundingClientRect().width).toBeGreaterThan(0);
  });

  it('the off knob stays opaque under the on knob, so the knob never dims while it slides', async () => {
    const element = await mount({ text: 'Wi-Fi', checked: true });
    expect(getComputedStyle(knobOff(element)).opacity).toBe('1');
    expect(getComputedStyle(knobOn(element)).opacity).toBe('1');
    const [off, on] = [knobOff(element).getBoundingClientRect(), knobOn(element).getBoundingClientRect()];
    expect([off.left, off.top]).toEqual([on.left, on.top]);
  });

  it('with reduced motion, the knob does not slide: it changes side by opacity in 100 ms, and the color still changes', async () => {
    const session = cdp();
    try {
      await session.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      const element = await mount();
      const duration = resolved('transition-duration', '--nph-motion-hover-duration');
      expect(duration).toBe('0.1s');
      const easing = resolved('transition-timing-function', '--nph-motion-state-easing');
      for (const knob of [knobOff(element), knobOn(element)]) {
        const style = getComputedStyle(knob);
        expect(style.transitionProperty).toBe('opacity');
        expect(style.transitionDuration).toBe(duration);
        expect(style.transitionTimingFunction).toBe(easing);
      }
      expect(listOf(getComputedStyle(track(element)).transitionDuration).every((value) => value === duration)).toBe(true);
      /* The off knob stays on the left and the on knob on the right; only opacity changes. */
      expect(translateX(knobOff(element))).toBe(0);
      expect(translateX(knobOn(element))).toBeCloseTo(travel(), 2);
      expect([getComputedStyle(knobOff(element)).opacity, getComputedStyle(knobOn(element)).opacity]).toEqual(['1', '0']);
      element.checked = true;
      await settled(element);
      expect(translateX(knobOff(element))).toBe(0);
      expect([getComputedStyle(knobOff(element)).opacity, getComputedStyle(knobOn(element)).opacity]).toEqual(['0', '1']);
      expect(getComputedStyle(track(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary'));
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
  /** Ratios under the minimum, as "scheme brand", across the seven brands and the two schemes. */
  function below(minimum: number, pair: (area: HTMLElement) => [string, string]): string[] {
    const failures: string[] = [];
    for (const scheme of ['light', 'dark'] as const) {
      for (const brand of BRANDS) {
        const area = scope(brand, scheme);
        const [a, b] = pair(area);
        if (contrast(a, b) < minimum) failures.push(`${scheme} ${brand}`);
        area.remove();
      }
    }
    return failures;
  }

  it('the off track edge, color/input and color/input-hover, is at least 3:1 on the page background', () => {
    expect(below(3, (area) => [resolved('color', '--nph-color-input', area), resolved('color', '--nph-color-background', area)])).toEqual([]);
    expect(below(3, (area) => [resolved('color', '--nph-color-input-hover', area), resolved('color', '--nph-color-background', area)])).toEqual([]);
  });

  it('the on outline, color/primary-border, is at least 3:1 on the page background, in every brand', () => {
    expect(below(3, (area) => [resolved('color', '--nph-color-primary-border', area), resolved('color', '--nph-color-background', area)])).toEqual([]);
  });

  it('the knob is at least 3:1 on its track: color/background on color/input, color/primary-foreground on color/primary', () => {
    expect(below(3, (area) => [resolved('color', '--nph-color-background', area), resolved('color', '--nph-color-input', area)])).toEqual([]);
    expect(below(3, (area) => [resolved('color', '--nph-color-primary-foreground', area), resolved('color', '--nph-color-primary', area)])).toEqual([]);
  });

  it('the error outline, status/error, is at least 3:1 on the page background', () => {
    expect(below(3, (area) => [resolved('color', '--nph-status-error', area), resolved('color', '--nph-color-background', area)])).toEqual([]);
  });

  it('the label, color/foreground on color/background, is at least 4.5:1', () => {
    expect(below(4.5, (area) => [resolved('color', '--nph-color-foreground', area), resolved('color', '--nph-color-background', area)])).toEqual([]);
  });

  /*
   * Known limit recorded in design.md (focus/border): the focus border meets 3:1 against
   * the halo in every brand and scheme except the default brand in light mode, at 2.92:1. The test pins
   * the exact list: if a token changes, it fails and the limit is rewritten.
   */
  it('known limit: focus/border against focus/halo is under 3:1 only in the default brand, in light mode', () => {
    expect(below(3, (area) => [resolved('color', '--nph-focus-border', area), resolved('color', '--nph-focus-halo', area)])).toEqual([`light ${DEFAULT_BRAND}`]);
  });
});

describe('inside the real nph-field (P83)', () => {
  async function fieldWith(attributes: Record<string, string>, texts: string[]): Promise<{ field: HTMLElement; switches: NphSwitch[] }> {
    const field = document.createElement('nph-field');
    for (const [name, value] of Object.entries(attributes)) field.setAttribute(name, value);
    const switches = texts.map((text) => {
      const piece = document.createElement('nph-switch');
      piece.text = text;
      field.append(piece);
      return piece;
    });
    document.body.append(field);
    await (field as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    await Promise.all(switches.map((piece) => piece.updateComplete));
    return { field, switches };
  }

  const wrapper = (field: HTMLElement): HTMLElement => field.shadowRoot?.querySelector('.control') as HTMLElement;

  it('the switches are options of a group named by the field label, and each keeps its own name', async () => {
    const { field, switches } = await fieldWith({ label: 'Notifications', help: 'Pick the ones you want.' }, ['Email', 'Push']);
    expect(wrapper(field).getAttribute('role')).toBe('group');
    expect(wrapper(field).getAttribute('aria-label')).toBe('Notifications');
    for (const piece of switches) {
      expect(piece.label).toBe('');
      expect(control(piece).hasAttribute('aria-label')).toBe(false);
      expect(piece.hasAttribute('data-nph-rendered')).toBe(true);
    }
    await expect.element(page.getByRole('switch', { name: 'Email' })).toBeInTheDocument();
  });

  it('an error in the field makes every switch invalid; clearing it gives the switches back', async () => {
    const { field, switches } = await fieldWith({ label: 'Notifications', error: 'Turn one on.' }, ['Email', 'Push']);
    expect(wrapper(field).getAttribute('aria-invalid')).toBe('true');
    for (const piece of switches) {
      expect(piece.invalid).toBe(true);
      expect(insetColor(track(piece))).toBe(resolved('color', '--nph-status-error'));
    }
    field.removeAttribute('error');
    await (field as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    await Promise.all(switches.map((piece) => settled(piece)));
    for (const piece of switches) {
      expect(piece.invalid).toBe(false);
    }
  });

  it('a disabled field passes disabled to each switch, which fades itself; the field draws no opacity', async () => {
    const { field, switches } = await fieldWith({ label: 'Notifications', disabled: '' }, ['Email']);
    const [piece] = switches as [NphSwitch];
    expect(piece.disabled).toBe(true);
    expect(getComputedStyle(piece).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(getComputedStyle(field).opacity).toBe('1');
  });

  it('toggling a switch inside the field still fires input and change, and the field adds no event', async () => {
    const { field, switches } = await fieldWith({ label: 'Notifications' }, ['Email']);
    const heard: string[] = [];
    for (const type of ['input', 'change']) field.addEventListener(type, () => heard.push(type));
    await userEvent.click(track(switches[0] as NphSwitch));
    expect(heard).toEqual(['input', 'change']);
  });
});

describe('what the piece does not have', () => {
  it('has no slot and no part', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('slot, [part]')).toBeNull();
  });

  it('has no size, no variant, no color and no form property', () => {
    const declared = [...(NphSwitch as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['size', 'variant', 'color', 'value', 'name', 'pressed', 'required', 'description']) {
      expect(declared).not.toContain(name);
    }
  });

  it('draws only one native button, with no other focusable element inside', async () => {
    const element = await mount();
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
        '--nph-state-disabled-opacity',
        '--nph-space-inline',
        '--nph-color-foreground',
        '--nph-text-label-md-font-family',
        '--nph-text-label-md-font-size',
        '--nph-text-label-md-font-weight',
        '--nph-text-label-md-line-height',
        '--nph-text-label-md-letter-spacing',
        '--nph-color-input',
        '--nph-focus-border',
        '--nph-focus-halo',
        '--nph-switch-track-width',
        '--nph-icon-size-sm',
        '--nph-space-inline-tight',
        '--nph-icon-size-lg',
        '--nph-radius-full',
        '--nph-border-width',
        '--nph-color-primary',
        '--nph-color-primary-border',
        '--nph-color-input-hover',
        '--nph-color-primary-hover',
        '--nph-status-error',
        '--nph-focus-halo-error',
        '--nph-color-background',
        '--nph-color-primary-foreground',
        '--nph-focus-ring-width',
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

  it('design.md names the switch tokens and the motion the evidence asks for', () => {
    for (const token of ['switch/track-width', 'color/input', 'color/input-hover', 'color/primary-border', 'focus/border', 'focus/halo-error', 'radius/full', 'motion/hover-duration', 'motion/state-duration']) {
      expect(designMd, token).toContain(`  ${token}:`);
    }
    expect(designMd).toMatch(/Width of the nph-switch track: 40\. USE only on the nph-switch track, with the height of icon\/size-lg \(24\)/);
    expect(designMd).toMatch(/focus\/border[\s\S]{0,600}Applies to checkbox, radio and switch/);
    expect(designMd).toMatch(/switch knob/);
    /* Reduced motion asks for core/duration/100; the piece uses its semantic alias, which design.md ties to the same core token. */
    expect(designMd).toMatch(/motion\/hover-duration:\s*\n\s*css: '--nph-motion-hover-duration'\s*\n\s*alias: core\/duration\/100/);
    expect(designMd).toContain('Width, height and layout position');
  });
});
