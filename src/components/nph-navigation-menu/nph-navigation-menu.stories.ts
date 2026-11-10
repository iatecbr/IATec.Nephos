/**
 * VALIDATION stories of `nph-navigation-menu`.
 *
 * They prove the contract accepted in Figma (documentation frame `3977:7913`, sets `3969:7897`,
 * `3957:6662` and `3957:6722`) and P110: the closed bar, with a trigger, a link and a disabled item;
 * the panel of a trigger open, with one group and with two labeled groups separated by a vertical
 * `nph-separator`; the current page marked by more than color, on a top link and on a panel link; the
 * narrow width with the Menu button open and the vertical list, with its rows collapsed and with one
 * row open; the mirror in right-to-left writing;
 * a long title and description cut on one line; and the three required examples in light and in dark
 * mode, in the same story. Each page opens with what it proves, and the matrix names its rows by
 * attribute, as on the Docs page. All visible text, including the labels of the bars, comes from the
 * language dictionary, under the `navigationMenuValidation` and `validationPages` keys
 * (`docs/i18n.md`, "Storybook").
 *
 * Hover and focus are interaction states: they show up by moving the mouse over an item and by
 * pressing Tab, and the tests prove their colors and rings. The open state is the open panel, drawn
 * on the pages that open one.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-navigation-menu';
import { bar, bothModes, examples } from './nph-navigation-menu.demo';
import type { ExampleTexts } from './nph-navigation-menu.demo';

const meta: Meta = {
  title: 'Components/nph-navigation-menu/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).navigationMenuValidation as unknown as ExampleTexts;
}

const page = (storyId: string) => ({ piece: 'nph-navigation-menu', storyId: `components-nph-navigation-menu-validation--${storyId}` });

/** The closed bar, with the top item as a link, as a trigger and disabled. */
export const Bar: Story = {
  name: 'Bar',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('bar'),
      matrix(validationTitle(context, 'nph-navigation-menu', page('bar').storyId), [], [
        { label: 'width: wide · open: no', cells: [bar(v)] },
        { label: 'width: wide · open: no · item: disabled', cells: [bar(v, { disabled: true })] },
      ]),
    );
  },
};

/** The panel of a trigger open: one group, and two labeled groups with the vertical separator. */
export const Panel: Story = {
  name: 'Panel',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('panel'),
      matrix(validationTitle(context, 'nph-navigation-menu', page('panel').storyId), [], [
        { label: 'width: wide · open: yes · groups: 1', cells: [bar(v, { open: 'resources', rows: 3 })] },
        { label: 'width: wide · open: yes · groups: 2', cells: [bar(v, { open: 'products', rows: 3 })] },
      ]),
    );
  },
};

/** The current page: on a top link and on a panel link (with the trigger that holds it as current too). */
export const Current: Story = {
  name: 'Current',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('current'),
      matrix(validationTitle(context, 'nph-navigation-menu', page('current').storyId), [], [
        { label: 'state: current · item: link', cells: [bar(v, { current: 'pricing' })] },
        { label: 'state: current · item: trigger and panel link', cells: [bar(v, { current: 'components', open: 'products', rows: 3 })] },
      ]),
    );
  },
};

/** The narrow width: the Menu button, closed, and with the vertical list open: every row collapsed, and one row open. */
export const Narrow: Story = {
  name: 'Narrow',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('narrow'),
      matrix(validationTitle(context, 'nph-navigation-menu', page('narrow').storyId), [], [
        { label: 'width: narrow · open: no', cells: [bar(v, { narrow: true })] },
        { label: 'width: narrow · open: yes · row: collapsed', cells: [bar(v, { narrow: true, current: 'components', listOpen: true, rows: 3 })] },
        { label: 'width: narrow · open: yes · row: open', cells: [bar(v, { narrow: true, current: 'components', listOpen: true, rowOpen: 'products', rows: 9 })] },
      ]),
    );
  },
};

/** A long title and description are cut on one line inside the panel link. */
export const LongText: Story = {
  name: 'LongText',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('long-text'),
      matrix(validationTitle(context, 'nph-navigation-menu', page('long-text').storyId), [], [
        {
          label: 'text: long title and description',
          cells: [
            html`<div style="min-block-size: calc(var(--nph-control-height-default) + 4 * var(--nph-icon-size-md) + var(--nph-space-section));">
              <nph-navigation-menu
                label=${v.navLabel}
                .items=${[
                  {
                    type: 'trigger',
                    label: v.products,
                    groups: [{ links: [{ title: v.longTitle, href: '#long', description: v.longDescription, icon: 'file' }] }],
                  },
                ]}
                open
              ></nph-navigation-menu>
            </div>`,
          ],
        },
      ]),
    );
  },
};

/** In right-to-left writing the bar reads from the right and the panel opens from the start edge. */
export const Direction: Story = {
  name: 'Direction',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('direction'),
      matrix(
        validationTitle(context, 'nph-navigation-menu', page('direction').storyId),
        [],
        (['ltr', 'rtl'] as const).map((dir) => ({
          label: `dir: ${dir}`,
          cells: [html`<div dir=${dir}>${bar(v, { current: 'components', open: 'products', rows: 3 })}</div>`],
        })),
      ),
    );
  },
};

/** The three required examples — the closed bar, an open trigger and the narrow width — in light and in dark. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context) as ExampleTexts & { lightCaption: string; darkCaption: string };
    return validationPage(
      context,
      page('examples'),
      bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => examples(v)),
    );
  },
};

/**
 * The seven brands in light and dark (DSA-36): the focus border and halo of the items follow the brand.
 * It carries no contrast exception: the current item is painted in `navigation-menu/current-foreground`,
 * which is `color/primary-text`, at least 4.5:1 over the bar in the seven brands and both schemes, so
 * the axe `color-contrast` check runs on it.
 */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-navigation-menu', page('brands').storyId),
        () => html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
          ${bar(v, { current: 'pricing' })} ${bar(v, { narrow: true })}
        </div>`,
      ),
    );
  },
};
