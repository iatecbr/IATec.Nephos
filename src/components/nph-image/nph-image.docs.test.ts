/**
 * Contract of the `nph-image` Documentation page and of its Validation stories: index with
 * no orphan anchor in all three languages, no leftover placeholder, the `imageDocs` and
 * `imageValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only
 * reads `.md` pairs), no text of another language on the English page, the three required
 * examples in light and dark mode, every state and size on some story, and the exact set
 * of Validation stories.
 *
 * The two "When to use" lists of the English dictionary equal the `use_when` and
 * `do_not_use_when` of the generated Metadata, item by item. The page reads them from
 * the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import metadata from '../../shared/metadata/nph-image.json';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import { Documentation } from './nph-image.docs.stories';
import * as validation from './nph-image.stories';
import { NPH_IMAGE_RATIOS, NPH_IMAGE_SIZES } from './nph-image';
import type { NphImage } from './nph-image';

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

/** `value` appears in `text` as a whole run of text, not inside a longer word. */
function containsWhole(text: string, value: string): boolean {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, 'u').test(text);
}

type Piece = NphImage & { updateComplete: Promise<unknown> };

/** Every piece of a target, once drawn, with the images that can arrive already arrived. */
async function drawn(target: HTMLElement): Promise<Piece[]> {
  const pieces = [...target.querySelectorAll('nph-image')] as Piece[];
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  await vi.waitFor(() => {
    for (const piece of pieces) {
      const image = piece.shadowRoot?.querySelector('img');
      /* An image that still has its address travels; the stalled one has none. */
      if (image?.hasAttribute('src')) expect(piece.status).not.toBe('loading');
    }
  });
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  return pieces;
}

