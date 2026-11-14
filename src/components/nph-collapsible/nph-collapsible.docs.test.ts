/**
 * Contract of the `nph-collapsible` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, the `collapsibleDocs` and
 * `collapsibleValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads
 * `.md` pairs), the two "When to use" lists equal to the ones of the sheet, and every piece on the pages
 * drawn and named.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-collapsible.json';
import { Documentation } from './nph-collapsible.docs.stories';
import * as validation from './nph-collapsible.stories';
import { NphCollapsible } from './nph-collapsible';

/** Let every piece render before the page is taken out of the document. */
afterEach(async () => {
  const pieces = [...document.querySelectorAll('nph-collapsible')] as NphCollapsible[];
  await Promise.all(pieces.map((piece) => piece.updateComplete));
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

describe('nph-collapsible Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      const text = renderInLocale(locale).textContent ?? '';
      expect(text).not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every piece on the page renders and has a name`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-collapsible')] as NphCollapsible[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect(piece.label, piece.outerHTML).toBeTruthy();
      }
    });

    it(`${locale}: the matrix shows the three types`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const types = [...matrix.querySelectorAll('nph-collapsible')].map((piece) => (piece as NphCollapsible).type);
      expect(types).toEqual(['line', 'button', 'preview']);
    });

    it(`${locale}: the three required examples, in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark']);
      for (const figure of examples.querySelectorAll('figure[data-nph-color-scheme]')) {
        const pieces = [...figure.querySelectorAll('nph-collapsible')] as NphCollapsible[];
        expect(pieces.map((piece) => [piece.type, piece.indicator, piece.open])).toEqual([
          ['line', 'end', true],
          ['line', 'start', false],
          ['line', 'start', true],
          ['line', 'start', false],
          ['preview', 'end', false],
        ]);
      }
    });

    it(`${locale}: the example texts feed every piece, so no warning is left to say`, () => {
      const target = renderInLocale(locale);
      for (const piece of target.querySelectorAll('nph-collapsible') as NodeListOf<NphCollapsible>) {
        expect(piece.label, piece.outerHTML).toBeTruthy();
        if (piece.type === 'preview') expect(piece.openLabel, piece.outerHTML).toBeTruthy();
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').collapsibleDocs);
    expect(shape(translations('pt-BR').collapsibleDocs)).toEqual(source);
    expect(shape(translations('es').collapsibleDocs)).toEqual(source);
  });
});

