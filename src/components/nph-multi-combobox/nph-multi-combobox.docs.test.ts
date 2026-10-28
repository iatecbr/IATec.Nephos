/**
 * Contract of the `nph-multi-combobox` Documentation page and of its Validation stories: index
 * with no orphan anchor in all three languages, no leftover placeholder, the `size` × state
 * matrix, the three required examples in light and dark mode inside `nph-field`, the chip and
 * the counter sections, the list with checkboxes, the `multiComboboxDocs` and
 * `multiComboboxValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n`
 * only reads `.md` pairs), no text of another language on the English page, and the two "When
 * to use" lists equal to the ones of the sheet. The page reads the lists from the Metadata
 * (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-multi-combobox.json';
import { Documentation } from './nph-multi-combobox.docs.stories';
import * as validation from './nph-multi-combobox.stories';
import type { NphMultiCombobox } from './nph-multi-combobox';

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

async function ready(target: HTMLElement): Promise<NphMultiCombobox[]> {
  const elements = [...target.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>('nph-field, nph-multi-combobox')];
  await Promise.all(elements.map((element) => element.updateComplete));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await Promise.all(elements.map((element) => element.updateComplete));
  return [...target.querySelectorAll('nph-multi-combobox')] as NphMultiCombobox[];
}

/** The text every option row and every chip of every field shows. */
function shownTexts(target: HTMLElement): string[] {
  return [...target.querySelectorAll('nph-multi-combobox')].flatMap((field) => [
    ...[...(field.shadowRoot?.querySelectorAll('nph-option') ?? [])].map((option) => (option.textContent ?? '').trim()),
    ...[...(field.shadowRoot?.querySelectorAll('.chip-label') ?? [])].map((chip) => (chip.textContent ?? '').trim()),
  ]);
}

