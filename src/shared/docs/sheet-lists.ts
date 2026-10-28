/**
 * The "use" and "do not use" lists of a component `Docs` page (P71; DSA-34, D1).
 *
 * The lists are `use_when` and `do_not_use_when` of `src/shared/metadata/<piece>.json`, the
 * generated copy of the sheet (P63). The sheet and the Metadata are English only (DSA-14): in the
 * source language the page shows the Metadata as it is. In `pt-BR` and `es` it shows the
 * translation of each item, which the language dictionary keeps in `whenToUse` and
 * `whenNotToUse` of the page's key, at the position of the item in the Metadata. `en.json` keeps
 * the same two lists, so that the three dictionaries have the same shape.
 *
 * The number of items always comes from the Metadata. An item without a translation shows the
 * English item, so the page never goes blank; `sheet-lists.test.ts` fails it, and fails the page
 * whose lists differ from the Metadata.
 */
import type { TemplateResult } from 'lit';

import { DEFAULT_LOCALE } from '../../../.storybook/i18n/index.js';
import { useDontUse } from './page';

/** The two lists of the Metadata of a sheet. */
export interface SheetLists {
  readonly use_when: readonly string[];
  readonly do_not_use_when: readonly string[];
}

/** The part of a `Docs` dictionary entry that this block reads. */
export interface ListsDictionary {
  readonly whenToUseTitle: string;
  readonly whenNotToUseTitle: string;
  readonly whenToUse: readonly string[];
  readonly whenNotToUse: readonly string[];
}

/** The lists a page shows in `locale`: the Metadata in English, its translation otherwise. */
export function listsOf(
  metadata: SheetLists,
  locale: string,
  dictionary: ListsDictionary,
): { use: readonly string[]; dontUse: readonly string[] } {
  if (locale === DEFAULT_LOCALE) return { use: metadata.use_when, dontUse: metadata.do_not_use_when };
  const translate = (items: readonly string[], translated: readonly string[]) =>
    items.map((item, position) => translated[position] || item);
  return {
    use: translate(metadata.use_when, dictionary.whenToUse),
    dontUse: translate(metadata.do_not_use_when, dictionary.whenNotToUse),
  };
}

/** The `useDontUse` block of a `Docs` page, read from the Metadata of its sheet. */
export function sheetUseDontUse(metadata: SheetLists, locale: string, dictionary: ListsDictionary): TemplateResult {
  const { use, dontUse } = listsOf(metadata, locale, dictionary);
  return useDontUse(
    { title: dictionary.whenToUseTitle, items: use },
    { title: dictionary.whenNotToUseTitle, items: dontUse },
  );
}
