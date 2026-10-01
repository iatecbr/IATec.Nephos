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
  CATEGORIAS as CATEGORIES,
  TOTAL_DO_NUCLEO as CORE_TOTAL,
  botao as buttonStyle,
  campo as fieldStyle,
  celula as cellStyle,
  filtrarNomes as filterNames,
  grade as gridStyle,
  legenda as captionStyle,
  pagina as pageStyle,
  prosa as proseStyle,
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

interface StoryContext {
  globals?: Record<string, unknown>;
}

function getLocale(context: StoryContext | undefined): string {
  return (context?.globals?.[CHAVE] as string | undefined) ?? IDIOMA_PADRAO;
}

/*
 * `hidden` precisa vencer o `display` inline da moldura. Regra de cenario,
 * restrita a esta pagina.
 */
const hideRule = html`
  <style>
    [hidden] {
      display: none !important;
    }
  </style>
`;

/** Ids das secoes: identificadores tecnicos, iguais em qualquer idioma. */
const SECTIONS = {
  whenToUse: 'quando-usar',
  api: 'api',
  core: 'nucleo',
  size: 'tamanho',
  color: 'cor',
  accessibility: 'acessibilidade',
  invalid: 'entrada-invalida',
  antiPatterns: 'anti-padroes',
  references: 'referencias',
} as const;

/**
 * Pagina de leitura, montada com os blocos de `src/shared/docs/pagina.ts`. Todo
 * bloco declara a origem da regra que mostra; nada aqui e decidido nesta pagina.
 */
