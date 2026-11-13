/**
 * `nph-scheduler` — the calendar of events: work week, week, day, month and list, on desktop and mobile.
 *
 * Contract accepted in Figma (documentation frame `6151:11160`, sets `6142:1744` and `6141:9258`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-77, sheet
 * `fichas/nph-scheduler.md`, `design.md` and decision P120 — nph-scheduler: API and semantics:
 * - ONE tag. The toolbar, the side panel, the day header, the all-day band, the time column, the day
 *   grid, the now line, the event (the Figma `nph-scheduler · evento`), the month cell, the month line,
 *   the list row and the compact month are inner parts, drawn in the shadow root. The events open the
 *   `nph-popover` through `for`, which looks the trigger up in the SAME root as the popover, so the
 *   events and the popover live together (P91, P111);
 * - the data comes by property only: `events` (`id`, `title`, `start`, `end`, `allDay`, `calendar`,
 *   `cancelled`, `recurring`, `people`), `calendars` (`id`, `name`, `color`, `visible`) and `labels`,
 *   every text the piece writes, already localized by the consuming application. An instant is a
 *   wall-clock string, `YYYY-MM-DDTHH:mm`, and an all-day date is `YYYY-MM-DD`; a string with a time zone
 *   is refused. The color of an event is the color of its calendar: `primary` or one of the seven
 *   vertical colors, never status;
 * - `view` (the Figma `vista`): `work-week` (default), `week`, `day`, `month` or `list`. Reflects, because
 *   the internal CSS selects the layout by it. `date`: the day the period is built around, `YYYY-MM-DD`;
 *   absent, today. `week-start`: `sunday` (default) or `monday`. The piece writes `view` and `date` when
 *   the person changes them and fires the events below; setting them from code fires nothing;
 * - `hide-side-panel` (the inverse of the Figma `lateral`): the side panel, with the mini month and "My
 *   calendars", shows in every desktop view; the sidebar button in the toolbar toggles the same panel.
 *   `loading`: skeleton rows in the place of the events, the toolbar stays active. The empty state is
 *   not a property: it is a period with no visible event. `now`: an instant that stands for the clock, so
 *   the now line and "today" are the same in a story and a test; absent, the clock of the machine, read
 *   again every minute;
 * - `open-event`: the `id` of the event whose detail is open. The scheduler does not draw the detail:
 *   it hands the click on the event to the screen (`nph-event-click`) and, when the screen puts content in
 *   the `detail` slot (and `detail-footer`), it opens the `nph-popover` beside the event, with the title of
 *   the event as heading, and writes `aria-expanded="true"` on the event. Esc, a press outside and the
 *   focus leaving close it and fire `nph-event-close`; Esc gives the focus back to the event;
 * - `filter-items`: the items of the "Filter" menu, as the `items` of `nph-dropdown-menu`; without them
 *   the button only fires `nph-filter-click`;
 * - events (all bubble and are composed, and fire only when the person acts): `nph-view-change`
 *   (`{ view }`), `nph-date-change` (`{ date, source }`), `nph-event-click` (`{ id, source }`, cancelable),
 *   `nph-event-close` (`{ id, source }`), `nph-day-click` (`{ date }`), `nph-new-event` (`{ date }`),
 *   `nph-filter-click`, `nph-filter-select` (`{ value, checked }`), `nph-calendar-toggle`
 *   (`{ id, visible }`) and `nph-side-panel-change` (`{ open }`). The scheduler replaces `calendars` with
 *   a new list on a toggle and never changes the objects of the consumer;
 * - keyboard (a deliberate deviation from the APG grid, decided by the design owner): each day and each
 *   event is a Tab stop, in the order of the document: toolbar, side panel, days from left to right,
 *   events in start order. No arrow keys on the grid; the mini month and the compact month keep the arrows,
 *   Page Up, Page Down, Home and End of the date grid. Enter or Space on "+N more" goes to the day view;
 * - below 768 px of the width of the element the scheduler becomes the compact month with the list of the
 *   chosen day (the Figma `celular`); the view select offers the same views and the compact month stays;
 * - the language of the dates is the nearest `lang`, crossing shadow roots; without one, `en`;
 * - no slot besides `detail` and `detail-footer`, no color property and no `::part`;
 * - invalid input does not render and emits `console.error` only in development, one per cause while it
 *   lasts (P21): a `view`, a `week-start`, a `date` or a `now` that does not exist. An event or a calendar
 *   that cannot be drawn is left out with its own error; a missing label renders and says which, and the control
 * that would have no accessible name without it (an icon-only button, the sidebar button, the view select) is not drawn.
 *
 * PROVISIONAL (D-1, D-2 of the task): the mini month and the compact month are the scheduler's own date
 * grid, until the date-picker grid exists; the sidebar button keeps the place of the `sidebar` icon with
 * an `nph-skeleton`, as the collapse button of `nph-sidebar` (P116), until the icon enters `nph-icon`.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';

import '../nph-avatar/nph-avatar';
import '../nph-avatar-stack/nph-avatar-stack';
import '../nph-button/nph-button';
import '../nph-checkbox/nph-checkbox';
import '../nph-dropdown-menu/nph-dropdown-menu';
import '../nph-icon/nph-icon';
import '../nph-option/nph-option';
import '../nph-popover/nph-popover';
import '../nph-select/nph-select';
import '../nph-skeleton/nph-skeleton';
import '../nph-tooltip/nph-tooltip';
import {
  MINUTES_PER_DAY,
  NPH_SCHEDULER_COLORS as LOGIC_COLORS,
  NPH_SCHEDULER_VIEWS as LOGIC_VIEWS,
  NPH_SCHEDULER_WEEK_STARTS as LOGIC_WEEK_STARTS,
  TIME_SHOWN_MINUTES,
  addMonths,
  coversDay,
  firstOfMonth,
  fromDay,
  isoDate,
  layoutBand,
  layoutDay,
  monthWeeks,
  movePeriod,
  parseDate,
  parseDateTime,
  peopleOf,
  periodDays,
  readEvents,
  startOfWeek,
  toDay,
} from './nph-scheduler.logic';
import type {
  Day,
  NphSchedulerCalendar as LogicCalendar,
  NphSchedulerColor as LogicColor,
  NphSchedulerEvent as LogicEvent,
  NphSchedulerPerson as LogicPerson,
  NphSchedulerView as LogicView,
  NphSchedulerWeekStart as LogicWeekStart,
  Occurrence,
} from './nph-scheduler.logic';
import schedulerCss from './nph-scheduler.css?inline';

/*
 * The public names of the logic file, declared here and not re-exported from it: the manifest of the
 * package describes this module, and the logic file is bundled into it (it is not a file of the package).
 */
export const NPH_SCHEDULER_COLORS = LOGIC_COLORS;
export const NPH_SCHEDULER_VIEWS = LOGIC_VIEWS;
export const NPH_SCHEDULER_WEEK_STARTS = LOGIC_WEEK_STARTS;
export type NphSchedulerCalendar = LogicCalendar;
export type NphSchedulerColor = LogicColor;
export type NphSchedulerEvent = LogicEvent;
export type NphSchedulerPerson = LogicPerson;
export type NphSchedulerView = LogicView;
export type NphSchedulerWeekStart = LogicWeekStart;

const TAG = 'nph-scheduler';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** Below this width of the element, in px, the scheduler is the compact month: the `md` breakpoint (P116). */
const MOBILE_BREAKPOINT = 768;

/** The longest stretch of the clock the now line waits before it is read again, in ms. */
const CLOCK_INTERVAL = 60_000;

/** The skeleton rows of a loading column, cell or list. */
const SKELETON_ROWS = 3;

