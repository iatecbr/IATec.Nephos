/**
 * Reading page of `nph-carousel`.
 *
 * It does not prove the contract — that is the role of `Components/nph-carousel/Validation` and of
 * the tests. The content is transcribed from the frame accepted in Figma (`5173:1429`), from the spec
 * sheet (`ficha`) and from P129; nothing is decided here. The page follows the order of the
 * `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use" are the ones
 * of the sheet. The three required examples of the frame close it, each in light and dark mode.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `carouselDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical identifiers
 * appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-carousel';
import { featured, gallery, inScheme, many, sample } from './nph-carousel.demo';
import type { Scheme } from './nph-carousel.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-carousel.json';

const meta: Meta = {
  title: 'Components/nph-carousel/Docs',
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
  layouts: 'layouts',
  controls: 'controls',
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
    const d = translations(localeOf(context)).carouselDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;

    return html`
      <main style=${body}>
        ${header('nph-carousel', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['position: start', 'position: middle', 'position: end'],
          [
            { label: 'layout: single', cells: [0, 1, 3].map((position) => sample(d, { layout: 'single', count: 4, index: position })) },
            { label: 'layout: several', cells: [0, 2, 4].map((position) => sample(d, { layout: 'several', count: 6, index: position })) },
            { label: 'layout: peek', cells: [0, 1, 3].map((position) => sample(d, { layout: 'peek', count: 4, index: position })) },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.layouts, title: d.layoutsTitle },
          { id: SECTIONS.controls, title: d.controlsTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-carousel'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.layouts,
          d.layoutsTitle,
          html`
            ${text(d.layoutsText)}
            ${demo(
              html`<div style=${wrap}>
                ${sample(d, { layout: 'single', count: 4 })} ${sample(d, { layout: 'several', count: 6 })}
                ${sample(d, { layout: 'peek', count: 4 })}
              </div>`,
              d.layoutsCaption,
            )}
            ${table(d.layoutsHeader, d.layoutsList.map(pair), 'code')} ${source(d.sourceLabel, d.sourceLayouts)}
          `,
        )}

        ${section(
          SECTIONS.controls,
          d.controlsTitle,
          html`
            ${text(d.controlsText)}
            ${demo(
              html`<div style=${wrap}>
                ${sample(d, { index: 1 })} ${sample(d, { index: 1, hideArrows: true })}
                ${sample(d, { index: 1, hideIndicators: true, counter: true })}
              </div>`,
              d.controlsCaption,
            )}
            ${source(d.sourceLabel, d.sourceControls)}
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
            ${demo(bothModes(d, () => gallery(d)), d.exampleGallery)}
            ${demo(bothModes(d, () => featured(d, d.featuredLabel)), d.exampleFeatured)}
            ${demo(bothModes(d, () => many(d, d.manyLabel)), d.exampleMany)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
