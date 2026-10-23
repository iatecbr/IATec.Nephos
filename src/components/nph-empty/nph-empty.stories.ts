/**
 * VALIDATION stories of `nph-empty`.
 *
 * Each story proves a part of the contract accepted in Figma (board `1463:25260`, frame
 * `2003:688`) and of P84: the heading with the description, the heading only, the
 * illustration that follows the color scheme, the contrast on the two surfaces of the
 * board, the `nph-combobox` list in `state=vazio` (a frame until DSA-46) and the invalid
 * input. Every story shows light and dark mode side by side, so the illustration switch is
 * visible in each one. The heading and the description are content and arrive ready from
 * the application. They come from the language dictionary, under the `emptyValidation`
 * key (`docs/i18n.md`, "Storybook"). The page of each story says what it proves.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { localeOf, validationPage } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { bothModes, comboboxList, empty } from './nph-empty.demo';

const meta: Meta = {
  title: 'Components/nph-empty/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).emptyValidation;
}

function frame(context: GlobalsContext | undefined, storyId: string, content: TemplateResult): TemplateResult {
  return validationPage(context, { piece: 'nph-empty', storyId: `components-nph-empty-validation--${storyId}` }, content);
}

function caption(text: string): TemplateResult {
  return html`<p
    style="margin: 0; font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height); color: var(--nph-color-muted-foreground);"
  >
    ${text}
  </p>`;
}

/** The heading and the description, the default of the board, in light and in dark mode. */
export const WithDescription: Story = {
  name: 'With description',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'with-description',
      bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => empty({ heading: v.heading, description: v.description })),
    );
  },
};

/** The heading only, when there is nothing to suggest (the description off). */
export const HeadingOnly: Story = {
  name: 'Heading only',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'heading-only',
      bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => empty({ heading: v.areaHeading })),
    );
  },
};

/** The texts pass 4.5:1 on color/background and on color/popover, in light and in dark mode. */
export const Surfaces: Story = {
  name: 'Surfaces',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const sample = (): TemplateResult => empty({ heading: v.heading, description: v.description });
    return frame(
      context,
      'surfaces',
      html`${caption(v.backgroundCaption)} ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, sample)}
        ${caption(v.popoverCaption)} ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, sample, '--nph-color-popover')}`,
    );
  },
};

/** The search with no result in the nph-combobox list, in a frame until DSA-46 brings the piece. */
export const ComboboxList: Story = {
  name: 'Combobox list',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'combobox-list',
      html`${caption(v.comboboxCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          comboboxList(empty({ heading: v.heading, description: v.description }), v.listLabel),
        )}`,
    );
  },
};

/** Without a heading the piece draws nothing: there is no visual fallback. */
export const InvalidHeading: Story = {
  name: 'Invalid heading',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'invalid-heading',
      html`${caption(v.invalidCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => empty({ heading: '', description: v.description }))}`,
    );
  },
};
