/**
 * Contract of the `nph-combobox` Documentation page and of its Validation stories: index with
 * no orphan anchor in all three languages, no leftover placeholder, the `size` × state matrix,
 * the three required examples in light and dark mode inside `nph-field`, the seven list states,
 * the `comboboxDocs` and `comboboxValidation` dictionaries with the same shape in pt-BR, en and
 * es (`test:i18n` only reads `.md` pairs), no text of another language on the English page, and
 * the two "When to use" lists equal to the ones of the sheet. The page reads the lists from the
 * Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-combobox.json';
import { Documentation } from './nph-combobox.docs.stories';
import * as validation from './nph-combobox.stories';
import type { NphCombobox } from './nph-combobox';

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

async function ready(target: HTMLElement): Promise<NphCombobox[]> {
  const elements = [...target.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>('nph-field, nph-combobox')];
  await Promise.all(elements.map((element) => element.updateComplete));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await Promise.all(elements.map((element) => element.updateComplete));
  return [...target.querySelectorAll('nph-combobox')] as NphCombobox[];
}

/** The text every option row of every combobox shows, except the create row, which joins two texts. */
function optionTexts(target: HTMLElement): string[] {
  return [...target.querySelectorAll('nph-combobox')].flatMap((combobox) =>
    [...(combobox.shadowRoot?.querySelectorAll('nph-option:not(.create)') ?? [])].map((option) => (option.textContent ?? '').trim()),
  );
}

describe('nph-combobox Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title, and the page is nph-combobox`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-combobox');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every combobox has a name and every option a label from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const comboboxes = await ready(target);
      const allowed = new Set(leaves(translations(locale).comboboxDocs));
      expect(comboboxes.length).toBeGreaterThan(0);
      for (const combobox of comboboxes) {
        expect(allowed.has(combobox.label), combobox.label).toBe(true);
      }
      for (const text of optionTexts(target)) {
        expect(allowed.has(text), text).toBe(true);
      }
    });

    it(`${locale}: the matrix crosses size with placeholder, value with the clear button, error and disabled`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const comboboxes = [...matrix.querySelectorAll('nph-combobox')] as NphCombobox[];
      expect(comboboxes.map((combobox) => [combobox.size, combobox.value !== '', combobox.clearable, combobox.invalid, combobox.disabled])).toEqual([
        ['default', false, false, false, false],
        ['large', false, false, false, false],
        ['default', true, true, false, false],
        ['large', true, true, false, false],
        ['default', false, false, true, false],
        ['large', false, false, true, false],
        ['default', true, false, false, true],
        ['large', true, false, false, true],
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
        expect(entry.querySelectorAll('nph-field > nph-combobox')).toHaveLength(2);
      }
      const of = (position: number) => [...demos[position]!.querySelectorAll('nph-combobox')] as NphCombobox[];
      expect(of(0).map((combobox) => [combobox.value !== '', combobox.clearable, combobox.open])).toEqual([
        [true, true, false],
        [true, true, false],
      ]);
      expect(of(1).map((combobox) => [combobox.open, combobox.query !== '', combobox.shadowRoot?.querySelector('.match') !== null])).toEqual([
        [true, true, true],
        [true, true, true],
      ]);
      expect(of(2).map((combobox) => [combobox.open, combobox.loading, combobox.shadowRoot?.querySelector('nph-spinner') !== null])).toEqual([
        [true, true, true],
        [true, true, true],
      ]);
    });

    it(`${locale}: the list section names the seven states and the shortcuts, and shows the search, status, groups and empty lists`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const section = target.querySelector('section#list') as HTMLElement;
      const text = section.textContent ?? '';
      const states = translations(locale).comboboxDocs.listStates.map(([state]: [string, string]) => state);
      expect(states).toHaveLength(8);
      for (const state of states) {
        expect(text, state).toContain(state);
      }
      const comboboxes = [...section.querySelectorAll('nph-combobox')] as NphCombobox[];
      expect(comboboxes.some((combobox) => combobox.shadowRoot?.querySelector('.match') !== null)).toBe(true);
      expect(comboboxes.some((combobox) => combobox.shadowRoot?.querySelector('nph-option[start="dot"]') !== null)).toBe(true);
      expect(comboboxes.some((combobox) => combobox.shadowRoot?.querySelector('.group-label') !== null)).toBe(true);
      expect(comboboxes.some((combobox) => combobox.shadowRoot?.querySelector('nph-empty') !== null)).toBe(true);
    });

    it(`${locale}: the accessibility section names the role, the pointer to the active option and the live region`, () => {
      const target = renderInLocale(locale);
      const text = (target.querySelector('section#accessibility') as HTMLElement).textContent ?? '';
      expect(text).toContain('combobox');
      expect(text).toContain('aria-activedescendant');
      expect(text).toContain('color/muted-foreground');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['comboboxDocs', 'comboboxValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').comboboxDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).comboboxDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-combobox Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').comboboxDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').comboboxDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).comboboxDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).comboboxDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the API of the page names every property, slot and event of the sheet', () => {
    const named = translations('en').comboboxDocs.api.flatMap(([terms]: [string, string]) =>
      terms.split(',').map((term: string) => term.trim().replace(/^slot /, '')),
    );
    for (const property of Object.keys(metadata.api)) {
      expect(named, property).toContain(property);
    }
  });
});

describe('nph-combobox Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `ListStates` is `list-states`. */
  const idOf = (name: string): string =>
    `components-nph-combobox-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the seven pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Brands', 'Examples', 'FormAssociation', 'InvalidInput', 'ListStates', 'Matrix', 'Start']);
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-combobox · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every visible text comes from the dictionary, in light and in dark mode`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(leaves(translations(locale).comboboxValidation));
        await ready(target);
        for (const combobox of target.querySelectorAll('nph-combobox') as NodeListOf<NphCombobox>) {
          for (const value of [combobox.label, combobox.placeholder]) {
            if (value !== '') {
              expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
            }
          }
        }
        for (const text of optionTexts(target)) {
          expect(allowed.has(text), `${name} ${locale}: ${text}`).toBe(true);
        }
        /* The shape of the brand frames is proved in src/shared/tokens/brand-validation.test.ts. */
        if (name !== 'Brands') {
          const schemes = new Set([...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme')));
          expect([...schemes].sort(), name).toEqual(['dark', 'light']);
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

  it('ListStates draws the seven states of the list and the shortcuts footer', async () => {
    const target = draw(validation.ListStates as unknown as Renderable, 'en');
    const comboboxes = await ready(target);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const has = (selector: string): boolean => comboboxes.some((combobox) => combobox.shadowRoot?.querySelector(selector) !== null);
    expect(comboboxes.every((combobox) => combobox.open)).toBe(true);
    for (const selector of ['.match', 'nph-option[start="dot"]', '.group-label', 'nph-spinner', 'nph-option.create', 'nph-empty', '.footer:not([hidden])']) {
      expect(has(selector), selector).toBe(true);
    }
  });
});
