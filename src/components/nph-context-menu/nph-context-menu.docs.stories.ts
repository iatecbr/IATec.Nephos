/**
 * Reading page of `nph-context-menu`.
 *
 * It does not prove the contract — that is the role of `Components/nph-context-menu/Validation`
 * and of the tests. The content is transcribed from the documentation accepted in Figma (frame
 * `4838:27591`), from the spec sheet (`ficha`) and from P113; nothing is decided here. The page
 * follows the order of the `nph-badge` page: it opens with the labelled matrix, and the two lists
 * of "When to use" are the ones of the sheet. The three required examples of the documentation
 * close it, each in light and dark mode. Every menu on the page is a real `nph-context-menu`,
 * opened from code at the start top corner of its object, as the documentation shows it.
 *
 * Deferred, not fulfilled here:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `contextMenuDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-context-menu';
import { NPH_CONTEXT_MENU_SIZES } from './nph-context-menu';
import { SUPPLEMENTARY_TEXT_EXCEPTION, bothModes, choiceMenu, fileMenu } from './nph-context-menu.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-context-menu.json';

const meta: Meta = {
  title: 'Components/nph-context-menu/Docs',
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
  opening: 'opening',
  submenu: 'submenu',
  sizes: 'sizes',
  choices: 'choices',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  /* Carries `SUPPLEMENTARY_TEXT_EXCEPTION`: the menus on the page show shortcuts. */
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).contextMenuDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const modes = { light: d.lightCaption, dark: d.darkCaption };

    return html`
      <main style=${body}>
        ${header('nph-context-menu', d.summary)}
        ${matrix(
          d.matrixLabel,
          [`open-submenu: ${d.closedWord}`, `open-submenu: ${d.openWord}`],
          NPH_CONTEXT_MENU_SIZES.map((size) => ({
            label: `size: ${size}`,
            cells: [fileMenu(d, { size }), fileMenu(d, { size, submenu: 'share' })],
          })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.opening, title: d.openingTitle },
          { id: SECTIONS.submenu, title: d.submenuTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.choices, title: d.choicesTitle },
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
          html`
            ${table(d.apiHeader, d.api.map(pair))}
            ${text(d.entryText)}
            ${table(d.entryHeader, d.entry.map(pair))}
            ${source(d.sourceLabel, d.sourceApi)}
          `,
        )}

        ${section(
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-context-menu'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.opening,
          d.openingTitle,
          html`
            ${table(d.openingHeader, d.opening.map(pair), 'text')}
            ${list(d.neverOnlyPath)}
            ${source(d.sourceLabel, d.sourceBehavior)}
          `,
        )}

        ${section(
          SECTIONS.submenu,
          d.submenuTitle,
          html`
            ${text(d.submenuText)}
            ${demo(bothModes(modes, () => fileMenu(d, { submenu: 'share' })), d.submenuCaption)}
            ${source(d.sourceLabel, d.sourceBehavior)}
          `,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(
              html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
                ${NPH_CONTEXT_MENU_SIZES.map((size) => fileMenu(d, { size }))}
              </div>`,
              d.sizesCaption,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.choices,
          d.choicesTitle,
          html`
            ${text(d.choicesText)}
            ${demo(choiceMenu(d), d.choicesCaption)}
            ${source(d.sourceLabel, d.sourceSpec)}
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
            ${demo(bothModes(modes, () => fileMenu(d)), d.exampleClosed)}
            ${demo(bothModes(modes, () => fileMenu(d, { submenu: 'share' })), d.exampleRight)}
            ${demo(bothModes(modes, () => fileMenu(d, { submenu: 'share', size: 'compact', pinned: true })), d.exampleLeft)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
