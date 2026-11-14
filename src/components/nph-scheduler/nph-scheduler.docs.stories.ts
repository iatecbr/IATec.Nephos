/**
 * Reading page of `nph-scheduler`.
 *
 * It does not prove the contract — that is the role of `Components/nph-scheduler/Validation` and of
 * the tests. The content is transcribed from the documentation frame accepted in Figma (`6151:11160`),
 * from the spec sheet (`ficha`) and from P120; nothing is decided here. The page follows the order of
 * the `nph-badge` page: it opens with the labelled views, and the two "When to use" lists are the
 * ones of the sheet, read from its Metadata (P71). The API table has one row for each property,
 * label, event and slot of the Metadata, in its order. Usage shows the markup of the piece
 * and the properties and events through which the screen owns the data.
 *
 * The labelled matrix at the top is a stack of figures (`labelled` of the demo file), not the `matrix`
 * block: the region of a matrix scrolls sideways when it does not fit, and in a narrow viewport the
 * scheduler buttons it cuts fail the target size rule of the accessibility gate. The same reason
 * keeps the open event, whose popover takes the focus when it opens, out of this page: it has its
 * own Validation story.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `schedulerDocs` key;
 * the sample texts of the schedulers, the titles of the events and the names of the people come from
 * `schedulerValidation`. The story is SINGLE: it reads `globals.locale` and looks up the translation.
 * Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-scheduler';
import { PHONE_WIDTH, bothModes, examples, labelled, scheduler } from './nph-scheduler.demo';
import type { ExampleTexts } from './nph-scheduler.demo';
import { body, demo, header, index, list as bullets, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-scheduler.json';

const meta: Meta = {
  title: 'Components/nph-scheduler/Docs',
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
  views: 'views',
  event: 'event',
  states: 'states',
  keyboard: 'keyboard',
  relations: 'relations',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/**
 * Demo frame. Not a precedent for component CSS. The scheduler takes the width it is given and
 * becomes the compact month below 768 px, so every group of schedulers fills the width of the demo
 * area.
 */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack); inline-size: 100%;';
const fill = 'inline-size: 100%;';

/** The height of a scheduler on the page, shorter than the Validation pages, so the sections stay readable. */
const COMPACT_HEIGHT = '28rem';

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const d = translations(locale).schedulerDocs;
    const v = translations(locale).schedulerValidation as unknown as ExampleTexts & Record<string, unknown>;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const useRow = ({ value, label }: { value: string; label: string }) => [value, label] as const;
    const demoViews = html`<div style=${stack}>
      ${scheduler(v, { view: 'week', height: COMPACT_HEIGHT })} ${scheduler(v, { view: 'day', height: COMPACT_HEIGHT })}
      ${scheduler(v, { view: 'month', height: COMPACT_HEIGHT })} ${scheduler(v, { view: 'list', height: COMPACT_HEIGHT })}
      ${scheduler(v, { view: 'month', width: PHONE_WIDTH, height: '48rem', filter: false })}
    </div>`;
    const demoEvent = html`<div style=${stack}>
      ${scheduler(v, { view: 'week', hideSidePanel: true, height: COMPACT_HEIGHT })}
    </div>`;
    const demoStates = html`<div style=${stack}>
      ${scheduler(v, { events: [], height: COMPACT_HEIGHT })} ${scheduler(v, { loading: true, height: COMPACT_HEIGHT })}
    </div>`;

    return html`
      <div style=${body}>
        ${header('nph-scheduler', d.summary)}
        ${labelled([
          { label: 'view: work-week', content: scheduler(v, { height: COMPACT_HEIGHT }) },
          { label: 'view: month', content: scheduler(v, { view: 'month', height: COMPACT_HEIGHT }) },
          { label: `size: phone · width: ${PHONE_WIDTH}`, content: scheduler(v, { view: 'month', width: PHONE_WIDTH, height: '48rem', filter: false }) },
        ])}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.views, title: d.viewsTitle },
          { id: SECTIONS.event, title: d.eventTitle },
          { id: SECTIONS.states, title: d.statesTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-scheduler'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.views,
          d.viewsTitle,
          html`
            ${demo(demoViews, d.viewsCaption)}
            ${table(d.viewsUseHeader, d.viewsUse.map(useRow), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.event,
          d.eventTitle,
          html`
            ${demo(demoEvent, d.eventCaption)}
            ${table(d.eventUseHeader, d.eventUse.map(useRow), 'text')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${demo(demoStates, d.statesCaption)}
            ${table(d.statesUseHeader, d.statesUse.map(useRow), 'auto')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.keyboard,
          d.keyboardTitle,
          html`${table(d.keyboardHeader, d.keyboard.map(pair), 'text')} ${source(d.sourceLabel, d.sourceSpec)}`,
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
          html`${table(d.accessibilityHeader, d.accessibility.map(pair), 'text')} ${source(d.sourceLabel, d.sourceSpec)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(
              html`<div style=${fill}>
                ${bothModes({ light: d.lightCaption as string, dark: d.darkCaption as string }, (): TemplateResult => examples(v))}
              </div>`,
              d.examplesCaption,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, bullets(d.references))}
      </div>
    `;
  },
};
