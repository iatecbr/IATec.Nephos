/**
 * Reading page of `nph-tooltip`.
 *
 * It does not prove the contract — that is the role of `Components/nph-tooltip/Validation` and of
 * the tests. The content is transcribed from the board accepted in Figma (`1241:3`, frame `1237:5`),
 * from the spec sheet (`ficha`) and from P77; nothing is decided here. The page follows the order of
 * the `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use" are the
 * ones of the sheet. The four required examples of the board close it, each in light and dark mode.
 *
 * Deferred, not fulfilled here:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35, which also gives
 *   `package.json` the `exports` for the import line;
 * - the "When to use" lists still come from the dictionary, and a test checks that they equal the
 *   sheet's; reading them from the Metadata is P71, in DSA-34;
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `tooltipDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical identifiers
 * appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import '../nph-label/nph-label';
import './nph-tooltip';
import { anchored, bothModes, iconButton, openOnRender } from './nph-tooltip.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-tooltip/Docs',
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
  relations: 'relations-and-context',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'required-examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. The balloon sits in the top layer: the room is for the eye. */
const roomAbove = 'padding-block-start: calc(var(--nph-space-section) * 2); display: flex; justify-content: center;';

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).tooltipDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const modes = (content: () => TemplateResult): TemplateResult =>
      bothModes({ light: d.lightCaption as string, dark: d.darkCaption as string }, content);
    const labelWithInfo = (required: boolean): TemplateResult =>
      html`<div style=${roomAbove}>
        <nph-label
          ${ref((element) => openOnRender(element))}
          text=${d.labelText}
          ?required=${required}
          info=${d.info}
          info-label=${d.infoLabel}
        ></nph-label>
      </div>`;
    const sample = (value: string): TemplateResult =>
      html`<div style=${roomAbove}>
        ${anchored((id) => html`<button id=${id} type="button">${d.target}</button>`, { text: value, open: true })}
      </div>`;

    return html`
      <main style=${body}>
        ${header('nph-tooltip', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: d.textShort, cells: [sample(d.short)] },
            { label: d.textSentence, cells: [sample(d.sentence)] },
            { label: d.textTwoLines, cells: [sample(d.twoLines)] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
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
            ${useDontUse({ title: d.whenToUseTitle, items: d.whenToUse }, { title: d.whenNotToUseTitle, items: d.whenNotToUse })}
            ${source(d.sourceLabel, d.sourceBoard)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(pair))} ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.relations,
          d.relationsTitle,
          html`
            ${list(d.relations)}
            ${demo(labelWithInfo(false), d.relationsCaption)}
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
            ${demo(modes(() => labelWithInfo(false)), d.exampleLabel)}
            ${demo(modes(() => labelWithInfo(true)), d.exampleRequired)}
            ${demo(modes(() => sample(d.sentence)), d.exampleFocus)}
            ${demo(
              modes(
                () => html`<div style="display: flex; flex-wrap: wrap; gap: calc(var(--nph-space-section) * 3); justify-content: center;">
                  ${(['top', 'bottom', 'left', 'right'] as const).map(
                    (side) => html`<span style="display: inline-flex;">${iconButton({ text: d.delete, side, open: true })}</span>`,
                  )}
                </div>`,
              ),
              d.exampleSides,
            )}
            ${source(d.sourceLabel, d.sourceBoard)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
