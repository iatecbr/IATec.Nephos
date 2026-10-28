/**
 * Brand frames of a VALIDATION page (DSA-36, D1; `docs/stories.md`, §6.4).
 *
 * Storybook has no brand selector: the page resolves `:root`, the default
 * brand. A component whose code consumes a token that resolves differently
 * across the seven brands of P20 proves them here, in light and dark, in one
 * story. Each frame carries `data-nph-brand` and `data-nph-color-scheme` on
 * the SAME element, so every brand and semantic token resolves there as it
 * would with the two attributes on the root (P67).
 *
 * The brands and the schemes come from the selectors of the generated CSS
 * itself, as in `src/shared/tokens/tokens-cascade.test.ts`: a new brand joins
 * every page without anyone touching a story. Rows and columns are named by
 * attribute and value, as in the matrix of a page (`docs/stories.md`, §4.10).
 *
 * `src/shared/tokens/brand-validation.test.ts` fails a component that consumes
 * such a token and has no `Brands` story built with `brandFrames`.
 *
 * The scenery is not a precedent for component CSS.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import tokensCss from '../../tokens/generated/tokens.css?raw';
import { matrix } from './page';

/** The seven brands, in the order of the generated CSS. */
export const BRANDS: readonly string[] = [
  ...new Set([...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? '')),
];

/** The two color schemes, in the order of the generated CSS. */
export const SCHEMES: readonly string[] = [
  ...new Set([...tokensCss.matchAll(/\[data-nph-color-scheme="([\w-]+)"\]/g)].map((m) => m[1] ?? '')),
];

/**
 * Accessibility exception (P72, `docs/stories.md` §2.3), only on the `Brands` stories of
 * `nph-sidebar-item` and `nph-dropdown-menu`: the gate leaves out the axe rule `color-contrast`.
 * Reason: in the dark scheme, `color/primary-hover` resolves to `theme/brand-400-hover`, a darker
 * shade in `gerencial`, `educacao`, `igrejas` and `rh`, and those two pieces paint it as text: the
 * active item and the open group on `sidebar/panel-background` (1.00:1 to 1.86:1) and the checked
 * item on the popover (1.01:1 to 1.46:1). It is a token limit, and tokens come from Figma (DSA-36,
 * D2, for Indiane). Alternative discarded: drawing only the states that pass, which would hide the
 * limit. The exception leaves when the token is fixed. Decided by Elvys on 2026-10-28.
 */
export const BRAND_CONTRAST_EXCEPTION = { 'color-contrast': { enabled: false } } as const;

/** The brand and scheme of one frame, and a suffix for the ids and names inside it. */
export interface BrandFrame {
  brand: string;
  scheme: string;
  id: string;
}

/** Marks a frame, so the test can find the fourteen of a story. */
export const FRAME_ATTRIBUTE = 'data-nph-brand-frame';

/* Demo frame. Not a precedent for component CSS. */
const FRAME = `
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--nph-space-inline);
  padding: var(--nph-space-inline);
  border-radius: var(--nph-radius-control);
  background: var(--nph-color-background);
  color: var(--nph-color-foreground);
`;

/**
 * The seven brands in rows and the two schemes in columns. `content` is called
 * once per frame, with the frame's brand, scheme and id suffix, so that every
 * id, `for` and `name` inside a frame is unique on the page.
 */
export function brandFrames(label: string, content: (frame: BrandFrame) => TemplateResult): TemplateResult {
  return matrix(
    label,
    SCHEMES.map((scheme) => `data-nph-color-scheme: ${scheme}`),
    BRANDS.map((brand) => ({
      label: `data-nph-brand: ${brand}`,
      cells: SCHEMES.map((scheme) => {
        const frame = { brand, scheme, id: `${brand}-${scheme}` };
        return html`<div
          data-nph-brand=${brand}
          data-nph-color-scheme=${scheme}
          data-nph-brand-frame
          style=${FRAME}
        >
          ${content(frame)}
        </div>`;
      }),
    })),
  );
}
