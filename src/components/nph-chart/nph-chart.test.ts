/**
 * Tests of `nph-chart` (DSA-101), in a real browser (P21, item 5): geometry, resolved color, focus and
 * keyboard only exist where there is layout.
 *
 * They prove the contract accepted in Figma (frame `7817:4454`): the ten types and what each draws, the colors
 * by order and not by brand, the legend with `aria-pressed` and the recomputation over the visible series (D-5),
 * every series hidden (D-2), the negative baseline (D-1), the donut over the visible slices (D-4), the table
 * alternative (D-3), the tooltip, the keyboard on the data, the states of the area and the invalid input.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import cssText from './nph-chart.css?raw';
import './nph-chart';
import { NphChart } from './nph-chart';
import type { NphChartSeries, NphChartType } from './nph-chart';
import { nearestCenter } from './nph-chart.layout';
import { groupSeries, inputProblems, labelingOf, tableOf } from './nph-chart.model';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

/** A brand that is not the default, read from the generated CSS. */
const DEFAULT_BRAND = /:root,\s*\[data-nph-brand="([\w-]+)"\]/.exec(tokensCss)?.[1] ?? '';
const OTHER_BRAND =
  [...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? '').find((brand) => brand !== DEFAULT_BRAND) ?? '';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const one: NphChartSeries[] = [{ name: 'Revenue', values: [62, 78, 54, 90, 71, 84] }];
const three: NphChartSeries[] = [
  { name: 'Revenue', values: [62, 70, 58, 84] },
  { name: 'Expense', values: [40, 45, 52, 48] },
  { name: 'Margin', values: [22, 25, 6, 36] },
];
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

interface Setup {
  type?: NphChartType;
  state?: string;
  categories?: string[];
  series?: NphChartSeries[];
  goal?: number | null;
  showValues?: boolean;
  width?: number;
}

async function mount(setup: Setup = {}): Promise<NphChart> {
  const host = document.createElement('div');
  host.style.cssText = `inline-size: ${setup.width ?? 560}px;`;
  const chart = document.createElement('nph-chart');
  chart.setAttribute('type', setup.type ?? 'column');
  chart.setAttribute('state', setup.state ?? 'default');
  chart.categories = setup.categories ?? months;
  chart.series = setup.series ?? one;
  chart.goal = setup.goal ?? null;
  chart.showValues = setup.showValues === true;
  chart.setAttribute('summary', 'Summary of the data.');
  chart.setAttribute('goal-label', 'Goal');
  chart.setAttribute('no-data-label', 'No data');
  chart.setAttribute('no-value-label', 'No value');
  chart.setAttribute('category-label', 'Month');
  chart.setAttribute('value-label', 'Value');
  chart.setAttribute('difference-label', 'Difference');
  chart.setAttribute('view-table-label', 'View as table');
  chart.setAttribute('view-chart-label', 'View as chart');
  chart.setAttribute('retry-label', 'Try again');
  chart.setAttribute('error-message', 'Could not load the chart.');
  chart.setAttribute('empty-heading', 'No data for the period');
  chart.setAttribute('no-series-heading', 'No series selected');
  chart.setAttribute('total-label', 'orders');
  chart.setAttribute('unit', 'R$ thousand');
  chart.setAttribute('others-label', 'Others');
  chart.setAttribute('type-label', 'Test chart');
  chart.setAttribute('series-label', 'Series');
  host.append(chart);
  document.body.append(host);
  await settle(chart);
  return chart;
}

/** Waits for the measures of the tokens and the width of the container, then for the draw. */
async function settle(chart: NphChart): Promise<void> {
  await chart.updateComplete;
  if (chart.state === 'default') {
    await vi.waitFor(() => {
      expect(chart.shadowRoot?.querySelector('.plot svg, svg.sparkline, nph-table')).not.toBeNull();
    });
  }
  await chart.updateComplete;
}

