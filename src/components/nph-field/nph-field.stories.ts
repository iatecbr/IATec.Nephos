/**
 * VALIDATION stories of `nph-field`.
 *
 * They prove the contract accepted in Figma (frame `1194:21863`, set `657:50`), the
 * decisions D1 to D8 of DSA-28 and P83: the matrix of error, required mark and
 * information icon; the message line, which is not drawn when empty and where the error
 * replaces the help; the counter; the width of the field and of its control; a group of
 * checkboxes and one of radios; the disabled field; and what the field writes on its
 * control. Every story shows the same fields in light and in dark mode, in the same story,
 * through `data-nph-color-scheme` on the frame (P20, P67).
 *
 * The control of a single field is the real `nph-input`; the options of a group are the
 * stand-ins of `nph-field.demo.ts`, which take the field contract of P83, until
 * `nph-checkbox` and `nph-radio` are merged. The text of the examples and the captions
 * come from the language dictionary, under the key `fieldValidation` (`docs/i18n.md`,
 * "Storybook"); the row and column names of the matrix are the technical attributes, the
 * same in any language. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { localeOf, validationPage } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-field';
import type { NphField, NphFieldControl } from './nph-field';
import { bothModes, field, group } from './nph-field.demo';

const meta: Meta = {
  title: 'Components/nph-field/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).fieldValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-section);';
const captionStyle =
  'margin: 0; font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height); color: var(--nph-color-muted-foreground);';

function frame(context: GlobalsContext | undefined, storyId: string, content: TemplateResult): TemplateResult {
  return validationPage(context, { piece: 'nph-field', storyId: `components-nph-field-validation--${storyId}` }, content);
}

function caption(text: string): TemplateResult {
  return html`<p style=${captionStyle}>${text}</p>`;
}

/** A field with a caption above it saying what it shows. */
function captioned(text: string, content: TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">${caption(text)} ${content}</div>`;
}

function modes(context: GlobalsContext | undefined, content: () => TemplateResult): TemplateResult {
  const v = t(context);
  return bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => html`<div style=${stack}>${content()}</div>`);
}

/** Error × required × information icon: the three variant axes of the set, in light and in dark. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const rows = [
      { required: false, info: false },
      { required: true, info: false },
      { required: false, info: true },
      { required: true, info: true },
    ];
    const cell = (required: boolean, info: boolean, error: boolean) =>
      field({
        label: v.email,
        required,
        info: info ? v.emailInfo : undefined,
        infoLabel: info ? v.emailInfoLabel : undefined,
        help: v.emailHelp,
        error: error ? v.emailError : undefined,
        value: v.emailValue,
      });
    return frame(
      context,
      'matrix',
      modes(
        context,
        () => html`<div style="display: grid; grid-template-columns: auto auto auto; gap: var(--nph-space-stack); align-items: start;">
          <span></span>${caption('error=""')}${caption('error="…"')}
          ${rows.map(
            ({ required, info }) =>
              html`${caption(`required=${required} · info=${info}`)}${cell(required, info, false)}${cell(required, info, true)}`,
          )}
        </div>`,
      ),
    );
  },
};

/** The message line: not drawn when empty; help in caption; the error replaces it, with no icon. */
export const MessageLine: Story = {
  name: 'Message line',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'message-line',
      modes(
        context,
        () => html`
          ${captioned(v.noMessageCaption, field({ label: v.email, value: v.emailValue }))}
          ${captioned(v.helpCaption, field({ label: v.email, help: v.emailHelp }))}
          ${captioned(v.errorCaption, field({ label: v.email, help: v.emailHelp, error: v.emailError, value: v.emailWrong }))}
          ${captioned(v.longCaption, field({ label: v.email, help: v.longHelp }))}
        `,
      ),
    );
  },
};

