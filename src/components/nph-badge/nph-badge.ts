/**
 * `nph-badge` — o selo que rotula o estado ou a categoria de um item.
 *
 * Contrato aceito no Figma (quadro `1196:1100`, conjunto `878:30`) e P68:
 * - `severity` (o `tipo` do Figma): `primary` (padrao), `secondary`, `info`,
 *   `warn`, `help`, `danger` ou `success`. Escolhe-se pelo significado;
 * - `emphasis` (a `enfase`): `solid` (padrao) ou `light`;
 * - `text`: uma ou duas palavras. E o nome acessivel. Se nao ha o que
 *   escrever, nao ha selo: vazio ou so espacos nao mostra nada, sem erro;
 * - `icon`: opcional, um nome do nucleo do `nph-icon`, antes do texto, em
 *   `icon/size-sm` e na cor do texto. So reforca a palavra: e decorativo;
 * - sem clique, foco, hover, evento, slot, propriedade de cor ou `::part`;
 * - `severity`, `emphasis` ou `icon` invalidos nao renderizam e emitem
 *   `console.error` so em desenvolvimento, um por causa (P68, regra da P21).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import badgeCss from './nph-badge.css?inline';

const TAG = 'nph-badge';

/** Marca interna, nao API: presente so quando ha selo desenhado. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';

export const NPH_BADGE_SEVERITIES = [
  'primary',
  'secondary',
  'info',
  'warn',
  'help',
  'danger',
  'success',
] as const;
export type NphBadgeSeverity = (typeof NPH_BADGE_SEVERITIES)[number];

export const NPH_BADGE_EMPHASES = ['solid', 'light'] as const;
export type NphBadgeEmphasis = (typeof NPH_BADGE_EMPHASES)[number];

/** Erro de desenvolvimento; fora de bundler com `import.meta.env`, silencia. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

export class NphBadge extends LitElement {
  static override styles = unsafeCSS(badgeCss);

  static override properties = {
    /* `severity` e `emphasis` refletem porque o CSS interno seleciona por eles. */
    severity: { type: String, reflect: true },
    emphasis: { type: String, reflect: true },
    text: { type: String },
    icon: { type: String },
  };

  /** O tipo do selo, pelo significado. */
  declare severity: NphBadgeSeverity;

  /** `solid` ou `light`. */
  declare emphasis: NphBadgeEmphasis;

  /** Uma ou duas palavras, ja localizadas pela aplicacao consumidora. */
  declare text: string;

  /** Nome de icone do nucleo, ou vazio para nenhum. */
  declare icon: string;

  private valid = false;

  constructor() {
    super();
    this.severity = 'primary';
    this.emphasis = 'solid';
    this.text = '';
    this.icon = '';
  }

  protected override willUpdate(): void {
    const severity = this.severity ?? '';
    const emphasis = this.emphasis ?? '';
    const icon = (this.icon ?? '').trim();
    let valid = true;
    if (!oneOf(NPH_BADGE_SEVERITIES, severity)) {
      devError(`severity "${severity}" nao existe. Use ${NPH_BADGE_SEVERITIES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_BADGE_EMPHASES, emphasis)) {
      devError(`emphasis "${emphasis}" nao existe. Use solid ou light.`);
      valid = false;
    }
    if (icon !== '' && !isCoreName(icon)) {
      devError(`icon "${icon}" nao e um nome do nucleo do nph-icon.`);
      valid = false;
    }
    /* Texto vazio e montagem, nao erro: sem palavra, sem selo. */
    this.valid = valid && (this.text ?? '').trim() !== '';
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const icon = (this.icon ?? '').trim();
    return html`${icon !== '' ? html`<nph-icon class="icon" name=${icon} size="sm"></nph-icon>` : nothing}<span
        class="text"
        >${(this.text ?? '').trim()}</span
      >`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphBadge);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-badge': NphBadge;
  }
}
