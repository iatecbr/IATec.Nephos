/**
 * FIXTURES of `nph-command`: one example, open, alone in the window.
 *
 * It proves nothing by itself and is hidden from the sidebar (no `dev` tag). The Validation and Docs
 * pages embed it in an `<iframe>`, one per mode, because a modal dialog covers the window it opens in
 * (`nph-command.demo.ts` and P123). The example comes from the `example` arg, the footer from the
 * `footer` arg, the mode and the language from the globals of the frame's address. Every visible text
 * comes from the language dictionary, under the `commandValidation` key. The typed text of an example
 * (`search`, `empty`) is written in the field by the `play` function, as the person would.
 */
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { localeOf } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { EXAMPLES, example, typeQuery } from './nph-command.demo';
import type { Example as ExampleName, Variant } from './nph-command.demo';

interface FixtureArgs {
  example: ExampleName;
  footer?: 'on' | 'off';
}

const meta: Meta<FixtureArgs> = {
  title: 'Components/nph-command/Fixtures',
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    example: { control: 'select', options: [...EXAMPLES] },
    footer: { control: 'select', options: ['on', 'off'] },
  },
  args: {
    example: 'results',
  },
};

export default meta;

/** One example, open, in the mode and the language of the frame. */
export const Example: StoryObj<FixtureArgs> = {
  name: 'Example',
  render: (args, context: GlobalsContext) => {
    const variant: Variant = args.footer ? { footer: args.footer } : {};
    return example(args.example, translations(localeOf(context)).commandValidation, variant);
  },
  play: async ({ canvasElement }) => {
    await typeQuery(canvasElement);
  },
};

/*
 * The examples the frames show, composed directly for the accessibility gate (P72). The Validation
 * and Docs pages load each example through `iframe.html`, which the Vitest run does not serve, and
 * axe does not read inside a frame: without these stories, the gate would not check the palettes of
 * the frames. One story per example and variant the pages frame, in each mode, through the
 * `colorScheme` global of the story. Hidden, as the rest of this page.
 */
type Mode = 'light' | 'dark';

function gate(name: ExampleName, mode: Mode, variant: Omit<FixtureArgs, 'example'> = {}): StoryObj<FixtureArgs> {
  return { ...Example, args: { example: name, ...variant }, globals: { colorScheme: mode } };
}

export const ResultsFooterOnLight = gate('results', 'light', { footer: 'on' });
export const ResultsFooterOnDark = gate('results', 'dark', { footer: 'on' });
export const ResultsFooterOffLight = gate('results', 'light', { footer: 'off' });
export const ResultsFooterOffDark = gate('results', 'dark', { footer: 'off' });
export const GroupsFooterOnLight = gate('groups', 'light', { footer: 'on' });
export const GroupsFooterOnDark = gate('groups', 'dark', { footer: 'on' });
export const GroupsFooterOffLight = gate('groups', 'light', { footer: 'off' });
export const GroupsFooterOffDark = gate('groups', 'dark', { footer: 'off' });
export const SearchFooterOnLight = gate('search', 'light', { footer: 'on' });
export const SearchFooterOnDark = gate('search', 'dark', { footer: 'on' });
export const SearchFooterOffLight = gate('search', 'light', { footer: 'off' });
export const SearchFooterOffDark = gate('search', 'dark', { footer: 'off' });
export const EmptyFooterOnLight = gate('empty', 'light', { footer: 'on' });
export const EmptyFooterOnDark = gate('empty', 'dark', { footer: 'on' });
export const EmptyFooterOffLight = gate('empty', 'light', { footer: 'off' });
export const EmptyFooterOffDark = gate('empty', 'dark', { footer: 'off' });
export const LoadingFooterOnLight = gate('loading', 'light', { footer: 'on' });
export const LoadingFooterOnDark = gate('loading', 'dark', { footer: 'on' });
export const LoadingFooterOffLight = gate('loading', 'light', { footer: 'off' });
export const LoadingFooterOffDark = gate('loading', 'dark', { footer: 'off' });
export const DisabledLight = gate('disabled', 'light');
export const DisabledDark = gate('disabled', 'dark');
export const DestructiveLight = gate('destructive', 'light');
export const DestructiveDark = gate('destructive', 'dark');
