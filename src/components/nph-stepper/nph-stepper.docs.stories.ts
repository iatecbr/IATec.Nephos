/**
 * Reading page of `nph-stepper`.
 *
 * It does not prove the contract — that is the role of `Components/nph-stepper/Validation` and of the
 * tests. The content is transcribed from the documentation frame accepted in Figma (`5569:6530`),
 * from the spec sheet (`ficha`) and from P117; nothing is decided here. The page follows the order of
 * the `nph-badge` page: it opens with the labelled matrix of the statuses and the two "When to use"
 * lists are the ones of the sheet, read from its Metadata (P71). Usage shows the markup of the stepper
 * and the property that carries the steps.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `stepperDocs` key; the
 * sample texts of the steppers come from `stepperValidation`. The story is SINGLE: it reads
 * `globals.locale` and looks up the translation. Technical identifiers appear literally and are the
 * same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-stepper';
import {
  MATRIX_WIDTH,
  NARROW_WIDTH,
  bothModes,
  contentSteps,
  disabledSteps,
  errorSteps,
  examples,
  longSteps,
  nonLinearSteps,
  signUpSteps,
  stepper,
} from './nph-stepper.demo';
import type { ExampleTexts } from './nph-stepper.demo';
import { body, demo, header, index, list as bullets, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-stepper.json';

const meta: Meta = {
  title: 'Components/nph-stepper/Docs',
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
  statuses: 'statuses',
  navigation: 'navigation',
  width: 'width',
  keyboard: 'keyboard',
  relations: 'relations',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/** Demo frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const d = translations(locale).stepperDocs;
    const v = translations(locale).stepperValidation as unknown as ExampleTexts & Record<string, unknown>;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const demoStatuses = html`<div style=${stack}>
      ${stepper(v, { current: 2, width: MATRIX_WIDTH })} ${stepper(v, { steps: errorSteps(v), current: 3, width: MATRIX_WIDTH })}
      ${stepper(v, { steps: contentSteps(v), current: 2, width: MATRIX_WIDTH })}
    </div>`;
    const demoNavigation = html`<div style=${stack}>
      ${stepper(v, { steps: errorSteps(v), current: 3, width: MATRIX_WIDTH })}
      ${stepper(v, { steps: nonLinearSteps(v), current: 3, nonLinear: true, width: MATRIX_WIDTH })}
      ${stepper(v, { steps: disabledSteps(v, { reason: true }), current: 2, width: MATRIX_WIDTH })}
    </div>`;
    const demoWidth = html`<div style=${stack}>
      ${stepper(v, { steps: longSteps(v), current: 4, width: '60rem' })} ${stepper(v, { steps: longSteps(v), current: 1, width: '60rem' })}
      ${stepper(v, { steps: signUpSteps(v), current: 2, width: NARROW_WIDTH })}
    </div>`;

    return html`
      <div style=${body}>
        ${header('nph-stepper', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: 'status: completed, current, pending', cells: [stepper(v, { current: 2, width: MATRIX_WIDTH })] },
            { label: 'status: completed, error, current, pending', cells: [stepper(v, { steps: errorSteps(v), current: 3, width: MATRIX_WIDTH })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.statuses, title: d.statusesTitle },
          { id: SECTIONS.navigation, title: d.navigationTitle },
          { id: SECTIONS.width, title: d.widthTitle },
          { id: SECTIONS.keyboard, title: d.keyboardTitle },
          { id: SECTIONS.relations, title: d.relationsTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-stepper'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.statuses,
          d.statusesTitle,
          html`
            ${demo(demoStatuses, d.statusesCaption)}
            ${table(d.statusesUseHeader, d.statusesUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.navigation,
          d.navigationTitle,
          html`
            ${demo(demoNavigation, d.navigationCaption)}
            ${bullets(d.navigation)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.width,
          d.widthTitle,
          html`
            ${demo(demoWidth, d.widthCaption)}
            ${bullets(d.width)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.keyboard,
          d.keyboardTitle,
          html`${table(d.keyboardHeader, d.keyboard.map(pair), 'text')} ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(
          SECTIONS.relations,
          d.relationsTitle,
          html`${bullets(d.relations)} ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAnatomy)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${table(d.accessibilityHeader, d.accessibility.map(pair), 'text')} ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(
              bothModes({ light: d.lightCaption as string, dark: d.darkCaption as string }, (): TemplateResult => examples(v)),
              d.examplesCaption,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, bullets(d.references))}
      </div>
    `;
  },
};
