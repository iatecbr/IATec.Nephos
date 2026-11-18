```json
{
  "id": "DSA-88",
  "goal": "Implement the nph-card, a surface that groups the content and the actions of one subject, in the contract accepted in Figma, and write the spec.",
  "phase": "F4",
  "approved_order": 870,
  "owner": "elvys",
  "state": "in-progress",
  "piece": "nph-card",
  "dependencies": [
    "DSA-03",
    "DSA-10",
    "DSA-12",
    "DSA-13",
    "DSA-24",
    "DSA-26",
    "DSA-43",
    "DSA-51",
    "DSA-64"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-card documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-88/figma-docs-accepted-2026-11-17.md",
      "result": "passed",
      "verified_at": "2026-11-17",
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
    "docs/operacao/evidencias/DSA-88/figma-docs-accepted-2026-11-17.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-14.md, nph-card: redesign round with the corrections of the design owner (soft outline on every card, divider before the footer, tonal icon box, start with icon, avatar or image, hover by the outline, assembly model)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-17.md, nph-card: green light (visual acceptance) and a test round with the 21 approval items taken as recommended: documentation accepted, 30 card tokens, focus radii 15 and 19 with two core primitives, space/surface-padding, radius/inset, descriptions of color/border-subtle, color/border, color/border-strong, color/primary-surface, space/container-padding and radius/inner, footer padding, start image 48 px, title styles, media and export, nothing interactive inside the clickable card, divider on by default with actions, types out of v1, assembly model, names, default behavior"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6516-13647",
    "date": "2026-11-17",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-card documentation frame (6516:13647, page 1626:28) was accepted as the API and behavior specification of nph-card, with the visual acceptance of the root (6478:6670). COMPONENT_SET nph-card (6478:6673), 36 variants; COMPONENT_SET nph-card start (6478:7282), 6 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": "docs/operacao/contextos/DSA-88.md",
  "updated_at": "2026-11-18"
}
```

# DSA-88 — nph-card, a surface for one subject

