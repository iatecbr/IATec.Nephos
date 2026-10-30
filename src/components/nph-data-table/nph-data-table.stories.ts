/**
 * VALIDATION stories of `nph-data-table`.
 *
 * They prove the contract accepted in Figma (documentation `2875:17577`, set `2633:69628`),
 * the decisions D-1 to D-6 of DSA-58 and P105: the four `estado` of the set in the two sizes;
 * the appearance it takes from `nph-table` (frame, fixed header, grid, stripe and the row that
 * opens); the sortable header in its four `ordenação`; the selection, the actions and the switch
 * column of the row; the footer in its three layouts and with a single page; the invalid input;
 * the three mandatory examples of the documentation; and the seven brands. Every story shows
 * the same tables in light and dark mode, in the same story, through `data-nph-color-scheme`
 * on the frame (P20, P67).
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a row and by
 * entering the table with Tab; the component test measures them. Each page opens with what it
 * proves, from the dictionary (`validationPages.claims`). The example text and the captions
 * come from the language dictionary, under the key `dataTableValidation` (`docs/i18n.md`,
 * "Storybook"); the row names of the matrices are the technical attributes, the same in any
 * language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { inScheme, peopleTable } from './nph-data-table.demo';
import type { DataTableText, Scheme } from './nph-data-table.demo';

const meta: Meta = {
  title: 'Components/nph-data-table/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).dataTableValidation;
}

function textOf(context: GlobalsContext | undefined): DataTableText {
  return t(context) as unknown as DataTableText;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';

const page = (storyId: string) => ({
  piece: 'nph-data-table',
  storyId: `components-nph-data-table-validation--${storyId}`,
});

/** The same demonstration in both modes, one under the other, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, content: () => TemplateResult, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  return html`<div style=${stack}>
    ${modes.map(([scheme, caption]) => inScheme(scheme, name === undefined ? caption : `${name} · ${caption}`, content()))}
  </div>`;
}

/** The four `estado` of the set in the two sizes. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    const states = ['default', 'bulk', 'empty', 'loading'] as const;
    return validationPage(
      context,
      page('matrix'),
      html`<div style=${stack}>
        ${(['default', 'large'] as const).map((size) =>
          inBothModes(
            context,
            () =>
              matrix(
                `nph-data-table · size: ${size}`,
                [],
                states.map((state) => ({ label: `state: ${state}`, cells: [peopleTable(text, { size, state })] })),
              ),
            `size: ${size}`,
          ),
        )}
      </div>`,
    );
  },
};

/** What it takes from nph-table: the frame, the fixed header, the grid, the stripe and the row that opens. */
export const Appearance: Story = {
  name: 'Appearance',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    return validationPage(
      context,
      page('appearance'),
      inBothModes(context, () =>
        matrix('nph-data-table', [], [
          { label: 'framed: off', cells: [peopleTable(text, { framed: false, toolbar: false, layout: 'none', records: 4 })] },
          { label: 'sticky-header', cells: [peopleTable(text, { stickyHeader: true, toolbar: false, layout: 'none' })] },
          { label: 'grid', cells: [peopleTable(text, { grid: true, toolbar: false, layout: 'none', records: 4 })] },
          { label: 'striped', cells: [peopleTable(text, { striped: true, toolbar: false, layout: 'none', records: 4 })] },
          { label: 'detail', cells: [peopleTable(text, { detail: true, toolbar: false, layout: 'none', records: 4 })] },
        ]),
      ),
    );
  },
};

/** The sortable header in its four `ordenação`, and a number column at the end. */
export const Header: Story = {
  name: 'Header',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    const plain = { toolbar: false, layout: 'none' as const, records: 4, selectable: false, withActions: false };
    return validationPage(
      context,
      page('header'),
      inBothModes(context, () =>
        matrix('nph-data-table', [], [
          { label: 'sort: none', cells: [peopleTable(text, plain)] },
          { label: 'sort: person ascending', cells: [peopleTable(text, { ...plain, sort: { key: 'person', direction: 'ascending' } })] },
          { label: 'sort: amount descending', cells: [peopleTable(text, { ...plain, sort: { key: 'amount', direction: 'descending' } })] },
        ]),
      ),
    );
  },
};

