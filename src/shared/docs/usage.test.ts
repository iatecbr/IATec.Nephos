/**
 * The Usage section of every component `Docs` page (P70; `docs/stories.md`, §4.10; DSA-35).
 * The test fails a page:
 * - that does not build the section with the `usage` block, or names the package by hand;
 * - whose Usage section is not the section right after API, or has no link in the index right
 *   after the link to API, in any of the three languages;
 * - whose markup row says the piece has no slot while the component renders one;
 * - whose markup is not the `usageMarkup` of its dictionary, does not show its own tag, shows a
 *   tag that is not a component of the package, changes tags or attributes between languages, or
 *   makes a component report an error when it renders (the pieces whose data only comes by a
 *   property report that the data is missing, and their Usage text says so);
 * - whose import lines do not start with its own component, do not read the package name from
 *   `package.json`, leave out a component the markup needs or add one that another line, or the
 *   page's own component, already registers.
 *
 * The pages are found by file name, so a new `Docs` page is covered without being listed here.
 * That each import line resolves to a build that registers the component with its CSS is proved
 * by `npm run test:package`, which imports every component through the package in a browser.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import { LOCALES, translations } from '../../../.storybook/i18n/index.js';
import pkg from '../../../package.json';
import { importLine } from './page';

afterEach(() => {
  document.body.replaceChildren();
});

type Page = { Documentation: { render?: (args: unknown, context: unknown) => TemplateResult } };

const pages = import.meta.glob<Page>('../../components/*/*.docs.stories.ts', { eager: true });
const sources = import.meta.glob<string>('../../components/*/*.docs.stories.ts', {
  eager: true,
  query: '?raw',
  import: 'default',
});
/** The modules of each component, without its tests, stories and demos. */
const modules = import.meta.glob<string>(
  ['../../components/*/*.ts', '!../../components/*/*.test.ts', '!../../components/*/*.stories.ts', '!../../components/*/*.demo.ts'],
  { eager: true, query: '?raw', import: 'default' },
);

const COMPONENT = /^nph-[a-z]+(?:-[a-z]+)*$/;

/**
 * The component tags that each component imports, read from its modules: a bare import
 * (`import '../nph-icon/nph-icon'`) and an import of values (`import { NphOption } from
 * '../nph-option/nph-option'`) both run the module that registers the tag; `import type` does not.
 */
const IMPORTS_A_COMPONENT =
  /import\s+(?!type\b)(?:[^'";]*?\s+from\s+)?['"]\.\.\/(nph-[a-z]+(?:-[a-z]+)*)\/\1['"]/g;
const directImports = new Map<string, Set<string>>();
for (const [path, text] of Object.entries(modules)) {
  const folder = path.split('/').at(-2) as string;
  const found = directImports.get(folder) ?? new Set<string>();
  for (const [, tag] of text.matchAll(IMPORTS_A_COMPONENT)) found.add(tag as string);
  directImports.set(folder, found);
}
const components = new Set(directImports.keys());

/** Every tag that importing `tag` registers: itself and, transitively, what it imports. */
function registers(tag: string, seen = new Set<string>()): Set<string> {
  if (seen.has(tag)) return seen;
  seen.add(tag);
  for (const inner of directImports.get(tag) ?? []) registers(inner, seen);
  return seen;
}

/** `nph-icon` was the first page and kept the key `docs`; the others follow `<piece>Docs`. */
const DICTIONARY_KEYS: Record<string, string> = { 'nph-icon': 'docs' };

function dictionaryKey(piece: string): string {
  const camel = piece.replace(/^nph-/, '').replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
  return DICTIONARY_KEYS[piece] ?? `${camel}Docs`;
}

interface UsageDictionary {
  readonly usageTitle: string;
  readonly usageMarkup: string;
  readonly usageTag: string;
}

function dictionaryOf(piece: string, locale: string): UsageDictionary {
  return translations(locale)[dictionaryKey(piece)] as UsageDictionary;
}

function renderPage(page: Page, locale: string): HTMLElement {
  const target = document.createElement('div');
  document.body.append(target);
  render(page.Documentation.render?.({}, { globals: { locale } }) as TemplateResult, target);
  return target;
}

/** The elements of a markup, parsed inert: no element upgrades and nothing loads. */
function elementsOf(markup: string): Element[] {
  const template = document.createElement('template');
  template.innerHTML = markup;
  return [...template.content.querySelectorAll('*')];
}

/** The tags and the attribute names of a markup, without values or text. */
function structureOf(markup: string): string[] {
  return elementsOf(markup).map((element) => `${element.localName}[${element.getAttributeNames().sort().join(' ')}]`);
}

/** The term of each row of the Usage table: the markup, then the import lines. */
function usageRows(target: HTMLElement): string[] {
  return [...target.querySelectorAll('section#usage tbody th')].map((th) => th.textContent ?? '');
}

/** Two animation frames: what a component deferred to the next frame has run. */
function nextFrames(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

/**
 * What the components of a markup report while it renders connected to the document: every
 * `console.error` and `console.warn`, until the update and two frames later, since some checks
 * wait for the siblings parsed after the piece, such as the group of a radio.
 */
async function reportsOf(markup: string): Promise<string[]> {
  /* What earlier tests rendered may still have checks waiting for a frame: let them run first. */
  document.body.replaceChildren();
  await nextFrames();
  const reported: string[] = [];
  const report = (...args: unknown[]) => {
    reported.push(args.map(String).join(' '));
  };
  const error = vi.spyOn(console, 'error').mockImplementation(report);
  const warn = vi.spyOn(console, 'warn').mockImplementation(report);
  try {
    const host = document.createElement('div');
    host.innerHTML = markup;
    document.body.append(host);
    const elements = [...host.querySelectorAll('*')] as Array<Element & { updateComplete?: Promise<unknown> }>;
    await Promise.all(elements.map((element) => element.updateComplete));
    await nextFrames();
  } finally {
    error.mockRestore();
    warn.mockRestore();
    document.body.replaceChildren();
  }
  return reported;
}

const IMPORT_LINE = /^import '([^']+)';$/;

