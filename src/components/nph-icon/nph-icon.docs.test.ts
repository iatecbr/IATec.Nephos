/**
 * Contrato da pagina Documentacao do `nph-icon` e dos textos de Validacao:
 * indice sem ancora orfa, nos tres idiomas, e a regra vigente do `solid`
 * (ficha `nph-icon`: regular e solid existem para todos os nomes do nucleo).
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import ptBR from '../../../.storybook/i18n/pt-BR.js';
import en from '../../../.storybook/i18n/en.js';
import es from '../../../.storybook/i18n/es.js';
import { Documentacao } from './nph-icon.docs.stories';

afterEach(() => {
  document.body.replaceChildren();
});

const DICTIONARIES = { 'pt-BR': ptBR, en, es } as const;

/** Restricao antiga do solid a star, em qualquer ordem dentro da frase. */
const SOLID_ONLY_ON_STAR = /solid[^.]*\bstar\b|\bstar\b[^.]*solid/i;

function renderInLocale(locale: string): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  const draw = Documentacao.render as (args: unknown, context: unknown) => TemplateResult;
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
      const rows = d.api as unknown as ReadonlyArray<readonly [string, (total: number) => string]>;
      const variant = rows.find(([term]) => term === 'variant');
      expect(variant).toBeDefined();

      const texts = [
        variant?.[1](0) ?? '',
        d.coreRule,
        d.invalidText,
        v.variantsSection,
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
