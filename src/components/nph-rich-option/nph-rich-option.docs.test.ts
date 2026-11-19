/**
 * Contract of the `nph-rich-option` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, the `richOptionDocs` and
 * `richOptionValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads
 * `.md` pairs), no text of another language on the English page, every card drawn and named, the light
 * and dark copies of a demonstration kept as separate groups, and the two "When to use" lists equal to
 * the ones of the sheet. The page reads the lists from the Metadata (P71), and
 * `src/shared/docs/sheet-lists.test.ts` checks every page.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-rich-option.json';
import { Documentation } from './nph-rich-option.docs.stories';
import * as validation from './nph-rich-option.stories';
import type { NphRichOption } from './nph-rich-option';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
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

async function ready(target: HTMLElement): Promise<NphRichOption[]> {
  const cards = [...target.querySelectorAll('nph-rich-option')];
  await Promise.all(cards.map((piece) => piece.updateComplete));
  return cards;
}

/** At most one checked radio card per name: the copies of a demonstration never share a group. */
function checkedPerName(cards: NphRichOption[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const piece of cards.filter((card) => card.control === 'radio')) {
    counts.set(piece.name, (counts.get(piece.name) ?? 0) + (piece.checked ? 1 : 0));
  }
  return counts;
}

describe('nph-rich-option Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: every section has a title, and the page is named nph-rich-option`, () => {
      const target = renderInLocale(locale);
      const titles = [...target.querySelectorAll('section[id] > h2')].map((h) => h.textContent?.trim() ?? '');
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title).not.toBe('');
      }
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-rich-option');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every card on the page renders, is named, and each radio group has at most one checked`, async () => {
      const target = renderInLocale(locale);
      const cards = await ready(target);
      expect(cards.length).toBeGreaterThan(0);
      for (const piece of cards) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        expect((piece.getAttribute('text') ?? '').trim(), piece.outerHTML).not.toBe('');
        expect(piece.name, piece.outerHTML).not.toBe('');
      }
      for (const [name, count] of checkedPerName(cards)) {
        expect(count, name).toBeLessThanOrEqual(1);
      }
    });

    it(`${locale}: the matrix shows each control, unchecked and checked`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const columns = [...matrix.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
      expect(columns).toEqual(['control: checkbox', 'control: radio', 'control: switch']);
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        controls: [...tr.querySelectorAll('nph-rich-option')].map((piece) => (piece as NphRichOption).control),
        checked: [...tr.querySelectorAll('nph-rich-option')].map((piece) => (piece as NphRichOption).checked),
      }));
      expect(rows).toEqual([
        { label: 'checked: false', controls: ['checkbox', 'radio', 'switch'], checked: [false, false, false] },
        { label: 'checked: true', controls: ['checkbox', 'radio', 'switch'], checked: [true, true, true] },
      ]);
    });

    it(`${locale}: the states section shows default, error and disabled`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const states = target.querySelector('section#states') as HTMLElement;
      expect(states.querySelectorAll('nph-rich-option[invalid]').length).toBe(2);
      expect(states.querySelectorAll('nph-rich-option[disabled]').length).toBe(2);
    });

    it(`${locale}: the rich option section shows the option in a list surface, with the keyboard state`, async () => {
      const target = renderInLocale(locale);
      const section = target.querySelector('section#rich-option') as HTMLElement;
      const options = [...section.querySelectorAll('nph-option')] as Array<HTMLElement & { rich: boolean; keyboard: boolean }>;
      expect(options.length).toBeGreaterThan(0);
      expect(options.every((option) => option.hasAttribute('rich'))).toBe(true);
      expect(options.some((option) => option.keyboard)).toBe(true);
      expect(section.querySelectorAll('nph-rich-option').length).toBe(0);
    });

    it(`${locale}: the three required examples, each in light and in dark mode, as separate groups`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      const shown = demos.map((entry) => {
        const frames = [...entry.querySelectorAll('[data-nph-color-scheme]')];
        expect(frames.map((el) => el.getAttribute('data-nph-color-scheme'))).toEqual(['light', 'dark']);
        const cards = [...entry.querySelectorAll('nph-rich-option')] as NphRichOption[];
        return {
          cards: cards.length,
          checked: cards.filter((piece) => piece.checked).length,
          names: new Set(cards.map((piece) => piece.name)).size,
          controls: [...new Set(cards.map((piece) => piece.control))],
          lists: entry.querySelectorAll('nph-multi-combobox').length,
        };
      });
      expect(shown).toEqual([
        { cards: 6, checked: 2, names: 2, controls: ['radio'], lists: 0 },
        { cards: 6, checked: 2, names: 2, controls: ['switch'], lists: 0 },
        { cards: 0, checked: 0, names: 0, controls: [], lists: 2 },
      ]);
      /* The field wraps its cards in a group named by its label (P83). */
      await vi.waitFor(() => {
        for (const field of [...examples.querySelectorAll('nph-field')].filter((item) => item.querySelector('nph-rich-option') !== null)) {
          const group = field.shadowRoot?.querySelector('[role="group"], [role="radiogroup"]');
          expect(group, field.outerHTML).toBeTruthy();
          expect(group?.getAttribute('aria-label')).toBe(field.getAttribute('label'));
        }
      });
    });

    it(`${locale}: the accessibility section says the host is the control and the control inside is inert`, () => {
      const section = renderInLocale(locale).querySelector('section#accessibility') as HTMLElement;
      expect(section.textContent ?? '').toContain('role');
      expect(section.textContent ?? '').toContain('ElementInternals');
      expect(section.textContent ?? '').toContain('nph-field');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').richOptionDocs);
    expect(shape(translations('pt-BR').richOptionDocs)).toEqual(source);
    expect(shape(translations('es').richOptionDocs)).toEqual(source);
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').richOptionDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).richOptionDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });

  it('the API table names every property and both events of the sheet', () => {
    const terms = translations('en').richOptionDocs.api.map(([term]: [string, string]) => term);
    expect(terms).toEqual(['control', 'checked', 'name', 'value', 'text', 'description', 'icon', 'shortcut', 'keyShortcuts', 'invalid', 'disabled', 'input, change']);
    expect(Object.keys(metadata.api)).toEqual([
      'control',
      'checked',
      'name',
      'value',
      'text',
      'description',
      'icon',
      'shortcut',
      'keyShortcuts',
      'invalid',
      'disabled',
      'input',
      'change',
    ]);
  });
});

