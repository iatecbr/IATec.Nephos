/**
 * Tests of `nph-image` (P90), in a real browser (P21, item 5): resolved color, measures,
 * image loading, real hover and keyboard focus only exist where there is layout.
 *
 * They prove the contract accepted in Figma (frame `2677:465`, set `2573:66089`): the API,
 * the box per size and proportion with its corner, the content states derived from `src`
 * (empty, loading, loaded, error), the spinner and the border of each state, the colors in
 * both schemes and in another brand, the clickable image (button, hover veil and eye,
 * focus ring, disabled), the host semantics, the invalid input and the token contract.
 *
 * Images are data URIs, never a network address, so no test depends on the network or
 * leaves a 404 behind.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-image.css?raw';
import {
  NPH_IMAGE_EYE_SIZE,
  NPH_IMAGE_RATIOS,
  NPH_IMAGE_SIZES,
  NPH_IMAGE_SPINNER_SIZE,
  NphImage,
  isRatio,
  isSize,
} from './nph-image';

type Props = Partial<Pick<NphImage, 'size' | 'ratio' | 'src' | 'alt' | 'interactive' | 'disabled'>>;

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

/** An abstract picture, as a data URI: valid, and it carries no person. */
function picture(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="${color}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
const IMAGE = picture('#c0392b');
const OTHER_IMAGE = picture('#2980b9');
/** The text "not an image" in base64: a valid data URI that is not a picture, so it fails to load. */
const BROKEN_IMAGE = 'data:image/png;base64,bm90IGFuIGltYWdl';

async function mount(props: Props = {}, parent: HTMLElement = document.body): Promise<NphImage> {
  const element = document.createElement('nph-image');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

function image(element: NphImage): HTMLImageElement | null {
  return element.shadowRoot?.querySelector<HTMLImageElement>('img') ?? null;
}

function spinner(element: NphImage): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>('nph-spinner') ?? null;
}

function border(element: NphImage): HTMLElement {
  return element.shadowRoot?.querySelector<HTMLElement>('.border') as HTMLElement;
}

function control(element: NphImage): HTMLButtonElement | null {
  return element.shadowRoot?.querySelector<HTMLButtonElement>('button') ?? null;
}

function veil(element: NphImage): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>('.veil') ?? null;
}

/** Waits until the image reached a final state and the piece redrew itself. */
async function settled(element: NphImage, status: 'loaded' | 'error' = 'loaded'): Promise<void> {
  await vi.waitFor(() => expect(element.status).toBe(status));
  await element.updateComplete;
}

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

