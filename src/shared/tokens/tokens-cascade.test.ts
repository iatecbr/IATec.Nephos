/**
 * Proof of the token cascade in a subtree (P67), in a real browser:
 * only where cascade and inheritance exist can you see the value a `var()`
 * resolves to.
 *
 * Consumption contract (decision by Indiane on 05-10-2026): in a part of the
 * screen with another brand, `data-nph-brand` and `data-nph-color-scheme` go
 * on the SAME element. In that subtree, every brand and semantic token must
 * resolve the same as it would with the same two attributes on the root.
 */
import { afterEach, describe, expect, it } from 'vitest';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';

/** The brands and the schemes come from the selectors of the generated CSS itself. */
const BRANDS = [...new Set([...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? ''))];
const SCHEMES = [...new Set([...tokensCss.matchAll(/\[data-nph-color-scheme="([\w-]+)"\]/g)].map((m) => m[1] ?? ''))];
/** The default brand is the one that also comes out in `:root`. */
const DEFAULT_BRAND = /:root,\s*\[data-nph-brand="([\w-]+)"\]/.exec(tokensCss)?.[1] ?? '';
/** `--nph-theme-brand-halo` of the default brand: the wrong value the subtree used to inherit. */
const DEFAULT_BRAND_HALO = '#d8e6fd';

/** Every declared name, except the primitives: the brand ones and the semantic ones. */
const NAMES = [...new Set([...tokensCss.matchAll(/(--nph-[\w-]+)\s*:/g)].map((m) => m[1] ?? ''))].filter(
  (name) => name !== '' && !name.startsWith('--nph-core-'),
);

const root = document.documentElement;

afterEach(() => {
  document.body.replaceChildren();
  root.removeAttribute('style');
  root.removeAttribute('data-nph-brand');
  root.removeAttribute('data-nph-color-scheme');
});

function read(element: Element, names: string[]): Record<string, string> {
  const style = getComputedStyle(element);
  return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
}

/** Values on an attribute-less child of a root that carries the attributes. */
function atRoot(attributes: Record<string, string>): Record<string, string> {
  for (const [key, value] of Object.entries(attributes)) root.setAttribute(key, value);
  const child = document.createElement('div');
  document.body.append(child);
  const values = read(child, NAMES);
  child.remove();
  for (const key of Object.keys(attributes)) root.removeAttribute(key);
  return values;
}

/** Values on an element that carries the attributes, under the attribute-less root. */
function inSubtree(attributes: Record<string, string>): { element: HTMLElement; values: Record<string, string> } {
  const element = document.createElement('div');
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  document.body.append(element);
  return { element, values: read(element, NAMES) };
}

function differences(expected: Record<string, string>, actual: Record<string, string>): string[] {
  return NAMES.filter((name) => expected[name] !== actual[name]).map(
    (name) => `${name}: root ${expected[name]} | subtree ${actual[name]}`,
  );
}

describe('scheme subtree', () => {
  it('data-nph-color-scheme="dark" on a subtree resolves the same as dark on the root', () => {
    const expected = atRoot({ 'data-nph-color-scheme': 'dark' });
    const { values } = inSubtree({ 'data-nph-color-scheme': 'dark' });
    expect(differences(expected, values)).toEqual([]);
  });
});

describe('brand subtree with the scheme on the same element', () => {
  for (const brand of BRANDS) {
    for (const scheme of SCHEMES) {
      it(`${brand} + ${scheme} resolves the same as the root`, () => {
        const attributes = { 'data-nph-brand': brand, 'data-nph-color-scheme': scheme };
        const expected = atRoot(attributes);
        const { values } = inSubtree(attributes);
        expect(differences(expected, values)).toEqual([]);
      });
    }
  }

  it('the CSS declares the seven brands and the two schemes', () => {
    expect(BRANDS).toHaveLength(7);
    expect(SCHEMES).toEqual(['light', 'dark']);
    expect(BRANDS).toContain(DEFAULT_BRAND);
  });

  it('focus/halo of another brand no longer comes out as the default brand halo', () => {
    for (const brand of BRANDS.filter((b) => b !== DEFAULT_BRAND)) {
      const { element } = inSubtree({ 'data-nph-brand': brand, 'data-nph-color-scheme': 'light' });
      const style = getComputedStyle(element);
      const halo = style.getPropertyValue('--nph-focus-halo').trim();
      expect(halo, brand).not.toBe(DEFAULT_BRAND_HALO);
      expect(halo, brand).toBe(style.getPropertyValue('--nph-theme-brand-halo').trim());
      element.remove();
    }
  });
});

describe('consumer customization (P02)', () => {
  it('an independent invariant customized on the root reaches the scheme subtree', () => {
    root.style.setProperty('--nph-radius-control', '0px');
    const { values } = inSubtree({ 'data-nph-color-scheme': 'dark' });
    expect(values['--nph-radius-control']).toBe('0px');
  });
});
