/**
 * Reading page of `nph-date-picker`.
 *
 * It does not prove the contract — that is the role of `Components/nph-date-picker/Validation` and of the tests. The content is
 * transcribed from the documentation accepted in Figma (frame `6673:62837`), from the spec sheets (`fichas/nph-date-picker.md` and
 * `fichas/nph-calendar.md`) and from P133; nothing is decided here. The page follows the order of the `nph-badge` page: it opens with
 * the labelled matrix, and the two lists of "When to use" are the ones of the sheet. The three required examples of the frame close it,
 * each in light and dark mode. The date grid `nph-calendar` has no reading page of its own: this page shows it at work, and its contract
 * is in its sheet.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `datePickerDocs` key; the texts of the pickers shown come
 * from `datePickerValidation`. The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical identifiers appear
 * literally and are the same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-date-picker';
import { bothModes, opened, picker, typedWrong } from './nph-date-picker.demo';
import type { DatePickerText } from './nph-date-picker.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-date-picker.json';

const meta: Meta = {
  title: 'Components/nph-date-picker/Docs',
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
  modes: 'modes',
  panel: 'panel',
  typing: 'typing',
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
    const d = translations(locale).datePickerDocs;
    const v = translations(locale).datePickerValidation as DatePickerText;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption as string, dark: d.darkCaption as string };

    return html`
      <main style=${body}>
        ${header('nph-date-picker', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: 'mode: single', cells: [picker(v, { value: '2026-10-20' })] },
            { label: 'mode: range', cells: [picker(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21' })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.modes, title: d.modesTitle },
          { id: SECTIONS.panel, title: d.panelTitle },
          { id: SECTIONS.typing, title: d.typingTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-date-picker'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.modes,
          d.modesTitle,
          html`
            ${text(d.modesText)}
            ${demo(
              html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
                ${picker(v, { value: '2026-10-20' })} ${picker(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21' })}
              </div>`,
              d.modesCaption,
            )}
            ${table(d.modesHeader, d.modes.map(pair), 'text')} ${source(d.sourceLabel, d.sourceModes)}
          `,
        )}

        ${section(
          SECTIONS.panel,
          d.panelTitle,
          html`
            ${text(d.panelText)}
            ${demo(opened(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21' }), d.panelCaption)}
            ${table(d.panelHeader, d.panel.map(pair), 'text')} ${source(d.sourceLabel, d.sourcePanel)}
          `,
        )}

        ${section(
          SECTIONS.typing,
          d.typingTitle,
          html`${text(d.typingText)} ${table(d.typingHeader, d.typing.map(pair), 'text')} ${source(d.sourceLabel, d.sourceTyping)}`,
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
            ${demo(bothModes(captions, () => picker(v, { value: '2026-10-14' })), v.exampleDue)}
            ${demo(bothModes(captions, () => opened(v, { mode: 'range', start: '2026-10-02', end: '2026-10-05' })), v.exampleReport)}
            ${demo(bothModes(captions, () => typedWrong(v)), v.exampleInvalid)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
