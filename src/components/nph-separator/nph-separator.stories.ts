/**
 * VALIDATION stories of `nph-separator`.
 *
 * They prove both orientations filling the container, as in frame `1196:674`:
 * horizontal between stacked items and vertical between side-by-side items. The
 * labels are example content from the frame and come from the language
 * dictionary, in `.storybook/i18n/`. The color scheme comes from the global
 * Storybook selector.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-separator';

const meta: Meta = {
  title: 'Components/nph-separator/Validation',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the `nph-separator` stories dictionary in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).separatorValidation;
}

const frame = 'padding: var(--nph-space-section); max-inline-size: var(--nph-layout-field-width);';

/** Between stacked items, the line fills the width. */
export const Horizontal: Story = {
  name: 'Horizontal',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${frame}>
      <div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
        <span>${v.profile}</span>
        <nph-separator></nph-separator>
        <span>${v.signOut}</span>
      </div>
    </div>`;
  },
};

/** Between side-by-side items, the line fills the height. */
export const Vertical: Story = {
  name: 'Vertical',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${frame}>
      <div style="display: flex; gap: var(--nph-space-inline);">
        <span>${v.edit}</span>
        <nph-separator orientation="vertical"></nph-separator>
        <span>${v.delete}</span>
      </div>
    </div>`;
  },
};
