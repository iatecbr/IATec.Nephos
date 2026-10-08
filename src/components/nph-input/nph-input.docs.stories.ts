/**
 * Reading page of `nph-input`.
 *
 * It does not prove the contract — that is the role of `Components/nph-input/Validation`
 * and of the tests. The content is transcribed from the frame accepted in Figma
 * (`1195:532`) and from P69; nothing is decided here.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the key
 * `inputDocs`. The story is SINGLE: it reads `globals.locale` and fetches the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-input';
import '../nph-label/nph-label';
import { NPH_INPUT_SIZES } from './nph-input';
import { body, demo, dontDo, header, index, list, note, section, source, table, text, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-input/Docs',
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
  sizes: 'sizes',
  states: 'states',
  accessibility: 'accessibility',
  examples: 'examples',
  antiPatterns: 'anti-patterns',
  references: 'references',
} as const;

/* Demonstration frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const field = 'display: flex; flex-direction: column; gap: var(--nph-space-inline-tight);';

/** Reading page, assembled with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const d = translations(locale).inputDocs;
    const v = translations(locale).inputValidation;

    return html`
      <div style=${body}>
        ${header('nph-input', d.summary)}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
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
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(
              html`<div style=${column}>
                ${NPH_INPUT_SIZES.map(
                  (size) => html`<div style=${row}>
                    <nph-input size=${size} label=${v.emailLabel} value=${v.emailValue}></nph-input>
                    <code>${size}</code>
                  </div>`,
                )}
              </div>`,
              d.sizesCaption,
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
              html`<div style=${column}>
                <div style=${row}>
                  <nph-input label=${v.emailLabel} placeholder=${v.emailPlaceholder}></nph-input>
                  <nph-input label=${v.searchLabel} value=${v.searchValue} clearable clear-label=${v.clear}></nph-input>
                  <nph-input label=${v.emailLabel} value=${v.emailValue}></nph-input>
                </div>
                <div style=${row}>
                  <nph-input label=${v.emailLabel} value=${v.invalidValue} invalid></nph-input>
                  <nph-input label=${v.emailLabel} value=${v.invalidValue} invalid clearable clear-label=${v.clear}></nph-input>
                  <nph-input label=${v.emailLabel} value=${v.emailValue} invalid></nph-input>
                </div>
                <div style=${row}>
                  <nph-input label=${v.emailLabel} placeholder=${v.emailPlaceholder} disabled></nph-input>
                  <nph-input label=${v.emailLabel} value=${v.emailValue} disabled clearable clear-label=${v.clear}></nph-input>
                  <nph-input label=${v.emailLabel} value=${v.emailValue} disabled></nph-input>
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
            ${demo(
              html`<nph-input
                label=${v.searchLabel}
                icon-start="magnifying-glass"
                value=${v.searchValue}
                clearable
                clear-label=${v.clear}
              ></nph-input>`,
              d.exampleSearch,
            )}
            ${demo(
              html`<div style=${field}>
                <nph-label for="docs-input-city" text=${v.labelledByText}></nph-label>
                <nph-input id="docs-input-city"></nph-input>
              </div>`,
              d.exampleLabel,
            )}
            ${demo(html`<nph-input label=${v.emailLabel} value=${v.invalidValue} invalid></nph-input>`, d.exampleError)}
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
