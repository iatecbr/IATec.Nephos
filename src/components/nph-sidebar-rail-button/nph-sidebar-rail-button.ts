/**
 * `nph-sidebar-rail-button` — the item of the collapsed lateral menu: only the icon, with the
 * name in the balloon.
 *
 * Contract accepted in Figma (board `1366:2`, documentation `2723:460`, set `2251:51328`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-53, sheet
 * `fichas/nph-sidebar-rail-button.md` and decision P98. It has its own folder and package
 * entry because the build takes one definition per folder (P91, item 1); its reading page and
 * its Validation are the ones of `nph-sidebar-item`:
 * - `label`: the name of the page. Required: without a visible label, it is the `aria-label`
 *   of the link and the text of the balloon, which is always on (P98, as the icon-only
 *   `nph-button`, P86);
 * - `icon`: one `nph-icon` core name at `icon/size-md`, `light` at rest and `solid` when
 *   active;
 * - `href`: the page it leads to. The rail button is a link;
 * - `active`: the current page, with `aria-current="page"`, `sidebar/rail-background-active`
 *   and the icon in `sidebar/rail-foreground-active`;
 * - `counter`: a whole number of pending items, in a pill on the top end corner (D-1). It is
 *   read as text, in the name of the link after the label: the name holds the text one sees
 *   on the button (WCAG 2.5.3; Elvys, 27-10-2026, DSA-32). Active, the pill gains an outline in
 *   `sidebar/panel-background` (D-2);
 * - `disabled`: the button at `state/disabled-opacity`, out of the Tab order, with no balloon;
 * - no event of its own: the click is the native `click`, which crosses the shadow root. The
 *   click on the balloon stops at the host (P98). No slot, no color property, no `::part`;
 * - invalid input does not render and emits `console.error` only in development, one per
 *   cause (P21). No label and no icon is a mount: nothing, no error (P66).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import '../nph-tooltip/nph-tooltip';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import railCss from './nph-sidebar-rail-button.css?inline';

const TAG = 'nph-sidebar-rail-button';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';
/** The `id` of the link, which the tooltip finds by `for`. */
const CONTROL_ID = 'control';
/** The `id` of the counter, the second part of the name of the link. */
const COUNTER_ID = 'counter';
/** The `id` of the balloon, the first part of the name of the link. */
const TOOLTIP_ID = 'name';

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

/** A counter is a whole number from zero up: it shows a number only. */
function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export class NphSidebarRailButton extends LitElement {
  static override styles = unsafeCSS(railCss);

  /* Host focus goes to the inner link. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    label: { type: String },
    icon: { type: String },
    href: { type: String },
    active: { type: Boolean, reflect: true },
    counter: { type: Number },
    disabled: { type: Boolean, reflect: true },
  };

  /** The name of the page, already localized by the consuming application. */
  declare label: string;
  declare icon: string;
  declare href: string;
  declare active: boolean;
  declare counter: number | null;
  declare disabled: boolean;

  private valid = false;

  constructor() {
    super();
    this.label = '';
    this.icon = '';
    this.href = '';
    this.active = false;
    this.counter = null;
    this.disabled = false;
    /* A disabled button lets no click through, `click()` on the host included. */
    this.addEventListener('click', (event) => this.blockDisabled(event), { capture: true });
    /* In the bubble phase: the click on the balloon is not a click on the button (P98). */
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
    const icon = (this.icon ?? '').trim();
    let valid = true;

    /* No label and no icon is a mount, not an error: nothing to draw. */
    const mount = label === '' && icon === '';
    if (!mount) {
      if (label === '') {
        devError('the rail button needs a label: it is the accessible name and the text of the balloon.');
        valid = false;
      }
      if (icon === '') {
        devError('the rail button needs an icon: a core name of nph-icon.');
        valid = false;
      } else if (!isCoreName(icon)) {
        devError(`icon "${icon}" is not a core name of nph-icon.`);
        valid = false;
      }
      if ((this.href ?? '').trim() === '' && !this.disabled) {
        devError('a rail button needs an href: the page it leads to.');
        valid = false;
      }
      if (this.counter !== null && this.counter !== undefined && !isCount(this.counter)) {
        devError('counter shows a whole number from zero up only; for a short text, use nph-badge.');
        valid = false;
      }
    }

    this.valid = valid && !mount;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const label = this.label.trim();
    const hasCounter = isCount(this.counter);
    const content = html`<nph-icon
        class="icon"
        name=${this.icon.trim()}
        size="md"
        variant=${this.active ? 'solid' : 'light'}
      ></nph-icon
      >${hasCounter ? html`<span class="counter" id=${COUNTER_ID}>${this.counter}</span>` : nothing}`;
    /*
     * The name is the label and then the counter, the text one sees on the button (WCAG
     * 2.5.3; Elvys, 27-10-2026, DSA-32). With the balloon, `aria-labelledby` reads its
     * text and the counter; the balloon finds its own id already there and adds nothing,
     * so the label is announced once (P86). Disabled, with no balloon, `aria-label` says
     * the same. The alternative discarded: the counter as the description, which left a
     * visible number out of the name.
     */
    const name = hasCounter ? `${label} ${this.counter}` : label;
    const control = this.disabled
      ? /* Without href the link leaves the Tab order; the role keeps it a link for the screen reader. */
        html`<a
          class="control"
          id=${CONTROL_ID}
          role="link"
          aria-disabled="true"
          aria-label=${name}
          >${content}</a
        >`
      : html`<a
          class="control"
          id=${CONTROL_ID}
          href=${this.href.trim()}
          aria-label=${label}
          aria-labelledby=${hasCounter ? `${TOOLTIP_ID} ${COUNTER_ID}` : TOOLTIP_ID}
          aria-current=${this.active ? 'page' : nothing}
          >${content}</a
        >`;
    const balloon = this.disabled
      ? nothing
      : html`<nph-tooltip id=${TOOLTIP_ID} for=${CONTROL_ID} relation="name" .text=${label}></nph-tooltip>`;
    return html`${control}${balloon}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSidebarRailButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-sidebar-rail-button': NphSidebarRailButton;
  }
}
