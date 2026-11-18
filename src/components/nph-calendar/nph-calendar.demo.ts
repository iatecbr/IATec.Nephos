/**
 * Demonstration frame shared by the `nph-calendar` Validation stories.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The scenery here — the framed
 * figure, the fixed date of today — is NOT a precedent for component CSS: the grid takes every measure from its own tokens.
 * Today is fixed (`now`), so every story draws the same month in any year. Every visible text comes from the dictionary, passed
 * in by the story that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-calendar';
import type { NphCalendar, NphCalendarLabels } from './nph-calendar';

export type Scheme = 'light' | 'dark';

/** The texts of the demonstration, from the `calendarValidation` dictionary. */
export interface CalendarText {
  lightCaption: string;
  darkCaption: string;
  statusIdle: string;
  statusPick: string;
  labels: NphCalendarLabels;
}

/** The date of today in every story, so a month is always the same one. */
export const TODAY = '2026-10-14';

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens (P67). A story is never
 * duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

/** One grid, with today fixed and the labels of the dictionary. */
export function grid(v: CalendarText, props: Partial<Pick<NphCalendar, 'mode' | 'size' | 'months' | 'value' | 'start' | 'end' | 'min' | 'max' | 'month' | 'weekStart' | 'unavailable'>> = {}): TemplateResult {
  return html`<nph-calendar
    .now=${TODAY}
    .labels=${v.labels}
    mode=${props.mode ?? 'single'}
    size=${props.size ?? 'default'}
    months=${props.months ?? 1}
    week-start=${props.weekStart ?? 'sunday'}
    month=${props.month ?? '2026-10'}
    .value=${props.value ?? ''}
    .start=${props.start ?? ''}
    .end=${props.end ?? ''}
    .min=${props.min ?? ''}
    .max=${props.max ?? ''}
    .unavailable=${props.unavailable ?? []}
  ></nph-calendar>`;
}

/** The grid to try: the status line says what the person picked, from the event the grid fires. */
export function interactive(v: CalendarText): TemplateResult {
  const show = (event: Event): void => {
    const detail = (event as CustomEvent<{ date: string; start: string; end: string }>).detail;
    const status = (event.currentTarget as HTMLElement).parentElement?.querySelector('[data-status]');
    if (status !== null && status !== undefined) {
      status.textContent = v.statusPick.replace('{date}', detail.date).replace('{start}', detail.start).replace('{end}', detail.end);
    }
  };
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline);">
    <nph-calendar
      .now=${TODAY}
      .labels=${v.labels}
      mode="range"
      months="2"
      month="2026-10"
      .start=${'2026-10-09'}
      .end=${'2026-10-21'}
      @nph-pick=${show}
    ></nph-calendar>
    <p role="status" data-status style="margin: 0; color: var(--nph-color-muted-foreground);">${v.statusIdle}</p>
  </div>`;
}
