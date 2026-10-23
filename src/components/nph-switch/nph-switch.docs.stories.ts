/**
 * Reading page of `nph-switch`.
 *
 * It does not prove the contract — that is the role of `Components/nph-switch/Validation` and of
 * the tests. The content is transcribed from the frame accepted in Figma (`1549:2`), from the
 * answers D1 to D4 of the task DSA-27, from the spec sheet (`ficha`) and from P79; nothing is
 * decided here. The page follows the order of the `nph-badge` page: it opens with the labelled
 * matrix, and the two lists of "When to use" are the ones of the sheet. The three required
 * examples of the frame close it, each in light and dark mode.
 *
 * Deferred, not fulfilled here:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35, which also gives
 *   `package.json` the `exports` for the import line;
 * - the "When to use" lists still come from the dictionary, and a test checks that they equal the
 *   sheet's; reading them from the Metadata is P71, in DSA-34;
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `switchDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-switch';
import { inScheme, narrow, preferences, singleSetting, unavailableSetting } from './nph-switch.demo';
import type { Scheme } from './nph-switch.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-switch/Docs',
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
  states: 'states',
  label: 'label',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-stack);';
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
    const d = translations(localeOf(context)).switchDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const piece = (attributes: { checked?: boolean; invalid?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-switch
        text=${d.wifi}
        ?checked=${attributes.checked ?? false}
        ?invalid=${attributes.invalid ?? false}
        ?disabled=${attributes.disabled ?? false}
      ></nph-switch>`;
    const bare = (checked: boolean): TemplateResult => html`<nph-switch label=${d.wifi} ?checked=${checked}></nph-switch>`;

    return html`
      <main style=${body}>
        ${header('nph-switch', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['checked: false', 'checked: true'],
          [
            { label: 'text', cells: [piece({}), piece({ checked: true })] },
            { label: 'text · invalid', cells: [piece({ invalid: true }), piece({ invalid: true, checked: true })] },
            { label: 'text · disabled', cells: [piece({ disabled: true }), piece({ disabled: true, checked: true })] },
            { label: 'label', cells: [bare(false), bare(true)] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.label, title: d.labelTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${useDontUse({ title: d.whenToUseTitle, items: d.whenToUse }, { title: d.whenNotToUseTitle, items: d.whenNotToUse })}
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
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(pair))}
            ${demo(
              html`<div style=${row}>
                ${piece({})} ${piece({ checked: true })} ${piece({ invalid: true })} ${piece({ disabled: true })}
                <nph-switch text=${d.wifi} disabled invalid checked></nph-switch>
              </div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.label,
          d.labelTitle,
          html`
            ${text(d.labelText)}
            ${demo(
              html`<div style=${column}>
                ${piece({ checked: true })} ${bare(true)}
                ${narrow(html`<nph-switch text=${d.longLabel} checked></nph-switch>`)}
              </div>`,
              d.labelCaption,
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
            ${demo(bothModes(d, () => singleSetting(d.wifi)), d.exampleSingle)}
            ${demo(
              bothModes(d, () =>
                preferences([
                  { text: d.emailNotifications, checked: true },
                  { text: d.pushNotifications },
                  { text: d.weeklySummary, checked: true },
                ]),
              ),
              d.examplePreferences,
            )}
            ${demo(bothModes(d, () => unavailableSetting(d.backup)), d.exampleUnavailable)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
