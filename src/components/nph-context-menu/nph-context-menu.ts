/**
 * `nph-context-menu` — the menu of the actions of the object under the pointer, opened at the
 * point of the right click.
 *
 * Contract accepted in Figma (documentation `4838:27591`, set `4819:15828`), recorded as text in
 * the evidence of the `figma-docs-accepted` gate of DSA-69, sheet `fichas/nph-context-menu.md`,
 * `design.md` and decision P113 — nph-context-menu: API and semantics:
 * - ONE tag, a piece of its own. `nph-dropdown-menu` opens from a visible trigger, below it, in a
 *   single level (P92); the context menu opens at a point and unfolds one submenu, so it draws
 *   its own panels with the item, the group label and the separator of that menu: the same
 *   `dropdown/*` tokens, no token of its own;
 * - `for`: the `id` of the object that takes the right click, looked up in the SAME root as the
 *   menu (`getRootNode()`), like `nph-popover` (P111). The menu listens to `contextmenu` there,
 *   to Shift+F10 and the Menu key, and to a touch held for about 700 ms. The object is not a
 *   button, so the menu writes no ARIA on it;
 * - `open`: the state. Reflects. The menu turns it on and off; the consumer may set it, and a
 *   menu opened from code sits at the start corner of the object, follows it on scroll and takes
 *   no focus;
 * - `items`: the entries, in order. An item (`type` absent or `item`) has `value` and `text`,
 *   and optionally `icon`, `severity` (`default` or `destructive`), `selection` (`none`,
 *   `single` or `multiple`), `checked`, `shortcut`, `submenu` (a list of entries, ONE level) and
 *   `disabled`. A `label` entry names the group that follows it; a `separator` entry closes it;
 * - `open-submenu`: the `value` of the item whose submenu is open, empty when closed. Reflects.
 *   The menu writes it; the consumer may set it to show the submenu open;
 * - `size`: `default` or `compact`, one per menu. Reflects, because the internal CSS selects the
 *   rows by it;
 * - `label`: the accessible name of the menu;
 * - the event `nph-item-select` (bubbles), with `detail: { value, checked, origin }`, fired only
 *   when the person activates an item: `checked` is the new state of a single choice or a
 *   multiple choice and `null` on a common item; `origin` is the element under the pointer when
 *   the menu opened, so a table row acts only on itself. The menu then replaces `items` with a
 *   new list that carries the new `checked`; it never changes the objects of the consumer;
 * - invalid input does not render and emits `console.error` only in development, one per cause
 *   (P21 rule): `for` empty or matching no element in the same root, no valid item, a `size`
 *   outside the two, and an invalid entry, which is left out.
 *
 * LAYER — each panel is a `popover="manual"`, so it lives in the top layer: no `z-index` and no
 * clipping by an ancestor. The panel opens with its top start corner at the point and changes
 * side on collision; the submenu opens to the right, on the same line as its item, and to the
 * left only when there is no room.
 *
 * KEYBOARD — the menu pattern of the APG. Opened by keyboard, the first item takes the focus;
 * opened by the mouse, it takes the focus without showing it. The arrows move with wrap, Home
 * and End go to the ends, a typed character goes to the next item that starts with it, Enter and
 * Space activate, the right arrow opens a submenu and the left arrow closes it, Esc closes the
 * submenu and then the menu and gives the focus back to the object, Tab closes and moves on.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-checkbox/nph-checkbox';
import '../nph-icon/nph-icon';
import '../nph-separator/nph-separator';
import menuCss from './nph-context-menu.css?inline';

const TAG = 'nph-context-menu';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The two sizes of the item (the Figma `tamanho`: `padrão` and `compacto`). */
export const NPH_CONTEXT_MENU_SIZES = ['default', 'compact'] as const;
export type NphContextMenuSize = (typeof NPH_CONTEXT_MENU_SIZES)[number];

/** The two types of the item. */
export const NPH_CONTEXT_MENU_SEVERITIES = ['default', 'destructive'] as const;
export type NphContextMenuSeverity = (typeof NPH_CONTEXT_MENU_SEVERITIES)[number];

