/**
 * Library build of the `@iatec/nephos` package (P70, amended by P75).
 *
 * One entry per component, ESM only, written to `dist/<name>/<name>.js`, the
 * same layout `tsc` gives the declarations (`tsconfig.build.json`). A component
 * that another one imports (`nph-icon`) stays its own entry file and the
 * others import it, so no component is defined twice; code that several
 * entries share and that is not a component goes to `dist/shared/`.
 *
 * `lit` and `@fortawesome/*` are peer dependencies and never enter the build.
 * The CSS imported with `?inline` is inlined as a string by Vite itself. The
 * only CSS that is not `?inline`, the global style of `nph-label` (P62.1), is
 * turned into a JavaScript side effect by `injectGlobalCss`, below.
 */
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));
const componentsDir = `${root}src/components`;

/** `src/components/<name>/<name>.ts` is the entry of the component `<name>`. */
const entries = Object.fromEntries(
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('nph-'))
    .map((entry) => [`${entry.name}/${entry.name}`, `${componentsDir}/${entry.name}/${entry.name}.ts`]),
);

const GLOBAL_CSS_MARKER = '\0nephos-global-css:';
/** The id must not end in `.css`, or Vite would treat the module as a stylesheet. */
const GLOBAL_CSS_SUFFIX = '.js';

/**
 * A component without Shadow DOM, `nph-label`, imports its CSS as a plain
 * side-effect (`import './nph-label.css'`). A library build would emit that
 * CSS as a separate file that no import line brings in. This plugin replaces
 * such an import with a module that adopts the stylesheet once on the
 * document, so `import '@iatec/nephos/nph-label'` alone is enough in any
 * bundler, or with no bundler at all.
 *
 * `adoptedStyleSheets` is used, and not a `<style>` element, because it is not
 * blocked by a `style-src` Content Security Policy without `unsafe-inline`.
 * A `<style>` element is the fallback for a browser without constructable
 * stylesheets.
 */
function injectGlobalCss(): Plugin {
  /* The virtual id carries the file name only, so no local path reaches `dist/`. */
  const files = new Map<string, string>();
  return {
    name: 'nephos-inject-global-css',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!source.endsWith('.css') || source.includes('?') || importer === undefined) return null;
      const resolved = await this.resolve(source, importer, { skipSelf: true });
      if (resolved === null) return null;
      const name = resolved.id.split('/').pop() ?? resolved.id;
      files.set(name, resolved.id);
      return `${GLOBAL_CSS_MARKER}${name}${GLOBAL_CSS_SUFFIX}`;
    },
    load(id) {
      if (!id.startsWith(GLOBAL_CSS_MARKER)) return null;
      const name = id.slice(GLOBAL_CSS_MARKER.length, -GLOBAL_CSS_SUFFIX.length);
      const file = files.get(name);
      if (file === undefined) return null;
      return `
import css from ${JSON.stringify(`${file}?inline`)};

const key = Symbol.for(${JSON.stringify(`nephos:global-css:${name}`)});

if (typeof document !== 'undefined' && !globalThis[key]) {
  globalThis[key] = true;
  if (typeof CSSStyleSheet !== 'undefined' && 'adoptedStyleSheets' in document) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } else {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
  }
}
`;
    },
  };
}

export default defineConfig({
  plugins: [injectGlobalCss()],
  // The output is a library, never a page: nothing to copy from `public/`.
  publicDir: false,
  /*
   * A file a component imports with `?no-inline` (the illustrations of `nph-empty`, P84) is
   * referenced relative to the module, `new URL('../assets/<file>', import.meta.url)`, so it
   * resolves wherever the package is installed. With the default base it would be the
   * absolute `/<file>`, a path of the consumer's site.
   */
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'es2022',
    minify: false,
    sourcemap: false,
    lib: {
      entry: entries,
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^lit(\/.*)?$/, /^@fortawesome\//],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name]-[hash].js',
        // Files that are not code, such as an illustration, go to `dist/assets/` under their own name.
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
