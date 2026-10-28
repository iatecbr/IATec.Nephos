/**
 * Contract of the `nph-pagination` Documentation page and of its Validation stories: index
 * with no orphan anchor in all three languages, no leftover placeholder outside the piece, the
 * `type` × position matrix, the three required examples in light and dark mode, the sections
 * of the page with their pieces, the `paginationDocs` and `paginationValidation` dictionaries
 * with the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of
 * another language on the English page, the two "When to use" lists equal to the ones of the
 * sheet, and every property and event of the sheet named on the page. The page reads the lists
 * from the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-pagination.json';
import { Documentation } from './nph-pagination.docs.stories';
import * as validation from './nph-pagination.stories';
import type { NphPagination } from './nph-pagination';

afterEach(() => {
  document.body.replaceChildren();
});

const LOCALES = ['pt-BR', 'en', 'es'] as const;

type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };

function draw(story: Renderable, locale: string): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
  return target;
}

const renderInLocale = (locale: string): HTMLElement => draw(Documentation as unknown as Renderable, locale);

/** The shape of a value: object keys and list length, without the text. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]));
  }
  return typeof value;
}

/** Every string of a value, in order. */
function leaves(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(leaves);
  if (value !== null && typeof value === 'object') return Object.values(value).flatMap(leaves);
  return [];
}

/** `value` appears in `text` as a whole run of text, not inside a longer word. */
function containsWhole(text: string, value: string): boolean {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, 'u').test(text);
}

async function ready(target: HTMLElement): Promise<NphPagination[]> {
  const bars = [...target.querySelectorAll<NphPagination>('nph-pagination')];
  await Promise.all(bars.map((bar) => bar.updateComplete));
  return bars;
}

/** The text a bar receives: its names, balloons, labels and position template. */
function textOf(bar: NphPagination): string[] {
  return [
    bar.label,
    bar.pageLabel,
    bar.firstLabel,
    bar.previousLabel,
    bar.nextLabel,
    bar.lastLabel,
    bar.positionText,
    bar.pageSizeLabel,
    bar.goToLabel,
  ].filter((value) => value !== '');
}

describe('nph-pagination Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('main > nav a, main nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...new Set(links)].sort());
    });

    it(`${locale}: every section has a title, and the page is nph-pagination`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-pagination');
    });

    /* The Usage markup writes page-label with its {page} marker, as the consumer does: it is code, not a leftover. */
    it(`${locale}: no {name} placeholder is left on the page`, () => {
      const target = renderInLocale(locale);
      target.querySelector('section#usage tbody tr:first-child th')?.remove();
      expect(target.textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every bar draws, with its text from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const bars = await ready(target);
      const allowed = new Set(leaves(translations(locale).paginationDocs));
      expect(bars.length).toBeGreaterThan(0);
      for (const bar of bars) {
        expect(bar.hasAttribute('data-nph-rendered'), bar.outerHTML).toBe(true);
        for (const value of textOf(bar)) {
          expect(allowed.has(value), value).toBe(true);
        }
      }
    });

    it(`${locale}: the matrix crosses the six types with the start, the middle and the end`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const bars = [...matrix.querySelectorAll<NphPagination>('nph-pagination')];
      expect(bars).toHaveLength(18);
      expect(new Set(bars.map((bar) => bar.type))).toEqual(new Set(['numbered', 'simple', 'edges', 'range', 'compact', 'table']));
      expect(bars.map((bar) => bar.page).sort((a, b) => a - b)).toEqual([...Array(6).fill(1), ...Array(6).fill(5), ...Array(6).fill(10)]);
    });

    it(`${locale}: the three required examples, each in light and dark mode`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#required-examples') as HTMLElement;
      const figures = [...examples.querySelectorAll<HTMLElement>('figure[data-nph-color-scheme]')];
      expect(figures.map((figure) => figure.getAttribute('data-nph-color-scheme'))).toEqual(['light', 'dark', 'light', 'dark', 'light', 'dark']);
      const [tableFigure, , searchFigure, , cardFigure] = figures;
      const tableBar = tableFigure?.querySelector<NphPagination>('nph-pagination');
      expect(tableFigure?.querySelector('nph-table')).not.toBeNull();
      expect([tableBar?.type, tableBar?.page]).toEqual(['table', 5]);
      const searchBar = searchFigure?.querySelector<NphPagination>('nph-pagination');
      expect([searchBar?.type, searchBar?.page]).toEqual(['numbered', 1]);
      const cardBar = cardFigure?.querySelector<NphPagination>('nph-pagination');
      expect([cardBar?.type, cardBar?.page]).toEqual(['compact', 10]);
    });

    it(`${locale}: the fields section shows items per page and go to page`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const bars = [...target.querySelectorAll<NphPagination>('section#items-per-page-and-go-to-page nph-pagination')];
      expect(bars.map((bar) => [bar.type, bar.goToPage])).toEqual([
        ['table', false],
        ['edges', true],
      ]);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['paginationDocs', 'paginationValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('the position templates carry the same markers in every language', () => {
    const markers = (value: string) => [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
    const source = translations('en').paginationDocs.labels as Record<string, string>;
    for (const locale of ['pt-BR', 'es'] as const) {
      const labels = translations(locale).paginationDocs.labels as Record<string, string>;
      for (const [key, value] of Object.entries(source)) {
        expect(markers(labels[key] ?? ''), `${locale} ${key}`).toEqual(markers(value));
      }
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').paginationDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).paginationDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('the two "When to use" lists are the ones of the sheet', () => {
    expect(translations('en').paginationDocs.whenToUse).toEqual(metadata.use_when);
    expect(translations('en').paginationDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).paginationDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).paginationDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the API of the page names every property and event of the sheet', () => {
    const terms = (translations('en').paginationDocs.api as Array<[string, string]>).flatMap(([names]) =>
      names.split(',').map((name) => name.trim()),
    );
    for (const property of Object.keys(metadata.api)) {
      expect(terms, property).toContain(property);
    }
  });
});

