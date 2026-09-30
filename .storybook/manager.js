/*
 * Manager do Storybook do Nephos: a moldura (barra lateral e barra de
 * ferramentas).
 *
 * A moldura segue a identidade Solutions, com o destaque azul #1FBFFF e a tinta
 * #031A24 por cima. Os hex vivem SO aqui e no `manager-head.html`: sao da
 * identidade da moldura, nao do Nephos. As paginas usam apenas `--nph-*`.
 *
 * Um modo por vez. O global `colorScheme` (light | dark) troca a moldura, por
 * `api.setOptions`, e a pagina, pelo decorator do `preview.js`. No claro o azul
 * aparece so como fundo; texto e icone ficam em neutro, porque #1FBFFF sobre
 * branco nao passa no contraste.
 *
 * A barra lateral acompanha o idioma escolhido, mas os IDs de story NAO mudam:
 * o `title` de cada CSF continua em portugues, entao links salvos e permalinks
 * seguem valendo. So o ROTULO exibido e traduzido, por `renderLabel`.
 *
 * `nph-icon` nao tem traducao no dicionario de propósito — e nome tecnico, e
 * `rotuloDaBarra` devolve `undefined`, o que faz o Storybook usar o nome
 * original.
 */
import React from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { GLOBALS_UPDATED, SET_CONFIG } from 'storybook/internal/core-events';
import { IconButton } from 'storybook/internal/components';
import { MoonIcon, SunIcon } from '@storybook/icons';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-400.css';

import { CHAVE, IDIOMA_PADRAO, rotuloDaBarra, textos } from './i18n/index.js';

/** O mesmo nome do global em `preview.js`. */
const MODO = 'colorScheme';

/*
 * Logotipo Nephos, copiado de `ID. VISUAL APRESENTAÇÕES/Marcas Solutions/SVG/
 * Nephos/` no vault da equipe: `nephos-dark.svg` (letras pretas) no claro e
 * `nephos-light.svg` (letras brancas) no escuro.
 */