export const Documentacao: Story = {
  name: 'Documentação',
  render: (_args, context: StoryContext) => {
    const dictionary = textos(getLocale(context));
    const docs = dictionary.docs;
    const categoryLabels = dictionary.categorias;
    const coreTitle = docs.nucleoTitulo(CORE_TOTAL);

    return html`
      <div style=${body}>
        ${header('nph-icon', docs.resumo)}

        ${note('info', docs.derivadaTitulo, docs.derivadaTexto1)}

        ${index(docs.nestaPagina, [
          { id: SECTIONS.whenToUse, title: docs.quandoUsarTitulo },
          { id: SECTIONS.api, title: docs.apiTitulo },
          { id: SECTIONS.core, title: coreTitle },
          { id: SECTIONS.size, title: docs.tamanhoTitulo },
          { id: SECTIONS.color, title: docs.corTitulo },
          { id: SECTIONS.accessibility, title: docs.acessibilidadeTitulo },
          { id: SECTIONS.invalid, title: docs.invalidaTitulo },
          { id: SECTIONS.antiPatterns, title: docs.antiPadroesTitulo },
          { id: SECTIONS.references, title: docs.referenciasTitulo },
        ])}

        ${section(
          SECTIONS.whenToUse,
          docs.quandoUsarTitulo,
          html`
            ${useOrDoNotUse(
              { title: docs.quandoUsarTitulo, items: docs.quandoUsar },
              { title: docs.quandoNaoUsarTitulo, items: docs.quandoNaoUsar },
            )}
            ${source(docs.fonteRotulo, docs.fonteFicha)}
          `,
        )}

        ${section(
          SECTIONS.api,
          docs.apiTitulo,
          html`
            ${table(
              docs.cabecalhoApi,
              docs.api.map(
                ([term, description]: [string, (total: number) => string]) =>
                  [term, description(CORE_TOTAL)] as const,
              ),
              'auto',
            )}
            ${source(docs.fonteRotulo, docs.fonteFichaContrato)}
          `,
        )}

        ${section(
          SECTIONS.core,
          coreTitle,
          html`
            ${text(docs.nucleoTexto)}
            ${table(
              docs.cabecalhoNucleo,
              CATEGORIES.map(
                (category, index) =>
                  [categoryLabels[index] ?? '', docs.nucleoContagem(category.length)] as const,
              ),
              'text',
            )}
            ${note('info', docs.notaSolidTitulo, docs.nucleoRegra)}
            ${source(docs.fonteRotulo, docs.fonteNucleo)}
          `,
        )}

        ${section(
          SECTIONS.size,
          docs.tamanhoTitulo,
          html`
            ${text(docs.tamanhoTexto)}
            ${example(
              html`${NPH_ICON_SIZES.map(
                (size) => html`
                  <div style="display: flex; flex-direction: column; align-items: center; gap: var(--nph-space-inline-tight);">
                    <nph-icon name="gear" size=${size}></nph-icon>
                    <code style="color: var(--nph-color-muted-foreground);">${size}</code>
                  </div>
                `,
              )}`,
              docs.legendaTamanho,
            )}
            ${table(
              docs.cabecalhoTamanho,
              docs.tamanhoTabela.map(([token, usage]: [string, string]) => [token, usage] as const),
            )}
            ${note('info', docs.notaTransbordoTitulo, docs.tamanhoTransbordo)}
            ${source(docs.fonteRotulo, docs.fonteTamanho)}
          `,
        )}

        ${section(
          SECTIONS.color,
          docs.corTitulo,
          html`${text(docs.corTexto)} ${source(docs.fonteRotulo, docs.fonteCor)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          docs.acessibilidadeTitulo,
          html`${list(docs.acessibilidade)} ${source(docs.fonteRotulo, docs.fonteAcessibilidade)}`,
        )}

        ${section(
          SECTIONS.invalid,
          docs.invalidaTitulo,
          html`
            ${text(docs.invalidaTexto)}
            ${note('warning', docs.notaInvalidaTitulo, docs.invalidaPonteiro)}
            ${source(docs.fonteRotulo, docs.fonteInvalida)}
          `,
        )}

        ${section(
          SECTIONS.antiPatterns,
          docs.antiPadroesTitulo,
          html`${doNot(docs.antiPadroesTitulo, docs.antiPadroes)} ${source(docs.fonteRotulo, docs.fonteFicha)}`,
        )}

        ${section(SECTIONS.references, docs.referenciasTitulo, list(docs.referencias))}
      </div>
    `;
  },
};


function getGallery(target: EventTarget | null): HTMLElement | null {
  return target instanceof HTMLElement
    ? target.closest<HTMLElement>('[data-nph-galeria]')
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
function applyFilter(gallery: HTMLElement, term: string): void {
  const galleryText = textos(gallery.dataset['nphIdioma'] ?? IDIOMA_PADRAO).galeria;
  const matches = new Set<string>(filterNames(NPH_ICON_NAMES, term));

  for (const icon of gallery.querySelectorAll<HTMLElement>('[data-nph-nome]')) {
    icon.hidden = !matches.has(icon.dataset['nphNome'] ?? '');
  }

  for (const category of gallery.querySelectorAll<HTMLElement>('[data-nph-categoria]')) {
    category.hidden =
      category.querySelectorAll('[data-nph-nome]:not([hidden])').length === 0;
  }

  const emptyState = gallery.querySelector<HTMLElement>('[data-nph-vazio]');
  if (emptyState !== null) {
    emptyState.hidden = matches.size > 0;
  }

  /* O contador so muda de texto quando o numero muda: leitor de tela nao e mural. */
  const counter = gallery.querySelector<HTMLElement>('[data-nph-contador]');
  const totalText = String(matches.size);
  if (counter !== null && counter.dataset['nphEncontrados'] !== totalText) {
    counter.dataset['nphEncontrados'] = totalText;
    counter.textContent = galleryText.contador(matches.size, CORE_TOTAL);
  }
}

function onSearch(event: Event): void {
  const target = event.currentTarget;
  const gallery = getGallery(target);
  if (gallery === null || !(target instanceof HTMLInputElement)) {
    return;
  }
  applyFilter(gallery, target.value);
}

function onClear(event: Event): void {
  const gallery = getGallery(event.currentTarget);
  const searchInput = gallery?.querySelector<HTMLInputElement>('[data-nph-busca]') ?? null;
  if (gallery === null || searchInput === null) {
    return;
  }
  searchInput.value = '';
  applyFilter(gallery, '');
  searchInput.focus();
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
  render: (_args, context: StoryContext) => {
    const locale = getLocale(context);
    const dictionary = textos(locale);
    const galleryText = dictionary.galeria;
    const categoryLabels = dictionary.categorias;

    return html`
      <div style=${pageStyle} data-nph-galeria data-nph-idioma=${locale}>
        ${hideRule}
        <header style=${proseStyle}>
          <h1 style="margin: 0;">${galleryText.titulo}</h1>
          <p style="margin: 0;">
            ${galleryText.resumo1} ${CORE_TOTAL} ${galleryText.resumo2} <strong>${galleryText.resumo3}</strong>.
          </p>
        </header>

        <div
          style="display: flex; align-items: flex-end; gap: var(--nph-space-inline); flex-wrap: wrap;"
        >
          <div style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
            <label for="nph-icon-busca">${galleryText.rotuloBusca}</label>
            <input
              id="nph-icon-busca"
              data-nph-busca
              type="search"
              autocomplete="off"
              spellcheck="false"
              placeholder=${galleryText.exemploBusca}
              aria-controls="nph-icon-grade"
              style=${fieldStyle}
              @input=${onSearch}
            />
          </div>
          <button type="button" style=${buttonStyle} @click=${onClear}>${galleryText.limpar}</button>
        </div>

        <p
          data-nph-contador
          data-nph-encontrados=${CORE_TOTAL}
          role="status"
          aria-live="polite"
          style="${captionStyle} margin: 0;"
        >
          ${galleryText.contador(CORE_TOTAL, CORE_TOTAL)}
        </p>

        <div
          id="nph-icon-grade"
          style="display: flex; flex-direction: column; gap: var(--nph-space-section);"
        >
          ${CATEGORIES.map(
            (category, index) => html`
              <section
                data-nph-categoria
                style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);"
              >
                <h3 style="margin: 0; font-size: 14px;">
                  ${categoryLabels[index] ?? ''} (${category.length})
                </h3>
                <div style=${gridStyle}>
                  ${category.map(
                    (name) => html`
                      <div data-nph-nome=${name} style=${cellStyle}>
                        <nph-icon name=${name} size="md"></nph-icon>
                        <span style=${captionStyle}>${name}</span>
                      </div>
                    `,
                  )}
                </div>
              </section>
            `,
          )}
        </div>

        <p data-nph-vazio hidden style=${captionStyle}>${galleryText.vazio}</p>
      </div>
    `;
  },
};
