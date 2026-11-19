/**
 * `nph-option` — one option of a list the person picks from.
 *
 * Contract accepted in Figma (`nph-select / opção`, `1357:136`, board `1357:160`),
 * sheet `fichas/nph-option.md`, `design.md` and decision P91 — nph-select and
 * nph-option: API and semantics. The option is shared: the `nph-select` list uses
 * it now, and the `nph-combobox` list reuses it. It never stands alone: it is a
 * child of the element that owns the list, as `<option>` is of `<select>`.
 * - the label is the text of the default slot (the Figma `rótulo`);
 * - `secondary`: the helper text after the label (the Figma `texto secundário`,
 *   which turns `secundário` on). Empty turns it off;
 * - `start`: `none` (default), `icon`, `avatar` or `dot` (the Figma `início`);
 * - `icon`: a core name of `nph-icon`, default `globe`, drawn with `start="icon"`;
 * - `src`: the photo of the avatar, with `start="avatar"`. Empty is the empty avatar;
 * - `status`: the color of the dot, with `start="dot"`: `neutral`, `info`,
 *   `warning`, `success`, `error` or `help`. Absent, the dot follows the text color
 *   (D6);
 * - `disabled`: the option cannot be chosen; the whole option loses opacity;
 * - `marker`: `check` (default) or `checkbox` (the Figma `marcador`, `marca` or
 *   `checkbox`). Reflects. `check` is the single choice: the selected option takes the
 *   `color/primary-surface` background and the check. `checkbox` is the multiple choice
 *   of `nph-multi-combobox` (amendment of P91 in P96): an `nph-checkbox` at the start,
 *   checked while selected, and no selected background and no check. The box is `inert`
 *   and hidden from the screen reader, as in `nph-dropdown-menu` (P92): the option
 *   carries the role and the state;
 * - `rich` and `description` (DSA-91, P134): `rich` turns on the rich look of the option, the
 *   one with a description below the label (the Figma `nph-select / opção rica`, `6910:7093`).
 *   It reflects, because the internal CSS selects the look by it. The plain option keeps the
 *   look it always had; the rich look is a choice of the option, not of the list, so one list
 *   may hold both (the create row of `nph-combobox` is plain). `description` is the text
 *   below the label, already localized; empty turns it off, and it is drawn only with `rich`.
 *   The description reaches the screen reader as the description of the option through
 *   `ElementInternals`, since an id does not cross the shadow root while the focus stays on
 *   the field of the list. The rich option has no selected background: the check or the
 *   checked box says the choice;
 * - `value`: the value the option gives the form. Reflects. Without the attribute,
 *   it is the label text with its white space collapsed, as in `<option>`;
 * - `selected`, `active` and `keyboard`: written by the list that owns the option, not by the
 *   consumer, and never reflected. `selected` draws the `color/primary-surface`
 *   background and the check; `active` is the option the pointer or the keyboard is
 *   on, with the hover look (D5). The selected background wins over `active`. `keyboard`
 *   says the active option got there by the keyboard: only then the rich option draws the
 *   focus border and the halo of the list items (DSA-91, item 9), never on a pointer hover;
 * - role `option`, `aria-selected` and `aria-disabled` through `ElementInternals`, so
 *   the option writes no attribute on its own host. The start, the dot and the check
 *   are hidden from the screen reader: the text says the option;
 * - no event of its own, no `::part`, no color property. The owning list handles
 *   the pointer and the keyboard;
 * - invalid input does not render and emits `console.error` only in development, one
 *   per cause and accumulating (P21 rule): a `start` outside the four, a `status`
 *   outside the six, an `icon` outside the core and a `marker` outside the two. An option that does not render
 *   cannot be chosen.
 *
 * The owning list learns that a property of the option changed through
 * `NPH_OPTION_CHANGED`: a symbol the list implements a method under, so another
 * list (the `nph-combobox`) takes the same contract without a public method or an
 * event.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-avatar/nph-avatar';
import '../nph-checkbox/nph-checkbox';
import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import optionCss from './nph-option.css?inline';
import richCss from './nph-option.rich.css?inline';

const TAG = 'nph-option';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The four starts of the option (the Figma `início`). */
export const NPH_OPTION_STARTS = ['none', 'icon', 'avatar', 'dot'] as const;
export type NphOptionStart = (typeof NPH_OPTION_STARTS)[number];

/** The states of the dot (D6): every `status/*` and the neutral state. */
export const NPH_OPTION_STATUSES = ['neutral', 'info', 'warning', 'success', 'error', 'help'] as const;
export type NphOptionStatus = (typeof NPH_OPTION_STATUSES)[number];

