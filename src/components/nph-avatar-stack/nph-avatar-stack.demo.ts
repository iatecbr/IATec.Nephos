/**
 * Demonstration frame shared by the `nph-avatar-stack` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here — the gaps and the framed figure — is NOT a precedent for
 * component CSS: the group takes every measure from tokens, and the consumer gives the
 * space between the group and the text next to it (`space/inline`).
 *
 * The photos are the abstract pictures of `nph-avatar.demo.ts`: no real person, no
 * new binary asset and no network address. The three examples are the required ones
 * of the accepted frame (`1579:46`): "Task owners" (`md`, three people), "Meeting
 * participants" (`md`, five avatars and the count) and "Members in the list" (`sm`,
 * three avatars and the count). The functions take the visible text and the name of
 * the group as arguments: this file holds none, because every visible text comes from
 * the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-avatar-stack';
import '../nph-avatar/nph-avatar';
import type { NphAvatarSize } from '../nph-avatar/nph-avatar';
import { PHOTO_A, PHOTO_B, PHOTO_C } from '../nph-avatar/nph-avatar.demo';

export { inScheme } from '../nph-avatar/nph-avatar.demo';
export type { Scheme } from '../nph-avatar/nph-avatar.demo';

/** Five people: photos and no photo mixed, as a real group is. `undefined` is no photo. */
export const PEOPLE: ReadonlyArray<string | undefined> = [PHOTO_A, undefined, PHOTO_B, PHOTO_C, undefined];

const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

/** One group: the first `shown` people, the count and the name. */
export function stack(
  size: NphAvatarSize,
  shown: number,
  count: number,
  label: string,
  people: ReadonlyArray<string | undefined> = PEOPLE,
): TemplateResult {
  return html`<nph-avatar-stack size=${size} count=${count} label=${label}>
    ${people.slice(0, shown).map((src) => (src === undefined ? html`<nph-avatar></nph-avatar>` : html`<nph-avatar src=${src}></nph-avatar>`))}
  </nph-avatar-stack>`;
}

/** Task owners: `md`, three people, next to the task. */
export function taskOwners(task: string, label: string): TemplateResult {
  return html`<div style=${row}><span>${task}</span>${stack('md', 3, 0, label)}</div>`;
}

/** Meeting participants: `md`, five avatars and the count of who does not show. */
export function meetingParticipants(meeting: string, label: string): TemplateResult {
  return html`<div style=${row}><span>${meeting}</span>${stack('md', 5, 4, label)}</div>`;
}

/** Members in the list: `sm`, three avatars and the count, before the team name. */
export function membersInList(team: string, label: string): TemplateResult {
  return html`<div style=${row}>${stack('sm', 3, 8, label)}<span>${team}</span></div>`;
}
