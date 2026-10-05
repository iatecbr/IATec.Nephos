/**
 * Testes do `nph-spinner` (P66), em navegador de verdade (P21, item 5): giro,
 * movimento reduzido e medida so existem onde ha layout e animacao.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cdp } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-spinner.css?raw';
import { NphSpinner } from './nph-spinner';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

async function mount(properties: Partial<Record<'size' | 'label', string | null>> = {}): Promise<NphSpinner> {
  const element = document.createElement('nph-spinner');
  Object.assign(element, properties);
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function glyphOf(element: NphSpinner): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>('nph-icon') ?? null;
}

describe('registro e API', () => {
  it('define nph-spinner uma unica vez', () => {
    expect(customElements.get('nph-spinner')).toBe(NphSpinner);
  });

  it('a API publica e exatamente size e label', () => {
    const declared = [...(NphSpinner as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(new Set(declared)).toEqual(new Set(['size', 'label']));
  });

  it('size vale sm por padrao e reflete no atributo', async () => {
    const spinner = await mount();
    expect(spinner.size).toBe('sm');
    expect(spinner.getAttribute('size')).toBe('sm');
    spinner.size = 'md';
    await spinner.updateComplete;
    expect(spinner.getAttribute('size')).toBe('md');
  });
});

describe('desenho', () => {
  it('desenha o circle-notch do nph-icon, no mesmo tamanho', async () => {
    for (const size of ['sm', 'md'] as const) {
      const spinner = await mount({ size });
      const glyph = glyphOf(spinner);
      expect(glyph?.getAttribute('name')).toBe('circle-notch');
      expect(glyph?.getAttribute('size')).toBe(size);
      spinner.remove();
    }
  });

  it('medida: sm 16 e md 20, quadrado', async () => {
    for (const [size, side] of [['sm', 16], ['md', 20]] as const) {
      const spinner = await mount({ size });
      const box = (glyphOf(spinner) as HTMLElement).getBoundingClientRect();
      expect(box.width, size).toBe(side);
      expect(box.height, size).toBe(side);
      spinner.remove();
    }
  });

  it('a cor herda do contexto', async () => {
    const spinner = await mount();
    spinner.style.color = 'rgb(1, 2, 3)';
    const svg = (glyphOf(spinner) as HTMLElement).shadowRoot?.querySelector('svg') as SVGElement;
    expect(getComputedStyle(svg).color).toBe('rgb(1, 2, 3)');
  });
});

describe('movimento', () => {
  it('gira por padrao, com a duracao e a curva de motion/loop', async () => {
    const spinner = await mount();
    const style = getComputedStyle(glyphOf(spinner) as HTMLElement);
    expect(style.animationName).toBe('nph-spinner-turn');
    expect(style.animationIterationCount).toBe('infinite');
    expect(style.animationDuration).toBe('0.8s');
    expect(style.animationTimingFunction).toBe('cubic-bezier(0, 0, 1, 1)');
  });

  it('com movimento reduzido, o giro para', async () => {
    const session = cdp();
    try {
      await session.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      const spinner = await mount();
      expect(getComputedStyle(glyphOf(spinner) as HTMLElement).animationName).toBe('none');
    } finally {
      /* Volta ao padrao do navegador de teste; `features: []` nao desfaz. */
      await session.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
      });
    }
    /* A emulacao nao vaza para os testes seguintes. */
    await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
  });
});

describe('semantica e foco', () => {
  it('sem label: fora da arvore de acessibilidade', async () => {
    for (const label of [null, '', '   ']) {
      const spinner = await mount({ label });
      expect(spinner.getAttribute('aria-hidden'), JSON.stringify(label)).toBe('true');
      expect(spinner.hasAttribute('role')).toBe(false);
      expect(spinner.hasAttribute('aria-label')).toBe(false);
      spinner.remove();
    }
  });

  it('com label: role img e nome acessivel', async () => {
    const spinner = await mount({ label: '  Salvando o cadastro  ' });
    expect(spinner.getAttribute('role')).toBe('img');
    expect(spinner.getAttribute('aria-label')).toBe('Salvando o cadastro');
    expect(spinner.hasAttribute('aria-hidden')).toBe(false);
  });

  it('nao recebe foco e nao tem elemento focavel', async () => {
    const spinner = await mount({ label: 'Salvando o cadastro' });
    const before = document.activeElement;
    spinner.focus();
    expect(document.activeElement).toBe(before);
    expect(spinner.hasAttribute('tabindex')).toBe(false);
    expect(spinner.shadowRoot?.querySelectorAll('a, button, input, [tabindex]').length).toBe(0);
  });
});

describe('entrada invalida', () => {
  it('size fora de sm e md: nada desenhado, 0x0, sem nome, um console.error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const spinner = await mount({ size: 'lg', label: 'Carregando os dados' });
    expect(glyphOf(spinner)).toBeNull();
    const box = spinner.getBoundingClientRect();
    expect(box.width).toBe(0);
    expect(box.height).toBe(0);
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
    expect(spinner.hasAttribute('role')).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('[nph-spinner]');
  });
});

describe('contrato de token', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('toda custom property do CSS existe no tokens.css', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(used).toEqual(expect.arrayContaining(['--nph-motion-loop-duration', '--nph-motion-loop-easing']));
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('o CSS nao tem valor literal de design alem da volta 1turn', () => {
    const withoutTurn = cssWithoutComments.replace('rotate(1turn)', '');
    expect(withoutTurn).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(withoutTurn).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(withoutTurn).not.toMatch(/\d(px|rem|em|ms|s|deg|turn)\b/);
  });
});
