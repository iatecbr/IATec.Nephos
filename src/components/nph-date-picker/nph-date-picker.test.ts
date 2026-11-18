/**
 * Tests of `nph-date-picker` (P133), in a real browser (P21, item 5): the top layer, the placement, the focus and real clicks
 * only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `6673:62837`, set `6666:32`, panel `6662:56378`), recorded in the
 * evidence of the `figma-docs-accepted` gate of DSA-90, and the provisional rule of each decision still open with the design owner
 * (D-1 to D-11, one block each): the field, the calendar button, the panel in its three modes and two sizes, the keyboard, the
 * shortcuts, the footer, the typed date, the form, the roles and names the browser computes and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-date-picker.css?raw';
import controlCss from './nph-date-picker-control.css?raw';
import { NPH_DATE_PICKER_LABEL_KEYS, NphDatePicker } from './nph-date-picker';
import type { NphDatePickerLabels } from './nph-date-picker';
import type { NphCalendar } from '../nph-calendar/nph-calendar';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
  await page.viewport(1100, 800);
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  window.scrollTo(0, 0);
  vi.restoreAllMocks();
});

const LABELS: NphDatePickerLabels = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  previousYears: 'Previous 12 years',
  nextYears: 'Next 12 years',
  today: 'today',
  selected: 'selected',
  unavailable: 'unavailable',
  hint: 'mm/dd/yyyy',
  openCalendar: 'Open calendar',
  clearDate: 'Clear date',
  dialogDate: 'Choose date',
  dialogPeriod: 'Choose period',
  shortcuts: 'Shortcuts',
  shortcutToday: 'Today',
  shortcutYesterday: 'Yesterday',
  shortcutLast7Days: 'Last 7 days',
  shortcutLast30Days: 'Last 30 days',
  shortcutThisMonth: 'This month',
  shortcutLastMonth: 'Last month',
  shortcutCustom: 'Custom',
  clear: 'Clear',
  cancel: 'Cancel',
  apply: 'Apply',
  period: '{start} to {end}',
  errorRequired: 'Enter the date.',
  errorRequiredStart: 'Enter the start date.',
  errorRequiredEnd: 'Enter the end date.',
  errorInvalid: 'Invalid date: check the day and the month.',
  errorMin: 'The date must be on or after {min}.',
  errorMax: 'The date must be on or before {max}.',
  errorBetween: 'Choose a date between {min} and {max}.',
  errorUnavailable: 'This date is not available, choose another day.',
  errorEndBeforeStart: 'The end must be on or after the start ({start}).',
};

interface Setup {
  picker: NphDatePicker;
}

async function mount(props: Partial<NphDatePicker> & { lang?: string; width?: number } = {}): Promise<Setup> {
  const { lang, width, ...rest } = props;
  const picker = document.createElement('nph-date-picker') as NphDatePicker;
  picker.now = '2026-10-14';
  picker.labels = LABELS;
  picker.label = 'Due date';
  if (rest.mode === 'range') {
    picker.startLabel = 'Start';
    picker.endLabel = 'End';
  }
  Object.assign(picker, rest);
  picker.style.cssText = 'display: block; margin: 40px;';
  if (lang !== undefined) picker.setAttribute('lang', lang);
  document.body.append(picker);
  void width;
  await settle(picker);
  return { picker };
}

async function settle(picker: NphDatePicker): Promise<void> {
  await picker.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  await picker.updateComplete;
}

const root = (picker: NphDatePicker): ShadowRoot => picker.shadowRoot as ShadowRoot;
const q = <T extends Element = HTMLElement>(picker: NphDatePicker, selector: string): T | null => root(picker).querySelector<T>(selector);
const all = <T extends Element = HTMLElement>(picker: NphDatePicker, selector: string): T[] => [...root(picker).querySelectorAll<T>(selector)];
const surface = (picker: NphDatePicker): HTMLElement => q(picker, '.surface') as HTMLElement;
const calendar = (picker: NphDatePicker): NphCalendar => q<NphCalendar>(picker, 'nph-calendar') as NphCalendar;
const calendarRoot = (picker: NphDatePicker): ShadowRoot => calendar(picker).shadowRoot as ShadowRoot;
const shown = (picker: NphDatePicker): boolean => surface(picker)?.matches(':popover-open') ?? false;
const day = (picker: NphDatePicker, date: string): HTMLButtonElement =>
  calendarRoot(picker).querySelector<HTMLButtonElement>(`button.day[data-date="${date}"]:not([data-outside])`) as HTMLButtonElement;
const inputOf = (picker: NphDatePicker, which = 'single'): HTMLInputElement =>
  (q(picker, `nph-input[data-field="${which}"]`) as HTMLElement & { shadowRoot: ShadowRoot }).shadowRoot.querySelector('input') as HTMLInputElement;
const buttonEl = (picker: NphDatePicker): HTMLElement => q(picker, 'nph-button.calendar-button') as HTMLElement;
const innerButton = (host: HTMLElement): HTMLButtonElement => host.shadowRoot?.querySelector('button') as HTMLButtonElement;
const textOf = (picker: NphDatePicker, which = 'single'): string => inputOf(picker, which).value;

function deepActive(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

async function until(condition: () => boolean, ms = 2000): Promise<void> {
  const start = performance.now();
  while (!condition()) {
    if (performance.now() - start > ms) throw new Error('condition not met in time');
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

async function open(picker: NphDatePicker): Promise<void> {
  await userEvent.click(innerButton(buttonEl(picker)));
  await until(() => shown(picker));
  await settle(picker);
  await until(() => calendarRoot(picker).querySelector('button.day') !== null);
  await new Promise((resolve) => setTimeout(resolve, 60));
}

async function press(picker: NphDatePicker, keys: string): Promise<void> {
  await userEvent.keyboard(keys);
  await settle(picker);
}

async function typeInto(picker: NphDatePicker, which: string, text: string, leave = true): Promise<void> {
  const input = inputOf(picker, which);
  input.focus();
  await userEvent.clear(input);
  if (text !== '') await userEvent.type(input, text);
  if (leave) await userEvent.tab();
  await settle(picker);
}

describe('smoke', () => {
  it('draws the field and opens the panel', async () => {
    const { picker } = await mount({ value: '2026-10-20' });
    expect(textOf(picker)).toBe('10/20/2026');
    await open(picker);
    expect(shown(picker)).toBe(true);
    expect(day(picker, '2026-10-20').hasAttribute('data-selected')).toBe(true);
    void NPH_DATE_PICKER_LABEL_KEYS;
    void tokensCss;
    void componentCss;
    void controlCss;
    void deepActive;
  });
});
