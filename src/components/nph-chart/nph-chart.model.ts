/**
 * The data model of `nph-chart`: the types, the validation of the input and the pure
 * helpers the component and the layout share. Nothing here touches the DOM.
 *
 * Contract accepted in Figma (frame `7817:4454`, set `7653:286`), recorded as text in the
 * evidence of the `figma-docs-accepted` gate of DSA-101. The names of the types are the
 * Figma `tipo`, in English: `column`, `horizontal-bar`, `grouped-vertical`,
 * `grouped-horizontal`, `stacked-vertical`, `stacked-horizontal`, `line`, `area`, `donut`
 * and `sparkline`.
 */

export const NPH_CHART_TYPES = [
  'column',
  'horizontal-bar',
  'grouped-vertical',
  'grouped-horizontal',
  'stacked-vertical',
  'stacked-horizontal',
  'line',
  'area',
  'donut',
  'sparkline',
] as const;
export type NphChartType = (typeof NPH_CHART_TYPES)[number];

/** The Figma `estado` of the area. */
export const NPH_CHART_STATES = ['default', 'loading', 'empty', 'no-result', 'error'] as const;
export type NphChartState = (typeof NPH_CHART_STATES)[number];

export const NPH_CHART_DIRECTIONS = ['up', 'down', 'steady'] as const;
export type NphChartDirection = (typeof NPH_CHART_DIRECTIONS)[number];

export const NPH_CHART_SENSES = ['neutral', 'positive', 'negative'] as const;
export type NphChartSense = (typeof NPH_CHART_SENSES)[number];

/** The marker shapes, in the order of `chart/1` to `chart/6`. */
export const NPH_CHART_MARKER_SHAPES = ['circle', 'diamond', 'square', 'triangle', 'inverted-triangle', 'cross'] as const;
export type NphChartMarkerShape = (typeof NPH_CHART_MARKER_SHAPES)[number];

/** Up to six series have a color of their own; the seventh on is grouped into "Others". */
export const NPH_CHART_MAX_SERIES = 6;

/** A series: its name and one value per category; `null` is a category with no data. */
export interface NphChartSeries {
  name: string;
  values: Array<number | null>;
  /** A series that already is a group of the smaller ones ("Others"): drawn in `chart/muted`. */
  others?: boolean;
}

/** The highlight above the plot area: a value, its change and the sense the screen declares. */
export interface NphChartHighlight {
  value: string;
  change: string;
  /** The whole change as a sentence for a screen reader, such as "up 12% vs last month". Without it the arrow is silent. */
  changeLabel?: string;
  direction?: NphChartDirection;
  sense?: NphChartSense;
  comparison?: string;
}

export const NPH_CHART_SPARKLINE_MAX_VALUES = 12;

export function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

export const isVerticalCartesian = (type: NphChartType): boolean =>
  type === 'column' || type === 'grouped-vertical' || type === 'stacked-vertical' || type === 'line' || type === 'area';

export const isHorizontalCartesian = (type: NphChartType): boolean =>
  type === 'horizontal-bar' || type === 'grouped-horizontal' || type === 'stacked-horizontal';

export const isStacked = (type: NphChartType): boolean => type === 'stacked-vertical' || type === 'stacked-horizontal';

/** Column and horizontal bar take one series; the others take one or more. */
export const isSingleSeries = (type: NphChartType): boolean =>
  type === 'column' || type === 'horizontal-bar' || type === 'sparkline';

/**
 * The reading of the series: a direct label on the data (2 to 4 series), the legend
 * (above 4, and always in the grouped vertical) or nothing (one series, which the card
 * title names). The donut draws its own slice labels up to four slices.
 */
export type SeriesLabeling = 'none' | 'direct' | 'legend';

export function labelingOf(type: NphChartType, seriesCount: number): SeriesLabeling {
  if (type === 'sparkline') return 'none';
  if (type === 'donut') return seriesCount <= 4 ? 'direct' : 'legend';
  if (type === 'grouped-vertical') return seriesCount >= 2 ? 'legend' : 'none';
  if (seriesCount <= 1) return 'none';
  return seriesCount <= 4 ? 'direct' : 'legend';
}

export interface ChartInput {
  type: NphChartType | string;
  state: NphChartState | string;
  categories: readonly string[];
  series: readonly NphChartSeries[];
  highlight: NphChartHighlight | null;
}

/**
 * The causes that make the input invalid, one message each. A non-empty list means the
 * component draws nothing and emits `console.error` in development (the rule of P21).
 * Only the part that concerns the current state is checked: a chart in `loading`, `empty`,
 * `no-result` or `error` does not need data.
 */
