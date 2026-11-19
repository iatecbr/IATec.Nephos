/**
 * `nph-card` — the surface that groups the content and the actions of one subject.
 *
 * Contract accepted in Figma (documentation frame `6516:13647`, root `6478:6670`, sets `6478:6673` and
 * `6478:7282`), recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-88, sheet
 * `fichas/nph-card.md`, `design.md` and decision P130 — nph-card: API and semantics:
 * - `type` (the Figma `tipo`): `base` (default, own content and actions), `clickable` (the whole card is
 *   the area of the title link) or `section` (a block of data of a detail page, a region named by its
 *   title). `surface` (`superfície`): `elevated` (default) or `outlined`. `media` (`mídia`): `none`
 *   (default), `top`, `inset-top` or `side`, on `base` and `clickable`. `density` (`densidade`): `default`
 *   or `compact`. All four reflect, because the internal CSS selects the box by them;
 * - `heading` (the title, required unless the card is loading), `heading-level` (2 to 6, default 3: the
 *   title is a heading of the collection or of the page), `description`. `icon` is the start icon, a core
 *   name of `nph-icon`, drawn in the tonal box. An avatar or an image at the start goes in the `leading`
 *   slot instead: one piece at a time;
 * - `href` (the destination of the title link, `clickable` only), `disabled` (`clickable` only: no `href`,
 *   `role="link"`, `aria-disabled="true"`, out of the focus order), `loading` (`aria-busy`, skeleton in
 *   place of the content) and `loading-label` (the hidden word, already localized);
 * - `hide-divider`: the divider before the footer actions is on by default; this turns it off. `items`: the
 *   key-value list of the `section` type, `{ key, value }[]`, property only;
 * - slots by zone name: `media`, `leading`, `status`, `action`, the default slot (the `content`),
 *   `section` (the tonal band) and `footer`. The title, the description, the divider and the arrow of the
 *   clickable card are drawn by the card. The parts that turn on and off are never properties: start,
 *   description, status, action, tonal section and footer are on when there is something to show, and the
 *   divider is on when the footer is and `hide-divider` is not;
 * - no event, no `::part`, no color property and no form association: the card is a surface. A clickable card
 *   is a native link, and the footer buttons and the menu action keep their own focus and events.
 *
 * SEMANTICS — there is no card pattern in the WAI-ARIA APG: the clickable card is the link pattern, the stretched
 * link of Inclusive Components. The title is the link, stretched with CSS only (`::after` over the card), and it
 * is the only Tab stop; Enter opens it and Space does nothing. The start and the arrow are decorative and nothing
 * interactive sits inside: a clickable card has no header action, no tonal section and no divider, and a slot
 * that is not drawn there says so in development. The `base` card takes no focus: Tab goes through the controls
 * inside it. The `section` card is a region named by its title. The title is a `role="heading"` with `aria-level`.
 * Loading sets `aria-busy="true"`, hides the skeleton from assistive technology and writes the hidden word outside
 * the hidden node, because only one screen reader honors `aria-busy` (item 19c).
 *
 * BY INSTANCE — the card draws `nph-icon`, `nph-separator` and `nph-skeleton` and places what the consumer slots.
 * The separator line, the arrow color, the sizes of the skeleton, the frame of the media and, on a touch screen, the
 * height of the menu action are set by the card's own CSS from outside those pieces: none of them is changed. The
 * start avatar and image are given the size of the density, as `nph-avatar-stack` gives its avatars theirs (P130).
 *
 * Invalid input draws nothing and emits `console.error` only in development, once per cause (rule of P21): a
 * `type`, `surface`, `media`, `density` or `heading-level` outside its list, an `icon` that is not a core name, an
 * empty `heading` on a card that is not loading, a clickable card with no safe `href`, and a malformed `items`.
 * Ignored with a development `console.warn`: what the type does not have.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import '../nph-separator/nph-separator';
import '../nph-skeleton/nph-skeleton';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import cardCss from './nph-card.css?inline';

const TAG = 'nph-card';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The `id` of the title, unique in the shadow root: the region of the `section` type is named by it. */
const HEADING_ID = 'heading';

export const NPH_CARD_TYPES = ['base', 'clickable', 'section'] as const;
export type NphCardType = (typeof NPH_CARD_TYPES)[number];

export const NPH_CARD_SURFACES = ['elevated', 'outlined'] as const;
export type NphCardSurface = (typeof NPH_CARD_SURFACES)[number];

