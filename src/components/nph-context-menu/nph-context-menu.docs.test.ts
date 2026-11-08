/**
 * Contract of the `nph-context-menu` Documentation page and of its Validation stories: index with
 * no orphan anchor in all three languages, no leftover placeholder, every menu on the page
 * rendered and anchored to its object, the `contextMenuDocs` and `contextMenuValidation`
 * dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), no
 * text of another language on the English page, and the two "When to use" lists equal to the ones
 * of the sheet. The page reads the lists from the Metadata (P71), and
 * `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { html, render } from 'lit';
import type { TemplateResult } from 'lit';
import { page, userEvent } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import { format, sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-context-menu.json';
import { Documentation } from './nph-context-menu.docs.stories';
import * as validation from './nph-context-menu.stories';
import type { NphContextMenu, NphContextMenuItem } from './nph-context-menu';
import { fileItems } from './nph-context-menu.demo';

afterEach(() => {
  document.body.replaceChildren();
});

const LOCALES = ['pt-BR', 'en', 'es'] as const;

const docs = (locale: string) => translations(locale).contextMenuDocs;
const texts = (locale: string) => translations(locale).contextMenuValidation;

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

const menusOf = (target: Element): NphContextMenu[] => [...target.querySelectorAll('nph-context-menu')];

async function settled(target: Element): Promise<NphContextMenu[]> {
  const menus = menusOf(target);
  await Promise.all(menus.map((menu) => menu.updateComplete));
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  return menus;
}

/** Every visible text the menus of a page carry: item texts, shortcuts, labels, submenus and the object. */
function menuTexts(menus: NphContextMenu[]): string[] {
  const entriesOf = (list: readonly (NphContextMenuItem | { type: string; text?: string })[]): string[] =>
    list.flatMap((entry) => {
      if (entry.type === 'separator') return [];
      if (entry.type === 'label') return [(entry as { text: string }).text];
      const item = entry as NphContextMenuItem;
      return [item.text, item.shortcut ?? '', ...entriesOf((item.submenu as NphContextMenuItem[] | undefined) ?? [])].filter((value) => value !== '');
    });
  return menus.flatMap((menu) => {
    const object = (menu.getRootNode() as Document).getElementById(menu.getAttribute('for') ?? '');
    return [object?.textContent?.trim() ?? '', ...entriesOf(menu.items as NphContextMenuItem[])];
  });
}

describe('nph-context-menu Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-context-menu');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every menu on the page renders, open, anchored to an object of the page`, async () => {
      const target = renderInLocale(locale);
      const menus = await settled(target);
      expect(menus.length).toBeGreaterThan(0);
      for (const menu of menus) {
        expect(menu.hasAttribute('data-nph-rendered'), menu.outerHTML).toBe(true);
        expect(target.querySelector(`#${menu.getAttribute('for')}`)).not.toBeNull();
        expect(menu.open).toBe(true);
      }
    });

    it(`${locale}: the matrix shows size by submenu, closed and open`, async () => {
      const target = renderInLocale(locale);
      await settled(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const d = docs(locale);
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim()).filter(Boolean);
      expect(columns).toEqual([`open-submenu: ${d.closedWord}`, `open-submenu: ${d.openWord}`]);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        menus: menusOf(tr).map((menu) => `${menu.size}/${menu.openSubmenu === '' ? 'closed' : 'open'}`),
      }));
      expect(rows).toEqual([
        { label: 'size: default', menus: ['default/closed', 'default/open'] },
        { label: 'size: compact', menus: ['compact/closed', 'compact/open'] },
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
      const [closed, right, left] = demos.map((entry) => menusOf(entry)[0] as NphContextMenu);
      expect(closed?.openSubmenu).toBe('');
      expect(right?.openSubmenu).toBe('share');
      expect(left?.openSubmenu).toBe('share');
      expect(left?.size).toBe('compact');
      const items = closed?.items as NphContextMenuItem[];
      expect(items.some((entry) => entry.severity === 'destructive')).toBe(true);
      expect(items.some((entry) => Array.isArray(entry.submenu))).toBe(true);
      expect(items.some((entry) => entry.shortcut !== undefined)).toBe(true);
    });

    it(`${locale}: an open menu in a dark frame takes the dark scheme`, async () => {
      const target = renderInLocale(locale);
      const menus = await settled(target);
      const dark = menus.find((menu) => menu.closest('[data-nph-color-scheme="dark"]') !== null) as NphContextMenu;
      const light = menus.find((menu) => menu.closest('[data-nph-color-scheme="light"]') !== null) as NphContextMenu;
      const background = (menu: NphContextMenu) => getComputedStyle(menu.shadowRoot?.querySelector('.panel') as HTMLElement).backgroundColor;
      expect(background(dark)).not.toBe(background(light));
    });
  }

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
});

