/**
 * `nph-date-picker` — a date field with a calendar, in two modes: a single date and a range.
 *
 * Contract accepted in Figma (documentation frame `6673:62837`, root `6662:55010`, set `6666:32`, panel `6662:56378`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-90, sheet `fichas/nph-date-picker.md`,
 * `design.md` and decision P133 — nph-date-picker and nph-calendar: API and semantics. The pieces it uses: `nph-field` (each date
 * has its own), `nph-input`, an icon-only `nph-button` as the calendar button, `nph-tooltip` (the name of that button),
 * `nph-calendar` (the date grid), `nph-option` (the shortcuts), `nph-separator` and `nph-button` (the footer).
 * - `mode`: `single` (default; one field, one month; picking a day applies and closes) or `range` (Start and End fields,
 *   shortcuts, two months and a footer with Apply). Reflects. `size`: `compact` (28), `default` (36) or `large` (44), the
 *   height of the field and of the calendar button; the compact field opens the default panel. Reflects;
 * - `value` (single) and `start` and `end` (range): the date, or the period, as text `YYYY-MM-DD`. The person's choice writes
 *   them; setting them from code fires no event. `min` and `max` limit them; `unavailable` is a list of dates, or a function, for
 *   a date unavailable by rule, such as a holiday (it takes focus and cannot be chosen);
 * - `label` (single), `start-label` and `end-label` (range) are the visible labels of the `nph-field`s; `error` (single),
 *   `start-error` and `end-error` are an error the screen owns, shown when the piece has none of its own; `required` and `disabled`
 *   go to every field. The `dd/mm/aaaa` hint is the help line of each field, linked to the text by `aria-describedby` through the
 *   field, and the placeholder of an empty one;
 * - `name` (single), `start-name` and `end-name` (range) put the date in the form data. The piece is form-associated: required,
 *   a typed date that is not one, and `form.reset()` work as in a native field;
 * - `week-start`: `sunday` (default) or `monday`. `now`: the date of today, for tests and stories. `labels`: every text the
 *   piece writes, already localized, as one object (it writes no word of its own). The names of the months and the weekdays and
 *   the order of day, month and year come from `Intl`, in the language of the nearest `lang`;
 * - `open`: the panel is open. Reflects. The piece opens and closes it; the consumer may set it. A disabled picker does not open;
 * - the event `change` (bubbles, composed), when a date is applied or a typed date is committed (single), or the period is applied or a typed
 *   field is committed (range). Read the value from the host. The `input` and `change` of the inner text never leave the piece;
 * - no color property and no `::part`.
 *
 * THE FIELD — the `nph-field` names and describes ONE control (P83), and here the control row holds the text and the
 * calendar button. The row is the internal element `nph-date-picker-control` (`date-picker / controle`), which takes the field
 * contract and hands it to the `nph-input`; the calendar button keeps its own name. No input mask (DSA-16 D1): the value is
 * validated when the person leaves the field, and the message comes through the `nph-field` (D-4).
 *
 * THE PANEL — a surface of its own, not an `nph-popover` (its widths stop at 400): a `popover="manual"`, so it lives in the top layer. It
 * opens `date-picker/panel-offset` below the field, aligned to the start of the trigger, flips above with the same gap when it does
 * not fit, and shrinks with an inner scroll when neither side fits. Esc closes without change; a press outside closes like Cancel; Tab after
 * the last item closes like Cancel and gives the focus back to the calendar button (the End button in a range): the period counts only on
 * Apply. The range has seven shortcuts (`nph-option` in a listbox), two months, a divider and a footer; on a narrow screen one month, the
 * shortcuts on top (D-7).
 *
 * PROVISIONAL RULES (the design owner has not answered D-1 to D-11; each follows the column "Until the design owner answers" of the task):
 * D-1 six rows; D-2 the views as drawn; D-3 `text/label-sm` on the weekday names; D-4 an error on the field that says what to fix and
 * cites the limit, no reorder of a typed value; D-5 both arrows on each month, the months move together, the Start month on the left;
 * D-6 the periods of the shortcuts; D-7 the switch to one month by the width available; D-8 Clear empties the panel and the fields
 * only on Apply; D-9 the ladder of month and year views; D-10 a third pick starts over, one day is valid, Apply stays enabled; D-11 a day
 * outside the month can be picked, one Tab stop per grid. The code carries the questions DSA-90 D-12 (the measures with no token),
 * D-13 (a typed Start or End with the panel closed commits when the field is left) and D-14 (the page margin of D-7).
 *
 * Invalid input does not render and emits `console.error` only in development, one per cause while it lasts (the rule of P21): a `mode`,
 * a `size` or a `week-start` outside the lists, and a date that does not exist. A missing label renders anyway and says which keys, once.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

import '../nph-button/nph-button';
import '../nph-calendar/nph-calendar';
import '../nph-field/nph-field';
import '../nph-input/nph-input';
import '../nph-option/nph-option';
import '../nph-separator/nph-separator';
import './nph-date-picker-control';
import {
  NPH_CALENDAR_WEEK_STARTS,
  firstOfMonth,
  isoDate,
  parseDay,
  toDay,
} from '../nph-calendar/nph-calendar.logic';
import type { Day, Limits, Range } from '../nph-calendar/nph-calendar.logic';
import type { NphCalendar, NphCalendarLabels, NphCalendarPickDetail } from '../nph-calendar/nph-calendar';
import type { NphOption } from '../nph-option/nph-option';
import datePickerCss from './nph-date-picker.css?inline';
import {
  SHORTCUTS,
  checkTyped,
  dateOrderOf,
  formatDay,
  matchShortcut,
  parseTyped,
  shortcutDisabled,
  shortcutRange,
} from './nph-date-picker.logic';
import type { DateOrder, Shortcut, TypedError } from './nph-date-picker.logic';

const TAG = 'nph-date-picker';

export const NPH_DATE_PICKER_MODES = ['single', 'range'] as const;
export type NphDatePickerMode = (typeof NPH_DATE_PICKER_MODES)[number];

export const NPH_DATE_PICKER_SIZES = ['compact', 'default', 'large'] as const;
export type NphDatePickerSize = (typeof NPH_DATE_PICKER_SIZES)[number];

/** A date unavailable by rule: a list of `YYYY-MM-DD`, or a function that says it for one date. */
export type NphDatePickerUnavailable = readonly string[] | ((date: string) => boolean);

