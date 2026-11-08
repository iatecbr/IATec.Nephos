/**
 * VALIDATION stories of `nph-hover-card`.
 *
 * They prove the contract accepted in Figma (documentation frame `4422:2418`, component set
 * `4406:1105`) and P112: the card on its four sides, without the arrow and with it; the meta line
 * as a phrase, a relative time with the full date in the title, a date, a time, and off; the link
 * in the line of a sentence with the card closed; the mirror in right-to-left writing; and the three
 * required examples in light and in dark mode, in the same story. Each page opens with what it
 * proves, and the matrix names its rows by attribute, as on the Docs page. All visible text,
 * including the sample content of the cards, comes from the language dictionary, under the
 * `hoverCardValidation` and `validationPages` keys (`docs/i18n.md`, "Storybook").
 *
 * The opening by the pointer resting on the link and by keyboard focus are interaction states: they
 * show up by moving the mouse over the link and by pressing Tab, and the tests prove them, the delays
 * and the focus ring. Here the card is drawn open with the `open` property, so every side and every
 * part is on the page at once.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { BRAND_CONTRAST_EXCEPTION, brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-hover-card';
import { bothModes, card, examples, inSentence, metaKind } from './nph-hover-card.demo';
import type { ExampleTexts } from './nph-hover-card.demo';

const meta: Meta = {
  title: 'Components/nph-hover-card/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).hoverCardValidation as unknown as ExampleTexts;
}

const page = (storyId: string) => ({ piece: 'nph-hover-card', storyId: `components-nph-hover-card-validation--${storyId}` });

/** The card on its four sides, without the arrow and with it, open: the link and the card 4 apart, or the arrow tip 4 from the link. */
export const Sides: Story = {
  name: 'Sides',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('sides'),
      matrix(validationTitle(context, 'nph-hover-card', page('sides').storyId), [], [
        { label: 'arrow: off · side: bottom', cells: [card(v, { side: 'bottom' })] },
        { label: 'arrow: on · side: bottom', cells: [card(v, { side: 'bottom', arrow: true })] },
        { label: 'arrow: on · side: top', cells: [card(v, { side: 'top', arrow: true })] },
        { label: 'arrow: on · side: left', cells: [card(v, { side: 'left', arrow: true })] },
        { label: 'arrow: on · side: right', cells: [card(v, { side: 'right', arrow: true })] },
      ]),
    );
  },
};

/** The meta line as a phrase, a relative time with the full date in the title, a date, a time, and off. */
export const MetaLine: Story = {
  name: 'MetaLine',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('meta-line'),
      matrix(validationTitle(context, 'nph-hover-card', page('meta-line').storyId), [], [
        { label: 'meta: phrase · meta-icon: clock', cells: [metaKind(v, 'phrase')] },
        { label: 'meta: relative time · meta-title: full date', cells: [metaKind(v, 'relative')] },
        { label: 'meta: date · meta-icon: calendar', cells: [metaKind(v, 'date')] },
        { label: 'meta: time · meta-icon: clock', cells: [metaKind(v, 'time')] },
        { label: 'meta: off', cells: [metaKind(v, 'off')] },
      ]),
    );
  },
};

/** The link at rest in the line of a sentence, the card closed; and the same link with the card open. */
export const InSentence: Story = {
  name: 'InSentence',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('in-sentence'),
      matrix(validationTitle(context, 'nph-hover-card', page('in-sentence').storyId), [], [
        { label: 'open: off', cells: [inSentence(v)] },
        { label: 'open: on', cells: [html`<div style="padding-block-end: calc(var(--nph-hover-card-width) / 2);">${inSentence(v, true)}</div>`] },
      ]),
    );
  },
};

/** In right-to-left writing the card starts at the right of the link and the arrow keeps pointing to its center. */
export const Direction: Story = {
  name: 'Direction',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('direction'),
      matrix(
        validationTitle(context, 'nph-hover-card', page('direction').storyId),
        [],
        (['ltr', 'rtl'] as const).map((dir) => ({
          label: `dir: ${dir}`,
          cells: [html`<div dir=${dir}>${card(v, { arrow: true })}</div>`],
        })),
      ),
    );
  },
};

/** The three required examples — profile, link summary and item — in light and in dark. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => examples(v)),
    );
  },
};

/**
 * The seven brands in light and dark (DSA-36): the focus border and halo of the link follow the brand.
 * Carries `BRAND_CONTRAST_EXCEPTION` (`src/shared/docs/brands.ts`): the link is painted in
 * `color/primary`, which in the dark scheme of some brands resolves to 2.71:1 up to 3.81:1 over the
 * dark background (point 9 of the accepted documentation names `gerencial`: the fix belongs to
 * `color/primary` of the brand, and the underline stays; D-3 of DSA-68 for Indiane). It is a token
 * limit, and tokens come from Figma. The exception leaves when the token is fixed.
 */
export const Brands: Story = {
  name: 'Brands',
  parameters: { a11y: { options: { rules: BRAND_CONTRAST_EXCEPTION } } },
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-hover-card', page('brands').storyId), () => card(v, { arrow: true })),
    );
  },
};
