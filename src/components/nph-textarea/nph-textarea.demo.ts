/**
 * Demonstration frame shared by the `nph-textarea` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here — the framed figure and the counter the consumer computes —
 * is NOT a precedent for component CSS: the piece takes every measure from tokens.
 *
 * The three examples are the required ones of the accepted frame (`1632:24`): "Comment"
 * (the footer with counter and actions), "Description in a form" (the counter in the
 * support line of `nph-field`, footer off) and "Long text" (it scrolls inside, without
 * passing the maximum). The piece counts nothing (P93): the consumer writes the counter
 * text on each `input`, here with `format` and the limit of the example. The functions
 * take the visible text as arguments: this file holds none, because every visible text
 * comes from the language dictionary of the page that calls it.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-field/nph-field';
import './nph-textarea';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The counter text of a value: the consumer's job, with its own words and limit. */
export type CounterText = (length: number, limit: number) => string;

/**
 * Writes the counter on each `input`, on the element that owns it: the textarea itself
 * (footer) or the `nph-field` around it (support line).
 */
function counting(limit: number, counter: CounterText, owner: 'textarea' | 'field') {
  return (event: Event): void => {
    const textarea = event.currentTarget as HTMLElement & { value: string; counter: string };
    const target = owner === 'field' ? (textarea.closest('nph-field') as (HTMLElement & { counter: string }) | null) : textarea;
    if (target !== null) {
      target.counter = counter(textarea.value.length, limit);
    }
  };
}

export interface CommentText {
  /** The accessible name: a comment box has no visible label. */
  label: string;
  placeholder: string;
  attachText: string;
  sendText: string;
  counter: CounterText;
  limit: number;
  value?: string;
  disabled?: boolean;
}

/** Comment: the footer with the counter at the start and the actions at the end. */
export function comment(text: CommentText): TemplateResult {
  const value = text.value ?? '';
  return html`<nph-textarea
    label=${text.label}
    placeholder=${text.placeholder}
    value=${value}
    counter=${text.counter(value.length, text.limit)}
    ?disabled=${text.disabled ?? false}
    @input=${counting(text.limit, text.counter, 'textarea')}
  >
    <nph-button slot="actions" emphasis="ghost" text=${text.attachText}></nph-button>
    <nph-button slot="actions" text=${text.sendText}></nph-button>
  </nph-textarea>`;
}

export interface FormFieldText {
  label: string;
  help: string;
  placeholder: string;
  counter: CounterText;
  limit: number;
  value?: string;
  required?: boolean;
  /** The error message of `nph-field`, such as an exceeded limit; the piece goes to `erro`. */
  error?: string;
  /** The name of the entry in the form data. */
  name?: string;
}

/** Description in a form: the label, the help and the counter of `nph-field`; footer off. */
export function inForm(text: FormFieldText): TemplateResult {
  const value = text.value ?? '';
  return html`<nph-field
    label=${text.label}
    help=${text.help}
    error=${text.error ?? nothing}
    counter=${text.counter(value.length, text.limit)}
    ?required=${text.required ?? false}
    ><nph-textarea
      name=${text.name ?? nothing}
      placeholder=${text.placeholder}
      value=${value}
      @input=${counting(text.limit, text.counter, 'field')}
    ></nph-textarea
  ></nph-field>`;
}

export interface LongText {
  label: string;
  /** A text longer than `layout/textarea-max-height`, so the area scrolls. */
  value: string;
  readOnly?: boolean;
}

/** Long text: the area stops at `layout/textarea-max-height` and the text scrolls inside. */
export function longText(text: LongText): TemplateResult {
  return html`<nph-textarea label=${text.label} value=${text.value} ?readonly=${text.readOnly ?? false}></nph-textarea>`;
}
