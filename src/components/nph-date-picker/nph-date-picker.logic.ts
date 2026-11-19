/**
 * The pure logic of `nph-date-picker` (DSA-90, P133): how a date is written in the field and read back, the
 * message a typed date gets (D-4) and the period of each shortcut (D-6). The civil calendar itself is in
 * `nph-calendar.logic.ts`. Nothing here reads the clock, the language or the DOM: the element passes them in.
 */
import {
  addMonths,
  daysInMonth,
  firstOfMonth,
  fromDay,
  lastOfMonth,
  outsideLimits,
  spanDisabled,
  toDay,
} from '../nph-calendar/nph-calendar.logic';
import type { Day, Limits, Range } from '../nph-calendar/nph-calendar.logic';

/* ----- the date in the field ------------------------------------------------------------------------ */

/** The order the day, the month and the year are written in, from the language (`pt-BR`: day, month, year). */
export type DateOrder = readonly ['day' | 'month' | 'year', 'day' | 'month' | 'year', 'day' | 'month' | 'year'];

export const DEFAULT_ORDER: DateOrder = ['day', 'month', 'year'];

/** The order a language writes a numeric date in, read once from `Intl`. Unreadable: day, month, year. */
export function dateOrderOf(language: string): DateOrder {
  try {
    const parts = new Intl.DateTimeFormat(language, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).formatToParts(
      new Date(Date.UTC(2006, 10, 22)),
    );
    const order = parts.map((part) => part.type).filter((type): type is 'day' | 'month' | 'year' => type === 'day' || type === 'month' || type === 'year');
    return order.length === 3 && new Set(order).size === 3 ? (order as unknown as DateOrder) : DEFAULT_ORDER;
  } catch {
    return DEFAULT_ORDER;
  }
}

/** The text the field shows for a day: the language's order, two digits for the day and the month, a four-digit year, a slash. */
export function formatDay(day: Day, order: DateOrder): string {
  const { year, month, date } = fromDay(day);
  const part = { day: String(date).padStart(2, '0'), month: String(month).padStart(2, '0'), year: String(year).padStart(4, '0') };
  return order.map((name) => part[name]).join('/');
}

export type ParsedText = { readonly kind: 'empty' } | { readonly kind: 'invalid' } | { readonly kind: 'date'; readonly day: Day };

/**
 * Reads what the person typed (D-4): day and month with or without a leading zero, a four-digit year and the slash as the separator, in the order of
 * the language. An empty text is `empty`; anything that is not a date that exists is `invalid`.
 */
export function parseTyped(text: string, order: DateOrder): ParsedText {
  const value = (text ?? '').trim();
  if (value === '') return { kind: 'empty' };
  const found = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (found === null) return { kind: 'invalid' };
  const numbers = { day: 0, month: 0, year: 0 };
  order.forEach((name, index) => {
    numbers[name] = Number(found[index + 1]);
  });
  const day = toDay(numbers.year, numbers.month, numbers.day);
  const back = fromDay(day);
  return back.year === numbers.year && back.month === numbers.month && back.date === numbers.day ? { kind: 'date', day } : { kind: 'invalid' };
}

/* ----- the message of a typed date (D-4) ------------------------------------------------------------------ */

export type TypedError =
  | { readonly key: 'required' }
  | { readonly key: 'invalid' }
  | { readonly key: 'min' }
  | { readonly key: 'max' }
  | { readonly key: 'between' }
  | { readonly key: 'unavailable' }
  | { readonly key: 'endBeforeStart'; readonly start: Day };

export interface TypedContext {
  readonly required: boolean;
  readonly limits: Limits;
  readonly isUnavailable: (day: Day) => boolean;
  /** For an End typed: the Start it must not come before. */
  readonly start?: Day | null;
}

/**
 * One message at a time, in this order: empty, invalid, outside the limit, unavailable, end before start (D-4). With only the min, the
 * message says on or after it; with only the max, on or before it; with both, between them.
 */
export function checkTyped(parsed: ParsedText, context: TypedContext): TypedError | null {
  if (parsed.kind === 'empty') return context.required ? { key: 'required' } : null;
  if (parsed.kind === 'invalid') return { key: 'invalid' };
  const { min, max } = context.limits;
  if (outsideLimits(parsed.day, context.limits)) {
    if (min !== null && max !== null) return { key: 'between' };
    return { key: min !== null ? 'min' : 'max' };
  }
  if (context.isUnavailable(parsed.day)) return { key: 'unavailable' };
  if (context.start !== undefined && context.start !== null && parsed.day < context.start) {
    return { key: 'endBeforeStart', start: context.start };
  }
  return null;
}

/* ----- the shortcuts (D-6) ---------------------------------------------------------------------------------- */

export const SHORTCUTS = ['today', 'yesterday', 'last-7-days', 'last-30-days', 'this-month', 'last-month', 'custom'] as const;
export type Shortcut = (typeof SHORTCUTS)[number];

/**
 * The period each shortcut means before the limits are looked at (D-6). Last 7 days and Last 30 days are the whole days up to yesterday,
 * without today. `custom` has none: it does not change the dates.
 */
export function shortcutPeriod(shortcut: Shortcut, today: Day): Range | null {
  switch (shortcut) {
    case 'today':
      return { start: today, end: today };
    case 'yesterday':
      return { start: today - 1, end: today - 1 };
    case 'last-7-days':
      return { start: today - 7, end: today - 1 };
    case 'last-30-days':
      return { start: today - 30, end: today - 1 };
    case 'this-month':
      return { start: firstOfMonth(today), end: lastOfMonth(today) };
    case 'last-month': {
      const previous = addMonths(firstOfMonth(today), -1);
      return { start: previous, end: previous + daysInMonth(previous) - 1 };
    }
    default:
      return null;
  }
}

/**
 * The period of a shortcut inside the limits (D-6), or `null` when the shortcut is off. A shortcut with any day outside the min or the
 * max is off, so it never fills a period the limits would cut. The one exception is This month, which stays cut by the max (with the max
 * on today it would always be off); it is off only when no day of it is allowed or when the min falls inside it. `custom` is never off
 * and has no period.
 */
export function shortcutRange(shortcut: Shortcut, today: Day, limits: Limits): Range | null {
  const period = shortcutPeriod(shortcut, today);
  if (period === null || period.start === null || period.end === null) return null;
  if (spanDisabled(period.start, period.end, limits)) return null;
  if (limits.min !== null && period.start < limits.min) return null;
  if (shortcut === 'this-month') {
    return { start: period.start, end: limits.max !== null && period.end > limits.max ? limits.max : period.end };
  }
  if (limits.max !== null && period.end > limits.max) return null;
  return period;
}

/** Whether a shortcut is off: it has a period and the limits do not hold it (D-6). */
export function shortcutDisabled(shortcut: Shortcut, today: Day, limits: Limits): boolean {
  return shortcut !== 'custom' && shortcutRange(shortcut, today, limits) === null;
}

/**
 * The shortcut that is marked for a period (D-6): the one whose period, cut by the limits, is the same; `custom` when none is; none
 * (`null`) when there is no period at all.
 */
export function matchShortcut(range: Range, today: Day, limits: Limits): Shortcut | null {
  if (range.start === null && range.end === null) return null;
  for (const shortcut of SHORTCUTS) {
    if (shortcut === 'custom') continue;
    const period = shortcutRange(shortcut, today, limits);
    if (period !== null && period.start === range.start && period.end === range.end) return shortcut;
  }
  return 'custom';
}
