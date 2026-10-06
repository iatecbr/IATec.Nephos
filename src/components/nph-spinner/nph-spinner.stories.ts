/**
 * VALIDATION stories of `nph-spinner`.
 *
 * They prove the two sizes, the semantics with and without an accessible name,
 * and invalid input. There is no explanatory text: the saving label is example
 * content from frame `1195:22210`, which arrives ready from the application. It
 * comes from the language dictionary, in `.storybook/i18n/`.
 *
 * The spin stops with reduced motion: turn on the system preference and open
 * the story again. The color scheme comes from the global Storybook selector.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-spinner';

const meta: Meta = {
  title: 'Componentes/nph-spinner/Validação',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the `nph-spinner` stories dictionary in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).spinnerValidation;
}

const row = 'display: flex; align-items: center; gap: var(--nph-space-inline); padding: var(--nph-space-section);';

/** `sm` inside a button or field; `md` in a content area. */
export const Sizes: Story = {
  name: 'Tamanhos',
  render: () => html`<div style=${row}>
    <nph-spinner size="sm"></nph-spinner>
    <nph-spinner size="md"></nph-spinner>
  </div>`,
};

/** With text beside it, decorative; without text, with an accessible name. */
export const Accessibility: Story = {
  name: 'Acessibilidade',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${row}>
      <span style="display: inline-flex; align-items: center; gap: var(--nph-space-inline-tight);">
        <nph-spinner></nph-spinner>${v.savingText}
      </span>
      <nph-spinner label=${v.savingLabel}></nph-spinner>
    </div>`;
  },
};

/** `size="lg"` does not exist: nothing is drawn. */
export const InvalidInput: Story = {
  name: 'Entrada inválida',
  render: () => html`<div style=${row}><nph-spinner size="lg"></nph-spinner></div>`,
};
