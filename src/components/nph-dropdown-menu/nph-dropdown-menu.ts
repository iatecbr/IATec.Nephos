/**
 * `nph-dropdown-menu` — the floating menu of secondary actions that opens attached to a button.
 *
 * Contract accepted in Figma (board `1365:118`, documentation `2365:3685`, menu `1365:63`,
 * item set `1365:57`, group label `1365:58`, separator `1365:60`, profile header
 * `2359:47364`), recorded as text in the evidence of the `figma-docs-accepted` gate of
 * DSA-45, sheet `fichas/nph-dropdown-menu.md`, `design.md` and decision P92 —
 * nph-dropdown-menu: API and semantics:
 * - ONE tag. The item, the group label and the separator are entries of `items`, and the
 *   profile header is `header`: the evidence makes the item an inner part of the menu, never
 *   used outside it, and the package takes one definition per folder (P91). Everything is
 *   drawn in the shadow root of the menu, so every ARIA reference stays in one root;
 * - `for`: the `id` of the element that opens the menu, looked up in the SAME root as the
 *   menu (`getRootNode()`), like the native `<label for>` and `nph-tooltip` (P77). The
 *   button stays outside the component. The menu writes `aria-haspopup="menu"` and
 *   `aria-expanded` on it;
 * - `open`: the state. Reflects. The menu turns it on and off; the consumer may set it;
 * - `items`: the entries, in order. An item (`type` absent or `item`) has `value` and
 *   `text`, and optionally `description`, `icon`, `avatar`, `severity` (`default` or
 *   `destructive`), `selection` (`none`, `single` or `multiple`), `switch`, `checked`,
 *   `shortcut`, `count`, `tag`, `submenu`, `disabled` and `loading`. A `label` entry names
 *   the group that follows it; a `separator` entry closes a group;
 * - `header`: `{ name, status, src }` or `null` (the Figma `cabeçalho`, off by default);
 * - `size`: `default` or `compact` (the Figma `tamanho` of the item), for the whole menu.
 *   Reflects, because the internal CSS selects the rows by it;
 * - `label`: the accessible name of the menu. Empty: the name comes from the trigger;
 * - the event `nph-item-select` (bubbles), with `detail: { value, checked }`, fired only when
 *   the person activates an item: `checked` is the new state of a single choice, a multiple
 *   choice or a switch, and `null` on a common item. The menu then replaces `items` with a
 *   new list that carries the new `checked`; it never changes the objects of the consumer;
 * - a common item or a single choice closes the menu and gives the focus back to the
 *   trigger; a multiple choice and a switch keep it open (evidence, Description);
 * - keyboard: the menu button pattern of the APG. On the trigger, Enter, Space and the down
 *   arrow open on the first item, the up arrow on the last. In the menu, the arrows move with
 *   wrap, Home and End go to the ends, a typed character goes to the next item that starts
 *   with it, Enter and Space activate, Esc closes and gives the focus back, Tab closes and
 *   lets the focus move on. A disabled or loading item takes the focus but does not activate;
 * - invalid input does not render and emits `console.error` only in development, one per
 *   cause (P21 rule): `for` empty or matching no element in the same root, no valid item and
 *   a `size` outside the two. An invalid entry is left out, with one error per cause.
 *
 * LAYER — the panel is a `popover="manual"`, so it lives in the top layer, as the
 * `nph-tooltip` balloon (P77) and the `nph-select` list (P91): no `z-index` and no clipping
 * by an ancestor. It opens `space/inline-tight` below the trigger, aligned to its start
 * edge, turns up when it does not fit below and fits above, never leaves the window, and
 * follows the trigger on scroll and resize.
 *
 * INNER PIECES — `nph-checkbox` (multiple choice) and `nph-switch` are drawn `inert`: the
 * item carries the role, the state and the focus, and the pieces only show it. They never
 * take `disabled`: the item already paints `state/disabled-opacity` on the whole row.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-avatar/nph-avatar';
import '../nph-badge/nph-badge';
import '../nph-checkbox/nph-checkbox';
import '../nph-icon/nph-icon';
import '../nph-separator/nph-separator';
import '../nph-spinner/nph-spinner';
import '../nph-switch/nph-switch';
import menuCss from './nph-dropdown-menu.css?inline';

const TAG = 'nph-dropdown-menu';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The two sizes of the item (the Figma `tamanho`: `padrão` and `compacto`). */
export const NPH_DROPDOWN_MENU_SIZES = ['default', 'compact'] as const;
export type NphDropdownMenuSize = (typeof NPH_DROPDOWN_MENU_SIZES)[number];

