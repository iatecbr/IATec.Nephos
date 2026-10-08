/**
 * Stories for VALIDATION of `nph-input`.
 *
 * They prove the matrix accepted in Figma (frame `1195:532`, set `622:18359`) and
 * P69: the two sizes, value, placeholder, start icon and clear button, the error and
 * disabled states, the association with `nph-label`, long content and the input
 * that does not render. Hover, focus and the clear focus (`foco-limpar`) are
 * interaction states: they show up by moving the mouse and navigating with Tab. The
 * example text comes from the language dictionary, under the key `inputValidation`
 * (`docs/i18n.md`, "Storybook").
 *
 * The color scheme comes from the global Storybook selector, applied at the root.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-input';
import '../nph-label/nph-label';
import { NPH_INPUT_SIZES } from './nph-input';

const meta: Meta = {
  title: 'Components/nph-input/Validation',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).inputValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const page = 'display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const field = 'display: flex; flex-direction: column; gap: var(--nph-space-inline-tight);';

/** default and large, with value and with placeholder. Move the mouse for hover; Tab for focus. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      ${NPH_INPUT_SIZES.map(
        (size) => html`<div style=${row}>
          <nph-input size=${size} label=${v.emailLabel} value=${v.emailValue}></nph-input>
          <nph-input size=${size} label=${v.emailLabel} placeholder=${v.emailPlaceholder}></nph-input>
        </div>`,
      )}
    </div>`;
  },
};

/** Value, placeholder, start icon and the clear button. Tab reaches the clear target (`foco-limpar`). */
export const Content: Story = {
  name: 'Content',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      ${NPH_INPUT_SIZES.map(
        (size) => html`<div style=${row}>
          <nph-input
            size=${size}
            label=${v.searchLabel}
            icon-start="magnifying-glass"
            value=${v.searchValue}
            clearable
            clear-label=${v.clear}
          ></nph-input>
          <nph-input
            size=${size}
            label=${v.searchLabel}
            icon-start="magnifying-glass"
            placeholder=${v.searchPlaceholder}
            clearable
            clear-label=${v.clear}
          ></nph-input>
        </div>`,
      )}
    </div>`;
  },
};

/** Error: border in status/error; with Tab, the error halo. The sentence belongs to nph-field. */
export const Invalid: Story = {
  name: 'Invalid',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      ${NPH_INPUT_SIZES.map(
        (size) => html`<div style=${row}>
          <nph-input size=${size} label=${v.emailLabel} value=${v.invalidValue} invalid clearable clear-label=${v.clear}></nph-input>
        </div>`,
      )}
    </div>`;
  },
};

/** Disabled: background color/muted, the whole field at state/disabled-opacity, out of Tab. */
export const Disabled: Story = {
  name: 'Disabled',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      ${NPH_INPUT_SIZES.map(
        (size) => html`<div style=${row}>
          <nph-input size=${size} label=${v.emailLabel} value=${v.emailValue} disabled clearable clear-label=${v.clear}></nph-input>
          <nph-input size=${size} label=${v.emailLabel} placeholder=${v.emailPlaceholder} disabled></nph-input>
        </div>`,
      )}
    </div>`;
  },
};

/** Default, placeholder, value with clear, invalid, and disabled states. Mouse for hover; Tab for focus. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const states = [
      { invalid: false, disabled: false },
      { invalid: true, disabled: false },
      { invalid: false, disabled: true },
    ];
    return html`<div style=${page}>
      ${states.map(
        ({ invalid, disabled }) => html`<div style=${row}>
          <nph-input label=${v.emailLabel} placeholder=${v.emailPlaceholder} ?invalid=${invalid} ?disabled=${disabled}></nph-input>
          <nph-input label=${v.searchLabel} value=${v.searchValue} clearable clear-label=${v.clear} ?invalid=${invalid} ?disabled=${disabled}></nph-input>
          <nph-input label=${v.emailLabel} value=${v.emailValue} ?invalid=${invalid} ?disabled=${disabled}></nph-input>
        </div>`,
      )}
    </div>`;
  },
};

/** The name comes from nph-label for; a click on the label puts the cursor in the field. */
export const LabelAssociation: Story = {
  name: 'Label association',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <div style=${field}>
        <nph-label for="story-input-city" text=${v.labelledByText}></nph-label>
        <nph-input id="story-input-city"></nph-input>
      </div>
    </div>`;
  },
};

/** required reaches the screen reader through the field; the asterisk of nph-label is decorative. */
export const Required: Story = {
  name: 'Required',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <div style=${field}>
        <nph-label for="story-input-registration" text=${v.requiredLabel} required></nph-label>
        <nph-input id="story-input-registration" required></nph-input>
      </div>
    </div>`;
  },
};

/** A long value scrolls inside the field; the field keeps its width. */
export const LongContent: Story = {
  name: 'Long content',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <nph-input label=${v.fullName} value=${v.longValue} clearable clear-label=${v.clear}></nph-input>
      <nph-input label=${v.fullName} value=${v.longValue} icon-start="magnifying-glass" size="large"></nph-input>
    </div>`;
  },
};

/**
 * What does not render: size outside the list, icon outside the core, clearable
 * without clear-label. Nothing appears, and the console shows one error per cause.
 */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <div style=${row}>
        <nph-input size="compact" label=${v.emailLabel} value=${v.emailValue}></nph-input>
        <nph-input icon-start="not-an-icon" label=${v.emailLabel} value=${v.emailValue}></nph-input>
        <nph-input clearable label=${v.emailLabel} value=${v.emailValue}></nph-input>
      </div>
    </div>`;
  },
};
