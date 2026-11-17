/**
 * `nph-resizable` — a group of two or three panels, side by side or stacked, separated by a
 * handle that is dragged, or moved by keyboard, to resize them. Desktop only in v1.
 *
 * Contract accepted in Figma (documentation frame `5123:2641`, root `5112:1850`, sets
 * `5112:1849` and `5099:172`), task DSA-86, sheet `fichas/nph-resizable.md`, `design.md` and
 * decision P128. The handle follows the WAI-ARIA APG Window Splitter pattern:
 * - ONE tag. The Figma has no panel component: the panels are the direct element children of the
 *   group, with free content. The group reads the size of each one from attributes on it
 *   (the precedent of the `value` attribute of `nph-toggle-group`): `default-size`, `min-size`,
 *   `max-size` and `collapsed-size`, a number in percent or a number with `px`, and the optional
 *   `collapse-label` and `expand-label`, which replace the ones of the group on the button of that
 *   panel. The panels reach the shadow root by MANUAL slot assignment, so the group writes no
 *   attribute on a child. A panel is named by its `aria-label` or `aria-labelledby`: the handle
 *   that controls it takes that name;
 * - `direction` (the Figma `direcao`): `horizontal` (default, panels side by side, vertical
 *   handle) or `vertical` (panels stacked, horizontal handle). It reflects because the internal
 *   CSS selects the handle by it;
 * - `disabled`: the whole group, every handle at `state/disabled-opacity`, out of the Tab order,
 *   with its collapse button disabled (a decision of P128: it is a property of the group, not of
 *   each handle);
 * - `hide-collapse-button`: the Figma `botão recolher` is on by default, so the property turns it
 *   off (as `hide-close` of `nph-dialog`). `collapse-label` and `expand-label` name the button in
 *   each state, already localized; without them the button is not drawn and `console.error`
 *   says so in development;
 * - `sizes`: the size of each panel in percent of the length the group has on its axis without
 *   the handles. The attribute takes numbers separated by spaces (`sizes="30 70"`), the property
 *   is a `number[]`. The product persists the chosen size with it and the event below; writing it
 *   from code never fires the event;
 * - own event `nph-resize` (bubbles, composed, not cancelable) with `detail: { sizes }`, fired
 *   only when the person changes the sizes: drag, keyboard, collapse button or double click;
 * - each handle controls the panel at its start (the left one in a horizontal group, the top
 *   one in a vertical group; the right one in right-to-left text): the main panel of the APG.
 *   `aria-valuenow`, `aria-valuemin` and `aria-valuemax` are its size in percent, an integer from
 *   0 to 100, and `aria-controls` points to it. The space a collapsed panel frees goes to the
 *   panel across the same handle;
 * - keys: the arrows on the handle axis move it 1 percent, Shift with an arrow 10 percent, Home
 *   and End take the main panel to its minimum and maximum, Enter collapses and restores it.
 *   F6 is not used: the browser circulates its own panes with it. Double click restores the
 *   default size. Pointer drag has the grip box background; keyboard has only the focus line;
 * - the handle sits IN the flow, `control/height-compact` wide as Figma draws it, which is also
 *   its hit area, and on a coarse pointer an invisible extension takes the area to
 *   `control/height-large`. The collapse button is an `nph-button` icon only, secondary, ghost,
 *   compact (the T4 exception of the handle), beside the separator element, not inside it;
 * - no animation (it is a valid choice: there is nothing to reduce under reduced motion), no
 *   `::part`, no color property, no mobile layout: below the tablet breakpoint the product
 *   stacks the panels or turns them into tabs (v1);
 * - invalid input does not render and emits `console.error` only in development, one per cause
 *   (the rule of P21): `direction` outside the two values. A problem in the composition renders
 *   anyway and emits `console.warn` only in development: fewer than two panels, more than three,
 *   a panel with no name, a size that is not a number, a minimum above the maximum, `sizes` that
 *   do not match the panels, and a group with no length on its axis.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-icon/nph-icon';
import resizableCss from './nph-resizable.css?inline';

const TAG = 'nph-resizable';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The event the group fires when the person changes the sizes. */
export const NPH_RESIZABLE_RESIZE_EVENT = 'nph-resize';

