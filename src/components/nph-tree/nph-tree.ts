/**
 * `nph-tree` — a list of items in levels: each branch opens and closes, and the person chooses
 * one item or several.
 *
 * Contract accepted in Figma (documentation frame `5876:216753`, sets `5485:350`, `5485:421` and
 * `5485:766`), recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-75, sheet
 * `fichas/nph-tree.md`, `design.md` and decision P118 — nph-tree: API and semantics. The three
 * Figma sets (the item, the group of children and the tree) are parts this one tag draws, not tags
 * of their own: the roles, the roving Tab stop, the balloon of a cut label and the keyboard need one
 * shadow root (P118, item 1):
 * - `items`: the nodes, as a list of `{ id, label, children?, branch?, disabled?, loading?, error? }`.
 *   Property only. `id` is unique and `label` is the text of the item. A node is a branch when it has
 *   children or `branch: true`; a branch with `branch: true` and no `children` is a branch that is not
 *   loaded yet. The list is replaced, not changed in place;
 * - `selection`: `none` (the default), `single` or `multiple`; reflects. The Figma `seleção`;
 * - `selected`: the id of the chosen item, in single selection; `checked`: the ids of the checked
 *   items, in multiple selection; `expanded`: the ids of the open branches. They are the current state,
 *   as in the native controls: the person changes them, and so does the code, and an event says what
 *   the person did. With the cascade on (the default) a checked parent checks its enabled children and
 *   shows mixed when only part of them is checked; a disabled item stays out of that count.
 *   `check-strictly` (`checkStrictly`) turns the cascade off;
 * - `icons`: the folder on a branch and the file on a leaf, on every node or on none; reflects. The
 *   Figma `ícone`;
 * - `loading`: the first load of the tree, three `nph-skeleton` rows in place of the list. A branch
 *   that opens with no children loads on demand: the spinner takes the place of its chevron;
 * - `empty-heading` and `empty-description`: the texts of the empty tree; `error-text` and
 *   `retry-text`: the phrase and the action of the error row. Already localized by the consuming
 *   application;
 * - the accessible name is the `aria-label` or `aria-labelledby` of the host, or `label`;
 * - events, all `bubbles` and `composed`, only when the person acts: `nph-tree-toggle`
 *   `{ id, expanded }`, `nph-tree-select` `{ id }`, `nph-tree-check` `{ id, checked, value }` and
 *   `nph-tree-load` `{ id, retry }`;
 * - `itemIdOf(element)`: the `id` of the node whose row holds the element, so a menu opened on the
 *   tree (`nph-context-menu`) knows which node it is for;
 * - `focus()`: the host is not focusable itself, so it puts the focus on the item that held it last, else
 *   on the Tab stop; a menu that closes gives the focus back to its object this way;
 * - no slot, no `::part` and no color property.
 *
 * SEMANTICS (WAI-ARIA APG tree view) — the host is `role="tree"` through `ElementInternals`, so its
 * `aria-label` and `aria-labelledby` name it; inside, a `treeitem` per node and a `group` per open
 * branch, joined by `aria-owns`. `aria-expanded` on the branches; `aria-selected` in single selection
 * and `aria-checked` in multiple, never both; `aria-multiselectable` in multiple; `aria-level`,
 * `aria-setsize` and `aria-posinset` on every item; `aria-disabled` on a disabled item, which takes
 * focus and does nothing; `aria-busy` on a branch that loads. The name of an item is its label: the
 * chevron, the icon, the box and the spinner are decorative. One Tab stop: the selected item, or the
 * first, again each time the focus leaves the tree; the arrows, Home, End, `*` and a letter move inside.
 *
 * Invalid input draws nothing and emits `console.error` only in development, one per cause (P21,
 * P66): `items` that is not a list, a node with no `id` or `label`, a repeated `id`, `children` that is
 * not a list, a `selection` outside the list. A tree with no name, an error row with no texts and an
 * empty tree with no heading draw and warn once. An empty `items` is a mount, not a problem.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import '../nph-checkbox/nph-checkbox';
import '../nph-empty/nph-empty';
import '../nph-icon/nph-icon';
import '../nph-skeleton/nph-skeleton';
import '../nph-spinner/nph-spinner';
import '../nph-tooltip/nph-tooltip';
import treeCss from './nph-tree.css?inline';

const TAG = 'nph-tree';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The three selections of the Figma `seleção`: none, single and multiple. */
export const NPH_TREE_SELECTIONS = ['none', 'single', 'multiple'] as const;
export type NphTreeSelection = (typeof NPH_TREE_SELECTIONS)[number];

/** The skeleton rows of the first load of the tree. */
export const NPH_TREE_SKELETON_ROWS = 3;

