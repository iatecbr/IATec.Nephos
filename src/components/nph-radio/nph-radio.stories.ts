/**
 * VALIDATION stories of `nph-radio`.
 *
 * They prove the contract accepted in Figma (frame `1196:311`, set `848:66`), the decisions
 * D1 to D5 of DSA-18 and P82: unchecked and checked in each state — default, error and
 * disabled — and with the text off; the text that wraps, with the circle on the first line;
 * the group by name, with the arrow keys and the native events; the form, which receives
 * only the checked value and returns to the initial one on reset; and the three required
 * examples of the frame — "Payment method", "Employment type" and "Work shift". Every story
 * shows the same content in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover and focus are interaction: they show up by moving the mouse over a radio and by
 * navigating with Tab and the arrow keys; the component test measures them. The group
 * wrapper of the frame stands in for `nph-field` (see `nph-radio.demo.ts`), and the
 * `nph-button` of the Form story is scenery that asks the form to submit and reset, not a
 * relation of the piece. Each page opens
 * with what it proves, from the dictionary (`validationPages.claims`). The example text and
 * the captions come from the language dictionary, under the key `radioValidation`
 * (`docs/i18n.md`, "Storybook"); the row and column names of the matrix are the technical
 * attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import '../nph-button/nph-button';
import './nph-radio';
import type { NphRadio } from './nph-radio';
import { employment, inScheme, payment, radio, radioGroup, shift } from './nph-radio.demo';
import type { Scheme } from './nph-radio.demo';

const meta: Meta = {
  title: 'Components/nph-radio/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).radioValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';
const narrow = 'inline-size: var(--nph-layout-field-width); max-inline-size: 100%;';

const page = (storyId: string) => ({
  piece: 'nph-radio',
  storyId: `components-nph-radio-validation--${storyId}`,
});

/** What a story draws in one mode; the scheme keeps the names of each mode apart, so the two copies are two groups. */
type ModeContent = (title: string, scheme: Scheme) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: ModeContent, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  const title = validationTitle(context, 'nph-radio', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`, scheme));
    })}
  </div>`;
}

/** Unchecked and checked in each state, and with the text off: the Figma properties `marcado`, `state` and `mostrar rótulo`. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    /* Each row is one group of two, so one radio is unchecked and the other checked. */
    const row = (scheme: Scheme, key: string, flags: { disabled?: boolean; invalid?: boolean }, withText = true) => {
      const name = `matrix-${key}-${scheme}`;
      const item = (value: string, text: string) => (withText ? { value, text, ...flags } : { value, label: text, ...flags });
      return [radio(name, item('a', v.card)), radio(name, item('b', v.pix), true)];
    };
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label, scheme) =>
        matrix(label, ['checked: false', 'checked: true'], [
          { label: 'state: default', cells: row(scheme, 'default', {}) },
          { label: 'state: invalid', cells: row(scheme, 'invalid', { invalid: true }) },
          { label: 'state: disabled', cells: row(scheme, 'disabled', { disabled: true }) },
          { label: 'text: no', cells: row(scheme, 'no-text', {}, false) },
        ]),
      ),
    );
  },
};

/** The text wraps to the available width; the circle stays at the top, with the first line (D4). */
export const TwoLines: Story = {
  name: 'Two lines',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('two-lines'),
      inBothModes(
        context,
        'two-lines',
        (_label, scheme) => html`<div style=${narrow}>
          ${radioGroup({
            title: v.wrapGroup,
            name: `two-lines-${scheme}`,
            checked: 'short',
            items: [
              { value: 'short', text: v.wrapShort },
              { value: 'long', text: v.wrapLong },
            ],
          })}
        </div>`,
      ),
    );
  },
};

/** The status text under a group: it is replaced by a listener, and re-rendered only when the language changes. */
function interactive(context: GlobalsContext | undefined, scheme: Scheme): TemplateResult {
  const v = t(context);
  const onChange = (event: Event): void => {
    const target = event.target as NphRadio;
    const status = (event.currentTarget as HTMLElement).querySelector('output');
    if (status) {
      status.textContent = format(v.statusChanged, { name: target.name, value: target.value });
    }
  };
  return html`<div style="${stack} align-items: flex-start;" @change=${onChange}>
    ${radioGroup({
      title: v.shiftGroup,
      name: `interactive-${scheme}`,
      checked: 'morning',
      items: [
        { value: 'morning', text: v.morning },
        { value: 'afternoon', text: v.afternoon, disabled: true },
        { value: 'night', text: v.night },
      ],
    })}
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </div>`;
}

/** The group by name: one Tab stop, the arrow keys move and check skipping a disabled radio, and the person checking it fires change. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('interactive'),
      inBothModes(context, 'interactive', (_label, scheme) => interactive(context, scheme)),
    ),
};

/** A form around the group: submitting shows the FormData, and reset returns to the initial check. */
function form(context: GlobalsContext | undefined, scheme: Scheme): TemplateResult {
  const v = t(context);
  const show = (element: HTMLFormElement): void => {
    const status = element.querySelector('output');
    if (status) {
      const entries = [...new FormData(element).entries()].map(([key, value]) => `${key}=${String(value)}`);
      status.textContent = format(v.formSent, { data: entries.join(' & ') || v.formEmpty });
    }
  };
  const onSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    show(event.currentTarget as HTMLFormElement);
  };
  /* `nph-button` is not a submit button (P68): the frame asks the form itself. */
  const formOf = (event: Event): HTMLFormElement => (event.currentTarget as HTMLElement).closest('form') as HTMLFormElement;
  const submit = (event: Event): void => formOf(event).requestSubmit();
  const reset = (event: Event): void => {
    const element = formOf(event);
    element.reset();
    show(element);
  };
  return html`<form style="${stack} align-items: flex-start;" @submit=${onSubmit}>
    ${payment(v, `payment-${scheme}`)}
    <div style="display: flex; gap: var(--nph-space-inline);">
      <nph-button text=${v.formSubmit} @click=${submit}></nph-button>
      <nph-button emphasis="outline" text=${v.formReset} @click=${reset}></nph-button>
    </div>
    <output aria-live="polite" style=${statusStyle} .textContent=${v.formIdle}></output>
  </form>`;
}

/** The form receives only the checked radio, under its name; reset returns to the checked attribute. */
export const Form: Story = {
  name: 'Form',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('form'), inBothModes(context, 'form', (_label, scheme) => form(context, scheme))),
};

/** The three required examples of the accepted frame, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, 'examples', (_label, scheme) => payment(v, `example-payment-${scheme}`), v.examplePayment)}
        ${inBothModes(context, 'examples', (_label, scheme) => employment(v, `example-employment-${scheme}`), v.exampleEmployment)}
        ${inBothModes(context, 'examples', (_label, scheme) => shift(v, `example-shift-${scheme}`), v.exampleShift)}
      </div>`,
    );
  },
};
