/**
 * `nph-chart` — the data chart for dashboards and reports, inside an `nph-card`.
 *
 * Contract accepted in Figma (frame `7817:4454`, set `7653:286`; pieces `7650:79`,
 * `7649:20`, `7651:77`, `7651:147`, `7651:151`), recorded as text in the evidence of the
 * `figma-docs-accepted` gate of DSA-101. The task and the evidence are the source; this note
 * states what the code does with them.
 *
 * - `type`: `column` (default), `horizontal-bar`, `grouped-vertical`, `grouped-horizontal`,
 *   `stacked-vertical`, `stacked-horizontal`, `line`, `area`, `donut` and `sparkline`;
 *   `state`: `default` (default), `loading`, `empty`, `no-result` and `error`;
 * - the data comes by property: `categories` (the label of each value on the category axis)
 *   and `series`, each `{ name, values, others? }` with one value per category (`null` is a
 *   category with no data). The donut takes no categories: each series is a slice and its
 *   first value is the size. Up to six series; from the seventh on the consumer groups them
 *   into one series with `others` set, drawn in `chart/muted`;
 * - `goal` and `goal-label` draw the dashed goal line in the vertical types; `highlight`
 *   is the value and the change above the area; `show-values` writes the value at the end of
 *   a bar (up to four series); `unit` is the unit written in the headers of the table;
 * - the series colors come from the order, from `chart/1`, never from the brand or the
 *   situation. A series is read by a direct label (2 to 4 series) or by the legend below the
 *   area (more, and always in the grouped vertical); the legend item is a button with
 *   `aria-pressed` that turns the series on and off, and everything is recomputed over the
 *   visible series (D-1 to D-5 of the task);
 * - "View as table" swaps the area for the `nph-table` with the same data and becomes
 *   "View as chart"; the focus stays on the button;
 * - the data is reached by the keyboard: one Tab stop in the plot (roving tabindex); Left
 *   and Right move along a series, Up and Down between the visible series (in the horizontal
 *   types the two pairs swap, so Up and Down follow the categories on the screen), Home and
 *   End go to the first and the last item, Esc closes the tooltip without moving the focus;
 * - the tooltip shows on hover and on data focus, stays while the pointer or the focus is on
 *   the data, can be reached by the pointer, and leaves by opacity only (WCAG 1.4.13);
 * - events: `nph-retry` (the person pressed "Try again"; the consumer sets `state="loading"`
 *   and gives the data back) and `nph-series-visibility-change` (`{ index, visible }`), both
 *   bubbling and composed, never fired by code;
 * - every visible text is a property already localized, as in `nph-table`; there is no
 *   default text. A missing `summary` renders and warns once in development;
 * - invalid input (the rule of P21): a type or state outside the list, no series in
 *   `default`, a series count or value count that does not fit, a negative value in a stacked
 *   type, draws nothing and emits `console.error` in development, one per cause;
 * - D3 is used as a math utility only (`d3-scale`, `d3-shape`, `d3-array`); Lit draws the SVG
 *   with the `chart/*` tokens as CSS custom properties. No D3 structure is part of the API: the data
 *   and the events are plain objects of this component, and the package bundles the D3 code.
 */
