/**
 * Contract of the `nph-menubar` Documentation page and of its Validation stories: index with no orphan
 * anchor in all three languages, no leftover placeholder, every bar on the page rendered with its panel
 * open where the page shows one, the `menubarDocs` and `menubarValidation` dictionaries with the same
 * shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of another language on the
 * English page, and the two "When to use" lists equal to the ones of the sheet. The page reads the lists
 * from the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { html, render } from 'lit';
import type { TemplateResult } from 'lit';
import { page, userEvent } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import { format, sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-menubar.json';
import { Documentation } from './nph-menubar.docs.stories';
import * as validation from './nph-menubar.stories';
import type { NphMenubar, NphMenubarEntry, NphMenubarItem } from './nph-menubar';
import { fileExample } from './nph-menubar.demo';

afterEach(() => {
  document.body.replaceChildren();
  window.scrollTo(0, 0);
});

const LOCALES = ['pt-BR', 'en', 'es'] as const;

const docs = (locale: string) => translations(locale).menubarDocs;
const texts = (locale: string) => translations(locale).menubarValidation;

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

/** Runs `body` in a window wide enough for the frames to hold their content, and gives the narrow window back. */
async function inWideWindow(body: () => Promise<void>): Promise<void> {
  await page.viewport(1400, 900);
  try {
    await body();
  } finally {
    await page.viewport(414, 896);
  }
}

const barsOf = (target: Element): NphMenubar[] => [...target.querySelectorAll('nph-menubar')];

/** Waits for the bars to render, for the measure of the overflow and for the panels to be placed. */
async function settled(target: Element): Promise<NphMenubar[]> {
  const bars = barsOf(target);
  await Promise.all(bars.map((bar) => bar.updateComplete));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))));
  await Promise.all(bars.map((bar) => bar.updateComplete));
  return bars;
}

const panel = (bar: NphMenubar, level: 0 | 1 = 0): HTMLElement | null => bar.shadowRoot?.querySelector(`.panel[data-level="${level}"]`) ?? null;
const isOpen = (bar: NphMenubar, level: 0 | 1 = 0): boolean => panel(bar, level)?.hasAttribute('data-open') === true;
const topItems = (bar: NphMenubar): HTMLElement[] => [...(bar.shadowRoot?.querySelectorAll<HTMLElement>('.bar > .top') ?? [])];
const itemsOf = (bar: NphMenubar, level: 0 | 1 = 0): HTMLElement[] => [...(panel(bar, level)?.querySelectorAll<HTMLElement>('.item') ?? [])];
const textOf = (element: Element | null | undefined): string => element?.textContent?.trim() ?? '';

/** Every visible text a bar carries: the top items, the items, the shortcuts, the labels and the submenus. */
function barTexts(bars: NphMenubar[]): string[] {
  const entriesOf = (list: readonly NphMenubarEntry[]): string[] =>
    list.flatMap((entry) => {
      if (entry.type === 'separator') return [];
      if (entry.type === 'label') return [entry.text];
      const item = entry as NphMenubarItem;
      return [item.text, item.shortcut ?? '', ...entriesOf(item.submenu ?? [])].filter((value) => value !== '');
    });
  return bars.flatMap((bar) => [
    bar.label,
    bar.moreLabel,
    bar.menuLabel,
    ...bar.menus.flatMap((menu) => [menu.label, ...entriesOf(menu.items)]),
  ]);
}

