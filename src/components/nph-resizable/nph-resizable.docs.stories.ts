/**
 * Reading page of `nph-resizable`.
 *
 * It does not prove the contract — that is the role of `Components/nph-resizable/Validation` and of
 * the tests. The content is transcribed from the frame accepted in Figma (`5123:2641`), from the spec
 * sheet (`ficha`) and from P128; nothing is decided here. The page follows the order of the
 * `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use" are the ones
 * of the sheet. The three required examples of the frame close it, each in light and dark mode.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `resizableDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical identifiers
 * appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-resizable';
import { collapsed, collapsedRail, inScheme, limited, listAndReading, nested, sample } from './nph-resizable.demo';
import type { Scheme } from './nph-resizable.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-resizable.json';

const meta: Meta = {
  title: 'Components/nph-resizable/Docs',
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
  handle: 'handle',
  sizes: 'sizes',
  collapse: 'collapse',
  keyboard: 'keyboard',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';
const wrap = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';

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
    const d = translations(localeOf(context)).resizableDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;

    return html`
      <main style=${body}>
        ${header('nph-resizable', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['panels: 2', 'panels: 3'],
          [
            { label: 'direction: horizontal', cells: [sample(d, { count: 2 }), sample(d, { count: 3 })] },
            { label: 'direction: vertical', cells: [sample(d, { direction: 'vertical', count: 2 }), sample(d, { direction: 'vertical', count: 3 })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.handle, title: d.handleTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.collapse, title: d.collapseTitle },
          { id: SECTIONS.keyboard, title: d.keyboardTitle },
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
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-resizable'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.handle,
          d.handleTitle,
          html`
            ${text(d.handleText)}
            ${demo(
              html`<div style=${wrap}>
                ${sample(d)} ${sample(d, { disabled: true })} ${sample(d, { hideCollapseButton: true })}
                ${sample(d, { direction: 'vertical' })} ${sample(d, { direction: 'vertical', disabled: true })}
              </div>`,
              d.handleCaption,
            )}
            ${table(d.handleHeader, d.handleStates.map(pair), 'text')} ${source(d.sourceLabel, d.sourceHandle)}
          `,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(
              html`<div style=${wrap}>
                ${limited(d, [25, 75], '25', '60')} ${limited(d, [60, 40], '25', '60')} ${limited(d, [20, 80], '160px', '320px')}
                ${limited(d, [40, 60], '160px', '320px')}
              </div>`,
              d.sizesCaption,
            )}
            ${source(d.sourceLabel, d.sourceSizes)}
          `,
        )}

        ${section(
          SECTIONS.collapse,
          d.collapseTitle,
          html`
            ${text(d.collapseText)}
            ${demo(html`<div style=${wrap}>${collapsed(d)} ${collapsedRail(d)}</div>`, d.collapseCaption)}
            ${source(d.sourceLabel, d.sourceSizes)}
          `,
        )}

        ${section(
          SECTIONS.keyboard,
          d.keyboardTitle,
          html`${table(d.keyboardHeader, d.keyboard.map(pair), 'text')} ${source(d.sourceLabel, d.sourceKeyboard)}`,
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
            ${demo(bothModes(d, () => listAndReading(d)), d.exampleListReading)}
            ${demo(bothModes(d, () => nested(d)), d.exampleNested)}
            ${demo(bothModes(d, () => collapsed(d)), d.exampleCollapsed)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
