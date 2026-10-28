/**
 * `nph-table` — the table to read and compare data in rows and columns.
 *
 * Contract accepted in Figma (frame `2584:66651`, set `1370:113`), recorded as text in the
 * evidence of the `figma-docs-accepted` gate of DSA-49, sheet `fichas/nph-table.md` and
 * decision P97 — nph-table: API and semantics:
 * - one tag. The data comes by property — `columns`, `rows` and `footer` — and the piece
 *   draws a native `<table>` in its own shadow root, with `thead`, `tbody`, `tfoot`, `th`
 *   with `scope`, so every reference between parts stays in one root. The Figma parts
 *   (header, cell, composite cell, footer, empty body, chevron, tree cell, expanded item)
 *   are inner parts, not tags (the packaging takes one definition per folder, P91);
 * - `size`: `default` (default) or `large`, reflected; `framed` (the `moldura`),
 *   `sticky-header` (the `cabeçalho fixo`), `striped` (the `estado` `faixa`) and `grid`
 *   (the `grade`), booleans, reflected. The stripe and the grid are of the whole table;
 * - `caption`, `description` and `total`: the caption above the table (the `legenda`), with
 *   its description and its total in an `nph-badge` secondary. The caption title names the
 *   table (`aria-labelledby`) and the description describes it. Without a caption, `label`
 *   is the accessible name. The slot `action` holds the main action of the caption;
 * - a column is `{ key, header, align?, group?, width? }`: `align` `start` (text, default)
 *   or `end` (numbers, with tabular figures), followed by the header and the footer;
 *   `group` puts a title above neighbor columns of the same group (two-level header);
 *   `width` is the content width of the column, set in use;
 * - a row is `{ key, cells, detail?, children?, open?, loading?, toggleLabel? }`. `cells`
 *   maps a column key to a cell: a string or a number is text; `null`, `undefined` or an
 *   empty string is the no-value dash, read as `no-value-label`; an object with `type` is a
 *   composite cell (`text`, `person`, `badge`, `icon-text`, `thumbnail`, `link`,
 *   `truncated`, `status`, `button`, `actions`, `mixed-actions`, `rating`, `loading`).
 *   `detail` opens an expanded item under the row; `children` makes a tree of up to three
 *   levels. Both open through the chevron, an icon-only `nph-button` with `toggleLabel` as
 *   its name, and `open` says whether it starts open;
 * - a table that draws a tree is a `treegrid` (P101): each row carries `aria-level`,
 *   `aria-posinset`, `aria-setsize` and, when it opens, `aria-expanded`; one row is the Tab
 *   stop, Tab goes on to the buttons and links of that row only, and the arrows, Home, End
 *   and Enter follow the APG treegrid, rows first. The flat table stays a native table, with
 *   every button and link in the Tab order and no arrow key;
 * - events: `nph-row-action` (`{ row, action }`) when the person activates a button of a
 *   cell, and `nph-row-toggle` (`{ row, open }`) when the person opens or closes a row.
 *   Both bubble and are not composed, and code never fires them. Opening replaces `rows`
 *   with a new list where that row has the new `open`, so `rows` is always the state;
 * - with no row, the body holds the `nph-empty` with `empty-heading` and
 *   `empty-description`, and the header stays;
 * - invalid input (P21 rule, as P90): a `size` outside the two, a column without `key` or
 *   `header`, a repeated key or an `align` outside the two renders nothing. An invalid row
 *   is left out and an invalid cell is drawn blank; each cause emits one `console.error`
 *   in development. A table with no name, a no-value cell without `no-value-label` and a
 *   truncated cell in a column without `width` render and warn once in development.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import '../nph-avatar/nph-avatar';
import '../nph-badge/nph-badge';
import '../nph-button/nph-button';
import '../nph-empty/nph-empty';
import '../nph-icon/nph-icon';
import '../nph-image/nph-image';
import '../nph-skeleton/nph-skeleton';
import '../nph-tooltip/nph-tooltip';
import { NPH_BADGE_SEVERITIES } from '../nph-badge/nph-badge';
import type { NphBadgeSeverity } from '../nph-badge/nph-badge';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import tableCss from './nph-table.css?inline';

const TAG = 'nph-table';

/** Internal marker, not API: present only when the input of the table is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The ids of the caption parts, unique in the shadow root. */
const CAPTION_ID = 'caption';
const DESCRIPTION_ID = 'description';

export const NPH_TABLE_SIZES = ['default', 'large'] as const;
export type NphTableSize = (typeof NPH_TABLE_SIZES)[number];

/** The Figma `alinhamento`: `esquerda` is `start` (text), `direita` is `end` (numbers). */
export const NPH_TABLE_ALIGNS = ['start', 'end'] as const;
export type NphTableAlign = (typeof NPH_TABLE_ALIGNS)[number];

/** The Figma `conteúdo` of the composite cell; `categoria` waits for D1 of DSA-49. */
export const NPH_TABLE_CELL_TYPES = [
  'text',
  'person',
  'badge',
  'icon-text',
  'thumbnail',
  'link',
  'truncated',
  'status',
  'button',
  'actions',
  'mixed-actions',
  'rating',
  'loading',
] as const;
export type NphTableCellType = (typeof NPH_TABLE_CELL_TYPES)[number];

/** The two statuses the table tokens give: `table/status-success-icon` and `-error-icon`. */
export const NPH_TABLE_STATUSES = ['success', 'error'] as const;
export type NphTableStatus = (typeof NPH_TABLE_STATUSES)[number];

/** The icon of each status: a shape besides the color (D5 of DSA-49). */
export const NPH_TABLE_STATUS_ICON: Readonly<Record<NphTableStatus, string>> = {
  success: 'circle-check',
  error: 'circle-xmark',
};

/** The icons of the cell buttons: Edit (D4 of DSA-49), more actions, the closed and open chevron. */
export const NPH_TABLE_ICONS = {
  edit: 'pen-to-square',
  more: 'ellipsis-vertical',
  closed: 'chevron-right',
  open: 'chevron-down',
  rating: 'star',
} as const;

