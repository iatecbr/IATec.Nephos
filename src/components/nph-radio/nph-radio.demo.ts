/**
 * Demonstration frame shared by the `nph-radio` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here is NOT a precedent for component CSS. In particular, the
 * group wrapper — a `<div role="radiogroup">` named by the group title, with the options
 * stacked by `space/stack-tight` — stands in for `nph-field`, which names the group, says
 * it is required and carries the error message (P83). The radio itself owns only the
 * exclusivity, the arrow keys and its own Tab stop.
 *
 * The three examples are the required ones of the accepted frame (`1196:311`): "Payment
 * method" (three options, one checked), "Employment type" (an exclusive choice) and "Work
 * shift" (a small group, all visible). The functions take the visible text as arguments:
 * this file holds none, because every visible text comes from the language dictionary of
 * the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-radio';

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

export interface RadioItem {
  value: string;
  /** The visible text. Without it, the radio is the circle alone and needs `label`. */
  text?: string;
  /** The accessible name of a radio without text. */
  label?: string;
  disabled?: boolean;
  invalid?: boolean;
}

export interface GroupOptions {
  /** The name of the group, the subject: "Payment method". */
  title: string;
  /** The `name` the radios share: the group and the key in the form. */
  name: string;
  /** The value of the checked radio, if any. */
  checked?: string;
  items: readonly RadioItem[];
}

/** One radio. The tags and attributes are the contract; the text comes in. */
export function radio(name: string, item: RadioItem, checked = false): TemplateResult {
  return html`<nph-radio
    name=${name}
    value=${item.value}
    text=${item.text ?? ''}
    label=${item.label ?? ''}
    ?checked=${checked}
    ?disabled=${item.disabled ?? false}
    ?invalid=${item.invalid ?? false}
  ></nph-radio>`;
}

/** A group: the stand-in for `nph-field` around the radios that share a name. */
export function radioGroup(options: GroupOptions): TemplateResult {
  const { title, name, checked, items } = options;
  return html`<div role="radiogroup" aria-label=${title} style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
    <span style="font: var(--nph-text-label-md-font-weight) var(--nph-text-label-md-font-size) / var(--nph-text-label-md-line-height) var(--nph-text-label-md-font-family);" aria-hidden="true">${title}</span>
    ${items.map((item) => radio(name, item, item.value === checked))}
  </div>`;
}

export interface PaymentText {
  paymentGroup: string;
  card: string;
  pix: string;
  bankSlip: string;
}

/** Payment method: three options, one checked. */
export function payment(d: PaymentText, name: string, checked = 'card'): TemplateResult {
  return radioGroup({
    title: d.paymentGroup,
    name,
    checked,
    items: [
      { value: 'card', text: d.card },
      { value: 'pix', text: d.pix },
      { value: 'bank-slip', text: d.bankSlip },
    ],
  });
}

export interface EmploymentText {
  employmentGroup: string;
  employee: string;
  contractor: string;
  intern: string;
}

/** Employment type: an exclusive choice, with no default. */
export function employment(d: EmploymentText, name: string, checked?: string): TemplateResult {
  return radioGroup({
    title: d.employmentGroup,
    name,
    ...(checked === undefined ? {} : { checked }),
    items: [
      { value: 'employee', text: d.employee },
      { value: 'contractor', text: d.contractor },
      { value: 'intern', text: d.intern },
    ],
  });
}

export interface ShiftText {
  shiftGroup: string;
  morning: string;
  afternoon: string;
  night: string;
}

/** Work shift: a small group, all visible. */
export function shift(d: ShiftText, name: string, checked = 'morning'): TemplateResult {
  return radioGroup({
    title: d.shiftGroup,
    name,
    checked,
    items: [
      { value: 'morning', text: d.morning },
      { value: 'afternoon', text: d.afternoon },
      { value: 'night', text: d.night },
    ],
  });
}
