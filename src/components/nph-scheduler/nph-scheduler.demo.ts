/**
 * Demonstration frame shared by the `nph-scheduler` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the framed figure, the height the scheduler is given, the fixed instant that stands
 * for "now" — is NOT a precedent for component CSS: the piece takes its measures from the
 * `scheduler/*` tokens.
 *
 * The examples are the required ones of the accepted documentation (frame `6151:11160`): the work week
 * with the side panel, the month on mobile with the list of the day, the empty week with the toolbar
 * active, the list view, the open event with the popover and the "+N more" in default, hover and focus,
 * and the focus and the states of the event. Every visible text, the names of the calendars, the titles
 * of the events and the names of the people included, comes from the dictionary, passed in by the page
 * that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-scheduler';
import type { NphSchedulerCalendar, NphSchedulerEvent, NphSchedulerFilterItem, NphSchedulerLabels, NphSchedulerView } from './nph-scheduler';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `schedulerValidation` dictionary. */
export interface ExampleTexts extends NphSchedulerLabels {
  lightCaption: string;
  darkCaption: string;
  calendarTeam: string;
  calendarClasses: string;
  calendarCommunity: string;
  calendarFinance: string;
  calendarPeople: string;
  calendarSystems: string;
  calendarManagement: string;
  calendarSales: string;
  eventStandup: string;
  eventCoffee: string;
  eventWorkshop: string;
  eventBudget: string;
  eventPlanning: string;
  eventArchitecture: string;
  eventSales: string;
  eventCancelled: string;
  eventOffsite: string;
  eventInterview: string;
  eventRetreat: string;
  eventDemo: string;
  eventLong: string;
  eventBusy: string;
  personAna: string;
  personBruno: string;
  personCarla: string;
  personDiego: string;
  personElisa: string;
  filterCalendars: string;
  filterMine: string;
  filterTeam: string;
  detailTitle: string;
  detailText: string;
  detailClose: string;
  detailAction: string;
}

/** The instant that stands for "now" in every page: Wednesday, 2026-11-11, ten twenty in the morning. */
export const NOW = '2026-11-11T10:20';

/** The height the scheduler is given in a page, so the grid scrolls inside it. */
export const SCHEDULER_HEIGHT = '40rem';

/**
 * The least width a page gives the scheduler: in a table cell, which is as wide as its content, a block
 * with no width would collapse. Not a precedent: the scheduler takes the width the screen gives it.
 */
export const MIN_WIDTH = '20rem';

/** A width under the 768 px of the compact month. */
export const PHONE_WIDTH = '24rem';

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, one under the other. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

/**
 * Rows of a Validation page: each scheduler under the attributes that name it. A stack of figures, not a
 * table, so every scheduler gets the width of the page. Not a precedent for component CSS.
 */
