/**
 * Tests of the pure logic of `nph-scheduler` (P120, item 6): the civil calendar, the reading of the
 * events and the layout of a day. They run in a browser like the rest, but need no layout: they hold the
 * arithmetic that has to be the same in any time zone and in a day with a change of the clock, and the
 * rules the views rely on — what is a multi-day event, where a midnight belongs and how events that
 * touch share a column.
 */
import { describe, expect, it } from 'vitest';

import {
  MINUTES_PER_DAY,
  MIN_VISUAL_MINUTES,
  addMonths,
  coversDay,
  daysInMonth,
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
  weekdayOf,
} from './nph-scheduler.logic';
import type { NphSchedulerCalendar, NphSchedulerEvent } from './nph-scheduler.logic';

const day = (text: string): number => parseDate(text) as number;

describe('the civil calendar', () => {
  it('reads and writes a date back, in any year', () => {
    expect(isoDate(day('2026-11-12'))).toBe('2026-11-12');
    expect(isoDate(day('2024-02-29'))).toBe('2024-02-29');
    expect(isoDate(day('1999-12-31'))).toBe('1999-12-31');
  });

  it('refuses a date that does not exist or is not written as YYYY-MM-DD', () => {
    for (const text of ['2026-02-30', '2025-02-29', '2026-13-01', '2026-00-10', '2026-1-1', '26-11-12', '2026-11-12T10:00', '', 'tomorrow']) {
      expect(parseDate(text), text).toBeNull();
    }
  });

  it('reads an instant as a day and a minute, with no time zone and no `new Date(string)`', () => {
    expect(parseDateTime('2026-11-12T09:30')).toEqual({ day: day('2026-11-12'), minute: 570 });
    expect(parseDateTime('2026-11-12T00:00')).toEqual({ day: day('2026-11-12'), minute: 0 });
    expect(parseDateTime('2026-11-12T23:59:59')).toEqual({ day: day('2026-11-12'), minute: 1439 });
    for (const text of ['2026-11-12T24:00', '2026-11-12T09:60', '2026-11-12T09:30Z', '2026-11-12T09:30+03:00', '2026-11-12 09:30', '2026-11-12', '2026-02-30T10:00']) {
      expect(parseDateTime(text), text).toBeNull();
    }
  });

  it('knows the weekday, with 0 as Sunday', () => {
    expect(weekdayOf(day('2026-11-08'))).toBe(0);
    expect(weekdayOf(day('2026-11-11'))).toBe(3);
    expect(weekdayOf(day('2026-11-14'))).toBe(6);
    expect(weekdayOf(day('1969-12-31'))).toBe(3);
  });

  it('finds the first day of the week, Sunday or Monday', () => {
    expect(isoDate(startOfWeek(day('2026-11-11'), 0))).toBe('2026-11-08');
    expect(isoDate(startOfWeek(day('2026-11-11'), 1))).toBe('2026-11-09');
    expect(isoDate(startOfWeek(day('2026-11-08'), 0))).toBe('2026-11-08');
    expect(isoDate(startOfWeek(day('2026-11-08'), 1))).toBe('2026-11-02');
  });

  it('adds months and keeps the day that the month has: the 31st becomes the last day', () => {
    expect(isoDate(addMonths(day('2026-01-31'), 1))).toBe('2026-02-28');
    expect(isoDate(addMonths(day('2024-01-31'), 1))).toBe('2024-02-29');
    expect(isoDate(addMonths(day('2026-12-15'), 1))).toBe('2027-01-15');
    expect(isoDate(addMonths(day('2026-01-15'), -1))).toBe('2025-12-15');
    expect(isoDate(addMonths(day('2026-03-31'), -12))).toBe('2025-03-31');
  });

  it('counts the days of a month and finds its first day', () => {
    expect(daysInMonth(day('2026-02-10'))).toBe(28);
    expect(daysInMonth(day('2024-02-10'))).toBe(29);
    expect(daysInMonth(day('2026-11-10'))).toBe(30);
    expect(isoDate(firstOfMonth(day('2026-11-23')))).toBe('2026-11-01');
  });

  it('builds the weeks of a month whole, from the first day of the week', () => {
    const sunday = monthWeeks(day('2026-11-11'), 0);
    expect(sunday).toHaveLength(5);
    expect(isoDate((sunday[0] as number[])[0] as number)).toBe('2026-11-01');
    expect(isoDate((sunday[4] as number[])[6] as number)).toBe('2026-12-05');
    const monday = monthWeeks(day('2026-11-11'), 1);
    expect(monday).toHaveLength(6);
    expect(isoDate((monday[0] as number[])[0] as number)).toBe('2026-10-26');
    expect(isoDate((monday[5] as number[])[6] as number)).toBe('2026-12-06');
    expect(monthWeeks(day('2026-08-10'), 0)).toHaveLength(6);
    expect(monthWeeks(day('2026-02-10'), 0)).toHaveLength(4);
    for (const week of monthWeeks(day('2026-08-10'), 1)) expect(week).toHaveLength(7);
  });

  it('counts days across the changes of the clock: a day is a day in March and November', () => {
    /* US spring forward 2026-03-08 and fall back 2026-11-01; Brazil kept none since 2019. */
    expect(day('2026-03-09') - day('2026-03-07')).toBe(2);
    expect(isoDate(day('2026-03-07') + 1)).toBe('2026-03-08');
    expect(isoDate(day('2026-03-07') + 2)).toBe('2026-03-09');
    expect(day('2026-11-02') - day('2026-10-31')).toBe(2);
    expect(fromDay(toDay(2026, 11, 1))).toEqual({ year: 2026, month: 11, date: 1 });
  });
});