/** The deepest level of the tree. */
export const NPH_TABLE_MAX_LEVEL = 3;

/** The no-value dash, drawn in the cell when a value is missing. */
export const NPH_TABLE_DASH = '—';

export interface NphTableColumn {
  /** The key of the column in the `cells` of each row and in `footer`. Unique. */
  readonly key: string;
  /** The column title, already localized. */
  readonly header: string;
  /** `start` (default) for text, `end` for numbers. */
  readonly align?: NphTableAlign;
  /** The title of the group above this column, for a two-level header. */
  readonly group?: string;
  /** The content width of the column, a CSS length set in use. */
  readonly width?: string;
}

export type NphTableCellContent =
  | { readonly type: 'text'; readonly text: string; readonly secondary?: string }
  | { readonly type: 'person'; readonly text: string; readonly secondary?: string; readonly src?: string }
  | { readonly type: 'badge'; readonly text: string; readonly severity?: NphBadgeSeverity }
  | { readonly type: 'icon-text'; readonly icon: string; readonly text: string }
  | { readonly type: 'thumbnail'; readonly src?: string; readonly alt?: string; readonly text?: string }
  | { readonly type: 'link'; readonly text: string; readonly href: string }
  | { readonly type: 'truncated'; readonly text: string }
  | { readonly type: 'status'; readonly status: NphTableStatus; readonly text: string }
  | { readonly type: 'button'; readonly text: string; readonly action: string }
  | { readonly type: 'actions'; readonly editLabel: string; readonly moreLabel: string }
  | { readonly type: 'mixed-actions'; readonly text: string; readonly moreLabel: string }
  | { readonly type: 'rating'; readonly text: string }
  | { readonly type: 'loading' };

/** A cell: text, the no-value dash (`null`, `undefined` or empty) or a composite cell. */
export type NphTableCell = string | number | null | undefined | NphTableCellContent;

export interface NphTableDetailValue {
  readonly label: string;
  readonly value: string;
}

/** The expanded item under a row. */
export interface NphTableDetail {
  readonly name: string;
  readonly description?: string;
  readonly src?: string;
  readonly alt?: string;
  readonly values?: readonly NphTableDetailValue[];
  readonly badge?: { readonly text: string; readonly severity?: NphBadgeSeverity };
}

export interface NphTableRow {
  /** Identifies the row in the events. Unique in the table. */
  readonly key: string;
  readonly cells: Readonly<Record<string, NphTableCell>>;
  /** The expanded item, opened by the chevron. */
  readonly detail?: NphTableDetail;
  /** The rows of the next level of the tree. */
  readonly children?: readonly NphTableRow[];
  /** Whether the detail or the children show. */
  readonly open?: boolean;
  /** The chevron spins while the detail or the children load. */
  readonly loading?: boolean;
  /** The accessible name of the chevron, already localized, such as `Detalhes de Ana Souza`. */
  readonly toggleLabel?: string;
}

/** The footer: a value per column key, such as a total. */
export type NphTableFooter = Readonly<Record<string, string | number | null | undefined>>;

export interface NphTableRowActionDetail {
  /** The `key` of the row. */
  readonly row: string;
  /** The `action` of a `button` cell, or `edit` and `more` of the actions. */
  readonly action: string;
}

export interface NphTableRowToggleDetail {
  readonly row: string;
  readonly open: boolean;
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

/** Development warning; outside a bundler with `import.meta.env`, it stays silent. */
function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

/** A string with the spaces at both ends removed; anything else becomes empty. */
function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** The protocols a link of a cell may take; a relative path and a fragment resolve to the page's. */
export const NPH_TABLE_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'] as const;

/**
 * Whether an address may be the `href` of a link cell. It is parsed as the browser would — tabs
 * and line breaks inside the scheme are dropped — so `java\nscript:` is caught as `javascript:`.
 */
export function isSafeHref(href: string): boolean {
  try {
    const url = new URL(href, document.baseURI);
    return (NPH_TABLE_LINK_PROTOCOLS as readonly string[]).includes(url.protocol);
  } catch {
    return false;
  }
}

/** A cell after the check: the content to draw, or `invalid` for a blank cell. */
type CheckedCell = { readonly kind: 'text'; readonly text: string } | { readonly kind: 'no-value' } | { readonly kind: 'invalid' } | NphTableCellContent;

/** A row as drawn: its level in the tree, its position in the path and its checked cells. */
interface DrawnRow {
  readonly row: NphTableRow;
  readonly level: number;
  readonly cells: readonly CheckedCell[];
  readonly hasChildren: boolean;
  readonly open: boolean;
  /** Its place among the valid rows of its level under the same parent, from 1, and how many they are. */
  position: number;
  setSize: number;
}

/** The keys the tree moves the focus with (P101). */
const TREE_KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter'] as const;

export class NphTable extends LitElement {
  static override styles = unsafeCSS(tableCss);

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    size: { type: String, reflect: true },
    framed: { type: Boolean, reflect: true },
    stickyHeader: { type: Boolean, reflect: true, attribute: 'sticky-header' },
    striped: { type: Boolean, reflect: true },
    grid: { type: Boolean, reflect: true },
    caption: { type: String },
    description: { type: String },
    total: { type: String },
    label: { type: String },
    noValueLabel: { type: String, attribute: 'no-value-label' },
    emptyHeading: { type: String, attribute: 'empty-heading' },
    emptyDescription: { type: String, attribute: 'empty-description' },
    columns: { attribute: false },
    rows: { attribute: false },
    footer: { attribute: false },
  };

