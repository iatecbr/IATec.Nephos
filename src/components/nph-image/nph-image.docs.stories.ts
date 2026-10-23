/**
 * Reading page of `nph-image`.
 *
 * It does not prove the contract — that is the role of `Components/nph-image/Validation` and
 * of the tests. The content is transcribed from the frame accepted in Figma (`2677:465`),
 * from the spec sheet (`ficha`) and from P90; nothing is decided here. The page follows the
 * order of the `nph-avatar` page: it opens with the labelled matrix, and the two lists of
 * "When to use" are the ones of the sheet. The three required examples of the frame close
 * it, each in light and dark mode.
 *
 * Deferred, not fulfilled here:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35;
 * - the "When to use" lists still come from the dictionary, and a test checks that they equal the
 *   sheet's; reading them from the Metadata is P71, in DSA-34;
 * - the empty and error illustrations: the frame draws them once the files arrive (D1 of
 *   DSA-51); until then the two states show the frame only, and the page says so.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `imageDocs`
 * key. The story is SINGLE: it reads `globals.locale` and looks up the translation.
 * Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-image';
import { NPH_IMAGE_RATIOS, NPH_IMAGE_SIZES } from './nph-image';
import { BROKEN_IMAGE, IMAGE_A, IMAGE_WIDE, cardCover, inScheme, listItem, stalled, uploadEmpty } from './nph-image.demo';
import type { Scheme } from './nph-image.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-image/Docs',
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
  sizes: 'sizes',
  states: 'states',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-image-gap);';
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';

/** The same example in light and in dark mode, side by side. */
function bothModes(d: Record<string, unknown>, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', d.lightCaption as string],
    ['dark', d.darkCaption as string],
  ];
  return html`<div style=${modes}>${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}</div>`;
}

const SQUARE_SIZES = NPH_IMAGE_SIZES.filter((size) => size !== 'media');

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).imageDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;

    return html`
      <main style=${body}>
        ${header('nph-image', d.summary)}
        ${matrix(d.matrixLabel, ['empty', 'loading', 'loaded', 'error'], [
          {
            label: 'size: lg',
            cells: [
              html`<nph-image size="lg"></nph-image>`,
              stalled('lg'),
              html`<nph-image size="lg" src=${IMAGE_A}></nph-image>`,
              html`<nph-image size="lg" src=${BROKEN_IMAGE}></nph-image>`,
            ],
          },
        ])}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
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
            ${useDontUse({ title: d.whenToUseTitle, items: d.whenToUse }, { title: d.whenNotToUseTitle, items: d.whenNotToUse })}
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
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(
              html`<div style=${row}>${SQUARE_SIZES.map((size) => html`<nph-image size=${size} src=${IMAGE_A}></nph-image>`)}</div>`,
              d.sizesCaption,
            )}
            ${demo(
              html`<div style=${row}>
                ${NPH_IMAGE_RATIOS.map((ratio) => html`<nph-image size="media" ratio=${ratio} src=${IMAGE_WIDE}></nph-image>`)}
              </div>`,
              d.ratiosCaption,
            )}
            ${table(d.sizesHeader, d.sizes.map(pair))} ${source(d.sourceLabel, d.sourceSizes)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${text(d.statesText)}
            ${demo(
              html`<div style=${row}>
                <nph-image size="xl"></nph-image>
                ${stalled('xl')}
                <nph-image size="xl" src=${IMAGE_A}></nph-image>
                <nph-image size="xl" src=${BROKEN_IMAGE}></nph-image>
              </div>`,
              d.statesCaption,
            )}
            ${demo(
              html`<div style=${row}>
                <nph-image size="xl" src=${IMAGE_A} alt=${d.productMug} interactive></nph-image>
                <nph-image size="xl" src=${IMAGE_A} alt=${d.productMug} interactive disabled></nph-image>
              </div>`,
              d.interactionCaption,
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
            ${demo(bothModes(d, () => listItem(d.productMug, d.productDetail)), d.exampleList)}
            ${demo(bothModes(d, () => cardCover(d.coverAlt, d.coverTitle)), d.exampleCover)}
            ${demo(bothModes(d, () => uploadEmpty(d.uploadTitle, d.uploadHint)), d.exampleUpload)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
