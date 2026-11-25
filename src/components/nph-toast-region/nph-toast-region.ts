/**
 * `nph-toast-region` — the fixed region of the screen that places and stacks the toasts.
 *
 * Contract accepted in Figma (documentation frame `7819:4737`, page `5415:32`, set `7689:288`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-100, sheet
 * `fichas/nph-toast-region.md` and `design.md`. It answers D-1 of DSA-63: the region is a piece of its own.
 * It does not draw the toast: severity, icon, text, actions and close stay with the `nph-notification`.
 *
 * API — declarative, one region per page. The application appends `<nph-notification placement="toast">`
 * as a child and removes it on `nph-close`; the region watches its children:
 * - the default slot receives the toasts. Nothing else belongs in it (a development warning says so);
 * - `label`, the accessible name of the region, already translated ("Notifications"), required: it names
 *   the landmark (P109, item 5);
 * - no event, no `::part`, no color property.
 *
 * ORDER, QUANTITY AND QUEUE — from the oldest, at the top, to the newest, at the bottom, next to the
 * corner. At most 3 toasts in view (`NPH_TOAST_REGION_MAX_VISIBLE`). The 4th and the next ones wait in a
 * queue, in order of arrival, mounted but `hidden` and `inert` (`data-nph-queued`), not announced and
 * with no countdown, and come into view when a toast leaves. Nothing is drawn for the queue and there is no
 * priority in it (v1). A toast that leaves keeps its place for the length of the exit.
 *
 * POSITION — in the top layer (`popover="manual"`, P77): no `z-index`, no layer token, no space reserved in
 * the page. From 768 px at the bottom-right corner, `toast-region/inset` from the bottom and from the end edge
 * (the left one in right-to-left writing); below 768 px at the base from side to side, `toast-region/inset-compact`
 * from the bottom and from each side, the toast taking the width of the region. The region stays in the top
 * layer while it is connected, empty or not, so a modal dialog opened after it goes above it and its scrim
 * covers it; mount it once, at the start of the page. A window lower than the stack (D-1): the list gets a
 * height limit and scrolls, kept at the bottom, and takes the focus (`tabindex="0"`) only while it scrolls.
 *
 * ANNOUNCEMENT (item 5) — `role="region"` with the name above, and two hidden live regions, one polite and one
 * assertive, mounted even when empty. Error and warning go to the assertive one, the others to the polite one,
 * with the heading and the description. The toast drops its own role inside the region (`nph-notification`).
 * A toast is announced when it comes into view, and again when its severity, heading or description change in
 * place (a loading toast that turns into success or error). With a modal dialog open, the region's own live
 * regions are inert, so the announcement goes through two hidden live regions appended to the open
 * `nph-dialog` (or `dialog`), which leave when it closes. A dialog inside another component's shadow root is
 * not seen.
 *
 * TIME (items 6 and 7) — every toast keeps its own pause (P108 item 4). The region adds one: with the pointer on
 * the region, the focus inside it or a modal dialog open, every toast is `paused` and goes on with what was left.
 *
 * KEYBOARD (item 8) — F6 takes the focus to the first control (action or close) of the newest toast that has one;
 * F6 again returns it to where it came from. Tab and Shift+Tab go through the controls. Esc with the focus in a
 * toast closes that toast (the toast listens; the first Esc of the icon-only close closes its tooltip). When the toast
 * that had the focus leaves, the focus goes to the next toast with a control or back to where it came from. With
 * no toast that has a control, F6 takes the focus to the list only while it scrolls, and is left alone otherwise.
 * The toast never takes the focus by itself.
 *
 * MOTION — a toast enters in `toast-region/enter-duration` and leaves in `toast-region/exit-duration`, with
 * opacity and transform only, sliding half its own height; with reduced motion, only opacity. The region shows
 * the exit while the element stays in the page: a toast removed at once leaves with no exit. The toasts above
 * move up with no animation in v1.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-notification/nph-notification';
import type { NphNotification } from '../nph-notification/nph-notification';
import styles from './nph-toast-region.css?inline';

const TAG = 'nph-toast-region';
const NOTIFICATION_TAG = 'nph-notification';

/** The most toasts in view at once (item 4); the next ones wait in the queue. */
export const NPH_TOAST_REGION_MAX_VISIBLE = 3;

