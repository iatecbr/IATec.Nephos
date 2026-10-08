/**
 * Reading page of `nph-checkbox`.
 *
 * It does not prove the contract — that is the role of
 * `Components/nph-checkbox/Validation` and of the tests. The content is transcribed
 * from the frame accepted in Figma (`1194:1033`) and from P69; nothing is decided here.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the key
 * `checkboxDocs`. The story is SINGLE: it reads `globals.locale` and fetches the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-checkbox';
import { body, demo, dontDo, header, index, list, note, section, source, table, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-checkbox/Docs',
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
  values: 'marking',
  states: 'states',
  accessibility: 'accessibility',
  examples: 'examples',
  antiPatterns: 'anti-patterns',
  references: 'references',
} as const;

/* Demonstration frame. Not a precedent for component CSS. */
const row = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const stack = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-inline-tight);';
const indent = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-inline-tight); padding-inline-start: var(--nph-space-stack);';

/** Reading page, assembled with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const d = translations(locale).checkboxDocs;
    const v = translations(locale).checkboxValidation;

    return html`
      <div style=${body}>
        ${header('nph-checkbox', d.summary)}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.values, title: d.valuesTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.antiPatterns, title: d.antiPatternsTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${useDontUse({ title: d.whenToUseTitle, items: d.whenToUse }, { title: d.whenNotToUseTitle, items: d.whenNotToUse })}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(([term, rule]: [string, string]) => [term, rule] as const))}
          ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.values,
          d.valuesTitle,
          html`
            ${demo(
              html`<div style=${row}>
                <nph-checkbox text=${v.unchecked}></nph-checkbox>
                <nph-checkbox text=${v.checked} checked></nph-checkbox>
                <nph-checkbox text=${v.indeterminate} indeterminate></nph-checkbox>
              </div>`,
              d.valuesCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(([state, change]: [string, string]) => [state, change] as const))}
            ${demo(
              html`<div style=${stack}>
                <div style=${row}>
                  <nph-checkbox text=${v.unchecked}></nph-checkbox>
                  <nph-checkbox text=${v.checked} checked></nph-checkbox>
                  <nph-checkbox text=${v.indeterminate} indeterminate></nph-checkbox>
                </div>
                <div style=${row}>
                  <nph-checkbox text=${v.unchecked} invalid></nph-checkbox>
                  <nph-checkbox text=${v.checked} checked invalid></nph-checkbox>
                  <nph-checkbox text=${v.indeterminate} indeterminate invalid></nph-checkbox>
                </div>
                <div style=${row}>
                  <nph-checkbox text=${v.unchecked} disabled></nph-checkbox>
                  <nph-checkbox text=${v.checked} checked disabled></nph-checkbox>
                  <nph-checkbox text=${v.indeterminate} indeterminate disabled></nph-checkbox>
                </div>
              </div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${table(
            d.accessibilityHeader,
            d.accessibility.map(([criterion, rule]: [string, string]) => [criterion, rule] as const),
            'text',
          )}
          ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(html`<nph-checkbox text=${v.accept}></nph-checkbox>`, d.exampleAccept)}
            ${demo(
              html`<div style=${stack}>
                <nph-checkbox text=${v.email} checked></nph-checkbox>
                <nph-checkbox text=${v.sms}></nph-checkbox>
                <nph-checkbox text=${v.push} checked></nph-checkbox>
              </div>`,
              d.examplePreferences,
            )}
            ${demo(
              html`<div style=${stack}>
                <nph-checkbox text=${v.selectAll} indeterminate></nph-checkbox>
                <div style=${indent}>
                  <nph-checkbox text=${v.email} checked></nph-checkbox>
                  <nph-checkbox text=${v.sms}></nph-checkbox>
                </div>
              </div>`,
              d.exampleGroup,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.antiPatterns,
          d.antiPatternsTitle,
          html`${dontDo(d.antiPatternsTitle, d.antiPatterns)} ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </div>
    `;
  },
};
