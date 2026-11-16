/**
 * `nph-menubar` — the bar of command menus of an application: top items that each open a panel of
 * commands.
 *
 * Contract accepted in Figma (documentation frame `6432:8686`, root `6410:7413`, sets `6410:7769` and
 * `6402:4299`), recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-83, sheet
 * `fichas/nph-menubar.md`, `design.md` and decision P126 — nph-menubar: API and semantics:
 * - ONE tag, a piece of its own. The evidence calls the panel an instance of `nph-dropdown-menu`, but that
 *   menu opens from one visible trigger, below it, in one level, and closes when the focus or the pointer
 *   goes to a second panel (P92). So, as `nph-context-menu` does (P113), the bar draws its own panels with
 *   the item, the group label and the separator of that menu: the same `dropdown/*` tokens, and the
 *   `menubar/*` tokens for the bar and its top items;
 * - `menus`: the top items, in order. Property only. A menu is `{ value, label, disabled?, items }`; `items`
 *   are the entries of its panel: an item (`type` absent or `item`) has `value` and `text`, and optionally
 *   `icon`, `severity` (`default` or `destructive`), `selection` (`none`, `single` or `multiple`),
 *   `checked`, `shortcut`, `submenu` (a list of entries, ONE level) and `disabled`; a `label` entry names
 *   the group that follows it; a `separator` entry closes it. Texts are already localized by the consuming
 *   application;
 * - `open-menu`: the `value` of the menu whose panel is open, empty when closed. Reflects. The bar writes it;
 *   the consumer may set it to show a panel open, and a panel opened from code takes no focus. It is ignored
 *   while `narrow`, and a value that names a disabled menu, or a menu that sits in the overflow item, is cleared;
 * - `open-submenu`: the `value` of the item whose submenu is open, empty when closed. Reflects;
 * - `label` and the host `aria-label`: the accessible name of the bar (the menubar role asks for one);
 * - `more-label`: the text of the last top item, which holds the menus that do not fit the width. The bar
 *   measures itself for that. Without it nothing overflows into a menu, and the bar warns once in development
 *   when it is wider than its room;
 * - `narrow`: the application swaps the bar for the button with the `bars` icon, which opens one panel with
 *   the menus as items with a submenu. Reflects. The consumer chooses it, since the width is the page's to
 *   know: the piece does not measure the breakpoint (the rule of `narrow` of `nph-navigation-menu`);
 * - `menu-label`: the accessible name of that button (the icon has no text), required when `narrow`;
 * - the event `nph-item-select` (bubbles), with `detail: { value, checked, menu }`, fired only when the
 *   person activates an item: `checked` is the new state of a single or multiple choice and `null` on a
 *   common item; `menu` is the `value` of the top item the command belongs to, also from the overflow
 *   panel and from the narrow button. The bar then replaces `menus` with a new list that carries the new
 *   `checked`; it never changes the objects of the consumer;
 * - no slot, no `::part` and no color property;
 * - invalid input does not render and emits `console.error` only in development, one per cause (P21 rule):
 *   `menus` that is not a list or has no valid menu, a menu without `value`, `label` or a valid item, two
 *   menus or two items of a menu with the same `value`, an invalid item, a `narrow` bar without
 *   `menu-label`, and an `open-menu` or `open-submenu` that names nothing. A bar with no accessible name
 *   draws and warns: the name may arrive after the first render.
 *
 * SEMANTICS — the menubar pattern of the APG. The bar is `role="menubar"` and each top item is a native
 * `button` with `role="menuitem"`, `aria-haspopup="menu"` and `aria-expanded`. There is one Tab stop in the
 * bar, on the top item used last (the first one, the first time), so Tab enters and leaves it. A disabled
 * item, top or in a panel, is `aria-disabled`: it takes the focus and does not run. The panel is
 * `role="menu"` named by its top item; an item with a submenu carries `aria-haspopup`, `aria-expanded` and
 * `aria-controls`; the shortcut is in `aria-keyshortcuts`.
 *
 * KEYBOARD — on the bar the arrows (Left and Right, swapped in right-to-left writing), Home and End move
 * between the top items with wrap; Enter, Space and Down open the panel on its first item, Up on its last.
 * With a panel open the arrows close it, move to the neighbor top item and open its panel, keeping the focus
 * on that top item. In a panel the arrows move with wrap, Home and End go to the ends, a typed character
 * goes to the next item that starts with it; Right opens a submenu, or goes to the next menu when the item
 * has none; Left closes the submenu, or goes to the previous menu. Enter activates the item and closes the
 * panel, also on a choice; Space on a choice checks it without closing, and on a common item does the same
 * as Enter. Esc closes one level at a time and gives the focus back to the item that opened it; with the
 * panel closed, on the top item, it does nothing. Tab closes the panel and leaves the bar.
 *
 * POINTER — a click on a top item opens its panel, which gives the first item the focus without showing it;
 * a click on the open one closes it. With a panel open, the pointer over another top item switches to it. In
 * a panel the pointer highlights the item and takes the focus to it (DSA-45 D-6); an item with a submenu opens
 * it after `motion/hover-delay`. A press outside closes the panels and leaves the focus where the person
 * pressed.
 *
 * LAYER — each panel is a `popover="manual"`, so it lives in the top layer: no `z-index` and no clipping by an
 * ancestor. The first opens `menubar/panel-offset` below its top item, aligned to the start edge; the submenu
 * opens beside it at `dropdown/submenu-offset`, on the line of its item. Close to the window edge a panel
 * turns up, moves sideways or shrinks and scrolls, keeping `COLLISION_PADDING` (4, `core/space/100`, a code
 * setting with no token) from the edge. The panels follow the top item on scroll and resize.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';

import '../nph-button/nph-button';
import '../nph-checkbox/nph-checkbox';
import '../nph-icon/nph-icon';
import '../nph-separator/nph-separator';
import menubarCss from './nph-menubar.css?inline';

const TAG = 'nph-menubar';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The key of the panel of the overflow item and of the narrow button; it cannot be the `value` of a menu. */
const MORE_KEY = '\u0000more';

/** The distance a panel keeps from the window edge: `core/space/100`, a code setting with no token (DSA-83). */
const COLLISION_PADDING = 4;

/** The two types of the item. */
export const NPH_MENUBAR_SEVERITIES = ['default', 'destructive'] as const;
export type NphMenubarSeverity = (typeof NPH_MENUBAR_SEVERITIES)[number];

/** The three choices of the item. */
export const NPH_MENUBAR_SELECTIONS = ['none', 'single', 'multiple'] as const;
export type NphMenubarSelection = (typeof NPH_MENUBAR_SELECTIONS)[number];

/** One command of a panel. */
export interface NphMenubarItem {
  type?: 'item';
  /** What the event reports. Unique inside the menu. */
  value: string;
  /** The label, already localized by the consuming application. */
  text: string;
  /** A core name of `nph-icon`: the start icon. Absent or empty: no icon. */
  icon?: string;
  severity?: NphMenubarSeverity;
  selection?: NphMenubarSelection;
  checked?: boolean;
  /** Plain text at the end, such as `Ctrl+N`. An item with a submenu carries none. */
  shortcut?: string;
  /** The commands that unfold from this item: ONE level, so no entry of the list has a submenu. */
  submenu?: readonly NphMenubarEntry[];
  disabled?: boolean;
}

/** The name of the group that follows it. */
export interface NphMenubarLabel {
  type: 'label';
  text: string;
}

/** The line between two groups. */
export interface NphMenubarSeparator {
  type: 'separator';
}

export type NphMenubarEntry = NphMenubarItem | NphMenubarLabel | NphMenubarSeparator;

/** A top item and the panel it opens. */
export interface NphMenubarMenu {
  /** What `open-menu` and the event report. Unique in the bar. */
  value: string;
  /** The text of the top item, already localized. */
  label: string;
  disabled?: boolean;
  /** The entries of the panel. */
  items: readonly NphMenubarEntry[];
}

/** `nph-item-select`: the command the person activated, its new state and the top item it belongs to. */
export interface NphMenubarItemSelectDetail {
  readonly value: string;
  readonly checked: boolean | null;
  readonly menu: string;
}

