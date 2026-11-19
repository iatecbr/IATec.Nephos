/**
 * Demonstration frame shared by the `nph-date-picker` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The scenery here — the framed
 * figure, the room kept below a picker for its open panel, the fixed date of today — is NOT a precedent for component CSS: the
 * piece takes its measures from the `date-picker/*` and `calendar/*` tokens, and the place of its panel from the field, in the top
 * layer. Today is fixed (`now`), so every story draws the same month in any year.
 *
 * An open panel on a page is opened by the `open` attribute: it does not take the focus, as nothing the person did asked for it.
 * The picker with a typed date in error is the person typing: the demo writes the text and leaves the field, as the person does.
 *
 * Every visible text comes from the dictionary, passed in by the page that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';

import './nph-date-picker';
import type { NphDatePicker, NphDatePickerLabels } from './nph-date-picker';

export type Scheme = 'light' | 'dark';

/** The texts of the demonstration, from the `datePickerValidation` dictionary. */
export interface DatePickerText {
  lightCaption: string;
  darkCaption: string;
  dueLabel: string;
  startLabel: string;
  endLabel: string;
  externalError: string;
  statusIdle: string;
  statusChange: string;
  submitText: string;
  resetText: string;
  statusSubmitted: string;
  statusReset: string;
  exampleDue: string;
  exampleReport: string;
  exampleInvalid: string;
  labels: NphDatePickerLabels;
}

/** The date of today in every story, so a month is always the same one. */
export const TODAY = '2026-10-14';

/** The room an open panel needs below its field: it is in the top layer and takes none in the flow. */
export const ROOM = 'min-block-size: calc(var(--nph-control-height-large) * 11);';

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens (P67). A story is never
 * duplicated per mode. The open panel is a descendant of the figure, so it takes the scheme too.
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

/** The same example in light and in dark mode, one under the other: an open panel is wide. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

export type PickerProps = Partial<
  Pick<NphDatePicker, 'mode' | 'size' | 'value' | 'start' | 'end' | 'min' | 'max' | 'unavailable' | 'error' | 'startError' | 'endError' | 'required' | 'disabled' | 'open' | 'weekStart' | 'name' | 'startName' | 'endName'>
>;

/** One picker, with today fixed, the labels of the dictionary and the field labels of its mode. */
export function picker(v: DatePickerText, props: PickerProps = {}): TemplateResult {
  const range = props.mode === 'range';
  return html`<nph-date-picker
    .now=${TODAY}
    .labels=${v.labels}
    mode=${props.mode ?? 'single'}
    size=${props.size ?? 'default'}
    week-start=${props.weekStart ?? 'sunday'}
    label=${range ? '' : v.dueLabel}
    start-label=${range ? v.startLabel : ''}
    end-label=${range ? v.endLabel : ''}
    .value=${props.value ?? ''}
    .start=${props.start ?? ''}
    .end=${props.end ?? ''}
    .min=${props.min ?? ''}
    .max=${props.max ?? ''}
    .unavailable=${props.unavailable ?? []}
    .error=${props.error ?? ''}
    .startError=${props.startError ?? ''}
    .endError=${props.endError ?? ''}
    ?required=${props.required ?? false}
    ?disabled=${props.disabled ?? false}
    ?open=${props.open ?? false}
    name=${props.name ?? ''}
    start-name=${props.startName ?? ''}
    end-name=${props.endName ?? ''}
  ></nph-date-picker>`;
}

/** A picker with its open panel, and the room below it. */
export function opened(v: DatePickerText, props: PickerProps = {}): TemplateResult {
  return html`<div style=${ROOM}>${picker(v, { ...props, open: true })}</div>`;
}

/**
 * The picker where the person typed a date that does not exist and left the field: the demo writes the text and fires what the
 * input fires, so the piece reads it, shows the message and keeps the value it had.
 */
export function typedWrong(v: DatePickerText): TemplateResult {
  const type = (host?: Element): void => {
    if (host === undefined) return;
    void (async () => {
      const element = host as NphDatePicker;
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 200));
      const input = element.shadowRoot?.querySelector('nph-input');
      if (input === null || input === undefined) return;
      (input as HTMLElement & { value: string }).value = '31/02/2026';
      input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    })();
  };
  return html`<nph-date-picker
    ${ref(type)}
    .now=${TODAY}
    .labels=${v.labels}
    label=${v.dueLabel}
    required
  ></nph-date-picker>`;
}
