/**
 * Tests of `nph-date-picker` (P133), in a real browser (P21, item 5): the top layer, the placement, the focus and real clicks
 * only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `6673:62837`, set `6666:32`, panel `6662:56378`), recorded in the
 * evidence of the `figma-docs-accepted` gate of DSA-90, and the answers of the design owner of 2026-11-18 (DSA-96: D-2, D-5, D-6, D-9,
 * D-10 and the header of the large grid): the field, the calendar button, the panel in its three modes and two sizes, the views at the
 * height of the day view, the keyboard, the shortcuts, a period that does not cross an unavailable day, the footer, the typed date,
 * the form, the roles and names the browser computes and the token contract. The rules still open (D-12 to D-18) follow the task.
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

/** A harmless element far from the picker and from its panel, to click on "outside". */
function away(): HTMLElement {
  let element = document.querySelector<HTMLElement>('#away');
  if (element === null) {
    element = document.createElement('button');
    element.id = 'away';
    element.textContent = 'outside';
    element.style.cssText = 'position: fixed; right: 4px; bottom: 4px;';
    document.body.append(element);
  }
  return element;
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
        'required', 'size', 'start', 'startError', 'startLabel', 'startName', 'unavailable', 'value', 'weekStart', 'allowsNonContiguousRanges',
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

  it('draws nothing and says so when labels has no key at all: the data comes by the property', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const picker = document.createElement('nph-date-picker') as NphDatePicker;
    picker.label = 'Due date';
    document.body.append(picker);
    await picker.updateComplete;
    expect(q(picker, '.trigger')).toBeNull();
    expect(error.mock.calls.map((call) => String(call[0])).filter((message) => message.includes('[nph-date-picker] labels is required'))).toHaveLength(1);
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

  it('follows the field when the layout above it moves with no event: the panel stays 4 px below', async () => {
    const { picker } = await mount();
    await open(picker);
    const spacer = document.createElement('div');
    spacer.style.cssText = 'block-size: 60px;';
    document.body.prepend(spacer);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))));
    await new Promise((resolve) => setTimeout(resolve, 100));
    const box = surface(picker).getBoundingClientRect();
    const row = (q(picker, 'nph-date-picker-control') as HTMLElement).getBoundingClientRect();
    expect(Math.round(box.top - row.bottom)).toBe(4);
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
    expect(surface(large).getBoundingClientRect().height).toBe(394);
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

describe('D-2: the views inside the panel', () => {
  it('keeps the height and the width of the panel when the month and the year view open, on both sizes', async () => {
    for (const [size, width, height] of [['default', 286, 334], ['large', 342, 394]] as const) {
      const { picker } = await mount({ size, value: '2026-10-20' });
      await open(picker);
      const before = surface(picker).getBoundingClientRect();
      expect([before.width, before.height], size).toEqual([width, height]);
      ((calendarRoot(picker).querySelector('.title')) as HTMLElement).click();
      await settle(picker);
      const months = surface(picker).getBoundingClientRect();
      expect([months.width, months.height], `${size} months`).toEqual([width, height]);
      ((calendarRoot(picker).querySelector('.title')) as HTMLElement).click();
      await settle(picker);
      const years = surface(picker).getBoundingClientRect();
      expect([years.width, years.height], `${size} years`).toEqual([width, height]);
      picker.remove();
    }
  });

  it('keeps the range panel of the size when both columns switch to the views', async () => {
    for (const [size, width, height] of [['default', 762, 395], ['large', 874, 463]] as const) {
      const { picker } = await mount({ mode: 'range', size, start: '2026-10-10', end: '2026-10-14' });
      await open(picker);
      ((calendarRoot(picker).querySelectorAll('.title')[1]) as HTMLElement).click();
      await settle(picker);
      expect(calendarRoot(picker).querySelectorAll('.month.view')).toHaveLength(2);
      const box = surface(picker).getBoundingClientRect();
      expect([box.width, box.height], size).toEqual([width, height]);
      await press(picker, '{Escape}');
      expect(calendarRoot(picker).querySelector('.view')).toBeNull();
      picker.remove();
    }
  });

  it('goes back to the days with the first Esc and closes the panel with the second (D-9)', async () => {
    const { picker } = await mount({ value: '2026-10-20' });
    await open(picker);
    ((calendarRoot(picker).querySelector('.title')) as HTMLElement).click();
    await settle(picker);
    await press(picker, '{Escape}');
    expect(picker.open).toBe(true);
    expect(calendarRoot(picker).querySelector('.view')).toBeNull();
    await press(picker, '{Escape}');
    expect(picker.open).toBe(false);
  });
});

describe('the range: the fields', () => {
  it('puts Start and End side by side, 8 px apart, aligned at the top, each in its own field, with one calendar button, in End', async () => {
    const { picker } = await mount({ mode: 'range', start: '2026-10-10', end: '2026-10-14' });
    const fields = all<HTMLElement & { label: string }>(picker, 'nph-field');
    expect(fields.map((field) => field.label)).toEqual(['Start', 'End']);
    const [start, end] = fields.map((field) => field.getBoundingClientRect());
    expect(Math.round((end as DOMRect).left - (start as DOMRect).right)).toBe(8);
    expect((start as DOMRect).top).toBe((end as DOMRect).top);
    expect(all(picker, 'nph-button.calendar-button')).toHaveLength(1);
    expect(fields[1]?.querySelector('nph-button.calendar-button')).not.toBeNull();
    expect(fields[0]?.querySelector('nph-button.calendar-button')).toBeNull();
    expect(textOf(picker, 'start')).toBe('10/10/2026');
    expect(textOf(picker, 'end')).toBe('10/14/2026');
  });

  it('keeps the error only on the field with the problem', async () => {
    const { picker } = await mount({ mode: 'range', startError: 'Enter the start date.' });
    const [start, end] = all<HTMLElement & { error: string }>(picker, 'nph-field');
    expect(start?.error).toBe('Enter the start date.');
    expect(end?.error).toBe('');
  });
});

