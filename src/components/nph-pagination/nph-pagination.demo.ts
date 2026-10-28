/**
 * Demonstration frame shared by the `nph-pagination` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index
 * it. The scenery here — the card, the list, the gaps — is NOT a precedent for component CSS:
 * the piece takes every measure from tokens.
 *
 * The three examples are the required ones of the accepted board (`1640:196`): "data table
 * footer, in the middle of the list", "search result, on the first page" and "card header, on
 * the last page". The functions take the visible text as arguments: this file holds none,
 * because every visible text comes from the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-table/nph-table';
import './nph-pagination';
import type { NphTableColumn, NphTableRow } from '../nph-table/nph-table';
import type { NphPaginationType } from './nph-pagination';

export type Scheme = 'light' | 'dark';

/** The text the piece receives, already localized: names, balloons and position templates. */
export interface PaginationLabels {
  label: string;
  page: string;
  first: string;
  previous: string;
  next: string;
  last: string;
  previousText: string;
  nextText: string;
  pageOf: string;
  short: string;
  range: string;
  pageSize: string;
  goTo: string;
}

/** The text of the three examples. */
export interface ExampleText {
  labels: PaginationLabels;
  table: { label: string; columns: string[]; rows: string[][] };
  search: { title: string; results: string[] };
  card: { title: string; items: string[] };
}

/** What a demonstration bar shows. The list has ten pages of 25 items, as in the board. */
export interface BarOptions {
  type?: NphPaginationType;
  page?: number;
  goToPage?: boolean;
  /** Overrides, for the invalid input demonstrations. */
  raw?: Record<string, unknown>;
}

export const TOTAL_ITEMS = 250;
export const PAGE_SIZE = 25;
export const PAGE_SIZES = [10, 25, 50, 100];

/** The position template each type shows. */
function positionFor(type: NphPaginationType, labels: PaginationLabels): string {
  if (type === 'simple') return labels.pageOf;
  if (type === 'compact') return labels.short;
  if (type === 'range' || type === 'table') return labels.range;
  return '';
}

/** One bar, with the text of the dictionary. */
export function bar(labels: PaginationLabels, options: BarOptions = {}): TemplateResult {
  const type = options.type ?? 'numbered';
  const written = type === 'numbered';
  const props = {
    type,
    page: options.page ?? 1,
    totalItems: TOTAL_ITEMS,
    pageSize: PAGE_SIZE,
    pageSizes: type === 'table' ? PAGE_SIZES : [],
    goToPage: options.goToPage ?? false,
    label: labels.label,
    pageLabel: labels.page,
    firstLabel: labels.first,
    previousLabel: written ? labels.previousText : labels.previous,
    nextLabel: written ? labels.nextText : labels.next,
    lastLabel: labels.last,
    positionText: positionFor(type, labels),
    pageSizeLabel: labels.pageSize,
    goToLabel: labels.goTo,
    ...options.raw,
  };
  return html`<nph-pagination
    .type=${props.type}
    .page=${props.page}
    .totalItems=${props.totalItems}
    .pageSize=${props.pageSize}
    .pageSizes=${props.pageSizes}
    .goToPage=${props.goToPage}
    .label=${props.label}
    .pageLabel=${props.pageLabel}
    .firstLabel=${props.firstLabel}
    .previousLabel=${props.previousLabel}
    .nextLabel=${props.nextLabel}
    .lastLabel=${props.lastLabel}
    .positionText=${props.positionText}
    .pageSizeLabel=${props.pageSizeLabel}
    .goToLabel=${props.goToLabel}
    .pageCount=${(props as { pageCount?: number }).pageCount ?? null}
  ></nph-pagination>`;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', captions.light],
    ['dark', captions.dark],
  ];
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}
  </div>`;
}

const column = 'display: flex; flex-direction: column; gap: var(--nph-space-inline);';

/** Data table footer, in the middle of the list: the table type below an nph-table. */
export function tableFooter(text: ExampleText): TemplateResult {
  const columns: NphTableColumn[] = text.table.columns.map((header, index) => ({ key: `c${index}`, header }));
  const rows: NphTableRow[] = text.table.rows.map((cells, index) => ({
    key: `r${index}`,
    cells: Object.fromEntries(cells.map((cell, position) => [`c${position}`, cell])),
  }));
  return html`<div style=${column}>
    <nph-table .label=${text.table.label} .columns=${columns} .rows=${rows}></nph-table>
    ${bar(text.labels, { type: 'table', page: 5 })}
  </div>`;
}

/** Search result, on the first page: numbered below the results. */
export function searchResult(text: ExampleText): TemplateResult {
  return html`<div style=${column}>
    <strong>${text.search.title}</strong>
    <ul style="margin: 0; padding-inline-start: var(--nph-space-section);">
      ${text.search.results.map((result) => html`<li>${result}</li>`)}
    </ul>
    ${bar(text.labels, { type: 'numbered', page: 1 })}
  </div>`;
}

/** Card header, on the last page: compact beside the title of the card. */
export function cardHeader(text: ExampleText): TemplateResult {
  return html`<div
    style="display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-inline); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-container);"
  >
    <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--nph-space-section);">
      <strong>${text.card.title}</strong>
      ${bar(text.labels, { type: 'compact', page: TOTAL_ITEMS / PAGE_SIZE })}
    </div>
    <ul style="margin: 0; padding-inline-start: var(--nph-space-section);">
      ${text.card.items.map((item) => html`<li>${item}</li>`)}
    </ul>
  </div>`;
}

