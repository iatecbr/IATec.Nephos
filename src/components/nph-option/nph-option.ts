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
 * - `value`: the value the option gives the form. Reflects. Without the attribute,
 *   it is the label text with its white space collapsed, as in `<option>`;
 * - `selected` and `active`: written by the list that owns the option, not by the
 *   consumer, and never reflected. `selected` draws the `color/primary-surface`
 *   background and the check; `active` is the option the pointer or the keyboard is
 *   on, with the hover look (D5). The selected background wins over `active`;
 * - role `option`, `aria-selected` and `aria-disabled` through `ElementInternals`, so
 *   the option writes no attribute on its own host. The start, the dot and the check
 *   are hidden from the screen reader: the text says the option;
 * - no event of its own, no `::part`, no color property. The owning list handles
 *   the pointer and the keyboard;
 * - invalid input does not render and emits `console.error` only in development, one
 *   per cause and accumulating (P21 rule): a `start` outside the four, a `status`
 *   outside the six and an `icon` outside the core. An option that does not render
 *   cannot be chosen.
 *
 * The owning list learns that a property of the option changed through
 * `NPH_OPTION_CHANGED`: a symbol, not API, so another list (the `nph-combobox`)
 * takes the same contract without a public method or an event.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-avatar/nph-avatar';
import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import optionCss from './nph-option.css?inline';

const TAG = 'nph-option';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The four starts of the option (the Figma `início`). */
export const NPH_OPTION_STARTS = ['none', 'icon', 'avatar', 'dot'] as const;
export type NphOptionStart = (typeof NPH_OPTION_STARTS)[number];

/** The states of the dot (D6): every `status/*` and the neutral state. */
export const NPH_OPTION_STATUSES = ['neutral', 'info', 'warning', 'success', 'error', 'help'] as const;
export type NphOptionStatus = (typeof NPH_OPTION_STATUSES)[number];

/** The default start icon (D4). */
export const NPH_OPTION_DEFAULT_ICON = 'globe';

/**
 * The method a list that owns options implements to hear that a property of one of
 * them changed. A symbol, so it is not public API and does not reach the manifest.
 */
export const NPH_OPTION_CHANGED = Symbol('nph-option-changed');

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
  static override styles = unsafeCSS(optionCss);

  static override properties = {
    secondary: { type: String },
    start: { type: String },
    icon: { type: String },
    src: { type: String },
    status: { type: String },
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
  declare disabled: boolean;

  private readonly internals: ElementInternals;
  private valid = false;
  private isSelected = false;
  private isActive = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.internals.role = 'option';
    this.internals.ariaSelected = 'false';
    this.secondary = '';
    this.start = 'none';
    this.icon = NPH_OPTION_DEFAULT_ICON;
    this.src = '';
    this.status = null;
    this.disabled = false;
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
    const decisive = ['start', 'icon', 'status'].some((name) => changed.has(name));
    if (!decisive) {
      return;
    }
    const start = (this.start ?? '').trim();
    const icon = (this.icon ?? '').trim();
    const status = this.status === null || this.status === undefined ? null : this.status.trim();
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

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const secondary = (this.secondary ?? '').trim();
    return html`${this.startArt()}
      <span class="text">
        <span class="label"><slot></slot></span>
        ${secondary === '' ? nothing : html`<span class="secondary">${secondary}</span>`}
      </span>
      ${this.isSelected ? html`<nph-icon class="check" name="check" size="sm" aria-hidden="true"></nph-icon>` : nothing}`;
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
