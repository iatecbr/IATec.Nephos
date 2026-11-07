/**
 * Reading page of `nph-navigation-menu`.
 *
 * It does not prove the contract — that is the role of `Components/nph-navigation-menu/Validation` and
 * of the tests. The content is transcribed from the documentation frame accepted in Figma
 * (`3977:7913`), from the spec sheet (`ficha`) and from P110; nothing is decided here. The page follows
 * the order of the `nph-badge` page: it opens with the labelled matrix of the widths and the two "When
 * to use" lists are the ones of the sheet, read from its Metadata (P71). Usage shows the markup of the
 * bar and the property that carries the items.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `navigationMenuDocs`
 * key; the sample texts of the bars come from `navigationMenuValidation`. The story is SINGLE: it reads
 * `globals.locale` and looks up the translation. Technical identifiers appear literally and are the
 * same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-navigation-menu';
import { bar, bothModes, examples } from './nph-navigation-menu.demo';
import type { ExampleTexts } from './nph-navigation-menu.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-navigation-menu.json';

const meta: Meta = {
  title: 'Components/nph-navigation-menu/Docs',
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
  bar: 'bar',
  panel: 'panel',
  current: 'current',
  narrow: 'narrow',
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
    const d = translations(locale).navigationMenuDocs;
    const v = translations(locale).navigationMenuValidation as unknown as ExampleTexts;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const demoBar = html`<div style=${stack}>${bar(v, { current: 'pricing' })} ${bar(v, { current: 'pricing', disabled: true })}</div>`;
    const demoPanel = bar(v, { open: 'products', rows: 3 });
    const demoCurrent = bar(v, { current: 'components', open: 'products', rows: 3 });
    const demoNarrow = bar(v, { narrow: true, current: 'components', listOpen: true, rows: 9 });

    return html`
      <div style=${body}>
        ${header('nph-navigation-menu', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: 'width: wide · open: no', cells: [bar(v, { current: 'pricing' })] },
            { label: 'width: narrow · open: no', cells: [bar(v, { narrow: true })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.bar, title: d.barTitle },
          { id: SECTIONS.panel, title: d.panelTitle },
          { id: SECTIONS.current, title: d.currentTitle },
          { id: SECTIONS.narrow, title: d.narrowTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-navigation-menu'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.bar,
          d.barTitle,
          html`
            ${demo(demoBar, d.barCaption)}
            ${table(d.barUseHeader, d.barUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.panel,
          d.panelTitle,
          html`
            ${demo(demoPanel, d.panelCaption)}
            ${list(d.panel)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.current,
          d.currentTitle,
          html`
            ${demo(demoCurrent, d.currentCaption)}
            ${list(d.current)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.narrow,
          d.narrowTitle,
          html`
            ${demo(demoNarrow, d.narrowCaption)}
            ${list(d.narrow)}
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
