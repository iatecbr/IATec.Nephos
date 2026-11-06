/**
 * `nph-progress` — the bar that shows how much of a long process is done.
 *
 * Contract accepted in Figma (documentation frame `4385:3186`, sets `4368:1532` and `4368:1185`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-65, sheet
 * `fichas/nph-progress.md`, `design.md` and decision P107 — nph-progress: API and semantics:
 * - `type` (the Figma `tipo`): `determinate` (default) draws the proportion of `value`;
 *   `indeterminate` draws a segment one third of the track that runs in a loop, while there is no
 *   value; `steps` splits the bar into equal segments, one per fixed step. Reflected, because the
 *   internal CSS selects the parts by it;
 * - `size`: `md` (default) is the 8 px bar, `sm` the 4 px one. Reflected;
 * - `status` (the Figma `status`): `active` (default), `success` or `error`. Reflected, because the
 *   colors come from it. Success and error bring the status icon (`circle-check` or `circle-xmark`,
 *   solid) and, on error, the help text is required;
 * - `value`: a number from 0 to 100, 0 by default, read on `determinate`. At 0 the indicator is
 *   gone and only the end stop remains. Below 100 the end stop shows, and `progress/track-gap`
 *   separates the indicator from the rest of the track, so the indicator is slightly shorter than
 *   the exact proportion: the exact value is the text one;
 * - `steps` and `step`, read on `steps`: the number of steps, 3, 4 or 5 (the counts of the accepted
 *   Figma set), and the current one, from 1 to `steps`, 1 by default. On active the steps up to the
 *   current one are done and the rest pending; on error, the done ones, the step with the error and
 *   the rest pending; on success, all in success;
 * - `label`, `value-text` and `help`: the optional texts, already localized. The label is the
 *   accessible name; the value text is the percentage, the "N of M" or the state word; the help
 *   text says what is going on or, on error, what failed;
 * - the host `aria-label` is the accessible name when `label` is not given;
 * - no slot, no event, no hover, pressed or focus state, no focus ring, no `::part` and no color
 *   property. The bar is not interactive and is not an adjustment control.
 *
 * SEMANTICS — the `role="progressbar"` lives on the track, an element of the shadow root, and not
 * on the host: the track is named by the label (`aria-labelledby`) and described by the help text
 * (`aria-describedby`), and an id reference works only inside one shadow root. `aria-valuemin` is 0
 * and `aria-valuemax` 100. `determinate` gives `aria-valuenow` the value; `steps` gives it
 * `round(100 * step / steps)` (100 on success), counting the current step, which has the color of
 * the done ones, and the errored one, since the text says which it is; `indeterminate` omits it.
 * `aria-valuetext` is the value text. The status icon is decorative.
 *
 * MOTION — the only motion is the indeterminate loop, one pass in `progress/loop-duration` with
 * `progress/loop-easing`, from outside the left edge to outside the right edge, back with no
 * transition. It exists only on `type="indeterminate"`: the consumer switches to `determinate` when
 * the first real value arrives. With reduced motion the loop stops and the segment rests at the
 * start of the track, with the state word beside it (WCAG 2.3.3).
 *
 * Invalid input draws nothing and emits `console.error` only in development, with no visual
 * fallback (P66 rule): a `type`, `size` or `status` outside the values; a `value` that is not a
 * number from 0 to 100; success or error on `determinate` below 100 (the contract has them only at
 * 100, so `<nph-progress status="success">` alone, with its 0, draws nothing); any status but
 * `active` on `indeterminate`; a `steps` outside 3 to 5 or a `step` outside 1 to `steps`. An error
 * without `help` draws and warns, as does a bar with no accessible name: the text may arrive after
 * the first render.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import '../nph-icon/nph-icon';
import progressCss from './nph-progress.css?inline';

const TAG = 'nph-progress';

/** Internal mark, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The Figma `tipo`: `determinado`, `indeterminado` and `etapas`. */
export const NPH_PROGRESS_TYPES = ['determinate', 'indeterminate', 'steps'] as const;
export type NphProgressType = (typeof NPH_PROGRESS_TYPES)[number];

export const NPH_PROGRESS_SIZES = ['md', 'sm'] as const;
export type NphProgressSize = (typeof NPH_PROGRESS_SIZES)[number];

/** The Figma `status`: `ativo`, `sucesso` and `erro`. */
export const NPH_PROGRESS_STATUSES = ['active', 'success', 'error'] as const;
export type NphProgressStatus = (typeof NPH_PROGRESS_STATUSES)[number];

