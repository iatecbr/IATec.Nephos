/**
 * Contract of the Documentation page of `nph-checkbox`: index with no orphan anchor in the
 * three languages, no placeholder left over and the `checkboxDocs` dictionary with the same
 * shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs).
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import { Documentation } from './nph-checkbox.docs.stories';
import * as validation from './nph-checkbox.stories';

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

describe('nph-checkbox Documentation', () => {
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
      const pieces = [...target.querySelectorAll('nph-checkbox')] as Array<HTMLElement & { updateComplete: Promise<unknown> }>;
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
      }
    });
  }

  it('en and es have the same shape as pt-BR', () => {
    const source = shape(translations('pt-BR').checkboxDocs);
    expect(shape(translations('en').checkboxDocs)).toEqual(source);
    expect(shape(translations('es').checkboxDocs)).toEqual(source);
  });
});

describe('nph-checkbox Validation: text only from the dictionary', () => {
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
    const english = flat(translations('en').checkboxValidation);
    return flat(translations('pt-BR').checkboxValidation).filter((value) => !english.includes(value));
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
    const source = shape(translations('pt-BR').checkboxValidation);
    expect(shape(translations('en').checkboxValidation)).toEqual(source);
    expect(shape(translations('es').checkboxValidation)).toEqual(source);
  });
});
