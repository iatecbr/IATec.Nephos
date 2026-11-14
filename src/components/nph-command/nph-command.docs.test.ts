/**
 * Contract of the `nph-command` Documentation page, of its Validation stories and of its hidden
 * Fixtures story: index with no orphan anchor in all three languages, no leftover placeholder (but
 * the `{count}` of the results sentence, which the component fills in), every frame titled and
 * pointing at the Fixtures story with a known example, the matrix of content by footer, the three
 * required examples in light and dark mode, the `commandDocs` and `commandValidation` dictionaries
 * with the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of another
 * language on the English page, the two "When to use" lists equal to the ones of the sheet, and the
 * Fixtures story drawing the real palette, open, with text from the dictionary. The page reads the
 * lists from the Metadata (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-command.json';
import { Documentation } from './nph-command.docs.stories';
import * as validation from './nph-command.stories';
import fixtures, { Example } from './nph-command.fixtures.stories';
import * as fixtureModule from './nph-command.fixtures.stories';
import { EXAMPLES, FIXTURE_STORY, commandsOf, queryOf, typeQuery } from './nph-command.demo';
import type { NphCommand } from './nph-command';

afterEach(() => {
  for (const palette of document.querySelectorAll('nph-command')) {
    palette.open = false;
  }
  document.body.replaceChildren();
});

const LOCALES = ['pt-BR', 'en', 'es'] as const;

type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };

function draw(story: Renderable, locale: string, args: unknown = {}, scheme = 'light'): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  render(story.render?.(args, { globals: { locale, colorScheme: scheme } }) as TemplateResult, target);
  return target;
}

const renderInLocale = (locale: string, scheme = 'light'): HTMLElement =>
  draw(Documentation as unknown as Renderable, locale, {}, scheme);

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

/** What an embedded frame asks the Fixtures story for. */
function frameRequest(frame: HTMLIFrameElement): { id: string; args: Record<string, string>; globals: Record<string, string> } {
  const url = new URL(frame.getAttribute('src') ?? '', 'http://localhost/');
  const pairs = (value: string | null): Record<string, string> =>
    Object.fromEntries((value ?? '').split(';').filter(Boolean).map((pair) => pair.split(':') as [string, string]));
  return { id: url.searchParams.get('id') ?? '', args: pairs(url.searchParams.get('args')), globals: pairs(url.searchParams.get('globals')) };
}

