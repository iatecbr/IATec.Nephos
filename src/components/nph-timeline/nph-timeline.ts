/**
 * `nph-timeline` — a vertical list of events in order, linked by a connector line. It records and does not
 * navigate: it shows where a process is, or what happened to a record.
 *
 * Contract accepted in Figma (documentation frame `5237:3423`, root `5226:2261`, sets `5216:304` and
 * `5216:701`), recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-89, sheet
 * `fichas/nph-timeline.md`, `design.md` and decision P132 — nph-timeline: API and semantics:
 * - ONE tag. The events are `items`, a list of `{ id, title, description, who, when, datetime, status, marker,
 *   icon, avatar, typeLabel, action, actionDisabled }`. Property only. A list, not child elements, because the
 *   `ol` and its `li` must live in one shadow root for the list semantics (the precedent is the `steps` of
 *   `nph-stepper`). `title` is required and already localized. `description` is the line under it. `who` and
 *   `when` make the meta line, who first, with a middle dot between them; `when` is the absolute date already
 *   formatted by the product (a relative date, such as "2 h ago", is the product's too) and `datetime` is the value
 *   of its `time`. `typeLabel` is the hidden text that says the event type when the title does not. `action` is the
 *   label of a secondary ghost `nph-button` below the text; `actionDisabled` puts only that button under the
 *   disabled opacity;
 * - `type` (the Figma `tipo`): `process` (default), the steps of a flow with the state of each one, or `history`,
 *   the events of a record. Reflects. It sets the marker an item takes when it names none (`circle` on the process,
 *   `dot` on the history) and nothing else: the two types share one layout;
 * - `marker` (the Figma `marcador`): `dot`, `circle` or `avatar`. The circle carries the state and, when neutral,
 *   the event icon in `icon`; the avatar is an `nph-avatar` `sm` with the photo in `avatar` and no circle around it.
 *   `status` (the Figma `estado`): `neutral` (default), `completed`, `current`, `pending`, `error` or `warning`. Only
 *   the circle has a state: on a dot or an avatar it is ignored, with a development warning. The icon of a state is
 *   fixed (check, circle-xmark, triangle-exclamation), so `icon` is read on the neutral circle only;
 * - the item has no interaction state: no hover, pressed, focus, selected or disabled. Its states are status values;
 * - `label` and the host `aria-label` name the list; `labelledBy`, an element, names it by a visible title
 *   (`aria-labelledby` cannot cross the shadow root, so it is given as an element, property only);
 * - `has-more` shows the ghost "Show more" button outside the list, after it. The timeline loads nothing: the button
 *   fires `nph-timeline-more` and the product appends the earlier events at the end of `items` and turns `has-more`
 *   off on the last batch. The button shows at all times it is on, so an item with `has-more` and no `more-label` is a
 *   warning;
 * - `live`: the list gets events without the person acting (new events come in at the start). On, a growth of the
 *   list is announced by `new-label`. "Show more" is always announced, by `loaded-label`; both take `{count}`;
 * - `loading` (`aria-busy`) draws skeleton rows in place of the items, with the hidden `loading-label`. A list with no
 *   items and no `loading` draws an `nph-empty` with `empty-heading` and `empty-description`;
 * - the hidden state texts, the waiting word and every other word are already localized by the consuming
 *   application, as in `nph-stepper`: `completed-label`, `current-label`, `error-label`, `warning-label`
 *   (hidden, at the start of the item), `pending-label` (visible: the word that says the step is waiting),
 *   `loading-label`, `more-label`, `new-label`, `loaded-label`, `empty-heading` and `empty-description`. The middle
 *   dot of the meta line is punctuation, not a word, and is written here;
 * - own events `nph-timeline-action`, `detail: { index, id }`, when the person activates the action of an item, and
 *   `nph-timeline-more`, with no detail, when the person activates "Show more"; both `bubbles` and `composed`. The
 *   click of an action or of the button is also the native `click`;
 * - a slot named as the `id` of an item (the precedent is `nph-tabs`, whose panel slot is named as its `value`):
 *   what goes in it is drawn below the text and the action, for rich content such as an `nph-card`. The timeline
 *   does not style it. An item without `id` has no slot;
 * - no `::part`, no color property and no form association.
 *
 * SEMANTICS — an ordered list (`ol` and `li`) with a name, and no role of its own: the APG has no timeline pattern
 * and the Feed pattern does not apply (it loads on scroll; the timeline loads by "Show more"). The marker and the
 * connector line are `aria-hidden`; the status goes in the item text, in a hidden text at the start of the title
 * (the pending item already says it is waiting, and the neutral item has none). The date is a `time` with `datetime`.
 * Only the actions and "Show more" take Tab, in list order; nothing else takes focus and the arrows do nothing. The
 * current item of the process type has `aria-current="step"`, on one item; the history never has it. A short
 * `aria-live="polite"` region outside the list announces the arrival of events. "Show more" keeps the focus while there
 * are more events; on the last batch the button goes away and the focus moves to the first new item (a Nephos choice:
 * without the button the focus needs a destination), which takes `tabindex="-1"` only while it holds it.
 *
 * THE CONNECTOR LINE — an `nph-separator` vertical, with its thickness from `border/width`; the item paints the color
 * of the separator it holds, `timeline/connector-border`, and the pending item leaves it as it is, `color/border`
 * (the styles of the outer tree win over the `:host` of the separator, so `nph-separator` changes nothing). It sits
 * at half of the marker column, a whole pixel, with no `transform`, so the 1 px line stays sharp (item 12). It runs
 * from the marker to the bottom of the item, a gap away from each, and the last item has none.
 *
 * COMBINED STATES (rule T11) — none: the item states are status values, one per item, and do not combine. A disabled
 * action keeps the item as it is.
 *
 * MOTION — none. The timeline animates nothing, so there is nothing to go away under `prefers-reduced-motion`.
 *
 * Invalid input draws nothing and emits `console.error` only in development, one per cause (P66 rule): `items` that
 * is not a list; an item that is not an object or has no `title`; a `status`, `marker` or `type` outside the list.
 * A list with no accessible name, a status with no hidden text, a `when` with no `datetime`, `has-more` with no
 * `more-label`, `live` with no `new-label`, a status on a dot or an avatar, more than one current item and a repeated
 * `id` draw and warn once: the texts may arrive after the first render. An empty `items` is a mount.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-avatar/nph-avatar';
import '../nph-button/nph-button';
import '../nph-empty/nph-empty';
import '../nph-icon/nph-icon';
import '../nph-separator/nph-separator';
import '../nph-skeleton/nph-skeleton';
import timelineCss from './nph-timeline.css?inline';

const TAG = 'nph-timeline';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The events the timeline fires. */
export const NPH_TIMELINE_ACTION_EVENT = 'nph-timeline-action';
export const NPH_TIMELINE_MORE_EVENT = 'nph-timeline-more';

