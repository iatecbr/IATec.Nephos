/**
 * VALIDATION stories of `nph-popconfirm`.
 *
 * They prove the contract accepted in Figma (documentation frame `7389:104`, set `7222:3568`): the
 * three types in the two sizes, the four sides and three alignments with the arrow, the parts that
 * turn on and off (icon and description), the actions that fit, stack or load, the mirror in
 * right-to-left writing, a popconfirm to open and close with the mouse and the keyboard, and the
 * three required examples in light and in dark mode, in the same story, and the seven brands. Each page opens with what
 * it proves, and the matrix names its rows by attribute. All visible text comes from the language
 * dictionary, under the `popconfirmValidation` and `validationPages` keys (`docs/i18n.md`,
 * "Storybook").
 *
 * The open popconfirms are opened one after the other (see `nph-popconfirm.demo.ts`). Hover, focus
 * and the Tab kept between the two buttons belong to the interaction: the tests prove them.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { NPH_POPCONFIRM_ALIGNMENTS, NPH_POPCONFIRM_SIDES, NPH_POPCONFIRM_SIZES, NPH_POPCONFIRM_TYPES } from './nph-popconfirm';
import { bothModes, cell, examples, placement, typed } from './nph-popconfirm.demo';
import type { ExampleTexts } from './nph-popconfirm.demo';

const meta: Meta = {
  title: 'Components/nph-popconfirm/Validation',
};
export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined): ExampleTexts {
  return translations(localeOf(context)).popconfirmValidation as unknown as ExampleTexts;
}

const page = (storyId: string) => ({ piece: 'nph-popconfirm', storyId: `components-nph-popconfirm-validation--${storyId}` });

/** The three types in the two sizes, with no arrow: icon, icon box, Confirm and measures change by type and size. */
export const Types: Story = {
  name: 'Types',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('types'),
      matrix(
        validationTitle(context, 'nph-popconfirm', page('types').storyId),
        [],
        NPH_POPCONFIRM_SIZES.flatMap((size) =>
          NPH_POPCONFIRM_TYPES.map((type) => ({
            label: `type: ${type} · size: ${size} · arrow: off`,
            cells: [typed(v, type, size)],
          })),
        ),
      ),
    );
  },
};

/** The four sides and three alignments, with the arrow; the type rotates by row so each one appears on every side. */
export const Placement: Story = {
  name: 'Placement',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    let row = 0;
    return validationPage(
      context,
      page('placement'),
      matrix(
        validationTitle(context, 'nph-popconfirm', page('placement').storyId),
        [],
        NPH_POPCONFIRM_SIDES.flatMap((side) =>
          NPH_POPCONFIRM_ALIGNMENTS.map((align) => {
            const type = NPH_POPCONFIRM_TYPES[row++ % NPH_POPCONFIRM_TYPES.length] ?? 'default';
            return {
              label: `type: ${type} · side: ${side} · align: ${align} · arrow: on`,
              cells: [placement(v, type, side, align)],
            };
          }),
        ),
      ),
    );
  },
};

/** The parts that turn on and off: the icon and the description; the title and the two actions are always there. */
export const Parts: Story = {
  name: 'Parts',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const base = { texts: v.destructive, cancel: v.cancel, type: 'destructive' as const };
    return validationPage(
      context,
      page('parts'),
      matrix(validationTitle(context, 'nph-popconfirm', page('parts').storyId), [], [
        { label: 'icon: on · description: on', cells: [cell({ ...base })] },
        { label: 'icon: off · description: on', cells: [cell({ ...base, icon: false })] },
        { label: 'icon: on · description: off', cells: [cell({ ...base, description: false })] },
        { label: 'icon: off · description: off', cells: [cell({ ...base, icon: false, description: false })] },
      ]),
    );
  },
};

/** The actions: side by side, stacked with Confirm on top when the labels do not fit, and Confirm loading. */
export const Actions: Story = {
  name: 'Actions',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const base = { texts: v.destructive, cancel: v.cancel, type: 'destructive' as const };
    return validationPage(
      context,
      page('actions'),
      matrix(validationTitle(context, 'nph-popconfirm', page('actions').storyId), [], [
        { label: 'actions: side by side', cells: [cell({ ...base })] },
        {
          label: 'actions: stacked, Confirm on top',
          cells: [cell({ ...base, confirmLabel: v.longConfirm, cancelLabel: v.longCancel })],
        },
        { label: 'confirm: loading', cells: [cell({ ...base, loading: true })] },
      ]),
    );
  },
};

/** In right-to-left writing, start and end follow the direction on the top and bottom sides. */
export const Direction: Story = {
  name: 'Direction',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('direction'),
      matrix(
        validationTitle(context, 'nph-popconfirm', page('direction').storyId),
        [],
        (['ltr', 'rtl'] as const).flatMap((dir) =>
          (['start', 'end'] as const).map((align) => ({
            label: `dir: ${dir} · align: ${align}`,
            cells: [
              html`<div dir=${dir} style="inline-size: 100%;">
                ${cell({ texts: v.default, cancel: v.cancel, align, arrow: true })}
              </div>`,
            ],
          })),
        ),
      ),
    );
  },
};

/** A popconfirm to try: the trigger opens it; Cancel, Esc or a press outside gives up, and Confirm loads for a moment before it closes. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('interactive'),
      matrix(validationTitle(context, 'nph-popconfirm', page('interactive').storyId), [], [
        {
          label: 'closed: open it with the trigger',
          cells: [cell({ texts: v.destructive, cancel: v.cancel, type: 'destructive', open: false, slow: true })],
        },
      ]),
    );
  },
};

/** The three required examples, in light and in dark: delete a spreadsheet, leave an editing, send for approval. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => examples(v)),
    );
  },
};

/** The seven brands in light and dark: the Confirm and its focus border follow the brand, with the popconfirm open in every frame. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-popconfirm', page('brands').storyId), () =>
        cell({ texts: v.default, cancel: v.cancel, type: 'default' }),
      ),
    );
  },
};
