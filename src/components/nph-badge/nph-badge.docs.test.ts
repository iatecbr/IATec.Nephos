/**
 * Contract of the `nph-badge` Documentation page: index with no orphan anchor in
 * all three languages, no leftover placeholder, and the `badgeDocs` dictionary with the same
 * shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs).
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import { Documentation } from './nph-badge.docs.stories';
import * as validation from './nph-badge.stories';

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

describe('nph-badge documentation', () => {
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

    it(`${locale}: every instance on the page renders`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-badge')] as Array<HTMLElement & { updateComplete: Promise<unknown> }>;
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
      }
    });
  }

  it('en and es have the same shape as pt-BR', () => {
    const source = shape(translations('pt-BR').badgeDocs);
    expect(shape(translations('en').badgeDocs)).toEqual(source);
    expect(shape(translations('es').badgeDocs)).toEqual(source);
  });
});

describe('nph-badge validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Everything the person reads: the page text and the texts passed to the pieces. */
  function visibleText(target: HTMLElement): string {
    const attributes = [...target.querySelectorAll('[text], [label], [aria-label]')].flatMap((el) =>
      ['text', 'label', 'aria-label'].map((name) => el.getAttribute(name) ?? ''),
    );
    return [target.textContent ?? '', ...attributes].join(' ');
  }

  /** The pt-BR texts that do not exist in en, flattened. */
  function portugueseOnly(): string[] {
    const flat = (value: unknown): string[] =>
      Array.isArray(value) ? value.flatMap(flat) : typeof value === 'object' && value !== null ? Object.values(value).flatMap(flat) : [String(value)];
    const english = flat(translations('en').badgeValidation);
    return flat(translations('pt-BR').badgeValidation).filter((value) => !english.includes(value));
  }

  it('every Validation story reads the dictionary', () => {
    expect(stories.length).toBeGreaterThan(0);
    expect(portugueseOnly().length).toBeGreaterThan(0);
  });

  for (const [name, story] of stories) {
    it(`${name}: in en, no pt-BR text appears`, () => {
      const target = document.createElement('div');
      document.body.append(target);
      render(story.render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
      const text = visibleText(target);
      for (const value of portugueseOnly()) {
        expect(text, value).not.toContain(value);
      }
    });
  }

  it('en and es have the same shape as pt-BR', () => {
    const source = shape(translations('pt-BR').badgeValidation);
    expect(shape(translations('en').badgeValidation)).toEqual(source);
    expect(shape(translations('es').badgeValidation)).toEqual(source);
  });
});

describe('nph-badge documentation — order of the Figma frame', () => {
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
