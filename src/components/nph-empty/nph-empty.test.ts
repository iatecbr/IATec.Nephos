/**
 * Tests of `nph-empty` (P84), in a real browser (P21, item 5): the box, the gaps, the
 * resolved colors and the opacity of each illustration only exist where there is layout.
 *
 * They prove the contract accepted in Figma (board `1463:25260`, frame `2003:688`): the
 * anatomy and its tokens, the description that turns on and off with its presence, the
 * illustration that switches with the color scheme through `scheme/is-light` and
 * `scheme/is-dark`, the contrast of the texts on `color/background` and `color/popover`,
 * the decorative illustration, the absence of focus and action, and the invalid input.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-empty.css?raw';
import componentSource from './nph-empty.ts?raw';
import { NphEmpty } from './nph-empty';

const HEADING = 'No option found';
const DESCRIPTION = 'Check what you typed or search for another term.';
const SCHEMES = ['light', 'dark'] as const;

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

interface MountOptions {
  heading?: string;
  description?: string;
  scheme?: (typeof SCHEMES)[number];
  parentStyle?: string;
}

/** Mounts one `nph-empty` inside a container, optionally inside a scheme scope. */
async function mount(options: MountOptions = {}): Promise<{ parent: HTMLElement; empty: NphEmpty }> {
  const parent = document.createElement('div');
  if (options.scheme !== undefined) parent.setAttribute('data-nph-color-scheme', options.scheme);
  if (options.parentStyle !== undefined) parent.style.cssText = options.parentStyle;
  const empty = document.createElement('nph-empty');
  if (options.heading !== undefined) empty.setAttribute('heading', options.heading);
  if (options.description !== undefined) empty.setAttribute('description', options.description);
  parent.append(empty);
  document.body.append(parent);
  await empty.updateComplete;
  return { parent, empty };
}

function part<T extends Element>(empty: NphEmpty, selector: string): T {
  const element = empty.shadowRoot?.querySelector<T>(selector);
  if (element === null || element === undefined) throw new Error(`no ${selector} in the shadow root`);
  return element;
}

/** Resolves a token to what the browser computes, through a probe element. */
function resolved(property: 'width' | 'paddingTop' | 'rowGap' | 'color' | 'backgroundColor' | 'opacity', token: string, scope: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  if (property === 'rowGap') probe.style.display = 'flex';
  probe.style[property] = `var(${token})`;
  scope.append(probe);
  const value = getComputedStyle(probe)[property];
  probe.remove();
  return value;
}

/** Waits for both illustrations to load, so their boxes and pixels are real. */
async function loaded(empty: NphEmpty): Promise<void> {
  const images = [...(empty.shadowRoot?.querySelectorAll('img') ?? [])];
  await Promise.all(images.map((image) => image.decode()));
}

describe('registration and API', () => {
  it('defines nph-empty exactly once', () => {
    expect(customElements.get('nph-empty')).toBe(NphEmpty);
  });

  it('the public API is exactly heading and description', () => {
    const declared = [...(NphEmpty as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['heading', 'description']);
  });

  it('there is no title property: the global HTML attribute stays the native one', async () => {
    const { empty } = await mount({ heading: HEADING });
    expect(empty.title).toBe('');
    expect(empty.hasAttribute('title')).toBe(false);
  });

  it('the properties do not reflect: the CSS selects nothing by them', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { empty } = await mount();
    empty.heading = HEADING;
    empty.description = DESCRIPTION;
    await empty.updateComplete;
    expect(empty.hasAttribute('heading')).toBe(false);
    expect(empty.hasAttribute('description')).toBe(false);
    expect(part(empty, '.heading').textContent).toBe(HEADING);
  });
});