/** One node of the tree. */
export interface NphTreeNode {
  /** Unique in the tree. The value `selected`, `checked`, `expanded` and the events carry. */
  id: string;
  /** The text of the item. Already localized. */
  label: string;
  /** The nodes of the next level, when they are loaded. */
  children?: readonly NphTreeNode[];
  /** A branch whose children are not loaded yet: it opens and asks for them. */
  branch?: boolean;
  /** The item takes focus by the arrows and does nothing. */
  disabled?: boolean;
  /** The branch is loading, whatever its children. */
  loading?: boolean;
  /** The children could not be loaded: the error row takes their place. */
  error?: boolean;
}

/** The detail of `nph-tree-toggle`: the branch the person opened or closed. */
export interface NphTreeToggleDetail {
  id: string;
  expanded: boolean;
}

/** The detail of `nph-tree-select`: the item the person chose, in single selection. */
export interface NphTreeSelectDetail {
  id: string;
}

/** The detail of `nph-tree-check`: the item the person checked or unchecked, and the whole list now. */
export interface NphTreeCheckDetail {
  id: string;
  checked: boolean;
  value: string[];
}

/** The detail of `nph-tree-load`: a branch that asks for its children, or "Try again" on it. */
export interface NphTreeLoadDetail {
  id: string;
  retry: boolean;
}

type CheckState = 'checked' | 'unchecked' | 'mixed';

