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
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { CHAVE, IDIOMA_PADRAO, textos } from '../../../.storybook/i18n/index.js';
import './nph-icon';
import { NPH_ICON_NAMES, NPH_ICON_SIZES } from './nph-icon.icons';
import {
  CATEGORIAS,
  TOTAL_DO_NUCLEO,
  botao,
  campo,
  celula,
  filtrarNomes,
  grade,
  legenda,
  pagina,
  prosa,
} from './nph-icon.demo';
import {
  body,
  doNot,
  example,
  header,
  index,
  list,
  note,
  section,
  source,
  table,
  text,
  useOrDoNotUse,
} from '../../shared/docs/pagina';

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

/** Ids das secoes: identificadores tecnicos, iguais em qualquer idioma. */
const SECTIONS = {
  quandoUsar: 'quando-usar',
  api: 'api',
  nucleo: 'nucleo',
  tamanho: 'tamanho',
  cor: 'cor',
  acessibilidade: 'acessibilidade',
  invalida: 'entrada-invalida',
  antiPadroes: 'anti-padroes',
  referencias: 'referencias',
} as const;

/**
 * Pagina de leitura, montada com os blocos de `src/shared/docs/pagina.ts`. Todo
 * bloco declara a origem da regra que mostra; nada aqui e decidido nesta pagina.
 */
export const Documentacao: Story = {
  name: 'Documentação',
  render: (_args, contexto: Contexto) => {
    const dicionario = textos(idiomaDe(contexto));
    const d = dicionario.docs;
    const categorias = dicionario.categorias;
    const coreTitle = d.nucleoTitulo(TOTAL_DO_NUCLEO);

    return html`
      <div style=${body}>
        ${header('nph-icon', d.resumo)}

        ${note('info', d.derivadaTitulo, d.derivadaTexto1)}

        ${index(d.nestaPagina, [
          { id: SECTIONS.quandoUsar, titulo: d.quandoUsarTitulo },
          { id: SECTIONS.api, titulo: d.apiTitulo },
          { id: SECTIONS.nucleo, titulo: coreTitle },
          { id: SECTIONS.tamanho, titulo: d.tamanhoTitulo },
          { id: SECTIONS.cor, titulo: d.corTitulo },
          { id: SECTIONS.acessibilidade, titulo: d.acessibilidadeTitulo },
          { id: SECTIONS.invalida, titulo: d.invalidaTitulo },
          { id: SECTIONS.antiPadroes, titulo: d.antiPadroesTitulo },
          { id: SECTIONS.referencias, titulo: d.referenciasTitulo },
        ])}

        ${section(
          SECTIONS.quandoUsar,
          d.quandoUsarTitulo,
          html`
            ${useOrDoNotUse(
              { title: d.quandoUsarTitulo, items: d.quandoUsar },
              { title: d.quandoNaoUsarTitulo, items: d.quandoNaoUsar },
            )}
            ${source(d.fonteRotulo, d.fonteFicha)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitulo,
          html`
            ${table(
              d.cabecalhoApi,
              d.api.map(
                ([termo, descricao]: [string, (total: number) => string]) =>
                  [termo, descricao(TOTAL_DO_NUCLEO)] as const,
              ),
              'auto',
            )}
            ${source(d.fonteRotulo, d.fonteFichaContrato)}
          `,
        )}

        ${section(
          SECTIONS.nucleo,
          coreTitle,
          html`
            ${text(d.nucleoTexto)}
            ${table(
              d.cabecalhoNucleo,
              CATEGORIAS.map(
                (categoria, indice) =>
                  [categorias[indice] ?? '', d.nucleoContagem(categoria.length)] as const,
              ),
              'text',
            )}
            ${note('info', d.notaSolidTitulo, d.nucleoRegra)}
            ${source(d.fonteRotulo, d.fonteNucleo)}
          `,
        )}

        ${section(
          SECTIONS.tamanho,
          d.tamanhoTitulo,
          html`
            ${text(d.tamanhoTexto)}
            ${example(
              html`${NPH_ICON_SIZES.map(
                (tamanho) => html`
                  <div style="display: flex; flex-direction: column; align-items: center; gap: var(--nph-space-inline-tight);">
                    <nph-icon name="gear" size=${tamanho}></nph-icon>
                    <code style="color: var(--nph-color-muted-foreground);">${tamanho}</code>
                  </div>
                `,
              )}`,
              d.legendaTamanho,
            )}
            ${table(
              d.cabecalhoTamanho,
              d.tamanhoTabela.map(([token, uso]: [string, string]) => [token, uso] as const),
            )}
            ${note('info', d.notaTransbordoTitulo, d.tamanhoTransbordo)}
            ${source(d.fonteRotulo, d.fonteTamanho)}
          `,
        )}

        ${section(
          SECTIONS.cor,
          d.corTitulo,
          html`${text(d.corTexto)} ${source(d.fonteRotulo, d.fonteCor)}`,
        )}

        ${section(
          SECTIONS.acessibilidade,
          d.acessibilidadeTitulo,
          html`${list(d.acessibilidade)} ${source(d.fonteRotulo, d.fonteAcessibilidade)}`,
        )}

        ${section(
          SECTIONS.invalida,
          d.invalidaTitulo,
          html`
            ${text(d.invalidaTexto)}
            ${note('warning', d.notaInvalidaTitulo, d.invalidaPonteiro)}
            ${source(d.fonteRotulo, d.fonteInvalida)}
          `,
        )}

        ${section(
          SECTIONS.antiPadroes,
          d.antiPadroesTitulo,
          html`${doNot(d.antiPadroesTitulo, d.antiPadroes)} ${source(d.fonteRotulo, d.fonteFicha)}`,
        )}

        ${section(SECTIONS.referencias, d.referenciasTitulo, list(d.referencias))}
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
