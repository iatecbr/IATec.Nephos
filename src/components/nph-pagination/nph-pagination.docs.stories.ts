/**
 * Reading page of `nph-pagination`.
 *
 * It does not prove the contract — that is the role of `Components/nph-pagination/Validation`
 * and of the tests. The content is transcribed from the documentation accepted in Figma (page
 * `NPH — Pagination`, documentation `1640:196`, set `1640:194`), from the spec sheet
 * (`fichas/nph-pagination.md`) and from P99; nothing is decided here. The page follows the
 * order of the `nph-badge` page: it opens with the labelled matrix, and the two lists of "When
 * to use" are the ones of the sheet. Then Types, Position in the list, Page and arrows, Items
 * per page and go to page, Relations and context, Anatomy, Accessibility, Do and do not, and
 * the three required examples of the board, each in light and dark mode.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35;
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `paginationDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import { NPH_PAGINATION_TYPES } from './nph-pagination';
import { bar, bothModes, cardHeader, searchResult, tableFooter } from './nph-pagination.demo';
import type { ExampleText, PaginationLabels } from './nph-pagination.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, useDontUse } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-pagination.json';

const meta: Meta = {
  title: 'Components/nph-pagination/Docs',
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

/** Section ids: technical identifiers, the same in any language. */
const SECTIONS = {
  whenToUse: 'when-to-use',
  api: 'api',
  types: 'types',
  position: 'position-in-the-list',
  states: 'page-and-arrows',
  fields: 'items-per-page-and-go-to-page',
  relations: 'relations-and-context',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  doAndDont: 'do-and-do-not',
  examples: 'required-examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack);';

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).paginationDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption, dark: d.darkCaption };
    const labels = d.labels as PaginationLabels;
    const examples = d as unknown as ExampleText;

    return html`
      <main style=${body}>
        ${header('nph-pagination', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['page: 1', 'page: 5', 'page: 10'],
          NPH_PAGINATION_TYPES.map((type) => ({
            label: `type: ${type}`,
            cells: [1, 5, 10].map((position) => bar(labels, { type, page: position })),
          })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.types, title: d.typesTitle },
          { id: SECTIONS.position, title: d.positionTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.fields, title: d.fieldsTitle },
          { id: SECTIONS.relations, title: d.relationsTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.doAndDont, title: `${d.doTitle} · ${d.dontTitle}` },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${text(d.description)}
            ${sheetUseDontUse(metadata, localeOf(context), d)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(pair))}
            ${note('warning', d.invalidTitle, d.invalidText)}
            ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.types,
          d.typesTitle,
          html`
            ${demo(html`<div style=${column}>${NPH_PAGINATION_TYPES.map((type) => bar(labels, { type, page: 5 }))}</div>`, d.typesCaption)}
            ${table(d.typesHeader, d.types.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.position,
          d.positionTitle,
          html`
            ${text(d.positionText)}
            ${demo(html`<div style=${column}>${[1, 5, 10].map((position) => bar(labels, { type: 'edges', page: position }))}</div>`, d.positionCaption)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${text(d.statesText)}
            ${demo(bar(labels, { type: 'edges', page: 1 }), d.statesCaption)}
            ${table(d.statesHeader, d.states.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.fields,
          d.fieldsTitle,
          html`
            ${text(d.fieldsText)}
            ${demo(
              html`<div style=${column}>${bar(labels, { type: 'table', page: 5 })} ${bar(labels, { type: 'edges', page: 5, goToPage: true })}</div>`,
              d.fieldsCaption,
            )}
            ${source(d.sourceLabel, d.sourceFields)}
          `,
        )}

        ${section(SECTIONS.relations, d.relationsTitle, html`${list(d.relations)} ${source(d.sourceLabel, d.sourceFrame)}`)}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceFrame)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${table(d.accessibilityHeader, d.accessibility.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAccessibility)}`,
        )}

        ${section(
          SECTIONS.doAndDont,
          `${d.doTitle} · ${d.dontTitle}`,
          html`${useDontUse({ title: d.doTitle, items: d.do }, { title: d.dontTitle, items: d.dont })} ${source(d.sourceLabel, d.sourceFrame)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(bothModes(captions, () => tableFooter(examples)), d.exampleTable)}
            ${demo(bothModes(captions, () => searchResult(examples)), d.exampleSearch)}
            ${demo(bothModes(captions, () => cardHeader(examples)), d.exampleCard)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