/** The Figma `tipo`. */
export const NPH_TIMELINE_TYPES = ['process', 'history'] as const;
export type NphTimelineType = (typeof NPH_TIMELINE_TYPES)[number];

/** The Figma `estado`. */
export const NPH_TIMELINE_STATUSES = ['neutral', 'completed', 'current', 'pending', 'error', 'warning'] as const;
export type NphTimelineStatus = (typeof NPH_TIMELINE_STATUSES)[number];

/** The Figma `marcador`. */
export const NPH_TIMELINE_MARKERS = ['dot', 'circle', 'avatar'] as const;
export type NphTimelineMarker = (typeof NPH_TIMELINE_MARKERS)[number];

/** How many skeleton rows the loading state draws (the contract names no number). */
export const NPH_TIMELINE_LOADING_ROWS = 3;

/** The icon each state draws in its circle. The current item draws a center dot and the pending one nothing. */
const STATE_ICONS: Partial<Record<NphTimelineStatus, string>> = {
  completed: 'check',
  error: 'circle-xmark',
  warning: 'triangle-exclamation',
};

/** One event. */
export interface NphTimelineItem {
  /** Names the slot for rich content below the item, and the item in the events. */
  id?: string;
  /** The title of the event. Already localized. */
  title: string;
  /** The line below the title. Already localized. */
  description?: string;
  /** Who did it, or who it waits for. Already localized. */
  who?: string;
  /** When it happened, the absolute date already formatted (and the relative one, if the product wants it). */
  when?: string;
  /** The machine value of `when`, the `datetime` of its `time` element. */
  datetime?: string;
  /** The Figma `estado`. `neutral` by default; only the circle has a state. */
  status?: NphTimelineStatus;
  /** The Figma `marcador`. `circle` on the process type and `dot` on the history by default. */
  marker?: NphTimelineMarker;
  /** The event type icon of the neutral circle, a core `nph-icon` name. */
  icon?: string;
  /** The photo address of the avatar marker. Without it the avatar draws the person icon. */
  avatar?: string;
  /** The hidden text that tells the event type, when the title does not. Already localized. */
  typeLabel?: string;
  /** The label of the action, a secondary ghost button below the text. Already localized. */
  action?: string;
  /** Puts only the action button under the disabled opacity. */
  actionDisabled?: boolean;
}

