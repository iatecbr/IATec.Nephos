/**
 * `nph-button` — o botao que dispara uma acao identificada por texto.
 *
 * Contrato aceito no Figma (quadro `1197:5449`, conjuntos `461:13009`, com
 * texto, e `498:15671`, so icone), decisoes B1, B5 e B6 do Registro (vault),
 * hover solido nos tokens de hover (02-10-2026, supera a B4) e P68:
 * - `severity` (o `tipo` do Figma): `primary` (padrao), `secondary`, `info`,
 *   `warn`, `help`, `danger` ou `success`. Escolhe-se pelo significado da acao;
 * - `emphasis` (a `enfase`): `solid` (padrao), `outline`, `light` ou `ghost`.
 *   `outline`, `light` e `ghost` existem so em primary, secondary e danger (B1);
 * - `size`: `compact` (padrao, pelo quadro aceito), `default` ou `large`;
 * - `text`: diz o que acontece ao clicar. E o nome acessivel;
 * - `icon-start` e `icon-end`: um nome do nucleo do `nph-icon` cada, em
 *   `icon/size-sm` com texto. Podem conviver (B6);
 * - sem texto, o botao e o "so icone" (B5): um icone so, que acompanha a caixa
 *   (sm no compact, md no default, lg no large), e `label` obrigatorio como
 *   nome acessivel;
 * - `disabled`: o botao inteiro em `state/disabled-opacity` e fora do Tab;
 * - `loading` (o `carregando`): o girador do `nph-spinner` entra no lugar do
 *   icone de inicio, o icone de fim some e o texto fica. O botao continua
 *   focavel e o clique nao chega a quem usa;
 * - sem slot, sem evento proprio, sem propriedade de cor e sem `::part`. O
 *   clique e o `click` nativo, que atravessa o shadow root;
 * - entrada invalida nao renderiza e emite `console.error` so em
 *   desenvolvimento, um por causa e acumulando (P68, regra da P21). Sem texto e
 *   sem icone e montagem: nada, sem erro (precedente do `nph-kbd`, P66).
 */
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import '../nph-spinner/nph-spinner';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import type { NphIconSize } from '../nph-icon/nph-icon.icons';
import buttonCss from './nph-button.css?inline';

const TAG = 'nph-button';

/** Marcas internas, nao API. */
const RENDERED_ATTRIBUTE = 'data-nph-rendered';
const ICON_ONLY_ATTRIBUTE = 'data-nph-icon-only';

export const NPH_BUTTON_SEVERITIES = [
  'primary',
  'secondary',
  'info',
  'warn',
  'help',
  'danger',
  'success',
] as const;
export type NphButtonSeverity = (typeof NPH_BUTTON_SEVERITIES)[number];

export const NPH_BUTTON_EMPHASES = ['solid', 'outline', 'light', 'ghost'] as const;
export type NphButtonEmphasis = (typeof NPH_BUTTON_EMPHASES)[number];

export const NPH_BUTTON_SIZES = ['compact', 'default', 'large'] as const;
export type NphButtonSize = (typeof NPH_BUTTON_SIZES)[number];

/** Os tipos que so existem em `solid` (B1). */
const SOLID_ONLY: readonly NphButtonSeverity[] = ['info', 'warn', 'help', 'success'];

/** No so icone, o icone acompanha a caixa (Description de `498:15671`). */
const ICON_ONLY_ICON_SIZE: Readonly<Record<NphButtonSize, NphIconSize>> = {
  compact: 'sm',
  default: 'md',
  large: 'lg',
};

/** O girador do so icone: `sm` no compact, `md` no default e no large (Figma). */
const ICON_ONLY_SPINNER_SIZE: Readonly<Record<NphButtonSize, 'sm' | 'md'>> = {
  compact: 'sm',
  default: 'md',
  large: 'md',
};