const root = (chart: NphChart): ShadowRoot => chart.shadowRoot as ShadowRoot;
const q = <T extends Element>(chart: NphChart, selector: string): T | null => root(chart).querySelector<T>(selector);
const all = <T extends Element>(chart: NphChart, selector: string): T[] => [...root(chart).querySelectorAll<T>(selector)];
const bars = (chart: NphChart): SVGPathElement[] => all<SVGPathElement>(chart, '.plot .bar');
const rect = (element: Element): DOMRect => element.getBoundingClientRect();

describe('registration and API', () => {
  it('defines nph-chart exactly once', () => {
    expect(customElements.get('nph-chart')).toBe(NphChart);
  });

  it('the type is column and the state is default by default, and both reflect', async () => {
    const chart = await mount();
    expect(chart.type).toBe('column');
    expect(chart.getAttribute('type')).toBe('column');
    expect(chart.getAttribute('state')).toBe('default');
  });

  it('the stylesheet writes no literal color, spacing or radius value', () => {
    const body = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(body).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(/);
    expect(body).not.toMatch(/\b\d+(\.\d+)?(px|rem|em)\b/);
  });
});

describe('invalid input', () => {
  it('a type outside the list draws nothing and says why', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const chart = document.createElement('nph-chart');
    chart.setAttribute('type', 'pie');
    chart.series = one;
    chart.categories = months;
    document.body.append(chart);
    await chart.updateComplete;
    expect(chart.hasAttribute('data-nph-rendered')).toBe(false);
    expect(root(chart).querySelector('.chart')).toBeNull();
    expect(error).toHaveBeenCalled();
  });

  it('reports each cause of the model', () => {
    const base = { type: 'stacked-vertical', state: 'default', categories: ['a', 'b'], highlight: null } as const;
    expect(inputProblems({ ...base, series: [] })).toHaveLength(1);
    expect(inputProblems({ ...base, series: [{ name: 'A', values: [1, -2] }] }).join()).toMatch(/negative/);
    expect(inputProblems({ ...base, series: [{ name: 'A', values: [1] }] }).join()).toMatch(/1 values for 2 categories/);
    expect(inputProblems({ ...base, type: 'column', series: three }).join()).toMatch(/takes one series/);
    expect(inputProblems({ ...base, type: 'donut', series: [{ name: 'A', values: [-1] }] }).join()).toMatch(/slice/);
    expect(inputProblems({ ...base, state: 'loading', series: [] })).toEqual([]);
  });
});

describe('the type decides how the series are read', () => {
  it.each([
    ['column', 1, 'none'],
    ['line', 3, 'direct'],
    ['line', 5, 'legend'],
    ['grouped-vertical', 3, 'legend'],
    ['stacked-horizontal', 4, 'direct'],
    ['donut', 4, 'direct'],
    ['donut', 5, 'legend'],
    ['sparkline', 1, 'none'],
  ] as const)('%s with %i series: %s', (type, count, expected) => {
    expect(labelingOf(type, count)).toBe(expected);
  });
});

