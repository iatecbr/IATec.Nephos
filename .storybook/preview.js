/*
 * Nephos Storybook preview: the page that shows each story.
 *
 * The CSS generated from the JSON (P17) is loaded here because components
 * consume `--nph-*` from outside the Shadow DOM: without it,
 * `var(--nph-icon-size-sm)` would resolve empty and no box would have a size.
 * The file is GENERATED — never edit `src/tokens/generated/tokens.css` by hand.
 *
 * The Nephos fonts — Noto Sans and IBM Plex Mono — come from `@fontsource`,
 * with no external call. The weights are those of the text roles: 400, 500
 * (`text/label-*`) and 600. The tokens only declare the family; without this
 * loading, the page would fall back to the browser's default font.
 *
 * The `colorScheme` global (light | dark) is the color mode. One mode at a time:
 * the decorator applies `data-nph-color-scheme` on the page root, and
 * `manager.js` switches the frame along with it. A frame that pins its own
 * scheme, as in `nph-label`, still wins for the variables of the scheme blocks.
 *
 * The `locale` global gives the language of the explanatory texts. It is NOT
 * component API: no `nph-*` knows a language, and the consumer's accessible
 * content — `label`, for example — still arrives already localized by the
 * application. See `docs/i18n.md`.
 */
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '../src/tokens/generated/tokens.css';
import { LOCALE_GLOBAL, LOCALES, DEFAULT_LOCALE } from './i18n/index.js';

/** The same global name as in `manager.js`. */
const COLOR_SCHEME = 'colorScheme';

/** Page font, background and color, always by token. Injected once. */
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
  if (document.getElementById('nph-page-style')) return;
  const style = document.createElement('style');
  style.id = 'nph-page-style';
  style.textContent = PAGE_STYLE;
  document.head.appendChild(style);
}

/** @type {import('@storybook/web-components').Decorator} */
const withColorScheme = (story, context) => {
  ensureStyle();
  const colorScheme = context.globals?.[COLOR_SCHEME] === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-nph-color-scheme', colorScheme);
  return story();
};

/** @type {import('@storybook/web-components').Preview} */
const preview = {
  parameters: {},

  decorators: [withColorScheme],

  initialGlobals: {
    [LOCALE_GLOBAL]: DEFAULT_LOCALE,
    [COLOR_SCHEME]: 'light',
  },

  globalTypes: {
    [LOCALE_GLOBAL]: {
      description: 'Idioma dos textos explicativos',
      toolbar: {
        title: 'Idioma',
        icon: 'globe',
        items: LOCALES,
        dynamicTitle: true,
      },
    },
    /* Without `toolbar`: the `manager.js` tool is what shows the selector. */
    [COLOR_SCHEME]: {
      description: 'Modo de cor da moldura e da pagina',
    },
  },
};

export default preview;
