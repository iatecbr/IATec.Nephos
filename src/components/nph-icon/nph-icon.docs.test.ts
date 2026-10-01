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

const DICIONARIOS = { 'pt-BR': ptBR, en, es } as const;

/** Restricao antiga do solid a star, em qualquer ordem dentro da frase. */
const SOLID_SO_EM_STAR = /solid[^.]*\bstar\b|\bstar\b[^.]*solid/i;

function renderizar(idioma: string): HTMLElement {
  const alvo = document.createElement('div');
  document.body.append(alvo);
  const desenhar = Documentacao.render as (args: unknown, contexto: unknown) => TemplateResult;
  render(desenhar({}, { globals: { locale: idioma } }), alvo);
  return alvo;
}

describe('Documentação — indice', () => {
  for (const idioma of Object.keys(DICIONARIOS)) {
    it(`${idioma}: todo link aponta para uma secao e toda secao tem link`, () => {
      const alvo = renderizar(idioma);
      const alvos = [...alvo.querySelectorAll('nav a')].map((a) =>
        (a.getAttribute('href') ?? '').replace(/^#/, ''),
      );
      const secoes = [...alvo.querySelectorAll('section[id]')].map((s) => s.id);

      expect(alvos.length).toBeGreaterThan(0);
      for (const id of alvos) {
        expect(alvo.querySelector(`#${id}`), `âncora #${id}`).not.toBeNull();
      }
      expect([...secoes].sort()).toEqual([...alvos].sort());
    });
  }
});

describe('regra vigente do solid nos textos', () => {
  for (const [idioma, dicionario] of Object.entries(DICIONARIOS)) {
    it(`${idioma}: nenhum texto restringe solid a star`, () => {
      const d = dicionario.docs;
      const v = dicionario.validacao;
      const linhas = d.api as unknown as ReadonlyArray<readonly [string, (total: number) => string]>;
      const variant = linhas.find(([termo]) => termo === 'variant');
      expect(variant).toBeDefined();

      const textos = [
        variant?.[1](0) ?? '',
        d.nucleoRegra,
        d.invalidaTexto,
        v.variantesSecao,
        v.variantesRegular,
        v.variantesSolid,
        v.variantesNota,
        ...v.invalidaCasos,
      ];
      for (const texto of textos) {
        expect(texto, texto).not.toMatch(SOLID_SO_EM_STAR);
      }
    });

    it(`${idioma}: o segundo caso de entrada invalida descreve variant inexistente`, () => {
      expect(dicionario.validacao.invalidaCasos[1]).toMatch(/variant/i);
    });
  }
});
