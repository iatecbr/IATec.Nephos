/**
 * Stories de VALIDACAO do `nph-spinner`.
 *
 * Provam os dois tamanhos, a semantica com e sem nome acessivel e a entrada
 * invalida. Nao ha texto explicativo: o rotulo "Salvando…" e conteudo de
 * exemplo do quadro `1195:22210`, que chega pronto da aplicacao. Ele vem do
 * dicionario de idioma, em `.storybook/i18n/`.
 *
 * O giro para com movimento reduzido: ligue a preferencia do sistema e abra a
 * story de novo. O esquema de cor vem do seletor global do Storybook.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-spinner';

const meta: Meta = {
  title: 'Components/nph-spinner/Validation',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Atalho: o dicionario das stories do `nph-spinner` no idioma escolhido. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).spinnerValidation;
}

const row = 'display: flex; align-items: center; gap: var(--nph-space-inline); padding: var(--nph-space-section);';

/** `sm` dentro de botao ou campo; `md` em area de conteudo. */
export const Sizes: Story = {
  name: 'Sizes',
  render: () => html`<div style=${row}>
    <nph-spinner size="sm"></nph-spinner>
    <nph-spinner size="md"></nph-spinner>
  </div>`,
};

/** Com texto ao lado, decorativo; sem texto, com nome acessivel. */
export const Accessibility: Story = {
  name: 'Accessibility',
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

/** `size="lg"` nao existe: nada e desenhado. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: () => html`<div style=${row}><nph-spinner size="lg"></nph-spinner></div>`,
};
