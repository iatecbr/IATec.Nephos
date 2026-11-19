/**
 * VALIDATION stories of `nph-calendar`.
 *
 * They prove the contract accepted in Figma (the grid `4015:28204`, its day `4015:28020`, the month and year cell `4015:28139`) and
 * P133: the single date in the two sizes with the day states, the range with its bands across the turn of the week, a one-day
 * period and the two months with one arrow on each outer edge, the limits, the day unavailable by rule and a period stopped by it, the month and year views at the height of the day view (in the two sizes and in the two columns of a range), the week that starts on Monday, a grid to try with
 * the mouse and the keyboard, and the seven brands. Every story shows the same grids in light and in dark mode, in the same story,
 * through `data-nph-color-scheme` on the frame (P20, P67). The month and year views open from the title of a month: the Views story presses it for you, and the Interactive story lets you try it;
 * the component test measures each one. No attribute forces a state, because it would be API.
 *
 * This piece has no reading page of its own: its contract is in `fichas/nph-calendar.md`, and the date picker `Docs` page shows it
 * at work. Each page opens with what it proves, from the dictionary (`validationPages.claims`); the texts come from the language
 * dictionary, under the key `calendarValidation` (`docs/i18n.md`, "Storybook").
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { bothModes, grid, inView, interactive } from './nph-calendar.demo';
import type { CalendarText } from './nph-calendar.demo';

const meta: Meta = {
  title: 'Components/nph-calendar/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined): CalendarText {
  return translations(localeOf(context)).calendarValidation as CalendarText;
}

const page = (storyId: string) => ({
  piece: 'nph-calendar',
  storyId: `components-nph-calendar-validation--${storyId}`,
  sheet: true,
});

const captions = (v: CalendarText) => ({ light: v.lightCaption, dark: v.darkCaption });

/** The single date in the two sizes: the six week rows, today, the chosen day and the days of the next and previous month. */
export const Single: Story = {
  name: 'Single',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('single'),
      bothModes(captions(v), () =>
        matrix(validationTitle(context, 'nph-calendar', page('single').storyId), [], [
          { label: 'mode: single · size: default', cells: [grid(v, { value: '2026-10-20' })] },
          { label: 'mode: single · size: large', cells: [grid(v, { value: '2026-10-20', size: 'large' })] },
        ]),
      ),
    );
  },
};

/** The range: a period across the turn of the week, a one-day period, only the Start and the two months. */
export const Range: Story = {
  name: 'Range',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('range'),
      bothModes(captions(v), () =>
        matrix(validationTitle(context, 'nph-calendar', page('range').storyId), [], [
          { label: 'mode: range · start and end', cells: [grid(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21' })] },
          { label: 'mode: range · start = end', cells: [grid(v, { mode: 'range', start: '2026-10-14', end: '2026-10-14' })] },
          { label: 'mode: range · start only', cells: [grid(v, { mode: 'range', start: '2026-10-14' })] },
          { label: 'mode: range · months: 2', cells: [grid(v, { mode: 'range', months: 2, start: '2026-10-22', end: '2026-11-05' })] },
        ]),
      ),
    );
  },
};

/** The limits and the day unavailable by rule: the day outside min and max fades and is skipped, the holiday takes focus and is not chosen. */
export const Limits: Story = {
  name: 'Limits',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('limits'),
      bothModes(captions(v), () =>
        matrix(validationTitle(context, 'nph-calendar', page('limits').storyId), [], [
          { label: 'min · max', cells: [grid(v, { min: '2026-10-08', max: '2026-10-24', value: '2026-10-14' })] },
          { label: 'unavailable', cells: [grid(v, { unavailable: ['2026-10-12', '2026-10-15', '2026-10-27'] })] },
          {
            label: 'mode: range · start only · unavailable',
            cells: [grid(v, { mode: 'range', start: '2026-10-14', unavailable: ['2026-10-08', '2026-10-20'] })],
          },
          {
            label: 'mode: range · start only · unavailable · allows-non-contiguous-ranges',
            cells: [grid(v, { mode: 'range', start: '2026-10-14', unavailable: ['2026-10-08', '2026-10-20'], allowsNonContiguousRanges: true })],
          },
        ]),
      ),
    );
  },
};

/** The week that starts on Monday, in the two sizes: only the weekday row and the first week change. */
export const Week: Story = {
  name: 'Week',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('week'),
      bothModes(captions(v), () =>
        matrix(validationTitle(context, 'nph-calendar', page('week').storyId), [], [
          { label: 'week-start: sunday', cells: [grid(v, { value: '2026-10-20' })] },
          { label: 'week-start: monday', cells: [grid(v, { value: '2026-10-20', weekStart: 'monday' })] },
        ]),
      ),
    );
  },
};

/** The month view and the year view, opened from the title: 4 rows by 3 columns at the height of the day view, in both sizes and in both columns of a range, a year or twelve years at a time, a disabled cell when none of its days is allowed. */
export const Views: Story = {
  name: 'Views',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('views'),
      bothModes(captions(v), () =>
        matrix(validationTitle(context, 'nph-calendar', page('views').storyId), [], [
          { label: 'view: month', cells: [inView(v, 'month', { value: '2026-10-20' })] },
          { label: 'view: year', cells: [inView(v, 'year', { value: '2026-10-20' })] },
          { label: 'view: month · min · max', cells: [inView(v, 'month', { min: '2026-08-15', max: '2026-11-10' })] },
          { label: 'view: month · size: large', cells: [inView(v, 'month', { size: 'large', value: '2026-10-20' })] },
          { label: 'view: year · size: large', cells: [inView(v, 'year', { size: 'large', value: '2026-10-20' })] },
          {
            label: 'view: month · mode: range · months: 2',
            cells: [inView(v, 'month', { mode: 'range', months: 2, start: '2026-10-09', end: '2026-11-21' })],
          },
          {
            label: 'view: year · mode: range · months: 2',
            cells: [inView(v, 'year', { mode: 'range', months: 2, start: '2026-10-09', end: '2026-11-21' })],
          },
        ]),
      ),
    );
  },
};

/** A grid to try: the title of a month opens the month view, then the year view; the arrows, Page Up and Page Down move; the status line says what was picked. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('interactive'),
      matrix(validationTitle(context, 'nph-calendar', page('interactive').storyId), [], [
        { label: 'mode: range · months: 2', cells: [interactive(v)] },
      ]),
    );
  },
};

/** The seven brands in light and dark mode: the chosen day, today and the period follow the brand of the frame. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-calendar', page('brands').storyId), () =>
        html`${grid(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21' })}`,
      ),
    );
  },
};