/** How long the live regions wait between clearing and writing, so a screen reader reads the change. */
const ANNOUNCE_DELAY = 100;

/** Internal marks on the toasts, not API. */
const QUEUED_ATTRIBUTE = 'data-nph-queued';
const LEAVING_ATTRIBUTE = 'data-nph-leaving';

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function trimmed(value: string | null | undefined): string {
  return (value ?? '').trim();
}

/** The element that has the focus, going down through the open shadow roots. */
function deepActiveElement(): HTMLElement | null {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active instanceof HTMLElement && active !== document.body ? active : null;
}

/** Whether `node` is `root` or sits inside it, crossing shadow roots. */
function containsDeep(root: Node, node: Node | null): boolean {
  let current: Node | null = node;
  while (current !== null) {
    if (current === root) return true;
    current = current.parentNode ?? (current instanceof ShadowRoot ? current.host : null);
  }
  return false;
}

/** The controls a toast offers to the keyboard: its actions and its close, in tab order. */
function controlsOf(toast: NphNotification): HTMLElement[] {
  return Array.from(toast.shadowRoot?.querySelectorAll<HTMLElement>('nph-button') ?? []);
}

/** Whether the toast says its message loudly: error and warning are urgent. */
function isUrgent(toast: NphNotification): boolean {
  return toast.severity === 'error' || toast.severity === 'warning';
}

/** The words a screen reader reads for a toast: the heading, then the description. */
function messageOf(toast: NphNotification): string {
  return [trimmed(toast.heading), trimmed(toast.description)].filter((part) => part !== '').join('. ');
}

/** What makes a toast worth announcing again: its severity and its words. */
function signatureOf(toast: NphNotification): string {
  return `${toast.severity}\u0000${trimmed(toast.heading)}\u0000${trimmed(toast.description)}`;
}

/** The regions connected to the page: there is one per page. */
const connectedRegions = new Set<NphToastRegion>();

type Politeness = 'polite' | 'assertive';

export class NphToastRegion extends LitElement {
  static override styles = unsafeCSS(styles);

  static override properties = {
    label: { type: String },
    scrolls: { state: true },
  };

  /** The accessible name of the region, already translated. Required. */
  declare label: string;

  /** The stack does not fit in the window: the list scrolls and takes the focus. */
  declare scrolls: boolean;

  private hovering = false;
  private focusInside = false;
  private modalOpen = false;
  /** Where the focus was before F6 took it into a toast. */
  private origin: HTMLElement | null = null;
  /** The toast the focus is in. */
  private focusedToast: NphNotification | null = null;

  /** The toasts the region hid itself because they wait in the queue. */
  private readonly queued = new WeakSet<NphNotification>();
  /** The toasts that closed: they take no place, and a toast that closes by itself is `hidden`. */
  private readonly closed = new WeakSet<NphNotification>();
  /** The toasts in their exit, still in view. */
  private readonly leaving = new Map<NphNotification, number>();
  /** The toasts in view now. */
  private visible: NphNotification[] = [];
  private readonly announced = new WeakMap<NphNotification, string>();
  private readonly watchers = new Map<NphNotification, MutationObserver>();

  private readonly pending: Record<Politeness, string[]> = { polite: [], assertive: [] };
  private sayTimer: number | undefined;
  private modalHost: Element | null = null;
  private modalLive: HTMLElement | null = null;
  private modalObserver: MutationObserver | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private reported = new Set<string>();