describe('text', () => {
  it('with description: the heading and the description, in this order', async () => {
    const { empty } = await mount({ heading: HEADING, description: DESCRIPTION });
    const texts = [...(empty.shadowRoot?.querySelectorAll('.text > p') ?? [])].map((p) => p.textContent);
    expect(texts).toEqual([HEADING, DESCRIPTION]);
  });

  it('without description: only the heading (the description off)', async () => {
    const { empty } = await mount({ heading: HEADING });
    expect(empty.shadowRoot?.querySelector('.description')).toBeNull();
    expect(part(empty, '.heading').textContent).toBe(HEADING);
  });

  it('a description of only spaces counts as no description', async () => {
    const { empty } = await mount({ heading: HEADING, description: '   ' });
    expect(empty.shadowRoot?.querySelector('.description')).toBeNull();
  });

  it('the texts are trimmed', async () => {
    const { empty } = await mount({ heading: `  ${HEADING}  `, description: ` ${DESCRIPTION} ` });
    expect(part(empty, '.heading').textContent).toBe(HEADING);
    expect(part(empty, '.description').textContent).toBe(DESCRIPTION);
  });

  it('follows changes at run time', async () => {
    const { empty } = await mount({ heading: HEADING });
    empty.setAttribute('description', DESCRIPTION);
    await empty.updateComplete;
    expect(part(empty, '.description').textContent).toBe(DESCRIPTION);
    empty.setAttribute('heading', 'No result');
    empty.removeAttribute('description');
    await empty.updateComplete;
    expect(part(empty, '.heading').textContent).toBe('No result');
    expect(empty.shadowRoot?.querySelector('.description')).toBeNull();
  });

  it('the heading and the description are paragraphs, not headings: the consumer owns the outline', async () => {
    const { empty } = await mount({ heading: HEADING, description: DESCRIPTION });
    expect(part(empty, '.heading').tagName).toBe('P');
    expect(part(empty, '.description').tagName).toBe('P');
    expect(empty.shadowRoot?.querySelector('h1, h2, h3, h4, h5, h6, [role="heading"]')).toBeNull();
  });
});

describe('box', () => {
  it('width layout/input-width, with the padding inside it', async () => {
    const { empty } = await mount({ heading: HEADING });
    const style = getComputedStyle(empty);
    expect(style.boxSizing).toBe('border-box');
    expect(empty.getBoundingClientRect().width).toBe(Number.parseFloat(resolved('width', '--nph-layout-input-width')));
  });

  it('padding space/container-padding on the four sides', async () => {
    const { empty } = await mount({ heading: HEADING });
    const style = getComputedStyle(empty);
    const padding = resolved('paddingTop', '--nph-space-container-padding');
    expect([style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft]).toEqual([padding, padding, padding, padding]);
  });

  it('no background and no border: it takes the background of the piece that receives it', async () => {
    const { empty } = await mount({ heading: HEADING });
    const style = getComputedStyle(empty);
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopWidth).toBe('0px');
    expect(style.boxShadow).toBe('none');
  });

  it('a vertical stack that centers everything', async () => {
    const { empty } = await mount({ heading: HEADING, description: DESCRIPTION });
    await loaded(empty);
    const style = getComputedStyle(empty);
    expect(style.flexDirection).toBe('column');
    expect(style.alignItems).toBe('center');
    expect(style.textAlign).toBe('center');
    const host = empty.getBoundingClientRect();
    const art = part(empty, '.illustration').getBoundingClientRect();
    expect(Math.abs(art.left + art.width / 2 - (host.left + host.width / 2))).toBeLessThanOrEqual(0.5);
  });

  it('space/section between the illustration and the text group', async () => {
    const { empty } = await mount({ heading: HEADING, description: DESCRIPTION });
    await loaded(empty);
    const art = part(empty, '.illustration').getBoundingClientRect();
    const text = part(empty, '.text').getBoundingClientRect();
    expect(text.top - art.bottom).toBe(Number.parseFloat(resolved('rowGap', '--nph-space-section')));
  });

  it('space/inline-tight between the heading and the description', async () => {
    const { empty } = await mount({ heading: HEADING, description: DESCRIPTION });
    const heading = part(empty, '.heading').getBoundingClientRect();
    const description = part(empty, '.description').getBoundingClientRect();
    expect(description.top - heading.bottom).toBe(Number.parseFloat(resolved('rowGap', '--nph-space-inline-tight')));
  });

  it('in a narrower container the box shrinks to it and the text wraps (reflow)', async () => {
    const { empty } = await mount({ heading: HEADING, description: DESCRIPTION, parentStyle: 'inline-size: 160px;' });
    expect(empty.getBoundingClientRect().width).toBe(160);
    expect(part(empty, '.description').scrollWidth).toBeLessThanOrEqual(part(empty, '.description').clientWidth);
  });
});

