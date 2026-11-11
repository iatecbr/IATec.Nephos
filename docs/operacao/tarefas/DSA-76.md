```json
{
  "id": "DSA-76",
  "goal": "Implement the panel menu navigation mode of the nph-sidebar, an accordion where the third level opens in place, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 750,
  "owner": "elvys",
  "state": "blocked",
  "piece": "nph-sidebar",
  "dependencies": [
    "DSA-26",
    "DSA-48",
    "DSA-53",
    "DSA-72"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The panel menu documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-76/figma-docs-accepted-2026-11-11.md",
      "result": "passed",
      "verified_at": "2026-11-11",
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
  "blockers": [
    {
      "id": "B-1",
      "description": "The panel menu is a navigation mode of the nph-sidebar, and DSA-72 (nph-sidebar) is not merged yet.",
      "owner": "elvys",
      "what_resolves": "DSA-72 is merged into v/5.0.0 and goes to done; this task then goes to ready, with no other change.",
      "opened_at": "2026-11-11"
    }
  ],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-76/figma-docs-accepted-2026-11-11.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-11.md, panel menu: visual acceptance, Figma UX QA and textual audit approved, documentation accepted (item 1), and items 2 to 8 of the approval page approved (panel-menu/nest-gap on core/space/300, panel-menu/label-gap on space/stack-snug, a navigation mode of the nph-sidebar with no new public tag, it enters v1 as a mode of the nph-sidebar in a new task linked to DSA-72, the group of the current page and its parents are born open, collapsed and mobile follow the nph-sidebar, several groups open at once); item 9 had no decision, it is only a record"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5928-2591",
    "date": "2026-11-11",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The panel menu documentation frame (5928:2591, page 4128:29872) was accepted as the API and behavior specification of the panel menu navigation mode of the nph-sidebar. COMPONENT_SET nph-panel-menu subgroup set (5607:97) and COMPONENT_SET nph-panel-menu (5608:168). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-11"
}
```

# DSA-76 — the panel menu, a navigation mode of the nph-sidebar

