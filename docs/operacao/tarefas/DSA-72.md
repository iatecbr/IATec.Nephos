```json
{
  "id": "DSA-72",
  "goal": "Implement the nph-sidebar, the main navigation menu of a product, in the contract accepted in Figma, move the focus border of nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button to focus/border, and write its spec.",
  "phase": "F4",
  "approved_order": 710,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-sidebar",
  "dependencies": [
    "DSA-03",
    "DSA-13",
    "DSA-16",
    "DSA-26",
    "DSA-43",
    "DSA-48",
    "DSA-53",
    "DSA-62"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-sidebar documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-72/figma-docs-accepted-2026-11-10.md",
      "result": "passed",
      "verified_at": "2026-11-09",
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
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "The collapse button icon is sidebar (Font Awesome, light), and it is not in nph-icon yet. Adding it to nph-icon is a foundation task that is not open. Until then, the code keeps the place of the icon and does not invent another icon. Indiane frees the foundation task. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-10"
    },
    {
      "id": "D-2",
      "question": "In dark, the logo shows its light version. The brand has not confirmed which version of the logo goes on a dark background. Indiane confirms it with the brand. It does not block the pull request; the dark logo does not ship until it is confirmed.",
      "decider": "indiane",
      "opened_at": "2026-11-10"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-72/figma-docs-accepted-2026-11-10.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-09.md, nph-sidebar: visual acceptance, Figma UX QA and textual audit approved, documentation accepted (item 6), and items 7 to 21 of the approval page approved (color/primary-text on the active item, the open group and the flyout title; active rail button and corner button on color/primary and color/primary-foreground; sidebar/flyout-border on color/border-subtle; sidebar/scrim; sidebar/mobile-offset; focus/border on the approved pieces; label without uppercase; open option only with options; the sidebar icon in nph-icon; radius exceptions; descriptions and missing tokens; cleanup; the logo in dark with the brand)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-10.md, the second step of the nph-sidebar released by Indiane, and the flyout panel radius at 12 (sidebar/flyout-radius, as nph-dropdown-menu)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4633-27036",
    "date": "2026-11-09",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-sidebar documentation frame (4633:27036, page 1367:2) was accepted as the API and behavior specification of nph-sidebar. COMPONENT_SET nph-sidebar (4605:9647), 6 variants; the flyout panel (4605:9612); the flyout option set (4605:9599), 11 variants; the logo set (4605:9589); the label set (4605:9594). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-10"
}
```

# DSA-72 — nph-sidebar, the main navigation menu of a product