/** The two markers of the option (the Figma `marcador`): single and multiple choice. */
export const NPH_OPTION_MARKERS = ['check', 'checkbox'] as const;
export type NphOptionMarker = (typeof NPH_OPTION_MARKERS)[number];

/** The default start icon (D4). */
export const NPH_OPTION_DEFAULT_ICON = 'globe';

/**
 * The method a list that owns options implements to hear that a property of one of
 * them changed. A symbol, so the method is not a public name of the list; the list
 * marks it `@internal`, which keeps it out of the manifest.
 */
export const NPH_OPTION_CHANGED = Symbol('nph-option-changed');

/**
 * Whether a pointer event is a real move. After the keyboard scrolls the list, the browser
 * repeats the last position of the pointer as a move; that is not the person using the pointer,
 * so a list that tells the keyboard from the pointer (`keyboard`) reads it with this.
 */
export function pointerMoved(last: readonly [number, number] | null, event: PointerEvent): boolean {
  return last === null || last[0] !== event.clientX || last[1] !== event.clientY;
}

/** A list that owns options: `nph-select`, and later `nph-combobox`. */
export interface NphOptionOwner {
  [NPH_OPTION_CHANGED](option: NphOption): void;
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/** The text of a node with its white space collapsed, as `<option>` gives its `text`. */
export function collapsedText(node: Node): string {
  return (node.textContent ?? '').replace(/[\t\n\f\r ]+/g, ' ').trim();
}

function isOwner(element: Element | null): element is Element & NphOptionOwner {
  return element !== null && typeof (element as Partial<NphOptionOwner>)[NPH_OPTION_CHANGED] === 'function';
}

export class NphOption extends LitElement {
  static override styles = [unsafeCSS(optionCss), unsafeCSS(richCss)];

  static override properties = {
    secondary: { type: String },
    start: { type: String },
    icon: { type: String },
    src: { type: String },
    status: { type: String },
    /* `marker` reflects: the internal CSS selects the selected look by it. */
    marker: { type: String, reflect: true },
    /* `rich` reflects: the internal CSS selects the rich look by it. */
    rich: { type: Boolean, reflect: true },
    description: { type: String },
    /* `disabled` reflects: the internal CSS and the consumer's selectors read it. */
    disabled: { type: Boolean, reflect: true },
  };

  /** The helper text after the label. Empty turns it off. Already localized. */
  declare secondary: string;
  declare start: string;
  /** A core icon name, drawn with `start="icon"`. */
  declare icon: string;
  /** The photo of the avatar, with `start="avatar"`. Empty is the empty avatar. */
  declare src: string;
  /** The color of the dot, with `start="dot"`. Absent, the text color. */
  declare status: string | null;
  /** `check` (default) or `checkbox`: the single or the multiple choice. */
  declare marker: string;
  /** The rich look: a description below the label, a softer hover and no selected background. */
  declare rich: boolean;
  /** The text below the label of a rich option. Already localized. Empty turns it off. */
  declare description: string;
  declare disabled: boolean;

  private readonly internals: ElementInternals;
  private valid = false;
  private isSelected = false;
  private isActive = false;
  private isKeyboard = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.secondary = '';
    this.start = 'none';
    this.icon = NPH_OPTION_DEFAULT_ICON;
    this.src = '';
    this.status = null;
    this.marker = 'check';
    this.rich = false;
    this.description = '';
    this.disabled = false;
  }

  /*
   * The role and the selected state go to `ElementInternals` here, not in the constructor:
   * the manifest analyzer reads assignments in the constructor as public fields.
   */
  override connectedCallback(): void {
    super.connectedCallback();
    this.internals.role = 'option';
    this.internals.ariaSelected = this.isSelected ? 'true' : 'false';
  }

  /** The value for the form. Without the attribute, the label text. */
  get value(): string {
    return this.getAttribute('value') ?? collapsedText(this);
  }

  set value(next: string) {
    this.setAttribute('value', next === null || next === undefined ? '' : String(next));
  }

  /** Chosen in the owning list. Written by the list, not by the consumer. */
  get selected(): boolean {
    return this.isSelected;
  }

  set selected(next: boolean) {
    const value = Boolean(next);
    if (value === this.isSelected) {
      return;
    }
    this.isSelected = value;
    this.internals.ariaSelected = value ? 'true' : 'false';
    this.toggleState('selected', value);
    this.requestUpdate();
  }

  /** The option the pointer or the keyboard is on. Written by the list, not by the consumer. */
  get active(): boolean {
    return this.isActive;
  }

  set active(next: boolean) {
    const value = Boolean(next);
    if (value === this.isActive) {
      return;
    }
    this.isActive = value;
    this.toggleState('active', value);
  }