const LOGO_LETRAS_BRANCAS = `<svg width="1519" height="263" viewBox="0 0 1519 263" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_1303_3890)"> <path d="M546.4 41.3H518.47C482.36 41.3 459.93 62.8801 459.93 97.6101V243.29H483.18V96.77C483.18 75.63 496.01 63.9901 519.31 63.9901H545.56C568.86 63.9901 581.69 75.63 581.69 96.77V243.29H604.94V97.6101C604.94 62.8801 582.51 41.3 546.4 41.3Z" fill="white"/> <path d="M647.05 98.7299V186.98C647.05 221.71 669.37 243.29 705.31 243.29H780.89V220.6H706.43C682.79 220.6 670.3 209.26 670.3 187.82V154.2H764.14V131.51H670.3V97.8899C670.3 76.7499 683.13 65.1099 706.43 65.1099H780.89V42.4199H705.31C669.37 42.4199 647.05 63.9999 647.05 98.7299Z" fill="white"/> <path d="M901.1 42.4199H814.63V243.29H837.88V65.1099H901.1C923.86 65.1099 936.39 77.0499 936.39 98.7299V132.52C936.39 154.2 923.86 166.14 901.1 166.14H837.88V188.83H901.1C937.21 188.83 959.64 167.25 959.64 132.52V98.7299C959.64 64.5299 936.66 42.4199 901.1 42.4199Z" fill="white"/> <path d="M1120.72 131.51H1022.21V42.4199H998.96V243.29H1022.21V154.2H1120.72V243.29H1143.97V42.4199H1120.72V131.51Z" fill="white"/> <path d="M1275.35 41.3H1247.42C1211.86 41.3 1188.88 63.4001 1188.88 97.6101V188.1C1188.88 222.83 1211.31 244.41 1247.42 244.41H1275.35C1311.46 244.41 1333.89 222.83 1333.89 188.1V97.6101C1333.89 63.41 1310.91 41.3 1275.35 41.3ZM1310.65 96.77V188.93C1310.65 210.07 1297.82 221.71 1274.52 221.71H1248.27C1224.97 221.71 1212.14 210.07 1212.14 188.93V96.77C1212.14 75.63 1224.97 63.9901 1248.27 63.9901H1274.52C1297.82 63.9901 1310.65 75.63 1310.65 96.77Z" fill="white"/> <path d="M1459.69 131.51H1422.83C1400.07 131.51 1387.53 119.67 1387.53 98.1699C1387.53 76.6699 1400.06 65.1099 1422.83 65.1099H1504.55V42.4199H1423.39C1387.28 42.4199 1364.85 63.7799 1364.85 98.1699C1364.85 132.56 1387.28 154.2 1423.39 154.2H1460.26C1483.02 154.2 1495.56 166.04 1495.56 187.54C1495.56 209.04 1483.03 220.6 1460.26 220.6H1369.88V243.29H1459.7C1495.81 243.29 1518.24 221.93 1518.24 187.54C1518.24 153.15 1495.81 131.51 1459.7 131.51H1459.69Z" fill="white"/> <path d="M304.45 90.55C301.43 98.59 297.57 106.21 292.97 113.32C298.17 114.19 303.63 116.11 310.64 120.62C353.87 148.48 346.84 215.28 298.48 232.36C296.04 233.22 285.14 236.57 283.74 236.57H222.16C225.35 229.04 234.52 217.42 241.03 212.8C249.13 207.06 262.55 207.61 265.34 195.43C271.53 168.4 236.39 158.36 227.38 180.2C225.11 185.69 227.26 191.04 224.17 195.94L181.26 244.08C178.57 256.68 187.59 260.27 198.41 261.27C227.27 263.95 291.66 263.58 316.98 250.85C388.11 215.08 372.36 113.47 304.45 90.55Z" fill="#40D49B"/> <path d="M31.79 109.67C-14.45 146.85 -9.58999 219.54 42.14 248.92C115.65 290.67 161.12 217.56 204.43 167.28C209.68 161.18 214.91 155.42 220.15 150.23C226.25 145.73 235.65 146.81 241.16 140.39C257.66 121.18 232.62 94.7599 212.61 110.47C203.23 117.83 207.56 125.89 203.32 133.39C200.07 139.15 188.91 152.39 176.2 166.67C159.38 185.57 139.82 206.27 132.2 213.84C62.97 282.55 -16.6 179.11 46.96 128.6C61 117.44 78.16 113.37 94.56 116.13C88.91 107.92 84.25 98.9599 80.78 89.4399C62.23 94.5199 47.57 96.9699 31.8 109.65L31.79 109.67Z" fill="#1FBFFF"/> <path d="M280.78 86.06C261.08 -29.75 97.89 -28.54 82.97 88.84C82.23 89.05 81.5 89.25 80.77 89.45C84.24 98.97 88.9 107.93 94.55 116.14C104.48 117.81 114.13 121.98 122.65 128.61C129.86 134.22 137.98 148.89 149.39 140.11C168.26 125.59 119.84 95.15 106.74 94.29C113.14 6.33997 238.6 -1.63004 256.12 86.09C258.05 95.76 253.04 109 268.7 111.41C278.69 112.94 285.56 112.07 292.97 113.32C297.57 106.22 301.43 98.59 304.45 90.55C297.15 88.09 289.25 86.53 280.78 86.06Z" fill="#E543A1"/> </g> <defs> <clipPath id="clip0_1303_3890"> <rect width="1518.23" height="262.61" fill="white"/> </clipPath> </defs> </svg>`;
const LOGO_LETRAS_PRETAS = `<svg width="1519" height="263" viewBox="0 0 1519 263" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_1303_3879)"> <path d="M546.4 41.3H518.47C482.36 41.3 459.93 62.8801 459.93 97.6101V243.29H483.18V96.77C483.18 75.63 496.01 63.9901 519.31 63.9901H545.56C568.86 63.9901 581.69 75.63 581.69 96.77V243.29H604.94V97.6101C604.94 62.8801 582.51 41.3 546.4 41.3Z" fill="black"/> <path d="M647.05 98.7299V186.98C647.05 221.71 669.37 243.29 705.31 243.29H780.89V220.6H706.43C682.79 220.6 670.3 209.26 670.3 187.82V154.2H764.14V131.51H670.3V97.8899C670.3 76.7499 683.13 65.1099 706.43 65.1099H780.89V42.4199H705.31C669.37 42.4199 647.05 63.9999 647.05 98.7299Z" fill="black"/> <path d="M901.1 42.4199H814.63V243.29H837.88V65.1099H901.1C923.86 65.1099 936.39 77.0499 936.39 98.7299V132.52C936.39 154.2 923.86 166.14 901.1 166.14H837.88V188.83H901.1C937.21 188.83 959.64 167.25 959.64 132.52V98.7299C959.64 64.5299 936.66 42.4199 901.1 42.4199Z" fill="black"/> <path d="M1120.72 131.51H1022.21V42.4199H998.96V243.29H1022.21V154.2H1120.72V243.29H1143.97V42.4199H1120.72V131.51Z" fill="black"/> <path d="M1275.35 41.3H1247.42C1211.86 41.3 1188.88 63.4001 1188.88 97.6101V188.1C1188.88 222.83 1211.31 244.41 1247.42 244.41H1275.35C1311.46 244.41 1333.89 222.83 1333.89 188.1V97.6101C1333.89 63.41 1310.91 41.3 1275.35 41.3ZM1310.65 96.77V188.93C1310.65 210.07 1297.82 221.71 1274.52 221.71H1248.27C1224.97 221.71 1212.14 210.07 1212.14 188.93V96.77C1212.14 75.63 1224.97 63.9901 1248.27 63.9901H1274.52C1297.82 63.9901 1310.65 75.63 1310.65 96.77Z" fill="black"/> <path d="M1459.69 131.51H1422.83C1400.07 131.51 1387.53 119.67 1387.53 98.1699C1387.53 76.6699 1400.06 65.1099 1422.83 65.1099H1504.55V42.4199H1423.39C1387.28 42.4199 1364.85 63.7799 1364.85 98.1699C1364.85 132.56 1387.28 154.2 1423.39 154.2H1460.26C1483.02 154.2 1495.56 166.04 1495.56 187.54C1495.56 209.04 1483.03 220.6 1460.26 220.6H1369.88V243.29H1459.7C1495.81 243.29 1518.24 221.93 1518.24 187.54C1518.24 153.15 1495.81 131.51 1459.7 131.51H1459.69Z" fill="black"/> <path d="M304.45 90.55C301.43 98.59 297.57 106.21 292.97 113.32C298.17 114.19 303.63 116.11 310.64 120.62C353.87 148.48 346.84 215.28 298.48 232.36C296.04 233.22 285.14 236.57 283.74 236.57H222.16C225.35 229.04 234.52 217.42 241.03 212.8C249.13 207.06 262.55 207.61 265.34 195.43C271.53 168.4 236.39 158.36 227.38 180.2C225.11 185.69 227.26 191.04 224.17 195.94L181.26 244.08C178.57 256.68 187.59 260.27 198.41 261.27C227.27 263.95 291.66 263.58 316.98 250.85C388.11 215.08 372.36 113.47 304.45 90.55Z" fill="#40D49B"/> <path d="M31.79 109.67C-14.45 146.85 -9.58999 219.54 42.14 248.92C115.65 290.67 161.12 217.56 204.43 167.28C209.68 161.18 214.91 155.42 220.15 150.23C226.25 145.73 235.65 146.81 241.16 140.39C257.66 121.18 232.62 94.7599 212.61 110.47C203.23 117.83 207.56 125.89 203.32 133.39C200.07 139.15 188.91 152.39 176.2 166.67C159.38 185.57 139.82 206.27 132.2 213.84C62.97 282.55 -16.6 179.11 46.96 128.6C61 117.44 78.16 113.37 94.56 116.13C88.91 107.92 84.25 98.9599 80.78 89.4399C62.23 94.5199 47.57 96.9699 31.8 109.65L31.79 109.67Z" fill="#1FBFFF"/> <path d="M280.78 86.06C261.08 -29.75 97.89 -28.54 82.97 88.84C82.23 89.05 81.5 89.25 80.77 89.45C84.24 98.97 88.9 107.93 94.55 116.14C104.48 117.81 114.13 121.98 122.65 128.61C129.86 134.22 137.98 148.89 149.39 140.11C168.26 125.59 119.84 95.15 106.74 94.29C113.14 6.33997 238.6 -1.63004 256.12 86.09C258.05 95.76 253.04 109 268.7 111.41C278.69 112.94 285.56 112.07 292.97 113.32C297.57 106.22 301.43 98.59 304.45 90.55C297.15 88.09 289.25 86.53 280.78 86.06Z" fill="#E543A1"/> </g> <defs> <clipPath id="clip0_1303_3879"> <rect width="1518.23" height="262.61" fill="white"/> </clipPath> </defs> </svg>`;
const comoImagem = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const comum = {
  brandTitle: 'Nephos',
  brandUrl: './',
  brandTarget: '_self',
  fontBase: "'Noto Sans', sans-serif",
  fontCode: "'IBM Plex Mono', monospace",
  colorPrimary: '#1FBFFF',
};

