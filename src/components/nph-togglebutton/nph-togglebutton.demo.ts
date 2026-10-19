/**
 * Demonstration frame shared by the `nph-togglebutton` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does
 * not index it. The scenery here — the gaps, the framed figure — is NOT a
 * precedent for component CSS: the piece itself takes every measure from tokens,
 * and the consumer gives the space between neighboring pieces (`space/inline`).
 *
 * The three examples are the required ones of the accepted frame (`1512:27498`):
 * "Option off" (off, with text), "Option on" (on, with text and icons) and
 * "Icon set" (icon only, side by side, one on). The functions take the visible
 * text as arguments: this file holds none, because every visible text comes from
 * the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-togglebutton';

export type Scheme = 'light' | 'dark';

const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

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

/** Option off: off, with text and the default icons. */
export function optionOff(text: string): TemplateResult {
  return html`<nph-togglebutton text=${text}></nph-togglebutton>`;
}

/** Option on: on, with text and the default icons. */
export function optionOn(text: string): TemplateResult {
  return html`<nph-togglebutton text=${text} pressed></nph-togglebutton>`;
}

export interface IconSetItem {
  /** The accessible name of the icon-only piece. */
  label: string;
  /** A core icon name: one fixed icon. */
  icon: string;
  pressed?: boolean;
}

/** Icon set: icon only, side by side, with one on. */
export function iconSet(items: readonly IconSetItem[]): TemplateResult {
  return html`<div style=${row}>
    ${items.map(
      (item) =>
        html`<nph-togglebutton icon-start=${item.icon} label=${item.label} ?pressed=${item.pressed ?? false}></nph-togglebutton>`,
    )}
  </div>`;
}
