/*
 * Manager do Storybook do Nephos.
 *
 * A barra lateral acompanha o idioma escolhido, mas os IDs de story NAO mudam:
 * o `title` de cada CSF continua em portugues, entao links salvos e permalinks
 * seguem valendo. So o RÓTULO exibido e traduzido, por `renderLabel`.
 *
 * `nph-icon` nao tem traducao no dicionario de propósito — e nome tecnico, e
 * `rotuloDaBarra` devolve `undefined`, o que faz o Storybook usar o nome
 * original.
 */
import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

import { CHAVE, IDIOMA_PADRAO, rotuloDaBarra } from './i18n/index.js';

addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'Nephos',
    brandUrl: './',
    brandTarget: '_self',
  },
  sidebar: {
    showRoots: true,
    renderLabel: (item, api) => {
      const idioma = api?.getGlobals?.()?.[CHAVE] ?? IDIOMA_PADRAO;
      return rotuloDaBarra(item.id, idioma) ?? item.name;
    },
  },
});
