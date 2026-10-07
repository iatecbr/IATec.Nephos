/**
 * Reading page of `nph-radio`.
 *
 * It does not prove the contract — that is the role of `Components/nph-radio/Validation`
 * and of the tests. The content is transcribed from the frame accepted in Figma
 * (`1196:311`) and from P69; nothing is decided here.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the key
 * `radioDocs`. The story is SINGLE: it reads `globals.locale` and fetches the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-radio';
import { body, demo, dontDo, header, index, list, note, section, source, table, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-radio/Docs',
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
const title =
  'margin: 0; color: var(--nph-color-foreground); font-family: var(--nph-text-label-md-font-family); font-size: var(--nph-text-label-md-font-size); font-weight: var(--nph-text-label-md-font-weight); line-height: var(--nph-text-label-md-line-height);';

/** A named group: the role that nph-field will have. */
function group(id: string, name: string, content: TemplateResult): TemplateResult {
  return html`<div style=${stack}>
    <p id=${id} style=${title}>${name}</p>
    <div role="radiogroup" aria-labelledby=${id} style=${stack}>${content}</div>
  </div>`;
}

/** Reading page, assembled with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const d = translations(locale).radioDocs;
    const v = translations(locale).radioValidation;

    return html`
      <div style=${body}>
        ${header('nph-radio', d.summary)}
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
                <nph-radio name="docs-values" text=${v.unchecked}></nph-radio>
                <nph-radio name="docs-values" text=${v.checked} checked></nph-radio>
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
              html`<div style=${row}>
                <nph-radio name="docs-invalid" text=${v.checked} checked invalid></nph-radio>
                <nph-radio name="docs-disabled" text=${v.checked} checked disabled></nph-radio>
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
              group(
                'docs-radio-payment',
                v.paymentTitle,
                html`<nph-radio name="docs-payment" value="pix" text=${v.pix} checked></nph-radio>
                  <nph-radio name="docs-payment" value="card" text=${v.card}></nph-radio>
                  <nph-radio name="docs-payment" value="slip" text=${v.slip}></nph-radio>`,
              ),
              d.examplePayment,
            )}
            ${demo(
              group(
                'docs-radio-bond',
                v.bondTitle,
                html`<nph-radio name="docs-bond" value="employee" text=${v.employee}></nph-radio>
                  <nph-radio name="docs-bond" value="contractor" text=${v.contractor}></nph-radio>`,
              ),
              d.exampleBond,
            )}
            ${demo(
              group(
                'docs-radio-shift',
                v.shiftTitle,
                html`<nph-radio name="docs-shift" value="morning" text=${v.morning} checked></nph-radio>
                  <nph-radio name="docs-shift" value="afternoon" text=${v.afternoon}></nph-radio>
                  <nph-radio name="docs-shift" value="night" text=${v.night}></nph-radio>`,
              ),
              d.exampleShift,
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
