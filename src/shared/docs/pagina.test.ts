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
import { example, index, note, section, source, table, useOrDoNotUse } from './pagina';

afterEach(() => {
  document.body.replaceChildren();
});

async function renderContent(content: TemplateResult): Promise<HTMLElement> {
  const target = document.createElement('div');
  document.body.append(target);
  render(content, target);
  const icons = [...target.querySelectorAll('nph-icon')] as unknown as Array<{
    updateComplete: Promise<unknown>;
  }>;
  await Promise.all(icons.map((icon) => icon.updateComplete));
  return target;
}

describe('blocos da pagina de conteudo', () => {
  it('secao gera <section id> com <h2>', async () => {
    const target = await renderContent(section('tamanho', 'Tamanho', html`<p>texto</p>`));
    const element = target.querySelector('section');
    expect(element?.id).toBe('tamanho');
    expect(element?.querySelector('h2')?.textContent?.trim()).toBe('Tamanho');
  });

  it('indice gera um link "#id" por item, dentro de um nav nomeado', async () => {
    const items = [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
    ];
    const target = await renderContent(index('Nesta página', items));
    const nav = target.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Nesta página');
    const links = [...target.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual(['#a', '#b']);
  });

  it('o link do indice leva o foco a secao sem navegar a pagina', async () => {
    const target = await renderContent(html`
      ${index('Nesta página', [{ id: 'destino', title: 'Destino' }])}
      ${section('destino', 'Destino', html`<p>texto</p>`)}
    `);
    const url = window.location.href;
    target.querySelector('a')?.click();
    expect(window.location.href).toBe(url);
    expect(document.activeElement?.id).toBe('destino');

    const focused = document.getElementById('destino') as HTMLElement;
    const style = getComputedStyle(focused);
    expect(style.outlineStyle).toBe('solid');
    expect(parseFloat(style.outlineWidth)).toBeGreaterThan(0);
  });

  it('nota tem role="note" e o icone e decorativo', async () => {
    const target = await renderContent(note('info', 'Título', 'Texto'));
    const element = target.querySelector('[role="note"]');
    expect(element).not.toBeNull();
    expect(element?.querySelector('nph-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('cartoes de usar e nao usar tem icones decorativos', async () => {
    const target = await renderContent(
      useOrDoNotUse({ title: 'Usar', items: ['um'] }, { title: 'Não usar', items: ['dois'] }),
    );
    const icons = [...target.querySelectorAll('nph-icon')];
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('demonstracao nao tem fundo proprio, so borda', async () => {
    const target = await renderContent(example(html`<span>exemplo</span>`, 'Legenda'));
    const area = target.querySelector('[data-nph-demonstracao] > div') as HTMLElement;
    expect(getComputedStyle(area).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(area).borderTopStyle).toBe('solid');
  });

  it('tabela em auto usa fonte de codigo so para identificador', async () => {
    const target = await renderContent(
      table(['Termo', 'Regra'], [['icon/size-sm', 'um'], ['Slots e eventos', 'dois'], ['Interação', 'três']], 'auto'),
    );
    const cells = [...target.querySelectorAll<HTMLElement>('tbody th')];
    expect(cells).toHaveLength(3);
    const family = (element: HTMLElement): string => getComputedStyle(element).fontFamily;
    expect(family(cells[0] as HTMLElement)).toContain('IBM Plex Mono');
    expect(family(cells[1] as HTMLElement)).not.toContain('IBM Plex Mono');
    expect(family(cells[2] as HTMLElement)).not.toContain('IBM Plex Mono');
  });

  it('fonte fica num rodape com linha acima', async () => {
    const target = await renderContent(source('Fonte:', 'design.md'));
    const p = target.querySelector('p') as HTMLElement;
    expect(p.textContent?.trim()).toBe('Fonte: design.md');
    expect(getComputedStyle(p).borderTopStyle).toBe('solid');
  });
});

describe('textos da pagina nos tres idiomas', () => {
  const DICTIONARIES = { 'pt-BR': ptBR, en, es } as const;
  const KEYS = [
    'nestaPagina',
    'cabecalhoApi',
    'cabecalhoTamanho',
    'cabecalhoNucleo',
    'legendaTamanho',
    'notaTransbordoTitulo',
    'notaSolidTitulo',
    'notaInvalidaTitulo',
  ] as const;

  for (const [locale, dictionary] of Object.entries(DICTIONARIES)) {
    it(`${locale}: as chaves novas existem e nao sao vazias`, () => {
      const docs = dictionary.docs as Record<string, unknown>;
      for (const key of KEYS) {
        const value = docs[key];
        const texts = Array.isArray(value) ? value : [value];
        expect(texts.length, key).toBeGreaterThan(0);
        for (const text of texts) {
          expect(typeof text, key).toBe('string');
          expect((text as string).trim(), key).not.toBe('');
        }
      }
    });

    it(`${locale}: o texto de processo saiu da pagina`, () => {
      expect('derivadaTexto2' in dictionary.docs).toBe(false);
    });
  }
});
