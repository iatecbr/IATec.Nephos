/**
 * Demonstration frame shared by the `nph-slider` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here — the framed figure and its gaps — is NOT a precedent for
 * component CSS: the piece takes every measure from tokens.
 *
 * The three examples are the required ones of the accepted board (`1636:46`):
 * "Brightness" (`text` on), "Price range" (`mode="range"` with `inputs`) and "Volume"
 * (vertical, with `limits`). The functions take the visible text as arguments: this file
 * holds none, because every visible text comes from the language dictionary of the page
 * that calls it.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-field/nph-field';
import './nph-slider';

export type Scheme = 'light' | 'dark';

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

/** Brightness: one value, with the label and the value above the track. */
export function brightness(text: { label: string; value?: number }): TemplateResult {
  return html`<nph-slider text=${text.label} value=${text.value ?? 70}></nph-slider>`;
}

export interface PriceRangeText {
  label: string;
  startLabel: string;
  endLabel: string;
  /** The name of the entry in the form data. */
  name?: string;
}

/** Price range: start and end, with a field at each end. */
export function priceRange(text: PriceRangeText): TemplateResult {
  return html`<nph-slider
    mode="range"
    inputs
    min="0"
    max="500"
    step="10"
    start="100"
    end="350"
    name=${text.name ?? nothing}
    label=${text.label}
    start-label=${text.startLabel}
    end-label=${text.endLabel}
    style="inline-size: var(--nph-layout-field-width);"
  ></nph-slider>`;
}

/** Volume: vertical, with the minimum at the bottom and the maximum at the top. */
export function volume(text: { label: string }): TemplateResult {
  return html`<nph-slider orientation="vertical" limits label=${text.label} value="40"></nph-slider>`;
}

export interface InFieldText {
  label: string;
  help?: string;
  error?: string;
}

/** Inside `nph-field`: the field gives the label, the help and the error; `text` stays off. */
export function inField(text: InFieldText): TemplateResult {
  return html`<nph-field label=${text.label} help=${text.help ?? nothing} error=${text.error ?? nothing}>
    <nph-slider value="80"></nph-slider>
  </nph-field>`;
}
