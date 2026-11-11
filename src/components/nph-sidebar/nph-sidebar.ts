/**
 * `nph-sidebar` — the main navigation menu of a product, in a column on the left.
 *
 * Contract accepted in Figma (documentation frame `4633:27036`, page `1367:2`, sets
 * `nph-sidebar` `4605:9647`, `nph-sidebar-flyout` `4605:9612`, `nph-sidebar-flyout-option`
 * `4605:9599`, `nph-sidebar-logo` `4605:9589` and `nph-sidebar-label` `4605:9594`), recorded as
 * text in the evidence of the `figma-docs-accepted` gate of DSA-72, sheet
 * `fichas/nph-sidebar.md`, `design.md` and decision P116 — nph-sidebar: API and semantics:
 * - ONE tag. The panel, the group label, the flyout panel and its option are drawn in the
 *   shadow root, so every ARIA reference stays in one root; the item, the subitem and the rail
 *   button are the pieces of DSA-53, used by instance. The package takes one definition per
 *   folder (P91);
 * - `items`: the entries, in order, by property only (it replaces the list, never the objects
 *   of the consumer). A `label` entry (`{ type: 'label', text }`) names the group that follows
 *   it. A link (`type` absent or `link`) has `label`, `icon`, `href`, and optionally `active`,
 *   `counter`, `disabled`, `tooltip`, `actions`, `actionsLabel` and `value`. A `group` has
 *   `label`, `icon`, `children` and optionally `expanded`, `disabled`, `tooltip`, `actions`,
 *   `actionsLabel` and `value`. A child (the subitem) has `label` and `href`, or `options`
 *   (the third level, `label` and `href` each); `active`, `disabled`, `tooltip` and `value`.
 *   Two levels in the list; the third only in a flyout panel;
 * - `mode`: `expanded` (default), `collapsed` or `mobile`. Reflects. The product chooses it;
 *   the collapse button also switches expanded and collapsed and fires `nph-mode-change`,
 *   `detail: { mode }`, which the product keeps;
 * - `open`: the mobile menu opened, only in `mobile`. The product opens it with a button of
 *   its own. Reflects; the menu sets it to `false` itself when the person closes it, after the
 *   cancelable event `nph-close` (bubbles, composed), `detail: { source }`, `source` being
 *   `close-button`, `escape` or `scrim`. Setting `open` from code fires nothing;
 * - `loading`: the `nph-skeleton` rows in place of the items, `aria-busy` on the navigation;
 * - `label`: the name of the navigation landmark, already localized. `collapse-label` and
 *   `expand-label`: the name of the collapse button in each state; `close-label`: the name of
 *   the mobile close button. A button whose name is missing is not drawn, with one error;
 * - `logo-src`, `logo-mark-src`, `logo-label`, `logo-href`: the logo image of the brand library
 *   (full in the expanded and mobile modes, the mark in the collapsed one) and the link of the
 *   product. The image is not exported by Nephos; it has no dark version yet (D-2);
 * - `search-label`, `search-placeholder` and `search-value`: the `nph-input` of the expanded
 *   and mobile modes, drawn only with `search-label`. The event `nph-search-change`,
 *   `detail: { value }`, follows the typing;
 * - `hide-collapse-button` and `hide-corner-button`: the two Figma booleans, on by default,
 *   as `hide-close` of `nph-dialog`. `corner-label` is the main action of the product; without
 *   it there is no corner button. The event `nph-corner-action` fires on its click;
 * - `empty-text` and `error-text`: the short messages in place of the list, already localized;
 * - the events `nph-group-toggle`, `detail: { value, expanded }`, when the person opens or closes
 *   a group, and `nph-item-select`, the action chosen in the more actions of an item, with
 *   `detail: { value, checked, item }`. Links fire nothing: the click is the native `click`;
 * - no slot, no color property and no `::part`. Invalid input does not render and emits
 *   `console.error` only in development, one per cause (P21). An empty list is a mount.
 *
 * FLYOUT — a `popover="manual"` in the top layer (as `nph-dropdown-menu`), drawn right after its
 * opener, so the next Tab enters it. It opens on a click, Enter or Space, never on hover, next
 * to the opener, `space/inline` to the side with its top aligned, and stays inside the screen.
 * One panel per level; Esc closes the innermost and gives the focus back; a click or the focus
 * outside closes it.
 *
 * MOBILE — a native `<dialog>` opened with `showModal()`, as `nph-dialog` (P87): top layer, the
 * page inert, the focus trapped, and `sidebar/scrim` as its `::backdrop`.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-icon/nph-icon';
import '../nph-input/nph-input';
import '../nph-separator/nph-separator';
import '../nph-sidebar-item/nph-sidebar-item';
import '../nph-sidebar-rail-button/nph-sidebar-rail-button';
import '../nph-sidebar-subitem/nph-sidebar-subitem';
import '../nph-skeleton/nph-skeleton';
import '../nph-tooltip/nph-tooltip';
import type { NphDropdownMenuEntry, NphDropdownMenuItemSelectDetail } from '../nph-dropdown-menu/nph-dropdown-menu';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import type { NphInput } from '../nph-input/nph-input';
import sidebarCss from './nph-sidebar.css?inline';

const TAG = 'nph-sidebar';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_SIDEBAR_MODES = ['expanded', 'collapsed', 'mobile'] as const;
export type NphSidebarMode = (typeof NPH_SIDEBAR_MODES)[number];

/** The skeleton rows of the loading state: the number of items the list is expected to hold. */
const SKELETON_ROWS = 6;

/** The leaf of the third level: a link, shown in a flyout panel. */
export interface NphSidebarOption {
  /** What the events report. Optional. */
  value?: string;
  /** The text, already localized by the consuming application. */
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  /** The text of the `nph-tooltip` with the full name. */
  tooltip?: string;
}