describe('nph-menubar Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-menubar');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every bar on the page renders, and the ones the page shows open have their panel open`, async () => {
      const target = renderInLocale(locale);
      const bars = await settled(target);
      expect(bars.length).toBeGreaterThan(0);
      for (const bar of bars) {
        expect(bar.hasAttribute('data-nph-rendered'), bar.outerHTML).toBe(true);
        if (bar.openMenu !== '') {
          expect(isOpen(bar), `open-menu ${bar.openMenu}`).toBe(true);
        } else {
          expect(isOpen(bar), 'closed bar').toBe(false);
        }
      }
    });

    it(`${locale}: the matrix shows the bar closed, open, with a disabled top item and narrow`, async () => {
      const target = renderInLocale(locale);
      await settled(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const d = docs(locale);
      expect(matrix.querySelectorAll('thead')).toHaveLength(0);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => {
        const bar = barsOf(tr)[0] as NphMenubar;
        return {
          label: tr.querySelector('th')?.textContent?.trim(),
          open: bar.openMenu,
          narrow: bar.narrow,
          disabledTop: topItems(bar).filter((item) => item.getAttribute('aria-disabled') === 'true').length,
        };
      });
      expect(rows).toEqual([
        { label: `open-menu: ${d.closedWord}`, open: '', narrow: false, disabledTop: 0 },
        { label: `open-menu: ${d.openWord}`, open: 'file', narrow: false, disabledTop: 0 },
        { label: 'disabled: true', open: '', narrow: false, disabledTop: 1 },
        { label: 'narrow: true', open: '', narrow: true, disabledTop: 0 },
      ]);
    });

    it(`${locale}: the four required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      await settled(target);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(4);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
      }
      const [file, view, states, recent] = demos.map((entry) => barsOf(entry)[0] as NphMenubar);
      expect([file?.openMenu, file?.openSubmenu]).toEqual(['file', '']);
      expect([view?.openMenu, view?.openSubmenu]).toEqual(['view', '']);
      expect([states?.openMenu, states?.openSubmenu]).toEqual(['view', '']);
      expect([recent?.openMenu, recent?.openSubmenu]).toEqual(['file', 'recent']);
      const fileItems = (file?.menus.find((menu) => menu.value === 'file')?.items ?? []) as NphMenubarItem[];
      expect(fileItems.some((entry) => entry.severity === 'destructive')).toBe(true);
      expect(fileItems.some((entry) => Array.isArray(entry.submenu))).toBe(true);
      expect(fileItems.some((entry) => entry.shortcut !== undefined)).toBe(true);
      const viewItems = (view?.menus.find((menu) => menu.value === 'view')?.items ?? []) as NphMenubarItem[];
      expect(viewItems.filter((entry) => entry.selection === 'multiple')).toHaveLength(2);
      expect(viewItems.filter((entry) => entry.selection === 'single')).toHaveLength(2);
      const stateItems = (states?.menus.find((menu) => menu.value === 'view')?.items ?? []) as NphMenubarItem[];
      expect(stateItems.some((entry) => entry.checked === true && entry.disabled === true)).toBe(true);
    });

    it(`${locale}: the Do and Do not of the documentation: five and three rules, each with its reason`, () => {
      const target = renderInLocale(locale);
      const tables = [...target.querySelectorAll('section#practices table')];
      expect(tables.map((table) => table.querySelectorAll('tbody tr').length)).toEqual([5, 3]);
      for (const row of target.querySelectorAll('section#practices tbody tr')) {
        expect(row.querySelector('td')?.textContent?.trim()).not.toBe('');
      }
    });

    it(`${locale}: an open panel in a dark frame takes the dark scheme`, async () => {
      const target = renderInLocale(locale);
      const bars = await settled(target);
      const dark = bars.find((bar) => bar.closest('[data-nph-color-scheme="dark"]') !== null && isOpen(bar)) as NphMenubar;
      const light = bars.find((bar) => bar.closest('[data-nph-color-scheme="light"]') !== null && isOpen(bar)) as NphMenubar;
      const background = (bar: NphMenubar) => getComputedStyle(panel(bar) as HTMLElement).backgroundColor;
      expect(background(dark)).not.toBe(background(light));
    });
  }

  it('the page, in English, shows the bar overflowing in its box and the button of the narrow screen', async () => {
    const target = renderInLocale('en');
    const bars = await settled(target);
    const overflow = target.querySelector('section#overflow') as HTMLElement;
    const [boxed, narrow] = barsOf(overflow);
    expect(narrow?.narrow).toBe(true);
    await settled(overflow);
    const kept = topItems(boxed as NphMenubar);
    expect(kept.at(-1)?.hasAttribute('data-more')).toBe(true);
    expect(kept.length).toBeLessThan(((boxed as NphMenubar).menus as unknown[]).length + 1);
    expect(bars.length).toBeGreaterThan(8);
  });

  it('in a narrow window the frames of the page and of every Validation story stay inside it', async () => {
    await page.viewport(414, 896);
    const width = document.documentElement.clientWidth;
    const targets: HTMLElement[] = [renderInLocale('en')];
    for (const [name, story] of Object.entries(validation)) {
      if (name === 'default' || typeof (story as { render?: unknown }).render !== 'function') continue;
      const target = document.createElement('div');
      document.body.append(target);
      render((story as { render: (a: unknown, c: unknown) => TemplateResult }).render({}, { globals: { locale: 'en' } }), target);
      targets.push(target);
    }
    for (const target of targets) {
      for (const frame of target.querySelectorAll<HTMLElement>('figure[data-nph-color-scheme]')) {
        expect(frame.getBoundingClientRect().right, frame.querySelector('figcaption')?.textContent ?? '').toBeLessThanOrEqual(width + 1);
      }
    }
  });

  it('on the Docs page, a panel is drawn only while its top item is inside the window', async () => {
    const target = renderInLocale('en');
    const bars = (await settled(target)).filter((bar) => bar.openMenu !== '');
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    const isInside = (item: HTMLElement): boolean => {
      const box = item.getBoundingClientRect();
      return box.bottom > 0 && box.top < height && box.right > 0 && box.left < width;
    };
    let hidden = 0;
    for (const bar of bars) {
      const trigger = bar.shadowRoot?.querySelector(`.bar > .top[data-key="${bar.openMenu}"]`) as HTMLElement;
      await vi.waitFor(() => {
        const inside = isInside(trigger);
        expect((panel(bar) as HTMLElement).style.visibility === 'hidden', `${bar.openMenu} inside=${inside}`).toBe(!inside);
      });
      if (!isInside(trigger)) hidden += 1;
    }
    expect(hidden).toBeGreaterThan(0);
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(docs('en'));
    expect(shape(docs('pt-BR'))).toEqual(source);
    expect(shape(docs('es'))).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(docs('en'));
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(docs(other));
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('every state of the top item and every variant of the item is listed on the page', () => {
    const d = docs('en');
    expect(d.states.map(([state]: string[]) => state)).toEqual(['default', 'hover and open', 'focus', 'disabled']);
    expect(d.entry.map(([field]: string[]) => field)).toEqual(['value', 'text', 'icon', 'severity', 'selection', 'checked', 'shortcut', 'submenu', 'disabled', 'type']);
    expect(d.api.map(([property]: string[]) => property)).toEqual([
      'menus',
      'open-menu',
      'open-submenu',
      'label',
      'more-label',
      'narrow',
      'menu-label',
      'nph-item-select',
      'color and parts',
    ]);
  });
});

