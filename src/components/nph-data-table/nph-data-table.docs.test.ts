/**
 * Contract of the `nph-data-table` Documentation page and of its Validation stories: index with
 * no orphan anchor in all three languages, no leftover placeholder, the Usage section with the
 * tag and the import line of the package, the labelled matrix with the four states, the
 * three mandatory examples in light and dark mode, every table drawn with its text from the
 * dictionary, the `dataTableDocs` and `dataTableValidation` dictionaries with the same shape in
 * pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of another language on the
 * English page, the two "When to use" lists equal to the ones of the sheet, and every property,
 * slot and event of the sheet named on the page. The page reads the lists from the Metadata
 * (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import pkg from '../../../package.json';
import metadata from '../../shared/metadata/nph-data-table.json';
import { Documentation } from './nph-data-table.docs.stories';
import * as validation from './nph-data-table.stories';
import type { NphDataTable } from './nph-data-table';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
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

async function ready(target: HTMLElement): Promise<NphDataTable[]> {
  const tables = [...target.querySelectorAll<NphDataTable>('nph-data-table')];
  const pieces = [...target.querySelectorAll('*')].filter(
    (element): element is Element & { updateComplete: Promise<unknown> } => 'updateComplete' in element,
  );
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  return tables;
}

/** The texts the tables and their bars receive, and the ones their rows carry. */
function textsOf(target: HTMLElement): string[] {
  const names = [
    'caption',
    'description',
    'label',
    'no-value-label',
    'empty-heading',
    'empty-description',
    'clear-label',
    'select-all-label',
    'select-label',
    'selected-text',
    'actions-label',
    'switch-header',
    'switch-label',
    'pagination-label',
    'page-label',
    'first-label',
    'previous-label',
    'next-label',
    'last-label',
    'position-text',
    'page-size-label',
    'text',
    'placeholder',
  ];
  const tables = [...target.querySelectorAll<NphDataTable>('nph-data-table')];
  const attributes = [...target.querySelectorAll('nph-data-table, nph-data-table *')].flatMap((element) =>
    names.map((name) => element.getAttribute(name) ?? '').filter((value) => value !== ''),
  );
  const data = tables.flatMap((table) => [
    ...table.columns.map((column) => column.header),
    ...table.rows.map((row) => row.name ?? ''),
    ...table.actions.flatMap((entry) => ('text' in entry ? [entry.text] : [])),
  ]);
  return [...attributes, ...data].filter((value) => value !== '');
}

describe('nph-data-table Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('main nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...new Set(links)].sort());
    });

    it(`${locale}: every section has a title, and the page is nph-data-table`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-data-table');
    });

    it(`${locale}: every section ends with its source, except References`, () => {
      const target = renderInLocale(locale);
      for (const section of target.querySelectorAll('section[id]')) {
        if (section.id === 'references') continue;
        const last = section.lastElementChild;
        expect(last?.tagName, section.id).toBe('P');
        expect(last?.textContent?.trim().startsWith(translations(locale).dataTableDocs.sourceLabel), section.id).toBe(true);
      }
    });

    it(`${locale}: no {name} placeholder is left on the page`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      expect(target.textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: Usage shows the tag and the import line of the package`, () => {
      const target = renderInLocale(locale);
      const terms = [...target.querySelectorAll('section#usage tbody th')].map((th) => th.textContent?.trim());
      expect(terms).toEqual([
        translations(locale).dataTableDocs.usageMarkup,
        `import '${pkg.name}/nph-data-table';`,
        `import '${pkg.name}/nph-toolbar';`,
      ]);
    });

    it(`${locale}: every table draws, with its text from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const tables = await ready(target);
      const allowed = new Set(leaves(translations(locale).dataTableDocs));
      expect(tables.length).toBeGreaterThan(0);
      for (const table of tables) {
        expect(table.hasAttribute('data-nph-rendered'), table.outerHTML.slice(0, 160)).toBe(true);
      }
      for (const value of textsOf(target)) {
        expect(allowed.has(value), value).toBe(true);
      }
    });

    it(`${locale}: the matrix shows the four states`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const tables = [...matrix.querySelectorAll<NphDataTable>('nph-data-table')];
      expect(tables).toHaveLength(4);
      expect(tables.map((table) => table.selected.length > 0)).toEqual([false, true, false, false]);
      expect(tables.map((table) => table.rows.length === 0)).toEqual([false, false, true, false]);
      expect(tables.map((table) => table.loading)).toEqual([false, false, false, true]);
    });

    it(`${locale}: the three mandatory examples, each in light and dark mode`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#mandatory-examples') as HTMLElement;
      const figures = [...examples.querySelectorAll<HTMLElement>('figure[data-nph-color-scheme]')];
      expect(figures.map((figure) => figure.getAttribute('data-nph-color-scheme'))).toEqual(['light', 'dark', 'light', 'dark', 'light', 'dark']);
      const [list, , selected, , empty] = figures.map((figure) => figure.querySelector<NphDataTable>('nph-data-table'));
      expect([list?.sortKey, list?.sortDirection]).toEqual(['person', 'ascending']);
      expect(list?.querySelector('nph-toolbar[slot="toolbar"] nph-input')?.getAttribute('label')).toBe(translations(locale).dataTableDocs.search);
      expect(selected?.selected).toHaveLength(2);
      expect(empty?.rows).toHaveLength(0);
      expect(empty?.clearLabel).toBe(translations(locale).dataTableDocs.clearFilter);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['dataTableDocs', 'dataTableValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', async () => {
    const target = renderInLocale('en');
    await ready(target);
    const rendered = target.textContent ?? '';
    const english = leaves(translations('en').dataTableDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).dataTableDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('the two "When to use" lists are the ones of the sheet', () => {
    expect(translations('en').dataTableDocs.whenToUse).toEqual(metadata.use_when);
    expect(translations('en').dataTableDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).dataTableDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).dataTableDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the API of the page names every property, slot and event of the sheet', () => {
    for (const locale of LOCALES) {
      const terms = (translations(locale).dataTableDocs.api as Array<[string, string]>).map(([name]) => name);
      expect(terms, locale).toEqual(Object.keys(metadata.api));
    }
  });

  it('the Validation text of every language is the shared text of the page', () => {
    for (const locale of LOCALES) {
      const { dataTableDocs, dataTableValidation } = translations(locale);
      for (const [key, value] of Object.entries(dataTableValidation)) {
        expect((dataTableDocs as Record<string, unknown>)[key], `${locale} ${key}`).toEqual(value);
      }
    }
  });
});