export const NPH_RESIZABLE_DIRECTIONS = ['horizontal', 'vertical'] as const;
export type NphResizableDirection = (typeof NPH_RESIZABLE_DIRECTIONS)[number];

export interface NphResizableResizeDetail {
  /** The size of each panel in percent of the length of the group without the handles. */
  readonly sizes: readonly number[];
}

/** The arrow moves the handle by 1 percent, Shift with it by 10 percent (P128). */
const STEP = 1;
const STEP_LARGE = 10;

/** Two sizes closer than this are the same size. */
const EPSILON = 0.01;

/** The attributes of a panel the group reads. */
const PANEL_ATTRIBUTES = [
  'default-size',
  'min-size',
  'max-size',
  'collapsed-size',
  'collapse-label',
  'expand-label',
  'aria-label',
  'aria-labelledby',
];

/** Development messages; outside a bundler with `import.meta.env`, they stay silent. */
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

function isDirection(value: string): value is NphResizableDirection {
  return (NPH_RESIZABLE_DIRECTIONS as readonly string[]).includes(value);
}

/** A size as the person wrote it: a number in percent or in pixels. */
interface Size {
  readonly value: number;
  readonly unit: '%' | 'px';
}

/** The sizes of one panel, read from its attributes. */
interface PanelModel {
  readonly element: HTMLElement;
  readonly defaultSize: Size | null;
  readonly min: Size | null;
  readonly max: Size | null;
  readonly collapsed: Size | null;
  readonly collapseLabel: string;
  readonly expandLabel: string;
}

/** The limits of one panel in percent: where it collapses, its minimum and its maximum. */
interface Limits {
  readonly collapsed: number;
  readonly min: number;
  readonly max: number;
}

/** How a resize that lands between the collapsed size and the minimum settles. */
type Snap = 'nearest' | 'direction' | 'none';

const SIZE_PATTERN = /^(\d+(?:\.\d+)?|\.\d+)(px|%)?$/;