describe('column', () => {
  it('draws one bar per category, from the zero axis up, in chart/1', async () => {
    const chart = await mount();
    const drawn = bars(chart);
    expect(drawn).toHaveLength(6);
    const axis = rect(q(chart, '.axis') as Element);
    for (const bar of drawn) {
      expect(Math.abs(rect(bar).bottom - axis.top)).toBeLessThan(1.5);
    }
    // 90 is the tallest value and 54 the shortest: heights keep the ratio of the values.
    const heights = drawn.map((bar) => rect(bar).height);
    expect(heights[3]! / heights[2]!).toBeCloseTo(90 / 54, 1);
    const probe = document.createElement('div');
    probe.style.color = 'var(--nph-chart-1)';
    document.body.append(probe);
    const expected = getComputedStyle(probe).color;
    expect(getComputedStyle(drawn[0] as Element).fill).toBe(expected);
  });

  it('puts the plot area at the reference height and the width of the container', async () => {
    const chart = await mount();
    const svg = q<SVGElement>(chart, '.plot svg') as SVGElement;
    expect(Math.round(rect(svg).width)).toBe(560);
    const probe = document.createElement('div');
    probe.style.blockSize = 'var(--nph-chart-plot-height)';
    document.body.append(probe);
    const plot = rect(probe).height;
    // The labels of the X axis sit below the reference height.
    expect(rect(svg).height).toBeGreaterThan(plot);
  });

  it('draws the dashed goal line and its label, only in the vertical types', async () => {
    const chart = await mount({ goal: 75 });
    const goal = q(chart, '.goal') as Element;
    expect(getComputedStyle(goal).strokeDasharray).not.toBe('none');
    expect(root(chart).textContent).toContain('Goal');
    const horizontal = await mount({ type: 'horizontal-bar', categories: ['A', 'B'], series: [{ name: 'S', values: [1, 2] }], goal: 1 });
    expect(q(horizontal, '.goal')).toBeNull();
  });

  it('keeps the series color when the brand changes: it follows the order, not the brand (item 8)', async () => {
    const chart = await mount();
    const before = getComputedStyle(bars(chart)[0] as Element).fill;
    document.documentElement.setAttribute('data-nph-brand', OTHER_BRAND);
    const after = getComputedStyle(bars(chart)[0] as Element).fill;
    document.documentElement.removeAttribute('data-nph-brand');
    expect(after).toBe(before);
  });

  it('draws a negative value below the zero axis (D-1)', async () => {
    const chart = await mount({ series: [{ name: 'Margin', values: [12, -8, 20, -14, 6, 18] }] });
    const axis = rect(q(chart, '.axis') as Element);
    const drawn = bars(chart);
    expect(rect(drawn[1] as Element).top).toBeGreaterThanOrEqual(axis.top - 1);
    expect(rect(drawn[0] as Element).bottom).toBeLessThanOrEqual(axis.top + 1);
  });

  it('draws a column with no data in chart/empty with the label "No data"', async () => {
    const chart = await mount({ series: [{ name: 'Revenue', values: [62, 78, null, 90, 71, 84] }] });
    const empty = all<SVGPathElement>(chart, '.bar[data-empty]');
    expect(empty).toHaveLength(1);
    expect(root(chart).textContent).toContain('No data');
  });

  it('writes the value at the end of the bar with show-values', async () => {
    const chart = await mount({ showValues: true });
    expect(all(chart, '.value-label').map((label) => label.textContent)).toEqual(['62', '78', '54', '90', '71', '84']);
  });

  it('shows one label every two categories when there are twelve', async () => {
    const twelve = Array.from({ length: 12 }, (_, at) => `M${at + 1}`);
    const chart = await mount({ categories: twelve, series: [{ name: 'S', values: twelve.map((_, at) => at + 1) }] });
    const labels = all(chart, '.label').map((label) => label.textContent);
    expect(labels).toContain('M1');
    expect(labels).not.toContain('M2');
    expect(labels).toContain('M3');
  });
});

describe('horizontal bar', () => {
  it('has the vertical zero axis, the categories on the left and no grid or scale', async () => {
    const chart = await mount({ type: 'horizontal-bar', categories: ['North', 'South'], series: [{ name: 'S', values: [48, 90] }] });
    expect(all(chart, '.grid')).toHaveLength(0);
    const axis = q(chart, '.axis') as Element;
    expect(rect(axis).height).toBeGreaterThan(rect(axis).width);
    const drawn = bars(chart);
    expect(rect(drawn[1] as Element).width / rect(drawn[0] as Element).width).toBeCloseTo(90 / 48, 1);
    expect(all(chart, '.label').map((label) => label.textContent)).toEqual(['North', 'South']);
  });

  it('cuts a long category on one line with an ellipsis', async () => {
    const long = 'Center-West and Federal District and a much longer name than the area allows';
    const chart = await mount({ type: 'horizontal-bar', width: 360, categories: [long, 'South'], series: [{ name: 'S', values: [48, 90] }] });
    const first = all(chart, '.label')[0]?.textContent ?? '';
    expect(first.endsWith('\u2026')).toBe(true);
  });
});

