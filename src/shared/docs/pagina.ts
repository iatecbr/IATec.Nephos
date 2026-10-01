/**
 * Blocos da pagina de conteudo do Storybook do Nephos.
 *
 * Toda pagina de leitura de componente monta o texto com estes blocos, para que
 * as paginas se leiam do mesmo jeito: titulo de secao com linha, texto com
 * largura de leitura, demonstracao em area propria, tabela com cabecalho,
 * excecao como nota e fonte no rodape. Ver `docs/stories.md`, §4.8.
 *
 * So `--nph-*`: nenhum hex, nenhum valor de cor literal. O h1 da pagina usa
 * `text/heading-lg` e o titulo de secao `text/heading-md` (design.md: o titulo
 * da tela e heading-lg; secao dentro dela e heading-md).
 *
 * A demonstracao NAO tem fundo proprio: so a borda separa o exemplo do texto.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../../components/nph-icon/nph-icon';

type Papel =
  | 'heading-lg'
  | 'heading-md'
  | 'body-md'
  | 'body-sm'
  | 'label-md'
  | 'label-sm'
  | 'caption'
  | 'code';

/** As cinco propriedades de um papel de texto, sempre juntas. */
export function papel(nome: Papel): string {
  return `
    font-family: var(--nph-text-${nome}-font-family);
    font-size: var(--nph-text-${nome}-font-size);
    line-height: var(--nph-text-${nome}-line-height);
    font-weight: var(--nph-text-${nome}-font-weight);
    letter-spacing: var(--nph-text-${nome}-letter-spacing);
  `;
}

const LEITURA = 'max-width: 62ch;';
const BORDA = 'var(--nph-border-width) solid var(--nph-color-border)';

/** Corpo da pagina de conteudo: fundo, cor e respiro, por token. */
export const corpo = `
  color: var(--nph-color-foreground);
  background: var(--nph-color-background);
  padding: var(--nph-space-section) var(--nph-space-container-padding);
  display: flex;
  flex-direction: column;
  gap: var(--nph-space-stack);
`;

/** Item do indice: o id da secao e o titulo exibido. */
export interface ItemDoIndice {
  id: string;
  titulo: string;
}

/** Linha de tabela: o termo (codigo) e a descricao. */
export type LinhaDeTabela = readonly [string, TemplateResult | string];

export function cabecalho(titulo: string, resumo: string): TemplateResult {
  return html`
    <header style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
      <h1 style="margin: 0; ${papel('heading-lg')}">${titulo}</h1>
      <p style="margin: 0; ${papel('body-md')} ${LEITURA}">${resumo}</p>
    </header>
  `;
}

/*
 * O preview do Storybook abre links na janela de cima (`base target=_parent`):
 * um `href="#id"` puro tiraria a pessoa do Storybook. O clique rola ate a
 * secao no proprio documento e leva o foco para ela; o `href` fica para
 * semantica e para abrir em nova aba.
 */
function irPara(evento: Event, id: string): void {
  evento.preventDefault();
  const link = evento.currentTarget as HTMLElement;
  const destino = link.ownerDocument.getElementById(id);
  if (!destino) return;
  destino.scrollIntoView({ block: 'start' });
  destino.focus({ preventScroll: true });
}

export function indice(rotulo: string, itens: readonly ItemDoIndice[]): TemplateResult {
  return html`
    <nav
      aria-label=${rotulo}
      style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); padding-top: var(--nph-space-stack);"
    >
      <span style="${papel('label-sm')} color: var(--nph-color-muted-foreground); text-transform: uppercase;">
        ${rotulo}
      </span>
      <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: var(--nph-space-inline-tight);">
        ${itens.map(
          ({ id, titulo }) => html`
            <li>
              <a
                href="#${id}"
                @click=${(evento: Event) => irPara(evento, id)}
                style="display: inline-block; ${papel('label-sm')} color: var(--nph-color-foreground); text-decoration: none; border: ${BORDA}; border-radius: var(--nph-radius-full); padding: var(--nph-space-inline-tight) var(--nph-space-inline);"
              >
                ${titulo}
              </a>
            </li>
          `,
        )}
      </ul>
    </nav>
  `;
}

export function secao(id: string, titulo: string, conteudo: TemplateResult): TemplateResult {
  return html`
    <section
      id=${id}
      tabindex="-1"
      style="display: flex; flex-direction: column; gap: var(--nph-space-stack); padding-top: var(--nph-space-section); scroll-margin-top: var(--nph-space-stack); outline: none;"
    >
      <h2
        style="margin: 0; ${papel('heading-md')} padding-bottom: var(--nph-space-stack-tight); border-bottom: ${BORDA};"
      >
        ${titulo}
      </h2>
      ${conteudo}
    </section>
  `;
}

export function texto(conteudo: TemplateResult | string): TemplateResult {
  return html`<p style="margin: 0; ${papel('body-md')} ${LEITURA}">${conteudo}</p>`;
}

export function lista(itens: readonly string[]): TemplateResult {
  return html`
    <ul style="margin: 0; padding-left: var(--nph-space-container-padding); ${papel('body-md')} ${LEITURA} display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
      ${itens.map((item) => html`<li>${item}</li>`)}
    </ul>
  `;
}

export function demonstracao(conteudo: TemplateResult, legenda: string): TemplateResult {
  return html`
    <figure data-nph-demonstracao style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
      <div
        style="border: ${BORDA}; border-radius: var(--nph-radius-control); padding: var(--nph-space-section) var(--nph-space-container-padding); display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: var(--nph-space-section);"
      >
        ${conteudo}
      </div>
      <figcaption style="${papel('caption')} color: var(--nph-color-muted-foreground);">${legenda}</figcaption>
    </figure>
  `;
}

