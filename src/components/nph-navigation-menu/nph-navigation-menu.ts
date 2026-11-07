/**
 * `nph-navigation-menu` — the main navigation bar: top items that are links or triggers, and a panel
 * with grouped links under each trigger.
 *
 * Contract accepted in Figma (documentation frame `3977:7913`, sets `3969:7897`, `3957:6662` and
 * `3957:6722`), recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-62, sheet
 * `fichas/nph-navigation-menu.md`, `design.md` and decision P110 — nph-navigation-menu: API and
 * semantics:
 * - `items`: the top items of the bar, in order. Property only. A link item is `{ label, href }`; a
 *   trigger item is `{ type: 'trigger', label, groups }`, and each group is `{ label?, links }`, each
 *   link `{ title, href, description?, icon? }`. How many items, groups and links there are is
 *   composition, as the evidence says. Texts are already localized by the consuming application;
 * - `current` on a link (top link or panel link): the page the person is on. One per menu. A trigger
 *   is shown as current when its panel holds the current link (the Figma `state=atual` of the top
 *   item); the code derives it, so there is only one place that says where the person is;
 * - `disabled` on an item or a link: `state/disabled-opacity` on the whole item, out of the Tab order;
 * - `narrow` (the Figma `largura=estreita`): the bar turns into the Menu button, which opens the same
 *   items as a vertical list. Reflects. The consumer chooses it, since the width is the page's to
 *   know: the piece does not measure itself (the rule of `collapsed` of `nph-breadcrumb`, P109);
 * - `open` (the Figma `aberto=sim`): wide, the panel of the active trigger is shown; narrow, the list
 *   is shown. Reflects. The piece turns it on and off, and the consumer may set it. `active` is the
 *   `value` of the trigger whose panel `open` shows (a trigger without `value` has its index, as
 *   text); without it, `open` shows the first trigger that is not disabled;
 * - `label` and the host `aria-label`: the accessible name of the navigation landmark;
 * - `menu-label`: the accessible name of the Menu button (the text "Menu"), required when narrow,
 *   because the icon has no text;
 * - no slot, no event, no `::part` and no color property. A link fires nothing of its own: the click is
 *   the native `click`.
 *
 * SEMANTICS — disclosure navigation, not a menubar: a `nav` with a name; each trigger is a native
 * `button` with `aria-expanded` and `aria-controls`, and the link of the current page carries
 * `aria-current="page"` (`true` on a trigger that holds it). Tab moves between the items, Enter and
 * Space open and close a panel, Esc closes it and gives the focus back to its trigger. There are no
 * arrow keys: the panel is part of the page's Tab order, right after its trigger. The arrow of a
 * trigger and the icon of a link are decorative and hidden from assistive technology. The Menu button
 * is a native `button` with `aria-label` and `aria-expanded`, as P110 records.
 *
 * LAYER — the panel is a `popover="manual"`, so it lives in the top layer, as the balloon of
 * `nph-tooltip` and the panel of `nph-dropdown-menu`: no `z-index` and no clipping by an ancestor.
 * It opens `navigation-menu/panel-offset` below its trigger, aligned to the start edge, never leaves
 * the window sideways and follows the trigger on scroll and resize. The wide panel hugs its content;
 * the narrow panel and the panel link are `navigation-menu/panel-width` wide.
 *
 * POINTER — a trigger opens its panel when the mouse rests on it for `motion/hover-delay`, and the
 * panel closes the same time after the pointer leaves the trigger and the panel; while the pointer is
 * over either, it stays. A click on a trigger the pointer opened keeps it open until another click.
 * Touch and pen open it by click only.
 *
 * Invalid input draws nothing and emits `console.error` only in development, one per cause (P66 rule):
 * `items` that is not a list or is empty; an item or a link without its text; a link without `href`
 * or with a protocol other than `http:`, `https:`, `mailto:` or `tel:`; a trigger without groups or
 * with a group without links; an `icon` outside the core; two triggers with the same `value`; more
 * than one current link; a narrow bar without `menu-label`. A bar with no accessible name draws and
 * warns: the name may arrive after the first render.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import '../nph-separator/nph-separator';
import '../nph-tooltip/nph-tooltip';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import navigationMenuCss from './nph-navigation-menu.css?inline';

const TAG = 'nph-navigation-menu';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The `id` of the Menu button, which its tooltip finds by `for`. */
const MENU_BUTTON_ID = 'menu-button';

