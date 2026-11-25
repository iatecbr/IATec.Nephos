/**
 * The geometry of `nph-chart`: from the data and the measures of the tokens in pixels to the
 * marks the component draws as SVG. Pure functions, with no DOM.
 *
 * D3 is a math utility here (decision of 2026-11-23, DSA-101): only `d3-scale`, `d3-shape` and
 * `d3-array`, the modules that do not touch the DOM. Lit draws the SVG, with the `chart/*`
 * tokens as CSS custom properties; this file only computes numbers and path strings. Nothing of D3
 * is part of the public contract of the component: no property, event or type takes a D3 structure.
 */
import { bisector, max, min } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import { arc as makeArc, area as makeArea, line as makeLine, pie as makePie } from 'd3-shape';

import { formatPercent, formatValue, isHorizontalCartesian, labelingOf, visibleIndexes } from './nph-chart.model';
import type { NphChartSeries, NphChartType, SeriesLabeling } from './nph-chart.model';

export type FontKey = 'caption' | 'labelSm' | 'headingMd';

/** The tokens of the chart in pixels, read from the browser, and the text measures. */
export interface Metrics {
  px: {
    yLabelGap: number;
    xLabelGap: number;
    dataLabelGap: number;
    seriesLabelGap: number;
    markerSize: number;
    barRadius: number;
    segmentGap: number;
    lineWidth: number;
    focusOffset: number;
    focusBorderWidth: number;
    focusHaloWidth: number;
    plotHeight: number;
    sparklineHeight: number;
    tooltipOffset: number;
  };
  lineHeight: Record<FontKey, number>;
  measure: (text: string, font: FontKey) => number;
}

