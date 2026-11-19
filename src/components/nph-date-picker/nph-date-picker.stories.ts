/**
 * VALIDATION stories of `nph-date-picker`.
 *
 * They prove the contract accepted in Figma (documentation frame `6673:62837`, root `6662:55010`, set `6666:32`, panel `6662:56378`) and
 * P133: the field in its three sizes, empty and filled, with the error and disabled states; the range with Start and End; the
 * panel open in its modes and sizes, with the date grid, the seven shortcuts, the divider and the footer; the limits, the date
 * unavailable by rule and a period that stops before it, and the shortcuts the limits disable; the form; the three required examples; and the seven brands. Every story shows the same pickers in light and
 * dark mode, in the same story, through `data-nph-color-scheme` on the frame (P20, P67).
 *
 * The open panels are drawn by the `open` attribute, one frame under the other, and take no focus: nothing the person did asked for
 * it. A panel follows its field and flips above when the window has no room below it, so the frame lower on the page may show its panel
 * above its field until the page is scrolled. Hover and keyboard focus show up by using the pickers; the component test measures each one. No attribute forces a state,
 * because it would be API. Each page opens with what it proves, from the dictionary (`validationPages.claims`); all visible text comes
 * from the language dictionary, under the key `datePickerValidation` (`docs/i18n.md`, "Storybook").
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { bothModes, opened, picker, typedWrong } from './nph-date-picker.demo';
import type { DatePickerText } from './nph-date-picker.demo';

const meta: Meta = {
  title: 'Components/nph-date-picker/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined): DatePickerText {
  return translations(localeOf(context)).datePickerValidation as DatePickerText;
}

const page = (storyId: string) => ({ piece: 'nph-date-picker', storyId: `components-nph-date-picker-validation--${storyId}` });

const captions = (v: DatePickerText) => ({ light: v.lightCaption, dark: v.darkCaption });

const SIZES = ['compact', 'default', 'large'] as const;

/** The field, empty and filled, in the three sizes: the text, the clear button only with a value and the calendar button. */
export const Field: Story = {
  name: 'Field',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('field'),
      bothModes(captions(v), () =>
        matrix(
          validationTitle(context, 'nph-date-picker', page('field').storyId),
          [],
          SIZES.flatMap((size) => [
            { label: `mode: single · size: ${size} · empty`, cells: [picker(v, { size })] },
            { label: `mode: single · size: ${size} · filled`, cells: [picker(v, { size, value: '2026-10-20' })] },
          ]),
        ),
      ),
    );
  },
};

/** The error and disabled states: the message says what to fix and disabled wins over the error. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      bothModes(captions(v), () =>
        matrix(validationTitle(context, 'nph-date-picker', page('states').storyId), [], [
          { label: 'error', cells: [picker(v, { value: '2026-10-20', error: v.externalError })] },
          { label: 'disabled', cells: [picker(v, { value: '2026-10-20', disabled: true })] },
          { label: 'error · disabled', cells: [picker(v, { value: '2026-10-20', error: v.externalError, disabled: true })] },
          { label: 'required', cells: [picker(v, { required: true })] },
        ]),
      ),
    );
  },
};

/** The range field: Start and End side by side, each in its own field, and one calendar button, in End. */
export const Range: Story = {
  name: 'Range',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('range'),
      bothModes(captions(v), () =>
        matrix(validationTitle(context, 'nph-date-picker', page('range').storyId), [], [
          { label: 'mode: range · empty', cells: [picker(v, { mode: 'range' })] },
          { label: 'mode: range · filled', cells: [picker(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21' })] },
          { label: 'mode: range · error on end', cells: [picker(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21', endError: v.externalError })] },
          { label: 'mode: range · size: large', cells: [picker(v, { mode: 'range', size: 'large', start: '2026-10-09', end: '2026-10-21' })] },
        ]),
      ),
    );
  },
};

/** The panel of a single date, open below the field: the grid alone, picking a day applies and closes. */
export const PanelSingle: Story = {
  name: 'Panel single',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('panel-single'),
      bothModes(captions(v), () => opened(v, { value: '2026-10-20' })),
    );
  },
};

/** The panel of a range, open: the seven shortcuts, two months, the divider and the footer with Clear, Cancel and Apply. */
export const PanelRange: Story = {
  name: 'Panel range',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('panel-range'),
      bothModes(captions(v), () => opened(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21' })),
    );
  },
};

/** The panel of the large size, for a touch screen: the day of 44, the footer buttons in the default size. */
export const PanelLarge: Story = {
  name: 'Panel large',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('panel-large'),
      bothModes(captions(v), () => opened(v, { mode: 'range', size: 'large', start: '2026-10-09', end: '2026-10-21' })),
    );
  },
};

