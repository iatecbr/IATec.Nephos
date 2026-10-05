/**
 * Stories de VALIDACAO do `nph-badge`.
 *
 * Provam a matriz aceita no Figma (quadro `1196:1100`, conjunto `878:30`): os
 * tipos nas duas enfases, com e sem icone. "Selo" e o texto padrao do
 * conjunto; as outras palavras sao so conteudo de exemplo desta pagina.
 *
 * O esquema de cor vem do seletor global do Storybook, aplicado na raiz. Nao ha
 * quadro escuro em subarvore: `status/on-solid` sai em `:root` e, numa
 * subarvore com outro esquema, ficaria com o valor da raiz (P68, limite L-a).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import './nph-badge';
import { NPH_BADGE_EMPHASES, NPH_BADGE_SEVERITIES } from './nph-badge';

const meta: Meta = {
  title: 'Componentes/nph-badge/Validação',
};

export default meta;

type Story = StoryObj;

/* Moldura de demonstracao. Nao e precedente para CSS de componente. */
const page = 'display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline-tight);';

function matrix(icon: string): TemplateResult {
  return html`<div style=${page}>
    ${NPH_BADGE_EMPHASES.map(
      (emphasis) => html`<div style=${row}>
        ${NPH_BADGE_SEVERITIES.map(
          (severity) => html`<nph-badge severity=${severity} emphasis=${emphasis} text="Selo" icon=${icon}></nph-badge>`,
        )}
      </div>`,
    )}
  </div>`;
}

/** Os tipos nas duas enfases, sem icone. */
export const Matrix: Story = {
  name: 'Matriz',
  render: () => matrix(''),
};

/** O icone vem antes do texto, em icon/size-sm, na cor do texto. */
export const WithIcon: Story = {
  name: 'Com ícone',
  render: () => matrix('circle-info'),
};

/** Uma ou duas palavras, numa linha so: o selo nao quebra. */
export const TwoWords: Story = {
  name: 'Duas palavras',
  render: () => html`<div style=${page}>
    <div style=${row}>
      <nph-badge severity="secondary" emphasis="light" text="Em análise"></nph-badge>
      <nph-badge severity="success" text="Aprovado" icon="circle-check"></nph-badge>
      <nph-badge severity="warn" emphasis="light" text="Falta assinatura"></nph-badge>
    </div>
  </div>`,
};
