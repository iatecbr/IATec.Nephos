/**
 * Demonstration frame shared by the `nph-field` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here — the framed figure and the stand-in options — is NOT a
 * precedent for component CSS.
 *
 * The control of a single field is the real `nph-input` (DSA-16, P80). STAND-IN OPTIONS:
 * `nph-checkbox` (DSA-17) and `nph-radio` (DSA-18) are not on the base yet. Until they are,
 * the groups show two demonstration elements that take the field–control contract of P83
 * and nothing else: `demo-field-checkbox` and `demo-field-radio`. They are scenery: they
 * are not exported by the package, carry no rule of their own and are swapped for the real
 * pieces as each one is merged (follow-up recorded in the task).
 *
 * The functions take the visible text as arguments: this file holds none, because every
 * visible text comes from the language dictionary of the page that calls it.
 */
import { LitElement, css, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-input/nph-input';
import './nph-field';
import type { NphFieldRole } from './nph-field';

export type Scheme = 'light' | 'dark';

/** Stand-in for an option of a group: a native checkbox or radio with its own text. */
class DemoFieldOption extends LitElement {
  static nphFieldRole: NphFieldRole = 'option';
  static type: 'checkbox' | 'radio' = 'checkbox';

  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    text: { type: String },
    checked: { type: Boolean },
    invalid: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static override styles = css`
    :host {
      display: block;
    }
    :host([disabled]) {
      opacity: var(--nph-state-disabled-opacity);
    }
    label {
      display: flex;
      align-items: flex-start;
      gap: var(--nph-space-inline);
      font-family: var(--nph-text-body-md-font-family);
      font-size: var(--nph-text-body-md-font-size);
      line-height: var(--nph-text-body-md-line-height);
      color: var(--nph-color-foreground);
    }
    input {
      margin: 0;
      inline-size: var(--nph-icon-size-sm);
      block-size: var(--nph-icon-size-sm);
      accent-color: var(--nph-color-primary);
    }
    :host([invalid]) input {
      outline: var(--nph-border-width) solid var(--nph-status-error);
    }
  `;

  declare text: string;
  declare checked: boolean;
  declare invalid: boolean;
  declare disabled: boolean;

  constructor() {
    super();
    this.text = '';
    this.checked = false;
    this.invalid = false;
    this.disabled = false;
  }

  private onChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    const type = (this.constructor as typeof DemoFieldOption).type;
    if (type === 'radio' && this.checked) {
      for (const sibling of this.parentElement?.children ?? []) {
        if (sibling !== this && sibling.localName === this.localName) {
          (sibling as DemoFieldOption).checked = false;
        }
      }
    }
  }

  protected override render(): TemplateResult {
    const type = (this.constructor as typeof DemoFieldOption).type;
    return html`<label
      ><input
        type=${type}
        .checked=${this.checked}
        ?disabled=${this.disabled}
        aria-invalid=${type === 'checkbox' && this.invalid && !this.disabled ? 'true' : nothing}
        @change=${this.onChange}
      />${this.text}</label
    >`;
  }
}

class DemoFieldRadio extends DemoFieldOption {
  static override nphFieldRole: NphFieldRole = 'radio';
  static override type: 'checkbox' | 'radio' = 'radio';
}

for (const [name, definition] of [
  ['demo-field-checkbox', DemoFieldOption],
  ['demo-field-radio', DemoFieldRadio],
] as const) {
  if (customElements.get(name) === undefined) {
    customElements.define(name, definition);
  }
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

export interface FieldOptions {
  label: string;
  required?: boolean;
  info?: string;
  infoLabel?: string;
  help?: string;
  error?: string;
  counter?: string;
  disabled?: boolean;
  /** The value already typed in the `nph-input`. */
  value?: string;
  placeholder?: string;
  /** An inline style for the field, such as a width the consumer gives it. */
  style?: string;
}

/** A field with an `nph-input` as its control. */
export function field(options: FieldOptions): TemplateResult {
  return html`<nph-field
    label=${options.label}
    ?required=${options.required ?? false}
    info=${options.info ?? nothing}
    info-label=${options.infoLabel ?? nothing}
    help=${options.help ?? nothing}
    error=${options.error ?? nothing}
    counter=${options.counter ?? nothing}
    ?disabled=${options.disabled ?? false}
    style=${options.style ?? nothing}
    ><nph-input value=${options.value ?? nothing} placeholder=${options.placeholder ?? nothing}></nph-input
  ></nph-field>`;
}

export interface GroupOptions extends FieldOptions {
  kind: 'checkbox' | 'radio';
  /** The visible text of each option. */
  options: readonly string[];
  /** The positions of the checked options. */
  checked?: readonly number[];
}

/** A field naming a group of stand-in checkboxes or radios, stacked (D7). */
export function group(options: GroupOptions): TemplateResult {
  const option = (text: string, position: number) =>
    options.kind === 'radio'
      ? html`<demo-field-radio text=${text} .checked=${options.checked?.includes(position) ?? false}></demo-field-radio>`
      : html`<demo-field-checkbox text=${text} .checked=${options.checked?.includes(position) ?? false}></demo-field-checkbox>`;
  return html`<nph-field
    label=${options.label}
    ?required=${options.required ?? false}
    help=${options.help ?? nothing}
    error=${options.error ?? nothing}
    ?disabled=${options.disabled ?? false}
    >${options.options.map(option)}</nph-field
  >`;
}