describe('nph-command Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title, and the page is named nph-command`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-command');
    });

    it(`${locale}: no {name} placeholder is left on the page, but the {count} the component fills in`, () => {
      const text = (renderInLocale(locale).textContent ?? '').replace(/\{count\}/g, '');
      expect(text).not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every frame is titled and asks the Fixtures story for a known example, in the language of the page`, () => {
      const target = renderInLocale(locale);
      const frames = [...target.querySelectorAll('iframe')];
      expect(frames.length).toBeGreaterThan(0);
      for (const frame of frames) {
        expect(frame.title).toBe(translations(locale).commandDocs.frameTitle);
        const request = frameRequest(frame);
        expect(request.id).toBe(FIXTURE_STORY);
        expect((EXAMPLES as readonly string[]).includes(request.args.example ?? '')).toBe(true);
        expect(request.globals.locale).toBe(locale);
        expect(['light', 'dark']).toContain(request.globals.colorScheme);
      }
    });

    it(`${locale}: the matrix is content by footer, in the mode of the selector`, () => {
      for (const scheme of ['light', 'dark']) {
        const target = renderInLocale(locale, scheme);
        const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
        const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
        expect(columns).toEqual(['footer: on', 'footer: off']);
        const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
          label: tr.querySelector('th')?.textContent?.trim(),
          cells: [...tr.querySelectorAll('iframe')].map((frame) => {
            const { args, globals } = frameRequest(frame);
            return `${args.example}/${args.footer}/${globals.colorScheme}`;
          }),
        }));
        expect(rows).toEqual(
          ['results', 'groups', 'search', 'empty', 'loading'].map((content) => ({
            label: `content: ${content}`,
            cells: [`${content}/on/${scheme}`, `${content}/off/${scheme}`],
          })),
        );
        target.remove();
      }
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#required-examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos.map((entry) => entry.querySelector('[data-nph-command-example]')?.getAttribute('data-nph-command-example'))).toEqual([
        'groups',
        'search',
        'empty',
      ]);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
        const frames = [...entry.querySelectorAll('iframe')].map((frame) => frameRequest(frame).globals.colorScheme);
        expect(frames).toEqual(['light', 'dark']);
      }
    });

    it(`${locale}: the destructive command is framed, and in both modes of the page`, () => {
      for (const scheme of ['light', 'dark']) {
        const target = renderInLocale(locale, scheme);
        const states = target.querySelector('section#content-and-states') as HTMLElement;
        const framed = [...states.querySelectorAll('iframe')].map((frame) => frameRequest(frame).args.example);
        expect(framed).toEqual(['disabled', 'destructive']);
        target.remove();
      }
    });

    it(`${locale}: the accessibility section names the combobox, the listbox, the active command and Esc`, () => {
      const target = renderInLocale(locale);
      const text = target.querySelector('section#accessibility')?.textContent ?? '';
      expect(text).toContain('combobox');
      expect(text).toContain('listbox');
      expect(text).toContain('aria-activedescendant');
      expect(text).toContain('Esc');
      expect(text).toContain('label');
    });

    it(`${locale}: the keys table names Ctrl+K, Enter, Esc and the veil`, () => {
      const target = renderInLocale(locale);
      const terms = [...target.querySelectorAll('section#keys-and-closing tbody th')].map((th) => th.textContent?.trim() ?? '');
      expect(terms.join('|')).toContain('Ctrl+K');
      expect(terms).toContain('Enter');
      expect(terms).toContain('Esc');
      expect(terms).toContain('Tab');
      expect(terms).toHaveLength(7);
    });

    it(`${locale}: the API table names every property, the three events and nothing else`, () => {
      const target = renderInLocale(locale);
      const terms = [...(target.querySelector('section#api')?.querySelectorAll('tbody tr') ?? [])].map(
        (tr) => tr.firstElementChild?.textContent?.trim(),
      );
      expect(terms).toEqual([
        'items',
        'open',
        'query',
        'filter',
        'loading',
        'label',
        'placeholder',
        'loading-label',
        'empty-heading',
        'empty-description',
        'results-label',
        'hint-navigate',
        'hint-open',
        'hint-close',
        'hide-footer',
        'global-shortcut',
        'nph-run',
        'nph-search',
        'nph-close',
      ]);
    });

    it(`${locale}: the usage markup carries every text the component asks for`, () => {
      const markup = translations(locale).commandDocs.usageMarkup as string;
      for (const attribute of ['label', 'placeholder', 'empty-heading', 'empty-description', 'results-label', 'hint-navigate', 'hint-open', 'hint-close']) {
        expect(markup, attribute).toContain(`${attribute}="`);
      }
      expect(markup).toContain('{count}');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['commandDocs', 'commandValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').commandDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).commandDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-command Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').commandDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').commandDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).commandDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).commandDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-command Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `FocusAndEscape` is `focus-and-escape`. */
  const idOf = (name: string): string =>
    `components-nph-command-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  /** The pages that open the palette over the page itself, or draw it closed: no frame. */
  const OVER_THE_PAGE = ['OpenByKey', 'FocusAndEscape', 'Brands'];

  it('the stories are the ten pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'Brands',
      'DestructiveCommand',
      'DisabledCommand',
      'FocusAndEscape',
      'FooterOff',
      'Groups',
      'Loading',
      'NothingFound',
      'OpenByKey',
      'Search',
    ]);
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-command · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('the examples come in light and in dark mode, in frames of their own, the destructive one too', () => {
    /* The shape of the brand frames is proved in src/shared/tokens/brand-validation.test.ts. */
    for (const [name, story] of stories.filter(([name]) => !OVER_THE_PAGE.includes(name))) {
      const target = draw(story, 'en');
      const frames = [...target.querySelectorAll('iframe')].map((frame) => frameRequest(frame).globals.colorScheme);
      expect(frames, name).toEqual(['light', 'dark']);
      target.remove();
    }
  });

  it('FooterOff frames the footer off; the other pages leave it on', () => {
    for (const [name, story] of stories.filter(([name]) => !OVER_THE_PAGE.includes(name))) {
      const target = draw(story, 'en');
      for (const frame of target.querySelectorAll('iframe')) {
        expect(frameRequest(frame).args.footer ?? 'on', name).toBe(name === 'FooterOff' ? 'off' : 'on');
      }
      target.remove();
    }
  });

  it('FocusAndEscape opens the real palette over the page from a button, with text from the dictionary', async () => {
    const target = draw(validation.FocusAndEscape as Renderable, 'pt-BR');
    const v = translations('pt-BR').commandValidation;
    const palette = target.querySelector('nph-command') as NphCommand;
    await palette.updateComplete;
    expect(palette.open).toBe(false);
    expect(palette.label).toBe(v.label);
    expect(palette.hintNavigate).toBe(v.hintNavigate);
    const trigger = target.querySelector('[data-nph-command-trigger]') as HTMLElement;
    expect(trigger.getAttribute('text')).toBe(v.openPalette);
    trigger.click();
    await palette.updateComplete;
    expect(palette.open).toBe(true);
  });

  it('OpenByKey draws the palette closed, with the trigger, and play turns the global shortcut on', async () => {
    const target = draw(validation.OpenByKey as Renderable, 'en');
    const palette = target.querySelector('nph-command') as NphCommand;
    await palette.updateComplete;
    expect(palette.open).toBe(false);
    expect(palette.globalShortcut).toBe(false);
    expect(target.querySelector('[data-nph-command-trigger]')).not.toBeNull();
  });

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
});

describe('nph-command Fixtures', () => {
  it('is hidden from the sidebar and is the story the frames ask for', () => {
    expect(fixtures.tags).toContain('!dev');
    expect(fixtures.title).toBe('Components/nph-command/Fixtures');
    expect(FIXTURE_STORY).toBe('components-nph-command-fixtures--example');
    for (const locale of LOCALES) {
      expect(sidebarLabel('components-nph-command-fixtures--example', locale)).toBeTruthy();
    }
  });

  for (const example of EXAMPLES) {
    it(`${example}: draws the real palette, open, with every text from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(Example as unknown as Renderable, locale, { example });
        const v = translations(locale).commandValidation;
        const allowed = new Set(leaves(v));
        const palette = target.querySelector('nph-command') as NphCommand;
        await palette.updateComplete;
        expect(palette.open, `${example} ${locale}`).toBe(true);
        for (const text of [palette.label, palette.placeholder, palette.loadingLabel, palette.emptyHeading, palette.emptyDescription, palette.resultsLabel, palette.hintNavigate, palette.hintOpen, palette.hintClose]) {
          expect(allowed.has(text), `${example} ${locale}: ${text}`).toBe(true);
        }
        for (const entry of palette.items) {
          expect(allowed.has(entry.text), `${example} ${locale}: ${entry.text}`).toBe(true);
          if ('description' in entry && entry.description !== undefined) expect(allowed.has(entry.description)).toBe(true);
          if ('shortcut' in entry && entry.shortcut !== undefined) expect(allowed.has(entry.shortcut)).toBe(true);
        }
        palette.open = false;
        target.remove();
      }
    });
  }

  it('the play function types the text of the example in the field, as the person would', async () => {
    for (const [example, locale] of [['search', 'en'], ['search', 'pt-BR'], ['search', 'es'], ['empty', 'en']] as const) {
      const target = draw(Example as unknown as Renderable, locale, { example });
      const v = translations(locale).commandValidation;
      const palette = target.querySelector('nph-command') as NphCommand;
      await typeQuery(target);
      expect(palette.query).toBe(queryOf(example, v));
      expect(palette.shadowRoot?.querySelector<HTMLInputElement>('.field')?.value).toBe(queryOf(example, v));
      palette.open = false;
      target.remove();
    }
  });

  it('the search example finds exactly one command in every language, and the empty example none', async () => {
    for (const locale of LOCALES) {
      const v = translations(locale).commandValidation;
      const search = queryOf('search', v).toLocaleLowerCase();
      const hits = commandsOf('search', v).filter(
        (entry) => entry.type !== 'label' && entry.text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase().includes(search),
      );
      expect(hits, locale).toHaveLength(1);
      const none = queryOf('empty', v);
      expect(commandsOf('empty', v).some((entry) => entry.type !== 'label' && entry.text.toLocaleLowerCase().includes(none))).toBe(false);
    }
  });

  it('the destructive example has a destructive command, in every language, and the others have none', () => {
    for (const locale of LOCALES) {
      const v = translations(locale).commandValidation;
      for (const example of EXAMPLES) {
        const destructive = commandsOf(example, v).filter((entry) => entry.type !== 'label' && entry.severity === 'destructive');
        expect(destructive.length, `${example} ${locale}`).toBe(example === 'destructive' ? 1 : 0);
      }
    }
  });

  it('the disabled example has a disabled command', () => {
    const v = translations('en').commandValidation;
    expect(commandsOf('disabled', v).some((entry) => entry.type !== 'label' && entry.disabled === true)).toBe(true);
  });

  it('the footer variant hides the footer of the example', async () => {
    const target = draw(Example as unknown as Renderable, 'en', { example: 'results', footer: 'off' });
    const palette = target.querySelector('nph-command') as NphCommand;
    await palette.updateComplete;
    expect(palette.hideFooter).toBe(true);
    palette.open = false;
  });

  it('every gate story names an example and a mode, and the destructive example is gated in both modes', () => {
    const gates = Object.entries(fixtureModule).filter(([name, story]) => name !== 'default' && name !== 'Example' && typeof story === 'object') as Array<
      [string, { args: { example: string }; globals: { colorScheme: string } }]
    >;
    const keys = gates.map(([, story]) => `${story.args.example}/${story.globals.colorScheme}`);
    for (const example of EXAMPLES) {
      expect(keys, example).toContain(`${example}/light`);
      expect(keys, example).toContain(`${example}/dark`);
    }
    expect(new Set(keys.map((key) => key.split('/')[0]))).toEqual(new Set(EXAMPLES));
  });
});
