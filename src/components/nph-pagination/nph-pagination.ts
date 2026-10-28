/**
 * `nph-pagination` — the bar that takes the person from one page to another in a long list
 * and shows where in the list they are.
 *
 * Contract accepted in Figma (board `1640:196`, set `1640:194`, page `2888:87682`, ellipsis
 * `2888:87798`, go to page `2888:87805`), recorded as text in the evidence of the
 * `figma-docs-accepted` gate of DSA-54, sheet `fichas/nph-pagination.md` and decision P99 —
 * nph-pagination: API and semantics:
 * - `type` (the Figma `tipo`): `numbered` (default), `simple`, `edges`, `range`, `compact` or
 *   `table`. The Figma `posição` is not a property: it comes from `page` and the page count;
 * - `page`: the current page, a whole number from 1. Reflects. The piece changes it when the
 *   person moves, and the consumer may set it;
 * - the page count is `page-count`, or comes from `total-items` and `page-size`. `range` and
 *   `table` show the range of items, so they need `total-items` and `page-size`; with both
 *   given, the derived count wins. `page-sizes` is the list of items per page of `table`, and
 *   holds `page-size`;
 * - `go-to-page`: the go to page field (the Figma `ir para a página`), beside the bar with
 *   first and last, so only in `edges`;
 * - the text, already localized by the consuming application: `label` names the navigation;
 *   `page-label` names each number, with `{page}`; `first-label`, `previous-label`,
 *   `next-label` and `last-label` name the arrows and are their balloon text (in `numbered`,
 *   `previous-label` and `next-label` are the written text of the buttons); `position-text`
 *   is the position text, with `{page}`, `{count}`, `{start}`, `{end}` and `{total}`;
 *   `page-size-label` and `go-to-label` are the visible labels of the two fields. The numbers
 *   are written in the language of the page (`lang`);
 * - the numbers and the arrows are native buttons drawn by the piece with the `pagination/*`
 *   tokens, with the focus of the secondary `nph-button` and, on the icon-only arrows, the
 *   `nph-tooltip` of the icon-only button (`relation="name"`, P86). Pending decision D-1 of
 *   DSA-54: the evidence calls them `nph-button` and `nph-icon-button`, which have no color
 *   property, and gives them their own paint tokens (P99). An arrow without a destination is
 *   disabled and gives no balloon;
 * - the event `nph-page-change` (bubbles, composed), with `detail: { page, pageSize }`, fired
 *   only when the person moves: a number, an arrow, go to page or items per page. Setting
 *   `page` from code fires nothing. The `input` and `change` of the inner fields do not leave
 *   the piece;
 * - no slot, no color property and no `::part`;
 * - invalid input does not render and emits `console.error` only in development, one per
 *   cause (P21). A count of zero is a mount: nothing, no error. With no `label` or no
 *   `page-label`, and with `page` above the count, it renders and warns once in development:
 *   `page` above the count draws the last page, so a filter that shrinks the list does not
 *   take the bar away.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import '../nph-icon/nph-icon';
import '../nph-input/nph-input';
import '../nph-option/nph-option';
import '../nph-select/nph-select';
import '../nph-tooltip/nph-tooltip';
import type { NphInput } from '../nph-input/nph-input';
import type { NphSelect } from '../nph-select/nph-select';
import paginationCss from './nph-pagination.css?inline';

const TAG = 'nph-pagination';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';
/** The `id` of the items per page field and of the go to page field, for their labels. */
const PAGE_SIZE_ID = 'page-size';
const GO_TO_ID = 'go-to';

/** The six types of the set (the Figma `tipo`). */
export const NPH_PAGINATION_TYPES = ['numbered', 'simple', 'edges', 'range', 'compact', 'table'] as const;
export type NphPaginationType = (typeof NPH_PAGINATION_TYPES)[number];

/** `nph-page-change`: the page the person moved to, and the items per page. */
export const NPH_PAGINATION_CHANGE_EVENT = 'nph-page-change';
export interface NphPaginationChangeDetail {
  page: number;
  /** The items per page, or `null` when the count comes from `page-count` alone. */
  pageSize: number | null;
}

/** The four arrows; each is a destination of its own. */
type Arrow = 'first' | 'previous' | 'next' | 'last';

