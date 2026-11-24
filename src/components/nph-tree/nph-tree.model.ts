/**
 * The model of `nph-tree`, as a module another piece takes: `nph-tree-select` (DSA-94) draws the rows
 * of the tree in its own shadow root, because an `aria-activedescendant` on the field cannot point into
 * the shadow root of another element (the same path as `nph-combobox.list.ts`, P95). It is not a tag.
 *
 * What it gives, with no DOM and no state of its own:
 * - the nodes and the rows: a node, or the error row of a branch that failed to load;
 * - the rows as drawn, in order, with the lookups the render and the keys need;
 * - the check state of every node, with the cascade (a checked parent checks its enabled children, and
 *   is mixed when only part of them is; a disabled item stays out of the count);
 * - the next list of checked ids when one item is checked or unchecked.
 */

/* The node is declared with the component, which is the public file; the module only reads its type. */
import type { NphTreeNode } from './nph-tree';
export type { NphTreeNode };

/** The skeleton rows of the first load of the tree. */
export const NPH_TREE_SKELETON_ROWS = 3;

export type CheckState = 'checked' | 'unchecked' | 'mixed';

/** An item as drawn: a node, or the error row of a branch. */
export interface Row {
  key: string;
  kind: 'node' | 'error';
  node: NphTreeNode;
  parentKey: string | null;
  level: number;
  setSize: number;
  position: number;
  branch: boolean;
  open: boolean;
  loading: boolean;
  /** What the group under the item holds: its children, the error row, or nothing. */
  content: 'children' | 'error' | 'none';
}

/** The key of the error row of a branch: a character no `id` can be confused with in a lookup. */
export const ERROR_SUFFIX = '\u0000error';

/** The rows of a tree and the lookups over them. */
export interface TreeModel {
  rows: Row[];
  visible: Row[];
  rowByKey: Map<string, Row>;
  parentOf: Map<string, string | null>;
}

export function isBranch(node: NphTreeNode): boolean {
  return node.branch === true || (Array.isArray(node.children) && node.children.length > 0);
}

/** A branch the consumer has not loaded yet: no children, no failure, not asked to load by the node. */
export function isUnloaded(node: NphTreeNode): boolean {
  return node.branch === true && node.children === undefined;
}

/**
 * The rows, the drawn ones in order and the lookups. `loadsNow` says whether an open branch is loading
 * now: the node says so, or "Try again" was pressed, or it has no children and no failure.
 */
export function buildModel(
  items: readonly NphTreeNode[],
  expanded: readonly string[],
  loadsNow: (node: NphTreeNode) => boolean,
): TreeModel {
  const model: TreeModel = { rows: [], visible: [], rowByKey: new Map(), parentOf: new Map() };
  const open = new Set(Array.isArray(expanded) ? expanded : []);
  const walk = (nodes: readonly NphTreeNode[], parentKey: string | null, level: number): void => {
    for (const [index, node] of nodes.entries()) {
      const branch = isBranch(node);
      const isOpen = branch && open.has(node.id);
      const loading = isOpen && loadsNow(node);
      const content: Row['content'] = !isOpen || loading ? 'none' : node.error === true ? 'error' : 'children';
      const row: Row = {
        key: node.id,
        kind: 'node',
        node,
        parentKey,
        level,
        setSize: nodes.length,
        position: index + 1,
        branch,
        open: isOpen,
        loading,
        content,
      };
      model.parentOf.set(row.key, parentKey);
      model.rowByKey.set(row.key, row);
      model.rows.push(row);
      model.visible.push(row);
      if (content === 'children') {
        walk(node.children ?? [], node.id, level + 1);
      } else if (content === 'error') {
        const errorRow: Row = {
          key: node.id + ERROR_SUFFIX,
          kind: 'error',
          node,
          parentKey: node.id,
          level: level + 1,
          setSize: 1,
          position: 1,
          branch: false,
          open: false,
          loading: false,
          content: 'none',
        };
        model.parentOf.set(errorRow.key, node.id);
        model.rowByKey.set(errorRow.key, errorRow);
        model.rows.push(errorRow);
        model.visible.push(errorRow);
      }
    }
  };
  walk(Array.isArray(items) ? items : [], null, 1);
  return model;
}

/**
 * The state of every node from the ids that are checked. With the cascade on, a checked parent checks
 * its enabled children, a parent is checked when all its enabled children are, mixed when only part of
 * them is, and a disabled item keeps its own state and stays out of its parent's count.
 */
export function computeChecks(items: readonly NphTreeNode[], ids: ReadonlySet<string>, cascade: boolean): Map<string, CheckState> {
  const states = new Map<string, CheckState>();
  const visit = (node: NphTreeNode, inherited: boolean): CheckState => {
    const own = ids.has(node.id) || inherited;
    const children = Array.isArray(node.children) ? node.children : [];
    let state: CheckState = own ? 'checked' : 'unchecked';
    if (!cascade || children.length === 0 || node.disabled === true) {
      /* A disabled node keeps its own mark and neither gives it to its children nor takes theirs. */
      for (const child of children) visit(child, false);
    } else {
      const counted: CheckState[] = [];
      for (const child of children) {
        const inner = visit(child, own && child.disabled !== true);
        if (child.disabled !== true) counted.push(inner);
      }
      if (counted.length > 0) {
        state = counted.every((value) => value === 'checked')
          ? 'checked'
          : counted.every((value) => value === 'unchecked')
            ? 'unchecked'
            : 'mixed';
      }
    }
    states.set(node.id, state);
    return state;
  };
  for (const node of items) visit(node, false);
  return states;
}

/** The ids in the `checked` state, in the order of the tree, the closed branches included. */
export function checkedIds(items: readonly NphTreeNode[], states: ReadonlyMap<string, CheckState>): string[] {
  const ids: string[] = [];
  const walk = (nodes: readonly NphTreeNode[]): void => {
    for (const node of nodes) {
      if (states.get(node.id) === 'checked') ids.push(node.id);
      walk(node.children ?? []);
    }
  };
  walk(items);
  return ids;
}

/**
 * Checks or unchecks an item: a mixed or an unchecked item gets checked, a checked one unchecked. With the
 * cascade, its enabled descendants follow and the ancestors are decided again from their children. Returns
 * whether the item is now checked and the whole list of checked ids.
 */
export function toggleCheck(
  items: readonly NphTreeNode[],
  model: TreeModel,
  states: ReadonlyMap<string, CheckState>,
  id: string,
  cascade: boolean,
): { checked: boolean; value: string[] } {
  const row = model.rowByKey.get(id);
  const checked = states.get(id) !== 'checked';
  const next = new Set(checkedIds(items, states));
  const apply = (node: NphTreeNode): void => {
    if (checked) next.add(node.id);
    else next.delete(node.id);
    if (cascade) {
      for (const child of node.children ?? []) {
        if (child.disabled !== true) apply(child);
      }
    }
  };
  if (row !== undefined) apply(row.node);
  if (cascade) {
    /* The parents are decided again from their children: a checked parent with an unchecked child is no longer checked. */
    let parent = model.parentOf.get(id);
    while (parent !== null && parent !== undefined) {
      /* A disabled ancestor is out of the count, so nothing above it depends on this item: the climb stops. */
      if (model.rowByKey.get(parent)?.node.disabled === true) break;
      next.delete(parent);
      parent = model.parentOf.get(parent);
    }
  }
  return { checked, value: checkedIds(items, computeChecks(items, next, cascade)) };
}