## Goal
The `nph-card` in `src/components/nph-card/`, with CSS, tests, stories and the spec `fichas/nph-card.md`, in the contract accepted in Figma: a surface with an optional media, a body (header with start, title, status, description and action; content; tonal section) and a footer with a divider and actions, in three types (base, clickable, section), two surfaces (elevated, outlined), four media options and two densities.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-88/figma-docs-accepted-2026-11-17.md`. It carries the Figma documentation converted to text, with the 30 tokens, the anatomy part by part (with the token of each layer), the assembly model with the zone names in code, the measured contrast, the default behavior, the combined states, the inherited decisions, the icon and image rules, the six limit cases and the 21 decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Parts and tokens**: as the anatomy of the evidence. Surface `card/background`, `card/radius`, 1 px outline `card/border-width` in `card/border`; elevated adds `elevation/raised`, outlined has no shadow. Body padding `card/padding` (24) or `card/padding-compact` (16), gap `card/gap`. Header gap `card/header-item-gap`; title and description `card/header-gap`. Tonal section `card/section-background`, `card/section-radius`, `card/section-padding`, `card/section-gap`. Section list `card/list-gap`. Footer: divider (nph-separator, line `card/divider`), actions `card/footer-gap` with `card/footer-padding` (compact `card/footer-padding-compact`), aligned to the end, secondary before primary.
- **Outline drawn once**: Figma draws the outline and the divider twice (one layer per theme, both in the same token). In code there is one outline and one divider; the tokens already change by theme. The outline must not change the card size between states (the hover only changes its color).
- **Start**: one piece at a time: the tonal icon box (`card/icon-container-background`, `card/icon-container-radius`, `card/icon-container-padding`, icon `card/icon-size` or `card/icon-size-dense` in `card/icon-container-foreground`), the nph-avatar (`lg`, compact `md`) or the nph-image (48 px `image/size-md`, compact 32 px `image/size-sm`). Decorative (`aria-hidden`) on the clickable card.
- **Title and status**: title `text/heading-md` (compact `text/heading-xs`) in `card/foreground`, one line with an ellipsis; the status (nph-badge secondary light) next to the title never hides, the title truncates before it.
- **Types**: base (own content and actions; menu action: nph-icon-button ghost compact `ellipsis-vertical`, a menu button); clickable (the whole card is the area of the title link; the arrow `chevron-right` in `card/indicator-size` and `card/indicator-foreground`, decorative; a meta text footer in `card/description-foreground`; no buttons, no header action, no tonal section, no divider); section (a region with a key-value list and, when on, a secondary solid compact button with text in the header).
- **States**: default and loading on every type; hover, focus and disabled on the clickable only. Hover: the outline goes to `card/border-hover`, background and shadow stay; the arrow of the clickable is always shown. Figma draws no hover transition: if the code animates the outline color, it uses `motion/state-duration` and `motion/state-easing` and is instant under `prefers-reduced-motion` (DSA-62 D-3). Focus: `focus/border` (`border/width`, corner `focus/border-radius-surface`) and `focus/halo` (`focus/ring-width`, corner `focus/radius-surface-with-border`) around the whole card. Disabled: `card/disabled-opacity`, out of the focus order. Loading: nph-skeleton in place of the content, as part 12 of the evidence anatomy (start, title, description and two content lines in skeleton; on base and section the footer stays with the divider and one action skeleton; the clickable has no footer while loading).
- **Parts that turn on and off**: start, description, footer and divider on by default; status, header action and tonal section off. The divider shows only with the action footer on.
- **Media**: top (the card width, 16:9, clipped by the card to `card/radius`), inset top (inside the body padding, corner `image/radius-lg`), side (left, the card height, about 40% of the card width, 33% compact, cover crop). On a narrow container the side media moves to the top. Media is on base and clickable.
- **Density**: default and compact as the evidence table; the start follows the density.
- **Keyboard and roles**: the default behavior table of the evidence. Clickable: one Tab stop, the title link, stretched with CSS only to cover the card, Enter opens, Space does nothing. Base: the card takes no focus; Tab goes through the inner controls. Section: `section` with `aria-labelledby` to the title. Disabled clickable: no `href`, `role="link"`, `aria-disabled="true"`. Loading: `aria-busy="true"`, skeleton `aria-hidden="true"`, plus a hidden "Loading" text outside the hidden node. Collection: a `ul`/`li` list with a name, the card title as a heading, `h3` by default, configurable.
- **Target size**: the menu action is 28 px (`control/height-compact`) and becomes 36 px (`control/height-default`) on a touch screen.
- **Code slot names**: `root`, `media`, `leading`, `title`, `status`, `action`, `description`, `content`, `section`, `divider`, `footer` (shadcn `data-slot` where it has the part; Nephos names for the rest).
- **Images**: export at 2x, cover crop: start 96 × 96 and 64 × 64; top media at 2x of the largest width in use (720 × 405 for 360 wide); side media at 2x of the largest side width (400 for 200).

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- How the card is given its parts (slots by zone name, or properties for title, description and status) and how the type, surface, media and density are set. The spec names them.
- The stretched link: which element holds the link (the title slot or a property with the destination) and how the link area covers the card with CSS only (for example a pseudo-element on the link), keeping text selectable where possible and nothing interactive inside. The spec names it.
- The heading level of the title: a property, `h3` by default (item 19d). The spec names it.
- The hidden "Loading" text: its translated string and where it sits. The spec names it.
- Touch detection for the 36 px menu action (for example `pointer: coarse`): the spec names the media query.
- The narrow container rule for the side media: the width at which it moves to the top (a container query); Figma shows the wide case only. The spec names the value.
- Loading with media: Figma draws the loading state without media. Whether the media place shows the nph-image in its own loading state or the media stays out while loading is open for Indiane, in Figma. It does not block the pull request.
- Long key or value in the key-value list of the section type: Figma does not draw it. Wrap or truncate is open for Indiane, in Figma. It does not block the pull request.
- The width: Figma widths (360, 320, 560) are examples; the card takes the container width.
- The menu of the menu action is the product's nph-dropdown-menu; the card only places the trigger.

## Why it is ready
The 30 `card/*` tokens came with this task and are on `v/5.0.0`: 29 aliases of semantics and 1 straight to the core by decision (`card/icon-container-padding`, `core/space/200`: no semantic has the function of breathing room inside a small box). New with this task: the semantics `focus/border-radius-surface`, `focus/radius-surface-with-border`, `space/surface-padding` and `radius/inset`, and the primitives `core/radius/off-scale/15` and `core/radius/off-scale/19`. Every piece it uses is done: `nph-icon` (DSA-03), `nph-separator` (DSA-10), `nph-badge` (DSA-12), `nph-button` (DSA-13, DSA-43, DSA-64), `nph-avatar` (DSA-24), `nph-skeleton` (DSA-26), `nph-image` (DSA-51).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not add the types left out of v1 (item 16: selectable and expandable cards are the nph-rich-option and the nph-collapsible). It does not change the nph-collapsible: aligning its card appearance with `color/border-subtle` is that component's next adjustment (item 13, still open in the Figma appendix).

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `1626:28`, documentation frame `6516:13647`, root `6478:6670` and the evidence of the `figma-docs-accepted` gate
- Component sets: nph-card `6478:6673`; nph-card start set `6478:7282`
- WAI-ARIA APG, Link: https://www.w3.org/WAI/ARIA/apg/patterns/link/
- WAI-ARIA APG, Menu Button: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
- Inclusive Components, Cards: https://inclusive-components.design/cards/
- Block Links, Cards, Clickable Regions: https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html
- More Accessible Skeletons: https://adrianroselli.com/2020/11/more-accessible-skeletons.html
- WCAG 2.2, target size (minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- MDN, container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-button.md`, `fichas/nph-icon.md`, `fichas/nph-image.md`, `fichas/nph-avatar.md`, `fichas/nph-badge.md`, `fichas/nph-separator.md`, `fichas/nph-skeleton.md`
