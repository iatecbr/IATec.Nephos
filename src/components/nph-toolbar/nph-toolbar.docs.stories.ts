/**
 * Reading page of `nph-toolbar`.
 *
 * It does not prove the contract — that is the role of `Components/nph-toolbar/Validation` and
 * of the tests. The content is transcribed from the documentation accepted in Figma (page
 * `NPH — Toolbar`, documentation `2944:6528`, set `2105:426`), from the spec sheet
 * (`fichas/nph-toolbar.md`) and from P104; nothing is decided here. The page follows the order
 * of the `nph-badge` and `nph-chip` pages: it opens with the labelled matrix, and the two lists
 * of "When to use" are the ones of the sheet. Then API, Usage, the sections of the piece itself
 * (Types, Sizes, Options, States, Applied filters, Relations and context), Anatomy,
 * Accessibility, Do and do not, and the three mandatory examples of the documentation, each in
 * light and dark mode.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `toolbarDocs`
 * key. The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical
 * identifiers appear literally and are the same in any language. The package name of the import
 * line is read from `package.json` by the `usage` block (P70).
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import { NPH_TOOLBAR_SIZES } from './nph-toolbar';
import { bothModes, bulkBar, floatingBar, pageBar, pageWithFilters, toolsBar } from './nph-toolbar.demo';
import type { ToolbarText } from './nph-toolbar.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage, useDontUse } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-toolbar.json';

const meta: Meta = {
  title: 'Components/nph-toolbar/Docs',
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
  types: 'types',
  sizes: 'sizes',
  options: 'options',
  states: 'states',
  appliedFilters: 'applied-filters',
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
    const d = translations(localeOf(context)).toolbarDocs;
    const t = d as unknown as ToolbarText;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption, dark: d.darkCaption };

    return html`
      <main style=${body}>
        ${header('nph-toolbar', d.summary)}
        ${matrix(d.matrixLabel, [], [
          { label: 'type: bulk', cells: [bulkBar(t)] },
          { label: 'type: page', cells: [pageBar(t)] },
          { label: 'type: tools', cells: [toolsBar(t)] },
          { label: 'type: floating', cells: [floatingBar(t)] },
          { label: 'type: page · applied-filters', cells: [pageWithFilters(t)] },
        ])}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.types, title: d.typesTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.options, title: d.optionsTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.appliedFilters, title: d.filtersTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-toolbar', 'nph-button'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.types,
          d.typesTitle,
          html`
            ${text(d.typesText)}
            ${table(d.typesHeader, d.types.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(html`<div style=${column}>${NPH_TOOLBAR_SIZES.map((size) => pageBar(t, { size }))}</div>`, d.sizesCaption)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.options,
          d.optionsTitle,
          html`
            ${text(d.optionsText)}
            ${demo(
              html`<div style=${column}>
                ${bulkBar(t, { checkbox: false })} ${bulkBar(t, { clearIcon: true })} ${bulkBar(t, { center: true })}
              </div>`,
              d.optionsCaption,
            )}
            ${table(d.optionsHeader, d.options.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${text(d.statesText)}
            ${demo(
              html`<div style=${column}>
                ${pageBar(t, { createState: 'disabled' })} ${pageBar(t, { createState: 'loading' })}
              </div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.appliedFilters,
          d.filtersTitle,
          html`
            ${text(d.filtersText)}
            ${demo(pageWithFilters(t), d.filtersCaption)}
            ${table(d.filtersHeader, d.filtersRules.map(pair), 'text')}
            ${source(d.sourceLabel, d.sourceFilters)}
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
            ${demo(bothModes(captions, () => bulkBar(t, { checkbox: false, count: d.countExample })), d.exampleTable)}
            ${demo(bothModes(captions, () => pageBar(t, { center: true })), d.exampleList)}
            ${demo(bothModes(captions, () => toolsBar(t)), d.exampleEditor)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
