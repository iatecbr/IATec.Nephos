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
 *   (the third level, `label` and `href` each); `active`, `disabled`, `tooltip`, `value` and, in
 *   the panel menu, `expanded`. Two levels in the list; the third in a flyout panel, or in place
 *   in the panel menu;
 * - `mode`: `expanded` (default), `collapsed` or `mobile`. Reflects. The product chooses it;
 *   the collapse button also switches expanded and collapsed and fires `nph-mode-change`,
 *   `detail: { mode }`, which the product keeps;
 * - `navigation`: `flyout` (default, the mode above) or `panel-menu` (DSA-76, P124): the same
 *   `items`, with the third level of a child with `options` opening in place, below it, as a
 *   disclosure (the subgroup) instead of in a flyout panel. It changes how the expanded and the
 *   mobile list are drawn; the collapsed menu is the rail and its flyout panels in both. No new
 *   tag, no slot. The open groups and subgroups are the person's: they open and close by click,
 *   Enter or Space, several at once, and the group that holds the current page is born open. When the
 *   product sends a NEW current page its parent groups open again, even one the person closed; a group the
 *   person closed stays closed only while the current page is the same (DSA-76 D-3, P127);
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
 *   a group or, in the panel menu, a subgroup (the `value` of the child), and `nph-item-select`, the action chosen in the more actions of an item, with
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

/** How the third level opens: in a flyout panel at the side (default) or in place, in the panel menu (DSA-76). */
export const NPH_SIDEBAR_NAVIGATION_MODES = ['flyout', 'panel-menu'] as const;
export type NphSidebarNavigation = (typeof NPH_SIDEBAR_NAVIGATION_MODES)[number];

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
  /** The third level: in a flyout panel next to it, or in place below it in the panel menu. Not with `href` or `active`. */
  options?: readonly NphSidebarOption[];
  /** The panel menu only: the subgroup opened. Absent: born open when it holds the current page. */
  expanded?: boolean;
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

/** The longest time in a computed `transition-duration` list, in milliseconds. */
function longestDuration(value: string): number {
  let longest = 0;
  for (const part of value.split(',')) {
    const text = part.trim();
    const amount = Number.parseFloat(text);
    if (Number.isFinite(amount)) {
      longest = Math.max(longest, text.endsWith('ms') ? amount : amount * 1000);
    }
  }
  return longest;
}

/** The phases of a block of the panel menu that grows in place (the machine of `nph-collapsible`, P121). */
type Phase = 'closed' | 'opening' | 'open' | 'closing';

/** A block of the panel menu that opens in place: a group of the first level, or a subgroup of the second. */
interface Block {
  key: string;
  /** The `expanded` the product wrote, when it wrote one. */
  data: boolean | undefined;
  /** Whether the current page is inside it. */
  holdsCurrent: boolean;
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
    /* `navigation` does not reflect: the CSS reads the markup the panel menu draws, not the host. */
    navigation: { type: String },
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
  declare navigation: NphSidebarNavigation;
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
  private previousNavigation: NphSidebarNavigation | undefined;
  /*
   * The panel menu: which groups and subgroups are open is the person's, so it survives a new `items`
   * (the product sends one at every navigation, to move `active`). `openRecord` is the state, by key;
   * `lastData` is the `expanded` the product wrote the last time, to tell a new instruction from a repeat.
   */
  private openRecord = new Map<string, boolean>();
  private lastData = new Map<string, boolean | undefined>();
  /** The identity of the current page the menu saw last: a different one is a new page (DSA-76 D-3). */
  private lastCurrent: string | null = null;
  /* The blocks that grow in place: what each one showed, the phase while it moves, and the end of the move. */
  private shownOpen = new Map<string, boolean>();
  private phases = new Map<string, Phase>();
  private settleTimers = new Map<string, number>();
  private turning = new Set<string>();

