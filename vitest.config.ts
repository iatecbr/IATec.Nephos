/**
 * Vitest em modo browser (P21, item 5).
 *
 * Navegador de verdade, nao DOM simulado: `currentColor`, custom properties
 * resolvidas e transbordo do desenho so podem ser verificados onde ha layout.
 * O Chromium vem do Playwright e nao e versionado.
 */
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }],
    },
  },
});
