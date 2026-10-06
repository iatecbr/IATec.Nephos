/**
 * Stories de VALIDACAO do `nph-tooltip`.
 *
 * Cada story mostra o balao aberto com o conteudo de exemplo do Figma
 * (quadro `1237:5`): uma linha e duas linhas. Nao ha texto explicativo, so o
 * texto do balao. Ele vem do dicionario de idioma, na chave
 * `tooltipValidation` (`docs/i18n.md`, "Storybook"), e em cada idioma o texto
 * de duas linhas ocupa duas linhas.
 *
 * O esquema de cor vem do seletor global do Storybook, aplicado na raiz da
 * pagina.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-tooltip';

const meta: Meta = {
  title: 'Componentes/nph-tooltip/Validação',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Atalho: o dicionario destas stories no idioma escolhido. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).tooltipValidation;
}

function frame(text: string): TemplateResult {
  return html`<div style="padding: var(--nph-space-section);">
    <nph-tooltip open text=${text}></nph-tooltip>
  </div>`;
}

export const OneLine: Story = {
  name: 'Uma linha',
  render: (_args, context: GlobalsContext) => frame(t(context).oneLine),
};

export const TwoLines: Story = {
  name: 'Duas linhas',
  render: (_args, context: GlobalsContext) => frame(t(context).twoLines),
};
