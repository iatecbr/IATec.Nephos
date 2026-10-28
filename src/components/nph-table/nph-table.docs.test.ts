/**
 * Contract of the `nph-table` Documentation page and of its Validation stories: index with
 * no orphan anchor in all three languages, no leftover placeholder, the `tableDocs` and
 * `tableValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only
 * reads `.md` pairs), no text of another language on the English page, the three required
 * examples in light and dark mode, every variant on some story, and the exact set of
 * Validation stories.
 *
 * The two "When to use" lists of the English dictionary equal the `use_when` and
 * `do_not_use_when` of the generated Metadata, item by item. The page reads them from
 * the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import metadata from '../../shared/metadata/nph-table.json';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import { Documentation } from './nph-table.docs.stories';
import * as validation from './nph-table.stories';
import type { NphTable } from './nph-table';

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

/** Every table of a target, once drawn. */
async function drawn(target: HTMLElement): Promise<NphTable[]> {
  const tables = [...target.querySelectorAll('nph-table')] as NphTable[];
  await Promise.all(tables.map((element) => element.updateComplete));
  return tables;
}

/** The text a table shows, including its shadow root. */
function shown(element: NphTable): string {
  return element.shadowRoot?.textContent ?? '';
}

describe('nph-table Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-table');
    });

    it(`${locale}: no {name} placeholder is left on the page, nor in the tables`, async () => {
      const target = renderInLocale(locale);
      expect(target.textContent ?? '').not.toMatch(/\{\w+\}/);
      for (const element of await drawn(target)) {
        expect(shown(element)).not.toMatch(/\{\w+\}/);
        for (const button of element.shadowRoot?.querySelectorAll('nph-button') ?? []) {
          expect(button.getAttribute('label') ?? '').not.toMatch(/\{\w+\}/);
        }
      }
    });

    it(`${locale}: every table on the page renders, with a name`, async () => {
      const tables = await drawn(renderInLocale(locale));
      expect(tables.length).toBeGreaterThan(0);
      for (const element of tables) {
        expect(element.hasAttribute('data-nph-rendered'), element.outerHTML.slice(0, 80)).toBe(true);
        expect(element.caption.trim() !== '' || element.label.trim() !== '').toBe(true);
      }
    });

    it(`${locale}: the matrix shows the two sizes without and with the frame`, async () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const tables = await drawn(matrix);
      expect(tables.map((element) => [element.size, element.framed])).toEqual([
        ['default', false],
        ['default', true],
        ['large', false],
        ['large', true],
      ]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')] as HTMLElement[];
      expect(demos).toHaveLength(3);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
      }
      const [grouped, order, caption] = demos as [HTMLElement, HTMLElement, HTMLElement];
      for (const frame of grouped.querySelectorAll('[data-nph-color-scheme]')) {
        const [element] = await drawn(frame as HTMLElement);
        /* Group rows open with their items, and the total in the footer. */
        expect(element?.shadowRoot?.querySelectorAll('tbody tr[aria-level="1"]').length).toBeGreaterThan(0);
        expect(element?.shadowRoot?.querySelectorAll('tbody tr[aria-level="2"]').length).toBeGreaterThan(0);
        expect(element?.shadowRoot?.querySelector('tfoot')).not.toBeNull();
      }
      for (const frame of order.querySelectorAll('[data-nph-color-scheme]')) {
        const [element] = await drawn(frame as HTMLElement);
        const item = element?.shadowRoot?.querySelector('tr.detail .item');
        expect(item?.querySelector('nph-image')?.getAttribute('src')).toBeTruthy();
      }
      for (const frame of caption.querySelectorAll('[data-nph-color-scheme]')) {
        const [element] = await drawn(frame as HTMLElement);
        expect(element?.caption).toBeTruthy();
        expect(element?.total).toBeTruthy();
        expect(element?.shadowRoot?.querySelector('.caption nph-badge')).not.toBeNull();
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['tableDocs', 'tableValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key])).toEqual(source);
      expect(shape(translations('es')[key])).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').tableDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).tableDocs);
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
      expect(translations(locale).tableDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).tableDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-table Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').tableDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').tableDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-table Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `StickyHeader` is `sticky-header`. */
  const idOf = (name: string): string =>
    `components-nph-table-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the ten pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'Caption',
      'CellContents',
      'EmptyBody',
      'ExpandingRow',
      'Frame',
      'RowStates',
      'Sizes',
      'StickyHeader',
      'Tree',
      'TwoLevelHeader',
    ]);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        expect(frames.map((el) => el.getAttribute('data-nph-color-scheme')), `${name} ${locale}`).toEqual(['light', 'dark']);
        const expected = translations(locale).tableValidation;
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-table · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every table renders, with no placeholder left and every text from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const tables = await drawn(target);
        expect(tables.length, name).toBeGreaterThan(0);
        const sample = new Set(leaves(translations(locale).tableValidation.sample));
        for (const element of tables) {
          expect(element.hasAttribute('data-nph-rendered'), element.outerHTML.slice(0, 80)).toBe(true);
          expect(shown(element)).not.toMatch(/\{\w+\}/);
          for (const th of element.shadowRoot?.querySelectorAll('th') ?? []) {
            expect(sample.has(th.textContent?.trim() ?? ''), `${name} ${locale}: ${th.textContent}`).toBe(true);
          }
        }
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

  it('Sizes: default and large', async () => {
    const tables = await drawn(draw(validation.Sizes as Renderable, 'en').querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
    expect(tables.map((element) => element.size)).toEqual(['default', 'large']);
  });

  it('Frame: without and with the frame', async () => {
    const tables = await drawn(draw(validation.Frame as Renderable, 'en').querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
    expect(tables.map((element) => element.framed)).toEqual([false, true]);
  });

  it('StickyHeader: a framed table with the fixed header over a body that scrolls', async () => {
    const [element] = await drawn(draw(validation.StickyHeader as Renderable, 'en').querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
    expect([element?.stickyHeader, element?.framed]).toEqual([true, true]);
    const area = element?.shadowRoot?.querySelector('.scroll') as HTMLElement;
    expect(area.scrollHeight).toBeGreaterThan(area.clientHeight);
  });

  it('RowStates: stripe, grid, and both with the frame', async () => {
    const tables = await drawn(draw(validation.RowStates as Renderable, 'en').querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
    expect(tables.map((element) => [element.striped, element.grid])).toEqual([
      [true, false],
      [false, true],
      [true, true],
    ]);
  });

  it('CellContents: every composite cell type and the no-value dash', async () => {
    const tables = await drawn(draw(validation.CellContents as Renderable, 'en').querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
    const types = new Set<string>();
    for (const element of tables) {
      for (const row of element.rows) {
        for (const cell of Object.values(row.cells)) {
          types.add(cell !== null && typeof cell === 'object' ? cell.type : cell === null || cell === undefined || cell === '' ? 'no-value' : 'plain');
        }
      }
    }
    expect([...types].sort()).toEqual(
      ['actions', 'badge', 'button', 'icon-text', 'link', 'loading', 'mixed-actions', 'no-value', 'person', 'rating', 'status', 'thumbnail', 'truncated'].sort(),
    );
  });

  it('ExpandingRow: closed, open and loading', async () => {
    const [element] = await drawn(draw(validation.ExpandingRow as Renderable, 'en').querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
    expect(element?.rows.map((row) => [Boolean(row.open), Boolean(row.loading)])).toEqual([
      [false, false],
      [true, false],
      [false, true],
    ]);
    expect(element?.shadowRoot?.querySelectorAll('tr.detail')).toHaveLength(1);
  });

  it('Tree: three levels open, in a treegrid (P101)', async () => {
    const [element] = await drawn(draw(validation.Tree as Renderable, 'en').querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
    expect(element?.shadowRoot?.querySelector('table')?.getAttribute('role')).toBe('treegrid');
    const levels = [...(element?.shadowRoot?.querySelectorAll('tbody tr.row') ?? [])].map((row) => row.getAttribute('aria-level'));
    expect(levels).toEqual(['1', '2', '3', '2', '1']);
  });

  it('TwoLevelHeader: a group title over two columns', async () => {
    const [element] = await drawn(draw(validation.TwoLevelHeader as Renderable, 'en').querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
    const group = element?.shadowRoot?.querySelector('th[scope="colgroup"]') as HTMLTableCellElement;
    expect(group.colSpan).toBe(2);
  });

  it('EmptyBody: the nph-empty with the header visible', async () => {
    const [element] = await drawn(draw(validation.EmptyBody as Renderable, 'en').querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
    expect(element?.shadowRoot?.querySelector('nph-empty')).not.toBeNull();
    expect(element?.shadowRoot?.querySelectorAll('thead th').length).toBeGreaterThan(0);
  });
});

describe('nph-table documentation — order of the model', () => {
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
      expect(sections).toEqual([
        'when-to-use',
        'api',
        'variants',
        'states',
        'cell-contents',
        'rows',
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
