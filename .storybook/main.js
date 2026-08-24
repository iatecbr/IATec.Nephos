/**
 * Shell inicial do Storybook do Nephos.
 *
 * Configuracao minima, deliberadamente. O framework
 * `@storybook/web-components-vite` e uma escolha PROVISORIA de bootstrap, a
 * confirmar com Elvys (P19). Nao derive dela estrutura de diretorios, formato
 * de token, teste ou publicacao.
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