/** The protocols a link may take; a relative path and a fragment resolve to the page's. */
export const NPH_NAVIGATION_MENU_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'] as const;

/**
 * Whether an address may be the `href` of a link. It is parsed as the browser would — tabs and line
 * breaks inside the scheme are dropped — so `java\nscript:` is caught as `javascript:` (the same rule
 * as `nph-breadcrumb` and the link cell of `nph-table`).
 */
export function isSafeHref(href: string): boolean {
  try {
    return (NPH_NAVIGATION_MENU_LINK_PROTOCOLS as readonly string[]).includes(new URL(href, document.baseURI).protocol);
  } catch {
    return false;
  }
}

/** A link of a panel: the Figma `link do painel`. */
export interface NphNavigationMenuLink {
  /** The title, on one line. Already localized. */
  title: string;
  /** The page the link leads to. Required, unless the link is disabled. */
  href?: string;
  /** The second line, optional. */
  description?: string;
  /** A core name of `nph-icon`, at the start. Absent or empty: no icon. */
  icon?: string;
  /** The page the person is on. At most one in the menu. */
  current?: boolean;
  disabled?: boolean;
}

/** A group of links of a panel, with its optional label. */
export interface NphNavigationMenuGroup {
  /** The name of the group, already localized. Absent: the group has no label. */
  label?: string;
  links: readonly NphNavigationMenuLink[];
}

/** A top item that goes straight to a page: the Figma `tipo=link`. */
export interface NphNavigationMenuTopLink {
  type?: 'link';
  label: string;
  href?: string;
  current?: boolean;
  disabled?: boolean;
}

/** A top item that opens a panel: the Figma `tipo=gatilho`. */
export interface NphNavigationMenuTrigger {
  type: 'trigger';
  label: string;
  /** Names the trigger for `active`. Absent: its index in `items`, as text. */
  value?: string;
  groups: readonly NphNavigationMenuGroup[];
  disabled?: boolean;
}

export type NphNavigationMenuItem = NphNavigationMenuTopLink | NphNavigationMenuTrigger;

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
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

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** `300ms` or `0.3s` in milliseconds; `NaN` when it is not a time. */
function milliseconds(value: string): number {
  const match = /^\s*(-?\d*\.?\d+)\s*(ms|s)\s*$/.exec(value);
  if (match === null) return Number.NaN;
  return Number.parseFloat(match[1] as string) * (match[2] === 's' ? 1000 : 1);
}

/** A top link drawn in the narrow list takes the shape of a panel link: its label is the title. */
function topLinkAsPanelLink(link: NphNavigationMenuTopLink): NphNavigationMenuLink {
  return {
    title: link.label,
    ...(link.href === undefined ? {} : { href: link.href }),
    ...(link.current === undefined ? {} : { current: link.current }),
    ...(link.disabled === undefined ? {} : { disabled: link.disabled }),
  };
}

function isTrigger(item: NphNavigationMenuItem): item is NphNavigationMenuTrigger {
  return item.type === 'trigger';
}

/** A section of the narrow list: a run of top links, or one trigger and its groups. */
type Section =
  | { kind: 'links'; links: readonly NphNavigationMenuTopLink[] }
  | { kind: 'trigger'; trigger: NphNavigationMenuTrigger; index: number };

export class NphNavigationMenu extends LitElement {
  static override styles = unsafeCSS(navigationMenuCss);

  static override properties = {
    items: { attribute: false },
    narrow: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
    active: { type: String },
    label: { type: String },
    menuLabel: { type: String, attribute: 'menu-label' },
    /* The host `aria-label` is the accessible name when there is no `label`. It cannot be a property
     * called `ariaLabel`: that name is the native ARIA reflection of every element. */
    hostName: { type: String, attribute: 'aria-label' },
  };

  /** The top items of the bar, in order. */
  declare items: readonly NphNavigationMenuItem[];

  /** The Menu button instead of the bar. */
  declare narrow: boolean;

