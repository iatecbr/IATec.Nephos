/**
 * Pure logic of `nph-scheduler`: the civil calendar, the reading of the events and the layout of a day.
 *
 * No element, no `Date` in the local time zone and no `Intl` here. A civil day is a whole number of days
 * since 1970-01-01, so the arithmetic is the same in any time zone and in a day with a change of the
 * clock (P120, item 6). An instant is a day and the minute of the day, read from a wall-clock string
 * (`YYYY-MM-DDTHH:mm`); a string with a zone (`Z`, `+03:00`) is refused, because it would need a zone the
 * component does not have. The tests of this file are in `nph-scheduler.test.ts`.
 */

/** A civil day: whole days since 1970-01-01. */
export type Day = number;

const MS_PER_DAY = 86_400_000;

/** Minutes in a day. */
export const MINUTES_PER_DAY = 1440;

/** The week of the weekdays, from Sunday (0). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const NPH_SCHEDULER_VIEWS = ['work-week', 'week', 'day', 'month', 'list'] as const;
export type NphSchedulerView = (typeof NPH_SCHEDULER_VIEWS)[number];

export const NPH_SCHEDULER_WEEK_STARTS = ['sunday', 'monday'] as const;
export type NphSchedulerWeekStart = (typeof NPH_SCHEDULER_WEEK_STARTS)[number];

/** `primary` and the seven vertical colors of the Figma `cor`. */
export const NPH_SCHEDULER_COLORS = ['primary', 'sistemas', 'gerencial', 'educacao', 'comercial', 'financeiro', 'igrejas', 'rh'] as const;
export type NphSchedulerColor = (typeof NPH_SCHEDULER_COLORS)[number];

export interface NphSchedulerPerson {
  readonly name: string;
  readonly src?: string;
}

export interface NphSchedulerCalendar {
  readonly id: string;
  readonly name: string;
  readonly color: NphSchedulerColor;
  /** Shown by default; `false` hides its events. The checkbox of "My calendars" turns it on and off. */
  readonly visible?: boolean;
}

export interface NphSchedulerEvent {
  readonly id: string;
  readonly title: string;
  /** `YYYY-MM-DDTHH:mm` in wall-clock time, or `YYYY-MM-DD` for an all-day event. */
  readonly start: string;
  /** Same format as `start`. Absent: the event ends when it starts. An all-day `end` is the last day, included. */
  readonly end?: string;
  readonly allDay?: boolean;
  /** The `id` of a calendar, which gives the color and the name. Absent: `primary`, no calendar name. */
  readonly calendar?: string;
  readonly cancelled?: boolean;
  readonly recurring?: boolean;
  readonly people?: readonly NphSchedulerPerson[];
}

/* ----- the civil calendar ------------------------------------------------------------ */

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

/** Reads `YYYY-MM-DDTHH:mm` (seconds are accepted and dropped). */
export function parseDateTime(text: string): { day: Day; minute: number } | null {
  const found = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/.exec(text);
  if (found === null) return null;
  const day = parseDate(found[1] as string);
  const hour = Number(found[2]);
  const minute = Number(found[3]);
  const second = found[4] === undefined ? 0 : Number(found[4]);
  if (day === null || hour > 23 || minute > 59 || second > 59) return null;
  return { day, minute: hour * 60 + minute };
}

export function isoDate(day: Day): string {
  const { year, month, date } = fromDay(day);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
}

/** 0 is Sunday. 1970-01-01 was a Thursday. */
export function weekdayOf(day: Day): Weekday {
  return ((((day + 4) % 7) + 7) % 7) as Weekday;
}

/** The first day of the week of `day`, the week starting on `first` (0 Sunday, 1 Monday). */
export function startOfWeek(day: Day, first: 0 | 1): Day {
  const back = (weekdayOf(day) - first + 7) % 7;
  return day - back;
}

