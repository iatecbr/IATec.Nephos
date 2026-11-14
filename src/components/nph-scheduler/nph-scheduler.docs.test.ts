/**
 * Contract of the `nph-scheduler` Documentation page: index with no orphan anchor in all three
 * languages, no leftover placeholder, the `schedulerDocs` and `schedulerValidation` dictionaries with
 * the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), the API table equal to the
 * API of the sheet row by row, the two "When to use" lists equal to the ones of the sheet, and every
 * Validation story and its sidebar label and claim in the dictionary.
 *
 * The labelled views at the top are a stack of figures, not a `matrix`: the region of a matrix scrolls
 * sideways and, in the narrow viewport of the test, the accessibility gate fails the scheduler buttons
 * it cuts. The test pins that no scheduler sits inside a matrix.
 *
 * It does not prove how the piece behaves: that is the job of `nph-scheduler.test.ts`.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-scheduler.json';
import { Documentation } from './nph-scheduler.docs.stories';
import * as validation from './nph-scheduler.stories';
import { NPH_SCHEDULER_LABEL_KEYS, NphScheduler } from './nph-scheduler';
import { PHONE_WIDTH } from './nph-scheduler.demo';

/** Let every scheduler render and settle before the page is taken out of the document. */
afterEach(async () => {
  const pieces = [...document.querySelectorAll('nph-scheduler')] as NphScheduler[];
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

function schedulersOf(target: ParentNode): NphScheduler[] {
  return [...target.querySelectorAll('nph-scheduler')] as NphScheduler[];
}

describe('nph-scheduler Documentation', () => {
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
      /* The API table and the Usage markup show the markers of the labels, as the screen writes them. */
      expect(text.replace(/\{(count|date)\}/g, '')).not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every scheduler on the page renders, with every label owed`, async () => {
      const target = renderInLocale(locale);
      const pieces = schedulersOf(target);
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        for (const key of NPH_SCHEDULER_LABEL_KEYS) {
          expect(piece.labels[key], `${key} ${piece.outerHTML}`).toBeTruthy();
        }
      }
    });

    it(`${locale}: the labelled views at the top show the work week, the month and the phone, in no matrix`, () => {
      const target = renderInLocale(locale);
      expect(target.querySelector('[data-nph-matrix]')).toBeNull();
      const page = target.firstElementChild as HTMLElement;
      const stack = [...page.children].filter((element) => element.tagName !== 'STYLE')[1] as HTMLElement;
      const pieces = schedulersOf(stack);
      expect(pieces.map((piece) => piece.view)).toEqual(['work-week', 'month', 'month']);
      expect([...stack.querySelectorAll('figcaption')].map((caption) => caption.textContent?.trim())).toEqual([
        'view: work-week',
        'view: month',
        `size: phone · width: ${PHONE_WIDTH}`,
      ]);
      expect((pieces[2]?.parentElement as HTMLElement).style.inlineSize).toBe(PHONE_WIDTH);
    });

    it(`${locale}: no scheduler of the page sits in a table`, () => {
      const target = renderInLocale(locale);
      for (const piece of schedulersOf(target)) expect(piece.closest('table'), piece.outerHTML).toBeNull();
    });

    it(`${locale}: the five required examples, in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark']);
      for (const figure of examples.querySelectorAll('figure[data-nph-color-scheme]')) {
        const pieces = schedulersOf(figure);
        expect(pieces.map((piece) => piece.view)).toEqual(['work-week', 'month', 'work-week', 'list', 'month']);
        expect((pieces[1]?.parentElement as HTMLElement).style.inlineSize).toBe(PHONE_WIDTH);
        expect(pieces[2]?.events.length).toBe(0);
        expect(pieces[0]?.events.length).toBeGreaterThan(0);
      }
    });

    it(`${locale}: the API table has one row for each row of the sheet, in the same order`, () => {
      const target = renderInLocale(locale);
      const rows = [...target.querySelectorAll('section#api tbody th')].map((th) => th.textContent?.trim());
      expect(rows).toEqual(Object.keys(metadata.api));
    });

    it(`${locale}: Usage shows the markup of the piece and its import`, () => {
      const target = renderInLocale(locale);
      const rows = [...target.querySelectorAll('section#usage tbody th')].map((th) => th.textContent ?? '');
      expect(rows[0]).toContain('<nph-scheduler');
      expect(rows[0]).toContain('slot="detail"');
      expect(rows[1]).toMatch(/\/nph-scheduler';$/);
    });
  }

  it('the API table of the dictionary names every property, label, event and slot of the sheet', () => {
    const names = translations('en').schedulerDocs.api.map(([name]: [string, string]) => name);
    expect(names).toEqual(Object.keys(metadata.api));
  });

  it('every label of the piece is a row of the API table', () => {
    const names = new Set(translations('en').schedulerDocs.api.map(([name]: [string, string]) => name));
    for (const key of NPH_SCHEDULER_LABEL_KEYS) expect(names.has(`labels.${key}`), key).toBe(true);
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').schedulerDocs);
    expect(shape(translations('pt-BR').schedulerDocs)).toEqual(source);
    expect(shape(translations('es').schedulerDocs)).toEqual(source);
  });

  it('the Usage markup has the same labels in the three languages', () => {
    const keys = (locale: string): string[] =>
      [...(translations(locale).schedulerDocs.usageMarkup as string).matchAll(/(\w+): '/g)].map((found) => found[1] as string);
    expect(keys('en')).toEqual(expect.arrayContaining([...NPH_SCHEDULER_LABEL_KEYS]));
    expect(keys('pt-BR')).toEqual(keys('en'));
    expect(keys('es')).toEqual(keys('en'));
  });
});

describe('nph-scheduler Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').schedulerDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').schedulerDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-scheduler Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** The story id Storybook gives each export, the key of its sidebar label and of its claim. */
  const IDS: Record<string, string> = {
    Brands: 'brands',
    Detail: 'detail',
    Events: 'events',
    Examples: 'examples',
    Focus: 'focus',
    More: 'more',
    Phone: 'phone',
    SidePanel: 'side-panel',
    States: 'states',
    Views: 'views',
    WorkWeek: 'work-week',
  };

  it('the stories are the ones of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(Object.keys(IDS).sort());
  });

  for (const [name, story] of stories) {
    for (const locale of LOCALES) {
      it(`${name}: every scheduler renders in ${locale}`, async () => {
        const target = document.createElement('div');
        document.body.append(target);
        render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
        const pieces = schedulersOf(target);
        await Promise.all(pieces.map((piece) => piece.updateComplete));
        expect(pieces.length, `${name} ${locale}`).toBeGreaterThan(0);
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), `${name} ${locale} ${piece.outerHTML}`).toBe(true);
        }
        target.remove();
      });
    }
  }

  for (const locale of ['en', 'pt-BR', 'es']) {
    it(`${locale}: every story and the two groups have a sidebar label, and every story a claim`, () => {
      const dictionary = translations(locale);
      for (const group of ['components-nph-scheduler-docs', 'components-nph-scheduler-docs--documentation', 'components-nph-scheduler-validation']) {
        expect(dictionary.sidebar[group], group).toBeTruthy();
      }
      for (const id of Object.values(IDS)) {
        const key = `components-nph-scheduler-validation--${id}`;
        expect(dictionary.sidebar[key], key).toBeTruthy();
        expect(dictionary.validationPages.claims[key], key).toBeTruthy();
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
      const expected = translations(locale).schedulerValidation;
      expect(captions, locale).toEqual([expected.lightCaption, expected.darkCaption]);
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').schedulerValidation);
    expect(shape(translations('pt-BR').schedulerValidation)).toEqual(source);
    expect(shape(translations('es').schedulerValidation)).toEqual(source);
  });
});

describe('nph-scheduler documentation — order of the model', () => {
  for (const locale of LOCALES) {
    it(`${locale}: header, labelled views, note and index open the page, in this order`, () => {
      const target = renderInLocale(locale);
      const page = target.firstElementChild as HTMLElement;
      const opening = [...page.children]
        .filter((element) => element.tagName !== 'STYLE')
        .slice(0, 4)
        .map((element) =>
          element.matches('header')
            ? 'header'
            : element.matches('[role="note"]')
              ? 'note'
              : element.matches('nav')
                ? 'index'
                : element.querySelector(':scope > figure > figcaption') !== null
                  ? 'views'
                  : element.tagName.toLowerCase(),
        );
      expect(opening).toEqual(['header', 'views', 'note', 'index']);
    });

    it(`${locale}: the sections follow the model of the current Docs pages, with no anti-patterns section`, () => {
      const target = renderInLocale(locale);
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(sections).toEqual([
        'when-to-use',
        'api',
        'usage',
        'views',
        'event',
        'states',
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
