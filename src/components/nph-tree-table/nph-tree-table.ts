/**
 * `nph-tree-table` — a data table whose rows have a parent and child hierarchy.
 *
 * Contract accepted in Figma (frame `7812:13461`, sets `7617:6784` and `7604:167`), recorded as
 * text in the evidence of the `figma-docs-accepted` gate of DSA-102, sheet
 * `fichas/nph-tree-table.md` and decision P141 — nph-tree-table: API and semantics:
 * - it IS an `nph-data-table` (P105), which IS an `nph-table` (P97, P101): it extends its class
 *   and takes every attribute and property of it, with the same cells, columns, selection,
 *   sorting, bars, row actions, switch column, loading, empty by search and footer. What it adds
 *   is the hierarchy: the first column is the tree cell of `nph-table` (indent per level, chevron,
 *   text) and the table is a treegrid with the keyboard of the APG;
 * - the data is controlled, as in the data table: `rows` arrive already searched, sorted and
 *   paged, and the table keeps only what the person chose. Sorting works inside each level, the
 *   search brings the parents of what it finds, and the page counts the first level only: that
 *   is the page's rule, and `total-items` is the number of first-level rows;
 * - a row is `{ key, name, cells, children?, branch?, error?, open?, loading?, toggleLabel? }`.
 *   `children` is the next level, up to three levels in all. A row with `branch` and no
 *   `children` is a branch whose children are not loaded yet; with `error`, the load failed;
 *   with `children` empty, it came back with nothing and the row is a leaf (the chevron leaves,
 *   its space stays, and `aria-expanded` goes);
 * - on-demand load: opening an unloaded branch fires `nph-row-load` (`{ row, retry: false }`), and
 *   the row is busy (`aria-busy`) with the loading chevron until `rows` brings its `children` or
 *   its `error`. A failed branch draws the error row in the place of its children, with
 *   `error-text` and `retry-text`; Enter and a click on it fire `nph-row-load` (`{ row, retry:
 *   true }`) and the branch goes back to loading. Only Try again asks again;
 * - selection is by the box, in a column of its own, as in the data table, with the cascade:
 *   checking a parent checks its loaded children, unchecking it unchecks them, a parent with only
 *   part of its children checked is indeterminate, and a parent whose loaded children are all
 *   checked is checked. `selected` lists every checked row, parents included; the children that
 *   load later under a checked parent come checked and the table reports it. The bulk bar counts
 *   the keys of `selected`;
 * - the row focus is a border and a halo with corners, inside the row (`tree-table/focus-*`); a
 *   focused cell keeps the ring of `nph-table`;
 * - invalid input (P21 rule): what the data table and `nph-table` reject renders nothing; a row
 *   below the third level is left out; an error row with no text warns once in development.
 */
