/**
 * Stories de VALIDACAO do `nph-kbd`.
 *
 * Provam a tecla unica e a combinacao, uma peca por tecla, como no quadro
 * `1193:20`. As teclas sao conteudo de exemplo do quadro. O esquema de cor vem
 * do seletor global do Storybook.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import './nph-kbd';

const meta: Meta = {
  title: 'Componentes/nph-kbd/Validação',
};

export default meta;

type Story = StoryObj;

const row = 'display: flex; align-items: center; gap: var(--nph-space-inline-tight); padding: var(--nph-space-section);';

/** Uma tecla por peca, pela propriedade text. */
export const SingleKey: Story = {
  name: 'Tecla',
  render: () => html`<div style=${row}>
    <nph-kbd text="K"></nph-kbd>
    <nph-kbd text="Esc"></nph-kbd>
    <nph-kbd text="Shift"></nph-kbd>
    <nph-kbd text="F2"></nph-kbd>
  </div>`,
};

/** A combinacao junta uma peca por tecla, lado a lado. */
export const Combination: Story = {
  name: 'Combinação',
  render: () => html`<div style=${row}>
    <nph-kbd text="Ctrl"></nph-kbd>
    <nph-kbd text="Shift"></nph-kbd>
    <nph-kbd text="P"></nph-kbd>
  </div>`,
};
