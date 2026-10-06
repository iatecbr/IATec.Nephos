/**
 * Pagina de leitura do `nph-button`.
 *
 * Nao prova contrato — isso e papel de `Components/nph-button/Validation` e dos
 * testes. O conteudo e transcrito do quadro aceito no Figma (`1197:5449`), da
 * ficha e da P68; nada e decidido aqui.
 *
 * O texto vem do dicionario de idioma, em `.storybook/i18n/`, na chave
 * `buttonDocs`. A story e UNICA: ela le `globals.locale` e busca a traducao.
 * Identificadores tecnicos aparecem literais e sao iguais em qualquer idioma.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-button';
import { NPH_BUTTON_EMPHASES, NPH_BUTTON_SEVERITIES, NPH_BUTTON_SIZES } from './nph-button';
import { body, demo, dontDo, header, index, list, note, section, source, table, text, useDontUse } from '../../shared/docs/page';

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

/** Ids das secoes: identificadores tecnicos, iguais em qualquer idioma. */
const SECTIONS = {
  whenToUse: 'when-to-use',
  api: 'api',
  variants: 'severity-and-emphasis',
  sizes: 'sizes',
  states: 'states',
  accessibility: 'accessibility',
  examples: 'examples',
  antiPatterns: 'anti-patterns',
  references: 'references',
} as const;

/** Os tipos que tem outline, light e ghost (B1). */
const WITH_LIGHT_EMPHASES = ['primary', 'secondary', 'danger'];

/* Moldura de demonstracao. Nao e precedente para CSS de componente. */
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

/** Pagina de leitura, montada com os blocos de `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).buttonDocs;
    const [save, cancel, deleteAccount, close, create] = d.exampleTexts as string[];

    return html`
      <div style=${body}>
        ${header('nph-button', d.summary)}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
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
                <nph-button size="default" text=${save} disabled></nph-button>
                <nph-button size="default" emphasis="outline" severity="secondary" text=${cancel} disabled></nph-button>
                <nph-button size="default" text=${save} loading></nph-button>
                <nph-button size="default" icon-start="xmark" label=${close} loading></nph-button>
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
              html`<div style=${row}>
                <nph-button size="default" text=${save}></nph-button>
                <nph-button size="default" severity="secondary" emphasis="outline" text=${cancel}></nph-button>
              </div>`,
              d.exampleForm,
            )}
            ${demo(html`<nph-button size="default" severity="danger" text=${deleteAccount}></nph-button>`, d.exampleConsequence)}
            ${demo(
              html`<nph-button size="default" severity="secondary" emphasis="ghost" icon-start="xmark" label=${close}></nph-button>`,
              d.exampleIconOnly,
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
