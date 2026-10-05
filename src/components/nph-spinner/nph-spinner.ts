/**
 * `nph-spinner` — o girador de espera sem hora para acabar.
 *
 * Contrato aceito no Figma (quadro `1195:22210`, conjunto `281:11`) e P66:
 * - `size` `sm` (padrao) ou `md`. `sm` dentro de botao ou campo; `md` em area de
 *   conteudo. `lg` nao existe;
 * - `label` opcional. Sem texto ao lado, o girador precisa de nome acessivel;
 *   com texto ao lado, e decorativo e fica fora da arvore de acessibilidade;
 * - o desenho e o `circle-notch` do `nph-icon`, nunca arte propria;
 * - gira continuamente em `motion/loop-duration` e `motion/loop-easing`. Com
 *   movimento reduzido, o giro para e o aviso continua (WCAG 2.3.3);
 * - sem foco, clique, evento, slot, propriedade de cor ou `::part`. A cor herda
 *   `currentColor` do contexto;
 * - `size` invalido nao renderiza e emite `console.error` so em
 *   desenvolvimento, sem fallback visual (P66, mesma regra da P21).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import spinnerCss from './nph-spinner.css?inline';

const TAG = 'nph-spinner';

/** Marca interna, nao API: presente so quando o tamanho e valido. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_SPINNER_SIZES = ['sm', 'md'] as const;
export type NphSpinnerSize = (typeof NPH_SPINNER_SIZES)[number];

function isSpinnerSize(value: string): value is NphSpinnerSize {
  return (NPH_SPINNER_SIZES as readonly string[]).includes(value);
}

/** Erro de desenvolvimento; fora de bundler com `import.meta.env`, silencia. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphSpinner extends LitElement {
  static override styles = unsafeCSS(spinnerCss);

  static override properties = {
    /* `size` reflete porque o CSS interno seleciona a caixa por ele. */
    size: { type: String, reflect: true },
    label: { type: String },
  };

  /** `sm` por padrao; `md` em area de conteudo. */
  declare size: NphSpinnerSize;

  /** Nome acessivel. Vazio ou so espacos torna o girador decorativo. */
  declare label: string | null;

  private valid = false;

  constructor() {
    super();
    this.size = 'sm';
    this.label = null;
  }

  protected override willUpdate(): void {
    const size = this.size ?? '';
    this.valid = isSpinnerSize(size);
    if (!this.valid) {
      devError(`size "${size}" nao existe. Use "sm" ou "md" — nao ha "lg" nem valor livre.`);
    }
    this.applySemantics();
  }

  /**
   * Semantica no HOST. So ha nome quando ha desenho valido E texto no `label`;
   * fora disso o girador sai da arvore de acessibilidade.
   */
  private applySemantics(): void {
    const label = (this.label ?? '').trim();
    if (this.valid && label !== '') {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    return html`<nph-icon class="glyph" name="circle-notch" size=${this.size}></nph-icon>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSpinner);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-spinner': NphSpinner;
  }
}
