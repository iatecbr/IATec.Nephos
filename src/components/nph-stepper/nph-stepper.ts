/**
 * `nph-stepper` — the steps of a process in order, and the one the person is on.
 *
 * Contract accepted in Figma (documentation frame `5569:6530`, sets `5541:1622` and `5540:581`),
 * recorded as text in the evidence of the `figma-docs-accepted` gate of DSA-73, sheet
 * `fichas/nph-stepper.md`, `design.md` and decision P117 — nph-stepper: API and semantics:
 * - `steps`: the steps, in order, as a list of `{ label, description?, optional?, status?, disabled?,
 *   href? }`. Property only. From 2 to 7: two are allowed (DSA-65 D-1), the documentation asks for
 *   three to seven, and seven is the maximum. `label` is one or two words. `description` is the
 *   support line below the label and, on a step with an error, the reason. `optional` turns on the
 *   word "Optional". `status` is `pending`, `completed` or `error`; without it the status comes from
 *   the position: before `current` is completed, after it is pending. The step at `current` takes no
 *   `status` and no `disabled`: it is where the person is, and a blocked step cannot be it;
 * - `current`: the position of the current step, an integer from 1 to the number of steps (the Figma
 *   `atual`), 1 by default. The page sets it: the stepper keeps no state;
 * - `non-linear` (`nonLinear`): off, the stepper is linear and only the completed steps and the steps
 *   with an error are clickable, to go back and review. On, the pending steps are clickable too. A
 *   disabled step and the current step are never clickable. Reflects, so the consumer can style and
 *   check it;
 * - a clickable step is a link when it has `href`, and a button when it has none. A link fires only the
 *   native `click`, which a router handles as it handles any link (as `nph-breadcrumb`). A button
 *   fires `nph-step-select`, `bubbles` and `composed`, with `detail: { step }` — the 1-based position —
 *   only when the person activates it, never for a `current` set by the page. The page changes
 *   `current`, moves the focus to the heading of the new step and updates the page title: the stepper
 *   moves nothing by itself;
 * - `label` and the host `aria-label`: the accessible name of the navigation landmark;
 * - `completed-label`, `pending-label` and `error-label`: the hidden text that opens each step and
 *   says its status; `optional-label`: the word "Optional"; `step-text`: the text of the narrow
 *   width, with `{current}` and `{count}` ("Step {current} of {count}"). All are already localized by
 *   the consuming application;
 * - no slot, no `::part` and no color property.
 *
 * SEMANTICS — a `nav` with a name, holding an ordered list; the stepper is not a tablist and has no
 * arrow keys (W3C multi-page forms tutorial, APG Link pattern). The current step carries
 * `aria-current="step"` and is not a Tab stop; a disabled step carries `aria-disabled="true"` and is
 * not a Tab stop either. Only the clickable steps enter Tab, in list order. A pending step of the
 * linear stepper whose label is cut enters Tab only to open the balloon with the whole text: it is not
 * a link, Enter does nothing, and the balloon describes it (P117, inferred from the linear rule and
 * DSA-48). The status is hidden text at the start of the step, with no hidden text on the current step
 * (the attribute says it); the marker is `aria-hidden`; the description and "Optional" are part of the
 * step, so the reason of an error is read. The connector is decorative: it has no list item of its own
 * and is hidden from assistive technology.
 *
 * COMBINED STATES (rule T11) — completed + disabled keeps the background and the check under the
 * disabled opacity. Error + disabled: disabled wins, the marker goes back to the pending one, the
 * hidden text is the pending one and the reason shows, in the description color, only when the
 * description is on. Status + hover keeps the look of the status: hover paints the pending and
 * completed steps, and only underlines the label of the step with an error. A focused step has no
 * hover background.
 *
 * WIDTH — the text column stops at `stepper/text-max-width`. The label of a pending, completed or error
 * step stays on one line and is cut with an ellipsis, and the whole text opens in `nph-tooltip`; the
 * label of the current step wraps to up to two lines and is never cut. The description goes up to two
 * lines. The connector fills the space between the steps and never gets narrower than
 * `stepper/connector-min-width`. Below 600 px of its own width the stepper becomes `nph-progress` of
 * the steps type, with "Step 2 of 4" and the current label (DSA-65). It measures the host, not the
 * window; a query does not accept a custom property, so the 600 px is written in the CSS, as the
 * breakpoint of `nph-dialog` is (P87). The stepper stretches to the width of where it lives: in a
 * shrink-to-fit parent, give it a width.
 *
 * MOTION — only color, in `stepper/state-duration`; with reduced motion, nothing moves.
 *
 * Invalid input draws nothing and emits `console.error` only in development, one per cause (P66
 * rule): `steps` that is not a list, or with fewer than 2 or more than 7 steps; a step without
 * `label`; a `status` outside the list; a `status` or `disabled` on the current step; an unsafe
 * `href`; a `current` that is not an integer from 1 to the number of steps. A stepper with no
 * accessible name, a status with no hidden text, an optional step with no `optional-label` and a
 * narrow width with no `step-text` draw and warn: the texts may arrive after the first render. An
 * empty `steps` is a mount: it draws nothing and says nothing.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import '../nph-progress/nph-progress';
import '../nph-tooltip/nph-tooltip';
import stepperCss from './nph-stepper.css?inline';

const TAG = 'nph-stepper';

/** Internal marker, not API: present only when the input is valid. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** The documentation asks for three to seven steps; two are allowed (DSA-65 D-1); seven is the maximum. */
export const NPH_STEPPER_MIN_STEPS = 2;
export const NPH_STEPPER_MAX_STEPS = 7;

