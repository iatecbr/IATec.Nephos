/**
 * Contract of the `nph-navigation-menu` Documentation page: index with no orphan anchor in all three
 * languages, no leftover placeholder, the `navigationMenuDocs` and `navigationMenuValidation` dictionaries
 * with the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), and the two "When to
 * use" lists equal to the ones of the sheet.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-navigation-menu.json';
import { Documentation } from './nph-navigation-menu.docs.stories';
import * as validation from './nph-navigation-menu.stories';
import { NphNavigationMenu } from './nph-navigation-menu';

/** Let every menu render, then take the page clean. */
afterEach(async () => {
  const menus = [...document.querySelectorAll('nph-navigation-menu')] as NphNavigationMenu[];
  await Promise.all(menus.map((menu) => menu.updateComplete));
  await new Promise((resolve) => setTimeout(resolve, 50));
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

describe('nph-navigation-menu Documentation', () => {
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

    it(`${locale}: every menu on the page renders and has an accessible name`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-navigation-menu')] as NphNavigationMenu[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect(piece.shadowRoot?.querySelector('nav')?.getAttribute('aria-label'), piece.outerHTML).toBeTruthy();
      }
    });

    it(`${locale}: the matrix shows the wide and the narrow width`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const menus = [...matrix.querySelectorAll('nph-navigation-menu')] as NphNavigationMenu[];
      expect(menus.map((piece) => (piece.narrow ? 'narrow' : 'wide'))).toEqual(['wide', 'narrow']);
    });

    it(`${locale}: the three required examples, in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      /* The open examples ask for `open` once they have rendered. */
      const all = [...target.querySelectorAll('nph-navigation-menu')] as NphNavigationMenu[];
      await Promise.all(all.map((piece) => piece.updateComplete));
      await Promise.all(all.map((piece) => piece.updateComplete));
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark']);
      for (const figure of examples.querySelectorAll('figure[data-nph-color-scheme]')) {
        const menus = [...figure.querySelectorAll('nph-navigation-menu')] as NphNavigationMenu[];
        expect(menus.map((piece) => (piece.narrow ? 'narrow' : piece.open ? 'open' : 'closed'))).toEqual(['closed', 'open', 'narrow']);
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').navigationMenuDocs);
    expect(shape(translations('pt-BR').navigationMenuDocs)).toEqual(source);
    expect(shape(translations('es').navigationMenuDocs)).toEqual(source);
  });
});

describe('nph-navigation-menu Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').navigationMenuDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').navigationMenuDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-navigation-menu Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  it('the stories are the ones of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Bar', 'Brands', 'Current', 'Direction', 'Examples', 'LongText', 'Narrow', 'Panel']);
  });

  for (const [name, story] of stories) {
    it(`${name}: every menu renders and is named, in all three languages`, async () => {
      for (const locale of LOCALES) {
        const target = document.createElement('div');
        document.body.append(target);
        render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
        const pieces = [...target.querySelectorAll('nph-navigation-menu')] as NphNavigationMenu[];
        await Promise.all(pieces.map((piece) => piece.updateComplete));
        expect(pieces.length, `${name} ${locale}`).toBeGreaterThan(0);
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), `${name} ${locale} ${piece.outerHTML}`).toBe(true);
          expect(piece.shadowRoot?.querySelector('nav')?.getAttribute('aria-label'), `${name} ${locale}`).toBeTruthy();
        }
        target.remove();
      }
    });
  }

  it('Examples: light and dark, with the captions of the chosen language', () => {
    const story = validation.Examples as Renderable;
    for (const locale of LOCALES) {
      const target = document.createElement('div');
      document.body.append(target);
      render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
      const schemes = [...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes, locale).toEqual(['light', 'dark']);
      const captions = [...target.querySelectorAll('figcaption')].map((el) => el.textContent?.trim());
      const expected = translations(locale).navigationMenuValidation;
      expect(captions, locale).toEqual([expected.lightCaption, expected.darkCaption]);
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').navigationMenuValidation);
    expect(shape(translations('pt-BR').navigationMenuValidation)).toEqual(source);
    expect(shape(translations('es').navigationMenuValidation)).toEqual(source);
  });
});

describe('nph-navigation-menu documentation — order of the model', () => {
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

    it(`${locale}: the sections follow the model of the current Docs pages, with no anti-patterns section`, () => {
      const target = renderInLocale(locale);
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(sections).toEqual([
        'when-to-use',
        'api',
        'usage',
        'bar',
        'panel',
        'current',
        'narrow',
        'relations',
        'anatomy',
        'accessibility',
        'examples',
        'references',
      ]);
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