## Goal
The `nph-sidebar` exists in `src/components/nph-sidebar/`, with a spec, tests and stories, in the contract accepted in Figma: the main navigation of a product in a column on the left, in three modes (expanded, collapsed, mobile) and two states (ready, loading), with a flyout panel next to the opener for the second level of the collapsed menu and for the third level. The focus border of nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button moves from `color/primary` to `focus/border`.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-72/figma-docs-accepted-2026-11-10.md`. It carries the Figma documentation converted to text, with the tokens of each part, the default behavior, the limits and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Modes**: expanded (`sidebar/panel-width`, full logo, search and names), collapsed (`layout/sidebar-collapsed`, logo mark, rail buttons with a tooltip, corner button as an icon, no search) and mobile (the expanded menu over the screen, below 768 px, with the close button). States: ready and loading (nph-skeleton in place of the items).
- **Parts**: panel, logo, collapse button, search (nph-input), one separator, navigation (the only part that scrolls), group label (`text/heading-2xs`, no uppercase) and the optional corner button (nph-button primary solid; nph-icon-button solid when collapsed). Booleans: collapse button and corner button, both on by default.
- **Flyout panel**: corners `sidebar/flyout-radius` (12); opens next to whoever opened it, 8 px to the side, top aligned, with the opener name as the title; options with options show `chevron-right` and open the third level next to them. The open state exists only on an option with options.
- **Keyboard and roles** (APG Disclosure Navigation, Dialog Modal on mobile): Tab in reading order; Enter or Space opens a group or a flyout with `aria-expanded` and `aria-controls`; Esc closes the flyout and returns the focus to the opener, and on mobile closes the menu; focus trapped while the mobile menu is open; the current item carries `aria-current="page"`; the menu is a named navigation landmark.
- **Colors**: the active item, the open group, the flyout title and the active option on `color/primary-text`; the active rail button and the corner button on `color/primary` with `color/primary-foreground`, with no override on the corner button; the flyout border on `sidebar/flyout-border`; the mobile scrim on `sidebar/scrim`.
- **Focus**: `focus/border` on every focusable piece of the menu, including the item, subitem and rail button already in the code (DSA-53), the flyout option, and the collapse and close buttons. The corner button keeps the default focus of nph-button; the search already uses `focus/border` in nph-input. Today nph-button (and nph-icon-button, which is nph-button with an icon only) fixes its focus border per severity on `:host` (`color/primary` for primary). This task may add one minimal public focus hook to nph-button, such as a CSS custom property that the sidebar sets to `focus/border`, only for this. The default focus of nph-button and nph-icon-button does not change.
- **Combined states** (rule T11): option active + open keeps the active look and the arrow; active + disabled keeps the active look under `state/disabled-opacity`; active + hover keeps the active look with the hover background.
- **Inherited decisions**: the accepted Figma answers DSA-53 D-1 to D-4 (counter on the top end corner, at x 19 and y -4 on a 40 px button; outline of the active counter 4 px in `sidebar/panel-background`, decorative and not tied to the focus ring; more actions as nph-icon-button secondary ghost compact; a subitem with options opens the third level as a disclosure with `aria-expanded` and `aria-controls`). The item, subitem and rail button change where DSA-53 shipped otherwise. The tooltip and the cut label follow DSA-48 D1 and D2 (keyboard focus opens at once); reduced motion follows DSA-62 D-3.
- **Behavior the Figma does not draw**: the evidence marks it *(APG default, not in Figma)*: click outside, Tab order, hover does not open a flyout, focus on open, one flyout per level, Esc closes the innermost, the panel stays inside the screen, the flyout closes the tooltip, `aria-busy` while loading, limits and combined states. The mobile mode starts below `breakpoint/md` (768).
- **Icon and image**: every icon from nph-icon (item icons light at rest and solid when active, `chevron-right`, `xmark`, `sidebar` light per D-1, `plus` light on the collapsed corner icon button; the expanded corner button has no icon); the logo is an image of the brand library, not exported by Nephos (D-2).

## Open points for the code
- The flyout title as a property of the flyout (in Figma it comes from the nested label).
- The flyout width: Figma draws it fixed at 220 px with no token; the code decides the minimum and maximum. A width token goes to the next Figma batch.
- Which screen edges `sidebar/mobile-offset` applies to: the Figma says only "away from the screen edge"; the code decides.
- The accessible name of the collapsed corner icon button: not in Figma; the code repeats the label of the expanded corner button in `aria-label`.
- Arrow keys between items, and the number of skeleton rows while loading.
- How the product passes the current item and the mode, and whether the component remembers the mode or the product does.
- The keyboard shortcut to collapse (Ctrl or Cmd + B), if the API offers it.
- The empty and error messages: who provides and translates them.
- The strength of the mobile scrim in dark (`overlay/scrim` on a dark screen).
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.

## Why it is ready
The `sidebar/*` tokens came with this task and are on `v/5.0.0`: the active rail pair and the flyout border now on their new aliases, `sidebar/scrim`, `sidebar/mobile-offset`, `sidebar/flyout-radius` (12, as nph-dropdown-menu), and `sidebar/panel-width` (alias of `layout/sidebar-expanded`), `sidebar/rail-padding`, `sidebar/logo-max-height` and `sidebar/logo-mark-size`, which Figma had and the code did not, with `core/space/500`, `core/layout-height/sidebar-logo` and `core/layout-height/sidebar-logo-mark`. `core/layout-width/sidebar-collapsed` and `core/layout-width/sidebar-expanded` now have the Figma values, 80 and 256. No new semantic token: `color/primary-text` is already on `v/5.0.0`. The pieces inside are done: nph-icon (DSA-03), nph-button (DSA-13), nph-input (DSA-16), nph-skeleton (DSA-26), nph-icon-button (DSA-43), nph-tooltip (DSA-48) and nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button (DSA-53).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change nph-icon, nph-input, nph-skeleton or nph-tooltip. In nph-button and nph-icon-button it only adds the focus hook described above, with no change to their default. It does not add the sidebar icon to nph-icon (D-1).

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Sidebar` (`1367:2`), documentation frame `4633:27036`
- Component sets: `nph-sidebar` `4605:9647`, `nph-sidebar-flyout` `4605:9612`, `nph-sidebar-flyout-option` `4605:9599`, `nph-sidebar-logo` `4605:9589`, `nph-sidebar-label` `4605:9594`
- WAI-ARIA APG, Disclosure Navigation Menu: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
- WAI-ARIA APG, Dialog (Modal): https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
