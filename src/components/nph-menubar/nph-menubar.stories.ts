/**
 * VALIDATION stories of `nph-menubar`.
 *
 * They prove the contract accepted in Figma (documentation `6432:8686`, root `6410:7413`, sets
 * `6410:7769` and `6402:4299`) and P126 (DSA-83): the closed bar of top items; the File panel open, with
 * shortcuts, an item with a submenu and the destructive item last; the View panel with a group label,
 * checkboxes and radios; a checked and disabled choice and a disabled command; the Recent submenu open
 * beside its item; a disabled top item and a top item with a long label; the top item in keyboard focus,
 * alone and open at once; the top items that do not fit going into the last top item; the button of the
 * narrow screen; the mirror in right-to-left writing; a bar to try with the pointer and the keyboard; and
 * the four required examples. Each in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67): the open panel lives in the top layer and still takes the
 * scheme of its frame.
 *
 * The panels on the pages are opened from code, below their top item, as the documentation shows them; the
 * `Interactive` page opens them with a click or the keyboard. Hover is an interaction state: it shows up by
 * moving the mouse over a top item. Focus is one for the whole page, so the `Focus` and `Open and focus`
 * pages give it to the light frame and Tab takes it to the dark one: the document has one focused element.
 * Each page opens with what it proves, from the dictionary (`validationPages.claims`). The example text and
 * the captions come from the language dictionary, under the key `menubarValidation` (`docs/i18n.md`,
 * "Storybook").
 *
 * The `Brands` page proves the seven brands of P20 in light and dark, each frame with `data-nph-brand` and
 * `data-nph-color-scheme` on the same element (DSA-36): the top item open takes `color/primary-surface-hover`.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-menubar';
import type { NphMenubarItemSelectDetail } from './nph-menubar';
import {
  SUPPLEMENTARY_TEXT_EXCEPTION,
  barWith,
  closedBar,
  editorMenus,
  fileExample,
  inScheme,
  narrowBar,
  overflowBar,
  recentExample,
  statesExample,
  topItemsBar,
  viewExample,
} from './nph-menubar.demo';
import type { Scheme } from './nph-menubar.demo';

const meta: Meta = {
  title: 'Components/nph-menubar/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).menubarValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-menubar',
  storyId: `components-nph-menubar-validation--${storyId}`,
});

/** What a story draws in one mode. */
type ModeContent = (scheme: Scheme) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, content: ModeContent, name?: string, stacked = false): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  return html`<div style=${stacked ? `${modesFrame} flex-direction: column;` : modesFrame}>
    ${modes.map(([scheme, caption]) => inScheme(scheme, name === undefined ? caption : `${name} · ${caption}`, content(scheme), stacked))}
  </div>`;
}

/** The closed bar: the top items File, Edit, View and Help, no panel open. */
export const Closed: Story = {
  name: 'Closed',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('closed'), inBothModes(context, () => closedBar(t(context)))),
};

/** The File panel open below its top item: commands with shortcuts, an item with a submenu and the destructive item last, after a separator. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const FileMenu: Story = {
  name: 'File menu',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('file-menu'), inBothModes(context, () => fileExample(t(context)))),
};

/** The View panel: a group label, the ruler and the grid as checkboxes, and the density as radios, the checked one with the check. */
export const ViewMenu: Story = {
  name: 'View menu',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('view-menu'), inBothModes(context, () => viewExample(t(context)))),
};

/** A checked and disabled choice keeps its mark under the disabled opacity, and a disabled command takes the focus and does not run. */
export const CheckedAndDisabled: Story = {
  name: 'Checked and disabled',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('checked-and-disabled'), inBothModes(context, () => statesExample(t(context)))),
};

/** The Recent submenu open beside its item, one level, on the line of the item that opened it. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const Submenu: Story = {
  name: 'Submenu',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('submenu'), inBothModes(context, () => recentExample(t(context)))),
};

/** A disabled top item stays in the bar at the disabled opacity, and a top item with a long label hugs its text. */
export const TopItems: Story = {
  name: 'Top items',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('top-items'), inBothModes(context, () => topItemsBar(t(context)))),
};

/** The top item in keyboard focus: the border in `focus/border` and the halo, no background. The light frame takes the focus; Tab takes it to the dark one. */
export const Focus: Story = {
  name: 'Focus',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('focus'),
      inBothModes(context, (scheme) => barWith(t(context), { menus: editorMenus(t(context)), focused: scheme === 'light' })),
    ),
};

/** The top item open and in focus at once, as the arrows leave it: the open look with the focus border and halo over it. The light frame takes the focus; Tab takes it to the dark one. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const OpenAndFocus: Story = {
  name: 'Open and focus',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('open-and-focus'),
      inBothModes(context, (scheme) => fileExample(t(context), { focused: scheme === 'light' })),
    ),
};

/** The top items that do not fit the width go into the last top item, without wrapping the bar into a second line. */
export const Overflow: Story = {
  name: 'Overflow',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('overflow'), inBothModes(context, () => overflowBar(t(context)))),
};

/** The narrow screen: the application swaps the bar for the button with the `bars` icon, named by `menu-label`. */
export const Narrow: Story = {
  name: 'Narrow',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('narrow'), inBothModes(context, () => narrowBar(t(context)))),
};

/** Right-to-left writing, each frame across the window so there is room to the left: the bar starts at the right, the panel aligns to the start edge and the arrow of the submenu follows it. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const Direction: Story = {
  name: 'Direction',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('direction'),
      inBothModes(context, () => html`<div dir="rtl" style="inline-size: 100%;">${fileExample(t(context), { submenu: 'recent' })}</div>`, undefined, true),
    ),
};

/** A bar to try: click a top item or use the arrows, Enter, Esc and Tab; activating a command fires nph-item-select, shown below. */
export const Interactive: Story = {
  name: 'Interactive',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const show = (event: CustomEvent<NphMenubarItemSelectDetail>): void => {
      const output = (event.target as Element).closest('figure')?.querySelector('output');
      if (output) {
        output.textContent = format(v.statusChosen, { value: event.detail.value, checked: String(event.detail.checked), menu: event.detail.menu });
      }
    };
    return validationPage(
      context,
      page('interactive'),
      inBothModes(
        context,
        () => html`<div @nph-item-select=${show}>
          ${barWith(v, { menus: editorMenus(v), rows: 8 })}
          <output style=${statusStyle}>${v.statusIdle}</output>
        </div>`,
      ),
    );
  },
};

/** The four required examples, each in light and dark mode. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const Examples: Story = {
  name: 'Examples',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      html`${inBothModes(context, () => fileExample(v), v.exampleFile)} ${inBothModes(context, () => viewExample(v), v.exampleView)}
      ${inBothModes(context, () => statesExample(v), v.exampleStates)} ${inBothModes(context, () => recentExample(v), v.exampleRecent)}`,
    );
  },
};

/**
 * The seven brands in light and dark (DSA-36): the open top item takes `color/primary-surface-hover` with
 * `color/primary-on-surface-hover` on top, the checked choice the primary of the brand, and so does the focus.
 */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-menubar', page('brands').storyId), () =>
        barWith(v, { menus: editorMenus(v), open: 'view', rows: 8, width: 'var(--nph-layout-input-width)' }),
      ),
    );
  },
};
