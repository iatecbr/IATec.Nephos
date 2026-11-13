/**
 * `nph-collapsible` — a trigger that opens and closes a block of content in the same place on the page.
 *
 * Contract accepted in Figma (documentation frame `6014:1688`, set `6006:2250`, root `6005:482`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-78, sheet
 * `fichas/nph-collapsible.md`, `design.md` and decision P121 — nph-collapsible: API and semantics:
 * - `type` (the Figma `tipo`): `line` (default), `button` or `preview`. In `line` the trigger is the
 *   whole row, with the title and the chevron. In `button` the trigger is an `nph-button`, secondary
 *   ghost, with a chevron at the end, to open details from an action. In `preview` the content is shown
 *   cut at three lines and the `nph-button` below it opens the rest;
 * - `appearance` (the `aparencia`): `flush` (default, no outline) or `card`;
 * - `indicator` (the `indicador`): `end` (default) or `start`. `size`: `compact`, `default` (default) or
 *   `large`. Both are valid for the `line` type only: the `button` and `preview` types use the chevron and
 *   the default size of the `nph-button`, so the two are ignored there, with a development warning;
 * - `open` (the `aberto`): the current state, as in `<details open>`. It starts closed. The person
 *   changes it and the event says so; setting it from code fires nothing. Reflects;
 * - `disabled`: does not open or close, leaves the Tab order and fades the whole piece;
 * - `label`: the title of the trigger, which is its accessible name. In `button` it is the text of the
 *   `nph-button`, and in `preview` the text while closed ("Show more"). `open-label` (`openLabel`): the
 *   text while open ("Show less"); without it the text does not change. It is for `button` and `preview`:
 *   in `line` the title never changes, so it is ignored there, with a warning. All texts are already
 *   localized by the consuming application: the piece writes no word of its own;
 * - `description`: the support line under the title; it is the accessible description. `icon`: the name of
 *   the start icon, a core name of `nph-icon`; empty draws none. Both for `line` only;
 * - the default slot is the content, free: any piece goes inside it;
 * - `nph-toggle`: `bubbles` and `composed`, with `detail: { open }`, fired only when the person opens or
 *   closes the content (click, Enter, Space or the search of the page), never for an `open` set by the
 *   page;
 * - no `::part`, no color property and no form association.
 *
 * SEMANTICS — the WAI-ARIA APG disclosure pattern. The trigger is a `button` with `aria-expanded` and
 * `aria-controls`; the name is the title and the description is the `aria-describedby`. The indicator and
 * the start icon are decorative. Tab reaches the trigger, Enter and Space open and close, the focus stays on
 * the trigger and arrows, Home, End and Esc do nothing; a click outside does not close. Closed content
 * leaves the Tab order and carries `hidden="until-found"`, so the search of the page finds the text inside
 * it and opens it; a disabled closed content carries plain `hidden`, because the search must not open what
 * the person cannot. In the `button` and `preview` types the trigger is an `nph-button`, whose native
 * button is inside its own shadow root: the piece writes `aria-expanded` and `ariaControlsElements` on that
 * native button, because an `id` reference does not cross a shadow root (P121, limit).
 *
 * MOVEMENT — the content grows and the chevron turns in `collapsible/expand-duration` with
 * `collapsible/expand-easing`; with reduced motion nothing moves. The `preview` type has no growth: a cut
 * of lines is not a size, so the cut is lifted and the text of the button changes.
 *
 * Invalid input draws nothing and emits `console.error` only in development, once per cause (rule of
 * P21): a `type`, `appearance`, `indicator` or `size` outside its list and an `icon` that is not a core
 * name. A `label` that is empty is a mount: it draws nothing and says nothing, because the text may arrive
 * after the first render.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import type { NphButton } from '../nph-button/nph-button';
import collapsibleCss from './nph-collapsible.css?inline';

const TAG = 'nph-collapsible';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The `id` of the trigger, of the content and of the two texts of the trigger; unique in the shadow root. */
const TRIGGER_ID = 'trigger';
const CONTENT_ID = 'content';
const TITLE_ID = 'title';
const DESCRIPTION_ID = 'description';

/** The event fired when the person opens or closes the content. */
export const NPH_COLLAPSIBLE_TOGGLE_EVENT = 'nph-toggle';

export const NPH_COLLAPSIBLE_TYPES = ['line', 'button', 'preview'] as const;
export type NphCollapsibleType = (typeof NPH_COLLAPSIBLE_TYPES)[number];

export const NPH_COLLAPSIBLE_APPEARANCES = ['flush', 'card'] as const;
export type NphCollapsibleAppearance = (typeof NPH_COLLAPSIBLE_APPEARANCES)[number];

