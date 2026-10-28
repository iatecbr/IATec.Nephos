/**
 * VALIDATION stories of `nph-dropdown-menu`.
 *
 * They prove the contract accepted in Figma (board `1365:118`, menu `1365:63`, item set
 * `1365:57`, parts `1365:58`, `1365:60` and `2359:47364`) and P92: the item types and choices
 * (`severity` × `selection`); every item option (icon, avatar, description, shortcut, counter,
 * tag, switch and submenu arrow); the states that are data (disabled and loading); the two
 * sizes; the profile header with group labels and separators; the trigger that opens the menu
 * and the event `nph-item-select`; and the three required examples of the board. Every story
 * shows the same menu in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67): the open menu lives in the top layer and
 * still takes the scheme of its frame.
 *
 * Hover and focus are interaction states: they show up by moving the mouse over an item and by
 * moving with the arrows, as in `nph-select`; the component test measures both. Each page
 * opens with what it proves, from the dictionary (`validationPages.claims`). The example text
 * and the captions come from the language dictionary, under the key `dropdownMenuValidation`
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
import './nph-dropdown-menu';
import type { NphDropdownMenuItemSelectDetail } from './nph-dropdown-menu';
import { SUPPLEMENTARY_TEXT_EXCEPTION, accountMenu, inScheme, menuWith, optionsMenu, viewMenu } from './nph-dropdown-menu.demo';
import type { Scheme } from './nph-dropdown-menu.demo';

const meta: Meta = {
  title: 'Components/nph-dropdown-menu/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).dropdownMenuValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-dropdown-menu',
  storyId: `components-nph-dropdown-menu-validation--${storyId}`,
});

/** What a story draws in one mode. */
type ModeContent = () => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, content: ModeContent, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => inScheme(scheme, name === undefined ? caption : `${name} · ${caption}`, content()))}
  </div>`;
}

/** `severity` × `selection`: the common, single, multiple and destructive items. Move the mouse for hover; use the arrows for focus. */
export const Variants: Story = {
  name: 'Variants',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('variants'),
      inBothModes(context, () =>
        menuWith({
          trigger: v.trigger,
          open: true,
          items: [
            { value: 'rename', text: v.rename, icon: 'pen-to-square' },
            { type: 'separator' },
            { value: 'list', text: v.list, icon: 'list', selection: 'single', checked: true },
            { value: 'grid', text: v.grid, icon: 'grid-2', selection: 'single' },
            { type: 'separator' },
            { value: 'archived', text: v.archived, selection: 'multiple', checked: true },
            { value: 'shared', text: v.shared, selection: 'multiple' },
            { type: 'separator' },
            { value: 'delete', text: v.delete, icon: 'trash', severity: 'destructive' },
          ],
        }),
      ),
    );
  },
};

/**
 * Every item option: start icon, avatar, description, shortcut, counter, tag, switch and submenu arrow.
 * Carries the supplementary text exception of `SUPPLEMENTARY_TEXT_EXCEPTION`.
 */
export const Options: Story = {
  name: 'Options',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('options'),
      inBothModes(context, () =>
        menuWith({
          trigger: v.trigger,
          open: true,
          items: [
            { value: 'duplicate', text: v.duplicate, icon: 'share-from-square', shortcut: v.shortcutDuplicate },
            { value: 'export', text: v.export, icon: 'download', description: v.exportDescription },
            { value: 'unread', text: v.unread, icon: 'paper-plane', count: 12 },
            { value: 'share', text: v.share, icon: 'share', tag: v.newTag },
            { value: 'sync', text: v.sync, icon: 'rotate-right', switch: true, checked: true },
            { value: 'move', text: v.move, icon: 'arrow-up-from-bracket', submenu: true },
            { value: 'assign', text: v.assign, avatar: '' },
          ],
        }),
      ),
    );
  },
};

/** Disabled and loading are data; hover and focus come from the mouse and the keyboard. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      inBothModes(context, () =>
        menuWith({
          trigger: v.trigger,
          open: true,
          items: [
            { value: 'rename', text: v.rename, icon: 'pen-to-square' },
            { value: 'print', text: v.print, icon: 'print', disabled: true },
            { value: 'export', text: v.export, icon: 'download', loading: true },
            { value: 'delete', text: v.delete, icon: 'trash', severity: 'destructive' },
            { value: 'archive', text: v.archive, icon: 'trash-can', severity: 'destructive', disabled: true },
          ],
        }),
      ),
    );
  },
};

/** The two sizes, side by side: default rows of 36 and compact rows of 28. Carries `SUPPLEMENTARY_TEXT_EXCEPTION`. */
export const Sizes: Story = {
  name: 'Sizes',
  parameters: SUPPLEMENTARY_TEXT_EXCEPTION,
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const items = [
      { value: 'rename', text: v.rename, icon: 'pen-to-square' },
      { value: 'duplicate', text: v.duplicate, icon: 'share-from-square', shortcut: v.shortcutDuplicate },
      { value: 'delete', text: v.delete, icon: 'trash', severity: 'destructive' as const },
    ];
    return validationPage(
      context,
      page('sizes'),
      html`${inBothModes(context, () => menuWith({ trigger: v.trigger, open: true, items }), 'size: default')}
      ${inBothModes(context, () => menuWith({ trigger: v.trigger, open: true, items, size: 'compact' }), 'size: compact')}`,
    );
  },
};

/** The profile header, group labels and separators: the account menu. */
export const Header: Story = {
  name: 'Header',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(context, page('header'), inBothModes(context, () => accountMenu(v)));
  },
};

/** The trigger opens the menu; activating an item fires nph-item-select, shown below the trigger. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const show = (event: CustomEvent<NphDropdownMenuItemSelectDetail>): void => {
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
          ${menuWith({
            trigger: v.trigger,
            items: [
              { value: 'rename', text: v.rename, icon: 'pen-to-square' },
              { value: 'list', text: v.list, icon: 'list', selection: 'single', checked: true },
              { value: 'grid', text: v.grid, icon: 'grid-2', selection: 'single' },
              { value: 'sync', text: v.sync, icon: 'rotate-right', switch: true },
              { value: 'delete', text: v.delete, icon: 'trash', severity: 'destructive' },
            ],
          })}
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
      html`${inBothModes(context, () => accountMenu(v), v.exampleAccount)}
      ${inBothModes(context, () => viewMenu(v), v.exampleView)}
      ${inBothModes(context, () => optionsMenu(v), v.exampleOptions)}`,
    );
  },
};

/**
 * The seven brands in light and dark (DSA-36): the checked item and the counter take the primary of
 * the brand, and so does the focus on the arrows. Carries `SUPPLEMENTARY_TEXT_EXCEPTION` and
 * `BRAND_CONTRAST_EXCEPTION` (`src/shared/docs/brands.ts`).
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
      brandFrames(
        validationTitle(context, 'nph-dropdown-menu', page('brands').storyId),
        () =>
          menuWith({
            trigger: v.trigger,
            open: true,
            items: [
              { value: 'list', text: v.list, icon: 'list', selection: 'single', checked: true },
              { value: 'unread', text: v.unread, icon: 'paper-plane', count: 12 },
              { value: 'share', text: v.share, icon: 'share', count: 3 },
            ],
          }),
      ),
    );
  },
};