/** A typed search keeps its characters together for this long, as in `nph-dropdown-menu`. */
const TYPEAHEAD_MS = 500;

let nextId = 0;

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** `300ms` or `0.3s` in milliseconds; `NaN` when it is not a time. */
function milliseconds(value: string): number {
  const match = /^\s*(-?\d*\.?\d+)\s*(ms|s)\s*$/.exec(value);
  if (match === null) return Number.NaN;
  return Number.parseFloat(match[1] as string) * (match[2] === 's' ? 1000 : 1);
}

const MODIFIER_SYMBOLS: Readonly<Record<string, string>> = {
  '⌘': 'Meta',
  '⌥': 'Alt',
  '⇧': 'Shift',
  '⌃': 'Control',
  '⌫': 'Backspace',
  '⌦': 'Delete',
  '↩': 'Enter',
  '⏎': 'Enter',
  '⎋': 'Escape',
};

/* `supr` is the Spanish label of the Delete key. */
/* cspell:ignore supr */
const KEY_NAMES: Readonly<Record<string, string>> = {
  ctrl: 'Control',
  control: 'Control',
  cmd: 'Meta',
  command: 'Meta',
  meta: 'Meta',
  win: 'Meta',
  opt: 'Alt',
  option: 'Alt',
  alt: 'Alt',
  shift: 'Shift',
  del: 'Delete',
  supr: 'Delete',
  delete: 'Delete',
  '←': 'ArrowLeft',
  '→': 'ArrowRight',
  '↑': 'ArrowUp',
  '↓': 'ArrowDown',
  esc: 'Escape',
  escape: 'Escape',
  enter: 'Enter',
  return: 'Enter',
  backspace: 'Backspace',
  tab: 'Tab',
  space: 'Space',
};

/**
 * The shortcut as the visible text writes it (`⌘N`, `Ctrl+Shift+K`, `Del`) in the syntax of
 * `aria-keyshortcuts` (`Meta+N`, `Control+Shift+K`, `Delete`).
 */
export function keyShortcutsOf(shortcut: string): string {
  const keys: string[] = [];
  for (const part of shortcut.split('+')) {
    let rest = part.trim();
    if (rest === '') {
      continue;
    }
    for (const symbol of Object.keys(MODIFIER_SYMBOLS)) {
      while (rest.startsWith(symbol)) {
        keys.push(MODIFIER_SYMBOLS[symbol] as string);
        rest = rest.slice(symbol.length).trim();
      }
    }
    if (rest !== '') {
      keys.push(KEY_NAMES[rest.toLocaleLowerCase()] ?? (rest.length === 1 ? rest.toLocaleUpperCase() : rest));
    }
  }
  return keys.join('+');
}

/** An item as the panel draws it: the entry, its position in its list and its group. */
interface Row {
  entry: NphMenubarItem;
  index: number;
  group: number;
  /** The groups of the submenu, or `null` when the item has none. */
  sub: Group[] | null;
}

/** A group: the label that opens it, if any, and its items. */
interface Group {
  label: string;
  rows: Row[];
  /** A separator comes before the group. */
  separated: boolean;
}

/** A valid top item with its drawn groups. */
interface MenuModel {
  value: string;
  label: string;
  disabled: boolean;
  groups: Group[];
  /** The object of the consumer: its identity is what a rewrite of `menus` looks for. */
  source: NphMenubarMenu;
}

/**
 * The groups of a list of entries. A `label` opens a group; a `separator` closes it. Items
 * before the first label, or after a separator with no label, form a group with no name.
 * Single choice is exclusive inside a group. `accept` says whether an item can be drawn: `false`
 * leaves it out; otherwise it returns the groups of its submenu, or `null`.
 */
export function groupsOf(entries: readonly NphMenubarEntry[], accept: (entry: NphMenubarItem) => Group[] | null | false = () => null): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let separated = false;
  entries.forEach((entry, index) => {
    if (entry === null || typeof entry !== 'object') {
      return;
    }
    if (entry.type === 'separator') {
      current = null;
      separated = groups.length > 0;
      return;
    }
    if (entry.type === 'label') {
      current = { label: trimmed(entry.text), rows: [], separated };
      separated = false;
      groups.push(current);
      return;
    }
    const sub = accept(entry);
    if (sub === false) {
      return;
    }
    if (current === null) {
      current = { label: '', rows: [], separated };
      separated = false;
      groups.push(current);
    }
    current.rows.push({ entry, index, group: groups.length - 1, sub });
  });
  /* An empty group is dropped; the separator before it goes to the next group that is drawn. */
  const drawn: Group[] = [];
  let carried = false;
  for (const group of groups) {
    if (group.rows.length === 0) {
      carried = carried || group.separated;
      continue;
    }
    const position = drawn.length;
    drawn.push({ ...group, separated: position > 0 && (group.separated || carried), rows: group.rows.map((row) => ({ ...row, group: position })) });
    carried = false;
  }
  return drawn;
}

function isItem(entry: unknown): entry is NphMenubarItem {
  return entry !== null && typeof entry === 'object' && (entry as { type?: string }).type !== 'label' && (entry as { type?: string }).type !== 'separator';
}

/**
 * The entries of a menu in one level: an item that has a submenu becomes a group label followed by its
 * items, so the overflow panel and the narrow panel never need a third level. A disabled item takes its
 * items with it.
 */
export function flattenSubmenus(entries: readonly NphMenubarEntry[]): NphMenubarEntry[] {
  const out: NphMenubarEntry[] = [];
  let afterGroup = false;
  for (const entry of entries) {
    if (isItem(entry) && Array.isArray(entry.submenu)) {
      const last = out.at(-1);
      if (last !== undefined && last.type !== 'separator') {
        out.push({ type: 'separator' });
      }
      out.push({ type: 'label', text: entry.text });
      for (const child of entry.submenu) {
        out.push(entry.disabled === true && isItem(child) ? { ...child, disabled: true } : child);
      }
      afterGroup = true;
      continue;
    }
    if (afterGroup && entry !== null && typeof entry === 'object' && entry.type !== 'separator') {
      out.push({ type: 'separator' });
    }
    afterGroup = false;
    out.push(entry);
  }
  return out;
}

/** The same entries with `change` applied to every item, also inside a submenu; no object of the input changes. */
function mapItems(entries: readonly NphMenubarEntry[], change: (item: NphMenubarItem) => NphMenubarItem): NphMenubarEntry[] {
  return entries.map((entry) => {
    if (!isItem(entry)) {
      return entry;
    }
    const mapped = Array.isArray(entry.submenu) ? { ...entry, submenu: mapItems(entry.submenu, change) } : entry;
    return change(mapped);
  });
}

type Level = 0 | 1;

export class NphMenubar extends LitElement {
  static override styles = unsafeCSS(menubarCss);

  static override properties = {
    menus: { attribute: false },
    openMenu: { type: String, reflect: true, attribute: 'open-menu' },
    openSubmenu: { type: String, reflect: true, attribute: 'open-submenu' },
    label: { type: String },
    moreLabel: { type: String, attribute: 'more-label' },
    narrow: { type: Boolean, reflect: true },
    menuLabel: { type: String, attribute: 'menu-label' },
    /* Internal state: the top items that fit, the one that holds the Tab stop and the overflow panel. */
    visibleCount: { state: true },
    stopKey: { state: true },
    moreOpen: { state: true },
  };

  /** The top items, in order. */
  declare menus: readonly NphMenubarMenu[];
  /** The `value` of the menu whose panel is open; empty when closed. */
  declare openMenu: string;
  /** The `value` of the item whose submenu is open; empty when closed. */
  declare openSubmenu: string;
  /** Accessible name of the bar. */
  declare label: string;
  /** The text of the overflow top item. */
  declare moreLabel: string;
  /** The bar is swapped for the button with the `bars` icon. */
  declare narrow: boolean;
  /** Accessible name of that button. */
  declare menuLabel: string;
  declare visibleCount: number;
  declare stopKey: string;
  declare moreOpen: boolean;

