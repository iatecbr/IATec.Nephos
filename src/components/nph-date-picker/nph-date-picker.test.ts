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

describe('the API and the invalid input', () => {
  it('has exactly the declared reactive properties', () => {
    expect([...NphDatePicker.elementProperties.keys()].sort()).toEqual(
      [
        'disabled', 'end', 'endError', 'endLabel', 'endName', 'error', 'label', 'labels', 'max', 'min', 'mode', 'name', 'now', 'open',
        'required', 'size', 'start', 'startError', 'startLabel', 'startName', 'unavailable', 'value', 'weekStart',
      ].sort(),
    );
  });

  it('has the documented defaults, and is form-associated', () => {
    const picker = document.createElement('nph-date-picker') as NphDatePicker;
    expect(picker.mode).toBe('single');
    expect(picker.size).toBe('default');
    expect(picker.open).toBe(false);
    expect(picker.disabled).toBe(false);
    expect(picker.weekStart).toBe('sunday');
    expect((NphDatePicker as unknown as { formAssociated: boolean }).formAssociated).toBe(true);
  });

  it('reflects mode, size, name, required, disabled and open', async () => {
    const { picker } = await mount({ mode: 'range', size: 'large', name: 'period', required: true, disabled: true });
    for (const name of ['mode', 'size', 'name', 'required', 'disabled']) expect(picker.hasAttribute(name), name).toBe(true);
    expect(picker.getAttribute('mode')).toBe('range');
    expect(picker.getAttribute('size')).toBe('large');
  });

  it('draws nothing and says why, once per cause, for input that does not exist', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { picker } = await mount({ mode: 'weekly', size: 'huge', weekStart: 'friday', value: '2026-02-30', min: 'soon' });
    expect(q(picker, '.trigger')).toBeNull();
    expect(picker.hasAttribute('data-nph-rendered')).toBe(false);
    const messages = error.mock.calls.map((call) => String(call[0])).filter((message) => message.includes('[nph-date-picker]'));
    for (const word of ['mode "weekly"', 'size "huge"', 'week-start "friday"', 'value "2026-02-30"', 'min "soon"']) {
      expect(messages.filter((message) => message.includes(word)), word).toHaveLength(1);
    }
    picker.requestUpdate();
    await picker.updateComplete;
    expect(error.mock.calls.filter((call) => String(call[0]).includes('[nph-date-picker]'))).toHaveLength(messages.length);
  });

  it('renders anyway when a label is missing, and says which keys, once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { picker } = await mount({ labels: { hint: 'mm/dd/yyyy' } });
    expect(q(picker, '.trigger')).not.toBeNull();
    const missing = error.mock.calls.map((call) => String(call[0])).filter((message) => message.includes('labels is missing'));
    expect(missing).toHaveLength(1);
    for (const key of NPH_DATE_PICKER_LABEL_KEYS.filter((name) => name !== 'hint')) expect(missing[0]).toContain(key);
  });

  it('is one of the elements the manifest drops: the control row is internal, with no folder of its own', async () => {
    const { picker } = await mount();
    expect(customElements.get('nph-date-picker-control')).toBeDefined();
    expect(q(picker, 'nph-date-picker-control')).not.toBeNull();
  });
});

