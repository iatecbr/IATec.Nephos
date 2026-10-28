/*
 * Lets the transitions inside the shadow roots end before the accessibility
 * gate reads the page (P72).
 *
 * In a test run, Storybook pauses animations with a stylesheet in the
 * document head, and that stylesheet does not cross a shadow root. A piece
 * that fades in on mount, such as `nph-tooltip`, `nph-dialog` or
 * `nph-dropdown-menu`, is still half transparent when axe measures it, and the
 * contrast it reports is the one of a frame nobody sees.
 *
 * So, in a Vitest run only, the hook waits for the running animations of the
 * document and of every shadow root (`waitForAnimations`, which skips the
 * infinite ones and gives up after 5 seconds). Then every shadow root gets a
 * stylesheet that makes any later transition instant, and whatever still runs
 * is finished. The gate reads the frame the person sees once the motion ends,
 * never one in the middle of it. A shadow root goes away with its story, so
 * the stylesheet never reaches the next one. Outside Vitest — `npm run
 * storybook` and the static build — the hook does nothing, and the pieces
 * keep their motion.
 *
 * `preview.js` uses this hook. Storybook runs the `afterEach` hooks in reverse
 * order — the story's, the component's, then the project's from last to
 * first — and `preview.js` is the last project annotation, after the addons,
 * so this wait runs before the check of `@storybook/addon-a11y`.
 */
import { waitForAnimations } from 'storybook/preview-api';

/** Makes every later transition instant: the gate reads end states only. */
const INSTANT = `*, *::before, *::after, ::backdrop {
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}`;

/** Every shadow root inside the document, nested ones included. */
function shadowRoots(root = document, found = []) {
  for (const element of root.querySelectorAll('*')) {
    if (!element.shadowRoot) continue;
    found.push(element.shadowRoot);
    shadowRoots(element.shadowRoot, found);
  }
  return found;
}

/** @type {import('@storybook/web-components').Preview['afterEach']} */
export const settleBeforeCheck = async ({ abortSignal }) => {
  if (!globalThis.__vitest_browser__) return;
  await waitForAnimations(abortSignal);
  const instant = new CSSStyleSheet();
  instant.replaceSync(INSTANT);
  for (const root of shadowRoots()) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, instant];
    for (const animation of root.getAnimations()) {
      if (animation.playState === 'running' && animation.effect?.getComputedTiming().iterations !== Infinity) {
        animation.finish();
      }
    }
  }
  await new Promise((resolve) => requestAnimationFrame(() => resolve()));
};
