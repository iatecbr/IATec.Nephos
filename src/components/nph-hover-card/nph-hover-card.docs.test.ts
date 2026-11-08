/**
 * Contract of the `nph-hover-card` Documentation page: index with no orphan anchor in all three
 * languages, no leftover placeholder, the `hoverCardDocs` and `hoverCardValidation` dictionaries
 * with the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), and the two "When to
 * use" lists equal to the ones of the sheet.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-hover-card.json';
import { Documentation } from './nph-hover-card.docs.stories';
import * as validation from './nph-hover-card.stories';
import { NphHoverCard } from './nph-hover-card';

/**
 * A card taken out of the page while it is shown, or still leaving, has nothing left to report; but
 * every card must have rendered and closed before the page is torn down.
 */
afterEach(async () => {
  const cards = [...document.querySelectorAll('nph-hover-card')] as NphHoverCard[];
  await Promise.all(cards.map((card) => card.updateComplete));
  for (const card of cards) card.open = false;
  await Promise.all(cards.map((card) => card.updateComplete));
  await new Promise((resolve) => setTimeout(resolve, 300));
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

describe('nph-hover-card Documentation', () => {
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

    it(`${locale}: every card on the page renders, with a link that has a name and a destination`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-hover-card')] as NphHoverCard[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        const link = piece.shadowRoot?.querySelector('a');
        expect(link?.getAttribute('href'), piece.outerHTML).toBeTruthy();
        expect(piece.textContent?.trim(), piece.outerHTML).toBeTruthy();
      }
    });

    it(`${locale}: the matrix shows the card without and with the arrow, on the four sides`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const cards = [...matrix.querySelectorAll('nph-hover-card')] as NphHoverCard[];
      expect(cards.map((piece) => `${piece.arrow ? 'arrow' : 'plain'}:${piece.side}`)).toEqual([
        'plain:bottom',
        'arrow:bottom',
        'arrow:top',
        'arrow:left',
        'arrow:right',
      ]);
    });

    it(`${locale}: the three required examples, in light and in dark mode, with the media of each`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark']);
      for (const figure of examples.querySelectorAll('figure[data-nph-color-scheme]')) {
        const cards = [...figure.querySelectorAll('nph-hover-card')] as NphHoverCard[];
        expect(cards.length).toBe(3);
        expect(cards.map((piece) => piece.querySelector('[slot="media"]')?.localName)).toEqual(['nph-avatar', 'nph-image', 'nph-badge']);
        expect(cards.every((piece) => piece.open)).toBe(true);
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').hoverCardDocs);
    expect(shape(translations('pt-BR').hoverCardDocs)).toEqual(source);
    expect(shape(translations('es').hoverCardDocs)).toEqual(source);
  });
});

describe('nph-hover-card Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').hoverCardDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').hoverCardDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-hover-card Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  it('the stories are the ones of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Brands', 'Direction', 'Examples', 'InSentence', 'MetaLine', 'Sides']);
  });

  for (const [name, story] of stories) {
    it(`${name}: every card renders with a link, in all three languages`, async () => {
      for (const locale of LOCALES) {
        const target = document.createElement('div');
        document.body.append(target);
        render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
        const pieces = [...target.querySelectorAll('nph-hover-card')] as NphHoverCard[];
        await Promise.all(pieces.map((piece) => piece.updateComplete));
        expect(pieces.length, `${name} ${locale}`).toBeGreaterThan(0);
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), `${name} ${locale} ${piece.outerHTML}`).toBe(true);
          expect(piece.shadowRoot?.querySelector('a')?.getAttribute('href'), `${name} ${locale}`).toBeTruthy();
        }
        for (const piece of pieces) piece.open = false;
        await Promise.all(pieces.map((piece) => piece.updateComplete));
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
      const expected = translations(locale).hoverCardValidation;
      expect(captions, locale).toEqual([expected.lightCaption, expected.darkCaption]);
      target.remove();
    }
  });

  it('a time in the meta line always carries the full date in meta-title', async () => {
    for (const name of ['MetaLine', 'Examples'] as const) {
      const target = document.createElement('div');
      document.body.append(target);
      render((validation[name] as Renderable).render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
      const cards = [...target.querySelectorAll('nph-hover-card')] as NphHoverCard[];
      await Promise.all(cards.map((card) => card.updateComplete));
      const times = cards.filter((card) => /^\d{1,2}:\d{2}$/.test(card.meta));
      expect(times.length, name).toBeGreaterThan(0);
      for (const card of times) expect(card.metaTitle, `${name} ${card.meta}`).not.toBe('');
      for (const card of cards) card.open = false;
      await Promise.all(cards.map((card) => card.updateComplete));
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').hoverCardValidation);
    expect(shape(translations('pt-BR').hoverCardValidation)).toEqual(source);
    expect(shape(translations('es').hoverCardValidation)).toEqual(source);
  });
});

describe('nph-hover-card documentation — order of the model', () => {
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
        'sides',
        'meta-line',
        'behavior',
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
