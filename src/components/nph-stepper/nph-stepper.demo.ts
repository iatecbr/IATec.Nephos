/**
 * Demonstration frame shared by the `nph-stepper` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the framed figure, the card around a form, the widths that force the cut label and
 * the narrow stepper — is NOT a precedent for component CSS: the piece takes its measures from the
 * `stepper/*` tokens.
 *
 * The examples are the required ones of the accepted documentation (frame `5569:6530`): the sign-up in
 * four steps, on step 2; step 3 with an error and its reason; the linear stepper in three steps, on
 * step 2. Every visible text comes from the dictionary, passed in by the page that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-stepper';
import type { NphStep } from './nph-stepper';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `stepperValidation` dictionary. */
export interface ExampleTexts {
  navLabel: string;
  completedLabel: string;
  pendingLabel: string;
  errorLabel: string;
  optionalLabel: string;
  stepText: string;
  account: string;
  address: string;
  payment: string;
  review: string;
  accountSupport: string;
  addressSupport: string;
  paymentSupport: string;
  errorReason: string;
  longLabel: string;
  threeSteps: string[];
  fiveSteps: string[];
  formTitle: string;
  formText: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: 100%; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, one under the other. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

/** The four steps of the sign-up, with the content a step may turn on. */
export function signUpSteps(texts: ExampleTexts, { support = false }: { support?: boolean } = {}): NphStep[] {
  return [
    { label: texts.account, ...(support ? { description: texts.accountSupport } : {}) },
    { label: texts.address, ...(support ? { description: texts.addressSupport } : {}) },
    { label: texts.payment, ...(support ? { description: texts.paymentSupport } : {}) },
    { label: texts.review },
  ];
}

/**
 * The width of a stepper inside a matrix cell. A table cell sizes itself from its content, and the
 * stepper stretches to the width of where it lives and brings none of its own, so a cell needs one:
 * 40rem is above the 600 px below which the stepper becomes `nph-progress`.
 */
export const MATRIX_WIDTH = '40rem';

/** A width below the 600 px of the narrow stepper. */
export const NARROW_WIDTH = '20rem';

export interface StepperOptions {
  steps?: NphStep[];
  /** The position of the current step. */
  current?: number;
  nonLinear?: boolean;
  /** The width of the frame, to force the cut label or the narrow stepper. */
  width?: string;
}

/** A stepper with every text the page owes it, at the width asked for. */
export function stepper(texts: ExampleTexts, options: StepperOptions = {}): TemplateResult {
  const { steps = signUpSteps(texts), current = 2, nonLinear = false, width } = options;
  const tag = html`<nph-stepper
    .steps=${steps}
    current=${String(current)}
    ?non-linear=${nonLinear}
    label=${texts.navLabel}
    completed-label=${texts.completedLabel}
    pending-label=${texts.pendingLabel}
    error-label=${texts.errorLabel}
    optional-label=${texts.optionalLabel}
    step-text=${texts.stepText}
  ></nph-stepper>`;
  return html`<div style="inline-size: ${width ?? '100%'}; max-inline-size: 100%;">${tag}</div>`;
}

/** The steps with the reason of an error on the step before the current one. */
export function errorSteps(texts: ExampleTexts): NphStep[] {
  return [
    { label: texts.account },
    { label: texts.address, status: 'error', description: texts.errorReason },
    { label: texts.payment },
    { label: texts.review },
  ];
}

/** The content a step may turn on: the support line and the word "Optional". */
export function contentSteps(texts: ExampleTexts): NphStep[] {
  return [
    { label: texts.account, description: texts.accountSupport },
    { label: texts.address, description: texts.addressSupport, optional: true },
    { label: texts.payment, description: texts.paymentSupport },
    { label: texts.review, optional: true },
  ];
}

/** Disabled steps: a completed one, a pending one, and one with an error that goes back to pending. */
export function disabledSteps(texts: ExampleTexts, { reason = false }: { reason?: boolean } = {}): NphStep[] {
  return [
    { label: texts.account, disabled: true },
    { label: texts.address },
    { label: texts.payment, status: 'error', disabled: true, ...(reason ? { description: texts.errorReason } : {}) },
    { label: texts.review, disabled: true },
  ];
}

/** The steps of the non-linear example: five steps, the fifth one disabled. */
export function nonLinearSteps(texts: ExampleTexts): NphStep[] {
  return texts.fiveSteps.map((label, index) => ({ label, ...(index === 4 ? { disabled: true } : {}) }));
}

/** The steps whose labels do not fit the text column: the label is cut and the balloon holds it all. */
export function longSteps(texts: ExampleTexts): NphStep[] {
  return [
    { label: texts.longLabel },
    { label: texts.longLabel },
    { label: texts.longLabel },
    { label: texts.review },
  ];
}

/** The steps of the linear example in three steps. */
export function threeSteps(texts: ExampleTexts): NphStep[] {
  return texts.threeSteps.map((label) => ({ label }));
}

/** The first required example: the sign-up in four steps, on step 2. */
export function signUpExample(texts: ExampleTexts): TemplateResult {
  return stepper(texts, { steps: signUpSteps(texts), current: 2 });
}

/** The second required example: step 3, with the step before it carrying an error and its reason. */
export function errorExample(texts: ExampleTexts): TemplateResult {
  return stepper(texts, { steps: errorSteps(texts), current: 3 });
}

/** The third required example: the linear stepper in three steps, on step 2. */
export function linearExample(texts: ExampleTexts): TemplateResult {
  return stepper(texts, { steps: threeSteps(texts), current: 2 });
}

/** The stepper at the top of a form inside a card: the content of the current step comes right below. */
export function formExample(texts: ExampleTexts): TemplateResult {
  return html`<div
    style="display: flex; flex-direction: column; gap: var(--nph-space-section); padding: var(--nph-space-section); background: var(--nph-color-card); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control);"
  >
    ${stepper(texts, { steps: signUpSteps(texts), current: 2 })}
    <div style="display: flex; flex-direction: column; gap: var(--nph-space-inline);">
      <strong>${texts.formTitle}</strong>
      <span style="color: var(--nph-color-muted-foreground);">${texts.formText}</span>
    </div>
  </div>`;
}

/** The three required examples, one under the other, in the frame of a scheme. */
export function examples(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
    ${signUpExample(texts)} ${errorExample(texts)} ${linearExample(texts)}
  </div>`;
}