/** The two types of the item (the Figma `tipo`). */
export const NPH_DROPDOWN_MENU_SEVERITIES = ['default', 'destructive'] as const;
export type NphDropdownMenuSeverity = (typeof NPH_DROPDOWN_MENU_SEVERITIES)[number];

/** The three choices of the item (the Figma `seleção`: `nenhuma`, `única` and `múltipla`). */
export const NPH_DROPDOWN_MENU_SELECTIONS = ['none', 'single', 'multiple'] as const;
export type NphDropdownMenuSelection = (typeof NPH_DROPDOWN_MENU_SELECTIONS)[number];

/** One action of the menu. */
export interface NphDropdownMenuItem {
  type?: 'item';
  /** What the event reports. */
  value: string;
  /** The label, already localized by the consuming application. */
  text: string;
  description?: string;
  /** A core name of `nph-icon`: the start icon. Absent or empty: no icon. */
  icon?: string;
  /** The photo of the `nph-avatar` at the start; an empty string draws the person icon. */
  avatar?: string;
  severity?: NphDropdownMenuSeverity;
  selection?: NphDropdownMenuSelection;
  switch?: boolean;
  checked?: boolean;
  shortcut?: string;
  count?: number | string;
  /** One word in an `nph-badge`, such as `New`. */
  tag?: string;
  /** Draws the submenu arrow. A nested menu is out of scope (P92). */
  submenu?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

/** The name of the group that follows it. */
export interface NphDropdownMenuLabel {
  type: 'label';
  text: string;
}

/** The line between two groups. */
export interface NphDropdownMenuSeparator {
  type: 'separator';
}

export type NphDropdownMenuEntry = NphDropdownMenuItem | NphDropdownMenuLabel | NphDropdownMenuSeparator;

/** The profile header (the Figma `cabeçalho`): it only informs. */
export interface NphDropdownMenuHeader {
  name: string;
  status?: string;
  /** The photo of the `nph-avatar`; absent or empty draws the person icon. */
  src?: string;
}

/** `nph-item-select`: the item the person activated and, for a choice or a switch, its new state. */
export interface NphDropdownMenuItemSelectDetail {
  readonly value: string;
  readonly checked: boolean | null;
}

/** A typed search keeps its characters together for this long, as in `nph-select`. */
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
  return typeof value === 'string' ? value.trim() : typeof value === 'number' ? String(value) : '';
}

/** An item as the menu draws it: the entry, its position in `items` and its group. */
interface Row {
  entry: NphDropdownMenuItem;
  index: number;
  group: number;
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
 * Single choice is exclusive inside a group.
 */
export function groupsOf(entries: readonly NphDropdownMenuEntry[], valid: (entry: NphDropdownMenuItem) => boolean = () => true): Group[] {
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
    if (!valid(entry)) {
      return;
    }
    if (current === null) {
      current = { label: '', rows: [], separated };
      separated = false;
      groups.push(current);
    }
    current.rows.push({ entry, index, group: groups.length - 1 });
  });
  return groups.filter((group) => group.rows.length > 0);
}

export class NphDropdownMenu extends LitElement {
  static override styles = unsafeCSS(menuCss);

