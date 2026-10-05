/**
 * `nph-kbd` — uma tecla de atalho, estatica.
 *
 * Contrato aceito no Figma (quadro `1193:20`, componente `772:3`) e P66:
 * - `text`, o texto de UMA tecla (`tecla` no Figma). A combinacao junta uma
 *   peca por tecla, lado a lado;
 * - vazio ou so espacos: nada e mostrado. Nao e erro: e o estado antes de o
 *   consumidor preencher o texto;
 * - sem interacao: sem foco, clique, evento, slot, variante ou `::part`;
 * - o leitor de tela anuncia a tecla pelo proprio texto, dentro de `<kbd>`.
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import kbdCss from './nph-kbd.css?inline';

const TAG = 'nph-kbd';

/** Marca interna, nao API: presente so quando ha texto para mostrar. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export class NphKbd extends LitElement {
  static override styles = unsafeCSS(kbdCss);

  static override properties = {
    text: { type: String },
  };

  /** O texto de uma tecla. Vazio ou so espacos: nada e mostrado. */
  declare text: string;

  constructor() {
    super();
    this.text = '';
  }

  protected override willUpdate(): void {
    this.toggleAttribute(RENDERED_ATTRIBUTE, (this.text ?? '').trim() !== '');
  }

  protected override render(): TemplateResult | typeof nothing {
    const content = (this.text ?? '').trim();
    if (content === '') {
      return nothing;
    }
    return html`<kbd>${content}</kbd>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphKbd);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-kbd': NphKbd;
  }
}
