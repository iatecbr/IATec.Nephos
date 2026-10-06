/**
 * Pagina de leitura do `nph-label`.
 *
 * Nao prova contrato — isso e papel de `Componentes/nph-label/Validacao` e dos
 * testes. O conteudo e transcrito do quadro aceito no Figma (`1194:1482`), da
 * ficha e da P62; nada e decidido aqui.
 *
 * O texto vem do dicionario de idioma, em `.storybook/i18n/`, na chave
 * `labelDocs`. A story e UNICA: ela le `globals.locale` e busca a traducao.
 * Identificadores tecnicos aparecem literais e sao iguais em qualquer idioma.
 *
 * O `nph-input` e o `nph-field` ainda nao existem em codigo. Onde o quadro
 * mostra o rotulo acima do controle, a demonstracao usa um `<input>` nativo na
 * moldura; os exemplos com o `nph-field` ficam so no texto.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-label';
import { body, demo, dontDo, header, index, list, note, section, source, table, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Componentes/nph-label/Docs',
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
  variants: 'variants-and-states',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  relations: 'relations',
  examples: 'examples',
  antiPatterns: 'anti-patterns',
  references: 'references',
} as const;

/* Moldura de demonstracao. Nao e precedente para CSS de componente. */
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const field = 'display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); max-inline-size: 20rem;';
const control =
  'font-family: var(--nph-text-body-md-font-family); font-size: var(--nph-text-body-md-font-size); block-size: var(--nph-control-height-default); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); padding-inline: var(--nph-space-control-padding); background: var(--nph-color-background); color: var(--nph-color-foreground);';
const legend =
  'margin: 0; font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height); color: var(--nph-color-muted-foreground);';
const roomBelow = 'padding-block-end: var(--nph-space-section);';

let nextId = 0;

/** Rotulo acima de um `<input>` nativo, ligados por `for`. */
function labelled(label: TemplateResult, id: string): TemplateResult {
  return html`<div style=${field}>${label}<input id=${id} style=${control} /></div>`;
}

/** Pagina de leitura, montada com os blocos de `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentação',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).labelDocs;
    const [name, email, cpf] = d.exampleLabels as string[];
    const [cpfInfo, cpfInfoLabel] = d.exampleInfoTexts as string[];
    const id = (): string => `nph-label-docs-${++nextId}`;
    const nameId = id();
    const emailId = id();
    const cpfId = id();

    return html`
      <div style=${body}>
        ${header('nph-label', d.summary)}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.relations, title: d.relationsTitle },
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
                <nph-label text=${name}></nph-label>
                <nph-label text=${name} required></nph-label>
                <nph-label text=${name} info=${d.info} info-label=${d.infoLabel}></nph-label>
                <nph-label text=${name} required info=${d.info} info-label=${d.infoLabel}></nph-label>
              </div>`,
              d.variantsCaption,
            )}
            ${demo(
              html`<div style=${roomBelow}>
                <nph-label text=${name} info=${d.info} info-label=${d.infoLabel}></nph-label>
              </div>`,
              d.openCaption,
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
          SECTIONS.relations,
          d.relationsTitle,
          html`${list(d.relations)} ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(labelled(html`<nph-label for=${nameId} text=${name}></nph-label>`, nameId), d.exampleAlone)}
            ${demo(
              html`<div style=${column}>
                ${labelled(html`<nph-label for=${emailId} text=${email} required></nph-label>`, emailId)}
                <p style=${legend}>${d.requiredLegend}</p>
              </div>`,
              d.exampleRequired,
            )}
            ${demo(
              html`<div style=${roomBelow}>
                ${labelled(
                  html`<nph-label for=${cpfId} text=${cpf} info=${cpfInfo} info-label=${cpfInfoLabel}></nph-label>`,
                  cpfId,
                )}
              </div>`,
              d.exampleWithInfo,
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
