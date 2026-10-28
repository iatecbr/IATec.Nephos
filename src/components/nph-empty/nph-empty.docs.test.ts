/**
 * Contract of the `nph-empty` Documentation page and of its Validation stories: index with no orphan
 * anchor in all three languages, no leftover placeholder, every `nph-empty` on the page with a
 * heading from the dictionary, the three required examples in light and dark mode, the `emptyDocs`
 * and `emptyValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads
 * `.md` pairs), no text of another language on the English page, and the two "When to use" lists
 * equal to the ones of the sheet. The page reads the lists from the Metadata (P71), and
 * `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-empty.json';
import { Documentation } from './nph-empty.docs.stories';
import * as validation from './nph-empty.stories';
import type { NphEmpty } from './nph-empty';

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

async function ready(target: HTMLElement): Promise<NphEmpty[]> {
  const pieces = [...target.querySelectorAll('nph-empty')];
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  return pieces;
}

/** The examples of a section: each `demo` figure with its light and dark frames. */
function frames(container: Element): Array<string | null> {
  return [...container.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
}

describe('nph-empty Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-empty');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every nph-empty on the page draws, with its heading and description from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const d = translations(locale).emptyDocs;
      const pieces = await ready(target);
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect([d.heading, d.areaHeading]).toContain(piece.heading);
        if (piece.hasAttribute('description')) expect(piece.description).toBe(d.description);
      }
    });

    it(`${locale}: the matrix shows the heading with description and the heading only`, async () => {
      const target = renderInLocale(locale);
      const pieces = await ready(target.querySelector('[data-nph-matrix]') as HTMLElement);
      expect(pieces.map((piece) => piece.hasAttribute('description'))).toEqual([true, false]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('#required-examples') as HTMLElement;
      const figures = [...examples.querySelectorAll(':scope figure:not([data-nph-color-scheme])')];
      expect(figures).toHaveLength(3);
      for (const figure of figures) {
        expect(frames(figure)).toEqual(['light', 'dark']);
      }
      const [list, withDescription, headingOnly] = await Promise.all(figures.map((figure) => ready(figure as HTMLElement)));
      expect(figures[0]?.querySelectorAll('[role="group"] nph-empty')).toHaveLength(2);
      expect(list?.every((piece) => piece.hasAttribute('description'))).toBe(true);
      expect(withDescription?.every((piece) => piece.hasAttribute('description'))).toBe(true);
      expect(headingOnly?.every((piece) => !piece.hasAttribute('description'))).toBe(true);
    });

    it(`${locale}: the accessibility section names aria-hidden, the contrast and the announcement`, () => {
      const target = renderInLocale(locale);
      const text = target.querySelector('#accessibility')?.textContent ?? '';
      expect(text).toContain('aria-hidden');
      expect(text).toContain('4');
      expect(text).toContain('color/popover');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['emptyDocs', 'emptyValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').emptyDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).emptyDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-empty Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').emptyDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').emptyDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).emptyDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).emptyDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the API table names the two properties of the sheet', () => {
    expect(translations('en').emptyDocs.api.map((row: string[]) => row[0])).toEqual(Object.keys(metadata.api));
  });
});

describe('nph-empty Validation: text only from the dictionary', () => {
  /* InvalidHeading has no heading on purpose: its development error is expected here. */
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `HeadingOnly` is `heading-only`. */
  const idOf = (name: string): string =>
    `components-nph-empty-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the five pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['ComboboxList', 'HeadingOnly', 'InvalidHeading', 'Surfaces', 'WithDescription']);
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-empty · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: light and dark side by side, and every text of the piece comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).emptyValidation));
        const pieces = await ready(target);
        expect(pieces.length, name).toBeGreaterThan(0);
        expect(frames(target).length % 2, name).toBe(0);
        expect(frames(target).slice(0, 2), name).toEqual(['light', 'dark']);
        for (const piece of pieces) {
          if (piece.heading !== '') expect(allowed.has(piece.heading), `${name} ${locale}: ${piece.heading}`).toBe(true);
          if (piece.hasAttribute('description')) expect(allowed.has(piece.description), `${name} ${locale}`).toBe(true);
        }
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('Surfaces: the texts on color/background and on color/popover, each in light and in dark', async () => {
    const target = draw(validation.Surfaces as Renderable, 'en');
    expect(frames(target)).toEqual(['light', 'dark', 'light', 'dark']);
    const surfaces = [...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => (el as HTMLElement).style.background);
    expect(surfaces).toEqual([
      'var(--nph-color-background)',
      'var(--nph-color-background)',
      'var(--nph-color-popover)',
      'var(--nph-color-popover)',
    ]);
  });

  it('InvalidHeading: nothing is drawn in either mode', async () => {
    const target = draw(validation.InvalidHeading as Renderable, 'en');
    const pieces = await ready(target);
    expect(pieces).toHaveLength(2);
    for (const piece of pieces) {
      expect(piece.hasAttribute('data-nph-rendered')).toBe(false);
      expect(piece.getBoundingClientRect().height).toBe(0);
    }
  });

  it('there is no story per brand: the page follows the global brand, the frame only sets the mode', () => {
    for (const [name, story] of stories) {
      const target = draw(story, 'en');
      expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      target.remove();
    }
  });
});
