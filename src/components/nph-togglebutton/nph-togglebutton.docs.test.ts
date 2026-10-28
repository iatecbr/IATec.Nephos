/**
 * Contract of the `nph-togglebutton` Documentation page and of its Validation stories:
 * index with no orphan anchor in all three languages, no leftover placeholder, the
 * `togglebuttonDocs` and `togglebuttonValidation` dictionaries with the same shape in
 * pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of another language on
 * the English page, and the two "When to use" lists equal to the ones of the sheet (page
 * and sheet match, with no item dropped). The page reads the lists from the Metadata
 * (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-togglebutton.json';
import { Documentation } from './nph-togglebutton.docs.stories';
import * as validation from './nph-togglebutton.stories';
import type { NphTogglebutton } from './nph-togglebutton';

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

type Piece = NphTogglebutton & { updateComplete: Promise<unknown> };

describe('nph-togglebutton Documentation', () => {
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
      const header = target.querySelector('header h1');
      expect(header?.textContent?.trim()).toBe('nph-togglebutton');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every instance on the page renders`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-togglebutton')] as Piece[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
      }
    });

    it(`${locale}: every icon-only instance has a label`, () => {
      const target = renderInLocale(locale);
      const iconOnly = [...target.querySelectorAll('nph-togglebutton:not([text])')];
      expect(iconOnly.length).toBeGreaterThan(0);
      for (const piece of iconOnly) {
        expect((piece.getAttribute('label') ?? '').trim(), piece.outerHTML).not.toBe('');
      }
    });

    it(`${locale}: the matrix shows pressed off and on, with text, invalid and icon only`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['pressed: false', 'pressed: true']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        pressed: [...tr.querySelectorAll('nph-togglebutton')].map((piece) => piece.hasAttribute('pressed')),
        invalid: [...tr.querySelectorAll('nph-togglebutton')].map((piece) => piece.hasAttribute('invalid')),
      }));
      expect(rows).toEqual([
        { label: 'text', pressed: [false, true], invalid: [false, false] },
        { label: 'text · invalid', pressed: [false, true], invalid: [true, true] },
        { label: 'label · icon-start: star', pressed: [false, true], invalid: [false, false] },
      ]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
      }
      const [off, on, iconSet] = demos as HTMLElement[];
      for (const frame of off?.querySelectorAll('[data-nph-color-scheme]') ?? []) {
        const pieces = [...frame.querySelectorAll('nph-togglebutton')];
        expect(pieces).toHaveLength(1);
        expect(pieces[0]?.hasAttribute('pressed')).toBe(false);
        expect(pieces[0]?.hasAttribute('text')).toBe(true);
      }
      for (const frame of on?.querySelectorAll('[data-nph-color-scheme]') ?? []) {
        const pieces = [...frame.querySelectorAll('nph-togglebutton')];
        expect(pieces).toHaveLength(1);
        expect(pieces[0]?.hasAttribute('pressed')).toBe(true);
        expect(pieces[0]?.hasAttribute('text')).toBe(true);
      }
      for (const frame of iconSet?.querySelectorAll('[data-nph-color-scheme]') ?? []) {
        const pieces = [...frame.querySelectorAll('nph-togglebutton')];
        expect(pieces.length).toBeGreaterThan(1);
        expect(pieces.filter((piece) => piece.hasAttribute('pressed'))).toHaveLength(1);
        for (const piece of pieces) {
          expect(piece.hasAttribute('text'), piece.outerHTML).toBe(false);
          expect(piece.hasAttribute('label'), piece.outerHTML).toBe(true);
        }
      }
    });

    it(`${locale}: the accessibility section carries the known limit of the focus border`, () => {
      const target = renderInLocale(locale);
      const section = target.querySelector('section#accessibility') as HTMLElement;
      const text = section.textContent ?? '';
      expect(text).toContain('color/primary');
      expect(text).toContain(locale === 'en' ? '2.71' : '2,71');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').togglebuttonDocs);
    expect(shape(translations('pt-BR').togglebuttonDocs)).toEqual(source);
    expect(shape(translations('es').togglebuttonDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').togglebuttonDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).togglebuttonDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-togglebutton Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').togglebuttonDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').togglebuttonDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).togglebuttonDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).togglebuttonDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-togglebutton Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `IconOnly` is `icon-only`. */
  const idOf = (name: string): string =>
    `components-nph-togglebutton-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the seven pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'Disabled',
      'Examples',
      'IconOnly',
      'Icons',
      'Interactive',
      'Invalid',
      'Matrix',
    ]);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const schemes = frames.map((el) => el.getAttribute('data-nph-color-scheme'));
        const expectedSchemes = name === 'Examples' ? ['light', 'dark', 'light', 'dark', 'light', 'dark'] : ['light', 'dark'];
        expect(schemes, `${name} ${locale}`).toEqual(expectedSchemes);
        const expected = translations(locale).togglebuttonValidation;
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-togglebutton · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text and label of a piece comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).togglebuttonValidation));
        const pieces = [...target.querySelectorAll('nph-togglebutton')] as Piece[];
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

  it('Interactive: a click toggles each piece and shows detail.pressed in the status text', async () => {
    const story = validation.Interactive as Renderable;
    for (const locale of LOCALES) {
      const target = draw(story, locale);
      const v = translations(locale).togglebuttonValidation;
      const pieces = [...target.querySelectorAll('nph-togglebutton')] as Piece[];
      const statuses = [...target.querySelectorAll('output')];
      expect(pieces).toHaveLength(2);
      expect(statuses.map((status) => status.textContent)).toEqual([v.statusIdle, v.statusIdle]);
      await Promise.all(pieces.map((piece) => piece.updateComplete));

      (pieces[0]?.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
      expect(pieces[0]?.pressed).toBe(true);
      expect(statuses[0]?.textContent).toBe(v.statusChanged.replace('{pressed}', 'true'));
      expect(statuses[1]?.textContent).toBe(v.statusIdle);

      (pieces[0]?.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
      expect(pieces[0]?.pressed).toBe(false);
      expect(statuses[0]?.textContent).toBe(v.statusChanged.replace('{pressed}', 'false'));
      target.remove();
    }
  });

  it('Disabled: a disabled piece with invalid is shown, and it stays disabled', async () => {
    const target = draw(validation.Disabled as Renderable, 'en');
    const both = [...target.querySelectorAll('nph-togglebutton[disabled][invalid]')] as Piece[];
    expect(both.length).toBeGreaterThan(0);
    await Promise.all(both.map((piece) => piece.updateComplete));
    for (const piece of both) {
      expect(piece.shadowRoot?.querySelector('button')?.disabled).toBe(true);
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').togglebuttonValidation);
    expect(shape(translations('pt-BR').togglebuttonValidation)).toEqual(source);
    expect(shape(translations('es').togglebuttonValidation)).toEqual(source);
  });
});

describe('nph-togglebutton documentation — order of the model', () => {
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

    /* Usage is deferred, not refused: P70 puts it after API on every Docs page, in DSA-35. This test lists
     * today's sections and does not assert the section's absence. */
    it(`${locale}: the sections follow the model of the current Docs pages, with no anti-patterns section`, () => {
      const target = renderInLocale(locale);
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(sections).toEqual(['when-to-use', 'api', 'states', 'icons', 'anatomy', 'accessibility', 'examples', 'references']);
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
