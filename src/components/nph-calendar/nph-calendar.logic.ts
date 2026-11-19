/**
 * The pure logic of `nph-calendar` (DSA-90, P133): the civil calendar, the six-week month, what a
 * limit and a rule make of a day, the selection cycle of a range and the blocks of the year view.
 *
 * A day is a whole number of days since 1970-01-01, counted in UTC, so the arithmetic is the same in
 * any time zone and in a day with a change of the clock. Nothing here reads the clock, the language
 * or the DOM: the element passes them in. The text form of a day is `YYYY-MM-DD`, the same as the
 * `nph-scheduler`; the scheduler keeps its own copy of the civil calendar, and so does this file
 * (P03: the logic lives next to the component that owns it).
 */

export type Day = number;

/** 0 is Sunday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const NPH_CALENDAR_WEEK_STARTS = ['sunday', 'monday'] as const;
export type NphCalendarWeekStart = (typeof NPH_CALENDAR_WEEK_STARTS)[number];

const MS_PER_DAY = 86_400_000;

/** D-1: a month always draws six week rows, filled with days of the previous and the next month. */
export const WEEK_ROWS = 6;

/** The year view shows a block of twelve years in 4 rows by 3 columns (D-9). */
export const YEAR_BLOCK = 12;

export function toDay(year: number, month: number, date: number): Day {
  return Math.round(Date.UTC(year, month - 1, date) / MS_PER_DAY);
}

export function fromDay(day: Day): { year: number; month: number; date: number } {
  const value = new Date(day * MS_PER_DAY);
  return { year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, date: value.getUTCDate() };
}

/** Reads `YYYY-MM-DD`; a date that does not exist (`2026-02-30`) is `null`. */
export function parseDate(text: string): Day | null {
  const found = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (found === null) return null;
  const year = Number(found[1]);
  const month = Number(found[2]);
  const date = Number(found[3]);
  const day = toDay(year, month, date);
  const back = fromDay(day);
  return back.year === year && back.month === month && back.date === date ? day : null;
}

/** Reads a date, or an instant that starts with one (`YYYY-MM-DDTHH:mm`): the day of it. */
export function parseDay(text: string): Day | null {
  const value = (text ?? '').trim();
  return parseDate(value.length > 10 && value[10] === 'T' ? value.slice(0, 10) : value);
}

/** Reads `YYYY-MM` as the first day of that month. */
export function parseMonth(text: string): Day | null {
  const found = /^(\d{4})-(\d{2})$/.exec((text ?? '').trim());
  return found === null ? null : parseDate(`${found[1]}-${found[2]}-01`);
}

export function isoDate(day: Day): string {
  const { year, month, date } = fromDay(day);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
}

/** 0 is Sunday. 1970-01-01 was a Thursday. */
export function weekdayOf(day: Day): Weekday {
  return ((((day + 4) % 7) + 7) % 7) as Weekday;
}

export function firstOfMonth(day: Day): Day {
  const { year, month } = fromDay(day);
  return toDay(year, month, 1);
}