/** How many avatars the stack of a day or a row shows before the "+N". */
const MAX_AVATARS = 3;

/** The first hour in view when a period has no event and today is not in it. */
const DEFAULT_SCROLL_HOUR = 7;

/** The texts the piece writes, already localized. Placeholders: `{count}` and `{date}`. */
export interface NphSchedulerLabels {
  today: string;
  previous: string;
  next: string;
  newEvent: string;
  filter: string;
  sidePanel: string;
  view: string;
  viewWorkWeek: string;
  viewWeek: string;
  viewDay: string;
  viewMonth: string;
  viewList: string;
  allDay: string;
  cancelled: string;
  cancelledName: string;
  repeats: string;
  more: string;
  moreName: string;
  myCalendars: string;
  miniPrevious: string;
  miniNext: string;
  emptyTitle: string;
  emptyHint: string;
  loading: string;
  todayName: string;
}

/** The label keys, to name what is missing. */
export const NPH_SCHEDULER_LABEL_KEYS = [
  'today',
  'previous',
  'next',
  'newEvent',
  'filter',
  'sidePanel',
  'view',
  'viewWorkWeek',
  'viewWeek',
  'viewDay',
  'viewMonth',
  'viewList',
  'allDay',
  'cancelled',
  'cancelledName',
  'repeats',
  'more',
  'moreName',
  'myCalendars',
  'miniPrevious',
  'miniNext',
  'emptyTitle',
  'emptyHint',
  'loading',
  'todayName',
] as const satisfies readonly (keyof NphSchedulerLabels)[];

/** The item of the "Filter" menu: the item of `nph-dropdown-menu`. */
export type NphSchedulerFilterItem = Record<string, unknown>;

/** What moved the date: the toolbar, the mini month, a day of the month or "+N more". */
export type NphSchedulerDateSource = 'today' | 'previous' | 'next' | 'mini-month' | 'month' | 'more';

export interface NphSchedulerViewChangeDetail {
  readonly view: NphSchedulerView;
}

export interface NphSchedulerDateChangeDetail {
  readonly date: string;
  readonly source: NphSchedulerDateSource;
}

export type NphSchedulerClickSource = 'pointer' | 'keyboard';

export interface NphSchedulerEventClickDetail {
  readonly id: string;
  readonly source: NphSchedulerClickSource;
}

export type NphSchedulerCloseSource = 'escape' | 'outside' | 'focus-out' | 'toggle';

export interface NphSchedulerEventCloseDetail {
  readonly id: string;
  readonly source: NphSchedulerCloseSource;
}

export interface NphSchedulerDayClickDetail {
  readonly date: string;
}

export interface NphSchedulerNewEventDetail {
  readonly date: string;
}

export interface NphSchedulerFilterSelectDetail {
  readonly value: string;
  readonly checked: boolean | null;
}

export interface NphSchedulerCalendarToggleDetail {
  readonly id: string;
  readonly visible: boolean;
}

export interface NphSchedulerSidePanelChangeDetail {
  readonly open: boolean;
}

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

const trimmed = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/** The metrics of the month cell, measured after the render, to know how many lines fit. */
interface MonthMetrics {
  readonly available: number;
  readonly line: number;
  readonly more: number;
  readonly gap: number;
}

const DAY_MS = 86_400_000;

export class NphScheduler extends LitElement {
  static override styles = unsafeCSS(schedulerCss);

  static override properties = {
    events: { attribute: false },
    calendars: { attribute: false },
    labels: { attribute: false },
    filterItems: { attribute: false },
    /* `view` reflects because the internal CSS selects the layout by it. */
    view: { type: String, reflect: true },
    date: { type: String },
    weekStart: { type: String, attribute: 'week-start' },
    /* `hideSidePanel` reflects because the internal CSS selects the grid by it. */
    hideSidePanel: { type: Boolean, attribute: 'hide-side-panel', reflect: true },
    loading: { type: Boolean, reflect: true },
    now: { type: String },
    /* `openEvent` reflects so the page can see which detail is open. */
    openEvent: {
      attribute: 'open-event',
      reflect: true,
      /* No open event is no attribute, so `[open-event]` means something is open. */
      converter: { fromAttribute: (value: string | null) => value ?? '', toAttribute: (value: unknown) => (value === '' ? null : String(value)) },
    },
    compact: { state: true },
    gridMonth: { state: true },
    metrics: { state: true },
    clock: { state: true },
    announcement: { state: true },
    hasDetail: { state: true },
  };

  declare events: readonly NphSchedulerEvent[];
  declare calendars: readonly NphSchedulerCalendar[];
  declare labels: Partial<NphSchedulerLabels>;
  declare filterItems: readonly NphSchedulerFilterItem[];
  declare view: NphSchedulerView;
  declare date: string;
  declare weekStart: NphSchedulerWeekStart;
  declare hideSidePanel: boolean;
  declare loading: boolean;
  declare now: string;
  declare openEvent: string;
  declare compact: boolean;
  declare gridMonth: Day | null;
  declare metrics: MonthMetrics | null;
  declare clock: number;
  declare announcement: string;
  declare hasDetail: boolean;

  private valid = true;
  private reported: string[] = [];
  private read: ReturnType<typeof readEvents> = { events: [], calendars: [], causes: [] };
  private timer: ReturnType<typeof setInterval> | undefined;
  private resizeWatch: ResizeObserver | undefined;
  private monthWatch: ResizeObserver | undefined;
  private childWatch: MutationObserver | undefined;
  /** How many times each event was drawn in the render under way: the ids of the elements. */
  private drawn = new Map<number, number>();
  private anchors = new Set<string>();
  private dirty = true;
  private anchorHint = '';
  /** The id of the element the popover is anchored to in the render under way. */
  private detailAnchor = '';
  private focusAfterClose = '';
  private focusAfterRender: string | null = null;
  private languageWatch: MutationObserver | undefined;
  private focusDayAfterRender: Day | null = null;
  private scrollKey = '';
  private scrollCount = -1;
  private autoTop = 0;
  private userScrolled = false;
  private measuredKey = '';
  private uid = Math.random().toString(36).slice(2, 8);

  constructor() {
    super();
    this.events = [];
    this.calendars = [];
    this.labels = {};
    this.filterItems = [];
    this.view = 'work-week';
    this.date = '';
    this.weekStart = 'sunday';
    this.hideSidePanel = false;
    this.loading = false;
    this.now = '';
    this.openEvent = '';
    this.compact = false;
    this.gridMonth = null;
    this.metrics = null;
    this.clock = 0;
    this.announcement = '';
    this.hasDetail = false;
  }

  /* ----- life cycle ---------------------------------------------------------------- */

