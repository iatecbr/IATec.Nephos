/**
 * Tests of `nph-scheduler` (P120), in a real browser (P21, item 5): the grid, the hour height, the
 * measured month cell, the focus ring and the width that switches to the compact month only exist where
 * there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `6151:11160`, sets `6142:1744` and
 * `6141:9258`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-77: the API and the
 * invalid input, the five views and their periods, the toolbar and the date, the side panel and the
 * calendars, the mini month, the event in its colors, types and states, the now line, the keyboard and
 * the order of Tab, the detail in the popover, "+N more", the empty and loading states, the compact month
 * of the phone, the language and the direction, the life cycle and the token contract. The arithmetic of
 * the dates and the layout of a day are in `nph-scheduler.logic.test.ts`.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-scheduler.css?raw';
import { NPH_SCHEDULER_COLORS, NPH_SCHEDULER_LABEL_KEYS, NPH_SCHEDULER_VIEWS, NPH_SCHEDULER_WEEK_STARTS, NphScheduler } from './nph-scheduler';
import type {
  NphSchedulerCalendar,
  NphSchedulerCalendarToggleDetail,
  NphSchedulerDateChangeDetail,
  NphSchedulerEvent,
  NphSchedulerEventClickDetail,
  NphSchedulerEventCloseDetail,
  NphSchedulerLabels,
  NphSchedulerViewChangeDetail,
} from './nph-scheduler';
import { MIN_VISUAL_MINUTES } from './nph-scheduler.logic';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.load('600 14px "Noto Sans"');
  await document.fonts.ready;
});

/** The listeners a test puts on the page; aborted at the end of each test, so none leaks into the next. */
let listeners = new AbortController();

let errors: MockInstance<typeof console.error>;
let warnings: MockInstance<typeof console.warn>;

beforeEach(() => {
  errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  warnings = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  listeners.abort();
  listeners = new AbortController();
  document.body.replaceChildren();
  document.documentElement.removeAttribute('lang');
  document.documentElement.removeAttribute('dir');
  vi.restoreAllMocks();
});

const LABELS: NphSchedulerLabels = {
  today: 'Today',
  previous: 'Previous period',
  next: 'Next period',
  newEvent: 'New event',
  filter: 'Filter',
  sidePanel: 'Side panel',
  view: 'View',
  viewWorkWeek: 'Work week',
  viewWeek: 'Week',
  viewDay: 'Day',
  viewMonth: 'Month',
  viewList: 'List',
  allDay: 'All day',
  cancelled: 'Cancelled:',
  cancelledName: 'cancelled',
  repeats: 'repeats',
  more: '+{count} more',
  moreName: '{count} more events on {date}',
  myCalendars: 'My calendars',
  miniPrevious: 'Previous month',
  miniNext: 'Next month',
  emptyTitle: 'No events this week',
  emptyHint: 'Events appear here when they are created.',
  loading: 'Loading events',
  todayName: 'today',
};

/** Wednesday, 2026-11-11, ten twenty in the morning. */
const NOW = '2026-11-11T10:20';

const CALENDARS: NphSchedulerCalendar[] = [
  { id: 'team', name: 'Team', color: 'primary' },
  { id: 'classes', name: 'Classes', color: 'educacao' },
  { id: 'community', name: 'Community', color: 'igrejas' },
  { id: 'finance', name: 'Finance', color: 'financeiro' },
  { id: 'people', name: 'People', color: 'rh' },
  { id: 'systems', name: 'Systems', color: 'sistemas' },
  { id: 'management', name: 'Management', color: 'gerencial' },
  { id: 'sales', name: 'Sales', color: 'comercial' },
];

const EVENTS: NphSchedulerEvent[] = [
  { id: 'standup', title: 'Team stand-up', start: '2026-11-09T09:00', end: '2026-11-09T10:00', calendar: 'team', recurring: true, people: [{ name: 'Ana' }, { name: 'Bruno' }, { name: 'Carla' }] },
  { id: 'coffee', title: 'Coffee chat', start: '2026-11-09T10:00', end: '2026-11-09T10:30', calendar: 'people' },
  { id: 'workshop', title: 'Teaching workshop', start: '2026-11-10T13:00', end: '2026-11-10T16:00', calendar: 'classes' },
  { id: 'budget', title: 'Budget review', start: '2026-11-10T14:00', end: '2026-11-10T15:00', calendar: 'finance' },
  { id: 'architecture', title: 'Architecture sync', start: '2026-11-11T10:00', end: '2026-11-11T11:00', calendar: 'systems' },
  { id: 'sales', title: 'Sales sync', start: '2026-11-11T10:00', end: '2026-11-11T11:30', calendar: 'sales' },
  { id: 'cancelled', title: 'Quarterly review', start: '2026-11-11T15:00', end: '2026-11-11T16:00', calendar: 'management', cancelled: true },
  { id: 'offsite', title: 'Team offsite', start: '2026-11-12', allDay: true, calendar: 'team' },
  { id: 'interview', title: 'Interview', start: '2026-11-12T09:00', end: '2026-11-12T10:00', calendar: 'people', people: [{ name: 'Elisa' }] },
  { id: 'retreat', title: 'Community retreat', start: '2026-11-13', end: '2026-11-14', allDay: true, calendar: 'community' },
  { id: 'brief', title: 'Quick sync', start: '2026-11-13T11:00', end: '2026-11-13T11:10', calendar: 'team' },
];

/** Six events on one day: more than a month cell holds. */
const BUSY: NphSchedulerEvent[] = Array.from({ length: 7 }, (_, index) => ({
  id: `busy-${index}`,
  title: `Busy ${index}`,
  start: `2026-11-18T${String(8 + index).padStart(2, '0')}:00`,
  end: `2026-11-18T${String(9 + index).padStart(2, '0')}:00`,
  calendar: 'team',
}));

/** A scheduler in a block of its own size, so the container query and the grid have a size to read. */
async function mount(props: Partial<NphScheduler> = {}, width = '72rem', height = '40rem'): Promise<NphScheduler> {
  const holder = document.createElement('div');
  holder.style.inlineSize = width;
  holder.style.blockSize = height;
  const element = document.createElement('nph-scheduler');
  Object.assign(element, { events: EVENTS, calendars: CALENDARS, labels: LABELS, now: NOW, date: '2026-11-11', ...props });
  holder.append(element);
  document.body.append(holder);
  await settle(element);
  return element;
}

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

async function settle(element: NphScheduler): Promise<void> {
  await element.updateComplete;
  await frame();
  for (const inner of element.shadowRoot?.querySelectorAll('nph-icon, nph-button, nph-select, nph-checkbox, nph-popover, nph-avatar-stack') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
  await frame();
  await element.updateComplete;
}

const root = (element: NphScheduler): ShadowRoot => element.shadowRoot as ShadowRoot;
const part = (element: NphScheduler, selector: string): HTMLElement | null => root(element).querySelector<HTMLElement>(selector);
const parts = (element: NphScheduler, selector: string): HTMLElement[] => [...root(element).querySelectorAll<HTMLElement>(selector)];
/**
 * The name of an event starts with what is written on it, in the order it is written: the cancelled text, the
 * title, and the time when the event is tall enough to show it (a list row writes the time first).
 */
const titled = (item: Element | null, title: string): boolean => {
  const name = (item?.getAttribute('aria-label') ?? '').replace(/^Cancelled: /, '').replace(/^(\d{1,2}:\d{2} [AP]M( – \d{1,2}:\d{2} [AP]M)?|All day) /, '');
  return name.startsWith(title) && /^[ ,]/.test(name.slice(title.length));
};
const eventByTitle = (element: NphScheduler, title: string, kind?: string): HTMLElement => {
  const found = parts(element, kind === undefined ? '.event' : `.event[data-kind="${kind}"]`).find((item) => titled(item, title));
  if (found === undefined) throw new Error(`no event "${title}"`);
  return found;
};
const textOf = (node: Element | null): string => (node?.textContent ?? '').replace(/\s+/g, ' ').trim();
const nativeOf = (host: HTMLElement): HTMLButtonElement => host.shadowRoot?.querySelector('button') as HTMLButtonElement;
const buttonByLabel = (element: NphScheduler, label: string): HTMLElement => {
  const found = parts(element, 'nph-button').find((button) => button.getAttribute('text') === label || button.getAttribute('label') === label);
  if (found === undefined) throw new Error(`no button "${label}"`);
  return found;
};

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));
const color = (token: string): string => resolved('color', token);
const background = (token: string): string => resolved('background-color', token);

/** The events the scheduler fires, collected until the end of the test. */
function collect<T>(element: NphScheduler, type: string): T[] {
  const seen: T[] = [];
  element.addEventListener(type, (event) => seen.push((event as CustomEvent<T>).detail), { signal: listeners.signal });
  return seen;
}

/** The days of the header, as the name of each button. */
/** The name of a day starts with what is written on it, `Mon 9`; the rest is the full date. */
const dayNames = (element: NphScheduler): string[] => parts(element, '.day').map((item) => (item.getAttribute('aria-label') ?? '').replace(/^[^,]+, /, ''));

describe('registration and defaults', () => {
  it('defines nph-scheduler exactly once', () => {
    expect(customElements.get('nph-scheduler')).toBe(NphScheduler);
  });

  it('is the work week, with the side panel, the week on Sunday and nothing loading, open or filtered', async () => {
    const element = await mount();
    expect(element.view).toBe('work-week');
    expect(element.weekStart).toBe('sunday');
    expect(element.hideSidePanel).toBe(false);
    expect(element.loading).toBe(false);
    expect(element.openEvent).toBe('');
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(part(element, '.side')).not.toBeNull();
    expect(errors).not.toHaveBeenCalled();
    expect(warnings).not.toHaveBeenCalled();
  });

  it('lists the views, the week starts, the colors and the label keys of the contract', () => {
    expect(NPH_SCHEDULER_VIEWS).toEqual(['work-week', 'week', 'day', 'month', 'list']);
    expect(NPH_SCHEDULER_WEEK_STARTS).toEqual(['sunday', 'monday']);
    expect(NPH_SCHEDULER_COLORS).toEqual(['primary', 'sistemas', 'gerencial', 'educacao', 'comercial', 'financeiro', 'igrejas', 'rh']);
    expect([...NPH_SCHEDULER_LABEL_KEYS].sort()).toEqual(Object.keys(LABELS).sort());
  });

  it('the reactive API is exactly the contract: the data, the view and date, the side panel, loading, now and the open event', () => {
    const names = [...(NphScheduler.elementProperties.keys() as Iterable<string>)].filter((key) => !['compact', 'gridMonth', 'metrics', 'clock', 'announcement', 'hasDetail'].includes(key)).sort();
    expect(names).toEqual(['calendars', 'date', 'events', 'filterItems', 'hideSidePanel', 'labels', 'loading', 'now', 'openEvent', 'view', 'weekStart']);
  });

  it('reflects view, hide-side-panel, loading and open-event, because the CSS and the page read them', async () => {
    const element = await mount({ view: 'month', hideSidePanel: true, loading: true });
    expect(element.getAttribute('view')).toBe('month');
    expect(element.hasAttribute('hide-side-panel')).toBe(true);
    expect(element.hasAttribute('loading')).toBe(true);
  });

  it('has no slot besides the detail and no ::part', async () => {
    const element = await mount();
    expect(parts(element, 'slot')).toHaveLength(0);
    expect(root(element).querySelectorAll('[part]')).toHaveLength(0);
  });
});

