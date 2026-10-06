/**
 * Stories for VALIDATION of `nph-button`.
 *
 * They prove the matrix accepted in Figma (frame `1197:5449`, sets `461:13009` and
 * `498:15671`): the severity and emphasis pairs (B1), the three sizes, the start
 * and end icons, the icon only and the disabled and loading states. Hover and focus
 * are interaction states: they show up by moving the mouse and navigating with Tab. The
 * example text of the buttons comes from the language dictionary, under the key
 * `buttonValidation` (`docs/i18n.md`, "Storybook"); in the matrix, the text is the
 * technical name of the severity.
 *
 * The color scheme comes from the global Storybook selector, applied at the root. In a
 * part of the screen with another brand and another scheme, on the same element,
 * `status/on-solid` and `focus/halo` resolve the local value (P67).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-button';
import { NPH_BUTTON_EMPHASES, NPH_BUTTON_SEVERITIES, NPH_BUTTON_SIZES } from './nph-button';
import type { NphButtonEmphasis, NphButtonSeverity } from './nph-button';

const meta: Meta = {
  title: 'Components/nph-button/Validation',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).buttonValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const page = 'display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

/** The pairs that exist (B1): solid in all; the other emphases only in three severities. */
function pairs(): ReadonlyArray<readonly [NphButtonSeverity, NphButtonEmphasis]> {
  return NPH_BUTTON_EMPHASES.flatMap((emphasis) =>
    NPH_BUTTON_SEVERITIES.filter(
      (severity) => emphasis === 'solid' || ['primary', 'secondary', 'danger'].includes(severity),
    ).map((severity) => [severity, emphasis] as const),
  );
}

function byEmphasis(render: (severity: NphButtonSeverity, emphasis: NphButtonEmphasis) => TemplateResult): TemplateResult {
  return html`<div style=${page}>
    ${NPH_BUTTON_EMPHASES.map(
      (emphasis) => html`<div style=${row}>
        ${pairs()
          .filter(([, e]) => e === emphasis)
          .map(([severity]) => render(severity, emphasis))}
      </div>`,
    )}
  </div>`;
}

/** Each severity and emphasis pair that exists, at the default size. Move the mouse for hover. */
export const Matrix: Story = {
  name: 'Matrix',
  render: () =>
    byEmphasis(
      (severity, emphasis) =>
        html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${severity}></nph-button>`,
    ),
};

/** The three sizes, with text and icon only. The text is label-md in all. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      ${NPH_BUTTON_SIZES.map(
        (size) => html`<div style=${row}>
          <nph-button size=${size} text=${v.save}></nph-button>
          <nph-button size=${size} text=${v.add} icon-start="plus"></nph-button>
          <nph-button size=${size} icon-start="xmark" label=${v.close}></nph-button>
        </div>`,
      )}
    </div>`;
  },
};

/** Start icon, end icon and both together (B6), at icon/size-sm. */
export const Icons: Story = {
  name: 'Icons',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <div style=${row}>
        <nph-button size="default" text=${v.add} icon-start="plus"></nph-button>
        <nph-button size="default" emphasis="outline" text=${v.options} icon-end="chevron-down"></nph-button>
        <nph-button size="default" emphasis="light" text=${v.filter} icon-start="filter" icon-end="chevron-down"></nph-button>
      </div>
    </div>`;
  },
};

/** Disabled: the whole button at state/disabled-opacity, out of the Tab order. */
export const Disabled: Story = {
  name: 'Disabled',
  render: () =>
    byEmphasis(
      (severity, emphasis) =>
        html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${severity} disabled></nph-button>`,
    ),
};

/** Loading: the spinner in place of the start icon; the text stays. */
export const Loading: Story = {
  name: 'Loading',
  render: (_args, context: GlobalsContext) => html`${byEmphasis(
    (severity, emphasis) =>
      html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${severity} loading></nph-button>`,
  )}
    <div style=${page}>
      <div style=${row}>
        ${NPH_BUTTON_SIZES.map(
          (size) => html`<nph-button size=${size} icon-start="xmark" label=${t(context).close} loading></nph-button>`,
        )}
      </div>
    </div>`,
};
