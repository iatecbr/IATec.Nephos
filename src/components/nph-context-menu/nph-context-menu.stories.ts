/**
 * VALIDATION stories of `nph-context-menu`.
 *
 * They prove the contract accepted in Figma (documentation `4838:27591`, set `4819:15828`) and
 * P113: the closed menu, with shortcuts, an item with a submenu and the destructive item last; the
 * submenu open to the right and, compact, to the left; single and multiple choice with a group
 * label and a disabled item; the two sizes, one per menu; the mirror in right-to-left writing; an
 * object to open the menu on with the right click or the keyboard; and the three required examples,
 * each in light and in dark mode, in the same story, through `data-nph-color-scheme` on the frame
 * (P20, P67): the open menu lives in the top layer and still takes the scheme of its frame.
 *
 * The menus on the pages are opened from code, at the start top corner of their object, as the
 * documentation shows them; the `Interactive` page opens one with the right click, Shift+F10 or
 * the Menu key. Hover and focus are interaction states: they show up by moving the mouse over an
 * item and by moving with the arrows; the component test measures both. Each page opens with
 * what it proves, from the dictionary (`validationPages.claims`). The example text and the
 * captions come from the language dictionary, under the key `contextMenuValidation`
 * (`docs/i18n.md`, "Storybook").
 *
 * The `Brands` page proves the seven brands of P20 in light and dark, each frame with `data-nph-brand` and
 * `data-nph-color-scheme` on the same element (DSA-36).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { BRAND_CONTRAST_EXCEPTION, brandFrames } from '../../shared/docs/brands';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-context-menu';
import type { NphContextMenuItemSelectDetail } from './nph-context-menu';
import { SUPPLEMENTARY_TEXT_EXCEPTION, choiceMenu, fileItems, fileMenu, inScheme, menuWith } from './nph-context-menu.demo';
import type { Scheme } from './nph-context-menu.demo';

const meta: Meta = {
  title: 'Components/nph-context-menu/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).contextMenuValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-context-menu',
  storyId: `components-nph-context-menu-validation--${storyId}`,
});

/** What a story draws in one mode. */
type ModeContent = () => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, content: ModeContent, name?: string, stacked = false): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  return html`<div style=${stacked ? `${modesFrame} flex-direction: column;` : modesFrame}>
    ${modes.map(([scheme, caption]) => inScheme(scheme, name === undefined ? caption : `${name} · ${caption}`, content(), stacked))}
  </div>`;
}

/** The menu with its submenu closed, with shortcuts and the destructive item last, after a separator. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const Menu: Story = {
  name: 'Menu',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('menu'), inBothModes(context, () => fileMenu(t(context)))),
};

/** The submenu open to the right, on the same line as the item that opened it. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const Submenu: Story = {
  name: 'Submenu',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('submenu'), inBothModes(context, () => fileMenu(t(context), { submenu: 'share' }))),
};

/** The submenu open to the left, when there is no room to the right, in the compact size. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const SubmenuLeft: Story = {
  name: 'Submenu left',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('submenu-left'),
      inBothModes(context, () => fileMenu(t(context), { submenu: 'share', size: 'compact', pinned: true }), undefined, true),
    ),
};

/** Single choice with the check, multiple choice with the box, a group label and a disabled item. */
export const Choices: Story = {
  name: 'Choices',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('choices'), inBothModes(context, () => choiceMenu(t(context)))),
};

/** The two sizes, one per menu: default rows of 36 and compact rows of 28, the compact one with the destructive item. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const Sizes: Story = {
  name: 'Sizes',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('sizes'),
      html`${inBothModes(context, () => fileMenu(v), 'size: default')} ${inBothModes(context, () => fileMenu(v, { size: 'compact' }), 'size: compact')}`,
    );
  },
};

/** Right-to-left writing: the start top corner is the right one, and the arrow and the submenu follow it. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const Direction: Story = {
  name: 'Direction',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('direction'),
      inBothModes(context, () => html`<div dir="rtl" style="inline-size: 100%;">${fileMenu(v, { submenu: 'share' })}</div>`),
    );
  },
};

/** An object to try: the right click, Shift+F10 or the Menu key opens the menu; activating an item fires nph-item-select, shown below. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const show = (event: CustomEvent<NphContextMenuItemSelectDetail>): void => {
      const output = (event.target as Element).closest('figure')?.querySelector('output');
      if (output) {
        output.textContent = format(v.statusChosen, { value: event.detail.value, checked: String(event.detail.checked) });
      }
    };
    return validationPage(
      context,
      page('interactive'),
      inBothModes(
        context,
        () => html`<div @nph-item-select=${show}>
          ${menuWith({ object: v.interactiveObject, items: fileItems(v) })}
          <output style=${statusStyle}>${v.statusIdle}</output>
        </div>`,
      ),
    );
  },
};

/** The three required examples, each in light and dark mode. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const Examples: Story = {
  name: 'Examples',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      html`${inBothModes(context, () => fileMenu(v), v.exampleClosed)}
      ${inBothModes(context, () => fileMenu(v, { submenu: 'share' }), v.exampleRight)}
      ${inBothModes(context, () => fileMenu(v, { submenu: 'share', size: 'compact', pinned: true }), v.exampleLeft, true)}`,
    );
  },
};

/**
 * The seven brands in light and dark (DSA-36): the checked single choice, the open submenu item and the
 * solid icon take the primary of the brand, and so does the focus on the arrows. Carries
 * `SUPPLEMENTARY_TEXT_EXCEPTION` and `BRAND_CONTRAST_EXCEPTION` (`src/shared/docs/brands.ts`): the checked
 * choice paints `color/primary-hover` as text, the token limit recorded for `nph-dropdown-menu`.
 */
export const Brands: Story = {
  name: 'Brands',
  parameters: {
    a11y: {
      options: {
        rules: { ...SUPPLEMENTARY_TEXT_EXCEPTION.a11y.options.rules, ...BRAND_CONTRAST_EXCEPTION },
      },
    },
  },
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-context-menu', page('brands').storyId), () =>
        menuWith({
          object: v.object,
          open: true,
          submenu: 'share',
          pinned: false,
          rows: 5,
          items: [
            { value: 'list', text: v.list, icon: 'list', selection: 'single', checked: true },
            { value: 'edit', text: v.edit, icon: 'pen', shortcut: v.shortcutEdit },
            {
              value: 'share',
              text: v.share,
              icon: 'share',
              submenu: [
                { value: 'share-copy-link', text: v.copyLink, icon: 'link' },
                { value: 'share-download', text: v.downloadFile, icon: 'download' },
              ],
            },
            { type: 'separator' },
            { value: 'delete', text: v.delete, icon: 'trash', severity: 'destructive' },
          ],
        }),
      ),
    );
  },
};