  override connectedCallback(): void {
    super.connectedCallback();
    this.compact = this.clientWidth > 0 && this.clientWidth < MOBILE_BREAKPOINT;
    this.resizeWatch = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (width > 0) {
        this.compact = width < MOBILE_BREAKPOINT;
      }
    });
    this.resizeWatch.observe(this);
    this.timer = setInterval(() => {
      if (trimmed(this.now) === '') this.clock += 1;
    }, CLOCK_INTERVAL);
    this.childWatch = new MutationObserver(() => this.syncDetail());
    this.childWatch.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['slot'] });
    this.syncDetail();
    /* The language and the direction are read at each render: a change on the page draws the piece again. */
    this.languageWatch = new MutationObserver(() => this.requestUpdate());
    this.languageWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeWatch?.disconnect();
    this.resizeWatch = undefined;
    this.monthWatch?.disconnect();
    this.monthWatch = undefined;
    this.childWatch?.disconnect();
    this.childWatch = undefined;
    this.languageWatch?.disconnect();
    this.languageWatch = undefined;
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined;
    /* Pending work that points to the old tree has nothing to land on. */
    this.focusAfterClose = '';
    this.focusAfterRender = null;
    this.focusDayAfterRender = null;
    this.measuredKey = '';
    this.scrollKey = '';
  }

  /** The screen put content in the `detail` slot, or took it out. */
  private syncDetail(): void {
    this.hasDetail = [...this.children].some((child) => {
      const slot = child.getAttribute('slot');
      return slot === 'detail' || slot === 'detail-footer';
    });
  }

  /* ----- reading the input --------------------------------------------------------- */

  private report(causes: string[]): void {
    for (const cause of causes) {
      if (!this.reported.includes(cause)) devError(cause);
    }
    this.reported = causes;
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    const causes: string[] = [];
    const view = trimmed(this.view);
    if (!oneOf(NPH_SCHEDULER_VIEWS, view)) {
      causes.push(`view "${this.view}" does not exist. Use ${NPH_SCHEDULER_VIEWS.join(', ')}; nothing was drawn.`);
    }
    const weekStart = trimmed(this.weekStart);
    if (!oneOf(NPH_SCHEDULER_WEEK_STARTS, weekStart)) {
      causes.push(`week-start "${this.weekStart}" does not exist. Use ${NPH_SCHEDULER_WEEK_STARTS.join(', ')}; nothing was drawn.`);
    }
    if (trimmed(this.date) !== '' && parseDate(trimmed(this.date)) === null) {
      causes.push(`date "${this.date}" is not a date. Use YYYY-MM-DD; nothing was drawn.`);
    }
    if (trimmed(this.now) !== '' && parseDateTime(trimmed(this.now)) === null) {
      causes.push(`now "${this.now}" is not an instant. Use YYYY-MM-DDTHH:mm; nothing was drawn.`);
    }
    this.valid = causes.length === 0;
    if (changed.has('events') || changed.has('calendars')) {
      this.dirty = true;
    }
    if (this.valid) {
      if (this.dirty) {
        this.read = readEvents(this.eventList, this.calendarList);
        this.dirty = false;
      }
      /* The event whose detail is open left the data (removed, or its calendar was hidden): nothing is open. */
      if (trimmed(this.openEvent) !== '' && !this.read.events.some((item) => item.id === trimmed(this.openEvent))) {
        this.openEvent = '';
      }
      causes.push(...this.read.causes);
      const missing = NPH_SCHEDULER_LABEL_KEYS.filter((key) => trimmed(this.labels?.[key]) === '');
      if (missing.length > 0) {
        causes.push(`labels is missing ${missing.join(', ')}: the texts are written by the consuming application, so the parts that need them have no name.`);
      }
    }
    this.report(causes);
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    if (changed.has('date') || changed.has('view')) {
      this.gridMonth = null;
    }
  }

  /* ----- the clock, the dates and the language ------------------------------------- */

  /** The nearest `lang`, crossing the shadow roots this piece lives in, as `nph-pagination` reads it. */
  private language(): string {
    let node: Element | null = this;
    while (node !== null) {
      const found: Element | null = node.closest('[lang]');
      if (found !== null) return found.getAttribute('lang') || 'en';
      const root = node.getRootNode();
      node = root instanceof ShadowRoot ? root.host : null;
    }
    return 'en';
  }

  private formatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    try {
      return new Intl.DateTimeFormat(this.language(), { ...options, timeZone: 'UTC' });
    } catch {
      return new Intl.DateTimeFormat('en', { ...options, timeZone: 'UTC' });
    }
  }

  private dayDate(day: Day): Date {
    return new Date(day * DAY_MS);
  }

  private minuteDate(minute: number): Date {
    return new Date(Date.UTC(1970, 0, 1, Math.floor(minute / 60), minute % 60));
  }

  private timeText(minute: number): string {
    return this.formatter({ hour: 'numeric', minute: '2-digit' }).format(this.minuteDate(minute));
  }

  private hourText(hour: number): string {
    return this.formatter({ hour: 'numeric' }).format(this.minuteDate(hour * 60));
  }

  private weekdayText(day: Day, width: 'narrow' | 'short' | 'long'): string {
    return this.formatter({ weekday: width }).format(this.dayDate(day));
  }

  private dateNameText(day: Day): string {
    return this.formatter({ weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(this.dayDate(day));
  }

  private monthText(day: Day): string {
    return this.formatter({ month: 'long', year: 'numeric' }).format(this.dayDate(day));
  }

  /** The current instant: the `now` property, or the clock of the machine. */
  private instant(): { day: Day; minute: number } {
    const fixed = parseDateTime(trimmed(this.now));
    if (fixed !== null) return fixed;
    const value = new Date();
    return { day: toDay(value.getFullYear(), value.getMonth() + 1, value.getDate()), minute: value.getHours() * 60 + value.getMinutes() };
  }

  private get today(): Day {
    return this.instant().day;
  }

  /** The day the period is built around. */
  private get anchor(): Day {
    return parseDate(trimmed(this.date)) ?? this.today;
  }

  private get firstWeekday(): 0 | 1 {
    return this.weekStart === 'monday' ? 1 : 0;
  }

  private get effectiveView(): NphSchedulerView {
    return this.compact ? 'month' : this.view;
  }

  private get eventList(): readonly NphSchedulerEvent[] {
    return Array.isArray(this.events) ? this.events : [];
  }

  private get calendarList(): readonly NphSchedulerCalendar[] {
    return Array.isArray(this.calendars) ? this.calendars : [];
  }

  private get filterList(): readonly NphSchedulerFilterItem[] {
    return Array.isArray(this.filterItems) ? this.filterItems : [];
  }

  private get rtl(): boolean {
    return getComputedStyle(this).direction === 'rtl';
  }

  /** A label with its `{name}` placeholders filled. */
  private text(key: keyof NphSchedulerLabels, values: Record<string, string> = {}): string {
    let text = trimmed(this.labels?.[key]);
    for (const [name, value] of Object.entries(values)) {
      text = text.replaceAll(`{${name}}`, value);
    }
    return text;
  }

  /** The parts of an accessible name, in a plain comma list: a language's own "and" would join the last two. */
  private join(parts: string[]): string {
    return parts.filter((part) => part !== '').join(', ');
  }

  /** The names of the people, as a sentence in the language of the page. */
  private names(people: readonly NphSchedulerPerson[]): string {
    const list = people.map((person) => person.name);
    try {
      return new Intl.ListFormat(this.language(), { type: 'conjunction', style: 'long' }).format(list);
    } catch {
      return list.join(', ');
    }
  }

  /** The period the toolbar names. */
  private periodLabel(): string {
    const view = this.effectiveView;
    const anchor = this.anchor;
    if (view === 'month') return this.monthText(this.compact ? (this.gridMonth ?? firstOfMonth(anchor)) : anchor);
    if (view === 'day') return this.formatter({ weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(this.dayDate(anchor));
    const days = periodDays(view, anchor, this.weekStart);
    const format = this.formatter({ month: 'short', day: 'numeric', year: 'numeric' });
    const first = this.dayDate(days[0] as Day);
    const last = this.dayDate(days[days.length - 1] as Day);
    try {
      return format.formatRange(first, last);
    } catch {
      return `${format.format(first)} – ${format.format(last)}`;
    }
  }

  /* ----- what the person does ------------------------------------------------------ */

  private fire<T>(name: string, detail: T, cancelable = false): boolean {
    return this.dispatchEvent(new CustomEvent<T>(name, { detail, bubbles: true, composed: true, cancelable }));
  }

  private announce(): void {
    this.announcement = this.periodLabel();
  }

  private setDate(day: Day, source: NphSchedulerDateSource): void {
    const next = isoDate(day);
    if (next === trimmed(this.date)) return;
    this.date = next;
    this.fire<NphSchedulerDateChangeDetail>('nph-date-change', { date: next, source });
    this.announce();
  }

  private setView(view: NphSchedulerView): void {
    if (view === this.view) return;
    this.view = view;
    this.fire<NphSchedulerViewChangeDetail>('nph-view-change', { view });
    this.announce();
  }

  private move(direction: -1 | 1): void {
    const source = direction === -1 ? 'previous' : 'next';
    if (this.compact) {
      /* The compact month moves from the month shown, which the keys of its date grid may have left. */
      const shown = fromDay(this.shownMonth);
      const current = fromDay(this.anchor);
      const offset = shown.year * 12 + shown.month - (current.year * 12 + current.month);
      this.setDate(addMonths(this.anchor, offset + direction), source);
      return;
    }
    this.setDate(movePeriod(this.effectiveView, this.anchor, direction), source);
  }

  private onToday(): void {
    this.setDate(this.today, 'today');
  }

  private onViewChange(event: Event): void {
    event.stopPropagation();
    const value = (event.target as HTMLElement & { value: string }).value;
    if (oneOf(NPH_SCHEDULER_VIEWS, value)) this.setView(value);
  }

  private toggleSidePanel(): void {
    this.hideSidePanel = !this.hideSidePanel;
    this.fire<NphSchedulerSidePanelChangeDetail>('nph-side-panel-change', { open: !this.hideSidePanel });
  }

  private onCalendarToggle(calendar: NphSchedulerCalendar, checked: boolean): void {
    this.calendars = this.calendarList.map((item) => (item?.id === calendar.id ? { ...item, visible: checked } : item));
    this.fire<NphSchedulerCalendarToggleDetail>('nph-calendar-toggle', { id: calendar.id, visible: checked });
  }

  private onNewEvent(): void {
    this.fire<NphSchedulerNewEventDetail>('nph-new-event', { date: isoDate(this.anchor) });
  }

  private onFilterClick(): void {
    if (this.filterList.length === 0) this.fire('nph-filter-click', {});
  }

  private onFilterSelect(event: Event): void {
    event.stopPropagation();
    const detail = (event as CustomEvent<{ value: string; checked: boolean | null }>).detail;
    this.fire<NphSchedulerFilterSelectDetail>('nph-filter-select', { value: detail.value, checked: detail.checked });
  }

  private onDayClick(day: Day): void {
    this.fire<NphSchedulerDayClickDetail>('nph-day-click', { date: isoDate(day) });
  }

  /** "+N more": the day view of that date. */
  private onMore(day: Day): void {
    const viewChanged = this.view !== 'day';
    this.view = 'day';
    this.date = isoDate(day);
    this.focusAfterRender = '.day';
    if (viewChanged) this.fire<NphSchedulerViewChangeDetail>('nph-view-change', { view: 'day' });
    this.fire<NphSchedulerDateChangeDetail>('nph-date-change', { date: isoDate(day), source: 'more' });
    this.announce();
  }

  private onEventClick(occurrence: Occurrence, event: MouseEvent): void {
    const element = event.currentTarget as HTMLElement;
    const wasOpen = this.openEvent === occurrence.id && this.hasDetail;
    if (wasOpen) {
      /* The popover closes itself on the click of its trigger; the state follows it. */
      this.openEvent = '';
      this.fire<NphSchedulerEventCloseDetail>('nph-event-close', { id: occurrence.id, source: 'toggle' });
      return;
    }
    const source: NphSchedulerClickSource = event.detail === 0 ? 'keyboard' : 'pointer';
    const proceed = this.fire<NphSchedulerEventClickDetail>('nph-event-click', { id: occurrence.id, source }, true);
    if (!proceed) return;
    this.anchorHint = element.id;
    this.openEvent = occurrence.id;
  }

  private onPopoverClose(event: Event): void {
    event.stopPropagation();
    const detail = (event as CustomEvent<{ source: string }>).detail;
    const id = this.openEvent;
    const source = detail.source as NphSchedulerCloseSource;
    if (source === 'escape') this.focusAfterClose = this.detailAnchor;
    this.openEvent = '';
    if (id !== '') this.fire<NphSchedulerEventCloseDetail>('nph-event-close', { id, source });
  }

  /* ----- the date grid (mini month and compact month) ------------------------------ */

  private get shownMonth(): Day {
    return this.gridMonth ?? firstOfMonth(this.anchor);
  }

  private gridFocusDay(): Day {
    const month = this.shownMonth;
    const anchor = this.anchor;
    return firstOfMonth(anchor) === month ? anchor : month;
  }

  private onGridKey(event: KeyboardEvent, day: Day): void {
    let target: Day | null = null;
    const rtl = this.rtl;
    const first = this.firstWeekday;
    switch (event.key) {
      case 'ArrowLeft':
        target = day + (rtl ? 1 : -1);
        break;
      case 'ArrowRight':
        target = day + (rtl ? -1 : 1);
        break;
      case 'ArrowUp':
        target = day - 7;
        break;
      case 'ArrowDown':
        target = day + 7;
        break;
      case 'PageUp':
        target = addMonths(day, event.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        target = addMonths(day, event.shiftKey ? 12 : 1);
        break;
      case 'Home':
        target = startOfWeek(day, first);
        break;
      case 'End':
        target = startOfWeek(day, first) + 6;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (firstOfMonth(target) !== this.shownMonth) this.gridMonth = firstOfMonth(target);
    this.focusDayAfterRender = target;
    this.requestUpdate();
  }

  private moveGridMonth(direction: -1 | 1): void {
    this.gridMonth = addMonths(this.shownMonth, direction);
  }

  private renderGrid(kind: 'mini' | 'compact', events: readonly Occurrence[]): TemplateResult {
    const month = this.shownMonth;
    const weeks = monthWeeks(month, this.firstWeekday);
    const roving = this.gridFocusDay();
    const today = this.today;
    const selected = this.anchor;
    const heads = (weeks[0] as Day[]).map((day) => html`<div class="grid-head" role="columnheader" aria-label=${this.weekdayText(day, 'long')}>${this.weekdayText(day, 'narrow')}</div>`);
    const rows = weeks.map(
      (week) => html`<div class="grid-row" role="row">
        ${week.map((day) => {
          const outside = firstOfMonth(day) !== month;
          const dayEvents = kind === 'compact' ? events.filter((item) => coversDay(item, day)) : [];
          const dot = dayEvents[0];
          return html`<button
            class="grid-cell"
            type="button"
            role="gridcell"
            tabindex=${day === roving ? '0' : '-1'}
            data-day=${String(day)}
            data-outside=${outside ? 'true' : nothing}
            data-today=${day === today ? 'true' : nothing}
            aria-selected=${day === selected ? 'true' : 'false'}
            aria-current=${day === today ? 'date' : nothing}
            aria-label=${this.dateNameText(day) + (day === today && this.text('todayName') !== '' ? `, ${this.text('todayName')}` : '')}
            @click=${() => this.onGridPick(day, kind)}
            @keydown=${(event: KeyboardEvent) => this.onGridKey(event, day)}
          >
            <span class="grid-number">${fromDay(day).date}</span>
            ${kind === 'compact'
              ? html`<span class="grid-dot" data-color=${dot === undefined ? nothing : dot.color} data-empty=${dot === undefined ? 'true' : nothing} aria-hidden="true"></span>`
              : nothing}
          </button>`;
        })}
      </div>`,
    );
    return html`<div class="date-grid" data-kind=${kind} role="grid" aria-label=${this.monthText(month)}>
      <div class="grid-row" role="row">${heads}</div>
      ${rows}
    </div>`;
  }

  private onGridPick(day: Day, kind: 'mini' | 'compact'): void {
    this.setDate(day, kind === 'mini' ? 'mini-month' : 'month');
    this.gridMonth = null;
  }

  private renderMini(): TemplateResult {
    const month = this.shownMonth;
    const rtl = this.rtl;
    return html`<div class="mini">
      <div class="mini-head">
        <span class="mini-label" id="mini-label">${this.monthText(month)}</span>
        <span class="mini-nav">
          ${this.text('miniPrevious') === '' ? nothing : html`<nph-button
            severity="secondary"
            emphasis="ghost"
            size="compact"
            icon-start=${rtl ? 'chevron-right' : 'chevron-left'}
            label=${this.text('miniPrevious')}
            @click=${() => this.moveGridMonth(-1)}
          ></nph-button>`}
          ${this.text('miniNext') === '' ? nothing : html`<nph-button
            severity="secondary"
            emphasis="ghost"
            size="compact"
            icon-start=${rtl ? 'chevron-left' : 'chevron-right'}
            label=${this.text('miniNext')}
            @click=${() => this.moveGridMonth(1)}
          ></nph-button>`}
        </span>
      </div>
      ${this.renderGrid('mini', [])}
    </div>`;
  }

  /* ----- the events ---------------------------------------------------------------- */

  private eventId(occurrence: Occurrence): string {
    const count = this.drawn.get(occurrence.index) ?? 0;
    this.drawn.set(occurrence.index, count + 1);
    const id = `ev-${this.uid}-${occurrence.index}-${count}`;
    this.anchors.add(id);
    return id;
  }

  /**
   * The accessible name of an event. It starts with the text the person sees, in the order they see it
   * (WCAG 2.5.3, label in name), and goes on with what the grid says by its place: the date, the time when
   * it is not written, the calendar and, when it applies, the cancelled and repeating states. A title cut
   * with an ellipsis stays whole here.
   */
  private eventName(occurrence: Occurrence, written: { time: boolean; timeFirst?: boolean }): string {
    const date = occurrence.multiDay
      ? `${this.dateNameText(occurrence.startDay)} – ${this.dateNameText(occurrence.endDay)}`
      : this.dateNameText(occurrence.startDay);
    const time = occurrence.allDay
      ? this.text('allDay')
      : occurrence.multiDay
        ? `${this.timeText(occurrence.startMinute)} – ${this.timeText(occurrence.endMinute)}`
        : this.timeRange(occurrence);
    const title = occurrence.cancelled ? `${this.text('cancelled')} ${occurrence.title}` : occurrence.title;
    const visible = written.time ? (written.timeFirst === true ? `${time} ${title}` : `${title} ${time}`) : title;
    return this.join([
      visible,
      date,
      written.time ? '' : time,
      occurrence.calendarName,
      occurrence.cancelled ? this.text('cancelledName') : '',
      occurrence.recurring ? this.text('repeats') : '',
    ]);
  }

  private timeRange(occurrence: Occurrence): string {
    if (occurrence.allDay) return this.text('allDay');
    if (occurrence.endMinute === occurrence.startMinute && occurrence.endDay === occurrence.startDay) return this.timeText(occurrence.startMinute);
    return `${this.timeText(occurrence.startMinute)} – ${this.timeText(occurrence.endMinute === MINUTES_PER_DAY ? 0 : occurrence.endMinute)}`;
  }

  private eventContent(occurrence: Occurrence, showTime: boolean): TemplateResult {
    return html`<span class="bar" aria-hidden="true"></span>
      <span class="content">
        <span class="title-row">
          <span class="title">${occurrence.cancelled ? html`<span class="prefix">${this.text('cancelled')} </span>` : nothing}<span class="name">${occurrence.title}</span></span>
          ${occurrence.recurring ? html`<nph-icon class="repeat" name="rotate-right" size="sm"></nph-icon>` : nothing}
        </span>
        ${showTime ? html`<span class="time">${this.timeRange(occurrence)}</span>` : nothing}
      </span>`;
  }

  /** The event button, with the id the popover finds it by. `kind` picks the shape: grid, bar, line or flow. */
  private renderEvent(occurrence: Occurrence, kind: 'grid' | 'bar' | 'line' | 'flow', style = '', showTime = false): TemplateResult {
    const id = this.eventId(occurrence);
    return html`<button
      class="event"
      id=${id}
      type="button"
      data-kind=${kind}
      data-color=${occurrence.color}
      data-cancelled=${occurrence.cancelled ? 'true' : nothing}
      aria-label=${this.eventName(occurrence, { time: showTime })}
      data-event=${occurrence.id}
      style=${style === '' ? nothing : style}
      @click=${(event: MouseEvent) => this.onEventClick(occurrence, event)}
    >
      ${this.eventContent(occurrence, showTime)}
    </button>`;
  }

  private renderPeople(people: readonly NphSchedulerPerson[]): TemplateResult | typeof nothing {
    if (people.length === 0) return nothing;
    const label = this.names(people);
    if (people.length === 1) {
      const person = people[0] as NphSchedulerPerson;
      return html`<nph-avatar class="people" size="sm" src=${person.src ?? ''} label=${person.name}></nph-avatar>`;
    }
    const shown = people.slice(0, MAX_AVATARS);
    const rest = people.length - shown.length;
    return html`<nph-avatar-stack class="people" size="sm" count=${rest} label=${label}>
      ${shown.map((person) => html`<nph-avatar src=${person.src ?? ''}></nph-avatar>`)}
    </nph-avatar-stack>`;
  }

  /* ----- the toolbar --------------------------------------------------------------- */

  /** A control with no name is not drawn: a missing label is reported once, and the part waits for its text. */
  private renderSidebarButton(): TemplateResult | typeof nothing {
    const name = this.text('sidePanel');
    if (name === '') return nothing;
    return html`<button
        class="side-toggle"
        id="side-toggle"
        type="button"
        aria-label=${name}
        aria-expanded=${this.hideSidePanel ? 'false' : 'true'}
        aria-controls="side"
        @click=${() => this.toggleSidePanel()}
      >
        <span class="side-toggle-place"><nph-skeleton shape="block"></nph-skeleton></span>
      </button>
      <nph-tooltip for="side-toggle" relation="name" .text=${name}></nph-tooltip>`;
  }

  private renderViewSelect(): TemplateResult | typeof nothing {
    if (this.text('view') === '') return nothing;
    const options: [NphSchedulerView, keyof NphSchedulerLabels][] = [
      ['work-week', 'viewWorkWeek'],
      ['week', 'viewWeek'],
      ['day', 'viewDay'],
      ['month', 'viewMonth'],
      ['list', 'viewList'],
    ];
    return html`<nph-select class="view-select" .value=${this.view} .label=${this.text('view')} @input=${(event: Event) => event.stopPropagation()} @change=${(event: Event) => this.onViewChange(event)}>
      ${options.map(([value, key]) => html`<nph-option value=${value}>${this.text(key)}</nph-option>`)}
    </nph-select>`;
  }

  private renderToolbar(): TemplateResult {
    const rtl = this.rtl;
    return html`<div class="toolbar">
      <div class="toolbar-start">
        ${this.renderSidebarButton()}
        <nph-button severity="secondary" emphasis="solid" text=${this.text('today')} @click=${() => this.onToday()}></nph-button>
        ${this.text('previous') === '' ? nothing : html`<nph-button
          severity="secondary"
          emphasis="ghost"
          icon-start=${rtl ? 'chevron-right' : 'chevron-left'}
          label=${this.text('previous')}
          @click=${() => this.move(-1)}
        ></nph-button>`}
        ${this.text('next') === '' ? nothing : html`<nph-button
          severity="secondary"
          emphasis="ghost"
          icon-start=${rtl ? 'chevron-left' : 'chevron-right'}
          label=${this.text('next')}
          @click=${() => this.move(1)}
        ></nph-button>`}
        <span class="period" id="period">${this.periodLabel()}</span>
      </div>
      <div class="toolbar-end">
        ${this.renderViewSelect()}
        ${this.text('filter') === '' ? nothing : html`<nph-button id="filter" severity="secondary" emphasis="solid" icon-start="filter" text=${this.text('filter')} @click=${() => this.onFilterClick()}></nph-button>`}
        ${this.filterList.length > 0
          ? html`<nph-dropdown-menu for="filter" .items=${this.filterList} .label=${this.text('filter')} @nph-item-select=${(event: Event) => this.onFilterSelect(event)}></nph-dropdown-menu>`
          : nothing}
        ${this.text('newEvent') === '' ? nothing : html`<nph-button severity="primary" emphasis="solid" icon-start="plus" text=${this.text('newEvent')} @click=${() => this.onNewEvent()}></nph-button>`}
      </div>
    </div>`;
  }

  private renderMobileToolbar(): TemplateResult {
    const rtl = this.rtl;
    return html`<div class="toolbar" data-compact="true">
        <span class="period" id="period">${this.periodLabel()}</span>
        ${this.text('previous') === '' ? nothing : html`<nph-button
          severity="secondary"
          emphasis="ghost"
          icon-start=${rtl ? 'chevron-right' : 'chevron-left'}
          label=${this.text('previous')}
          @click=${() => this.move(-1)}
        ></nph-button>`}
        ${this.text('next') === '' ? nothing : html`<nph-button
          severity="secondary"
          emphasis="ghost"
          icon-start=${rtl ? 'chevron-left' : 'chevron-right'}
          label=${this.text('next')}
          @click=${() => this.move(1)}
        ></nph-button>`}
        ${this.text('newEvent') === '' ? nothing : html`<nph-button severity="primary" emphasis="solid" icon-start="plus" label=${this.text('newEvent')} @click=${() => this.onNewEvent()}></nph-button>`}
      </div>
      <div class="mobile-select">${this.renderViewSelect()}</div>`;
  }

  /* ----- the side panel ------------------------------------------------------------ */

  private renderSide(): TemplateResult | typeof nothing {
    if (this.hideSidePanel) return nothing;
    return html`<aside class="side" id="side" aria-label=${this.text('sidePanel')}>
      ${this.renderMini()}
      <div class="calendars" role="group" aria-labelledby="calendars-label">
        <span class="calendars-label" id="calendars-label">${this.text('myCalendars')}</span>
        ${this.read.calendars.map(
          (calendar) => html`<div class="calendar-row">
            <nph-checkbox
              .text=${trimmed(calendar.name)}
              .checked=${calendar.visible !== false}
              @input=${(event: Event) => event.stopPropagation()}
              @change=${(event: Event) => this.onCalendarToggle(calendar, (event.target as HTMLInputElement).checked)}
            ></nph-checkbox>
            <span class="calendar-dot" data-color=${oneOf(NPH_SCHEDULER_COLORS, calendar.color) ? calendar.color : 'primary'} aria-hidden="true"></span>
          </div>`,
        )}
      </div>
    </aside>`;
  }

  /* ----- the states ---------------------------------------------------------------- */

  private renderEmpty(): TemplateResult {
    return html`<div class="empty">
      <nph-icon name="calendar" size="sm"></nph-icon>
      <span class="empty-title">${this.text('emptyTitle')}</span>
      <span class="empty-hint">${this.text('emptyHint')}</span>
    </div>`;
  }

  private renderSkeletons(count = SKELETON_ROWS): TemplateResult {
    return html`<div class="skeletons" aria-hidden="true">${Array.from({ length: count }, () => html`<nph-skeleton shape="line"></nph-skeleton>`)}</div>`;
  }

  /* ----- the week and day views ---------------------------------------------------- */

  private renderDayHead(day: Day, events: readonly Occurrence[]): TemplateResult {
    const today = day === this.today;
    const name = this.join([`${this.weekdayText(day, 'short')} ${fromDay(day).date}`, this.dateNameText(day), today ? this.text('todayName') : '']);
    const people = peopleOf(events.filter((item) => coversDay(item, day)));
    return html`<div class="day-head" data-today=${today ? 'true' : nothing}>
      <button class="day" type="button" aria-label=${name} aria-current=${today ? 'date' : nothing} @click=${() => this.onDayClick(day)}>
        <span class="day-name">${this.weekdayText(day, 'short')}</span>
        <span class="day-number">${fromDay(day).date}</span>
      </button>
      ${this.renderPeople(people)}
    </div>`;
  }

  private renderTimeView(days: Day[], events: readonly Occurrence[], empty: boolean): TemplateResult {
    const placed = days.map((day) => layoutDay(events, day));
    const band = layoutBand(events, days);
    const instant = this.instant();
    const todayIndex = days.indexOf(instant.day);
    const hours = Array.from({ length: 24 }, (_, hour) => hour);
    return html`<div class="scroll" style="--_days: ${days.length}; --_lanes: ${Math.max(band.lanes, 1)};" @scroll=${(event: Event) => this.onScroll(event)}>
      <div class="sticky">
        <div class="head">
          <div class="corner"></div>
          ${days.map((day) => this.renderDayHead(day, events))}
        </div>
        <div class="band">
          <div class="band-label">${this.text('allDay')}</div>
          <div class="band-bars">
            ${band.bars.map(
              (bar) => this.renderEvent(bar.event, 'bar', `grid-column: ${bar.from + 1} / ${bar.to + 2}; grid-row: ${bar.lane + 1};`),
            )}
          </div>
        </div>
      </div>
      <div class="grid">
        <div class="hours" aria-hidden="true">
          ${hours.map((hour) => html`<div class="hour">${hour === 0 ? '' : this.hourText(hour)}</div>`)}
          ${todayIndex >= 0 ? html`<div class="now-time" style="--_at: ${instant.minute / 60};">${this.timeText(instant.minute)}</div>` : nothing}
        </div>
        <div class="columns">
          ${days.map(
            (day, index) => html`<div class="column" data-today=${day === instant.day ? 'true' : nothing}>
              ${placed[index]?.map((item) =>
                this.renderEvent(
                  item.event,
                  'grid',
                  `--_start: ${item.startMinute / 60}; --_span: ${(item.endMinute - item.startMinute) / 60}; --_column: ${item.column}; --_columns: ${item.columns};`,
                  item.endMinute - item.startMinute >= TIME_SHOWN_MINUTES,
                ),
              )}
              ${this.loading ? this.renderSkeletons() : nothing}
              ${index === todayIndex ? html`<div class="now" style="--_at: ${instant.minute / 60};" aria-hidden="true"><span class="now-dot"></span></div>` : nothing}
            </div>`,
          )}
          ${empty && !this.loading ? this.renderEmpty() : nothing}
        </div>
      </div>
    </div>`;
  }

  /* ----- the month view ------------------------------------------------------------ */

  private linesFor(count: number): number {
    const metrics = this.metrics;
    if (metrics === null) return count;
    const fitting = (rows: number): number => rows * metrics.line + Math.max(rows - 1, 0) * metrics.gap;
    let all = 0;
    while (all < count && fitting(all + 1) <= metrics.available) all += 1;
    if (all >= count) return count;
    let rows = 0;
    while (fitting(rows + 1) + metrics.gap + metrics.more <= metrics.available) rows += 1;
    return rows;
  }

  private renderMonth(days: Day[], events: readonly Occurrence[], empty: boolean): TemplateResult {
    const weeks = days.length / 7;
    const anchorMonth = firstOfMonth(this.anchor);
    const today = this.today;
    const names = days.slice(0, 7).map((day) => this.weekdayText(day, 'short'));
    return html`<div class="month" style="--_weeks: ${weeks};">
      <div class="weekdays" aria-hidden="true">${names.map((name) => html`<div class="weekday">${name}</div>`)}</div>
      <div class="month-body">
        <div class="cells">
          ${days.map((day) => {
            const name = this.dateNameText(day) + (day === today && this.text('todayName') !== '' ? `, ${this.text('todayName')}` : '');
            return html`<button
              class="cell"
              type="button"
              data-today=${day === today ? 'true' : nothing}
              data-outside=${firstOfMonth(day) !== anchorMonth ? 'true' : nothing}
              aria-label=${name}
              aria-current=${day === today ? 'date' : nothing}
              @click=${() => this.onDayClick(day)}
            >
              <span class="cell-number">${fromDay(day).date}</span>
            </button>`;
          })}
        </div>
        <div class="cell-events">
          ${days.map((day, index) => {
            const dayEvents = events.filter((item) => coversDay(item, day));
            const lines = this.linesFor(dayEvents.length);
            const hidden = dayEvents.length - lines;
            return html`<div class="cell-list" style="grid-column: ${(index % 7) + 1}; grid-row: ${Math.floor(index / 7) + 1};">
              <span class="cell-spacer" aria-hidden="true">${fromDay(day).date}</span>
              ${this.loading ? this.renderSkeletons(2) : dayEvents.slice(0, lines).map((item) => this.renderEvent(item, 'line'))}
              ${!this.loading && hidden > 0
                ? html`<div class="more" role="group" aria-label=${this.text('moreName', { count: String(hidden), date: this.dateNameText(day) })}>
                    <nph-button severity="secondary" emphasis="ghost" size="compact" text=${this.text('more', { count: String(hidden) })} @click=${() => this.onMore(day)}></nph-button>
                  </div>`
                : nothing}
            </div>`;
          })}
        </div>
        <div class="probes" aria-hidden="true">
          <span class="event" data-kind="line" data-probe="line"><span class="content"><span class="title-row"><span class="title">x</span></span></span></span>
          <span class="more-probe"></span>
        </div>
        ${empty && !this.loading ? this.renderEmpty() : nothing}
      </div>
    </div>`;
  }

  /* ----- the list view ------------------------------------------------------------- */

  private renderListRow(occurrence: Occurrence): TemplateResult {
    const id = this.eventId(occurrence);
    const time = occurrence.allDay ? this.text('allDay') : this.timeRange(occurrence);
    return html`<li class="row-item">
      <button
        class="row"
        id=${id}
        type="button"
        data-color=${occurrence.color}
        data-cancelled=${occurrence.cancelled ? 'true' : nothing}
        aria-label=${this.eventName(occurrence, { time: true, timeFirst: true })}
        data-event=${occurrence.id}
        @click=${(event: MouseEvent) => this.onEventClick(occurrence, event)}
      >
        <span class="row-time">${time}</span>
        <span class="bar" aria-hidden="true"></span>
        <span class="row-title"><span class="title">${occurrence.cancelled ? html`<span class="prefix">${this.text('cancelled')} </span>` : nothing}<span class="name">${occurrence.title}</span></span>${occurrence.recurring ? html`<nph-icon class="repeat" name="rotate-right" size="sm"></nph-icon>` : nothing}</span>
      </button>
      ${this.renderPeople(occurrence.people)}
    </li>`;
  }

  private renderList(days: Day[], events: readonly Occurrence[], empty: boolean): TemplateResult {
    const today = this.today;
    const groups = days
      .map((day) => ({ day, items: events.filter((item) => coversDay(item, day)) }))
      .filter((group) => group.items.length > 0);
    return html`<div class="list">
      ${this.loading
        ? html`<div class="list-day"><div class="list-skeletons">${this.renderSkeletons(SKELETON_ROWS * 2)}</div></div>`
        : groups.map(
            (group) => html`<section class="list-day" aria-labelledby="list-day-${group.day}">
              <h3 class="list-heading" id="list-day-${group.day}" data-today=${group.day === today ? 'true' : nothing}>${this.dateNameText(group.day)}</h3>
              <ul class="rows" role="list">${group.items.map((item) => this.renderListRow(item))}</ul>
            </section>`,
          )}
      ${empty && !this.loading ? this.renderEmpty() : nothing}
    </div>`;
  }

  /* ----- the compact month and the list of the chosen day -------------------------- */

  private renderCompact(events: readonly Occurrence[], empty: boolean): TemplateResult {
    const day = this.anchor;
    const items = events.filter((item) => coversDay(item, day));
    const today = this.today;
    return html`<div class="compact">
      ${this.renderGrid('compact', events)}
      <div class="day-list">
        <h3 class="day-list-heading" data-today=${day === today ? 'true' : nothing}>${this.dateNameText(day)}</h3>
        ${this.loading
          ? this.renderSkeletons()
          : items.map(
              (item) => html`<div class="day-row">
                <span class="day-row-time">${item.allDay ? this.text('allDay') : this.timeText(item.startMinute)}</span>
                ${this.renderEvent(item, 'flow', '', !item.allDay && item.endMinute - item.startMinute >= TIME_SHOWN_MINUTES)}
              </div>`,
            )}
        ${empty && !this.loading ? this.renderEmpty() : nothing}
      </div>
    </div>`;
  }

  /* ----- the detail ---------------------------------------------------------------- */

  private renderDetail(): unknown {
    const id = this.openEvent;
    if (id === '' || !this.hasDetail) return nothing;
    const occurrence = this.read.events.find((item) => item.id === id);
    if (occurrence === undefined) return nothing;
    let anchor = this.anchorHint;
    if (!this.anchors.has(anchor) || !anchor.startsWith(`ev-${this.uid}-${occurrence.index}-`)) {
      anchor = `ev-${this.uid}-${occurrence.index}-0`;
    }
    if (!this.anchors.has(anchor)) return nothing;
    this.detailAnchor = anchor;
    return keyed(
      anchor,
      html`<nph-popover for=${anchor} .heading=${occurrence.title} side="right" align="start" open @nph-close=${(event: Event) => this.onPopoverClose(event)}>
        <slot name="detail"></slot>
        <slot name="detail-footer" slot="footer"></slot>
      </nph-popover>`,
    );
  }

  /* ----- render -------------------------------------------------------------------- */

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) return nothing;
    this.drawn = new Map();
    this.anchors = new Set();
    const view = this.effectiveView;
    const days = periodDays(view, this.compact ? this.shownMonth : this.anchor, this.weekStart);
    const events = this.read.events;
    const inPeriod = events.filter((item) => item.startDay <= (days[days.length - 1] as Day) && item.endDay >= (days[0] as Day));
    const empty = inPeriod.length === 0;
    let body: TemplateResult;
    if (this.compact) {
      body = this.renderCompact(events, empty);
    } else if (view === 'month') {
      body = this.renderMonth(days, events, empty);
    } else if (view === 'list') {
      body = this.renderList(days, events, empty);
    } else {
      body = this.renderTimeView(days, events, empty);
    }
    const detail = this.renderDetail();
    return html`<section class="scheduler" aria-labelledby="period" data-compact=${this.compact ? 'true' : nothing} data-sidebar=${this.hideSidePanel || this.compact ? nothing : 'true'}>
      ${this.compact ? this.renderMobileToolbar() : this.renderToolbar()}
      ${this.compact ? nothing : this.renderSide()}
      <div class="body" data-view=${view} aria-busy=${this.loading ? 'true' : nothing}>${body}</div>
      ${detail}
      <div class="live" role="status" aria-live="polite">${this.announcement}</div>
      <div class="live" role="status" aria-live="polite">${this.loading ? this.text('loading') : ''}</div>
    </section>`;
  }

  /* ----- after the render ---------------------------------------------------------- */

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (!this.valid || !this.isConnected) return;
    if (this.focusAfterClose !== '') {
      const target = this.renderRoot.querySelector<HTMLElement>(`#${CSS.escape(this.focusAfterClose)}`);
      this.focusAfterClose = '';
      target?.focus();
    }
    if (this.focusAfterRender !== null) {
      const target = this.renderRoot.querySelector<HTMLElement>(this.focusAfterRender);
      this.focusAfterRender = null;
      target?.focus();
    }
    if (this.focusDayAfterRender !== null) {
      const target = this.renderRoot.querySelector<HTMLElement>(`.date-grid [data-day="${this.focusDayAfterRender}"]`);
      this.focusDayAfterRender = null;
      target?.focus();
    }
    this.syncSize();
    this.closeUndrawnDetail();
    this.syncPopupState();
    this.scrollToHour();
    this.measureMonth();
  }

  /**
   * The open event is not drawn (the person moved to a period it is not in, or to a view that does not draw
   * it): nothing is open, so it does not open again on its own when the person comes back. Nothing is fired:
   * the person did not close it.
   */
  private closeUndrawnDetail(): void {
    const id = trimmed(this.openEvent);
    if (id === '') return;
    const drawn = [...this.renderRoot.querySelectorAll<HTMLElement>('[data-event]')].some((item) => item.dataset.event === id);
    if (!drawn && this.read.events.some((item) => item.id === id)) {
      queueMicrotask(() => {
        if (this.isConnected && trimmed(this.openEvent) === id) this.openEvent = '';
      });
    }
  }

  /**
   * The width the element has after this render. The observer says it when the size changes, but the
   * first size may come before the element is drawn (it is hidden until its input is valid) and a change
   * that the render itself causes may reach the observer late, so the width is read again here too.
   */
  private syncSize(): void {
    const width = this.clientWidth;
    if (width > 0 && this.compact !== width < MOBILE_BREAKPOINT) {
      queueMicrotask(() => {
        if (this.isConnected && this.clientWidth > 0) this.compact = this.clientWidth < MOBILE_BREAKPOINT;
      });
    }
  }

  /**
   * `aria-haspopup` and `aria-expanded` on the events. The `nph-popover` writes and removes both on its
   * trigger, so they are set here, after every render, and not in the template: a binding the popover
   * erased would not come back.
   */
  private syncPopupState(): void {
    const open = this.hasDetail && trimmed(this.openEvent) !== '';
    for (const element of this.renderRoot.querySelectorAll<HTMLElement>('[data-event]')) {
      if (!this.hasDetail) {
        element.removeAttribute('aria-haspopup');
        element.removeAttribute('aria-expanded');
        continue;
      }
      element.setAttribute('aria-haspopup', 'dialog');
      element.setAttribute('aria-expanded', open && element.id === this.detailAnchor ? 'true' : 'false');
    }
  }

  private onScroll(event: Event): void {
    if ((event.currentTarget as HTMLElement).scrollTop !== this.autoTop) this.userScrolled = true;
  }

  /** The grid scrolls to the first event of the period, or to the now line, once per period. */
  private scrollToHour(): void {
    const scroll = this.renderRoot.querySelector<HTMLElement>('.scroll');
    if (scroll === null) {
      this.scrollKey = '';
      return;
    }
    const key = `${this.effectiveView}|${periodDays(this.effectiveView, this.anchor, this.weekStart)[0]}`;
    const sticky = scroll.querySelector<HTMLElement>('.sticky');
    if (sticky !== null) scroll.style.setProperty('--_sticky', `${sticky.offsetHeight}px`);
    /* A new period starts at its first event; the same period only starts again when its events arrive late and the person has not scrolled. */
    const count = this.read.events.length;
    if (key === this.scrollKey && (this.userScrolled || count === this.scrollCount)) {
      this.scrollCount = count;
      return;
    }
    if (key !== this.scrollKey) this.userScrolled = false;
    this.scrollKey = key;
    this.scrollCount = count;
    const days = periodDays(this.effectiveView, this.anchor, this.weekStart);
    const timed = this.read.events.filter((item) => !item.allDay && !item.multiDay && days.includes(item.startDay));
    const instant = this.instant();
    let minute = DEFAULT_SCROLL_HOUR * 60;
    if (timed.length > 0) {
      minute = Math.min(...timed.map((item) => item.startMinute));
    } else if (days.includes(instant.day)) {
      minute = instant.minute;
    }
    const hour = scroll.querySelector<HTMLElement>('.hour');
    if (hour === null) return;
    const hourHeight = hour.offsetHeight;
    const top = Math.max(0, ((minute - 60) / 60) * hourHeight);
    scroll.scrollTop = top;
    this.autoTop = scroll.scrollTop;
  }

  /** Measures a month cell, so "+N more" takes the lines that do not fit. */
  private measureMonth(): void {
    const month = this.renderRoot.querySelector<HTMLElement>('.month-body');
    if (month === null) {
      this.monthWatch?.disconnect();
      this.metrics = null;
      this.measuredKey = '';
      return;
    }
    if (this.monthWatch === undefined) {
      this.monthWatch = new ResizeObserver(() => this.measureMonth());
    }
    if (this.measuredKey !== 'observing') {
      this.monthWatch.disconnect();
      this.monthWatch.observe(month);
      this.measuredKey = 'observing';
    }
    const list = month.querySelector<HTMLElement>('.cell-list');
    const spacer = month.querySelector<HTMLElement>('.cell-spacer');
    const probe = month.querySelector<HTMLElement>('[data-probe="line"]');
    const more = month.querySelector<HTMLElement>('.more-probe');
    if (list === null || spacer === null || probe === null || more === null) return;
    const style = getComputedStyle(list);
    const gap = Number.parseFloat(style.rowGap) || 0;
    const padding = (Number.parseFloat(style.paddingBlockStart) || 0) + (Number.parseFloat(style.paddingBlockEnd) || 0);
    const available = list.clientHeight - padding - spacer.offsetHeight - gap;
    const next: MonthMetrics = { available, line: probe.offsetHeight, more: more.offsetHeight, gap };
    const current = this.metrics;
    if (
      current === null ||
      Math.abs(current.available - next.available) >= 1 ||
      Math.abs(current.line - next.line) >= 1 ||
      Math.abs(current.more - next.more) >= 1 ||
      Math.abs(current.gap - next.gap) >= 1
    ) {
      /* Outside the update that measured it, so the piece does not schedule an update from `updated`. */
      queueMicrotask(() => {
        if (this.isConnected) this.metrics = next;
      });
    }
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphScheduler);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-scheduler': NphScheduler;
  }
  interface HTMLElementEventMap {
    'nph-view-change': CustomEvent<NphSchedulerViewChangeDetail>;
    'nph-filter-click': CustomEvent<Record<string, never>>;
    'nph-date-change': CustomEvent<NphSchedulerDateChangeDetail>;
    'nph-event-click': CustomEvent<NphSchedulerEventClickDetail>;
    'nph-event-close': CustomEvent<NphSchedulerEventCloseDetail>;
    'nph-day-click': CustomEvent<NphSchedulerDayClickDetail>;
    'nph-new-event': CustomEvent<NphSchedulerNewEventDetail>;
    'nph-filter-select': CustomEvent<NphSchedulerFilterSelectDetail>;
    'nph-calendar-toggle': CustomEvent<NphSchedulerCalendarToggleDetail>;
    'nph-side-panel-change': CustomEvent<NphSchedulerSidePanelChangeDetail>;
  }
}
