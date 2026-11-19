/**
 * `nph-calendar` — the date grid: a month (or two) with its header, the weekdays and the days, and the month
 * and year views.
 *
 * Contract accepted in Figma (the grid `4015:28204`, its day `4015:28020`, the month and year cell `4015:28139`,
 * the month view `4015:28166`, the year view `4015:28185` and the header `3093:2225`), recorded as text in the
 * evidence of the `figma-docs-accepted` gate of DSA-90, sheet `fichas/nph-calendar.md`, `design.md` and
 * decision P133 — nph-date-picker and nph-calendar: API and semantics. It is the owner piece of the date grid:
 * the `nph-date-picker` panel uses it, and the `nph-scheduler` mini month will replace its own grid with it in an
 * adjustment task of the scheduler (DSA-77 D-1), not in this one.
 * - `mode`: `single` (default) or `range` (the Figma `modo`). `size`: `default` (the day is 36) or `large`
 *   (44), the Figma `tamanho`. Both reflect: `size` because the internal CSS selects the measures by it, `mode` for the selectors of the consumer;
 * - `value` (single) and `start` and `end` (range): the chosen date, or the period. Text `YYYY-MM-DD`, the
 *   same format as the `nph-scheduler`. The piece writes them itself when the person picks, and fires nothing
 *   when code sets them. `min` and `max`: a day outside them is disabled and the focus skips it;
 * - `unavailable`: a date unavailable by rule, such as a holiday, as a list of `YYYY-MM-DD` or a function that gets
 *   one and says whether it is unavailable. It fades the number, takes focus and cannot be chosen (item 9);
 * - `allows-non-contiguous-ranges` (`allowsNonContiguousRanges`): off by default, a period does not cross a day unavailable by
 *   rule (D-10). While only the Start is chosen, a day past the first unavailable day after it, or before the first one before it,
 *   cannot be the End and is disabled. On, a period may hold unavailable days, as in React Stately;
 * - `month`: the first month shown, `YYYY-MM` or any day of it. Empty, it follows the date (the Start of a
 *   range, the value, or today). The piece writes it when the person changes the month. `months`: `1` (default) or
 *   `2`, the two consecutive months of a range, which move together, one month per click (D-5);
 * - `week-start`: `sunday` (default) or `monday` (DSA-77 decision 8). `now`: the date of today, for tests and
 *   stories; absent, the clock of the machine;
 * - `labels`: every text the piece writes, already localized, as one object (the piece writes no word of its own).
 *   The names of the months and of the weekdays come from `Intl`, in the language of the nearest `lang`;
 * - the header has the arrows (Previous month and Next month, icon-only buttons with a tooltip) and the month title,
 *   an `nph-button` that opens the month view; with two months the Previous arrow is only on the first and the Next arrow only
 *   on the last, the other keeps its space and is hidden (D-5). The month view and the year view climb and come down as a ladder
 *   (D-9): a month title opens the months of a year, the year title (`chevron-down`) opens a block of twelve years, a year picked
 *   opens its months and a month picked opens its days. With two months the title of either one switches both columns together:
 *   two consecutive years, or two consecutive blocks of twelve years, and a month or a year picked comes back on the left. The
 *   month and year cells are as high as the day and the view keeps the height of the day view (D-2);
 * - six week rows, always, filled with days of the previous and the next month (D-1); picking a day outside the
 *   month chooses it, and in a single date the month moves to it (D-11);
 * - events `nph-pick` (the person picked a day; `detail: { date, start, end }`) and `nph-month-change` (the person changed
 *   the months shown; `detail: { month }`); both bubble and are composed;
 * - the method `focusDate(date?)` puts the focus on a day, for the panel that holds the grid;
 * - the keyboard is the one of the APG date picker dialog: each grid is one Tab stop; the arrows change the day and cross
 *   between the two grids of a range, Page Up and Page Down the month, Shift with them the year, Home and End the
 *   start and the end of the week; Esc in the month or the year view goes back to the days;
 * - no `::part` and no color property.
 *
 * Invalid input does not render and emits `console.error` only in development, one per cause while it lasts (the rule of
 * P21): a `mode`, a `size`, a `months` or a `week-start` outside the lists, and a date that does not exist. A missing label
 * renders anyway and says which keys are missing, once.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import calendarCss from './nph-calendar.css?inline';
import {
  NPH_CALENDAR_WEEK_STARTS,
  WEEK_ROWS,
  YEAR_BLOCK,
  addMonths,
  addYears,
  clampToLimits,
  firstOfMonth,
  fromDay,
  inPreview,
  isoDate,
  lastOfMonth,
  mergeLimits,
  monthSpan,
  monthWeeks,
  outsideLimits,
  parseDate,
  parseDay,
  parseMonth,
  periodReach,
  pickInRange,
  rangeRole,
  resolveFocus,
  spanDisabled,
  startOfWeek,
  toDay,
  weekdays,
  yearBlockStart,
  yearSpan,
} from './nph-calendar.logic';
import type { Day, Limits, Range } from './nph-calendar.logic';

const TAG = 'nph-calendar';

/** The events the grid fires when the person acts. */
export const NPH_CALENDAR_PICK_EVENT = 'nph-pick';
export const NPH_CALENDAR_MONTH_EVENT = 'nph-month-change';

export const NPH_CALENDAR_MODES = ['single', 'range'] as const;
export type NphCalendarMode = (typeof NPH_CALENDAR_MODES)[number];

export const NPH_CALENDAR_SIZES = ['default', 'large'] as const;
export type NphCalendarSize = (typeof NPH_CALENDAR_SIZES)[number];