  /** The panel of the active trigger (wide) or the list (narrow) is shown. */
  declare open: boolean;

  /** The `value` of the trigger whose panel `open` shows. */
  declare active: string | null;

  /** The accessible name of the navigation landmark. Already localized. */
  declare label: string | null;

  /** The accessible name of the Menu button. Required when narrow. Already localized. */
  declare menuLabel: string | null;

  /** The host `aria-label`, the accessible name when `label` is not given. */
  declare hostName: string | null;

  private problem: string | null = null;
  private reported = '';
  private warnedNoName = false;
  private warnedDelay = false;
  /** True once a click or a key has opened the panel: the pointer leaving no longer closes it. */
  private pinned = false;
  private hoverTimer: number | undefined;
  private listening = false;
  private pressing = false;
  private readonly scrollTargets: EventTarget[] = [];
  private resizeObserver: ResizeObserver | undefined;
  private lastShown: string | null = null;

  constructor() {
    super();
    this.items = [];
    this.narrow = false;
    this.open = false;
    this.active = null;
    this.label = null;
    this.menuLabel = null;
    this.hostName = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* The browser closed the popover when the element left the page: draw it again if `open` is still on. */
    this.lastShown = null;
    this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearHoverTimer();
    this.stopListening();
  }

  protected override willUpdate(changed: PropertyValues): void {
    this.problem = this.validate();
    if (this.problem !== null) {
      /* One message per cause: a re-render with the same input stays silent. */
      if (this.problem !== this.reported) {
        devError(this.problem);
      }
      this.reported = this.problem;
    } else {
      this.reported = '';
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.problem === null);
    /* A bar that is rejected waits for no one: a hover wait that is running would read the rejected data. */
    if (this.problem !== null) this.clearHoverTimer();
    /* A bar that changes width while open closes: what was open no longer exists in the other shape. */
    if (changed.has('narrow') && changed.get('narrow') !== undefined) {
      /* A hover wait that was running belongs to the other shape: it must not open the new one. */
      this.clearHoverTimer();
      if (this.open) {
        this.open = false;
        this.pinned = false;
      }
    }
    if (!this.open) {
      this.pinned = false;
    }
  }

  protected override updated(): void {
    if (this.problem === null && this.name() === null) {
      if (!this.warnedNoName) {
        this.warnedNoName = true;
        devWarn('the bar has no accessible name. Give it a `label` or an `aria-label`.');
      }
    } else {
      this.warnedNoName = false;
    }
    this.syncPanels();
  }

  /* ----- validation ----------------------------------------------------------- */

