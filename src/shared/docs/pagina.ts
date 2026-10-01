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

type TextRole =
  | 'heading-lg'
  | 'heading-md'
  | 'body-md'
  | 'body-sm'
  | 'label-md'
  | 'label-sm'
  | 'caption'
  | 'code';

/** As cinco propriedades de um papel de texto, sempre juntas. */
export function textRole(name: TextRole): string {
  return `
    font-family: var(--nph-text-${name}-font-family);
    font-size: var(--nph-text-${name}-font-size);
    line-height: var(--nph-text-${name}-line-height);
    font-weight: var(--nph-text-${name}-font-weight);
    letter-spacing: var(--nph-text-${name}-letter-spacing);
  `;
}

/** Largura de leitura: `layout/max-reading`, para o que se le de ponta a ponta. */
const READING_WIDTH = 'max-width: var(--nph-layout-max-reading);';
const BORDER = 'var(--nph-border-width) solid var(--nph-color-border)';

/** Corpo da pagina de conteudo: fundo, cor e respiro, por token. */
export const body = `
  color: var(--nph-color-foreground);
  background: var(--nph-color-background);
  padding: var(--nph-space-section) var(--nph-space-container-padding);
  display: flex;
  flex-direction: column;
  gap: var(--nph-space-stack);
`;

/** Item do indice: o id da secao e o titulo exibido. */
export interface IndexItem {
  id: string;
  title: string;
}

/** Linha de tabela: o termo (codigo) e a descricao. */
export type TableRow = readonly [string, TemplateResult | string];

export function header(title: string, summary: string): TemplateResult {
  return html`
    <header style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
      <h1 style="margin: 0; ${textRole('heading-lg')}">${title}</h1>
      <p style="margin: 0; ${textRole('body-md')} ${READING_WIDTH}">${summary}</p>
    </header>
  `;
}

/*
 * O preview do Storybook abre links na janela de cima (`base target=_parent`):
 * um `href="#id"` puro tiraria a pessoa do Storybook. O clique rola ate a
 * secao no proprio documento e leva o foco para ela; o `href` fica para
 * semantica e para abrir em nova aba.
 */
/*
 * A secao que recebe o foco pelo indice mostra o anel de foco do Nephos
 * (`focus/ring`, `focus/ring-width`), que troca com o modo de cor. Fica numa
 * regra porque estilo inline nao alcanca `:focus`.
 */
const SECTION_FOCUS = html`
  <style>
    [data-nph-secao]:focus {
      outline: var(--nph-focus-ring-width) solid var(--nph-focus-ring);
      outline-offset: var(--nph-space-inline-tight);
    }
  </style>
`;

function navigateTo(event: Event, id: string): void {
  event.preventDefault();
  const link = event.currentTarget as HTMLElement;
  const target = link.ownerDocument.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ block: 'start' });
  target.focus({ preventScroll: true });
}

export function index(label: string, items: readonly IndexItem[]): TemplateResult {
  return html`
    ${SECTION_FOCUS}
    <nav
      aria-label=${label}
      style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); padding-top: var(--nph-space-stack);"
    >
      <span style="${textRole('label-sm')} color: var(--nph-color-muted-foreground); text-transform: uppercase;">
        ${label}
      </span>
      <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: var(--nph-space-inline-tight);">
        ${items.map(
          ({ id, title }) => html`
            <li>
              <a
                href="#${id}"
                @click=${(event: Event) => navigateTo(event, id)}
                style="display: inline-block; ${textRole('label-sm')} color: var(--nph-color-foreground); text-decoration: none; border: ${BORDER}; border-radius: var(--nph-radius-full); padding: var(--nph-space-inline-tight) var(--nph-space-inline);"
              >
                ${title}
              </a>
            </li>
          `,
        )}
      </ul>
    </nav>
  `;
}

export function section(id: string, title: string, content: TemplateResult): TemplateResult {
  return html`
    <section
      id=${id}
      tabindex="-1"
      data-nph-secao
      style="display: flex; flex-direction: column; gap: var(--nph-space-stack); padding-top: var(--nph-space-section); scroll-margin-top: var(--nph-space-stack); border-radius: var(--nph-radius-control);"
    >
      <h2
        style="margin: 0; ${textRole('heading-md')} padding-bottom: var(--nph-space-stack-tight); border-bottom: ${BORDER};"
      >
        ${title}
      </h2>
      ${content}
    </section>
  `;
}

export function text(content: TemplateResult | string): TemplateResult {
  return html`<p style="margin: 0; ${textRole('body-md')} ${READING_WIDTH}">${content}</p>`;
}

export function list(items: readonly string[]): TemplateResult {
  return html`
    <ul style="margin: 0; padding-left: var(--nph-space-container-padding); ${textRole('body-md')} ${READING_WIDTH} display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
      ${items.map((item) => html`<li>${item}</li>`)}
    </ul>
  `;
}