describe('typography and color', () => {
  for (const scheme of SCHEMES) {
    it(`${scheme}: the heading is text/heading-xs in color/foreground`, async () => {
      const { parent, empty } = await mount({ heading: HEADING, scheme });
      const style = getComputedStyle(part(empty, '.heading'));
      const tokens = getComputedStyle(parent);
      expect(style.color).toBe(resolved('color', '--nph-color-foreground', parent));
      expect(style.fontSize).toBe('14px');
      expect(style.fontWeight).toBe(tokens.getPropertyValue('--nph-text-heading-xs-font-weight').trim());
      expect(style.lineHeight).toBe('20px');
    });

    it(`${scheme}: the description is text/body-sm in color/muted-foreground`, async () => {
      const { parent, empty } = await mount({ heading: HEADING, description: DESCRIPTION, scheme });
      const style = getComputedStyle(part(empty, '.description'));
      const tokens = getComputedStyle(parent);
      expect(style.color).toBe(resolved('color', '--nph-color-muted-foreground', parent));
      expect(style.fontSize).toBe('12px');
      expect(style.fontWeight).toBe(tokens.getPropertyValue('--nph-text-body-sm-font-weight').trim());
      expect(style.lineHeight).toBe('16px');
    });
  }

  it('the font sizes and line heights are the ones of the text tokens', () => {
    expect(tokensCss).toContain('--nph-text-heading-xs-font-size: 0.875rem;');
    expect(tokensCss).toContain('--nph-text-heading-xs-line-height: 1.25rem;');
    expect(tokensCss).toContain('--nph-text-body-sm-font-size: 0.75rem;');
    expect(tokensCss).toContain('--nph-text-body-sm-line-height: 1rem;');
  });

  for (const scheme of SCHEMES) {
    for (const surface of ['--nph-color-background', '--nph-color-popover'] as const) {
      it(`${scheme}: the heading and the description pass 4.5:1 on ${surface.replace('--nph-', '')}`, async () => {
        const { parent, empty } = await mount({ heading: HEADING, description: DESCRIPTION, scheme });
        const background = rgb(resolved('backgroundColor', surface, parent));
        for (const selector of ['.heading', '.description']) {
          const ratio = contrast(rgb(getComputedStyle(part(empty, selector)).color), background);
          expect(ratio, selector).toBeGreaterThan(4.5);
        }
      });
    }
  }
});