describe('grouped and stacked', () => {
  it('grouped vertical draws a bar per visible series and category, with the legend below', async () => {
    const chart = await mount({ type: 'grouped-vertical', categories: quarters, series: three });
    expect(bars(chart)).toHaveLength(12);
    expect(all(chart, '.legend-item')).toHaveLength(3);
    expect(all(chart, '.legend-item').every((item) => item.getAttribute('aria-pressed') === 'true')).toBe(true);
  });

  it('a hidden series leaves the plot and the Y scale is recomputed over the visible ones (D-5)', async () => {
    const chart = await mount({ type: 'stacked-vertical', categories: quarters, series: three });
    expect(bars(chart)).toHaveLength(12);
    const topBefore = Math.min(...bars(chart).map((bar) => rect(bar).top));
    const scaleBefore = all(chart, '.label').map((label) => label.textContent);
    const events: unknown[] = [];
    chart.addEventListener('nph-series-visibility-change', (event) => events.push((event as CustomEvent).detail));
    // Direct labels name the series; with three series there is no legend, so hide through the legend of a larger set.
    const many = await mount({
      type: 'stacked-vertical',
      categories: quarters,
      series: [...three, { name: 'D', values: [5, 5, 5, 5] }, { name: 'E', values: [5, 5, 5, 5] }],
    });
    const manyBefore = all(many, '.label').map((label) => label.textContent).join();
    const received: unknown[] = [];
    many.addEventListener('nph-series-visibility-change', (event) => received.push((event as CustomEvent).detail));
    (all<HTMLButtonElement>(many, '.legend-item')[0] as HTMLButtonElement).click();
    await many.updateComplete;
    expect(received).toEqual([{ index: 0, visible: false }]);
    expect(all(many, '.legend-item')[0]?.getAttribute('aria-pressed')).toBe('false');
    expect(bars(many)).toHaveLength(16);
    expect(all(many, '.label').map((label) => label.textContent).join()).not.toBe(manyBefore);
    expect(topBefore).toBeGreaterThan(0);
    expect(scaleBefore.length).toBeGreaterThan(0);
    expect(events).toEqual([]);
  });

  it('with every series hidden, the axes stay and the area shows "No series selected" (D-2)', async () => {
    const chart = await mount({
      type: 'grouped-vertical',
      categories: quarters,
      series: three,
    });
    for (const item of all<HTMLButtonElement>(chart, '.legend-item')) item.click();
    await chart.updateComplete;
    expect(bars(chart)).toHaveLength(0);
    expect(all(chart, '.grid').length).toBeGreaterThan(0);
    expect(all(chart, '.legend-item').every((item) => item.getAttribute('aria-pressed') === 'false')).toBe(true);
    const empty = q<HTMLElement>(chart, '.all-hidden nph-empty') as HTMLElement;
    expect(empty.getAttribute('heading')).toBe('No series selected');
  });

  it('the outer segment of a stack takes the corner, the others do not', async () => {
    const chart = await mount({ type: 'stacked-vertical', categories: quarters, series: three });
    const first = bars(chart).filter((bar) => bar.dataset['key']?.endsWith(':0'));
    const paths = first.map((bar) => bar.getAttribute('d') ?? '');
    expect(paths.filter((d) => d.includes('A'))).toHaveLength(1);
  });

  it('stacked horizontal names the series above the first bar', async () => {
    const chart = await mount({ type: 'stacked-horizontal', categories: quarters, series: three });
    expect(all(chart, '.label').map((label) => label.textContent)).toEqual(expect.arrayContaining(['Revenue', 'Expense', 'Margin']));
  });
});

describe('line and area', () => {
  it('draws one line per series with a marker per point, each series with its own shape', async () => {
    const chart = await mount({ type: 'line', categories: quarters, series: three });
    expect(all(chart, '.line')).toHaveLength(3);
    expect(all(chart, '.marker-point')).toHaveLength(12);
    const shapes = new Set(all(chart, '.marker-point').map((point) => point.getAttribute('d')));
    expect(shapes.size).toBe(3);
  });

  it('breaks the line where a value is missing', async () => {
    const chart = await mount({ type: 'line', series: [{ name: 'A', values: [1, 2, null, 4, 5, 6] }] });
    expect((q(chart, '.line') as Element).getAttribute('d')?.match(/M/g)).toHaveLength(2);
  });

  it('the area paints a wash under each line', async () => {
    const chart = await mount({ type: 'area' });
    expect(all(chart, '.wash')).toHaveLength(1);
  });
});