  private readonly uid = `nph-menubar-${(nextId += 1)}`;
  private reported = '';
  private valid = false;
  private models: MenuModel[] = [];
  /** The top items that fit, and those that went into the overflow item. */
  private shownModels: MenuModel[] = [];
  private overflowModels: MenuModel[] = [];
  private moreGroups: Group[] = [];
  /** The key of the panel that is open, or empty. */
  private activeKey = '';
  /** The key whose content the panel draws: kept after the close so the exit has its content. */
  private contentKey = '';
  private contentGroups: Group[] = [];
  private subRow: Row | null = null;
  private shown: Record<Level, boolean> = { 0: false, 1: false };
  private closeTimers: Partial<Record<Level, number>> = {};
  private frame: number | undefined;
  private measureFrame: number | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private layoutObserver: ResizeObserver | undefined;
  private readonly scrollTargets: EventTarget[] = [];
  private pendingFocus: 'first' | 'last' | null = null;
  private pendingSubFocus: 'first' | null = null;
  private typed = '';
  private typedTimer: number | undefined;
  private hoverTimer: number | undefined;
  private warnedDelay = false;
  private warnedOverflow = false;

  constructor() {
    super();
    this.menus = [];
    this.openMenu = '';
    this.openSubmenu = '';
    this.label = '';
    this.moreLabel = '';
    this.narrow = false;
    this.menuLabel = '';
    this.visibleCount = Number.POSITIVE_INFINITY;
    this.stopKey = '';
    this.moreOpen = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.layoutObserver = new ResizeObserver(() => this.scheduleMeasure());
    this.layoutObserver.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.layoutObserver?.disconnect();
    this.layoutObserver = undefined;
    if (this.measureFrame !== undefined) {
      cancelAnimationFrame(this.measureFrame);
      this.measureFrame = undefined;
    }
    this.hideNow();
  }

  /* ----- the bar -------------------------------------------------------------- */

  /** The keys of the top items that are drawn, in order: the visible menus, then the overflow item, or the narrow button. */
  private triggerKeys(): string[] {
    if (this.narrow) {
      return [MORE_KEY];
    }
    return [...this.shownModels.map((model) => model.value), ...(this.overflowing ? [MORE_KEY] : [])];
  }

  private get overflowing(): boolean {
    return !this.narrow && this.overflowModels.length > 0 && trimmed(this.moreLabel) !== '';
  }

  private triggerElement(key: string): HTMLElement | null {
    const all = this.renderRoot?.querySelectorAll<HTMLElement>('.bar > [data-key], .bar > [data-more], .narrow-button') ?? [];
    for (const element of all) {
      const elementKey = element.hasAttribute('data-more') ? MORE_KEY : (element.dataset.key ?? '');
      if (elementKey === key) {
        return element;
      }
    }
    return null;
  }

  private keyOfTrigger(element: Element): string {
    return element.hasAttribute('data-more') ? MORE_KEY : ((element as HTMLElement).dataset.key ?? '');
  }

  private isTriggerDisabled(key: string): boolean {
    if (key === MORE_KEY) {
      return false;
    }
    return this.models.find((model) => model.value === key)?.disabled === true;
  }

  /** The top item that holds the Tab stop: the one used last, or the first that is not disabled. */
  private get tabStop(): string {
    const keys = this.triggerKeys();
    if (keys.includes(this.stopKey)) {
      return this.stopKey;
    }
    return keys.find((key) => !this.isTriggerDisabled(key)) ?? keys[0] ?? '';
  }

  private focusTrigger(key: string): void {
    this.triggerElement(key)?.focus({ preventScroll: true });
  }

  /** Measures which top items fit the width and puts the others into the overflow item. */
  private scheduleMeasure(): void {
    if (this.measureFrame !== undefined) return;
    this.measureFrame = requestAnimationFrame(() => {
      this.measureFrame = undefined;
      this.measure();
    });
  }

  private measure(): void {
    if (!this.valid || this.narrow) {
      return;
    }
    const bar = this.renderRoot.querySelector<HTMLElement>('.bar');
    const probes = [...this.renderRoot.querySelectorAll<HTMLElement>('.probe > [data-probe]')];
    const more = this.renderRoot.querySelector<HTMLElement>('.probe > [data-probe-more]');
    const available = this.getBoundingClientRect().width;
    if (bar === null || more === null || available === 0 || probes.length !== this.models.length) {
      return;
    }
    const gap = parseFloat(getComputedStyle(bar).columnGap) || 0;
    const widths = probes.map((probe) => probe.getBoundingClientRect().width);
    const total = widths.reduce((sum, width) => sum + width, 0) + gap * Math.max(widths.length - 1, 0);
    let count = this.models.length;
    if (total > available + 0.5 && trimmed(this.moreLabel) === '' && !this.warnedOverflow) {
      /* Nothing can go into the overflow item without its text: the bar is wider than its room, and says so once. */
      this.warnedOverflow = true;
      devError('more-label is empty: the top items that do not fit cannot go into an overflow item.');
    }
    if (total > available + 0.5) {
      /* The overflow item takes the end of the bar: it and the gap before it come out of the room. */
      const room = available - more.getBoundingClientRect().width;
      count = 0;
      let used = 0;
      for (const width of widths) {
        used += width + gap;
        if (used > room + 0.5) break;
        count += 1;
      }
    }
    if (count !== this.visibleCount) {
      this.visibleCount = count;
    }
  }

  private readonly onTriggerFocusin = (event: FocusEvent): void => {
    const trigger = event.composedPath().find((target): target is HTMLElement => target instanceof HTMLElement && target.classList.contains('top') && !target.classList.contains('probe-item'));
    if (trigger !== undefined) {
      this.stopKey = this.keyOfTrigger(trigger);
    }
  };

  private isRtl(): boolean {
    return getComputedStyle(this).direction === 'rtl';
  }

  /** A top item was clicked: it opens its panel on the first item, or closes it when it is the open one. */
  private onTriggerClick(key: string): void {
    if (this.isTriggerDisabled(key)) {
      return;
    }
    if (this.activeKey === key) {
      this.closeAll(false);
      this.focusTrigger(key);
      return;
    }
    this.openKey(key, 'first');
  }

  /** The pointer over another top item switches the panel when one is already open. */
  private onTriggerPointerenter(event: PointerEvent, key: string): void {
    if (event.pointerType === 'touch' || this.activeKey === '' || this.activeKey === key || this.isTriggerDisabled(key)) {
      return;
    }
    this.focusTrigger(key);
    this.openKey(key, null);
  }

  private onTriggerKeydown(event: KeyboardEvent, key: string): void {
    if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const keys = this.triggerKeys();
    const index = keys.indexOf(key);
    const forward = this.isRtl() ? 'ArrowLeft' : 'ArrowRight';
    const backward = this.isRtl() ? 'ArrowRight' : 'ArrowLeft';
    let handled = true;
    if (event.key === forward || event.key === backward) {
      const delta = event.key === forward ? 1 : -1;
      this.moveTo(keys[(index + delta + keys.length) % keys.length] as string);
    } else if (event.key === 'Home') {
      this.moveTo(keys[0] as string);
    } else if (event.key === 'End') {
      this.moveTo(keys.at(-1) as string);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const where = event.key === 'ArrowDown' ? 'first' : 'last';
      if (this.isTriggerDisabled(key)) {
        /* A disabled top item opens nothing. */
      } else if (this.activeKey === key) {
        this.focusItem(0, where);
      } else {
        this.openKey(key, where);
      }
    } else {
      handled = false;
    }
    if (handled) {
      event.preventDefault();
    }
  }

  /**
   * The focus goes to a top item. With a panel open, that panel closes and the new item opens its own,
   * and the focus stays on the top item, as the APG recommends.
   */
  private moveTo(key: string): void {
    this.focusTrigger(key);
    if (this.activeKey !== '' && key !== this.activeKey) {
      if (this.isTriggerDisabled(key)) {
        this.closeAll(false);
      } else {
        this.openKey(key, null);
      }
    }
  }