export function inputProblems(input: ChartInput): string[] {
  const problems: string[] = [];
  if (!isOneOf(NPH_CHART_TYPES, input.type)) {
    problems.push(`type "${String(input.type)}" does not exist. Use ${NPH_CHART_TYPES.map((v) => `"${v}"`).join(', ')}.`);
    return problems;
  }
  if (!isOneOf(NPH_CHART_STATES, input.state)) {
    problems.push(`state "${String(input.state)}" does not exist. Use ${NPH_CHART_STATES.map((v) => `"${v}"`).join(', ')}.`);
    return problems;
  }
  if (input.highlight !== null) {
    const { direction, sense } = input.highlight;
    if (direction !== undefined && !isOneOf(NPH_CHART_DIRECTIONS, direction)) {
      problems.push(`highlight direction "${String(direction)}" does not exist. Use "up", "down" or "steady".`);
    }
    if (sense !== undefined && !isOneOf(NPH_CHART_SENSES, sense)) {
      problems.push(`highlight sense "${String(sense)}" does not exist. Use "neutral", "positive" or "negative".`);
    }
  }
  if (input.state !== 'default') return problems;

  const type = input.type;
  if (input.series.length === 0) {
    problems.push('"series" is empty. Use state="empty" or state="no-result" when there is no data.');
    return problems;
  }
  const slices = type === 'donut';
  if (!slices && input.categories.length === 0 && type !== 'sparkline') {
    problems.push('"categories" is empty: every type but the donut and the sparkline needs the category of each value.');
  }
  if (isSingleSeries(type) && input.series.length > 1) {
    problems.push(`type "${type}" takes one series; ${input.series.length} were given.`);
  }
  input.series.forEach((series, index) => {
    if (typeof series.name !== 'string' || series.name.trim() === '') {
      problems.push(`series ${index} has no name.`);
    }
    if (!Array.isArray(series.values)) {
      problems.push(`series ${index} has no "values" list.`);
      return;
    }
    if (slices) {
      const value = series.values[0];
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        problems.push(`series ${index} is a slice of the donut: its first value must be a number of zero or more.`);
      }
      return;
    }
    if (type === 'sparkline') {
      if (series.values.length > NPH_CHART_SPARKLINE_MAX_VALUES) {
        problems.push(`the sparkline takes up to ${NPH_CHART_SPARKLINE_MAX_VALUES} values; ${series.values.length} were given.`);
      }
    } else if (series.values.length !== input.categories.length) {
      problems.push(`series ${index} has ${series.values.length} values for ${input.categories.length} categories.`);
    }
    series.values.forEach((value, at) => {
      if (value === null) return;
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        problems.push(`series ${index}, value ${at} is not a finite number or null.`);
      } else if (value < 0 && isStacked(type)) {
        problems.push(`type "${type}" takes no negative value (series ${index}, value ${at}).`);
      }
    });
  });
  return problems;
}

/**
 * Up to six series keep their own color; from the seventh on they are grouped into one series,
 * "Others", in `chart/muted`, together with any series the consumer already marked `others`.
 * The values are summed per category; a category with no value in any of them stays `null`.
 */
export function groupSeries(series: readonly NphChartSeries[], othersLabel: string): NphChartSeries[] {
  const regular = series.filter((item) => item.others !== true);
  const marked = series.filter((item) => item.others === true);
  const kept = regular.slice(0, NPH_CHART_MAX_SERIES);
  const rest = [...regular.slice(NPH_CHART_MAX_SERIES), ...marked];
  if (rest.length === 0) return [...kept];
  const length = Math.max(...rest.map((item) => item.values.length));
  const values: Array<number | null> = Array.from({ length }, (_, at) => {
    let total: number | null = null;
    for (const item of rest) {
      const value = item.values[at];
      if (typeof value === 'number') total = (total ?? 0) + value;
    }
    return total;
  });
  return [...kept, { name: othersLabel, values, others: true }];
}

/** The number in the locale; the unit is said by the card description and the table header. */
export function formatValue(locale: string | undefined, value: number): string {
  const options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 };
  try {
    return new Intl.NumberFormat(locale === '' ? undefined : locale, options).format(value);
  } catch {
    return new Intl.NumberFormat(undefined, options).format(value);
  }
}

export function formatPercent(locale: string | undefined, ratio: number): string {
  const options: Intl.NumberFormatOptions = { style: 'percent', maximumFractionDigits: 0 };
  try {
    return new Intl.NumberFormat(locale === '' ? undefined : locale, options).format(ratio);
  } catch {
    return new Intl.NumberFormat(undefined, options).format(ratio);
  }
}

