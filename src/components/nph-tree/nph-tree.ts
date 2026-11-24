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

import '../nph-checkbox/nph-checkbox';
import '../nph-empty/nph-empty';
import '../nph-icon/nph-icon';
import '../nph-skeleton/nph-skeleton';
import '../nph-spinner/nph-spinner';
import '../nph-tooltip/nph-tooltip';
import treeCss from './nph-tree.css?inline';
import { buildModel, computeChecks, isUnloaded, toggleCheck } from './nph-tree.model';
import type { CheckState, NphTreeNode, Row } from './nph-tree.model';
import { renderEmpty, renderLevel, renderSkeleton, treeRowStyles } from './nph-tree.rows';
import type { TreeRowContext } from './nph-tree.rows';

const TAG = 'nph-tree';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The three selections of the Figma `seleção`: none, single and multiple. */
export const NPH_TREE_SELECTIONS = ['none', 'single', 'multiple'] as const;
export type NphTreeSelection = (typeof NPH_TREE_SELECTIONS)[number];

export { NPH_TREE_SKELETON_ROWS } from './nph-tree.model';
export type { NphTreeNode } from './nph-tree.model';

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

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devMessage(kind: 'error' | 'warn', message: string): void {
  if (import.meta.env?.DEV) {
    console[kind](`[${TAG}] ${message}`);
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export class NphTree extends LitElement {
  static override styles = [unsafeCSS(treeCss), treeRowStyles];

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
  private retrying = new Map<string, NphTreeNode>();

  /* The branches whose first load was asked for and not answered yet: opening one again asks nothing. */
  private loadAsked = new Set<string>();

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
    this.addEventListener('contextmenu', this.onContextmenu);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.measure());
    /* The font changes the width of the text once it loads. */
    document.fonts?.ready.then(() => this.measure());
    /* A tree moved to another place observes its labels again: the observer was disconnected when it
       left, and only an update installs it. */
    if (this.hasUpdated) this.requestUpdate();
    /* Tab, from anywhere on the page, gives back the stops taken for a balloon: Shift+Tab from a button
       after the tree, or Tab from one before it, enters on the chosen item, not on the one hovered. */
    document.addEventListener('keydown', this.onDocumentKeydown, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.observed = [];
    this.releaseHoverStops();
    document.removeEventListener('keydown', this.onDocumentKeydown, true);
  }

  /* ----- public ------------------------------------------------------------ */

  /**
   * The `id` of the node whose row holds the element, or `null`. A menu opened on the tree
   * (`nph-context-menu`) reports the element under the pointer as its `origin`; this says which node
   * that is. The error row answers with the branch it belongs to.
   */
  itemIdOf(element: Element | null | undefined): string | null {
    /* The element may be inside the shadow root of a piece of the row, such as the drawing of an icon:
       `closest()` stops at that root, so the search goes up through the hosts until it meets the row. */
    let node: Element | null = element ?? null;
    while (node !== null) {
      const item = node.closest('[role="treeitem"]');
      if (item instanceof HTMLElement && this.renderRoot.contains(item)) {
        const row = this.rowByKey.get(item.dataset.key ?? '');
        return row === undefined ? null : row.node.id;
      }
      const root = node.getRootNode();
      node = root instanceof ShadowRoot && root !== this.renderRoot ? root.host : null;
    }
    return null;
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

  /** Whether the branch loads now: the node says so, "Try again" was pressed, or it has no children and no failure. */
  private loadsNow(node: NphTreeNode): boolean {
    if (this.retrying.get(node.id) === node || node.loading === true) return true;
    return isUnloaded(node) && node.error !== true;
  }

  /** The rows, the drawn ones in order and the lookups the render and the keys need. */
  private buildModel(): void {
    const model = buildModel(Array.isArray(this.items) ? this.items : [], Array.isArray(this.expanded) ? this.expanded : [], (node) =>
      this.loadsNow(node),
    );
    this.rows = model.rows;
    this.visible = model.visible;
    this.rowByKey = model.rowByKey;
    this.parentOf = model.parentOf;
    this.checkStates = this.multiple ? computeChecks(this.items, new Set(Array.isArray(this.checked) ? this.checked : []), !this.checkStrictly) : new Map();
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
    this.problem = this.validate();
    /* Only a valid list is walked: an invalid one is reported and drawn as nothing, retries kept for later. */
    if (changed.has('items') && this.problem === null) {
      this.pruneRetries();
      this.pruneLoads();
    }
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

  /* Each event is built with its own literal name, so the manifest of the package lists it. */
  private emitToggle(detail: NphTreeToggleDetail): void {
    this.dispatchEvent(new CustomEvent<NphTreeToggleDetail>('nph-tree-toggle', { detail, bubbles: true, composed: true }));
  }

  private emitSelect(detail: NphTreeSelectDetail): void {
    this.dispatchEvent(new CustomEvent<NphTreeSelectDetail>('nph-tree-select', { detail, bubbles: true, composed: true }));
  }

  private emitCheck(detail: NphTreeCheckDetail): void {
    this.dispatchEvent(new CustomEvent<NphTreeCheckDetail>('nph-tree-check', { detail, bubbles: true, composed: true }));
  }

  private emitLoad(detail: NphTreeLoadDetail): void {
    this.dispatchEvent(new CustomEvent<NphTreeLoadDetail>('nph-tree-load', { detail, bubbles: true, composed: true }));
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
    this.emitToggle({ id: row.node.id, expanded: open });
    if (open && isUnloaded(row.node) && row.node.error !== true && row.node.loading !== true && !this.loadAsked.has(row.node.id)) {
      this.loadAsked.add(row.node.id);
      this.emitLoad({ id: row.node.id, retry: false });
    }
  }

  /**
   * A new `items` answers a "Try again" when the branch it was pressed on comes back as another object,
   * or no longer fails: an update of some other branch keeps the retries that are still waiting.
   */
  private pruneRetries(): void {
    if (this.retrying.size === 0) return;
    const found = new Map<string, NphTreeNode>();
    const walk = (nodes: readonly NphTreeNode[]): void => {
      for (const node of nodes) {
        if (this.retrying.has(node.id)) found.set(node.id, node);
        if (Array.isArray(node.children)) walk(node.children);
      }
    };
    if (Array.isArray(this.items)) walk(this.items);
    for (const [id, pressed] of this.retrying) {
      const now = found.get(id);
      if (now === undefined || now !== pressed || now.error !== true) this.retrying.delete(id);
    }
  }

  /** A first load is answered when its branch comes back with children or with an error, or is gone. */
  private pruneLoads(): void {
    if (this.loadAsked.size === 0) return;
    const found = new Map<string, NphTreeNode>();
    const walk = (nodes: readonly NphTreeNode[]): void => {
      for (const node of nodes) {
        if (this.loadAsked.has(node.id)) found.set(node.id, node);
        if (Array.isArray(node.children)) walk(node.children);
      }
    };
    if (Array.isArray(this.items)) walk(this.items);
    for (const id of [...this.loadAsked]) {
      const now = found.get(id);
      if (now === undefined || now.children !== undefined || now.error === true || now.branch !== true) this.loadAsked.delete(id);
    }
  }

  /** "Try again" on the error row of a branch: the row turns into loading and the consumer is asked again. */
  private retry(row: Row): void {
    const id = row.node.id;
    this.retrying.set(id, row.node);
    this.requestUpdate();
    this.emitLoad({ id, retry: true });
  }

  /** Chooses an item in single selection. A choice that does not change fires nothing. */
  private choose(row: Row): void {
    if (this.selected === row.node.id) return;
    this.selected = row.node.id;
    this.emitSelect({ id: row.node.id });
  }

  /** Checks or unchecks an item in multiple selection: a mixed or an unchecked item gets checked, a checked one unchecked. */
  private check(row: Row): void {
    const id = row.node.id;
    const { checked, value } = toggleCheck(this.items, { rows: this.rows, visible: this.visible, rowByKey: this.rowByKey, parentOf: this.parentOf }, this.checkStates, id, this.cascades);
    this.checked = value;
    this.emitCheck({ id, checked, value });
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

  /**
   * A menu opened on an item by the pointer or by touch gives the focus back to the host when it closes:
   * the item it was opened on is where the focus goes, with no change of the selection.
   */
  private readonly onContextmenu = (event: MouseEvent): void => {
    const item = event.composedPath().find((target) => target instanceof HTMLElement && target.getAttribute('role') === 'treeitem');
    const key = item instanceof HTMLElement ? item.dataset.key : undefined;
    if (key !== undefined && this.rowByKey.has(key)) this.lastFocusKey = key;
  };

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Tab' && this.hoverStops.size > 0) this.releaseHoverStops();
  };

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Tab') return;
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

  /** What the shared rows need from this tree. */
  private rowContext(tabKey: string | null): TreeRowContext {
    return {
      rowByKey: this.rowByKey,
      checkStates: this.checkStates,
      selection: this.selection,
      selected: this.selected,
      icons: this.icons,
      errorText: this.errorText,
      retryText: this.retryText,
      domId: (key) => this.domId(key),
      tabKey,
      onClick: (row, event) => this.onClick(row, event),
      onPointerenter: (row, event) => this.onPointerenter(row, event),
    };
  }

  private renderBalloons(): TemplateResult[] {
    return this.visible
      .filter((row) => row.kind === 'node' && this.cutKeys.has(row.key))
      .map(
        (row) =>
          html`<nph-tooltip for=${this.domId(row.key)} relation="name" side="top" .text=${text(row.node.label)}></nph-tooltip>`,
      );
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problem !== null) {
      return nothing;
    }
    if (this.empty) {
      return this.skeleton ? renderSkeleton() : renderEmpty(this.emptyHeading, this.emptyDescription);
    }
    const tabKey = this.tabKey();
    return html`<ul
        class="tree"
        role="none"
        @keydown=${this.onKeydown}
        @focusin=${this.onFocusin}
        @focusout=${this.onFocusout}
      >
        ${renderLevel(this.rowContext(tabKey), this.items)}
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
