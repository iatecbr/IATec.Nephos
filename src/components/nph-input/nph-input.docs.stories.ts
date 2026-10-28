/**
 * Reading page of `nph-input`.
 *
 * It does not prove the contract — that is the role of `Components/nph-input/Validation` and of
 * the tests. The content is transcribed from the frame accepted in Figma (`1195:532`), from the
 * spec sheet (`ficha`) and from P80; nothing is decided here. The page follows the order of the
 * `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use" are the
 * ones of the sheet. The set has one variant axis, `size`, so there is no Variants section: Sizes
 * and States come first, then the sections of the piece itself, Icons and Types. Sizes shows the
 * `compact` search in light and dark mode, as section 5 of the frame (DSA-59). The three
 * required examples of the frame close it, each in light and dark mode; the error sentence sits
 * outside the piece, where `nph-field` (DSA-28) will write it.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `inputDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical
 * identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-input';
import { fieldWithLabel, inScheme, search, withError } from './nph-input.demo';
import type { Scheme } from './nph-input.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-input.json';

const meta: Meta = {
  title: 'Components/nph-input/Docs',
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
  sizes: 'sizes',
  states: 'states',
  icons: 'icons',
  types: 'types',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/** The three sizes of the set, in the order of the matrix. */
const SIZES = ['compact', 'default', 'large'];

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';

/** The same example in light and in dark mode, side by side. */
function bothModes(d: Record<string, string>, content: () => TemplateResult): TemplateResult {
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
    const d = translations(localeOf(context)).inputDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const piece = (attributes: { size?: string; value?: boolean; invalid?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-input
        size=${attributes.size ?? 'default'}
        label=${d.emailLabel}
        placeholder=${d.emailPlaceholder}
        value=${attributes.value ? d.emailValue : ''}
        ?invalid=${attributes.invalid ?? false}
        ?disabled=${attributes.disabled ?? false}
      ></nph-input>`;
    const searchText = { label: d.searchLabel, placeholder: d.searchPlaceholder, clearLabel: d.clearLabel };

    return html`
      <main style=${body}>
        ${header('nph-input', d.summary)}
        ${matrix(
          d.matrixLabel,
          SIZES.map((size) => `size: ${size}`),
          [
            { label: 'placeholder', cells: SIZES.map((size) => piece({ size })) },
            { label: 'value', cells: SIZES.map((size) => piece({ size, value: true })) },
            { label: 'invalid', cells: SIZES.map((size) => piece({ size, value: true, invalid: true })) },
            { label: 'disabled', cells: SIZES.map((size) => piece({ size, value: true, disabled: true })) },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.icons, title: d.iconsTitle },
          { id: SECTIONS.types, title: d.typesTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${text(d.description)}
            ${sheetUseDontUse(metadata, localeOf(context), d)}
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-input'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(html`<div style=${column}>${SIZES.map((size) => piece({ size, value: true }))}</div>`, d.sizesCaption)}
            ${demo(bothModes(d, () => search({ ...searchText, value: d.searchValue, size: 'compact' })), d.compactCaption)}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(pair))}
            ${demo(
              html`<div style=${column}>
                ${piece({ value: true })} ${piece({ value: true, invalid: true })} ${piece({ value: true, disabled: true })}
                ${piece({ value: true, disabled: true, invalid: true })}
              </div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.icons,
          d.iconsTitle,
          html`
            ${text(d.iconsText)}
            ${demo(html`<div style=${column}>${search({ ...searchText, value: d.searchValue })}</div>`, d.iconsCaption)}
            ${table(d.iconsHeader, d.icons.map(pair))} ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.types,
          d.typesTitle,
          html`${table(d.typesHeader, d.types.map(pair))} ${note('warning', d.invalidTitle, d.invalidText)} ${source(d.sourceLabel, d.sourceApi)}`,
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
            ${demo(bothModes(d, () => search({ ...searchText, value: d.searchValue })), d.exampleSearch)}
            ${demo(bothModes(d, () => fieldWithLabel({ label: d.emailLabel, placeholder: d.emailPlaceholder, required: true })), d.exampleLabel)}
            ${demo(
              bothModes(d, () =>
                withError({ label: d.emailLabel, placeholder: d.emailPlaceholder, required: true, value: d.emailWrong, sentence: d.errorSentence }),
              ),
              d.exampleError,
            )}
            ${note('info', d.fieldNoteTitle, d.fieldNoteText)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
