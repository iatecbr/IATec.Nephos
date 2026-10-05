/**
 * Moldura compartilhada pelas stories do `nph-icon`.
 *
 * Este arquivo NAO e uma story: o nome nao termina em `.stories.ts`, entao o
 * glob do Storybook nao o indexa. Ele existe para que a pagina de documentacao
 * e a pagina de validacao usem o mesmo cenario sem duplicar codigo.
 *
 * Nada aqui e contrato. Os poucos valores literais que aparecem (colunas de
 * grade, largura do campo de busca) pertencem a moldura da demonstracao e
 * NAO valem como precedente para CSS de componente. O que e contrato esta no
 * proprio `nph-icon` e nas fontes canonicas.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import { textRole } from '../../shared/docs/page';
import { NPH_ICON_NAMES } from './nph-icon.icons';
import type { NphIconName } from './nph-icon.icons';

/**
 * Um grupo do nucleo. O TITULO nao mora aqui: titulo e texto de vitrine e vem
 * do dicionario de idioma, em `.storybook/i18n/`. A ordem dos grupos abaixo e a
 * do `design.md` e casa, posicao a posicao, com `categories` no dicionario.
 */
export type CoreCategory = readonly NphIconName[];

/**
 * Indice de categorias do nucleo. A ordem vem de `icones_nucleo`, no
 * `design.md`. Este indice AGRUPA os nomes; ele nao os define — a fonte tecnica
 * continua sendo `NPH_ICON_NAMES`, e `nph-icon.demo.test.ts` exige que os dois
 * conjuntos sejam identicos.
 */
export const CATEGORIES: readonly CoreCategory[] = [
  /* navegacao_e_menus */
  ['bars', 'house'],
  /* direcao_e_revelacao */
  [
    'angle-left',
    'arrow-down-to-line',
    'arrow-left',
    'arrow-right',
    'arrow-up',
    'caret-up',
    'chevron-down',
    'chevron-left',
    'chevron-right',
    'chevron-up',
    'chevrons-down',
    'chevrons-left',
    'circle-chevron-down',
    'circle-chevron-left',
    'circle-down',
    'circle-up',
    'ellipsis',
    'eye',
    'eye-slash',
    'square-chevron-left',
    'triple-chevrons-left',
  ],
  /* acao */
  [
    'arrow-down-arrow-up',
    'arrow-up-arrow-down',
    'arrow-up-from-bracket',
    'check',
    'circle-half-stroke',
    'cloud-arrow-up',
    'download',
    'ellipsis-vertical',
    'filter',
    'filter-slash',
    'gear',
    'grid-2',
    'grip-vertical',
    'link',
    'list',
    'magnifying-glass',
    'minus',
    'paper-plane',
    'paperclip',
    'pen',
    'pen-to-square',
    'plus',
    'print',
    'right-to-bracket',
    'rotate-right',
    'share',
    'share-from-square',
    'thumbs-down',
    'thumbs-up',
    'thumbtack',
    'thumbtack-slash',
    'trash',
    'trash-can',
    'user-circle-minus',
    'user-circle-plus',
    'user-minus',
    'xmark',
  ],
  /* estado_e_comunicacao */
  [
    'alarm-clock',
    'badge-check',
    'bell',
    'circle-check',
    'circle-info',
    'circle-notch',
    'circle-question',
    'circle-xmark',
    'heart',
    'lock',
    'question',
    'star',
    'triangle-exclamation',
  ],
  /* conteudo_e_dados */
  [
    'calendar',
    'calendar-days',
    'circle-user',
    'clipboard',
    'clock',
    'comment',
    'envelope',
    'file',
    'files',
    'folder',
    'folder-open',
    'font-awesome',
    'globe',
    'inbox',
    'key',
    'location-dot',
    'suitcase',
    'tag',
    'trophy',
    'user',
  ],
];

/**
 * Filtro puro da galeria. Recebe nomes do nucleo e devolve um SUBCONJUNTO
 * deles: por construcao, a busca nunca pode revelar icone fora dos aprovados.
 * Termo vazio ou so com espacos devolve tudo.
 */
export function filterNames(
  names: readonly NphIconName[],
  term: string,
): NphIconName[] {
  const needle = term.trim().toLowerCase();
  if (needle === '') {
    return [...names];
  }
  return names.filter((name) => name.includes(needle));
}

/** Total do nucleo, derivado do mapa fechado — nunca digitado a mao. */
export const CORE_TOTAL = NPH_ICON_NAMES.length;

/*
 * Moldura das paginas do `nph-icon`. O cabecalho, as secoes, a demonstracao e
 * as notas vem de `src/shared/docs/page.ts`, iguais aos da pagina Documentacao;
 * aqui fica so o que e proprio destas paginas: a amostra com legenda, a busca e
 * a grade do catalogo.
 */

const BORDER = 'var(--nph-border-width) solid var(--nph-color-border)';

/** Amostra de demonstracao: a instancia real em cima, a legenda tecnica embaixo. */
export function specimen(
  content: TemplateResult,
  label: TemplateResult | string,
): TemplateResult {
  return html`
    <div
      style="display: flex; flex-direction: column; align-items: center; gap: var(--nph-space-stack-tight); text-align: center;"
    >
      ${content}
      <span style="${textRole('code')} color: var(--nph-color-muted-foreground);">${label}</span>
    </div>
  `;
}

/** Rotulo, campo e botao da busca do catalogo. */
export const searchLabel = `${textRole('label-md')}`;

export const field = `
  ${textRole('body-md')}
  color: var(--nph-color-foreground);
  background: var(--nph-color-background);
  border: ${BORDER};
  border-radius: var(--nph-radius-control);
  padding: var(--nph-space-control-padding);
  width: 18rem;
  max-width: 100%;
  box-sizing: border-box;
`;

export const button = `
  ${textRole('label-md')}
  color: var(--nph-color-foreground);
  background: var(--nph-color-card);
  border: ${BORDER};
  border-radius: var(--nph-radius-control);
  padding: var(--nph-space-control-padding);
  cursor: pointer;
`;

/** Contador da busca, em legenda. */
export const counter = `
  margin: 0;
  ${textRole('caption')}
  color: var(--nph-color-muted-foreground);
`;

/** Grade do catalogo: cartoes de mesma largura, quantos couberem na linha. */
export const grid = `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: var(--nph-space-stack);
`;

/** Cartao de um icone no catalogo: o icone centrado e o nome embaixo. */
export const tile = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--nph-space-stack-tight);
  padding: var(--nph-space-stack) var(--nph-space-inline);
  border: ${BORDER};
  border-radius: var(--nph-radius-control);
  text-align: center;
  overflow-wrap: anywhere;
`;

export const tileName = `
  ${textRole('code')}
  color: var(--nph-color-muted-foreground);
`;
