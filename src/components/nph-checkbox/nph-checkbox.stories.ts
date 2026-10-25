/**
 * VALIDATION stories of `nph-checkbox`.
 *
 * They prove the contract accepted in Figma (frame `1194:1033`, set `740:18776`), the
 * decisions D1 to D6 of DSA-17 and P81: the Figma `marcado` (unchecked, checked,
 * indeterminate) against the states at rest (default, invalid, disabled), with and without
 * text; text that wraps, with the box at the top (D5); the box alone, named by `label`; the
 * error sentence outside the piece; disabled, also by a disabled fieldset; form
 * participation; the native `input` and `change` events; and the three required examples of
 * the frame — "Consent", "Preferences" and "Group selection". Every story shows the same
 * pieces in light and in dark mode, in the same story, through `data-nph-color-scheme` on
 * the frame (P20, P67).
 *
 * Hover and focus show up by moving the mouse over a piece and by navigating with Tab; the
 * component test measures them. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`). The example text and the captions come from the language
 * dictionary, under the key `checkboxValidation` (`docs/i18n.md`, "Storybook"); the row and
 * column names of the matrices are the technical attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import '../nph-button/nph-button';
import './nph-checkbox';
import type { NphCheckbox } from './nph-checkbox';
import { checkbox, consent, groupSelection, inScheme, preferences, stack, withError } from './nph-checkbox.demo';
import type { CheckboxOptions, Scheme } from './nph-checkbox.demo';

const meta: Meta = {
  title: 'Components/nph-checkbox/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).checkboxValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const outer = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';
const narrow = 'inline-size: var(--nph-layout-field-width); max-inline-size: 100%;';

const page = (storyId: string) => ({
  piece: 'nph-checkbox',
  storyId: `components-nph-checkbox-validation--${storyId}`,
});

/** What a story draws in one mode; the caption names the mode and, when given, the example. */
type ModeContent = (title: string) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: ModeContent, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  const title = validationTitle(context, 'nph-checkbox', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

const MARKED: ReadonlyArray<readonly [string, CheckboxOptions]> = [
  ['checked: false', {}],
  ['checked: true', { checked: true }],
  ['indeterminate', { indeterminate: true }],
];

const STATES: ReadonlyArray<readonly [string, CheckboxOptions]> = [
  ['default', {}],
  ['invalid', { invalid: true }],
  ['disabled', { disabled: true }],
];

/** The Figma `marcado` against the states at rest, with text and as the box alone. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const grid = (label: string, own: CheckboxOptions): TemplateResult =>
      matrix(
        label,
        STATES.map(([name]) => name),
        MARKED.map(([row, marked]) => ({
          label: row,
          cells: STATES.map(([, state]) => checkbox({ ...own, ...marked, ...state })),
        })),
      );
    return validationPage(
      context,
      page('matrix'),
      inBothModes(
        context,
        'matrix',
        (label) => html`<div style=${outer}>
          ${grid(`${label} · text`, { text: v.rememberMe })} ${grid(`${label} · box alone`, { label: v.selectRow })}
        </div>`,
      ),
    );
  },
};

/** Text that wraps: the box sits at the top, centered on the first line, and space/inline separates it from the text (D5). */
export const TextWrap: Story = {
  name: 'Text wrap',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('text-wrap'),
      inBothModes(
        context,
        'text-wrap',
        () => html`<div style="${stack} ${narrow}">
          ${checkbox({ text: v.longText })} ${checkbox({ text: v.longText, checked: true })}
        </div>`,
      ),
    );
  },
};

/** The box alone: 24 x 24, named by label, for a context that already gives the name, such as a table cell. */
export const BoxAlone: Story = {
  name: 'Box alone',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('box-alone'),
      inBothModes(
        context,
        'box-alone',
        () => html`<div style="display: flex; gap: var(--nph-space-inline);">
          ${checkbox({ label: v.selectRow })} ${checkbox({ label: v.selectRow, checked: true })}
          ${checkbox({ label: v.selectAll, indeterminate: true })}
        </div>`,
      ),
    );
  },
};

