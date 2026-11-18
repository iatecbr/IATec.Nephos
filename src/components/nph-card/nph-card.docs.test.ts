/**
 * Contract of the `nph-card` Documentation page and of its Validation stories: index with no orphan anchor in all three
 * languages, no leftover placeholder, the `cardDocs` and `cardValidation` dictionaries with the same shape in pt-BR, en
 * and es (`test:i18n` only reads `.md` pairs), no text of another language on the English page, the order of the page,
 * the five required examples in light and dark mode, and the two "When to use" lists equal to the ones of the sheet
 * (page and sheet match, with no item dropped). The page reads the lists from the Metadata (P71), and
 * `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-card.json';
import { Documentation } from './nph-card.docs.stories';
import * as validation from './nph-card.stories';
import type { NphCard } from './nph-card';

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

/** `value` appears in `text` as a whole run of text, not inside a longer word (`Criterio` is not in `Criterion`). */
function containsWhole(text: string, value: string): boolean {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, 'u').test(text);
}

type Card = NphCard & { updateComplete: Promise<unknown> };

async function ready(target: HTMLElement): Promise<Card[]> {
  const cards = [...target.querySelectorAll('nph-card')] as Card[];
  await Promise.all(cards.map((card) => card.updateComplete));
  return cards;
}

describe('nph-card Documentation', () => {
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
      for (const title of titles) expect(title).not.toBe('');
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-card');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every nph-card on the page draws`, async () => {
      const target = renderInLocale(locale);
      const cards = await ready(target);
      expect(cards.length).toBeGreaterThan(0);
      for (const card of cards) expect(card.hasAttribute('data-nph-rendered'), card.outerHTML).toBe(true);
    });

    it(`${locale}: the matrix shows the three types`, async () => {
      const target = renderInLocale(locale);
      const cards = await ready(target.querySelector('[data-nph-matrix]') as HTMLElement);
      expect(cards.map((card) => card.type)).toEqual(['base', 'clickable', 'section']);
    });

    it(`${locale}: the five required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(5);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll(':scope > div > figure[data-nph-color-scheme], :scope > div [data-nph-color-scheme]')].map((el) =>
          el.getAttribute('data-nph-color-scheme'),
        );
        expect(schemes).toEqual(['light', 'dark']);
      }
      const light = demos.map((entry) => entry.querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
      const shown = light.map((frame) => ({
        cards: frame.querySelectorAll('nph-card').length,
        types: [...new Set([...frame.querySelectorAll<NphCard>('nph-card')].map((card) => card.type))],
      }));
      expect(shown).toEqual([
        { cards: 1, types: ['base'] },
        { cards: 3, types: ['clickable'] },
        { cards: 1, types: ['section'] },
        { cards: 1, types: ['base'] },
        { cards: 1, types: ['base'] },
      ]);
      await ready(target);
    });

    it(`${locale}: the accessibility section names the link, the region, aria-busy and the target size`, () => {
      const section = renderInLocale(locale).querySelector('section#accessibility') as HTMLElement;
      const text = section.textContent ?? '';
      expect(text).toContain('aria-busy');
      expect(text).toContain('28 px');
      expect(text).toContain('36 px');
      expect(text).toContain('Enter');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').cardDocs);
    expect(shape(translations('pt-BR').cardDocs)).toEqual(source);
    expect(shape(translations('es').cardDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').cardDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).cardDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-card Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').cardDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').cardDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).cardDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).cardDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-card Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `Densities` is `densities`. */
  const idOf = (name: string): string => `components-nph-card-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the ten pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'Brands',
      'Collection',
      'Densities',
      'Examples',
      'Media',
      'Parts',
      'Section',
      'Start',
      'States',
      'Types',
    ]);
  });

  it('Types: the three types in the two surfaces, in both modes', async () => {
    const target = draw(validation.Types as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const cards = await ready(frame);
    expect(cards.map((card) => `${card.type} ${card.surface}`)).toEqual([
      'base elevated',
      'clickable elevated',
      'section elevated',
      'base outlined',
      'clickable outlined',
      'section outlined',
    ]);
  });

  it('Media: the four media options on the base and the clickable type', async () => {
    const target = draw(validation.Media as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const cards = await ready(frame);
    expect(cards.map((card) => `${card.type} ${card.media}`)).toEqual([
      'base top',
      'base inset-top',
      'base side',
      'base side',
      'clickable top',
      'clickable inset-top',
      'clickable side',
      'clickable side',
    ]);
  });

  it('Start: the icon, the avatar and the image, in both densities', async () => {
    const target = draw(validation.Start as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const cards = await ready(frame);
    expect(cards.map((card) => [card.density, card.icon !== '', card.querySelector('nph-avatar') !== null, card.querySelector('nph-image') !== null])).toEqual([
      ['default', true, false, false],
      ['default', false, true, false],
      ['default', false, false, true],
      ['compact', true, false, false],
      ['compact', false, true, false],
      ['compact', false, false, true],
    ]);
  });

  it('States: default and loading on the three types, disabled on the clickable one only', async () => {
    const target = draw(validation.States as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const cards = await ready(frame);
    expect(cards.map((card) => [card.type, card.loading ? 'loading' : card.disabled ? 'disabled' : 'default'])).toEqual([
      ['base', 'default'],
      ['clickable', 'default'],
      ['section', 'default'],
      ['base', 'loading'],
      ['clickable', 'loading'],
      ['section', 'loading'],
      ['clickable', 'disabled'],
    ]);
  });

  it('Collection: a named list with one li per card, the title of each a heading with the link inside', async () => {
    const target = draw(validation.Collection as Renderable, 'en');
    const lists = [...target.querySelectorAll('ul[aria-label]')];
    expect(lists).toHaveLength(4);
    for (const list of lists) {
      const items = [...list.querySelectorAll(':scope > li')];
      expect(items).toHaveLength(3);
      for (const item of items) expect(item.querySelectorAll('nph-card')).toHaveLength(1);
    }
    const [card] = await ready(target);
    const heading = card!.shadowRoot!.querySelector('[role="heading"]');
    expect(heading?.getAttribute('aria-level')).toBe('3');
    expect(heading?.querySelector('a[href]')).not.toBeNull();
  });

  it('Examples: the five required examples and the nested one, each in both modes', async () => {
    const target = draw(validation.Examples as Renderable, 'en');
    const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
    expect(frames).toHaveLength(12);
    await ready(target);
  });

  it('Brands: the seven brands in light and dark, the cards inside every frame', () => {
    const target = draw(validation.Brands as Renderable, 'en');
    const frames = [...target.querySelectorAll('[data-nph-brand-frame]')];
    expect(frames).toHaveLength(14);
    for (const frame of frames) expect(frame.querySelectorAll('nph-card').length).toBe(2);
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-card · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every card renders and every text comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(leaves(translations(locale).cardValidation));
        const cards = await ready(target);
        expect(cards.length, name).toBeGreaterThan(0);
        for (const card of cards) {
          expect(card.hasAttribute('data-nph-rendered'), card.outerHTML).toBe(true);
          expect(allowed.has(card.heading), `${name} ${locale}: ${card.heading}`).toBe(true);
          if (card.description !== '') expect(allowed.has(card.description), `${name} ${locale}: ${card.description}`).toBe(true);
          if (card.loadingLabel !== '') expect(allowed.has(card.loadingLabel), `${name} ${locale}: ${card.loadingLabel}`).toBe(true);
          for (const piece of card.querySelectorAll('nph-button')) {
            for (const attribute of ['text', 'label']) {
              const value = piece.getAttribute(attribute);
              if (value !== null) expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
            }
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

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').cardValidation);
    expect(shape(translations('pt-BR').cardValidation)).toEqual(source);
    expect(shape(translations('es').cardValidation)).toEqual(source);
  });
});

describe('nph-card documentation — order of the model', () => {
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
      expect(sections).toEqual(['when-to-use', 'api', 'usage', 'types', 'media', 'states', 'anatomy', 'accessibility', 'examples', 'references']);
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
