/**
 * Reading page of `nph-table`.
 *
 * It does not prove the contract — that is the role of `Components/nph-table/Validation` and
 * of the tests. The content is transcribed from the frame accepted in Figma (`2584:66651`),
 * from the spec sheet (`ficha`) and from P97; nothing is decided here. The page follows the
 * order of the `nph-image` page: it opens with the labelled matrix, and the two lists of
 * "When to use" are the ones of the sheet. The three required examples of the frame close
 * it, each in light and dark mode.
 *
 * Deferred, not fulfilled here:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35;
 * - the "When to use" lists still come from the dictionary, and a test checks that they equal the
 *   sheet's; reading them from the Metadata is P71, in DSA-34;
 * - the category content of the cell (D1 of DSA-49): until it is defined, the example of items
 *   grouped by category shows the groups as the first level of the tree, and the page says so.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `tableDocs`
 * key; the example tables take theirs from `tableValidation.sample`. The story is SINGLE: it
 * reads `globals.locale` and looks up the translation. Technical identifiers appear literally
 * and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-table';
import {
  actionsTable,
  basicTable,
  groupTable,
  groupedByCategory,
  inScheme,
  manyRows,
  openOrder,
  orderTable,
  peopleTable,
  treeTable,
  wideCaptionTable,
} from './nph-table.demo';
import type { Sample, Scheme } from './nph-table.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-table/Docs',
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
  variants: 'variants',
  states: 'states',
  cells: 'cell-contents',
  rows: 'rows',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-section); inline-size: 100%;';
const modes = 'display: flex; flex-direction: column; gap: var(--nph-space-stack); inline-size: 100%;';

/** The demonstration takes the width of the page, as a table does in use. */
function full(content: TemplateResult): TemplateResult {
  return html`<div style="inline-size: 100%;">${content}</div>`;
}

/** The same example in light and in dark mode, one under the other. */
function bothModes(d: Record<string, unknown>, s: Sample, content: (sample: Sample) => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', d.lightCaption as string],
    ['dark', d.darkCaption as string],
  ];
  return html`<div style=${modes}>${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content(s)))}</div>`;
}

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const d = translations(locale).tableDocs;
    const s = translations(locale).tableValidation.sample;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;

    return html`
      <main style=${body}>
        ${header('nph-table', d.summary)}
        ${matrix(d.matrixLabel, ['framed: false', 'framed: true'], [
          { label: 'size: default', cells: [basicTable(s), basicTable(s, { framed: true })] },
          { label: 'size: large', cells: [basicTable(s, { size: 'large' }), basicTable(s, { size: 'large', framed: true })] },
        ])}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.cells, title: d.cellsTitle },
          { id: SECTIONS.rows, title: d.rowsTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${useDontUse({ title: d.whenToUseTitle, items: d.whenToUse }, { title: d.whenNotToUseTitle, items: d.whenNotToUse })}
            ${text(d.relationsText)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.api, d.apiTitle, html`${table(d.apiHeader, d.api.map(pair))} ${source(d.sourceLabel, d.sourceApi)}`)}

        ${section(
          SECTIONS.variants,
          d.variantsTitle,
          html`
            ${text(d.variantsText)}
            ${demo(
              html`<div style=${stack}>
                ${basicTable(s)} ${basicTable(s, { size: 'large', framed: true })} ${basicTable(s, { framed: true, sticky: true }, manyRows(s, 12))}
              </div>`,
              d.variantsCaption,
            )}
            ${table(d.variantsHeader, d.variants.map(pair))} ${source(d.sourceLabel, d.sourceVariants)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${text(d.statesText)}
            ${demo(full(basicTable(s, { striped: true, grid: true, framed: true })), d.statesCaption)}
            ${table(d.statesHeader, d.states.map(pair), 'text')} ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.cells,
          d.cellsTitle,
          html`
            ${text(d.cellsText)}
            ${demo(html`<div style=${stack}>${peopleTable(s)} ${actionsTable(s)}</div>`, d.cellsCaption)}
            ${table(d.cellsHeader, d.cells.map(pair))} ${source(d.sourceLabel, d.sourceCells)}
          `,
        )}

        ${section(
          SECTIONS.rows,
          d.rowsTitle,
          html`
            ${text(d.rowsText)}
            ${demo(full(orderTable(s, ['open', 'closed'])), d.rowsCaption)}
            ${demo(full(treeTable(s, true)), d.treeCaption)}
            ${demo(full(groupTable(s)), d.groupsCaption)}
            ${source(d.sourceLabel, d.sourceRows)}
          `,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAnatomy)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${table(d.accessibilityHeader, d.accessibility.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAccessibility)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(bothModes(d, s, groupedByCategory), d.exampleGrouped)}
            ${demo(bothModes(d, s, openOrder), d.exampleOrder)}
            ${demo(bothModes(d, s, wideCaptionTable), d.exampleCaption)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
