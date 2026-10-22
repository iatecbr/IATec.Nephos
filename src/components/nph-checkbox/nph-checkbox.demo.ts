/**
 * Demonstration frame shared by the `nph-checkbox` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index
 * it. The scenery here — the framed figure, the stack of boxes, the error sentence under a
 * box — is NOT a precedent for component CSS: the piece takes every measure and color from
 * its own tokens.
 *
 * The three examples are the required ones of the accepted frame (`1194:1033`): "Consent"
 * (a single option the person turns on or off), "Preferences" (several independent options,
 * stacked) and "Group selection" (the summarizing item is indeterminate). The summarizing
 * item is coordinated HERE, by the page, never by the component: the piece has no group
 * logic. The functions take the visible text as arguments: this file holds none, because
 * every visible text comes from the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-checkbox';
import type { NphCheckbox } from './nph-checkbox';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/* Demonstration frame. Not a precedent for component CSS. */
export const stack = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';

export interface CheckboxOptions {
  text?: string;
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
}

/** One box. The tag and the attributes are the contract; the text comes in. */
export function checkbox(options: CheckboxOptions): TemplateResult {
  return html`<nph-checkbox
    text=${options.text ?? ''}
    label=${options.label ?? ''}
    name=${options.name ?? ''}
    value=${options.value ?? 'on'}
    ?checked=${options.checked ?? false}
    ?indeterminate=${options.indeterminate ?? false}
    ?invalid=${options.invalid ?? false}
    ?disabled=${options.disabled ?? false}
  ></nph-checkbox>`;
}

/** The error sentence stays outside the piece, under it (Accessibility: color is not the only signal). */
export function withError(piece: TemplateResult, sentence: string): TemplateResult {
  return html`<div style=${stack}>
    ${piece}
    <span style="color: var(--nph-status-error);">${sentence}</span>
  </div>`;
}

export interface ConsentText {
  consent: string;
}

/** Consent: a single option, which the person turns on or off. */
export function consent(d: ConsentText, checked = false): TemplateResult {
  return checkbox({ text: d.consent, name: 'consent', value: 'yes', checked });
}

export interface PreferencesText {
  email: string;
  sms: string;
  push: string;
}

/** Preferences: several independent options, stacked. */
export function preferences(d: PreferencesText): TemplateResult {
  return html`<div style=${stack}>
    ${checkbox({ text: d.email, name: 'channel', value: 'email', checked: true })}
    ${checkbox({ text: d.sms, name: 'channel', value: 'sms' })}
    ${checkbox({ text: d.push, name: 'channel', value: 'push', checked: true })}
  </div>`;
}

export interface GroupText {
  all: string;
  contracts: string;
  invoices: string;
  reports: string;
}

/**
 * The page keeps the summarizing item in step with its items: all checked is checked, none is
 * unchecked, some is indeterminate. A change of the summarizing item checks or unchecks all.
 */
function coordinate(event: Event): void {
  const frame = event.currentTarget as HTMLElement;
  const summary = frame.querySelector<NphCheckbox>('[data-summary]');
  const items = [...frame.querySelectorAll<NphCheckbox>('[data-item]')];
  if (summary === null) return;
  if (event.target === summary) {
    for (const item of items) item.checked = summary.checked;
    return;
  }
  const checked = items.filter((item) => item.checked).length;
  summary.checked = checked === items.length;
  summary.indeterminate = checked > 0 && checked < items.length;
}

/** Group selection: the summarizing item is indeterminate when the group is checked in part. */
export function groupSelection(d: GroupText): TemplateResult {
  const indent = 'padding-inline-start: var(--nph-space-inline-loose);';
  return html`<div style=${stack} @change=${coordinate}>
    <nph-checkbox data-summary text=${d.all} indeterminate></nph-checkbox>
    <div style="${stack} ${indent}">
      <nph-checkbox data-item text=${d.contracts} name="files" value="contracts" checked></nph-checkbox>
      <nph-checkbox data-item text=${d.invoices} name="files" value="invoices"></nph-checkbox>
      <nph-checkbox data-item text=${d.reports} name="files" value="reports" checked></nph-checkbox>
    </div>
  </div>`;
}
