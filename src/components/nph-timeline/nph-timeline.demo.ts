/**
 * Demonstration frame shared by the `nph-timeline` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The scenery here — the
 * framed figure, the width of the block the list sits in — is NOT a precedent for component CSS: the piece takes every
 * measure from the `timeline/*` tokens and its width from its container.
 *
 * The list takes the width of the block it sits in and brings none of its own, so a frame gives it one: 22rem is a
 * narrow panel and 40rem a wide column (the 360 px of the Figma example is only an example). The pictures are the data
 * URIs of `nph-avatar`: no real person, no new binary asset and no network address. The names are made up and the dates
 * are examples. The functions take the visible text as arguments: this file holds none, because every visible text
 * comes from the language dictionary of the page that calls it. The machine values of the dates (`datetime`) are not
 * visible text and are written here.
 *
 * The three examples are the required ones of the accepted documentation (frame `5237:3423`): a declined approval
 * process, a history by person with an action, and a history by event type.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-timeline';
import '../nph-button/nph-button';
import '../nph-card/nph-card';
import { PHOTO_A, PHOTO_B } from '../nph-avatar/nph-avatar.demo';
import type { NphTimelineItem, NphTimelineMarker, NphTimelineStatus, NphTimelineType } from './nph-timeline';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `timelineValidation` dictionary. */
export interface TimelineTexts {
  lightCaption: string;
  darkCaption: string;
  processLabel: string;
  historyLabel: string;
  declinedLabel: string;
  personLabel: string;
  typeLabel: string;
  completedLabel: string;
  currentLabel: string;
  errorLabel: string;
  warningLabel: string;
  pendingLabel: string;
  loadingLabel: string;
  moreLabel: string;
  newLabel: string;
  loadedLabel: string;
  emptyHeading: string;
  emptyDescription: string;
  action: string;
  steps: string[];
  events: string[];
  eventTypes: string[];
  whens: string[];
  whoAna: string;
  whoBruno: string;
  whoCarla: string;
  whoFinance: string;
  whoProcurement: string;
  longTitle: string;
  description: string;
  declinedTitle: string;
  declinedReason: string;
  noteHeading: string;
  noteDescription: string;
  summaryHeading: string;
  summaryKeyItem: string;
  summaryValueItem: string;
  summaryKeyTotal: string;
  summaryValueTotal: string;
  summaryAction: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens (P67). A story is never
 * duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: 100%; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
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

/** A narrow panel. */
export const NARROW_WIDTH = '22rem';

/** A wide column, and the width of a matrix cell: a table cell sizes itself from its content and the list brings none. */
export const WIDE_WIDTH = '40rem';

/** The machine values of the example dates, in the order of the `whens` of the dictionary. */
const MACHINE_DATES = ['2026-11-08T09:12', '2026-11-08T10:05', '2026-11-09T14:30', '2026-11-10T08:40', '2026-11-11T16:20'];

/** The icon of each event type, in the order of the `eventTypes` of the dictionary: a core `nph-icon` name. */
const EVENT_ICONS = ['plus', 'pen-to-square', 'tag', 'comment', 'paperclip'];

/** The date of the example `index`: the text and its machine value. */
function dated(v: TimelineTexts, index: number): Pick<NphTimelineItem, 'when' | 'datetime'> {
  return { when: v.whens[index] as string, datetime: MACHINE_DATES[index] as string };
}

export interface TimelineOptions {
  items: readonly NphTimelineItem[];
  type?: NphTimelineType;
  /** The accessible name of the list. */
  label?: string;
  hasMore?: boolean;
  loading?: boolean;
  live?: boolean;
  /** The width of the frame; the list takes the width of where it lives. */
  width?: string;
  /** What goes in the named slots of the items, such as a card. */
  slotted?: TemplateResult;
}

/** A timeline with every text the page owes it, at the width asked for. */
export function timeline(v: TimelineTexts, options: TimelineOptions): TemplateResult {
  const { items, type = 'process', label, hasMore = false, loading = false, live = false, width = WIDE_WIDTH, slotted } = options;
  return html`<div style="inline-size: ${width}; max-inline-size: 100%; text-align: start;">
    <nph-timeline
      .items=${items}
      type=${type}
      label=${label ?? (type === 'process' ? v.processLabel : v.historyLabel)}
      completed-label=${v.completedLabel}
      current-label=${v.currentLabel}
      error-label=${v.errorLabel}
      warning-label=${v.warningLabel}
      pending-label=${v.pendingLabel}
      loading-label=${v.loadingLabel}
      more-label=${v.moreLabel}
      new-label=${v.newLabel}
      loaded-label=${v.loadedLabel}
      empty-heading=${v.emptyHeading}
      empty-description=${v.emptyDescription}
      ?has-more=${hasMore}
      ?loading=${loading}
      ?live=${live}
      >${slotted ?? nothing}</nph-timeline
    >
  </div>`;
}

/**
 * The process of `count` steps (3, 4 or 5), as the Figma lists: completed, then the current step, then pending ones;
 * 4 and 5 steps add a completed step at the top and a pending one at the end.
 */
export function processItems(v: TimelineTexts, count: 1 | 2 | 3 | 4 | 5): NphTimelineItem[] {
  const looks: NphTimelineStatus[] =
    count === 1
      ? ['current']
      : count === 2
        ? ['completed', 'current']
        : count === 3
          ? ['completed', 'current', 'pending']
          : count === 4
            ? ['completed', 'completed', 'current', 'pending']
            : ['completed', 'completed', 'current', 'pending', 'pending'];
  const who = [v.whoAna, v.whoBruno, v.whoFinance, v.whoProcurement, v.whoProcurement] as string[];
  return looks.map((status, index) => ({
    id: `step-${String(index + 1)}`,
    title: v.steps[index] as string,
    who: who[index] as string,
    ...(status === 'pending' ? {} : dated(v, index)),
    status,
  }));
}

/** The history of `count` events (1 to 5) with the dot, the default marker of the history type. */
export function historyItems(v: TimelineTexts, count: 1 | 2 | 3 | 4 | 5): NphTimelineItem[] {
  const who = [v.whoAna, v.whoBruno, v.whoFinance, v.whoAna, v.whoCarla] as string[];
  return Array.from({ length: count }, (_, index) => ({
    id: `event-${String(index + 1)}`,
    title: v.events[index] as string,
    who: who[index] as string,
    ...dated(v, index),
  }));
}

/** An item that follows the one under test, so the connector line has somewhere to go. It keeps the marker kind. */
function follower(v: TimelineTexts, marker: NphTimelineMarker): NphTimelineItem {
  const circle = marker === 'circle';
  return {
    title: v.steps[3] as string,
    marker,
    who: v.whoProcurement,
    ...(circle ? { status: 'pending' as const } : dated(v, 3)),
  };
}

/** The item under test followed by one more, so the line that leaves its marker shows. */
export function withFollower(v: TimelineTexts, item: NphTimelineItem): NphTimelineItem[] {
  return [item, follower(v, item.marker ?? 'circle')];
}

/** One item that tells who and when, for a marker or a status to be put on. */
function base(v: TimelineTexts, title: string): NphTimelineItem {
  return { title, who: v.whoAna, ...dated(v, 0) };
}

/** The marker rows: the dot, the six circles and the two avatars, each followed by one more item. */
export function markerRows(v: TimelineTexts): Array<{ label: string; type: NphTimelineType; items: NphTimelineItem[] }> {
  const circle = (status: NphTimelineStatus, title: string, extra: Partial<NphTimelineItem> = {}) =>
    withFollower(v, { ...base(v, title), marker: 'circle', status, ...extra });
  return [
    { label: 'marker: dot', type: 'history', items: withFollower(v, { ...base(v, v.events[0] as string), marker: 'dot' }) },
    {
      label: 'marker: circle · status: neutral · icon: plus',
      type: 'history',
      items: circle('neutral', v.events[0] as string, { icon: 'plus', typeLabel: v.eventTypes[0] as string }),
    },
    { label: 'marker: circle · status: completed', type: 'process', items: circle('completed', v.steps[0] as string) },
    { label: 'marker: circle · status: current', type: 'process', items: circle('current', v.steps[1] as string) },
    { label: 'marker: circle · status: pending', type: 'process', items: circle('pending', v.steps[2] as string) },
    { label: 'marker: circle · status: error', type: 'process', items: circle('error', v.declinedTitle) },
    { label: 'marker: circle · status: warning', type: 'process', items: circle('warning', v.steps[2] as string) },
    {
      label: 'marker: avatar · avatar: photo',
      type: 'history',
      items: withFollower(v, { ...base(v, v.events[1] as string), marker: 'avatar', avatar: PHOTO_A }),
    },
    {
      label: 'marker: avatar · avatar: none',
      type: 'history',
      items: withFollower(v, { ...base(v, v.events[1] as string), marker: 'avatar', who: v.whoCarla }),
    },
  ];
}

/** The six states of the circle in one list: the neutral one with the event icon, then completed, current, pending, error and warning. */
export function stateItems(v: TimelineTexts): NphTimelineItem[] {
  const who = [v.whoAna, v.whoBruno, v.whoFinance, v.whoProcurement, v.whoFinance, v.whoAna] as string[];
  const kinds: NphTimelineStatus[] = ['neutral', 'completed', 'current', 'pending', 'error', 'warning'];
  const titles = [v.events[3], v.steps[0], v.steps[1], v.steps[3], v.declinedTitle, v.steps[2]];
  return kinds.map((status, index) => ({
    title: titles[index] as string,
    who: who[index] as string,
    ...(status === 'pending' ? {} : dated(v, Math.min(index, 4))),
    marker: 'circle' as const,
    status,
    ...(status === 'neutral' ? { icon: 'comment', typeLabel: v.eventTypes[3] as string } : {}),
  }));
}

/** The card the item `id` carries below its text: a base card, outlined, with a heading and a line. */
export function noteCard(v: TimelineTexts, id: string): TemplateResult {
  return html`<nph-card slot=${id} surface="outlined" heading=${v.noteHeading} heading-level="4" description=${v.noteDescription}></nph-card>`;
}

/** The section card the item `id` carries: a key-value list and one text action in the header; nothing to click as a whole. */
export function summaryCard(v: TimelineTexts, id: string): TemplateResult {
  return html`<nph-card
    slot=${id}
    type="section"
    surface="outlined"
    heading=${v.summaryHeading}
    heading-level="4"
    .items=${[
      { key: v.summaryKeyItem, value: v.summaryValueItem },
      { key: v.summaryKeyTotal, value: v.summaryValueTotal },
    ]}
  >
    <nph-button slot="action" severity="secondary" size="compact" text=${v.summaryAction}></nph-button>
  </nph-card>`;
}

/** A long title that wraps, a description, and the three states of the action: off, on and disabled. */
export function contentRows(
  v: TimelineTexts,
): Array<{ label: string; items: NphTimelineItem[]; slotted?: TemplateResult }> {
  const item = (extra: Partial<NphTimelineItem>): NphTimelineItem[] =>
    withFollower(v, { ...base(v, v.steps[0] as string), status: 'completed', ...extra });
  const noteItems = [{ ...base(v, v.events[3] as string), id: 'note', marker: 'dot' as const }, follower(v, 'dot')];
  return [
    { label: 'title: long', items: item({ title: v.longTitle }) },
    { label: 'description: on', items: item({ description: v.description }) },
    { label: 'description: off', items: item({}) },
    { label: 'meta: who · when', items: item({}) },
    {
      label: 'meta: waiting · who · status: pending',
      items: [
        { ...base(v, v.steps[0] as string), status: 'completed' },
        { title: v.steps[2] as string, who: v.whoProcurement, status: 'pending' },
      ],
    },
    { label: 'meta: off', items: item({ who: '', when: '', datetime: '' }) },
    { label: 'action: on', items: item({ action: v.action }) },
    { label: 'action: on · state: disabled', items: item({ action: v.action, actionDisabled: true }) },
    {
      label: 'slot: nph-card · type: base',
      items: noteItems,
      slotted: noteCard(v, 'note'),
    },
    {
      label: 'slot: nph-card · type: section · action: on',
      items: [{ ...base(v, v.events[2] as string), id: 'summary', marker: 'dot', action: v.action }, follower(v, 'dot')],
      slotted: summaryCard(v, 'summary'),
    },
  ];
}

/** The first required example: a declined approval — a completed step, the step with an error and its reason, a pending step. */
export function declinedExample(v: TimelineTexts, width = WIDE_WIDTH): TemplateResult {
  return timeline(v, {
    label: v.declinedLabel,
    width,
    items: [
      { ...base(v, v.steps[0] as string), status: 'completed' },
      { title: v.declinedTitle, description: v.declinedReason, who: v.whoFinance, ...dated(v, 2), status: 'error' },
      { title: v.steps[3] as string, who: v.whoProcurement, status: 'pending' },
    ],
  });
}

/** The second required example: a history by person — the avatar, who and when, and an action. */
export function personExample(v: TimelineTexts, width = WIDE_WIDTH): TemplateResult {
  const who = [v.whoAna, v.whoBruno, v.whoCarla] as string[];
  const photos: Array<string | undefined> = [PHOTO_A, PHOTO_B, undefined];
  return timeline(v, {
    type: 'history',
    label: v.personLabel,
    width,
    items: [0, 1, 2].map((index) => ({
      title: v.events[index] as string,
      who: who[index] as string,
      ...dated(v, index),
      marker: 'avatar' as const,
      ...(photos[index] === undefined ? {} : { avatar: photos[index] }),
      ...(index === 0 ? { action: v.action } : {}),
    })),
  });
}

/** The third required example: a history by event type — the neutral circle with the icon of the type. */
export function typeExample(v: TimelineTexts, width = WIDE_WIDTH): TemplateResult {
  return timeline(v, {
    type: 'history',
    label: v.typeLabel,
    width,
    items: [0, 1, 3, 4].map((index) => ({
      title: v.events[index] as string,
      who: [v.whoAna, v.whoBruno, v.whoFinance, v.whoAna, v.whoCarla][index] as string,
      ...dated(v, index),
      marker: 'circle' as const,
      icon: EVENT_ICONS[index] as string,
      typeLabel: v.eventTypes[index] as string,
    })),
  });
}

/** The three required examples, one under the other. */
export function examples(v: TimelineTexts, width = WIDE_WIDTH): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
    ${declinedExample(v, width)} ${personExample(v, width)} ${typeExample(v, width)}
  </div>`;
}

/** The pieces the brand paints: the process, the dot, the neutral circle with an icon and the avatar. */
export function brandsContent(v: TimelineTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${timeline(v, { items: processItems(v, 3), width: NARROW_WIDTH })}
    ${timeline(v, {
      type: 'history',
      width: NARROW_WIDTH,
      items: [
        { ...base(v, v.events[0] as string) },
        { ...base(v, v.events[3] as string), marker: 'circle', icon: 'comment', typeLabel: v.eventTypes[3] as string },
        { ...base(v, v.events[1] as string), marker: 'avatar', avatar: PHOTO_A },
        { ...base(v, v.events[4] as string), marker: 'circle', icon: 'paperclip', typeLabel: v.eventTypes[4] as string },
      ],
    })}
  </div>`;
}
