/**
 * VALIDATION stories of `nph-image`.
 *
 * They prove the contract accepted in Figma (frame `2677:465`, set `2573:66089`) and P90:
 * the seven sizes, square and `media`; the three proportions of `media`, and the proportion
 * ignored by the square sizes; the four content states derived from `src` (empty, loading,
 * loaded, error), with the spinner and the loading frame without a border; the clickable
 * image, with the veil and the eye on hover, the focus ring and the disabled look; and the
 * accessible name, with and without `alt`. Every story shows the same pieces in light and in
 * dark mode, in the same story, through `data-nph-color-scheme` on the frame (P20, P67). The
 * three required examples of the frame — list item, card cover and upload without an image —
 * are on the Docs page, each in light and dark mode.
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a clickable
 * image and by pressing Tab, in the Interaction story. Empty and error draw the frame only,
 * until the illustrations arrive (D1 of DSA-51). Each page opens with what it proves, from
 * the dictionary (`validationPages.claims`). The example text and the captions come from the
 * language dictionary, under the key `imageValidation` (`docs/i18n.md`, "Storybook"); the
 * row and column names of the matrices are the technical attributes, the same in any
 * language. The images are data URIs of an abstract picture, defined in `nph-image.demo.ts`,
 * which also holds the loading state on the page.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-image';
import { NPH_IMAGE_RATIOS, NPH_IMAGE_SIZES } from './nph-image';
import { BROKEN_IMAGE, IMAGE_A, IMAGE_B, IMAGE_WIDE, inScheme, stalled } from './nph-image.demo';
import type { Scheme } from './nph-image.demo';

const meta: Meta = {
  title: 'Components/nph-image/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).imageValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-image-gap);';

const page = (storyId: string) => ({
  piece: 'nph-image',
  storyId: `components-nph-image-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-image', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => inScheme(scheme, caption, content(`${title} · ${caption}`)))}
  </div>`;
}

/** The four content states of one size, in the order of Figma. */
function states(size: string, ratio = '1:1'): TemplateResult[] {
  return [
    html`<nph-image size=${size} ratio=${ratio}></nph-image>`,
    stalled(size, ratio),
    html`<nph-image size=${size} ratio=${ratio} src=${ratio === '1:1' ? IMAGE_A : IMAGE_WIDE}></nph-image>`,
    html`<nph-image size=${size} ratio=${ratio} src=${BROKEN_IMAGE}></nph-image>`,
  ];
}

/** The seven sizes, with an image and without: squares of 24 to 128 px and the media width. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('sizes'),
      inBothModes(context, 'sizes', (label) =>
        matrix(
          label,
          NPH_IMAGE_SIZES.map((size) => `size: ${size}`),
          [
            { label: 'src', cells: NPH_IMAGE_SIZES.map((size) => html`<nph-image size=${size} src=${IMAGE_A}></nph-image>`) },
            { label: 'no src', cells: NPH_IMAGE_SIZES.map((size) => html`<nph-image size=${size}></nph-image>`) },
          ],
        ),
      ),
    ),
};

/** Ratios: media takes 1:1, 4:3 and 16:9 on the same width; a square size ignores the ratio. */
export const Ratios: Story = {
  name: 'Ratios',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('ratios'),
      inBothModes(context, 'ratios', (label) =>
        matrix(
          label,
          NPH_IMAGE_RATIOS.map((ratio) => `ratio: ${ratio}`),
          [
            {
              label: 'size: media · src',
              cells: NPH_IMAGE_RATIOS.map((ratio) => html`<nph-image size="media" ratio=${ratio} src=${IMAGE_WIDE}></nph-image>`),
            },
            {
              label: 'size: media · no src',
              cells: NPH_IMAGE_RATIOS.map((ratio) => html`<nph-image size="media" ratio=${ratio}></nph-image>`),
            },
            {
              label: 'size: xl · src',
              cells: NPH_IMAGE_RATIOS.map((ratio) => html`<nph-image size="xl" ratio=${ratio} src=${IMAGE_B}></nph-image>`),
            },
          ],
        ),
      ),
    ),
};

/** States: empty, loading with the spinner and no border, the loaded image, and the image that failed. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('states'),
      inBothModes(context, 'states', (label) =>
        matrix(label, ['empty', 'loading', 'loaded', 'error'], [
          { label: 'size: md', cells: states('md') },
          { label: 'size: xl', cells: states('xl') },
          { label: 'size: media · ratio: 16:9', cells: states('media', '16:9') },
        ]),
      ),
    ),
};

/** Interaction: a clickable image shows the veil and the eye on hover and the ring on Tab; disabled fades it. */
export const Interaction: Story = {
  name: 'Interaction',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('interaction'),
      inBothModes(context, 'interaction', (label) =>
        matrix(label, ['interactive', 'interactive · disabled', 'disabled'], [
          {
            label: 'size: lg',
            cells: [
              html`<nph-image size="lg" src=${IMAGE_A} alt=${v.productMug} interactive></nph-image>`,
              html`<nph-image size="lg" src=${IMAGE_A} alt=${v.productMug} interactive disabled></nph-image>`,
              html`<nph-image size="lg" src=${IMAGE_A} alt=${v.productMug} disabled></nph-image>`,
            ],
          },
          {
            label: 'size: media · ratio: 16:9',
            cells: [
              html`<nph-image size="media" ratio="16:9" src=${IMAGE_WIDE} alt=${v.productCover} interactive></nph-image>`,
              html`<nph-image size="media" ratio="16:9" src=${IMAGE_WIDE} alt=${v.productCover} interactive disabled></nph-image>`,
              html`<nph-image size="media" ratio="16:9" src=${IMAGE_WIDE} alt=${v.productCover} disabled></nph-image>`,
            ],
          },
        ]),
      ),
    );
  },
};

/** Accessibility: with alt the image announces the content; with an empty alt it is hidden and the text beside it speaks. */
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
            label: 'alt',
            cells: [
              html`<div style=${row}>
                <nph-image size="lg" src=${IMAGE_A} alt=${v.productMug}></nph-image>
                <nph-image size="lg" src=${IMAGE_B} alt=${v.productLamp} interactive></nph-image>
              </div>`,
            ],
          },
          {
            label: 'no alt',
            cells: [
              html`<div style=${row}>
                <nph-image size="md" src=${IMAGE_B}></nph-image>
                <span>${v.productLamp}</span>
              </div>`,
            ],
          },
        ]),
      ),
    );
  },
};
