/**
 * VALIDATION stories of `nph-table`.
 *
 * They prove the contract accepted in Figma (frame `2584:66651`, set `1370:113`) and P97:
 * the two sizes; the frame; the fixed header with its line; the stripe, the grid and the
 * hover of the row; the caption that names the table, with description, total and action,
 * the label of a table without a caption and the scroll area that becomes a focusable region
 * when the table does not fit; every composite cell with the piece it takes and the no-value
 * dash; the expanding row closed, open and loading; the tree in three levels, a treegrid with
 * the APG keyboard (P101); the two-level header; and the empty body with the header visible.
 * Every story shows the same tables in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67). The three required examples of the frame —
 * items grouped by category, an open order and a table with caption — are on the Docs page,
 * each in light and dark mode.
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a row and by
 * pressing Tab. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`). Every visible text comes from the language dictionary, under the
 * key `tableValidation` (`docs/i18n.md`, "Storybook"); the tables are built in
 * `nph-table.demo.ts`.
 *
 * The `Brands` page proves the seven brands of P20 in light and dark, each frame with `data-nph-brand`
 * and `data-nph-color-scheme` on the same element (DSA-36).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-table';
import type { NphTableColumn, NphTableRow } from './nph-table';
import {
  actionsTable,
  basicTable,
  captionTable,
  emptyTable,
  groupTable,
  inScheme,
  manyRows,
  orderTable,
  peopleTable,
  treeTable,
  wideCaptionTable,
} from './nph-table.demo';
import type { Sample, Scheme } from './nph-table.demo';

const meta: Meta = {
  title: 'Components/nph-table/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).tableValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const modesFrame = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-section);';

const page = (storyId: string) => ({
  piece: 'nph-table',
  storyId: `components-nph-table-validation--${storyId}`,
});

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: (sample: Sample) => TemplateResult): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  return validationPage(
    context,
    page(storyId),
    html`<div style=${modesFrame} aria-label=${validationTitle(context, 'nph-table', page(storyId).storyId)} role="group">
      ${modes.map(([scheme, caption]) => inScheme(scheme, caption, content(v.sample)))}
    </div>`,
  );
}

/** The two sizes: default and large. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) =>
    inBothModes(context, 'sizes', (s) => html`<div style=${stack}>${basicTable(s, { size: 'default' })} ${basicTable(s, { size: 'large' })}</div>`),
};

/** Without the frame and with it. */
export const Frame: Story = {
  name: 'Frame',
  render: (_args, context: GlobalsContext) =>
    inBothModes(context, 'frame', (s) => html`<div style=${stack}>${basicTable(s)} ${basicTable(s, { framed: true })}</div>`),
};

/** The fixed header over a long body, with the frame. */
export const StickyHeader: Story = {
  name: 'Sticky header',
  render: (_args, context: GlobalsContext) =>
    inBothModes(context, 'sticky-header', (s) => basicTable(s, { framed: true, sticky: true }, manyRows(s, 12))),
};

/** The stripe, the grid, and the hover of the row under the pointer. */
export const RowStates: Story = {
  name: 'Row states',
  render: (_args, context: GlobalsContext) =>
    inBothModes(
      context,
      'row-states',
      (s) => html`<div style=${stack}>
        <p style="margin: 0;">${t(context).hoverNote}</p>
        ${basicTable(s, { striped: true })} ${basicTable(s, { grid: true })} ${basicTable(s, { striped: true, grid: true, framed: true })}
      </div>`,
    ),
};

/** The caption with description, total and action; the label without a caption; the scroll area that takes the focus. */
export const Caption: Story = {
  name: 'Caption',
  render: (_args, context: GlobalsContext) =>
    inBothModes(
      context,
      'caption',
      (s) => html`<div style=${stack}>
        ${captionTable(s, true)} ${peopleTable(s)}
        <p style="margin: 0;">${t(context).focusNote}</p>
        ${wideCaptionTable(s)}
      </div>`,
    ),
};

/** Every composite cell and the no-value dash. */
export const CellContents: Story = {
  name: 'Cell contents',
  render: (_args, context: GlobalsContext) =>
    inBothModes(context, 'cell-contents', (s) => html`<div style=${stack}>${peopleTable(s)} ${actionsTable(s)}</div>`),
};

/** The expanding row: closed, open with the expanded item, and loading. */
export const ExpandingRow: Story = {
  name: 'Expanding row',
  render: (_args, context: GlobalsContext) => inBothModes(context, 'expanding-row', (s) => orderTable(s, ['closed', 'open', 'loading'])),
};

/** The tree in three levels, every level open: a treegrid with the APG keyboard (P101). */
export const Tree: Story = {
  name: 'Tree',
  render: (_args, context: GlobalsContext) => inBothModes(context, 'tree', (s) => treeTable(s, true)),
};

/** The two-level header. */
export const TwoLevelHeader: Story = {
  name: 'Two-level header',
  render: (_args, context: GlobalsContext) => inBothModes(context, 'two-level-header', (s) => groupTable(s)),
};

/** The empty body with the header visible. */
export const EmptyBody: Story = {
  name: 'Empty body',
  render: (_args, context: GlobalsContext) => inBothModes(context, 'empty-body', (s) => emptyTable(s)),
};

/** The seven brands in light and dark (DSA-36): the link of a cell and the focus ring on Tab follow the brand of the frame. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const s: Sample = t(context).sample;
    const columns: NphTableColumn[] = [
      { key: 'unit', header: s.unit },
      { key: 'document', header: s.document },
    ];
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-table', page('brands').storyId), ({ id }) => {
        const rows: NphTableRow[] = s.units.slice(0, 2).map((unit, index) => ({
          key: `unit-${index}`,
          cells: { unit, document: { type: 'link', text: s.receipt, href: `#receipt-${id}-${index}` } },
        }));
        return html`<nph-table label=${s.label} no-value-label=${s.noValue} .columns=${columns} .rows=${rows}></nph-table>`;
      }),
    );
  },
};
