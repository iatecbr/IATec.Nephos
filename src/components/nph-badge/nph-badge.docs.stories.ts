/**
 * Pagina de leitura do `nph-badge`.
 *
 * Nao prova contrato — isso e papel de `Components/nph-badge/Validation` e dos
 * testes. O conteudo e transcrito do quadro aceito no Figma (`1196:1100`), da
 * ficha e da P68; nada e decidido aqui.
 *
 * O texto vem do dicionario de idioma, em `.storybook/i18n/`, na chave
 * `badgeDocs`. A story e UNICA: ela le `globals.locale` e busca a traducao.
 * Identificadores tecnicos aparecem literais e sao iguais em qualquer idioma.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-badge';
import { NPH_BADGE_EMPHASES, NPH_BADGE_SEVERITIES } from './nph-badge';
import { body, demo, dontDo, header, index, list, note, section, source, table, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-badge/Docs',
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
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  antiPatterns: 'anti-patterns',
  references: 'references',
} as const;

/* Moldura de demonstracao. Nao e precedente para CSS de componente. */
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline-tight);';
const item = 'display: flex; align-items: center; gap: var(--nph-space-inline); color: var(--nph-color-foreground);';

/** Pagina de leitura, montada com os blocos de `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).badgeDocs;
    const [report, contract, request] = d.exampleItems as string[];
    const [draft, finance, rejected] = d.exampleBadges as string[];

    return html`
      <div style=${body}>
        ${header('nph-badge', d.summary)}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
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
                ${NPH_BADGE_EMPHASES.map(
                  (emphasis) => html`
                    <div style=${row}>
                      ${NPH_BADGE_SEVERITIES.map(
                        (severity) => html`<nph-badge severity=${severity} emphasis=${emphasis} text=${severity}></nph-badge>`,
                      )}
                    </div>
                    <div style=${row}>
                      ${NPH_BADGE_SEVERITIES.map(
                        (severity) =>
                          html`<nph-badge severity=${severity} emphasis=${emphasis} text=${severity} icon="circle-info"></nph-badge>`,
                      )}
                    </div>
                  `,
                )}
              </div>`,
              d.variantsCaption,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
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
              html`<span style=${item}>${report} <nph-badge severity="secondary" text=${draft}></nph-badge></span>`,
              d.examplePermanent,
            )}
            ${demo(
              html`<span style=${item}>${contract} <nph-badge severity="info" emphasis="light" text=${finance}></nph-badge></span>`,
              d.exampleCategory,
            )}
            ${demo(
              html`<span style=${item}
                >${request} <nph-badge severity="danger" emphasis="light" text=${rejected} icon="circle-xmark"></nph-badge
              ></span>`,
              d.exampleIcon,
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