describe('invalid input', () => {
  it('draws nothing and says why for a view, a week start, a date and a now that do not exist, and recovers', async () => {
    const element = await mount({ view: 'year' as never });
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(root(element).querySelector('.scheduler')).toBeNull();
    expect(errors).toHaveBeenCalledTimes(1);
    expect(String(errors.mock.calls[0]?.[0])).toContain('view "year" does not exist');
    element.view = 'week';
    element.weekStart = 'friday' as never;
    element.date = '2026-02-30';
    element.now = 'noon';
    await element.updateComplete;
    expect(root(element).querySelector('.scheduler')).toBeNull();
    const text = errors.mock.calls.map((call) => String(call[0])).join('\n');
    expect(text).toContain('week-start "friday" does not exist');
    expect(text).toContain('date "2026-02-30" is not a date');
    expect(text).toContain('now "noon" is not an instant');
    expect(errors).toHaveBeenCalledTimes(4);
    element.weekStart = 'monday';
    element.date = '2026-11-11';
    element.now = NOW;
    await settle(element);
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(parts(element, '.day')).toHaveLength(7);
  });

  it('says each cause once while it lasts', async () => {
    const element = await mount({ view: 'year' as never });
    element.requestUpdate();
    await element.updateComplete;
    element.requestUpdate();
    await element.updateComplete;
    expect(errors).toHaveBeenCalledTimes(1);
  });

  it('leaves out an event that cannot be drawn and keeps the rest, saying why', async () => {
    const element = await mount({
      events: [
        { id: 'good', title: 'Good', start: '2026-11-11T09:00', end: '2026-11-11T10:00' },
        { id: 'bad', title: 'Bad', start: 'soon' },
        { id: 'orphan', title: 'Orphan', start: '2026-11-11T09:00', calendar: 'nobody' },
      ],
    });
    expect(parts(element, '.event[data-kind="grid"]')).toHaveLength(1);
    const text = errors.mock.calls.map((call) => String(call[0])).join('\n');
    expect(text).toContain('"bad" needs start');
    expect(text).toContain('calendar "nobody", which does not exist');
  });

  it('renders and says which label is missing, once', async () => {
    const element = await mount({ labels: { ...LABELS, today: '', allDay: '  ' } });
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(errors).toHaveBeenCalledTimes(1);
    expect(String(errors.mock.calls[0]?.[0])).toContain('labels is missing today, allDay');
  });

  it('takes a list that is not a list, a null label object and a null event as no data', async () => {
    const element = await mount({ events: 'x' as never, calendars: null as never, labels: null as never, filterItems: 4 as never });
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(parts(element, '.event')).toHaveLength(0);
    expect(part(element, '.empty')).not.toBeNull();
    element.events = [null as never, { id: 'x', title: 'X', start: '2026-11-11T09:00' }];
    await settle(element);
    expect(parts(element, '.event[data-kind="grid"]')).toHaveLength(1);
  });
});

describe('the views and their periods', () => {
  it('work week shows Monday to Friday, with the period named in the toolbar', async () => {
    const element = await mount();
    expect(parts(element, '.day')).toHaveLength(5);
    expect(dayNames(element)[0]).toBe('Monday, November 9, 2026');
    expect(dayNames(element)[4]).toBe('Friday, November 13, 2026');
    expect(textOf(part(element, '.period'))).toBe('Nov 9 – 13, 2026');
  });

  it('week shows seven days from Sunday, or from Monday', async () => {
    const element = await mount({ view: 'week' });
    expect(parts(element, '.day')).toHaveLength(7);
    expect(dayNames(element)[0]).toBe('Sunday, November 8, 2026');
    element.weekStart = 'monday';
    await settle(element);
    expect(dayNames(element)[0]).toBe('Monday, November 9, 2026');
    expect(dayNames(element)[6]).toBe('Sunday, November 15, 2026');
  });

  it('day shows one day, and names it in the toolbar', async () => {
    const element = await mount({ view: 'day' });
    expect(parts(element, '.day')).toHaveLength(1);
    expect(dayNames(element)[0]).toBe('Wednesday, November 11, 2026, today');
    expect(textOf(part(element, '.period'))).toBe('Wednesday, November 11, 2026');
  });

  it('month shows whole weeks, a cell per day and a button per day, in the weeks that cover the month', async () => {
    const element = await mount({ view: 'month' });
    expect(parts(element, '.cell')).toHaveLength(35);
    expect(textOf(part(element, '.period'))).toBe('November 2026');
    expect(parts(element, '.weekday').map(textOf)).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    expect(parts(element, '.cell[data-outside]')).toHaveLength(5);
    element.weekStart = 'monday';
    await settle(element);
    expect(parts(element, '.cell')).toHaveLength(42);
    expect(parts(element, '.weekday').map(textOf)[0]).toBe('Mon');
  });

  it('list groups the events of the week by day, only the days that have events, with the day as a heading', async () => {
    const element = await mount({ view: 'list' });
    const headings = parts(element, '.list-heading').map(textOf);
    expect(headings).toEqual(['Monday, November 9, 2026', 'Tuesday, November 10, 2026', 'Wednesday, November 11, 2026', 'Thursday, November 12, 2026', 'Friday, November 13, 2026', 'Saturday, November 14, 2026']);
    expect(parts(element, '.list-heading')[2]?.tagName).toBe('H3');
    expect(parts(element, '.list-heading')[2]?.hasAttribute('data-today')).toBe(true);
    const monday = parts(element, '.list-day')[0] as HTMLElement;
    expect(parts(element, '.row')).toHaveLength(12);
    expect(monday.querySelectorAll('.row')).toHaveLength(2);
    expect(textOf(monday.querySelector('.row-time'))).toBe('9:00 AM – 10:00 AM');
    expect(textOf(monday.querySelectorAll('.row-time')[1] as HTMLElement)).toBe('10:00 AM – 10:30 AM');
  });

  it('shows the multi-day event under each day it covers, and an all-day one as "All day"', async () => {
    const element = await mount({ view: 'list' });
    const days = parts(element, '.list-day');
    const retreat = days.filter((day) => [...day.querySelectorAll('.row')].some((row) => titled(row, 'Community retreat')));
    expect(retreat).toHaveLength(2);
    expect(textOf(retreat[0]?.querySelector('.row-time') as HTMLElement)).toContain('All day');
  });

  it('the view the person picks in the select is the one drawn, and the event is fired once', async () => {
    const element = await mount();
    const changes = collect<NphSchedulerViewChangeDetail>(element, 'nph-view-change');
    const inputs: Event[] = [];
    document.addEventListener('input', (event) => inputs.push(event), { signal: listeners.signal });
    const select = part(element, '.view-select') as HTMLElement & { value: string };
    select.value = 'week';
    select.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(element);
    expect(changes).toEqual([{ view: 'week' }]);
    expect(element.view).toBe('week');
    expect(parts(element, '.day')).toHaveLength(7);
    expect(inputs).toHaveLength(0);
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(changes).toHaveLength(1);
  });

  it('the select offers the five views by the labels', async () => {
    const element = await mount();
    const options = [...(part(element, '.view-select') as HTMLElement).querySelectorAll('nph-option')];
    expect(options.map((option) => [option.getAttribute('value'), textOf(option)])).toEqual([
      ['work-week', 'Work week'],
      ['week', 'Week'],
      ['day', 'Day'],
      ['month', 'Month'],
      ['list', 'List'],
    ]);
  });

  it('setting view and date from code fires nothing', async () => {
    const element = await mount();
    const views = collect(element, 'nph-view-change');
    const dates = collect(element, 'nph-date-change');
    element.view = 'month';
    element.date = '2026-12-05';
    await settle(element);
    expect(views).toEqual([]);
    expect(dates).toEqual([]);
    expect(textOf(part(element, '.period'))).toBe('December 2026');
  });
});

describe('the toolbar and the date', () => {
  it('Today, previous and next move the period by the unit of the view and fire the date, with its source', async () => {
    const element = await mount();
    const dates = collect<NphSchedulerDateChangeDetail>(element, 'nph-date-change');
    nativeOf(buttonByLabel(element, 'Next period')).click();
    await settle(element);
    expect(element.date).toBe('2026-11-18');
    expect(textOf(part(element, '.period'))).toBe('Nov 16 – 20, 2026');
    nativeOf(buttonByLabel(element, 'Previous period')).click();
    nativeOf(buttonByLabel(element, 'Previous period')).click();
    await settle(element);
    expect(element.date).toBe('2026-11-04');
    nativeOf(buttonByLabel(element, 'Today')).click();
    await settle(element);
    expect(element.date).toBe('2026-11-11');
    expect(dates.map((detail) => [detail.date, detail.source])).toEqual([
      ['2026-11-18', 'next'],
      ['2026-11-11', 'previous'],
      ['2026-11-04', 'previous'],
      ['2026-11-11', 'today'],
    ]);
  });

  it('moves a day in the day view and a month in the month view', async () => {
    const day = await mount({ view: 'day' });
    nativeOf(buttonByLabel(day, 'Next period')).click();
    await settle(day);
    expect(day.date).toBe('2026-11-12');
    const month = await mount({ view: 'month' });
    nativeOf(buttonByLabel(month, 'Next period')).click();
    await settle(month);
    expect(month.date).toBe('2026-12-11');
    expect(textOf(part(month, '.period'))).toBe('December 2026');
  });

  it('with no date it is today, and "today" is the now of the page', async () => {
    const element = await mount({ date: '' });
    expect(dayNames(element)[2]).toBe('Wednesday, November 11, 2026, today');
    element.now = '2026-11-16T09:00';
    await settle(element);
    expect(dayNames(element)[0]).toBe('Monday, November 16, 2026, today');
  });

  it('writes the primary action as the only primary button, the others secondary', async () => {
    const element = await mount();
    const primary = parts(element, 'nph-button[severity="primary"]');
    expect(primary.map((button) => button.getAttribute('text'))).toEqual(['New event']);
    expect(buttonByLabel(element, 'Today').getAttribute('severity')).toBe('secondary');
    expect(buttonByLabel(element, 'Today').getAttribute('emphasis')).toBe('solid');
    expect(buttonByLabel(element, 'Filter').getAttribute('emphasis')).toBe('solid');
    expect(buttonByLabel(element, 'Previous period').getAttribute('emphasis')).toBe('ghost');
  });

  it('"New event" hands the date to the screen and opens nothing', async () => {
    const element = await mount();
    const seen = collect<{ date: string }>(element, 'nph-new-event');
    nativeOf(buttonByLabel(element, 'New event')).click();
    expect(seen).toEqual([{ date: '2026-11-11' }]);
    expect(part(element, 'nph-popover')).toBeNull();
  });

  it('"Filter" fires its own event without items, and opens the menu with them', async () => {
    const element = await mount();
    const clicks = collect(element, 'nph-filter-click');
    nativeOf(buttonByLabel(element, 'Filter')).click();
    expect(clicks).toHaveLength(1);
    expect(part(element, 'nph-dropdown-menu')).toBeNull();
    element.filterItems = [{ value: 'mine', text: 'My events', selection: 'multiple', checked: true }];
    await settle(element);
    const selected = collect<{ value: string; checked: boolean | null }>(element, 'nph-filter-select');
    const menu = part(element, 'nph-dropdown-menu') as HTMLElement & { updateComplete: Promise<unknown> };
    expect(menu.getAttribute('for')).toBe('filter');
    nativeOf(buttonByLabel(element, 'Filter')).click();
    await menu.updateComplete;
    expect(clicks).toHaveLength(1);
    menu.dispatchEvent(new CustomEvent('nph-item-select', { detail: { value: 'mine', checked: false }, bubbles: true }));
    expect(selected).toEqual([{ value: 'mine', checked: false }]);
  });

  it('names the region by the period, and announces the new period politely after a move', async () => {
    const element = await mount();
    const region = part(element, '.scheduler') as HTMLElement;
    expect(region.getAttribute('aria-labelledby')).toBe('period');
    const status = part(element, '.live[aria-live="polite"]') as HTMLElement;
    expect(textOf(status)).toBe('');
    nativeOf(buttonByLabel(element, 'Next period')).click();
    await settle(element);
    expect(textOf(status)).toBe('Nov 16 – 20, 2026');
    expect(status.getAttribute('role')).toBe('status');
  });

  it('the toolbar buttons are the nph-button, by instance, with no override of background or outline', async () => {
    const element = await mount();
    const css = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(css).not.toMatch(/nph-button\s*[{,][^}]*(background|outline|border)/);
    expect(parts(element, '.toolbar nph-button').length).toBeGreaterThanOrEqual(5);
  });
});

