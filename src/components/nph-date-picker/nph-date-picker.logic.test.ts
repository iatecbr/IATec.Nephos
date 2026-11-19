/**
 * Tests of the pure logic of `nph-date-picker` (P133, item 6): the date as written in the field and read back in each language
 * (`en`, `pt-BR`, `es`), the message a typed date gets and the order of the messages (D-4), and the period of each shortcut and
 * which one is marked (D-6). They need no layout: they hold the rules the element relies on.
 */
import { describe, expect, it } from 'vitest';

import { isoDate, parseDate } from '../nph-calendar/nph-calendar.logic';
import type { Limits } from '../nph-calendar/nph-calendar.logic';
import {
  checkTyped,
  dateOrderOf,
  formatDay,
  matchShortcut,
  parseTyped,
  shortcutDisabled,
  shortcutRange,
} from './nph-date-picker.logic';
import type { DateOrder } from './nph-date-picker.logic';

const day = (text: string): number => parseDate(text) as number;
const noLimits: Limits = { min: null, max: null };
const DMY: DateOrder = ['day', 'month', 'year'];
const MDY: DateOrder = ['month', 'day', 'year'];

describe('the order of a date in a language', () => {
  it('writes day, month, year in pt-BR and es, and month, day, year in en-US', () => {
    expect(dateOrderOf('pt-BR')).toEqual(DMY);
    expect(dateOrderOf('es')).toEqual(DMY);
    expect(dateOrderOf('en-US')).toEqual(MDY);
    expect(dateOrderOf('en')).toEqual(MDY);
  });

  it('falls back to day, month, year for a language it cannot read', () => {
    expect(dateOrderOf('not a language')).toEqual(DMY);
  });
});

describe('the date in the field', () => {
  it('writes two digits, a four-digit year and the slash, in the order given', () => {
    expect(formatDay(day('2026-03-05'), DMY)).toBe('05/03/2026');
    expect(formatDay(day('2026-03-05'), MDY)).toBe('03/05/2026');
  });

  it('reads what it wrote, in both orders', () => {
    for (const order of [DMY, MDY]) {
      const text = formatDay(day('2026-10-14'), order);
      expect(parseTyped(text, order)).toEqual({ kind: 'date', day: day('2026-10-14') });
    }
  });

  it('accepts a day and a month with or without the leading zero', () => {
    expect(parseTyped('5/3/2026', DMY)).toEqual({ kind: 'date', day: day('2026-03-05') });
    expect(parseTyped('05/03/2026', DMY)).toEqual({ kind: 'date', day: day('2026-03-05') });
    expect(parseTyped(' 05/3/2026 ', DMY)).toEqual({ kind: 'date', day: day('2026-03-05') });
    expect(parseTyped('3/5/2026', MDY)).toEqual({ kind: 'date', day: day('2026-03-05') });
  });

  it('reads an empty text as empty, and a date that does not exist as invalid', () => {
    expect(parseTyped('', DMY)).toEqual({ kind: 'empty' });
    expect(parseTyped('   ', DMY)).toEqual({ kind: 'empty' });
    for (const text of ['31/02/2026', '32/01/2026', '00/01/2026', '10/13/2026', '1/1/26', '2026-03-05', '05.03.2026', '05/03', 'a/b/cccc']) {
      expect(parseTyped(text, DMY), text).toEqual({ kind: 'invalid' });
    }
    expect(parseTyped('29/02/2025', DMY)).toEqual({ kind: 'invalid' });
    expect(parseTyped('29/02/2024', DMY)).toEqual({ kind: 'date', day: day('2024-02-29') });
    expect(parseTyped('01/01/0050', DMY)).toEqual({ kind: 'invalid' });
  });
});

