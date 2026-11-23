/**
 * `nph-accordion-item` — one section of an `nph-accordion`: a trigger with a title that opens and closes its content.
 *
 * Contract accepted in Figma (documentation frame `7428:43770`, item set `7227:26332`, start set `7227:26993`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-97, sheet `fichas/nph-accordion.md`,
 * `design.md` and decision P136 — nph-accordion and nph-accordion-item: API and semantics. The item is only used
 * inside an `nph-accordion`, which sets the size, the heading level and the region rule on it:
 * - `label`: the title, the accessible name. `description`: a SHORT line under the title, a few words; it is read
 *   inside the name of the button, after the tag and before the status (item 11). A long description goes in the
 *   content, which is the default slot. All texts are already localized by the consuming application: the piece
 *   writes no word of its own;
 * - `start`: the media at the start, one type per list: `icon`, `tile`, `avatar`, `image`, `status-success`,
 *   `status-warning`, `status-error` or `status-pending`; empty draws none. `icon`: the core name of the
 *   `nph-icon` of `icon` and `tile` (`gear` and `folder` when empty). `media-src`: the address of the photo of the
 *   `avatar` or of the picture of the `image`. `start-label`: the hidden text of a `status-*` start when the item
 *   has no end status. The start media is decorative, so it is never named by itself;
 * - `tag`: the short highlight next to the title ("New", "PRO"), an `nph-badge` primary light. `status` and
 *   `status-label`: the end status, an `nph-badge` light of `success`, `warning`, `error` or `pending`, always with
 *   text; without `status-label` it is not drawn, with a development warning;
 * - `indicator`: `end` (default) or `start`. `open`: the current state, as in `<details open>`; it starts closed;
 *   the person changes it and the event says so, setting it from code fires nothing. Reflects. `disabled`: does not
 *   open or close, leaves the Tab order and fades the item; with `open` it is a whole locked section, with the
 *   content in view under the same opacity. `persistent`: an open item the person cannot close (the APG case):
 *   `aria-disabled="true"` on the trigger, which stays in the Tab order, with the plain open look. It opens a closed
 *   item;
 * - `size`, `heading-level` and `region` come from the accordion: the size never changes item by item;
 * - the default slot is the content, free: any piece goes inside it;
 * - `nph-toggle`: `bubbles` and `composed`, with `detail: { open }`, fired only when the person opens or closes the
 *   item (click, Enter, Space, the search of the page or a link to an id inside it), never for an `open` set by the
 *   page;
 * - no `::part`, no color property and no form association.
 *
 * SEMANTICS — the WAI-ARIA APG accordion pattern, revised without arrows, Home or End. The trigger is a `button`
 * with `aria-expanded` and `aria-controls`, the only child of a heading whose level comes from the page (`h3` by
 * default). No `aria-label` on the button, which would hide the tag, the description and the status that are part
 * of the name. The content takes `role="region"` with `aria-labelledby` on the trigger, except when the accordion
 * says that more than about six panels can be open at once. Tab and Shift+Tab reach the triggers; Enter and Space
 * open and close; the focus stays on the trigger; arrows, Home, End and Esc do nothing, and a click outside closes
 * nothing. Closed content is `hidden="until-found"`, so the search of the page finds the text inside it and opens
 * it; with no support for it, the item that holds the `#id` of the address opens on load. A disabled closed item is
 * plain `hidden`.
 *
 * MOVEMENT — the content grows and the indicator turns in `collapsible/expand-duration` with
 * `collapsible/expand-easing`; with reduced motion nothing moves.
 *
 * Invalid input draws nothing and emits `console.error` only in development, once per cause (rule of P21): a
 * `start`, `status`, `indicator`, `size` or `heading-level` outside its list and an `icon` that is not a core name.
 * A `label` that is empty is a mount: it draws nothing and says nothing, because the text may arrive later.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-avatar/nph-avatar';
import '../nph-badge/nph-badge';
import '../nph-icon/nph-icon';
import '../nph-image/nph-image';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import itemCss from './nph-accordion-item.css?inline';

const TAG = 'nph-accordion-item';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The `id` of the trigger and of the content; unique in the shadow root. */
const TRIGGER_ID = 'trigger';
const CONTENT_ID = 'content';

/** The event fired when the person opens or closes the item. */
export const NPH_ACCORDION_ITEM_TOGGLE_EVENT = 'nph-toggle';

export const NPH_ACCORDION_ITEM_STARTS = [
  'icon',
  'tile',
  'avatar',
  'image',
  'status-success',
  'status-warning',
  'status-error',
  'status-pending',
] as const;
export type NphAccordionItemStart = (typeof NPH_ACCORDION_ITEM_STARTS)[number];

