/**
 * Contract of the `nph-sidebar-item` Documentation page and of its Validation stories: index
 * with no orphan anchor in all three languages, no leftover placeholder, the `type` × state
 * matrix, the three required examples in light and dark mode, the subitem and rail button
 * sections with their API, the `sidebarItemDocs` and `sidebarItemValidation` dictionaries
 * with the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of
 * another language on the English page, the two "When to use" lists equal to the ones of the
 * item sheet, and every property of the three sheets named on the page. The page reads the
 * lists from the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every
 * page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-sidebar-item.json';
import railMetadata from '../../shared/metadata/nph-sidebar-rail-button.json';
import subitemMetadata from '../../shared/metadata/nph-sidebar-subitem.json';
import { Documentation } from './nph-sidebar-item.docs.stories';
import * as validation from './nph-sidebar-item.stories';
import type { NphSidebarItem } from './nph-sidebar-item';
import type { NphSidebarRailButton } from '../nph-sidebar-rail-button/nph-sidebar-rail-button';
import type { NphSidebarSubitem } from '../nph-sidebar-subitem/nph-sidebar-subitem';

afterEach(() => {
  document.body.replaceChildren();
});

const LOCALES = ['pt-BR', 'en', 'es'] as const;
const PIECES = 'nph-sidebar-item, nph-sidebar-subitem, nph-sidebar-rail-button';

type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
type Line = NphSidebarItem | NphSidebarSubitem | NphSidebarRailButton;

function draw(story: Renderable, locale: string): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
  return target;
}

const renderInLocale = (locale: string): HTMLElement => draw(Documentation as unknown as Renderable, locale);

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

async function ready(target: HTMLElement): Promise<Line[]> {
  const lines = [...target.querySelectorAll<Line>(PIECES)];
  await Promise.all(lines.map((line) => line.updateComplete));
  return lines;
}

/** The visible text of a line: the label of the item and the subitem, the name of the rail button. */
function textOf(line: Line): string[] {
  const texts = [line.label];
  if ('tooltip' in line && line.tooltip !== '') texts.push(line.tooltip);
  if ('actionsLabel' in line && line.actionsLabel !== '') texts.push(line.actionsLabel);
  if ('actions' in line) {
    for (const entry of line.actions) {
      if ('text' in entry) texts.push(entry.text);
    }
  }
  return texts;
}

describe('nph-sidebar-item Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title, and the page is nph-sidebar-item`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-sidebar-item');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every line draws, with its text from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const lines = await ready(target);
      const allowed = new Set(leaves(translations(locale).sidebarItemDocs));
      expect(lines.length).toBeGreaterThan(0);
      for (const line of lines) {
        expect(line.hasAttribute('data-nph-rendered'), line.outerHTML).toBe(true);
        for (const value of textOf(line)) {
          expect(allowed.has(value), value).toBe(true);
        }
      }
    });

    it(`${locale}: the matrix crosses type with rest, active and disabled; a group is never active`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const items = [...matrix.querySelectorAll('nph-sidebar-item')] as NphSidebarItem[];
      expect(items).toHaveLength(10);
      expect(items.filter((item) => item.active)).toHaveLength(2);
      expect(items.filter((item) => item.type === 'group' && item.active)).toHaveLength(0);
      expect(items.filter((item) => item.disabled)).toHaveLength(4);
      expect(items.filter((item) => item.counter !== null)).toHaveLength(3);
      expect(items.filter((item) => item.expanded)).toHaveLength(2);
    });

    it(`${locale}: the three required examples, each in light and dark mode`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#required-examples') as HTMLElement;
      const figures = [...examples.querySelectorAll('figure[data-nph-color-scheme]')];
      expect(figures.map((figure) => figure.getAttribute('data-nph-color-scheme'))).toEqual(['light', 'dark', 'light', 'dark', 'light', 'dark']);
      const [main, , group, , collapsed] = figures as HTMLElement[];
      expect((main?.querySelectorAll('nph-sidebar-item') ?? []).length).toBe(5);
      expect([...(main?.querySelectorAll<NphSidebarItem>('nph-sidebar-item') ?? [])].filter((item) => item.active)).toHaveLength(1);
      expect([...(main?.querySelectorAll<NphSidebarItem>('nph-sidebar-item') ?? [])].filter((item) => item.counter !== null)).toHaveLength(1);
      expect(group?.querySelector<NphSidebarItem>('nph-sidebar-item[type="group"]')?.expanded).toBe(true);
      expect((group?.querySelectorAll('nph-sidebar-subitem') ?? []).length).toBe(3);
      expect((collapsed?.querySelectorAll('nph-sidebar-rail-button') ?? []).length).toBe(5);
      expect(collapsed?.querySelector('nph-sidebar-item')).toBeNull();
    });

    it(`${locale}: the subitem, rail button and more actions sections show their pieces`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      expect(target.querySelectorAll('section#subitem nph-sidebar-subitem[options]')).toHaveLength(1);
      expect(target.querySelectorAll('section#rail-button nph-sidebar-rail-button')).toHaveLength(5);
      const withActions = target.querySelector<NphSidebarItem>('section#tooltip-and-more-actions nph-sidebar-item[actions-label]');
      expect(withActions?.actions.length).toBeGreaterThan(0);
      expect(target.querySelector<NphSidebarItem>('section#tooltip-and-more-actions nph-sidebar-item')?.tooltip).not.toBe('');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['sidebarItemDocs', 'sidebarItemValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').sidebarItemDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).sidebarItemDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('the open group example follows the group, as nph-sidebar will', () => {
  const cases: Array<[string, Renderable, string]> = [
    ['Docs', Documentation as unknown as Renderable, 'section#required-examples'],
    ['Validation', validation.Examples as unknown as Renderable, 'main'],
  ];

  for (const [page, story, scope] of cases) {
    it(`${page}: closing the group hides its subitems and takes them out of the Tab order; opening shows them again`, async () => {
      const target = draw(story, 'en');
      await ready(target);
      const group = target.querySelector<NphSidebarItem>(`${scope} nph-sidebar-item[type="group"]`) as NphSidebarItem;
      const subitems = group.nextElementSibling as HTMLElement;
      const button = group.shadowRoot?.querySelector('.control') as HTMLElement;
      const first = subitems.querySelector('nph-sidebar-subitem') as HTMLElement;
      expect(subitems.querySelectorAll('nph-sidebar-subitem')).toHaveLength(3);
      expect(first.getClientRects().length).toBeGreaterThan(0);

      await userEvent.click(button);
      await group.updateComplete;
      expect(group.expanded).toBe(false);
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(first.getClientRects()).toHaveLength(0);
      button.focus();
      await userEvent.keyboard('{Tab}');
      expect(subitems.contains(document.activeElement)).toBe(false);

      button.focus();
      await userEvent.keyboard('{Enter}');
      await group.updateComplete;
      expect(group.expanded).toBe(true);
      expect(first.getClientRects().length).toBeGreaterThan(0);
      await userEvent.keyboard('{Tab}');
      expect(document.activeElement).toBe(first);
      target.remove();
    });
  }
});

