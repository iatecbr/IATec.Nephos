/**
 * Initial Storybook shell for Nephos.
 *
 * Minimal configuration, deliberately. The `@storybook/web-components-vite`
 * framework is kept by decision P19, recorded in `docs/decisoes-tecnicas.md`.
 *
 * The first glob is the `Em construção` page, which stays at the root. The
 * second serves P03: story next to the component, in
 * `src/components/<nome>/`, in TypeScript. The divergence recorded in P03 ends
 * with `nph-icon`.
 *
 * @type {import('@storybook/web-components-vite').StorybookConfig}
 */
const config = {
  stories: ['../stories/**/*.stories.js', '../src/components/**/*.stories.ts'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