/** A slot of the numbers: a page, or the ellipsis before or after the current page. */
export type NphPaginationSlot = number | 'gap-start' | 'gap-end';

/** The slots of the numbers: the first, the last, and the current page with its neighbors. */
const SLOTS = 7;

/** The types that show the numbers, the ones with first and last, and the ones with the position text. */
const WITH_NUMBERS: readonly NphPaginationType[] = ['numbered', 'edges', 'table'];
const WITH_EDGES: readonly NphPaginationType[] = ['edges', 'table'];
const WITH_POSITION: readonly NphPaginationType[] = ['simple', 'range', 'compact', 'table'];
const WITH_RANGE: readonly NphPaginationType[] = ['range', 'table'];

/** The markers `position-text` and `page-label` may carry. */
const MARKER = /\{(page|count|start|end|total)\}/g;

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

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

const given = (value: unknown): boolean => value !== null && value !== undefined;
const whole = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 0;
const positive = (value: unknown): value is number => whole(value) && value > 0;

/**
 * The numbers shown for a page in a count: all of them up to seven pages; above that, always
 * seven slots — the first, the last, the current page with one neighbor on each side, and an
 * ellipsis for each run of hidden pages — so the bar keeps its width (P99).
 */
export function pageSlots(page: number, count: number): NphPaginationSlot[] {
  if (count <= SLOTS) {
    return Array.from({ length: count }, (_, index) => index + 1);
  }
  if (page <= SLOTS - 3) {
    return [1, 2, 3, 4, 5, 'gap-end', count];
  }
  if (page >= count - (SLOTS - 4)) {
    return [1, 'gap-start', count - 4, count - 3, count - 2, count - 1, count];
  }
  return [1, 'gap-start', page - 1, page, page + 1, 'gap-end', count];
}

export class NphPagination extends LitElement {
  static override styles = unsafeCSS(paginationCss);