/** Every text the piece writes, already localized by the consuming application. */
export interface NphDatePickerLabels extends NphCalendarLabels {
  /** The `dd/mm/aaaa` hint: the help line of each field and the placeholder of an empty one. */
  readonly hint: string;
  readonly openCalendar: string;
  readonly clearDate: string;
  readonly dialogDate: string;
  readonly dialogPeriod: string;
  readonly shortcuts: string;
  readonly shortcutToday: string;
  readonly shortcutYesterday: string;
  readonly shortcutLast7Days: string;
  readonly shortcutLast30Days: string;
  readonly shortcutThisMonth: string;
  readonly shortcutLastMonth: string;
  readonly shortcutCustom: string;
  readonly clear: string;
  readonly cancel: string;
  readonly apply: string;
  /** The period announced after a choice, with `{start}` and `{end}`, such as `{start} to {end}`. */
  readonly period: string;
  readonly errorRequired: string;
  readonly errorRequiredStart: string;
  readonly errorRequiredEnd: string;
  readonly errorInvalid: string;
  /** With `{min}`, the date, on or after which the date must be. */
  readonly errorMin: string;
  /** With `{max}`. */
  readonly errorMax: string;
  /** With `{min}` and `{max}`. */
  readonly errorBetween: string;
  readonly errorUnavailable: string;
  /** With `{start}`: the End typed before the Start. */
  readonly errorEndBeforeStart: string;
}

export const NPH_DATE_PICKER_LABEL_KEYS = [
  'previousMonth',
  'nextMonth',
  'previousYear',
  'nextYear',
  'previousYears',
  'nextYears',
  'today',
  'selected',
  'unavailable',
  'hint',
  'openCalendar',
  'clearDate',
  'dialogDate',
  'dialogPeriod',
  'shortcuts',
  'shortcutToday',
  'shortcutYesterday',
  'shortcutLast7Days',
  'shortcutLast30Days',
  'shortcutThisMonth',
  'shortcutLastMonth',
  'shortcutCustom',
  'clear',
  'cancel',
  'apply',
  'period',
  'errorRequired',
  'errorRequiredStart',
  'errorRequiredEnd',
  'errorInvalid',
  'errorMin',
  'errorMax',
  'errorBetween',
  'errorUnavailable',
  'errorEndBeforeStart',
] as const satisfies readonly (keyof NphDatePickerLabels)[];

/** Which field a text or an error belongs to. */
type Which = 'single' | 'start' | 'end';

type CloseReason = 'apply' | 'cancel' | 'pick' | 'escape' | 'outside' | 'toggle' | 'tab' | 'code';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

const SHORTCUT_LABEL: Record<Shortcut, keyof NphDatePickerLabels> = {
  today: 'shortcutToday',
  yesterday: 'shortcutYesterday',
  'last-7-days': 'shortcutLast7Days',
  'last-30-days': 'shortcutLast30Days',
  'this-month': 'shortcutThisMonth',
  'last-month': 'shortcutLastMonth',
  custom: 'shortcutCustom',
};

export class NphDatePicker extends LitElement {
  static override styles = unsafeCSS(datePickerCss);

  /* The host takes part in the form: a value, a name and a validity of its own. */
  static formAssociated = true;

  static override properties = {
    /* `mode` and `size` reflect: the internal CSS selects the layout and the measures by them. */
    mode: { type: String, reflect: true },
    size: { type: String, reflect: true },
    value: { type: String },
    start: { type: String },
    end: { type: String },
    min: { type: String },
    max: { type: String },
    unavailable: { attribute: false },
    label: { type: String },
    startLabel: { type: String, attribute: 'start-label' },
    endLabel: { type: String, attribute: 'end-label' },
    error: { type: String },
    startError: { type: String, attribute: 'start-error' },
    endError: { type: String, attribute: 'end-error' },
    /* `name` reflects because the form reads the attribute of the host. */
    name: { type: String, reflect: true },
    startName: { type: String, attribute: 'start-name', reflect: true },
    endName: { type: String, attribute: 'end-name', reflect: true },
    /* The reflected booleans are read by the internal CSS and by the consumer's selectors. */
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
    weekStart: { type: String, attribute: 'week-start' },
    now: { type: String },
    labels: { attribute: false },
  };

  declare mode: string;
  declare size: string;
  /** The chosen date of a single picker, `YYYY-MM-DD`. */
  declare value: string;
  /** The start and the end of the period of a range picker, `YYYY-MM-DD`. */
  declare start: string;
  declare end: string;
  declare min: string;
  declare max: string;
  declare unavailable: NphDatePickerUnavailable;
  declare label: string;
  declare startLabel: string;
  declare endLabel: string;
  declare error: string;
  declare startError: string;
  declare endError: string;
  declare name: string | null;
  declare startName: string | null;
  declare endName: string | null;
  declare required: boolean;
  declare disabled: boolean;
  declare open: boolean;
  declare weekStart: string;
  declare now: string;
  declare labels: Partial<NphDatePickerLabels>;

