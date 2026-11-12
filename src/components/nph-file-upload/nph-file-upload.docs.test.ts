/**
 * Contract of the `nph-file-upload` Documentation page: index with no orphan anchor in all three
 * languages, no leftover placeholder, the `fileUploadDocs` and `fileUploadValidation` dictionaries with
 * the same shape in pt-BR, en and es (`test:i18n` only reads `.md` pairs), and the two "When to use"
 * lists equal to the ones of the sheet.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { translations } from '../../../.storybook/i18n/index.js';
import metadata from '../../shared/metadata/nph-file-upload.json';
import { Documentation } from './nph-file-upload.docs.stories';
import * as validation from './nph-file-upload.stories';
import { NphFileUpload } from './nph-file-upload';

/** Let every zone render and every item settle before the page is taken out of the document. */
afterEach(async () => {
  const zones = [...document.querySelectorAll('nph-file-upload')] as NphFileUpload[];
  await Promise.all(zones.map((zone) => zone.updateComplete));
  await new Promise((resolve) => setTimeout(resolve, 50));
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

describe('nph-file-upload Documentation', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every link points to a section and every section has a link`, () => {
      const target = renderInLocale(locale);
      const links = [...target.querySelectorAll('nav a')].map((a) => (a.getAttribute('href') ?? '').replace(/^#/, ''));
      const sections = [...target.querySelectorAll('section[id]')].map((s) => s.id);
      expect(links.length).toBeGreaterThan(0);
      expect([...sections].sort()).toEqual([...links].sort());
    });

    it(`${locale}: no {name} placeholder is left on the page`, () => {
      const text = renderInLocale(locale).textContent ?? '';
      /* The Usage markup shows the markers of the texts of the zone, as the consumer writes them. */
      expect(text.replace(/\{(progress|name|count|reason)\}/g, '')).not.toMatch(/\{\w+\}/);
    });

    it(`${locale}: every zone on the page renders and has an accessible name`, async () => {
      const target = renderInLocale(locale);
      const pieces = [...target.querySelectorAll('nph-file-upload')] as NphFileUpload[];
      await Promise.all(pieces.map((piece) => piece.updateComplete));
      expect(pieces.length).toBeGreaterThan(0);
      for (const piece of pieces) {
        expect(piece.hasAttribute('data-nph-rendered'), piece.outerHTML).toBe(true);
        const name = piece.shadowRoot?.querySelector('.zone')?.getAttribute('aria-label') ?? piece.closest('nph-field')?.getAttribute('label');
        expect(name, piece.outerHTML).toBeTruthy();
      }
    });

    it(`${locale}: the matrix shows the zone in its states`, () => {
      const target = renderInLocale(locale);
      const matrix = target.querySelector('[data-nph-matrix]') as HTMLElement;
      const zones = [...matrix.querySelectorAll('nph-file-upload')] as NphFileUpload[];
      expect(zones.length).toBeGreaterThanOrEqual(3);
      expect(zones.some((zone) => zone.error !== '')).toBe(true);
      expect(zones.some((zone) => zone.maxFiles !== null && zone.files.length >= zone.maxFiles)).toBe(true);
    });

    it(`${locale}: the three required examples, in light and in dark mode`, () => {
      const target = renderInLocale(locale);
      const examples = target.querySelector('section#examples') as HTMLElement;
      const schemes = [...examples.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes).toEqual(['light', 'dark']);
      for (const figure of examples.querySelectorAll('figure[data-nph-color-scheme]')) {
        const zones = [...figure.querySelectorAll('nph-file-upload')] as NphFileUpload[];
        expect(zones.map((zone) => zone.files.length)).toEqual([0, 3, 5]);
        expect(zones[1]?.files.map((entry) => entry.status)).toEqual(['uploading', 'error', 'done']);
        expect(zones[2]?.maxFiles).toBe(5);
      }
    });

    it(`${locale}: the example texts feed every owed text, so no warning is left to say`, () => {
      const target = renderInLocale(locale);
      for (const piece of target.querySelectorAll('nph-file-upload') as NodeListOf<NphFileUpload>) {
        for (const name of [
          'prompt',
          'buttonText',
          'draggingText',
          'rule',
          'limitText',
          'limitRule',
          'uploadingText',
          'sentText',
          'doneText',
          'retryText',
          'removeLabel',
          'cancelLabel',
          'addedText',
          'sentAnnouncement',
          'errorAnnouncement',
          'removedAnnouncement',
        ] as const) {
          /* A zone inside `nph-field` is named by the field; the texts are on every zone. */
          expect(piece[name], `${name} ${piece.outerHTML}`).toBeTruthy();
        }
      }
    });
  }

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').fileUploadDocs);
    expect(shape(translations('pt-BR').fileUploadDocs)).toEqual(source);
    expect(shape(translations('es').fileUploadDocs)).toEqual(source);
  });
});

describe('nph-file-upload Documentation: the lists of the page are the lists of the sheet', () => {
  it('"When to use" is the use_when of the sheet, item by item', () => {
    expect(translations('en').fileUploadDocs.whenToUse).toEqual(metadata.use_when);
  });

  it('"When not to use" is the do_not_use_when of the sheet, item by item', () => {
    expect(translations('en').fileUploadDocs.whenNotToUse).toEqual(metadata.do_not_use_when);
  });

  it('the page renders every item of both lists', () => {
    const text = renderInLocale('en').textContent ?? '';
    for (const item of [...metadata.use_when, ...metadata.do_not_use_when]) {
      expect(text, item).toContain(item);
    }
  });
});

describe('nph-file-upload Validation: text only from the dictionary', () => {
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };
  const stories = Object.entries(validation).filter(
    ([name, story]) => name !== 'default' && typeof (story as Renderable).render === 'function',
  ) as Array<[string, Renderable]>;

  it('the stories are the ones of the contract', () => {
    expect(stories.map(([name]) => name).sort()).toEqual(
      ['Brands', 'Dragging', 'Examples', 'Field', 'Formats', 'Items', 'Kinds', 'Limit', 'States', 'Width'].sort(),
    );
  });

  for (const [name, story] of stories) {
    it(`${name}: every zone renders, in all three languages`, async () => {
      for (const locale of LOCALES) {
        const target = document.createElement('div');
        document.body.append(target);
        render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
        const pieces = [...target.querySelectorAll('nph-file-upload')] as NphFileUpload[];
        await Promise.all(pieces.map((piece) => piece.updateComplete));
        expect(pieces.length, `${name} ${locale}`).toBeGreaterThan(0);
        for (const piece of pieces) {
          expect(piece.hasAttribute('data-nph-rendered'), `${name} ${locale} ${piece.outerHTML}`).toBe(true);
        }
        target.remove();
      }
    });
  }

  it('States: the four states a page sets show, in some zone', () => {
    const target = document.createElement('div');
    document.body.append(target);
    render((validation.States as Renderable).render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
    const zones = [...target.querySelectorAll('nph-file-upload')] as NphFileUpload[];
    expect(zones.some((zone) => zone.error !== '' && !zone.disabled)).toBe(true);
    expect(zones.some((zone) => zone.maxFiles !== null && zone.files.length >= zone.maxFiles && !zone.disabled)).toBe(true);
    expect(zones.some((zone) => zone.disabled)).toBe(true);
    expect(zones.some((zone) => !zone.disabled && zone.error === '' && zone.maxFiles === null)).toBe(true);
  });

  it('Formats: both formats', () => {
    const target = document.createElement('div');
    document.body.append(target);
    render((validation.Formats as Renderable).render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
    const zones = [...target.querySelectorAll('nph-file-upload')] as NphFileUpload[];
    expect(new Set(zones.map((zone) => zone.format))).toEqual(new Set(['default', 'compact']));
  });

  it('Items: every status of an item shows in a list', () => {
    const target = document.createElement('div');
    document.body.append(target);
    render((validation.Items as Renderable).render?.({}, { globals: { locale: 'en' } }) as TemplateResult, target);
    const statuses = new Set<string>();
    for (const zone of target.querySelectorAll('nph-file-upload') as NodeListOf<NphFileUpload>) {
      for (const entry of zone.files) statuses.add(entry.status ?? 'ready');
    }
    expect([...statuses].sort()).toEqual(['done', 'error', 'ready', 'sent', 'uploading']);
  });

  it('Examples: light and dark, with the captions of the chosen language', () => {
    const story = validation.Examples as Renderable;
    for (const locale of LOCALES) {
      const target = document.createElement('div');
      document.body.append(target);
      render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
      const schemes = [...target.querySelectorAll('[data-nph-color-scheme]')].map((el) => el.getAttribute('data-nph-color-scheme'));
      expect(schemes, locale).toEqual(['light', 'dark']);
      const captions = [...target.querySelectorAll('figcaption')].map((el) => el.textContent?.trim());
      const expected = translations(locale).fileUploadValidation;
      expect(captions, locale).toEqual([expected.lightCaption, expected.darkCaption]);
      target.remove();
    }
  });

  it('pt-BR and es have the same shape as en', () => {
    const source = shape(translations('en').fileUploadValidation);
    expect(shape(translations('pt-BR').fileUploadValidation)).toEqual(source);
    expect(shape(translations('es').fileUploadValidation)).toEqual(source);
  });
});

describe('nph-file-upload documentation — order of the model', () => {
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
        'items',
        'choice',
        'width',
        'keyboard',
        'relations',
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
