/**
 * Reading page of `nph-tree`.
 *
 * It does not prove the contract — that is the role of `Components/nph-tree/Validation` and of the
 * tests. The content is transcribed from the documentation frame accepted in Figma (`5876:216753`),
 * from the spec sheet (`ficha`) and from P118; nothing is decided here. The page follows the order of
 * the `nph-badge` page: it opens with the labelled matrix of the three selections and the two "When to
 * use" lists are the ones of the sheet, read from its Metadata (P71). Usage shows the markup of the tree
 * and the property that carries the nodes.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `treeDocs` key; the
 * sample texts of the trees come from `treeValidation`. The story is SINGLE: it reads
 * `globals.locale` and looks up the translation. Technical identifiers appear literally and are the
 * same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-tree';
import {
  MATRIX_WIDTH,
  NARROW_WIDTH,
  bothModes,
  branchIds,
  examples,
  fileNodes,
  inCard,
  loadNodes,
  longNodes,
  permissionNodes,
  tree,
} from './nph-tree.demo';
import type { ExampleTexts } from './nph-tree.demo';
import { body, demo, header, index, list as bullets, matrix, note, section, source, table, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-tree.json';

const meta: Meta = {
  title: 'Components/nph-tree/Docs',
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
  selection: 'selection',
  loading: 'loading',
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
    const d = translations(locale).treeDocs;
    const v = translations(locale).treeValidation as unknown as ExampleTexts & Record<string, unknown>;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const files = fileNodes(v);
    const areas = permissionNodes(v);
    const demoSelection = html`<div style=${stack}>
      ${inCard(tree(v, { items: files, expanded: ['documents'], icons: true, width: MATRIX_WIDTH }))}
      ${inCard(tree(v, { items: files, selection: 'single', selected: 'reports', expanded: ['documents'], icons: true, width: MATRIX_WIDTH }))}
      ${inCard(tree(v, { items: areas, selection: 'multiple', checked: ['leads', 'tickets', 'chat'], expanded: branchIds(areas), label: v.permissionsLabel, width: MATRIX_WIDTH }))}
    </div>`;
    const demoLoading = html`<div style=${stack}>
      ${inCard(tree(v, { items: [], loading: true, width: MATRIX_WIDTH }))}
      ${inCard(tree(v, { items: loadNodes(v), expanded: ['shared-drive', 'backups'], icons: true, width: MATRIX_WIDTH }))}
      ${inCard(tree(v, { items: [], width: MATRIX_WIDTH }))}
      ${inCard(tree(v, { items: longNodes(v), expanded: ['long-folder'], icons: true, width: NARROW_WIDTH }))}
    </div>`;

    return html`
      <div style=${body}>
        ${header('nph-tree', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          [
            { label: 'selection: none', cells: [inCard(tree(v, { items: files, expanded: ['documents'], icons: true, width: MATRIX_WIDTH }))] },
            {
              label: 'selection: single',
              cells: [inCard(tree(v, { items: files, selection: 'single', selected: 'reports', expanded: ['documents'], icons: true, width: MATRIX_WIDTH }))],
            },
            {
              label: 'selection: multiple',
              cells: [inCard(tree(v, { items: areas, selection: 'multiple', checked: ['leads', 'tickets', 'chat'], expanded: branchIds(areas), label: v.permissionsLabel, width: MATRIX_WIDTH }))],
            },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.selection, title: d.selectionTitle },
          { id: SECTIONS.loading, title: d.loadingTitle },
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-tree'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.selection,
          d.selectionTitle,
          html`
            ${demo(demoSelection, d.selectionCaption)}
            ${table(d.selectionUseHeader, d.selectionUse.map(({ value, label }: { value: string; label: string }) => [value, label] as const), 'code')}
            ${bullets(d.selectionRules)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.loading,
          d.loadingTitle,
          html`
            ${demo(demoLoading, d.loadingCaption)}
            ${bullets(d.loading)}
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
