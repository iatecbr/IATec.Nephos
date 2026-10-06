/**
 * Tests of `nph-kbd` (P66), in a real browser (P21, item 5): the key's size
 * depends on the token font being loaded and on layout.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-kbd.css?raw';
import { NphKbd } from './nph-kbd';

/** Accepted component `772:3`: 16 x 24 with "K". */
const FIGMA_WIDTH = 16;
const FIGMA_HEIGHT = 24;
/** Figma rounds the text width; the tooltip came out 0.18 to 0.59 smaller. */
const WIDTH_TOLERANCE = 0.6;

beforeAll(async () => {
  /* Without the token font, the measurement would use the browser's fallback font. */
  await document.fonts.load('500 12px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

async function mount(text?: string): Promise<NphKbd> {
  const element = document.createElement('nph-kbd');
  if (text !== undefined) element.text = text;
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function kbdOf(element: NphKbd): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>('kbd') ?? null;
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

describe('registration and API', () => {
  it('defines nph-kbd exactly once', () => {
    expect(customElements.get('nph-kbd')).toBe(NphKbd);
  });

  it('the public API is exactly text, empty by default', async () => {
    const declared = [...(NphKbd as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['text']);
    expect((await mount()).text).toBe('');
  });
});

describe('content and semantics', () => {
  it('shows the key inside <kbd>, without surrounding spaces', async () => {
    const kbd = await mount('  Esc ');
    expect(kbdOf(kbd)?.textContent).toBe('Esc');
  });

  it('empty or only spaces: nothing is shown, 0x0, no console.error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    for (const text of ['', '   ']) {
      const kbd = await mount(text);
      expect(kbdOf(kbd), JSON.stringify(text)).toBeNull();
      const box = kbd.getBoundingClientRect();
      expect(box.width).toBe(0);
      expect(box.height).toBe(0);
      kbd.remove();
    }
    expect(error).not.toHaveBeenCalled();
  });

  it('does not receive focus and has no extra role', async () => {
    const kbd = await mount('K');
    const before = document.activeElement;
    kbd.focus();
    expect(document.activeElement).toBe(before);
    expect(kbd.hasAttribute('tabindex')).toBe(false);
    expect(kbd.hasAttribute('role')).toBe(false);
    expect(kbd.hasAttribute('aria-hidden')).toBe(false);
  });
});

describe('anatomy', () => {
  it('Figma size with "K": height 24 and width 16', async () => {
    const box = (await mount('K')).getBoundingClientRect();
    expect(box.height).toBe(FIGMA_HEIGHT);
    expect(Math.abs(box.width - FIGMA_WIDTH)).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  });

  it('background, text, radius and border resolve to the tokens', async () => {
    const style = getComputedStyle(kbdOf(await mount('K')) as HTMLElement);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
    expect(style.color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-inner'));
    expect(style.boxShadow).toContain(resolved('color', '--nph-color-border'));
    expect(style.boxShadow).toContain('inset');
    expect(style.fontFamily).toContain('Noto Sans');
    expect(style.fontWeight).toBe('500');
  });

  it('long-text key: one line, height 24, the box follows the text', async () => {
    const short = (await mount('K')).getBoundingClientRect().width;
    const kbd = await mount('Page Down');
    const box = kbd.getBoundingClientRect();
    expect(box.height).toBe(FIGMA_HEIGHT);
    expect(box.width).toBeGreaterThan(short);
    const inner = kbdOf(kbd) as HTMLElement;
    expect(inner.scrollWidth).toBeLessThanOrEqual(inner.clientWidth);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(used.length).toBeGreaterThan(0);
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