  /** `default` or `large`, for touch or a more relaxed reading. */
  declare size: NphTableSize;
  /** The frame: border and corner, for a table standing alone on the page. */
  declare framed: boolean;
  /** The body scrolls and the header stays, with the line under it. */
  declare stickyHeader: boolean;
  /** Every other row of data on the stripe background. */
  declare striped: boolean;
  /** The vertical line between columns. */
  declare grid: boolean;
  /** The title above the table, already localized. It names the table. */
  declare caption: string;
  /** The description under the caption title. */
  declare description: string;
  /** The total beside the caption title, in an `nph-badge` secondary. */
  declare total: string;
  /** The accessible name of a table without a caption. */
  declare label: string;
  /** What the screen reader reads in the no-value dash, already localized (`sem valor`). */
  declare noValueLabel: string;
  /** The heading of the `nph-empty` when there is no row. */
  declare emptyHeading: string;
  /** The description of the `nph-empty` when there is no row. */
  declare emptyDescription: string;
  declare columns: readonly NphTableColumn[];
  declare rows: readonly NphTableRow[];
  declare footer: NphTableFooter | null;

  private valid = false;
  private validColumns: readonly NphTableColumn[] = [];
  private drawnRows: readonly DrawnRow[] = [];
  private hasDetailColumn = false;
  private isTree = false;
  /** Causes already reported, so a cause is reported once per instance. */
  private readonly reported = new Set<string>();
  /** The scroll area overflows: it becomes a focusable, named region. */
  private scrollable = false;
  private resizeObserver: ResizeObserver | null = null;
  /** The row of the tree the focus was last in: `row <key>` or `detail <key>`. */
  private activeRow = '';
  /** The row of the tree that is the Tab stop of this render, from `tabStop()`. */
  private stop = '';

