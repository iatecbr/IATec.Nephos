/**
 * `nph-tree-select` — a form field that opens a panel with a tree, to choose one item or several from data
 * in levels, without leaving the form.
 *
 * Contract accepted in Figma (documentation frame `7145:9081`, sets `6339:8107` and `6339:8110`), recorded as
 * text in the evidence of the `figma-docs-accepted` gate of DSA-94, sheet `fichas/nph-tree-select.md` and
 * `design.md`. The panel is part of this tag, not a tag of its own.
 * - `mode`: `single` (the field of `nph-select`, the Figma `única`), `search` (the field of `nph-combobox`,
 *   `única com busca`) or `multiple` (the field of `nph-multi-combobox`, `múltipla`); reflects;
 * - `size`: `default` or `large`; reflects;
 * - `items`: the nodes, as in `nph-tree`: `{ id, label, children?, branch?, disabled?, loading?, error? }`.
 *   Property only. `expanded`: the ids of the open branches;
 * - `query`: the text typed in the field of the two editable modes; setting it from code filters the tree;
 * - `value`: the id of the chosen item, in `single` and `search` (`''` for none); `values`: the ids of the
 *   checked items, in `multiple`. Setting them from code fires nothing. When a whole branch is checked,
 *   `values` carries the parent and every item under it, as `checked` of the `nph-tree` does, and the field
 *   shows one chip, the parent's;
 * - `placeholder`, `counter` and `subject` (the counter mode of the multiple choice), `icons` (the folder and
 *   the file in the tree), `loading` (the first load: skeleton rows), `open`, `name`, `required`, `disabled`,
 *   `invalid`, `label` and `description`, as in the other fields of the family;
 * - texts, already localized by the consuming application: `remove-label` and `clear-label` (the accessible
 *   names of the two buttons), `empty-heading` and `empty-description` (a tree with no items),
 *   `no-result-heading` and `no-result-description` (the search finds nothing), `error-text` and
 *   `retry-text` (the error row of a branch that failed to load);
 * - events: `input` and `change` when the person changes the value, as the family; `nph-tree-toggle`
 *   `{ id, expanded }` and `nph-tree-load` `{ id, retry }`, with the detail of the `nph-tree`, for the branches
 *   that open in the panel.
 *
 * SEMANTICS (WAI-ARIA APG combobox with a tree popup) — DOM focus stays on the field while the panel is open,
 * and the active item is the `treeitem` the field points to by `aria-activedescendant`. The rows are drawn in
 * this shadow root with the module of the `nph-tree` rows (an `aria-activedescendant` cannot point into the
 * shadow root of another element). The field is `role="combobox"` with `aria-haspopup="tree"` and
 * `aria-expanded`; the panel is `role="tree"`, `aria-multiselectable` in `multiple`. The name of the field is
 * the label of the `nph-field`, or `label`, followed by the whole path of the chosen item.
 *
 * Invalid input draws nothing and emits `console.error` only in development, one per cause (P21): a `mode` or
 * a `size` outside the lists, and `items` that cannot be drawn.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

import '../nph-badge/nph-badge';
import '../nph-icon/nph-icon';
import '../nph-tooltip/nph-tooltip';
import { isUnloaded } from '../nph-tree/nph-tree.model';
import { buildModel, computeChecks, toggleCheck } from '../nph-tree/nph-tree.model';
import type { CheckState, NphTreeNode, Row, TreeModel } from '../nph-tree/nph-tree.model';
import { renderEmpty, renderLevel, renderSkeleton, treeRowStyles } from '../nph-tree/nph-tree.rows';
import type { TreeRowContext } from '../nph-tree/nph-tree.rows';
import type { NphTreeLoadDetail, NphTreeToggleDetail } from '../nph-tree/nph-tree';
import treeSelectCss from './nph-tree-select.css?inline';
import {
  ancestorIds,
  branchIds,
  chipNodes,
  filterTree,
  findNode,
  firstMatch,
  itemsProblem,
  pathOf,
  typeaheadRow,
} from './nph-tree-select.logic';

const TAG = 'nph-tree-select';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The three modes of the Figma `modo`: single, single with search and multiple. */
export const NPH_TREE_SELECT_MODES = ['single', 'search', 'multiple'] as const;
export type NphTreeSelectMode = (typeof NPH_TREE_SELECT_MODES)[number];

export const NPH_TREE_SELECT_SIZES = ['default', 'large'] as const;
export type NphTreeSelectSize = (typeof NPH_TREE_SELECT_SIZES)[number];

/** How long the letters of a quick search are kept together (as `nph-select`). */
const TYPEAHEAD_MS = 500;

/** Where the active item goes when the panel renders: decided once the rows are known. */
type Pending = 'first' | 'last' | 'chosen' | 'match' | { key: string };

const INTERACTIVE = 'a[href], button, input, select, textarea, [tabindex], nph-button, nph-checkbox, nph-switch';

function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function valueMissingMessage(): string {
  const probe = document.createElement('select');
  probe.required = true;
  return probe.validationMessage;
}

let nextUid = 0;

export class NphTreeSelect extends LitElement {
  static override styles = [unsafeCSS(treeSelectCss), treeRowStyles];

  /* Host focus, and a click on an associated label, go to the field (see `focus`). */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* The host takes part in the form: labelable, with a value and a validity of its own. */
  static formAssociated = true;

  static override properties = {
    mode: { type: String, reflect: true },
    size: { type: String, reflect: true },
    items: { attribute: false },
    expanded: { attribute: false },
    /* The values have their own accessors: the `value` attribute is the default of the single choice. */
    value: { attribute: false, noAccessor: true },
    values: { attribute: false, noAccessor: true },
    query: { attribute: false, noAccessor: true },
    placeholder: { type: String },
    counter: { type: Boolean, reflect: true },
    subject: { type: String },
    icons: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    removeLabel: { type: String, attribute: 'remove-label' },
    clearLabel: { type: String, attribute: 'clear-label' },
    emptyHeading: { type: String, attribute: 'empty-heading' },
    emptyDescription: { type: String, attribute: 'empty-description' },
    noResultHeading: { type: String, attribute: 'no-result-heading' },
    noResultDescription: { type: String, attribute: 'no-result-description' },
    errorText: { type: String, attribute: 'error-text' },
    retryText: { type: String, attribute: 'retry-text' },
    open: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    label: { type: String },
    description: { type: String },
    activeKey: { state: true },
    typed: { state: true },
    byKeyboard: { state: true },
    cutKeys: { state: true },
  };