/** Invalid: the error border on the box, checked or not; the error sentence stays outside the piece. */
export const Invalid: Story = {
  name: 'Invalid',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('invalid'),
      inBothModes(context, 'invalid', () =>
        withError(html`${checkbox({ text: v.consent, invalid: true })}`, v.errorSentence),
      ),
    );
  },
};

/** Disabled: the whole piece at state/disabled-opacity, by its own attribute or by a disabled fieldset; disabled wins over invalid. */
export const Disabled: Story = {
  name: 'Disabled',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('disabled'),
      inBothModes(
        context,
        'disabled',
        () => html`<div style=${stack}>
          ${checkbox({ text: v.rememberMe, disabled: true })} ${checkbox({ text: v.rememberMe, disabled: true, checked: true })}
          ${checkbox({ text: v.rememberMe, disabled: true, invalid: true })}
          <fieldset disabled style="margin: 0; padding: 0; border: 0; min-inline-size: 0;">
            ${checkbox({ text: v.inFieldset, checked: true })}
          </fieldset>
        </div>`,
      ),
    );
  },
};

/** The form data of a form, written in its status line. */
function formStatus(form: HTMLFormElement, v: ReturnType<typeof t>): void {
  const status = form.querySelector('output');
  if (status === null) return;
  const entries = [...new FormData(form).entries()].map(([name, value]) => `${name}=${String(value)}`);
  status.textContent = format(v.formData, { data: entries.join(' ') || v.statusNone });
}

/** A form with its boxes, its status line and a reset button. */
function formDemo(context: GlobalsContext | undefined): TemplateResult {
  const v = t(context);
  const onChange = (event: Event): void => formStatus(event.currentTarget as HTMLFormElement, v);
  const onReset = (event: Event): void => {
    const form = (event.currentTarget as HTMLElement).closest('form') as HTMLFormElement;
    form.reset();
    formStatus(form, v);
  };
  return html`<form style=${stack} @change=${onChange}>
    ${checkbox({ text: v.consent, name: 'consent', value: 'yes', checked: true })}
    ${checkbox({ text: v.email, name: 'channel', value: 'email' })} ${checkbox({ text: v.sms, name: 'channel', value: 'sms' })}
    <output aria-live="polite" style=${statusStyle} .textContent=${format(v.formData, { data: 'consent=yes' })}></output>
    <nph-button severity="secondary" emphasis="outline" text=${v.reset} @click=${onReset}></nph-button>
  </form>`;
}

/** Form participation: a checked box submits name=value, reset goes back to the checked attribute. */
export const Form: Story = {
  name: 'Form',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('form'), inBothModes(context, 'form', () => formDemo(context))),
};

/** The status text under the boxes: it is replaced by a listener, and re-rendered only when the language changes. */
function interactive(context: GlobalsContext | undefined): TemplateResult {
  const v = t(context);
  const onChange = (event: Event): void => {
    const status = (event.currentTarget as HTMLElement).querySelector('output');
    const piece = event.target as NphCheckbox;
    if (status) {
      status.textContent = format(v.statusChanged, { checked: String(piece.checked) });
    }
  };
  return html`<div style=${stack} @change=${onChange}>
    ${checkbox({ text: v.rememberMe })} ${checkbox({ text: v.selectAll, indeterminate: true })}
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
    <span style=${statusStyle}>${v.hoverHint}</span>
  </div>`;
}

/** A click, or Space, toggles the box and fires input and change on the host; a click on indeterminate checks it. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('interactive'), inBothModes(context, 'interactive', () => interactive(context))),
};

/** The three required examples of the accepted frame, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${outer}>
        ${inBothModes(context, 'examples', () => consent(v), v.exampleConsent)}
        ${inBothModes(context, 'examples', () => preferences(v), v.examplePreferences)}
        ${inBothModes(context, 'examples', () => groupSelection(v), v.exampleGroup)}
      </div>`,
    );
  },
};
