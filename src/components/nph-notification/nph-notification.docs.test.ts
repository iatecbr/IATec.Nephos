/**
 * Contract of the `nph-notification` Documentation page and of its Validation stories: index with
 * no orphan anchor in all three languages, no leftover placeholder, every `nph-notification` on
 * the page drawn from the dictionary, the labelled matrix and the three required examples in
 * light and dark mode, the `notificationDocs` and `notificationValidation` dictionaries with the
 * same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of another language
 * on the English page, and the two "When to use" lists equal to the ones of the sheet. The page
 * reads the lists from the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every
 * page.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-notification.json';
import { Documentation } from './nph-notification.docs.stories';
import * as validation from './nph-notification.stories';
import type { NphNotification } from './nph-notification';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
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

async function ready(target: HTMLElement): Promise<NphNotification[]> {
  const pieces = [...target.querySelectorAll('nph-notification')];
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  return pieces;
}

/** The examples of a section: each `demo` figure with its light and dark frames. */
function frames(container: Element): Array<string | null> {
  return [...container.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
}

describe('nph-notification Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-notification');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every nph-notification on the page draws, with its text from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const d = translations(locale).notificationDocs;
      const allowed = new Set(leaves(d));
      const pieces = await ready(target);
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect(allowed.has(piece.description), `${locale}: ${piece.description}`).toBe(true);
        if (piece.heading !== '') expect(allowed.has(piece.heading), `${locale}: ${piece.heading}`).toBe(true);
        if (piece.action !== '') expect(allowed.has(piece.action), `${locale}: ${piece.action}`).toBe(true);
        if (piece.closeLabel !== '') expect(allowed.has(piece.closeLabel), `${locale}: ${piece.closeLabel}`).toBe(true);
      }
    });

    it(`${locale}: the matrix shows each of the six severities in subtle and in solid`, async () => {
      const target = renderInLocale(locale);
      const pieces = await ready(target.querySelector('[data-nph-matrix]') as HTMLElement);
      expect(pieces.map((piece) => `${piece.severity}:${piece.emphasis}`)).toEqual([
        'info:subtle',
        'info:solid',
        'success:subtle',
        'success:solid',
        'warning:subtle',
        'warning:solid',
        'error:subtle',
        'error:solid',
        'help:subtle',
        'help:solid',
        'neutral:subtle',
        'neutral:solid',
      ]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('#required-examples') as HTMLElement;
      const figures = [...examples.querySelectorAll(':scope figure:not([data-nph-color-scheme])')];
      expect(figures).toHaveLength(3);
      for (const figure of figures) {
        expect(frames(figure)).toEqual(['light', 'dark']);
      }
      const [error, success, loading] = await Promise.all(figures.map((figure) => ready(figure as HTMLElement)));
      expect(error?.map((piece) => [piece.placement, piece.severity, piece.action !== ''])).toEqual([
        ['inline', 'error', true],
        ['inline', 'error', true],
      ]);
      expect(success?.map((piece) => [piece.placement, piece.severity])).toEqual([
        ['toast', 'success'],
        ['toast', 'success'],
      ]);
      expect(loading?.map((piece) => [piece.placement, piece.severity])).toEqual([
        ['toast', 'loading'],
        ['toast', 'loading'],
      ]);
    });

    it(`${locale}: the toast region example shows three toasts and no tag of its own`, async () => {
      const target = renderInLocale(locale);
      const regions = [...target.querySelectorAll('#toast-and-region [role="group"]')];
      expect(regions).toHaveLength(2);
      for (const region of regions) {
        expect(region.querySelectorAll('nph-notification')).toHaveLength(3);
      }
      expect(target.querySelector('nph-notification-region')).toBeNull();
    });

    it(`${locale}: the accessibility section names the announcement, the focus, the time and the touch target`, () => {
      const target = renderInLocale(locale);
      const text = target.querySelector('#accessibility')?.textContent ?? '';
      expect(text).toContain('role="alert"');
      expect(text).toContain('role="status"');
      expect(text).toContain('6');
      expect(text).toContain('control/height-large');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['notificationDocs', 'notificationValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').notificationDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).notificationDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-notification Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').notificationDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').notificationDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).notificationDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).notificationDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the API table names the properties of the sheet, in order', () => {
    expect(translations('en').notificationDocs.api.map((row: string[]) => row[0])).toEqual(Object.keys(metadata.api));
  });
});

