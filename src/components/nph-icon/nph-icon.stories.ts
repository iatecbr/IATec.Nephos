/**
 * Stories de VALIDACAO do `nph-icon`.
 *
 * Cada pagina aqui prova uma parte do contrato aprovado: variante, tamanho,
 * heranca de cor, acessibilidade e entrada invalida. Sao stories renderizadas,
 * nao texto: o que elas mostram e o componente real se comportando.
 *
 * A leitura do contrato e o catalogo visual ficam em
 * `Componentes/nph-icon/Docs`. A moldura de demonstracao vem de
 * `nph-icon.demo.ts` e nao vale como precedente para CSS de componente.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

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

/** A unica peca do nucleo com duas artes. Nenhuma outra combinacao existe. */
export const Variantes: Story = {
  name: 'Variantes',
  render: () => html`
    <div style=${pagina}>
      ${secao(
        'star',
        html`
          <div style="display: flex; gap: var(--nph-space-section);">
            <div style=${celula}>
              <nph-icon name="star" variant="regular" size="lg"></nph-icon>
              <span style=${legenda}>regular — nao favoritado</span>
            </div>
            <div style=${celula}>
              <nph-icon name="star" variant="solid" size="lg"></nph-icon>
              <span style=${legenda}>solid — favoritado</span>
            </div>
          </div>
        `,
      )}
      <p style=${legenda}>
        solid existe somente para star. Qualquer outro nome com variant="solid" nao renderiza.
      </p>
    </div>
  `,
};

/** Tamanho vem de token semantico. Nao existe valor livre. */
export const Tamanhos: Story = {
  name: 'Tamanhos',
  render: () => html`
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
        'Transbordo aprovado',
        html`
          <div style="display: flex; align-items: center; gap: var(--nph-space-section);">
            <div style=${celula}>
              <nph-icon name="eye" size="lg"></nph-icon>
              <span style=${legenda}>eye — 18 de largura natural</span>
            </div>
            <div style=${celula}>
              <nph-icon name="circle-check" size="lg"></nph-icon>
              <span style=${legenda}>circle-check — largura igual a altura</span>
            </div>
          </div>
          <p style=${legenda}>
            A caixa normaliza altura e alinhamento, nao largura: eye, eye-slash e star
            transbordam centralizados, sem corte e sem reescala.
          </p>
        `,
      )}
    </div>
  `,
};

/** A cor nao e propriedade: vem de `currentColor`. */
export const HerancaDeCor: Story = {
  name: 'Herança de cor',
  render: () => html`
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
      <p style=${legenda}>
        Nenhum icone acima foi pintado. Todos herdam a cor do contexto.
      </p>
    </div>
  `,
};

/** Decorativo ao lado de texto; nomeado quando anda sozinho. */
export const Acessibilidade: Story = {
  name: 'Acessibilidade',
  render: () => html`
    <div style=${pagina}>
      ${secao(
        'Com texto ao lado — decorativo',
        html`
          <div style=${celula}>
            <nph-icon name="trash-can" size="sm"></nph-icon>
            <span>Excluir registro</span>
          </div>
          <p style=${legenda}>
            Sem label: aria-hidden no host. O leitor de tela le o texto uma vez so.
          </p>
        `,
      )}
      ${secao(
        'Sem texto visivel — nomeado',
        html`
          <nph-icon name="magnifying-glass" size="md" label="Buscar"></nph-icon>
          <p style=${legenda}>
            Com label: role="img" e aria-label no host. So para simbolo universal e
            recorrente; acao com consequencia nunca anda sozinha.
          </p>
        `,
      )}
      <p style=${legenda}>
        O icone nunca recebe foco: teclado e alvo de toque pertencem ao controle em volta.
      </p>
    </div>
  `,
};

/** Entrada invalida nao renderiza e reclama no console em desenvolvimento. */
export const EntradaInvalida: Story = {
  name: 'Entrada inválida',
  render: () => html`
    <div style=${pagina}>
      <p style=${legenda}>
        Os quatro casos abaixo nao desenham nada e nao ocupam espaco. Abra o console
        para ver um erro por propriedade invalida.
      </p>
      <ul style="${legenda} list-style: none; padding: 0; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
        <li>
          name="rocket" size="sm" — fora do nucleo:
          <nph-icon name="rocket" size="sm"></nph-icon>
        </li>
        <li>
          name="check" variant="solid" size="sm" — solid so existe em star:
          <nph-icon name="check" variant="solid" size="sm"></nph-icon>
        </li>
        <li>
          name="check" size="xl" — tamanho livre nao existe:
          <nph-icon name="check" size="xl"></nph-icon>
        </li>
        <li>
          name="check" — size e obrigatorio:
          <nph-icon name="check"></nph-icon>
        </li>
      </ul>
    </div>
  `,
};
