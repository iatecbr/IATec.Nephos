/**
 * Contract of the `nph-textarea` Documentation page and of its Validation stories: index
 * with no orphan anchor in all three languages, no leftover placeholder, the
 * `textareaDocs` and `textareaValidation` dictionaries with the same shape in pt-BR, en
 * and es (`test:i18n` only reads `.md` pairs), no text of another language on the English
 * page, every instance named, and the two "When to use" lists equal to the ones of the
 * sheet (page and sheet match, with no item dropped). Reading the lists from the Metadata
 * is P71 (DSA-34), deferred; see the header of `nph-textarea.docs.stories.ts`.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { format, sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-textarea.json';
import { Documentation } from './nph-textarea.docs.stories';
import * as validation from './nph-textarea.stories';
import type { NphTextarea } from './nph-textarea';

afterEach(() => {
  document.body.replaceChildren();
});

const LOCALES = ['pt-BR', 'en', 'es'] as const;

type Updatable = HTMLElement & { updateComplete: Promise<unknown> };

function renderInLocale(locale: string): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  const draw = Documentation.render as unknown as (args: unknown, context: unknown) => TemplateResult;
  render(draw({}, { globals: { locale } }), target);
  return target;
}

/** Every piece and field on the page has drawn, so the field has named its textarea. */
async function settle(target: HTMLElement): Promise<NphTextarea[]> {
  const pieces = [...target.querySelectorAll<Updatable>('nph-textarea, nph-field, nph-button')];
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  return [...target.querySelectorAll('nph-textarea')] as NphTextarea[];
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

/** A piece has a name: an associated label, `label`, or the one its `nph-field` wrote. */
function named(piece: NphTextarea): boolean {
  return piece.labels.length > 0 || (piece.label ?? '').trim() !== '';
}

/** The counter text the consumer writes, in the language of the page. */
function counterText(template: string, length: number): string {
  return format(template, { length: String(length), limit: '280' });
}

describe('nph-textarea Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-textarea');
    });

    it(`${locale}: no {name} placeholder is left on the page`, async () => {
      const target = renderInLocale(locale);
      const pieces = await settle(target);
      expect(target.textContent ?? '').not.toMatch(/\{\w+\}/);
      for (const piece of pieces) {
        expect(piece.counter).not.toMatch(/\{\w+\}/);
      }
    });

    it(`${locale}: every instance on the page renders and has an accessible name`, async () => {
      const pieces = await settle(renderInLocale(locale));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.shadowRoot?.querySelector('textarea'), piece.outerHTML).not.toBeNull();
        expect(named(piece), piece.outerHTML).toBe(true);
      }
    });

    it(`${locale}: the matrix shows the footer off and on, with placeholder, value, invalid and disabled`, async () => {
      const target = renderInLocale(locale);
      await settle(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['footer: off', 'footer: on']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        footers: [...tr.querySelectorAll('nph-textarea')].map((piece) => (piece as NphTextarea).counter !== '' && piece.querySelectorAll('nph-button').length === 2),
      }));
      expect(rows.map((row) => row.label)).toEqual(['placeholder', 'value', 'invalid', 'disabled']);
      for (const row of rows) {
        expect(row.footers).toEqual([false, true]);
      }
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      const d = translations(locale).textareaDocs;
      await settle(target);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark', 'light', 'dark', 'light', 'dark']);
      const text = examples.textContent ?? '';
      for (const caption of [d.exampleComment, d.exampleForm, d.exampleLong]) {
        expect(text).toContain(caption);
      }
      const comments = [...examples.querySelectorAll('nph-textarea')].filter((piece) => piece.querySelector('nph-button')) as NphTextarea[];
      expect(comments).toHaveLength(2);
      for (const piece of comments) {
        expect(piece.counter).toBe(counterText(d.counterText, 0));
        expect([...piece.querySelectorAll('nph-button')].map((button) => button.getAttribute('emphasis'))).toEqual(['ghost', 'solid']);
      }
      const fields = [...examples.querySelectorAll('nph-field')];
      expect(fields).toHaveLength(2);
      for (const owner of fields) {
        expect(owner.getAttribute('counter')).toBe(counterText(d.counterText, 0));
        expect((owner.querySelector('nph-textarea') as NphTextarea).counter).toBe('');
      }
    });

    it(`${locale}: the long text passes the maximum height and scrolls inside`, async () => {
      const target = renderInLocale(locale);
      const d = translations(locale).textareaDocs;
      const pieces = await settle(target);
      const long = pieces.filter((piece) => piece.value === d.longValue);
      expect(long.length).toBeGreaterThan(0);
      for (const piece of long) {
        const inner = piece.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
        expect(inner.scrollHeight, locale).toBeGreaterThan(inner.clientHeight);
      }
    });

    it(`${locale}: the comment counter follows what the person writes`, async () => {
      const target = renderInLocale(locale);
      const d = translations(locale).textareaDocs;
      await settle(target);
      const piece = [...target.querySelectorAll('section#examples nph-textarea')].find((element) => element.querySelector('nph-button')) as NphTextarea;
      await userEvent.type(piece.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement, 'abc');
      expect(piece.counter).toBe(counterText(d.counterText, 3));
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').textareaDocs);
    expect(shape(translations('pt-BR').textareaDocs)).toEqual(source);
    expect(shape(translations('es').textareaDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').textareaDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).textareaDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-textarea Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').textareaDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').textareaDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).textareaDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).textareaDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  it('the API table names every property of the sheet', () => {
    const terms = translations('en').textareaDocs.api.map(([term]: [string, string]) => term);
    for (const name of Object.keys(metadata.api).filter((key) => key !== 'input' && key !== 'change')) {
      expect(terms, name).toContain(name);
    }
    expect(terms).toContain('input and change');
  });
});

