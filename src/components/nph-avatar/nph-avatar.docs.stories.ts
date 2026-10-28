/**
 * Reading page of `nph-avatar`.
 *
 * It does not prove the contract — that is the role of `Components/nph-avatar/Validation` and
 * of the tests. The content is transcribed from the frame accepted in Figma (`1434:30`), from
 * the spec sheet (`ficha`) and from P74; nothing is decided here. The page follows the order of
 * the `nph-togglebutton` page: it opens with the labelled matrix, and the two lists of "When to
 * use" are the ones of the sheet. The three required examples of the frame close it, each in
 * light and dark mode.
 *
 * Deferred, not fulfilled here:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35, which also gives
 *   `package.json` the `exports` for the import line.
 *
 * Default inversion, said on the page: the Figma `tipo` defaults to `foto`; in code there is no
 * `tipo`, it derives from `src`, so `<nph-avatar>` with no attribute draws `sem foto`.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `avatarDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-avatar';
import { BROKEN_PHOTO, PHOTO_A, cardHeader, inScheme, ownerSelect, profileWithoutPhoto } from './nph-avatar.demo';
import type { Scheme } from './nph-avatar.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-avatar.json';

const meta: Meta = {
  title: 'Components/nph-avatar/Docs',
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
  fallback: 'fallback',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';

/** The same example in light and in dark mode, side by side. */
function bothModes(d: Record<string, unknown>, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', d.lightCaption as string],
    ['dark', d.darkCaption as string],
  ];
  return html`<div style=${modes}>${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}</div>`;
}

const SIZES = ['sm', 'md', 'lg'] as const;

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).avatarDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const perSize = (src?: string): TemplateResult[] =>
      SIZES.map((size) =>
        src === undefined ? html`<nph-avatar size=${size}></nph-avatar>` : html`<nph-avatar size=${size} src=${src}></nph-avatar>`,
      );

    return html`
      <main style=${body}>
        ${header('nph-avatar', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['size: sm', 'size: md', 'size: lg'],
          [
            { label: 'src', cells: perSize(PHOTO_A) },
            { label: 'no src', cells: perSize() },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.fallback, title: d.fallbackTitle },
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
          SECTIONS.fallback,
          d.fallbackTitle,
          html`
            ${text(d.fallbackText)}
            ${demo(
              html`<div style=${row}>
                <nph-avatar size="lg" src=${PHOTO_A}></nph-avatar>
                <nph-avatar size="lg"></nph-avatar>
                <nph-avatar size="lg" src=${BROKEN_PHOTO}></nph-avatar>
              </div>`,
              d.fallbackCaption,
            )}
            ${table(d.fallbackHeader, d.fallback.map(pair), 'text')} ${source(d.sourceLabel, d.sourceFallback)}
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
            ${demo(bothModes(d, () => ownerSelect(d.personAna)), d.exampleOwner)}
            ${demo(bothModes(d, () => cardHeader(d.personBruno, d.roleDesign)), d.exampleCard)}
            ${demo(bothModes(d, () => profileWithoutPhoto(d.personCarla, d.roleEngineer)), d.exampleProfile)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
