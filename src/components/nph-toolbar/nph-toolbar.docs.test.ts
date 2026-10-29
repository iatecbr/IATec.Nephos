/**
 * Contract of the `nph-toolbar` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, the Usage section with the tag
 * and the import line of the package, the labelled matrix with the five types, the three
 * mandatory examples in light and dark mode, every bar drawn with its text from the dictionary,
 * the `toolbarDocs` and `toolbarValidation` dictionaries with the same shape in pt-BR, en and es
 * (`test:i18n` only reads `.md` pairs), no text of another language on the English page, the two
 * "When to use" lists equal to the ones of the sheet, and every property and slot of the sheet
 * named on the page. The page reads the lists from the Metadata (P71), and
 * `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import pkg from '../../../package.json';
import metadata from '../../shared/metadata/nph-toolbar.json';
import { Documentation } from './nph-toolbar.docs.stories';
import * as validation from './nph-toolbar.stories';
import type { NphToolbar } from './nph-toolbar';

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

async function ready(target: HTMLElement): Promise<NphToolbar[]> {
  const bars = [...target.querySelectorAll<NphToolbar>('nph-toolbar')];
  const pieces = [...target.querySelectorAll('*')].filter(
    (element): element is Element & { updateComplete: Promise<unknown> } => 'updateComplete' in element,
  );
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  return bars;
}

/** The text attributes the bars and their pieces receive. */
function textsOf(target: HTMLElement): string[] {
  const names = ['label', 'count-text', 'removed-text', 'cleared-text', 'text', 'placeholder', 'remove-label'];
  return [...target.querySelectorAll('nph-toolbar, nph-toolbar *')].flatMap((element) =>
    names.map((name) => element.getAttribute(name) ?? '').filter((value) => value !== ''),
  );
}

describe('nph-toolbar Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('main nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...new Set(links)].sort());
    });

    it(`${locale}: every section has a title, and the page is nph-toolbar`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-toolbar');
    });

    it(`${locale}: every section ends with its source, except References`, () => {
      const target = renderInLocale(locale);
      for (const section of target.querySelectorAll('section[id]')) {
        if (section.id === 'references') continue;
        const last = section.lastElementChild;
        expect(last?.tagName, section.id).toBe('P');
        expect(last?.textContent?.trim().startsWith(translations(locale).toolbarDocs.sourceLabel), section.id).toBe(true);
      }
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: Usage shows the tag and the import line of the package`, () => {
      const target = renderInLocale(locale);
      const terms = [...target.querySelectorAll('section#usage tbody th')].map((th) => th.textContent?.trim());
      expect(terms).toEqual([
        translations(locale).toolbarDocs.usageMarkup,
        `import '${pkg.name}/nph-toolbar';`,
        `import '${pkg.name}/nph-button';`,
      ]);
    });

    it(`${locale}: every bar draws, with its text from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const bars = await ready(target);
      const allowed = new Set(leaves(translations(locale).toolbarDocs));
      expect(bars.length).toBeGreaterThan(0);
      for (const bar of bars) {
        expect(bar.hasAttribute('data-nph-rendered'), bar.outerHTML.slice(0, 160)).toBe(true);
      }
      for (const value of textsOf(target)) {
        expect(allowed.has(value), value).toBe(true);
      }
    });

    it(`${locale}: the matrix shows the five types, the strip below the page bar`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const types = [...matrix.querySelectorAll<NphToolbar>('nph-toolbar')].map((bar) => bar.type);
      expect(types).toEqual(['bulk', 'page', 'tools', 'floating', 'page', 'applied-filters']);
    });

    it(`${locale}: the three mandatory examples, each in light and dark mode`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#mandatory-examples') as HTMLElement;
      const figures = [...examples.querySelectorAll<HTMLElement>('figure[data-nph-color-scheme]')];
      expect(figures.map((figure) => figure.getAttribute('data-nph-color-scheme'))).toEqual(['light', 'dark', 'light', 'dark', 'light', 'dark']);
      const [table, , listTop, , editor] = figures.map((figure) => figure.querySelector<NphToolbar>('nph-toolbar'));
      expect(table?.type).toBe('bulk');
      expect(table?.countText).toBe(translations(locale).toolbarDocs.countExample);
      expect(table?.querySelector('[slot="checkbox"]')).toBeNull();
      expect(listTop?.type).toBe('page');
      expect(listTop?.querySelector('nph-toggle-group[slot="center"]')).not.toBeNull();
      expect(editor?.type).toBe('tools');
      const end = [...(editor?.querySelectorAll('[slot="end"]') ?? [])].map((piece) => piece.localName);
      expect(end).toEqual(['nph-button', 'nph-separator', 'nph-button']);
      expect(editor?.querySelector('[slot="end"]:last-child')?.getAttribute('icon-start')).toBe('ellipsis');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['toolbarDocs', 'toolbarValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').toolbarDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).toolbarDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('the two "When to use" lists are the ones of the sheet', () => {
    expect(translations('en').toolbarDocs.whenToUse).toEqual(metadata.use_when);
    expect(translations('en').toolbarDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).toolbarDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).toolbarDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the API of the page names every property and slot of the sheet', () => {
    const terms = (translations('en').toolbarDocs.api as Array<[string, string]>).map(([name]) => name);
    expect(terms).toEqual(Object.keys(metadata.api));
  });

  it('the Validation text of every language is the shared text of the page', () => {
    for (const locale of LOCALES) {
      const { toolbarDocs, toolbarValidation } = translations(locale);
      for (const [key, value] of Object.entries(toolbarValidation)) {
        expect((toolbarDocs as Record<string, unknown>)[key], `${locale} ${key}`).toEqual(value);
      }
    }
  });
});