/** The step counts of the accepted Figma set (`etapas`). */
export const NPH_PROGRESS_STEP_COUNTS = [3, 4, 5] as const;

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devMessage(kind: 'error' | 'warn', message: string): void {
  if (import.meta.env?.DEV) {
    console[kind](`[${TAG}] ${message}`);
  }
}

function quote(value: unknown): string {
  return typeof value === 'string' ? `"${value}"` : String(value);
}

function list(values: readonly (string | number)[]): string {
  return values.map((value) => (typeof value === 'string' ? `"${value}"` : String(value))).join(', ');
}

export class NphProgress extends LitElement {
  static override styles = unsafeCSS(progressCss);

  static override properties = {
    /* `type`, `size` and `status` reflect because the internal CSS selects the parts by them. */
    type: { type: String, reflect: true },
    size: { type: String, reflect: true },
    status: { type: String, reflect: true },
    value: { type: Number },
    steps: { type: Number },
    step: { type: Number },
    label: { type: String },
    valueText: { type: String, attribute: 'value-text' },
    help: { type: String },
    /* The host `aria-label` is the accessible name when there is no `label`. It cannot be a
     * property called `ariaLabel`: that name is the native ARIA reflection of every element. */
    hostName: { type: String, attribute: 'aria-label' },
  };

  /** `determinate` by default. */
  declare type: NphProgressType;

  /** `md` by default; `sm` in a dense space. */
  declare size: NphProgressSize;

  /** `active` by default. Success and error bring the status icon. */
  declare status: NphProgressStatus;

  /** From 0 to 100, read on `determinate`. 0 by default. */
  declare value: number;

  /** The number of steps, 3, 4 or 5, read on `steps`. */
  declare steps: number | null;

  /** The current step, from 1 to `steps`, read on `steps`. 1 by default. */
  declare step: number;

  /** The visible label above the bar and the accessible name. Already localized. */
  declare label: string | null;

  /** The text beside the label: the percentage, "N of M" or a state word. Already localized. */
  declare valueText: string | null;

  /** The help text below the bar. Required on error. Already localized. */
  declare help: string | null;

  /** The host `aria-label`, the accessible name when `label` is not given. */
  declare hostName: string | null;

  private problem: string | null = null;
  private reported = '';
  private warnedNoName = false;
  private warnedNoHelp = false;

  constructor() {
    super();
    this.type = 'determinate';
    this.size = 'md';
    this.status = 'active';
    this.value = 0;
    this.steps = null;
    this.step = 1;
    this.label = null;
    this.valueText = null;
    this.help = null;
    this.hostName = null;
  }

  protected override willUpdate(): void {
    this.problem = this.validate();
    if (this.problem !== null) {
      /* One message per cause: a re-render with the same input stays silent. */
      if (this.problem !== this.reported) {
        devMessage('error', this.problem);
      }
      this.reported = this.problem;
    } else {
      this.reported = '';
      /* Once per cause: the flag clears when the help arrives or the status changes. */
      const missingHelp = this.status === 'error' && this.text(this.help) === '';
      if (missingHelp && !this.warnedNoHelp) {
        devMessage('warn', 'status "error" needs a `help` text that says what failed and what to do.');
      }
      this.warnedNoHelp = missingHelp;
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.problem === null);
  }

  protected override updated(_changed: PropertyValues): void {
    if (this.problem !== null || this.name() !== null) {
      this.warnedNoName = false;
      return;
    }
    if (!this.warnedNoName) {
      this.warnedNoName = true;
      devMessage('warn', 'the bar has no accessible name. Give it a `label` or an `aria-label`.');
    }
  }

