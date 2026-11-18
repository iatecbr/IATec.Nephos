/**
 * Contract of the `nph-date-picker` Documentation page and of the Validation stories of `nph-date-picker` and `nph-calendar`: index with
 * no orphan anchor in all three languages, no leftover placeholder, the `datePickerDocs`, `datePickerValidation` and `calendarValidation`
 * dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of another language on the English
 * page, the three required examples in light and dark mode, and the two "When to use" lists equal to the ones of the sheet. The page reads
 * the lists from the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { LOCALES, sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-date-picker.json';
import * as calendarStories from '../nph-calendar/nph-calendar.stories';
import { Documentation } from './nph-date-picker.docs.stories';
import * as validation from './nph-date-picker.stories';
import type { NphDatePicker } from './nph-date-picker';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const LOCALE_VALUES = ['pt-BR', 'en', 'es'] as const;

type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };

function draw(story: Renderable, locale: string): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
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

function leaves(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(leaves);
  if (value !== null && typeof value === 'object') return Object.values(value).flatMap(leaves);
  return [];
}

function containsWhole(text: string, value: string): boolean {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, 'u').test(text);
}

type Picker = NphDatePicker & { updateComplete: Promise<unknown> };

async function ready(target: HTMLElement): Promise<Picker[]> {
  const pickers = [...target.querySelectorAll('nph-date-picker')] as Picker[];
  await Promise.all(pickers.map((picker) => picker.updateComplete));
  return pickers;
}

describe('nph-date-picker Documentation', () => {
  for (const locale of LOCALE_VALUES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = draw(Documentation as unknown as Renderable, locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title`, () => {
      const target = draw(Documentation as unknown as Renderable, locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) expect(title).not.toBe('');
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-date-picker');
    });

    it(`${locale}: no {name} placeholder is left on the page, outside the code samples`, () => {
      const target = draw(Documentation as unknown as Renderable, locale);
      expect(target.textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every nph-date-picker on the page draws`, async () => {
      const target = draw(Documentation as unknown as Renderable, locale);
      const pickers = await ready(target);
      expect(pickers.length).toBeGreaterThan(0);
      for (const picker of pickers) expect(picker.hasAttribute('data-nph-rendered'), picker.outerHTML).toBe(true);
    });

    it(`${locale}: the matrix shows the two modes`, async () => {
      const target = draw(Documentation as unknown as Renderable, locale);
      const pickers = await ready(target.querySelector('[data-nph-matrix]') as HTMLElement);
      expect(pickers.map((picker) => picker.mode)).toEqual(['single', 'range']);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, async () => {
      const target = draw(Documentation as unknown as Renderable, locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
      }
      await ready(target);
    });

    it(`${locale}: the accessibility section names the dialog, the grid and the focus`, () => {
      const section = draw(Documentation as unknown as Renderable, locale).querySelector('section#accessibility') as HTMLElement;
      const text = section.textContent ?? '';
      expect(text).toContain('aria-disabled');
      expect(text).toContain('Page Up');
      expect(text).toContain('44');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').datePickerDocs);
    expect(shape(translations('pt-BR').datePickerDocs)).toEqual(source);
    expect(shape(translations('es').datePickerDocs)).toEqual(source);
    const validationShape = shape(translations('en').datePickerValidation);
    expect(shape(translations('pt-BR').datePickerValidation)).toEqual(validationShape);
    expect(shape(translations('es').datePickerValidation)).toEqual(validationShape);
    const calendarShape = shape(translations('en').calendarValidation);
    expect(shape(translations('pt-BR').calendarValidation)).toEqual(calendarShape);
    expect(shape(translations('es').calendarValidation)).toEqual(calendarShape);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = draw(Documentation as unknown as Renderable, 'en').textContent ?? '';
    const english = leaves(translations('en').datePickerDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).datePickerDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-date-picker Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').datePickerDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').datePickerDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = draw(Documentation as unknown as Renderable, 'en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) expect(text, item).toContain(item);
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).datePickerDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).datePickerDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('Validation stories: text only from the dictionary', () => {
  const pickerStories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;
  const calendarOnly = Object.entries(calendarStories).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  const idOf = (piece: string, name: string): string =>
    `components-${piece}-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the date picker stories are the eleven pages of the contract', () => {
    expect(pickerStories.map(([name]) => name).sort()).toEqual([
      'Brands', 'Examples', 'Field', 'Form', 'Interactive', 'Limits', 'PanelLarge', 'PanelRange', 'PanelSingle', 'Range', 'States',
    ]);
  });

  it('the calendar stories are the seven pages of the contract', () => {
    expect(calendarOnly.map(([name]) => name).sort()).toEqual(['Brands', 'Interactive', 'Limits', 'Range', 'Single', 'Views', 'Week']);
  });

  it('Field: three sizes, empty and filled, in both modes', async () => {
    const target = draw(validation.Field as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const pickers = await ready(frame);
    expect(pickers.map((picker) => `${picker.size} ${picker.value === '' ? 'empty' : 'filled'}`)).toEqual([
      'compact empty', 'compact filled', 'default empty', 'default filled', 'large empty', 'large filled',
    ]);
  });

  it('PanelRange and PanelLarge draw an open range panel and take no focus', async () => {
    for (const name of ['PanelRange', 'PanelLarge'] as const) {
      const target = draw(validation[name] as Renderable, 'en');
      const pickers = await ready(target);
      expect(pickers.length).toBe(2);
      for (const picker of pickers) {
        expect(picker.open).toBe(true);
        expect(picker.mode).toBe('range');
      }
      expect(document.activeElement === document.body || !target.contains(document.activeElement)).toBe(true);
    }
  });

  it('Views: the month view and the year view open in the grids, as the person opens them', async () => {
    const target = draw(calendarStories.Views as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const grids = [...frame.querySelectorAll('nph-calendar')] as Array<HTMLElement & { updateComplete: Promise<unknown> }>;
    expect(grids).toHaveLength(4);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const views = grids.map((grid) => grid.shadowRoot?.querySelector('.view')?.getAttribute('data-view'));
    expect(views).toEqual(['month', 'year', 'month', 'month']);
  });

  it('Examples: the three required examples, each in both modes', async () => {
    const target = draw(validation.Examples as Renderable, 'en');
    expect([...target.querySelectorAll('[data-nph-color-scheme]')]).toHaveLength(6);
    await ready(target);
  });

  it('Brands: the seven brands in light and dark, a picker inside every frame', () => {
    for (const stories of [validation, calendarStories]) {
      const target = draw(stories.Brands as Renderable, 'en');
      const frames = [...target.querySelectorAll('[data-nph-brand-frame]')];
      expect(frames).toHaveLength(14);
      for (const frame of frames) expect(frame.querySelector('nph-date-picker, nph-calendar')).not.toBeNull();
      target.remove();
    }
  });

  for (const [piece, stories] of [
    ['nph-date-picker', pickerStories],
    ['nph-calendar', calendarOnly],
  ] as const) {
    for (const [name, story] of stories) {
      it(`${piece} ${name}: the title, the claim and the sidebar label are in the dictionary, in every language`, () => {
        for (const { value: locale } of LOCALES) {
          const id = idOf(piece, name);
          const label = sidebarLabel(id, locale);
          const claim = translations(locale).validationPages.claims[id];
          expect(label, `${locale} sidebar ${id}`).toBeTruthy();
          expect(claim, `${locale} claim ${id}`).toBeTruthy();
          const target = draw(story, locale);
          expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`${piece} · ${label}`);
          expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
          target.remove();
        }
      });
    }
  }
});
