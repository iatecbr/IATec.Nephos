/**
 * Paginas de leitura do `nph-icon`: documentacao e catalogo visual.
 *
 * Nenhuma das duas prova contrato — isso e papel de `Components/nph-icon/
 * Validation` e dos testes. Aqui se le e se procura.
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

import { LOCALE_GLOBAL, DEFAULT_LOCALE, format, translations } from '../../../.storybook/i18n/index.js';
import './nph-icon';
import { NPH_ICON_NAMES, NPH_ICON_SIZES } from './nph-icon.icons';
import {
  CATEGORIES,
  CORE_TOTAL,
  button,
  counter,
  field,
  filterNames,
  grid,
  searchLabel,
  tile,
  tileName,
} from './nph-icon.demo';
import {
  header,
  body,
  demo,
  source,
  index,
  list,
  dontDo,
  note,
  section,
  table,
  text,
  useDontUse,
} from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-icon/Docs',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

function localeOf(context: GlobalsContext | undefined): string {
  return (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
}

/*
 * `hidden` precisa vencer o `display` inline da moldura. Regra de cenario,
 * restrita a esta pagina.
 */
const hidingRule = html`
  <style>
    [hidden] {
      display: none !important;
    }
  </style>
`;

/** Ids das secoes: identificadores tecnicos, iguais em qualquer idioma. */
const SECTIONS = {
  whenToUse: 'when-to-use',
  api: 'api',
  core: 'core',
  size: 'size',
  color: 'color',
  accessibility: 'accessibility',
  invalid: 'invalid-input',
  antiPatterns: 'anti-patterns',
  references: 'references',
} as const;

/**
 * Ids das categorias do catalogo, na ordem de `CATEGORIES`: os grupos
 * de `icones_nucleo`, no `design.md`, com nome tecnico em ingles.
 */
const CATEGORY_IDS = [
  'navigation-and-menus',
  'direction-and-disclosure',
  'action',
  'status-and-communication',
  'content-and-data',
] as const;