  /** The reason the input is invalid, or `null`. */
  private validate(): string | null {
    if (!isOneOf(NPH_PROGRESS_TYPES, this.type)) {
      return `type ${quote(this.type)} does not exist. Use ${list(NPH_PROGRESS_TYPES)}.`;
    }
    if (!isOneOf(NPH_PROGRESS_SIZES, this.size)) {
      return `size ${quote(this.size)} does not exist. Use ${list(NPH_PROGRESS_SIZES)}.`;
    }
    if (!isOneOf(NPH_PROGRESS_STATUSES, this.status)) {
      return `status ${quote(this.status)} does not exist. Use ${list(NPH_PROGRESS_STATUSES)}.`;
    }
    if (this.type === 'indeterminate') {
      return this.status === 'active'
        ? null
        : `status ${quote(this.status)} does not exist on "indeterminate": it has only "active", since it has no end to report.`;
    }
    if (this.type === 'steps') {
      const steps = this.steps;
      if (!(NPH_PROGRESS_STEP_COUNTS as readonly unknown[]).includes(steps)) {
        return `steps ${String(steps)} does not exist. Use ${list(NPH_PROGRESS_STEP_COUNTS)}.`;
      }
      const step = this.step;
      if (!Number.isInteger(step) || step < 1 || step > (steps as number)) {
        return `step ${String(step)} is outside 1 to ${String(steps)}.`;
      }
      return null;
    }
    const value = this.value;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
      return `value ${String(value)} is not a number from 0 to 100.`;
    }
    if (this.status !== 'active' && value !== 100) {
      return `status ${quote(this.status)} exists on "determinate" only at value 100, and the value is ${String(value)}.`;
    }
    return null;
  }

  private text(value: string | null | undefined): string {
    return (value ?? '').trim();
  }

  /** The accessible name: the label, else the host `aria-label`. `null` when there is none. */
  private name(): string | null {
    const label = this.text(this.label);
    if (label !== '') return label;
    const host = this.text(this.hostName);
    return host === '' ? null : host;
  }

  /** `aria-valuenow`: the value, the share of steps, or none while there is no value. */
  private valueNow(): number | null {
    if (this.type === 'indeterminate') return null;
    if (this.type === 'steps') {
      return this.status === 'success' ? 100 : Math.round((100 * this.step) / (this.steps as number));
    }
    return this.value;
  }

  private renderHeader(label: string, valueText: string): TemplateResult | typeof nothing {
    const icon =
      this.status === 'success' ? 'circle-check' : this.status === 'error' ? 'circle-xmark' : null;
    if (label === '' && valueText === '' && icon === null) {
      return nothing;
    }
    return html`<div class="header">
      ${label === '' ? nothing : html`<span class="label" id="label">${label}</span>`}
      ${valueText === '' ? nothing : html`<span class="value-text">${valueText}</span>`}
      ${icon === null
        ? nothing
        : html`<nph-icon class="status-icon" name=${icon} variant="solid" size="sm"></nph-icon>`}
    </div>`;
  }

  private renderSegments(): TemplateResult {
    const count = this.steps as number;
    const states = Array.from({ length: count }, (_, index) => {
      if (this.status === 'success') return 'success';
      if (this.status === 'error') {
        return index + 1 < this.step ? 'done' : index + 1 === this.step ? 'error' : 'pending';
      }
      return index + 1 <= this.step ? 'done' : 'pending';
    });
    return html`${states.map((state) => html`<span class="segment" data-state=${state}></span>`)}`;
  }

  private renderTrackContent(): TemplateResult {
    if (this.type === 'steps') {
      return this.renderSegments();
    }
    if (this.type === 'indeterminate') {
      return html`<span class="segment-loop"></span>`;
    }
    const full = this.value === 100;
    /* The indicator and the rest of the track are two pills with the track gap between them: the
     * track itself paints nothing, so the gap shows the background of the page. */
    return html`<span
        class="indicator"
        ?hidden=${this.value === 0}
        data-full=${full ? 'true' : 'false'}
        style=${styleMap({ '--_value': String(this.value) })}
      ></span>
      ${full ? nothing : html`<span class="rest" style=${styleMap({ '--_value': String(this.value) })}></span><span class="stop"></span>`}`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problem !== null) {
      return nothing;
    }
    const label = this.text(this.label);
    const valueText = this.text(this.valueText);
    const help = this.text(this.help);
    const name = this.name();
    const now = this.valueNow();
    return html`<div class="root">
      ${this.renderHeader(label, valueText)}
      <div
        class="track"
        role="progressbar"
        aria-labelledby=${label === '' ? nothing : 'label'}
        aria-label=${label === '' && name !== null ? name : nothing}
        aria-describedby=${help === '' ? nothing : 'help'}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${now === null ? nothing : String(now)}
        aria-valuetext=${valueText === '' ? nothing : valueText}
      >
        ${this.renderTrackContent()}
      </div>
      ${help === '' ? nothing : html`<span class="help" id="help">${help}</span>`}
    </div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphProgress);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-progress': NphProgress;
  }
}
