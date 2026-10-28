/**
 * `nph-chip` — the small rounded piece for an applied filter, a value chosen in a field or a
 * quick filter that the person checks and unchecks.
 *
 * Contract accepted in Figma (board `3077:807`, documentation `3077:2240`, set `3076:1439`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-57, sheet
 * `fichas/nph-chip.md` and decision P100 — nph-chip: API and semantics:
 * - `type` (the Figma `tipo`): `removable` (default) has an X that takes the value away and a
 *   body with no action; `selectable` is a quick filter, the whole chip a toggle button with
 *   `aria-pressed`. Reflects, because the internal CSS selects on it;
 * - `severity` (the Figma `cor`): `default`, `success`, `warning`, `error`, `info` or `help`.
 *   A status color exists only on a removable chip with text content. Reflects;
 * - `size` (the Figma `tamanho`): `compact` (default, the default of the set) or `default`.
 *   The X target is the same in both. Reflects;
 * - `text`: the label, one line, cut with an ellipsis at `chip/max-width`. When it is cut,
 *   the whole text shows in an `nph-tooltip` on hover and on keyboard focus (D-3). No text is
 *   a mount: nothing, no error (precedent of `nph-badge`, P68);
 * - the Figma `conteúdo` is not a property: `icon` (a core name of `nph-icon`), `avatar`
 *   (with `avatar-src`, the photo; removable only) or `counter` (a whole number from zero up;
 *   selectable only), at most one of them. Icon and avatar are decorative;
 * - `remove-label`: the word the X says before the text, as `nph-multi-combobox` (P96), so
 *   the X reads "Remove filter Status: Waiting". Required while the X shows on a removable
 *   chip;
 * - `selected`: the checked selectable chip (the Figma `selecionado`). It shows the X, a mark
 *   only: the click belongs to the whole chip;
 * - `marked`, `readonly` and `invalid`: the removable states `marcado` (the last chip of a
 *   field, ready to leave), `somente leitura` (no X) and `inválido`, in the default severity
 *   and one at a time;
 * - `disabled`: the whole chip at `state/disabled-opacity`, out of the Tab order, with no
 *   click and no balloon. It wins over the other states, with no error (precedent of P73);
 * - own events, fired only by the person, never by code: `nph-remove` (bubbles, composed,
 *   `detail: { text }`) on the X of a removable chip, which does not remove itself; and
 *   `nph-selected-change` (bubbles, composed, `detail: { selected }`) when a selectable chip
 *   is toggled, after `selected` changed;
 * - no slot, no `::part`, no color property and no form association;
 * - invalid input does not render and emits `console.error` only in development, one per
 *   cause (P21): a value outside the lists, an icon outside the core, a combination the
 *   component set does not have and a removable chip with an X and no `remove-label`.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-avatar/nph-avatar';
import '../nph-icon/nph-icon';
import '../nph-tooltip/nph-tooltip';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import chipCss from './nph-chip.css?inline';

const TAG = 'nph-chip';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';
/** The `id` of the element the tooltip of a cut label points at, found by `for`. */
const LABEL_ID = 'label';
const CONTROL_ID = 'control';
/** The `id` of the balloon and of the counter, which name the selectable chip whose label is cut. */
const BALLOON_ID = 'balloon';
const COUNTER_ID = 'counter';

/** The two types of the Figma `tipo`. */
export const NPH_CHIP_TYPES = ['removable', 'selectable'] as const;
export type NphChipType = (typeof NPH_CHIP_TYPES)[number];

/** The six colors of the Figma `cor`, named as the `chip/*` tokens. */
export const NPH_CHIP_SEVERITIES = ['default', 'success', 'warning', 'error', 'info', 'help'] as const;
export type NphChipSeverity = (typeof NPH_CHIP_SEVERITIES)[number];

/** The two sizes of the Figma `tamanho`. */
export const NPH_CHIP_SIZES = ['compact', 'default'] as const;
export type NphChipSize = (typeof NPH_CHIP_SIZES)[number];

