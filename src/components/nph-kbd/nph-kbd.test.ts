/**
 * Testes do `nph-kbd` (P66), em navegador de verdade (P21, item 5): a medida
 * da tecla depende da fonte do token carregada e do layout.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-kbd.css?raw';
import { NphKbd } from './nph-kbd';

/** Componente aceito `772:3`: 16 x 24 com "K". */
const FIGMA_WIDTH = 16;
const FIGMA_HEIGHT = 24;
/** O Figma arredonda a largura do texto; o tooltip saiu de 0,18 a 0,59 menor. */
const WIDTH_TOLERANCE = 0.6;

beforeAll(async () => {
  /* Sem a fonte do token, a medida sairia na fonte de reserva do navegador. */
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

describe('registro e API', () => {
  it('define nph-kbd uma unica vez', () => {
    expect(customElements.get('nph-kbd')).toBe(NphKbd);
  });

  it('a API publica e exatamente text, vazio por padrao', async () => {
    const declared = [...(NphKbd as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['text']);
    expect((await mount()).text).toBe('');
  });
});

describe('conteudo e semantica', () => {
  it('mostra a tecla dentro de <kbd>, sem espacos nas pontas', async () => {
    const kbd = await mount('  Esc ');
    expect(kbdOf(kbd)?.textContent).toBe('Esc');
  });

  it('vazio ou so espacos: nada e mostrado, 0x0, sem console.error', async () => {
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

  it('nao recebe foco e nao tem role extra', async () => {
    const kbd = await mount('K');
    const before = document.activeElement;
    kbd.focus();
    expect(document.activeElement).toBe(before);
    expect(kbd.hasAttribute('tabindex')).toBe(false);
    expect(kbd.hasAttribute('role')).toBe(false);
    expect(kbd.hasAttribute('aria-hidden')).toBe(false);
  });
});

describe('anatomia', () => {
  it('medida do Figma com "K": altura 24 e largura 16', async () => {
    const box = (await mount('K')).getBoundingClientRect();
    expect(box.height).toBe(FIGMA_HEIGHT);
    expect(Math.abs(box.width - FIGMA_WIDTH)).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  });

  it('fundo, texto, raio e borda resolvem nos tokens', async () => {
    const style = getComputedStyle(kbdOf(await mount('K')) as HTMLElement);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
    expect(style.color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-inner'));
    expect(style.boxShadow).toContain(resolved('color', '--nph-color-border'));
    expect(style.boxShadow).toContain('inset');
    expect(style.fontFamily).toContain('Noto Sans');
    expect(style.fontWeight).toBe('500');
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
    expect(cssWithoutComments).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
  });
});
