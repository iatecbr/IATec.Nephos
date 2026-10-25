/**
 * Tests of `nph-checkbox` (P81), in a real browser (P21, item 5): resolved color, real
 * hover, keyboard focus, transitions, measures and form submission only exist where there
 * is layout and a form.
 *
 * They prove the contract accepted in Figma (frame `1194:1033`, set `740:18776`) and D1 to
 * D6 of DSA-17: the API, the box, touch area and text measures, the colors of each state in
 * both schemes, the focus border and halo, the toggle and the native events, the accessible
 * name and state, form participation, disabled, invalid, the invalid input, the motion, the
 * measured contrast and the token contract.
 *
 * Color schemes are switched at the root (`data-nph-color-scheme` on `html`). In a part of
 * the screen with another brand and another scheme, `color/primary` and `focus/halo`
 * resolve the local value, so the brand and the scheme go on the same element (P67).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-checkbox.css?raw';
import { NPH_CHECKBOX_DEFAULT_VALUE, NPH_CHECKBOX_MARKS, NphCheckbox } from './nph-checkbox';

type Props = Partial<Pick<NphCheckbox, 'checked' | 'indeterminate' | 'invalid' | 'disabled' | 'text' | 'label' | 'name' | 'value'>>;

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

async function mount(props: Props = { text: 'Remember me' }, parent: HTMLElement = document.body): Promise<NphCheckbox> {
  const element = document.createElement('nph-checkbox');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

/** Markup parsed as a consumer writes it, so the attributes are there before the upgrade. */
async function parse(markup: string, parent: HTMLElement = document.body): Promise<HTMLElement> {
  const holder = document.createElement('div');
  holder.innerHTML = markup;
  parent.append(holder);
  await Promise.all([...holder.querySelectorAll('nph-checkbox')].map((element) => (element as NphCheckbox).updateComplete));
  return holder;
}

function part<T extends HTMLElement = HTMLElement>(element: NphCheckbox, selector: string): T {
  const found = element.shadowRoot?.querySelector<T>(selector);
  if (!found) throw new Error(`no ${selector}`);
  return found;
}

const input = (element: NphCheckbox) => part<HTMLInputElement>(element, 'input');
const box = (element: NphCheckbox) => part(element, '.box');
const target = (element: NphCheckbox) => part(element, '.target');
const control = (element: NphCheckbox) => part(element, '.control');
const textOf = (element: NphCheckbox) => element.shadowRoot?.querySelector<HTMLElement>('.text') ?? null;
const marks = (element: NphCheckbox) => [...(element.shadowRoot?.querySelectorAll<HTMLElement>('nph-icon') ?? [])];

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string) => Number.parseFloat(resolved('width', token));

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

/** WCAG relative luminance and contrast ratio, from computed `rgb()` colors. */
function channels(color: string): [number, number, number] {
  const [r = 0, g = 0, b = 0] = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  return [r, g, b];
}

