/**
 * VALIDATION stories of `nph-chip`.
 *
 * They prove the contract accepted in Figma (page `NPH — Chip`, documentation `3077:2240`, set
 * `3076:1439`), the pending decisions D-1 to D-5 of DSA-57 in their default and P100, through
 * the public attributes only: the removable chip by content, size and state; the status
 * severities by size, at rest and disabled; the selectable chip by content, size and state,
 * with the counter and the selected one; a long label cut with an ellipsis; the invalid input;
 * and the three mandatory examples of the documentation — applied filters in the line of the
 * toolbar, values chosen in a field with one invalid, and quick filters. Every story shows the
 * same pieces in light and in dark mode, in the same story, through `data-nph-color-scheme` on
 * the frame (P20, P67).
 *
 * Hover, focus, active and the balloon of a cut label are interaction states, not attributes:
 * they show up by moving the mouse over a chip or its X and pressing Tab; the component tests
 * measure them. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`). The text the piece receives and the captions come from the
 * language dictionary, under the key `chipValidation` (`docs/i18n.md`, "Storybook"); the row
 * and column names of the matrices are the technical attributes, the same in any language.
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
import { NPH_CHIP_SEVERITIES, NPH_CHIP_SIZES } from './nph-chip';
import { appliedFilters, chip, chosenValues, inScheme, quickFilters } from './nph-chip.demo';
import type { ChipOptions, ExampleText, Scheme } from './nph-chip.demo';

const meta: Meta = {
  title: 'Components/nph-chip/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).chipValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';

const page = (storyId: string) => ({
  piece: 'nph-chip',
  storyId: `components-nph-chip-validation--${storyId}`,
});

/** What a story draws in one mode. */
type ModeContent = () => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, content: ModeContent, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => inScheme(scheme, name === undefined ? caption : `${name} · ${caption}`, content()))}
  </div>`;
}

/** The text of the three examples, from the dictionary. */
const examplesOf = (context: GlobalsContext | undefined): ExampleText => t(context) as unknown as ExampleText;

/** The states a removable chip has as attributes, one column each. */
const REMOVABLE_STATES: Array<[string, ChipOptions]> = [
  ['default', {}],
  ['marked', { marked: true }],
  ['readonly', { readonly: true }],
  ['invalid', { invalid: true }],
  ['disabled', { disabled: true }],
];

/** The states a selectable chip has as attributes, one column each. */
const SELECTABLE_STATES: Array<[string, ChipOptions]> = [
  ['default', {}],
  ['disabled', { disabled: true }],
  ['selected', { selected: true }],
  ['selected · disabled', { selected: true, disabled: true }],
];

/** Removable chip × content (text, icon, avatar) × size × the states that are attributes. */
export const Removable: Story = {
  name: 'Removable',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const contents: Array<[string, string, ChipOptions]> = [
      ['text', v.plain, {}],
      ['icon', v.filters.period, { icon: 'calendar-days' }],
      ['avatar', v.filters.person, { avatar: true }],
    ];
    return validationPage(
      context,
      page('removable'),
      inBothModes(context, () =>
        matrix(
          'nph-chip · type: removable',
          REMOVABLE_STATES.map(([state]) => state),
          NPH_CHIP_SIZES.flatMap((size) =>
            contents.map(([content, text, options]) => ({
              label: `${content} · size: ${size}`,
              cells: REMOVABLE_STATES.map(([, state]) => chip(v.removeLabel, text, { ...options, ...state, size })),
            })),
          ),
        ),
      ),
    );
  },
};

/** The status severities, which exist on a removable chip with text, by size, at rest and disabled. */
export const Severities: Story = {
  name: 'Severities',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const states: Array<[string, ChipOptions]> = [
      ['default', {}],
      ['disabled', { disabled: true }],
    ];
    return validationPage(
      context,
      page('severities'),
      inBothModes(context, () =>
        matrix(
          'nph-chip · type: removable',
          states.map(([state]) => state),
          NPH_CHIP_SEVERITIES.filter((severity) => severity !== 'default').flatMap((severity) =>
            NPH_CHIP_SIZES.map((size) => ({
              label: `severity: ${severity} · size: ${size}`,
              cells: states.map(([, state]) => chip(v.removeLabel, v.plain, { ...state, severity, size })),
            })),
          ),
        ),
      ),
    );
  },
};

/** Selectable chip × content (text, icon, counter) × size × default, disabled, selected and selected disabled. */
export const Selectable: Story = {
  name: 'Selectable',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const text = v.quick[0] as string;
    const contents: Array<[string, ChipOptions]> = [
      ['text', {}],
      ['icon', { icon: 'filter' }],
      ['counter', { counter: 12 }],
    ];
    return validationPage(
      context,
      page('selectable'),
      inBothModes(context, () =>
        matrix(
          'nph-chip · type: selectable',
          SELECTABLE_STATES.map(([state]) => state),
          NPH_CHIP_SIZES.flatMap((size) =>
            contents.map(([content, options]) => ({
              label: `${content} · size: ${size}`,
              cells: SELECTABLE_STATES.map(([, state]) => chip(v.removeLabel, text, { ...options, ...state, type: 'selectable', size })),
            })),
          ),
        ),
      ),
    );
  },
};

/** A label wider than the chip is cut with an ellipsis, in both types and both sizes. */
export const LongText: Story = {
  name: 'Long text',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('long-text'),
      inBothModes(context, () =>
        matrix(
          'nph-chip · text',
          ['type: removable', 'type: selectable'],
          NPH_CHIP_SIZES.map((size) => ({
            label: `size: ${size}`,
            cells: [
              chip(v.removeLabel, v.long, { size }),
              chip(v.removeLabel, v.long, { type: 'selectable', counter: 12, size }),
            ],
          })),
        ),
      ),
    );
  },
};

/** Invalid input draws nothing: each cell is one cause, with its own error in development. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const text = v.plain;
    const cases: Array<[string, TemplateResult]> = [
      ['type: pager', chip(v.removeLabel, text, { raw: { type: 'pager' } })],
      ['severity: critical', chip(v.removeLabel, text, { raw: { severity: 'critical' } })],
      ['icon: not in the core', chip(v.removeLabel, text, { icon: 'not-an-icon' })],
      ['icon · avatar', chip(v.removeLabel, text, { icon: 'calendar-days', avatar: true })],
      ['type: removable · counter', chip(v.removeLabel, text, { counter: 3 })],
      ['type: selectable · avatar', chip(v.removeLabel, text, { type: 'selectable', avatar: true })],
      ['severity: success · invalid', chip(v.removeLabel, text, { severity: 'success', invalid: true })],
      ['type: removable · remove-label: empty', chip('', text)],
    ];
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, () => matrix('nph-chip', ['nph-chip'], cases.map(([name, cell]) => ({ label: name, cells: [cell] })))),
    );
  },
};

/** The three mandatory examples of the documentation, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const text = examplesOf(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, () => appliedFilters(text), v.exampleFilters)}
        ${inBothModes(context, () => chosenValues(text), v.exampleField)}
        ${inBothModes(context, () => quickFilters(text), v.exampleQuick)}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the removable chip, the selectable one, the selected one and its counter. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const [pending, approved] = v.quick as string[];
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-chip', page('brands').storyId),
        () => html`${chip(v.removeLabel, v.plain)}${chip(v.removeLabel, pending as string, { type: 'selectable' })}
        ${chip(v.removeLabel, approved as string, { type: 'selectable', selected: true })}
        ${chip(v.removeLabel, pending as string, { type: 'selectable', selected: true, counter: 12 })}`,
      ),
    );
  },
};