describe('nph-pagination Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `GoToPage` is `go-to-page`. */
  const idOf = (name: string): string =>
    `components-nph-pagination-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the four pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Examples', 'GoToPage', 'InvalidInput', 'Matrix']);
  });

  for (const [name, story] of stories) {
    it(`${name}: the title, the claim and the sidebar label are in the dictionary, in every language`, () => {
      for (const locale of LOCALES) {
        const id = idOf(name);
        const label = sidebarLabel(id, locale);
        const claim = translations(locale).validationPages.claims[id];
        expect(label, `${locale} sidebar ${id}`).toBeTruthy();
        expect(claim, `${locale} claim ${id}`).toBeTruthy();
        const target = draw(story, locale);
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-pagination · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text the bars receive comes from the dictionary, in light and in dark mode`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(leaves(translations(locale).paginationValidation));
        for (const bar of await ready(target)) {
          for (const value of textOf(bar)) {
            expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
          }
        }
        const schemes = [...target.querySelectorAll('figure[data-nph-color-scheme]')].map((figure) => figure.getAttribute('data-nph-color-scheme'));
        expect(schemes.filter((scheme) => scheme === 'light').length).toBeGreaterThan(0);
        expect(schemes.filter((scheme) => scheme === 'light')).toHaveLength(schemes.filter((scheme) => scheme === 'dark').length);
        target.remove();
      }
    });
  }

  it('Matrix draws every type at the start, in the middle and at the end, in both modes', async () => {
    const target = draw(validation.Matrix as unknown as Renderable, 'en');
    const bars = await ready(target);
    expect(bars).toHaveLength(36);
    for (const bar of bars) {
      expect(bar.hasAttribute('data-nph-rendered'), bar.outerHTML).toBe(true);
    }
  });

  it('InvalidInput draws nothing in each of its cells', async () => {
    const target = draw(validation.InvalidInput as unknown as Renderable, 'en');
    const bars = await ready(target);
    expect(bars.length).toBe(8);
    for (const bar of bars) {
      expect(bar.hasAttribute('data-nph-rendered'), bar.outerHTML).toBe(false);
    }
  });
});
