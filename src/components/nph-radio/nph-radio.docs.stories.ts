/**
 * Reading page of `nph-radio`.
 *
 * It does not prove the contract — that is the role of `Components/nph-radio/Validation` and of
 * the tests. The content is transcribed from the frame accepted in Figma (`1196:311`), from the
 * spec sheet (`ficha`) and from P82; nothing is decided here. The page follows the order of the
 * `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use" are the
 * ones of the sheet. The three required examples of the frame close it, each in light and dark
 * mode. Each group of the examples is an `nph-field` around the radios (P83; see `nph-radio.demo.ts`).
 *
 * Deferred, not fulfilled here:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35;
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `radioDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical
 * identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-radio';
import { employment, inScheme, payment, radio, shift } from './nph-radio.demo';
import type { Scheme } from './nph-radio.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-radio.json';

const meta: Meta = {
  title: 'Components/nph-radio/Docs',
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
  group: 'group-and-keyboard',
  form: 'form',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';

/** The same example in light and in dark mode, side by side; the scheme keeps the two groups apart. */
function bothModes(d: Record<string, string>, content: (scheme: Scheme) => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', d.lightCaption as string],
    ['dark', d.darkCaption as string],
  ];
  return html`<div style=${modes}>${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content(scheme)))}</div>`;
}

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).radioDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    /* Each row of a matrix is one group of two, so one radio is unchecked and the other checked. */
    const row = (prefix: string, key: string, flags: { disabled?: boolean; invalid?: boolean }, withText = true): TemplateResult[] => {
      const name = `${prefix}-${key}`;
      const item = (value: string, words: string) => (withText ? { value, text: words, ...flags } : { value, label: words, ...flags });
      return [radio(name, item('a', d.card)), radio(name, item('b', d.pix), true)];
    };

    return html`
      <main style=${body}>
        ${header('nph-radio', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['checked: false', 'checked: true'],
          [
            { label: 'text: yes', cells: row('docs-matrix', 'text', {}) },
            { label: 'text: no', cells: row('docs-matrix', 'no-text', {}, false) },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.group, title: d.groupTitle },
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
              matrix(
                d.statesTitle,
                ['checked: false', 'checked: true'],
                [
                  { label: 'state: default', cells: row('docs-states', 'default', {}) },
                  { label: 'state: invalid', cells: row('docs-states', 'invalid', { invalid: true }) },
                  { label: 'state: disabled', cells: row('docs-states', 'disabled', { disabled: true }) },
                ],
              ),
              d.statesCaption,
            )}
            ${table(d.statesHeader, d.states.map(pair))} ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.group,
          d.groupTitle,
          html`
            ${text(d.groupText)} ${table(d.groupHeader, d.groupRules.map(pair))} ${source(d.sourceLabel, d.sourceGroup)}
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
            ${demo(bothModes(d, (scheme) => payment(d, `docs-payment-${scheme}`)), d.examplePayment)}
            ${demo(bothModes(d, (scheme) => employment(d, `docs-employment-${scheme}`)), d.exampleEmployment)}
            ${demo(bothModes(d, (scheme) => shift(d, `docs-shift-${scheme}`)), d.exampleShift)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
