/**
 * `nph-button` — the button that triggers an action identified by text.
 *
 * Contract accepted in Figma (frame `1197:5449`, sets `461:13009`, with
 * text, and `498:15671`, icon only), decisions B1, B5 and B6 of the `Registro` (vault),
 * solid hover on the hover tokens (02-10-2026, supersedes B4) and P68:
 * - `severity` (the Figma `tipo`): `primary` (default), `secondary`, `info`,
 *   `warn`, `help`, `danger` or `success`. Chosen by the meaning of the action;
 * - `emphasis` (the `enfase`): `solid` (default), `outline`, `light` or `ghost`.
 *   `outline`, `light` and `ghost` exist only in primary, secondary and danger (B1);
 * - `size`: `compact`, `default` (default, by Indiane's decision on
 *   05-10-2026, via T4) or `large`;
 * - `text`: says what happens on click. It is the accessible name;
 * - `icon-start` and `icon-end`: one `nph-icon` core name each, at
 *   `icon/size-sm` with text. They can coexist (B6);
 * - without text, the button is the "icon only" (B5): a single icon that follows the box
 *   (sm in compact, md in default, lg in large), and `label` is required as the
 *   accessible name (name decided by Indiane on 05-10-2026);
 * - `disabled`: the whole button at `state/disabled-opacity` and out of the Tab order;
 * - `loading` (the `carregando`): the `nph-spinner` replaces the start
 *   icon, the end icon disappears and the text stays. The button remains
 *   focusable and the click does not reach the consumer;
 * - no slot, no own event, no color property and no `::part`. The
 *   click is the native `click`, which crosses the shadow root;
 * - invalid input does not render and emits `console.error` only in
 *   development, one per cause and accumulating (P68, P21 rule). No text and
 *   no icon is a mount: nothing, no error (precedent of `nph-kbd`, P66).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import '../nph-spinner/nph-spinner';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import type { NphIconSize } from '../nph-icon/nph-icon.icons';
import buttonCss from './nph-button.css?inline';

const TAG = 'nph-button';

/** Internal markers, not API. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';
const ICON_ONLY_ATTRIBUTE = 'data-nph-icon-only';

export const NPH_BUTTON_SEVERITIES = [
  'primary',
  'secondary',
  'info',
  'warn',
  'help',
  'danger',
  'success',
] as const;
export type NphButtonSeverity = (typeof NPH_BUTTON_SEVERITIES)[number];

export const NPH_BUTTON_EMPHASES = ['solid', 'outline', 'light', 'ghost'] as const;
export type NphButtonEmphasis = (typeof NPH_BUTTON_EMPHASES)[number];

export const NPH_BUTTON_SIZES = ['compact', 'default', 'large'] as const;
export type NphButtonSize = (typeof NPH_BUTTON_SIZES)[number];

/** The severities that exist only in `solid` (B1). */
const SOLID_ONLY: readonly NphButtonSeverity[] = ['info', 'warn', 'help', 'success'];

/** In icon-only, the icon follows the box (Description of `498:15671`). */
const ICON_ONLY_ICON_SIZE: Readonly<Record<NphButtonSize, NphIconSize>> = {
  compact: 'sm',
  default: 'md',
  large: 'lg',
};

/** The icon-only spinner: `sm` in compact, `md` in default and large (Figma). */
const ICON_ONLY_SPINNER_SIZE: Readonly<Record<NphButtonSize, 'sm' | 'md'>> = {
  compact: 'sm',
  default: 'md',
  large: 'md',
};

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

export class NphButton extends LitElement {
  static override styles = unsafeCSS(buttonCss);

  /* Host focus goes to the inner native `<button>`. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    severity: { type: String, reflect: true },
    emphasis: { type: String, reflect: true },
    size: { type: String, reflect: true },
    text: { type: String },
    iconStart: { type: String, attribute: 'icon-start' },
    iconEnd: { type: String, attribute: 'icon-end' },
    label: { type: String },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
  };

  declare severity: NphButtonSeverity;
  declare emphasis: NphButtonEmphasis;
  declare size: NphButtonSize;
  /** What happens on click, already localized by the consuming application. */
  declare text: string;
  declare iconStart: string;
  declare iconEnd: string;
  /** Accessible name of the icon-only button. With text, it is not used. */
  declare label: string;
  declare disabled: boolean;
  declare loading: boolean;

