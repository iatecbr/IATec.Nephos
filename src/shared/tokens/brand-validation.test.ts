/**
 * Which components prove the seven brands (DSA-36, D1, answered by Indiane on
 * 16-10-2026), in a real browser.
 *
 * The brand matters for every component whose code consumes a token that
 * resolves differently across the seven brands of P20, directly or through
 * another token. The test finds those tokens from the generated CSS itself: it
 * puts `data-nph-brand` and `data-nph-color-scheme` on the same element (P67),
 * reads the value that each `--nph-*` resolves to there, and keeps the names
 * whose value changes with the brand in some scheme. A resolved value already
 * follows every `var()` of the chain, so a token that points to a brand token
 * counts too.
 *
 * A component on that list needs a `Brands` story in its `Validation` file,
 * built with `brandFrames`: the seven brands in light and dark, each frame with
 * the two attributes on the same element and the component inside. A piece
 * with no `Validation` file of its own is proved where its other stories live,
 * in the file of the piece that owns it (`nph-option` in `nph-select`): there,
 * a `Brands` story with the piece inside every frame counts. A new
 * component joins the list when its code consumes such a token; nobody edits a
 * list here. Storybook has no brand global (`docs/stories.md`, §6.4).
 */
import { render } from 'lit';
import type { TemplateResult } from 'lit';
import { afterEach, describe, expect, it } from 'vitest';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import managerJs from '../../../.storybook/manager.js?raw';
import previewJs from '../../../.storybook/preview.js?raw';
import { BRANDS, FRAME_ATTRIBUTE, SCHEMES } from '../docs/brands';

/** Every declared name, except the primitives: the brand ones and the semantic ones. */
const NAMES = [...new Set([...tokensCss.matchAll(/(--nph-[\w-]+)\s*:/g)].map((m) => m[1] ?? ''))].filter(
  (name) => name !== '' && !name.startsWith('--nph-core-'),
);

/**
 * The code of each component: its CSS and its TypeScript. Stories, tests and
 * the `*.demo.ts` scenery of the stories are not the component (§4.7).
 */
const SOURCES = import.meta.glob<string>(
  [
    '../../components/*/*.css',
    '../../components/*/*.ts',
    '!../../components/*/*.test.ts',
    '!../../components/*/*.stories.ts',
    '!../../components/*/*.demo.ts',
  ],
  { query: '?raw', import: 'default', eager: true },
);

/** The `Validation` file of each component. The `Docs` page does not count. */
const STORIES = import.meta.glob<Record<string, unknown>>([
  '../../components/*/*.stories.ts',
  '!../../components/*/*.docs.stories.ts',
]);

const pieceOf = (path: string): string => /components\/(nph-[\w-]+)\//.exec(path)?.[1] ?? '';

afterEach(() => {
  document.body.replaceChildren();
});

/** The value of each name on an element that carries the brand and the scheme. */
function resolved(brand: string, scheme: string): Record<string, string> {
  const element = document.createElement('div');
  element.setAttribute('data-nph-brand', brand);
  element.setAttribute('data-nph-color-scheme', scheme);
  document.body.append(element);
  const style = getComputedStyle(element);
  const values = Object.fromEntries(NAMES.map((name) => [name, style.getPropertyValue(name).trim()]));
  element.remove();
  return values;
}

/** The names whose resolved value changes with the brand, in at least one scheme. */
function brandDependentTokens(): Set<string> {
  const dependent = new Set<string>();
  for (const scheme of SCHEMES) {
    const byBrand = BRANDS.map((brand) => resolved(brand, scheme));
    for (const name of NAMES) {
      if (new Set(byBrand.map((values) => values[name])).size > 1) dependent.add(name);
    }
  }
  return dependent;
}

