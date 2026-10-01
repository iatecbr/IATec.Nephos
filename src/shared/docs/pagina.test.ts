/**
 * Contrato dos blocos da pagina de conteudo (`pagina.ts`) e das chaves de
 * texto que eles consomem nos tres idiomas do Storybook.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { html, render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import ptBR from '../../../.storybook/i18n/pt-BR.js';
import en from '../../../.storybook/i18n/en.js';
import es from '../../../.storybook/i18n/es.js';
import { demonstracao, fonte, indice, nota, secao, tabela, usarNaoUsar } from './pagina';

afterEach(() => {
  document.body.replaceChildren();
});

async function montar(conteudo: TemplateResult): Promise<HTMLElement> {
  const alvo = document.createElement('div');
  document.body.append(alvo);
  render(conteudo, alvo);
  const icones = [...alvo.querySelectorAll('nph-icon')] as unknown as Array<{
    updateComplete: Promise<unknown>;
  }>;
  await Promise.all(icones.map((icone) => icone.updateComplete));
  return alvo;
}

describe('blocos da pagina de conteudo', () => {
  it('secao gera <section id> com <h2>', async () => {
    const alvo = await montar(secao('tamanho', 'Tamanho', html`<p>texto</p>`));
    const elemento = alvo.querySelector('section');
    expect(elemento?.id).toBe('tamanho');
    expect(elemento?.querySelector('h2')?.textContent?.trim()).toBe('Tamanho');
  });

  it('indice gera um link "#id" por item, dentro de um nav nomeado', async () => {
    const itens = [
      { id: 'a', titulo: 'A' },
      { id: 'b', titulo: 'B' },
    ];
    const alvo = await montar(indice('Nesta página', itens));
    const nav = alvo.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Nesta página');
    const links = [...alvo.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual(['#a', '#b']);
  });

  it('o link do indice leva o foco a secao sem navegar a pagina', async () => {
    const alvo = await montar(html`
      ${indice('Nesta página', [{ id: 'destino', titulo: 'Destino' }])}
      ${secao('destino', 'Destino', html`<p>texto</p>`)}
    `);
    const endereco = window.location.href;
    alvo.querySelector('a')?.click();
    expect(window.location.href).toBe(endereco);
    expect(document.activeElement?.id).toBe('destino');
  });

  it('nota tem role="note" e o icone e decorativo', async () => {
    const alvo = await montar(nota('info', 'Título', 'Texto'));
    const elemento = alvo.querySelector('[role="note"]');
    expect(elemento).not.toBeNull();
    expect(elemento?.querySelector('nph-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('cartoes de usar e nao usar tem icones decorativos', async () => {
    const alvo = await montar(
      usarNaoUsar({ titulo: 'Usar', itens: ['um'] }, { titulo: 'Não usar', itens: ['dois'] }),
    );
    const icones = [...alvo.querySelectorAll('nph-icon')];
    expect(icones.length).toBeGreaterThan(0);
    for (const icone of icones) {
      expect(icone.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('demonstracao nao tem fundo proprio, so borda', async () => {
    const alvo = await montar(demonstracao(html`<span>exemplo</span>`, 'Legenda'));
    const area = alvo.querySelector('[data-nph-demonstracao] > div') as HTMLElement;
    expect(getComputedStyle(area).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(area).borderTopStyle).toBe('solid');
  });

  it('tabela em auto usa fonte de codigo so para identificador', async () => {
    const alvo = await montar(
      tabela(['Termo', 'Regra'], [['icon/size-sm', 'um'], ['Slots e eventos', 'dois'], ['Interação', 'três']], 'auto'),
    );
    const celulas = [...alvo.querySelectorAll<HTMLElement>('tbody th')];
    expect(celulas).toHaveLength(3);
    const familia = (el: HTMLElement): string => getComputedStyle(el).fontFamily;
    expect(familia(celulas[0] as HTMLElement)).toContain('IBM Plex Mono');
    expect(familia(celulas[1] as HTMLElement)).not.toContain('IBM Plex Mono');
    expect(familia(celulas[2] as HTMLElement)).not.toContain('IBM Plex Mono');
  });

  it('fonte fica num rodape com linha acima', async () => {
    const alvo = await montar(fonte('Fonte:', 'design.md'));
    const p = alvo.querySelector('p') as HTMLElement;
    expect(p.textContent?.trim()).toBe('Fonte: design.md');
    expect(getComputedStyle(p).borderTopStyle).toBe('solid');
  });
});

describe('textos da pagina nos tres idiomas', () => {
  const DICIONARIOS = { 'pt-BR': ptBR, en, es } as const;
  const CHAVES = [
    'nestaPagina',
    'cabecalhoApi',
    'cabecalhoTamanho',
    'cabecalhoNucleo',
    'legendaTamanho',
    'notaTransbordoTitulo',
    'notaSolidTitulo',
    'notaInvalidaTitulo',
  ] as const;

  for (const [idioma, dicionario] of Object.entries(DICIONARIOS)) {
    it(`${idioma}: as chaves novas existem e nao sao vazias`, () => {
      const docs = dicionario.docs as Record<string, unknown>;
      for (const chave of CHAVES) {
        const valor = docs[chave];
        const textos = Array.isArray(valor) ? valor : [valor];
        expect(textos.length, chave).toBeGreaterThan(0);
        for (const texto of textos) {
          expect(typeof texto, chave).toBe('string');
          expect((texto as string).trim(), chave).not.toBe('');
        }
      }
    });

    it(`${idioma}: o texto de processo saiu da pagina`, () => {
      expect('derivadaTexto2' in dicionario.docs).toBe(false);
    });
  }
});