  private valid = false;
  private iconOnly = false;

  constructor() {
    super();
    this.severity = 'primary';
    this.emphasis = 'solid';
    this.size = 'default';
    this.text = '';
    this.iconStart = '';
    this.iconEnd = '';
    this.label = '';
    this.disabled = false;
    this.loading = false;
    /* `click()` called on the host itself also stops in disabled and loading. */
    this.addEventListener('click', (event) => this.blockInactive(event), { capture: true });
  }

  /** In disabled or loading, the click does not reach the consumer. */
  private blockInactive(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  protected override willUpdate(_changed: PropertyValues): void {
    const severity = this.severity ?? '';
    const emphasis = this.emphasis ?? '';
    const size = this.size ?? '';
    const text = (this.text ?? '').trim();
    const start = (this.iconStart ?? '').trim();
    const end = (this.iconEnd ?? '').trim();
    let valid = true;

    if (!oneOf(NPH_BUTTON_SEVERITIES, severity)) {
      devError(`severity "${severity}" does not exist. Use ${NPH_BUTTON_SEVERITIES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_BUTTON_EMPHASES, emphasis)) {
      devError(`emphasis "${emphasis}" does not exist. Use ${NPH_BUTTON_EMPHASES.join(', ')}.`);
      valid = false;
    } else if (emphasis !== 'solid' && (SOLID_ONLY as readonly string[]).includes(severity)) {
      devError(`emphasis "${emphasis}" does not exist in severity "${severity}": only solid (B1).`);
      valid = false;
    }
    if (!oneOf(NPH_BUTTON_SIZES, size)) {
      devError(`size "${size}" does not exist. Use ${NPH_BUTTON_SIZES.join(', ')}.`);
      valid = false;
    }
    if (start !== '' && !isCoreName(start)) {
      devError(`icon-start "${start}" is not a core name of nph-icon.`);
      valid = false;
    }
    if (end !== '' && !isCoreName(end)) {
      devError(`icon-end "${end}" is not a core name of nph-icon.`);
      valid = false;
    }

    const icons = (start !== '' ? 1 : 0) + (end !== '' ? 1 : 0);
    if (text === '' && icons === 2) {
      devError('without text, the button has a single icon: two icons without a label do not say the action.');
      valid = false;
    }
    if (text === '' && icons === 1 && (this.label ?? '').trim() === '') {
      devError('without text, the button needs a label: it is the accessible name of the icon-only button.');
      valid = false;
    }

    /* No text and no icon is a mount, not an error: nothing to draw. */
    this.valid = valid && (text !== '' || icons > 0);
    this.iconOnly = text === '' && icons === 1;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    this.toggleAttribute(ICON_ONLY_ATTRIBUTE, this.valid && this.iconOnly);
  }

  private glyph(name: string, size: NphIconSize): TemplateResult {
    return html`<nph-icon class="icon" name=${name} size=${size}></nph-icon>`;
  }

  private spinner(size: 'sm' | 'md'): TemplateResult {
    return html`<nph-spinner class="icon" size=${size}></nph-spinner>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const size = this.size;
    const text = (this.text ?? '').trim();
    const start = (this.iconStart ?? '').trim();
    const end = (this.iconEnd ?? '').trim();

    let content: TemplateResult;
    if (this.iconOnly) {
      content = this.loading
        ? this.spinner(ICON_ONLY_SPINNER_SIZE[size])
        : this.glyph(start || end, ICON_ONLY_ICON_SIZE[size]);
    } else {
      const lead = this.loading ? this.spinner('sm') : start !== '' ? this.glyph(start, 'sm') : nothing;
      const tail = !this.loading && end !== '' ? this.glyph(end, 'sm') : nothing;
      content = html`${lead}<span class="text">${text}</span>${tail}`;
    }

    return html`<button
      class="control"
      type="button"
      ?disabled=${this.disabled}
      aria-label=${this.iconOnly ? (this.label ?? '').trim() : nothing}
      aria-disabled=${this.loading && !this.disabled ? 'true' : nothing}
      aria-busy=${this.loading ? 'true' : nothing}
      @click=${(event: Event) => this.blockInactive(event)}
    >
      ${content}
    </button>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-button': NphButton;
  }
}