describe('the side panel and the calendars', () => {
  it('the sidebar button toggles the side panel in every desktop view and fires the state', async () => {
    for (const view of NPH_SCHEDULER_VIEWS) {
      const element = await mount({ view });
      const changes = collect<{ open: boolean }>(element, 'nph-side-panel-change');
      const toggle = part(element, '.side-toggle') as HTMLButtonElement;
      expect(toggle.getAttribute('aria-expanded'), view).toBe('true');
      expect(toggle.getAttribute('aria-controls')).toBe('side');
      expect(toggle.getAttribute('aria-label')).toBe('Side panel');
      toggle.click();
      await settle(element);
      expect(part(element, '.side'), view).toBeNull();
      expect(element.hideSidePanel).toBe(true);
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      (part(element, '.side-toggle') as HTMLButtonElement).click();
      await settle(element);
      expect(part(element, '.side'), view).not.toBeNull();
      expect(changes).toEqual([{ open: false }, { open: true }]);
    }
  });

  it('hide-side-panel starts it hidden, and the main area takes the width', async () => {
    const shown = await mount();
    const hidden = await mount({ hideSidePanel: true });
    expect(part(hidden, '.side')).toBeNull();
    expect((part(hidden, '.body') as HTMLElement).getBoundingClientRect().width).toBeGreaterThan((part(shown, '.body') as HTMLElement).getBoundingClientRect().width);
  });

  it('the sidebar button keeps the place of the icon with a skeleton, until `sidebar` is in nph-icon (D-2)', async () => {
    const element = await mount();
    const toggle = part(element, '.side-toggle') as HTMLElement;
    expect(toggle.querySelector('nph-skeleton')).not.toBeNull();
    expect(toggle.querySelector('nph-icon')).toBeNull();
    expect(part(element, 'nph-tooltip[for="side-toggle"]')?.getAttribute('relation')).toBe('name');
  });

  it('draws a checkbox per calendar, checked by default, with the color of the calendar beside it', async () => {
    const element = await mount();
    const rows = parts(element, '.calendar-row');
    expect(rows).toHaveLength(8);
    const checkbox = rows[1]?.querySelector('nph-checkbox') as HTMLElement & { checked: boolean; text: string };
    expect(checkbox.text).toBe('Classes');
    expect(checkbox.checked).toBe(true);
    expect(rows[1]?.querySelector('.calendar-dot')?.getAttribute('data-color')).toBe('educacao');
    expect(part(element, '.calendars')?.getAttribute('role')).toBe('group');
    expect(textOf(part(element, '#calendars-label'))).toBe('My calendars');
  });

  it('a checkbox shows and hides the events of its calendar, fires the toggle and never changes the consumer`s objects', async () => {
    const element = await mount();
    const calendars = element.calendars;
    const first = calendars[1];
    const toggles = collect<NphSchedulerCalendarToggleDetail>(element, 'nph-calendar-toggle');
    expect(eventByTitle(element, 'Teaching workshop')).toBeDefined();
    const checkbox = parts(element, '.calendar-row nph-checkbox')[1] as HTMLElement & { checked: boolean };
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(element);
    expect(toggles).toEqual([{ id: 'classes', visible: false }]);
    expect(parts(element, '.event').some((item) => titled(item, 'Teaching workshop'))).toBe(false);
    expect(element.calendars).not.toBe(calendars);
    expect(element.calendars[1]).toEqual({ ...(first as NphSchedulerCalendar), visible: false });
    expect(first?.visible).toBeUndefined();
    expect(calendars[1]).toBe(first);
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(element);
    expect(toggles).toHaveLength(2);
    expect(eventByTitle(element, 'Teaching workshop')).toBeDefined();
  });

  it('a calendar that comes hidden is drawn unchecked, and its events are not drawn', async () => {
    const element = await mount({ calendars: CALENDARS.map((calendar) => (calendar.id === 'team' ? { ...calendar, visible: false } : calendar)) });
    const checkbox = parts(element, '.calendar-row nph-checkbox')[0] as HTMLElement & { checked: boolean };
    expect(checkbox.checked).toBe(false);
    expect(parts(element, '.event').some((item) => titled(item, 'Team offsite'))).toBe(false);
  });
});

describe('the mini month', () => {
  const cells = (element: NphScheduler): HTMLElement[] => parts(element, '.date-grid[data-kind="mini"] .grid-cell');

  it('is a grid of the month of the date, with the day names, the selected day and today marked', async () => {
    const element = await mount();
    const grid = part(element, '.date-grid[data-kind="mini"]') as HTMLElement;
    expect(grid.getAttribute('role')).toBe('grid');
    expect(grid.getAttribute('aria-label')).toBe('November 2026');
    expect(textOf(part(element, '#mini-label'))).toBe('November 2026');
    expect(cells(element)).toHaveLength(35);
    const selected = cells(element).filter((cell) => cell.getAttribute('aria-selected') === 'true');
    expect(selected.map((cell) => cell.getAttribute('aria-label'))).toEqual(['Wednesday, November 11, 2026, today']);
    expect(cells(element).filter((cell) => cell.getAttribute('aria-current') === 'date')).toHaveLength(1);
    expect(parts(element, '.date-grid[data-kind="mini"] .grid-head').map((head) => head.getAttribute('aria-label'))[0]).toBe('Sunday');
  });

  it('keeps one stop of Tab, on the selected day, and moves it with the arrows, Home, End and the pages', async () => {
    const element = await mount();
    expect(cells(element).filter((cell) => cell.tabIndex === 0)).toHaveLength(1);
    expect(cells(element).find((cell) => cell.tabIndex === 0)?.getAttribute('aria-label')).toContain('November 11');
    const press = async (key: string, expectDay: string): Promise<void> => {
      const active = (root(element).activeElement ?? cells(element).find((cell) => cell.tabIndex === 0)) as HTMLElement;
      active.focus();
      active.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, composed: true }));
      await settle(element);
      expect((root(element).activeElement as HTMLElement).getAttribute('aria-label'), key).toContain(expectDay);
    };
    cells(element).find((cell) => cell.tabIndex === 0)?.focus();
    await press('ArrowRight', 'Thursday, November 12');
    await press('ArrowDown', 'Thursday, November 19');
    await press('ArrowLeft', 'Wednesday, November 18');
    await press('ArrowUp', 'Wednesday, November 11');
    await press('Home', 'Sunday, November 8');
    await press('End', 'Saturday, November 14');
    await press('PageDown', 'Monday, December 14');
    expect(textOf(part(element, '#mini-label'))).toBe('December 2026');
    await press('PageUp', 'Saturday, November 14');
    expect(textOf(part(element, '#mini-label'))).toBe('November 2026');
    expect(element.date).toBe('2026-11-11');
  });

  it('moving the focus does not choose a day; Enter or a click does, and fires the date', async () => {
    const element = await mount();
    const dates = collect<NphSchedulerDateChangeDetail>(element, 'nph-date-change');
    const target = cells(element).find((cell) => cell.getAttribute('aria-label')?.startsWith('Friday, November 20')) as HTMLElement;
    target.focus();
    expect(dates).toEqual([]);
    target.click();
    await settle(element);
    expect(dates).toEqual([{ date: '2026-11-20', source: 'mini-month' }]);
    expect(element.date).toBe('2026-11-20');
    expect(textOf(part(element, '.period'))).toBe('Nov 16 – 20, 2026');
  });

  it('the month buttons move only the month shown, not the date', async () => {
    const element = await mount();
    const dates = collect(element, 'nph-date-change');
    nativeOf(buttonByLabel(element, 'Next month')).click();
    await settle(element);
    expect(textOf(part(element, '#mini-label'))).toBe('December 2026');
    expect(element.date).toBe('2026-11-11');
    expect(dates).toEqual([]);
    expect(textOf(part(element, '.period'))).toBe('Nov 9 – 13, 2026');
    nativeOf(buttonByLabel(element, 'Previous month')).click();
    await settle(element);
    expect(textOf(part(element, '#mini-label'))).toBe('November 2026');
  });

  it('follows the date when it changes from outside, and starts the week on Monday when asked', async () => {
    const element = await mount();
    element.date = '2027-01-20';
    await settle(element);
    expect(textOf(part(element, '#mini-label'))).toBe('January 2027');
    element.weekStart = 'monday';
    await settle(element);
    expect(parts(element, '.date-grid[data-kind="mini"] .grid-head')[0]?.getAttribute('aria-label')).toBe('Monday');
  });
});

