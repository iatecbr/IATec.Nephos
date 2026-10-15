/**
 * Contract of the `nph-skeleton` Documentation page: index with no orphan anchor in
 * all three languages, no leftover placeholder, the `skeletonDocs` and
 * `skeletonValidation` dictionaries with the same shape in pt-BR, en and es
 * (`test:i18n` only reads `.md` pairs), and the two "When to use" lists equal to
 * the ones of the sheet (option D of D1 in DSA-30: page and sheet match, with no
 * item dropped). Option A of D1, the page reading the Metadata, is deferred; see the
 * header of `nph-skeleton.docs.stories.ts`.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-skeleton.json';
import { Documentation } from './nph-skeleton.docs.stories';
import * as validation from './nph-skeleton.stories';
import { NPH_SKELETON_SHAPES } from './nph-skeleton';

afterEach(() => {
  document.body.replaceChildren();
});

const LOCALES = ['pt-BR', 'en', 'es'] as const;

function renderInLocale(locale: string): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  const draw = Documentation.render as unknown as (args: unknown, context: unknown) => TemplateResult;
  render(draw({}, { globals: { locale } }), target);
  return target;
}

/** The shape of a value: object keys and list length, without the text. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]));
  }
  return typeof value;
}

describe('nph-skeleton Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every instance on the page renders`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-skeleton')] as Array<HTMLElement & { updateComplete: Promise<unknown> }>;
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
      }
    });

    it(`${locale}: the matrix shows each of the five shapes`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const shapes = [...matrix.querySelectorAll('nph-skeleton')].map((piece) => piece.getAttribute('shape'));
      expect(shapes).toEqual([...NPH_SKELETON_SHAPES]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
        expect(entry.querySelectorAll('[aria-busy="true"]').length).toBe(2);
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').skeletonDocs);
    expect(shape(translations('pt-BR').skeletonDocs)).toEqual(source);
    expect(shape(translations('es').skeletonDocs)).toEqual(source);
  });
});

describe('nph-skeleton Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').skeletonDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').skeletonDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-skeleton Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  it('the stories are the shapes and the three required examples', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Card', 'Paragraph', 'PeopleList', 'Shapes']);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = document.createElement('div');
        document.body.append(target);
        render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
        const schemes = [...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes, `${name} ${locale}`).toEqual(['light', 'dark']);
        const captions = [...target.querySelectorAll('figcaption')].map((el) => el.textContent?.trim());
        const expected = translations(locale).skeletonValidation;
        expect(captions, `${name} ${locale}`).toEqual([expected.lightCaption, expected.darkCaption]);
        target.remove();
      }
    });
  }

  it('there is no story per brand: color/muted varies by mode, not by brand', () => {
    for (const [name, story] of stories) {
      const target = document.createElement('div');
      document.body.append(target);
      render(story.render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
      expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').skeletonValidation);
    expect(shape(translations('pt-BR').skeletonValidation)).toEqual(source);
    expect(shape(translations('es').skeletonValidation)).toEqual(source);
  });
});

describe('nph-skeleton documentation — order of the model', () => {
  for (const locale of LOCALES) {
    it(`${locale}: header, matrix, note and index open the page, in this order`, () => {
      const target = renderInLocale(locale);
      const page = target.firstElementChild as HTMLElement;
      const opening = [...page.children]
        .filter((element) => element.tagName !== 'STYLE')
        .slice(0, 4)
        .map((element) =>
          element.matches('header')
            ? 'header'
            : element.matches('[data-nph-matrix]')
              ? 'matrix'
              : element.matches('[role="note"]')
                ? 'note'
                : element.matches('nav')
                  ? 'index'
                  : element.tagName.toLowerCase(),
        );
      expect(opening).toEqual(['header', 'matrix', 'note', 'index']);
    });

    /* Usage is deferred, not refused: D2 of DSA-30 approves it after API, and a later task adds it
     * to every Docs page. This test lists today's sections and does not assert the section's absence. */
    it(`${locale}: the sections follow the model of the current Docs pages, with no anti-patterns section`, () => {
      const target = renderInLocale(locale);
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(sections).toEqual(['when-to-use', 'api', 'shapes', 'relations', 'anatomy', 'accessibility', 'examples', 'references']);
      expect(target.querySelector('#anti-patterns')).toBeNull();
    });

    it(`${locale}: one side-by-side use and do-not-use block`, () => {
      const target = renderInLocale(locale);
      const cards = [...target.querySelectorAll('[data-nph-card]')];
      expect(cards.map((card) => card.getAttribute('data-nph-card'))).toEqual(['success', 'error']);
      expect(cards[0]?.parentElement).toBe(cards[1]?.parentElement);
    });
  }
});
