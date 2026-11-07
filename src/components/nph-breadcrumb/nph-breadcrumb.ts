/**
 * `nph-breadcrumb` — the trail that shows the path to the current page and leads back to each level
 * above.
 *
 * Contract accepted in Figma (documentation frame `4512:4741`, sets `4490:2886`, `4490:2678` and
 * `4490:2697`, separator `1635:16`), recorded as text in the evidence of the `figma-docs-accepted`
 * gate of DSA-66, sheet `fichas/nph-breadcrumb.md`, `design.md` and decision P109 — nph-breadcrumb:
 * API and semantics:
 * - `levels`: the path, in order, from the first level to the current page, as a list of
 *   `{ label, href?, icon? }`. Property only. Every level above the current page is a link and has
 *   `href`; the last one is the current page, in text, and has no `href`. The first level reads
 *   "Home". Texts are already localized by the consuming application;
 * - `collapsed` (the Figma `niveis=recolhido`): off, the trail draws all its levels, 2, 3 or 4, the
 *   counts of the accepted Figma set. On, it draws the first level, the ellipsis button and the last
 *   two levels, and the levels in between sit in the menu the button opens. Collapsed needs 4 levels
 *   or more: with 3 there would be nothing to hide. The consumer chooses it, since the width is its
 *   to know: on a narrow screen the page uses the collapsed trail. Reflects, so the consumer can
 *   style and check the state;
 * - `icon` on a level (the Figma `ícones=com` and `ícone`): the core name of an `nph-icon`, in the
 *   light style on a link and the solid style on the current page. With icons every level has its
 *   own and without icons none does: the two never mix in the same trail;
 * - `label` and the host `aria-label`: the accessible name of the navigation landmark;
 * - `ellipsis-label`: the accessible name of the ellipsis button ("Show hidden levels"), required on
 *   the collapsed trail, because the icon has no text;
 * - no slot, no event, no `::part` and no color property. A link fires nothing of its own: the click
 *   is the native `click`. Activating a hidden level in the menu clicks an anchor of the shadow root
 *   with the same `href`, so it travels the same way, `composed`, `bubbles` and cancelable, and a
 *   router that listens to the click on the document handles it as it handles a visible link.
 *
 * SEMANTICS — a `nav` with a name, holding an ordered list. The current page carries
 * `aria-current="page"` and is not a link. Separators and level icons are decorative and hidden from
 * assistive technology: the name of the level is its label. The ellipsis is a native `button` of the
 * shadow root, which the `nph-dropdown-menu` beside it finds by `for` and on which it writes
 * `aria-haspopup="menu"` and `aria-expanded`; the open state of the button is read from
 * `aria-expanded`, in CSS. The menu is the keyboard pattern of its own sheet (P92): Enter, Space and
 * the down arrow on the button, the arrows inside, Esc closes and gives the focus back.
 *
 * LAYOUT — the trail never wraps and never shrinks: a trail that does not fit is a trail that must be
 * collapsed, and the limit is recorded in the sheet. The hidden levels menu hugs its widest option
 * between `breadcrumb/menu-min-width` and `breadcrumb/menu-max-width`, with the text cut by an
 * ellipsis above the ceiling, where the browser knows `calc-size()`; elsewhere the menu keeps the
 * ceiling as its fixed width. It holds only here: the `nph-dropdown-menu` keeps its own fixed width
 * (accepted point 4 of the evidence), and the breadcrumb reaches it through the one custom property
 * the menu already reads for its width, never through its inside (P02).
 *
 * Invalid input draws nothing and emits `console.error` only in development, one per cause (P66
 * rule): `levels` that is not a list or has fewer than 2 levels; more than 4 levels on a trail that
 * is not collapsed; a collapsed trail with fewer than 4; a level without `label`; a level above the
 * current page without `href`, or the current page with one; an `icon` outside the core or on only
 * some of the levels; an `href` with a protocol other than `http:`, `https:`, `mailto:` or `tel:`
 * (`javascript:` among them, in any spelling the browser reads as such); a collapsed trail without
 * `ellipsis-label`. A trail with no accessible name
 * draws and warns: the name may arrive after the first render.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-dropdown-menu/nph-dropdown-menu';
import '../nph-icon/nph-icon';
import type { NphDropdownMenuEntry, NphDropdownMenuItemSelectDetail } from '../nph-dropdown-menu/nph-dropdown-menu';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import breadcrumbCss from './nph-breadcrumb.css?inline';

const TAG = 'nph-breadcrumb';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The `id` of the ellipsis button, which the menu finds by `for`. */
const ELLIPSIS_ID = 'ellipsis';

/** The counts of the accepted Figma set (`niveis`): 2, 3 or 4 levels. */
export const NPH_BREADCRUMB_MIN_LEVELS = 2;
export const NPH_BREADCRUMB_MAX_LEVELS = 4;

