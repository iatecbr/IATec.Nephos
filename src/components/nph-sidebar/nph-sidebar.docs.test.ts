/**
 * Contract of the `nph-sidebar` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, the `mode` × `state` matrix, the
 * four required examples in light and dark mode (and the third level of the expanded menu), the
 * flyout panels the examples show open, the `sidebarDocs` and `sidebarValidation` dictionaries with
 * the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of another
 * language on the English page, the two "When to use" lists equal to the ones of the sheet, and
 * every property and event of the sheet named on the page. The page reads the lists from the
 * Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nothing, render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-sidebar.json';
import { Documentation } from './nph-sidebar.docs.stories';
import * as validation from './nph-sidebar.stories';
import type { NphSidebar, NphSidebarEntry } from './nph-sidebar';

afterEach(() => {
  document.body.replaceChildren();
});

const LOCALES = ['pt-BR', 'en', 'es'] as const;

type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };

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

async function ready(target: HTMLElement): Promise<NphSidebar[]> {
  const menus = [...target.querySelectorAll<NphSidebar>('nph-sidebar')];
  await Promise.all(menus.map((menu) => menu.updateComplete));
  return menus;
}

/** The visible text of a menu: its names, its messages and the text of every entry. */
function textOf(menu: NphSidebar): string[] {
  const texts = [menu.label, menu.collapseLabel, menu.expandLabel, menu.closeLabel, menu.searchLabel, menu.searchPlaceholder, menu.cornerLabel, menu.emptyText, menu.errorText];
  for (const entry of menu.items as readonly NphSidebarEntry[]) {
    if ('text' in entry) texts.push(entry.text);
    if ('label' in entry) texts.push(entry.label);
    if ('children' in entry) {
      for (const child of entry.children) {
        texts.push(child.label);
        for (const option of child.options ?? []) texts.push(option.label);
      }
    }
  }
  return texts.filter((value) => value !== '' && value !== undefined);
}

/** The buttons of the product that open the mobile menu. */
const phoneButtons = (scope: ParentNode): HTMLElement[] => [...scope.querySelectorAll<HTMLElement>('nph-button')];