  /** From a panel, the arrows go to the next or previous menu of the bar. */
  private switchBy(delta: 1 | -1): void {
    const keys = this.triggerKeys();
    const index = keys.indexOf(this.activeKey);
    if (index < 0 || keys.length < 2) {
      return;
    }
    this.moveTo(keys[(index + delta + keys.length) % keys.length] as string);
  }

  /* ----- opening and closing -------------------------------------------------- */

  private openKey(key: string, focus: 'first' | 'last' | null): void {
    this.stopKey = key;
    this.pendingFocus = focus;
    this.pendingSubFocus = null;
    this.clearTyped();
    this.clearHover();
    this.openSubmenu = '';
    if (key === MORE_KEY) {
      this.openMenu = '';
      this.moreOpen = true;
    } else {
      this.moreOpen = false;
      this.openMenu = key;
    }
    /* Already open on the same key: it takes the focus again. */
    this.requestUpdate();
  }

  /** Closes every panel; with `returnFocus`, the focus goes back to the top item. */
  private closeAll(returnFocus: boolean): void {
    const key = this.activeKey === '' ? this.contentKey : this.activeKey;
    this.pendingFocus = null;
    this.pendingSubFocus = null;
    this.clearTyped();
    this.clearHover();
    this.openSubmenu = '';
    this.openMenu = '';
    this.moreOpen = false;
    if (returnFocus && key !== '') {
      this.focusTrigger(key);
    }
  }

