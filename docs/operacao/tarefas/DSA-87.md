```json
{
  "id": "DSA-87",
  "goal": "Implement the nph-carousel, a strip of slides where one part shows at a time and the person moves on with arrows, indicators or by dragging, in the contract accepted in Figma, and write the spec.",
  "phase": "F4",
  "approved_order": 860,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-carousel",
  "dependencies": [
    "DSA-03",
    "DSA-26",
    "DSA-43",
    "DSA-51",
    "DSA-64"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-carousel documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-87/figma-docs-accepted-2026-11-16.md",
      "result": "passed",
      "verified_at": "2026-11-16",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-87/figma-docs-accepted-2026-11-16.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-14.md, nph-carousel: adjustment round with the corrections of the design owner (softer colors on the dots and the arrow icon)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-16.md, nph-carousel: green light (visual acceptance) and a test round with the 15 approval items taken as recommended: documentation accepted, 14 carousel tokens, descriptions of color/subtle-foreground, color/primary-border, radius/full and radius/subtle, indicators as a tab group, counter above five slides, two slides shown together, automatic rotation, vertical and thumbnails out of v1, focus and arrow hover unchanged, whole slides by container width, image exported at 2x"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5173-1429",
    "date": "2026-11-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-carousel documentation frame (5173:1429, page 1626:32) was accepted as the API and behavior specification of nph-carousel, with the visual acceptance of the root (5164:663). COMPONENT_SET nph-carousel (5165:1094), 9 variants; COMPONENT_SET nph-carousel indicators (5164:771), 11 variants; COMPONENT_SET nph-carousel indicator (5164:687), 5 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-16"
}
```

# DSA-87 — nph-carousel, slides one part at a time