/** The months a grid shows: one, or the two consecutive months of a range. */
export const NPH_CALENDAR_MONTHS = [1, 2] as const;

/** Every text the grid writes, already localized by the consuming application. */
export interface NphCalendarLabels {
  readonly previousMonth: string;
  readonly nextMonth: string;
  readonly previousYear: string;
  readonly nextYear: string;
  readonly previousYears: string;
  readonly nextYears: string;
  /** The word for today in the name of a day, such as `today`. */
  readonly today: string;
  /** The word for a chosen day, or a day of the chosen period, in the name of a day, such as `selected`. */
  readonly selected: string;
  /** The word for a day unavailable by rule, in the name of a day, such as `unavailable`. */
  readonly unavailable: string;
}

export const NPH_CALENDAR_LABEL_KEYS = [
  'previousMonth',
  'nextMonth',
  'previousYear',
  'nextYear',
  'previousYears',
  'nextYears',
  'today',
  'selected',
  'unavailable',
] as const satisfies readonly (keyof NphCalendarLabels)[];

export interface NphCalendarPickDetail {
  /** The day picked, `YYYY-MM-DD`. */
  readonly date: string;
  /** The chosen date after the pick (single) or the start of the period (range), `''` when none. */
  readonly start: string;
  readonly end: string;
}

export interface NphCalendarMonthDetail {
  /** The first month shown, the first day of it, `YYYY-MM-DD`. */
  readonly month: string;
}

/** A date unavailable by rule: a list of `YYYY-MM-DD`, or a function that says it for one date. */
export type NphCalendarUnavailable = readonly string[] | ((date: string) => boolean);

