/**
 * Stories de VALIDACAO do `nph-tooltip`.
 *
 * Cada story mostra o balao aberto com o conteudo de exemplo do Figma
 * (quadro `1237:5`): uma linha e duas linhas. Nao ha texto explicativo, so o
 * texto do balao, que e conteudo e chega pronto da aplicacao.
 *
 * O esquema de cor vem do seletor global do Storybook, aplicado na raiz da
 * pagina. Nao ha quadro escuro em subarvore: a sombra `elevation/dropdown` sai
 * em `:root` e, numa subarvore com outro esquema, ficaria com a cor da raiz
 * (pendencia do gerador de tokens).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import './nph-tooltip';

const meta: Meta = {
  title: 'Componentes/nph-tooltip/Validação',
};

export default meta;

type Story = StoryObj;

function frame(text: string): TemplateResult {
  return html`<div style="padding: var(--nph-space-section);">
    <nph-tooltip open text=${text}></nph-tooltip>
  </div>`;
}

export const OneLine: Story = {
  name: 'Uma linha',
  render: () => frame('Explica o que o campo pede.'),
};

export const TwoLines: Story = {
  name: 'Duas linhas',
  render: () => frame('Use o nome como está no documento, sem abreviar nem trocar a ordem.'),
};
