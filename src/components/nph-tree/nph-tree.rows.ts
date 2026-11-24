/**
 * The rows of `nph-tree`, as a module another piece takes: `nph-tree-select` (DSA-94) draws them in its own
 * shadow root, so an `aria-activedescendant` on its field can point at a row (the APG combobox with a tree
 * popup). It is not a tag: the piece that owns the tree draws the rows with the styles exported here.
 *
 * It gives the drawing of one level of items, of the error row, of the first load and of the empty tree, with
 * the roles, the ARIA state and the parts of an item (chevron or spinner, box, icon, label). The state of the
 * tree (the rows, the check states, the selection) and what a click does come from the owner, by the context.
 *
 * Two ways to hold the focus, by the context:
 * - roving (`tabKey` given): the `nph-tree` itself: one row has `tabindex="0"`, the others `-1`, and the
 *   focus is the DOM focus (`:focus-visible`);
 * - descendant (`tabKey` left out): the rows take no `tabindex`; the owner keeps the DOM focus on its field
 *   and says which row is active with `focusKey`, and that row draws the same focus border, by `data-focus`.
 */
import { html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import '../nph-checkbox/nph-checkbox';
import '../nph-empty/nph-empty';
import '../nph-icon/nph-icon';
import '../nph-skeleton/nph-skeleton';
import '../nph-spinner/nph-spinner';
import { ERROR_SUFFIX, NPH_TREE_SKELETON_ROWS } from './nph-tree.model';
import type { CheckState, NphTreeNode, Row } from './nph-tree.model';
import rowsCss from './nph-tree.rows.css?inline';

/** The style of the rows: the item, its parts, the states, the error row and the first load. */
export const treeRowStyles = unsafeCSS(rowsCss);

/** What the owner of the tree gives the drawing. */
export interface TreeRowContext {
  readonly rowByKey: ReadonlyMap<string, Row>;
  readonly checkStates: ReadonlyMap<string, CheckState>;
  readonly selection: 'none' | 'single' | 'multiple';
  readonly selected: string | null;
  readonly icons: boolean;
  readonly errorText: string | null;
  readonly retryText: string | null;
  /** The id of the element of a row, unique in the shadow root that draws it. */
  domId(key: string): string;
  /** Roving: the key of the row that is the Tab stop. Left out: the rows take no `tabindex` (descendant). */
  readonly tabKey?: string | null;
  /** Descendant: the key of the row that draws the focus border with no DOM focus on it. */
  readonly focusKey?: string | null;
  onClick(row: Row, event: MouseEvent): void;
  onPointerenter?(row: Row, event: PointerEvent): void;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** The name read for the error row: the phrase and the action together. */
export function retryName(context: Pick<TreeRowContext, 'errorText' | 'retryText'>): string {
  return [text(context.errorText), text(context.retryText)].filter((part) => part !== '').join(' ');
}

function nodeIcon(row: Row): string {
  return row.branch ? (row.open ? 'folder-open' : 'folder') : 'file';
}

/** The chevron target: the chevron of a branch, the spinner of a branch that loads, or the empty place of a leaf. */
function renderToggle(row: Row): TemplateResult {
  if (row.loading) {
    return html`<span class="toggle" aria-hidden="true"><nph-spinner size="sm"></nph-spinner></span>`;
  }
  if (!row.branch) {
    return html`<span class="toggle" aria-hidden="true"></span>`;
  }
  return html`<span class="toggle" aria-hidden="true"
    ><nph-icon class="chevron" name="chevron-right" variant="light" size="sm"></nph-icon
  ></span>`;
}

function renderBox(context: TreeRowContext, row: Row): TemplateResult | typeof nothing {
  if (context.selection !== 'multiple') return nothing;
  const state = context.checkStates.get(row.node.id) ?? 'unchecked';
  /* Never `disabled` here: the opacity of the item fades the box, once. */
  return html`<nph-checkbox
    class="box"
    inert
    aria-hidden="true"
    label=${row.node.label}
    .checked=${state === 'checked'}
    .indeterminate=${state === 'mixed'}
  ></nph-checkbox>`;
}

function tabindexOf(context: TreeRowContext, row: Row): string | typeof nothing {
  if (context.tabKey === undefined) return nothing;
  return row.key === context.tabKey ? '0' : '-1';
}

export function renderNodeItem(context: TreeRowContext, row: Row): TemplateResult {
  const node = row.node;
  const id = context.domId(row.key);
  const disabled = node.disabled === true;
  const multiple = context.selection === 'multiple';
  const selectedState = context.selection === 'single' ? (context.selected === node.id ? 'true' : 'false') : nothing;
  const checkedState = multiple
    ? (() => {
        const state = context.checkStates.get(node.id) ?? 'unchecked';
        return state === 'mixed' ? 'mixed' : state === 'checked' ? 'true' : 'false';
      })()
    : nothing;
  return html`<div
    class="item"
    id=${id}
    role="treeitem"
    data-key=${row.key}
    tabindex=${tabindexOf(context, row)}
    aria-label=${text(node.label)}
    aria-level=${String(row.level)}
    aria-setsize=${String(row.setSize)}
    aria-posinset=${String(row.position)}
    aria-expanded=${row.branch ? (row.open ? 'true' : 'false') : nothing}
    aria-selected=${selectedState}
    aria-checked=${checkedState}
    aria-disabled=${disabled ? 'true' : nothing}
    aria-busy=${row.loading ? 'true' : nothing}
    aria-owns=${row.content === 'none' ? nothing : `group-${id}`}
    ?data-selected=${context.selection === 'single' && context.selected === node.id}
    ?data-focus=${context.focusKey === row.key}
    @click=${(event: MouseEvent) => context.onClick(row, event)}
    @pointerenter=${context.onPointerenter === undefined
      ? nothing
      : { handleEvent: (event: PointerEvent) => context.onPointerenter?.(row, event), capture: true }}
  >
    <div class="face">
      ${renderToggle(row)}${renderBox(context, row)}${context.icons
        ? html`<nph-icon class="node-icon" name=${nodeIcon(row)} variant="light" size="sm"></nph-icon>`
        : nothing}<span class="label" data-key=${row.key}>${text(node.label)}</span>
    </div>
  </div>`;
}

export function renderErrorItem(context: TreeRowContext, row: Row): TemplateResult {
  const id = context.domId(row.key);
  const name = retryName(context);
  return html`<div
    class="item error-item"
    id=${id}
    role="treeitem"
    data-key=${row.key}
    tabindex=${tabindexOf(context, row)}
    aria-label=${name === '' ? nothing : name}
    aria-level=${String(row.level)}
    aria-setsize=${String(row.setSize)}
    aria-posinset=${String(row.position)}
    ?data-focus=${context.focusKey === row.key}
    @click=${(event: MouseEvent) => context.onClick(row, event)}
  >
    <div class="face">
      <span class="toggle" aria-hidden="true"
        ><nph-icon class="error-icon" name="triangle-exclamation" variant="light" size="sm"></nph-icon
      ></span>
      <span class="error-body"
        ><span class="error-text">${text(context.errorText)}</span
        ><span class="retry">${text(context.retryText)}</span></span
      >
    </div>
  </div>`;
}

/** The nodes of a level and the group of the open branch under each one. */
export function renderLevel(context: TreeRowContext, nodes: readonly NphTreeNode[]): TemplateResult {
  /* Keyed by `id`: an item that leaves takes its own element, and its focus, with it, instead of lending
     the element to the item that moves into its place. */
  return html`${repeat(
    nodes,
    (node) => node.id,
    (node) => {
      const row = context.rowByKey.get(node.id) as Row;
      const group =
        row.content === 'children'
          ? html`<ul class="group" id=${`group-${context.domId(row.key)}`} role="group">${renderLevel(context, node.children ?? [])}</ul>`
          : row.content === 'error'
            ? html`<ul class="group" id=${`group-${context.domId(row.key)}`} role="group">
                <li role="none">${renderErrorItem(context, context.rowByKey.get(row.key + ERROR_SUFFIX) as Row)}</li>
              </ul>`
            : nothing;
      return html`<li role="none">${renderNodeItem(context, row)}${group}</li>`;
    },
  )}`;
}

/** The first load: skeleton rows at the height of an item. */
export function renderSkeleton(): TemplateResult {
  return html`<div class="skeleton" aria-hidden="true">
    ${Array.from({ length: NPH_TREE_SKELETON_ROWS }, () => html`<div class="skeleton-row"><nph-skeleton shape="line"></nph-skeleton></div>`)}
  </div>`;
}

/** The empty tree: the `nph-empty` with the heading and the description of the owner. */
export function renderEmpty(heading: string | null, description: string | null): TemplateResult {
  return html`<nph-empty heading=${text(heading)} description=${text(description)}></nph-empty>`;
}
