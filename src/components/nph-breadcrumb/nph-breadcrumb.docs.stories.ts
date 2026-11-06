/**
 * Reading page of `nph-breadcrumb`.
 *
 * It does not prove the contract — that is the role of `Components/nph-breadcrumb/Validation` and
 * of the tests. The content is transcribed from the documentation frame accepted in Figma
 * (`4512:4741`), from the spec sheet (`ficha`) and from P109; nothing is decided here. The page
 * follows the order of the `nph-badge` page: it opens with the labelled matrix of the levels and
 * the two "When to use" lists are the ones of the sheet, read from its Metadata (P71). Usage shows
 * the markup of the trail and the property that carries the path.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `breadcrumbDocs`
 * key; the sample texts of the trails come from `breadcrumbValidation`. The story is SINGLE: it
 * reads `globals.locale` and looks up the translation. Technical identifiers appear literally and
 * are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import '../nph-skeleton/nph-skeleton';
import './nph-breadcrumb';
import { bothModes, collapsedTrail, examples, trail } from './nph-breadcrumb.demo';
import type { ExampleTexts } from './nph-breadcrumb.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-breadcrumb.json';

const meta: Meta = {
  title: 'Components/nph-breadcrumb/Docs',
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
  levels: 'levels',
  icons: 'icons',
  hiddenLevels: 'hidden-levels',
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
    const d = translations(locale).breadcrumbDocs;
    const v = translations(locale).breadcrumbValidation as ExampleTexts & Record<string, unknown>;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const demoLevels = html`<div style=${stack}>
      ${trail(v, 2)} ${trail(v, 3)} ${trail(v, 4)} ${collapsedTrail(v)}
    </div>`;
    const demoIcons = html`<div style=${stack}>${trail(v, 4)} ${trail(v, 4, true)}</div>`;
    const demoHidden = collapsedTrail(v, { open: true });
    const demoLoading = html`<div style=${stack}>
      <div aria-busy="true" style="inline-size: calc(var(--nph-layout-field-width) / 2); max-inline-size: 100%;">
        <nph-skeleton shape="line"></nph-skeleton>
      </div>
      ${trail(v, 3)}
    </div>`;

    return html`
      <div style=${body}>
        ${header('nph-breadcrumb', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: 'levels: 2', cells: [trail(v, 2)] },
            { label: 'levels: 3', cells: [trail(v, 3)] },
            { label: 'levels: 4', cells: [trail(v, 4)] },
            { label: 'levels: collapsed', cells: [collapsedTrail(v)] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.levels, title: d.levelsTitle },
          { id: SECTIONS.icons, title: d.iconsTitle },
          { id: SECTIONS.hiddenLevels, title: d.hiddenLevelsTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-breadcrumb'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.levels,
          d.levelsTitle,
          html`
            ${demo(demoLevels, d.levelsCaption)}
            ${table(d.levelsUseHeader, d.levelsUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.icons,
          d.iconsTitle,
          html`
            ${demo(demoIcons, d.iconsCaption)}
            ${table(d.iconsUseHeader, d.iconsUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.hiddenLevels,
          d.hiddenLevelsTitle,
          html`
            ${demo(demoHidden, d.hiddenLevelsCaption)}
            ${list(d.hiddenLevels)}
            ${demo(demoLoading, d.loadingCaption)}
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
