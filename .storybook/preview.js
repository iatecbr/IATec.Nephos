/*
 * Preview do Storybook do Nephos: a pagina que mostra cada story.
 *
 * O CSS gerado a partir do JSON (P17) e carregado aqui porque os componentes
 * consomem `--nph-*` de fora do Shadow DOM: sem ele, `var(--nph-icon-size-sm)`
 * resolveria vazio e nenhuma caixa teria tamanho. O arquivo e GERADO — nunca
 * edite `src/tokens/generated/tokens.css` a mao.
 *
 * As fontes do Nephos — Noto Sans e IBM Plex Mono — vem do `@fontsource`, sem
 * chamada externa. Os pesos sao os dos papeis de texto: 400, 500 (`text/label-*`)
 * e 600. Os tokens so declaram a familia; sem este carregamento, a
 * pagina cairia na fonte padrao do navegador.
 *
 * O global `colorScheme` (light | dark) e o modo de cor. Um modo por vez: o
 * decorator aplica `data-nph-color-scheme` na raiz da pagina, e o `manager.js`
 * troca a moldura junto. Um quadro que fixa o proprio esquema, como no
 * `nph-label`, continua vencendo para as variaveis dos blocos de esquema.
 *
 * O global `locale` da o idioma dos textos explicativos. Ele NAO e API de
 * componente: nenhum `nph-*` conhece idioma, e o conteudo acessivel do
 * consumidor — `label`, por exemplo — continua chegando ja localizado pela
 * aplicacao. Ver `docs/i18n.md`.
 */
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '../src/tokens/generated/tokens.css';
import { CHAVE, IDIOMAS, IDIOMA_PADRAO } from './i18n/index.js';

/** O mesmo nome do global em `manager.js`. */
const COLOR_SCHEME = 'colorScheme';

/** Fonte, fundo e cor da pagina, sempre por token. Injetado uma vez. */
const PAGE_STYLE = `
  body {
    font-family: var(--nph-core-font-sans);
    background: var(--nph-color-background);
    color: var(--nph-color-foreground);
  }
  code, kbd, pre {
    font-family: var(--nph-text-code-font-family);
  }
`;

function ensureStyle() {
  if (document.getElementById('nph-estilo-da-pagina')) return;
  const style = document.createElement('style');
  style.id = 'nph-estilo-da-pagina';
  style.textContent = PAGE_STYLE;
  document.head.appendChild(style);
}

/** @type {import('@storybook/web-components').Decorator} */
const colorSchemeDecorator = (story, context) => {
  ensureStyle();
  const colorScheme = context.globals?.[COLOR_SCHEME] === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-nph-color-scheme', colorScheme);
  return story();
};

/** @type {import('@storybook/web-components').Preview} */
const preview = {
  parameters: {},

  decorators: [colorSchemeDecorator],

  initialGlobals: {
    [CHAVE]: IDIOMA_PADRAO,
    [COLOR_SCHEME]: 'light',
  },

  globalTypes: {
    [CHAVE]: {
      description: 'Idioma dos textos explicativos',
      toolbar: {
        title: 'Idioma',
        icon: 'globe',
        items: IDIOMAS,
        dynamicTitle: true,
      },
    },
    /* Sem `toolbar`: quem mostra o seletor e a ferramenta do `manager.js`. */
    [COLOR_SCHEME]: {
      description: 'Modo de cor da moldura e da pagina',
    },
  },
};

export default preview;
