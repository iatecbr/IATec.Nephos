/**
 * Stories de VALIDACAO do `nph-spinner`.
 *
 * Provam os dois tamanhos, a semantica com e sem nome acessivel e a entrada
 * invalida. Nao ha texto explicativo: o rotulo "Salvando…" e conteudo de
 * exemplo do quadro `1195:22210`, que chega pronto da aplicacao.
 *
 * O giro para com movimento reduzido: ligue a preferencia do sistema e abra a
 * story de novo. O esquema de cor vem do seletor global do Storybook.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import './nph-spinner';

const meta: Meta = {
  title: 'Componentes/nph-spinner/Validação',
};

export default meta;

type Story = StoryObj;

const row = 'display: flex; align-items: center; gap: var(--nph-space-inline); padding: var(--nph-space-section);';

/** `sm` dentro de botao ou campo; `md` em area de conteudo. */
export const Sizes: Story = {
  name: 'Tamanhos',
  render: () => html`<div style=${row}>
    <nph-spinner size="sm"></nph-spinner>
    <nph-spinner size="md"></nph-spinner>
  </div>`,
};

/** Com texto ao lado, decorativo; sem texto, com nome acessivel. */
export const Accessibility: Story = {
  name: 'Acessibilidade',
  render: () => html`<div style=${row}>
    <span style="display: inline-flex; align-items: center; gap: var(--nph-space-inline-tight);">
      <nph-spinner></nph-spinner>Salvando…
    </span>
    <nph-spinner label="Salvando"></nph-spinner>
  </div>`,
};

/** `size="lg"` nao existe: nada e desenhado. */
export const InvalidInput: Story = {
  name: 'Entrada inválida',
  render: () => html`<div style=${row}><nph-spinner size="lg"></nph-spinner></div>`,
};
