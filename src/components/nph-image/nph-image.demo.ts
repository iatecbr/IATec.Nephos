/**
 * Demonstration frame and image fixtures shared by the `nph-image` Validation and Docs
 * pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here — the gaps, the framed figure, the rows — is NOT a precedent
 * for component CSS: the piece itself takes every measure from tokens, and the consumer
 * gives the space between the image and the text next to it (`image/gap`).
 *
 * Images are data URIs of an abstract picture: no real product, no new binary asset and no
 * network address, so a page never leaves a 404 behind. The failure fixture is a data URI
 * that is not an image.
 *
 * The loading state lasts only while an image travels, and a data URI arrives at once. To
 * keep it on the page, `stalled` stands for an image that never arrives: once the piece has
 * drawn, it takes the address off the inner `<img>`, as a network that never answers would
 * leave it. The piece is untouched: it keeps showing its own loading state, and the event
 * guard of P90 ignores the aborted request.
 *
 * The three examples are the required ones of the accepted frame (`2677:465`): a list item
 * (`md` with the name next to it), a card cover (`media`, `16:9`) and an upload still
 * without an image (`lg`, empty). The functions take the visible text as arguments: this
 * file holds none, because every visible text comes from the language dictionary of the
 * page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';

import './nph-image';
import type { NphImage } from './nph-image';

export type Scheme = 'light' | 'dark';

/** An abstract picture as a data URI, in the proportion asked for. */
function picture(width: number, height: number, background: string, shape: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="${background}"/>` +
    `<circle cx="${width * 0.35}" cy="${height * 0.4}" r="${Math.min(width, height) * 0.25}" fill="${shape}"/>` +
    `<rect x="${width * 0.5}" y="${height * 0.5}" width="${width * 0.4}" height="${height * 0.4}" fill="${shape}" fill-opacity="0.6"/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Valid images, to tell neighbors apart. */
export const IMAGE_A = picture(80, 80, '#2f4858', '#f6ae2d');
export const IMAGE_B = picture(80, 80, '#86bbd8', '#33658a');
export const IMAGE_WIDE = picture(160, 90, '#f26419', '#2f4858');

/** A `src` that does not load: a data URI that says PNG but is not one. */
export const BROKEN_IMAGE = 'data:image/png;base64,this-is-not-an-image';

/** Holds the piece in its loading state: the image it waits for never arrives. */
function holdLoading(element: Element | undefined): void {
  const piece = element as NphImage | undefined;
  void piece?.updateComplete.then(() => piece.shadowRoot?.querySelector('img')?.removeAttribute('src'));
}

/** An image that never arrives, so the loading state stays on the page. */
export function stalled(size: string, ratio = '1:1'): TemplateResult {
  return html`<nph-image size=${size} ratio=${ratio} src=${IMAGE_A} ${ref(holdLoading)}></nph-image>`;
}

const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-image-gap);';

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

/**
 * List item: the image at size `md` with the product name next to it, set apart by
 * `image/gap`. The image has no `alt`: the name is right there, so it stays hidden from the
 * screen reader.
 */
export function listItem(name: string, detail: string): TemplateResult {
  return html`<div style=${row}>
    <nph-image size="md" src=${IMAGE_A}></nph-image>
    <div style="display: flex; flex-direction: column;">
      <strong>${name}</strong>
      <span style="color: var(--nph-color-muted-foreground);">${detail}</span>
    </div>
  </div>`;
}

/** Card cover: size `media` at `16:9`, with the title under it. The `alt` describes the cover. */
export function cardCover(alt: string, title: string): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline);">
    <nph-image size="media" ratio="16:9" src=${IMAGE_WIDE} alt=${alt}></nph-image>
    <strong>${title}</strong>
  </div>`;
}

/** Upload still without an image: size `lg` with no `src`, so the empty state shows, with the hint next to it. */
export function uploadEmpty(title: string, hint: string): TemplateResult {
  return html`<div style=${row}>
    <nph-image size="lg"></nph-image>
    <div style="display: flex; flex-direction: column;">
      <strong>${title}</strong>
      <span style="color: var(--nph-color-muted-foreground);">${hint}</span>
    </div>
  </div>`;
}
