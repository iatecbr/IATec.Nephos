/**
 * `nph-icon` — primeiro componente do Nephos.
 *
 * Contrato aprovado (ficha `nph-icon`, `design.md` `contrato_nph_icon`, P21):
 * - `name` obrigatorio, kebab-case, restrito aos icones do nucleo
 *   (`NPH_ICON_NAMES`, de `design.md` `icones_nucleo`);
 * - `variant` `regular` por padrao; `solid` disponivel para todo nome aprovado;
 * - `size` obrigatorio, `sm`, `md` ou `lg`, sem padrao e sem valor livre;
 * - `label` ausente, vazio ou so com espacos depois de `trim` e decorativo;
 * - sem slots, eventos, foco, clique, toque, propriedade de cor ou `::part`;
 * - entrada invalida nao renderiza icone e emite `console.error` so em
 *   desenvolvimento, sem fallback visual.
 *
 * Encapsulamento em Shadow DOM aberto (P01). A cor NAO e propriedade: o
 * desenho herda `currentColor` do contexto. O espaco ate o texto
 * (`space/inline-tight`) pertence ao conteiner que compoe icone e texto, nunca
 * a este elemento.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import iconCss from './nph-icon.css?inline';
import {
  NPH_ICON_NAMES,
  findGlyph,
  isCoreName,
  isSize,
  isVariant,
} from './nph-icon.icons';
import type { NphIconName, NphIconSize, NphIconVariant } from './nph-icon.icons';

const TAG = 'nph-icon';

/** Marca interna, nao API: presente so quando existe arte valida desenhada. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

/** O que o `render` precisa saber. Extraido da definicao do Font Awesome. */
interface Drawing {
  readonly width: number;
  readonly height: number;
  readonly path: string;
}

/**
 * Erro de desenvolvimento. Fora de um bundler que defina `import.meta.env`,
 * o encadeamento opcional simplesmente silencia — nunca quebra a pagina.
 */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function quote(value: string | null): string {
  return value === null ? 'ausente' : `"${value}"`;
}

export class NphIcon extends LitElement {
  static override styles = unsafeCSS(iconCss);

  static override properties = {
    name: { type: String },
    variant: { type: String },
    /* `size` reflete porque o CSS interno seleciona a caixa por ele. */
    size: { type: String, reflect: true },
    label: { type: String },
  };

  /** Nome do icone no nucleo Nephos, em kebab-case. Obrigatorio. */
  name: NphIconName | null = null;

  /** `regular` quando ausente; `solid` existe para todo nome aprovado. */
  variant: NphIconVariant | null = null;

  /** `sm`, `md` ou `lg`. Obrigatorio: nao ha padrao. */
  size: NphIconSize | null = null;

  /** Nome acessivel. Vazio ou so espacos torna o icone decorativo. */
  label: string | null = null;

  private drawing: Drawing | undefined = undefined;

  protected override willUpdate(): void {
    this.drawing = this.resolveDrawing();
    this.applySemantics();
  }

  /**
   * Valida as tres propriedades do contrato e devolve o desenho, ou
   * `undefined` quando qualquer uma reprova. Cada reprovacao emite um erro
   * proprio: quem esta desenvolvendo precisa saber TODAS as causas, nao a
   * primeira.
   */
  private resolveDrawing(): Drawing | undefined {
    const name = this.name;
    const variant = this.variant ?? 'regular';
    const size = this.size;

    const validName = name !== null && isCoreName(name);
    const validVariant = isVariant(variant);
    const validSize = size !== null && isSize(size);

    if (!validName) {
      devError(
        `name ${quote(name)} nao pertence ao nucleo Nephos. ` +
          `Use um dos ${NPH_ICON_NAMES.length} nomes aprovados, em kebab-case.`,
      );
    }
    if (!validVariant) {
      devError(
        `variant ${quote(this.variant)} nao existe. Use "regular" ou "solid".`,
      );
    }
    if (!validSize) {
      devError(
        `size ${quote(size)} nao existe. Use "sm", "md" ou "lg" — nao ha padrao nem valor livre.`,
      );
    }
    if (!validName || !validVariant || !validSize) {
      return undefined;
    }

    const glyph = findGlyph(name, variant);
    if (glyph === undefined) {
      devError(
        `nao existe arte "${variant}" para name "${name}".`,
      );
      return undefined;
    }

    const [width, height, , , path] = glyph.icon;
    if (typeof path !== 'string') {
      /* Caminho multiplo e Duotone, que nao entra no mapa fechado. */
      devError(`a arte de "${name}" nao tem caminho unico.`);
      return undefined;
    }

    return { width, height, path };
  }

  /**
   * Semantica no HOST, nao no SVG: e o host que a tecnologia assistiva enxerga.
   * Sem arte valida o elemento fica fora da arvore de acessibilidade, porque
   * nao ha nada para anunciar.
   */
  private applySemantics(): void {
    const label = (this.label ?? '').trim();
    const nameable = this.drawing !== undefined && label !== '';

    if (nameable) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }

    this.toggleAttribute(RENDERED_ATTRIBUTE, this.drawing !== undefined);
  }

  protected override render(): TemplateResult | typeof nothing {
    const drawing = this.drawing;
    if (drawing === undefined) {
      return nothing;
    }

    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${drawing.width} ${drawing.height}"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d=${drawing.path}></path>
    </svg>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphIcon);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-icon': NphIcon;
  }
}
