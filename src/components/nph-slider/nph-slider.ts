/**
 * `nph-slider` — the control that picks a value, or a range, on a continuous scale of numbers.
 *
 * Contract accepted in Figma (board `1636:46`, documentation frame `1925:642`, set `1636:44`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-39, sheet
 * `fichas/nph-slider.md`, `design.md` and decision P94 — nph-slider: API and semantics. The
 * form pattern is P80 and the field contract is P83:
 * - `orientation`: `horizontal` (default) or `vertical`, reflected. In the vertical one the
 *   minimum is at the bottom, and only `text` and `limits` exist;
 * - `mode` (the Figma `tipo`): `single` (default), one thumb, or `range`, two thumbs, start and
 *   end. Reflected, because the internal CSS selects the parts by it;
 * - `min` (0), `max` (100) and `step` (1): the scale. Every value is rounded to the step and kept
 *   inside the scale, as the native range does;
 * - `value` (single), `start` and `end` (range): the current values. The ATTRIBUTE is the
 *   initial value and the value of `form.reset()`, as in `nph-input` (P80): it applies only while
 *   the person has not moved the slider and setting the property has not made it dirty. The
 *   default of `value` is the middle of the scale, as the native range; `start` and `end` start at
 *   the ends;
 * - `text` (the Figma `rótulo e valor`): the visible label, drawn by an `nph-label`, with the
 *   current value beside it, above the track. Empty turns the part off. Off inside `nph-field`,
 *   which already gives the label;
 * - `limits` (`mínimo e máximo`), `marks` (`marcas`), `inputs` (`campo`) and `steppers`
 *   (`menos e mais`): Booleans that turn the optional parts on. `marks`, `inputs` and `steppers`
 *   exist only in the horizontal orientation;
 * - `start-label` and `end-label`: in `range`, the accessible name of each thumb and of its field;
 * - `decrease-label` and `increase-label`: the accessible names of the minus and plus buttons,
 *   required with `steppers`;
 * - `label`, `description`, `invalid`, `required` and `disabled`: the field contract (P83).
 *   `label` is the accessible name in text, never visible; `description` is read as the
 *   description of each thumb; `invalid` draws the `erro` state; `required` has no effect, since a
 *   slider always has a value; `disabled` fades the whole slider once and wins over `invalid`.
 *   The field and the buttons inside keep their resting look and become inert, so the
 *   slider fades once and not twice;
 * - `name`, reflected: the form reads the attribute of the host. `single` contributes
 *   `name=value`; `range` contributes two entries under the same name, start and end;
 * - events: the native `input`, while the value moves, and `change`, when it settles. Setting a
 *   value from code fires neither;
 * - no slot, no `::part`, no color property.
 *
 * WHY EACH THUMB IS A `role="slider"` OF ITS OWN — the value balloon is an `nph-tooltip`, which
 * attaches only to an element that receives focus and sits by the box of that element (P77). A
 * native `<input type="range">` receives focus as a whole track, so its balloon would sit in the
 * middle of the track and never follow the value. The thumb is the focusable element: the balloon
 * sits above it and follows it. The keyboard, the pointer and the ARIA values are the piece's
 * own, after the slider pattern of the WAI-ARIA Authoring Practices.
 *
 * Invalid input: an `orientation` or a `mode` outside the values, a `min` that is not below `max`
 * and a `step` that is not a positive number render nothing and emit one `console.error` each,
 * only in development (P21 rule). A part outside its orientation, and `steppers` without its two
 * names, are not drawn, with one error each; the rest renders. A slider with no accessible name
 * renders and warns once in development: the label may arrive after the first render.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-input/nph-input';
import '../nph-label/nph-label';
import '../nph-tooltip/nph-tooltip';
import labelCss from '../nph-label/nph-label.css?inline';
import sliderCss from './nph-slider.css?inline';

const TAG = 'nph-slider';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_SLIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type NphSliderOrientation = (typeof NPH_SLIDER_ORIENTATIONS)[number];

/** The Figma `tipo`: `simples` and `intervalo`. */
export const NPH_SLIDER_MODES = ['single', 'range'] as const;
export type NphSliderMode = (typeof NPH_SLIDER_MODES)[number];