/** The collapsed trail shows the first level, the ellipsis and the last two: it needs one level to hide. */
export const NPH_BREADCRUMB_MIN_COLLAPSED_LEVELS = 4;

/** The protocols a link of the trail may take; a relative path and a fragment resolve to the page's. */
export const NPH_BREADCRUMB_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'] as const;

/**
 * Whether an address may be the `href` of a level. It is parsed as the browser would — tabs and line
 * breaks inside the scheme are dropped — so `java\nscript:` is caught as `javascript:` (the same rule
 * as the link cell of `nph-table`).
 */
export function isSafeHref(href: string): boolean {
  try {
    return (NPH_BREADCRUMB_LINK_PROTOCOLS as readonly string[]).includes(new URL(href, document.baseURI).protocol);
  } catch {
    return false;
  }
}

/** One level of the path. */
export interface NphBreadcrumbLevel {
  /** The text of the level, on one line. Already localized. The first level reads "Home". */
  label: string;
  /** The page the level leads to. Required above the current page; the current page has none. */
  href?: string;
  /** A core name of `nph-icon`. All the levels or none. */
  icon?: string;
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
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

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export class NphBreadcrumb extends LitElement {
  static override styles = unsafeCSS(breadcrumbCss);

  static override properties = {
    levels: { attribute: false },
    collapsed: { type: Boolean, reflect: true },
    label: { type: String },
    ellipsisLabel: { type: String, attribute: 'ellipsis-label' },
    /* The host `aria-label` is the accessible name when there is no `label`. It cannot be a property
     * called `ariaLabel`: that name is the native ARIA reflection of every element. */
    hostName: { type: String, attribute: 'aria-label' },
  };

  /** The path, from the first level to the current page. */
  declare levels: readonly NphBreadcrumbLevel[];

  /** The first level, the ellipsis and the last two. Needs 4 levels or more. */
  declare collapsed: boolean;

  /** The accessible name of the navigation landmark. Already localized. */
  declare label: string | null;

  /** The accessible name of the ellipsis button. Required when collapsed. Already localized. */
  declare ellipsisLabel: string | null;

  /** The host `aria-label`, the accessible name when `label` is not given. */
  declare hostName: string | null;

  private problem: string | null = null;
  private reported = '';
  private warnedNoName = false;
  private hiddenEntries: NphDropdownMenuEntry[] = [];

  constructor() {
    super();
    this.levels = [];
    this.collapsed = false;
    this.label = null;
    this.ellipsisLabel = null;
    this.hostName = null;
  }

  protected override willUpdate(changed: PropertyValues): void {
    this.problem = this.validate();
    if (this.problem !== null) {
      /* One message per cause: a re-render with the same input stays silent. */
      if (this.problem !== this.reported) {
        devError(this.problem);
      }
      this.reported = this.problem;
    } else {
      this.reported = '';
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.problem === null);
    if (this.problem !== null) {
      /* Nothing is kept from an input that was rejected: the list is rebuilt when the trail recovers. */
      this.hiddenEntries = [];
    } else if (changed.has('levels') || changed.has('collapsed') || this.hiddenEntries.length === 0) {
      /* A new list only when the path changes: the menu redraws on a new `items`. */
      this.hiddenEntries = this.collapsed
        ? this.levels.slice(1, this.levels.length - 2).map((level, offset) => ({ value: String(offset + 1), text: text(level.label) }))
        : [];
    }
  }

  protected override updated(): void {
    if (this.problem !== null || this.name() !== null) {
      this.warnedNoName = false;
      return;
    }
    if (!this.warnedNoName) {
      this.warnedNoName = true;
      devWarn('the trail has no accessible name. Give it a `label` or an `aria-label`.');
    }
  }

  /** The reason the input is invalid, or `null`. */
  private validate(): string | null {
    const levels = this.levels;
    if (!Array.isArray(levels)) {
      return '`levels` is not a list. Give it the path, from the first level to the current page.';
    }
    if (levels.length < NPH_BREADCRUMB_MIN_LEVELS) {
      return `levels has ${String(levels.length)} level(s). A trail has at least ${String(NPH_BREADCRUMB_MIN_LEVELS)}: the first level and the current page.`;
    }
    if (this.collapsed) {
      if (levels.length < NPH_BREADCRUMB_MIN_COLLAPSED_LEVELS) {
        return `a collapsed trail needs ${String(NPH_BREADCRUMB_MIN_COLLAPSED_LEVELS)} levels or more, and levels has ${String(levels.length)}: with fewer there is no level to hide. Turn \`collapsed\` off.`;
      }
    } else if (levels.length > NPH_BREADCRUMB_MAX_LEVELS) {
      return `levels has ${String(levels.length)} levels. A trail that is not collapsed draws ${String(NPH_BREADCRUMB_MIN_LEVELS)} to ${String(NPH_BREADCRUMB_MAX_LEVELS)}. Turn \`collapsed\` on.`;
    }
    const last = levels.length - 1;
    let withIcon = 0;
    for (const [index, level] of levels.entries()) {
      if (level === null || typeof level !== 'object' || text(level.label) === '') {
        return `level ${String(index + 1)} has no \`label\`.`;
      }
      const href = text(level.href);
      if (index < last && href === '') {
        return `level ${String(index + 1)} is a link and needs an \`href\`: the page it leads to.`;
      }
      if (index < last && !isSafeHref(href)) {
        return `level ${String(index + 1)} has an unsafe \`href\`. A link takes ${NPH_BREADCRUMB_LINK_PROTOCOLS.join(', ')} or a relative address.`;
      }
      if (index === last && href !== '') {
        return 'the last level is the current page and has no `href`: it is text, not a link.';
      }
      if (level.icon !== undefined && level.icon !== null && text(level.icon) !== '') {
        if (!isCoreName(text(level.icon))) {
          return `icon "${String(level.icon)}" of level ${String(index + 1)} does not belong to the Nephos core.`;
        }
        withIcon += 1;
      }
    }
    if (withIcon !== 0 && withIcon !== levels.length) {
      return 'only some levels have an `icon`. With icons every level has its own; without icons none does.';
    }
    if (this.collapsed && text(this.ellipsisLabel) === '') {
      return 'a collapsed trail needs `ellipsis-label`: it is the accessible name of the ellipsis button.';
    }
    return null;
  }

  /** The accessible name of the landmark: the label, else the host `aria-label`. `null` when there is none. */
  private name(): string | null {
    const label = text(this.label);
    if (label !== '') return label;
    const host = text(this.hostName);
    return host === '' ? null : host;
  }

  /** A hidden level activated in the menu leads where the visible link would: the same native `click`. */
  private onSelect(event: CustomEvent<NphDropdownMenuItemSelectDetail>): void {
    /* The event of the menu is not part of the contract of the trail. */
    event.stopPropagation();
    const level = this.levels[Number(event.detail.value)];
    const href = text(level?.href);
    const proxy = this.renderRoot.querySelector<HTMLAnchorElement>('a.proxy');
    if (href === '' || proxy === null) return;
    proxy.setAttribute('href', href);
    proxy.click();
  }

  private renderIcon(level: NphBreadcrumbLevel, current: boolean): TemplateResult | typeof nothing {
    const icon = text(level.icon);
    return icon === ''
      ? nothing
      : html`<nph-icon class="level-icon" name=${icon} variant=${current ? 'solid' : 'light'} size="sm"></nph-icon>`;
  }

  private renderLevel(index: number): TemplateResult {
    const level = this.levels[index] as NphBreadcrumbLevel;
    const label = text(level.label);
    if (index === this.levels.length - 1) {
      return html`<span class="current" aria-current="page">${this.renderIcon(level, true)}<span class="label">${label}</span></span>`;
    }
    return html`<a class="link" href=${text(level.href)}>${this.renderIcon(level, false)}<span class="label">${label}</span></a>`;
  }

  private renderEllipsis(): TemplateResult {
    return html`<button class="ellipsis" id=${ELLIPSIS_ID} type="button" aria-label=${text(this.ellipsisLabel)}>
        <nph-icon name="ellipsis" size="sm"></nph-icon>
      </button>
      <nph-dropdown-menu
        for=${ELLIPSIS_ID}
        .items=${this.hiddenEntries}
        @nph-item-select=${(event: CustomEvent<NphDropdownMenuItemSelectDetail>) => this.onSelect(event)}
      ></nph-dropdown-menu>`;
  }

  /** The parts of the trail, in order: a level by its index in `levels`, or the ellipsis. */
  private parts(): (number | 'ellipsis')[] {
    const last = this.levels.length - 1;
    if (!this.collapsed) {
      return this.levels.map((_, index) => index);
    }
    return [0, 'ellipsis', last - 1, last];
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problem !== null) {
      return nothing;
    }
    const name = this.name();
    const parts = this.parts();
    return html`<nav aria-label=${name === null ? nothing : name}>
      <ol class="list">
        ${parts.map(
          (part, position) => html`<li class="part">
            ${part === 'ellipsis' ? this.renderEllipsis() : this.renderLevel(part)}
            ${position === parts.length - 1
              ? nothing
              : html`<span class="separator" aria-hidden="true"><nph-icon name="chevron-right" size="sm"></nph-icon></span>`}
          </li>`,
        )}
      </ol>
      ${this.collapsed ? html`<a class="proxy" hidden></a>` : nothing}
    </nav>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphBreadcrumb);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-breadcrumb': NphBreadcrumb;
  }
}