/** The signed difference of the table, as `+3` and `-13` (a real minus sign, not a hyphen). */
export function formatSigned(locale: string | undefined, value: number): string {
  if (value === 0) return formatValue(locale, 0);
  const text = formatValue(locale, Math.abs(value));
  return value > 0 ? `+${text}` : `\u2212${text}`;
}

/** The series that are not hidden, as indexes of the original list. */
export function visibleIndexes(count: number, hidden: ReadonlySet<number>): number[] {
  const list: number[] = [];
  for (let index = 0; index < count; index += 1) {
    if (!hidden.has(index)) list.push(index);
  }
  return list;
}

/**
 * The color token of a series. The order is fixed from `chart/1`, never by the active brand
 * or by situation; the group "Others" is `chart/muted`.
 */
export function colorOf(series: NphChartSeries, index: number): string {
  return series.others === true ? 'var(--nph-chart-muted)' : `var(--nph-chart-${Math.min(index, NPH_CHART_MAX_SERIES - 1) + 1})`;
}

export function softColorOf(series: NphChartSeries, index: number): string {
  return series.others === true
    ? 'var(--nph-chart-muted)'
    : `var(--nph-chart-${Math.min(index, NPH_CHART_MAX_SERIES - 1) + 1}-soft)`;
}

export function shapeOf(index: number): NphChartMarkerShape {
  return NPH_CHART_MARKER_SHAPES[Math.min(index, NPH_CHART_MARKER_SHAPES.length - 1)] ?? 'circle';
}

export interface TableData {
  columns: Array<{ key: string; header: string; align: 'start' | 'end' }>;
  rows: Array<{ key: string; cells: Record<string, string> }>;
}

export interface TableLabels {
  category: string;
  difference: string;
  /** The header of the value column of the donut table. */
  value: string;
  goal: string;
  noValue: string;
  /** The unit, written in the header: `Revenue (R$ thousand)`. */
  unit: string;
}

/**
 * The table alternative (D-3): the category first; one column per visible series with the
 * unit in the header; the goal as a column when the chart has one; with one series and a
 * goal, the signed difference under "Difference", with no unit in that header. A series
 * hidden by the legend leaves the table. The donut is the slice and its value.
 */
export function tableOf(
  input: { type: NphChartType; categories: readonly string[]; series: readonly NphChartSeries[]; goal: number | null },
  hidden: ReadonlySet<number>,
  locale: string | undefined,
  labels: TableLabels,
): TableData {
  const withUnit = (name: string): string => (labels.unit === '' ? name : `${name} (${labels.unit})`);
  const visible = visibleIndexes(input.series.length, hidden);
  if (input.type === 'donut') {
    return {
      columns: [
        { key: 'category', header: labels.category, align: 'start' },
        { key: 'value', header: withUnit(labels.value), align: 'end' },
      ],
      rows: visible.map((index) => {
        const series = input.series[index];
        const value = series?.values[0];
        return {
          key: `slice-${index}`,
          cells: { category: series?.name ?? '', value: typeof value === 'number' ? formatValue(locale, value) : labels.noValue },
        };
      }),
    };
  }
  const columns: TableData['columns'] = [{ key: 'category', header: labels.category, align: 'start' }];
  for (const index of visible) {
    columns.push({ key: `series-${index}`, header: withUnit(input.series[index]?.name ?? ''), align: 'end' });
  }
  const goal = input.goal;
  const hasGoal = goal !== null && isVerticalCartesian(input.type) && input.type !== 'sparkline';
  if (hasGoal) columns.push({ key: 'goal', header: withUnit(labels.goal), align: 'end' });
  const difference = hasGoal && visible.length === 1;
  if (difference) columns.push({ key: 'difference', header: labels.difference, align: 'end' });
  const rows = input.categories.map((category, at) => {
    const cells: Record<string, string> = { category };
    for (const index of visible) {
      const value = input.series[index]?.values[at];
      cells[`series-${index}`] = typeof value === 'number' ? formatValue(locale, value) : labels.noValue;
    }
    if (hasGoal && goal !== null) cells['goal'] = formatValue(locale, goal);
    if (difference && goal !== null) {
      const first = visible[0];
      const value = first === undefined ? null : input.series[first]?.values[at];
      cells['difference'] = typeof value === 'number' ? formatSigned(locale, value - goal) : labels.noValue;
    }
    return { key: `row-${at}`, cells };
  });
  return { columns, rows };
}
