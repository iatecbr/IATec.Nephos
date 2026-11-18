```json
{
  "id": "DSA-86",
  "goal": "Implement the nph-resizable, a group of panels separated by a handle that is dragged to resize them, in the contract accepted in Figma, and write the spec.",
  "phase": "F4",
  "approved_order": 850,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-resizable",
  "dependencies": [
    "DSA-03",
    "DSA-13",
    "DSA-43",
    "DSA-64"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-resizable documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-86/figma-docs-accepted-2026-11-16.md",
      "result": "passed",
      "verified_at": "2026-11-16",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": "git merge-base --is-ancestor d94bd7717b6ceaeb93d7277b455e4fa79f3a1115 origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-86/review-and-merge-2026-11-17.md",
      "result": "passed",
      "verified_at": "2026-11-17",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "The collapse button on a touch screen (tablet, above the breakpoint) stays compact, 28 px, by the T4 exception of the handle. If it should grow to default on touch, as the nph-popover footer does, she decides in the next approval round. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    },
    {
      "id": "D-2",
      "question": "The evidence gives no width for the handle with the collapse button off. The code keeps the handle column at control/height-compact (28 px), because the handle has one size and the drag area stays above 24 px, so the panels do not move when the button is turned off. If Figma should draw it narrower, she decides. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-17"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-86/figma-docs-accepted-2026-11-16.md",
    "docs/operacao/evidencias/DSA-86/review-and-merge-2026-11-17.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-14.md, nph-resizable: adjustment round with the corrections of the design owner (lighter colors on the handle; focus as a 2 px line with no halo)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-16.md, nph-resizable: green light (visual acceptance), documentation accepted, and the 9 approval items answered as recommended: color/border-strong, resizable/focus-border-width, rotated grip, 24 px hit area in code, T4 exception for the compact collapse button, collapsed as example, out of mobile in v1, collapse button on by default with a one-tap way out"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5123-2641",
    "date": "2026-11-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-resizable documentation frame (5123:2641, page 1626:34) was accepted as the API and behavior specification of nph-resizable, with the visual acceptance of the root (5112:1850). COMPONENT_SET nph-resizable (5112:1849), 4 variants, and COMPONENT_SET nph-resizable handle (5099:172), 10 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-86-resizable", "commit": "d94bd7717b6ceaeb93d7277b455e4fa79f3a1115", "pr": 181 },
  "context": null,
  "updated_at": "2026-11-17"
}
```

# DSA-86 — nph-resizable, resizable panels

