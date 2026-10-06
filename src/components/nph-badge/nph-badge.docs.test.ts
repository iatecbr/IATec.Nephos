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
import * as validation from './nph-badge.stories';

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

describe('Validação do nph-badge: texto so do dicionario', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Tudo que a pessoa le: o texto da pagina e os textos passados as pecas. */
  function visibleText(target: HTMLElement): string {
    const attributes = [...target.querySelectorAll('[text], [label], [aria-label]')].flatMap((el) =>
      ['text', 'label', 'aria-label'].map((name) => el.getAttribute(name) ?? ''),
    );
    return [target.textContent ?? '', ...attributes].join(' ');
  }

  /** Os textos de pt-BR que nao existem em en, achatados. */
  function portugueseOnly(): string[] {
    const flat = (value: unknown): string[] =>
      Array.isArray(value) ? value.flatMap(flat) : typeof value === 'object' && value !== null ? Object.values(value).flatMap(flat) : [String(value)];
    const english = flat(translations('en').badgeValidation);
    return flat(translations('pt-BR').badgeValidation).filter((value) => !english.includes(value));
  }

  it('toda story de Validacao le o dicionario', () => {
    expect(stories.length).toBeGreaterThan(0);
    expect(portugueseOnly().length).toBeGreaterThan(0);
  });

  for (const [name, story] of stories) {
    it(`${name}: em en, nenhum texto de pt-BR aparece`, () => {
      const target = document.createElement('div');
      document.body.append(target);
      render(story.render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
      const text = visibleText(target);
      for (const value of portugueseOnly()) {
        expect(text, value).not.toContain(value);
      }
    });
  }

  it('en e es tem a mesma forma de pt-BR', () => {
    const source = shape(translations('pt-BR').badgeValidation);
    expect(shape(translations('en').badgeValidation)).toEqual(source);
    expect(shape(translations('es').badgeValidation)).toEqual(source);
  });
});
