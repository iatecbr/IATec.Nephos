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
import { defineConfig } from 'vitest/config';

/** A new object per project: Vitest writes the project name into each instance. */
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  screenshotFailures: false,
  instances: [{ browser: 'chromium' as const }],
});

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          browser: browser(),
        },
      },
      {
        plugins: [storybookTest({ configDir: '.storybook' })],
        test: {
          name: 'storybook',
          browser: browser(),
        },
      },
    ],
  },
});
