/**
 * Stories de VALIDACAO do `nph-label`.
 *
 * Cada pagina prova uma parte do contrato aprovado (27-08-2026, 08-09-2026 e
 * 01-10-2026): a matriz `required` x `info` do conjunto `374:6`, a paridade com
 * o Figma nos dois esquemas de cor, o foco e o balao aberto do gatilho de
 * informacao (quadro `1194:1482`), a associacao com o controle e a ausencia de
 * estado proprio do texto.
 *
 * Todo texto visivel — titulo de secao, legenda e o conteudo de exemplo dos
 * rotulos — vem do dicionario de idioma, na chave `labelValidation`
 * (`docs/i18n.md`, "Storybook"). A story le `globals.locale`.
 *
 * O quadro escuro troca `data-nph-color-scheme`, que e o contrato publico de
 * tema fixado pela P20. Nenhuma story duplica componente por modo: a mesma
 * peca e mostrada nos dois contextos.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { userEvent } from 'storybook/test';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-label';

const meta: Meta = {
  title: 'Componentes/nph-label/Validação',
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

type Texts = ReturnType<typeof t>;

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

/** Rotulo com o gatilho de informacao, com o texto de exemplo do dicionario. */
function withInfo(v: Texts, required = false): TemplateResult {
  return html`<nph-label
    text=${v.sampleText}
    ?required=${required}
    info=${v.info}
    info-label=${v.infoLabel}
  ></nph-label>`;
}

/** As combinacoes de `required` e `info`, na ordem do conjunto `374:6`. */
function combinations(v: Texts): TemplateResult {
  return html`
    <nph-label text=${v.sampleText}></nph-label>
    <nph-label text=${v.sampleText} required></nph-label>
    ${withInfo(v)} ${withInfo(v, true)}
  `;
}

/**
 * A matriz inteira: `required` x `info`. Nao existe layout nem peso, e o texto
 * nao tem estado — o foco e so do gatilho de informacao.
 */
export const Matriz: Story = {
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`${section(v.matrixTitle, html`${caption(v.matrixCaption)} ${combinations(v)}`)}`);
  },
};

/**
 * Paridade com o Figma. O asterisco clareia sozinho no modo escuro porque
 * `status/error` tem um valor por esquema; nada e pintado a mao.
 */
export const ModoClaroEEscuro: Story = {
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(v.lightTitle, frame('light', combinations(v)))}
      ${section(v.darkTitle, frame('dark', combinations(v)))}
    `);
  },
};

/**
 * A razao de o componente nao usar Shadow DOM. Clicar no rotulo poe o cursor
 * no campo, e o leitor de tela anuncia o nome ao chegar nele.
 */
export const AssociacaoComOControle: Story = {
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(
        v.associationTitle,
        html`
          ${caption(v.associationCaption)}
          <div style="display:flex;flex-direction:column;gap:var(--nph-space-stack-tight)">
            <nph-label for="name-field" text=${v.sampleText} required></nph-label>
            <input
              id="name-field"
              required
              style="font-family:var(--nph-text-body-md-font-family);font-size:var(--nph-text-body-md-font-size);height:var(--nph-control-height-default);border:1px solid var(--nph-color-border);border-radius:var(--nph-radius-control);padding-inline:var(--nph-space-control-padding);background:var(--nph-color-background);color:var(--nph-color-foreground)"
            />
          </div>
          ${caption(v.requiredLegend)}
        `,
      )}
    `);
  },
};

/**
 * O que o rotulo NAO faz. Erro e desabilitado nao mudam o rotulo: quem mostra
 * os dois e o campo, e mais tarde o `nph-field`.
 */
export const OQueORotuloNaoFaz: Story = {
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(v.errorTitle, html`${caption(v.errorCaption)} <nph-label text=${v.sampleText} required></nph-label>`)}
      ${section(
        v.disabledTitle,
        html`
          ${caption(v.disabledCaption)}
          <div style="opacity:var(--nph-state-disabled-opacity)">
            <nph-label text=${v.sampleText} required></nph-label>
          </div>
        `,
      )}
    `);
  },
};

/**
 * O foco do gatilho: borda `focus/border` e halo `focus/halo` em volta do alvo
 * de 24 x 24 (L9). Aparece so pelo teclado: clique no campo de cima e use Tab.
 */
export const TriggerFocus: Story = {
  name: 'Foco do gatilho',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(
        v.focusTitle,
        html`
          ${caption(v.focusCaption)}
          <input aria-label=${v.tabStartLabel} />
          ${frame('light', withInfo(v))} ${frame('dark', withInfo(v))}
        `,
      )}
    `);
  },
};

/**
 * O balao aberto: o `nph-tooltip` abaixo do rotulo, alinhado ao inicio, a
 * `space/inline` (linha "aberto" do quadro). Abre por clique, Enter ou Espaco;
 * fecha com Esc, clique fora ou Tab para fora.
 */
export const Open: Story = {
  name: 'Aberto',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(
        v.openTitle,
        html`
          ${caption(v.openCaption)}
          <div style="padding-block-end:var(--nph-space-section)">${withInfo(v)}</div>
        `,
      )}
    `);
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>('nph-label .nph-label__info');
    if (trigger) {
      await userEvent.click(trigger);
    }
  },
};
