/**
 * Reading page of `nph-badge`.
 *
 * It does not prove the contract — that is the role of `Components/nph-badge/Validation` and of the
 * tests. The content is transcribed from the frame accepted in Figma (`1196:1100`), from the
 * spec sheet (`ficha`) and from P68; nothing is decided here. The page opens
 * with the labelled matrix of the frame (`1196:1308`).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `badgeDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the translation.
 * Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-badge';
import { NPH_BADGE_EMPHASES, NPH_BADGE_SEVERITIES } from './nph-badge';
import { body, demo, header, index, list, matrix, note, section, source, table, useDontUse } from '../../shared/docs/page';

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

/** Section ids: technical identifiers, the same in any language. */
const SECTIONS = {
  whenToUse: 'when-to-use',
  api: 'api',
  variants: 'severity-and-emphasis',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline-tight);';
const item = 'display: flex; align-items: center; gap: var(--nph-space-inline); color: var(--nph-color-foreground);';

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).badgeDocs;
    const [report, contract, request] = d.exampleItems as string[];
    const [draft, finance, rejected] = d.exampleBadges as string[];

    return html`
      <div style=${body}>
        ${header('nph-badge', d.summary)}
        ${matrix(
          d.matrixLabel,
          NPH_BADGE_SEVERITIES.map((severity) => `severity: ${severity}`),
          NPH_BADGE_EMPHASES.map((emphasis) => ({
            label: `emphasis: ${emphasis}`,
            cells: NPH_BADGE_SEVERITIES.map(
              (severity) => html`<nph-badge severity=${severity} emphasis=${emphasis} text=${d.sampleText}></nph-badge>`,
            ),
          })),
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
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
            ${table(d.severityUseHeader, d.severityUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const))}
            ${table(d.emphasisUseHeader, d.emphasisUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const))}
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

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </div>
    `;
  },
};
