/**
 * Tests of `nph-skeleton` (P69), in a real browser (P21, item 5): measures,
 * container filling and resolved color only exist where there is layout.
 *
 * They prove the contract accepted in Figma (frame `1578:38`): the five shapes,
 * their radii and measures, the color of `color/muted` in both schemes, the
 * line height decision (D1 of DSA-26, the literal reading), the stillness and
 * the absence of semantics and focus.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-skeleton.css?raw';
import { NPH_SKELETON_SHAPES, NphSkeleton } from './nph-skeleton';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

/** A 200 px wide container with the skeleton between two blocks. */
async function mountIn(display: string, shape?: string, style = ''): Promise<{ parent: HTMLElement; skeleton: NphSkeleton }> {
  const parent = document.createElement('div');
  parent.style.cssText = `display: ${display}; inline-size: 200px;`;
  const skeleton = document.createElement('nph-skeleton');
  if (shape !== undefined) skeleton.setAttribute('shape', shape);
  if (style !== '') skeleton.style.cssText = style;
  parent.append(skeleton);
  document.body.append(parent);
  await skeleton.updateComplete;
  return { parent, skeleton };
}

/** Resolves a token to what the browser computes, through a probe element. */
function resolved(property: 'backgroundColor' | 'borderTopLeftRadius' | 'width', token: string, scope: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style[property] = `var(${token})`;
  scope.append(probe);
  const value = getComputedStyle(probe)[property];
  probe.remove();
  return value;
}

describe('registration and API', () => {
  it('defines nph-skeleton exactly once', () => {
    expect(customElements.get('nph-skeleton')).toBe(NphSkeleton);
  });

  it('the public API is exactly shape', () => {
    const declared = [...(NphSkeleton as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['shape']);
  });

  it('the shapes are exactly line, block and the three avatars', () => {
    expect([...NPH_SKELETON_SHAPES]).toEqual(['line', 'block', 'avatar-sm', 'avatar-md', 'avatar-lg']);
  });

  it('shape is line by default and reflects to the attribute', async () => {
    const { skeleton } = await mountIn('block');
    expect(skeleton.shape).toBe('line');
    expect(skeleton.getAttribute('shape')).toBe('line');
  });
});

describe('line', () => {
  it('takes the container width and skeleton/line-height', async () => {
    const { skeleton } = await mountIn('block');
    const box = skeleton.getBoundingClientRect();
    expect(box.width).toBe(200);
    expect(box.height).toBe(16);
  });

  it('takes the container width in a column flex parent', async () => {
    const { skeleton } = await mountIn('flex; flex-direction: column');
    expect(skeleton.getBoundingClientRect().width).toBe(200);
  });

  it('keeps its own height inside a taller text line box (D1: the consumer gives the space)', async () => {
    const { parent, skeleton } = await mountIn('block');
    parent.style.fontSize = '14px';
    parent.style.lineHeight = '20px';
    expect(skeleton.getBoundingClientRect().height).toBe(16);
  });

  it('the radius is radius/inner', async () => {
    const { skeleton } = await mountIn('block');
    expect(getComputedStyle(skeleton).borderTopLeftRadius).toBe(resolved('borderTopLeftRadius', '--nph-radius-inner'));
  });
});

describe('block', () => {
  it('takes the container width and the height the consumer gives', async () => {
    const { skeleton } = await mountIn('block', 'block', 'block-size: 120px;');
    const box = skeleton.getBoundingClientRect();
    expect(box.width).toBe(200);
    expect(box.height).toBe(120);
  });

  it('has no height of its own: without one from the consumer it takes no height', async () => {
    const { skeleton } = await mountIn('block', 'block');
    expect(skeleton.getBoundingClientRect().height).toBe(0);
  });

  it('the radius is radius/control', async () => {
    const { skeleton } = await mountIn('block', 'block', 'block-size: 120px;');
    expect(getComputedStyle(skeleton).borderTopLeftRadius).toBe(resolved('borderTopLeftRadius', '--nph-radius-control'));
  });
});

describe('avatar', () => {
  for (const size of ['sm', 'md', 'lg'] as const) {
    it(`avatar-${size}: avatar/size-${size} square with avatar/radius-${size}, never a circle`, async () => {
      const { skeleton } = await mountIn('block', `avatar-${size}`);
      const box = skeleton.getBoundingClientRect();
      const side = Number.parseFloat(resolved('width', `--nph-avatar-size-${size}`));
      expect(box.width).toBe(side);
      expect(box.height).toBe(side);
      const radius = getComputedStyle(skeleton).borderTopLeftRadius;
      expect(radius).toBe(resolved('borderTopLeftRadius', `--nph-avatar-radius-${size}`));
      expect(Number.parseFloat(radius)).toBeLessThan(side / 2);
    });
  }

  it('keeps its size in a row flex parent', async () => {
    const { skeleton } = await mountIn('flex', 'avatar-sm');
    const side = Number.parseFloat(resolved('width', '--nph-avatar-size-sm'));
    expect(skeleton.getBoundingClientRect().width).toBe(side);
  });
});

describe('appearance', () => {
  it('every shape is color/muted, with no border', async () => {
    for (const shape of NPH_SKELETON_SHAPES) {
      const { skeleton } = await mountIn('block', shape, 'block-size: 40px;');
      const style = getComputedStyle(skeleton);
      expect(style.backgroundColor, shape).toBe(resolved('backgroundColor', '--nph-color-muted'));
      expect(style.borderTopWidth, shape).toBe('0px');
      document.body.replaceChildren();
    }
  });

  it('the color follows the scheme: color/muted in dark mode', async () => {
    const scope = document.createElement('div');
    scope.setAttribute('data-nph-color-scheme', 'dark');
    const skeleton = document.createElement('nph-skeleton');
    scope.append(skeleton);
    document.body.append(scope);
    await skeleton.updateComplete;
    const dark = getComputedStyle(skeleton).backgroundColor;
    expect(dark).toBe(resolved('backgroundColor', '--nph-color-muted', scope));
    scope.setAttribute('data-nph-color-scheme', 'light');
    expect(getComputedStyle(skeleton).backgroundColor).not.toBe(dark);
  });

  it('is still: no animation and no transition, so there is no pulse to reduce', async () => {
    const { skeleton } = await mountIn('block');
    const style = getComputedStyle(skeleton);
    expect(style.animationName).toBe('none');
    expect(style.transitionDuration).toBe('0s');
  });

  it('draws nothing inside: no text, no child', async () => {
    const { skeleton } = await mountIn('block');
    expect(skeleton.shadowRoot?.textContent?.trim()).toBe('');
    expect(skeleton.shadowRoot?.querySelector(':not(style)')).toBeNull();
  });
});

describe('semantics and focus', () => {
  it('decorative: aria-hidden, no role, no focus', async () => {
    const { skeleton } = await mountIn('block');
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.hasAttribute('role')).toBe(false);
    const before = document.activeElement;
    skeleton.focus();
    expect(document.activeElement).toBe(before);
    expect(skeleton.hasAttribute('tabindex')).toBe(false);
  });

  it('does not set aria-busy: the loading container announces the wait', async () => {
    const { parent, skeleton } = await mountIn('block');
    expect(skeleton.hasAttribute('aria-busy')).toBe(false);
    expect(parent.hasAttribute('aria-busy')).toBe(false);
  });

  it('has no slot and no part', async () => {
    const { skeleton } = await mountIn('block');
    expect(skeleton.shadowRoot?.querySelector('slot')).toBeNull();
    expect(skeleton.shadowRoot?.querySelector('[part]')).toBeNull();
  });
});