  private panel(level: Level): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>(`.panel[data-level="${level}"]`) ?? null;
  }

  private itemElements(level: Level): HTMLElement[] {
    return [...(this.panel(level)?.querySelectorAll<HTMLElement>('.item') ?? [])];
  }

  private focusItem(level: Level, which: 'first' | 'last' | HTMLElement | null): void {
    const elements = this.itemElements(level);
    const target = which === 'first' ? elements[0] : which === 'last' ? elements.at(-1) : which;
    target?.focus({ preventScroll: true });
    if (target) {
      this.reveal(level, target);
    }
  }

  /** The item comes into the view of its panel, without scrolling the page. */
  private reveal(level: Level, element: HTMLElement): void {
    const scroller = this.panel(level);
    if (scroller === null) {
      return;
    }
    const box = scroller.getBoundingClientRect();
    const item = element.getBoundingClientRect();
    if (item.top < box.top) {
      scroller.scrollTop -= box.top - item.top;
    } else if (item.bottom > box.bottom) {
      scroller.scrollTop += item.bottom - box.bottom;
    }
  }

  /** Esc: the open submenu first, then the panel, which gives the focus back to its top item. */
  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    /* During the exit the panel is already closed: a second Esc reaches the page. */
    if ((event.key !== 'Escape' && event.key !== 'Esc') || this.activeKey === '') {
      return;
    }
    /* Esc closes the menu only, not a dialog around it (P77 item 4). */
    event.stopPropagation();
    event.preventDefault();
    if (this.openSubmenu !== '') {
      this.closeSubmenu(true);
      return;
    }
    this.closeAll(true);
  };

  /** A press outside the bar closes the panels, without moving the focus. */
  private readonly onDocumentPointerdown = (event: PointerEvent): void => {
    if (!event.composedPath().includes(this)) {
      this.closeAll(false);
    }
  };

  /** The focus left the bar and its panels (Tab, a click elsewhere, code): everything closes. */
  private onFocusout(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && this.renderRoot.contains(next)) {
      return;
    }
    if (this.activeKey !== '') {
      this.closeAll(false);
    }
  }

  /* ----- keyboard and pointer in a panel ---------------------------------------- */

  private clearTyped(): void {
    if (this.typedTimer !== undefined) {
      clearTimeout(this.typedTimer);
      this.typedTimer = undefined;
    }
    this.typed = '';
  }

  /** The typed characters, kept together for a moment, find the next item that starts with them. */
  private typeahead(level: Level, character: string, from: number): HTMLElement | null {
    if (this.typedTimer !== undefined) {
      clearTimeout(this.typedTimer);
    }
    this.typed += character.toLocaleLowerCase();
    this.typedTimer = window.setTimeout(() => {
      this.typed = '';
      this.typedTimer = undefined;
    }, TYPEAHEAD_MS);
    const elements = this.itemElements(level);
    const repeated = [...this.typed].every((typed) => typed === this.typed[0]);
    const search = repeated ? (this.typed[0] ?? '') : this.typed;
    const first = from + (repeated || this.typed.length === 1 ? 1 : 0);
    const ordered = [...elements.slice(first), ...elements.slice(0, first)];
    return ordered.find((element) => (element.querySelector('.text')?.textContent ?? '').trim().toLocaleLowerCase().startsWith(search)) ?? null;
  }

  private levelOf(event: Event): Level {
    const panel = (event.currentTarget as HTMLElement | null)?.closest<HTMLElement>('.panel');
    return panel?.dataset.level === '1' ? 1 : 0;
  }

  private onPanelKeydown(event: KeyboardEvent): void {
    if (event.isComposing) {
      return;
    }
    const level = this.levelOf(event);
    const elements = this.itemElements(level);
    const current = elements.indexOf(this.shadowRoot?.activeElement as HTMLElement);
    const { key, altKey, ctrlKey, metaKey } = event;
    const opening = this.isRtl() ? 'ArrowLeft' : 'ArrowRight';
    const closing = this.isRtl() ? 'ArrowRight' : 'ArrowLeft';
    let handled = true;
    if (key.length !== 1) {
      this.clearTyped();
    }
    if (key === 'ArrowDown') {
      this.focusItem(level, elements[(current + 1) % elements.length] ?? null);
    } else if (key === 'ArrowUp') {
      this.focusItem(level, elements[(current - 1 + elements.length) % elements.length] ?? null);
    } else if (key === 'Home') {
      this.focusItem(level, 'first');
    } else if (key === 'End') {
      this.focusItem(level, 'last');
    } else if (key === opening) {
      const row = this.rowOf(level, elements[current] ?? null);
      if (level === 0 && row?.sub != null && row.entry.disabled !== true) {
        this.showSubmenu(row, true);
      } else {
        this.switchBy(1);
      }
    } else if (key === closing) {
      if (level === 1) {
        this.closeSubmenu(true);
      } else {
        this.switchBy(-1);
      }
    } else if (key === 'Enter' || key === ' ') {
      /* Space always activates, also right after a typed search. */
      this.clearTyped();
      const element = elements[current];
      if (element) {
        this.activate(level, element, key === 'Enter' ? 'enter' : 'space');
      }
    } else if (key === 'Tab') {
      /*
       * Tab closes, and the focus moves on from the top item, wherever the panel sits in the DOM: the
       * focus goes back to the top item before the default action runs.
       */
      this.closeAll(true);
      handled = false;
    } else if (key.length === 1 && !altKey && !ctrlKey && !metaKey) {
      this.focusItem(level, this.typeahead(level, key, current) ?? elements[current] ?? null);
    } else {
      handled = false;
    }
    if (handled) {
      event.preventDefault();
    }
  }

  /** The row of a drawn item: in the main list, or in the submenu that is drawn. */
  private rowOf(level: Level, element: HTMLElement | null): Row | null {
    if (element === null) {
      return null;
    }
    const index = Number(element.dataset.index);
    const groups = level === 0 ? this.contentGroups : (this.subRow?.sub ?? []);
    for (const group of groups) {
      const row = group.rows.find((candidate) => candidate.index === index);
      if (row) {
        return row;
      }
    }
    return null;
  }

  /** A press on a panel outside an item keeps the focus where it is, so the panel stays open. */
  private onPanelMousedown(event: MouseEvent): void {
    const onItem = event.composedPath().some((target) => target instanceof HTMLElement && target.classList.contains('item'));
    if (!onItem) {
      event.preventDefault();
    }
  }

  private onPanelClick(event: MouseEvent): void {
    const level = this.levelOf(event);
    for (const target of event.composedPath()) {
      if (target instanceof HTMLElement && target.classList.contains('item')) {
        this.activate(level, target, 'click');
        return;
      }
      if (target === this.panel(level)) {
        return;
      }
    }
  }

  /**
   * The pointer over an item moves the keyboard focus to it (DSA-45 D-6): the highlighted item is the
   * focused item, so the arrows go on from where the pointer is. A disabled item is skipped, and touch
   * never gets here as a hover.
   */
  private onPanelPointermove(event: PointerEvent): void {
    if (event.pointerType === 'touch') {
      return;
    }
    const item = event.composedPath().find((target): target is HTMLElement => target instanceof HTMLElement && target.classList.contains('item'));
    if (item === undefined || item.hasAttribute('aria-disabled') || this.shadowRoot?.activeElement === item) {
      return;
    }
    item.focus({ preventScroll: true });
  }

  /** The wait before a submenu opens or closes by pointer: the `motion/hover-delay` token. */
  private hoverDelay(): number {
    const delay = milliseconds(getComputedStyle(this).getPropertyValue('--nph-motion-hover-delay'));
    if (Number.isNaN(delay)) {
      if (!this.warnedDelay) {
        this.warnedDelay = true;
        devError('motion/hover-delay is not defined (load tokens.css); the submenu opens and closes on hover with no wait.');
      }
      return 0;
    }
    return delay;
  }

  private clearHover(): void {
    if (this.hoverTimer !== undefined) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = undefined;
    }
  }

  /** The mouse over an item opens its submenu after the wait, or closes the open one when it has none. */
  private onPanelPointerover(event: PointerEvent): void {
    if (event.pointerType === 'touch') {
      return;
    }
    const level = this.levelOf(event);
    const item = event.composedPath().find((target): target is HTMLElement => target instanceof HTMLElement && target.classList.contains('item'));
    this.clearHover();
    if (level === 1) {
      return;
    }
    const row = this.rowOf(0, item ?? null);
    if (row === null) {
      return;
    }
    if (row.sub !== null && row.entry.disabled !== true) {
      if (this.openSubmenu === row.entry.value) {
        return;
      }
      this.hoverTimer = window.setTimeout(() => {
        this.hoverTimer = undefined;
        this.showSubmenu(row, false);
      }, this.hoverDelay());
    } else if (this.openSubmenu !== '') {
      this.hoverTimer = window.setTimeout(() => {
        this.hoverTimer = undefined;
        this.closeSubmenu(false);
      }, this.hoverDelay());
    }
  }

  /** The pointer inside the submenu keeps it open. */
  private onSubmenuPointerenter(): void {
    this.clearHover();
  }

  private showSubmenu(row: Row, focus: boolean): void {
    if (this.activeKey === '' || row.sub === null) {
      return;
    }
    this.clearHover();
    this.subRow = row;
    this.pendingSubFocus = focus ? 'first' : null;
    if (this.openSubmenu === row.entry.value) {
      this.requestUpdate();
      if (focus) {
        this.focusItem(1, 'first');
        this.pendingSubFocus = null;
      }
      return;
    }
    this.openSubmenu = row.entry.value;
  }

  /** Closes the submenu; with `returnFocus`, the focus goes back to the item that opened it. */
  private closeSubmenu(returnFocus: boolean): void {
    const parent = this.subRow;
    this.clearHover();
    this.pendingSubFocus = null;
    /* The focus never stays in a submenu that leaves: it would close the whole bar. */
    const inside = this.panel(1)?.contains(this.shadowRoot?.activeElement ?? null) ?? false;
    this.openSubmenu = '';
    if ((returnFocus || inside) && parent !== null) {
      const element = this.panel(0)?.querySelector<HTMLElement>(`.item[data-index="${parent.index}"]`);
      if (element) {
        this.focusItem(0, element);
      }
    }
  }

  /** Rewrites the menu with the new state of its items; no object of the consumer changes. */
  private rewrite(menu: NphMenubarMenu, change: (item: NphMenubarItem) => NphMenubarItem): void {
    this.menus = this.menus.map((candidate) => (candidate === menu ? { ...candidate, items: mapItems(candidate.items, change) } : candidate));
  }

  /** The top item the command being activated belongs to. */
  private menuOfCommand(level: Level): MenuModel | undefined {
    if (this.activeKey === MORE_KEY) {
      const owner = level === 1 ? this.subRow?.entry.value : undefined;
      return this.models.find((model) => model.value === owner);
    }
    return this.models.find((model) => model.value === this.activeKey);
  }

  /**
   * The person activated an item: a submenu opens; otherwise the state moves, the event fires, and the
   * panels close or stay. Enter always closes; Space checks a choice without closing and acts as Enter on
   * a common item; a click closes except on a multiple choice (the rule of P92 and P113).
   */
  private activate(level: Level, element: HTMLElement, via: 'enter' | 'space' | 'click'): void {
    const row = this.rowOf(level, element);
    if (row === null || this.activeKey === '') {
      return;
    }
    const { entry } = row;
    if (entry.disabled) {
      return;
    }
    if (row.sub !== null) {
      this.showSubmenu(row, via !== 'click' || element.matches(':focus-visible'));
      return;
    }
    const owner = this.menuOfCommand(level);
    if (owner === undefined) {
      return;
    }
    const selection = entry.selection ?? 'none';
    let checked: boolean | null = null;
    if (selection === 'multiple') {
      const next = !entry.checked;
      checked = next;
      this.rewrite(owner.source, (item) => (item.value === entry.value ? { ...item, checked: next } : item));
    } else if (selection === 'single') {
      checked = true;
      const groups = level === 0 ? this.contentGroups : (this.subRow?.sub ?? []);
      const peers = new Set((groups[row.group]?.rows ?? []).filter((peer) => (peer.entry.selection ?? 'none') === 'single').map((peer) => peer.entry.value));
      this.rewrite(owner.source, (item) => (peers.has(item.value) ? { ...item, checked: item.value === entry.value } : item));
    }
    this.dispatchEvent(
      new CustomEvent<NphMenubarItemSelectDetail>('nph-item-select', {
        bubbles: true,
        detail: { value: entry.value, checked, menu: owner.value },
      }),
    );
    const stays = via === 'enter' ? false : via === 'space' ? selection !== 'none' : selection === 'multiple';
    if (!stays) {
      this.closeAll(true);
    }
  }

  /* ----- validity ------------------------------------------------------------- */

  private report(causes: string[]): void {
    const key = causes.join('\n');
    if (key === this.reported) {
      return;
    }
    this.reported = key;
    for (const cause of causes) {
      devError(cause);
    }
  }

  /** Whether an item entry can be drawn, and its submenu groups; each reason it cannot is reported once. */
  private acceptItem(entry: NphMenubarItem, level: Level, causes: string[], seen: Set<string>): Group[] | null | false {
    const where = `item ${JSON.stringify(entry.value ?? null)}`;
    let ok = true;
    if (trimmed(entry.value) === '') {
      causes.push('an item needs a value: it is what nph-item-select reports.');
      ok = false;
    } else if (seen.has(entry.value)) {
      causes.push(`${where}: another item of the menu already has this value; the second one is left out.`);
      ok = false;
    } else {
      seen.add(entry.value);
    }
    if (trimmed(entry.text) === '') {
      causes.push(`${where} needs text: it is the accessible name of the item.`);
      ok = false;
    }
    if (entry.severity !== undefined && !oneOf(NPH_MENUBAR_SEVERITIES, entry.severity)) {
      causes.push(`${where}: severity "${String(entry.severity)}" does not exist. Use ${NPH_MENUBAR_SEVERITIES.join(', ')}.`);
      ok = false;
    }
    if (entry.selection !== undefined && !oneOf(NPH_MENUBAR_SELECTIONS, entry.selection)) {
      causes.push(`${where}: selection "${String(entry.selection)}" does not exist. Use ${NPH_MENUBAR_SELECTIONS.join(', ')}.`);
      ok = false;
    }
    let sub: Group[] | null = null;
    if (entry.submenu !== undefined) {
      const selection = entry.selection ?? 'none';
      if (level === 1) {
        causes.push(`${where}: a submenu has one level only; an item of a submenu cannot have a submenu.`);
        ok = false;
      } else if (!Array.isArray(entry.submenu)) {
        causes.push(`${where}: submenu must be a list of entries.`);
        ok = false;
      } else {
        if (selection !== 'none') {
          causes.push(`${where}: a submenu item is not a choice.`);
          ok = false;
        }
        if (trimmed(entry.shortcut) !== '') {
          causes.push(`${where}: a submenu item carries no shortcut: the arrow takes the end of the item.`);
          ok = false;
        }
        sub = groupsOf(entry.submenu, (candidate) => this.acceptItem(candidate, 1, causes, seen));
        if (sub.length === 0) {
          causes.push(`${where}: submenu has no valid item.`);
          ok = false;
        }
      }
    }
    return ok ? sub : false;
  }

  /** The valid top items, with their drawn groups; every reason a menu or an item is left out is reported. */
  private buildModels(causes: string[]): MenuModel[] {
    const models: MenuModel[] = [];
    const seen = new Set<string>();
    const list = Array.isArray(this.menus) ? this.menus : [];
    for (const menu of list) {
      if (menu === null || typeof menu !== 'object') {
        continue;
      }
      const value = trimmed(menu.value);
      const where = `menu ${JSON.stringify(menu.value ?? null)}`;
      if (value === '') {
        causes.push('a menu needs a value: it is what open-menu and nph-item-select report.');
        continue;
      }
      if (seen.has(value)) {
        causes.push(`${where}: another menu already has this value; the second one is left out.`);
        continue;
      }
      if (trimmed(menu.label) === '') {
        causes.push(`${where} needs a label: it is the text of the top item.`);
        continue;
      }
      if (!Array.isArray(menu.items)) {
        causes.push(`${where}: items must be a list of entries.`);
        continue;
      }
      seen.add(value);
      const itemValues = new Set<string>();
      const groups = groupsOf(menu.items, (entry) => this.acceptItem(entry, 0, causes, itemValues));
      if (groups.length === 0) {
        causes.push(`${where}: items has no valid item, so the panel would be empty.`);
        seen.delete(value);
        continue;
      }
      models.push({ value, label: trimmed(menu.label), disabled: menu.disabled === true, groups, source: menu });
    }
    return models;
  }

  /** The panel of the overflow item or of the narrow button: the menus as items with a submenu, in one level. */
  private buildMoreGroups(models: readonly MenuModel[]): Group[] {
    const entries: NphMenubarEntry[] = models.map((model) => ({
      value: model.value,
      text: model.label,
      disabled: model.disabled,
      submenu: flattenSubmenus(model.source.items),
    }));
    return groupsOf(entries, (entry) => {
      const sub = groupsOf(entry.submenu ?? [], (child) => this.acceptItem(child, 1, [], new Set<string>()));
      return sub.length === 0 ? false : sub;
    });
  }

  protected override willUpdate(changed: PropertyValues): void {
    const causes: string[] = [];
    const warnings: string[] = [];
    const entryCauses: string[] = [];
    this.models = this.buildModels(entryCauses);
    if (this.models.length === 0) {
      causes.push('menus has no valid menu: there is nothing to open.');
    }
    if (this.narrow && trimmed(this.menuLabel) === '') {
      causes.push('menu-label is empty: it is the accessible name of the button of the narrow bar, whose icon has no text.');
    }
    if (trimmed(this.label) === '' && (this.getAttribute('aria-label') ?? '').trim() === '') {
      warnings.push('the bar has no accessible name: set label or aria-label (the menubar role asks for one).');
    }
    this.valid = causes.length === 0;
    /* The top items that fit; without the text of the overflow item, nothing overflows. */
    const fit = this.narrow || trimmed(this.moreLabel) === '' ? (this.narrow ? 0 : this.models.length) : Math.min(this.visibleCount, this.models.length);
    this.shownModels = this.models.slice(0, fit);
    this.overflowModels = this.models.slice(fit);
    this.moreGroups = this.narrow || this.overflowModels.length > 0 ? this.buildMoreGroups(this.narrow ? this.models : this.overflowModels) : [];
    this.report([...causes, ...warnings, ...entryCauses]);
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);

    /* Which panel is open: the overflow panel, or the menu that `open-menu` names and that is drawn as a top item. */
    let key = '';
    const wanted = trimmed(this.openMenu);
    if (this.valid && this.moreOpen && (this.narrow || this.overflowing)) {
      key = MORE_KEY;
    } else if (this.valid && wanted !== '' && !this.narrow) {
      const model = this.models.find((candidate) => candidate.value === wanted);
      if (model === undefined) {
        devError(`open-menu "${wanted}" matches no menu.`);
        this.openMenu = '';
      } else if (model.disabled) {
        this.openMenu = '';
      } else if (this.shownModels.includes(model)) {
        key = model.value;
      } else {
        this.openMenu = '';
      }
    }
    if (this.moreOpen && key !== MORE_KEY) {
      this.moreOpen = false;
    }
    this.activeKey = key;
    if (key !== '') {
      this.contentKey = key;
    }
    const contentModel = this.contentKey === MORE_KEY ? undefined : this.models.find((candidate) => candidate.value === this.contentKey);
    this.contentGroups = this.contentKey === MORE_KEY ? this.moreGroups : (contentModel?.groups ?? []);
    if (this.contentKey !== '' && this.contentGroups.length === 0) {
      this.contentKey = '';
    }

    /* The submenu that is drawn follows `open-submenu`, which names an item of the open panel. */
    const wantedSub = trimmed(this.openSubmenu);
    if (wantedSub !== '') {
      const rows = this.contentGroups.flatMap((group) => group.rows);
      const row = rows.find((candidate) => candidate.sub !== null && candidate.entry.value === wantedSub && candidate.entry.disabled !== true);
      if (row !== undefined) {
        this.subRow = row;
      } else if (rows.some((candidate) => candidate.sub !== null && candidate.entry.value === wantedSub)) {
        /* The item that holds the submenu was disabled while it was open: the submenu closes. */
        this.openSubmenu = '';
      } else if (this.valid && key !== '') {
        devError(`open-submenu "${wantedSub}" matches no enabled item with a submenu.`);
        this.openSubmenu = '';
      }
    } else if (this.subRow !== null) {
      /* Keep the content for the exit; refresh it from the new list when it is still there. */
      const kept = this.subRow;
      this.subRow =
        this.contentGroups.flatMap((group) => group.rows).find((candidate) => candidate.entry.value === kept.entry.value && candidate.sub !== null) ?? null;
    }
    /* A closed bar has no submenu open. */
    if (key === '' && this.openSubmenu !== '') {
      this.openSubmenu = '';
    }
    if (changed.has('menus') || changed.has('moreLabel') || changed.has('narrow')) {
      /* A new list may have other widths. */
      this.scheduleMeasure();
    }
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('menus') || changed.has('moreLabel') || changed.has('narrow') || changed.has('visibleCount')) {
      this.observeLayout();
      if (!changed.has('visibleCount') || changed.size > 1) {
        this.scheduleMeasure();
      }
    }
    const main = this.panel(0);
    if (main === null) {
      /* The input became invalid while open: the panels are gone, and so are their listeners. */
      if (this.shown[0] || this.shown[1]) this.hideNow();
      return;
    }
    if (this.activeKey !== '' && this.valid) {
      this.show(0, main);
      if (this.pendingFocus !== null) {
        const focus = this.pendingFocus;
        this.pendingFocus = null;
        this.focusItem(0, focus);
      }
    } else {
      this.hide(0, main);
    }
    const sub = this.panel(1);
    if (sub !== null) {
      if (this.activeKey !== '' && this.valid && this.openSubmenu !== '' && this.subRow !== null) {
        this.show(1, sub);
        if (this.pendingSubFocus !== null) {
          this.pendingSubFocus = null;
          this.focusItem(1, 'first');
        }
      } else {
        this.hide(1, sub);
      }
    }
  }

  /** The probe row changes size with the labels and the fonts: the bar measures again. */
  private observeLayout(): void {
    const probe = this.renderRoot.querySelector<HTMLElement>('.probe');
    if (probe !== null && this.layoutObserver !== undefined) {
      this.layoutObserver.observe(probe);
    }
  }

  /* ----- the layer ------------------------------------------------------------ */

  private show(level: Level, panel: HTMLElement): void {
    const timer = this.closeTimers[level];
    if (timer !== undefined) {
      clearTimeout(timer);
      delete this.closeTimers[level];
    }
    if (!this.shown[level]) {
      this.shown[level] = true;
      panel.inert = false;
      try {
        panel.showPopover();
      } catch {
        /* Not connected, or already showing: nothing to do. */
      }
      if (level === 0) {
        document.addEventListener('keydown', this.onDocumentKeydown, true);
        document.addEventListener('pointerdown', this.onDocumentPointerdown, true);
        window.addEventListener('scroll', this.onViewportChange, true);
        window.addEventListener('resize', this.onViewportChange);
        this.resizeObserver = new ResizeObserver(() => this.onViewportChange());
        /* The panel too: inner pieces that render after the first measure make it grow. */
        this.resizeObserver.observe(panel);
        this.updateScrollTargets();
      } else {
        this.resizeObserver?.observe(panel);
      }
      this.place(level, panel);
      /* The first style is the closed one; the next one starts the enter transition. */
      void panel.offsetWidth;
    } else {
      this.place(level, panel);
      /* New content may still be rendering its inner pieces: measure again on the next frame. */
      this.onViewportChange();
    }
    panel.setAttribute('data-open', '');
  }

  /** Starts the exit; the panel leaves the top layer when the exit ends. */
  private hide(level: Level, panel: HTMLElement): void {
    panel.removeAttribute('data-open');
    if (this.closeTimers[level] !== undefined || !this.shown[level]) {
      return;
    }
    const duration = parseFloat(getComputedStyle(panel).transitionDuration) * 1000;
    if (!(duration > 0)) {
      this.hideLevel(level);
      return;
    }
    this.closeTimers[level] = window.setTimeout(() => {
      delete this.closeTimers[level];
      this.hideLevel(level);
    }, duration);
  }

  private hideLevel(level: Level): void {
    const timer = this.closeTimers[level];
    if (timer !== undefined) {
      clearTimeout(timer);
      delete this.closeTimers[level];
    }
    if (level === 0) {
      this.hideNow();
      return;
    }
    this.shown[1] = false;
    const panel = this.panel(1);
    if (panel) {
      this.resizeObserver?.unobserve(panel);
      panel.removeAttribute('data-open');
      try {
        panel.hidePopover();
      } catch {
        /* Already hidden. */
      }
    }
  }

  private hideNow(): void {
    for (const level of [0, 1] as const) {
      const timer = this.closeTimers[level];
      if (timer !== undefined) {
        clearTimeout(timer);
        delete this.closeTimers[level];
      }
    }
    document.removeEventListener('keydown', this.onDocumentKeydown, true);
    document.removeEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.clearScrollTargets();
    this.clearHover();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.shown = { 0: false, 1: false };
    for (const level of [0, 1] as const) {
      const panel = this.panel(level);
      if (panel) {
        panel.removeAttribute('data-open');
        try {
          panel.hidePopover();
        } catch {
          /* Already hidden. */
        }
      }
    }
  }

  /**
   * Every ancestor of the bar in the flat tree, as in `nph-dropdown-menu`: the scroll of an element
   * inside a shadow root does not reach `window`, so each ancestor and each root listens.
   */
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
    for (const target of this.scrollTargets) {
      target.removeEventListener('scroll', this.onViewportChange, true);
    }
    this.scrollTargets.length = 0;
  }

  private readonly onViewportChange = (event?: unknown): void => {
    const scrolled = event instanceof Event ? event : undefined;
    /* A panel scrolling its own items does not move it. */
    if (scrolled?.type === 'scroll' && scrolled.target instanceof Element && scrolled.target.classList.contains('panel')) return;
    if (this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      for (const level of [0, 1] as const) {
        const panel = this.panel(level);
        if (panel && this.shown[level]) this.place(level, panel);
      }
    });
  };

  /** The distance to the item the panel opens from, carried by the margin of the side that faces it, in pixels. */
  private gap(panel: HTMLElement, side: 'top' | 'bottom' | 'left' | 'right'): number {
    panel.setAttribute('data-side', side);
    const style = getComputedStyle(panel);
    const margin = side === 'bottom' ? style.marginTop : side === 'top' ? style.marginBottom : side === 'right' ? style.marginLeft : style.marginRight;
    return parseFloat(margin) || 0;
  }

  /**
   * The first panel opens below its top item, aligned to the start edge; it turns up when it does not fit
   * below and fits above, and when it fits on neither side it takes the side with more room and scrolls.
   * The submenu opens beside the panel, on the line of its item, and on the other side only when there is
   * no room. No panel keeps closer than `COLLISION_PADDING` to the window edge.
   */
  private place(level: Level, panel: HTMLElement): void {
    const trigger = this.triggerElement(this.contentKey);
    if (trigger === null) return;
    const anchor = trigger.getBoundingClientRect();
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    /* The bar is scrolled out of the window: the panels go with it, not stuck to the edge over the content below. */
    const visible = anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width;
    panel.style.visibility = visible ? '' : 'hidden';
    if (!visible) {
      return;
    }
    const pad = COLLISION_PADDING;
    /* Measuring drops the scroll limits; the scroll position comes back after it. */
    const scrollTop = panel.scrollTop;
    panel.style.maxHeight = '';
    panel.style.overflowY = '';
    /* `layout/input-width` is the preferred width; a narrower window, or a larger font, holds it. */
    panel.style.maxWidth = `${Math.max(view.width - 2 * pad, 0)}px`;
    panel.style.top = '0px';
    panel.style.left = '0px';
    const { width, height } = panel.getBoundingClientRect();
    const rtl = this.isRtl();
    let x: number;
    let y: number;
    let shownHeight = height;
    const limit = (room: number): void => {
      if (height > room) {
        /* Only a panel taller than the room scrolls: a scrolling box clips the focus halo. */
        panel.style.maxHeight = `${Math.max(room, 0)}px`;
        panel.style.overflowY = 'auto';
        panel.scrollTop = scrollTop;
        shownHeight = panel.getBoundingClientRect().height;
      }
    };
    if (level === 0) {
      const roomBelow = view.height - anchor.bottom - this.gap(panel, 'bottom') - pad;
      const roomAbove = anchor.top - this.gap(panel, 'top') - pad;
      const side = roomBelow >= height || (roomAbove < height && roomBelow >= roomAbove) ? 'bottom' : 'top';
      const gap = this.gap(panel, side);
      limit(side === 'bottom' ? roomBelow : roomAbove);
      x = rtl ? anchor.right - width : anchor.left;
      y = side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - shownHeight;
    } else {
      const parentPanel = this.panel(0);
      const parentItem = this.subRow === null ? null : parentPanel?.querySelector<HTMLElement>(`.item[data-index="${this.subRow.index}"]`);
      if (parentPanel === null || parentItem == null) {
        return;
      }
      limit(view.height - 2 * pad);
      const side = parentPanel.getBoundingClientRect();
      const item = parentItem.getBoundingClientRect();
      const style = getComputedStyle(panel);
      /* The first item sits on the line of the item that opened it: past the border and the padding. */
      const inset = parseFloat(style.borderTopWidth) + parseFloat(style.paddingTop);
      y = item.top - inset;
      const toEnd = rtl ? 'left' : 'right';
      const gapEnd = this.gap(panel, toEnd);
      const edge = toEnd === 'right' ? side.right + gapEnd : side.left - gapEnd - width;
      const fitsEnd = toEnd === 'right' ? edge + width <= view.width - pad : edge >= pad;
      if (fitsEnd) {
        x = edge;
      } else {
        const other = toEnd === 'right' ? 'left' : 'right';
        const gapOther = this.gap(panel, other);
        x = other === 'left' ? side.left - gapOther - width : side.right + gapOther;
      }
    }
    x = Math.min(Math.max(x, pad), Math.max(view.width - width - pad, pad));
    y = Math.min(Math.max(y, pad), Math.max(view.height - shownHeight - pad, pad));
    const style = getComputedStyle(panel);
    panel.style.left = `${x - parseFloat(style.marginLeft)}px`;
    panel.style.top = `${y - parseFloat(style.marginTop)}px`;
  }

  /* ----- drawing -------------------------------------------------------------- */

  /** The light icon at rest and its solid twin, which the CSS shows on highlight. */
  private iconPair(name: string, size: 'sm' | 'md', className: string): TemplateResult {
    return html`<nph-icon class="${className} glyph-rest" name=${name} size=${size}></nph-icon
      ><nph-icon class="${className} glyph-hover" name=${name} variant="solid" size=${size}></nph-icon>`;
  }

  private itemId(level: Level, index: number): string {
    return `${this.uid}-${level === 0 ? 'item' : 'sub'}-${index}`;
  }

  private triggerId(key: string): string {
    return key === MORE_KEY ? `${this.uid}-more` : `${this.uid}-top-${this.models.findIndex((model) => model.value === key)}`;
  }

  private renderItem(row: Row, level: Level): TemplateResult {
    const { entry, index } = row;
    const id = this.itemId(level, index);
    const text = trimmed(entry.text);
    const shortcut = trimmed(entry.shortcut);
    const icon = trimmed(entry.icon);
    const selection = entry.selection ?? 'none';
    const checked = entry.checked === true;
    const disabled = entry.disabled === true;
    const hasSub = row.sub !== null;
    const expanded = hasSub && this.openSubmenu === entry.value && this.activeKey !== '';
    const role = selection === 'single' ? 'menuitemradio' : selection === 'multiple' ? 'menuitemcheckbox' : 'menuitem';
    const keys = shortcut === '' || hasSub ? '' : keyShortcutsOf(shortcut);
    const end = html`${shortcut === '' || hasSub ? nothing : html`<span class="shortcut">${shortcut}</span>`}${hasSub
      ? this.iconPair('chevron-right', 'sm', 'arrow')
      : nothing}${selection === 'single' && checked ? html`<nph-icon class="check" name="check" variant="solid" size="sm"></nph-icon>` : nothing}`;

    return html`<div
      class="item"
      id=${id}
      role=${role}
      tabindex="-1"
      data-index=${index}
      data-severity=${entry.severity ?? 'default'}
      data-selection=${selection}
      ?data-checked=${checked}
      ?data-disabled=${disabled}
      aria-checked=${role === 'menuitem' ? nothing : String(checked)}
      aria-disabled=${disabled ? 'true' : nothing}
      aria-haspopup=${hasSub ? 'menu' : nothing}
      aria-expanded=${hasSub ? String(expanded) : nothing}
      aria-controls=${expanded ? `${this.uid}-submenu` : nothing}
      aria-keyshortcuts=${keys === '' ? nothing : keys}
      aria-labelledby="${id}-text"
    >
      ${selection === 'multiple' ? html`<nph-checkbox class="checkbox" inert label=${text} .checked=${checked}></nph-checkbox>` : nothing}
      ${icon !== '' ? this.iconPair(icon, 'md', 'icon') : nothing}
      <span class="texts"><span class="text" id="${id}-text">${text}</span></span>
      <span class="end">${end}</span>
    </div>`;
  }

  private renderGroup(group: Group, position: number, level: Level): TemplateResult {
    const items = group.rows.map((row) => this.renderItem(row, level));
    const separator = group.separated ? html`<nph-separator class="separator"></nph-separator>` : nothing;
    /* A group with no label is still a group: the separator is hidden from the accessibility tree. */
    if (group.label === '') {
      return html`${separator}<div class="group" role="group">${items}</div>`;
    }
    const labelId = `${this.uid}-group-${level}-${position}`;
    return html`${separator}<div class="group" role="group" aria-labelledby=${labelId}>
        <div class="group-label" id=${labelId}>${group.label}</div>
        ${items}
      </div>`;
  }

  private renderPanel(level: Level, groups: Group[], contentKey: string): TemplateResult {
    const parent = this.subRow;
    return html`<div
      class="panel"
      data-level=${level}
      popover="manual"
      @keydown=${this.onPanelKeydown}
      @click=${this.onPanelClick}
      @mousedown=${this.onPanelMousedown}
      @pointermove=${this.onPanelPointermove}
      @pointerover=${this.onPanelPointerover}
      @pointerenter=${level === 1 ? this.onSubmenuPointerenter : nothing}
    >
      ${keyed(
        contentKey,
        html`<div
          class="menu"
          role="menu"
          id=${level === 1 ? `${this.uid}-submenu` : `${this.uid}-menu`}
          aria-label=${level === 0 && this.narrow ? trimmed(this.menuLabel) : nothing}
          aria-labelledby=${this.narrow && level === 0 ? nothing : level === 1 ? (parent === null ? nothing : `${this.itemId(0, parent.index)}-text`) : this.triggerId(this.contentKey)}
        >
          ${groups.map((group, position) => this.renderGroup(group, position, level))}
        </div>`,
      )}
    </div>`;
  }

  private renderTop(model: MenuModel): TemplateResult {
    const expanded = this.activeKey === model.value;
    return html`<button
      type="button"
      class="top"
      role="menuitem"
      id=${this.triggerId(model.value)}
      data-key=${model.value}
      tabindex=${this.tabStop === model.value ? '0' : '-1'}
      aria-haspopup="menu"
      aria-expanded=${String(expanded)}
      aria-controls=${expanded ? `${this.uid}-menu` : nothing}
      aria-disabled=${model.disabled ? 'true' : nothing}
      @click=${() => this.onTriggerClick(model.value)}
      @keydown=${(event: KeyboardEvent) => this.onTriggerKeydown(event, model.value)}
      @pointerenter=${(event: PointerEvent) => this.onTriggerPointerenter(event, model.value)}
    >
      <span class="top-label">${model.label}</span>
    </button>`;
  }

  private renderMore(): TemplateResult {
    const expanded = this.activeKey === MORE_KEY;
    return html`<button
      type="button"
      class="top"
      role="menuitem"
      id=${this.triggerId(MORE_KEY)}
      data-more
      tabindex=${this.tabStop === MORE_KEY ? '0' : '-1'}
      aria-haspopup="menu"
      aria-expanded=${String(expanded)}
      aria-controls=${expanded ? `${this.uid}-menu` : nothing}
      @click=${() => this.onTriggerClick(MORE_KEY)}
      @keydown=${(event: KeyboardEvent) => this.onTriggerKeydown(event, MORE_KEY)}
      @pointerenter=${(event: PointerEvent) => this.onTriggerPointerenter(event, MORE_KEY)}
    >
      <span class="top-label">${trimmed(this.moreLabel)}</span>
    </button>`;
  }

  private renderNarrow(): TemplateResult {
    const expanded = this.activeKey === MORE_KEY;
    return html`<nph-button
      class="narrow-button"
      id=${this.triggerId(MORE_KEY)}
      data-more
      severity="secondary"
      emphasis="ghost"
      icon-start="bars"
      label=${trimmed(this.menuLabel)}
      aria-haspopup="menu"
      aria-expanded=${String(expanded)}
      @click=${() => this.onTriggerClick(MORE_KEY)}
      @keydown=${(event: KeyboardEvent) => this.onTriggerKeydown(event, MORE_KEY)}
    ></nph-button>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const name = trimmed(this.label) || (this.getAttribute('aria-label') ?? '').trim();
    const sub = this.subRow?.sub ?? null;
    const more = trimmed(this.moreLabel);
    return html`<div class="root" @focusin=${this.onTriggerFocusin} @focusout=${this.onFocusout}>
      ${this.narrow
        ? this.renderNarrow()
        : html`<div class="bar" role="menubar" aria-label=${name === '' ? nothing : name}>
              ${this.shownModels.map((model) => this.renderTop(model))}${this.overflowing ? this.renderMore() : nothing}
            </div>
            <div class="probe" aria-hidden="true" inert>
              ${this.models.map((model) => html`<span class="top probe-item" data-probe>${model.label}</span>`)}
              <span class="top probe-item" data-probe-more>${more}</span>
            </div>`}
      ${this.renderPanel(0, this.contentGroups, this.contentKey)}${sub === null ? nothing : this.renderPanel(1, sub, this.subRow?.entry.value ?? '')}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphMenubar);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-menubar': NphMenubar;
  }
}
