/**
 * VALIDATION stories of `nph-progress`.
 *
 * They prove the contract accepted in Figma (documentation frame `4385:3186`, sets `4368:1532` and
 * `4368:1185`) and P107: the three types, the two sizes, the three statuses, the optional texts, the
 * fluid width, the three required examples in light and in dark mode, in the same story, and the
 * seven brands. Each page opens with what it proves, and the matrix names its rows by attribute, as
 * on the Docs page. All visible text, including the content of the bars, comes from the language
 * dictionary, under the `progressValidation` and `validationPages` keys (`docs/i18n.md`,
 * "Storybook").
 *
 * The indicator, the end stop and the done segments are painted with the primary border, which
 * follows the brand, so the `Brands` page proves the seven brands in light and dark (DSA-36).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-progress';
import { NPH_PROGRESS_SIZES } from './nph-progress';
import { examples, inScheme } from './nph-progress.demo';
import type { Scheme } from './nph-progress.demo';

const meta: Meta = {
  title: 'Components/nph-progress/Validation',
};

export default meta;

type Story = StoryObj;

/** The counts the Steps story draws; the component takes any integer of 2 or more. */
const STEP_COUNTS = [3, 4, 5] as const;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).progressValidation;
}

/* Demo frame. Not a precedent for component CSS. */
const slot = 'inline-size: var(--nph-layout-field-width); max-inline-size: 100%;';
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';

const page = (storyId: string) => ({ piece: 'nph-progress', storyId: `components-nph-progress-validation--${storyId}` });

const inSlot = (content: TemplateResult) => html`<div style=${slot}>${content}</div>`;

/** The determinate values of the contract samples, and the two that show the end stop at the edge. */
const VALUES = [0, 25, 50, 75, 99, 100] as const;

/** The determinate bar at each value, in both sizes: the indicator, the gap and the end stop. */
export const Determinate: Story = {
  name: 'Determinate',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('determinate'),
      matrix(
        validationTitle(context, 'nph-progress', page('determinate').storyId),
        [],
        NPH_PROGRESS_SIZES.flatMap((size) =>
          VALUES.map((value) => ({
            label: `size: ${size} · value: ${value}`,
            cells: [
              inSlot(
                html`<nph-progress
                  size=${size}
                  value=${value}
                  label=${v.sampleLabel}
                  value-text=${`${value}%`}
                ></nph-progress>`,
              ),
            ],
          })),
        ),
      ),
    );
  },
};

/** The indeterminate bar loops while there is no value, in both sizes. */
export const Indeterminate: Story = {
  name: 'Indeterminate',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('indeterminate'),
      matrix(
        validationTitle(context, 'nph-progress', page('indeterminate').storyId),
        [],
        NPH_PROGRESS_SIZES.map((size) => ({
          label: `type: indeterminate · size: ${size}`,
          cells: [
            inSlot(
              html`<nph-progress
                type="indeterminate"
                size=${size}
                label=${v.preparingLabel}
                value-text=${v.preparingValue}
              ></nph-progress>`,
            ),
          ],
        })),
      ),
    );
  },
};

/** The steps bar with 3, 4 and 5 steps, in both sizes, the first one done. */
export const Steps: Story = {
  name: 'Steps',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const values = v.stepsValues as string[];
    return validationPage(
      context,
      page('steps'),
      matrix(
        validationTitle(context, 'nph-progress', page('steps').storyId),
        [],
        NPH_PROGRESS_SIZES.flatMap((size) =>
          STEP_COUNTS.map((steps, position) => ({
            label: `size: ${size} · steps: ${steps}`,
            cells: [
              inSlot(
                html`<nph-progress
                  type="steps"
                  size=${size}
                  steps=${steps}
                  step=${position + 1}
                  label=${v.signUpLabel}
                  value-text=${values[position] ?? ''}
                ></nph-progress>`,
              ),
            ],
          })),
        ),
      ),
    );
  },
};