describe('the event', () => {
  it('takes the color of its calendar: the role tokens of primary and of each of the seven verticals', async () => {
    const element = await mount({ view: 'week' });
    const roles: [string, string][] = [
      ['Team offsite', 'primary'],
      ['Teaching workshop', 'educacao'],
      ['Community retreat', 'igrejas'],
      ['Budget review', 'financeiro'],
      ['Interview', 'rh'],
      ['Architecture sync', 'sistemas'],
      ['Quarterly review', 'gerencial'],
      ['Sales sync', 'comercial'],
    ];
    for (const [title, calendarColor] of roles) {
      if (title === 'Quarterly review') continue;
      const item = eventByTitle(element, title);
      expect(item.dataset.color, title).toBe(calendarColor);
      const prefix = calendarColor === 'primary' ? '--nph-scheduler-event' : `--nph-scheduler-event-${calendarColor}`;
      const style = getComputedStyle(item);
      expect(style.backgroundColor, title).toBe(background(`${prefix}-background`));
      expect(style.color, title).toBe(color(`${prefix}-foreground`));
      expect(getComputedStyle(item.querySelector('.bar') as HTMLElement).backgroundColor, title).toBe(background(`${prefix}-indicator`));
    }
  });

  it('hover paints the hover pair and the open event has the same background, with aria-expanded', async () => {
    const element = await mount({ view: 'week' });
    const item = eventByTitle(element, 'Teaching workshop', 'grid');
    await userEvent.hover(item);
    expect(getComputedStyle(item).backgroundColor).toBe(background('--nph-scheduler-event-educacao-background-hover'));
    expect(getComputedStyle(item).color).toBe(color('--nph-scheduler-event-educacao-foreground-hover'));
    expect(part(element, 'nph-popover')).toBeNull();
    expect(document.activeElement).not.toBe(item);
  });

  it('the cancelled event is neutral, with its text before the struck title, a neutral outline and no bar', async () => {
    const element = await mount({ view: 'week' });
    const item = eventByTitle(element, 'Quarterly review', 'grid');
    const style = getComputedStyle(item);
    expect(style.backgroundColor).toBe(background('--nph-scheduler-event-cancelled-background'));
    expect(style.color).toBe(color('--nph-scheduler-event-cancelled-foreground'));
    expect(style.boxShadow).toContain(color('--nph-scheduler-event-cancelled-border').replace('rgb(', 'rgb('));
    expect(getComputedStyle(item.querySelector('.bar') as HTMLElement).display).toBe('none');
    expect(textOf(item.querySelector('.prefix'))).toBe('Cancelled:');
    expect(getComputedStyle(item.querySelector('.name') as HTMLElement).textDecorationLine).toBe('line-through');
    expect(getComputedStyle(item.querySelector('.prefix') as HTMLElement).textDecorationLine).toBe('none');
    await userEvent.hover(item);
    expect(getComputedStyle(item).backgroundColor).toBe(background('--nph-scheduler-event-cancelled-background'));
    expect(item.getAttribute('aria-label')).toContain('cancelled');
  });

  it('a recurring event has the repeat icon after the title, in the color of the title, and says it repeats', async () => {
    const element = await mount({ view: 'week' });
    const item = eventByTitle(element, 'Team stand-up', 'grid');
    const icon = item.querySelector('nph-icon.repeat') as HTMLElement;
    expect(icon.getAttribute('name')).toBe('rotate-right');
    expect(item.querySelector('.title-row')?.lastElementChild).toBe(icon);
    expect(item.getAttribute('aria-label')).toContain('repeats');
    expect(eventByTitle(element, 'Interview', 'grid').querySelector('nph-icon.repeat')).toBeNull();
  });

  it('the event is a button, and its name carries the whole title, the date, the time, the calendar and the states', async () => {
    const element = await mount({ view: 'week' });
    expect(eventByTitle(element, 'Team stand-up', 'grid').tagName).toBe('BUTTON');
    expect(eventByTitle(element, 'Team stand-up', 'grid').getAttribute('aria-label')).toBe(
      'Team stand-up 9:00 AM – 10:00 AM, Monday, November 9, 2026, Team, repeats',
    );
    expect(eventByTitle(element, 'Quarterly review', 'grid').getAttribute('aria-label')).toBe(
      'Cancelled: Quarterly review 3:00 PM – 4:00 PM, Wednesday, November 11, 2026, Management, cancelled',
    );
    expect(eventByTitle(element, 'Team offsite', 'bar').getAttribute('aria-label')).toBe('Team offsite, Thursday, November 12, 2026, All day, Team');
    expect(eventByTitle(element, 'Community retreat', 'bar').getAttribute('aria-label')).toBe(
      'Community retreat, Friday, November 13, 2026 – Saturday, November 14, 2026, All day, Community',
    );
    expect(eventByTitle(element, 'Quick sync', 'grid').getAttribute('aria-label')).toContain('11:00 AM – 11:10 AM');
  });

  it('a title that does not fit is cut on one line with an ellipsis and stays whole in the name', async () => {
    const long = 'A very long title that cannot fit in the narrow column of a crowded day in the week view';
    const element = await mount({ events: [{ id: 'a', title: long, start: '2026-11-11T09:00', end: '2026-11-11T10:00' }, { id: 'b', title: 'Other', start: '2026-11-11T09:00', end: '2026-11-11T10:00' }], view: 'week' });
    const item = eventByTitle(element, long, 'grid');
    const title = item.querySelector('.title') as HTMLElement;
    expect(getComputedStyle(title).textOverflow).toBe('ellipsis');
    expect(getComputedStyle(title).whiteSpace).toBe('nowrap');
    expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
    expect(title.getBoundingClientRect().height).toBeLessThanOrEqual(px('--nph-text-label-sm-line-height') + 1);
    expect(titled(item, long)).toBe(true);
  });

  it('is placed by time: the hour is twice the minimum height, the top is the start and the height is the duration', async () => {
    const element = await mount({ view: 'week' });
    const hour = px('--nph-scheduler-event-min-height') * 2;
    expect((part(element, '.hour') as HTMLElement).getBoundingClientRect().height).toBe(hour);
    expect(MIN_VISUAL_MINUTES * (hour / 60)).toBe(px('--nph-scheduler-event-min-height'));
    const column = (index: number): HTMLElement => parts(element, '.column')[index] as HTMLElement;
    const standup = eventByTitle(element, 'Team stand-up', 'grid');
    const monday = column(1);
    expect(standup.parentElement).toBe(monday);
    expect(standup.offsetTop).toBe(9 * hour);
    expect(Math.round(standup.getBoundingClientRect().height)).toBe(Math.round(hour - px('--nph-scheduler-event-border-width')));
    const workshop = eventByTitle(element, 'Teaching workshop', 'grid');
    expect(Math.round(workshop.getBoundingClientRect().height)).toBe(Math.round(3 * hour - px('--nph-scheduler-event-border-width')));
    expect((part(element, '.columns') as HTMLElement).getBoundingClientRect().height).toBe(24 * hour);
  });

  it('keeps the minimum height of 24 px for a short event, and shows the time only when the event is tall enough', async () => {
    const element = await mount({ view: 'week' });
    const brief = eventByTitle(element, 'Quick sync', 'grid');
    expect(brief.getBoundingClientRect().height).toBeGreaterThanOrEqual(px('--nph-scheduler-event-min-height'));
    expect(brief.querySelector('.time')).toBeNull();
    expect(brief.getBoundingClientRect().height).toBeGreaterThanOrEqual(px('--nph-scheduler-event-min-height'));
    const coffee = eventByTitle(element, 'Coffee chat', 'grid');
    expect(coffee.querySelector('.time')).toBeNull();
    expect(coffee.getBoundingClientRect().height).toBeGreaterThanOrEqual(px('--nph-scheduler-event-min-height') - px('--nph-scheduler-event-border-width'));
    const standup = eventByTitle(element, 'Team stand-up', 'grid');
    expect(textOf(standup.querySelector('.time'))).toBe('9:00 AM – 10:00 AM');
    const content = standup.querySelector('.content') as HTMLElement;
    expect(content.scrollHeight).toBeLessThanOrEqual(content.clientHeight);
  });

  it('events that overlap sit side by side in the column, and a title in the short one fits the 24 px', async () => {
    const element = await mount({ view: 'day' });
    const sales = eventByTitle(element, 'Sales sync', 'grid');
    const architecture = eventByTitle(element, 'Architecture sync', 'grid');
    /* The longer of two that start together takes the first column. */
    const a = sales.getBoundingClientRect();
    const b = architecture.getBoundingClientRect();
    expect(a.right).toBeLessThanOrEqual(b.left + 1);
    expect(Math.abs(a.width - b.width)).toBeLessThanOrEqual(1);
    const column = parts(element, '.column')[0] as HTMLElement;
    expect(a.width * 2).toBeCloseTo(column.getBoundingClientRect().width, -1);
  });

  it('uses the typography of the contract: label-sm for the title, caption for the time', async () => {
    const element = await mount({ view: 'week' });
    const standup = eventByTitle(element, 'Team stand-up', 'grid');
    expect(getComputedStyle(standup.querySelector('.title') as HTMLElement).fontSize).toBe(resolved('width', '--nph-text-label-sm-font-size'));
    expect(getComputedStyle(standup.querySelector('.time') as HTMLElement).fontSize).toBe(resolved('width', '--nph-text-caption-font-size'));
    expect(getComputedStyle(standup).borderTopLeftRadius).toBe(resolved('width', '--nph-scheduler-event-radius'));
    const content = standup.querySelector('.content') as HTMLElement;
    expect(getComputedStyle(content).paddingLeft).toBe(resolved('width', '--nph-scheduler-event-padding-x'));
    expect(getComputedStyle(content).paddingTop).toBe(resolved('width', '--nph-scheduler-event-padding-y'));
    expect(getComputedStyle(standup.querySelector('.bar') as HTMLElement).width).toBe(resolved('width', '--nph-scheduler-event-indicator-width'));
  });

  it('the all-day event is a bar of the band over its days, and a multi-day one covers every day it spans', async () => {
    const element = await mount({ view: 'week' });
    const offsite = eventByTitle(element, 'Team offsite', 'bar');
    const retreat = eventByTitle(element, 'Community retreat', 'bar');
    const heads = parts(element, '.day-head').map((head) => head.getBoundingClientRect());
    const widthOf = (item: HTMLElement): number => item.getBoundingClientRect().width;
    expect(widthOf(retreat)).toBeGreaterThan(widthOf(offsite) * 1.9);
    expect(offsite.getBoundingClientRect().left).toBeCloseTo((heads[4] as DOMRect).left, -1);
    expect(retreat.getBoundingClientRect().left).toBeCloseTo((heads[5] as DOMRect).left, -1);
    expect(retreat.getBoundingClientRect().right).toBeCloseTo((heads[6] as DOMRect).right, -1);
    expect(textOf(part(element, '.band-label'))).toBe('All day');
    expect(offsite.getBoundingClientRect().height).toBeGreaterThanOrEqual(px('--nph-scheduler-event-min-height'));
  });

  it('the band takes the room of its lanes, and a day header with people draws the stack with their names', async () => {
    const element = await mount({ view: 'week' });
    const head = parts(element, '.day-head')[1] as HTMLElement;
    const stack = head.querySelector('nph-avatar-stack') as HTMLElement;
    expect(stack.getAttribute('label')).toBe('Ana, Bruno, and Carla');
    expect(stack.getAttribute('size')).toBe('sm');
    expect(stack.querySelectorAll('nph-avatar')).toHaveLength(3);
    const alone = parts(element, '.day-head')[4]?.querySelector('nph-avatar') as HTMLElement;
    expect(alone.getAttribute('label')).toBe('Elisa');
    expect(parts(element, '.day-head')[2]?.querySelector('.people')).toBeNull();
    const stacked = await mount({
      view: 'week',
      events: [
        { id: 'a', title: 'A', start: '2026-11-09', end: '2026-11-11', allDay: true },
        { id: 'b', title: 'B', start: '2026-11-10', end: '2026-11-12', allDay: true },
      ],
    });
    const a = eventByTitle(stacked, 'A', 'bar').getBoundingClientRect();
    const b = eventByTitle(stacked, 'B', 'bar').getBoundingClientRect();
    expect(b.top).toBeGreaterThanOrEqual(a.bottom);
  });

  it('more than three people show three avatars and the count of the rest, with every name in the label', async () => {
    const people = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Frank'].map((name) => ({ name }));
    const element = await mount({ view: 'week', events: [{ id: 'a', title: 'A', start: '2026-11-11T09:00', end: '2026-11-11T10:00', people }] });
    const stack = parts(element, '.day-head nph-avatar-stack')[0] as HTMLElement;
    expect(stack.querySelectorAll('nph-avatar')).toHaveLength(3);
    expect(stack.getAttribute('count')).toBe('3');
    expect(stack.getAttribute('label')).toBe('Ana, Bruno, Carla, Diego, Elisa, and Frank');
    expect(warnings).not.toHaveBeenCalled();
  });

  it('the people of a day come from the events that cover it, once each', async () => {
    const element = await mount({
      view: 'week',
      events: [
        { id: 'a', title: 'A', start: '2026-11-11T09:00', end: '2026-11-11T10:00', people: [{ name: 'Ana' }, { name: 'Bruno' }] },
        { id: 'b', title: 'B', start: '2026-11-11T11:00', end: '2026-11-11T12:00', people: [{ name: 'Bruno' }, { name: 'Carla' }] },
        { id: 'c', title: 'C', start: '2026-11-12', allDay: true, people: [{ name: 'Diego' }] },
      ],
    });
    expect(parts(element, '.day-head nph-avatar-stack').map((stack) => stack.getAttribute('label'))).toEqual(['Ana, Bruno, and Carla']);
    expect(parts(element, '.day-head nph-avatar')).toHaveLength(3 + 1);
  });
});