/** An item as drawn: a node, or the error row of a branch. */
interface Row {
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
const ERROR_SUFFIX = '\u0000error';

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devMessage(kind: 'error' | 'warn', message: string): void {
  if (import.meta.env?.DEV) {
    console[kind](`[${TAG}] ${message}`);
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isBranch(node: NphTreeNode): boolean {
  return node.branch === true || (Array.isArray(node.children) && node.children.length > 0);
}

export class NphTree extends LitElement {
  static override styles = unsafeCSS(treeCss);

  static override properties = {
    items: { attribute: false },
    selection: { type: String, reflect: true },
    selected: { attribute: false },
    checked: { attribute: false },
    expanded: { attribute: false },
    icons: { type: Boolean, reflect: true },
    checkStrictly: { type: Boolean, attribute: 'check-strictly', reflect: true },
    loading: { type: Boolean, reflect: true },
    label: { type: String },
    emptyHeading: { type: String, attribute: 'empty-heading' },
    emptyDescription: { type: String, attribute: 'empty-description' },
    errorText: { type: String, attribute: 'error-text' },
    retryText: { type: String, attribute: 'retry-text' },
    /* The host `aria-label` is read here only to know the tree has a name. It cannot be a property
     * called `ariaLabel`: that name is the native ARIA reflection of every element. */
    hostName: { type: String, attribute: 'aria-label' },
    activeKey: { state: true },
    cutKeys: { state: true },
  };

  /** The nodes of the first level, with the levels under them. */
  declare items: readonly NphTreeNode[];

  /** `none` (open and close only), `single` or `multiple`. */
  declare selection: NphTreeSelection;

  /** The id of the chosen item, in single selection. `null` when none is chosen. */
  declare selected: string | null;

  /** The ids of the checked items, in multiple selection. */
  declare checked: readonly string[];

  /** The ids of the open branches. */
  declare expanded: readonly string[];

  /** The folder and the file, on every node or on none. */
  declare icons: boolean;

  /** Off (the default), a parent checks and unchecks its children and shows mixed. On, every item is independent. */
  declare checkStrictly: boolean;

  /** The first load of the tree: the skeleton rows, while `items` is empty. */
  declare loading: boolean;

  /** The accessible name of the tree, when the host has no `aria-label` or `aria-labelledby`. Already localized. */
  declare label: string | null;

  /** The title of the empty tree. Already localized. */
  declare emptyHeading: string | null;

  /** The line under the title of the empty tree. Already localized. */
  declare emptyDescription: string | null;

  /** The phrase of the error row, such as "Couldn't load.". Already localized. */
  declare errorText: string | null;

  /** The action of the error row, such as "Try again". Already localized. */
  declare retryText: string | null;

  /** The host `aria-label`. */
  declare hostName: string | null;

  /** The key of the item that is the Tab stop. Not API. */
  declare protected activeKey: string | null;

  /** The keys of the items whose label is cut. Measured, not API. */
  declare protected cutKeys: ReadonlySet<string>;

  private readonly internals: ElementInternals;
  private problem: string | null = null;
  private reported = '';
  private warned = new Set<string>();
  private resizeObserver: ResizeObserver | undefined;
  private observed: Element[] = [];

  /* The model of the current render. */
  private rows: Row[] = [];
  private visible: Row[] = [];
  private rowByKey = new Map<string, Row>();
  private parentOf = new Map<string, string | null>();
  private checkStates = new Map<string, CheckState>();
  private domIds = new Map<string, string>();
  private nextDomId = 0;

  /* The branches whose "Try again" was pressed, until the consumer replaces `items`. */
  private retrying = new Set<string>();

  /* The item that held the focus last, for `focus()`: a menu that closes gives the focus back to the host. */
  private lastFocusKey: string | null = null;

  /* The focus before an update, to put it back when the item that held it leaves. */
  private focusKey: string | null = null;
  private focusAncestors: string[] = [];
  private lastParentOf = new Map<string, string | null>();

  /* The items that took `tabindex="0"` only to hold the balloon while the pointer is over them. */
  private hoverStops = new Set<HTMLElement>();

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.items = [];
    this.selection = 'none';
    this.selected = null;
    this.checked = [];
    this.expanded = [];
    this.icons = false;
    this.checkStrictly = false;
    this.loading = false;
    this.label = null;
    this.emptyHeading = null;
    this.emptyDescription = null;
    this.errorText = null;
    this.retryText = null;
    this.hostName = null;
    this.activeKey = null;
    this.cutKeys = new Set();
    /* On the host, not on the list: the balloons are drawn beside the list, and going from a cut item
       onto its balloon must not take the Tab stop away from the item (WCAG 1.4.13). */
    this.addEventListener('pointerleave', this.onPointerleave);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.measure());
    /* The font changes the width of the text once it loads. */
    document.fonts?.ready.then(() => this.measure());
    /* A tree moved to another place observes its labels again: the observer was disconnected when it
       left, and only an update installs it. */
    if (this.hasUpdated) this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.observed = [];
    this.releaseHoverStops();
  }

  /* ----- public ------------------------------------------------------------ */

  /**
   * The `id` of the node whose row holds the element, or `null`. A menu opened on the tree
   * (`nph-context-menu`) reports the element under the pointer as its `origin`; this says which node
   * that is. The error row answers with the branch it belongs to.
   */
  itemIdOf(element: Element | null | undefined): string | null {
    const item = element?.closest?.('[role="treeitem"]');
    if (!(item instanceof HTMLElement) || !this.renderRoot.contains(item)) return null;
    const key = item.dataset.key ?? '';
    const row = this.rowByKey.get(key);
    return row === undefined ? null : row.node.id;
  }

  /**
   * The host is not focusable itself: `focus()` puts the focus on the item that held it last, else on the
   * Tab stop. It is what a menu opened on the tree (`nph-context-menu`) calls when it closes.
   */
  override focus(options?: FocusOptions): void {
    const last = this.lastFocusKey;
    const key = last !== null && this.visible.some((row) => row.key === last) ? last : this.tabKey();
    if (key !== null) this.focusRow(key, options);
  }

  /* ----- validation -------------------------------------------------------- */

  private get empty(): boolean {
    return Array.isArray(this.items) && this.items.length === 0;
  }

  /** The reason the input is invalid, or `null`. */
  private validate(): string | null {
    if (!(NPH_TREE_SELECTIONS as readonly string[]).includes(this.selection)) {
      return `selection ${JSON.stringify(this.selection)} does not exist. Use ${NPH_TREE_SELECTIONS.map((value) => `"${value}"`).join(', ')}.`;
    }
    if (!Array.isArray(this.items)) {
      return '`items` is not a list. Give it the nodes of the first level.';
    }
    const seen = new Set<string>();
    const walk = (nodes: readonly NphTreeNode[], where: string): string | null => {
      for (const [index, node] of nodes.entries()) {
        const spot = `${where}${String(index + 1)}`;
        if (node === null || typeof node !== 'object' || text(node.id) === '') {
          return `the node ${spot} has no \`id\`. Every node has a unique id.`;
        }
        if (text(node.label) === '') {
          return `the node "${node.id}" has no \`label\`.`;
        }
        if (seen.has(node.id)) {
          return `the id "${node.id}" is repeated. Every node has a unique id.`;
        }
        seen.add(node.id);
        if (node.children !== undefined) {
          if (!Array.isArray(node.children)) {
            return `\`children\` of the node "${node.id}" is not a list.`;
          }
          const inner = walk(node.children, `${spot}.`);
          if (inner !== null) return inner;
        }
      }
      return null;
    };
    return walk(this.items, '');
  }

  /* ----- the model --------------------------------------------------------- */

  private get multiple(): boolean {
    return this.selection === 'multiple';
  }

  private get cascades(): boolean {
    return this.multiple && !this.checkStrictly;
  }

  /** A branch the consumer has not loaded yet: no children, no failure, not asked to load by the node. */
  private static unloaded(node: NphTreeNode): boolean {
    return node.branch === true && node.children === undefined;
  }

  /** Whether the branch loads now: the node says so, "Try again" was pressed, or it has no children and no failure. */
  private loadsNow(node: NphTreeNode): boolean {
    if (this.retrying.has(node.id) || node.loading === true) return true;
    return NphTree.unloaded(node) && node.error !== true;
  }

  /** The rows, the drawn ones in order and the lookups the render and the keys need. */
  private buildModel(): void {
    this.rows = [];
    this.visible = [];
    this.rowByKey = new Map();
    this.parentOf = new Map();
    const open = new Set(Array.isArray(this.expanded) ? this.expanded : []);
    const walk = (nodes: readonly NphTreeNode[], parentKey: string | null, level: number): void => {
      for (const [index, node] of nodes.entries()) {
        const branch = isBranch(node);
        const isOpen = branch && open.has(node.id);
        const loading = isOpen && this.loadsNow(node);
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
        this.parentOf.set(row.key, parentKey);
        this.rowByKey.set(row.key, row);
        this.rows.push(row);
        this.visible.push(row);
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
          this.parentOf.set(errorRow.key, node.id);
          this.rowByKey.set(errorRow.key, errorRow);
          this.rows.push(errorRow);
          this.visible.push(errorRow);
        }
      }
    };
    walk(Array.isArray(this.items) ? this.items : [], null, 1);
    this.checkStates = this.multiple ? this.computeChecks(new Set(Array.isArray(this.checked) ? this.checked : [])) : new Map();
  }

