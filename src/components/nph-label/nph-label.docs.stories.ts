/**
 * Reading page of `nph-label`.
 *
 * It does not prove the contract — that is the role of
 * `Components/nph-label/Validation` and of the tests. The page opens with the
 * labelled matrix of the frame (`1194:1694`); sections 1 to 10 follow the frame
 * accepted in Figma (`1194:1482`), with its literal text, and 9 and 10 share one
 * block, side by side; the table
 * of the API in code comes from the spec sheet (`ficha`) and from P62.6, and
 * says so in its footer. Nothing is decided here.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under
 * the `labelDocs` key. The story is SINGLE: it reads `globals.locale` and
 * looks up the translation. Technical identifiers appear literally and are the
 * same in any language.
 *
 * `nph-input` and `nph-field` do not exist in code yet. Where the frame shows
 * the label above the control, the demo uses a native `<input>` in the frame.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-label';
import { body, demo, header, index, list, matrix, note, section, source, table, text, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-label/Docs',
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
  purpose: 'purpose',
  description: 'description',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  properties: 'properties-variants-and-states',
  relations: 'relations',
  whenToUse: 'when-to-use',
  examples: 'required-examples',
  doAndDont: 'do-and-do-not-use',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);';
const field = 'display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); max-inline-size: 20rem;';
const control =
  'font-family: var(--nph-text-body-md-font-family); font-size: var(--nph-text-body-md-font-size); block-size: var(--nph-control-height-default); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); padding-inline: var(--nph-space-control-padding); background: var(--nph-color-background); color: var(--nph-color-foreground);';
const legend =
  'margin: 0; font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height); color: var(--nph-color-muted-foreground);';
const roomBelow = 'padding-block-end: var(--nph-space-section);';

let nextId = 0;

/** Label above a native `<input>`, linked by `for`. */
function labelled(label: (id: string) => TemplateResult): TemplateResult {
  const id = `nph-label-docs-${++nextId}`;
  return html`<div style=${field}>${label(id)}<input id=${id} style=${control} /></div>`;
}

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
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

    const doAndDontTitle = `${d.doTitle} · ${d.dontTitle}`;
    const combination = (required: boolean, info: boolean): string => `required = ${required} · info = ${info}`;

    return html`
      <div style=${body}>
        ${header('nph-label', d.summary)}
        ${matrix(d.matrixLabel, [], [
          { label: combination(false, false), cells: [html`<nph-label text=${sample}></nph-label>`] },
          { label: combination(true, false), cells: [html`<nph-label text=${sample} required></nph-label>`] },
          { label: combination(false, true), cells: [withInfo()] },
          { label: combination(true, true), cells: [withInfo({ required: true })] },
        ])}
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
          { id: SECTIONS.doAndDont, title: doAndDontTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.purpose,
          d.purposeTitle,
          html`
            ${text(d.purpose)}
            ${demo(html`<nph-label text=${sample}></nph-label>`, d.selectionCaption)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
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
          SECTIONS.doAndDont,
          doAndDontTitle,
          html`
            ${useDontUse({ title: d.doCardTitle, items: d.do }, { title: d.dontCardTitle, items: d.dont })}
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

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </div>
    `;
  },
};
