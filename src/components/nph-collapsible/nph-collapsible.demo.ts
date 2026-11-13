/**
 * Demonstration frame shared by the `nph-collapsible` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the framed figure, the width of a cell, the stack of pieces — is NOT a precedent for
 * component CSS: the piece takes its measures from the `collapsible/*` tokens.
 *
 * The examples are the required ones of the accepted documentation (frame `6014:1688`): the advanced
 * settings of a form, open; the steps of a sign-up form, flush, with the indicator at the start; the log of
 * an import in the preview type, closed. Every visible text comes from the dictionary, passed in by the
 * page that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import './nph-collapsible';
import type { NphCollapsibleAppearance, NphCollapsibleIndicator, NphCollapsibleSize, NphCollapsibleType } from './nph-collapsible';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `collapsibleValidation` dictionary. */
export interface ExampleTexts {
  title: string;
  support: string;
  body: string;
  bodyTwo: string;
  longTitle: string;
  longSupport: string;
  detailsLabel: string;
  detailsBody: string;
  showMore: string;
  showLess: string;
  logHeading: string;
  logText: string;
  advancedTitle: string;
  advancedSupport: string;
  advancedBody: string;
  saveLabel: string;
  stepAccount: string;
  stepAccountSupport: string;
  stepAccountBody: string;
  stepAddress: string;
  stepAddressSupport: string;
  stepAddressBody: string;
  stepPayment: string;
  stepPaymentSupport: string;
  stepPaymentBody: string;
  stackOne: string;
  stackTwo: string;
  stackThree: string;
  fieldLabel: string;
  lightCaption: string;
  darkCaption: string;
  eventOpen: string;
  eventClosed: string;
}

/** The width of a collapsible inside a matrix cell: a cell sizes itself from its content and the piece brings no width. */
export const MATRIX_WIDTH = '28rem';

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

export interface CollapsibleOptions {
  type?: NphCollapsibleType;
  appearance?: NphCollapsibleAppearance;
  indicator?: NphCollapsibleIndicator;
  size?: NphCollapsibleSize;
  open?: boolean;
  disabled?: boolean;
  /** The title; the text of the button in the `button` type; the closed text in `preview`. */
  label?: string;
  openLabel?: string;
  description?: string;
  icon?: string;
  /** What goes in the content slot. */
  content?: TemplateResult;
  /** The width of the frame, to force the wrap of a long title. */
  width?: string;
}

/** A collapsible with every text the page owes it, at the width asked for. */
export function collapsible(texts: ExampleTexts, options: CollapsibleOptions = {}): TemplateResult {
  const {
    type = 'line',
    appearance = 'flush',
    indicator = 'end',
    size = 'default',
    open = false,
    disabled = false,
    label = type === 'button' ? texts.detailsLabel : type === 'preview' ? texts.showMore : texts.title,
    openLabel = type === 'preview' ? texts.showLess : '',
    description = '',
    icon = '',
    content = type === 'button' ? html`<p style="margin: 0;">${texts.detailsBody}</p>` : html`<p style="margin: 0;">${texts.body}</p>`,
    width = MATRIX_WIDTH,
  } = options;
  return html`<div style="inline-size: ${width}; max-inline-size: 100%;">
    <nph-collapsible
      type=${type}
      appearance=${appearance}
      indicator=${indicator}
      size=${size}
      label=${label}
      open-label=${openLabel}
      description=${description}
      icon=${icon}
      ?open=${open}
      ?disabled=${disabled}
      >${content}</nph-collapsible
    >
  </div>`;
}

/** The long text of the preview type: three paragraphs, so the cut at three lines has something to cut. */
export function logContent(texts: ExampleTexts): TemplateResult {
  return html`<p style="margin: 0;">${texts.logText}</p>`;
}

/** The first required example: the advanced settings of a form, open. */
export function advancedExample(texts: ExampleTexts): TemplateResult {
  return html`<div style="inline-size: ${MATRIX_WIDTH}; max-inline-size: 100%;">
    <nph-collapsible label=${texts.advancedTitle} description=${texts.advancedSupport} icon="gear" open>
      <p style="margin: 0;">${texts.advancedBody}</p>
      <div><nph-button text=${texts.saveLabel}></nph-button></div>
    </nph-collapsible>
  </div>`;
}