export const NPH_CARD_MEDIA = ['none', 'top', 'inset-top', 'side'] as const;
export type NphCardMedia = (typeof NPH_CARD_MEDIA)[number];

export const NPH_CARD_DENSITIES = ['default', 'compact'] as const;
export type NphCardDensity = (typeof NPH_CARD_DENSITIES)[number];

export const NPH_CARD_HEADING_LEVELS = [2, 3, 4, 5, 6] as const;
export type NphCardHeadingLevel = (typeof NPH_CARD_HEADING_LEVELS)[number];

/** The protocols the title link may take; a relative path and a fragment resolve to the page's. */
export const NPH_CARD_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'] as const;

/** One row of the key-value list of the `section` type. Both texts already localized. */
export interface NphCardItem {
  key: string;
  value: string;
}

/** The slots of the card, by zone name. The default slot is the `content`. */
const SLOT_NAMES = ['media', 'leading', 'status', 'action', 'content', 'section', 'footer'] as const;
type SlotName = (typeof SLOT_NAMES)[number];
type Presence = Record<SlotName, boolean>;

const EMPTY_PRESENCE: Presence = {
  media: false,
  leading: false,
  status: false,
  action: false,
  content: false,
  section: false,
  footer: false,
};

/** The size the start piece takes in each density: the avatar `lg` and `md`, the image `md` and `sm`. */
const LEADING_SIZES = {
  'NPH-AVATAR': { default: 'lg', compact: 'md' },
  'NPH-IMAGE': { default: 'md', compact: 'sm' },
} as const;

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devMessage(kind: 'error' | 'warn', message: string): void {
  if (import.meta.env?.DEV) {
    console[kind](`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string | number>(list: readonly T[], value: unknown): value is T {
  return (list as readonly unknown[]).includes(value);
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Whether an address may be the destination of the title link. It is parsed as the browser would — tabs and
 * line breaks inside the scheme are dropped — so `java\nscript:` is caught as `javascript:` (the same rule as
 * the link of `nph-breadcrumb`).
 */
export function isSafeHref(href: string): boolean {
  try {
    return (NPH_CARD_LINK_PROTOCOLS as readonly string[]).includes(new URL(href, document.baseURI).protocol);
  } catch {
    return false;
  }
}

/** The key-value rows, or `null` when the value is not a list of `{ key, value }` with texts. */
function readItems(value: unknown): NphCardItem[] | null {
  if (!Array.isArray(value)) return null;
  const rows: NphCardItem[] = [];
  for (const entry of value as unknown[]) {
    if (entry === null || typeof entry !== 'object') return null;
    const { key, value: cell } = entry as Record<string, unknown>;
    if (typeof key !== 'string' || key.trim() === '' || typeof cell !== 'string') return null;
    rows.push({ key, value: cell });
  }
  return rows;
}

export class NphCard extends LitElement {
  static override styles = unsafeCSS(cardCss);

  static override properties = {
    /* The four reflected ones, `disabled` and `loading` are read by the internal CSS. */
    type: { type: String, reflect: true },
    surface: { type: String, reflect: true },
    media: { type: String, reflect: true },
    density: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    heading: { type: String },
    headingLevel: { type: Number, attribute: 'heading-level' },
    description: { type: String },
    icon: { type: String },
    href: { type: String },
    loadingLabel: { type: String, attribute: 'loading-label' },
    hideDivider: { type: Boolean, attribute: 'hide-divider' },
    items: { attribute: false },
    present: { state: true },
  };

  declare type: NphCardType;
  declare surface: NphCardSurface;
  /** The media of the card: it needs a piece in the `media` slot. Not drawn in the `section` type. */
  declare media: NphCardMedia;
  declare density: NphCardDensity;
  declare disabled: boolean;
  declare loading: boolean;
  /** The title, already localized. Required unless the card is loading. */
  declare heading: string;
  /** The level of the title: 2 to 6, 3 by default. */
  declare headingLevel: NphCardHeadingLevel;
  declare description: string;
  /** The name of the start icon, a core name of `nph-icon`. Empty draws none. */
  declare icon: string;
  /** The destination of the title link of the clickable card. */
  declare href: string;
  /** The word the screen reader hears while the card loads, already localized. */
  declare loadingLabel: string;
  declare hideDivider: boolean;
  /** The key-value list of the `section` type. Property only. */
  declare items: NphCardItem[];
  /** Which slots have content. Internal. */
  declare protected present: Presence;

  private valid = false;
  private reported = new Set<string>();
  private childObserver: MutationObserver | undefined;

  constructor() {
    super();
    this.type = 'base';
    this.surface = 'elevated';
    this.media = 'none';
    this.density = 'default';
    this.disabled = false;
    this.loading = false;
    this.heading = '';
    this.headingLevel = 3;
    this.description = '';
    this.icon = '';
    this.href = '';
    this.loadingLabel = '';
    this.hideDivider = false;
    this.items = [];
    this.present = { ...EMPTY_PRESENCE };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* The slots raise no event a piece can trust for an element added later or moved: watch the children. */
    this.childObserver = new MutationObserver(() => {
      this.syncChildren();
    });
    this.childObserver.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['slot', 'size'],
    });
    this.syncChildren();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.childObserver?.disconnect();
    this.childObserver = undefined;
  }

  /* ----- children ---------------------------------------------------------- */

  /** The slot a direct child goes to: its `slot` attribute, or the default one for the content. */
  private static slotOf(node: Node): SlotName | null {
    if (node instanceof Element) {
      const name = node.getAttribute('slot') ?? '';
      if (name === '') return 'content';
      return oneOf(SLOT_NAMES, name) && name !== 'content' ? name : null;
    }
    if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '') return 'content';
    return null;
  }

  /** Reads which slots have content and gives the start piece the size of the density. */
  private syncChildren(): void {
    const next: Presence = { ...EMPTY_PRESENCE };
    for (const node of this.childNodes) {
      const slot = NphCard.slotOf(node);
      if (slot !== null) next[slot] = true;
    }
    if (SLOT_NAMES.some((name) => next[name] !== this.present[name])) {
      this.present = next;
    }
    this.syncLeading();
  }

  /**
   * The avatar and the image of the start take the size of the density, as `nph-avatar-stack` gives its
   * avatars theirs. The attribute is written only when it differs, so the observer does not loop.
   */
  private syncLeading(): void {
    const density: NphCardDensity = this.density === 'compact' ? 'compact' : 'default';
    for (const child of this.children) {
      if (child.getAttribute('slot') !== 'leading') continue;
      const sizes = LEADING_SIZES[child.tagName as keyof typeof LEADING_SIZES] as Record<NphCardDensity, string> | undefined;
      if (sizes !== undefined && child.getAttribute('size') !== sizes[density]) {
        child.setAttribute('size', sizes[density]);
      }
    }
  }

  /* ----- validation -------------------------------------------------------- */

  private report(kind: 'error' | 'warn', message: string): void {
    if (this.reported.has(message)) return;
    this.reported.add(message);
    devMessage(kind, message);
  }

  /** Whether the input is one the piece draws. A cause is reported once, whatever the number of updates. */
  private validate(): boolean {
    const type = this.type ?? '';
    const surface = this.surface ?? '';
    const media = this.media ?? '';
    const density = this.density ?? '';
    const level: unknown = this.headingLevel;
    const icon = text(this.icon);
    const href = text(this.href);
    let valid = true;

    if (!oneOf(NPH_CARD_TYPES, type)) {
      this.report('error', `type "${type}" does not exist. Use ${NPH_CARD_TYPES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_CARD_SURFACES, surface)) {
      this.report('error', `surface "${surface}" does not exist. Use ${NPH_CARD_SURFACES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_CARD_MEDIA, media)) {
      this.report('error', `media "${media}" does not exist. Use ${NPH_CARD_MEDIA.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_CARD_DENSITIES, density)) {
      this.report('error', `density "${density}" does not exist. Use ${NPH_CARD_DENSITIES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_CARD_HEADING_LEVELS, level)) {
      this.report('error', `heading-level "${String(level)}" does not exist. Use ${NPH_CARD_HEADING_LEVELS.join(', ')}.`);
      valid = false;
    }
    if (icon !== '' && !isCoreName(icon)) {
      this.report('error', `icon "${icon}" is not a core name of nph-icon.`);
      valid = false;
    }
    if (!this.loading && text(this.heading) === '') {
      this.report('error', '"heading" is required: it is the title of the card. The piece draws nothing without it.');
      valid = false;
    }
    if (this.type === 'clickable' && !this.loading && !this.disabled) {
      if (href === '') {
        this.report('error', 'a clickable card needs an `href`: the page it leads to.');
        valid = false;
      } else if (!isSafeHref(href)) {
        this.report('error', `href is unsafe. A link takes ${NPH_CARD_LINK_PROTOCOLS.join(', ')} or a relative address.`);
        valid = false;
      }
    }
    if (readItems(this.items) === null) {
      this.report('error', '`items` is a list of `{ key, value }` with a non-empty key. The piece draws nothing with it.');
      valid = false;
    }

    if (valid) this.warnIgnored();
    return valid;
  }

  /** What the type does not have is ignored, and said once in development. */
  private warnIgnored(): void {
    const clickable = this.type === 'clickable';
    if (this.type !== 'clickable' && text(this.href) !== '') {
      this.report('warn', 'href is for the clickable type: the other types are not links, so it is ignored.');
    }
    if (!clickable && this.disabled) {
      this.report('warn', 'disabled is for the clickable type: a base or section card is not a control, so it is ignored.');
    }
    if (this.type === 'section' && this.media !== 'none') {
      this.report('warn', 'media is for the base and clickable types: the section type has none, so it is ignored.');
    }
    if (this.type !== 'section' && (this.items ?? []).length > 0) {
      this.report('warn', '`items` is the key-value list of the section type: it is ignored in the other types.');
    }
    if (clickable) {
      for (const slot of ['action', 'section'] as const) {
        if (this.present[slot]) {
          this.report('warn', `the clickable card has no \`${slot}\`: nothing interactive or boxed goes inside it, so the slot is not drawn.`);
        }
      }
      if (this.hideDivider) {
        this.report('warn', 'hide-divider has no effect on the clickable card: it has no divider.');
      }
    }
    if (this.present.media && (this.media === 'none' || this.type === 'section')) {
      this.report('warn', 'a piece in the `media` slot is not drawn while `media` is "none" or the type is section.');
    }
    if (text(this.icon) !== '' && this.present.leading) {
      this.report('warn', 'the start takes one piece at a time: `icon` is ignored while the `leading` slot has content.');
    }
    if (this.loading && text(this.loadingLabel) === '') {
      this.report('warn', 'loading-label is empty: the screen reader hears no word while the card loads.');
    }
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    this.valid = this.validate();
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    if (changed.has('density')) this.syncLeading();
  }

  /* ----- drawing ----------------------------------------------------------- */

  /** The start of the header: the piece of the `leading` slot, or the tonal box of the icon. */
  private renderLeading(): TemplateResult | typeof nothing {
    const icon = text(this.icon);
    if (!this.present.leading && icon === '') return nothing;
    const dense = this.density === 'compact';
    return html`<div class="leading" data-slot="leading" aria-hidden=${this.type === 'clickable' ? 'true' : nothing}>
      ${this.present.leading
        ? html`<slot name="leading"></slot>`
        : html`<span class="icon-box"><nph-icon name=${icon} size=${dense ? 'sm' : 'lg'}></nph-icon></span>`}
    </div>`;
  }

  /** The title: plain text, or the link of the clickable card, which is stretched over the card by the CSS. */
  private renderTitle(): TemplateResult {
    const heading = text(this.heading);
    let inner: TemplateResult | string = heading;
    if (this.type === 'clickable') {
      inner = this.disabled
        ? html`<a class="link" role="link" aria-disabled="true">${heading}</a>`
        : html`<a class="link" href=${text(this.href)}>${heading}</a>`;
    }
    return html`<div class="heading" data-slot="title" id=${HEADING_ID} role="heading" aria-level=${String(this.headingLevel)}>${inner}</div>`;
  }

  private renderList(): TemplateResult | typeof nothing {
    const rows = this.type === 'section' ? (readItems(this.items) ?? []) : [];
    if (rows.length === 0) return nothing;
    return html`<dl class="list" data-slot="list">
      ${rows.map((row) => html`<div class="row"><dt>${row.key}</dt><dd>${row.value}</dd></div>`)}
    </dl>`;
  }

  /** What names the card: the visible title of a section region, or its text while the title is not drawn. */
  private regionAttributes(): { role: string | typeof nothing; labelledBy: string | typeof nothing; label: string | typeof nothing } {
    if (this.type !== 'section') return { role: nothing, labelledBy: nothing, label: nothing };
    if (this.loading) {
      const name = text(this.heading);
      return name === '' ? { role: nothing, labelledBy: nothing, label: nothing } : { role: 'region', labelledBy: nothing, label: name };
    }
    return { role: 'region', labelledBy: HEADING_ID, label: nothing };
  }

  private renderMedia(): TemplateResult {
    return html`<div class="media" data-slot="media"><slot name="media"></slot></div>`;
  }

  private renderLoading(): TemplateResult {
    const dense = this.density === 'compact';
    const clickable = this.type === 'clickable';
    /* The start and the footer stay while loading only when the card has them: the skeleton does not invent a part. */
    const hasStart = this.present.leading || text(this.icon) !== '';
    const hasFooter = !clickable && this.present.footer;
    const region = this.regionAttributes();
    return html`<div
      class="surface"
      data-slot="root"
      aria-busy="true"
      role=${region.role}
      aria-labelledby=${region.labelledBy}
      aria-label=${region.label}
    >
      <div class="main">
        <div class="body" aria-hidden="true">
          <div class="header">
            ${hasStart ? html`<nph-skeleton shape=${dense ? 'avatar-md' : 'avatar-lg'}></nph-skeleton>` : nothing}
            <div class="titles">
              <nph-skeleton class="sk-title" shape="line"></nph-skeleton>
              <nph-skeleton class="sk-description" shape="line"></nph-skeleton>
            </div>
          </div>
          <div class="content">
            <nph-skeleton class="sk-line" shape="line"></nph-skeleton>
            <nph-skeleton class="sk-line-short" shape="line"></nph-skeleton>
          </div>
        </div>
        ${!hasFooter
          ? nothing
          : html`${this.hideDivider ? nothing : html`<nph-separator class="divider" data-slot="divider" orientation="horizontal" aria-hidden="true"></nph-separator>`}
              <div class="footer" aria-hidden="true"><nph-skeleton class="sk-action" shape="block"></nph-skeleton></div>`}
      </div>
      <span class="loading-text">${text(this.loadingLabel)}</span>
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) return nothing;
    if (this.loading) return this.renderLoading();

    const clickable = this.type === 'clickable';
    const media = this.type === 'section' ? 'none' : this.media;
    const description = text(this.description);
    const hasList = this.type === 'section' && (readItems(this.items) ?? []).length > 0;
    const hasContent = this.present.content || hasList;
    const showDivider = !clickable && this.present.footer && !this.hideDivider;
    const region = this.regionAttributes();

    return html`<div
      class="surface"
      data-slot="root"
      data-media=${media}
      role=${region.role}
      aria-labelledby=${region.labelledBy}
      aria-label=${region.label}
      aria-disabled=${clickable && this.disabled ? 'true' : nothing}
    >
      ${media === 'top' || media === 'side' ? this.renderMedia() : nothing}
      <div class="main">
        <div class="body">
          ${media === 'inset-top' ? this.renderMedia() : nothing}
          <div class="header">
            ${this.renderLeading()}
            <div class="titles">
              <div class="title-row">
                ${this.renderTitle()}
                <div class="status" data-slot="status" ?hidden=${!this.present.status}><slot name="status"></slot></div>
              </div>
              ${description === '' ? nothing : html`<p class="description" data-slot="description">${description}</p>`}
            </div>
            ${clickable
              ? html`<span class="indicator" aria-hidden="true"><nph-icon name="chevron-right" size="sm"></nph-icon></span>`
              : html`<div class="action" data-slot="action" ?hidden=${!this.present.action}><slot name="action"></slot></div>`}
          </div>
          <div class="content" data-slot="content" ?hidden=${!hasContent}><slot></slot>${this.renderList()}</div>
          ${clickable
            ? nothing
            : html`<div class="section" data-slot="section" ?hidden=${!this.present.section}><slot name="section"></slot></div>`}
          ${clickable ? html`<div class="footer meta" data-slot="footer" ?hidden=${!this.present.footer}><slot name="footer"></slot></div>` : nothing}
        </div>
        ${clickable
          ? nothing
          : html`${showDivider ? html`<nph-separator class="divider" data-slot="divider" orientation="horizontal"></nph-separator>` : nothing}
              <div class="footer" data-slot="footer" ?hidden=${!this.present.footer}><slot name="footer"></slot></div>`}
      </div>
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphCard);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-card': NphCard;
  }
}
