/**
 * `nph-label` — o rotulo de um controle de formulario.
 *
 * Contrato aprovado (ficha `nph-label`; Registro de decisoes, secao do
 * `nph-label`; decisoes de Indiane em 27-08-2026, 08-09-2026 e 01-10-2026):
 * - o rotulo e SO um texto. Nao tem caixa, borda, fundo, sombra nem estado;
 * - `required` acrescenta um asterisco ao fim do texto, em `status/error`;
 * - NAO existe propriedade de layout, de peso nem de estado. Posicao e do
 *   `nph-field`; erro nao muda o rotulo; desabilitado desbota o controle
 *   inteiro, pelo `nph-field`, e nao por estado proprio;
 * - ajuda e mensagem de erro pertencem ao `nph-field`. O rotulo carrega o
 *   GATILHO da ajuda, nao a ajuda (L8): com `info` e `infoLabel`, um icone de
 *   informacao depois do texto abre o `nph-tooltip` com o texto de `info`.
 *   O gatilho recebe foco, com borda e halo (L9); abre por clique, Enter ou
 *   Espaco e fecha com Esc ou clique fora (L11).
 *
 * EXCECAO A P01 — este e o unico componente do Nephos SEM Shadow DOM.
 * A associacao nativa entre rotulo e controle nao atravessa a fronteira do
 * Shadow DOM: `for` nao alcancaria um `id` do documento e o clique no rotulo
 * nao levaria o cursor ao campo. Como isso e a razao de existir de um rotulo,
 * o encapsulamento cede. Decisao de Indiane em 27-08-2026, depois de a
 * alternativa de delegar a associacao ao `nph-field` ser descartada por travar
 * o recorte P0 — o `nph-field` ainda nao existe.
 *
 * API — cinco propriedades (P62.3, ampliada pela P62.6):
 * - `required`, a unica prevista no Registro original;
 * - `for`, que espelha o atributo nativo de `<label>` e e o mecanismo da
 *   associacao que a decisao de 27-08 escolheu;
 * - `text`, que carrega o texto do rotulo. Ele e propriedade, e nao conteudo
 *   entre as tags, porque sem Shadow DOM nao ha `<slot>`: o Lit renderiza
 *   dentro do proprio elemento e substituiria qualquer filho escrito pelo
 *   consumidor;
 * - `info`, o texto da explicacao que o balao mostra;
 * - `infoLabel` (`info-label`), o nome acessivel do gatilho (L11.3).
 * O gatilho so aparece com os dois preenchidos. `info` sem `infoLabel` e
 * entrada invalida: o gatilho nao aparece e `console.error` sai em
 * desenvolvimento, mas o rotulo continua — ele e o nome do controle e nao
 * some por causa da ajuda (P62.6). `infoLabel` sem `info` e montagem: nada.
 *
 * ACESSIBILIDADE — o asterisco e DECORATIVO para tecnologia assistiva e leva
 * `aria-hidden`. A obrigatoriedade tem de chegar ao leitor de tela pelo proprio
 * controle, com `required`, e nao por texto escondido dentro do rotulo. Duas
 * razoes: o estado obrigatorio pertence ao campo, nao ao rotulo, e texto
 * escondido exigiria uma string em portugues dentro do componente, proibido
 * pelo plano trilingue — nenhum `nph-*` conhece idioma.
 *
 * O gatilho e um `<button>` nativo DEPOIS do `<label>`, fora dele: dentro, ele
 * entraria no nome acessivel do controle. O balao e uma regiao viva
 * `role="status"` que existe antes de abrir (P65), e o foco fica no gatilho.
 *
 * Alem disso, o formulario que usar `required` precisa de uma legenda visivel
 * explicando a convencao do asterisco. Isso e regra de tela, verificada na
 * revisao de composicao, e nao algo que o componente possa impor sozinho.
 */
import { LitElement, html, nothing } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import '../nph-tooltip/nph-tooltip';
import './nph-label.css';

const TAG = 'nph-label';

/** Marca do host quando o gatilho existe: o CSS so muda a raiz nesse caso. */
const INFO_ATTRIBUTE = 'data-nph-info';

let nextId = 0;

