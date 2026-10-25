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