/** The `--nph-*` names a piece consumes through `var()`, comments left out. */
function consumedTokens(): Map<string, Set<string>> {
  const consumed = new Map<string, Set<string>>();
  for (const [path, source] of Object.entries(SOURCES)) {
    const piece = pieceOf(path);
    const names = consumed.get(piece) ?? new Set<string>();
    for (const m of source.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/var\(\s*(--nph-[\w-]+)/g)) {
      if (m[1] !== undefined) names.add(m[1]);
    }
    consumed.set(piece, names);
  }
  return consumed;
}

/** The pieces that consume a brand-dependent token, with the tokens that put them on the list. */
function piecesWhereTheBrandMatters(): Map<string, string[]> {
  const dependent = brandDependentTokens();
  const pieces = new Map<string, string[]>();
  for (const [piece, names] of consumedTokens()) {
    const hits = [...names].filter((name) => dependent.has(name)).sort();
    if (hits.length > 0) pieces.set(piece, hits);
  }
  return pieces;
}

type Render = (args: object, context: object) => TemplateResult;

const ownFile = (piece: string): string | undefined =>
  Object.keys(STORIES).find((key) => key.endsWith(`/${piece}/${piece}.stories.ts`));

/** The frames of the `Brands` story of a `Validation` file, rendered; none when it has no such story. */
async function brandFramesOf(path: string): Promise<HTMLElement[]> {
  const module = await STORIES[path]!();
  const story = (module.Brands as { render?: Render } | undefined)?.render;
  if (story === undefined) return [];
  const container = document.createElement('div');
  document.body.append(container);
  render(story({}, { globals: {} }), container);
  return [...container.querySelectorAll<HTMLElement>(`[${FRAME_ATTRIBUTE}]`)];
}

const EVERY_PAIR = BRANDS.flatMap((brand) => SCHEMES.map((scheme) => `${brand} ${scheme}`)).sort();

/** The fourteen frames, one per brand and scheme, each with the piece inside. */
function provesTheBrands(frames: readonly HTMLElement[], piece: string): boolean {
  const pairs = frames.map((frame) => `${frame.dataset.nphBrand} ${frame.dataset.nphColorScheme}`).sort();
  return JSON.stringify(pairs) === JSON.stringify(EVERY_PAIR) && frames.every((frame) => frame.querySelector(piece) !== null);
}

describe('brand-dependent tokens', () => {
  it('come out of the generated CSS: the primary color and the focus follow the brand', () => {
    const dependent = brandDependentTokens();
    expect(dependent).toContain('--nph-color-primary');
    expect(dependent).toContain('--nph-focus-halo');
    expect(dependent).toContain('--nph-focus-border');
  });

  it('a token equal in the seven brands stays out', () => {
    const dependent = brandDependentTokens();
    expect(dependent).not.toContain('--nph-color-foreground');
    expect(dependent).not.toContain('--nph-color-border');
  });
});

describe('a piece where the brand matters has the Brands story', () => {
  const pieces = piecesWhereTheBrandMatters();

  it('the pieces of D1 are on the list', () => {
    for (const piece of ['nph-button', 'nph-badge', 'nph-label']) expect([...pieces.keys()]).toContain(piece);
  });

  for (const [piece, tokens] of pieces) {
    it(`${piece} consumes ${tokens.join(', ')} and proves the seven brands in light and dark`, async () => {
      const own = ownFile(piece);
      const candidates = own !== undefined ? [own] : Object.keys(STORIES);
      let proved = false;
      for (const path of candidates) {
        proved ||= provesTheBrands(await brandFramesOf(path), piece);
        document.body.replaceChildren();
      }
      const where = own !== undefined ? `${piece}.stories.ts` : 'the Validation file of the piece that owns it';
      expect(proved, `${where} has no Brands story built with brandFrames with ${piece} in every frame`).toBe(true);
    });
  }
});

describe('Storybook has no brand selector', () => {
  it('neither the preview nor the frame writes data-nph-brand or declares a brand global', () => {
    expect(previewJs).not.toContain('data-nph-brand');
    expect(managerJs).not.toContain('data-nph-brand');
    expect(previewJs).not.toMatch(/nphBrand|brand\s*:/i);
  });
});
