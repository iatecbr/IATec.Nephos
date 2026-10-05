/**
 * `nph-tooltip` — o balao de ajuda.
 *
 * Contrato aceito no Figma (quadro `1237:5`, componente `1237:3`) e decisoes
 * de Indiane em 01-10-2026 (Registro de decisoes, L11.5 a L11.7):
 * - so texto. Nao tem titulo, icone, acao, seta nem borda;
 * - o texto acompanha a largura ate `layout/max-tooltip-width` e depois quebra
 *   a linha. Cabe inteiro, em ate duas linhas: sem reticencias e sem palavra
 *   partida. Texto mais longo e erro de conteudo, e o componente nao corta;
 * - abre so pela ativacao do gatilho que o usa (no `nph-label`, o gatilho
 *   `info`), e nunca no hover. Abrir, fechar e posicionar sao do consumidor:
 *   este componente so mostra o texto quando `open` esta ligado.
 *
 * API — duas propriedades (P65):
 * - `text`, o texto do balao, ja localizado pela aplicacao consumidora;
 * - `open`, que mostra o balao. Reflete no atributo.
 *
 * ACESSIBILIDADE — o balao abre por ativacao e o foco fica no gatilho, entao o
 * texto precisa ser anunciado sem receber foco. Por isso o host e uma regiao
 * viva `role="status"`, presente no DOM ANTES de abrir: o leitor de tela so
 * anuncia mudanca dentro de uma regiao que ja existia. O balao nao e focavel.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import styles from './nph-tooltip.css?inline';

const TAG = 'nph-tooltip';

export class NphTooltip extends LitElement {
  static override styles = unsafeCSS(styles);

  static override properties = {
    text: { type: String },
    /* `open` reflete para o consumidor poder estilizar e conferir o estado. */
    open: { type: Boolean, reflect: true },
  };

  /** O texto do balao. Vazio ou so espacos: nada e mostrado. */
  declare text: string;

  /** Mostra o balao. O consumidor liga e desliga. */
  declare open: boolean;

  constructor() {
    super();
    this.text = '';
    this.open = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'status');
  }

  protected override render(): TemplateResult | typeof nothing {
    const content = (this.text ?? '').trim();
    if (!this.open || content === '') {
      return nothing;
    }
    return html`<div class="bubble">${content}</div>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphTooltip);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-tooltip': NphTooltip;
  }
}
