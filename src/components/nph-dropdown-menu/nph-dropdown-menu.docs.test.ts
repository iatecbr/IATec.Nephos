/**
 * Contract of the `nph-dropdown-menu` Documentation page and of its Validation stories: index
 * with no orphan anchor in all three languages, no leftover placeholder, every menu on the page
 * rendered and anchored to its trigger, the `dropdownMenuDocs` and `dropdownMenuValidation`
 * dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), no
 * text of another language on the English page, and the two "When to use" lists equal to the
 * ones of the sheet. The page reads the lists from the Metadata (P71), and
 * `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';
import { userEvent } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import { format, sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-dropdown-menu.json';
import { Documentation } from './nph-dropdown-menu.docs.stories';
import * as validation from './nph-dropdown-menu.stories';
import type { NphDropdownMenu, NphDropdownMenuItem } from './nph-dropdown-menu';

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

const menusOf = (target: Element): NphDropdownMenu[] => [...target.querySelectorAll('nph-dropdown-menu')];

async function settled(target: Element): Promise<NphDropdownMenu[]> {
  const menus = menusOf(target);
  await Promise.all(menus.map((menu) => menu.updateComplete));
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  return menus;
}

/** Every visible text the menus of a page carry: item texts, labels, header and trigger. */
function menuTexts(menus: NphDropdownMenu[]): string[] {
  return menus.flatMap((menu) => {
    const trigger = (menu.getRootNode() as Document).getElementById(menu.getAttribute('for') ?? '');
    const entries = menu.items.flatMap((entry) => {
      if (entry.type === 'separator') return [];
      if (entry.type === 'label') return [entry.text];
      const item = entry as NphDropdownMenuItem;
      return [item.text, item.description, item.shortcut, item.tag].filter((value): value is string => typeof value === 'string');
    });
    const header = menu.header === null ? [] : [menu.header.name, menu.header.status ?? ''];
    return [trigger?.getAttribute('text') ?? '', ...entries, ...header];
  });
}

