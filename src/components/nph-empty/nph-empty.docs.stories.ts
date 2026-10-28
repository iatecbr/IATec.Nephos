/**
 * Reading page of `nph-empty`.
 *
 * It does not prove the contract — that is the role of `Components/nph-empty/Validation` and of
 * the tests. The content is transcribed from the board accepted in Figma (`1463:25260`, frame
 * `2003:688`), from the spec sheet (`ficha`) and from P84; nothing is decided here. The page follows
 * the order of the `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to
 * use" are the ones of the sheet. The three required examples of the board close it, each in light and
 * dark mode. The `nph-combobox` example is a frame until DSA-46 brings the piece.
 *
 * Deferred, not fulfilled here:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `emptyDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical identifiers
 * appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import { bothModes, comboboxList, empty } from './nph-empty.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-empty.json';

const meta: Meta = {
  title: 'Components/nph-empty/Docs',
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
  relations: 'relations-and-context',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'required-examples',
  references: 'references',
} as const;

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).emptyDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const modes = (content: () => TemplateResult): TemplateResult =>
      bothModes({ light: d.lightCaption as string, dark: d.darkCaption as string }, content);
    const withDescription = (): TemplateResult => empty({ heading: d.heading, description: d.description });
    const headingOnly = (): TemplateResult => empty({ heading: d.areaHeading });
    const inList = (): TemplateResult => comboboxList(withDescription(), d.listLabel);

    return html`
      <main style=${body}>
        ${header('nph-empty', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: d.withDescriptionLabel, cells: [withDescription()] },
            { label: d.headingOnlyLabel, cells: [headingOnly()] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
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
            ${text(d.purpose)}
            ${sheetUseDontUse(metadata, localeOf(context), d)}
            ${source(d.sourceLabel, d.sourceBoard)}
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-empty'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.relations,
          d.relationsTitle,
          html`
            ${list(d.relations)}
            ${demo(inList(), d.relationsCaption)}
            ${source(d.sourceLabel, d.sourceBoard)}
          `,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`
            ${table(d.anatomyHeader, d.anatomy.map(pair), 'text')}
            ${table(d.schemeHeader, d.scheme.map(pair), 'text')}
            ${source(d.sourceLabel, d.sourceBoard)}
          `,
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
            ${demo(modes(inList), d.exampleCombobox)}
            ${demo(modes(withDescription), d.exampleDescription)}
            ${demo(modes(headingOnly), d.exampleHeadingOnly)}
            ${source(d.sourceLabel, d.sourceBoard)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