describe('nph-collapsible Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').collapsibleDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').collapsibleDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-collapsible Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  const draw = (name: string, locale: string): HTMLElement => {
    const target = document.createElement('div');
    document.body.append(target);
    render((validation[name as 'Types'] as Renderable).render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  };

  it('the stories are the ones of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(
      ['Appearances', 'Brands', 'Content', 'Direction', 'Examples', 'Indicator', 'Interactive', 'Sizes', 'Stack', 'States', 'Types'].sort(),
    );
  });

  for (const [name, story] of stories) {
    it(`${name}: every piece renders and is named, in all three languages`, async () => {
      for (const locale of LOCALES) {
        const target = document.createElement('div');
        document.body.append(target);
        render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
        const pieces = [...target.querySelectorAll('nph-collapsible')] as NphCollapsible[];
        await Promise.all(pieces.map((piece) => piece.updateComplete));
        expect(pieces.length, `${name} ${locale}`).toBeGreaterThan(0);
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), `${name} ${locale} ${piece.outerHTML}`).toBe(true);
          expect(piece.label, `${name} ${locale}`).toBeTruthy();
        }
        target.remove();
      }
    });
  }

  it('Types: the three types, closed and open', () => {
    const pieces = [...draw('Types', 'en').querySelectorAll('nph-collapsible')] as NphCollapsible[];
    expect(pieces.map((piece) => [piece.type, piece.open])).toEqual([
      ['line', false],
      ['line', true],
      ['button', false],
      ['button', true],
      ['preview', false],
      ['preview', true],
    ]);
  });

  it('Appearances: flush and the card, in the three types', () => {
    const pieces = [...draw('Appearances', 'en').querySelectorAll('nph-collapsible')] as NphCollapsible[];
    expect(new Set(pieces.map((piece) => piece.appearance))).toEqual(new Set(['flush', 'card']));
    expect(new Set(pieces.filter((piece) => piece.appearance === 'card').map((piece) => piece.type))).toEqual(
      new Set(['line', 'button', 'preview']),
    );
  });

  it('Sizes: compact, default and large', () => {
    const pieces = [...draw('Sizes', 'en').querySelectorAll('nph-collapsible')] as NphCollapsible[];
    expect(pieces.map((piece) => piece.size)).toEqual(['compact', 'default', 'large']);
  });

  it('Indicator: at the end and at the start, with and without the start icon', () => {
    const pieces = [...draw('Indicator', 'en').querySelectorAll('nph-collapsible')] as NphCollapsible[];
    expect(new Set(pieces.map((piece) => `${piece.indicator}:${piece.icon === '' ? 'no-icon' : 'icon'}`))).toEqual(
      new Set(['end:no-icon', 'start:no-icon', 'start:icon', 'end:icon']),
    );
  });

  it('States: disabled in the three types, and open and disabled together', () => {
    const pieces = [...draw('States', 'en').querySelectorAll('nph-collapsible')] as NphCollapsible[];
    const disabled = pieces.filter((piece) => piece.disabled);
    expect(new Set(disabled.map((piece) => piece.type))).toEqual(new Set(['line', 'button', 'preview']));
    expect(disabled.some((piece) => piece.open)).toBe(true);
  });

  it('Stack: three pieces one under the other, in both appearances, with no divider', () => {
    const target = draw('Stack', 'en');
    const pieces = [...target.querySelectorAll('nph-collapsible')] as NphCollapsible[];
    expect(pieces).toHaveLength(6);
    expect(new Set(pieces.map((piece) => piece.appearance))).toEqual(new Set(['flush', 'card']));
    expect(target.querySelector('hr')).toBeNull();
  });

  it('Direction: the pieces are inside a right-to-left box', () => {
    const target = draw('Direction', 'en');
    const box = target.querySelector('[dir="rtl"]') as HTMLElement;
    expect(box.querySelectorAll('nph-collapsible').length).toBeGreaterThan(0);
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
      const expected = translations(locale).collapsibleValidation;
      expect(captions, locale).toEqual([expected.lightCaption, expected.darkCaption]);
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').collapsibleValidation);
    expect(shape(translations('pt-BR').collapsibleValidation)).toEqual(source);
    expect(shape(translations('es').collapsibleValidation)).toEqual(source);
  });
});

describe('nph-collapsible Validation: the event story listens', () => {
  it('Interactive: opening the piece writes what the page heard, in the chosen language', async () => {
    const target = document.createElement('div');
    document.body.append(target);
    render(((validation.Interactive as { render?: (a: unknown, c: unknown) => TemplateResult }).render as (a: unknown, c: unknown) => TemplateResult)({}, { globals: { locale: 'pt-BR' } }), target);
    const piece = target.querySelector('nph-collapsible') as NphCollapsible;
    await piece.updateComplete;
    (piece.shadowRoot?.querySelector('#trigger') as HTMLButtonElement).click();
    await piece.updateComplete;
    const expected = translations('pt-BR').collapsibleValidation;
    expect(target.querySelector('output')?.textContent).toBe(expected.eventOpen);
    (piece.shadowRoot?.querySelector('#trigger') as HTMLButtonElement).click();
    await piece.updateComplete;
    expect(target.querySelector('output')?.textContent).toBe(expected.eventClosed);
  });
});

describe('nph-collapsible documentation — order of the model', () => {
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
        'types',
        'variants',
        'behavior',
        'keyboard',
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