function px(token: string): number {
  return Number.parseFloat(resolved('width', token));
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

interface AxNode {
  ignored: boolean;
  role: string;
  name: string;
}

/** The node the browser itself computes for an element, from its accessibility tree. */
async function axNode(element: Element): Promise<AxNode> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    /* The tests run in a frame: look the element up through the DOM domain, piercing into it. */
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', {
      query: '[data-ax-probe]',
      includeUserAgentShadowDOM: false,
    });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    const node = nodes[0];
    return {
      ignored: Boolean(node?.ignored),
      role: String(node?.role?.value ?? ''),
      name: String(node?.name?.value ?? ''),
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('defines nph-image only once', () => {
    expect(customElements.get('nph-image')).toBe(NphImage);
  });

  it('the public API is exactly size, ratio, src, alt, interactive and disabled', () => {
    const declared = [...(NphImage as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['size', 'ratio', 'src', 'alt', 'interactive', 'disabled']);
  });

  it('the sizes and the proportions are the ones of Figma, and the guards agree', () => {
    expect([...NPH_IMAGE_SIZES]).toEqual(['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'media']);
    expect([...NPH_IMAGE_RATIOS]).toEqual(['1:1', '4:3', '16:9']);
    expect(NPH_IMAGE_SIZES.every(isSize)).toBe(true);
    expect(NPH_IMAGE_RATIOS.every(isRatio)).toBe(true);
    expect(['mídia', '3xl', '', 'MD', 'full'].some(isSize)).toBe(false);
    expect(['1/1', '16/9', '3:2', '', '1:1 '].some(isRatio)).toBe(false);
  });

  it('the defaults are xs and 1:1, with no image, no name, not clickable and enabled; size and ratio reflect', async () => {
    const element = await mount();
    expect([element.size, element.ratio, element.src, element.alt, element.interactive, element.disabled]).toEqual([
      'xs',
      '1:1',
      '',
      '',
      false,
      false,
    ]);
    expect(element.getAttribute('size')).toBe('xs');
    expect(element.getAttribute('ratio')).toBe('1:1');
  });

  it('src and alt do not reflect; interactive and disabled reflect', async () => {
    const element = await mount({ src: IMAGE, alt: 'Blue mug', interactive: true, disabled: true });
    expect(element.hasAttribute('src')).toBe(false);
    expect(element.hasAttribute('alt')).toBe(false);
    expect(element.hasAttribute('interactive')).toBe(true);
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  it('the attributes are size, ratio, src, alt, interactive and disabled', async () => {
    const element = document.createElement('nph-image');
    element.setAttribute('size', 'media');
    element.setAttribute('ratio', '16:9');
    element.setAttribute('src', IMAGE);
    element.setAttribute('alt', 'Blue mug');
    element.setAttribute('interactive', '');
    element.setAttribute('disabled', '');
    document.body.append(element);
    await element.updateComplete;
    expect([element.size, element.ratio, element.src, element.alt, element.interactive, element.disabled]).toEqual([
      'media',
      '16:9',
      IMAGE,
      'Blue mug',
      true,
      true,
    ]);
  });

  it('has the open shadow root', async () => {
    const element = await mount();
    expect(element.shadowRoot?.mode).toBe('open');
  });
});

describe('measures', () => {
  const RADIUS: Record<string, string> = {
    xs: 'sm',
    sm: 'sm',
    md: 'md',
    lg: 'md',
    xl: 'lg',
    '2xl': 'lg',
    media: 'lg',
  };

  for (const size of NPH_IMAGE_SIZES.filter((value) => value !== 'media')) {
    it(`${size}: a square of image/size-${size} with image/radius-${RADIUS[size]}`, async () => {
      const element = await mount({ size });
      const box = element.getBoundingClientRect();
      const side = px(`--nph-image-size-${size}`);
      expect([box.width, box.height]).toEqual([side, side]);
      const style = getComputedStyle(element);
      expect(style.boxSizing).toBe('border-box');
      expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', `--nph-image-radius-${RADIUS[size]}`));
      expect(style.overflow).toBe('hidden');
    });
  }

  it('the six square sizes are 24, 32, 48, 64, 96 and 128', async () => {
    const sides: number[] = [];
    for (const size of NPH_IMAGE_SIZES.filter((value) => value !== 'media')) {
      const element = await mount({ size });
      sides.push(element.getBoundingClientRect().width);
    }
    expect(sides).toEqual([24, 32, 48, 64, 96, 128]);
  });

  const HEIGHTS: Record<string, number> = { '1:1': 256, '4:3': 192, '16:9': 144 };
  for (const ratio of NPH_IMAGE_RATIOS) {
    it(`media ${ratio}: width image/media-width (256) and height ${HEIGHTS[ratio]}, with image/radius-lg`, async () => {
      const element = await mount({ size: 'media', ratio });
      const box = element.getBoundingClientRect();
      expect(box.width).toBe(px('--nph-image-media-width'));
      expect(box.width).toBe(256);
      expect(box.height).toBeCloseTo(HEIGHTS[ratio] ?? 0, 3);
      expect(getComputedStyle(element).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-image-radius-lg'));
    });
  }

  it('the proportion only applies to media: every other size stays square, with no warning', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    for (const size of NPH_IMAGE_SIZES.filter((value) => value !== 'media')) {
      const element = await mount({ size, ratio: '16:9' });
      const box = element.getBoundingClientRect();
      expect(box.width, size).toBe(box.height);
      element.remove();
    }
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it('the area is the same in every state: empty, loading, loaded and error', async () => {
    const empty = await mount({ size: 'lg' });
    const loading = await mount({ size: 'lg', src: IMAGE });
    const sizeLoading = loading.getBoundingClientRect();
    const loaded = await mount({ size: 'lg', src: OTHER_IMAGE });
    await settled(loaded);
    const failed = await mount({ size: 'lg', src: BROKEN_IMAGE });
    await settled(failed, 'error');
    const area = (element: NphImage) => [element.getBoundingClientRect().width, element.getBoundingClientRect().height];
    expect([sizeLoading.width, sizeLoading.height]).toEqual(area(empty));
    expect(area(loaded)).toEqual(area(empty));
    expect(area(failed)).toEqual(area(empty));
  });
});

describe('content states, derived from src', () => {
  it('without src the state is empty: no image, no spinner, the frame with its border', async () => {
    const element = await mount({ size: 'md' });
    expect(element.status).toBe('empty');
    expect(image(element)).toBeNull();
    expect(spinner(element)).toBeNull();
    expect(getComputedStyle(border(element)).borderTopStyle).toBe('solid');
  });

  it('a src with only spaces is empty too', async () => {
    const element = await mount({ src: '   ' });
    expect(element.status).toBe('empty');
    expect(image(element)).toBeNull();
  });

  it('while it loads: the spinner shows, the image stays hidden and the frame has no border', async () => {
    const element = await mount({ size: 'md', src: IMAGE });
    /* The load is a later task: right after the update, the image has not arrived. */
    expect(element.status).toBe('loading');
    expect(spinner(element)).not.toBeNull();
    expect(image(element)?.hidden).toBe(true);
    expect(getComputedStyle(border(element)).borderTopStyle).toBe('none');
  });

  it('after load: the image shows and fills the frame, the spinner is gone and the border is back', async () => {
    const element = await mount({ size: 'lg', src: IMAGE });
    await settled(element);
    const drawn = image(element) as HTMLImageElement;
    expect(drawn.hidden).toBe(false);
    expect(spinner(element)).toBeNull();
    const frame = element.getBoundingClientRect();
    const box = drawn.getBoundingClientRect();
    expect([box.width, box.height]).toEqual([frame.width, frame.height]);
    expect(getComputedStyle(drawn).objectFit).toBe('cover');
    expect(getComputedStyle(drawn).borderTopStyle).toBe('none');
    expect(getComputedStyle(border(element)).borderTopStyle).toBe('solid');
  });

  it('an image that fails is the error state: no image, no spinner, the frame with its border, nothing logged', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ size: 'md', src: BROKEN_IMAGE });
    await settled(element, 'error');
    expect(image(element)?.hidden).toBe(true);
    expect(spinner(element)).toBeNull();
    expect(getComputedStyle(border(element)).borderTopStyle).toBe('solid');
    expect(error).not.toHaveBeenCalled();
  });

  it('empty and error draw the frame only until the illustrations arrive (D1): no drawing of their own', async () => {
    const empty = await mount({ size: 'md' });
    const failed = await mount({ size: 'md', src: BROKEN_IMAGE });
    await settled(failed, 'error');
    const visible = (element: NphImage) =>
      [...(element.shadowRoot?.children ?? [])]
        .filter((node) => node.tagName !== 'STYLE' && !(node as HTMLElement).hidden)
        .map((node) => `${node.tagName.toLowerCase()}.${node.className}`);
    expect(visible(empty)).toEqual(['span.border']);
    expect(visible(failed)).toEqual(['span.border']);
  });

  it('a new src starts the wait again: the spinner comes back until the new image loads', async () => {
    const element = await mount({ src: IMAGE });
    await settled(element);
    element.src = OTHER_IMAGE;
    await element.updateComplete;
    expect(element.status).toBe('loading');
    expect(spinner(element)).not.toBeNull();
    await settled(element);
    expect(spinner(element)).toBeNull();
  });

  it('a new src that fails after a good one is the error state', async () => {
    const element = await mount({ src: IMAGE });
    await settled(element);
    element.src = BROKEN_IMAGE;
    await element.updateComplete;
    await settled(element, 'error');
    expect(image(element)?.hidden).toBe(true);
  });

  it('a src that changes only by surrounding spaces keeps the loaded image shown', async () => {
    const element = await mount({ src: IMAGE });
    await settled(element);
    element.src = `  ${IMAGE}  `;
    await element.updateComplete;
    expect(element.status).toBe('loaded');
    expect(image(element)?.hidden).toBe(false);
  });

  it('a src that changes only by surrounding spaces keeps a failed image failed', async () => {
    const element = await mount({ src: BROKEN_IMAGE });
    await settled(element, 'error');
    element.src = ` ${BROKEN_IMAGE}`;
    await element.updateComplete;
    expect(element.status).toBe('error');
    expect(spinner(element)).toBeNull();
  });

  it('removing src goes back to empty and draws no image at all', async () => {
    const element = await mount({ src: IMAGE });
    await settled(element);
    element.src = '';
    await element.updateComplete;
    expect(element.status).toBe('empty');
    expect(image(element)).toBeNull();
  });

  it('a late event from an image that is no longer the current one is ignored', async () => {
    const element = await mount({ src: IMAGE });
    await settled(element);
    const old = image(element) as HTMLImageElement;
    element.src = '';
    await element.updateComplete;
    element.src = OTHER_IMAGE;
    await element.updateComplete;
    await settled(element);
    expect(image(element)).not.toBe(old);
    old.dispatchEvent(new Event('error'));
    await element.updateComplete;
    expect(element.status).toBe('loaded');
    expect(image(element)?.hidden).toBe(false);
  });

  it('the host repeats the native load and error of the image, without bubbling', async () => {
    const heard: string[] = [];
    const bubbled: string[] = [];
    document.body.addEventListener('load', () => bubbled.push('load'));
    document.body.addEventListener('error', () => bubbled.push('error'));
    const element = document.createElement('nph-image');
    element.addEventListener('load', (event) => heard.push(`load:${event.bubbles}`));
    element.addEventListener('error', (event) => heard.push(`error:${event.bubbles}`));
    element.src = IMAGE;
    document.body.append(element);
    await settled(element);
    element.src = BROKEN_IMAGE;
    await settled(element, 'error');
    expect(heard).toEqual(['load:false', 'error:false']);
    expect(bubbled).toEqual([]);
  });

  it('the image has an empty alt: the name belongs to the host', async () => {
    const element = await mount({ src: IMAGE, alt: 'Blue mug' });
    expect(image(element)?.getAttribute('alt')).toBe('');
  });
});

describe('the spinner', () => {
  for (const size of NPH_IMAGE_SIZES) {
    it(`${size}: nph-spinner ${NPH_IMAGE_SPINNER_SIZE[size]}, decorative, centered, in image/foreground`, async () => {
      const element = await mount({ size, src: IMAGE });
      const drawn = spinner(element) as HTMLElement;
      expect(drawn.getAttribute('size')).toBe(NPH_IMAGE_SPINNER_SIZE[size]);
      expect(drawn.hasAttribute('label')).toBe(false);
      expect(getComputedStyle(drawn).color).toBe(resolved('color', '--nph-image-foreground'));
      const frame = element.getBoundingClientRect();
      const box = drawn.getBoundingClientRect();
      expect(box.left - frame.left).toBeCloseTo(frame.right - box.right, 1);
      expect(box.top - frame.top).toBeCloseTo(frame.bottom - box.bottom, 1);
    });
  }

  it('the spinner has only sm and md: xs, sm and md take sm; the larger sizes take md', () => {
    expect(NPH_IMAGE_SPINNER_SIZE).toEqual({ xs: 'sm', sm: 'sm', md: 'sm', lg: 'md', xl: 'md', '2xl': 'md', media: 'md' });
  });
});

describe('colors, in both schemes and in another brand', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: the frame is image/background, the drawing image/foreground and the border image/border`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      const style = getComputedStyle(element);
      expect(style.backgroundColor).toBe(resolved('background-color', '--nph-image-background'));
      expect(style.color).toBe(resolved('color', '--nph-image-foreground'));
      const line = getComputedStyle(border(element));
      expect(line.borderTopColor).toBe(resolved('color', '--nph-image-border'));
      expect(line.borderTopWidth).toBe(resolved('width', '--nph-image-border-width'));
    });
  }

  it('the two schemes differ, so the colors really follow the scheme', async () => {
    const element = await mount();
    document.documentElement.setAttribute('data-nph-color-scheme', 'light');
    const light = getComputedStyle(element).backgroundColor;
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    expect(getComputedStyle(element).backgroundColor).not.toBe(light);
  });

  it('with a brand other than the default and the dark scheme on the same element, the piece takes the local tokens (P67)', async () => {
    const part = scope();
    const element = await mount({}, part);
    const style = getComputedStyle(element);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-image-background', part));
    expect(style.color).toBe(resolved('color', '--nph-image-foreground', part));
    expect(getComputedStyle(border(element)).borderTopColor).toBe(resolved('color', '--nph-image-border', part));
  });
});

describe('the border', () => {
  it('is an overlay over the whole frame, after the content, letting the pointer through and taking the corner', async () => {
    const element = await mount({ size: 'xl', src: IMAGE });
    await settled(element);
    const children = [...(element.shadowRoot?.children ?? [])].filter((node) => node.tagName !== 'STYLE');
    expect(children.at(-1)).toBe(border(element));
    const line = getComputedStyle(border(element));
    expect(line.position).toBe('absolute');
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      expect(line.getPropertyValue(side), side).toBe('0px');
    }
    expect(line.boxSizing).toBe('border-box');
    expect(line.pointerEvents).toBe('none');
    expect(line.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-image-radius-lg'));
  });

  it('does not change the frame size', async () => {
    const element = await mount({ size: 'md' });
    expect(element.getBoundingClientRect().width).toBe(px('--nph-image-size-md'));
  });
});

describe('semantics, not clickable', () => {
  it('without an alt, the host is hidden: aria-hidden, no role, no aria-label', async () => {
    const element = await mount({ src: IMAGE });
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.hasAttribute('role')).toBe(false);
    expect(element.hasAttribute('aria-label')).toBe(false);
    expect((await axNode(element)).ignored).toBe(true);
  });

  it('an alt with only spaces hides it too', async () => {
    const element = await mount({ alt: '   ' });
    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('with an alt, the host is an image with that name, read by the browser as such', async () => {
    const element = await mount({ src: IMAGE, alt: '  Blue mug  ' });
    expect(element.getAttribute('role')).toBe('img');
    expect(element.getAttribute('aria-label')).toBe('Blue mug');
    expect(element.hasAttribute('aria-hidden')).toBe(false);
    const node = await axNode(element);
    expect([node.ignored, node.role, node.name]).toEqual([false, 'image', 'Blue mug']);
  });

  it('the name holds in every state: empty, loading, loaded and error', async () => {
    const empty = await mount({ alt: 'Blue mug' });
    const loading = await mount({ alt: 'Blue mug', src: IMAGE });
    const roleWhileLoading = loading.getAttribute('role');
    const failed = await mount({ alt: 'Blue mug', src: BROKEN_IMAGE });
    await settled(failed, 'error');
    await settled(loading);
    for (const element of [empty, loading, failed]) {
      expect(element.getAttribute('role')).toBe('img');
      expect(element.getAttribute('aria-label')).toBe('Blue mug');
    }
    expect(roleWhileLoading).toBe('img');
  });

  it('never takes focus and has no hover or focus look: no button, no veil, no tabindex', async () => {
    const element = await mount({ alt: 'Blue mug', src: IMAGE });
    await settled(element);
    const before = document.activeElement;
    element.focus();
    expect(document.activeElement).toBe(before);
    expect(element.hasAttribute('tabindex')).toBe(false);
    expect(control(element)).toBeNull();
    await userEvent.hover(element);
    expect(veil(element)).toBeNull();
    expect(getComputedStyle(element).cursor).toBe('auto');
  });
});

describe('the clickable image', () => {
  it('draws one native button of type button that fills the frame and carries the name; the host has no role', async () => {
    const element = await mount({ size: 'lg', src: IMAGE, alt: 'Blue mug', interactive: true });
    const button = control(element) as HTMLButtonElement;
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Blue mug');
    const frame = element.getBoundingClientRect();
    const box = button.getBoundingClientRect();
    expect([box.width, box.height]).toEqual([frame.width, frame.height]);
    expect(element.hasAttribute('role')).toBe(false);
    expect(element.hasAttribute('aria-label')).toBe(false);
    expect(element.hasAttribute('aria-hidden')).toBe(false);
    const node = await axNode(button);
    expect([node.role, node.name]).toEqual(['button', 'Blue mug']);
  });

  it('takes the keyboard focus with Tab and the host focus goes to the button', async () => {
    const element = await mount({ src: IMAGE, alt: 'Blue mug', interactive: true });
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement).toBe(control(element));
    expect(element.shadowRoot?.delegatesFocus).toBe(true);
  });

  it('click, Enter and Space each give one native click on the host', async () => {
    const element = await mount({ src: IMAGE, alt: 'Blue mug', interactive: true });
    const clicks = vi.fn();
    element.addEventListener('click', clicks);
    await userEvent.click(element);
    expect(clicks).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Enter}');
    expect(clicks).toHaveBeenCalledTimes(2);
    await userEvent.keyboard(' ');
    expect(clicks).toHaveBeenCalledTimes(3);
  });

  it('hover over a loaded image shows the veil image/overlay with the eye in image/on-overlay', async () => {
    const element = await mount({ size: 'xl', src: IMAGE, alt: 'Blue mug', interactive: true });
    await settled(element);
    const shade = veil(element) as HTMLElement;
    expect(getComputedStyle(shade).display).toBe('none');
    await userEvent.hover(element);
    await vi.waitFor(() => expect(getComputedStyle(shade).display).toBe('flex'));
    const style = getComputedStyle(shade);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-image-overlay'));
    expect(style.color).toBe(resolved('color', '--nph-image-on-overlay'));
    const frame = element.getBoundingClientRect();
    const box = shade.getBoundingClientRect();
    expect([box.width, box.height]).toEqual([frame.width, frame.height]);
    const eye = shade.querySelector('nph-icon') as HTMLElement;
    expect(eye.getAttribute('name')).toBe('eye');
    expect(eye.hasAttribute('variant')).toBe(false);
    expect(eye.hasAttribute('label')).toBe(false);
    expect(getComputedStyle(element).cursor).toBe('auto');
    expect(getComputedStyle(control(element) as HTMLElement).cursor).toBe('pointer');
  });

  for (const size of NPH_IMAGE_SIZES) {
    it(`${size}: the eye is nph-icon ${NPH_IMAGE_EYE_SIZE[size]}, the value of image/icon-size-${NPH_IMAGE_EYE_SIZE[size]}`, async () => {
      const element = await mount({ size, src: IMAGE, alt: 'Blue mug', interactive: true });
      await settled(element);
      const eye = veil(element)?.querySelector('nph-icon') as HTMLElement;
      expect(eye.getAttribute('size')).toBe(NPH_IMAGE_EYE_SIZE[size]);
      await userEvent.hover(element);
      await vi.waitFor(() => expect(eye.getBoundingClientRect().height).toBeGreaterThan(0));
      expect(eye.getBoundingClientRect().height).toBe(px(`--nph-image-icon-size-${NPH_IMAGE_EYE_SIZE[size]}`));
    });
  }

  it('the veil only exists over a loaded image: not while empty, loading or failed', async () => {
    const empty = await mount({ alt: 'Upload', interactive: true });
    const loading = await mount({ alt: 'Blue mug', src: IMAGE, interactive: true });
    const veilWhileLoading = veil(loading);
    const failed = await mount({ alt: 'Blue mug', src: BROKEN_IMAGE, interactive: true });
    await settled(failed, 'error');
    expect(veil(empty)).toBeNull();
    expect(veilWhileLoading).toBeNull();
    expect(veil(failed)).toBeNull();
  });

  it('keyboard focus draws the ring image/focus-border in focus/ring-width, inside the frame, with no veil', async () => {
    const element = await mount({ size: 'xl', src: IMAGE, alt: 'Blue mug', interactive: true });
    await settled(element);
    const before = element.getBoundingClientRect();
    await userEvent.tab();
    await vi.waitFor(() => expect(control(element)?.matches(':focus-visible')).toBe(true));
    const line = getComputedStyle(border(element));
    expect(line.borderTopStyle).toBe('solid');
    expect(line.borderTopColor).toBe(resolved('color', '--nph-image-focus-border'));
    expect(line.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
    expect(getComputedStyle(control(element) as HTMLElement).outlineStyle).toBe('none');
    expect(getComputedStyle(veil(element) as HTMLElement).display).toBe('none');
    expect(element.getBoundingClientRect().toJSON()).toEqual(before.toJSON());
  });

  it('the focus ring passes 3:1 against the frame, in both schemes and every brand', async () => {
    for (const scheme of ['light', 'dark'] as const) {
      for (const brand of BRANDS) {
        const part = scope(brand, scheme);
        const element = await mount({}, part);
        const frame = getComputedStyle(element).backgroundColor;
        const ring = resolved('color', '--nph-image-focus-border', part);
        expect(contrast(ring, frame), `${scheme} ${brand}`).toBeGreaterThanOrEqual(3);
        part.remove();
      }
    }
  });

  it('the focus ring shows in the loading state too, where the frame has no border', async () => {
    const element = await mount({ src: IMAGE, alt: 'Blue mug', interactive: true });
    expect(element.status).toBe('loading');
    await userEvent.tab();
    await vi.waitFor(() => expect(control(element)?.matches(':focus-visible')).toBe(true));
    expect(getComputedStyle(border(element)).borderTopStyle).toBe('solid');
  });

  it('a click with the pointer draws no ring: the ring is keyboard focus only', async () => {
    const element = await mount({ src: IMAGE, alt: 'Blue mug', interactive: true });
    await settled(element);
    await userEvent.click(element);
    expect(getComputedStyle(border(element)).borderTopColor).toBe(resolved('color', '--nph-image-border'));
  });

  it('interactive without an alt renders and warns once in development', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount({ src: IMAGE, interactive: true });
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(control(element)?.hasAttribute('aria-label')).toBe(false);
    element.size = 'md';
    await element.updateComplete;
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('[nph-image]');
    element.alt = 'Blue mug';
    await element.updateComplete;
    element.alt = '';
    await element.updateComplete;
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('turning interactive off goes back to the plain image, with its semantics', async () => {
    const element = await mount({ src: IMAGE, alt: 'Blue mug', interactive: true });
    element.interactive = false;
    await element.updateComplete;
    expect(control(element)).toBeNull();
    expect(element.getAttribute('role')).toBe('img');
  });
});

describe('disabled', () => {
  it('the whole piece takes state/disabled-opacity', async () => {
    const element = await mount({ disabled: true });
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('enabled, the piece is fully opaque', async () => {
    const element = await mount();
    expect(getComputedStyle(element).opacity).toBe('1');
  });

  it('clickable and disabled: the button is natively disabled, out of the Tab order, with no click and no veil', async () => {
    const element = await mount({ src: IMAGE, alt: 'Blue mug', interactive: true, disabled: true });
    await settled(element);
    const button = control(element) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    const clicks = vi.fn();
    element.addEventListener('click', clicks);
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
    await userEvent.click(element, { force: true });
    expect(clicks).not.toHaveBeenCalled();
    await userEvent.hover(element);
    expect(getComputedStyle(veil(element) as HTMLElement).display).toBe('none');
    expect(getComputedStyle(button).cursor).toBe('default');
  });
});

describe('invalid input', () => {
  it('an unknown size: nothing drawn, 0x0, no rendered mark, hidden and one console.error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = document.createElement('nph-image');
    element.setAttribute('size', 'mídia');
    element.src = IMAGE;
    element.alt = 'Blue mug';
    document.body.append(element);
    await element.updateComplete;
    const box = element.getBoundingClientRect();
    expect([box.width, box.height]).toEqual([0, 0]);
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(element).display).toBe('none');
    expect(image(element)).toBeNull();
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.hasAttribute('role')).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('[nph-image]');
  });

  it('an unknown ratio does not render either, also outside media, with one console.error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ size: 'md', ratio: '3:2' as NphImage['ratio'] });
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(element.getBoundingClientRect().width).toBe(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('ratio');
  });

  it('one error per cause: an invalid size and ratio give two, and they do not repeat on other changes', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ size: '3xl' as NphImage['size'], ratio: '' as NphImage['ratio'] });
    expect(error).toHaveBeenCalledTimes(2);
    element.alt = 'Blue mug';
    element.src = IMAGE;
    element.interactive = true;
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(2);
  });

  it('there is no visual fallback, and a valid value set later draws the piece and waits for the image again', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ size: '3xl' as NphImage['size'], src: IMAGE, alt: 'Blue mug' });
    expect(element.getBoundingClientRect().width).toBe(0);
    element.setAttribute('size', 'lg');
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(element.getBoundingClientRect().width).toBe(px('--nph-image-size-lg'));
    expect(element.getAttribute('role')).toBe('img');
    expect(element.status).toBe('loading');
    await settled(element);
  });

  it('no src and no alt is a valid input and stays silent', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount();
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('absences', () => {
  it('has no slot and no part', async () => {
    const element = await mount({ src: IMAGE, interactive: true, alt: 'Blue mug' });
    expect(element.shadowRoot?.querySelector('slot')).toBeNull();
    expect(element.shadowRoot?.querySelector('[part]')).toBeNull();
  });

  it('draws no text', async () => {
    const element = await mount({ alt: 'Blue mug', interactive: true });
    expect(element.shadowRoot?.textContent?.replace(/\s+/g, '')).toBe('');
  });

  it('emits no nph-* event and no change', async () => {
    const events: string[] = [];
    const element = document.createElement('nph-image');
    for (const name of ['nph-change', 'nph-load', 'nph-error', 'nph-click', 'change', 'input']) {
      element.addEventListener(name, () => events.push(name));
    }
    element.src = IMAGE;
    element.interactive = true;
    element.alt = 'Blue mug';
    document.body.append(element);
    await settled(element);
    await userEvent.click(element);
    expect(events).toEqual([]);
  });

  it('is not form-associated', () => {
    expect((NphImage as unknown as { formAssociated?: boolean }).formAssociated).toBeUndefined();
  });
});

describe('contrast, measured', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: the spinner in image/foreground on image/background is at least 3:1, in every brand`, async () => {
      for (const brand of BRANDS) {
        const part = scope(brand, scheme);
        const element = await mount({}, part);
        const style = getComputedStyle(element);
        expect(contrast(style.color, style.backgroundColor), `${scheme} ${brand}`).toBeGreaterThanOrEqual(3);
        part.remove();
      }
    });
  }
});