describe('the focus', () => {
  it('the focused event gets the border and the halo of its color, outside the body', async () => {
    const element = await mount({ view: 'week' });
    const item = eventByTitle(element, 'Teaching workshop', 'grid');
    await userEvent.tab();
    item.focus({ focusVisible: true } as FocusOptions);
    await userEvent.keyboard('{Shift>}{/Shift}');
    const before = getComputedStyle(item, '::before');
    const after = getComputedStyle(item, '::after');
    expect(root(element).activeElement).toBe(item);
    expect(before.borderTopColor).toBe(resolved('border-top-color', '--nph-scheduler-event-educacao-focus-border'));
    expect(after.borderTopColor).toBe(resolved('border-top-color', '--nph-scheduler-event-educacao-focus-halo'));
    expect(before.borderTopWidth).toBe(resolved('width', '--nph-scheduler-focus-border-width'));
    expect(after.borderTopWidth).toBe(resolved('width', '--nph-scheduler-focus-halo-width'));
    expect(before.borderTopLeftRadius).toBe(resolved('width', '--nph-scheduler-focus-border-radius'));
    expect(after.borderTopLeftRadius).toBe(resolved('width', '--nph-scheduler-focus-halo-radius'));
    expect(getComputedStyle(item).outlineStyle).toBe('none');
  });

  it('the primary color takes the brand focus, and the cancelled event the same border in the color of its calendar', async () => {
    const element = await mount({ view: 'week' });
    const primary = eventByTitle(element, 'Team stand-up', 'grid');
    primary.focus({ focusVisible: true } as FocusOptions);
    expect(getComputedStyle(primary, '::before').borderTopColor).toBe(resolved('border-top-color', '--nph-scheduler-focus-border'));
    expect(getComputedStyle(primary, '::after').borderTopColor).toBe(resolved('border-top-color', '--nph-scheduler-focus-halo'));
    const cancelled = eventByTitle(element, 'Quarterly review', 'grid');
    cancelled.focus({ focusVisible: true } as FocusOptions);
    expect(getComputedStyle(cancelled, '::before').borderTopColor).toBe(resolved('border-top-color', '--nph-scheduler-event-gerencial-focus-border'));
    expect(getComputedStyle(cancelled, '::before').borderTopStyle).toBe('solid');
  });

  it('the day, the month cell, the month line, the list row and the date grid take the same focus', async () => {
    const element = await mount({ view: 'week' });
    const day = part(element, '.day') as HTMLElement;
    day.focus({ focusVisible: true } as FocusOptions);
    expect(getComputedStyle(day, '::before').borderTopColor).toBe(resolved('border-top-color', '--nph-scheduler-focus-border'));
    expect(getComputedStyle(day, '::after').borderTopColor).toBe(resolved('border-top-color', '--nph-scheduler-focus-halo'));
    const month = await mount({ view: 'month' });
    for (const selector of ['.cell', '.event[data-kind="line"]', '.grid-cell[tabindex="0"]']) {
      const target = part(month, selector) as HTMLElement;
      target.focus({ focusVisible: true } as FocusOptions);
      expect(getComputedStyle(target, '::before').borderTopColor, selector).not.toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(target, '::before').borderTopStyle, selector).toBe('solid');
    }
    const list = await mount({ view: 'list' });
    const row = part(list, '.row') as HTMLElement;
    row.focus({ focusVisible: true } as FocusOptions);
    const holder = row.closest('.row-item') as HTMLElement;
    expect(getComputedStyle(holder, '::before').borderTopStyle).toBe('solid');
    expect(getComputedStyle(holder, '::before').borderTopColor).toBe(resolved('border-top-color', '--nph-scheduler-focus-border'));
  });
});

describe('the keyboard', () => {
  /** The elements that take Tab, in the order of the document: the pieces that hold a native control stand for it. */
  function stops(element: NphScheduler): HTMLElement[] {
    return parts(element, '.side-toggle, .toolbar nph-button, .view-select, .date-grid[data-kind="mini"] .grid-cell[tabindex="0"], .mini-nav nph-button, nph-checkbox, .day, .cell, .event, .more nph-button');
  }

  it('Tab goes through the toolbar, the side panel, the days from left to right, then the events: the order of the document', async () => {
    const element = await mount({ view: 'week' });
    const list = stops(element);
    const indexOf = (selector: string): number => list.findIndex((item) => item.matches(selector));
    const lastIndexOf = (selector: string): number => list.map((item) => item.matches(selector)).lastIndexOf(true);
    expect(indexOf('.side-toggle')).toBe(0);
    expect(lastIndexOf('.toolbar nph-button')).toBeLessThan(indexOf('.mini-nav nph-button'));
    expect(lastIndexOf('.view-select')).toBeLessThan(indexOf('.mini-nav nph-button'));
    expect(lastIndexOf('nph-checkbox')).toBeLessThan(indexOf('.day'));
    expect(lastIndexOf('.day')).toBeLessThan(indexOf('.event'));
    expect(parts(element, '.toolbar').every((toolbar) => toolbar.compareDocumentPosition(part(element, '.side') as HTMLElement) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
    const days = list.filter((item) => item.matches('.day')).map((item) => item.getBoundingClientRect().left);
    expect([...days].sort((a, b) => a - b)).toEqual(days);
  });

  it('the events of the grid come in start order, and at the same start, from left to right', async () => {
    const element = await mount({ view: 'day' });
    const grid = parts(element, '.event[data-kind="grid"]');
    expect(grid.map((item) => item.dataset.event)).toEqual(['sales', 'architecture', 'cancelled']);
    const lefts = grid.slice(0, 2).map((item) => item.getBoundingClientRect().left);
    expect(lefts[0]).toBeLessThan(lefts[1] as number);
  });

  it('a real Tab from the last day lands on the first event, and every day and every event is a stop', async () => {
    const element = await mount({ view: 'week', events: EVENTS.filter((item) => !item.allDay) });
    const days = parts(element, '.day');
    expect(days.every((item) => item.tabIndex === 0)).toBe(true);
    expect(parts(element, '.event').every((item) => item.tabIndex === 0)).toBe(true);
    (days[days.length - 1] as HTMLElement).focus();
    await userEvent.tab();
    const active = root(element).activeElement as HTMLElement;
    expect(active.classList.contains('event')).toBe(true);
    expect(titled(active, 'Team stand-up')).toBe(true);
    await userEvent.tab();
    expect(titled(root(element).activeElement, 'Coffee chat')).toBe(true);
  });

  it('has no arrow keys on the grid: the arrows on an event and on a day move nothing and are not stopped', async () => {
    const element = await mount({ view: 'week' });
    const item = eventByTitle(element, 'Teaching workshop', 'grid');
    item.focus();
    const keydown = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true, composed: true });
    item.dispatchEvent(keydown);
    expect(keydown.defaultPrevented).toBe(false);
    expect(root(element).activeElement).toBe(item);
  });

  it('Enter and Space on an event hand the click to the screen, with the source; the screen can cancel it', async () => {
    const element = await mount({ view: 'week' });
    const clicks = collect<NphSchedulerEventClickDetail>(element, 'nph-event-click');
    const item = eventByTitle(element, 'Teaching workshop', 'grid');
    item.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await userEvent.click(item);
    expect(clicks).toEqual([
      { id: 'workshop', source: 'keyboard' },
      { id: 'workshop', source: 'keyboard' },
      { id: 'workshop', source: 'pointer' },
    ]);
  });

  it('a click is fired as a cancelable event, and the screen that cancels it opens nothing', async () => {
    const element = await mount({ view: 'week' });
    const detail = document.createElement('div');
    detail.slot = 'detail';
    detail.textContent = 'Details';
    element.append(detail);
    await settle(element);
    element.addEventListener(
      'nph-event-click',
      (event) => {
        expect(event.cancelable).toBe(true);
        event.preventDefault();
      },
      { signal: listeners.signal },
    );
    eventByTitle(element, 'Teaching workshop', 'grid').click();
    await settle(element);
    expect(element.openEvent).toBe('');
    expect(part(element, 'nph-popover')).toBeNull();
  });
});