  /** The reason the input is invalid, or `null`. */
  private validate(): string | null {
    const items = this.items;
    if (!Array.isArray(items)) {
      return 'items is not a list. Give it the top items of the bar.';
    }
    if (items.length === 0) {
      return 'items is empty. A navigation menu has at least one item. Set it from JavaScript.';
    }
    const values = new Set<string>();
    let current = 0;
    const checkLink = (link: unknown, where: string, panel: boolean): string | null => {
      if (link === null || typeof link !== 'object') return `${where} is not an object.`;
      const entry = link as Record<string, unknown>;
      if (text(panel ? entry.title : entry.label) === '') {
        return `${where} has no \`${panel ? 'title' : 'label'}\`.`;
      }
      const href = text(entry.href);
      if (entry.disabled !== true) {
        if (href === '') return `${where} is a link and needs an \`href\`: the page it leads to.`;
        if (!isSafeHref(href)) {
          return `${where} has an unsafe \`href\`. A link takes ${NPH_NAVIGATION_MENU_LINK_PROTOCOLS.join(', ')} or a relative address.`;
        }
      } else if (href !== '' && !isSafeHref(href)) {
        return `${where} has an unsafe \`href\`. A link takes ${NPH_NAVIGATION_MENU_LINK_PROTOCOLS.join(', ')} or a relative address.`;
      }
      const icon = text(entry.icon);
      if (icon !== '' && !isCoreName(icon)) {
        return `icon "${icon}" of ${where} does not belong to the Nephos core.`;
      }
      if (entry.current === true) current += 1;
      return null;
    };
    for (const [index, item] of items.entries()) {
      const where = `item ${String(index + 1)}`;
      if (item === null || typeof item !== 'object') return `${where} is not an object.`;
      const type = (item as { type?: unknown }).type;
      if (type !== undefined && type !== 'link' && type !== 'trigger') {
        return `${where} has type "${String(type)}". An item is a \`link\` or a \`trigger\`.`;
      }
      if (type !== 'trigger') {
        const problem = checkLink(item, where, false);
        if (problem !== null) return problem;
        continue;
      }
      const trigger = item as NphNavigationMenuTrigger;
      if (text(trigger.label) === '') return `${where} has no \`label\`.`;
      const value = text(trigger.value) === '' ? String(index) : text(trigger.value);
      if (values.has(value)) return `${where} repeats the trigger \`value\` "${value}". Each trigger has its own.`;
      values.add(value);
      if (!Array.isArray(trigger.groups) || trigger.groups.length === 0) {
        return `${where} is a trigger and needs \`groups\`: the links of its panel.`;
      }
      for (const [groupIndex, group] of trigger.groups.entries()) {
        const groupWhere = `group ${String(groupIndex + 1)} of ${where}`;
        if (group === null || typeof group !== 'object' || !Array.isArray(group.links) || group.links.length === 0) {
          return `${groupWhere} has no \`links\`.`;
        }
        for (const [linkIndex, link] of group.links.entries()) {
          const problem = checkLink(link, `link ${String(linkIndex + 1)} of ${groupWhere}`, true);
          if (problem !== null) return problem;
        }
      }
    }
    if (current > 1) {
      return `${String(current)} links are \`current\`. A menu has one current page.`;
    }
    if (this.narrow && text(this.menuLabel) === '') {
      return 'a narrow bar needs `menu-label`: it is the accessible name of the Menu button.';
    }
    return null;
  }

  /** The accessible name of the landmark: the label, else the host `aria-label`. `null` when there is none. */
  private name(): string | null {
    const label = text(this.label);
    if (label !== '') return label;
    const host = text(this.hostName);
    return host === '' ? null : host;
  }

  /* ----- state ---------------------------------------------------------------- */

  /** The value of a trigger: its own, or its index in `items` as text. */
  private triggerValue(item: NphNavigationMenuItem, index: number): string {
    return isTrigger(item) && text(item.value) !== '' ? text(item.value) : String(index);
  }

  /** The trigger whose panel is shown (wide), as its index, or `null`. */
  private shownIndex(): number | null {
    if (this.problem !== null || this.narrow || !this.open) return null;
    const wanted = text(this.active);
    let first: number | null = null;
    for (const [index, item] of this.items.entries()) {
      if (!isTrigger(item)) continue;
      /* A disabled trigger never shows its panel, whether `active` names it or it was disabled while open. */
      if (this.triggerValue(item, index) === wanted && wanted !== '') return item.disabled === true ? null : index;
      if (first === null && item.disabled !== true) first = index;
    }
    return first;
  }

  /** The panel of the narrow list is shown. */
  private listShown(): boolean {
    return this.problem === null && this.narrow && this.open;
  }

