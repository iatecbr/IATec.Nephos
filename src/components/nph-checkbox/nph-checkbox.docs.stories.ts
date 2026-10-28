/**
 * Reading page of `nph-checkbox`.
 *
 * It does not prove the contract — that is the role of `Components/nph-checkbox/Validation`
 * and of the tests. The content is transcribed from the frame accepted in Figma (`1194:1033`),
 * from the spec sheet (`ficha`) and from P81; nothing is decided here. The page follows the
 * order of the `nph-badge` page: it opens with the labelled matrix, and the two lists of "When
 * to use" are the ones of the sheet. The three required examples of the frame close it, each
 * in light and dark mode.
 *
 * Deferred, not fulfilled here:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35, which also gives
 *   `package.json` the `exports` for the import line;
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `checkboxDocs`
 * key. The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical
 * identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-checkbox';
import { checkbox, consent, groupSelection, inScheme, preferences, stack, withError } from './nph-checkbox.demo';
import type { CheckboxOptions, Scheme } from './nph-checkbox.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-checkbox.json';

const meta: Meta = {
  title: 'Components/nph-checkbox/Docs',
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
  states: 'states',
  form: 'form',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';

/** The same example in light and in dark mode, side by side. */
function bothModes(d: Record<string, string>, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', d.lightCaption as string],
    ['dark', d.darkCaption as string],
  ];
  return html`<div style=${modes}>${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}</div>`;
}

const MARKED: ReadonlyArray<readonly [string, CheckboxOptions]> = [
  ['checked: false', {}],
  ['checked: true', { checked: true }],
  ['indeterminate', { indeterminate: true }],
];

const STATES: ReadonlyArray<readonly [string, CheckboxOptions]> = [
  ['default', {}],
  ['invalid', { invalid: true }],
  ['disabled', { disabled: true }],
];

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).checkboxDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;

    return html`
      <main style=${body}>
        ${header('nph-checkbox', d.summary)}
        ${matrix(
          d.matrixLabel,
          STATES.map(([name]) => name),
          MARKED.map(([row, marked]) => ({
            label: row,
            cells: STATES.map(([, state]) => checkbox({ text: d.rememberMe, ...marked, ...state })),
          })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.form, title: d.formTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
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
          SECTIONS.states,
          d.statesTitle,
          html`
            ${text(d.statesText)}
            ${demo(
              html`<div style=${stack}>
                ${checkbox({ text: d.longText })} ${checkbox({ label: d.selectRow, checked: true })}
                ${withError(checkbox({ text: d.rememberMe, invalid: true }), d.errorSentence)}
              </div>`,
              d.statesCaption,
            )}
            ${table(d.statesHeader, d.states.map(pair))} ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.form,
          d.formTitle,
          html`${text(d.formText)} ${table(d.formHeader, d.formRules.map(pair))} ${source(d.sourceLabel, d.sourceForm)}`,
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
            ${demo(bothModes(d, () => consent(d)), d.exampleConsent)}
            ${demo(bothModes(d, () => preferences(d)), d.examplePreferences)}
            ${demo(bothModes(d, () => groupSelection(d)), d.exampleGroup)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
