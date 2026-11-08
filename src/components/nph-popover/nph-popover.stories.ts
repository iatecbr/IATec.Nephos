/**
 * VALIDATION stories of `nph-popover`.
 *
 * They prove the contract accepted in Figma (documentation frame `4749:5857`, set `4727:1544`) and
 * P111: the four sides and three alignments with the arrow, the three widths, the parts that turn
 * on and off (description, body, close button and footer), the mirror in right-to-left writing, a
 * popover to open and close with the mouse and the keyboard, and the three required examples in
 * light and in dark mode, in the same story. Each page opens with what it proves, and the matrix
 * names its rows by attribute, as on the Docs page. All visible text comes from the language
 * dictionary, under the `popoverValidation` and `validationPages` keys (`docs/i18n.md`,
 * "Storybook").
 *
 * The open popovers are opened one after the other (see `nph-popover.demo.ts`). Hover and focus
 * belong to the inner pieces: the tests prove them. The open state of the trigger is the open
 * popover itself, drawn on every page.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { NPH_POPOVER_ALIGNMENTS, NPH_POPOVER_SIDES, NPH_POPOVER_SIZES } from './nph-popover';
import { bothModes, cell, examples, placement, sized, texts } from './nph-popover.demo';
import type { ExampleTexts } from './nph-popover.demo';

const meta: Meta = {
  title: 'Components/nph-popover/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined): ExampleTexts & Record<string, unknown> {
  return translations(localeOf(context)).popoverValidation as ExampleTexts & Record<string, unknown>;
}

const page = (storyId: string) => ({ piece: 'nph-popover', storyId: `components-nph-popover-validation--${storyId}` });

/** The four sides and three alignments, with the arrow: the 12 variants of the Figma set that vary side and alignment. */
export const Placement: Story = {
  name: 'Placement',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('placement'),
      matrix(
        validationTitle(context, 'nph-popover', page('placement').storyId),
        [],
        NPH_POPOVER_SIDES.flatMap((side) =>
          NPH_POPOVER_ALIGNMENTS.map((align) => ({
            label: `side: ${side} · align: ${align} · arrow: on`,
            cells: [placement(v, side, align)],
          })),
        ),
      ),
    );
  },
};

/** The three widths, 240, 320 and 400, without the arrow: only the width changes. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('sizes'),
      matrix(
        validationTitle(context, 'nph-popover', page('sizes').storyId),
        [],
        NPH_POPOVER_SIZES.map((size) => ({ label: `size: ${size} · arrow: off`, cells: [sized(v, size)] })),
      ),
    );
  },
};

/** The parts that turn on and off: the title is always there; description, body, close button and footer are optional. */
export const Parts: Story = {
  name: 'Parts',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const base = texts(v);
    return validationPage(
      context,
      page('parts'),
      matrix(validationTitle(context, 'nph-popover', page('parts').storyId), [], [
        { label: 'title only', cells: [cell({ ...base, description: false })] },
        { label: 'description: on', cells: [cell({ ...base })] },
        { label: 'description: on · body: on', cells: [cell({ ...base, body: true })] },
        { label: 'description: on · close: on', cells: [cell({ ...base, closable: true })] },
        { label: 'description: on · footer: on', cells: [cell({ ...base, footer: true })] },
        { label: 'description, body, close and footer: on', cells: [cell({ ...base, body: true, closable: true, footer: true })] },
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
        validationTitle(context, 'nph-popover', page('direction').storyId),
        [],
        (['ltr', 'rtl'] as const).flatMap((dir) =>
          (['start', 'end'] as const).map((align) => ({
            label: `dir: ${dir} · align: ${align}`,
            cells: [html`<div dir=${dir} style="inline-size: 100%;">${cell({ ...texts(v), align, arrow: true })}</div>`],
          })),
        ),
      ),
    );
  },
};

/** A popover to try: the trigger opens it, Esc, a press outside, the close button or the footer closes it, and the focus goes back. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('interactive'),
      matrix(validationTitle(context, 'nph-popover', page('interactive').storyId), [], [
        {
          label: 'closed: open it with the trigger',
          cells: [cell({ ...texts(v), closable: true, footer: true, open: false })],
        },
      ]),
    );
  },
};

/** The three required examples — filter with confirmation, short form, information with close — in light and in dark. */
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
