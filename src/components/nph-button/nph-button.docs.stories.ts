/**
 * Reading page of `nph-button`.
 *
 * It does not prove the contract — that is the role of `Components/nph-button/Validation` and of the
 * tests. The content is transcribed from the frame accepted in Figma (`1197:5449`), from the
 * `nph-icon-button` board (`2122:1591`) for the button without text, from the `ficha` and
 * from P68 and P86; nothing is decided here.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the key
 * `buttonDocs`. The story is SINGLE: it reads `globals.locale` and fetches the translation.
 * Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-button';
import { NPH_BUTTON_EMPHASES, NPH_BUTTON_SEVERITIES, NPH_BUTTON_SHAPES, NPH_BUTTON_SIZES } from './nph-button';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-button.json';

const meta: Meta = {
  title: 'Components/nph-button/Docs',
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
  variants: 'severity-and-emphasis',
  sizes: 'sizes',
  iconOnly: 'icon-only',
  states: 'states',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/** The severities that have outline, light and ghost (B1). */
const WITH_LIGHT_EMPHASES = ['primary', 'secondary', 'danger'];

/* Demonstration frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

/** Reading page, assembled with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).buttonDocs;
    const [save, cancel, deleteAccount, close, create, viewDetails, edit, remove] = d.exampleTexts as string[];

    return html`
      <main style=${body}>
        ${header('nph-button', d.summary)}
        ${matrix(
          d.matrixLabel,
          NPH_BUTTON_SEVERITIES.map((severity) => `severity: ${severity}`),
          NPH_BUTTON_EMPHASES.map((emphasis) => ({
            label: `emphasis: ${emphasis}`,
            cells: NPH_BUTTON_SEVERITIES.map((severity) =>
              emphasis === 'solid' || WITH_LIGHT_EMPHASES.includes(severity)
                ? html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${save}></nph-button>`
                : html``,
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
          { id: SECTIONS.iconOnly, title: d.iconOnlyTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${sheetUseDontUse(metadata, localeOf(context), d)}
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
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-button'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.variants,
          d.variantsTitle,
          html`
            ${demo(
              html`<div style=${column}>
                ${NPH_BUTTON_EMPHASES.map(
                  (emphasis) => html`<div style=${row}>
                    ${NPH_BUTTON_SEVERITIES.filter(
                      (severity) => emphasis === 'solid' || WITH_LIGHT_EMPHASES.includes(severity),
                    ).map(
                      (severity) =>
                        html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${severity}></nph-button>`,
                    )}
                  </div>`,
                )}
              </div>`,
              d.variantsCaption,
            )}
            ${text(d.severityNote)}
            ${table(d.severityUseHeader, d.severityUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const))}
            ${table(d.severityDontHeader, d.severityDont.map(({ value, label }: { value: string; label: string }) => [value, label] as const))}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(
              html`<div style=${column}>
                ${NPH_BUTTON_SIZES.map(
                  (size) => html`<div style=${row}>
                    <nph-button size=${size} text=${save}></nph-button>
                    <nph-button size=${size} text=${create} icon-start="plus"></nph-button>
                    <nph-button size=${size} icon-start="xmark" label=${close}></nph-button>
                    <code>${size}</code>
                  </div>`,
                )}
              </div>`,
              d.sizesCaption,
            )}
            ${table(d.sizeUseHeader, d.sizeUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const))}
            ${table(d.sizeDontHeader, d.sizeDont.map(({ value, label }: { value: string; label: string }) => [value, label] as const))}
            ${source(d.sourceLabel, d.sourceSpec)}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.iconOnly,
          d.iconOnlyTitle,
          html`
            ${text(d.iconOnlyText)}
            ${demo(
              html`<div style=${column}>
                ${NPH_BUTTON_SHAPES.map(
                  (shape) => html`<div style=${row}>
                    ${NPH_BUTTON_SIZES.map(
                      (size) => html`<nph-button size=${size} shape=${shape} icon-start="plus" label=${create}></nph-button>`,
                    )}
                    ${shape === 'circular'
                      ? html`<nph-button size="default" shape=${shape} icon-start="plus" label=${create} loading></nph-button>`
                      : ''}
                    <code>${shape}</code>
                  </div>`,
                )}
              </div>`,
              d.iconOnlyCaption,
            )}
            ${source(d.sourceLabel, d.sourceIconOnly)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(([state, change]: [string, string]) => [state, change] as const))}
            ${demo(
              html`<div style=${row}>
                <nph-button size="default" text=${save} disabled></nph-button>
                <nph-button size="default" severity="secondary" text=${cancel} disabled></nph-button>
                <nph-button size="default" text=${save} loading></nph-button>
                <nph-button size="default" icon-start="xmark" label=${close} loading></nph-button>
              </div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(([part, rule]: [string, string]) => [part, rule] as const), 'text')}
          ${source(d.sourceLabel, d.sourceAnatomy)}`,
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
              html`<div style=${row}>
                <nph-button size="default" text=${save}></nph-button>
                <nph-button size="default" severity="secondary" text=${cancel}></nph-button>
              </div>`,
              d.exampleForm,
            )}
            ${demo(html`<nph-button size="default" severity="danger" text=${deleteAccount}></nph-button>`, d.exampleConsequence)}
            ${demo(
              html`<div style=${row}>
                <nph-button size="compact" severity="secondary" emphasis="ghost" icon-start="eye" label=${viewDetails}></nph-button>
                <nph-button size="compact" severity="secondary" emphasis="ghost" icon-start="pen" label=${edit}></nph-button>
                <nph-button size="compact" severity="secondary" emphasis="ghost" icon-start="trash" label=${remove}></nph-button>
              </div>`,
              d.exampleTable,
            )}
            ${demo(
              html`<nph-button size="default" severity="secondary" emphasis="ghost" icon-start="plus" label=${create}></nph-button>`,
              d.exampleIconOnly,
            )}
            ${demo(
              html`<nph-button size="default" shape="circular" icon-start="plus" label=${create}></nph-button>`,
              d.exampleCircular,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
            ${source(d.sourceLabel, d.sourceIconOnly)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