  constructor() {
    super();
    this.label = '';
    this.scrolls = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    connectedRegions.add(this);
    if (connectedRegions.size > 1) {
      this.report('many', 'there is one region per page: a second one repeats the corner and the live regions.');
    }
    this.addEventListener('nph-close', this.onToastClose);
    this.addEventListener('focusin', this.onFocusIn);
    this.addEventListener('focusout', this.onFocusOut);
    document.addEventListener('keydown', this.onDocumentKeydown, true);
    document.addEventListener('focusin', this.onDocumentFocusIn, true);
    document.addEventListener('pointerdown', this.onDocumentPointerDown, true);
    window.addEventListener('resize', this.onWindowResize);
    this.modalObserver = new MutationObserver(() => this.syncModal());
    this.modalObserver.observe(document, { attributes: true, attributeFilter: ['open'], subtree: true });
    this.syncModal();
    if (this.hasUpdated) {
      /* Back in the page after a move: the popover left the top layer on disconnect. */
      this.requestUpdate();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    connectedRegions.delete(this);
    this.removeEventListener('nph-close', this.onToastClose);
    this.removeEventListener('focusin', this.onFocusIn);
    this.removeEventListener('focusout', this.onFocusOut);
    document.removeEventListener('keydown', this.onDocumentKeydown, true);
    document.removeEventListener('focusin', this.onDocumentFocusIn, true);
    document.removeEventListener('pointerdown', this.onDocumentPointerDown, true);
    window.removeEventListener('resize', this.onWindowResize);
    this.modalObserver?.disconnect();
    this.modalObserver = undefined;
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.removeModalLive();
    for (const watcher of this.watchers.values()) watcher.disconnect();
    this.watchers.clear();
    for (const timer of this.leaving.values()) window.clearTimeout(timer);
    this.leaving.clear();
    window.clearTimeout(this.sayTimer);
    this.sayTimer = undefined;
    this.pending.polite = [];
    this.pending.assertive = [];
    this.hovering = false;
    this.focusInside = false;
    this.focusedToast = null;
    this.origin = null;
  }

  // ---- parts ----------------------------------------------------------------------------------

  private get regionElement(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('.region');
  }

  private report(cause: string, message: string): void {
    if (!this.reported.has(cause)) {
      this.reported.add(cause);
      devError(message);
    }
  }

  /** The direct children that are toasts, in the order they were appended. */
  private get toasts(): NphNotification[] {
    return Array.from(this.children).filter(
      (child): child is NphNotification => child.localName === NOTIFICATION_TAG,
    );
  }

  // ---- render ---------------------------------------------------------------------------------

  protected override willUpdate(): void {
    if (trimmed(this.label) === '') {
      this.report('label', 'label is required: it is the accessible name of the region, already translated.');
    }
  }

  protected override render(): TemplateResult {
    const label = trimmed(this.label);
    return html`<div
        class="region"
        popover="manual"
        role="region"
        aria-label=${label === '' ? nothing : label}
        tabindex=${this.scrolls ? '0' : nothing}
        ?data-scrolls=${this.scrolls}
        @pointerenter=${this.onPointerEnter}
        @pointerleave=${this.onPointerLeave}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
      <div class="live" role="status" aria-live="polite" aria-atomic="false" data-live="polite"></div>
      <div class="live" role="alert" aria-live="assertive" aria-atomic="false" data-live="assertive"></div>`;
  }

  protected override firstUpdated(): void {
    this.showRegion();
    const region = this.regionElement;
    if (region !== null && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.updateScroll(false));
      this.resizeObserver.observe(region);
    }
    this.sync();
  }

  protected override updated(): void {
    this.showRegion();
  }

  /** The region lives in the top layer while it is connected, empty or not. */
  private showRegion(): void {
    const region = this.regionElement;
    if (region === null || !this.isConnected || region.matches(':popover-open')) return;
    try {
      region.showPopover();
    } catch {
      /* Not connected, or already showing: nothing to do. */
    }
  }

  // ---- the toasts: order, quantity and queue -------------------------------------------------

  private readonly onSlotChange = (): void => {
    this.sync();
  };

