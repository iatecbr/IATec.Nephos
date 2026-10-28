/**
 * Contract of the `nph-checkbox` Documentation page and of its Validation stories: index
 * with no orphan anchor in all three languages, no leftover placeholder, the `checkboxDocs`
 * and `checkboxValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n`
 * only reads `.md` pairs), no text of another language on the English page, and the two
 * "When to use" lists equal to the ones of the sheet (page and sheet match, with no item
 * dropped). The page reads the lists from the Metadata (P71), and
 * `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-checkbox.json';
import { Documentation } from './nph-checkbox.docs.stories';
import * as validation from './nph-checkbox.stories';
import type { NphCheckbox } from './nph-checkbox';

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

async function ready(target: HTMLElement): Promise<NphCheckbox[]> {
  const pieces = [...target.querySelectorAll('nph-checkbox')] as NphCheckbox[];
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  return pieces;
}

describe('nph-checkbox Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-checkbox');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every box on the page renders and is named by its text or by label`, async () => {
      const target = renderInLocale(locale);
      const pieces = await ready(target);
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        const name = (piece.getAttribute('text') || piece.getAttribute('label') || '').trim();
        expect(name, piece.outerHTML).not.toBe('');
      }
    });

    it(`${locale}: the matrix shows unchecked, checked and indeterminate against default, invalid and disabled`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim()).filter(Boolean);
      expect(columns).toEqual(['default', 'invalid', 'disabled']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        cells: [...tr.querySelectorAll('td')].map((cell) => {
          const piece = cell.querySelector('nph-checkbox') as NphCheckbox;
          return [piece.checked, piece.indeterminate, piece.invalid, piece.disabled];
        }),
      }));
      expect(rows).toEqual([
        { label: 'checked: false', cells: [[false, false, false, false], [false, false, true, false], [false, false, false, true]] },
        { label: 'checked: true', cells: [[true, false, false, false], [true, false, true, false], [true, false, false, true]] },
        { label: 'indeterminate', cells: [[false, true, false, false], [false, true, true, false], [false, true, false, true]] },
      ]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
      }
      const counts = demos.map((entry) => entry.querySelector('[data-nph-color-scheme]')?.querySelectorAll('nph-checkbox').length);
      expect(counts).toEqual([1, 3, 4]);
      const summary = demos[2]?.querySelector('[data-summary]') as NphCheckbox;
      expect(summary.indeterminate).toBe(true);
    });

    it(`${locale}: the states section shows the error sentence outside the piece`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const section = target.querySelector('section#states') as HTMLElement;
      const invalid = section.querySelector('nph-checkbox[invalid]') as HTMLElement;
      const sentence = translations(locale).checkboxDocs.errorSentence;
      expect(invalid.textContent ?? '').not.toContain(sentence);
      expect(invalid.parentElement?.textContent ?? '').toContain(sentence);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').checkboxDocs);
    expect(shape(translations('pt-BR').checkboxDocs)).toEqual(source);
    expect(shape(translations('es').checkboxDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').checkboxDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).checkboxDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-checkbox Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').checkboxDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').checkboxDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).checkboxDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).checkboxDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-checkbox Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `TextWrap` is `text-wrap`. */
  const idOf = (name: string): string =>
    `components-nph-checkbox-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the eight pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'BoxAlone',
      'Disabled',
      'Examples',
      'Form',
      'Interactive',
      'Invalid',
      'Matrix',
      'TextWrap',
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
        const expected = translations(locale).checkboxValidation;
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-checkbox · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text and label of a piece comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).checkboxValidation));
        const pieces = await ready(target);
        expect(pieces.length, name).toBeGreaterThan(0);
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
          const value = piece.getAttribute('text') || piece.getAttribute('label') || '';
          expect(allowed.has(value), `${name} ${locale}: ${piece.outerHTML}`).toBe(true);
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

  it('Interactive: a click toggles the box and writes the change in the status text', async () => {
    for (const locale of LOCALES) {
      const target = draw(validation.Interactive as Renderable, locale);
      const v = translations(locale).checkboxValidation;
      const [first, indeterminate] = await ready(target);
      const status = target.querySelector('output') as HTMLOutputElement;
      expect(status.textContent).toBe(v.statusIdle);
      first?.click();
      expect(status.textContent).toBe(v.statusChanged.replace('{checked}', 'true'));
      indeterminate?.click();
      expect([indeterminate?.checked, indeterminate?.indeterminate]).toEqual([true, false]);
      target.remove();
    }
  });

  it('Form: the status text follows the form data, and reset goes back to the default state', async () => {
    const target = draw(validation.Form as Renderable, 'en');
    const v = translations('en').checkboxValidation;
    await ready(target);
    /* The first form: the story draws the same form in each mode. */
    const form = target.querySelector('form') as HTMLFormElement;
    const pieces = [...form.querySelectorAll('nph-checkbox')] as NphCheckbox[];
    const status = form.querySelector('output') as HTMLOutputElement;
    expect(status.textContent).toBe(v.formData.replace('{data}', 'consent=yes'));
    pieces[1]?.click();
    expect(status.textContent).toBe(v.formData.replace('{data}', 'consent=yes channel=email'));
    pieces[0]?.click();
    expect(status.textContent).toBe(v.formData.replace('{data}', 'channel=email'));
    const reset = form.querySelector('nph-button') as HTMLElement & { updateComplete: Promise<unknown> };
    await reset.updateComplete;
    reset.click();
    await Promise.all(pieces.map((piece) => piece.updateComplete));
    expect(pieces.map((piece) => piece.checked)).toEqual([true, false, false]);
    expect(status.textContent).toBe(v.formData.replace('{data}', 'consent=yes'));
  });

  it('Examples: the summarizing item follows its items, and checking it checks them all', async () => {
    const target = draw(validation.Examples as Renderable, 'en');
    await ready(target);
    const frame = [...target.querySelectorAll('[data-nph-color-scheme]')][4] as HTMLElement;
    const summary = frame.querySelector('[data-summary]') as NphCheckbox;
    const items = [...frame.querySelectorAll('[data-item]')] as NphCheckbox[];
    expect([summary.checked, summary.indeterminate]).toEqual([false, true]);
    items[1]?.click();
    expect([summary.checked, summary.indeterminate]).toEqual([true, false]);
    summary.click();
    expect(items.map((item) => item.checked)).toEqual([false, false, false]);
    expect([summary.checked, summary.indeterminate]).toEqual([false, false]);
  });

  it('Disabled: one box is disabled by its fieldset, not by its own attribute', async () => {
    const target = draw(validation.Disabled as Renderable, 'en');
    await ready(target);
    const inFieldset = target.querySelector('fieldset[disabled] nph-checkbox') as NphCheckbox;
    expect(inFieldset.hasAttribute('disabled')).toBe(false);
    expect(inFieldset.matches(':disabled')).toBe(true);
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').checkboxValidation);
    expect(shape(translations('pt-BR').checkboxValidation)).toEqual(source);
    expect(shape(translations('es').checkboxValidation)).toEqual(source);
  });
});

describe('nph-checkbox documentation — order of the model', () => {
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
      expect(sections).toEqual(['when-to-use', 'api', 'states', 'form', 'anatomy', 'accessibility', 'examples', 'references']);
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
