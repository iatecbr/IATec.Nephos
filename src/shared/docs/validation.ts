/**
 * Top of a VALIDATION page: what the page proves, in the chosen language.
 *
 * The title is the piece name and the story's sidebar label. The text below it
 * is the claim the story already states in its one-line JSDoc (`docs/stories.md`,
 * §4.4), translated in `validationPages.claims` under the story ID. A piece
 * with no reading page also points to its sheet, where the contract lives
 * (§4.1: no reading page is invented for it).
 *
 * The scenery is not a precedent for component CSS.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import { DEFAULT_LOCALE, LOCALE_GLOBAL, format, sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import { body, header, note } from './page';

export interface GlobalsContext {
  globals?: Record<string, unknown>;
}

export function localeOf(context: GlobalsContext | undefined): string {
  return (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
}

/** The page title: piece name and story label, as in the sidebar. */
export function validationTitle(context: GlobalsContext | undefined, piece: string, storyId: string): string {
  return `${piece} · ${sidebarLabel(storyId, localeOf(context)) ?? storyId}`;
}

export interface ValidationPage {
  /** Piece name, such as `nph-kbd`. */
  piece: string;
  /** ID of the story, the key of its claim in the dictionary. */
  storyId: string;
  /** The piece has no Docs page: point to `fichas/<piece>.md`. */
  sheet?: boolean;
}

export function validationPage(
  context: GlobalsContext | undefined,
  { piece, storyId, sheet = false }: ValidationPage,
  content: TemplateResult,
): TemplateResult {
  const v = translations(localeOf(context)).validationPages;
  return html`
    <main style=${body}>
      ${header(validationTitle(context, piece, storyId), v.claims[storyId] ?? '')}
      ${sheet ? note('info', v.sheetTitle, format(v.sheetText, { sheet: `fichas/${piece}.md` })) : ''}
      ${content}
    </main>
  `;
}