## Goal
The `nph-carousel` in `src/components/nph-carousel/`, with CSS, tests, stories and the spec `fichas/nph-carousel.md`, in the contract accepted in Figma: a track of slides where one part shows at a time, in three layouts (one slide, several, peek), with a controls bar below the track (previous arrow, indicators, next arrow, counter). It follows the WAI-ARIA APG Carousel pattern, with the indicators as a tab group.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-87/figma-docs-accepted-2026-11-16.md`. It carries the Figma documentation converted to text, with the 14 tokens, the anatomy part by part (with the token of each layer), the measured contrast, the default behavior, the combined states, the inherited decisions, the icon and image rules, the six limit cases and the 15 decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Parts**: root (track and controls bar stacked, gap `carousel/controls-offset`, no background or outline); track (horizontal, clips the overflow, gap `carousel/slide-gap`); slide (no background, outline or radius of its own, free content); peek (the neighbor edge, `carousel/peek-size`, peek layout only); controls bar (centered row, gap `carousel/control-gap`, order: previous arrow, indicators, next arrow, counter).
- **Layouts**: `único` one whole slide; `vários` as many whole slides as fit the container width, at least one, never shrunk nor cut, a single slide follows the container below one slide width (decided); `espiada` the current slide and the edge of the neighbor (next at start and middle, previous at the end). Default: one slide.
- **Arrows**: the nph-icon-button `secondary`, `solid`, `default`, circular, with nph-icon `chevron-left` and `chevron-right` (`light`; `solid` in hover and active, DSA-47 D1), icon color overridden to `carousel/control-foreground`. With no wrap-around, the arrow on the side with no slide is disabled (`state/disabled-opacity`) and, by the appendix, stays focusable (APG); in v1 that depends on the nph-icon-button (see "Open points for the code", disabled arrow at the ends). The arrow hover is the nph-icon-button hover (decided, no change).
- **Indicators**: one per slide, 2 to 5, targets touching (gap 0). Target `carousel/indicator-target-size` (24 × 24), circle `carousel/indicator-target-radius`, hover background `carousel/indicator-target-background-hover` on the non-current one only. Marker: dot `carousel/indicator-size` in `carousel/indicator-background`; current pill `carousel/indicator-width-current` × `carousel/indicator-size` in `carousel/indicator-background-current`; corner `carousel/indicator-radius`. The current one has no hover. With focus, no hover background; focus border `focus/border` (`border/width`) and halo `focus/halo` (`focus/ring-width`) outside the target, corner `carousel/indicator-target-radius`.
- **Counter**: "position of total" (as "2 of 8"), text style `text/label-md`, color `carousel/counter-foreground`, off by default; turn it on when the indicators are off. Above five slides, indicators off and counter on; in the several layout it counts pages (decided).
- **Two slides**: the spec tells the product not to use the carousel and to show both together; only without room, indicators with two items and arrows (decided).
- **Roles and keys**: the APG Carousel with the tabbed variant, full table in the evidence, "Default behavior": Tab goes previous arrow, indicators (one stop) and next arrow; Left and Right move focus between indicators and show the slide; Home and End go to the first and the last; Enter or Space on an arrow move one slide; click on an indicator shows its slide; drag or swipe on the track, never the only way (WCAG 2.5.7); focus stays on the control used, the new slide is announced politely. Names: arrows by the `label` property of the nph-icon-button, which becomes the native `aria-label` and the tooltip text ("Previous slide", "Next slide", translated), icon `aria-hidden`; each indicator "Slide N of total"; in the several layout each indicator stands for a page ("Go to page N").
- **Motion**: the transition uses `motion/state-duration` and `motion/state-easing`, and is instant under `prefers-reduced-motion` (DSA-62 D-3).
- **Out of v1**: automatic rotation, vertical carousel and thumbnails (decided). If automatic rotation ever returns: a pause button first in Tab order, stop on focus and hover, live announcement off while it rotates (APG).
- **Image**: slide content, not a carousel piece. The example is the nph-image size media, 16:9; export at 2x (512 × 288 for 256 × 144), cropped to 16:9 from the center (`object-fit: cover; object-position: 50% 50%`) (decided).

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- How the slides are given to the component (slots or child slide elements) and how the current position is set and reported (event name and payload).
- Wrap-around: whether v1 offers it as a property; Figma draws the no-wrap behavior (disabled arrow at the ends). The spec names it.
- Roles: the indicators are a tab group by decision (item 9), so the APG tabbed carousel applies: `role="tablist"` on the indicators, `role="tab"` on each indicator with `aria-selected` on the current one, `role="tabpanel"` on each slide, inside a region with `aria-roledescription="carousel"` and a name. The spec only names the final markup.
- Indicator activation: automatic, as the appendix row says (Left and Right move focus and show the slide; item 9). The spec names it.
- The polite announcement of the new slide: `aria-live="polite"` on the track, as the APG; off while a future automatic rotation rotates.
- In the several layout: how the pages are counted when the container width changes (a resize can change the number of pages and the current page), and what the indicators show then (one per page).
- The 256 px slide width in Figma is the example nph-image width (`image/media-width`); the real slide width comes from the content or the product. The whole-slide rule of the several layout uses the real width.
- Drag threshold and swipe velocity (Figma does not set a value): the code picks them, and the spec names them.
- The arrow `label` text and the indicator names, translated: the spec names the strings.
- Disabled arrow at the ends: the appendix keeps it focusable (APG, focusability of disabled controls), but today the nph-icon-button cannot do it without a change: `src/components/nph-button/nph-button.ts` writes `aria-disabled` only for `loading`, `fichas/nph-button.md` takes a `disabled` button out of the Tab order, and its tooltip hides only with `disabled`. Provisional in v1, until the design owner decides (open point below): the arrow uses the native `disabled`, out of the Tab order. When the focused arrow becomes disabled because the last (or first) slide is reached, focus must not get lost: recommended, it moves to the current indicator, or to the other arrow when the indicators are off; the spec names it. If the design owner asks for a focusable disabled mode in the nph-icon-button, it comes in its own task; then, with focus, the border shows at full opacity over the dimmed arrow (as DSA-75 D-2) and the tooltip does not show, as on a disabled button.
- Slides out of view: as the APG, the content of a slide that is not in view leaves the Tab order and the accessibility tree (`inert`, or `aria-hidden="true"` with its controls out of the Tab order). In the several layout every whole slide in view counts as visible, so its links and buttons follow the content order. In the peek layout the neighbor shown at the edge is out of view: recommended, it stays `inert`, and a click on it does not change the slide (the arrows and indicators do it). Each slide announces itself as "position of total" (as "3 of 5"), with `aria-roledescription="slide"` or the tab panel label. The spec names the final choice.
- Right-to-left text: the arrows and the slide order mirror, as the APG says for left and right; the spec names it.

## Open point for the design owner (non-blocking)
- Disabled arrow at the ends: keeping it focusable, as the appendix and the APG say, needs a focusable disabled mode in the nph-icon-button (a change to that component). Until the design owner decides it in the next approval round, the arrow uses the native `disabled` as a provisional way out, with the focus rule of the open point above.

## Why it is ready
The 14 `carousel/*` tokens came with this task and are on `v/5.0.0`: 10 aliases of semantics, and 4 straight to the core by decision (`carousel/indicator-size`, `carousel/indicator-width-current`, `carousel/indicator-target-size`, `carousel/peek-size`): no semantic has the function of a marker size, a hit target or a peek. No new value entered the core. Every piece it uses is done: `nph-icon` (DSA-03), the icon-only nph-button (DSA-43), the secondary icon-only nph-button (DSA-64), `nph-image` (DSA-51). The examples use nph-skeleton (DSA-26, done) as slide content only.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not add automatic rotation, a vertical carousel or thumbnails in v1. It does not change the nph-icon-button: "review the hover contrast" of the arrow is a note for a future review of that component.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `1626:32`, documentation frame `5173:1429`, root `5164:663` and the evidence of the `figma-docs-accepted` gate
- Component sets: nph-carousel `5165:1094`; nph-carousel indicators `5164:771`; nph-carousel indicator `5164:687`
- WAI-ARIA APG, Carousel: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- WAI-ARIA APG, Tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- WAI-ARIA APG, focusability of disabled controls: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols
- WCAG 2.2, target size (minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2, dragging movements: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- WCAG 2.2, pause, stop, hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- MDN, container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-button.md`, `fichas/nph-icon.md`, `fichas/nph-image.md`
