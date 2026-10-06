/**
 * Tests of `nph-separator` (P66), in a real browser (P21, item 5): thickness,
 * container filling and resolved color only exist where there is layout.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-separator.css?raw';
import { NphSeparator } from './nph-separator';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

/** A 200 x 120 container with the divider between two blocks. */
async function mountIn(display: string, orientation?: string): Promise<{ parent: HTMLElement; separator: NphSeparator }> {
  const parent = document.createElement('div');
  parent.style.cssText = `display: ${display}; inline-size: 200px; block-size: 120px;`;
  const separator = document.createElement('nph-separator');
  if (orientation !== undefined) separator.setAttribute('orientation', orientation);
  parent.append(document.createElement('span'), separator, document.createElement('span'));
  document.body.append(parent);
  await separator.updateComplete;
  return { parent, separator };
}

describe('registration and API', () => {
  it('defines nph-separator exactly once', () => {
    expect(customElements.get('nph-separator')).toBe(NphSeparator);
  });

  it('the public API is exactly orientation', () => {
    const declared = [...(NphSeparator as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['orientation']);
  });

  it('orientation is horizontal by default and reflects to the attribute', async () => {
    const { separator } = await mountIn('block');
    expect(separator.orientation).toBe('horizontal');
    expect(separator.getAttribute('orientation')).toBe('horizontal');
  });
});

describe('drawing', () => {
  it('horizontal in a block parent: thickness 1, parent width', async () => {
    const { separator } = await mountIn('block');
    const box = separator.getBoundingClientRect();
    expect(box.height).toBe(1);
    expect(box.width).toBe(200);
  });

  it('horizontal in a column flex: parent width', async () => {
    const { separator } = await mountIn('flex; flex-direction: column', 'horizontal');
    expect(separator.getBoundingClientRect().width).toBe(200);
  });

  it('vertical in a row flex: thickness 1, parent height, even with the parent centering', async () => {
    /* `align-items: center` removes the parent's stretch: the piece itself does the filling. */
    const { separator } = await mountIn('flex; align-items: center', 'vertical');
    const box = separator.getBoundingClientRect();
    expect(box.width).toBe(1);
    expect(box.height).toBe(120);
  });

  it('vertical in a grid: grid row height', async () => {
    const { separator } = await mountIn('grid; grid-auto-flow: column', 'vertical');
    expect(separator.getBoundingClientRect().height).toBe(120);
  });

  it('the color is color/border', async () => {
    const { separator } = await mountIn('block');
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'var(--nph-color-border)';
    document.body.append(probe);
    expect(getComputedStyle(separator).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
  });
});

describe('semantics and focus', () => {
  it('decorative: aria-hidden, no role, no focus', async () => {
    const { separator } = await mountIn('block');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.hasAttribute('role')).toBe(false);
    const before = document.activeElement;
    separator.focus();
    expect(document.activeElement).toBe(before);
    expect(separator.hasAttribute('tabindex')).toBe(false);
  });
});

describe('invalid input', () => {
  it('unknown orientation: 0x0 and one console.error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { separator } = await mountIn('block', 'diagonal');
    const box = separator.getBoundingClientRect();
    expect(box.width).toBe(0);
    expect(box.height).toBe(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('[nph-separator]');
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(new Set(used)).toEqual(new Set(['--nph-color-border', '--nph-border-width']));
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('the CSS has no literal design value', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
  });
});
