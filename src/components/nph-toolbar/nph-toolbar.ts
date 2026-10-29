/**
 * `nph-toolbar` — the bar that gathers, in one line, the actions for one area of the screen,
 * and the strip of applied filters below it.
 *
 * Contract accepted in Figma (board `1626:44`, documentation `2944:6528`, set `2105:426`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-55, sheet
 * `fichas/nph-toolbar.md`, `design.md` and decision P104 — nph-toolbar: API and semantics:
 * - `type` (the Figma `tipo`): `bulk` (default), `page`, `tools`, `floating` or
 *   `applied-filters`, the five types of the set. Reflects,
 *   because the internal CSS selects the background, the border and the layout by it;
 * - `size` (the Figma `tamanho`): `compact`, `default` (default) or `large`. The bar has no
 *   height of its own: it writes `size` on every direct child that has one (`nph-button`,
 *   `nph-togglebutton`, `nph-toggle-group` and `nph-input`; `nph-chip` takes `compact` in the
 *   compact bar and `default` in the other two), as `nph-toggle-group` does with its buttons
 *   (P76), so a `size` set on such a child is overwritten. Reflects;
 * - the zones are slots. The default slot is the start; `center` is the middle and shows only
 *   with content (the Figma `centro`); `end` holds the actions on the right. `checkbox` takes
 *   the `nph-checkbox` of the bulk bar, before the count (the Figma `caixa de seleção`). The
 *   pieces go in as direct children: a wrapper hides them from the size and the keyboard;
 * - `count-text` (the Figma `contagem`): the text "N of M selected", already localized by the
 *   consuming application, drawn by the bar in `text/label-md` with its own count color. Only
 *   in the bulk and floating bars;
 * - `label`: the name of the area, as "Table actions". It becomes the `aria-label` of the
 *   host. A name the consumer puts on the host (`aria-label` or `aria-labelledby`) is also a
 *   name. The host is the `role="toolbar"`; the applied filters strip is a `role="group"`,
 *   because the filters are not actions (D-3);
 * - keyboard, the toolbar pattern of the W3C ARIA Authoring Practices: the actions are one Tab
 *   stop (a roving tabindex on the host of each piece). The left and right arrows move between
 *   them, wrapping at the ends (D-2), and Home and End go to the first and the last. The
 *   actions are `nph-button`, `nph-togglebutton` (also inside an `nph-toggle-group`) and
 *   `nph-checkbox`; a disabled one is skipped. `nph-input` keeps its own Tab stop and its
 *   arrow keys, which edit its text (D-2). The bar draws no focus of its own;
 * - in the bulk bar, the hover of the secondary ghost actions, with text and icon only, uses
 *   `toolbar/bulk-action-background-hover`, so it stays visible over the highlighted
 *   background (D-1);
 * - applied filters: one removable `nph-chip` per filter and one `nph-button` (Clear filters)
 *   after the last chip, each a Tab stop of its own (D-3). With no chip the strip is not
 *   shown, and the bar keeps its height. The bar never removes a chip: the consumer takes the
 *   filter away on `nph-remove`. When the chip leaves, the focus goes to the next chip, else to
 *   the previous one, else to `trigger`, the `id` of the button that opens the filters, looked
 *   up in the same root (`getRootNode()`), as the `for` of `nph-tooltip`. When Clear filters
 *   empties the strip, the focus goes to `trigger` too. A status region announces
 *   `removed-text` (with `{text}`, the text of the chip) after a chip leaves, and
 *   `cleared-text` after Clear filters empties the strip (D-4). Keep the strip in the page
 *   while it is empty: removing it loses the announcement and the focus;
 * - no own event, no `::part`, no color property; every piece keeps its own color, state and
 *   focus;
 * - invalid input does not render and emits `console.error` only in development, one per
 *   cause (P21): a `type` outside the five, a `size` outside the three and no name. A problem
 *   in the composition renders anyway and emits `console.warn` only in development, once
 *   while it lasts: `count-text` outside the bulk and floating bars, content in a slot the type
 *   does not show, more than one main action (primary solid), a divider that opens or closes
 *   the bar and, in the applied filters, a child that is not a removable chip or the clear
 *   button, more than one button, the button before a chip, and no `trigger` or `removed-text`.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import toolbarCss from './nph-toolbar.css?inline';

const TAG = 'nph-toolbar';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_TOOLBAR_TYPES = ['bulk', 'page', 'tools', 'floating', 'applied-filters'] as const;
export type NphToolbarType = (typeof NPH_TOOLBAR_TYPES)[number];

export const NPH_TOOLBAR_SIZES = ['compact', 'default', 'large'] as const;
export type NphToolbarSize = (typeof NPH_TOOLBAR_SIZES)[number];

/** The types that show `count-text`. */
const COUNTED_TYPES: readonly string[] = ['bulk', 'floating'];