  static override properties = {
    for: { type: String, reflect: true },
    /* `open` reflects so the consumer can style and check the state. */
    open: { type: Boolean, reflect: true },
    items: { attribute: false },
    header: { attribute: false },
    /* `size` reflects because the internal CSS selects the rows by it. */
    size: { type: String, reflect: true },
    label: { type: String },
  };

  /** `id` of the element that opens the menu, in the same root as the menu. */
  declare for: string | null;
  /** The menu is open. Set by the menu; the consumer may set it too. */
  declare open: boolean;
  /** The entries of the menu, in order. */
  declare items: readonly NphDropdownMenuEntry[];
  /** The profile header, or `null`. */
  declare header: NphDropdownMenuHeader | null;
  declare size: NphDropdownMenuSize;
  /** Accessible name of the menu. Empty: the name comes from the trigger. */
  declare label: string;

  private readonly uid = `nph-dropdown-menu-${(nextId += 1)}`;
  private trigger: HTMLElement | null = null;
  private wroteHaspopup = false;
  private retryFrame: number | undefined;
  private reported = '';
  private valid = false;
  private groups: Group[] = [];
  private shown = false;
  private closeTimer: number | undefined;
  private frame: number | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private readonly scrollTargets: EventTarget[] = [];
  /** Where the focus goes once the panel is shown: the first or the last item. */
  private pendingFocus: 'first' | 'last' | null = null;
  private typed = '';
  private typedTimer: number | undefined;

  constructor() {
    super();
    this.for = null;
    this.open = false;
    this.items = [];
    this.header = null;
    this.size = 'default';
    this.label = '';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.attach();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.detach();
    this.hideNow();
    if (this.retryFrame !== undefined) {
      cancelAnimationFrame(this.retryFrame);
      this.retryFrame = undefined;
    }
  }

  /* ----- the trigger ---------------------------------------------------------- */

  private lookUp(): HTMLElement | null {
    const id = (this.for ?? '').trim();
    if (id === '') {
      return null;
    }
    const root = this.getRootNode() as Document | ShadowRoot;
    const found = root.getElementById?.(id) ?? null;
    return found instanceof HTMLElement && found !== this ? found : null;
  }

