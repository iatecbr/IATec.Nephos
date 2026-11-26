/**
 * VALIDATION stories of `nph-tree-table`.
 *
 * They prove the contract accepted in Figma (documentation `7812:13461`, sets `7617:6784` and
 * `7604:167`), the decisions D-1 and D-2 of DSA-102 and P141: the three `estado` of the set in the two
 * sizes; the rows of the tree in their states (open, closed, leaf, partial parent, selected, loading and
 * the branch that came back with nothing); the branch error row at both levels, with and without the
 * selection space; the long text cut to one line; the three mandatory examples of the documentation; and
 * the seven brands. Every story shows the same tables in light and dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a row and by entering the
 * table with Tab; the component test measures them. The load is played by the demonstration, which
 * answers the first load of East Region with a failure and Try again with its cities. Each page
 * opens with what it proves, from the dictionary (`validationPages.claims`). The example text and the
 * captions come from the language dictionary, under the key `treeTableValidation` (`docs/i18n.md`,
 * "Storybook"); the row names of the matrices are the technical attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { inScheme, regionsTable } from './nph-tree-table.demo';
import type { Scheme, TreeTableText } from './nph-tree-table.demo';

const meta: Meta = {
  title: 'Components/nph-tree-table/Validation',
};
export default meta;
type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).treeTableValidation;
}

function textOf(context: GlobalsContext | undefined): TreeTableText {
  return t(context) as unknown as TreeTableText;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';


/**
 * The tables of a story, one under the other, each with its label above it. The label is not a column
 * beside the table: a wide table takes the whole width, with no padding for the title.
 */
function tables(rows: ReadonlyArray<{ label: string; cells: readonly TemplateResult[] }>): TemplateResult {
  const label =
    'color: var(--nph-color-muted-foreground); font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height);';
  return html`<div style=${stack}>
    ${rows.map(
      (row) => html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline-tight); min-inline-size: 0;">
        <span style=${label}>${row.label}</span>
        ${row.cells}
      </div>`,
    )}
  </div>`;
}

const page = (storyId: string) => ({
  piece: 'nph-tree-table',
  storyId: `components-nph-tree-table-validation--${storyId}`,
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

/** The three `estado` of the set in the two sizes. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    const states = ['default', 'loading', 'empty'] as const;
    return validationPage(
      context,
      page('matrix'),
      html`<div style=${stack}>
        ${(['default', 'large'] as const).map((size) =>
          inBothModes(
            context,
            () =>
              tables(states.map((state) => ({
                  label: `state: ${state}`,
                  cells: [regionsTable(text, { size, state, layout: state === 'default' ? 'middle' : 'none', toolbar: state !== 'loading' })],
                })),
              ),
            `size: ${size}`,
          ),
        )}
      </div>`,
    );
  },
};

/** The rows of the tree: open, closed, leaf, partial, selected, loading, the empty branch and the failed one. */
export const Rows: Story = {
  name: 'Rows',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    const plain = { toolbar: false, layout: 'none' as const, withActions: false };
    return validationPage(
      context,
      page('rows'),
      inBothModes(context, () =>
        tables([
          { label: 'partial · selected · loading · error row', cells: [regionsTable(text, plain)] },
          { label: 'selectable: off', cells: [regionsTable(text, { ...plain, selectable: false, selected: [] })] },
          { label: 'selected: none', cells: [regionsTable(text, { ...plain, selected: [] })] },
          { label: 'east: loading', cells: [regionsTable(text, { ...plain, east: 'loading', washington: 'closed' })] },
          { label: 'east: loaded', cells: [regionsTable(text, { ...plain, east: 'loaded', washington: 'closed', selected: [] })] },
        ]),
      ),
    );
  },
};

/** The branch error row at the level of the children, with and without the selection space. */
export const ErrorRow: Story = {
  name: 'Error row',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    const plain = { toolbar: false, layout: 'none' as const, withActions: false, selected: [] as string[] };
    return validationPage(
      context,
      page('error-row'),
      html`<div style=${stack}>
        ${(['default', 'large'] as const).map((size) =>
          inBothModes(
            context,
            () =>
              tables([
                { label: 'level: 2 · selection: on', cells: [regionsTable(text, { ...plain, size, east: 'failed', washington: 'closed' })] },
                { label: 'level: 3 · selection: on', cells: [regionsTable(text, { ...plain, size, washington: 'failed' })] },
                { label: 'selection: off', cells: [regionsTable(text, { ...plain, size, east: 'failed', washington: 'closed', selectable: false })] },
              ]),
            `size: ${size}`,
          ),
        )}
      </div>`,
    );
  },
};

/** The footer counts only the rows of the first level, and a single page draws no footer. */
export const Footer: Story = {
  name: 'Footer',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    return validationPage(
      context,
      page('footer'),
      inBothModes(context, () =>
        tables([
          { label: 'pagination-layout: middle', cells: [regionsTable(text, { toolbar: false, layout: 'middle' })] },
          { label: 'single page', cells: [regionsTable(text, { toolbar: false, layout: 'none' })] },
        ]),
      ),
    );
  },
};

/** Invalid input: each cell is one cause, with its own message in development. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const p = v.places;
    const columns = [{ key: 'unit', header: v.unit }];
    const city = (key: string, name: string) => ({ key, name, cells: { unit: name } });
    const fourLevels = [
      {
        ...city('west', p.west),
        open: true,
        toggleLabel: v.open.replaceAll('{name}', p.west),
        children: [
          {
            ...city('oregon', p.oregon),
            open: true,
            toggleLabel: v.open.replaceAll('{name}', p.oregon),
            children: [{ ...city('portland', p.portland), open: true, toggleLabel: v.open.replaceAll('{name}', p.portland), children: [city('fourth', p.salem)] }],
          },
        ],
      },
    ];
    const noToggleName = [{ ...city('west', p.west), open: true, children: [city('oregon', p.oregon)] }];
    const noErrorText = [{ ...city('west', p.west), branch: true, error: true, open: true, toggleLabel: v.open.replaceAll('{name}', p.west) }];
    const cases: Array<[string, TemplateResult]> = [
      ['four levels', html`<nph-tree-table caption=${v.caption} .columns=${columns} .rows=${fourLevels}></nph-tree-table>`],
      ['row without toggleLabel', html`<nph-tree-table caption=${v.caption} .columns=${columns} .rows=${noToggleName}></nph-tree-table>`],
      [
        'error row without error-text and retry-text',
        html`<nph-tree-table caption=${v.caption} .columns=${columns} .rows=${noErrorText}></nph-tree-table>`,
      ],
    ];
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, () => tables(cases.map(([label, cell]) => ({ label, cells: [cell] })))),
    );
  },
};

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
        ${inBothModes(context, () => regionsTable(text), v.exampleUnits)}
        ${inBothModes(context, () => regionsTable(text, { size: 'large', state: 'empty', layout: 'none' }), v.exampleEmpty)}
        ${inBothModes(context, () => regionsTable(text, { size: 'large', state: 'loading', toolbar: false, layout: 'none' }), v.exampleLoading)}
      </div>`,
    );
  },
};

/**
 * The seven brands in light and dark (DSA-36): the selected rows, the focus and the error row follow the
 * brand, in a small table so every frame is in view for the contrast check.
 */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-tree-table', page('brands').storyId), () =>
        regionsTable(text, { toolbar: false, layout: 'none', withActions: false, east: 'failed', washington: 'closed' }),
      ),
    );
  },
};
