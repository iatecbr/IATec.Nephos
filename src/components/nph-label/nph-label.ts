/**
 * `nph-label` — the label of a form control.
 *
 * Approved contract (spec `nph-label`; Decision Register, `nph-label`
 * section):
 * - the label is ONLY text. It has no box, border, background, shadow or state;
 * - `required` appends an asterisk to the end of the text, in `status/error`;
 * - there is NO layout, weight or state property. Position belongs to
 *   `nph-field`; an error does not change the label; disabled fades the whole
 *   control, through `nph-field`, not through a state of its own;
 * - help and error message belong to `nph-field`. The label carries the help
 *   TRIGGER, not the help (L8): with `info` and `infoLabel`, an information
 *   icon after the text opens `nph-tooltip` with the text of `info`.
 *   The trigger receives focus, with border and halo (L9). The balloon opens on
 *   hover and on keyboard focus, above the label, and closes with Esc, when the
 *   pointer leaves or on blur; `nph-tooltip` does all of it (P77, which amends P62.6).
 *
 * EXCEPTION TO P01 — this is the only Nephos component WITHOUT Shadow DOM.
 * The native association between label and control does not cross the Shadow
 * DOM boundary: `for` would not reach an `id` in the document and clicking
 * the label would not move the cursor to the field. Since that is the reason
 * a label exists, encapsulation yields. Recorded in P62.1,
 * after the alternative of delegating the association to `nph-field` was
 * discarded because it blocked the P0 cut — `nph-field` does not exist yet.
 *
 * API — five properties (P62.3, widened by P62.6):
 * - `required`, the only one foreseen in the original Register;
 * - `for`, which mirrors the native `<label>` attribute and is the
 *   association mechanism chosen by the 27-08 decision;
 * - `text`, which carries the label text. It is a property, not content
 *   between the tags, because without Shadow DOM there is no `<slot>`: Lit
 *   renders inside the element itself and would replace any child written by
 *   the consumer;
 * - `info`, the text of the explanation the bubble shows;
 * - `infoLabel` (`info-label`), the accessible name of the trigger (L11.3).
 * The trigger only appears with both filled in. `info` without `infoLabel` is
 * invalid input: the trigger does not appear and `console.error` fires in
 * development, but the label stays — it is the name of the control and does
 * not disappear because of the help (P62.6). `infoLabel` without `info` is
 * assembly: nothing.
 *
 * ACCESSIBILITY — the asterisk is DECORATIVE for assistive technology and
 * carries `aria-hidden`. The required state must reach the screen reader
 * through the control itself, with `required`, not through hidden text inside
 * the label. Two reasons: the required state belongs to the field, not to the
 * label, and hidden text would require a Portuguese string inside the
 * component, forbidden by the trilingual plan — no `nph-*` knows a language.
 *
 * The trigger is a native `<button>` AFTER the `<label>`, outside it: inside,
 * it would enter the accessible name of the control. The balloon is the
 * `nph-tooltip` next to it, in the same root (`for`), and the trigger is
 * described by it (`aria-describedby`, put by the tooltip). A click on the
 * trigger does nothing: the balloon never opens on touch (P77).
 *
 * Besides that, a form that uses `required` needs a visible legend
 * explaining the asterisk convention. That is a screen rule, checked in the
 * composition review, not something the component can enforce on its own.
 */
import { LitElement, html, nothing } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import '../nph-tooltip/nph-tooltip';
import './nph-label.css';

const TAG = 'nph-label';

/** Host marker when the trigger exists: the CSS only changes the root in that case. */
const INFO_ATTRIBUTE = 'data-nph-info';

let nextId = 0;

/**
 * Development error, following the `nph-icon` pattern. Outside a bundler that
 * defines `import.meta.env`, optional chaining keeps it silent.
 */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphLabel extends LitElement {
  static override properties = {
    text: { type: String },
    required: { type: Boolean, reflect: true },
    for: { type: String, reflect: true },
    info: { type: String },
    infoLabel: { type: String, attribute: 'info-label' },
  };

  /** The label text. Arrives already localized by the consuming application. */
  declare text: string;

  /** Required field. Appends the asterisk to the end of the text. */
  declare required: boolean;

  /** `id` of the control this label names. Mirrors the native attribute. */
  declare for: string | null;

  /** The text of the explanation, shown in `nph-tooltip`. Already localized. */
  declare info: string;

  /** Accessible name of the information trigger. Already localized. */
  declare infoLabel: string;

  /** `id` of the trigger, which the `nph-tooltip` finds by `for`. Unique per instance. */
  private readonly triggerId = `${TAG}-info-${++nextId}`;

  /** Last cause reported, to report once per cause. */
  private reported = '';

  constructor() {
    super();
    this.text = '';
    this.required = false;
    this.for = null;
    this.info = '';
    this.infoLabel = '';
  }

  /**
   * Renders in the light DOM, not in Shadow DOM. See the P01 exception note at the top.
   * Without this, `for` would not reach the control and the label would lose its function.
   */
  protected override createRenderRoot(): HTMLElement {
    return this;
  }

  private get infoText(): string {
    return (this.info ?? '').trim();
  }

  private get triggerName(): string {
    return (this.infoLabel ?? '').trim();
  }

  private get hasTrigger(): boolean {
    return this.infoText !== '' && this.triggerName !== '';
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('info') || changed.has('infoLabel')) {
      if (this.infoText !== '' && this.triggerName === '') {
        const cause = 'info without info-label';
        if (this.reported !== cause) {
          this.reported = cause;
          devError('info requires info-label, the accessible name of the trigger; the trigger was not drawn.');
        }
      } else {
        this.reported = '';
      }
    }
  }

  protected override updated(): void {
    this.toggleAttribute(INFO_ATTRIBUTE, this.hasTrigger);
  }

  protected override render(): TemplateResult {
    const label = html`<label class="nph-label__text" for=${this.for ?? nothing}
      >${this.text}${this.required
        ? html`<span class="nph-label__required" aria-hidden="true">*</span>`
        : nothing}</label
    >`;
    if (!this.hasTrigger) {
      return label;
    }
    return html`${label}<button
        class="nph-label__info"
        id=${this.triggerId}
        type="button"
        aria-label=${this.triggerName}
      >
        <nph-icon name="circle-info" variant="solid" size="sm"></nph-icon></button
      ><nph-tooltip class="nph-label__tooltip" for=${this.triggerId} .text=${this.infoText}></nph-tooltip>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphLabel);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-label': NphLabel;
  }
}
