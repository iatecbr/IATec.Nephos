/**
 * Reading page of `nph-sidebar`.
 *
 * It does not prove the contract — that is the role of `Components/nph-sidebar/Validation` and of
 * the tests. The content is transcribed from the documentation accepted in Figma (frame
 * `4633:27036`, sets `4605:9647`, `4605:9612`, `4605:9599`, `4605:9589` and `4605:9594`), from the
 * spec sheet (`fichas/nph-sidebar.md`) and from P116; nothing is decided here. The page follows
 * the order of the `nph-badge` page: it opens with the labelled matrix, and the two lists of
 * "When to use" are the ones of the sheet. Then API, Usage, the three modes, the states, the flyout
 * panel, Anatomy, Accessibility and the four required examples, each in light and dark mode.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The mobile menu is a modal `<dialog>`, so every example draws it closed, with the button of the
 * product that opens it. The text comes from the language dictionary, in `.storybook/i18n/`, under
 * the `sidebarDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import { bothModes, collapsedMenu, expandedFlyout, loadingMenu, mainMenu, phone, sidebar } from './nph-sidebar.demo';
import type { SidebarText } from './nph-sidebar.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-sidebar.json';

const meta: Meta = {
  title: 'Components/nph-sidebar/Docs',
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
  states: 'states',
  flyout: 'flyout-panel',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'required-examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const cell = 'calc(var(--nph-layout-sidebar-expanded) * 1.5)';

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).sidebarDocs;
    const s = d as SidebarText;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption, dark: d.darkCaption };
    /* The mobile menu is a modal dialog: a page never opens it, the person does. */
    const mobileCell = (loading: boolean): TemplateResult => phone(s, { loading });

    return html`
      <main style=${body}>
        ${header('nph-sidebar', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['state: ready', 'state: loading'],
          [
            {
              label: 'mode: expanded',
              cells: [sidebar(s, { height: cell }), sidebar(s, { loading: true, height: cell })],
            },
            {
              label: 'mode: collapsed',
              cells: [sidebar(s, { mode: 'collapsed', height: cell }), sidebar(s, { mode: 'collapsed', loading: true, height: cell })],
            },
            { label: 'mode: mobile', cells: [mobileCell(false), mobileCell(true)] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.modes, title: d.modesTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.flyout, title: d.flyoutTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${text(d.description)}
            ${sheetUseDontUse(metadata, localeOf(context), d)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(pair))}
            ${table(d.itemsHeader, d.items.map(pair))}
            ${note('warning', d.invalidTitle, d.invalidText)}
            ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-sidebar'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.modes,
          d.modesTitle,
          html`
            ${demo(html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">${sidebar(s, { height: cell })} ${sidebar(s, { mode: 'collapsed', height: cell })} ${phone(s)}</div>`, d.modesCaption)}
            ${table(d.modesHeader, d.modes.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${demo(html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">${sidebar(s, { loading: true, height: cell })} ${sidebar(s, { mode: 'collapsed', loading: true, height: cell })}</div>`, d.statesCaption)}
            ${table(d.statesHeader, d.states.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.flyout,
          d.flyoutTitle,
          html`
            ${text(d.flyoutText)}
            ${demo(collapsedMenu(s), d.flyoutCaption)}
            ${table(d.flyoutHeader, d.flyout.map(pair), 'text')}
            ${source(d.sourceLabel, d.sourceFlyout)}
          `,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')}
            ${note('info', d.knownLimitTitle, d.knownLimitText)}
            ${source(d.sourceLabel, d.sourceFrame)}`,
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
            ${demo(bothModes(captions, () => mainMenu(s)), d.exampleMain)}
            ${demo(bothModes(captions, () => loadingMenu(s)), d.exampleLoading)}
            ${demo(bothModes(captions, () => phone(s)), d.examplePhone)}
            ${demo(bothModes(captions, () => collapsedMenu(s)), d.exampleFlyout)}
            ${demo(bothModes(captions, () => expandedFlyout(s)), d.exampleThird)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