/** The pieces of the row: selection, the selected row, the switch column and the more. */
export const Rows: Story = {
  name: 'Rows',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    const plain = { toolbar: false, layout: 'none' as const, records: 4 };
    return validationPage(
      context,
      page('rows'),
      inBothModes(context, () =>
        matrix('nph-data-table', [], [
          { label: 'selectable', cells: [peopleTable(text, plain)] },
          { label: 'selected', cells: [peopleTable(text, { ...plain, state: 'bulk', striped: true })] },
          { label: 'switch-header', cells: [peopleTable(text, { ...plain, withSwitch: true, withUnit: false })] },
          { label: 'actions: none', cells: [peopleTable(text, { ...plain, withActions: false })] },
        ]),
      ),
    );
  },
};

/** The footer by the width of the space, and no footer with a single page. */
export const Footer: Story = {
  name: 'Footer',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    const plain = { toolbar: false, records: 12 };
    return validationPage(
      context,
      page('footer'),
      inBothModes(context, () =>
        matrix('nph-data-table', [], [
          { label: 'pagination-layout: wide', cells: [peopleTable(text, { ...plain, layout: 'wide' })] },
          { label: 'pagination-layout: middle', cells: [peopleTable(text, { ...plain, layout: 'middle' })] },
          { label: 'pagination-layout: narrow', cells: [peopleTable(text, { ...plain, layout: 'narrow' })] },
          { label: 'single page', cells: [peopleTable(text, { ...plain, layout: 'none', records: 4, total: true })] },
        ]),
      ),
    );
  },
};

/** Invalid input: each cell is one cause, with its own error in development. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const text = textOf(context);
    const columns = [{ key: 'person', header: v.person }];
    const rows = [{ key: 'one', name: v.people[0], cells: { person: v.people[0] } }];
    const cases: Array<[string, TemplateResult]> = [
      ['columns: empty', html`<nph-data-table caption=${v.caption} .rows=${rows}></nph-data-table>`],
      ['sort-direction: up', html`<nph-data-table caption=${v.caption} sort-key="person" sort-direction="up" .columns=${columns} .rows=${rows}></nph-data-table>`],
      [
        'selectable · select-all-label: empty',
        html`<nph-data-table caption=${v.caption} selectable select-label=${v.select} .columns=${columns} .rows=${rows}></nph-data-table>`,
      ],
      ['pagination-layout: auto', invalidFooter(text)],
    ];
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, () => matrix('nph-data-table', ['nph-data-table'], cases.map(([label, cell]) => ({ label, cells: [cell] })))),
    );
  },
};

/** A footer layout outside the list: the table draws and the footer is left out. */
function invalidFooter(text: DataTableText): TemplateResult {
  return html`<nph-data-table
    caption=${text.caption}
    pagination-layout="auto"
    pagination-label=${text.pagination}
    previous-label=${text.previous}
    next-label=${text.next}
    position-text=${text.position}
    .columns=${[{ key: 'person', header: text.person }]}
    .rows=${text.people.slice(0, 2).map((name, index) => ({ key: `p${index}`, name, cells: { person: name } }))}
    .pageSize=${5}
    .totalItems=${12}
  ></nph-data-table>`;
}

/** The three mandatory examples of the documentation, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const text = textOf(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, () => peopleTable(text, { sort: { key: 'person', direction: 'ascending' } }), v.exampleList)}
        ${inBothModes(context, () => peopleTable(text, { state: 'bulk' }), v.exampleSelected)}
        ${inBothModes(context, () => peopleTable(text, { state: 'empty' }), v.exampleEmpty)}
      </div>`,
    );
  },
};

/**
 * The seven brands in light and dark (DSA-36): the selected rows, whose background and mark
 * follow the brand, with a small table so every frame is in view for the contrast check.
 */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-data-table', page('brands').storyId), () =>
        peopleTable(text, { state: 'bulk', toolbar: false, layout: 'none', records: 3, withUnit: false, withActions: false }),
      ),
    );
  },
};
