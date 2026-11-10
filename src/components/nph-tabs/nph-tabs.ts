/**
 * `nph-tabs` — the list of tabs that switches the content of a section of the same page.
 *
 * Contract accepted in Figma (documentation frame `3483:11200`, sets `3472:9192`, `3472:8748` and
 * `3472:8747`), recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-71, sheet
 * `fichas/nph-tabs.md` and decision P115 — nph-tabs: API and semantics:
 * - `tabs`: the list of tabs, property only, as `{ value, text, icon?, counter?, counterLabel?, tag?,
 *   disabled? }`. `value` names the tab and its panel and is unique; `text` is the label, one line;
 *   `icon` is a core name of `nph-icon`, on every tab or on none; `counter` is a whole number from
 *   zero up and `counterLabel` is the hidden context text that goes with it in the accessible name
 *   ("12 items"), required with `counter`; `tag` is one word, an `nph-badge`. The order inside the
 *   tab is fixed: icon, label, counter, tag (DSA-57 D-5). An empty list is a mount: nothing, no
 *   error (precedent of `nph-badge`, P68);
 * - `value`: the active tab. There is always one: without a `value` that names a tab, the first
 *   enabled tab is active and the component writes `value`. Reflects;
 * - `variant` (the Figma `estilo`): `segmented` (default), `underline`, `solid`, `light` or
 *   `outline`, the last three being the tab button. Reflects, because the internal CSS selects on it;
 * - `activation`: `automatic` (default), a tab becomes active when the arrows put the focus on it, or
 *   `manual`, the arrows move the focus and only Enter, Space or a click activate (APG). Reflects;
 * - `label` and the host `aria-label`: the accessible name of the `tablist`;
 * - `scroll-previous-label` and `scroll-next-label`: the names of the two scroll arrows of the
 *   underline style, which `nph-button` icon only requires and shows in its balloon. Without them
 *   the arrows are not drawn and a warning is emitted in development. The arrows are out of the Tab
 *   order (`tabindex="-1"`) but not hidden from assistive technology: `aria-hidden` on a button
 *   that holds a focusable element is an axe violation (`aria-hidden-focus`), so they keep a name;
 * - the panels stay with the consumer: each one is the slot named by the `value` of its tab
 *   (`<div slot="pending">`). The component draws the `role="tabpanel"` around the slot, since the
 *   ARIA references of the tab and of the panel must live in the same root (P91);
 * - own event `nph-tab-change` (bubbles, composed), `detail: { value }`, fired only when the person
 *   activates a tab, never when code changes `value`. It is not `nph-value-change`: that name is
 *   already typed with a list by `nph-toggle-group` (P76);
 * - no `::part`, no color property, no form association, no vertical list, no whole-list
 *   `disabled` (it stays on each tab);
 * - invalid input does not render and emits `console.error` only in development, one per cause
 *   (the rule of P21).
 *
 * SEMANTICS — APG Tabs. A `tablist` of native buttons with `role="tab"`, `aria-selected` and
 * `aria-controls`, each panel a `tabpanel` named by its tab. The list is one Tab stop, on the active
 * tab (the first enabled one when the active tab is disabled); the arrows wrap and skip a disabled
 * tab; Home and End go to the first and the last enabled tab. The icon is decorative; the counter
 * number is `aria-hidden` and the hidden context text carries it in the name. A disabled tab is a
 * native disabled button, so it takes no focus and no click.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-badge/nph-badge';
import '../nph-button/nph-button';
import '../nph-icon/nph-icon';
import '../nph-tooltip/nph-tooltip';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import tabsCss from './nph-tabs.css?inline';

const TAG = 'nph-tabs';

/** Internal marker, not API: present only when the input is valid and there is a tab to draw. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The five styles of the Figma `estilo`: the rail, the line and the three tab buttons. */
export const NPH_TABS_VARIANTS = ['segmented', 'underline', 'solid', 'light', 'outline'] as const;
export type NphTabsVariant = (typeof NPH_TABS_VARIANTS)[number];

/** How a tab becomes active when the arrows put the focus on it (APG). */
export const NPH_TABS_ACTIVATIONS = ['automatic', 'manual'] as const;
export type NphTabsActivation = (typeof NPH_TABS_ACTIVATIONS)[number];

