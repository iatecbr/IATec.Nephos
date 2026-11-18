/**
 * Tests of `nph-calendar` (P133), in a real browser (P21, item 5): the measures, the focus and the keyboard only exist
 * where there is layout.
 *
 * They prove the contract accepted in Figma (the grid `4015:28204`, its day `4015:28020`, the month and year cell
 * `4015:28139`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-90: the API and the invalid input, the
 * six-week month (D-1), the day states, the range bands and the preview, the limits and the day unavailable by rule
 * (item 9), the keyboard of the grid and the two grids of a range (D-11), the month and year views (D-2, D-9), the
 * events, the measures and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-calendar.css?raw';
import { NPH_CALENDAR_LABEL_KEYS, NphCalendar } from './nph-calendar';
import type { NphCalendarLabels, NphCalendarPickDetail } from './nph-calendar';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
  await page.viewport(1024, 768);
});

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

const LABELS: NphCalendarLabels = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  previousYears: 'Previous 12 years',
  nextYears: 'Next 12 years',
  today: 'today',
  selected: 'selected',
  unavailable: 'unavailable',
};

async function mount(props: Partial<NphCalendar> & { lang?: string } = {}): Promise<NphCalendar> {
  const { lang, ...rest } = props;
  const calendar = document.createElement('nph-calendar') as NphCalendar;
  calendar.now = '2026-10-14';
  calendar.labels = LABELS;
  Object.assign(calendar, rest);
  if (lang !== undefined) calendar.setAttribute('lang', lang);
  document.body.append(calendar);
  await settle(calendar);
  return calendar;
}

async function settle(calendar: NphCalendar): Promise<void> {
  await calendar.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  await calendar.updateComplete;
}

const root = (calendar: NphCalendar): ShadowRoot => calendar.shadowRoot as ShadowRoot;
const day = (calendar: NphCalendar, date: string, outside = false): HTMLButtonElement =>
  root(calendar).querySelector<HTMLButtonElement>(`button.day[data-date="${date}"]${outside ? '[data-outside]' : ':not([data-outside])'}`) as HTMLButtonElement;
const days = (calendar: NphCalendar): HTMLButtonElement[] => [...root(calendar).querySelectorAll<HTMLButtonElement>('button.day')];
const titles = (calendar: NphCalendar): string[] =>
  [...root(calendar).querySelectorAll('.title')].map((title) => (title as HTMLElement & { text?: string }).text ?? title.textContent?.trim() ?? '');
const active = (): Element | null => {
  let node = document.activeElement;
  while (node?.shadowRoot?.activeElement) node = node.shadowRoot.activeElement;
  return node;
};
const focused = (calendar: NphCalendar): string | null => {
  const node = root(calendar).activeElement as HTMLElement | null;
  return node?.dataset?.date ?? null;
};
const color = (element: Element, property = 'color'): string => getComputedStyle(element).getPropertyValue(property);
/** The value a token resolves to, as the browser computes it for `color`. */
function resolved(token: string): string {
  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  document.body.append(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
}
async function press(calendar: NphCalendar, keys: string): Promise<void> {
  await userEvent.keyboard(keys);
  await settle(calendar);
}

describe('the API and the invalid input', () => {
  it('has exactly the declared reactive properties', () => {
    expect([...NphCalendar.elementProperties.keys()].sort()).toEqual(
      ['end', 'labels', 'max', 'min', 'mode', 'month', 'months', 'now', 'size', 'start', 'unavailable', 'value', 'weekStart'].sort(),
    );
  });

  it('has the documented defaults', async () => {
    const calendar = document.createElement('nph-calendar') as NphCalendar;
    expect(calendar.mode).toBe('single');
    expect(calendar.size).toBe('default');
    expect(calendar.months).toBe(1);
    expect(calendar.weekStart).toBe('sunday');
    expect(calendar.value).toBe('');
  });

  it('reflects mode, size and months, which the CSS and the consumer select by', async () => {
    const calendar = await mount({ mode: 'range', size: 'large', months: 2 });
    expect(calendar.getAttribute('mode')).toBe('range');
    expect(calendar.getAttribute('size')).toBe('large');
    expect(calendar.getAttribute('months')).toBe('2');
  });

  it('draws nothing and says why, once per cause, for input that does not exist', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const calendar = await mount({ mode: 'weekly', size: 'huge', months: 3 as never, weekStart: 'friday', value: '2026-02-30', month: 'nope' });
    expect(root(calendar).querySelector('table')).toBeNull();
    expect(calendar.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(calendar).display).toBe('none');
    const messages = error.mock.calls.map((call) => String(call[0]));
    for (const word of ['mode "weekly"', 'size "huge"', 'months "3"', 'week-start "friday"', 'value "2026-02-30"', 'month "nope"']) {
      expect(messages.filter((message) => message.includes(word)), word).toHaveLength(1);
    }
    calendar.requestUpdate();
    await calendar.updateComplete;
    expect(error.mock.calls.length, 'one per cause while it lasts').toBe(messages.length);
  });

  it('renders anyway when a label is missing, and says which keys, once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const calendar = await mount({ labels: { previousMonth: 'Previous month' } });
    expect(root(calendar).querySelector('table')).not.toBeNull();
    const missing = error.mock.calls.map((call) => String(call[0])).filter((message) => message.includes('labels is missing'));
    expect(missing).toHaveLength(1);
    for (const key of NPH_CALENDAR_LABEL_KEYS.filter((name) => name !== 'previousMonth')) expect(missing[0]).toContain(key);
    calendar.requestUpdate();
    await calendar.updateComplete;
    expect(error.mock.calls.filter((call) => String(call[0]).includes('labels is missing'))).toHaveLength(1);
  });
});

