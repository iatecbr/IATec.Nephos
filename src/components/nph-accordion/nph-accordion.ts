/**
 * `nph-accordion` — a list of sections with a title that the person opens and closes in place.
 *
 * Contract accepted in Figma (documentation frame `7428:43770`, set `7227:26169`, root `7227:25867`), recorded as
 * text in the evidence of the `figma-docs-accepted` gate of DSA-97, sheet `fichas/nph-accordion.md`, `design.md`
 * and decision P136 — nph-accordion and nph-accordion-item: API and semantics:
 * - the children are `nph-accordion-item`, one per section. Anything else inside is ignored, with a development
 *   warning;
 * - `appearance`: `grouped` (default, one container with the soft outline, the shadow and a divider between items),
 *   `separated` (a block per item, with space between them and no divider) or `flush` (no container, with the
 *   divider between items). The container paints the divider and the block; the item never knows where it is;
 * - `expansion`: `multiple` (default, each item opens and closes alone) or `single` (opening an item closes the
 *   other; the open one can close, and all closed is allowed);
 * - `size`: `compact`, `default` (default) or `large`. It is the size of every item: the size never changes item by
 *   item, so the accordion hands it to them;
 * - `heading-level` (`headingLevel`): the level of the heading that holds each trigger, from 1 to 6; `3` by default,
 *   because the level comes from the page;
 * - the default slot holds the items. No `::part`, no color property and no form association.
 *
 * SINGLE EXPANSION, the cases the APG and Figma leave open (the rules of P136):
 * - more than one item open when the accordion starts, or when it changes from `multiple` to `single`: the first
 *   item that cannot be closed by the person, else the first one in the document, stays open, and the others close;
 * - an item marked `persistent` when another opens: it closes and the mark moves to the item that opened, which
 *   follows from the APG (one panel always stays open and its button takes `aria-disabled`), not from its text;
 * - a locked section (`open` and `disabled`): the person did not open it and cannot close it, so the rule leaves it
 *   as it is and it does not count as the open item.
 * Closing the other items fires no event: as everywhere in Nephos, setting `open` from code is silent. The event
 * of the item the person opened says what happened.
 *
 * REGION — with `multiple` and more than six items, every panel can be open at once, so the accordion tells the
 * items to drop `role="region"`: that many landmarks would crowd the page.
 *
 * Invalid input draws nothing and emits `console.error` only in development, once per cause (rule of P21): an
 * `appearance`, `expansion`, `size` or `heading-level` outside its list.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-accordion-item/nph-accordion-item';
import type { NphAccordionItem } from '../nph-accordion-item/nph-accordion-item';
import accordionCss from './nph-accordion.css?inline';

const TAG = 'nph-accordion';
const ITEM_TAG = 'nph-accordion-item';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** More panels than this can be open at once: no more `role="region"` on them. */
export const NPH_ACCORDION_REGION_LIMIT = 6;

export const NPH_ACCORDION_APPEARANCES = ['grouped', 'separated', 'flush'] as const;
export type NphAccordionAppearance = (typeof NPH_ACCORDION_APPEARANCES)[number];

export const NPH_ACCORDION_EXPANSIONS = ['multiple', 'single'] as const;
export type NphAccordionExpansion = (typeof NPH_ACCORDION_EXPANSIONS)[number];