  /** The active option got there by the keyboard. Written by the list, not by the consumer. */
  get keyboard(): boolean {
    return this.isKeyboard;
  }

  set keyboard(next: boolean) {
    const value = Boolean(next);
    if (value === this.isKeyboard) {
      return;
    }
    this.isKeyboard = value;
    this.toggleState('keyboard', value);
  }

  private toggleState(name: string, on: boolean): void {
    if (on) {
      this.internals.states.add(name);
    } else {
      this.internals.states.delete(name);
    }
  }

  /* --- Validation of the input ---------------------------------------------- */

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has('disabled')) {
      this.internals.ariaDisabled = this.disabled ? 'true' : null;
    }
    if (changed.has('description') || changed.has('rich')) {
      const description = this.rich ? (this.description ?? '').trim() : '';
      this.internals.ariaDescription = description === '' ? null : description;
    }
    const decisive = ['start', 'icon', 'status', 'marker'].some((name) => changed.has(name));
    if (!decisive) {
      return;
    }
    const start = (this.start ?? '').trim();
    const icon = (this.icon ?? '').trim();
    const status = this.status === null || this.status === undefined ? null : this.status.trim();
    const marker = (this.marker ?? '').trim();
    let valid = true;

    if (!oneOf(NPH_OPTION_STARTS, start)) {
      devError(`start "${start}" does not exist. Use ${NPH_OPTION_STARTS.join(', ')}.`);
      valid = false;
    }
    if (!isCoreName(icon)) {
      devError(`icon "${icon}" is not a core name of nph-icon.`);
      valid = false;
    }
    if (status !== null && !oneOf(NPH_OPTION_STATUSES, status)) {
      devError(`status "${status}" does not exist. Use ${NPH_OPTION_STATUSES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_OPTION_MARKERS, marker)) {
      devError(`marker "${marker}" does not exist. Use ${NPH_OPTION_MARKERS.join(' or ')}.`);
      valid = false;
    }

    this.valid = valid;
    this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
  }

  /** The owning list redraws what it shows of this option (the trigger text and start). */
  protected override updated(): void {
    const owner = this.parentElement;
    if (isOwner(owner)) {
      owner[NPH_OPTION_CHANGED](this);
    }
  }

  /* --- Drawing ---------------------------------------------------------------- */

  private startArt(): TemplateResult | typeof nothing {
    switch ((this.start ?? '').trim()) {
      case 'icon':
        return html`<nph-icon class="start" name=${(this.icon ?? '').trim()} size="md" aria-hidden="true"></nph-icon>`;
      case 'avatar':
        return html`<nph-avatar class="start" size="sm" src=${(this.src ?? '').trim()} aria-hidden="true"></nph-avatar>`;
      case 'dot': {
        const status = (this.status ?? '').trim();
        return html`<span class="start dot-box" aria-hidden="true"><span class="dot" data-status=${status === '' ? nothing : status}></span></span>`;
      }
      default:
        return nothing;
    }
  }

  /** The box of the `checkbox` marker, named by the label text so the checkbox renders. */
  private box(): TemplateResult {
    return html`<nph-checkbox class="box" inert aria-hidden="true" label=${collapsedText(this)} .checked=${this.isSelected}></nph-checkbox>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const secondary = (this.secondary ?? '').trim();
    const checkbox = (this.marker ?? '').trim() === 'checkbox';
    const check = this.isSelected && !checkbox ? html`<nph-icon class="check" name="check" size="sm" aria-hidden="true"></nph-icon>` : nothing;
    const text = html`<span class="text">
        <span class="label"><slot @slotchange=${checkbox ? this.onSlotchange : nothing}></slot></span>
        ${secondary === '' ? nothing : html`<span class="secondary">${secondary}</span>`}
      </span>`;
    if (this.rich) {
      /* The rich look: the layers under and around the option, and the description below the label line. */
      const description = (this.description ?? '').trim();
      return html`<span class="layer" aria-hidden="true"></span><span class="focus-border" aria-hidden="true"></span
        ><span class="focus-halo" aria-hidden="true"></span>${checkbox ? this.box() : nothing}${this.startArt()}
        <span class="body">${text}${description === '' ? nothing : html`<span class="description" aria-hidden="true">${description}</span>`}</span>
        ${check}`;
    }
    return html`${checkbox ? this.box() : nothing}${this.startArt()}
      ${text}
      ${check}`;
  }

  /** The label text names the box: a new text draws it again. */
  private onSlotchange(): void {
    this.requestUpdate();
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphOption);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-option': NphOption;
  }
}
