/**
 * VALIDATION stories of `nph-pagination`.
 *
 * They prove the contract accepted in Figma (page `NPH — Pagination`, documentation
 * `1640:196`, set `1640:194`), the pending decisions D-1 to D-5 of DSA-54 in their default and
 * P99: the `type` × position matrix, with the current page, the disabled arrows and the
 * ellipsis; go to page beside the bar with first and last; the invalid input; and the three
 * required examples of the board — data table footer in the middle of the list, search result
 * on the first page and card header on the last page. Every story shows the same pieces in
 * light and in dark mode, in the same story, through `data-nph-color-scheme` on the frame
 * (P20, P67).
 *
 * Hover, focus and the balloon are interaction states: they show up by moving the mouse over
 * a number or an arrow and pressing Tab; the component tests measure them. Each page opens
 * with what it proves, from the dictionary (`validationPages.claims`). The text the piece
 * receives and the captions come from the language dictionary, under the key
 * `paginationValidation` (`docs/i18n.md`, "Storybook"); the row and column names of the matrix
 * are the technical attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { NPH_PAGINATION_TYPES } from './nph-pagination';
import { bar, cardHeader, inScheme, searchResult, tableFooter } from './nph-pagination.demo';
import type { ExampleText, PaginationLabels, Scheme } from './nph-pagination.demo';

const meta: Meta = {
  title: 'Components/nph-pagination/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).paginationValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';

const page = (storyId: string) => ({
  piece: 'nph-pagination',
  storyId: `components-nph-pagination-validation--${storyId}`,
});

/** What a story draws in one mode; the caption names the mode and, when given, the example. */
type ModeContent = (title: string) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: ModeContent, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  const title = validationTitle(context, 'nph-pagination', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

const labelsOf = (context: GlobalsContext | undefined): PaginationLabels => t(context).labels as PaginationLabels;

/** The position in a list of ten pages: the start, the middle and the end. */
const POSITIONS: Array<[string, number]> = [
  ['page: 1', 1],
  ['page: 5', 5],
  ['page: 10', 10],
];

/** `type` × position: the six types at the start, in the middle and at the end of ten pages. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const labels = labelsOf(context);
    return validationPage(
      context,
      page('matrix'),
      html`<div style=${stack}>
        ${inBothModes(context, 'matrix', (label) =>
          matrix(
            label,
            POSITIONS.map(([name]) => name),
            NPH_PAGINATION_TYPES.map((type) => ({
              label: `type: ${type}`,
              cells: POSITIONS.map(([, position]) => bar(labels, { type, page: position })),
            })),
          ),
        )}
      </div>`,
    );
  },
};

/** Go to page beside the bar with first and last, in the middle of the list. */
export const GoToPage: Story = {
  name: 'Go to page',
  render: (_args, context: GlobalsContext) => {
    const labels = labelsOf(context);
    return validationPage(
      context,
      page('go-to-page'),
      inBothModes(context, 'go-to-page', () => bar(labels, { type: 'edges', page: 5, goToPage: true })),
    );
  },
};

/** Invalid input draws nothing: each cell is one cause, with its own error in development. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const labels = labelsOf(context);
    const cases: Array<[string, TemplateResult]> = [
      ['type: pager', bar(labels, { raw: { type: 'pager' } })],
      ['page-count, total-items: none', bar(labels, { raw: { totalItems: null } })],
      ['type: numbered · go-to-page', bar(labels, { goToPage: true })],
      ['type: edges · last-label: empty', bar(labels, { type: 'edges', raw: { lastLabel: '' } })],
    ];
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, 'invalid-input', (label) =>
        matrix(label, ['nph-pagination'], cases.map(([name, cell]) => ({ label: name, cells: [cell] }))),
      ),
    );
  },
};

/** The three required examples of the board, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const text = v as unknown as ExampleText;
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, 'examples', () => tableFooter(text), v.exampleTable)}
        ${inBothModes(context, 'examples', () => searchResult(text), v.exampleSearch)}
        ${inBothModes(context, 'examples', () => cardHeader(text), v.exampleCard)}
      </div>`,
    );
  },
};