  /**
   * The state of every node from the ids that are checked. With the cascade on, a checked parent checks
   * its enabled children, a parent is checked when all its enabled children are, mixed when only part of
   * them is, and a disabled item keeps its own state and stays out of its parent's count.
   */
  private computeChecks(ids: ReadonlySet<string>): Map<string, CheckState> {
    const states = new Map<string, CheckState>();
    const cascade = !this.checkStrictly;
    const visit = (node: NphTreeNode, inherited: boolean): CheckState => {
      const own = ids.has(node.id) || inherited;
      const children = Array.isArray(node.children) ? node.children : [];
      let state: CheckState = own ? 'checked' : 'unchecked';
      if (!cascade || children.length === 0 || node.disabled === true) {
        for (const child of children) visit(child, cascade && own && child.disabled !== true);
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
    for (const node of this.items) visit(node, false);
    return states;
  }

  /** The ids in the `checked` state, in the order of the tree, the closed branches included. */
  private checkedIds(states: ReadonlyMap<string, CheckState>): string[] {
    const ids: string[] = [];
    const walk = (nodes: readonly NphTreeNode[]): void => {
      for (const node of nodes) {
        if (states.get(node.id) === 'checked') ids.push(node.id);
        walk(node.children ?? []);
      }
    };
    walk(this.items);
    return ids;
  }

  /** The key of the item that is the Tab stop: the active one if it is drawn, else the chosen one, else the first. */
  private tabKey(): string | null {
    if (this.activeKey !== null && this.rowByKey.has(this.activeKey) && this.visible.some((row) => row.key === this.activeKey)) {
      return this.activeKey;
    }
    if (this.activeKey !== null) {
      /* The item left: the nearest ancestor that is drawn takes the Tab stop. */
      let key: string | null | undefined = this.lastParentOf.get(this.activeKey) ?? this.parentOf.get(this.activeKey);
      while (key !== null && key !== undefined) {
        if (this.visible.some((row) => row.key === key)) return key;
        key = this.parentOf.get(key) ?? this.lastParentOf.get(key);
      }
    }
    if (this.selection === 'single' && this.selected !== null && this.visible.some((row) => row.key === this.selected)) {
      return this.selected;
    }
    return this.visible[0]?.key ?? null;
  }

  private domId(key: string): string {
    let id = this.domIds.get(key);
    if (id === undefined) {
      id = `item-${String(this.nextDomId)}`;
      this.nextDomId += 1;
      this.domIds.set(key, id);
    }
    return id;
  }

  /* ----- names and texts --------------------------------------------------- */

  /** Whether the tree has an accessible name: its `label`, or the `aria-label` or `aria-labelledby` of the host. */
  private hasName(): boolean {
    return text(this.label) !== '' || text(this.hostName) !== '' || this.hasAttribute('aria-labelledby');
  }

  private retryName(): string {
    return [text(this.errorText), text(this.retryText)].filter((part) => part !== '').join(' ');
  }

  /* ----- life cycle -------------------------------------------------------- */

  protected override willUpdate(changed: PropertyValues): void {
    /* The focus, before the render takes an item away: where to put it back if that item leaves. */
    const focused = this.renderRoot.querySelector<HTMLElement>('[role="treeitem"]:focus');
    this.focusKey = focused?.dataset.key ?? null;
    this.lastParentOf = this.parentOf;
    this.focusAncestors = [];
    if (this.focusKey !== null) {
      let key = this.parentOf.get(this.focusKey);
      while (key !== null && key !== undefined) {
        this.focusAncestors.push(key);
        key = this.parentOf.get(key);
      }
    }
    if (changed.has('items')) this.retrying.clear();
    this.problem = this.validate();
    if (this.problem !== null) {
      /* One message per cause: a re-render with the same input stays silent. */
      if (this.problem !== this.reported) {
        devMessage('error', this.problem);
      }
      this.reported = this.problem;
      this.rows = [];
      this.visible = [];
    } else {
      this.reported = '';
      this.buildModel();
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.problem === null);
    this.syncHost();
  }

  /** The host is the `tree`: its role and the state of the tree are set through `ElementInternals`. */
  private syncHost(): void {
    const drawsItems = this.problem === null && this.visible.length > 0;
    /* While the first load runs there are no items yet: the APG allows a tree with none while it is busy. */
    this.internals.role = drawsItems || (this.problem === null && this.skeleton) ? 'tree' : null;
    this.internals.ariaMultiSelectable = drawsItems && this.multiple ? 'true' : null;
    this.internals.ariaBusy = this.problem === null && this.skeleton ? 'true' : null;
    const label = text(this.label);
    this.internals.ariaLabel = this.internals.role !== null && label !== '' ? label : null;
  }

  /** The first load: the skeleton rows take the place of an empty list. */
  private get skeleton(): boolean {
    return this.loading && this.empty;
  }

  protected override updated(_changed: PropertyValues): void {
    this.restoreFocus();
    if (this.problem === null) {
      this.warnMissingTexts();
    }
    /* An update while disconnected records nothing: the labels are observed again on reconnection. */
    if (this.resizeObserver === undefined) {
      return;
    }
    const targets = [...this.renderRoot.querySelectorAll('.label')];
    const same = targets.length === this.observed.length && targets.every((node, index) => node === this.observed[index]);
    if (!same) {
      this.resizeObserver.disconnect();
      for (const target of targets) {
        this.resizeObserver.observe(target);
      }
      this.observed = targets;
    }
    /* A new text in a label of the same size moves no observer: measure it here. */
    this.measure();
  }

  /** The item that held the focus left: the focus goes to the nearest ancestor that is drawn, else to the Tab stop. */
  private restoreFocus(): void {
    if (this.focusKey === null) return;
    const root = this.renderRoot;
    if (root.querySelector('[role="treeitem"]:focus') !== null) return;
    if (this.shadowRoot?.activeElement !== null) return;
    const candidates = [this.focusKey, ...this.focusAncestors];
    for (const key of candidates) {
      if (this.visible.some((row) => row.key === key)) {
        this.focusRow(key);
        return;
      }
    }
    const first = this.tabKey();
    if (first !== null) this.focusRow(first);
  }

  /** The texts the consumer owes: drawn without them, and said once, since they may arrive later. */
  private warnMissingTexts(): void {
    if (!this.hasName() && this.visible.length > 0) {
      this.warnOnce('name', 'the tree has no accessible name. Give the host an `aria-label` or `aria-labelledby`, or give it a `label`.');
    }
    if (this.rows.some((row) => row.kind === 'error')) {
      if (text(this.errorText) === '') {
        this.warnOnce('error-text', 'a branch failed to load and the error row has no phrase. Give the tree `error-text`.');
      }
      if (text(this.retryText) === '') {
        this.warnOnce('retry-text', 'a branch failed to load and the error row has no action. Give the tree `retry-text`.');
      }
    }
    if (this.empty && !this.loading && text(this.emptyHeading) === '') {
      this.warnOnce('empty-heading', 'the tree is empty and has no heading. Give the tree `empty-heading`.');
    }
  }

  private warnOnce(key: string, message: string): void {
    if (!this.warned.has(key)) {
      this.warned.add(key);
      devMessage('warn', message);
    }
  }

  /* ----- measuring --------------------------------------------------------- */

  /** The cut labels, measured on the screen: a label is cut when its text is wider than its box. */
  private measure(): void {
    if (this.problem !== null) return;
    const cut = new Set<string>();
    for (const label of this.renderRoot.querySelectorAll<HTMLElement>('.label')) {
      if (label.scrollWidth > label.clientWidth) cut.add(label.dataset.key ?? '');
    }
    const previous = this.cutKeys;
    if (cut.size !== previous.size || [...cut].some((key) => !previous.has(key))) {
      this.cutKeys = cut;
    }
  }

  /* ----- state changes ------------------------------------------------------ */

  private dispatch<T>(name: string, detail: T): void {
    this.dispatchEvent(new CustomEvent<T>(name, { detail, bubbles: true, composed: true }));
  }

  private setActive(key: string): void {
    if (this.activeKey !== key) this.activeKey = key;
  }

  /** Opens or closes a branch, and says so. A branch that opens with no children asks for them. */
  private setOpen(row: Row, open: boolean): void {
    if (!row.branch || row.open === open) return;
    const next = new Set(Array.isArray(this.expanded) ? this.expanded : []);
    if (open) next.add(row.node.id);
    else next.delete(row.node.id);
    this.expanded = [...next];
    this.dispatch<NphTreeToggleDetail>('nph-tree-toggle', { id: row.node.id, expanded: open });
    if (open && NphTree.unloaded(row.node) && row.node.error !== true && row.node.loading !== true) {
      this.dispatch<NphTreeLoadDetail>('nph-tree-load', { id: row.node.id, retry: false });
    }
  }

  /** "Try again" on the error row of a branch: the row turns into loading and the consumer is asked again. */
  private retry(row: Row): void {
    const id = row.node.id;
    this.retrying.add(id);
    this.requestUpdate();
    this.dispatch<NphTreeLoadDetail>('nph-tree-load', { id, retry: true });
  }

  /** Chooses an item in single selection. A choice that does not change fires nothing. */
  private choose(row: Row): void {
    if (this.selected === row.node.id) return;
    this.selected = row.node.id;
    this.dispatch<NphTreeSelectDetail>('nph-tree-select', { id: row.node.id });
  }

  /** Checks or unchecks an item in multiple selection: a mixed or an unchecked item gets checked, a checked one unchecked. */
  private check(row: Row): void {
    const id = row.node.id;
    const checked = this.checkStates.get(id) !== 'checked';
    const next = new Set(this.checkedIds(this.checkStates));
    const apply = (node: NphTreeNode): void => {
      if (checked) next.add(node.id);
      else next.delete(node.id);
      if (this.cascades) {
        for (const child of node.children ?? []) {
          if (child.disabled !== true) apply(child);
        }
      }
    };
    apply(row.node);
    if (this.cascades) {
      /* The parents are decided again from their children: a checked parent with an unchecked child is no longer checked. */
      let parent = this.parentOf.get(id);
      while (parent !== null && parent !== undefined) {
        next.delete(parent);
        parent = this.parentOf.get(parent);
      }
    }
    const value = this.checkedIds(this.computeChecks(next));
    this.checked = value;
    this.dispatch<NphTreeCheckDetail>('nph-tree-check', { id, checked, value });
  }

  /** What the row does when the person activates it, as a click on the row and as Enter do. */
  private activate(row: Row, byKey: boolean): void {
    if (row.kind === 'error') {
      this.retry(row);
      return;
    }
    if (row.node.disabled === true) return;
    if (this.selection === 'single') {
      /* Enter chooses; so does a click, on a branch too: the chevron is what opens it. */
      this.choose(row);
    } else if (this.multiple) {
      /* Enter on a branch opens or closes it and on a leaf checks it; a click on the row always checks. */
      if (byKey && row.branch) this.setOpen(row, !row.open);
      else this.check(row);
    } else if (row.branch) {
      this.setOpen(row, !row.open);
    }
  }

  /* ----- focus -------------------------------------------------------------- */

  private element(key: string): HTMLElement | null {
    for (const item of this.renderRoot.querySelectorAll<HTMLElement>('[role="treeitem"]')) {
      if (item.dataset.key === key) return item;
    }
    return null;
  }

  /**
   * Moves the focus to an item. The item takes the Tab stop first, by hand: the balloon of a cut label
   * opens only on an element in the Tab order (P77), and it hears the focus before the render does.
   */
  private focusRow(key: string, options?: FocusOptions): void {
    const target = this.element(key);
    if (target === null) return;
    for (const item of this.renderRoot.querySelectorAll<HTMLElement>('[role="treeitem"]')) {
      if (item !== target && item.tabIndex === 0) item.tabIndex = -1;
    }
    target.tabIndex = 0;
    this.setActive(key);
    target.focus(options);
  }

  /* ----- the keyboard -------------------------------------------------------- */

  private get rtl(): boolean {
    return getComputedStyle(this).direction === 'rtl';
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Tab') {
      this.releaseHoverStops();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const target = (event.target as Element | null)?.closest?.('[role="treeitem"]');
    if (!(target instanceof HTMLElement) || !this.renderRoot.contains(target)) return;
    const row = this.rowByKey.get(target.dataset.key ?? '');
    if (row === undefined) return;
    const index = this.visible.indexOf(row);
    if (index < 0) return;
    const forward = this.rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = this.rtl ? 'ArrowRight' : 'ArrowLeft';
    let handled = true;
    switch (event.key) {
      case 'ArrowDown':
        this.moveTo(index + 1);
        break;
      case 'ArrowUp':
        this.moveTo(index - 1);
        break;
      case 'Home':
        this.moveTo(0);
        break;
      case 'End':
        this.moveTo(this.visible.length - 1);
        break;
      case forward:
        this.onForward(row, index);
        break;
      case back:
        this.onBack(row);
        break;
      case 'Enter':
        this.activate(row, true);
        break;
      case ' ':
      case 'Spacebar':
        if (this.selection === 'none') handled = false;
        else this.activate(row, false);
        break;
      case '*':
        this.openSiblings(row);
        break;
      default:
        handled = this.typeAhead(event.key, index);
    }
    if (handled) event.preventDefault();
  };

  private moveTo(index: number): void {
    const row = this.visible[index];
    if (row !== undefined) this.focusRow(row.key);
  }

  /** Right: opens a closed branch and keeps the focus; on an open branch goes down to its first child; on a leaf does nothing. */
  private onForward(row: Row, index: number): void {
    if (row.kind !== 'node' || !row.branch) return;
    if (!row.open) {
      if (row.node.disabled !== true) this.setOpen(row, true);
      return;
    }
    const next = this.visible[index + 1];
    if (next !== undefined && next.parentKey === row.key) this.focusRow(next.key);
  }

  /** Left: closes an open branch; on a child, or on a branch that stays open, goes up to its parent; on a closed root item does nothing. */
  private onBack(row: Row): void {
    if (row.kind === 'node' && row.open && row.node.disabled !== true) {
      this.setOpen(row, false);
      return;
    }
    if (row.parentKey !== null) this.focusRow(row.parentKey);
  }

  /** Asterisk: opens every closed branch among the siblings of the item with focus. */
  private openSiblings(row: Row): void {
    if (row.kind === 'error') return;
    for (const sibling of this.rows) {
      if (sibling.kind === 'node' && sibling.parentKey === row.parentKey && sibling.branch && !sibling.open && sibling.node.disabled !== true) {
        this.setOpen(sibling, true);
      }
    }
  }

  /** A letter: the next drawn item whose label starts with it, from the item after the current one and around. */
  private typeAhead(key: string, index: number): boolean {
    if (key.length !== 1 || key.trim() === '') return false;
    const letter = key.toLocaleLowerCase();
    const count = this.visible.length;
    for (let step = 1; step <= count; step += 1) {
      const row = this.visible[(index + step) % count] as Row;
      if (row.kind === 'node' && row.node.label.trim().toLocaleLowerCase().startsWith(letter)) {
        this.focusRow(row.key);
        return true;
      }
    }
    return true;
  }

  /* ----- the pointer and the focus events ----------------------------------- */

  private onClick(row: Row, event: MouseEvent): void {
    if (event.button !== 0) return;
    const target = event.target as Element | null;
    if (row.kind === 'node' && target?.closest('.toggle') && row.branch) {
      if (row.node.disabled !== true) this.setOpen(row, !row.open);
      return;
    }
    this.activate(row, false);
  }

  private readonly onFocusin = (event: FocusEvent): void => {
    const item = (event.target as Element | null)?.closest?.('[role="treeitem"]');
    if (!(item instanceof HTMLElement)) return;
    const key = item.dataset.key ?? '';
    this.setActive(key);
    this.lastFocusKey = key;
    /* The focus is on the item: the other items that took the Tab stop for the balloon give it back. */
    for (const stop of [...this.hoverStops]) {
      if (stop !== item) this.dropHoverStop(stop);
    }
  };

  /**
   * The focus leaves the tree: the Tab stop goes back to the chosen item, or the first, so the next Tab
   * enters there, as the contract says. Moving the focus between items is not leaving.
   */
  private readonly onFocusout = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next !== null && this.renderRoot.contains(next)) return;
    this.activeKey = null;
  };