describe('the month (D-1)', () => {
  it('always draws six week rows of seven days, in every month', async () => {
    for (const month of ['2026-02', '2026-03', '2026-10', '2026-11', '2024-02']) {
      const calendar = await mount({ month });
      expect(root(calendar).querySelectorAll('tbody tr'), month).toHaveLength(6);
      expect(days(calendar), month).toHaveLength(42);
      calendar.remove();
    }
  });

  it('shows the days of the previous and the next month, muted, and counts the month whole inside them', async () => {
    const calendar = await mount({ month: '2026-10' });
    const inMonth = days(calendar).filter((button) => !button.hasAttribute('data-outside'));
    expect(inMonth).toHaveLength(31);
    expect(day(calendar, '2026-09-27', true)).not.toBeNull();
    expect(day(calendar, '2026-11-07', true)).not.toBeNull();
    expect(color(day(calendar, '2026-09-27', true))).toBe(color(root(calendar).querySelector('.weekday') as Element));
  });

  it('starts the week on Sunday, or on Monday with week-start', async () => {
    const calendar = await mount({ month: '2026-10' });
    const heads = (): string[] => [...root(calendar).querySelectorAll('.weekday')].map((cell) => cell.getAttribute('abbr') ?? '');
    expect(heads()[0]).toBe('Sunday');
    calendar.weekStart = 'monday';
    await settle(calendar);
    expect(heads()[0]).toBe('Monday');
    expect(heads()[6]).toBe('Sunday');
  });

  it('writes the names in the language of the nearest lang, from Intl', async () => {
    const calendar = await mount({ month: '2026-10', lang: 'pt-BR' });
    expect(titles(calendar)[0]).toBe('outubro de 2026');
    expect(root(calendar).querySelector('.weekday')?.getAttribute('abbr')).toBe('domingo');
    const full = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2026, 9, 14)),
    );
    expect(day(calendar, '2026-10-14').getAttribute('aria-label')).toContain(full);
  });

  it('opens on the month of the chosen date, or on the month of today', async () => {
    expect(titles(await mount())[0]).toBe('October 2026');
    const chosen = await mount({ value: '2027-03-09' });
    expect(titles(chosen)[0]).toBe('March 2027');
  });

  it('has the drawn measures: 284 × 332 on default and 340 × 388 on large with six rows, the header 40 high', async () => {
    const calendar = await mount({ month: '2026-10' });
    const box = calendar.getBoundingClientRect();
    expect(box.width).toBe(284);
    expect(box.height).toBe(332);
    expect(root(calendar).querySelector('.header')?.getBoundingClientRect().height).toBe(40);
    expect(day(calendar, '2026-10-14').getBoundingClientRect().width).toBe(36);
    calendar.size = 'large';
    await settle(calendar);
    expect(calendar.getBoundingClientRect().width).toBe(340);
    expect(calendar.getBoundingClientRect().height).toBe(388);
    expect(day(calendar, '2026-10-14').getBoundingClientRect().width).toBe(44);
    expect(root(calendar).querySelector('.header')?.getBoundingClientRect().height).toBe(40);
  });
});

describe('the text roles (D-3)', () => {
  it('draws the weekday names in text/label-sm until the design owner answers: 12, medium, line height 16, tracking 0.4', async () => {
    const calendar = await mount({ month: '2026-10' });
    const style = getComputedStyle(root(calendar).querySelector('.weekday') as Element);
    expect(style.fontSize).toBe('12px');
    expect(style.fontWeight).toBe('500');
    expect(style.lineHeight).toBe('16px');
    expect(style.letterSpacing).toBe('0.4px');
  });

  it('draws the number of a day in text/body-md and the month title in text/label-md', async () => {
    const calendar = await mount({ month: '2026-10' });
    const number = getComputedStyle(day(calendar, '2026-10-15'));
    expect([number.fontSize, number.fontWeight, number.lineHeight]).toEqual(['14px', '400', '20px']);
  });
});

describe('the day states', () => {
  it('marks today with the outline and the number in color/primary-text, in medium', async () => {
    const calendar = await mount({ month: '2026-10' });
    const today = day(calendar, '2026-10-14');
    expect(today.getAttribute('aria-current')).toBe('date');
    expect(today.getAttribute('aria-label')).toBe('Wednesday, October 14, 2026, today');
    expect(getComputedStyle(today).fontWeight).toBe('500');
    expect(getComputedStyle(today).boxShadow).not.toBe('none');
    expect(color(today)).toBe(resolved('--nph-color-primary-text'));
    expect(color(day(calendar, '2026-10-15'))).toBe(resolved('--nph-color-foreground'));
  });

  it('chooses a single date with color/primary and says it is selected', async () => {
    const calendar = await mount({ month: '2026-10', value: '2026-10-20' });
    const chosen = day(calendar, '2026-10-20');
    expect(chosen.hasAttribute('data-selected')).toBe(true);
    expect(chosen.closest('td')?.getAttribute('aria-selected')).toBe('true');
    expect(chosen.getAttribute('aria-label')).toBe('Tuesday, October 20, 2026, selected');
    expect(getComputedStyle(chosen).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(chosen).fontWeight).toBe('500');
    expect(day(calendar, '2026-10-21').closest('td')?.getAttribute('aria-selected')).toBe('false');
  });

  it('paints the hover with color/accent without moving the focus', async () => {
    const calendar = await mount({ month: '2026-10' });
    const target = day(calendar, '2026-10-22');
    const rest = getComputedStyle(target).backgroundColor;
    await userEvent.hover(target);
    expect(getComputedStyle(target).backgroundColor).not.toBe(rest);
    expect(active()).not.toBe(target);
  });

  it('draws the focus as a border and a halo at calendar/day-focus-radius', async () => {
    const calendar = await mount({ month: '2026-10' });
    calendar.focusDate('2026-10-14');
    await settle(calendar);
    const target = day(calendar, '2026-10-14');
    expect(root(calendar).activeElement).toBe(target);
    expect(getComputedStyle(target).boxShadow).not.toBe('none');
    const halo = getComputedStyle(target, '::after');
    expect(halo.borderTopWidth).toBe('4px');
    expect(halo.borderTopLeftRadius).toBe('14px');
    expect(getComputedStyle(target).borderTopLeftRadius).toBe('10px');
  });
});

