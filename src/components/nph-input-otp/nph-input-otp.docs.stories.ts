/**
 * Reading page of `nph-input-otp`.
 *
 * It does not prove the contract — that is the role of `Components/nph-input-otp/Validation` and
 * of the tests. The content is transcribed from the board accepted in Figma (`1633:122`), from
 * the spec sheet (`ficha`) and from P85; nothing is decided here. The page follows the order of
 * the `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use" are
 * the ones of the sheet. The required examples close it, each in light and dark mode.
 *
 * Deferred, not fulfilled here:
 * - the two required examples that sit inside the `nph-field` — the code sent by e-mail and the
 *   wrong code with the error message — wait for the `nph-field` (DSA-28), as the task DSA-41
 *   records, after the precedent of DSA-33 D2;
 * - the resend action, a ghost `nph-button` with the label in `color/link`, waits for D4 of
 *   DSA-41: the `nph-button` has no way to draw that look yet;
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35;
 * - the "When to use" lists still come from the dictionary, and a test checks that they equal the
 *   sheet's; reading them from the Metadata is P71, in DSA-34.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `inputOtpDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-input-otp';
import { field, inScheme } from './nph-input-otp.demo';
import type { Scheme } from './nph-input-otp.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-input-otp/Docs',
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
  size: 'length-and-size',
  states: 'states',
  masked: 'masked',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';
const stack = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack);';

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
    const d = translations(localeOf(context)).inputOtpDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const label = d.fieldLabel;

    return html`
      <main style=${body}>
        ${header('nph-input-otp', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['size: default', 'size: large'],
          [
            {
              label: 'length: 6',
              cells: [field({ label, value: d.numericCode }), field({ label, value: d.numericCode, size: 'large' })],
            },
            {
              label: 'length: 4',
              cells: [field({ label, value: d.shortCode, length: 4 }), field({ label, value: d.shortCode, length: 4, size: 'large' })],
            },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.size, title: d.sizeTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.masked, title: d.maskedTitle },
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
          SECTIONS.size,
          d.sizeTitle,
          html`
            ${text(d.sizeText)}
            ${demo(
              html`<div style=${stack}>
                ${field({ label, value: d.numericCode })} ${field({ label, value: d.numericCode, size: 'large' })}
                ${field({ label, value: d.shortCode, length: 4 })}
              </div>`,
              d.sizeCaption,
            )}
            ${source(d.sourceLabel, d.sourceSize)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${text(d.statesText)}
            ${demo(
              html`<div style=${stack}>
                ${field({ label, value: d.partialCode })} ${field({ label, value: d.numericCode, invalid: true })}
                ${field({ label, value: d.partialCode, disabled: true })}
              </div>`,
              d.statesCaption,
            )}
            ${table(d.statesHeader, d.statesRules.map(pair))} ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.masked,
          d.maskedTitle,
          html`
            ${text(d.maskedText)}
            ${demo(
              html`<div style=${stack}>
                ${field({ label, value: d.alphanumericCode })} ${field({ label, value: d.alphanumericCode, masked: true })}
              </div>`,
              d.maskedCaption,
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
            ${demo(bothModes(d, () => field({ label, size: 'large' })), d.exampleTouch)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
