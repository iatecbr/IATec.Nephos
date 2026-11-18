/**
 * VALIDATION stories of `nph-timeline`.
 *
 * They prove the contract accepted in Figma (documentation frame `5237:3423`, root `5226:2261`, sets `5216:304` and
 * `5216:701`) and decision P132: the two types, process and history, with three, four and five items, and the short
 * lists of two items and of one item, where the connector line is off on the last one; the three markers — the dot, the
 * circle with its six states and the event icon, and the avatar with and without a photo; the content of an item — the
 * title that wraps, the description, the meta line with the waiting word of the pending item, the action on and
 * disabled, and rich content in the named slot, an `nph-card` base and section, never clickable; "Show more", the
 * loading state and the empty state; the widths of 22 and 40 rem, since the list takes the width of its container; the
 * three required examples — a declined approval, a history by person and a history by event type — in light and dark
 * mode, in the same story; and the seven brands. Each page opens with what it proves, and the matrix names its rows by
 * attribute and value, as on the Docs page. All visible text, including the titles, names and dates of the examples,
 * comes from the language dictionary, under the `timelineValidation` and `validationPages` keys (`docs/i18n.md`,
 * "Storybook").
 *
 * The item has no interaction state: there is no hover, pressed or focus to show. The action and "Show more" are the
 * `nph-button` and take Tab; the component test proves them.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-timeline';
import {
  NARROW_WIDTH,
  WIDE_WIDTH,
  bothModes,
  brandsContent,
  contentRows,
  examples,
  historyItems,
  markerRows,
  processItems,
  timeline,
} from './nph-timeline.demo';
import type { TimelineTexts } from './nph-timeline.demo';

const meta: Meta = {
  title: 'Components/nph-timeline/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined): TimelineTexts {
  return translations(localeOf(context)).timelineValidation as unknown as TimelineTexts;
}

const page = (storyId: string) => ({ piece: 'nph-timeline', storyId: `components-nph-timeline-validation--${storyId}` });

/** The two types with three, four and five items: the process draws the state of each step, the history draws dots. */
export const Types: Story = {
  name: 'Types',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const counts = [3, 4, 5] as const;
    return validationPage(
      context,
      page('types'),
      matrix(validationTitle(context, 'nph-timeline', page('types').storyId), [], [
        ...counts.map((count) => ({
          label: `type: process · items: ${String(count)}`,
          cells: [timeline(v, { items: processItems(v, count), type: 'process' })],
        })),
        ...counts.map((count) => ({
          label: `type: history · items: ${String(count)}`,
          cells: [timeline(v, { items: historyItems(v, count), type: 'history' })],
        })),
      ]),
    );
  },
};

/** The short lists: two items, and a single event, which is one item with the connector line off. */
export const Short: Story = {
  name: 'Short',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('short'),
      matrix(validationTitle(context, 'nph-timeline', page('short').storyId), [], [
        { label: 'type: process · items: 2', cells: [timeline(v, { items: processItems(v, 2), type: 'process' })] },
        { label: 'type: process · items: 1', cells: [timeline(v, { items: processItems(v, 1), type: 'process' })] },
        { label: 'type: history · items: 2', cells: [timeline(v, { items: historyItems(v, 2), type: 'history' })] },
        { label: 'type: history · items: 1', cells: [timeline(v, { items: historyItems(v, 1), type: 'history' })] },
      ]),
    );
  },
};

/** The three markers: the dot, the circle in its six states and with the event icon, and the avatar with and without a photo. */
export const Markers: Story = {
  name: 'Markers',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('markers'),
      matrix(
        validationTitle(context, 'nph-timeline', page('markers').storyId),
        [],
        markerRows(v).map(({ label, type, items }) => ({ label, cells: [timeline(v, { items, type })] })),
      ),
    );
  },
};

/** What an item turns on: the long title, the description, the meta line, the action and the rich content of the slot. */
export const Content: Story = {
  name: 'Content',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('content'),
      matrix(
        validationTitle(context, 'nph-timeline', page('content').storyId),
        [],
        contentRows(v).map(({ label, items, slotted }) => ({
          label,
          cells: [timeline(v, { items, type: 'process', ...(slotted === undefined ? {} : { slotted }) })],
        })),
      ),
    );
  },
};

/** "Show more" after the list, the loading state in place of the items, and the empty state. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      matrix(validationTitle(context, 'nph-timeline', page('states').storyId), [], [
        { label: 'has-more: on', cells: [timeline(v, { items: historyItems(v, 4), type: 'history', hasMore: true })] },
        { label: 'loading: on', cells: [timeline(v, { items: [], type: 'history', loading: true })] },
        { label: 'items: none', cells: [timeline(v, { items: [], type: 'history' })] },
      ]),
    );
  },
};

/** The list takes the width of its container: a narrow panel of 22 rem and a wide column of 40 rem, with the text that wraps. */
export const Width: Story = {
  name: 'Width',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const items = processItems(v, 3).map((item, index) =>
      index === 1 ? { ...item, title: v.longTitle, description: v.description, action: v.action } : item,
    );
    return validationPage(
      context,
      page('width'),
      matrix(validationTitle(context, 'nph-timeline', page('width').storyId), [], [
        { label: 'width: 22rem', cells: [timeline(v, { items, width: NARROW_WIDTH })] },
        { label: 'width: 40rem', cells: [timeline(v, { items, width: WIDE_WIDTH })] },
      ]),
    );
  },
};

/** The three required examples — a declined approval, a history by person and a history by event type — in light and in dark. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => examples(v)),
    );
  },
};

/** The seven brands in light and dark: the connector line, the dot, the circle and its icon follow the brand. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-timeline', page('brands').storyId), () => html`${brandsContent(v)}`),
    );
  },
};
