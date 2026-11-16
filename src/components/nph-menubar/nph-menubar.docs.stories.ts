/**
 * Reading page of `nph-menubar`.
 *
 * It does not prove the contract — that is the role of `Components/nph-menubar/Validation` and of the
 * tests. The content is transcribed from the documentation accepted in Figma (frame `6432:8686`), from
 * the spec sheet (`ficha`) and from P126; nothing is decided here. The page follows the order of the
 * `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use" are the ones
 * of the sheet. The four required examples of the documentation close it, each in light and in dark mode.
 * Every bar on the page is a real `nph-menubar`, with its panel opened from code below its top item, as
 * the documentation shows it. The Do and Do not of the documentation, with their error examples as
 * text, sit in the section "Do and do not" of the component itself, since the page has one "When to use".
 *
 * Deferred, not fulfilled here:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `menubarDocs` key. The
 * story is SINGLE: it reads `globals.locale` and looks up the translation. Technical identifiers appear
 * literally and are the same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-menubar';
import {
  SUPPLEMENTARY_TEXT_EXCEPTION,
  barWith,
  bothModes,
  closedBar,
  editorMenus,
  fileExample,
  narrowBar,
  overflowBar,
  recentExample,
  statesExample,
  topItemsBar,
  viewExample,
} from './nph-menubar.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-menubar.json';

const meta: Meta = {
  title: 'Components/nph-menubar/Docs',
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
  states: 'states',
  panel: 'panel',
  overflow: 'overflow',
  keyboard: 'keyboard',
  practices: 'practices',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  /* Carries `SUPPLEMENTARY_TEXT_EXCEPTION`: the bars on the page show panels with shortcuts. */
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).menubarDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const modes = { light: d.lightCaption, dark: d.darkCaption };
    const row = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';

    return html`
      <main style=${body}>
        ${header('nph-menubar', d.summary)}
        ${matrix(d.matrixLabel, [], [
          { label: `open-menu: ${d.closedWord}`, cells: [closedBar(d)] },
          { label: `open-menu: ${d.openWord}`, cells: [fileExample(d)] },
          { label: 'disabled: true', cells: [barWith(d, { menus: editorMenus(d, { disabledHelp: true }) })] },
          { label: 'narrow: true', cells: [narrowBar(d)] },
        ])}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.panel, title: d.panelTitle },
          { id: SECTIONS.overflow, title: d.overflowTitle },
          { id: SECTIONS.keyboard, title: d.keyboardTitle },
          { id: SECTIONS.practices, title: d.practicesTitle },
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
            ${text(d.menuText)}
            ${table(d.menuHeader, d.menu.map(pair))}
            ${text(d.entryText)}
            ${table(d.entryHeader, d.entry.map(pair))}
            ${source(d.sourceLabel, d.sourceApi)}
          `,
        )}

        ${section(
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-menubar'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${text(d.statesText)}
            ${table(d.statesHeader, d.states.map(pair))}
            ${demo(
              html`<div style=${row}>${fileExample(d)}${topItemsBar(d)}</div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.panel,
          d.panelTitle,
          html`
            ${text(d.panelText)}
            ${table(d.panelHeader, d.panel.map(pair), 'text')}
            ${source(d.sourceLabel, d.sourcePanel)}
          `,
        )}

        ${section(
          SECTIONS.overflow,
          d.overflowTitle,
          html`
            ${text(d.overflowText)}
            ${demo(html`<div style=${row}>${overflowBar(d)}${narrowBar(d)}</div>`, d.overflowCaption)}
            ${source(d.sourceLabel, d.sourceOverflow)}
          `,
        )}

        ${section(
          SECTIONS.keyboard,
          d.keyboardTitle,
          html`${table(d.keyboardHeader, d.keyboard.map(pair), 'text')} ${source(d.sourceLabel, d.sourceBehavior)}`,
        )}

        ${section(
          SECTIONS.practices,
          d.practicesTitle,
          html`
            ${table(d.doHeader, d.doRules.map(pair), 'text')}
            ${table(d.dontHeader, d.dontRules.map(pair), 'text')}
            ${source(d.sourceLabel, d.sourcePractices)}
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
            ${demo(bothModes(modes, () => fileExample(d)), d.exampleFile)}
            ${demo(bothModes(modes, () => viewExample(d)), d.exampleView)}
            ${demo(bothModes(modes, () => statesExample(d)), d.exampleStates)}
            ${demo(bothModes(modes, () => recentExample(d)), d.exampleRecent)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
