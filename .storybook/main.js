/**
 * Shell inicial do Storybook do Nephos.
 *
 * Configuracao minima, deliberadamente. O framework
 * `@storybook/web-components-vite` esta mantido por decisao do P19, registrada
 * em `docs/decisoes-tecnicas.md`.
 *
 * O primeiro glob e a pagina "Em construcao", que continua na raiz. O segundo
 * atende ao P03: story junto do componente, em `src/components/<nome>/`, em
 * TypeScript. A divergencia registrada no P03 se encerra com o `nph-icon`.
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