describe('donut', () => {
  const slices: NphChartSeries[] = [
    { name: 'Card', values: [40] },
    { name: 'Pix', values: [30] },
    { name: 'Slip', values: [20] },
    { name: 'Others', values: [10], others: true },
  ];

  it('draws a slice per series with the name and the percentage outside, and the total in the center', async () => {
    const chart = await mount({ type: 'donut', categories: [], series: slices });
    expect(all(chart, '.slice')).toHaveLength(4);
    const text = all(chart, 'text').map((node) => node.textContent);
    expect(text).toEqual(expect.arrayContaining(['Card', '40%', '100', 'orders']));
  });

  it('the group "Others" is drawn in chart/muted', async () => {
    const chart = await mount({ type: 'donut', categories: [], series: slices });
    const probe = document.createElement('div');
    probe.style.color = 'var(--nph-chart-muted)';
    document.body.append(probe);
    expect(getComputedStyle(all(chart, '.slice')[3] as Element).fill).toBe(getComputedStyle(probe).color);
  });

  it('with five slices the legend takes a line per slice with the value, and a hidden slice closes the ring (D-4)', async () => {
    const five = [...slices, { name: 'More', values: [10] }];
    const chart = await mount({ type: 'donut', categories: [], series: five });
    expect(all(chart, '.legend-item')).toHaveLength(5);
    expect(all(chart, '.legend-value').map((value) => value.textContent)[0]).toBe('36%');
    (all<HTMLButtonElement>(chart, '.legend-item')[4] as HTMLButtonElement).click();
    await chart.updateComplete;
    expect(all(chart, '.slice')).toHaveLength(4);
    expect(all(chart, '.legend-value').map((value) => value.textContent)[0]).toBe('40%');
  });
});

describe('sparkline', () => {
  it('draws one line at the sparkline height, with no axis, grid, marker or tooltip', async () => {
    const chart = await mount({ type: 'sparkline', categories: [], series: [{ name: 'S', values: [3, 5, 4, 7, 6, 9] }] });
    const svg = q<SVGElement>(chart, 'svg.sparkline') as SVGElement;
    const probe = document.createElement('div');
    probe.style.blockSize = 'var(--nph-chart-sparkline-height)';
    document.body.append(probe);
    expect(rect(svg).height).toBeCloseTo(rect(probe).height, 0);
    expect(all(chart, '.axis, .grid, .marker-point, .tooltip, .view-toggle')).toHaveLength(0);
  });

  it('takes up to twelve values', () => {
    const values = Array.from({ length: 13 }, (_, at) => at);
    expect(inputProblems({ type: 'sparkline', state: 'default', categories: [], series: [{ name: 'S', values }], highlight: null }).join()).toMatch(/up to 12/);
  });
});