  /* Host focus goes to the first control. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    /* The reflected ones are read by the internal CSS or follow the person. */
    type: { type: String, reflect: true },
    page: { type: Number, reflect: true },
    pageCount: { type: Number, attribute: 'page-count' },
    totalItems: { type: Number, attribute: 'total-items' },
    pageSize: { type: Number, attribute: 'page-size' },
    pageSizes: { type: Array, attribute: 'page-sizes' },
    goToPage: { type: Boolean, attribute: 'go-to-page', reflect: true },
    label: { type: String },
    pageLabel: { type: String, attribute: 'page-label' },
    firstLabel: { type: String, attribute: 'first-label' },
    previousLabel: { type: String, attribute: 'previous-label' },
    nextLabel: { type: String, attribute: 'next-label' },
    lastLabel: { type: String, attribute: 'last-label' },
    positionText: { type: String, attribute: 'position-text' },
    pageSizeLabel: { type: String, attribute: 'page-size-label' },
    goToLabel: { type: String, attribute: 'go-to-label' },
  };

  declare type: NphPaginationType;
  declare page: number;
  declare pageCount: number | null;
  declare totalItems: number | null;
  declare pageSize: number | null;
  declare pageSizes: readonly number[];
  declare goToPage: boolean;
  /** The name of the navigation, already localized by the consuming application. */
  declare label: string;
  /** The name of each number, with `{page}`. */
  declare pageLabel: string;
  declare firstLabel: string;
  declare previousLabel: string;
  declare nextLabel: string;
  declare lastLabel: string;
  /** The position text, with `{page}`, `{count}`, `{start}`, `{end}` and `{total}`. */
  declare positionText: string;
  declare pageSizeLabel: string;
  declare goToLabel: string;

  private valid = false;
  /** The page count of the last valid input. */
  private count = 0;
  /** The page drawn: `page`, or the last page while `page` is above the count. */
  private shown = 1;
  private readonly warned = new Set<string>();

  constructor() {
    super();
    this.type = 'numbered';
    this.page = 1;
    this.pageCount = null;
    this.totalItems = null;
    this.pageSize = null;
    this.pageSizes = [];
    this.goToPage = false;
    this.label = '';
    this.pageLabel = '';
    this.firstLabel = '';
    this.previousLabel = '';
    this.nextLabel = '';
    this.lastLabel = '';
    this.positionText = '';
    this.pageSizeLabel = '';
    this.goToLabel = '';
  }

  private warnOnce(key: string, message: string): void {
    if (!this.warned.has(key)) {
      this.warned.add(key);
      devWarn(message);
    }
  }

  private trim(value: string | null | undefined): string {
    return (value ?? '').trim();
  }

  protected override willUpdate(_changed: PropertyValues): void {
    const type = this.type ?? '';
    let valid = true;

    if (!oneOf(NPH_PAGINATION_TYPES, type)) {
      devError(`type "${type}" does not exist. Use ${NPH_PAGINATION_TYPES.join(', ')}.`);
      this.valid = false;
      this.toggleAttribute(RENDERED_ATTRIBUTE, false);
      return;
    }
    if (!positive(this.page)) {
      devError('page is a whole number from 1.');
      valid = false;
    }
    if (given(this.pageCount) && !whole(this.pageCount)) {
      devError('page-count is a whole number from 0.');
      valid = false;
    }
    if (given(this.totalItems) && !whole(this.totalItems)) {
      devError('total-items is a whole number from 0.');
      valid = false;
    }
    if (given(this.pageSize) && !positive(this.pageSize)) {
      devError('page-size is a whole number from 1.');
      valid = false;
    }

    const derived = whole(this.totalItems) && positive(this.pageSize) ? Math.ceil(this.totalItems / this.pageSize) : null;
    if (oneOf(WITH_RANGE, type) && derived === null) {
      devError(`type "${type}" shows the range of items: it needs total-items and page-size.`);
      valid = false;
    } else if (derived === null && !whole(this.pageCount)) {
      devError('the page count is missing: give page-count, or total-items and page-size.');
      valid = false;
    }
    if (derived !== null && whole(this.pageCount) && this.pageCount !== derived) {
      this.warnOnce(
        'count',
        `page-count ${this.pageCount} differs from total-items and page-size (${derived} pages): the derived count is drawn.`,
      );
    }

    const sizes = Array.isArray(this.pageSizes) ? this.pageSizes : [];
    if (type === 'table') {
      if (sizes.length === 0 || !sizes.every(positive)) {
        devError('type "table" needs page-sizes: the list of items per page, whole numbers from 1.');
        valid = false;
      } else if (positive(this.pageSize) && !sizes.includes(this.pageSize)) {
        devError('page-sizes must hold page-size: the items per page the table uses.');
        valid = false;
      }
      if (this.trim(this.pageSizeLabel) === '') {
        devError('type "table" needs page-size-label: the visible label and the name of items per page.');
        valid = false;
      }
    } else if (sizes.length > 0) {
      devError('page-sizes exists only in type "table", which has items per page.');
      valid = false;
    }
    if (this.goToPage) {
      if (type !== 'edges') {
        devError('go-to-page sits beside the bar with first and last: only in type "edges".');
        valid = false;
      } else if (this.trim(this.goToLabel) === '') {
        devError('go-to-page needs go-to-label: the visible label and the name of the field.');
        valid = false;
      }
    }
    if (this.trim(this.previousLabel) === '' || this.trim(this.nextLabel) === '') {
      devError('previous-label and next-label are required: they name the previous and next arrows.');
      valid = false;
    }
    if (oneOf(WITH_EDGES, type) && (this.trim(this.firstLabel) === '' || this.trim(this.lastLabel) === '')) {
      devError(`type "${type}" has first and last: first-label and last-label are required, they name the arrows.`);
      valid = false;
    }
    if (oneOf(WITH_POSITION, type) && this.trim(this.positionText) === '') {
      devError(`type "${type}" shows the position text: position-text is required.`);
      valid = false;
    }

    const count = derived ?? (whole(this.pageCount) ? this.pageCount : 0);
    /* A count of zero is a mount, not an error: there is no page to move to. */
    this.valid = valid && count > 0;
    this.count = count;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    if (!this.valid) {
      return;
    }

    this.shown = Math.min(this.page, count);
    if (this.page > count) {
      this.warnOnce('page', `page ${this.page} is above the count of ${count} pages: the last page is drawn.`);
    }
    if (this.trim(this.label) === '') {
      this.warnOnce('label', 'the navigation has no name: give label.');
    }
    if (oneOf(WITH_NUMBERS, type) && this.trim(this.pageLabel) === '') {
      this.warnOnce('page-label', 'the numbers have no name of their own: give page-label, with {page}.');
    }
  }

  /**
   * The language of the page: the nearest `lang`, crossing the shadow roots the piece lives
   * in, so a bar inside another component still reads the language of the document.
   */
  private language(): string | undefined {
    let node: Element | null = this;
    while (node !== null) {
      const found: Element | null = node.closest('[lang]');
      if (found !== null) {
        return found.getAttribute('lang') || undefined;
      }
      const root = node.getRootNode();
      node = root instanceof ShadowRoot ? root.host : null;
    }
    return undefined;
  }

  /** A number as the person reads it, in the language of the page. */
  private format(value: number): string {
    const lang = this.language();
    try {
      return new Intl.NumberFormat(lang).format(value);
    } catch {
      return String(value);
    }
  }

  /** The values of the markers for a page: the page drawn, or the page a number leads to. */
  private markers(page: number = this.shown): Record<string, string> {
    const values: Record<string, string> = { page: this.format(page), count: this.format(this.count) };
    if (whole(this.totalItems) && positive(this.pageSize)) {
      const start = (page - 1) * this.pageSize + 1;
      values.start = this.format(start);
      values.end = this.format(Math.min(page * this.pageSize, this.totalItems));
      values.total = this.format(this.totalItems);
    }
    return values;
  }

  private fill(template: string, values: Record<string, string>): string {
    return this.trim(template).replace(MARKER, (marker, key: string) => values[key] ?? marker);
  }

  /** Moves to a page by an action of the person, and says so. */
  private go(page: number, from?: Arrow): void {
    const target = Math.min(Math.max(page, 1), this.count);
    if (target === this.shown && this.page === target) {
      return;
    }
    this.page = target;
    this.announce();
    if (from !== undefined) {
      void this.keepFocus(from);
    }
  }

  private announce(): void {
    this.dispatchEvent(
      new CustomEvent<NphPaginationChangeDetail>(NPH_PAGINATION_CHANGE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { page: this.page, pageSize: positive(this.pageSize) ? this.pageSize : null },
      }),
    );
  }

  /**
   * The arrow the person used may lose its destination (the first or last page was reached)
   * and be disabled: the focus moves to the current page, or to the opposite arrow where there
   * are no numbers, so the keyboard does not fall back to the start of the document.
   */
  private async keepFocus(from: Arrow): Promise<void> {
    const root = this.shadowRoot;
    const arrow = root?.querySelector<HTMLButtonElement>(`#${from}`) ?? null;
    if (root === null || arrow === null || root.activeElement !== arrow) {
      return;
    }
    await this.updateComplete;
    if (!arrow.disabled) {
      return;
    }
    const opposite: Record<Arrow, Arrow> = { first: 'next', previous: 'next', next: 'previous', last: 'previous' };
    const fallback =
      root.querySelector<HTMLButtonElement>('.page[aria-current="page"]') ??
      root.querySelector<HTMLButtonElement>(`#${opposite[from]}`);
    fallback?.focus();
  }

  private changeSize(event: Event): void {
    event.stopPropagation();
    const size = Number((event.currentTarget as NphSelect).value);
    if (!positive(size) || size === this.pageSize || !whole(this.totalItems)) {
      return;
    }
    /* The first item on screen stays on screen. */
    const first = (this.shown - 1) * (positive(this.pageSize) ? this.pageSize : size) + 1;
    this.pageSize = size;
    this.page = Math.max(1, Math.ceil(first / size));
    this.announce();
  }

  private goTo(event: Event): void {
    event.stopPropagation();
    const field = event.currentTarget as NphInput;
    const typed = (field.value ?? '').trim();
    field.value = '';
    if (/^\d+$/.test(typed)) {
      this.go(Number.parseInt(typed, 10));
    }
  }

  /** The `input` of the inner fields is composed: it stops here, it is not the bar's. */
  private stop(event: Event): void {
    event.stopPropagation();
  }

  private arrow(which: Arrow, label: string, disabled: boolean, destination: number): TemplateResult {
    const icon = which === 'first' || which === 'last' ? 'arrow-left-to-line' : which === 'previous' ? 'chevron-left' : 'chevron-right';
    const written = this.type === 'numbered';
    /* Light at rest and solid in hover-active, as the icon of nph-button (P88). */
    const glyph = html`<span class="glyph"
      ><nph-icon class="icon icon-rest" name=${icon} size=${written ? 'sm' : 'md'}></nph-icon
      ><nph-icon class="icon icon-active" name=${icon} variant="solid" size=${written ? 'sm' : 'md'}></nph-icon
    ></span>`;
    const content = !written ? glyph : which === 'previous' ? html`${glyph}<span>${label}</span>` : html`<span>${label}</span>${glyph}`;
    return html`<button
        class="arrow ${which}"
        id=${which}
        type="button"
        ?disabled=${disabled}
        aria-label=${written ? nothing : label}
        @click=${() => this.go(destination, which)}
      >
        ${content}
      </button>${written ? nothing : html`<nph-tooltip for=${which} relation="name" .text=${label}></nph-tooltip>`}`;
  }

  private numbers(): TemplateResult {
    const name = this.trim(this.pageLabel);
    /*
     * Every slot reserves the width of the widest number, the count, so the bar keeps its width
     * as the person moves, whatever the size of the list.
     */
    const sizer = html`<span class="sizer" aria-hidden="true">${this.format(this.count)}</span>`;
    return html`${repeat(
      pageSlots(this.shown, this.count),
      (slot) => slot,
      (slot) =>
        typeof slot === 'number'
          ? html`<button
              class="page"
              type="button"
              aria-label=${name === '' ? nothing : this.fill(name, this.markers(slot))}
              aria-current=${slot === this.shown ? 'page' : nothing}
              @click=${() => this.go(slot)}
            >
              <span class="digits">${this.format(slot)}</span>${sizer}
            </button>`
          : html`<span class="ellipsis" aria-hidden="true"><nph-icon name="ellipsis" size="md"></nph-icon>${sizer}</span>`,
    )}`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const type = this.type;
    const atStart = this.shown <= 1;
    const atEnd = this.shown >= this.count;
    const edges = oneOf(WITH_EDGES, type);
    const position = oneOf(WITH_POSITION, type) ? this.fill(this.positionText, this.markers()) : '';
    const label = this.trim(this.label);

    const bar = html`<div class="bar">
      ${edges ? this.arrow('first', this.trim(this.firstLabel), atStart, 1) : nothing}
      ${this.arrow('previous', this.trim(this.previousLabel), atStart, this.shown - 1)}
      ${oneOf(WITH_NUMBERS, type) ? this.numbers() : html`<span class="position">${position}</span>`}
      ${this.arrow('next', this.trim(this.nextLabel), atEnd, this.shown + 1)}
      ${edges ? this.arrow('last', this.trim(this.lastLabel), atEnd, this.count) : nothing}
    </div>`;

    const pageSize =
      type === 'table'
        ? html`<div class="field">
              <label class="text" for=${PAGE_SIZE_ID}>${this.trim(this.pageSizeLabel)}</label>
              <nph-select
                id=${PAGE_SIZE_ID}
                .value=${String(this.pageSize)}
                .label=${this.trim(this.pageSizeLabel)}
                @input=${(event: Event) => this.stop(event)}
                @change=${(event: Event) => this.changeSize(event)}
              >
                ${this.pageSizes.map((size) => html`<nph-option value=${String(size)}>${this.format(size)}</nph-option>`)}
              </nph-select>
            </div>
            <span class="position">${position}</span>`
        : nothing;

    const goTo = this.goToPage
      ? html`<div class="field">
          <label class="text" for=${GO_TO_ID}>${this.trim(this.goToLabel)}</label>
          <nph-input
            id=${GO_TO_ID}
            .label=${this.trim(this.goToLabel)}
            @input=${(event: Event) => this.stop(event)}
            @change=${(event: Event) => this.goTo(event)}
          ></nph-input>
        </div>`
      : nothing;

    return html`<nav class="pagination" aria-label=${label === '' ? nothing : label}>${pageSize}${bar}${goTo}</nav>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphPagination);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-pagination': NphPagination;
  }
  interface HTMLElementEventMap {
    'nph-page-change': CustomEvent<NphPaginationChangeDetail>;
  }
}
