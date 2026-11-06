/**
 * VALIDATION stories of `nph-notification`.
 *
 * Each story proves a part of the contract accepted in Figma (frame `3442:10163`, set
 * `3434:9035`, focus of the close on solid `4207:1146`) and of P108: the six severities and the
 * loading toast, the subtle and solid emphases, the stacked and single-line layouts and the
 * reflow, the actions and the close, the toast and its region, the time bar and the invalid input.
 * Every story shows light and dark mode side by side. The titles, descriptions and action texts
 * are content and arrive ready from the application. They come from the language dictionary,
 * under the `notificationValidation` key (`docs/i18n.md`, "Storybook"). The page of each story
 * says what it proves.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { STATIC_SEVERITIES, bothModes, column, formArea, notification, toastRegion } from './nph-notification.demo';
import type { NotificationText } from './nph-notification.demo';
import type { NphNotificationSeverity } from './nph-notification';

const meta: Meta = {
  title: 'Components/nph-notification/Validation',
};

export default meta;

type Story = StoryObj;

type Dictionary = ReturnType<typeof translations>['notificationValidation'];

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined): Dictionary {
  return translations(localeOf(context)).notificationValidation;
}

function frame(context: GlobalsContext | undefined, storyId: string, content: TemplateResult): TemplateResult {
  return validationPage(context, { piece: 'nph-notification', storyId: `components-nph-notification-validation--${storyId}` }, content);
}

function caption(text: string): TemplateResult {
  return html`<p
    style="margin: 0; font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height); color: var(--nph-color-muted-foreground);"
  >
    ${text}
  </p>`;
}

/** The text of a severity: its title and description, plus the close name every example takes. */
function textOf(v: Dictionary, severity: NphNotificationSeverity): NotificationText {
  const sample = v.samples[severity];
  return { heading: sample.heading, description: sample.description, closeLabel: v.close };
}

/** The six severities with a drawing of their own, one under the other, subtle, as inline notifications. */
export const Severities: Story = {
  name: 'Severities',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'severities',
      html`${caption(v.severitiesCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          column(STATIC_SEVERITIES.map((severity) => notification({ ...textOf(v, severity), severity }))),
        )}`,
    );
  },
};

/** Subtle and solid, in each of the six severities. Solid has no border and no actions. */
export const Emphasis: Story = {
  name: 'Emphasis',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'emphasis',
      html`${caption(v.emphasisCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          column(STATIC_SEVERITIES.map((severity) => notification({ ...textOf(v, severity), severity, emphasis: 'solid' }))),
        )}`,
    );
  },
};

/** Stacked, single-line and a single-line that does not fit, which reflows to stacked. */
export const Layouts: Story = {
  name: 'Layouts',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const sample = textOf(v, 'info');
    return frame(
      context,
      'layouts',
      html`${caption(v.layoutsCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          column([
            notification({ ...sample, layout: 'stacked', action: v.action, secondaryAction: v.secondaryAction }),
            notification({ ...textOf(v, 'success'), heading: v.shortHeading, description: v.shortDescription, layout: 'single-line', action: v.action }),
            notification({ ...sample, layout: 'single-line', action: v.action, description: v.longDescription }),
            notification({ layout: 'single-line', description: v.noHeadingDescription, closeLabel: v.close }),
          ]),
        )}`,
    );
  },
};

/** The main action in the type of the severity and the secondary one in ghost, in every severity. */
export const Actions: Story = {
  name: 'Actions',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'actions',
      html`${caption(v.actionsCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          column(
            STATIC_SEVERITIES.map((severity) =>
              notification({ ...textOf(v, severity), severity, action: v.action, secondaryAction: v.secondaryAction }),
            ),
          ),
        )}`,
    );
  },
};

/** The close button: on, off, and on solid, where hover and focus change. */
export const Close: Story = {
  name: 'Close',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'close',
      html`${caption(v.closeCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          column([
            notification({ ...textOf(v, 'error'), severity: 'error' }),
            notification({ ...textOf(v, 'error'), severity: 'error', hideClose: true }),
            notification({ ...textOf(v, 'error'), severity: 'error', emphasis: 'solid' }),
            notification({ ...textOf(v, 'neutral'), severity: 'neutral', emphasis: 'solid' }),
          ]),
        )}`,
    );
  },
};