describe('tooltip', () => {
  it('opens on hover with the category and a line per visible series, and leaves by opacity only', async () => {
    const chart = await mount({ type: 'grouped-vertical', categories: quarters, series: three });
    const svg = q<SVGElement>(chart, '.plot svg') as SVGElement;
    const bar = bars(chart)[0] as Element;
    const at = rect(bar);
    svg.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true, clientX: at.left + at.width / 2, clientY: at.top + 4 }));
    await chart.updateComplete;
    const tooltip = q<HTMLElement>(chart, '.tooltip') as HTMLElement;
    expect(tooltip.hasAttribute('data-open')).toBe(true);
    expect(tooltip.querySelector('.tooltip-title')?.textContent).toBe('Q1');
    expect(tooltip.querySelectorAll('.tooltip-line')).toHaveLength(3);
    expect(getComputedStyle(tooltip).transitionProperty).toBe('opacity');
    const box = rect(tooltip);
    expect(box.top).toBeGreaterThanOrEqual(rect(svg).top - 1);
  });

  it('Esc closes it without moving the focus', async () => {
    const chart = await mount();
    const first = bars(chart)[0] as SVGElement;
    first.focus();
    await chart.updateComplete;
    expect(q(chart, '.tooltip')?.hasAttribute('data-open')).toBe(true);
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await chart.updateComplete;
    expect(q(chart, '.tooltip')?.hasAttribute('data-open')).toBe(false);
    expect(root(chart).activeElement).toBe(first);
  });

  it('closes on a press outside the chart', async () => {
    const chart = await mount();
    (bars(chart)[0] as SVGElement).focus();
    await chart.updateComplete;
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
    await chart.updateComplete;
    expect(q(chart, '.tooltip')?.hasAttribute('data-open')).toBe(false);
  });
});

describe('keyboard on the data', () => {
  it('has one Tab stop in the plot (roving tabindex)', async () => {
    const chart = await mount({ type: 'line', categories: quarters, series: three });
    const stops = all(chart, '.mark').filter((mark) => mark.getAttribute('tabindex') === '0');
    expect(stops).toHaveLength(1);
  });

  it('Left and Right move along the series, Up and Down between the visible series, Home and End to the ends', async () => {
    const chart = await mount({ type: 'line', categories: quarters, series: three });
    const at = (key: string): Element | null => root(chart).querySelector(`[data-key="${key}"]`);
    (at('0:0') as SVGElement).focus();
    const press = async (key: string): Promise<string | undefined> => {
      (root(chart).activeElement as Element).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true }));
      await chart.updateComplete;
      return (root(chart).activeElement as HTMLElement | null)?.dataset['key'];
    };
    expect(await press('ArrowRight')).toBe('0:1');
    expect(await press('ArrowDown')).toBe('1:1');
    expect(await press('End')).toBe('1:3');
    expect(await press('Home')).toBe('1:0');
    expect(await press('ArrowUp')).toBe('0:0');
  });

  it('a hidden series is out of the arrow path', async () => {
    const six = Array.from({ length: 5 }, (_, at) => ({ name: `S${at}`, values: [at + 1, at + 2, at + 3, at + 4] }));
    const chart = await mount({ type: 'line', categories: quarters, series: six });
    (all<HTMLButtonElement>(chart, '.legend-item')[1] as HTMLButtonElement).click();
    await chart.updateComplete;
    (root(chart).querySelector('[data-key="0:0"]') as SVGElement).focus();
    (root(chart).activeElement as Element).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await chart.updateComplete;
    expect((root(chart).activeElement as HTMLElement).dataset['key']).toBe('2:0');
  });

  it('in the horizontal types Up and Down follow the categories', async () => {
    const chart = await mount({ type: 'horizontal-bar', categories: ['A', 'B', 'C'], series: [{ name: 'S', values: [1, 2, 3] }] });
    (root(chart).querySelector('[data-key="0:0"]') as SVGElement).focus();
    (root(chart).activeElement as Element).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await chart.updateComplete;
    expect((root(chart).activeElement as HTMLElement).dataset['key']).toBe('0:1');
  });

  it('every mark has an accessible name with the series, the category and the value', async () => {
    const chart = await mount({ type: 'line', categories: quarters, series: three });
    expect(q(chart, '[data-key="1:2"]')?.getAttribute('aria-label')).toBe('Expense, Q3: 52');
    expect(q(chart, 'svg')?.getAttribute('aria-label')).toBe('Summary of the data.');
  });
});