describe('nph-multi-combobox Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title, and the page is nph-multi-combobox`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-multi-combobox');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every field has a name, and every option and chip a label from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const fields = await ready(target);
      const allowed = new Set(leaves(translations(locale).multiComboboxDocs));
      expect(fields.length).toBeGreaterThan(0);
      for (const field of fields) {
        expect(allowed.has(field.label), field.label).toBe(true);
        expect(allowed.has(field.removeLabel), field.removeLabel).toBe(true);
      }
      for (const text of shownTexts(target)) {
        expect(allowed.has(text), text).toBe(true);
      }
    });

    it(`${locale}: the matrix crosses size with placeholder, chips, counter, error and disabled`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const fields = [...matrix.querySelectorAll('nph-multi-combobox')] as NphMultiCombobox[];
      expect(fields.map((field) => [field.size, field.value.length > 0, field.counter, field.invalid, field.disabled])).toEqual([
        ['default', false, false, false, false],
        ['large', false, false, false, false],
        ['default', true, false, false, false],
        ['large', true, false, false, false],
        ['default', true, true, false, false],
        ['large', true, true, false, false],
        ['default', true, false, true, false],
        ['large', true, false, true, false],
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
        expect(entry.querySelectorAll('nph-field > nph-multi-combobox')).toHaveLength(2);
      }
      const of = (position: number) => [...demos[position]!.querySelectorAll('nph-multi-combobox')] as NphMultiCombobox[];
      const chipCount = (field: NphMultiCombobox): number => field.shadowRoot?.querySelectorAll('.chip').length ?? 0;
      expect(of(0).map((field) => [chipCount(field), field.open])).toEqual([
        [2, false],
        [2, false],
      ]);
      expect(of(1).map((field) => [field.open, field.query !== '', field.shadowRoot?.querySelector('nph-option[marker="checkbox"]') !== null])).toEqual([
        [true, true, true],
        [true, true, true],
      ]);
      for (const field of of(2)) {
        const tops = new Set([...(field.shadowRoot?.querySelectorAll('.chip') ?? [])].map((chip) => Math.round(chip.getBoundingClientRect().top)));
        expect(tops.size).toBeGreaterThan(1);
      }
    });

    it(`${locale}: the chip section shows chips with and without their icon, and the counter section the nph-badge`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const chip = target.querySelector('section#chip') as HTMLElement;
      const fields = [...chip.querySelectorAll('nph-multi-combobox')] as NphMultiCombobox[];
      expect(fields.map((field) => field.chipIcon)).toEqual([false, true]);
      const icons = [...(fields[1]?.shadowRoot?.querySelectorAll('.chip-icon') ?? [])].map((icon) => (icon as HTMLElement & { name: string }).name);
      expect(icons.at(-1)).toBe('tag');
      const counter = target.querySelector('section#counter') as HTMLElement;
      const field = counter.querySelector('nph-multi-combobox') as NphMultiCombobox;
      expect(field.counter).toBe(true);
      expect(field.shadowRoot?.querySelector('nph-badge')).not.toBeNull();
      expect(field.shadowRoot?.querySelector('.subject')?.textContent?.trim()).toBe(translations(locale).multiComboboxDocs.subject);
    });

    it(`${locale}: the list section names its states and shows the checked options, the groups and the empty list`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const section = target.querySelector('section#list') as HTMLElement;
      const text = section.textContent ?? '';
      for (const [state] of translations(locale).multiComboboxDocs.listStates as Array<[string, string]>) {
        expect(text, state).toContain(state);
      }
      const fields = [...section.querySelectorAll('nph-multi-combobox')] as NphMultiCombobox[];
      expect(fields.some((field) => field.shadowRoot?.querySelector('.match') !== null)).toBe(true);
      expect(fields.some((field) => field.shadowRoot?.querySelector('.group-label') !== null)).toBe(true);
      expect(fields.some((field) => field.shadowRoot?.querySelector('nph-empty') !== null)).toBe(true);
    });

    it(`${locale}: the accessibility section names the role, the several choices and the pointer to the active option`, () => {
      const target = renderInLocale(locale);
      const text = (target.querySelector('section#accessibility') as HTMLElement).textContent ?? '';
      expect(text).toContain('combobox');
      expect(text).toContain('aria-multiselectable');
      expect(text).toContain('aria-activedescendant');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['multiComboboxDocs', 'multiComboboxValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').multiComboboxDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).multiComboboxDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-multi-combobox Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').multiComboboxDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').multiComboboxDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).multiComboboxDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).multiComboboxDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the API of the page names every property and event of the sheet', () => {
    const named = translations('en').multiComboboxDocs.api.flatMap(([terms]: [string, string]) => terms.split(',').map((term: string) => term.trim()));
    for (const property of Object.keys(metadata.api)) {
      expect(named, property).toContain(property);
    }
  });
});

describe('nph-multi-combobox Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `ListStates` is `list-states`. */
  const idOf = (name: string): string =>
    `components-nph-multi-combobox-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the six pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Chip', 'Examples', 'FormAssociation', 'InvalidInput', 'ListStates', 'Matrix']);
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-multi-combobox · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every visible text comes from the dictionary, in light and in dark mode`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(leaves(translations(locale).multiComboboxValidation));
        await ready(target);
        for (const field of target.querySelectorAll('nph-multi-combobox') as NodeListOf<NphMultiCombobox>) {
          for (const value of [field.label, field.placeholder, field.removeLabel, field.subject]) {
            if (value !== '') {
              expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
            }
          }
        }
        for (const text of shownTexts(target)) {
          expect(allowed.has(text), `${name} ${locale}: ${text}`).toBe(true);
        }
        const schemes = new Set([...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme')));
        expect([...schemes].sort(), name).toEqual(['dark', 'light']);
        expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('ListStates draws the list open, with checked options, the highlight, the groups and the empty state', async () => {
    const target = draw(validation.ListStates as unknown as Renderable, 'en');
    const fields = await ready(target);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const has = (selector: string): boolean => fields.some((field) => field.shadowRoot?.querySelector(selector) !== null);
    expect(fields.every((field) => field.open)).toBe(true);
    for (const selector of ['nph-option[marker="checkbox"]', '.match', '.group-label', 'nph-empty']) {
      expect(has(selector), selector).toBe(true);
    }
  });
});