/** The three choices of the item. */
export const NPH_CONTEXT_MENU_SELECTIONS = ['none', 'single', 'multiple'] as const;
export type NphContextMenuSelection = (typeof NPH_CONTEXT_MENU_SELECTIONS)[number];

/** One action of the menu. */
export interface NphContextMenuItem {
  type?: 'item';
  /** What the event reports. */
  value: string;
  /** The label, already localized by the consuming application. */
  text: string;
  /** A core name of `nph-icon`: the start icon. Absent or empty: no icon. */
  icon?: string;
  severity?: NphContextMenuSeverity;
  selection?: NphContextMenuSelection;
  checked?: boolean;
  /** Plain text at the end, such as `Ctrl+C`. An item with a submenu carries none. */
  shortcut?: string;
  /** The actions that unfold from this item: ONE level, so no entry of the list has a submenu. */
  submenu?: readonly NphContextMenuEntry[];
  disabled?: boolean;
}

/** The name of the group that follows it. */
export interface NphContextMenuLabel {
  type: 'label';
  text: string;
}

/** The line between two groups. */
export interface NphContextMenuSeparator {
  type: 'separator';
}

export type NphContextMenuEntry = NphContextMenuItem | NphContextMenuLabel | NphContextMenuSeparator;

/** `nph-item-select`: the item the person activated, its new state and the object under the pointer. */
export interface NphContextMenuItemSelectDetail {
  readonly value: string;
  readonly checked: boolean | null;
  /** The element under the pointer when the menu opened; `null` when it opened from code. */
  readonly origin: Element | null;
}

/** A typed search keeps its characters together for this long, as in `nph-dropdown-menu`. */
const TYPEAHEAD_MS = 500;

/** The touch held this long opens the menu (the evidence: about 700 ms). */
const LONG_PRESS_MS = 700;

/** A held touch that moves farther than this many pixels is a scroll or a drag, not a long press. */
const LONG_PRESS_MOVE = 10;

/** A `contextmenu` that follows a key or a long press within this time is the same gesture. */
const SAME_GESTURE_MS = 1000;

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
 * The shortcut as the visible text writes it (`⌘C`, `Ctrl+Shift+K`, `Del`) in the syntax of
 * `aria-keyshortcuts` (`Meta+C`, `Control+Shift+K`, `Delete`).
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