/**
 * The limits and the dates unavailable by rule: the day outside min and max fades and is skipped; the holiday takes focus and is not chosen.
 * In the range, with only the Start chosen, the days past the unavailable day cannot be the End, and the shortcuts with a day outside
 * the limits are disabled.
 */
export const Limits: Story = {
  name: 'Limits',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('limits'),
      bothModes(
        captions(v),
        () =>
          html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
            ${opened(v, { value: '2026-10-14', min: '2026-10-08', max: '2026-10-24', unavailable: ['2026-10-12', '2026-10-15', '2026-10-20'] })}
            ${opened(v, { mode: 'range', start: '2026-10-14', min: '2026-10-08', max: '2026-10-31', unavailable: ['2026-10-20'] })}
          </div>`,
      ),
    );
  },
};

/** A picker to try, single and range: the button opens the panel, Esc, a press outside or Cancel closes it, and the focus goes back. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('interactive'),
      matrix(validationTitle(context, 'nph-date-picker', page('interactive').storyId), [], [
        { label: 'mode: single · closed: open it with the button', cells: [picker(v, { value: '2026-10-20' })] },
        { label: 'mode: range · closed: open it with the button', cells: [picker(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21' })] },
      ]),
    );
  },
};

/** A picker in a form: the name puts the date in the form data, a typed date that is not one is invalid, and reset brings the default back. */
export const Form: Story = {
  name: 'Form',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const show = (event: Event): void => {
      const form = event.currentTarget as HTMLFormElement;
      const status = form.querySelector('[data-status]');
      const data = new FormData(form);
      if (status !== null) status.textContent = v.statusChange.replace('{data}', JSON.stringify(Object.fromEntries(data)));
    };
    return validationPage(
      context,
      page('form'),
      matrix(validationTitle(context, 'nph-date-picker', page('form').storyId), [], [
        {
          label: 'name · start-name · end-name',
          cells: [
            html`<form
              style="display: flex; flex-direction: column; gap: var(--nph-space-stack);"
              @submit=${(event: Event) => {
                event.preventDefault();
                show(event);
              }}
              @reset=${(event: Event) => {
                const status = (event.currentTarget as HTMLFormElement).querySelector('[data-status]');
                if (status !== null) status.textContent = v.statusReset;
              }}
            >
              ${picker(v, { value: '2026-10-20', name: 'due' })}
              ${picker(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21', startName: 'from', endName: 'to' })}
              <div style="display: flex; gap: var(--nph-space-inline);">
                <button type="submit">${v.submitText}</button>
                <button type="reset">${v.resetText}</button>
              </div>
              <p role="status" data-status style="margin: 0; color: var(--nph-color-muted-foreground);">${v.statusIdle}</p>
            </form>`,
          ],
        },
      ]),
    );
  },
};

/** The three required examples — a due date, a report period with Custom chosen and an invalid date — in light and in dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
        <section aria-label=${v.exampleDue}>${bothModes(captions(v), () => picker(v, { value: '2026-10-14' }))}</section>
        <section aria-label=${v.exampleReport}>
          ${bothModes(captions(v), () => opened(v, { mode: 'range', start: '2026-10-02', end: '2026-10-05' }))}
        </section>
        <section aria-label=${v.exampleInvalid}>${bothModes(captions(v), () => typedWrong(v))}</section>
      </div>`,
    );
  },
};

/** The seven brands in light and dark mode: the focus, the chosen day, the period and the Apply button follow the brand of the frame. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-date-picker', page('brands').storyId), () =>
        html`${picker(v, { mode: 'range', start: '2026-10-09', end: '2026-10-21' })}`,
      ),
    );
  },
};