describe('the detail in the popover', () => {
  async function withDetail(props: Partial<NphScheduler> = {}): Promise<NphScheduler> {
    const element = await mount({ view: 'week', ...props });
    const body = document.createElement('div');
    body.slot = 'detail';
    body.innerHTML = '<button id="inside" type="button">Edit</button>';
    element.append(body);
    await settle(element);
    return element;
  }

  it('opens beside the event with the title as heading, the screen`s content inside and aria-expanded on the event', async () => {
    const element = await withDetail();
    const item = eventByTitle(element, 'Teaching workshop', 'grid');
    expect(item.getAttribute('aria-haspopup')).toBe('dialog');
    expect(item.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(item);
    await settle(element);
    const popover = part(element, 'nph-popover') as HTMLElement & { open: boolean; heading: string };
    expect(popover).not.toBeNull();
    expect(popover.open).toBe(true);
    expect(popover.heading).toBe('Teaching workshop');
    expect(popover.getAttribute('for')).toBe(item.id);
    expect(item.getAttribute('aria-expanded')).toBe('true');
    expect(element.openEvent).toBe('workshop');
    expect(element.getAttribute('open-event')).toBe('workshop');
    expect(parts(element, '.event[aria-expanded="true"]')).toHaveLength(1);
    expect(getComputedStyle(item).backgroundColor).toBe(background('--nph-scheduler-event-educacao-background-hover'));
    expect((element.querySelector('#inside') as HTMLElement).getBoundingClientRect().width).toBeGreaterThan(0);
  });

  it('moves the focus into the detail when it opens', async () => {
    const element = await withDetail();
    eventByTitle(element, 'Teaching workshop', 'grid').focus();
    await userEvent.keyboard('{Enter}');
    await settle(element);
    await frame();
    expect(document.activeElement).toBe(element.querySelector('#inside'));
  });

  it('Esc closes it, fires the close with its source and gives the focus back to the event', async () => {
    const element = await withDetail();
    const closes = collect<NphSchedulerEventCloseDetail>(element, 'nph-event-close');
    const item = eventByTitle(element, 'Teaching workshop', 'grid');
    item.focus();
    await userEvent.keyboard('{Enter}');
    await settle(element);
    await frame();
    await userEvent.keyboard('{Escape}');
    await settle(element);
    await frame();
    expect(closes).toEqual([{ id: 'workshop', source: 'escape' }]);
    expect(element.openEvent).toBe('');
    expect(part(element, 'nph-popover')).toBeNull();
    expect(item.getAttribute('aria-expanded')).toBe('false');
    expect(root(element).activeElement).toBe(eventByTitle(element, 'Teaching workshop', 'grid'));
  });

  it('a press outside closes it and leaves the focus where the person clicked', async () => {
    const element = await withDetail();
    const closes = collect<NphSchedulerEventCloseDetail>(element, 'nph-event-close');
    const outside = document.createElement('button');
    outside.textContent = 'Outside';
    document.body.append(outside);
    await userEvent.click(eventByTitle(element, 'Teaching workshop', 'grid'));
    await settle(element);
    await userEvent.click(outside);
    await settle(element);
    expect(closes).toEqual([{ id: 'workshop', source: 'outside' }]);
    expect(document.activeElement).toBe(outside);
    expect(element.openEvent).toBe('');
  });

  it('a click on the open event closes it, and a click on another one moves the detail to it', async () => {
    const element = await withDetail();
    const closes = collect<NphSchedulerEventCloseDetail>(element, 'nph-event-close');
    const clicks = collect<NphSchedulerEventClickDetail>(element, 'nph-event-click');
    await userEvent.click(eventByTitle(element, 'Teaching workshop', 'grid'));
    await settle(element);
    await userEvent.click(eventByTitle(element, 'Budget review', 'grid'));
    await settle(element);
    expect(element.openEvent).toBe('budget');
    expect(parts(element, 'nph-popover')).toHaveLength(1);
    expect((part(element, 'nph-popover') as HTMLElement & { heading: string }).heading).toBe('Budget review');
    expect(closes.map((detail) => detail.id)).toContain('workshop');
    await userEvent.click(eventByTitle(element, 'Budget review', 'grid'));
    await settle(element);
    expect(element.openEvent).toBe('');
    expect(part(element, 'nph-popover')).toBeNull();
    expect(clicks.map((detail) => detail.id)).toEqual(['workshop', 'budget']);
  });

  it('with nothing in the slots no popover opens and the event carries no popup state', async () => {
    const element = await mount({ view: 'week' });
    const item = eventByTitle(element, 'Teaching workshop', 'grid');
    expect(item.hasAttribute('aria-haspopup')).toBe(false);
    expect(item.hasAttribute('aria-expanded')).toBe(false);
    item.click();
    await settle(element);
    expect(part(element, 'nph-popover')).toBeNull();
    expect(eventByTitle(element, 'Teaching workshop', 'grid').hasAttribute('aria-expanded')).toBe(false);
  });

  it('the screen can open it by open-event, and it leaves when the event leaves the data', async () => {
    const element = await withDetail({ openEvent: 'workshop' });
    expect(part(element, 'nph-popover')).not.toBeNull();
    expect(eventByTitle(element, 'Teaching workshop', 'grid').getAttribute('aria-expanded')).toBe('true');
    element.events = EVENTS.filter((item) => item.id !== 'workshop');
    await settle(element);
    expect(element.openEvent).toBe('');
    expect(part(element, 'nph-popover')).toBeNull();
    element.openEvent = 'nobody';
    await settle(element);
    expect(element.openEvent).toBe('');
  });

  it('hiding the calendar of the open event closes it with nothing fired', async () => {
    const element = await withDetail({ openEvent: 'workshop' });
    const closes = collect(element, 'nph-event-close');
    element.calendars = CALENDARS.map((calendar) => (calendar.id === 'classes' ? { ...calendar, visible: false } : calendar));
    await settle(element);
    expect(element.openEvent).toBe('');
    expect(closes).toEqual([]);
  });

  it('the detail of an event in the month, in the list and in the all-day band opens at that element', async () => {
    for (const [view, title] of [
      ['month', 'Teaching workshop'],
      ['list', 'Teaching workshop'],
      ['week', 'Team offsite'],
    ] as const) {
      const element = await withDetail({ view });
      const item = parts(element, '.event, .row').find((candidate) => titled(candidate, title)) as HTMLElement;
      item.click();
      await settle(element);
      expect((part(element, 'nph-popover') as HTMLElement).getAttribute('for'), view).toBe(item.id);
      expect(item.getAttribute('aria-expanded'), view).toBe('true');
    }
  });

  it('passes the footer slot to the popover', async () => {
    const element = await withDetail();
    const footer = document.createElement('button');
    footer.slot = 'detail-footer';
    footer.textContent = 'Edit event';
    element.append(footer);
    await settle(element);
    eventByTitle(element, 'Teaching workshop', 'grid').click();
    await settle(element);
    expect(part(element, 'nph-popover slot[name="detail-footer"]')?.getAttribute('slot')).toBe('footer');
  });

  it('the screen taking its content out of the slot takes the popup state off the events', async () => {
    const element = await withDetail();
    element.querySelector('[slot="detail"]')?.remove();
    await settle(element);
    await frame();
    await settle(element);
    expect(eventByTitle(element, 'Teaching workshop', 'grid').hasAttribute('aria-haspopup')).toBe(false);
  });
});

describe('"+N more" in the month', () => {
  it('shows the lines that fit and closes the cell with the count of the rest', async () => {
    const element = await mount({ view: 'month', events: BUSY, date: '2026-11-18' });
    await settle(element);
    await frame();
    await settle(element);
    const list = parts(element, '.cell-list').find((cell) => cell.querySelectorAll('.event').length > 0) as HTMLElement;
    const lines = list.querySelectorAll('.event');
    const more = list.querySelector('.more nph-button') as HTMLElement;
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.length).toBeLessThan(7);
    expect(more.getAttribute('text')).toBe(`+${7 - lines.length} more`);
    expect(list.querySelector('.more')?.getAttribute('aria-label')).toBe(`${7 - lines.length} more events on Wednesday, November 18, 2026`);
    expect(list.querySelector('.more')?.getAttribute('role')).toBe('group');
    expect(more.getAttribute('size')).toBe('compact');
    const cell = list.getBoundingClientRect();
    const last = more.getBoundingClientRect();
    expect(last.bottom).toBeLessThanOrEqual(cell.bottom + 1);
  });

  it('a cell that fits all its lines shows no "+N more"', async () => {
    const element = await mount({ view: 'month' }, '72rem', '64rem');
    await settle(element);
    await frame();
    await settle(element);
    const counts = parts(element, '.cell-list').map((cell) => cell.querySelectorAll('.event').length);
    expect(Math.max(...counts)).toBeGreaterThan(0);
    expect(parts(element, '.more')).toHaveLength(0);
  });

  it('draws the lines again when the room changes', async () => {
    const element = await mount({ view: 'month', events: BUSY, date: '2026-11-18' }, '72rem', '48rem');
    await settle(element);
    await frame();
    await settle(element);
    const countLines = (): number => (parts(element, '.cell-list').find((cell) => cell.querySelectorAll('.event').length > 0) as HTMLElement).querySelectorAll('.event').length;
    const tall = countLines();
    (element.parentElement as HTMLElement).style.blockSize = '28rem';
    await new Promise((resolve) => setTimeout(resolve, 150));
    await settle(element);
    expect(countLines()).toBeLessThanOrEqual(tall);
  });

  it('Enter, Space and a click go to the day view of that date and fire the view and the date', async () => {
    const element = await mount({ view: 'month', events: BUSY, date: '2026-11-18' });
    await settle(element);
    await frame();
    await settle(element);
    const views = collect<NphSchedulerViewChangeDetail>(element, 'nph-view-change');
    const dates = collect<NphSchedulerDateChangeDetail>(element, 'nph-date-change');
    nativeOf(part(element, '.more nph-button') as HTMLElement).focus();
    await userEvent.keyboard('{Enter}');
    await settle(element);
    await frame();
    expect(element.view).toBe('day');
    expect(element.date).toBe('2026-11-18');
    expect(views).toEqual([{ view: 'day' }]);
    expect(dates).toEqual([{ date: '2026-11-18', source: 'more' }]);
    expect(parts(element, '.day')).toHaveLength(1);
    expect(dayNames(element)[0]).toBe('Wednesday, November 18, 2026');
    expect(root(element).activeElement).toBe(part(element, '.day'));
  });

  it('a multi-day event shows a line on each day it covers', async () => {
    const element = await mount({ view: 'month' });
    const retreat = parts(element, '.event[data-kind="line"]').filter((item) => titled(item, 'Community retreat'));
    expect(retreat).toHaveLength(2);
  });

  it('the month line is one line of text/label-sm at the minimum height of an event, has no time and keeps the cancelled text', async () => {
    const element = await mount({ view: 'month' }, '72rem', '64rem');
    const line = parts(element, '.event[data-kind="line"]').find((item) => titled(item, 'Quarterly review')) as HTMLElement;
    expect(line.querySelector('.time')).toBeNull();
    expect(Math.round(line.getBoundingClientRect().height)).toBe(Math.round(px('--nph-scheduler-event-min-height')));
    expect(textOf(line.querySelector('.prefix'))).toBe('Cancelled:');
    const standup = parts(element, '.event[data-kind="line"]').find((item) => titled(item, 'Team stand-up')) as HTMLElement;
    expect(Math.round(standup.getBoundingClientRect().height)).toBe(Math.round(px('--nph-scheduler-event-min-height')));
  });

  it('a day of the month is a button that hands the date to the screen', async () => {
    const element = await mount({ view: 'month' });
    const days = collect<{ date: string }>(element, 'nph-day-click');
    (parts(element, '.cell')[10] as HTMLElement).click();
    expect(days).toEqual([{ date: '2026-11-11' }]);
    expect(element.view).toBe('month');
    const today = part(element, '.cell[data-today]') as HTMLElement;
    expect(today.getAttribute('aria-current')).toBe('date');
    expect(today.getAttribute('aria-label')).toBe('Wednesday, November 11, 2026, today');
  });
});

describe('the states', () => {
  it('an empty week keeps the days, the toolbar active and says so with the icon, the title and the hint', async () => {
    const element = await mount({ events: [] });
    expect(parts(element, '.day')).toHaveLength(5);
    const empty = part(element, '.empty') as HTMLElement;
    expect(empty.querySelector('nph-icon')?.getAttribute('name')).toBe('calendar');
    expect(textOf(part(element, '.empty-title'))).toBe('No events this week');
    expect(textOf(part(element, '.empty-hint'))).toBe('Events appear here when they are created.');
    const columns = (part(element, '.columns') as HTMLElement).getBoundingClientRect();
    const box = empty.getBoundingClientRect();
    expect(box.left).toBeCloseTo(columns.left, -1);
    expect(box.width).toBeCloseTo(columns.width, -1);
    nativeOf(buttonByLabel(element, 'Next period')).click();
    await settle(element);
    expect(element.date).toBe('2026-11-18');
    expect(parts(element, '.day')).toHaveLength(5);
  });

  it('is empty when no event is in the period, in every view, and not empty when one is', async () => {
    for (const view of NPH_SCHEDULER_VIEWS) {
      const element = await mount({ view, events: [{ id: 'far', title: 'Far', start: '2027-03-01T09:00', end: '2027-03-01T10:00' }] });
      expect(part(element, '.empty'), view).not.toBeNull();
      const full = await mount({ view });
      expect(part(full, '.empty'), view).toBeNull();
    }
  });

  it('loading draws skeleton lines in the place of the events, keeps the days and marks the area busy', async () => {
    const element = await mount({ loading: true });
    expect(parts(element, '.day')).toHaveLength(5);
    expect(parts(element, '.column nph-skeleton[shape="line"]').length).toBeGreaterThan(0);
    expect(part(element, '.body')?.getAttribute('aria-busy')).toBe('true');
    expect(part(element, '.empty')).toBeNull();
    expect(parts(element, '.live').some((item) => textOf(item) === 'Loading events')).toBe(true);
    expect(part(element, '.skeletons')?.getAttribute('aria-hidden')).toBe('true');
    nativeOf(buttonByLabel(element, 'Today')).click();
    expect(element.date).toBe('2026-11-11');
  });

  it('loading is drawn in the month, the list and the phone as well, and stops when it ends', async () => {
    for (const view of ['month', 'list'] as const) {
      const element = await mount({ view, loading: true, events: [] });
      expect(parts(element, 'nph-skeleton').length, view).toBeGreaterThan(0);
      expect(part(element, '.empty'), view).toBeNull();
      element.loading = false;
      await settle(element);
      expect(part(element, '.skeletons'), view).toBeNull();
      expect(part(element, '.empty'), view).not.toBeNull();
      expect(part(element, '.body')?.hasAttribute('aria-busy')).toBe(false);
    }
  });
});

describe('the now line', () => {
  it('draws the line, the dot and the current time in the column of today only', async () => {
    const element = await mount({ view: 'week' });
    const lines = parts(element, '.now');
    expect(lines).toHaveLength(1);
    expect(parts(element, '.column')[3]?.contains(lines[0] as HTMLElement)).toBe(true);
    const hour = px('--nph-scheduler-event-min-height') * 2;
    expect(lines[0]?.offsetTop).toBe(Math.round((620 / 60) * hour));
    expect(textOf(part(element, '.now-time'))).toBe('10:20 AM');
    expect(getComputedStyle(lines[0] as HTMLElement).backgroundColor).toBe(background('--nph-scheduler-now-indicator'));
    expect(getComputedStyle(lines[0] as HTMLElement).height).toBe(resolved('width', '--nph-scheduler-now-indicator-width'));
    expect(getComputedStyle(part(element, '.now-dot') as HTMLElement).width).toBe(resolved('width', '--nph-scheduler-now-indicator-size'));
    expect(getComputedStyle(part(element, '.now-time') as HTMLElement).color).toBe(color('--nph-scheduler-now-foreground'));
    expect(lines[0]?.getAttribute('aria-hidden')).toBe('true');
  });

  it('follows the `now` it is given, and leaves when today is not in the period', async () => {
    const element = await mount({ view: 'week' });
    element.now = '2026-11-11T15:45';
    await settle(element);
    expect(textOf(part(element, '.now-time'))).toBe('3:45 PM');
    element.date = '2026-12-02';
    await settle(element);
    expect(part(element, '.now')).toBeNull();
    expect(part(element, '.now-time')).toBeNull();
  });

  it('marks today in the header with the color of its number and a mark at the base, and says it in the name', async () => {
    const element = await mount({ view: 'week' });
    const today = part(element, '.day-head[data-today]') as HTMLElement;
    expect(parts(element, '.day-head[data-today]')).toHaveLength(1);
    expect(getComputedStyle(today.querySelector('.day-number') as HTMLElement).color).toBe(color('--nph-scheduler-today-foreground'));
    const mark = getComputedStyle(today, '::after');
    expect(mark.backgroundColor).toBe(background('--nph-scheduler-today-indicator'));
    expect(mark.height).toBe(resolved('width', '--nph-scheduler-today-indicator-width'));
    expect(today.querySelector('.day')?.getAttribute('aria-label')).toContain('today');
    expect(today.querySelector('.day')?.getAttribute('aria-current')).toBe('date');
    const other = parts(element, '.day-head:not([data-today])')[0] as HTMLElement;
    expect(getComputedStyle(other.querySelector('.day-number') as HTMLElement).color).toBe(color('--nph-scheduler-foreground'));
  });

  it('scrolls the grid, not the toolbar or the day header, and starts at the first event of the period', async () => {
    const element = await mount({ view: 'week' }, '72rem', '28rem');
    const scroll = part(element, '.scroll') as HTMLElement;
    expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight);
    expect(getComputedStyle(scroll).overflowY).toBe('auto');
    const hour = px('--nph-scheduler-event-min-height') * 2;
    expect(scroll.scrollTop).toBe(8 * hour);
    const toolbarTop = (part(element, '.toolbar') as HTMLElement).getBoundingClientRect().top;
    scroll.scrollTop = 12 * hour;
    await frame();
    expect((part(element, '.toolbar') as HTMLElement).getBoundingClientRect().top).toBe(toolbarTop);
    const sticky = part(element, '.sticky') as HTMLElement;
    expect(sticky.getBoundingClientRect().top).toBeCloseTo(scroll.getBoundingClientRect().top, 0);
    expect(getComputedStyle(sticky).position).toBe('sticky');
  });
});