export function labelled(rows: readonly { label: string; content: TemplateResult }[]): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
    ${rows.map(
      (row) => html`<figure style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline);">
        <figcaption style="color: var(--nph-color-muted-foreground); font-family: var(--nph-text-code-font-family); font-size: var(--nph-text-code-font-size);">${row.label}</figcaption>
        ${row.content}
      </figure>`,
    )}
  </div>`;
}

/** The labels, from the dictionary. */
export function labelsOf(texts: ExampleTexts): NphSchedulerLabels {
  return {
    today: texts.today,
    previous: texts.previous,
    next: texts.next,
    newEvent: texts.newEvent,
    filter: texts.filter,
    sidePanel: texts.sidePanel,
    view: texts.view,
    viewWorkWeek: texts.viewWorkWeek,
    viewWeek: texts.viewWeek,
    viewDay: texts.viewDay,
    viewMonth: texts.viewMonth,
    viewList: texts.viewList,
    allDay: texts.allDay,
    cancelled: texts.cancelled,
    cancelledName: texts.cancelledName,
    repeats: texts.repeats,
    more: texts.more,
    moreName: texts.moreName,
    myCalendars: texts.myCalendars,
    miniPrevious: texts.miniPrevious,
    miniNext: texts.miniNext,
    emptyTitle: texts.emptyTitle,
    emptyHint: texts.emptyHint,
    loading: texts.loading,
    todayName: texts.todayName,
  };
}

/** Eight calendars: `primary` and the seven vertical colors, one each. */
export function calendarsOf(texts: ExampleTexts): NphSchedulerCalendar[] {
  return [
    { id: 'team', name: texts.calendarTeam, color: 'primary' },
    { id: 'classes', name: texts.calendarClasses, color: 'educacao' },
    { id: 'community', name: texts.calendarCommunity, color: 'igrejas' },
    { id: 'finance', name: texts.calendarFinance, color: 'financeiro' },
    { id: 'people', name: texts.calendarPeople, color: 'rh' },
    { id: 'systems', name: texts.calendarSystems, color: 'sistemas' },
    { id: 'management', name: texts.calendarManagement, color: 'gerencial' },
    { id: 'sales', name: texts.calendarSales, color: 'comercial' },
  ];
}

/** The people of the meetings, with no photo: the avatar draws the person icon. */
function people(texts: ExampleTexts, count: number): { name: string }[] {
  return [texts.personAna, texts.personBruno, texts.personCarla, texts.personDiego, texts.personElisa].slice(0, count).map((name) => ({ name }));
}

/** The week of the instant (2026-11-08 to 2026-11-14): every kind of event and every state. */
export function eventsOf(texts: ExampleTexts): NphSchedulerEvent[] {
  return [
    { id: 'standup', title: texts.eventStandup, start: '2026-11-09T09:00', end: '2026-11-09T10:00', calendar: 'team', recurring: true, people: people(texts, 3) },
    { id: 'coffee', title: texts.eventCoffee, start: '2026-11-09T10:00', end: '2026-11-09T10:30', calendar: 'people' },
    { id: 'workshop', title: texts.eventWorkshop, start: '2026-11-10T13:00', end: '2026-11-10T16:00', calendar: 'classes' },
    { id: 'budget', title: texts.eventBudget, start: '2026-11-10T14:00', end: '2026-11-10T15:00', calendar: 'finance', people: people(texts, 2) },
    { id: 'planning', title: texts.eventPlanning, start: '2026-11-11T08:00', end: '2026-11-11T09:00', calendar: 'community' },
    { id: 'architecture', title: texts.eventArchitecture, start: '2026-11-11T10:00', end: '2026-11-11T11:00', calendar: 'systems', people: people(texts, 5) },
    { id: 'sales', title: texts.eventSales, start: '2026-11-11T10:00', end: '2026-11-11T11:30', calendar: 'sales' },
    { id: 'cancelled', title: texts.eventCancelled, start: '2026-11-11T15:00', end: '2026-11-11T16:00', calendar: 'management', cancelled: true },
    { id: 'offsite', title: texts.eventOffsite, start: '2026-11-12', allDay: true, calendar: 'team' },
    { id: 'interview', title: texts.eventInterview, start: '2026-11-12T09:00', end: '2026-11-12T10:00', calendar: 'people', people: people(texts, 1) },
    { id: 'retreat', title: texts.eventRetreat, start: '2026-11-13', end: '2026-11-14', allDay: true, calendar: 'community' },
    { id: 'demo', title: texts.eventDemo, start: '2026-11-13T11:00', end: '2026-11-13T12:00', calendar: 'team' },
    { id: 'long', title: texts.eventLong, start: '2026-11-12T14:00', end: '2026-11-12T15:00', calendar: 'systems' },
  ];
}

/** A day with more events than a month cell holds: "+N more" closes the cell. */
export function busyEventsOf(texts: ExampleTexts): NphSchedulerEvent[] {
  const calendars = ['team', 'classes', 'community', 'finance', 'people', 'systems'];
  const busy = calendars.map((calendar, index): NphSchedulerEvent => ({
    id: `busy-${index}`,
    title: texts.eventBusy,
    start: `2026-11-18T${String(8 + index).padStart(2, '0')}:00`,
    end: `2026-11-18T${String(9 + index).padStart(2, '0')}:00`,
    calendar,
  }));
  return [...eventsOf(texts), ...busy];
}

/** The items of the "Filter" menu. */
export function filterItemsOf(texts: ExampleTexts): NphSchedulerFilterItem[] {
  return [
    { type: 'label', text: texts.filterCalendars },
    { value: 'mine', text: texts.filterMine, selection: 'multiple', checked: true },
    { value: 'team', text: texts.filterTeam, selection: 'multiple', checked: false },
  ];
}

export interface SchedulerOptions {
  events?: NphSchedulerEvent[];
  view?: NphSchedulerView;
  date?: string;
  weekStart?: 'sunday' | 'monday';
  hideSidePanel?: boolean;
  loading?: boolean;
  now?: string;
  filter?: boolean;
  /** The width of the frame, to force the compact month. */
  width?: string;
  height?: string;
  /** Puts the demonstration detail in the slots and opens it on this event. */
  openEvent?: string;
}

/** A scheduler with every text the page owes it, at the size asked for. */
export function scheduler(texts: ExampleTexts, options: SchedulerOptions = {}): TemplateResult {
  const {
    events = eventsOf(texts),
    view = 'work-week',
    date = '2026-11-11',
    weekStart = 'sunday',
    hideSidePanel = false,
    loading = false,
    now = NOW,
    filter = true,
    width = '100%',
    height = SCHEDULER_HEIGHT,
    openEvent = '',
  } = options;
  return html`<div style="inline-size: ${width}; min-inline-size: ${MIN_WIDTH}; max-inline-size: 100%; block-size: ${height};">
    <nph-scheduler
      .events=${events}
      .calendars=${calendarsOf(texts)}
      .labels=${labelsOf(texts)}
      .filterItems=${filter ? filterItemsOf(texts) : []}
      view=${view}
      date=${date}
      week-start=${weekStart}
      now=${now}
      open-event=${openEvent}
      ?hide-side-panel=${hideSidePanel}
      ?loading=${loading}
    >
      ${openEvent === ''
        ? ''
        : html`<div slot="detail"><p style="margin: 0;">${texts.detailText}</p></div>
            <nph-button slot="detail-footer" severity="secondary" emphasis="solid" size="compact" text=${texts.detailAction}></nph-button>`}
    </nph-scheduler>
  </div>`;
}

/** The first required example: the work week with the side panel. */
export function workWeekExample(texts: ExampleTexts): TemplateResult {
  return scheduler(texts);
}

/** The second required example: the month on mobile, with the list of the day. */
export function phoneExample(texts: ExampleTexts): TemplateResult {
  return scheduler(texts, { view: 'month', width: PHONE_WIDTH, height: '48rem', filter: false });
}

/** The third required example: the empty week with the toolbar active. */
export function emptyExample(texts: ExampleTexts): TemplateResult {
  return scheduler(texts, { events: [] });
}

/** The fourth required example: the list view. */
export function listExample(texts: ExampleTexts): TemplateResult {
  return scheduler(texts, { view: 'list' });
}

/** The fifth required example: the open event with the popover, and the month with "+N more". */
export function openExample(texts: ExampleTexts): TemplateResult {
  return scheduler(texts, { openEvent: 'workshop', date: '2026-11-10' });
}

export function moreExample(texts: ExampleTexts): TemplateResult {
  return scheduler(texts, { view: 'month', events: busyEventsOf(texts), date: '2026-11-18' });
}

/** The required examples, one under the other, in the frame of a scheme. */
export function examples(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
    ${workWeekExample(texts)} ${phoneExample(texts)} ${emptyExample(texts)} ${listExample(texts)} ${moreExample(texts)}
  </div>`;
}