export function daysInMonth(day: Day): number {
  const { year, month } = fromDay(day);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function firstOfMonth(day: Day): Day {
  const { year, month } = fromDay(day);
  return toDay(year, month, 1);
}

/** The same day of another month; a day that the month does not have becomes its last day. */
export function addMonths(day: Day, count: number): Day {
  const { year, month, date } = fromDay(day);
  const index = year * 12 + (month - 1) + count;
  const targetYear = Math.floor(index / 12);
  const targetMonth = (index % 12) + 1;
  const last = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  return toDay(targetYear, targetMonth, Math.min(date, last));
}

/** The weeks that cover the month of `day`, whole, each with seven days. */
export function monthWeeks(day: Day, first: 0 | 1): Day[][] {
  const start = startOfWeek(firstOfMonth(day), first);
  const last = firstOfMonth(day) + daysInMonth(day) - 1;
  const weeks: Day[][] = [];
  for (let weekStart = start; weekStart <= last; weekStart += 7) {
    weeks.push(Array.from({ length: 7 }, (_, index) => weekStart + index));
  }
  return weeks;
}

/** The days a view shows around `date`. The month and the mobile month show whole weeks. */
export function periodDays(view: NphSchedulerView, date: Day, weekStart: NphSchedulerWeekStart): Day[] {
  const first = weekStart === 'monday' ? 1 : 0;
  switch (view) {
    case 'day':
      return [date];
    case 'work-week': {
      /* Monday to Friday of the week the week start gives: a week that starts on Sunday has its Monday the day after. */
      const monday = startOfWeek(date, first) + (first === 0 ? 1 : 0);
      return Array.from({ length: 5 }, (_, index) => monday + index);
    }
    case 'month':
      return monthWeeks(date, first).flat();
    case 'week':
    case 'list':
    default: {
      const start = startOfWeek(date, first);
      return Array.from({ length: 7 }, (_, index) => start + index);
    }
  }
}

/** The day `date` moves to when the person goes to the previous (`-1`) or next (`1`) period. */
export function movePeriod(view: NphSchedulerView, date: Day, direction: -1 | 1): Day {
  switch (view) {
    case 'day':
      return date + direction;
    case 'month':
      return addMonths(date, direction);
    default:
      return date + direction * 7;
  }
}

/* ----- the events -------------------------------------------------------------------- */

/** An event as the views read it: the days and minutes are parsed and the color is resolved. */
export interface Occurrence {
  /** The position in the sorted list: stable for one reading, used for element ids and the tab order. */
  readonly index: number;
  readonly id: string;
  readonly title: string;
  readonly calendarId: string;
  readonly calendarName: string;
  readonly color: NphSchedulerColor;
  readonly startDay: Day;
  /** Minute of the start day; `-1` for an all-day event, so it sorts before the timed ones. */
  readonly startMinute: number;
  readonly endDay: Day;
  /** Minute of the end day; for a timed event that ends at midnight it is 1440 on the start day. */
  readonly endMinute: number;
  readonly allDay: boolean;
  /** Covers more than one calendar day: it goes to the all-day band, in one bar. */
  readonly multiDay: boolean;
  readonly cancelled: boolean;
  readonly recurring: boolean;
  readonly people: readonly NphSchedulerPerson[];
}

export interface ReadEvents {
  readonly events: Occurrence[];
  /** The calendars that can be drawn: with an id, once each. The ones "My calendars" lists. */
  readonly calendars: NphSchedulerCalendar[];
  /** One sentence per cause; an event that cannot be read is left out and says why. */
  readonly causes: string[];
}

const trimmed = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/** Reads the consumer's list into the occurrences, sorted by start, leaving out what cannot be drawn. */
export function readEvents(events: readonly NphSchedulerEvent[], calendars: readonly NphSchedulerCalendar[]): ReadEvents {
  const causes: string[] = [];
  const add = (cause: string): void => {
    if (!causes.includes(cause)) causes.push(cause);
  };
  const byId = new Map<string, NphSchedulerCalendar>();
  const accepted: NphSchedulerCalendar[] = [];
  for (const calendar of calendars) {
    const id = trimmed(calendar?.id);
    if (id === '') {
      add('A calendar has no id and was left out.');
      continue;
    }
    if (byId.has(id)) {
      add(`calendar id "${id}" appears twice; the first one was kept.`);
      continue;
    }
    if (!(NPH_SCHEDULER_COLORS as readonly string[]).includes(calendar.color)) {
      add(`calendar "${id}" has color "${String(calendar.color)}", which does not exist. Use ${NPH_SCHEDULER_COLORS.join(', ')}; primary was used.`);
    }
    byId.set(id, calendar);
    accepted.push(calendar);
  }
  const seen = new Set<string>();
  const read: Omit<Occurrence, 'index'>[] = [];
  for (const event of events) {
    const id = trimmed(event?.id);
    if (id === '') {
      add('An event has no id and was left out.');
      continue;
    }
    if (seen.has(id)) {
      add(`event id "${id}" appears twice; the first one was kept.`);
      continue;
    }
    if (trimmed(event.title) === '') {
      add(`event "${id}" has no title and was left out.`);
      continue;
    }
    const calendarId = trimmed(event.calendar);
    const calendar = calendarId === '' ? undefined : byId.get(calendarId);
    if (calendarId !== '' && calendar === undefined) {
      add(`event "${id}" points to calendar "${calendarId}", which does not exist; it was left out.`);
      continue;
    }
    if (calendar?.visible === false) {
      seen.add(id);
      continue;
    }
    const allDay = event.allDay === true;
    let startDay: Day;
    let startMinute: number;
    let endDay: Day;
    let endMinute: number;
    if (allDay) {
      const start = parseDate(trimmed(event.start));
      const end = event.end === undefined ? start : parseDate(trimmed(event.end));
      if (start === null || end === null) {
        add(`event "${id}" is all day and needs start (and end) as YYYY-MM-DD; it was left out.`);
        continue;
      }
      if (end < start) {
        add(`event "${id}" ends before it starts and was left out.`);
        continue;
      }
      startDay = start;
      endDay = end;
      startMinute = -1;
      endMinute = MINUTES_PER_DAY;
    } else {
      const start = parseDateTime(trimmed(event.start));
      const end = event.end === undefined ? start : parseDateTime(trimmed(event.end));
      if (start === null || end === null) {
        add(`event "${id}" needs start (and end) as YYYY-MM-DDTHH:mm, with no time zone; it was left out.`);
        continue;
      }
      if (end.day < start.day || (end.day === start.day && end.minute < start.minute)) {
        add(`event "${id}" ends before it starts and was left out.`);
        continue;
      }
      startDay = start.day;
      startMinute = start.minute;
      endDay = end.day;
      endMinute = end.minute;
      /* Ends exactly at midnight of the next day: it fills the start day, to 24:00. */
      if (endDay === startDay + 1 && endMinute === 0) {
        endDay = startDay;
        endMinute = MINUTES_PER_DAY;
      }
    }
    seen.add(id);
    const color = calendar !== undefined && (NPH_SCHEDULER_COLORS as readonly string[]).includes(calendar.color) ? calendar.color : 'primary';
    read.push({
      id,
      title: trimmed(event.title),
      calendarId,
      calendarName: calendar === undefined ? '' : trimmed(calendar.name),
      color,
      startDay,
      startMinute,
      endDay,
      endMinute,
      allDay,
      multiDay: endDay > startDay,
      cancelled: event.cancelled === true,
      recurring: event.recurring === true,
      people: Array.isArray(event.people) ? event.people.filter((person) => trimmed(person?.name) !== '') : [],
    });
  }
  read.sort((a, b) => a.startDay - b.startDay || a.startMinute - b.startMinute || a.endDay - b.endDay || a.endMinute - b.endMinute);
  return { events: read.map((event, index) => ({ ...event, index })), calendars: accepted, causes };
}

/** The event covers `day` (all-day and multi-day events cover every day from start to end). */
export function coversDay(event: Occurrence, day: Day): boolean {
  return event.startDay <= day && day <= event.endDay;
}

/* ----- the layout of a day ----------------------------------------------------------- */

/**
 * The shortest stretch of a day an event takes on the grid, in minutes: the minimum height of 24 px
 * (`scheduler/event-min-height`) over the height of an hour, which the CSS makes twice that height.
 * The layout uses it to know when two events touch; the test of the CSS holds the two together.
 */
export const MIN_VISUAL_MINUTES = 30;

/** An event is tall enough for the time under the title from this duration, in minutes. */
export const TIME_SHOWN_MINUTES = 60;

export interface Placed {
  readonly event: Occurrence;
  readonly startMinute: number;
  readonly endMinute: number;
  /** The column of the event among the ones that touch it, from the start. */
  readonly column: number;
  /** How many columns the group that touches it has. */
  readonly columns: number;
}

/** Places the timed events of one day side by side where they overlap. */
export function layoutDay(events: readonly Occurrence[], day: Day): Placed[] {
  const items = events
    .filter((event) => !event.allDay && !event.multiDay && event.startDay === day)
    .map((event) => ({ event, startMinute: event.startMinute, endMinute: event.endMinute }))
    .sort((a, b) => a.startMinute - b.startMinute || b.endMinute - a.endMinute || a.event.index - b.event.index);
  const placed: Placed[] = [];
  let group: { item: (typeof items)[number]; column: number }[] = [];
  let columnEnds: number[] = [];
  let groupEnd = -1;
  const flush = (): void => {
    for (const entry of group) {
      placed.push({ ...entry.item, column: entry.column, columns: columnEnds.length });
    }
    group = [];
    columnEnds = [];
    groupEnd = -1;
  };
  for (const item of items) {
    const visualEnd = Math.max(item.endMinute, item.startMinute + MIN_VISUAL_MINUTES);
    if (group.length > 0 && item.startMinute >= groupEnd) flush();
    let column = columnEnds.findIndex((end) => end <= item.startMinute);
    if (column === -1) {
      column = columnEnds.length;
      columnEnds.push(visualEnd);
    } else {
      columnEnds[column] = visualEnd;
    }
    group.push({ item, column });
    groupEnd = Math.max(groupEnd, visualEnd);
  }
  flush();
  return placed.sort((a, b) => a.startMinute - b.startMinute || a.column - b.column);
}

/** A bar of the all-day band: the event, the columns it covers and the lane it sits in. */
export interface Bar {
  readonly event: Occurrence;
  /** The first and last column covered, counted from 0 inside the days shown. */
  readonly from: number;
  readonly to: number;
  readonly lane: number;
}

/** The bars of the all-day band over `days`, in lanes so that two bars on the same days never overlap. */
export function layoutBand(events: readonly Occurrence[], days: readonly Day[]): { bars: Bar[]; lanes: number } {
  const first = days[0] as Day;
  const last = days[days.length - 1] as Day;
  const items = events
    .filter((event) => (event.allDay || event.multiDay) && event.startDay <= last && event.endDay >= first)
    .sort((a, b) => a.startDay - b.startDay || b.endDay - a.endDay || a.index - b.index);
  const laneEnds: number[] = [];
  const bars: Bar[] = [];
  for (const event of items) {
    const from = Math.max(event.startDay, first) - first;
    const to = Math.min(event.endDay, last) - first;
    let lane = laneEnds.findIndex((end) => end < from);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(to);
    } else {
      laneEnds[lane] = to;
    }
    bars.push({ event, from, to, lane });
  }
  return { bars, lanes: laneEnds.length };
}

/** The distinct people of the events of a day, in the order they appear. */
export function peopleOf(events: readonly Occurrence[]): NphSchedulerPerson[] {
  const seen = new Set<string>();
  const people: NphSchedulerPerson[] = [];
  for (const event of events) {
    for (const person of event.people) {
      const key = `${person.name}\u0000${person.src ?? ''}`;
      if (!seen.has(key)) {
        seen.add(key);
        people.push(person);
      }
    }
  }
  return people;
}