describe('the panel of a range', () => {
  const period = { mode: 'range', start: '2026-10-10', end: '2026-10-14' } as const;

  it('opens 762 × 395: the shortcuts, two months, a divider and the footer', async () => {
    const { picker } = await mount({ ...period });
    await open(picker);
    const box = surface(picker).getBoundingClientRect();
    expect(surface(picker).getAttribute('data-mode')).toBe('range');
    expect(box.width).toBe(762);
    expect(box.height).toBe(395);
    expect(calendar(picker).months).toBe(2);
    expect(calendar(picker).mode).toBe('range');
  });

  it('opens 874 × 459 on large, with the footer buttons in the default size', async () => {
    const { picker } = await mount({ ...period, size: 'large' });
    await open(picker);
    const box = surface(picker).getBoundingClientRect();
    expect(box.width).toBe(874);
    expect(box.height).toBe(463);
    expect((q(picker, '.apply') as HTMLElement).getBoundingClientRect().height).toBe(36);
  });

  it('has the footer buttons compact in the default panel: Clear at the start, Cancel and Apply at the end, 12 px apart, padding 16', async () => {
    const { picker } = await mount({ ...period });
    await open(picker);
    const clear = (q(picker, '.clear') as HTMLElement).getBoundingClientRect();
    const cancel = (q(picker, '.cancel') as HTMLElement).getBoundingClientRect();
    const apply = (q(picker, '.apply') as HTMLElement).getBoundingClientRect();
    const box = surface(picker).getBoundingClientRect();
    expect(clear.height).toBe(28);
    expect(Math.round(apply.left - cancel.right)).toBe(12);
    expect(Math.round(clear.left - box.left)).toBe(17);
    expect(Math.round(box.right - apply.right)).toBe(17);
    const footer = (q(picker, '.footer') as HTMLElement).getBoundingClientRect();
    expect(footer.height).toBe(60);
  });

  it('draws the footer divider edge to edge in date-picker/divider', async () => {
    const { picker } = await mount({ ...period });
    await open(picker);
    const divider = q(picker, '.divider') as HTMLElement;
    const box = surface(picker).getBoundingClientRect();
    expect(Math.round(divider.getBoundingClientRect().width)).toBe(box.width - 2);
    const probe = document.createElement('span');
    probe.style.borderColor = 'var(--nph-date-picker-divider)';
    probe.style.borderStyle = 'solid';
    document.body.append(probe);
    const line = (divider.shadowRoot?.querySelector('.line, div, hr') ?? divider) as HTMLElement;
    const inside = getComputedStyle(line);
    expect([inside.backgroundColor, inside.borderTopColor, inside.borderBottomColor]).toContain(getComputedStyle(probe).borderTopColor);
    probe.remove();
  });

  it('has seven shortcuts of 36, no space between them, in a column 192 wide with padding 16, top aligned', async () => {
    const { picker } = await mount({ ...period });
    await open(picker);
    const list = q(picker, '.shortcuts') as HTMLElement;
    const options = all<HTMLElement>(picker, 'nph-option');
    expect(options.map((option) => option.textContent?.trim())).toEqual([
      'Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'This month', 'Last month', 'Custom',
    ]);
    expect(options.every((option) => option.getBoundingClientRect().height === 36)).toBe(true);
    expect(list.getBoundingClientRect().width).toBe(192);
    expect(Math.round((options[0] as HTMLElement).getBoundingClientRect().left - list.getBoundingClientRect().left)).toBe(16);
    for (let index = 1; index < options.length; index += 1) {
      expect(Math.round((options[index] as HTMLElement).getBoundingClientRect().top)).toBe(
        Math.round((options[index - 1] as HTMLElement).getBoundingClientRect().bottom),
      );
    }
    expect(Math.round(list.getBoundingClientRect().top - surface(picker).getBoundingClientRect().top)).toBe(1);
  });

  it('opens on the month of the Start, on the left, with the focus on the Start day (D-5)', async () => {
    const { picker } = await mount({ mode: 'range', start: '2027-01-05', end: '2027-03-09' });
    await open(picker);
    const titles = [...calendarRoot(picker).querySelectorAll('.title')].map((title) => (title as HTMLElement & { text: string }).text);
    expect(titles).toEqual(['January 2027', 'February 2027']);
    expect(calendarRoot(picker).activeElement).toBe(day(picker, '2027-01-05'));
  });

  it('opens an empty range on the current month, on the left, with the focus on today (D-5)', async () => {
    const { picker } = await mount({ mode: 'range' });
    await open(picker);
    const titles = [...calendarRoot(picker).querySelectorAll('.title')].map((title) => (title as HTMLElement & { text: string }).text);
    expect(titles).toEqual(['October 2026', 'November 2026']);
    expect(calendarRoot(picker).activeElement).toBe(day(picker, '2026-10-14'));
  });

  it('opens with only the End filled on the month of the End, on the right, with the focus on the End day (D-11)', async () => {
    const { picker } = await mount({ mode: 'range', end: '2027-05-05' });
    await open(picker);
    const titles = [...calendarRoot(picker).querySelectorAll('.title')].map((title) => (title as HTMLElement & { text: string }).text);
    expect(titles).toEqual(['April 2027', 'May 2027']);
    expect(calendarRoot(picker).activeElement).toBe(day(picker, '2027-05-05'));
  });

  it('draws one arrow on each outer edge and moves the two months together, one month per click (D-5)', async () => {
    const { picker } = await mount({ ...period });
    await open(picker);
    const arrows = [...calendarRoot(picker).querySelectorAll<HTMLElement & { label: string }>('nph-button.arrow')];
    expect(arrows.map((arrow) => [arrow.label, arrow.hasAttribute('data-hidden')])).toEqual([
      ['Previous month', false],
      ['Next month', true],
      ['Previous month', true],
      ['Next month', false],
    ]);
    arrows[3]?.click();
    await settle(picker);
    const titles = [...calendarRoot(picker).querySelectorAll('.title')].map((title) => (title as HTMLElement & { text: string }).text);
    expect(titles).toEqual(['November 2026', 'December 2026']);
  });

  it('switches to one month with the shortcuts on top, 286 wide, when the width does not fit the panel plus the margin (D-7)', async () => {
    await page.viewport(700, 1000);
    const { picker } = await mount({ ...period });
    await open(picker);
    expect(surface(picker).getAttribute('data-mode')).toBe('narrow');
    expect(calendar(picker).months).toBe(1);
    const box = surface(picker).getBoundingClientRect();
    expect(box.width).toBe(286);
    expect(box.height).toBe(679);
    const list = (q(picker, '.shortcuts') as HTMLElement).getBoundingClientRect();
    const month = calendar(picker).getBoundingClientRect();
    expect(list.bottom).toBeLessThanOrEqual(month.top);
    await page.viewport(1100, 800);
  });

  it('does not switch at a fixed breakpoint: 794 px fits the default panel, 793 does not (D-7)', async () => {
    await page.viewport(794, 1000);
    const wide = (await mount({ ...period })).picker;
    await open(wide);
    expect(surface(wide).getAttribute('data-mode')).toBe('range');
    wide.remove();
    await page.viewport(793, 1000);
    const narrow = (await mount({ ...period })).picker;
    await open(narrow);
    expect(surface(narrow).getAttribute('data-mode')).toBe('narrow');
    await page.viewport(1100, 800);
  });

  it('measures the large panel against its own width: 906 px fits it, 905 does not (D-7)', async () => {
    await page.viewport(906, 1000);
    const wide = (await mount({ ...period, size: 'large' })).picker;
    await open(wide);
    expect(surface(wide).getAttribute('data-mode')).toBe('range');
    wide.remove();
    await page.viewport(905, 1000);
    const narrow = (await mount({ ...period, size: 'large' })).picker;
    await open(narrow);
    expect(surface(narrow).getAttribute('data-mode')).toBe('narrow');
    await page.viewport(1100, 800);
  });
});

