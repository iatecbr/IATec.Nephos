/**
 * Tests of `nph-tooltip` (P65), in a real browser (P21, item 5):
 * line measure, word breaking and a resolved custom property only exist
 * where there is layout and a loaded font.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import '@fontsource/noto-sans/latin-400.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-tooltip.css?raw';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import { translations } from '../../../.storybook/i18n/index.js';
import { NphTooltip } from './nph-tooltip';
import { OneLine, TwoLines } from './nph-tooltip.stories';

const ONE_LINE = 'Explica o que o campo pede.';
const TWO_LINES = 'Use o nome como está no documento, sem abreviar nem trocar a ordem.';
const MAX_WIDTH = 235;
const MAX_HEIGHT = 44;
const LINE_HEIGHT = 24;

beforeAll(async () => {
  /* Without the token font, the measure would come out in the browser fallback font. */
  await document.fonts.load('400 12px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
});

async function mount(properties: Partial<Pick<NphTooltip, 'text' | 'open'>>): Promise<NphTooltip> {
  const element = document.createElement('nph-tooltip');
  Object.assign(element, properties);
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function bubbleOf(element: NphTooltip): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>('.bubble') ?? null;
}

/** The bubble text node. Lit puts comment markers around it. */
function textNodeOf(bubble: HTMLElement): Text {
  const textNode = [...bubble.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
  expect(textNode).toBeDefined();
  return textNode as Text;
}

/** Distinct tops of the text lines, read from the rectangles of the text node itself. */
function lineTops(bubble: HTMLElement): number[] {
  const range = document.createRange();
  range.selectNodeContents(textNodeOf(bubble));
  const tops = [...range.getClientRects()].map((rect) => Math.round(rect.top));
  return [...new Set(tops)];
}

describe('registration and API', () => {
  it('defines nph-tooltip only once', () => {
    expect(customElements.get('nph-tooltip')).toBe(NphTooltip);
  });

  it('the public API is exactly text and open', () => {
    const declared = Object.keys(
      Object.fromEntries((NphTooltip as unknown as { elementProperties: Map<string, unknown> }).elementProperties),
    );
    expect(new Set(declared)).toEqual(new Set(['text', 'open']));
  });

  it('open reflects to the attribute', async () => {
    const tooltip = await mount({ text: ONE_LINE, open: true });
    expect(tooltip.hasAttribute('open')).toBe(true);
    tooltip.open = false;
    await tooltip.updateComplete;
    expect(tooltip.hasAttribute('open')).toBe(false);
  });
});

describe('semantics and focus', () => {
  it('the host is role="status" closed and open', async () => {
    const tooltip = await mount({ text: ONE_LINE });
    expect(tooltip.getAttribute('role')).toBe('status');
    tooltip.open = true;
    await tooltip.updateComplete;
    expect(tooltip.getAttribute('role')).toBe('status');
  });

  it('does not receive focus and has no focusable element', async () => {
    const tooltip = await mount({ text: ONE_LINE, open: true });
    const before = document.activeElement;
    tooltip.focus();
    expect(document.activeElement).toBe(before);
    expect(tooltip.hasAttribute('tabindex')).toBe(false);
    const focusable = tooltip.shadowRoot?.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    expect(focusable?.length ?? 0).toBe(0);
  });
});

describe('open and close', () => {
  it('closed: no bubble and no text', async () => {
    const tooltip = await mount({ text: ONE_LINE });
    expect(bubbleOf(tooltip)).toBeNull();
    expect(tooltip.shadowRoot?.textContent ?? '').not.toContain(ONE_LINE);
  });

  it('open with empty or whitespace-only text: no bubble', async () => {
    for (const text of ['', '   ']) {
      const tooltip = await mount({ text, open: true });
      expect(bubbleOf(tooltip), JSON.stringify(text)).toBeNull();
      tooltip.remove();
    }
  });

  it('open: shows the text', async () => {
    const tooltip = await mount({ text: ONE_LINE, open: true });
    expect(bubbleOf(tooltip)?.textContent).toBe(ONE_LINE);
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
    expect(cssWithoutComments).not.toMatch(/\d(px|rem|ms)\b/);
  });

  it('computed: no ellipsis, no automatic hyphenation, border-box', async () => {
    const tooltip = await mount({ text: TWO_LINES, open: true });
    const style = getComputedStyle(bubbleOf(tooltip) as HTMLElement);
    expect(style.textOverflow).not.toBe('ellipsis');
    expect(style.hyphens).not.toBe('auto');
    expect(style.wordBreak).toBe('normal');
    expect(style.boxSizing).toBe('border-box');
  });
});

describe('measure', () => {
  it('Figma width and height limits: 235 and 44', async () => {
    const tooltip = await mount({ text: ONE_LINE, open: true });
    const style = getComputedStyle(bubbleOf(tooltip) as HTMLElement);
    expect(style.maxWidth).toBe(MAX_WIDTH + 'px');
    expect(style.maxHeight).toBe(MAX_HEIGHT + 'px');
  });

  it('short text: one line of 24, up to 235 wide', async () => {
    const tooltip = await mount({ text: ONE_LINE, open: true });
    const bubble = bubbleOf(tooltip) as HTMLElement;
    const box = bubble.getBoundingClientRect();
    expect(Math.abs(box.height - LINE_HEIGHT)).toBeLessThanOrEqual(1);
    expect(box.width).toBeLessThanOrEqual(MAX_WIDTH);
    expect(lineTops(bubble)).toHaveLength(1);
  });

  it('Figma text: two lines, fits in 235 × 44, no overflow', async () => {
    const tooltip = await mount({ text: TWO_LINES, open: true });
    const bubble = bubbleOf(tooltip) as HTMLElement;
    const box = bubble.getBoundingClientRect();
    expect(box.width).toBeLessThanOrEqual(MAX_WIDTH);
    expect(box.height).toBeLessThanOrEqual(MAX_HEIGHT);
    expect(lineTops(bubble)).toHaveLength(2);
    expect(bubble.scrollHeight).toBeLessThanOrEqual(bubble.clientHeight);
  });

  it('no word of the two-line text was broken', async () => {
    const tooltip = await mount({ text: TWO_LINES, open: true });
    const bubble = bubbleOf(tooltip) as HTMLElement;
    const textNode = textNodeOf(bubble);
    expect(textNode.data).toBe(TWO_LINES);
    let offset = 0;
    for (const word of TWO_LINES.split(' ')) {
      const start = TWO_LINES.indexOf(word, offset);
      const range = document.createRange();
      range.setStart(textNode, start);
      range.setEnd(textNode, start + word.length);
      expect(range.getClientRects().length, word).toBe(1);
      offset = start + word.length;
    }
  });
});

describe('nph-tooltip Validation: dictionary text', () => {
  const LOCALES = ['pt-BR', 'en', 'es'] as const;
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };

  async function renderStory(story: Renderable, locale: string): Promise<NphTooltip> {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    const element = target.querySelector('nph-tooltip') as NphTooltip;
    await element.updateComplete;
    return element;
  }

  for (const locale of LOCALES) {
    it(`${locale}: one line takes one line, and two lines take two, within 235 x 44`, async () => {
      const texts = translations(locale).tooltipValidation;
      const one = await renderStory(OneLine as Renderable, locale);
      const two = await renderStory(TwoLines as Renderable, locale);
      expect(one.text).toBe(texts.oneLine);
      expect(two.text).toBe(texts.twoLines);
      const oneBubble = bubbleOf(one) as HTMLElement;
      const twoBubble = bubbleOf(two) as HTMLElement;
      expect(lineTops(oneBubble)).toHaveLength(1);
      expect(lineTops(twoBubble)).toHaveLength(2);
      expect(twoBubble.getBoundingClientRect().width).toBeLessThanOrEqual(MAX_WIDTH + 0.5);
      expect(twoBubble.getBoundingClientRect().height).toBeLessThanOrEqual(MAX_HEIGHT + 0.5);
    });
  }

  it('en: no pt-BR text appears', async () => {
    const english = Object.values(translations('en').tooltipValidation) as string[];
    const portuguese = (Object.values(translations('pt-BR').tooltipValidation) as string[]).filter(
      (value) => !english.includes(value),
    );
    expect(portuguese.length).toBeGreaterThan(0);
    for (const story of [OneLine, TwoLines] as Renderable[]) {
      const element = await renderStory(story, 'en');
      for (const value of portuguese) {
        expect(element.text).not.toBe(value);
        expect(bubbleOf(element)?.textContent ?? '').not.toContain(value);
      }
    }
  });

  it('en and es have the same keys as pt-BR', () => {
    const keys = Object.keys(translations('pt-BR').tooltipValidation);
    expect(Object.keys(translations('en').tooltipValidation)).toEqual(keys);
    expect(Object.keys(translations('es').tooltipValidation)).toEqual(keys);
  });
});