/** The size an attribute holds, or `null` when it is absent or is not a number. */
function parseSize(raw: string | null, invalid: Set<string>, attribute: string): Size | null {
  const text = (raw ?? '').trim();
  if (text === '') {
    return null;
  }
  const match = SIZE_PATTERN.exec(text);
  if (match === null) {
    invalid.add(`${attribute}="${text}" is not a number: use a percent or a number with px, such as 20 or 240px.`);
    return null;
  }
  return { value: Number(match[1]), unit: match[2] === 'px' ? 'px' : '%' };
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(Math.max(value, low), high);
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function sameSizes(left: readonly number[], right: readonly number[]): boolean {
  return left.length === right.length && left.every((value, index) => Math.abs(value - (right[index] ?? 0)) < EPSILON);
}

export class NphResizable extends LitElement {
  static override styles = unsafeCSS(resizableCss);

  /* The panels are the children of the host, and the group puts each one in its slot by hand: it writes no `slot` attribute on a child. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, slotAssignment: 'manual' as const };

  static override properties = {
    /* Reflected: the internal CSS selects the handle by the direction and by the disabled state. */
    direction: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    hideCollapseButton: { type: Boolean, attribute: 'hide-collapse-button' },
    collapseLabel: { type: String, attribute: 'collapse-label' },
    expandLabel: { type: String, attribute: 'expand-label' },
    sizes: {
      attribute: 'sizes',
      converter: {
        fromAttribute: (attribute: string | null): number[] =>
          attribute === null
            ? []
            : attribute
                .split(/\s+/)
                .filter((token) => token !== '')
                .map(Number)
                .filter((number) => Number.isFinite(number)),
      },
    },
    dragging: { state: true },
  };

  /** `horizontal` (panels side by side) or `vertical` (panels stacked). */
  declare direction: NphResizableDirection;
  /** Turns the whole group off: every handle and its collapse button. */
  declare disabled: boolean;
  /** Turns the collapse button of the handles off. */
  declare hideCollapseButton: boolean;
  /** The name of the collapse button while the panel is open, already localized. */
  declare collapseLabel: string;
  /** The name of the collapse button while the panel is collapsed, already localized. */
  declare expandLabel: string;
  /** The size of each panel in percent. Changing it from code does not fire the event. */
  declare sizes: number[];
  /** The index of the handle under the pointer drag, or `null`. */
  declare dragging: number | null;

  private valid = false;
  private models: PanelModel[] = [];
  /** The default size of each panel in percent, from `default-size` and the share of the rest. */
  private defaultSizes: number[] = [];
  /** The size a panel had before the collapse, to restore it. */
  private restoreSizes: Array<number | undefined> = [];
  private drag: { index: number; pointer: number; origin: number; start: number[]; available: number; reversed: boolean } | null = null;
  private shownWarnings = new Set<string>();
  private shownErrors = new Set<string>();
  /** The size attributes of the panels that are not a number, as messages. */
  private invalidSizes = new Set<string>();
  /** The message of `sizes` that did not match the panels at the last update, or empty. */
  private sizesMismatch = '';
  /** The panels are direct children: a child that comes, goes or changes an attribute the group reads. */
  private readonly childObserver = new MutationObserver(() => this.requestUpdate());
  /** The size of the group on its axis changes the pixel limits in percent. */
  private readonly sizeObserver = new ResizeObserver(() => this.onGroupResize());

  constructor() {
    super();
    this.direction = 'horizontal';
    this.disabled = false;
    this.hideCollapseButton = false;
    this.collapseLabel = '';
    this.expandLabel = '';
    this.sizes = [];
    this.dragging = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.childObserver.observe(this, { childList: true, attributes: true, attributeFilter: PANEL_ATTRIBUTES, subtree: true });
    this.sizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.childObserver.disconnect();
    this.sizeObserver.disconnect();
    this.drag = null;
  }

  /* ----- the panels and their limits --------------------------------------------------------- */

  private readPanels(): { models: PanelModel[]; invalid: Set<string> } {
    const invalid = new Set<string>();
    const models = [...this.children].map((child): PanelModel => {
      const element = child as HTMLElement;
      const read = (name: string): Size | null => parseSize(element.getAttribute(name), invalid, name);
      return {
        element,
        defaultSize: read('default-size'),
        min: read('min-size'),
        max: read('max-size'),
        collapsed: read('collapsed-size'),
        collapseLabel: (element.getAttribute('collapse-label') ?? '').trim(),
        expandLabel: (element.getAttribute('expand-label') ?? '').trim(),
      };
    });
    return { models, invalid };
  }

  private get vertical(): boolean {
    return this.direction === 'vertical';
  }

  private get reversed(): boolean {
    return !this.vertical && getComputedStyle(this).direction === 'rtl';
  }

  /** The length the panels share: the group on its axis, minus the handles. In pixels. */
  private available(): number {
    const length = this.vertical ? this.clientHeight : this.clientWidth;
    const handles = [...(this.renderRoot?.querySelectorAll<HTMLElement>('.handle') ?? [])];
    const used = sum(handles.map((handle) => (this.vertical ? handle.offsetHeight : handle.offsetWidth)));
    return Math.max(0, length - used);
  }

  private toPercent(size: Size | null, available: number, fallback: number): number {
    if (size === null) {
      return fallback;
    }
    if (size.unit === '%') {
      return size.value;
    }
    return available > 0 ? (size.value / available) * 100 : fallback;
  }

  private limits(index: number, available: number): Limits {
    const model = this.models[index];
    if (model === undefined) {
      return { collapsed: 0, min: 0, max: 100 };
    }
    const collapsed = clamp(this.toPercent(model.collapsed, available, 0), 0, 100);
    const min = clamp(Math.max(this.toPercent(model.min, available, 0), collapsed), 0, 100);
    const max = clamp(Math.max(this.toPercent(model.max, available, 100), min), 0, 100);
    return { collapsed, min, max };
  }

  /** The default sizes: the ones the panels declare and the rest shared equally. */
  private computeDefaults(available: number): number[] {
    const count = this.models.length;
    const declared = this.models.map((model) => (model.defaultSize === null ? null : this.toPercent(model.defaultSize, available, 0)));
    const given = sum(declared.map((value) => value ?? 0));
    const free = declared.filter((value) => value === null).length;
    if (free > 0) {
      const share = Math.max(0, 100 - given) / free;
      return declared.map((value) => value ?? share);
    }
    return given > 0 ? declared.map((value) => ((value ?? 0) / given) * 100) : Array.from({ length: count }, () => 100 / count);
  }

  /** Whether the panel at `index` is the main panel of a handle, so it can collapse. */
  private collapsible(index: number): boolean {
    return index < this.models.length - 1;
  }

  private isCollapsed(index: number, sizes = this.sizes): boolean {
    return this.collapsible(index) && (sizes[index] ?? 0) <= this.limits(index, this.available()).collapsed + EPSILON;
  }

  /** The sizes brought inside the limits of every panel, still adding up to 100. */
  private fit(sizes: readonly number[], available: number): number[] {
    const count = this.models.length;
    const next = Array.from({ length: count }, (_, index) => {
      const limit = this.limits(index, available);
      const value = sizes[index] ?? 0;
      if (this.collapsible(index) && value <= limit.collapsed + EPSILON) {
        return limit.collapsed;
      }
      return clamp(value, limit.min, limit.max);
    });
    /* The sizes now add up to something else than 100: the panels that have room take the difference, from the last one. */
    for (const direction of [1, -1]) {
      let difference = 100 - sum(next);
      if (difference * direction <= 0) {
        continue;
      }
      for (let index = count - 1; index >= 0 && Math.abs(difference) > EPSILON; index -= 1) {
        const limit = this.limits(index, available);
        const room = difference > 0 ? limit.max - (next[index] ?? 0) : (next[index] ?? 0) - limit.min;
        const take = Math.min(Math.abs(difference), Math.max(0, room)) * direction;
        next[index] = (next[index] ?? 0) + take;
        difference -= take;
      }
    }
    const total = sum(next);
    return total > 0 && Math.abs(total - 100) > EPSILON ? next.map((value) => (value / total) * 100) : next;
  }

  /**
   * Moves the handle after the panel at `index` by `delta` percent from `start`. The pair of panels
   * keeps its sum: the main panel stays in its own limits and the panel across the handle in its
   * own, or where it already was when it was outside them.
   */
  private resize(index: number, start: readonly number[], delta: number, snap: Snap, available: number): number[] {
    const across = index + 1;
    if (this.models[across] === undefined) {
      return [...start];
    }
    const own = this.limits(index, available);
    const other = this.limits(across, available);
    const startOwn = start[index] ?? 0;
    const startOther = start[across] ?? 0;
    const total = startOwn + startOther;
    const low = Math.max(own.collapsed, total - Math.max(other.max, startOther));
    const high = Math.min(own.max, total - Math.min(other.min, startOther));
    if (low > high) {
      return [...start];
    }
    let size = clamp(startOwn + delta, low, high);
    if (snap !== 'none' && size > own.collapsed + EPSILON && size < own.min - EPSILON) {
      const collapses = snap === 'nearest' ? size - own.collapsed < own.min - size : delta < 0;
      size = collapses ? own.collapsed : own.min;
      size = clamp(size, low, high);
    }
    const next = [...start];
    next[index] = size;
    next[across] = total - size;
    return next;
  }

  /** The largest size the main panel of a handle can take with the sizes as they are. */
  private maximum(index: number, available: number): number {
    const own = this.limits(index, available);
    const other = this.limits(index + 1, available);
    const total = (this.sizes[index] ?? 0) + (this.sizes[index + 1] ?? 0);
    return Math.min(own.max, total - Math.min(other.min, this.sizes[index + 1] ?? 0));
  }

  /** The person changed the sizes: the group keeps them and tells the consumer, once, when they moved. */
  private commit(next: readonly number[]): void {
    if (sameSizes(next, this.sizes)) {
      return;
    }
    this.sizes = [...next];
    this.dispatchEvent(
      new CustomEvent<NphResizableResizeDetail>(NPH_RESIZABLE_RESIZE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { sizes: this.sizes },
      }),
    );
  }

  /* ----- the person's actions ----------------------------------------------------------------- */

  private toggleCollapse(index: number): void {
    if (this.disabled || !this.collapsible(index)) {
      return;
    }
    const available = this.available();
    const limit = this.limits(index, available);
    const current = this.sizes[index] ?? 0;
    const total = current + (this.sizes[index + 1] ?? 0);
    if (this.isCollapsed(index)) {
      /* Restores the size before the collapse, or the default one, and never less than the minimum. */
      const remembered = this.restoreSizes[index] ?? this.defaultSizes[index] ?? 0;
      const target = remembered > limit.collapsed + EPSILON ? remembered : limit.min > limit.collapsed + EPSILON ? limit.min : total / 2;
      this.commit(this.resize(index, this.sizes, target - current, 'none', available));
      return;
    }
    this.restoreSizes[index] = current;
    const next = [...this.sizes];
    next[index] = limit.collapsed;
    next[index + 1] = total - limit.collapsed;
    this.commit(next);
  }

  private restoreDefault(index: number): void {
    if (this.disabled || this.models[index + 1] === undefined) {
      return;
    }
    const target = this.defaultSizes[index] ?? 0;
    this.commit(this.resize(index, this.sizes, target - (this.sizes[index] ?? 0), 'none', this.available()));
  }

  private onKeydown(index: number, event: KeyboardEvent): void {
    if (this.disabled || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const available = this.available();
    const arrows = this.vertical ? { ArrowDown: 1, ArrowUp: -1 } : { ArrowRight: 1, ArrowLeft: -1 };
    const direction = (arrows as Record<string, number | undefined>)[event.key];
    if (direction !== undefined) {
      /* The arrows follow the visual side: in right-to-left text the main panel is at the right, so the right arrow shrinks it. */
      const sign = this.reversed ? -direction : direction;
      const step = event.shiftKey ? STEP_LARGE : STEP;
      this.commit(this.resize(index, this.sizes, sign * step, 'direction', available));
    } else if (event.key === 'Home') {
      this.commit(this.resize(index, this.sizes, this.limits(index, available).min - (this.sizes[index] ?? 0), 'none', available));
    } else if (event.key === 'End') {
      this.commit(this.resize(index, this.sizes, this.maximum(index, available) - (this.sizes[index] ?? 0), 'none', available));
    } else if (event.key === 'Enter') {
      this.toggleCollapse(index);
    } else {
      return;
    }
    event.preventDefault();
  }

  private onPointerDown(index: number, event: PointerEvent): void {
    if (this.disabled || event.button !== 0) {
      return;
    }
    const available = this.available();
    if (available <= 0) {
      return;
    }
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    this.drag = {
      index,
      pointer: event.pointerId,
      origin: this.vertical ? event.clientY : event.clientX,
      start: [...this.sizes],
      available,
      reversed: this.reversed,
    };
    this.dragging = index;
  }

  private onPointerMove(event: PointerEvent): void {
    const drag = this.drag;
    if (drag === null || event.pointerId !== drag.pointer) {
      return;
    }
    if (this.disabled) {
      this.endDrag();
      return;
    }
    const position = this.vertical ? event.clientY : event.clientX;
    const moved = (position - drag.origin) * (drag.reversed ? -1 : 1);
    this.commit(this.resize(drag.index, drag.start, (moved / drag.available) * 100, 'nearest', drag.available));
  }

  private endDrag(): void {
    if (this.drag !== null) {
      this.drag = null;
      this.dragging = null;
    }
  }

  private onPointerUp(event: PointerEvent): void {
    if (this.drag !== null && event.pointerId === this.drag.pointer) {
      this.endDrag();
    }
  }

  /* ----- the size of the group ---------------------------------------------------------------- */

  /** A new length on the axis changes what a pixel limit is in percent: the sizes settle again, with no event. */
  private onGroupResize(): void {
    if (!this.valid || this.models.length === 0) {
      return;
    }
    const available = this.available();
    this.defaultSizes = this.computeDefaults(available);
    const next = this.fit(this.sizes, available);
    if (!sameSizes(next, this.sizes)) {
      this.sizes = next;
    }
    this.requestUpdate();
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has('direction') || !this.hasUpdated) {
      const direction = this.direction ?? '';
      if (isDirection(direction)) {
        this.valid = true;
      } else {
        devError(`direction "${direction}" does not exist. Use ${NPH_RESIZABLE_DIRECTIONS.join(', ')}.`);
        this.valid = false;
      }
      this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    }
    if (!this.valid) {
      return;
    }
    const { models, invalid } = this.readPanels();
    const count = models.length;
    const previous = this.models.length;
    this.models = models;
    this.invalidSizes = invalid;
    if (previous !== count) {
      this.restoreSizes = [];
    }
    const available = this.available();
    this.defaultSizes = this.computeDefaults(available);
    /* The sizes of the person, or the default ones when they do not match the panels. */
    const given = Array.isArray(this.sizes) ? this.sizes : [];
    this.sizesMismatch = given.length !== 0 && given.length !== count ? `sizes has ${given.length} numbers for ${count} panels: the default sizes are used.` : '';
    this.sizes = count === 0 ? [] : this.fit(given.length === count ? given : this.defaultSizes, available);
  }

  protected override updated(): void {
    if (!this.valid) {
      return;
    }
    const slots = this.renderRoot.querySelectorAll<HTMLSlotElement>('slot');
    slots.forEach((slot, index) => {
      const element = this.models[index]?.element;
      if (element !== undefined) {
        slot.assign(element);
      }
    });
    this.applyReferences();
    this.checkComposition();
  }

  /**
   * An `id` reference cannot cross the shadow root; the reflection of the elements can (P116). The handle
   * controls the main panel and takes the name of it: its `aria-label`, or the elements its `aria-labelledby` names.
   */
  private applyReferences(): void {
    const separators = this.renderRoot.querySelectorAll<HTMLElement & { ariaControlsElements: readonly Element[] | null; ariaLabelledByElements: readonly Element[] | null }>('.separator');
    separators.forEach((separator, index) => {
      const panel = this.models[index]?.element;
      if (panel === undefined) {
        return;
      }
      separator.ariaControlsElements = [panel];
      const root = panel.getRootNode() as Document | ShadowRoot;
      const named = (panel.getAttribute('aria-labelledby') ?? '')
        .split(/\s+/)
        .map((id) => (id === '' ? null : root.getElementById(id)))
        .filter((element): element is HTMLElement => element !== null);
      const label = (panel.getAttribute('aria-label') ?? '').trim();
      if (label !== '') {
        separator.setAttribute('aria-label', label);
        separator.ariaLabelledByElements = null;
      } else if (named.length > 0) {
        separator.removeAttribute('aria-label');
        separator.ariaLabelledByElements = named;
      } else {
        separator.removeAttribute('aria-label');
        separator.ariaLabelledByElements = null;
      }
    });
  }

  /** Composition problems: they render anyway, and each shows once while it lasts. */
  private checkComposition(): void {
    const warnings = new Set<string>(this.invalidSizes);
    const count = this.models.length;
    if (count < 2) {
      warnings.add('fewer than two panels: the group needs at least two, one handle between them.');
    }
    if (count > 3) {
      warnings.add('more than three panels: nest groups, the panel of one group takes another group in the other direction.');
    }
    const available = this.available();
    this.models.slice(0, -1).forEach((model) => {
      const named = (model.element.getAttribute('aria-label') ?? '').trim() !== '' || (model.element.getAttribute('aria-labelledby') ?? '').trim() !== '';
      if (!named) {
        warnings.add('the panel a handle controls needs a name: set aria-label or aria-labelledby on it, because the handle takes it.');
      }
    });
    this.models.forEach((model, index) => {
      if (model.min !== null && model.max !== null && this.toPercent(model.min, available, 0) > this.toPercent(model.max, available, 100)) {
        warnings.add(`panel ${index + 1}: min-size is above max-size, so the maximum is raised to the minimum.`);
      }
    });
    if (this.sizesMismatch !== '') {
      warnings.add(this.sizesMismatch);
    }
    if (count >= 2 && available === 0 && this.isConnected) {
      warnings.add('the group has no length on its axis: give it a width, or a height when it is vertical.');
    }
    const errors = new Set<string>();
    const lacksLabel = this.models.slice(0, -1).some((_model, index) => this.buttonLabel(index, false) === '' || this.buttonLabel(index, true) === '');
    if (!this.hideCollapseButton && lacksLabel) {
      errors.add('the collapse button needs collapse-label and expand-label: without them it is not drawn. Set both, or hide-collapse-button.');
    }
    for (const error of errors) {
      if (!this.shownErrors.has(error)) {
        devError(error);
      }
    }
    this.shownErrors = errors;
    for (const warning of warnings) {
      if (!this.shownWarnings.has(warning)) {
        devWarn(warning);
      }
    }
    this.shownWarnings = warnings;
  }

  /* ----- the drawing -------------------------------------------------------------------------- */

  /** The name of the collapse button of the handle after the panel at `index`, in the state asked. */
  private buttonLabel(index: number, collapsed: boolean): string {
    const model = this.models[index];
    const own = collapsed ? model?.expandLabel : model?.collapseLabel;
    return (own !== undefined && own !== '' ? own : (collapsed ? this.expandLabel : this.collapseLabel) ?? '').trim();
  }

  /** The chevron points to the main panel; it flips while that panel is collapsed, and mirrors in right-to-left text. */
  private chevron(collapsed: boolean): string {
    if (this.vertical) {
      return collapsed ? 'chevron-down' : 'chevron-up';
    }
    const towardsStart = this.reversed ? 'chevron-right' : 'chevron-left';
    const towardsEnd = this.reversed ? 'chevron-left' : 'chevron-right';
    return collapsed ? towardsEnd : towardsStart;
  }

  private renderButton(index: number): TemplateResult | typeof nothing {
    const collapsed = this.isCollapsed(index);
    const label = this.buttonLabel(index, collapsed);
    if (this.hideCollapseButton || label === '') {
      return nothing;
    }
    return html`<nph-button
      class="collapse"
      severity="secondary"
      emphasis="ghost"
      size="compact"
      shape="square"
      icon-start=${this.chevron(collapsed)}
      label=${label}
      aria-expanded=${collapsed ? 'false' : 'true'}
      .controls=${this.models[index]?.element ?? null}
      ?disabled=${this.disabled}
      @click=${() => this.toggleCollapse(index)}
    ></nph-button>`;
  }

  private renderHandle(index: number): TemplateResult {
    const available = this.available();
    const own = this.limits(index, available);
    const orientation = this.vertical ? 'horizontal' : 'vertical';
    return html`<div class="handle" ?data-dragging=${this.dragging === index}>
      <div
        class="separator"
        role="separator"
        tabindex=${this.disabled ? nothing : '0'}
        aria-orientation=${orientation}
        aria-valuenow=${Math.round(this.sizes[index] ?? 0)}
        aria-valuemin=${Math.round(own.collapsed)}
        aria-valuemax=${Math.round(this.maximum(index, available))}
        aria-disabled=${this.disabled ? 'true' : nothing}
        @keydown=${(event: KeyboardEvent) => this.onKeydown(index, event)}
        @pointerdown=${(event: PointerEvent) => this.onPointerDown(index, event)}
        @pointermove=${this.onPointerMove}
        @pointerup=${this.onPointerUp}
        @pointercancel=${this.onPointerUp}
        @lostpointercapture=${this.onPointerUp}
        @dblclick=${() => this.restoreDefault(index)}
      ></div>
      <div class="line"></div>
      <div class="grip" aria-hidden="true"><nph-icon name="grip-vertical" size="sm"></nph-icon></div>
      ${this.renderButton(index)}
      <div class="line"></div>
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const parts: TemplateResult[] = [];
    const last = this.models.length - 1;
    this.models.forEach((_model, index) => {
      const collapsed = this.isCollapsed(index);
      const empty = collapsed && this.limits(index, this.available()).collapsed === 0;
      parts.push(
        html`<div class="panel" style="--_size: ${this.sizes[index] ?? 0}" ?data-collapsed=${collapsed} ?data-empty=${empty}>
          <div class="content"><slot></slot></div>
        </div>`,
      );
      if (index < last) {
        parts.push(this.renderHandle(index));
      }
    });
    return html`${parts}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphResizable);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-resizable': NphResizable;
  }
  interface HTMLElementEventMap {
    'nph-resize': CustomEvent<NphResizableResizeDetail>;
  }
}