  /** `single` (default), `search` or `multiple`. */
  declare mode: string;
  declare size: string;
  /** The nodes of the first level, with the levels under them. */
  declare items: readonly NphTreeNode[];
  /** The ids of the open branches. */
  declare expanded: readonly string[];
  /** The invitation before a choice, already localized. */
  declare placeholder: string;
  /** Shows the subject and how many are chosen, on one line, instead of the chips (`multiple`). */
  declare counter: boolean;
  declare subject: string;
  /** The folder on a branch and the file on a leaf. */
  declare icons: boolean;
  /** The first load: skeleton rows while `items` is empty. */
  declare loading: boolean;
  declare removeLabel: string;
  declare clearLabel: string;
  declare emptyHeading: string;
  declare emptyDescription: string;
  declare noResultHeading: string;
  declare noResultDescription: string;
  declare errorText: string;
  declare retryText: string;
  /** The panel is open. */
  declare open: boolean;
  declare name: string | null;
  declare required: boolean;
  declare disabled: boolean;
  declare invalid: boolean;
  declare label: string;
  declare description: string;
  /** The key of the active row while the panel is open. Not API. */
  declare protected activeKey: string | null;
  /** The text typed in the field, `null` when none. Not API. */
  declare protected typed: string | null;
  declare protected byKeyboard: boolean;
  /** The keys of the rows whose label is cut. Measured, not API. */
  declare protected cutKeys: ReadonlySet<string>;

  private readonly internals: ElementInternals;
  private readonly uid = `nts${String(nextUid++)}`;
  private readonly labelObserver = new MutationObserver(() => this.syncName());
  private readonly labelsHeard = new Set<Element>();
  private readonly scrollTargets: EventTarget[] = [];
  private resizeObserver: ResizeObserver | undefined;
  private current = '';
  private currentValues: string[] = [];
  private dirty = false;
  private valid = false;
  private shown = false;
  private closeTimer: number | undefined;
  private frame: number | undefined;
  private reported = '';
  private settled = false;
  private warnedNoName = false;
  private pending: Pending | null = null;
  private quick = '';
  private quickTimer: number | undefined;
  /** Alt+ArrowDown opened the panel on purpose with no active item, until the person moves. */
  private noActive = false;

