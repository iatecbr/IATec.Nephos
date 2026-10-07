/**
 * `nph-radio` — one exclusive choice inside a group.
 *
 * Contract accepted in Figma (frame `1196:311`, set `848:66`) and P69:
 * - `checked` (the Figma `marcado`: false or true). There is no indeterminate;
 * - `text`: the text beside the circle and the accessible name. A click on it
 *   also checks the option;
 * - `hide-text` (the `mostrar rótulo` turned off): the text leaves the screen
 *   and becomes the `aria-label`, and the piece stays at 24 × 24;
 * - `invalid` (the `erro`): border in `status/error` and `aria-invalid`. The
 *   error sentence belongs to `nph-field`. Error and disabled do not combine
 *   (frame, section 5): both together are invalid input;
 * - `disabled`: the whole piece at `state/disabled-opacity`, out of Tab and of
 *   the arrows;
 * - `name` and `value` (default `on`): the group is every `nph-radio` with the
 *   same non-empty `name`, in the same root and in the same form. Without
 *   `name`, the radio is alone. The group is not a component: the name of the
 *   group and `role="radiogroup"` belong to whoever assembles it (`nph-field`);
 * - checking one (click, keyboard or `checked = true` in code) unchecks the
 *   others of the group, with no event for the unchecked ones. Two checked at
 *   mount: the last one in document order stays, as in native HTML;
 * - keyboard (WAI-ARIA APG, Radio Group): a single Tab stop per group — the
 *   checked one or, with none, the first enabled one. The arrows move to the
 *   next or previous enabled one, wrapping around, and check it; Space checks
 *   the focused one. A second click on the checked one does not uncheck;
 * - `aria-posinset` and `aria-setsize` are computed from the group, because
 *   each radio lives in its own shadow root and assistive technology does not
 *   find the siblings;
 * - disabled (by the property or by a disabled `<fieldset>`) hides the error
 *   and removes `aria-invalid`;
 * - why not a native `<input type="radio">`: native radios do not group across
 *   different shadow roots, so each one would be a group of one;
 * - the piece is form-associated and submits `value` only when checked.
 *   `input` and `change` are dispatched on the host of the newly checked one;
 * - no slot, no event of its own, no color property and no `::part`;
 * - invalid input does not render and emits `console.error` only in
 *   development, one per cause: `text` empty (a control without a name, WCAG
 *   4.1.2 — not the mount state of P66 and P68) and `invalid` with `disabled`.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import radioCss from './nph-radio.css?inline';

const TAG = 'nph-radio';

/** Internal marker, not API. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphRadio extends LitElement {
  static override styles = unsafeCSS(radioCss);

  /* Host focus goes to the inner element with `role="radio"`. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /* Takes part in `<form>`, `<fieldset disabled>` and form reset. */
  static formAssociated = true;

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    checked: { type: Boolean, reflect: true },
    text: { type: String },
    hideText: { type: Boolean, reflect: true, attribute: 'hide-text' },
    invalid: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    /* `name` reflects because the form reads the host attribute. */
    name: { type: String, reflect: true },
    value: { type: String },
  };

  declare checked: boolean;
  /** The text beside the circle, already localized by the consuming application. */
  declare text: string;
  declare hideText: boolean;
  declare invalid: boolean;
  declare disabled: boolean;
  declare name: string;
  declare value: string;

  private readonly internals: ElementInternals;
  private valid = false;
  private formDisabled = false;
  private defaultChecked: boolean | null = null;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.checked = false;
    this.text = '';
    this.hideText = false;
    this.invalid = false;
    this.disabled = false;
    this.name = '';
    this.value = 'on';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* The `checked` attribute at the first connection is the reset value. */
    if (this.defaultChecked === null) {
      this.defaultChecked = this.hasAttribute('checked');
    }
    this.refreshGroup();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    /* The Tab stop of the group may have left with this one. */
    for (const other of this.group()) {
      if (other !== this) other.requestUpdate();
    }
  }

  formResetCallback(): void {
    this.checked = this.defaultChecked ?? false;
  }

  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled;
    this.refreshGroup();
  }

  /** Disabled by the property or by a disabled `<fieldset>`. */
  private get inactive(): boolean {
    return this.disabled || this.formDisabled;
  }

  /** The members of the group, in document order, this one included. */
  private group(): NphRadio[] {
    const name = (this.name ?? '').trim();
    if (name === '' || !this.isConnected) {
      return [this];
    }
    const root = this.getRootNode() as Document | ShadowRoot;
    return [...root.querySelectorAll<NphRadio>(TAG)].filter(
      (radio) => radio instanceof NphRadio && radio.name === this.name && radio.internals.form === this.internals.form,
    );
  }

  /** Every member draws its Tab stop again. */
  private refreshGroup(): void {
    for (const radio of this.group()) {
      radio.requestUpdate();
    }
  }

  /** The member of the group that receives Tab: the checked one or the first enabled one. */
  private tabStop(group: NphRadio[]): NphRadio | undefined {
    const enabled = group.filter((radio) => !radio.inactive && radio.valid);
    return enabled.find((radio) => radio.checked) ?? enabled[0];
  }

  protected override willUpdate(changed: PropertyValues): void {
    const text = (this.text ?? '').trim();
    let valid = true;
    if (text === '') {
      devError('text is empty: the radio needs text, which is its accessible name.');
      valid = false;
    }
    if (this.invalid && this.disabled) {
      devError('invalid and disabled do not combine (frame 1196:311, section 5).');
      valid = false;
    }
    this.valid = valid;
    this.toggleAttribute(RENDERED_ATTRIBUTE, valid);

    if (changed.has('checked') && this.checked) {
      const others = this.group().filter((radio) => radio !== this && radio.checked);
      const laterChecked = others.some(
        (radio) => this.compareDocumentPosition(radio) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
      if (!this.hasUpdated && laterChecked) {
        /* Two checked at mount: the last one in document order stays. */
        this.checked = false;
      } else {
        for (const radio of others) radio.checked = false;
      }
    }
    this.internals.setFormValue(valid && this.checked ? (this.value ?? 'on') : null);
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('checked') || changed.has('disabled') || changed.has('name')) {
      for (const radio of this.group()) {
        if (radio !== this) radio.requestUpdate();
      }
    }
  }

  /** Checks this one and announces it. Already checked: nothing. */
  private select(): void {
    if (this.inactive || this.checked) return;
    this.checked = true;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private control(): HTMLElement | null {
    return this.shadowRoot?.querySelector<HTMLElement>('.row') ?? null;
  }

  private onKeydown(event: KeyboardEvent): void {
    if (this.inactive) return;
    if (event.key === ' ') {
      event.preventDefault();
      this.select();
      return;
    }
    const step =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? -1
          : 0;
    if (step === 0) return;
    event.preventDefault();
    const members = this.group().filter((radio) => !radio.inactive && radio.valid);
    const index = members.indexOf(this);
    if (index === -1 || members.length < 2) return;
    const next = members[(index + step + members.length) % members.length];
    if (next === undefined) return;
    next.select();
    next.control()?.focus();
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const text = this.text.trim();
    /* One query of the group per render, for the Tab stop and the position. */
    const group = this.group();
    const tabindex = this.inactive ? nothing : this.tabStop(group) === this ? '0' : '-1';
    /* Each radio lives in its own shadow root: the position in the group is computed. */
    const members = group.filter((radio) => radio.valid || radio === this);
    const position = members.indexOf(this) + 1;
    return html`<div
      class="row"
      role="radio"
      tabindex=${tabindex}
      aria-checked=${this.checked ? 'true' : 'false'}
      aria-disabled=${this.inactive ? 'true' : nothing}
      aria-invalid=${this.invalid && !this.inactive ? 'true' : nothing}
      aria-posinset=${position}
      aria-setsize=${members.length}
      aria-label=${this.hideText ? text : nothing}
      @click=${() => this.select()}
      @keydown=${(event: KeyboardEvent) => this.onKeydown(event)}
    >
      <span class="target"><span class="circle"><span class="dot"></span></span></span>
      ${this.hideText ? nothing : html`<span class="text">${text}</span>`}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphRadio);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-radio': NphRadio;
  }
}