/** The `nph-remove` event of `nph-chip`, which the applied filters strip listens to. */
const CHIP_REMOVE_EVENT = 'nph-remove';

/** The children whose height follows the bar. `nph-chip` has only two sizes, mapped apart. */
const SIZED_TAGS = ['nph-button', 'nph-togglebutton', 'nph-toggle-group', 'nph-input'];

/** The actions of the arrow keys. `nph-toggle-group` lends its buttons. */
const ACTION_TAGS = ['nph-button', 'nph-togglebutton', 'nph-checkbox'];

/** The slots of the bar, in the order they are drawn. */
const BAR_SLOTS = ['checkbox', '', 'center', 'end'] as const;

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
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

function isType(value: string): value is NphToolbarType {
  return (NPH_TOOLBAR_TYPES as readonly string[]).includes(value);
}

function isSize(value: string): value is NphToolbarSize {
  return (NPH_TOOLBAR_SIZES as readonly string[]).includes(value);
}

/** The slot an element of the host goes to; the default slot is the empty name. */
function slotOf(element: Element): string {
  return element.getAttribute('slot') ?? '';
}

/** A disabled action takes no focus: its own attribute, or a disabled fieldset of a form control. */
function isDisabled(element: Element): boolean {
  return element.hasAttribute('disabled') || element.matches(':disabled');
}

/**
 * The actions that can hold the Tab stop: drawn (an invalid piece renders nothing), not disabled
 * and, when any of them is visible, visible. If none is visible — the bar inside a hidden
 * container — the drawn and enabled ones keep the stop, so the bar is reachable once shown.
 */
function focusable(actions: readonly Element[]): Element[] {
  const candidates = actions.filter((action) => action.hasAttribute(RENDERED_ATTRIBUTE) && !isDisabled(action));
  const visible = candidates.filter((action) => action.checkVisibility?.() ?? true);
  return visible.length > 0 ? visible : candidates;
}

function isRemovableChip(element: Element): boolean {
  return element.localName === 'nph-chip' && (element.getAttribute('type') ?? 'removable') === 'removable';
}

/** The main action of `nph-button`: primary solid, the default of both properties. */
function isMainAction(element: Element): boolean {
  if (element.localName !== 'nph-button') {
    return false;
  }
  const button = element as HTMLElement & { severity?: string; emphasis?: string };
  return (button.severity ?? 'primary') === 'primary' && (button.emphasis ?? 'solid') === 'solid';
}

/** What a removal by the X left to settle once the chip is gone. */
interface PendingRemoval {
  readonly chip: Element;
  /** The chips after it, nearest first, and the chips before it, nearest first. */
  readonly after: readonly Element[];
  readonly before: readonly Element[];
  readonly text: string;
  readonly focusInside: boolean;
}