describe('nph-data-table Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `InvalidInput` is `invalid-input`. */
  const idOf = (name: string): string =>
    `components-nph-data-table-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the eight pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Appearance', 'Brands', 'Examples', 'Footer', 'Header', 'InvalidInput', 'Matrix', 'Rows']);
  });

  for (const [name, story] of stories) {
    it(`${name}: the title, the claim and the sidebar label are in the dictionary, in every language`, () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      for (const locale of LOCALES) {
        const id = idOf(name);
        const label = sidebarLabel(id, locale);
        const claim = translations(locale).validationPages.claims[id];
        expect(label, `${locale} sidebar ${id}`).toBeTruthy();
        expect(claim, `${locale} claim ${id}`).toBeTruthy();
        const target = draw(story, locale);
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-data-table · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text the tables receive comes from the dictionary, in light and in dark mode`, async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        await ready(target);
        const allowed = new Set(leaves(translations(locale).dataTableValidation));
        for (const value of textsOf(target)) {
          expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
        }
        /* The shape of the brand frames is proved in src/shared/tokens/brand-validation.test.ts. */
        if (name !== 'Brands') {
          const schemes = [...target.querySelectorAll('figure[data-nph-color-scheme]')].map((figure) => figure.getAttribute('data-nph-color-scheme'));
          expect(schemes.filter((scheme) => scheme === 'light').length).toBeGreaterThan(0);
          expect(schemes.filter((scheme) => scheme === 'light')).toHaveLength(schemes.filter((scheme) => scheme === 'dark').length);
        }
        target.remove();
      }
    });
  }

  it('only the Brands story carries data-nph-brand', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    for (const [name, story] of stories) {
      const target = draw(story, 'en');
      if (name === 'Brands') {
        expect(target.querySelectorAll('[data-nph-brand]'), name).toHaveLength(14);
      } else {
        expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      }
      target.remove();
    }
  });

  it('Matrix draws the four states in the two sizes, every table valid', async () => {
    const target = draw(validation.Matrix as unknown as Renderable, 'en');
    const tables = await ready(target);
    /* Four states per size, two sizes, two modes. */
    expect(tables).toHaveLength(16);
    for (const table of tables) {
      expect(table.hasAttribute('data-nph-rendered'), table.outerHTML.slice(0, 160)).toBe(true);
    }
    expect(new Set(tables.map((table) => `${table.size} ${table.loading} ${table.selected.length > 0} ${table.rows.length === 0}`)).size).toBe(8);
  });

  it('Header draws no sort, ascending and descending', async () => {
    const target = draw(validation.Header as unknown as Renderable, 'en');
    const tables = (await ready(target)).slice(0, 3);
    expect(tables.map((table) => table.shadowRoot?.querySelector('th[aria-sort]')?.getAttribute('aria-sort') ?? 'none')).toEqual([
      'none',
      'ascending',
      'descending',
    ]);
  });

  it('Footer draws the three layouts and no footer with a single page', async () => {
    const target = draw(validation.Footer as unknown as Renderable, 'en');
    const tables = (await ready(target)).slice(0, 4);
    expect(tables.map((table) => table.shadowRoot?.querySelector('nph-pagination')?.getAttribute('type') ?? 'none')).toEqual([
      'table',
      'range',
      'range',
      'none',
    ]);
    expect(tables[1]?.shadowRoot?.querySelector('.pagination > nph-select')).not.toBeNull();
    expect(tables[2]?.shadowRoot?.querySelector('.pagination > nph-select')).toBeNull();
  });

  it('InvalidInput draws nothing without columns and leaves out only the part of each other cause', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const target = draw(validation.InvalidInput as unknown as Renderable, 'en');
    const tables = (await ready(target)).slice(0, 4);
    expect(tables.map((table) => table.hasAttribute('data-nph-rendered'))).toEqual([false, true, true, true]);
    expect(tables[1]?.shadowRoot?.querySelector('th[aria-sort]')).toBeNull();
    expect(tables[2]?.shadowRoot?.querySelector('nph-checkbox')).toBeNull();
    expect(tables[3]?.shadowRoot?.querySelector('.pagination')).toBeNull();
  });
});
