/**
 * Demonstration frame shared by the `nph-input` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does
 * not index it. The scenery here — the gaps, the framed figure, the stack of label,
 * field and sentence — is NOT a precedent for component CSS: the piece takes every
 * measure from tokens, and the composition of label, field and message belongs to
 * `nph-field` (DSA-28), which has no code yet.
 *
 * The three examples are the required ones of the accepted frame (`1195:532`):
 * "Search" (start icon and end icon to clear), "Field with a label" (the label, by
 * `nph-label for`) and "Error" (the sentence outside the piece, where `nph-field`
 * will write it). The functions take the visible text as arguments: this file holds
 * none, because every visible text comes from the language dictionary of the page
 * that calls it.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-label/nph-label';
import './nph-input';

export type Scheme = 'light' | 'dark';

/** A unique id per call: the same example is drawn in both modes on one page. */
let nextId = 0;
function uniqueId(prefix: string): string {
  nextId += 1;
  return `${prefix}-${nextId}`;
}

const stack = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';

/**
 * The same example in a color scheme of its own, on the same element that
 * resolves the tokens (P67). A story is never duplicated per mode.
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

export interface SearchText {
  /** The accessible name: the search has no visible label. */
  label: string;
  placeholder: string;
  clearLabel: string;
  /** A value, so the clear button shows. */
  value?: string;
  /** The size; `compact` is the search of the compact toolbar. */
  size?: string;
}

/** Search: start icon `magnifying-glass` and the end icon that clears. */
export function search(text: SearchText): TemplateResult {
  return html`<nph-input
    type="search"
    size=${text.size ?? 'default'}
    label=${text.label}
    placeholder=${text.placeholder}
    icon-start="magnifying-glass"
    icon-end="xmark"
    clear-label=${text.clearLabel}
    value=${text.value ?? ''}
  ></nph-input>`;
}

export interface LabelledText {
  label: string;
  placeholder: string;
  required?: boolean;
  value?: string;
  /** The name of the entry in the form data. */
  name?: string;
}

/** Field with a label: `nph-label for` names the input; the asterisk marks it required. */
export function fieldWithLabel(text: LabelledText): TemplateResult {
  const id = uniqueId('nph-input-demo');
  return html`<div style=${stack}>
    <nph-label for=${id} text=${text.label} ?required=${text.required ?? false}></nph-label>
    <nph-input
      id=${id}
      type="email"
      autocomplete="email"
      name=${text.name ?? nothing}
      placeholder=${text.placeholder}
      ?required=${text.required ?? false}
      value=${text.value ?? ''}
    ></nph-input>
  </div>`;
}

export interface ErrorText extends LabelledText {
  /** The sentence that says what to fix; `nph-field` will write it. */
  sentence: string;
}

/**
 * Error: the input in `erro`, with the sentence below it, outside the piece, and passed
 * as `description` so the screen reader reads it, as `nph-field` will do.
 */
export function withError(text: ErrorText): TemplateResult {
  const id = uniqueId('nph-input-demo');
  return html`<div style=${stack}>
    <nph-label for=${id} text=${text.label} ?required=${text.required ?? false}></nph-label>
    <nph-input
      id=${id}
      type="email"
      autocomplete="email"
      invalid
      description=${text.sentence}
      placeholder=${text.placeholder}
      ?required=${text.required ?? false}
      value=${text.value ?? ''}
    ></nph-input>
    <span
      aria-hidden="true"
      style="color: var(--nph-status-error); font-family: var(--nph-text-body-md-font-family); font-size: var(--nph-text-body-md-font-size); line-height: var(--nph-text-body-md-line-height);"
      >${text.sentence}</span
    >
  </div>`;
}
