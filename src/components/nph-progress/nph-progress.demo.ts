/**
 * Demonstration frame shared by the `nph-progress` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the widths, the gaps, the frame border — is NOT a precedent for component CSS: the
 * piece itself takes its measures from the `progress/*` tokens, and the width comes from the
 * container.
 *
 * Each example is one of the three required by the accepted documentation (frame `4385:3186`): an
 * upload in progress, a preparing with no percentage and a sign-up in steps. Every visible text
 * comes from the dictionary, passed in by the page.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-progress';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `progressValidation` dictionary. */
export interface ExampleTexts {
  uploadLabel: string;
  uploadValue: string;
  uploadHelp: string;
  preparingLabel: string;
  preparingValue: string;
  preparingHelp: string;
  signUpLabel: string;
  signUpValue: string;
  signUpHelp: string;
}

const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** An upload in progress: label, value text and help text. */
export function upload(texts: ExampleTexts): TemplateResult {
  return html`<nph-progress
    value="50"
    label=${texts.uploadLabel}
    value-text=${texts.uploadValue}
    help=${texts.uploadHelp}
  ></nph-progress>`;
}

/** Preparing, with no percentage: indeterminate, with a state word. */
export function preparing(texts: ExampleTexts): TemplateResult {
  return html`<nph-progress
    type="indeterminate"
    label=${texts.preparingLabel}
    value-text=${texts.preparingValue}
    help=${texts.preparingHelp}
  ></nph-progress>`;
}

/** A sign-up in steps: the "N of M" and the current step in the help text. */
export function signUp(texts: ExampleTexts): TemplateResult {
  return html`<nph-progress
    type="steps"
    steps="4"
    step="1"
    label=${texts.signUpLabel}
    value-text=${texts.signUpValue}
    help=${texts.signUpHelp}
  ></nph-progress>`;
}

/** The three required examples, one under the other, in the frame of a scheme. */
export function examples(texts: ExampleTexts): TemplateResult {
  return html`<div style=${stack}>${upload(texts)} ${preparing(texts)} ${signUp(texts)}</div>`;
}