export class NphToolbar extends LitElement {
  static override styles = unsafeCSS(toolbarCss);

  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'aria-label', 'aria-labelledby'];
  }

  static override properties = {
    type: { type: String, reflect: true },
    size: { type: String, reflect: true },
    label: { type: String },
    countText: { type: String, attribute: 'count-text' },
    trigger: { type: String },
    removedText: { type: String, attribute: 'removed-text' },
    clearedText: { type: String, attribute: 'cleared-text' },
    announcement: { state: true },
    hasCenter: { state: true },
    hasChips: { state: true },
  };

  /** `bulk`, `page`, `tools`, `floating` or `applied-filters`. */
  declare type: NphToolbarType;
  /** `compact`, `default` or `large`; the pieces of the bar follow it. */
  declare size: NphToolbarSize;
  /** The name of the area, already localized by the consuming application. */
  declare label: string;
  /** "N of M selected", already localized; only in the bulk and floating bars. */
  declare countText: string;
  /** Applied filters: the `id` of the button that opens the filters, in the same root. */
  declare trigger: string;
  /** Applied filters: the announcement after a chip leaves, with `{text}`. */
  declare removedText: string;
  /** Applied filters: the announcement after Clear filters empties the strip. */
  declare clearedText: string;

  declare private announcement: string;
  declare private hasCenter: boolean;
  declare private hasChips: boolean;

  private valid = false;
  private labelApplied = false;
  private applyingSemantics = false;
  private accessibleNameChanged = false;
  /** The composition warnings already shown, so a problem that stays does not repeat. */
  private shownWarnings = new Set<string>();
  /** The action that holds the Tab stop. */
  private activeAction: Element | undefined;
  /** The pieces whose `tabindex` the bar wrote, so it can give them back. */
  private managedActions = new Set<Element>();
  /** The chips as the strip last saw them: the consumer may remove a chip before the bar hears of it. */
  private knownChips: Element[] = [];
  /**
   * Every clear button the strip has held. A consumer may remove the button with the chips, and
   * after a real click the slot may see it leave before the bar hears the click.
   */
  private readonly knownButtons = new WeakSet<Element>();
  /** Whether the focus was in the bar a moment ago: it outlives the removal of the focused chip. */
  private focusInside = false;
  /** One pending removal per chip: the consumer may take several filters away late, in any order. */
  private pendingRemovals = new Map<Element, PendingRemoval>();
  private pendingClear: { readonly focusInside: boolean } | undefined;
  /**
   * Watches the `size` of the direct children and the `disabled` of every action, which raise
   * no `slotchange`: a `size` set on a child is written back, and a disabled action gives its
   * Tab stop away.
   */
  private readonly childObserver = new MutationObserver((records) => this.onChildMutation(records));
  /**
   * Watches the `disabled` of the ancestor fieldsets: a disabled fieldset disables a form control
   * of the bar (`nph-checkbox`) without touching its attribute, and the Tab stop must move on.
   */
  private readonly fieldsetObserver = new MutationObserver(() => this.syncActions());

  constructor() {
    super();
    this.type = 'bulk';
    this.size = 'default';
    this.label = '';
    this.countText = '';
    this.trigger = '';
    this.removedText = '';
    this.clearedText = '';
    this.announcement = '';
    this.hasCenter = false;
    this.hasChips = false;
    this.addEventListener('keydown', (event) => this.onKeydown(event));
    this.addEventListener('focusin', (event) => this.onFocusin(event));
    this.addEventListener('focusout', (event) => this.onFocusout(event));
    this.addEventListener(CHIP_REMOVE_EVENT, (event) => this.onChipRemove(event));
    this.addEventListener('click', (event) => this.onClick(event));
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      (name === 'aria-label' || name === 'aria-labelledby') &&
      oldValue !== newValue &&
      !this.applyingSemantics
    ) {
      this.accessibleNameChanged = true;
      this.requestUpdate();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.childObserver.observe(this, {
      attributes: true,
      attributeFilter: ['size', 'disabled', RENDERED_ATTRIBUTE, 'hidden', 'style', 'class'],
      childList: true,
      subtree: true,
    });
    for (const fieldset of this.ancestorFieldsets()) {
      this.fieldsetObserver.observe(fieldset, { attributes: true, attributeFilter: ['disabled'] });
    }
    this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.childObserver.disconnect();
    this.fieldsetObserver.disconnect();
    this.releaseActions(new Set());
  }

  /** The fieldsets around the bar, crossing the shadow roots it sits in. */
  private ancestorFieldsets(): HTMLFieldSetElement[] {
    const found: HTMLFieldSetElement[] = [];
    let node: Node | null = this.parentNode;
    while (node !== null) {
      if (node instanceof HTMLFieldSetElement) {
        found.push(node);
      }
      node = node instanceof ShadowRoot ? node.host : node.parentNode;
    }
    return found;
  }

  private get isFilters(): boolean {
    return this.type === 'applied-filters';
  }

  /** The direct children the bar draws, in its order: by slot, then by document order. */
  private orderedChildren(): Element[] {
    const children = [...this.children];
    if (this.isFilters) {
      return children.filter((child) => slotOf(child) === '');
    }
    /* The checkbox slot is drawn only in the bulk bar. */
    const slots = BAR_SLOTS.filter((name) => name !== 'checkbox' || this.type === 'bulk');
    return slots.flatMap((name) => children.filter((child) => slotOf(child) === name));
  }

  /** The actions of the arrow keys, in the order they are drawn. */
  private actions(): Element[] {
    if (!this.valid || this.isFilters) {
      return [];
    }
    return this.orderedChildren().flatMap((child) => {
      if (child.localName === 'nph-toggle-group') {
        return [...child.children].filter((button) => button.localName === 'nph-togglebutton');
      }
      return ACTION_TAGS.includes(child.localName) ? [child] : [];
    });
  }

  private rememberButtons(): void {
    for (const child of this.children) {
      if (slotOf(child) === '' && child.localName === 'nph-button') {
        this.knownButtons.add(child);
      }
    }
  }

  private chips(): Element[] {
    return [...this.children].filter((child) => slotOf(child) === '' && isRemovableChip(child));
  }

  private onChildMutation(records: MutationRecord[]): void {
    if (!this.valid) {
      return;
    }
    const sizeChanged = records.some(
      (record) => record.attributeName === 'size' && record.target instanceof Element && record.target.parentElement === this,
    );
    if (sizeChanged) {
      this.syncSizes();
    }
    /* A toggle button added to or removed from a direct group raises no slotchange in the bar. */
    const groupChanged = records.some(
      (record) =>
        record.type === 'childList' &&
        record.target instanceof Element &&
        record.target.parentElement === this &&
        record.target.localName === 'nph-toggle-group',
    );
    /* An action that is disabled, stops rendering or is hidden gives its Tab stop away. */
    const availability = ['disabled', RENDERED_ATTRIBUTE, 'hidden', 'style', 'class'];
    if (groupChanged || records.some((record) => availability.includes(record.attributeName ?? ''))) {
      this.syncActions();
    }
  }

  /** The bar is the source of the height: every direct child that has a size follows it. */
  private syncSizes(): void {
    const chipSize = this.size === 'compact' ? 'compact' : 'default';
    for (const child of this.children) {
      const sized = child as Element & { size?: string };
      if (SIZED_TAGS.includes(child.localName) && sized.size !== this.size) {
        sized.size = this.size;
      } else if (child.localName === 'nph-chip' && sized.size !== chipSize) {
        sized.size = chipSize;
      }
    }
  }

  /** The roving tabindex: one action holds the Tab stop, the others take `-1`. */
  private syncActions(): void {
    const actions = this.actions();
    const enabled = focusable(actions);
    if (this.activeAction === undefined || !enabled.includes(this.activeAction)) {
      this.activeAction = enabled[0];
    }
    for (const action of actions) {
      if (action === this.activeAction) {
        action.removeAttribute('tabindex');
      } else {
        action.setAttribute('tabindex', '-1');
      }
      this.managedActions.add(action);
    }
    this.releaseActions(new Set(actions));
  }

  /** A piece that left the bar gets its Tab order back. */
  private releaseActions(keep: Set<Element>): void {
    for (const action of this.managedActions) {
      if (!keep.has(action)) {
        action.removeAttribute('tabindex');
        this.managedActions.delete(action);
      }
    }
    if (this.activeAction !== undefined && !keep.has(this.activeAction)) {
      this.activeAction = undefined;
    }
  }

  /** The action an event came from, by its composed path. */
  private actionOf(event: Event): Element | undefined {
    const actions = this.actions();
    return event.composedPath().find((node): node is Element => node instanceof Element && actions.includes(node));
  }

  private onFocusin(event: FocusEvent): void {
    this.focusInside = true;
    const action = this.actionOf(event);
    if (action !== undefined && action !== this.activeAction) {
      this.activeAction = action;
      this.syncActions();
    }
  }

  /**
   * The focus left for an element outside the bar, or for nothing. Chromium also fires
   * `focusout` while a focused chip is being removed, before the bar hears `nph-remove`, so
   * the flag is cleared only after the current task, if the focus did not come back.
   */
  private onFocusout(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && this.contains(next)) {
      return;
    }
    setTimeout(() => {
      if (!this.matches(':focus-within')) {
        this.focusInside = false;
      }
    });
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const action = this.actionOf(event);
    if (action === undefined) {
      return;
    }
    const enabled = focusable(this.actions());
    const position = enabled.indexOf(action);
    if (position === -1) {
      return;
    }
    const rtl = getComputedStyle(this).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    let target: Element | undefined;
    if (event.key === forward) {
      target = enabled[(position + 1) % enabled.length];
    } else if (event.key === backward) {
      target = enabled[(position - 1 + enabled.length) % enabled.length];
    } else if (event.key === 'Home') {
      target = enabled[0];
    } else if (event.key === 'End') {
      target = enabled[enabled.length - 1];
    } else {
      return;
    }
    event.preventDefault();
    if (target !== undefined) {
      this.activeAction = target;
      this.syncActions();
      (target as HTMLElement).focus();
    }
  }

  /** The person pressed the X of a chip: the bar remembers where the focus goes once it leaves. */
  private onChipRemove(event: Event): void {
    if (!this.valid || !this.isFilters) {
      return;
    }
    const chips = this.knownChips;
    const chip = event.composedPath().find((node): node is Element => node instanceof Element && chips.includes(node));
    if (chip === undefined) {
      return;
    }
    const position = chips.indexOf(chip);
    const detail = (event as CustomEvent<{ text?: string }>).detail;
    this.pendingClear = undefined;
    this.pendingRemovals.set(chip, {
      chip,
      after: chips.slice(position + 1),
      before: chips.slice(0, position).reverse(),
      text: detail?.text ?? '',
      focusInside: this.focusInside,
    });
    /* A consumer listening on the chip may have removed it already. */
    this.settleFilters();
  }

  /** A click on the clear button of the strip: once the strip is empty, the focus goes to `trigger`. */
  private onClick(event: Event): void {
    if (!this.valid || !this.isFilters) {
      return;
    }
    this.rememberButtons();
    const button = event
      .composedPath()
      .find((node): node is Element => node instanceof Element && this.knownButtons.has(node));
    if (button === undefined || isDisabled(button)) {
      return;
    }
    this.pendingRemovals.clear();
    this.pendingClear = { focusInside: this.focusInside };
    /* After a real click, the slot may have seen the chips leave before this listener ran. */
    this.settleFilters();
  }

  /** The element `trigger` names, in the same root as the bar. */
  private triggerElement(): HTMLElement | null {
    const id = (this.trigger ?? '').trim();
    if (id === '') {
      return null;
    }
    const root = this.getRootNode() as Document | ShadowRoot;
    return root.getElementById?.(id) ?? null;
  }

  /**
   * The focus may move only when it was in the strip and has not gone somewhere else since. It is
   * read in the root of the bar: in a shadow root, `document.activeElement` is the outer host.
   */
  private mayMoveFocus(focusInside: boolean): boolean {
    if (!focusInside) {
      return false;
    }
    const root = this.getRootNode() as Document | ShadowRoot;
    const active = root.activeElement;
    if (active !== null) {
      return active === document.body || this.contains(active);
    }
    /* No focus in this shadow root: move it only if nothing in the document holds it. */
    const outer = document.activeElement;
    return outer === null || outer === document.body;
  }

  private moveFocusTo(target: Element | undefined | null): void {
    if (target instanceof HTMLElement) {
      target.focus();
    } else if (target === null) {
      devWarn('trigger names no element in the same root: the focus has nowhere to go after the last filter.');
    }
  }

  private announce(message: string): void {
    /* A new text each time, so the same sentence is announced again. */
    this.announcement = '';
    void this.updateComplete.then(() => {
      this.announcement = message;
    });
  }

  /** After the children changed: a chip that left, or a strip that Clear filters emptied. */
  private settleFilters(): void {
    const chips = this.chips();
    this.knownChips = chips;
    this.rememberButtons();
    this.hasChips = chips.length > 0;
    const settled = [...this.pendingRemovals.values()].filter((removal) => !chips.includes(removal.chip));
    const removal = settled[settled.length - 1];
    if (removal !== undefined) {
      for (const done of settled) {
        this.pendingRemovals.delete(done.chip);
      }
      const text = (this.removedText ?? '').trim();
      if (text !== '') {
        /* A function, so the text of the chip goes in literally: `$&` or `$$` stay as written. */
        this.announce(settled.map((done) => text.replaceAll('{text}', () => done.text)).join(' '));
      }
      /* The focus follows the last removal the person asked for. */
      if (this.mayMoveFocus(removal.focusInside)) {
        /* The nearest chip that is still there and takes focus: after it, else before it. */
        const neighbor = [...removal.after, ...removal.before].find((chip) => chips.includes(chip) && !isDisabled(chip));
        this.moveFocusTo(neighbor ?? this.triggerElement());
      }
      return;
    }
    const clear = this.pendingClear;
    if (clear !== undefined && chips.length === 0) {
      this.pendingClear = undefined;
      const text = (this.clearedText ?? '').trim();
      if (text !== '') {
        this.announce(text);
      }
      if (this.mayMoveFocus(clear.focusInside)) {
        this.moveFocusTo(this.triggerElement());
      }
    }
  }

  /** Composition problems: they render anyway, and each shows once while it lasts. */
  private checkComposition(): void {
    const warnings = new Set<string>();
    const children = [...this.children];
    const type = this.type;

    if ((this.countText ?? '').trim() !== '' && !COUNTED_TYPES.includes(type)) {
      warnings.add('count-text shows only in the bulk and floating bars.');
    }

    if (this.isFilters) {
      if (children.some((child) => slotOf(child) !== '')) {
        warnings.add('the applied filters strip has no checkbox, center or end slot: that content is not shown.');
      }
      const strip = children.filter((child) => slotOf(child) === '');
      if (strip.some((child) => !isRemovableChip(child) && child.localName !== 'nph-button')) {
        warnings.add('the applied filters strip takes removable nph-chip children and one nph-button to clear them.');
      }
      const buttons = strip.filter((child) => child.localName === 'nph-button');
      if (buttons.length > 1) {
        warnings.add('the applied filters strip takes one nph-button, the one that clears every filter.');
      }
      const lastChip = strip.map(isRemovableChip).lastIndexOf(true);
      if (buttons.some((button) => strip.indexOf(button) < lastChip)) {
        warnings.add('the clear button goes after the last chip.');
      }
      if ((this.trigger ?? '').trim() === '') {
        warnings.add('trigger is empty: after the last filter leaves, the focus has nowhere to go.');
      }
      if ((this.removedText ?? '').trim() === '') {
        warnings.add('removed-text is empty: the removal of a filter is not announced.');
      }
    } else {
      const checkboxSlot = children.filter((child) => slotOf(child) === 'checkbox');
      if (checkboxSlot.length > 0 && type !== 'bulk') {
        warnings.add('the checkbox slot shows only in the bulk bar.');
      }
      if (checkboxSlot.length > 1 || checkboxSlot.some((child) => child.localName !== 'nph-checkbox')) {
        warnings.add('the checkbox slot takes one nph-checkbox.');
      }
      if (children.filter(isMainAction).length > 1) {
        warnings.add('more than one main action: use one primary solid and the others in ghost.');
      }
      const drawn = this.orderedChildren();
      const first = drawn[0];
      const last = drawn[drawn.length - 1];
      if (first?.localName === 'nph-separator' || last?.localName === 'nph-separator') {
        warnings.add('a divider goes between groups of actions: it never opens or closes the bar.');
      }
    }

    for (const warning of warnings) {
      if (!this.shownWarnings.has(warning)) {
        devWarn(warning);
      }
    }
    this.shownWarnings = warnings;
  }

  /** The host is the toolbar, or the group of the applied filters: role and name come from here. */
  private applySemantics(): void {
    this.applyingSemantics = true;
    try {
      this.setAttribute('role', this.isFilters ? 'group' : 'toolbar');
      const label = (this.label ?? '').trim();
      if (label !== '') {
        this.setAttribute('aria-label', label);
        this.labelApplied = true;
      } else if (this.labelApplied) {
        this.removeAttribute('aria-label');
        this.labelApplied = false;
      }
    } finally {
      this.applyingSemantics = false;
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    this.applySemantics();

    /* Only the inputs that decide validity are checked again, so the errors do not repeat. */
    if (changed.has('label') || changed.has('type') || changed.has('size') || this.accessibleNameChanged || !this.hasUpdated) {
      this.accessibleNameChanged = false;
      /* Compared as written, as on the pieces, whose CSS selects by the exact attribute. */
      const type = this.type ?? '';
      const size = this.size ?? '';
      const named = ['aria-label', 'aria-labelledby'].some((name) => (this.getAttribute(name) ?? '').trim() !== '');
      let valid = true;

      if (!isType(type)) {
        devError(`type "${type}" does not exist. Use ${NPH_TOOLBAR_TYPES.join(', ')}.`);
        valid = false;
      }
      if (!isSize(size)) {
        devError(`size "${size}" does not exist. Use ${NPH_TOOLBAR_SIZES.join(', ')}.`);
        valid = false;
      }
      if (!named) {
        devError('the bar needs a name: set label, aria-label or aria-labelledby, so the area is announced.');
        valid = false;
      }
      this.valid = valid;
      this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
    }
    this.hasCenter = [...this.children].some((child) => slotOf(child) === 'center');
    this.knownChips = this.chips();
    this.rememberButtons();
    this.hasChips = this.knownChips.length > 0;
  }

  protected override updated(): void {
    if (this.valid) {
      this.syncSizes();
      this.syncActions();
      this.checkComposition();
    } else {
      this.releaseActions(new Set());
    }
  }

  private onSlotChange(): void {
    this.hasCenter = [...this.children].some((child) => slotOf(child) === 'center');
    this.syncSizes();
    this.syncActions();
    this.checkComposition();
    if (this.isFilters) {
      this.settleFilters();
    }
  }

  private renderCount(): TemplateResult | typeof nothing {
    const text = (this.countText ?? '').trim();
    if (text === '' || !COUNTED_TYPES.includes(this.type)) {
      return nothing;
    }
    return html`<span class="count">${text}</span>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    if (this.isFilters) {
      return html`<div class="strip" ?hidden=${!this.hasChips}><slot @slotchange=${this.onSlotChange}></slot></div>
        <div class="status" role="status">${this.announcement}</div>`;
    }
    return html`<div class="bar">
      <div class="zone start">
        ${this.type === 'bulk' ? html`<slot name="checkbox" @slotchange=${this.onSlotChange}></slot>` : nothing}
        ${this.renderCount()}<slot @slotchange=${this.onSlotChange}></slot>
      </div>
      <div class="zone center" ?hidden=${!this.hasCenter}><slot name="center" @slotchange=${this.onSlotChange}></slot></div>
      <div class="zone end"><slot name="end" @slotchange=${this.onSlotChange}></slot></div>
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphToolbar);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-toolbar': NphToolbar;
  }
}