/** The second level: the subitem of a group, or the option of a flyout panel. It leads to a page or opens `options`. */
export interface NphSidebarChild {
  value?: string;
  label: string;
  /** The page it leads to. Not with `options`. */
  href?: string;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  /** The third level, in a flyout panel next to it. Not with `href` or `active`. */
  options?: readonly NphSidebarOption[];
}

/** The name of the group that follows it (the Figma `nph-sidebar-label`, `tipo=grupo`). */
export interface NphSidebarLabel {
  type: 'label';
  text: string;
}

/** A first-level entry that leads to a page. */
export interface NphSidebarLink {
  type?: 'link';
  value?: string;
  label: string;
  icon: string;
  href?: string;
  active?: boolean;
  counter?: number;
  disabled?: boolean;
  tooltip?: string;
  actions?: readonly NphDropdownMenuEntry[];
  actionsLabel?: string;
}

/** A first-level entry that opens the subitems below it, or a flyout panel when collapsed. */
export interface NphSidebarGroup {
  type: 'group';
  value?: string;
  label: string;
  icon: string;
  expanded?: boolean;
  disabled?: boolean;
  tooltip?: string;
  actions?: readonly NphDropdownMenuEntry[];
  actionsLabel?: string;
  children: readonly NphSidebarChild[];
}

export type NphSidebarEntry = NphSidebarLabel | NphSidebarLink | NphSidebarGroup;

/** `nph-mode-change`: the mode the person chose with the collapse button. */
export const NPH_SIDEBAR_MODE_CHANGE_EVENT = 'nph-mode-change';
export interface NphSidebarModeChangeDetail {
  readonly mode: 'expanded' | 'collapsed';
}

/** `nph-close`: the person asked to close the mobile menu. */
export const NPH_SIDEBAR_CLOSE_EVENT = 'nph-close';
export type NphSidebarCloseSource = 'close-button' | 'escape' | 'scrim';
export interface NphSidebarCloseDetail {
  readonly source: NphSidebarCloseSource;
}

/** `nph-group-toggle`: the group the person opened or closed. */
export const NPH_SIDEBAR_GROUP_TOGGLE_EVENT = 'nph-group-toggle';
export interface NphSidebarGroupToggleDetail {
  readonly value: string;
  readonly expanded: boolean;
}

/** `nph-search-change`: the text in the search. */
export const NPH_SIDEBAR_SEARCH_CHANGE_EVENT = 'nph-search-change';
export interface NphSidebarSearchChangeDetail {
  readonly value: string;
}

/** `nph-corner-action`: the person pressed the corner button. */
export const NPH_SIDEBAR_CORNER_ACTION_EVENT = 'nph-corner-action';

/** `nph-item-select`: the action chosen in the more actions of an item, and the item it belongs to. */
export interface NphSidebarItemSelectDetail extends NphDropdownMenuItemSelectDetail {
  readonly item: string;
}

/** Development error, one per cause; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

const trimmed = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/** The element that has the focus, inside shadow roots too. */
function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

/** An entry as the menu draws it, with its position in `items`. */
type Row =
  | { kind: 'label'; index: number; text: string }
  | { kind: 'link'; index: number; entry: NphSidebarLink }
  | { kind: 'group'; index: number; entry: NphSidebarGroup; children: ChildRow[] };

interface ChildRow {
  index: number;
  child: NphSidebarChild;
  options: readonly NphSidebarOption[] | null;
}

/** A section of the list: an optional label and the rows that follow it. */
interface Section {
  label: string;
  position: number;
  rows: Row[];
}

export class NphSidebar extends LitElement {
  static override styles = unsafeCSS(sidebarCss);

  static override properties = {
    /* `mode`, `open` and `loading` reflect: the internal CSS selects the box by them. */
    mode: { type: String, reflect: true },
    open: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    items: { attribute: false },
    label: { type: String },
    logoSrc: { type: String, attribute: 'logo-src' },
    logoMarkSrc: { type: String, attribute: 'logo-mark-src' },
    logoLabel: { type: String, attribute: 'logo-label' },
    logoHref: { type: String, attribute: 'logo-href' },
    searchLabel: { type: String, attribute: 'search-label' },
    searchPlaceholder: { type: String, attribute: 'search-placeholder' },
    searchValue: { type: String, attribute: 'search-value' },
    collapseLabel: { type: String, attribute: 'collapse-label' },
    expandLabel: { type: String, attribute: 'expand-label' },
    closeLabel: { type: String, attribute: 'close-label' },
    cornerLabel: { type: String, attribute: 'corner-label' },
    hideCollapseButton: { type: Boolean, attribute: 'hide-collapse-button' },
    hideCornerButton: { type: Boolean, attribute: 'hide-corner-button' },
    emptyText: { type: String, attribute: 'empty-text' },
    errorText: { type: String, attribute: 'error-text' },
    /* The open flyout panels: internal state, the path of the opener of each level. */
    openSecond: { state: true },
    openThird: { state: true },
  };

  declare mode: NphSidebarMode;
  declare open: boolean;
  declare loading: boolean;
  /** The entries, already localized by the consuming application. */
  declare items: readonly NphSidebarEntry[];
  declare label: string;
  declare logoSrc: string;
  declare logoMarkSrc: string;
  declare logoLabel: string;
  declare logoHref: string;
  declare searchLabel: string;
  declare searchPlaceholder: string;
  declare searchValue: string;
  declare collapseLabel: string;
  declare expandLabel: string;
  declare closeLabel: string;
  declare cornerLabel: string;
  declare hideCollapseButton: boolean;
  declare hideCornerButton: boolean;
  declare emptyText: string;
  declare errorText: string;
  declare openSecond: string | null;
  declare openThird: string | null;

