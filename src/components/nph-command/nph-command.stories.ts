/**
 * VALIDATION stories of `nph-command`.
 *
 * Each story proves a part of the contract accepted in Figma (documentation frame `6076:4910`, set
 * `6068:3936`) and of P123: the three required examples of the documentation — open by key, search
 * and nothing found —, the contents of the set (results, groups, search, empty, loading) with the
 * footer of hints on and off, a disabled command and a destructive command, and where the focus goes
 * when the palette opens and closes. The matrix of content by footer is on the Docs page.
 *
 * The examples open in frames of their own, one per mode (`nph-command.demo.ts` says why): a modal
 * dialog covers the window it opens in. The open-by-key story and the focus story open the palette
 * over this page itself, in the mode of the Storybook selector. Every visible text comes from the
 * language dictionary, under the `commandValidation` key.
 *
 * The `Brands` page proves the seven brands of P20 in light and dark, each frame with `data-nph-brand`
 * and `data-nph-color-scheme` on the same element (DSA-36). A closed palette sits in each frame, next
 * to a button that opens it: the top layer keeps the inheritance of custom properties, so the open
 * palette resolves its tokens with the brand of the frame it lives in.
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
import './nph-command';
import type { NphCommand } from './nph-command';
import { bothModes, example } from './nph-command.demo';
import type { Example, Variant } from './nph-command.demo';

const meta: Meta = {
  title: 'Components/nph-command/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).commandValidation;
}

function frame(context: GlobalsContext | undefined, storyId: string, content: TemplateResult): TemplateResult {
  return validationPage(context, { piece: 'nph-command', storyId: `components-nph-command-validation--${storyId}` }, content);
}

function caption(text: string): TemplateResult {
  return html`<p
    style="margin: 0; font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height); color: var(--nph-color-muted-foreground);"
  >
    ${text}
  </p>`;
}

/** An example in light and in dark mode, each in a window of its own. */
function modes(context: GlobalsContext | undefined, name: Example, text: string, variant: Variant = {}): TemplateResult {
  const v = t(context);
  return html`${caption(text)} ${bothModes(name, localeOf(context), v.frameTitle, { light: v.lightCaption, dark: v.darkCaption }, variant)}`;
}

/** The button of a frame opens the palette that sits next to it. */
const openSibling = (event: Event): void => {
  const palette = (event.currentTarget as Element).parentElement?.querySelector('nph-command') as NphCommand | null;
  if (palette) palette.open = true;
};

/** Open by key: Ctrl+K opens the palette with the commands by group, the first one active; Enter runs it. */
export const OpenByKey: Story = {
  name: 'Open by key',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'open-by-key',
      html`${caption(v.openByKeyCaption)}
        <div style="display: flex; justify-content: center; padding-block: var(--nph-space-section);">
          <nph-button data-nph-command-trigger text=${v.openPalette} @click=${openSibling}></nph-button>
          ${example('groups', v, {}, false)}
        </div>`,
    );
  },
  play: async ({ canvasElement }) => {
    const palette = canvasElement.querySelector('nph-command') as NphCommand | null;
    if (palette) {
      palette.globalShortcut = true;
      await palette.updateComplete;
    }
    (canvasElement.querySelector('[data-nph-command-trigger]') as HTMLElement | null)?.focus();
    await userEvent.keyboard('{Control>}k{/Control}');
  },
};

/** Search: the person types and the list shows only what matches, the typed stretch heavier and the first command active. */
export const Search: Story = {
  name: 'Search',
  render: (_args, context: GlobalsContext) => frame(context, 'search', modes(context, 'search', t(context).searchCaption)),
};

/** Nothing found: the empty state says so and suggests another term; the footer stays. */
export const NothingFound: Story = {
  name: 'Nothing found',
  render: (_args, context: GlobalsContext) =>
    frame(context, 'nothing-found', modes(context, 'empty', t(context).nothingFoundCaption)),
};

/** Groups: labels open each group with no divider between them, and the list scrolls at its ceiling. */
export const Groups: Story = {
  name: 'Groups',
  render: (_args, context: GlobalsContext) => frame(context, 'groups', modes(context, 'groups', t(context).groupsCaption)),
};

/** Loading: the spinner and the loading text; the list is busy and no command is drawn. */
export const Loading: Story = {
  name: 'Loading',
  render: (_args, context: GlobalsContext) => frame(context, 'loading', modes(context, 'loading', t(context).loadingCaption)),
};

/** Footer off: the second line and the hints are hidden; the rest does not change. */
export const FooterOff: Story = {
  name: 'Footer off',
  render: (_args, context: GlobalsContext) =>
    frame(context, 'footer-off', modes(context, 'results', t(context).footerOffCaption, { footer: 'off' })),
};

/** A disabled command is dimmed, skipped by the keys and the pointer, and does not run. */
export const DisabledCommand: Story = {
  name: 'Disabled command',
  render: (_args, context: GlobalsContext) =>
    frame(context, 'disabled-command', modes(context, 'disabled', t(context).disabledCaption)),
};

/** The destructive command keeps its own colors at rest and active, and says the action in its label. */
export const DestructiveCommand: Story = {
  name: 'Destructive command',
  render: (_args, context: GlobalsContext) =>
    frame(context, 'destructive-command', modes(context, 'destructive', t(context).destructiveCaption)),
};

/** Opening moves the focus to the field; Esc closes it and the focus goes back to the button that opened it. */
export const FocusAndEscape: Story = {
  name: 'Focus and Esc',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'focus-and-escape',
      html`${caption(v.focusCaption)}
        <div style="display: flex; justify-content: center; padding-block: var(--nph-space-section);">
          <nph-button data-nph-command-trigger text=${v.openPalette} @click=${openSibling}></nph-button>
          ${example('groups', v, {}, false)}
        </div>`,
    );
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-nph-command-trigger]');
    if (trigger) await userEvent.click(trigger);
  },
};

/** The seven brands in light and dark (DSA-36): the button opens the palette of its own frame, which follows the brand of the frame. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'brands',
      brandFrames(
        validationTitle(context, 'nph-command', 'components-nph-command-validation--brands'),
        () => html`<nph-button text=${v.openPalette} @click=${openSibling}></nph-button>${example('destructive', v, {}, false)}`,
      ),
    );
  },
};
