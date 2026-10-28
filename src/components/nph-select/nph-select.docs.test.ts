/**
 * Contract of the `nph-select` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, the `size` × state matrix, the
 * three required examples in light and dark mode inside `nph-field`, the `selectDocs` and
 * `selectValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads
 * `.md` pairs), no text of another language on the English page, and the two "When to use" lists
 * equal to the ones of the sheet. The page reads the lists from the Metadata (P71), and
 * `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-select.json';
import optionMetadata from '../../shared/metadata/nph-option.json';
import { Documentation } from './nph-select.docs.stories';
import * as validation from './nph-select.stories';
import type { NphSelect } from './nph-select';

afterEach(() => {
  document.body.replaceChildren();
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

/** `value` appears in `text` as a whole run of text, not inside a longer word. */
function containsWhole(text: string, value: string): boolean {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, 'u').test(text);
}

async function ready(target: HTMLElement): Promise<NphSelect[]> {
  const elements = [...target.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>('nph-field, nph-select, nph-option')];
  await Promise.all(elements.map((element) => element.updateComplete));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await Promise.all(elements.map((element) => element.updateComplete));
  return [...target.querySelectorAll('nph-select')] as NphSelect[];
}

/** The text an option shows: its label, from the dictionary. */
function optionTexts(target: HTMLElement): string[] {
  return [...target.querySelectorAll('nph-option')].map((option) => (option.textContent ?? '').trim());
}

describe('nph-select Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title, and the page is nph-select`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-select');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every select has a name and every option a label from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const selects = await ready(target);
      const allowed = new Set(leaves(translations(locale).selectDocs));
      expect(selects.length).toBeGreaterThan(0);
      for (const select of selects) {
        expect(allowed.has(select.label), select.label).toBe(true);
      }
      for (const text of optionTexts(target)) {
        expect(allowed.has(text), text).toBe(true);
      }
    });

    it(`${locale}: the matrix crosses size with placeholder, value, error and disabled`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const selects = [...matrix.querySelectorAll('nph-select')] as NphSelect[];
      expect(selects.map((select) => [select.size, select.value !== '', select.invalid, select.disabled])).toEqual([
        ['default', false, false, false],
        ['large', false, false, false],
        ['default', true, false, false],
        ['large', true, false, false],
        ['default', false, true, false],
        ['large', false, true, false],
        ['default', true, false, true],
        ['large', true, false, true],
      ]);
    });

    it(`${locale}: the three required examples in nph-field, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#required-examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
        expect(entry.querySelectorAll('nph-field > nph-select')).toHaveLength(2);
      }
      const selectsOf = (position: number) => [...demos[position]!.querySelectorAll('nph-select')] as NphSelect[];
      expect(selectsOf(0).map((select) => [select.start, select.value])).toEqual([
        ['none', ''],
        ['none', ''],
      ]);
      expect(selectsOf(1).map((select) => [select.start, select.open, select.value !== ''])).toEqual([
        ['avatar', true, true],
        ['avatar', true, true],
      ]);
      expect(selectsOf(2).map((select) => [select.required, select.invalid, select.value])).toEqual([
        [true, true, ''],
        [true, true, ''],
      ]);
    });

    it(`${locale}: the option section shows the four starts and the dot in every state`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const section = target.querySelector('section#option') as HTMLElement;
      const starts = new Set([...section.querySelectorAll('nph-option')].map((option) => option.getAttribute('start') ?? 'none'));
      expect([...starts].sort()).toEqual(['avatar', 'dot', 'icon', 'none']);
      const statuses = [...section.querySelectorAll('nph-option[start="dot"]')].map((option) => option.getAttribute('status'));
      expect(statuses.sort()).toEqual(['error', 'help', 'info', 'neutral', 'success', 'warning']);
    });

    it(`${locale}: the accessibility section names the role, the pointer to the active option and the contrast`, () => {
      const target = renderInLocale(locale);
      const text = (target.querySelector('section#accessibility') as HTMLElement).textContent ?? '';
      expect(text).toContain('combobox');
      expect(text).toContain('aria-activedescendant');
      expect(text).toMatch(/4[.,]78:1/);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['selectDocs', 'selectValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').selectDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).selectDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-select Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').selectDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').selectDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).selectDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).selectDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the option has a sheet of its own, and the option API of the page names every property of it', () => {
    expect(optionMetadata.piece).toBe('nph-option');
    const named = translations('en')
      .selectDocs.optionApi.flatMap(([terms]: [string, string]) => terms.split(',').map((term: string) => term.trim()));
    for (const property of Object.keys(optionMetadata.api)) {
      expect(named, property).toContain(property);
    }
  });
});

describe('nph-select Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `ListHeight` is `list-height`. */
  const idOf = (name: string): string =>
    `components-nph-select-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the ten pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'Brands',
      'Examples',
      'FormAssociation',
      'InvalidInput',
      'ListHeight',
      'Matrix',
      'Open',
      'Option',
      'Start',
      'TextOverflow',
    ]);
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-select · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every visible text comes from the dictionary, in light and in dark mode`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(leaves(translations(locale).selectValidation));
        await ready(target);
        for (const select of target.querySelectorAll('nph-select') as NodeListOf<NphSelect>) {
          for (const value of [select.label, select.placeholder]) {
            if (value !== '') {
              expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
            }
          }
        }
        for (const text of optionTexts(target)) {
          expect(allowed.has(text), `${name} ${locale}: ${text}`).toBe(true);
        }
        const schemes = new Set([...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme')));
        expect([...schemes].sort(), name).toEqual(['dark', 'light']);
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
          expect(frame.hasAttribute('data-nph-color-scheme'), name).toBe(true);
          expect(frame.hasAttribute('data-nph-brand-frame'), name).toBe(true);
        }
      } else {
        expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      }
      target.remove();
    }
  });
});