describe('nph-menubar Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(docs('en').whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(docs('en').whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(docs(locale).whenToUse).toHaveLength(metadata.use_when.length);
      expect(docs(locale).whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-menubar Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `FileMenu` is `file-menu`. */
  const idOf = (name: string): string =>
    `components-nph-menubar-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  const story = (name: string): Renderable => (validation as unknown as Record<string, Renderable>)[name] as Renderable;

  it('the stories are the fourteen pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'Brands',
      'CheckedAndDisabled',
      'Closed',
      'Direction',
      'Examples',
      'FileMenu',
      'Focus',
      'Interactive',
      'Narrow',
      'OpenAndFocus',
      'Overflow',
      'Submenu',
      'TopItems',
      'ViewMenu',
    ]);
  });

  for (const [name, entry] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      /* The shape of the brand frames is proved in src/shared/tokens/brand-validation.test.ts. */
      if (name === 'Brands') return;
      for (const locale of LOCALES) {
        const target = draw(entry, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const schemes = frames.map((el) => el.getAttribute('data-nph-color-scheme'));
        const pairs = name === 'Examples' ? 4 : 1;
        expect(schemes, `${name} ${locale}`).toEqual(Array.from({ length: pairs }, () => ['light', 'dark']).flat());
        const expected = texts(locale);
        const allowed = [expected.lightCaption, expected.darkCaption, expected.exampleFile, expected.exampleView, expected.exampleStates, expected.exampleRecent];
        const captions = [...target.querySelectorAll('figcaption')].map((el) => el.textContent?.trim() ?? '');
        for (const caption of captions) {
          expect(
            allowed.some((value) => caption === value || caption.endsWith(` · ${expected.lightCaption}`) || caption.endsWith(` · ${expected.darkCaption}`)),
            `${name} ${locale}: ${caption}`,
          ).toBe(true);
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
        const target = draw(entry, locale);
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-menubar · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text of a bar comes from the dictionary, and every bar renders`, async () => {
      for (const locale of LOCALES) {
        const target = draw(entry, locale);
        const allowed = new Set(Object.values(texts(locale)));
        const bars = await settled(target);
        expect(bars.length, name).toBeGreaterThan(0);
        for (const value of barTexts(bars)) {
          expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
        }
        for (const bar of bars) {
          expect(bar.hasAttribute('data-nph-rendered'), bar.outerHTML).toBe(true);
        }
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('only the Brands story carries data-nph-brand: the other pages follow the root brand, the frame only sets the mode', () => {
    for (const [name, entry] of stories) {
      const target = draw(entry, 'en');
      if (name === 'Brands') {
        const branded = [...target.querySelectorAll('[data-nph-brand]')];
        expect(branded, name).toHaveLength(14);
        for (const frame of branded) {
          expect(frame.hasAttribute('data-nph-color-scheme'), frame.outerHTML.slice(0, 120)).toBe(true);
          expect(frame.hasAttribute('data-nph-brand-frame'), frame.outerHTML.slice(0, 120)).toBe(true);
        }
      } else {
        expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      }
      target.remove();
    }
  });

  it('Closed shows four closed top items in each mode', async () => {
    const target = draw(story('Closed'), 'en');
    const bars = await settled(target);
    expect(bars).toHaveLength(2);
    for (const bar of bars) {
      expect(isOpen(bar)).toBe(false);
      expect(topItems(bar).map(textOf)).toEqual(['File', 'Edit', 'View', 'Help']);
      expect(topItems(bar).every((item) => item.getAttribute('aria-expanded') === 'false')).toBe(true);
    }
  });

  it('FileMenu: the File panel is open with the shortcuts, the submenu item and the destructive item last, after a separator', async () => {
    for (const locale of LOCALES) {
      const target = draw(story('FileMenu'), locale);
      const bars = await settled(target);
      const v = texts(locale);
      expect(bars).toHaveLength(2);
      for (const bar of bars) {
        expect(isOpen(bar)).toBe(true);
        expect(isOpen(bar, 1)).toBe(false);
        const items = itemsOf(bar);
        expect(items.map((item) => textOf(item.querySelector('.text')))).toEqual([v.new, v.open, v.recent, v.delete]);
        expect(items.map((item) => textOf(item.querySelector('.shortcut')))).toEqual([v.shortcutNew, v.shortcutOpen, '', v.shortcutDelete]);
        expect(items[2]?.getAttribute('aria-haspopup')).toBe('menu');
        expect(items.at(-1)?.getAttribute('data-severity')).toBe('destructive');
        expect(panel(bar)?.querySelectorAll('.separator')).toHaveLength(1);
        const separator = panel(bar)?.querySelector('.separator') as Element;
        expect(separator.compareDocumentPosition(items.at(-1) as Element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(separator.compareDocumentPosition(items[2] as Element) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
        expect(topItems(bar)[0]?.getAttribute('aria-expanded')).toBe('true');
      }
      target.remove();
    }
  });

  it('ViewMenu: a group label, two checkboxes and two radios, one checked, in two groups', async () => {
    const target = draw(story('ViewMenu'), 'en');
    const [bar] = await settled(target);
    const v = texts('en');
    expect(isOpen(bar as NphMenubar)).toBe(true);
    const groups = [...((panel(bar as NphMenubar) as HTMLElement).querySelectorAll('[role="group"]'))];
    expect(groups.map((group) => textOf(group.querySelector('.group-label')))).toEqual([v.viewShow, v.viewDensity]);
    const items = itemsOf(bar as NphMenubar);
    expect(items.map((item) => item.getAttribute('role'))).toEqual(['menuitemcheckbox', 'menuitemcheckbox', 'menuitemradio', 'menuitemradio']);
    expect(items.map((item) => item.getAttribute('aria-checked'))).toEqual(['true', 'false', 'true', 'false']);
    expect(items[2]?.querySelector('.check')).not.toBeNull();
    expect(items[3]?.querySelector('.check')).toBeNull();
  });

  it('CheckedAndDisabled: the checked and disabled choice keeps its mark, and the disabled command stays', async () => {
    const target = draw(story('CheckedAndDisabled'), 'en');
    const [bar] = await settled(target);
    const v = texts('en');
    const items = itemsOf(bar as NphMenubar);
    const minimap = items.find((item) => textOf(item.querySelector('.text')) === v.minimap) as HTMLElement;
    expect(minimap.getAttribute('aria-disabled')).toBe('true');
    expect(minimap.getAttribute('aria-checked')).toBe('true');
    expect((minimap.querySelector('nph-checkbox') as unknown as { checked: boolean }).checked).toBe(true);
    expect(Number(getComputedStyle(minimap).opacity)).toBeLessThan(1);
    const reset = items.find((item) => textOf(item.querySelector('.text')) === v.resetView) as HTMLElement;
    expect(reset.getAttribute('aria-disabled')).toBe('true');
  });

  it('Submenu: the Recent submenu is open beside the panel, with the three files, one level', async () => {
    await inWideWindow(async () => {
      for (const locale of LOCALES) {
        const target = draw(story('Submenu'), locale);
        const bars = await settled(target);
        const v = texts(locale);
        for (const bar of bars) {
          expect(bar.openSubmenu).toBe('recent');
          expect(isOpen(bar, 1)).toBe(true);
          expect(itemsOf(bar, 1).map((item) => textOf(item.querySelector('.text')))).toEqual([v.recentOne, v.recentTwo, v.recentThree]);
          expect(itemsOf(bar, 1).some((item) => item.hasAttribute('aria-haspopup'))).toBe(false);
          const main = (panel(bar) as HTMLElement).getBoundingClientRect();
          const sub = (panel(bar, 1) as HTMLElement).getBoundingClientRect();
          expect(sub.left).toBeGreaterThanOrEqual(main.right);
        }
        target.remove();
      }
    });
  });

  it('TopItems: the Help top item is disabled and the one with a long label hugs its text', async () => {
    await inWideWindow(async () => {
      const target = draw(story('TopItems'), 'en');
      const [bar] = await settled(target);
      const items = topItems(bar as NphMenubar);
      expect(items.map(textOf)).toEqual(['File', 'Edit', 'View', 'Help', 'Advanced settings']);
      expect(items.map((item) => item.getAttribute('aria-disabled'))).toEqual([null, null, null, 'true', null]);
      expect(items[4]!.getBoundingClientRect().width).toBeGreaterThan(items[0]!.getBoundingClientRect().width);
      expect(Number(getComputedStyle(items[3] as HTMLElement).opacity)).toBeLessThan(1);
    });
  });

  it('Focus: the light frame takes the keyboard focus on its first top item, with the focus ring; Tab takes it to the dark frame', async () => {
    const target = draw(story('Focus'), 'en');
    const [light, dark] = (await settled(target)) as [NphMenubar, NphMenubar];
    await vi.waitFor(() => expect(light.shadowRoot?.activeElement).toBe(topItems(light)[0]));
    expect(topItems(light)[0]?.matches(':focus-visible')).toBe(true);
    expect(getComputedStyle(topItems(light)[0] as HTMLElement, '::before').borderTopStyle).toBe('solid');
    expect(dark.shadowRoot?.activeElement ?? null).toBeNull();
    await userEvent.keyboard('{Tab}');
    expect(dark.shadowRoot?.activeElement).toBe(topItems(dark)[0]);
    expect(topItems(dark)[0]?.matches(':focus-visible')).toBe(true);
  });

  it('OpenAndFocus: the light frame has its panel open and its top item in focus at once; Tab leaves it and takes the focus to the dark frame', async () => {
    const target = draw(story('OpenAndFocus'), 'en');
    const [light, dark] = (await settled(target)) as [NphMenubar, NphMenubar];
    await vi.waitFor(() => expect(light.shadowRoot?.activeElement).toBe(topItems(light)[0]));
    expect(topItems(light)[0]?.matches(':focus-visible')).toBe(true);
    expect(topItems(light)[0]?.getAttribute('aria-expanded')).toBe('true');
    expect(isOpen(light)).toBe(true);
    expect(isOpen(dark)).toBe(true);
    await userEvent.keyboard('{Tab}');
    expect(dark.shadowRoot?.activeElement).toBe(topItems(dark)[0]);
    expect(isOpen(dark)).toBe(true);
  });

  it('Overflow: the top items that do not fit go into the last top item, in one line', async () => {
    const target = draw(story('Overflow'), 'en');
    const bars = await settled(target);
    for (const bar of bars) {
      await vi.waitFor(() => expect(topItems(bar).at(-1)?.hasAttribute('data-more')).toBe(true));
      const items = topItems(bar);
      expect(textOf(items.at(-1))).toBe(texts('en').moreLabel);
      expect(items.length).toBeLessThan(bar.menus.length + 1);
      expect(new Set(items.map((item) => Math.round(item.getBoundingClientRect().top))).size).toBe(1);
      expect(items.at(-1)!.getBoundingClientRect().right).toBeLessThanOrEqual(bar.getBoundingClientRect().right + 1);
    }
  });

  it('Narrow: the bar is swapped for the button with the bars icon, named by menu-label', async () => {
    for (const locale of LOCALES) {
      const target = draw(story('Narrow'), locale);
      const bars = await settled(target);
      for (const bar of bars) {
        expect(bar.narrow).toBe(true);
        expect(bar.shadowRoot?.querySelector('[role="menubar"]')).toBeNull();
        const button = bar.shadowRoot?.querySelector('nph-button.narrow-button') as HTMLElement;
        expect(button.getAttribute('icon-start')).toBe('bars');
        expect(button.getAttribute('label')).toBe(texts(locale).menuLabel);
      }
      target.remove();
    }
  });

  it('Direction: the writing is right to left and the submenu opens to the left of its panel', async () => {
    await inWideWindow(async () => {
      const target = draw(story('Direction'), 'en');
      const bars = await settled(target);
      for (const bar of bars) {
        expect(getComputedStyle(bar).direction).toBe('rtl');
        bar.scrollIntoView({ block: 'center' });
        await vi.waitFor(() => expect((panel(bar, 1) as HTMLElement).dataset.side).toBe('left'));
        const main = (panel(bar) as HTMLElement).getBoundingClientRect();
        expect((panel(bar, 1) as HTMLElement).getBoundingClientRect().right).toBeLessThanOrEqual(main.left + 1);
      }
    });
  });

  it('Interactive: a click opens the panel and an activated command shows in the status text', async () => {
    for (const locale of LOCALES) {
      const target = draw(story('Interactive'), locale);
      const v = texts(locale);
      const bars = await settled(target);
      const statuses = [...target.querySelectorAll('output')];
      expect(bars).toHaveLength(2);
      expect(bars.every((bar) => bar.openMenu === '')).toBe(true);
      expect(statuses.map((status) => status.textContent)).toEqual([v.statusIdle, v.statusIdle]);
      const bar = bars[0] as NphMenubar;
      await userEvent.click(topItems(bar)[0] as HTMLElement);
      await bar.updateComplete;
      expect(bar.openMenu).toBe('file');
      const open = itemsOf(bar).find((item) => textOf(item.querySelector('.text')) === v.open) as HTMLElement;
      await userEvent.click(open);
      expect(statuses[0]?.textContent).toBe(format(v.statusChosen, { value: 'open', menu: 'file', checked: 'null' }));
      expect(statuses[1]?.textContent).toBe(v.statusIdle);
      expect(bar.openMenu).toBe('');
      target.remove();
    }
  });

  it('Examples shows the four required examples; the Recent one has the submenu open', async () => {
    const target = draw(story('Examples'), 'en');
    const bars = await settled(target);
    expect(bars.map((bar) => `${bar.openMenu}/${bar.openSubmenu}`)).toEqual([
      'file/', 'file/',
      'view/', 'view/',
      'view/', 'view/',
      'file/recent', 'file/recent',
    ]);
  });

  it('Brands: the open top item and the checked choice show in the fourteen frames', async () => {
    const target = draw(story('Brands'), 'en');
    const bars = await settled(target);
    expect(bars).toHaveLength(14);
    for (const bar of bars) {
      expect(bar.openMenu).toBe('view');
      expect(isOpen(bar)).toBe(true);
    }
    const rules = ((story('Brands') as { parameters?: { a11y?: { options?: { rules?: Record<string, unknown> } } } }).parameters?.a11y?.options?.rules) ?? {};
    expect(Object.keys(rules)).toEqual([]);
  });

  it('the shortcuts of the three dictionaries are valid aria-keyshortcuts: modifiers, Delete and single keys', async () => {
    const valid = /^((Control|Alt|Shift|Meta)\+)*(Arrow(Left|Right|Up|Down)|Delete|Enter|Escape|Backspace|Tab|Space|F\d{1,2}|[A-Z0-9])$/;
    for (const locale of LOCALES) {
      const target = document.createElement('div');
      document.body.append(target);
      render(html`${fileExample(texts(locale))}`, target);
      const [bar] = await settled(target);
      const keys = itemsOf(bar as NphMenubar)
        .filter((item) => item.hasAttribute('aria-keyshortcuts'))
        .map((item) => item.getAttribute('aria-keyshortcuts') ?? '');
      expect(keys, locale).toEqual(['Control+N', 'Control+O', 'Delete']);
      for (const key of keys) {
        expect(key, `${locale}: ${key}`).toMatch(valid);
      }
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(texts('en'));
    expect(shape(texts('pt-BR'))).toEqual(source);
    expect(shape(texts('es'))).toEqual(source);
  });
});

describe('nph-menubar documentation — order of the model', () => {
  for (const locale of LOCALES) {
    it(`${locale}: header, matrix, note and index open the page, in this order`, () => {
      const target = renderInLocale(locale);
      const first = target.firstElementChild as HTMLElement;
      const opening = [...first.children]
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
        'states',
        'panel',
        'overflow',
        'keyboard',
        'practices',
        'anatomy',
        'accessibility',
        'examples',
        'references',
      ]);
      expect(target.querySelector('#anti-patterns')).toBeNull();
    });

    it(`${locale}: every section but References closes with its source`, () => {
      const target = renderInLocale(locale);
      const label = docs(locale).sourceLabel;
      for (const section of target.querySelectorAll('section[id]')) {
        const last = section.lastElementChild as HTMLElement;
        if (section.id === 'references') {
          expect(last.textContent ?? '').not.toContain(label);
        } else {
          expect(last.textContent?.trim().startsWith(label), section.id).toBe(true);
        }
      }
    });
  }
});
