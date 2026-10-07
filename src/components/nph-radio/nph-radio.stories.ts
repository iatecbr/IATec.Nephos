/**
 * Stories for VALIDATION of `nph-radio`.
 *
 * They prove the matrix accepted in Figma (frame `1196:311`, set `848:66`) and P69:
 * unchecked and checked in the default, error and disabled states, the group with a
 * single Tab stop and the arrows that move and check, two groups that do not mix,
 * the hidden text and long text. Hover and focus are interaction states: they show
 * up by moving the mouse and navigating with Tab. The example text comes from the
 * language dictionary, under the key `radioValidation` (`docs/i18n.md`, "Storybook").
 *
 * The group frame carries `role="radiogroup"` and the name of the group, the role
 * that `nph-field` will have. It is not a precedent for component CSS. The color
 * scheme comes from the global Storybook selector, applied at the root.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-radio';

const meta: Meta = {
  title: 'Components/nph-radio/Validation',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).radioValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const page = 'display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section);';
const row = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const stack = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-inline-tight);';
const title =
  'margin: 0; color: var(--nph-color-foreground); font-family: var(--nph-text-label-md-font-family); font-size: var(--nph-text-label-md-font-size); font-weight: var(--nph-text-label-md-font-weight); line-height: var(--nph-text-label-md-line-height);';

/** A named group: the role that nph-field will have. */
function group(id: string, name: string, content: TemplateResult): TemplateResult {
  return html`<div style=${stack}>
    <p id=${id} style=${title}>${name}</p>
    <div role="radiogroup" aria-labelledby=${id} style=${stack}>${content}</div>
  </div>`;
}

/** Tab enters the group once, on the checked one; the arrows move and check, wrapping around. */
export const Group: Story = {
  name: 'Group',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      ${group(
        'story-radio-payment',
        v.paymentTitle,
        html`<nph-radio name="payment" value="pix" text=${v.pix} checked></nph-radio>
          <nph-radio name="payment" value="card" text=${v.card}></nph-radio>
          <nph-radio name="payment" value="slip" text=${v.slip}></nph-radio>`,
      )}
    </div>`;
  },
};

/** Unchecked and checked, in default, invalid and disabled. Mouse for hover; Tab for focus. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const states = [
      { invalid: false, disabled: false },
      { invalid: true, disabled: false },
      { invalid: false, disabled: true },
    ];
    return html`<div style=${page}>
      ${states.map(
        ({ invalid, disabled }, index) => html`<div style=${row}>
          <nph-radio name=${`matrix-${index}`} text=${v.unchecked} ?invalid=${invalid} ?disabled=${disabled}></nph-radio>
          <nph-radio name=${`matrix-${index}`} text=${v.checked} checked ?invalid=${invalid} ?disabled=${disabled}></nph-radio>
        </div>`,
      )}
    </div>`;
  },
};

/** Two groups side by side: each name is its own group, with its own Tab stop and position. */
export const TwoGroups: Story = {
  name: 'Two groups',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <div style=${row}>
        ${group(
          'story-radio-shift',
          v.shiftTitle,
          html`<nph-radio name="shift" value="morning" text=${v.morning}></nph-radio>
            <nph-radio name="shift" value="afternoon" text=${v.afternoon} checked></nph-radio>
            <nph-radio name="shift" value="night" text=${v.night}></nph-radio>`,
        )}
        ${group(
          'story-radio-bond',
          v.bondTitle,
          html`<nph-radio name="bond" value="employee" text=${v.employee}></nph-radio>
            <nph-radio name="bond" value="contractor" text=${v.contractor}></nph-radio>`,
        )}
      </div>
    </div>`;
  },
};

/** hide-text: only the circle, at 24 × 24; the text becomes the accessible name. */
export const HiddenText: Story = {
  name: 'Hidden text',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <div style=${row}>
        <nph-radio name="hidden" text=${v.rowName} hide-text checked></nph-radio>
        <nph-radio name="hidden" text=${v.unchecked} hide-text></nph-radio>
      </div>
    </div>`;
  },
};

/** Long text wraps beside the circle; the circle stays aligned to the first line. */
export const LongText: Story = {
  name: 'Long text',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      ${group(
        'story-radio-long',
        v.paymentTitle,
        html`<nph-radio name="long" value="pix" text=${v.pix}></nph-radio>
          <nph-radio name="long" value="slip" text=${v.longText} checked></nph-radio>`,
      )}
    </div>`;
  },
};