export const NPH_ACCORDION_SIZES = ['compact', 'default', 'large'] as const;
export type NphAccordionSize = (typeof NPH_ACCORDION_SIZES)[number];

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devMessage(kind: 'error' | 'warn', message: string): void {
  if (import.meta.env?.DEV) {
    console[kind](`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

export class NphAccordion extends LitElement {
  static override styles = unsafeCSS(accordionCss);

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    appearance: { type: String, reflect: true },
    expansion: { type: String, reflect: true },
    size: { type: String, reflect: true },
    headingLevel: { type: Number, attribute: 'heading-level' },
  };

  declare appearance: NphAccordionAppearance;
  declare expansion: NphAccordionExpansion;
  declare size: NphAccordionSize;
  /** The level of the heading that holds each trigger. The page decides it. */
  declare headingLevel: number;

  private valid = false;
  private reported = new Set<string>();

  constructor() {
    super();
    this.appearance = 'grouped';
    this.expansion = 'multiple';
    this.size = 'default';
    this.headingLevel = 3;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('nph-toggle', this.onToggle);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('nph-toggle', this.onToggle);
  }

  /* ----- validation -------------------------------------------------------- */

  private report(kind: 'error' | 'warn', message: string): void {
    if (this.reported.has(message)) return;
    this.reported.add(message);
    devMessage(kind, message);
  }

  /** Whether the input is one the accordion draws. A cause is reported once, whatever the number of updates. */
  private validate(): boolean {
    const appearance = this.appearance ?? '';
    const expansion = this.expansion ?? '';
    const size = this.size ?? '';
    const level = this.headingLevel;
    let valid = true;

    if (!oneOf(NPH_ACCORDION_APPEARANCES, appearance)) {
      this.report('error', `appearance "${appearance}" does not exist. Use ${NPH_ACCORDION_APPEARANCES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_ACCORDION_EXPANSIONS, expansion)) {
      this.report('error', `expansion "${expansion}" does not exist. Use ${NPH_ACCORDION_EXPANSIONS.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_ACCORDION_SIZES, size)) {
      this.report('error', `size "${size}" does not exist. Use ${NPH_ACCORDION_SIZES.join(', ')}.`);
      valid = false;
    }
    if (!Number.isInteger(level) || level < 1 || level > 6) {
      this.report('error', `heading-level "${String(level)}" does not exist. Use a whole number from 1 to 6.`);
      valid = false;
    }
    return valid;
  }

  /* ----- the items --------------------------------------------------------- */

  /** The items, in document order. Anything else in the slot is not a section. */
  private get items(): NphAccordionItem[] {
    return [...this.children].filter((child): child is NphAccordionItem => child.localName === ITEM_TAG);
  }

  /** A locked section: open and disabled. The person did not open it and cannot close it. */
  private static locked(item: NphAccordionItem): boolean {
    return item.open && item.disabled;
  }

  /** Hands the size, the heading level and the region rule to every item. */
  private syncItems(): void {
    /* An accordion that is not drawn hands nothing on: the items would repeat the same error. */
    if (!this.valid) return;
    const items = this.items;
    const region = !(this.expansion === 'multiple' && items.length > NPH_ACCORDION_REGION_LIMIT);
    for (const item of items) {
      item.size = this.size;
      item.headingLevel = this.headingLevel;
      item.region = region;
    }
    for (const child of this.children) {
      if (child.localName !== ITEM_TAG) {
        this.report('warn', `<${child.localName}> is not a section: only ${ITEM_TAG} goes inside, so it is ignored.`);
      }
    }
  }

  /** Single expansion at the start and when it changes: one item open, the rest closed. */
  private enforceSingle(): void {
    if (this.expansion !== 'single') return;
    const open = this.items.filter((item) => item.open && !NphAccordion.locked(item));
    if (open.length < 2) return;
    this.report('warn', 'more than one item is open in the single expansion: the first one that cannot be closed, or else the first, stays open.');
    const keep = open.find((item) => item.persistent) ?? open[0];
    for (const item of open) {
      if (item === keep) continue;
      item.persistent = false;
      item.open = false;
    }
  }

  /** The person opened an item: in the single expansion the other one closes. */
  private onToggle = (event: Event): void => {
    const item = event.target as NphAccordionItem;
    if (this.expansion !== 'single' || !this.items.includes(item) || !item.open) return;
    for (const other of this.items) {
      if (other === item || !other.open || NphAccordion.locked(other)) continue;
      if (other.persistent) {
        /* One panel always stays open, and it is the one that cannot close: the mark follows the opening. */
        other.persistent = false;
        item.persistent = true;
      }
      other.open = false;
    }
  };

  private onSlotChange = (): void => {
    this.syncItems();
    this.enforceSingle();
  };

  protected override willUpdate(): void {
    this.valid = this.validate();
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  protected override updated(changed: PropertyValues<this>): void {
    this.syncItems();
    if (changed.has('expansion')) this.enforceSingle();
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    return html`<slot @slotchange=${this.onSlotChange}></slot>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphAccordion);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-accordion': NphAccordion;
  }
}
