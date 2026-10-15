/**
 * Reading page of `nph-skeleton`.
 *
 * It does not prove the contract — that is the role of `Components/nph-skeleton/Validation` and of
 * the tests. The content is transcribed from the frame accepted in Figma (`1578:38`), from the
 * spec sheet (`ficha`) and from P69; nothing is decided here. The page follows the order of
 * the `nph-badge` page: it opens with the labelled matrix of the five shapes, and the two lists of
 * "When to use" are the ones of the sheet.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `skeletonDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the translation.
 * Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-skeleton';
import { NPH_SKELETON_SHAPES } from './nph-skeleton';
import { cardLoading, inScheme, paragraphLoading, peopleList } from './nph-skeleton.demo';
import type { Scheme } from './nph-skeleton.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-skeleton/Docs',
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
  shapes: 'shapes',
  relations: 'relations',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const slot = 'inline-size: var(--nph-layout-field-width);';
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
    const d = translations(localeOf(context)).skeletonDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;

    return html`
      <div style=${body}>
        ${header('nph-skeleton', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          NPH_SKELETON_SHAPES.map((shape) => ({
            label: `shape: ${shape}`,
            cells: [
              html`<div style=${slot}>
                <nph-skeleton shape=${shape} style=${shape === 'block' ? 'aspect-ratio: 16 / 9;' : ''}></nph-skeleton>
              </div>`,
            ],
          })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.shapes, title: d.shapesTitle },
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
            ${useDontUse({ title: d.whenToUseTitle, items: d.whenToUse }, { title: d.whenNotToUseTitle, items: d.whenNotToUse })}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(pair))} ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.shapes,
          d.shapesTitle,
          html`
            ${demo(
              html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline); ${slot}">
                ${NPH_SKELETON_SHAPES.map(
                  (shape) =>
                    html`<nph-skeleton shape=${shape} style=${shape === 'block' ? 'aspect-ratio: 16 / 9;' : ''}></nph-skeleton>`,
                )}
              </div>`,
              d.shapesCaption,
            )}
            ${table(d.shapesUseHeader, d.shapesUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
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
            ${demo(bothModes(d, peopleList), d.examplePeople)}
            ${demo(bothModes(d, cardLoading), d.exampleCard)}
            ${demo(bothModes(d, paragraphLoading), d.exampleParagraph)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </div>
    `;
  },
};