function luminance(color: string): number {
  const [r, g, b] = channels(color).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** A color painted at an opacity over a background, as the browser composites it. */
function over(color: string, alpha: number, background: string): string {
  const [a, b] = [channels(color), channels(background)];
  return `rgb(${a.map((channel, index) => Math.round(channel * alpha + (b[index] ?? 0) * (1 - alpha))).join(', ')})`;
}

/** The items of a computed comma list; commas inside `cubic-bezier(...)` do not split. */
function listOf(value: string): string[] {
  return value.split(/,\s(?![^(]*\))/);
}

/** The node the browser itself builds for an element in its accessibility tree. */
async function axNode(element: Element): Promise<{ role: string; name: string; properties: Record<string, unknown> }> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    /* The tests run in a frame: look the element up through the DOM domain, piercing into it. */
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    const node = nodes[0];
    const properties = Object.fromEntries((node?.properties ?? []).map((property) => [String(property.name), property.value.value as unknown]));
    return { role: String(node?.role?.value ?? ''), name: String(node?.name?.value ?? ''), properties };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

/** Collects the events the host receives, in order. */
function record(element: HTMLElement, types: string[] = ['input', 'change']): Event[] {
  const events: Event[] = [];
  for (const type of types) {
    element.addEventListener(type, (event) => events.push(event));
  }
  return events;
}

describe('registration and API', () => {
  it('defines nph-checkbox only once', () => {
    expect(customElements.get('nph-checkbox')).toBe(NphCheckbox);
  });

  it('the reactive API is exactly the one in P81', () => {
    const declared = Object.keys(Object.fromEntries((NphCheckbox as unknown as { elementProperties: Map<string, unknown> }).elementProperties));
    expect(new Set(declared)).toEqual(new Set(['checked', 'indeterminate', 'invalid', 'disabled', 'text', 'label', 'name', 'value']));
  });

  it('name, value and form are accessors on the host, as on the native checkbox', () => {
    for (const name of ['checked', 'disabled', 'name', 'value', 'form']) {
      expect(Object.getOwnPropertyDescriptor(NphCheckbox.prototype, name)?.get, name).toBeTypeOf('function');
    }
    expect(Object.getOwnPropertyDescriptor(NphCheckbox.prototype, 'form')?.set).toBeUndefined();
  });

  it('the defaults are unchecked, determinate, valid and enabled, with value on', async () => {
    const element = await mount();
    expect([element.checked, element.indeterminate, element.invalid, element.disabled]).toEqual([false, false, false, false]);
    expect([element.name, element.value, element.label]).toEqual(['', 'on', '']);
    expect(NPH_CHECKBOX_DEFAULT_VALUE).toBe('on');
    expect(element.form).toBeNull();
  });

  it('invalid and disabled reflect; checked and indeterminate do not', async () => {
    const element = await mount({ text: 'Remember me', invalid: true, disabled: true, checked: true, indeterminate: true });
    expect(element.hasAttribute('invalid')).toBe(true);
    expect(element.hasAttribute('disabled')).toBe(true);
    expect(element.hasAttribute('checked')).toBe(false);
    expect(element.hasAttribute('indeterminate')).toBe(false);
  });

  it('name and value are the host attributes, set either way', async () => {
    const element = await mount({ text: 'News', name: 'news', value: 'yes' });
    expect(element.getAttribute('name')).toBe('news');
    expect(element.getAttribute('value')).toBe('yes');
    element.setAttribute('value', 'weekly');
    expect(element.value).toBe('weekly');
    element.removeAttribute('value');
    expect(element.value).toBe('on');
  });

  it('the attributes are checked, indeterminate, invalid, disabled, text and label', async () => {
    const holder = await parse('<nph-checkbox checked indeterminate invalid disabled text="Remember me" label="Remember"></nph-checkbox>');
    const element = holder.querySelector('nph-checkbox') as NphCheckbox;
    expect([element.checked, element.indeterminate, element.invalid, element.disabled]).toEqual([true, true, true, true]);
    expect([element.text, element.label]).toEqual(['Remember me', 'Remember']);
  });

  it('the marks are check and minus, and the field sees an option of a group (P83)', () => {
    expect(NPH_CHECKBOX_MARKS).toEqual(['check', 'minus']);
    expect(NphCheckbox.nphFieldRole).toBe('option');
  });

  it('is form-associated, with an open shadow root and delegated focus', async () => {
    const element = await mount();
    expect((NphCheckbox as unknown as { formAssociated?: boolean }).formAssociated).toBe(true);
    expect(element.shadowRoot?.mode).toBe('open');
    expect(element.shadowRoot?.delegatesFocus).toBe(true);
  });
});

describe('measures and anatomy', () => {
  it('the box is icon/size-sm square, with radius/inner and border/width in color/input', async () => {
    const element = await mount();
    const rect = box(element).getBoundingClientRect();
    expect([rect.width, rect.height]).toEqual([px('--nph-icon-size-sm'), px('--nph-icon-size-sm')]);
    const style = getComputedStyle(box(element));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-inner'));
    expect(style.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-color-input'));
  });

  it('the touch area is the box plus space/inline-tight on each side: 24 x 24 (D4)', async () => {
    const element = await mount();
    const style = getComputedStyle(target(element));
    for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
      expect(style[`padding${side}`]).toBe(resolved('padding-top', '--nph-space-inline-tight'));
    }
    const rect = target(element).getBoundingClientRect();
    const size = px('--nph-icon-size-sm') + 2 * px('--nph-space-inline-tight');
    expect([rect.width, rect.height]).toEqual([size, size]);
    expect(size).toBe(24);
  });

  it('the native input lies over the whole touch area, invisible', async () => {
    const element = await mount();
    const [area, native] = [target(element).getBoundingClientRect(), input(element).getBoundingClientRect()];
    expect([native.x, native.y, native.width, native.height]).toEqual([area.x, area.y, area.width, area.height]);
    expect(getComputedStyle(input(element)).opacity).toBe('0');
  });

  it('space/inline is measured from the edge of the touch area to the text (D5)', async () => {
    const element = await mount();
    const gap = (textOf(element)?.getBoundingClientRect().left ?? 0) - target(element).getBoundingClientRect().right;
    expect(gap).toBe(px('--nph-space-inline'));
  });

  it('without text, the piece is only the box, at 24 x 24', async () => {
    const element = await mount({ label: 'Select row' });
    expect(textOf(element)).toBeNull();
    const rect = element.getBoundingClientRect();
    expect([rect.width, rect.height]).toEqual([24, 24]);
  });

  it('the text uses the five properties of text/label-md and color/foreground', async () => {
    const element = await mount();
    const style = getComputedStyle(textOf(element) as HTMLElement);
    expect(style.fontFamily).toBe(resolved('font-family', '--nph-text-label-md-font-family'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-text-label-md-line-height'));
    expect(style.letterSpacing).toBe(resolved('letter-spacing', '--nph-text-label-md-letter-spacing'));
    expect(style.color).toBe(resolved('color', '--nph-color-foreground'));
  });

  it('with text that wraps, the box sits at the top, centered on the first line (D5)', async () => {
    const holder = document.createElement('div');
    holder.style.inlineSize = '10rem';
    document.body.append(holder);
    const element = await mount({ text: 'I agree to receive the monthly newsletter and occasional product news' }, holder);
    const text = textOf(element) as HTMLElement;
    const lineHeight = px('--nph-text-label-md-line-height');
    const textRect = text.getBoundingClientRect();
    expect(textRect.height).toBeGreaterThan(2 * lineHeight);
    const area = target(element).getBoundingClientRect();
    expect(area.top).toBe(element.getBoundingClientRect().top);
    const firstLineCenter = textRect.top + Number.parseFloat(getComputedStyle(text).paddingTop) + lineHeight / 2;
    expect(firstLineCenter).toBeCloseTo(area.top + area.height / 2, 3);
    /* The piece stays inside its container. */
    expect(element.getBoundingClientRect().width).toBeLessThanOrEqual(holder.getBoundingClientRect().width);
  });

  it('the marks are centered on the box', async () => {
    const element = await mount({ text: 'Remember me', checked: true });
    const center = (rect: DOMRect): [number, number] => [rect.left + rect.width / 2, rect.top + rect.height / 2];
    const [boxX, boxY] = center(box(element).getBoundingClientRect());
    for (const mark of marks(element)) {
      const [x, y] = center(mark.getBoundingClientRect());
      expect(x).toBeCloseTo(boxX, 3);
      expect(y).toBeCloseTo(boxY, 3);
    }
  });

  it('the marks are nph-icon check and minus in icon/size-sm, light, decorative', async () => {
    const element = await mount();
    expect(marks(element).map((mark) => mark.getAttribute('name'))).toEqual(['check', 'minus']);
    for (const mark of marks(element)) {
      expect(mark.getAttribute('size')).toBe('sm');
      expect(mark.hasAttribute('variant')).toBe(false);
      expect(mark.hasAttribute('label')).toBe(false);
      expect(mark.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });

  it('unchecked shows no mark, checked shows check, indeterminate shows minus whatever checked is', async () => {
    const element = await mount();
    const visible = () => marks(element).map((mark) => getComputedStyle(mark).opacity);
    expect(visible()).toEqual(['0', '0']);
    element.checked = true;
    await element.updateComplete;
    await vi.waitFor(() => expect(visible()).toEqual(['1', '0']));
    element.indeterminate = true;
    await element.updateComplete;
    await vi.waitFor(() => expect(visible()).toEqual(['0', '1']));
    element.checked = false;
    await element.updateComplete;
    await vi.waitFor(() => expect(visible()).toEqual(['0', '1']));
  });

  it('the mark is color/primary-foreground (currentColor of the box)', async () => {
    const element = await mount({ text: 'Remember me', checked: true });
    expect(getComputedStyle(box(element)).color).toBe(resolved('color', '--nph-color-primary-foreground'));
    for (const mark of marks(element)) {
      expect(getComputedStyle(mark).color).toBe(resolved('color', '--nph-color-primary-foreground'));
    }
  });

  it('the host is an inline box that takes no space without a valid input', async () => {
    const element = await mount();
    expect(getComputedStyle(element).display).toBe('inline-flex');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const empty = await mount({});
    expect(getComputedStyle(empty).display).toBe('none');
  });
});

describe('colors of each state, in both schemes (D2)', () => {
  for (const scheme of ['light', 'dark'] as const) {
    for (const marked of ['unchecked', 'checked', 'indeterminate'] as const) {
      const props: Props = { text: 'Remember me', checked: marked === 'checked', indeterminate: marked === 'indeterminate' };
      const fill = marked === 'unchecked' ? '--nph-color-background' : '--nph-color-primary';

      it(`${scheme} · ${marked}: at rest, the fill, the color/input border and the text`, async () => {
        document.documentElement.setAttribute('data-nph-color-scheme', scheme);
        const element = await mount(props);
        await vi.waitFor(() => {
          const style = getComputedStyle(box(element));
          expect(style.backgroundColor).toBe(resolved('background-color', fill));
          expect(style.borderTopColor).toBe(resolved('color', '--nph-color-input'));
          expect(style.opacity).toBe('1');
        });
        expect(getComputedStyle(textOf(element) as HTMLElement).color).toBe(resolved('color', '--nph-color-foreground'));
      });

      it(`${scheme} · ${marked}: on hover, the border is color/input-hover${marked === 'unchecked' ? '' : ' and the box takes state/hover-opacity'}`, async () => {
        document.documentElement.setAttribute('data-nph-color-scheme', scheme);
        const element = await mount(props);
        await userEvent.hover(textOf(element) as HTMLElement);
        await vi.waitFor(() => {
          const style = getComputedStyle(box(element));
          expect(style.borderTopColor).toBe(resolved('color', '--nph-color-input-hover'));
          expect(style.backgroundColor).toBe(resolved('background-color', fill));
          expect(style.opacity).toBe(marked === 'unchecked' ? '1' : resolved('opacity', '--nph-state-hover-opacity'));
        });
        /* D7 default: the opacity is on the box only, not on the text. */
        expect(getComputedStyle(textOf(element) as HTMLElement).color).toBe(resolved('color', '--nph-color-foreground'));
        expect(getComputedStyle(element).opacity).toBe('1');
      });

      it(`${scheme} · ${marked}: invalid, the border is status/error, at rest and on hover`, async () => {
        document.documentElement.setAttribute('data-nph-color-scheme', scheme);
        const element = await mount({ ...props, invalid: true });
        await vi.waitFor(() => expect(getComputedStyle(box(element)).borderTopColor).toBe(resolved('color', '--nph-status-error')));
        await userEvent.hover(box(element));
        await vi.waitFor(() => expect(getComputedStyle(box(element)).borderTopColor).toBe(resolved('color', '--nph-status-error')));
      });

      it(`${scheme} · ${marked}: disabled, the whole piece at state/disabled-opacity, in the resting colors`, async () => {
        document.documentElement.setAttribute('data-nph-color-scheme', scheme);
        const element = await mount({ ...props, disabled: true });
        expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
        await userEvent.hover(textOf(element) as HTMLElement, { force: true });
        await vi.waitFor(() => {
          const style = getComputedStyle(box(element));
          expect(style.borderTopColor).toBe(resolved('color', '--nph-color-input'));
          expect(style.backgroundColor).toBe(resolved('background-color', fill));
          expect(style.opacity).toBe('1');
        });
        expect(getComputedStyle(textOf(element) as HTMLElement).color).toBe(resolved('color', '--nph-color-foreground'));
      });
    }
  }

  it('the hover area is the whole piece: the text too, and the gap between box and text', async () => {
    const element = await mount();
    await userEvent.hover(textOf(element) as HTMLElement);
    await vi.waitFor(() => expect(getComputedStyle(box(element)).borderTopColor).toBe(resolved('color', '--nph-color-input-hover')));
    await userEvent.unhover(element);
    await vi.waitFor(() => expect(getComputedStyle(box(element)).borderTopColor).toBe(resolved('color', '--nph-color-input')));
  });

  it('with another brand and the dark scheme on the same element, the checked fill is the local color/primary (P67)', async () => {
    const area = scope();
    const element = await mount({ text: 'Remember me', checked: true }, area);
    const local = resolved('background-color', '--nph-color-primary', area);
    expect(local).not.toBe(resolved('background-color', '--nph-color-primary'));
    await vi.waitFor(() => expect(getComputedStyle(box(element)).backgroundColor).toBe(local));
  });

  it('checking it from code changes the fill to color/primary', async () => {
    const element = await mount();
    element.checked = true;
    await element.updateComplete;
    await vi.waitFor(() => expect(getComputedStyle(box(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary')));
  });
});

describe('focus (D3)', () => {
  async function focused(props: Props, parent: HTMLElement = document.body): Promise<NphCheckbox> {
    const before = document.createElement('input');
    parent.append(before);
    const element = await mount(props, parent);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement).toBe(input(element));
    return element;
  }

  const halo = (element: NphCheckbox) => getComputedStyle(box(element), '::after');

  it('Tab turns the box border focus/border and draws the focus/halo band over the 24 x 24 touch area', async () => {
    const element = await focused({ text: 'Remember me' });
    await vi.waitFor(() => expect(getComputedStyle(box(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border')));
    expect(getComputedStyle(box(element)).borderTopWidth).toBe(resolved('width', '--nph-border-width'));
    const band = halo(element);
    expect(band.display).toBe('block');
    expect(band.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(band.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
    expect(band.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-inner'));
    /* The halo fills the touch area exactly: the box plus focus/ring-width on each side. */
    expect([Number.parseFloat(band.width), Number.parseFloat(band.height)]).toEqual([24, 24]);
    expect(px('--nph-icon-size-sm') + 2 * px('--nph-focus-ring-width')).toBe(24);
  });

  it('the halo radius is radius/inner plus focus/ring-width', () => {
    expect(px('--nph-focus-radius-inner')).toBe(Number.parseFloat(resolved('border-top-left-radius', '--nph-radius-inner')) + px('--nph-focus-ring-width'));
  });

  it('checked and indeterminate have the same focus pair', async () => {
    for (const props of [{ checked: true }, { indeterminate: true }]) {
      const element = await focused({ text: 'Remember me', ...props });
      await vi.waitFor(() => expect(getComputedStyle(box(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border')));
      expect(halo(element).borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
      document.body.replaceChildren();
    }
  });

  it('focus wins over hover', async () => {
    const element = await focused({ text: 'Remember me' });
    await userEvent.hover(textOf(element) as HTMLElement);
    await vi.waitFor(() => expect(getComputedStyle(box(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border')));
  });

  it('invalid with focus: the border stays status/error and the halo is focus/halo-error', async () => {
    const element = await focused({ text: 'Remember me', invalid: true });
    await vi.waitFor(() => expect(getComputedStyle(box(element)).borderTopColor).toBe(resolved('color', '--nph-status-error')));
    expect(halo(element).borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
  });

  it('the piece without text has the same focus pair', async () => {
    const element = await focused({ label: 'Select row' });
    expect(halo(element).display).toBe('block');
    expect(Number.parseFloat(halo(element).width)).toBe(24);
  });

  it('with another brand and another scheme on the same element, the border and halo are the local ones (P67)', async () => {
    const area = scope();
    const element = await focused({ text: 'Remember me' }, area);
    const local = resolved('color', '--nph-focus-halo', area);
    expect(local).not.toBe(resolved('color', '--nph-focus-halo'));
    expect(halo(element).borderTopColor).toBe(local);
    await vi.waitFor(() => expect(getComputedStyle(box(element)).borderTopColor).toBe(resolved('color', '--nph-focus-border', area)));
  });

  it('a mouse click draws no halo', async () => {
    const element = await mount();
    await userEvent.click(box(element));
    expect(halo(element).display).toBe('none');
  });

  it('host focus goes to the native input, and disabled leaves the Tab order', async () => {
    const element = await mount();
    element.focus();
    expect(element.shadowRoot?.activeElement).toBe(input(element));
    element.blur();
    element.disabled = true;
    await element.updateComplete;
    const before = document.createElement('input');
    const after = document.createElement('input');
    document.body.prepend(before);
    document.body.append(after);
    before.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(after);
  });
});

describe('toggle and events', () => {
  it('a click on the box toggles checked and fires one input and one change, in that order', async () => {
    const element = await mount();
    const events = record(element);
    await userEvent.click(box(element));
    expect(element.checked).toBe(true);
    expect(events.map((event) => event.type)).toEqual(['input', 'change']);
    await userEvent.click(box(element));
    expect(element.checked).toBe(false);
    expect(events).toHaveLength(4);
  });

  it('a click on the text toggles too: the text is part of the click area', async () => {
    const element = await mount();
    await userEvent.click(textOf(element) as HTMLElement);
    expect(element.checked).toBe(true);
  });

  it('Space toggles; Enter does not, as on the native checkbox', async () => {
    const element = await mount();
    const events = record(element);
    element.focus();
    await userEvent.keyboard(' ');
    expect(element.checked).toBe(true);
    await userEvent.keyboard('{Enter}');
    expect(element.checked).toBe(true);
    expect(events.map((event) => event.type)).toEqual(['input', 'change']);
  });

  it('input is the native event of the inner input, crossing the shadow root; change is fired by the host', async () => {
    const element = await mount();
    const origins: Array<[string, EventTarget | undefined]> = [];
    for (const type of ['input', 'change']) {
      element.addEventListener(type, (event) => origins.push([event.type, event.composedPath()[0]]));
    }
    const events = record(element);
    await userEvent.click(box(element));
    const [inputEvent, changeEvent] = events as [Event, Event];
    expect(inputEvent.composed).toBe(true);
    expect(inputEvent.bubbles).toBe(true);
    expect(changeEvent.bubbles).toBe(true);
    expect(changeEvent.composed).toBe(false);
    expect(changeEvent.cancelable).toBe(false);
    expect(changeEvent).not.toBeInstanceOf(CustomEvent);
    expect(origins).toEqual([
      ['input', input(element)],
      ['change', element],
    ]);
  });

  it('the state has already moved when each event reaches the host', async () => {
    const element = await mount();
    const seen: boolean[] = [];
    element.addEventListener('input', () => seen.push(element.checked));
    element.addEventListener('change', () => seen.push(element.checked));
    await userEvent.click(box(element));
    expect(seen).toEqual([true, true]);
  });

  it('both events bubble to an ancestor, and change crosses no shadow root', async () => {
    const element = await mount();
    const types: string[] = [];
    document.body.addEventListener('input', (event) => types.push(event.type));
    document.body.addEventListener('change', (event) => types.push(event.type));
    await userEvent.click(box(element));
    expect(types).toEqual(['input', 'change']);
  });

  it('a click from the person on indeterminate checks it and clears indeterminate', async () => {
    const element = await mount({ text: 'All files', indeterminate: true });
    await userEvent.click(box(element));
    expect([element.checked, element.indeterminate]).toEqual([true, false]);
    expect(input(element).indeterminate).toBe(false);
  });

  it('click() called on the host toggles and fires the events, once', async () => {
    const element = await mount();
    const events = record(element);
    element.click();
    await element.updateComplete;
    expect(element.checked).toBe(true);
    expect(events.map((event) => event.type)).toEqual(['input', 'change']);
  });

  it('checked set from code and a click right after, before the render, toggle from the new state', async () => {
    const element = await mount();
    element.checked = true;
    element.click();
    expect(element.checked).toBe(false);
    await element.updateComplete;
    expect(input(element).checked).toBe(false);
  });

  it('a listener of the consumer in capture on the host already reads the new state, even if it stops the event', async () => {
    const holder = await parse('<form><nph-checkbox name="news" text="News"></nph-checkbox></form>');
    const form = holder.querySelector('form') as HTMLFormElement;
    const element = form.querySelector('nph-checkbox') as NphCheckbox;
    const seen: Array<[boolean, string | null]> = [];
    element.addEventListener(
      'input',
      (event) => {
        seen.push([element.checked, new FormData(form).get('news') as string | null]);
        event.stopPropagation();
      },
      { capture: true },
    );
    await userEvent.click(box(element));
    expect(seen).toEqual([[true, 'on']]);
    expect(element.checked).toBe(true);
    expect(input(element).checked).toBe(true);
  });

  it('a click already canceled in capture is not forwarded: no toggle and no event', async () => {
    const element = await mount();
    const events = record(element);
    element.addEventListener('click', (event) => event.preventDefault(), { capture: true, once: true });
    element.click();
    expect(element.checked).toBe(false);
    expect(events).toHaveLength(0);
    element.click();
    expect(element.checked).toBe(true);
  });

  it('click() on the host dispatches exactly one click, on the host and on an ancestor', async () => {
    const element = await mount();
    const onHost = record(element, ['click']);
    const onBody: Event[] = [];
    document.body.addEventListener('click', (event) => onBody.push(event));
    element.click();
    expect(onHost).toHaveLength(1);
    expect(onBody).toHaveLength(1);
    expect(onHost[0]?.cancelable).toBe(true);
    expect(element.checked).toBe(true);
  });

  it('click() canceled in bubbling by an ancestor neither toggles nor fires input or change', async () => {
    const element = await mount();
    const events = record(element);
    const cancel = (event: Event): void => {
      if (event.composedPath()[0] === element) event.preventDefault();
    };
    document.body.addEventListener('click', cancel);
    element.click();
    expect(element.checked).toBe(false);
    expect(events).toHaveLength(0);
    document.body.removeEventListener('click', cancel);
    element.click();
    expect(element.checked).toBe(true);
    expect(events.map((event) => event.type)).toEqual(['input', 'change']);
  });

  it('when an ancestor stops input in capture, change still carries the new state', async () => {
    const holder = await parse('<form><nph-checkbox name="news" text="News"></nph-checkbox></form>');
    const form = holder.querySelector('form') as HTMLFormElement;
    const element = form.querySelector('nph-checkbox') as NphCheckbox;
    form.addEventListener('input', (event) => event.stopPropagation(), { capture: true });
    const seen: Array<[boolean, boolean, string | null]> = [];
    form.addEventListener('change', () => seen.push([element.checked, element.indeterminate, new FormData(form).get('news') as string | null]));
    element.indeterminate = true;
    await element.updateComplete;
    await userEvent.click(box(element));
    expect(seen).toEqual([[true, false, 'on']]);
  });

  it('a change made by a consumer in an input listener is kept when change arrives', async () => {
    const element = await mount();
    element.addEventListener('input', () => {
      element.checked = false;
    });
    const seen: boolean[] = [];
    element.addEventListener('change', () => seen.push(element.checked));
    await userEvent.click(box(element));
    expect(seen).toEqual([false]);
    expect(input(element).checked).toBe(false);
  });

  it('a <label for> outside dispatches a single click on the host', async () => {
    const holder = await parse('<label for="single">Terms</label><nph-checkbox id="single" text="I agree"></nph-checkbox>');
    const element = holder.querySelector('nph-checkbox') as NphCheckbox;
    const clicks = record(element, ['click']);
    await userEvent.click(holder.querySelector('label') as HTMLElement);
    expect(clicks).toHaveLength(1);
    expect(element.checked).toBe(true);
  });

  it('a <label for> outside toggles the host once', async () => {
    const holder = await parse('<label for="terms">Terms</label><nph-checkbox id="terms" text="I agree"></nph-checkbox>');
    const element = holder.querySelector('nph-checkbox') as NphCheckbox;
    const events = record(element);
    await userEvent.click(holder.querySelector('label') as HTMLElement);
    expect(element.checked).toBe(true);
    expect(events.map((event) => event.type)).toEqual(['input', 'change']);
  });

  it('setting checked or indeterminate from code, by property or attribute, never fires an event', async () => {
    const element = await mount();
    const events = record(element);
    element.checked = true;
    element.indeterminate = true;
    await element.updateComplete;
    element.setAttribute('indeterminate', '');
    element.checked = false;
    await element.updateComplete;
    expect(events).toHaveLength(0);
  });

  it('a piece that starts checked fires nothing at mount', async () => {
    const events: Event[] = [];
    document.body.addEventListener('change', (event) => events.push(event));
    document.body.addEventListener('input', (event) => events.push(event));
    await parse('<nph-checkbox checked text="Remember me"></nph-checkbox>');
    expect(events).toHaveLength(0);
  });

  it('the native click still reaches the consumer', async () => {
    const element = await mount();
    const clicks = record(element, ['click']);
    await userEvent.click(box(element));
    expect(clicks.length).toBeGreaterThanOrEqual(1);
  });
});

describe('default and current state (dirty flag)', () => {
  it('the checked attribute is the default state: the piece starts checked', async () => {
    const holder = await parse('<nph-checkbox checked text="Remember me"></nph-checkbox>');
    expect((holder.querySelector('nph-checkbox') as NphCheckbox).checked).toBe(true);
  });

  it('before any change, the attribute moves the current state', async () => {
    const element = await mount();
    element.setAttribute('checked', '');
    await element.updateComplete;
    expect(element.checked).toBe(true);
    element.removeAttribute('checked');
    await element.updateComplete;
    expect(element.checked).toBe(false);
  });

  it('after a toggle of the person, the attribute no longer moves the current state', async () => {
    const element = await mount();
    await userEvent.click(box(element));
    element.removeAttribute('checked');
    element.setAttribute('checked', '');
    element.removeAttribute('checked');
    await element.updateComplete;
    expect(element.checked).toBe(true);
  });

  it('after checked is set from code, the attribute no longer moves the current state', async () => {
    const element = await mount();
    element.checked = false;
    element.setAttribute('checked', '');
    await element.updateComplete;
    expect(element.checked).toBe(false);
  });

  it('the toggle never writes the checked attribute', async () => {
    const element = await mount();
    await userEvent.click(box(element));
    expect(element.hasAttribute('checked')).toBe(false);
  });
});

describe('accessible name and state', () => {
  it('the inner control is a native checkbox, the only focusable element', async () => {
    const element = await mount();
    expect(input(element).type).toBe('checkbox');
    expect(element.shadowRoot?.querySelectorAll('input, button, [tabindex]')).toHaveLength(1);
  });

  it('with text, the name is the text and there is no aria-label', async () => {
    const element = await mount({ text: '  Remember me  ' });
    expect(input(element).hasAttribute('aria-label')).toBe(false);
    expect(textOf(element)?.textContent).toBe('Remember me');
    const node = await axNode(input(element));
    expect(node.role).toBe('checkbox');
    expect(node.name).toBe('Remember me');
  });

  it('without text, the name comes from label, as aria-label on the inner input', async () => {
    const element = await mount({ label: 'Select row' });
    expect(input(element).getAttribute('aria-label')).toBe('Select row');
    expect((await axNode(input(element))).name).toBe('Select row');
  });

  it('a text of only spaces counts as no text: the piece is only the box', async () => {
    const element = await mount({ text: '   ', label: 'Select row' });
    expect(textOf(element)).toBeNull();
    expect(input(element).getAttribute('aria-label')).toBe('Select row');
  });

  it('the browser exposes unchecked, checked and mixed', async () => {
    const element = await mount();
    expect((await axNode(input(element))).properties.checked).toBe('false');
    element.checked = true;
    await element.updateComplete;
    expect((await axNode(input(element))).properties.checked).toBe('true');
    element.indeterminate = true;
    await element.updateComplete;
    expect((await axNode(input(element))).properties.checked).toBe('mixed');
  });

  it('invalid adds aria-invalid on the inner input; valid and disabled do not', async () => {
    const element = await mount({ text: 'Remember me', invalid: true });
    expect(input(element).getAttribute('aria-invalid')).toBe('true');
    expect((await axNode(input(element))).properties.invalid).toBe('true');
    element.invalid = false;
    await element.updateComplete;
    expect(input(element).hasAttribute('aria-invalid')).toBe(false);
  });

  it('the box and the marks stay out of the accessibility tree', async () => {
    const element = await mount({ text: 'Remember me', checked: true });
    expect(box(element).getAttribute('aria-hidden')).toBe('true');
  });

  it('removed or undefined text and label do not break the render', async () => {
    const element = await mount({ text: 'Remember me' });
    element.removeAttribute('text');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    element.text = undefined as unknown as string;
    element.label = 'Remember';
    await element.updateComplete;
    expect(input(element).getAttribute('aria-label')).toBe('Remember');
  });
});

describe('disabled', () => {
  it('does not toggle, fires nothing and blocks the click', async () => {
    const element = await mount({ text: 'Remember me', disabled: true });
    const events = record(element, ['input', 'change', 'click']);
    await userEvent.click(box(element), { force: true });
    element.click();
    await element.updateComplete;
    expect(element.checked).toBe(false);
    expect(events).toHaveLength(0);
    expect(input(element).disabled).toBe(true);
  });

  it('the host matches :disabled', async () => {
    const element = await mount({ text: 'Remember me', disabled: true });
    expect(element.matches(':disabled')).toBe(true);
  });

  it('disabled wins over invalid: no error border and no aria-invalid', async () => {
    const element = await mount({ text: 'Remember me', invalid: true, disabled: true });
    expect(getComputedStyle(box(element)).borderTopColor).toBe(resolved('color', '--nph-color-input'));
    expect(input(element).hasAttribute('aria-invalid')).toBe(false);
  });

  it('the disabled property sets the attribute at once, so the host matches :disabled before the update', async () => {
    const element = await mount();
    element.disabled = true;
    expect(element.hasAttribute('disabled')).toBe(true);
    expect(element.matches(':disabled')).toBe(true);
    element.disabled = false;
    expect(element.matches(':disabled')).toBe(false);
  });

  it('inside a disabled fieldset, removing its own disabled keeps the piece disabled', async () => {
    const holder = await parse('<fieldset disabled><nph-checkbox disabled text="News"></nph-checkbox></fieldset>');
    const element = holder.querySelector('nph-checkbox') as NphCheckbox;
    element.disabled = false;
    await element.updateComplete;
    expect(element.matches(':disabled')).toBe(true);
    expect(input(element).disabled).toBe(true);
  });

  it('enabled again, a click right after toggles, before the render', async () => {
    const element = await mount({ text: 'Remember me', disabled: true });
    element.disabled = false;
    element.click();
    expect(element.checked).toBe(true);
  });

  it('a fieldset enabled again lets a click right after toggle, before the render', async () => {
    const holder = await parse('<fieldset disabled><nph-checkbox text="News"></nph-checkbox></fieldset>');
    const element = holder.querySelector('nph-checkbox') as NphCheckbox;
    (holder.querySelector('fieldset') as HTMLFieldSetElement).disabled = false;
    element.click();
    expect(element.checked).toBe(true);
  });

  it('enabling it again brings back the toggle', async () => {
    const element = await mount({ text: 'Remember me', disabled: true });
    element.disabled = false;
    await element.updateComplete;
    await userEvent.click(box(element));
    expect(element.checked).toBe(true);
    expect(getComputedStyle(element).opacity).toBe('1');
  });
});

describe('form participation', () => {
  async function inForm(markup: string): Promise<{ form: HTMLFormElement; element: NphCheckbox }> {
    const holder = await parse(`<form>${markup}</form>`);
    const form = holder.querySelector('form') as HTMLFormElement;
    return { form, element: form.querySelector('nph-checkbox') as NphCheckbox };
  }

  it('a checked piece submits name=value; unchecked, nothing', async () => {
    const { form, element } = await inForm('<nph-checkbox name="news" value="yes" text="News"></nph-checkbox>');
    expect(new FormData(form).has('news')).toBe(false);
    await userEvent.click(box(element));
    expect(new FormData(form).getAll('news')).toEqual(['yes']);
  });

  it('the form data has already moved when input and change reach a listener', async () => {
    const { form, element } = await inForm('<nph-checkbox name="news" text="News"></nph-checkbox>');
    const seen: string[] = [];
    form.addEventListener('input', () => seen.push(String(new FormData(form).get('news'))));
    form.addEventListener('change', () => seen.push(String(new FormData(form).get('news'))));
    element.click();
    expect(seen).toEqual(['on', 'on']);
  });

  it('checked set from code reaches the form data at once, before the render', async () => {
    const { form, element } = await inForm('<nph-checkbox name="news" text="News"></nph-checkbox>');
    element.checked = true;
    expect(new FormData(form).get('news')).toBe('on');
  });

  it('without the value attribute, the value submitted is on', async () => {
    const { form } = await inForm('<nph-checkbox name="news" checked text="News"></nph-checkbox>');
    expect(new FormData(form).get('news')).toBe('on');
  });

  it('name and value set by property reach the form data', async () => {
    const { form, element } = await inForm('<nph-checkbox checked text="News"></nph-checkbox>');
    element.name = 'news';
    element.value = 'weekly';
    await element.updateComplete;
    expect(new FormData(form).get('news')).toBe('weekly');
  });

  it('indeterminate does not change what is submitted', async () => {
    const { form, element } = await inForm('<nph-checkbox name="all" text="All"></nph-checkbox>');
    element.indeterminate = true;
    await element.updateComplete;
    expect(new FormData(form).has('all')).toBe(false);
    element.checked = true;
    await element.updateComplete;
    expect(new FormData(form).get('all')).toBe('on');
  });

  it('a disabled piece submits nothing', async () => {
    const { form } = await inForm('<nph-checkbox name="news" checked disabled text="News"></nph-checkbox>');
    expect(new FormData(form).has('news')).toBe(false);
  });

  it('the host is in form.elements and form returns its form', async () => {
    const { form, element } = await inForm('<nph-checkbox name="news" text="News"></nph-checkbox>');
    expect([...form.elements]).toContain(element);
    expect(element.form).toBe(form);
  });

  it('form.reset() goes back to the checked attribute and clears indeterminate and the dirty flag', async () => {
    const { form, element } = await inForm('<nph-checkbox name="news" checked text="News"></nph-checkbox>');
    await userEvent.click(box(element));
    element.indeterminate = true;
    expect(element.checked).toBe(false);
    form.reset();
    await element.updateComplete;
    expect([element.checked, element.indeterminate]).toEqual([true, false]);
    expect(new FormData(form).get('news')).toBe('on');
    /* Clean again: the attribute moves the state. */
    element.removeAttribute('checked');
    await element.updateComplete;
    expect(element.checked).toBe(false);
  });

  it('a reset fires no event', async () => {
    const { form, element } = await inForm('<nph-checkbox name="news" checked text="News"></nph-checkbox>');
    element.checked = false;
    const events = record(element);
    form.reset();
    await element.updateComplete;
    expect(events).toHaveLength(0);
  });

  it('a disabled fieldset disables the piece, and enabling it brings it back', async () => {
    const holder = await parse('<form><fieldset disabled><nph-checkbox name="news" checked text="News"></nph-checkbox></fieldset></form>');
    const fieldset = holder.querySelector('fieldset') as HTMLFieldSetElement;
    const element = holder.querySelector('nph-checkbox') as NphCheckbox;
    await element.updateComplete;
    expect(element.matches(':disabled')).toBe(true);
    expect(input(element).disabled).toBe(true);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(new FormData(holder.querySelector('form') as HTMLFormElement).has('news')).toBe(false);
    element.click();
    expect(element.checked).toBe(true);
    fieldset.disabled = false;
    await element.updateComplete;
    expect(input(element).disabled).toBe(false);
    await userEvent.click(box(element));
    expect(element.checked).toBe(false);
  });

  it('invalid does not block the submission: there is no constraint validation', async () => {
    const { form, element } = await inForm('<nph-checkbox name="news" invalid text="News"></nph-checkbox>');
    expect(form.checkValidity()).toBe(true);
    expect(element.hasAttribute('required')).toBe(false);
  });

  it('a checked piece that loses its text and has no label draws nothing and submits nothing, until it is valid again', async () => {
    const { form, element } = await inForm('<nph-checkbox name="news" checked text="News"></nph-checkbox>');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    element.text = '';
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(new FormData(form).has('news')).toBe(false);
    element.label = 'News';
    await element.updateComplete;
    expect(new FormData(form).get('news')).toBe('on');
  });

  it('name, value and checked set before the element is defined are taken at the upgrade', async () => {
    const tag = 'late-nph-checkbox';
    const holder = await parse('<form></form>');
    const form = holder.querySelector('form') as HTMLFormElement;
    const late = document.createElement(tag) as unknown as Record<string, unknown> & HTMLElement;
    late.text = 'News';
    late.name = 'news';
    late.value = 'weekly';
    late.checked = true;
    form.append(late);
    customElements.define(tag, class extends NphCheckbox {});
    await (late as unknown as NphCheckbox).updateComplete;
    expect(late.getAttribute('name')).toBe('news');
    expect(late.getAttribute('value')).toBe('weekly');
    expect(new FormData(form).get('news')).toBe('weekly');
  });

  it('state restoration brings back the checked state', async () => {
    const element = await mount();
    element.formStateRestoreCallback('checked');
    await element.updateComplete;
    expect(element.checked).toBe(true);
    element.formStateRestoreCallback('unchecked');
    await element.updateComplete;
    expect(element.checked).toBe(false);
  });
});

describe('inside nph-field (the field contract, P83)', () => {
  async function inField(attributes: string, boxes = 3): Promise<{ field: HTMLElement & { updateComplete: Promise<unknown> }; pieces: NphCheckbox[] }> {
    await import('../nph-field/nph-field');
    const items = Array.from({ length: boxes }, (_, index) => `<nph-checkbox text="Option ${index + 1}"></nph-checkbox>`).join('');
    const holder = await parse(`<nph-field label="Notifications" ${attributes}>${items}</nph-field>`);
    const field = holder.querySelector('nph-field') as HTMLElement & { updateComplete: Promise<unknown> };
    await field.updateComplete;
    const pieces = [...holder.querySelectorAll('nph-checkbox')] as NphCheckbox[];
    await Promise.all(pieces.map((piece) => piece.updateComplete));
    return { field, pieces };
  }

  it('the field wraps the boxes in a group named by its label, and writes no label on a box', async () => {
    const { field, pieces } = await inField('');
    const group = field.shadowRoot?.querySelector('[role="group"]');
    expect(group?.getAttribute('aria-label')).toBe('Notifications');
    for (const piece of pieces) {
      expect(piece.label).toBe('');
      expect(textOf(piece)).not.toBeNull();
    }
  });

  it('an error on the field makes every box invalid, with aria-invalid; clearing it gives the state back', async () => {
    const { field, pieces } = await inField('error="Choose at least one channel."');
    for (const piece of pieces) {
      expect(piece.invalid).toBe(true);
      expect(input(piece).getAttribute('aria-invalid')).toBe('true');
    }
    field.removeAttribute('error');
    await field.updateComplete;
    await Promise.all(pieces.map((piece) => piece.updateComplete));
    expect(pieces.map((piece) => piece.invalid)).toEqual([false, false, false]);
  });

  it('a disabled field disables every box, which draws its own opacity, and enabling it gives them back', async () => {
    const { field, pieces } = await inField('disabled');
    for (const piece of pieces) {
      expect(piece.matches(':disabled')).toBe(true);
      expect(input(piece).disabled).toBe(true);
      expect(getComputedStyle(piece).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    }
    expect(getComputedStyle(field).opacity).toBe('1');
    field.removeAttribute('disabled');
    await field.updateComplete;
    await Promise.all(pieces.map((piece) => piece.updateComplete));
    expect(pieces.map((piece) => piece.disabled)).toEqual([false, false, false]);
  });

  it('a box the consumer disabled stays disabled after the field is enabled again', async () => {
    const { field, pieces } = await inField('');
    const own = pieces[1] as NphCheckbox;
    own.disabled = true;
    field.setAttribute('disabled', '');
    await field.updateComplete;
    field.removeAttribute('disabled');
    await field.updateComplete;
    expect(own.disabled).toBe(true);
    expect(pieces[0]?.disabled).toBe(false);
  });

  it('the boxes still toggle and submit inside the field', async () => {
    await import('../nph-field/nph-field');
    const holder = await parse('<form><nph-field label="Channels"><nph-checkbox name="channel" value="email" text="Email"></nph-checkbox></nph-field></form>');
    const piece = holder.querySelector('nph-checkbox') as NphCheckbox;
    await userEvent.click(box(piece));
    expect(new FormData(holder.querySelector('form') as HTMLFormElement).get('channel')).toBe('email');
  });
});

describe('invalid input', () => {
  const cases: ReadonlyArray<readonly [string, Props]> = [
    ['no text and no label', {}],
    ['spaces only in text and no label', { text: '   ' }],
    ['spaces only in label and no text', { label: '   ' }],
  ];

  for (const [name, props] of cases) {
    it(`${name}: nothing and one error in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const element = await mount(props);
      expect(element.shadowRoot?.childElementCount).toBe(0);
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect(element.getBoundingClientRect().width).toBe(0);
      expect(error).toHaveBeenCalledTimes(1);
      expect(String(error.mock.calls[0]?.[0])).toMatch(/^\[nph-checkbox\]/);
    });
  }

  it('a valid input draws and emits no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await mount({ text: 'Remember me' });
    await mount({ label: 'Select row' });
    expect(error).not.toHaveBeenCalled();
  });

  it('an invalid piece does not toggle from click()', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({});
    const events = record(element);
    element.click();
    expect(element.checked).toBe(false);
    expect(events).toHaveLength(0);
  });

  it('changing the state does not repeat the error, and a valid input set later draws the piece', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({});
    element.checked = true;
    element.invalid = true;
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
    element.text = 'Remember me';
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(input(element).checked).toBe(true);
  });
});

describe('motion', () => {
  const animated = (element: NphCheckbox): HTMLElement[] => [box(element), ...marks(element)];

  it('every change runs on the state duration and easing, as a pair', async () => {
    const element = await mount();
    const duration = resolved('transition-duration', '--nph-motion-state-duration');
    const easing = resolved('transition-timing-function', '--nph-motion-state-easing');
    expect(duration).not.toBe('0s');
    for (const item of animated(element)) {
      const style = getComputedStyle(item);
      expect(listOf(style.transitionDuration).every((value) => value === duration)).toBe(true);
      expect(listOf(style.transitionTimingFunction).every((value) => value === easing)).toBe(true);
    }
  });

  it('the box animates its fill, border and opacity; the marks their opacity', async () => {
    const element = await mount();
    expect(getComputedStyle(box(element)).transitionProperty).toBe('background-color, border-color, opacity');
    for (const mark of marks(element)) {
      expect(getComputedStyle(mark).transitionProperty).toBe('opacity');
    }
  });

  it('width, height and position are never animated, and checking does not move the piece', async () => {
    const element = await mount();
    for (const item of animated(element)) {
      expect(getComputedStyle(item).transitionProperty).not.toMatch(/\ball\b|width|height|inline-size|block-size|top|left|right|bottom|inset|transform|margin|padding/);
    }
    const before = element.getBoundingClientRect();
    element.checked = true;
    element.indeterminate = true;
    await element.updateComplete;
    const after = element.getBoundingClientRect();
    expect([after.x, after.y, after.width, after.height]).toEqual([before.x, before.y, before.width, before.height]);
  });

  it('with reduced motion, the duration is 100 ms (core/duration/100 through its semantic alias), the easing stays and the fill still changes', async () => {
    const session = cdp();
    try {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      const element = await mount();
      const duration = resolved('transition-duration', '--nph-motion-hover-duration');
      expect(duration).toBe('0.1s');
      for (const item of animated(element)) {
        const style = getComputedStyle(item);
        expect(listOf(style.transitionDuration).every((value) => value === duration)).toBe(true);
        expect(listOf(style.transitionTimingFunction).every((value) => value === resolved('transition-timing-function', '--nph-motion-state-easing'))).toBe(true);
      }
      element.checked = true;
      await element.updateComplete;
      await vi.waitFor(() => expect(getComputedStyle(box(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-primary')));
    } finally {
      /* Back to the test browser's default; `features: []` does not undo it. */
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    }
    await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
  });
});

describe('contrast, measured (WCAG 2.2 AA)', () => {
  /** The colors of one brand and scheme. */
  function palette(brand: string, scheme: 'light' | 'dark'): Record<string, string> {
    const area = scope(brand, scheme);
    const names = ['color-background', 'color-primary', 'color-primary-foreground', 'color-input', 'color-input-hover', 'color-foreground', 'status-error', 'focus-border', 'focus-halo', 'focus-halo-error'];
    const colors = Object.fromEntries(names.map((name) => [name, resolved('color', `--nph-${name}`, area)]));
    area.remove();
    return colors;
  }

  const pairs = BRANDS.flatMap((brand) => (['light', 'dark'] as const).map((scheme) => [brand, scheme] as const));
  const hoverOpacity = () => Number.parseFloat(resolved('opacity', '--nph-state-hover-opacity'));

  it('the box border (color/input), at rest and on hover, is at least 3:1 on the background, in every brand and scheme (1.4.11)', () => {
    for (const [brand, scheme] of pairs) {
      const c = palette(brand, scheme);
      expect(contrast(c['color-input'] as string, c['color-background'] as string), `${brand} ${scheme}`).toBeGreaterThanOrEqual(3);
      expect(contrast(c['color-input-hover'] as string, c['color-background'] as string), `${brand} ${scheme}`).toBeGreaterThanOrEqual(3);
    }
  });

  it('the mark is at least 3:1 on the checked fill, also on hover, in every brand and scheme', () => {
    for (const [brand, scheme] of pairs) {
      const c = palette(brand, scheme);
      const [mark, fill, page] = [c['color-primary-foreground'] as string, c['color-primary'] as string, c['color-background'] as string];
      expect(contrast(mark, fill), `${brand} ${scheme}`).toBeGreaterThanOrEqual(3);
      expect(contrast(over(mark, hoverOpacity(), page), over(fill, hoverOpacity(), page)), `${brand} ${scheme} hover`).toBeGreaterThanOrEqual(3);
    }
  });

  it('the text is at least 4.5:1 and the error border at least 3:1 on the background, in every brand and scheme', () => {
    for (const [brand, scheme] of pairs) {
      const c = palette(brand, scheme);
      expect(contrast(c['color-foreground'] as string, c['color-background'] as string), `${brand} ${scheme}`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c['status-error'] as string, c['color-background'] as string), `${brand} ${scheme}`).toBeGreaterThanOrEqual(3);
    }
  });

  it('known limit: the checked fill (color/primary) under 3:1 on the background is exactly the measured pairs', () => {
    const under = pairs.filter(([brand, scheme]) => {
      const c = palette(brand, scheme);
      return contrast(c['color-primary'] as string, c['color-background'] as string) < 3;
    });
    expect(under.map(([brand, scheme]) => `${brand} ${scheme}`)).toEqual(['gerencial dark', 'rh dark']);
  });

  it('known limit: focus/border under 3:1 against the halo is exactly the one design.md names', () => {
    const under = pairs.filter(([brand, scheme]) => {
      const c = palette(brand, scheme);
      return contrast(c['focus-border'] as string, c['focus-halo'] as string) < 3;
    });
    expect(under.map(([brand, scheme]) => `${brand} ${scheme}`)).toEqual(['sistemas light']);
    expect(designMd).toContain('in light mode, the border measures 2,92:1 against the halo');
  });

  it('known limit: the error border against focus/halo-error is under 3:1 in dark, in every brand', () => {
    const under = pairs.filter(([brand, scheme]) => {
      const c = palette(brand, scheme);
      return contrast(c['status-error'] as string, c['focus-halo-error'] as string) < 3;
    });
    expect(under.map(([brand, scheme]) => `${brand} ${scheme}`)).toEqual(BRANDS.map((brand) => `${brand} dark`));
  });
});

describe('what the piece does not have', () => {
  it('has no slot and no part', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('slot')).toBeNull();
    expect(element.shadowRoot?.querySelector('[part]')).toBeNull();
  });

  it('has no size, no variant, no color property, no required and no own event', () => {
    const declared = [...(NphCheckbox as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['size', 'variant', 'color', 'required']) {
      expect(declared).not.toContain(name);
    }
    expect(componentCss + NphCheckbox.toString()).not.toMatch(/nph-checked-change|CustomEvent/);
  });

  it('the inner control is the only interactive element', async () => {
    const element = await mount();
    expect(control(element).tagName).toBe('LABEL');
    expect(control(element).querySelectorAll('input')).toHaveLength(1);
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
        '--nph-space-inline-tight',
        '--nph-focus-halo',
        '--nph-icon-size-sm',
        '--nph-border-width',
        '--nph-color-input',
        '--nph-radius-inner',
        '--nph-color-background',
        '--nph-color-primary-foreground',
        '--nph-color-primary',
        '--nph-color-input-hover',
        '--nph-state-hover-opacity',
        '--nph-focus-border',
        '--nph-focus-halo-error',
        '--nph-status-error',
        '--nph-focus-ring-width',
        '--nph-focus-radius-inner',
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

  it('design.md ties the tokens of the evidence to the checkbox', () => {
    expect(designMd).toContain('use: "Field border: input, select, textarea, checkbox."');
    expect(designMd).toMatch(/radius\/inner[\s\S]{0,200}USE on an element nested inside a control or container: checkbox/);
    expect(designMd).toMatch(/focus\/border[\s\S]{0,900}Applies to checkbox, radio and switch/);
    expect(designMd).toContain('use: "State change that STAYS: selection, checkbox, toggle, tab change."');
    expect(designMd).toMatch(/motion\/hover-duration:\s*\n\s*css: '--nph-motion-hover-duration'\s*\n\s*alias: core\/duration\/100/);
    expect(designMd).toMatch(/minus by the indeterminate nph-checkbox/);
  });
});
