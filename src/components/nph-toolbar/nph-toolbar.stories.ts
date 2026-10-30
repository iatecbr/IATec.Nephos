/**
 * VALIDATION stories of `nph-toolbar`.
 *
 * They prove the contract accepted in Figma (documentation `2944:6528`, set `2105:426`), the
 * decisions D-1 to D-5 of DSA-55 and P104: the five types in the three sizes (the fifteen
 * variants of the set); the Figma booleans `caixa de seleção`, `centro` and `limpar em ícone`;
 * the states of the pieces the bar holds (disabled and loading); the applied filters strip,
 * which a person empties chip by chip or all at once, with the focus rule and the
 * announcements; the invalid input; the three mandatory examples of the documentation; and the
 * seven brands. Every story shows the same bars in light and in dark mode, in the same story,
 * through `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover and focus belong to the pieces: they show up by moving the mouse over an action and
 * by entering the bar with Tab and moving with the arrow keys; the component test measures
 * them. Each page opens with what it proves, from the dictionary (`validationPages.claims`).
 * The example text and the captions come from the language dictionary, under the key
 * `toolbarValidation` (`docs/i18n.md`, "Storybook"); the row and column names of the matrices
 * are the technical attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { NPH_TOOLBAR_SIZES } from './nph-toolbar';
import { bulkBar, floatingBar, inScheme, pageBar, pageWithFilters, toolsBar } from './nph-toolbar.demo';
import type { Scheme, ToolbarText } from './nph-toolbar.demo';

const meta: Meta = {
  title: 'Components/nph-toolbar/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).toolbarValidation;
}

function textOf(context: GlobalsContext | undefined): ToolbarText {
  return t(context) as unknown as ToolbarText;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';

const page = (storyId: string) => ({
  piece: 'nph-toolbar',
  storyId: `components-nph-toolbar-validation--${storyId}`,
});

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, content: () => TemplateResult, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => inScheme(scheme, name === undefined ? caption : `${name} · ${caption}`, content()))}
  </div>`;
}

/** The five types × the three sizes: the fifteen variants of the set. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    const rows: Array<[string, (size: (typeof NPH_TOOLBAR_SIZES)[number]) => TemplateResult]> = [
      ['type: bulk', (size) => bulkBar(text, { size })],
      ['type: page', (size) => pageBar(text, { size })],
      ['type: tools', (size) => toolsBar(text, { size })],
      ['type: floating', (size) => floatingBar(text, { size })],
      ['type: page · applied-filters', (size) => pageWithFilters(text, { size })],
    ];
    return validationPage(
      context,
      page('matrix'),
      html`<div style=${stack}>
        ${NPH_TOOLBAR_SIZES.map((size) =>
          inBothModes(
            context,
            () =>
              matrix(
                `nph-toolbar · size: ${size}`,
                [],
                rows.map(([label, bar]) => ({ label, cells: [bar(size)] })),
              ),
            `size: ${size}`,
          ),
        )}
      </div>`,
    );
  },
};

/** The Figma booleans: the checkbox off, the center on, the clear button as an icon only. */
export const Options: Story = {
  name: 'Options',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    return validationPage(
      context,
      page('options'),
      inBothModes(context, () =>
        matrix('nph-toolbar · type: bulk', [], [
          { label: 'checkbox: on', cells: [bulkBar(text)] },
          { label: 'checkbox: off', cells: [bulkBar(text, { checkbox: false })] },
          { label: 'center: on', cells: [bulkBar(text, { center: true })] },
          { label: 'clear: icon', cells: [bulkBar(text, { clearIcon: true })] },
          { label: 'type: page · center: on', cells: [pageBar(text, { center: true })] },
          { label: 'type: floating · size: compact', cells: [floatingBar(text, { size: 'compact' })] },
        ]),
      ),
    );
  },
};

/** The states belong to the pieces: the main action disabled and loading, in the page bar. */
export const PieceStates: Story = {
  name: 'Piece states',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    return validationPage(
      context,
      page('piece-states'),
      inBothModes(context, () =>
        matrix('nph-toolbar · type: page', [], [
          { label: 'default', cells: [pageBar(text)] },
          { label: 'nph-button: disabled', cells: [pageBar(text, { createState: 'disabled' })] },
          { label: 'nph-button: loading', cells: [pageBar(text, { createState: 'loading' })] },
        ]),
      ),
    );
  },
};

/** The applied filters strip below the page bar: remove a chip or clear them all, and the focus follows the rule. */
export const AppliedFilters: Story = {
  name: 'Applied filters',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    return validationPage(
      context,
      page('applied-filters'),
      inBothModes(context, () =>
        matrix(
          'nph-toolbar · type: applied-filters',
          [],
          NPH_TOOLBAR_SIZES.map((size) => ({ label: `size: ${size}`, cells: [pageWithFilters(text, { size })] })),
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
    const action = html`<nph-button slot="end" severity="secondary" emphasis="ghost" text=${v.export}></nph-button>`;
    const cases: Array<[string, TemplateResult]> = [
      ['type: vertical', html`<nph-toolbar type="vertical" label=${v.tableActions}>${action}</nph-toolbar>`],
      ['size: small', html`<nph-toolbar size="small" label=${v.tableActions}>${action}</nph-toolbar>`],
      ['label: empty', html`<nph-toolbar>${action}</nph-toolbar>`],
    ];
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, () => matrix('nph-toolbar', ['nph-toolbar'], cases.map(([label, cell]) => ({ label, cells: [cell] })))),
    );
  },
};

/** The three mandatory examples of the documentation, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const text = textOf(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, () => bulkBar(text, { checkbox: false, count: v.countExample }), v.exampleTable)}
        ${inBothModes(context, () => pageBar(text, { center: true }), v.exampleList)}
        ${inBothModes(context, () => toolsBar(text), v.exampleEditor)}
      </div>`,
    );
  },
};

/**
 * The seven brands in light and dark (DSA-36): the bulk bar, whose background, count and action
 * hover follow the brand. Compact, with clear as an icon only, so both columns fit the page and
 * every frame is in view for the contrast check.
 */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const text = textOf(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-toolbar', page('brands').storyId), () =>
        bulkBar(text, { size: 'compact', clearIcon: true }),
      ),
    );
  },
};
