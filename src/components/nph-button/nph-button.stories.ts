/**
 * Stories for VALIDATION of `nph-button`.
 *
 * They prove the matrix accepted in Figma (frame `1197:5449`, sets `461:13009` and
 * `498:15671`): the severity and emphasis pairs (B1), the three sizes, the start
 * and end icons, the icon only and the disabled and loading states. They also prove
 * P86: the square and circular shapes of the icon-only button and its tooltip. Hover
 * and focus are interaction states: they show up by moving the mouse and navigating
 * with Tab.
 * Each page opens with what it proves, and the matrices name their rows and
 * columns by attribute, as on the Docs page; a pair that does not exist leaves its
 * cell empty. The example text of the buttons comes from the language dictionary,
 * under the key `buttonValidation` (`docs/i18n.md`, "Storybook"); in the matrix,
 * the text is the technical name of the severity.
 *
 * The color scheme comes from the global Storybook selector, applied at the root. In a
 * part of the screen with another brand and another scheme, on the same element,
 * `status/on-solid` and `focus/halo` resolve the local value (P67).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-button';
import { NPH_BUTTON_EMPHASES, NPH_BUTTON_SEVERITIES, NPH_BUTTON_SHAPES, NPH_BUTTON_SIZES } from './nph-button';
import type { NphButtonEmphasis, NphButtonSeverity } from './nph-button';

const meta: Meta = {
  title: 'Components/nph-button/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).buttonValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

const page = (storyId: string) => ({ piece: 'nph-button', storyId: `components-nph-button-validation--${storyId}` });

/** The pairs that exist (B1): solid in all; the other emphases only in three severities. */
function exists(severity: NphButtonSeverity, emphasis: NphButtonEmphasis): boolean {
  return emphasis === 'solid' || ['primary', 'secondary', 'danger'].includes(severity);
}

/** Severity in the columns, emphasis in the rows, as on the Docs page. */
function pairMatrix(
  context: GlobalsContext | undefined,
  storyId: string,
  draw: (severity: NphButtonSeverity, emphasis: NphButtonEmphasis) => TemplateResult,
): TemplateResult {
  return matrix(
    validationTitle(context, 'nph-button', page(storyId).storyId),
    NPH_BUTTON_SEVERITIES.map((severity) => `severity: ${severity}`),
    NPH_BUTTON_EMPHASES.map((emphasis) => ({
      label: `emphasis: ${emphasis}`,
      cells: NPH_BUTTON_SEVERITIES.map((severity) => (exists(severity, emphasis) ? draw(severity, emphasis) : html``)),
    })),
  );
}

/** Each severity and emphasis pair that exists, at the default size. Move the mouse for hover. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('matrix'),
      pairMatrix(
        context,
        'matrix',
        (severity, emphasis) =>
          html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${severity}></nph-button>`,
      ),
    ),
};

/** The three sizes, with text and icon only. The text is label-md in all. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('sizes'),
      matrix(
        validationTitle(context, 'nph-button', page('sizes').storyId),
        [],
        NPH_BUTTON_SIZES.map((size) => ({
          label: `size: ${size}`,
          cells: [
            html`<div style=${row}>
              <nph-button size=${size} text=${v.save}></nph-button>
              <nph-button size=${size} text=${v.add} icon-start="plus"></nph-button>
              <nph-button size=${size} icon-start="xmark" label=${v.close}></nph-button>
            </div>`,
          ],
        })),
      ),
    );
  },
};

/** Start icon, end icon and both together (B6), at icon/size-sm, and the icon only; on hover, the icons turn solid (P88). */
export const Icons: Story = {
  name: 'Icons',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('icons'),
      html`<div style=${row}>
        <nph-button size="default" text=${v.add} icon-start="plus"></nph-button>
        <nph-button size="default" emphasis="outline" text=${v.options} icon-end="chevron-down"></nph-button>
        <nph-button size="default" emphasis="light" text=${v.filter} icon-start="filter" icon-end="chevron-down"></nph-button>
        <nph-button size="default" icon-start="plus" label=${v.add}></nph-button>
      </div>`,
    );
  },
};

/** Disabled: the whole button at state/disabled-opacity, out of the Tab order. */
export const Disabled: Story = {
  name: 'Disabled',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('disabled'),
      pairMatrix(
        context,
        'disabled',
        (severity, emphasis) =>
          html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${severity} disabled></nph-button>`,
      ),
    ),
};

/** Loading: the spinner in place of the start icon; the text stays. */
export const Loading: Story = {
  name: 'Loading',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('loading'),
      html`<div style=${stack}>
        ${pairMatrix(
          context,
          'loading',
          (severity, emphasis) =>
            html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${severity} loading></nph-button>`,
        )}
        <div style=${row}>
          ${NPH_BUTTON_SIZES.map(
            (size) => html`<nph-button size=${size} icon-start="xmark" label=${t(context).close} loading></nph-button>`,
          )}
        </div>
      </div>`,
    ),
};

/** Square and circular icon-only buttons in each size and pair (P86): the size stays; Tab shows the focus. */
export const Shapes: Story = {
  name: 'Shapes',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('shapes'),
      html`<div style=${stack}>
        ${NPH_BUTTON_SHAPES.map(
          (shape) => html`<div style=${row}>
            ${NPH_BUTTON_SIZES.map(
              (size) => html`<nph-button size=${size} shape=${shape} icon-start="plus" label=${v.add}></nph-button>`,
            )}
            <code>shape: ${shape}</code>
          </div>`,
        )}
        ${pairMatrix(
          context,
          'shapes',
          (severity, emphasis) =>
            html`<nph-button severity=${severity} emphasis=${emphasis} size="default" shape="circular" icon-start="plus" label=${v.add}></nph-button>`,
        )}
      </div>`,
    );
  },
};

/** The tooltip of the icon-only button (P86): Tab opens it at once, the pointer after the wait; disabled has none. */
export const Tooltip: Story = {
  name: 'Tooltip',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('tooltip'),
      html`<div style=${row}>
        <nph-button size="default" severity="secondary" emphasis="ghost" icon-start="xmark" label=${v.close}></nph-button>
        <nph-button size="default" shape="circular" icon-start="plus" label=${v.add}></nph-button>
        <nph-button size="default" icon-start="plus" label=${v.add} loading></nph-button>
        <nph-button size="default" icon-start="plus" label=${v.add} disabled></nph-button>
      </div>`,
    );
  },
};