/** The status a step may be given. The current one is set by `current` and never by a step. */
export const NPH_STEPPER_STATUSES = ['pending', 'completed', 'error'] as const;
export type NphStepperStatus = (typeof NPH_STEPPER_STATUSES)[number];

/** The protocols a link of the stepper may take; a relative path and a fragment resolve to the page's. */
export const NPH_STEPPER_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'] as const;

/**
 * Whether an address may be the `href` of a step. It is parsed as the browser would — tabs and line
 * breaks inside the scheme are dropped — so `java\nscript:` is caught as `javascript:` (the same rule
 * as the level of `nph-breadcrumb` and the link cell of `nph-table`).
 */
export function isSafeHref(href: string): boolean {
  try {
    return (NPH_STEPPER_LINK_PROTOCOLS as readonly string[]).includes(new URL(href, document.baseURI).protocol);
  } catch {
    return false;
  }
}

/** One step of the process. */
export interface NphStep {
  /** The text of the step, one or two words. Already localized. */
  label: string;
  /** The support line below the label; on a step with an error, the reason. Already localized. */
  description?: string;
  /** Shows the word "Optional" (the `optional-label`). */
  optional?: boolean;
  /** `pending`, `completed` or `error`. Without it, the status comes from the position. */
  status?: NphStepperStatus;
  /** The step cannot be activated. Not on the current step. */
  disabled?: boolean;
  /** The page the step leads to. A clickable step with it is a link; without it, a button. */
  href?: string;
}

/** The detail of `nph-step-select`: the 1-based position of the step the person activated. */
export interface NphStepSelectDetail {
  step: number;
}

/** What a step looks like, which is not always what it says: a disabled error step looks pending. */
type Look = 'pending' | 'current' | 'completed' | 'error';

