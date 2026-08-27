/**
 * `nph-icon` — primeiro componente do Nephos.
 *
 * Contrato aprovado (ficha `nph-icon`, `design.md` `contrato_nph_icon`, P21):
 * - `name` obrigatorio, kebab-case, restrito aos 34 icones do nucleo;
 * - `variant` `regular` por padrao; `solid` somente com `name="star"`;
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

import estilos from './nph-icon.css?inline';
import {
  NPH_ICON_NAMES,
  buscarArte,
  ehNomeDoNucleo,
  ehTamanho,
  ehVariante,
} from './nph-icon.icons';
import type { NphIconName, NphIconSize, NphIconVariant } from './nph-icon.icons';

const TAG = 'nph-icon';

/** Marca interna, nao API: presente so quando existe arte valida desenhada. */
const ATRIBUTO_RENDERIZADO = 'data-nph-rendered';

/** O que o `render` precisa saber. Extraido da definicao do Font Awesome. */
interface Desenho {
  readonly largura: number;
  readonly altura: number;
  readonly caminho: string;
}

/**
 * Erro de desenvolvimento. Fora de um bundler que defina `import.meta.env`,
 * o encadeamento opcional simplesmente silencia — nunca quebra a pagina.
 */
function erroDeDesenvolvimento(mensagem: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${mensagem}`);
  }
}

function citar(valor: string | null): string {
  return valor === null ? 'ausente' : `"${valor}"`;
}

export class NphIcon extends LitElement {
  static override styles = unsafeCSS(estilos);

  static override properties = {
    name: { type: String },
    variant: { type: String },
    /* `size` reflete porque o CSS interno seleciona a caixa por ele. */
    size: { type: String, reflect: true },
    label: { type: String },
  };

  /** Nome do icone no nucleo Nephos, em kebab-case. Obrigatorio. */
  name: NphIconName | null = null;

  /** `regular` quando ausente. `solid` so existe para `star`. */
  variant: NphIconVariant | null = null;

  /** `sm`, `md` ou `lg`. Obrigatorio: nao ha padrao. */
  size: NphIconSize | null = null;

  /** Nome acessivel. Vazio ou so espacos torna o icone decorativo. */
  label: string | null = null;

  private desenho: Desenho | undefined = undefined;

  protected override willUpdate(): void {
    this.desenho = this.resolverDesenho();
    this.aplicarSemantica();
  }

  /**
   * Valida as tres propriedades do contrato e devolve o desenho, ou
   * `undefined` quando qualquer uma reprova. Cada reprovacao emite um erro
   * proprio: quem esta desenvolvendo precisa saber TODAS as causas, nao a
   * primeira.
   */
  private resolverDesenho(): Desenho | undefined {
    const name = this.name;
    const variant = this.variant ?? 'regular';
    const size = this.size;

    const nomeValido = name !== null && ehNomeDoNucleo(name);
    const varianteValida = ehVariante(variant);
    const tamanhoValido = size !== null && ehTamanho(size);

    if (!nomeValido) {
      erroDeDesenvolvimento(
        `name ${citar(name)} nao pertence ao nucleo Nephos. ` +
          `Use um dos ${NPH_ICON_NAMES.length} nomes aprovados, em kebab-case.`,
      );
    }
    if (!varianteValida) {
      erroDeDesenvolvimento(
        `variant ${citar(this.variant)} nao existe. Use "regular" ou "solid".`,
      );
    }
    if (!tamanhoValido) {
      erroDeDesenvolvimento(
        `size ${citar(size)} nao existe. Use "sm", "md" ou "lg" — nao ha padrao nem valor livre.`,
      );
    }
    if (!nomeValido || !varianteValida || !tamanhoValido) {
      return undefined;
    }

    const arte = buscarArte(name, variant);
    if (arte === undefined) {
      erroDeDesenvolvimento(
        `variant "solid" nao existe para name "${name}". ` +
          'No nucleo Nephos, solid existe somente para "star".',
      );
      return undefined;
    }

    const [largura, altura, , , caminho] = arte.icon;
    if (typeof caminho !== 'string') {
      /* Caminho multiplo e Duotone, que nao entra no mapa fechado. */
      erroDeDesenvolvimento(`a arte de "${name}" nao tem caminho unico.`);
      return undefined;
    }

    return { largura, altura, caminho };
  }

  /**
   * Semantica no HOST, nao no SVG: e o host que a tecnologia assistiva enxerga.
   * Sem arte valida o elemento fica fora da arvore de acessibilidade, porque
   * nao ha nada para anunciar.
   */
  private aplicarSemantica(): void {
    const rotulo = (this.label ?? '').trim();
    const nomeavel = this.desenho !== undefined && rotulo !== '';

    if (nomeavel) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', rotulo);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }

    this.toggleAttribute(ATRIBUTO_RENDERIZADO, this.desenho !== undefined);
  }

  protected override render(): TemplateResult | typeof nothing {
    const desenho = this.desenho;
    if (desenho === undefined) {
      return nothing;
    }

    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${desenho.largura} ${desenho.altura}"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d=${desenho.caminho}></path>
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