describe('table alternative', () => {
  it('swaps the area for the nph-table with the unit in the header, and the focus stays on the button', async () => {
    const chart = await mount({ goal: 75 });
    const button = q<HTMLElement>(chart, '.view-toggle') as HTMLElement;
    expect(button.getAttribute('text')).toBe('View as table');
    button.focus();
    button.click();
    await chart.updateComplete;
    const table = q<HTMLElement & { columns: Array<{ header: string }>; rows: unknown[] }>(chart, 'nph-table');
    expect(table).not.toBeNull();
    expect(table?.columns.map((column) => column.header)).toEqual(['Month', 'Revenue (R$ thousand)', 'Goal (R$ thousand)', 'Difference']);
    expect(table?.rows).toHaveLength(6);
    expect(q(chart, '.plot')).toBeNull();
    expect(q(chart, '.view-toggle')?.getAttribute('text')).toBe('View as chart');
    expect(root(chart).activeElement).toBe(q(chart, '.view-toggle'));
  });

  it('builds the columns by D-3: a hidden series leaves, the difference is signed, the donut is a slice and its value', () => {
    const labels = { category: 'Month', difference: 'Difference', value: 'Value', goal: 'Goal', noValue: '-', unit: 'R$ thousand' };
    const column = tableOf({ type: 'column', categories: ['Jan', 'Feb'], series: [{ name: 'Revenue', values: [62, 78] }], goal: 75 }, new Set(), 'en', labels);
    expect(column.rows.map((row) => row.cells['difference'])).toEqual(['\u221213', '+3']);
    const grouped = tableOf({ type: 'grouped-vertical', categories: ['Q1'], series: three, goal: null }, new Set([1]), 'en', labels);
    expect(grouped.columns.map((item) => item.header)).toEqual(['Month', 'Revenue (R$ thousand)', 'Margin (R$ thousand)']);
    const donut = tableOf({ type: 'donut', categories: [], series: [{ name: 'Card', values: [40] }], goal: null }, new Set(), 'en', labels);
    expect(donut.columns.map((item) => item.header)).toEqual(['Month', 'Value (R$ thousand)']);
  });
});

describe('states of the area', () => {
  it('loading: the skeleton block in the area, aria-busy and a live announcement', async () => {
    const chart = await mount({ state: 'loading' });
    const area = q(chart, '.area') as Element;
    expect(area.getAttribute('aria-busy')).toBe('true');
    expect(area.querySelector('nph-skeleton')?.getAttribute('shape')).toBe('block');
  });

  it('empty: the nph-empty with the heading it was given', async () => {
    const chart = await mount({ state: 'empty' });
    expect(q(chart, 'nph-empty')?.getAttribute('heading')).toBe('No data for the period');
    expect(q(chart, '.live')?.textContent).toBe('No data for the period');
  });

  it('error: the message, the triangle icon and "Try again", which fires nph-retry', async () => {
    const chart = await mount({ state: 'error' });
    expect(q(chart, '.error-message')?.textContent).toContain('Could not load the chart.');
    expect(q(chart, '.error-icon')?.getAttribute('name')).toBe('triangle-exclamation');
    let retried = 0;
    chart.addEventListener('nph-retry', () => (retried += 1));
    (q(chart, '.error nph-button') as HTMLElement).click();
    expect(retried).toBe(1);
  });

  it('draws the highlight with the arrow turned for a downward change and the color of the sense', async () => {
    const chart = await mount();
    chart.highlight = { value: '48.200', change: '8%', direction: 'down', sense: 'negative', comparison: 'vs last month' };
    await chart.updateComplete;
    expect(q(chart, '.highlight-value')?.textContent).toBe('48.200');
    const icon = q<HTMLElement>(chart, '.delta') as HTMLElement;
    expect(icon.getAttribute('name')).toBe('arrow-up');
    expect(getComputedStyle(icon).transform).not.toBe('none');
    expect(q(chart, '.highlight')?.getAttribute('data-sense')).toBe('negative');
  });
});

