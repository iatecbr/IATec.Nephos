/**
 * Stories de VALIDACAO do `nph-separator`.
 *
 * Provam as duas orientacoes preenchendo o conteiner, como no quadro
 * `1196:674`: horizontal entre itens empilhados e vertical entre itens lado a
 * lado. Os rotulos sao conteudo de exemplo do quadro. O esquema de cor vem do
 * seletor global do Storybook.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import './nph-separator';

const meta: Meta = {
  title: 'Componentes/nph-separator/Validação',
};

export default meta;

type Story = StoryObj;

const frame = 'padding: var(--nph-space-section); max-inline-size: var(--nph-layout-field-width);';

/** Entre itens empilhados, a linha preenche a largura. */
export const Horizontal: Story = {
  name: 'Horizontal',
  render: () => html`<div style=${frame}>
    <div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
      <span>Perfil</span>
      <nph-separator></nph-separator>
      <span>Sair</span>
    </div>
  </div>`,
};

/** Entre itens lado a lado, a linha preenche a altura. */
export const Vertical: Story = {
  name: 'Vertical',
  render: () => html`<div style=${frame}>
    <div style="display: flex; gap: var(--nph-space-inline);">
      <span>Editar</span>
      <nph-separator orientation="vertical"></nph-separator>
      <span>Excluir</span>
    </div>
  </div>`,
};
