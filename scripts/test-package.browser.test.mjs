/**
 * Importing a component through the package registers it with its CSS (P70, amended by P75;
 * DSA-35). It runs in Chromium through `vitest.package.config.ts`, called by
 * `npm run test:package` once the static checks of `scripts/test-package.mjs` pass.
 *
 * For each component folder, `import '@iatec/nephos/nph-<name>'`, resolved by the `exports`
 * field into `dist/`:
 *   - defines the tag, with the class that the entry exports;
 *   - gives the element its stylesheet: in the shadow root for a component with Shadow DOM,
 *     and, for `nph-label`, which has none (P62.1), on the document, with no second import line.
 *
 * `nph-label` goes first: `nph-field` and `nph-slider` import it, so only before them can the
 * test see that the document had no `nph-label` rule until its own import line ran.
 */
import { afterEach, describe, expect, it } from 'vitest';

import entries, { packageName } from 'virtual:nephos-entries';

afterEach(() => {
  document.body.replaceChildren();
});

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

      if (name === 'nph-label') {
        expect(element.shadowRoot).toBeNull();
        expect(rulesFor(document.adoptedStyleSheets, name).length, 'nph-label rules on the document').toBeGreaterThan(0);
      } else {
        const sheets = element.shadowRoot?.adoptedStyleSheets ?? [];
        expect(sheets.length, `${name} has no stylesheet in its shadow root`).toBeGreaterThan(0);
        expect(sheets.some((sheet) => sheet.cssRules.length > 0), `${name}: its stylesheet is empty`).toBe(true);
      }
    });
  }
});