import { LitElement, html, nothing, svg, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '../nph-button/nph-button';
import '../nph-empty/nph-empty';
import '../nph-icon/nph-icon';
import '../nph-skeleton/nph-skeleton';
import '../nph-table/nph-table';
import chartCss from './nph-chart.css?inline';
import { buildScene, focusRing, nearestCenter } from './nph-chart.layout';
import * as MODEL from './nph-chart.model';
import type { FontKey, Mark, Metrics, RingShape, Scene } from './nph-chart.layout';
import {
  NPH_CHART_STATES,
  NPH_CHART_TYPES,
  colorOf,
  formatPercent,
  formatValue,
  inputProblems,
  groupSeries,
  isHorizontalCartesian,
  isOneOf,
  isSingleSeries,
  isVerticalCartesian,
  shapeOf,
  softColorOf,
  tableOf,
  visibleIndexes,
} from './nph-chart.model';

/* Re-exported as constants, not as `export ... from`, so the manifest has no reference to a module that is not an entry. */
export const NPH_CHART_DIRECTIONS = MODEL.NPH_CHART_DIRECTIONS;
export const NPH_CHART_MARKER_SHAPES = MODEL.NPH_CHART_MARKER_SHAPES;
export const NPH_CHART_MAX_SERIES = MODEL.NPH_CHART_MAX_SERIES;
export const NPH_CHART_SENSES = MODEL.NPH_CHART_SENSES;
export const NPH_CHART_SPARKLINE_MAX_VALUES = MODEL.NPH_CHART_SPARKLINE_MAX_VALUES;
export type NphChartDirection = MODEL.NphChartDirection;
export type NphChartHighlight = MODEL.NphChartHighlight;
export type NphChartMarkerShape = MODEL.NphChartMarkerShape;
export type NphChartSense = MODEL.NphChartSense;
export type NphChartSeries = MODEL.NphChartSeries;
export type NphChartState = MODEL.NphChartState;
export type NphChartType = MODEL.NphChartType;

const TAG = 'nph-chart';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_CHART_RETRY_EVENT = 'nph-retry';
export const NPH_CHART_SERIES_VISIBILITY_CHANGE_EVENT = 'nph-series-visibility-change';

export interface NphChartSeriesVisibilityChangeDetail {
  index: number;
  visible: boolean;
}

/** The marker shapes on a 10 by 10 grid, in the order of `chart/1` to `chart/6`. */
const MARKER_PATHS: Readonly<Record<string, string>> = {
  circle: 'M5 0a5 5 0 1 0 0 10a5 5 0 1 0 0-10Z',
  diamond: 'M5 0L10 5L5 10L0 5Z',
  square: 'M0 0H10V10H0Z',
  triangle: 'M5 0L10 10H0Z',
  'inverted-triangle': 'M0 0H10L5 10Z',
  cross: 'M3.5 0H6.5V3.5H10V6.5H6.5V10H3.5V6.5H0V3.5H3.5Z',
};

/** The tokens read as pixels, each one a probe element with that width. */
const PROBES = {
  yLabelGap: '--nph-chart-y-label-gap',
  xLabelGap: '--nph-chart-x-label-gap',
  dataLabelGap: '--nph-chart-data-label-gap',
  seriesLabelGap: '--nph-chart-series-label-gap',
  markerSize: '--nph-chart-marker-size',
  barRadius: '--nph-chart-bar-radius',
  segmentGap: '--nph-chart-segment-gap',
  lineWidth: '--nph-chart-line-width',
  focusOffset: '--nph-chart-focus-offset',
  focusBorderWidth: '--nph-chart-focus-border-width',
  focusHaloWidth: '--nph-chart-focus-halo-width',
  plotHeight: '--nph-chart-plot-height',
  sparklineHeight: '--nph-chart-sparkline-height',
  tooltipOffset: '--nph-chart-tooltip-offset',
} as const;
type ProbeKey = keyof typeof PROBES;

const FONTS: readonly FontKey[] = ['caption', 'labelSm', 'headingMd'];

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

interface Tip {
  /** The category (or `0` for the donut). */
  i: number;
  /** The slice, in the donut. */
  s: number | null;
}

export class NphChart extends LitElement {
  static override styles = unsafeCSS(chartCss);

  static override properties = {
    type: { type: String, reflect: true },
    state: { type: String, reflect: true },
    categories: { attribute: false },
    series: { attribute: false },
    highlight: { attribute: false },
    goal: { type: Number },
    goalLabel: { type: String, attribute: 'goal-label' },
    showValues: { type: Boolean, attribute: 'show-values' },
    unit: { type: String },
    locale: { type: String },
    summary: { type: String },
    othersLabel: { type: String, attribute: 'others-label' },
    typeLabel: { type: String, attribute: 'type-label' },
    seriesLabel: { type: String, attribute: 'series-label' },
    totalLabel: { type: String, attribute: 'total-label' },
    noDataLabel: { type: String, attribute: 'no-data-label' },
    noValueLabel: { type: String, attribute: 'no-value-label' },
    categoryLabel: { type: String, attribute: 'category-label' },
    valueLabel: { type: String, attribute: 'value-label' },
    differenceLabel: { type: String, attribute: 'difference-label' },
    viewTableLabel: { type: String, attribute: 'view-table-label' },
    viewChartLabel: { type: String, attribute: 'view-chart-label' },
    retryLabel: { type: String, attribute: 'retry-label' },
    errorMessage: { type: String, attribute: 'error-message' },
    loadingLabel: { type: String, attribute: 'loading-label' },
    emptyHeading: { type: String, attribute: 'empty-heading' },
    emptyDescription: { type: String, attribute: 'empty-description' },
    noResultHeading: { type: String, attribute: 'no-result-heading' },
    noResultDescription: { type: String, attribute: 'no-result-description' },
    noSeriesHeading: { type: String, attribute: 'no-series-heading' },
    noSeriesDescription: { type: String, attribute: 'no-series-description' },
    hiddenSeries: { state: true },
    showTable: { state: true },
    width: { state: true },
    metrics: { state: true },
    tip: { state: true },
    focusKey: { state: true },
    ringVisible: { state: true },
    legendHover: { state: true },
    live: { state: true },
  };

  /** `column` by default. */
  declare type: NphChartType;
  /** `default` by default. */
  declare state: NphChartState;
  declare categories: string[];
  declare series: NphChartSeries[];
  declare othersLabel: string;
  declare typeLabel: string;
  declare seriesLabel: string;
  /** The series as drawn: the seventh on grouped into "Others". */
  private shown: NphChartSeries[] = [];
  declare highlight: NphChartHighlight | null;
  declare goal: number | null;
  declare goalLabel: string;
  declare showValues: boolean;
  declare unit: string;
  declare locale: string;
  declare summary: string;
  declare totalLabel: string;
  declare noDataLabel: string;
  declare noValueLabel: string;
  declare categoryLabel: string;
  declare valueLabel: string;
  declare differenceLabel: string;
  declare viewTableLabel: string;
  declare viewChartLabel: string;
  declare retryLabel: string;
  declare errorMessage: string;
  declare loadingLabel: string;
  declare emptyHeading: string;
  declare emptyDescription: string;
  declare noResultHeading: string;
  declare noResultDescription: string;
  declare noSeriesHeading: string;
  declare noSeriesDescription: string;

  private hiddenSeries: ReadonlySet<number> = new Set<number>();
  private showTable = false;
  private width = 0;
  private metrics: Metrics | null = null;
  private tip: Tip | null = null;
  private lastTip: Tip | null = null;
  private focusKey: string | null = null;
  private legendHover: number | null = null;
  private live = '';
  private dismissed = false;
  private warned = false;
  private sizeObserver: ResizeObserver | null = null;
  private observed: Element | null = null;
  private ringVisible = false;
  private sceneCache: { key: unknown[]; scene: Scene } | null = null;
  private canvas: CanvasRenderingContext2D | null = null;
  private fontStrings: Record<FontKey, string> = { caption: '', labelSm: '', headingMd: '' };

  constructor() {
    super();
    this.type = 'column';
    this.state = 'default';
    this.categories = [];
    this.series = [];
    this.shown = [];
    this.highlight = null;
    this.goal = null;
    this.goalLabel = '';
    this.showValues = false;
    this.unit = '';
    this.locale = '';
    this.summary = '';
    this.othersLabel = '';
    this.typeLabel = '';
    this.seriesLabel = '';
    this.totalLabel = '';
    this.noDataLabel = '';
    this.noValueLabel = '';
    this.categoryLabel = '';
    this.valueLabel = '';
    this.differenceLabel = '';
    this.viewTableLabel = '';
    this.viewChartLabel = '';
    this.retryLabel = '';
    this.errorMessage = '';
    this.loadingLabel = '';
    this.emptyHeading = '';
    this.emptyDescription = '';
    this.noResultHeading = '';
    this.noResultDescription = '';
    this.noSeriesHeading = '';
    this.noSeriesDescription = '';
  }

  private readonly onDocumentPointerDown = (event: PointerEvent): void => {
    if (this.tip !== null && !event.composedPath().includes(this)) this.closeTip();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('pointerdown', this.onDocumentPointerDown);
  }

  override disconnectedCallback(): void {
    document.removeEventListener('pointerdown', this.onDocumentPointerDown);
    this.sizeObserver?.disconnect();
    this.sizeObserver = null;
    this.observed = null;
    super.disconnectedCallback();
  }

  private problems(): string[] {
    return inputProblems({
      type: this.type,
      state: this.state,
      categories: this.categories,
      series: this.series,
      highlight: this.highlight,
    });
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('type') && isOneOf(NPH_CHART_TYPES, this.type) && isSingleSeries(this.type) && this.series.length > 1) {
      this.series = this.series.slice(0, 1);
    }
    if (changed.has('series') || changed.has('othersLabel') || changed.has('type')) {
      this.shown = groupSeries(this.series, this.othersLabel);
      if (this.shown.some((item) => item.others === true) && this.othersLabel.trim() === '') {
        devWarn('"others-label" is missing: the series grouped into "Others" has no name.');
      }
    }
    const problems = this.problems();
    const valid = problems.length === 0;
    if (!valid && (changed.has('type') || changed.has('state') || changed.has('series') || changed.has('categories') || changed.has('highlight'))) {
      for (const problem of problems) devError(problem);
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
    if (valid && !this.warned && this.summary.trim() === '' && this.state === 'default') {
      this.warned = true;
      devWarn('"summary" is missing: the plot area needs a text summary of what the data means (WCAG 1.1.1).');
    }
    if (valid && this.goal !== null && !isVerticalCartesian(this.type) && (changed.has('goal') || changed.has('type'))) {
      devWarn(`type "${this.type}" does not draw a goal: it is drawn in the vertical types only.`);
    }
    if (changed.has('series') || changed.has('type')) {
      this.hiddenSeries = new Set([...this.hiddenSeries].filter((index) => index < this.shown.length));
      this.tip = null;
      this.focusKey = null;
    }
    if (changed.has('state')) {
      this.showTable = false;
      this.tip = null;
      this.announceState();
    }
    if (!isOneOf(NPH_CHART_STATES, this.state)) this.state = 'default';
  }

  private announceState(): void {
    const text: Record<string, string> = {
      loading: this.loadingLabel,
      empty: this.emptyHeading,
      'no-result': this.noResultHeading,
      error: this.errorMessage,
    };
    this.live = text[this.state] ?? '';
  }

  protected override firstUpdated(): void {
    this.measure();
    void document.fonts?.ready.then(() => {
      this.measure();
    });
  }

  protected override updated(): void {
    if (this.metrics === null) this.measure();
    this.observeArea();
    this.placeTooltip();
  }

  /* ------------------------------------------------------------------ measures */

  /** The area is a new element when the state changes, so the observer follows it. */
  private observeArea(): void {
    const area = this.renderRoot.querySelector('.area');
    if (area === this.observed) return;
    this.sizeObserver ??= new ResizeObserver(() => this.measureWidth());
    if (this.observed !== null) this.sizeObserver.unobserve(this.observed);
    this.observed = area;
    if (area !== null) this.sizeObserver.observe(area);
    this.measureWidth();
  }

  private measureWidth(): void {
    const area = this.renderRoot.querySelector('.area');
    if (area === null) return;
    const width = Math.floor(area.getBoundingClientRect().width);
    if (width !== this.width) this.width = width;
  }

  private measure(): void {
    const probes = this.renderRoot.querySelectorAll<HTMLElement>('[data-probe]');
    if (probes.length === 0) return;
    const px = {} as Record<ProbeKey, number>;
    probes.forEach((probe) => {
      const key = probe.dataset['probe'] as ProbeKey;
      px[key] = probe.getBoundingClientRect().width;
    });
    const lineHeight = {} as Record<FontKey, number>;
    for (const font of FONTS) {
      const element = this.renderRoot.querySelector<HTMLElement>(`[data-font="${font}"]`);
      if (element === null) return;
      lineHeight[font] = element.getBoundingClientRect().height;
      this.fontStrings[font] = getComputedStyle(element).font;
    }
    if (this.canvas === null) this.canvas = document.createElement('canvas').getContext('2d');
    const context = this.canvas;
    const fonts = this.fontStrings;
    const measure = (text: string, font: FontKey): number => {
      if (context === null) return text.length * 7;
      context.font = fonts[font];
      return context.measureText(text).width;
    };
    const next: Metrics = { px, lineHeight, measure };
    const previous = this.metrics;
    const same =
      previous !== null &&
      FONTS.every((font) => previous.lineHeight[font] === lineHeight[font]) &&
      (Object.keys(PROBES) as ProbeKey[]).every((key) => previous.px[key] === px[key]);
    if (!same) this.metrics = next;
    this.measureWidth();
  }

  private sceneOf(): Scene | null {
    const metrics = this.metrics;
    if (metrics === null || this.width <= 0 || this.state !== 'default' || !isOneOf(NPH_CHART_TYPES, this.type)) return null;
    const key: unknown[] = [
      this.type,
      this.width,
      this.categories,
      this.shown,
      this.hiddenSeries,
      this.goal,
      this.goalLabel,
      this.noDataLabel,
      this.showValues,
      this.locale,
      metrics,
    ];
    const cached = this.sceneCache;
    if (cached !== null && cached.key.length === key.length && cached.key.every((value, at) => value === key[at])) return cached.scene;
    const scene = buildScene({
      type: this.type,
      width: this.width,
      categories: this.categories,
      series: this.shown,
      hidden: this.hiddenSeries,
      goal: this.goal,
      goalLabel: this.goalLabel,
      noDataLabel: this.noDataLabel,
      showValues: this.showValues,
      locale: this.locale === '' ? undefined : this.locale,
      metrics,
    });
    this.sceneCache = { key, scene };
    return scene;
  }

  /* ------------------------------------------------------------------ tooltip */

  private closeTip(): void {
    this.tip = null;
  }

  private setTip(tip: Tip | null): void {
    this.dismissed = false;
    this.tip = tip;
    if (tip !== null) this.lastTip = tip;
  }

  private anchorOf(scene: Scene, tip: Tip): { x: number; y: number } | null {
    if (scene.type === 'donut') {
      const order = visibleIndexes(this.shown.length, this.hiddenSeries).indexOf(tip.s ?? -1);
      return scene.anchors[order] ?? null;
    }
    return scene.anchors[tip.i] ?? null;
  }

  /** The tooltip sits above the data by default and turns to the side or below when it does not fit. */
  private placeTooltip(): void {
    const element = this.renderRoot.querySelector<HTMLElement>('.tooltip');
    const scene = this.sceneOf();
    const tip = this.tip ?? this.lastTip;
    const metrics = this.metrics;
    if (element === null || scene === null || tip === null || metrics === null) return;
    const anchor = this.anchorOf(scene, tip);
    if (anchor === null) return;
    const w = element.offsetWidth;
    const h = element.offsetHeight;
    const offset = metrics.px.tooltipOffset;
    const clampX = (x: number): number => Math.max(0, Math.min(x, scene.width - w));
    const candidates: Array<[number, number]> = [
      [anchor.x - w / 2, anchor.y - h - offset],
      [anchor.x + offset, anchor.y - h / 2],
      [anchor.x - w - offset, anchor.y - h / 2],
      [anchor.x - w / 2, anchor.y + offset],
    ];
    const fits = ([x, y]: [number, number]): boolean => x >= 0 && y >= 0 && x + w <= scene.width && y + h <= scene.height;
    const chosen = candidates.find(fits) ?? candidates[0] ?? [0, 0];
    element.style.transform = `translate(${Math.round(clampX(chosen[0]))}px, ${Math.round(Math.max(0, chosen[1]))}px)`;
  }

  private renderTooltip(scene: Scene): TemplateResult | typeof nothing {
    const tip = this.tip ?? this.lastTip;
    if (tip === null) return nothing;
    const locale = this.locale === '' ? undefined : this.locale;
    const open = this.tip !== null && !this.dismissed;
    let title: string;
    let lines: Array<{ s: number; name: string; value: string }>;
    if (scene.type === 'donut') {
      const s = tip.s ?? 0;
      const item = this.shown[s];
      if (item === undefined) return nothing;
      const total = scene.donut?.total ?? 0;
      const value = item.values[0] ?? 0;
      title = item.name;
      lines = [
        {
          s,
          name: formatPercent(locale, total === 0 ? 0 : value / total),
          value: formatValue(locale, value),
        },
      ];
    } else {
      title = this.categories[tip.i] ?? '';
      lines = visibleIndexes(this.shown.length, this.hiddenSeries).map((s) => {
        const value = this.shown[s]?.values[tip.i];
        return {
          s,
          name: this.shown[s]?.name ?? '',
          value: typeof value === 'number' ? formatValue(locale, value) : this.noValueLabel,
        };
      });
    }
    return html`<div class="tooltip" data-open=${open ? '' : nothing} role="presentation" aria-hidden="true">
      <p class="tooltip-title">${title}</p>
      ${lines.map(
        (line) => html`<div class="tooltip-line">
          <span class="tooltip-label">${this.markerTemplate(line.s)}<span class="tooltip-name">${line.name}</span></span>
          <span class="tooltip-value">${line.value}</span>
        </div>`,
      )}
    </div>`;
  }

  /* ------------------------------------------------------------------ interaction */

  private categoryAt(scene: Scene, event: PointerEvent): number | null {
    const svgElement = this.renderRoot.querySelector('.plot svg');
    if (svgElement === null || scene.centers.length === 0) return null;
    const rect = svgElement.getBoundingClientRect();
    const position = scene.categoryAxis === 'x' ? event.clientX - rect.left : event.clientY - rect.top;
    return nearestCenter(scene.centers, position);
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    const scene = this.sceneOf();
    if (scene === null || scene.type === 'sparkline' || event.target instanceof HTMLElement) return;
    if (visibleIndexes(this.shown.length, this.hiddenSeries).length === 0) return;
    if (scene.type === 'donut') {
      const slice = (event.target as Element).closest<SVGElement>('[data-slice]');
      const s = slice === null ? null : Number(slice.dataset['slice']);
      if (s === null) {
        if (this.tip !== null && document.activeElement === null) this.closeTip();
        return;
      }
      if (this.tip?.s !== s) this.setTip({ i: 0, s });
      return;
    }
    const at = this.categoryAt(scene, event);
    if (at !== null && (this.tip?.i !== at || this.dismissed)) this.setTip({ i: at, s: null });
  };

  private readonly onPointerLeave = (): void => {
    if (!this.renderRoot.querySelector('.plot :focus-visible')) this.closeTip();
  };

  private readonly onFocusIn = (event: FocusEvent): void => {
    const target = (event.target as Element).closest<SVGElement>('[data-key]');
    if (target === null) return;
    const key = target.dataset['key'] ?? null;
    this.focusKey = key;
    this.ringVisible = target.matches(':focus-visible');
    const [s, i] = (key ?? '0:0').split(':').map(Number);
    this.setTip({ i: i ?? 0, s: this.type === 'donut' ? (s ?? 0) : null });
  };

  private readonly onFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    if (next instanceof Node && this.renderRoot.querySelector('.plot')?.contains(next)) return;
    this.closeTip();
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const scene = this.sceneOf();
    if (scene === null) return;
    if (event.key === 'Escape') {
      if (this.tip !== null) {
        this.dismissed = true;
        this.requestUpdate();
      }
      return;
    }
    const target = this.focusKey;
    if (target === null) return;
    const next = this.nextKey(scene, target, event.key);
    if (next === null) return;
    event.preventDefault();
    this.renderRoot.querySelector<SVGElement>(`[data-key="${next}"]`)?.focus();
  };

  /** Left and Right along the series, Up and Down between the visible series; the horizontal types swap the pairs. */
  private nextKey(scene: Scene, current: string, key: string): string | null {
    const [s0, i0] = current.split(':').map(Number) as [number, number];
    const marks = scene.marks.filter((mark) => !mark.empty);
    const bySeries = (s: number): Mark[] => marks.filter((mark) => mark.s === s).sort((a, b) => a.i - b.i);
    const visible = visibleIndexes(this.shown.length, this.hiddenSeries);
    const donut = scene.type === 'donut';
    if (donut) {
      const order = marks.map((mark) => mark.key);
      const at = order.indexOf(current);
      if (key === 'Home') return order[0] ?? null;
      if (key === 'End') return order[order.length - 1] ?? null;
      if (key === 'ArrowRight' || key === 'ArrowDown') return order[Math.min(order.length - 1, at + 1)] ?? null;
      if (key === 'ArrowLeft' || key === 'ArrowUp') return order[Math.max(0, at - 1)] ?? null;
      return null;
    }
    const horizontal = isHorizontalCartesian(scene.type);
    const along = horizontal ? ['ArrowDown', 'ArrowUp'] : ['ArrowRight', 'ArrowLeft'];
    const across = horizontal ? ['ArrowRight', 'ArrowLeft'] : ['ArrowDown', 'ArrowUp'];
    const list = bySeries(s0);
    const at = list.findIndex((mark) => mark.i === i0);
    if (key === 'Home') return list[0]?.key ?? null;
    if (key === 'End') return list[list.length - 1]?.key ?? null;
    if (key === along[0]) return list[Math.min(list.length - 1, at + 1)]?.key ?? null;
    if (key === along[1]) return list[Math.max(0, at - 1)]?.key ?? null;
    if (key === across[0] || key === across[1]) {
      const order = visible.indexOf(s0);
      const targetSeries = visible[key === across[0] ? order + 1 : order - 1];
      if (targetSeries === undefined) return null;
      const options = bySeries(targetSeries);
      let best: Mark | undefined;
      for (const mark of options) {
        if (best === undefined || Math.abs(mark.i - i0) < Math.abs(best.i - i0)) best = mark;
      }
      return best?.key ?? null;
    }
    return null;
  }

  private toggleSeries(index: number): void {
    const hidden = new Set(this.hiddenSeries);
    const visible = hidden.has(index);
    if (visible) hidden.delete(index);
    else hidden.add(index);
    this.hiddenSeries = hidden;
    this.tip = null;
    this.focusKey = null;
    this.dispatchEvent(
      new CustomEvent<NphChartSeriesVisibilityChangeDetail>(NPH_CHART_SERIES_VISIBILITY_CHANGE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { index, visible },
      }),
    );
  }

  private retry(): void {
    this.dispatchEvent(new CustomEvent(NPH_CHART_RETRY_EVENT, { bubbles: true, composed: true }));
  }

  /* ------------------------------------------------------------------ templates */

  private markerTemplate(index: number, hollow = false): TemplateResult {
    const series = this.shown[index];
    const path = MARKER_PATHS[shapeOf(index)] ?? '';
    return html`<svg
      class="marker"
      data-hollow=${hollow ? '' : nothing}
      viewBox="0 0 10 10"
      aria-hidden="true"
      focusable="false"
      style=${`--series: ${series === undefined ? 'var(--nph-chart-1)' : colorOf(series, index)}`}
    >
      <path d=${path}></path>
    </svg>`;
  }

  private ringShape(kind: 'separator' | 'border' | 'halo', shape: RingShape): TemplateResult {
    if (shape.type === 'circle') return svg`<circle class="ring ring-${kind}" cx=${shape.cx} cy=${shape.cy} r=${shape.r}></circle>`;
    if (shape.type === 'path') return svg`<path class="ring ring-${kind}" d=${shape.d}></path>`;
    const { x, y, w, h } = shape.box;
    return svg`<rect class="ring ring-${kind}" x=${x} y=${y} width=${w} height=${h}></rect>`;
  }

  private renderHighlight(): TemplateResult | typeof nothing {
    const highlight = this.highlight;
    if (highlight === null) return nothing;
    if (this.state === 'loading') {
      return html`<div class="highlight-loading" aria-hidden="true"><nph-skeleton></nph-skeleton></div>`;
    }
    const direction = highlight.direction ?? 'up';
    const sense = highlight.sense ?? 'neutral';
    const spoken = highlight.changeLabel !== undefined && highlight.changeLabel !== '';
    return html`<div class="highlight" data-sense=${sense}>
      <p class="highlight-value">${highlight.value}</p>
      <p class="highlight-change">
        ${highlight.changeLabel === undefined || highlight.changeLabel === '' ? nothing : html`<span class="sr">${highlight.changeLabel}</span>`}
        <nph-icon class="delta" data-direction=${direction} name=${direction === 'steady' ? 'minus' : 'arrow-up'} size="sm" aria-hidden="true"></nph-icon>
        <span class="delta-number" aria-hidden=${spoken ? 'true' : nothing}>${highlight.change}</span>
        ${highlight.comparison === undefined || highlight.comparison === '' ? nothing : html`<span class="delta-comparison" aria-hidden=${spoken ? 'true' : nothing}>${highlight.comparison}</span>`}
      </p>
    </div>`;
  }

  private ariaLabelOf(mark: Mark, scene: Scene): string {
    const locale = this.locale === '' ? undefined : this.locale;
    const series = this.shown[mark.s];
    if (series === undefined) return '';
    if (scene.type === 'donut') {
      const total = scene.donut?.total ?? 0;
      const value = series.values[0] ?? 0;
      return `${series.name}: ${formatValue(locale, value)} (${formatPercent(locale, total === 0 ? 0 : value / total)})`;
    }
    const value = series.values[mark.i];
    const text = typeof value === 'number' ? formatValue(locale, value) : this.noDataLabel;
    return scene.labeling === 'none' && this.shown.length === 1
      ? `${this.categories[mark.i] ?? ''}: ${text}`
      : `${series.name}, ${this.categories[mark.i] ?? ''}: ${text}`;
  }

  /** What the code builds for the summary: the type, the visible series and the range of the categories. */
  private describe(): string {
    const names = visibleIndexes(this.shown.length, this.hiddenSeries)
      .map((index) => this.shown[index]?.name ?? '')
      .join(', ');
    const parts: string[] = [this.typeLabel];
    if (names !== '') parts.push(this.seriesLabel === '' ? names : `${this.seriesLabel}: ${names}`);
    const first = this.categories[0];
    const last = this.categories[this.categories.length - 1];
    if (this.type !== 'donut' && this.type !== 'sparkline' && first !== undefined && last !== undefined && first !== last) {
      parts.push(this.categoryLabel === '' ? `${first} \u2013 ${last}` : `${this.categoryLabel}: ${first} \u2013 ${last}`);
    }
    return parts.filter((part) => part.trim() !== '').join('. ');
  }

  private renderPlot(scene: Scene): TemplateResult {
    const metrics = this.metrics as Metrics;
    const visible = visibleIndexes(this.shown.length, this.hiddenSeries);
    const empty = visible.length === 0;
    const dim = this.legendHover;
    const focusMark = this.focusKey === null ? undefined : scene.marks.find((mark) => mark.key === this.focusKey);
    const ring = focusMark === undefined || !this.ringVisible ? null : focusRing(focusMark, metrics);
    const tabbable = this.focusKey !== null && scene.marks.some((mark) => mark.key === this.focusKey) ? this.focusKey : (scene.marks.find((mark) => !mark.empty)?.key ?? null);
    const tipScene = this.tip !== null && !this.dismissed ? this.tip : null;
    const crosshairAt = tipScene !== null && (scene.type === 'line' || scene.type === 'area') ? scene.anchors[tipScene.i] : undefined;
    const seriesStyle = (s: number): string => {
      const item = this.shown[s];
      return item === undefined ? '' : `--series: ${colorOf(item, s)}; --series-soft: ${softColorOf(item, s)}`;
    };
    const dimmed = (s: number): boolean => dim !== null && dim !== s;
    const half = metrics.px.markerSize / 2;
    const scale = metrics.px.markerSize / 10;

    const marks = scene.marks.map((mark) => {
      const label = mark.empty ? nothing : this.ariaLabelOf(mark, scene);
      if (mark.kind === 'point') {
        const path = MARKER_PATHS[shapeOf(mark.s)] ?? '';
        return svg`<path
          class="mark marker-point"
          data-key=${mark.key}
          data-s=${mark.s}
          data-dim=${dimmed(mark.s) ? '' : nothing}
          tabindex=${mark.key === tabbable ? '0' : '-1'}
          role="img"
          aria-label=${label}
          style=${seriesStyle(mark.s)}
          transform=${`translate(${mark.cx - half} ${mark.cy - half}) scale(${scale})`}
          d=${path}
        ></path>`;
      }
      return svg`<path
        class="mark ${mark.kind === 'slice' ? 'slice' : 'bar'}"
        data-key=${mark.key}
        data-s=${mark.s}
        data-slice=${mark.kind === 'slice' ? mark.s : nothing}
        data-empty=${mark.empty ? '' : nothing}
        data-separated=${mark.separated ? '' : nothing}
        data-dim=${dimmed(mark.s) ? '' : nothing}
        tabindex=${mark.empty ? nothing : mark.key === tabbable ? '0' : '-1'}
        role=${mark.empty ? 'presentation' : 'img'}
        aria-label=${label}
        style=${seriesStyle(mark.s)}
        transform=${mark.kind === 'slice' && scene.donut !== null ? `translate(${scene.donut.cx} ${scene.donut.cy})` : nothing}
        d=${mark.d}
      ></path>`;
    });

    const donut = scene.donut;
    return html`<div
      class="plot"
      @pointermove=${this.onPointerMove}
      @pointerleave=${this.onPointerLeave}
      @focusin=${this.onFocusIn}
      @focusout=${this.onFocusOut}
      @keydown=${this.onKeyDown}
    >
      <svg
        width=${scene.width}
        height=${scene.height}
        viewBox=${`0 0 ${scene.width} ${scene.height}`}
        role="group"
        aria-label=${this.summary === '' ? nothing : this.summary}
        aria-describedby="description"
      >
        ${scene.gridLines.map((line) => svg`<line class="grid" x1=${line.x1} y1=${line.y1} x2=${line.x2} y2=${line.y2}></line>`)}
        ${scene.areas.map((area) => svg`<path class="wash" data-dim=${dimmed(area.s) ? '' : nothing} style=${seriesStyle(area.s)} d=${area.d}></path>`)}
        ${scene.lines.map((line) => svg`<path class="line" data-dim=${dimmed(line.s) ? '' : nothing} style=${seriesStyle(line.s)} d=${line.d}></path>`)}
        ${marks}
        ${scene.baseline === null ? nothing : svg`<line class="axis" x1=${scene.baseline.x1} y1=${scene.baseline.y1} x2=${scene.baseline.x2} y2=${scene.baseline.y2}></line>`}
        ${scene.goal === null
          ? nothing
          : svg`<line class="goal" x1=${scene.goal.x1} y1=${scene.goal.y1} x2=${scene.goal.x2} y2=${scene.goal.y2}></line>
              <text class="label" x=${scene.goal.label.x} y=${scene.goal.label.y} text-anchor="start" dominant-baseline="central">${scene.goal.label.text}</text>`}
        ${crosshairAt === undefined
          ? nothing
          : svg`<line class="crosshair" x1=${crosshairAt.x} y1=${crosshairAt.y} x2=${crosshairAt.x} y2=${scene.extent.y + scene.extent.h}></line>`}
        ${scene.valueTicks.map((tick) => svg`<text class="label" x=${tick.x} y=${tick.y} text-anchor=${tick.anchor} dominant-baseline="central" aria-hidden="true">${tick.text}</text>`)}
        ${scene.categoryLabels.map(
          (label) =>
            svg`<text class="label" x=${label.x} y=${label.y} text-anchor=${label.anchor} dominant-baseline=${scene.categoryAxis === 'y' ? 'central' : 'hanging'} aria-hidden="true">${label.text}</text>`,
        )}
        ${scene.noDataLabels.map((label) => svg`<text class="label" x=${label.x} y=${label.y} text-anchor="middle" dominant-baseline="hanging" aria-hidden="true">${label.text}</text>`)}
        ${scene.valueLabels.map((label) => svg`<text class="value-label" x=${label.x} y=${label.y} text-anchor=${label.anchor} dominant-baseline=${scene.categoryAxis === 'y' ? 'central' : 'auto'} aria-hidden="true">${label.text}</text>`)}
        ${scene.seriesLabels.map((label) =>
          label.secondary === undefined
            ? svg`<text class="label" x=${label.x} y=${label.y} text-anchor=${label.anchor} dominant-baseline=${scene.type === 'stacked-horizontal' ? 'auto' : 'central'} aria-hidden="true">${label.text}</text>`
            : svg`<text class="label" x=${label.x} y=${label.y} text-anchor=${label.anchor} dominant-baseline="auto" aria-hidden="true">${label.text}</text>
                <text class="value-label" x=${label.x} y=${label.y + metrics.lineHeight.labelSm} text-anchor=${label.anchor} dominant-baseline="auto" aria-hidden="true">${label.secondary}</text>`,
        )}
        ${donut === null
          ? nothing
          : svg`<text class="total" x=${donut.cx} y=${donut.cy} text-anchor="middle" dominant-baseline="auto" aria-hidden="true">${formatValue(this.locale === '' ? undefined : this.locale, donut.total)}</text>
              <text class="label" x=${donut.cx} y=${donut.cy + metrics.lineHeight.caption} text-anchor="middle" dominant-baseline="auto" aria-hidden="true">${this.totalLabel}</text>`}
        ${ring === null
          ? nothing
          : svg`<g transform=${focusMark?.kind === 'slice' && donut !== null ? `translate(${donut.cx} ${donut.cy})` : nothing}>${this.ringShape('halo', ring.halo)}${this.ringShape('border', ring.border)}${this.ringShape('separator', ring.separator)}</g>`}
      </svg>
      ${empty
        ? html`<div class="all-hidden"><nph-empty heading=${this.noSeriesHeading} description=${this.noSeriesDescription}></nph-empty></div>`
        : nothing}
      ${empty ? nothing : this.renderTooltip(scene)}
      <span id="description" class="sr">${this.describe()}</span>
    </div>`;
  }

  private renderSparkline(scene: Scene): TemplateResult {
    const line = scene.lines[0];
    return html`<svg
      class="sparkline"
      width=${scene.width}
      height=${scene.height}
      viewBox=${`0 0 ${scene.width} ${scene.height}`}
      role="img"
      aria-label=${this.summary === '' ? nothing : this.summary}
      style=${`--series: ${this.shown[0] === undefined ? 'var(--nph-chart-1)' : colorOf(this.shown[0], 0)}`}
    >
      <path class="line" d=${line?.d ?? ''}></path>
    </svg>`;
  }

  private renderLegend(scene: Scene | null): TemplateResult | typeof nothing {
    const type = this.type;
    const count = this.shown.length;
    const legend = type === 'grouped-vertical' ? count >= 2 : type === 'donut' ? count > 4 : count > 4;
    if (!legend || type === 'sparkline') return nothing;
    const locale = this.locale === '' ? undefined : this.locale;
    const donut = type === 'donut';
    const all = this.shown.reduce((sum, item) => sum + (item.values[0] ?? 0), 0);
    const visibleTotal = scene?.donut?.total ?? 0;
    return html`<div class="legend" data-values=${donut ? '' : nothing}>
      ${repeat(
        this.shown.map((item, index) => ({ item, index })),
        ({ index }) => index,
        ({ item, index }) => {
          const hidden = this.hiddenSeries.has(index);
          const share = donut ? (hidden ? (all === 0 ? 0 : (item.values[0] ?? 0) / all) : visibleTotal === 0 ? 0 : (item.values[0] ?? 0) / visibleTotal) : 0;
          return html`<button
            type="button"
            class="legend-item"
            aria-pressed=${hidden ? 'false' : 'true'}
            data-hidden=${hidden ? '' : nothing}
            @click=${() => this.toggleSeries(index)}
            @pointerenter=${() => {
              this.legendHover = index;
            }}
            @pointerleave=${() => {
              this.legendHover = null;
            }}
          >
            <span class="legend-label">${this.markerTemplate(index, hidden)}<span class="legend-name">${item.name}</span></span>
            ${donut ? html`<span class="legend-value">${formatPercent(locale, share)}</span>` : nothing}
          </button>`;
        },
      )}
    </div>`;
  }

  private renderTable(): TemplateResult {
    const locale = this.locale === '' ? undefined : this.locale;
    const data = tableOf(
      { type: this.type, categories: this.categories, series: this.shown, goal: this.goal },
      this.hiddenSeries,
      locale,
      {
        category: this.categoryLabel,
        difference: this.differenceLabel,
        value: this.valueLabel,
        goal: this.goalLabel,
        noValue: this.noValueLabel,
        unit: this.unit,
      },
    );
    return html`<nph-table
      class="table"
      label=${this.summary === '' ? this.categoryLabel : this.summary}
      no-value-label=${this.noValueLabel}
      .columns=${data.columns}
      .rows=${data.rows}
    ></nph-table>`;
  }

  private renderArea(scene: Scene | null): TemplateResult {
    const state = this.state;
    if (state === 'loading') {
      return html`<div class="area" aria-busy="true">
        <nph-skeleton class="skeleton-plot" shape="block" aria-hidden="true"></nph-skeleton>
      </div>`;
    }
    if (state === 'empty' || state === 'no-result') {
      const heading = state === 'empty' ? this.emptyHeading : this.noResultHeading;
      const description = state === 'empty' ? this.emptyDescription : this.noResultDescription;
      return html`<div class="area state"><nph-empty heading=${heading} description=${description}></nph-empty></div>`;
    }
    if (state === 'error') {
      return html`<div class="area state">
        <div class="error">
          <p class="error-message">
            <nph-icon class="error-icon" name="triangle-exclamation" size="sm" aria-hidden="true"></nph-icon>${this.errorMessage}
          </p>
          <nph-button severity="secondary" emphasis="ghost" size="compact" text=${this.retryLabel} @click=${() => this.retry()}></nph-button>
        </div>
      </div>`;
    }
    if (this.showTable) return html`<div class="area">${this.renderTable()}</div>`;
    if (this.type === 'sparkline') return html`<div class="area">${scene === null ? nothing : this.renderSparkline(scene)}</div>`;
    return html`<div class="area">${scene === null ? nothing : this.renderPlot(scene)}</div>`;
  }

  private renderProbes(): TemplateResult {
    return html`<div class="probes" aria-hidden="true">
      ${(Object.keys(PROBES) as ProbeKey[]).map((key) => html`<span class="probe" data-probe=${key} style=${`inline-size: var(${PROBES[key]})`}></span>`)}
      <span class="font font-caption" data-font="caption">Mg</span>
      <span class="font font-label-sm" data-font="labelSm">Mg</span>
      <span class="font font-heading-md" data-font="headingMd">Mg</span>
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problems().length > 0) return nothing;
    const scene = this.sceneOf();
    const sparkline = this.type === 'sparkline';
    const stateful = this.state === 'default';
    const bottomButton =
      stateful && !sparkline
        ? html`<nph-button
            class="view-toggle"
            severity="secondary"
            emphasis="ghost"
            size="compact"
            text=${this.showTable ? this.viewChartLabel : this.viewTableLabel}
            @click=${() => {
              this.showTable = !this.showTable;
              this.tip = null;
            }}
          ></nph-button>`
        : nothing;
    const legend = stateful && !this.showTable ? this.renderLegend(scene) : nothing;
    return html`<div class="chart" data-type=${this.type}>
      ${this.renderHighlight()}
      ${this.renderArea(scene)}
      ${legend === nothing && bottomButton === nothing ? nothing : html`<div class="bottom">${legend}${bottomButton}</div>`}
      <div class="live" role="status" aria-live="polite">${this.live}</div>
      ${this.renderProbes()}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphChart);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-chart': NphChart;
  }
  interface HTMLElementEventMap {
    'nph-retry': CustomEvent;
    'nph-series-visibility-change': CustomEvent<NphChartSeriesVisibilityChangeDetail>;
  }
}
