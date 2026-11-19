/**
 * Reading page of `nph-rich-option`.
 *
 * It does not prove the contract — that is the role of `Components/nph-rich-option/Validation` and
 * of the tests. The content is transcribed from the frame accepted in Figma (`6935:11785`), from the
 * spec sheet (`ficha`) and from P134; nothing is decided here. The page follows the order of the
 * `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use" are the
 * ones of the sheet. The three required examples of the frame close it, each in light and dark mode.
 * Each group of the examples is an `nph-field` around the cards (P83; see `nph-rich-option.demo.ts`).
 * The rich option of the list is a section of its own, since it is the `nph-option` with `rich` and
 * has no tag.
 *
 * Deferred, not fulfilled here:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `richOptionDocs` key,
 * and the content of the examples under `richOptionValidation`. The story is SINGLE: it reads
 * `globals.locale` and looks up the translation. Technical identifiers appear literally and are the
 * same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-rich-option';
import { assignPeople, bothModes, card, notices, plans, richOptions } from './nph-rich-option.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-rich-option.json';

const meta: Meta = {
  title: 'Components/nph-rich-option/Docs',
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
  group: 'group-and-keyboard',
  form: 'form',
  richOption: 'rich-option',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const d = translations(locale).richOptionDocs;
    const v = translations(locale).richOptionValidation;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    /* Each card of a matrix is its own group, so a checked radio card never unchecks another. */
    const cell = (control: 'checkbox' | 'radio' | 'switch', checked: boolean, flags: { invalid?: boolean; disabled?: boolean }, key: string) =>
      card({ control, name: `docs-${key}-${control}-${String(checked)}`, text: v.cardTitle, description: v.cardText, checked, ...flags });

    return html`
      <main style=${body}>
        ${header('nph-rich-option', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['control: checkbox', 'control: radio', 'control: switch'],
          [false, true].map((checked) => ({
            label: `checked: ${String(checked)}`,
            cells: (['checkbox', 'radio', 'switch'] as const).map((control) => cell(control, checked, {}, 'matrix')),
          })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.group, title: d.groupTitle },
          { id: SECTIONS.form, title: d.formTitle },
          { id: SECTIONS.richOption, title: d.richOptionTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-rich-option'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
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
                  { label: 'state: default', cells: [false, true].map((checked) => cell('radio', checked, {}, 'states-default')) },
                  { label: 'state: invalid', cells: [false, true].map((checked) => cell('radio', checked, { invalid: true }, 'states-invalid')) },
                  { label: 'state: disabled', cells: [false, true].map((checked) => cell('radio', checked, { disabled: true }, 'states-disabled')) },
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
          SECTIONS.richOption,
          d.richOptionTitle,
          html`
            ${text(d.richOptionText)}
            ${demo(
              matrix(
                d.richOptionTitle,
                ['marker: check', 'marker: checkbox'],
                [
                  { label: 'state: default', cells: [richOptions(v, {}, 'check'), richOptions(v, {}, 'checkbox')] },
                  { label: 'state: active (keyboard)', cells: [richOptions(v, { active: true, keyboard: true }, 'check'), richOptions(v, { active: true, keyboard: true }, 'checkbox')] },
                  { label: 'state: selected', cells: [richOptions(v, { selected: true }, 'check'), richOptions(v, { selected: true }, 'checkbox')] },
                ],
              ),
              d.richOptionCaption,
            )}
            ${table(d.richOptionHeader, d.richOptionRules.map(pair))} ${source(d.sourceLabel, d.sourceRichOption)}
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
            ${demo(bothModes({ light: v.lightCaption, dark: v.darkCaption }, (scheme) => plans(v, `docs-plan-${scheme}`)), v.examplePlan)}
            ${demo(bothModes({ light: v.lightCaption, dark: v.darkCaption }, (scheme) => notices(v, `docs-notices-${scheme}`)), v.exampleNotices)}
            ${demo(bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => assignPeople(v), true), v.examplePeople)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
