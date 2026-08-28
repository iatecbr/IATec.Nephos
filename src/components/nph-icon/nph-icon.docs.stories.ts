/**
 * Paginas de leitura do `nph-icon`: documentacao e catalogo visual.
 *
 * Nenhuma das duas prova contrato — isso e papel de `Componentes/nph-icon/
 * Validacao` e dos testes. Aqui se le e se procura.
 *
 * O texto vem do dicionario de idioma, em `.storybook/i18n/`. Cada story e
 * UNICA: ela le `globals.locale` e busca a traducao. Identificadores tecnicos
 * — `nph-icon`, nomes de token, atributos e comandos — aparecem literais e sao
 * iguais em qualquer idioma.
 *
 * A busca da galeria pertence a ESTA pagina, nao a API do componente: nenhum
 * atributo, propriedade, evento ou estilo do `nph-icon` foi criado para ela.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { CHAVE, IDIOMA_PADRAO, textos } from '../../../.storybook/i18n/index.js';
import './nph-icon';
import { NPH_ICON_NAMES, NPH_ICON_SIZES } from './nph-icon.icons';
import {
  CATEGORIAS,
  TOTAL_DO_NUCLEO,
  botao,
  campo,
  cartao,
  celula,
  celulaDeTabela,
  filtrarNomes,
  fonte,
  grade,
  legenda,
  pagina,
  prosa,
  secao,
  tabela,
} from './nph-icon.demo';

const meta: Meta = {
  title: 'Componentes/nph-icon/Docs',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

interface Contexto {
  globals?: Record<string, unknown>;
}

function idiomaDe(contexto: Contexto | undefined): string {
  return (contexto?.globals?.[CHAVE] as string | undefined) ?? IDIOMA_PADRAO;
}

/*
 * `hidden` precisa vencer o `display` inline da moldura. Regra de cenario,
 * restrita a esta pagina.
 */
const regraDeOcultacao = html`
  <style>
    [hidden] {
      display: none !important;
    }
  </style>
`;

function linha(termo: string, descricao: TemplateResult | string): TemplateResult {
  return html`
    <tr>
      <th scope="row" style="${celulaDeTabela} font-family: monospace; white-space: nowrap;">
        ${termo}
      </th>
      <td style=${celulaDeTabela}>${descricao}</td>
    </tr>
  `;
}

function itens(lista: readonly string[]): TemplateResult {
  return html`
    <ul style="margin: 0; padding-left: var(--nph-space-container-padding);">
      ${lista.map((texto) => html`<li>${texto}</li>`)}
    </ul>
  `;
}

/**
 * Pagina de leitura. Todo bloco declara a origem da regra que mostra; nada
 * aqui e decidido nesta pagina.
 */
