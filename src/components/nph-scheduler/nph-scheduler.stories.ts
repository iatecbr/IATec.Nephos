/**
 * VALIDATION stories of `nph-scheduler`.
 *
 * They prove the contract accepted in Figma (documentation frame `6151:11160`, sets `6142:1744` and
 * `6141:9258`) and P120: the five views and the side panel; the event in its eight colors, its types and
 * its states, the cancelled event included; the empty and loading states with the toolbar active; the
 * month with "+N more"; the compact month of the phone with the list of the day; the open event with the
 * popover; the focus of the day and of the event; and the five required examples in light and dark mode,
 * in the same story. Each page opens with what it proves, and each row is named by its attributes, as a
 * stack of figures: a table cell is as wide as its content, and a calendar clipped by the scroll of a
 * table would not be a fair frame for its touch targets. All visible text, including the titles of the events and the names of the people,
 * comes from the language dictionary, under the `schedulerValidation` and `validationPages` keys
 * (`docs/i18n.md`, "Storybook").
 *
 * Hover and focus are interaction states: they show up by moving the mouse over an event and by
 * pressing Tab, and the tests prove their colors, borders and rings. `Focus` moves the keyboard focus
 * itself, so the page shows it.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-scheduler';
import { PHONE_WIDTH, SCHEDULER_HEIGHT, bothModes, busyEventsOf, examples, labelled, scheduler } from './nph-scheduler.demo';
import type { ExampleTexts } from './nph-scheduler.demo';

const meta: Meta = {
  title: 'Components/nph-scheduler/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).schedulerValidation as unknown as ExampleTexts & Record<string, unknown>;
}

const page = (storyId: string) => ({ piece: 'nph-scheduler', storyId: `components-nph-scheduler-validation--${storyId}` });

/** The work week, the default view, with the side panel, the now line, the all-day band and overlapping events. */
export const WorkWeek: Story = {
  name: 'Work week',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(context, page('work-week'), scheduler(v));
  },
};

/** The week, the day, the month and the list views, and the week that starts on Monday. */
export const Views: Story = {
  name: 'Views',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('views'),
      labelled([
        { label: 'view: week', content: scheduler(v, { view: 'week' }) },
        { label: 'view: week · week-start: monday', content: scheduler(v, { view: 'week', weekStart: 'monday' }) },
        { label: 'view: day', content: scheduler(v, { view: 'day' }) },
        { label: 'view: month', content: scheduler(v, { view: 'month' }) },
        { label: 'view: list', content: scheduler(v, { view: 'list' }) },
      ]),
    );
  },
};

/** The side panel in every desktop view, shown and hidden by the same button. */
export const SidePanel: Story = {
  name: 'Side panel',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('side-panel'),
      labelled([
        { label: 'view: work-week · side panel: shown', content: scheduler(v) },
        { label: 'view: work-week · side panel: hidden', content: scheduler(v, { hideSidePanel: true }) },
        { label: 'view: month · side panel: shown', content: scheduler(v, { view: 'month' }) },
        { label: 'view: list · side panel: shown', content: scheduler(v, { view: 'list' }) },
      ]),
    );
  },
};

/** The event: the eight colors, the four types and the cancelled event, in the day and week grids. */
export const Events: Story = {
  name: 'Events',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('events'),
      labelled([
        { label: 'view: week · color: primary and the seven vertical colors', content: scheduler(v, { view: 'week', date: '2026-11-11' }) },
        { label: 'view: day · type: 1 h, short, long, recurring · state: cancelled', content: scheduler(v, { view: 'day', date: '2026-11-11' }) },
      ]),
    );
  },
};

/** Empty and loading change only the events area: the toolbar stays active and the week keeps its days. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      labelled([
        { label: 'state: empty · view: work-week', content: scheduler(v, { events: [] }) },
        { label: 'state: loading · view: work-week', content: scheduler(v, { loading: true }) },
        { label: 'state: empty · view: month', content: scheduler(v, { events: [], view: 'month' }) },
        { label: 'state: loading · view: month', content: scheduler(v, { loading: true, view: 'month' }) },
        { label: 'state: empty · view: list', content: scheduler(v, { events: [], view: 'list' }) },
        { label: 'state: loading · view: list', content: scheduler(v, { loading: true, view: 'list' }) },
      ]),
    );
  },
};

/** A day with more events than the cell holds: "+N more" closes the cell and goes to the day view. */
export const More: Story = {
  name: 'More',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('more'),
      labelled([
        { label: 'view: month · many events: "+N more"', content: scheduler(v, { view: 'month', events: busyEventsOf(v), date: '2026-11-18' }) },
      ]),
    );
  },
};

/** Under 768 px the scheduler is the compact month with the list of the chosen day. */
export const Phone: Story = {
  name: 'Phone',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('phone'),
      labelled([
        { label: `size: phone · width: ${PHONE_WIDTH}`, content: scheduler(v, { view: 'month', width: PHONE_WIDTH, height: '48rem', filter: false }) },
        { label: `size: phone · state: empty`, content: scheduler(v, { view: 'month', events: [], width: PHONE_WIDTH, height: '40rem', filter: false }) },
      ]),
    );
  },
};

/** The open event: the popover beside it, with the content the screen put in the slot, and `aria-expanded` on the event. */
export const Detail: Story = {
  name: 'Detail',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('detail'),
      labelled([
        { label: 'event: open', content: scheduler(v, { openEvent: 'workshop', date: '2026-11-10', height: SCHEDULER_HEIGHT }) },
      ]),
    );
  },
};

/** The focus of the day and of the event: the same border and halo, in the color of the event. The story moves the focus. */
export const Focus: Story = {
  name: 'Focus',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('focus'),
      labelled([
        { label: 'state: day focus', content: html`<div data-focus="day">${scheduler(v, { view: 'week' })}</div>` },
        { label: 'state: event focus', content: html`<div data-focus="event">${scheduler(v, { view: 'week' })}</div>` },
      ]),
    );
  },
  play: async ({ canvasElement }) => {
    const target = async (kind: string, selector: string): Promise<void> => {
      const host = canvasElement.querySelector<HTMLElement>(`[data-focus="${kind}"] nph-scheduler`);
      if (host === null) return;
      await (host as unknown as { updateComplete: Promise<unknown> }).updateComplete;
      host.shadowRoot?.querySelector<HTMLElement>(selector)?.focus();
    };
    await target('day', '.day');
    await target('event', '.event[data-kind="grid"]');
  },
};

/** The five required examples — the work week, the phone month, the empty week, the list and the month with "+N more" — in light and in dark. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      bothModes({ light: v.lightCaption as string, dark: v.darkCaption as string }, () => examples(v)),
    );
  },
};

/** The seven brands in light and dark: the primary color, the today mark and the focus follow the brand; the other colors do not. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-scheduler', page('brands').storyId),
        () => html`${scheduler(v, { view: 'week', hideSidePanel: true })}`,
      ),
    );
  },
};
