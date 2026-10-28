/**
 * Contract of the `nph-toggle-group` Documentation page and of its Validation stories:
 * index with no orphan anchor in all three languages, no leftover placeholder, the
 * `toggleGroupDocs` and `toggleGroupValidation` dictionaries with the same shape in
 * pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text of another language on
 * the English page, and the two "When to use" lists equal to the ones of the sheet (page
 * and sheet match, with no item dropped). The page reads the lists from the Metadata
 * (P71), and `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-toggle-group.json';
import { Documentation } from './nph-toggle-group.docs.stories';
import * as validation from './nph-toggle-group.stories';
import type { NphToggleGroup } from './nph-toggle-group';
import type { NphTogglebutton } from '../nph-togglebutton/nph-togglebutton';

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

type Group = NphToggleGroup & { updateComplete: Promise<unknown> };
type Button = NphTogglebutton & { updateComplete: Promise<unknown> };

async function ready(target: HTMLElement): Promise<Group[]> {
  const groups = [...target.querySelectorAll('nph-toggle-group')] as Group[];
  const buttons = [...target.querySelectorAll('nph-togglebutton')] as Button[];
  await Promise.all([...groups, ...buttons].map((piece) => piece.updateComplete));
  await Promise.all(groups.map((group) => group.updateComplete));
  return groups;
}

describe('nph-toggle-group Documentation', () => {
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
      expect(header?.textContent?.trim()).toBe('nph-toggle-group');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every group on the page renders, is named and has no warning-worthy mix`, async () => {
      const target = renderInLocale(locale);
      const groups = await ready(target);
      expect(groups.length).toBeGreaterThan(0);
      for (const group of groups) {
        expect(group.hasAttribute('data-nph-rendered'), group.outerHTML).toBe(true);
        expect((group.getAttribute('aria-label') ?? '').trim(), group.outerHTML).not.toBe('');
        const buttons = [...group.querySelectorAll('nph-togglebutton')];
        expect(buttons.length, group.outerHTML).toBeGreaterThanOrEqual(2);
        expect(new Set(buttons.map((button) => button.getAttribute('value'))).size).toBe(buttons.length);
        const withText = buttons.filter((button) => (button.getAttribute('text') ?? '') !== '');
        expect([0, buttons.length], group.outerHTML).toContain(withText.length);
      }
    });

    it(`${locale}: every icon-only button has a label`, () => {
      const target = renderInLocale(locale);
      const iconOnly = [...target.querySelectorAll('nph-togglebutton')].filter((button) => (button.getAttribute('text') ?? '') === '');
      expect(iconOnly.length).toBeGreaterThan(0);
      for (const piece of iconOnly) {
        expect((piece.getAttribute('label') ?? '').trim(), piece.outerHTML).not.toBe('');
      }
    });

    it(`${locale}: the matrix shows text and icon only, with two and three buttons`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['text: yes', 'text: no']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        buttons: [...tr.querySelectorAll('td')].map((cell) => cell.querySelectorAll('nph-togglebutton').length),
        withText: [...tr.querySelectorAll('td')].map((cell) => [...cell.querySelectorAll('nph-togglebutton')].every((b) => b.getAttribute('text') !== '')),
      }));
      expect(rows).toEqual([
        { label: 'buttons: 2', buttons: [2, 2], withText: [true, false] },
        { label: 'buttons: 3', buttons: [3, 3], withText: [true, false] },
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
        const group = entry.querySelector('nph-toggle-group') as HTMLElement;
        return {
          selection: group.getAttribute('selection'),
          iconOnly: [...group.querySelectorAll('nph-togglebutton')].every((button) => button.getAttribute('text') === ''),
          icons: [...group.querySelectorAll('nph-togglebutton')].map((button) => button.getAttribute('icon-start')),
          buttons: group.querySelectorAll('nph-togglebutton').length,
        };
      });
      expect(shown).toEqual([
        { selection: 'single', iconOnly: true, icons: ['align-left', 'align-center', 'align-right'], buttons: 3 },
        { selection: 'multiple', iconOnly: true, icons: ['bold', 'italic', 'underline'], buttons: 3 },
        { selection: 'single', iconOnly: false, icons: ['auto', 'auto', 'auto'], buttons: 3 },
      ]);
    });

    it(`${locale}: the accessibility section says single selection is not announced as exclusive`, () => {
      const target = renderInLocale(locale);
      const section = target.querySelector('section#accessibility') as HTMLElement;
      expect(section.textContent ?? '').toContain('aria-pressed');
      expect(section.textContent ?? '').toContain('role=group');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').toggleGroupDocs);
    expect(shape(translations('pt-BR').toggleGroupDocs)).toEqual(source);
    expect(shape(translations('es').toggleGroupDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').toggleGroupDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).toggleGroupDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-toggle-group Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').toggleGroupDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').toggleGroupDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).toggleGroupDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).toggleGroupDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-toggle-group Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `SingleSelection` is `single-selection`. */
  const idOf = (name: string): string =>
    `components-nph-toggle-group-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the six pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'ButtonStates',
      'Examples',
      'Interactive',
      'Matrix',
      'MultipleSelection',
      'SingleSelection',
    ]);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const schemes = frames.map((el) => el.getAttribute('data-nph-color-scheme'));
        const expectedSchemes = name === 'Examples' ? ['light', 'dark', 'light', 'dark', 'light', 'dark'] : ['light', 'dark'];
        expect(schemes, `${name} ${locale}`).toEqual(expectedSchemes);
        const expected = translations(locale).toggleGroupValidation;
        const captions = [...target.querySelectorAll('figcaption')]
          .filter((el) => frames.includes(el.parentElement as Element))
          .map((el) => el.textContent?.trim() ?? '');
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-toggle-group · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every name, text and label of a piece comes from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).toggleGroupValidation));
        const groups = await ready(target);
        expect(groups.length, name).toBeGreaterThan(0);
        for (const group of groups) {
          expect(group.hasAttribute('data-nph-rendered'), group.outerHTML).toBe(true);
          expect(allowed.has(group.getAttribute('label') ?? ''), `${name} ${locale}: ${group.getAttribute('label')}`).toBe(true);
        }
        for (const piece of target.querySelectorAll('nph-togglebutton')) {
          const value = piece.getAttribute('text') || piece.getAttribute('label') || '';
          expect(allowed.has(value), `${name} ${locale}: ${piece.outerHTML}`).toBe(true);
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

  it('Interactive: a click changes the selection and shows detail.value in the status text', async () => {
    const story = validation.Interactive as Renderable;
    for (const locale of LOCALES) {
      const target = draw(story, locale);
      const v = translations(locale).toggleGroupValidation;
      const [group] = await ready(target);
      const status = target.querySelector('output') as HTMLOutputElement;
      const buttons = [...(group?.querySelectorAll('nph-togglebutton') ?? [])] as Button[];
      expect(status.textContent).toBe(v.statusIdle);

      (buttons[1]?.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
      expect(status.textContent).toBe(v.statusChanged.replace('{value}', 'center'));

      (buttons[2]?.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
      expect(status.textContent).toBe(v.statusChanged.replace('{value}', 'right'));
      target.remove();
    }
  });

  it('ButtonStates: the disabled and the invalid button are shown, each on the button', async () => {
    const target = draw(validation.ButtonStates as Renderable, 'en');
    await ready(target);
    expect(target.querySelectorAll('nph-togglebutton[disabled]').length).toBeGreaterThan(0);
    expect(target.querySelectorAll('nph-togglebutton[invalid]').length).toBeGreaterThan(0);
    expect(target.querySelector('nph-toggle-group[disabled], nph-toggle-group[invalid]')).toBeNull();
  });

  it('SingleSelection and MultipleSelection show the selection they name', async () => {
    for (const [name, selection] of [['SingleSelection', 'single'], ['MultipleSelection', 'multiple']] as const) {
      const target = draw(validation[name] as Renderable, 'en');
      const groups = await ready(target);
      expect(groups.length, name).toBeGreaterThan(0);
      for (const group of groups) {
        expect(group.getAttribute('selection'), name).toBe(selection);
      }
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').toggleGroupValidation);
    expect(shape(translations('pt-BR').toggleGroupValidation)).toEqual(source);
    expect(shape(translations('es').toggleGroupValidation)).toEqual(source);
  });
});

describe('nph-toggle-group documentation — order of the model', () => {
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
      expect(sections).toEqual(['when-to-use', 'api', 'usage', 'selection', 'anatomy', 'accessibility', 'examples', 'references']);
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
