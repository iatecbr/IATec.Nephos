/**
 * Reading page of `nph-data-table`.
 *
 * It does not prove the contract — that is the role of `Components/nph-data-table/Validation`
 * and of the tests. The content is transcribed from the documentation accepted in Figma (page
 * `NPH — Data Table` `1371:2`, documentation `2875:17577`, set `2633:69628`), from the spec
 * sheet (`fichas/nph-data-table.md`) and from P105; nothing is decided here. The page follows the
 * order of the `nph-badge` and `nph-toolbar` pages: it opens with the labelled matrix, and the
 * two lists of "When to use" are the ones of the sheet. Then API, Usage, the sections of the
 * piece itself (States, Sizes and appearance, Sorting, Selection, Row actions and switch,
 * Footer, Relations and context), Anatomy, Accessibility, Do and do not, and the three
 * mandatory examples of the documentation, each in light and dark mode.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `dataTableDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language. The
 * package name of the import line is read from `package.json` by the `usage` block (P70).
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import { bothModes, peopleTable } from './nph-data-table.demo';
import type { DataTableText } from './nph-data-table.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage, useDontUse } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-data-table.json';

const meta: Meta = {
  title: 'Components/nph-data-table/Docs',
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
  usage: 'usage',
  states: 'states',
  sizes: 'sizes-and-appearance',
  sorting: 'sorting',
  selection: 'selection',
  rowActions: 'row-actions-and-switch',
  footer: 'footer',
  relations: 'relations-and-context',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  doAndDont: 'do-and-do-not',
  examples: 'mandatory-examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; align-items: stretch; gap: var(--nph-space-stack);';

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).dataTableDocs;
    const t = d as unknown as DataTableText;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption, dark: d.darkCaption };
    const small = { toolbar: false, layout: 'none' as const, records: 4 };

    return html`
      <main style=${body}>
        ${header('nph-data-table', d.summary)}
        ${matrix(d.matrixLabel, [], [
          { label: 'state: default', cells: [peopleTable(t)] },
          { label: 'state: bulk', cells: [peopleTable(t, { state: 'bulk' })] },
          { label: 'state: empty', cells: [peopleTable(t, { state: 'empty' })] },
          { label: 'state: loading', cells: [peopleTable(t, { state: 'loading' })] },
        ])}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.sorting, title: d.sortingTitle },
          { id: SECTIONS.selection, title: d.selectionTitle },
          { id: SECTIONS.rowActions, title: d.rowActionsTitle },
          { id: SECTIONS.footer, title: d.footerTitle },
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
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-data-table', 'nph-toolbar'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${text(d.statesText)}
            ${table(d.statesHeader, d.states.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(html`<div style=${column}>${peopleTable(t, { ...small, size: 'large', framed: true })}</div>`, d.sizesCaption)}
            ${table(d.appearanceHeader, d.appearance.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.sorting,
          d.sortingTitle,
          html`
            ${text(d.sortingText)}
            ${demo(peopleTable(t, { ...small, selectable: false, withActions: false, sort: { key: 'amount', direction: 'descending' } }), d.sortingCaption)}
            ${table(d.sortingHeader, d.sorting.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.selection,
          d.selectionTitle,
          html`
            ${text(d.selectionText)}
            ${demo(peopleTable(t, { state: 'bulk', records: 4, layout: 'none' }), d.selectionCaption)}
            ${table(d.selectionHeader, d.selectionRules.map(pair), 'text')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.rowActions,
          d.rowActionsTitle,
          html`
            ${text(d.rowActionsText)}
            ${demo(peopleTable(t, { ...small, withSwitch: true, withUnit: false }), d.rowActionsCaption)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.footer,
          d.footerTitle,
          html`
            ${text(d.footerText)}
            ${demo(
              html`<div style=${column}>
                ${peopleTable(t, { toolbar: false, layout: 'wide' })} ${peopleTable(t, { toolbar: false, layout: 'narrow' })}
              </div>`,
              d.footerCaption,
            )}
            ${table(d.footerHeader, d.footer.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFooter)}
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
            ${demo(bothModes(captions, () => peopleTable(t, { sort: { key: 'person', direction: 'ascending' } })), d.exampleList)}
            ${demo(bothModes(captions, () => peopleTable(t, { state: 'bulk' })), d.exampleSelected)}
            ${demo(bothModes(captions, () => peopleTable(t, { state: 'empty' })), d.exampleEmpty)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