/** `nph-tab-change`: the person activated a tab. */
export const NPH_TABS_CHANGE_EVENT = 'nph-tab-change';
export interface NphTabsChangeDetail {
  /** The `value` of the tab that became active. */
  readonly value: string;
}

/** A counter above this number shows `99+`; the accessible name keeps the text of the consumer. */
export const NPH_TABS_COUNTER_MAX = 99;

/** One tab of the list. */
export interface NphTab {
  /** Names the tab and its panel. Unique in the list. */
  value: string;
  /** The label, one line. Already localized. */
  text: string;
  /** A core name of `nph-icon`. On every tab or on none. */
  icon?: string;
  /** A whole number from zero up, after the label. */
  counter?: number;
  /** The hidden context text of the counter, such as `12 items`. Required with `counter`. */
  counterLabel?: string;
  /** One word, such as `New`, after the counter. */
  tag?: string;
  /** The tab takes no focus and no click. */
  disabled?: boolean;
}

/**
 * The elements a panel can hold that already take the Tab key; a panel without one takes it itself.
 * Only native and `tabindex` targets: a component of the consumer is not listed by its tag, since
 * what takes the Tab key is what it draws inside its own shadow root (an `nph-chip` with no X and a
 * label that fits has none), and the search goes in there.
 */
const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"]), [contenteditable=""], [contenteditable="true"]';

/** Development messages; outside a bundler with `import.meta.env`, they stay silent. */
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

/** A counter is a whole number from zero up. */
export function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/** What the counter shows: the number, or `99+` above the maximum. */
export function counterText(count: number): string {
  return count > NPH_TABS_COUNTER_MAX ? `${String(NPH_TABS_COUNTER_MAX)}+` : String(count);
}

export class NphTabs extends LitElement {
  static override styles = unsafeCSS(tabsCss);

  static override properties = {
    tabs: { attribute: false },
    /* The reflected ones are read by the internal CSS or by the consumer. */
    value: { type: String, reflect: true },
    variant: { type: String, reflect: true },
    activation: { type: String, reflect: true },
    label: { type: String },
    /* The host `aria-label` is the accessible name when there is no `label`. It cannot be a property
     * called `ariaLabel`: that name is the native ARIA reflection of every element. */
    hostName: { type: String, attribute: 'aria-label' },
    scrollPreviousLabel: { type: String, attribute: 'scroll-previous-label' },
    scrollNextLabel: { type: String, attribute: 'scroll-next-label' },
    stop: { state: true },
    cutValues: { state: true },
    overflowing: { state: true },
    atStart: { state: true },
    atEnd: { state: true },
    rtl: { state: true },
    panelStops: { state: true },
  };

  /** The tabs, in order. */
  declare tabs: readonly NphTab[];

  /** The `value` of the active tab. */
  declare value: string;

  /** `segmented`, `underline`, `solid`, `light` or `outline`. */
  declare variant: NphTabsVariant;

  /** `automatic` or `manual`. */
  declare activation: NphTabsActivation;

  /** The accessible name of the tab list. Already localized. */
  declare label: string | null;

  /** The host `aria-label`, the accessible name when `label` is not given. */
  declare hostName: string | null;

  /** The name of the arrow that scrolls the underline list toward its start. */
  declare scrollPreviousLabel: string | null;

  /** The name of the arrow that scrolls the underline list toward its end. */
  declare scrollNextLabel: string | null;

  /** The tab that holds the Tab stop while the focus is inside the list; `null` is the active tab. Not API. */
  declare protected stop: string | null;
  /** The `value` of the tabs whose label is cut by an ellipsis. Measured, not API. */
  declare protected cutValues: readonly string[];
  /** The underline tabs do not fit: the scroll arrows show. Measured, not API. */
  declare protected overflowing: boolean;
  declare protected atStart: boolean;
  declare protected atEnd: boolean;
  declare protected rtl: boolean;
  /** The `value` of the panels that have no focusable item and take the Tab key. Measured, not API. */
  declare protected panelStops: readonly string[];

