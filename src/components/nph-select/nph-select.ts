/**
 * `nph-select` — the field that opens a closed list of options to pick one.
 *
 * Contract accepted in Figma (frame `1357:160`, set `1357:115`, option `1357:136`,
 * list `1357:137`), sheet `fichas/nph-select.md`, `design.md` and decision P91 —
 * nph-select and nph-option: API and semantics. The form pattern is P80; the field
 * contract is P83:
 * - the options are `nph-option` children, as `<option>` children of `<select>`. The
 *   list (the Figma `nph-select / lista`) is internal: it shows them in a floating
 *   layer attached to the trigger;
 * - `size`: `default` or `large`. Reflects, because the internal CSS selects the
 *   height by it;
 * - `value`: the current value. The `value` ATTRIBUTE is the initial value and the
 *   value of `form.reset()`, as in `nph-input` (P80). The chosen option is the first
 *   `nph-option` with that value; the value is kept until such an option arrives, so
 *   a framework may render the options after the value. With no option of that
 *   value, the trigger shows the placeholder and the form data leaves the entry out;
 * - `placeholder`: the invitation before a choice (the Figma `conteúdo=placeholder`);
 * - `start`: `none` (default), `icon` or `avatar` (the Figma `início`). The trigger
 *   repeats the start of the chosen option: with `icon`, the icon of the chosen
 *   option when its own start is `icon`, otherwise `icon`; with `avatar`, the photo of
 *   the chosen option when its own start is `avatar`, otherwise the empty avatar
 *   (D4). The dot of an option never goes to the trigger;
 * - `icon`: a core name of `nph-icon`, default `globe` (the Figma `ícone início`);
 * - `open`: the list is open. Reflects. The piece opens and closes it; the consumer
 *   may set it. Opening and closing fire no event. A disabled select, or one with no
 *   option to choose, does not open;
 * - `name`, `required`: as in a native field. `name` reflects because the form reads
 *   the attribute of the host. `required` with no choice is `valueMissing`, with the
 *   browser's own message, in the person's language;
 * - `invalid`: the `erro` state, an error border and `aria-invalid`. The sentence
 *   belongs to `nph-field`;
 * - `disabled`: the trigger leaves the tab order and the list does not open. A
 *   disabled `<fieldset>` disables the piece too;
 * - `label` and `description`: the accessible name and description in text, never
 *   visible (P83). An associated label (`<label for>` pointing to the host) wins over
 *   `label`;
 * - events: the host fires `input` (bubbles, composed) and then `change` (bubbles)
 *   only when the person chooses an option of a different value. Setting `value`
 *   from code fires nothing (P83, item 1);
 * - keyboard: the select-only combobox pattern of the APG. The focus stays on the
 *   trigger; the active option is pointed to by `aria-activedescendant`. Enter opens
 *   and chooses: it does not submit the form. Tab closes the list without choosing;
 * - no slot besides the options, no `::part`, no color property, no width property:
 *   the width is `layout/input-width`;
 * - invalid input does not render and emits `console.error` only in development, one
 *   per cause and accumulating (P21 rule): a `size` outside the two, a `start` outside
 *   the three and an `icon` outside the core. The magnifying glass renders and warns:
 *   search belongs to `nph-combobox`. A select with no accessible name renders and
 *   warns once in development: the label may arrive after the first render.
 *
 * LAYER — the list is a `popover="manual"`, so it lives in the top layer, as the
 * `nph-tooltip` balloon (P77): no `z-index` and no clipping by an ancestor. It opens
 * `space/inline-tight` below the trigger (D1), with the width of the trigger, and turns
 * up when it does not fit below and fits above. It follows the trigger on scroll and
 * resize.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-avatar/nph-avatar';
import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import { NPH_OPTION_CHANGED, NPH_OPTION_DEFAULT_ICON, NphOption, collapsedText } from '../nph-option/nph-option';
import type { NphOptionOwner } from '../nph-option/nph-option';
import selectCss from './nph-select.css?inline';

const TAG = 'nph-select';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The two sizes of the set. */
export const NPH_SELECT_SIZES = ['default', 'large'] as const;
export type NphSelectSize = (typeof NPH_SELECT_SIZES)[number];