  /**
   * The pointer enters an item whose label is cut. The balloon opens on hover only on an element in
   * the Tab order (P77), and the other items are not: this one takes the stop while the pointer is
   * over it, in the capture phase, before the balloon hears the pointer, and gives it back when the
   * pointer goes to another item, leaves the tree, or the person presses Tab.
   */
  private onPointerenter(row: Row, event: PointerEvent): void {
    if (event.pointerType === 'touch') return;
    const item = event.currentTarget as HTMLElement;
    for (const stop of [...this.hoverStops]) {
      if (stop !== item) this.dropHoverStop(stop);
    }
    if (this.cutKeys.has(row.key) && item.tabIndex < 0) {
      item.tabIndex = 0;
      this.hoverStops.add(item);
    }
  }

  private dropHoverStop(item: HTMLElement): void {
    this.hoverStops.delete(item);
    item.tabIndex = item.dataset.key === this.tabKey() ? 0 : -1;
  }

  private releaseHoverStops(): void {
    for (const stop of [...this.hoverStops]) this.dropHoverStop(stop);
  }

  private readonly onPointerleave = (): void => {
    this.releaseHoverStops();
  };

  /* ----- rendering --------------------------------------------------------- */

  private nodeIcon(row: Row): string {
    return row.branch ? (row.open ? 'folder-open' : 'folder') : 'file';
  }

