/**
 * Contract of the `nph-icon` Documentation page and of the Validation texts:
 * index with no orphan anchor, in the three languages, and the current rule of
 * `solid` (spec `nph-icon`: regular and solid exist for every core name).
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { format, translations } from '../../../.storybook/i18n/index.js';
import { Documentation, IconsOverview } from './nph-icon.docs.stories';
import { CATEGORIES, CORE_TOTAL } from './nph-icon.demo';

afterEach(() => {
  document.body.replaceChildren();
});

const DICTIONARIES = { 'pt-BR': translations('pt-BR'), en: translations('en'), es: translations('es') } as const;

/** Old restriction of solid to star, in any order within the sentence. */
const SOLID_ONLY_ON_STAR = /solid[^.]*\bstar\b|\bstar\b[^.]*solid/i;

function renderInLocale(locale: string, story: { render?: unknown } = Documentation): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  const draw = story.render as (args: unknown, context: unknown) => TemplateResult;
  render(draw({}, { globals: { locale: locale } }), target);
  return target;
}

describe('Documentation — index', () => {
  for (const locale of Object.keys(DICTIONARIES)) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const targets = [...target.querySelectorAll('nav a')].map((a) =>
        (a.getAttribute('href') ?? '').replace(/^#/, ''),
      );
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);

      expect(targets.length).toBeGreaterThan(0);
      for (const id of targets) {
        expect(target.querySelector(`#${id}`), `anchor #${id}`).not.toBeNull();
      }
      expect([...sections].sort()).toEqual([...targets].sort());
    });
  }
});

describe('current rule of solid in the texts', () => {
  for (const [locale, dictionary] of Object.entries(DICTIONARIES)) {
    it(`${locale}: no text restricts solid to star`, () => {
      const d = dictionary.docs;
      const v = dictionary.validation;
      const variant = d.api.find(([term]: [string, string]) => term === 'variant');
      expect(variant).toBeDefined();

      const texts = [
        variant?.[1] ?? '',
        d.coreRule,
        d.invalidText,
        v.variantsRegular,
        v.variantsSolid,
        v.variantsNote,
        ...v.invalidCases,
      ];
      for (const text of texts) {
        expect(text, text).not.toMatch(SOLID_ONLY_ON_STAR);
      }
    });

    it(`${locale}: the second invalid-input case describes a nonexistent variant`, () => {
      expect(dictionary.validation.invalidCases[1]).toMatch(/variant/i);
    });
  }
});

describe('number placeholders in the texts', () => {
  /** `{nome}` placeholder that `format()` did not fill. */
  const LEFTOVER_MARKER = /\{\w+\}/;

  for (const [locale, dictionary] of Object.entries(DICTIONARIES)) {
    it(`${locale}: Documentation shows the numbers and leaves no placeholder`, () => {
      const target = renderInLocale(locale);
      const d = dictionary.docs;
      const page = target.textContent ?? '';

      expect(page).not.toMatch(LEFTOVER_MARKER);
      expect(page).toContain(format(d.coreTitle, { total: CORE_TOTAL }));
      const name = d.api.find(([term]: [string, string]) => term === 'name');
      expect(page).toContain(format(name?.[1] ?? '', { total: CORE_TOTAL }));
      expect(name?.[1]).toContain('{total}');
      for (const category of CATEGORIES) {
        expect(page).toContain(format(d.coreCount, { count: category.length }));
      }
    });

    it(`${locale}: Icons Overview shows the counter and leaves no placeholder`, () => {
      const target = renderInLocale(locale, IconsOverview);
      const counter = target.querySelector('[data-nph-counter]')?.textContent?.trim();

      expect(target.textContent ?? '').not.toMatch(LEFTOVER_MARKER);
      expect(counter).toBe(format(dictionary.gallery.counter, { found: CORE_TOTAL, total: CORE_TOTAL }));
      expect(counter).toContain(String(CORE_TOTAL));
    });
  }
});

describe('nph-icon documentation — order of the Figma frame', () => {
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
