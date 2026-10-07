/**
 * Stories for VALIDATION of `nph-checkbox`.
 *
 * They prove the matrix accepted in Figma (frame `1194:1033`, set `740:18776`) and
 * P69: unchecked, checked and indeterminate in the default, error and disabled
 * states, the hidden text, long text, the item that summarizes a group and a group
 * of independent boxes. Hover and focus are interaction states: they show up by
 * moving the mouse and navigating with Tab. The example text comes from the language
 * dictionary, under the key `checkboxValidation` (`docs/i18n.md`, "Storybook").
 *
 * The color scheme comes from the global Storybook selector, applied at the root.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-checkbox';

const meta: Meta = {
  title: 'Components/nph-checkbox/Validation',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).checkboxValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const page = 'display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section);';
const row = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const stack = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-inline-tight);';
const indent = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-inline-tight); padding-inline-start: var(--nph-space-stack);';

/** Unchecked, checked and indeterminate, in default, invalid and disabled. Mouse for hover; Tab for focus. */
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
        ({ invalid, disabled }) => html`<div style=${row}>
          <nph-checkbox text=${v.unchecked} ?invalid=${invalid} ?disabled=${disabled}></nph-checkbox>
          <nph-checkbox text=${v.checked} checked ?invalid=${invalid} ?disabled=${disabled}></nph-checkbox>
          <nph-checkbox text=${v.indeterminate} indeterminate ?invalid=${invalid} ?disabled=${disabled}></nph-checkbox>
        </div>`,
      )}
    </div>`;
  },
};

/** hide-text: only the box, at 24 × 24; the text becomes the accessible name. */
export const HiddenText: Story = {
  name: 'Hidden text',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <div style=${row}>
        <nph-checkbox text=${v.rowName} hide-text></nph-checkbox>
        <nph-checkbox text=${v.rowName} hide-text checked></nph-checkbox>
        <nph-checkbox text=${v.rowName} hide-text indeterminate></nph-checkbox>
      </div>
    </div>`;
  },
};

/** Long text wraps beside the box; the box stays aligned to the first line. */
export const LongText: Story = {
  name: 'Long text',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <nph-checkbox text=${v.longText}></nph-checkbox>
      <nph-checkbox text=${v.longText} checked invalid></nph-checkbox>
    </div>`;
  },
};

/** indeterminate on the item that summarizes a group checked in part. */
export const Indeterminate: Story = {
  name: 'Indeterminate',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <div style=${stack}>
        <nph-checkbox text=${v.selectAll} indeterminate></nph-checkbox>
        <div style=${indent}>
          <nph-checkbox text=${v.email} checked></nph-checkbox>
          <nph-checkbox text=${v.sms}></nph-checkbox>
          <nph-checkbox text=${v.push} checked></nph-checkbox>
        </div>
      </div>
    </div>`;
  },
};

/** Independent boxes, stacked: Tab stops at each one, Space toggles. */
export const Group: Story = {
  name: 'Group',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <div style=${stack}>
        <nph-checkbox name="channels" value="email" text=${v.email} checked></nph-checkbox>
        <nph-checkbox name="channels" value="sms" text=${v.sms}></nph-checkbox>
        <nph-checkbox name="channels" value="push" text=${v.push}></nph-checkbox>
      </div>
      <nph-checkbox text=${v.accept}></nph-checkbox>
    </div>`;
  },
};