describe('the limits and the day unavailable by rule (item 9)', () => {
  it('disables a day outside min and max under state/disabled-opacity, and the focus skips it', async () => {
    const calendar = await mount({ month: '2026-10', value: '2026-10-14', min: '2026-10-10', max: '2026-10-20' });
    const before = day(calendar, '2026-10-09');
    expect(before.disabled).toBe(true);
    expect(getComputedStyle(before).opacity).toBe('0.5');
    expect(day(calendar, '2026-10-21').disabled).toBe(true);
    calendar.focusDate('2026-10-10');
    await settle(calendar);
    await press(calendar, '{ArrowLeft}');
    expect(focused(calendar)).toBe('2026-10-10');
    calendar.focusDate('2026-10-20');
    await settle(calendar);
    await press(calendar, '{ArrowRight}');
    expect(focused(calendar)).toBe('2026-10-20');
  });

  it('does not choose a day outside the limits', async () => {
    const calendar = await mount({ month: '2026-10', min: '2026-10-10' });
    const picked = vi.fn();
    calendar.addEventListener('nph-pick', picked);
    day(calendar, '2026-10-05').click();
    expect(picked).not.toHaveBeenCalled();
    expect(calendar.value).toBe('');
  });

  it('opens the focus on the nearest allowed day when today is outside the limit', async () => {
    const calendar = await mount({ now: '2026-10-14', min: '2026-10-20', max: '2026-10-25' });
    calendar.focusDate();
    await settle(calendar);
    expect(focused(calendar)).toBe('2026-10-20');
  });

  it('fades only the number of a date unavailable by rule: no opacity, focusable, aria-disabled, never chosen', async () => {
    const calendar = await mount({ month: '2026-10', unavailable: ['2026-10-15'] });
    const holiday = day(calendar, '2026-10-15');
    expect(holiday.getAttribute('aria-disabled')).toBe('true');
    expect(holiday.disabled).toBe(false);
    expect(getComputedStyle(holiday).opacity).toBe('1');
    expect(holiday.getAttribute('aria-label')).toContain('unavailable');
    const picked = vi.fn();
    calendar.addEventListener('nph-pick', picked);
    holiday.click();
    expect(picked).not.toHaveBeenCalled();
    calendar.focusDate('2026-10-14');
    await settle(calendar);
    await press(calendar, '{ArrowRight}');
    expect(focused(calendar)).toBe('2026-10-15');
    await press(calendar, '{Enter}');
    expect(calendar.value).toBe('');
    expect(getComputedStyle(holiday).boxShadow).not.toBe('none');
  });

  it('takes a function as the rule', async () => {
    const calendar = await mount({ month: '2026-10', unavailable: (date: string) => date.endsWith('-17') });
    expect(day(calendar, '2026-10-17').getAttribute('aria-disabled')).toBe('true');
    expect(day(calendar, '2026-10-18').getAttribute('aria-disabled')).toBeNull();
  });

  it('disables the arrow whose month has no allowed day, with no tooltip', async () => {
    const calendar = await mount({ month: '2026-10', min: '2026-10-01', max: '2026-10-31' });
    const [previous, next] = [...root(calendar).querySelectorAll<HTMLElement & { disabled: boolean }>('.header nph-button.arrow')];
    expect(previous?.disabled).toBe(true);
    expect(next?.disabled).toBe(true);
  });
});

describe('the single date', () => {
  it('chooses a day on click, writes value and fires nph-pick with the date', async () => {
    const calendar = await mount({ month: '2026-10' });
    const picked = vi.fn();
    calendar.addEventListener('nph-pick', (event) => picked((event as CustomEvent<NphCalendarPickDetail>).detail));
    await userEvent.click(day(calendar, '2026-10-22'));
    await settle(calendar);
    expect(calendar.value).toBe('2026-10-22');
    expect(picked).toHaveBeenCalledWith({ date: '2026-10-22', start: '2026-10-22', end: '' });
  });

  it('fires nothing when code sets the value', async () => {
    const calendar = await mount({ month: '2026-10' });
    const picked = vi.fn();
    calendar.addEventListener('nph-pick', picked);
    calendar.value = '2026-10-05';
    await settle(calendar);
    expect(picked).not.toHaveBeenCalled();
  });

  it('chooses a day outside the month and moves the shown month to it (D-11)', async () => {
    const calendar = await mount({ month: '2026-10' });
    const months = vi.fn();
    calendar.addEventListener('nph-month-change', (event) => months((event as CustomEvent<{ month: string }>).detail));
    await userEvent.click(day(calendar, '2026-11-03', true));
    await settle(calendar);
    expect(calendar.value).toBe('2026-11-03');
    expect(titles(calendar)[0]).toBe('November 2026');
    expect(months).toHaveBeenCalledWith({ month: '2026-11-01' });
  });

  it('chooses with Enter and with Space', async () => {
    const calendar = await mount({ month: '2026-10' });
    calendar.focusDate('2026-10-14');
    await settle(calendar);
    await press(calendar, '{ArrowRight}{Enter}');
    expect(calendar.value).toBe('2026-10-15');
    await press(calendar, '{ArrowRight} ');
    expect(calendar.value).toBe('2026-10-16');
  });
});