export function example(content: TemplateResult, caption: string): TemplateResult {
  return html`
    <figure data-nph-demonstracao style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
      <div
        style="border: ${BORDER}; border-radius: var(--nph-radius-control); padding: var(--nph-space-section) var(--nph-space-container-padding); display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: var(--nph-space-section);"
      >
        ${content}
      </div>
      <figcaption style="${textRole('caption')} color: var(--nph-color-muted-foreground);">${caption}</figcaption>
    </figure>
  `;
}

/**
 * Como a primeira coluna aparece: `codigo` sempre em text/code; `texto` sempre
 * em text/body-sm; `auto` usa text/code so quando o termo e um identificador
 * (minusculas, sem acento nem espaco: `name`, `icon/size-sm`) e texto nos
 * demais ("Slots e eventos", "Interação").
 */
export type TermColumn = 'code' | 'text' | 'auto';

function isIdentifier(term: string): boolean {
  return /^[a-z0-9][a-z0-9/_.:-]*$/.test(term.trim());
}

export function table(
  headers: readonly [string, string],
  rows: readonly TableRow[],
  term: TermColumn = 'code',
): TemplateResult {
  const termRole = (text: string): string =>
    term === 'code' || (term === 'auto' && isIdentifier(text))
      ? `${textRole('code')} white-space: nowrap;`
      : `${textRole('body-sm')} font-weight: var(--nph-text-label-md-font-weight);`;
  const cell = `padding: var(--nph-space-stack) var(--nph-space-inline); border-bottom: ${BORDER}; vertical-align: top; text-align: left;`;
  return html`
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          ${headers.map(
            (title) => html`
              <th
                scope="col"
                style="${cell} padding-top: var(--nph-space-inline-tight); padding-bottom: var(--nph-space-inline-tight); ${textRole('label-sm')} color: var(--nph-color-muted-foreground); text-transform: uppercase;"
              >
                ${title}
              </th>
            `,
          )}
        </tr>
      </thead>
      <tbody>
        ${rows.map(
          ([name, description]) => html`
            <tr>
              <th scope="row" style="${cell} ${termRole(name)}">${name}</th>
              <td style="${cell} ${textRole('body-sm')}">${description}</td>
            </tr>
          `,
        )}
      </tbody>
    </table>
  `;
}

type NoteType = 'info' | 'warning';

const NOTE_ICON: Record<NoteType, 'circle-info' | 'triangle-exclamation'> = {
  info: 'circle-info',
  warning: 'triangle-exclamation',
};

export function note(type: NoteType, title: string, content: string): TemplateResult {
  return html`
    <div
      role="note"
      data-nph-nota=${type}
      style="display: flex; gap: var(--nph-space-inline); padding: var(--nph-space-stack) var(--nph-space-container-padding); border-radius: var(--nph-radius-control); background: var(--nph-status-${type}-surface); border: var(--nph-border-width) solid var(--nph-status-${type}-border); color: var(--nph-status-${type}-foreground);"
    >
      <span style="color: var(--nph-status-${type}); display: inline-flex;">
        <nph-icon name=${NOTE_ICON[type]} size="md"></nph-icon>
      </span>
      <div style="display: flex; flex-direction: column; gap: var(--nph-space-inline-tight);">
        <strong style="${textRole('label-md')}">${title}</strong>
        <span style="${textRole('body-sm')}">${content}</span>
      </div>
    </div>
  `;
}

type CardType = 'success' | 'error';

function card(
  type: CardType,
  title: string,
  items: readonly string[],
): TemplateResult {
  const icon = type === 'success' ? 'circle-check' : 'circle-xmark';
  return html`
    <div
      data-nph-cartao=${type}
      style="flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); padding: var(--nph-space-stack) var(--nph-space-container-padding); border-radius: var(--nph-radius-control); background: var(--nph-status-${type}-surface); border: var(--nph-border-width) solid var(--nph-status-${type}-border); color: var(--nph-status-${type}-foreground);"
    >
      <strong style="${textRole('label-md')}">${title}</strong>
      <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
        ${items.map(
          (item) => html`
            <li style="display: flex; gap: var(--nph-space-inline-tight); ${textRole('body-sm')}">
              <span
                style="color: var(--nph-status-${type}); display: inline-flex; align-items: center; height: var(--nph-text-body-sm-line-height);"
              >
                <nph-icon name=${icon} size="sm"></nph-icon>
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
export function useOrDoNotUse(
  use: { title: string; items: readonly string[] },
  doNotUse: { title: string; items: readonly string[] },
): TemplateResult {
  return html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);">
      ${card('success', use.title, use.items)} ${card('error', doNotUse.title, doNotUse.items)}
    </div>
  `;
}

/** So o cartao de erro, para listas de anti-padrao. */
export function doNot(title: string, items: readonly string[]): TemplateResult {
  return html`<div style="display: flex;">${card('error', title, items)}</div>`;
}

/** Rodape de origem. Toda regra exibida aponta de onde veio. */
export function source(label: string, origin: string): TemplateResult {
  return html`
    <p
      style="margin: 0; padding-top: var(--nph-space-stack-tight); border-top: ${BORDER}; ${textRole('caption')} color: var(--nph-color-muted-foreground);"
    >
      ${label} ${origin}
    </p>
  `;
}