/** Erro de desenvolvimento; fora de bundler com `import.meta.env`, silencia. */
function devError(message: string): void {
  if (import.meta.env?.DEV) {
    console.error(`[${TAG}] ${message}`);
  }
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

export class NphButton extends LitElement {
  static override styles = unsafeCSS(buttonCss);

  /* O foco do host vai para o `<button>` nativo de dentro. */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties = {
    /* Os cinco que refletem sao lidos pelo CSS interno. */
    severity: { type: String, reflect: true },
    emphasis: { type: String, reflect: true },
    size: { type: String, reflect: true },
    text: { type: String },
    iconStart: { type: String, attribute: 'icon-start' },
    iconEnd: { type: String, attribute: 'icon-end' },
    label: { type: String },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
  };

  declare severity: NphButtonSeverity;
  declare emphasis: NphButtonEmphasis;
  declare size: NphButtonSize;
  /** O que acontece ao clicar, ja localizado pela aplicacao consumidora. */
  declare text: string;
  declare iconStart: string;
  declare iconEnd: string;
  /** Nome acessivel do so icone. Com texto, nao e usado. */
  declare label: string;
  declare disabled: boolean;
  declare loading: boolean;

  private valid = false;
  private iconOnly = false;

  constructor() {
    super();
    this.severity = 'primary';
    this.emphasis = 'solid';
    this.size = 'compact';
    this.text = '';
    this.iconStart = '';
    this.iconEnd = '';
    this.label = '';
    this.disabled = false;
    this.loading = false;
    /* `click()` chamado no proprio host tambem para em disabled e loading. */
    this.addEventListener('click', (event) => this.blockInactive(event), { capture: true });
  }

  /** Em disabled ou loading, o clique nao chega a quem usa. */
  private blockInactive(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  protected override willUpdate(_changed: PropertyValues): void {
    const severity = this.severity ?? '';
    const emphasis = this.emphasis ?? '';
    const size = this.size ?? '';
    const text = (this.text ?? '').trim();
    const start = (this.iconStart ?? '').trim();
    const end = (this.iconEnd ?? '').trim();
    let valid = true;

    if (!oneOf(NPH_BUTTON_SEVERITIES, severity)) {
      devError(`severity "${severity}" nao existe. Use ${NPH_BUTTON_SEVERITIES.join(', ')}.`);
      valid = false;
    }
    if (!oneOf(NPH_BUTTON_EMPHASES, emphasis)) {
      devError(`emphasis "${emphasis}" nao existe. Use ${NPH_BUTTON_EMPHASES.join(', ')}.`);
      valid = false;
    } else if (emphasis !== 'solid' && (SOLID_ONLY as readonly string[]).includes(severity)) {
      devError(`emphasis "${emphasis}" nao existe em severity "${severity}": so solid (B1).`);
      valid = false;
    }
    if (!oneOf(NPH_BUTTON_SIZES, size)) {
      devError(`size "${size}" nao existe. Use ${NPH_BUTTON_SIZES.join(', ')}.`);
      valid = false;
    }
    if (start !== '' && !isCoreName(start)) {
      devError(`icon-start "${start}" nao e um nome do nucleo do nph-icon.`);
      valid = false;
    }
    if (end !== '' && !isCoreName(end)) {
      devError(`icon-end "${end}" nao e um nome do nucleo do nph-icon.`);
      valid = false;
    }

    const icons = (start !== '' ? 1 : 0) + (end !== '' ? 1 : 0);
    if (text === '' && icons === 2) {
      devError('sem texto, o botao tem um icone so: dois icones sem rotulo nao dizem a acao.');
      valid = false;
    }
    if (text === '' && icons === 1 && (this.label ?? '').trim() === '') {
      devError('sem texto, o botao precisa de label: e o nome acessivel do so icone.');
      valid = false;
    }

    /* Sem texto e sem icone e montagem, nao erro: nada a desenhar. */
    this.valid = valid && (text !== '' || icons > 0);
    this.iconOnly = text === '' && icons === 1;
    this.toggleAttribute(RENDERED_ATTRIBUTE, this.valid);
    this.toggleAttribute(ICON_ONLY_ATTRIBUTE, this.valid && this.iconOnly);
  }

  private glyph(name: string, size: NphIconSize): TemplateResult {
    return html`<nph-icon class="icon" name=${name} size=${size}></nph-icon>`;
  }

  private spinner(size: 'sm' | 'md'): TemplateResult {
    return html`<nph-spinner class="icon" size=${size}></nph-spinner>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.valid) {
      return nothing;
    }
    const size = this.size;
    const text = this.text.trim();
    const start = (this.iconStart ?? '').trim();
    const end = (this.iconEnd ?? '').trim();

    let content: TemplateResult;
    if (this.iconOnly) {
      content = this.loading
        ? this.spinner(ICON_ONLY_SPINNER_SIZE[size])
        : this.glyph(start || end, ICON_ONLY_ICON_SIZE[size]);
    } else {
      const lead = this.loading ? this.spinner('sm') : start !== '' ? this.glyph(start, 'sm') : nothing;
      const tail = !this.loading && end !== '' ? this.glyph(end, 'sm') : nothing;
      content = html`${lead}<span class="text">${text}</span>${tail}`;
    }

    return html`<button
      class="control"
      type="button"
      ?disabled=${this.disabled}
      aria-label=${this.iconOnly ? this.label.trim() : nothing}
      aria-disabled=${this.loading && !this.disabled ? 'true' : nothing}
      aria-busy=${this.loading ? 'true' : nothing}
      @click=${(event: Event) => this.blockInactive(event)}
    >
      ${content}
    </button>`;
  }
}

if (customElements.get(TAG) === undefined) {
  customElements.define(TAG, NphButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'nph-button': NphButton;
  }
}
