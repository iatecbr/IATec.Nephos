/**
 * Demonstration frame shared by the `nph-empty` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here — the framed figure, the surfaces and the list frame — is NOT
 * a precedent for component CSS: the piece takes its measures from its own tokens and its
 * background from the piece that receives it.
 *
 * The `nph-combobox` does not exist yet (DSA-46). `comboboxList` is a frame that stands in
 * for its option list in `state=vazio`, drawn with the list surface tokens; DSA-46 replaces
 * it with the real piece.
 *
 * The functions take the visible text as arguments: this file holds none, because every
 * visible text comes from the language dictionary of the page that calls it.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-empty';

export type Scheme = 'light' | 'dark';

/** The two surfaces of the contrast criterion of the accepted board. */
export const SURFACES = ['--nph-color-background', '--nph-color-popover'] as const;

export type Surface = (typeof SURFACES)[number];

export interface EmptyText {
  heading: string;
  description?: string;
}

/** One `nph-empty` with the given text; no description when it is not given. */
export function empty({ heading, description }: EmptyText): TemplateResult {
  return html`<nph-empty heading=${heading} description=${description ?? nothing}></nph-empty>`;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult, surface: Surface = '--nph-color-background'): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; align-items: center; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(${surface}); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult, surface?: Surface): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content(), surface)} ${inScheme('dark', captions.dark, content(), surface)}
  </div>`;
}

/**
 * Stand-in for the `nph-combobox` option list in `state=vazio`, until DSA-46: the list
 * surface, with the `nph-empty` as its only content.
 */
export function comboboxList(content: TemplateResult, label: string): TemplateResult {
  return html`<div
    role="group"
    aria-label=${label}
    style="display: flex; justify-content: center; background: var(--nph-color-popover); border: var(--nph-border-width) solid var(--nph-color-dropdown-border); border-radius: var(--nph-radius-control); box-shadow: var(--nph-elevation-dropdown);"
  >
    ${content}
  </div>`;
}
