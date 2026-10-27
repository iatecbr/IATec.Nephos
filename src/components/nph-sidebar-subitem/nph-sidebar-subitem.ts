/**
 * `nph-sidebar-subitem` — the second-level line of the lateral menu, inside an open group.
 *
 * Contract accepted in Figma (board `1366:2`, documentation `2723:460`, set `2251:51312`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-53, sheet
 * `fichas/nph-sidebar-subitem.md` and decision P98. It has its own folder and package entry
 * because the build takes one definition per folder (P91, item 1); its reading page and its
 * Validation are the ones of `nph-sidebar-item`:
 * - `label`: the text of the line, one line with an ellipsis. It is the accessible name. No
 *   icon, no counter and no more actions;
 * - `href`: the page it leads to. The subitem is a link;
 * - `active`: the current page, with `aria-current="page"`, its color and `text/label-md`;
 * - `options`: the arrow to the right, `chevron-right` at `icon/size-sm`, says the subitem
 *   leads to a list of options. Visual only: the subitem stays a link (D-4);
 * - `disabled`: the line at `state/disabled-opacity`, out of the Tab order, with no balloon;
 * - `tooltip`: the text of the `nph-tooltip` with the full name, on hover and focus. It does
 *   not follow `label`; empty turns it off;
 * - no event of its own: the click is the native `click`, which crosses the shadow root. The
 *   click on the balloon stops at the host (P98). No slot, no color property, no `::part`;
 * - invalid input does not render and emits `console.error` only in development, one per
 *   cause (P21). No label is a mount: nothing, no error (P66).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import '../nph-tooltip/nph-tooltip';
import subitemCss from './nph-sidebar-subitem.css?inline';

const TAG = 'nph-sidebar-subitem';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';
/** The `id` of the link, which the tooltip finds by `for`. */
const CONTROL_ID = 'control';

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphSidebarSubitem extends LitElement {
  static override styles = unsafeCSS(subitemCss);

  /* Host focus goes to the inner link. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    label: { type: String },
    href: { type: String },
    active: { type: Boolean, reflect: true },
    options: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    tooltip: { type: String },
  };

  /** The text of the line, already localized by the consuming application. */
  declare label: string;
  declare href: string;
  declare active: boolean;
  declare options: boolean;
  declare disabled: boolean;
  declare tooltip: string;

  private valid = false;

  constructor() {
    super();
    this.label = '';
    this.href = '';
    this.active = false;
    this.options = false;
    this.disabled = false;
    this.tooltip = '';
    /* A disabled line lets no click through, `click()` on the host included. */
    this.addEventListener('click', (event) => this.blockDisabled(event), { capture: true });
    /* In the bubble phase: the click on the balloon is not a click on the line (P98). */
    this.addEventListener('click', (event) => this.blockBalloon(event));
  }

  private blockDisabled(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  private blockBalloon(event: Event): void {
    const tooltip = this.shadowRoot?.querySelector('nph-tooltip') ?? null;
    if (tooltip !== null && event.composedPath().includes(tooltip)) {
      event.stopImmediatePropagation();
    }
  }

  protected override willUpdate(_changed: PropertyValues): void {
    const label = (this.label ?? '').trim();
    let valid = true;
    if (label !== '' && (this.href ?? '').trim() === '' && !this.disabled) {
      devError('a subitem needs an href: the page it leads to.');
      valid = false;
    }
    /* No label is a mount, not an error: nothing to draw. */
    this.valid = valid && label !== '';
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const tooltip = (this.tooltip ?? '').trim();
    const content = html`<span class="label">${this.label.trim()}</span>${this.options
        ? html`<nph-icon class="arrow" name="chevron-right" size="sm"></nph-icon>`
        : nothing}`;
    const control = this.disabled
      ? /* Without href the link leaves the Tab order; the role keeps it a link for the screen reader. */
        html`<a class="control" id=${CONTROL_ID} role="link" aria-disabled="true">${content}</a>`
      : html`<a class="control" id=${CONTROL_ID} href=${this.href.trim()} aria-current=${this.active ? 'page' : nothing}
          >${content}</a
        >`;
    const balloon =
      tooltip !== '' && !this.disabled ? html`<nph-tooltip for=${CONTROL_ID} .text=${tooltip}></nph-tooltip>` : nothing;
    return html`${control}${balloon}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSidebarSubitem);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-sidebar-subitem': NphSidebarSubitem;
  }
}
