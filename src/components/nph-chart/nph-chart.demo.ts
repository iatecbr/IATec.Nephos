/**
 * Demonstration frame and fixtures shared by the `nph-chart` Validation stories.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The scenery here — the
 * width of the card, the grid of cards — is NOT a precedent for component CSS: the chart takes every measure from its
 * own tokens and its width from its container, and it is never used loose on the page, so every example sits in an
 * `nph-card` base type, with the title and the description (the unit) in the card and the period in its header action.
 *
 * The numbers are invented and carry no real data. This file holds no visible text: every text comes from the language
 * dictionary of the page that calls it (`chartValidation`).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import '../nph-card/nph-card';
import '../nph-toggle-group/nph-toggle-group';
import '../nph-togglebutton/nph-togglebutton';
import './nph-chart';
import type { NphChartHighlight, NphChartSeries, NphChartState, NphChartType } from './nph-chart';

export type Scheme = 'light' | 'dark';

/** The texts of the demonstration, from the dictionary (`chartValidation`). */
export interface ChartText {
  lightCaption: string;
  darkCaption: string;
  months: string[];
  regions: string[];
  quarters: string[];
  longCategory: string;
  revenue: string;
  expense: string;
  margin: string;
  taxes: string;
  freight: string;
  reserve: string;
  others: string;
  card: string;
  pix: string;
  slip: string;
  titleRevenue: string;
  descriptionRevenue: string;
  titleQuarter: string;
  descriptionQuarter: string;
  titlePayments: string;
  descriptionPayments: string;
  titleCosts: string;
  descriptionCosts: string;
  titleRegion: string;
  descriptionRegion: string;
  titleTrend: string;
  descriptionTrend: string;
  titleSix: string;
  titleNegative: string;
  titleMissing: string;
  titleLong: string;
  titleMany: string;
  periods: { month: string; quarter: string; year: string };
  periodLabel: string;
  unit: string;
  labels: {
    summary: string;
    goal: string;
    noData: string;
    noValue: string;
    category: string;
    value: string;
    difference: string;
    total: string;
    viewTable: string;
    viewChart: string;
    retry: string;
    error: string;
    loading: string;
    emptyHeading: string;
    emptyDescription: string;
    noResultHeading: string;
    noResultDescription: string;
    noSeriesHeading: string;
    noSeriesDescription: string;
  };
  highlightComparison: string;
  typeNames: Record<string, string>;
  seriesLabel: string;
  changeLabel: string;
}

/** The same demonstration in a color scheme of its own, on the element that resolves the tokens (P67). */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); box-sizing: border-box; flex: 1 1 100%; min-inline-size: 0;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

export const GRID_STYLE =
  'display: grid; grid-template-columns: repeat(auto-fit, minmax(var(--nph-layout-dialog-min-width), 1fr)); gap: var(--nph-space-stack);';

/** Cards that carry the period selector take the reading width of the frame (560), as in the accepted examples. */
export const PERIOD_GRID_STYLE =
  'display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--nph-layout-max-reading)), 1fr)); gap: var(--nph-space-stack);';

const series = (name: string, values: Array<number | null>, others = false): NphChartSeries =>
  others ? { name, values, others } : { name, values };

export interface ChartSpec {
  type: NphChartType;
  state?: NphChartState;
  categories: string[];
  series: NphChartSeries[];
  goal?: number;
  highlight?: NphChartHighlight;
  showValues?: boolean;
  unit?: boolean;
  summary?: string;
}

/** An `nph-chart` with every text of the dictionary written on it. */
export function chart(text: ChartText, spec: ChartSpec): TemplateResult {
  const l = text.labels;
  return html`<nph-chart
    type=${spec.type}
    state=${spec.state ?? 'default'}
    .categories=${spec.categories}
    .series=${spec.series}
    .highlight=${spec.highlight ?? null}
    .goal=${spec.goal ?? null}
    ?show-values=${spec.showValues === true}
    goal-label=${l.goal}
    unit=${spec.unit === false ? '' : text.unit}
    summary=${spec.summary ?? l.summary}
    total-label=${l.total}
    others-label=${text.others}
    type-label=${text.typeNames[spec.type] ?? ''}
    series-label=${text.seriesLabel}
    no-data-label=${l.noData}
    no-value-label=${l.noValue}
    category-label=${l.category}
    value-label=${l.value}
    difference-label=${l.difference}
    view-table-label=${l.viewTable}
    view-chart-label=${l.viewChart}
    retry-label=${l.retry}
    error-message=${l.error}
    loading-label=${l.loading}
    empty-heading=${l.emptyHeading}
    empty-description=${l.emptyDescription}
    no-result-heading=${l.noResultHeading}
    no-result-description=${l.noResultDescription}
    no-series-heading=${l.noSeriesHeading}
    no-series-description=${l.noSeriesDescription}
  ></nph-chart>`;
}

