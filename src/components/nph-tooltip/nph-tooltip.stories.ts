/**
 * VALIDATION stories of `nph-tooltip`.
 *
 * Each story shows the open bubble with the Figma example content
 * (frame `1237:5`): one line and two lines. There is no explanatory text,
 * only the bubble text, which is content and arrives ready from the
 * application. It comes from the language dictionary, under the
 * `tooltipValidation` key (`docs/i18n.md`, "Storybook"), and in every
 * language the two-line text takes up two lines.
 *
 * The color scheme comes from the Storybook global selector, applied at the
 * page root.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-tooltip';

const meta: Meta = {
  title: 'Components/nph-tooltip/Validation',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).tooltipValidation;
}

function frame(text: string): TemplateResult {
  return html`<div style="padding: var(--nph-space-section);">
    <nph-tooltip open text=${text}></nph-tooltip>
  </div>`;
}

export const OneLine: Story = {
  name: 'One line',
  render: (_args, context: GlobalsContext) => frame(t(context).oneLine),
};

export const TwoLines: Story = {
  name: 'Two lines',
  render: (_args, context: GlobalsContext) => frame(t(context).twoLines),
};
