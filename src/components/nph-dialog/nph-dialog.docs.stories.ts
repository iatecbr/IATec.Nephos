/**
 * Reading page of `nph-dialog`.
 *
 * It does not prove the contract — that is the role of `Components/nph-dialog/Validation` and of
 * the tests. The content is transcribed from the board accepted in Figma (`1368:27`, frame
 * `2277:2`), from the spec sheet (`ficha`) and from P87; nothing is decided here. The page follows
 * the order of the `nph-badge` page: it opens with the labelled matrix, and the two lists of "When
 * to use" are the ones of the sheet. The three required examples of the board close it, each in
 * light and dark mode.
 *
 * Every dialog on this page is the real component, open, in a window of its own: a modal dialog
 * covers the window it opens in, so each one is embedded in an `<iframe>` of the hidden
 * `Components/nph-dialog/Fixtures` story (`nph-dialog.demo.ts`, P87). The matrix follows the mode
 * of the Storybook selector; the examples show both.
 *
 * Deferred, not fulfilled here:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `dialogDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical identifiers
 * appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { localeOf } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { NPH_DIALOG_ACTIONS, NPH_DIALOG_SIZES } from './nph-dialog';
import { bothModes, framed } from './nph-dialog.demo';
import type { Scheme } from './nph-dialog.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-dialog.json';

const meta: Meta = {
  title: 'Components/nph-dialog/Docs',
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
  variants: 'variants',
  sizes: 'sizes',
  relations: 'relations-and-context',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'required-examples',
  references: 'references',
} as const;

function schemeOf(context: GlobalsContext | undefined): Scheme {
  return context?.globals?.colorScheme === 'dark' ? 'dark' : 'light';
}

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const scheme = schemeOf(context);
    const d = translations(locale).dialogDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption as string, dark: d.darkCaption as string };
    const row = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack); justify-content: center;';

    return html`
      <main style=${body}>
        ${header('nph-dialog', d.summary)}
        ${matrix(
          d.matrixLabel,
          NPH_DIALOG_ACTIONS.map((actions) => `actions: ${actions}`),
          NPH_DIALOG_SIZES.map((size) => ({
            label: `size: ${size}`,
            cells: NPH_DIALOG_ACTIONS.map((actions) =>
              framed('edit-profile', scheme, locale, d.frameTitle, '', { size, actions }),
            ),
          })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
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
            ${text(d.description)}
            ${sheetUseDontUse(metadata, locale, d)}
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-dialog'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.variants,
          d.variantsTitle,
          html`
            ${text(d.variantsText)}
            ${demo(
              html`<div style=${row}>
                ${NPH_DIALOG_ACTIONS.map((actions) =>
                  framed('edit-profile', scheme, locale, d.frameTitle, `actions: ${actions}`, { size: 'sm', actions }),
                )}
              </div>`,
              d.variantsCaption,
            )}
            ${source(d.sourceLabel, d.sourceBoard)}
          `,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${table(d.sizesHeader, d.sizes.map(pair))}
            ${demo(
              html`<div style=${row}>
                ${NPH_DIALOG_SIZES.map((size) =>
                  framed('import-contacts', scheme, locale, d.frameTitle, `size: ${size}`, { size }),
                )}
              </div>`,
              d.sizesCaption,
            )}
            ${source(d.sourceLabel, d.sourceBoard)}
          `,
        )}

        ${section(
          SECTIONS.relations,
          d.relationsTitle,
          html`
            ${list(d.relations)}
            ${demo(bothModes('publishing', locale, d.frameTitle, captions), d.relationsCaption)}
            ${source(d.sourceLabel, d.sourceBoard)}
          `,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceBoard)}`,
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
            ${demo(bothModes('edit-profile', locale, d.frameTitle, captions), d.exampleForm)}
            ${demo(bothModes('send-for-approval', locale, d.frameTitle, captions), d.exampleConfirmation)}
            ${demo(bothModes('import-contacts', locale, d.frameTitle, captions), d.exampleWide)}
            ${source(d.sourceLabel, d.sourceBoard)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
