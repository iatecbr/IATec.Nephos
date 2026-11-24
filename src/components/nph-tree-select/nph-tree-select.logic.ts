/**
 * The pure rules of `nph-tree-select`, with no DOM: they are proved apart from the field.
 *
 * - the filter keeps the items that match the typed text and the ancestors of every match, the same rule of
 *   text as the `nph-combobox` (DSA-46: no difference of case or accent), and opens those ancestors;
 * - the chips of the multiple choice: an item with the whole branch checked is one chip, the parent's;
 * - the path of an item, for the accessible name;
 * - the letter search of the single choice (D-1): the next visible item after the active one that starts with
 *   the typed letters, around the end of the list.
 */
import { matches } from '../nph-combobox/nph-combobox.list';
import type { CheckState, NphTreeNode, Row } from '../nph-tree/nph-tree.model';

/** The tree with the items that match and the ancestors of each match, and the ids of the branches to open. */
export interface FilteredTree {
  items: NphTreeNode[];
  open: Set<string>;
}

/**
 * Keeps an item when its label matches the query or when one of its loaded descendants is kept. A kept item
 * keeps only its kept children; an item that matches and has none is drawn as a leaf. A branch with kept
 * children is open. An empty query keeps everything and opens nothing.
 */
export function filterTree(items: readonly NphTreeNode[], query: string): FilteredTree {
  const open = new Set<string>();
  if (query.trim() === '') return { items: [...items], open };
  const keep = (nodes: readonly NphTreeNode[]): NphTreeNode[] => {
    const kept: NphTreeNode[] = [];
    for (const node of nodes) {
      const children = keep(node.children ?? []);
      if (children.length > 0) {
        open.add(node.id);
        kept.push({ ...node, children });
      } else if (matches(node.label, query)) {
        kept.push(node.disabled === true ? { id: node.id, label: node.label, disabled: true } : { id: node.id, label: node.label });
      }
    }
    return kept;
  };
  return { items: keep(items), open };
}

/** The node with the id, anywhere in the tree. */
export function findNode(items: readonly NphTreeNode[], id: string): NphTreeNode | null {
  for (const node of items) {
    if (node.id === id) return node;
    const inner = findNode(node.children ?? [], id);
    if (inner !== null) return inner;
  }
  return null;
}

/** The labels from the first level down to the item, or `[]` when the id is not in the tree. */
export function pathOf(items: readonly NphTreeNode[], id: string): string[] {
  for (const node of items) {
    if (node.id === id) return [node.label];
    const inner = pathOf(node.children ?? [], id);
    if (inner.length > 0) return [node.label, ...inner];
  }
  return [];
}

/** The ids of the ancestors of an item, from the first level down. */
export function ancestorIds(items: readonly NphTreeNode[], id: string): string[] {
  for (const node of items) {
    if (node.id === id) return [];
    const inner = ancestorIds(node.children ?? [], id);
    if (inner.length > 0 || findNode(node.children ?? [], id) !== null) return [node.id, ...inner];
  }
  return [];
}

/** Every branch that has loaded children: the ones that count for the cascade. */
export function branchIds(items: readonly NphTreeNode[]): string[] {
  const ids: string[] = [];
  const walk = (nodes: readonly NphTreeNode[]): void => {
    for (const node of nodes) {
      if (Array.isArray(node.children) && node.children.length > 0) {
        ids.push(node.id);
        walk(node.children);
      }
    }
  };
  walk(items);
  return ids;
}

/**
 * The chips of the multiple choice: the items in the `checked` state whose parent is not, in tree order.
 * A whole branch checked is one chip, the parent's; the children it covers have none.
 */
export function chipNodes(items: readonly NphTreeNode[], states: ReadonlyMap<string, CheckState>): NphTreeNode[] {
  const chips: NphTreeNode[] = [];
  const walk = (nodes: readonly NphTreeNode[]): void => {
    for (const node of nodes) {
      if (states.get(node.id) === 'checked') {
        chips.push(node);
      } else {
        walk(node.children ?? []);
      }
    }
  };
  walk(items);
  return chips;
}

/** The first drawn item that matches the query: the one that becomes active on typing (DSA-46 D-5). */
export function firstMatch(visible: readonly Row[], query: string): Row | null {
  if (query.trim() === '') return null;
  return visible.find((row) => row.kind === 'node' && row.node.disabled !== true && matches(row.node.label, query)) ?? null;
}

/**
 * The letter search (D-1): the typed letters, kept together, find the next visible item after `from` whose
 * label starts with them, around the end. The same letter typed again cycles. Only items that are drawn.
 * With `from` null the search starts at the first item.
 */
export function typeaheadRow(visible: readonly Row[], from: string | null, typed: string): Row | null {
  const nodes = visible.filter((row) => row.kind === 'node');
  if (nodes.length === 0 || typed === '') return null;
  const repeated = [...typed].every((letter) => letter === typed[0]);
  const search = repeated ? (typed[0] ?? '') : typed;
  const index = from === null ? -1 : nodes.findIndex((row) => row.key === from);
  /* A new search starts after the current item when it is one letter; more letters search from it. */
  const first = index === -1 ? 0 : index + (repeated || typed.length === 1 ? 1 : 0);
  const ordered = [...nodes.slice(first), ...nodes.slice(0, first)];
  return ordered.find((row) => row.node.label.trim().toLocaleLowerCase().startsWith(search)) ?? null;
}

/** The reason `items` cannot be drawn, or `null`: the same causes as the `nph-tree`. */
export function itemsProblem(items: unknown): string | null {
  if (!Array.isArray(items)) return '`items` is not a list. Give it the nodes of the first level.';
  const seen = new Set<string>();
  const walk = (nodes: readonly NphTreeNode[], where: string): string | null => {
    for (const [index, node] of nodes.entries()) {
      const spot = `${where}${String(index + 1)}`;
      if (node === null || typeof node !== 'object' || typeof node.id !== 'string' || node.id.trim() === '') {
        return `the node ${spot} has no \`id\`. Every node has a unique id.`;
      }
      if (typeof node.label !== 'string' || node.label.trim() === '') return `the node "${node.id}" has no \`label\`.`;
      if (seen.has(node.id)) return `the id "${node.id}" is repeated. Every node has a unique id.`;
      seen.add(node.id);
      if (node.children !== undefined) {
        if (!Array.isArray(node.children)) return `\`children\` of the node "${node.id}" is not a list.`;
        const inner = walk(node.children, `${spot}.`);
        if (inner !== null) return inner;
      }
    }
    return null;
  };
  return walk(items as readonly NphTreeNode[], '');
}