describe('the days of a view', () => {
  const date = day('2026-11-11');

  it('work week is Monday to Friday of the week of the date', () => {
    for (const start of ['sunday', 'monday'] as const) {
      const days = periodDays('work-week', date, start).map(isoDate);
      expect(days).toEqual(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13']);
    }
  });

  it('the work week is the Monday to Friday of the week the week start gives: Sunday starts its own week', () => {
    expect(periodDays('work-week', day('2026-11-08'), 'sunday').map(isoDate)[0]).toBe('2026-11-09');
    expect(periodDays('work-week', day('2026-11-14'), 'sunday').map(isoDate)[0]).toBe('2026-11-09');
    expect(periodDays('work-week', day('2026-11-08'), 'monday').map(isoDate)[0]).toBe('2026-11-02');
    expect(periodDays('work-week', day('2026-11-15'), 'monday').map(isoDate)[0]).toBe('2026-11-09');
    expect(periodDays('week', day('2026-11-08'), 'sunday').map(isoDate)).toContain('2026-11-08');
  });

  it('week and list are seven days from the week start', () => {
    expect(periodDays('week', date, 'sunday').map(isoDate)[0]).toBe('2026-11-08');
    expect(periodDays('week', date, 'monday').map(isoDate)[0]).toBe('2026-11-09');
    expect(periodDays('list', date, 'sunday')).toHaveLength(7);
    expect(periodDays('week', date, 'monday')).toHaveLength(7);
  });

  it('day is the day, and month is whole weeks', () => {
    expect(periodDays('day', date, 'sunday')).toEqual([date]);
    expect(periodDays('month', date, 'sunday')).toHaveLength(35);
    expect(periodDays('month', day('2026-08-10'), 'sunday')).toHaveLength(42);
  });

  it('moves by the unit of the view', () => {
    expect(isoDate(movePeriod('day', date, 1))).toBe('2026-11-12');
    expect(isoDate(movePeriod('day', date, -1))).toBe('2026-11-10');
    expect(isoDate(movePeriod('work-week', date, 1))).toBe('2026-11-18');
    expect(isoDate(movePeriod('week', date, -1))).toBe('2026-11-04');
    expect(isoDate(movePeriod('list', date, 1))).toBe('2026-11-18');
    expect(isoDate(movePeriod('month', date, 1))).toBe('2026-12-11');
    expect(isoDate(movePeriod('month', day('2026-01-31'), 1))).toBe('2026-02-28');
  });
});

const calendars: NphSchedulerCalendar[] = [
  { id: 'a', name: 'Calendar A', color: 'educacao' },
  { id: 'b', name: 'Calendar B', color: 'rh', visible: false },
  { id: 'c', name: 'Calendar C', color: 'primary' },
];

describe('reading the events', () => {
  it('reads a timed event, resolves the color and the name of its calendar and sorts by start', () => {
    const { events, causes } = readEvents(
      [
        { id: 'late', title: 'Late', start: '2026-11-11T15:00', end: '2026-11-11T16:00', calendar: 'a' },
        { id: 'early', title: 'Early', start: '2026-11-11T08:00', end: '2026-11-11T09:30', calendar: 'c' },
        { id: 'plain', title: 'Plain', start: '2026-11-10T08:00' },
      ],
      calendars,
    );
    expect(causes).toEqual([]);
    expect(events.map((event) => event.id)).toEqual(['plain', 'early', 'late']);
    expect(events.map((event) => event.index)).toEqual([0, 1, 2]);
    const late = events[2];
    expect(late?.color).toBe('educacao');
    expect(late?.calendarName).toBe('Calendar A');
    expect(late?.startMinute).toBe(900);
    expect(late?.endMinute).toBe(960);
    expect(events[1]?.color).toBe('primary');
    expect(events[0]?.color).toBe('primary');
    expect(events[0]?.calendarName).toBe('');
  });

  it('an event with no end ends when it starts', () => {
    const { events } = readEvents([{ id: 'x', title: 'X', start: '2026-11-11T08:15' }], []);
    expect(events[0]?.startMinute).toBe(495);
    expect(events[0]?.endMinute).toBe(495);
    expect(events[0]?.multiDay).toBe(false);
  });

  it('an all-day event sorts before the timed ones of its day and ends on its last day', () => {
    const { events } = readEvents(
      [
        { id: 'timed', title: 'Timed', start: '2026-11-12T00:00', end: '2026-11-12T01:00' },
        { id: 'all', title: 'All', start: '2026-11-12', end: '2026-11-14', allDay: true },
      ],
      [],
    );
    expect(events.map((event) => event.id)).toEqual(['all', 'timed']);
    expect(events[0]?.startMinute).toBe(-1);
    expect(events[0]?.endDay).toBe(day('2026-11-14'));
    expect(events[0]?.multiDay).toBe(true);
    expect(coversDay(events[0] as never, day('2026-11-13'))).toBe(true);
    expect(coversDay(events[0] as never, day('2026-11-15'))).toBe(false);
  });

  it('an event that ends exactly at midnight fills its own day to 24:00; one that crosses midnight is multi-day', () => {
    const { events } = readEvents(
      [
        { id: 'to-midnight', title: 'To midnight', start: '2026-11-12T22:00', end: '2026-11-13T00:00' },
        { id: 'across', title: 'Across', start: '2026-11-12T22:00', end: '2026-11-13T02:00' },
      ],
      [],
    );
    const toMidnight = events.find((event) => event.id === 'to-midnight');
    expect(toMidnight?.endDay).toBe(day('2026-11-12'));
    expect(toMidnight?.endMinute).toBe(MINUTES_PER_DAY);
    expect(toMidnight?.multiDay).toBe(false);
    const across = events.find((event) => event.id === 'across');
    expect(across?.multiDay).toBe(true);
    expect(across?.endDay).toBe(day('2026-11-13'));
    expect(across?.endMinute).toBe(120);
  });

  it('an end at midnight, on any day after the start, is 24:00 of the day before: it covers no day it has already ended', () => {
    const { events } = readEvents(
      [
        { id: 'two-days', title: 'Two days', start: '2026-11-11T22:00', end: '2026-11-13T00:00' },
        { id: 'week', title: 'Week', start: '2026-11-09T08:00', end: '2026-11-16T00:00' },
        { id: 'all', title: 'All', start: '2026-11-11', end: '2026-11-13', allDay: true },
        { id: 'zero', title: 'Zero', start: '2026-11-11T00:00', end: '2026-11-11T00:00' },
      ],
      [],
    );
    const byId = Object.fromEntries(events.map((event) => [event.id, event]));
    expect(byId['two-days']).toMatchObject({ endDay: day('2026-11-12'), endMinute: MINUTES_PER_DAY, multiDay: true });
    expect(coversDay(byId['two-days'] as never, day('2026-11-12'))).toBe(true);
    expect(coversDay(byId['two-days'] as never, day('2026-11-13'))).toBe(false);
    expect(byId.week).toMatchObject({ endDay: day('2026-11-15'), endMinute: MINUTES_PER_DAY });
    expect(byId.all?.endDay).toBe(day('2026-11-13'));
    expect(byId.zero).toMatchObject({ startDay: day('2026-11-11'), endDay: day('2026-11-11'), endMinute: 0, multiDay: false });
  });

  it('leaves out a hidden calendar without an error, and its id stays taken', () => {
    const { events, causes } = readEvents(
      [
        { id: 'hidden', title: 'Hidden', start: '2026-11-11T08:00', calendar: 'b' },
        { id: 'hidden', title: 'Again', start: '2026-11-11T09:00', calendar: 'a' },
      ],
      calendars,
    );
    expect(events).toEqual([]);
    expect(causes).toEqual(['event id "hidden" appears twice; the first one was kept.']);
  });

  it('leaves out what cannot be drawn, one cause each, and says why', () => {
    const bad = [
      { id: '', title: 'No id', start: '2026-11-11T08:00' },
      { id: 'dup', title: 'One', start: '2026-11-11T08:00' },
      { id: 'dup', title: 'Two', start: '2026-11-11T09:00' },
      { id: 'no-title', title: '   ', start: '2026-11-11T08:00' },
      { id: 'zone', title: 'Zone', start: '2026-11-11T08:00Z' },
      { id: 'backwards', title: 'Backwards', start: '2026-11-11T10:00', end: '2026-11-11T09:00' },
      { id: 'missing', title: 'Missing', start: '2026-11-11T10:00', calendar: 'nope' },
      { id: 'all-bad', title: 'All bad', start: '2026-11-11T10:00', allDay: true },
      { id: 'all-back', title: 'All back', start: '2026-11-12', end: '2026-11-11', allDay: true },
      null,
    ] as unknown as NphSchedulerEvent[];
    const { events, causes } = readEvents(bad, calendars);
    expect(events.map((event) => event.id)).toEqual(['dup']);
    expect(causes).toHaveLength(8);
    expect(causes.join('\n')).toContain('"no-title" has no title');
    expect(causes.join('\n')).toContain('"zone" needs start');
    expect(causes.join('\n')).toContain('"backwards" ends before it starts');
    expect(causes.join('\n')).toContain('calendar "nope", which does not exist');
    expect(causes.join('\n')).toContain('"all-bad" is all day');
    expect(causes.join('\n')).toContain('"all-back" ends before it starts');
  });

  it('reports a calendar with no id, a repeated one and a color that does not exist; primary is used', () => {
    const { events, causes } = readEvents(
      [{ id: 'x', title: 'X', start: '2026-11-11T08:00', calendar: 'odd' }],
      [
        { id: '', name: 'No id', color: 'primary' },
        { id: 'odd', name: 'Odd', color: 'purple' as never },
        { id: 'odd', name: 'Twin', color: 'rh' },
      ],
    );
    expect(events[0]?.color).toBe('primary');
    expect(causes.some((cause) => cause.includes('has no id'))).toBe(true);
    expect(causes.some((cause) => cause.includes('color "purple"'))).toBe(true);
    expect(causes.some((cause) => cause.includes('appears twice'))).toBe(true);
  });

  it('leaves out a calendar with no name, and the events that point to it, saying why', () => {
    const { events, calendars, causes } = readEvents(
      [{ id: 'x', title: 'X', start: '2026-11-11T08:00', calendar: 'blank' }],
      [
        { id: 'blank', name: '   ', color: 'rh' },
        { id: 'missing', color: 'rh' } as never,
        { id: 'ok', name: 'Fine', color: 'rh' },
      ],
    );
    expect(calendars.map((calendar) => calendar.id)).toEqual(['ok']);
    expect(events).toEqual([]);
    expect(causes.filter((cause) => cause.includes('has no name'))).toHaveLength(2);
    expect(causes.some((cause) => cause.includes('"x" points to calendar "blank", which does not exist'))).toBe(true);
  });

  it('a calendar with a color outside the list stays, with primary, and is reported', () => {
    const { events, calendars, causes } = readEvents([{ id: 'x', title: 'X', start: '2026-11-11T08:00', calendar: 'odd' }], [{ id: 'odd', name: 'Odd', color: 'purple' as never }]);
    expect(calendars).toHaveLength(1);
    expect(events[0]?.color).toBe('primary');
    expect(causes).toHaveLength(1);
  });

  it('keeps only the people who have a name', () => {
    const { events } = readEvents(
      [{ id: 'x', title: 'X', start: '2026-11-11T08:00', people: [{ name: 'Ana' }, { name: ' ' }, null as never, { name: 'Bruno', src: '/b.png' }] }],
      [],
    );
    expect(events[0]?.people.map((person) => person.name)).toEqual(['Ana', 'Bruno']);
  });

  it('lists the distinct people of the events of a day, in order', () => {
    const { events } = readEvents(
      [
        { id: 'a', title: 'A', start: '2026-11-11T08:00', people: [{ name: 'Ana' }, { name: 'Bruno' }] },
        { id: 'b', title: 'B', start: '2026-11-11T09:00', people: [{ name: 'Bruno' }, { name: 'Carla' }] },
      ],
      [],
    );
    expect(peopleOf(events).map((person) => person.name)).toEqual(['Ana', 'Bruno', 'Carla']);
  });
});

describe('the layout of a day', () => {
  const timed = (id: string, start: string, end: string): NphSchedulerEvent => ({ id, title: id, start: `2026-11-11T${start}`, end: `2026-11-11T${end}` });
  const place = (events: NphSchedulerEvent[]) => layoutDay(readEvents(events, []).events, day('2026-11-11'));

  it('an event alone takes the whole column', () => {
    const [only] = place([timed('a', '09:00', '10:00')]);
    expect(only?.column).toBe(0);
    expect(only?.columns).toBe(1);
  });

  it('events that touch go side by side, and the ones after them take the whole column again', () => {
    const placed = place([timed('a', '09:00', '11:00'), timed('b', '10:00', '12:00'), timed('c', '13:00', '14:00')]);
    const byId = Object.fromEntries(placed.map((item) => [item.event.id, item]));
    expect(byId.a).toMatchObject({ column: 0, columns: 2 });
    expect(byId.b).toMatchObject({ column: 1, columns: 2 });
    expect(byId.c).toMatchObject({ column: 0, columns: 1 });
  });

  it('three that overlap use three columns; a freed column is used again', () => {
    const placed = place([timed('a', '09:00', '12:00'), timed('b', '09:30', '10:00'), timed('c', '09:45', '10:30'), timed('d', '10:30', '11:00')]);
    const byId = Object.fromEntries(placed.map((item) => [item.event.id, item]));
    expect(byId.a?.column).toBe(0);
    expect(byId.b?.column).toBe(1);
    expect(byId.c?.column).toBe(2);
    expect(byId.d?.column).toBe(1);
    for (const item of placed) expect(item.columns).toBe(3);
  });

  it('events that end where the next starts do not share a column', () => {
    const placed = place([timed('a', '09:00', '10:00'), timed('b', '10:00', '11:00')]);
    for (const item of placed) expect(item).toMatchObject({ column: 0, columns: 1 });
  });

  it('a short event keeps its minimum height in the layout: one that starts right after it does not overlap', () => {
    const placed = place([timed('short', '09:00', '09:10'), timed('next', '09:20', '10:00')]);
    for (const item of placed) expect(item.columns).toBe(2);
    const clear = place([timed('short', '09:00', '09:10'), timed('next', `09:${MIN_VISUAL_MINUTES}`, '10:00')]);
    for (const item of clear) expect(item.columns).toBe(1);
  });

  it('an event with no duration takes the minimum height, and two at the same minute share the column', () => {
    const placed = place([{ id: 'a', title: 'a', start: '2026-11-11T09:00' }, { id: 'b', title: 'b', start: '2026-11-11T09:00' }]);
    expect(placed.map((item) => item.columns)).toEqual([2, 2]);
    expect(placed.map((item) => item.column).sort()).toEqual([0, 1]);
  });

  it('leaves out the all-day and the multi-day events, which belong to the band', () => {
    const { events } = readEvents(
      [
        timed('a', '09:00', '10:00'),
        { id: 'all', title: 'all', start: '2026-11-11', allDay: true },
        { id: 'across', title: 'across', start: '2026-11-11T22:00', end: '2026-11-12T02:00' },
      ],
      [],
    );
    expect(layoutDay(events, day('2026-11-11')).map((item) => item.event.id)).toEqual(['a']);
    expect(layoutDay(events, day('2026-11-12'))).toEqual([]);
  });
});

describe('the all-day band', () => {
  const days = (start: string, count: number): number[] => Array.from({ length: count }, (_, index) => day(start) + index);

  it('puts a bar over the days it covers, clamped to the days shown', () => {
    const { events } = readEvents(
      [
        { id: 'one', title: 'One', start: '2026-11-11', allDay: true },
        { id: 'long', title: 'Long', start: '2026-11-06', end: '2026-11-10', allDay: true },
        { id: 'out', title: 'Out', start: '2026-11-20', allDay: true },
      ],
      [],
    );
    const { bars, lanes } = layoutBand(events, days('2026-11-08', 7));
    expect(lanes).toBe(1);
    expect(bars.map((bar) => [bar.event.id, bar.from, bar.to, bar.lane])).toEqual([
      ['long', 0, 2, 0],
      ['one', 3, 3, 0],
    ]);
  });

  it('stacks the bars that share a day in lanes', () => {
    const { events } = readEvents(
      [
        { id: 'a', title: 'A', start: '2026-11-09', end: '2026-11-11', allDay: true },
        { id: 'b', title: 'B', start: '2026-11-10', end: '2026-11-12', allDay: true },
        { id: 'c', title: 'C', start: '2026-11-12', allDay: true },
      ],
      [],
    );
    const { bars, lanes } = layoutBand(events, days('2026-11-09', 5));
    expect(lanes).toBe(2);
    expect(Object.fromEntries(bars.map((bar) => [bar.event.id, bar.lane]))).toEqual({ a: 0, b: 1, c: 0 });
  });

  it('a timed event that crosses midnight is a bar of the band', () => {
    const { events } = readEvents([{ id: 'night', title: 'Night', start: '2026-11-12T22:00', end: '2026-11-13T02:00' }], []);
    const { bars } = layoutBand(events, days('2026-11-09', 5));
    expect(bars.map((bar) => [bar.from, bar.to])).toEqual([[3, 4]]);
  });
});