/**
 * Pieces whose data only comes by a property, set from JavaScript: the markup alone draws an
 * empty piece, which reports the missing property. The `usageTag` of the page says where the
 * data comes from.
 */
const DATA_BY_PROPERTY: Record<string, string> = { 'nph-dropdown-menu': 'items', 'nph-table': 'columns', 'nph-data-table': 'columns' };

const pieces = Object.entries(pages).map(([path, page]) => ({
  piece: path.split('/').at(-2) as string,
  page,
  source: sources[path] ?? '',
}));

describe('Docs pages: the Usage section', () => {
  it('finds the Docs pages', () => {
    expect(pieces.length).toBeGreaterThan(0);
  });

  it('the package maps every ./nph-* entry point to the build (P75)', () => {
    expect(Object.keys(pkg.exports)).toContain('./nph-*');
  });

  for (const { piece, page, source } of pieces) {
    it(`${piece}: the page builds Usage with the usage block and never writes the package name`, () => {
      expect(source).toMatch(/\busage\(d\.usageHeader, d\.usageMarkup, d\.usageTag, \[/);
      expect(source).toContain("usage: 'usage',");
      expect(source).not.toContain(pkg.name);
    });

    for (const { value: locale } of LOCALES) {
      it(`${piece}: in ${locale}, Usage is the section right after API, linked right after it in the index`, () => {
        const target = renderPage(page, locale);
        const sections = [...target.querySelectorAll('section[id]')].map((section) => section.id);
        expect(sections).toContain('api');
        expect(sections[sections.indexOf('api') + 1]).toBe('usage');
        const links = [...target.querySelectorAll('nav a')].map((link) => link.getAttribute('href'));
        expect(links).toContain('#api');
        expect(links[links.indexOf('#api') + 1]).toBe('#usage');
        expect(target.querySelector('section#usage h2')?.textContent?.trim()).toBe(dictionaryOf(piece, locale).usageTitle);
      });

      it(`${piece}: in ${locale}, Usage shows the markup of the dictionary and the import lines of the package`, () => {
        const [markup, ...lines] = usageRows(renderPage(page, locale));
        expect(markup).toBe(dictionaryOf(piece, locale).usageMarkup);
        expect(markup).toContain(`<${piece}`);
        expect(lines.length).toBeGreaterThan(0);
        expect(lines[0]).toBe(importLine(piece));
        for (const line of lines) {
          const specifier = line.match(IMPORT_LINE)?.[1] ?? '';
          expect(specifier.startsWith(`${pkg.name}/`), line).toBe(true);
          expect(components.has(specifier.slice(pkg.name.length + 1)), line).toBe(true);
        }
      });
    }

    it(`${piece}: the text of the markup row does not deny a slot that the component renders`, () => {
      const rendersSlot = Object.entries(modules).some(
        ([path, text]) =>
          path.split('/').at(-2) === piece && /<slot\b/.test(text.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '')),
      );
      if (rendersSlot) expect(dictionaryOf(piece, 'en').usageTag).not.toMatch(/\bno slot\b/i);
    });

    it(`${piece}: the markup has the same tags and attributes in the three languages`, () => {
      const expected = structureOf(dictionaryOf(piece, 'en').usageMarkup);
      expect(expected.length).toBeGreaterThan(0);
      for (const { value: locale } of LOCALES) {
        expect(structureOf(dictionaryOf(piece, locale).usageMarkup), locale).toEqual(expected);
      }
    });

    it(`${piece}: the import lines register every component of the markup, and no line is redundant`, () => {
      const lines = usageRows(renderPage(page, 'en')).slice(1);
      const imported = lines.map((line) => (line.match(IMPORT_LINE)?.[1] ?? '').slice(pkg.name.length + 1));
      const shown = new Set(
        elementsOf(dictionaryOf(piece, 'en').usageMarkup)
          .map((element) => element.localName)
          .filter((tag) => COMPONENT.test(tag)),
      );
      for (const tag of shown) expect(components.has(tag), `<${tag}> is not a component of the package`).toBe(true);

      const registered = new Set(imported.flatMap((tag) => [...registers(tag)]));
      for (const tag of shown) expect(registered.has(tag), `nothing imports ${tag}`).toBe(true);

      for (const [position, tag] of imported.entries()) {
        if (position === 0) continue;
        expect(shown.has(tag), `${tag} is imported but not in the markup`).toBe(true);
        const others = imported.filter((_, other) => other !== position);
        expect(
          others.some((other) => registers(other).has(tag)),
          `${tag} is already registered by ${others.join(', ')}`,
        ).toBe(false);
      }
    });

    it(`${piece}: the markup renders without a component error, in the three languages`, async () => {
      for (const { value: locale } of LOCALES) {
        const reported = await reportsOf(dictionaryOf(piece, locale).usageMarkup);
        const property = DATA_BY_PROPERTY[piece];
        if (property === undefined) {
          expect(reported, locale).toEqual([]);
        } else {
          expect(reported.length, locale).toBeGreaterThan(0);
          for (const message of reported) expect(message, locale).toContain(`[${piece}] ${property}`);
          expect(dictionaryOf(piece, locale).usageTag, locale).toContain(property);
        }
      }
    });
  }

  it('the render check sees a warning given a frame later: a radio alone is reported', async () => {
    const reported = await reportsOf('<nph-radio name="plan" value="monthly" text="Monthly"></nph-radio>');
    expect(reported.some((message) => message.includes('[nph-radio]')), reported.join(' | ')).toBe(true);
  });

  it('a component that another imports for its values counts as registered by it (nph-option under nph-select)', () => {
    expect(registers('nph-select').has('nph-option')).toBe(true);
    expect(directImports.get('nph-select')?.has('nph-option')).toBe(true);
  });

  it('nph-pagination names each page number: page-label carries {page} in the three languages', () => {
    for (const { value: locale } of LOCALES) {
      const [pagination] = elementsOf(dictionaryOf('nph-pagination', locale).usageMarkup);
      expect(pagination?.getAttribute('page-label'), locale).toContain('{page}');
    }
  });

  it('nph-skeleton shows the markup and the import line of D1 of DSA-35', () => {
    const entry = pieces.find(({ piece }) => piece === 'nph-skeleton');
    expect(entry).toBeDefined();
    for (const { value: locale } of LOCALES) {
      expect(usageRows(renderPage(entry?.page as Page, locale))).toEqual([
        '<nph-skeleton shape="line"></nph-skeleton>',
        `import '${pkg.name}/nph-skeleton';`,
      ]);
    }
  });
});