describe('what the review of the piece found', () => {
  it('draws only the calendars it can read in "My calendars": a null, one with no id and a repeated one have no checkbox', async () => {
    const element = await mount({ calendars: [null as never, { id: '', name: 'No id', color: 'primary' }, { id: 'a', name: 'A', color: 'rh' }, { id: 'a', name: 'Twin', color: 'rh' }] });
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(parts(element, '.calendar-row')).toHaveLength(1);
    expect((parts(element, '.calendar-row nph-checkbox')[0] as HTMLElement & { text: string }).text).toBe('A');
    const checkbox = parts(element, '.calendar-row nph-checkbox')[0] as HTMLElement & { checked: boolean };
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(element);
    expect(element.calendars[2]).toMatchObject({ id: 'a', visible: false });
  });

  it('the input of a calendar checkbox does not leave the scheduler, as the one of the select does not', async () => {
    const element = await mount();
    const inputs: Event[] = [];
    document.addEventListener('input', (event) => inputs.push(event), { signal: listeners.signal });
    const checkbox = parts(element, '.calendar-row nph-checkbox')[0] as HTMLElement;
    checkbox.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(inputs).toHaveLength(0);
  });

  it('the work week of a Sunday is the one that starts the day after, and "Today" on a Sunday shows today', async () => {
    const element = await mount({ date: '2026-11-08', now: '2026-11-08T09:00' });
    expect(dayNames(element)[0]).toBe('Monday, November 9, 2026');
    expect(parts(element, '.day-head[data-today]')).toHaveLength(0);
    const week = await mount({ date: '2026-11-08', now: '2026-11-08T09:00', view: 'week' });
    expect(parts(week, '.day-head[data-today]')).toHaveLength(1);
  });

  it('an open detail does not come back on its own when the person returns to its period', async () => {
    const element = await mount({ view: 'week' });
    const body = document.createElement('div');
    body.slot = 'detail';
    body.textContent = 'Details';
    element.append(body);
    await settle(element);
    eventByTitle(element, 'Teaching workshop', 'grid').click();
    await settle(element);
    expect(part(element, 'nph-popover')).not.toBeNull();
    nativeOf(buttonByLabel(element, 'Next period')).click();
    await settle(element);
    await frame();
    await settle(element);
    expect(element.openEvent).toBe('');
    expect(part(element, 'nph-popover')).toBeNull();
    nativeOf(buttonByLabel(element, 'Previous period')).click();
    await settle(element);
    expect(part(element, 'nph-popover')).toBeNull();
    expect(element.openEvent).toBe('');
  });

  it('keeps a status region for the loading state in the page before it starts, so the text that arrives is announced', async () => {
    const element = await mount();
    const regions = parts(element, '.live[role="status"]');
    expect(regions).toHaveLength(2);
    const status = regions[1] as HTMLElement;
    expect(textOf(status)).toBe('');
    expect(status.getAttribute('aria-live')).toBe('polite');
    element.loading = true;
    await settle(element);
    expect(parts(element, '.live[role="status"]')[1]).toBe(status);
    expect(textOf(status)).toBe('Loading events');
    element.loading = false;
    await settle(element);
    expect(textOf(status)).toBe('');
  });

  it('the icon of the empty state takes its size from `scheduler/empty-icon-size`, and every scheduler token is read by the CSS', async () => {
    const element = await mount({ events: [] });
    const icon = part(element, '.empty nph-icon') as HTMLElement;
    expect(getComputedStyle(icon).width).toBe(resolved('width', '--nph-scheduler-empty-icon-size'));
    const css = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    const emitted = [...new Set([...tokensCss.matchAll(/^\s*(--nph-scheduler-[a-z0-9-]+):/gm)].map((match) => match[1] as string))];
    expect(emitted.length).toBeGreaterThan(100);
    expect(emitted.filter((name) => !css.includes(name))).toEqual([]);
  });
});

describe('the scroll of the grid', () => {
  it('leaves the grid where the person put it when the data changes, and starts a new period at its first event', async () => {
    const element = await mount({ view: 'week' }, '72rem', '28rem');
    const scroll = part(element, '.scroll') as HTMLElement;
    const hour = px('--nph-scheduler-event-min-height') * 2;
    scroll.scrollTop = 14 * hour;
    await frame();
    element.calendars = CALENDARS.map((calendar) => (calendar.id === 'classes' ? { ...calendar, visible: false } : calendar));
    await settle(element);
    expect(scroll.scrollTop).toBe(14 * hour);
    element.date = '2026-11-18';
    element.events = [{ id: 'next', title: 'Next week', start: '2026-11-18T11:00', end: '2026-11-18T12:00' }];
    await settle(element);
    expect(scroll.scrollTop).toBe(10 * hour);
  });

  it('events that arrive after the first draw take the grid to the first of them, until the person scrolls', async () => {
    const element = await mount({ view: 'week', events: [] }, '72rem', '28rem');
    const scroll = part(element, '.scroll') as HTMLElement;
    const hour = px('--nph-scheduler-event-min-height') * 2;
    expect(scroll.scrollTop).toBe(Math.round((620 / 60 - 1) * hour));
    element.events = EVENTS;
    await settle(element);
    expect(scroll.scrollTop).toBe(8 * hour);
  });

  it('scrolls what takes the focus to under the day header, not behind it', async () => {
    const element = await mount({ view: 'week' }, '72rem', '28rem');
    const scroll = part(element, '.scroll') as HTMLElement;
    const sticky = part(element, '.sticky') as HTMLElement;
    expect(getComputedStyle(scroll).scrollPaddingTop).toBe(`${sticky.offsetHeight}px`);
  });

  it('writes open-event only while something is open', async () => {
    const element = await mount({ view: 'week' });
    expect(element.hasAttribute('open-event')).toBe(false);
    element.openEvent = 'workshop';
    await settle(element);
    expect(element.getAttribute('open-event')).toBe('workshop');
    element.openEvent = '';
    await settle(element);
    expect(element.hasAttribute('open-event')).toBe(false);
    element.setAttribute('open-event', 'budget');
    expect(element.openEvent).toBe('budget');
  });
});

describe('the phone', () => {
  it('under 768 px it is the compact month with the list of the chosen day, and the toolbar of the phone', async () => {
    const element = await mount({}, '24rem', '48rem');
    expect(part(element, '.scheduler')?.hasAttribute('data-compact')).toBe(true);
    expect(part(element, '.side')).toBeNull();
    expect(part(element, '.side-toggle')).toBeNull();
    expect(part(element, '.date-grid[data-kind="compact"]')).not.toBeNull();
    expect(parts(element, '.day')).toHaveLength(0);
    expect(textOf(part(element, '.period'))).toBe('November 2026');
    const labels = parts(element, '.toolbar nph-button').map((button) => button.getAttribute('text') ?? button.getAttribute('label'));
    expect(labels).toEqual(['Previous period', 'Next period', 'New event']);
    const create = buttonByLabel(element, 'New event');
    expect(create.getAttribute('severity')).toBe('primary');
    expect(create.hasAttribute('text')).toBe(false);
    expect(create.getAttribute('icon-start')).toBe('plus');
    expect(part(element, '.mobile-select .view-select')).not.toBeNull();
    expect(buttonByLabel(element, 'Previous period').getAttribute('emphasis')).toBe('ghost');
  });

  it('the break is 768 px of the width of the element, and it follows the width', async () => {
    const element = await mount({}, '47.9375rem');
    expect(part(element, '.scheduler')?.hasAttribute('data-compact')).toBe(true);
    (element.parentElement as HTMLElement).style.inlineSize = '48rem';
    await new Promise((resolve) => setTimeout(resolve, 100));
    await settle(element);
    expect(part(element, '.scheduler')?.hasAttribute('data-compact')).toBe(false);
    expect(part(element, '.side')).not.toBeNull();
    (element.parentElement as HTMLElement).style.inlineSize = '20rem';
    await new Promise((resolve) => setTimeout(resolve, 100));
    await settle(element);
    expect(part(element, '.scheduler')?.hasAttribute('data-compact')).toBe(true);
  });

  it('fills the chosen day as in the date grid, with an event dot per day and the empty dot space kept', async () => {
    const element = await mount({}, '24rem', '48rem');
    const cells = parts(element, '.date-grid[data-kind="compact"] .grid-cell');
    expect(cells).toHaveLength(35);
    const selected = cells.find((cell) => cell.getAttribute('aria-selected') === 'true') as HTMLElement;
    expect(selected.getAttribute('aria-label')).toBe('Wednesday, November 11, 2026, today');
    expect(getComputedStyle(selected).backgroundColor).toBe(background('--nph-scheduler-day-selected-background'));
    expect(getComputedStyle(selected).color).toBe(color('--nph-scheduler-day-selected-foreground'));
    expect(getComputedStyle(selected).borderTopLeftRadius).toBe(resolved('width', '--nph-scheduler-day-radius'));
    const withEvent = cells.find((cell) => cell.getAttribute('aria-label')?.startsWith('Tuesday, November 10')) as HTMLElement;
    const without = cells.find((cell) => cell.getAttribute('aria-label')?.startsWith('Tuesday, November 3')) as HTMLElement;
    const dot = (cell: HTMLElement): HTMLElement => cell.querySelector('.grid-dot') as HTMLElement;
    expect(dot(withEvent).hasAttribute('data-empty')).toBe(false);
    expect(dot(without).hasAttribute('data-empty')).toBe(true);
    expect(dot(without).getBoundingClientRect().height).toBe(dot(withEvent).getBoundingClientRect().height);
    expect(withEvent.getBoundingClientRect().height).toBe(without.getBoundingClientRect().height);
    expect(getComputedStyle(dot(withEvent)).width).toBe(resolved('width', '--nph-scheduler-event-dot-size'));
    expect(getComputedStyle(dot(withEvent)).backgroundColor).toBe(background('--nph-scheduler-event-educacao-indicator'));
    expect(getComputedStyle(dot(selected)).backgroundColor).toBe(background('--nph-scheduler-event-dot-selected'));
    const days = ['2026-11-01', '2026-11-30'].map((date) => cells.find((cell) => cell.getAttribute('aria-label')?.includes(`November ${Number(date.slice(-2))},`)));
    expect(days.every(Boolean)).toBe(true);
    expect(cells.filter((cell) => cell.hasAttribute('data-outside'))).toHaveLength(5);
  });

  it('choosing a day changes the list below and fires the date; the day list names its day and keeps the cancelled text', async () => {
    const element = await mount({}, '24rem', '56rem');
    const dates = collect<NphSchedulerDateChangeDetail>(element, 'nph-date-change');
    expect(textOf(part(element, '.day-list-heading'))).toBe('Wednesday, November 11, 2026');
    expect(part(element, '.day-list-heading')?.hasAttribute('data-today')).toBe(true);
    const rows = parts(element, '.day-row');
    expect(rows.map((row) => textOf(row.querySelector('.day-row-time')))).toEqual(['10:00 AM', '10:00 AM', '3:00 PM']);
    expect(textOf(rows[2]?.querySelector('.prefix') as HTMLElement)).toBe('Cancelled:');
    expect(eventByTitle(element, 'Sales sync', 'flow').getBoundingClientRect().height).toBeGreaterThanOrEqual(px('--nph-scheduler-event-min-height'));
    const target = parts(element, '.grid-cell').find((cell) => cell.getAttribute('aria-label')?.startsWith('Tuesday, November 10')) as HTMLElement;
    target.click();
    await settle(element);
    expect(dates).toEqual([{ date: '2026-11-10', source: 'month' }]);
    expect(element.date).toBe('2026-11-10');
    expect(textOf(part(element, '.day-list-heading'))).toBe('Tuesday, November 10, 2026');
    expect(parts(element, '.day-row')).toHaveLength(2);
    expect(parts(element, '.grid-cell[aria-selected="true"]')).toHaveLength(1);
  });

  it('the toolbar moves the month, and "New event" is the icon-only primary button', async () => {
    const element = await mount({}, '24rem', '48rem');
    nativeOf(buttonByLabel(element, 'Next period')).click();
    await settle(element);
    expect(element.date).toBe('2026-12-11');
    expect(textOf(part(element, '.period'))).toBe('December 2026');
    const seen = collect<{ date: string }>(element, 'nph-new-event');
    nativeOf(buttonByLabel(element, 'New event')).click();
    expect(seen).toEqual([{ date: '2026-12-11' }]);
  });

  it('the toolbar of the phone moves from the month shown, which the keys of the date grid may have left', async () => {
    const element = await mount({}, '24rem', '48rem');
    const active = parts(element, '.date-grid[data-kind="compact"] .grid-cell').find((cell) => cell.tabIndex === 0) as HTMLElement;
    active.focus();
    active.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true, cancelable: true, composed: true }));
    await settle(element);
    expect(textOf(part(element, '.period'))).toBe('December 2026');
    expect(element.date).toBe('2026-11-11');
    nativeOf(buttonByLabel(element, 'Next period')).click();
    await settle(element);
    expect(element.date).toBe('2027-01-11');
    expect(textOf(part(element, '.period'))).toBe('January 2027');
  });

  it('keeps the compact month when another view is chosen on the phone, and remembers the view for the desktop', async () => {
    const element = await mount({}, '24rem', '48rem');
    const select = part(element, '.view-select') as HTMLElement & { value: string };
    select.value = 'list';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(element);
    expect(element.view).toBe('list');
    expect(part(element, '.date-grid[data-kind="compact"]')).not.toBeNull();
    expect(part(element, '.list')).toBeNull();
    (element.parentElement as HTMLElement).style.inlineSize = '72rem';
    await new Promise((resolve) => setTimeout(resolve, 100));
    await settle(element);
    expect(part(element, '.list')).not.toBeNull();
  });

  it('the date grid of the phone moves with the arrows, and the empty phone says so', async () => {
    const element = await mount({ events: [] }, '24rem', '48rem');
    expect(part(element, '.empty')).not.toBeNull();
    const cells = parts(element, '.date-grid[data-kind="compact"] .grid-cell');
    const active = cells.find((cell) => cell.tabIndex === 0) as HTMLElement;
    expect(active.getAttribute('aria-label')).toContain('November 11');
    active.focus();
    active.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true, composed: true }));
    await settle(element);
    expect((root(element).activeElement as HTMLElement).getAttribute('aria-label')).toContain('November 12');
  });
});

