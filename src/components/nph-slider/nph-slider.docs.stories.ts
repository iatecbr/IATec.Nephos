/**
 * Reading page of `nph-slider`.
 *
 * It does not prove the contract — that is the role of `Components/nph-slider/Validation` and of
 * the tests. The content is transcribed from the board accepted in Figma (`1636:46`), from the
 * spec sheet (`ficha`) and from P94; nothing is decided here. The page follows the order of the
 * `nph-badge` and `nph-input` pages: it opens with the labelled matrix, and the two lists of "When
 * to use" are the ones of the sheet. The set has two variant axes, `orientacao` and `tipo`, so
 * Variants comes first, then States and the section of the piece itself, Optional parts. The three
 * required examples of the board close it, each in light and dark mode.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35, which also gives
 *   `package.json` the `exports` for the import line;
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `sliderDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical
 * identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-slider';
import { brightness, inField, inScheme, priceRange, volume } from './nph-slider.demo';
import type { Scheme } from './nph-slider.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-slider.json';

const meta: Meta = {
  title: 'Components/nph-slider/Docs',
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
  variants: 'variants',
  states: 'states',
  parts: 'optional-parts',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack);';
const line = 'display: flex; flex-wrap: wrap; align-items: flex-end; gap: var(--nph-space-section);';
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
    const d = translations(localeOf(context)).sliderDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const piece = (attributes: { orientation?: string; mode?: string; invalid?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-slider
        orientation=${attributes.orientation ?? 'horizontal'}
        mode=${attributes.mode ?? 'single'}
        label=${attributes.mode === 'range' ? d.priceLabel : d.volumeLabel}
        start-label=${attributes.mode === 'range' ? d.startLabel : ''}
        end-label=${attributes.mode === 'range' ? d.endLabel : ''}
        value="40"
        start="20"
        end="70"
        ?invalid=${attributes.invalid ?? false}
        ?disabled=${attributes.disabled ?? false}
      ></nph-slider>`;

    return html`
      <main style=${body}>
        ${header('nph-slider', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['mode: single', 'mode: range'],
          [
            { label: 'default', cells: [piece({}), piece({ mode: 'range' })] },
            { label: 'invalid', cells: [piece({ invalid: true }), piece({ mode: 'range', invalid: true })] },
            { label: 'disabled', cells: [piece({ disabled: true }), piece({ mode: 'range', disabled: true })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.parts, title: d.partsTitle },
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
          SECTIONS.variants,
          d.variantsTitle,
          html`
            ${table(d.variantsHeader, d.variants.map(pair))}
            ${demo(
              html`<div style=${line}>
                ${piece({})} ${piece({ mode: 'range' })} ${piece({ orientation: 'vertical' })}
                ${piece({ orientation: 'vertical', mode: 'range' })}
              </div>`,
              d.variantsCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(pair))}
            ${demo(
              html`<div style=${column}>${piece({})} ${piece({ invalid: true })} ${piece({ disabled: true })}</div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.parts,
          d.partsTitle,
          html`
            ${text(d.partsText)} ${table(d.partsHeader, d.parts.map(pair))}
            ${demo(
              html`<div style=${column}>
                <nph-slider limits label=${d.volumeLabel} value="40"></nph-slider>
                <nph-slider marks min="1" max="5" value="3" label=${d.ratingLabel}></nph-slider>
                <nph-slider
                  steppers
                  label=${d.volumeLabel}
                  decrease-label=${d.decreaseLabel}
                  increase-label=${d.increaseLabel}
                  value="40"
                ></nph-slider>
              </div>`,
              d.partsCaption,
            )}
            ${note('warning', d.invalidTitle, d.invalidText)} ${source(d.sourceLabel, d.sourceSpec)}
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
            ${demo(bothModes(d, () => brightness({ label: d.brightnessLabel })), d.exampleBrightness)}
            ${demo(bothModes(d, () => priceRange({ label: d.priceLabel, startLabel: d.startLabel, endLabel: d.endLabel })), d.examplePrice)}
            ${demo(bothModes(d, () => volume({ label: d.volumeLabel })), d.exampleVolume)}
            ${demo(bothModes(d, () => inField({ label: d.volumeLabel, help: d.volumeHelp, error: d.volumeError })), d.exampleField)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
