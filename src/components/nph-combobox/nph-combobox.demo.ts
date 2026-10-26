/**
 * Demonstration frame shared by the `nph-combobox` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here — the gaps, the framed figure, the room below an open
 * list — is NOT a precedent for component CSS: the piece takes every measure from
 * tokens.
 *
 * The three examples are the required ones of the accepted board (`1359:142`): "Chosen
 * option, at rest" (the value with the clear button), "Search with the typed stretch
 * highlighted" (the `busca` list) and "Search waiting for the answer" (the `carregando`
 * list). Each sits in an `nph-field`, which gives the label and the help text. The
 * functions take the visible text as arguments: this file holds none, because every
 * visible text comes from the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-field/nph-field';
import './nph-combobox';
import type { NphComboboxEntry } from './nph-combobox';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). A story is never duplicated per mode. `room` keeps space below an open
 * list, so it does not cover the next figure.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult, room = false): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box; ${room
      ? 'padding-block-end: calc(var(--nph-layout-max-list-height) + var(--nph-space-section));'
      : ''}"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult, room = false): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', captions.light],
    ['dark', captions.dark],
  ];
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content(), room))}
  </div>`;
}

/** The options of a list of labels, with technical values. */
export function entriesOf(labels: readonly string[], prefix = 'o'): NphComboboxEntry[] {
  return labels.map((text, index) => ({ value: `${prefix}${index + 1}`, text }));
}

export interface ChosenText {
  label: string;
  help: string;
  placeholder: string;
  clearLabel: string;
  options: readonly NphComboboxEntry[];
  value: string;
}

/** Chosen option, at rest: the value in the field, with the clear button. */
export function chosen(text: ChosenText): TemplateResult {
  return html`<nph-field label=${text.label} help=${text.help}>
    <nph-combobox
      placeholder=${text.placeholder}
      name="country"
      value=${text.value}
      clearable
      clear-label=${text.clearLabel}
      .options=${text.options}
    ></nph-combobox>
  </nph-field>`;
}

export interface SearchText {
  label: string;
  placeholder: string;
  options: readonly NphComboboxEntry[];
  query: string;
  clearLabel: string;
}

/** Search with the typed stretch highlighted: the `busca` list, open. */
export function search(text: SearchText): TemplateResult {
  return html`<nph-field label=${text.label}>
    <nph-combobox
      placeholder=${text.placeholder}
      clearable
      clear-label=${text.clearLabel}
      .options=${text.options}
      .query=${text.query}
      open
    ></nph-combobox>
  </nph-field>`;
}

export interface LoadingText {
  label: string;
  placeholder: string;
  query: string;
  loadingLabel: string;
}

/** Search waiting for the answer: the `carregando` list, open, while the consumer searches. */
export function waiting(text: LoadingText): TemplateResult {
  return html`<nph-field label=${text.label}>
    <nph-combobox
      placeholder=${text.placeholder}
      filter="none"
      loading
      loading-label=${text.loadingLabel}
      .options=${[]}
      .query=${text.query}
      open
    ></nph-combobox>
  </nph-field>`;
}