/**
 * Pagina de leitura, montada com os blocos de `src/shared/docs/page.ts`. Todo
 * bloco declara a origem da regra que mostra; nada aqui e decidido nesta pagina.
 */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const dictionary = translations(localeOf(context));
    const d = dictionary.docs;
    const categories = dictionary.categories;
    const coreHeading = format(d.coreTitle, { total: CORE_TOTAL });

    return html`
      <div style=${body}>
        ${header('nph-icon', d.summary)}

        ${note('info', d.derivedTitle, d.derivedText1)}

        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.core, title: coreHeading },
          { id: SECTIONS.size, title: d.sizeTitle },
          { id: SECTIONS.color, title: d.colorTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.invalid, title: d.invalidTitle },
          { id: SECTIONS.antiPatterns, title: d.antiPatternsTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${useDontUse(
              { title: d.whenToUseTitle, items: d.whenToUse },
              { title: d.whenNotToUseTitle, items: d.whenNotToUse },
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`
            ${table(
              d.apiHeader,
              d.api.map(
                ([term, description]: [string, string]) =>
                  [term, format(description, { total: CORE_TOTAL })] as const,
              ),
              'auto',
            )}
            ${source(d.sourceLabel, d.sourceSpecContract)}
          `,
        )}

        ${section(
          SECTIONS.core,
          coreHeading,
          html`
            ${text(d.coreText)}
            ${table(
              d.coreHeader,
              CATEGORIES.map(
                (category, index) =>
                  [categories[index] ?? '', format(d.coreCount, { count: category.length })] as const,
              ),
              'text',
            )}
            ${note('info', d.solidNoteTitle, d.coreRule)}
            ${source(d.sourceLabel, d.sourceCore)}
          `,
        )}

        ${section(
          SECTIONS.size,
          d.sizeTitle,
          html`
            ${text(d.sizeText)}
            ${demo(
              html`${NPH_ICON_SIZES.map(
                (size) => html`
                  <div style="display: flex; flex-direction: column; align-items: center; gap: var(--nph-space-inline-tight);">
                    <nph-icon name="gear" size=${size}></nph-icon>
                    <code style="color: var(--nph-color-muted-foreground);">${size}</code>
                  </div>
                `,
              )}`,
              d.sizeCaption,
            )}
            ${table(
              d.sizeHeader,
              d.sizeTable.map(([token, usage]: [string, string]) => [token, usage] as const),
            )}
            ${note('info', d.overflowNoteTitle, d.sizeOverflow)}
            ${source(d.sourceLabel, d.sourceSize)}
          `,
        )}

        ${section(
          SECTIONS.color,
          d.colorTitle,
          html`${text(d.colorText)} ${source(d.sourceLabel, d.sourceColor)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${list(d.accessibility)} ${source(d.sourceLabel, d.sourceAccessibility)}`,
        )}

        ${section(
          SECTIONS.invalid,
          d.invalidTitle,
          html`
            ${text(d.invalidText)}
            ${note('warning', d.invalidNoteTitle, d.invalidPointer)}
            ${source(d.sourceLabel, d.sourceInvalid)}
          `,
        )}

        ${section(
          SECTIONS.antiPatterns,
          d.antiPatternsTitle,
          html`${dontDo(d.antiPatternsTitle, d.antiPatterns)} ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </div>
    `;
  },
};


function galleryOf(target: EventTarget | null): HTMLElement | null {
  return target instanceof HTMLElement
    ? target.closest<HTMLElement>('[data-nph-gallery]')
    : null;
}

/**
 * Filtra a grade no navegador. O conjunto exibido vem sempre de
 * `filterNames` sobre `NPH_ICON_NAMES`: e impossivel esta pagina mostrar um
 * icone que nao esteja no nucleo.
 *
 * O idioma vem do proprio DOM, gravado na renderizacao: o tratador de evento
 * nao tem acesso ao contexto da story.
 */
function applyFilter(gallery: HTMLElement, term: string): void {
  const g = translations(gallery.dataset['nphLocale'] ?? DEFAULT_LOCALE).gallery;
  const matches = new Set<string>(filterNames(NPH_ICON_NAMES, term));

  for (const item of gallery.querySelectorAll<HTMLElement>('[data-nph-name]')) {
    item.hidden = !matches.has(item.dataset['nphName'] ?? '');
  }

  for (const category of gallery.querySelectorAll<HTMLElement>('[data-nph-category]')) {
    category.hidden =
      category.querySelectorAll('[data-nph-name]:not([hidden])').length === 0;

    /* O chip do indice some junto com a categoria: link para secao oculta nao leva a nada. */
    const id = category.querySelector('section[id]')?.id ?? '';
    const chip = gallery.querySelector(`nav a[href="#${id}"]`)?.closest('li');
    if (chip instanceof HTMLElement) {
      chip.hidden = category.hidden;
    }
  }

  const empty = gallery.querySelector<HTMLElement>('[data-nph-empty]');
  if (empty !== null) {
    empty.hidden = matches.size > 0;
  }

  /* O contador so muda de texto quando o numero muda: leitor de tela nao e mural. */
  const counter = gallery.querySelector<HTMLElement>('[data-nph-counter]');
  const total = String(matches.size);
  if (counter !== null && counter.dataset['nphFound'] !== total) {
    counter.dataset['nphFound'] = total;
    counter.textContent = format(g.counter, { found: matches.size, total: CORE_TOTAL });
  }
}

function onSearch(event: Event): void {
  const target = event.currentTarget;
  const gallery = galleryOf(target);
  if (gallery === null || !(target instanceof HTMLInputElement)) {
    return;
  }
  applyFilter(gallery, target.value);
}

function onClear(event: Event): void {
  const gallery = galleryOf(event.currentTarget);
  const search = gallery?.querySelector<HTMLInputElement>('[data-nph-search]') ?? null;
  if (gallery === null || search === null) {
    return;
  }
  search.value = '';
  applyFilter(gallery, '');
  search.focus();
}

/**
 * Catalogo visual dos icones do nucleo, com busca por nome.
 *
 * Cada cartao mostra o `nph-icon` SEM `label`, decorativo, com o nome em texto
 * embaixo: com texto visivel junto, rotular o icone faria o leitor de tela ler
 * duas vezes.
 */
export const IconsOverview: Story = {
  name: 'Icons Overview',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const dictionary = translations(locale);
    const g = dictionary.gallery;
    const categories = dictionary.categories;

    return html`
      <div style=${body} data-nph-gallery data-nph-locale=${locale}>
        ${hidingRule}
        ${header(g.title, `${g.summary1} ${g.summary2} ${g.summary3}.`)}

        <div
          role="search"
          style="display: flex; align-items: flex-end; gap: var(--nph-space-inline); flex-wrap: wrap; padding-top: var(--nph-space-stack);"
        >
          <div style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
            <label for="nph-icon-search" style=${searchLabel}>${g.searchLabel}</label>
            <input
              id="nph-icon-search"
              data-nph-search
              type="search"
              autocomplete="off"
              spellcheck="false"
              placeholder=${g.searchExample}
              aria-controls="nph-icon-grid"
              style=${field}
              @input=${onSearch}
            />
          </div>
          <button type="button" style=${button} @click=${onClear}>${g.clear}</button>
        </div>

        <p
          data-nph-counter
          data-nph-found=${CORE_TOTAL}
          role="status"
          aria-live="polite"
          style=${counter}
        >
          ${format(g.counter, { found: CORE_TOTAL, total: CORE_TOTAL })}
        </p>

        ${index(
          dictionary.docs.onThisPage,
          CATEGORIES.map((_, position) => ({
            id: CATEGORY_IDS[position] ?? '',
            title: categories[position] ?? '',
          })),
        )}

        <div id="nph-icon-grid" style="display: flex; flex-direction: column;">
          ${CATEGORIES.map(
            (category, position) => html`
              <div data-nph-category>
                ${section(
                  CATEGORY_IDS[position] ?? '',
                  categories[position] ?? '',
                  html`
                    <div style=${grid}>
                      ${category.map(
                        (name) => html`
                          <div data-nph-name=${name} style=${tile}>
                            <nph-icon name=${name} size="lg"></nph-icon>
                            <span style=${tileName}>${name}</span>
                          </div>
                        `,
                      )}
                    </div>
                  `,
                )}
              </div>
            `,
          )}
        </div>

        <div data-nph-empty hidden>${text(g.empty)}</div>
      </div>
    `;
  },
};
