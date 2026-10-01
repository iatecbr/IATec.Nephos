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

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-icon';
import { NPH_ICON_SIZES } from './nph-icon.icons';
import { cell, caption, page, section } from './nph-icon.demo';

const meta: Meta = {
  title: 'Componentes/nph-icon/Validação',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Atalho: o dicionario de validacao no idioma escolhido. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).validation;
}

/** `regular` e `solid` existem para todos os nomes do acervo. */
export const Variantes: Story = {
  name: 'Variantes',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`
      <div style=${page}>
        ${section(
          v.variantsSection,
          html`
            <div style="display: flex; gap: var(--nph-space-section);">
              <div style=${cell}>
                <nph-icon name="circle-info" variant="regular" size="lg"></nph-icon>
                <span style=${caption}>${v.variantsRegular}</span>
              </div>
              <div style=${cell}>
                <nph-icon name="circle-info" variant="solid" size="lg"></nph-icon>
                <span style=${caption}>${v.variantsSolid}</span>
              </div>
            </div>
          `,
        )}
        <p style=${caption}>${v.variantsNote}</p>
      </div>
    `;
  },
};

/** Tamanho vem de token semantico. Nao existe valor livre. */
export const Tamanhos: Story = {
  name: 'Tamanhos',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`
      <div style=${page}>
        <div style="display: flex; align-items: center; gap: var(--nph-space-section);">
          ${NPH_ICON_SIZES.map(
            (size) => html`
              <div style=${cell}>
                <nph-icon name="gear" size=${size}></nph-icon>
                <span style=${caption}>size="${size}" — icon/size-${size}</span>
              </div>
            `,
          )}
        </div>
        ${section(
          v.sizesOverflowTitle,
          html`
            <div style="display: flex; align-items: center; gap: var(--nph-space-section);">
              <div style=${cell}>
                <nph-icon name="eye" size="lg"></nph-icon>
                <span style=${caption}>${v.sizesEye}</span>
              </div>
              <div style=${cell}>
                <nph-icon name="circle-check" size="lg"></nph-icon>
                <span style=${caption}>${v.sizesCircleCheck}</span>
              </div>
            </div>
            <p style=${caption}>${v.sizesNote}</p>
          `,
        )}
      </div>
    `;
  },
};

/** A cor nao e propriedade: vem de `currentColor`. */
export const HerancaDeCor: Story = {
  name: 'Herança de cor',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`
      <div style=${page}>
        <div style="display: flex; align-items: center; gap: var(--nph-space-section);">
          <div style=${cell}>
            <nph-icon name="circle-info" size="lg"></nph-icon>
            <span style=${caption}>color/foreground</span>
          </div>
          <div style="${cell} color: var(--nph-color-muted-foreground);">
            <nph-icon name="circle-info" size="lg"></nph-icon>
            <span style=${caption}>color/muted-foreground</span>
          </div>
          <div
            style="${cell} color: var(--nph-color-primary-foreground);
                   background: var(--nph-color-primary);
                   padding: var(--nph-space-control-padding);
                   border-radius: var(--nph-radius-control);"
          >
            <nph-icon name="circle-info" size="lg"></nph-icon>
            <span style="font-family: var(--nph-text-code-font-family); font-size: 12px;">primary</span>
          </div>
        </div>
        <p style=${caption}>${v.colorNote}</p>
      </div>
    `;
  },
};

/** Decorativo ao lado de texto; nomeado quando anda sozinho. */
export const Acessibilidade: Story = {
  name: 'Acessibilidade',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`
      <div style=${page}>
        ${section(
          v.a11yDecorativeTitle,
          html`
            <div style=${cell}>
              <nph-icon name="trash-can" size="sm"></nph-icon>
              <span>${v.a11yDecorativeExample}</span>
            </div>
            <p style=${caption}>${v.a11yDecorativeNote}</p>
          `,
        )}
        ${section(
          v.a11yNamedTitle,
          html`
            <nph-icon name="magnifying-glass" size="md" label=${v.a11yNamedLabel}></nph-icon>
            <p style=${caption}>${v.a11yNamedNote}</p>
          `,
        )}
        <p style=${caption}>${v.a11yFocusNote}</p>
      </div>
    `;
  },
};

/** Entrada invalida nao renderiza e reclama no console em desenvolvimento. */
export const EntradaInvalida: Story = {
  name: 'Entrada inválida',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`
      <div style=${page}>
        <p style=${caption}>${v.invalidIntro}</p>
        <ul style="${caption} list-style: none; padding: 0; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
          <li>
            name="rocket" size="sm" — ${v.invalidCases[0]}
            <nph-icon name="rocket" size="sm"></nph-icon>
          </li>
          <li>
            name="check" variant="duotone" size="sm" — ${v.invalidCases[1]}
            <nph-icon name="check" variant="duotone" size="sm"></nph-icon>
          </li>
          <li>
            name="check" size="xl" — ${v.invalidCases[2]}
            <nph-icon name="check" size="xl"></nph-icon>
          </li>
          <li>
            name="check" — ${v.invalidCases[3]}
            <nph-icon name="check"></nph-icon>
          </li>
        </ul>
      </div>
    `;
  },
};
