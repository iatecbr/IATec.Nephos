/**
 * Reading page of `nph-hover-card`.
 *
 * It does not prove the contract — that is the role of `Components/nph-hover-card/Validation` and
 * of the tests. The content is transcribed from the documentation frame accepted in Figma
 * (`4422:2418`), from the spec sheet (`ficha`) and from P112; nothing is decided here. The page
 * follows the order of the `nph-badge` page: it opens with the labelled matrix of the arrow and the
 * sides, and the two "When to use" lists are the ones of the sheet, read from its Metadata (P71).
 * Usage shows the markup of the link, the card and the slot of its media.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `hoverCardDocs`
 * key; the sample texts of the cards come from `hoverCardValidation`. The story is SINGLE: it reads
 * `globals.locale` and looks up the translation. Technical identifiers appear literally and are the
 * same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-hover-card';
import { bothModes, card, examples, inSentence, metaKind } from './nph-hover-card.demo';
import type { ExampleTexts } from './nph-hover-card.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-hover-card.json';

const meta: Meta = {
  title: 'Components/nph-hover-card/Docs',
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
  sides: 'sides',
  metaLine: 'meta-line',
  behavior: 'behavior',
  relations: 'relations',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/** Demo frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const d = translations(locale).hoverCardDocs;
    const v = translations(locale).hoverCardValidation as unknown as ExampleTexts;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const demoSides = html`<div style=${stack}>
      ${card(v, { side: 'bottom' })} ${card(v, { side: 'bottom', arrow: true })} ${card(v, { side: 'top', arrow: true })}
    </div>`;
    const demoMeta = html`<div style=${stack}>
      ${metaKind(v, 'phrase')} ${metaKind(v, 'date')} ${metaKind(v, 'off')}
    </div>`;

    return html`
      <div style=${body}>
        ${header('nph-hover-card', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: 'arrow: off · side: bottom', cells: [card(v, { side: 'bottom' })] },
            { label: 'arrow: on · side: bottom', cells: [card(v, { side: 'bottom', arrow: true })] },
            { label: 'arrow: on · side: top', cells: [card(v, { side: 'top', arrow: true })] },
            { label: 'arrow: on · side: left', cells: [card(v, { side: 'left', arrow: true })] },
            { label: 'arrow: on · side: right', cells: [card(v, { side: 'right', arrow: true })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.sides, title: d.sidesTitle },
          { id: SECTIONS.metaLine, title: d.metaLineTitle },
          { id: SECTIONS.behavior, title: d.behaviorTitle },
          { id: SECTIONS.relations, title: d.relationsTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${sheetUseDontUse(metadata, locale, d)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(pair))} ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-hover-card'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.sides,
          d.sidesTitle,
          html`
            ${demo(demoSides, d.sidesCaption)}
            ${table(d.sidesUseHeader, d.sidesUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.metaLine,
          d.metaLineTitle,
          html`
            ${demo(demoMeta, d.metaLineCaption)}
            ${list(d.metaLine)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.behavior,
          d.behaviorTitle,
          html`
            ${demo(inSentence(v), d.behaviorCaption)}
            ${list(d.behavior)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.relations,
          d.relationsTitle,
          html`${list(d.relations)} ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAnatomy)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${table(d.accessibilityHeader, d.accessibility.map(pair), 'text')} ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(
              bothModes({ light: d.lightCaption as string, dark: d.darkCaption as string }, (): TemplateResult => examples(v)),
              d.examplesCaption,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </div>
    `;
  },
};
