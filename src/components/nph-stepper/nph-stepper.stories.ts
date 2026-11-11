/**
 * VALIDATION stories of `nph-stepper`.
 *
 * They prove the contract accepted in Figma (documentation frame `5569:6530`, sets `5541:1622` and
 * `5540:581`) and P117: the four statuses (completed, current, pending and error) and the counts of
 * steps (two to seven); what a step turns on (the support line and "Optional"); the disabled steps and
 * the combined states; the linear and the non-linear stepper; the cut label, the current label that
 * wraps and the description of two lines; the narrow width, where the stepper becomes `nph-progress`;
 * and the three required examples in light and dark mode, in the same story. Each page opens with what
 * it proves, and the matrix names its rows by attribute, as on the Docs page. All visible text,
 * including the labels of the steps, comes from the language dictionary, under the `stepperValidation`
 * and `validationPages` keys (`docs/i18n.md`, "Storybook").
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a step and by pressing
 * Tab, and the tests prove their colors, underline and rings.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-stepper';
import {
  MATRIX_WIDTH,
  NARROW_WIDTH,
  bothModes,
  contentSteps,
  disabledSteps,
  errorSteps,
  examples,
  formExample,
  longSteps,
  nonLinearSteps,
  signUpSteps,
  stepper,
} from './nph-stepper.demo';
import type { ExampleTexts } from './nph-stepper.demo';

const meta: Meta = {
  title: 'Components/nph-stepper/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).stepperValidation as unknown as ExampleTexts & Record<string, unknown>;
}

const page = (storyId: string) => ({ piece: 'nph-stepper', storyId: `components-nph-stepper-validation--${storyId}` });

/** The four statuses: completed, current, pending and the step with an error, in one stepper and one by one. */
export const Statuses: Story = {
  name: 'Statuses',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('statuses'),
      matrix(validationTitle(context, 'nph-stepper', page('statuses').storyId), [], [
        { label: 'status: completed, current, pending', cells: [stepper(v, { current: 2, width: MATRIX_WIDTH })] },
        { label: 'status: completed, error, current, pending', cells: [stepper(v, { steps: errorSteps(v), current: 3, width: MATRIX_WIDTH })] },
        { label: 'status: completed, completed, current', cells: [stepper(v, { steps: signUpSteps(v).slice(0, 3), current: 3, width: MATRIX_WIDTH })] },
        { label: 'status: current, pending', cells: [stepper(v, { current: 1, width: MATRIX_WIDTH })] },
      ]),
    );
  },
};

/** From two to seven steps: two are allowed, the documentation asks for three to seven and seven is the maximum. */
export const Counts: Story = {
  name: 'Counts',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const labels = [v.account, v.address, v.payment, v.review, ...v.threeSteps];
    return validationPage(
      context,
      page('counts'),
      matrix(
        validationTitle(context, 'nph-stepper', page('counts').storyId),
        [],
        [2, 3, 4, 5, 6, 7].map((count) => ({
          label: `steps: ${String(count)}`,
          cells: [
            stepper(v, {
              steps: labels.slice(0, count).map((label) => ({ label })),
              current: Math.min(2, count),
              width: MATRIX_WIDTH,
            }),
          ],
        })),
      ),
    );
  },
};

/** What a step turns on: the support line and the word "Optional", and the reason on a step with an error. */
export const Content: Story = {
  name: 'Content',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('content'),
      matrix(validationTitle(context, 'nph-stepper', page('content').storyId), [], [
        { label: 'description · optional', cells: [stepper(v, { steps: contentSteps(v), current: 2, width: MATRIX_WIDTH })] },
        { label: 'description: reason of the error', cells: [stepper(v, { steps: errorSteps(v), current: 3, width: MATRIX_WIDTH })] },
        { label: 'description: off', cells: [stepper(v, { steps: signUpSteps(v), current: 2, width: MATRIX_WIDTH })] },
      ]),
    );
  },
};

/** Disabled steps, and the combined states: completed + disabled keeps its look and error + disabled goes back to pending. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      matrix(validationTitle(context, 'nph-stepper', page('states').storyId), [], [
        { label: 'state: disabled · status: completed, pending, error', cells: [stepper(v, { steps: disabledSteps(v), current: 2, width: MATRIX_WIDTH })] },
        {
          label: 'state: disabled · status: error · description: on',
          cells: [stepper(v, { steps: disabledSteps(v, { reason: true }), current: 2, width: MATRIX_WIDTH })],
        },
      ]),
    );
  },
};

/** Linear by default: the completed steps and the steps with an error go back. Non-linear: the pending steps too. */
export const Navigation: Story = {
  name: 'Navigation',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('navigation'),
      matrix(validationTitle(context, 'nph-stepper', page('navigation').storyId), [], [
        { label: 'non-linear: off', cells: [stepper(v, { steps: errorSteps(v), current: 3, width: MATRIX_WIDTH })] },
        { label: 'non-linear: on · state: disabled', cells: [stepper(v, { steps: nonLinearSteps(v), current: 3, nonLinear: true, width: MATRIX_WIDTH })] },
      ]),
    );
  },
};

/** The text column stops at its maximum: a label is cut with its whole text in a balloon, the current one wraps. */
export const Width: Story = {
  name: 'Width',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('width'),
      matrix(validationTitle(context, 'nph-stepper', page('width').storyId), [], [
        { label: 'label: cut', cells: [stepper(v, { steps: longSteps(v), current: 4, width: '60rem' })] },
        { label: 'label: wraps · status: current', cells: [stepper(v, { steps: longSteps(v), current: 1, width: '60rem' })] },
        { label: 'connector: minimum width', cells: [stepper(v, { steps: longSteps(v), current: 4, width: MATRIX_WIDTH })] },
      ]),
    );
  },
};

/** Below 600 px of its own width the stepper becomes `nph-progress` of the steps type, with "Step 2 of 4" and the current label. */
export const Narrow: Story = {
  name: 'Narrow',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('narrow'),
      matrix(validationTitle(context, 'nph-stepper', page('narrow').storyId), [], [
        { label: 'width: 20rem', cells: [stepper(v, { current: 2, width: NARROW_WIDTH })] },
        { label: 'width: 20rem · steps: 7', cells: [stepper(v, { steps: [...signUpSteps(v), ...v.threeSteps.map((label) => ({ label }))], current: 5, width: NARROW_WIDTH })] },
        { label: 'width: 40rem', cells: [stepper(v, { current: 2, width: MATRIX_WIDTH })] },
      ]),
    );
  },
};

/** The stepper at the top of a form inside a card; the content of the current step comes right below it. */
export const Form: Story = {
  name: 'Form',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('form'),
      matrix(validationTitle(context, 'nph-stepper', page('form').storyId), [], [
        { label: 'container: card', cells: [html`<div style="inline-size: ${MATRIX_WIDTH};">${formExample(v)}</div>`] },
      ]),
    );
  },
};

/** The three required examples — the sign-up, the step with an error and the linear stepper — in light and in dark. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      bothModes({ light: v.lightCaption as string, dark: v.darkCaption as string }, () => examples(v)),
    );
  },
};

/** The seven brands in light and dark: the ring, the number, the check and the connector follow the brand. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-stepper', page('brands').storyId),
        () => html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
          ${stepper(v, { current: 2, width: MATRIX_WIDTH })} ${stepper(v, { steps: errorSteps(v), current: 3, width: MATRIX_WIDTH })}
        </div>`,
      ),
    );
  },
};
