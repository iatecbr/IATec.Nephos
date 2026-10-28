/**
 * Reading page of `nph-dropdown-menu`.
 *
 * It does not prove the contract — that is the role of `Components/nph-dropdown-menu/Validation`
 * and of the tests. The content is transcribed from the board accepted in Figma (`1365:118`,
 * documentation `2365:3685`), from the spec sheet (`ficha`) and from P92; nothing is decided here.
 * The page follows the order of the `nph-badge` page: it opens with the labelled matrix, and the
 * two lists of "When to use" are the ones of the sheet. The three required examples of the board
 * close it, each in light and dark mode. Every menu on the page is a real `nph-dropdown-menu`,
 * open next to its `nph-button`, as the board shows it.
 *
 * Deferred, not fulfilled here:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35;
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `dropdownMenuDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-dropdown-menu';
import { NPH_DROPDOWN_MENU_SELECTIONS, NPH_DROPDOWN_MENU_SEVERITIES } from './nph-dropdown-menu';
import type { NphDropdownMenuSelection, NphDropdownMenuSeverity } from './nph-dropdown-menu';
import { accountMenu, bothModes, menuWith, optionsMenu, viewMenu } from './nph-dropdown-menu.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-dropdown-menu.json';

const meta: Meta = {
  title: 'Components/nph-dropdown-menu/Docs',
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
  variants: 'variants',
  sizes: 'sizes',
  states: 'states',
  options: 'options',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const row = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).dropdownMenuDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const modes = { light: d.lightCaption, dark: d.darkCaption };
    /** One item of the matrix, in its own open menu. */
    const cell = (severity: NphDropdownMenuSeverity, selection: NphDropdownMenuSelection): TemplateResult => {
      const icon = severity === 'destructive' ? 'trash' : 'pen-to-square';
      const label = severity === 'destructive' ? d.delete : d.rename;
      return menuWith({
        trigger: d.trigger,
        open: true,
        items: [{ value: `${severity}-${selection}`, text: label, icon, severity, selection, checked: selection !== 'none' }],
      });
    };

    return html`
      <main style=${body}>
        ${header('nph-dropdown-menu', d.summary)}
        ${matrix(
          d.matrixLabel,
          NPH_DROPDOWN_MENU_SELECTIONS.map((selection) => `selection: ${selection}`),
          NPH_DROPDOWN_MENU_SEVERITIES.map((severity) => ({
            label: `severity: ${severity}`,
            cells: NPH_DROPDOWN_MENU_SELECTIONS.map((selection) => cell(severity, selection)),
          })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.options, title: d.optionsTitle },
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
          SECTIONS.variants,
          d.variantsTitle,
          html`
            ${text(d.variantsText)}
            ${demo(
              menuWith({
                trigger: d.trigger,
                open: true,
                items: [
                  { value: 'rename', text: d.rename, icon: 'pen-to-square' },
                  { type: 'separator' },
                  { value: 'list', text: d.list, icon: 'list', selection: 'single', checked: true },
                  { value: 'grid', text: d.grid, icon: 'grid-2', selection: 'single' },
                  { type: 'separator' },
                  { value: 'archived', text: d.archived, selection: 'multiple', checked: true },
                  { type: 'separator' },
                  { value: 'delete', text: d.delete, icon: 'trash', severity: 'destructive' },
                ],
              }),
              d.variantsCaption,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(
              html`<div style=${row}>
                ${(['default', 'compact'] as const).map((size) =>
                  menuWith({
                    trigger: `size: ${size}`,
                    open: true,
                    size,
                    items: [
                      { value: 'rename', text: d.rename, icon: 'pen-to-square' },
                      { value: 'duplicate', text: d.duplicate, icon: 'share-from-square' },
                    ],
                  }),
                )}
              </div>`,
              d.sizesCaption,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(pair))}
            ${demo(
              menuWith({
                trigger: d.trigger,
                open: true,
                items: [
                  { value: 'rename', text: d.rename, icon: 'pen-to-square' },
                  { value: 'print', text: d.print, icon: 'print', disabled: true },
                  { value: 'export', text: d.export, icon: 'download', loading: true },
                ],
              }),
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.options,
          d.optionsTitle,
          html`
            ${text(d.optionsText)}
            ${demo(
              menuWith({
                trigger: d.trigger,
                open: true,
                items: [
                  { value: 'duplicate', text: d.duplicate, icon: 'share-from-square', shortcut: d.shortcutDuplicate },
                  { value: 'export', text: d.export, icon: 'download', description: d.exportDescription },
                  { value: 'unread', text: d.unread, icon: 'paper-plane', count: 12 },
                  { value: 'share', text: d.share, icon: 'share', tag: d.newTag },
                  { value: 'sync', text: d.sync, icon: 'rotate-right', switch: true, checked: true },
                  { value: 'move', text: d.move, icon: 'arrow-up-from-bracket', submenu: true },
                  { value: 'assign', text: d.assign, avatar: '' },
                ],
              }),
              d.optionsCaption,
            )}
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
            ${demo(bothModes(modes, () => accountMenu(d)), d.exampleAccount)}
            ${demo(bothModes(modes, () => viewMenu(d)), d.exampleView)}
            ${demo(bothModes(modes, () => optionsMenu(d)), d.exampleOptions)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
