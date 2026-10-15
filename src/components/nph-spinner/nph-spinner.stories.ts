/**
 * VALIDATION stories of `nph-spinner`.
 *
 * They prove the two sizes, the semantics with and without an accessible name,
 * and invalid input. Each page opens with what it proves and points to the
 * sheet, since the piece has no Docs page; the sizes are labelled by attribute,
 * as in the Docs matrix. The saving label is example content from frame
 * `1195:22210`, which arrives ready from the application. Every text comes from
 * the language dictionary, in `.storybook/i18n/`.
 *
 * The spin stops with reduced motion: turn on the system preference and open
 * the story again. The color scheme comes from the global Storybook selector.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-spinner';

const meta: Meta = {
  title: 'Components/nph-spinner/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the `nph-spinner` stories dictionary in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).spinnerValidation;
}

const row = 'display: flex; align-items: center; gap: var(--nph-space-inline);';

const page = (storyId: string) => ({
  piece: 'nph-spinner',
  storyId: `components-nph-spinner-validation--${storyId}`,
  sheet: true,
});

/** `sm` inside a button or field; `md` in a content area. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) => {
    const { piece, storyId } = page('sizes');
    return validationPage(
      context,
      page('sizes'),
      matrix(validationTitle(context, piece, storyId), [], [
        { label: 'size: sm', cells: [html`<nph-spinner size="sm"></nph-spinner>`] },
        { label: 'size: md', cells: [html`<nph-spinner size="md"></nph-spinner>`] },
      ]),
    );
  },
};

/** With text beside it, decorative; without text, with an accessible name. */
export const Accessibility: Story = {
  name: 'Accessibility',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('accessibility'),
      html`<div style=${row}>
        <span style="display: inline-flex; align-items: center; gap: var(--nph-space-inline-tight);">
          <nph-spinner></nph-spinner>${v.savingText}
        </span>
        <nph-spinner label=${v.savingLabel}></nph-spinner>
      </div>`,
    );
  },
};

/** `size="lg"` does not exist: nothing is drawn. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('invalid-input'), html`<div style=${row}><nph-spinner size="lg"></nph-spinner></div>`),
};