/** The icon of the X, as the Figma. */
export const NPH_CHIP_REMOVE_ICON = 'xmark';

/** `nph-remove`: the person pressed the X of a removable chip. */
export const NPH_CHIP_REMOVE_EVENT = 'nph-remove';
export interface NphChipRemoveDetail {
  /** The text of the chip. */
  readonly text: string;
}

/** `nph-selected-change`: the person toggled a selectable chip. */
export const NPH_CHIP_SELECTED_CHANGE_EVENT = 'nph-selected-change';
export interface NphChipSelectedChangeDetail {
  /** The state after the change. */
  readonly selected: boolean;
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

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** A counter is a whole number from zero up: it shows a number only. */
export function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/** The inputs that decide validity; `cut` is the only reactive field that does not. */
const DECISIVE = [
  'type',
  'severity',
  'size',
  'text',
  'icon',
  'avatar',
  'avatarSrc',
  'counter',
  'removeLabel',
  'selected',
  'marked',
  'readonly',
  'invalid',
];

export class NphChip extends LitElement {
  static override styles = unsafeCSS(chipCss);

  /* Host focus goes to the chip button, the X or the cut label. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    type: { type: String, reflect: true },
    severity: { type: String, reflect: true },
    size: { type: String, reflect: true },
    text: { type: String },
    icon: { type: String },
    avatar: { type: Boolean, reflect: true },
    avatarSrc: { type: String, attribute: 'avatar-src' },
    counter: { type: Number },
    removeLabel: { type: String, attribute: 'remove-label' },
    selected: { type: Boolean, reflect: true },
    marked: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    cut: { state: true },
  };

  declare type: NphChipType;
  declare severity: NphChipSeverity;
  declare size: NphChipSize;
  /** The label, already localized by the consuming application. */
  declare text: string;
  /** A core name of `nph-icon`, before the text. */
  declare icon: string;
  /** Draws an `nph-avatar` before the text. */
  declare avatar: boolean;
  /** The photo of the avatar. Without it, the avatar draws the person icon. */
  declare avatarSrc: string;
  declare counter: number | null;
  /** The word the X says before the text, such as `Remove filter`. */
  declare removeLabel: string;
  /** The checked selectable chip. Changing it from code fires nothing. */
  declare selected: boolean;
  declare marked: boolean;
  declare readonly: boolean;
  declare invalid: boolean;
  declare disabled: boolean;
  /** The label does not fit and ends in an ellipsis. Measured, not API. */
  declare protected cut: boolean;

  private valid = false;
  private observed: Element | null = null;
  private resizeObserver: ResizeObserver | undefined;

  constructor() {
    super();
    this.type = 'removable';
    this.severity = 'default';
    this.size = 'compact';
    this.text = '';
    this.icon = '';
    this.avatar = false;
    this.avatarSrc = '';
    this.counter = null;
    this.removeLabel = '';
    this.selected = false;
    this.marked = false;
    this.readonly = false;
    this.invalid = false;
    this.disabled = false;
    this.cut = false;
    /* `click()` called on the host itself also stops in disabled. */
    this.addEventListener('click', (event) => this.blockDisabled(event), { capture: true });
    this.addEventListener('click', (event) => this.toggle(event));
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.measure());
    /* The font changes the width of the text once it loads. */
    document.fonts?.ready.then(() => this.measure());
    /* A chip moved to another place observes its label again: the observer was
       disconnected when it left, and only an update installs it (as nph-table). */
    if (this.hasUpdated) this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.observed = null;
  }

  /** In disabled, the click neither acts nor reaches the consumer. */
  private blockDisabled(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  /** A click on a valid, enabled selectable chip is the person toggling it; not one on the balloon. */
  private toggle(event: Event): void {
    if (!this.valid || this.disabled || this.type !== 'selectable') {
      return;
    }
    if (event.composedPath().some((target) => target instanceof Element && target.localName === 'nph-tooltip')) {
      return;
    }
    this.selected = !this.selected;
    this.dispatchEvent(
      new CustomEvent<NphChipSelectedChangeDetail>(NPH_CHIP_SELECTED_CHANGE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { selected: this.selected },
      }),
    );
  }

