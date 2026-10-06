/**
 * `nph-badge` — the badge that labels the state or category of an item.
 *
 * Contract accepted in Figma (frame `1196:1100`, set `878:30`) and P68:
 * - `severity` (the Figma `tipo`): `primary` (default), `secondary`, `info`,
 *   `warn`, `help`, `danger` or `success`. Chosen by meaning;
 * - `emphasis` (the `enfase`): `solid` (default) or `light`;
 * - `text`: one or two words. It is the accessible name. If there is nothing
 *   to write, there is no badge: empty or whitespace-only shows nothing, no error;
 * - `icon`: optional, a `nph-icon` core name, before the text, at
 *   `icon/size-sm` and in the text color. It only reinforces the word: it is decorative;
 * - no click, focus, hover, event, slot, color property or `::part`;
 * - invalid `severity`, `emphasis` or `icon` do not render and emit
 *   `console.error` in development only, one per cause (P68, rule of P21).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import badgeCss from './nph-badge.css?inline';

const TAG = 'nph-badge';

/** Internal marker, not API: present only when a badge is drawn. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_BADGE_SEVERITIES = [
  'primary',
  'secondary',
  'info',
  'warn',
  'help',
  'danger',
  'success',
] as const;
export type NphBadgeSeverity = (typeof NPH_BADGE_SEVERITIES)[number];

export const NPH_BADGE_EMPHASES = ['solid', 'light'] as const;
export type NphBadgeEmphasis = (typeof NPH_BADGE_EMPHASES)[number];

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

export class NphBadge extends LitElement {
  static override styles = unsafeCSS(badgeCss);

  static override properties = {
    /* `severity` and `emphasis` reflect because the internal CSS selects on them. */
    severity: { type: String, reflect: true },
    emphasis: { type: String, reflect: true },
    text: { type: String },
    icon: { type: String },
  };

  /** The badge type, by meaning. */
  declare severity: NphBadgeSeverity;

  /** `solid` or `light`. */
  declare emphasis: NphBadgeEmphasis;

  /** One or two words, already localized by the consuming application. */
  declare text: string;

  /** Core icon name, or empty for none. */
  declare icon: string;

  private valid = false;

  constructor() {
    super();
    this.severity = 'primary';
    this.emphasis = 'solid';
    this.text = '';
    this.icon = '';
  }

  protected override willUpdate(): void {
    const severity = this.severity ?? '';
    const emphasis = this.emphasis ?? '';
    const icon = (this.icon ?? '').trim();
    let valid = true;
    if (!oneOf(NPH_BADGE_SEVERITIES, severity)) {
      devError(`severity "${severity}" does not exist. Use ${NPH_BADGE_SEVERITIES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_BADGE_EMPHASES, emphasis)) {
      devError(`emphasis "${emphasis}" does not exist. Use solid or light.`);
      valid = false;
    }
    if (icon !== '' && !isCoreName(icon)) {
      devError(`icon "${icon}" is not a core name of nph-icon.`);
      valid = false;
    }
    /* Empty text is a mounting case, not an error: no word, no badge. */
    this.valid = valid && (this.text ?? '').trim() !== '';
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const icon = (this.icon ?? '').trim();
    return html`${icon !== '' ? html`<nph-icon class="icon" name=${icon} size="sm"></nph-icon>` : nothing}<span
        class="text"
        >${(this.text ?? '').trim()}</span
      >`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphBadge);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-badge': NphBadge;
  }
}