  constructor() {
    super();
    this.size = 'default';
    this.framed = false;
    this.stickyHeader = false;
    this.striped = false;
    this.grid = false;
    this.caption = '';
    this.description = '';
    this.total = '';
    this.label = '';
    this.noValueLabel = '';
    this.emptyHeading = '';
    this.emptyDescription = '';
    this.columns = [];
    this.rows = [];
    this.footer = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* A table moved to another place measures its scroll area again: the observer was
       disconnected when it left, and only an update installs it. */
    if (this.hasUpdated) this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private error(message: string): void {
    if (!this.reported.has(`error ${message}`)) {
      this.reported.add(`error ${message}`);
      devError(message);
    }
  }

  private warn(cause: string, message: string): void {
    if (!this.reported.has(`warn ${cause}`)) {
      this.reported.add(`warn ${cause}`);
      devWarn(message);
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has('size') || changed.has('columns')) {
      this.validColumns = this.checkColumns();
    }
    const size = this.size ?? '';
    const sizeValid = oneOf(NPH_TABLE_SIZES, size);
    if (!sizeValid) {
      this.error(`size "${size}" does not exist. Use ${NPH_TABLE_SIZES.map((value) => `"${value}"`).join(', ')}.`);
    }
    const wasValid = this.valid;
    this.valid = sizeValid && this.validColumns.length > 0;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    if (!this.valid) {
      this.drawnRows = [];
      return;
    }

    /* The rows are checked again when they change, and when the table becomes valid again:
       while it was invalid, no row was kept. */
    if (changed.has('rows') || changed.has('columns') || !wasValid) {
      this.drawnRows = this.checkRows();
    }
    if (trimmed(this.caption) === '' && trimmed(this.label) === '') {
      this.warn('no name', 'the table has no name: give it a caption, or a label when there is no caption.');
    }
    if (trimmed(this.noValueLabel) === '' && this.drawnRows.some((drawn) => drawn.cells.some((cell) => 'kind' in cell && cell.kind === 'no-value'))) {
      this.warn(
        'no value label',
        'a cell has no value and no-value-label is empty: the dash is read as a dash. Give the text the screen reader reads, such as "sem valor".',
      );
    }
    if ((this.rows ?? []).length === 0 && trimmed(this.emptyHeading) === '') {
      this.error('there is no row and empty-heading is empty: the empty body needs the heading of its nph-empty.');
    }
  }

  /** The columns, or none when one of them is invalid: a table without its columns cannot be drawn. */
  private checkColumns(): readonly NphTableColumn[] {
    const columns = Array.isArray(this.columns) ? this.columns : [];
    if (columns.length === 0) {
      this.error('columns is empty: a table needs at least one column.');
      return [];
    }
    const keys = new Set<string>();
    let valid = true;
    for (const column of columns) {
      const key = trimmed(column?.key);
      if (key === '') {
        this.error('a column has no key: it is how the rows find their cells.');
        valid = false;
      } else if (keys.has(key)) {
        this.error(`the column key "${key}" repeats: each column needs its own key.`);
        valid = false;
      }
      keys.add(key);
      if (trimmed(column?.header) === '') {
        this.error(`the column "${key}" has no header: the header names the column.`);
        valid = false;
      }
      if (column?.align !== undefined && !oneOf(NPH_TABLE_ALIGNS, column.align)) {
        this.error(`align "${String(column.align)}" of the column "${key}" does not exist. Use "start" or "end".`);
        valid = false;
      }
    }
    return valid ? columns : [];
  }

  /** The rows to draw, in order, with the open levels of the tree and their checked cells. */
  private checkRows(): readonly DrawnRow[] {
    const rows = Array.isArray(this.rows) ? this.rows : [];
    const keys = new Set<string>();
    /* Every valid row, open or closed, in order: the closed ones too, so opening a level does
       not change the shape of the table. A row left out takes its descendants with it. */
    const valid: Array<{ drawn: DrawnRow; visible: boolean }> = [];
    const walk = (list: readonly NphTableRow[], level: number, visible: boolean): void => {
      const siblings: DrawnRow[] = [];
      for (const row of list) {
        const checked = this.checkRow(row, level, keys);
        if (checked === null) continue;
        siblings.push(checked);
        checked.position = siblings.length;
        valid.push({ drawn: checked, visible });
        if (checked.hasChildren) walk(row.children ?? [], level + 1, visible && checked.open);
      }
      for (const sibling of siblings) sibling.setSize = siblings.length;
    };
    walk(rows, 1, true);
    /* The chevron column and the tree come from the valid rows only: a rejected row changes nothing. */
    this.hasDetailColumn = valid.some(({ drawn }) => drawn.row.detail !== undefined && drawn.row.detail !== null);
    this.isTree = valid.some(({ drawn }) => drawn.hasChildren);
    return valid.filter(({ visible }) => visible).map(({ drawn }) => drawn);
  }


  private checkRow(row: NphTableRow, level: number, keys: Set<string>): DrawnRow | null {
    const key = trimmed(row?.key);
    if (key === '') {
      this.error('a row has no key: it is how the events name the row. The row is left out.');
      return null;
    }
    if (keys.has(key)) {
      this.error(`the row key "${key}" repeats: each row needs its own key. The repeated row is left out.`);
      return null;
    }
    keys.add(key);
    const hasDetail = row.detail !== undefined && row.detail !== null;
    const hasChildren = Array.isArray(row.children);
    if (hasDetail && hasChildren) {
      this.error(`the row "${key}" has both detail and children: a row opens one or the other. The row is left out.`);
      return null;
    }
    if (hasChildren && level >= NPH_TABLE_MAX_LEVEL) {
      this.error(`the row "${key}" has children at level ${level}: the tree goes down to ${NPH_TABLE_MAX_LEVEL} levels. The row is left out.`);
      return null;
    }
    if (hasDetail && trimmed(row.detail?.name) === '') {
      this.error(`the detail of the row "${key}" has no name. The row is left out.`);
      return null;
    }
    if ((hasDetail || hasChildren) && trimmed(row.toggleLabel) === '') {
      this.error(`the row "${key}" opens and has no toggleLabel: the chevron needs its accessible name. The row is left out.`);
      return null;
    }
    const badge = hasDetail ? row.detail?.badge : undefined;
    if (badge !== undefined && badge !== null && badge.severity !== undefined && !oneOf(NPH_BADGE_SEVERITIES, badge.severity)) {
      this.error(`the badge severity "${String(badge.severity)}" of the detail of the row "${key}" does not exist. The row is left out.`);
      return null;
    }
    const cells = this.validColumns.map((column) => this.checkCell(row.cells?.[column.key], key, column));
    return { row, level, cells, hasChildren, open: Boolean(row.open), position: 1, setSize: 1 };
  }

  private checkCell(cell: NphTableCell, row: string, column: NphTableColumn): CheckedCell {
    if (cell === null || cell === undefined || cell === '') return { kind: 'no-value' };
    if (typeof cell === 'number') {
      return Number.isFinite(cell) ? { kind: 'text', text: String(cell) } : this.invalidCell(row, column, `the number ${String(cell)} is not finite`);
    }
    if (typeof cell === 'string') return { kind: 'text', text: cell };
    if (typeof cell !== 'object' || !oneOf(NPH_TABLE_CELL_TYPES, (cell as { type?: unknown }).type)) {
      const type = typeof cell === 'object' ? String((cell as { type?: unknown }).type) : typeof cell;
      return this.invalidCell(row, column, `the type "${type}" does not exist; use ${NPH_TABLE_CELL_TYPES.join(', ')}`);
    }
    const missing = (_field: string, value: unknown): boolean => trimmed(value) === '';
    switch (cell.type) {
      case 'text':
      case 'truncated':
      case 'rating':
      case 'person':
        if (missing('text', cell.text)) return this.invalidCell(row, column, `a ${cell.type} cell needs text`);
        if (cell.type === 'truncated' && trimmed(column.width) === '') {
          this.warn(
            `truncated ${column.key}`,
            `the column "${column.key}" has a truncated cell and no width: without a width the text does not shorten.`,
          );
        }
        return cell;
      case 'badge':
        if (missing('text', cell.text)) return this.invalidCell(row, column, 'a badge cell needs text');
        if (cell.severity !== undefined && !oneOf(NPH_BADGE_SEVERITIES, cell.severity)) {
          return this.invalidCell(row, column, `the badge severity "${String(cell.severity)}" does not exist`);
        }
        return cell;
      case 'icon-text':
        if (missing('text', cell.text)) return this.invalidCell(row, column, 'an icon-text cell needs text');
        if (!isCoreName(trimmed(cell.icon))) return this.invalidCell(row, column, `the icon "${String(cell.icon)}" is not in the nph-icon core`);
        return cell;
      case 'thumbnail':
        return cell;
      case 'link':
        if (missing('text', cell.text) || missing('href', cell.href)) return this.invalidCell(row, column, 'a link cell needs text and href');
        if (!isSafeHref(trimmed(cell.href))) {
          return this.invalidCell(row, column, `the href "${cell.href}" is not an http, https, mailto or tel address, a path or a fragment`);
        }
        return cell;
      case 'status':
        if (!oneOf(NPH_TABLE_STATUSES, cell.status)) {
          return this.invalidCell(row, column, `the status "${String(cell.status)}" does not exist; use success or error`);
        }
        if (missing('text', cell.text)) return this.invalidCell(row, column, 'a status cell needs its name in text');
        return cell;
      case 'button':
        if (missing('text', cell.text) || missing('action', cell.action)) return this.invalidCell(row, column, 'a button cell needs text and action');
        return cell;
      case 'actions':
        if (missing('editLabel', cell.editLabel) || missing('moreLabel', cell.moreLabel)) {
          return this.invalidCell(row, column, 'an actions cell needs editLabel and moreLabel, the names of its icon-only buttons');
        }
        return cell;
      case 'mixed-actions':
        if (missing('text', cell.text) || missing('moreLabel', cell.moreLabel)) {
          return this.invalidCell(row, column, 'a mixed-actions cell needs text and moreLabel');
        }
        return cell;
      case 'loading':
        return cell;
    }
  }

  private invalidCell(row: string, column: NphTableColumn, cause: string): CheckedCell {
    this.error(`the cell of the row "${row}" in the column "${column.key}" is drawn blank: ${cause}.`);
    return { kind: 'invalid' };
  }

  protected override updated(): void {
    const area = this.renderRoot.querySelector<HTMLElement>('.scroll');
    if (area === null) {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      return;
    }
    if (this.resizeObserver === null && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.measure());
    }
    if (this.resizeObserver !== null) {
      this.resizeObserver.disconnect();
      this.resizeObserver.observe(area);
      const table = area.querySelector('table');
      if (table !== null) this.resizeObserver.observe(table);
    }
    this.measure();
  }