describe('the message of a typed date (D-4)', () => {
  const rules = (overrides: Partial<Parameters<typeof checkTyped>[1]> = {}): Parameters<typeof checkTyped>[1] => ({
    required: false,
    limits: noLimits,
    isUnavailable: () => false,
    ...overrides,
  });
  const typed = (text: string): ReturnType<typeof parseTyped> => parseTyped(text, DMY);

  it('says nothing for a valid date, and for an empty field that is not required', () => {
    expect(checkTyped(typed('05/03/2026'), rules())).toBeNull();
    expect(checkTyped(typed(''), rules())).toBeNull();
  });

  it('says an empty field is an error only when it is required', () => {
    expect(checkTyped(typed(''), rules({ required: true }))).toEqual({ key: 'required' });
  });

  it('says invalid before the limit, and the limit before unavailable', () => {
    const limits = { min: day('2026-03-01'), max: day('2026-12-31') };
    expect(checkTyped(typed('31/02/2026'), rules({ limits, isUnavailable: () => true }))).toEqual({ key: 'invalid' });
    expect(checkTyped(typed('05/01/2026'), rules({ limits, isUnavailable: () => true }))).toEqual({ key: 'between' });
    expect(checkTyped(typed('05/04/2026'), rules({ limits, isUnavailable: () => true }))).toEqual({ key: 'unavailable' });
  });

  it('cites only the limit that exists: on or after the min, on or before the max, between them', () => {
    expect(checkTyped(typed('05/01/2026'), rules({ limits: { min: day('2026-03-01'), max: null } }))).toEqual({ key: 'min' });
    expect(checkTyped(typed('05/05/2026'), rules({ limits: { min: null, max: day('2026-03-01') } }))).toEqual({ key: 'max' });
    expect(checkTyped(typed('05/05/2026'), rules({ limits: { min: day('2026-03-01'), max: day('2026-04-01') } }))).toEqual({ key: 'between' });
  });

  it('says an End typed before the Start is an error, and never reorders', () => {
    const start = day('2026-03-05');
    expect(checkTyped(typed('04/03/2026'), rules({ start }))).toEqual({ key: 'endBeforeStart', start });
    expect(checkTyped(typed('05/03/2026'), rules({ start }))).toBeNull();
    expect(checkTyped(typed('06/03/2026'), rules({ start: null }))).toBeNull();
  });

  it('puts the end before start last', () => {
    const start = day('2026-03-05');
    expect(checkTyped(typed('04/03/2026'), rules({ start, isUnavailable: () => true }))).toEqual({ key: 'unavailable' });
  });
});

describe('the shortcuts (D-6)', () => {
  const today = day('2026-10-14');
  const range = (name: Parameters<typeof shortcutRange>[0], limits = noLimits): [string, string] | null => {
    const period = shortcutRange(name, today, limits);
    return period === null ? null : [isoDate(period.start as number), isoDate(period.end as number)];
  };

  it('makes Today and Yesterday one day', () => {
    expect(range('today')).toEqual(['2026-10-14', '2026-10-14']);
    expect(range('yesterday')).toEqual(['2026-10-13', '2026-10-13']);
  });

  it('ends Last 7 days and Last 30 days today and includes it', () => {
    expect(range('last-7-days')).toEqual(['2026-10-08', '2026-10-14']);
    expect(range('last-30-days')).toEqual(['2026-09-15', '2026-10-14']);
  });

  it('runs This month from the first day to the last, and Last month is the whole previous month', () => {
    expect(range('this-month')).toEqual(['2026-10-01', '2026-10-31']);
    expect(range('last-month')).toEqual(['2026-09-01', '2026-09-30']);
    expect(shortcutRange('custom', today, noLimits)).toBeNull();
    const january = day('2026-01-20');
    const previous = shortcutRange('last-month', january, noLimits);
    expect([isoDate(previous?.start as number), isoDate(previous?.end as number)]).toEqual(['2025-12-01', '2025-12-31']);
  });

  it('cuts a shortcut by the min and the max, and disables it only when none of its days is allowed', () => {
    expect(range('this-month', { min: null, max: day('2026-10-20') })).toEqual(['2026-10-01', '2026-10-20']);
    expect(range('last-7-days', { min: day('2026-10-10'), max: null })).toEqual(['2026-10-10', '2026-10-14']);
    expect(range('last-month', { min: day('2026-10-01'), max: null })).toBeNull();
    expect(shortcutDisabled('last-month', today, { min: day('2026-10-01'), max: null })).toBe(true);
    expect(shortcutDisabled('today', today, { min: null, max: day('2026-10-13') })).toBe(true);
    expect(shortcutDisabled('last-7-days', today, { min: null, max: day('2026-10-13') })).toBe(false);
    expect(shortcutDisabled('custom', today, { min: day('2030-01-01'), max: null })).toBe(false);
  });

  it('marks the shortcut whose period matches, Custom for any other period, and none for an empty one', () => {
    expect(matchShortcut({ start: day('2026-10-14'), end: day('2026-10-14') }, today, noLimits)).toBe('today');
    expect(matchShortcut({ start: day('2026-10-08'), end: day('2026-10-14') }, today, noLimits)).toBe('last-7-days');
    expect(matchShortcut({ start: day('2026-10-01'), end: day('2026-10-31') }, today, noLimits)).toBe('this-month');
    expect(matchShortcut({ start: day('2026-10-02'), end: day('2026-10-05') }, today, noLimits)).toBe('custom');
    expect(matchShortcut({ start: day('2026-10-14'), end: null }, today, noLimits)).toBe('custom');
    expect(matchShortcut({ start: null, end: null }, today, noLimits)).toBeNull();
  });

  it('matches a shortcut that the limits cut', () => {
    const limits = { min: null, max: day('2026-10-20') };
    expect(matchShortcut({ start: day('2026-10-01'), end: day('2026-10-20') }, today, limits)).toBe('this-month');
  });
});
