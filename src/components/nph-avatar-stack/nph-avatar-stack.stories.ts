/**
 * VALIDATION stories of `nph-avatar-stack`.
 *
 * They prove the contract accepted in Figma (frame `1579:46`, set `1579:45`), the
 * decisions D1 to D3 of DSA-25 and P78: the three sizes, with and without the count;
 * the composition from two to five avatars, which is what the Figma `mostrar 3º`,
 * `mostrar 4º`, `mostrar 5º` and `mostrar contagem` turn on; photos and no photo in the
 * same group; the count that grows with the number; and the name of the group. Every
 * story shows the same pieces in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67). The three required examples of the
 * frame — "Task owners", "Meeting participants" and "Members in the list" — are on the
 * Docs page, each in light and dark mode.
 *
 * The group has no hover, focus or disabled look: there is no interaction state to
 * show. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`). The name of each group and the captions come from the
 * language dictionary, under the key `avatarStackValidation` (`docs/i18n.md`,
 * "Storybook"); the row and column names of the matrices are the technical attributes,
 * the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-avatar-stack';
import { PHOTO_A, PHOTO_B, PHOTO_C } from '../nph-avatar/nph-avatar.demo';
import { inScheme, stack } from './nph-avatar-stack.demo';
import type { Scheme } from './nph-avatar-stack.demo';

const meta: Meta = {
  title: 'Components/nph-avatar-stack/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).avatarStackValidation;
}

/** The name of a group: how many show, and how many more the count says. */
function nameOf(context: GlobalsContext | undefined, shown: number, more: number): string {
  const v = t(context);
  return more > 0 ? format(v.groupMoreLabel, { shown, more }) : format(v.groupLabel, { shown });
}

/* Demonstration frame. Not a precedent for component CSS. */
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

const page = (storyId: string) => ({
  piece: 'nph-avatar-stack',
  storyId: `components-nph-avatar-stack-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-avatar-stack', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => inScheme(scheme, caption, content(`${title} · ${caption}`)))}
  </div>`;
}

const SIZES = ['sm', 'md', 'lg'] as const;

/** The three sizes, without and with the count: avatars of 24, 32 and 40 px, overlapped by avatar/overlap. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('sizes'),
      inBothModes(context, 'sizes', (label) =>
        matrix(
          label,
          ['count: 0', 'count: 3'],
          SIZES.map((size) => ({
            label: `size: ${size}`,
            cells: [stack(size, 3, 0, nameOf(context, 3, 0)), stack(size, 3, 3, nameOf(context, 3, 3))],
          })),
        ),
      ),
    ),
};

/** Composition: two to five avatars, with and without the count — the Figma `mostrar 3º`, `mostrar 4º`, `mostrar 5º` and `mostrar contagem`. */
export const Composition: Story = {
  name: 'Composition',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('composition'),
      inBothModes(context, 'composition', (label) =>
        matrix(
          label,
          ['count: 0', 'count: 3'],
          [2, 3, 4, 5].map((shown) => ({
            label: `nph-avatar × ${shown}`,
            cells: [stack('md', shown, 0, nameOf(context, shown, 0)), stack('md', shown, 3, nameOf(context, shown, 3))],
          })),
        ),
      ),
    ),
};

/** Photo: photos and no photo in the same group; each avatar keeps its own type, and its border separates it. */
export const Photo: Story = {
  name: 'Photo',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('photo'),
      inBothModes(context, 'photo', (label) =>
        matrix(
          label,
          SIZES.map((size) => `size: ${size}`),
          [
            { label: 'src', cells: SIZES.map((size) => stack(size, 3, 2, nameOf(context, 3, 2), [PHOTO_A, PHOTO_B, PHOTO_C])) },
            { label: 'no src', cells: SIZES.map((size) => stack(size, 3, 2, nameOf(context, 3, 2), [undefined, undefined, undefined])) },
            { label: 'src · no src', cells: SIZES.map((size) => stack(size, 3, 2, nameOf(context, 3, 2), [PHOTO_A, undefined, PHOTO_C])) },
          ],
        ),
      ),
    ),
};

/** Count width: the count starts as a square of the avatar size and grows with the number, keeping its height. */
export const CountWidth: Story = {
  name: 'Count width',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('count-width'),
      inBothModes(context, 'count-width', (label) =>
        matrix(
          label,
          ['count: 3', 'count: 12', 'count: 128'],
          SIZES.map((size) => ({
            label: `size: ${size}`,
            cells: [3, 12, 128].map((more) => stack(size, 2, more, nameOf(context, 2, more))),
          })),
        ),
      ),
    ),
};

/** Accessibility: the group is read as one image with the names and the total; the avatars and the count are not read. */
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
                ${stack('md', 3, 3, v.namedGroup)}
                <span>${v.namedGroupCaption}</span>
              </div>`,
            ],
          },
        ]),
      ),
    );
  },
};
