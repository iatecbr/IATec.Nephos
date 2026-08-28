/**
 * `nph-label` — o rotulo de um controle de formulario.
 *
 * Contrato aprovado (ficha `nph-label`; Registro de decisoes, secao do
 * `nph-label`; decisoes de Indiane em 27-08-2026):
 * - o rotulo e SO um texto. Nao tem caixa, borda, fundo, icone nem sombra;
 * - `required` acrescenta um asterisco ao fim do texto, em `status/error`;
 * - NAO existe propriedade de layout, de peso nem de estado. Posicao e do
 *   `nph-field`; erro nao muda o rotulo; desabilitado desbota o controle
 *   inteiro, pelo `nph-field`, e nao por estado proprio;
 * - ajuda e mensagem de erro pertencem ao `nph-field`, nunca a esta peca.
 *
 * EXCECAO A P01 — este e o unico componente do Nephos SEM Shadow DOM.
 * A associacao nativa entre rotulo e controle nao atravessa a fronteira do
 * Shadow DOM: `for` nao alcancaria um `id` do documento e o clique no rotulo
 * nao levaria o cursor ao campo. Como isso e a razao de existir de um rotulo,
 * o encapsulamento cede. Decisao de Indiane em 27-08-2026, depois de a
 * alternativa de delegar a associacao ao `nph-field` ser descartada por travar
 * o recorte P0 — o `nph-field` ainda nao existe.
 *
 * API — tres propriedades, e as tres saem da mesma decisao:
 * - `required`, a unica prevista no Registro;
 * - `for`, que espelha o atributo nativo de `<label>` e e o mecanismo da
 *   associacao que a decisao de 27-08 escolheu;
 * - `text`, que carrega o texto do rotulo. Ele e propriedade, e nao conteudo
 *   entre as tags, porque sem Shadow DOM nao ha `<slot>`: o Lit renderiza
 *   dentro do proprio elemento e substituiria qualquer filho escrito pelo
 *   consumidor. `for` e `text` nao estavam no Registro e precisam de
 *   confirmacao tecnica antes de virarem contrato.
 *
 * ACESSIBILIDADE — o asterisco e DECORATIVO para tecnologia assistiva e leva
 * `aria-hidden`. A obrigatoriedade tem de chegar ao leitor de tela pelo proprio
 * controle, com `required`, e nao por texto escondido dentro do rotulo. Duas
 * razoes: o estado obrigatorio pertence ao campo, nao ao rotulo, e texto
 * escondido exigiria uma string em portugues dentro do componente, proibido
 * pelo plano trilingue — nenhum `nph-*` conhece idioma.
 *
 * Alem disso, o formulario que usar `required` precisa de uma legenda visivel
 * explicando a convencao do asterisco. Isso e regra de tela, verificada na
 * revisao de composicao, e nao algo que o componente possa impor sozinho.
 */
import { LitElement, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-label.css';

const TAG = 'nph-label';

export class NphLabel extends LitElement {
  static override properties = {
    text: { type: String },
    required: { type: Boolean, reflect: true },
    for: { type: String, reflect: true },
  };

  /** O texto do rotulo. Chega ja localizado pela aplicacao consumidora. */
  declare text: string;

  /** Campo obrigatorio. Acrescenta o asterisco ao fim do texto. */
  declare required: boolean;

  /** `id` do controle que este rotulo nomeia. Espelha o atributo nativo. */
  declare for: string | null;

  constructor() {
    super();
    this.text = '';
    this.required = false;
    this.for = null;
  }

  /**
   * Renderiza na luz, nao em Shadow DOM. Ver a nota de excecao a P01 no topo.
   * Sem isso, `for` nao alcancaria o controle e o rotulo perderia a funcao.
   */
  protected override createRenderRoot(): HTMLElement {
    return this;
  }

  protected override render(): TemplateResult {
    return html`<label class="nph-label__texto" for=${this.for ?? nothing}
      >${this.text}${this.required
        ? html`<span class="nph-label__obrigatorio" aria-hidden="true">*</span>`
        : nothing}</label
    >`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphLabel);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-label': NphLabel;
  }
}
