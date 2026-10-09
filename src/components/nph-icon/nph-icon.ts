/**
 * `nph-icon` — first component of Nephos.
 *
 * Approved contract (spec `nph-icon`, `design.md` `contrato_nph_icon`, P21):
 * - `name` required, kebab-case, restricted to the core icons
 *   (`NPH_ICON_NAMES`, from `design.md` `icones_nucleo`);
 * - `variant` `light` by default; `solid` available for every approved name;
 * - `size` required, `sm`, `md` or `lg`, with no default and no free value;
 * - `label` absent, empty or whitespace-only after `trim` is decorative;
 * - no slots, events, focus, click, touch, color property or `::part`;
 * - invalid input renders no icon and emits `console.error` only in
 *   development, with no visual fallback.
 *
 * Encapsulation in open Shadow DOM (P01). Color is NOT a property: the
 * drawing inherits `currentColor` from the context. The space up to the text
 * (`space/inline-tight`) belongs to the container that composes icon and text,
 * never to this element.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import iconCss from './nph-icon.css?inline';
import {
  NPH_ICON_NAMES,
  findGlyph,
  isCoreName,
  isSize,
  isVariant,
} from './nph-icon.icons';
import type { NphIconName, NphIconSize, NphIconVariant } from './nph-icon.icons';

const TAG = 'nph-icon';

/** Internal mark, not API: present only when valid artwork is drawn. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** What `render` needs to know. Extracted from the Font Awesome definition. */
interface Drawing {
  readonly width: number;
  readonly height: number;
  readonly path: string;
}

/**
 * Development error. Outside a bundler that defines `import.meta.env`,
 * the optional chaining simply stays silent — it never breaks the page.
 */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function quote(value: string | null): string {
  return value === null ? 'absent' : `"${value}"`;
}

export class NphIcon extends LitElement {
  static override styles = unsafeCSS(iconCss);

  static override properties = {
    name: { type: String },
    variant: { type: String },
    /* `size` reflects because the internal CSS selects the box by it. */
    size: { type: String, reflect: true },
    label: { type: String },
  };

  /** Icon name in the Nephos core, in kebab-case. Required. */
  name: NphIconName | null = null;

  /** `light` when absent; `solid` exists for every approved name. */
  variant: NphIconVariant | null = null;

  /** `sm`, `md` or `lg`. Required: there is no default. */
  size: NphIconSize | null = null;

  /** Accessible name. Empty or whitespace-only makes the icon decorative. */
  label: string | null = null;

  private drawing: Drawing | undefined = undefined;

  protected override willUpdate(): void {
    this.drawing = this.resolveDrawing();
    this.applySemantics();
  }

  /**
   * Validates the three contract properties and returns the drawing, or
   * `undefined` when any one fails. Each failure emits its own error:
   * whoever is developing needs to know ALL the causes, not just the
   * first.
   */
  private resolveDrawing(): Drawing | undefined {
    const name = this.name;
    const variant = this.variant ?? 'light';
    const size = this.size;

    const validName = name !== null && isCoreName(name);
    const validVariant = isVariant(variant);
    const validSize = size !== null && isSize(size);

    if (!validName) {
      devError(
        `name ${quote(name)} does not belong to the Nephos core. ` +
          `Use one of the ${NPH_ICON_NAMES.length} approved names, in kebab-case.`,
      );
    }
    if (!validVariant) {
      devError(
        `variant ${quote(this.variant)} does not exist. Use "light" or "solid".`,
      );
    }
    if (!validSize) {
      devError(
        `size ${quote(size)} does not exist. Use "sm", "md" or "lg" — there is no default or free value.`,
      );
    }
    if (!validName || !validVariant || !validSize) {
      return undefined;
    }

    const glyph = findGlyph(name, variant);
    if (glyph === undefined) {
      devError(
        `there is no "${variant}" artwork for name "${name}".`,
      );
      return undefined;
    }

    const [width, height, , , path] = glyph.icon;
    if (typeof path !== 'string') {
      /* A multiple path is Duotone, which is not in the closed map. */
      devError(`the artwork of "${name}" does not have a single path.`);
      return undefined;
    }

    return { width, height, path };
  }

  /**
   * Semantics on the HOST, not on the SVG: the host is what assistive
   * technology sees. Without valid artwork the element stays out of the
   * accessibility tree, because there is nothing to announce.
   */
  private applySemantics(): void {
    const label = (this.label ?? '').trim();
    const nameable = this.drawing !== undefined && label !== '';

    if (nameable) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }

    this.toggleAttribute(RENDERED_ATTRIBUTE, this.drawing !== undefined);
  }

  protected override render(): TemplateResult | typeof nothing {
    const drawing = this.drawing;
    if (drawing === undefined) {
      return nothing;
    }

    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${drawing.width} ${drawing.height}"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d=${drawing.path}></path>
    </svg>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphIcon);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-icon': NphIcon;
  }
}
