/**
 * Frame shared by the `nph-icon` stories.
 *
 * This file is NOT a story: the name does not end in `.stories.ts`, so the
 * Storybook glob does not index it. It exists so that the documentation page
 * and the validation page use the same scenario without duplicating code.
 *
 * Nothing here is contract. The few literal values that appear (grid
 * columns, search field width) belong to the demonstration frame and
 * are NOT a precedent for component CSS. What is contract lives in
 * `nph-icon` itself and in the canonical sources.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import { textRole } from '../../shared/docs/page';
import { NPH_ICON_NAMES } from './nph-icon.icons';
import type { NphIconName } from './nph-icon.icons';

/**
 * A group of the core. The TITLE does not live here: the title is showcase text
 * and comes from the language dictionary, in `.storybook/i18n/`. The order of
 * the groups below is that of `design.md` and matches, position by position,
 * `categories` in the dictionary.
 */
export type CoreCategory = readonly NphIconName[];

/**
 * Category index of the core. The order comes from `icones_nucleo`, in
 * `design.md`. This index GROUPS the names; it does not define them — the
 * technical source remains `NPH_ICON_NAMES`, and `nph-icon.demo.test.ts`
 * requires the two sets to be identical.
 */
export const CATEGORIES: readonly CoreCategory[] = [
  /* `navegacao_e_menus` */
  ['bars', 'house'],
  /* `direcao_e_revelacao` */
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
  /* `acao` */
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
  /* `estado_e_comunicacao` */
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
  /* `conteudo_e_dados` */
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
 * Pure gallery filter. Takes core names and returns a SUBSET of them: by
 * construction, the search can never reveal an icon outside the approved ones.
 * An empty term or one with only spaces returns everything.
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

/** Core total, derived from the closed map — never typed by hand. */
export const CORE_TOTAL = NPH_ICON_NAMES.length;

/*
 * Frame of the `nph-icon` pages. The header, sections, demonstration and notes
 * come from `src/shared/docs/page.ts`, the same as on the Documentation page;
 * only what is specific to these pages stays here: the specimen with caption,
 * the search and the catalog grid.
 */

const BORDER = 'var(--nph-border-width) solid var(--nph-color-border)';

/** Demonstration specimen: the real instance on top, the technical caption below. */
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

/** Label, field and button of the catalog search. */
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

/** Search counter, as a caption. */
export const counter = `
  margin: 0;
  ${textRole('caption')}
  color: var(--nph-color-muted-foreground);
`;

/** Catalog grid: cards of equal width, as many as fit in the row. */
export const grid = `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: var(--nph-space-stack);
`;

/** Card of one icon in the catalog: the icon centered and the name below. */
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
