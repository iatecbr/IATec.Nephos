/**
 * Contract of the `nph-radio` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, the `radioDocs` and
 * `radioValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads
 * `.md` pairs), no text of another language on the English page, every radio drawn and named,
 * the light and dark copies of a demonstration kept as separate groups, and the two "When to
 * use" lists equal to the ones of the sheet. Reading the lists from the Metadata is P71
 * (DSA-34), deferred; see the header of `nph-radio.docs.stories.ts`.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-radio.json';
import { Documentation } from './nph-radio.docs.stories';
import * as validation from './nph-radio.stories';
import type { NphRadio } from './nph-radio';

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

/** `value` appears in `text` as a whole run of text, not inside a longer word. */
function containsWhole(text: string, value: string): boolean {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, 'u').test(text);
}

async function ready(target: HTMLElement): Promise<NphRadio[]> {
  const radios = [...target.querySelectorAll('nph-radio')];
  await Promise.all(radios.map((piece) => piece.updateComplete));
  return radios;
}

/** At most one checked radio per name: the copies of a demonstration never share a group. */
function checkedPerName(radios: NphRadio[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const piece of radios) {
    counts.set(piece.name, (counts.get(piece.name) ?? 0) + (piece.checked ? 1 : 0));
  }
  return counts;
}