/** An item as the menu draws it: the entry, its position in its list and its group. */
interface Row {
  entry: NphContextMenuItem;
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

/**
 * The groups of a list of entries. A `label` opens a group; a `separator` closes it. Items
 * before the first label, or after a separator with no label, form a group with no name.
 * Single choice is exclusive inside a group. `accept` says whether an item can be drawn: `false`
 * leaves it out; otherwise it returns the groups of its submenu, or `null`.
 */
export function groupsOf(entries: readonly NphContextMenuEntry[], accept: (entry: NphContextMenuItem) => Group[] | null | false = () => null): Group[] {
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

/** The point where the menu opens, in the coordinates of the window. */
interface Point {
  x: number;
  y: number;
}

type Level = 0 | 1;

export class NphContextMenu extends LitElement {
  static override styles = unsafeCSS(menuCss);

  static override properties = {
    for: { type: String, reflect: true },
    /* `open` reflects so the consumer can style and check the state. */
    open: { type: Boolean, reflect: true },
    items: { attribute: false },
    /* `size` reflects because the internal CSS selects the rows by it. */
    size: { type: String, reflect: true },
    label: { type: String },
    openSubmenu: { type: String, reflect: true, attribute: 'open-submenu' },
  };

  /** `id` of the object that takes the right click, in the same root as the menu. */
  declare for: string | null;
  /** The menu is open. Set by the menu; the consumer may set it too. */
  declare open: boolean;
  /** The entries of the menu, in order. */
  declare items: readonly NphContextMenuEntry[];
  declare size: NphContextMenuSize;
  /** Accessible name of the menu. */
  declare label: string;
  /** The `value` of the item whose submenu is open; empty when closed. */
  declare openSubmenu: string;

  private readonly uid = `nph-context-menu-${(nextId += 1)}`;
  private target: HTMLElement | null = null;
  private retryFrame: number | undefined;
  private reported = '';
  private valid = false;
  private groups: Group[] = [];
  /** The row whose submenu is drawn: kept after the close so the exit has its content. */
  private subRow: Row | null = null;
  private shown: Record<Level, boolean> = { 0: false, 1: false };
  private closeTimers: Partial<Record<Level, number>> = {};
  private frame: number | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private intersectionObserver: IntersectionObserver | undefined;
  private readonly scrollTargets: EventTarget[] = [];
  private point: Point | null = null;
  private origin: Element | null = null;
  /** How the focus is placed once the panel is shown. */
  private pendingFocus: 'first' | 'last' | null = null;
  private pendingSubFocus: 'first' | null = null;
  private typed = '';
  private typedTimer: number | undefined;
  private hoverTimer: number | undefined;
  private warnedDelay = false;
  private longPressTimer: number | undefined;
  private pressStart: Point | null = null;
  private lastTouchAt = Number.NEGATIVE_INFINITY;
  private lastGestureAt = Number.NEGATIVE_INFINITY;

  constructor() {
    super();
    this.for = null;
    this.open = false;
    this.items = [];
    this.size = 'default';
    this.label = '';
    this.openSubmenu = '';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.attach();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.detach();
    this.hideNow();
    this.cancelLongPress();
    if (this.retryFrame !== undefined) {
      cancelAnimationFrame(this.retryFrame);
      this.retryFrame = undefined;
    }
  }

  /* ----- the target ----------------------------------------------------------- */

  private lookUp(): HTMLElement | null {
    const id = (this.for ?? '').trim();
    if (id === '') {
      return null;
    }
    const root = this.getRootNode() as Document | ShadowRoot;
    const found = root.getElementById?.(id) ?? null;
    return found instanceof HTMLElement && found !== this ? found : null;
  }

  /** Finds the target; an element rendered right after the menu is found one frame later (P77 item 10). */
  private attach(retry = true): void {
    if (!this.isConnected) {
      return;
    }
    const found = this.lookUp();
    if (found !== null && found === this.target) {
      this.requestUpdate();
      return;
    }
    this.detach();
    if (found === null) {
      if (retry && (this.for ?? '').trim() !== '') {
        if (this.retryFrame !== undefined) cancelAnimationFrame(this.retryFrame);
        this.retryFrame = requestAnimationFrame(() => {
          this.retryFrame = undefined;
          this.attach(false);
        });
      }
      this.requestUpdate();
      return;
    }
    this.target = found;
    found.addEventListener('contextmenu', this.onTargetContextmenu);
    found.addEventListener('keydown', this.onTargetKeydown);
    found.addEventListener('pointerdown', this.onTargetPointerdown);
    found.addEventListener('pointermove', this.onTargetPointermove);
    found.addEventListener('pointerup', this.cancelLongPress);
    found.addEventListener('pointercancel', this.cancelLongPress);
    /* A new target while open: the panel follows the scroll of its ancestors. */
    if (this.shown[0]) {
      this.updateScrollTargets();
    }
    this.requestUpdate();
  }

  private detach(): void {
    const target = this.target;
    if (target === null) {
      return;
    }
    target.removeEventListener('contextmenu', this.onTargetContextmenu);
    target.removeEventListener('keydown', this.onTargetKeydown);
    target.removeEventListener('pointerdown', this.onTargetPointerdown);
    target.removeEventListener('pointermove', this.onTargetPointermove);
    target.removeEventListener('pointerup', this.cancelLongPress);
    target.removeEventListener('pointercancel', this.cancelLongPress);
    this.cancelLongPress();
    this.target = null;
  }

  /** The element under the pointer, from the composed path (an element inside a shadow root too). */
  private static originOf(event: Event): Element | null {
    const first = event.composedPath()[0];
    return first instanceof Element ? first : null;
  }

  private fromInside(event: Event): boolean {
    return event.composedPath().includes(this);
  }

  /** The right click, or the key that the browser turns into one. */
  private readonly onTargetContextmenu = (event: MouseEvent): void => {
    if (!this.valid) {
      return;
    }
    /* A right click on the menu itself, when it sits inside the object, never opens another one. */
    if (this.fromInside(event)) {
      event.preventDefault();
      return;
    }
    const now = performance.now();
    /* The same gesture twice: the key or the long press already opened the menu. */
    if (now - this.lastGestureAt < SAME_GESTURE_MS) {
      event.preventDefault();
      return;
    }
    /*
     * The browser's own context menu of a touch held down: the long press of this menu answers it.
     * A `contextmenu` that says it is a touch is cancelled for a while; one that says nothing, as in
     * browsers whose event is a plain mouse event, only within the time of the same gesture.
     */
    const kind = (event as PointerEvent).pointerType;
    if (kind === 'touch' ? now - this.lastTouchAt < SAME_GESTURE_MS * 2 : kind === undefined && now - this.lastTouchAt < SAME_GESTURE_MS) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    this.openAt({ x: event.clientX, y: event.clientY }, NphContextMenu.originOf(event), 'first');
  };

  /** Shift+F10 and the Menu key open the menu by keyboard, below the object. */
  private readonly onTargetKeydown = (event: KeyboardEvent): void => {
    if (event.isComposing || !this.valid || this.fromInside(event)) {
      return;
    }
    const isMenuKey = event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey);
    if (!isMenuKey) {
      return;
    }
    event.preventDefault();
    this.lastGestureAt = performance.now();
    const target = this.target;
    if (target === null) {
      return;
    }
    const box = target.getBoundingClientRect();
    const rtl = getComputedStyle(target).direction === 'rtl';
    this.openAt({ x: rtl ? box.right : box.left, y: box.bottom }, NphContextMenu.originOf(event) ?? target, 'first');
  };

  private readonly onTargetPointerdown = (event: PointerEvent): void => {
    if (event.pointerType !== 'touch') {
      return;
    }
    this.lastTouchAt = performance.now();
    if (!this.valid || !event.isPrimary || this.fromInside(event)) {
      return;
    }
    this.cancelLongPress();
    this.pressStart = { x: event.clientX, y: event.clientY };
    const origin = NphContextMenu.originOf(event);
    this.longPressTimer = window.setTimeout(() => {
      this.longPressTimer = undefined;
      const start = this.pressStart;
      this.pressStart = null;
      if (start === null) {
        return;
      }
      this.lastGestureAt = performance.now();
      this.openAt(start, origin, 'first');
    }, LONG_PRESS_MS);
  };

  private readonly onTargetPointermove = (event: PointerEvent): void => {
    const start = this.pressStart;
    if (start === null || event.pointerType !== 'touch') {
      return;
    }
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > LONG_PRESS_MOVE) {
      this.cancelLongPress();
    }
  };

