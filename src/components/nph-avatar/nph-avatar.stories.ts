/**
 * VALIDATION stories of `nph-avatar`.
 *
 * They prove the contract accepted in Figma (frame `1434:30`, set `1434:29`) and
 * P74: the three sizes with and without a photo; the photo that fills the frame;
 * the person icon without one; the photo that fails and leaves the icon; the border
 * drawn by the avatar over the photo, which keeps overlapped neighbors apart; and
 * the accessible name, with and without `label`. Every story shows the same pieces
 * in light and in dark mode, in the same story, through `data-nph-color-scheme` on
 * the frame (P20, P67). The three required examples of the frame — "Owner select",
 * "Card header" and "Profile without photo" — are on the Docs page, each in light
 * and dark mode.
 *
 * The avatar has no hover, focus or disabled look: there is no interaction state to
 * show. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`). The example text of the pieces and the captions come
 * from the language dictionary, under the key `avatarValidation`
 * (`docs/i18n.md`, "Storybook"); the row and column names of the matrices are the
 * technical attributes, the same in any language. The photos are data URIs of an
 * abstract picture, defined in `nph-avatar.demo.ts`.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-avatar';
import { BROKEN_PHOTO, PHOTO_A, PHOTO_B, PHOTO_C, inScheme, overlapped } from './nph-avatar.demo';
import type { Scheme } from './nph-avatar.demo';

const meta: Meta = {
  title: 'Components/nph-avatar/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).avatarValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

const page = (storyId: string) => ({
  piece: 'nph-avatar',
  storyId: `components-nph-avatar-validation--${storyId}`,
});

/** What a story draws in one mode; the caption names the mode. */
type ModeContent = (title: string) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: ModeContent): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  const title = validationTitle(context, 'nph-avatar', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => inScheme(scheme, caption, content(`${title} · ${caption}`)))}
  </div>`;
}

/** The three sizes side by side: the columns of every matrix. */
const SIZE_COLUMNS = ['size: sm', 'size: md', 'size: lg'];
const SIZES = ['sm', 'md', 'lg'] as const;

/** One avatar per size, each from the same source. */
function perSize(src: string | undefined): TemplateResult[] {
  return SIZES.map((size) =>
    src === undefined ? html`<nph-avatar size=${size}></nph-avatar>` : html`<nph-avatar size=${size} src=${src}></nph-avatar>`,
  );
}

/** The three sizes, with a photo and without: boxes of 24, 32 and 40 px, square, with a rounded corner. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('sizes'),
      inBothModes(context, 'sizes', (label) =>
        matrix(label, SIZE_COLUMNS, [
          { label: 'src', cells: perSize(PHOTO_A) },
          { label: 'no src', cells: perSize(undefined) },
        ]),
      ),
    ),
};

/** Photo: a valid `src` fills the frame, the icon gives way, and the border stays over the picture. */
export const Photo: Story = {
  name: 'Photo',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('photo'),
      inBothModes(context, 'photo', (label) =>
        matrix(label, SIZE_COLUMNS, [
          { label: 'src: a', cells: perSize(PHOTO_A) },
          { label: 'src: b', cells: perSize(PHOTO_B) },
          { label: 'src: c', cells: perSize(PHOTO_C) },
        ]),
      ),
    ),
};

/** No photo: without `src` the person icon shows at the size of the avatar; `<nph-avatar>` alone draws it. */
export const NoPhoto: Story = {
  name: 'No photo',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('no-photo'),
      inBothModes(context, 'no-photo', (label) =>
        matrix(label, SIZE_COLUMNS, [
          { label: 'no src', cells: perSize(undefined) },
          {
            label: 'src: ""',
            cells: SIZES.map((size) => html`<nph-avatar size=${size} src=""></nph-avatar>`),
          },
        ]),
      ),
    ),
};

/** Photo failed: a `src` that does not load keeps the person icon, with no event and no error. */
export const PhotoFailed: Story = {
  name: 'Photo failed',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('photo-failed'),
      inBothModes(context, 'photo-failed', (label) =>
        matrix(label, SIZE_COLUMNS, [
          { label: 'src: invalid', cells: perSize(BROKEN_PHOTO) },
          { label: 'src: a', cells: perSize(PHOTO_A) },
        ]),
      ),
    ),
};

/** Border: drawn by the avatar over the photo, so avatars overlapped by hand stay separated. */
export const Border: Story = {
  name: 'Border',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('border'),
      inBothModes(context, 'border', (label) =>
        matrix(label, [], [
          { label: 'size: sm', cells: [overlapped('sm', [PHOTO_A, PHOTO_B, PHOTO_C, PHOTO_A])] },
          { label: 'size: md', cells: [overlapped('md', [PHOTO_A, PHOTO_B, PHOTO_C, PHOTO_A])] },
          { label: 'size: lg', cells: [overlapped('lg', [PHOTO_A, PHOTO_B, PHOTO_C, PHOTO_A])] },
        ]),
      ),
    ),
};

/** Accessibility: with `label` the avatar announces the name; without it, it is hidden and the name beside it speaks. */
export const Accessibility: Story = {
  name: 'Accessibility',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('accessibility'),
      inBothModes(context, 'accessibility', (label) =>
        matrix(label, [], [
          {
            label: 'label',
            cells: [
              html`<div style=${row}>
                <nph-avatar size="md" src=${PHOTO_A} label=${v.personAna}></nph-avatar>
                <nph-avatar size="md" label=${v.personBruno}></nph-avatar>
              </div>`,
            ],
          },
          {
            label: 'no label',
            cells: [
              html`<div style=${row}>
                <nph-avatar size="md" src=${PHOTO_B}></nph-avatar>
                <span>${v.personCarla}</span>
              </div>`,
            ],
          },
        ]),
      ),
    );
  },
};