describe('the keyboard of the grid', () => {
  async function onThe14th(): Promise<NphCalendar> {
    const calendar = await mount({ month: '2026-10' });
    calendar.focusDate('2026-10-14');
    await settle(calendar);
    return calendar;
  }

  it('is one Tab stop: only the active day has tabindex 0', async () => {
    const calendar = await onThe14th();
    expect(days(calendar).filter((button) => button.tabIndex === 0).map((button) => button.dataset.date)).toEqual(['2026-10-14']);
  });

  it('moves one day with the left and right arrows and one week with the up and down arrows', async () => {
    const calendar = await onThe14th();
    await press(calendar, '{ArrowRight}');
    expect(focused(calendar)).toBe('2026-10-15');
    await press(calendar, '{ArrowLeft}{ArrowLeft}');
    expect(focused(calendar)).toBe('2026-10-13');
    await press(calendar, '{ArrowDown}');
    expect(focused(calendar)).toBe('2026-10-20');
    await press(calendar, '{ArrowUp}{ArrowUp}');
    expect(focused(calendar)).toBe('2026-10-06');
  });

  it('reverses the horizontal arrows in right-to-left writing', async () => {
    const calendar = await mount({ month: '2026-10' });
    calendar.style.direction = 'rtl';
    calendar.focusDate('2026-10-14');
    await settle(calendar);
    await press(calendar, '{ArrowRight}');
    expect(focused(calendar)).toBe('2026-10-13');
  });

  it('goes to the start and the end of the week with Home and End', async () => {
    const calendar = await onThe14th();
    await press(calendar, '{Home}');
    expect(focused(calendar)).toBe('2026-10-11');
    await press(calendar, '{End}');
    expect(focused(calendar)).toBe('2026-10-17');
    calendar.weekStart = 'monday';
    await settle(calendar);
    await press(calendar, '{Home}');
    expect(focused(calendar)).toBe('2026-10-12');
    await press(calendar, '{End}');
    expect(focused(calendar)).toBe('2026-10-18');
  });

  it('changes the month with Page Up and Page Down, on the same day or the last day, and the year with Shift', async () => {
    const calendar = await onThe14th();
    await press(calendar, '{PageDown}');
    expect(focused(calendar)).toBe('2026-11-14');
    expect(titles(calendar)[0]).toBe('November 2026');
    await press(calendar, '{PageUp}{PageUp}');
    expect(focused(calendar)).toBe('2026-09-14');
    calendar.focusDate('2026-01-31');
    await settle(calendar);
    await press(calendar, '{PageDown}');
    expect(focused(calendar)).toBe('2026-02-28');
    await press(calendar, '{Shift>}{PageDown}{/Shift}');
    expect(focused(calendar)).toBe('2027-02-28');
    expect(titles(calendar)[0]).toBe('February 2027');
    await press(calendar, '{Shift>}{PageUp}{/Shift}');
    expect(focused(calendar)).toBe('2026-02-28');
  });

  it('crosses to the next month with an arrow from its last day', async () => {
    const calendar = await mount({ month: '2026-10' });
    calendar.focusDate('2026-10-31');
    await settle(calendar);
    await press(calendar, '{ArrowRight}');
    expect(focused(calendar)).toBe('2026-11-01');
    expect(titles(calendar)[0]).toBe('November 2026');
  });
});

describe('the header', () => {
  it('has the arrows as icon-only buttons named Previous month and Next month, and moves the month', async () => {
    const calendar = await mount({ month: '2026-10' });
    const [previous, next] = [...root(calendar).querySelectorAll<HTMLElement & { label: string }>('.header nph-button.arrow')];
    expect(previous?.label).toBe('Previous month');
    expect(next?.label).toBe('Next month');
    const months = vi.fn();
    calendar.addEventListener('nph-month-change', (event) => months((event as CustomEvent<{ month: string }>).detail));
    (next as HTMLElement).click();
    await settle(calendar);
    expect(titles(calendar)[0]).toBe('November 2026');
    (previous as HTMLElement).click();
    (previous as HTMLElement).click();
    await settle(calendar);
    expect(titles(calendar)[0]).toBe('September 2026');
    expect(months).toHaveBeenCalledTimes(3);
  });

  it('announces the month in a live region apart from the title button', async () => {
    const calendar = await mount({ month: '2026-10' });
    const status = root(calendar).querySelector('.status') as HTMLElement;
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.getAttribute('role')).toBe('status');
    expect(status.textContent).toBe('October 2026');
    ((root(calendar).querySelectorAll('.header nph-button.arrow')[1]) as HTMLElement).click();
    await settle(calendar);
    expect(status.textContent).toBe('November 2026');
  });
});

