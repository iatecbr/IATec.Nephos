/**
 * The "use" and "do not use" lists of every component `Docs` page are the Metadata of its sheet
 * (P71; DSA-34, D1). The test fails:
 * - a page whose lists differ from `use_when` and `do_not_use_when` of
 *   `src/shared/metadata/<piece>.json`, in any of the three languages;
 * - an item of the Metadata without a translation in `pt-BR` or `es`;
 * - a dictionary list whose number of items differs from the Metadata.
 *
 * The pages are found by file name, so a new `Docs` page is covered without being listed here.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import { LOCALES, translations } from '../../../.storybook/i18n/index.js';
import { listsOf } from './sheet-lists';
import type { ListsDictionary, SheetLists } from './sheet-lists';

afterEach(() => {
  document.body.replaceChildren();
});

type Page = { Documentation: { render?: (args: unknown, context: unknown) => TemplateResult } };

const pages = import.meta.glob<Page>('../../components/*/*.docs.stories.ts', { eager: true });
const sheets = import.meta.glob<SheetLists>('../metadata/*.json', { eager: true, import: 'default' });

/** `nph-icon` was the first page and kept the key `docs`; the others follow `<piece>Docs`. */
const DICTIONARY_KEYS: Record<string, string> = { 'nph-icon': 'docs' };

function dictionaryKey(piece: string): string {
  const camel = piece.replace(/^nph-/, '').replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
  return DICTIONARY_KEYS[piece] ?? `${camel}Docs`;
}

function dictionaryOf(piece: string, locale: string): ListsDictionary {
  return translations(locale)[dictionaryKey(piece)] as ListsDictionary;
}

/** The two lists the page shows in its "When to use" section, as the person reads them. */
function shownLists(page: Page, locale: string): { use: string[]; dontUse: string[] } {
  const target = document.createElement('div');
  document.body.append(target);
  render(page.Documentation.render?.({}, { globals: { locale } }) as TemplateResult, target);
  const items = (kind: string) =>
    [...target.querySelectorAll(`section#when-to-use [data-nph-card="${kind}"] li > span:last-child`)].map(
      (item) => item.textContent?.trim() ?? '',
    );
  return { use: items('success'), dontUse: items('error') };
}

const pieces = Object.entries(pages).map(([path, page]) => ({
  piece: path.split('/').at(-2) as string,
  page,
}));

describe('Docs pages: the lists of the page are the lists of the sheet', () => {
  it('finds the Docs pages', () => {
    expect(pieces.length).toBeGreaterThan(0);
  });

  for (const { piece, page } of pieces) {
    const metadata = sheets[`../metadata/${piece}.json`];

    it(`${piece}: the sheet has Metadata with both lists`, () => {
      expect(metadata, `src/shared/metadata/${piece}.json`).toBeDefined();
      expect(metadata?.use_when.length).toBeGreaterThan(0);
      expect(metadata?.do_not_use_when.length).toBeGreaterThan(0);
    });

    if (metadata === undefined) continue;

    it(`${piece}: the English dictionary keeps the Metadata lists, item by item`, () => {
      const dictionary = dictionaryOf(piece, 'en');
      expect(dictionary.whenToUse).toEqual(metadata.use_when);
      expect(dictionary.whenNotToUse).toEqual(metadata.do_not_use_when);
    });

    for (const locale of ['pt-BR', 'es']) {
      it(`${piece}: every item of the Metadata has a translation in ${locale}`, () => {
        const dictionary = dictionaryOf(piece, locale);
        expect(dictionary.whenToUse).toHaveLength(metadata.use_when.length);
        expect(dictionary.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
        for (const item of [...dictionary.whenToUse, ...dictionary.whenNotToUse]) {
          expect(typeof item === 'string' && item.trim() !== '', `${locale}: ${String(item)}`).toBe(true);
        }
      });
    }

    for (const { value: locale } of LOCALES) {
      it(`${piece}: in ${locale}, the page shows the lists of the Metadata`, () => {
        const shown = shownLists(page, locale);
        const expected = listsOf(metadata, locale, dictionaryOf(piece, locale));
        expect(shown.use).toHaveLength(metadata.use_when.length);
        expect(shown.dontUse).toHaveLength(metadata.do_not_use_when.length);
        expect(shown.use).toEqual(expected.use);
        expect(shown.dontUse).toEqual(expected.dontUse);
        if (locale === 'en') {
          expect(shown.use).toEqual(metadata.use_when);
          expect(shown.dontUse).toEqual(metadata.do_not_use_when);
        }
      });
    }
  }
});

describe('listsOf', () => {
  const metadata: SheetLists = { use_when: ['use one', 'use two'], do_not_use_when: ['avoid one'] };
  const dictionary = (whenToUse: string[], whenNotToUse: string[]): ListsDictionary => ({
    whenToUseTitle: 'Use',
    whenNotToUseTitle: 'Avoid',
    whenToUse,
    whenNotToUse,
  });

  it('in English, it reads the Metadata, not the dictionary', () => {
    expect(listsOf(metadata, 'en', dictionary(['stale'], []))).toEqual({
      use: ['use one', 'use two'],
      dontUse: ['avoid one'],
    });
  });

  it('in another language, it shows the translation at the position of each item', () => {
    expect(listsOf(metadata, 'pt-BR', dictionary(['translated use one', 'translated use two'], ['translated avoid one']))).toEqual({
      use: ['translated use one', 'translated use two'],
      dontUse: ['translated avoid one'],
    });
  });

  it('the number of items comes from the Metadata: a missing translation shows the English item, an extra one is not shown', () => {
    expect(listsOf(metadata, 'es', dictionary(['translated use one'], ['translated avoid one', 'extra']))).toEqual({
      use: ['translated use one', 'use two'],
      dontUse: ['translated avoid one'],
    });
  });
});
