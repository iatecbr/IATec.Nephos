/**
 * Contract of the Documentation page of `nph-label`: index without an orphan
 * anchor in the three languages, no leftover placeholder, every instance
 * rendered and the `labelDocs` dictionary with the same shape in pt-BR, en and
 * es (`test:i18n` only reads `.md` pairs).
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import { Documentation } from './nph-label.docs.stories';
import * as validation from './nph-label.stories';
import type { NphLabel } from './nph-label';

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

describe('nph-label Documentation', () => {
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

    it(`${locale}: every instance renders the label, and those with info the trigger`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-label')] as NphLabel[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.querySelector('label')?.textContent?.trim(), piece.outerHTML).toBeTruthy();
        if (piece.info) {
          expect(piece.querySelector('button'), piece.outerHTML).not.toBeNull();
        }
      }
    });

    it(`${locale}: every label with for names a control on the page`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-label[for]')] as NphLabel[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.querySelector('label')?.control, piece.outerHTML).not.toBeNull();
      }
    });
  }

  it('en and es have the same shape as pt-BR', () => {
    for (const key of ['labelDocs', 'labelValidation'] as const) {
      const source = shape(translations('pt-BR')[key]);
      expect(shape(translations('en')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });
});

describe('nph-label Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Everything the person reads: the page text and the texts passed to the labels. */
  function visibleText(target: HTMLElement): string {
    const attributes = [...target.querySelectorAll('[text], [info], [info-label], [aria-label]')].flatMap((el) =>
      ['text', 'info', 'info-label', 'aria-label'].map((name) => el.getAttribute(name) ?? ''),
    );
    return [target.textContent ?? '', ...attributes].join(' ');
  }

  it('every Validation story reads the dictionary', () => {
    expect(stories.length).toBeGreaterThan(0);
  });

  for (const [name, story] of stories) {
    it(`${name}: in en, no pt-BR text appears`, async () => {
      const target = document.createElement('div');
      document.body.append(target);
      render(story.render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
      await Promise.all([...target.querySelectorAll('nph-label')].map((el) => (el as NphLabel).updateComplete));
      const text = visibleText(target);
      const english = Object.values(translations('en').labelValidation) as string[];
      for (const value of Object.values(translations('pt-BR').labelValidation) as string[]) {
        if (!english.includes(value)) {
          expect(text, value).not.toContain(value);
        }
      }
    });
  }
});

describe('nph-label documentation — order of the Figma frame', () => {
  for (const locale of ['pt-BR', 'en', 'es']) {
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

    it(`${locale}: no anti-patterns section, and one side-by-side use and do-not-use block`, () => {
      const target = renderInLocale(locale);
      expect(target.querySelector('#anti-patterns')).toBeNull();
      const cards = [...target.querySelectorAll('[data-nph-card]')];
      expect(cards.map((card) => card.getAttribute('data-nph-card'))).toEqual(['success', 'error']);
      expect(cards[0]?.parentElement).toBe(cards[1]?.parentElement);
    });
  }
});
