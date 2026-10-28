/**
 * Contract of the `nph-switch` Documentation page and of its Validation stories: index with
 * no orphan anchor in all three languages, no leftover placeholder, the `switchDocs` and
 * `switchValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only
 * reads `.md` pairs), no text of another language on the English page, and the two "When to
 * use" lists equal to the ones of the sheet (page and sheet match, with no item dropped).
 * The page reads the lists from the Metadata (P71), and
 * `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-switch.json';
import { Documentation } from './nph-switch.docs.stories';
import * as validation from './nph-switch.stories';
import type { NphSwitch } from './nph-switch';

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

/** Every string of a value, in order. */
function leaves(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(leaves);
  if (value !== null && typeof value === 'object') return Object.values(value).flatMap(leaves);
  return [];
}

/** `value` appears in `text` as a whole run of text, not inside a longer word (`Criterio` is not in `Criterion`). */
function containsWhole(text: string, value: string): boolean {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, 'u').test(text);
}

type Piece = NphSwitch & { updateComplete: Promise<unknown> };

describe('nph-switch Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-switch');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every instance on the page renders`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-switch')] as Piece[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
      }
    });

    it(`${locale}: every instance without text has a label`, () => {
      const target = renderInLocale(locale);
      const bare = [...target.querySelectorAll('nph-switch:not([text])')];
      expect(bare.length).toBeGreaterThan(0);
      for (const piece of bare) {
        expect((piece.getAttribute('label') ?? '').trim(), piece.outerHTML).not.toBe('');
      }
    });

    it(`${locale}: the matrix shows off and on, with a label, invalid, disabled and only the track`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['checked: false', 'checked: true']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => {
        const pieces = [...tr.querySelectorAll('nph-switch')];
        return {
          label: tr.querySelector('th')?.textContent?.trim(),
          checked: pieces.map((piece) => piece.hasAttribute('checked')),
          invalid: pieces.map((piece) => piece.hasAttribute('invalid')),
          disabled: pieces.map((piece) => piece.hasAttribute('disabled')),
        };
      });
      expect(rows).toEqual([
        { label: 'text', checked: [false, true], invalid: [false, false], disabled: [false, false] },
        { label: 'text · invalid', checked: [false, true], invalid: [true, true], disabled: [false, false] },
        { label: 'text · disabled', checked: [false, true], invalid: [false, false], disabled: [true, true] },
        { label: 'label', checked: [false, true], invalid: [false, false], disabled: [false, false] },
      ]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      await Promise.all(([...target.querySelectorAll('nph-switch')] as Piece[]).map((piece) => piece.updateComplete));
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
      }
      const [single, preferences, unavailable] = demos as HTMLElement[];
      for (const frame of single?.querySelectorAll('[data-nph-color-scheme]') ?? []) {
        const pieces = [...frame.querySelectorAll('nph-switch')];
        expect(pieces).toHaveLength(1);
        expect(pieces[0]?.hasAttribute('text')).toBe(true);
        expect(pieces[0]?.hasAttribute('disabled')).toBe(false);
      }
      for (const frame of preferences?.querySelectorAll('[data-nph-color-scheme]') ?? []) {
        const pieces = [...frame.querySelectorAll('nph-switch')];
        expect(pieces.length).toBeGreaterThan(1);
        /* One per line: each piece starts below the previous one. */
        const tops = pieces.map((piece) => piece.getBoundingClientRect().top);
        tops.slice(1).forEach((top, position) => expect(top).toBeGreaterThan(tops[position] ?? 0));
      }
      for (const frame of unavailable?.querySelectorAll('[data-nph-color-scheme]') ?? []) {
        const pieces = [...frame.querySelectorAll('nph-switch')];
        expect(pieces).toHaveLength(1);
        expect(pieces[0]?.hasAttribute('disabled')).toBe(true);
      }
    });

    it(`${locale}: the accessibility section carries the known limit of the focus border`, () => {
      const target = renderInLocale(locale);
      const text = (target.querySelector('section#accessibility') as HTMLElement).textContent ?? '';
      expect(text).toContain('focus/border');
      expect(text).toContain(locale === 'en' ? '2.92' : '2,92');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').switchDocs);
    expect(shape(translations('pt-BR').switchDocs)).toEqual(source);
    expect(shape(translations('es').switchDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').switchDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).switchDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-switch Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').switchDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').switchDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).switchDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).switchDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-switch Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `Matrix` is `matrix`. */
  const idOf = (name: string): string =>
    `components-nph-switch-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the six pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Disabled', 'Examples', 'Interactive', 'Invalid', 'Label', 'Matrix']);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const schemes = frames.map((el) => el.getAttribute('data-nph-color-scheme'));
        const expectedSchemes = name === 'Examples' ? ['light', 'dark', 'light', 'dark', 'light', 'dark'] : ['light', 'dark'];
        expect(schemes, `${name} ${locale}`).toEqual(expectedSchemes);
        const expected = translations(locale).switchValidation;
        const captions = [...target.querySelectorAll('figcaption')]
          .filter((el) => frames.includes(el.parentElement as Element))
          .map((el) => el.textContent?.trim() ?? '');
        for (const caption of captions) {
          const mode = caption.split(' · ').pop();
          expect([expected.lightCaption, expected.darkCaption], `${name} ${locale}: ${caption}`).toContain(mode);
        }
        target.remove();
      }
    });

    it(`${name}: the title, the claim and the sidebar label are in the dictionary, in every language`, () => {
      for (const locale of LOCALES) {
        const id = idOf(name);
        const label = sidebarLabel(id, locale);
        const claim = translations(locale).validationPages.claims[id];
        expect(label, `${locale} sidebar ${id}`).toBeTruthy();
        expect(claim, `${locale} claim ${id}`).toBeTruthy();
        const target = draw(story, locale);
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-switch · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text and label of a piece comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).switchValidation));
        const pieces = [...target.querySelectorAll('nph-switch')] as Piece[];
        expect(pieces.length, name).toBeGreaterThan(0);
        await Promise.all(pieces.map((piece) => piece.updateComplete));
        for (const piece of pieces) {
          const value = piece.getAttribute('text') ?? piece.getAttribute('label') ?? '';
          expect(allowed.has(value), `${name} ${locale}: ${piece.outerHTML}`).toBe(true);
          expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        }
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('there is no story per brand: the page follows the global brand, the frame only sets the mode', () => {
    for (const [name, story] of stories) {
      const target = draw(story, 'en');
      expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      target.remove();
    }
  });

  it('Interactive: a click toggles each piece and shows checked in the status text', async () => {
    const story = validation.Interactive as Renderable;
    for (const locale of LOCALES) {
      const target = draw(story, locale);
      const v = translations(locale).switchValidation;
      const pieces = [...target.querySelectorAll('nph-switch')] as Piece[];
      const statuses = [...target.querySelectorAll('output')];
      expect(pieces).toHaveLength(2);
      expect(statuses.map((status) => status.textContent)).toEqual([v.statusIdle, v.statusIdle]);
      await Promise.all(pieces.map((piece) => piece.updateComplete));

      (pieces[0]?.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
      expect(pieces[0]?.checked).toBe(true);
      expect(statuses[0]?.textContent).toBe(v.statusChanged.replace('{checked}', 'true'));
      expect(statuses[1]?.textContent).toBe(v.statusIdle);

      (pieces[0]?.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
      expect(pieces[0]?.checked).toBe(false);
      expect(statuses[0]?.textContent).toBe(v.statusChanged.replace('{checked}', 'false'));
      target.remove();
    }
  });

  it('Label: the row names that are not attributes come from the dictionary, in every language', () => {
    for (const locale of LOCALES) {
      const target = draw(validation.Label as Renderable, locale);
      const rows = [...(target.querySelector('[data-nph-matrix]')?.querySelectorAll('tbody th') ?? [])].map((th) => th.textContent?.trim());
      expect(rows, locale).toEqual(['text', 'label', `text · ${translations(locale).switchValidation.twoLines}`]);
      target.remove();
    }
    expect(translations('pt-BR').switchValidation.twoLines).not.toBe(translations('en').switchValidation.twoLines);
  });

  it('Label: a long label wraps to two lines, with the track at the top', async () => {
    const target = draw(validation.Label as Renderable, 'en');
    const long = [...target.querySelectorAll('nph-switch')].find(
      (piece) => piece.getAttribute('text') === translations('en').switchValidation.longLabel,
    ) as Piece;
    await long.updateComplete;
    const text = long.shadowRoot?.querySelector('.text') as HTMLElement;
    const track = long.shadowRoot?.querySelector('.track') as HTMLElement;
    expect(text.getBoundingClientRect().height).toBeGreaterThan(track.getBoundingClientRect().height);
    expect(track.getBoundingClientRect().top).toBeCloseTo(text.getBoundingClientRect().top, 2);
  });

  it('Disabled: a disabled piece with invalid is shown, and it stays disabled', async () => {
    const target = draw(validation.Disabled as Renderable, 'en');
    const both = [...target.querySelectorAll('nph-switch[disabled][invalid]')] as Piece[];
    expect(both.length).toBeGreaterThan(0);
    await Promise.all(both.map((piece) => piece.updateComplete));
    for (const piece of both) {
      expect(piece.shadowRoot?.querySelector('button')?.disabled).toBe(true);
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').switchValidation);
    expect(shape(translations('pt-BR').switchValidation)).toEqual(source);
    expect(shape(translations('es').switchValidation)).toEqual(source);
  });
});

describe('nph-switch documentation — order of the model', () => {
  for (const locale of LOCALES) {
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

    it(`${locale}: the sections follow the model of the current Docs pages, with no anti-patterns section`, () => {
      const target = renderInLocale(locale);
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(sections).toEqual(['when-to-use', 'api', 'usage', 'states', 'label', 'anatomy', 'accessibility', 'examples', 'references']);
      expect(target.querySelector('#anti-patterns')).toBeNull();
    });

    it(`${locale}: one side-by-side use and do-not-use block`, () => {
      const target = renderInLocale(locale);
      const cards = [...target.querySelectorAll('[data-nph-card]')];
      expect(cards.map((card) => card.getAttribute('data-nph-card'))).toEqual(['success', 'error']);
      expect(cards[0]?.parentElement).toBe(cards[1]?.parentElement);
    });
  }
});
