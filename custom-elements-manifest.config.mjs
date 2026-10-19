/**
 * Custom Elements Manifest of `@iatec/nephos` (P74): `dist/custom-elements.json`.
 *
 * The analyzer reads the component sources, with its Lit plugin, and describes
 * each element: tag, properties, attributes, events, CSS parts and custom
 * properties. Editors and documentation tools read the file through the
 * `customElements` field of `package.json`.
 *
 * Stories, tests and demos are not part of the package, so they are not read.
 */

/**
 * Every component registers itself with `customElements.define(TAG, Class)`,
 * where `TAG` is a constant. The analyzer does not resolve the constant and
 * writes the word `TAG` as the tag name. By P03 the tag is the name of the
 * folder and of the file, `src/components/<tag>/<tag>.ts`, so the plugin
 * restores it from the module path.
 */
function tagNameFromModulePath() {
  return {
    name: 'nephos-tag-name-from-module-path',
    packageLinkPhase({ customElementsManifest }) {
      for (const module of customElementsManifest.modules ?? []) {
        const tagName = module.path.split('/').pop()?.replace(/\.ts$/, '') ?? '';
        if (!/^nph-[a-z]+$/.test(tagName)) continue;
        for (const declaration of module.declarations ?? []) {
          if (declaration.customElement === true && declaration.tagName === 'TAG') {
            declaration.tagName = tagName;
          }
        }
        for (const entry of module.exports ?? []) {
          if (entry.kind === 'custom-element-definition' && entry.name === 'TAG') {
            entry.name = tagName;
          }
        }
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
  plugins: [tagNameFromModulePath()],
};
