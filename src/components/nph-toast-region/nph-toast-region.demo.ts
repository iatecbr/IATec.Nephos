/**
 * Demonstration frame shared by the `nph-toast-region` Validation page and the stories of
 * `nph-notification` that show a stack of toasts.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here is NOT a precedent for component CSS: the piece takes its measures from its own
 * `toast-region/*` tokens.
 *
 * THE REAL REGION is fixed to the corner of the window, in the top layer, so a page cannot place it
 * next to other examples. `exampleScreen` is the stand-in the pages use to show the same column in
 * the flow of the page: the same gap, the same distance from the edge and the same alignment, read
 * from the same tokens, on a screen drawn in skeleton. `liveRegion` mounts the real piece.
 *
 * The functions take the visible text as arguments: this file holds none, because every visible text
 * comes from the language dictionary of the page that calls them.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-toast-region';

export type Screen = 'default' | 'compact';

/**
 * The column of toasts on an example screen in skeleton, ending at the corner: `toast-region/gap`
 * between the toasts, `toast-region/inset` (or `inset-compact`) from the edge, the end edge aligned.
 * On the compact screen the toasts take the width of the region. At most three show.
 */
export function exampleScreen(screen: Screen, toasts: TemplateResult[], label: string): TemplateResult {
  const compact = screen === 'compact';
  const inset = compact ? 'var(--nph-toast-region-inset-compact)' : 'var(--nph-toast-region-inset)';
  const width = compact ? 'var(--nph-layout-field-width)' : 'var(--nph-layout-dialog-md)';
  return html`<div
    role="group"
    aria-label=${label}
    style="box-sizing: border-box; inline-size: ${width}; max-inline-size: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; gap: var(--nph-toast-region-gap); padding: ${inset}; background: var(--nph-color-background-subtle); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control);"
  >
    ${compact ? html`<style>
          .compact-toasts > nph-notification { inline-size: 100%; max-inline-size: none; }
        </style>` : ''}
    ${toasts.slice(0, 3).map((toast) => (compact ? html`<div class="compact-toasts" style="inline-size: 100%;">${toast}</div>` : toast))}
  </div>`;
}

/** The real region, fixed to the corner of the window, with the toasts given. */
export function liveRegion(toasts: TemplateResult[], label: string): TemplateResult {
  return html`<nph-toast-region label=${label}>${toasts}</nph-toast-region>`;
}
