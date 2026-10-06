/**
 * VALIDATION stories of `nph-icon`.
 *
 * Each page here proves one part of the approved contract: variant, size,
 * color inheritance, accessibility and invalid input. They are rendered
 * stories, not text: what they show is the real component behaving.
 *
 * The explanatory text comes from the language dictionary; the technical
 * identifiers — `star`, `solid`, `size`, `eye` — appear literally, the same in
 * any language. The story is UNIQUE per case: there is no per-language copy.
 *
 * The reading of the contract and the visual catalog live in
 * `Componentes/nph-icon/Docs`. Header, section, demonstration and table come
 * from `src/shared/docs/page.ts`, the same blocks as the Documentation page;
 * the specimen comes from `nph-icon.demo.ts`. None of this is a precedent for
 * component CSS.
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

/** Shortcut: the validation dictionary in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).validation;
}

/** `regular` and `solid` exist for every name in the collection. */
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

/** Size comes from a semantic token. There is no free value. */
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

/** Color is not a property: it comes from `currentColor`. */
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

/** Decorative next to text; named when it stands alone. */
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

/** Invalid input does not render and complains in the console in development. */
export const EntradaInvalida: Story = {
  name: 'Entrada inválida',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return html`
      <div style=${body}>
        ${header(v.invalidTitle, v.invalidIntro)}
        <!-- The table term does not wrap: on a narrow screen the table scrolls, the page does not. -->
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