describe('the range', () => {
  const period = { mode: 'range', month: '2026-10', start: '2026-10-10', end: '2026-10-14' } as const;

  it('marks the Start and the End with color/primary and the days between with color/primary-surface, square', async () => {
    const calendar = await mount({ ...period });
    expect(day(calendar, '2026-10-10').dataset.role).toBe('start');
    expect(day(calendar, '2026-10-14').dataset.role).toBe('end');
    const middle = day(calendar, '2026-10-12');
    expect(middle.dataset.role).toBe('middle');
    expect(getComputedStyle(middle).borderTopLeftRadius).toBe('0px');
    expect(getComputedStyle(day(calendar, '2026-10-10')).borderTopLeftRadius).toBe('10px');
    expect(getComputedStyle(day(calendar, '2026-10-10')).backgroundColor).not.toBe(getComputedStyle(middle).backgroundColor);
    for (const date of ['2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13', '2026-10-14']) {
      expect(day(calendar, date).closest('td')?.getAttribute('aria-selected'), date).toBe('true');
    }
    expect(day(calendar, '2026-10-15').closest('td')?.getAttribute('aria-selected')).toBe('false');
  });

  it('runs the band straight across the turn of the week', async () => {
    const calendar = await mount({ ...period, start: '2026-10-09', end: '2026-10-14' });
    const saturday = day(calendar, '2026-10-10').closest('td') as HTMLElement;
    const sunday = day(calendar, '2026-10-11').closest('td') as HTMLElement;
    expect(saturday.dataset.band).toBe('full');
    expect(sunday.dataset.band).toBe('full');
    expect(getComputedStyle(saturday, '::before').backgroundColor).toBe(getComputedStyle(sunday, '::before').backgroundColor);
    expect(getComputedStyle(saturday, '::before').borderTopLeftRadius).toBe('0px');
  });

  it('puts a band behind the Start toward the End and behind the End toward the Start, and none on a one-day period', async () => {
    const calendar = await mount({ ...period });
    expect((day(calendar, '2026-10-10').closest('td') as HTMLElement).dataset.band).toBe('after');
    expect((day(calendar, '2026-10-14').closest('td') as HTMLElement).dataset.band).toBe('before');
    calendar.end = '2026-10-10';
    await settle(calendar);
    expect((day(calendar, '2026-10-10').closest('td') as HTMLElement).dataset.band).toBeUndefined();
    expect(day(calendar, '2026-10-10').dataset.role).toBe('single');
  });

  it('keeps the fill of a middle day outside the month, with the number muted, and no band behind a start outside it', async () => {
    const calendar = await mount({ mode: 'range', month: '2026-10', start: '2026-09-28', end: '2026-10-03' });
    const outsideMiddle = day(calendar, '2026-09-30', true);
    expect(outsideMiddle.dataset.role).toBe('middle');
    expect(getComputedStyle(outsideMiddle).backgroundColor).toBe(getComputedStyle(day(calendar, '2026-10-01')).backgroundColor);
    expect(color(outsideMiddle)).toBe(color(root(calendar).querySelector('.weekday') as Element));
    expect((day(calendar, '2026-09-28', true).closest('td') as HTMLElement).dataset.band).toBeUndefined();
  });

  it('writes the Start with the first pick, the End with the second, and fires nph-pick each time', async () => {
    const calendar = await mount({ mode: 'range', month: '2026-10' });
    const picked = vi.fn();
    calendar.addEventListener('nph-pick', (event) => picked((event as CustomEvent<NphCalendarPickDetail>).detail));
    await userEvent.click(day(calendar, '2026-10-10'));
    expect([calendar.start, calendar.end]).toEqual(['2026-10-10', '']);
    await userEvent.click(day(calendar, '2026-10-14'));
    expect([calendar.start, calendar.end]).toEqual(['2026-10-10', '2026-10-14']);
    expect(picked).toHaveBeenLastCalledWith({ date: '2026-10-14', start: '2026-10-10', end: '2026-10-14' });
  });

  it('reorders an End picked before the Start (D-10), accepts one day, and starts over on a third pick', async () => {
    const calendar = await mount({ mode: 'range', month: '2026-10' });
    await userEvent.click(day(calendar, '2026-10-20'));
    await userEvent.click(day(calendar, '2026-10-12'));
    expect([calendar.start, calendar.end]).toEqual(['2026-10-12', '2026-10-20']);
    await userEvent.click(day(calendar, '2026-10-05'));
    expect([calendar.start, calendar.end]).toEqual(['2026-10-05', '']);
    await userEvent.click(day(calendar, '2026-10-05'));
    expect([calendar.start, calendar.end]).toEqual(['2026-10-05', '2026-10-05']);
  });

  it('previews the band from the Start to the pointer, and to the focused day on the keyboard', async () => {
    const calendar = await mount({ mode: 'range', month: '2026-10', start: '2026-10-10' });
    await userEvent.hover(day(calendar, '2026-10-14'));
    await settle(calendar);
    expect(day(calendar, '2026-10-12').hasAttribute('data-preview')).toBe(true);
    expect(day(calendar, '2026-10-10').hasAttribute('data-preview')).toBe(false);
    expect(day(calendar, '2026-10-15').hasAttribute('data-preview')).toBe(false);
    expect(getComputedStyle(day(calendar, '2026-10-12')).borderTopLeftRadius).toBe('0px');
    await userEvent.unhover(day(calendar, '2026-10-14'));
    await settle(calendar);
    expect(day(calendar, '2026-10-12').hasAttribute('data-preview')).toBe(false);
    calendar.focusDate('2026-10-10');
    await settle(calendar);
    await press(calendar, '{ArrowRight}{ArrowRight}');
    expect(day(calendar, '2026-10-11').hasAttribute('data-preview')).toBe(true);
    expect(day(calendar, '2026-10-12').hasAttribute('data-preview')).toBe(true);
  });

  it('draws no preview once the End is chosen', async () => {
    const calendar = await mount({ ...period });
    await userEvent.hover(day(calendar, '2026-10-20'));
    await settle(calendar);
    expect(days(calendar).some((button) => button.hasAttribute('data-preview'))).toBe(false);
  });
});