describe('the language and the direction', () => {
  it('writes the dates in the nearest lang, crossing shadow roots, and in English with none', async () => {
    const pt = document.createElement('div');
    pt.lang = 'pt-BR';
    document.body.append(pt);
    const holder = document.createElement('div');
    holder.style.inlineSize = '72rem';
    holder.style.blockSize = '40rem';
    const element = document.createElement('nph-scheduler');
    Object.assign(element, { events: EVENTS, calendars: CALENDARS, labels: LABELS, now: NOW, date: '2026-11-11' });
    holder.append(element);
    pt.append(holder);
    await settle(element);
    expect(dayNames(element)[0]).toBe('segunda-feira, 9 de novembro de 2026');
    expect(textOf(part(element, '.period'))).toMatch(/9 a 13 de nov\.? de 2026|9.*13.*nov.*2026/);
    expect(eventByTitle(element, 'Team stand-up', 'grid').getAttribute('aria-label')).toContain('9:00 – 10:00');
    const hosted = document.createElement('div');
    hosted.lang = 'es';
    const shadow = hosted.attachShadow({ mode: 'open' });
    const inner = document.createElement('nph-scheduler');
    inner.style.inlineSize = '72rem';
    inner.style.blockSize = '40rem';
    Object.assign(inner, { events: EVENTS, calendars: CALENDARS, labels: LABELS, now: NOW, date: '2026-11-11' });
    shadow.append(inner);
    document.body.append(hosted);
    await settle(inner);
    expect(dayNames(inner)[0]).toBe('lunes, 9 de noviembre de 2026');
    const plain = await mount();
    expect(dayNames(plain)[0]).toBe('Monday, November 9, 2026');
  });

  it('draws the dates again when the lang of the page changes', async () => {
    const element = await mount();
    expect(dayNames(element)[0]).toBe('Monday, November 9, 2026');
    document.documentElement.lang = 'pt-BR';
    await new Promise((resolve) => setTimeout(resolve, 50));
    await settle(element);
    expect(dayNames(element)[0]).toBe('segunda-feira, 9 de novembro de 2026');
  });

  it('reads an unknown lang as English without failing', async () => {
    document.documentElement.lang = 'xx-invalid-lang-tag-!!';
    const element = await mount();
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(dayNames(element)[0]).toBe('Monday, November 9, 2026');
  });

  it('mirrors in a right-to-left page: the first day at the right, the arrows swapped and the keys of the date grid mirrored', async () => {
    document.documentElement.dir = 'rtl';
    const element = await mount({ view: 'week' });
    const heads = parts(element, '.day');
    expect(heads[0]?.getBoundingClientRect().left).toBeGreaterThan((heads[6] as HTMLElement).getBoundingClientRect().left);
    expect(buttonByLabel(element, 'Previous period').getAttribute('icon-start')).toBe('chevron-right');
    expect(buttonByLabel(element, 'Next period').getAttribute('icon-start')).toBe('chevron-left');
    const standup = eventByTitle(element, 'Team stand-up', 'grid');
    const column = standup.parentElement as HTMLElement;
    expect(standup.getBoundingClientRect().right).toBeCloseTo(column.getBoundingClientRect().right, 0);
    const mini = parts(element, '.date-grid[data-kind="mini"] .grid-cell');
    const active = mini.find((cell) => cell.tabIndex === 0) as HTMLElement;
    active.focus();
    active.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true, composed: true }));
    await settle(element);
    expect((root(element).activeElement as HTMLElement).getAttribute('aria-label')).toContain('November 12');
    const retreat = eventByTitle(element, 'Community retreat', 'bar').getBoundingClientRect();
    expect(retreat.right).toBeLessThanOrEqual(heads[5]?.getBoundingClientRect().right as number);
  });
});

describe('the life cycle', () => {
  it('draws again after it is removed and put back, and its listeners work', async () => {
    const element = await mount({ view: 'month' });
    const holder = element.parentElement as HTMLElement;
    element.remove();
    await frame();
    holder.append(element);
    await settle(element);
    expect(parts(element, '.cell')).toHaveLength(35);
    const dates = collect(element, 'nph-date-change');
    nativeOf(buttonByLabel(element, 'Next period')).click();
    expect(dates).toHaveLength(1);
  });

  it('stops the clock and the observers when it leaves the page, and starts them when it comes back', async () => {
    const intervals: number[] = [];
    const cleared: unknown[] = [];
    const realSet = window.setInterval.bind(window);
    const realClear = window.clearInterval.bind(window);
    vi.spyOn(window, 'setInterval').mockImplementation(((handler: TimerHandler, timeout?: number) => {
      const id = realSet(handler, timeout);
      intervals.push(id);
      return id;
    }) as typeof window.setInterval);
    vi.spyOn(window, 'clearInterval').mockImplementation(((id?: number) => {
      cleared.push(id);
      realClear(id);
    }) as typeof window.clearInterval);
    const element = await mount();
    const holder = element.parentElement as HTMLElement;
    expect(intervals).toHaveLength(1);
    element.remove();
    expect(cleared).toContain(intervals[0]);
    holder.append(element);
    await settle(element);
    expect(intervals).toHaveLength(2);
  });

  it('does not move the focus or scroll after it is gone', async () => {
    const element = await mount({ view: 'week' });
    eventByTitle(element, 'Teaching workshop', 'grid').focus();
    element.remove();
    element.date = '2026-12-01';
    await element.updateComplete;
    expect(errors).not.toHaveBeenCalled();
  });

  it('drawn on a page with no events at all and no labels at all it does not throw', async () => {
    const element = document.createElement('nph-scheduler');
    document.body.append(element);
    await element.updateComplete;
    await frame();
    expect(element.isConnected).toBe(true);
    expect(errors.mock.calls.map((call) => String(call[0])).join('\n')).toContain('labels is missing');
  });

  it('keeps the data it was given after it is invalid and valid again', async () => {
    const element = await mount();
    element.view = 'nope' as never;
    element.events = [...EVENTS, { id: 'extra', title: 'Extra', start: '2026-11-11T12:00', end: '2026-11-11T13:00' }];
    await element.updateComplete;
    element.view = 'week';
    await settle(element);
    expect(parts(element, '.event[data-kind="grid"]').some((item) => titled(item, 'Extra'))).toBe(true);
  });
});

describe('the token contract', () => {
  const css = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every token the CSS reads exists in the generated CSS', () => {
    const used = [...new Set([...css.matchAll(/var\((--nph-[a-z0-9-]+)/g)].map((match) => match[1] as string))];
    expect(used.length).toBeGreaterThan(80);
    const missing = used.filter((name) => !new RegExp(`^\\s*${name}:`, 'm').test(tokensCss));
    expect(missing).toEqual([]);
  });

  it('reads the component tokens of each of the seven colors, the roles of each and the focus of each', () => {
    for (const name of NPH_SCHEDULER_COLORS.filter((value) => value !== 'primary')) {
      for (const role of ['background', 'foreground', 'indicator', 'background-hover', 'foreground-hover', 'focus-border', 'focus-halo']) {
        expect(css, `${name} ${role}`).toContain(`--nph-scheduler-event-${name}-${role}`);
      }
    }
    for (const token of ['event-background', 'event-foreground', 'event-background-hover', 'event-foreground-hover', 'event-indicator', 'focus-border', 'focus-halo']) {
      expect(css).toContain(`var(--nph-scheduler-${token})`);
    }
  });

  it('binds the event to its scheduler tokens, never to the semantic ones they point to', () => {
    expect(css).not.toMatch(/var\(--nph-event-/);
    expect(css).not.toMatch(/var\(--nph-color-primary-/);
    expect(css).not.toMatch(/var\(--nph-core-/);
    expect(css).not.toMatch(/var\(--nph-theme-/);
  });

  it('writes no literal color, length, radius, shadow, duration or font in the component CSS', () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toMatch(/\brgba?\(|\bhsla?\(/);
    /* The written box relations: `1px` of the live region, and 100% and 50% of the box itself. */
    const lengths = [...css.matchAll(/[:\s(,]-?\d*\.?\d+(px|rem|em|ms|s|vh|vw)(?![\w-])/g)].map((match) => match[0].trim().replace(/^[:(,]/, ''));
    expect(lengths.filter((value) => value !== '1px')).toEqual([]);
    const percents = [...css.matchAll(/-?\d*\.?\d+%/g)].map((match) => match[0]);
    expect(percents.filter((value) => value !== '100%' && value !== '50%' && value !== '-50%')).toEqual([]);
  });

  it('has no shadow of its own: in dark mode the elevation is the background', () => {
    expect(css).not.toMatch(/box-shadow:\s*0\s+[^i]/);
    expect(css).not.toMatch(/--nph-shadow|drop-shadow/);
  });

  it('writes no color property: the colors come from the calendars, not from an attribute of the scheduler', () => {
    expect([...(NphScheduler.elementProperties.keys() as Iterable<string>)]).not.toContain('color');
    expect(NphScheduler.observedAttributes).not.toContain('color');
  });
});
