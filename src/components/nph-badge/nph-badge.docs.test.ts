/**
 * Contrato da pagina Documentation do `nph-badge`: indice sem ancora orfa nos
 * tres idiomas, nenhum marcador sobrando e o dicionario `badgeDocs` com a mesma
 * forma em pt-BR, en e es (o `test:i18n` so le pares `.md`).
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import { Documentation } from './nph-badge.docs.stories';

afterEach(() => {
  document.body.replaceChildren();
});

const LOCALES = ['pt-BR', 'en', 'es'] as const;

function renderInLocale(locale: string): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  const draw = Documentation.render as unknown as (args: unknown, context: unknown) => TemplateResult;
  render(draw({}, { globals: { locale } }), target);
  return target;
}

/** A forma de um valor: chaves de objeto e tamanho de lista, sem o texto. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]));
  }
  return typeof value;
}

describe('Documentação do nph-badge', () => {
  for (const locale of LOCALES) {
    it(`${locale}: todo link aponta para uma secao e toda secao tem link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: nenhum marcador {nome} sobra na pagina`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: toda instancia da pagina renderiza`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-badge')] as Array<HTMLElement & { updateComplete: Promise<unknown> }>;
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
      }
    });
  }

  it('en e es tem a mesma forma de pt-BR', () => {
    const source = shape(translations('pt-BR').badgeDocs);
    expect(shape(translations('en').badgeDocs)).toEqual(source);
    expect(shape(translations('es').badgeDocs)).toEqual(source);
  });
});
