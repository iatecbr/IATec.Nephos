/**
 * Initial Storybook shell for Nephos.
 *
 * Minimal configuration, deliberately. The `@storybook/web-components-vite`
 * framework is kept by decision P19, recorded in `docs/decisoes-tecnicas.md`.
 *
 * The first glob is the root pages, `Start here` and `Foundations`. The
 * second serves P03: story next to the component, in
 * `src/components/<name>/`, in TypeScript. The divergence recorded in P03 ends
 * with `nph-icon`.
 *
 * The frame carries only what serves the reading: the update notice and the
 * Storybook onboarding checklist are off. The checklist, besides taking room
 * from the page, invites publishing the Storybook, and P19 keeps it private.
 *
 * `lit/directive-helpers.js`, which the Storybook renderer imports, goes into
 * the pre-bundle with `lit`. Outside it, Vite served a second copy of
 * `lit-html` in development, and every story warned "Multiple versions of Lit
 * loaded", hiding the pieces' own development errors. The static build already
 * had a single copy.
 *
 * The static build is a private CI artifact (P19), not a page a product loads.
 * Its preview bundle carries every story and the icon set and is past 1.7 MB,
 * so the 500 kB chunk warning only adds noise: the limit is 4 MB. Rolldown's
 * plugin timing warning is off too: it reports the speed of the CI agent, not
 * a defect.
 *
 * @type {import('@storybook/web-components-vite').StorybookConfig}
 */
const config = {
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      include: [...(viteConfig.optimizeDeps?.include ?? []), 'lit/directive-helpers.js'],
    },
    build: {
      ...viteConfig.build,
      chunkSizeWarningLimit: 4096,
      rolldownOptions: {
        ...viteConfig.build?.rolldownOptions,
        checks: { ...viteConfig.build?.rolldownOptions?.checks, pluginTimings: false },
      },
    },
  }),
  stories: ['../stories/**/*.stories.js', '../src/components/**/*.stories.ts'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  core: {
    disableWhatsNewNotifications: true,
  },
  features: {
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
};

export default config;