/** Development message; outside a bundler with `import.meta.env`, it stays silent. */
function devMessage(kind: 'error' | 'warn', message: string): void {
  if (import.meta.env?.DEV) {
    console[kind](`[${TAG}] ${message}`);
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** The values the markers of `step-text` take. */
const MARKER = /\{(current|count)\}/g;

export class NphStepper extends LitElement {
  static override styles = unsafeCSS(stepperCss);

  static override properties = {
    steps: { attribute: false },
    current: { type: Number },
    nonLinear: { type: Boolean, attribute: 'non-linear', reflect: true },
    label: { type: String },
    completedLabel: { type: String, attribute: 'completed-label' },
    pendingLabel: { type: String, attribute: 'pending-label' },
    errorLabel: { type: String, attribute: 'error-label' },
    optionalLabel: { type: String, attribute: 'optional-label' },
    stepText: { type: String, attribute: 'step-text' },
    /* The host `aria-label` is the accessible name when there is no `label`. It cannot be a property
     * called `ariaLabel`: that name is the native ARIA reflection of every element. */
    hostName: { type: String, attribute: 'aria-label' },
    cutSteps: { state: true },
  };

  /** The steps, in order, from 2 to 7. */
  declare steps: readonly NphStep[];

  /** The position of the current step, from 1 to the number of steps. 1 by default. */
  declare current: number;

  /** Off (linear), only the completed steps and the steps with an error are clickable. On, the pending ones too. */
  declare nonLinear: boolean;

  /** The accessible name of the navigation landmark. Already localized. */
  declare label: string | null;

  /** The hidden text of a completed step. Already localized. */
  declare completedLabel: string | null;

  /** The hidden text of a pending step. Already localized. */
  declare pendingLabel: string | null;

  /** The hidden text of a step with an error. Already localized. */
  declare errorLabel: string | null;

  /** The word "Optional". Already localized. */
  declare optionalLabel: string | null;

  /** The text of the narrow width, with `{current}` and `{count}`. Already localized. */
  declare stepText: string | null;

  /** The host `aria-label`, the accessible name when `label` is not given. */
  declare hostName: string | null;

  /** The positions (0-based) of the steps whose label is cut. Measured, not API. */
  declare protected cutSteps: readonly number[];

  private problem: string | null = null;
  private reported = '';
  private warned = new Set<string>();
  private resizeObserver: ResizeObserver | undefined;
  private observed: Element[] = [];

  constructor() {
    super();
    this.steps = [];
    this.current = 1;
    this.nonLinear = false;
    this.label = null;
    this.completedLabel = null;
    this.pendingLabel = null;
    this.errorLabel = null;
    this.optionalLabel = null;
    this.stepText = null;
    this.hostName = null;
    this.cutSteps = [];
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.measure());
    /* The font changes the width of the text once it loads. */
    document.fonts?.ready.then(() => this.measure());
    /* A stepper moved to another place observes its labels again: the observer was disconnected when it
       left, and only an update installs it. */
    if (this.hasUpdated) this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.observed = [];
  }

  /* ----- validation -------------------------------------------------------- */

  /** An empty list is a mount, not a problem: nothing is drawn and nothing is said. */
  private get empty(): boolean {
    return Array.isArray(this.steps) && this.steps.length === 0;
  }

  /** The reason the input is invalid, or `null`. */
  private validate(): string | null {
    const steps = this.steps;
    if (!Array.isArray(steps)) {
      return '`steps` is not a list. Give it the steps, in order.';
    }
    if (steps.length === 0) {
      return null;
    }
    if (steps.length < NPH_STEPPER_MIN_STEPS || steps.length > NPH_STEPPER_MAX_STEPS) {
      return `steps has ${String(steps.length)} step(s). A stepper has ${String(NPH_STEPPER_MIN_STEPS)} to ${String(NPH_STEPPER_MAX_STEPS)}; above that, split the process.`;
    }
    const current = this.current;
    if (typeof current !== 'number' || !Number.isInteger(current) || current < 1 || current > steps.length) {
      return `current ${String(current)} is outside 1 to ${String(steps.length)}: it is the position of the current step.`;
    }
    for (const [index, step] of steps.entries()) {
      const where = `step ${String(index + 1)}`;
      if (step === null || typeof step !== 'object' || text(step.label) === '') {
        return `${where} has no \`label\`.`;
      }
      if (step.status !== undefined && step.status !== null) {
        if (!(NPH_STEPPER_STATUSES as readonly string[]).includes(step.status)) {
          return `status "${String(step.status)}" of ${where} does not exist. Use ${NPH_STEPPER_STATUSES.map((value) => `"${value}"`).join(', ')}.`;
        }
        if (index + 1 === current) {
          return `${where} is the current step and takes no \`status\`: \`current\` says where the person is.`;
        }
      }
      if (step.disabled === true && index + 1 === current) {
        return `${where} is the current step and cannot be disabled: a blocked step cannot be where the person is.`;
      }
      const href = text(step.href);
      if (href !== '' && !isSafeHref(href)) {
        return `${where} has an unsafe \`href\`. A link takes ${NPH_STEPPER_LINK_PROTOCOLS.join(', ')} or a relative address.`;
      }
    }
    return null;
  }

  /* ----- what a step is ---------------------------------------------------- */

  /** The status of a step: the current one, the one it was given, or the one its position says. */
  private statusOf(index: number): Look {
    const position = index + 1;
    if (position === this.current) return 'current';
    const given = (this.steps[index] as NphStep).status;
    if (given !== undefined && given !== null) return given;
    return position < this.current ? 'completed' : 'pending';
  }

  private disabledOf(index: number): boolean {
    return (this.steps[index] as NphStep).disabled === true;
  }

  /** What the step looks like: a disabled step with an error goes back to the pending look (rule T11). */
  private lookOf(index: number): Look {
    const status = this.statusOf(index);
    return status === 'error' && this.disabledOf(index) ? 'pending' : status;
  }

  /** Whether the step can be activated. The current step and a disabled one never can. */
  private clickable(index: number): boolean {
    if (this.disabledOf(index)) return false;
    const status = this.statusOf(index);
    return status === 'completed' || status === 'error' || (status === 'pending' && this.nonLinear);
  }

  /** The hidden text that opens the step, by what it looks like; the current step has none. */
  private statusText(look: Look): string {
    if (look === 'completed') return text(this.completedLabel);
    if (look === 'error') return text(this.errorLabel);
    if (look === 'pending') return text(this.pendingLabel);
    return '';
  }

  /** The name of the landmark: the label, else the host `aria-label`. `null` when there is none. */
  private name(): string | null {
    const label = text(this.label);
    if (label !== '') return label;
    const host = text(this.hostName);
    return host === '' ? null : host;
  }

  /** Whether the balloon of the step may open: the label is cut and the step can take focus. */
  private hasBalloon(index: number): boolean {
    return this.cutSteps.includes(index) && !this.disabledOf(index) && this.statusOf(index) !== 'current';
  }

  /** The text of the narrow width: "Step {current} of {count}", filled in. */
  private progressText(): string {
    const values: Record<string, string> = { current: String(this.current), count: String(this.steps.length) };
    return text(this.stepText).replace(MARKER, (marker, key: string) => values[key] ?? marker);
  }

  /* ----- life cycle -------------------------------------------------------- */

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
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.problem === null && !this.empty);
  }

  protected override updated(_changed: PropertyValues): void {
    if (this.problem === null && !this.empty) {
      this.warnMissingTexts();
    }
    /* An update while disconnected records nothing: the labels are observed again on reconnection. */
    if (this.resizeObserver === undefined) {
      return;
    }
    const targets = [...this.renderRoot.querySelectorAll('.label')];
    const same = targets.length === this.observed.length && targets.every((node, index) => node === this.observed[index]);
    if (!same) {
      this.resizeObserver.disconnect();
      for (const target of targets) {
        this.resizeObserver.observe(target);
      }
      this.observed = targets;
    }
    /* A new text in a label of the same size moves no observer: measure it here. */
    this.measure();
  }

  /** The texts the consumer owes: drawn without them, and said once, since they may arrive later. */
  private warnMissingTexts(): void {
    if (this.name() === null) {
      this.warnOnce('name', 'the stepper has no accessible name. Give it a `label` or an `aria-label`.');
    }
    const looks = this.steps.map((_, index) => this.lookOf(index));
    for (const [look, property] of [
      ['completed', 'completed-label'],
      ['pending', 'pending-label'],
      ['error', 'error-label'],
    ] as const) {
      if (looks.includes(look) && this.statusText(look) === '') {
        this.warnOnce(property, `a step is ${look} and has no hidden status text. Give the stepper \`${property}\`.`);
      }
    }
    if (this.steps.some((step) => step.optional === true) && text(this.optionalLabel) === '') {
      this.warnOnce('optional-label', 'a step is optional and the word "Optional" is missing. Give the stepper `optional-label`.');
    }
    if (text(this.stepText) === '') {
      this.warnOnce('step-text', 'the narrow width has no "Step N of M" text. Give the stepper `step-text`, with {current} and {count}.');
    }
  }

  private warnOnce(key: string, message: string): void {
    if (!this.warned.has(key)) {
      this.warned.add(key);
      devMessage('warn', message);
    }
  }

  /* ----- measuring --------------------------------------------------------- */

  /** The cut labels, measured on the screen: a label is cut when its text is wider than its box. */
  private measure(): void {
    if (this.problem !== null || this.empty) {
      return;
    }
    const cut: number[] = [];
    const labels = [...this.renderRoot.querySelectorAll<HTMLElement>('.label')];
    for (const label of labels) {
      const index = Number(label.dataset.index);
      /* The current label wraps and is never cut; the rest stay on one line. */
      if (this.statusOf(index) !== 'current' && label.scrollWidth > label.clientWidth) {
        cut.push(index);
      }
    }
    if (cut.length !== this.cutSteps.length || cut.some((value, position) => value !== this.cutSteps[position])) {
      this.cutSteps = cut;
    }
  }

  /* ----- events ------------------------------------------------------------ */

  /** A button step: the page learns where the person wants to go, and moves `current` itself. */
  private onSelect(index: number): void {
    this.dispatchEvent(
      new CustomEvent<NphStepSelectDetail>('nph-step-select', {
        detail: { step: index + 1 },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /* ----- rendering --------------------------------------------------------- */

  private renderMarker(look: Look, index: number): TemplateResult {
    const content =
      look === 'completed'
        ? html`<nph-icon class="marker-icon" name="check" variant="light" size="sm"></nph-icon>`
        : look === 'error'
          ? html`<nph-icon class="marker-icon" name="triangle-exclamation" variant="light" size="sm"></nph-icon>`
          : html`<span class="number">${String(index + 1)}</span>`;
    return html`<span class="marker" aria-hidden="true">${content}</span>`;
  }

  /** The inside of the step area: the marker and the text column. */
  private renderInside(index: number, look: Look): TemplateResult {
    const step = this.steps[index] as NphStep;
    const status = this.statusText(look);
    const description = text(step.description);
    const optional = step.optional === true ? text(this.optionalLabel) : '';
    return html`${this.renderMarker(look, index)}<span class="text"
        ><span class="heading"
          >${status === '' ? nothing : html`<span class="hidden">${status}, </span>`}<span class="label" data-index=${String(index)}
            >${text(step.label)}</span
          ></span
        >${description === '' ? nothing : html`<span class="description">${description}</span>`}${optional === ''
          ? nothing
          : html`<span class="optional">${optional}</span>`}</span
      >`;
  }

  /** The step area: a link, a button or text, by what the person can do with it. */
  private renderStep(index: number, look: Look): TemplateResult {
    const step = this.steps[index] as NphStep;
    const id = `step-${String(index)}`;
    if (this.statusOf(index) === 'current') {
      return html`<span class="step" id=${id} aria-current="step">${this.renderInside(index, look)}</span>`;
    }
    if (this.disabledOf(index)) {
      return html`<span class="step" id=${id} aria-disabled="true">${this.renderInside(index, look)}</span>`;
    }
    if (this.clickable(index)) {
      const href = text(step.href);
      return href === ''
        ? html`<button class="step" id=${id} type="button" @click=${() => this.onSelect(index)}>${this.renderInside(index, look)}</button>`
        : html`<a class="step" id=${id} href=${href}>${this.renderInside(index, look)}</a>`;
    }
    /* A pending step of the linear stepper: not a link. With its label cut it takes Tab only to open the
       balloon with the whole text. */
    return html`<span class="step" id=${id} tabindex=${this.hasBalloon(index) ? '0' : nothing}>${this.renderInside(index, look)}</span>`;
  }

  private renderItem(index: number): TemplateResult {
    const look = this.lookOf(index);
    const last = index === this.steps.length - 1;
    return html`<li class="item" data-status=${look} data-clickable=${this.clickable(index) ? 'true' : 'false'}>
      ${this.renderStep(index, look)}${last
        ? nothing
        : html`<span class="connector" data-complete=${index + 1 < this.current ? 'true' : 'false'} aria-hidden="true"></span>`}
    </li>`;
  }

  private renderNarrow(): TemplateResult {
    const label = text((this.steps[this.current - 1] as NphStep).label);
    return html`<nph-progress
      class="narrow"
      type="steps"
      steps=${String(this.steps.length)}
      step=${String(this.current)}
      label=${label}
      value-text=${this.progressText()}
    ></nph-progress>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (this.problem !== null || this.empty) {
      return nothing;
    }
    const name = this.name();
    return html`<nav class="wide" aria-label=${name === null ? nothing : name}>
        <ol class="list">
          ${this.steps.map((_, index) => this.renderItem(index))}
        </ol>
        ${this.steps.map((_, index) =>
          this.hasBalloon(index)
            ? html`<nph-tooltip for=${`step-${String(index)}`} .text=${text((this.steps[index] as NphStep).label)}></nph-tooltip>`
            : nothing,
        )}
      </nav>
      ${this.renderNarrow()}`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphStepper);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-stepper': NphStepper;
  }
  interface HTMLElementEventMap {
    'nph-step-select': CustomEvent<NphStepSelectDetail>;
  }
}
