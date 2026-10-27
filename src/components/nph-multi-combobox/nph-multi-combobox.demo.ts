/**
 * Demonstration frame shared by the `nph-multi-combobox` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here — the gaps, the framed figure, the room below an open
 * list — is NOT a precedent for component CSS: the piece takes every measure from
 * tokens.
 *
 * The three examples are the required ones of the accepted board (`1467:25660`): "Two
 * options chosen, at rest" (chips on one line), "In focus, with typed text and the list
 * open" (`conteúdo=digitando` and the list with checkboxes) and "Many options" (the chips
 * go down to more lines and the field grows). Each sits in an `nph-field`, which gives the
 * label and the help text. The functions take the visible text as arguments: this file
 * holds none, because every visible text comes from the language dictionary of the page
 * that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-field/nph-field';
import './nph-multi-combobox';
import type { NphComboboxEntry } from '../nph-combobox/nph-combobox';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). A story is never duplicated per mode. `room` keeps space below an open
 * list, so it does not cover the next figure.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult, room = false): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; max-inline-size: 100%; box-sizing: border-box; ${room
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

/** The first `count` values of a list made by `entriesOf`. */
export function firstValues(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => `${prefix}${index + 1}`);
}

export interface ExampleText {
  label: string;
  help: string;
  placeholder: string;
  removeLabel: string;
  options: readonly NphComboboxEntry[];
  value: readonly string[];
}

/** Two options chosen, at rest: chips on one line. */
export function resting(text: ExampleText): TemplateResult {
  return html`<nph-field label=${text.label} help=${text.help}>
    <nph-multi-combobox
      placeholder=${text.placeholder}
      name="countries"
      remove-label=${text.removeLabel}
      .options=${text.options}
      .defaultValue=${text.value}
    ></nph-multi-combobox>
  </nph-field>`;
}

export interface TypingText extends ExampleText {
  query: string;
}

/** In focus, with typed text and the list open: `conteúdo=digitando` and the list with checkboxes. */
export function typing(text: TypingText): TemplateResult {
  return html`<nph-field label=${text.label} help=${text.help}>
    <nph-multi-combobox
      placeholder=${text.placeholder}
      remove-label=${text.removeLabel}
      .options=${text.options}
      .defaultValue=${text.value}
      .query=${text.query}
      open
    ></nph-multi-combobox>
  </nph-field>`;
}

/** Many options: the chips go down to more lines and the field grows. */
export function many(text: ExampleText): TemplateResult {
  return html`<nph-field label=${text.label} help=${text.help}>
    <nph-multi-combobox
      placeholder=${text.placeholder}
      remove-label=${text.removeLabel}
      .options=${text.options}
      .defaultValue=${text.value}
    ></nph-multi-combobox>
  </nph-field>`;
}