describe('nph-image Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-image');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every instance on the page renders`, async () => {
      const pieces = await drawn(renderInLocale(locale));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML.slice(0, 80)).toBe(true);
      }
    });

    it(`${locale}: the matrix shows the four content states, in the order of Figma`, async () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['empty', 'loading', 'loaded', 'error']);
      const pieces = await drawn(matrix);
      expect(pieces.map((piece) => piece.status)).toEqual(['empty', 'loading', 'loaded', 'error']);
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
      const [listItem, cover, upload] = demos as HTMLElement[];
      const expectations: Array<[HTMLElement | undefined, string, string, boolean, boolean]> = [
        [listItem, 'md', '1:1', true, false],
        [cover, 'media', '16:9', true, true],
        [upload, 'lg', '1:1', false, false],
      ];
      for (const [entry, size, ratio, source, named] of expectations) {
        for (const frame of entry?.querySelectorAll('[data-nph-color-scheme]') ?? []) {
          const pieces = [...frame.querySelectorAll('nph-image')];
          expect(pieces).toHaveLength(1);
          expect(pieces[0]?.getAttribute('size')).toBe(size);
          expect((pieces[0] as NphImage).ratio).toBe(ratio);
          expect(pieces[0]?.hasAttribute('src')).toBe(source);
          expect(pieces[0]?.hasAttribute('alt')).toBe(named);
          expect((frame.textContent ?? '').trim()).not.toBe('');
        }
      }
    });

    it(`${locale}: the sizes section shows the six squares and the three ratios of media`, () => {
      const pieces = [...(renderInLocale(locale).querySelector('section#sizes') as HTMLElement).querySelectorAll('nph-image')];
      expect(pieces.map((piece) => `${piece.getAttribute('size')} ${(piece as NphImage).ratio}`)).toEqual([
        ...NPH_IMAGE_SIZES.filter((size) => size !== 'media').map((size) => `${size} 1:1`),
        ...NPH_IMAGE_RATIOS.map((ratio) => `media ${ratio}`),
      ]);
    });

    it(`${locale}: the states section shows the four content states and a clickable image, enabled and disabled`, async () => {
      const section = renderInLocale(locale).querySelector('section#states') as HTMLElement;
      const pieces = await drawn(section);
      expect(pieces.map((piece) => piece.status)).toEqual(['empty', 'loading', 'loaded', 'error', 'loaded', 'loaded']);
      expect(pieces.map((piece) => [piece.interactive, piece.disabled])).toEqual([
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [true, false],
        [true, true],
      ]);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').imageDocs);
    expect(shape(translations('pt-BR').imageDocs)).toEqual(source);
    expect(shape(translations('es').imageDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').imageDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).imageDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('the translated "When to use" lists keep the same number of items as the Metadata', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).imageDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).imageDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-image Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').imageDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').imageDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-image Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `States` is `states`. */
  const idOf = (name: string): string =>
    `components-nph-image-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the six pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Accessibility', 'Brands', 'Interaction', 'Ratios', 'Sizes', 'States']);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      /* The shape of the brand frames is proved in src/shared/tokens/brand-validation.test.ts. */
      if (name === 'Brands') return;
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const schemes = frames.map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes, `${name} ${locale}`).toEqual(['light', 'dark']);
        const expected = translations(locale).imageValidation;
        const captions = [...target.querySelectorAll('figcaption')]
          .filter((el) => frames.includes(el.parentElement as Element))
          .map((el) => el.textContent?.trim() ?? '');
        expect(captions, `${name} ${locale}`).toEqual([expected.lightCaption, expected.darkCaption]);
        target.remove();
      }
    });

    it(`${name}: the title, the claim and the sidebar label are in the dictionary, in every language`, () => {
      for (const locale of LOCALES) {
        const id = idOf(name);
        const label = sidebarLabel(id, locale);
        const claim = translations(locale).validationPages.claims[id];
        expect(label, `${locale} sidebar ${id}`).toBeTruthy();
        expect(claim, `${locale} claim ${id}`).toBeTruthy();
        const target = draw(story, locale);
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-image · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every piece renders and every alt comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).imageValidation));
        const pieces = await drawn(target);
        expect(pieces.length, name).toBeGreaterThan(0);
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML.slice(0, 80)).toBe(true);
          const alt = piece.getAttribute('alt');
          if (alt !== null) {
            expect(allowed.has(alt), `${name} ${locale}: ${alt}`).toBe(true);
          }
        }
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
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

  it('Sizes: each of the seven sizes, with an image and without', () => {
    const target = draw(validation.Sizes as Renderable, 'en');
    const pieces = [...target.querySelectorAll('[data-nph-color-scheme="light"] nph-image')];
    expect(pieces.map((piece) => `${piece.getAttribute('size')} ${piece.hasAttribute('src')}`)).toEqual([
      ...NPH_IMAGE_SIZES.map((size) => `${size} true`),
      ...NPH_IMAGE_SIZES.map((size) => `${size} false`),
    ]);
  });

  it('Ratios: the three ratios of media, and a square size that ignores them', () => {
    const target = draw(validation.Ratios as Renderable, 'en');
    const pieces = [...target.querySelectorAll('[data-nph-color-scheme="light"] nph-image')];
    expect(pieces.map((piece) => `${piece.getAttribute('size')} ${(piece as NphImage).ratio}`)).toEqual([
      ...NPH_IMAGE_RATIOS.map((ratio) => `media ${ratio}`),
      ...NPH_IMAGE_RATIOS.map((ratio) => `media ${ratio}`),
      ...NPH_IMAGE_RATIOS.map((ratio) => `xl ${ratio}`),
    ]);
  });

  it('States: the four content states in each row, in the order of the columns, the loading one held', async () => {
    const target = draw(validation.States as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const pieces = await drawn(frame);
    expect(pieces.map((piece) => piece.status)).toEqual([
      ...['empty', 'loading', 'loaded', 'error'],
      ...['empty', 'loading', 'loaded', 'error'],
      ...['empty', 'loading', 'loaded', 'error'],
    ]);
    /* The held one is really waiting: the spinner is drawn and the frame has no border. */
    for (const piece of pieces.filter((element) => element.status === 'loading')) {
      expect(piece.shadowRoot?.querySelector('nph-spinner')).not.toBeNull();
    }
  });

  it('Interaction: clickable, clickable and disabled, and disabled only, in each row', () => {
    const target = draw(validation.Interaction as Renderable, 'en');
    const pieces = [...target.querySelectorAll('[data-nph-color-scheme="light"] nph-image')] as NphImage[];
    expect(pieces.map((piece) => [piece.interactive, piece.disabled])).toEqual([
      [true, false],
      [true, true],
      [false, true],
      [true, false],
      [true, true],
      [false, true],
    ]);
    for (const piece of pieces) {
      expect(piece.getAttribute('alt')).toBeTruthy();
    }
  });

  it('Accessibility: the images with an alt are named, and the one with the text beside it is hidden', async () => {
    const target = draw(validation.Accessibility as Renderable, 'en');
    const pieces = await drawn(target);
    const named = pieces.filter((piece) => piece.hasAttribute('alt'));
    const hidden = pieces.filter((piece) => !piece.hasAttribute('alt'));
    expect(named.length).toBeGreaterThan(0);
    expect(hidden.length).toBeGreaterThan(0);
    for (const piece of named) {
      if (piece.interactive) {
        expect(piece.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).toBe(piece.getAttribute('alt'));
      } else {
        expect(piece.getAttribute('role')).toBe('img');
        expect(piece.getAttribute('aria-label')).toBe(piece.getAttribute('alt'));
      }
    }
    for (const piece of hidden) {
      expect(piece.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').imageValidation);
    expect(shape(translations('pt-BR').imageValidation)).toEqual(source);
    expect(shape(translations('es').imageValidation)).toEqual(source);
  });
});

describe('nph-image documentation — order of the model', () => {
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
      expect(sections).toEqual(['when-to-use', 'api', 'usage', 'sizes', 'states', 'anatomy', 'accessibility', 'examples', 'references']);
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