type View = 'day' | 'month' | 'year';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string | number>(list: readonly T[], value: unknown): value is T {
  return (list as readonly unknown[]).includes(value);
}

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export class NphCalendar extends LitElement {
  static override styles = unsafeCSS(calendarCss);

  static override properties = {
    /* `size` reflects because the internal CSS selects the measures by it; `mode` reflects for the selectors of the consumer. */
    mode: { type: String, reflect: true },
    size: { type: String, reflect: true },
    /* `months` reflects: the consumer's layout reads how many grids it holds. */
    months: { type: Number, reflect: true },
    value: { type: String },
    start: { type: String },
    end: { type: String },
    min: { type: String },
    max: { type: String },
    month: { type: String },
    weekStart: { type: String, attribute: 'week-start' },
    now: { type: String },
    labels: { attribute: false },
    unavailable: { attribute: false },
    allowsNonContiguousRanges: { type: Boolean, attribute: 'allows-non-contiguous-ranges' },
  };

  declare mode: string;
  declare size: string;
  declare months: number;
  /** The chosen date of a single calendar, `YYYY-MM-DD`. */
  declare value: string;
  /** The start and the end of the period of a range calendar, `YYYY-MM-DD`. */
  declare start: string;
  declare end: string;
  declare min: string;
  declare max: string;
  /** The first month shown, `YYYY-MM` or any day of it. Empty, it follows the date. */
  declare month: string;
  declare weekStart: string;
  /** The date of today; absent, the clock of the machine. */
  declare now: string;
  declare labels: Partial<NphCalendarLabels>;
  declare unavailable: NphCalendarUnavailable;
  /** Off by default: a period does not cross a day unavailable by rule (D-10). */
  declare allowsNonContiguousRanges: boolean;

  private valid = false;
  private reported: readonly string[] = [];
  private missingReported = false;

  /** The day that holds the roving focus of the grid. */
  private active: Day | null = null;
  /** The ladder: the day view, the month view or the year view, in the place of the month `slot`. */
  private view: View = 'day';
  /** The month whose title opened the view, to give the focus back to it. */
  private viewSlot = 0;
  /** The year of the first column of the month view, and the first year of the first column of the year view (D-9). */
  private viewYear = 0;
  private viewBlock = 0;
  /** The item that holds the roving focus, counted across the columns: 0 to 11 in the first, 12 to 23 in the second. */
  private viewIndex = 0;
  /** The day the pointer is on, for the preview of a period (D-5: no preview on touch). */
  private hover: Day | null = null;
  /** The day the keyboard focus is on, for the preview of a period. */
  private focused: Day | null = null;
  /** The month the person navigated to, kept while `month` stays empty in the consumer. */
  private navigated: Day | null = null;
  private pendingFocus: (() => void | Promise<void>) | null = null;
  private status = '';

  constructor() {
    super();
    this.mode = 'single';
    this.size = 'default';
    this.months = 1;
    this.value = '';
    this.start = '';
    this.end = '';
    this.min = '';
    this.max = '';
    this.month = '';
    this.weekStart = 'sunday';
    this.now = '';
    this.labels = {};
    this.unavailable = [];
    this.allowsNonContiguousRanges = false;
  }

  /* ----- the clock, the language and the text -------------------------------------------- */

  /** The nearest `lang`, crossing the shadow roots this piece lives in, as `nph-scheduler` reads it. */
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
    return new Date(day * 86_400_000);
  }

  private monthTitle(day: Day): string {
    return this.formatter({ month: 'long', year: 'numeric' }).format(this.dayDate(day));
  }

  private weekdayText(weekday: number, width: 'short' | 'long'): string {
    /* 1970-01-04 was a Sunday. */
    return this.formatter({ weekday: width }).format(this.dayDate(3 + weekday));
  }

  private dateName(day: Day): string {
    return this.formatter({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(this.dayDate(day));
  }

  private monthShort(year: number, month: number): string {
    return this.formatter({ month: 'short' }).format(this.dayDate(toDay(year, month, 1)));
  }

  private monthLong(year: number, month: number): string {
    return this.formatter({ month: 'long', year: 'numeric' }).format(this.dayDate(toDay(year, month, 1)));
  }

  private text(key: keyof NphCalendarLabels): string {
    return trimmed(this.labels?.[key]);
  }

  /** The current day: the `now` property, or the clock of the machine. */
  private get today(): Day {
    const fixed = parseDay(trimmed(this.now));
    if (fixed !== null) return fixed;
    const value = new Date();
    return toDay(value.getFullYear(), value.getMonth() + 1, value.getDate());
  }

  private get firstWeekday(): 0 | 1 {
    return this.weekStart === 'monday' ? 1 : 0;
  }

  private get rtl(): boolean {
    return getComputedStyle(this).direction === 'rtl';
  }

  private get isRange(): boolean {
    return this.mode === 'range';
  }

  private get shownMonths(): number {
    return Number(this.months) === 2 ? 2 : 1;
  }

  private get limits(): Limits {
    return { min: parseDay(trimmed(this.min)), max: parseDay(trimmed(this.max)) };
  }

  private get period(): Range {
    return this.isRange
      ? { start: parseDay(trimmed(this.start)), end: parseDay(trimmed(this.end)) }
      : { start: parseDay(trimmed(this.value)), end: null };
  }

  private isUnavailable(day: Day): boolean {
    const rule = this.unavailable;
    if (typeof rule === 'function') {
      try {
        return Boolean(rule(isoDate(day)));
      } catch {
        return false;
      }
    }
    return Array.isArray(rule) && rule.includes(isoDate(day));
  }

  /**
   * The limits that hold while only the Start of a period is chosen: the min and the max, plus the window of the End (D-10). The
   * window is looked for only between `low` and `high`, the farthest days the caller asks about, so it never walks the calendar. It is
   * kept apart from `limits`, which also decides the arrows and the month and year cells: a window must not lock the navigation.
   */
  private limitsFor(low: Day, high: Day): Limits {
    const limits = this.limits;
    const { start, end } = this.period;
    if (!this.isRange || this.allowsNonContiguousRanges || start === null || end !== null) return limits;
    const reach = periodReach(
      start,
      (day) => !outsideLimits(day, limits) && this.isUnavailable(day),
      limits.min === null ? low : Math.max(low, limits.min),
      limits.max === null ? high : Math.min(high, limits.max),
    );
    return mergeLimits(limits, reach);
  }

  /** The first and the last day the grids draw, outside days included. */
  private get visibleDays(): { low: Day; high: Day } {
    const firsts = this.shownFirsts;
    const week = this.firstWeekday;
    return {
      low: startOfWeek(firstOfMonth(firsts[0] as Day), week),
      high: startOfWeek(firstOfMonth(firsts[firsts.length - 1] as Day), week) + 7 * WEEK_ROWS - 1,
    };
  }

  /** The limits for a day the keyboard or the pointer is about to use: the window reaches as far as the grids and that day. */
  private limitsAround(day: Day): Limits {
    const { low, high } = this.visibleDays;
    return this.limitsFor(Math.min(low, day), Math.max(high, day));
  }

  /* ----- the months shown ------------------------------------------------------------------ */

  /** The month the grid opens on when nothing says otherwise (D-5, D-11). */
  private defaultFirst(): Day {
    const { start, end } = this.period;
    if (this.shownMonths === 2) {
      if (start !== null) return firstOfMonth(start);
      if (end !== null) return addMonths(firstOfMonth(end), -1);
      return firstOfMonth(this.today);
    }
    return firstOfMonth(start ?? end ?? this.today);
  }

  /** The first month shown: the `month` property, then the month the person navigated to, then the default. */
  private get first(): Day {
    const set = parseMonth(trimmed(this.month)) ?? parseDay(trimmed(this.month));
    if (set !== null) return firstOfMonth(set);
    return this.navigated ?? this.defaultFirst();
  }

  private setFirst(first: Day): void {
    const next = firstOfMonth(first);
    if (next === this.first && parseDay(trimmed(this.month)) !== null) {
      return;
    }
    this.navigated = next;
    this.month = isoDate(next);
    this.dispatchEvent(
      new CustomEvent<NphCalendarMonthDetail>(NPH_CALENDAR_MONTH_EVENT, {
        bubbles: true,
        composed: true,
        detail: { month: isoDate(next) },
      }),
    );
  }

  /** The first days of the months shown, in order. */
  private get shownFirsts(): Day[] {
    const first = this.first;
    return Array.from({ length: this.shownMonths }, (_, index) => addMonths(first, index));
  }

  /** The month that holds a day, among the ones shown: its slot, or `-1`. */
  private slotOf(day: Day): number {
    const monthFirst = firstOfMonth(day);
    return this.shownFirsts.indexOf(monthFirst);
  }

  /** Brings the months so that `day` shows: it takes the first place when it is before, the last when it is after. */
  private showDay(day: Day): void {
    if (this.slotOf(day) >= 0) return;
    const count = this.shownMonths;
    const monthFirst = firstOfMonth(day);
    this.setFirst(monthFirst < this.first ? monthFirst : addMonths(monthFirst, -(count - 1)));
  }

  /* ----- focus ------------------------------------------------------------------------------- */

  /** The day the roving focus starts on: the chosen date, or today, or the nearest allowed day (item 9). */
  private defaultActive(): Day {
    const { start, end } = this.period;
    const base = start ?? end ?? this.today;
    return clampToLimits(base, this.limits);
  }

  private get activeDay(): Day {
    return this.active ?? this.defaultActive();
  }

  /**
   * The day each grid offers as its one Tab stop (D-11): the active day in the grid that holds it; in the other, the
   * chosen date, today or the first allowed day of that month, as the grid of Mantine does.
   */
  private tabDay(slot: number, limits: Limits): Day | null {
    const monthFirst = (this.shownFirsts[slot] as Day);
    const last = lastOfMonth(monthFirst);
    const inMonth = (day: Day | null): day is Day => day !== null && day >= monthFirst && day <= last && !outsideLimits(day, limits);
    if (inMonth(this.activeDay) && this.slotOf(this.activeDay) === slot) return this.activeDay;
    const { start, end } = this.period;
    for (const candidate of [start, end, this.today]) {
      if (inMonth(candidate)) return candidate;
    }
    for (let day = monthFirst; day <= last; day += 1) {
      if (!outsideLimits(day, limits)) return day;
    }
    return null;
  }

  /** Puts the focus on a day, showing its month first. `date` absent: the default day. */
  focusDate(date?: string): void {
    const parsed = date === undefined ? null : parseDay(trimmed(date));
    const wanted = parsed ?? this.defaultActive();
    const target = resolveFocus(this.activeDay, wanted, this.limitsAround(wanted));
    this.view = 'day';
    this.active = target;
    this.showDay(target);
    this.afterRender(() => this.focusCell(target));
  }

  private afterRender(action: () => void | Promise<void>): void {
    this.pendingFocus = action;
    this.requestUpdate();
  }

  private cell(day: Day): HTMLButtonElement | null {
    return this.renderRoot.querySelector<HTMLButtonElement>(`button.day[data-date="${isoDate(day)}"]:not([data-outside])`);
  }

  private focusCell(day: Day): void {
    this.cell(day)?.focus();
  }

  private moveActive(target: Day, step?: number): void {
    const next = resolveFocus(this.activeDay, target, this.limitsAround(target), step);
    this.active = next;
    this.showDay(next);
    this.afterRender(() => this.focusCell(next));
  }

  /* ----- events from the grid ---------------------------------------------------------------- */

  private pick(day: Day): void {
    if (outsideLimits(day, this.limitsAround(day)) || this.isUnavailable(day)) return;
    let start = '';
    let end = '';
    if (this.isRange) {
      const next = pickInRange(this.period, day);
      this.start = next.start === null ? '' : isoDate(next.start);
      this.end = next.end === null ? '' : isoDate(next.end);
      start = this.start;
      end = this.end;
    } else {
      this.value = isoDate(day);
      start = this.value;
    }
    this.active = day;
    /* D-11: a single date shows the month of the day picked; the two months of a range stay where they are. */
    if (!this.isRange) {
      this.showDay(day);
    }
    this.dispatchEvent(
      new CustomEvent<NphCalendarPickDetail>(NPH_CALENDAR_PICK_EVENT, {
        bubbles: true,
        composed: true,
        detail: { date: isoDate(day), start, end },
      }),
    );
  }

  private readonly onDayClick = (event: MouseEvent): void => {
    const button = (event.currentTarget as HTMLElement | null) ?? null;
    const day = button === null ? null : parseDate(button.dataset.date ?? '');
    if (day === null) return;
    this.pick(day);
  };

  private readonly onDayFocus = (event: FocusEvent): void => {
    const day = parseDate((event.currentTarget as HTMLElement).dataset.date ?? '');
    if (day === null) return;
    const moved = this.active !== day;
    this.active = day;
    this.focused = day;
    /* Only the roving tab stop and the preview of a period change with the focus. */
    if (moved || (this.isRange && this.period.start !== null && this.period.end === null)) this.requestUpdate();
  };

  private readonly onDayBlur = (): void => {
    if (this.focused === null) return;
    this.focused = null;
    if (this.isRange && this.period.start !== null && this.period.end === null) this.requestUpdate();
  };

  private readonly onDayPointerEnter = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    const day = parseDate((event.currentTarget as HTMLElement).dataset.date ?? '');
    if (day === null) return;
    this.hover = day;
    this.requestUpdate();
  };

  private readonly onGridPointerLeave = (): void => {
    if (this.hover === null) return;
    this.hover = null;
    this.requestUpdate();
  };

  private readonly onGridKeydown = (event: KeyboardEvent): void => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const current = this.activeDay;
    const rtl = this.rtl;
    let target: Day | null = null;
    let step: number | undefined;
    switch (event.key) {
      case 'ArrowLeft':
        step = rtl ? 1 : -1;
        break;
      case 'ArrowRight':
        step = rtl ? -1 : 1;
        break;
      case 'ArrowUp':
        step = -7;
        break;
      case 'ArrowDown':
        step = 7;
        break;
      case 'Home':
        target = startOfWeek(current, this.firstWeekday);
        break;
      case 'End':
        target = startOfWeek(current, this.firstWeekday) + 6;
        break;
      case 'PageUp':
        target = event.shiftKey ? addYears(current, -1) : addMonths(current, -1);
        break;
      case 'PageDown':
        target = event.shiftKey ? addYears(current, 1) : addMonths(current, 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    if (step !== undefined) {
      this.moveActive(current + step, step);
    } else if (target !== null) {
      this.moveActive(target);
    }
  };

  /* ----- header: months, years and the ladder -------------------------------------------------- */

  private moveMonths(count: number): void {
    this.setFirst(addMonths(this.first, count));
  }

  private get previousMonthDisabled(): boolean {
    const before = addMonths(this.first, -1);
    return spanDisabled(before, lastOfMonth(before), this.limits);
  }

  private get nextMonthDisabled(): boolean {
    const after = addMonths(this.first, this.shownMonths);
    return spanDisabled(after, lastOfMonth(after), this.limits);
  }

  /** The columns the month and year views draw: one per month shown, so a range switches both months together (D-9). */
  private get viewColumns(): number {
    return this.shownMonths;
  }

  /** How many items the views hold across their columns. */
  private get viewItemCount(): number {
    return 12 * this.viewColumns;
  }

  /**
   * Opens the month view or the year view in place of every month shown (D-9). The first column is anchored on the first month shown (its
   * year, or its block of twelve years), so no month on screen is lost; `slot` is the month whose title was pressed, which gets the
   * focus back when the view closes, and `column` the column whose item takes the focus when nothing is chosen.
   */
  private openView(view: Exclude<View, 'day'>, slot: number, column = slot): void {
    const first = fromDay(this.shownFirsts[0] as Day);
    const title = fromDay(this.shownFirsts[slot] as Day);
    const chosen = [this.period.start, this.period.end].filter((day): day is Day => day !== null).map((day) => fromDay(day));
    if (view === 'month') {
      this.viewSlot = slot;
      this.viewYear = first.year;
      /* The chosen item, or with none the item of the title (D-9). */
      const inView = chosen.find((parts) => parts.year >= this.viewYear && parts.year < this.viewYear + this.viewColumns);
      this.viewIndex = inView === undefined ? (title.year - this.viewYear) * 12 + title.month - 1 : (inView.year - this.viewYear) * 12 + inView.month - 1;
    } else {
      /* From the year title: the year view starts at the decade of the first column's year. */
      this.viewBlock = yearBlockStart(this.viewYear);
      const inBlock = chosen.find((parts) => parts.year >= this.viewBlock && parts.year < this.viewBlock + this.viewItemCount);
      this.viewIndex = (inBlock?.year ?? this.viewYear + column) - this.viewBlock;
    }
    this.view = view;
    this.status = this.viewStatus();
    this.afterRender(() => this.focusViewItem());
  }

  /** The block of twelve years of a column, as `2020 – 2031`. */
  private blockLabel(column = 0): string {
    const first = this.viewBlock + column * YEAR_BLOCK;
    return `${first} – ${first + YEAR_BLOCK - 1}`;
  }

  /** What the live region says about the views: the years, or the blocks of years, from the first column to the last. */
  private viewStatus(): string {
    return Array.from({ length: this.viewColumns }, (_, column) =>
      this.view === 'month' ? String(this.viewYear + column) : this.blockLabel(column),
    ).join(', ');
  }

  /** Back to the days: the month view and the year view close, and the title that opened them takes the focus. */
  private closeView(focusTitle: boolean): void {
    const slot = this.viewSlot;
    this.view = 'day';
    this.status = this.shownFirsts.map((first) => this.monthTitle(first)).join(', ');
    this.requestUpdate();
    if (focusTitle) {
      this.afterRender(async () => {
        /* The title is a new button: it draws once it has updated, and only then takes the focus. */
        const title = this.renderRoot.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('.title')[slot];
        await title?.updateComplete;
        title?.focus();
      });
    }
  }

  /** The year view opens the months of the year picked; the month view opens the days of the month picked, on the left (D-2, D-9). */
  private pickMonth(index: number): void {
    const monthFirst = toDay(this.viewYear + Math.floor(index / 12), (index % 12) + 1, 1);
    this.setFirst(monthFirst);
    const target = clampToLimits(monthFirst, this.limits);
    this.active = target;
    this.view = 'day';
    this.status = this.shownFirsts.map((first) => this.monthTitle(first)).join(', ');
    this.afterRender(() => this.focusCell(target));
  }

  /** A year picked, in either column, comes back as the first year of the month view (D-9). */
  private pickYear(year: number): void {
    this.viewYear = year;
    this.view = 'month';
    const { start, end } = this.period;
    const chosen = [start, end].filter((day): day is Day => day !== null).map((day) => fromDay(day)).find((parts) => parts.year >= year && parts.year < year + this.viewColumns);
    this.viewIndex = chosen === undefined ? fromDay(this.shownFirsts[this.viewSlot] as Day).month - 1 : (chosen.year - year) * 12 + chosen.month - 1;
    this.status = this.viewStatus();
    this.afterRender(() => this.focusViewItem());
  }

  /** The arrows of the views move one year, or one block of twelve years, per click, the columns together. */
  private moveView(direction: -1 | 1): void {
    if (this.view === 'month') {
      this.viewYear += direction;
    } else {
      this.viewBlock += direction * YEAR_BLOCK;
    }
    this.status = this.viewStatus();
    this.requestUpdate();
  }

  private get previousViewDisabled(): boolean {
    const limits = this.limits;
    if (this.view === 'month') {
      const span = yearSpan(this.viewYear - 1);
      return spanDisabled(span.first, span.last, limits);
    }
    const span = yearSpan(this.viewBlock - 1);
    return spanDisabled(span.first, span.last, limits);
  }

  /** The next arrow looks past the last column: the year after its year, or the first year after its block. */
  private get nextViewDisabled(): boolean {
    const limits = this.limits;
    if (this.view === 'month') {
      const span = yearSpan(this.viewYear + this.viewColumns);
      return spanDisabled(span.first, span.last, limits);
    }
    const span = yearSpan(this.viewBlock + this.viewItemCount);
    return spanDisabled(span.first, span.last, limits);
  }

  /** The cells of the month or year view, in the order of the columns. */
  private viewItems(): HTMLButtonElement[] {
    return [...this.renderRoot.querySelectorAll<HTMLButtonElement>('.view .item')];
  }

  private itemDisabled(index: number): boolean {
    const limits = this.limits;
    if (this.view === 'month') {
      const span = monthSpan(this.viewYear + Math.floor(index / 12), (index % 12) + 1);
      return spanDisabled(span.first, span.last, limits);
    }
    const span = yearSpan(this.viewBlock + index);
    return spanDisabled(span.first, span.last, limits);
  }

  /**
   * On opening a view the focus goes to the chosen item or, with none, to the item of the title, and to the nearest
   * enabled item when that one is disabled (D-9).
   */
  private focusViewItem(): void {
    const items = this.viewItems();
    const count = this.viewItemCount;
    let index = Math.min(Math.max(this.viewIndex, 0), count - 1);
    if (this.itemDisabled(index)) {
      let best = -1;
      for (let candidate = 0; candidate < count; candidate += 1) {
        if (!this.itemDisabled(candidate) && (best < 0 || Math.abs(candidate - index) < Math.abs(best - index))) best = candidate;
      }
      index = best < 0 ? index : best;
    }
    this.viewIndex = index;
    items[index]?.focus();
  }

  private readonly onViewKeydown = (event: KeyboardEvent): void => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const rtl = this.rtl;
    const row = this.viewIndex - (this.viewIndex % 3);
    const last = this.viewItemCount - 1;
    /* The first enabled cell from `from` in steps of `delta`, inside `low` to `high`, or `null`. The columns are one sequence, like the two grids of days. */
    const seek = (from: number, delta: number, low: number, high: number): number | null => {
      for (let index = from; index >= low && index <= high; index += delta) {
        if (!this.itemDisabled(index)) return index;
      }
      return null;
    };
    let next: number | null;
    switch (event.key) {
      case 'ArrowLeft':
        next = seek(this.viewIndex + (rtl ? 1 : -1), rtl ? 1 : -1, 0, last);
        break;
      case 'ArrowRight':
        next = seek(this.viewIndex + (rtl ? -1 : 1), rtl ? -1 : 1, 0, last);
        break;
      case 'ArrowUp':
        next = seek(this.viewIndex - 3, -3, 0, last);
        break;
      case 'ArrowDown':
        next = seek(this.viewIndex + 3, 3, 0, last);
        break;
      case 'Home':
        next = seek(row, 1, row, row + 2);
        break;
      case 'End':
        next = seek(row + 2, -1, row, row + 2);
        break;
      case 'PageUp':
      case 'PageDown': {
        /* Page Up and Page Down do what the header arrows do (D-9). */
        event.preventDefault();
        const move = event.key === 'PageUp' ? -1 : 1;
        if (move < 0 ? this.previousViewDisabled : this.nextViewDisabled) return;
        this.moveView(move);
        this.afterRender(() => this.focusViewItem());
        return;
      }
      default:
        return;
    }
    event.preventDefault();
    if (next === null) return;
    this.viewIndex = next;
    this.viewItems()[next]?.focus();
    this.requestUpdate();
  };

  private readonly onItemClick = (event: MouseEvent): void => {
    const index = Number((event.currentTarget as HTMLElement).dataset.index);
    if (this.itemDisabled(index)) return;
    if (this.view === 'month') {
      this.pickMonth(index);
    } else {
      this.pickYear(this.viewBlock + index);
    }
  };

  /** Esc in the month or year view goes back to the days; the second Esc is for the panel (D-9). */
  private readonly onRootKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || this.view === 'day') return;
    event.stopPropagation();
    event.preventDefault();
    this.closeView(true);
  };

  /* ----- validation and lifecycle -------------------------------------------------------------- */

  private report(causes: string[]): void {
    for (const cause of causes) {
      if (!this.reported.includes(cause)) {
        devError(`${cause} Nothing was drawn.`);
      }
    }
    this.reported = causes;
  }

  protected override willUpdate(changed: PropertyValues): void {
    const causes: string[] = [];
    const mode = trimmed(this.mode);
    if (!oneOf(NPH_CALENDAR_MODES, mode)) causes.push(`mode "${this.mode}" does not exist. Use ${NPH_CALENDAR_MODES.join(' or ')}.`);
    const size = trimmed(this.size);
    if (!oneOf(NPH_CALENDAR_SIZES, size)) causes.push(`size "${this.size}" does not exist. Use ${NPH_CALENDAR_SIZES.join(' or ')}.`);
    if (!oneOf(NPH_CALENDAR_MONTHS, Number(this.months))) causes.push(`months "${this.months}" does not exist. Use 1 or 2.`);
    const weekStart = trimmed(this.weekStart);
    if (!oneOf(NPH_CALENDAR_WEEK_STARTS, weekStart)) {
      causes.push(`week-start "${this.weekStart}" does not exist. Use ${NPH_CALENDAR_WEEK_STARTS.join(' or ')}.`);
    }
    for (const name of ['value', 'start', 'end', 'min', 'max', 'now'] as const) {
      const text = trimmed(this[name]);
      if (text !== '' && parseDay(text) === null) causes.push(`${name} "${text}" is not a date written as YYYY-MM-DD.`);
    }
    const month = trimmed(this.month);
    if (month !== '' && parseMonth(month) === null && parseDay(month) === null) {
      causes.push(`month "${month}" is not a month written as YYYY-MM.`);
    }
    this.valid = causes.length === 0;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    this.report(causes);

    if (this.valid && !this.missingReported) {
      const labels = (this.labels ?? {}) as Record<string, unknown>;
      const missing = NPH_CALENDAR_LABEL_KEYS.filter((key) => trimmed(labels[key]) === '');
      if (missing.length > 0) {
        this.missingReported = true;
        devError(`labels is missing ${missing.join(', ')}: each one is a text the piece owes and renders without.`);
      }
    }

    if (changed.has('month') && trimmed(this.month) === '') {
      this.navigated = null;
    }
    if (this.valid && this.view === 'day') {
      this.status = this.shownFirsts.map((first) => this.monthTitle(first)).join(', ');
    }
  }

  protected override updated(): void {
    const action = this.pendingFocus;
    if (action !== null) {
      this.pendingFocus = null;
      /* After the update: the focus event of a day asks for another one, which must not start inside this one. */
      queueMicrotask(() => void action());
    }
  }

  /* ----- drawing ---------------------------------------------------------------------------------- */

  /**
   * An arrow of a header. With two columns the Previous arrow is only on the first and the Next arrow only on the last (D-5, D-9): the
   * other one keeps its space, so the title stays centered on its grid, and is hidden with `visibility`, which takes it out of sight, of
   * the Tab order and of the accessibility tree at once.
   */
  private arrow(direction: -1 | 1, label: string, disabled: boolean, onClick: () => void, hidden = false): TemplateResult {
    const size = trimmed(this.size) === 'large' ? 'large' : 'default';
    return html`<nph-button
      class="arrow"
      data-hidden=${hidden ? '' : nothing}
      severity="secondary"
      emphasis="ghost"
      shape="square"
      size=${size}
      icon-start=${direction < 0 ? 'chevron-left' : 'chevron-right'}
      label=${label}
      ?disabled=${disabled}
      @click=${onClick}
    ></nph-button>`;
  }

  /** Whether the column `slot` of `count` carries the Previous arrow (the first) or the Next arrow (the last). */
  private hasPrevious(slot: number): boolean {
    return slot === 0;
  }

  private hasNext(slot: number, count: number): boolean {
    return slot === count - 1;
  }

  private dayHeader(slot: number, monthFirst: Day): TemplateResult {
    const size = trimmed(this.size) === 'large' ? 'large' : 'default';
    return html`<div class="header">
      ${this.arrow(-1, this.text('previousMonth'), this.previousMonthDisabled, () => this.moveMonths(-1), !this.hasPrevious(slot))}
      <div class="frame">
        <nph-button
          class="title"
          severity="secondary"
          emphasis="ghost"
          size=${size}
          text=${this.monthTitle(monthFirst)}
          icon-end="chevron-down"
          @click=${() => this.openView('month', slot)}
        ></nph-button>
      </div>
      ${this.arrow(1, this.text('nextMonth'), this.nextMonthDisabled, () => this.moveMonths(1), !this.hasNext(slot, this.shownMonths))}
    </div>`;
  }

  /** The class and the data of one day: the states the evidence table draws. */
  private day(day: Day, monthFirst: Day, tabDay: Day | null, today: Day, period: Range, limits: Limits, target: Day | null): TemplateResult {
    const outside = day < monthFirst || day > lastOfMonth(monthFirst);
    /* `limits` holds the min, the max and, while only the Start is chosen, the window of the End (D-10): a day the window closes is disabled. */
    const limited = outsideLimits(day, limits);
    const unavailable = !outsideLimits(day, this.limits) && this.isUnavailable(day);
    const role = this.isRange ? rangeRole(day, period) : period.start === day ? 'single' : 'none';
    const selected = this.isRange ? role !== 'none' : role === 'single';
    const preview = this.isRange && inPreview(day, period.start, period.end, target);
    const isToday = day === today;
    /* The band behind the Start and the End joins the middle; a day outside the month has none, a middle one keeps it (evidence). */
    const hasPeriod = period.start !== null && period.end !== null && period.end > period.start;
    const band = !hasPeriod ? null : role === 'middle' ? 'full' : outside ? null : role === 'start' ? 'after' : role === 'end' ? 'before' : null;
    /* The preview band of the pointer or the arrows, from the Start to the target, in either direction. */
    const edge =
      this.isRange && period.start !== null && period.end === null && target !== null && target !== period.start && day === period.start
        ? target > period.start
          ? 'after'
          : 'before'
        : null;
    const names = [this.dateName(day)];
    if (isToday && this.text('today') !== '') names.push(this.text('today'));
    if (selected && this.text('selected') !== '') names.push(this.text('selected'));
    if (unavailable && this.text('unavailable') !== '') names.push(this.text('unavailable'));
    const date = isoDate(day);
    const tabbable = !outside && tabDay === day;
    return html`<td
      role="gridcell"
      class="cell"
      aria-selected=${selected ? 'true' : 'false'}
      data-band=${band ?? nothing}
      data-preview=${preview ? '' : nothing}
      data-edge=${edge ?? nothing}
    >
      <button
        type="button"
        class="day"
        data-date=${date}
        data-outside=${outside ? '' : nothing}
        data-today=${isToday ? '' : nothing}
        data-selected=${selected ? '' : nothing}
        data-role=${role}
        data-preview=${preview ? '' : nothing}
        data-unavailable=${unavailable ? '' : nothing}
        tabindex=${tabbable ? '0' : '-1'}
        aria-label=${names.join(', ')}
        aria-current=${isToday ? 'date' : nothing}
        aria-disabled=${unavailable ? 'true' : nothing}
        ?disabled=${limited}
        @click=${this.onDayClick}
        @focus=${this.onDayFocus}
        @blur=${this.onDayBlur}
        @pointerenter=${this.onDayPointerEnter}
      >
        <span class="number">${fromDay(day).date}</span>
      </button>
    </td>`;
  }

  private dayGrid(slot: number, monthFirst: Day, limits: Limits): TemplateResult {
    const period = this.period;
    const today = this.today;
    const tabDay = this.tabDay(slot, limits);
    const first = this.firstWeekday;
    /* The preview band stops at a day that cannot be the End (D-10): it never paints over a disabled day. */
    const previewTarget = this.isRange ? (this.hover ?? this.focused) : null;
    const target = previewTarget !== null && outsideLimits(previewTarget, limits) ? null : previewTarget;
    const title = this.monthTitle(monthFirst);
    return html`<table class="grid" role="grid" aria-label=${title} @keydown=${this.onGridKeydown} @pointerleave=${this.onGridPointerLeave}>
      <thead>
        <tr class="weekdays">
          ${weekdays(first).map(
            (weekday) =>
              html`<th class="weekday" scope="col" abbr=${this.weekdayText(weekday, 'long')}>${this.weekdayText(weekday, 'short')}</th>`,
          )}
        </tr>
      </thead>
      <tbody>
        ${monthWeeks(monthFirst, first).map(
          (week) => html`<tr class="week">${week.map((day) => this.day(day, monthFirst, tabDay, today, period, limits, target))}</tr>`,
        )}
      </tbody>
    </table>`;
  }

  private monthItems(column: number): TemplateResult[] {
    const todayParts = fromDay(this.today);
    const year = this.viewYear + column;
    const { start, end } = this.period;
    const chosenMonths = new Set([start, end].filter((day): day is Day => day !== null).map((day) => `${fromDay(day).year}-${fromDay(day).month}`));
    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const current = todayParts.year === year && todayParts.month === month;
      const selected = chosenMonths.has(`${year}-${month}`);
      /* The name starts with the visible text (WCAG 2.5.3): `Jan` is not a word of `January 2026`, so it is said first. */
      const short = this.monthShort(year, month);
      return this.item(column * 12 + index, short, `${short}, ${this.monthLong(year, month)}`, current, selected);
    });
  }

  private yearItems(column: number): TemplateResult[] {
    const todayYear = fromDay(this.today).year;
    const { start, end } = this.period;
    const chosenYears = new Set([start, end].filter((day): day is Day => day !== null).map((day) => fromDay(day).year));
    return Array.from({ length: YEAR_BLOCK }, (_, index) => {
      const year = this.viewBlock + column * YEAR_BLOCK + index;
      return this.item(column * YEAR_BLOCK + index, String(year), String(year), todayYear === year, chosenYears.has(year));
    });
  }

  private item(index: number, text: string, name: string, current: boolean, selected: boolean): TemplateResult {
    const disabled = this.itemDisabled(index);
    return html`<td role="gridcell" class="cell" aria-selected=${selected ? 'true' : 'false'}>
      <button
        type="button"
        class="item"
        data-index=${index}
        data-current=${current ? '' : nothing}
        data-selected=${selected ? '' : nothing}
        tabindex=${index === this.viewIndex ? '0' : '-1'}
        aria-label=${name}
        aria-current=${current ? 'date' : nothing}
        ?disabled=${disabled}
        @click=${this.onItemClick}
        @focus=${() => {
          this.viewIndex = index;
        }}
      >
        ${text}
      </button>
    </td>`;
  }

  /**
   * One column of the month view or the year view, in the place of a month (D-2): the header of the grid, and four rows of the day's
   * height spread over the height of the day view. With two months there are two columns, one year or one block of twelve years each.
   */
  private viewPanel(column: number): TemplateResult {
    const size = trimmed(this.size) === 'large' ? 'large' : 'default';
    const month = this.view === 'month';
    const items = month ? this.monthItems(column) : this.yearItems(column);
    const rows = [0, 1, 2, 3].map((row) => items.slice(row * 3, row * 3 + 3));
    const label = month ? String(this.viewYear + column) : this.blockLabel(column);
    return html`<div class="month view" data-view=${this.view}>
      <div class="header">
        ${this.arrow(
          -1,
          month ? this.text('previousYear') : this.text('previousYears'),
          this.previousViewDisabled,
          () => this.moveView(-1),
          !this.hasPrevious(column),
        )}
        <div class="frame">
          ${month
            ? html`<nph-button
                class="title"
                severity="secondary"
                emphasis="ghost"
                size=${size}
                text=${label}
                icon-end="chevron-down"
                @click=${() => this.openView('year', this.viewSlot, column)}
              ></nph-button>`
            : html`<span class="title-text">${label}</span>`}
        </div>
        ${this.arrow(
          1,
          month ? this.text('nextYear') : this.text('nextYears'),
          this.nextViewDisabled,
          () => this.moveView(1),
          !this.hasNext(column, this.viewColumns),
        )}
      </div>
      <table class="grid view-grid" role="grid" aria-label=${label} @keydown=${this.onViewKeydown}>
        <tbody>
          ${rows.map((row) => html`<tr class="week">${row}</tr>`)}
        </tbody>
      </table>
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const firsts = this.shownFirsts;
    const { low, high } = this.visibleDays;
    const limits = this.limitsFor(low, high);
    return html`<div class="months" @keydown=${this.onRootKeydown}>
        ${firsts.map((monthFirst, slot) =>
          this.view === 'day'
            ? html`<div class="month">${this.dayHeader(slot, monthFirst)}${this.dayGrid(slot, monthFirst, limits)}</div>`
            : this.viewPanel(slot),
        )}
      </div>
      <div class="status" role="status" aria-live="polite">${this.status}</div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphCalendar);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-calendar': NphCalendar;
  }
}