export const NPH_ACCORDION_ITEM_STATUSES = ['success', 'warning', 'error', 'pending'] as const;
export type NphAccordionItemStatus = (typeof NPH_ACCORDION_ITEM_STATUSES)[number];

export const NPH_ACCORDION_ITEM_INDICATORS = ['end', 'start'] as const;
export type NphAccordionItemIndicator = (typeof NPH_ACCORDION_ITEM_INDICATORS)[number];

export const NPH_ACCORDION_ITEM_SIZES = ['compact', 'default', 'large'] as const;
export type NphAccordionItemSize = (typeof NPH_ACCORDION_ITEM_SIZES)[number];

/** The detail of `nph-toggle`: the state the item is in now. */
export interface NphAccordionItemToggleDetail {
  open: boolean;
}

/** The icon each status draws at the start, and the `nph-badge` severity it takes at the end. */
const STATUS_ICONS: Record<NphAccordionItemStatus, string> = {
  success: 'circle-check',
  warning: 'triangle-exclamation',
  error: 'circle-xmark',
  pending: 'clock',
};
const STATUS_SEVERITIES: Record<NphAccordionItemStatus, string> = {
  success: 'success',
  warning: 'warn',
  error: 'danger',
  pending: 'secondary',
};

/** The default icon of the `icon` and `tile` starts, as in the Figma start set. */
const DEFAULT_ICONS = { icon: 'gear', tile: 'folder' } as const;

/** The size of the `nph-avatar` and of the `nph-image` that follow the size of the item. */
const AVATAR_SIZES: Record<NphAccordionItemSize, string> = { compact: 'sm', default: 'md', large: 'lg' };
const IMAGE_SIZES: Record<NphAccordionItemSize, string> = { compact: 'xs', default: 'sm', large: 'md' };

