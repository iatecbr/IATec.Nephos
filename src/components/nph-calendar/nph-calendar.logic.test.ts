/**
 * Tests of the pure logic of `nph-calendar` (P133, item 6): the civil calendar, the six-week month (D-1), the
 * limits and the focus rule of a day outside them (item 9), the selection cycle of a range (D-10) and the block of
 * twelve years of the year view (D-9). They run in a browser like the rest, but need no layout: they hold the
 * arithmetic that has to be the same in any time zone.
 */
import { describe, expect, it } from 'vitest';

import {
  addMonths,
  addYears,
  clampToLimits,
  daysInMonth,
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
  weekdayOf,
  weekdays,
  yearBlockStart,
  yearSpan,
} from './nph-calendar.logic';

const day = (text: string): number => parseDate(text) as number;

describe('the civil calendar', () => {
  it('reads and writes a date back, in any year', () => {
    expect(isoDate(day('2026-11-12'))).toBe('2026-11-12');
    expect(isoDate(day('2024-02-29'))).toBe('2024-02-29');
    expect(isoDate(day('1999-12-31'))).toBe('1999-12-31');
  });

  it('refuses a date that does not exist or is not written as YYYY-MM-DD', () => {
    for (const text of ['2026-02-30', '2025-02-29', '2026-13-01', '2026-00-10', '2026-1-1', '26-11-12', '0050-01-01x', '', 'tomorrow']) {
      expect(parseDate(text), text).toBeNull();
    }
  });

  it('reads the day of an instant and a month as its first day', () => {
    expect(parseDay('2026-11-12T09:30')).toBe(day('2026-11-12'));
    expect(parseDay('2026-11-12')).toBe(day('2026-11-12'));
    expect(parseDay('nope')).toBeNull();
    expect(parseMonth('2026-11')).toBe(day('2026-11-01'));
    expect(parseMonth('2026-13')).toBeNull();
  });

  it('knows the weekday, with 0 as Sunday, and the first day of a week starting on Sunday or Monday', () => {
    expect(weekdayOf(day('2026-11-08'))).toBe(0);
    expect(weekdayOf(day('2026-11-11'))).toBe(3);
    expect(isoDate(startOfWeek(day('2026-11-11'), 0))).toBe('2026-11-08');
    expect(isoDate(startOfWeek(day('2026-11-11'), 1))).toBe('2026-11-09');
    expect(isoDate(startOfWeek(day('2026-11-08'), 1))).toBe('2026-11-02');
    expect(weekdays(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(weekdays(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
  });

  it('counts the days of a month, leap years included', () => {
    expect(daysInMonth(day('2026-02-10'))).toBe(28);
    expect(daysInMonth(day('2024-02-10'))).toBe(29);
    expect(daysInMonth(day('2026-11-10'))).toBe(30);
    expect(isoDate(lastOfMonth(day('2026-02-10')))).toBe('2026-02-28');
    expect(isoDate(firstOfMonth(day('2026-02-10')))).toBe('2026-02-01');
  });

  it('moves by months and years, clamping to the last day of a shorter month', () => {
    expect(isoDate(addMonths(day('2026-01-31'), 1))).toBe('2026-02-28');
    expect(isoDate(addMonths(day('2026-03-31'), -1))).toBe('2026-02-28');
    expect(isoDate(addMonths(day('2026-12-15'), 1))).toBe('2027-01-15');
    expect(isoDate(addMonths(day('2026-01-15'), -1))).toBe('2025-12-15');
    expect(isoDate(addYears(day('2024-02-29'), 1))).toBe('2025-02-28');
    expect(isoDate(addYears(day('2026-05-10'), -1))).toBe('2025-05-10');
  });

  it('does not depend on the time zone or on a change of the clock', () => {
    /* 2026-10-18 and 2026-11-01 are changes of the clock in some zones: the count of days is still whole. */
    expect(day('2026-10-19') - day('2026-10-18')).toBe(1);
    expect(day('2026-11-02') - day('2026-11-01')).toBe(1);
    expect(fromDay(day('2026-03-29'))).toEqual({ year: 2026, month: 3, date: 29 });
  });
});

describe('the six-week month (D-1)', () => {
  it('always has six weeks of seven days, whatever the month and the first weekday', () => {
    for (const month of ['2026-02-01', '2026-03-01', '2026-10-01', '2026-11-01', '2024-02-01', '2027-08-01']) {
      for (const first of [0, 1] as const) {
        const weeks = monthWeeks(day(month), first);
        expect(weeks, `${month} ${first}`).toHaveLength(6);
        for (const week of weeks) expect(week).toHaveLength(7);
        /* The weeks are consecutive and the month is whole inside them. */
        expect(weeks.flat()).toEqual(Array.from({ length: 42 }, (_, index) => (weeks[0] as number[])[0]! + index));
        const inMonth = weeks.flat().filter((value) => firstOfMonth(value) === firstOfMonth(day(month)));
        expect(inMonth).toHaveLength(daysInMonth(day(month)));
        expect(weekdayOf((weeks[0] as number[])[0] as number)).toBe(first);
      }
    }
  });

  it('draws February 2026, which starts on Sunday, as the first week of the month plus five more', () => {
    const weeks = monthWeeks(day('2026-02-01'), 0);
    expect(isoDate((weeks[0] as number[])[0] as number)).toBe('2026-02-01');
    expect(isoDate((weeks[5] as number[])[6] as number)).toBe('2026-03-14');
  });
});

describe('the year view (D-9)', () => {
  it('starts the block of twelve years at the decade of the shown year, as drawn', () => {
    expect(yearBlockStart(2026)).toBe(2020);
    expect(yearBlockStart(2020)).toBe(2020);
    expect(yearBlockStart(2019)).toBe(2010);
    expect(yearBlockStart(2031)).toBe(2030);
  });

  it('knows the first and the last day of a year and of a month', () => {
    expect(isoDate(yearSpan(2026).first)).toBe('2026-01-01');
    expect(isoDate(yearSpan(2026).last)).toBe('2026-12-31');
    expect(isoDate(monthSpan(2026, 2).last)).toBe('2026-02-28');
  });
});

describe('the limits', () => {
  const limits = { min: day('2026-03-10'), max: day('2026-03-20') };

  it('says a day before the min or after the max is outside', () => {
    expect(outsideLimits(day('2026-03-09'), limits)).toBe(true);
    expect(outsideLimits(day('2026-03-10'), limits)).toBe(false);
    expect(outsideLimits(day('2026-03-20'), limits)).toBe(false);
    expect(outsideLimits(day('2026-03-21'), limits)).toBe(true);
    expect(outsideLimits(day('1900-01-01'), { min: null, max: null })).toBe(false);
  });

  it('clamps a day into the limits', () => {
    expect(isoDate(clampToLimits(day('2026-01-01'), limits))).toBe('2026-03-10');
    expect(isoDate(clampToLimits(day('2026-12-01'), limits))).toBe('2026-03-20');
    expect(isoDate(clampToLimits(day('2026-03-15'), limits))).toBe('2026-03-15');
  });

  it('disables a month or a year only when none of its days is allowed (D-9)', () => {
    expect(spanDisabled(monthSpan(2026, 2).first, monthSpan(2026, 2).last, limits)).toBe(true);
    expect(spanDisabled(monthSpan(2026, 3).first, monthSpan(2026, 3).last, limits)).toBe(false);
    expect(spanDisabled(monthSpan(2026, 4).first, monthSpan(2026, 4).last, limits)).toBe(true);
    expect(spanDisabled(yearSpan(2026).first, yearSpan(2026).last, limits)).toBe(false);
    expect(spanDisabled(yearSpan(2025).first, yearSpan(2025).last, limits)).toBe(true);
  });
});

describe('where the focus lands (item 9)', () => {
  const limits = { min: day('2026-03-10'), max: day('2026-03-20') };

  it('goes to the target when it is allowed', () => {
    expect(isoDate(resolveFocus(day('2026-03-12'), day('2026-03-13'), limits, 1))).toBe('2026-03-13');
  });

  it('keeps an arrow where it is when there is no allowed day in that direction', () => {
    expect(isoDate(resolveFocus(day('2026-03-20'), day('2026-03-21'), limits, 1))).toBe('2026-03-20');
    expect(isoDate(resolveFocus(day('2026-03-10'), day('2026-03-09'), limits, -1))).toBe('2026-03-10');
    expect(isoDate(resolveFocus(day('2026-03-18'), day('2026-03-25'), limits, 7))).toBe('2026-03-18');
  });

  it('skips a day outside the limit that an arrow lands on, and goes on until an allowed one', () => {
    expect(isoDate(resolveFocus(day('2026-03-02'), day('2026-03-03'), limits, 1))).toBe('2026-03-10');
    expect(isoDate(resolveFocus(day('2026-03-26'), day('2026-03-25'), limits, -1))).toBe('2026-03-20');
  });

  it('takes Home, End and the pages to the nearest allowed day', () => {
    expect(isoDate(resolveFocus(day('2026-03-12'), day('2026-03-08'), limits))).toBe('2026-03-10');
    expect(isoDate(resolveFocus(day('2026-03-12'), day('2026-04-12'), limits))).toBe('2026-03-20');
  });

  it('puts today, outside the limit, on the nearest allowed day', () => {
    expect(isoDate(clampToLimits(day('2026-02-01'), limits))).toBe('2026-03-10');
  });
});

describe('the selection cycle of a range (D-10)', () => {
  const none = { start: null, end: null };

  it('marks the Start with the first pick', () => {
    expect(pickInRange(none, day('2026-05-10'))).toEqual({ start: day('2026-05-10'), end: null });
  });

  it('marks the End with the second pick', () => {
    expect(pickInRange({ start: day('2026-05-10'), end: null }, day('2026-05-20'))).toEqual({ start: day('2026-05-10'), end: day('2026-05-20') });
  });

  it('reorders an End picked before the Start: the earlier day becomes the Start', () => {
    expect(pickInRange({ start: day('2026-05-10'), end: null }, day('2026-05-05'))).toEqual({ start: day('2026-05-05'), end: day('2026-05-10') });
  });

  it('accepts the same day as Start and End: a one-day period is valid', () => {
    expect(pickInRange({ start: day('2026-05-10'), end: null }, day('2026-05-10'))).toEqual({ start: day('2026-05-10'), end: day('2026-05-10') });
  });

  it('starts over with a third pick: the day is the new Start and the End is cleared', () => {
    const complete = { start: day('2026-05-10'), end: day('2026-05-20') };
    expect(pickInRange(complete, day('2026-06-01'))).toEqual({ start: day('2026-06-01'), end: null });
    expect(pickInRange(complete, day('2026-05-12'))).toEqual({ start: day('2026-05-12'), end: null });
  });

  it('says what each day is in the period', () => {
    const period = { start: day('2026-05-10'), end: day('2026-05-14') };
    expect(rangeRole(day('2026-05-09'), period)).toBe('none');
    expect(rangeRole(day('2026-05-10'), period)).toBe('start');
    expect(rangeRole(day('2026-05-12'), period)).toBe('middle');
    expect(rangeRole(day('2026-05-14'), period)).toBe('end');
    expect(rangeRole(day('2026-05-15'), period)).toBe('none');
    expect(rangeRole(day('2026-05-10'), { start: day('2026-05-10'), end: null })).toBe('start');
    expect(rangeRole(day('2026-05-10'), { start: day('2026-05-10'), end: day('2026-05-10') })).toBe('single');
    expect(rangeRole(day('2026-05-10'), { start: null, end: null })).toBe('none');
  });

  it('draws the preview between the Start and the target, in either order, with the Start left out', () => {
    const start = day('2026-05-10');
    expect(inPreview(day('2026-05-12'), start, null, day('2026-05-14'))).toBe(true);
    expect(inPreview(day('2026-05-14'), start, null, day('2026-05-14'))).toBe(true);
    expect(inPreview(day('2026-05-15'), start, null, day('2026-05-14'))).toBe(false);
    expect(inPreview(day('2026-05-08'), start, null, day('2026-05-06'))).toBe(true);
    expect(inPreview(start, start, null, day('2026-05-14'))).toBe(false);
    expect(inPreview(day('2026-05-12'), start, day('2026-05-14'), day('2026-05-14'))).toBe(false);
    expect(inPreview(day('2026-05-12'), null, null, day('2026-05-14'))).toBe(false);
  });
});

describe('the window of the End across an unavailable day (D-10)', () => {
  const unavailable = (...dates: string[]) => (value: number): boolean => dates.includes(isoDate(value));
  const reach = (start: string, rule: (value: number) => boolean, low = '2026-05-01', high = '2026-05-31') => {
    const found = periodReach(day(start), rule, day(low), day(high));
    return [found.min === null ? null : isoDate(found.min), found.max === null ? null : isoDate(found.max)];
  };

  it('closes the window on the day before the first unavailable day after the Start, and on the day after the first one before it', () => {
    expect(reach('2026-05-10', unavailable('2026-05-14', '2026-05-18', '2026-05-06', '2026-05-02'))).toEqual(['2026-05-07', '2026-05-13']);
  });

  it('leaves a side open when it finds no unavailable day within the days asked about', () => {
    expect(reach('2026-05-10', unavailable('2026-05-14'))).toEqual([null, '2026-05-13']);
    expect(reach('2026-05-10', unavailable('2026-05-02'))).toEqual(['2026-05-03', null]);
    expect(reach('2026-05-10', unavailable('2026-06-02'))).toEqual([null, null]);
    expect(reach('2026-05-10', () => false)).toEqual([null, null]);
  });

  it('looks only as far as the days asked about, so a rule given as a function is called a bounded number of times', () => {
    let calls = 0;
    periodReach(day('2026-05-10'), () => {
      calls += 1;
      return false;
    }, day('2026-05-08'), day('2026-05-12'));
    expect(calls).toBe(4);
  });

  it('does not count the Start itself, typed on an unavailable day, as the unavailable day that closes the window', () => {
    expect(reach('2026-05-10', unavailable('2026-05-10', '2026-05-12'))).toEqual([null, '2026-05-11']);
  });

  it('closes the window at once when the day next to the Start is unavailable', () => {
    expect(reach('2026-05-10', unavailable('2026-05-11', '2026-05-09'))).toEqual(['2026-05-10', '2026-05-10']);
  });

  it('merges two sets of limits: the later min and the earlier max win', () => {
    const merged = mergeLimits({ min: day('2026-05-05'), max: day('2026-05-25') }, { min: day('2026-05-07'), max: null });
    expect([isoDate(merged.min as number), isoDate(merged.max as number)]).toEqual(['2026-05-07', '2026-05-25']);
    expect(mergeLimits({ min: null, max: null }, { min: null, max: null })).toEqual({ min: null, max: null });
    expect(mergeLimits({ min: null, max: day('2026-05-25') }, { min: null, max: day('2026-05-20') }).max).toBe(day('2026-05-20'));
  });
});
