/**
 * VALIDATION stories of `nph-label`.
 *
 * Each page proves a part of the contract approved on 27-08-2026: the
 * two-variant matrix, parity with Figma in both color schemes, the
 * association with the control and the absence of a state of its own.
 *
 * The dark frame switches `data-nph-color-scheme`, which is the public theme
 * contract set by P20. No story duplicates a component per mode: the same
 * piece is shown in both contexts.
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

/** Demo frame. Not valid as a precedent for component CSS. */
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

/** Frame that fixes a color scheme, to compare light and dark side by side. */
function frame(scheme: 'light' | 'dark', content: TemplateResult): TemplateResult {
  return html`<div
    data-nph-color-scheme=${scheme}
    style="padding:24px;border-radius:var(--nph-radius-control);background:var(--nph-color-background);display:flex;flex-direction:column;gap:16px"
  >
    ${content}
  </div>`;
}

/**
 * The whole matrix. There are TWO combinations: `required` false and true.
 * There is no layout, weight or state — all three were refused by a recorded
 * decision.
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
 * Parity with Figma. The asterisk lightens by itself in dark mode because
 * `status/error` has one value per scheme; nothing is painted by hand.
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
 * The reason the component does not use Shadow DOM. Clicking the label puts
 * the cursor in the field, and the screen reader announces the name on
 * reaching it.
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
 * What the label does NOT do. Error and disabled do not change the label: the
 * field shows both, and later `nph-field`.
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