describe('nph-context-menu Documentation: the lists of the page are the lists of the sheet', () => {
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

describe('nph-context-menu Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `SubmenuLeft` is `submenu-left`. */
  const idOf = (name: string): string =>
    `components-nph-context-menu-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the nine pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Brands', 'Choices', 'Direction', 'Examples', 'Interactive', 'Menu', 'Sizes', 'Submenu', 'SubmenuLeft']);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      /* The shape of the brand frames is proved in src/shared/tokens/brand-validation.test.ts. */
      if (name === 'Brands') return;
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const schemes = frames.map((el) => el.getAttribute('data-nph-color-scheme'));
        const pairs = name === 'Examples' ? 3 : name === 'Sizes' ? 2 : 1;
        expect(schemes, `${name} ${locale}`).toEqual(Array.from({ length: pairs }, () => ['light', 'dark']).flat());
        const expected = texts(locale);
        const captions = [...target.querySelectorAll('figcaption')].map((el) => el.textContent?.trim() ?? '');
        for (const caption of captions) {
          expect(
            [expected.lightCaption, expected.darkCaption, expected.exampleClosed, expected.exampleRight, expected.exampleLeft].some((allowed) => caption === allowed || caption.endsWith(` · ${expected.lightCaption}`) || caption.endsWith(` · ${expected.darkCaption}`)),
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
        const target = draw(story, locale);
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-context-menu · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text of a menu comes from the dictionary, and every menu renders`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(texts(locale)));
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

  it('only the Brands story carries data-nph-brand: the other pages follow the root brand, the frame only sets the mode', () => {
    for (const [name, story] of stories) {
      const target = draw(story, 'en');
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

  it('Submenu and SubmenuLeft show the submenu open; Sizes shows both sizes; Menu shows it closed', async () => {
    const open = async (name: string) => {
      const target = draw((validation as unknown as Record<string, Renderable>)[name] as Renderable, 'en');
      const menus = await settled(target);
      target.remove();
      return menus.map((menu) => `${menu.size}/${menu.openSubmenu}`);
    };
    expect(await open('Menu')).toEqual(['default/', 'default/']);
    expect(await open('Submenu')).toEqual(['default/share', 'default/share']);
    expect(await open('SubmenuLeft')).toEqual(['compact/share', 'compact/share']);
    expect(await open('Sizes')).toEqual(['default/', 'default/', 'compact/', 'compact/']);
  });

  it('Interactive: the right click opens the menu and an activated item shows in the status text', async () => {
    const story = validation.Interactive as Renderable;
    for (const locale of LOCALES) {
      const target = draw(story, locale);
      const v = texts(locale);
      const menus = await settled(target);
      const statuses = [...target.querySelectorAll('output')];
      expect(menus).toHaveLength(2);
      expect(menus.every((menu) => !menu.open)).toBe(true);
      expect(statuses.map((status) => status.textContent)).toEqual([v.statusIdle, v.statusIdle]);
      const menu = menus[0] as NphContextMenu;
      const object = target.querySelector(`#${menu.getAttribute('for')}`) as HTMLElement;
      const box = object.getBoundingClientRect();
      object.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, composed: true, clientX: box.left + 8, clientY: box.top + 8, button: 2 }));
      await menu.updateComplete;
      expect(menu.open).toBe(true);
      const reload = [...(menu.shadowRoot?.querySelectorAll<HTMLElement>('.item') ?? [])].find((item) => item.querySelector('.text')?.textContent === v.reload) as HTMLElement;
      await userEvent.click(reload);
      expect(statuses[0]?.textContent).toBe(format(v.statusChosen, { value: 'reload', checked: 'null' }));
      expect(statuses[1]?.textContent).toBe(v.statusIdle);
      expect(menu.open).toBe(false);
      target.remove();
    }
  });

  it('the shortcuts of the three dictionaries are valid aria-keyshortcuts: modifiers, arrows, Delete and single keys', async () => {
    const valid = /^((Control|Alt|Shift|Meta)\+)*(Arrow(Left|Right|Up|Down)|Delete|Enter|Escape|Backspace|Tab|Space|F\d{1,2}|[A-Z0-9])$/;
    for (const locale of LOCALES) {
      const target = document.createElement('div');
      document.body.append(target);
      render(
        html`<div id="shortcuts-object"></div><nph-context-menu for="shortcuts-object" open .items=${fileItems(texts(locale))}></nph-context-menu>`,
        target,
      );
      const [menu] = await settled(target);
      const keys = [...(menu?.shadowRoot?.querySelectorAll('.item[aria-keyshortcuts]') ?? [])].map((item) => item.getAttribute('aria-keyshortcuts') ?? '');
      expect(keys.length, locale).toBe(5);
      for (const key of keys) {
        expect(key, `${locale}: ${key}`).toMatch(valid);
      }
      expect(keys, locale).toContain('Alt+ArrowLeft');
      expect(keys, locale).toContain('Delete');
      target.remove();
    }
  });

  it('SubmenuLeft: in a wide window the submenu of every example, in both modes, opens to the left', async () => {
    await page.viewport(1400, 900);
    try {
      for (const locale of LOCALES) {
        const target = draw(validation.SubmenuLeft as Renderable, locale);
        const menus = await settled(target);
        expect(menus).toHaveLength(2);
        /* The object moves to the end of the window on the next frame and the menu is placed again. */
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        await Promise.all(menus.map((menu) => menu.updateComplete));
        for (const menu of menus) {
          const sub = menu.shadowRoot?.querySelector<HTMLElement>('.panel[data-level="1"]');
          expect(sub?.dataset.side, `${locale} ${menu.closest('[data-nph-color-scheme]')?.getAttribute('data-nph-color-scheme')}`).toBe('left');
          const main = menu.shadowRoot?.querySelector<HTMLElement>('.panel[data-level="0"]') as HTMLElement;
          expect((sub as HTMLElement).getBoundingClientRect().right).toBeLessThanOrEqual(main.getBoundingClientRect().left + 1);
        }
        target.remove();
        /* The Docs page shows the same example third in its examples. */
        const docsPage = renderInLocale(locale);
        const left = [...docsPage.querySelectorAll('section#examples [data-nph-demo]')][2] as HTMLElement;
        const docsMenus = await settled(left);
        expect(docsMenus).toHaveLength(2);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        for (const menu of docsMenus) {
          expect(menu.shadowRoot?.querySelector<HTMLElement>('.panel[data-level="1"]')?.dataset.side, `docs ${locale}`).toBe('left');
        }
        docsPage.remove();
      }
    } finally {
      await page.viewport(414, 896);
    }
  });

  it('Brands: the checked single choice stays in the frames, with the exception of the gate recorded', () => {
    const target = draw(validation.Brands as Renderable, 'en');
    const menu = target.querySelector('nph-context-menu') as NphContextMenu;
    expect((menu.items as NphContextMenuItem[]).some((entry) => entry.selection === 'single' && entry.checked === true)).toBe(true);
    const rules = ((validation.Brands as { parameters?: { a11y?: { options?: { rules?: Record<string, unknown> } } } }).parameters?.a11y?.options?.rules) ?? {};
    expect(Object.keys(rules).sort()).toEqual(['color-contrast', 'label-content-name-mismatch']);
    target.remove();
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(texts('en'));
    expect(shape(texts('pt-BR'))).toEqual(source);
    expect(shape(texts('es'))).toEqual(source);
  });
});

describe('nph-context-menu documentation — order of the model', () => {
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
      expect(sections).toEqual(['when-to-use', 'api', 'usage', 'opening', 'submenu', 'sizes', 'choices', 'anatomy', 'accessibility', 'examples', 'references']);
      expect(target.querySelector('#anti-patterns')).toBeNull();
    });
  }
});
