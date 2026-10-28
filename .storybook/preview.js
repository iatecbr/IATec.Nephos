/*
 * Nephos Storybook preview: the page that shows each story.
 *
 * The CSS generated from the JSON (P17) is loaded here because components
 * consume `--nph-*` from outside the Shadow DOM: without it,
 * `var(--nph-icon-size-sm)` would resolve empty and no box would have a size.
 * The file is GENERATED — never edit `src/tokens/generated/tokens.css` by hand.
 * `src/styles/scrollbar.css` comes right after it: it colours the native
 * scrollbar with the `scrollbar/*` tokens.
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
 * application. See `docs/i18n.md`. The decorator still writes it to
 * `<html lang>`, so assistive technology reads the explanatory texts in their
 * own language (WCAG 3.1.1).
 *
 * `color-scheme` follows `data-nph-color-scheme`, on the root and on any frame
 * that pins its own scheme: native controls, such as an `<input>` or the
 * search cancel button, are drawn in the mode of the page around them.
 *
 * `a11y` is the accessibility gate (P72). Every story, `Validation` and
 * `Docs`, runs axe with the WCAG 2.2 AA rule set — the A and AA tags of WCAG
 * 2.0, 2.1 and 2.2 — and `test: 'error'` makes a violation fail `npm test`.
 * The gate runs each story once, in the initial globals (light mode, default
 * language). An exception is written in the story itself, with the reason, the
 * discarded alternative and the date (`docs/stories.md`, §2.3), and opening
 * one is a human decision. `settleBeforeCheck` (`settle.js`) makes the gate
 * read each story only once its transitions have ended.
 */
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '../src/tokens/generated/tokens.css';
import '../src/styles/scrollbar.css';
import { LOCALE_GLOBAL, LOCALES, DEFAULT_LOCALE } from './i18n/index.js';
import { settleBeforeCheck } from './settle.js';

/** The same global name as in `manager.js`. */
const COLOR_SCHEME = 'colorScheme';

/** The axe tags of WCAG 2.2 AA. axe-core has no `wcag22a` tag. */
const WCAG_22_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

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
  [data-nph-color-scheme='light'] {
    color-scheme: light;
  }
  [data-nph-color-scheme='dark'] {
    color-scheme: dark;
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
const withPageContext = (story, context) => {
  ensureStyle();
  const colorScheme = context.globals?.[COLOR_SCHEME] === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-nph-color-scheme', colorScheme);
  const locale = context.globals?.[LOCALE_GLOBAL];
  document.documentElement.lang = LOCALES.some(({ value }) => value === locale) ? locale : DEFAULT_LOCALE;
  return story();
};

/** @type {import('@storybook/web-components').Preview} */
const preview = {
  parameters: {
    a11y: {
      test: 'error',
      options: { runOnly: { type: 'tag', values: WCAG_22_AA } },
    },
    options: {
      /*
       * Reading order of the sidebar: whoever arrives starts at "Start here".
       * Inside each component, the reading page comes before the proof.
       */
      storySort: {
        order: ['Start here', 'Foundations', 'Components', ['*', ['Docs', 'Validation']]],
      },
    },
  },

  decorators: [withPageContext],

  afterEach: settleBeforeCheck,

  initialGlobals: {
    [LOCALE_GLOBAL]: DEFAULT_LOCALE,
    [COLOR_SCHEME]: 'light',
  },

  globalTypes: {
    [LOCALE_GLOBAL]: {
      description: 'Language of the explanatory texts',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: LOCALES,
        dynamicTitle: true,
      },
    },
    /* Without `toolbar`: the `manager.js` tool is what shows the selector. */
    [COLOR_SCHEME]: {
      description: 'Color mode of the frame and the page',
    },
  },
};

export default preview;
