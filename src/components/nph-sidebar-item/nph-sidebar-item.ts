/**
 * `nph-sidebar-item` — the first-level line of the lateral menu: it leads to a page or opens a
 * group of pages.
 *
 * Contract accepted in Figma (board `1366:2`, documentation `2723:460`, set `2251:51271`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-53, sheet
 * `fichas/nph-sidebar-item.md` and decision P98 — nph-sidebar-item, nph-sidebar-subitem and
 * nph-sidebar-rail-button: API and semantics:
 * - `type`: `link` (default) leads to a page through `href`; `group` opens and closes the
 *   subitems below it, through `expanded`. The Figma `counter` type is a link with
 *   `counter`; `group-closed` and `group-open` are `group` with `expanded` off and on.
 *   Destination, current page and opening come from code (evidence, Properties);
 * - `label`: the text of the line, one line with an ellipsis. It is the accessible name;
 * - `icon`: one `nph-icon` core name at `icon/size-md`, `light` at rest and `solid` when
 *   active or in an open group;
 * - `active`: the current page. The link takes `aria-current="page"`. It does not exist in
 *   a group;
 * - `counter`: a whole number of pending items, in a pill after the label. It is read as
 *   text, inside the name of the link. Only on a link;
 * - `disabled`: the page exists, but the person has no access now. The line at
 *   `state/disabled-opacity`, out of the Tab order, with no balloon and no more actions;
 * - `tooltip`: the text of the `nph-tooltip` that opens on hover and focus, the full name.
 *   It does not follow `label`; empty turns it off;
 * - `actions` and `actions-label`: the entries of the `nph-dropdown-menu` that the more
 *   actions button opens, and the name of that button. The button is the icon-only
 *   `nph-button` ghost and compact with `ellipsis-vertical`, at the end of the line, shown
 *   on hover and focus, for mouse and keyboard only (P98);
 * - the event `nph-toggle` (bubbles, composed), with `detail: { expanded }`, fired only when
 *   the person opens or closes a group. The `nph-item-select` of the menu is fired again on
 *   the host, with the same `detail`. A link fires nothing of its own: the click is the
 *   native `click`, which crosses the shadow root;
 * - the clicks on the more actions button, on its menu and on the balloon stop at the host:
 *   they are not a click on the line (P98, as the balloon of `nph-button`, P86);
 * - no slot, no color property and no `::part`;
 * - invalid input does not render and emits `console.error` only in development, one per
 *   cause (P21). No label is a mount: nothing, no error (precedent of `nph-kbd`, P66).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-dropdown-menu/nph-dropdown-menu';
import '../nph-icon/nph-icon';
import '../nph-tooltip/nph-tooltip';
import type { NphDropdownMenuEntry, NphDropdownMenuItemSelectDetail } from '../nph-dropdown-menu/nph-dropdown-menu';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import itemCss from './nph-sidebar-item.css?inline';

const TAG = 'nph-sidebar-item';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';
/** The `id` of the link or of the group button, which the tooltip finds by `for`. */
const CONTROL_ID = 'control';
/** The `id` of the more actions button, which the menu finds by `for`. */
const ACTIONS_ID = 'actions';

/** The two types of the code: the Figma `counter` is a link with `counter` (P98). */
export const NPH_SIDEBAR_ITEM_TYPES = ['link', 'group'] as const;
export type NphSidebarItemType = (typeof NPH_SIDEBAR_ITEM_TYPES)[number];