## Goal
The `nph-resizable` in `src/components/nph-resizable/`, with CSS, tests, stories and the spec `fichas/nph-resizable.md`, in the contract accepted in Figma: a group of 2 or 3 panels, side by side or stacked, with a handle between them that is dragged, or moved by keyboard, to change the size of the panels. It follows the WAI-ARIA APG Window Splitter pattern. Desktop only in v1.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-86/figma-docs-accepted-2026-11-16.md`. It carries the Figma documentation converted to text, with the 10 tokens, the anatomy part by part and state by state (with the token of each layer), the default behavior, the combined states, the inherited decisions, the icon rules, the six limit cases and the decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Parts**: group (no background, no outer outline); panel (no background of its own, padding `space/container-padding`, free content); handle (line segment, grip box, collapse button, line segment, all centered on the handle axis, gap `resizable/handle-gap`).
- **Handle states**: default (line `resizable/handle-color`, `resizable/handle-width`); hover (line `resizable/handle-color-hover`, resize cursor); dragging (line as hover, grip box background `resizable/grip-background-active`, grip icon `resizable/grip-foreground-active`); focus (the line becomes a 2 px border, `resizable/focus-border-width`, in `focus/border`, no halo, only on `:focus-visible`); disabled (whole handle in `state/disabled-opacity`, default cursor, out of the Tab order, the collapse button disabled with it).
- **Grip**: nph-icon `grip-vertical`, `light`, `resizable/grip-size`, in `resizable/grip-foreground`; on the horizontal handle the same icon rotated 90 degrees. The grip shows in every state: the line at rest does not reach 3:1 in light, so the grip is what tells the handle can be dragged.
- **Main panel**: each handle controls the panel at its start (left on a vertical handle, top on a horizontal one); with 3 panels, the first handle controls the first panel and the second handle the second. `aria-controls`, `aria-valuenow`, Enter, Home, End and the collapse button refer to it. Figma draws it so (every chevron points to the start; the collapsed example collapses the left panel).
- **Collapse button**: the nph-button icon-only `secondary`, `ghost`, `compact`, square, on by default, with nph-icon `light` 16: `chevron-left` on the vertical handle, `chevron-up` on the horizontal one. The chevron points to the main panel and flips (`chevron-right`, `chevron-down`) while it is collapsed. Compact here is a T4 exception (decided): the handle is thin and the component is desktop only; 28 stays above 24 × 24. It sits beside the `separator` element, not inside it (ARIA 1.2: the children of a separator are presentational).
- **Hit area**: the drag area is invisible and larger than the line: at least 24 px, larger on touch (WCAG 2.5.8; decided), as `resizeTargetMinimumSize` in react-resizable-panels. The visible line stays 1 px.
- **Roles and keys**: the APG Window Splitter, with the full table in the evidence, "Default behavior": arrows on the handle axis move it one step, Shift + arrow a bigger step, Enter collapses and restores the main panel, Home and End (optional, recommended) go to the minimum and the maximum, F6 (optional) moves to the next panel, double click restores the default size. `role="separator"`, `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-controls` on the main panel, accessible name from the panel it controls.
- **One-tap way out**: the collapse button and the double click do not reach a chosen size. The spec tells the product to offer a one-tap way out (sizes in a menu, a size field or step buttons) when the handle is the only way to resize (WCAG 2.5.7; decided).
- **Collapsed panel**: a size of the panel, not a look of the handle; no variant (decided). The Figma examples show it.
- **Mobile**: out of v1. Below the tablet breakpoint the handle does not show and the panels stack or become tabs (decided).

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- How the panels are given to the component (slots or child panel elements), how a panel declares its minimum, maximum, default and collapsed size, and how a size change is reported (the values belong to code and the product, documentation section 5).
- The scale of `aria-valuenow`, `aria-valuemin` and `aria-valuemax`: the APG uses 0 to 100, the percent of the main panel; the spec names the scale chosen.
- The step of an arrow and of Shift + arrow (Figma does not set a value): the code picks it, in percent or in pixels, and the spec names it.
- Home, End and F6 are optional in the APG and in the documentation keyboard row. The limit cases of the documentation use Home and End (minimum and maximum), so they are recommended in v1; F6 is the code's call. The spec says which keys v1 has.
- While the arrows move the handle, whether it shows the dragging look or only the focus look (Figma draws dragging for the pointer); the spec names it. The cursor is `col-resize` on the vertical handle and `row-resize` on the horizontal one (the resize cursor of the documentation).
- A whole disabled group (documentation section 5: code and product): whether it is a property of the group or of each handle, with the disabled rule of the evidence ("Combined states").
- Persistence of the chosen size (documentation, "Do": store and restore): whether the component does it with a key or the product does it with the reported size.
- Who swaps the layout below the tablet breakpoint, stacked or tabs: the product, or a component property. The breakpoint is the tablet one of `design.md` (`tokens_breakpoint`).
- The hit area size on touch (above 24): the code picks it, and the spec names it.
- Accessible names, already translated: the handle takes the name of the panel it controls (`aria-labelledby` when the panel has a visible label, a translated `aria-label` when it has none, as in the APG); the collapse button takes a translated `aria-label` with the action and the panel name.
- Collapse button state for assistive technology: recommended `aria-expanded` on the button with `aria-controls` on the main panel, or a label that swaps between collapse and restore; the spec names it.
- Enter with the collapse button off: the APG keeps Enter on the handle, so it still collapses and restores (recommended).
- Space freed by a collapsed panel: it goes to the panel across the same handle; with 3 panels, the second handle gives the space of the second panel to the third. `aria-valuenow` of a collapsed main panel is its collapsed size (0 when it collapses fully). Dragging from a collapsed panel restores it as the handle moves.
- The focus line grows from 1 to 2 px: draw it so the panels do not shift (outline or inset shadow); the spec names it.
- Right-to-left text: the start panel and the chevron mirror (right panel, `chevron-right`), and the arrows follow the visual side, as the APG says for left and right; the spec names it.
- Motion of collapse and restore: if animated, use the `motion/*` tokens of `design.md` and drop the animation under `prefers-reduced-motion`; no animation is also valid.

## Open point for the design owner (non-blocking)
- Collapse button on a touch screen (tablet, above the breakpoint): the T4 exception keeps it compact (28, above 24). Whether it grows to `default` on touch, as the nph-popover footer does, goes to the design owner in the next approval round; until then it stays compact.

## Why it is ready
The 10 `resizable/*` tokens and the semantic `color/border-strong` came with this task and are on `v/5.0.0`: 9 aliases of semantics (one of them, `color/border-strong`, new in this task), and `resizable/focus-border-width` straight to `core/focus-width/sm` by decision (no semantic has the function of a 2 px focus border), as `tree/focus-border-width`. No new value entered the core. Every piece it uses is done: `nph-icon` (DSA-03), `nph-button` (DSA-13), the icon-only nph-button (DSA-43), the secondary icon-only nph-button (DSA-64). The examples use nph-skeleton (DSA-26, done) as panel content only.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not add a collapsed variant, a mobile layout or a second handle size in v1. It does not add the dotted `grip` icon to nph-icon: that comes later, in its own task, and then replaces the rotated `grip-vertical`.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `1626:34`, documentation frame `5123:2641`, root `5112:1850` and the evidence of the `figma-docs-accepted` gate
- Component sets: nph-resizable `5112:1849`; nph-resizable handle `5099:172`
- WAI-ARIA APG, Window Splitter: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- WAI-ARIA APG, focusability of disabled controls: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols
- WAI-ARIA 1.2, separator: https://www.w3.org/TR/wai-aria-1.2/#separator
- WCAG 2.2, target size (minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2, dragging movements: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- react-resizable-panels: https://github.com/bvaughn/react-resizable-panels
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-button.md`, `fichas/nph-icon.md`
