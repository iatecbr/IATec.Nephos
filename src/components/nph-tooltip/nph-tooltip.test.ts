/**
 * Testes do `nph-tooltip` (P65), em navegador de verdade (P21, item 5):
 * medida de linha, quebra de palavra e custom property resolvida so existem
 * onde ha layout e fonte carregada.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import '@fontsource/noto-sans/latin-400.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-tooltip.css?raw';
import { NphTooltip } from './nph-tooltip';

const ONE_LINE = 'Explica o que o campo pede.';
const TWO_LINES = 'Use o nome como está no documento, sem abreviar nem trocar a ordem.';
const MAX_WIDTH = 235;
const MAX_HEIGHT = 44;
const LINE_HEIGHT = 24;

beforeAll(async () => {
  /* Sem a fonte do token, a medida sairia na fonte de reserva do navegador. */
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

/** O no de texto do balao. O Lit poe marcadores de comentario ao redor dele. */
function textNodeOf(bubble: HTMLElement): Text {
  const textNode = [...bubble.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
  expect(textNode).toBeDefined();
  return textNode as Text;
}

/** Topos distintos das linhas do texto, lidos dos retangulos do proprio no de texto. */
function lineTops(bubble: HTMLElement): number[] {
  const range = document.createRange();
  range.selectNodeContents(textNodeOf(bubble));
  const tops = [...range.getClientRects()].map((rect) => Math.round(rect.top));
  return [...new Set(tops)];
}

describe('registro e API', () => {
  it('define nph-tooltip uma unica vez', () => {
    expect(customElements.get('nph-tooltip')).toBe(NphTooltip);
  });

  it('a API publica e exatamente text e open', () => {
    const declared = Object.keys(
      Object.fromEntries((NphTooltip as unknown as { elementProperties: Map<string, unknown> }).elementProperties),
    );
    expect(new Set(declared)).toEqual(new Set(['text', 'open']));
  });

  it('open reflete no atributo', async () => {
    const tooltip = await mount({ text: ONE_LINE, open: true });
    expect(tooltip.hasAttribute('open')).toBe(true);
    tooltip.open = false;
    await tooltip.updateComplete;
    expect(tooltip.hasAttribute('open')).toBe(false);
  });
});

describe('semantica e foco', () => {
  it('o host e role="status" fechado e aberto', async () => {
    const tooltip = await mount({ text: ONE_LINE });
    expect(tooltip.getAttribute('role')).toBe('status');
    tooltip.open = true;
    await tooltip.updateComplete;
    expect(tooltip.getAttribute('role')).toBe('status');
  });

  it('nao recebe foco e nao tem elemento focavel', async () => {
    const tooltip = await mount({ text: ONE_LINE, open: true });
    const before = document.activeElement;
    tooltip.focus();
    expect(document.activeElement).toBe(before);
    expect(tooltip.hasAttribute('tabindex')).toBe(false);
    const focusable = tooltip.shadowRoot?.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    expect(focusable?.length ?? 0).toBe(0);
  });
});

describe('abrir e fechar', () => {
  it('fechado: sem balao e sem o texto', async () => {
    const tooltip = await mount({ text: ONE_LINE });
    expect(bubbleOf(tooltip)).toBeNull();
    expect(tooltip.shadowRoot?.textContent ?? '').not.toContain(ONE_LINE);
  });

  it('aberto com texto vazio ou so espacos: sem balao', async () => {
    for (const text of ['', '   ']) {
      const tooltip = await mount({ text, open: true });
      expect(bubbleOf(tooltip), JSON.stringify(text)).toBeNull();
      tooltip.remove();
    }
  });

  it('aberto: mostra o texto', async () => {
    const tooltip = await mount({ text: ONE_LINE, open: true });
    expect(bubbleOf(tooltip)?.textContent).toBe(ONE_LINE);
  });
});

describe('contrato de token', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('toda custom property do CSS existe no tokens.css', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(used.length).toBeGreaterThan(0);
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('o CSS nao tem valor literal de design', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d(px|rem|ms)\b/);
  });

  it('computado: sem reticencias, sem hifenizacao automatica, border-box', async () => {
    const tooltip = await mount({ text: TWO_LINES, open: true });
    const style = getComputedStyle(bubbleOf(tooltip) as HTMLElement);
    expect(style.textOverflow).not.toBe('ellipsis');
    expect(style.hyphens).not.toBe('auto');
    expect(style.wordBreak).toBe('normal');
    expect(style.boxSizing).toBe('border-box');
  });
});

describe('medida', () => {
  it('limites de largura e altura do Figma: 235 e 44', async () => {
    const tooltip = await mount({ text: ONE_LINE, open: true });
    const style = getComputedStyle(bubbleOf(tooltip) as HTMLElement);
    expect(style.maxWidth).toBe(MAX_WIDTH + 'px');
    expect(style.maxHeight).toBe(MAX_HEIGHT + 'px');
  });

  it('texto curto: uma linha de 24, ate 235 de largura', async () => {
    const tooltip = await mount({ text: ONE_LINE, open: true });
    const bubble = bubbleOf(tooltip) as HTMLElement;
    const box = bubble.getBoundingClientRect();
    expect(Math.abs(box.height - LINE_HEIGHT)).toBeLessThanOrEqual(1);
    expect(box.width).toBeLessThanOrEqual(MAX_WIDTH);
    expect(lineTops(bubble)).toHaveLength(1);
  });

  it('texto do Figma: duas linhas, cabe em 235 × 44, sem transbordo', async () => {
    const tooltip = await mount({ text: TWO_LINES, open: true });
    const bubble = bubbleOf(tooltip) as HTMLElement;
    const box = bubble.getBoundingClientRect();
    expect(box.width).toBeLessThanOrEqual(MAX_WIDTH);
    expect(box.height).toBeLessThanOrEqual(MAX_HEIGHT);
    expect(lineTops(bubble)).toHaveLength(2);
    expect(bubble.scrollHeight).toBeLessThanOrEqual(bubble.clientHeight);
  });

  it('nenhuma palavra do texto de duas linhas foi partida', async () => {
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