describe('nph-toolbar Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `PieceStates` is `piece-states`. */
  const idOf = (name: string): string =>
    `components-nph-toolbar-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the seven pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(
      ['AppliedFilters', 'Brands', 'Examples', 'InvalidInput', 'Matrix', 'Options', 'PieceStates'],
    );
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-toolbar · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text the bars receive comes from the dictionary, in light and in dark mode`, async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        await ready(target);
        const allowed = new Set(leaves(translations(locale).toolbarValidation));
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

  it('Matrix draws the five types in the three sizes, every bar valid and every piece in the size of its bar', async () => {
    const target = draw(validation.Matrix as unknown as Renderable, 'en');
    const bars = await ready(target);
    /* Five rows, the last one a page bar with its strip: six bars per size, in two modes. */
    expect(bars).toHaveLength(36);
    for (const bar of bars) {
      expect(bar.hasAttribute('data-nph-rendered'), bar.outerHTML.slice(0, 160)).toBe(true);
      for (const piece of bar.querySelectorAll(':scope > nph-button, :scope > nph-input, :scope > nph-toggle-group')) {
        expect(piece.getAttribute('size')).toBe(bar.size);
      }
    }
    expect(new Set(bars.map((bar) => `${bar.type} ${bar.size}`)).size).toBe(15);
  });

  it('Options turns off the checkbox, turns on the center and draws clear as an icon only', async () => {
    const target = draw(validation.Options as unknown as Renderable, 'en');
    const bars = (await ready(target)).slice(0, 6);
    expect(bars.map((bar) => bar.querySelector('[slot="checkbox"]') !== null)).toEqual([true, false, true, true, false, false]);
    expect(bars.map((bar) => bar.querySelector('[slot="center"]') !== null)).toEqual([false, false, true, false, true, false]);
    expect(bars[3]?.querySelector('nph-button:not([slot])')?.getAttribute('label')).toBe(translations('en').toolbarValidation.clearSelection);
  });

  it('PieceStates draws the main action disabled and loading', async () => {
    const target = draw(validation.PieceStates as unknown as Renderable, 'en');
    const bars = (await ready(target)).slice(0, 3);
    const create = (bar: NphToolbar | undefined) => bar?.querySelector('nph-button[icon-start="plus"]');
    expect(create(bars[1])?.hasAttribute('disabled')).toBe(true);
    expect(create(bars[2])?.hasAttribute('loading')).toBe(true);
  });

  it('AppliedFilters: each strip points at the Filter button of its own page bar', async () => {
    const target = draw(validation.AppliedFilters as unknown as Renderable, 'en');
    const strips = (await ready(target)).filter((bar) => bar.type === 'applied-filters');
    expect(strips).toHaveLength(6);
    const ids = strips.map((strip) => strip.trigger);
    expect(new Set(ids).size).toBe(6);
    for (const strip of strips) {
      const trigger = document.getElementById(strip.trigger);
      expect(trigger?.getAttribute('text')).toBe(translations('en').toolbarValidation.filter);
      expect(trigger?.closest('nph-toolbar')?.getAttribute('type')).toBe('page');
    }
  });

  it('InvalidInput draws nothing in each of its cells', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const target = draw(validation.InvalidInput as unknown as Renderable, 'en');
    const bars = await ready(target);
    expect(bars).toHaveLength(6);
    for (const bar of bars) {
      expect(bar.hasAttribute('data-nph-rendered'), bar.outerHTML.slice(0, 160)).toBe(false);
    }
  });
});