describe('nph-radio Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title, and the page is named nph-radio`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-radio');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every radio on the page renders, is named, and each group has at most one checked`, async () => {
      const target = renderInLocale(locale);
      const radios = await ready(target);
      expect(radios.length).toBeGreaterThan(0);
      for (const piece of radios) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect((piece.getAttribute('text') || piece.getAttribute('label') || '').trim(), piece.outerHTML).not.toBe('');
        expect(piece.name, piece.outerHTML).not.toBe('');
      }
      for (const [name, count] of checkedPerName(radios)) {
        expect(count, name).toBeLessThanOrEqual(1);
      }
    });

    it(`${locale}: the matrix shows unchecked and checked, with the text on and off`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['checked: false', 'checked: true']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        checked: [...tr.querySelectorAll('nph-radio')].map((piece) => (piece as NphRadio).checked),
        withText: [...tr.querySelectorAll('nph-radio')].map((piece) => piece.getAttribute('text') !== ''),
      }));
      expect(rows).toEqual([
        { label: 'mostrar rótulo: true', checked: [false, true], withText: [true, true] },
        { label: 'mostrar rótulo: false', checked: [false, true], withText: [false, false] },
      ]);
    });

    it(`${locale}: the states section shows default, error and disabled`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const states = target.querySelector('section#states') as HTMLElement;
      expect(states.querySelectorAll('nph-radio[invalid]').length).toBe(2);
      expect(states.querySelectorAll('nph-radio[disabled]').length).toBe(2);
    });

    it(`${locale}: the three required examples, each in light and in dark mode, as separate groups`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      const shown = demos.map((entry) => {
        const frames = [...entry.querySelectorAll('[data-nph-color-scheme]')];
        expect(frames.map((el) => el.getAttribute('data-nph-color-scheme'))).toEqual(['light', 'dark']);
        const radios = [...entry.querySelectorAll('nph-radio')] as NphRadio[];
        return {
          radios: radios.length,
          checked: radios.filter((piece) => piece.checked).length,
          names: new Set(radios.map((piece) => piece.name)).size,
          groups: entry.querySelectorAll('[role="radiogroup"]').length,
        };
      });
      expect(shown).toEqual([
        { radios: 6, checked: 2, names: 2, groups: 2 },
        { radios: 6, checked: 0, names: 2, groups: 2 },
        { radios: 6, checked: 2, names: 2, groups: 2 },
      ]);
    });

    it(`${locale}: the accessibility section says the host is a radio and the group comes from nph-field`, () => {
      const section = renderInLocale(locale).querySelector('section#accessibility') as HTMLElement;
      expect(section.textContent ?? '').toContain('role=radio');
      expect(section.textContent ?? '').toContain('role=radiogroup');
      expect(section.textContent ?? '').toContain('nph-field');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').radioDocs);
    expect(shape(translations('pt-BR').radioDocs)).toEqual(source);
    expect(shape(translations('es').radioDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').radioDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).radioDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('the API table names every property and both events of the sheet', () => {
    const terms = translations('en').radioDocs.api.map(([term]: [string, string]) => term);
    expect(terms).toEqual(['checked', 'name', 'value', 'text', 'label', 'invalid', 'disabled', 'input, change']);
    expect(Object.keys(metadata.api)).toEqual(['checked', 'name', 'value', 'text', 'label', 'invalid', 'disabled', 'input', 'change']);
  });
});

describe('nph-radio Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').radioDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').radioDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).radioDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).radioDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-radio Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `TwoLines` is `two-lines`. */
  const idOf = (name: string): string => `components-nph-radio-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the five pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Examples', 'Form', 'Interactive', 'Matrix', 'TwoLines']);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const schemes = frames.map((el) => el.getAttribute('data-nph-color-scheme'));
        const expectedSchemes = name === 'Examples' ? ['light', 'dark', 'light', 'dark', 'light', 'dark'] : ['light', 'dark'];
        expect(schemes, `${name} ${locale}`).toEqual(expectedSchemes);
        const expected = translations(locale).radioValidation;
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-radio · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text, label and group name comes from the dictionary, and each group has at most one checked`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).radioValidation));
        const radios = await ready(target);
        expect(radios.length, name).toBeGreaterThan(0);
        for (const piece of radios) {
          expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
          const value = piece.getAttribute('text') || piece.getAttribute('label') || '';
          expect(allowed.has(value), `${name} ${locale}: ${piece.outerHTML}`).toBe(true);
        }
        for (const group of target.querySelectorAll('[role="radiogroup"]')) {
          expect(allowed.has(group.getAttribute('aria-label') ?? ''), `${name} ${locale}: ${group.getAttribute('aria-label')}`).toBe(true);
        }
        for (const [group, count] of checkedPerName(radios)) {
          expect(count, `${name} ${locale}: ${group}`).toBeLessThanOrEqual(1);
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

  it('Matrix: each state row is unchecked then checked, and the error and disabled rows carry their attribute', async () => {
    const target = draw(validation.Matrix as Renderable, 'en');
    await ready(target);
    const firstMode = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const rows = [...firstMode.querySelectorAll('tbody tr')].map((tr) => ({
      label: tr.querySelector('th')?.textContent?.trim(),
      checked: [...tr.querySelectorAll('nph-radio')].map((piece) => (piece as NphRadio).checked),
      invalid: [...tr.querySelectorAll('nph-radio')].every((piece) => piece.hasAttribute('invalid')),
      disabled: [...tr.querySelectorAll('nph-radio')].every((piece) => piece.hasAttribute('disabled')),
      withText: [...tr.querySelectorAll('nph-radio')].every((piece) => piece.getAttribute('text') !== ''),
    }));
    expect(rows).toEqual([
      { label: 'state: default', checked: [false, true], invalid: false, disabled: false, withText: true },
      { label: 'state: erro (invalid)', checked: [false, true], invalid: true, disabled: false, withText: true },
      { label: 'state: disabled', checked: [false, true], invalid: false, disabled: true, withText: true },
      { label: 'mostrar rótulo: false', checked: [false, true], invalid: false, disabled: false, withText: false },
    ]);
  });

  it('Interactive: the arrow skips the disabled radio, and change shows the checked value', async () => {
    const story = validation.Interactive as Renderable;
    for (const locale of LOCALES) {
      const target = draw(story, locale);
      const v = translations(locale).radioValidation;
      const firstMode = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
      const radios = await ready(firstMode);
      const status = firstMode.querySelector('output') as HTMLOutputElement;
      expect(status.textContent).toBe(v.statusIdle);
      expect(radios[1]?.disabled).toBe(true);
      radios[0]?.focus();
      radios[0]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(radios.map((piece) => piece.checked)).toEqual([false, false, true]);
      expect(status.textContent).toBe(v.statusChanged.replace('{name}', radios[2]?.name ?? '').replace('{value}', 'night'));
      target.remove();
    }
  });

  it('Form: submitting shows only the checked value, and reset returns to the first check', async () => {
    const target = draw(validation.Form as Renderable, 'en');
    const v = translations('en').radioValidation;
    const firstMode = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const radios = await ready(firstMode);
    const form = firstMode.querySelector('form') as HTMLFormElement;
    const status = firstMode.querySelector('output') as HTMLOutputElement;
    const [submit, reset] = [...firstMode.querySelectorAll('nph-button')] as HTMLElement[];
    await Promise.all([submit, reset].map((button) => (button as unknown as { updateComplete: Promise<unknown> }).updateComplete));
    expect(status.textContent).toBe(v.formIdle);
    radios[1]?.click();
    submit?.click();
    const name = radios[1]?.name ?? '';
    expect(status.textContent).toBe(v.formSent.replace('{data}', `${name}=pix`));
    reset?.click();
    expect(radios.map((piece) => piece.checked)).toEqual([true, false, false]);
    expect(status.textContent).toBe(v.formSent.replace('{data}', `${name}=card`));
    expect(form.contains(radios[0] as Node)).toBe(true);
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').radioValidation);
    expect(shape(translations('pt-BR').radioValidation)).toEqual(source);
    expect(shape(translations('es').radioValidation)).toEqual(source);
  });
});

describe('nph-radio documentation — order of the model', () => {
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
    it(`${locale}: the sections follow the model of the current Docs pages, with no anti-patterns section`, () => {
      const target = renderInLocale(locale);
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(sections).toEqual(['when-to-use', 'api', 'states', 'group-and-keyboard', 'form', 'anatomy', 'accessibility', 'examples', 'references']);
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
