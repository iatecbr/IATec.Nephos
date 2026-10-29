/**
 * `nph-togglebutton` — the button that holds a boolean value: on or off.
 *
 * Contract accepted in Figma (frame `1512:27498`, set `1512:719`), sheet
 * `fichas/nph-togglebutton.md`, `design.md` and decision P73 — nph-togglebutton:
 * API and semantics:
 * - `pressed`: the on state (the Figma `marcado`). Reflects, because the
 *   internal CSS selects the on piece by it. The inner native `<button>` carries
 *   `aria-pressed`, not `role="switch"` and not `aria-checked`: this is a button
 *   that keeps a state, and the piece is not `nph-switch` or `nph-checkbox`;
 * - `text`: the label. Without it, the piece is icon only and shows a single icon;
 * - `label`: the accessible name of the icon-only piece (`aria-label` on the
 *   inner button). With text, the name comes from the text and `label` is not used;
 * - `size`: `compact`, `default` (default) or `large`, the Figma `tamanho`. It picks
 *   the height (28, 36 or 44 px) and, in the icon-only piece, the icon size;
 * - `icon-start` and `icon-end`: `auto` draws the pair `xmark` (off) and `check`
 *   (on), cross-faded by opacity; `none` draws no icon on that side; any core name of
 *   `nph-icon` draws that one icon, with no swap. The piece shows one icon at most:
 *   `icon-start` defaults to `auto` and `icon-end` to `none`, and with text both on is
 *   invalid input. Icon only uses `icon-start` alone and ignores `icon-end`;
 * - each icon is drawn `light` and `solid`, stacked: the CSS shows `solid` when the
 *   piece is on or under the pointer, and `light` at rest off and when disabled;
 * - `invalid`: error border on the track. The error message stays outside the piece;
 * - `disabled`: the whole piece at `state/disabled-opacity`, native `disabled` on
 *   the inner button (out of the Tab order). `disabled` wins over `invalid`: the
 *   error border is suppressed and the combination is not an error;
 * - own event `nph-change` (bubbles, composed, not cancelable) with
 *   `detail: { pressed }`, fired only when the person toggles the piece (click,
 *   Enter or Space). Setting `pressed` from code never fires it;
 * - no slot, no `::part`, no form association;
 * - invalid input does not render and emits `console.error` only in development,
 *   one per cause and accumulating (P68, P21 rule): no text and no label, an icon
 *   value outside `auto`, `none` and the core names, icon only with
 *   `icon-start="none"`, a `size` outside the three, and text with both icons on.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import type { NphIconSize } from '../nph-icon/nph-icon.icons';
import togglebuttonCss from './nph-togglebutton.css?inline';

const TAG = 'nph-togglebutton';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The event the piece fires when the person toggles it. */
export const NPH_TOGGLEBUTTON_CHANGE_EVENT = 'nph-change';

/** The two keywords of `icon-start` and `icon-end`; any other value is a core icon name. */
export const NPH_TOGGLEBUTTON_ICON_KEYWORDS = ['auto', 'none'] as const;
export type NphTogglebuttonIconKeyword = (typeof NPH_TOGGLEBUTTON_ICON_KEYWORDS)[number];

/** The pair `auto` draws: off shows the first, on shows the second. */
export const NPH_TOGGLEBUTTON_AUTO_ICONS = ['xmark', 'check'] as const;

/** The sizes of the Figma `tamanho`: 28, 36 and 44 px high. */
export const NPH_TOGGLEBUTTON_SIZES = ['compact', 'default', 'large'] as const;
export type NphTogglebuttonSize = (typeof NPH_TOGGLEBUTTON_SIZES)[number];

/** The icon of the icon-only piece follows the size; with text it is always `sm`. */
const ICON_ONLY_ICON_SIZE: Record<NphTogglebuttonSize, NphIconSize> = { compact: 'sm', default: 'md', large: 'lg' };

export interface NphTogglebuttonChangeDetail {
  /** The state after the change. */
  readonly pressed: boolean;
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function isIconValue(value: string): boolean {
  return (NPH_TOGGLEBUTTON_ICON_KEYWORDS as readonly string[]).includes(value) || isCoreName(value);
}

function isSize(value: string): value is NphTogglebuttonSize {
  return (NPH_TOGGLEBUTTON_SIZES as readonly string[]).includes(value);
}

/** An absent attribute (null or undefined) is the default of that side: `auto` at the start, `none` at the end. */
function iconValue(value: string | null | undefined, fallback: NphTogglebuttonIconKeyword): string {
  return value === null || value === undefined ? fallback : value.trim();
}

export class NphTogglebutton extends LitElement {
  static override styles = unsafeCSS(togglebuttonCss);

