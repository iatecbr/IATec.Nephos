/**
 * Contract of the `nph-tree` Documentation page: index with no orphan anchor in all three languages,
 * no leftover placeholder, the `treeDocs` and `treeValidation` dictionaries with the same shape in
 * pt-BR, en and es (`test:i18n` only reads `.md` pairs), and the two "When to use" lists equal to the
 * ones of the sheet.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-tree.json';
import { Documentation } from './nph-tree.docs.stories';
import * as validation from './nph-tree.stories';
import { NphTree } from './nph-tree';

/** Let every tree render and every balloon settle before the page is taken out of the document. */
afterEach(async () => {
  const trees = [...document.querySelectorAll('nph-tree')] as NphTree[];
  await Promise.all(trees.map((piece) => piece.updateComplete));
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

describe('nph-tree Documentation', () => {
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

    it(`${locale}: every tree on the page renders and has an accessible name`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-tree')] as NphTree[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect(piece.getAttribute('label'), piece.outerHTML).toBeTruthy();
      }
    });

    it(`${locale}: the matrix shows the three selections`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const trees = [...matrix.querySelectorAll('nph-tree')] as NphTree[];
      expect(trees.map((piece) => piece.selection)).toEqual(['none', 'single', 'multiple']);
    });

    it(`${locale}: the three required examples, in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark']);
      for (const figure of examples.querySelectorAll('figure[data-nph-color-scheme]')) {
        const trees = [...figure.querySelectorAll('nph-tree')] as NphTree[];
        expect(trees.map((piece) => piece.selection)).toEqual(['single', 'multiple', 'none']);
        expect(trees[1]?.checked.length).toBeGreaterThan(0);
        expect(trees[2]?.items.some((node) => node.error === true)).toBe(true);
        expect(trees[2]?.items.some((node) => node.branch === true && node.children === undefined && node.error !== true)).toBe(true);
      }
    });

    it(`${locale}: the example texts feed every owed text, so no warning is left to say`, () => {
      const target = renderInLocale(locale);
      for (const piece of target.querySelectorAll('nph-tree') as NodeListOf<NphTree>) {
        for (const name of ['label', 'emptyHeading', 'emptyDescription', 'errorText', 'retryText'] as const) {
          expect(piece[name], `${name} ${piece.outerHTML}`).toBeTruthy();
        }
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['treeDocs', 'treeValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key])).toEqual(source);
      expect(shape(translations('es')[key])).toEqual(source);
    }
  });

  it('every story of the Validation page has a claim and a sidebar label in the three languages', () => {
    const stories = Object.keys(validation).filter((name) => name !== 'default');
    expect(stories.length).toBeGreaterThan(0);
    for (const locale of LOCALES) {
      const dictionary = translations(locale);
      for (const name of stories) {
        const id = `components-nph-tree-validation--${name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
        expect(dictionary.validationPages.claims[id as keyof typeof dictionary.validationPages.claims], `${locale} ${id}`).toBeTruthy();
        expect(dictionary.sidebar[id as keyof typeof dictionary.sidebar], `${locale} ${id}`).toBeTruthy();
      }
    }
  });
});

describe('nph-tree Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').treeDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').treeDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});