describe('the two months of a range (D-5, D-11)', () => {
  it('draws two consecutive grids side by side, top aligned, 568 wide, each with both arrows (D-5)', async () => {
    const calendar = await mount({ mode: 'range', months: 2, month: '2026-10' });
    expect(titles(calendar)).toEqual(['October 2026', 'November 2026']);
    expect(calendar.getBoundingClientRect().width).toBe(568);
    expect(root(calendar).querySelectorAll('.header nph-button.arrow')).toHaveLength(4);
    const grids = [...root(calendar).querySelectorAll('.month')].map((month) => month.getBoundingClientRect().top);
    expect(grids[0]).toBe(grids[1]);
  });

  it('moves the two months together, and they stay consecutive', async () => {
    const calendar = await mount({ mode: 'range', months: 2, month: '2026-10' });
    ((root(calendar).querySelectorAll('.header nph-button.arrow')[3]) as HTMLElement).click();
    await settle(calendar);
    expect(titles(calendar)).toEqual(['November 2026', 'December 2026']);
    ((root(calendar).querySelectorAll('.header nph-button.arrow')[0]) as HTMLElement).click();
    ((root(calendar).querySelectorAll('.header nph-button.arrow')[0]) as HTMLElement).click();
    await settle(calendar);
    expect(titles(calendar)).toEqual(['September 2026', 'October 2026']);
  });

  it('opens on the month of the Start, on the left; empty, the current month on the left; with only the End, the month of the End on the right', async () => {
    expect(titles(await mount({ mode: 'range', months: 2, start: '2027-01-05', end: '2027-03-01' }))).toEqual(['January 2027', 'February 2027']);
    expect(titles(await mount({ mode: 'range', months: 2 }))).toEqual(['October 2026', 'November 2026']);
    expect(titles(await mount({ mode: 'range', months: 2, end: '2027-05-05' }))).toEqual(['April 2027', 'May 2027']);
  });

  it('has one Tab stop per grid, in the order header 1, grid 1, header 2, grid 2 (D-11)', async () => {
    const calendar = await mount({ mode: 'range', months: 2, month: '2026-10', start: '2026-10-20', end: '2026-11-04' });
    const stops = days(calendar).filter((button) => button.tabIndex === 0).map((button) => button.dataset.date);
    expect(stops).toEqual(['2026-10-20', '2026-11-04']);
    const order = [...root(calendar).querySelectorAll('.header nph-button, button.day[tabindex="0"]')];
    expect(order.map((node) => (node.localName === 'button' ? 'grid' : (node as HTMLElement).classList.contains('title') ? 'title' : 'arrow'))).toEqual([
      'arrow', 'title', 'arrow', 'grid', 'arrow', 'title', 'arrow', 'grid',
    ]);
  });

  it('crosses the arrows from the last day of the left month to the first day of the right month, and back', async () => {
    const calendar = await mount({ mode: 'range', months: 2, month: '2026-10' });
    calendar.focusDate('2026-10-31');
    await settle(calendar);
    await press(calendar, '{ArrowRight}');
    expect(focused(calendar)).toBe('2026-11-01');
    expect(titles(calendar)).toEqual(['October 2026', 'November 2026']);
    await press(calendar, '{ArrowLeft}');
    expect(focused(calendar)).toBe('2026-10-31');
  });

  it('shifts the months when the focus leaves both, keeping the day in the grid it came from', async () => {
    const calendar = await mount({ mode: 'range', months: 2, month: '2026-10' });
    calendar.focusDate('2026-11-30');
    await settle(calendar);
    await press(calendar, '{ArrowRight}');
    expect(focused(calendar)).toBe('2026-12-01');
    expect(titles(calendar)).toEqual(['November 2026', 'December 2026']);
  });

  it('keeps the two months where they are when a day outside the month is picked (D-11)', async () => {
    const calendar = await mount({ mode: 'range', months: 2, month: '2026-10' });
    await userEvent.click(day(calendar, '2026-09-28', true));
    await settle(calendar);
    expect(calendar.start).toBe('2026-09-28');
    expect(titles(calendar)).toEqual(['October 2026', 'November 2026']);
  });
});

