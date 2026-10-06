/**
 * Pagina de leitura do `nph-label`.
 *
 * Nao prova contrato — isso e papel de `Componentes/nph-label/Validacao` e dos
 * testes. As secoes 1 a 10 seguem o quadro aceito no Figma (`1194:1482`), com
 * o texto literal dele; a tabela da API em codigo vem da ficha e da P62.6, e
 * diz isso no rodape. Nada e decidido aqui.
 *
 * O texto vem do dicionario de idioma, em `.storybook/i18n/`, na chave
 * `labelDocs`. A story e UNICA: ela le `globals.locale` e busca a traducao.
 * Identificadores tecnicos aparecem literais e sao iguais em qualquer idioma.
 *
 * O `nph-input` e o `nph-field` ainda nao existem em codigo. Onde o quadro
 * mostra o rotulo acima do controle, a demonstracao usa um `<input>` nativo na
 * moldura.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-label';
import { body, demo, dontDo, header, index, list, note, section, source, table, text } from '../../shared/docs/page';

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
  purpose: 'purpose',
  description: 'description',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  properties: 'properties-variants-and-states',
  relations: 'relations',
  whenToUse: 'when-to-use',
  examples: 'required-examples',
  do: 'do',
  dont: 'do-not-use',
  references: 'references',
} as const;

/* Moldura de demonstracao. Nao e precedente para CSS de componente. */
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);';
const field = 'display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); max-inline-size: 20rem;';
const control =
  'font-family: var(--nph-text-body-md-font-family); font-size: var(--nph-text-body-md-font-size); block-size: var(--nph-control-height-default); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); padding-inline: var(--nph-space-control-padding); background: var(--nph-color-background); color: var(--nph-color-foreground);';
const legend =
  'margin: 0; font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height); color: var(--nph-color-muted-foreground);';
const roomBelow = 'padding-block-end: var(--nph-space-section);';

let nextId = 0;

/** Rotulo acima de um `<input>` nativo, ligados por `for`. */
function labelled(label: (id: string) => TemplateResult): TemplateResult {
  const id = `nph-label-docs-${++nextId}`;
  return html`<div style=${field}>${label(id)}<input id=${id} style=${control} /></div>`;
}

/** Pagina de leitura, montada com os blocos de `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentação',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).labelDocs;
    const sample = d.sampleText as string;
    const withInfo = (extra: Partial<{ required: boolean; for: string }> = {}): TemplateResult =>
      html`<nph-label
        text=${sample}
        ?required=${extra.required ?? false}
        .for=${extra.for ?? null}
        info=${d.info}
        info-label=${d.infoLabel}
      ></nph-label>`;

    return html`
      <div style=${body}>
        ${header('nph-label', d.summary)}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.purpose, title: d.purposeTitle },
          { id: SECTIONS.description, title: d.descriptionTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.properties, title: d.propertiesTitle },
          { id: SECTIONS.relations, title: d.relationsTitle },
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.do, title: d.doTitle },
          { id: SECTIONS.dont, title: d.dontTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.purpose,
          d.purposeTitle,
          html`${text(d.purpose)} ${source(d.sourceLabel, d.sourceFrame)}`,
        )}

        ${section(
          SECTIONS.description,
          d.descriptionTitle,
          html`${text(d.description)} ${source(d.sourceLabel, d.sourceFrame)}`,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`
            ${demo(html`<nph-label text=${sample}></nph-label>`, d.anatomyCaption)}
            ${table(d.anatomyHeader, d.anatomy.map(([part, rule]: [string, string]) => [part, rule] as const), 'text')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`
            ${table(
              d.accessibilityHeader,
              d.accessibility.map(([criterion, rule]: [string, string]) => [criterion, rule] as const),
              'text',
            )}
            ${demo(
              html`<div style=${column}>
                <nph-label text=${sample}></nph-label>
                <nph-label text=${sample} required></nph-label>
                ${withInfo()}
              </div>`,
              d.accessibilityCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.properties,
          d.propertiesTitle,
          html`
            ${table(d.propertiesHeader, d.properties.map(([term, rule]: [string, string]) => [term, rule] as const))}
            ${demo(html`<nph-label text=${sample}></nph-label>`, d.propertiesCaptions[0])}
            ${demo(html`<nph-label text=${sample} required></nph-label>`, d.propertiesCaptions[1])}
            ${demo(withInfo(), d.propertiesCaptions[2])}
            ${demo(html`<div style=${roomBelow}>${withInfo()}</div>`, d.propertiesCaptions[3])}
            ${source(d.sourceLabel, d.sourceFrame)}
            ${table(d.apiHeader, d.api.map(([term, rule]: [string, string]) => [term, rule] as const))}
            ${source(d.sourceLabel, d.sourceApi)}
          `,
        )}

        ${section(
          SECTIONS.relations,
          d.relationsTitle,
          html`
            ${list(d.relations)}
            ${demo(
              labelled((id) => html`<nph-label for=${id} text=${sample}></nph-label>`),
              d.relationsCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`${list(d.whenToUse)} ${source(d.sourceLabel, d.sourceFrame)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(
              labelled((id) => html`<nph-label for=${id} text=${sample} required></nph-label>`),
              d.examplesCaptions[0],
            )}
            ${demo(
              labelled((id) => html`<nph-label for=${id} text=${sample}></nph-label>`),
              d.examplesCaptions[1],
            )}
            ${demo(
              html`<div style=${roomBelow}>${labelled((id) => withInfo({ for: id }))}</div>`,
              d.examplesCaptions[2],
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.do,
          d.doTitle,
          html`
            ${list(d.do)}
            ${demo(
              html`<div style=${column}>
                <nph-label text=${sample} required></nph-label>
                <p style=${legend}>${d.requiredLegend}</p>
              </div>`,
              d.doCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.dont,
          d.dontTitle,
          html`${dontDo(d.dontTitle, d.dont)} ${source(d.sourceLabel, d.sourceFrame)}`,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </div>
    `;
  },
};