export interface LayoutInput {
  type: NphChartType;
  width: number;
  categories: readonly string[];
  series: readonly NphChartSeries[];
  hidden: ReadonlySet<number>;
  goal: number | null;
  goalLabel: string;
  noDataLabel: string;
  showValues: boolean;
  locale: string | undefined;
  metrics: Metrics;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A data mark: a bar, a point of a line or a slice of the donut. */
export interface Mark {
  key: string;
  /** Index of the series in the original list (the slice, in the donut). */
  s: number;
  /** Index of the category. Always 0 in the donut. */
  i: number;
  kind: 'bar' | 'point' | 'slice';
  /** The outline of a bar or a slice. */
  d: string;
  /** The center of a point; the middle of the end of a bar; the centroid of a slice. */
  cx: number;
  cy: number;
  box: Box;
  slice: { start: number; end: number; inner: number; outer: number } | null;
  /** A column with no data in the middle of a series (drawn in `chart/empty`). */
  empty: boolean;
  /** The segment gap stroke is drawn around grouped and stacked bars only. */
  separated: boolean;
}

export interface Label {
  text: string;
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  /** The whole text, when `text` was cut with an ellipsis. */
  full?: string;
}

export interface SeriesLabel extends Label {
  s: number;
  /** The percentage under the name, in the donut. */
  secondary?: string;
}

export interface Scene {
  width: number;
  height: number;
  type: NphChartType;
  /** `x` when the categories run along the horizontal axis, `y` when they run down. */
  categoryAxis: 'x' | 'y' | 'none';
  /** The center of each category on its axis, for the pointer. */
  centers: number[];
  extent: Box;
  gridLines: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  valueTicks: Label[];
  categoryLabels: Label[];
  noDataLabels: Label[];
  baseline: { x1: number; y1: number; x2: number; y2: number } | null;
  goal: { x1: number; y1: number; x2: number; y2: number; label: Label } | null;
  marks: Mark[];
  lines: Array<{ s: number; d: string }>;
  areas: Array<{ s: number; d: string }>;
  seriesLabels: SeriesLabel[];
  valueLabels: Label[];
  /** Where each category's tooltip points: the top of its tallest mark. */
  anchors: Array<{ x: number; y: number }>;
  donut: { cx: number; cy: number; outer: number; inner: number; total: number } | null;
  labeling: SeriesLabeling;
}

const f = (value: number): number => Math.round(value * 100) / 100;

function arcSegment(radius: number, x: number, y: number): string {
  return radius > 0 ? `A${f(radius)} ${f(radius)} 0 0 1 ${f(x)} ${f(y)}` : `L${f(x)} ${f(y)}`;
}

/** A rectangle with a radius per corner (top-left, top-right, bottom-right, bottom-left). */
export function roundedRect(box: Box, radii: [number, number, number, number]): string {
  const limit = Math.max(0, Math.min(box.w / 2, box.h));
  const [tl, tr, br, bl] = radii.map((radius) => Math.min(radius, limit)) as [number, number, number, number];
  const { x, y, w, h } = box;
  return [
    `M${f(x + tl)} ${f(y)}`,
    `H${f(x + w - tr)}`,
    arcSegment(tr, x + w, y + tr),
    `V${f(y + h - br)}`,
    arcSegment(br, x + w - br, y + h),
    `H${f(x + bl)}`,
    arcSegment(bl, x, y + h - bl),
    `V${f(y + tl)}`,
    arcSegment(tl, x + tl, y),
    'Z',
  ].join('');
}

/** The text cut on one line with an ellipsis when it does not fit. */
export function fit(text: string, width: number, font: FontKey, metrics: Metrics): string {
  if (metrics.measure(text, font) <= width) return text;
  let end = text.length;
  while (end > 0 && metrics.measure(`${text.slice(0, end).trimEnd()}\u2026`, font) > width) end -= 1;
  return end <= 0 ? '\u2026' : `${text.slice(0, end).trimEnd()}\u2026`;
}

function emptyScene(input: LayoutInput, height: number): Scene {
  return {
    width: input.width,
    height,
    type: input.type,
    categoryAxis: 'none',
    centers: [],
    extent: { x: 0, y: 0, w: input.width, h: height },
    gridLines: [],
    valueTicks: [],
    categoryLabels: [],
    noDataLabels: [],
    baseline: null,
    goal: null,
    marks: [],
    lines: [],
    areas: [],
    seriesLabels: [],
    valueLabels: [],
    anchors: [],
    donut: null,
    labeling: 'none',
  };
}

/** The value domain of the visible series (the sum, when stacked), with zero and the goal inside. */
function domainOf(input: LayoutInput, indexes: number[], stacked: boolean): [number, number] {
  const pool = indexes.length > 0 ? indexes : input.series.map((_, at) => at);
  const columns = input.categories.length;
  let lo = 0;
  let hi = 0;
  if (stacked) {
    for (let at = 0; at < columns; at += 1) {
      const total = pool.reduce((sum, s) => sum + (input.series[s]?.values[at] ?? 0), 0);
      hi = Math.max(hi, total);
    }
  } else {
    for (const s of pool) {
      for (const value of input.series[s]?.values ?? []) {
        if (value === null || value === undefined) continue;
        lo = Math.min(lo, value);
        hi = Math.max(hi, value);
      }
    }
  }
  if (input.goal !== null) {
    lo = Math.min(lo, input.goal);
    hi = Math.max(hi, input.goal);
  }
  return hi === lo ? [lo, lo + 1] : [lo, hi];
}

export function buildScene(input: LayoutInput): Scene {
  switch (input.type) {
    case 'donut':
      return buildDonut(input);
    case 'sparkline':
      return buildSparkline(input);
    case 'horizontal-bar':
    case 'grouped-horizontal':
    case 'stacked-horizontal':
      return buildHorizontal(input);
    default:
      return buildVertical(input);
  }
}

function buildVertical(input: LayoutInput): Scene {
  const { metrics, series, categories, type } = input;
  const { px, lineHeight, measure } = metrics;
  const stacked = type === 'stacked-vertical';
  const points = type === 'line' || type === 'area';
  const visible = visibleIndexes(series.length, input.hidden);
  const labeling = labelingOf(type, series.length);
  const [lo, hi] = domainOf(input, visible, stacked);
  const y = scaleLinear().domain([lo, hi]).nice(4);
  const ticks = y.ticks(4);

  const tickText = ticks.map((value) => formatValue(input.locale, value));
  const yLabelWidth = max(tickText, (text) => measure(text, 'caption')) ?? 0;
  const directWidth =
    labeling === 'direct' && (points || stacked)
      ? (max(series, (item) => measure(item.name, 'caption')) ?? 0) + px.seriesLabelGap + (points ? px.markerSize / 2 : 0)
      : 0;
  const goalWidth =
    input.goal !== null ? measure(input.goalLabel, 'caption') + px.seriesLabelGap : 0;
  const left = Math.ceil(yLabelWidth) + px.yLabelGap;
  const right = Math.ceil(Math.max(directWidth, goalWidth, points ? px.markerSize / 2 : 0));
  const top = Math.ceil(lineHeight.caption / 2);
  const axisBottom = px.plotHeight;
  const hasMissing = type === 'column' && series[0]?.values.some((value) => value === null) === true;
  const labelBand = px.xLabelGap + lineHeight.caption;
  const height = axisBottom + labelBand + (hasMissing ? px.xLabelGap + lineHeight.caption : 0);
  const plotRight = Math.max(left + 1, input.width - right);

  y.range([axisBottom, top]);
  const zeroY = y(0);
  const x = scaleBand<number>()
    .domain(categories.map((_, at) => at))
    .range([left, plotRight])
    .paddingInner(points ? 1 : 0.4)
    .paddingOuter(points ? 0.5 : 0.2);
  const band = x.bandwidth();
  const step = x.step();
  const center = (at: number): number => (x(at) ?? left) + band / 2;
  const scene = emptyScene(input, height);
  scene.categoryAxis = 'x';
  scene.centers = categories.map((_, at) => center(at));
  scene.extent = { x: left, y: top, w: plotRight - left, h: axisBottom - top };
  scene.labeling = labeling;

  scene.gridLines = ticks.map((value) => ({ x1: left, y1: y(value), x2: plotRight, y2: y(value) }));
  scene.valueTicks = ticks.map((value, at) => ({ text: tickText[at] ?? '', x: left - px.yLabelGap, y: y(value), anchor: 'end' }));
  scene.baseline = { x1: left, y1: zeroY, x2: plotRight, y2: zeroY };

  const every = categories.length > 8 ? 2 : 1;
  const labelWidth = Math.max(0, step * every - px.yLabelGap);
  categories.forEach((category, at) => {
    if (at % every !== 0) return;
    const text = fit(category, labelWidth, 'caption', metrics);
    scene.categoryLabels.push({ text, full: category, x: center(at), y: axisBottom + px.xLabelGap, anchor: 'middle' });
  });

  if (input.goal !== null) {
    const gy = y(input.goal);
    scene.goal = {
      x1: left,
      y1: gy,
      x2: plotRight,
      y2: gy,
      label: { text: input.goalLabel, x: plotRight + px.seriesLabelGap, y: gy, anchor: 'start' },
    };
  }

  const inner = scaleBand<number>().domain(visible).range([0, band]).paddingInner(0);
  const showValues = input.showValues && visible.length <= 4 && !points && !stacked;
  const tops: Array<number | null> = categories.map(() => null);
  const touch = (at: number, value: number): void => {
    const current = tops[at];
    tops[at] = current === null || current === undefined ? value : Math.min(current, value);
  };

  if (type === 'column' || type === 'grouped-vertical') {
    const grouped = type === 'grouped-vertical';
    categories.forEach((_, at) => {
      visible.forEach((s) => {
        const value = series[s]?.values[at] ?? null;
        const bx = center(at) - band / 2 + (grouped ? (inner(s) ?? 0) : 0);
        const bw = grouped ? inner.bandwidth() : band;
        if (value === null) {
          if (!grouped) {
            const box = { x: bx, y: top, w: bw, h: axisBottom - top };
            scene.marks.push({
              key: `${s}:${at}`,
              s,
              i: at,
              kind: 'bar',
              d: roundedRect(box, [px.barRadius, px.barRadius, 0, 0]),
              cx: bx + bw / 2,
              cy: top,
              box,
              slice: null,
              empty: true,
              separated: false,
            });
            scene.noDataLabels.push({
              text: input.noDataLabel,
              x: bx + bw / 2,
              y: axisBottom + labelBand + px.xLabelGap,
              anchor: 'middle',
            });
            touch(at, top);
          }
          return;
        }
        const vy = y(value);
        const box = { x: bx, y: Math.min(vy, zeroY), w: bw, h: Math.abs(zeroY - vy) };
        const r = px.barRadius;
        const radii: [number, number, number, number] = value >= 0 ? [r, r, 0, 0] : [0, 0, r, r];
        scene.marks.push({
          key: `${s}:${at}`,
          s,
          i: at,
          kind: 'bar',
          d: roundedRect(box, radii),
          cx: bx + bw / 2,
          cy: vy,
          box,
          slice: null,
          empty: false,
          separated: grouped,
        });
        touch(at, Math.min(vy, zeroY));
        if (showValues) {
          scene.valueLabels.push({
            text: formatValue(input.locale, value),
            x: bx + bw / 2,
            y: value >= 0 ? vy - px.dataLabelGap : vy + px.dataLabelGap + lineHeight.labelSm,
            anchor: 'middle',
          });
        }
      });
    });
  } else if (stacked) {
    categories.forEach((_, at) => {
      let base = 0;
      const present = visible.filter((s) => (series[s]?.values[at] ?? 0) > 0);
      present.forEach((s, order) => {
        const value = series[s]?.values[at] ?? 0;
        const y0 = y(base);
        const y1 = y(base + value);
        base += value;
        const box = { x: center(at) - band / 2, y: y1, w: band, h: Math.max(0, y0 - y1) };
        const r = order === present.length - 1 ? px.barRadius : 0;
        scene.marks.push({
          key: `${s}:${at}`,
          s,
          i: at,
          kind: 'bar',
          d: roundedRect(box, [r, r, 0, 0]),
          cx: center(at),
          cy: y1,
          box,
          slice: null,
          empty: false,
          separated: true,
        });
        touch(at, y1);
        if (labeling === 'direct' && at === categories.length - 1) {
          scene.seriesLabels.push({
            s,
            text: series[s]?.name ?? '',
            x: box.x + box.w + px.seriesLabelGap,
            y: box.y + box.h / 2,
            anchor: 'start',
          });
        }
      });
    });
  } else {
    // line and area
    const areaOf = makeArea<number | null>()
      .defined((value) => value !== null)
      .x((_, at) => center(at))
      .y0(zeroY)
      .y1((value) => y(value ?? 0));
    const lineOf = makeLine<number | null>()
      .defined((value) => value !== null)
      .x((_, at) => center(at))
      .y((value) => y(value ?? 0));
    visible.forEach((s) => {
      const values = series[s]?.values ?? [];
      scene.lines.push({ s, d: lineOf(values) ?? '' });
      if (type === 'area') scene.areas.push({ s, d: areaOf(values) ?? '' });
      let last: { cx: number; cy: number } | null = null;
      values.forEach((value, at) => {
        if (value === null) return;
        const cx = center(at);
        const cy = y(value);
        const half = px.markerSize / 2;
        scene.marks.push({
          key: `${s}:${at}`,
          s,
          i: at,
          kind: 'point',
          d: '',
          cx,
          cy,
          box: { x: cx - half, y: cy - half, w: px.markerSize, h: px.markerSize },
          slice: null,
          empty: false,
          separated: false,
        });
        touch(at, cy);
        last = { cx, cy };
      });
      if (labeling === 'direct' && last !== null) {
        const end = last as { cx: number; cy: number };
        scene.seriesLabels.push({
          s,
          text: series[s]?.name ?? '',
          x: end.cx + px.markerSize / 2 + px.seriesLabelGap,
          y: end.cy,
          anchor: 'start',
        });
      }
    });
  }
  scene.anchors = categories.map((_, at) => ({ x: center(at), y: tops[at] ?? zeroY }));
  return scene;
}

function buildHorizontal(input: LayoutInput): Scene {
  const { metrics, series, categories, type } = input;
  const { px, lineHeight, measure } = metrics;
  const stacked = type === 'stacked-horizontal';
  const grouped = type === 'grouped-horizontal';
  const visible = visibleIndexes(series.length, input.hidden);
  const labeling = labelingOf(type, series.length);
  const [lo, hi] = domainOf(input, visible, stacked);
  const xs = scaleLinear().domain([lo, hi]).nice(4);

  const categoryWidth = Math.min(
    Math.ceil(max(categories, (category) => measure(category, 'caption')) ?? 0),
    Math.floor(input.width * 0.4),
  );
  const left = categoryWidth + px.yLabelGap;
  const showValues = input.showValues && !stacked && visible.length <= 4 && !(grouped && labeling === 'direct');
  const valueRoom = showValues
    ? (max(visible, (s) => max(series[s]?.values ?? [], (value) => (value === null ? 0 : measure(formatValue(input.locale, value), 'labelSm'))) ?? 0) ??
        0) + px.dataLabelGap
    : 0;
  const directRoom =
    grouped && labeling === 'direct'
      ? (max(series, (item) => measure(item.name, 'caption')) ?? 0) + px.seriesLabelGap
      : 0;
  const right = Math.ceil(Math.max(valueRoom, directRoom));
  const above = stacked && labeling === 'direct' ? lineHeight.caption + px.seriesLabelGap : 0;
  const height = px.plotHeight;
  const plotRight = Math.max(left + 1, input.width - right);
  xs.range([left, plotRight]);
  const zeroX = xs(0);
  const ys = scaleBand<number>()
    .domain(categories.map((_, at) => at))
    .range([above, height])
    .paddingInner(0.4)
    .paddingOuter(0.2);
  const band = ys.bandwidth();
  const middle = (at: number): number => (ys(at) ?? 0) + band / 2;
  const inner = scaleBand<number>().domain(visible).range([0, band]).paddingInner(0);

  const scene = emptyScene(input, height);
  scene.categoryAxis = 'y';
  scene.centers = categories.map((_, at) => middle(at));
  scene.extent = { x: left, y: above, w: plotRight - left, h: height - above };
  scene.labeling = labeling;
  scene.baseline = { x1: zeroX, y1: above, x2: zeroX, y2: height };
  categories.forEach((category, at) => {
    scene.categoryLabels.push({
      text: fit(category, categoryWidth, 'caption', metrics),
      full: category,
      x: left - px.yLabelGap,
      y: middle(at),
      anchor: 'end',
    });
  });

  const tips: Array<number | null> = categories.map(() => null);
  categories.forEach((_, at) => {
    let base = 0;
    const present = stacked ? visible.filter((s) => (series[s]?.values[at] ?? 0) > 0) : visible;
    present.forEach((s, order) => {
      const value = series[s]?.values[at] ?? null;
      if (value === null) return;
      const top = (ys(at) ?? 0) + (grouped ? (inner(s) ?? 0) : 0);
      const bh = grouped ? inner.bandwidth() : band;
      let box: Box;
      let radii: [number, number, number, number];
      const r = px.barRadius;
      if (stacked) {
        const x0 = xs(base);
        const x1 = xs(base + value);
        base += value;
        box = { x: x0, y: top, w: Math.max(0, x1 - x0), h: bh };
        const outer = order === present.length - 1 ? r : 0;
        radii = [0, outer, outer, 0];
      } else {
        const vx = xs(value);
        box = { x: Math.min(vx, zeroX), y: top, w: Math.abs(vx - zeroX), h: bh };
        radii = value >= 0 ? [0, r, r, 0] : [r, 0, 0, r];
      }
      const end = value >= 0 || stacked ? box.x + box.w : box.x;
      scene.marks.push({
        key: `${s}:${at}`,
        s,
        i: at,
        kind: 'bar',
        d: roundedRect(box, radii),
        cx: end,
        cy: top + bh / 2,
        box,
        slice: null,
        empty: false,
        separated: grouped || stacked,
      });
      const current = tips[at];
      tips[at] = current === null || current === undefined ? end : Math.max(current, end);
      if (showValues) {
        scene.valueLabels.push({
          text: formatValue(input.locale, value),
          x: value >= 0 ? end + px.dataLabelGap : end - px.dataLabelGap,
          y: top + bh / 2,
          anchor: value >= 0 ? 'start' : 'end',
        });
      }
      if (labeling === 'direct' && grouped && at === 0) {
        scene.seriesLabels.push({
          s,
          text: series[s]?.name ?? '',
          x: end + px.seriesLabelGap,
          y: top + bh / 2,
          anchor: 'start',
        });
      }
      if (labeling === 'direct' && stacked && at === 0) {
        scene.seriesLabels.push({ s, text: series[s]?.name ?? '', x: box.x, y: (ys(at) ?? 0) - px.seriesLabelGap, anchor: 'start' });
      }
    });
  });
  scene.anchors = categories.map((_, at) => ({ x: tips[at] ?? zeroX, y: (ys(at) ?? 0) }));
  return scene;
}

function buildDonut(input: LayoutInput): Scene {
  const { metrics, series } = input;
  const { px, lineHeight, measure } = metrics;
  const visible = visibleIndexes(series.length, input.hidden);
  const labeling = labelingOf('donut', series.length);
  const labelBlock = labeling === 'direct' ? lineHeight.caption + lineHeight.labelSm + px.seriesLabelGap : 0;
  const widest =
    labeling === 'direct'
      ? (max(series, (item) => Math.max(measure(item.name, 'caption'), measure('100%', 'labelSm'))) ?? 0) + px.seriesLabelGap
      : 0;
  const diameter = Math.max(1, Math.min(px.plotHeight, input.width - 2 * widest));
  const outer = diameter / 2;
  const inner = outer * 0.75;
  const height = labeling === 'direct' ? diameter + 2 * labelBlock : diameter;
  const cx = input.width / 2;
  const cy = height / 2;
  const scene = emptyScene(input, height);
  scene.labeling = labeling;
  scene.extent = { x: cx - outer, y: cy - outer, w: diameter, h: diameter };
  const values = visible.map((s) => series[s]?.values[0] ?? 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  scene.donut = { cx, cy, outer, inner, total };
  const slices = makePie<number>().sort(null).value((value) => value).padAngle(0)(values);
  const path = makeArc<{ startAngle: number; endAngle: number }>().innerRadius(inner).outerRadius(outer);
  slices.forEach((slice, order) => {
    const s = visible[order];
    if (s === undefined) return;
    const angle = (slice.startAngle + slice.endAngle) / 2;
    const midRadius = (inner + outer) / 2;
    const sx = cx + Math.sin(angle) * midRadius;
    const sy = cy - Math.cos(angle) * midRadius;
    scene.marks.push({
      key: `${s}:0`,
      s,
      i: 0,
      kind: 'slice',
      d: path(slice) ?? '',
      cx: sx,
      cy: sy,
      box: { x: sx, y: sy, w: 0, h: 0 },
      slice: { start: slice.startAngle, end: slice.endAngle, inner, outer },
      empty: false,
      separated: true,
    });
    scene.anchors.push({ x: cx + Math.sin(angle) * outer, y: cy - Math.cos(angle) * outer });
    if (labeling === 'direct') {
      const edgeX = cx + Math.sin(angle) * (outer + px.seriesLabelGap);
      const edgeY = cy - Math.cos(angle) * (outer + px.seriesLabelGap);
      const side = Math.sin(angle);
      const anchor = Math.abs(side) < 0.2 ? 'middle' : side > 0 ? 'start' : 'end';
      const above = Math.cos(angle) > 0;
      scene.seriesLabels.push({
        s,
        text: series[s]?.name ?? '',
        secondary: formatPercent(input.locale, total === 0 ? 0 : (series[s]?.values[0] ?? 0) / total),
        x: edgeX,
        y: above ? edgeY - lineHeight.labelSm : edgeY + lineHeight.caption,
        anchor,
      });
    }
  });
  return scene;
}

function buildSparkline(input: LayoutInput): Scene {
  const { metrics, series } = input;
  const { px } = metrics;
  const height = px.sparklineHeight;
  const scene = emptyScene(input, height);
  const values = series[0]?.values ?? [];
  const count = values.length;
  const pad = px.lineWidth;
  const known = values.filter((value): value is number => value !== null);
  const lo = min(known) ?? 0;
  const hi = max(known) ?? 1;
  const xs = scaleLinear()
    .domain([0, Math.max(1, count - 1)])
    .range([pad, Math.max(pad + 1, input.width - pad)]);
  const ys = scaleLinear()
    .domain(hi === lo ? [lo - 1, hi + 1] : [lo, hi])
    .range([height - pad, pad]);
  const lineOf = makeLine<number | null>()
    .defined((value) => value !== null)
    .x((_, at) => xs(at))
    .y((value) => ys(value ?? 0));
  scene.lines.push({ s: 0, d: lineOf(values) ?? '' });
  return scene;
}

export type RingShape =
  | { type: 'rect'; box: Box; radii: [number, number, number, number] }
  | { type: 'circle'; cx: number; cy: number; r: number }
  | { type: 'path'; d: string };

export interface Ring {
  /** The 2 px gap in the card color, the 1 px border and the 4 px halo, inside out. */
  separator: RingShape;
  border: RingShape;
  halo: RingShape;
}

/**
 * The focus ring of a mark: a ring centered on it, `chart/focus-offset` apart in
 * `chart/separator`, with the border `chart/focus-border` and the halo `chart/focus-halo`
 * outside. The border never touches the series color.
 */
export function focusRing(mark: Mark, metrics: Metrics): Ring {
  const { focusOffset: gap, focusBorderWidth: bw, focusHaloWidth: hw, markerSize } = metrics.px;
  const grow = (extra: number): number => gap + extra;
  if (mark.kind === 'point') {
    const base = markerSize / 2;
    return {
      separator: { type: 'circle', cx: mark.cx, cy: mark.cy, r: base + gap / 2 },
      border: { type: 'circle', cx: mark.cx, cy: mark.cy, r: base + grow(bw / 2) },
      halo: { type: 'circle', cx: mark.cx, cy: mark.cy, r: base + grow(bw) + hw / 2 },
    };
  }
  if (mark.kind === 'slice' && mark.slice !== null) {
    const { start, end, inner, outer } = mark.slice;
    const ring = (shrink: number): string =>
      makeArc<{ startAngle: number; endAngle: number }>()
        .innerRadius(Math.max(0, inner - shrink))
        .outerRadius(outer + shrink)({ startAngle: start, endAngle: end }) ?? '';
    return {
      separator: { type: 'path', d: ring(gap / 2) },
      border: { type: 'path', d: ring(grow(bw / 2)) },
      halo: { type: 'path', d: ring(grow(bw) + hw / 2) },
    };
  }
  const around = (extra: number): Box => ({
    x: mark.box.x - extra,
    y: mark.box.y - extra,
    w: mark.box.w + 2 * extra,
    h: mark.box.h + 2 * extra,
  });
  const radii = (extra: number): [number, number, number, number] => [extra, extra, extra, extra];
  return {
    separator: { type: 'rect', box: around(gap / 2), radii: radii(0) },
    border: { type: 'rect', box: around(grow(bw / 2)), radii: radii(0) },
    halo: { type: 'rect', box: around(grow(bw) + hw / 2), radii: radii(0) },
  };
}

const centerBisector = bisector<number, number>((center) => center);

/**
 * The index of the category whose center is nearest to the pointer. The centers run in ascending
 * order on the category axis, so a bisection finds it in logarithmic time, and a position before
 * the first or after the last center takes the first or the last. `null` when there is no category.
 */
export function nearestCenter(centers: readonly number[], position: number): number | null {
  if (centers.length === 0 || !Number.isFinite(position)) return null;
  return centerBisector.center(centers, position);
}

export function isHorizontalType(type: NphChartType): boolean {
  return isHorizontalCartesian(type);
}
