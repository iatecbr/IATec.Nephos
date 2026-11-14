/**
 * Reading page of `nph-command`.
 *
 * It does not prove the contract — that is the role of `Components/nph-command/Validation` and of
 * the tests. The content is transcribed from the documentation accepted in Figma (frame `6076:4910`,
 * set `6068:3936`), from the spec sheet (`ficha`) and from P123; nothing is decided here. The page
 * follows the order of the `nph-badge` page: it opens with the labelled matrix, and the two lists of
 * "When to use" are the ones of the sheet. The three required examples of the documentation close it,
 * each in light and dark mode.
 *
 * Every palette on this page is the real component, open, in a window of its own: a modal dialog
 * covers the window it opens in, so each one is embedded in an `<iframe>` of the hidden
 * `Components/nph-command/Fixtures` story (`nph-command.demo.ts`, P123). The matrix follows the mode
 * of the Storybook selector; the examples show both.
 *
 * Deferred, not fulfilled here:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `commandDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical identifiers
 * appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { localeOf } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { bothModes, framed } from './nph-command.demo';
import type { Example, Scheme } from './nph-command.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-command.json';

const meta: Meta = {
  title: 'Components/nph-command/Docs',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

/** Section ids: technical identifiers, the same in any language. */
const SECTIONS = {
  whenToUse: 'when-to-use',
  api: 'api',
  usage: 'usage',
  states: 'content-and-states',
  footer: 'footer-of-hints',
  keys: 'keys-and-closing',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'required-examples',
  references: 'references',
} as const;

/** The contents of the Figma set (`conteudo`), the rows of the matrix. */
const CONTENTS: readonly Example[] = ['results', 'groups', 'search', 'empty', 'loading'];

function schemeOf(context: GlobalsContext | undefined): Scheme {
  return context?.globals?.colorScheme === 'dark' ? 'dark' : 'light';
}

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const scheme = schemeOf(context);
    const d = translations(locale).commandDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption as string, dark: d.darkCaption as string };
    const row = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack); justify-content: center;';

    return html`
      <main style=${body}>
        ${header('nph-command', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['footer: on', 'footer: off'],
          CONTENTS.map((content) => ({
            label: `content: ${content}`,
            cells: (['on', 'off'] as const).map((footer) => framed(content, scheme, locale, d.frameTitle, '', { footer })),
          })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.footer, title: d.footerTitle },
          { id: SECTIONS.keys, title: d.keysTitle },
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
            ${sheetUseDontUse(metadata, locale, d)}
            ${source(d.sourceLabel, d.sourceFigma)}
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-command'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(pair), 'text')}
            ${demo(
              html`<div style=${row}>
                ${framed('disabled', scheme, locale, d.frameTitle, 'state: disabled', {})}
                ${framed('destructive', scheme, locale, d.frameTitle, 'type: destructive', {})}
              </div>`,
              `${d.disabledCaption} ${d.destructiveCaption}`,
            )}
            ${source(d.sourceLabel, d.sourceFigma)}
          `,
        )}

        ${section(
          SECTIONS.footer,
          d.footerTitle,
          html`
            ${text(d.footerText)}
            ${demo(
              html`<div style=${row}>
                ${framed('results', scheme, locale, d.frameTitle, 'footer: on', { footer: 'on' })}
                ${framed('results', scheme, locale, d.frameTitle, 'footer: off', { footer: 'off' })}
              </div>`,
              d.footerCaption,
            )}
            ${source(d.sourceLabel, d.sourceFigma)}
          `,
        )}

        ${section(
          SECTIONS.keys,
          d.keysTitle,
          html`${table(d.keysHeader, d.keys.map(pair), 'text')} ${source(d.sourceLabel, d.sourceFigma)}`,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceFigma)}`,
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
            ${demo(bothModes('groups', locale, d.frameTitle, captions), d.exampleOpenByKey)}
            ${demo(bothModes('search', locale, d.frameTitle, captions), d.exampleSearch)}
            ${demo(bothModes('empty', locale, d.frameTitle, captions), d.exampleNothingFound)}
            ${source(d.sourceLabel, d.sourceFigma)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
