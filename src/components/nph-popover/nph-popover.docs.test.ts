/**
 * Contract of the `nph-popover` Documentation page: index with no orphan anchor in all three
 * languages, no leftover placeholder, the `popoverDocs` and `popoverValidation` dictionaries with
 * the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), and the two "When to
 * use" lists equal to the ones of the sheet.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-popover.json';
import { Documentation } from './nph-popover.docs.stories';
import * as validation from './nph-popover.stories';
import { NphPopover } from './nph-popover';

const settle = (ms = 80): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A popover taken out of the page before it found its trigger, or while it is shown or still
 * leaving, logs a lookup error in development. Let every popover render, then take the page away.
 */
afterEach(async () => {
  const popovers = [...document.querySelectorAll('nph-popover')] as NphPopover[];
  await Promise.all(popovers.map((popover) => popover.updateComplete));
  await settle(50);
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

const popoversOf = (root: Element): NphPopover[] => [...root.querySelectorAll('nph-popover')] as NphPopover[];

describe('nph-popover Documentation', () => {
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

    it(`${locale}: every popover on the page finds its trigger, renders and has a title`, async () => {
      const target = renderInLocale(locale);
      const pieces = popoversOf(target);
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      await settle();
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect(piece.heading.trim(), piece.outerHTML).not.toBe('');
        const trigger = (piece.getRootNode() as Document).getElementById(piece.getAttribute('for') ?? '');
        expect(trigger, piece.outerHTML).not.toBeNull();
      }
    });

    it(`${locale}: the matrix shows the three sizes, sm, md and lg`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      expect(popoversOf(matrix).map((piece) => piece.size)).toEqual(['sm', 'md', 'lg']);
    });

    it(`${locale}: the three required examples, in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark']);
      for (const figure of examples.querySelectorAll('figure[data-nph-color-scheme]')) {
        const pieces = popoversOf(figure);
        expect(pieces).toHaveLength(3);
        /* Filter with confirmation, short form with a field, information with close and the arrow. */
        expect(pieces.map((piece) => piece.querySelector('[slot="footer"]') !== null)).toEqual([true, true, false]);
        expect(pieces.map((piece) => piece.querySelector('nph-field') !== null)).toEqual([false, true, false]);
        expect(pieces.map((piece) => piece.closable)).toEqual([false, false, true]);
        expect(pieces.map((piece) => piece.arrow)).toEqual([false, false, true]);
      }
    });

    it(`${locale}: the placement demo covers the four sides and the arrow demo the three alignments`, () => {
      const target = renderInLocale(locale);
      const placement = popoversOf(target.querySelector('section#placement') as HTMLElement);
      expect(placement.map((piece) => piece.side)).toEqual(['bottom', 'top', 'right', 'left']);
      const arrow = popoversOf(target.querySelector('section#arrow') as HTMLElement);
      expect(arrow.map((piece) => piece.align)).toEqual(['start', 'center', 'end']);
      expect([...placement, ...arrow].every((piece) => piece.arrow)).toBe(true);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').popoverDocs);
    expect(shape(translations('pt-BR').popoverDocs)).toEqual(source);
    expect(shape(translations('es').popoverDocs)).toEqual(source);
  });
});

describe('nph-popover Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').popoverDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').popoverDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-popover Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  it('the stories are the ones of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Direction', 'Examples', 'Interactive', 'Parts', 'Placement', 'Sizes']);
  });

  for (const [name, story] of stories) {
    it(`${name}: every popover renders and finds its trigger, in all three languages`, async () => {
      for (const locale of LOCALES) {
        const target = document.createElement('div');
        document.body.append(target);
        render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
        const pieces = popoversOf(target);
        await Promise.all(pieces.map((piece) => piece.updateComplete));
        await settle();
        expect(pieces.length, `${name} ${locale}`).toBeGreaterThan(0);
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), `${name} ${locale} ${piece.outerHTML}`).toBe(true);
        }
        target.remove();
      }
    });
  }

  it('Placement: the twelve variants of the Figma set, with the arrow', () => {
    const target = document.createElement('div');
    document.body.append(target);
    render((validation.Placement as Renderable).render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
    expect(popoversOf(target).map((piece) => `${piece.side} ${piece.align} ${piece.arrow}`)).toEqual(
      ['bottom', 'top', 'right', 'left'].flatMap((side) => ['start', 'center', 'end'].map((align) => `${side} ${align} true`)),
    );
  });

  it('Sizes: the three widths, with no arrow', () => {
    const target = document.createElement('div');
    document.body.append(target);
    render((validation.Sizes as Renderable).render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
    expect(popoversOf(target).map((piece) => `${piece.size} ${piece.arrow}`)).toEqual(['sm false', 'md false', 'lg false']);
  });

  it('Examples: light and dark, with the captions of the chosen language', () => {
    const story = validation.Examples as Renderable;
    for (const locale of LOCALES) {
      const target = document.createElement('div');
      document.body.append(target);
      render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
      const schemes = [...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes, locale).toEqual(['light', 'dark']);
      const captions = [...target.querySelectorAll('figcaption')].map((el) => el.textContent?.trim());
      const expected = translations(locale).popoverValidation;
      expect(captions, locale).toEqual([expected.lightCaption, expected.darkCaption]);
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').popoverValidation);
    expect(shape(translations('pt-BR').popoverValidation)).toEqual(source);
    expect(shape(translations('es').popoverValidation)).toEqual(source);
  });
});

describe('nph-popover documentation — order of the model', () => {
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
        'placement',
        'arrow',
        'sizes',
        'parts',
        'closing',
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
