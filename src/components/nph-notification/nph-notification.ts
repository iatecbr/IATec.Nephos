/**
 * `nph-notification` — the system message, shown inline or as a toast.
 *
 * Contract accepted in Figma (documentation frame `3442:10163`, page `1369:2`, set `3434:9035`;
 * focus of the close on solid, frame `4207:1146`), recorded as text in the evidence of the
 * `figma-docs-accepted` gate of DSA-63, sheet `fichas/nph-notification.md`, `design.md` and
 * decision P108:
 * - `placement` (the Figma `placement`): `inline` (default), in the page and tied to an area,
 *   or `toast`, floating, with elevation, that may close by itself;
 * - `severity`: `info` (default), `success`, `warning`, `error`, `help`, `neutral` or
 *   `loading`. `loading` exists only on the subtle toast. The consumer picks the severity, never
 *   the color;
 * - `emphasis`: `subtle` (default) or `solid`. Solid has no actions, only the close button;
 * - `layout`: `stacked` (default) or `single-line`. When the text goes beyond one line, a
 *   single-line notification reflows to stacked (host mark `data-nph-reflowed`, not API) and the
 *   action moves below the text; the width stays the one of the declared layout;
 * - `heading` (the Figma `título`, optional; not `title`, the global HTML attribute) and
 *   `description` (always present; it says what happened and what to do);
 * - `action` and `secondary-action` (the Figma `ações` and `ação secundária`): the text of each
 *   action, already localized. The main one is an `nph-button` of the type of the severity, solid
 *   (`primary` on neutral); the secondary one is ghost, with its label in the color of the
 *   severity. Single-line takes only the main action; solid and loading take none;
 * - `hide-close` (the Figma `fechar`, on by default) and `close-label`, the accessible name of the
 *   close button, already localized and required while the button is shown. Loading has no close;
 * - `duration`: milliseconds a toast stays before it closes by itself, 6000 by default; `0` keeps
 *   it until the person acts; below 6000 is invalid (WCAG 2.2.1). An error toast, a loading toast
 *   and a toast with an action never close by themselves, whatever the value. It pauses while the
 *   pointer is over it and while focus is inside it;
 * - `time-bar` (the Figma `barra de tempo`): the line at the base of the toast, only on a subtle
 *   toast that closes by itself. Never with an action (the documentation forbids it and the code
 *   blocks it), on error or on loading. Until `nph-progress` is wired in, it is an `nph-skeleton`
 *   line, as the Figma does;
 * - events `nph-action` (`detail: { action: 'primary' | 'secondary' }`) and `nph-close`
 *   (`detail: { source: 'close-button' | 'timeout' }`, bubbles, composed, cancelable). Without
 *   `preventDefault()`, the notification hides itself (`hidden`); the consumer removes the element;
 * - accessibility: the host has `role="alert"` on error and warning and `role="status"` on the
 *   others, and the notification never takes or moves focus. The severity icon is decorative, the
 *   title and the description say the severity in words. On a touch screen (`pointer: coarse`) the
 *   actions switch to the size large of `nph-button` and the touch area of the close grows to
 *   `control/height-large`, with no change in its drawing;
 * - no slot, no color property and no `::part`.
 *
 * COMPOSITION — nothing inside is reimplemented and no inner piece changes. `nph-button` has no
 * color property and no `::part`, so the colors the contract asks for go through the public custom
 * properties it already reads (the pattern of `nph-dialog` and `nph-toolbar`), set on the element
 * itself and never on the page: the secondary action is a ghost button whose `color/*-on-surface`
 * and `color/*-surface` are pointed at `notification/<severity>-action-*` (the ghost exists only in
 * primary, secondary and danger); the close on solid takes the secondary foreground,
 * `icon-button/secondary-ghost-background-hover`, `focus/border`, `focus/halo` and `border/width`
 * of the contract (hover at 16%, a 2 px border in the text color and no halo).
 *
 * Invalid input does not render and emits `console.error` only in development, one per cause while
 * it lasts (the rule of P21): a value outside a list, an empty `description`, a secondary action
 * without a main one, `loading` outside the subtle toast, a `duration` that is not `0` or at least
 * 6000, an empty `close-label` with the close on, and a time bar that is not allowed. A part the
 * Figma says has "no effect" (actions on solid, on loading, the second action on single-line, the
 * close on loading) is simply not drawn.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-icon/nph-icon';
import '../nph-skeleton/nph-skeleton';
import '../nph-spinner/nph-spinner';
import type { NphIconName } from '../nph-icon/nph-icon.icons';
import notificationCss from './nph-notification.css?inline';

const TAG = 'nph-notification';

/** The longest delay `setTimeout` takes: 2^31 - 1 milliseconds. */
const MAX_TIMER_DELAY = 2 ** 31 - 1;