/** `nph-toggle`: the group the person opened or closed, and its new state. */
export const NPH_SIDEBAR_ITEM_TOGGLE_EVENT = 'nph-toggle';
export interface NphSidebarItemToggleDetail {
  expanded: boolean;
}

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/** A counter is a whole number from zero up: it shows a number only. */
export function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export class NphSidebarItem extends LitElement {
  static override styles = unsafeCSS(itemCss);

  /* Host focus goes to the inner link or group button. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    type: { type: String, reflect: true },
    label: { type: String },
    icon: { type: String },
    href: { type: String },
    active: { type: Boolean, reflect: true },
    expanded: { type: Boolean, reflect: true },
    counter: { type: Number },
    disabled: { type: Boolean, reflect: true },
    tooltip: { type: String },
    actions: { attribute: false },
    actionsLabel: { type: String, attribute: 'actions-label' },
  };

  declare type: NphSidebarItemType;
  /** The text of the line, already localized by the consuming application. */
  declare label: string;
  declare icon: string;
  declare href: string;
  declare active: boolean;
  declare expanded: boolean;
  declare counter: number | null;
  declare disabled: boolean;
  declare tooltip: string;
  declare actions: readonly NphDropdownMenuEntry[];
  declare actionsLabel: string;

  private valid = false;

  constructor() {
    super();
    this.type = 'link';
    this.label = '';
    this.icon = '';
    this.href = '';
    this.active = false;
    this.expanded = false;
    this.counter = null;
    this.disabled = false;
    this.tooltip = '';
    this.actions = [];
    this.actionsLabel = '';
    /* A disabled line lets no click through, `click()` on the host included. */
    this.addEventListener('click', (event) => this.blockDisabled(event), { capture: true });
    /*
     * In the bubble phase, after the menu and the button have handled their own click: the
     * click on more actions, on its menu or on the balloon is not a click on the line (P98).
     */
    this.addEventListener('click', (event) => this.blockInner(event));
  }

  private blockDisabled(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  private blockInner(event: Event): void {
    const root = this.shadowRoot;
    if (root === null) {
      return;
    }
    const inner = [...root.querySelectorAll('nph-button, nph-dropdown-menu, nph-tooltip')];
    if (event.composedPath().some((target) => inner.includes(target as Element))) {
      event.stopImmediatePropagation();
    }
  }

  private get hasActions(): boolean {
    return Array.isArray(this.actions) && this.actions.length > 0;
  }

  protected override willUpdate(_changed: PropertyValues): void {
    const type = this.type ?? '';
    const label = (this.label ?? '').trim();
    const icon = (this.icon ?? '').trim();
    const href = (this.href ?? '').trim();
    let valid = true;

    /* No label is a mount, not an error: nothing to draw and nothing to check. */
    if (label === '') {
      this.valid = false;
      this.toggleAttribute(RENDERED_ATTRIBUTE, false);
      return;
    }
    if (!oneOf(NPH_SIDEBAR_ITEM_TYPES, type)) {
      devError(`type "${type}" does not exist. Use ${NPH_SIDEBAR_ITEM_TYPES.join(', ')}.`);
      valid = false;
    }
    if (icon === '') {
      devError('the item needs an icon: a core name of nph-icon.');
      valid = false;
    } else if (!isCoreName(icon)) {
      devError(`icon "${icon}" is not a core name of nph-icon.`);
      valid = false;
    }
    if (type === 'link' && href === '' && !this.disabled) {
      devError('a link needs an href: the page it leads to.');
      valid = false;
    }
    if (type === 'group') {
      if (href !== '') {
        devError('a group has no href: it opens and closes its subitems.');
        valid = false;
      }
      if (this.active) {
        devError('a group is never active: only the current page is (P98).');
        valid = false;
      }
      if (this.counter !== null && this.counter !== undefined) {
        devError('a group has no counter: the counter is a link with the number of pending items.');
        valid = false;
      }
    }
    if (this.counter !== null && this.counter !== undefined && !isCount(this.counter)) {
      devError('counter shows a whole number from zero up only; for a short text, use nph-badge.');
      valid = false;
    }
    if (this.hasActions && (this.actionsLabel ?? '').trim() === '') {
      devError('more actions needs actions-label: it is the accessible name of the button.');
      valid = false;
    }

    this.valid = valid;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  private toggle(): void {
    if (this.disabled) {
      return;
    }
    this.expanded = !this.expanded;
    this.dispatchEvent(
      new CustomEvent<NphSidebarItemToggleDetail>(NPH_SIDEBAR_ITEM_TOGGLE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { expanded: this.expanded },
      }),
    );
  }

  /** The `nph-item-select` of the menu does not leave the shadow root: the host fires it again. */
  private forwardSelect(event: CustomEvent<NphDropdownMenuItemSelectDetail>): void {
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent<NphDropdownMenuItemSelectDetail>('nph-item-select', {
        bubbles: true,
        detail: { ...event.detail },
      }),
    );
  }

  private content(): TemplateResult {
    const group = this.type === 'group';
    const solid = group ? this.expanded : this.active;
    const counter = !group && isCount(this.counter) ? html`<span class="counter">${this.counter}</span>` : nothing;
    const arrow = group
      ? html`<nph-icon class="arrow" name=${this.expanded ? 'chevron-up' : 'chevron-down'} size="sm"></nph-icon>`
      : nothing;
    /* The space between label and counter keeps the name "Inbox 3", not "Inbox3". */
    return html`<nph-icon class="icon" name=${this.icon.trim()} size="md" variant=${solid ? 'solid' : 'light'}></nph-icon>
      <span class="label">${this.label.trim()}</span> ${counter}${arrow}`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const href = (this.href ?? '').trim();
    const tooltip = (this.tooltip ?? '').trim();
    const control =
      this.type === 'group'
        ? html`<button
            class="control"
            id=${CONTROL_ID}
            type="button"
            ?disabled=${this.disabled}
            aria-expanded=${this.expanded ? 'true' : 'false'}
            @click=${() => this.toggle()}
          >
            ${this.content()}
          </button>`
        : this.disabled
          ? /* Without href the link leaves the Tab order; the role keeps it a link for the screen reader. */
            html`<a class="control" id=${CONTROL_ID} role="link" aria-disabled="true">${this.content()}</a>`
          : html`<a class="control" id=${CONTROL_ID} href=${href} aria-current=${this.active ? 'page' : nothing}
              >${this.content()}</a
            >`;
    const actions =
      this.hasActions && !this.disabled
        ? html`<nph-button
              class="actions"
              id=${ACTIONS_ID}
              emphasis="ghost"
              size="compact"
              icon-start="ellipsis-vertical"
              label=${this.actionsLabel.trim()}
            ></nph-button>
            <nph-dropdown-menu
              for=${ACTIONS_ID}
              .items=${this.actions}
              @nph-item-select=${(event: CustomEvent<NphDropdownMenuItemSelectDetail>) => this.forwardSelect(event)}
            ></nph-dropdown-menu>`
        : nothing;
    const balloon =
      tooltip !== '' && !this.disabled ? html`<nph-tooltip for=${CONTROL_ID} .text=${tooltip}></nph-tooltip>` : nothing;
    return html`${control}${actions}${balloon}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSidebarItem);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-sidebar-item': NphSidebarItem;
  }
  interface HTMLElementEventMap {
    'nph-toggle': CustomEvent<NphSidebarItemToggleDetail>;
  }
}