describe('nph-textarea Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `FormAssociation` is `form-association`. */
  const idOf = (name: string): string =>
    `components-nph-textarea-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the seven pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Examples', 'Footer', 'FormAssociation', 'Height', 'InField', 'Matrix', 'Width']);
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
        const expected = translations(locale).textareaValidation;
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-textarea · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text of a piece comes from the dictionary, and every piece has a name`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const v = translations(locale).textareaValidation;
        const allowed = new Set(Object.values(v));
        const pieces = await settle(target);
        expect(pieces.length, name).toBeGreaterThan(0);
        for (const piece of pieces) {
          for (const attribute of ['label', 'placeholder', 'value', 'description']) {
            const value = piece.getAttribute(attribute);
            if (value !== null && value !== '') {
              expect(allowed.has(value), `${name} ${locale}: ${attribute} ${piece.outerHTML}`).toBe(true);
            }
          }
          for (const button of piece.querySelectorAll('nph-button')) {
            expect(allowed.has(button.getAttribute('text') ?? ''), `${name} ${locale}: ${button.outerHTML}`).toBe(true);
          }
          if (piece.counter !== '') {
            expect(piece.counter, `${name} ${locale}`).toMatch(/^\d+\/280$/);
          }
          expect(named(piece), piece.outerHTML).toBe(true);
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

  it('FormAssociation: submit shows the form data with the line break, and the disabled fieldset leaves the field out', async () => {
    const target = draw(validation.FormAssociation as Renderable, 'en');
    const v = translations('en').textareaValidation;
    const forms = [...target.querySelectorAll('form')];
    expect(forms).toHaveLength(4);
    await settle(target);
    const [enabled, , disabled] = forms as HTMLFormElement[];
    enabled?.requestSubmit();
    expect(enabled?.querySelector('output')?.textContent).toBe(v.statusSubmitted.replace('{data}', JSON.stringify({ notes: v.notesValue })));
    expect(v.notesValue).toContain('\n');
    expect(new FormData(disabled as HTMLFormElement).has('notes')).toBe(false);
    expect(disabled?.querySelector('nph-textarea')?.matches(':disabled')).toBe(true);
  });

  it('Footer: readonly draws no footer, and disabled reaches the actions', async () => {
    const target = draw(validation.Footer as Renderable, 'en');
    const pieces = await settle(target);
    const footerOf = (piece: NphTextarea) => piece.shadowRoot?.querySelector('.footer') as HTMLElement;
    const readOnly = pieces.find((piece) => piece.readOnly) as NphTextarea;
    expect(getComputedStyle(footerOf(readOnly)).display).toBe('none');
    const disabled = pieces.find((piece) => piece.disabled) as NphTextarea;
    for (const button of disabled.querySelectorAll('nph-button')) {
      expect((button as HTMLElement & { disabled: boolean }).disabled).toBe(true);
    }
  });

  it('InField: the error row makes the textarea invalid, and the field carries the counter', async () => {
    const target = draw(validation.InField as Renderable, 'en');
    const v = translations('en').textareaValidation;
    const pieces = await settle(target);
    const invalid = pieces.filter((piece) => piece.invalid);
    expect(invalid).toHaveLength(2);
    for (const piece of invalid) {
      expect(piece.description).toBe(v.descriptionError);
    }
    for (const owner of target.querySelectorAll('nph-field')) {
      expect(owner.getAttribute('counter')).toBe(counterText(v.counterText, v.descriptionValue.length));
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').textareaValidation);
    expect(shape(translations('pt-BR').textareaValidation)).toEqual(source);
    expect(shape(translations('es').textareaValidation)).toEqual(source);
  });
});

describe('nph-textarea documentation — order of the model', () => {
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
    it(`${locale}: the sections follow the model, with States before the sections of the piece and no Variants or Sizes`, () => {
      const target = renderInLocale(locale);
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(sections).toEqual(['when-to-use', 'api', 'states', 'footer', 'height', 'anatomy', 'accessibility', 'examples', 'references']);
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