  private valid = false;
  private sections: Section[] = [];
  private empty = false;
  private reported = new Set<string>();
  /* The mobile menu: whether the dialog is in the top layer, and the exit in progress. */
  private shown = false;
  private closeTimer: number | undefined;
  private returnFocus: Element | null = null;
  /* The flyout panels: listeners while any is open. */
  private listening = false;
  private frame: number | undefined;
  /* After the mode changes, the collapse button is drawn anew: the focus goes back to it. */
  private refocusToggle = false;
  private previousMode: NphSidebarMode | undefined;

  constructor() {
    super();
    this.mode = 'expanded';
    this.open = false;
    this.loading = false;
    this.items = [];
    this.label = '';
    this.logoSrc = '';
    this.logoMarkSrc = '';
    this.logoLabel = '';
    this.logoHref = '';
    this.searchLabel = '';
    this.searchPlaceholder = '';
    this.searchValue = '';
    this.collapseLabel = '';
    this.expandLabel = '';
    this.closeLabel = '';
    this.cornerLabel = '';
    this.hideCollapseButton = false;
    this.hideCornerButton = false;
    this.emptyText = '';
    this.errorText = '';
    this.openSecond = null;
    this.openThird = null;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopListening();
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    this.shown = false;
  }

  /* ----- validation ------------------------------------------------------------ */

  private report(causes: readonly string[]): void {
    for (const cause of causes) {
      if (!this.reported.has(cause)) {
        this.reported.add(cause);
        devError(cause);
      }
    }
  }

  private validOptions(path: string, options: unknown, causes: string[]): readonly NphSidebarOption[] | null {
    if (!Array.isArray(options) || options.length === 0) {
      causes.push(`items[${path}].options needs at least one option: an empty list leads nowhere.`);
      return null;
    }
    const kept: NphSidebarOption[] = [];
    options.forEach((option: unknown, position) => {
      const candidate = option as Partial<NphSidebarOption> | null;
      if (candidate === null || typeof candidate !== 'object' || trimmed(candidate.label) === '') {
        causes.push(`items[${path}].options[${position}] needs a label: it is left out.`);
      } else if (trimmed(candidate.href) === '' && candidate.disabled !== true) {
        causes.push(`items[${path}].options[${position}] needs an href: the page it leads to. It is left out.`);
      } else {
        kept.push(candidate as NphSidebarOption);
      }
    });
    return kept.length === 0 ? null : kept;
  }

  private validChildren(index: number, children: unknown, causes: string[]): ChildRow[] {
    const rows: ChildRow[] = [];
    if (!Array.isArray(children) || children.length === 0) {
      causes.push(`items[${index}] is a group and needs children: the subitems it opens.`);
      return rows;
    }
    children.forEach((child: unknown, position) => {
      const path = `${index}].children[${position}`;
      const candidate = child as Partial<NphSidebarChild> | null;
      if (candidate === null || typeof candidate !== 'object' || trimmed(candidate.label) === '') {
        causes.push(`items[${path}] needs a label: it is left out.`);
        return;
      }
      if (candidate.options !== undefined) {
        if (trimmed(candidate.href) !== '') {
          causes.push(`items[${path}] has options and an href: a subitem with options opens a flyout panel, it has no href. It is left out.`);
          return;
        }
        if (candidate.active === true) {
          causes.push(`items[${path}] has options and is active: the current page is one of its options. It is left out.`);
          return;
        }
        const options = this.validOptions(path, candidate.options, causes);
        if (options === null) {
          return;
        }
        rows.push({ index: position, child: candidate as NphSidebarChild, options });
        return;
      }
      if (trimmed(candidate.href) === '' && candidate.disabled !== true) {
        causes.push(`items[${path}] needs an href: the page it leads to. It is left out.`);
        return;
      }
      rows.push({ index: position, child: candidate as NphSidebarChild, options: null });
    });
    return rows;
  }

  private validRows(causes: string[]): Row[] {
    const rows: Row[] = [];
    if (!Array.isArray(this.items)) {
      causes.push('items is not a list of entries: nothing to draw.');
      return rows;
    }
    this.items.forEach((entry: unknown, index) => {
      const candidate = entry as { type?: unknown } | null;
      if (candidate === null || typeof candidate !== 'object') {
        causes.push(`items[${index}] is not an entry: it is left out.`);
        return;
      }
      const type = candidate.type ?? 'link';
      if (type === 'label') {
        const text = trimmed((candidate as Partial<NphSidebarLabel>).text);
        if (text === '') {
          causes.push(`items[${index}] is a label with no text: it is left out.`);
        } else {
          rows.push({ kind: 'label', index, text });
        }
        return;
      }
      if (type !== 'link' && type !== 'group') {
        causes.push(`items[${index}] has type "${String(type)}", which does not exist. Use link, group or label. It is left out.`);
        return;
      }
      const item = candidate as { label?: unknown; icon?: unknown; href?: unknown; disabled?: unknown; children?: unknown };
      if (trimmed(item.label) === '') {
        causes.push(`items[${index}] needs a label: it is left out.`);
        return;
      }
      if (!isCoreName(trimmed(item.icon))) {
        causes.push(`items[${index}].icon "${trimmed(item.icon)}" is not a core name of nph-icon: the item is left out.`);
        return;
      }
      if (type === 'link') {
        if (trimmed(item.href) === '' && item.disabled !== true) {
          causes.push(`items[${index}] is a link and needs an href: the page it leads to. It is left out.`);
          return;
        }
        rows.push({ kind: 'link', index, entry: candidate as NphSidebarLink });
        return;
      }
      const children = this.validChildren(index, item.children, causes);
      if (children.length > 0) {
        rows.push({ kind: 'group', index, entry: candidate as NphSidebarGroup, children });
      }
    });
    return rows;
  }