describe('illustration', () => {
  it('two decorative images, out of the reading', async () => {
    const { empty } = await mount({ heading: HEADING });
    const images = [...(empty.shadowRoot?.querySelectorAll('img') ?? [])];
    expect(images).toHaveLength(2);
    for (const image of images) {
      expect(image.getAttribute('alt')).toBe('');
      expect(image.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('drawn at 120 × 87, the size of the asset, without being cut or stretched', async () => {
    const { empty } = await mount({ heading: HEADING });
    await loaded(empty);
    for (const image of empty.shadowRoot?.querySelectorAll('img') ?? []) {
      const box = image.getBoundingClientRect();
      expect([box.width, box.height]).toEqual([120, 87]);
      expect(getComputedStyle(image).objectFit).toBe('contain');
    }
    const art = part(empty, '.illustration').getBoundingClientRect();
    expect([art.width, art.height]).toEqual([120, 87]);
  });

  it('the light image is the light asset and the dark image is the dark asset', async () => {
    const { empty } = await mount({ heading: HEADING });
    await loaded(empty);
    const light = part<HTMLImageElement>(empty, '.light');
    const dark = part<HTMLImageElement>(empty, '.dark');
    expect(new URL(light.src).pathname).toMatch(/empty-no-option-found\.png$/);
    expect(new URL(dark.src).pathname).toMatch(/empty-no-option-found-dark\.png$/);
    expect(light.naturalWidth).toBeGreaterThan(0);
    expect(dark.naturalWidth).toBeGreaterThan(0);
  });

  it('with no scheme attribute (the root is light): the light one shows', async () => {
    const { empty } = await mount({ heading: HEADING });
    expect(getComputedStyle(part(empty, '.light')).opacity).toBe('1');
    expect(getComputedStyle(part(empty, '.dark')).opacity).toBe('0');
  });

  for (const scheme of SCHEMES) {
    it(`${scheme}: the opacity of each image is its scheme flag`, async () => {
      const { parent, empty } = await mount({ heading: HEADING, scheme });
      expect(getComputedStyle(part(empty, '.light')).opacity).toBe(resolved('opacity', '--nph-scheme-is-light', parent));
      expect(getComputedStyle(part(empty, '.dark')).opacity).toBe(resolved('opacity', '--nph-scheme-is-dark', parent));
      expect(getComputedStyle(part(empty, scheme === 'light' ? '.light' : '.dark')).opacity).toBe('1');
      expect(getComputedStyle(part(empty, scheme === 'light' ? '.dark' : '.light')).opacity).toBe('0');
    });
  }

  it('switches by itself when the scheme of an ancestor changes', async () => {
    const { parent, empty } = await mount({ heading: HEADING, scheme: 'light' });
    parent.setAttribute('data-nph-color-scheme', 'dark');
    expect(getComputedStyle(part(empty, '.dark')).opacity).toBe('1');
    expect(getComputedStyle(part(empty, '.light')).opacity).toBe('0');
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    parent.removeAttribute('data-nph-color-scheme');
    expect(getComputedStyle(part(empty, '.dark')).opacity).toBe('1');
  });
});

describe('semantics, focus and action', () => {
  it('the host has no role and no aria attribute', async () => {
    const { empty } = await mount({ heading: HEADING, description: DESCRIPTION });
    expect(empty.hasAttribute('role')).toBe(false);
    expect(empty.getAttributeNames().filter((name) => name.startsWith('aria-'))).toEqual([]);
    expect(empty.shadowRoot?.querySelector('[role="status"], [aria-live]')).toBeNull();
  });

  it('no focus: nothing focusable on the host or inside', async () => {
    const { empty } = await mount({ heading: HEADING, description: DESCRIPTION });
    expect(empty.hasAttribute('tabindex')).toBe(false);
    const before = document.activeElement;
    empty.focus();
    expect(document.activeElement).toBe(before);
    expect(empty.shadowRoot?.querySelector('button, a, input, [tabindex]')).toBeNull();
  });

  it('no action, no slot and no part', async () => {
    const { empty } = await mount({ heading: HEADING, description: DESCRIPTION });
    expect(empty.shadowRoot?.querySelector('slot')).toBeNull();
    expect(empty.shadowRoot?.querySelector('[part]')).toBeNull();
  });

  it('is still: no animation and no transition', async () => {
    const { empty } = await mount({ heading: HEADING });
    for (const element of [empty, ...(empty.shadowRoot?.querySelectorAll('*') ?? [])]) {
      const style = getComputedStyle(element);
      expect(style.animationName).toBe('none');
      expect(style.transitionDuration).toBe('0s');
    }
  });
});

describe('invalid input', () => {
  for (const [name, heading] of [
    ['no heading', undefined],
    ['an empty heading', ''],
    ['a heading of only spaces', '   '],
  ] as const) {
    it(`${name}: draws nothing, takes no space and emits one console.error`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const { empty } = await mount(heading === undefined ? { description: DESCRIPTION } : { heading, description: DESCRIPTION });
      expect(empty.hasAttribute('data-nph-rendered')).toBe(false);
      expect(getComputedStyle(empty).display).toBe('none');
      expect(empty.shadowRoot?.querySelector('img, p')).toBeNull();
      expect(error).toHaveBeenCalledTimes(1);
      expect(String(error.mock.calls[0]?.[0])).toContain('[nph-empty]');
    });
  }

  it('a heading set later draws the piece', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { empty } = await mount();
    empty.setAttribute('heading', HEADING);
    await empty.updateComplete;
    expect(empty.hasAttribute('data-nph-rendered')).toBe(true);
    expect(getComputedStyle(empty).display).toBe('flex');
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css, and these are the ones the contract names', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(new Set(used)).toEqual(
      new Set([
        '--nph-space-section',
        '--nph-layout-input-width',
        '--nph-space-container-padding',
        '--nph-scheme-is-light',
        '--nph-scheme-is-dark',
        '--nph-space-inline-tight',
        '--nph-color-foreground',
        '--nph-text-heading-xs-font-family',
        '--nph-text-heading-xs-font-size',
        '--nph-text-heading-xs-font-weight',
        '--nph-text-heading-xs-line-height',
        '--nph-text-heading-xs-letter-spacing',
        '--nph-color-muted-foreground',
        '--nph-text-body-sm-font-family',
        '--nph-text-body-sm-font-size',
        '--nph-text-body-sm-font-weight',
        '--nph-text-body-sm-line-height',
        '--nph-text-body-sm-letter-spacing',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('the CSS has no literal design value and no motion; the only quantity is the 100% box relation', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments.replaceAll('100%', '')).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
    expect(cssWithoutComments).not.toMatch(/\b(animation|transition|@keyframes)\b/);
  });

  it('the size of the illustration lives only in the image attributes', () => {
    expect(cssWithoutComments).not.toMatch(/\b(120|87)\b/);
    expect(componentSource.match(/width="120" height="87"/g)).toHaveLength(2);
  });

  it('design.md keeps scheme/is-light and scheme/is-dark for the assets of a scheme, not for color', () => {
    const block = designMd.slice(designMd.indexOf('tokens_scheme:'));
    expect(block).toContain("css: '--nph-scheme-is-light'");
    expect(block).toContain("css: '--nph-scheme-is-dark'");
    expect(block).toMatch(/DO NOT USE for color/);
  });
});

function rgb(value: string): [number, number, number] {
  const canvas = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
  canvas.fillStyle = '#000';
  canvas.fillStyle = value;
  canvas.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0] = canvas.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

function luminance([r, g, b]: [number, number, number]): number {
  const channel = (v: number): number => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