/** The detail of `nph-timeline-action`. */
export interface NphTimelineActionDetail {
  /** The position of the item, from zero. */
  index: number;
  /** The `id` of the item, or `null`. */
  id: string | null;
}

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devMessage(kind: 'error' | 'warn', message: string): void {
  if (import.meta.env?.DEV) {
    console[kind](`[${TAG}] ${message}`);
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** The `{count}` marker of the announcements. */
const COUNT = /\{count\}/g;

export class NphTimeline extends LitElement {
  static override styles = unsafeCSS(timelineCss);

  static override properties = {
    items: { attribute: false },
    type: { type: String, reflect: true },
    label: { type: String },
    /* The host `aria-label` is the accessible name when there is no `label`. It cannot be a property called
     * `ariaLabel`: that name is the native ARIA reflection of every element. */
    hostName: { type: String, attribute: 'aria-label' },
    labelledBy: { attribute: false },
    hasMore: { type: Boolean, attribute: 'has-more', reflect: true },
    loading: { type: Boolean, reflect: true },
    live: { type: Boolean, reflect: true },
    completedLabel: { type: String, attribute: 'completed-label' },
    currentLabel: { type: String, attribute: 'current-label' },
    pendingLabel: { type: String, attribute: 'pending-label' },
    errorLabel: { type: String, attribute: 'error-label' },
    warningLabel: { type: String, attribute: 'warning-label' },
    loadingLabel: { type: String, attribute: 'loading-label' },
    moreLabel: { type: String, attribute: 'more-label' },
    newLabel: { type: String, attribute: 'new-label' },
    loadedLabel: { type: String, attribute: 'loaded-label' },
    emptyHeading: { type: String, attribute: 'empty-heading' },
    emptyDescription: { type: String, attribute: 'empty-description' },
    announcement: { state: true },
  };

  /** The events, in order. */
  declare items: readonly NphTimelineItem[];

  /** `process` (default) or `history`. */
  declare type: NphTimelineType;

  /** The accessible name of the list. Already localized. */
  declare label: string | null;

  /** The host `aria-label`, the accessible name when `label` is not given. */
  declare hostName: string | null;

  /** A visible title that names the list, as an element. Property only. */
  declare labelledBy: Element | null;

  /** Shows "Show more" after the list. */
  declare hasMore: boolean;

  /** Draws skeleton rows in place of the items. */
  declare loading: boolean;

  /** The list gets events without the person acting: a growth is announced. */
  declare live: boolean;

  declare completedLabel: string | null;
  declare currentLabel: string | null;
  declare pendingLabel: string | null;
  declare errorLabel: string | null;
  declare warningLabel: string | null;
  declare loadingLabel: string | null;
  declare moreLabel: string | null;
  declare newLabel: string | null;
  declare loadedLabel: string | null;
  declare emptyHeading: string | null;
  declare emptyDescription: string | null;

  /** The text of the live region. Not API. */
  declare protected announcement: string;

  private problem: string | null = null;
  private reported = '';
  private warned = new Set<string>();
  /** The person activated "Show more" and the earlier events have not come yet. */
  private moreRequested = false;
  /** The position where the batch that just came in starts, or -1 when no batch is waiting for the focus. */
  private batchStart = -1;
  /** The focus was on "Show more" when the list changed, so it needs a destination if the button goes away. */
  private focusWasOnMore = false;
  private announceToggle = false;

  constructor() {
    super();
    this.items = [];
    this.type = 'process';
    this.label = null;
    this.hostName = null;
    this.labelledBy = null;
    this.hasMore = false;
    this.loading = false;
    this.live = false;
    this.completedLabel = null;
    this.currentLabel = null;
    this.pendingLabel = null;
    this.errorLabel = null;
    this.warningLabel = null;
    this.loadingLabel = null;
    this.moreLabel = null;
    this.newLabel = null;
    this.loadedLabel = null;
    this.emptyHeading = null;
    this.emptyDescription = null;
    this.announcement = '';
  }

  /* ----- validation -------------------------------------------------------- */

  /** An empty list is a mount, not a problem. */
  private get empty(): boolean {
    return Array.isArray(this.items) && this.items.length === 0;
  }

  /** The reason the input is invalid, or `null`. */
  private validate(): string | null {
    if (!(NPH_TIMELINE_TYPES as readonly string[]).includes(this.type)) {
      return `type "${String(this.type)}" does not exist. Use ${NPH_TIMELINE_TYPES.map((value) => `"${value}"`).join(', ')}.`;
    }
    const items = this.items;
    if (!Array.isArray(items)) {
      return '`items` is not a list. Give it the events, in order.';
    }
    for (const [index, item] of items.entries()) {
      const where = `item ${String(index + 1)}`;
      if (item === null || typeof item !== 'object' || text(item.title) === '') {
        return `${where} has no \`title\`.`;
      }
      if (item.status !== undefined && item.status !== null && !(NPH_TIMELINE_STATUSES as readonly string[]).includes(item.status)) {
        return `status "${String(item.status)}" of ${where} does not exist. Use ${NPH_TIMELINE_STATUSES.map((value) => `"${value}"`).join(', ')}.`;
      }
      if (item.marker !== undefined && item.marker !== null && !(NPH_TIMELINE_MARKERS as readonly string[]).includes(item.marker)) {
        return `marker "${String(item.marker)}" of ${where} does not exist. Use ${NPH_TIMELINE_MARKERS.map((value) => `"${value}"`).join(', ')}.`;
      }
    }
    return null;
  }

  /* ----- what an item is --------------------------------------------------- */

  private markerOf(item: NphTimelineItem): NphTimelineMarker {
    return item.marker ?? (this.type === 'history' ? 'dot' : 'circle');
  }

  /** The state of the item: only the circle has one. */
  private statusOf(item: NphTimelineItem): NphTimelineStatus {
    return this.markerOf(item) === 'circle' ? (item.status ?? 'neutral') : 'neutral';
  }

  /** The position of the item that carries `aria-current`: the first current one, on the process type only. */
  private currentIndex(): number {
    if (this.type !== 'process') return -1;
    return this.items.findIndex((item) => this.statusOf(item) === 'current');
  }

  /** The hidden text that opens the item, by its status; neutral has none and the pending item says it is waiting. */
  private statusText(status: NphTimelineStatus): string {
    if (status === 'completed') return text(this.completedLabel);
    if (status === 'current') return text(this.currentLabel);
    if (status === 'error') return text(this.errorLabel);
    if (status === 'warning') return text(this.warningLabel);
    return '';
  }

  /** The name of the list: `label`, else the host `aria-label`. `null` when there is none. */
  private name(): string | null {
    const label = text(this.label);
    if (label !== '') return label;
    const host = text(this.hostName);
    return host === '' ? null : host;
  }

  private hasName(): boolean {
    return this.name() !== null || this.labelledBy !== null;
  }

  private template(value: string | null, count: number): string {
    return text(value).replace(COUNT, String(count));
  }

  /* ----- life cycle -------------------------------------------------------- */

  protected override willUpdate(changed: PropertyValues<this>): void {
    this.problem = this.validate();
    if (this.problem !== null) {
      /* One message per cause: a re-render with the same input stays silent. */
      if (this.problem !== this.reported) {
        devMessage('error', this.problem);
      }
      this.reported = this.problem;
    } else {
      this.reported = '';
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.problem === null && this.showsSomething());

    if (this.hasUpdated) {
      const more = this.renderRoot.querySelector('.more');
      this.focusWasOnMore = more !== null && this.shadowRoot?.activeElement === more;
    }
    if (changed.has('items') && this.problem === null) {
      const before = changed.get('items') as readonly NphTimelineItem[] | undefined;
      const previous = Array.isArray(before) ? before.length : 0;
      const grew = this.items.length - previous;
      if (this.hasUpdated && grew > 0 && previous > 0) {
        if (this.moreRequested) {
          this.batchStart = previous;
          this.announce(this.template(this.loadedLabel, grew));
        } else if (this.live) {
          this.announce(this.template(this.newLabel, grew));
        }
        this.moreRequested = false;
      }
    }
    /* A request that ended with no more events to load is over: a later growth is not the answer to it. */
    if (!this.hasMore) {
      this.moreRequested = false;
    }
  }

  /** Whether anything is drawn: items, the loading rows or the empty state. */
  private showsSomething(): boolean {
    if (!Array.isArray(this.items)) return false;
    if (this.loading) return true;
    return this.items.length > 0 || text(this.emptyHeading) !== '';
  }

  protected override updated(): void {
    if (this.problem !== null) {
      return;
    }
    this.warnOnProblems();
    /* The last batch: the button went away with the focus on it, so the focus goes to the first new item. */
    if (this.focusWasOnMore && !this.hasMore) {
      this.focusWasOnMore = false;
      const rows = [...this.renderRoot.querySelectorAll<HTMLElement>('.item')];
      const target = rows[this.batchStart === -1 ? rows.length - 1 : this.batchStart] ?? rows.at(-1);
      this.batchStart = -1;
      if (target !== undefined) {
        target.tabIndex = -1;
        target.focus();
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    }
    /* The start of the batch is only for the focus above: a batch with more still to load keeps the focus where it was. */
    this.batchStart = -1;
  }

  /** The texts the consumer owes: drawn without them, and said once, since they may arrive later. */
  private warnOnProblems(): void {
    if (this.empty || this.loading) {
      if (this.empty && !this.loading && text(this.emptyHeading) === '') {
        this.warnOnce('empty-heading', 'the list has no events and no `empty-heading`: nothing is drawn. Give it the title of the empty state.');
      }
      if (this.loading && text(this.loadingLabel) === '') {
        this.warnOnce('loading-label', 'the list is loading and has no hidden text. Give it `loading-label`.');
      }
      return;
    }
    if (!this.hasName()) {
      this.warnOnce('name', 'the list has no accessible name. Give it a `label`, an `aria-label` or `labelledBy`.');
    }
    const looks = this.items.map((item) => this.statusOf(item));
    for (const [status, property] of [
      ['completed', 'completed-label'],
      ['current', 'current-label'],
      ['pending', 'pending-label'],
      ['error', 'error-label'],
      ['warning', 'warning-label'],
    ] as const) {
      const present = looks.includes(status);
      const value = status === 'pending' ? text(this.pendingLabel) : this.statusText(status);
      if (present && value === '') {
        this.warnOnce(property, `an item is ${status} and has no text for it. Give the list \`${property}\`.`);
      }
    }
    if (this.items.some((item) => this.markerOf(item) !== 'circle' && item.status !== undefined && item.status !== 'neutral')) {
      this.warnOnce('state-on-marker', 'only the circle marker has a state: the `status` of a dot or an avatar is ignored.');
    }
    if (looks.filter((status) => status === 'current').length > 1) {
      this.warnOnce('current', 'more than one item is current: the first one takes `aria-current`.');
    }
    if (this.items.some((item) => text(item.when) !== '' && text(item.datetime) === '')) {
      this.warnOnce('datetime', 'an item has `when` and no `datetime`: the date is not a `time` element. Give it the machine value.');
    }
    const ids = this.items.map((item) => text(item.id)).filter((id) => id !== '');
    if (new Set(ids).size !== ids.length) {
      this.warnOnce('id', 'two items have the same `id`: the slot of the second one gets no content.');
    }
    if (this.hasMore && text(this.moreLabel) === '') {
      this.warnOnce('more-label', '`has-more` is on and there is no `more-label`: the button has no text. Give it the label.');
    }
    if (this.live && text(this.newLabel) === '') {
      this.warnOnce('new-label', '`live` is on and there is no `new-label`: new events are not announced. Give it the text, with {count}.');
    }
  }

  private warnOnce(key: string, message: string): void {
    if (!this.warned.has(key)) {
      this.warned.add(key);
      devMessage('warn', message);
    }
  }

  /** Writes the live region. The same text twice in a row still reads: a non-breaking space changes it. */
  private announce(message: string): void {
    if (message === '') return;
    this.announceToggle = !this.announceToggle;
    this.announcement = this.announceToggle ? message : `${message} `;
  }

  /* ----- events ------------------------------------------------------------ */

  private onAction(index: number): void {
    const item = this.items[index] as NphTimelineItem;
    if (item.actionDisabled === true) return;
    const id = text(item.id);
    this.dispatchEvent(
      new CustomEvent<NphTimelineActionDetail>(NPH_TIMELINE_ACTION_EVENT, {
        detail: { index, id: id === '' ? null : id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onMore(): void {
    this.moreRequested = true;
    this.dispatchEvent(new CustomEvent(NPH_TIMELINE_MORE_EVENT, { bubbles: true, composed: true }));
  }

  /* ----- rendering --------------------------------------------------------- */

  private renderMarker(item: NphTimelineItem, status: NphTimelineStatus): TemplateResult {
    const kind = this.markerOf(item);
    if (kind === 'dot') {
      return html`<span class="marker" aria-hidden="true"><span class="dot"></span></span>`;
    }
    if (kind === 'avatar') {
      return html`<span class="marker" aria-hidden="true"><nph-avatar size="sm" src=${text(item.avatar)}></nph-avatar></span>`;
    }
    const icon = status === 'neutral' ? text(item.icon) : (STATE_ICONS[status] ?? '');
    const glyph =
      status === 'current'
        ? html`<span class="center-dot"></span>`
        : icon === ''
          ? nothing
          : html`<nph-icon class="marker-icon" name=${icon} variant="light" size="sm"></nph-icon>`;
    return html`<span class="marker" aria-hidden="true">${glyph}</span>`;
  }

  /** The meta line: who and when with a middle dot between them; the pending item starts with the waiting word. */
  private renderMeta(item: NphTimelineItem, status: NphTimelineStatus): TemplateResult | typeof nothing {
    const who = text(item.who);
    const when = text(item.when);
    const waiting = status === 'pending' ? text(this.pendingLabel) : '';
    if (waiting === '' && who === '' && when === '') return nothing;
    const datetime = text(item.datetime);
    const time = when === '' ? nothing : datetime === '' ? html`<span>${when}</span>` : html`<time datetime=${datetime}>${when}</time>`;
    const dot = ' · ';
    const lead = waiting !== '' ? html`<span class="waiting">${waiting}</span>` : nothing;
    const whoPart = who === '' ? nothing : html`<span class="who">${waiting !== '' ? dot + who : who}</span>`;
    const timePart =
      when === '' ? nothing : html`<span class="when">${waiting !== '' || who !== '' ? dot : ''}${time}</span>`;
    return html`<div class="meta">${lead}${whoPart}${timePart}</div>`;
  }

  private renderAction(item: NphTimelineItem, index: number): TemplateResult | typeof nothing {
    const label = text(item.action);
    if (label === '') return nothing;
    return html`<nph-button
      class="action"
      severity="secondary"
      emphasis="ghost"
      text=${label}
      ?disabled=${item.actionDisabled === true}
      @click=${() => this.onAction(index)}
    ></nph-button>`;
  }

  private renderItem(item: NphTimelineItem, index: number): TemplateResult {
    const status = this.statusOf(item);
    const last = index === this.items.length - 1;
    const hidden = [this.statusText(status), text(item.typeLabel)].filter((part) => part !== '');
    const description = text(item.description);
    const id = text(item.id);
    return html`<li class="item" data-status=${status} data-marker=${this.markerOf(item)} aria-current=${index === this.currentIndex() ? 'step' : nothing}>
      <div class="rail" aria-hidden="true">
        ${this.renderMarker(item, status)}${last ? nothing : html`<nph-separator class="connector" orientation="vertical"></nph-separator>`}
      </div>
      <div class="content">
        <div class="text">
          <div class="title-row">${hidden.length === 0 ? nothing : html`<span class="hidden">${hidden.join(', ')}, </span>`}<span class="title">${text(item.title)}</span></div>
          ${description === '' ? nothing : html`<div class="description">${description}</div>`}${this.renderMeta(item, status)}
        </div>
        ${this.renderAction(item, index)}${id === '' ? nothing : html`<slot name=${id}></slot>`}
      </div>
    </li>`;
  }

  private renderLoading(): TemplateResult {
    const label = text(this.loadingLabel);
    return html`<ol class="list" aria-busy="true" aria-label=${this.name() ?? nothing} .ariaLabelledByElements=${this.labelledBy === null ? null : [this.labelledBy]}>
      <li class="loading">
        ${label === '' ? nothing : html`<span class="hidden">${label}</span>`}
        <div class="rows" aria-hidden="true">
          ${Array.from(
            { length: NPH_TIMELINE_LOADING_ROWS },
            () =>
              html`<div class="row">
                <nph-skeleton shape="avatar-sm"></nph-skeleton>
                <div class="row-text"><nph-skeleton class="sk-title" shape="line"></nph-skeleton><nph-skeleton class="sk-meta" shape="line"></nph-skeleton></div>
              </div>`,
          )}
        </div>
      </li>
    </ol>`;
  }

  private renderList(): TemplateResult {
    const name = this.name();
    return html`<ol class="list" aria-label=${name ?? nothing} .ariaLabelledByElements=${this.labelledBy === null ? null : [this.labelledBy]}>
      ${this.items.map((item, index) => this.renderItem(item, index))}
    </ol>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problem !== null || !this.showsSomething()) {
      return nothing;
    }
    let body: TemplateResult;
    if (this.loading) {
      body = this.renderLoading();
    } else if (this.empty) {
      body = html`<nph-empty heading=${text(this.emptyHeading)} description=${text(this.emptyDescription)}></nph-empty>`;
    } else {
      body = html`${this.renderList()}${this.hasMore
        ? html`<div class="more-row">
            <nph-button class="more" severity="secondary" emphasis="ghost" text=${text(this.moreLabel)} @click=${() => this.onMore()}></nph-button>
          </div>`
        : nothing}`;
    }
    return html`${body}<div class="live" aria-live="polite" aria-atomic="true">${this.announcement}</div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphTimeline);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-timeline': NphTimeline;
  }
  interface HTMLElementEventMap {
    'nph-timeline-action': CustomEvent<NphTimelineActionDetail>;
    'nph-timeline-more': CustomEvent<undefined>;
  }
}