  /* Host focus goes to the inner native `<button>`. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    pressed: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    text: { type: String },
    label: { type: String },
    iconStart: { type: String, attribute: 'icon-start' },
    iconEnd: { type: String, attribute: 'icon-end' },
  };

  /** The on state. Changing it from code does not fire `nph-change`. */
  declare pressed: boolean;
  declare invalid: boolean;
  declare disabled: boolean;
  /** `compact`, `default` or `large`. */
  declare size: NphTogglebuttonSize;
  /** The label, already localized by the consuming application. */
  declare text: string;
  /** Accessible name of the icon-only piece. With text, it is not used. */
  declare label: string;
  /** `auto`, `none` or a core icon name. */
  declare iconStart: string;
  /** `auto`, `none` or a core icon name. Ignored when the piece is icon only; with text, only one side is on. */
  declare iconEnd: string;

  private valid = false;
  private iconOnly = false;

  constructor() {
    super();
    this.pressed = false;
    this.invalid = false;
    this.disabled = false;
    this.size = 'default';
    this.text = '';
    this.label = '';
    this.iconStart = 'auto';
    this.iconEnd = 'none';
    /* `click()` called on the host itself also stops in disabled. */
    this.addEventListener('click', (event) => this.blockInactive(event), { capture: true });
    this.addEventListener('click', () => this.toggle());
  }

  /** In disabled, the click neither toggles nor reaches the consumer. */
  private blockInactive(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  /** A click that reached the host in a valid, enabled piece is the person toggling it. */
  private toggle(): void {
    if (!this.valid || this.disabled) {
      return;
    }
    this.pressed = !this.pressed;
    this.dispatchEvent(
      new CustomEvent<NphTogglebuttonChangeDetail>(NPH_TOGGLEBUTTON_CHANGE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { pressed: this.pressed },
      }),
    );
  }

  protected override willUpdate(changed: PropertyValues): void {
    /* Only the inputs that decide validity are checked again, so the errors do not repeat on a toggle. */
    const decisive = ['size', 'text', 'label', 'iconStart', 'iconEnd'].some((name) => changed.has(name));
    if (!decisive) {
      return;
    }
    const text = (this.text ?? '').trim();
    const label = (this.label ?? '').trim();
    const start = iconValue(this.iconStart, 'auto');
    const end = iconValue(this.iconEnd, 'none');
    /* Compared as written: the internal CSS selects the height by the exact reflected attribute. */
    const size = this.size ?? '';
    let valid = true;

    if (!isSize(size)) {
      devError(`size "${size}" does not exist. Use ${NPH_TOGGLEBUTTON_SIZES.join(', ')}.`);
      valid = false;
    }
    if (text === '' && label === '') {
      devError('without text, the piece needs a label: it is the accessible name of the icon-only piece.');
      valid = false;
    }
    if (!isIconValue(start)) {
      devError(`icon-start "${start}" is not "auto", "none" or a core name of nph-icon.`);
      valid = false;
    }
    if (!isIconValue(end)) {
      devError(`icon-end "${end}" is not "auto", "none" or a core name of nph-icon.`);
      valid = false;
    }
    if (text === '' && label !== '' && start === 'none') {
      devError('the icon-only piece shows the icon of icon-start: icon-start="none" leaves it with nothing to draw.');
      valid = false;
    }
    if (text !== '' && start !== 'none' && end !== 'none' && isIconValue(start) && isIconValue(end)) {
      devError('the piece shows one icon at most: turn icon-start or icon-end off with "none".');
      valid = false;
    }

    this.valid = valid;
    this.iconOnly = text === '';
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  /** One name drawn `light` and `solid`, stacked; the CSS shows one by the state. */
  private styles(name: string, which: string, size: NphIconSize): TemplateResult {
    return html`<nph-icon class="glyph ${which} glyph-light" name=${name} size=${size}></nph-icon
      ><nph-icon class="glyph ${which} glyph-solid" name=${name} variant="solid" size=${size}></nph-icon>`;
  }

  /** One icon: the swapping pair, one fixed icon, or nothing. All of its drawings share one cell. */
  private glyph(value: string, size: NphIconSize): TemplateResult | typeof nothing {
    if (value === 'none') {
      return nothing;
    }
    if (value === 'auto') {
      const [off, on] = NPH_TOGGLEBUTTON_AUTO_ICONS;
      return html`<span class="glyphs">${this.styles(off, 'glyph-off', size)}${this.styles(on, 'glyph-on', size)}</span>`;
    }
    return html`<span class="glyphs">${this.styles(value, 'glyph-fixed', size)}</span>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const text = (this.text ?? '').trim();
    const start = iconValue(this.iconStart, 'auto');
    const end = iconValue(this.iconEnd, 'none');

    const content = this.iconOnly
      ? this.glyph(start, ICON_ONLY_ICON_SIZE[this.size])
      : html`${this.glyph(start, 'sm')}<span class="text">${text}</span>${this.glyph(end, 'sm')}`;

    return html`<button
      class="control"
      type="button"
      aria-pressed=${this.pressed ? 'true' : 'false'}
      aria-label=${this.iconOnly ? (this.label ?? '').trim() : nothing}
      ?disabled=${this.disabled}
    >
      <span class="surface">${content}</span>
    </button>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphTogglebutton);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-togglebutton': NphTogglebutton;
  }
  interface HTMLElementEventMap {
    'nph-change': CustomEvent<NphTogglebuttonChangeDetail>;
  }
}
