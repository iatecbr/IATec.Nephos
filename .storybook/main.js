/**
 * Shell inicial do Storybook do Nephos.
 *
 * Configuracao minima, deliberadamente. O framework
 * `@storybook/web-components-vite` esta mantido por decisao do P19, registrada
 * em `docs/decisoes-tecnicas.md`.
 *
 * O glob abaixo ainda aponta apenas para `stories/`, na raiz. O P03 define que
 * story e teste ficam junto do componente, em `src/components/<nome>/`: quando
 * o primeiro componente existir, este glob precisa passar a inclui-lo. O padrao
 * tambem pede `.ts`, o que exigira TypeScript no projeto. Nada disso foi
 * alterado ainda, porque nao ha componente.
 *
 * @type {import('@storybook/web-components-vite').StorybookConfig}
 */
const config = {
  stories: ['../stories/**/*.stories.js'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