  /* The model of the current render. */
  private model: TreeModel = { rows: [], visible: [], rowByKey: new Map(), parentOf: new Map() };
  private fullModel: TreeModel = { rows: [], visible: [], rowByKey: new Map(), parentOf: new Map() };
  private checkStates = new Map<string, CheckState>();
  private domIds = new Map<string, string>();
  private nextDomId = 0;
  private retrying = new Map<string, NphTreeNode>();
  private loadAsked = new Set<string>();

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.mode = 'single';
    this.size = 'default';
    this.items = [];
    this.expanded = [];
    this.placeholder = '';
    this.counter = false;
    this.subject = '';
    this.icons = false;
    this.loading = false;
    this.removeLabel = '';
    this.clearLabel = '';
    this.emptyHeading = '';
    this.emptyDescription = '';
    this.noResultHeading = '';
    this.noResultDescription = '';
    this.errorText = '';
    this.retryText = '';
    this.open = false;
    this.name = null;
    this.required = false;
    this.disabled = false;
    this.invalid = false;
    this.label = '';
    this.description = '';
    this.activeKey = null;
    this.typed = null;
    this.byKeyboard = false;
    this.cutKeys = new Set();
    this.addEventListener('focusin', () => this.syncName());
    this.addEventListener('focusout', this.onFocusout);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.labelObserver.observe(this.getRootNode(), { subtree: true, childList: true, attributes: true, attributeFilter: ['for', 'id'] });
    this.syncName();
  }

  override disconnectedCallback(): void {
    this.labelObserver.disconnect();
    this.releaseLabels([]);
    this.hideNow();
    this.open = false;
    super.disconnectedCallback();
  }

  /** The focus of the host goes to the field, never to a remove button, which comes first in the shadow root. */
  override focus(options?: FocusOptions): void {
    const field = this.field;
    if (field === null) super.focus(options);
    else field.focus(options);
  }

  /* --- Value and form ------------------------------------------------------------ */

  /** The id of the chosen item in `single` and `search`; `''` for none. Setting it from code fires nothing. */
  get value(): string {
    return this.current;
  }

  set value(next: string) {
    const old = this.current;
    this.current = next === null || next === undefined ? '' : String(next);
    this.dirty = true;
    this.syncFormState();
    this.requestUpdate('value', old);
  }

  /** The text typed in the field of the two editable modes. Setting it from code filters the tree and fires nothing. */
  get query(): string {
    return this.typed ?? '';
  }

  set query(next: string) {
    const old = this.typed;
    this.typed = next === null || next === undefined || String(next) === '' ? null : String(next);
    this.requestUpdate('query', old);
  }

  /** The ids of the checked items in `multiple`. Setting them from code fires nothing. */
  get values(): string[] {
    return [...this.currentValues];
  }

  set values(next: readonly string[]) {
    const old = this.currentValues;
    this.currentValues = Array.isArray(next) ? next.map(String) : [];
    this.dirty = true;
    this.syncFormState();
    this.requestUpdate('values', old);
  }

  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'value'];
  }

  override attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    super.attributeChangedCallback(name, old, next);
    if (name === 'value' && !this.dirty) {
      this.current = next ?? '';
      this.syncFormState();
      this.requestUpdate('value');
    }
  }

  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  get labels(): NodeList {
    return this.internals.labels;
  }

  get validity(): ValidityState {
    return this.internals.validity;
  }

  get validationMessage(): string {
    return this.internals.validationMessage;
  }

  get willValidate(): boolean {
    return this.internals.willValidate;
  }

  checkValidity(): boolean {
    return this.internals.checkValidity();
  }

  reportValidity(): boolean {
    return this.internals.reportValidity();
  }

  formResetCallback(): void {
    this.dirty = false;
    this.current = this.getAttribute('value') ?? '';
    this.currentValues = [];
    this.typed = null;
    this.syncFormState();
    this.requestUpdate();
  }

  formDisabledCallback(): void {
    this.requestUpdate();
  }

  formStateRestoreCallback(state: string | File | FormData | null): void {
    if (typeof state === 'string') {
      this.value = state;
    } else if (state instanceof FormData) {
      this.values = state.getAll('value').map(String);
    }
  }

  /**
   * One entry `name=id` per checked item in `multiple`, as `<select multiple>`; the single choice submits
   * its id. With no `name`, nothing is submitted.
   */
  private syncFormState(): void {
    if (!this.valid) {
      this.internals.setFormValue(null);
      this.internals.setValidity({});
      return;
    }
    const name = this.name ?? '';
    let missing: boolean;
    if (this.multiple) {
      const state = new FormData();
      for (const id of this.currentValues) state.append('value', id);
      if (name === '') {
        this.internals.setFormValue(null, state);
      } else {
        const data = new FormData();
        for (const id of this.currentValues) data.append(name, id);
        this.internals.setFormValue(data, state);
      }
      missing = this.currentValues.length === 0;
    } else {
      const chosen = this.current === '' ? null : this.current;
      this.internals.setFormValue(chosen, this.current);
      missing = chosen === null;
    }
    if (this.required && missing) {
      this.internals.setValidity({ valueMissing: true }, valueMissingMessage(), this.field ?? undefined);
    } else {
      this.internals.setValidity({});
    }
    this.syncName();
  }

  /* --- Derived state --------------------------------------------------------------- */

  private get multiple(): boolean {
    return this.mode === 'multiple';
  }

  private get editable(): boolean {
    return this.mode !== 'single';
  }

  private get inactive(): boolean {
    return this.disabled || this.disabledByFieldset;
  }

  private get disabledByFieldset(): boolean {
    let ancestor = this.parentElement;
    while (ancestor !== null) {
      if (ancestor.localName === 'fieldset' && ancestor.hasAttribute('disabled')) {
        const firstLegend = [...ancestor.children].find((child) => child.localName === 'legend');
        if (firstLegend === undefined || !firstLegend.contains(this)) return true;
      }
      ancestor = ancestor.parentElement;
    }
    return false;
  }

  /** The element that holds the DOM focus: the field itself in `single`, the text field in the other two. */
  private get field(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>(this.editable ? '.field' : '.control') ?? null;
  }

  private get panel(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('.panel') ?? null;
  }

  private get scroller(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('.scroller') ?? null;
  }

  /** The text that filters the tree: only the editable modes filter. */
  private get filterText(): string {
    return this.editable ? (this.typed ?? '') : '';
  }

  private get chosenNode(): NphTreeNode | null {
    return this.multiple || this.current === '' ? null : findNode(this.items, this.current);
  }

  private get chips(): NphTreeNode[] {
    return this.multiple ? chipNodes(this.items, this.checkStates) : [];
  }

  private domId(key: string): string {
    let id = this.domIds.get(key);
    if (id === undefined) {
      id = `${this.uid}-item-${String(this.nextDomId)}`;
      this.nextDomId += 1;
      this.domIds.set(key, id);
    }
    return id;
  }

  private loadsNow(node: NphTreeNode): boolean {
    if (this.retrying.get(node.id) === node || node.loading === true) return true;
    return isUnloaded(node) && node.error !== true;
  }

  /* --- Life cycle ------------------------------------------------------------------ */

  private report(causes: string[]): void {
    for (const cause of causes) {
      if (!this.reported.includes(cause)) devError(`${cause} Nothing was drawn.`);
    }
    this.reported = causes.join('|');
  }

  protected override willUpdate(changed: PropertyValues): void {
    const causes: string[] = [];
    const mode = trimmed(this.mode);
    if (!oneOf(NPH_TREE_SELECT_MODES, mode)) causes.push(`mode "${this.mode}" does not exist. Use ${NPH_TREE_SELECT_MODES.join(', ')}.`);
    const size = trimmed(this.size);
    if (!oneOf(NPH_TREE_SELECT_SIZES, size)) causes.push(`size "${this.size}" does not exist. Use ${NPH_TREE_SELECT_SIZES.join(' or ')}.`);
    const problem = itemsProblem(this.items);
    if (problem !== null) causes.push(problem);
    this.valid = causes.length === 0;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    this.report(causes);
    if (!this.valid) {
      this.model = { rows: [], visible: [], rowByKey: new Map(), parentOf: new Map() };
      return;
    }
    if (changed.has('items')) {
      this.pruneRetries();
      this.pruneLoads();
    }
    const items = this.items;
    const filtered = filterTree(items, this.filterText);
    const open = new Set([...(Array.isArray(this.expanded) ? this.expanded : []), ...filtered.open]);
    this.model = buildModel(filtered.items, [...open], (node) => this.loadsNow(node));
    this.fullModel = buildModel(items, branchIds(items), () => false);
    this.checkStates = this.multiple ? computeChecks(items, new Set(this.currentValues), true) : new Map();
    this.resolveActive();
    this.syncFormState();
  }

  /** The active row once the rows are known: what the person asked for, else the one it was, else none. */
  private resolveActive(): void {
    const visible = this.model.visible;
    if (!this.open) {
      this.activeKey = null;
      return;
    }
    if (this.noActive) {
      this.pending = null;
      if (this.activeKey !== null) this.activeKey = null;
      return;
    }
    const pending = this.pending;
    this.pending = null;
    let key: string | null = this.activeKey;
    if (pending !== null) {
      if (pending === 'first') key = visible[0]?.key ?? null;
      else if (pending === 'last') key = visible.at(-1)?.key ?? null;
      else if (pending === 'chosen') key = this.model.rowByKey.has(this.current) && this.current !== '' ? this.current : (visible[0]?.key ?? null);
      else if (pending === 'match') key = (firstMatch(visible, this.filterText) ?? visible[0])?.key ?? null;
      else key = this.model.rowByKey.has(pending.key) ? pending.key : (visible[0]?.key ?? null);
    } else if (key === null || !this.model.rowByKey.has(key)) {
      key = visible[0]?.key ?? null;
    }
    if (key !== this.activeKey) this.activeKey = key;
  }

  protected override firstUpdated(): void {
    requestAnimationFrame(() => {
      this.settled = true;
      this.syncName();
    });
  }

  protected override updated(changed: PropertyValues): void {
    const field = this.field;
    if (field !== null) {
      (field as HTMLElement & { ariaActiveDescendantElement: Element | null }).ariaActiveDescendantElement =
        this.open && this.activeKey !== null ? this.rowElement(this.activeKey) : null;
    }
    const panel = this.panel;
    if (panel === null) {
      if (this.shown) this.hideNow();
    } else if (this.open && this.valid) {
      this.show(panel);
      this.revealActive();
      this.measureCut();
    } else if (changed.has('open') || this.shown) {
      this.hide(panel);
    }
    this.syncFormState();
  }

  /** The cut labels, measured on the screen: a label is cut when its text is wider than its box. */
  private measureCut(): void {
    const cut = new Set<string>();
    for (const label of this.renderRoot.querySelectorAll<HTMLElement>('.label')) {
      if (label.scrollWidth > label.clientWidth) cut.add(label.dataset.key ?? '');
    }
    const previous = this.cutKeys;
    if (cut.size !== previous.size || [...cut].some((key) => !previous.has(key))) this.cutKeys = cut;
  }

  private rowElement(key: string): HTMLElement | null {
    for (const item of this.renderRoot.querySelectorAll<HTMLElement>('[role="treeitem"]')) {
      if (item.dataset.key === key) return item;
    }
    return null;
  }

  /** The active row comes into the view of the panel, without scrolling the page. */
  private revealActive(): void {
    const scroller = this.scroller;
    const item = this.activeKey === null ? null : this.rowElement(this.activeKey);
    if (scroller === null || item === null) return;
    const box = scroller.getBoundingClientRect();
    const row = item.getBoundingClientRect();
    if (row.top < box.top) scroller.scrollTop -= box.top - row.top;
    else if (row.bottom > box.bottom) scroller.scrollTop += row.bottom - box.bottom;
  }

  /* --- Opening and closing ----------------------------------------------------------- */

  /** Opens the panel with the path to the chosen item open. `where` says where the active item goes. */
  private openPanel(where: Pending): void {
    if (this.inactive || !this.valid) return;
    if (!this.multiple && this.current !== '') {
      const path = ancestorIds(this.items, this.current).filter((id) => !(this.expanded ?? []).includes(id));
      if (path.length > 0) this.expanded = [...(this.expanded ?? []), ...path];
    }
    this.pending = where;
    this.open = true;
  }

  private closePanel(): void {
    if (!this.open && this.typed === null) return;
    this.open = false;
    this.typed = null;
    this.activeKey = null;
    this.pending = null;
    this.noActive = false;
  }

  private show(panel: HTMLElement): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      this.shown = true;
      try {
        panel.showPopover();
      } catch {
        /* Not connected, or already showing: nothing to do. */
      }
      document.addEventListener('pointerdown', this.onDocumentPointerdown, true);
      window.addEventListener('scroll', this.onViewportChange, true);
      window.addEventListener('resize', this.onViewportChange);
      this.resizeObserver = new ResizeObserver(this.onViewportChange);
      this.resizeObserver.observe(this);
      this.updateScrollTargets();
      this.place(panel);
      /* The first style is the closed one; the next one starts the enter transition. */
      void panel.offsetWidth;
    } else {
      this.place(panel);
    }
    panel.setAttribute('data-open', '');
  }

  /** Starts the exit; the panel leaves the top layer when the exit ends. */
  private hide(panel: HTMLElement): void {
    panel.removeAttribute('data-open');
    if (this.closeTimer !== undefined || !this.shown) return;
    const duration = parseFloat(getComputedStyle(panel).transitionDuration) * 1000;
    if (!(duration > 0)) {
      this.hideNow();
      return;
    }
    this.closeTimer = window.setTimeout(() => {
      this.closeTimer = undefined;
      this.hideNow();
    }, duration);
  }

  private hideNow(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    document.removeEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.clearScrollTargets();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.shown = false;
    const panel = this.panel;
    if (panel) {
      panel.removeAttribute('data-open');
      try {
        panel.hidePopover();
      } catch {
        /* Already hidden. */
      }
    }
  }

  /** Every ancestor in the flat tree: the scroll of an element inside a shadow root does not reach `window`. */
  private updateScrollTargets(): void {
    this.clearScrollTargets();
    let node: Node | null = this;
    while (node !== null) {
      if (node instanceof Element || node instanceof ShadowRoot) {
        node.addEventListener('scroll', this.onViewportChange, true);
        this.scrollTargets.push(node);
      }
      node = node instanceof ShadowRoot ? node.host : ((node as Element).assignedSlot ?? node.parentNode);
    }
  }

  private clearScrollTargets(): void {
    for (const target of this.scrollTargets) target.removeEventListener('scroll', this.onViewportChange, true);
    this.scrollTargets.length = 0;
  }

  private readonly onViewportChange = (): void => {
    if (this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      const panel = this.panel;
      if (panel && this.shown) {
        this.place(panel);
        this.measureCut();
      }
    });
  };

  /** The distance to the field, carried by the margin of the side that faces it, in pixels. */
  private gap(panel: HTMLElement, side: 'top' | 'bottom'): number {
    panel.setAttribute('data-side', side);
    const style = getComputedStyle(panel);
    return parseFloat(side === 'bottom' ? style.marginTop : style.marginBottom) || 0;
  }

  /** Below the field, aligned to its start, with its width (the token is the minimum); above it when it does not fit below. */
  private place(panel: HTMLElement): void {
    const control = this.renderRoot.querySelector<HTMLElement>('.control');
    if (control === null) return;
    const anchor = control.getBoundingClientRect();
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    const visible = anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width;
    panel.style.visibility = visible ? '' : 'hidden';
    if (!visible) return;
    panel.style.width = `${anchor.width}px`;
    panel.style.top = '0px';
    panel.style.left = '0px';
    const { width, height } = panel.getBoundingClientRect();
    const below = view.height - anchor.bottom - this.gap(panel, 'bottom') - height;
    const above = anchor.top - this.gap(panel, 'top') - height;
    const side = below >= 0 || below >= above ? 'bottom' : 'top';
    const gap = this.gap(panel, side);
    const rtl = getComputedStyle(this).direction === 'rtl';
    let x = rtl ? anchor.right - width : anchor.left;
    let y = side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - height;
    x = Math.min(Math.max(x, 0), Math.max(view.width - width, 0));
    y = Math.min(Math.max(y, 0), Math.max(view.height - height, 0));
    const style = getComputedStyle(panel);
    panel.style.left = `${x - parseFloat(style.marginLeft)}px`;
    panel.style.top = `${y - parseFloat(style.marginTop)}px`;
  }

  /** A press outside the field and the panel closes the panel and keeps the value. */
  private readonly onDocumentPointerdown = (event: PointerEvent): void => {
    if (!event.composedPath().includes(this)) this.closePanel();
  };

  /** The focus left the piece (Tab, a click elsewhere, code): the panel closes without choosing. */
  private readonly onFocusout = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    if (next instanceof Node && (this.contains(next) || this.renderRoot.contains(next))) return;
    this.closePanel();
  };

  /* --- Choosing --------------------------------------------------------------------- */

  private emitChange(): void {
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /** The person chooses an item in `single` and `search`: a different value fires `input` and `change`; the panel closes. */
  private choose(id: string): void {
    if (this.inactive) return;
    const old = this.current;
    this.current = id;
    this.dirty = true;
    this.typed = null;
    this.closePanel();
    this.field?.focus();
    this.syncFormState();
    this.requestUpdate('value', old);
    if (this.current !== old) this.emitChange();
  }

  /** The person checks or unchecks an item in `multiple`: the cascade decides its branch; the panel stays open. */
  private check(id: string): void {
    if (this.inactive) return;
    const { value } = toggleCheck(this.items, this.fullModel, this.checkStates, id, true);
    const old = this.currentValues;
    this.currentValues = value;
    this.dirty = true;
    this.typed = null;
    this.syncFormState();
    this.requestUpdate('values', old);
    this.emitChange();
  }

  /** What a row does when the person activates it: Enter, Space or a click. */
  private activate(row: Row): void {
    if (row.kind === 'error') {
      this.retry(row);
      return;
    }
    if (row.node.disabled === true) return;
    if (this.multiple) this.check(row.node.id);
    else this.choose(row.node.id);
  }

  private removeChip(node: NphTreeNode, event: Event): void {
    event.stopPropagation();
    if (this.inactive) return;
    this.check(node.id);
    this.field?.focus();
  }

  private clear(event: Event): void {
    event.stopPropagation();
    this.typed = '';
    this.pending = 'match';
    this.field?.focus();
  }

  /* --- Branches: open, close, load, retry ------------------------------------------------ */

  private setOpen(row: Row, open: boolean): void {
    if (!row.branch || row.open === open) return;
    const next = new Set(Array.isArray(this.expanded) ? this.expanded : []);
    if (open) next.add(row.node.id);
    else next.delete(row.node.id);
    this.expanded = [...next];
    this.dispatchEvent(new CustomEvent<NphTreeToggleDetail>('nph-tree-toggle', { detail: { id: row.node.id, expanded: open }, bubbles: true, composed: true }));
    if (open && isUnloaded(row.node) && row.node.error !== true && row.node.loading !== true && !this.loadAsked.has(row.node.id)) {
      this.loadAsked.add(row.node.id);
      this.dispatchEvent(new CustomEvent<NphTreeLoadDetail>('nph-tree-load', { detail: { id: row.node.id, retry: false }, bubbles: true, composed: true }));
    }
  }

  private retry(row: Row): void {
    const id = row.node.id;
    this.retrying.set(id, row.node);
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent<NphTreeLoadDetail>('nph-tree-load', { detail: { id, retry: true }, bubbles: true, composed: true }));
  }

  /** A new `items` answers a "Try again" when its branch comes back as another object, or no longer fails. */
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

  /* --- The keyboard ------------------------------------------------------------------- */

  private get rtl(): boolean {
    return getComputedStyle(this).direction === 'rtl';
  }

  private clearQuick(): void {
    if (this.quickTimer !== undefined) {
      window.clearTimeout(this.quickTimer);
      this.quickTimer = undefined;
    }
    this.quick = '';
  }

  /** The letters of a quick search (D-1), kept together for a moment: the row they point to, or `null`. */
  private quickSearch(character: string, visible: readonly Row[], from: string | null): Row | null {
    if (this.quickTimer !== undefined) window.clearTimeout(this.quickTimer);
    this.quick += character.toLocaleLowerCase();
    this.quickTimer = window.setTimeout(() => {
      this.quick = '';
      this.quickTimer = undefined;
    }, TYPEAHEAD_MS);
    return typeaheadRow(visible, from, this.quick);
  }

  /** The tree as it will open: the rows with the path to the chosen item open, for the letter search of a closed field. */
  private closedVisible(): readonly Row[] {
    const path = this.current === '' ? [] : ancestorIds(this.items, this.current);
    return buildModel(this.items, [...(this.expanded ?? []), ...path], (node) => this.loadsNow(node)).visible;
  }

  private move(delta: number): void {
    const visible = this.model.visible;
    if (visible.length === 0) return;
    const index = this.activeKey === null ? -1 : visible.findIndex((row) => row.key === this.activeKey);
    const next = index === -1 ? (delta > 0 ? 0 : visible.length - 1) : Math.min(Math.max(index + delta, 0), visible.length - 1);
    this.activeKey = visible[next]?.key ?? null;
  }

  private activeRow(): Row | null {
    return this.activeKey === null ? null : (this.model.rowByKey.get(this.activeKey) ?? null);
  }

  /** Right: opens a closed branch; on an open one goes to its first child. */
  private forward(row: Row): boolean {
    if (row.kind !== 'node' || !row.branch) return false;
    if (!row.open) {
      if (row.node.disabled !== true) this.setOpen(row, true);
      return true;
    }
    const index = this.model.visible.indexOf(row);
    const next = this.model.visible[index + 1];
    if (next !== undefined && next.parentKey === row.key) this.activeKey = next.key;
    return true;
  }

  /** Left: closes an open branch; on a child goes up to its parent. */
  private back(row: Row): boolean {
    if (row.kind === 'node' && row.open && row.node.disabled !== true) {
      this.setOpen(row, false);
      return true;
    }
    if (row.parentKey !== null) {
      this.activeKey = row.parentKey;
      return true;
    }
    return false;
  }

  /** Asterisk: opens every closed branch among the siblings of the active item. */
  private openSiblings(row: Row): void {
    if (row.kind === 'error') return;
    for (const sibling of this.model.rows) {
      if (sibling.kind === 'node' && sibling.parentKey === row.parentKey && sibling.branch && !sibling.open && sibling.node.disabled !== true) {
        this.setOpen(sibling, true);
      }
    }
  }

  private onKeydown = (event: KeyboardEvent): void => {
    if (event.isComposing || this.inactive) return;
    const { key } = event;
    this.byKeyboard = true;
    if (key.length !== 1) this.clearQuick();
    const handled = this.open ? this.keyWhenOpen(event) : this.keyWhenClosed(event);
    if (handled) event.preventDefault();
  };

  private keyWhenClosed(event: KeyboardEvent): boolean {
    const { key, altKey, ctrlKey, metaKey } = event;
    const chosen = this.current !== '';
    if (this.editable && key === 'Escape' && this.typed !== null) {
      /* Esc with the panel closed and typed text clears the text; with none, it passes on. */
      this.typed = null;
      return true;
    }
    if (key === 'ArrowDown' && altKey && this.editable) {
      /* Alt+ArrowDown opens the panel without moving the active item: there is none until the person moves. */
      this.openPanel('first');
      this.noActive = true;
      return true;
    }
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      if (this.multiple) this.openPanel(key === 'ArrowDown' ? 'first' : 'last');
      else if (this.mode === 'search') this.openPanel(chosen ? 'chosen' : key === 'ArrowDown' ? 'first' : 'last');
      else this.openPanel('chosen');
      return true;
    }
    if (this.mode === 'single') {
      if (key === 'Enter' || key === ' ') {
        this.openPanel('chosen');
        return true;
      }
      if (key === 'Home') {
        this.openPanel('first');
        return true;
      }
      if (key === 'End') {
        this.openPanel('last');
        return true;
      }
      if (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey) {
        const found = this.quickSearch(key, this.closedVisible(), this.current === '' ? null : this.current);
        this.openPanel(found === null ? 'chosen' : { key: found.key });
        return true;
      }
    }
    return false;
  }

  private keyWhenOpen(event: KeyboardEvent): boolean {
    const { key, altKey, ctrlKey, metaKey } = event;
    const row = this.activeRow();
    if (key !== 'Alt' && key !== 'Shift' && key !== 'Control' && key !== 'Meta' && !(key === 'ArrowDown' && altKey)) this.noActive = false;
    switch (key) {
      case 'Escape':
        this.closePanel();
        /* The Escape closes the panel only, not a dialog around the field. */
        event.stopPropagation();
        return true;
      case 'Tab':
        this.closePanel();
        return false;
      case 'ArrowDown':
        if (altKey) return true;
        this.move(1);
        return true;
      case 'ArrowUp':
        if (altKey) {
          if (this.multiple) this.closePanel();
          else if (row !== null && row.kind === 'node' && row.node.disabled !== true) this.choose(row.node.id);
          else this.closePanel();
          return true;
        }
        this.move(-1);
        return true;
      case 'Enter':
        if (row !== null) this.activate(row);
        else this.closePanel();
        return true;
      case ' ':
        if (this.mode !== 'single') return false;
        if (this.quick !== '') {
          const found = this.quickSearch(key, this.model.visible, this.activeKey);
          if (found !== null) this.activeKey = found.key;
          return true;
        }
        if (row !== null) this.activate(row);
        return true;
      case 'Home':
      case 'End':
        if (this.editable) return false;
        this.activeKey = (key === 'Home' ? this.model.visible[0] : this.model.visible.at(-1))?.key ?? null;
        return true;
      case 'ArrowRight':
      case 'ArrowLeft': {
        const forward = (key === 'ArrowRight') !== this.rtl;
        if (row === null) return false;
        const done = forward ? this.forward(row) : this.back(row);
        return done;
      }
      case '*':
        if (this.editable || row === null) return false;
        this.openSiblings(row);
        return true;
      default:
        if (this.mode === 'single' && key.length === 1 && !altKey && !ctrlKey && !metaKey) {
          const found = this.quickSearch(key, this.model.visible, this.activeKey);
          if (found !== null) this.activeKey = found.key;
          return true;
        }
        return false;
    }
  }

  /** Typing in an editable mode opens the panel, filters the tree and makes the first match active. */
  private onInput(event: Event): void {
    if (this.inactive) return;
    this.typed = (event.target as HTMLInputElement).value;
    this.noActive = false;
    this.byKeyboard = true;
    this.pending = 'match';
    this.open = true;
  }

  /* --- The pointer ---------------------------------------------------------------------- */

  private onRowClick(row: Row, event: MouseEvent): void {
    if (event.button !== 0) return;
    this.byKeyboard = false;
    const target = event.target as Element | null;
    if (row.kind === 'node' && target?.closest('.toggle') && row.branch) {
      if (row.node.disabled !== true) this.setOpen(row, !row.open);
      return;
    }
    this.activate(row);
  }

  private onControlClick(event: MouseEvent): void {
    if (this.inactive) return;
    this.byKeyboard = false;
    const onArrow = event.composedPath().some((target) => target instanceof Element && (target.classList.contains('arrow') || target.classList.contains('arrow-icon')));
    if (this.open && (this.mode === 'single' || onArrow)) {
      this.closePanel();
    } else if (!this.open) {
      this.openPanel(this.multiple ? 'first' : 'chosen');
    }
    if (this.editable) this.field?.focus();
  }

  /** A press on the field keeps the focus where it is, except on the text field and on the single choice itself. */
  private onControlMousedown(event: MouseEvent): void {
    if (this.mode === 'single') return;
    const path = event.composedPath();
    if (path.some((target) => target instanceof Element && target.classList.contains('field'))) return;
    event.preventDefault();
  }

  /** The panel never takes the focus: it stays on the field. */
  private onPanelMousedown(event: MouseEvent): void {
    event.preventDefault();
  }

  /* --- Name -------------------------------------------------------------------------------- */

  private readonly onLabelClick = (event: Event): void => {
    const label = event.currentTarget as Element;
    if (event.defaultPrevented || ![...this.internals.labels].includes(label) || event.composedPath().includes(this)) return;
    const path = event.composedPath();
    const inside = path.slice(0, Math.max(path.indexOf(label), 0));
    if (inside.some((target) => target instanceof Element && target.matches(INTERACTIVE))) return;
    event.preventDefault();
    if (!this.inactive) this.focus();
  };

  private releaseLabels(keep: readonly Element[]): void {
    for (const label of [...this.labelsHeard]) {
      if (!keep.includes(label)) {
        label.removeEventListener('click', this.onLabelClick);
        this.labelsHeard.delete(label);
      }
    }
  }

  /**
   * The field and the tree are named by the labels associated with the host, or by `label`. In `single` and
   * `search` the whole path of the chosen item follows the label in the name of the field: the field shows
   * only the label of the item.
   */
  private syncName(): void {
    const field = this.field;
    const tree = this.renderRoot?.querySelector<HTMLElement>('.tree') ?? null;
    if (field === null) return;
    const labels = [...this.internals.labels] as Element[];
    this.releaseLabels(this.isConnected ? labels : []);
    for (const label of this.isConnected ? labels : []) {
      if (!this.labelsHeard.has(label)) {
        this.labelsHeard.add(label);
        label.addEventListener('click', this.onLabelClick);
      }
    }
    const text = trimmed(this.label);
    const path = this.renderRoot.querySelector<HTMLElement>('.path');
    const withPath = path !== null && path.textContent !== '';
    for (const element of [field, tree]) {
      if (element === null) continue;
      const extra = element === field && withPath ? [path] : [];
      if (labels.length > 0) {
        element.ariaLabelledByElements = [...labels, ...extra];
        element.removeAttribute('aria-label');
      } else {
        element.ariaLabelledByElements = null;
        if (text === '') {
          element.removeAttribute('aria-label');
        } else {
          element.setAttribute('aria-label', element === field && withPath ? `${text}, ${path.textContent ?? ''}` : text);
        }
      }
    }
    const named = labels.length > 0 || text !== '';
    if (named) this.warnedNoName = false;
    else if (this.settled && !this.warnedNoName) {
      this.warnedNoName = true;
      devWarn('the field has no accessible name: associate a label (nph-label for, or nph-field) or set label. The placeholder is not a name.');
    }
  }

  /* --- Drawing ------------------------------------------------------------------------------ */

  private rowContext(): TreeRowContext {
    return {
      rowByKey: this.model.rowByKey,
      checkStates: this.checkStates,
      selection: this.multiple ? 'multiple' : 'single',
      selected: this.multiple || this.current === '' ? null : this.current,
      icons: this.icons,
      errorText: this.errorText,
      retryText: this.retryText,
      domId: (key) => this.domId(key),
      focusKey: this.open && this.byKeyboard ? this.activeKey : null,
      withBalloons: true,
      onClick: (row, event) => this.onRowClick(row, event),
    };
  }

  /**
   * The whole label of a cut item, in an `nph-tooltip` beside the rows, in this root so it can point at the row: on
   * hover after `motion/hover-delay`, and at once for the active item when the keyboard moved it, since the focus
   * stays on the field.
   */
  private renderBalloons(): TemplateResult[] {
    return this.model.visible
      .filter((row) => row.kind === 'node' && this.cutKeys.has(row.key))
      .map(
        (row) =>
          html`<nph-tooltip
            for=${this.domId(row.key)}
            relation="name"
            side="top"
            .text=${trimmed(row.node.label)}
            ?open=${this.open && this.byKeyboard && this.activeKey === row.key}
          ></nph-tooltip>`,
      );
  }

  private renderChip(node: NphTreeNode, removable: boolean): TemplateResult {
    const text = trimmed(node.label);
    return html`<span class="chip" role="listitem">
      ${this.icons ? html`<nph-icon class="chip-icon" name=${node.children !== undefined || node.branch === true ? 'folder' : 'file'} variant="light" size="sm" aria-hidden="true"></nph-icon>` : nothing}
      <span class="chip-label">${text}</span>
      ${removable
        ? html`<button class="remove" type="button" aria-label=${`${trimmed(this.removeLabel)} ${text}`} @click=${(event: Event) => this.removeChip(node, event)}>
            <nph-icon name="xmark" size="sm" aria-hidden="true"></nph-icon>
          </button>`
        : nothing}
    </span>`;
  }

  private renderChosen(chips: readonly NphTreeNode[]): TemplateResult | typeof nothing {
    if (chips.length === 0) return nothing;
    if (this.counter) {
      const subject = trimmed(this.subject);
      return html`${subject === '' ? nothing : html`<span class="subject">${subject}</span>`}
        <nph-badge class="count" severity="primary" emphasis="solid" text=${String(chips.length)}></nph-badge>`;
    }
    const removable = !this.inactive && trimmed(this.removeLabel) !== '';
    return html`<span class="chips" role="list" aria-disabled=${this.inactive ? 'true' : nothing}>${chips.map((chip) => this.renderChip(chip, removable))}</span>`;
  }

  /** The inside of the panel: the tree, the first load, the empty tree or the no result. */
  private renderInside(): TemplateResult {
    const empty = Array.isArray(this.items) && this.items.length === 0;
    const filteredOut = !empty && this.model.visible.length === 0;
    const busy = this.loading && empty;
    let inside: TemplateResult;
    if (busy) {
      /* The first load: a tree with no items yet, busy (the APG allows it). */
      inside = html`<div class="tree" id="tree" role="tree" aria-busy="true" aria-multiselectable=${this.multiple ? 'true' : nothing}>${renderSkeleton()}</div>`;
    } else if (empty) {
      inside = html`<div id="tree">${renderEmpty(this.emptyHeading, this.emptyDescription)}</div>`;
    } else if (filteredOut) {
      inside = html`<div id="tree">${renderEmpty(this.noResultHeading, this.noResultDescription)}</div>`;
    } else {
      inside = html`<ul class="tree" id="tree" role="tree" aria-multiselectable=${this.multiple ? 'true' : nothing}>
        ${renderLevel(this.rowContext(), filteredTop(this.model, this.items, this.filterText))}
      </ul>`;
    }
    return html`<div class="scroller">${inside}</div>${this.renderBalloons()}`;
  }

  private renderControl(): TemplateResult {
    const inactive = this.inactive;
    const description = trimmed(this.description);
    const chosen = this.chosenNode;
    const chips = this.chips;
    const arrowName = this.open ? 'chevron-up' : 'chevron-down';
    const area = html`<span class="arrow" aria-hidden="true"><nph-icon class="arrow-icon" name=${arrowName} size="sm"></nph-icon></span>`;
    const descriptionNode = description === '' ? nothing : html`<span class="description" id="description">${description}</span>`;
    const path = chosen === null ? '' : pathOf(this.items, chosen.id).join(', ');
    const pathNode = html`<span class="path" id="path">${path}</span>`;
    const expandedState = this.open ? 'true' : 'false';

    if (this.mode === 'single') {
      return html`<div
          class="control"
          role="combobox"
          tabindex=${inactive ? nothing : '0'}
          aria-haspopup="tree"
          aria-expanded=${expandedState}
          aria-controls="tree"
          aria-required=${this.required ? 'true' : nothing}
          aria-invalid=${this.invalid && !inactive ? 'true' : nothing}
          aria-disabled=${inactive ? 'true' : nothing}
          aria-describedby=${description === '' ? nothing : 'description'}
          @click=${this.onControlClick}
          @keydown=${this.onKeydown}
        >
          <nph-icon class="start" name="globe" size="sm" aria-hidden="true"></nph-icon>
          ${chosen === null
            ? html`<span class="value placeholder">${this.placeholder ?? ''}</span>`
            : html`<span class="value">${chosen.label}</span>`}
          ${area}${descriptionNode}${pathNode}
        </div>`;
    }

    const typedText = this.typed ?? (this.mode === 'search' ? (chosen?.label ?? '') : '');
    const placeholder = this.multiple ? (chips.length === 0 ? (this.placeholder ?? '') : '') : chosen === null ? (this.placeholder ?? '') : '';
    const width = Math.max(typedText.length, placeholder.length) + 1;
    const input = html`<input
      class="field"
      type="text"
      role="combobox"
      autocomplete="off"
      spellcheck="false"
      size=${this.multiple ? width : nothing}
      .value=${live(typedText)}
      placeholder=${placeholder === '' ? nothing : placeholder}
      ?disabled=${inactive}
      aria-autocomplete="list"
      aria-haspopup="tree"
      aria-expanded=${expandedState}
      aria-controls="tree"
      aria-required=${this.required ? 'true' : nothing}
      aria-invalid=${this.invalid && !inactive ? 'true' : nothing}
      aria-describedby=${description === '' ? nothing : 'description'}
      @input=${this.onInput}
      @keydown=${this.onKeydown}
    />`;

    if (this.multiple) {
      return html`<div class="control" @click=${this.onControlClick} @mousedown=${this.onControlMousedown}>
        <nph-icon class="start" name="magnifying-glass" size="sm" aria-hidden="true"></nph-icon>
        <span class="content">${this.renderChosen(chips)}${input}</span>
        <nph-icon class="arrow-icon" name=${arrowName} size="sm" aria-hidden="true"></nph-icon>
        ${descriptionNode}
      </div>`;
    }
    const clearable = typedText !== '' && !inactive && trimmed(this.clearLabel) !== '';
    return html`<div class="control" @click=${this.onControlClick} @mousedown=${this.onControlMousedown}>
      <nph-icon class="start" name="magnifying-glass" size="sm" aria-hidden="true"></nph-icon>
      ${input}
      ${clearable
        ? html`<button class="clear" type="button" tabindex="-1" aria-label=${trimmed(this.clearLabel)} @click=${(event: Event) => this.clear(event)}>
            <nph-icon name="xmark" size="sm" aria-hidden="true"></nph-icon>
          </button>`
        : nothing}
      ${area}${descriptionNode}${pathNode}
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) return nothing;
    return html`${this.renderControl()}
      <div class="panel" popover="manual" @mousedown=${this.onPanelMousedown}>${this.renderInside()}</div>`;
  }
}

/** The nodes of the first level that are drawn: the filtered tree has its own first level. */
function filteredTop(model: TreeModel, items: readonly NphTreeNode[], query: string): readonly NphTreeNode[] {
  if (query.trim() === '') return items;
  return model.rows.filter((row) => row.kind === 'node' && row.level === 1).map((row) => row.node);
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphTreeSelect);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-tree-select': NphTreeSelect;
  }
}