describe('nph-notification Validation: text only from the dictionary', () => {
  /* InvalidInput has a time bar with an action on purpose: its development error is expected here. */
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `TimeBar` is `time-bar`. */
  const idOf = (name: string): string =>
    `components-nph-notification-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(
      ['Actions', 'Brands', 'Close', 'Emphasis', 'InvalidInput', 'Layouts', 'Region', 'RequiredExamples', 'Severities', 'Surfaces', 'TimeBar', 'Toast'].sort(),
    );
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-notification · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: light and dark side by side, and every text of the piece comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(leaves(translations(locale).notificationValidation));
        const pieces = await ready(target);
        expect(pieces.length, name).toBeGreaterThan(0);
        /* The shape of the brand frames is proved in src/shared/tokens/brand-validation.test.ts. */
        if (name !== 'Brands') {
          expect(frames(target).length % 2, name).toBe(0);
          expect(frames(target).slice(0, 2), name).toEqual(['light', 'dark']);
        }
        for (const piece of pieces) {
          expect(allowed.has(piece.description), `${name} ${locale}: ${piece.description}`).toBe(true);
          if (piece.heading !== '') expect(allowed.has(piece.heading), `${name} ${locale}: ${piece.heading}`).toBe(true);
          if (piece.action !== '') expect(allowed.has(piece.action), `${name} ${locale}: ${piece.action}`).toBe(true);
          if (piece.secondaryAction !== '') expect(allowed.has(piece.secondaryAction), `${name} ${locale}`).toBe(true);
          if (piece.closeLabel !== '') expect(allowed.has(piece.closeLabel), `${name} ${locale}`).toBe(true);
        }
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('Severities and Emphasis: one notification per severity with a drawing of its own, in each mode', async () => {
    for (const name of ['Severities', 'Emphasis'] as const) {
      const target = draw(validation[name] as Renderable, 'en');
      const pieces = await ready(target);
      expect(pieces.map((piece) => piece.severity)).toEqual([
        'info', 'success', 'warning', 'error', 'help', 'neutral',
        'info', 'success', 'warning', 'error', 'help', 'neutral',
      ]);
      expect(pieces.every((piece) => piece.emphasis === (name === 'Emphasis' ? 'solid' : 'subtle'))).toBe(true);
      target.remove();
    }
  });

  it('Actions: every notification has a main and a secondary action', async () => {
    const target = draw(validation.Actions as Renderable, 'en');
    const pieces = await ready(target);
    expect(pieces).toHaveLength(12);
    for (const piece of pieces) {
      expect(piece.action).not.toBe('');
      expect(piece.secondaryAction).not.toBe('');
    }
  });

  it('Toast and Region: no toast of a story closes by itself while the page is open', async () => {
    for (const name of ['Toast', 'Region', 'RequiredExamples'] as const) {
      const target = draw(validation[name] as Renderable, 'en');
      const pieces = (await ready(target)).filter((piece) => piece.placement === 'toast');
      expect(pieces.length, name).toBeGreaterThan(0);
      for (const piece of pieces) {
        const stays = piece.duration === 0 || piece.severity === 'error' || piece.severity === 'loading' || piece.action !== '';
        expect(stays, `${name}: ${piece.severity}`).toBe(true);
      }
      target.remove();
    }
  });

  it('Region: the frame holds three toasts and is not a piece', async () => {
    const target = draw(validation.Region as Renderable, 'en');
    const regions = [...target.querySelectorAll('[role="group"]')];
    expect(regions).toHaveLength(2);
    for (const region of regions) {
      expect(region.querySelectorAll('nph-notification')).toHaveLength(3);
    }
  });

  it('Surfaces: the notifications on color/background and on color/popover, each in light and in dark', async () => {
    const target = draw(validation.Surfaces as Renderable, 'en');
    expect(frames(target)).toEqual(['light', 'dark', 'light', 'dark']);
    const surfaces = [...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => (el as HTMLElement).style.background);
    expect(surfaces).toEqual([
      'var(--nph-color-background)',
      'var(--nph-color-background)',
      'var(--nph-color-popover)',
      'var(--nph-color-popover)',
    ]);
  });

  it('InvalidInput: nothing is drawn in either mode', async () => {
    const target = draw(validation.InvalidInput as Renderable, 'en');
    const pieces = await ready(target);
    expect(pieces).toHaveLength(2);
    for (const piece of pieces) {
      expect(piece.hasAttribute('data-nph-rendered')).toBe(false);
      expect(piece.getBoundingClientRect().height).toBe(0);
    }
  });

  it('only the Brands story carries data-nph-brand', () => {
    for (const [name, story] of stories) {
      const target = draw(story, 'en');
      if (name === 'Brands') {
        expect(target.querySelectorAll('[data-nph-brand]'), name).toHaveLength(14);
      } else {
        expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      }
      target.remove();
    }
  });
});
