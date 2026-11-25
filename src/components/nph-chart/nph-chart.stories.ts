/**
 * VALIDATION stories of `nph-chart`.
 *
 * They prove the contract accepted in Figma (frame `7817:4454`, set `7653:286`) and the task DSA-101: the ten types, the five
 * states of the area, the legend with six series, and the cases the set does not draw (a goal and a highlight, a negative
 * value, a column with no data, a long category and twelve categories). Each example sits in an `nph-card`, in light and in
 * dark mode, in the same story. The series colors follow the order and not the brand, so there is no story per brand. Every
 * visible text comes from the language dictionary under `chartValidation` (`docs/i18n.md`, "Storybook").
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { validationPage, validationTitle } from '../../shared/docs/validation';
import { GRID_STYLE, PERIOD_GRID_STYLE, chart, inCard, inScheme, longSpec, manySpec, missingSpec, negativeSpec, paymentsSpec, quarterSpec, revenueSpec, sixSpecs, typeSpecs } from './nph-chart.demo';
import type { ChartText, Scheme } from './nph-chart.demo';

const meta: Meta = {
  title: 'Components/nph-chart/Validation',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined): ChartText {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).chartValidation as ChartText;
}

const page = (storyId: string) => ({
  piece: 'nph-chart',
  storyId: `components-nph-chart-validation--${storyId}`,
  sheet: true,
});

/** The same demonstration in both modes, each with its caption. */
function inBothModes(text: ChartText, content: () => ReturnType<typeof html>) {
  const modes: Array<[Scheme, string]> = [
    ['light', text.lightCaption],
    ['dark', text.darkCaption],
  ];
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section);">
    ${modes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}
  </div>`;
}

/** The ten types of the Figma `tipo`, one example of each. */
export const Types: Story = {
  name: 'Types',
  render: (_args, context: GlobalsContext) => {
    const text = t(context);
    return validationPage(
      context,
      page('types'),
      inBothModes(
      text,
      () => html`<div style=${GRID_STYLE}>
        ${typeSpecs(text).map(({ heading, description, spec }) => inCard(text, heading, description, chart(text, spec)))}
      </div>`,
    ));
  },
};

/** The five states of the area: default, loading, empty, no result and error. The card header stays. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const text = t(context);
    const states = ['default', 'loading', 'empty', 'no-result', 'error'] as const;
    return validationPage(
      context,
      page('states'),
      inBothModes(
      text,
      () => html`<div style=${PERIOD_GRID_STYLE}>
        ${states.map((state) =>
          inCard(text, text.titleRevenue, text.descriptionRevenue, chart(text, { ...revenueSpec(text), state }), true),
        )}
      </div>`,
    ));
  },
};

/** The required examples of the frame: a column with a highlight and a goal, a grouped vertical and a donut. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const text = t(context);
    return validationPage(
      context,
      page('examples'),
      inBothModes(
      text,
      () => html`<div style=${PERIOD_GRID_STYLE}>
        ${inCard(text, text.titleRevenue, text.descriptionRevenue, chart(text, revenueSpec(text)), true)}
        ${inCard(text, text.titleQuarter, text.descriptionQuarter, chart(text, quarterSpec(text)))}
        ${inCard(text, text.titlePayments, text.descriptionPayments, chart(text, paymentsSpec(text)))}
      </div>`,
    ));
  },
};

/** Six series: a legend below the area, one line per slice in the donut, and the group of the smaller ones in `chart/muted`. */
export const Legend: Story = {
  name: 'Legend',
  render: (_args, context: GlobalsContext) => {
    const text = t(context);
    return validationPage(
      context,
      page('legend'),
      inBothModes(
      text,
      () => html`<div style=${GRID_STYLE}>
        ${sixSpecs(text).map((spec) => inCard(text, text.titleSix, text.descriptionCosts, chart(text, spec)))}
      </div>`,
    ));
  },
};

/** What the set does not draw: a negative value, a column with no data, a long category and twelve categories. */
export const Limits: Story = {
  name: 'Limits',
  render: (_args, context: GlobalsContext) => {
    const text = t(context);
    return validationPage(
      context,
      page('limits'),
      inBothModes(
      text,
      () => html`<div style=${GRID_STYLE}>
        ${inCard(text, text.titleNegative, text.descriptionRevenue, chart(text, negativeSpec(text)))}
        ${inCard(text, text.titleMissing, text.descriptionRevenue, chart(text, missingSpec(text)))}
        ${inCard(text, text.titleLong, text.descriptionRegion, chart(text, longSpec(text)))}
        ${inCard(text, text.titleMany, text.descriptionRevenue, chart(text, manySpec(text)))}
      </div>`,
    ));
  },
};

/** The seven brands in light and dark: the focus border and halo of the legend item follow the brand; the series colors do not. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const text = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-chart', page('brands').storyId), () =>
        chart(text, quarterSpec(text)),
      ),
    );
  },
};
