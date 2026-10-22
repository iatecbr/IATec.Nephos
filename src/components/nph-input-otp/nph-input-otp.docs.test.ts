/**
 * Contract of the `nph-input-otp` Documentation page and of its Validation stories:
 * index with no orphan anchor in all three languages, no leftover placeholder, the
 * `inputOtpDocs` and `inputOtpValidation` dictionaries with the same shape in pt-BR, en
 * and es (`test:i18n` only reads `.md` pairs), no text of another language on the
 * English page, and the two "When to use" lists equal to the ones of the sheet (page and
 * sheet match, with no item dropped). Reading the lists from the Metadata is P71
 * (DSA-34), deferred; see the header of `nph-input-otp.docs.stories.ts`.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { format, sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-input-otp.json';
import { Documentation } from './nph-input-otp.docs.stories';
import * as validation from './nph-input-otp.stories';
import type { NphInputOtp } from './nph-input-otp';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
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

async function ready(target: HTMLElement): Promise<NphInputOtp[]> {
  const fields = [...target.querySelectorAll('nph-input-otp')] as NphInputOtp[];
  await Promise.all(fields.map((piece) => piece.updateComplete));
  return fields;
}

describe('nph-input-otp Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-input-otp');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every field on the page renders, is named from the dictionary and warns nothing`, async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const target = renderInLocale(locale);
      const fields = await ready(target);
      expect(fields.length).toBeGreaterThan(0);
      const d = translations(locale).inputOtpDocs;
      for (const piece of fields) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect(piece.getAttribute('label'), piece.outerHTML).toBe(d.fieldLabel);
        expect(['', d.numericCode, d.shortCode, d.alphanumericCode, d.partialCode], piece.outerHTML).toContain(piece.getAttribute('value'));
      }
      expect(warn).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
    });

    it(`${locale}: the matrix shows six and four cells, in default and in large`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['size: default', 'size: large']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        cells: [...tr.querySelectorAll('nph-input-otp')].map((piece) => [piece.getAttribute('length'), piece.getAttribute('size')]),
      }));
      expect(rows).toEqual([
        { label: 'length: 6', cells: [['6', 'default'], ['6', 'large']] },
        { label: 'length: 4', cells: [['4', 'default'], ['4', 'large']] },
      ]);
    });

    it(`${locale}: the examples show the touch screen, size large, in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(1);
      const schemes = [...(demos[0]?.querySelectorAll('[data-nph-color-scheme]') ?? [])].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark']);
      for (const piece of examples.querySelectorAll('nph-input-otp')) {
        expect(piece.getAttribute('size')).toBe('large');
      }
    });

    it(`${locale}: the states and masked sections show what they name`, () => {
      const target = renderInLocale(locale);
      const states = target.querySelector('section#states') as HTMLElement;
      expect(states.querySelector('nph-input-otp[invalid]')).not.toBeNull();
      expect(states.querySelector('nph-input-otp[disabled]')).not.toBeNull();
      const masked = target.querySelector('section#masked') as HTMLElement;
      expect(masked.querySelectorAll('nph-input-otp[masked]').length).toBe(1);
      expect(masked.querySelectorAll('nph-input-otp:not([masked])').length).toBe(1);
    });

    it(`${locale}: the accessibility section names one-time-code and the known limits`, () => {
      const target = renderInLocale(locale);
      const section = target.querySelector('section#accessibility') as HTMLElement;
      expect(section.textContent ?? '').toContain('one-time-code');
      expect(section.textContent ?? '').toContain('masked');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').inputOtpDocs);
    expect(shape(translations('pt-BR').inputOtpDocs)).toEqual(source);
    expect(shape(translations('es').inputOtpDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').inputOtpDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).inputOtpDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('the codes are the same in every language: they are values, not text', () => {
    for (const key of ['numericCode', 'shortCode', 'alphanumericCode', 'partialCode'] as const) {
      const en = translations('en').inputOtpDocs[key];
      expect(translations('pt-BR').inputOtpDocs[key]).toBe(en);
      expect(translations('es').inputOtpDocs[key]).toBe(en);
      expect(translations('en').inputOtpValidation[key]).toBe(en);
    }
  });
});

describe('nph-input-otp Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').inputOtpDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').inputOtpDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).inputOtpDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).inputOtpDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-input-otp Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `Interactive` is `interactive`. */
  const idOf = (name: string): string =>
    `components-nph-input-otp-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the five pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Characters', 'Examples', 'Interactive', 'Matrix', 'States']);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        expect(frames.map((el) => el.getAttribute('data-nph-color-scheme')), `${name} ${locale}`).toEqual(['light', 'dark']);
        const expected = translations(locale).inputOtpValidation;
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-input-otp · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every name and code of a field comes from the dictionary, and every field renders`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).inputOtpValidation));
        const fields = await ready(target);
        expect(fields.length, name).toBeGreaterThan(0);
        for (const piece of fields) {
          expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
          expect(allowed.has(piece.getAttribute('label') ?? ''), `${name} ${locale}: ${piece.outerHTML}`).toBe(true);
          const value = piece.getAttribute('value') ?? '';
          expect(value === '' || allowed.has(value), `${name} ${locale}: ${piece.outerHTML}`).toBe(true);
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

  it('Matrix: six and four cells, in default and large', async () => {
    const target = draw(validation.Matrix as Renderable, 'en');
    const fields = await ready(target);
    const shown = new Set(fields.map((piece) => `${piece.length} ${piece.size}`));
    expect([...shown].sort()).toEqual(['4 default', '4 large', '6 default', '6 large']);
  });

  it('States: default, invalid, disabled and disabled with invalid', async () => {
    const target = draw(validation.States as Renderable, 'en');
    await ready(target);
    expect(target.querySelectorAll('nph-input-otp[invalid]:not([disabled])').length).toBeGreaterThan(0);
    expect(target.querySelectorAll('nph-input-otp[disabled]:not([invalid])').length).toBeGreaterThan(0);
    expect(target.querySelectorAll('nph-input-otp[disabled][invalid]').length).toBeGreaterThan(0);
    expect(target.querySelectorAll('nph-input-otp:not([disabled]):not([invalid])').length).toBeGreaterThan(0);
  });

  it('Characters: numeric, letters and numbers, partial and masked', async () => {
    const target = draw(validation.Characters as Renderable, 'en');
    const v = translations('en').inputOtpValidation;
    const fields = await ready(target);
    const values = new Set(fields.map((piece) => piece.value));
    expect(values).toEqual(new Set([v.numericCode, v.alphanumericCode, v.partialCode]));
    expect(target.querySelectorAll('nph-input-otp[masked]').length).toBeGreaterThan(0);
  });

  it('Interactive: input and change show the value in the status text', async () => {
    for (const locale of LOCALES) {
      const target = draw(validation.Interactive as Renderable, locale);
      const v = translations(locale).inputOtpValidation;
      const [piece] = await ready(target);
      const status = target.querySelector('output') as HTMLOutputElement;
      expect(status.textContent).toBe(v.statusIdle);
      const input = piece?.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.focus();
      input.value = '12';
      input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertText', data: '2' }));
      expect(status.textContent).toBe(format(v.statusInput, { value: '12' }));
      input.blur();
      expect(status.textContent).toBe(format(v.statusChange, { value: '12' }));
      target.remove();
    }
  });

  it('Examples: the touch screen, size large', async () => {
    const target = draw(validation.Examples as Renderable, 'en');
    const fields = await ready(target);
    expect(fields.length).toBe(2);
    for (const piece of fields) {
      expect(piece.size).toBe('large');
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').inputOtpValidation);
    expect(shape(translations('pt-BR').inputOtpValidation)).toEqual(source);
    expect(shape(translations('es').inputOtpValidation)).toEqual(source);
  });
});

describe('nph-input-otp documentation — order of the model', () => {
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
      expect(sections).toEqual([
        'when-to-use',
        'api',
        'length-and-size',
        'states',
        'masked',
        'anatomy',
        'accessibility',
        'examples',
        'references',
      ]);
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
