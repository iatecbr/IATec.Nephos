/**
 * Contract of the `nph-timeline` Documentation page and of its Validation stories: index with no orphan anchor in all
 * three languages, no leftover placeholder, the `timelineDocs` and `timelineValidation` dictionaries with the same
 * shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), the two "When to use" lists equal to the ones of the
 * sheet, and every list of every story rendering and named. The Validation stories are checked for the coverage the
 * contract asks for: the types and the counts, the markers and the six states of the circle, the content of an item,
 * "Show more", loading and empty, the two widths, the three required examples in light and dark mode, and the brands.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import { BRANDS, FRAME_ATTRIBUTE, SCHEMES } from '../../shared/docs/brands';
import metadata from '../../shared/metadata/nph-timeline.json';
import { Documentation } from './nph-timeline.docs.stories';
import * as validation from './nph-timeline.stories';
import { NphTimeline } from './nph-timeline';
import type { NphTimelineItem } from './nph-timeline';

/** Let every list render before the page is taken out of the document. */
afterEach(async () => {
  const lists = [...document.querySelectorAll('nph-timeline')] as NphTimeline[];
  await Promise.all(lists.map((list) => list.updateComplete));
  await new Promise((resolve) => setTimeout(resolve, 50));
  document.body.replaceChildren();
});

const LOCALES = ['pt-BR', 'en', 'es'] as const;

type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };

function renderInLocale(locale: string): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  const draw = Documentation.render as unknown as (args: unknown, context: unknown) => TemplateResult;
  render(draw({}, { globals: { locale } }), target);
  return target;
}

function renderStory(story: Renderable, locale: string): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
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

const timelinesOf = (target: ParentNode): NphTimeline[] => [...target.querySelectorAll('nph-timeline')] as NphTimeline[];

/** The items of every list of a target, in order. */
const itemsOf = (target: ParentNode): NphTimelineItem[] => timelinesOf(target).flatMap((list) => [...list.items]);

describe('nph-timeline Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      const text = renderInLocale(locale).textContent ?? '';
      /* The Usage markup shows the `{count}` marker of `new-label` and `loaded-label`, as the consumer writes it. */
      expect(text.replace(/\{count\}/g, '')).not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every list on the page renders and has an accessible name`, async () => {
      const target = renderInLocale(locale);
      const lists = timelinesOf(target);
      await Promise.all(lists.map((list) => list.updateComplete));
      expect(lists.length).toBeGreaterThan(0);
      for (const list of lists) {
        expect(list.hasAttribute('data-nph-rendered'), list.outerHTML).toBe(true);
        const named = list.shadowRoot?.querySelector('ol');
        if (named === null || named === undefined) {
          /* The empty state draws `nph-empty` and no list. */
          expect(list.shadowRoot?.querySelector('nph-empty'), list.outerHTML).not.toBeNull();
        } else {
          expect(named.getAttribute('aria-label'), list.outerHTML).toBeTruthy();
        }
      }
    });

    it(`${locale}: the matrix shows the process and the history`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const lists = timelinesOf(matrix);
      expect(lists.map((list) => list.type)).toEqual(['process', 'history']);
      expect(lists[0]?.items.some((item) => item.status === 'current')).toBe(true);
    });

    it(`${locale}: the three required examples, in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark']);
      for (const figure of examples.querySelectorAll('figure[data-nph-color-scheme]')) {
        const [declined, person, kind] = timelinesOf(figure);
        expect(timelinesOf(figure)).toHaveLength(3);
        /* A declined approval: a completed step, a step with an error and its reason, a pending step. */
        expect(declined?.type).toBe('process');
        expect(declined?.items.map((item) => item.status)).toEqual(['completed', 'error', 'pending']);
        expect(declined?.items[1]?.description ?? '').not.toBe('');
        /* A history by person: the avatar, who and when, and an action. */
        expect(person?.type).toBe('history');
        expect(person?.items.every((item) => item.marker === 'avatar' && (item.who ?? '') !== '' && (item.when ?? '') !== '')).toBe(true);
        expect(person?.items.some((item) => (item.action ?? '') !== '')).toBe(true);
        /* A history by event type: the neutral circle with the icon of the type. */
        expect(kind?.type).toBe('history');
        expect(kind?.items.every((item) => item.marker === 'circle' && (item.icon ?? '') !== '')).toBe(true);
      }
    });

    it(`${locale}: the example texts feed every owed text, so no warning is left to say`, () => {
      const target = renderInLocale(locale);
      for (const list of timelinesOf(target)) {
        for (const name of [
          'label',
          'completedLabel',
          'currentLabel',
          'errorLabel',
          'warningLabel',
          'pendingLabel',
          'loadingLabel',
          'moreLabel',
          'newLabel',
          'loadedLabel',
          'emptyHeading',
          'emptyDescription',
        ] as const) {
          expect(list[name], `${name} ${list.outerHTML}`).toBeTruthy();
        }
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').timelineDocs);
    expect(shape(translations('pt-BR').timelineDocs)).toEqual(source);
    expect(shape(translations('es').timelineDocs)).toEqual(source);
  });
});

