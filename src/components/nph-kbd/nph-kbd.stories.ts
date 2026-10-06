/**
 * Stories de VALIDACAO do `nph-kbd`.
 *
 * Provam a tecla unica e a combinacao, uma peca por tecla, como no quadro
 * `1193:20`, e a combinacao com os simbolos do macOS. As teclas sao conteudo
 * de exemplo e nao passam pelo dicionario de idioma: sao nome de tecla, igual
 * nos tres idiomas. O esquema de cor vem do seletor global do Storybook.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import './nph-kbd';

const meta: Meta = {
  title: 'Components/nph-kbd/Validation',
};

export default meta;

type Story = StoryObj;

const row = 'display: flex; align-items: center; gap: var(--nph-space-inline-tight); padding: var(--nph-space-section);';

/** Uma tecla por peca, pela propriedade text. */
export const SingleKey: Story = {
  name: 'Key',
  render: () => html`<div style=${row}>
    <nph-kbd text="K"></nph-kbd>
    <nph-kbd text="Esc"></nph-kbd>
    <nph-kbd text="Shift"></nph-kbd>
    <nph-kbd text="F2"></nph-kbd>
  </div>`,
};

/** A combinacao junta uma peca por tecla, lado a lado. */
export const Combination: Story = {
  name: 'Combination',
  render: () => html`<div style=${row}>
    <nph-kbd text="Ctrl"></nph-kbd>
    <nph-kbd text="Shift"></nph-kbd>
    <nph-kbd text="P"></nph-kbd>
  </div>`,
};

/**
 * A mesma combinacao no macOS, com os simbolos do sistema: Command, Shift e a
 * letra. O texto de cada tecla chega pronto da aplicacao consumidora, que
 * escolhe o conjunto pelo sistema de quem usa; a peca nao detecta o sistema.
 */
export const MacCombination: Story = {
  name: 'Combination on macOS',
  render: () => html`<div style=${row}>
    <nph-kbd text="⌘"></nph-kbd>
    <nph-kbd text="⇧"></nph-kbd>
    <nph-kbd text="P"></nph-kbd>
  </div>`,
};
