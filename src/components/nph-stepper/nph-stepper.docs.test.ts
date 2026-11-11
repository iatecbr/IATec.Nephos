/**
 * Contract of the `nph-stepper` Documentation page: index with no orphan anchor in all three
 * languages, no leftover placeholder, the `stepperDocs` and `stepperValidation` dictionaries with the
 * same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), and the two "When to use" lists
 * equal to the ones of the sheet.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-stepper.json';
import { Documentation } from './nph-stepper.docs.stories';
import * as validation from './nph-stepper.stories';
import { NphStepper } from './nph-stepper';

/** Let every stepper render and every balloon settle before the page is taken out of the document. */
afterEach(async () => {
  const steppers = [...document.querySelectorAll('nph-stepper')] as NphStepper[];
  await Promise.all(steppers.map((stepper) => stepper.updateComplete));
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

describe('nph-stepper Documentation', () => {
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
      /* The Usage markup shows the `{current}` and `{count}` markers of `step-text`, as the consumer writes them. */
      expect(text.replace(/\{(current|count)\}/g, '')).not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every stepper on the page renders and has an accessible name`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-stepper')] as NphStepper[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect(piece.shadowRoot?.querySelector('nav')?.getAttribute('aria-label'), piece.outerHTML).toBeTruthy();
      }
    });

    it(`${locale}: the matrix shows a stepper in its statuses`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const steppers = [...matrix.querySelectorAll('nph-stepper')] as NphStepper[];
      expect(steppers.length).toBeGreaterThanOrEqual(2);
      expect(steppers.some((piece) => piece.steps.some((step) => step.status === 'error'))).toBe(true);
    });

    it(`${locale}: the three required examples, in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark']);
      for (const figure of examples.querySelectorAll('figure[data-nph-color-scheme]')) {
        const steppers = [...figure.querySelectorAll('nph-stepper')] as NphStepper[];
        expect(steppers.map((piece) => [piece.steps.length, piece.current])).toEqual([
          [4, 2],
          [4, 3],
          [3, 2],
        ]);
        expect(steppers[1]?.steps.some((step) => step.status === 'error' && (step.description ?? '') !== '')).toBe(true);
        expect(steppers.every((piece) => !piece.nonLinear)).toBe(true);
      }
    });

    it(`${locale}: the example texts feed every owed text, so no warning is left to say`, () => {
      const target = renderInLocale(locale);
      for (const piece of target.querySelectorAll('nph-stepper') as NodeListOf<NphStepper>) {
        for (const name of ['label', 'completedLabel', 'pendingLabel', 'errorLabel', 'optionalLabel', 'stepText'] as const) {
          expect(piece[name], `${name} ${piece.outerHTML}`).toBeTruthy();
        }
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').stepperDocs);
    expect(shape(translations('pt-BR').stepperDocs)).toEqual(source);
    expect(shape(translations('es').stepperDocs)).toEqual(source);
  });
});

describe('nph-stepper Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').stepperDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').stepperDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-stepper Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  it('the stories are the ones of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(
      ['Brands', 'Content', 'Counts', 'Examples', 'Form', 'Navigation', 'Narrow', 'States', 'Statuses', 'Width'].sort(),
    );
  });

  for (const [name, story] of stories) {
    it(`${name}: every stepper renders and is named, in all three languages`, async () => {
      for (const locale of LOCALES) {
        const target = document.createElement('div');
        document.body.append(target);
        render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
        const pieces = [...target.querySelectorAll('nph-stepper')] as NphStepper[];
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

  it('Statuses: every status shows, in some stepper', () => {
    const target = document.createElement('div');
    document.body.append(target);
    render((validation.Statuses as Renderable).render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
    const steppers = [...target.querySelectorAll('nph-stepper')] as NphStepper[];
    const looks = new Set<string>();
    for (const piece of steppers) {
      piece.steps.forEach((step, index) => {
        looks.add(index + 1 === piece.current ? 'current' : (step.status ?? (index + 1 < piece.current ? 'completed' : 'pending')));
      });
    }
    expect([...looks].sort()).toEqual(['completed', 'current', 'error', 'pending']);
  });

  it('Counts: from two to seven steps', () => {
    const target = document.createElement('div');
    document.body.append(target);
    render((validation.Counts as Renderable).render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
    const steppers = [...target.querySelectorAll('nph-stepper')] as NphStepper[];
    expect(steppers.map((piece) => piece.steps.length)).toEqual([2, 3, 4, 5, 6, 7]);
  });

  it('Navigation: a linear and a non-linear stepper', () => {
    const target = document.createElement('div');
    document.body.append(target);
    render((validation.Navigation as Renderable).render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
    const steppers = [...target.querySelectorAll('nph-stepper')] as NphStepper[];
    expect(steppers.map((piece) => piece.nonLinear)).toEqual([false, true]);
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
      const expected = translations(locale).stepperValidation;
      expect(captions, locale).toEqual([expected.lightCaption, expected.darkCaption]);
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').stepperValidation);
    expect(shape(translations('pt-BR').stepperValidation)).toEqual(source);
    expect(shape(translations('es').stepperValidation)).toEqual(source);
  });
});

describe('nph-stepper documentation — order of the model', () => {
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
        'statuses',
        'navigation',
        'width',
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