  private requestRemove(event: Event): void {
    /* The click on the X is not a click on the chip. */
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent<NphChipRemoveDetail>(NPH_CHIP_REMOVE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { text: trimmed(this.text) },
      }),
    );
  }

  /** The removable chip shows the X unless it is read only. */
  private get hasRemove(): boolean {
    return this.type === 'removable' && !this.readonly;
  }

  private get hasCounter(): boolean {
    return this.counter !== null && this.counter !== undefined;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (![...changed.keys()].some((name) => DECISIVE.includes(name as string))) {
      return;
    }
    const type = this.type ?? '';
    const severity = this.severity ?? '';
    const size = this.size ?? '';
    const icon = trimmed(this.icon);
    let valid = true;

    /* No text is a mount, not an error: nothing to draw and nothing to check. */
    if (trimmed(this.text) === '') {
      this.valid = false;
      this.toggleAttribute(RENDERED_ATTRIBUTE, false);
      return;
    }
    if (!oneOf(NPH_CHIP_TYPES, type)) {
      devError(`type "${type}" does not exist. Use ${NPH_CHIP_TYPES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_CHIP_SEVERITIES, severity)) {
      devError(`severity "${severity}" does not exist. Use ${NPH_CHIP_SEVERITIES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_CHIP_SIZES, size)) {
      devError(`size "${size}" does not exist. Use ${NPH_CHIP_SIZES.join(', ')}.`);
      valid = false;
    }
    if (icon !== '' && !isCoreName(icon)) {
      devError(`icon "${icon}" is not a core name of nph-icon.`);
      valid = false;
    }
    const contents = [icon !== '', this.avatar, this.hasCounter].filter(Boolean).length;
    if (contents > 1) {
      devError('the chip shows one content before or after the text: an icon, an avatar or a counter.');
      valid = false;
    }
    if (trimmed(this.avatarSrc) !== '' && !this.avatar) {
      devError('avatar-src is the photo of the avatar: it needs avatar.');
      valid = false;
    }
    if (this.hasCounter && !isCount(this.counter)) {
      devError('counter shows a whole number from zero up only.');
      valid = false;
    }
    if (type === 'removable') {
      if (this.hasCounter) {
        devError('a removable chip has no counter: the counter belongs to a selectable chip.');
        valid = false;
      }
      if (this.selected) {
        devError('a removable chip is never selected: selected belongs to a selectable chip.');
        valid = false;
      }
      const states = [this.marked, this.readonly, this.invalid].filter(Boolean).length;
      if (states > 1) {
        devError('marked, readonly and invalid are states of their own: set one at a time.');
        valid = false;
      }
      if (severity !== 'default' && states > 0) {
        devError('marked, readonly and invalid exist in the default severity only.');
        valid = false;
      }
      if (severity !== 'default' && (icon !== '' || this.avatar)) {
        devError('a status severity exists only on a chip with text content: no icon and no avatar.');
        valid = false;
      }
      if (this.hasRemove && trimmed(this.removeLabel) === '') {
        devError('the X needs remove-label, the word it says before the text.');
        valid = false;
      }
    }
    if (type === 'selectable') {
      if (this.avatar) {
        devError('a selectable chip has no avatar: the avatar belongs to a removable chip.');
        valid = false;
      }
      if (severity !== 'default') {
        devError('a selectable chip has the default severity only.');
        valid = false;
      }
      if (this.marked || this.readonly || this.invalid) {
        devError('marked, readonly and invalid belong to a removable chip.');
        valid = false;
      }
    }

    this.valid = valid;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  protected override updated(): void {
    /* An update while disconnected records nothing: the label is observed again on reconnection. */
    if (this.resizeObserver === undefined) {
      return;
    }
    const label = this.renderRoot.querySelector('.label');
    if (label === this.observed) {
      /* A new text in a label of the same size moves no observer: measure it here. */
      this.measure();
      return;
    }
    if (this.observed !== null) {
      this.resizeObserver?.unobserve(this.observed);
    }
    this.observed = label;
    if (label !== null) {
      this.resizeObserver?.observe(label);
    }
    this.measure();
  }

  /** The label is cut when its text is wider than its box. */
  private measure(): void {
    const label = this.observed;
    const cut = label !== null && label.scrollWidth > label.clientWidth;
    if (cut !== this.cut) {
      this.cut = cut;
    }
  }

  /** The icon or the avatar before the text: decorative, the click belongs to the chip. */
  private lead(): TemplateResult | typeof nothing {
    const icon = trimmed(this.icon);
    if (icon !== '') {
      return html`<nph-icon class="lead" name=${icon} size="sm"></nph-icon>`;
    }
    if (this.avatar) {
      return html`<nph-avatar class="lead" size="sm" src=${trimmed(this.avatarSrc)}></nph-avatar>`;
    }
    return nothing;
  }

  /** Which end padding applies: the X, the counter or the text. */
  private chipClasses(remove: boolean): string {
    const start = trimmed(this.icon) !== '' ? 'start-icon' : this.avatar ? 'start-avatar' : '';
    const end = remove ? 'end-remove' : this.hasCounter ? 'end-counter' : '';
    return ['chip', start, end].filter(Boolean).join(' ');
  }

  private renderRemovable(text: string, balloon: boolean): TemplateResult {
    const remove = this.hasRemove;
    /* The inactive state is said to assistive technology: WCAG 1.4.3 exempts its text (P72). */
    return html`<span class=${this.chipClasses(remove)} aria-disabled=${this.disabled ? 'true' : nothing}
        >${this.lead()}<span class="label" id=${LABEL_ID} tabindex=${balloon ? '0' : nothing}>${text}</span>${remove
          ? html`<button
              class="remove"
              type="button"
              aria-label=${`${trimmed(this.removeLabel)} ${text}`}
              ?disabled=${this.disabled}
              @click=${(event: Event) => this.requestRemove(event)}
            >
              <nph-icon name=${NPH_CHIP_REMOVE_ICON} size="sm"></nph-icon>
            </button>`
          : nothing}</span
      >${balloon ? html`<nph-tooltip for=${LABEL_ID} .text=${text}></nph-tooltip>` : nothing}`;
  }

  private renderSelectable(text: string, balloon: boolean): TemplateResult {
    /* The space between label and counter keeps the name "Pending 12", not "Pending12". */
    const counter = this.hasCounter ? html` <span class="counter" id=${COUNTER_ID}>${this.counter}</span>` : nothing;
    /*
     * With a cut label, the balloon is the name, as the truncated cell of nph-table (P97): the
     * text is not read again as a description. The counter stays in the name after it.
     */
    const labelledby = balloon ? (this.hasCounter ? `${BALLOON_ID} ${COUNTER_ID}` : BALLOON_ID) : nothing;
    const mark = this.selected ? html`<nph-icon class="mark" name=${NPH_CHIP_REMOVE_ICON} size="sm"></nph-icon>` : nothing;
    return html`<button
        class=${this.chipClasses(this.selected)}
        id=${CONTROL_ID}
        type="button"
        aria-pressed=${this.selected ? 'true' : 'false'}
        aria-labelledby=${labelledby}
        ?disabled=${this.disabled}
      >
        ${this.lead()}<span class="label">${text}</span>${counter}${mark}
      </button>${balloon
        ? html`<nph-tooltip id=${BALLOON_ID} for=${CONTROL_ID} relation="name" .text=${text}></nph-tooltip>`
        : nothing}`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const text = trimmed(this.text);
    /* A disabled chip takes no focus, so it has no balloon. */
    const balloon = this.cut && !this.disabled;
    return this.type === 'selectable' ? this.renderSelectable(text, balloon) : this.renderRemovable(text, balloon);
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphChip);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-chip': NphChip;
  }
  interface HTMLElementEventMap {
    'nph-remove': CustomEvent<NphChipRemoveDetail>;
    'nph-selected-change': CustomEvent<NphChipSelectedChangeDetail>;
  }
}