const TEMAS = {
  light: create({
    ...comum,
    base: 'light',
    brandImage: comoImagem(LOGO_LETRAS_PRETAS),
    colorSecondary: '#333333',
    appBg: '#FFFFFF',
    appContentBg: '#FFFFFF',
    appPreviewBg: '#FFFFFF',
    appBorderColor: '#DDDDDD',
    textColor: '#111111',
    textMutedColor: '#555555',
    barBg: '#F4F4F5',
    barTextColor: '#555555',
    barSelectedColor: '#111111',
    barHoverColor: '#111111',
  }),
  dark: create({
    ...comum,
    base: 'dark',
    brandImage: comoImagem(LOGO_LETRAS_BRANCAS),
    colorSecondary: '#1FBFFF',
    appBg: '#141416',
    appContentBg: '#1C1C20',
    appPreviewBg: '#141416',
    appBorderColor: '#313138',
    textColor: '#F5F5F6',
    textMutedColor: '#A3A7AD',
    barBg: '#1C1C20',
    barTextColor: '#CFD2D6',
    barSelectedColor: '#1FBFFF',
    barHoverColor: '#1FBFFF',
  }),
};

const modoDe = (globals) => (globals?.[MODO] === 'dark' ? 'dark' : 'light');

/** Botao unico: mostra o modo atual e troca para o outro. */
function SeletorDeModo() {
  const [globals, updateGlobals] = useGlobals();
  const modo = modoDe(globals);
  const t = textos(globals?.[CHAVE] ?? IDIOMA_PADRAO).modo;
  const acao = modo === 'dark' ? t.paraClaro : t.paraEscuro;
  return React.createElement(
    IconButton,
    {
      key: 'nephos-modo',
      title: acao,
      'aria-label': acao,
      onClick: () => updateGlobals({ [MODO]: modo === 'dark' ? 'light' : 'dark' }),
    },
    React.createElement(modo === 'dark' ? MoonIcon : SunIcon),
    React.createElement('span', null, modo === 'dark' ? t.escuro : t.claro),
  );
}

addons.register('nephos/modo', (api) => {
  let atual = 'light';
  const aplicar = () => api.setOptions({ theme: TEMAS[atual] });
  const canal = addons.getChannel();
  canal.on(GLOBALS_UPDATED, ({ globals }) => {
    atual = modoDe(globals);
    aplicar();
  });
  /* SET_CONFIG reaplica o tema do `setConfig`; o modo escolhido tem de voltar. */
  canal.on(SET_CONFIG, () => setTimeout(aplicar, 0));

  addons.add('nephos/modo/seletor', {
    type: types.TOOL,
    title: 'colorScheme',
    render: SeletorDeModo,
  });
});

addons.setConfig({
  theme: TEMAS.light,
  sidebar: {
    showRoots: true,
    renderLabel: (item, api) => {
      const idioma = api?.getGlobals?.()?.[CHAVE] ?? IDIOMA_PADRAO;
      return rotuloDaBarra(item.id, idioma) ?? item.name;
    },
  },
});