/** Internal marks, not API. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';
const REFLOWED_ATTRIBUTE = 'data-nph-reflowed';

export const NPH_NOTIFICATION_PLACEMENTS = ['inline', 'toast'] as const;
export type NphNotificationPlacement = (typeof NPH_NOTIFICATION_PLACEMENTS)[number];

export const NPH_NOTIFICATION_SEVERITIES = ['info', 'success', 'warning', 'error', 'help', 'neutral', 'loading'] as const;
export type NphNotificationSeverity = (typeof NPH_NOTIFICATION_SEVERITIES)[number];

export const NPH_NOTIFICATION_EMPHASES = ['subtle', 'solid'] as const;
export type NphNotificationEmphasis = (typeof NPH_NOTIFICATION_EMPHASES)[number];

export const NPH_NOTIFICATION_LAYOUTS = ['stacked', 'single-line'] as const;
export type NphNotificationLayout = (typeof NPH_NOTIFICATION_LAYOUTS)[number];

/** The event the notification fires when the person asks for an action. */
export const NPH_NOTIFICATION_ACTION_EVENT = 'nph-action';
/** The event the notification fires when the person closes it or its time runs out. */
export const NPH_NOTIFICATION_CLOSE_EVENT = 'nph-close';

export type NphNotificationAction = 'primary' | 'secondary';
export type NphNotificationCloseSource = 'close-button' | 'timeout';

export interface NphNotificationActionDetail {
  action: NphNotificationAction;
}

export interface NphNotificationCloseDetail {
  source: NphNotificationCloseSource;
}

/** The time a toast that closes by itself stays, by default, in milliseconds (decision P5 of the contract). */
export const NPH_NOTIFICATION_DEFAULT_DURATION = 6000;
/** The shortest time it may stay: WCAG 2.2.1. */
export const NPH_NOTIFICATION_MIN_DURATION = 6000;

/** One drawing per severity: the severity never relies on color alone. */
const SEVERITY_ICON: Readonly<Record<Exclude<NphNotificationSeverity, 'loading'>, NphIconName>> = {
  info: 'circle-info',
  success: 'circle-check',
  warning: 'triangle-exclamation',
  error: 'circle-xmark',
  help: 'circle-question',
  neutral: 'bell',
};

/** The `nph-button` type of the main action, by severity: neutral is primary. */
const ACTION_SEVERITY: Readonly<Record<Exclude<NphNotificationSeverity, 'loading'>, string>> = {
  info: 'info',
  success: 'success',
  warning: 'warn',
  error: 'danger',
  help: 'help',
  neutral: 'primary',
};

/** The ghost type of the secondary action: the ghost exists only in primary, secondary and danger. */
const SECONDARY_SEVERITY: Readonly<Record<Exclude<NphNotificationSeverity, 'loading'>, string>> = {
  info: 'primary',
  success: 'primary',
  warning: 'primary',
  error: 'danger',
  help: 'primary',
  neutral: 'primary',
};

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/** The text with the spaces at both ends removed; `null` and `undefined` become empty. */
function trimmed(value: string | null | undefined): string {
  return (value ?? '').trim();
}