export const NPH_COLLAPSIBLE_INDICATORS = ['end', 'start'] as const;
export type NphCollapsibleIndicator = (typeof NPH_COLLAPSIBLE_INDICATORS)[number];

export const NPH_COLLAPSIBLE_SIZES = ['compact', 'default', 'large'] as const;
export type NphCollapsibleSize = (typeof NPH_COLLAPSIBLE_SIZES)[number];

/** The detail of `nph-toggle`: the state the content is in now. */
export interface NphCollapsibleToggleDetail {
  open: boolean;
}

/** Where the content is: steady, or growing or shrinking. Internal, not API. */
type Phase = 'closed' | 'opening' | 'open' | 'closing';

/** The native button and the reflection the browser gives it for the elements an `aria-controls` points to. */
type ControlsTarget = HTMLElement & { ariaControlsElements: readonly Element[] | null };

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devMessage(kind: 'error' | 'warn', message: string): void {
  if (import.meta.env?.DEV) {
    console[kind](`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** The longest time of a `transition-duration` value (`0.25s`, `250ms`, `0s, 0.2s`), in milliseconds. */
export function longestDuration(value: string): number {
  let longest = 0;
  for (const part of value.split(',')) {
    const trimmed = part.trim();
    const amount = Number.parseFloat(trimmed);
    if (!Number.isFinite(amount)) continue;
    longest = Math.max(longest, trimmed.endsWith('ms') ? amount : amount * 1000);
  }
  return longest;
}

export class NphCollapsible extends LitElement {
  static override styles = unsafeCSS(collapsibleCss);

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    type: { type: String, reflect: true },
    appearance: { type: String, reflect: true },
    indicator: { type: String, reflect: true },
    size: { type: String, reflect: true },
    open: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    label: { type: String },
    openLabel: { type: String, attribute: 'open-label' },
    description: { type: String },
    icon: { type: String },
    phase: { state: true },
  };

  declare type: NphCollapsibleType;
  declare appearance: NphCollapsibleAppearance;
  declare indicator: NphCollapsibleIndicator;
  declare size: NphCollapsibleSize;
  /** The current state: open or closed. The person changes it and `nph-toggle` says so. */
  declare open: boolean;
  declare disabled: boolean;
  /** The title of the trigger, its accessible name. Already localized. */
  declare label: string;
  /** The text of the trigger while open, in `button` and `preview`. Already localized. */
  declare openLabel: string;
  /** The support line under the title, in `line`. Already localized. */
  declare description: string;
  /** The name of the start icon, a core name of `nph-icon`, in `line`. Empty draws none. */
  declare icon: string;
  /** Growing or shrinking, or steady. Internal. */
  declare protected phase: Phase;

  private valid = false;
  private reported = new Set<string>();
  private settleTimer: ReturnType<typeof setTimeout> | undefined;
  /** The trigger had the focus when the type changed, so the new trigger takes it. */
  private refocus = false;

  constructor() {
    super();
    this.type = 'line';
    this.appearance = 'flush';
    this.indicator = 'end';
    this.size = 'default';
    this.open = false;
    this.disabled = false;
    this.label = '';
    this.openLabel = '';
    this.description = '';
    this.icon = '';
    this.phase = 'closed';
  }

  /* The host takes no focus of its own: `delegatesFocus` would send a click on the content to the trigger. */
  override focus(options?: FocusOptions): void {
    this.trigger?.focus(options);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* A piece moved to another place starts from a steady state; the update rewrites the attributes. */
    if (this.hasUpdated) {
      this.phase = this.open ? 'open' : 'closed';
      this.requestUpdate();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopSettling();
    this.phase = this.open ? 'open' : 'closed';
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
    const appearance = this.appearance ?? '';
    const indicator = this.indicator ?? '';
    const size = this.size ?? '';
    const icon = text(this.icon);
    let valid = true;

    if (!oneOf(NPH_COLLAPSIBLE_TYPES, type)) {
      this.report('error', `type "${type}" does not exist. Use ${NPH_COLLAPSIBLE_TYPES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_COLLAPSIBLE_APPEARANCES, appearance)) {
      this.report('error', `appearance "${appearance}" does not exist. Use ${NPH_COLLAPSIBLE_APPEARANCES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_COLLAPSIBLE_INDICATORS, indicator)) {
      this.report('error', `indicator "${indicator}" does not exist. Use ${NPH_COLLAPSIBLE_INDICATORS.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_COLLAPSIBLE_SIZES, size)) {
      this.report('error', `size "${size}" does not exist. Use ${NPH_COLLAPSIBLE_SIZES.join(', ')}.`);
      valid = false;
    }
    if (icon !== '' && !isCoreName(icon)) {
      this.report('error', `icon "${icon}" is not a core name of nph-icon.`);
      valid = false;
    }

    if (valid) {
      if (type === 'line') {
        if (text(this.openLabel) !== '') {
          this.report('warn', 'open-label is for the button and preview types: in line the title does not change when the content opens, so it is ignored.');
        }
      } else {
        const ignored = [
          indicator !== 'end' ? 'indicator' : '',
          size !== 'default' ? 'size' : '',
          text(this.description) !== '' ? 'description' : '',
          icon !== '' ? 'icon' : '',
        ].filter((name) => name !== '');
        for (const name of ignored) {
          this.report('warn', `${name} is for the line type: the ${type} type uses the nph-button, so it is ignored.`);
        }
      }
    }
    return valid;
  }

  /** Whether the trigger is the `nph-button` of the `button` and `preview` types. */
  private get buttonTrigger(): boolean {
    return this.type === 'button' || this.type === 'preview';
  }

  /* ----- state ------------------------------------------------------------- */

  /** The trigger of the current type: the native button, or the `nph-button`. */
  private get trigger(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(`#${TRIGGER_ID}`);
  }

  private get content(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(`#${CONTENT_ID}`);
  }

  /** The preview type does not grow: it lifts the cut. */
  private get growing(): boolean {
    return this.type !== 'preview';
  }

  /** The time the content takes to grow, from the style the browser resolved: 0 with reduced motion. */
  private growDuration(): number {
    const panel = this.renderRoot.querySelector<HTMLElement>('.panel');
    return panel === null ? 0 : longestDuration(getComputedStyle(panel).transitionDuration);
  }

  private stopSettling(): void {
    clearTimeout(this.settleTimer);
    this.settleTimer = undefined;
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    this.valid = this.validate();
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid && text(this.label) !== '');

    /* A type change draws another trigger: when the old one had the focus, the new one takes it. */
    if (changed.has('type') && this.hasUpdated) {
      this.refocus = this.shadowRoot?.activeElement?.id === TRIGGER_ID;
    }

    const steady: Phase = this.open ? 'open' : 'closed';
    if (!this.hasUpdated || !this.valid || changed.has('type')) {
      this.stopSettling();
      this.phase = steady;
    } else if (changed.has('open')) {
      if (!this.growing || this.growDuration() === 0) {
        this.stopSettling();
        this.phase = steady;
      } else {
        /* A new direction while the content still moves: the transition reverses and ends once, in the new direction. */
        this.stopSettling();
        this.phase = this.open ? 'opening' : 'closing';
      }
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    this.applyHidden();
    void this.wireButton();

    if (this.phase === 'opening' || this.phase === 'closing') {
      this.settleSoon();
    }
    if (changed.has('open') && !this.open && this.hasUpdated && this.matches(':focus-within')) {
      /* Closed from the page with the focus inside the content: the focus goes to the trigger, not to the page. */
      this.trigger?.focus();
    }
    if (this.refocus) {
      this.refocus = false;
      void this.restoreFocus();
    }
  }

  /** The new trigger of another type takes the focus once it has drawn its native button. */
  private async restoreFocus(): Promise<void> {
    const trigger = this.trigger;
    if (trigger === null) return;
    await (trigger as Partial<NphButton>).updateComplete;
    trigger.focus();
  }

  /** A safety net for the end of the growth: a transition never ends in a box that is not rendered. */
  private settleSoon(): void {
    if (this.settleTimer !== undefined) return;
    const wait = this.growDuration();
    this.settleTimer = setTimeout(() => this.settle(), wait + 50);
  }

  /** The growth is over: the content is steady, open or closed. */
  private settle(): void {
    this.stopSettling();
    if (this.phase === 'opening') this.phase = 'open';
    else if (this.phase === 'closing') this.phase = 'closed';
  }

  private onTransitionEnd(event: TransitionEvent): void {
    if (event.target !== event.currentTarget || event.propertyName !== 'grid-template-rows') return;
    this.settle();
  }

  /**
   * Closed content is `hidden="until-found"`: out of the Tab order and out of the accessibility tree, and
   * found by the search of the page. The attribute is written here and not bound in the template: the browser
   * removes it by itself when the search opens the content, and a binding would not write it back. A disabled
   * closed content is plain `hidden`. It stays visible while it shrinks or grows.
   */
  private applyHidden(): void {
    const content = this.content;
    if (content === null || !this.growing) return;
    const closed = this.phase === 'closed';
    if (closed) {
      content.setAttribute('hidden', this.disabled ? 'hidden' : 'until-found');
    } else {
      content.removeAttribute('hidden');
    }
    content.toggleAttribute('inert', this.phase === 'closing');
  }

  /**
   * The native button of an `nph-button` carries the state of the disclosure: it is the element with a role,
   * and an `id` reference cannot reach the content across the shadow root, so the reflection of the elements
   * is used (the rule of P116). It is written again after each update because the native button is made
   * again when the `nph-button` goes invalid and comes back.
   */
  private async wireButton(): Promise<void> {
    if (!this.buttonTrigger) return;
    const button = this.renderRoot.querySelector<NphButton>('nph-button');
    if (button === null) return;
    await button.updateComplete;
    const native = button.shadowRoot?.querySelector<ControlsTarget>('button') ?? null;
    const content = this.content;
    if (native === null || content === null) return;
    native.setAttribute('aria-expanded', String(this.open));
    native.ariaControlsElements = [content];
  }

  /* ----- events ------------------------------------------------------------ */

  /** The person opens or closes the content. */
  private activate = (): void => {
    if (this.disabled) return;
    this.open = !this.open;
    this.announce();
  };

  /** The search of the page found text inside the closed content: the browser shows it and the piece follows. */
  private onFound = (): void => {
    if (this.open) return;
    this.open = true;
    this.announce();
  };

  private announce(): void {
    this.dispatchEvent(
      new CustomEvent<NphCollapsibleToggleDetail>(NPH_COLLAPSIBLE_TOGGLE_EVENT, {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /* ----- render ------------------------------------------------------------ */

  private renderLineTrigger(): TemplateResult {
    const title = text(this.label);
    const description = text(this.description);
    const icon = text(this.icon);
    const atStart = this.indicator === 'start';
    const indicator = html`<nph-icon
      class="indicator"
      name=${atStart ? 'chevron-right' : 'chevron-down'}
      size="sm"
      aria-hidden="true"
    ></nph-icon>`;
    return html`<button
      class="trigger"
      id=${TRIGGER_ID}
      type="button"
      ?disabled=${this.disabled}
      aria-expanded=${String(this.open)}
      aria-controls=${CONTENT_ID}
      aria-labelledby=${TITLE_ID}
      aria-describedby=${description !== '' ? DESCRIPTION_ID : nothing}
      @click=${this.activate}
    >
      ${atStart ? indicator : nothing}
      ${icon !== '' ? html`<nph-icon class="icon" name=${icon} size="sm" aria-hidden="true"></nph-icon>` : nothing}
      <span class="text">
        <span class="title" id=${TITLE_ID}>${title}</span>
        ${description !== '' ? html`<span class="description" id=${DESCRIPTION_ID}>${description}</span>` : nothing}
      </span>
      ${atStart ? nothing : indicator}
    </button>`;
  }

  /** The trigger of the `button` and `preview` types: an `nph-button`, secondary ghost, default size. */
  private renderButtonTrigger(): TemplateResult {
    const opened = this.open && text(this.openLabel) !== '';
    return html`<div class="button-row">
      <nph-button
        id=${TRIGGER_ID}
        severity="secondary"
        emphasis="ghost"
        size="default"
        text=${opened ? text(this.openLabel) : text(this.label)}
        icon-end=${this.open ? 'chevron-up' : 'chevron-down'}
        ?disabled=${this.disabled}
        @click=${this.activate}
      ></nph-button>
    </div>`;
  }

  /** The content: free, in the default slot, indented to the title when the indicator or the icon come first. */
  private renderPanel(): TemplateResult {
    const line = this.type === 'line';
    return html`<div class="panel" data-state=${this.phase} @transitionend=${this.onTransitionEnd}>
      <div class="clip" id=${CONTENT_ID} @beforematch=${this.onFound}>
        <div class="content">
          ${line && this.indicator === 'start' ? html`<span class="indent indent-indicator" aria-hidden="true"></span>` : nothing}
          ${line && text(this.icon) !== '' ? html`<span class="indent indent-icon" aria-hidden="true"></span>` : nothing}
          <div class="body"><slot></slot></div>
        </div>
      </div>
    </div>`;
  }

  /** The preview: the text, cut at three lines while closed, and the button below it. */
  private renderPreview(): TemplateResult {
    return html`<div class="preview">
      <div class="preview-content" id=${CONTENT_ID} data-clamped=${this.open ? nothing : ''}><slot></slot></div>
      ${this.renderButtonTrigger()}
    </div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid || text(this.label) === '') {
      return nothing;
    }
    if (this.type === 'preview') {
      return this.renderPreview();
    }
    return html`<div class="root">
      ${this.type === 'line' ? this.renderLineTrigger() : this.renderButtonTrigger()} ${this.renderPanel()}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphCollapsible);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-collapsible': NphCollapsible;
  }
}