/**
 * Como a primeira coluna aparece: `codigo` sempre em text/code; `texto` sempre
 * em text/body-sm; `auto` usa text/code so quando o termo e um identificador
 * (minusculas, sem acento nem espaco: `name`, `icon/size-sm`) e texto nos
 * demais ("Slots e eventos", "Interação").
 */
export type ColunaDoTermo = 'codigo' | 'texto' | 'auto';

function ehIdentificador(termo: string): boolean {
  return /^[a-z0-9][a-z0-9/_.:-]*$/.test(termo.trim());
}

export function tabela(
  cabecalhos: readonly [string, string],
  linhas: readonly LinhaDeTabela[],
  termo: ColunaDoTermo = 'codigo',
): TemplateResult {
  const papelDoTermo = (texto: string): string =>
    termo === 'codigo' || (termo === 'auto' && ehIdentificador(texto))
      ? `${papel('code')} white-space: nowrap;`
      : `${papel('body-sm')} font-weight: var(--nph-text-label-md-font-weight);`;
  const celula = `padding: var(--nph-space-stack) var(--nph-space-inline); border-bottom: ${BORDA}; vertical-align: top; text-align: left;`;
  return html`
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          ${cabecalhos.map(
            (titulo) => html`
              <th
                scope="col"
                style="${celula} padding-top: var(--nph-space-inline-tight); padding-bottom: var(--nph-space-inline-tight); ${papel('label-sm')} color: var(--nph-color-muted-foreground); text-transform: uppercase;"
              >
                ${titulo}
              </th>
            `,
          )}
        </tr>
      </thead>
      <tbody>
        ${linhas.map(
          ([nome, descricao]) => html`
            <tr>
              <th scope="row" style="${celula} ${papelDoTermo(nome)}">${nome}</th>
              <td style="${celula} ${papel('body-sm')}">${descricao}</td>
            </tr>
          `,
        )}
      </tbody>
    </table>
  `;
}

type TipoDeNota = 'info' | 'warning';

const ICONE_DA_NOTA: Record<TipoDeNota, 'circle-info' | 'triangle-exclamation'> = {
  info: 'circle-info',
  warning: 'triangle-exclamation',
};

export function nota(tipo: TipoDeNota, titulo: string, conteudo: string): TemplateResult {
  return html`
    <div
      role="note"
      data-nph-nota=${tipo}
      style="display: flex; gap: var(--nph-space-inline); padding: var(--nph-space-stack) var(--nph-space-container-padding); border-radius: var(--nph-radius-control); background: var(--nph-status-${tipo}-surface); border: var(--nph-border-width) solid var(--nph-status-${tipo}-border); color: var(--nph-status-${tipo}-foreground);"
    >
      <span style="color: var(--nph-status-${tipo}); display: inline-flex;">
        <nph-icon name=${ICONE_DA_NOTA[tipo]} size="md"></nph-icon>
      </span>
      <div style="display: flex; flex-direction: column; gap: var(--nph-space-inline-tight);">
        <strong style="${papel('label-md')}">${titulo}</strong>
        <span style="${papel('body-sm')}">${conteudo}</span>
      </div>
    </div>
  `;
}

type TipoDeCartao = 'success' | 'error';

function cartao(
  tipo: TipoDeCartao,
  titulo: string,
  itens: readonly string[],
): TemplateResult {
  const icone = tipo === 'success' ? 'circle-check' : 'circle-xmark';
  return html`
    <div
      data-nph-cartao=${tipo}
      style="flex: 1 1 18rem; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); padding: var(--nph-space-stack) var(--nph-space-container-padding); border-radius: var(--nph-radius-control); background: var(--nph-status-${tipo}-surface); border: var(--nph-border-width) solid var(--nph-status-${tipo}-border); color: var(--nph-status-${tipo}-foreground);"
    >
      <strong style="${papel('label-md')}">${titulo}</strong>
      <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
        ${itens.map(
          (item) => html`
            <li style="display: flex; gap: var(--nph-space-inline-tight); ${papel('body-sm')}">
              <span style="color: var(--nph-status-${tipo}); display: inline-flex; padding-top: 2px;">
                <nph-icon name=${icone} size="sm"></nph-icon>
              </span>
              <span>${item}</span>
            </li>
          `,
        )}
      </ul>
    </div>
  `;
}

/** Quando usar e quando nao usar, lado a lado. */
export function usarNaoUsar(
  usar: { titulo: string; itens: readonly string[] },
  naoUsar: { titulo: string; itens: readonly string[] },
): TemplateResult {
  return html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);">
      ${cartao('success', usar.titulo, usar.itens)} ${cartao('error', naoUsar.titulo, naoUsar.itens)}
    </div>
  `;
}

/** So o cartao de erro, para listas de anti-padrao. */
export function naoFazer(titulo: string, itens: readonly string[]): TemplateResult {
  return html`<div style="display: flex;">${cartao('error', titulo, itens)}</div>`;
}

/** Rodape de origem. Toda regra exibida aponta de onde veio. */
export function fonte(rotulo: string, origem: string): TemplateResult {
  return html`
    <p
      style="margin: 0; padding-top: var(--nph-space-stack-tight); border-top: ${BORDA}; ${papel('caption')} color: var(--nph-color-muted-foreground);"
    >
      ${rotulo} ${origem}
    </p>
  `;
}