  private problem: string | null = null;
  private reported = '';
  private warned = new Set<string>();
  private resizeObserver: ResizeObserver | undefined;
  private observed: Element[] = [];
  /** The tab that took `tabindex="0"` from the pointer, so its balloon can open; `null` when none. */
  private hovered: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.tabs = [];
    this.value = '';
    this.variant = 'segmented';
    this.activation = 'automatic';
    this.label = null;
    this.hostName = null;
    this.scrollPreviousLabel = null;
    this.scrollNextLabel = null;
    this.stop = null;
    this.cutValues = [];
    this.overflowing = false;
    this.atStart = true;
    this.atEnd = true;
    this.rtl = false;
    this.panelStops = [];
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.measure());
    /* The font changes the width of the text once it loads. */
    document.fonts?.ready.then(() => this.measure());
    /* A list moved to another place observes its parts again: the observer was disconnected when it
       left, and only an update installs it. */
    if (this.hasUpdated) this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.observed = [];
    this.hovered = null;
  }

  /* ----- validation -------------------------------------------------------- */

  /** The reason the input is invalid, or `null`. An empty list is a mount, not a problem. */
  private validate(): string | null {
    const variant = this.variant ?? '';
    const activation = this.activation ?? '';
    if (!oneOf(NPH_TABS_VARIANTS, variant)) {
      return `variant "${variant}" does not exist. Use ${NPH_TABS_VARIANTS.join(', ')}.`;
    }
    if (!oneOf(NPH_TABS_ACTIVATIONS, activation)) {
      return `activation "${activation}" does not exist. Use ${NPH_TABS_ACTIVATIONS.join(', ')}.`;
    }
    const tabs = this.tabs;
    if (!Array.isArray(tabs)) {
      return '`tabs` is not a list. Give it the tabs, in order.';
    }
    const values = new Set<string>();
    let withIcon = 0;
    for (const [index, tab] of tabs.entries()) {
      const where = `tab ${String(index + 1)}`;
      if (tab === null || typeof tab !== 'object') {
        return `${where} is not an object.`;
      }
      if (trimmed(tab.value) === '') {
        return `${where} has no \`value\`: it names the tab and its panel.`;
      }
      if (values.has(tab.value)) {
        return `${where} repeats the value "${tab.value}": the value names one tab.`;
      }
      values.add(tab.value);
      if (trimmed(tab.text) === '') {
        return `${where} has no \`text\`: the label is the name of the tab.`;
      }
      const icon = trimmed(tab.icon);
      if (icon !== '') {
        if (!isCoreName(icon)) {
          return `icon "${icon}" of ${where} does not belong to the Nephos core.`;
        }
        withIcon += 1;
      }
      const hasCounter = tab.counter !== undefined && tab.counter !== null;
      if (hasCounter && !isCount(tab.counter)) {
        return `the counter of ${where} shows a whole number from zero up only.`;
      }
      if (hasCounter && trimmed(tab.counterLabel) === '') {
        return `the counter of ${where} needs \`counterLabel\`: the hidden context text of the number, such as "12 items".`;
      }
      const tag = trimmed(tab.tag);
      if (tag !== '' && /\s/.test(tag)) {
        return `the tag of ${where} is one word.`;
      }
    }
    if (withIcon !== 0 && withIcon !== tabs.length) {
      return 'only some tabs have an `icon`. With icons every tab has its own; without icons none does.';
    }
    if (tabs.length > 0 && tabs.every((tab) => tab.disabled === true)) {
      return 'every tab is disabled: the list needs one tab the person can activate.';
    }
    return null;
  }

  private warnOnce(key: string, message: string): void {
    if (!this.warned.has(key)) {
      this.warned.add(key);
      devWarn(message);
    }
  }

  protected override willUpdate(): void {
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
    const draws = this.problem === null && this.tabs.length > 0;
    this.toggleAttribute(RENDERED_ATTRIBUTE, draws);
    if (!draws) {
      return;
    }
    /* A tab is always active: the panel is never empty (Do of the documentation). */
    if (!this.tabs.some((tab) => tab.value === this.value)) {
      if (trimmed(this.value) !== '') {
        devWarn(`value "${this.value}" matches no tab: the first enabled tab is active.`);
      }
      this.value = (this.tabs.find((tab) => tab.disabled !== true) as NphTab).value;
    }
  }

  protected override updated(changed: PropertyValues): void {
    if (this.problem === null && this.tabs.length > 0) {
      if (this.name() === null) {
        this.warnOnce('name', 'the tab list has no accessible name. Give it a `label` or an `aria-label`.');
      }
      if (this.variant === 'underline' && this.overflowing && !this.hasScrollLabels) {
        this.warnOnce(
          'scroll',
          'the underline tabs do not fit and the scroll arrows need `scroll-previous-label` and `scroll-next-label`: without them the arrows are not drawn.',
        );
      }
    }
    /* An update while disconnected records nothing: the parts are observed again on reconnection. */
    if (this.resizeObserver === undefined) {
      return;
    }
    const targets = [...this.renderRoot.querySelectorAll('.bar, .label')];
    const same = targets.length === this.observed.length && targets.every((node, index) => node === this.observed[index]);
    if (!same) {
      this.resizeObserver.disconnect();
      for (const target of targets) {
        this.resizeObserver.observe(target);
      }
      this.observed = targets;
    }
    this.measure();
    if (changed.has('value') || changed.has('tabs')) {
      void this.measurePanels();
    }
  }

  /* ----- measuring --------------------------------------------------------- */

  /** The cut labels, the room for the underline tabs and the ends of the list, measured on the screen. */
  private measure(): void {
    if (this.problem !== null) {
      return;
    }
    const cut: string[] = [];
    const labels = [...this.renderRoot.querySelectorAll<HTMLElement>('.label')];
    for (const [index, label] of labels.entries()) {
      const tab = this.tabs[index];
      if (tab !== undefined && label.scrollWidth > label.clientWidth) {
        cut.push(tab.value);
      }
    }
    if (cut.length !== this.cutValues.length || cut.some((value, index) => value !== this.cutValues[index])) {
      this.cutValues = cut;
    }
    const bar = this.renderRoot.querySelector<HTMLElement>('.bar');
    const list = this.renderRoot.querySelector<HTMLElement>('.list');
    const scroller = this.renderRoot.querySelector<HTMLElement>('.scroller');
    if (bar !== null && list !== null && scroller !== null) {
      /* The list is wider than the bar only when the tabs keep their own width and do not fit. */
      const overflowing = this.variant === 'underline' && list.scrollWidth > bar.clientWidth + 1;
      if (overflowing !== this.overflowing) {
        this.overflowing = overflowing;
      }
      const rtl = getComputedStyle(this).direction === 'rtl';
      if (rtl !== this.rtl) {
        this.rtl = rtl;
      }
      const offset = Math.abs(scroller.scrollLeft);
      const atStart = offset < 1;
      const atEnd = offset + scroller.clientWidth >= scroller.scrollWidth - 1;
      if (atStart !== this.atStart) this.atStart = atStart;
      if (atEnd !== this.atEnd) this.atEnd = atEnd;
    }
  }

  /** The parent in the flat tree: a shadow root leads to its host. */
  private parentOf(element: Element): Element | null {
    if (element.parentElement !== null) {
      return element.parentElement;
    }
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root.host : null;
  }

  /**
   * Whether an element takes part in the Tab order: not disabled, not out of it by a negative
   * `tabindex`, not hidden and not inert, itself or by a parent, through shadow roots. A host that
   * delegates its focus, such as `nph-button`, takes the whole shadow root out of the order with a
   * negative `tabindex`.
   */
  private takesTab(element: Element): boolean {
    if (element.matches(':disabled') || element.hasAttribute('disabled')) {
      return false;
    }
    if (!(element as HTMLElement).checkVisibility?.({ visibilityProperty: true })) {
      return false;
    }
    for (let node: Element | null = element; node !== null; node = this.parentOf(node)) {
      if (node.hasAttribute('hidden') || node.hasAttribute('inert')) {
        return false;
      }
      const declared = node.getAttribute('tabindex');
      const negative = declared !== null && Number.parseInt(declared, 10) < 0;
      if (negative && (node === element || node.shadowRoot?.delegatesFocus === true)) {
        return false;
      }
    }
    return true;
  }

  /** Whether the subtree of a node, shadow roots included, holds an item that takes the Tab key. */
  private holdsTab(node: Element | ShadowRoot): boolean {
    if (node instanceof Element) {
      if (node.matches(FOCUSABLE) && this.takesTab(node)) {
        return true;
      }
      if (node.shadowRoot !== null && this.holdsTab(node.shadowRoot)) {
        return true;
      }
    }
    return [...node.querySelectorAll('*')].some(
      (element) =>
        (element.matches(FOCUSABLE) && this.takesTab(element)) || (element.shadowRoot !== null && this.holdsTab(element.shadowRoot)),
    );
  }

  /**
   * A panel with no item that takes the Tab key takes it itself (APG). A component of the consumer
   * draws nothing until it has rendered, so its `updateComplete` is awaited before it is measured.
   */
  private async measurePanels(): Promise<void> {
    const found = [...this.renderRoot.querySelectorAll<HTMLElement>('.panel')].map((panel) => ({
      panel,
      nodes: panel.querySelector('slot')?.assignedElements({ flatten: true }) ?? [],
    }));
    const everything = found.flatMap(({ nodes }) => nodes.flatMap((node) => [node, ...node.querySelectorAll('*')]));
    await Promise.all(
      everything.map((element) => (element as Element & { updateComplete?: Promise<unknown> }).updateComplete).filter((pending) => pending !== undefined),
    );
    const stops: string[] = [];
    for (const { panel, nodes } of found) {
      const reachable = nodes.some((node) => this.holdsTab(node));
      if (!reachable && nodes.length > 0) {
        stops.push(panel.dataset.value ?? '');
      }
    }
    if (stops.length !== this.panelStops.length || stops.some((value, index) => value !== this.panelStops[index])) {
      this.panelStops = stops;
    }
  }

  /* ----- state ------------------------------------------------------------- */

  private name(): string | null {
    const label = trimmed(this.label);
    if (label !== '') return label;
    const host = trimmed(this.hostName);
    return host === '' ? null : host;
  }

  private get hasScrollLabels(): boolean {
    return trimmed(this.scrollPreviousLabel) !== '' && trimmed(this.scrollNextLabel) !== '';
  }

  private isEnabled(tab: NphTab): boolean {
    return tab.disabled !== true;
  }

  /** The tab that carries `tabindex="0"`: the active one, or the first enabled tab when it is disabled. */
  private tabStop(): string {
    const active = this.tabs.find((tab) => tab.value === this.value);
    if (this.stop !== null && this.tabs.some((tab) => tab.value === this.stop && this.isEnabled(tab))) {
      return this.stop;
    }
    if (active !== undefined && this.isEnabled(active)) {
      return active.value;
    }
    return (this.tabs.find((tab) => this.isEnabled(tab)) as NphTab).value;
  }

  private tabButtons(): HTMLButtonElement[] {
    return [...this.renderRoot.querySelectorAll<HTMLButtonElement>('.tab')];
  }

  private activate(value: string): void {
    if (value === this.value) {
      return;
    }
    this.value = value;
    this.dispatchEvent(
      new CustomEvent<NphTabsChangeDetail>(NPH_TABS_CHANGE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { value },
      }),
    );
  }

  /* ----- events ------------------------------------------------------------ */

  private tabOf(event: Event): HTMLButtonElement | null {
    for (const node of event.composedPath()) {
      if (node instanceof HTMLButtonElement && node.classList.contains('tab')) {
        return node;
      }
    }
    return null;
  }

  private onClick(event: MouseEvent): void {
    const button = this.tabOf(event);
    if (button === null || button.disabled) {
      return;
    }
    const tab = this.tabs[this.tabButtons().indexOf(button)];
    if (tab === undefined) {
      return;
    }
    /* Some browsers do not focus a button on click: the tab takes the focus here. */
    button.focus();
    /* A click on the active tab does nothing. */
    this.activate(tab.value);
  }

  /** Moves the focus to a tab; the tab is the Tab stop before the focus lands, so its balloon can open. */
  private moveTo(index: number): void {
    const buttons = this.tabButtons();
    const target = buttons[index];
    const tab = this.tabs[index];
    if (target === undefined || tab === undefined) {
      return;
    }
    for (const button of buttons) {
      button.tabIndex = button === target ? 0 : -1;
    }
    this.hovered = null;
    this.stop = tab.value;
    target.focus();
    if (this.activation === 'automatic') {
      this.activate(tab.value);
    }
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const button = this.tabOf(event);
    if (button === null) {
      return;
    }
    const from = this.tabButtons().indexOf(button);
    const enabled = this.tabs.map((tab, index) => (this.isEnabled(tab) ? index : -1)).filter((index) => index >= 0);
    let next: number | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      /* The arrow that points to the end of the line goes to the next tab, in either writing direction. */
      const forward = (event.key === 'ArrowRight') !== this.rtl;
      const at = enabled.indexOf(from);
      const step = forward ? 1 : -1;
      next = enabled[(at + step + enabled.length) % enabled.length];
    } else if (event.key === 'Home') {
      next = enabled[0];
    } else if (event.key === 'End') {
      next = enabled[enabled.length - 1];
    } else {
      return;
    }
    event.preventDefault();
    if (next !== undefined) {
      this.moveTo(next);
    }
  }

  private onFocusin(event: FocusEvent): void {
    const button = this.tabOf(event);
    const tab = button === null ? undefined : this.tabs[this.tabButtons().indexOf(button)];
    if (tab !== undefined) {
      this.stop = tab.value;
    }
  }

  private onFocusout(event: FocusEvent): void {
    const list = this.renderRoot.querySelector('.list');
    if (!(event.relatedTarget instanceof Node) || !(list?.contains(event.relatedTarget) ?? false)) {
      /* The focus left the list: the Tab stop goes back to the active tab. */
      this.stop = null;
    }
  }

  /**
   * `nph-tooltip` opens only on an element with `tabIndex >= 0` (P77). An inactive tab has `-1`, so
   * the cut tab under the pointer takes `0` until the pointer leaves, before the tooltip reads it.
   * `pointerover` comes before the `pointerenter` the tooltip listens to.
   */
  private onPointerover(event: PointerEvent): void {
    if (event.pointerType === 'touch') {
      return;
    }
    const button = this.tabOf(event);
    if (button === null || button === this.hovered) {
      return;
    }
    this.releaseHovered();
    const tab = this.tabs[this.tabButtons().indexOf(button)];
    if (tab !== undefined && this.isEnabled(tab) && this.cutValues.includes(tab.value) && button.tabIndex < 0) {
      button.tabIndex = 0;
      this.hovered = button;
    }
  }

  private onPointerout(event: PointerEvent): void {
    const button = this.tabOf(event);
    if (button === null || button !== this.hovered) {
      return;
    }
    const target = event.relatedTarget;
    /* The pointer going from the tab to its own balloon keeps the tab eligible: the balloon stays open
       while the pointer is over it (WCAG 1.4.13), and the tab is given back when it leaves both. */
    const entering = target instanceof Node && (button.contains(target) || this.balloonOf(button) === target);
    if (!entering) {
      this.releaseHovered();
    }
  }

  /** The balloon of a tab, when its label is cut. */
  private balloonOf(button: HTMLButtonElement): Element | null {
    return this.renderRoot.querySelector(`nph-tooltip[for="${button.id}"]`);
  }

  /** The pointer left the balloon: unless it went back to the tab, the tab is given back. */
  private onBalloonPointerout(event: PointerEvent): void {
    const button = this.hovered;
    if (button === null) {
      return;
    }
    const target = event.relatedTarget;
    const balloon = this.balloonOf(button);
    if (target instanceof Node && (button.contains(target) || balloon === target)) {
      return;
    }
    this.releaseHovered();
  }

  private releaseHovered(): void {
    const button = this.hovered;
    this.hovered = null;
    if (button === null) {
      return;
    }
    const tab = this.tabs[this.tabButtons().indexOf(button)];
    button.tabIndex = tab !== undefined && tab.value === this.tabStop() ? 0 : -1;
  }

  private scrollList(direction: 1 | -1): void {
    const scroller = this.renderRoot.querySelector<HTMLElement>('.scroller');
    if (scroller === null) {
      return;
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    /* `direction` is toward the end of the line; in right-to-left writing the end is the left. */
    const sign = this.rtl ? -direction : direction;
    scroller.scrollBy({ left: sign * scroller.clientWidth * 0.75, behavior: reduced ? 'auto' : 'smooth' });
  }

  private onScroll(): void {
    this.measure();
  }

  /* ----- rendering --------------------------------------------------------- */

  private renderTab(tab: NphTab, index: number, stop: string): TemplateResult {
    const selected = tab.value === this.value;
    const label = trimmed(tab.text);
    const icon = trimmed(tab.icon);
    const tag = trimmed(tab.tag);
    const hasCounter = tab.counter !== undefined && tab.counter !== null;
    const tagEmphasis = selected && (this.variant === 'light' || this.variant === 'outline') ? 'solid' : 'light';
    return html`<button
      class="tab"
      id=${`tab-${String(index)}`}
      type="button"
      role="tab"
      aria-selected=${selected ? 'true' : 'false'}
      aria-controls=${`panel-${String(index)}`}
      tabindex=${tab.value === stop ? '0' : '-1'}
      ?disabled=${!this.isEnabled(tab)}
    >
      ${icon !== ''
        ? html`<nph-icon class="icon icon-light" name=${icon} variant="light" size="sm" aria-hidden="true"></nph-icon
            ><nph-icon class="icon icon-solid" name=${icon} variant="solid" size="sm" aria-hidden="true"></nph-icon>`
        : nothing}<span class="label">${label}</span>${hasCounter
        ? html`<span class="counter" aria-hidden="true">${counterText(tab.counter as number)}</span
            ><span class="hidden" id=${`context-${String(index)}`}>, ${trimmed(tab.counterLabel)}</span>`
        : nothing}${tag !== ''
        ? html`<nph-badge class="tag" id=${`tag-${String(index)}`} severity="primary" emphasis=${tagEmphasis} text=${tag}></nph-badge>`
        : nothing}<span class="line" aria-hidden="true"></span>
    </button>`;
  }

  private renderArrow(direction: 1 | -1): TemplateResult | typeof nothing {
    if (!this.overflowing || !this.hasScrollLabels) {
      return nothing;
    }
    const previous = direction === -1;
    const start = previous !== this.rtl;
    return html`<nph-button
      class=${previous ? 'arrow arrow-previous' : 'arrow arrow-next'}
      severity="secondary"
      emphasis="ghost"
      size="compact"
      shape="square"
      icon-start=${start ? 'chevron-left' : 'chevron-right'}
      label=${trimmed(previous ? this.scrollPreviousLabel : this.scrollNextLabel)}
      tabindex="-1"
      ?disabled=${previous ? this.atStart : this.atEnd}
      @click=${() => this.scrollList(direction)}
    ></nph-button>`;
  }

  private renderPanel(tab: NphTab, index: number): TemplateResult {
    const active = tab.value === this.value;
    return html`<div
      class="panel"
      id=${`panel-${String(index)}`}
      role="tabpanel"
      aria-labelledby=${`tab-${String(index)}`}
      data-value=${tab.value}
      tabindex=${active && this.panelStops.includes(tab.value) ? '0' : nothing}
      ?hidden=${!active}
    >
      <slot name=${tab.value} @slotchange=${() => void this.measurePanels()}></slot>
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problem !== null || this.tabs.length === 0) {
      return nothing;
    }
    const name = this.name();
    const stop = this.tabStop();
    return html`<div class="bar">
        ${this.renderArrow(-1)}
        <div class="scroller" @scroll=${() => this.onScroll()}>
          <div
            class="list"
            role="tablist"
            aria-label=${name === null ? nothing : name}
            @click=${(event: MouseEvent) => this.onClick(event)}
            @keydown=${(event: KeyboardEvent) => this.onKeydown(event)}
            @focusin=${(event: FocusEvent) => this.onFocusin(event)}
            @focusout=${(event: FocusEvent) => this.onFocusout(event)}
            @pointerover=${(event: PointerEvent) => this.onPointerover(event)}
            @pointerout=${(event: PointerEvent) => this.onPointerout(event)}
          >
            ${this.tabs.map((tab, index) => this.renderTab(tab, index, stop))}
          </div>
        </div>
        ${this.renderArrow(1)}
      </div>
      ${this.tabs.map((tab, index) =>
        this.cutValues.includes(tab.value) && this.isEnabled(tab)
          ? html`<nph-tooltip
              id=${`balloon-${String(index)}`}
              for=${`tab-${String(index)}`}
              .text=${trimmed(tab.text)}
              @pointerout=${(event: PointerEvent) => this.onBalloonPointerout(event)}
            ></nph-tooltip>`
          : nothing,
      )}
      ${this.tabs.map((tab, index) => this.renderPanel(tab, index))}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphTabs);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-tabs': NphTabs;
  }
  interface HTMLElementEventMap {
    'nph-tab-change': CustomEvent<NphTabsChangeDetail>;
  }
}
