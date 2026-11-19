/**
 * Contract of the `nph-carousel` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, the `carouselDocs` and
 * `carouselValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads
 * `.md` pairs), no text of another language on the English page, and the two "When to use" lists
 * equal to the ones of the sheet (page and sheet match, with no item dropped). The page reads the
 * lists from the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-carousel.json';
import { Documentation } from './nph-carousel.docs.stories';
import * as validation from './nph-carousel.stories';
import type { NphCarousel } from './nph-carousel';

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

/** Every string of a value, in order. */
function leaves(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(leaves);
  if (value !== null && typeof value === 'object') return Object.values(value).flatMap(leaves);
  return [];
}

/** `value` appears in `text` as a whole run of text, not inside a longer word (`Criterio` is not in `Criterion`). */
function containsWhole(text: string, value: string): boolean {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, 'u').test(text);
}

type Piece = NphCarousel & { updateComplete: Promise<unknown> };

async function ready(target: HTMLElement): Promise<Piece[]> {
  const pieces = [...target.querySelectorAll('nph-carousel')] as Piece[];
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  return pieces;
}

describe('nph-carousel Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-carousel');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every carousel on the page renders, has a name and the names of its controls from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const pieces = await ready(target);
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect((piece.getAttribute('label') ?? '').trim(), piece.outerHTML).not.toBe('');
        for (const name of ['previous-label', 'next-label', 'indicators-label', 'slide-label', 'page-label', 'position-label']) {
          expect((piece.getAttribute(name) ?? '').trim(), `${name} of ${piece.outerHTML}`).not.toBe('');
        }
        expect(piece.children.length).toBeGreaterThanOrEqual(2);
      }
    });

    it(`${locale}: the matrix shows the three layouts at the start, in the middle and at the end`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['position: start', 'position: middle', 'position: end']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        layout: [...tr.querySelectorAll('td')].map((cell) => cell.querySelector('nph-carousel')?.getAttribute('layout')),
        index: [...tr.querySelectorAll('td')].map((cell) => (cell.querySelector('nph-carousel') as Piece).index),
      }));
      expect(rows).toEqual([
        { label: 'layout: single', layout: ['single', 'single', 'single'], index: [0, 1, 3] },
        { label: 'layout: several', layout: ['several', 'several', 'several'], index: [0, 2, 4] },
        { label: 'layout: peek', layout: ['peek', 'peek', 'peek'], index: [0, 1, 3] },
      ]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
      }
      const shown = demos.map((entry) => {
        const piece = entry.querySelector('nph-carousel') as Piece;
        return { layout: piece.getAttribute('layout'), slides: piece.children.length, index: piece.index };
      });
      expect(shown).toEqual([
        { layout: 'peek', slides: 4, index: 1 },
        { layout: 'several', slides: 6, index: 0 },
        { layout: 'single', slides: 8, index: 1 },
      ]);
    });

    it(`${locale}: the keyboard section names the keys of the tabbed carousel`, () => {
      const section = renderInLocale(locale).querySelector('section#keyboard') as HTMLElement;
      const terms = [...section.querySelectorAll('tbody th')].map((th) => th.textContent?.trim() ?? '');
      for (const key of ['Tab', 'Home', 'Enter']) {
        expect(terms.join(' ')).toContain(key);
      }
    });

    it(`${locale}: the accessibility section names the roles and the live region`, () => {
      const section = renderInLocale(locale).querySelector('section#accessibility') as HTMLElement;
      for (const word of ['aria-roledescription', 'tablist', 'aria-live', 'inert']) {
        expect(section.textContent ?? '', word).toContain(word);
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').carouselDocs);
    expect(shape(translations('pt-BR').carouselDocs)).toEqual(source);
    expect(shape(translations('es').carouselDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').carouselDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).carouselDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-carousel Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').carouselDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').carouselDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).carouselDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).carouselDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-carousel Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `ManySlides` is `many-slides`. */
  const idOf = (name: string): string =>
    `components-nph-carousel-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the six pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Brands', 'Controls', 'Examples', 'Interactive', 'ManySlides', 'Matrix']);
  });

  it('Matrix: the three layouts at three positions, in both modes', async () => {
    const target = draw(validation.Matrix as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const pieces = [...frame.querySelectorAll('nph-carousel')];
    expect(pieces.map((piece) => piece.getAttribute('layout'))).toEqual([
      ...Array(3).fill('single'),
      ...Array(3).fill('several'),
      ...Array(3).fill('peek'),
    ]);
    await ready(target);
  });

  it('Controls: arrows, indicators and counter on and off', async () => {
    const target = draw(validation.Controls as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const pieces = [...frame.querySelectorAll('nph-carousel')] as Piece[];
    expect(pieces.map((piece) => [piece.hasAttribute('hide-arrows'), piece.hasAttribute('hide-indicators'), piece.hasAttribute('counter')])).toEqual([
      [false, false, false],
      [true, false, false],
      [false, false, true],
      [true, false, true],
      [false, true, true],
    ]);
    await ready(target);
  });

  it('ManySlides: above five pages the indicators are off and the counter is on, by itself', async () => {
    const target = draw(validation.ManySlides as Renderable, 'en');
    const pieces = await ready(target);
    for (const piece of pieces.slice(0, 2)) {
      expect(piece.shadowRoot!.querySelectorAll('.tab').length).toBe(0);
      expect(piece.shadowRoot!.querySelector('.counter')).not.toBeNull();
    }
  });

  it('Brands: the seven brands in light and dark, the carousel inside every frame', () => {
    const target = draw(validation.Brands as Renderable, 'en');
    const frames = [...target.querySelectorAll('[data-nph-brand-frame]')];
    expect(frames).toHaveLength(14);
    for (const frame of frames) expect(frame.querySelector('nph-carousel')).not.toBeNull();
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-carousel · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every carousel renders and every name comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).carouselValidation));
        const pieces = await ready(target);
        expect(pieces.length, name).toBeGreaterThan(0);
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
          for (const attribute of ['label', 'previous-label', 'next-label', 'indicators-label', 'slide-label', 'page-label', 'position-label']) {
            const value = piece.getAttribute(attribute) ?? '';
            expect(allowed.has(value), `${name} ${locale}: ${attribute}="${value}"`).toBe(true);
          }
        }
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('there is no story per brand but Brands: the page follows the global brand, the frame only sets the mode', () => {
    for (const [name, story] of stories) {
      if (name === 'Brands') continue;
      const target = draw(story, 'en');
      expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      target.remove();
    }
  });

  it('Interactive: an arrow changes the slide and shows detail.index in the status text', async () => {
    const story = validation.Interactive as Renderable;
    for (const locale of LOCALES) {
      const target = draw(story, locale);
      const v = translations(locale).carouselValidation;
      const [piece] = await ready(target);
      const status = target.querySelector('output') as HTMLOutputElement;
      expect(status.textContent).toBe(v.statusIdle);
      (piece!.shadowRoot!.querySelector('.arrow-next') as HTMLElement).click();
      expect(status.textContent).toBe(v.statusChanged.replace('{index}', '2'));
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').carouselValidation);
    expect(shape(translations('pt-BR').carouselValidation)).toEqual(source);
    expect(shape(translations('es').carouselValidation)).toEqual(source);
  });
});

describe('nph-carousel documentation — order of the model', () => {
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
        'layouts',
        'controls',
        'keyboard',
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
