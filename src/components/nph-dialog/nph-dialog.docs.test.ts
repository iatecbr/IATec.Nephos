/**
 * Contract of the `nph-dialog` Documentation page, of its Validation stories and of its hidden
 * Fixtures story: index with no orphan anchor in all three languages, no leftover placeholder,
 * every frame titled and pointing at the Fixtures story with a known example, the matrix of size
 * by actions, the three required examples in light and dark mode, the `dialogDocs` and
 * `dialogValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads
 * `.md` pairs), no text of another language on the English page, the two "When to use" lists equal
 * to the ones of the sheet, and the Fixtures story drawing the real dialog, open, with text from
 * the dictionary. The page reads the lists from the Metadata (P71), and
 * `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-dialog.json';
import { Documentation } from './nph-dialog.docs.stories';
import * as validation from './nph-dialog.stories';
import fixtures, { Example } from './nph-dialog.fixtures.stories';
import { EXAMPLES, FIXTURE_STORY } from './nph-dialog.demo';
import type { NphDialog } from './nph-dialog';

afterEach(() => {
  for (const dialog of document.querySelectorAll('nph-dialog')) {
    dialog.open = false;
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

describe('nph-dialog Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title, and the page is named nph-dialog`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-dialog');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every frame is titled and asks the Fixtures story for a known example, in the language of the page`, () => {
      const target = renderInLocale(locale);
      const frames = [...target.querySelectorAll('iframe')];
      expect(frames.length).toBeGreaterThan(0);
      for (const frame of frames) {
        expect(frame.title).toBe(translations(locale).dialogDocs.frameTitle);
        const request = frameRequest(frame);
        expect(request.id).toBe(FIXTURE_STORY);
        expect((EXAMPLES as readonly string[]).includes(request.args.example ?? '')).toBe(true);
        expect(request.globals.locale).toBe(locale);
        expect(['light', 'dark']).toContain(request.globals.colorScheme);
      }
    });

    it(`${locale}: the matrix is size by actions, in the mode of the selector`, () => {
      for (const scheme of ['light', 'dark']) {
        const target = renderInLocale(locale, scheme);
        const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
        const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
        expect(columns).toEqual(['actions: inline', 'actions: stacked']);
        const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
          label: tr.querySelector('th')?.textContent?.trim(),
          cells: [...tr.querySelectorAll('iframe')].map((frame) => {
            const { args, globals } = frameRequest(frame);
            return `${args.size}/${args.actions}/${globals.colorScheme}`;
          }),
        }));
        expect(rows).toEqual([
          { label: 'size: sm', cells: [`sm/inline/${scheme}`, `sm/stacked/${scheme}`] },
          { label: 'size: md', cells: [`md/inline/${scheme}`, `md/stacked/${scheme}`] },
          { label: 'size: lg', cells: [`lg/inline/${scheme}`, `lg/stacked/${scheme}`] },
        ]);
        target.remove();
      }
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#required-examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos.map((entry) => entry.querySelector('[data-nph-dialog-example]')?.getAttribute('data-nph-dialog-example'))).toEqual([
        'edit-profile',
        'send-for-approval',
        'import-contacts',
      ]);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
        const frames = [...entry.querySelectorAll('iframe')].map((frame) => frameRequest(frame).globals.colorScheme);
        expect(frames).toEqual(['light', 'dark']);
      }
    });

    it(`${locale}: the accessibility section names the modal dialog, the name, Esc and the focus`, () => {
      const target = renderInLocale(locale);
      const text = target.querySelector('section#accessibility')?.textContent ?? '';
      expect(text).toContain('role=dialog');
      expect(text).toContain('aria-modal');
      expect(text).toContain('aria-labelledby');
      expect(text).toContain('Esc');
      expect(text).toContain('autofocus');
      expect(text).toContain('close-label');
    });

    it(`${locale}: the API table names every property, both slots and the event`, () => {
      const target = renderInLocale(locale);
      const terms = [...(target.querySelector('section#api')?.querySelectorAll('tbody tr') ?? [])].map(
        (tr) => tr.firstElementChild?.textContent?.trim(),
      );
      expect(terms).toEqual([
        'heading',
        'description',
        'size',
        'actions',
        'hide-close',
        'close-label',
        'header-separator',
        'footer-separator',
        'open',
        'slot',
        'slot footer',
        'nph-close',
      ]);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['dialogDocs', 'dialogValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').dialogDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).dialogDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-dialog Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').dialogDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').dialogDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).dialogDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).dialogDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-dialog Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `FocusAndEscape` is `focus-and-escape`. */
  const idOf = (name: string): string =>
    `components-nph-dialog-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the seven pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'Brands',
      'FocusAndEscape',
      'LoadingAction',
      'ShortConfirmation',
      'ShortForm',
      'StackedActions',
      'WideContent',
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-dialog · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('the examples come in light and in dark mode, in frames of their own', () => {
    /* The shape of the brand frames is proved in src/shared/tokens/brand-validation.test.ts. */
    for (const [name, story] of stories.filter(([name]) => name !== 'FocusAndEscape' && name !== 'Brands')) {
      const target = draw(story, 'en');
      const frames = [...target.querySelectorAll('iframe')].map((frame) => frameRequest(frame).globals.colorScheme);
      expect(frames, name).toEqual(['light', 'dark']);
      target.remove();
    }
  });

  it('FocusAndEscape opens the real dialog over the page from a button, with text from the dictionary', async () => {
    const target = draw(validation.FocusAndEscape as Renderable, 'pt-BR');
    const v = translations('pt-BR').dialogValidation;
    const dialog = target.querySelector('nph-dialog') as NphDialog;
    await dialog.updateComplete;
    expect(dialog.open).toBe(false);
    expect(dialog.heading).toBe(v.editProfileHeading);
    expect(dialog.closeLabel).toBe(v.close);
    const trigger = target.querySelector('[data-nph-dialog-trigger]') as HTMLElement;
    expect(trigger.getAttribute('text')).toBe(v.openDialog);
    trigger.click();
    await dialog.updateComplete;
    expect(dialog.open).toBe(true);
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

describe('nph-dialog Fixtures', () => {
  it('is hidden from the sidebar and is the story the frames ask for', () => {
    expect(fixtures.tags).toContain('!dev');
    expect(fixtures.title).toBe('Components/nph-dialog/Fixtures');
    expect(FIXTURE_STORY).toBe('components-nph-dialog-fixtures--example');
    for (const locale of LOCALES) {
      expect(sidebarLabel('components-nph-dialog-fixtures--example', locale)).toBeTruthy();
    }
  });

  for (const example of EXAMPLES) {
    it(`${example}: draws the real dialog, open, with every text from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(Example as unknown as Renderable, locale, { example });
        const v = translations(locale).dialogValidation;
        const allowed = new Set(leaves(v));
        const dialog = target.querySelector('nph-dialog') as NphDialog;
        await dialog.updateComplete;
        expect(dialog.open, `${example} ${locale}`).toBe(true);
        expect(allowed.has(dialog.heading)).toBe(true);
        expect(allowed.has(dialog.description)).toBe(true);
        expect(dialog.closeLabel).toBe(v.close);
        for (const button of dialog.querySelectorAll('nph-button')) {
          expect(allowed.has(button.getAttribute('text') ?? ''), `${example} ${locale}`).toBe(true);
        }
        for (const label of dialog.querySelectorAll('label')) {
          expect(allowed.has(label.textContent?.trim() ?? '')).toBe(true);
        }
        dialog.open = false;
        target.remove();
      }
    });
  }

  it('the matrix variant changes the size and the actions of the example', async () => {
    const target = draw(Example as unknown as Renderable, 'en', { example: 'edit-profile', size: 'lg', actions: 'stacked' });
    const dialog = target.querySelector('nph-dialog') as NphDialog;
    await dialog.updateComplete;
    expect(dialog.size).toBe('lg');
    expect(dialog.actions).toBe('stacked');
  });
});
