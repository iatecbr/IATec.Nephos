/**
 * Contract of the `nph-resizable` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, the `resizableDocs` and
 * `resizableValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads
 * `.md` pairs), no text of another language on the English page, and the two "When to use" lists
 * equal to the ones of the sheet (page and sheet match, with no item dropped). The page reads the
 * lists from the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-resizable.json';
import { Documentation } from './nph-resizable.docs.stories';
import * as validation from './nph-resizable.stories';
import type { NphResizable } from './nph-resizable';

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

type Group = NphResizable & { updateComplete: Promise<unknown> };

async function ready(target: HTMLElement): Promise<Group[]> {
  const groups = [...target.querySelectorAll('nph-resizable')] as Group[];
  await Promise.all(groups.map((group) => group.updateComplete));
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  await Promise.all(groups.map((group) => group.updateComplete));
  return groups;
}

describe('nph-resizable Documentation', () => {
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
      expect(header?.textContent?.trim()).toBe('nph-resizable');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every group on the page renders, has two or three named panels and the labels of its button`, async () => {
      const target = renderInLocale(locale);
      const groups = await ready(target);
      expect(groups.length).toBeGreaterThan(0);
      for (const group of groups) {
        expect(group.hasAttribute('data-nph-rendered'), group.outerHTML).toBe(true);
        const panels = [...group.children];
        expect([2, 3], group.outerHTML).toContain(panels.length);
        for (const panel of panels) {
          expect((panel.getAttribute('aria-label') ?? '').trim(), panel.outerHTML).not.toBe('');
          expect(panel.getAttribute('role'), panel.outerHTML).toBe('group');
        }
        if (!group.hasAttribute('hide-collapse-button')) {
          expect((group.getAttribute('collapse-label') ?? '').trim(), group.outerHTML).not.toBe('');
          expect((group.getAttribute('expand-label') ?? '').trim(), group.outerHTML).not.toBe('');
        }
      }
    });

    it(`${locale}: the matrix shows two and three panels, in both directions`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['panels: 2', 'panels: 3']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        panels: [...tr.querySelectorAll('td')].map((cell) => cell.querySelector('nph-resizable')?.children.length),
        direction: [...tr.querySelectorAll('td')].map((cell) => cell.querySelector('nph-resizable')?.getAttribute('direction')),
      }));
      expect(rows).toEqual([
        { label: 'direction: horizontal', panels: [2, 3], direction: ['horizontal', 'horizontal'] },
        { label: 'direction: vertical', panels: [2, 3], direction: ['vertical', 'vertical'] },
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
      const shown = demos.map((entry) => {
        const group = entry.querySelector('nph-resizable') as HTMLElement;
        return {
          direction: group.getAttribute('direction'),
          panels: group.children.length,
          nested: group.querySelector('nph-resizable') !== null,
          collapsed: group.getAttribute('sizes'),
        };
      });
      expect(shown).toEqual([
        { direction: 'horizontal', panels: 2, nested: false, collapsed: null },
        { direction: 'horizontal', panels: 2, nested: true, collapsed: null },
        { direction: 'horizontal', panels: 2, nested: false, collapsed: '0 100' },
      ]);
    });

    it(`${locale}: the keyboard section names the keys of the Window Splitter and that F6 is not used`, () => {
      const section = renderInLocale(locale).querySelector('section#keyboard') as HTMLElement;
      const terms = [...section.querySelectorAll('tbody th')].map((th) => th.textContent?.trim() ?? '');
      expect(terms.join(' ')).toContain('Enter');
      expect(terms.join(' ')).toContain('Home');
      expect(terms.join(' ')).toContain('F6');
      expect(terms.join(' ')).toContain('Shift');
    });

    it(`${locale}: the accessibility section names the separator, its values and the names`, () => {
      const section = renderInLocale(locale).querySelector('section#accessibility') as HTMLElement;
      expect(section.textContent ?? '').toContain('separator');
      expect(section.textContent ?? '').toContain('aria-valuenow');
      expect(section.textContent ?? '').toContain('aria-expanded');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').resizableDocs);
    expect(shape(translations('pt-BR').resizableDocs)).toEqual(source);
    expect(shape(translations('es').resizableDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').resizableDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).resizableDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-resizable Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').resizableDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').resizableDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).resizableDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).resizableDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-resizable Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `HandleStates` is `handle-states`. */
  const idOf = (name: string): string =>
    `components-nph-resizable-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the eight pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'Brands',
      'Collapsed',
      'Examples',
      'HandleStates',
      'Interactive',
      'Limits',
      'Matrix',
      'Nested',
    ]);
  });

  it('Matrix: two and three panels in both directions, in both modes', async () => {
    const target = draw(validation.Matrix as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const groups = [...frame.querySelectorAll('nph-resizable')];
    expect(groups.map((group) => `${group.getAttribute('direction')} ${group.children.length}`)).toEqual([
      'horizontal 2',
      'horizontal 3',
      'vertical 2',
      'vertical 3',
    ]);
    await ready(target);
  });

  it('HandleStates: the handle at rest, disabled and with the collapse button off, in both directions', async () => {
    const target = draw(validation.HandleStates as Renderable, 'en');
    const frame = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const groups = [...frame.querySelectorAll('nph-resizable')];
    expect(groups.map((group) => [group.getAttribute('direction'), group.hasAttribute('disabled'), group.hasAttribute('hide-collapse-button')])).toEqual([
      ['horizontal', false, false],
      ['horizontal', true, false],
      ['horizontal', false, true],
      ['vertical', false, false],
      ['vertical', true, false],
      ['vertical', false, true],
    ]);
    await ready(target);
  });

  it('Brands: the seven brands in light and dark, the group inside every frame', () => {
    const target = draw(validation.Brands as Renderable, 'en');
    const frames = [...target.querySelectorAll('[data-nph-brand-frame]')];
    expect(frames).toHaveLength(14);
    for (const frame of frames) expect(frame.querySelector('nph-resizable')).not.toBeNull();
  });

  for (const [name, story] of stories) {
    it(`${name}: the title, the claim and the sidebar label are in the dictionary, in every language`, () => {
      for (const locale of LOCALES) {
        const id = idOf(name);
        const label = sidebarLabel(id, locale);
        const claim = translations(locale).validationPages.claims[id];
        expect(label, `${locale} sidebar ${id}`).toBeTruthy();
        expect(claim, `${locale} claim ${id}`).toBeTruthy();
        const target = draw(story, locale);
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-resizable · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every group renders and every name and label comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).resizableValidation));
        const groups = await ready(target);
        expect(groups.length, name).toBeGreaterThan(0);
        for (const group of groups) {
          expect(group.hasAttribute('data-nph-rendered'), group.outerHTML).toBe(true);
          if (!group.hasAttribute('hide-collapse-button')) {
            expect(allowed.has(group.getAttribute('collapse-label') ?? ''), `${name} ${locale}: ${group.getAttribute('collapse-label')}`).toBe(true);
            expect(allowed.has(group.getAttribute('expand-label') ?? ''), `${name} ${locale}: ${group.getAttribute('expand-label')}`).toBe(true);
          }
          for (const panel of group.children) {
            expect(allowed.has(panel.getAttribute('aria-label') ?? ''), `${name} ${locale}: ${panel.getAttribute('aria-label')}`).toBe(true);
          }
        }
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('there is no story per brand but Brands: the page follows the global brand, the frame only sets the mode', () => {
    for (const [name, story] of stories) {
      if (name === 'Brands') continue;
      const target = draw(story, 'en');
      expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      target.remove();
    }
  });

  it('Interactive: a key changes the sizes and shows detail.sizes in the status text', async () => {
    const story = validation.Interactive as Renderable;
    for (const locale of LOCALES) {
      const target = draw(story, locale);
      const v = translations(locale).resizableValidation;
      const [group] = await ready(target);
      const status = target.querySelector('output') as HTMLOutputElement;
      expect(status.textContent).toBe(v.statusIdle);
      const separator = group!.shadowRoot!.querySelector('.separator') as HTMLElement;
      separator.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true, composed: true, cancelable: true }));
      expect(status.textContent).toBe(v.statusChanged.replace('{sizes}', '45 55'));
      target.remove();
    }
  });

  it('Collapsed: the first panel is collapsed and the chevron points away', async () => {
    const target = draw(validation.Collapsed as Renderable, 'en');
    const [first] = await ready(target);
    expect(first!.sizes).toEqual([0, 100]);
    expect(first!.shadowRoot!.querySelector('.collapse')?.getAttribute('icon-start')).toBe('chevron-right');
    target.remove();
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').resizableValidation);
    expect(shape(translations('pt-BR').resizableValidation)).toEqual(source);
    expect(shape(translations('es').resizableValidation)).toEqual(source);
  });
});

describe('nph-resizable documentation — order of the model', () => {
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
        'handle',
        'sizes',
        'collapse',
        'keyboard',
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
