/**
 * Contract of the `nph-tooltip` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, every balloon anchored to an
 * element on the page, the four required examples in light and dark mode, the `tooltipDocs` and
 * `tooltipValidation` dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads
 * `.md` pairs), no text of another language on the English page, and the two "When to use" lists
 * equal to the ones of the sheet. Reading the lists from the Metadata is P71 (DSA-34), deferred;
 * see the header of `nph-tooltip.docs.stories.ts`.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-tooltip.json';
import { Documentation } from './nph-tooltip.docs.stories';
import * as validation from './nph-tooltip.stories';
import type { NphTooltip } from './nph-tooltip';

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

async function ready(target: HTMLElement): Promise<NphTooltip[]> {
  const tooltips = [...target.querySelectorAll('nph-tooltip')] as NphTooltip[];
  const labels = [...target.querySelectorAll('nph-label')] as unknown as Array<{ updateComplete: Promise<unknown> }>;
  await Promise.all(labels.map((label) => label.updateComplete));
  await Promise.all(tooltips.map((tooltip) => tooltip.updateComplete));
  return tooltips;
}

describe('nph-tooltip Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-tooltip');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every balloon on the page is anchored to an element of the same page and has text`, async () => {
      const target = renderInLocale(locale);
      const tooltips = await ready(target);
      expect(tooltips.length).toBeGreaterThan(0);
      for (const tooltip of tooltips) {
        expect((tooltip.text ?? '').trim(), tooltip.outerHTML).not.toBe('');
        const anchor = (tooltip.getRootNode() as Document | ShadowRoot).getElementById(tooltip.getAttribute('for') ?? '');
        expect(anchor, tooltip.outerHTML).not.toBeNull();
        /* A balloon that names an icon-only button is referenced as its name, the others as a description. */
        const reference = tooltip.relation === 'name' ? 'aria-labelledby' : 'aria-describedby';
        expect(anchor?.getAttribute(reference)).toContain(tooltip.id);
      }
    });

    it(`${locale}: the matrix shows a short text, one sentence and two lines`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const d = translations(locale).tooltipDocs;
      const rows = [...matrix.querySelectorAll('tbody tr')].map((tr) => ({
        label: tr.querySelector('th')?.textContent?.trim(),
        text: tr.querySelector('nph-tooltip')?.getAttribute('text'),
      }));
      expect(rows).toEqual([
        { label: d.textShort, text: d.short },
        { label: d.textSentence, text: d.sentence },
        { label: d.textTwoLines, text: d.twoLines },
      ]);
    });

    it(`${locale}: the four required examples, each in light and in dark mode, the last one with the four sides`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#required-examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(4);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
      }
      const sides = [...demos[3]!.querySelectorAll('nph-tooltip')].map((tooltip) => tooltip.getAttribute('side'));
      expect(sides).toEqual(['top', 'bottom', 'left', 'right', 'top', 'bottom', 'left', 'right']);
      const required = [...demos[1]!.querySelectorAll('nph-label')].map((label) => label.hasAttribute('required'));
      expect(required).toEqual([true, true]);
      for (const label of demos[0]!.querySelectorAll('nph-label')) {
        expect(label.hasAttribute('required')).toBe(false);
        expect(label.querySelector('nph-tooltip')?.hasAttribute('open')).toBe(true);
      }
    });

    it(`${locale}: the accessibility section names the tooltip role, Esc, touch and the contrast`, () => {
      const target = renderInLocale(locale);
      const section = target.querySelector('section#accessibility') as HTMLElement;
      const text = section.textContent ?? '';
      expect(text).toContain('role=tooltip');
      expect(text).toContain('aria-describedby');
      expect(text).toContain('Esc');
      expect(text).toContain('1.4.13');
      expect(text).toMatch(/6[.,]69:1/);
      expect(text).toMatch(/7[.,]47:1/);
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['tooltipDocs', 'tooltipValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').tooltipDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).tooltipDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-tooltip Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').tooltipDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').tooltipDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).tooltipDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).tooltipDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-tooltip Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `FocusAndEscape` is `focus-and-escape`. */
  const idOf = (name: string): string =>
    `components-nph-tooltip-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the eight pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'AccessibleName',
      'Flip',
      'FocusAndEscape',
      'FocusableOnly',
      'HoverAndFocus',
      'OneLine',
      'Sides',
      'TwoLines',
    ]);
  });

  it('AccessibleName: the icon-only button has no text and the balloon is its name', async () => {
    const target = draw(validation.AccessibleName as Renderable, 'en');
    const [tooltip] = await ready(target);
    const button = target.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('');
    expect(tooltip?.relation).toBe('name');
    expect(button.getAttribute('aria-labelledby')).toBe(tooltip?.id);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    target.remove();
  });

  it('FocusableOnly: the enabled button shows its balloon and the disabled one shows none', async () => {
    const target = draw(validation.FocusableOnly as Renderable, 'en');
    const tooltips = await ready(target);
    const shownOf = (tooltip: Element): boolean =>
      tooltip.shadowRoot?.querySelector('.bubble')?.matches(':popover-open') ?? false;
    expect(tooltips.map(shownOf)).toEqual([true, false]);
    target.remove();
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-tooltip · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every balloon is anchored, and its text, the element's label and the visible words come from the dictionary`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(Object.values(translations(locale).tooltipValidation));
        const tooltips = await ready(target);
        expect(tooltips.length, name).toBeGreaterThan(0);
        for (const tooltip of tooltips) {
          expect(allowed.has(tooltip.text), `${name} ${locale}: ${tooltip.text}`).toBe(true);
          const anchor = (tooltip.getRootNode() as Document | ShadowRoot).getElementById(tooltip.getAttribute('for') ?? '');
          expect(anchor, `${name} ${locale}`).not.toBeNull();
        }
        for (const button of target.querySelectorAll('nph-button[label]')) {
          expect(allowed.has(button.getAttribute('label') ?? ''), `${name} ${locale}`).toBe(true);
        }
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('Sides: the four sides, in light and in dark mode', () => {
    const target = draw(validation.Sides as Renderable, 'en');
    const frames = [...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
    expect(frames).toEqual(['light', 'dark']);
    const sides = [...target.querySelectorAll('nph-tooltip')].map((tooltip) => tooltip.getAttribute('side'));
    expect(sides).toEqual(['top', 'bottom', 'left', 'right', 'top', 'bottom', 'left', 'right']);
    for (const tooltip of target.querySelectorAll('nph-tooltip')) {
      expect(tooltip.hasAttribute('open')).toBe(true);
    }
  });

  it('there is no story per brand: the page follows the global brand, the frame only sets the mode', () => {
    for (const [name, story] of stories) {
      const target = draw(story, 'en');
      expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
      target.remove();
    }
  });
});