## Goal
The panel menu navigation mode exists in the `nph-sidebar` (`src/components/nph-sidebar/`), with spec, tests and stories, in the contract accepted in Figma: the navigation of the expanded sidebar as an accordion, with groups that open and close in place up to the third level, with no side panel. It is a mode of the navigation of the `nph-sidebar`, with no new public tag. It is linked to DSA-72 (nph-sidebar) and is a new task, not a change of DSA-72.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-76/figma-docs-accepted-2026-11-11.md`. It carries the Figma documentation converted to text, with the tokens of the family, the default behavior, the combined states, the inherited decisions, the icon rules and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Parts**: the main list and then each section; in the open group, from start to end, the indent, the group line and the column of items; in the subgroup, the label and the arrow. Item, subitem and section label come by instance of the approved `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-label`, with their own properties and tokens. The subgroup is new: a button of the second level that opens the third level in place, 36 high, with the label at the start and the arrow (`chevron-down` closed, `chevron-up` open) at the end. The panel menu has two states, ready and loading; the subgroup has the open property (no, yes) and four states (rest, hover, focus, disabled).
- **Where it lives**: in the place of the navigation list of the expanded `nph-sidebar`, when the destinations reach the third level. It has no background, border or margin of its own: it lives on `sidebar/panel-background` and fills the useful width of the sidebar (206 in the preview: 256 − 2 × 24 − 2 × 1). Top and bottom belong to the sidebar, and the navigation scrolls between them. Collapsed and mobile are modes of the `nph-sidebar` (DSA-72) and the panel menu follows them.
- **Difference from today's mode of the sidebar**: there, the sub item with options opens the third level in a panel at the side; here, the subgroup opens the third level in place. In both, the button carries `aria-expanded` and `aria-controls`.
- **Group and subgroup are categories**: they open and close and never go to a page. If a category needs a page, put a link inside it. A group that is also a link is not allowed: the click opens and closes.
- **Open groups**: several groups stay open at once; opening one does not close the others. The group of the current page and its parents are born open; if the person closes one of them, it stays closed, with no new mark.
- **Subgroup** (bind every value to its `panel-menu/subgroup-*` and `panel-menu/focus-*` token, never to the semantic it points to; the evidence table lists them): area of 36 filling the column, with 10 on the sides and 8 on top and bottom, corner 12, 8 between the label and the arrow. Label in `text/body-md` and `panel-menu/subgroup-foreground` when closed; `text/label-md` and `panel-menu/subgroup-foreground-open` when open (the arrow follows the color of the label). Hover paints the background (`panel-menu/subgroup-background-hover`) and does not move the focus. The focus is a 1 px border in `panel-menu/focus-border`, 1 px outside the area (corner 13), and a halo of 4 in `panel-menu/focus-ring` outside the border (corner 17); no frame cuts the ring.
- **Levels** (bind to `panel-menu/nest-padding`, `panel-menu/guide-*`, `panel-menu/nest-gap`, `panel-menu/item-gap`, `panel-menu/section-gap` and `panel-menu/label-gap`): in each level below the first, the indent of 10 puts the group line where the icon of the item above starts; the line is 1 px; the column of items is 12 from it. The text of the sub item starts 33 from the edge in the second level and 56 in the third (the third level repeats the recipe of the second, with the line, plus 23).
- **Loading**: the panel menu in loading swaps the list for nph-skeleton rows, one per first-level item, in the same place, with no section label, with no focus and out of the Tab order, with `aria-busy`.
- **Keyboard and roles** (WAI-ARIA APG disclosure navigation, with no deviation): `nav` with `aria-label` (for example "Main navigation"); group and subgroup are `button` with `aria-expanded` and `aria-controls`; the closed list stays with `hidden`; the current page carries `aria-current="page"`, one per page; icons and arrow are `aria-hidden`; no `role="menu"` and no `role="tree"`. Tab and Shift+Tab pass through the visible buttons and links in the order of the list; Enter and Space open and close the group and the subgroup and keep the focus on the button; Enter follows the link, and Space does not. The arrows, Home and End are not used (optional in the APG). Esc does nothing: the open block grows in place and is not a layer. A click outside closes nothing.
- **Cut text**: the label is cut on one line with an ellipsis; the nph-tooltip shows the whole text on hover, after `motion/hover-delay`, and on focus, with no wait; a click cancels the wait.
- **Movement**: the arrow turns 180 degrees and the block grows in place in `panel-menu/expand-duration` and `panel-menu/expand-easing`; with reduced motion, nothing moves. It does not use `motion/enter-*` and `motion/exit-*`, which are for a layer that appears on top.
- **Combined states** (rule T11): open + disabled keeps the open label (`text/label-md`, `sidebar/item-foreground-open`) and the arrow up under `state/disabled-opacity`; open + hover keeps the open and adds the hover background; error does not apply (the menu has no error); current + disabled does not apply (the current page is not disabled, and the subgroup has no active state).
- **Inherited decisions**: follows DSA-36 D2 (and T13), DSA-62 D-1, D-3 (arrow turns and, with reduced motion, nothing moves) and D-5, DSA-48 D1, DSA-53 D-3 and D-4 and DSA-72; deviates from DSA-62 D-3 in the entry (the block grows in place with `motion/expand-*`, not with `motion/enter-*`); does not apply DSA-62 D-4 (the panel menu opens and closes by click). Open in DSA-62: D-2 (current of the trigger derived from the current link); the panel menu treats the point as answered by its own rule (the group of the current page is born open).
- **Icon and image**: `chevron-down` (closed) and `chevron-up` (open) of nph-icon, light in both, at `panel-menu/subgroup-icon-size` (on `icon/size-sm`), in `panel-menu/subgroup-foreground` and `panel-menu/subgroup-foreground-open`, the color of the label, `aria-hidden`; the item icon is the approved one (`icon/size-md`, solid in the open group and in the current). No image.
- **Depth and limits**: up to three levels; more levels ask for another screen or tabs. With two levels or fewer than five destinations, use the `nph-sidebar` without the panel menu. With many items, the navigation scrolls inside the `nph-sidebar` and the item does not shrink. The label is cut on one line with an ellipsis, and the `nph-tooltip` shows the whole text.
- **Outside the component**: the item, subitem and section label keep their own tokens and focus (`focus/border`); the more-actions button of the item is the `nph-icon-button` secondary ghost compact of the approved item.

## Open points for the code
- How the mode is chosen in the `nph-sidebar` (property, slot or attribute) with no new public tag, and how the host tells which page is the current one.
- How the open groups are controlled: the initial state (group of the current page and parents open), the toggling by click and keyboard, and how the code can control which stay open.
- `aria-controls` and `hidden` on the closed block; the Tab order and what stays out of it (closed block, disabled item, loading rows).
- How the block grows in place (`panel-menu/expand-duration`, `panel-menu/expand-easing`) and how reduced motion removes the movement.
- How the nph-tooltip opens on hover with the delay and on focus at once, with the click that cancels the wait.
- The loading state and the texts the host provides and translates.
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.

## Tokens that stay without a component token
The pieces by instance use their own tokens: the item, the sub item and the section label of the `nph-sidebar`, the `nph-skeleton`, the `nph-tooltip` and the `nph-icon`, except the overrides of the panel menu: the size and the color of the subgroup arrow (`panel-menu/subgroup-icon-size`, `panel-menu/subgroup-foreground`, `panel-menu/subgroup-foreground-open`) and the size of the icon place in the loading row (`panel-menu/skeleton-icon-size`). The typography of the label comes from the text styles (`text/body-md`, and `text/label-md` in the open subgroup). The panel menu has no shadow style.

## Why it waits
This task is `blocked` only until DSA-72 is merged: the panel menu is a mode of the `nph-sidebar`, which is built in DSA-72. Everything else is ready.

The 29 tokens (`panel-menu/*`) came with this task and are on `v/5.0.0`. They are all aliases of semantic tokens, except `panel-menu/nest-gap` on `core/space/300`, by decision. No new value entered the core. The pieces inside are done: nph-sidebar-item and sub item (DSA-53), nph-skeleton (DSA-26) and nph-tooltip (DSA-48); the nph-sidebar (DSA-72) is the open dependency.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not create a new public tag. It does not change the collapsed and the mobile modes of the `nph-sidebar`, nor the items, sub items and section labels already approved.

## Outside this task
The `nph-sidebar` (DSA-72) binds the gap between the group line and the items of the second level to `space/control-padding`, and the gap between the section label and the items of the System group to `space/inline`. The panel menu binds the same distances to `core/space/300` (`panel-menu/nest-gap`) and to `space/stack-snug` (`panel-menu/label-gap`): the same pixel. Aligning the `nph-sidebar` to the panel menu is an open question and is not part of this task. Nothing was changed in the `nph-sidebar`.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, documentation frame `5928:2591`, appendix `5928:2867` and the evidence of the `figma-docs-accepted` gate
- Component sets: subgroup `5607:97` and panel menu `5608:168`
- WAI-ARIA APG, Disclosure Navigation: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
- WAI-ARIA APG, Tree View, navigation example: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/
- PrimeNG, Panel Menu: https://primeng.dev/panelmenu
- shadcn/ui, Sidebar: https://ui.shadcn.com/docs/components/sidebar
- WCAG 2.2: Contrast (Minimum), Non-text Contrast, Use of Color, Target Size (Minimum) and Animation from Interactions
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
