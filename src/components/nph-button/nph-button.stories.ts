/**
 * Stories de VALIDACAO do `nph-button`.
 *
 * Provam a matriz aceita no Figma (quadro `1197:5449`, conjuntos `461:13009` e
 * `498:15671`): os pares de tipo e enfase (B1), os tres tamanhos, os icones de
 * inicio e de fim, o so icone e os estados disabled e loading. O hover e o foco
 * sao estados de interacao: aparecem passando o mouse e navegando com Tab. O
 * texto de exemplo dos botoes vem do dicionario de idioma, na chave
 * `buttonValidation` (`docs/i18n.md`, "Storybook"); na matriz, o texto e o
 * nome tecnico do tipo.
 *
 * O esquema de cor vem do seletor global do Storybook, aplicado na raiz. Numa
 * parte da tela com outra marca e outro esquema, no mesmo elemento,
 * `status/on-solid` e `focus/halo` resolvem o valor local (P67).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-button';
import { NPH_BUTTON_EMPHASES, NPH_BUTTON_SEVERITIES, NPH_BUTTON_SIZES } from './nph-button';
import type { NphButtonEmphasis, NphButtonSeverity } from './nph-button';

const meta: Meta = {
  title: 'Componentes/nph-button/Validação',
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Atalho: o dicionario destas stories no idioma escolhido. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).buttonValidation;
}

/* Moldura de demonstracao. Nao e precedente para CSS de componente. */
const page = 'display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

/** Os pares que existem (B1): solid em todos; as outras enfases so em tres tipos. */
function pairs(): ReadonlyArray<readonly [NphButtonSeverity, NphButtonEmphasis]> {
  return NPH_BUTTON_EMPHASES.flatMap((emphasis) =>
    NPH_BUTTON_SEVERITIES.filter(
      (severity) => emphasis === 'solid' || ['primary', 'secondary', 'danger'].includes(severity),
    ).map((severity) => [severity, emphasis] as const),
  );
}

function byEmphasis(render: (severity: NphButtonSeverity, emphasis: NphButtonEmphasis) => TemplateResult): TemplateResult {
  return html`<div style=${page}>
    ${NPH_BUTTON_EMPHASES.map(
      (emphasis) => html`<div style=${row}>
        ${pairs()
          .filter(([, e]) => e === emphasis)
          .map(([severity]) => render(severity, emphasis))}
      </div>`,
    )}
  </div>`;
}

/** Cada par de tipo e enfase que existe, no tamanho default. Passe o mouse para o hover. */
export const Matrix: Story = {
  name: 'Matriz',
  render: () =>
    byEmphasis(
      (severity, emphasis) =>
        html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${severity}></nph-button>`,
    ),
};

/** Os tres tamanhos, com texto e so icone. O texto e label-md em todos. */
export const Sizes: Story = {
  name: 'Tamanhos',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      ${NPH_BUTTON_SIZES.map(
        (size) => html`<div style=${row}>
          <nph-button size=${size} text=${v.save}></nph-button>
          <nph-button size=${size} text=${v.add} icon-start="plus"></nph-button>
          <nph-button size=${size} icon-start="xmark" label=${v.close}></nph-button>
        </div>`,
      )}
    </div>`;
  },
};

/** Icone de inicio, de fim e os dois juntos (B6), em icon/size-sm. */
export const Icons: Story = {
  name: 'Ícones',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`<div style=${page}>
      <div style=${row}>
        <nph-button size="default" text=${v.add} icon-start="plus"></nph-button>
        <nph-button size="default" emphasis="outline" text=${v.options} icon-end="chevron-down"></nph-button>
        <nph-button size="default" emphasis="light" text=${v.filter} icon-start="filter" icon-end="chevron-down"></nph-button>
      </div>
    </div>`;
  },
};

/** Desabilitado: o botao inteiro em state/disabled-opacity, fora do Tab. */
export const Disabled: Story = {
  name: 'Desabilitado',
  render: () =>
    byEmphasis(
      (severity, emphasis) =>
        html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${severity} disabled></nph-button>`,
    ),
};

/** Carregando: o girador no lugar do icone de inicio; o texto fica. */
export const Loading: Story = {
  name: 'Carregando',
  render: (_args, context: GlobalsContext) => html`${byEmphasis(
    (severity, emphasis) =>
      html`<nph-button severity=${severity} emphasis=${emphasis} size="default" text=${severity} loading></nph-button>`,
  )}
    <div style=${page}>
      <div style=${row}>
        ${NPH_BUTTON_SIZES.map(
          (size) => html`<nph-button size=${size} icon-start="xmark" label=${t(context).close} loading></nph-button>`,
        )}
      </div>
    </div>`,
};