  constructor() {
    super();
    this.mode = 'expanded';
    this.navigation = 'flyout';
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
    for (const timer of this.settleTimers.values()) {
      clearTimeout(timer);
    }
    this.settleTimers.clear();
    this.phases.clear();
    this.turning.clear();
    this.shownOpen.clear();
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
    const navigation = this.navigation ?? '';
    if (!oneOf(NPH_SIDEBAR_NAVIGATION_MODES, navigation)) {
      causes.push(`navigation "${navigation}" does not exist. Use ${NPH_SIDEBAR_NAVIGATION_MODES.join(', ')}.`);
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
    this.valid = oneOf(NPH_SIDEBAR_MODES, mode) && oneOf(NPH_SIDEBAR_NAVIGATION_MODES, navigation);
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);

    if (changed.has('mode') || changed.has('items') || changed.has('navigation')) {
      this.syncFlyoutState(changed.has('mode') || changed.has('navigation'));
    }
    if (this.valid && this.navigation === 'panel-menu') {
      this.syncPanelMenu();
    }
  }

  /** The panels follow the mode and the list: a path that no longer exists is closed. */
  private syncFlyoutState(modeChanged: boolean): void {
    if (modeChanged) {
      /* A change of mode, or of the way the third level opens, closes the panels. */
      if (
        (this.previousMode !== undefined && this.previousMode !== this.mode) ||
        (this.previousNavigation !== undefined && this.previousNavigation !== this.navigation)
      ) {
        this.openSecond = null;
        this.openThird = null;
      }
      this.previousMode = this.mode;
      this.previousNavigation = this.navigation;
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

  /* ----- the panel menu: which blocks are open (DSA-76, P124) ------------------- */

  private static groupKey(row: Row & { kind: 'group' }): string {
    const value = trimmed(row.entry.value);
    return `group:${value === '' ? row.index : value}`;
  }

  private static subgroupKey(group: string, child: ChildRow): string {
    const value = trimmed(child.child.value);
    return `${group}/${value === '' ? child.index : value}`;
  }

  /** The current page is in this child: the child itself, or one of its options. */
  private static holdsCurrent(child: ChildRow): boolean {
    return child.options === null ? child.child.active === true : child.options.some((option) => option.active === true);
  }

  /** What names a leaf of the list across a new `items`: its `value`, else its `href`, else its position. */
  private static leafId(value: string | undefined, href: string | undefined, index: number): string {
    const named = trimmed(value);
    if (named !== '') return `v:${named}`;
    const link = trimmed(href);
    return link !== '' ? `h:${link}` : `i:${index}`;
  }

  /**
   * The current page inside a group, as an identity that survives a new `items` (the product sends one at every
   * navigation), or `null` when no page of a group is current. The first one wins.
   */
  private currentPage(): string | null {
    for (const section of this.sections) {
      for (const row of section.rows) {
        if (row.kind !== 'group') {
          continue;
        }
        const group = NphSidebar.groupKey(row);
        for (const child of row.children) {
          const at = NphSidebar.leafId(child.child.value, child.child.href, child.index);
          if (child.options === null) {
            if (child.child.active === true) return `${group}/${at}`;
          } else {
            for (const [position, option] of child.options.entries()) {
              if (option.active === true) return `${group}/${at}/${NphSidebar.leafId(option.value, option.href, position)}`;
            }
          }
        }
      }
    }
    return null;
  }

  private panelBlocks(): Block[] {
    const blocks: Block[] = [];
    const written = (value: unknown): boolean | undefined => (typeof value === 'boolean' ? value : undefined);
    for (const section of this.sections) {
      for (const row of section.rows) {
        if (row.kind !== 'group') {
          continue;
        }
        const key = NphSidebar.groupKey(row);
        blocks.push({ key, data: written(row.entry.expanded), holdsCurrent: row.children.some((child) => NphSidebar.holdsCurrent(child)) });
        for (const child of row.children) {
          if (child.options !== null) {
            blocks.push({ key: NphSidebar.subgroupKey(key, child), data: written(child.child.expanded), holdsCurrent: NphSidebar.holdsCurrent(child) });
          }
        }
      }
    }
    return blocks;
  }

  /**
   * The open state of the panel menu survives a new `items`: the product sends one at every navigation to
   * move `active`. The order, for each group and subgroup: an `expanded` the product writes (and changes) seeds
   * it; a NEW current page opens the blocks that hold it, even the ones the person closed (DSA-76 D-3: a group
   * the person closed stays closed only while the current page is the same); with neither, what the person did
   * stays, and a block that holds the current page is born open. The opening is not a choice of the person: it
   * fires no `nph-group-toggle`.
   */
  private syncPanelMenu(): void {
    const live = new Set<string>();
    const current = this.currentPage();
    /* A moment with no current page (the product is loading) is not a new page when the same one comes back. */
    const arrived = current !== null && current !== this.lastCurrent;
    if (current !== null) {
      this.lastCurrent = current;
    }
    for (const block of this.panelBlocks()) {
      live.add(block.key);
      if (block.data !== undefined && block.data !== this.lastData.get(block.key)) {
        this.openRecord.set(block.key, block.data);
      } else if (block.holdsCurrent && (arrived || !this.openRecord.has(block.key))) {
        this.openRecord.set(block.key, true);
      }
      this.lastData.set(block.key, block.data);
      const open = this.openRecord.get(block.key) === true;
      const before = this.shownOpen.get(block.key);
      this.shownOpen.set(block.key, open);
      if (before !== undefined && before !== open) {
        this.startMoving(block.key, open);
      }
    }
    for (const key of [...this.shownOpen.keys()]) {
      if (!live.has(key)) {
        this.shownOpen.delete(key);
        this.stopMoving(key);
      }
    }
  }

  private isOpen(key: string): boolean {
    return this.openRecord.get(key) === true;
  }

  private phaseOf(key: string): Phase {
    return this.phases.get(key) ?? (this.isOpen(key) ? 'open' : 'closed');
  }

  private blockElement(key: string): HTMLElement | null {
    return [...this.renderRoot.querySelectorAll<HTMLElement>('.block')].find((block) => block.dataset['block'] === key) ?? null;
  }

  /** The block grows or shrinks in place when it was already drawn and the browser resolves a duration; otherwise it just changes. */
  private startMoving(key: string, open: boolean): void {
    this.stopMoving(key);
    const block = this.blockElement(key);
    if (block === null || !(longestDuration(getComputedStyle(block).transitionDuration) > 0)) {
      return;
    }
    this.phases.set(key, open ? 'opening' : 'closing');
    this.turning.add(key);
  }

  private stopMoving(key: string): void {
    const timer = this.settleTimers.get(key);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.settleTimers.delete(key);
    }
    this.phases.delete(key);
    this.turning.delete(key);
  }

  /** The move is over: the block is steady, open or closed. */
  private settle(key: string): void {
    if (this.phases.has(key)) {
      this.stopMoving(key);
      this.requestUpdate();
    }
  }

  private onBlockEnd(event: TransitionEvent, key: string): void {
    if (event.target === event.currentTarget && event.propertyName === 'grid-template-rows') {
      this.settle(key);
    }
  }

  /** A safety net for the end of the move: a transition never ends in a box that is not rendered. */
  private settleSoon(): void {
    for (const key of this.phases.keys()) {
      if (!this.settleTimers.has(key)) {
        const block = this.blockElement(key);
        const wait = block === null ? 0 : longestDuration(getComputedStyle(block).transitionDuration);
        this.settleTimers.set(key, window.setTimeout(() => this.settle(key), wait + 50));
      }
    }
  }

  /**
   * The arrow of a subgroup and the arrow of a first-level group turn 180 degrees as the block moves: the new arrow
   * comes in from the old one's side (DSA-76 D-2, so the menu has one behavior). The subgroup is a button of this
   * menu; the arrow of the group is in the shadow root of its `nph-sidebar-item`, which is open (P01), so the menu
   * turns it from here with the duration and the curve of the block. The item gets no property for it: the
   * flyout navigation keeps the swap without turning.
   */
  private turnArrows(): void {
    for (const key of this.turning) {
      const block = this.blockElement(key);
      let arrow: HTMLElement | null | undefined;
      if (key.includes('/')) {
        const button = [...this.renderRoot.querySelectorAll<HTMLElement>('.subgroup')].find((candidate) => candidate.dataset['key'] === key);
        arrow = button?.querySelector<HTMLElement>('.subgroup-arrow');
      } else {
        const item = block?.closest('.entry')?.querySelector<HTMLElement>(':scope > nph-sidebar-item');
        arrow = item?.shadowRoot?.querySelector<HTMLElement>('.arrow');
      }
      if (arrow !== null && arrow !== undefined && block !== null && typeof arrow.animate === 'function') {
        const style = getComputedStyle(block);
        arrow.animate([{ transform: 'rotate(180deg)' }, { transform: 'rotate(0deg)' }], {
          duration: longestDuration(style.transitionDuration),
          easing: style.transitionTimingFunction.split(/,(?![^(]*\))/)[0]?.trim() ?? 'ease',
        });
      }
    }
    this.turning.clear();
  }

  /** The person opened or closed a group or a subgroup of the panel menu: the choice is kept, the product is told. */
  private onPanelToggle(key: string, value: string | undefined, expanded: boolean): void {
    this.openRecord.set(key, expanded);
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent<NphSidebarGroupToggleDetail>(NPH_SIDEBAR_GROUP_TOGGLE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { value: trimmed(value), expanded },
      }),
    );
  }

  /* ----- the layers ------------------------------------------------------------ */

  protected override updated(): void {
    this.wireControls();
    this.settleSoon();
    this.turnArrows();
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

  /** The collapse button draws the `sidebar` icon (DSA-72 D-1, answered on 16/11/2026). */
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
        <span class="toggle-place"><nph-icon name="sidebar" size="md"></nph-icon></span>
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
        ?active=${row.children.some((child) => NphSidebar.holdsCurrent(child))}
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

  /** The panel menu draws the expanded and the mobile list; the collapsed menu is the rail in both navigation modes. */
  private panelMenu(collapsed: boolean): boolean {
    return !collapsed && this.navigation === 'panel-menu';
  }

  /** A block that grows in place: the grid track, the clip and the content that `aria-controls` points to. */
  private renderBlock(key: string, id: string, children: unknown): TemplateResult {
    const phase = this.phaseOf(key);
    return html`<div class="block" data-block=${key} data-state=${phase} @transitionend=${(event: TransitionEvent) => this.onBlockEnd(event, key)}>
      <div class="clip">
        <div class="content" id=${id} ?hidden=${phase === 'closed'} ?inert=${phase === 'closing'}>
          <div class="nest">
            <span class="guide" aria-hidden="true"></span>
            <div class="column">${children}</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  /** A level-two entry of the panel menu: a subitem, or the subgroup that opens its options in place. */
  private renderPanelChild(top: number, groupKey: string, child: ChildRow): TemplateResult {
    if (child.options === null) {
      return this.renderSubitem(top, child);
    }
    const path = `${top}/${child.index}`;
    const key = NphSidebar.subgroupKey(groupKey, child);
    const open = this.isOpen(key);
    const id = `subgroup-${top}-${child.index}`;
    const disabled = child.child.disabled === true;
    const tooltip = trimmed(child.child.tooltip);
    return html`<div class="entry">
      <button
        class="subgroup"
        id=${id}
        type="button"
        data-path=${path}
        data-key=${key}
        ?data-open=${open}
        ?disabled=${disabled}
        aria-expanded=${open ? 'true' : 'false'}
        aria-controls=${`block-${top}-${child.index}`}
        @click=${() => this.onPanelToggle(key, child.child.value, !open)}
      >
        <span class="subgroup-label">${trimmed(child.child.label)}</span>
        <nph-icon class="subgroup-arrow" name=${open ? 'chevron-up' : 'chevron-down'} size="sm"></nph-icon>
      </button>
      ${tooltip !== '' && !disabled ? html`<nph-tooltip for=${id} side="right" .text=${tooltip}></nph-tooltip>` : nothing}
      ${this.renderBlock(
        key,
        `block-${top}-${child.index}`,
        child.options.map(
          (option, position) => html`<nph-sidebar-subitem
            data-path=${`${path}/${position}`}
            label=${trimmed(option.label)}
            href=${trimmed(option.href) === '' ? nothing : trimmed(option.href)}
            ?active=${option.active === true}
            ?disabled=${option.disabled === true}
            tooltip=${trimmed(option.tooltip)}
          ></nph-sidebar-subitem>`,
        ),
      )}
    </div>`;
  }

  /** A first-level entry of the panel menu: a link as in the flyout navigation, a group whose children open in place. */
  private renderPanelRow(row: Row): TemplateResult | typeof nothing {
    if (row.kind !== 'group') {
      return this.renderRow(row);
    }
    const { entry } = row;
    const key = NphSidebar.groupKey(row);
    const id = `block-${row.index}`;
    const hasActions = Array.isArray(entry.actions) && entry.actions.length > 0;
    return html`<div class="entry">
      <nph-sidebar-item
        data-path=${String(row.index)}
        data-controls=${id}
        type="group"
        label=${trimmed(entry.label)}
        icon=${trimmed(entry.icon)}
        ?expanded=${this.isOpen(key)}
        ?disabled=${entry.disabled === true}
        tooltip=${trimmed(entry.tooltip)}
        .actions=${hasActions ? (entry.actions as readonly NphDropdownMenuEntry[]) : []}
        actions-label=${trimmed(entry.actionsLabel)}
        @nph-toggle=${(event: CustomEvent<{ expanded: boolean }>) => {
          event.stopPropagation();
          this.onPanelToggle(key, entry.value, event.detail.expanded);
        }}
        @nph-item-select=${(event: CustomEvent<NphDropdownMenuItemSelectDetail>) => this.onItemSelect(event, entry.value)}
      ></nph-sidebar-item>
      ${this.renderBlock(
        key,
        id,
        row.children.map((child) => this.renderPanelChild(row.index, key, child)),
      )}
    </div>`;
  }

  private renderSection(section: Section, collapsed: boolean): TemplateResult {
    const panel = this.panelMenu(collapsed);
    const items = section.rows.map((row) => (collapsed ? this.renderRail(row) : panel ? this.renderPanelRow(row) : this.renderRow(row)));
    /* The panel menu keeps the rows in a column of their own, so the gap to the label is the one of the token. */
    const rows = panel ? html`<div class="rows">${items}</div>` : items;
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
    if (this.panelMenu(collapsed)) {
      /* The panel menu: one row per first-level item, an icon place and a text line, with no section label. */
      const items = this.sections.reduce((total, section) => total + section.rows.length, 0);
      const rows = Array.from({ length: items === 0 ? SKELETON_ROWS : items }, (_unused, position) => position);
      return html`<div class="skeleton" data-navigation="panel-menu" aria-hidden="true">
        ${rows.map(
          () =>
            html`<span class="panel-skeleton-row"
              ><span class="panel-skeleton-icon"><nph-skeleton shape="block"></nph-skeleton></span><nph-skeleton shape="line"></nph-skeleton
            ></span>`,
        )}
      </div>`;
    }
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
        <div class="list" data-navigation=${this.panelMenu(collapsed) ? 'panel-menu' : nothing} aria-busy=${this.loading ? 'true' : nothing}>
          ${this.renderList(collapsed)}
        </div>
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