/**
 * Erro de desenvolvimento, no padrao do `nph-icon`. Fora de um bundler que
 * defina `import.meta.env`, o encadeamento opcional silencia.
 */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphLabel extends LitElement {
  static override properties = {
    text: { type: String },
    required: { type: Boolean, reflect: true },
    for: { type: String, reflect: true },
    info: { type: String },
    infoLabel: { type: String, attribute: 'info-label' },
    /* Interno: o balao aberto. Nao e API (P62.6). */
    opened: { state: true },
  };

  /** O texto do rotulo. Chega ja localizado pela aplicacao consumidora. */
  declare text: string;

  /** Campo obrigatorio. Acrescenta o asterisco ao fim do texto. */
  declare required: boolean;

  /** `id` do controle que este rotulo nomeia. Espelha o atributo nativo. */
  declare for: string | null;

  /** O texto da explicacao, mostrado no `nph-tooltip`. Ja localizado. */
  declare info: string;

  /** Nome acessivel do gatilho de informacao. Ja localizado. */
  declare infoLabel: string;

  declare protected opened: boolean;

  /** `id` do balao, para o `aria-controls` do gatilho. Unico por instancia. */
  private readonly tooltipId = `${TAG}-info-${++nextId}`;

  /** Ultima causa reclamada, para reclamar uma vez por causa. */
  private reported = '';

  constructor() {
    super();
    this.text = '';
    this.required = false;
    this.for = null;
    this.info = '';
    this.infoLabel = '';
    this.opened = false;
  }

  /**
   * Renderiza na luz, nao em Shadow DOM. Ver a nota de excecao a P01 no topo.
   * Sem isso, `for` nao alcancaria o controle e o rotulo perderia a funcao.
   */
  protected override createRenderRoot(): HTMLElement {
    return this;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopListening();
    this.opened = false;
  }

  private get infoText(): string {
    return (this.info ?? '').trim();
  }

  private get triggerName(): string {
    return (this.infoLabel ?? '').trim();
  }

  private get hasTrigger(): boolean {
    return this.infoText !== '' && this.triggerName !== '';
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('info') || changed.has('infoLabel')) {
      if (this.infoText !== '' && this.triggerName === '') {
        const cause = 'info sem info-label';
        if (this.reported !== cause) {
          this.reported = cause;
          devError('info exige info-label, o nome acessivel do gatilho; o gatilho nao foi desenhado.');
        }
      } else {
        this.reported = '';
      }
      if (!this.hasTrigger) {
        this.opened = false;
      }
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    this.toggleAttribute(INFO_ATTRIBUTE, this.hasTrigger);
    /* `opened` e protegido: o mapa tipado do Lit so conhece as chaves publicas. */
    if ((changed as Map<PropertyKey, unknown>).has('opened')) {
      if (this.opened) {
        this.startListening();
      } else {
        this.stopListening();
      }
    }
  }

  private trigger(): HTMLButtonElement | null {
    return this.querySelector<HTMLButtonElement>('.nph-label__info');
  }

  private bubble(): HTMLElement | null {
    return this.querySelector<HTMLElement>('nph-tooltip');
  }

  /* Clique, Enter e Espaco chegam aqui pelo comportamento nativo do botao. */
  private readonly onActivate = (): void => {
    this.opened = !this.opened;
    /* No Safari, clicar num botao nao lhe da foco; sem foco, o Esc nao chega. */
    this.trigger()?.focus();
  };

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.opened) {
      this.opened = false;
      /* O dialogo que contem o formulario nao fecha junto. */
      event.stopPropagation();
    }
  };

  /* Tab para fora: so fecha quando o foco foi para outro lugar conhecido. */
  private readonly onFocusout = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    if (this.opened && next instanceof Node && !this.contains(next)) {
      this.opened = false;
    }
  };

  /* Clique fora do gatilho e do balao fecha (L11.5). */
  private readonly onOutsidePointer = (event: PointerEvent): void => {
    const path = event.composedPath();
    const trigger = this.trigger();
    const bubble = this.bubble();
    if ((trigger && path.includes(trigger)) || (bubble && path.includes(bubble))) {
      return;
    }
    this.opened = false;
  };

  private startListening(): void {
    document.addEventListener('pointerdown', this.onOutsidePointer, true);
  }

  private stopListening(): void {
    document.removeEventListener('pointerdown', this.onOutsidePointer, true);
  }

  protected override render(): TemplateResult {
    const label = html`<label class="nph-label__text" for=${this.for ?? nothing}
      >${this.text}${this.required
        ? html`<span class="nph-label__required" aria-hidden="true">*</span>`
        : nothing}</label
    >`;
    if (!this.hasTrigger) {
      return label;
    }
    return html`${label}<button
        class="nph-label__info"
        type="button"
        aria-label=${this.triggerName}
        aria-expanded=${this.opened ? 'true' : 'false'}
        aria-controls=${this.tooltipId}
        @click=${this.onActivate}
        @keydown=${this.onKeydown}
        @focusout=${this.onFocusout}
      >
        <nph-icon name="circle-info" variant="solid" size="sm"></nph-icon></button
      ><nph-tooltip
        class="nph-label__tooltip"
        id=${this.tooltipId}
        .text=${this.infoText}
        ?open=${this.opened}
      ></nph-tooltip>`;
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
