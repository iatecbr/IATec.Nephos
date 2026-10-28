/**
 * Contract of the `nph-avatar` Documentation page and of its Validation stories:
 * index with no orphan anchor in all three languages, no leftover placeholder, the
 * `avatarDocs` and `avatarValidation` dictionaries with the same shape in pt-BR, en
 * and es (`test:i18n` only reads `.md` pairs), no text of another language on the
 * English page, the three required examples in light and dark mode, and the exact
 * set of Validation stories.
 *
 * The two "When to use" lists of the English dictionary equal the `use_when` and
 * `do_not_use_when` of the generated Metadata, item by item. The page reads them
 * from the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks
 * every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import metadata from '../../shared/metadata/nph-avatar.json';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import { Documentation } from './nph-avatar.docs.stories';
import * as validation from './nph-avatar.stories';
import type { NphAvatar } from './nph-avatar';

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

type Piece = NphAvatar & { updateComplete: Promise<unknown> };

describe('nph-avatar Documentation', () => {
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
      expect(header?.textContent?.trim()).toBe('nph-avatar');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every instance on the page renders`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-avatar')] as Piece[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML.slice(0, 80)).toBe(true);
      }
    });

    it(`${locale}: the matrix shows the three sizes, with a photo and without`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['size: sm', 'size: md', 'size: lg']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        sizes: [...tr.querySelectorAll('nph-avatar')].map((piece) => piece.getAttribute('size')),
        photo: [...tr.querySelectorAll('nph-avatar')].map((piece) => piece.hasAttribute('src')),
      }));
      expect(rows).toEqual([
        { label: 'src', sizes: ['sm', 'md', 'lg'], photo: [true, true, true] },
        { label: 'no src', sizes: ['sm', 'md', 'lg'], photo: [false, false, false] },
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
      const [owner, card, profile] = demos as HTMLElement[];
      const expectations: Array<[HTMLElement | undefined, string, boolean]> = [
        [owner, 'sm', true],
        [card, 'md', true],
        [profile, 'lg', false],
      ];
      for (const [entry, size, photo] of expectations) {
        for (const frame of entry?.querySelectorAll('[data-nph-color-scheme]') ?? []) {
          const pieces = [...frame.querySelectorAll('nph-avatar')];
          expect(pieces).toHaveLength(1);
          expect(pieces[0]?.getAttribute('size')).toBe(size);
          expect(pieces[0]?.hasAttribute('src')).toBe(photo);
          /* The name is next to the avatar, so the avatar carries no label of its own. */
          expect(pieces[0]?.hasAttribute('label')).toBe(false);
          expect((frame.textContent ?? '').trim()).not.toBe('');
        }
      }
    });

    it(`${locale}: the fallback section shows a photo, no src and a src that fails`, () => {
      const target = renderInLocale(locale);
      const pieces = [...(target.querySelector('section#fallback') as HTMLElement).querySelectorAll('nph-avatar')];
      expect(pieces.map((piece) => piece.hasAttribute('src'))).toEqual([true, false, true]);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').avatarDocs);
    expect(shape(translations('pt-BR').avatarDocs)).toEqual(source);
    expect(shape(translations('es').avatarDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').avatarDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).avatarDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('the translated "When to use" lists keep the same number of items as the Metadata', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).avatarDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).avatarDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-avatar Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').avatarDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').avatarDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-avatar Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `PhotoFailed` is `photo-failed`. */
  const idOf = (name: string): string =>
    `components-nph-avatar-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the six pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Accessibility', 'Border', 'NoPhoto', 'Photo', 'PhotoFailed', 'Sizes']);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const schemes = frames.map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes, `${name} ${locale}`).toEqual(['light', 'dark']);
        const expected = translations(locale).avatarValidation;
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-avatar · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every piece renders and every label of a piece comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).avatarValidation));
        const pieces = [...target.querySelectorAll('nph-avatar')] as Piece[];
        expect(pieces.length, name).toBeGreaterThan(0);
        await Promise.all(pieces.map((piece) => piece.updateComplete));
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML.slice(0, 80)).toBe(true);
          const label = piece.getAttribute('label');
          if (label !== null) {
            expect(allowed.has(label), `${name} ${locale}: ${label}`).toBe(true);
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

  it('Accessibility: the avatar with a label is named, and the one with the name beside it is hidden', async () => {
    const target = draw(validation.Accessibility as Renderable, 'en');
    const pieces = [...target.querySelectorAll('nph-avatar')] as Piece[];
    await Promise.all(pieces.map((piece) => piece.updateComplete));
    const named = pieces.filter((piece) => piece.hasAttribute('label'));
    const hidden = pieces.filter((piece) => !piece.hasAttribute('label'));
    expect(named.length).toBeGreaterThan(0);
    expect(hidden.length).toBeGreaterThan(0);
    for (const piece of named) {
      expect(piece.getAttribute('role')).toBe('img');
      expect(piece.getAttribute('aria-label')).toBe(piece.getAttribute('label'));
    }
    for (const piece of hidden) {
      expect(piece.getAttribute('aria-hidden')).toBe('true');
      expect(piece.hasAttribute('role')).toBe(false);
    }
  });

  it('PhotoFailed: the broken photo leaves the person icon and no image shows', async () => {
    const target = draw(validation.PhotoFailed as Renderable, 'en');
    const broken = [...target.querySelectorAll('nph-avatar[src^="data:image/png"]')] as Piece[];
    expect(broken.length).toBeGreaterThan(0);
    await Promise.all(broken.map((piece) => piece.updateComplete));
    await new Promise((resolve) => setTimeout(resolve, 100));
    for (const piece of broken) {
      await piece.updateComplete;
      expect(piece.shadowRoot?.querySelector('nph-icon'), piece.outerHTML.slice(0, 80)).not.toBeNull();
      expect(piece.shadowRoot?.querySelector('img')?.hidden).toBe(true);
    }
  });

  it('Border: the overlap is on a plain wrapper, by hand, with a space/inline negative margin on the consumer side', () => {
    const target = draw(validation.Border as Renderable, 'en');
    const overlapped = [...target.querySelectorAll('nph-avatar[style*="--nph-space-inline"]')];
    expect(overlapped.length).toBeGreaterThan(0);
    expect(target.innerHTML).not.toContain('--nph-avatar-overlap');
    expect(target.querySelector('nph-avatar-stack')).toBeNull();
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').avatarValidation);
    expect(shape(translations('pt-BR').avatarValidation)).toEqual(source);
    expect(shape(translations('es').avatarValidation)).toEqual(source);
  });
});

describe('nph-avatar documentation — order of the model', () => {
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
      expect(sections).toEqual(['when-to-use', 'api', 'fallback', 'anatomy', 'accessibility', 'examples', 'references']);
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