describe('D-6 and the shortcuts', () => {
  const option = (picker: NphDatePicker, label: string): HTMLElement =>
    all<HTMLElement>(picker, 'nph-option').find((item) => item.textContent?.trim() === label) as HTMLElement;
  const range = (picker: NphDatePicker): [string, string] => [calendar(picker).start, calendar(picker).end];

  async function openRange(props: Partial<NphDatePicker> = {}): Promise<NphDatePicker> {
    const { picker } = await mount({ mode: 'range', ...props });
    await open(picker);
    return picker;
  }

  it('makes Today and Yesterday one day, and fills the band at once without closing', async () => {
    const picker = await openRange();
    await userEvent.click(option(picker, 'Today'));
    await settle(picker);
    expect(range(picker)).toEqual(['2026-10-14', '2026-10-14']);
    expect(picker.open).toBe(true);
    await userEvent.click(option(picker, 'Yesterday'));
    await settle(picker);
    expect(range(picker)).toEqual(['2026-10-13', '2026-10-13']);
  });

  it('makes Last 7 days and Last 30 days the whole days up to yesterday, without today (D-6)', async () => {
    const picker = await openRange();
    await userEvent.click(option(picker, 'Last 7 days'));
    await settle(picker);
    expect(range(picker)).toEqual(['2026-10-07', '2026-10-13']);
    await userEvent.click(option(picker, 'Last 30 days'));
    await settle(picker);
    expect(range(picker)).toEqual(['2026-09-14', '2026-10-13']);
  });

  it('runs This month from day 1 to the last day, and Last month is the whole previous month', async () => {
    const picker = await openRange();
    await userEvent.click(option(picker, 'This month'));
    await settle(picker);
    expect(range(picker)).toEqual(['2026-10-01', '2026-10-31']);
    await userEvent.click(option(picker, 'Last month'));
    await settle(picker);
    expect(range(picker)).toEqual(['2026-09-01', '2026-09-30']);
  });

  it('marks the chosen shortcut as selected, and waits for Apply: the fields do not change yet', async () => {
    const picker = await openRange();
    await userEvent.click(option(picker, 'Last 7 days'));
    await settle(picker);
    expect(all<HTMLElement & { selected: boolean }>(picker, 'nph-option').map((item) => item.selected)).toEqual([false, false, true, false, false, false, false]);
    expect(picker.start).toBe('');
    expect(textOf(picker, 'start')).toBe('');
  });

  it('brings the months to the range the shortcut chose', async () => {
    const picker = await openRange();
    await userEvent.click(option(picker, 'Last month'));
    await settle(picker);
    const titles = [...calendarRoot(picker).querySelectorAll('.title')].map((title) => (title as HTMLElement & { text: string }).text);
    expect(titles).toEqual(['September 2026', 'October 2026']);
  });

  it('does not change the dates on Custom, and moves the focus to the grid', async () => {
    const picker = await openRange({ start: '2026-10-02', end: '2026-10-05' });
    await userEvent.click(option(picker, 'Custom'));
    await settle(picker);
    expect(range(picker)).toEqual(['2026-10-02', '2026-10-05']);
    expect(calendarRoot(picker).activeElement?.classList.contains('day')).toBe(true);
  });

  it('marks Custom, or the shortcut whose period matches, when the person picks the days by hand', async () => {
    const picker = await openRange();
    const selected = (): string | undefined =>
      all<HTMLElement & { selected: boolean }>(picker, 'nph-option').find((item) => item.selected)?.textContent?.trim();
    expect(selected()).toBeUndefined();
    await userEvent.click(day(picker, '2026-10-02'));
    await userEvent.click(day(picker, '2026-10-05'));
    await settle(picker);
    expect(selected()).toBe('Custom');
    await userEvent.click(day(picker, '2026-10-14'));
    await userEvent.click(day(picker, '2026-10-14'));
    await settle(picker);
    expect(selected()).toBe('Today');
  });

  it('marks the matching shortcut on opening with a period, or Custom, and none when empty', async () => {
    const week = await openRange({ start: '2026-10-07', end: '2026-10-13' });
    expect(all<HTMLElement & { selected: boolean }>(week, 'nph-option').find((item) => item.selected)?.textContent?.trim()).toBe('Last 7 days');
    week.remove();
    const custom = await openRange({ start: '2026-10-02', end: '2026-10-05' });
    expect(all<HTMLElement & { selected: boolean }>(custom, 'nph-option').find((item) => item.selected)?.textContent?.trim()).toBe('Custom');
    custom.remove();
    const empty = await openRange();
    expect(all<HTMLElement & { selected: boolean }>(empty, 'nph-option').some((item) => item.selected)).toBe(false);
  });

  it('disables a shortcut with any day outside the min or the max, with the disabled look of nph-option, except This month (D-6)', async () => {
    const picker = await openRange({ min: '2026-10-01', max: '2026-10-20' });
    const options = all<HTMLElement & { disabled: boolean }>(picker, 'nph-option');
    expect(options.map((item) => item.disabled)).toEqual([false, false, false, true, false, true, false]);
    /* The look is the one of nph-option as it is: its own disabled opacity, no color of the date picker. */
    const look = getComputedStyle(options[3] as HTMLElement);
    expect(look.opacity).toBe(getComputedStyle(options[5] as HTMLElement).opacity);
    expect(Number(look.opacity)).toBeLessThan(1);
    expect(Number(getComputedStyle(options[2] as HTMLElement).opacity)).toBe(1);
    expect(options[3]?.getAttribute('aria-disabled') ?? (options[3] as HTMLElement & { disabled: boolean }).disabled).toBeTruthy();
    await userEvent.click(option(picker, 'Last 30 days'));
    await settle(picker);
    expect(range(picker)).toEqual(['', '']);
    await userEvent.click(option(picker, 'This month'));
    await settle(picker);
    expect(range(picker)).toEqual(['2026-10-01', '2026-10-20']);
  });

  it('cuts This month by the max, so that with the max on today it is not always disabled', async () => {
    const picker = await openRange({ max: '2026-10-14' });
    const options = all<HTMLElement & { disabled: boolean }>(picker, 'nph-option');
    expect(options.map((item) => item.disabled)).toEqual([false, false, false, false, false, false, false]);
    await userEvent.click(option(picker, 'This month'));
    await settle(picker);
    expect(range(picker)).toEqual(['2026-10-01', '2026-10-14']);
    expect(all<HTMLElement & { selected: boolean }>(picker, 'nph-option').find((item) => item.selected)?.textContent?.trim()).toBe('This month');
  });

  it('skips a disabled shortcut with the arrows and never chooses it with the keys', async () => {
    const picker = await openRange({ min: '2026-10-01', max: '2026-10-20' });
    const list = q(picker, '.shortcuts') as HTMLElement;
    list.focus();
    await settle(picker);
    await press(picker, '{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(list.getAttribute('aria-activedescendant')).toBe('shortcut-this-month');
    await press(picker, '{ArrowUp}');
    expect(list.getAttribute('aria-activedescendant')).toBe('shortcut-last-7-days');
    await press(picker, '{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(list.getAttribute('aria-activedescendant')).toBe('shortcut-custom');
  });

  it('is one Tab stop with the up and down arrows, Enter and Space; the active option has the hover look', async () => {
    const picker = await openRange();
    const list = q(picker, '.shortcuts') as HTMLElement;
    expect(list.getAttribute('role')).toBe('listbox');
    expect(list.tabIndex).toBe(0);
    expect(all<HTMLElement>(picker, 'nph-option').some((item) => item.tabIndex >= 0 && item.getAttribute('tabindex') !== null)).toBe(false);
    list.focus();
    await settle(picker);
    expect(list.getAttribute('aria-activedescendant')).toBe('shortcut-today');
    await press(picker, '{ArrowDown}{ArrowDown}');
    expect(list.getAttribute('aria-activedescendant')).toBe('shortcut-last-7-days');
    expect((q(picker, '#shortcut-last-7-days') as HTMLElement & { active: boolean }).active).toBe(true);
    await press(picker, '{Enter}');
    expect(range(picker)).toEqual(['2026-10-07', '2026-10-13']);
    await press(picker, '{End}');
    expect(list.getAttribute('aria-activedescendant')).toBe('shortcut-custom');
    await press(picker, '{Home}{ArrowDown} ');
    expect(range(picker)).toEqual(['2026-10-13', '2026-10-13']);
  });
});

describe('a period that does not cross an unavailable day (D-10)', () => {
  const unavailable = ['2026-10-20'];
  async function openRange(props: Partial<NphDatePicker> = {}): Promise<NphDatePicker> {
    const { picker } = await mount({ mode: 'range', unavailable, ...props });
    await open(picker);
    return picker;
  }
  const closed = (picker: NphDatePicker, date: string): boolean => day(picker, date).disabled;

  it('is off by default, is read from the attribute, and goes to the calendar of the panel', async () => {
    const picker = await openRange();
    expect(picker.allowsNonContiguousRanges).toBe(false);
    expect(calendar(picker).allowsNonContiguousRanges).toBe(false);
    picker.setAttribute('allows-non-contiguous-ranges', '');
    await settle(picker);
    expect(picker.allowsNonContiguousRanges).toBe(true);
    expect(calendar(picker).allowsNonContiguousRanges).toBe(true);
  });

  it('stops the End at the day before the first unavailable day after the Start, and the pick cycle goes on to Apply', async () => {
    const picker = await openRange({ start: '2026-10-14', end: '' });
    expect(closed(picker, '2026-10-19')).toBe(false);
    expect(closed(picker, '2026-10-21')).toBe(true);
    await userEvent.click(day(picker, '2026-10-19'));
    await settle(picker);
    expect([calendar(picker).start, calendar(picker).end]).toEqual(['2026-10-14', '2026-10-19']);
    expect(closed(picker, '2026-10-21')).toBe(false);
    await userEvent.click(innerButton(q(picker, '.apply') as HTMLElement));
    await settle(picker);
    expect([picker.start, picker.end]).toEqual(['2026-10-14', '2026-10-19']);
  });

  it('closes the days after the first pick of a new period, and opens them again on Clear', async () => {
    const picker = await openRange();
    await userEvent.click(day(picker, '2026-10-14'));
    await settle(picker);
    expect(closed(picker, '2026-10-21')).toBe(true);
    await userEvent.click(innerButton(q(picker, '.clear') as HTMLElement));
    await settle(picker);
    expect(closed(picker, '2026-10-21')).toBe(false);
  });

  it('lets a period cross the day when the property is on', async () => {
    const picker = await openRange({ start: '2026-10-14', end: '', allowsNonContiguousRanges: true });
    expect(closed(picker, '2026-10-21')).toBe(false);
    await userEvent.click(day(picker, '2026-10-24'));
    await settle(picker);
    expect([calendar(picker).start, calendar(picker).end]).toEqual(['2026-10-14', '2026-10-24']);
  });

  it('leaves a shortcut that holds an unavailable day as it is: it fills the period (D-15, provisional)', async () => {
    const picker = await openRange({ unavailable: ['2026-10-10'] });
    const option = all<HTMLElement & { disabled: boolean }>(picker, 'nph-option').find((item) => item.textContent?.trim() === 'Last 7 days');
    expect(option?.disabled).toBe(false);
    await userEvent.click(option as HTMLElement);
    await settle(picker);
    expect([calendar(picker).start, calendar(picker).end]).toEqual(['2026-10-07', '2026-10-13']);
  });

  it('keeps the rule of today for a typed period: it commits across an unavailable day, and the day itself is still refused', async () => {
    const { picker } = await mount({ mode: 'range', unavailable });
    await typeInto(picker, 'start', '10/14/2026');
    await typeInto(picker, 'end', '10/24/2026');
    expect([picker.start, picker.end]).toEqual(['2026-10-14', '2026-10-24']);
    await typeInto(picker, 'end', '10/20/2026');
    expect(picker.end).toBe('2026-10-24');
    expect((all<HTMLElement & { error: string }>(picker, 'nph-field')[1] as HTMLElement & { error: string }).error).toBe(LABELS.errorUnavailable);
  });
});

describe('the footer: Clear, Cancel and Apply (D-8, D-10)', () => {
  async function openRange(props: Partial<NphDatePicker> = {}): Promise<NphDatePicker> {
    const { picker } = await mount({ mode: 'range', ...props });
    await open(picker);
    return picker;
  }
  const click = async (picker: NphDatePicker, selector: string): Promise<void> => {
    await userEvent.click(innerButton(q(picker, selector) as HTMLElement));
    await settle(picker);
  };

  it('counts the period only on Apply: it writes both fields, fires change once, closes and gives the focus to the End button', async () => {
    const picker = await openRange();
    const changed = vi.fn();
    picker.addEventListener('change', changed);
    await userEvent.click(day(picker, '2026-10-05'));
    await userEvent.click(day(picker, '2026-10-12'));
    await settle(picker);
    expect(picker.start).toBe('');
    expect(textOf(picker, 'start')).toBe('');
    expect(changed).not.toHaveBeenCalled();
    await click(picker, '.apply');
    expect([picker.start, picker.end]).toEqual(['2026-10-05', '2026-10-12']);
    expect(textOf(picker, 'start')).toBe('10/05/2026');
    expect(textOf(picker, 'end')).toBe('10/12/2026');
    expect(changed).toHaveBeenCalledTimes(1);
    expect(picker.open).toBe(false);
    await until(() => !shown(picker));
    expect(deepActive()).toBe(innerButton(buttonEl(picker)));
  });

  it('reorders an End picked before the Start (D-10)', async () => {
    const picker = await openRange();
    await userEvent.click(day(picker, '2026-10-12'));
    await userEvent.click(day(picker, '2026-10-05'));
    await click(picker, '.apply');
    expect([picker.start, picker.end]).toEqual(['2026-10-05', '2026-10-12']);
  });

  it('applies one day, with the End field showing the same date, when only the Start was picked (D-10)', async () => {
    const picker = await openRange();
    await userEvent.click(day(picker, '2026-10-05'));
    await click(picker, '.apply');
    expect([picker.start, picker.end]).toEqual(['2026-10-05', '2026-10-05']);
    expect(textOf(picker, 'end')).toBe('10/05/2026');
  });

  it('applies an empty period when nothing is chosen, and Apply stays enabled (D-10)', async () => {
    const picker = await openRange({ start: '2026-10-05', end: '2026-10-12' });
    const apply = q(picker, '.apply') as HTMLElement & { disabled: boolean };
    expect(apply.disabled).toBe(false);
    await click(picker, '.clear');
    expect(apply.disabled).toBe(false);
    await click(picker, '.apply');
    expect([picker.start, picker.end]).toEqual(['', '']);
    expect(textOf(picker, 'start')).toBe('');
  });

  it('starts over on a third pick: the day is the new Start and the End is cleared (D-10)', async () => {
    const picker = await openRange();
    await userEvent.click(day(picker, '2026-10-05'));
    await userEvent.click(day(picker, '2026-10-12'));
    await userEvent.click(day(picker, '2026-10-20'));
    await settle(picker);
    expect([calendar(picker).start, calendar(picker).end]).toEqual(['2026-10-20', '']);
  });

  it('accepts a one-day period: Start and End on the same day (D-10)', async () => {
    const picker = await openRange();
    await userEvent.click(day(picker, '2026-10-05'));
    await userEvent.click(day(picker, '2026-10-05'));
    await click(picker, '.apply');
    expect([picker.start, picker.end]).toEqual(['2026-10-05', '2026-10-05']);
  });

  it('empties the selection in the panel with Clear, at once, without closing, and clears the shortcut mark (D-8)', async () => {
    const picker = await openRange({ start: '2026-10-08', end: '2026-10-14' });
    await click(picker, '.clear');
    expect(picker.open).toBe(true);
    expect([calendar(picker).start, calendar(picker).end]).toEqual(['', '']);
    expect(all<HTMLElement & { selected: boolean }>(picker, 'nph-option').some((item) => item.selected)).toBe(false);
  });

  it('empties the Start and End fields only on Apply, and Cancel brings the previous period back (D-8)', async () => {
    const picker = await openRange({ start: '2026-10-08', end: '2026-10-14' });
    await click(picker, '.clear');
    expect(picker.start).toBe('2026-10-08');
    expect(textOf(picker, 'start')).toBe('10/08/2026');
    await click(picker, '.cancel');
    await until(() => !shown(picker));
    expect([picker.start, picker.end]).toEqual(['2026-10-08', '2026-10-14']);
    expect(textOf(picker, 'end')).toBe('10/14/2026');
  });

  it('closes on Cancel, Esc and a press outside without applying, and discards what was not applied', async () => {
    for (const how of ['cancel', 'escape', 'outside']) {
      const picker = await openRange({ start: '2026-10-08', end: '2026-10-14' });
      const changed = vi.fn();
      picker.addEventListener('change', changed);
      await userEvent.click(day(picker, '2026-10-20'));
      await userEvent.click(day(picker, '2026-10-25'));
      if (how === 'cancel') await click(picker, '.cancel');
      else if (how === 'escape') await press(picker, '{Escape}');
      else await userEvent.click(away());
      await until(() => !shown(picker)).catch(() => {
        throw new Error(`still open after ${how}`);
      });
      expect([picker.start, picker.end], how).toEqual(['2026-10-08', '2026-10-14']);
      expect(changed, how).not.toHaveBeenCalled();
      picker.remove();
    }
  });

  it('closes on Tab after the last item (Apply), discarding what was not applied, with the focus on the End button', async () => {
    const picker = await openRange({ start: '2026-10-08', end: '2026-10-14' });
    await userEvent.click(day(picker, '2026-10-20'));
    innerButton(q(picker, '.apply') as HTMLElement).focus();
    await press(picker, '{Tab}');
    await until(() => !shown(picker));
    expect([picker.start, picker.end]).toEqual(['2026-10-08', '2026-10-14']);
    expect(deepActive()).toBe(innerButton(buttonEl(picker)));
  });

  it('announces the chosen period in a live region, such as 5 to 12 October 2026', async () => {
    const picker = await openRange();
    const status = q(picker, '.status') as HTMLElement;
    expect(status.getAttribute('aria-live')).toBe('polite');
    await userEvent.click(day(picker, '2026-10-05'));
    await userEvent.click(day(picker, '2026-10-12'));
    await settle(picker);
    expect(status.textContent).toBe('October 5, 2026 to October 12, 2026');
  });
});

describe('typing a date (D-4, D-13)', () => {
  const fieldOf = (picker: NphDatePicker, index = 0): HTMLElement & { error: string } => all<HTMLElement & { error: string }>(picker, 'nph-field')[index] as HTMLElement & { error: string };

  it('commits a date typed in the order of the language when the person leaves the field, and writes it back normalized', async () => {
    const { picker } = await mount();
    const changed = vi.fn();
    picker.addEventListener('change', changed);
    await typeInto(picker, 'single', '3/5/2026');
    expect(picker.value).toBe('2026-03-05');
    expect(textOf(picker)).toBe('03/05/2026');
    expect(changed).toHaveBeenCalledTimes(1);
    expect(fieldOf(picker).error).toBe('');
  });

  it('reads day first in pt-BR', async () => {
    const { picker } = await mount({ lang: 'pt-BR' });
    await typeInto(picker, 'single', '5/3/2026');
    expect(picker.value).toBe('2026-03-05');
    expect(textOf(picker)).toBe('05/03/2026');
  });

  it('never lets the inner input and change events leave the piece: only its own change, once', async () => {
    const { picker } = await mount();
    const seen: string[] = [];
    document.addEventListener('input', (event) => seen.push(`input:${(event.target as Element).localName}`));
    document.addEventListener('change', (event) => seen.push(`change:${(event.target as Element).localName}`));
    await typeInto(picker, 'single', '03/05/2026');
    expect(seen.filter((entry) => entry.startsWith('input'))).toEqual([]);
    expect(seen.filter((entry) => entry.startsWith('change'))).toEqual(['change:nph-date-picker']);
  });

  it('says an impossible date is invalid, on the field, and keeps the value it had (D-4)', async () => {
    const { picker } = await mount({ value: '2026-10-20' });
    const changed = vi.fn();
    picker.addEventListener('change', changed);
    await typeInto(picker, 'single', '02/31/2026');
    expect(fieldOf(picker).error).toBe('Invalid date: check the day and the month.');
    expect(picker.value).toBe('2026-10-20');
    expect(textOf(picker)).toBe('02/31/2026');
    expect(changed).not.toHaveBeenCalled();
    expect((q(picker, 'nph-input') as HTMLElement & { invalid: boolean }).invalid).toBe(true);
    expect((picker as unknown as { internals: ElementInternals }).internals.validity.badInput).toBe(true);
  });

  it('cites the limit: on or after the min, on or before the max, between both (D-4)', async () => {
    const min = await mount({ min: '2026-03-01' });
    await typeInto(min.picker, 'single', '01/05/2026');
    expect(fieldOf(min.picker).error).toBe('The date must be on or after 03/01/2026.');
    min.picker.remove();
    const max = await mount({ max: '2026-12-31' });
    await typeInto(max.picker, 'single', '01/05/2027');
    expect(fieldOf(max.picker).error).toBe('The date must be on or before 12/31/2026.');
    max.picker.remove();
    const both = await mount({ min: '2026-03-01', max: '2026-12-31' });
    await typeInto(both.picker, 'single', '01/05/2027');
    expect(fieldOf(both.picker).error).toBe('Choose a date between 03/01/2026 and 12/31/2026.');
  });

  it('says a date unavailable by rule cannot be chosen, and says one message at a time, in order (D-4)', async () => {
    const { picker } = await mount({ unavailable: ['2026-10-15'], min: '2026-10-01', max: '2026-10-31' });
    await typeInto(picker, 'single', '10/15/2026');
    expect(fieldOf(picker).error).toBe('This date is not available, choose another day.');
    await typeInto(picker, 'single', '11/15/2026');
    expect(fieldOf(picker).error).toBe('Choose a date between 10/01/2026 and 10/31/2026.');
    await typeInto(picker, 'single', '10/16/2026');
    expect(fieldOf(picker).error).toBe('');
    expect(picker.value).toBe('2026-10-16');
  });

  it('treats an empty field as an error only when the field is required', async () => {
    const free = await mount({ value: '2026-10-20' });
    const changed = vi.fn();
    free.picker.addEventListener('change', changed);
    await typeInto(free.picker, 'single', '');
    expect(fieldOf(free.picker).error).toBe('');
    expect(free.picker.value).toBe('');
    expect(changed).toHaveBeenCalledTimes(1);
    free.picker.remove();
    const required = await mount({ value: '2026-10-20', required: true });
    await typeInto(required.picker, 'single', '');
    expect(fieldOf(required.picker).error).toBe('Enter the date.');
  });

  it('says End before Start is an error and never reorders what was typed (D-4)', async () => {
    const { picker } = await mount({ mode: 'range', start: '2026-10-10', end: '2026-10-14' });
    await typeInto(picker, 'end', '10/05/2026');
    expect(fieldOf(picker, 1).error).toBe('The end must be on or after the start (10/10/2026).');
    expect([picker.start, picker.end]).toEqual(['2026-10-10', '2026-10-14']);
    expect(fieldOf(picker, 0).error).toBe('');
  });

  it('says a Start typed after the End is an error on the Start field and commits nothing, closed or open', async () => {
    const { picker } = await mount({ mode: 'range', start: '2026-10-10', end: '2026-10-14' });
    await typeInto(picker, 'start', '10/20/2026');
    expect(fieldOf(picker, 0).error).toBe('The end must be on or after the start (10/20/2026).');
    expect([picker.start, picker.end]).toEqual(['2026-10-10', '2026-10-14']);
    await open(picker);
    await typeInto(picker, 'start', '10/25/2026');
    expect(fieldOf(picker, 0).error).toBe('The end must be on or after the start (10/25/2026).');
    expect(calendar(picker).start).toBe('2026-10-10');
  });

  it('asks for the start and the end date with their own messages when required', async () => {
    const { picker } = await mount({ mode: 'range', required: true, start: '2026-10-10', end: '2026-10-14' });
    await typeInto(picker, 'start', '');
    expect(fieldOf(picker, 0).error).toBe('Enter the start date.');
    await typeInto(picker, 'end', '');
    expect(fieldOf(picker, 1).error).toBe('Enter the end date.');
  });

  it('commits each field of a range typed with the panel closed when the person leaves it, even an incomplete period (D-13)', async () => {
    const { picker } = await mount({ mode: 'range' });
    const changed = vi.fn();
    picker.addEventListener('change', changed);
    await typeInto(picker, 'start', '10/05/2026');
    expect([picker.start, picker.end]).toEqual(['2026-10-05', '']);
    expect(changed).toHaveBeenCalledTimes(1);
    await typeInto(picker, 'end', '10/12/2026');
    expect([picker.start, picker.end]).toEqual(['2026-10-05', '2026-10-12']);
    expect(changed).toHaveBeenCalledTimes(2);
  });

  it('moves the panel to the typed date once it is valid, and marks it, with the panel open (D-4)', async () => {
    const { picker } = await mount({ value: '2026-10-20' });
    await open(picker);
    inputOf(picker).focus();
    await userEvent.clear(inputOf(picker));
    await userEvent.type(inputOf(picker), '03/05/2027');
    await userEvent.tab();
    await settle(picker);
    await until(() => calendarRoot(picker).querySelector('.title') !== null);
    expect((calendarRoot(picker).querySelector('.title') as HTMLElement & { text: string }).text).toBe('March 2027');
    expect(day(picker, '2027-03-05').hasAttribute('data-selected')).toBe(true);
    expect(picker.open).toBe(true);
  });

  it('keeps a range typed with the panel open in the panel until Apply (nothing counts before it)', async () => {
    const { picker } = await mount({ mode: 'range' });
    await open(picker);
    inputOf(picker, 'start').focus();
    await userEvent.type(inputOf(picker, 'start'), '10/05/2026');
    await userEvent.tab();
    await settle(picker);
    expect(picker.start).toBe('');
    expect(calendar(picker).start).toBe('2026-10-05');
    await userEvent.click(innerButton(q(picker, '.apply') as HTMLElement));
    await settle(picker);
    expect([picker.start, picker.end]).toEqual(['2026-10-05', '2026-10-05']);
  });

  it('clears the field with its clear button, and commits the empty date', async () => {
    const { picker } = await mount({ value: '2026-10-20' });
    const changed = vi.fn();
    picker.addEventListener('change', changed);
    const input = q(picker, 'nph-input') as HTMLElement;
    await (input as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    const clear = input.shadowRoot?.querySelector('.clear') as HTMLElement;
    await userEvent.click(clear);
    await settle(picker);
    expect(picker.value).toBe('');
    expect(textOf(picker)).toBe('');
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('resets the text and clears the error of a single date when the panel closes without applying', async () => {
    const { picker } = await mount({ value: '2026-10-20' });
    await typeInto(picker, 'single', '02/31/2026');
    expect(fieldOf(picker).error).not.toBe('');
    await open(picker);
    await press(picker, '{Escape}');
    await until(() => !shown(picker));
    expect(fieldOf(picker).error).toBe('');
    expect(textOf(picker)).toBe('10/20/2026');
  });

  it('clears the error of a typed date when the panel closes without applying', async () => {
    const { picker } = await mount({ mode: 'range', start: '2026-10-10', end: '2026-10-14' });
    await typeInto(picker, 'end', '10/05/2026');
    expect(fieldOf(picker, 1).error).not.toBe('');
    await open(picker);
    await press(picker, '{Escape}');
    await until(() => !shown(picker));
    expect(fieldOf(picker, 1).error).toBe('');
    expect(textOf(picker, 'end')).toBe('10/14/2026');
  });
});

describe('the form', () => {
  it('puts the date of a single picker in the form data under name', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const picker = document.createElement('nph-date-picker') as NphDatePicker;
    picker.labels = LABELS;
    picker.label = 'Due date';
    picker.name = 'due';
    picker.value = '2026-10-20';
    form.append(picker);
    await settle(picker);
    expect(new FormData(form).get('due')).toBe('2026-10-20');
    picker.value = '';
    await settle(picker);
    expect(new FormData(form).has('due')).toBe(false);
  });

  it('puts the two dates of a range in the form data under start-name and end-name', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const picker = document.createElement('nph-date-picker') as NphDatePicker;
    picker.labels = LABELS;
    picker.mode = 'range';
    picker.startLabel = 'Start';
    picker.endLabel = 'End';
    picker.startName = 'from';
    picker.endName = 'to';
    picker.start = '2026-10-05';
    picker.end = '2026-10-12';
    form.append(picker);
    await settle(picker);
    expect(new FormData(form).get('from')).toBe('2026-10-05');
    expect(new FormData(form).get('to')).toBe('2026-10-12');
  });

  it('is valueMissing while required and empty, and valid once it has a date', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const picker = document.createElement('nph-date-picker') as NphDatePicker;
    picker.labels = LABELS;
    picker.label = 'Due date';
    picker.required = true;
    form.append(picker);
    await settle(picker);
    expect(form.checkValidity()).toBe(false);
    picker.value = '2026-10-20';
    await settle(picker);
    expect(form.checkValidity()).toBe(true);
  });

  it('goes back to its value, start and end attributes on form.reset()', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const picker = document.createElement('nph-date-picker') as NphDatePicker;
    picker.labels = LABELS;
    picker.label = 'Due date';
    picker.name = 'due';
    picker.setAttribute('value', '2026-10-20');
    form.append(picker);
    await settle(picker);
    picker.value = '2026-11-01';
    await settle(picker);
    form.reset();
    await settle(picker);
    expect(picker.value).toBe('2026-10-20');
    expect(textOf(picker)).toBe('10/20/2026');
  });

  it('fires nothing when code sets the value', async () => {
    const { picker } = await mount();
    const changed = vi.fn();
    picker.addEventListener('change', changed);
    picker.value = '2026-10-20';
    await settle(picker);
    expect(changed).not.toHaveBeenCalled();
    expect(textOf(picker)).toBe('10/20/2026');
  });
});

describe('the roles and names the browser computes', () => {
  it('names the panel a dialog: Choose date for a single date, Choose period for a range; it is not modal', async () => {
    const single = (await mount()).picker;
    await open(single);
    expect(surface(single).getAttribute('role')).toBe('dialog');
    expect(surface(single).getAttribute('aria-label')).toBe('Choose date');
    expect(surface(single).hasAttribute('aria-modal')).toBe(false);
    single.remove();
    const range = (await mount({ mode: 'range' })).picker;
    await open(range);
    expect(surface(range).getAttribute('aria-label')).toBe('Choose period');
  });

  it('gives the text the label of the field as its name and the hint as its description, through the field', async () => {
    const { picker } = await mount();
    const native = inputOf(picker);
    const root0 = (q(picker, 'nph-input') as HTMLElement).shadowRoot as ShadowRoot;
    const describedBy = native.getAttribute('aria-describedby') ?? '';
    expect(describedBy).not.toBe('');
    expect(root0.getElementById(describedBy.split(' ')[0] as string)?.textContent).toContain('mm/dd/yyyy');
    expect(native.labels?.length ?? 0).toBeGreaterThanOrEqual(0);
    expect(native.getAttribute('aria-label') ?? '').toContain('Due date');
  });

  it('keeps the calendar button named by its tooltip, which is its accessible name', async () => {
    const { picker } = await mount();
    const native = innerButton(buttonEl(picker));
    expect(native.getAttribute('aria-label') ?? native.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('is a listbox of seven options for the shortcuts, each an option with its state', async () => {
    const { picker } = await mount({ mode: 'range', start: '2026-10-08', end: '2026-10-14' });
    await open(picker);
    expect(q(picker, '.shortcuts')?.getAttribute('role')).toBe('listbox');
    expect(q(picker, '.shortcuts')?.getAttribute('aria-label')).toBe('Shortcuts');
    const options = all<HTMLElement & { selected: boolean }>(picker, 'nph-option');
    expect(options).toHaveLength(7);
    expect(options.filter((option) => option.selected)).toHaveLength(1);
  });

  it('is never inside a nph-field of the consumer: the piece brings its own fields', async () => {
    const { picker } = await mount();
    expect(picker.closest('nph-field')).toBeNull();
    expect(all(picker, 'nph-field')).toHaveLength(1);
  });
});

describe('the token contract', () => {
  it('reads only semantic and component tokens, never a literal design value', () => {
    for (const css of [componentCss, controlCss]) {
      expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(css).not.toMatch(/\b(rgb|hsl)a?\(/);
      expect(css).not.toMatch(/--nph-core-/);
      /* The written lengths: none, outside a comment. */
      const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
      expect(withoutComments).not.toMatch(/\b\d+(\.\d+)?(px|rem|em|ms|s)\b/);
    }
  });

  it('uses only custom properties the generated CSS declares', () => {
    const declared = new Set([...tokensCss.matchAll(/(--nph-[a-z0-9-]+)\s*:/g)].map((match) => match[1]));
    for (const css of [componentCss, controlCss]) {
      const used = new Set([...css.matchAll(/var\((--nph-[a-z0-9-]+)/g)].map((match) => match[1]));
      for (const name of used) expect(declared.has(name as string), name as string).toBe(true);
    }
  });

  it('has the nine tokens of the task in the generated CSS', () => {
    for (const name of [
      'calendar-day-radius', 'calendar-day-focus-radius', 'date-picker-panel-radius', 'date-picker-panel-border', 'date-picker-divider',
      'date-picker-panel-padding', 'date-picker-panel-offset', 'date-picker-trigger-gap', 'date-picker-footer-gap',
    ]) {
      expect(tokensCss, name).toContain(`--nph-${name}:`);
    }
  });

  it('consumes the tokens the evidence names for the panel, the divider and the gaps', () => {
    for (const name of ['date-picker-panel-radius', 'date-picker-panel-border', 'date-picker-divider', 'date-picker-panel-padding', 'date-picker-panel-offset', 'date-picker-footer-gap']) {
      expect(componentCss, name).toContain(`--nph-${name}`);
    }
    expect(controlCss).toContain('--nph-date-picker-trigger-gap');
  });

  it('never moves the panel by a transition of layout: it animates opacity and translate', () => {
    expect(componentCss).toMatch(/transition-property:\s*opacity,\s*translate/);
  });
});

describe('what the picker does NOT have', () => {
  it('has no event of its own besides change: the inner input and change never cross its root', async () => {
    const { picker } = await mount({ value: '2026-10-20' });
    const seen: string[] = [];
    for (const type of ['input', 'change', 'nph-pick', 'nph-month-change']) picker.addEventListener(type, () => seen.push(type));
    await open(picker);
    await userEvent.click(day(picker, '2026-10-22'));
    await settle(picker);
    expect(seen).toEqual(['change']);
  });
});
