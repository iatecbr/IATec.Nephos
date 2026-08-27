/**
 * Moldura compartilhada pelas stories do `nph-icon`.
 *
 * Este arquivo NAO e uma story: o nome nao termina em `.stories.ts`, entao o
 * glob do Storybook nao o indexa. Ele existe para que a pagina de documentacao
 * e a pagina de validacao usem o mesmo cenario sem duplicar codigo.
 *
 * Nada aqui e contrato. Os poucos valores literais que aparecem (colunas de
 * grade, tamanho de fonte de legenda) pertencem a moldura da demonstracao e
 * NAO valem como precedente para CSS de componente. O que e contrato esta no
 * proprio `nph-icon` e nas fontes canonicas.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import { NPH_ICON_NAMES } from './nph-icon.icons';
import type { NphIconName } from './nph-icon.icons';

export interface CategoriaDoNucleo {
  readonly titulo: string;
  readonly icones: readonly NphIconName[];
}

/**
 * Indice de categorias do nucleo. Titulos e ordem vem de `icones_nucleo`, no
 * `design.md`. Este indice AGRUPA os nomes; ele nao os define — a fonte tecnica
 * continua sendo `NPH_ICON_NAMES`, e `nph-icon.demo.test.ts` exige que os dois
 * conjuntos sejam identicos.
 */
export const CATEGORIAS: readonly CategoriaDoNucleo[] = [
  { titulo: 'Navegação e menus', icones: ['bars'] },
  {
    titulo: 'Direção e revelação',
    icones: [
      'chevron-down',
      'chevron-up',
      'chevron-right',
      'chevron-left',
      'arrow-left',
      'arrow-right',
      'eye',
      'eye-slash',
      'ellipsis',
    ],
  },
  {
    titulo: 'Ação',
    icones: [
      'xmark',
      'check',
      'plus',
      'minus',
      'magnifying-glass',
      'ellipsis-vertical',
      'arrow-up-arrow-down',
      'grip-vertical',
      'pen-to-square',
      'trash-can',
      'arrow-up-from-bracket',
      'download',
      'gear',
      'filter',
      'filter-slash',
    ],
  },
  {
    titulo: 'Estado e comunicação',
    icones: [
      'circle-info',
      'triangle-exclamation',
      'circle-xmark',
      'circle-check',
      'circle-question',
      'star',
      'circle-notch',
    ],
  },
  { titulo: 'Conteúdo e dados', icones: ['calendar-days', 'user'] },
];

/**
 * Filtro puro da galeria. Recebe nomes do nucleo e devolve um SUBCONJUNTO
 * deles: por construcao, a busca nunca pode revelar icone fora dos aprovados.
 * Termo vazio ou so com espacos devolve tudo.
 */
export function filtrarNomes(
  nomes: readonly NphIconName[],
  termo: string,
): NphIconName[] {
  const procurado = termo.trim().toLowerCase();
  if (procurado === '') {
    return [...nomes];
  }
  return nomes.filter((nome) => nome.includes(procurado));
}

/** Total do nucleo, derivado do mapa fechado — nunca digitado a mao. */
export const TOTAL_DO_NUCLEO = NPH_ICON_NAMES.length;

export const pagina = `
  color: var(--nph-color-foreground);
  background: var(--nph-color-background);
  padding: var(--nph-space-container-padding);
  display: flex;
  flex-direction: column;
  gap: var(--nph-space-section);
`;

export const legenda = `
  color: var(--nph-color-muted-foreground);
  font-family: monospace;
  font-size: 12px;
`;

export const grade = `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: var(--nph-space-stack);
`;

export const celula = `
  display: flex;
  align-items: center;
  gap: var(--nph-space-inline-tight);
`;

export const campo = `
  color: var(--nph-color-foreground);
  background: var(--nph-color-background);
  border: 1px solid var(--nph-color-border);
  border-radius: var(--nph-radius-control);
  padding: var(--nph-space-control-padding);
  font: inherit;
  min-width: 18rem;
`;

export const botao = `
  color: var(--nph-color-foreground);
  background: var(--nph-color-card);
  border: 1px solid var(--nph-color-border);
  border-radius: var(--nph-radius-control);
  padding: var(--nph-space-control-padding);
  font: inherit;
  cursor: pointer;
`;

export const prosa = `
  display: flex;
  flex-direction: column;
  gap: var(--nph-space-stack-tight);
  max-width: 60rem;
`;

export const cartao = `
  background: var(--nph-color-card);
  color: var(--nph-color-card-foreground);
  border: 1px solid var(--nph-color-border);
  border-radius: var(--nph-radius-control);
  padding: var(--nph-space-container-padding);
  display: flex;
  flex-direction: column;
  gap: var(--nph-space-stack-tight);
`;

export const tabela = `
  border-collapse: collapse;
  text-align: left;
  width: 100%;
`;

export const celulaDeTabela = `
  border-bottom: 1px solid var(--nph-color-border);
  padding: var(--nph-space-inline-tight) var(--nph-space-inline);
  vertical-align: top;
`;

/** Bloco com titulo, usado nas duas paginas. */
export function secao(titulo: string, conteudo: TemplateResult): TemplateResult {
  return html`
    <section style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
      <h3 style="margin: 0; font-size: 14px;">${titulo}</h3>
      ${conteudo}
    </section>
  `;
}

/** Rodape de origem. Toda regra exibida aponta de onde veio. */
export function fonte(origem: string): TemplateResult {
  return html`<p style=${legenda}>Fonte: ${origem}</p>`;
}
