/**
 * `nph-switch` — the switch that turns a setting on or off, with an immediate effect.
 *
 * Contract accepted in Figma (frame `1549:2`, set `1548:56`), decisions D1 to D4 of the
 * task DSA-27, sheet `fichas/nph-switch.md`, `design.md` and decision P79 — nph-switch:
 * API and semantics:
 * - `checked`: the on state (the Figma `marcado`). Reflects, because the internal CSS
 *   selects the on piece by it. The inner native `<button>` carries `role="switch"` and
 *   `aria-checked`: this is a setting that turns on or off, not a button that keeps a
 *   state (`nph-togglebutton`, P73);
 * - `text`: the label, after the track. Without it (the Figma `mostrar rótulo` off), the
 *   piece is only the track;
 * - `label`: the accessible name of the piece without text (`aria-label` on the inner
 *   button). With text, the name comes from the text and `label` is not used;
 * - `invalid`: error outline on the track and `aria-invalid` on the inner button. The
 *   error sentence stays outside the piece;
 * - `disabled`: the whole piece at `state/disabled-opacity`, native `disabled` on the
 *   inner button (out of the Tab order). A disabled `<fieldset>` around the piece
 *   disables it too, except inside its first `<legend>`, as the browser does: the piece
 *   reads the fieldset itself (P83, item 4). `disabled` wins over `invalid`: the error
 *   outline is suppressed and the combination is not an error;
 * - the native events `input` (bubbles, composed) and then `change` (bubbles), fired only
 *   when the person toggles the piece (click, Enter or Space). Setting `checked` from code
 *   never fires them. The new value is read from `event.target.checked`. No `nph-*` event
 *   and nothing in `HTMLElementEventMap` (contract of the field, P83);
 * - `nphFieldRole` is `'option'`: inside `nph-field`, the piece is one option of a group;
 * - no size, no slot, no `::part`, no form association (a choice that goes with a
 *   submission is `nph-checkbox`);
 * - invalid input does not render and emits `console.error` only in development (P21
 *   rule): no text and no label.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import switchCss from './nph-switch.css?inline';

const TAG = 'nph-switch';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** Internal marker, not API: disabled by the property or by a disabled `<fieldset>` around it. */
const INACTIVE_ATTRIBUTE = 'data-nph-inactive';

/** Development error; outside a bundler with `import.meta.env`, it stays silent. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphSwitch extends LitElement {
  static override styles = unsafeCSS(switchCss);

  /* Host focus goes to the inner native `<button>`. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** Inside `nph-field`, the piece is one option of a group (contract of the field, P83). */
  static readonly nphFieldRole = 'option';

  static override properties = {
    /* The reflected ones are read by the internal CSS. */
    checked: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    text: { type: String },
    label: { type: String },
  };

  /** The on state. Changing it from code fires no event. */
  declare checked: boolean;
  declare invalid: boolean;
  declare disabled: boolean;
  /** The label, already localized by the consuming application. */
  declare text: string;
  /** Accessible name of the piece without text. With text, it is not used. */
  declare label: string;

  private valid = false;

  constructor() {
    super();
    this.checked = false;
    this.invalid = false;
    this.disabled = false;
    this.text = '';
    this.label = '';
    /* `click()` called on the host itself also stops in disabled. */
    this.addEventListener('click', (event) => this.blockInactive(event), { capture: true });
    this.addEventListener('click', () => this.toggle());
  }

  /** Disabled by its own property or by a disabled `<fieldset>` around it. */
  private get inactive(): boolean {
    return this.disabled || this.disabledByFieldset;
  }

  /**
   * A disabled `<fieldset>` ancestor disables the controls inside it, except those in its
   * first `<legend>`, as the browser does and as `nph-field` and `nph-input` read it (P83).
   */
  private get disabledByFieldset(): boolean {
    let ancestor = this.parentElement;
    while (ancestor !== null) {
      if (ancestor.localName === 'fieldset' && ancestor.hasAttribute('disabled')) {
        const firstLegend = [...ancestor.children].find((child) => child.localName === 'legend');
        if (firstLegend === undefined || !firstLegend.contains(this)) {
          return true;
        }
      }
      ancestor = ancestor.parentElement;
    }
    return false;
  }

  /** Watches the `disabled` attribute of the fieldsets around the piece, which raises no update. */
  private readonly fieldsetObserver = new MutationObserver((records) => {
    if (records.some((record) => record.target instanceof HTMLFieldSetElement && record.target.contains(this))) {
      this.requestUpdate();
    }
  });

  override connectedCallback(): void {
    super.connectedCallback();
    this.fieldsetObserver.observe(this.getRootNode(), { attributes: true, attributeFilter: ['disabled'], subtree: true });
    if (this.hasUpdated) {
      this.requestUpdate();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.fieldsetObserver.disconnect();
  }

  /** In disabled, the click neither toggles nor reaches the consumer. */
  private blockInactive(event: Event): void {
    if (this.inactive) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  /** A click that reached the host in a valid, enabled piece is the person toggling it. */
  private toggle(): void {
    if (!this.valid || this.inactive) {
      return;
    }
    this.checked = !this.checked;
    /* As a native control: `input` crosses shadow roots, `change` does not. */
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  protected override willUpdate(changed: PropertyValues): void {
    /* Read on every update: a fieldset around the piece may have changed. */
    this.toggleAttribute(INACTIVE_ATTRIBUTE, this.inactive);
    /* Only the inputs that decide validity are checked again, so the error does not repeat on a toggle. */
    if (!changed.has('text') && !changed.has('label')) {
      return;
    }
    this.valid = (this.text ?? '').trim() !== '' || (this.label ?? '').trim() !== '';
    if (!this.valid) {
      devError('without text, the piece needs a label: it is the accessible name of the piece that is only the track.');
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const text = (this.text ?? '').trim();

    return html`<button
      class="control"
      type="button"
      role="switch"
      aria-checked=${this.checked ? 'true' : 'false'}
      aria-label=${text === '' ? (this.label ?? '').trim() : nothing}
      aria-invalid=${this.invalid && !this.inactive ? 'true' : nothing}
      ?disabled=${this.inactive}
    >
      <span class="track" aria-hidden="true"
        ><span class="knob knob-off"></span><span class="knob knob-on"></span
      ></span>
      ${text === '' ? nothing : html`<span class="text">${text}</span>`}
    </button>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSwitch);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-switch': NphSwitch;
  }
}