  /** The chevron target: the chevron of a branch, the spinner of a branch that loads, or the empty place of a leaf. */
  private renderToggle(row: Row): TemplateResult {
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

  private renderBox(row: Row): TemplateResult | typeof nothing {
    if (!this.multiple) return nothing;
    const state = this.checkStates.get(row.node.id) ?? 'unchecked';
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

  private renderNodeItem(row: Row, tabKey: string | null): TemplateResult {
    const node = row.node;
    const id = this.domId(row.key);
    const disabled = node.disabled === true;
    const selectedState = this.selection === 'single' ? (this.selected === node.id ? 'true' : 'false') : nothing;
    const checkedState = this.multiple
      ? (() => {
          const state = this.checkStates.get(node.id) ?? 'unchecked';
          return state === 'mixed' ? 'mixed' : state === 'checked' ? 'true' : 'false';
        })()
      : nothing;
    return html`<div
      class="item"
      id=${id}
      role="treeitem"
      data-key=${row.key}
      tabindex=${row.key === tabKey ? '0' : '-1'}
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
      ?data-selected=${this.selection === 'single' && this.selected === node.id}
      @click=${(event: MouseEvent) => this.onClick(row, event)}
      @pointerenter=${{ handleEvent: (event: PointerEvent) => this.onPointerenter(row, event), capture: true }}
    >
      <div class="face">
        ${this.renderToggle(row)}${this.renderBox(row)}${this.icons
          ? html`<nph-icon class="node-icon" name=${this.nodeIcon(row)} variant="light" size="sm"></nph-icon>`
          : nothing}<span class="label" data-key=${row.key}>${text(node.label)}</span>
      </div>
    </div>`;
  }

  private renderErrorItem(row: Row, tabKey: string | null): TemplateResult {
    const id = this.domId(row.key);
    return html`<div
      class="item error-item"
      id=${id}
      role="treeitem"
      data-key=${row.key}
      tabindex=${row.key === tabKey ? '0' : '-1'}
      aria-label=${this.retryName() === '' ? nothing : this.retryName()}
      aria-level=${String(row.level)}
      aria-setsize=${String(row.setSize)}
      aria-posinset=${String(row.position)}
      @click=${(event: MouseEvent) => this.onClick(row, event)}
    >
      <div class="face">
        <span class="toggle" aria-hidden="true"
          ><nph-icon class="error-icon" name="triangle-exclamation" variant="light" size="sm"></nph-icon
        ></span>
        <span class="error-text">${text(this.errorText)}</span>
        <span class="retry">${text(this.retryText)}</span>
      </div>
    </div>`;
  }

  /** The nodes of a level and the group of the open branch under each one. */
  private renderLevel(nodes: readonly NphTreeNode[], tabKey: string | null): TemplateResult {
    /* Keyed by `id`: an item that leaves takes its own element, and its focus, with it, instead of lending
       the element to the item that moves into its place. */
    return html`${repeat(nodes, (node) => node.id, (node) => {
      const row = this.rowByKey.get(node.id) as Row;
      const group =
        row.content === 'children'
          ? html`<ul class="group" id=${`group-${this.domId(row.key)}`} role="group">${this.renderLevel(node.children ?? [], tabKey)}</ul>`
          : row.content === 'error'
            ? html`<ul class="group" id=${`group-${this.domId(row.key)}`} role="group">
                <li role="none">${this.renderErrorItem(this.rowByKey.get(row.key + ERROR_SUFFIX) as Row, tabKey)}</li>
              </ul>`
            : nothing;
      return html`<li role="none">${this.renderNodeItem(row, tabKey)}${group}</li>`;
    })}`;
  }

  private renderBalloons(): TemplateResult[] {
    return this.visible
      .filter((row) => row.kind === 'node' && this.cutKeys.has(row.key))
      .map(
        (row) =>
          html`<nph-tooltip for=${this.domId(row.key)} relation="name" side="top" .text=${text(row.node.label)}></nph-tooltip>`,
      );
  }

  private renderSkeleton(): TemplateResult {
    return html`<div class="skeleton" aria-hidden="true">
      ${Array.from({ length: NPH_TREE_SKELETON_ROWS }, () => html`<div class="skeleton-row"><nph-skeleton shape="line"></nph-skeleton></div>`)}
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problem !== null) {
      return nothing;
    }
    if (this.empty) {
      return this.skeleton
        ? this.renderSkeleton()
        : html`<nph-empty heading=${text(this.emptyHeading)} description=${text(this.emptyDescription)}></nph-empty>`;
    }
    const tabKey = this.tabKey();
    return html`<ul
        class="tree"
        role="none"
        @keydown=${this.onKeydown}
        @focusin=${this.onFocusin}
        @focusout=${this.onFocusout}
      >
        ${this.renderLevel(this.items, tabKey)}
      </ul>
      ${this.renderBalloons()}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphTree);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-tree': NphTree;
  }
  interface HTMLElementEventMap {
    'nph-tree-toggle': CustomEvent<NphTreeToggleDetail>;
    'nph-tree-select': CustomEvent<NphTreeSelectDetail>;
    'nph-tree-check': CustomEvent<NphTreeCheckDetail>;
    'nph-tree-load': CustomEvent<NphTreeLoadDetail>;
  }
}
