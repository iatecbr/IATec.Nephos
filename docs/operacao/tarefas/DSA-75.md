```json
{
  "id": "DSA-75",
  "goal": "Implement the nph-tree, a list in levels to open and close branches and to choose one item or several, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 740,
  "owner": "elvys",
  "state": "in-progress",
  "piece": "nph-tree",
  "dependencies": [
    "DSA-03",
    "DSA-09",
    "DSA-17",
    "DSA-26",
    "DSA-40",
    "DSA-48"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-tree documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-75/figma-docs-accepted-2026-11-11.md",
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
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "Should the Tree Table reuse the cell of the tree of nph-table (Figma 2571:66335, already a treegrid) and keep it apart from the nph-tree, or should the two be unified? Recommended: keep both, because the row of a table has cells and widgets and the treeitem does not. It does not block this task: it is decided in the plan of the Tree Table.",
      "decider": "indiane",
      "opened_at": "2026-11-11"
    },
    {
      "id": "D-2",
      "question": "The disabled item receives focus by the arrows (APG, focusability of disabled controls), and Figma has no disabled-with-focus variant. Does the focus border fade with the item under state/disabled-opacity, or stay on top at full opacity? Recommended: on top, at full opacity, because WCAG 2.4.7 asks for a visible focus indicator and has no exception for inactive items, while the faded item stays exempt from contrast (WCAG 1.4.11). Until decided, draw the border on top at full opacity; it is a visual detail and does not block the build of the other states.",
      "decider": "indiane",
      "opened_at": "2026-11-11"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-75/figma-docs-accepted-2026-11-11.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-11.md, nph-tree: visual acceptance, Figma UX QA and textual audit approved, documentation accepted (item 1), and items 2 to 16 of the approval page approved (chevron of the selected item on color/primary-text, icon of the folder and of the file on color/muted-foreground and color/primary-text when selected, the uses outside the description and the new descriptions, item height 36, hover on color/accent, focus inside the row, hover that does not move the focus, error row inside the group, spinner in place of the chevron and skeleton only on the first load, no depth limit, no guide lines, focus over hover, indent 24, the checkbox with its own hover); pending point 7 stays open"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5876-216753",
    "date": "2026-11-11",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-tree documentation frame (5876:216753, page 1626:35) was accepted as the API and behavior specification of nph-tree. COMPONENT_SET nph-tree item set (5485:350), COMPONENT_SET nph-tree group set (5485:421) and COMPONENT_SET nph-tree (5485:766). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-75-tree", "commit": null, "pr": 167 },
  "context": "docs/operacao/contextos/DSA-75.md",
  "updated_at": "2026-11-11"
}
```

# DSA-75 — nph-tree, the list in levels