/** The card the chart lives in: the title, the description with the unit and, optionally, the period. */
export function inCard(text: ChartText, heading: string, description: string, content: TemplateResult, period = false): TemplateResult {
  return html`<nph-card type="base" surface="outlined" heading=${heading} description=${description}>
    ${period
      ? html`<nph-toggle-group slot="action" size="compact" label=${text.periodLabel} value="month">
          <nph-togglebutton value="month" text=${text.periods.month}></nph-togglebutton>
          <nph-togglebutton value="quarter" text=${text.periods.quarter}></nph-togglebutton>
          <nph-togglebutton value="year" text=${text.periods.year}></nph-togglebutton>
        </nph-toggle-group>`
      : ''}
    ${content}
  </nph-card>`;
}

export function revenueSpec(text: ChartText): ChartSpec {
  return {
    type: 'column',
    categories: text.months.slice(0, 6),
    series: [series(text.revenue, [62, 78, 54, 90, 71, 84])],
    goal: 75,
    highlight: { value: '48.200', change: '12%', direction: 'up', sense: 'positive', comparison: text.highlightComparison, changeLabel: text.changeLabel },
  };
}

export function quarterSpec(text: ChartText): ChartSpec {
  return {
    type: 'grouped-vertical',
    categories: text.quarters,
    series: [
      series(text.revenue, [62, 70, 58, 84]),
      series(text.expense, [40, 45, 52, 48]),
      series(text.margin, [22, 25, 6, 36]),
    ],
  };
}

export function paymentsSpec(text: ChartText): ChartSpec {
  return {
    type: 'donut',
    categories: [],
    series: [series(text.card, [496]), series(text.pix, [372]), series(text.slip, [248]), series(text.others, [124])],
  };
}

/** One example of each of the ten types, in the order of the Figma `tipo`. */
export function typeSpecs(text: ChartText): Array<{ heading: string; description: string; spec: ChartSpec }> {
  const three = [
    series(text.revenue, [62, 70, 58, 84, 76, 90]),
    series(text.expense, [40, 45, 52, 48, 55, 50]),
    series(text.margin, [22, 25, 6, 36, 21, 40]),
  ];
  const months = text.months.slice(0, 6);
  return [
    { heading: text.titleRevenue, description: text.descriptionRevenue, spec: revenueSpec(text) },
    {
      heading: text.titleRegion,
      description: text.descriptionRegion,
      spec: { type: 'horizontal-bar', categories: text.regions, series: [series(text.revenue, [48, 62, 90, 74, 36])], showValues: true },
    },
    { heading: text.titleQuarter, description: text.descriptionQuarter, spec: quarterSpec(text) },
    {
      heading: text.titleRegion,
      description: text.descriptionRegion,
      spec: { type: 'grouped-horizontal', categories: text.regions.slice(0, 3), series: three.map((item) => ({ ...item, values: item.values.slice(0, 3) })) },
    },
    { heading: text.titleCosts, description: text.descriptionCosts, spec: { type: 'stacked-vertical', categories: text.quarters, series: three.map((item) => ({ ...item, values: item.values.slice(0, 4) })) } },
    {
      heading: text.titleRegion,
      description: text.descriptionRegion,
      spec: { type: 'stacked-horizontal', categories: text.regions.slice(0, 4), series: three.map((item) => ({ ...item, values: item.values.slice(0, 4) })) },
    },
    { heading: text.titleCosts, description: text.descriptionCosts, spec: { type: 'line', categories: months, series: three } },
    { heading: text.titleTrend, description: text.descriptionTrend, spec: { type: 'area', categories: months, series: [three[0] as NphChartSeries] } },
    { heading: text.titlePayments, description: text.descriptionPayments, spec: paymentsSpec(text) },
    {
      heading: text.titleTrend,
      description: text.descriptionTrend,
      spec: { type: 'sparkline', categories: [], series: [series(text.revenue, [3, 5, 4, 7, 6, 9, 8, 11, 10, 12, 11, 14])] },
    },
  ];
}

/** Six series: the legend reads them, and the sixth is the group of the smaller ones. */
export function sixSpecs(text: ChartText): ChartSpec[] {
  const names = [text.revenue, text.expense, text.margin, text.taxes, text.freight, text.reserve];
  return [
    {
      type: 'line',
      categories: text.months.slice(0, 6),
      series: names.map((name, at) => series(name, [10 + at * 6, 14 + at * 5, 12 + at * 7, 20 + at * 4, 18 + at * 6, 24 + at * 3])),
    },
    { type: 'donut', categories: [], series: names.map((name, at) => series(name, [60 - at * 7], at === 5)) },
  ];
}

export function negativeSpec(text: ChartText): ChartSpec {
  return { type: 'column', categories: text.months.slice(0, 6), series: [series(text.margin, [12, -8, 20, -14, 6, 18])], showValues: true };
}

export function missingSpec(text: ChartText): ChartSpec {
  return { type: 'column', categories: text.months.slice(0, 6), series: [series(text.revenue, [62, 78, null, 90, 71, 84])] };
}

export function longSpec(text: ChartText): ChartSpec {
  return {
    type: 'horizontal-bar',
    categories: [...text.regions.slice(0, 4), text.longCategory],
    series: [series(text.revenue, [48, 62, 90, 74, 36])],
    showValues: true,
  };
}

export function manySpec(text: ChartText): ChartSpec {
  return {
    type: 'column',
    categories: text.months,
    series: [series(text.revenue, [62, 78, 54, 90, 71, 84, 66, 73, 80, 59, 88, 95])],
  };
}
