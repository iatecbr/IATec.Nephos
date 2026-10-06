/**
 * Stories de VALIDACAO do `nph-badge`.
 *
 * Provam a matriz aceita no Figma (quadro `1196:1100`, conjunto `878:30`): os
 * tipos nas duas enfases, com e sem icone. Todo texto visivel, inclusive o
 * conteudo de exemplo dos selos, vem do dicionario de idioma, na chave
 * `badgeValidation` (`docs/i18n.md`, "Storybook").
 *
 * O esquema de cor vem do seletor global do Storybook, aplicado na raiz. Numa
 * parte da tela com outra marca e outro esquema, no mesmo elemento,
 * `status/on-solid` resolve o valor local (P67).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-badge';
import { NPH_BADGE_EMPHASES, NPH_BADGE_SEVERITIES } from './nph-badge';

const meta: Meta = {
  title: 'Componentes/nph-badge/Validação',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Atalho: o dicionario destas stories no idioma escolhido. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).badgeValidation;
}

/* Moldura de demonstracao. Nao e precedente para CSS de componente. */
const page = 'display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline-tight);';

function matrix(text: string, icon: string): TemplateResult {
  return html`<div style=${page}>
    ${NPH_BADGE_EMPHASES.map(
      (emphasis) => html`<div style=${row}>
        ${NPH_BADGE_SEVERITIES.map(
          (severity) => html`<nph-badge severity=${severity} emphasis=${emphasis} text=${text} icon=${icon}></nph-badge>`,
        )}
      </div>`,
    )}
  </div>`;
}

/** Os tipos nas duas enfases, sem icone. */
export const Matrix: Story = {
  name: 'Matriz',
  render: (_args, context: GlobalsContext) => matrix(t(context).sample, ''),
};

/** O icone vem antes do texto, em icon/size-sm, na cor do texto. */
export const WithIcon: Story = {
  name: 'Com ícone',
  render: (_args, context: GlobalsContext) => matrix(t(context).sample, 'circle-info'),
};

/** Uma ou duas palavras, numa linha so: o selo nao quebra. */
export const TwoWords: Story = {
  name: 'Duas palavras',
  render: (_args, context: GlobalsContext) => {
    const [review, approved, signature] = t(context).twoWords as string[];
    return html`<div style=${page}>
      <div style=${row}>
        <nph-badge severity="secondary" emphasis="light" text=${review}></nph-badge>
        <nph-badge severity="success" text=${approved} icon="circle-check"></nph-badge>
        <nph-badge severity="warn" emphasis="light" text=${signature}></nph-badge>
      </div>
    </div>`;
  },
};
