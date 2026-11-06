/**
 * Reading page of `nph-progress`.
 *
 * It does not prove the contract — that is the role of `Components/nph-progress/Validation` and of
 * the tests. The content is transcribed from the documentation frame accepted in Figma (`4385:3186`),
 * from the spec sheet (`ficha`) and from P107; nothing is decided here. The page follows the order
 * of the `nph-badge` page: it opens with the labelled matrix of the three types and the two
 * "When to use" lists are the ones of the sheet, read from its Metadata (P71). Usage shows the
 * markup of the required upload example.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `progressDocs` key;
 * the sample texts of the bars come from `progressValidation`. The story is SINGLE: it reads
 * `globals.locale` and looks up the translation. Technical identifiers appear literally and are the
 * same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-progress';
import { NPH_PROGRESS_SIZES } from './nph-progress';
import { examples, inScheme } from './nph-progress.demo';
import type { Scheme } from './nph-progress.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-progress.json';

const meta: Meta = {
  title: 'Components/nph-progress/Docs',
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
  status: 'status',
  relations: 'relations',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const slot = 'inline-size: var(--nph-layout-field-width); max-inline-size: 100%;';
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';

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
    const locale = localeOf(context);
    const d = translations(locale).progressDocs;
    const v = translations(locale).progressValidation;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const demoTypes = html`<div style="${stack} ${slot}">
      <nph-progress value="50" label=${v.sampleLabel} value-text="50%"></nph-progress>
      <nph-progress type="indeterminate" label=${v.preparingLabel} value-text=${v.preparingValue}></nph-progress>
      <nph-progress type="steps" steps="4" step="1" label=${v.signUpLabel} value-text=${v.signUpValue}></nph-progress>
    </div>`;
    const demoSizes = html`<div style="${stack} ${slot}">
      ${NPH_PROGRESS_SIZES.map(
        (size) => html`<nph-progress size=${size} value="50" label=${`${v.sampleLabel} · ${size}`} value-text="50%"></nph-progress>`,
      )}
    </div>`;
    const demoStatus = html`<div style="${stack} ${slot}">
      <nph-progress value="50" label=${v.sampleLabel} value-text="50%"></nph-progress>
      <nph-progress status="success" value="100" label=${v.sampleLabel} value-text=${v.doneValue} help=${v.doneHelp}></nph-progress>
      <nph-progress status="error" value="100" label=${v.sampleLabel} value-text=${v.errorValue} help=${v.errorHelp}></nph-progress>
    </div>`;

    return html`
      <div style=${body}>
        ${header('nph-progress', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            {
              label: 'type: determinate',
              cells: [html`<div style=${slot}><nph-progress value="50" aria-label=${v.sampleLabel}></nph-progress></div>`],
            },
            {
              label: 'type: indeterminate',
              cells: [
                html`<div style=${slot}><nph-progress type="indeterminate" aria-label=${v.preparingLabel}></nph-progress></div>`,
              ],
            },
            {
              label: 'type: steps',
              cells: [
                html`<div style=${slot}><nph-progress type="steps" steps="4" step="1" aria-label=${v.signUpLabel}></nph-progress></div>`,
              ],
            },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.types, title: d.typesTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.status, title: d.statusTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-progress'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.types,
          d.typesTitle,
          html`
            ${demo(demoTypes, d.typesCaption)}
            ${table(d.typesUseHeader, d.typesUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${demo(demoSizes, d.sizesCaption)}
            ${table(d.sizesUseHeader, d.sizesUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.status,
          d.statusTitle,
          html`
            ${demo(demoStatus, d.statusCaption)}
            ${table(
              d.statusUseHeader,
              d.statusUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const),
              'code',
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.relations,
          d.relationsTitle,
          html`${list(d.relations)} ${source(d.sourceLabel, d.sourceSpec)}`,
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
            ${demo(bothModes(d, () => examples(v)), d.examplesCaption)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </div>
    `;
  },
};
