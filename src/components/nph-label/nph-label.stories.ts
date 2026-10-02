/**
 * Stories de VALIDACAO do `nph-label`.
 *
 * Cada pagina prova uma parte do contrato aprovado em 27-08-2026: a matriz de
 * duas variantes, a paridade com o Figma nos dois esquemas de cor, a
 * associacao com o controle e a ausencia de estado proprio.
 *
 * O quadro escuro troca `data-nph-color-scheme`, que e o contrato publico de
 * tema fixado pela P20. Nenhuma story duplica componente por modo: a mesma
 * peca e mostrada nos dois contextos.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import './nph-label';

const meta: Meta = {
  title: 'Componentes/nph-label/Validação',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

/** Moldura de demonstracao. Nao vale como precedente para CSS de componente. */
function page(content: TemplateResult): TemplateResult {
  return html`<div
    style="padding:32px;display:flex;flex-direction:column;gap:32px;background:var(--nph-color-background)"
  >
    ${content}
  </div>`;
}

function section(title: string, content: TemplateResult): TemplateResult {
  return html`<section style="display:flex;flex-direction:column;gap:12px">
    <h2
      style="margin:0;font-family:var(--nph-text-heading-sm-font-family);font-size:var(--nph-text-heading-sm-font-size);font-weight:var(--nph-text-heading-sm-font-weight);line-height:var(--nph-text-heading-sm-line-height);color:var(--nph-color-foreground)"
    >
      ${title}
    </h2>
    ${content}
  </section>`;
}

function caption(text: string): TemplateResult {
  return html`<p
    style="margin:0;font-family:var(--nph-text-body-sm-font-family);font-size:var(--nph-text-body-sm-font-size);line-height:var(--nph-text-body-sm-line-height);color:var(--nph-color-muted-foreground)"
  >
    ${text}
  </p>`;
}

/** Quadro que fixa um esquema de cor, para comparar claro e escuro lado a lado. */
function frame(scheme: 'light' | 'dark', content: TemplateResult): TemplateResult {
  return html`<div
    data-nph-color-scheme=${scheme}
    style="padding:24px;border-radius:var(--nph-radius-control);background:var(--nph-color-background);display:flex;flex-direction:column;gap:16px"
  >
    ${content}
  </div>`;
}

/**
 * A matriz inteira. Sao DUAS combinacoes: `required` false e true. Nao existe
 * layout, peso nem estado — as tres foram recusadas por decisao registrada.
 */
export const Matriz: Story = {
  render: () =>
    page(html`
      ${section(
        'Matriz — 2 combinações',
        html`
          ${caption('required é a única propriedade do componente.')}
          <nph-label text="Nome completo"></nph-label>
          <nph-label text="Nome completo" required></nph-label>
        `,
      )}
    `),
};

/**
 * Paridade com o Figma. O asterisco clareia sozinho no modo escuro porque
 * `status/error` tem um valor por esquema; nada e pintado a mao.
 */
export const ModoClaroEEscuro: Story = {
  render: () =>
    page(html`
      ${section(
        'Modo claro',
        frame(
          'light',
          html`
            <nph-label text="Nome completo"></nph-label>
            <nph-label text="Nome completo" required></nph-label>
          `,
        ),
      )}
      ${section(
        'Modo escuro',
        frame(
          'dark',
          html`
            <nph-label text="Nome completo"></nph-label>
            <nph-label text="Nome completo" required></nph-label>
          `,
        ),
      )}
    `),
};

/**
 * A razao de o componente nao usar Shadow DOM. Clicar no rotulo poe o cursor
 * no campo, e o leitor de tela anuncia o nome ao chegar nele.
 */
export const AssociacaoComOControle: Story = {
  render: () =>
    page(html`
      ${section(
        'Associação com o controle',
        html`
          ${caption('Clique no rótulo: o cursor vai para o campo.')}
          <div style="display:flex;flex-direction:column;gap:var(--nph-space-stack-tight)">
            <nph-label for="name-field" text="Nome completo" required></nph-label>
            <input
              id="name-field"
              required
              style="font-family:var(--nph-text-body-md-font-family);font-size:var(--nph-text-body-md-font-size);height:var(--nph-control-height-default);border:1px solid var(--nph-color-border);border-radius:var(--nph-radius-control);padding-inline:var(--nph-space-control-padding);background:var(--nph-color-background);color:var(--nph-color-foreground)"
            />
          </div>
          ${caption('Campos com * são obrigatórios.')}
        `,
      )}
    `),
};

/**
 * O que o rotulo NAO faz. Erro e desabilitado nao mudam o rotulo: quem mostra
 * os dois e o campo, e mais tarde o `nph-field`.
 */
export const OQueORotuloNaoFaz: Story = {
  render: () =>
    page(html`
      ${section(
        'Erro não muda o rótulo',
        html`
          ${caption(
            'O rótulo permanece em color/foreground. O erro aparece no campo e na mensagem abaixo dele — nunca no rótulo.',
          )}
          <nph-label text="Nome completo" required></nph-label>
        `,
      )}
      ${section(
        'Desabilitado não é estado do rótulo',
        html`
          ${caption(
            'O nph-field aplicará state/disabled-opacity ao controle inteiro. O rótulo não tem estado próprio.',
          )}
          <div style="opacity:var(--nph-state-disabled-opacity)">
            <nph-label text="Nome completo" required></nph-label>
          </div>
        `,
      )}
    `),
};
