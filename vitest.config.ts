/**
 * Vitest em modo browser (P21, item 5).
 *
 * Navegador de verdade, nao DOM simulado: `currentColor`, custom properties
 * resolvidas e transbordo do desenho so podem ser verificados onde ha layout.
 * O Chromium vem do Playwright e nao e versionado.
 *
 * Two projects run in the same `npm test`. `unit` is the tests written per
 * component. `storybook` renders every story of `.storybook/main.js` through
 * the Storybook Vitest integration and runs the accessibility gate on each one
 * (P72); its rule set is in `.storybook/preview.js`.
 */
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, type Plugin } from 'vitest/config';

/** A new object per project: Vitest writes the project name into each instance. */
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  screenshotFailures: false,
  instances: [{ browser: 'chromium' as const }],
});

/**
 * Diagnostics for the intermittent "Failed to fetch dynamically imported
 * module" on the Azure agents, kept on in the pipeline to read the next
 * failure. With `NEPHOS_TEST_DIAGNOSTICS` set, the browser Vite server of each
 * project logs to stderr every top-level test import, every response at or
 * above 400 and every response closed before it finished. It tells whether the
 * failing request reached Vite and what Vite answered. Off by default.
 */
const TOP_LEVEL_IMPORT = /(\.test\.ts|\.stories\.[jt]s|setup-file-with-project-annotations\.js)\?/;
/** The repository has no Node type definitions; this is the part used here. */
const node = (
  globalThis as unknown as {
    process: { env: Record<string, string | undefined>; stderr: { write(text: string): void } };
  }
).process;
const requestLog = (project: string): Plugin[] =>
  node.env.NEPHOS_TEST_DIAGNOSTICS
    ? [
        {
          name: 'nephos:request-log',
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              const start = Date.now();
              const url = (req as { url?: string }).url ?? '';
              let finished = false;
              const log = (outcome: string) =>
                node.stderr.write(
                  `[nephos-diag] ${new Date().toISOString()} ${project} ${outcome} ${Date.now() - start}ms ${url}\n`,
                );
              res.on('finish', () => {
                finished = true;
                if (res.statusCode >= 400 || TOP_LEVEL_IMPORT.test(url)) {
                  log(`${res.statusCode} ${res.statusMessage}`);
                }
              });
              res.on('close', () => {
                if (!finished) log('closed-before-finish');
              });
              next();
            });
          },
        },
      ]
    : [];

export default defineConfig({
  test: {
    projects: [
      {
        plugins: requestLog('unit'),
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          browser: browser(),
        },
      },
      {
        plugins: [storybookTest({ configDir: '.storybook' }), ...requestLog('storybook')],
        test: {
          name: 'storybook',
          browser: browser(),
        },
      },
    ],
  },
});