describe('layout in a container', () => {
  it('keeps its exact size in a narrow flex row and next to a long text', async () => {
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; inline-size: 40px;';
    document.body.append(row);
    const element = await mount({ size: 'lg' }, row);
    const text = document.createElement('span');
    text.textContent = 'A very long product name that does not fit in the row at all';
    row.append(text);
    expect(element.getBoundingClientRect().width).toBe(px('--nph-image-size-lg'));
  });

  it('a list of the same size stays aligned: every box has the same width', async () => {
    const list = document.createElement('div');
    list.style.cssText = 'display: flex; flex-direction: column;';
    document.body.append(list);
    const pieces = [await mount({ size: 'md' }, list), await mount({ size: 'md', src: IMAGE }, list), await mount({ size: 'md', src: BROKEN_IMAGE }, list)];
    const lefts = pieces.map((piece) => piece.getBoundingClientRect().left);
    const widths = pieces.map((piece) => piece.getBoundingClientRect().width);
    expect(new Set(lefts).size).toBe(1);
    expect(new Set(widths).size).toBe(1);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css, and these are the ones the contract names', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(new Set(used)).toEqual(
      new Set([
        '--nph-image-size-xs',
        '--nph-image-size-sm',
        '--nph-image-size-md',
        '--nph-image-size-lg',
        '--nph-image-size-xl',
        '--nph-image-size-2xl',
        '--nph-image-media-width',
        '--nph-image-radius-sm',
        '--nph-image-radius-md',
        '--nph-image-radius-lg',
        '--nph-image-background',
        '--nph-image-foreground',
        '--nph-image-border',
        '--nph-image-border-width',
        '--nph-image-overlay',
        '--nph-image-on-overlay',
        '--nph-image-focus-border',
        '--nph-focus-ring-width',
        '--nph-state-disabled-opacity',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('the eye sizes are the image/icon-size-* tokens: each one resolves to the icon/size-* that nph-icon uses', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      expect(px(`--nph-image-icon-size-${size}`), size).toBe(px(`--nph-icon-size-${size}`));
    }
    expect(NPH_IMAGE_EYE_SIZE).toEqual({ xs: 'sm', sm: 'sm', md: 'md', lg: 'md', xl: 'lg', '2xl': 'lg', media: 'lg' });
  });

  it('never consumes a core or theme layer directly', () => {
    expect(cssWithoutComments).not.toMatch(/--nph-core-/);
    expect(cssWithoutComments).not.toMatch(/--nph-theme-/);
  });

  it('the CSS has no literal design value and no motion of its own', () => {
    /* `100%` and the three proportions of `media` are the box relations written. */
    const withoutRelations = cssWithoutComments.replace(/\b100%/g, '').replace(/\b(1 \/ 1|4 \/ 3|16 \/ 9)\b/g, '');
    expect(withoutRelations).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(withoutRelations).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(withoutRelations).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
    expect(withoutRelations).not.toMatch(/\d\s*\/\s*\d/);
    expect(withoutRelations).not.toMatch(/\b(animation|transition|@keyframes)\b/);
  });

  it('the illustration tokens exist and are left for D1: the CSS does not consume them yet', () => {
    expect(tokensCss).toContain('--nph-image-illustration-light:');
    expect(tokensCss).toContain('--nph-image-illustration-dark:');
    expect(cssWithoutComments).not.toMatch(/illustration/);
  });
});