## Goal
The `nph-tree` exists in `src/components/nph-tree/`, with a spec, tests and stories, in the contract accepted in Figma: a list of items in levels, each branch opens and closes, and the person chooses one item or several. It has three parts, the item (`nph-tree-item`), the group of children (`nph-tree-group`) and the tree (`nph-tree`).

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-75/figma-docs-accepted-2026-11-11.md`. It carries the Figma documentation converted to text, with the tokens of the family, the default behavior, the combined states, the limits, the inherited decisions, the icon rules and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Parts**: the item (chevron target, checkbox, icon, label, selection bar, focus border), the group (the children of an open branch, with the indent of one level, or the skeleton rows, or the error row) and the tree (the items in the three selection modes, or the empty state). The item has three types, closed branch, open branch and leaf, and eight states: default, hover, focus, selected, selected with focus, disabled, selected disabled and loading (the open branch only). The tree has three selections (none, single, multiple) and two contents (items, empty).
- **Chevron and row**: the chevron opens and closes the branch; the rest of the row selects; with no selection, a click on the row opens and closes the branch. In single selection the chosen item takes the background, the bar on the left and the label in medium weight. In multiple selection the checkbox of each item marks, and the parent shows mixed when part of the children is checked. The leaf keeps the place of the chevron empty so the labels line up.
- **Hover and focus**: hover paints the background (`color/accent`) and the label (`color/accent-foreground`), and neither moves the focus nor selects. The focus is a border in `focus/border`, 2 px, drawn inside the whole row; the item with focus does not take the hover background, even with the pointer over it. On the selected item with focus the border covers the bar, and the selection stays by the background, the color and the weight of the label.
- **Loading and error**: a branch with no loaded children goes to loading, with `aria-busy`, and the nph-spinner sm replaces the chevron. The first load of the tree shows three nph-skeleton rows in the root group, each at the height of the item. If the load fails, the error row enters the group, aligned to the indent of the children, with `triangle-exclamation`, "Couldn't load." and "Try again"; "Try again" is the action of the treeitem itself and Enter on it tries again; the name read is "Couldn't load. Try again".
- **Keyboard and roles** (WAI-ARIA APG tree view, WCAG 2.2): one Tab stop; the focus goes to the selected item, or to the first. Down and Up move through the visible items, and pass through the disabled item (focus with `aria-disabled`, no action). Right opens a closed branch, or goes down to the first child; Left closes an open branch, or goes up to the parent. Home and End go to the first and the last visible item; asterisk opens all the siblings; a letter goes to the next label that starts with it. Enter does the default action (selects in single, opens or closes in none, tries again on the error row; in multiple, opens or closes the branch and checks the leaf); Space checks and unchecks in multiple and selects in single. Roles `tree`, `treeitem` and `group`; `aria-expanded` on the branches; `aria-selected` in single and `aria-checked` in multiple, never both; `aria-multiselectable` in multiple; `aria-level`, `aria-setsize` and `aria-posinset` when not every node is loaded. The tree has a name by `aria-label` or `aria-labelledby`.
- **Screen reader and cut text**: each item is read by its label; chevron and icon are `aria-hidden`. The label is cut on one line with an ellipsis; the nph-tooltip shows it whole on the focus of the item, at once, and on hover, after `motion/hover-delay`; the whole text reaches the screen reader.
- **Movement**: the chevron turns 90 degrees in `motion/expand-duration` and `motion/expand-easing`; with reduced motion, it swaps with no turning.
- **Combined states** (rule T11): selected + disabled keeps the background, the bar and the label under `state/disabled-opacity`, with the whole item faded; in multiple selection the checkbox of the disabled item stays in its default state with the checked mark kept, and only the opacity of the item fades the box, once. Error + disabled does not apply: the item has no error state.
- **Inherited decisions**: follows DSA-29 D-3 and D3, and D5 in part; does not follow DSA-29 D5 on the item active by keyboard (the focus wins over the hover); follows DSA-45 D-5 in part; does not follow DSA-45 D-6 (the hover does not move the focus in the tree); follows DSA-36 D2, DSA-72 and DSA-62 D-3 in principle. Open from other tasks: DSA-17 D7 (hover of the checked checkbox) and DSA-45 D-3 (the box takes its own hover on the hover of the item), which the tree inherits as they are.
- **Icon and image**: `chevron-right` and `chevron-down`, `folder`, `folder-open` and `file` of nph-icon, light, at `icon/size-sm`, never changing weight; `triangle-exclamation` on the error row; nph-spinner sm in place of the chevron while loading. The icons are on every node of the tree or on none. The tree has no image.
- **Depth and container**: no depth limit in the component; the documentation asks to review the structure above five levels. The tree has no background, border or height of its own: it lives in a card, panel or popover, which gives the surface and the scroll. With many items, the container scrolls, the item does not shrink, and the item that scrolls to the edge shows with the focus border whole (WCAG 2.4.11).
- **Outside the component**: rename and delete go to the nph-context-menu opened by the item, and the row carries no button; the Tree Select and the Tree Table are other pieces.

## Open points for the code
- The API that sets the selection (none, single, multiple), the checked and mixed values, the expanded branches, the icon and the loading and error of each branch; and the events of open, close, select and try again.
- How load on demand is requested and answered (`aria-busy`, the first load of the tree, the error row) and how "Try again" reaches the host.
- The cascade of the selection in multiple selection, including the option to turn it off (`checkStrictly`) and how the disabled item stays out of the calculation.
- The hidden texts and the messages ("Couldn't load.", "Try again", the empty state "No items" and "This folder has no items yet."): who provides and translates them.
- How the nph-checkbox inside the item stays out of the Tab order while keeping its hover state on the hover of the row (`state=hover`), and how the checkbox takes its own hover (`color/input-hover`), which depends on the limit left open in DSA-45 D-3.
- How the nph-tooltip opens on the focus of the item and on hover with the delay, and how the focus border is kept whole when the container scrolls.
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- Focus on the disabled item: pending decision D-2 (border on top at full opacity, or faded with the item).
- The error row is a treeitem and takes the hover and the focus of the item; Figma has no separate state for it. This is derived from the WAI-ARIA APG tree view (every node in a tree or group is a treeitem), not drawn in Figma.
- Right-to-left writing: Figma draws only left-to-right (bar on the left, `chevron-right` when closed). If the host supports right-to-left, mirror the bar, the indent and the chevron, and swap the Right and Left arrows, as the APG asks.

## Tokens that stay without a component token
The pieces inside the item use their own tokens: nph-checkbox, nph-icon, nph-spinner, nph-skeleton, nph-empty and nph-tooltip. The exception is the color of the nph-icon in the chevron and in the folder and file icon: it comes from the tree, by `tree/toggle-foreground`, `tree/toggle-foreground-selected`, `tree/icon-foreground` and `tree/icon-foreground-selected`. The typography of the label comes from the text styles (`text/body-md`, and `text/label-md` on the selected item and on "Try again"). The movement of the chevron uses `motion/expand-duration` and `motion/expand-easing`. The tree has no shadow style and no focus halo.

## Why it is ready
The 25 tokens (`tree/*`) came with this task and are on `v/5.0.0`. They are all aliases of semantic tokens, except `tree/indent` on `core/space/600` and `tree/indicator-width` and `tree/focus-border-width` on `core/focus-width/sm`, by decision. No new value entered the core. The pieces inside are done: nph-icon (DSA-03), nph-spinner (DSA-09), nph-checkbox (DSA-17), nph-skeleton (DSA-26), nph-empty (DSA-40) and nph-tooltip (DSA-48).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change nph-checkbox, nph-icon, nph-spinner, nph-skeleton, nph-empty or nph-tooltip. It does not build the Tree Select nor the Tree Table, and it does not change the tree of nph-table. Pending point D-1 is decided in the plan of the Tree Table, not here; D-2 is a visual detail decided in Figma.

## Outside this task
Finding for the foundation, with no change here: `data-table/row-selected-indicator` on `color/primary` measures 2.86:1 over `color/primary-surface` in the Gerencial brand in dark, the same failure that took the tree to `color/primary-border`; the same holds for `dropdown/item-hover-icon-foreground` and for the check of the selected option of the nph-select. Nothing was changed in data-table, dropdown or select.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, documentation frame `5876:216753`, appendix `5876:217199` and the evidence of the `figma-docs-accepted` gate
- Component sets: item `5485:350`, group `5485:421`, tree `5485:766`
- WAI-ARIA APG, Tree View pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- WAI-ARIA APG, Focusability of disabled controls: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols
- Carbon, Tree view: https://carbondesignsystem.com/components/tree-view/usage/
- Primer, Tree view: https://primer.style/product/components/tree-view/guidelines/
- WCAG 2.2, Focus Visible: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- WCAG 2.2: Contrast (Minimum), Non-text Contrast, Use of Color, Focus Appearance, Focus Not Obscured and Target Size (Minimum)
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
