/**
 * Reading page of `nph-toggle-group`.
 *
 * It does not prove the contract — that is the role of `Components/nph-toggle-group/Validation` and
 * of the tests. The content is transcribed from the frame accepted in Figma (`1580:61`), from
 * the spec sheet (`ficha`) and from P76; nothing is decided here. The page follows the order of
 * the `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use" are
 * the ones of the sheet. The three required examples of the frame close it, each in light and dark
 * mode.
 *
 * Deferred, not fulfilled here:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `toggleGroupDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-toggle-group';
import { alignment, formatting, group, inScheme, view } from './nph-toggle-group.demo';
import type { Scheme } from './nph-toggle-group.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-toggle-group.json';

const meta: Meta = {
  title: 'Components/nph-toggle-group/Docs',
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
  selection: 'selection',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
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
    const d = translations(localeOf(context)).toggleGroupDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const alignmentText = { ...d, group: d.alignmentGroup };
    const formattingText = { ...d, group: d.formattingGroup };
    const viewText = { ...d, group: d.viewGroup };
    const pieces = (count: 2 | 3, withText: boolean): TemplateResult =>
      group({
        label: d.viewGroup,
        value: ['list'],
        items: (withText
          ? [
              { value: 'list', text: d.list },
              { value: 'grid', text: d.grid },
              { value: 'table', text: d.table },
            ]
          : [
              { value: 'list', label: d.list, icon: 'list' },
              { value: 'grid', label: d.grid, icon: 'grid-2' },
              { value: 'table', label: d.table, icon: 'filter' },
            ]
        ).slice(0, count),
      });

    return html`
      <main style=${body}>
        ${header('nph-toggle-group', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['text: yes', 'text: no'],
          [
            { label: 'buttons: 2', cells: [pieces(2, true), pieces(2, false)] },
            { label: 'buttons: 3', cells: [pieces(3, true), pieces(3, false)] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.selection, title: d.selectionTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-toggle-group'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.selection,
          d.selectionTitle,
          html`
            ${text(d.selectionText)}
            ${demo(
              html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
                ${alignment(alignmentText, [])} ${alignment(alignmentText, ['center'])} ${formatting(formattingText, [])}
                ${formatting(formattingText, ['bold', 'italic'])}
              </div>`,
              d.selectionCaption,
            )}
            ${table(d.selectionHeader, d.selectionRules.map(pair))} ${source(d.sourceLabel, d.sourceSelection)}
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
            ${demo(bothModes(d, () => alignment(alignmentText)), d.exampleAlignment)}
            ${demo(bothModes(d, () => formatting(formattingText)), d.exampleFormatting)}
            ${demo(bothModes(d, () => view(viewText)), d.exampleView)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