/** Success and error bring the icon and the help text, on determinate and on steps. */
export const Status: Story = {
  name: 'Status',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('status'),
      matrix(
        validationTitle(context, 'nph-progress', page('status').storyId),
        [],
        [
          {
            label: 'type: determinate · status: success',
            cells: [
              inSlot(
                html`<nph-progress
                  status="success"
                  value="100"
                  label=${v.sampleLabel}
                  value-text=${v.doneValue}
                  help=${v.doneHelp}
                ></nph-progress>`,
              ),
            ],
          },
          {
            label: 'type: determinate · status: error',
            cells: [
              inSlot(
                html`<nph-progress
                  status="error"
                  value="100"
                  label=${v.sampleLabel}
                  value-text=${v.errorValue}
                  help=${v.errorHelp}
                ></nph-progress>`,
              ),
            ],
          },
          {
            label: 'type: steps · status: success',
            cells: [
              inSlot(
                html`<nph-progress
                  type="steps"
                  steps="4"
                  step="4"
                  status="success"
                  label=${v.signUpLabel}
                  value-text=${v.stepsDoneValue}
                  help=${v.stepsDoneHelp}
                ></nph-progress>`,
              ),
            ],
          },
          {
            label: 'type: steps · status: error',
            cells: [
              inSlot(
                html`<nph-progress
                  type="steps"
                  steps="4"
                  step="3"
                  status="error"
                  label=${v.signUpLabel}
                  value-text=${v.stepsErrorValue}
                  help=${v.stepsErrorHelp}
                ></nph-progress>`,
              ),
            ],
          },
          {
            label: 'size: sm · status: success',
            cells: [
              inSlot(
                html`<nph-progress
                  size="sm"
                  status="success"
                  value="100"
                  label=${v.sampleLabel}
                  value-text=${v.doneValue}
                  help=${v.doneHelp}
                ></nph-progress>`,
              ),
            ],
          },
          {
            label: 'size: sm · status: error',
            cells: [
              inSlot(
                html`<nph-progress
                  size="sm"
                  status="error"
                  value="100"
                  label=${v.sampleLabel}
                  value-text=${v.errorValue}
                  help=${v.errorHelp}
                ></nph-progress>`,
              ),
            ],
          },
        ],
      ),
    );
  },
};

/** The optional texts: label only, with value text, with help text, and the aria-label with no label. */
export const Texts: Story = {
  name: 'Texts',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('texts'),
      matrix(
        validationTitle(context, 'nph-progress', page('texts').storyId),
        [],
        [
          {
            label: 'label',
            cells: [inSlot(html`<nph-progress value="50" label=${v.sampleLabel}></nph-progress>`)],
          },
          {
            label: 'label · value-text',
            cells: [
              inSlot(html`<nph-progress value="50" label=${v.sampleLabel} value-text="50%"></nph-progress>`),
            ],
          },
          {
            label: 'label · value-text · help',
            cells: [
              inSlot(
                html`<nph-progress
                  value="50"
                  label=${v.sampleLabel}
                  value-text="50%"
                  help=${v.uploadHelp}
                ></nph-progress>`,
              ),
            ],
          },
          {
            label: 'aria-label',
            cells: [inSlot(html`<nph-progress value="50" aria-label=${v.ariaName}></nph-progress>`)],
          },
        ],
      ),
    );
  },
};

/** Fluid width: the bar takes the whole container and never goes below its minimum. */
export const Width: Story = {
  name: 'Width',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const [full, half, narrow] = v.widthLabels as string[];
    const widths: Array<[string, string]> = [
      [full as string, 'var(--nph-layout-field-width)'],
      [half as string, 'calc(var(--nph-layout-field-width) / 2)'],
      [narrow as string, 'var(--nph-progress-height-md)'],
    ];
    return validationPage(
      context,
      page('width'),
      matrix(
        validationTitle(context, 'nph-progress', page('width').storyId),
        [],
        widths.map(([label, size]) => ({
          label,
          cells: [
            html`<div style="inline-size: ${size}; max-inline-size: 100%;">
              <nph-progress value="50" aria-label=${v.sampleLabel}></nph-progress>
            </div>`,
          ],
        })),
      ),
    );
  },
};

/** The three required examples — an upload, a preparing and a sign-up — in light and in dark. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const modes: Array<[Scheme, string]> = [
      ['light', v.lightCaption],
      ['dark', v.darkCaption],
    ];
    return validationPage(
      context,
      page('examples'),
      html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
        ${modes.map(([scheme, caption]) => inScheme(scheme, caption, examples(v)))}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the indicator follows the primary border of the frame. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-progress', page('brands').storyId),
        () => html`<div style=${`${column} ${slot}`}>
          <nph-progress value="50" label=${v.sampleLabel} value-text="50%"></nph-progress>
          <nph-progress type="steps" steps="4" step="2" aria-label=${v.signUpLabel}></nph-progress>
        </div>`,
      ),
    );
  },
};