import { html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

import '../nph-checkbox/nph-checkbox';
import '../nph-icon/nph-icon';
import { NphDataTable } from '../nph-data-table/nph-data-table';
import type { NphDataTableRow, NphDataTableSelectionChangeDetail } from '../nph-data-table/nph-data-table';
import type { NphTableCell, NphTableColumn, NphTableRow, CheckedCell } from '../nph-table/nph-table';
import tableCss from '../nph-table/nph-table.css?inline';
import dataTableCss from '../nph-data-table/nph-data-table.css?inline';
import treeTableCss from './nph-tree-table.css?inline';

const TAG = 'nph-tree-table';

/** The core icon of the branch error row. */
export const NPH_TREE_TABLE_ICONS = {
  error: 'triangle-exclamation',
} as const;

export interface NphTreeTableRow extends NphDataTableRow {
  /** The rows of the next level, up to three levels in all. Empty: the row is a leaf. */
  readonly children?: readonly NphTreeTableRow[];
  /** A branch whose children the page has not loaded yet: it opens and asks for them. */
  readonly branch?: boolean;
  /** The load of the children failed: the error row takes their place. */
  readonly error?: boolean;
}

/** The detail of `nph-row-load`: a branch that asks for its children, or Try again on it. */
export interface NphTreeTableLoadDetail {
  /** The `key` of the branch. */
  readonly row: string;
  /** `true` when the person pressed Try again on its error row. */
  readonly retry: boolean;
}

/** The state of a box in a row: checked, unchecked or, for a parent with part of its children checked, mixed. */
export type NphTreeTableCheckState = 'checked' | 'unchecked' | 'mixed';

/** A row in the index of the whole tree: where it hangs and what hangs under it, open or not. */
interface IndexedRow {
  readonly parent: string | null;
  readonly children: string[];
  /** Has a box: the row has a name. */
  readonly selectable: boolean;
}

/** Development warning; outside a bundler with `import.meta.env`, it stays silent. */
function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** The `input` of the inner fields is composed: it stops here, it is not the table's. */
function stop(event: Event): void {
  event.stopPropagation();
}

export class NphTreeTable extends NphDataTable {
  /* The style of the table first, then the data table over it, then the tree table over both. */
  static override styles = unsafeCSS(`${tableCss}\n${dataTableCss}\n${treeTableCss}`);

  static override properties = {
    ...NphDataTable.properties,
    errorText: { type: String, attribute: 'error-text' },
    retryText: { type: String, attribute: 'retry-text' },
  };

  declare rows: readonly NphTreeTableRow[];
  /** The phrase of the branch error row, such as `Couldn't load.`. Already localized. */
  declare errorText: string;
  /** The action of the branch error row, such as `Try again`. Already localized. */
  declare retryText: string;

  /** Every valid row of the tree, open or closed, by key. */
  private index = new Map<string, IndexedRow>();
  /** The keys in pre-order: a parent comes before its children. */
  private order: string[] = [];
  /** The box of every row, from `selected` and the cascade. */
  private states = new Map<string, NphTreeTableCheckState>();
  /** The branches whose Try again was pressed, until `rows` answers with another object. */
  private retrying = new Map<string, NphTreeTableRow>();
  /** The branches that already asked for their first load, until `rows` answers. */
  private asked = new Set<string>();
  /** The selection changed by the rows that arrived: the table says so after the render. */
  private reportSelection = false;
  /** The Tab stop the pointer took for the balloon of a cut text, and the one to give back. */
  private hoverRestore: string | null = null;
  private readonly warned = new Set<string>();
  /** Watches the ⋮ of the rows that are not the Tab stop, so a closed menu leaves no `aria-expanded` on a focusable host. */
  private triggerObserver: MutationObserver | null = null;

  constructor() {
    super();
    this.errorText = '';
    this.retryText = '';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.renderRoot.addEventListener('pointerover', this.onPointerOver as EventListener, true);
    this.renderRoot.addEventListener('keydown', this.onKeyDownCapture as EventListener, true);
    this.renderRoot.addEventListener('focusin', this.onFocusInCapture, true);
    this.addEventListener('pointerleave', this.releaseHover);
    this.triggerObserver = new MutationObserver((records) => {
      for (const record of records) this.settleTrigger(record.target);
    });
    this.triggerObserver.observe(this.renderRoot, { attributes: true, subtree: true, attributeFilter: ['aria-expanded', 'tabindex'] });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.triggerObserver?.disconnect();
    this.triggerObserver = null;
    this.renderRoot.removeEventListener('pointerover', this.onPointerOver as EventListener, true);
    this.renderRoot.removeEventListener('keydown', this.onKeyDownCapture as EventListener, true);
    this.renderRoot.removeEventListener('focusin', this.onFocusInCapture, true);
    this.removeEventListener('pointerleave', this.releaseHover);
  }

  protected override get drawsTree(): boolean {
    return true;
  }

  private warnOnce(cause: string, message: string): void {
    if (!this.warned.has(cause)) {
      this.warned.add(cause);
      devWarn(message);
    }
  }

  /* ----- what a row is ------------------------------------------------------------------- */

  /**
   * A row opens when it has children, or when it is a branch whose children are not here: not
   * loaded yet, or failed. A branch that came back with no children is a leaf (D-1).
   */
  protected override opensBranch(row: NphTableRow): boolean {
    const node = row as NphTreeTableRow;
    if (node.error === true) return true;
    if (Array.isArray(node.children)) return node.children.length > 0;
    return node.branch === true;
  }

  /** An open branch with no children and no failure is loading: the row says so, or the page did not answer yet. */
  private isUnloaded(row: NphTreeTableRow): boolean {
    return row.branch === true && row.children === undefined && row.error !== true;
  }

  protected override rowLoading(row: NphTableRow): boolean {
    const node = row as NphTreeTableRow;
    if (node.loading === true) return true;
    if (this.retrying.get(node.key.trim()) === node) return true;
    return node.open === true && this.isUnloaded(node);
  }

  protected override rowBusy(row: NphTableRow): boolean {
    return this.rowLoading(row);
  }

  protected override afterToggle(row: NphTableRow, open: boolean): void {
    const node = row as NphTreeTableRow;
    const key = node.key.trim();
    if (open && this.isUnloaded(node) && node.loading !== true && !this.asked.has(key)) {
      this.asked.add(key);
      this.emitLoad(key, false);
    }
  }

  private emitLoad(row: string, retry: boolean): void {
    this.dispatchEvent(new CustomEvent<NphTreeTableLoadDetail>('nph-row-load', { detail: { row, retry }, bubbles: true }));
  }

  /** The text of a cut tree cell: the first column is the tree column, and its text is cut to one line. */
  protected override checkCell(cell: NphTableCell, row: string, column: NphTableColumn): CheckedCell {
    const checked = super.checkCell(cell, row, column);
    if (column === this.validColumns[0] && 'kind' in checked && checked.kind === 'text') {
      return { type: 'truncated', text: checked.text };
    }
    return checked;
  }

  /* ----- the index and the selection ----------------------------------------------------- */

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const rowsChanged = changed.has('rows') || changed.has('columns');
    if (rowsChanged) {
      this.indexRows();
      this.forgetAnswered();
    }
    if (rowsChanged || changed.has('selected') || this.states.size === 0) {
      const before = this.selectedKeys();
      const result = this.reconcile(before);
      this.states = result.states;
      /* A selection set from outside is the page's: only rows that arrive under a checked parent are reported. */
      const grew = result.selected.length !== before.length || result.selected.some((key) => !before.includes(key));
      if (grew) {
        /* Read before the assignment: setting `selected` here adds it to `changed`. */
        const fromRows = changed.has('rows') && !changed.has('selected');
        this.selected = result.selected;
        if (fromRows) this.reportSelection = true;
      }
    }
    const withError = this.errorRows();
    if (withError.length > 0 && (trimmed(this.errorText) === '' || trimmed(this.retryText) === '')) {
      this.warnOnce(
        'error text',
        'a branch failed to load and the error row has no text. Give the table `error-text` and `retry-text`.',
      );
    }
  }

  /** The tree of the valid rows, open or closed, in pre-order. */
  private indexRows(): void {
    const index = new Map<string, IndexedRow>();
    const order: string[] = [];
    const walk = (list: readonly NphTreeTableRow[] | undefined, parent: string | null): string[] => {
      const keys: string[] = [];
      for (const row of Array.isArray(list) ? list : []) {
        const key = trimmed(row?.key);
        if (key === '' || index.has(key)) continue;
        const node: IndexedRow = { parent, children: [], selectable: trimmed(row.name) !== '' };
        index.set(key, node);
        order.push(key);
        keys.push(key);
        node.children.push(...walk(row.children, key));
      }
      return keys;
    };
    walk(this.rows, null);
    this.index = index;
    this.order = order;
  }

  /** A branch is answered when its row comes back as another object, or with its children or error. */
  private forgetAnswered(): void {
    const current = new Map<string, NphTreeTableRow>();
    const collect = (list: readonly NphTreeTableRow[] | undefined): void => {
      for (const row of Array.isArray(list) ? list : []) {
        current.set(trimmed(row?.key), row);
        collect(row?.children);
      }
    };
    collect(this.rows);
    for (const [key, pressed] of this.retrying) {
      const now = current.get(key);
      if (now === undefined || now !== pressed || now.error !== true) this.retrying.delete(key);
    }
    for (const key of this.asked) {
      const now = current.get(key);
      if (now === undefined || now.children !== undefined || now.error === true || now.branch !== true) this.asked.delete(key);
    }
  }

  /** The selectable rows under a row, at any depth. */
  private descendants(key: string): string[] {
    const found: string[] = [];
    const visit = (parent: string): void => {
      for (const child of this.index.get(parent)?.children ?? []) {
        if (this.index.get(child)?.selectable === true) found.push(child);
        visit(child);
      }
    };
    visit(key);
    return found;
  }

  private ancestors(key: string): string[] {
    const found: string[] = [];
    for (let parent = this.index.get(key)?.parent ?? null; parent !== null; parent = this.index.get(parent)?.parent ?? null) {
      found.push(parent);
    }
    return found;
  }

  /**
   * The selection and the box of every row from a list of keys. A checked parent checks its
   * loaded children, a parent is checked when all of them are and indeterminate when only part
   * is, and a key the tree does not know (another page) is kept as it came.
   */
  private reconcile(keys: readonly string[]): { selected: string[]; states: Map<string, NphTreeTableCheckState> } {
    const set = new Set(keys);
    /* Down, in pre-order: a parent comes before its children, so the cascade reaches every depth. */
    for (const key of this.order) {
      if (!set.has(key)) continue;
      for (const child of this.index.get(key)?.children ?? []) {
        if (this.index.get(child)?.selectable === true) set.add(child);
      }
    }
    /* Up, in reverse pre-order: a child is settled before its parent. */
    const states = new Map<string, NphTreeTableCheckState>();
    for (const key of [...this.order].reverse()) {
      const node = this.index.get(key) as IndexedRow;
      const kids = node.children.filter((child) => this.index.get(child)?.selectable === true);
      let state: NphTreeTableCheckState;
      if (!node.selectable) {
        state = 'unchecked';
      } else if (kids.length === 0) {
        state = set.has(key) ? 'checked' : 'unchecked';
      } else {
        const own = kids.map((child) => states.get(child) as NphTreeTableCheckState);
        state = own.every((value) => value === 'checked') ? 'checked' : own.every((value) => value === 'unchecked') ? 'unchecked' : 'mixed';
        if (state === 'checked') set.add(key);
        else set.delete(key);
      }
      states.set(key, state);
    }
    return { selected: [...set], states };
  }

  protected override isSelected(key: string): boolean {
    const state = this.states.get(key);
    return state === undefined ? super.isSelected(key) : state === 'checked';
  }

  protected override select(keys: readonly string[], checked: boolean): void {
    const next = new Set(this.selectedKeys());
    for (const key of keys) {
      const ids = [key, ...this.descendants(key)];
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      /* Unchecking a row takes its parents out: they were checked only because all their children were. */
      if (!checked) for (const parent of this.ancestors(key)) next.delete(parent);
    }
    const result = this.reconcile([...next]);
    this.states = result.states;
    this.selected = result.selected;
    this.dispatchEvent(
      new CustomEvent<NphDataTableSelectionChangeDetail>('nph-selection-change', {
        detail: { selected: result.selected },
        bubbles: true,
      }),
    );
  }

  protected override updated(): void {
    super.updated();
    if (this.reportSelection) {
      this.reportSelection = false;
      this.dispatchEvent(
        new CustomEvent<NphDataTableSelectionChangeDetail>('nph-selection-change', {
          detail: { selected: this.selectedKeys() },
          bubbles: true,
        }),
      );
    }
    this.rove();
  }

  /**
   * One row is the Tab stop (P101): the pieces of the other rows that the data table leaves in
   * the Tab order — the box, the ⋮ and the switch — leave it too, and every cell takes the focus
   * from the arrows.
   */
  private rove(): void {
    /* The tree cell holds the width the page gave the column: the cut text shortens inside it. */
    const width = trimmed(this.validColumns[0]?.width);
    for (const cell of this.renderRoot.querySelectorAll<HTMLElement>('tbody td:has(> .tree)')) cell.style.maxInlineSize = width;
    for (const row of this.renderRoot.querySelectorAll<HTMLTableRowElement>('tbody tr[data-tree-row]')) {
      const id = row.getAttribute('data-tree-row') ?? '';
      const here = id === this.stop;
      for (const cell of row.querySelectorAll<HTMLElement>(':scope > td:not([tabindex])')) cell.setAttribute('tabindex', '-1');
      for (const piece of row.querySelectorAll<HTMLElement>('.select > nph-checkbox, .switch > nph-switch, .actions > nph-button')) {
        if (here) piece.removeAttribute('tabindex');
        else piece.setAttribute('tabindex', '-1');
        this.settleTrigger(piece);
      }
    }
  }

  /**
   * The menu of the ⋮ writes `aria-expanded` on the host of the button. On a host that is out of the Tab
   * order, a closed menu says it by the absence of the attribute: the native button still reads `false`
   * from `aria-haspopup`, and a focusable host with no role carries no `aria-expanded` that ARIA does not
   * allow. An open menu writes `true`, and that stays.
   */
  private settleTrigger(node: Node): void {
    if (
      node instanceof HTMLElement &&
      node.localName === 'nph-button' &&
      node.parentElement?.classList.contains('actions') === true &&
      node.getAttribute('tabindex') === '-1' &&
      node.getAttribute('aria-expanded') === 'false'
    ) {
      node.removeAttribute('aria-expanded');
    }
  }

  /* ----- the cells of the row ------------------------------------------------------------- */

  protected override renderLeadingCells(row: NphTableRow): TemplateResult | typeof nothing {
    if (!this.withSelection) return nothing;
    const data = row as NphDataTableRow;
    const name = this.nameOf(data);
    const key = row.key.trim();
    const state = this.states.get(key);
    return html`<td class="select" tabindex="-1">
      ${name === '' || this.loading
        ? nothing
        : html`<nph-checkbox
            label=${this.fill(this.selectLabel, name)}
            .checked=${live(state === 'checked')}
            .indeterminate=${live(state === 'mixed')}
            @input=${stop}
            @change=${(event: Event) => this.onSelectRow(data, event)}
          ></nph-checkbox>`}
    </td>`;
  }

  /* ----- the branch error row ------------------------------------------------------------- */

  /** The branches whose error row is drawn now: open, failed and not asked again. */
  private errorRows(): NphTreeTableRow[] {
    return (this.visibleRows as readonly NphTreeTableRow[]).filter(
      (row) => row.error === true && row.open === true && !this.rowLoading(row),
    );
  }

  /** A cell with a button makes the rows of the table taller, and the error row follows them. */
  private hasActionCells(): boolean {
    const keys = this.validColumns.map((column) => column.key);
    return (this.visibleRows as readonly NphTreeTableRow[]).some((row) =>
      keys.some((key) => {
        const cell = row.cells?.[key];
        return typeof cell === 'object' && cell !== null && ['button', 'actions', 'mixed-actions'].includes((cell as { type?: string }).type ?? '');
      }),
    );
  }

  protected override extraRowDrawn(id: string): boolean {
    return this.errorRows().some((row) => id === `error ${row.key.trim()}`);
  }

  protected override renderRowExtra(row: NphTableRow, level: number, open: boolean): TemplateResult | typeof nothing {
    const node = row as NphTreeTableRow;
    if (!open || node.error !== true || this.rowLoading(node)) return nothing;
    const id = `error ${node.key.trim()}`;
    const message = trimmed(this.errorText);
    const action = trimmed(this.retryText);
    /* The children's level has one indent per level above it; the chevron space follows. */
    const steps = Array.from({ length: level + 1 }, () => html`<span class="error-indent"></span>`);
    return html`<tr
      class=${this.hasActionCells() ? 'error-row tall' : 'error-row'}
      data-tree-row=${id}
      tabindex=${this.stop === id ? '0' : '-1'}
      aria-level=${level + 1}
      aria-posinset="1"
      aria-setsize="1"
      @click=${() => this.retry(node)}
    >
      ${this.withSelection ? html`<td class="select" tabindex="-1"></td>` : nothing}
      <td class="error-cell" colspan=${this.columnCount - this.leadingColumns} tabindex="-1">
        <div class="error-line">
          ${steps}
          <span class="error-block">
            <nph-icon class="error-icon" name=${NPH_TREE_TABLE_ICONS.error} variant="light" size="sm"></nph-icon>
            <span class="error-text">${message}</span>
            <span class="error-action">${action}</span>
          </span>
        </div>
      </td>
    </tr>`;
  }

  protected override activateRow(row: HTMLTableRowElement): boolean {
    if (!row.classList.contains('error-row')) return false;
    const key = (row.getAttribute('data-tree-row') ?? '').replace(/^error /, '');
    const node = this.errorRows().find((candidate) => candidate.key.trim() === key);
    if (node !== undefined) this.retry(node);
    return true;
  }

  /**
   * Try again: the error row leaves, the branch goes back to loading and the page is asked. A
   * focus that was on the error row goes to the branch row, the nearest one still drawn.
   */
  private retry(row: NphTreeTableRow): void {
    const key = row.key.trim();
    const errorId = `error ${key}`;
    const rows = [...this.renderRoot.querySelectorAll<HTMLTableRowElement>('tr[data-tree-row]')];
    const holder = rows.find((candidate) => candidate.getAttribute('data-tree-row') === errorId);
    const hadFocus = holder?.matches(':focus, :focus-within') ?? false;
    this.retrying.set(key, row);
    if (hadFocus) this.activeRow = `row ${key}`;
    this.requestUpdate();
    this.emitLoad(key, true);
    if (hadFocus) {
      void this.updateComplete.then(() => {
        const parent = [...this.renderRoot.querySelectorAll<HTMLTableRowElement>('tr[data-tree-row]')].find(
          (candidate) => candidate.getAttribute('data-tree-row') === `row ${key}`,
        );
        parent?.focus();
      });
    }
  }

  /* ----- the pointer on a cut text -------------------------------------------------------- */

  /**
   * The balloon of a cut text opens on hover only on an element in the Tab order (P77). While the
   * pointer is over a cut text, its row takes the Tab stop, in the capture phase and before the
   * balloon hears the pointer, and gives it back when the pointer goes to another row, leaves the
   * table or the person presses Tab, as `nph-tree` does.
   */
  private readonly onPointerOver = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    const target = event.target as Element | null;
    const rowId = target?.closest?.('tr[data-tree-row]')?.getAttribute('data-tree-row') ?? '';
    if (this.hoverRestore !== null && rowId !== this.activeRow) this.releaseHover();
    const cell = target?.closest?.('td.truncated');
    if (cell instanceof HTMLElement && rowId !== '' && cell.tabIndex < 0) {
      if (this.hoverRestore === null) this.hoverRestore = this.activeRow;
      this.activeRow = rowId;
      cell.tabIndex = 0;
      this.requestUpdate();
    }
  };

  private readonly releaseHover = (): void => {
    if (this.hoverRestore === null) return;
    this.activeRow = this.hoverRestore;
    this.hoverRestore = null;
    this.requestUpdate();
  };

  private readonly onKeyDownCapture = (event: KeyboardEvent): void => {
    if (event.key === 'Tab') this.releaseHover();
  };

  /** The focus is the authority on the Tab stop: what the pointer lent is not given back. */
  private readonly onFocusInCapture = (): void => {
    this.hoverRestore = null;
  };
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphTreeTable);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-tree-table': NphTreeTable;
  }
  interface HTMLElementEventMap {
    'nph-row-load': CustomEvent<NphTreeTableLoadDetail>;
  }
}
