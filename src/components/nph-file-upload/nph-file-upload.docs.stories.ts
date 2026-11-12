/**
 * Reading page of `nph-file-upload`.
 *
 * It does not prove the contract — that is the role of `Components/nph-file-upload/Validation` and of
 * the tests. The content is transcribed from the documentation frame accepted in Figma (`5311:8328`),
 * from the spec sheet (`ficha`) and from P119; nothing is decided here. The page follows the order of
 * the `nph-badge` page: it opens with the labelled matrix of the states and the two "When to use"
 * lists are the ones of the sheet, read from its Metadata (P71). Usage shows the markup of the zone and
 * the properties and events through which the page owns the list.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `fileUploadDocs` key;
 * the sample texts of the zones come from `fileUploadValidation`. The story is SINGLE: it reads
 * `globals.locale` and looks up the translation. Technical identifiers appear literally and are the
 * same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-file-upload';
import {
  COMPACT_WIDTH,
  bothModes,
  examples,
  imageFiles,
  inField,
  inUseFiles,
  limitFiles,
  longFiles,
  statusFiles,
  upload,
} from './nph-file-upload.demo';
import type { ExampleTexts } from './nph-file-upload.demo';
import { body, demo, header, index, list as bullets, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-file-upload.json';

const meta: Meta = {
  title: 'Components/nph-file-upload/Docs',
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
  states: 'states',
  items: 'items',
  choice: 'choice',
  width: 'width',
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
    const d = translations(locale).fileUploadDocs;
    const v = translations(locale).fileUploadValidation as unknown as ExampleTexts & Record<string, unknown>;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const demoStates = html`<div style=${stack}>
      ${upload(v)} ${upload(v, { error: v.typeError })} ${upload(v, { files: limitFiles(v), maxFiles: 5 })} ${upload(v, { disabled: true })}
    </div>`;
    const demoItems = html`<div style=${stack}>${upload(v, { files: statusFiles(v) })} ${upload(v, { files: imageFiles(v).slice(0, 3) })}</div>`;
    const demoChoice = html`<div style=${stack}>${inField(v, { files: inUseFiles(v) })}</div>`;
    const demoWidth = html`<div style=${stack}>
      ${upload(v, { format: 'compact', width: COMPACT_WIDTH })} ${upload(v, { format: 'compact' })} ${upload(v, { files: longFiles(v), width: '24rem' })}
    </div>`;

    return html`
      <div style=${body}>
        ${header('nph-file-upload', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: 'state: empty', cells: [upload(v)] },
            { label: 'state: error', cells: [upload(v, { error: v.typeError })] },
            { label: 'state: limit', cells: [upload(v, { files: limitFiles(v), maxFiles: 5 })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.items, title: d.itemsTitle },
          { id: SECTIONS.choice, title: d.choiceTitle },
          { id: SECTIONS.width, title: d.widthTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-file-upload'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${demo(demoStates, d.statesCaption)}
            ${table(d.statesUseHeader, d.statesUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.items,
          d.itemsTitle,
          html`
            ${demo(demoItems, d.itemsCaption)}
            ${table(d.itemsUseHeader, d.itemsUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.choice,
          d.choiceTitle,
          html`
            ${demo(demoChoice, d.choiceCaption)}
            ${bullets(d.choice)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.width,
          d.widthTitle,
          html`
            ${demo(demoWidth, d.widthCaption)}
            ${bullets(d.width)}
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
              bothModes({ light: d.lightCaption as string, dark: d.darkCaption as string }, (): TemplateResult => examples(v)),
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