/** The toast, stacked and single-line, with its elevation, which has no shadow in dark mode. */
export const Toast: Story = {
  name: 'Toast',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'toast',
      html`${caption(v.toastCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          column([
            notification({ ...textOf(v, 'success'), placement: 'toast', severity: 'success', duration: 0 }),
            notification({ ...textOf(v, 'success'), heading: v.shortHeading, description: v.shortDescription, placement: 'toast', severity: 'success', layout: 'single-line', duration: 0 }),
            notification({ ...textOf(v, 'error'), placement: 'toast', severity: 'error', action: v.retry }),
            notification({ ...textOf(v, 'loading'), placement: 'toast', severity: 'loading', hideClose: true }),
          ]),
        )}`,
    );
  },
};

/** The time bar, only on a subtle toast that closes by itself. Every toast here stays: `duration` is 0. */
export const TimeBar: Story = {
  name: 'Time bar',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'time-bar',
      html`${caption(v.timeBarCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          column([
            notification({ ...textOf(v, 'info'), placement: 'toast', severity: 'info', timeBar: true, duration: 60000 }),
            notification({ ...textOf(v, 'success'), placement: 'toast', severity: 'success', timeBar: true, duration: 60000 }),
          ]),
        )}`,
    );
  },
};

/** The toast region frame: the column a consuming application builds, with up to three toasts. */
export const Region: Story = {
  name: 'Region',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'region',
      html`${caption(v.regionCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          toastRegion(
            [
              notification({ ...textOf(v, 'loading'), placement: 'toast', severity: 'loading', hideClose: true }),
              notification({ ...textOf(v, 'success'), placement: 'toast', severity: 'success', duration: 0 }),
              notification({ ...textOf(v, 'error'), placement: 'toast', severity: 'error', action: v.retry }),
            ],
            v.regionLabel,
          ),
        )}`,
    );
  },
};

/** The three required examples: an inline error with an action in a form area, a success toast and a loading toast. */
export const RequiredExamples: Story = {
  name: 'Required examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'required-examples',
      html`${caption(v.requiredCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          column([
            formArea(
              notification({ ...textOf(v, 'error'), severity: 'error', action: v.retry }),
              [v.fieldName, v.fieldEmail],
            ),
            notification({ ...textOf(v, 'success'), placement: 'toast', severity: 'success', duration: 0 }),
            notification({ ...textOf(v, 'loading'), placement: 'toast', severity: 'loading', hideClose: true }),
          ]),
        )}`,
    );
  },
};

/** The notification sits on color/background and on color/popover: its own surfaces keep the contrast. */
export const Surfaces: Story = {
  name: 'Surfaces',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const sample = (): TemplateResult =>
      column(STATIC_SEVERITIES.slice(0, 3).map((severity) => notification({ ...textOf(v, severity), severity })));
    return frame(
      context,
      'surfaces',
      html`${caption(v.backgroundCaption)} ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, sample)}
        ${caption(v.popoverCaption)} ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, sample, '--nph-color-popover')}`,
    );
  },
};

/** The time bar with an action is blocked: nothing is drawn in either mode and the console shows an error in development. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'invalid-input',
      html`${caption(v.invalidCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          notification({ ...textOf(v, 'info'), placement: 'toast', severity: 'info', action: v.action, timeBar: true }),
        )}`,
    );
  },
};

/**
 * The seven brands in light and dark: the parts that follow the brand are the arc of the loading
 * toast (`color/primary`) and the neutral secondary action (`color/primary-on-surface` and
 * `color/primary-surface`).
 */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'brands',
      brandFrames(validationTitle(context, 'nph-notification', 'components-nph-notification-validation--brands'), () =>
        column([
          notification({ ...textOf(v, 'neutral'), severity: 'neutral', action: v.action, secondaryAction: v.secondaryAction }),
          notification({ ...textOf(v, 'loading'), placement: 'toast', severity: 'loading', hideClose: true }),
        ]),
      ),
    );
  },
};
