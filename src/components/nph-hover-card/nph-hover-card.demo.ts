/**
 * Demonstration frame shared by the `nph-hover-card` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the framed figure, the room kept around a link for its open card, the sentence
 * around an inline link — is NOT a precedent for component CSS: the piece takes its measures from
 * the `hover-card/*` tokens, and the card its place from the link, in the top layer.
 *
 * The three examples are the required ones of the accepted documentation (frame `4422:2418`): a
 * profile with an avatar, a link summary with an image and a date, and an item with a status and a
 * time. The Figma set has no slot for the avatar, the image and the badge: they sit in the slot
 * `media` of the piece (P112). Every visible text comes from the dictionary, passed in by the page
 * that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-avatar/nph-avatar';
import '../nph-badge/nph-badge';
import '../nph-image/nph-image';
import { PHOTO_A } from '../nph-avatar/nph-avatar.demo';
import { IMAGE_WIDE } from '../nph-image/nph-image.demo';
import './nph-hover-card';
import type { NphHoverCardSide } from './nph-hover-card';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `hoverCardValidation` dictionary. */
export interface ExampleTexts {
  lightCaption: string;
  darkCaption: string;
  linkText: string;
  heading: string;
  description: string;
  updatedToday: string;
  updatedDays: string;
  updatedDaysFull: string;
  date: string;
  time: string;
  sentenceBefore: string;
  sentenceAfter: string;
  profileLink: string;
  profileName: string;
  profileRole: string;
  profileJoined: string;
  profileJoinedFull: string;
  profileAvatarLabel: string;
  summaryLink: string;
  summaryTitle: string;
  summaryText: string;
  summaryDate: string;
  summaryImageAlt: string;
  itemLink: string;
  itemTitle: string;
  itemText: string;
  itemStatus: string;
  itemTime: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode. The open card is a descendant of the figure, so it
 * takes the scheme too.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: var(--nph-hover-card-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

/**
 * The room an open card needs around its link, so it does not cover the next example. Above or below
 * for the vertical sides, beside for the horizontal ones; `height` is the room the card itself takes,
 * a share of its width.
 */
export function room(side: NphHoverCardSide, height: 'half' | 'full', content: TemplateResult): TemplateResult {
  const span = height === 'half' ? 'calc(var(--nph-hover-card-width) / 2)' : 'var(--nph-hover-card-width)';
  const style =
    side === 'bottom'
      ? `padding-block-end: ${span};`
      : side === 'top'
        ? `padding-block-start: ${span};`
        : `padding-inline: var(--nph-hover-card-width); min-block-size: ${span}; display: flex; align-items: center;`;
  return html`<div style=${style}>${content}</div>`;
}

export interface CardOptions {
  side?: NphHoverCardSide;
  arrow?: boolean;
  /** Draws the card open. Closed, the piece is only its link. */
  open?: boolean;
  meta?: boolean;
  metaIcon?: string;
}

/** The card with a phrase in the meta line, and the room around its link. */
export function card(texts: ExampleTexts, { side = 'bottom', arrow = false, open = true, meta = true, metaIcon }: CardOptions = {}): TemplateResult {
  return room(
    side,
    'half',
    html`<nph-hover-card
      href="#nephos"
      heading=${texts.heading}
      description=${texts.description}
      meta=${meta ? texts.updatedToday : ''}
      meta-icon=${metaIcon ?? 'clock'}
      side=${side}
      ?arrow=${arrow}
      ?open=${open}
      >${texts.linkText}</nph-hover-card
    >`,
  );
}

/** The meta line in its three kinds of text — a phrase, a date and a time — and off. */
export function metaKind(texts: ExampleTexts, kind: 'phrase' | 'relative' | 'date' | 'time' | 'off'): TemplateResult {
  const byKind = {
    phrase: { meta: texts.updatedToday, icon: 'clock', title: '' },
    relative: { meta: texts.updatedDays, icon: 'clock', title: texts.updatedDaysFull },
    date: { meta: texts.date, icon: 'calendar', title: '' },
    time: { meta: texts.time, icon: 'clock', title: '' },
    off: { meta: '', icon: 'clock', title: '' },
  }[kind];
  return room(
    'bottom',
    'half',
    html`<nph-hover-card
      href="#nephos"
      heading=${texts.heading}
      description=${texts.description}
      meta=${byKind.meta}
      meta-icon=${byKind.icon}
      meta-title=${byKind.title}
      open
      >${texts.linkText}</nph-hover-card
    >`,
  );
}

/** The link at rest, inside a sentence: the card is closed and the link takes the line of the text. */
export function inSentence(texts: ExampleTexts, open = false): TemplateResult {
  return html`<p style="margin: 0; max-inline-size: var(--nph-hover-card-width);">
    ${texts.sentenceBefore}<nph-hover-card
      href="#nephos"
      heading=${texts.heading}
      description=${texts.description}
      meta=${texts.updatedToday}
      ?open=${open}
      >${texts.linkText}</nph-hover-card
    >${texts.sentenceAfter}
  </p>`;
}

/** Example 1, the profile: an avatar, a name, a role and a start date. */
export function profile(texts: ExampleTexts): TemplateResult {
  return room(
    'bottom',
    'full',
    html`<nph-hover-card
      href="#profile"
      heading=${texts.profileName}
      description=${texts.profileRole}
      meta=${texts.profileJoined}
      meta-icon="calendar"
      meta-title=${texts.profileJoinedFull}
      open
      >${texts.profileLink}<nph-avatar slot="media" size="lg" src=${PHOTO_A} label=${texts.profileAvatarLabel}></nph-avatar
    ></nph-hover-card>`,
  );
}

/** Example 2, the link summary: an image, a title, a short text and a date. */
export function summary(texts: ExampleTexts): TemplateResult {
  return room(
    'bottom',
    'full',
    html`<nph-hover-card
      href="#summary"
      heading=${texts.summaryTitle}
      description=${texts.summaryText}
      meta=${texts.summaryDate}
      meta-icon="calendar"
      open
      >${texts.summaryLink}<nph-image slot="media" size="media" ratio="16:9" src=${IMAGE_WIDE} alt=${texts.summaryImageAlt}></nph-image
    ></nph-hover-card>`,
  );
}

/** Example 3, the item: a status, a title, a short text and a time. */
export function item(texts: ExampleTexts): TemplateResult {
  return room(
    'bottom',
    'half',
    html`<nph-hover-card
      href="#item"
      heading=${texts.itemTitle}
      description=${texts.itemText}
      meta=${texts.itemTime}
      open
      >${texts.itemLink}<nph-badge slot="media" severity="success" emphasis="light" text=${texts.itemStatus}></nph-badge
    ></nph-hover-card>`,
  );
}

/** The three required examples, one under the other, in the frame of a scheme. */
export function examples(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${profile(texts)} ${summary(texts)} ${item(texts)}
  </div>`;
}
