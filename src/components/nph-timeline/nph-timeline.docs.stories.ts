/**
 * Reading page of `nph-timeline`.
 *
 * It does not prove the contract — that is the role of `Components/nph-timeline/Validation` and of the tests. The content
 * is transcribed from the documentation frame accepted in Figma (`5237:3423`), from the evidence of the
 * `figma-docs-accepted` gate of DSA-89, from the spec sheet (`ficha`) and from the behavior of the code (P132); nothing
 * is decided here. The page follows the order of the `nph-badge` page: it opens with the labelled matrix of the two
 * types, and the two "When to use" lists are the ones of the sheet, read from its Metadata (P71). Usage shows the
 * markup of the timeline and the property that carries the events.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `timelineDocs` key; the sample texts of
 * the lists come from `timelineValidation`. The story is SINGLE: it reads `globals.locale` and looks up the translation.
 * Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-timeline';
import {
  NARROW_WIDTH,
  WIDE_WIDTH,
  bothModes,
  contentRows,
  examples,
  historyItems,
  personExample,
  processItems,
  stateItems,
  timeline,
} from './nph-timeline.demo';
import type { TimelineTexts } from './nph-timeline.demo';
import { body, demo, header, index, list as bullets, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-timeline.json';

const meta: Meta = {
  title: 'Components/nph-timeline/Docs',
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
  types: 'types',
  markers: 'markers',
  content: 'content',
  loadingAndMore: 'loading-and-more',
  keyboard: 'keyboard',
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
    const d = translations(locale).timelineDocs;
    const v = translations(locale).timelineValidation as unknown as TimelineTexts;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const row = (label: string) => contentRows(v).find((entry) => entry.label === label) as ReturnType<typeof contentRows>[number];
    const demoTypes = html`${timeline(v, { items: processItems(v, 4), type: 'process', width: NARROW_WIDTH })}
    ${timeline(v, { items: historyItems(v, 4), type: 'history', width: NARROW_WIDTH })}`;
    const demoMarkers = html`${timeline(v, { items: stateItems(v), type: 'process', width: NARROW_WIDTH })}
    ${timeline(v, { items: historyItems(v, 3), type: 'history', width: NARROW_WIDTH })} ${personExample(v, NARROW_WIDTH)}`;
    const demoContent = html`<div style=${stack}>
      ${(['description: on', 'action: on · state: disabled', 'slot: nph-card · type: base', 'slot: nph-card · type: section · action: on'] as const).map(
        (label) => {
          const { items, slotted } = row(label);
          return timeline(v, { items, type: 'process', width: WIDE_WIDTH, ...(slotted === undefined ? {} : { slotted }) });
        },
      )}
    </div>`;
    const demoLoading = html`${timeline(v, { items: historyItems(v, 3), type: 'history', hasMore: true, width: NARROW_WIDTH })}
    ${timeline(v, { items: [], type: 'history', loading: true, width: NARROW_WIDTH })}
    ${timeline(v, { items: [], type: 'history', width: NARROW_WIDTH })}`;

    return html`
      <main style=${body}>
        ${header('nph-timeline', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: 'type: process', cells: [timeline(v, { items: processItems(v, 3), type: 'process', width: WIDE_WIDTH })] },
            { label: 'type: history', cells: [timeline(v, { items: historyItems(v, 3), type: 'history', width: WIDE_WIDTH })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.types, title: d.typesTitle },
          { id: SECTIONS.markers, title: d.markersTitle },
          { id: SECTIONS.content, title: d.contentTitle },
          { id: SECTIONS.loadingAndMore, title: d.loadingTitle },
          { id: SECTIONS.keyboard, title: d.keyboardTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-timeline'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.types,
          d.typesTitle,
          html`
            ${demo(demoTypes, d.typesCaption)}
            ${table(d.typesUseHeader, d.typesUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${bullets(d.types)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.markers,
          d.markersTitle,
          html`
            ${demo(demoMarkers, d.markersCaption)}
            ${table(d.markersUseHeader, d.markersUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${bullets(d.markers)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.content,
          d.contentTitle,
          html`
            ${demo(demoContent, d.contentCaption)}
            ${bullets(d.content)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.loadingAndMore,
          d.loadingTitle,
          html`
            ${demo(demoLoading, d.loadingCaption)}
            ${bullets(d.loading)}
            ${source(d.sourceLabel, d.sourceBehavior)}
          `,
        )}

        ${section(
          SECTIONS.keyboard,
          d.keyboardTitle,
          html`${table(d.keyboardHeader, d.keyboard.map(pair), 'text')} ${source(d.sourceLabel, d.sourceBehavior)}`,
        )}

        ${section(
          SECTIONS.relations,
          d.relationsTitle,
          html`${bullets(d.relations)} ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAnatomy)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${table(d.accessibilityHeader, d.accessibility.map(pair), 'text')} ${source(d.sourceLabel, d.sourceBehavior)}`,
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

        ${section(SECTIONS.references, d.referencesTitle, bullets(d.references))}
      </main>
    `;
  },
};
