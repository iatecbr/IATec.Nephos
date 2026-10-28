/**
 * FIXTURES of `nph-dialog`: one example of the board, open, alone in the window.
 *
 * It proves nothing by itself and is hidden from the sidebar (no `dev` tag). The Validation
 * and Docs pages embed it in an `<iframe>`, one per mode, because a modal dialog covers the
 * window it opens in (`nph-dialog.demo.ts` and P87). The example comes from the `example`
 * arg, the mode and the language from the globals of the frame's address. Every visible
 * text comes from the language dictionary, under the `dialogValidation` key.
 */
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { localeOf } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { NPH_DIALOG_ACTIONS, NPH_DIALOG_SIZES } from './nph-dialog';
import type { NphDialogActions, NphDialogSize } from './nph-dialog';
import { EXAMPLES, example } from './nph-dialog.demo';
import type { Example as ExampleName } from './nph-dialog.demo';

interface FixtureArgs {
  example: ExampleName;
  size?: NphDialogSize;
  actions?: NphDialogActions;
}

const meta: Meta<FixtureArgs> = {
  title: 'Components/nph-dialog/Fixtures',
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    example: { control: 'select', options: [...EXAMPLES] },
    size: { control: 'select', options: [...NPH_DIALOG_SIZES] },
    actions: { control: 'select', options: [...NPH_DIALOG_ACTIONS] },
  },
  args: {
    example: 'edit-profile',
  },
};

export default meta;

/** One example of the board, open, in the mode and the language of the frame. */
export const Example: StoryObj<FixtureArgs> = {
  name: 'Example',
  render: (args, context: GlobalsContext) => {
    const variant = {
      ...(args.size ? { size: args.size } : {}),
      ...(args.actions ? { actions: args.actions } : {}),
    };
    return example(args.example, translations(localeOf(context)).dialogValidation, variant);
  },
};

/*
 * The examples the frames show, composed directly for the accessibility gate (P72). The
 * Validation and Docs pages load each example through `iframe.html`, which the Vitest run
 * does not serve, and axe does not read inside a frame: without these stories, the gate
 * would not check the dialogs of the frames. One story per example and variant the pages
 * frame, in each mode, through the `colorScheme` global of the story. Hidden, as the rest of
 * this page.
 */
type Mode = 'light' | 'dark';

function gate(name: ExampleName, mode: Mode, variant: Omit<FixtureArgs, 'example'> = {}): StoryObj<FixtureArgs> {
  return { ...Example, args: { example: name, ...variant }, globals: { colorScheme: mode } };
}

export const EditProfileSmInlineLight = gate('edit-profile', 'light', { size: 'sm', actions: 'inline' });
export const EditProfileSmInlineDark = gate('edit-profile', 'dark', { size: 'sm', actions: 'inline' });
export const EditProfileSmStackedLight = gate('edit-profile', 'light', { size: 'sm', actions: 'stacked' });
export const EditProfileSmStackedDark = gate('edit-profile', 'dark', { size: 'sm', actions: 'stacked' });
export const EditProfileMdInlineLight = gate('edit-profile', 'light', { size: 'md', actions: 'inline' });
export const EditProfileMdInlineDark = gate('edit-profile', 'dark', { size: 'md', actions: 'inline' });
export const EditProfileMdStackedLight = gate('edit-profile', 'light', { size: 'md', actions: 'stacked' });
export const EditProfileMdStackedDark = gate('edit-profile', 'dark', { size: 'md', actions: 'stacked' });
export const EditProfileLgInlineLight = gate('edit-profile', 'light', { size: 'lg', actions: 'inline' });
export const EditProfileLgInlineDark = gate('edit-profile', 'dark', { size: 'lg', actions: 'inline' });
export const EditProfileLgStackedLight = gate('edit-profile', 'light', { size: 'lg', actions: 'stacked' });
export const EditProfileLgStackedDark = gate('edit-profile', 'dark', { size: 'lg', actions: 'stacked' });
export const SendForApprovalLight = gate('send-for-approval', 'light');
export const SendForApprovalDark = gate('send-for-approval', 'dark');
export const ImportContactsSmLight = gate('import-contacts', 'light', { size: 'sm' });
export const ImportContactsSmDark = gate('import-contacts', 'dark', { size: 'sm' });
export const ImportContactsMdLight = gate('import-contacts', 'light', { size: 'md' });
export const ImportContactsMdDark = gate('import-contacts', 'dark', { size: 'md' });
export const ImportContactsLgLight = gate('import-contacts', 'light', { size: 'lg' });
export const ImportContactsLgDark = gate('import-contacts', 'dark', { size: 'lg' });
export const StackedLight = gate('stacked', 'light');
export const StackedDark = gate('stacked', 'dark');
export const PublishingLight = gate('publishing', 'light');
export const PublishingDark = gate('publishing', 'dark');
