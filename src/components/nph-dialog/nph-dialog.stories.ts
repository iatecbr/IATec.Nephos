/**
 * VALIDATION stories of `nph-dialog`.
 *
 * Each story proves a part of the contract accepted in Figma (board `1368:27`, set
 * `2268:52262`) and of P87: the three required examples of the board — the short form in
 * `md`, the short confirmation in `sm` with no content area and the wide content in `lg`
 * with both lines —, the stacked actions below the `md` breakpoint, the primary in
 * `loading` while the action finishes, and where the focus goes when the dialog opens and
 * closes. The highlight icon is not drawn until D3 of DSA-44 is answered.
 *
 * The examples open in frames of their own, one per mode (`nph-dialog.demo.ts` says why): a
 * modal dialog covers the window it opens in. The focus story opens the dialog over this
 * page itself, in the mode of the Storybook selector. Every visible text comes from the
 * language dictionary, under the `dialogValidation` key.
 *
 * The `Brands` page proves the seven brands of P20 in light and dark, each frame with `data-nph-brand`
 * and `data-nph-color-scheme` on the same element (DSA-36). A closed dialog sits in each frame, next to
 * a button that opens it: the top layer keeps the inheritance of custom properties, so the open dialog
 * resolves its tokens with the brand of the frame it lives in.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { userEvent } from 'storybook/test';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import '../nph-button/nph-button';
import './nph-dialog';
import type { NphDialog } from './nph-dialog';
import { bothModes, example } from './nph-dialog.demo';
import type { Example } from './nph-dialog.demo';

const meta: Meta = {
  title: 'Components/nph-dialog/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).dialogValidation;
}

function frame(context: GlobalsContext | undefined, storyId: string, content: TemplateResult): TemplateResult {
  return validationPage(context, { piece: 'nph-dialog', storyId: `components-nph-dialog-validation--${storyId}` }, content);
}

function caption(text: string): TemplateResult {
  return html`<p
    style="margin: 0; font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height); color: var(--nph-color-muted-foreground);"
  >
    ${text}
  </p>`;
}

/** An example in light and in dark mode, each in a window of its own. */
function modes(context: GlobalsContext | undefined, name: Example, text: string): TemplateResult {
  const v = t(context);
  return html`${caption(text)} ${bothModes(name, localeOf(context), v.frameTitle, { light: v.lightCaption, dark: v.darkCaption })}`;
}

/** Short form in md, the default size: title, description, content area and actions. */
export const ShortForm: Story = {
  name: 'Short form',
  render: (_args, context: GlobalsContext) =>
    frame(context, 'short-form', modes(context, 'edit-profile', t(context).shortFormCaption)),
};

/** Short confirmation in sm, with no content area: the header text sets the width. */
export const ShortConfirmation: Story = {
  name: 'Short confirmation',
  render: (_args, context: GlobalsContext) =>
    frame(context, 'short-confirmation', modes(context, 'send-for-approval', t(context).shortConfirmationCaption)),
};

/** Wide content in lg, a list, with both lines: only the content scrolls. */
export const WideContent: Story = {
  name: 'Wide content',
  render: (_args, context: GlobalsContext) =>
    frame(context, 'wide-content', modes(context, 'import-contacts', t(context).wideContentCaption)),
};

/** Stacked actions below the md breakpoint: one per line, the primary on top. */
export const StackedActions: Story = {
  name: 'Stacked actions',
  render: (_args, context: GlobalsContext) =>
    frame(context, 'stacked-actions', modes(context, 'stacked', t(context).stackedCaption)),
};

/** The primary in loading while the action finishes, next to the solid secondary. */
export const LoadingAction: Story = {
  name: 'Loading action',
  render: (_args, context: GlobalsContext) =>
    frame(context, 'loading-action', modes(context, 'publishing', t(context).loadingCaption)),
};

/** Opening moves the focus into the dialog; Esc or the close button close it and the focus goes back. */
export const FocusAndEscape: Story = {
  name: 'Focus and Esc',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const open = (event: Event): void => {
      const dialog = (event.currentTarget as Element).parentElement?.querySelector('nph-dialog') as NphDialog | null;
      if (dialog) dialog.open = true;
    };
    return frame(
      context,
      'focus-and-escape',
      html`${caption(v.focusCaption)}
        <div style="display: flex; justify-content: center; padding-block: var(--nph-space-section);">
          <nph-button data-nph-dialog-trigger text=${v.openDialog} @click=${open}></nph-button>
          ${example('edit-profile', v, {}, false)}
        </div>`,
    );
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-nph-dialog-trigger]');
    if (trigger) await userEvent.click(trigger);
  },
};

/** The seven brands in light and dark (DSA-36): the button opens the dialog of its own frame, which follows the brand of the frame; the focus ring of the scroll region shows on Tab. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const open = (event: Event): void => {
      const dialog = (event.currentTarget as Element).parentElement?.querySelector('nph-dialog') as NphDialog | null;
      if (dialog) dialog.open = true;
    };
    return frame(
      context,
      'brands',
      brandFrames(
        validationTitle(context, 'nph-dialog', 'components-nph-dialog-validation--brands'),
        () => html`<nph-button text=${v.openDialog} @click=${open}></nph-button>${example('import-contacts', v, {}, false)}`,
      ),
    );
  },
};