  private readonly cancelLongPress = (): void => {
    if (this.longPressTimer !== undefined) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = undefined;
    }
    this.pressStart = null;
  };

  /* ----- opening and closing -------------------------------------------------- */

  private openAt(point: Point, origin: Element | null, focus: 'first' | 'last'): void {
    this.point = point;
    this.origin = origin;
    this.openSubmenu = '';
    this.pendingFocus = focus;
    this.open = true;
    /* Already open: it moves to the new point and takes the focus again. */
    this.requestUpdate();
  }

  /** Closes the menu; with `returnFocus`, the focus goes back to the object. */
  private close(returnFocus: boolean): void {
    this.pendingFocus = null;
    this.pendingSubFocus = null;
    this.clearTyped();
    this.clearHover();
    this.openSubmenu = '';
    this.open = false;
    if (returnFocus) {
      this.target?.focus({ preventScroll: true });
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

  /** Esc: the open submenu first, then the menu, which gives the focus back to the object. */
  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    /* During the exit the menu is already closed: a second Esc reaches the page. */
    if ((event.key !== 'Escape' && event.key !== 'Esc') || !this.open) {
      return;
    }
    /* Esc closes the menu only, not a dialog around it (P77 item 4). */
    event.stopPropagation();
    event.preventDefault();
    if (this.openSubmenu !== '') {
      this.closeSubmenu(true);
      return;
    }
    const inside = this.renderRoot.contains(this.shadowRoot?.activeElement ?? null);
    this.close(inside);
  };

  /** A press outside the menu closes it, without moving the focus. The object's own press is a new click. */
  private readonly onDocumentPointerdown = (event: PointerEvent): void => {
    if (!event.composedPath().includes(this)) {
      this.close(false);
    }
  };

  /** The focus left the menu (Tab, a click elsewhere, code): it closes. */
  private onFocusout(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && (this.renderRoot.contains(next) || this.contains(next))) {
      return;
    }
    if (this.open) {
      this.close(false);
    }
  }

  /* ----- keyboard and pointer in the menu --------------------------------------- */

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

  private isRtl(): boolean {
    return getComputedStyle(this).direction === 'rtl';
  }

  private onKeydown(event: KeyboardEvent): void {
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
      }
    } else if (key === closing) {
      if (level === 1) {
        this.closeSubmenu(true);
      }
    } else if (key === 'Enter' || key === ' ') {
      /* Space always activates, also right after a typed search. */
      this.clearTyped();
      const element = elements[current];
      if (element) {
        this.activate(level, element, true);
      }
    } else if (key === 'Tab') {
      /*
       * Tab closes, and the focus moves on from the object, wherever the menu sits in the
       * DOM: the focus goes back to the object before the default action runs.
       */
      this.close(true);
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
    const groups = level === 0 ? this.groups : (this.subRow?.sub ?? []);
    for (const group of groups) {
      const row = group.rows.find((candidate) => candidate.index === index);
      if (row) {
        return row;
      }
    }
    return null;
  }

  /** A press on a panel outside an item keeps the focus where it is, so the menu stays open. */
  private onMousedown(event: MouseEvent): void {
    const onItem = event.composedPath().some((target) => target instanceof HTMLElement && target.classList.contains('item'));
    if (!onItem) {
      event.preventDefault();
    }
  }

  private onClick(event: MouseEvent): void {
    const level = this.levelOf(event);
    for (const target of event.composedPath()) {
      if (target instanceof HTMLElement && target.classList.contains('item')) {
        this.activate(level, target, false);
        return;
      }
      if (target === this.panel(level)) {
        return;
      }
    }
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
  private onPointerover(event: PointerEvent): void {
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
    if (!this.open || row.sub === null) {
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
    /* The focus never stays in a submenu that leaves: it would close the whole menu. */
    const inside = this.panel(1)?.contains(this.shadowRoot?.activeElement ?? null) ?? false;
    this.openSubmenu = '';
    if ((returnFocus || inside) && parent !== null) {
      const element = this.panel(0)?.querySelector<HTMLElement>(`.item[data-index="${parent.index}"]`);
      if (element) {
        this.focusItem(0, element);
      }
    }
  }

  /** Rewrites the list of the level, with the object of the consumer left untouched. */
  private rewrite(level: Level, change: (list: readonly NphContextMenuEntry[]) => NphContextMenuEntry[]): void {
    if (level === 0) {
      this.items = change(this.items);
      return;
    }
    const parent = this.subRow;
    if (parent === null) {
      return;
    }
    this.items = this.items.map((candidate, index) =>
      index === parent.index ? { ...(candidate as NphContextMenuItem), submenu: change((candidate as NphContextMenuItem).submenu ?? []) } : candidate,
    );
  }

  /** The person activated an item: a submenu opens; otherwise the state moves, the event fires, and the menu closes or stays. */
  private activate(level: Level, element: HTMLElement, byKeyboard: boolean): void {
    const row = this.rowOf(level, element);
    if (row === null || !this.open) {
      return;
    }
    const { entry } = row;
    if (entry.disabled) {
      return;
    }
    if (row.sub !== null) {
      this.showSubmenu(row, byKeyboard || element.matches(':focus-visible'));
      return;
    }
    const selection = entry.selection ?? 'none';
    const toggles = selection === 'multiple';
    let checked: boolean | null = null;
    if (toggles) {
      const next = !entry.checked;
      checked = next;
      this.rewrite(level, (list) => list.map((candidate, index) => (index === row.index ? { ...(candidate as NphContextMenuItem), checked: next } : candidate)));
    } else if (selection === 'single') {
      checked = true;
      const groups = level === 0 ? this.groups : (this.subRow?.sub ?? []);
      const peers = new Set((groups[row.group]?.rows ?? []).filter((peer) => (peer.entry.selection ?? 'none') === 'single').map((peer) => peer.index));
      this.rewrite(level, (list) => list.map((candidate, index) => (peers.has(index) ? { ...(candidate as NphContextMenuItem), checked: index === row.index } : candidate)));
    }
    this.dispatchEvent(
      new CustomEvent<NphContextMenuItemSelectDetail>('nph-item-select', {
        bubbles: true,
        detail: { value: entry.value, checked, origin: this.origin },
      }),
    );
    if (!toggles) {
      this.close(true);
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
  private acceptItem(entry: NphContextMenuItem, level: Level, causes: string[]): Group[] | null | false {
    const where = `item ${JSON.stringify(entry.value ?? null)}`;
    let ok = true;
    if (trimmed(entry.value) === '') {
      causes.push('an item needs a value: it is what nph-item-select reports.');
      ok = false;
    }
    if (trimmed(entry.text) === '') {
      causes.push(`${where} needs text: it is the accessible name of the item.`);
      ok = false;
    }
    if (entry.severity !== undefined && !oneOf(NPH_CONTEXT_MENU_SEVERITIES, entry.severity)) {
      causes.push(`${where}: severity "${String(entry.severity)}" does not exist. Use ${NPH_CONTEXT_MENU_SEVERITIES.join(', ')}.`);
      ok = false;
    }
    if (entry.selection !== undefined && !oneOf(NPH_CONTEXT_MENU_SELECTIONS, entry.selection)) {
      causes.push(`${where}: selection "${String(entry.selection)}" does not exist. Use ${NPH_CONTEXT_MENU_SELECTIONS.join(', ')}.`);
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
        sub = groupsOf(entry.submenu, (candidate) => this.acceptItem(candidate, 1, causes));
        if (sub.length === 0) {
          causes.push(`${where}: submenu has no valid item.`);
          ok = false;
        }
      }
    }
    return ok ? sub : false;
  }

  protected override willUpdate(changed: PropertyValues): void {
    /* Also on the first update: `for` may be set after the menu was connected. */
    if (changed.has('for') && this.isConnected) {
      this.attach();
    }
    const causes: string[] = [];
    if ((this.for ?? '').trim() === '') {
      causes.push('for is empty: it is the id of the object that takes the right click.');
    } else if (this.target === null && this.retryFrame === undefined) {
      causes.push(`for "${this.for}" matches no element in the same root as the menu.`);
    }
    if (!oneOf(NPH_CONTEXT_MENU_SIZES, this.size)) {
      causes.push(`size "${String(this.size)}" does not exist. Use ${NPH_CONTEXT_MENU_SIZES.join(', ')}.`);
    }
    /* An invalid entry is left out and reported; it does not stop the rest of the menu. */
    const entryCauses: string[] = [];
    const entries = Array.isArray(this.items) ? this.items : [];
    this.groups = groupsOf(entries, (entry) => this.acceptItem(entry, 0, entryCauses));
    if (this.groups.length === 0) {
      causes.push('items has no valid item: there is nothing to choose.');
    }
    const waiting = this.target === null && this.retryFrame !== undefined;
    this.valid = causes.length === 0 && this.groups.length > 0 && !waiting;
    if (!waiting) {
      this.report([...causes, ...entryCauses]);
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    /* The submenu that is drawn follows `open-submenu`, which names an item of the main list. */
    const wanted = trimmed(this.openSubmenu);
    if (wanted !== '') {
      const row = this.groups.flatMap((group) => group.rows).find((candidate) => candidate.sub !== null && candidate.entry.value === wanted && candidate.entry.disabled !== true);
      if (row !== undefined) {
        this.subRow = row;
      } else if (this.valid) {
        devError(`open-submenu "${wanted}" matches no enabled item with a submenu.`);
      }
    } else if (this.subRow !== null) {
      /* Keep the content for the exit; refresh it from the new list when it is still there. */
      const kept = this.subRow;
      this.subRow = this.groups.flatMap((group) => group.rows).find((candidate) => candidate.entry.value === kept.entry.value && candidate.sub !== null) ?? null;
    }
    /* While the target is still being looked up, `open` waits for it. */
    if (!this.valid && !waiting && this.open) {
      this.open = false;
    }
    /* A closed menu has no submenu open. */
    if (!this.open && this.openSubmenu !== '') {
      this.openSubmenu = '';
    }
  }

  protected override updated(changed: PropertyValues): void {
    const main = this.panel(0);
    if (main === null) {
      /* The input became invalid while open: the panels are gone, and so are their listeners. */
      if (this.shown[0] || this.shown[1]) this.hideNow();
      return;
    }
    if (this.open && this.valid) {
      this.show(0, main);
      if (this.pendingFocus !== null) {
        const focus = this.pendingFocus;
        this.pendingFocus = null;
        this.focusItem(0, focus);
      }
    } else if (changed.has('open') || !this.valid) {
      this.hide(0, main);
      this.point = null;
      this.origin = null;
    }
    const sub = this.panel(1);
    if (sub !== null) {
      if (this.open && this.valid && this.openSubmenu !== '' && this.subRow !== null) {
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
        /* The object entering or leaving the window, by scroll or by a layout that moves it, places the panels again. */
        if (this.target !== null && typeof IntersectionObserver === 'function') {
          this.intersectionObserver = new IntersectionObserver(() => this.onViewportChange());
          this.intersectionObserver.observe(this.target);
        }
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
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = undefined;
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
   * Every ancestor of the object in the flat tree, as in `nph-dropdown-menu`: the scroll of an
   * element inside a shadow root does not reach `window`, so each ancestor and each root listens.
   * A scroll of the page or of a container closes the menu.
   */
  private updateScrollTargets(): void {
    this.clearScrollTargets();
    let node: Node | null = this.target ?? this;
    while (node !== null) {
      if (node instanceof Element || node instanceof ShadowRoot) {
        node.addEventListener('scroll', this.onScroll, true);
        this.scrollTargets.push(node);
      }
      node = node instanceof ShadowRoot ? node.host : ((node as Element).assignedSlot ?? node.parentNode);
    }
  }

  private clearScrollTargets(): void {
    for (const target of this.scrollTargets) {
      target.removeEventListener('scroll', this.onScroll, true);
    }
    this.scrollTargets.length = 0;
  }

  /**
   * A scroll of the page or of a container around the object closes the menu the person opened
   * (the evidence). A menu opened from code has no point of the person: it stays, and follows the
   * object, until the consumer closes it.
   */
  private readonly onScroll = (event: Event): void => {
    if (!this.open || event.composedPath().includes(this)) {
      return;
    }
    if (this.point === null) {
      this.onViewportChange();
      return;
    }
    this.close(false);
  };

  private readonly onViewportChange = (event?: unknown): void => {
    if (event instanceof Event && event.type === 'scroll') {
      this.onScroll(event);
      return;
    }
    if (this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      for (const level of [0, 1] as const) {
        const panel = this.panel(level);
        if (panel && this.shown[level]) this.place(level, panel);
      }
    });
  };

  /**
   * The main panel opens with its start top corner at the point and turns to the other side of
   * it when it does not fit; the submenu opens to the right, on the same line as its item, and to
   * the left only when there is no room. Neither leaves the window; one taller than the window
   * scrolls inside.
   */
  private place(level: Level, panel: HTMLElement): void {
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    /*
     * The object is scrolled out of the window: the panels go with it, not stuck to the edge over the
     * content below, as in `nph-dropdown-menu`. They come back when the object does.
     */
    const anchor = this.target?.getBoundingClientRect();
    const visible = anchor === undefined || (anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width);
    panel.style.visibility = visible ? '' : 'hidden';
    if (!visible) {
      return;
    }
    /* Measuring drops the scroll limits; the scroll position comes back after it. */
    const scrollTop = panel.scrollTop;
    panel.style.maxHeight = '';
    panel.style.overflowY = '';
    /* `layout/input-width` is the preferred width; a narrower window, or a larger font, holds it. */
    panel.style.maxWidth = `${view.width}px`;
    panel.style.top = '0px';
    panel.style.left = '0px';
    const { width, height } = panel.getBoundingClientRect();
    let shownHeight = height;
    if (height > view.height) {
      panel.style.maxHeight = `${view.height}px`;
      panel.style.overflowY = 'auto';
      panel.scrollTop = scrollTop;
      shownHeight = panel.getBoundingClientRect().height;
    }
    const rtl = this.isRtl();
    let x: number;
    let y: number;
    if (level === 0) {
      const point = this.point ?? this.cornerOfTarget(rtl);
      x = rtl ? point.x - width : point.x;
      y = point.y;
      /* No room on the start side of the point: the panel turns to the other side of it. */
      if (!rtl && point.x + width > view.width) x = point.x - width;
      if (rtl && point.x - width < 0) x = point.x;
      if (point.y + shownHeight > view.height) y = point.y - shownHeight;
    } else {
      const parentPanel = this.panel(0);
      const parentItem = this.subRow === null ? null : parentPanel?.querySelector<HTMLElement>(`.item[data-index="${this.subRow.index}"]`);
      if (parentPanel === null || parentItem == null) {
        return;
      }
      const side = parentPanel.getBoundingClientRect();
      const item = parentItem.getBoundingClientRect();
      const style = getComputedStyle(panel);
      /* The first item sits on the line of the item that opened it: past the border and the padding. */
      const inset = parseFloat(style.borderTopWidth) + parseFloat(style.paddingTop);
      y = item.top - inset;
      const toEnd = rtl ? side.left - width : side.right;
      const toStart = rtl ? side.right : side.left - width;
      const fitsEnd = rtl ? toEnd >= 0 : toEnd + width <= view.width;
      x = fitsEnd ? toEnd : toStart;
      panel.dataset.side = fitsEnd === !rtl ? 'right' : 'left';
    }
    x = Math.min(Math.max(x, 0), Math.max(view.width - width, 0));
    y = Math.min(Math.max(y, 0), Math.max(view.height - shownHeight, 0));
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
  }

  /** A menu opened from code sits at the start top corner of the object. */
  private cornerOfTarget(rtl: boolean): Point {
    const box = this.target?.getBoundingClientRect();
    if (box === undefined) {
      return { x: 0, y: 0 };
    }
    return { x: rtl ? box.right : box.left, y: box.top };
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
    const expanded = hasSub && this.openSubmenu === entry.value && this.open;
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

  private renderPanel(level: Level, groups: Group[]): TemplateResult {
    const name = (this.label ?? '').trim();
    const parent = this.subRow;
    return html`<div
      class="panel"
      data-level=${level}
      popover="manual"
      @keydown=${this.onKeydown}
      @click=${this.onClick}
      @focusout=${this.onFocusout}
      @mousedown=${this.onMousedown}
      @pointerover=${this.onPointerover}
      @pointerenter=${level === 1 ? this.onSubmenuPointerenter : nothing}
    >
      <div
        class="menu"
        role="menu"
        id=${level === 1 ? `${this.uid}-submenu` : nothing}
        aria-label=${level === 0 && name !== '' ? name : nothing}
        aria-labelledby=${level === 1 && parent !== null ? `${this.itemId(0, parent.index)}-text` : nothing}
      >
        ${groups.map((group, position) => this.renderGroup(group, position, level))}
      </div>
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const sub = this.subRow?.sub ?? null;
    return html`${this.renderPanel(0, this.groups)}${sub === null ? nothing : this.renderPanel(1, sub)}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphContextMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-context-menu': NphContextMenu;
  }
}