  /** Finds the trigger; an element rendered right after the menu is found one frame later (P77 item 10). */
  private attach(retry = true): void {
    if (!this.isConnected) {
      return;
    }
    const found = this.lookUp();
    if (found !== null && found === this.trigger) {
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
    this.trigger = found;
    found.addEventListener('click', this.onTriggerClick);
    found.addEventListener('keydown', this.onTriggerKeydown);
    if (!found.hasAttribute('aria-haspopup')) {
      found.setAttribute('aria-haspopup', 'menu');
      this.wroteHaspopup = true;
    }
    found.setAttribute('aria-expanded', String(this.open));
    this.requestUpdate();
  }

  private detach(): void {
    const trigger = this.trigger;
    if (trigger === null) {
      return;
    }
    trigger.removeEventListener('click', this.onTriggerClick);
    trigger.removeEventListener('keydown', this.onTriggerKeydown);
    trigger.removeAttribute('aria-expanded');
    if (this.wroteHaspopup) {
      trigger.removeAttribute('aria-haspopup');
      this.wroteHaspopup = false;
    }
    this.trigger = null;
  }

  private readonly onTriggerClick = (): void => {
    if (!this.valid) {
      return;
    }
    if (this.open) {
      this.close(false);
    } else {
      this.openOn('first');
    }
  };

  private readonly onTriggerKeydown = (event: KeyboardEvent): void => {
    if (!this.valid || event.isComposing) {
      return;
    }
    /* Enter and Space reach the trigger as a click; the arrows open the menu here. */
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.open) {
        this.focusItem(event.key === 'ArrowDown' ? 'first' : 'last');
      } else {
        this.openOn(event.key === 'ArrowDown' ? 'first' : 'last');
      }
    }
  };

  /* ----- opening and closing -------------------------------------------------- */

  private openOn(focus: 'first' | 'last'): void {
    this.pendingFocus = focus;
    this.open = true;
  }

  /** Closes the menu; with `returnFocus`, the focus goes back to the trigger. */
  private close(returnFocus: boolean): void {
    this.pendingFocus = null;
    this.clearTyped();
    this.open = false;
    if (returnFocus) {
      this.trigger?.focus();
    }
  }

  private get panel(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('.panel') ?? null;
  }

  private get itemElements(): HTMLElement[] {
    return [...(this.renderRoot?.querySelectorAll<HTMLElement>('.item') ?? [])];
  }

  private focusItem(which: 'first' | 'last' | HTMLElement | null): void {
    const elements = this.itemElements;
    const target = which === 'first' ? elements[0] : which === 'last' ? elements.at(-1) : which;
    target?.focus({ preventScroll: true });
    if (target) {
      this.reveal(target);
    }
  }

  /** The item comes into the view of the panel, without scrolling the page. */
  private reveal(element: HTMLElement): void {
    const scroller = this.panel;
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

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' && event.key !== 'Esc') {
      return;
    }
    /* Esc closes the menu only, not a dialog around it (P77 item 4). */
    event.stopPropagation();
    event.preventDefault();
    const inside = this.renderRoot.contains(this.shadowRoot?.activeElement ?? null);
    this.close(inside);
  };

  /** A press outside the menu and its trigger closes it, without moving the focus. */
  private readonly onDocumentPointerdown = (event: PointerEvent): void => {
    const path = event.composedPath();
    if (!path.includes(this) && (this.trigger === null || !path.includes(this.trigger))) {
      this.close(false);
    }
  };

  /** The focus left the menu (Tab, a click elsewhere, code): it closes. A move to the trigger is its click. */
  private onFocusout(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node) {
      const trigger = this.trigger;
      if (this.renderRoot.contains(next) || this.contains(next) || (trigger !== null && (trigger === next || trigger.contains(next)))) {
        return;
      }
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
  private typeahead(character: string, from: number): HTMLElement | null {
    if (this.typedTimer !== undefined) {
      clearTimeout(this.typedTimer);
    }
    this.typed += character.toLocaleLowerCase();
    this.typedTimer = window.setTimeout(() => {
      this.typed = '';
      this.typedTimer = undefined;
    }, TYPEAHEAD_MS);
    const elements = this.itemElements;
    const repeated = [...this.typed].every((typed) => typed === this.typed[0]);
    const search = repeated ? (this.typed[0] ?? '') : this.typed;
    const first = from + (repeated || this.typed.length === 1 ? 1 : 0);
    const ordered = [...elements.slice(first), ...elements.slice(0, first)];
    return ordered.find((element) => (element.querySelector('.text')?.textContent ?? '').trim().toLocaleLowerCase().startsWith(search)) ?? null;
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.isComposing) {
      return;
    }
    const elements = this.itemElements;
    const current = elements.indexOf(this.shadowRoot?.activeElement as HTMLElement);
    const { key, altKey, ctrlKey, metaKey } = event;
    let handled = true;
    if (key.length !== 1) {
      this.clearTyped();
    }
    if (key === 'ArrowDown') {
      this.focusItem(elements[(current + 1) % elements.length] ?? null);
    } else if (key === 'ArrowUp') {
      this.focusItem(elements[(current - 1 + elements.length) % elements.length] ?? null);
    } else if (key === 'Home') {
      this.focusItem('first');
    } else if (key === 'End') {
      this.focusItem('last');
    } else if (key === 'Enter' || (key === ' ' && this.typed === '')) {
      const element = elements[current];
      if (element) {
        this.activate(element);
      }
    } else if (key === 'Tab') {
      /* Tab closes, and the focus moves on. */
      this.close(false);
      handled = false;
    } else if (key.length === 1 && !altKey && !ctrlKey && !metaKey) {
      this.focusItem(this.typeahead(key, current) ?? elements[current] ?? null);
    } else {
      handled = false;
    }
    if (handled) {
      event.preventDefault();
    }
  }

  private rowOf(element: HTMLElement): Row | null {
    const index = Number(element.dataset.index);
    for (const group of this.groups) {
      const row = group.rows.find((candidate) => candidate.index === index);
      if (row) {
        return row;
      }
    }
    return null;
  }

  /** A press on the panel outside an item keeps the focus where it is, so the menu stays open. */
  private onMousedown(event: MouseEvent): void {
    const onItem = event.composedPath().some((target) => target instanceof HTMLElement && target.classList.contains('item'));
    if (!onItem) {
      event.preventDefault();
    }
  }

  private onClick(event: MouseEvent): void {
    for (const target of event.composedPath()) {
      if (target instanceof HTMLElement && target.classList.contains('item')) {
        this.activate(target);
        return;
      }
      if (target === this.panel) {
        return;
      }
    }
  }

  /** The person activated an item: the state moves, the event fires, and the menu closes or stays. */
  private activate(element: HTMLElement): void {
    const row = this.rowOf(element);
    if (row === null || !this.open) {
      return;
    }
    const { entry } = row;
    if (entry.disabled || entry.loading) {
      return;
    }
    const selection = entry.selection ?? 'none';
    const toggles = selection === 'multiple' || entry.switch === true;
    let checked: boolean | null = null;
    if (toggles) {
      const next = !entry.checked;
      checked = next;
      this.items = this.items.map((candidate, index) => (index === row.index ? { ...(candidate as NphDropdownMenuItem), checked: next } : candidate));
    } else if (selection === 'single') {
      checked = true;
      const group = this.groups[row.group]?.rows ?? [];
      const peers = new Set(group.filter((peer) => (peer.entry.selection ?? 'none') === 'single').map((peer) => peer.index));
      this.items = this.items.map((candidate, index) =>
        peers.has(index) ? { ...(candidate as NphDropdownMenuItem), checked: index === row.index } : candidate,
      );
    }
    this.dispatchEvent(
      new CustomEvent<NphDropdownMenuItemSelectDetail>('nph-item-select', {
        bubbles: true,
        detail: { value: entry.value, checked },
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

  /** Whether an item entry can be drawn; each reason it cannot is reported once. */
  private validItem(entry: NphDropdownMenuItem, causes: string[]): boolean {
    const where = `item ${JSON.stringify(entry.value ?? null)}`;
    let ok = true;
    if (trimmed(entry.value) === '') {
      causes.push(`an item needs a value: it is what nph-item-select reports.`);
      ok = false;
    }
    if (trimmed(entry.text) === '') {
      causes.push(`${where} needs text: it is the accessible name of the item.`);
      ok = false;
    }
    if (entry.severity !== undefined && !oneOf(NPH_DROPDOWN_MENU_SEVERITIES, entry.severity)) {
      causes.push(`${where}: severity "${String(entry.severity)}" does not exist. Use ${NPH_DROPDOWN_MENU_SEVERITIES.join(', ')}.`);
      ok = false;
    }
    if (entry.selection !== undefined && !oneOf(NPH_DROPDOWN_MENU_SELECTIONS, entry.selection)) {
      causes.push(`${where}: selection "${String(entry.selection)}" does not exist. Use ${NPH_DROPDOWN_MENU_SELECTIONS.join(', ')}.`);
      ok = false;
    }
    const selection = entry.selection ?? 'none';
    if (entry.switch === true && selection !== 'none') {
      causes.push(`${where}: a switch is not a choice; use switch or selection, not both.`);
      ok = false;
    }
    if (entry.submenu === true && (entry.switch === true || selection !== 'none')) {
      causes.push(`${where}: a submenu item is neither a choice nor a switch.`);
      ok = false;
    }
    return ok;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has('for') && this.isConnected && changed.get('for') !== undefined) {
      this.attach();
    }
    const causes: string[] = [];
    if ((this.for ?? '').trim() === '') {
      causes.push('for is empty: it is the id of the element that opens the menu.');
    } else if (this.trigger === null && this.retryFrame === undefined) {
      causes.push(`for "${this.for}" matches no element in the same root as the menu.`);
    }
    if (!oneOf(NPH_DROPDOWN_MENU_SIZES, this.size)) {
      causes.push(`size "${String(this.size)}" does not exist. Use ${NPH_DROPDOWN_MENU_SIZES.join(', ')}.`);
    }
    /* An invalid entry is left out and reported; it does not stop the rest of the menu. */
    const entryCauses: string[] = [];
    const entries = Array.isArray(this.items) ? this.items : [];
    this.groups = groupsOf(entries, (entry) => this.validItem(entry, entryCauses));
    if (this.groups.length === 0) {
      causes.push('items has no valid item: there is nothing to choose.');
    }
    const waiting = this.trigger === null && this.retryFrame !== undefined;
    this.valid = causes.length === 0 && this.groups.length > 0 && !waiting;
    if (!waiting) {
      this.report([...causes, ...entryCauses]);
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    if (!this.valid && this.open) {
      this.open = false;
    }
  }

  protected override updated(changed: PropertyValues): void {
    const panel = this.panel;
    if (this.trigger !== null) {
      this.trigger.setAttribute('aria-expanded', String(this.open && this.valid));
    }
    const menu = this.renderRoot.querySelector<HTMLElement>('[role="menu"]');
    if (menu !== null) {
      const name = (this.label ?? '').trim();
      (menu as HTMLElement & { ariaLabelledByElements: Element[] | null }).ariaLabelledByElements =
        name === '' && this.trigger !== null ? [this.trigger] : null;
    }
    if (panel === null) {
      /* The input became invalid while open: the panel is gone, and so are its listeners. */
      if (this.shown) this.hideNow();
      return;
    }
    if (this.open && this.valid) {
      this.show(panel);
      if (this.pendingFocus !== null) {
        const focus = this.pendingFocus;
        this.pendingFocus = null;
        this.focusItem(focus);
      }
    } else if (changed.has('open') || !this.valid) {
      this.hide(panel);
    }
  }

  /* ----- the layer ------------------------------------------------------------ */

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
      document.addEventListener('keydown', this.onDocumentKeydown, true);
      document.addEventListener('pointerdown', this.onDocumentPointerdown, true);
      window.addEventListener('scroll', this.onViewportChange, true);
      window.addEventListener('resize', this.onViewportChange);
      this.resizeObserver = new ResizeObserver(() => this.onViewportChange());
      if (this.trigger) this.resizeObserver.observe(this.trigger);
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
    if (this.closeTimer !== undefined || !this.shown) {
      return;
    }
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
    document.removeEventListener('keydown', this.onDocumentKeydown, true);
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

  /**
   * Every ancestor of the trigger in the flat tree, as in `nph-tooltip`: the scroll of an
   * element inside a shadow root does not reach `window`, so each ancestor and each root listens.
   */
  private updateScrollTargets(): void {
    this.clearScrollTargets();
    let node: Node | null = this.trigger ?? this;
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
    /* The panel scrolling its own items does not move it. */
    if (scrolled?.type === 'scroll' && scrolled.target === this.panel) return;
    if (this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      const panel = this.panel;
      if (panel && this.shown) this.place(panel);
    });
  };

  /** The distance to the trigger, carried by the margin of the side that faces it, in pixels. */
  private gap(panel: HTMLElement, side: 'top' | 'bottom'): number {
    panel.setAttribute('data-side', side);
    const style = getComputedStyle(panel);
    return parseFloat(side === 'bottom' ? style.marginTop : style.marginBottom) || 0;
  }

  /**
   * Below the trigger, aligned to its start edge; above it when it does not fit below and
   * fits above. When it fits on neither side, it takes the side with more room and scrolls.
   */
  private place(panel: HTMLElement): void {
    const trigger = this.trigger;
    if (trigger === null) return;
    const anchor = trigger.getBoundingClientRect();
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    /* The trigger is scrolled out of the window: the panel goes with it, not stuck to the edge. */
    const visible = anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width;
    panel.style.visibility = visible ? '' : 'hidden';
    if (!visible) {
      return;
    }
    panel.style.maxHeight = '';
    panel.style.overflowY = '';
    panel.style.top = '0px';
    panel.style.left = '0px';
    const { width, height } = panel.getBoundingClientRect();
    const roomBelow = view.height - anchor.bottom - this.gap(panel, 'bottom');
    const roomAbove = anchor.top - this.gap(panel, 'top');
    const side = roomBelow >= height || (roomAbove < height && roomBelow >= roomAbove) ? 'bottom' : 'top';
    const room = side === 'bottom' ? roomBelow : roomAbove;
    const gap = this.gap(panel, side);
    let shownHeight = height;
    if (height > room) {
      /* Only a menu taller than the room scrolls: a scrolling box clips the focus halo (P92). */
      panel.style.maxHeight = `${Math.max(room, 0)}px`;
      panel.style.overflowY = 'auto';
      shownHeight = panel.getBoundingClientRect().height;
    }
    const rtl = getComputedStyle(trigger).direction === 'rtl';
    let x = rtl ? anchor.right - width : anchor.left;
    let y = side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - shownHeight;
    x = Math.min(Math.max(x, 0), Math.max(view.width - width, 0));
    y = Math.min(Math.max(y, 0), Math.max(view.height - shownHeight, 0));
    const style = getComputedStyle(panel);
    panel.style.left = `${x - parseFloat(style.marginLeft)}px`;
    panel.style.top = `${y - parseFloat(style.marginTop)}px`;
  }

  /* ----- drawing -------------------------------------------------------------- */

  /** The light icon at rest and its solid twin, which the CSS shows on hover (rule of 21-10-2026). */
  private iconPair(name: string, size: 'sm' | 'md', className: string): TemplateResult {
    return html`<nph-icon class="${className} glyph-rest" name=${name} size=${size}></nph-icon
      ><nph-icon class="${className} glyph-hover" name=${name} variant="solid" size=${size}></nph-icon>`;
  }

  private renderHeader(): TemplateResult | typeof nothing {
    const header = this.header;
    if (header === null || header === undefined || typeof header !== 'object' || trimmed(header.name) === '') {
      return nothing;
    }
    const status = trimmed(header.status);
    return html`<div class="header">
        <nph-avatar class="header-avatar" size="md" src=${trimmed(header.src)}></nph-avatar>
        <div class="header-texts">
          <span class="header-name">${trimmed(header.name)}</span>
          ${status === '' ? nothing : html`<span class="header-status">${status}</span>`}
        </div>
      </div>
      <nph-separator class="separator"></nph-separator>`;
  }

  private renderItem(row: Row): TemplateResult {
    const { entry, index } = row;
    const id = `${this.uid}-item-${index}`;
    const text = trimmed(entry.text);
    const description = trimmed(entry.description);
    const shortcut = trimmed(entry.shortcut);
    const count = trimmed(entry.count);
    const tag = trimmed(entry.tag);
    const icon = trimmed(entry.icon);
    const selection = entry.selection ?? 'none';
    const isSwitch = entry.switch === true;
    const checked = entry.checked === true;
    const loading = entry.loading === true;
    const inactive = entry.disabled === true || loading;
    const role = selection === 'single' ? 'menuitemradio' : selection === 'multiple' || isSwitch ? 'menuitemcheckbox' : 'menuitem';
    const described = [
      description === '' ? '' : `${id}-description`,
      tag === '' || loading ? '' : `${id}-tag`,
      count === '' || loading ? '' : `${id}-count`,
      shortcut === '' || loading ? '' : `${id}-shortcut`,
    ].filter((reference) => reference !== '');

    /* In loading, the spinner takes the end of the item (P92). */
    const end = loading
      ? html`<nph-spinner class="spinner" size="sm"></nph-spinner>`
      : html`${shortcut === '' ? nothing : html`<span class="shortcut" id="${id}-shortcut">${shortcut}</span>`}${count === ''
          ? nothing
          : html`<span class="count" id="${id}-count">${count}</span>`}${tag === ''
          ? nothing
          : html`<span class="slot" id="${id}-tag"><nph-badge class="tag" text=${tag}></nph-badge></span>`}${isSwitch
          ? html`<span class="slot"><nph-switch class="switch" inert label=${text} ?checked=${checked}></nph-switch></span>`
          : nothing}${entry.submenu === true ? this.iconPair('chevron-right', 'sm', 'arrow') : nothing}${selection === 'single' && checked
          ? html`<nph-icon class="check" name="check" variant="solid" size="sm"></nph-icon>`
          : nothing}`;

    return html`<div
      class="item"
      id=${id}
      role=${role}
      tabindex="-1"
      data-index=${index}
      data-severity=${entry.severity ?? 'default'}
      data-selection=${selection}
      ?data-checked=${checked}
      ?data-disabled=${entry.disabled === true}
      aria-checked=${role === 'menuitem' ? nothing : String(checked)}
      aria-disabled=${inactive ? 'true' : nothing}
      aria-busy=${loading ? 'true' : nothing}
      aria-haspopup=${entry.submenu === true ? 'menu' : nothing}
      aria-labelledby="${id}-text"
      aria-describedby=${described.length === 0 ? nothing : described.join(' ')}
    >
      ${selection === 'multiple' ? html`<nph-checkbox class="checkbox" inert label=${text} .checked=${checked}></nph-checkbox>` : nothing}
      ${icon !== '' ? this.iconPair(icon, 'md', 'icon') : nothing}
      ${icon === '' && typeof entry.avatar === 'string' ? html`<nph-avatar class="avatar" size="sm" src=${entry.avatar.trim()}></nph-avatar>` : nothing}
      <span class="texts"
        ><span class="text" id="${id}-text">${text}</span>${description === ''
          ? nothing
          : html`<span class="description" id="${id}-description">${description}</span>`}</span
      >
      <span class="end">${end}</span>
    </div>`;
  }

  private renderGroup(group: Group, position: number): TemplateResult {
    const items = group.rows.map((row) => this.renderItem(row));
    const separator = group.separated ? html`<nph-separator class="separator"></nph-separator>` : nothing;
    if (group.label === '') {
      return html`${separator}${items}`;
    }
    const labelId = `${this.uid}-group-${position}`;
    return html`${separator}<div class="group" role="group" aria-labelledby=${labelId}>
        <div class="group-label" id=${labelId}>${group.label}</div>
        ${items}
      </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const name = (this.label ?? '').trim();
    return html`<div
      class="panel"
      popover="manual"
      @keydown=${this.onKeydown}
      @click=${this.onClick}
      @focusout=${this.onFocusout}
      @mousedown=${this.onMousedown}
    >
      ${this.renderHeader()}
      <div class="menu" role="menu" aria-label=${name === '' ? nothing : name}>
        ${this.groups.map((group, position) => this.renderGroup(group, position))}
      </div>
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphDropdownMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-dropdown-menu': NphDropdownMenu;
  }

  interface HTMLElementEventMap {
    'nph-item-select': CustomEvent<NphDropdownMenuItemSelectDetail>;
  }
}
