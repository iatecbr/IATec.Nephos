/**
 * Contrato da pagina Documentacao do `nph-icon` e dos textos de Validacao:
 * indice sem ancora orfa, nos tres idiomas, e a regra vigente do `solid`
 * (ficha `nph-icon`: regular e solid existem para todos os nomes do nucleo).
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { format, translations } from '../../../.storybook/i18n/index.js';
import { Documentacao, IconsOverview } from './nph-icon.docs.stories';
import { CATEGORIES, CORE_TOTAL } from './nph-icon.demo';

afterEach(() => {
  document.body.replaceChildren();
});

const DICTIONARIES = { 'pt-BR': translations('pt-BR'), en: translations('en'), es: translations('es') } as const;

/** Restricao antiga do solid a star, em qualquer ordem dentro da frase. */
const SOLID_ONLY_ON_STAR = /solid[^.]*\bstar\b|\bstar\b[^.]*solid/i;

function renderInLocale(locale: string, story: { render?: unknown } = Documentacao): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  const draw = story.render as (args: unknown, context: unknown) => TemplateResult;
  render(draw({}, { globals: { locale: locale } }), target);
  return target;
}

describe('Documentação — indice', () => {
  for (const locale of Object.keys(DICTIONARIES)) {
    it(`${locale}: todo link aponta para uma secao e toda secao tem link`, () => {
      const target = renderInLocale(locale);
      const targets = [...target.querySelectorAll('nav a')].map((a) =>
        (a.getAttribute('href') ?? '').replace(/^#/, ''),
      );
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);

      expect(targets.length).toBeGreaterThan(0);
      for (const id of targets) {
        expect(target.querySelector(`#${id}`), `âncora #${id}`).not.toBeNull();
      }
      expect([...sections].sort()).toEqual([...targets].sort());
    });
  }
});

describe('regra vigente do solid nos textos', () => {
  for (const [locale, dictionary] of Object.entries(DICTIONARIES)) {
    it(`${locale}: nenhum texto restringe solid a star`, () => {
      const d = dictionary.docs;
      const v = dictionary.validation;
      const variant = d.api.find(([term]: [string, string]) => term === 'variant');
      expect(variant).toBeDefined();

      const texts = [
        variant?.[1] ?? '',
        d.coreRule,
        d.invalidText,
        v.variantsRegular,
        v.variantsSolid,
        v.variantsNote,
        ...v.invalidCases,
      ];
      for (const text of texts) {
        expect(text, text).not.toMatch(SOLID_ONLY_ON_STAR);
      }
    });

    it(`${locale}: o segundo caso de entrada invalida descreve variant inexistente`, () => {
      expect(dictionary.validation.invalidCases[1]).toMatch(/variant/i);
    });
  }
});

describe('marcadores de numero nos textos', () => {
  /** Marcador `{nome}` que `format()` nao preencheu. */
  const LEFTOVER_MARKER = /\{\w+\}/;

  for (const [locale, dictionary] of Object.entries(DICTIONARIES)) {
    it(`${locale}: Documentação mostra os numeros e nao deixa marcador`, () => {
      const target = renderInLocale(locale);
      const d = dictionary.docs;
      const page = target.textContent ?? '';

      expect(page).not.toMatch(LEFTOVER_MARKER);
      expect(page).toContain(format(d.coreTitle, { total: CORE_TOTAL }));
      const name = d.api.find(([term]: [string, string]) => term === 'name');
      expect(page).toContain(format(name?.[1] ?? '', { total: CORE_TOTAL }));
      expect(name?.[1]).toContain('{total}');
      for (const category of CATEGORIES) {
        expect(page).toContain(format(d.coreCount, { count: category.length }));
      }
    });

    it(`${locale}: Icons Overview mostra o contador e nao deixa marcador`, () => {
      const target = renderInLocale(locale, IconsOverview);
      const counter = target.querySelector('[data-nph-counter]')?.textContent?.trim();

      expect(target.textContent ?? '').not.toMatch(LEFTOVER_MARKER);
      expect(counter).toBe(format(dictionary.gallery.counter, { found: CORE_TOTAL, total: CORE_TOTAL }));
      expect(counter).toContain(String(CORE_TOTAL));
    });
  }
});