export class NphNotification extends LitElement {
  static override styles = unsafeCSS(notificationCss);

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    placement: { type: String, reflect: true },
    severity: { type: String, reflect: true },
    emphasis: { type: String, reflect: true },
    layout: { type: String, reflect: true },
    heading: { type: String },
    description: { type: String },
    action: { type: String },
    secondaryAction: { type: String, attribute: 'secondary-action' },
    hideClose: { type: Boolean, attribute: 'hide-close' },
    closeLabel: { type: String, attribute: 'close-label' },
    duration: { type: Number },
    timeBar: { type: Boolean, attribute: 'time-bar' },
    coarse: { state: true },
  };

  /** `inline` in the page, or `toast` over it. */
  declare placement: NphNotificationPlacement;
  /** The meaning of the message; it sets the color and the drawing. */
  declare severity: NphNotificationSeverity;
  /** `subtle` by default; `solid` for more weight, with no actions. */
  declare emphasis: NphNotificationEmphasis;
  /** `stacked` by default; `single-line` for short text. */
  declare layout: NphNotificationLayout;
  /** The title: the result in words. Optional. */
  declare heading: string;
  /** What happened and what to do. Required. */
  declare description: string;
  /** The text of the main action, already localized. */
  declare action: string;
  /** The text of the secondary action, already localized. */
  declare secondaryAction: string;
  /** Turns off the close button, which is on by default. */
  declare hideClose: boolean;
  /** Accessible name of the close button, already localized. Required while it is shown. */
  declare closeLabel: string;
  /** Milliseconds a toast stays before closing by itself; `0` keeps it. */
  declare duration: number;
  /** The line at the base of the toast that shows the time until it closes. */
  declare timeBar: boolean;

  /** Touch screen: the actions switch to the size large and the close grows its touch area. */
  declare coarse: boolean;

  private valid = false;
  private reported: string[] = [];
  private pointerQuery: MediaQueryList | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private observed: Element | null = null;
  private timerId: number | undefined;
  private timerStartedAt = 0;
  private timerSlice = 0;
  private remaining = 0;
  private armedDuration = 0;
  private hovering = false;
  private focusing = false;

  constructor() {
    super();
    this.placement = 'inline';
    this.severity = 'info';
    this.emphasis = 'subtle';
    this.layout = 'stacked';
    this.heading = '';
    this.description = '';
    this.action = '';
    this.secondaryAction = '';
    this.hideClose = false;
    this.closeLabel = '';
    this.duration = NPH_NOTIFICATION_DEFAULT_DURATION;
    this.timeBar = false;
    this.coarse = false;
  }

  /* `hidden` is the native attribute and keeps its native behavior; the timer only needs to know when it changes. */
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'hidden'];
  }

  override attributeChangedCallback(name: string, previous: string | null, next: string | null): void {
    super.attributeChangedCallback(name, previous, next);
    if (name === 'hidden' && this.hasUpdated) this.syncTimer();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('pointerenter', this.onPointerEnter);
    this.addEventListener('pointerleave', this.onPointerLeave);
    this.addEventListener('focusin', this.onFocusIn);
    this.addEventListener('focusout', this.onFocusOut);
    this.pointerQuery = window.matchMedia?.('(pointer: coarse)');
    if (this.pointerQuery !== undefined) {
      this.coarse = this.pointerQuery.matches;
      this.pointerQuery.addEventListener('change', this.onPointerChange);
    }
    /* Back in the page after a move: the observer and the timer start again. */
    if (this.hasUpdated) {
      this.observeSize();
      this.syncTimer();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('pointerenter', this.onPointerEnter);
    this.removeEventListener('pointerleave', this.onPointerLeave);
    this.removeEventListener('focusin', this.onFocusIn);
    this.removeEventListener('focusout', this.onFocusOut);
    this.pointerQuery?.removeEventListener('change', this.onPointerChange);
    this.pointerQuery = undefined;
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.observed = null;
    this.hovering = false;
    this.focusing = false;
    this.stopTimer();
    this.armedDuration = 0;
  }

  // ---- derived state ------------------------------------------------------------------------

  private get loading(): boolean {
    return this.severity === 'loading';
  }

  private get solid(): boolean {
    return this.emphasis === 'solid';
  }

  private get toast(): boolean {
    return this.placement === 'toast';
  }

  /** The text of the main action, or `''` when it is not drawn (solid, loading). */
  private get mainActionText(): string {
    return this.solid || this.loading ? '' : trimmed(this.action);
  }

  /** The text of the secondary action, or `''` when it is not drawn (solid, loading, single-line). */
  private get secondaryActionText(): string {
    return this.solid || this.loading || this.layout === 'single-line' ? '' : trimmed(this.secondaryAction);
  }

  private get closeShown(): boolean {
    return !this.loading && !this.hideClose && trimmed(this.closeLabel) !== '';
  }

  /** Whether the toast closes by itself: never on error, on loading or with an action. */
  private get autoCloses(): boolean {
    return (
      this.valid &&
      this.toast &&
      this.severity !== 'error' &&
      !this.loading &&
      this.mainActionText === '' &&
      this.secondaryActionText === '' &&
      Number.isFinite(this.duration) &&
      this.duration > 0
    );
  }

  // ---- validation ---------------------------------------------------------------------------

  protected override willUpdate(): void {
    const errors: string[] = [];
    const placement = this.placement ?? '';
    const severity = this.severity ?? '';
    const emphasis = this.emphasis ?? '';
    const layout = this.layout ?? '';
    if (!oneOf(NPH_NOTIFICATION_PLACEMENTS, placement)) {
      errors.push(`placement "${placement}" does not exist. Use ${NPH_NOTIFICATION_PLACEMENTS.join(', ')}; nothing was drawn.`);
    }
    if (!oneOf(NPH_NOTIFICATION_SEVERITIES, severity)) {
      errors.push(`severity "${severity}" does not exist. Use ${NPH_NOTIFICATION_SEVERITIES.join(', ')}; nothing was drawn.`);
    }
    if (!oneOf(NPH_NOTIFICATION_EMPHASES, emphasis)) {
      errors.push(`emphasis "${emphasis}" does not exist. Use ${NPH_NOTIFICATION_EMPHASES.join(', ')}; nothing was drawn.`);
    }
    if (!oneOf(NPH_NOTIFICATION_LAYOUTS, layout)) {
      errors.push(`layout "${layout}" does not exist. Use ${NPH_NOTIFICATION_LAYOUTS.join(', ')}; nothing was drawn.`);
    }
    if (trimmed(this.description) === '') {
      errors.push('description is required: it says what happened and what to do; nothing was drawn.');
    }
    const lists = errors.length === 0;
    if (lists && severity === 'loading' && (placement !== 'toast' || emphasis !== 'subtle')) {
      errors.push('severity "loading" exists only on the subtle toast; nothing was drawn.');
    }
    const duration = this.duration;
    if (!Number.isFinite(duration) || duration < 0 || (duration > 0 && duration < NPH_NOTIFICATION_MIN_DURATION)) {
      errors.push(
        `duration ${String(duration)} is not valid. Use 0 to keep the toast, or ${NPH_NOTIFICATION_MIN_DURATION} milliseconds or more (WCAG 2.2.1); nothing was drawn.`,
      );
    }
    if (lists && this.secondaryActionText !== '' && trimmed(this.action) === '') {
      errors.push('secondary-action needs the main action: at most two actions, one main and one secondary; nothing was drawn.');
    }
    if (this.timeBar) {
      if (lists && (placement !== 'toast' || emphasis !== 'subtle' || severity === 'error' || severity === 'loading')) {
        errors.push('time-bar exists only on a subtle toast, and never on error or on loading; nothing was drawn.');
      } else if (lists && (this.mainActionText !== '' || this.secondaryActionText !== '')) {
        errors.push('time-bar and an action never go together: a toast with an action does not close by itself; nothing was drawn.');
      } else if (!Number.isFinite(duration) || duration <= 0) {
        errors.push('time-bar needs a toast that closes by itself: set a duration of 6000 or more; nothing was drawn.');
      }
    }
    if (errors.length === 0 && !this.hideClose && !this.loading && trimmed(this.closeLabel) === '') {
      errors.push('close-label is required while the close button is shown: it is its accessible name; nothing was drawn.');
    }
    this.valid = errors.length === 0;
    for (const error of errors) {
      if (!this.reported.includes(error)) {
        devError(error);
      }
    }
    this.reported = errors;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    this.applySemantics();
  }

  /** Error and warning are announced as alerts; the others as status. Nothing takes focus. */
  private applySemantics(): void {
    if (!this.valid) {
      this.removeAttribute('role');
      return;
    }
    this.setAttribute('role', this.severity === 'error' || this.severity === 'warning' ? 'alert' : 'status');
  }

  // ---- render -------------------------------------------------------------------------------

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) return nothing;
    const heading = trimmed(this.heading);
    const description = trimmed(this.description);
    const main = this.mainActionText;
    const secondary = this.secondaryActionText;
    const sizeActions = this.coarse ? 'large' : 'default';
    return html`
      <div class="container">
        <div class="icon">${this.renderIcon()}</div>
        <div class="body">
          <div class="text">
            ${heading === '' ? nothing : html`<p class="heading">${heading}</p>`}
            <p class="description">${description}</p>
          </div>
          ${main === ''
            ? nothing
            : html`<div class="actions">
                <nph-button
                  class="action"
                  severity=${ACTION_SEVERITY[this.severity as Exclude<NphNotificationSeverity, 'loading'>]}
                  emphasis="solid"
                  size=${sizeActions}
                  text=${main}
                  @click=${() => this.fireAction('primary')}
                ></nph-button>
                ${secondary === ''
                  ? nothing
                  : html`<nph-button
                      class="action secondary"
                      severity=${SECONDARY_SEVERITY[this.severity as Exclude<NphNotificationSeverity, 'loading'>]}
                      emphasis="ghost"
                      size=${sizeActions}
                      text=${secondary}
                      @click=${() => this.fireAction('secondary')}
                    ></nph-button>`}
              </div>`}
        </div>
        ${this.closeShown
          ? html`<div class="close" @click=${this.onCloseClick}>
              <nph-button
                severity="secondary"
                emphasis="ghost"
                icon-start="xmark"
                label=${trimmed(this.closeLabel)}
              ></nph-button>
            </div>`
          : nothing}
        ${this.timeBar ? html`<nph-skeleton class="time-bar" shape="line" aria-hidden="true"></nph-skeleton>` : nothing}
        <div class="probe-box" aria-hidden="true">
          <div class="probe">
            ${heading === '' ? nothing : html`<span class="heading">${heading}</span>`}
            <span class="description">${description}</span>
          </div>
        </div>
      </div>
    `;
  }

  private renderIcon(): TemplateResult {
    if (this.loading) {
      return html`<span class="spinner"><nph-spinner size="md"></nph-spinner></span>`;
    }
    return html`<nph-icon
      name=${SEVERITY_ICON[this.severity as Exclude<NphNotificationSeverity, 'loading'>]}
      variant="solid"
      size="md"
    ></nph-icon>`;
  }

  // ---- reflow (single-line to stacked) -------------------------------------------------------

  protected override firstUpdated(): void {
    /* The width of the text changes when the font arrives, with no change in the box. */
    void document.fonts?.ready.then(() => {
      if (this.isConnected) this.syncReflow();
    });
  }

  /** Watches the box and the hidden twin of the text, so a change in either measures the reflow again. */
  private observeSize(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.observed = null;
    if (typeof ResizeObserver === 'undefined') return;
    const container = this.renderRoot.querySelector('.container');
    const probe = this.renderRoot.querySelector('.probe');
    if (container === null) return;
    this.observed = container;
    this.resizeObserver = new ResizeObserver(() => this.syncReflow());
    this.resizeObserver.observe(container);
    if (probe !== null) this.resizeObserver.observe(probe);
  }

  /**
   * Single-line stays on one line only while everything fits in it: the icon, the text with
   * its title, the main action and the close, plus the spaces between them. Otherwise it reflows to
   * stacked. The text is measured on a hidden twin that never wraps, so the answer is the same
   * whether the notification is on one line now or already stacked.
   */
  private syncReflow(): void {
    const container = this.renderRoot.querySelector<HTMLElement>('.container');
    const probe = container?.querySelector<HTMLElement>('.probe');
    if (container === null || container === undefined || probe === null || probe === undefined) return;
    let reflow = false;
    if (this.valid && this.layout === 'single-line') {
      const style = getComputedStyle(container);
      /* The box of a part and its inline margins: the close takes negative ones on a touch screen. */
      const width = (selector: string): number => {
        const element = container.querySelector<HTMLElement>(selector);
        if (element === null) return 0;
        const margins = getComputedStyle(element);
        return element.offsetWidth + (parseFloat(margins.marginInlineStart) || 0) + (parseFloat(margins.marginInlineEnd) || 0);
      };
      const gap = parseFloat(style.columnGap) || 0;
      const probeGap = parseFloat(getComputedStyle(probe).columnGap) || 0;
      const border = container.offsetWidth - container.clientWidth;
      const parts = [width('.icon'), probe.offsetWidth];
      if (this.mainActionText !== '') parts.push(width('.action'));
      if (this.closeShown) parts.push(width('.close'));
      const gaps = gap * (parts.length - 1) + (this.mainActionText !== '' ? probeGap - gap : 0);
      const needed =
        parts.reduce((sum, part) => sum + part, 0) +
        gaps +
        (parseFloat(style.paddingInlineStart) || 0) +
        (parseFloat(style.paddingInlineEnd) || 0) +
        border;
      /* Layout widths on both sides: a transform on an ancestor scales the box on screen, not the room inside it. */
      reflow = Math.ceil(needed) > container.offsetWidth;
    }
    this.toggleAttribute(REFLOWED_ATTRIBUTE, reflow);
  }

  // ---- the time a toast stays ---------------------------------------------------------------

  protected override updated(_changed: PropertyValues<this>): void {
    if (!this.isConnected) return;
    /* The box is drawn only while the input is valid: watch it from the update that draws it. */
    if (this.renderRoot.querySelector('.container') !== this.observed) this.observeSize();
    this.syncReflow();
    /* A focused part that left the page sends no focusout: ask the browser where the focus is now. */
    this.focusing = this.focusing && this.matches(':focus-within');
    this.syncTimer();
    /* The buttons finish their own update after this one: measure again with their final width. */
    const inner = [...this.renderRoot.querySelectorAll<LitElement>('nph-button')];
    if (inner.length > 0) {
      void Promise.all(inner.map((element) => element.updateComplete)).then(() => {
        if (this.isConnected) this.syncReflow();
      });
    }
  }

  /** Arms, pauses or stops the timer after each update. */
  private syncTimer(): void {
    const closes = this.autoCloses && !this.hidden && this.isConnected;
    const armed = closes ? this.duration : 0;
    if (armed !== this.armedDuration) {
      this.stopTimer();
      this.armedDuration = armed;
      this.remaining = armed;
    }
    if (!closes) {
      this.stopTimer();
      return;
    }
    if (this.hovering || this.focusing) {
      this.pauseTimer();
    } else {
      this.resumeTimer();
    }
  }

  private resumeTimer(): void {
    if (this.timerId !== undefined || this.remaining <= 0) return;
    this.timerStartedAt = Date.now();
    /* `setTimeout` takes a 32-bit delay: a longer time runs in slices. */
    this.timerSlice = Math.min(this.remaining, MAX_TIMER_DELAY);
    this.timerId = window.setTimeout(this.onTimer, this.timerSlice);
  }

  private pauseTimer(): void {
    if (this.timerId === undefined) return;
    window.clearTimeout(this.timerId);
    this.timerId = undefined;
    /* A deadline that passed before its callback ran still has a moment left: the toast closes when the pause ends. */
    this.remaining = Math.max(1, this.remaining - (Date.now() - this.timerStartedAt));
  }

  private stopTimer(): void {
    if (this.timerId !== undefined) {
      window.clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }

  private readonly onTimer = (): void => {
    this.timerId = undefined;
    this.remaining = Math.max(0, this.remaining - this.timerSlice);
    if (this.remaining > 0) {
      this.resumeTimer();
      return;
    }
    this.close('timeout');
  };

  private readonly onPointerEnter = (): void => {
    this.hovering = true;
    this.syncTimer();
  };

  private readonly onPointerLeave = (): void => {
    this.hovering = false;
    this.syncTimer();
  };

  private readonly onFocusIn = (): void => {
    this.focusing = true;
    this.syncTimer();
  };

  private readonly onFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    this.focusing = next instanceof Node && (next === this || this.contains(next));
    this.syncTimer();
  };

  private readonly onPointerChange = (event: MediaQueryListEvent): void => {
    this.coarse = event.matches;
  };

  // ---- events -------------------------------------------------------------------------------

  private fireAction(action: NphNotificationAction): void {
    this.dispatchEvent(
      new CustomEvent<NphNotificationActionDetail>(NPH_NOTIFICATION_ACTION_EVENT, {
        detail: { action },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private readonly onCloseClick = (): void => {
    this.close('close-button');
  };

  /** Asks to close; unless the consumer prevents it, the notification hides itself. */
  private close(source: NphNotificationCloseSource): void {
    const event = new CustomEvent<NphNotificationCloseDetail>(NPH_NOTIFICATION_CLOSE_EVENT, {
      detail: { source },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    if (this.dispatchEvent(event)) {
      this.hidden = true;
      this.stopTimer();
      this.armedDuration = 0;
    }
    /* When the consumer prevents it, the toast stays: the time ran out and the timer does not restart. */
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphNotification);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-notification': NphNotification;
  }
}
