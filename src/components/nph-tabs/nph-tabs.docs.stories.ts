/**
 * Reading page of `nph-tabs`.
 *
 * It does not prove the contract — that is the role of `Components/nph-tabs/Validation` and of the
 * tests. The content is transcribed from the documentation frame accepted in Figma (`3483:11200`),
 * from the spec sheet (`ficha`) and from P115; nothing is decided here. The page follows the order
 * of the `nph-badge` page: it opens with the labelled matrix of the styles and the two "When to use"
 * lists are the ones of the sheet, read from its Metadata (P71). Usage shows the markup of the list
 * and the property that carries the tabs.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `tabsDocs` key; the
 * sample texts of the lists come from `tabsValidation`. The story is SINGLE: it reads
 * `globals.locale` and looks up the translation. Technical identifiers appear literally and are the
 * same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-tabs';
import { NPH_TABS_VARIANTS } from './nph-tabs';
import { bothModes, examples, list, longTabs, sectionTabs } from './nph-tabs.demo';
import type { ExampleTexts } from './nph-tabs.demo';
import { body, demo, header, index, list as bullets, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-tabs.json';

const meta: Meta = {
  title: 'Components/nph-tabs/Docs',
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
  variants: 'variants',
  content: 'content',
  scrolling: 'scrolling',
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
    const d = translations(locale).tabsDocs;
    const v = translations(locale).tabsValidation as unknown as ExampleTexts & Record<string, unknown>;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const demoVariants = html`<div style=${stack}>${NPH_TABS_VARIANTS.map((variant) => list(v, { variant }))}</div>`;
    const demoContent = html`<div style=${stack}>
      ${list(v, { variant: 'underline' })} ${list(v, { variant: 'underline', icons: true })}
      ${list(v, { variant: 'underline', icons: true, counters: true })}
      ${list(v, { variant: 'underline', icons: true, counters: true, tag: true })}
    </div>`;
    const demoScroll = html`<div style=${stack}>
      ${list(v, { variant: 'underline', tabs: sectionTabs(v), value: 'section-2', width: 'calc(var(--nph-layout-field-width) * 1.25)' })}
      ${list(v, { variant: 'segmented', tabs: longTabs(v), value: 'long-1', width: 'var(--nph-layout-field-width)' })}
    </div>`;

    return html`
      <div style=${body}>
        ${header('nph-tabs', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          NPH_TABS_VARIANTS.map((variant) => ({ label: `variant: ${variant}`, cells: [list(v, { variant })] })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
          { id: SECTIONS.content, title: d.contentTitle },
          { id: SECTIONS.scrolling, title: d.scrollingTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-tabs'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.variants,
          d.variantsTitle,
          html`
            ${demo(demoVariants, d.variantsCaption)}
            ${table(d.variantsUseHeader, d.variantsUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.content,
          d.contentTitle,
          html`
            ${demo(demoContent, d.contentCaption)}
            ${table(d.contentUseHeader, d.contentUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.scrolling,
          d.scrollingTitle,
          html`
            ${demo(demoScroll, d.scrollingCaption)}
            ${bullets(d.scrolling)}
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