/** Where the content is: steady, or growing or shrinking. Internal, not API. */
type Phase = 'closed' | 'opening' | 'open' | 'closing';

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devMessage(kind: 'error' | 'warn', message: string): void {
  if (import.meta.env?.DEV) {
    console[kind](`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** The longest time of a `transition-duration` value (`0.25s`, `250ms`, `0s, 0.2s`), in milliseconds. */
function longestDuration(value: string): number {
  let longest = 0;
  for (const part of value.split(',')) {
    const trimmed = part.trim();
    const amount = Number.parseFloat(trimmed);
    if (!Number.isFinite(amount)) continue;
    longest = Math.max(longest, trimmed.endsWith('ms') ? amount : amount * 1000);
  }
  return longest;
}

/** Whether the browser knows `hidden="until-found"`: it is the one that fires `beforematch`. */
/* cspell:ignore onbeforematch */
function supportsUntilFound(): boolean {
  return 'onbeforematch' in HTMLElement.prototype;
}

export class NphAccordionItem extends LitElement {
  static override styles = unsafeCSS(itemCss);

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    label: { type: String },
    description: { type: String },
    start: { type: String },
    icon: { type: String },
    mediaSrc: { type: String, attribute: 'media-src' },
    startLabel: { type: String, attribute: 'start-label' },
    tag: { type: String },
    status: { type: String },
    statusLabel: { type: String, attribute: 'status-label' },
    indicator: { type: String, reflect: true },
    open: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    persistent: { type: Boolean, reflect: true },
    /* Set by the accordion. */
    size: { type: String, reflect: true },
    headingLevel: { type: Number, attribute: 'heading-level' },
    region: { attribute: false },
    phase: { state: true },
  };

  /** The title of the trigger, its accessible name. Already localized. */
  declare label: string;
  /** The short line under the title, read inside the name of the button. Already localized. */
  declare description: string;
  /** The media at the start. Empty draws none. */
  declare start: NphAccordionItemStart | '';
  /** The core name of the icon of the `icon` and `tile` starts. */
  declare icon: string;
  /** The address of the photo of the `avatar` start, or of the picture of the `image` start. */
  declare mediaSrc: string;
  /** The hidden text of a `status-*` start, when the item has no end status. Already localized. */
  declare startLabel: string;
  /** The short highlight next to the title. Already localized. */
  declare tag: string;
  /** The end status. Needs `status-label`. */
  declare status: NphAccordionItemStatus | '';
  /** The text of the end status. Already localized. */
  declare statusLabel: string;
  declare indicator: NphAccordionItemIndicator;
  /** The current state: open or closed. The person changes it and `nph-toggle` says so. */
  declare open: boolean;
  declare disabled: boolean;
  /** An open item the person cannot close. */
  declare persistent: boolean;
  /** Set by the accordion: the size of every item. */
  declare size: NphAccordionItemSize;
  /** Set by the accordion: the level of the heading that holds the trigger. */
  declare headingLevel: number;
  /** Set by the accordion: whether the content takes `role="region"`. */
  declare region: boolean;
  /** Growing or shrinking, or steady. Internal. */
  declare protected phase: Phase;

  private valid = false;
  private reported = new Set<string>();
  private settleTimer: ReturnType<typeof setTimeout> | undefined;
  /** The page search opened the item: the browser scrolls to the text it found, so the content opens at once. */
  private instant = false;

  constructor() {
    super();
    this.label = '';
    this.description = '';
    this.start = '';
    this.icon = '';
    this.mediaSrc = '';
    this.startLabel = '';
    this.tag = '';
    this.status = '';
    this.statusLabel = '';
    this.indicator = 'end';
    this.open = false;
    this.disabled = false;
    this.persistent = false;
    this.size = 'default';
    this.headingLevel = 3;
    this.region = true;
    this.phase = 'closed';
  }

  /* The host takes no focus of its own: `delegatesFocus` would send a click on the content to the trigger. */
  override focus(options?: FocusOptions): void {
    this.trigger?.focus(options);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('hashchange', this.onHashChange);
    /* An item moved to another place starts from a steady state; the update rewrites the attributes. */
    if (this.hasUpdated) {
      this.phase = this.open ? 'open' : 'closed';
      this.requestUpdate();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this.onHashChange);
    this.stopSettling();
    this.phase = this.open ? 'open' : 'closed';
  }

  /* ----- validation -------------------------------------------------------- */

  private report(kind: 'error' | 'warn', message: string): void {
    if (this.reported.has(message)) return;
    this.reported.add(message);
    devMessage(kind, message);
  }

  /** Whether the input is one the item draws. A cause is reported once, whatever the number of updates. */
  private validate(): boolean {
    const start = text(this.start);
    const status = text(this.status);
    const indicator = this.indicator ?? '';
    const size = this.size ?? '';
    const icon = text(this.icon);
    const level = this.headingLevel;
    let valid = true;

    if (start !== '' && !oneOf(NPH_ACCORDION_ITEM_STARTS, start)) {
      this.report('error', `start "${start}" does not exist. Use ${NPH_ACCORDION_ITEM_STARTS.join(', ')}.`);
      valid = false;
    }
    if (status !== '' && !oneOf(NPH_ACCORDION_ITEM_STATUSES, status)) {
      this.report('error', `status "${status}" does not exist. Use ${NPH_ACCORDION_ITEM_STATUSES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_ACCORDION_ITEM_INDICATORS, indicator)) {
      this.report('error', `indicator "${indicator}" does not exist. Use ${NPH_ACCORDION_ITEM_INDICATORS.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_ACCORDION_ITEM_SIZES, size)) {
      this.report('error', `size "${size}" does not exist. Use ${NPH_ACCORDION_ITEM_SIZES.join(', ')}.`);
      valid = false;
    }
    if (!Number.isInteger(level) || level < 1 || level > 6) {
      this.report('error', `heading-level "${String(level)}" does not exist. Use a whole number from 1 to 6.`);
      valid = false;
    }
    if (icon !== '' && !isCoreName(icon)) {
      this.report('error', `icon "${icon}" is not a core name of nph-icon.`);
      valid = false;
    }

    if (valid) {
      if (icon !== '' && start !== 'icon' && start !== 'tile') {
        this.report('warn', 'icon is for the icon and tile starts, so it is ignored.');
      }
      if (text(this.mediaSrc) !== '' && start !== 'avatar' && start !== 'image') {
        this.report('warn', 'media-src is for the avatar and image starts, so it is ignored.');
      }
      if (status !== '' && text(this.statusLabel) === '') {
        this.report('warn', 'status needs status-label: a status is always shown with text, so it is not drawn.');
      }
      if (start.startsWith('status-') && status === '' && text(this.startLabel) === '') {
        this.report('warn', 'a status start with no end status needs start-label: without it the icon says nothing to a screen reader.');
      }
    }
    return valid;
  }

  /* ----- state ------------------------------------------------------------- */

  private get trigger(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(`#${TRIGGER_ID}`);
  }

  private get content(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(`#${CONTENT_ID}`);
  }

  /** The time the content takes to grow, from the style the browser resolved: 0 with reduced motion. */
  private growDuration(): number {
    const panel = this.renderRoot.querySelector<HTMLElement>('.panel');
    return panel === null ? 0 : longestDuration(getComputedStyle(panel).transitionDuration);
  }

  private stopSettling(): void {
    clearTimeout(this.settleTimer);
    this.settleTimer = undefined;
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    this.valid = this.validate();
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid && text(this.label) !== '');

    /* An item the person cannot close is an open one. */
    if (this.persistent && !this.open) this.open = true;

    const steady: Phase = this.open ? 'open' : 'closed';
    if (!this.hasUpdated || !this.valid) {
      this.stopSettling();
      this.phase = steady;
    } else if (changed.has('open')) {
      if (this.instant || this.growDuration() === 0) {
        this.stopSettling();
        this.phase = steady;
      } else {
        /* A new direction while the content still moves: the transition reverses and ends once, in the new direction. */
        this.stopSettling();
        this.phase = this.open ? 'opening' : 'closing';
      }
    }
  }

  protected override firstUpdated(): void {
    this.openForAddress();
  }

  protected override updated(changed: PropertyValues<this>): void {
    this.applyHidden();
    if (this.instant) this.openWithoutMovement();

    if (this.phase === 'opening' || this.phase === 'closing') {
      this.settleSoon();
    }
    if (changed.has('open') && !this.open && this.hasUpdated && this.matches(':focus-within')) {
      /* Closed from the page with the focus inside the content: the focus goes to the trigger, not to the page. */
      this.trigger?.focus();
    }
  }

  /**
   * Opened by the page search, as the native details element does: no growth, because the browser scrolls to the
   * text it found while the content is still cut. The transition is held back for the length of one style
   * recalculation, so the rows of the grid jump to the end.
   */
  private openWithoutMovement(): void {
    this.instant = false;
    const panel = this.renderRoot.querySelector<HTMLElement>('.panel');
    if (panel === null) return;
    panel.style.transition = 'none';
    void panel.offsetHeight;
    panel.style.transition = '';
  }

  /** A safety net for the end of the growth: a transition never ends in a box that is not rendered. */
  private settleSoon(): void {
    if (this.settleTimer !== undefined) return;
    const wait = this.growDuration();
    this.settleTimer = setTimeout(() => this.settle(), wait + 50);
  }

  /** The growth is over: the content is steady, open or closed. */
  private settle(): void {
    this.stopSettling();
    if (this.phase === 'opening') this.phase = 'open';
    else if (this.phase === 'closing') this.phase = 'closed';
  }

  private onTransitionEnd(event: TransitionEvent): void {
    if (event.target !== event.currentTarget || event.propertyName !== 'grid-template-rows') return;
    this.settle();
  }

  /**
   * Closed content is `hidden="until-found"`: out of the Tab order and out of the accessibility tree, and found by
   * the search of the page. The attribute is written here and not bound in the template: the browser removes it by
   * itself when the search opens the content, and a binding would not write it back. A disabled closed content is
   * plain `hidden`. It stays visible while it shrinks or grows.
   */
  private applyHidden(): void {
    const content = this.content;
    if (content === null) return;
    if (this.phase === 'closed') {
      content.setAttribute('hidden', this.disabled ? 'hidden' : 'until-found');
    } else {
      content.removeAttribute('hidden');
    }
    content.toggleAttribute('inert', this.phase === 'closing');
  }

  /* ----- the address ------------------------------------------------------- */

  /**
   * With no support for `hidden="until-found"` the browser cannot open the item by itself: the item that holds the
   * element of the `#id` of the address opens. A browser that supports it does this alone, so nothing is done.
   */
  private openForAddress(): void {
    if (supportsUntilFound() || this.open || this.disabled || !this.valid) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id === '') return;
    const target = this.ownerDocument.getElementById(id);
    if (target === null || (target !== this && !this.contains(target))) return;
    this.instant = true;
    this.open = true;
    this.announce();
  }

  private onHashChange = (): void => this.openForAddress();

  /* ----- events ------------------------------------------------------------ */

  /** The person opens or closes the item. */
  private activate = (): void => {
    if (this.disabled || this.persistent) return;
    this.open = !this.open;
    this.announce();
  };

  /** The search of the page found text inside the closed content: the browser shows it and the item follows. */
  private onFound = (): void => {
    if (this.open) return;
    this.instant = true;
    this.open = true;
    this.announce();
  };

  private announce(): void {
    this.dispatchEvent(
      /* The literal name, so the manifest of the package lists the event. */
      new CustomEvent<NphAccordionItemToggleDetail>('nph-toggle', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /* ----- render ------------------------------------------------------------ */

  private renderIndicator(): TemplateResult {
    const atStart = this.indicator === 'start';
    return html`<nph-icon
      class="indicator"
      name=${atStart ? 'chevron-right' : 'chevron-down'}
      size="sm"
      aria-hidden="true"
    ></nph-icon>`;
  }

  /** The start media: decorative, centered on the text block, with its own gap to the title. */
  private renderStart(): TemplateResult | typeof nothing {
    const start = text(this.start);
    if (start === '') return nothing;
    const size = this.size;
    if (start === 'icon') {
      const name = text(this.icon) || DEFAULT_ICONS.icon;
      return html`<span class="start start-tight"><nph-icon class="icon" name=${name} size="sm" aria-hidden="true"></nph-icon></span>`;
    }
    if (start === 'tile') {
      const name = text(this.icon) || DEFAULT_ICONS.tile;
      return html`<span class="start start-wide"
        ><span class="tile"><nph-icon name=${name} size=${size === 'large' ? 'lg' : 'sm'} aria-hidden="true"></nph-icon></span
      ></span>`;
    }
    if (start === 'avatar') {
      return html`<span class="start start-wide"><nph-avatar size=${AVATAR_SIZES[size]} src=${text(this.mediaSrc)}></nph-avatar></span>`;
    }
    if (start === 'image') {
      return html`<span class="start start-wide"
        ><nph-image size=${IMAGE_SIZES[size]} ratio="1:1" src=${text(this.mediaSrc)} alt=""></nph-image
      ></span>`;
    }
    const status = start.slice('status-'.length) as NphAccordionItemStatus;
    return html`<span class="start start-tight"
      ><nph-icon class="status-icon" data-status=${status} name=${STATUS_ICONS[status]} size="sm" aria-hidden="true"></nph-icon
    ></span>`;
  }

  /** The end status: a light badge with text. Without text it is not drawn. */
  private renderEnd(): TemplateResult | typeof nothing {
    const status = text(this.status);
    const label = text(this.statusLabel);
    if (status === '' || label === '') return nothing;
    return html`<span class="end"
      ><nph-badge severity=${STATUS_SEVERITIES[status as NphAccordionItemStatus]} emphasis="light" text=${label}></nph-badge
    ></span>`;
  }

  private renderTrigger(): TemplateResult {
    const description = text(this.description);
    const tag = text(this.tag);
    const atStart = this.indicator === 'start';
    const locked = this.persistent && !this.disabled;
    /* A status start with no end status says its meaning in a hidden text; with the end status the icon is decoration. */
    const hasEnd = text(this.status) !== '' && text(this.statusLabel) !== '';
    const startLabel = text(this.start).startsWith('status-') && !hasEnd ? text(this.startLabel) : '';
    return html`<div class="heading" role="heading" aria-level=${this.headingLevel}>
      <button
        class="trigger"
        id=${TRIGGER_ID}
        type="button"
        ?disabled=${this.disabled}
        aria-expanded=${String(this.open)}
        aria-controls=${CONTENT_ID}
        aria-disabled=${locked ? 'true' : nothing}
        @click=${this.activate}
      >
        ${atStart ? this.renderIndicator() : nothing} ${this.renderStart()}
        <span class="text">
          <span class="title-line">
            <span class="title">${text(this.label)}</span>
            ${tag !== '' ? html`<nph-badge class="tag" severity="primary" emphasis="light" text=${tag}></nph-badge>` : nothing}
          </span>
          ${description !== '' ? html`<span class="description">${description}</span>` : nothing}
        </span>
        ${this.renderEnd()} ${atStart ? nothing : this.renderIndicator()}
        ${startLabel !== '' ? html`<span class="assistive">${startLabel}</span>` : nothing}
      </button>
    </div>`;
  }

  /** The content: free, in the default slot, indented to the title when the indicator comes first. */
  private renderPanel(): TemplateResult {
    return html`<div class="panel" data-state=${this.phase} @transitionend=${this.onTransitionEnd}>
      <div
        class="clip"
        id=${CONTENT_ID}
        role=${this.region ? 'region' : nothing}
        aria-labelledby=${this.region ? TRIGGER_ID : nothing}
        @beforematch=${this.onFound}
      >
        <div class="content">
          ${this.indicator === 'start' ? html`<span class="indent" aria-hidden="true"></span>` : nothing}
          <div class="body"><slot></slot></div>
        </div>
      </div>
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid || text(this.label) === '') {
      return nothing;
    }
    return html`<div class="item">${this.renderTrigger()} ${this.renderPanel()}</div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphAccordionItem);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-accordion-item': NphAccordionItem;
  }
}
