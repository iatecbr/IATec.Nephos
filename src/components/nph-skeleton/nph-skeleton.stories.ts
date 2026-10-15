/**
 * VALIDATION stories of `nph-skeleton`.
 *
 * They prove the contract accepted in Figma (frame `1578:38`, set `1578:37`) and
 * P69: the five shapes of the property `forma` (`shape` in code) and the three
 * required examples — a list of people, a card and a paragraph loading — each in
 * light and in dark mode, in the same story. The loading container carries
 * `aria-busy`; the shapes are decorative. The only visible text, the caption of
 * each mode, comes from the language dictionary under `skeletonValidation`
 * (`docs/i18n.md`, "Storybook"). `color/muted` varies by mode and not by brand,
 * so there is no story per brand.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-skeleton';
import { NPH_SKELETON_SHAPES } from './nph-skeleton';
import { cardLoading, inScheme, paragraphLoading, peopleList } from './nph-skeleton.demo';
import type { Scheme } from './nph-skeleton.demo';

const meta: Meta = {
  title: 'Components/nph-skeleton/Validation',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).skeletonValidation;
}

const page = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack); padding: var(--nph-space-section);';
const shapeRow = 'display: flex; flex-direction: column; gap: var(--nph-space-inline);';

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, content: () => ReturnType<typeof peopleList>) {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  return html`<div style=${page}>${modes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}</div>`;
}

/** The five shapes of the set: line, block and the three avatars, in both modes. */
export const Shapes: Story = {
  name: 'Shapes',
  render: (_args, context: GlobalsContext) =>
    inBothModes(
      context,
      () => html`<div style=${shapeRow}>
        ${NPH_SKELETON_SHAPES.map(
          (shape) => html`<nph-skeleton shape=${shape} style=${shape === 'block' ? 'aspect-ratio: 16 / 9;' : ''}></nph-skeleton>`,
        )}
      </div>`,
    ),
};

/** A list of people loading: an `sm` avatar and two lines per person. */
export const PeopleList: Story = {
  name: 'People list',
  render: (_args, context: GlobalsContext) => inBothModes(context, peopleList),
};

/** A card loading: a block in place of the image and lines in place of the text. */
export const Card: Story = {
  name: 'Card',
  render: (_args, context: GlobalsContext) => inBothModes(context, cardLoading),
};

/** A paragraph loading: one line per text line. */
export const Paragraph: Story = {
  name: 'Paragraph',
  render: (_args, context: GlobalsContext) => inBothModes(context, paragraphLoading),
};