  /** The scroll area is a focusable, named region only while it overflows. */
  private measure(): void {
    const area = this.renderRoot.querySelector<HTMLElement>('.scroll');
    if (area === null) return;
    const scrollable = area.scrollWidth > area.clientWidth || area.scrollHeight > area.clientHeight;
    if (scrollable !== this.scrollable) {
      this.scrollable = scrollable;
      this.requestUpdate();
    }
  }

  /** Opens or closes a row: `rows` becomes a new list where only that row changed. */
  private toggle(target: NphTableRow): void {
    const open = !target.open;
    const replace = (list: readonly NphTableRow[]): readonly NphTableRow[] =>
      list.map((row) => {
        if (row === target) return { ...row, open };
        /* An entry that is not a row was left out when drawn, and stays as it is. */
        if (row !== null && typeof row === 'object' && Array.isArray(row.children)) {
          const children = replace(row.children);
          return children === row.children ? row : { ...row, children };
        }
        return row;
      });
    this.rows = replace(this.rows);
    this.dispatchEvent(
      new CustomEvent<NphTableRowToggleDetail>('nph-row-toggle', {
        detail: { row: target.key.trim(), open },
        bubbles: true,
      }),
    );
  }

  private act(row: NphTableRow, action: string): void {
    this.dispatchEvent(
      new CustomEvent<NphTableRowActionDetail>('nph-row-action', {
        detail: { row: row.key.trim(), action },
        bubbles: true,
      }),
    );
  }

  /**
   * The Tab stop of the treegrid: the last row the focus was in, while it is drawn; otherwise
   * the first row. A detail row counts while its row is open.
   */
  private tabStop(): string {
    const drawn = (id: string) =>
      this.drawnRows.some((row) => {
        const key = row.row.key.trim();
        return id === `row ${key}` || (id === `detail ${key}` && row.open && row.row.detail !== undefined && row.row.detail !== null);
      });
    if (this.activeRow !== '' && drawn(this.activeRow)) return this.activeRow;
    const first = this.drawnRows[0];
    return first === undefined ? '' : `row ${first.row.key.trim()}`;
  }

  /** The rows the arrows walk through, in order: the rows of data and the open detail rows. */
  private treeRows(): HTMLTableRowElement[] {
    return [...this.renderRoot.querySelectorAll<HTMLTableRowElement>('tbody > tr.row, tbody > tr.detail')];
  }

  /** The row of the tree that holds the focus moves the Tab stop to itself. */
  private onFocusIn(event: FocusEvent): void {
    if (!this.isTree) return;
    const row = (event.target as Element | null)?.closest?.('tbody > tr.row, tbody > tr.detail');
    const id = row?.getAttribute('data-tree-row') ?? '';
    if (id !== '' && id !== this.activeRow) {
      this.activeRow = id;
      this.requestUpdate();
    }
  }

  /**
   * The keyboard of the APG treegrid, rows first (P101). Only a key pressed on a row or on a
   * cell is taken: a key pressed inside a button or a link stays with it.
   */
  private onKeyDown(event: KeyboardEvent): void {
    if (!this.isTree || !(TREE_KEYS as readonly string[]).includes(event.key) || event.altKey || event.shiftKey || event.metaKey) return;
    /* Control goes only with Home and End. */
    if (event.ctrlKey && event.key !== 'Home' && event.key !== 'End') return;
    const target = event.composedPath()[0];
    if (!(target instanceof HTMLElement)) return;
    const rows = this.treeRows();
    const isRow = target instanceof HTMLTableRowElement && rows.includes(target);
    const row = isRow ? target : target instanceof HTMLTableCellElement && target.parentElement instanceof HTMLTableRowElement ? target.parentElement : null;
    if (row === null || !rows.includes(row)) return;
    const handled = isRow ? this.rowKey(event, row, rows) : this.cellKey(event, target as HTMLTableCellElement, row, rows);
    if (handled) event.preventDefault();
  }

  private cells(row: HTMLTableRowElement): HTMLTableCellElement[] {
    return [...row.querySelectorAll<HTMLTableCellElement>(':scope > td')];
  }

  /** The drawn row of a `tr` of data, or `undefined` for a detail row. */
  private drawnOf(row: HTMLTableRowElement): DrawnRow | undefined {
    if (!row.classList.contains('row')) return undefined;
    const id = row.getAttribute('data-tree-row');
    return this.drawnRows.find((drawn) => `row ${drawn.row.key.trim()}` === id);
  }

  /** Opens or closes a row from the keyboard, as its chevron does; a loading row does not, as its click does not. */
  private toggleFromKey(row: HTMLTableRowElement): boolean {
    const drawn = this.drawnOf(row);
    if (drawn === undefined || !row.hasAttribute('aria-expanded')) return false;
    if (!drawn.row.loading) this.toggle(drawn.row);
    return true;
  }

  private parentOf(row: HTMLTableRowElement, rows: readonly HTMLTableRowElement[]): HTMLTableRowElement | undefined {
    const level = Number(row.getAttribute('aria-level'));
    for (let index = rows.indexOf(row) - 1; index >= 0; index -= 1) {
      const candidate = rows[index] as HTMLTableRowElement;
      if (Number(candidate.getAttribute('aria-level')) === level - 1) return candidate;
    }
    return undefined;
  }

  private rowKey(event: KeyboardEvent, row: HTMLTableRowElement, rows: readonly HTMLTableRowElement[]): boolean {
    const index = rows.indexOf(row);
    const expanded = row.getAttribute('aria-expanded');
    switch (event.key) {
      case 'ArrowRight':
        if (expanded === 'false') return this.toggleFromKey(row);
        this.cells(row)[0]?.focus();
        return true;
      case 'ArrowLeft':
        if (expanded === 'true') return this.toggleFromKey(row);
        this.parentOf(row, rows)?.focus();
        return true;
      case 'ArrowDown':
        rows[index + 1]?.focus();
        return true;
      case 'ArrowUp':
        rows[index - 1]?.focus();
        return true;
      case 'Home':
        rows[0]?.focus();
        return true;
      case 'End':
        rows[rows.length - 1]?.focus();
        return true;
      default:
        return this.toggleFromKey(row);
    }
  }