  private static sectionsOf(rows: readonly Row[]): Section[] {
    const sections: Section[] = [];
    let current: Section = { label: '', position: 0, rows: [] };
    for (const row of rows) {
      if (row.kind === 'label') {
        if (current.rows.length > 0 || current.label !== '') {
          sections.push(current);
        }
        current = { label: row.text, position: row.index, rows: [] };
      } else {
        current.rows.push(row);
      }
    }
    if (current.rows.length > 0 || current.label !== '') {
      sections.push(current);
    }
    return sections;
  }

  protected override willUpdate(changed: PropertyValues): void {
    const causes: string[] = [];
    const mode = this.mode ?? '';
    if (!oneOf(NPH_SIDEBAR_MODES, mode)) {
      causes.push(`mode "${mode}" does not exist. Use ${NPH_SIDEBAR_MODES.join(', ')}.`);
    }
    const rows = this.validRows(causes);
    this.sections = NphSidebar.sectionsOf(rows);
    this.empty = rows.length === 0;
    const name = trimmed(this.label);
    if (name === '') {
      causes.push('label is empty: the navigation needs an accessible name, such as "Main menu".');
    }
    if (!this.hideCollapseButton && trimmed(mode === 'collapsed' ? this.expandLabel : this.collapseLabel) === '' && mode !== 'mobile') {
      causes.push('collapse-label and expand-label are empty: the collapse button has no name and is not drawn. Set both or hide-collapse-button.');
    }
    if (mode === 'mobile' && trimmed(this.closeLabel) === '') {
      causes.push('close-label is empty: the mobile close button has no name and is not drawn.');
    }
    this.report(causes);
    /* A missing name warns and still draws, as `nph-input`: the label may arrive after the first render. */
    this.valid = oneOf(NPH_SIDEBAR_MODES, mode);
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);

