/**
 * Testes do `nph-separator` (P66), em navegador de verdade (P21, item 5):
 * espessura, preenchimento do conteiner e cor resolvida so existem onde ha
 * layout.
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

/** Um conteiner de 200 x 120 com o divisor entre dois blocos. */
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

describe('registro e API', () => {
  it('define nph-separator uma unica vez', () => {
    expect(customElements.get('nph-separator')).toBe(NphSeparator);
  });

  it('a API publica e exatamente orientation', () => {
    const declared = [...(NphSeparator as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['orientation']);
  });

  it('orientation vale horizontal por padrao e reflete no atributo', async () => {
    const { separator } = await mountIn('block');
    expect(separator.orientation).toBe('horizontal');
    expect(separator.getAttribute('orientation')).toBe('horizontal');
  });
});

describe('desenho', () => {
  it('horizontal em pai de bloco: espessura 1, largura do pai', async () => {
    const { separator } = await mountIn('block');
    const box = separator.getBoundingClientRect();
    expect(box.height).toBe(1);
    expect(box.width).toBe(200);
  });

  it('horizontal em flex em coluna: largura do pai', async () => {
    const { separator } = await mountIn('flex; flex-direction: column', 'horizontal');
    expect(separator.getBoundingClientRect().width).toBe(200);
  });

  it('vertical em flex em linha: espessura 1, altura do pai, mesmo com o pai centralizando', async () => {
    /* `align-items: center` tira o estica do pai: quem preenche e a propria peca. */
    const { separator } = await mountIn('flex; align-items: center', 'vertical');
    const box = separator.getBoundingClientRect();
    expect(box.width).toBe(1);
    expect(box.height).toBe(120);
  });

  it('vertical em grid: altura da linha do grid', async () => {
    const { separator } = await mountIn('grid; grid-auto-flow: column', 'vertical');
    expect(separator.getBoundingClientRect().height).toBe(120);
  });

  it('a cor e color/border', async () => {
    const { separator } = await mountIn('block');
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'var(--nph-color-border)';
    document.body.append(probe);
    expect(getComputedStyle(separator).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
  });
});

describe('semantica e foco', () => {
  it('decorativo: aria-hidden, sem role, sem foco', async () => {
    const { separator } = await mountIn('block');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.hasAttribute('role')).toBe(false);
    const before = document.activeElement;
    separator.focus();
    expect(document.activeElement).toBe(before);
    expect(separator.hasAttribute('tabindex')).toBe(false);
  });
});

describe('entrada invalida', () => {
  it('orientation desconhecida: 0x0 e um console.error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { separator } = await mountIn('block', 'diagonal');
    const box = separator.getBoundingClientRect();
    expect(box.width).toBe(0);
    expect(box.height).toBe(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('[nph-separator]');
  });
});

describe('contrato de token', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('toda custom property do CSS existe no tokens.css', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(new Set(used)).toEqual(new Set(['--nph-color-border', '--nph-border-width']));
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('o CSS nao tem valor literal de design', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
  });
});