  /**
   * Decides, in the order of arrival, which toasts are in view and which wait. A toast that closed or
   * is leaving takes no new place; a toast leaving keeps its place for the length of the exit.
   */
  private sync(): void {
    if (!this.isConnected) return;
    const children = this.toasts;
    for (const child of Array.from(this.children)) {
      if (child.localName !== NOTIFICATION_TAG) {
        this.report(`child ${child.localName}`, `<${child.localName}> does not belong in the region: it receives only ${NOTIFICATION_TAG} with placement="toast".`);
      }
    }
    for (const toast of children) {
      if (toast.placement !== 'toast') {
        this.report('placement', `${NOTIFICATION_TAG} inside the region needs placement="toast"; the inline one stays in the page.`);
      }
    }
    for (const [toast, timer] of this.leaving) {
      if (!children.includes(toast)) {
        window.clearTimeout(timer);
        this.leaving.delete(toast);
      }
    }
    for (const toast of children) {
      /* A closed toast that was shown again takes its place back. */
      if (this.closed.has(toast) && !toast.hidden && !this.leaving.has(toast)) {
        this.closed.delete(toast);
        toast.inert = false;
      }
    }
    for (const [toast, watcher] of this.watchers) {
      if (!children.includes(toast)) {
        watcher.disconnect();
        this.watchers.delete(toast);
      }
    }
    const active = children.filter((toast) => !this.closed.has(toast) && !this.leaving.has(toast));
    const capacity = Math.max(0, NPH_TOAST_REGION_MAX_VISIBLE - this.leaving.size);
    this.visible = active.slice(0, capacity);
    for (const toast of active) {
      if (this.visible.includes(toast)) this.bringIntoView(toast);
      else this.queue(toast);
    }
    this.applyPause();
    this.restoreLostFocus();
    this.updateScroll(true);
    for (const toast of this.visible) void this.announce(toast);
  }

  private queue(toast: NphNotification): void {
    this.queued.add(toast);
    toast.setAttribute(QUEUED_ATTRIBUTE, '');
    toast.hidden = true;
    toast.inert = true;
  }

  private bringIntoView(toast: NphNotification): void {
    if (!this.queued.has(toast)) return;
    this.queued.delete(toast);
    toast.removeAttribute(QUEUED_ATTRIBUTE);
    toast.inert = false;
    toast.hidden = false;
  }

  // ---- a toast that leaves -------------------------------------------------------------------

  private readonly onToastClose = (event: Event): void => {
    const toast = event.target;
    if (!(toast instanceof Element) || toast.parentElement !== this || toast.localName !== NOTIFICATION_TAG) return;
    /* The toast hides itself after the listeners have run, unless one prevents it. */
    queueMicrotask(() => {
      if (event.defaultPrevented) return;
      this.beginLeave(toast as NphNotification);
    });
  };

  private beginLeave(toast: NphNotification): void {
    if (this.closed.has(toast)) return;
    if (!this.contains(toast)) {
      this.sync();
      return;
    }
    this.closed.add(toast);
    this.queued.delete(toast);
    if (this.focusedToast === toast) this.moveFocusAwayFrom(toast);
    toast.inert = true;
    toast.setAttribute(LEAVING_ATTRIBUTE, '');
    const duration = Number.parseFloat(getComputedStyle(toast).animationDuration) * 1000;
    if (!(duration > 0)) {
      toast.removeAttribute(LEAVING_ATTRIBUTE);
      this.sync();
      return;
    }
    this.leaving.set(
      toast,
      window.setTimeout(() => {
        this.leaving.delete(toast);
        toast.removeAttribute(LEAVING_ATTRIBUTE);
        this.sync();
      }, duration),
    );
    this.sync();
  }

  // ---- time: the pause of every toast --------------------------------------------------------

