/*
 * Preview do Storybook do Nephos. Sem tema e sem decorators.
 *
 * O CSS gerado a partir do JSON (P17) e carregado aqui porque os componentes
 * consomem `--nph-*` de fora do Shadow DOM: sem ele, `var(--nph-icon-size-sm)`
 * resolveria vazio e nenhuma caixa teria tamanho. O arquivo e GERADO — nunca
 * edite `src/tokens/generated/tokens.css` a mao.
 *
 * O global `locale` da o idioma dos textos explicativos. Ele NAO e API de
 * componente: nenhum `nph-*` conhece idioma, e o conteudo acessivel do
 * consumidor — `label`, por exemplo — continua chegando ja localizado pela
 * aplicacao. Ver `docs/i18n.md`.
 */
import '../src/tokens/generated/tokens.css';
import { CHAVE, IDIOMAS, IDIOMA_PADRAO } from './i18n/index.js';

/** @type {import('@storybook/web-components').Preview} */
const preview = {
  parameters: {},

  initialGlobals: {
    [CHAVE]: IDIOMA_PADRAO,
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
  },
};

export default preview;
