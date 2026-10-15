/**
 * Demonstration frame shared by the `nph-skeleton` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does
 * not index it. The scenery here — widths, gaps, the card border — is NOT a
 * precedent for component CSS: the piece itself takes its measures from
 * `skeleton/line-height` and `avatar/size-*`, and the consumer gives the rest.
 *
 * Each example is the loading container of the Figma frame (`1578:38`): the
 * container carries `aria-busy` while it waits, and the shapes repeat the shape of
 * the content that will come in. It has no visible text: the skeleton holds none.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-skeleton';

export type Scheme = 'light' | 'dark';

const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);';
const row = 'display: flex; align-items: center; gap: var(--nph-space-inline);';

/**
 * The same example in a color scheme of its own, on the same element that
 * resolves the tokens (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** A list of people: an `sm` avatar and two lines per person. */
export function peopleList(): TemplateResult {
  const person = html`<div style=${row}>
    <nph-skeleton shape="avatar-sm"></nph-skeleton>
    <div style="${column} flex: 1;">
      <nph-skeleton></nph-skeleton>
      <div style="inline-size: 60%;"><nph-skeleton></nph-skeleton></div>
    </div>
  </div>`;
  return html`<div aria-busy="true" style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${person} ${person} ${person}
  </div>`;
}

/** A card: a block in place of the image and lines in place of the text. */
export function cardLoading(): TemplateResult {
  return html`<div aria-busy="true" style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    <nph-skeleton shape="block" style="aspect-ratio: 16 / 9;"></nph-skeleton>
    <div style=${column}>
      <nph-skeleton></nph-skeleton>
      <div style="inline-size: 80%;"><nph-skeleton></nph-skeleton></div>
    </div>
  </div>`;
}

/** A paragraph: one line per text line. */
export function paragraphLoading(): TemplateResult {
  return html`<div aria-busy="true" style=${column}>
    <nph-skeleton></nph-skeleton>
    <nph-skeleton></nph-skeleton>
    <nph-skeleton></nph-skeleton>
    <div style="inline-size: 40%;"><nph-skeleton></nph-skeleton></div>
  </div>`;
}
