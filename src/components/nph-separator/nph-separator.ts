/**
 * `nph-separator` — o divisor decorativo de uma linha.
 *
 * Contrato aceito no Figma (quadro `1196:674`, conjunto `762:6`) e P66:
 * - `orientation` `horizontal` (padrao) ou `vertical`. Horizontal entre itens
 *   empilhados; vertical entre itens lado a lado;
 * - uma linha de `border/width` em `color/border`. Espessura e cor nao mudam:
 *   o divisor nao carrega estado;
 * - a instancia preenche o conteiner. A horizontal preenche a largura em pai de
 *   bloco ou flex em coluna; a vertical preenche a altura em pai flex em linha
 *   ou grid. Fora disso, quem usa da o comprimento;
 * - decorativo: fora da arvore de acessibilidade, sem foco, sem texto;
 * - `orientation` invalida nao renderiza e emite `console.error` so em
 *   desenvolvimento, sem fallback visual.
 */
import { LitElement, unsafeCSS } from 'lit';

import separatorCss from './nph-separator.css?inline';

const TAG = 'nph-separator';

/** Marca interna, nao API: presente so quando a orientacao e valida. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_SEPARATOR_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type NphSeparatorOrientation = (typeof NPH_SEPARATOR_ORIENTATIONS)[number];

function isOrientation(value: string): value is NphSeparatorOrientation {
  return (NPH_SEPARATOR_ORIENTATIONS as readonly string[]).includes(value);
}

/** Erro de desenvolvimento; fora de bundler com `import.meta.env`, silencia. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

export class NphSeparator extends LitElement {
  static override styles = unsafeCSS(separatorCss);

  static override properties = {
    /* `orientation` reflete porque o CSS interno seleciona a linha por ela. */
    orientation: { type: String, reflect: true },
  };

  /** `horizontal` por padrao. */
  declare orientation: NphSeparatorOrientation;

  constructor() {
    super();
    this.orientation = 'horizontal';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
  }

  protected override willUpdate(): void {
    const orientation = this.orientation ?? '';
    const valid = isOrientation(orientation);
    if (!valid) {
      devError(`orientation "${orientation}" nao existe. Use "horizontal" ou "vertical".`);
    }
    this.toggleAttribute(RENDERED_ATTRIBUTE, valid);
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphSeparator);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-separator': NphSeparator;
  }
}
