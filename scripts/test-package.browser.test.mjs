/**
 * Importing a component through the package registers it with its CSS (P70, amended by P75;
 * DSA-35). It runs in Chromium through `vitest.package.config.ts`, called by
 * `npm run test:package` once the static checks of `scripts/test-package.mjs` pass.
 *
 * For each component folder, `import '@iatec/nephos/nph-<name>'`, resolved by the `exports`
 * field into `dist/`:
 *   - defines the tag, with the class that the entry exports;
 *   - gives the element its own stylesheet, `src/components/<name>/<name>.css` rule by rule: in
 *     the shadow root for a component with Shadow DOM, and, for `nph-label`, which has none
 *     (P62.1), on the document, with no second import line. Any sheet would not do: `nph-field`
 *     also adopts the CSS of `nph-label`, so losing its own would go unnoticed.
 *
 * `nph-label` goes first: `nph-field` and `nph-slider` import it, so only before them can the
 * test see that the document had no `nph-label` rule until its own import line ran.
 */
import { afterEach, describe, expect, it } from 'vitest';

import entries, { packageName } from 'virtual:nephos-entries';

/** The source CSS of each component, read as text: the reference the build must carry. */
const sources = import.meta.glob('../src/components/*/*.css', { query: '?raw', import: 'default', eager: true });

afterEach(() => {
  document.body.replaceChildren();
});

/** The rules of a CSS text, as this browser writes them back. */
function rulesOf(text) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(text);
  return [...sheet.cssRules].map((rule) => rule.cssText);
}

/** Whether one of the sheets holds every rule of the source CSS, in its order. */
function carries(sheets, expected) {
  return sheets.some((sheet) => {
    const rules = [...sheet.cssRules].map((rule) => rule.cssText);
    let from = 0;
    return expected.every((rule) => {
      const at = rules.indexOf(rule, from);
      from = at + 1;
      return at !== -1;
    });
  });
}

/** The rules of a set of stylesheets that name the tag in their selector. */
function rulesFor(sheets, tag) {
  return sheets.flatMap((sheet) => [...sheet.cssRules]).filter((rule) => rule.cssText.includes(tag));
}

const names = Object.keys(entries).sort((a, b) => Number(b === 'nph-label') - Number(a === 'nph-label'));

describe(`import '${packageName}/nph-<name>'`, () => {
  it('finds one entry per component folder, nph-label first', () => {
    expect(names.length).toBeGreaterThan(0);
    expect(names[0]).toBe('nph-label');
  });

  for (const name of names) {
    it(`${name}: registers the component with its CSS`, async () => {
      if (name === 'nph-label') {
        expect(rulesFor(document.adoptedStyleSheets, name), 'before the import').toHaveLength(0);
      }

      const module = await entries[name]();
      const constructor = customElements.get(name);
      expect(constructor, `${name} is not defined`).toBeDefined();
      expect(Object.values(module), `the entry of ${name} does not export the class it registers`).toContain(constructor);

      const element = document.createElement(name);
      document.body.append(element);
      await element.updateComplete;

      const source = sources[`../src/components/${name}/${name}.css`];
      expect(source, `src/components/${name}/${name}.css`).toBeDefined();
      const expected = rulesOf(source);
      expect(expected.length, `${name}: its source CSS has no rule`).toBeGreaterThan(0);
      if (name === 'nph-label') {
        expect(element.shadowRoot).toBeNull();
        expect(carries(document.adoptedStyleSheets, expected), 'the CSS of nph-label on the document').toBe(true);
      } else {
        const sheets = element.shadowRoot?.adoptedStyleSheets ?? [];
        expect(carries(sheets, expected), `${name}: its shadow root does not carry its own CSS`).toBe(true);
      }
    });
  }
});
