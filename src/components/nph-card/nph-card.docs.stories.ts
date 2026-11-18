/**
 * Reading page of `nph-card`.
 *
 * It does not prove the contract — that is the role of `Components/nph-card/Validation` and of the tests. The content is
 * transcribed from the documentation accepted in Figma (frame `6516:13647`), from the spec sheet (`ficha`) and from P130;
 * nothing is decided here. The page follows the order of the `nph-badge` page: it opens with the labelled matrix, and the
 * two lists of "When to use" are the ones of the sheet. The five required examples of the frame close it, each in light and
 * dark mode.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `cardDocs` key; the texts of the cards
 * shown come from `cardValidation`. The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical
 * identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-card';
import { collection, detail, file, inScheme, profile, sample, summary } from './nph-card.demo';
import type { CardText, Scheme } from './nph-card.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-card.json';

const meta: Meta = {
  title: 'Components/nph-card/Docs',
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
  media: 'media',
  states: 'states',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';
const wrap = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';

/** The same example in light and in dark mode, side by side. */
function bothModes(d: Record<string, unknown>, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', d.lightCaption as string],
    ['dark', d.darkCaption as string],
  ];
  return html`<div style=${modes}>${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}</div>`;
}

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const d = translations(locale).cardDocs;
    const v = translations(locale).cardValidation as CardText;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;

    return html`
      <main style=${body}>
        ${header('nph-card', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: 'type: base', cells: [sample(v, { width: 'narrow', status: true, content: true, footer: false })] },
            { label: 'type: clickable', cells: [sample(v, { type: 'clickable', width: 'narrow' })] },
            { label: 'type: section', cells: [sample(v, { type: 'section', width: 'narrow', footer: false, description: false })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.types, title: d.typesTitle },
          { id: SECTIONS.media, title: d.mediaTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${sheetUseDontUse(metadata, locale, d)}
            ${text(d.relationsText)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(pair))} ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-card', 'nph-button'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.types,
          d.typesTitle,
          html`
            ${text(d.typesText)}
            ${demo(
              html`<div style=${wrap}>
                ${sample(v, { width: 'narrow', status: true, content: true, footer: false })} ${sample(v, { type: 'clickable', width: 'narrow' })}
                ${sample(v, { type: 'section', width: 'narrow', footer: false, description: false })}
              </div>`,
              d.typesCaption,
            )}
            ${table(d.typesHeader, d.types.map(pair), 'text')} ${source(d.sourceLabel, d.sourceTypes)}
          `,
        )}

        ${section(
          SECTIONS.media,
          d.mediaTitle,
          html`
            ${text(d.mediaText)}
            ${demo(
              html`<div style=${wrap}>
                ${sample(v, { media: 'top', width: 'narrow', footer: false })} ${sample(v, { media: 'inset-top', width: 'narrow', footer: false })}
                ${sample(v, { media: 'side', width: 'wide', footer: false })}
              </div>`,
              d.mediaCaption,
            )}
            ${table(d.mediaHeader, d.media.map(pair), 'text')} ${source(d.sourceLabel, d.sourceMedia)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${text(d.statesText)}
            ${demo(
              html`<div style=${wrap}>
                ${sample(v, { type: 'clickable', width: 'narrow' })} ${sample(v, { type: 'clickable', width: 'narrow', disabled: true })}
                ${sample(v, { width: 'narrow', loading: true })}
              </div>`,
              d.statesCaption,
            )}
            ${table(d.statesHeader, d.states.map(pair), 'text')} ${source(d.sourceLabel, d.sourceStates)}
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
            ${demo(bothModes(d, () => summary(v)), d.exampleSummary)}
            ${demo(bothModes(d, () => collection(v, true)), d.exampleCollection)}
            ${demo(bothModes(d, () => detail(v)), d.exampleDetail)}
            ${demo(bothModes(d, () => profile(v)), d.exampleProfile)}
            ${demo(bothModes(d, () => file(v)), d.exampleFile)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