    if (changed.has('mode') || changed.has('items')) {
      this.syncFlyoutState(changed.has('mode'));
    }
  }

  /** The panels follow the mode and the list: a path that no longer exists is closed. */
  private syncFlyoutState(modeChanged: boolean): void {
    if (modeChanged) {
      if (this.previousMode !== undefined && this.previousMode !== this.mode) {
        this.openSecond = null;
        this.openThird = null;
      }
      this.previousMode = this.mode;
    }
    const group = (index: number): Row | undefined => this.sections.flatMap((section) => section.rows).find((row) => row.index === index);
    if (this.openSecond !== null) {
      const row = group(Number(this.openSecond));
      if (row === undefined || row.kind !== 'group') {
        this.openSecond = null;
      }
    }
    if (this.openThird !== null) {
      const [top, child] = this.openThird.split('/').map(Number);
      const row = group(top ?? -1);
      const found = row?.kind === 'group' ? row.children.find((candidate) => candidate.index === child) : undefined;
      if (found === undefined || found.options === null) {
        this.openThird = null;
      }
    }
  }

  /* ----- events ---------------------------------------------------------------- */

  private onCollapse(): void {
    const next = this.mode === 'collapsed' ? 'expanded' : 'collapsed';
    this.closeFlyouts();
    this.mode = next;
    this.refocusToggle = true;
    this.dispatchEvent(
      new CustomEvent<NphSidebarModeChangeDetail>(NPH_SIDEBAR_MODE_CHANGE_EVENT, { bubbles: true, composed: true, detail: { mode: next } }),
    );
  }

  /** The close of the mobile menu: the product may veto it. */
  private requestClose(source: NphSidebarCloseSource): void {
    const proceed = this.dispatchEvent(
      new CustomEvent<NphSidebarCloseDetail>(NPH_SIDEBAR_CLOSE_EVENT, { bubbles: true, composed: true, cancelable: true, detail: { source } }),
    );
    if (proceed) {
      this.closeFlyouts();
      this.open = false;
    }
  }

  private onSearch(event: Event): void {
    const value = (event.target as NphInput).value ?? '';
    this.searchValue = value;
    this.dispatchEvent(
      new CustomEvent<NphSidebarSearchChangeDetail>(NPH_SIDEBAR_SEARCH_CHANGE_EVENT, { bubbles: true, composed: true, detail: { value } }),
    );
  }

  private onCorner(): void {
    this.dispatchEvent(new CustomEvent(NPH_SIDEBAR_CORNER_ACTION_EVENT, { bubbles: true, composed: true }));
  }

  /** A group of the expanded list: the new `expanded` goes into a new list. */
  private onGroupToggle(event: CustomEvent<{ expanded: boolean }>, row: Row & { kind: 'group' }): void {
    event.stopPropagation();
    const expanded = event.detail.expanded;
    this.items = this.items.map((entry, index) => (index === row.index ? { ...(entry as NphSidebarGroup), expanded } : entry));
    this.dispatchEvent(
      new CustomEvent<NphSidebarGroupToggleDetail>(NPH_SIDEBAR_GROUP_TOGGLE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { value: trimmed(row.entry.value), expanded },
      }),
    );
  }

  /** The `nph-item-select` of the menu of an item does not leave the shadow root: it is fired again here. */
  private onItemSelect(event: CustomEvent<NphDropdownMenuItemSelectDetail>, value: string | undefined): void {
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent<NphSidebarItemSelectDetail>('nph-item-select', {
        bubbles: true,
        composed: true,
        detail: { ...event.detail, item: trimmed(value) },
      }),
    );
  }

  /** The rail button of a group opens or closes the flyout panel of its children. */
  private onSecondToggle(event: CustomEvent<{ expanded: boolean }>, path: string): void {
    event.stopPropagation();
    this.openSecond = event.detail.expanded ? path : this.openSecond === path ? null : this.openSecond;
    this.openThird = null;
  }

  /** A subitem or an option with options opens or closes the third level. */
  private setThird(path: string, expanded: boolean): void {
    this.openThird = expanded ? path : this.openThird === path ? null : this.openThird;
  }

  private onThirdToggle(event: CustomEvent<{ expanded: boolean }>, path: string): void {
    event.stopPropagation();
    this.setThird(path, event.detail.expanded);
  }

  private closeFlyouts(): void {
    this.openSecond = null;
    this.openThird = null;
  }

  private opener(path: string): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(`[data-path="${path}"]`);
  }

  /** Esc closes the innermost panel and gives the focus back to its opener; with none open, it closes the mobile menu. */
  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || event.defaultPrevented) {
      return;
    }
    if (this.openThird !== null) {
      const path = this.openThird;
      this.openThird = null;
      event.preventDefault();
      event.stopPropagation();
      void this.updateComplete.then(() => this.opener(path)?.focus());
      return;
    }
    if (this.openSecond !== null) {
      const path = this.openSecond;
      this.openSecond = null;
      event.preventDefault();
      event.stopPropagation();
      void this.updateComplete.then(() => this.opener(path)?.focus());
      return;
    }
    if (this.mode === 'mobile' && this.open) {
      event.preventDefault();
      this.requestClose('escape');
    }
  };

  /**
   * The focus leaving the panels and the openers that hold them open, for another line of the menu or another part of
   * the page, closes the panels (APG, Disclosure Navigation). A window that loses the focus has no
   * `relatedTarget`, and a press outside is closed by `onDocumentPointerdown`.
   */
  private readonly onFocusout = (event: FocusEvent): void => {
    if (this.openSecond === null && this.openThird === null) {
      return;
    }
    const next = event.relatedTarget as Element | null;
    if (next === null) {
      return;
    }
    const path = next.getAttribute('data-path');
    const opens = path !== null && (path === this.openSecond || path === this.openThird);
    const inside = this.renderRoot.contains(next) && (next.closest('.flyout') !== null || opens);
    if (!inside) {
      this.closeFlyouts();
    }
  };

  /** A press outside the panels and their openers closes them. */
  private readonly onDocumentPointerdown = (event: Event): void => {
    const inside = event.composedPath().some((node) => {
      return node instanceof HTMLElement && (node.classList.contains('flyout') || node.hasAttribute('data-opener'));
    });
    if (!inside) {
      this.closeFlyouts();
    }
  };

  private readonly onViewportChange = (event?: Event): void => {
    /* A panel scrolling its own options does not move it. */
    if (event?.type === 'scroll' && event.target instanceof HTMLElement && event.target.classList.contains('flyout')) {
      return;
    }
    if (this.frame !== undefined) {
      return;
    }
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      this.placeFlyouts();
    });
  };

  private startListening(): void {
    if (this.listening) {
      return;
    }
    this.listening = true;
    document.addEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.addEventListener('scroll', this.onViewportChange, true);
    window.addEventListener('resize', this.onViewportChange);
  }

  private stopListening(): void {
    if (!this.listening) {
      return;
    }
    this.listening = false;
    document.removeEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
      this.frame = undefined;
    }
  }

  /* ----- the layers ------------------------------------------------------------ */

  protected override updated(): void {
    this.wireControls();
    this.syncMobile();
    this.syncFlyouts();
    if (this.refocusToggle) {
      this.refocusToggle = false;
      this.renderRoot.querySelector<HTMLElement>('.toggle')?.focus();
    }
  }

  /** `aria-controls` by id cannot cross the shadow root of a piece: each opener takes the element itself. */
  private wireControls(): void {
    for (const opener of this.renderRoot.querySelectorAll<HTMLElement & { controls?: HTMLElement | null }>('[data-controls]')) {
      const id = opener.getAttribute('data-controls') ?? '';
      const target = this.renderRoot.querySelector<HTMLElement>(`#${id}`);
      if ('controls' in opener) {
        opener.controls = target;
      } else {
        (opener as HTMLElement & { ariaControlsElements: readonly Element[] | null }).ariaControlsElements = target === null ? null : [target];
      }
    }
  }

  private get dialog(): HTMLDialogElement | null {
    return this.renderRoot.querySelector<HTMLDialogElement>('dialog.panel');
  }

  private syncMobile(): void {
    const dialog = this.dialog;
    if (dialog !== null && this.valid && this.open) {
      this.enter(dialog);
    } else if (dialog !== null) {
      if (this.shown) {
        this.leave(dialog);
      }
    } else if (this.shown) {
      this.leaveNow();
    }
  }

  private enter(dialog: HTMLDialogElement): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      this.shown = true;
      this.returnFocus = deepActiveElement();
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          this.shown = false;
          this.returnFocus = null;
          return;
        }
      }
      /* The first style is the closed one; the next one starts the enter transition. */
      void dialog.offsetWidth;
    }
    dialog.setAttribute('data-open', '');
  }

  /** Starts the exit; the dialog leaves the top layer when the exit ends. */
  private leave(dialog: HTMLDialogElement): void {
    dialog.removeAttribute('data-open');
    if (this.closeTimer !== undefined) {
      return;
    }
    const duration = parseFloat(getComputedStyle(dialog).transitionDuration) * 1000;
    const finish = (): void => {
      this.closeTimer = undefined;
      this.leaveNow();
    };
    if (!(duration > 0)) {
      finish();
      return;
    }
    this.closeTimer = window.setTimeout(finish, duration);
  }

  /** Closes at once, releases the page and gives the focus back to the button that opened the menu. */
  private leaveNow(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      return;
    }
    this.shown = false;
    const dialog = this.dialog;
    if (dialog !== null) {
      dialog.removeAttribute('data-open');
      if (dialog.open) {
        dialog.close();
      }
    }
    const back = this.returnFocus;
    this.returnFocus = null;
    if (back instanceof HTMLElement && back.isConnected) {
      back.focus();
    }
  }

  /* Esc is a close request of the browser, which fires `cancel` on the `<dialog>`: it follows the same path as the key. */
  private readonly onCancel = (event: Event): void => {
    event.preventDefault();
    if (this.openThird !== null || this.openSecond !== null) {
      this.closeFlyouts();
      return;
    }
    this.requestClose('escape');
  };

  /** The dialog closed by a path other than `open` (the browser): the state follows. */
  private readonly onNativeClose = (): void => {
    if (this.shown && this.dialog?.open !== true) {
      this.open = false;
      this.leaveNow();
    }
  };

  /** A click on the scrim: on the dialog itself and outside its box. */
  private readonly onDialogClick = (event: MouseEvent): void => {
    const dialog = event.currentTarget as HTMLDialogElement;
    if (event.target !== dialog) {
      return;
    }
    const box = dialog.getBoundingClientRect();
    const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    if (outside) {
      this.requestClose('scrim');
    }
  };

  private get flyouts(): HTMLElement[] {
    return [...this.renderRoot.querySelectorAll<HTMLElement>('.flyout')];
  }

  /** Each panel enters the top layer once, is placed next to its opener and starts its enter. */
  private syncFlyouts(): void {
    const panels = this.flyouts;
    if (panels.length === 0) {
      this.stopListening();
      return;
    }
    this.startListening();
    for (const panel of panels) {
      if (!panel.matches(':popover-open')) {
        try {
          panel.showPopover();
        } catch {
          /* Not connected, or already showing: nothing to do. */
        }
      }
    }
    this.placeFlyouts();
    for (const panel of panels) {
      if (!panel.hasAttribute('data-open')) {
        /* The first style is the closed one; the next one starts the enter transition. */
        void panel.offsetWidth;
        panel.setAttribute('data-open', '');
      }
    }
  }

  /**
   * Next to the opener, `space/inline` to the side (the margin of the panel carries it), top
   * aligned; on the other side when it does not fit; always inside the window, and the panel
   * scrolls only when it is taller than the window.
   */
  private placeFlyouts(): void {
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    for (const panel of this.flyouts) {
      const opener = this.opener(panel.getAttribute('data-for') ?? '');
      if (opener === null) {
        continue;
      }
      const anchor = opener.getBoundingClientRect();
      const scrollTop = panel.scrollTop;
      panel.style.maxBlockSize = '';
      panel.style.overflowY = '';
      panel.style.top = '0px';
      panel.style.left = '0px';
      const { width, height } = panel.getBoundingClientRect();
      const style = getComputedStyle(panel);
      const gap = parseFloat(style.marginTop) || 0;
      const rtl = getComputedStyle(opener).direction === 'rtl';
      const toEnd = rtl ? anchor.left - gap - width : anchor.right + gap;
      const toStart = rtl ? anchor.right + gap : anchor.left - gap - width;
      const fitsEnd = rtl ? toEnd >= 0 : toEnd + width <= view.width;
      let x = fitsEnd ? toEnd : toStart;
      let shownHeight = height;
      if (height > view.height) {
        panel.style.maxBlockSize = `${view.height}px`;
        panel.style.overflowY = 'auto';
        panel.scrollTop = scrollTop;
        shownHeight = view.height;
      }
      x = Math.min(Math.max(x, 0), Math.max(view.width - width, 0));
      const y = Math.min(Math.max(anchor.top, 0), Math.max(view.height - shownHeight, 0));
      panel.style.left = `${x - (parseFloat(style.marginLeft) || 0)}px`;
      panel.style.top = `${y - gap}px`;
    }
  }

  /* ----- drawing --------------------------------------------------------------- */

  private renderLogo(collapsed: boolean): TemplateResult | typeof nothing {
    const full = trimmed(this.logoSrc);
    const mark = trimmed(this.logoMarkSrc);
    const src = collapsed ? mark || full : full;
    if (src === '') {
      return nothing;
    }
    const name = trimmed(this.logoLabel);
    const href = trimmed(this.logoHref);
    const image = html`<img class="logo-image" src=${src} alt=${href === '' ? name : ''} />`;
    return href === ''
      ? html`<span class="logo" data-mark=${collapsed ? 'true' : 'false'}>${image}</span>`
      : html`<a class="logo" data-mark=${collapsed ? 'true' : 'false'} href=${href} aria-label=${name === '' ? nothing : name}>${image}</a>`;
  }

  /** D-1: the `sidebar` icon is not in `nph-icon` yet, so the button keeps its place with a skeleton. */
  private renderCollapse(): TemplateResult | typeof nothing {
    if (this.hideCollapseButton || this.mode === 'mobile') {
      return nothing;
    }
    const collapsed = this.mode === 'collapsed';
    const name = trimmed(collapsed ? this.expandLabel : this.collapseLabel);
    if (name === '') {
      return nothing;
    }
    return html`<button class="toggle" id="toggle" type="button" aria-label=${name} aria-expanded=${collapsed ? 'false' : 'true'} @click=${() => this.onCollapse()}>
        <span class="toggle-place"><nph-skeleton shape="block"></nph-skeleton></span>
      </button>
      <nph-tooltip for="toggle" relation="name" .text=${name}></nph-tooltip>`;
  }

  private renderClose(): TemplateResult | typeof nothing {
    const name = trimmed(this.closeLabel);
    if (this.mode !== 'mobile' || name === '') {
      return nothing;
    }
    return html`<nph-button
      class="close"
      severity="primary"
      emphasis="ghost"
      size="default"
      icon-start="xmark"
      label=${name}
      @click=${() => this.requestClose('close-button')}
    ></nph-button>`;
  }

  private renderSearch(): TemplateResult | typeof nothing {
    const label = trimmed(this.searchLabel);
    if (this.mode === 'collapsed' || label === '') {
      return nothing;
    }
    return html`<nph-input
        class="search"
        type="search"
        icon-start="magnifying-glass"
        label=${label}
        placeholder=${trimmed(this.searchPlaceholder)}
        .value=${this.searchValue ?? ''}
        @input=${(event: Event) => this.onSearch(event)}
      ></nph-input>
      <nph-separator class="separator"></nph-separator>`;
  }

  private renderCorner(collapsed: boolean): TemplateResult | typeof nothing {
    const label = trimmed(this.cornerLabel);
    if (this.hideCornerButton || label === '') {
      return nothing;
    }
    return collapsed
      ? html`<nph-button class="corner" severity="primary" emphasis="solid" size="default" icon-start="plus" label=${label} @click=${() => this.onCorner()}></nph-button>`
      : html`<nph-button class="corner" severity="primary" emphasis="solid" size="default" text=${label} @click=${() => this.onCorner()}></nph-button>`;
  }

  /** The options of a panel: links, and the options that open the third level. */
  private renderOption(path: string, option: NphSidebarChild | NphSidebarOption, options: readonly NphSidebarOption[] | null): TemplateResult {
    const label = trimmed(option.label);
    const tooltip = trimmed(option.tooltip);
    const id = `option-${path.replace(/\//g, '-')}`;
    const balloon = tooltip !== '' && option.disabled !== true ? html`<nph-tooltip for=${id} .text=${tooltip}></nph-tooltip>` : nothing;
    if (options !== null) {
      const open = this.openThird === path;
      const holdsCurrent = options.some((candidate) => candidate.active === true);
      return html`<button
          class="option"
          id=${id}
          type="button"
          data-path=${path}
          data-opener
          data-controls=${`flyout-${path.replace(/\//g, '-')}`}
          ?data-active=${holdsCurrent}
          ?data-open=${open}
          ?disabled=${option.disabled === true}
          aria-expanded=${open ? 'true' : 'false'}
          @click=${() => this.setThird(path, !open)}
        >
          <span class="option-label">${label}</span>
          <nph-icon class="option-arrow" name="chevron-right" size="sm"></nph-icon>
        </button>
        ${balloon}${open ? this.renderFlyout(3, path, label, options.map((entry, position) => ({ path: `${path}/${position}`, option: entry, options: null }))) : nothing}`;
    }
    const disabled = option.disabled === true;
    return html`${disabled
      ? html`<a class="option" id=${id} role="link" aria-disabled="true" data-path=${path}><span class="option-label">${label}</span></a>`
      : html`<a
          class="option"
          id=${id}
          href=${trimmed(option.href)}
          data-path=${path}
          ?data-active=${option.active === true}
          aria-current=${option.active === true ? 'page' : nothing}
          @click=${() => this.closeFlyouts()}
          ><span class="option-label">${label}</span></a
        >`}${balloon}`;
  }

  /** The flyout panel: the title is the name of its opener; the third level is the same panel one level deeper. */
  private renderFlyout(
    level: 2 | 3,
    path: string,
    title: string,
    options: ReadonlyArray<{ path: string; option: NphSidebarChild | NphSidebarOption; options: readonly NphSidebarOption[] | null }>,
  ): TemplateResult {
    const id = `flyout-${path.replace(/\//g, '-')}`;
    return html`<div class="flyout" id=${id} popover="manual" role="group" aria-labelledby=${`${id}-title`} data-level=${level} data-for=${path}>
      <p class="flyout-title" id=${`${id}-title`}>${title}</p>
      ${options.map((entry) => this.renderOption(entry.path, entry.option, entry.options))}
    </div>`;
  }

  private renderRail(row: Row): TemplateResult | typeof nothing {
    if (row.kind === 'label') {
      return nothing;
    }
    const path = String(row.index);
    if (row.kind === 'link') {
      const { entry } = row;
      return html`<nph-sidebar-rail-button
        data-path=${path}
        label=${trimmed(entry.label)}
        icon=${trimmed(entry.icon)}
        href=${trimmed(entry.href) === '' ? nothing : trimmed(entry.href)}
        ?active=${entry.active === true}
        .counter=${entry.counter ?? null}
        ?disabled=${entry.disabled === true}
      ></nph-sidebar-rail-button>`;
    }
    const open = this.openSecond === path;
    return html`<nph-sidebar-rail-button
        data-path=${path}
        data-opener
        data-controls=${`flyout-${path}`}
        type="group"
        label=${trimmed(row.entry.label)}
        icon=${trimmed(row.entry.icon)}
        ?expanded=${open}
        ?disabled=${row.entry.disabled === true}
        @nph-toggle=${(event: CustomEvent<{ expanded: boolean }>) => this.onSecondToggle(event, path)}
      ></nph-sidebar-rail-button
      >${open
        ? this.renderFlyout(
            2,
            path,
            trimmed(row.entry.label),
            row.children.map((child) => ({ path: `${path}/${child.index}`, option: child.child, options: child.options })),
          )
        : nothing}`;
  }

  private renderSubitem(top: number, row: ChildRow): TemplateResult {
    const path = `${top}/${row.index}`;
    const { child, options } = row;
    if (options === null) {
      return html`<nph-sidebar-subitem
        data-path=${path}
        label=${trimmed(child.label)}
        href=${trimmed(child.href) === '' ? nothing : trimmed(child.href)}
        ?active=${child.active === true}
        ?disabled=${child.disabled === true}
        tooltip=${trimmed(child.tooltip)}
      ></nph-sidebar-subitem>`;
    }
    const open = this.openThird === path;
    return html`<nph-sidebar-subitem
        data-path=${path}
        data-opener
        data-controls=${`flyout-${top}-${row.index}`}
        label=${trimmed(child.label)}
        options
        ?expanded=${open}
        ?disabled=${child.disabled === true}
        tooltip=${trimmed(child.tooltip)}
        @nph-toggle=${(event: CustomEvent<{ expanded: boolean }>) => this.onThirdToggle(event, path)}
      ></nph-sidebar-subitem
      >${open
        ? this.renderFlyout(
            3,
            path,
            trimmed(child.label),
            options.map((option, position) => ({ path: `${path}/${position}`, option, options: null })),
          )
        : nothing}`;
  }

  private renderRow(row: Row): TemplateResult | typeof nothing {
    if (row.kind === 'label') {
      return nothing;
    }
    if (row.kind === 'link') {
      const { entry } = row;
      const hasActions = Array.isArray(entry.actions) && entry.actions.length > 0;
      return html`<nph-sidebar-item
        data-path=${String(row.index)}
        type="link"
        label=${trimmed(entry.label)}
        icon=${trimmed(entry.icon)}
        href=${trimmed(entry.href) === '' ? nothing : trimmed(entry.href)}
        ?active=${entry.active === true}
        .counter=${entry.counter ?? null}
        ?disabled=${entry.disabled === true}
        tooltip=${trimmed(entry.tooltip)}
        .actions=${hasActions ? (entry.actions as readonly NphDropdownMenuEntry[]) : []}
        actions-label=${trimmed(entry.actionsLabel)}
        @nph-item-select=${(event: CustomEvent<NphDropdownMenuItemSelectDetail>) => this.onItemSelect(event, entry.value)}
      ></nph-sidebar-item>`;
    }
    const { entry } = row;
    const hasActions = Array.isArray(entry.actions) && entry.actions.length > 0;
    const subitems = `subitems-${row.index}`;
    return html`<nph-sidebar-item
        data-path=${String(row.index)}
        data-controls=${subitems}
        type="group"
        label=${trimmed(entry.label)}
        icon=${trimmed(entry.icon)}
        ?expanded=${entry.expanded === true}
        ?disabled=${entry.disabled === true}
        tooltip=${trimmed(entry.tooltip)}
        .actions=${hasActions ? (entry.actions as readonly NphDropdownMenuEntry[]) : []}
        actions-label=${trimmed(entry.actionsLabel)}
        @nph-toggle=${(event: CustomEvent<{ expanded: boolean }>) => this.onGroupToggle(event, row)}
        @nph-item-select=${(event: CustomEvent<NphDropdownMenuItemSelectDetail>) => this.onItemSelect(event, entry.value)}
      ></nph-sidebar-item>
      <div class="subitems" id=${subitems} ?hidden=${entry.expanded !== true}>${row.children.map((child) => this.renderSubitem(row.index, child))}</div>`;
  }

  private renderSection(section: Section, collapsed: boolean): TemplateResult {
    const rows = section.rows.map((row) => (collapsed ? this.renderRail(row) : this.renderRow(row)));
    if (section.label === '') {
      return html`<div class="section">${rows}</div>`;
    }
    if (collapsed) {
      return html`<div class="section" role="group" aria-label=${section.label}>${rows}</div>`;
    }
    const id = `group-label-${section.position}`;
    return html`<div class="section" role="group" aria-labelledby=${id}>
      <p class="group-label" id=${id}>${section.label}</p>
      ${rows}
    </div>`;
  }

  /** The loading state: skeleton rows in place of the items. */
  private renderSkeleton(collapsed: boolean): TemplateResult {
    const rows = Array.from({ length: SKELETON_ROWS }, (_unused, position) => position);
    return html`<div class="skeleton" aria-hidden="true">
      ${rows.map(() =>
        collapsed
          ? html`<span class="skeleton-rail"><nph-skeleton shape="block"></nph-skeleton></span>`
          : html`<span class="skeleton-row"><nph-skeleton shape="line"></nph-skeleton></span>`,
      )}
    </div>`;
  }

  private renderList(collapsed: boolean): TemplateResult {
    if (this.loading) {
      return this.renderSkeleton(collapsed);
    }
    const error = trimmed(this.errorText);
    if (error !== '') {
      return html`<p class="message" role="alert">${error}</p>`;
    }
    if (this.empty) {
      const text = trimmed(this.emptyText);
      return text === '' ? html`` : html`<p class="message">${text}</p>`;
    }
    return html`${this.sections.map((section) => this.renderSection(section, collapsed))}`;
  }

  private renderNav(): TemplateResult {
    const collapsed = this.mode === 'collapsed';
    const name = trimmed(this.label);
    return html`<nav class="nav" aria-label=${name === '' ? nothing : name}>
      <div class="top">
        ${this.renderLogo(collapsed)}${this.renderCollapse()}${this.renderClose()}
      </div>
      <div class="middle">
        ${this.renderSearch()}
        <div class="list" aria-busy=${this.loading ? 'true' : nothing}>${this.renderList(collapsed)}</div>
      </div>
      <div class="foot">${this.renderCorner(collapsed)}</div>
    </nav>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const name = trimmed(this.label);
    if (this.mode === 'mobile') {
      return html`<dialog
        class="panel"
        aria-label=${name === '' ? nothing : name}
        @keydown=${this.onKeydown}
        @focusout=${this.onFocusout}
        @cancel=${this.onCancel}
        @close=${this.onNativeClose}
        @click=${this.onDialogClick}
      >
        ${this.renderNav()}
      </dialog>`;
    }
    return html`<div class="panel" @keydown=${this.onKeydown} @focusout=${this.onFocusout}>${this.renderNav()}</div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSidebar);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-sidebar': NphSidebar;
  }

  interface HTMLElementEventMap {
    'nph-mode-change': CustomEvent<NphSidebarModeChangeDetail>;
    'nph-group-toggle': CustomEvent<NphSidebarGroupToggleDetail>;
    'nph-search-change': CustomEvent<NphSidebarSearchChangeDetail>;
  }
}
