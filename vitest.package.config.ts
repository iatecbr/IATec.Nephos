/**
 * Browser proof of the `@iatec/nephos` entry points (P70, amended by P75; DSA-35).
 *
 * It runs from `npm run test:package`, after `npm run build:lib`, and never from `npm test`:
 * the files it imports live in `dist/`, which is not versioned. A real Chromium imports each
 * component as a consumer does, `import '@iatec/nephos/nph-<name>'`, so the specifier is
 * resolved by the `exports` field of `package.json` (a package can import itself by its own
 * name) and reaches the build, not `src/`.
 *
 * The virtual module `virtual:nephos-entries` lists one loader per component folder, written
 * as a static `import()` so that Vite resolves each specifier: a new component is covered by
 * adding its folder, as the build and the `exports` pattern take it.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';

import pkg from './package.json' with { type: 'json' };

const root = fileURLToPath(new URL('.', import.meta.url));

const ENTRIES_ID = 'virtual:nephos-entries';
const RESOLVED_ENTRIES_ID = `\0${ENTRIES_ID}`;

function entries(): Plugin {
  return {
    name: 'nephos-package-entries',
    resolveId(id) {
      return id === ENTRIES_ID ? RESOLVED_ENTRIES_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ENTRIES_ID) return null;
      const names = readdirSync(`${root}src/components`, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name.startsWith('nph-'))
        .map((entry) => entry.name)
        .sort();
      const loaders = names.map(
        (name) => `  ${JSON.stringify(name)}: () => import(${JSON.stringify(`${pkg.name}/${name}`)}),`,
      );
      return `export const packageName = ${JSON.stringify(pkg.name)};\nexport default {\n${loaders.join('\n')}\n};\n`;
    },
  };
}

/** Every `lit` and `@fortawesome/*` specifier that a JavaScript file of `dist/` imports. */
function bareImportsOf(folder: string): string[] {
  if (!existsSync(folder)) return [];
  const specifiers = new Set<string>();
  for (const file of readdirSync(folder, { recursive: true, encoding: 'utf8' })) {
    if (!file.endsWith('.js')) continue;
    const text = readFileSync(`${folder}/${file}`, 'utf8');
    for (const [, specifier] of text.matchAll(/(?:from|import)\s*["']([^"'.][^"']*)["']/g)) {
      if (specifier !== undefined) specifiers.add(specifier);
    }
  }
  return [...specifiers].sort();
}

export default defineConfig({
  plugins: [entries()],
  /*
   * The entries are imported lazily, so Vite would find `lit` and Font Awesome only while the
   * test runs, optimize them and reload the page in the middle of it. The bare specifiers that
   * `dist/` imports are given up front, so they are optimized before the browser opens.
   */
  optimizeDeps: {
    include: bareImportsOf(`${root}dist`),
  },
  test: {
    name: 'package',
    include: ['scripts/test-package.browser.test.mjs'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      screenshotFailures: false,
      instances: [{ browser: 'chromium' as const }],
    },
  },
});