describe('nph-rich-option Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').richOptionDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').richOptionDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).richOptionDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).richOptionDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-rich-option Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `RichOption` is `rich-option`. */
  const idOf = (name: string): string => `components-nph-rich-option-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  function draw(story: Renderable, locale: string): HTMLElement {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    return target;
  }

  it('the stories are the nine pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(['Brands', 'Content', 'Examples', 'Form', 'Group', 'Interactive', 'Lists', 'Matrix', 'RichOption']);
  });

  for (const [name, story] of stories) {
    it(`${name}: both modes, with the captions of the chosen language`, () => {
      // The shape of the brand frames is proved in src/shared/tokens/brand-validation.test.ts.
      if (name === 'Brands') return;
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const frames = [...target.querySelectorAll('[data-nph-color-scheme]')];
        const schemes = frames.map((el) => el.getAttribute('data-nph-color-scheme'));
        const pairs = name === 'Examples' ? 3 : name === 'Lists' ? 3 : 1;
        expect(schemes, `${name} ${locale}`).toEqual(Array.from({ length: pairs }, () => ['light', 'dark']).flat());
        const expected = translations(locale).richOptionValidation;
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-rich-option · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every text, description and group name comes from the dictionary, and each radio group has at most one checked`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).richOptionValidation));
        const cards = await ready(target);
        for (const piece of cards) {
          expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
          expect(allowed.has(piece.getAttribute('text') ?? ''), `${name} ${locale}: ${piece.outerHTML}`).toBe(true);
          const description = piece.getAttribute('description') ?? '';
          expect(description === '' || allowed.has(description), `${name} ${locale}: ${description}`).toBe(true);
        }
        for (const option of target.querySelectorAll('nph-option')) {
          expect(allowed.has(option.textContent?.trim() ?? ''), `${name} ${locale}: ${option.textContent}`).toBe(true);
          const description = option.getAttribute('description') ?? '';
          expect(description === '' || allowed.has(description), `${name} ${locale}: ${description}`).toBe(true);
        }
        for (const field of target.querySelectorAll('nph-field')) {
          expect(allowed.has(field.getAttribute('label') ?? ''), `${name} ${locale}: ${field.getAttribute('label')}`).toBe(true);
          for (const attribute of ['help', 'error']) {
            const value = field.getAttribute(attribute) ?? '';
            expect(value === '' || allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
          }
        }
        for (const [group, count] of checkedPerName(cards)) {
          expect(count, `${name} ${locale}: ${group}`).toBeLessThanOrEqual(1);
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
          expect(frame.hasAttribute('data-nph-color-scheme'), name).toBe(true);
          expect(frame.hasAttribute('data-nph-brand-frame'), name).toBe(true);
        }
      } else {
        expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      }
      target.remove();
    }
  });

  it('Matrix: every control, unchecked and checked, in the default, error and disabled states', async () => {
    const target = draw(validation.Matrix as Renderable, 'en');
    await ready(target);
    const firstMode = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const rows = [...firstMode.querySelectorAll('tbody tr')].map((tr) => ({
      label: tr.querySelector('th')?.textContent?.trim(),
      controls: [...new Set([...tr.querySelectorAll('nph-rich-option')].map((piece) => (piece as NphRichOption).control))],
      invalid: [...tr.querySelectorAll('nph-rich-option')].map((piece) => piece.hasAttribute('invalid')),
      disabled: [...tr.querySelectorAll('nph-rich-option')].map((piece) => piece.hasAttribute('disabled')),
      checked: [...new Set([...tr.querySelectorAll('nph-rich-option')].map((piece) => (piece as NphRichOption).checked))],
    }));
    expect(rows.map((row) => row.label)).toEqual([
      'control: checkbox · checked: false',
      'control: checkbox · checked: true',
      'control: radio · checked: false',
      'control: radio · checked: true',
      'control: switch · checked: false',
      'control: switch · checked: true',
    ]);
    for (const row of rows) {
      expect(row.invalid).toEqual([false, true, false]);
      expect(row.disabled).toEqual([false, false, true]);
      expect(row.checked).toHaveLength(1);
    }
  });

  it('Content: no shortcut on the switch, and every part appears in some row', async () => {
    const target = draw(validation.Content as Renderable, 'en');
    const cards = await ready(target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement);
    expect(cards.filter((piece) => piece.control === 'switch').every((piece) => piece.shortcut === '')).toBe(true);
    expect(cards.some((piece) => piece.icon !== '')).toBe(true);
    expect(cards.some((piece) => piece.shortcut !== '')).toBe(true);
    expect(cards.some((piece) => piece.description === '')).toBe(true);
    expect(cards.some((piece) => piece.keyShortcuts !== '')).toBe(true);
  });

  it('Interactive: the arrow moves and checks in the plan group, and change shows what the card holds', async () => {
    const story = validation.Interactive as Renderable;
    for (const locale of LOCALES) {
      const target = draw(story, locale);
      const v = translations(locale).richOptionValidation;
      const firstMode = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
      const cards = await ready(firstMode);
      const status = firstMode.querySelector('output') as HTMLOutputElement;
      expect(status.textContent).toBe(v.statusIdle);
      const plans = cards.filter((piece) => piece.control === 'radio');
      expect(plans.map((piece) => piece.checked)).toEqual([false, true, false]);
      plans[1]?.focus();
      plans[1]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(plans.map((piece) => piece.checked)).toEqual([false, false, true]);
      expect(status.textContent).toBe(v.statusChanged.replace('{control}', 'radio').replace('{value}', 'team').replace('{checked}', 'true'));
      target.remove();
    }
  });

  it('Form: submitting shows the checked cards, the switch is not a member, and reset returns to the first state', async () => {
    const target = draw(validation.Form as Renderable, 'en');
    const v = translations('en').richOptionValidation;
    const firstMode = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const cards = await ready(firstMode);
    const status = firstMode.querySelector('output') as HTMLOutputElement;
    const [submit, reset] = [...firstMode.querySelectorAll('nph-button')] as HTMLElement[];
    await Promise.all([submit, reset].map((button) => (button as unknown as { updateComplete: Promise<unknown> }).updateComplete));
    expect(status.textContent).toBe(v.formIdle);
    const plans = cards.filter((piece) => piece.control === 'radio');
    plans[2]?.click();
    submit?.click();
    expect(status.textContent).toContain(`${plans[0]?.name}=team`);
    expect(status.textContent).toContain('backup');
    reset?.click();
    expect(plans.map((piece) => piece.checked)).toEqual([false, true, false]);
    expect(status.textContent).toContain(`${plans[0]?.name}=annual`);
  });

  it('Group: the error message of the field marks every card and a disabled field disables them', async () => {
    const target = draw(validation.Group as Renderable, 'en');
    const firstMode = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const fields = [...firstMode.querySelectorAll('nph-field')] as Array<HTMLElement & { updateComplete: Promise<unknown> }>;
    await Promise.all(fields.map((field) => field.updateComplete));
    await ready(firstMode);
    const [errorField, disabledField, helpField] = fields;
    const cardsOf = (field: HTMLElement | undefined) => [...(field?.querySelectorAll('nph-rich-option') ?? [])] as NphRichOption[];
    expect(cardsOf(errorField).every((piece) => piece.invalid)).toBe(true);
    expect(cardsOf(disabledField).every((piece) => piece.disabled)).toBe(true);
    expect(cardsOf(helpField).every((piece) => !piece.invalid && !piece.disabled)).toBe(true);
  });

  it('Rich option: every state of the contract, with the keyboard state only on the active by the keyboard rows', () => {
    const target = draw(validation.RichOption as Renderable, 'en');
    const firstMode = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    const rows = [...firstMode.querySelectorAll('tbody tr')].map((tr) => ({
      label: tr.querySelector('th')?.textContent?.trim(),
      keyboard: [...tr.querySelectorAll('nph-option')].every((option) => (option as unknown as { keyboard: boolean }).keyboard),
      options: tr.querySelectorAll('nph-option').length,
    }));
    expect(rows).toEqual([
      { label: 'state: default', keyboard: false, options: 8 },
      { label: 'state: hover', keyboard: false, options: 8 },
      { label: 'state: active (keyboard)', keyboard: true, options: 8 },
      { label: 'state: selected', keyboard: false, options: 8 },
      { label: 'state: selected · active (keyboard)', keyboard: true, options: 8 },
      { label: 'state: disabled', keyboard: false, options: 8 },
      { label: 'state: disabled · selected', keyboard: false, options: 8 },
    ]);
  });

  it('Lists: the select, the combobox and the multiple combobox are open with rich options, and one plain option stays plain', () => {
    const target = draw(validation.Lists as Renderable, 'en');
    const firstMode = target.querySelector('[data-nph-color-scheme="light"]') as HTMLElement;
    expect(firstMode.querySelectorAll('nph-select[open]').length).toBe(1);
    expect(target.querySelectorAll('nph-combobox[open]').length).toBe(2);
    expect(target.querySelectorAll('nph-multi-combobox[open]').length).toBe(2);
    const options = [...firstMode.querySelectorAll('nph-select nph-option')] as Array<HTMLElement & { rich: boolean }>;
    expect(options.map((option) => option.hasAttribute('rich'))).toEqual([true, true, true, false]);
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').richOptionValidation);
    expect(shape(translations('pt-BR').richOptionValidation)).toEqual(source);
    expect(shape(translations('es').richOptionValidation)).toEqual(source);
  });
});

describe('nph-rich-option documentation — order of the model', () => {
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
        'states',
        'group-and-keyboard',
        'form',
        'rich-option',
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