  private readonly internals: ElementInternals;
  private valid = false;
  private reported: readonly string[] = [];
  private missingReported = false;
  private order: DateOrder = ['day', 'month', 'year'];

  /** What the person typed, per field, until it is committed or the value changes from outside. */
  private texts: Record<Which, string> = { single: '', start: '', end: '' };
  /** The message each field shows for what it holds, by the key of the label. */
  private errors: Record<Which, TypedError | null> = { single: null, start: null, end: null };
  /** The period in the panel, before Apply. */
  private draft: { start: string; end: string } = { start: '', end: '' };
  private shortcut: Shortcut | null = null;
  private activeShortcut: Shortcut | null = null;
  private announcement = '';
  private narrow = false;

  /** The surface stays drawn while it leaves. */
  private surfaceDrawn = false;
  private shown = false;
  private closeTimer: number | undefined;
  private frame: number | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private readonly scrollTargets: EventTarget[] = [];
  private returnsFocus = false;
  private tabbing = false;
  /** Opened by the markup, not by the person: nothing asked for the focus. */
  private openedByMarkup = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.mode = 'single';
    this.size = 'default';
    this.value = '';
    this.start = '';
    this.end = '';
    this.min = '';
    this.max = '';
    this.unavailable = [];
    this.label = '';
    this.startLabel = '';
    this.endLabel = '';
    this.error = '';
    this.startError = '';
    this.endError = '';
    this.name = null;
    this.startName = null;
    this.endName = null;
    this.required = false;
    this.disabled = false;
    this.open = false;
    this.weekStart = 'sunday';
    this.now = '';
    this.labels = {};
  }

  /* ----- the clock, the language and the text -------------------------------------------- */

  /** The nearest `lang`, crossing the shadow roots this piece lives in, as `nph-scheduler` reads it. */
  private language(): string {
    let node: Element | null = this;
    while (node !== null) {
      const found: Element | null = node.closest('[lang]');
      if (found !== null) return found.getAttribute('lang') || 'en';
      const root = node.getRootNode();
      node = root instanceof ShadowRoot ? root.host : null;
    }
    return 'en';
  }

  private longDate(day: Day): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    try {
      return new Intl.DateTimeFormat(this.language(), options).format(new Date(day * 86_400_000));
    } catch {
      return new Intl.DateTimeFormat('en', options).format(new Date(day * 86_400_000));
    }
  }

  private text(key: keyof NphDatePickerLabels, values: Record<string, string> = {}): string {
    let text = trimmed(this.labels?.[key]);
    for (const [name, value] of Object.entries(values)) {
      text = text.replaceAll(`{${name}}`, value);
    }
    return text;
  }

  private get today(): Day {
    const fixed = parseDay(trimmed(this.now));
    if (fixed !== null) return fixed;
    const value = new Date();
    return toDay(value.getFullYear(), value.getMonth() + 1, value.getDate());
  }

  private get isRange(): boolean {
    return this.mode === 'range';
  }

  private get limits(): Limits {
    return { min: parseDay(trimmed(this.min)), max: parseDay(trimmed(this.max)) };
  }

  private isUnavailable = (day: Day): boolean => {
    const rule = this.unavailable;
    if (typeof rule === 'function') {
      try {
        return Boolean(rule(isoDate(day)));
      } catch {
        return false;
      }
    }
    return Array.isArray(rule) && rule.includes(isoDate(day));
  };

  private get fieldSize(): 'compact' | 'default' | 'large' {
    const size = trimmed(this.size);
    return size === 'compact' || size === 'large' ? size : 'default';
  }

  /** The compact field opens the default panel (DSA-59). */
  private get panelSize(): 'default' | 'large' {
    return this.fieldSize === 'large' ? 'large' : 'default';
  }

  private format(day: Day | null): string {
    return day === null ? '' : formatDay(day, this.order);
  }

  private messageOf(which: Which): string {
    const error = this.errors[which];
    if (error === null) {
      return trimmed(which === 'single' ? this.error : which === 'start' ? this.startError : this.endError);
    }
    const { min, max } = this.limits;
    switch (error.key) {
      case 'required':
        return this.text(which === 'single' ? 'errorRequired' : which === 'start' ? 'errorRequiredStart' : 'errorRequiredEnd');
      case 'invalid':
        return this.text('errorInvalid');
      case 'min':
        return this.text('errorMin', { min: this.format(min) });
      case 'max':
        return this.text('errorMax', { max: this.format(max) });
      case 'between':
        return this.text('errorBetween', { min: this.format(min), max: this.format(max) });
      case 'unavailable':
        return this.text('errorUnavailable');
      default:
        return this.text('errorEndBeforeStart', { start: this.format(error.start) });
    }
  }

  /* ----- value, texts and the form ---------------------------------------------------------- */

  private committed(): Range {
    return this.isRange
      ? { start: parseDay(trimmed(this.start)), end: parseDay(trimmed(this.end)) }
      : { start: parseDay(trimmed(this.value)), end: null };
  }

  private syncTexts(): void {
    const { start, end } = this.committed();
    if (this.isRange) {
      this.texts = { single: '', start: this.format(start), end: this.format(end) };
    } else {
      this.texts = { single: this.format(start), start: '', end: '' };
    }
  }

  private get hasError(): boolean {
    return this.errors.single !== null || this.errors.start !== null || this.errors.end !== null;
  }

  private syncForm(): void {
    if (this.isRange) {
      const data = new FormData();
      const startName = trimmed(this.startName);
      const endName = trimmed(this.endName);
      if (startName !== '' && trimmed(this.start) !== '') data.append(startName, trimmed(this.start));
      if (endName !== '' && trimmed(this.end) !== '') data.append(endName, trimmed(this.end));
      this.internals.setFormValue(data);
    } else {
      const name = trimmed(this.name);
      this.internals.setFormValue(name !== '' && trimmed(this.value) !== '' ? trimmed(this.value) : null);
    }
    const anchor = this.renderRoot.querySelector<HTMLElement>('nph-date-picker-control') ?? undefined;
    const missing =
      this.required && (this.isRange ? trimmed(this.start) === '' || trimmed(this.end) === '' : trimmed(this.value) === '');
    if (this.hasError) {
      this.internals.setValidity({ badInput: true }, this.text('errorInvalid') || ' ', anchor);
    } else if (missing) {
      this.internals.setValidity({ valueMissing: true }, this.text('errorRequired') || ' ', anchor);
    } else {
      this.internals.setValidity({});
    }
  }

  /** The `value`, `start` and `end` attributes are the defaults of `form.reset()`. */
  formResetCallback(): void {
    this.value = this.getAttribute('value') ?? '';
    this.start = this.getAttribute('start') ?? '';
    this.end = this.getAttribute('end') ?? '';
    this.errors = { single: null, start: null, end: null };
    this.syncTexts();
    this.requestUpdate();
  }

  private fire(): void {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  /* ----- typing ---------------------------------------------------------------------------------- */

  private readonly onTextInput = (event: Event): void => {
    event.stopPropagation();
    const target = event.target as HTMLElement & { value: string };
    const which = (target.dataset.field ?? 'single') as Which;
    this.texts[which] = target.value ?? '';
  };

  /** The person left the field, or cleared it: the text is read, checked and, when it is a date, committed (D-4). */
  private readonly onTextChange = (event: Event): void => {
    event.stopPropagation();
    const target = event.target as HTMLElement & { value: string };
    const which = (target.dataset.field ?? 'single') as Which;
    this.commitTyped(which, target.value ?? '');
  };

  private commitTyped(which: Which, text: string): void {
    this.texts[which] = text;
    const parsed = parseTyped(text, this.order);
    const startOfPeriod = which === 'end' ? parseDay(this.open ? this.draft.start : trimmed(this.start)) : undefined;
    const error = checkTyped(parsed, {
      required: this.required,
      limits: this.limits,
      isUnavailable: this.isUnavailable,
      ...(startOfPeriod === undefined ? {} : { start: startOfPeriod }),
    });
    this.errors[which] = error;
    /* A date with a problem is not committed: the value it replaces stays, and the field says what to fix. */
    if (error === null) {
      this.setValueOf(which, parsed.kind === 'date' ? parsed.day : null);
    } else if (error.key === 'required') {
      /* A required field left empty: the value it held is gone, and the field says it is required. */
      this.setValueOf(which, null);
    }
    this.requestUpdate();
  }

  /** Writes the date of one field. With the panel open, a range goes to the draft; otherwise it is committed. */
  private setValueOf(which: Which, day: Day | null): void {
    const iso = day === null ? '' : isoDate(day);
    if (which === 'single') {
      if (trimmed(this.value) !== iso) {
        this.value = iso;
        this.fire();
      }
      this.texts.single = this.format(day);
      if (this.open) this.moveCalendarTo(day);
      return;
    }
    if (this.open) {
      this.draft = { ...this.draft, [which]: iso };
      this.texts[which] = this.format(day);
      this.shortcut = this.matchDraft();
      this.moveCalendarTo(day);
      this.announceDraft();
      return;
    }
    const current = which === 'start' ? trimmed(this.start) : trimmed(this.end);
    if (current !== iso) {
      if (which === 'start') this.start = iso;
      else this.end = iso;
      this.fire();
    }
    this.texts[which] = this.format(day);
  }

  /* ----- the panel: draft, shortcuts and the announcement ----------------------------------------------- */

  private matchDraft(): Shortcut | null {
    return matchShortcut({ start: parseDay(this.draft.start), end: parseDay(this.draft.end) }, this.today, this.limits);
  }

  private announceDraft(): void {
    const start = parseDay(this.draft.start);
    const end = parseDay(this.draft.end);
    if (start === null || end === null) {
      this.announcement = '';
    } else if (start === end) {
      this.announcement = this.longDate(start);
    } else {
      this.announcement = this.text('period', { start: this.longDate(start), end: this.longDate(end) });
    }
  }

  private get calendar(): NphCalendar | null {
    return this.renderRoot.querySelector<NphCalendar>('nph-calendar');
  }

  /** Brings the months of the panel to a day (a shortcut, a typed date). */
  private moveCalendarTo(day: Day | null): void {
    const calendar = this.calendar;
    if (calendar === null || day === null) return;
    calendar.month = isoDate(firstOfMonth(day));
  }

  private readonly onPick = (event: Event): void => {
    const detail = (event as CustomEvent<NphCalendarPickDetail>).detail;
    event.stopPropagation();
    if (!this.isRange) {
      this.setValueOf('single', parseDay(detail.date));
      this.errors.single = null;
      this.closePanel('pick');
      return;
    }
    this.draft = { start: detail.start, end: detail.end };
    this.shortcut = this.matchDraft();
    this.errors.start = null;
    this.errors.end = null;
    this.texts.start = this.format(parseDay(detail.start));
    this.texts.end = this.format(parseDay(detail.end));
    this.announceDraft();
    this.requestUpdate();
  };

  private readonly onMonthChange = (event: Event): void => {
    event.stopPropagation();
  };

  private chooseShortcut(shortcut: Shortcut): void {
    this.activeShortcut = shortcut;
    if (shortcut === 'custom') {
      this.shortcut = 'custom';
      this.requestUpdate();
      this.calendar?.focusDate();
      return;
    }
    const period = shortcutRange(shortcut, this.today, this.limits);
    if (period === null || period.start === null || period.end === null) return;
    this.draft = { start: isoDate(period.start), end: isoDate(period.end) };
    this.shortcut = shortcut;
    this.errors.start = null;
    this.errors.end = null;
    this.texts.start = this.format(period.start);
    this.texts.end = this.format(period.end);
    this.moveCalendarTo(period.start);
    this.announceDraft();
    this.requestUpdate();
  }

  private readonly onShortcutClick = (event: Event): void => {
    const option = (event.currentTarget as NphOption).value as Shortcut;
    if (!shortcutDisabled(option, this.today, this.limits)) this.chooseShortcut(option);
  };

  private readonly onShortcutHover = (event: Event): void => {
    const option = (event.currentTarget as NphOption).value as Shortcut;
    if (!shortcutDisabled(option, this.today, this.limits) && this.activeShortcut !== option) {
      this.activeShortcut = option;
      this.requestUpdate();
    }
  };

  private readonly onListFocus = (): void => {
    if (this.activeShortcut === null) {
      this.activeShortcut = this.shortcut ?? this.enabledShortcuts()[0] ?? null;
    }
    this.requestUpdate();
  };

  private readonly onListBlur = (): void => {
    this.activeShortcut = null;
    this.requestUpdate();
  };

  private enabledShortcuts(): Shortcut[] {
    return SHORTCUTS.filter((shortcut) => !shortcutDisabled(shortcut, this.today, this.limits));
  }

  /** The shortcut list is one Tab stop: the arrows move through it, Enter and Space choose. */
  private readonly onListKeydown = (event: KeyboardEvent): void => {
    const enabled = this.enabledShortcuts();
    const index = this.activeShortcut === null ? -1 : enabled.indexOf(this.activeShortcut);
    let next: Shortcut | undefined;
    switch (event.key) {
      case 'ArrowDown':
        next = enabled[Math.min(index + 1, enabled.length - 1)];
        break;
      case 'ArrowUp':
        next = enabled[Math.max(index - 1, 0)];
        break;
      case 'Home':
        next = enabled[0];
        break;
      case 'End':
        next = enabled[enabled.length - 1];
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.activeShortcut !== null) this.chooseShortcut(this.activeShortcut);
        return;
      default:
        return;
    }
    event.preventDefault();
    if (next !== undefined) {
      this.activeShortcut = next;
      this.requestUpdate();
    }
  };

  private readonly onClear = (): void => {
    this.draft = { start: '', end: '' };
    this.shortcut = null;
    this.announcement = '';
    this.requestUpdate();
  };

  private readonly onCancel = (): void => {
    this.closePanel('cancel');
  };

  /** Apply keeps what is in the panel: only the Start becomes one day; an empty panel applies an empty period (D-10). */
  private readonly onApply = (): void => {
    let { start, end } = this.draft;
    if (start === '' && end !== '') start = end;
    if (end === '' && start !== '') end = start;
    const changed = start !== trimmed(this.start) || end !== trimmed(this.end);
    this.start = start;
    this.end = end;
    this.errors.start = null;
    this.errors.end = null;
    this.syncTexts();
    if (changed) this.fire();
    this.closePanel('apply');
  };

  /* ----- opening and closing --------------------------------------------------------------------------- */

  private get button(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('nph-button.calendar-button');
  }

  private get surface(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('.surface');
  }

  private readonly onButtonClick = (): void => {
    if (this.disabled) return;
    if (this.open) {
      this.closePanel('toggle');
    } else {
      this.open = true;
    }
  };

  /** The panel closes: what was not applied is discarded, as Cancel (the period counts only on Apply). */
  private closePanel(reason: CloseReason): void {
    if (!this.open) return;
    /* Esc, Cancel, Apply, a pick, the button and Tab give the focus back to the button; a press outside leaves it where the person put it. */
    this.returnsFocus = reason !== 'outside';
    if (reason !== 'apply' && reason !== 'pick') {
      this.syncTexts();
      this.errors = { single: this.errors.single, start: null, end: null };
    }
    this.open = false;
  }

  private beforeOpen(): void {
    const { start, end } = this.committed();
    this.draft = { start: start === null ? '' : isoDate(start), end: end === null ? '' : isoDate(end) };
    this.shortcut = this.isRange ? this.matchDraft() : null;
    this.activeShortcut = null;
    this.announcement = '';
    this.narrow = this.isRange && this.computeNarrow();
    this.returnsFocus = false;
  }

  /** A token that is a length, in pixels. */
  private measure(token: string): number {
    const probe = document.createElement('span');
    probe.style.cssText = `position:absolute;visibility:hidden;inline-size:var(${token});`;
    this.renderRoot.append(probe);
    const value = probe.getBoundingClientRect().width;
    probe.remove();
    return value;
  }

  /**
   * D-7: the range shows one month, the shortcuts on top, when the width available does not fit the panel of the size in use
   * plus the page margin, not at a fixed breakpoint. The panel is the shortcut column (12 steps of `space/container-padding`) and two
   * grids; the page margin is `space/container-padding` on each side (D-14).
   */
  private computeNarrow(): boolean {
    const cell = this.measure(this.panelSize === 'large' ? '--nph-control-height-large' : '--nph-control-height-default');
    const padding = this.measure('--nph-space-container-padding');
    const border = this.measure('--nph-border-width');
    const panel = 12 * padding + 2 * (7 * cell + 2 * padding) + 2 * border;
    return document.documentElement.clientWidth < panel + 2 * padding;
  }

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if ((event.key !== 'Escape' && event.key !== 'Esc') || !this.open || event.defaultPrevented) return;
    event.stopPropagation();
    event.preventDefault();
    /* Esc in the panel gives the focus to the button; Esc in the field leaves it in the field. */
    const active = this.shadowRoot?.activeElement ?? null;
    this.closePanel(this.surface !== null && active !== null && this.surface.contains(active) ? 'escape' : 'outside');
  };

  /** A press outside closes like Cancel, without moving the focus; a press in the field is not outside (D-4). */
  private readonly onDocumentPointerdown = (event: PointerEvent): void => {
    if (!this.open || event.composedPath().includes(this)) return;
    this.closePanel('outside');
  };

  /** Tab after the last item leaves the panel: it closes like Cancel and the focus goes back to the button. */
  private readonly onSurfaceFocusout = (event: FocusEvent): void => {
    if (!this.open) return;
    const next = event.relatedTarget;
    /* No target and no Tab: the window lost the focus, or the element left the page; nothing moved to somewhere else. */
    if (!(next instanceof Node) && !this.tabbing) return;
    if (next instanceof Node && this.shadowRoot?.contains(next) === true) return;
    this.closePanel('tab');
  };

  /** A Tab forward is on its way: a focus that leaves the panel with no target is the page's end, and the panel closes. */
  private readonly onSurfaceKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab' || event.shiftKey) return;
    this.tabbing = true;
    window.setTimeout(() => {
      this.tabbing = false;
    }, 0);
  };

  private show(surface: HTMLElement): void {
    const reopening = this.closeTimer !== undefined;
    surface.inert = false;
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      this.shown = true;
      try {
        surface.showPopover();
      } catch {
        /* Not connected, or already showing: nothing to do. */
      }
      document.addEventListener('keydown', this.onDocumentKeydown);
      document.addEventListener('pointerdown', this.onDocumentPointerdown, true);
      window.addEventListener('scroll', this.onViewportChange, true);
      window.addEventListener('resize', this.onViewportChange);
      this.resizeObserver = new ResizeObserver(() => this.onViewportChange());
      this.resizeObserver.observe(surface);
      this.updateScrollTargets();
      this.place(surface);
      /* The first style is the closed one; the next one starts the enter transition. */
      void surface.offsetWidth;
    } else if (reopening) {
      this.place(surface);
    }
    surface.setAttribute('data-open', '');
    void this.focusIn(this.openedByMarkup);
    this.openedByMarkup = false;
  }

  /**
   * Opening: the focus goes to a day (the date of the field, or today, or the nearest allowed day). A panel the markup opened
   * is drawn and placed, and takes no focus: the person did not ask for it.
   */
  private async focusIn(quiet: boolean): Promise<void> {
    await this.updateComplete;
    const calendar = this.calendar;
    if (calendar === null) return;
    await calendar.updateComplete;
    const surface = this.surface;
    if (surface !== null) this.place(surface);
    if (!quiet) calendar.focusDate();
  }

  private hide(surface: HTMLElement): void {
    surface.removeAttribute('data-open');
    if (this.closeTimer !== undefined || !this.shown) return;
    this.returnFocus();
    surface.inert = true;
    const duration = parseFloat(getComputedStyle(surface).transitionDuration) * 1000;
    if (!(duration > 0)) {
      this.hideNow();
      return;
    }
    this.closeTimer = window.setTimeout(() => {
      this.closeTimer = undefined;
      this.hideNow();
    }, duration);
  }

  /**
   * The focus goes back to the calendar button (in the range, the End button) when the person closed the panel from inside it, and
   * when it was inside the panel for any other close; a press outside leaves it where the person put it.
   */
  private returnFocus(): void {
    const asked = this.returnsFocus;
    this.returnsFocus = false;
    const active = this.shadowRoot?.activeElement ?? null;
    const inside = this.surface !== null && active !== null && this.surface.contains(active);
    if (asked || inside) {
      this.button?.focus();
    }
  }

  private hideNow(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    document.removeEventListener('keydown', this.onDocumentKeydown);
    document.removeEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.clearScrollTargets();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.shown = false;
    const surface = this.surface;
    if (surface) {
      surface.removeAttribute('data-open');
      try {
        surface.hidePopover();
      } catch {
        /* Already hidden. */
      }
    }
    this.surfaceDrawn = false;
    this.requestUpdate();
  }

  /** Every ancestor of the field in the flat tree: the scroll of an element inside a shadow root does not reach `window`. */
  private updateScrollTargets(): void {
    this.clearScrollTargets();
    let node: Node | null = this;
    while (node !== null) {
      if (node instanceof Element || node instanceof ShadowRoot) {
        node.addEventListener('scroll', this.onViewportChange, true);
        this.scrollTargets.push(node);
      }
      node = node instanceof ShadowRoot ? node.host : ((node as Element).assignedSlot ?? node.parentNode);
    }
  }

  private clearScrollTargets(): void {
    for (const target of this.scrollTargets) {
      target.removeEventListener('scroll', this.onViewportChange, true);
    }
    this.scrollTargets.length = 0;
  }

  private readonly onViewportChange = (): void => {
    if (this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      const surface = this.surface;
      if (surface && this.shown) this.place(surface);
    });
  };

  /** The rectangle of the trigger: the control rows of the fields, from the first to the last (the panel opens below the field). */
  private anchorRect(): DOMRect {
    const rows = [...this.renderRoot.querySelectorAll<HTMLElement>('nph-date-picker-control')];
    const rects = rows.map((row) => row.getBoundingClientRect());
    if (rects.length === 0) return this.getBoundingClientRect();
    const left = Math.min(...rects.map((rect) => rect.left));
    const right = Math.max(...rects.map((rect) => rect.right));
    const top = Math.min(...rects.map((rect) => rect.top));
    const bottom = Math.max(...rects.map((rect) => rect.bottom));
    return new DOMRect(left, top, right - left, bottom - top);
  }

  /**
   * Below the field, aligned to its start, `date-picker/panel-offset` away; above with the same gap when it does not fit below and
   * the room above is larger; when neither fits, it keeps the larger side and shrinks, with an inner scroll.
   */
  private place(surface: HTMLElement): void {
    const anchor = this.anchorRect();
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    const visible = anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width;
    surface.style.visibility = visible ? '' : 'hidden';
    if (!visible) return;
    const gap = this.measure('--nph-date-picker-panel-offset');
    surface.style.maxBlockSize = '';
    surface.style.maxInlineSize = `${view.width}px`;
    surface.style.top = '0px';
    surface.style.left = '0px';
    surface.removeAttribute('data-scroll');
    const { width, height } = surface.getBoundingClientRect();
    const below = view.height - anchor.bottom - gap;
    const above = anchor.top - gap;
    const side = height > below && above > below ? 'top' : 'bottom';
    const room = Math.max(side === 'bottom' ? below : above, 0);
    let used = height;
    if (height > room) {
      surface.style.maxBlockSize = `${room}px`;
      surface.setAttribute('data-scroll', '');
      used = room;
    }
    surface.setAttribute('data-side', side);
    const rtl = getComputedStyle(this).direction === 'rtl';
    let x = rtl ? anchor.right - width : anchor.left;
    x = Math.min(Math.max(x, 0), Math.max(view.width - width, 0));
    const y = side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - used;
    surface.style.left = `${x}px`;
    surface.style.top = `${Math.max(y, 0)}px`;
  }

  /* ----- validation and lifecycle ------------------------------------------------------------------------ */

  private report(causes: string[]): void {
    for (const cause of causes) {
      if (!this.reported.includes(cause)) {
        devError(`${cause} Nothing was drawn.`);
      }
    }
    this.reported = causes;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.order = dateOrderOf(this.language());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.hideNow();
  }

  protected override willUpdate(changed: PropertyValues): void {
    const causes: string[] = [];
    const mode = trimmed(this.mode);
    if (!oneOf(NPH_DATE_PICKER_MODES, mode)) causes.push(`mode "${this.mode}" does not exist. Use ${NPH_DATE_PICKER_MODES.join(' or ')}.`);
    const size = trimmed(this.size);
    if (!oneOf(NPH_DATE_PICKER_SIZES, size)) causes.push(`size "${this.size}" does not exist. Use ${NPH_DATE_PICKER_SIZES.join(', ')}.`);
    const weekStart = trimmed(this.weekStart);
    if (!oneOf(NPH_CALENDAR_WEEK_STARTS, weekStart)) {
      causes.push(`week-start "${this.weekStart}" does not exist. Use ${NPH_CALENDAR_WEEK_STARTS.join(' or ')}.`);
    }
    for (const name of ['value', 'start', 'end', 'min', 'max', 'now'] as const) {
      const text = trimmed(this[name]);
      if (text !== '' && parseDay(text) === null) causes.push(`${name} "${text}" is not a date written as YYYY-MM-DD.`);
    }
    this.valid = causes.length === 0;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    this.report(causes);

    if (this.valid && !this.missingReported) {
      const labels = (this.labels ?? {}) as Record<string, unknown>;
      const missing = NPH_DATE_PICKER_LABEL_KEYS.filter((key) => trimmed(labels[key]) === '');
      if (missing.length > 0) {
        this.missingReported = true;
        devError(`labels is missing ${missing.join(', ')}: each one is a text the piece owes and renders without.`);
      }
    }

    if (!this.valid) return;
    if (!this.hasUpdated || changed.has('value') || changed.has('start') || changed.has('end') || changed.has('mode')) {
      this.order = dateOrderOf(this.language());
      this.syncTexts();
    }
    if (changed.has('open')) {
      if (this.open && (this.disabled || !this.isConnected)) {
        this.open = false;
      } else if (this.open) {
        this.openedByMarkup = !this.hasUpdated;
        this.surfaceDrawn = true;
        this.beforeOpen();
      }
    }
    if (changed.has('disabled') && this.disabled && this.open) {
      this.open = false;
    }
  }

  protected override updated(changed: PropertyValues): void {
    if (this.valid) this.syncForm();
    if (!changed.has('open')) return;
    const surface = this.surface;
    if (surface === null) return;
    if (this.open) {
      this.show(surface);
    } else if (changed.get('open') === true) {
      this.hide(surface);
    }
  }

  /** The focus goes to the first text of the picker. */
  override focus(options?: FocusOptions): void {
    this.renderRoot.querySelector<HTMLElement>('nph-date-picker-control')?.focus(options);
  }

  /* ----- drawing ---------------------------------------------------------------------------------------- */

  private fieldLabel(which: Which): string {
    return which === 'single' ? this.label : which === 'start' ? this.startLabel : this.endLabel;
  }

  private renderField(which: Which): TemplateResult {
    const hint = this.text('hint');
    const withButton = which !== 'start';
    const expanded = this.open;
    return html`<nph-field
      class="field"
      .label=${this.fieldLabel(which)}
      .help=${hint}
      .error=${this.messageOf(which)}
      .required=${this.required}
      .disabled=${this.disabled}
    >
      <nph-date-picker-control>
        <nph-input
          class="text"
          type="text"
          data-field=${which}
          size=${this.fieldSize}
          placeholder=${hint}
          autocomplete="off"
          icon-end="xmark"
          clear-label=${this.text('clearDate')}
          .value=${live(this.texts[which])}
          @input=${this.onTextInput}
          @change=${this.onTextChange}
        ></nph-input>
        ${withButton
          ? html`<nph-button
              class="calendar-button"
              severity="secondary"
              emphasis="ghost"
              shape="square"
              size=${this.fieldSize}
              icon-start="calendar"
              label=${this.text('openCalendar')}
              aria-haspopup="dialog"
              aria-expanded=${expanded ? 'true' : 'false'}
              @click=${this.onButtonClick}
            ></nph-button>`
          : nothing}
      </nph-date-picker-control>
    </nph-field>`;
  }

  private calendarLabels(): NphCalendarLabels {
    return {
      previousMonth: this.text('previousMonth'),
      nextMonth: this.text('nextMonth'),
      previousYear: this.text('previousYear'),
      nextYear: this.text('nextYear'),
      previousYears: this.text('previousYears'),
      nextYears: this.text('nextYears'),
      today: this.text('today'),
      selected: this.text('selected'),
      unavailable: this.text('unavailable'),
    };
  }

  private renderCalendar(): TemplateResult {
    const range = this.isRange;
    const months = range && !this.narrow ? 2 : 1;
    return html`<nph-calendar
      class="calendar"
      mode=${range ? 'range' : 'single'}
      size=${this.panelSize}
      months=${months}
      week-start=${trimmed(this.weekStart) === 'monday' ? 'monday' : 'sunday'}
      .now=${trimmed(this.now)}
      .min=${trimmed(this.min)}
      .max=${trimmed(this.max)}
      .unavailable=${this.unavailable}
      .labels=${this.calendarLabels()}
      .value=${range ? '' : trimmed(this.value)}
      .start=${range ? this.draft.start : ''}
      .end=${range ? this.draft.end : ''}
      @nph-pick=${this.onPick}
      @nph-month-change=${this.onMonthChange}
    ></nph-calendar>`;
  }

  private renderShortcuts(): TemplateResult {
    const limits = this.limits;
    const today = this.today;
    return html`<div
      class="shortcuts"
      role="listbox"
      tabindex="0"
      aria-label=${this.text('shortcuts')}
      aria-activedescendant=${this.activeShortcut === null ? nothing : `shortcut-${this.activeShortcut}`}
      @keydown=${this.onListKeydown}
      @focus=${this.onListFocus}
      @blur=${this.onListBlur}
    >
      ${SHORTCUTS.map(
        (shortcut) => html`<nph-option
          id=${`shortcut-${shortcut}`}
          class="shortcut"
          .value=${shortcut}
          ?disabled=${shortcutDisabled(shortcut, today, limits)}
          .selected=${this.shortcut === shortcut}
          .active=${this.activeShortcut === shortcut}
          @click=${this.onShortcutClick}
          @pointermove=${this.onShortcutHover}
          >${this.text(SHORTCUT_LABEL[shortcut])}</nph-option
        >`,
      )}
    </div>`;
  }

  private renderFooter(): TemplateResult {
    const size = this.panelSize === 'large' ? 'default' : 'compact';
    return html`<nph-separator class="divider"></nph-separator>
      <div class="footer">
        <nph-button class="clear" severity="secondary" emphasis="ghost" size=${size} text=${this.text('clear')} @click=${this.onClear}></nph-button>
        <div class="actions">
          <nph-button class="cancel" severity="secondary" emphasis="solid" size=${size} text=${this.text('cancel')} @click=${this.onCancel}></nph-button>
          <nph-button class="apply" severity="primary" emphasis="solid" size=${size} text=${this.text('apply')} @click=${this.onApply}></nph-button>
        </div>
      </div>`;
  }

  private renderSurface(): TemplateResult | typeof nothing {
    if (!this.surfaceDrawn) {
      return html`<div class="surface" popover="manual"></div>`;
    }
    const range = this.isRange;
    return html`<div
      class="surface"
      popover="manual"
      role="dialog"
      aria-label=${range ? this.text('dialogPeriod') : this.text('dialogDate')}
      data-mode=${range ? (this.narrow ? 'narrow' : 'range') : 'single'}
      data-size=${this.panelSize}
      @focusout=${this.onSurfaceFocusout}
      @keydown=${this.onSurfaceKeydown}
    >
      ${range
        ? html`<div class="body">${this.renderShortcuts()}${this.renderCalendar()}</div>${this.renderFooter()}`
        : this.renderCalendar()}
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    return html`<div class="trigger">${this.isRange ? [this.renderField('start'), this.renderField('end')] : this.renderField('single')}</div>
      ${this.renderSurface()}
      <div class="status" role="status" aria-live="polite">${this.announcement}</div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphDatePicker);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-date-picker': NphDatePicker;
  }
}
