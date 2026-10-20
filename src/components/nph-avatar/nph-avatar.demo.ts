/**
 * Demonstration frame and photo fixtures shared by the `nph-avatar` Validation and
 * Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does
 * not index it. The scenery here — the gaps, the framed figure, the hand-made
 * overlap — is NOT a precedent for component CSS: the piece itself takes every
 * measure from tokens, and the consumer gives the space between the avatar and the
 * name next to it (`space/inline`).
 *
 * Photos are data URIs of an abstract picture: no real person, no new binary asset
 * and no network address, so a page never leaves a 404 behind. The failure fixture
 * is a data URI that is not an image.
 *
 * The three examples are the required ones of the accepted frame (`1434:30`):
 * "Owner select", "Card header" and "Profile without photo". `nph-select` does not
 * exist yet, so "Owner select" is an avatar plus the name in a row, set apart by
 * `space/inline`: it is NOT the select. "Card header" is the same composition, one
 * size up, with a role line under the name. The functions take the visible text as
 * arguments: this file holds none, because every visible text comes from the
 * language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-avatar';
import type { NphAvatarSize } from './nph-avatar';

export type Scheme = 'light' | 'dark';

/** An abstract picture as a data URI: valid, and it carries no person. */
function picture(background: string, shape: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">` +
    `<rect width="80" height="80" fill="${background}"/>` +
    `<circle cx="28" cy="30" r="22" fill="${shape}"/>` +
    `<rect x="36" y="44" width="36" height="36" fill="${shape}" fill-opacity="0.6"/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Valid photos, to tell neighbors apart. */
export const PHOTO_A = picture('#2f4858', '#f6ae2d');
export const PHOTO_B = picture('#86bbd8', '#33658a');
export const PHOTO_C = picture('#f26419', '#2f4858');

/** A `src` that does not load: a data URI that says PNG but is not one. */
export const BROKEN_PHOTO = 'data:image/png;base64,this-is-not-an-image';

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

/**
 * Overlap done by hand, to show the avatar's own border as the separation: a plain
 * wrapper, and a negative start margin of `calc(-1 * var(--nph-space-inline))` on
 * every avatar but the first. The margin is the consumer's; the component never
 * sets it. `avatar/overlap` is not used here: it belongs to `nph-avatar-stack`
 * (planned), the piece that owns the overlap of a group.
 */
export function overlapped(size: NphAvatarSize, sources: readonly string[]): TemplateResult {
  return html`<div style="display: flex; align-items: center;">
    ${sources.map(
      (src, position) =>
        html`<nph-avatar
          size=${size}
          src=${src}
          style=${position === 0 ? '' : 'margin-inline-start: calc(-1 * var(--nph-space-inline));'}
        ></nph-avatar>`,
    )}
  </div>`;
}

/**
 * Owner select: the avatar at the start of an option, size `sm`, with the name next
 * to it. The avatar has no `label`: the name is right there, so it stays hidden from
 * the screen reader. Not the select, which does not exist yet.
 */
export function ownerSelect(name: string): TemplateResult {
  return html`<div style=${row}>
    <nph-avatar size="sm" src=${PHOTO_A}></nph-avatar>
    <span>${name}</span>
  </div>`;
}

/** Card header: the avatar at size `md` with the name and a role line under it. */
export function cardHeader(name: string, role: string): TemplateResult {
  return html`<div style=${row}>
    <nph-avatar size="md" src=${PHOTO_B}></nph-avatar>
    <div style="display: flex; flex-direction: column;">
      <strong>${name}</strong>
      <span style="color: var(--nph-color-muted-foreground);">${role}</span>
    </div>
  </div>`;
}

/** Profile without photo: size `lg` with no `src`, so the person icon shows. */
export function profileWithoutPhoto(name: string, role: string): TemplateResult {
  return html`<div style=${row}>
    <nph-avatar size="lg"></nph-avatar>
    <div style="display: flex; flex-direction: column;">
      <strong>${name}</strong>
      <span style="color: var(--nph-color-muted-foreground);">${role}</span>
    </div>
  </div>`;
}
