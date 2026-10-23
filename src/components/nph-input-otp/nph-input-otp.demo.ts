/**
 * Demonstration frame shared by the `nph-input-otp` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does
 * not index it. The scenery here — the framed figure — is NOT a precedent for
 * component CSS: the field takes every measure and color from its own tokens.
 *
 * The functions take the visible text and the codes as arguments: this file holds
 * none, because every visible text comes from the language dictionary of the page
 * that calls it. Two required examples sit inside the real `nph-field` (DSA-28, P83),
 * which writes the name, the description and the error state on the field.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-field/nph-field';
import './nph-input-otp';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that
 * resolves the tokens (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

export interface FieldOptions {
  /** The accessible name: in a product, the `nph-field` writes it. */
  label: string;
  value?: string;
  length?: 4 | 6;
  size?: 'default' | 'large';
  invalid?: boolean;
  disabled?: boolean;
  masked?: boolean;
}

/** One field. The tag and the attributes are the contract; the text comes in. */
export function field(options: FieldOptions): TemplateResult {
  const { label, value = '', length = 6, size = 'default', invalid = false, disabled = false, masked = false } = options;
  return html`<nph-input-otp
    label=${label}
    value=${value}
    length=${length}
    size=${size}
    ?invalid=${invalid}
    ?disabled=${disabled}
    ?masked=${masked}
  ></nph-input-otp>`;
}

export interface InFieldOptions {
  /** The label of the `nph-field`: it is also the name of the code field. */
  label: string;
  help?: string;
  error?: string;
  value?: string;
}

/** The code field inside the `nph-field`, which writes `label`, `description` and `invalid` on it. */
export function inField(options: InFieldOptions): TemplateResult {
  const { label, help = '', error = '', value = '' } = options;
  return html`<nph-field label=${label} help=${help} error=${error}>
    <nph-input-otp value=${value}></nph-input-otp>
  </nph-field>`;
}