/** The second required example: the steps of a sign-up form, flush, with the indicator at the start. */
export function stepsExample(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack); inline-size: ${MATRIX_WIDTH}; max-inline-size: 100%;">
    <nph-collapsible label=${texts.stepAccount} description=${texts.stepAccountSupport} indicator="start">
      <p style="margin: 0;">${texts.stepAccountBody}</p>
    </nph-collapsible>
    <nph-collapsible label=${texts.stepAddress} description=${texts.stepAddressSupport} indicator="start" open>
      <p style="margin: 0;">${texts.stepAddressBody}</p>
    </nph-collapsible>
    <nph-collapsible label=${texts.stepPayment} description=${texts.stepPaymentSupport} indicator="start">
      <p style="margin: 0;">${texts.stepPaymentBody}</p>
    </nph-collapsible>
  </div>`;
}

/** The third required example: the log of an import, in the preview type, closed. */
export function logExample(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline); inline-size: ${MATRIX_WIDTH}; max-inline-size: 100%;">
    <strong>${texts.logHeading}</strong>
    <nph-collapsible type="preview" label=${texts.showMore} open-label=${texts.showLess}>${logContent(texts)}</nph-collapsible>
  </div>`;
}

/** The three required examples, one under the other, in the frame of a scheme. */
export function examples(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
    ${advancedExample(texts)} ${stepsExample(texts)} ${logExample(texts)}
  </div>`;
}

/** Several pieces one under the other, at `space/stack`, with no divider: space already separates them. */
export function stack(texts: ExampleTexts, appearance: NphCollapsibleAppearance = 'flush'): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack); inline-size: ${MATRIX_WIDTH}; max-inline-size: 100%;">
    <nph-collapsible label=${texts.stackOne} appearance=${appearance} open><p style="margin: 0;">${texts.body}</p></nph-collapsible>
    <nph-collapsible label=${texts.stackTwo} appearance=${appearance}><p style="margin: 0;">${texts.bodyTwo}</p></nph-collapsible>
    <nph-collapsible label=${texts.stackThree} appearance=${appearance}><p style="margin: 0;">${texts.body}</p></nph-collapsible>
  </div>`;
}

/** The piece that fires an event, with a line under it that says what the page heard: the interactive example. */
export function interactive(texts: ExampleTexts): TemplateResult {
  const listen = (event: Event): void => {
    const piece = event.currentTarget as HTMLElement;
    const line = piece.parentElement?.querySelector('output');
    const open = (event as CustomEvent<{ open: boolean }>).detail.open;
    if (line) line.textContent = open ? texts.eventOpen : texts.eventClosed;
  };
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline); inline-size: ${MATRIX_WIDTH}; max-inline-size: 100%;">
    <nph-collapsible label=${texts.title} description=${texts.support} @nph-toggle=${listen}>
      <p style="margin: 0;">${texts.body}</p>
    </nph-collapsible>
    <output style="color: var(--nph-color-muted-foreground);" aria-live="polite"></output>
  </div>`;
}

/**
 * Accessibility exception (P72, `docs/stories.md` §2.3), as in `nph-dropdown-menu` and `nph-context-menu`: the
 * gate leaves out the axe rule `label-content-name-mismatch` in the stories that show a description. Reason: the
 * name of the trigger is its title (`aria-labelledby`) and the description is its accessible description
 * (`aria-describedby`, P121); axe compares the name with the whole visible text of the button and cannot tell the
 * two apart. Understanding WCAG 2.5.3 counts such text as supplementary, not part of the label. Alternative
 * discarded: putting the description in the name, which would make every trigger read its support line as its
 * name, against the accepted contract. The same decision Elvys took for those two pieces; the extension to this
 * piece (DSA-78) is for him to confirm in the pull request.
 */
export const DESCRIPTION_EXCEPTION = {
  a11y: { options: { rules: { 'label-content-name-mismatch': { enabled: false } } } },
};

/**
 * Accessibility exception (P72, `docs/stories.md` §2.3), for the stories that show a disabled piece that is open:
 * the gate leaves out `label-content-name-mismatch` (above) and the axe rule `color-contrast`. Reason: the accepted
 * contract keeps the content in view, faded under `state/disabled-opacity`, and axe measures the faded text of the
 * content like any text, where WCAG 1.4.3 exempts the text of an inactive component. Alternative discarded: leaving
 * the content out of the disabled demonstrations, which would hide the combined state (rule T11) the contract
 * asks to show. It leaves when the gate can tell an inactive component. Proposed here; for Elvys to confirm in the
 * pull request.
 */
export const DISABLED_CONTENT_EXCEPTION = {
  a11y: { options: { rules: { 'label-content-name-mismatch': { enabled: false }, 'color-contrast': { enabled: false } } } },
};