/** The three starts of the trigger (the Figma `início`). */
export const NPH_SELECT_STARTS = ['none', 'icon', 'avatar'] as const;
export type NphSelectStart = (typeof NPH_SELECT_STARTS)[number];

/** The icon the evidence forbids at the start: it suggests search, which belongs to `nph-combobox`. */
const SEARCH_ICON = 'magnifying-glass';

/** Time that keeps the typed characters together as one search (APG typeahead). */
const TYPEAHEAD_MS = 500;

/** How many options Page Up and Page Down move. */
const PAGE_STEP = 10;

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

/**
 * An option the person can reach: not disabled, and rendered (valid input). An option
 * that has not updated yet has not decided its input: it counts, so an `open` select in
 * the markup, which updates before its options, still opens.
 */
function available(option: NphOption): boolean {
  return (option.hasAttribute(RENDERED_ATTRIBUTE) || !option.hasUpdated) && !option.disabled;
}

/** The browser's message for a required choice with nothing chosen, in the person's language. */
function valueMissingMessage(): string {
  const probe = document.createElement('select');
  probe.required = true;
  return probe.validationMessage;
}

export class NphSelect extends LitElement implements NphOptionOwner {
  static override styles = unsafeCSS(selectCss);

  /* Host focus, and a click on an associated label, go to the trigger. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* The host takes part in the form: labelable, with a value and a validity of its own. */
  static formAssociated = true;

  static override properties = {
    /* `size` reflects because the internal CSS selects the height by it. */
    size: { type: String, reflect: true },
    /* The `value` attribute is the default, read by hand (see `attributeChangedCallback`). */
    value: { attribute: false, noAccessor: true },
    placeholder: { type: String },
    start: { type: String },
    icon: { type: String },
    /* `open` reflects: the internal CSS and the consumer's selectors read it. */
    open: { type: Boolean, reflect: true },
    /* `name` reflects because the form reads the attribute of the host, not the property. */
    name: { type: String, reflect: true },
    /* The reflected booleans are read by the internal CSS and by the consumer's selectors. */
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    label: { type: String },
    description: { type: String },
  };

  declare size: string;
  /** The invitation before a choice, already localized by the consuming application. */
  declare placeholder: string;
  declare start: string;
  /** A core icon name: the start of the trigger with `start="icon"`. */
  declare icon: string;
  /** The list is open. */
  declare open: boolean;
  /** Name of the entry in the form data. */
  declare name: string | null;
  declare required: boolean;
  declare disabled: boolean;
  declare invalid: boolean;
  /** Accessible name in text, never visible. An associated label wins over it. */
  declare label: string;
  /** Accessible description in text, never visible: the help or the error sentence. */
  declare description: string;

