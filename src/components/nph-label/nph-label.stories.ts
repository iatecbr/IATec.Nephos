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
 *
 * Todo texto visivel, inclusive o conteudo de exemplo do rotulo, vem do
 * dicionario de idioma, na chave `labelValidation` (`docs/i18n.md`, "Storybook").
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-label';

const meta: Meta = {
  title: 'Components/nph-label/Validation',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Atalho: o dicionario destas stories no idioma escolhido. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).labelValidation;
}

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
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(
        v.matrixTitle,
        html`
          ${caption(v.matrixCaption)}
          <nph-label text=${v.fullName}></nph-label>
          <nph-label text=${v.fullName} required></nph-label>
        `,
      )}
    `);
  },
};

/**
 * Paridade com o Figma. O asterisco clareia sozinho no modo escuro porque
 * `status/error` tem um valor por esquema; nada e pintado a mao.
 */
export const LightAndDarkMode: Story = {
  name: 'Light and dark mode',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(
        v.lightMode,
        frame(
          'light',
          html`
            <nph-label text=${v.fullName}></nph-label>
            <nph-label text=${v.fullName} required></nph-label>
          `,
        ),
      )}
      ${section(
        v.darkMode,
        frame(
          'dark',
          html`
            <nph-label text=${v.fullName}></nph-label>
            <nph-label text=${v.fullName} required></nph-label>
          `,
        ),
      )}
    `);
  },
};

/**
 * A razao de o componente nao usar Shadow DOM. Clicar no rotulo poe o cursor
 * no campo, e o leitor de tela anuncia o nome ao chegar nele.
 */
export const AssociationWithControl: Story = {
  name: 'Association with the control',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(
        v.associationTitle,
        html`
          ${caption(v.associationCaption)}
          <div style="display:flex;flex-direction:column;gap:var(--nph-space-stack-tight)">
            <nph-label for="name-field" text=${v.fullName} required></nph-label>
            <input
              id="name-field"
              required
              style="font-family:var(--nph-text-body-md-font-family);font-size:var(--nph-text-body-md-font-size);height:var(--nph-control-height-default);border:1px solid var(--nph-color-border);border-radius:var(--nph-radius-control);padding-inline:var(--nph-space-control-padding);background:var(--nph-color-background);color:var(--nph-color-foreground)"
            />
          </div>
          ${caption(v.requiredNote)}
        `,
      )}
    `);
  },
};

/**
 * O que o rotulo NAO faz. Erro e desabilitado nao mudam o rotulo: quem mostra
 * os dois e o campo, e mais tarde o `nph-field`.
 */
export const WhatTheLabelDoesNotDo: Story = {
  name: 'What the label does not do',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(
        v.errorTitle,
        html`
          ${caption(v.errorCaption)}
          <nph-label text=${v.fullName} required></nph-label>
        `,
      )}
      ${section(
        v.disabledTitle,
        html`
          ${caption(v.disabledCaption)}
          <div style="opacity:var(--nph-state-disabled-opacity)">
            <nph-label text=${v.fullName} required></nph-label>
          </div>
        `,
      )}
    `);
  },
};