export const Documentacao: Story = {
  name: 'Documentação',
  render: (_args, contexto: Contexto) => {
    const dicionario = textos(idiomaDe(contexto));
    const d = dicionario.docs;
    const categorias = dicionario.categorias;

    return html`
      <div style=${pagina}>
        <header style=${prosa}>
          <h1 style="margin: 0;">nph-icon</h1>
          <p>${d.resumo}</p>
        </header>

        <div style=${cartao}>
          <strong>${d.derivadaTitulo}</strong>
          <p style="margin: 0;">${d.derivadaTexto1}</p>
          <p style="margin: 0;">${d.derivadaTexto2}</p>
        </div>

        ${secao(
          d.quandoUsarTitulo,
          html`${itens(d.quandoUsar)} ${fonte(d.fonteRotulo, d.fonteFicha)}`,
        )}

        ${secao(
          d.quandoNaoUsarTitulo,
          html`${itens(d.quandoNaoUsar)} ${fonte(d.fonteRotulo, d.fonteFicha)}`,
        )}

        ${secao(
          d.apiTitulo,
          html`
            <table style=${tabela}>
              <tbody>
                ${d.api.map(
                  ([termo, descricao]: [string, (total: number) => string]) =>
                    linha(termo, descricao(TOTAL_DO_NUCLEO)),
                )}
              </tbody>
            </table>
            ${fonte(d.fonteRotulo, d.fonteFichaContrato)}
          `,
        )}

        ${secao(
          d.nucleoTitulo(TOTAL_DO_NUCLEO),
          html`
            <p style="margin: 0;">${d.nucleoTexto}</p>
            <table style=${tabela}>
              <tbody>
                ${CATEGORIAS.map((categoria, indice) =>
                  linha(categorias[indice] ?? '', d.nucleoContagem(categoria.length)),
                )}
              </tbody>
            </table>
            <p style="margin: 0;">${d.nucleoRegra}</p>
            ${fonte(d.fonteRotulo, d.fonteNucleo)}
          `,
        )}

        ${secao(
          d.tamanhoTitulo,
          html`
            <p style="margin: 0;">${d.tamanhoTexto}</p>
            <div style="display: flex; align-items: center; gap: var(--nph-space-section);">
              ${NPH_ICON_SIZES.map(
                (tamanho) => html`
                  <div style=${celula}>
                    <nph-icon name="gear" size=${tamanho}></nph-icon>
                    <span style=${legenda}>size="${tamanho}" — icon/size-${tamanho}</span>
                  </div>
                `,
              )}
            </div>
            <table style=${tabela}>
              <tbody>
                ${d.tamanhoTabela.map(([token, uso]: [string, string]) => linha(token, uso))}
              </tbody>
            </table>
            <p style="margin: 0;">${d.tamanhoTransbordo}</p>
            ${fonte(d.fonteRotulo, d.fonteTamanho)}
          `,
        )}

        ${secao(
          d.corTitulo,
          html`
            <p style="margin: 0;">${d.corTexto}</p>
            ${fonte(d.fonteRotulo, d.fonteCor)}
          `,
        )}

        ${secao(
          d.acessibilidadeTitulo,
          html`${itens(d.acessibilidade)} ${fonte(d.fonteRotulo, d.fonteAcessibilidade)}`,
        )}

        ${secao(
          d.invalidaTitulo,
          html`
            <p style="margin: 0;">${d.invalidaTexto}</p>
            <p style="margin: 0;">${d.invalidaPonteiro}</p>
            ${fonte(d.fonteRotulo, d.fonteInvalida)}
          `,
        )}

        ${secao(
          d.antiPadroesTitulo,
          html`${itens(d.antiPadroes)} ${fonte(d.fonteRotulo, d.fonteFicha)}`,
        )}

        ${secao(d.referenciasTitulo, html`${itens(d.referencias)}`)}
      </div>
    `;
  },
};

function galeriaDe(alvo: EventTarget | null): HTMLElement | null {
  return alvo instanceof HTMLElement
    ? alvo.closest<HTMLElement>('[data-nph-galeria]')
    : null;
}

/**
 * Filtra a grade no navegador. O conjunto exibido vem sempre de
 * `filtrarNomes` sobre `NPH_ICON_NAMES`: e impossivel esta pagina mostrar um
 * icone que nao esteja no nucleo.
 *
 * O idioma vem do proprio DOM, gravado na renderizacao: o tratador de evento
 * nao tem acesso ao contexto da story.
 */
function aplicarFiltro(galeria: HTMLElement, termo: string): void {
  const g = textos(galeria.dataset['nphIdioma'] ?? IDIOMA_PADRAO).galeria;
  const correspondentes = new Set<string>(filtrarNomes(NPH_ICON_NAMES, termo));

  for (const item of galeria.querySelectorAll<HTMLElement>('[data-nph-nome]')) {
    item.hidden = !correspondentes.has(item.dataset['nphNome'] ?? '');
  }

  for (const categoria of galeria.querySelectorAll<HTMLElement>('[data-nph-categoria]')) {
    categoria.hidden =
      categoria.querySelectorAll('[data-nph-nome]:not([hidden])').length === 0;
  }

  const vazio = galeria.querySelector<HTMLElement>('[data-nph-vazio]');
  if (vazio !== null) {
    vazio.hidden = correspondentes.size > 0;
  }

  /* O contador so muda de texto quando o numero muda: leitor de tela nao e mural. */
  const contador = galeria.querySelector<HTMLElement>('[data-nph-contador]');
  const total = String(correspondentes.size);
  if (contador !== null && contador.dataset['nphEncontrados'] !== total) {
    contador.dataset['nphEncontrados'] = total;
    contador.textContent = g.contador(correspondentes.size, TOTAL_DO_NUCLEO);
  }
}

