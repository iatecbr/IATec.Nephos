/**
 * VALIDATION stories of `nph-tabs`.
 *
 * They prove the contract accepted in Figma (documentation frame `3483:11200`, sets `3472:9192`,
 * `3472:8748` and `3472:8747`) and P115: the five styles (segmented, underline and the solid, light
 * and outline tab button); the content a tab turns on (icon, counter and tag); the states that need
 * no pointer (active, rest, disabled, and active and disabled together); the underline list that
 * scrolls with an arrow at each end; the cut label; the mirror in right-to-left writing; the panel
 * the consumer owns; and the three required examples in light and dark mode, in the same story.
 * Each page opens with what it proves, and the matrix names its rows by attribute, as on the Docs
 * page. All visible text, including the labels of the tabs, comes from the language dictionary,
 * under the `tabsValidation` and `validationPages` keys (`docs/i18n.md`, "Storybook").
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a tab and by
 * pressing Tab and the arrows, and the tests prove their colors, lines and rings.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-tabs';
import { NPH_TABS_VARIANTS } from './nph-tabs';
import { bothModes, examples, list, longTabs, sectionTabs, stateList } from './nph-tabs.demo';
import type { ExampleTexts } from './nph-tabs.demo';

const meta: Meta = {
  title: 'Components/nph-tabs/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).tabsValidation as unknown as ExampleTexts & Record<string, unknown>;
}

const page = (storyId: string) => ({ piece: 'nph-tabs', storyId: `components-nph-tabs-validation--${storyId}` });

/** The five styles, each with the second tab active. */
export const Variants: Story = {
  name: 'Variants',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('variants'),
      matrix(
        validationTitle(context, 'nph-tabs', page('variants').storyId),
        [],
        NPH_TABS_VARIANTS.map((variant) => ({ label: `variant: ${variant}`, cells: [list(v, { variant })] })),
      ),
    );
  },
};

/** What a tab turns on: the icon, the counter and the tag, in every style. */
export const Content: Story = {
  name: 'Content',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const contents = [
      ['text only', {}],
      ['icon · counter', { icons: true, counters: true }],
      ['icon · counter · tag', { icons: true, counters: true, tag: true }],
    ] as const;
    return validationPage(
      context,
      page('content'),
      matrix(
        validationTitle(context, 'nph-tabs', page('content').storyId),
        [],
        NPH_TABS_VARIANTS.flatMap((variant) =>
          contents.map(([label, options]) => ({ label: `variant: ${variant} · ${label}`, cells: [list(v, { variant, ...options })] })),
        ),
      ),
    );
  },
};

/** Active, rest and disabled, and the active tab disabled as well, which keeps its active look. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      matrix(
        validationTitle(context, 'nph-tabs', page('states').storyId),
        [],
        NPH_TABS_VARIANTS.flatMap((variant) => [
          { label: `variant: ${variant} · state: active, rest, disabled`, cells: [stateList(v, variant, false)] },
          { label: `variant: ${variant} · state: active + disabled`, cells: [stateList(v, variant, true)] },
        ]),
      ),
    );
  },
};

/** The underline list scrolls when the tabs do not fit: each tab keeps its width and an arrow sits at each end. */
export const Scroll: Story = {
  name: 'Scroll',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('scroll'),
      matrix(
        validationTitle(context, 'nph-tabs', page('scroll').storyId),
        [],
        [
          {
            label: 'variant: underline · tabs: do not fit',
            cells: [list(v, { variant: 'underline', tabs: sectionTabs(v), value: 'section-0', width: 'calc(var(--nph-layout-field-width) * 1.25)' })],
          },
          {
            label: 'variant: underline · tabs: fit',
            cells: [list(v, { variant: 'underline', tabs: sectionTabs(v).slice(0, 4), value: 'section-0' })],
          },
        ],
      ),
    );
  },
};

/** In the segmented and tab button styles a label that does not fit is cut, with its whole text in a balloon. */
export const CutLabel: Story = {
  name: 'CutLabel',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('cut-label'),
      matrix(
        validationTitle(context, 'nph-tabs', page('cut-label').storyId),
        [],
        (['segmented', 'solid'] as const).map((variant) => ({
          label: `variant: ${variant} · label: cut`,
          cells: [list(v, { variant, tabs: longTabs(v), value: 'long-1', width: 'var(--nph-layout-field-width)' })],
        })),
      ),
    );
  },
};

/** The panel is the consumer's: each tab has its slot, and only the panel of the active tab shows. */
export const Panels: Story = {
  name: 'Panels',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('panels'),
      matrix(
        validationTitle(context, 'nph-tabs', page('panels').storyId),
        [],
        (['segmented', 'underline'] as const).map((variant) => ({
          label: `variant: ${variant} · panel: slot`,
          cells: [list(v, { variant, panels: true, value: 'review' })],
        })),
      ),
    );
  },
};

/** In right-to-left writing the list reads from the right and the arrows keep the side of their end. */
export const Direction: Story = {
  name: 'Direction',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('direction'),
      matrix(
        validationTitle(context, 'nph-tabs', page('direction').storyId),
        [],
        (['ltr', 'rtl'] as const).flatMap((dir) => [
          { label: `dir: ${dir} · variant: segmented`, cells: [html`<div dir=${dir}>${list(v, { variant: 'segmented', icons: true, counters: true })}</div>`] },
          {
            label: `dir: ${dir} · variant: underline`,
            cells: [
              html`<div dir=${dir}>
                ${list(v, { variant: 'underline', tabs: sectionTabs(v), value: 'section-1', width: 'calc(var(--nph-layout-field-width) * 1.25)' })}
              </div>`,
            ],
          },
        ]),
      ),
    );
  },
};

/** The three required examples — requests by step, the detail inside a panel and the arrows at both ends — in light and in dark. */
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

/** The seven brands in light and dark (DSA-36): the active label, the line and the focus follow the brand. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-tabs', page('brands').storyId),
        () => html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
          ${list(v, { variant: 'segmented', icons: true, counters: true, tag: true })}
          ${list(v, { variant: 'underline', icons: true, counters: true, tag: true })}
          ${list(v, { variant: 'solid', counters: true, tag: true })} ${list(v, { variant: 'light', counters: true, tag: true })}
          ${list(v, { variant: 'outline', counters: true, tag: true })}
        </div>`,
      ),
    );
  },
};