describe('the field', () => {
  it('has one nph-field with the label, the hint as help and the control row: the text and the calendar button', async () => {
    const { picker } = await mount({ value: '2026-10-20' });
    const field = q(picker, 'nph-field') as HTMLElement & { label: string; help: string };
    expect(field.label).toBe('Due date');
    expect(field.help).toBe('mm/dd/yyyy');
    expect(field.querySelector('nph-date-picker-control nph-input')).not.toBeNull();
    expect(field.querySelector('nph-date-picker-control nph-button.calendar-button')).not.toBeNull();
    expect(field.getBoundingClientRect().width).toBe(320);
  });

  it('puts the text and the calendar button on one row, 8 px apart, centered vertically, the text stretching', async () => {
    const { picker } = await mount();
    const text = (q(picker, 'nph-input') as HTMLElement).getBoundingClientRect();
    const button = buttonEl(picker).getBoundingClientRect();
    const row = (q(picker, 'nph-date-picker-control') as HTMLElement).getBoundingClientRect();
    expect(button.left - text.right).toBe(8);
    expect(row.width).toBe(320);
    expect(Math.round(button.right)).toBe(Math.round(row.right));
    expect(text.top + text.height / 2).toBeCloseTo(button.top + button.height / 2, 0);
    expect(button.height).toBe(36);
    expect(button.width).toBe(36);
    expect(text.height).toBe(36);
  });

  it('takes the three sizes: 28, 36 and 44, in the text and in the calendar button', async () => {
    for (const [size, height] of [['compact', 28], ['default', 36], ['large', 44]] as const) {
      const { picker } = await mount({ size });
      expect((q(picker, 'nph-input') as HTMLElement).getBoundingClientRect().height, size).toBe(height);
      expect(buttonEl(picker).getBoundingClientRect().height, size).toBe(height);
      picker.remove();
    }
  });

  it('writes the name and the description on the text, and the label as its accessible name, through the control row', async () => {
    const { picker } = await mount({ required: true });
    const input = q(picker, 'nph-input') as HTMLElement & { label: string; description: string; required: boolean };
    expect(input.label).toBe('Due date');
    expect(input.description).toBe('mm/dd/yyyy');
    expect(input.required).toBe(true);
    const native = inputOf(picker);
    expect(native.getAttribute('aria-label') ?? native.labels?.[0]?.textContent ?? '').toContain('Due date');
  });

  it('shows the hint as the placeholder of an empty field, and the clear button only with a value', async () => {
    const { picker } = await mount();
    expect(inputOf(picker).placeholder).toBe('mm/dd/yyyy');
    const clear = (): Element | null => (q(picker, 'nph-input') as HTMLElement).shadowRoot?.querySelector('.clear') ?? null;
    expect(clear()).toBeNull();
    picker.value = '2026-10-20';
    await settle(picker);
    await (q(picker, 'nph-input') as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    expect(clear()).not.toBeNull();
  });

  it('writes the date as the language does: month first in en, day first in pt-BR and es', async () => {
    expect(textOf((await mount({ value: '2026-03-05', lang: 'en-US' })).picker)).toBe('03/05/2026');
    document.body.replaceChildren();
    expect(textOf((await mount({ value: '2026-03-05', lang: 'pt-BR' })).picker)).toBe('05/03/2026');
    document.body.replaceChildren();
    expect(textOf((await mount({ value: '2026-03-05', lang: 'es' })).picker)).toBe('05/03/2026');
  });

  it('puts the error on the field that has the problem, with the message, and disabled wins over it', async () => {
    const { picker } = await mount({ error: 'Pick a business day.' });
    const field = q(picker, 'nph-field') as HTMLElement & { error: string };
    expect(field.error).toBe('Pick a business day.');
    picker.disabled = true;
    await settle(picker);
    expect(getComputedStyle(buttonEl(picker)).opacity).toBe('0.5');
  });
});

describe('the calendar button', () => {
  it('is an icon-only ghost nph-button named Open calendar, with its tooltip', async () => {
    const { picker } = await mount();
    const button = buttonEl(picker) as HTMLElement & { label: string; severity: string; emphasis: string; iconStart: string };
    expect(button.label).toBe('Open calendar');
    expect(button.severity).toBe('secondary');
    expect(button.emphasis).toBe('ghost');
    expect(button.iconStart).toBe('calendar');
    expect(button.shadowRoot?.querySelector('nph-tooltip')).not.toBeNull();
  });

  it('carries aria-haspopup dialog, and aria-expanded true while the panel is open', async () => {
    const { picker } = await mount();
    expect(buttonEl(picker).getAttribute('aria-haspopup')).toBe('dialog');
    expect(buttonEl(picker).getAttribute('aria-expanded')).toBe('false');
    await open(picker);
    expect(buttonEl(picker).getAttribute('aria-expanded')).toBe('true');
    expect(innerButton(buttonEl(picker)).getAttribute('aria-expanded')).toBe('true');
  });

  it('draws the calendar icon in color/muted-foreground', async () => {
    const { picker } = await mount();
    const icon = innerButton(buttonEl(picker)).querySelector('nph-icon') as HTMLElement;
    const probe = document.createElement('span');
    probe.style.color = 'var(--nph-color-muted-foreground)';
    document.body.append(probe);
    expect(getComputedStyle(icon).color).toBe(getComputedStyle(probe).color);
    probe.remove();
  });

  it('keeps the button without background on field hover: only the field border changes', async () => {
    const { picker } = await mount();
    await userEvent.hover(q(picker, 'nph-input') as HTMLElement);
    expect(getComputedStyle(innerButton(buttonEl(picker))).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('does not open when disabled', async () => {
    const { picker } = await mount({ disabled: true });
    innerButton(buttonEl(picker)).click();
    await settle(picker);
    expect(picker.open).toBe(false);
    expect(shown(picker)).toBe(false);
  });
});

describe('the panel of a single date', () => {
  it('opens in the top layer, 4 px below the field and aligned to its start, 286 × 334 with six rows', async () => {
    const { picker } = await mount({ value: '2026-10-20' });
    await open(picker);
    const box = surface(picker).getBoundingClientRect();
    const row = (q(picker, 'nph-date-picker-control') as HTMLElement).getBoundingClientRect();
    expect(shown(picker)).toBe(true);
    expect(surface(picker).getAttribute('role')).toBe('dialog');
    expect(Math.round(box.top - row.bottom)).toBe(4);
    expect(Math.round(box.left)).toBe(Math.round(row.left));
    expect(box.width).toBe(286);
    expect(box.height).toBe(334);
    expect(surface(picker).getAttribute('data-mode')).toBe('single');
  });

  it('draws the surface: color/popover, a 1 px outline in date-picker/panel-border, 14 px corners, no padding', async () => {
    const { picker } = await mount();
    await open(picker);
    const style = getComputedStyle(surface(picker));
    expect(style.borderTopWidth).toBe('1px');
    expect(style.borderTopLeftRadius).toBe('14px');
    expect(style.paddingTop).toBe('0px');
    const probe = document.createElement('span');
    probe.style.color = 'var(--nph-color-popover)';
    probe.style.borderColor = 'var(--nph-date-picker-panel-border)';
    document.body.append(probe);
    expect(style.backgroundColor).toBe(getComputedStyle(probe).color);
    expect(style.borderTopColor).toBe(getComputedStyle(probe).borderTopColor);
    probe.remove();
    expect(style.boxShadow).not.toBe('none');
  });

  it('has no shadow in dark mode: the elevation comes from the surface', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    const { picker } = await mount();
    await open(picker);
    expect(getComputedStyle(surface(picker)).boxShadow.replace(/rgba?\(0, 0, 0, 0\)[^,]*(,|$)/g, '').trim()).toMatch(/^(none)?$/);
  });

  it('puts the focus on the date of the field, or on today when it is empty', async () => {
    const { picker } = await mount({ value: '2026-10-20' });
    await open(picker);
    expect(calendarRoot(picker).activeElement).toBe(day(picker, '2026-10-20'));
    picker.remove();
    const empty = (await mount()).picker;
    await open(empty);
    expect(calendarRoot(empty).activeElement).toBe(day(empty, '2026-10-14'));
  });

  it('puts the focus on the nearest allowed day when today is outside the limit', async () => {
    const { picker } = await mount({ min: '2026-10-20', max: '2026-10-25' });
    await open(picker);
    expect(calendarRoot(picker).activeElement).toBe(day(picker, '2026-10-20'));
  });

  it('applies on picking a day: writes the date in the field, fires change once, closes and gives the focus back to the button', async () => {
    const { picker } = await mount();
    const changed = vi.fn();
    picker.addEventListener('change', changed);
    await open(picker);
    await userEvent.click(day(picker, '2026-10-22'));
    await settle(picker);
    expect(picker.value).toBe('2026-10-22');
    expect(textOf(picker)).toBe('10/22/2026');
    expect(changed).toHaveBeenCalledTimes(1);
    expect(picker.open).toBe(false);
    await until(() => !shown(picker));
    expect(deepActive()).toBe(innerButton(buttonEl(picker)));
  });

  it('fires change by Enter on a day, too, and nothing when the date is the same', async () => {
    const { picker } = await mount({ value: '2026-10-14' });
    const changed = vi.fn();
    picker.addEventListener('change', changed);
    await open(picker);
    await press(picker, '{Enter}');
    expect(changed).not.toHaveBeenCalled();
    expect(picker.open).toBe(false);
  });

  it('closes with Esc, changes nothing, and gives the focus back to the button', async () => {
    const { picker } = await mount({ value: '2026-10-14' });
    const changed = vi.fn();
    picker.addEventListener('change', changed);
    await open(picker);
    await press(picker, '{ArrowRight}{Escape}');
    expect(picker.open).toBe(false);
    expect(picker.value).toBe('2026-10-14');
    expect(changed).not.toHaveBeenCalled();
    await until(() => !shown(picker));
    expect(deepActive()).toBe(innerButton(buttonEl(picker)));
  });

  it('closes on a press outside, without moving the focus', async () => {
    const { picker } = await mount();
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    outside.style.cssText = 'position: fixed; right: 10px; bottom: 10px;';
    document.body.append(outside);
    await open(picker);
    await userEvent.click(outside);
    await until(() => !shown(picker));
    expect(picker.open).toBe(false);
    expect(document.activeElement).toBe(outside);
  });

  it('does not count a click in the field as a click outside (D-4)', async () => {
    const { picker } = await mount();
    await open(picker);
    await userEvent.click(inputOf(picker));
    await settle(picker);
    expect(picker.open).toBe(true);
  });

  it('closes on the button again, as a toggle', async () => {
    const { picker } = await mount();
    await open(picker);
    await userEvent.click(innerButton(buttonEl(picker)));
    await until(() => !shown(picker));
    expect(picker.open).toBe(false);
  });

  it('closes on Tab after the last item and gives the focus back to the button; the panel is not a trap', async () => {
    const { picker } = await mount({ value: '2026-10-14' });
    await open(picker);
    await press(picker, '{Tab}');
    await until(() => !picker.open);
    await until(() => !shown(picker));
    expect(deepActive()).toBe(innerButton(buttonEl(picker)));
  });

  it('keeps the field value when the panel is open and the person picks the same day again', async () => {
    const { picker } = await mount({ value: '2026-10-14' });
    await open(picker);
    await userEvent.click(day(picker, '2026-10-14'));
    await settle(picker);
    expect(picker.value).toBe('2026-10-14');
  });

  it('opens when open is set from code, fires no event, and closes the same way', async () => {
    const { picker } = await mount();
    const changed = vi.fn();
    picker.addEventListener('change', changed);
    picker.open = true;
    await settle(picker);
    await until(() => shown(picker));
    picker.open = false;
    await settle(picker);
    await until(() => !shown(picker));
    expect(changed).not.toHaveBeenCalled();
  });

  it('flips above, with the same 4 px, when there is no room below', async () => {
    const { picker } = await mount();
    picker.style.cssText = 'display: block; position: fixed; left: 40px; top: 640px;';
    await settle(picker);
    await open(picker);
    const box = surface(picker).getBoundingClientRect();
    const row = (q(picker, 'nph-date-picker-control') as HTMLElement).getBoundingClientRect();
    expect(surface(picker).getAttribute('data-side')).toBe('top');
    expect(Math.round(row.top - box.bottom)).toBe(4);
  });

  it('shrinks with an inner scroll when neither side fits', async () => {
    await page.viewport(1100, 300);
    const { picker } = await mount();
    picker.style.cssText = 'display: block; position: fixed; left: 40px; top: 120px;';
    await settle(picker);
    await open(picker);
    const box = surface(picker).getBoundingClientRect();
    expect(surface(picker).hasAttribute('data-scroll')).toBe(true);
    expect(box.top).toBeGreaterThanOrEqual(0);
    expect(box.bottom).toBeLessThanOrEqual(300);
    expect(getComputedStyle(surface(picker)).overflowY).toBe('auto');
    await page.viewport(1100, 800);
  });

  it('opens the default panel from a compact field, and the large one from a large field', async () => {
    const compact = (await mount({ size: 'compact' })).picker;
    await open(compact);
    expect(surface(compact).getBoundingClientRect().width).toBe(286);
    compact.remove();
    const large = (await mount({ size: 'large' })).picker;
    await open(large);
    expect(surface(large).getBoundingClientRect().width).toBe(342);
    expect(surface(large).getBoundingClientRect().height).toBe(390);
  });

  it('enters with opacity and a short slide, and leaves with the exit role', async () => {
    const { picker } = await mount();
    await open(picker);
    await until(() => getComputedStyle(surface(picker)).opacity === '1');
    const style = getComputedStyle(surface(picker));
    expect(style.transitionProperty).toContain('opacity');
    expect(style.transitionProperty).toContain('translate');
  });
});
