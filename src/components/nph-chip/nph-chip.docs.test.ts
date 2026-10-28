/**
 * Contract of the `nph-chip` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, the Usage section with the tag
 * and the import line of the package, the labelled matrix, the three mandatory examples in light
 * and dark mode, every chip drawn with its text from the dictionary, the `chipDocs` and
 * `chipValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads
 * `.md` pairs), no text of another language on the English page, the two "When to use" lists
 * equal to the ones of the sheet, and every property and event of the sheet named on the page.
 * The page reads the lists from the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts`
 * checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import pkg from '../../../package.json';
import metadata from '../../shared/metadata/nph-chip.json';
import { Documentation } from './nph-chip.docs.stories';
import * as validation from './nph-chip.stories';
import type { NphChip } from './nph-chip';

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

async function ready(target: HTMLElement): Promise<NphChip[]> {
  const chips = [...target.querySelectorAll<NphChip>('nph-chip')];
  await Promise.all(chips.map((chip) => chip.updateComplete));
  return chips;
}

/** The text a chip receives: its label and the word its X says. */
function textOf(chip: NphChip): string[] {
  return [chip.text, chip.removeLabel].filter((value) => value !== '');
}

describe('nph-chip Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('main > nav a, main nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...new Set(links)].sort());
    });

    it(`${locale}: every section has a title, and the page is nph-chip`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-chip');
    });

    it(`${locale}: every section ends with its source, except References`, () => {
      const target = renderInLocale(locale);
      for (const section of target.querySelectorAll('section[id]')) {
        if (section.id === 'references') continue;
        const last = section.lastElementChild;
        expect(last?.tagName, section.id).toBe('P');
        expect(last?.textContent?.trim().startsWith(translations(locale).chipDocs.sourceLabel), section.id).toBe(true);
      }
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: Usage shows the tag and the import line of the package`, () => {
      const target = renderInLocale(locale);
      const terms = [...target.querySelectorAll('section#usage tbody th')].map((th) => th.textContent?.trim());
      expect(terms).toEqual(['<nph-chip></nph-chip>', `import '${pkg.name}/nph-chip';`]);
    });

    it(`${locale}: every chip draws, with its text from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const chips = await ready(target);
      const allowed = new Set(leaves(translations(locale).chipDocs));
      expect(chips.length).toBeGreaterThan(0);
      for (const chip of chips) {
        expect(chip.hasAttribute('data-nph-rendered'), chip.outerHTML).toBe(true);
        for (const value of textOf(chip)) {
          expect(allowed.has(value), value).toBe(true);
        }
      }
    });

    it(`${locale}: the matrix crosses the severities, the contents and the states of both types`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const chips = [...matrix.querySelectorAll<NphChip>('nph-chip')];
      expect(chips).toHaveLength(18);
      expect(new Set(chips.map((chip) => chip.severity))).toEqual(new Set(['default', 'success', 'warning', 'error', 'info', 'help']));
      expect(chips.filter((chip) => chip.type === 'selectable')).toHaveLength(4);
      expect(chips.some((chip) => chip.avatar)).toBe(true);
      expect(chips.some((chip) => chip.icon !== '')).toBe(true);
      expect(chips.some((chip) => chip.counter !== null)).toBe(true);
      for (const state of ['marked', 'readonly', 'invalid', 'disabled', 'selected'] as const) {
        expect(chips.some((chip) => chip[state]), state).toBe(true);
      }
    });

    it(`${locale}: the three mandatory examples, each in light and dark mode`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#mandatory-examples') as HTMLElement;
      const figures = [...examples.querySelectorAll<HTMLElement>('figure[data-nph-color-scheme]')];
      expect(figures.map((figure) => figure.getAttribute('data-nph-color-scheme'))).toEqual(['light', 'dark', 'light', 'dark', 'light', 'dark']);
      const [filtersFigure, , fieldFigure, , quickFigure] = figures;
      const filters = [...(filtersFigure?.querySelectorAll<NphChip>('nph-chip') ?? [])];
      expect(filters.map((chip) => [chip.severity, chip.icon, chip.avatar])).toEqual([
        ['default', 'calendar-days', false],
        ['error', '', false],
        ['default', '', true],
      ]);
      const clear = filtersFigure?.querySelector('nph-button');
      expect([clear?.getAttribute('severity'), clear?.getAttribute('emphasis'), clear?.getAttribute('size')]).toEqual(['secondary', 'ghost', 'compact']);
      expect(clear?.getAttribute('text')).toBe(translations(locale).chipDocs.filters.clear);
      const values = [...(fieldFigure?.querySelectorAll<NphChip>('nph-chip') ?? [])];
      expect(values.map((chip) => chip.text)).toEqual(translations(locale).chipDocs.field);
      expect(values.map((chip) => chip.invalid)).toEqual([false, false, true]);
      const quick = [...(quickFigure?.querySelectorAll<NphChip>('nph-chip') ?? [])];
      expect(quick.map((chip) => [chip.type, chip.counter, chip.selected])).toEqual([
        ['selectable', 12, true],
        ['selectable', 8, false],
        ['selectable', 3, true],
      ]);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['chipDocs', 'chipValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').chipDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).chipDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('the two "When to use" lists are the ones of the sheet', () => {
    expect(translations('en').chipDocs.whenToUse).toEqual(metadata.use_when);
    expect(translations('en').chipDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).chipDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).chipDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the API of the page names every property and event of the sheet', () => {
    const terms = (translations('en').chipDocs.api as Array<[string, string]>).flatMap(([names]) =>
      names.split(',').map((name) => name.trim()),
    );
    for (const property of Object.keys(metadata.api)) {
      expect(terms, property).toContain(property);
    }
  });

  it('the Validation text of every language is the shared text of the page', () => {
    for (const locale of LOCALES) {
      const { chipDocs, chipValidation } = translations(locale);
      for (const [key, value] of Object.entries(chipValidation)) {
        expect((chipDocs as Record<string, unknown>)[key], `${locale} ${key}`).toEqual(value);
      }
    }
  });
});