export function daysInMonth(day: Day): number {
  const { year, month } = fromDay(day);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function lastOfMonth(day: Day): Day {
  return firstOfMonth(day) + daysInMonth(day) - 1;
}

/** The same day of another month; a day the month does not have becomes its last day. */
export function addMonths(day: Day, count: number): Day {
  const { year, month, date } = fromDay(day);
  const index = year * 12 + (month - 1) + count;
  const targetYear = Math.floor(index / 12);
  const targetMonth = (index % 12) + 1;
  const last = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  return toDay(targetYear, targetMonth, Math.min(date, last));
}

/** The same day of another year; 29 February becomes 28 February in a year that is not a leap year. */
export function addYears(day: Day, count: number): Day {
  return addMonths(day, count * 12);
}

/** The first day of the week of `day`, the week starting on `first` (0 Sunday, 1 Monday). */
export function startOfWeek(day: Day, first: 0 | 1): Day {
  const back = (weekdayOf(day) - first + 7) % 7;
  return day - back;
}

/** The weekdays of one week, in the order the row shows them. */
export function weekdays(first: 0 | 1): Weekday[] {
  return Array.from({ length: 7 }, (_, index) => ((first + index) % 7) as Weekday);
}

/** The six weeks of the month of `day`: every week whole, seven days each (D-1). */
export function monthWeeks(day: Day, first: 0 | 1): Day[][] {
  const start = startOfWeek(firstOfMonth(day), first);
  return Array.from({ length: WEEK_ROWS }, (_, week) => Array.from({ length: 7 }, (_, index) => start + week * 7 + index));
}

/** The first year of the block of twelve that holds `year`: it starts at the decade, as drawn (D-9). */
export function yearBlockStart(year: number): number {
  return Math.floor(year / 10) * 10;
}

export interface Limits {
  readonly min: Day | null;
  readonly max: Day | null;
}

/** A day before the min or after the max: it is disabled and the focus skips it. */
export function outsideLimits(day: Day, limits: Limits): boolean {
  return (limits.min !== null && day < limits.min) || (limits.max !== null && day > limits.max);
}

/** Clamps a day into the limits. */
export function clampToLimits(day: Day, limits: Limits): Day {
  if (limits.min !== null && day < limits.min) return limits.min;
  if (limits.max !== null && day > limits.max) return limits.max;
  return day;
}

/**
 * A month, or a year, is disabled only when none of its days is allowed (D-9): it lies wholly before the
 * min or wholly after the max.
 */
export function spanDisabled(first: Day, last: Day, limits: Limits): boolean {
  return (limits.min !== null && last < limits.min) || (limits.max !== null && first > limits.max);
}

/** The first day of the year `year`, and its last. */
export function yearSpan(year: number): { first: Day; last: Day } {
  return { first: toDay(year, 1, 1), last: toDay(year, 12, 31) };
}

/** The first day of the month `month` (1 to 12) of `year`, and its last. */
export function monthSpan(year: number, month: number): { first: Day; last: Day } {
  const first = toDay(year, month, 1);
  return { first, last: lastOfMonth(first) };
}

/**
 * The day the focus lands on when it moves from `from` to `target`, by the key `step` (in days, signed,
 * for an arrow). A day outside the min or max is skipped: an arrow goes on in its direction until it finds an
 * allowed day and stays where it is when there is none. Home, End and the pages (no `step`) go to the
 * nearest allowed day (the item 9 rule for a day outside the limit, and for today outside it).
 */
export function resolveFocus(from: Day, target: Day, limits: Limits, step?: number): Day {
  if (!outsideLimits(target, limits)) return target;
  if (step === undefined || step === 0) return clampToLimits(target, limits);
  let next = target;
  while (outsideLimits(next, limits)) {
    const beyondMax = limits.max !== null && next > limits.max;
    const beyondMin = limits.min !== null && next < limits.min;
    /* Walking away from the allowed days: there is none in that direction. */
    if ((beyondMax && step > 0) || (beyondMin && step < 0)) return from;
    next += step;
  }
  return next;
}

/* ----- the selection of a range -------------------------------------------------------------- */

export interface Range {
  readonly start: Day | null;
  readonly end: Day | null;
}

/**
 * One pick in a range (D-10). With nothing, or with a complete period, the day becomes the new Start and the End is
 * cleared: a third pick starts over. With only the Start, the day is the End, and an End before the Start reorders: the
 * earlier day becomes the Start. Start and End on the same day is a valid one-day period.
 */
export function pickInRange(range: Range, day: Day): Range {
  if (range.start === null || range.end !== null) {
    return { start: day, end: null };
  }
  return day < range.start ? { start: day, end: range.start } : { start: range.start, end: day };
}

/**
 * The days that can be the End while only the Start is chosen, when a period does not cross a day unavailable by rule (D-10, the
 * default of `allowsNonContiguousRanges`). The first unavailable day after the Start closes the window on its day before, and the
 * first one before the Start closes it on its day after; a side with none keeps `null`. The search starts at the day next to the
 * Start (the Start itself, if typed on an unavailable day, does not close the window) and goes only as far as `low` and `high`, the
 * farthest day the caller asks about, so a rule given as a function is called for a bounded number of days.
 */
export function periodReach(start: Day, isUnavailable: (day: Day) => boolean, low: Day, high: Day): Limits {
  let max: Day | null = null;
  for (let day = start + 1; day <= high; day += 1) {
    if (isUnavailable(day)) {
      max = day - 1;
      break;
    }
  }
  let min: Day | null = null;
  for (let day = start - 1; day >= low; day -= 1) {
    if (isUnavailable(day)) {
      min = day + 1;
      break;
    }
  }
  return { min, max };
}

/** Two sets of limits as one: the later `min` and the earlier `max` win. */
export function mergeLimits(a: Limits, b: Limits): Limits {
  const min = a.min === null ? b.min : b.min === null ? a.min : Math.max(a.min, b.min);
  const max = a.max === null ? b.max : b.max === null ? a.max : Math.min(a.max, b.max);
  return { min, max };
}

export type RangeRole = 'none' | 'start' | 'end' | 'middle' | 'single';

/**
 * What a day is in the period: the Start, the End, a day between them, or a one-day period (`single`: the Start and the
 * End are the same day). With only the Start, it is the Start alone.
 */
export function rangeRole(day: Day, range: Range): RangeRole {
  const { start, end } = range;
  if (start === null) return 'none';
  if (end === null || end === start) {
    return day === start ? (end === null ? 'start' : 'single') : 'none';
  }
  if (day === start) return 'start';
  if (day === end) return 'end';
  return day > start && day < end ? 'middle' : 'none';
}

/**
 * Whether a day is in the preview band: the Start is chosen, the End is not, and the pointer or the arrows are on `target`.
 * The band runs between the Start and the target, in either order, the Start excluded.
 */
export function inPreview(day: Day, start: Day | null, end: Day | null, target: Day | null): boolean {
  if (start === null || end !== null || target === null || target === start) return false;
  const low = Math.min(start, target);
  const high = Math.max(start, target);
  return day >= low && day <= high && day !== start;
}
