/**
 * VALIDATION stories of `nph-badge`.
 *
 * They prove the matrix accepted in Figma (frame `1196:1100`, set `878:30`): the
 * types in both emphases, with and without icon. Each page opens with what it
 * proves, and the matrix names its rows and columns by attribute, as on the Docs
 * page. All visible text, including the example content of the badges, comes
 * from the language dictionary, under the `badgeValidation` and
 * `validationPages` keys (`docs/i18n.md`, "Storybook").
 *
 * The color scheme comes from the global Storybook selector, applied at the root.
 * In a part of the screen with another brand and another scheme, on the same
 * element, `status/on-solid` resolves the local value (P67).
 *
 * The `Brands` page proves the seven brands of P20 in light and dark, each frame carrying
 * `data-nph-brand` and `data-nph-color-scheme` on the same element (DSA-36).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-badge';
import { NPH_BADGE_EMPHASES, NPH_BADGE_SEVERITIES } from './nph-badge';

const meta: Meta = {
  title: 'Components/nph-badge/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).badgeValidation;
}

/* Demo frame. Not a precedent for component CSS. */
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline-tight);';

const page = (storyId: string) => ({ piece: 'nph-badge', storyId: `components-nph-badge-validation--${storyId}` });

function severityMatrix(context: GlobalsContext | undefined, storyId: string, icon: string): TemplateResult {
  const text = t(context).sample;
  return validationPage(
    context,
    page(storyId),
    matrix(
      validationTitle(context, 'nph-badge', page(storyId).storyId),
      NPH_BADGE_SEVERITIES.map((severity) => `severity: ${severity}`),
      NPH_BADGE_EMPHASES.map((emphasis) => ({
        label: `emphasis: ${emphasis}`,
        cells: NPH_BADGE_SEVERITIES.map(
          (severity) => html`<nph-badge severity=${severity} emphasis=${emphasis} text=${text} icon=${icon}></nph-badge>`,
        ),
      })),
    ),
  );
}

/** The types in both emphases, without icon. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => severityMatrix(context, 'matrix', ''),
};

/** The icon comes before the text, at icon/size-sm, in the text color. */
export const WithIcon: Story = {
  name: 'With icon',
  render: (_args, context: GlobalsContext) => severityMatrix(context, 'with-icon', 'circle-info'),
};

/** One or two words, on a single line: the badge does not wrap. */
export const TwoWords: Story = {
  name: 'Two words',
  render: (_args, context: GlobalsContext) => {
    const [review, approved, signature] = t(context).twoWords as string[];
    return validationPage(
      context,
      page('two-words'),
      html`<div style=${row}>
        <nph-badge severity="secondary" emphasis="light" text=${review}></nph-badge>
        <nph-badge severity="success" text=${approved} icon="circle-check"></nph-badge>
        <nph-badge severity="warn" emphasis="light" text=${signature}></nph-badge>
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): primary follows the brand of the frame in both emphases. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const text = t(context).sample;
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-badge', page('brands').storyId),
        () => html`${NPH_BADGE_EMPHASES.map(
          (emphasis) => html`<nph-badge severity="primary" emphasis=${emphasis} text=${text}></nph-badge>`,
        )}`,
      ),
    );
  },
};
