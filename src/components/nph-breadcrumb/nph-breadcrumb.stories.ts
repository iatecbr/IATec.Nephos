/**
 * VALIDATION stories of `nph-breadcrumb`.
 *
 * They prove the contract accepted in Figma (documentation frame `4512:4741`, sets `4490:2886`,
 * `4490:2678` and `4490:2697`, separator `1635:16`) and P109: the trail of 2, 3 and 4 levels, with
 * and without icons; the collapsed trail with the ellipsis and the menu of the hidden levels open;
 * the width of that menu between its floor and its ceiling; the mirror in right-to-left writing;
 * the line `nph-skeleton` that takes the place of the trail while the page loads; and the three
 * required examples in light and in dark mode, in the same story. Each page opens with what it
 * proves, and the matrix names its rows by attribute, as on the Docs page. All visible text,
 * including the levels of the trails, comes from the language dictionary, under the
 * `breadcrumbValidation` and `validationPages` keys (`docs/i18n.md`, "Storybook").
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a link or the
 * ellipsis and by pressing Tab, and the tests prove their colors and rings. The open state of the
 * ellipsis is the open menu, drawn on the collapsed pages.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import '../nph-skeleton/nph-skeleton';
import './nph-breadcrumb';
import type { NphBreadcrumbLevel } from './nph-breadcrumb';
import { bothModes, collapsedTrail, examples, levelsOf, trail } from './nph-breadcrumb.demo';
import type { ExampleTexts } from './nph-breadcrumb.demo';

const meta: Meta = {
  title: 'Components/nph-breadcrumb/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).breadcrumbValidation;
}

const page = (storyId: string) => ({ piece: 'nph-breadcrumb', storyId: `components-nph-breadcrumb-validation--${storyId}` });

/** The trail of 2, 3 and 4 levels, each without and with icons. */
export const Levels: Story = {
  name: 'Levels',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const counts = [2, 3, 4] as const;
    return validationPage(
      context,
      page('levels'),
      matrix(
        validationTitle(context, 'nph-breadcrumb', page('levels').storyId),
        [],
        counts.flatMap((count) =>
          [false, true].map((icons) => ({
            label: `levels: ${count} · icons: ${icons ? 'on' : 'off'}`,
            cells: [trail(v as ExampleTexts, count, icons)],
          })),
        ),
      ),
    );
  },
};

/** The collapsed trail: the first level, the ellipsis and the last two, with the menu of the hidden levels open. */
export const Collapsed: Story = {
  name: 'Collapsed',
  render: (_args, context: GlobalsContext) => {
    const v = t(context) as ExampleTexts;
    return validationPage(
      context,
      page('collapsed'),
      matrix(
        validationTitle(context, 'nph-breadcrumb', page('collapsed').storyId),
        [],
        [false, true].map((icons) => ({
          label: `levels: collapsed · icons: ${icons ? 'on' : 'off'}`,
          cells: [collapsedTrail(v, { icons, open: true })],
        })),
      ),
    );
  },
};

/** The hidden levels menu hugs its widest option between the floor and the ceiling, and cuts a longer text. */
export const MenuWidth: Story = {
  name: 'MenuWidth',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const texts = v as ExampleTexts;
    /** Home, the hidden levels, then the last two: the labels given are the ones in the menu. */
    const withHidden = (labels: string[]): NphBreadcrumbLevel[] => [
      { label: texts.home, href: '#home' },
      ...labels.map((label, index) => ({ label, href: `#hidden-${String(index)}` })),
      { label: texts.navigation, href: '#navigation' },
      { label: texts.breadcrumb },
    ];
    const widths: Array<[string, string[]]> = [
      ['menu: floor', v.menuFloor as string[]],
      ['menu: hugs the widest option', v.menuHug as string[]],
      ['menu: ceiling', v.menuCeiling as string[]],
    ];
    return validationPage(
      context,
      page('menu-width'),
      matrix(
        validationTitle(context, 'nph-breadcrumb', page('menu-width').storyId),
        [],
        widths.map(([label, labels]) => ({
          label,
          cells: [collapsedTrail(texts, { open: true, levels: withHidden(labels), rows: labels.length })],
        })),
      ),
    );
  },
};

/** In right-to-left writing the separator mirrors and the trail reads from the right. */
export const Direction: Story = {
  name: 'Direction',
  render: (_args, context: GlobalsContext) => {
    const texts = t(context) as ExampleTexts;
    return validationPage(
      context,
      page('direction'),
      matrix(
        validationTitle(context, 'nph-breadcrumb', page('direction').storyId),
        [],
        (['ltr', 'rtl'] as const).map((dir) => ({
          label: `dir: ${dir}`,
          cells: [
            html`<div dir=${dir}>
              <nph-breadcrumb .levels=${levelsOf(texts, 4, true)} label=${texts.navLabel}></nph-breadcrumb>
            </div>`,
          ],
        })),
      ),
    );
  },
};

/** While the page loads, a line `nph-skeleton` takes the place of the trail: the piece has no loading state. */
export const Loading: Story = {
  name: 'Loading',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const texts = v as ExampleTexts;
    return validationPage(
      context,
      page('loading'),
      matrix(
        validationTitle(context, 'nph-breadcrumb', page('loading').storyId),
        [],
        [
          {
            label: 'loading: line nph-skeleton',
            cells: [
              html`<div aria-busy="true" style="inline-size: calc(var(--nph-layout-field-width) / 2); max-inline-size: 100%;">
                <nph-skeleton shape="line"></nph-skeleton>
              </div>`,
            ],
          },
          {
            label: 'loaded: nph-breadcrumb',
            cells: [trail(texts, 3)],
          },
        ],
      ),
    );
  },
};

/** The three required examples — two levels, four levels with icons and a long collapsed trail — in light and in dark. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => examples(v as ExampleTexts)),
    );
  },
};

/** The seven brands in light and dark (DSA-36): the focus border and halo of the link and the ellipsis follow the brand. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const texts = t(context) as ExampleTexts;
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-breadcrumb', page('brands').storyId),
        () => html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
          ${trail(texts, 4, true)} ${collapsedTrail(texts)}
        </div>`,
      ),
    );
  },
};
