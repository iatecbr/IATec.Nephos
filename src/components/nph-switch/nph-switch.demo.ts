/**
 * Demonstration frame shared by the `nph-switch` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does
 * not index it. The scenery here — the gaps, the framed figure, the width that makes a
 * long label wrap — is NOT a precedent for component CSS: the piece itself takes every
 * measure from tokens, and the consumer stacks several pieces, one per line.
 *
 * The three examples are the required ones of the accepted frame (`1549:2`): "Single
 * setting" (one option that turns on or off), "Preferences" (several settings stacked,
 * one per line) and "Unavailable setting" (disabled). The functions take the visible
 * text as arguments: this file holds none, because every visible text comes from the
 * language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-switch';

export type Scheme = 'light' | 'dark';

/* Several settings stack, one per line: the consumer gives the space between them. */
const stack = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-snug);';

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

/** A width that makes a long label wrap, so the track shows at the top of the first line. */
export function narrow(content: TemplateResult): TemplateResult {
  return html`<div style="max-inline-size: var(--nph-layout-field-width);">${content}</div>`;
}

/** Single setting: one option that turns on or off, with an immediate effect. */
export function singleSetting(text: string): TemplateResult {
  return html`<nph-switch text=${text} checked></nph-switch>`;
}

export interface PreferenceItem {
  text: string;
  checked?: boolean;
}

/** Preferences: several settings stacked, one per line. */
export function preferences(items: readonly PreferenceItem[]): TemplateResult {
  return html`<div style=${stack}>
    ${items.map((item) => html`<nph-switch text=${item.text} ?checked=${item.checked ?? false}></nph-switch>`)}
  </div>`;
}

/** Unavailable setting: disabled, the person cannot change it. */
export function unavailableSetting(text: string): TemplateResult {
  return html`<nph-switch text=${text} checked disabled></nph-switch>`;
}