function aoBuscar(evento: Event): void {
  const alvo = evento.currentTarget;
  const galeria = galeriaDe(alvo);
  if (galeria === null || !(alvo instanceof HTMLInputElement)) {
    return;
  }
  aplicarFiltro(galeria, alvo.value);
}

function aoLimpar(evento: Event): void {
  const galeria = galeriaDe(evento.currentTarget);
  const busca = galeria?.querySelector<HTMLInputElement>('[data-nph-busca]') ?? null;
  if (galeria === null || busca === null) {
    return;
  }
  busca.value = '';
  aplicarFiltro(galeria, '');
  busca.focus();
}

/**
 * Catalogo visual dos icones do nucleo, com busca por nome.
 *
 * Cada item mostra o `nph-icon` SEM `label`, decorativo, ao lado do nome em
 * texto: com texto visivel ao lado, rotular o icone faria o leitor de tela ler
 * duas vezes.
 */
export const IconsOverview: Story = {
  name: 'Icons Overview',
  render: (_args, contexto: Contexto) => {
    const idioma = idiomaDe(contexto);
    const dicionario = textos(idioma);
    const g = dicionario.galeria;
    const categorias = dicionario.categorias;

    return html`
      <div style=${pagina} data-nph-galeria data-nph-idioma=${idioma}>
        ${regraDeOcultacao}
        <header style=${prosa}>
          <h1 style="margin: 0;">${g.titulo}</h1>
          <p style="margin: 0;">
            ${g.resumo1} ${TOTAL_DO_NUCLEO} ${g.resumo2} <strong>${g.resumo3}</strong>.
          </p>
        </header>

        <div
          style="display: flex; align-items: flex-end; gap: var(--nph-space-inline); flex-wrap: wrap;"
        >
          <div style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
            <label for="nph-icon-busca">${g.rotuloBusca}</label>
            <input
              id="nph-icon-busca"
              data-nph-busca
              type="search"
              autocomplete="off"
              spellcheck="false"
              placeholder=${g.exemploBusca}
              aria-controls="nph-icon-grade"
              style=${campo}
              @input=${aoBuscar}
            />
          </div>
          <button type="button" style=${botao} @click=${aoLimpar}>${g.limpar}</button>
        </div>

        <p
          data-nph-contador
          data-nph-encontrados=${TOTAL_DO_NUCLEO}
          role="status"
          aria-live="polite"
          style="${legenda} margin: 0;"
        >
          ${g.contador(TOTAL_DO_NUCLEO, TOTAL_DO_NUCLEO)}
        </p>

        <div
          id="nph-icon-grade"
          style="display: flex; flex-direction: column; gap: var(--nph-space-section);"
        >
          ${CATEGORIAS.map(
            (categoria, indice) => html`
              <section
                data-nph-categoria
                style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);"
              >
                <h3 style="margin: 0; font-size: 14px;">
                  ${categorias[indice] ?? ''} (${categoria.length})
                </h3>
                <div style=${grade}>
                  ${categoria.map(
                    (nome) => html`
                      <div data-nph-nome=${nome} style=${celula}>
                        <nph-icon name=${nome} size="md"></nph-icon>
                        <span style=${legenda}>${nome}</span>
                      </div>
                    `,
                  )}
                </div>
              </section>
            `,
          )}
        </div>

        <p data-nph-vazio hidden style=${legenda}>${g.vazio}</p>
      </div>
    `;
  },
};
