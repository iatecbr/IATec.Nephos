/**
 * Contract of the `nph-field` Documentation page and of its Validation stories: index with no
 * orphan anchor in all three languages, no leftover placeholder, the matrix of the three variant
 * axes, the three required examples in light and dark mode, the `fieldDocs` and `fieldValidation`
 * dictionaries with the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), no text
 * of another language on the English page, and the two "When to use" lists equal to the ones of the
 * sheet. Reading the lists from the Metadata is P71 (DSA-34), deferred; see the header of
 * `nph-field.docs.stories.ts`.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { sidebarLabel, translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-field.json';
import { Documentation } from './nph-field.docs.stories';
import * as validation from './nph-field.stories';
import type { NphField, NphFieldControl } from './nph-field';

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

async function ready(target: HTMLElement): Promise<NphField[]> {
  const fields = [...target.querySelectorAll('nph-field')] as NphField[];
  await Promise.all(fields.map((field) => field.updateComplete));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await Promise.all(fields.map((field) => field.updateComplete));
  return fields;
}

describe('nph-field Documentation', () => {
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
      expect(target.querySelector('header h1')?.textContent?.trim()).toBe('nph-field');
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      expect(renderInLocale(locale).textContent ?? '').not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every field has a label from the dictionary, and its control got the name`, async () => {
      const target = renderInLocale(locale);
      const fields = await ready(target);
      const allowed = new Set(leaves(translations(locale).fieldDocs));
      expect(fields.length).toBeGreaterThan(0);
      for (const field of fields) {
        expect(allowed.has(field.label), field.label).toBe(true);
        const control = field.firstElementChild as NphFieldControl | null;
        if (control?.localName === 'nph-input') {
          expect(control.label).toBe(field.label);
        }
      }
    });

    it(`${locale}: the matrix crosses required and info with an empty and a filled error`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const fields = [...matrix.querySelectorAll('nph-field')] as NphField[];
      expect(fields.map((field) => [field.required, field.info !== '', field.error !== ''])).toEqual([
        [false, false, false],
        [false, false, true],
        [true, false, false],
        [true, false, true],
        [false, true, false],
        [false, true, true],
        [true, true, false],
        [true, true, true],
      ]);
    });

    it(`${locale}: the three required examples, each in light and in dark mode`, async () => {
      const target = renderInLocale(locale);
      await ready(target);
      const examples = target.querySelector('section#required-examples') as HTMLElement;
      const demos = [...examples.querySelectorAll('[data-nph-demo]')];
      expect(demos).toHaveLength(3);
      for (const entry of demos) {
        const schemes = [...entry.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes).toEqual(['light', 'dark']);
      }
      const fieldsOf = (position: number) => [...demos[position]!.querySelectorAll('nph-field')] as NphField[];
      expect(fieldsOf(0).map((field) => field.required)).toEqual([true, true]);
      expect(fieldsOf(1).map((field) => field.error !== '')).toEqual([true, true]);
      expect(fieldsOf(2).map((field) => field.info !== '' && field.infoLabel !== '' && field.help !== '')).toEqual([true, true]);
    });

    it(`${locale}: the group section shows a radiogroup and a group`, async () => {
      const target = renderInLocale(locale);
      const fields = await ready(target);
      const section = target.querySelector('section#group') as HTMLElement;
      const roles = fields
        .filter((field) => section.contains(field))
        .map((field) => field.shadowRoot?.querySelector('.control')?.getAttribute('role'));
      expect(roles).toEqual(['radiogroup', 'group']);
    });

    it(`${locale}: the accessibility section names the name, the description and the contrast`, () => {
      const target = renderInLocale(locale);
      const text = (target.querySelector('section#accessibility') as HTMLElement).textContent ?? '';
      expect(text).toContain('nph-label');
      expect(text).toContain('radiogroup');
      expect(text).toMatch(/14[.,]73:1/);
      expect(text).toContain('21:1');
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    for (const key of ['fieldDocs', 'fieldValidation'] as const) {
      const source = shape(translations('en')[key]);
      expect(shape(translations('pt-BR')[key]), key).toEqual(source);
      expect(shape(translations('es')[key]), key).toEqual(source);
    }
  });

  it('en shows no text that only pt-BR or es carry', () => {
    const rendered = renderInLocale('en').textContent ?? '';
    const english = leaves(translations('en').fieldDocs);
    for (const other of ['pt-BR', 'es'] as const) {
      const foreign = leaves(translations(other).fieldDocs);
      expect(foreign).toHaveLength(english.length);
      foreign.forEach((value, position) => {
        if (value !== english[position]) {
          expect(containsWhole(rendered, value), `${other}: ${value}`).toBe(false);
        }
      });
    }
  });
});

describe('nph-field Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').fieldDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').fieldDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });

  it('the translated lists keep the same number of items', () => {
    for (const locale of ['pt-BR', 'es'] as const) {
      expect(translations(locale).fieldDocs.whenToUse).toHaveLength(metadata.use_when.length);
      expect(translations(locale).fieldDocs.whenNotToUse).toHaveLength(metadata.do_not_use_when.length);
    }
  });
});

describe('nph-field Validation: text only from the dictionary', () => {
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  /** Story export to the story id: `MessageLine` is `message-line`. */
  const idOf = (name: string): string =>
    `components-nph-field-validation--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

  it('the stories are the seven pages of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual([
      'ControlContract',
      'Counter',
      'Disabled',
      'Group',
      'Matrix',
      'MessageLine',
      'Width',
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
        expect(target.querySelector('header h1')?.textContent?.trim()).toBe(`nph-field · ${label}`);
        expect(target.querySelector('header p')?.textContent?.trim()).toBe(claim);
        target.remove();
      }
    });

    it(`${name}: every field text comes from the dictionary, in light and in dark mode`, async () => {
      for (const locale of LOCALES) {
        const target = draw(story, locale);
        const allowed = new Set(leaves(translations(locale).fieldValidation));
        const fields = await ready(target);
        expect(fields.length, name).toBeGreaterThan(0);
        for (const field of fields) {
          for (const value of [field.label, field.help, field.error, field.counter, field.info, field.infoLabel]) {
            if (value !== '') {
              expect(allowed.has(value), `${name} ${locale}: ${value}`).toBe(true);
            }
          }
        }
        const schemes = [...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
        expect(schemes, name).toEqual(['light', 'dark']);
        expect(target.querySelector('[data-nph-brand]'), name).toBeNull();
        expect(target.textContent ?? '', `${name} ${locale}`).not.toMatch(/\{\w+\}/);
        target.remove();
      }
    });
  }

  it('ControlContract: switching the language in the same container updates the readout', async () => {
    const target = document.createElement('div');
    document.body.append(target);
    const story = validation.ControlContract as Renderable;
    render(story.render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
    await ready(target);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    render(story.render?.({}, { globals: { locale: 'pt-BR' } }) as TemplateResult, target);
    await ready(target);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const v = translations('pt-BR').fieldValidation;
    const outputs = [...target.querySelectorAll('output')];
    expect(outputs).toHaveLength(4);
    outputs.forEach((output, position) => {
      expect(output.textContent, `output ${position}`).toContain(`label ${v.email}`);
      const description = position % 2 === 0 ? v.emailHelp : v.emailError;
      expect(output.textContent, `output ${position}`).toContain(`description ${description}`);
    });
  });

  it('ControlContract: the readout shows what the field wrote on each control', async () => {
    const target = draw(validation.ControlContract as Renderable, 'en');
    await ready(target);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const outputs = [...target.querySelectorAll('output')];
    expect(outputs).toHaveLength(4);
    const v = translations('en').fieldValidation;
    expect(outputs[0]?.textContent).toContain(`label ${v.email}`);
    expect(outputs[0]?.textContent).toContain(`description ${v.emailHelp}`);
    expect(outputs[0]?.textContent).toContain('invalid false');
    expect(outputs[1]?.textContent).toContain(`description ${v.emailError}`);
    expect(outputs[1]?.textContent).toContain('invalid true');
    expect(outputs[1]?.textContent).toContain('required true');
  });
});