  private clearHoverTimer(): void {
    if (this.hoverTimer !== undefined) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = undefined;
    }
  }

  /** The wait before a panel opens or closes by pointer: the `motion/hover-delay` token. */
  private hoverDelay(): number {
    const delay = milliseconds(getComputedStyle(this).getPropertyValue('--nph-motion-hover-delay'));
    if (Number.isNaN(delay)) {
      if (!this.warnedDelay) {
        this.warnedDelay = true;
        devError('motion/hover-delay is not defined (load tokens.css); the panel opens and closes on hover with no wait.');
      }
      return 0;
    }
    return delay;
  }

  private openPanel(index: number, pinned: boolean): void {
    const item = this.items[index];
    if (item === undefined) return;
    this.active = this.triggerValue(item, index);
    this.open = true;
    this.pinned = pinned;
  }

  private closePanel(): void {
    this.clearHoverTimer();
    this.open = false;
    this.pinned = false;
  }

  /** Esc, or a choice that ends the visit: closed, and the focus back on the control that opened it. */
  private closeToControl(): void {
    const control = this.narrow
      ? this.renderRoot.querySelector<HTMLElement>('.menu-button')
      : this.renderRoot.querySelector<HTMLElement>(`#trigger-${String(this.shownIndex())}`);
    const inside = this.shadowRoot?.activeElement != null;
    this.closePanel();
    if (inside) control?.focus();
  }

  private onTriggerClick(index: number, event: MouseEvent): void {
    this.clearHoverTimer();
    const shown = this.shownIndex();
    if (shown === index) {
      /* A click on a panel the pointer opened keeps it open; a click on one a click opened closes it. */
      if (!this.pinned && event.detail > 0) {
        this.pinned = true;
      } else {
        this.closePanel();
      }
      return;
    }
    this.openPanel(index, true);
  }

  /** The focus is on a link inside a panel: what a person who tabbed in must not lose to the pointer. */
  private focusInPanel(): boolean {
    const focused = this.shadowRoot?.activeElement ?? null;
    return focused !== null && focused.closest('.panel') !== null;
  }

  private onEntryEnter(index: number, event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    const item = this.items[index];
    /* A disabled trigger is not there for the pointer: it neither opens nor cancels a close that is running. */
    if (this.problem !== null || item === undefined || item.disabled === true) return;
    this.clearHoverTimer();
    if (this.shownIndex() === index) return;
    /* The wait belongs to the trigger that started it, by its value: a list that is reordered or replaced
     * meanwhile opens that trigger where it is now, and nothing if it is gone or disabled. */
    const value = this.triggerValue(item, index);
    this.hoverTimer = window.setTimeout(() => {
      this.hoverTimer = undefined;
      if (this.problem !== null || this.focusInPanel()) return;
      const now = this.enabledTriggerIndex(value);
      if (now !== null) this.openPanel(now, false);
    }, this.hoverDelay());
  }

  private onEntryLeave(index: number, event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    const item = this.items[index];
    if (this.problem !== null || item === undefined || item.disabled === true) return;
    this.clearHoverTimer();
    if (this.shownIndex() !== index || this.pinned) return;
    /* The panel that is open is followed by its trigger's value, as the wait to open is. */
    const value = this.triggerValue(item, index);
    const selected = this.active;
    this.hoverTimer = window.setTimeout(() => {
      this.hoverTimer = undefined;
      if (this.problem !== null || this.pinned) return;
      /* The consumer chose another panel during the wait: this close was for the one that was open. */
      if (this.active !== selected) return;
      const now = this.enabledTriggerIndex(value);
      if (now === null) {
        /* The trigger that was open is gone or disabled: nothing is left to keep open for it. */
        if (this.open) this.closePanel();
        return;
      }
      /* Another panel is open now (the consumer changed `active`): it is not this wait's to close. */
      if (this.shownIndex() !== now) return;
      /* A person who tabbed into the panel keeps it: the pointer leaving must not take the focused link away. */
      if (this.focusInPanel()) return;
      this.closePanel();
    }, this.hoverDelay());
  }

  /** The index of the enabled trigger with this value, or `null`. */
  private enabledTriggerIndex(value: string): number | null {
    if (!Array.isArray(this.items)) return null;
    for (const [index, item] of this.items.entries()) {
      if (isTrigger(item) && item.disabled !== true && this.triggerValue(item, index) === value) return index;
    }
    return null;
  }

  private onMenuClick(): void {
    if (this.open) {
      this.closePanel();
    } else {
      this.open = true;
      this.pinned = true;
    }
  }

  /** A link that is followed ends the visit. The click itself goes on as the browser would have it. */
  private onLinkClick(event: MouseEvent): void {
    if ((event.currentTarget as HTMLElement).getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      return;
    }
    this.closePanel();
  }

  /** A press inside the bar: the focus that leaves with no target is a click on its padding, not a leave. */
  private onPress = (): void => {
    this.pressing = true;
    window.setTimeout(() => {
      this.pressing = false;
    }, 0);
  };

  private onFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next === null) {
      /* The focus left to nowhere (a `blur()`, another window): the bar was left, unless it is a click inside. */
      if (!this.pressing) this.closePanel();
      return;
    }
    if (!this.contains(next) && !(this.shadowRoot?.contains(next) ?? false)) {
      this.closePanel();
    }
  };

  private onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.open) return;
    /* The Esc is the panel's: it must not also close a dialog around the bar (the dropdown menu does the same). */
    event.preventDefault();
    event.stopPropagation();
    this.closeToControl();
  };

  private onDocumentPointerdown = (event: PointerEvent): void => {
    if (!this.open || event.composedPath().includes(this)) return;
    this.closePanel();
  };

  private onViewportChange = (): void => {
    this.placeShown();
  };

  private startListening(): void {
    if (this.listening) return;
    this.listening = true;
    document.addEventListener('keydown', this.onDocumentKeydown, true);
    document.addEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.addEventListener('scroll', this.onViewportChange, true);
    window.addEventListener('resize', this.onViewportChange);
    this.updateScrollTargets();
    this.resizeObserver = new ResizeObserver(() => this.placeShown());
  }

  /** A `scroll` is not composed: a scroller inside another shadow root is heard only on its own path. */
  private updateScrollTargets(): void {
    this.clearScrollTargets();
    let node: Node | null = this;
    while (node !== null) {
      if (node instanceof Element || node instanceof ShadowRoot) {
        node.addEventListener('scroll', this.onViewportChange, true);
        this.scrollTargets.push(node);
      }
      /* The flat tree: a slotted node goes through its slot, inside the shadow root around it. */
      node = node instanceof ShadowRoot ? node.host : ((node as Element).assignedSlot ?? node.parentNode);
    }
  }

  private clearScrollTargets(): void {
    for (const target of this.scrollTargets) {
      target.removeEventListener('scroll', this.onViewportChange, true);
    }
    this.scrollTargets.length = 0;
  }

  private stopListening(): void {
    if (!this.listening) return;
    this.listening = false;
    this.clearScrollTargets();
    document.removeEventListener('keydown', this.onDocumentKeydown, true);
    document.removeEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
  }

  /* ----- the layer ------------------------------------------------------------ */

  /** The id of the panel that is shown, or `null`. */
  private shownPanelId(): string | null {
    if (this.listShown()) return 'panel-list';
    const index = this.shownIndex();
    return index === null ? null : `panel-${String(index)}`;
  }

  /** Shows the panel that should be shown and hides the others; places it when shown. */
  private syncPanels(): void {
    const shown = this.shownPanelId();
    for (const panel of this.renderRoot.querySelectorAll<HTMLElement>('.panel')) {
      const wanted = panel.id === shown;
      const isOpen = panel.matches(':popover-open');
      if (wanted && !isOpen) {
        try {
          panel.showPopover();
        } catch {
          /* Not connected, or already showing: nothing to do. */
        }
      } else if (!wanted && isOpen) {
        try {
          panel.hidePopover();
        } catch {
          /* Already hidden: nothing to do. */
        }
      }
    }
    if (shown !== null) {
      this.startListening();
      if (shown !== this.lastShown) {
        this.resizeObserver?.disconnect();
        const panel = this.renderRoot.querySelector<HTMLElement>(`#${shown}`);
        if (panel !== null) this.resizeObserver?.observe(panel);
      }
      this.placeShown();
    } else {
      this.stopListening();
    }
    this.lastShown = shown;
  }

  /** The element the shown panel hangs from: its trigger, or the Menu button. */
  private anchorOf(panelId: string): HTMLElement | null {
    if (panelId === 'panel-list') return this.renderRoot.querySelector<HTMLElement>('.menu-button');
    return this.renderRoot.querySelector<HTMLElement>(`#trigger-${panelId.slice('panel-'.length)}`);
  }

  /**
   * Below its control, aligned to the start edge, `panel-offset` away (the margin of the panel), and
   * never past the sides of the window. The bar is always at the top, so the panel never turns up.
   */
  private placeShown(): void {
    const id = this.shownPanelId();
    if (id === null) return;
    const panel = this.renderRoot.querySelector<HTMLElement>(`#${id}`);
    const anchorElement = this.anchorOf(id);
    if (panel === null || anchorElement === null) return;
    const anchor = anchorElement.getBoundingClientRect();
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    /* The control is scrolled out of the window: the panel goes with it, not stuck to the edge. */
    const visible = anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width;
    panel.style.visibility = visible ? '' : 'hidden';
    if (!visible) return;
    /* Measuring drops the height limit; the scroll position comes back after it. */
    const scrollTop = panel.scrollTop;
    panel.style.maxHeight = '';
    panel.style.overflowY = '';
    panel.style.maxWidth = `${String(view.width)}px`;
    panel.style.top = '0px';
    panel.style.left = '0px';
    const { width, height } = panel.getBoundingClientRect();
    const style = getComputedStyle(panel);
    /* Only a panel taller than the room below its control scrolls: a scrolling box clips the focus halo (P92). */
    const room = view.height - anchor.bottom - (Number.parseFloat(style.marginTop) || 0);
    if (height > room) {
      panel.style.maxHeight = `${String(Math.max(room, 0))}px`;
      panel.style.overflowY = 'auto';
      panel.scrollTop = scrollTop;
    }
    const rtl = getComputedStyle(anchorElement).direction === 'rtl';
    let x = rtl ? anchor.right - width : anchor.left;
    x = Math.min(Math.max(x, 0), Math.max(view.width - width, 0));
    panel.style.left = `${String(x - (Number.parseFloat(style.marginLeft) || 0))}px`;
    panel.style.top = `${String(anchor.bottom)}px`;
  }

  /* ----- drawing -------------------------------------------------------------- */

  private renderLink(link: NphNavigationMenuLink): TemplateResult {
    const title = text(link.title);
    const description = text(link.description);
    const icon = text(link.icon);
    const current = link.current === true;
    const disabled = link.disabled === true;
    const href = text(link.href);
    return html`<a
      class="link"
      href=${disabled || href === '' ? nothing : href}
      role=${disabled ? 'link' : nothing}
      aria-disabled=${disabled ? 'true' : nothing}
      aria-current=${current ? 'page' : nothing}
      ?data-current=${current}
      @click=${(event: MouseEvent) => this.onLinkClick(event)}
    >
      ${current ? html`<span class="indicator" aria-hidden="true"></span>` : nothing}
      ${icon === ''
        ? nothing
        : html`<nph-icon class="link-icon" name=${icon} variant=${current ? 'solid' : 'light'} size="md" aria-hidden="true"></nph-icon>`}
      <span class="texts">
        <span class="title">${title}</span>
        ${description === '' ? nothing : html`<span class="description">${description}</span>`}
      </span>
    </a>`;
  }

  /** `unavailable`: the trigger of the group is disabled, so every link in it is too (the narrow list). */
  private renderGroup(group: NphNavigationMenuGroup, id: string, unavailable = false): TemplateResult {
    const label = text(group.label);
    return html`<div class="group" role=${label === '' ? nothing : 'group'} aria-labelledby=${label === '' ? nothing : `${id}-label`}>
      ${label === '' ? nothing : html`<span class="group-label" id="${id}-label">${label}</span>`}
      <ul class="links">
        ${group.links.map((link) => html`<li>${this.renderLink(unavailable && link.disabled !== true ? { ...link, disabled: true } : link)}</li>`)}
      </ul>
    </div>`;
  }

  /** The groups of a panel side by side, a vertical separator between them. */
  private renderGroups(trigger: NphNavigationMenuTrigger, id: string): TemplateResult[] {
    return trigger.groups.flatMap((group, index) => [
      ...(index === 0 ? [] : [html`<nph-separator class="divider" orientation="vertical"></nph-separator>`]),
      this.renderGroup(group, `${id}-group-${String(index)}`),
    ]);
  }

  private renderTopItem(item: NphNavigationMenuItem, index: number): TemplateResult {
    const disabled = item.disabled === true;
    if (!isTrigger(item)) {
      const current = item.current === true;
      const href = text(item.href);
      return html`<li class="entry">
        <a
          class="top"
          href=${disabled || href === '' ? nothing : href}
          role=${disabled ? 'link' : nothing}
          aria-disabled=${disabled ? 'true' : nothing}
          aria-current=${current ? 'page' : nothing}
          ?data-current=${current}
          @click=${(event: MouseEvent) => this.onLinkClick(event)}
          ><span class="top-label">${text(item.label)}</span>${current ? html`<span class="indicator" aria-hidden="true"></span>` : nothing}</a
        >
      </li>`;
    }
    const current = item.groups.some((group) => group.links.some((link) => link.current === true));
    const expanded = this.shownIndex() === index;
    const key = String(index);
    return html`<li
      class="entry"
      @pointerenter=${(event: PointerEvent) => this.onEntryEnter(index, event)}
      @pointerleave=${(event: PointerEvent) => this.onEntryLeave(index, event)}
    >
      <button
        class="top trigger"
        id="trigger-${key}"
        type="button"
        ?disabled=${disabled}
        aria-expanded=${expanded ? 'true' : 'false'}
        aria-controls="panel-${key}"
        aria-current=${current ? 'true' : nothing}
        ?data-current=${current}
        @click=${(event: MouseEvent) => this.onTriggerClick(index, event)}
      >
        <span class="top-label">${text(item.label)}</span>
        <nph-icon class="trigger-icon" name="chevron-down" size="sm" aria-hidden="true"></nph-icon>
        ${current ? html`<span class="indicator" aria-hidden="true"></span>` : nothing}
      </button>
      <div class="panel" id="panel-${key}" popover="manual" data-nph-panel="wide">
        <div class="groups">${this.renderGroups(item, `panel-${key}`)}</div>
      </div>
    </li>`;
  }

  /** The sections of the narrow list: consecutive top links together, each trigger on its own. */
  private sections(): Section[] {
    const sections: Section[] = [];
    for (const [index, item] of this.items.entries()) {
      if (isTrigger(item)) {
        sections.push({ kind: 'trigger', trigger: item, index });
        continue;
      }
      const last = sections.at(-1);
      if (last?.kind === 'links') {
        sections[sections.length - 1] = { kind: 'links', links: [...last.links, item] };
      } else {
        sections.push({ kind: 'links', links: [item] });
      }
    }
    return sections;
  }

  private renderNarrowList(): TemplateResult {
    const sections = this.sections();
    return html`<div class="panel" id="panel-list" popover="manual" data-nph-panel="narrow">
      <div class="list">
        ${sections.map((section, position) => {
          const id = `panel-list-section-${String(position)}`;
          const body =
            section.kind === 'links'
              ? html`<div class="group">
                  <ul class="links">
                    ${section.links.map((link) => html`<li>${this.renderLink(topLinkAsPanelLink(link))}</li>`)}
                  </ul>
                </div>`
              : html`<span class="group-label" id="${id}-label">${text(section.trigger.label)}</span>
                  ${section.trigger.groups.map((group, index) => this.renderGroup(group, `${id}-group-${String(index)}`, section.trigger.disabled === true))}`;
          return html`${position === 0 ? nothing : html`<nph-separator class="divider"></nph-separator>`}<div
              class="section"
              role=${section.kind === 'trigger' ? 'group' : nothing}
              aria-labelledby=${section.kind === 'trigger' ? `${id}-label` : nothing}
            >
              ${body}
            </div>`;
        })}
      </div>
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problem !== null) {
      return nothing;
    }
    const name = this.name();
    if (this.narrow) {
      const label = text(this.menuLabel);
      return html`<nav aria-label=${name === null ? nothing : name} @focusout=${this.onFocusOut} @pointerdown=${this.onPress}>
        <button
          class="menu-button"
          id=${MENU_BUTTON_ID}
          type="button"
          aria-label=${label}
          aria-expanded=${this.listShown() ? 'true' : 'false'}
          aria-controls="panel-list"
          @click=${() => this.onMenuClick()}
        >
          <nph-icon name="bars" size="md" aria-hidden="true"></nph-icon>
        </button>
        <nph-tooltip for=${MENU_BUTTON_ID} relation="name" .text=${label}></nph-tooltip>
        ${this.renderNarrowList()}
      </nav>`;
    }
    return html`<nav aria-label=${name === null ? nothing : name} @focusout=${this.onFocusOut} @pointerdown=${this.onPress}>
      <ul class="bar">
        ${this.items.map((item, index) => this.renderTopItem(item, index))}
      </ul>
    </nav>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphNavigationMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-navigation-menu': NphNavigationMenu;
  }
}
