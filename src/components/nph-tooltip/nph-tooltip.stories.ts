/**
 * VALIDATION stories of `nph-tooltip`.
 *
 * Each story shows the open bubble with the Figma example content
 * (frame `1237:5`): one line and two lines. The bubble text is content and
 * arrives ready from the application. It comes from the language dictionary,
 * under the `tooltipValidation` key (`docs/i18n.md`, "Storybook"), and in every
 * language the two-line text takes up two lines. Each page opens with what it
 * proves and points to the sheet, since the piece has no Docs page.
 *
 * The color scheme comes from the Storybook global selector, applied at the
 * page root.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { localeOf, validationPage } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-tooltip';

const meta: Meta = {
  title: 'Components/nph-tooltip/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).tooltipValidation;
}

function frame(context: GlobalsContext | undefined, storyId: string, text: string): TemplateResult {
  return validationPage(
    context,
    { piece: 'nph-tooltip', storyId: `components-nph-tooltip-validation--${storyId}`, sheet: true },
    html`<div><nph-tooltip open text=${text}></nph-tooltip></div>`,
  );
}

/** The open bubble with a one-line text. */
export const OneLine: Story = {
  name: 'One line',
  render: (_args, context: GlobalsContext) => frame(context, 'one-line', t(context).oneLine),
};

/** The open bubble with a two-line text: two lines in every language. */
export const TwoLines: Story = {
  name: 'Two lines',
  render: (_args, context: GlobalsContext) => frame(context, 'two-lines', t(context).twoLines),
};