  private readonly onPointerEnter = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.hovering = true;
    this.applyPause();
  };

  private readonly onPointerLeave = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    this.hovering = false;
    this.applyPause();
  };

  /** The pointer on the region, the focus inside it and an open modal dialog hold every toast. */
  private applyPause(): void {
    const paused = this.hovering || this.focusInside || this.modalOpen;
    for (const toast of this.toasts) {
      if (toast.paused !== paused) toast.paused = paused;
    }
  }

  // ---- the modal dialog ----------------------------------------------------------------------

  /** The last modal dialog open in the page, or `null`. */
  private findModal(): Element | null {
    let found: Element | null = null;
    try {
      const open = document.querySelectorAll('nph-dialog[open], dialog:modal');
      found = open.item(open.length - 1);
    } catch {
      /* A browser without `:modal`: the page is read by the `open` attribute only. */
      const open = document.querySelectorAll('nph-dialog[open]');
      found = open.item(open.length - 1);
    }
    return found;
  }

  private syncModal(): void {
    const host = this.findModal();
    const open = host !== null;
    if (host !== this.modalHost) {
      this.removeModalLive();
      if (host !== null) this.mountModalLive(host);
    }
    if (open !== this.modalOpen) {
      this.modalOpen = open;
      this.applyPause();
    }
  }

  /** The two hidden live regions inside the open dialog, where the announcement can be heard. */
  private mountModalLive(host: Element): void {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-nph-toast-region-live', '');
    for (const [role, politeness] of [['status', 'polite'], ['alert', 'assertive']] as const) {
      const live = document.createElement('div');
      live.setAttribute('role', role);
      live.setAttribute('aria-live', politeness);
      live.setAttribute('aria-atomic', 'false');
      live.dataset.live = politeness;
      wrapper.append(live);
    }
    /* Hidden the way the region's own are: clipped and without size, so it takes no room in the dialog. */
    for (const [property, value] of Object.entries({
      position: 'absolute',
      'inline-size': '0',
      'block-size': '0',
      overflow: 'hidden',
      'clip-path': 'inset(50%)',
      'white-space': 'nowrap',
      'pointer-events': 'none',
    })) {
      wrapper.style.setProperty(property, value);
    }
    host.append(wrapper);
    this.modalHost = host;
    this.modalLive = wrapper;
  }

  private removeModalLive(): void {
    this.modalLive?.remove();
    this.modalLive = null;
    this.modalHost = null;
  }

  // ---- announcement --------------------------------------------------------------------------

  /** Says the toast when it comes into view, and again when its words or severity change in place. */
  private async announce(toast: NphNotification): Promise<void> {
    await toast.updateComplete;
    if (!this.isConnected || !this.visible.includes(toast)) return;
    this.watch(toast);
    /* The toast draws nothing, and so says nothing, while its input is invalid. */
    if (!toast.hasAttribute('data-nph-rendered')) return;
    const signature = signatureOf(toast);
    if (this.announced.get(toast) === signature) return;
    this.announced.set(toast, signature);
    this.say(messageOf(toast), isUrgent(toast) ? 'assertive' : 'polite');
  }

  /** Watches a toast that may change in place: the severity attribute and the text it draws. */
  private watch(toast: NphNotification): void {
    if (this.watchers.has(toast)) return;
    const watcher = new MutationObserver(() => {
      void this.announce(toast);
    });
    watcher.observe(toast, { attributes: true, attributeFilter: ['severity'] });
    if (toast.shadowRoot !== null) {
      watcher.observe(toast.shadowRoot, { subtree: true, childList: true, characterData: true });
    }
    this.watchers.set(toast, watcher);
  }

  /** Writes what arrived in the same moment together, after the live region was cleared. */
  private say(message: string, politeness: Politeness): void {
    if (message === '') return;
    this.pending[politeness].push(message);
    if (this.sayTimer !== undefined) return;
    this.sayTimer = window.setTimeout(() => {
      this.sayTimer = undefined;
      for (const kind of ['polite', 'assertive'] as const) {
        const messages = this.pending[kind];
        this.pending[kind] = [];
        if (messages.length === 0) continue;
        const live = this.liveRegion(kind);
        if (live === null) continue;
        live.replaceChildren(
          ...messages.map((text) => {
            const line = document.createElement('div');
            line.textContent = text;
            return line;
          }),
        );
      }
    }, ANNOUNCE_DELAY);
  }

  /** The live region to write in: the open dialog's, or the region's own. */
  private liveRegion(politeness: Politeness): HTMLElement | null {
    const root: ParentNode | null = this.modalLive ?? this.renderRoot;
    return root.querySelector<HTMLElement>(`[data-live="${politeness}"]`);
  }

  // ---- keyboard and focus --------------------------------------------------------------------

  private toastOf(event: Event): NphNotification | null {
    const found = event
      .composedPath()
      .find((node) => node instanceof Element && node.parentElement === this && node.localName === NOTIFICATION_TAG);
    return (found as NphNotification | undefined) ?? null;
  }

  private readonly onFocusIn = (event: FocusEvent): void => {
    this.focusInside = true;
    this.focusedToast = this.toastOf(event);
    this.applyPause();
  };

  /**
   * The focus left a part of the region. When a toast hides itself or is removed with the focus in it, the
   * browser sends this too, with no new target: the toast and the place F6 came from are kept for the move.
   */
  private readonly onFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    this.focusInside = next instanceof Node && this.contains(next);
    this.applyPause();
  };

  /** The focus went to something outside the region on its own: nothing is left to hand it back to. */
  private readonly onDocumentFocusIn = (event: FocusEvent): void => {
    if (!containsDeep(this, event.target as Node | null)) this.forgetFocus();
  };

  /** A press outside the region takes the focus away too, with no focus event when it lands on the page itself. */
  private readonly onDocumentPointerDown = (event: PointerEvent): void => {
    if (!containsDeep(this, event.target as Node | null)) this.forgetFocus();
  };

  private forgetFocus(): void {
    this.focusedToast = null;
    this.origin = null;
  }

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'F6' || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
    /* A modal dialog holds the region inert: no focus goes there. */
    if (this.modalOpen) return;
    if (containsDeep(this, deepActiveElement())) {
      event.preventDefault();
      this.returnFocus();
      return;
    }
    if (this.focusFirstControl()) event.preventDefault();
  };

  /** F6: the first control of the newest toast that has one; with none, the list while it scrolls. */
  private focusFirstControl(): boolean {
    const origin = deepActiveElement();
    for (const toast of [...this.visible].reverse()) {
      for (const control of controlsOf(toast)) {
        control.focus();
        if (containsDeep(toast, deepActiveElement())) {
          this.origin = origin;
          return true;
        }
      }
    }
    const region = this.regionElement;
    if (this.scrolls && region !== null) {
      region.focus();
      if (region.matches(':focus')) {
        this.origin = origin;
        return true;
      }
    }
    return false;
  }

  /** F6 again: back to where the focus came from. */
  private returnFocus(): void {
    const origin = this.origin;
    this.origin = null;
    if (origin !== null && origin.isConnected && !containsDeep(this, origin)) {
      origin.focus();
    } else {
      deepActiveElement()?.blur();
    }
  }

  /** The first toast with a control after `toast`, or else the nearest one before it. */
  private nextWithControl(toast: NphNotification): NphNotification | null {
    const index = this.visible.indexOf(toast);
    /* A toast no longer in the list, because it was removed: the newest one first. */
    const after = index < 0 ? [] : this.visible.slice(index + 1);
    const before = index < 0 ? [...this.visible].reverse() : this.visible.slice(0, index).reverse();
    return [...after, ...before].find((candidate) => controlsOf(candidate).length > 0) ?? null;
  }

  /** The toast that had the focus leaves: the focus goes to the next toast with a control, or back. */
  private moveFocusAwayFrom(toast: NphNotification): void {
    const next = this.nextWithControl(toast);
    this.focusedToast = null;
    if (next !== null) {
      for (const control of controlsOf(next)) {
        control.focus();
        if (containsDeep(next, deepActiveElement())) return;
      }
    }
    this.returnFocus();
  }

  /** A toast removed from the page with the focus in it sends no event: ask where the focus went. */
  private restoreLostFocus(): void {
    const toast = this.focusedToast;
    if (toast !== null && !this.contains(toast)) this.moveFocusAwayFrom(toast);
  }

  // ---- a window lower than the stack ---------------------------------------------------------

  private readonly onWindowResize = (): void => {
    this.updateScroll(false);
  };

  /**
   * The list scrolls only while the stack does not fit: the window height less the inset at the bottom
   * and the same at the top. `stick` keeps it at the bottom, where the newest toast is.
   */
  private updateScroll(stick: boolean): void {
    const region = this.regionElement;
    if (region === null || !this.isConnected) return;
    const inset = Number.parseFloat(getComputedStyle(region).insetBlockEnd) || 0;
    const limit = window.innerHeight - 2 * inset;
    const scrolls = region.scrollHeight > limit && limit > 0;
    if (scrolls !== this.scrolls) {
      this.scrolls = scrolls;
      /* The attribute and the height limit land with the next update: keep to the bottom after it. */
      void this.updateComplete.then(() => this.keepAtBottom());
      return;
    }
    if (scrolls && stick) this.keepAtBottom();
  }

  private keepAtBottom(): void {
    const region = this.regionElement;
    if (region !== null && this.scrolls) region.scrollTop = region.scrollHeight;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphToastRegion);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-toast-region': NphToastRegion;
  }
}