describe('nph-timeline Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').timelineDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').timelineDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-timeline Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  it('the stories are the ones of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(
      ['Brands', 'Content', 'Examples', 'Markers', 'Short', 'States', 'Types', 'Width'].sort(),
    );
  });

  for (const [name, story] of stories) {
    it(`${name}: every list renders and is named, in all three languages`, async () => {
      for (const locale of LOCALES) {
        const target = renderStory(story, locale);
        const lists = timelinesOf(target);
        await Promise.all(lists.map((list) => list.updateComplete));
        expect(lists.length, `${name} ${locale}`).toBeGreaterThan(0);
        for (const list of lists) {
          expect(list.hasAttribute('data-nph-rendered'), `${name} ${locale} ${list.outerHTML}`).toBe(true);
          const named = list.shadowRoot?.querySelector('ol');
          if (named === null || named === undefined) {
            expect(list.shadowRoot?.querySelector('nph-empty'), `${name} ${locale}`).not.toBeNull();
          } else {
            expect(named.getAttribute('aria-label'), `${name} ${locale}`).toBeTruthy();
          }
        }
        target.remove();
      }
    });
  }

  it('Types: process and history, with 3, 4 and 5 items', () => {
    const lists = timelinesOf(renderStory(validation.Types as Renderable, 'en'));
    expect(lists.map((list) => [list.type, list.items.length])).toEqual([
      ['process', 3],
      ['process', 4],
      ['process', 5],
      ['history', 3],
      ['history', 4],
      ['history', 5],
    ]);
    for (const list of lists.filter((entry) => entry.type === 'process')) {
      const statuses = list.items.map((item) => item.status);
      expect(statuses.filter((status) => status === 'current')).toHaveLength(1);
      expect(statuses).toContain('completed');
      expect(statuses).toContain('pending');
    }
  });

  it('Short: two items and one item, in both types', () => {
    const lists = timelinesOf(renderStory(validation.Short as Renderable, 'en'));
    expect(lists.map((list) => [list.type, list.items.length])).toEqual([
      ['process', 2],
      ['process', 1],
      ['history', 2],
      ['history', 1],
    ]);
  });

  it('Markers: the dot, the circle in its six states with an icon and the avatar with and without a photo', () => {
    const items = itemsOf(renderStory(validation.Markers as Renderable, 'en'));
    const markers = new Set(items.map((item) => item.marker));
    expect([...markers].sort()).toEqual(['avatar', 'circle', 'dot']);
    const circles = new Set(items.filter((item) => item.marker === 'circle').map((item) => item.status));
    expect([...circles].sort()).toEqual(['completed', 'current', 'error', 'neutral', 'pending', 'warning']);
    expect(items.some((item) => item.marker === 'circle' && item.status === 'neutral' && (item.icon ?? '') !== '')).toBe(true);
    const avatars = items.filter((item) => item.marker === 'avatar');
    expect(avatars.some((item) => (item.avatar ?? '').startsWith('data:'))).toBe(true);
    expect(avatars.some((item) => (item.avatar ?? '') === '')).toBe(true);
    for (const item of items) expect((item.avatar ?? 'data:').startsWith('data:'), 'no network address').toBe(true);
  });

  it('Content: the long title, description, meta line, action and the rich content of the slot', () => {
    const target = renderStory(validation.Content as Renderable, 'en');
    const items = itemsOf(target);
    expect(items.some((item) => item.title.length > 80)).toBe(true);
    expect(items.some((item) => (item.description ?? '') !== '')).toBe(true);
    expect(items.some((item) => item.status === 'pending' && (item.who ?? '') !== '' && (item.when ?? '') === '')).toBe(true);
    expect(items.some((item) => (item.action ?? '') !== '' && item.actionDisabled !== true)).toBe(true);
    expect(items.some((item) => (item.action ?? '') !== '' && item.actionDisabled === true)).toBe(true);
    const cards = [...target.querySelectorAll('nph-timeline > nph-card')] as Array<HTMLElement & { type: string }>;
    expect(cards.map((card) => card.type).sort()).toEqual(['base', 'section']);
    for (const card of cards) {
      const id = card.getAttribute('slot') ?? '';
      expect(items.some((item) => item.id === id), `slot ${id}`).toBe(true);
    }
  });

  it('States: "Show more", the loading state and the empty state', () => {
    const lists = timelinesOf(renderStory(validation.States as Renderable, 'en'));
    expect(lists.map((list) => [list.hasMore, list.loading, list.items.length > 0])).toEqual([
      [true, false, true],
      [false, true, false],
      [false, false, false],
    ]);
  });

  it('Width: the same list at 22 and at 40 rem', () => {
    const target = renderStory(validation.Width as Renderable, 'en');
    const widths = [...target.querySelectorAll('nph-timeline')].map((list) => (list.parentElement as HTMLElement).style.inlineSize);
    expect(widths).toEqual(['22rem', '40rem']);
  });

  it('Examples: light and dark, with the captions of the chosen language, and the three required examples', () => {
    const story = validation.Examples as Renderable;
    for (const locale of LOCALES) {
      const target = renderStory(story, locale);
      const schemes = [...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes, locale).toEqual(['light', 'dark']);
      const captions = [...target.querySelectorAll('figcaption')].map((el) => el.textContent?.trim());
      const expected = translations(locale).timelineValidation;
      expect(captions, locale).toEqual([expected.lightCaption, expected.darkCaption]);
      for (const figure of target.querySelectorAll('figure[data-nph-color-scheme]')) {
        expect(timelinesOf(figure), locale).toHaveLength(3);
      }
      target.remove();
    }
  });

  it('Brands: the seven brands in light and dark, with the list inside every frame', () => {
    const target = renderStory(validation.Brands as Renderable, 'en');
    const frames = [...target.querySelectorAll(`[${FRAME_ATTRIBUTE}]`)];
    expect(frames).toHaveLength(BRANDS.length * SCHEMES.length);
    for (const frame of frames) {
      expect(timelinesOf(frame).length).toBeGreaterThan(0);
      expect(frame.hasAttribute('data-nph-brand')).toBe(true);
      expect(frame.hasAttribute('data-nph-color-scheme')).toBe(true);
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').timelineValidation);
    expect(shape(translations('pt-BR').timelineValidation)).toEqual(source);
    expect(shape(translations('es').timelineValidation)).toEqual(source);
  });
});

describe('nph-timeline documentation — order of the model', () => {
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
      expect(sections).toEqual([
        'when-to-use',
        'api',
        'usage',
        'types',
        'markers',
        'content',
        'loading-and-more',
        'keyboard',
        'relations',
        'anatomy',
        'accessibility',
        'examples',
        'references',
      ]);
      expect(target.querySelector('#anti-patterns')).toBeNull();
    });

    it(`${locale}: every section but References closes with its source`, () => {
      const target = renderInLocale(locale);
      const label = translations(locale).timelineDocs.sourceLabel as string;
      for (const section of target.querySelectorAll('section[id]')) {
        const closes = (section.textContent ?? '').includes(label);
        expect(closes, section.id).toBe(section.id !== 'references');
      }
    });

    it(`${locale}: one side-by-side use and do-not-use block`, () => {
      const target = renderInLocale(locale);
      const cards = [...target.querySelectorAll('[data-nph-card]')];
      expect(cards.map((card) => card.getAttribute('data-nph-card'))).toEqual(['success', 'error']);
      expect(cards[0]?.parentElement).toBe(cards[1]?.parentElement);
    });
  }
});