  private readonly internals: ElementInternals;
  private readonly labelObserver = new MutationObserver(() => this.syncName());
  /** Text, value and attributes of the options: what the trigger and the form show. */
  private readonly optionObserver = new MutationObserver((records) => {
    /* The attributes of the host itself are its own properties, already in the update. */
    if (records.some((record) => record.target !== this)) {
      this.optionsChanged();
    }
  });
  private readonly scrollTargets: EventTarget[] = [];
  private resizeObserver: ResizeObserver | undefined;
  private current = '';
  /** Chosen by the person or set by code: the `value` attribute no longer applies. */
  private dirty = false;
  private valid = false;
  /** The option the pointer or the keyboard is on, while the list is open. */
  private activeOption: NphOption | null = null;
  /** The list is in the top layer: from `showPopover()` until the exit transition ends. */
  private shown = false;
  private closeTimer: number | undefined;
  private frame: number | undefined;
  private typed = '';
  private typedTimer: number | undefined;
  /** After the first frame, a label rendered by another element has had its chance. */
  private settled = false;
  private warnedNoName = false;
  private warnedSearchIcon = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.size = 'default';
    this.placeholder = '';
    this.start = 'none';
    this.icon = NPH_OPTION_DEFAULT_ICON;
    this.open = false;
    this.name = null;
    this.required = false;
    this.disabled = false;
    this.invalid = false;
    this.label = '';
    this.description = '';
    this.addEventListener('focusin', () => this.syncName());
    this.addEventListener('focusout', this.onFocusout);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.labelObserver.observe(this.getRootNode(), {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['for', 'id'],
    });
    this.optionObserver.observe(this, { subtree: true, childList: true, characterData: true, attributes: true });
  }

  override disconnectedCallback(): void {
    this.labelObserver.disconnect();
    this.optionObserver.disconnect();
    this.hideNow();
    this.open = false;
    super.disconnectedCallback();
  }

  /** The current value. Setting it from code fires nothing. */
  get value(): string {
    return this.current;
  }

  set value(next: string) {
    const old = this.current;
    this.current = next === null || next === undefined ? '' : String(next);
    this.dirty = true;
    this.syncFormState();
    this.requestUpdate('value', old);
  }

  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'value'];
  }

  override attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    super.attributeChangedCallback(name, old, next);
    if (name === 'value' && !this.dirty) {
      this.applyDefault();
    }
  }

  /** The `value` attribute, as the default value. */
  private applyDefault(): void {
    const old = this.current;
    this.current = this.getAttribute('value') ?? '';
    this.syncFormState();
    this.requestUpdate('value', old);
  }

  /** An option changed a property: the trigger may show it (`NphOptionOwner`). */
  [NPH_OPTION_CHANGED](): void {
    this.optionsChanged();
  }

  /* --- The native surface of a form control --------------------------------- */

  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  get labels(): NodeList {
    return this.internals.labels;
  }

  get validity(): ValidityState {
    return this.internals.validity;
  }

  get validationMessage(): string {
    return this.internals.validationMessage;
  }

  get willValidate(): boolean {
    return this.internals.willValidate;
  }

  checkValidity(): boolean {
    return this.internals.checkValidity();
  }

  reportValidity(): boolean {
    return this.internals.reportValidity();
  }

  formResetCallback(): void {
    this.dirty = false;
    this.applyDefault();
  }

  formDisabledCallback(): void {
    this.requestUpdate();
  }

  formStateRestoreCallback(state: string | File | FormData | null): void {
    if (typeof state === 'string') {
      this.value = state;
    }
  }

  /* --- Options ------------------------------------------------------------------ */

  /** The `nph-option` children, in order. */
  private get options(): NphOption[] {
    return [...this.children].filter((child): child is NphOption => child instanceof NphOption);
  }

  /** The chosen option: the first one with the current value. */
  private get selectedOption(): NphOption | null {
    return this.options.find((option) => option.value === this.current) ?? null;
  }

  private get availableOptions(): NphOption[] {
    return this.options.filter(available);
  }

  private optionsChanged(): void {
    if (this.activeOption !== null && (this.activeOption.parentElement !== this || !available(this.activeOption))) {
      this.activeOption = null;
    }
    this.syncFormState();
    this.requestUpdate();
  }

  /* --- Validation of the input ---------------------------------------------- */

  protected override willUpdate(changed: PropertyValues): void {
    const decisive = ['size', 'start', 'icon'].some((name) => changed.has(name));
    if (decisive) {
      const size = (this.size ?? '').trim();
      const start = (this.start ?? '').trim();
      const icon = (this.icon ?? '').trim();
      let valid = true;

      if (!oneOf(NPH_SELECT_SIZES, size)) {
        devError(`size "${size}" does not exist. Use ${NPH_SELECT_SIZES.join(' or ')}.`);
        valid = false;
      }
      if (!oneOf(NPH_SELECT_STARTS, start)) {
        devError(`start "${start}" does not exist. Use ${NPH_SELECT_STARTS.join(', ')}.`);
        valid = false;
      }
      if (!isCoreName(icon)) {
        devError(`icon "${icon}" is not a core name of nph-icon.`);
        valid = false;
      }
      if (valid && icon === SEARCH_ICON) {
        if (!this.warnedSearchIcon) {
          this.warnedSearchIcon = true;
          devWarn('the magnifying glass suggests search, which belongs to nph-combobox. Use another start icon.');
        }
      } else {
        this.warnedSearchIcon = false;
      }

      this.valid = valid;
      this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
    }

    /* A disabled or invalid select, or one with nothing to choose, does not open. */
    if (this.open && (!this.valid || this.inactive || this.availableOptions.length === 0)) {
      this.open = false;
    }
    if (changed.has('open') && this.open && (this.activeOption === null || !available(this.activeOption))) {
      this.activeOption = this.initialActive();
    }
    if (!this.open) {
      this.activeOption = null;
    }
  }

  /* --- State ---------------------------------------------------------------------- */

  private get trigger(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('.trigger') ?? null;
  }

  private get list(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('.list') ?? null;
  }

  private get scroller(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('.scroller') ?? null;
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

  /** On opening: the chosen option when it can be reached, otherwise the first one. */
  private initialActive(): NphOption | null {
    const selected = this.selectedOption;
    if (selected !== null && available(selected)) {
      return selected;
    }
    return this.availableOptions[0] ?? null;
  }

  /* --- The person opens, moves, chooses ----------------------------------------- */

  private setActive(option: NphOption | null): void {
    if (option === this.activeOption) {
      return;
    }
    this.activeOption = option;
    this.requestUpdate();
  }

  /** Opens the list, with `option` active (or the initial one). */
  private openList(option?: NphOption | null): void {
    if (this.inactive || !this.valid || this.availableOptions.length === 0) {
      return;
    }
    this.activeOption = option ?? this.initialActive();
    this.open = true;
  }

  private closeList(): void {
    this.open = false;
  }

  /** The person chooses: a different value fires `input` and `change`. The list closes. */
  private choose(option: NphOption): void {
    if (!available(option) || this.inactive) {
      return;
    }
    const old = this.current;
    this.current = option.value;
    this.dirty = true;
    this.closeList();
    this.trigger?.focus();
    this.syncFormState();
    this.requestUpdate('value', old);
    if (this.current !== old) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /** The option at a step from the active one, among those the person can reach. Never wraps. */
  private step(delta: number): NphOption | null {
    const reachable = this.availableOptions;
    if (reachable.length === 0) {
      return null;
    }
    const index = this.activeOption === null ? -1 : reachable.indexOf(this.activeOption);
    if (index === -1) {
      return delta > 0 ? (reachable[0] ?? null) : (reachable[reachable.length - 1] ?? null);
    }
    const next = Math.min(Math.max(index + delta, 0), reachable.length - 1);
    return reachable[next] ?? null;
  }

  /**
   * Typeahead: the typed characters, kept together for a moment, find the next option
   * whose label starts with them. The same character typed again cycles through the
   * options that start with it.
   */
  private typeahead(character: string): NphOption | null {
    const view = this.ownerDocument.defaultView;
    if (this.typedTimer !== undefined) {
      view?.clearTimeout(this.typedTimer);
    }
    this.typed += character.toLocaleLowerCase();
    this.typedTimer = view?.setTimeout(() => {
      this.typed = '';
      this.typedTimer = undefined;
    }, TYPEAHEAD_MS);

    const reachable = this.availableOptions;
    const repeated = [...this.typed].every((typed) => typed === this.typed[0]);
    const search = repeated ? (this.typed[0] ?? '') : this.typed;
    const from = this.activeOption ?? this.selectedOption;
    const index = from === null ? -1 : reachable.indexOf(from);
    /* A new search starts at the current option; a repeated character starts after it. */
    const first = index === -1 ? 0 : index + (repeated || this.typed.length === 1 ? 1 : 0);
    const ordered = [...reachable.slice(first), ...reachable.slice(0, first)];
    return ordered.find((option) => collapsedText(option).toLocaleLowerCase().startsWith(search)) ?? null;
  }

  private onTriggerClick(): void {
    if (this.open) {
      this.closeList();
    } else {
      this.openList();
    }
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.isComposing || this.inactive) {
      return;
    }
    const { key, altKey, ctrlKey, metaKey } = event;
    let handled = true;

    if (!this.open) {
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
        this.openList();
      } else if (key === 'Home') {
        this.openList(this.availableOptions[0] ?? null);
      } else if (key === 'End') {
        this.openList(this.availableOptions.at(-1) ?? null);
      } else if (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey) {
        const found = this.typeahead(key);
        this.openList(found);
      } else {
        handled = false;
      }
    } else if (key === 'Enter' || key === ' ' || (key === 'ArrowUp' && altKey)) {
      if (key === ' ' && this.typed !== '') {
        /* A space inside a typed search is part of the search, as in the native list. */
        this.setActive(this.typeahead(key) ?? this.activeOption);
      } else if (this.activeOption !== null) {
        this.choose(this.activeOption);
      } else {
        this.closeList();
      }
    } else if (key === 'Escape') {
      this.closeList();
      /* The Escape closes the list only, not a dialog around the select. */
      event.stopPropagation();
    } else if (key === 'Tab') {
      /* Tab closes without choosing, and the focus moves on (P91). */
      this.closeList();
      handled = false;
    } else if (key === 'ArrowDown') {
      this.setActive(this.step(1));
    } else if (key === 'ArrowUp') {
      this.setActive(this.step(-1));
    } else if (key === 'Home') {
      this.setActive(this.availableOptions[0] ?? null);
    } else if (key === 'End') {
      this.setActive(this.availableOptions.at(-1) ?? null);
    } else if (key === 'PageDown') {
      this.setActive(this.step(PAGE_STEP));
    } else if (key === 'PageUp') {
      this.setActive(this.step(-PAGE_STEP));
    } else if (key.length === 1 && !altKey && !ctrlKey && !metaKey) {
      this.setActive(this.typeahead(key) ?? this.activeOption);
    } else {
      handled = false;
    }

    if (handled) {
      event.preventDefault();
    }
  }

  /** The option an event happened on: a child of this select. */
  private optionOf(event: Event): NphOption | null {
    for (const target of event.composedPath()) {
      if (target instanceof NphOption && target.parentElement === this) {
        return target;
      }
      if (target === this) {
        break;
      }
    }
    return null;
  }

  private onListClick(event: MouseEvent): void {
    const option = this.optionOf(event);
    if (option !== null) {
      this.choose(option);
    }
  }

  private onListPointer(event: PointerEvent): void {
    const option = this.optionOf(event);
    if (option !== null && available(option)) {
      this.setActive(option);
    }
  }

  /** The list never takes the focus: it stays on the trigger. */
  private onListMousedown(event: MouseEvent): void {
    event.preventDefault();
  }

  /** The focus left the select (Tab, a click elsewhere, code): the list closes without choosing. */
  private readonly onFocusout = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    if (next instanceof Node && (this.contains(next) || this.renderRoot.contains(next))) {
      return;
    }
    this.closeList();
  };

  /** A press outside the select closes the list without choosing. */
  private readonly onDocumentPointerdown = (event: PointerEvent): void => {
    if (!event.composedPath().includes(this)) {
      this.closeList();
    }
  };

  /* --- The layer ------------------------------------------------------------------ */

  private show(list: HTMLElement): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (!this.shown) {
      this.shown = true;
      try {
        list.showPopover();
      } catch {
        /* Not connected, or already showing: nothing to do. */
      }
      document.addEventListener('pointerdown', this.onDocumentPointerdown, true);
      window.addEventListener('scroll', this.onViewportChange, true);
      window.addEventListener('resize', this.onViewportChange);
      this.resizeObserver = new ResizeObserver(this.onViewportChange);
      this.resizeObserver.observe(this);
      this.updateScrollTargets();
      this.place(list);
      /* The first style is the closed one; the next one starts the enter transition. */
      void list.offsetWidth;
    } else {
      this.place(list);
    }
    list.setAttribute('data-open', '');
  }

  /** Starts the exit; the list leaves the top layer when the exit ends. */
  private hide(list: HTMLElement): void {
    list.removeAttribute('data-open');
    if (this.closeTimer !== undefined || !this.shown) {
      return;
    }
    const duration = parseFloat(getComputedStyle(list).transitionDuration) * 1000;
    if (!(duration > 0)) {
      this.hideNow();
      return;
    }
    this.closeTimer = window.setTimeout(() => {
      this.closeTimer = undefined;
      this.hideNow();
    }, duration);
  }

  private hideNow(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    document.removeEventListener('pointerdown', this.onDocumentPointerdown, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.clearScrollTargets();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.shown = false;
    const list = this.list;
    if (list) {
      list.removeAttribute('data-open');
      try {
        list.hidePopover();
      } catch {
        /* Already hidden. */
      }
    }
  }

  /** Every scrolling ancestor across shadow roots: their scroll does not reach `window` in capture. */
  private updateScrollTargets(): void {
    this.clearScrollTargets();
    let node: Node | null = this;
    while (node !== null) {
      const parent: Node | null = node.parentNode instanceof ShadowRoot ? node.parentNode.host : node.parentNode;
      if (node instanceof ShadowRoot) {
        node.addEventListener('scroll', this.onViewportChange, true);
        this.scrollTargets.push(node);
      }
      node = parent;
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
      const list = this.list;
      if (list && this.shown) this.place(list);
    });
  };

  /** The distance to the trigger, carried by the margin of the side that faces it, in pixels. */
  private gap(list: HTMLElement, side: 'top' | 'bottom'): number {
    list.setAttribute('data-side', side);
    const style = getComputedStyle(list);
    return parseFloat(side === 'bottom' ? style.marginTop : style.marginBottom) || 0;
  }

  /** Below the trigger, with its width; above it when it does not fit below and fits above (P91). */
  private place(list: HTMLElement): void {
    const trigger = this.trigger;
    if (trigger === null) return;
    const anchor = trigger.getBoundingClientRect();
    const view = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    /* The trigger is scrolled out of the window: the list goes with it, not stuck to the edge. */
    const visible = anchor.bottom > 0 && anchor.top < view.height && anchor.right > 0 && anchor.left < view.width;
    list.style.visibility = visible ? '' : 'hidden';
    if (!visible) {
      return;
    }
    list.style.width = `${anchor.width}px`;
    list.style.top = '0px';
    list.style.left = '0px';
    const { height } = list.getBoundingClientRect();
    const below = view.height - anchor.bottom - this.gap(list, 'bottom') - height;
    const above = anchor.top - this.gap(list, 'top') - height;
    const side = below >= 0 || below >= above ? 'bottom' : 'top';
    const gap = this.gap(list, side);
    let y = side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - height;
    let x = anchor.left;
    x = Math.min(Math.max(x, 0), Math.max(view.width - anchor.width, 0));
    y = Math.min(Math.max(y, 0), Math.max(view.height - height, 0));
    const style = getComputedStyle(list);
    list.style.left = `${x - parseFloat(style.marginLeft)}px`;
    list.style.top = `${y - parseFloat(style.marginTop)}px`;
  }

  /** The active option comes into the view of the list, without scrolling the page. */
  private revealActive(): void {
    const scroller = this.scroller;
    const option = this.activeOption;
    if (scroller === null || option === null) {
      return;
    }
    const box = scroller.getBoundingClientRect();
    const item = option.getBoundingClientRect();
    if (item.top < box.top) {
      scroller.scrollTop -= box.top - item.top;
    } else if (item.bottom > box.bottom) {
      scroller.scrollTop += item.bottom - box.bottom;
    }
  }

  /* --- Form value, validity and accessible name -------------------------------- */

  protected override firstUpdated(): void {
    requestAnimationFrame(() => {
      this.settled = true;
      this.syncName();
    });
  }

  protected override updated(changed: PropertyValues): void {
    const selected = this.selectedOption;
    for (const option of this.options) {
      option.selected = option === selected;
      option.active = this.open && option === this.activeOption;
    }
    const trigger = this.trigger;
    if (trigger !== null) {
      (trigger as HTMLElement & { ariaActiveDescendantElement: Element | null }).ariaActiveDescendantElement =
        this.open ? this.activeOption : null;
    }
    const list = this.list;
    if (list !== null) {
      if (this.open) {
        this.show(list);
        this.revealActive();
      } else if (changed.has('open') || this.shown) {
        this.hide(list);
      }
    }
    this.syncFormState();
  }

  private syncFormState(): void {
    const selected = this.selectedOption;
    if (!this.valid) {
      this.internals.setFormValue(null);
      this.internals.setValidity({});
      return;
    }
    this.internals.setFormValue(selected === null ? null : selected.value, this.current);
    const missing = this.required && (selected === null || selected.value === '');
    if (missing) {
      const trigger = this.trigger;
      this.internals.setValidity({ valueMissing: true }, valueMissingMessage(), trigger ?? undefined);
    } else {
      this.internals.setValidity({});
    }
    this.syncName();
  }

  /**
   * The trigger and the list are named by the labels associated with the host (the
   * reference to an element of an outer scope is valid from inside the shadow root),
   * or by `label`.
   */
  private syncName(): void {
    const trigger = this.trigger;
    const list = this.list;
    if (trigger === null || list === null) {
      return;
    }
    const labels = [...this.internals.labels] as Element[];
    const text = (this.label ?? '').trim();
    for (const element of [trigger, list]) {
      if (labels.length > 0) {
        element.ariaLabelledByElements = labels;
        element.removeAttribute('aria-label');
      } else {
        element.ariaLabelledByElements = null;
        if (text === '') {
          element.removeAttribute('aria-label');
        } else {
          element.setAttribute('aria-label', text);
        }
      }
    }
    const named = labels.length > 0 || text !== '';
    if (named) {
      this.warnedNoName = false;
    } else if (this.settled && !this.warnedNoName) {
      this.warnedNoName = true;
      devWarn('the select has no accessible name: associate a label (nph-label for, or nph-field) or set label. The placeholder is not a name.');
    }
  }

  /* --- Drawing ---------------------------------------------------------------- */

  /** The start of the trigger: the select decides the kind, the chosen option gives the art (D4). */
  private startArt(selected: NphOption | null): TemplateResult | typeof nothing {
    const start = (this.start ?? '').trim();
    if (start === 'icon') {
      const own = selected !== null && (selected.start ?? '').trim() === 'icon' ? (selected.icon ?? '').trim() : '';
      const name = own !== '' && isCoreName(own) ? own : (this.icon ?? '').trim();
      return html`<nph-icon class="start" name=${name} size="sm" aria-hidden="true"></nph-icon>`;
    }
    if (start === 'avatar') {
      const src = selected !== null && (selected.start ?? '').trim() === 'avatar' ? (selected.src ?? '').trim() : '';
      return html`<nph-avatar class="start" size="sm" src=${src} aria-hidden="true"></nph-avatar>`;
    }
    return nothing;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const inactive = this.inactive;
    const selected = this.selectedOption;
    const description = (this.description ?? '').trim();
    const text = selected === null ? '' : collapsedText(selected);

    return html`<div
        class="trigger"
        role="combobox"
        tabindex=${inactive ? nothing : '0'}
        aria-haspopup="listbox"
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-controls="list"
        aria-required=${this.required ? 'true' : nothing}
        aria-invalid=${this.invalid && !inactive ? 'true' : nothing}
        aria-disabled=${inactive ? 'true' : nothing}
        aria-describedby=${description === '' ? nothing : 'description'}
        @click=${this.onTriggerClick}
        @keydown=${this.onKeydown}
      >
        ${this.startArt(selected)}
        ${selected === null
          ? html`<span class="value placeholder">${this.placeholder ?? ''}</span>`
          : html`<span class="value">${text}</span>`}
        <span class="arrow" aria-hidden="true">
          <nph-icon name=${this.open ? 'chevron-up' : 'chevron-down'} size="sm"></nph-icon>
        </span>
        ${description === '' ? nothing : html`<span class="description" id="description">${description}</span>`}
      </div>
      <div
        class="list"
        id="list"
        role="listbox"
        popover="manual"
        @mousedown=${this.onListMousedown}
        @click=${this.onListClick}
        @pointermove=${this.onListPointer}
      >
        <div class="scroller"><slot @slotchange=${this.optionsChanged}></slot></div>
      </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSelect);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-select': NphSelect;
  }
}