describe('nph-sidebar-item Documentation: the lists of the page are the lists of the sheets', () => {
  it('"When to use" is the use_when of the item sheet, item by item', () => {
    expect(translations('en').sidebarItemDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the item sheet, item by item', () => {
    expect(translations('en').sidebarItemDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).sidebarItemDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).sidebarItemDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  const named = (rows: Array<[string, string]>): string[] => rows.flatMap(([terms]) => terms.split(',').map((term) => term.trim()));

  it('the API of the page names every property and event of the item sheet', () => {
    const terms = named(translations('en').sidebarItemDocs.api);
    for (const property of Object.keys(metadata.api)) {
      expect(terms, property).toContain(property);
    }
  });

  it('the subitem and rail button tables name every property of their sheets', () => {
    const subitem = named(translations('en').sidebarItemDocs.subitemApi);
    for (const property of Object.keys(subitemMetadata.api)) {
      expect(subitem, property).toContain(property);
    }
    const rail = named(translations('en').sidebarItemDocs.railApi);
    for (const property of Object.keys(railMetadata.api)) {
      expect(rail, property).toContain(property);
    }
  });
});

describe('nph-sidebar-item Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `RailButton` is `rail-button`. */
  const idOf = (name: string): string =>
    `components-nph-sidebar-item-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the six pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Examples', 'InvalidInput', 'Matrix', 'RailButton', 'Subitem', 'TooltipAndMoreActions']);
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-sidebar-item · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every visible text comes from the dictionary, in light and in dark mode`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(leaves(translations(locale).sidebarItemValidation));
        for (const line of await ready(target)) {
          for (const value of textOf(line)) {
            if (value !== '') {
              expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
            }
          }
        }
        const schemes = [...target.querySelectorAll('figure[data-nph-color-scheme]')].map((figure) => figure.getAttribute('data-nph-color-scheme'));
        expect(schemes.filter((scheme) => scheme === 'light').length).toBeGreaterThan(0);
        expect(schemes.filter((scheme) => scheme === 'light')).toHaveLength(schemes.filter((scheme) => scheme === 'dark').length);
        target.remove();
      }
    });
  }

  it('InvalidInput draws nothing in each of its cells', async () => {
    const target = draw(validation.InvalidInput as unknown as Renderable, 'en');
    const lines = await ready(target);
    expect(lines.length).toBe(8);
    for (const line of lines) {
      expect(line.hasAttribute('data-nph-rendered'), line.outerHTML).toBe(false);
    }
  });
});