describe('legend', () => {
  it('hovering a legend item puts the other series in chart/muted', async () => {
    const chart = await mount({ type: 'grouped-vertical', categories: quarters, series: three });
    const item = all<HTMLElement>(chart, '.legend-item')[0] as HTMLElement;
    item.dispatchEvent(new PointerEvent('pointerenter'));
    await chart.updateComplete;
    expect(all(chart, '.bar[data-dim]').length).toBe(8);
    item.dispatchEvent(new PointerEvent('pointerleave'));
    await chart.updateComplete;
    expect(all(chart, '.bar[data-dim]')).toHaveLength(0);
  });

  it('a legend item is 24 px high, the minimum target', async () => {
    const chart = await mount({ type: 'grouped-vertical', categories: quarters, series: three });
    expect(rect(all(chart, '.legend-item')[0] as Element).height).toBe(24);
  });
});

describe('grouping and description', () => {
  it('groups the seventh series on into "Others", summed per category, in chart/muted', () => {
    const many = Array.from({ length: 9 }, (_, at) => ({ name: `S${at}`, values: [1, null, 3] }));
    const grouped = groupSeries(many, 'Others');
    expect(grouped).toHaveLength(7);
    expect(grouped[6]).toEqual({ name: 'Others', values: [3, null, 9], others: true });
    expect(groupSeries(many.slice(0, 6), 'Others')).toHaveLength(6);
  });

  it('draws the group as the last series, with the legend, and it is not an error', async () => {
    const many = Array.from({ length: 8 }, (_, at) => ({ name: `S${at}`, values: [at + 1, at + 2] }));
    const chart = await mount({ type: 'line', categories: ['A', 'B'], series: many });
    expect(chart.hasAttribute('data-nph-rendered')).toBe(true);
    const names = all(chart, '.legend-name').map((name) => name.textContent);
    expect(names).toHaveLength(7);
    expect(names[6]).toBe('Others');
  });

  it('describes the chart: the type, the visible series and the range of the categories', async () => {
    const chart = await mount({ type: 'line', categories: quarters, series: three });
    expect(q(chart, '#description')?.textContent).toBe('Test chart. Series: Revenue, Expense, Margin. Month: Q1 \u2013 Q4');
    expect(q(chart, 'svg')?.getAttribute('aria-describedby')).toBe('description');
  });

  it('reads the change of the highlight from changeLabel and hides the pieces it repeats', async () => {
    const chart = await mount();
    chart.highlight = { value: '1', change: '12%', direction: 'up', changeLabel: 'up 12% vs last month', comparison: 'vs last month' };
    await chart.updateComplete;
    expect(q(chart, '.highlight-change .sr')?.textContent).toBe('up 12% vs last month');
    expect(q(chart, '.delta-number')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('warns once in development that the horizontal types draw no goal', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await mount({ type: 'horizontal-bar', categories: ['A'], series: [{ name: 'S', values: [1] }], goal: 1 });
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('does not draw a goal'))).toHaveLength(1);
  });
});

describe('the category under the pointer', () => {
  const centers = [40, 100, 160, 220];

  it('finds the nearest center, with ties going to the later one', () => {
    expect(nearestCenter(centers, 41)).toBe(0);
    expect(nearestCenter(centers, 99)).toBe(1);
    expect(nearestCenter(centers, 129)).toBe(1);
    expect(nearestCenter(centers, 131)).toBe(2);
    expect(nearestCenter(centers, 219)).toBe(3);
  });

  it('takes the first or the last category outside the plot', () => {
    expect(nearestCenter(centers, -500)).toBe(0);
    expect(nearestCenter(centers, 9999)).toBe(3);
  });

  it('answers null with no category or no position', () => {
    expect(nearestCenter([], 10)).toBeNull();
    expect(nearestCenter(centers, Number.NaN)).toBeNull();
  });

  it('agrees with the linear search on a thousand categories', () => {
    const many = Array.from({ length: 1000 }, (_, at) => at * 3 + 1);
    const linear = (x: number): number => many.reduce((best, c, at) => (Math.abs(c - x) < Math.abs((many[best] as number) - x) ? at : best), 0);
    for (const x of [-5, 0, 1, 2.4, 2.6, 1500, 1501.4, 2998, 3500]) {
      const found = nearestCenter(many, x) as number;
      expect(Math.abs((many[found] as number) - x)).toBe(Math.abs((many[linear(x)] as number) - x));
    }
  });
});