describe('nph-chip Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `LongText` is `long-text`. */
  const idOf = (name: string): string =>
    `components-nph-chip-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the seven pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Brands', 'Examples', 'InvalidInput', 'LongText', 'Removable', 'Selectable', 'Severities']);
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-chip · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text the chips receive comes from the dictionary, in light and in dark mode`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(leaves(translations(locale).chipValidation));
        for (const chip of await ready(target)) {
          for (const value of textOf(chip)) {
            expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
          }
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

  it('only the Brands story carries data-nph-brand: the other pages follow the root brand, the frame only sets the mode', () => {
    for (const [name, story] of stories) {
      const target = draw(story, 'en');
      if (name === 'Brands') {
        const branded = [...target.querySelectorAll('[data-nph-brand]')];
        expect(branded, name).toHaveLength(14);
        for (const frame of branded) {
          expect(frame.hasAttribute('data-nph-color-scheme'), frame.outerHTML.slice(0, 120)).toBe(true);
          expect(frame.hasAttribute('data-nph-brand-frame'), frame.outerHTML.slice(0, 120)).toBe(true);
        }
      } else {
        expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      }
      target.remove();
    }
  });

  /** The chips of one mode of a story: the second half of the page is the dark copy of the first. */
  async function oneMode(story: unknown): Promise<NphChip[]> {
    const target = draw(story as Renderable, 'en');
    const chips = await ready(target);
    expect(chips.length % 2).toBe(0);
    return chips.slice(0, chips.length / 2);
  }

  it('Removable draws content × size × state, every chip valid', async () => {
    const chips = await oneMode(validation.Removable);
    expect(chips).toHaveLength(30);
    for (const chip of chips) {
      expect(chip.hasAttribute('data-nph-rendered'), chip.outerHTML).toBe(true);
      expect(chip.type).toBe('removable');
    }
    expect(new Set(chips.map((chip) => chip.size))).toEqual(new Set(['compact', 'default']));
    for (const state of ['marked', 'readonly', 'invalid', 'disabled'] as const) {
      expect(chips.filter((chip) => chip[state]), state).toHaveLength(6);
    }
    expect(chips.filter((chip) => chip.avatar)).toHaveLength(10);
    expect(chips.filter((chip) => chip.icon !== '')).toHaveLength(10);
  });

  it('Severities draws the five status colors × size × default and disabled, every chip valid', async () => {
    const chips = await oneMode(validation.Severities);
    expect(chips).toHaveLength(20);
    for (const chip of chips) {
      expect(chip.hasAttribute('data-nph-rendered'), chip.outerHTML).toBe(true);
    }
    expect(new Set(chips.map((chip) => chip.severity))).toEqual(new Set(['success', 'warning', 'error', 'info', 'help']));
    expect(chips.filter((chip) => chip.disabled)).toHaveLength(10);
  });

  it('Selectable draws content × size × default, disabled, selected and selected disabled, every chip valid', async () => {
    const chips = await oneMode(validation.Selectable);
    expect(chips).toHaveLength(24);
    for (const chip of chips) {
      expect(chip.hasAttribute('data-nph-rendered'), chip.outerHTML).toBe(true);
      expect(chip.type).toBe('selectable');
    }
    expect(chips.filter((chip) => chip.selected)).toHaveLength(12);
    expect(chips.filter((chip) => chip.disabled)).toHaveLength(12);
    expect(chips.filter((chip) => chip.counter !== null)).toHaveLength(8);
  });

  it('LongText cuts the label in both types and both sizes', async () => {
    const target = draw(validation.LongText as unknown as Renderable, 'en');
    const chips = await ready(target);
    expect(chips).toHaveLength(8);
    for (const chip of chips) {
      expect(chip.hasAttribute('data-nph-rendered'), chip.outerHTML).toBe(true);
      const label = chip.shadowRoot?.querySelector('.label') as HTMLElement;
      expect(label.scrollWidth, chip.outerHTML).toBeGreaterThan(label.clientWidth);
    }
  });

  it('InvalidInput draws nothing in each of its cells', async () => {
    const target = draw(validation.InvalidInput as unknown as Renderable, 'en');
    const chips = await ready(target);
    expect(chips.length).toBe(16);
    for (const chip of chips) {
      expect(chip.hasAttribute('data-nph-rendered'), chip.outerHTML).toBe(false);
    }
  });
});
