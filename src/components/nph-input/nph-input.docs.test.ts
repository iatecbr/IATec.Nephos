/**
 * Contract of the `nph-input` Documentation page and of its Validation stories: index
 * with no orphan anchor in all three languages, no leftover placeholder, the `inputDocs`
 * and `inputValidation` dictionaries with the same shape in pt-BR, en and es
 * (`test:i18n` only reads `.md` pairs), no text of another language on the English page,
 * every instance named, and the two "When to use" lists equal to the ones of the sheet
 * (page and sheet match, with no item dropped). The page reads the lists from the
 * Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-input.json';
import { Documentation } from './nph-input.docs.stories';
import * as validation from './nph-input.stories';
import type { NphInput } from './nph-input';

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

/** `value` appears in `text` as a whole run of text, not inside a longer word. */
function containsWhole(text: string, value: string): boolean {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, 'u').test(text);
}

/** A valid piece has a name: an associated label or `label`. */
function named(piece: NphInput): boolean {
  return piece.labels.length > 0 || (piece.getAttribute('label') ?? '').trim() !== '';
}

const INVALID_ON_PURPOSE = ['type: password', 'size: small', 'icon-start: not-an-icon'];

describe('nph-input Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title, and the h1 is the piece name`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-input');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every instance on the page renders and has an accessible name`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-input')] as NphInput[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect(named(piece), piece.outerHTML).toBe(true);
      }
    });

    it(`${locale}: the matrix shows size default and large, with placeholder, value, invalid and disabled`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['size: default', 'size: large']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        sizes: [...tr.querySelectorAll('nph-input')].map((piece) => piece.getAttribute('size')),
      }));
      expect(rows.map((row) => row.label)).toEqual(['placeholder', 'value', 'invalid', 'disabled']);
      for (const row of rows) {
        expect(row.sizes).toEqual(['default', 'large']);
      }
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const d = translations(locale).inputDocs;
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark', 'light', 'dark', 'light', 'dark']);
      const text = examples.textContent ?? '';
      for (const caption of [d.exampleSearch, d.exampleLabel, d.exampleError]) {
        expect(text).toContain(caption);
      }
      expect(examples.querySelectorAll('nph-input[icon-start="magnifying-glass"][icon-end="xmark"]').length).toBe(2);
      expect(examples.querySelectorAll('nph-label').length).toBe(4);
      expect(examples.querySelectorAll('nph-input[invalid]').length).toBe(2);
      expect(examples.querySelector('[role="note"]')).not.toBeNull();
    });

    it(`${locale}: the error example passes its sentence as description`, async () => {
      const target = renderInLocale(locale);
      const d = translations(locale).inputDocs;
      const invalid = [...target.querySelectorAll('section#examples nph-input[invalid]')] as NphInput[];
      for (const piece of invalid) {
        expect(piece.getAttribute('description')).toBe(d.errorSentence);
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').inputDocs);
    expect(shape(translations('pt-BR').inputDocs)).toEqual(source);
    expect(shape(translations('es').inputDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').inputDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).inputDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-input Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').inputDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').inputDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).inputDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).inputDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the API table names every property of the sheet', () => {
    const terms = translations('en').inputDocs.api.map(([term]: [string, string]) => term);
    for (const name of Object.keys(metadata.api).filter((key) => key !== 'input' && key !== 'change')) {
      expect(terms, name).toContain(name);
    }
    expect(terms).toContain('input and change');
  });
});

describe('nph-input Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `FormAssociation` is `form-association`. */
  const idOf = (name: string): string =>
    `components-nph-input-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the nine pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'Clear',
      'ErrorAndDisabled',
      'Examples',
      'FormAssociation',
      'Icons',
      'InvalidInput',
      'Matrix',
      'Types',
      'Width',
    ]);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const pairs = name === 'Examples' ? 3 : name === 'FormAssociation' ? 2 : 1;
        expect(frames.map((el) => el.getAttribute('data-nph-color-scheme')), `${name} ${locale}`).toEqual(
          Array.from({ length: pairs }, () => ['light', 'dark']).flat(),
        );
        const expected = translations(locale).inputValidation;
        const captions = [...target.querySelectorAll('figcaption')]
          .filter((el) => frames.includes(el.parentElement as Element))
          .map((el) => el.textContent?.trim() ?? '');
        for (const caption of captions) {
          expect([expected.lightCaption, expected.darkCaption], `${name} ${locale}: ${caption}`).toContain(caption.split(' · ').pop());
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-input · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text of a piece comes from the dictionary, and every valid piece has a name`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).inputValidation));
        const pieces = [...target.querySelectorAll('nph-input')] as NphInput[];
        expect(pieces.length, name).toBeGreaterThan(0);
        await Promise.all(pieces.map((piece) => piece.updateComplete));
        for (const piece of pieces) {
          for (const attribute of ['label', 'placeholder', 'value', 'clear-label', 'description']) {
            const value = piece.getAttribute(attribute);
            if (value !== null && value !== '') {
              expect(allowed.has(value), `${name} ${locale}: ${attribute} ${piece.outerHTML}`).toBe(true);
            }
          }
          const row = piece.closest('tr')?.querySelector('th')?.textContent?.trim() ?? '';
          if (name === 'InvalidInput' && INVALID_ON_PURPOSE.includes(row)) {
            expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(false);
          } else {
            expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
            expect(named(piece), piece.outerHTML).toBe(true);
          }
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

  it('Clear: a click empties the field and the status shows input and change with the value', async () => {
    for (const locale of LOCALES) {
      const target = draw(validation.Clear as Renderable, locale);
      const v = translations(locale).inputValidation;
      const pieces = [...target.querySelectorAll('nph-input')] as NphInput[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      const piece = pieces[0] as NphInput;
      const status = target.querySelector('output') as HTMLOutputElement;
      expect(status.textContent).toBe(v.statusIdle);
      (piece.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
      expect(piece.value).toBe('');
      expect(status.textContent).toBe(v.statusEvent.replace('{event}', 'change').replace('{value}', ''));
      target.remove();
    }
  });

  it('FormAssociation: submit shows the form data, and the disabled fieldset leaves the field out', async () => {
    const target = draw(validation.FormAssociation as Renderable, 'en');
    const v = translations('en').inputValidation;
    const forms = [...target.querySelectorAll('form')];
    expect(forms).toHaveLength(4);
    const pieces = [...target.querySelectorAll('nph-input')] as NphInput[];
    await Promise.all(pieces.map((piece) => piece.updateComplete));
    const [enabled, , disabled] = forms as HTMLFormElement[];
    enabled?.requestSubmit();
    expect(enabled?.querySelector('output')?.textContent).toBe(v.statusSubmitted.replace('{data}', JSON.stringify({ email: v.emailValue })));
    expect((enabled?.querySelector('nph-input') as NphInput).checkValidity()).toBe(true);
    expect(new FormData(disabled as HTMLFormElement).has('email')).toBe(false);
    expect(disabled?.querySelector('nph-input')?.matches(':disabled')).toBe(true);
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').inputValidation);
    expect(shape(translations('pt-BR').inputValidation)).toEqual(source);
    expect(shape(translations('es').inputValidation)).toEqual(source);
  });
});

describe('nph-input documentation — order of the model', () => {
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

    /* Usage is deferred, not refused: P70 puts it after API on every Docs page, in DSA-35. */
    it(`${locale}: the sections follow the model, with Sizes and States before the sections of the piece and no Variants`, () => {
      const target = renderInLocale(locale);
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(sections).toEqual(['when-to-use', 'api', 'sizes', 'states', 'icons', 'types', 'anatomy', 'accessibility', 'examples', 'references']);
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
