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
 * `Componentes/nph-icon/Docs`. Cabecalho, secao, demonstracao e tabela vem de
 * `src/shared/docs/page.ts`, os mesmos blocos da pagina Documentacao; a amostra
 * vem de `nph-icon.demo.ts`. Nada disso vale como precedente para CSS de
 * componente.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-icon';
import { NPH_ICON_SIZES } from './nph-icon.icons';
import { specimen } from './nph-icon.demo';
import { body, demo, header, section, table, text, textRole } from '../../shared/docs/page';

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
      <div style=${body}>
        ${header(v.variantsTitle, v.variantsNote)}
        ${demo(
          html`
            ${specimen(
              html`<nph-icon name="circle-info" variant="regular" size="lg"></nph-icon>`,
              v.variantsRegular,
            )}
            ${specimen(
              html`<nph-icon name="circle-info" variant="solid" size="lg"></nph-icon>`,
              v.variantsSolid,
            )}
          `,
          'name="circle-info" size="lg"',
        )}
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
      <div style=${body}>
        ${header(v.sizesTitle, v.sizesSummary)}
        ${demo(
          html`${NPH_ICON_SIZES.map((size) =>
            specimen(
              html`<nph-icon name="gear" size=${size}></nph-icon>`,
              html`size="${size}"<br />icon/size-${size}`,
            ),
          )}`,
          'name="gear"',
        )}
        ${section(
          'overflow',
          v.sizesOverflowTitle,
          html`
            ${text(v.sizesNote)}
            ${demo(
              html`
                ${specimen(html`<nph-icon name="eye" size="lg"></nph-icon>`, v.sizesEye)}
                ${specimen(
                  html`<nph-icon name="circle-check" size="lg"></nph-icon>`,
                  v.sizesCircleCheck,
                )}
              `,
              'size="lg"',
            )}
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
    const frame = (style: string) => html`
      <span style="display: inline-flex; padding: var(--nph-space-control-padding); border-radius: var(--nph-radius-control); ${style}">
        <nph-icon name="circle-info" size="lg"></nph-icon>
      </span>
    `;
    return html`
      <div style=${body}>
        ${header(v.colorTitle, v.colorNote)}
        ${demo(
          html`
            ${specimen(frame('color: var(--nph-color-foreground);'), 'color/foreground')}
            ${specimen(
              frame('color: var(--nph-color-muted-foreground);'),
              'color/muted-foreground',
            )}
            ${specimen(
              frame(
                'color: var(--nph-color-primary-foreground); background: var(--nph-color-primary);',
              ),
              'color/primary-foreground',
            )}
          `,
          'name="circle-info" size="lg"',
        )}
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
      <div style=${body}>
        ${header(v.a11yTitle, v.a11ySummary)}
        ${section(
          'decorative',
          v.a11yDecorativeTitle,
          demo(
            html`
              <span
                style="display: inline-flex; align-items: center; gap: var(--nph-space-inline-tight); ${textRole('body-md')}"
              >
                <nph-icon name="trash-can" size="sm"></nph-icon>
                ${v.a11yDecorativeExample}
              </span>
            `,
            v.a11yDecorativeNote,
          ),
        )}
        ${section(
          'named',
          v.a11yNamedTitle,
          demo(
            html`<nph-icon name="magnifying-glass" size="md" label=${v.a11yNamedLabel}></nph-icon>`,
            v.a11yNamedNote,
          ),
        )}
        ${section('focus', v.a11yFocusTitle, text(v.a11yFocusNote))}
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
      <div style=${body}>
        ${header(v.invalidTitle, v.invalidIntro)}
        <!-- O termo da tabela nao quebra linha: em tela estreita a tabela rola, a pagina nao. -->
        <div style="overflow-x: auto;">
          ${table(v.invalidHeader, [
            [
              'name="rocket" size="sm"',
              html`${v.invalidCases[0]} <nph-icon name="rocket" size="sm"></nph-icon>`,
            ],
            [
              'name="check" variant="duotone" size="sm"',
              html`${v.invalidCases[1]} <nph-icon name="check" variant="duotone" size="sm"></nph-icon>`,
            ],
            [
              'name="check" size="xl"',
              html`${v.invalidCases[2]} <nph-icon name="check" size="xl"></nph-icon>`,
            ],
            ['name="check"', html`${v.invalidCases[3]} <nph-icon name="check"></nph-icon>`],
          ])}
        </div>
      </div>
    `;
  },
};
