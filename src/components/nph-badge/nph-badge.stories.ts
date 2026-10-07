/**
 * VALIDATION stories of `nph-badge`.
 *
 * They prove the matrix accepted in Figma (frame `1196:1100`, set `878:30`): the
 * types in both emphases, with and without icon. All visible text, including the
 * example content of the badges, comes from the language dictionary, under the
 * `badgeValidation` key (`docs/i18n.md`, "Storybook").
 *
 * The color scheme comes from the global Storybook selector, applied at the root.
 * In a part of the screen with another brand and another scheme, on the same
 * element, `status/on-solid` resolves the local value (P67).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-badge';
import { NPH_BADGE_EMPHASES, NPH_BADGE_SEVERITIES } from './nph-badge';

const meta: Meta = {
  title: 'Components/nph-badge/Validation',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).badgeValidation;
}

/* Demo frame. Not a precedent for component CSS. */
const page = 'display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline-tight);';

function matrix(text: string, icon: string): TemplateResult {
  return html`<div style=${page}>
    ${NPH_BADGE_EMPHASES.map(
      (emphasis) => html`<div style=${row}>
        ${NPH_BADGE_SEVERITIES.map(
          (severity) => html`<nph-badge severity=${severity} emphasis=${emphasis} text=${text} icon=${icon}></nph-badge>`,
        )}
      </div>`,
    )}
  </div>`;
}

/** The types in both emphases, without icon. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => matrix(t(context).sample, ''),
};

/** The icon comes before the text, at icon/size-sm, in the text color. */
export const WithIcon: Story = {
  name: 'With icon',
  render: (_args, context: GlobalsContext) => matrix(t(context).sample, 'circle-info'),
};

/** One or two words, on a single line: the badge does not wrap. */
export const TwoWords: Story = {
  name: 'Two words',
  render: (_args, context: GlobalsContext) => {
    const [review, approved, signature] = t(context).twoWords as string[];
    return html`<div style=${page}>
      <div style=${row}>
        <nph-badge severity="secondary" emphasis="light" text=${review}></nph-badge>
        <nph-badge severity="success" text=${approved} icon="circle-check"></nph-badge>
        <nph-badge severity="warn" emphasis="light" text=${signature}></nph-badge>
      </div>
    </div>`;
  },
};
