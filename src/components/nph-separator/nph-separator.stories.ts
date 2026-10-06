/**
 * Stories de VALIDACAO do `nph-separator`.
 *
 * Provam as duas orientacoes preenchendo o conteiner, como no quadro
 * `1196:674`: horizontal entre itens empilhados e vertical entre itens lado a
 * lado. Os rotulos sao conteudo de exemplo do quadro e vem do dicionario de
 * idioma, em `.storybook/i18n/`. O esquema de cor vem do seletor global do
 * Storybook.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-separator';

const meta: Meta = {
  title: 'Componentes/nph-separator/Validação',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Atalho: o dicionario das stories do `nph-separator` no idioma escolhido. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).separatorValidation;
}

const frame = 'padding: var(--nph-space-section); max-inline-size: var(--nph-layout-field-width);';

/** Entre itens empilhados, a linha preenche a largura. */
export const Horizontal: Story = {
  name: 'Horizontal',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${frame}>
      <div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
        <span>${v.profile}</span>
        <nph-separator></nph-separator>
        <span>${v.signOut}</span>
      </div>
    </div>`;
  },
};

/** Entre itens lado a lado, a linha preenche a altura. */
export const Vertical: Story = {
  name: 'Vertical',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${frame}>
      <div style="display: flex; gap: var(--nph-space-inline);">
        <span>${v.edit}</span>
        <nph-separator orientation="vertical"></nph-separator>
        <span>${v.delete}</span>
      </div>
    </div>`;
  },
};