  private cellKey(event: KeyboardEvent, cell: HTMLTableCellElement, row: HTMLTableRowElement, rows: readonly HTMLTableRowElement[]): boolean {
    const cells = this.cells(row);
    const column = cells.indexOf(cell);
    /* The cell of the same column in another row; a row without it, as a detail row, takes the focus itself. */
    const sameColumn = (other: HTMLTableRowElement | undefined): void => {
      if (other === undefined) return;
      (this.cells(other)[column] ?? other).focus();
    };
    const index = rows.indexOf(row);
    switch (event.key) {
      case 'ArrowRight':
        cells[column + 1]?.focus();
        return true;
      case 'ArrowLeft':
        (column === 0 ? row : cells[column - 1])?.focus();
        return true;
      case 'ArrowDown':
        sameColumn(rows[index + 1]);
        return true;
      case 'ArrowUp':
        sameColumn(rows[index - 1]);
        return true;
      case 'Home':
        if (event.ctrlKey) sameColumn(rows[0]);
        else cells[0]?.focus();
        return true;
      case 'End':
        if (event.ctrlKey) sameColumn(rows[rows.length - 1]);
        else cells[cells.length - 1]?.focus();
        return true;
      default:
        return false;
    }
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) return nothing;
    this.stop = this.isTree ? this.tabStop() : '';
    const caption = trimmed(this.caption);
    const description = trimmed(this.description);
    const label = trimmed(this.label);
    const named = caption !== '' ? { labelledby: CAPTION_ID, label: nothing } : { labelledby: nothing, label: label === '' ? nothing : label };
    const describedby = caption !== '' && description !== '' ? DESCRIPTION_ID : nothing;
    return html`
      ${caption === '' ? nothing : this.renderCaption(caption, description)}
      <div
        class="scroll"
        tabindex=${this.scrollable ? '0' : nothing}
        role=${this.scrollable ? 'region' : nothing}
        aria-labelledby=${this.scrollable ? named.labelledby : nothing}
        aria-label=${this.scrollable ? named.label : nothing}
      >
        <table
          role=${this.isTree ? 'treegrid' : nothing}
          aria-labelledby=${named.labelledby}
          aria-label=${named.label}
          aria-describedby=${describedby}
          @keydown=${this.onKeyDown}
          @focusin=${this.onFocusIn}
        >
          ${this.renderColumnGroups()} ${this.renderHead()} ${this.renderBody()} ${this.renderFoot()}
        </table>
      </div>
    `;
  }

  private renderCaption(caption: string, description: string): TemplateResult {
    const total = trimmed(this.total);
    return html`<div class="caption">
      <div class="caption-text">
        <div class="caption-title">
          <span class="title" id=${CAPTION_ID}>${caption}</span>
          ${total === '' ? nothing : html`<nph-badge severity="secondary" text=${total}></nph-badge>`}
        </div>
        ${description === '' ? nothing : html`<p class="description" id=${DESCRIPTION_ID}>${description}</p>`}
      </div>
      <slot name="action"></slot>
    </div>`;
  }

  /** One `colgroup` per group of columns (and per column outside a group), so `scope="colgroup"` has its group. */
  private renderColumnGroups(): TemplateResult {
    const runs = this.runs();
    return html`${this.hasDetailColumn ? html`<colgroup><col /></colgroup>` : nothing}${runs.map(
      (run) => html`<colgroup>${run.columns.map(() => html`<col />`)}</colgroup>`,
    )}`;
  }

  /** Neighbor columns of the same group, in order; a column without a group is a run of one. */
  private runs(): Array<{ group: string; columns: NphTableColumn[] }> {
    const runs: Array<{ group: string; columns: NphTableColumn[] }> = [];
    for (const column of this.validColumns) {
      const group = trimmed(column.group);
      const last = runs[runs.length - 1];
      if (group !== '' && last !== undefined && last.group === group) {
        last.columns.push(column);
      } else {
        runs.push({ group, columns: [column] });
      }
    }
    return runs;
  }

  private alignClass(column: NphTableColumn): string {
    return column.align === 'end' ? 'end' : 'start';
  }

  private widthStyle(column: NphTableColumn): string | typeof nothing {
    const width = trimmed(column.width);
    return width === '' ? nothing : `inline-size: ${width}`;
  }

  private renderHead(): TemplateResult {
    const runs = this.runs();
    const twoLevels = runs.some((run) => run.group !== '');
    const chevron = this.hasDetailColumn ? html`<td class="chevron-column" rowspan=${twoLevels ? 2 : 1}></td>` : nothing;
    const header = (column: NphTableColumn, rowspan: number) =>
      html`<th scope="col" class=${this.alignClass(column)} rowspan=${rowspan === 1 ? nothing : rowspan} style=${this.widthStyle(column)}>
        ${column.header}
      </th>`;
    if (!twoLevels) {
      return html`<thead>
        <tr>
          ${chevron}${this.validColumns.map((column) => header(column, 1))}
        </tr>
      </thead>`;
    }
    return html`<thead>
      <tr>
        ${chevron}${runs.map((run) =>
          run.group === ''
            ? header(run.columns[0] as NphTableColumn, 2)
            : html`<th scope="colgroup" class="group" colspan=${run.columns.length}>${run.group}</th>`,
        )}
      </tr>
      <tr>
        ${runs.filter((run) => run.group !== '').flatMap((run) => run.columns.map((column) => header(column, 1)))}
      </tr>
    </thead>`;
  }

  private get columnCount(): number {
    return this.validColumns.length + (this.hasDetailColumn ? 1 : 0);
  }

  private renderBody(): TemplateResult {
    if ((this.rows ?? []).length === 0) {
      const heading = trimmed(this.emptyHeading);
      return html`<tbody>
        <tr class="empty">
          <td colspan=${this.columnCount}>
            ${heading === ''
              ? nothing
              : html`<nph-empty heading=${heading} description=${trimmed(this.emptyDescription)}></nph-empty>`}
          </td>
        </tr>
      </tbody>`;
    }
    return html`<tbody>
      ${repeat(
        this.drawnRows,
        /* Keyed by the row, so a row keeps its elements — and the focus on its buttons — when
           rows come in or leave before it. */
        (drawn) => drawn.row.key.trim(),
        (drawn, position) => {
          /* The stripe counts the rows of data only: an expanded item is not one of them. */
          const striped = position % 2 === 1;
          const detailId = `detail-${position}`;
          const detailOpen = drawn.row.detail !== undefined && drawn.row.detail !== null && drawn.open;
          return html`${this.renderRow(drawn, position, striped, detailId)}${detailOpen
            ? this.renderDetail(drawn, detailId)
            : nothing}`;
        },
      )}
    </tbody>`;
  }

  private renderChevron(drawn: DrawnRow, controls: string | typeof nothing): TemplateResult {
    return html`<nph-button
      class="chevron"
      severity="secondary"
      emphasis="ghost"
      size="compact"
      icon-start=${drawn.open ? NPH_TABLE_ICONS.open : NPH_TABLE_ICONS.closed}
      label=${trimmed(drawn.row.toggleLabel)}
      aria-expanded=${drawn.open ? 'true' : 'false'}
      aria-controls=${controls}
      ?loading=${Boolean(drawn.row.loading)}
      tabindex=${this.outOfTab(drawn)}
      @click=${() => this.toggle(drawn.row)}
    ></nph-button>`;
  }

  private renderRow(drawn: DrawnRow, position: number, striped: boolean, detailId: string): TemplateResult {
    const hasDetail = drawn.row.detail !== undefined && drawn.row.detail !== null;
    const classes = ['row', striped ? 'striped' : '', this.isTree ? `level-${drawn.level}` : ''].filter(Boolean).join(' ');
    if (!this.isTree) {
      return html`<tr class=${classes}>${this.renderCells(drawn, position, detailId)}</tr>`;
    }
    /* A row of the treegrid (P101): its level, its place among its siblings, its open state and the roving Tab stop. */
    const id = `row ${drawn.row.key.trim()}`;
    return html`<tr
      class=${classes}
      data-tree-row=${id}
      tabindex=${this.stop === id ? '0' : '-1'}
      aria-level=${drawn.level}
      aria-posinset=${drawn.position}
      aria-setsize=${drawn.setSize}
      aria-expanded=${drawn.hasChildren || hasDetail ? String(drawn.open) : nothing}
    >
      ${this.renderCells(drawn, position, detailId)}
    </tr>`;
  }

  private renderCells(drawn: DrawnRow, position: number, detailId: string): TemplateResult {
    const hasDetail = drawn.row.detail !== undefined && drawn.row.detail !== null;
    return html`${this.hasDetailColumn
        ? html`<td class="chevron-column" tabindex=${this.isTree ? '-1' : nothing}>
            ${hasDetail ? this.renderChevron(drawn, drawn.open ? detailId : nothing) : nothing}
          </td>`
        : nothing}
      ${repeat(
        this.validColumns,
        /* Keyed by the column, so a focused button keeps its column, and its action, when columns change. */
        (column) => column.key.trim(),
        (column, index) => {
          const cell = drawn.cells[index] as CheckedCell;
          const tree = this.isTree && index === 0;
          return this.renderCell(cell, column, drawn, `cell-${position}-${index}`, tree);
        },
      )}`;
  }

  /**
   * In the treegrid, the buttons, the links and the truncated text of a row leave the Tab order
   * while the row is not the Tab stop, so Tab goes from the row to its own widgets and then out
   * (P101). In the flat table they keep the Tab order.
   */
  private outOfTab(drawn: DrawnRow): '-1' | typeof nothing {
    return this.isTree && this.stop !== `row ${drawn.row.key.trim()}` ? '-1' : nothing;
  }

  private renderCell(cell: CheckedCell, column: NphTableColumn, drawn: DrawnRow, id: string, tree: boolean): TemplateResult {
    const kind = 'kind' in cell ? cell.kind : cell.type;
    const classes = [this.alignClass(column), kind === 'button' || kind === 'mixed-actions' ? 'action' : '', kind === 'truncated' ? 'truncated' : '']
      .filter(Boolean)
      .join(' ');
    const content = this.renderContent(cell, column, drawn, id);
    const inner = tree
      ? html`<div class="tree">
          ${drawn.hasChildren ? this.renderChevron(drawn, nothing) : html`<span class="tree-spacer"></span>`}${content}
        </div>`
      : content;
    if (kind === 'truncated') {
      return html`<td class=${classes} id=${id} tabindex=${this.outOfTab(drawn) === nothing ? '0' : '-1'}>${inner}</td>`;
    }
    /* A loading cell says so to assistive technology: the skeleton itself is decorative (P69). In
       the treegrid every cell takes the focus from the arrows. */
    return html`<td class=${classes} tabindex=${this.isTree ? '-1' : nothing} aria-busy=${kind === 'loading' ? 'true' : nothing}>${inner}</td>`;
  }

  private renderContent(cell: CheckedCell, column: NphTableColumn, drawn: DrawnRow, id: string): TemplateResult | typeof nothing {
    const row = drawn.row;
    const tab = this.outOfTab(drawn);
    if ('kind' in cell) {
      if (cell.kind === 'text') return html`<span class="text">${cell.text}</span>`;
      if (cell.kind === 'invalid') return nothing;
      const label = trimmed(this.noValueLabel);
      return label === ''
        ? html`<span class="no-value">${NPH_TABLE_DASH}</span>`
        : html`<span class="no-value"><span aria-hidden="true">${NPH_TABLE_DASH}</span><span class="hidden">${label}</span></span>`;
    }
    switch (cell.type) {
      case 'text':
        return this.lines(cell.text, cell.secondary);
      case 'person':
        return html`<span class="pieces"><nph-avatar size="md" src=${trimmed(cell.src)}></nph-avatar>${this.lines(cell.text, cell.secondary)}</span>`;
      case 'badge':
        return html`<nph-badge emphasis="light" severity=${cell.severity ?? 'primary'} text=${cell.text}></nph-badge>`;
      case 'icon-text':
        return html`<span class="pieces"><nph-icon name=${trimmed(cell.icon)} size="sm"></nph-icon><span class="text">${cell.text}</span></span>`;
      case 'thumbnail': {
        const text = trimmed(cell.text);
        return html`<span class="pieces">
          <nph-image size="sm" src=${trimmed(cell.src)} alt=${trimmed(cell.alt)}></nph-image>${text === '' ? nothing : html`<span class="text">${text}</span>`}
        </span>`;
      }
      case 'link':
        return html`<a class="link" href=${trimmed(cell.href)} tabindex=${tab}>${cell.text}</a>`;
      case 'truncated':
        return html`<span class="cut" style=${this.widthStyle(column) === nothing ? nothing : `max-inline-size: ${trimmed(column.width)}`}>${cell.text}</span>
          <nph-tooltip for=${id} relation="name" text=${cell.text}></nph-tooltip>`;
      case 'status':
        return html`<span class="pieces">
          <span class=${`status ${cell.status}`}><nph-icon name=${NPH_TABLE_STATUS_ICON[cell.status]} size="sm"></nph-icon></span><span class="text">${cell.text}</span>
        </span>`;
      case 'button':
        return html`<nph-button
          severity="secondary"
          emphasis="light"
          size="compact"
          text=${cell.text}
          tabindex=${tab}
          @click=${() => this.act(row, cell.action.trim())}
        ></nph-button>`;
      case 'actions':
        return html`<span class="pieces tight">
          <nph-button severity="secondary" emphasis="ghost" icon-start=${NPH_TABLE_ICONS.edit} label=${cell.editLabel} tabindex=${tab} @click=${() => this.act(row, 'edit')}></nph-button>
          <nph-button severity="secondary" emphasis="ghost" icon-start=${NPH_TABLE_ICONS.more} label=${cell.moreLabel} tabindex=${tab} @click=${() => this.act(row, 'more')}></nph-button>
        </span>`;
      case 'mixed-actions':
        return html`<span class="pieces">
          <nph-button severity="secondary" emphasis="light" size="compact" text=${cell.text} tabindex=${tab} @click=${() => this.act(row, 'edit')}></nph-button>
          <nph-button
            severity="secondary"
            emphasis="light"
            size="compact"
            icon-start=${NPH_TABLE_ICONS.more}
            label=${cell.moreLabel}
            tabindex=${tab}
            @click=${() => this.act(row, 'more')}
          ></nph-button>
        </span>`;
      case 'rating':
        return html`<span class="pieces"><span class="rating"><nph-icon name=${NPH_TABLE_ICONS.rating} variant="solid" size="sm"></nph-icon></span><span class="text">${cell.text}</span></span>`;
      case 'loading':
        return html`<nph-skeleton shape="line"></nph-skeleton>`;
    }
  }

  /** One line, or two: the text and the second line under it in the muted color. */
  private lines(text: string, secondary: string | undefined): TemplateResult {
    const second = trimmed(secondary);
    return second === ''
      ? html`<span class="text">${text}</span>`
      : html`<span class="lines"><span class="text">${text}</span><span class="secondary">${second}</span></span>`;
  }

  private renderDetail(drawn: DrawnRow, id: string): TemplateResult {
    const detail = drawn.row.detail as NphTableDetail;
    const description = trimmed(detail.description);
    const values = Array.isArray(detail.values) ? detail.values.filter((entry) => trimmed(entry?.label) !== '') : [];
    const badge = trimmed(detail.badge?.text);
    /* In the treegrid the expanded item is a row of the level under its row, the only one there. */
    const treeId = `detail ${drawn.row.key.trim()}`;
    return html`<tr
      class="detail"
      id=${id}
      data-tree-row=${this.isTree ? treeId : nothing}
      tabindex=${this.isTree ? (this.stop === treeId ? '0' : '-1') : nothing}
      aria-level=${this.isTree ? drawn.level + 1 : nothing}
      aria-posinset=${this.isTree ? 1 : nothing}
      aria-setsize=${this.isTree ? 1 : nothing}
    >
      <td colspan=${this.columnCount} tabindex=${this.isTree ? '-1' : nothing}>
        <div class="item">
          <nph-image size="lg" src=${trimmed(detail.src)} alt=${trimmed(detail.alt)}></nph-image>
          <div class="lines">
            <span class="name">${detail.name}</span>
            ${description === '' ? nothing : html`<span class="secondary">${description}</span>`}
          </div>
          ${values.length === 0
            ? nothing
            : html`<dl class="values">
                ${values.map(
                  (entry) => html`<div class="value">
                    <dt>${entry.label}</dt>
                    <dd>${entry.value}</dd>
                  </div>`,
                )}
              </dl>`}
          ${badge === ''
            ? nothing
            : html`<nph-badge emphasis="light" severity=${detail.badge?.severity ?? 'primary'} text=${badge}></nph-badge>`}
        </div>
      </td>
    </tr>`;
  }

  private renderFoot(): TemplateResult | typeof nothing {
    const footer = this.footer;
    if (footer === null || footer === undefined || typeof footer !== 'object') return nothing;
    if (!this.validColumns.some((column) => footer[column.key] !== undefined && footer[column.key] !== null)) return nothing;
    return html`<tfoot>
      <tr>
        ${this.hasDetailColumn ? html`<td class="chevron-column"></td>` : nothing}
        ${this.validColumns.map((column) => {
          const value = footer[column.key];
          return html`<td class=${this.alignClass(column)}>${value === null || value === undefined ? '' : String(value)}</td>`;
        })}
      </tr>
    </tfoot>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphTable);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-table': NphTable;
  }
  interface HTMLElementEventMap {
    'nph-row-action': CustomEvent<NphTableRowActionDetail>;
    'nph-row-toggle': CustomEvent<NphTableRowToggleDetail>;
  }
}
