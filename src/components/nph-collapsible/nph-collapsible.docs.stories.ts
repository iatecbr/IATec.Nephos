/**
 * Reading page of `nph-collapsible`.
 *
 * It does not prove the contract — that is the role of `Components/nph-collapsible/Validation` and of the
 * tests. The content is transcribed from the documentation frame accepted in Figma (`6014:1688`), from
 * the spec sheet (`ficha`) and from P121; nothing is decided here. The page follows the order of the
 * `nph-badge` page: it opens with the labelled matrix of the three types and the two "When to use" lists
 * are the ones of the sheet, read from its Metadata (P71). Usage shows the markup of the piece and the
 * content that goes in its slot.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `collapsibleDocs` key;
 * the sample texts of the pieces come from `collapsibleValidation`. The story is SINGLE: it reads
 * `globals.locale` and looks up the translation. Technical identifiers appear literally and are the same
 * in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-collapsible';
import { DISABLED_CONTENT_EXCEPTION, bothModes, collapsible, examples, logContent, stack } from './nph-collapsible.demo';
import type { ExampleTexts } from './nph-collapsible.demo';
import { body, demo, header, index, list as bullets, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-collapsible.json';

const meta: Meta = {
  title: 'Components/nph-collapsible/Docs',
  parameters: {
    layout: 'fullscreen',
    ...DISABLED_CONTENT_EXCEPTION,
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
  variants: 'variants',
  behavior: 'behavior',
  keyboard: 'keyboard',
  relations: 'relations',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/** Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const d = translations(locale).collapsibleDocs;
    const v = translations(locale).collapsibleValidation as unknown as ExampleTexts & Record<string, unknown>;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const demoTypes = html`<div style=${column}>
      ${collapsible(v, { open: true, description: v.support })} ${collapsible(v, { type: 'button', open: true })}
      ${collapsible(v, { type: 'preview', content: logContent(v) })}
    </div>`;
    const demoVariants = html`<div style=${column}>
      ${collapsible(v, { appearance: 'card', open: true, description: v.support })}
      ${collapsible(v, { size: 'compact' })} ${collapsible(v, { size: 'large' })}
      ${collapsible(v, { indicator: 'start', icon: 'gear', open: true })}
    </div>`;
    const demoBehavior = html`<div style=${column}>${stack(v)} ${collapsible(v, { disabled: true, open: true })}</div>`;

    return html`
      <div style=${body}>
        ${header('nph-collapsible', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: 'type: line · open: yes', cells: [collapsible(v, { open: true })] },
            { label: 'type: button · open: no', cells: [collapsible(v, { type: 'button' })] },
            { label: 'type: preview · open: no', cells: [collapsible(v, { type: 'preview', content: logContent(v) })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.types, title: d.typesTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
          { id: SECTIONS.behavior, title: d.behaviorTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-collapsible'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.types,
          d.typesTitle,
          html`
            ${demo(demoTypes, d.typesCaption)}
            ${table(d.typesUseHeader, d.typesUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.variants,
          d.variantsTitle,
          html`
            ${demo(demoVariants, d.variantsCaption)}
            ${bullets(d.variants)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.behavior,
          d.behaviorTitle,
          html`
            ${demo(demoBehavior, d.behaviorCaption)}
            ${bullets(d.behavior)}
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