/** The `id` of each thumb inside the shadow root: the tooltips point at them. */
const THUMB_IDS = ['thumb-start', 'thumb-end'] as const;

type Index = 0 | 1;

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

/** Development warning, for a composition that still renders. */
function devWarn(message: string): void {
  if (import.meta.env?.DEV) {
    console.warn(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/** The digits after the point, so `0.1 + 0.2` is written `0.3`. */
function decimals(value: number): number {
  const [mantissa = '', exponent] = String(value).split('e-');
  const fraction = mantissa.split('.')[1]?.length ?? 0;
  return exponent === undefined ? fraction : fraction + Number(exponent);
}

/** A number written by an attribute or typed in a field; anything else is `null`. */
function parse(text: string | null | undefined): number | null {
  if (text === null || text === undefined) {
    return null;
  }
  const trimmed = text.trim();
  if (trimmed === '') {
    return null;
  }
  /* A comma alone is a decimal comma, as a person types it in pt-BR or es. */
  const number = Number(trimmed.includes('.') ? trimmed : trimmed.replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

export class NphSlider extends LitElement {
  static override styles = [unsafeCSS(labelCss), unsafeCSS(sliderCss)];

  /* Host focus, and a click on the label of `nph-field`, go to the first thumb. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* The host takes part in the form: labelable, with a value of its own. */
  static formAssociated = true;

  static override properties = {
    /* `orientation` and `mode` reflect because the internal CSS selects the parts by them. */
    orientation: { type: String, reflect: true },
    mode: { type: String, reflect: true },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    /* The `value`, `start` and `end` attributes are the defaults, read by hand (see `attributeChangedCallback`). */
    value: { attribute: false, noAccessor: true },
    start: { attribute: false, noAccessor: true },
    end: { attribute: false, noAccessor: true },
    /* `name` reflects because the form reads the attribute of the host, not the property. */
    name: { type: String, reflect: true },
    text: { type: String },
    limits: { type: Boolean },
    marks: { type: Boolean },
    inputs: { type: Boolean },
    steppers: { type: Boolean },
    startLabel: { type: String, attribute: 'start-label' },
    endLabel: { type: String, attribute: 'end-label' },
    decreaseLabel: { type: String, attribute: 'decrease-label' },
    increaseLabel: { type: String, attribute: 'increase-label' },
    label: { type: String },
    description: { type: String },
    /* The reflected booleans are read by the internal CSS and by the consumer's selectors. */
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
  };

  declare orientation: string;
  declare mode: string;
  /** The lowest value of the scale. */
  declare min: number;
  /** The highest value of the scale. */
  declare max: number;
  /** The distance between two values the slider stops on. */
  declare step: number;
  /** Name of the entry in the form data. */
  declare name: string | null;
  /** The visible label, with the current value beside it. Already localized. */
  declare text: string;
  declare limits: boolean;
  declare marks: boolean;
  declare inputs: boolean;
  declare steppers: boolean;
  /** In `range`, the accessible name of the start thumb and of its field. Already localized. */
  declare startLabel: string;
  /** In `range`, the accessible name of the end thumb and of its field. Already localized. */
  declare endLabel: string;
  /** Accessible name of the minus button. Required with `steppers`. */
  declare decreaseLabel: string;
  /** Accessible name of the plus button. Required with `steppers`. */
  declare increaseLabel: string;
  /** Accessible name in text, never visible. An associated label wins over it. */
  declare label: string;
  /** Accessible description in text, never visible: the help or the error sentence. */
  declare description: string;
  /** Written by `nph-field` (P83). A slider always has a value, so it has no effect. */
  declare required: boolean;
  declare disabled: boolean;
  declare invalid: boolean;

  private readonly internals: ElementInternals;
  private readonly labelObserver = new MutationObserver(() => this.syncName());
  /** The values asked for, by the attribute, by code or by the person; `null` is the default. */
  private asked: { value: number | null; start: number | null; end: number | null } = {
    value: null,
    start: null,
    end: null,
  };
  /** Moved by the person or set by code: the attributes no longer apply. */
  private dirty = false;
  private valid = false;
  /** The thumb the minus and plus buttons move: the last one used. */
  private active: Index = 0;
  /** The pointer that moves a thumb, from the press to the release. */
  private drag: { pointer: number; index: Index; from: number } | null = null;
  /** After the first frame, a label rendered by another element has had its chance. */
  private settled = false;
  private warned = new Set<string>();

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.orientation = 'horizontal';
    this.mode = 'single';
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.name = null;
    this.text = '';
    this.limits = false;
    this.marks = false;
    this.inputs = false;
    this.steppers = false;
    this.startLabel = '';
    this.endLabel = '';
    this.decreaseLabel = '';
    this.increaseLabel = '';
    this.label = '';
    this.description = '';
    this.required = false;
    this.disabled = false;
    this.invalid = false;
    this.addEventListener('focusin', () => this.syncName());
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.labelObserver.observe(this.getRootNode(), {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['for', 'id'],
    });
  }

  override disconnectedCallback(): void {
    this.labelObserver.disconnect();
    this.endDrag();
    super.disconnectedCallback();
  }

  /* --- Scale and values ------------------------------------------------------ */

  private get single(): boolean {
    return (this.mode ?? '').trim() !== 'range';
  }

  private get horizontal(): boolean {
    return (this.orientation ?? '').trim() !== 'vertical';
  }

  /** The digits the values are written with: those of `min` and of `step`. */
  private get precision(): number {
    return Math.max(decimals(this.min), decimals(this.step));
  }

  /** Rounds to the step and keeps the value inside the scale, as the native range does. */
  private snap(value: number): number {
    const { min, max, step } = this;
    const inside = Math.min(Math.max(value, min), max);
    let snapped = min + Math.round((inside - min) / step) * step;
    if (snapped > max) {
      snapped -= step;
    }
    return Number(snapped.toFixed(this.precision));
  }

  /** The highest value the slider stops on. */
  private get top(): number {
    return this.snap(this.max);
  }

  /** The values of the thumbs: one in `single`, start and end in `range`. */
  private get values(): [number, number] {
    if (!this.valid) {
      return [0, 0];
    }
    if (this.single) {
      const value = this.snap(this.asked.value ?? this.min + (this.max - this.min) / 2);
      return [value, value];
    }
    const end = this.snap(this.asked.end ?? this.max);
    const start = Math.min(this.snap(this.asked.start ?? this.min), end);
    return [start, end];
  }

  /** The current value, in `single`. Setting it from code fires nothing. */
  get value(): number {
    return this.values[0];
  }

  set value(next: number) {
    this.setAsked('value', next);
  }

  /** The start of the range, in `range`. Setting it from code fires nothing. */
  get start(): number {
    return this.values[0];
  }

  set start(next: number) {
    this.setAsked('start', next);
  }

  /** The end of the range, in `range`. Setting it from code fires nothing. */
  get end(): number {
    return this.values[1];
  }

  set end(next: number) {
    this.setAsked('end', next);
  }

  private setAsked(key: 'value' | 'start' | 'end', next: unknown): void {
    const old = this[key];
    this.asked = { ...this.asked, [key]: typeof next === 'number' && Number.isFinite(next) ? next : parse(String(next)) };
    this.dirty = true;
    this.syncFormState();
    this.requestUpdate(key, old);
  }

  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'value', 'start', 'end'];
  }

  override attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    super.attributeChangedCallback(name, old, next);
    if ((name === 'value' || name === 'start' || name === 'end') && !this.dirty) {
      this.applyDefaults();
    }
  }

  /** The `value`, `start` and `end` attributes, as the default values. */
  private applyDefaults(): void {
    this.asked = {
      value: parse(this.getAttribute('value')),
      start: parse(this.getAttribute('start')),
      end: parse(this.getAttribute('end')),
    };
    this.syncFormState();
    this.requestUpdate();
  }

  /* --- The native surface of a form control --------------------------------- */

  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  get labels(): NodeList {
    return this.internals.labels;
  }

  formResetCallback(): void {
    this.dirty = false;
    this.applyDefaults();
  }

  formDisabledCallback(): void {
    this.requestUpdate();
  }

  formStateRestoreCallback(state: string | File | FormData | null): void {
    if (typeof state !== 'string') {
      return;
    }
    const [first, second] = state.split(' ').map((part) => parse(part));
    if (this.single) {
      this.value = first ?? this.value;
    } else {
      this.start = first ?? this.start;
      this.end = second ?? this.end;
    }
  }

  /* --- Validation of the input ---------------------------------------------- */

  protected override willUpdate(changed: PropertyValues): void {
    const decisive = ['orientation', 'mode', 'min', 'max', 'step', 'steppers', 'decreaseLabel', 'increaseLabel', 'marks', 'inputs'];
    if (!decisive.some((name) => changed.has(name))) {
      return;
    }
    const orientation = (this.orientation ?? '').trim();
    const mode = (this.mode ?? '').trim();
    let valid = true;

    if (!oneOf(NPH_SLIDER_ORIENTATIONS, orientation)) {
      devError(`orientation "${orientation}" does not exist. Use ${NPH_SLIDER_ORIENTATIONS.join(' or ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_SLIDER_MODES, mode)) {
      devError(`mode "${mode}" does not exist. Use ${NPH_SLIDER_MODES.join(' or ')}.`);
      valid = false;
    }
    if (!Number.isFinite(this.min) || !Number.isFinite(this.max) || this.min >= this.max) {
      devError(`min (${this.min}) must be a number below max (${this.max}).`);
      valid = false;
    }
    if (!Number.isFinite(this.step) || this.step <= 0) {
      devError(`step (${this.step}) must be a number above zero.`);
      valid = false;
    }
    if (valid && orientation === 'vertical') {
      for (const part of ['marks', 'inputs', 'steppers'] as const) {
        if (this[part]) {
          devError(`${part} exists only in the horizontal orientation; it was not drawn.`);
        }
      }
    }
    if (valid && this.steppers && orientation === 'horizontal' && (this.trim(this.decreaseLabel) === '' || this.trim(this.increaseLabel) === '')) {
      devError('steppers needs decrease-label and increase-label as the accessible names of the buttons; the buttons were not drawn.');
    }

    this.valid = valid;
    this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
  }

  /* --- Composition warnings ---------------------------------------------------- */

  private warnOnce(key: string, active: boolean, message: string): void {
    if (!active) {
      this.warned.delete(key);
    } else if (!this.warned.has(key)) {
      this.warned.add(key);
      devWarn(message);
    }
  }

  private checkComposition(): void {
    if (!this.valid) {
      return;
    }
    const inField = this.closest('nph-field') !== null;
    this.warnOnce('text-in-field', inField && this.trim(this.text) !== '', 'text inside nph-field draws the label twice: leave the label to the field.');
    this.warnOnce('limits-with-marks', this.horizontal && this.limits && this.marks, 'limits with marks repeats the ends: the marks already show them.');
    this.warnOnce(
      'range-names',
      !this.single && (this.trim(this.startLabel) === '' || this.trim(this.endLabel) === ''),
      'a range needs start-label and end-label: each thumb has a name of its own.',
    );
  }

  /* --- The person moves the slider ------------------------------------------- */

  private trim(text: string | null | undefined): string {
    return (text ?? '').trim();
  }

  private get inactive(): boolean {
    return this.disabled || this.disabledByFieldset;
  }

  private get disabledByFieldset(): boolean {
    let ancestor = this.parentElement;
    while (ancestor !== null) {
      if (ancestor.localName === 'fieldset' && ancestor.hasAttribute('disabled')) {
        const firstLegend = [...ancestor.children].find((child) => child.localName === 'legend');
        if (firstLegend === undefined || !firstLegend.contains(this)) {
          return true;
        }
      }
      ancestor = ancestor.parentElement;
    }
    return false;
  }

  private thumb(index: Index): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>(`#${THUMB_IDS[index]}`) ?? null;
  }

  /** The values a thumb may take: in `range`, each thumb stops at the other. */
  private bounds(index: Index): [number, number] {
    const [start, end] = this.values;
    if (this.single) {
      return [this.min, this.top];
    }
    return index === 0 ? [this.min, end] : [start, this.top];
  }

  /**
   * Moves one thumb, as the person does: the value is rounded, kept inside its bounds and,
   * when it changes, the host fires `input`; `settle` fires `change` too.
   */
  private move(index: Index, next: number, settle: boolean): void {
    const [low, high] = this.bounds(index);
    const value = Math.min(Math.max(this.snap(next), low), high);
    this.active = index;
    if (value === this.values[index]) {
      return;
    }
    const key = this.single ? 'value' : index === 0 ? 'start' : 'end';
    const old = this.values[index];
    this.asked = { ...this.asked, [key]: value };
    this.dirty = true;
    this.syncFormState();
    this.requestUpdate(key, old);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    if (settle) {
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /** One tenth of the scale, rounded to the step, and never less than one step. */
  private get bigStep(): number {
    const steps = Math.max(1, Math.round((this.max - this.min) / 10 / this.step));
    return steps * this.step;
  }

  private onKeydown(index: Index, event: KeyboardEvent): void {
    if (this.inactive) {
      return;
    }
    const value = this.values[index];
    const [low, high] = this.bounds(index);
    const next: Record<string, number> = {
      ArrowRight: value + this.step,
      ArrowUp: value + this.step,
      ArrowLeft: value - this.step,
      ArrowDown: value - this.step,
      PageUp: value + this.bigStep,
      PageDown: value - this.bigStep,
      Home: low,
      End: high,
    };
    const target = next[event.key];
    if (target === undefined) {
      return;
    }
    event.preventDefault();
    this.move(index, target, true);
  }

  private onThumbFocus(index: Index): void {
    this.active = index;
  }

  /** The value under the pointer, read from the track. */
  private valueAt(event: PointerEvent): number | null {
    const track = this.renderRoot?.querySelector<HTMLElement>('.track');
    if (!track) {
      return null;
    }
    const box = track.getBoundingClientRect();
    const length = this.horizontal ? box.width : box.height;
    if (length === 0) {
      return null;
    }
    const ratio = this.horizontal ? (event.clientX - box.left) / length : (box.bottom - event.clientY) / length;
    return this.min + Math.min(Math.max(ratio, 0), 1) * (this.max - this.min);
  }

  /** The thumb a press moves: the only one, or the nearest; on a tie, the one on the side of the press. */
  private nearest(value: number): Index {
    if (this.single) {
      return 0;
    }
    const [start, end] = this.values;
    const toStart = Math.abs(value - start);
    const toEnd = Math.abs(value - end);
    if (toStart === toEnd) {
      return value > end ? 1 : 0;
    }
    return toStart < toEnd ? 0 : 1;
  }

  private onPointerDown(event: PointerEvent): void {
    if (this.inactive || event.button !== 0 || this.drag !== null) {
      return;
    }
    const value = this.valueAt(event);
    if (value === null) {
      return;
    }
    const index = this.nearest(value);
    const track = event.currentTarget as HTMLElement;
    event.preventDefault();
    track.setPointerCapture?.(event.pointerId);
    this.drag = { pointer: event.pointerId, index, from: this.values[index] };
    this.thumb(index)?.focus();
    this.move(index, value, false);
    this.requestUpdate();
  }

  private onPointerMove(event: PointerEvent): void {
    if (this.drag === null || event.pointerId !== this.drag.pointer) {
      return;
    }
    const value = this.valueAt(event);
    if (value !== null) {
      this.move(this.drag.index, value, false);
    }
  }

  private onPointerUp(event: PointerEvent): void {
    if (this.drag === null || event.pointerId !== this.drag.pointer) {
      return;
    }
    const { index, from } = this.drag;
    this.endDrag();
    if (this.values[index] !== from && this.isConnected) {
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  private endDrag(): void {
    if (this.drag !== null) {
      this.drag = null;
      this.requestUpdate();
    }
  }

  /** Minus and plus move the last thumb used by one step. */
  private stepBy(direction: 1 | -1): void {
    if (this.inactive) {
      return;
    }
    const index = this.single ? 0 : this.active;
    this.move(index, this.values[index] + direction * this.step, true);
  }

  /** The field takes the number on `change`; a text that is not a number goes back to the value. */
  private onFieldChange(index: Index, event: Event): void {
    const field = event.currentTarget as HTMLInputElement;
    const typed = parse(field.value);
    if (typed !== null) {
      this.move(index, typed, true);
    }
    field.value = String(this.values[index]);
  }

  /** The `input` of the inner field is the person typing, not a new value of the slider. */
  private stopFieldInput(event: Event): void {
    event.stopPropagation();
  }

  /* --- Form value and accessible name ------------------------------------------- */

  protected override firstUpdated(): void {
    requestAnimationFrame(() => {
      this.settled = true;
      this.syncName();
    });
  }

  protected override updated(): void {
    this.syncFormState();
    this.checkComposition();
  }

  private syncFormState(): void {
    if (!this.valid) {
      this.internals.setFormValue(null);
      return;
    }
    const [start, end] = this.values;
    if (this.single) {
      this.internals.setFormValue(String(start), String(start));
      return;
    }
    const name = this.trim(this.name);
    const data = new FormData();
    if (name !== '') {
      data.append(name, String(start));
      data.append(name, String(end));
    }
    this.internals.setFormValue(data, `${start} ${end}`);
  }

  /**
   * The thumb of `single`, or the group of the two thumbs of `range`, is named by the labels
   * associated with the host (P80), or by `label`, or by `text`.
   */
  private syncName(): void {
    const named = this.single ? this.thumb(0) : (this.renderRoot?.querySelector<HTMLElement>('.track') ?? null);
    if (named === null) {
      return;
    }
    const labels = [...this.internals.labels] as Element[];
    const text = this.trim(this.label) || this.trim(this.text);
    if (labels.length > 0) {
      named.ariaLabelledByElements = labels;
      named.removeAttribute('aria-label');
    } else {
      named.ariaLabelledByElements = null;
      if (text === '') {
        named.removeAttribute('aria-label');
      } else {
        named.setAttribute('aria-label', text);
      }
    }
    const hasName = labels.length > 0 || text !== '';
    this.warnOnce(
      'no-name',
      this.settled && !hasName,
      'the slider has no accessible name: set text, associate a label (nph-label for, or nph-field) or set label.',
    );
  }

  /* --- Drawing ---------------------------------------------------------------- */

  /** A number as the person reads it, in the language of the page. */
  private format(value: number): string {
    const lang = this.closest('[lang]')?.getAttribute('lang') || undefined;
    try {
      return new Intl.NumberFormat(lang, { maximumFractionDigits: this.precision }).format(value);
    } catch {
      return String(value);
    }
  }

  /** Where a value sits on the track, from 0 to 100. */
  private percent(value: number): number {
    return ((value - this.min) / (this.max - this.min)) * 100;
  }

  private place(percent: number): string {
    return this.horizontal ? `left: ${percent}%` : `bottom: ${percent}%`;
  }

  private renderThumb(index: Index, inactive: boolean): TemplateResult {
    const [low, high] = this.bounds(index);
    const value = this.values[index];
    const text = this.format(value);
    const name = this.single ? null : this.trim(index === 0 ? this.startLabel : this.endLabel);
    return html`<div
        class="thumb"
        id=${THUMB_IDS[index]}
        role="slider"
        style=${this.place(this.percent(value))}
        tabindex=${inactive ? '-1' : '0'}
        aria-valuemin=${String(low)}
        aria-valuemax=${String(high)}
        aria-valuenow=${String(value)}
        aria-valuetext=${text}
        aria-orientation=${this.horizontal ? 'horizontal' : 'vertical'}
        aria-label=${name === null || name === '' ? nothing : name}
        aria-disabled=${inactive ? 'true' : nothing}
        aria-invalid=${this.invalid && !inactive ? 'true' : nothing}
        aria-describedby="description"
        @keydown=${(event: KeyboardEvent) => this.onKeydown(index, event)}
        @focus=${() => this.onThumbFocus(index)}
      ></div>
      ${inactive
        ? nothing
        : html`<nph-tooltip for=${THUMB_IDS[index]} .text=${text} .open=${this.drag?.index === index}></nph-tooltip>`}`;
  }

  private renderTrack(inactive: boolean): TemplateResult {
    const [start, end] = this.values;
    const from = this.single ? 0 : this.percent(start);
    const to = this.percent(this.single ? start : end);
    const fill = this.horizontal ? `left: ${from}%; width: ${to - from}%` : `bottom: ${from}%; height: ${to - from}%`;
    return html`<div
      class="track"
      role=${this.single ? nothing : 'group'}
      @pointerdown=${this.onPointerDown}
      @pointermove=${this.onPointerMove}
      @pointerup=${this.onPointerUp}
      @pointercancel=${this.onPointerUp}
      @lostpointercapture=${this.onPointerUp}
    >
      <div class="rail"></div>
      <div class="fill" style=${fill}></div>
      ${this.renderThumb(0, inactive)} ${this.single ? nothing : this.renderThumb(1, inactive)}
    </div>`;
  }

  private renderField(index: Index, inactive: boolean): TemplateResult {
    const name = this.single ? this.trim(this.label) || this.trim(this.text) : this.trim(index === 0 ? this.startLabel : this.endLabel);
    return html`<nph-input
      class="entry entry--${index === 0 && !this.single ? 'start' : 'end'}"
      size="default"
      .value=${String(this.values[index])}
      .label=${name}
      .invalid=${this.invalid && !inactive}
      ?inert=${inactive}
      @input=${this.stopFieldInput}
      @change=${(event: Event) => this.onFieldChange(index, event)}
    ></nph-input>`;
  }

  private renderStepper(direction: 1 | -1, inactive: boolean): TemplateResult {
    const label = this.trim(direction === 1 ? this.increaseLabel : this.decreaseLabel);
    return html`<nph-button
      class="stepper"
      severity="secondary"
      emphasis="ghost"
      size="default"
      icon-start=${direction === 1 ? 'plus' : 'minus'}
      .label=${label}
      ?inert=${inactive}
      @click=${() => this.stepBy(direction)}
    ></nph-button>`;
  }

  private renderMarks(): TemplateResult {
    const marks: number[] = [];
    const count = Math.round((this.top - this.min) / this.step);
    for (let index = 0; index <= count; index += 1) {
      marks.push(Number((this.min + index * this.step).toFixed(this.precision)));
    }
    return html`<div class="marks" aria-hidden="true">
      ${marks.map((mark) => html`<span class="mark" style=${this.place(this.percent(mark))}>${this.format(mark)}</span>`)}
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const inactive = this.inactive;
    const horizontal = this.horizontal;
    const text = this.trim(this.text);
    const description = this.trim(this.description);
    const steppers =
      horizontal && this.steppers && this.trim(this.decreaseLabel) !== '' && this.trim(this.increaseLabel) !== '';
    const inputs = horizontal && this.inputs;
    const marks = horizontal && this.marks;
    const [start, end] = this.values;
    const shown = this.single ? this.format(start) : `${this.format(start)} – ${this.format(end)}`;

    /* The parts beside the track, in order; the track takes the rest of the line. */
    const before: TemplateResult[] = [];
    const after: TemplateResult[] = [];
    const fields = new Set<TemplateResult>();
    const field = (index: Index): TemplateResult => {
      const part = this.renderField(index, inactive);
      fields.add(part);
      return part;
    };
    if (inputs && !this.single) before.push(field(0));
    if (steppers) before.push(this.renderStepper(-1, inactive));
    if (this.limits) before.push(html`<span class="limit" aria-hidden="true">${this.format(horizontal ? this.min : this.top)}</span>`);
    if (this.limits) after.push(html`<span class="limit" aria-hidden="true">${this.format(horizontal ? this.top : this.min)}</span>`);
    if (steppers) after.push(this.renderStepper(1, inactive));
    if (inputs) after.push(field(this.single ? 0 : 1));

    /* A field shares the line with the track (D5): the evidence gives it no width of its own. */
    const column = (part: TemplateResult): string => (fields.has(part) ? 'minmax(0, 1fr)' : 'auto');
    const columns = [...before.map(column), 'minmax(0, 1fr)', ...after.map(column)].join(' ');
    const trackColumn = before.length + 1;

    return html`<div class="slider">
      ${text === '' ? nothing : html`<div class="top">
            <nph-label class="label" .text=${text}></nph-label>
            <span class="current" aria-hidden="true">${shown}</span>
          </div>`}
      <div class="row" style=${horizontal ? `grid-template-columns: ${columns}` : nothing}>
        ${before.map((part) => html`<div class="side">${part}</div>`)}
        <div class="scale" style=${horizontal ? `grid-column: ${trackColumn}` : nothing}>${this.renderTrack(inactive)}</div>
        ${after.map((part) => html`<div class="side">${part}</div>`)}
        ${marks ? html`<div class="marks-row" style=${`grid-column: ${trackColumn}`}>${this.renderMarks()}</div>` : nothing}
      </div>
      <span class="description" id="description">${description}</span>
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSlider);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-slider': NphSlider;
  }
}