describe('invalid input', () => {
  it('unknown shape: 0x0 and one console.error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { skeleton } = await mountIn('block', 'circle');
    const box = skeleton.getBoundingClientRect();
    expect(box.width).toBe(0);
    expect(box.height).toBe(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('[nph-skeleton]');
  });

  it('there is no visual fallback: the shape does not turn into a line', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { skeleton } = await mountIn('block', 'avatar');
    expect(skeleton.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(skeleton).display).toBe('none');
  });

  it('a valid shape set later draws it', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { skeleton } = await mountIn('block', 'circle');
    skeleton.setAttribute('shape', 'avatar-md');
    await skeleton.updateComplete;
    expect(skeleton.hasAttribute('data-nph-rendered')).toBe(true);
    expect(skeleton.getBoundingClientRect().width).toBeGreaterThan(0);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css, and these are the ones the contract names', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(new Set(used)).toEqual(
      new Set([
        '--nph-color-muted',
        '--nph-skeleton-line-height',
        '--nph-radius-inner',
        '--nph-radius-control',
        '--nph-avatar-size-sm',
        '--nph-avatar-size-md',
        '--nph-avatar-size-lg',
        '--nph-avatar-radius-sm',
        '--nph-avatar-radius-md',
        '--nph-avatar-radius-lg',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('the CSS has no literal design value and no motion', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
    expect(cssWithoutComments).not.toMatch(/\b(animation|transition|@keyframes)\b/);
  });

  it('design.md keeps skeleton/line-height for the line of nph-skeleton alone', () => {
    const block = designMd.slice(designMd.indexOf('tokens_skeleton:'));
    expect(block).toContain("css: '--nph-skeleton-line-height'");
    expect(block).toMatch(/USE only on the line shape of nph-skeleton/);
  });

  it('design.md says that avatar/radius-* is the avatar corner and the avatar is never a circle', () => {
    expect(designMd).toMatch(/never a circle/);
  });
});
