/**
 * Reading page of `nph-chip`.
 *
 * It does not prove the contract — that is the role of `Components/nph-chip/Validation` and of
 * the tests. The content is transcribed from the documentation accepted in Figma (page `NPH —
 * Chip`, documentation `3077:2240`, set `3076:1439`, board `3077:807`), from the spec sheet
 * (`fichas/nph-chip.md`) and from P100; nothing is decided here. The page follows the order of
 * the `nph-badge` and `nph-pagination` pages: it opens with the labelled matrix, and the two
 * lists of "When to use" are the ones of the sheet. Then API, Usage, the sections of the piece
 * itself (Types, Severities, Sizes, States, Content, Long text, Relations and context),
 * Anatomy, Accessibility, Do and do not, and the three mandatory examples of the documentation,
 * each in light and dark mode.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `chipDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical
 * identifiers appear literally and are the same in any language. The package name of the import
 * line is read from `package.json` (P70).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import pkg from '../../../package.json';
import { NPH_CHIP_SEVERITIES, NPH_CHIP_SIZES } from './nph-chip';
import { appliedFilters, bothModes, chip, chosenValues, LINE, quickFilters } from './nph-chip.demo';
import type { ExampleText } from './nph-chip.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, useDontUse } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-chip.json';

const meta: Meta = {
  title: 'Components/nph-chip/Docs',
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
  severities: 'severities',
  sizes: 'sizes',
  states: 'states',
  content: 'content',
  longText: 'long-text',
  relations: 'relations-and-context',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  doAndDont: 'do-and-do-not',
  examples: 'mandatory-examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack);';

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).chipDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption, dark: d.darkCaption };
    const examples = d as unknown as ExampleText;
    const quick = d.quick[0] as string;
    const line = (content: TemplateResult[]): TemplateResult => html`<div style=${LINE}>${content}</div>`;

    /** The states a removable chip has as attributes, and the selectable ones. */
    const removableStates = line([
      chip(d.removeLabel, d.plain),
      chip(d.removeLabel, d.plain, { marked: true }),
      chip(d.removeLabel, d.plain, { readonly: true }),
      chip(d.removeLabel, d.plain, { invalid: true }),
      chip(d.removeLabel, d.plain, { disabled: true }),
    ]);
    const selectableStates = line([
      chip(d.removeLabel, quick, { type: 'selectable', counter: 12 }),
      chip(d.removeLabel, quick, { type: 'selectable', counter: 12, selected: true }),
      chip(d.removeLabel, quick, { type: 'selectable', counter: 12, disabled: true }),
      chip(d.removeLabel, quick, { type: 'selectable', counter: 12, selected: true, disabled: true }),
    ]);

    return html`
      <main style=${body}>
        ${header('nph-chip', d.summary)}
        ${matrix(d.matrixLabel, [], [
          {
            label: 'severity',
            cells: [line(NPH_CHIP_SEVERITIES.map((severity) => chip(d.removeLabel, d.plain, { severity })))],
          },
          {
            label: 'icon · avatar · text',
            cells: [
              line([
                chip(d.removeLabel, d.filters.period, { icon: 'calendar-days' }),
                chip(d.removeLabel, d.filters.person, { avatar: true }),
                chip(d.removeLabel, d.plain),
              ]),
            ],
          },
          { label: 'default · marked · readonly · invalid · disabled', cells: [removableStates] },
          { label: 'type: selectable', cells: [selectableStates] },
        ])}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.types, title: d.typesTitle },
          { id: SECTIONS.severities, title: d.severitiesTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.content, title: d.contentTitle },
          { id: SECTIONS.longText, title: d.longTextTitle },
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
          html`${table(
              d.usageHeader,
              [
                ['<nph-chip></nph-chip>', d.usageTag],
                [`import '${pkg.name}/nph-chip';`, d.usageImport],
              ],
              'code',
            )}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.types,
          d.typesTitle,
          html`
            ${demo(
              line([chip(d.removeLabel, d.plain), chip(d.removeLabel, quick, { type: 'selectable', counter: 12 })]),
              d.typesCaption,
            )}
            ${table(d.typesHeader, d.types.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.severities,
          d.severitiesTitle,
          html`
            ${text(d.severitiesText)}
            ${demo(line(NPH_CHIP_SEVERITIES.map((severity) => chip(d.removeLabel, d.plain, { severity }))), d.severitiesCaption)}
            ${table(d.severitiesHeader, d.severities.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(
              line(
                NPH_CHIP_SIZES.flatMap((size) => [
                  chip(d.removeLabel, d.plain, { size }),
                  chip(d.removeLabel, quick, { type: 'selectable', counter: 12, size }),
                ]),
              ),
              d.sizesCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${text(d.statesText)}
            ${demo(html`<div style=${column}>${removableStates} ${selectableStates}</div>`, d.statesCaption)}
            ${table(d.statesHeader, d.states.map(pair), 'text')}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.content,
          d.contentTitle,
          html`
            ${text(d.contentText)}
            ${demo(
              html`<div style=${column}>
                ${line([
                  chip(d.removeLabel, d.plain),
                  chip(d.removeLabel, d.filters.period, { icon: 'calendar-days' }),
                  chip(d.removeLabel, d.filters.person, { avatar: true }),
                ])}
                ${line([
                  chip(d.removeLabel, quick, { type: 'selectable' }),
                  chip(d.removeLabel, quick, { type: 'selectable', icon: 'filter' }),
                  chip(d.removeLabel, quick, { type: 'selectable', counter: 12 }),
                ])}
              </div>`,
              d.contentCaption,
            )}
            ${table(d.contentHeader, d.content.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceContent)}
          `,
        )}

        ${section(
          SECTIONS.longText,
          d.longTextTitle,
          html`
            ${text(d.longTextText)}
            ${demo(
              line([chip(d.removeLabel, d.long), chip(d.removeLabel, d.long, { type: 'selectable', counter: 12 })]),
              d.longTextCaption,
            )}
            ${source(d.sourceLabel, d.sourceLongText)}
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
            ${demo(bothModes(captions, () => appliedFilters(examples)), d.exampleFilters)}
            ${demo(bothModes(captions, () => chosenValues(examples)), d.exampleField)}
            ${demo(bothModes(captions, () => quickFilters(examples)), d.exampleQuick)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
