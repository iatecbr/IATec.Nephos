/**
 * VALIDATION stories of `nph-toast-region`.
 *
 * Each story proves a part of the contract accepted in Figma (documentation frame `7819:4737`, set
 * `7689:288`) and of the sheet `fichas/nph-toast-region.md`: the column of one, two and three toasts on
 * the default and on the compact screen, the real region fixed to the corner with a queue behind the
 * third toast, the mirror in right-to-left writing, and the three required examples. The column
 * stories show light and dark mode side by side. All visible text, including the sample content of the
 * toasts, comes from the language dictionary, under the `toastRegionValidation` and `validationPages`
 * keys (`docs/i18n.md`, "Storybook").
 *
 * The real region lives in the top layer, fixed to the corner of the window, so it cannot sit next to
 * other examples: the column stories draw the same column on an example screen in skeleton, with the
 * same tokens, and the `Live` story mounts the piece itself. F6, Esc, the pause and the announcement
 * are interaction states: the tests prove them.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { bothModes, notification } from '../nph-notification/nph-notification.demo';
import type { NotificationText } from '../nph-notification/nph-notification.demo';
import { exampleScreen, liveRegion } from './nph-toast-region.demo';
import type { Screen } from './nph-toast-region.demo';

const meta: Meta = {
  title: 'Components/nph-toast-region/Validation',
};

export default meta;

type Story = StoryObj;

type Dictionary = ReturnType<typeof translations>['toastRegionValidation'];

type Sample = 'info' | 'success' | 'error' | 'loading' | 'queuedA' | 'queuedB';

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined): Dictionary {
  return translations(localeOf(context)).toastRegionValidation;
}

const page = (storyId: string) => ({ piece: 'nph-toast-region', storyId: `components-nph-toast-region-validation--${storyId}`, sheet: true });

function caption(text: string): TemplateResult {
  return html`<p
    style="margin: 0; font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height); color: var(--nph-color-muted-foreground);"
  >
    ${text}
  </p>`;
}

function textOf(v: Dictionary, sample: Sample): NotificationText {
  const { heading, description } = v.samples[sample];
  return { heading, description, closeLabel: v.close };
}

/** The toast of a sample, in the placement and the severity of the Figma examples. */
function toast(v: Dictionary, sample: Sample): TemplateResult {
  switch (sample) {
    case 'error':
      return notification({ ...textOf(v, sample), placement: 'toast', severity: 'error', action: v.action });
    case 'loading':
      return notification({ ...textOf(v, sample), placement: 'toast', severity: 'loading', hideClose: true });
    case 'success':
      return notification({ ...textOf(v, sample), placement: 'toast', severity: 'success', duration: 0 });
    default:
      return notification({ ...textOf(v, sample), placement: 'toast', severity: 'info', duration: 0 });
  }
}

function stack(v: Dictionary, screen: Screen, samples: Sample[]): TemplateResult {
  return exampleScreen(
    screen,
    samples.map((sample) => toast(v, sample)),
    v.regionLabel,
  );
}

/** The column of one, two and three toasts, on the default screen and on the compact one, in light and dark. */
export const Quantities: Story = {
  name: 'Quantities',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const rows: { screen: Screen; samples: Sample[] }[] = [
      { screen: 'default', samples: ['info'] },
      { screen: 'default', samples: ['info', 'success'] },
      { screen: 'default', samples: ['info', 'success', 'error'] },
      { screen: 'compact', samples: ['info'] },
      { screen: 'compact', samples: ['info', 'success'] },
      { screen: 'compact', samples: ['info', 'success', 'error'] },
    ];
    return validationPage(
      context,
      page('quantities'),
      matrix(
        validationTitle(context, 'nph-toast-region', page('quantities').storyId),
        [],
        rows.map(({ screen, samples }) => ({
          label: `screen: ${screen} · quantity: ${String(samples.length)}`,
          cells: [bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => stack(v, screen, samples))],
        })),
      ),
    );
  },
};

/** The real region at the corner of the window: three toasts in view, the newest next to the corner, and two waiting in the queue. */
export const Live: Story = {
  name: 'Live',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('live'),
      html`${caption(v.liveCaption)}
        ${liveRegion(
          (['loading', 'success', 'error', 'queuedA', 'queuedB'] as Sample[]).map((sample) => toast(v, sample)),
          v.regionLabel,
        )}`,
    );
  },
};

/** In right-to-left writing the end edge is the left one: the toasts end on the left. */
export const Direction: Story = {
  name: 'Direction',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('direction'),
      matrix(
        validationTitle(context, 'nph-toast-region', page('direction').storyId),
        [],
        (['ltr', 'rtl'] as const).map((dir) => ({
          label: `dir: ${dir}`,
          cells: [html`<div dir=${dir}>${stack(v, 'default', ['info', 'success', 'error'])}</div>`],
        })),
      ),
    );
  },
};

/** The three required examples: an export in the queue, three notices in a row, and a save in progress. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const examples: { label: string; samples: Sample[] }[] = [
      { label: 'a', samples: ['info'] },
      { label: 'b', samples: ['info', 'success', 'error'] },
      { label: 'c', samples: ['loading', 'success', 'error'] },
    ];
    return validationPage(
      context,
      page('examples'),
      matrix(
        validationTitle(context, 'nph-toast-region', page('examples').storyId),
        [],
        examples.map(({ label, samples }) => ({
          label,
          cells: [bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => stack(v, 'default', samples))],
        })),
      ),
    );
  },
};
