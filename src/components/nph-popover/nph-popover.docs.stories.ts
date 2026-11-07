/**
 * Reading page of `nph-popover`.
 *
 * It does not prove the contract — that is the role of `Components/nph-popover/Validation` and
 * of the tests. The content is transcribed from the documentation frame accepted in Figma
 * (`4749:5857`), from the spec sheet (`ficha`) and from P111; nothing is decided here. The page
 * follows the order of the `nph-badge` page: it opens with the labelled matrix of the sizes and
 * the two "When to use" lists are the ones of the sheet, read from its Metadata (P71). Usage shows
 * the markup of the trigger and the popover.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `popoverDocs`
 * key; the sample texts come from `popoverValidation`. The story is SINGLE: it reads
 * `globals.locale` and looks up the translation. Technical identifiers appear literally and are
 * the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import { NPH_POPOVER_ALIGNMENTS, NPH_POPOVER_SIDES, NPH_POPOVER_SIZES } from './nph-popover';
import { bothModes, cell, examples, placement, sized, texts } from './nph-popover.demo';
import type { ExampleTexts } from './nph-popover.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-popover.json';

const meta: Meta = {
  title: 'Components/nph-popover/Docs',
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
  placement: 'placement',
  arrow: 'arrow',
  sizes: 'sizes',
  parts: 'parts',
  closing: 'closing',
  relations: 'relations',
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
    const d = translations(locale).popoverDocs;
    const v = translations(locale).popoverValidation as ExampleTexts & Record<string, unknown>;
    const base = texts(v);
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const row = ({ value, label }: { value: string; label: string }) => [value, label] as const;
    const demoPlacement = html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
      ${NPH_POPOVER_SIDES.map((side) => placement(v, side, 'center'))}
    </div>`;
    const demoArrow = html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
      ${NPH_POPOVER_ALIGNMENTS.map((align) => placement(v, 'bottom', align))}
    </div>`;
    const demoParts = html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
      ${cell({ ...base, description: false })} ${cell({ ...base, body: true, closable: true, footer: true })}
    </div>`;

    return html`
      <div style=${body}>
        ${header('nph-popover', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          NPH_POPOVER_SIZES.map((size) => ({ label: `size: ${size}`, cells: [sized(v, size)] })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.placement, title: d.placementTitle },
          { id: SECTIONS.arrow, title: d.arrowTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.parts, title: d.partsTitle },
          { id: SECTIONS.closing, title: d.closingTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-popover'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.placement,
          d.placementTitle,
          html`
            ${demo(demoPlacement, d.placementCaption)}
            ${table(d.placementUseHeader, d.placementUse.map(row), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.arrow,
          d.arrowTitle,
          html`
            ${demo(demoArrow, d.arrowCaption)}
            ${list(d.arrow)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${demo(
              html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
                ${NPH_POPOVER_SIZES.map((size) => sized(v, size))}
              </div>`,
              d.sizesCaption,
            )}
            ${table(d.sizesUseHeader, d.sizesUse.map(row), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.parts,
          d.partsTitle,
          html`
            ${demo(demoParts, d.partsCaption)}
            ${list(d.parts)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.closing, d.closingTitle, html`${list(d.closing)} ${source(d.sourceLabel, d.sourceSpec)}`)}

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
            ${demo(
              bothModes({ light: d.lightCaption as string, dark: d.darkCaption as string }, (): TemplateResult => examples(v)),
              d.examplesCaption,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </div>
    `;
  },
};
