/**
 * Custom Elements Manifest of `@iatec/nephos` (P75): `dist/custom-elements.json`.
 *
 * The analyzer reads the component sources, with its Lit plugin, and describes
 * each element: tag, properties, attributes, events, CSS parts and custom
 * properties. Editors and documentation tools read the file through the
 * `customElements` field of `package.json`.
 *
 * Stories, tests and demos are not part of the package, so they are not read.
 */

/**
 * The analyzer describes the sources (`src/components/<tag>/<tag>.ts`), which
 * the package does not ship. This plugin rewrites the manifest to describe what
 * is published, with paths relative to the package root, as the Custom
 * Elements Manifest specification asks:
 *
 * - `modules[].path` and every `module` reference become
 *   `dist/<tag>/<tag>.js`, the file the `exports` map points to;
 * - a module that is not a public entry point, such as `nph-icon.icons.ts`,
 *   is bundled into a hashed chunk under `dist/shared/` and has no stable
 *   path, so it is left out of the manifest, with the exports that point to it;
 * - every component registers itself with `customElements.define(TAG, Class)`,
 *   where `TAG` is a constant that the analyzer does not resolve: it writes the
 *   word `TAG` as the tag name. By P03 the tag is the name of the folder and of
 *   the file, so the plugin restores it from the module path.
 *
 * `npm run test:package` checks that every path left in the manifest is a file
 * of the package.
 */
function publishedManifest() {
  const entryOf = (path) => {
    const tag = path.split('/').pop()?.replace(/\.ts$/, '') ?? '';
    return /^nph-[a-z]+(?:-[a-z]+)*$/.test(tag) && path === `src/components/${tag}/${tag}.ts` ? tag : null;
  };

  function rewrite(node, published, dropped) {
    if (Array.isArray(node)) {
      return node
        .filter((item) => !(typeof item?.declaration?.module === 'string' && dropped.has(item.declaration.module)))
        .map((item) => rewrite(item, published, dropped));
    }
    if (node === null || typeof node !== 'object') return node;
    for (const [key, value] of Object.entries(node)) {
      if (key === 'module' && typeof value === 'string' && published.has(value)) {
        node[key] = published.get(value);
      } else {
        node[key] = rewrite(value, published, dropped);
      }
    }
    return node;
  }

  return {
    name: 'nephos-published-manifest',
    packageLinkPhase({ customElementsManifest }) {
      const published = new Map();
      const dropped = new Set();
      for (const module of customElementsManifest.modules ?? []) {
        const tag = entryOf(module.path);
        if (tag === null) dropped.add(module.path);
        else published.set(module.path, `dist/${tag}/${tag}.js`);
      }

      customElementsManifest.modules = customElementsManifest.modules.filter((module) => !dropped.has(module.path));
      rewrite(customElementsManifest.modules, published, dropped);

      for (const module of customElementsManifest.modules) {
        const tag = entryOf(module.path);
        for (const declaration of module.declarations ?? []) {
          if (declaration.customElement === true && declaration.tagName === 'TAG') declaration.tagName = tag;
        }
        for (const entry of module.exports ?? []) {
          if (entry.kind === 'custom-element-definition' && entry.name === 'TAG') entry.name = tag;
        }
        module.path = `dist/${tag}/${tag}.js`;
      }
    },
  };
}

export default {
  globs: ['src/components/**/*.ts'],
  exclude: [
    'src/components/**/*.test.ts',
    'src/components/**/*.stories.ts',
    'src/components/**/*.demo.ts',
  ],
  outdir: 'dist',
  litelement: true,
  plugins: [publishedManifest()],
};
