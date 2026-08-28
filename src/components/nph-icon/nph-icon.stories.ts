/**
 * Stories de VALIDACAO do `nph-icon`.
 *
 * Cada pagina aqui prova uma parte do contrato aprovado: variante, tamanho,
 * heranca de cor, acessibilidade e entrada invalida. Sao stories renderizadas,
 * nao texto: o que elas mostram e o componente real se comportando.
 *
 * O texto explicativo vem do dicionario de idioma; os identificadores tecnicos
 * — `star`, `solid`, `size`, `eye` — aparecem literais, iguais em qualquer
 * idioma. A story e UNICA por caso: nao existe copia por idioma.
 *
 * A leitura do contrato e o catalogo visual ficam em
 * `Componentes/nph-icon/Docs`. A moldura de demonstracao vem de
 * `nph-icon.demo.ts` e nao vale como precedente para CSS de componente.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { CHAVE, IDIOMA_PADRAO, textos } from '../../../.storybook/i18n/index.js';
import './nph-icon';
import { NPH_ICON_SIZES } from './nph-icon.icons';
import { celula, legenda, pagina, secao } from './nph-icon.demo';

const meta: Meta = {
  title: 'Componentes/nph-icon/Validação',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

interface Contexto {
  globals?: Record<string, unknown>;
}

/** Atalho: o dicionario de validacao no idioma escolhido. */
function t(contexto: Contexto | undefined) {
  const idioma = (contexto?.globals?.[CHAVE] as string | undefined) ?? IDIOMA_PADRAO;
  return textos(idioma).validacao;
}

/** A unica peca do nucleo com duas artes. Nenhuma outra combinacao existe. */
export const Variantes: Story = {
  name: 'Variantes',
  render: (_args, contexto: Contexto) => {
    const v = t(contexto);
    return html`
      <div style=${pagina}>
        ${secao(
          v.variantesSecao,
          html`
            <div style="display: flex; gap: var(--nph-space-section);">
              <div style=${celula}>
                <nph-icon name="star" variant="regular" size="lg"></nph-icon>
                <span style=${legenda}>${v.variantesRegular}</span>
              </div>
              <div style=${celula}>
                <nph-icon name="star" variant="solid" size="lg"></nph-icon>
                <span style=${legenda}>${v.variantesSolid}</span>
              </div>
            </div>
          `,
        )}
        <p style=${legenda}>${v.variantesNota}</p>
      </div>
    `;
  },
};

/** Tamanho vem de token semantico. Nao existe valor livre. */
export const Tamanhos: Story = {
  name: 'Tamanhos',
  render: (_args, contexto: Contexto) => {
    const v = t(contexto);
    return html`
      <div style=${pagina}>
        <div style="display: flex; align-items: center; gap: var(--nph-space-section);">
          ${NPH_ICON_SIZES.map(
            (tamanho) => html`
              <div style=${celula}>
                <nph-icon name="gear" size=${tamanho}></nph-icon>
                <span style=${legenda}>size="${tamanho}" — icon/size-${tamanho}</span>
              </div>
            `,
          )}
        </div>
        ${secao(
          v.tamanhosTransbordoTitulo,
          html`
            <div style="display: flex; align-items: center; gap: var(--nph-space-section);">
              <div style=${celula}>
                <nph-icon name="eye" size="lg"></nph-icon>
                <span style=${legenda}>${v.tamanhosEye}</span>
              </div>
              <div style=${celula}>
                <nph-icon name="circle-check" size="lg"></nph-icon>
                <span style=${legenda}>${v.tamanhosCircleCheck}</span>
              </div>
            </div>
            <p style=${legenda}>${v.tamanhosNota}</p>
          `,
        )}
      </div>
    `;
  },
};

/** A cor nao e propriedade: vem de `currentColor`. */
export const HerancaDeCor: Story = {
  name: 'Herança de cor',
  render: (_args, contexto: Contexto) => {
    const v = t(contexto);
    return html`
      <div style=${pagina}>
        <div style="display: flex; align-items: center; gap: var(--nph-space-section);">
          <div style=${celula}>
            <nph-icon name="circle-info" size="lg"></nph-icon>
            <span style=${legenda}>color/foreground</span>
          </div>
          <div style="${celula} color: var(--nph-color-muted-foreground);">
            <nph-icon name="circle-info" size="lg"></nph-icon>
            <span style=${legenda}>color/muted-foreground</span>
          </div>
          <div
            style="${celula} color: var(--nph-color-primary-foreground);
                   background: var(--nph-color-primary);
                   padding: var(--nph-space-control-padding);
                   border-radius: var(--nph-radius-control);"
          >
            <nph-icon name="circle-info" size="lg"></nph-icon>
            <span style="font-family: monospace; font-size: 12px;">primary</span>
          </div>
        </div>
        <p style=${legenda}>${v.corNota}</p>
      </div>
    `;
  },
};

/** Decorativo ao lado de texto; nomeado quando anda sozinho. */
export const Acessibilidade: Story = {
  name: 'Acessibilidade',
  render: (_args, contexto: Contexto) => {
    const v = t(contexto);
    return html`
      <div style=${pagina}>
        ${secao(
          v.acessDecorativoTitulo,
          html`
            <div style=${celula}>
              <nph-icon name="trash-can" size="sm"></nph-icon>
              <span>${v.acessDecorativoExemplo}</span>
            </div>
            <p style=${legenda}>${v.acessDecorativoNota}</p>
          `,
        )}
        ${secao(
          v.acessNomeadoTitulo,
          html`
            <nph-icon name="magnifying-glass" size="md" label=${v.acessNomeadoRotulo}></nph-icon>
            <p style=${legenda}>${v.acessNomeadoNota}</p>
          `,
        )}
        <p style=${legenda}>${v.acessFocoNota}</p>
      </div>
    `;
  },
};

/** Entrada invalida nao renderiza e reclama no console em desenvolvimento. */
export const EntradaInvalida: Story = {
  name: 'Entrada inválida',
  render: (_args, contexto: Contexto) => {
    const v = t(contexto);
    return html`
      <div style=${pagina}>
        <p style=${legenda}>${v.invalidaIntro}</p>
        <ul style="${legenda} list-style: none; padding: 0; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
          <li>
            name="rocket" size="sm" — ${v.invalidaCasos[0]}
            <nph-icon name="rocket" size="sm"></nph-icon>
          </li>
          <li>
            name="check" variant="solid" size="sm" — ${v.invalidaCasos[1]}
            <nph-icon name="check" variant="solid" size="sm"></nph-icon>
          </li>
          <li>
            name="check" size="xl" — ${v.invalidaCasos[2]}
            <nph-icon name="check" size="xl"></nph-icon>
          </li>
          <li>
            name="check" — ${v.invalidaCasos[3]}
            <nph-icon name="check"></nph-icon>
          </li>
        </ul>
      </div>
    `;
  },
};