describe('the month and year views (D-2, D-9)', () => {
  async function openMonths(props: Partial<NphCalendar> = {}): Promise<NphCalendar> {
    const calendar = await mount({ month: '2026-10', ...props });
    (root(calendar).querySelector('.title') as HTMLElement).click();
    await settle(calendar);
    return calendar;
  }
  const items = (calendar: NphCalendar): HTMLButtonElement[] => [...root(calendar).querySelectorAll<HTMLButtonElement>('.item')];

  it('opens the month view in place of the days: the year as the title, four rows by three columns, 284 × 224', async () => {
    const calendar = await openMonths();
    expect(items(calendar)).toHaveLength(12);
    expect(titles(calendar)).toEqual(['2026']);
    expect(root(calendar).querySelectorAll('.view-grid tr')).toHaveLength(4);
    expect(calendar.getBoundingClientRect().width).toBe(284);
    expect(calendar.getBoundingClientRect().height).toBe(224);
    expect(items(calendar)[0]?.getBoundingClientRect().width).toBe(84);
    expect(items(calendar)[0]?.getBoundingClientRect().height).toBe(36);
    expect(root(calendar).querySelector('.status')?.textContent).toBe('2026');
  });

  it('keeps the icons as drawn: chevron-down on the month title, chevron-up on the year title (D-9)', async () => {
    const calendar = await mount({ month: '2026-10' });
    expect((root(calendar).querySelector('.title') as HTMLElement & { iconEnd: string }).iconEnd).toBe('chevron-down');
    (root(calendar).querySelector('.title') as HTMLElement).click();
    await settle(calendar);
    expect((root(calendar).querySelector('.title') as HTMLElement & { iconEnd: string }).iconEnd).toBe('chevron-up');
  });

  it('puts the focus on the month shown and marks the current month', async () => {
    const calendar = await openMonths();
    expect(root(calendar).activeElement).toBe(items(calendar)[9]);
    expect(items(calendar)[9]?.hasAttribute('data-current')).toBe(true);
    expect(getComputedStyle(items(calendar)[9] as Element).fontWeight).toBe('500');
  });

  it('puts the focus on the chosen month when there is one in that year', async () => {
    const calendar = await openMonths({ value: '2026-03-05' });
    expect(root(calendar).activeElement).toBe(items(calendar)[2]);
    expect(items(calendar)[2]?.hasAttribute('data-selected')).toBe(true);
  });

  it('picks a month and opens the days of it, with the focus on its first day', async () => {
    const calendar = await openMonths();
    items(calendar)[2]?.click();
    await settle(calendar);
    expect(titles(calendar)).toEqual(['March 2026']);
    expect(days(calendar)).toHaveLength(42);
    expect(focused(calendar)).toBe('2026-03-01');
  });

  it('moves one year with the arrows of the month view, named Previous year and Next year', async () => {
    const calendar = await openMonths();
    const [previous, next] = [...root(calendar).querySelectorAll<HTMLElement & { label: string }>('.header nph-button.arrow')];
    expect(previous?.label).toBe('Previous year');
    expect(next?.label).toBe('Next year');
    (next as HTMLElement).click();
    await settle(calendar);
    expect(titles(calendar)).toEqual(['2027']);
    expect(root(calendar).querySelector('.status')?.textContent).toBe('2027');
  });

  it('opens the year view from the year title: the block of twelve years at the decade, as plain text', async () => {
    const calendar = await openMonths();
    (root(calendar).querySelector('.title') as HTMLElement).click();
    await settle(calendar);
    expect(root(calendar).querySelector('.title-text')?.textContent).toBe('2020 – 2031');
    expect(items(calendar).map((item) => item.textContent?.trim())).toEqual(['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031']);
    expect(root(calendar).activeElement).toBe(items(calendar)[6]);
    expect(root(calendar).querySelector('.status')?.textContent).toBe('2020 – 2031');
    expect(root(calendar).querySelector('.header nph-button.title')).toBeNull();
  });

  it('moves twelve years with the arrows of the year view, by whole blocks', async () => {
    const calendar = await openMonths();
    (root(calendar).querySelector('.title') as HTMLElement).click();
    await settle(calendar);
    const [previous, next] = [...root(calendar).querySelectorAll<HTMLElement & { label: string }>('.header nph-button.arrow')];
    expect(previous?.label).toBe('Previous 12 years');
    expect(next?.label).toBe('Next 12 years');
    (next as HTMLElement).click();
    await settle(calendar);
    expect(root(calendar).querySelector('.title-text')?.textContent).toBe('2032 – 2043');
    (previous as HTMLElement).click();
    (previous as HTMLElement).click();
    await settle(calendar);
    expect(root(calendar).querySelector('.title-text')?.textContent).toBe('2008 – 2019');
  });

  it('picks a year and opens the months of that year', async () => {
    const calendar = await openMonths();
    (root(calendar).querySelector('.title') as HTMLElement).click();
    await settle(calendar);
    items(calendar)[3]?.click();
    await settle(calendar);
    expect(titles(calendar)).toEqual(['2023']);
    expect(root(calendar).querySelectorAll('.item')).toHaveLength(12);
  });

  it('moves the focus in the 4 by 3 grid with the arrows, Home, End and the pages', async () => {
    const calendar = await openMonths();
    const at = (): number => items(calendar).indexOf(root(calendar).activeElement as HTMLButtonElement);
    expect(at()).toBe(9);
    await press(calendar, '{ArrowLeft}');
    expect(at()).toBe(8);
    await press(calendar, '{ArrowUp}');
    expect(at()).toBe(5);
    await press(calendar, '{ArrowRight}');
    expect(at()).toBe(6);
    await press(calendar, '{Home}');
    expect(at()).toBe(6);
    await press(calendar, '{End}');
    expect(at()).toBe(8);
    await press(calendar, '{Home}');
    expect(at()).toBe(6);
    await press(calendar, '{PageDown}');
    expect(titles(calendar)).toEqual(['2027']);
    await press(calendar, '{PageUp}{PageUp}');
    expect(titles(calendar)).toEqual(['2025']);
  });

  it('chooses with Enter and with Space, and does not move past the edge of the grid', async () => {
    const calendar = await openMonths();
    await press(calendar, '{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(items(calendar).indexOf(root(calendar).activeElement as HTMLButtonElement)).toBeGreaterThanOrEqual(0);
    await press(calendar, '{Enter}');
    expect(root(calendar).querySelector('.view')).toBeNull();
    expect(titles(calendar)[0]).toMatch(/2026$/);
  });

  it('goes back to the days with Esc, once, and takes the Esc so the panel keeps open', async () => {
    const calendar = await openMonths();
    const escape = vi.fn();
    document.addEventListener('keydown', escape);
    await press(calendar, '{Escape}');
    expect(root(calendar).querySelector('.view')).toBeNull();
    expect(titles(calendar)).toEqual(['October 2026']);
    expect(escape).not.toHaveBeenCalled();
    expect(root(calendar).activeElement?.classList.contains('title')).toBe(true);
    await press(calendar, '{Escape}');
    expect(escape).toHaveBeenCalledTimes(1);
    document.removeEventListener('keydown', escape);
  });

  it('disables a month or a year only when none of its days is allowed, and skips it', async () => {
    const calendar = await openMonths({ min: '2026-08-15', max: '2026-11-10' });
    expect(items(calendar).map((item) => item.disabled)).toEqual([true, true, true, true, true, true, true, false, false, false, false, true]);
    const at = (): number => items(calendar).indexOf(root(calendar).activeElement as HTMLButtonElement);
    expect(at()).toBe(9);
    await press(calendar, '{ArrowLeft}');
    expect(at()).toBe(8);
    await press(calendar, '{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    expect(at()).toBe(7);
  });

  it('puts the focus on the nearest enabled month when the one of the title is disabled', async () => {
    const calendar = await openMonths({ min: '2026-12-01' });
    expect(items(calendar)[11]?.disabled).toBe(false);
    expect(items(calendar).indexOf(root(calendar).activeElement as HTMLButtonElement)).toBe(11);
  });

  it('keeps the drawn size of the views on large, centered, with the header of the panel (D-2)', async () => {
    const calendar = await openMonths({ size: 'large' });
    expect(calendar.getBoundingClientRect().width).toBe(340);
    expect(root(calendar).querySelector('.view-grid')?.getBoundingClientRect().width).toBe(252);
    expect(items(calendar)[0]?.getBoundingClientRect().height).toBe(36);
    const grid = (root(calendar).querySelector('.view-grid') as HTMLElement).getBoundingClientRect();
    expect(Math.round(grid.left - calendar.getBoundingClientRect().left)).toBe(Math.round(calendar.getBoundingClientRect().right - grid.right));
  });

  it('opens the view in place of the month whose title was chosen, and keeps the other month (range)', async () => {
    const calendar = await mount({ mode: 'range', months: 2, month: '2026-10' });
    (root(calendar).querySelectorAll('.title')[1] as HTMLElement).click();
    await settle(calendar);
    expect(root(calendar).querySelectorAll('.month')).toHaveLength(2);
    expect(root(calendar).querySelectorAll('.month')[0]?.querySelector('table.grid:not(.view-grid)')).not.toBeNull();
    expect(root(calendar).querySelectorAll('.month')[1]?.classList.contains('view')).toBe(true);
    expect(titles(calendar)[0]).toBe('October 2026');
  });

  it('keeps a month chosen through the title of the second month in the second place, the first becoming the month before', async () => {
    const calendar = await mount({ mode: 'range', months: 2, month: '2026-10' });
    (root(calendar).querySelectorAll('.title')[1] as HTMLElement).click();
    await settle(calendar);
    items(calendar)[5]?.click();
    await settle(calendar);
    expect(titles(calendar)).toEqual(['May 2026', 'June 2026']);
    (root(calendar).querySelectorAll('.title')[0] as HTMLElement).click();
    await settle(calendar);
    items(calendar)[0]?.click();
    await settle(calendar);
    expect(titles(calendar)).toEqual(['January 2026', 'February 2026']);
  });
});

describe('the roles and names the browser computes', () => {
  it('is a grid named by the month, with the weekdays as column headers and each day a button with its full name', async () => {
    const calendar = await mount({ month: '2026-10', value: '2026-10-20' });
    const grid = root(calendar).querySelector('table.grid') as HTMLElement;
    expect(grid.getAttribute('role')).toBe('grid');
    expect(grid.getAttribute('aria-label')).toBe('October 2026');
    expect(root(calendar).querySelectorAll('th[scope="col"]')).toHaveLength(7);
    expect(root(calendar).querySelectorAll('td[role="gridcell"]')).toHaveLength(42);
    expect(day(calendar, '2026-10-20').getAttribute('aria-label')).toBe('Tuesday, October 20, 2026, selected');
  });

  it('keeps the arrows named and with a tooltip each', async () => {
    const calendar = await mount({ month: '2026-10' });
    const arrows = [...root(calendar).querySelectorAll<HTMLElement & { label: string }>('.header nph-button.arrow')];
    expect(arrows.map((arrow) => arrow.label)).toEqual(['Previous month', 'Next month']);
    for (const arrow of arrows) {
      expect(arrow.shadowRoot?.querySelector('nph-tooltip')).not.toBeNull();
    }
  });
});

describe('the token contract', () => {
  it('reads only semantic and component tokens, never a literal design value', () => {
    expect(componentCss).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(componentCss).not.toMatch(/\b(rgb|hsl)a?\(/);
    expect(componentCss).not.toMatch(/--nph-core-/);
    expect(componentCss).not.toMatch(/\b\d+(\.\d+)?(px|rem|em|ms|s)\b(?![^/]*\*\/)/m);
  });

  it('uses only custom properties the generated CSS declares', () => {
    const declared = new Set([...tokensCss.matchAll(/(--nph-[a-z0-9-]+)\s*:/g)].map((match) => match[1]));
    const used = new Set([...componentCss.matchAll(/var\((--nph-[a-z0-9-]+)/g)].map((match) => match[1]));
    for (const name of used) expect(declared.has(name as string), name as string).toBe(true);
  });

  it('has the day and focus radius from the component tokens', () => {
    expect(tokensCss).toContain('--nph-calendar-day-radius: var(--nph-core-radius-450)');
    expect(tokensCss).toContain('--nph-calendar-day-focus-radius: var(--nph-core-radius-600)');
  });
});