describe('nph-dropdown-menu Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-dropdown-menu');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every menu on the page renders, open, anchored to a trigger of the page`, async () => {
      const target = renderInLocale(locale);
      const menus = await settled(target);
      expect(menus.length).toBeGreaterThan(0);
      for (const menu of menus) {
        expect(menu.hasAttribute('data-nph-rendered'), menu.outerHTML).toBe(true);
        expect(target.querySelector(`#${menu.getAttribute('for')}`)?.tagName.toLowerCase()).toBe('nph-button');
        expect(menu.open).toBe(true);
      }
    });

    it(`${locale}: the matrix shows severity by selection, one item per cell`, async () => {
      const target = renderInLocale(locale);
      await settled(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim()).filter(Boolean);
      expect(columns).toEqual(['selection: none', 'selection: single', 'selection: multiple']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        items: menusOf(tr).map((menu) => {
          const item = menu.items[0] as NphDropdownMenuItem;
          return `${item.severity}/${item.selection}`;
        }),
      }));
      expect(rows).toEqual([
        { label: 'severity: default', items: ['default/none', 'default/single', 'default/multiple'] },
        { label: 'severity: destructive', items: ['destructive/none', 'destructive/single', 'destructive/multiple'] },
      ]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      await settled(target);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
      }
      const [account, view, options] = demos.map((entry) => menusOf(entry)[0] as NphDropdownMenu);
      expect(account?.header?.name).toBe(translations(locale).dropdownMenuDocs.name);
      expect(account?.items.some((entry) => (entry as NphDropdownMenuItem).severity === 'destructive')).toBe(true);
      expect(view?.items.some((entry) => (entry as NphDropdownMenuItem).selection === 'single' && (entry as NphDropdownMenuItem).checked)).toBe(true);
      expect(view?.items.some((entry) => (entry as NphDropdownMenuItem).count !== undefined)).toBe(true);
      expect(options?.items.some((entry) => (entry as NphDropdownMenuItem).tag !== undefined)).toBe(true);
      expect(options?.items.some((entry) => (entry as NphDropdownMenuItem).switch === true)).toBe(true);
    });

    it(`${locale}: an open menu in a dark frame takes the dark scheme`, async () => {
      const target = renderInLocale(locale);
      const menus = await settled(target);
      const dark = menus.find((menu) => menu.closest('[data-nph-color-scheme="dark"]') !== null) as NphDropdownMenu;
      const light = menus.find((menu) => menu.closest('[data-nph-color-scheme="light"]') !== null) as NphDropdownMenu;
      const background = (menu: NphDropdownMenu) => getComputedStyle(menu.shadowRoot?.querySelector('.panel') as HTMLElement).backgroundColor;
      expect(background(dark)).not.toBe(background(light));
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').dropdownMenuDocs);
    expect(shape(translations('pt-BR').dropdownMenuDocs)).toEqual(source);
    expect(shape(translations('es').dropdownMenuDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').dropdownMenuDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).dropdownMenuDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-dropdown-menu Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').dropdownMenuDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').dropdownMenuDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).dropdownMenuDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).dropdownMenuDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-dropdown-menu Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `Variants` is `variants`. */
  const idOf = (name: string): string =>
    `components-nph-dropdown-menu-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the seven pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Examples', 'Header', 'Interactive', 'Options', 'Sizes', 'States', 'Variants']);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const schemes = frames.map((el) => el.getAttribute('data-nph-color-scheme'));
        const pairs = name === 'Examples' ? 3 : name === 'Sizes' ? 2 : 1;
        expect(schemes, `${name} ${locale}`).toEqual(Array.from({ length: pairs }, () => ['light', 'dark']).flat());
        const expected = translations(locale).dropdownMenuValidation;
        const captions = [...target.querySelectorAll('figcaption')].map((el) => el.textContent?.trim() ?? '');
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-dropdown-menu · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text of a menu comes from the dictionary, and every menu renders`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set([...Object.values(translations(locale).dropdownMenuValidation), 'size: default', 'size: compact']);
        const menus = await settled(target);
        expect(menus.length, name).toBeGreaterThan(0);
        for (const value of menuTexts(menus)) {
          expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
        }
        for (const menu of menus) {
          expect(menu.hasAttribute('data-nph-rendered'), menu.outerHTML).toBe(true);
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

  it('Interactive: the trigger opens the menu and an activated item shows in the status text', async () => {
    const story = validation.Interactive as Renderable;
    for (const locale of LOCALES) {
      const target = draw(story, locale);
      const v = translations(locale).dropdownMenuValidation;
      const menus = await settled(target);
      const statuses = [...target.querySelectorAll('output')];
      expect(menus).toHaveLength(2);
      expect(menus.every((menu) => !menu.open)).toBe(true);
      expect(statuses.map((status) => status.textContent)).toEqual([v.statusIdle, v.statusIdle]);
      const menu = menus[0] as NphDropdownMenu;
      const trigger = target.querySelector(`#${menu.getAttribute('for')}`) as HTMLElement;
      await userEvent.click(trigger);
      await menu.updateComplete;
      expect(menu.open).toBe(true);
      const sync = [...(menu.shadowRoot?.querySelectorAll<HTMLElement>('.item') ?? [])].find((item) => item.textContent?.includes(v.sync)) as HTMLElement;
      await userEvent.click(sync);
      expect(statuses[0]?.textContent).toBe(format(v.statusChosen, { value: 'sync', checked: 'true' }));
      expect(statuses[1]?.textContent).toBe(v.statusIdle);
      expect(menu.open).toBe(true);
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').dropdownMenuValidation);
    expect(shape(translations('pt-BR').dropdownMenuValidation)).toEqual(source);
    expect(shape(translations('es').dropdownMenuValidation)).toEqual(source);
  });
});

describe('nph-dropdown-menu documentation — order of the model', () => {
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
      expect(sections).toEqual(['when-to-use', 'api', 'usage', 'variants', 'sizes', 'states', 'options', 'anatomy', 'accessibility', 'examples', 'references']);
      expect(target.querySelector('#anti-patterns')).toBeNull();
    });
  }
});
