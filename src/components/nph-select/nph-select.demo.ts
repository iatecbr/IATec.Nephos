/**
 * Demonstration frame shared by the `nph-select` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does
 * not index it. The scenery here — the gaps, the framed figure, the room below an
 * open list — is NOT a precedent for component CSS: the piece takes every measure
 * from tokens.
 *
 * The three examples are the required ones of the accepted frame (`1357:160`):
 * "Department" (a short list, no start), "Owner" (people with avatar, open) and
 * "Required with no choice" (the error). Each sits in an `nph-field`, which gives
 * the label, the help text and the error message. The functions take the visible
 * text as arguments: this file holds none, because every visible text comes from
 * the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-field/nph-field';
import '../nph-option/nph-option';
import './nph-select';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that resolves
 * the tokens (P67). A story is never duplicated per mode. `room` keeps space below
 * an open list, so it does not cover the next figure.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult, room = false): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box; ${room
      ? 'padding-block-end: calc(var(--nph-layout-max-list-height) + var(--nph-space-section));'
      : ''}"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult, room = false): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', captions.light],
    ['dark', captions.dark],
  ];
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content(), room))}
  </div>`;
}

export interface Choice {
  value: string;
  label: string;
  /** Helper text after the label. */
  secondary?: string;
  /** The photo of a person, with `start="avatar"`. */
  src?: string;
}

export interface DepartmentText {
  label: string;
  help: string;
  placeholder: string;
  options: readonly Choice[];
  value?: string;
  name?: string;
}

/** Department: a short list, no start, in a field with a label and help text. */
export function department(text: DepartmentText): TemplateResult {
  return html`<nph-field label=${text.label} help=${text.help}>
    <nph-select placeholder=${text.placeholder} name=${text.name ?? 'department'} value=${text.value ?? ''}>
      ${text.options.map((choice) => html`<nph-option value=${choice.value}>${choice.label}</nph-option>`)}
    </nph-select>
  </nph-field>`;
}

export interface OwnerText {
  label: string;
  placeholder: string;
  options: readonly Choice[];
  value?: string;
  open?: boolean;
}

/** Owner: people with avatar, the chosen one repeated in the trigger; open on the page that shows it. */
export function owner(text: OwnerText): TemplateResult {
  return html`<nph-field label=${text.label}>
    <nph-select placeholder=${text.placeholder} start="avatar" name="owner" value=${text.value ?? ''} ?open=${text.open ?? false}>
      ${text.options.map(
        (choice) =>
          html`<nph-option value=${choice.value} start="avatar" src=${choice.src ?? ''} secondary=${choice.secondary ?? ''}
            >${choice.label}</nph-option
          >`,
      )}
    </nph-select>
  </nph-field>`;
}

export interface RequiredText {
  label: string;
  placeholder: string;
  error: string;
  options: readonly Choice[];
}

/** Required with no choice: the field in error, with the message the consumer wrote. */
export function requiredWithNoChoice(text: RequiredText): TemplateResult {
  return html`<nph-field label=${text.label} required error=${text.error}>
    <nph-select placeholder=${text.placeholder} name="department">
      ${text.options.map((choice) => html`<nph-option value=${choice.value}>${choice.label}</nph-option>`)}
    </nph-select>
  </nph-field>`;
}
