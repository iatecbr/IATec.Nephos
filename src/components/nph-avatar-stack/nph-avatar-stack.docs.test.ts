/**
 * Contract of the `nph-avatar-stack` Documentation page and of its Validation stories:
 * index with no orphan anchor in all three languages, no leftover placeholder, the
 * `avatarStackDocs` and `avatarStackValidation` dictionaries with the same shape in
 * pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of another language on
 * the English page, the three required examples in light and dark mode, and the exact
 * set of Validation stories.
 *
 * The two "When to use" lists of the English dictionary equal the `use_when` and
 * `do_not_use_when` of the generated Metadata, item by item (P71 is deferred to
 * DSA-34; until then this test keeps page and sheet from diverging).
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import metadata from '../../shared/metadata/nph-avatar-stack.json';
import { format, sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import { Documentation } from './nph-avatar-stack.docs.stories';
import * as validation from './nph-avatar-stack.stories';
import type { NphAvatarStack } from './nph-avatar-stack';

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

type Piece = NphAvatarStack & { updateComplete: Promise<unknown> };

async function rendered(target: HTMLElement): Promise<Piece[]> {
  const pieces = [...target.querySelectorAll('nph-avatar-stack')] as Piece[];
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  return pieces;
}

describe('nph-avatar-stack Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-avatar-stack');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every group on the page renders, named from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const pieces = await rendered(target);
      const names = new Set(leaves(translations(locale).avatarStackDocs));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML.slice(0, 80)).toBe(true);
        expect(names.has(piece.getAttribute('label') ?? ''), piece.getAttribute('label') ?? '').toBe(true);
      }
    });

    it(`${locale}: the matrix shows the three sizes, without and with the count`, async () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      await rendered(matrix);
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['size: sm', 'size: md', 'size: lg']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        sizes: [...tr.querySelectorAll('nph-avatar-stack')].map((piece) => piece.getAttribute('size')),
        counts: ([...tr.querySelectorAll('nph-avatar-stack')] as Piece[]).map((piece) => piece.count),
      }));
      expect(rows).toEqual([
        { label: 'count: 0', sizes: ['sm', 'md', 'lg'], counts: [0, 0, 0] },
        { label: 'count: 3', sizes: ['sm', 'md', 'lg'], counts: [3, 3, 3] },
      ]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      await rendered(examples);
      const expectations: Array<[string, number, boolean]> = [
        ['md', 3, false],
        ['md', 5, true],
        ['sm', 3, true],
      ];
      demos.forEach((entry, position) => {
        const frames = [...entry.querySelectorAll('[data-nph-color-scheme]')];
        expect(frames.map((el) => el.getAttribute('data-nph-color-scheme'))).toEqual(['light', 'dark']);
        const [size, avatars, withCount] = expectations[position]!;
        for (const frame of frames) {
          const groups = [...frame.querySelectorAll('nph-avatar-stack')] as Piece[];
          expect(groups).toHaveLength(1);
          expect(groups[0]?.getAttribute('size')).toBe(size);
          expect(groups[0]?.querySelectorAll('nph-avatar')).toHaveLength(avatars);
          expect((groups[0]?.count ?? 0) > 0).toBe(withCount);
          expect(groups[0]?.getAttribute('aria-label')).toBeTruthy();
          /* The text next to the group is on the frame. */
          expect((frame.textContent ?? '').trim()).not.toBe('');
        }
      });
    });

    it(`${locale}: the composition section shows two avatars, five, and five with the count`, async () => {
      const target = renderInLocale(locale);
      const section = target.querySelector('section#composition') as HTMLElement;
      const groups = await rendered(section);
      expect(groups.map((group) => [group.querySelectorAll('nph-avatar').length, group.count])).toEqual([
        [2, 0],
        [5, 0],
        [5, 3],
      ]);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').avatarStackDocs);
    expect(shape(translations('pt-BR').avatarStackDocs)).toEqual(source);
    expect(shape(translations('es').avatarStackDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const page = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').avatarStackDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).avatarStackDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(page, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('the translated "When to use" lists keep the same number of items as the Metadata', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).avatarStackDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).avatarStackDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-avatar-stack Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').avatarStackDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').avatarStackDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-avatar-stack Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `CountWidth` is `count-width`. */
  const idOf = (name: string): string =>
    `components-nph-avatar-stack-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  /** Every name a group of these stories may carry, in one language. */
  function allowedNames(locale: string): Set<string> {
    const v = translations(locale).avatarStackValidation;
    const names = new Set<string>([v.namedGroup]);
    for (let shown = 1; shown <= 5; shown += 1) {
      names.add(format(v.groupLabel, { shown }));
      for (const more of [2, 3, 12, 128]) {
        names.add(format(v.groupMoreLabel, { shown, more }));
      }
    }
    return names;
  }

  it('the stories are the five pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Accessibility', 'Composition', 'CountWidth', 'Photo', 'Sizes']);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        expect(frames.map((el) => el.getAttribute('data-nph-color-scheme')), `${name} ${locale}`).toEqual(['light', 'dark']);
        const expected = translations(locale).avatarStackValidation;
        const captions = [...target.querySelectorAll('figcaption')]
          .filter((el) => frames.includes(el.parentElement as Element))
          .map((el) => el.textContent?.trim() ?? '');
        expect(captions, `${name} ${locale}`).toEqual([expected.lightCaption, expected.darkCaption]);
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-avatar-stack · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every group renders, silent, and every name comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = allowedNames(locale);
        const pieces = await rendered(target);
        expect(pieces.length, name).toBeGreaterThan(0);
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML.slice(0, 80)).toBe(true);
          expect(allowed.has(piece.getAttribute('label') ?? ''), `${name} ${locale}: ${piece.getAttribute('label')}`).toBe(true);
          const avatars = piece.querySelectorAll('nph-avatar').length;
          expect(avatars, name).toBeGreaterThanOrEqual(2);
          expect(avatars, name).toBeLessThanOrEqual(5);
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

  it('Composition: two to five avatars, each without and with the count', async () => {
    const target = draw(validation.Composition as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const groups = await rendered(frame);
    expect(groups.map((group) => [group.querySelectorAll('nph-avatar').length, group.count])).toEqual([
      [2, 0],
      [2, 3],
      [3, 0],
      [3, 3],
      [4, 0],
      [4, 3],
      [5, 0],
      [5, 3],
    ]);
  });

  it('Photo: photos, no photo and both in the same group', () => {
    const target = draw(validation.Photo as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const rows = [...frame.querySelectorAll('tbody tr')].map((tr) =>
      [...(tr.querySelector('nph-avatar-stack')?.querySelectorAll('nph-avatar') ?? [])].map((avatar) => avatar.hasAttribute('src')),
    );
    expect(rows).toEqual([
      [true, true, true],
      [false, false, false],
      [true, false, true],
    ]);
  });

  it('Accessibility: the group is named and its avatars carry no label of their own', async () => {
    const target = draw(validation.Accessibility as Renderable, 'en');
    const groups = await rendered(target);
    for (const group of groups) {
      expect(group.getAttribute('role')).toBe('img');
      expect(group.getAttribute('aria-label')).toBe(translations('en').avatarStackValidation.namedGroup);
      for (const avatar of group.querySelectorAll('nph-avatar')) {
        expect(avatar.hasAttribute('label')).toBe(false);
      }
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').avatarStackValidation);
    expect(shape(translations('pt-BR').avatarStackValidation)).toEqual(source);
    expect(shape(translations('es').avatarStackValidation)).toEqual(source);
  });
});

describe('nph-avatar-stack documentation — order of the model', () => {
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
      expect(sections).toEqual(['when-to-use', 'api', 'composition', 'anatomy', 'accessibility', 'examples', 'references']);
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