/** The counter: at the end of the help line, alone, and on a line of its own below the error. */
export const Counter: Story = {
  name: 'Counter',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'counter',
      modes(
        context,
        () => html`
          ${captioned(v.counterHelpCaption, field({ label: v.bio, help: v.bioHelp, counter: v.counter }))}
          ${captioned(v.counterAloneCaption, field({ label: v.bio, counter: v.counter }))}
          ${captioned(v.counterErrorCaption, field({ label: v.bio, help: v.bioHelp, error: v.bioError, counter: v.counterOver }))}
        `,
      ),
    );
  },
};

/** layout/field-width by default; stretched by its container; the control fills the field. */
export const Width: Story = {
  name: 'Width',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'width',
      modes(
        context,
        () => html`
          ${captioned(v.widthDefaultCaption, field({ label: v.email, help: v.emailHelp }))}
          ${captioned(
            v.widthStretchedCaption,
            html`<div style="inline-size: calc(var(--nph-layout-field-width) * 1.5);">
              ${field({ label: v.email, help: v.emailHelp, style: 'inline-size: 100%;' })}
            </div>`,
          )}
        `,
      ),
    );
  },
};

/** A group of checkboxes and a group of radios, stacked, named and described by the field. */
export const Group: Story = {
  name: 'Group',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'group',
      modes(
        context,
        () => html`
          ${captioned(
            v.groupCheckboxCaption,
            group({ kind: 'checkbox', label: v.notifications, help: v.notificationsHelp, options: v.notificationsOptions, checked: [0] }),
          )}
          ${captioned(
            v.groupRadioCaption,
            group({ kind: 'radio', label: v.payment, required: true, error: v.paymentError, options: v.paymentOptions }),
          )}
        `,
      ),
    );
  },
};

/** Disabled: the control fades, the label and the message line do not; the error is hidden. */
export const Disabled: Story = {
  name: 'Disabled',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'disabled',
      modes(
        context,
        () => html`
          ${captioned(v.disabledCaption, field({ label: v.email, help: v.emailHelp, value: v.emailValue, disabled: true }))}
          ${captioned(
            v.disabledErrorCaption,
            field({ label: v.email, help: v.emailHelp, error: v.emailError, value: v.emailWrong, disabled: true }),
          )}
          ${captioned(
            v.disabledInfoCaption,
            field({ label: v.email, info: v.emailInfo, infoLabel: v.emailInfoLabel, value: v.emailValue, disabled: true }),
          )}
        `,
      ),
    );
  },
};

const CONTRACT_KEYS = ['label', 'description', 'invalid', 'required', 'disabled'] as const;

/** Fills the readout with what the field wrote on its control, after the field settles. */
function readout(element: Element | undefined): void {
  const output = element as HTMLElement | undefined;
  const fieldElement = output?.previousElementSibling as NphField | null | undefined;
  if (!output || !fieldElement) {
    return;
  }
  void fieldElement.updateComplete.then(() => {
    const control = fieldElement.firstElementChild as NphFieldControl | null;
    if (!control) {
      return;
    }
    output.replaceChildren(
      ...CONTRACT_KEYS.map((key) => {
        const row = document.createElement('div');
        const term = document.createElement('code');
        term.textContent = key;
        row.append(term, ` ${String(control[key])}`);
        return row;
      }),
    );
  });
}

/** What the field writes on its control (P83): name, description, invalid, required and disabled. */
export const ControlContract: Story = {
  name: 'Control contract',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const pair = (content: TemplateResult) =>
      html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
        ${content}
        <!-- A new callback on every render: the readout follows a change of language. -->
        <output ${ref((element) => readout(element))} style=${captionStyle}></output>
      </div>`;
    return frame(
      context,
      'control-contract',
      html`${caption(v.contractCaption)}
      ${modes(
        context,
        () => html`
          ${pair(field({ label: v.email, required: true, help: v.emailHelp }))}
          ${pair(field({ label: v.email, required: true, help: v.emailHelp, error: v.emailError, value: v.emailWrong }))}
        `,
      )}`,
    );
  },
};