describe('nph-sidebar Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title, and the page is nph-sidebar`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-sidebar');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every menu draws, with its text from the dictionary`, async () => {
      const target = renderInLocale(locale);
      const menus = await ready(target);
      const allowed = new Set(leaves(translations(locale).sidebarDocs));
      expect(menus.length).toBeGreaterThan(0);
      for (const menu of menus) {
        expect(menu.hasAttribute('data-nph-rendered'), menu.outerHTML).toBe(true);
        for (const value of textOf(menu)) {
          expect(allowed.has(value), value).toBe(true);
        }
      }
    });

    it(`${locale}: the matrix crosses mode with ready and loading; the phone cells draw the button, never an open modal`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const menus = [...matrix.querySelectorAll<NphSidebar>('nph-sidebar')];
      expect(menus).toHaveLength(6);
      expect(menus.map((menu) => menu.mode)).toEqual(['expanded', 'expanded', 'collapsed', 'collapsed', 'mobile', 'mobile']);
      expect(menus.map((menu) => menu.loading)).toEqual([false, true, false, true, false, true]);
      expect(menus.filter((menu) => menu.open)).toHaveLength(0);
      expect(phoneButtons(matrix)).toHaveLength(2);
      expect(document.querySelector('dialog[open]')).toBeNull();
    });

    it(`${locale}: the required examples, each in light and dark mode`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#required-examples') as HTMLElement;
      const figures = [...examples.querySelectorAll('figure[data-nph-color-scheme]')];
      expect(figures.map((figure) => figure.getAttribute('data-nph-color-scheme'))).toEqual(
        ['light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark'],
      );
      const [main, , loading, , phone, , collapsed, , third] = figures as HTMLElement[];
      const mainMenu = main?.querySelector<NphSidebar>('nph-sidebar') as NphSidebar;
      expect(mainMenu.mode).toBe('expanded');
      expect(mainMenu.cornerLabel).not.toBe('');
      expect(mainMenu.hideCornerButton).toBe(false);
      expect((mainMenu.items as NphSidebarEntry[]).filter((entry) => 'active' in entry && entry.active === true)).toHaveLength(1);
      expect(loading?.querySelector<NphSidebar>('nph-sidebar')?.loading).toBe(true);
      expect(phone?.querySelector<NphSidebar>('nph-sidebar')?.mode).toBe('mobile');
      expect(phoneButtons(phone as HTMLElement)).toHaveLength(1);
      expect(collapsed?.querySelector<NphSidebar>('nph-sidebar')?.mode).toBe('collapsed');
      expect(third?.querySelector<NphSidebar>('nph-sidebar')?.mode).toBe('expanded');
    });

    it(`${locale}: an example shows its flyout panels open while it is on the screen, and closes them when it leaves`, async () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#required-examples') as HTMLElement;
      const figures = [...examples.querySelectorAll('figure[data-nph-color-scheme]')];
      const levels = (menu: NphSidebar): Array<string | null> =>
        [...(menu.shadowRoot?.querySelectorAll('.flyout') ?? [])].map((panel) => panel.getAttribute('data-level'));
      const collapsed = figures[6]?.querySelector<NphSidebar>('nph-sidebar') as NphSidebar;
      const expanded = figures[8]?.querySelector<NphSidebar>('nph-sidebar') as NphSidebar;
      /* Far apart on the page: the one at the top of the screen opens, the other one stays closed. */
      (figures[6] as HTMLElement).style.display = 'block';
      document.body.prepend(figures[6] as HTMLElement);
      await vi.waitFor(() => expect(levels(collapsed)).toEqual(['2', '3']));
      expect(levels(expanded)).toEqual([]);
      /* The first one leaves the screen: its panels close, and the second one opens. */
      (figures[6] as HTMLElement).style.display = 'none';
      document.body.prepend(figures[8] as HTMLElement);
      await vi.waitFor(() => expect(levels(expanded)).toEqual(['3']));
      await vi.waitFor(() => expect(levels(collapsed)).toEqual([]));
    });
  }

  it('removing the page disconnects the observers of the examples and drops the presses still waiting', async () => {
    const observed = new Set<IntersectionObserver>();
    const disconnected = new Set<IntersectionObserver>();
    const observe = IntersectionObserver.prototype.observe;
    const disconnect = IntersectionObserver.prototype.disconnect;
    vi.spyOn(IntersectionObserver.prototype, 'observe').mockImplementation(function (this: IntersectionObserver, element: Element) {
      observed.add(this);
      return observe.call(this, element);
    });
    vi.spyOn(IntersectionObserver.prototype, 'disconnect').mockImplementation(function (this: IntersectionObserver) {
      disconnected.add(this);
      return disconnect.call(this);
    });
    const target = renderInLocale('en');
    const menus = [...target.querySelectorAll<NphSidebar>('nph-sidebar')];
    expect(observed.size).toBeGreaterThan(0);
    expect(disconnected.size).toBe(0);
    render(nothing, target);
    expect([...observed].every((observer) => disconnected.has(observer))).toBe(true);
    /* Nothing is pressed after the removal: the menus stay closed. */
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(menus.every((menu) => menu.openSecond === null && menu.openThird === null)).toBe(true);
    vi.restoreAllMocks();
  });

  it('the phone button opens the mobile menu, and Esc closes it and gives the focus back', async () => {
    const target = renderInLocale('en');
    const [button] = phoneButtons(target.querySelector('section#required-examples') as HTMLElement);
    const menu = button?.parentElement?.querySelector<NphSidebar>('nph-sidebar') as NphSidebar;
    await menu.updateComplete;
    (button?.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
    await menu.updateComplete;
    expect(menu.open).toBe(true);
    expect((menu.shadowRoot?.querySelector('dialog') as HTMLDialogElement).open).toBe(true);
    menu.shadowRoot?.querySelector('dialog')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(menu.open).toBe(false));
  });

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['sidebarDocs', 'sidebarValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').sidebarDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).sidebarDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-sidebar Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').sidebarDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').sidebarDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).sidebarDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).sidebarDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });

  const named = (rows: Array<[string, string]>): string[] => rows.flatMap(([terms]) => terms.split(',').map((term) => term.trim()));

  it('the API of the page names every property and event of the sheet', () => {
    const terms = named(translations('en').sidebarDocs.api);
    for (const property of Object.keys(metadata.api)) {
      expect(terms, property).toContain(property);
    }
  });

  it('the page records the known limit of the collapse button, with no name of a person and no date', () => {
    for (const locale of LOCALES) {
      const rendered = renderInLocale(locale).textContent ?? '';
      const d = translations(locale).sidebarDocs;
      expect(rendered).toContain(d.knownLimitTitle);
      expect(rendered).toContain(d.knownLimitText);
      expect(d.knownLimitText).not.toMatch(/\d{4}|Indiane|Elvys/);
    }
  });
});

describe('nph-sidebar Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `InvalidInput` is `invalid-input`. */
  const idOf = (name: string): string =>
    `components-nph-sidebar-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the nine pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Brands', 'Examples', 'Flyout', 'InvalidInput', 'Loading', 'Messages', 'Mobile', 'Modes', 'Parts']);
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-sidebar · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every visible text comes from the dictionary, in light and in dark mode`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(leaves(translations(locale).sidebarValidation));
        for (const menu of await ready(target)) {
          for (const value of textOf(menu)) {
            expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
          }
        }
        for (const button of phoneButtons(target)) {
          expect(allowed.has((button as HTMLElement & { text: string }).text), `${name} ${locale}: button`).toBe(true);
        }
        // The shape of the brand frames is proved in src/shared/tokens/brand-validation.test.ts.
        if (name === 'Brands') {
          target.remove();
          continue;
        }
        const schemes = [...target.querySelectorAll('figure[data-nph-color-scheme]')].map((figure) => figure.getAttribute('data-nph-color-scheme'));
        expect(schemes.filter((scheme) => scheme === 'light').length).toBeGreaterThan(0);
        expect(schemes.filter((scheme) => scheme === 'light')).toHaveLength(schemes.filter((scheme) => scheme === 'dark').length);
        target.remove();
      }
    });
  }

  it('Brands: the menu is in each of the fourteen frames, expanded and collapsed', async () => {
    const target = draw(validation.Brands as unknown as Renderable, 'en');
    const frames = [...target.querySelectorAll('[data-nph-brand-frame]')];
    expect(frames).toHaveLength(14);
    for (const frame of frames) {
      const menus = [...frame.querySelectorAll<NphSidebar>('nph-sidebar')];
      expect(menus.map((menu) => menu.mode)).toEqual(['expanded', 'collapsed']);
    }
  });

  it('only the Brands story carries data-nph-brand: the other pages follow the root brand, the frame only sets the mode', () => {
    for (const [name, story] of stories) {
      const target = draw(story, 'en');
      if (name === 'Brands') {
        const branded = [...target.querySelectorAll('[data-nph-brand]')];
        expect(branded, name).toHaveLength(14);
        for (const frame of branded) {
          expect(frame.hasAttribute('data-nph-color-scheme'), name).toBe(true);
          expect(frame.hasAttribute('data-nph-brand-frame'), name).toBe(true);
        }
      } else {
        expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      }
      target.remove();
    }
  });

  it('no page draws an open modal by itself: the phone menus start closed', async () => {
    for (const name of ['Mobile', 'Examples'] as const) {
      const target = draw(validation[name] as unknown as Renderable, 'en');
      const phones = (await ready(target)).filter((menu) => menu.mode === 'mobile');
      expect(phones.length).toBeGreaterThan(0);
      expect(phones.filter((menu) => menu.open)).toHaveLength(0);
      target.remove();
    }
  });

  it('InvalidInput draws nothing for a mode outside the three and leaves out the entries that cannot be drawn', async () => {
    const target = draw(validation.InvalidInput as unknown as Renderable, 'en');
    const [bad, entries] = await ready(target);
    expect(bad?.hasAttribute('data-nph-rendered')).toBe(false);
    expect(entries?.shadowRoot?.querySelectorAll('nph-sidebar-item')).toHaveLength(1);
  });

  it('Messages draws the empty text and the error in place of the list', async () => {
    const target = draw(validation.Messages as unknown as Renderable, 'en');
    const [empty, error] = (await ready(target)).slice(0, 2);
    await vi.waitFor(() => expect(empty?.shadowRoot?.querySelector('.message')?.textContent?.trim()).toBe(empty?.emptyText));
    expect(error?.shadowRoot?.querySelector('.message')?.getAttribute('role')).toBe('alert');
  });

  it('Parts crosses the two booleans', async () => {
    const target = draw(validation.Parts as unknown as Renderable, 'en');
    const menus = [...target.querySelectorAll<NphSidebar>('figure[data-nph-color-scheme="light"] nph-sidebar')];
    await Promise.all(menus.map((menu) => menu.updateComplete));
    expect(menus.map((menu) => [menu.hideCollapseButton, menu.hideCornerButton])).toEqual([
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ]);
    expect(menus[3]?.shadowRoot?.querySelector('.toggle')).toBeNull();
    expect(menus[3]?.shadowRoot?.querySelector('.corner')).toBeNull();
  });
});
