```json
{
  "id": "DSA-94",
  "goal": "Implement the nph-tree-select, a form field that opens a panel with a tree to choose one item or several from data in levels, in the contract accepted in Figma, with the error row of the nph-tree group and the dark background of the nph-skeleton that it needs, and write the spec.",
  "phase": "F4",
  "approved_order": 930,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-tree-select",
  "dependencies": [
    "DSA-03",
    "DSA-08",
    "DSA-09",
    "DSA-17",
    "DSA-26",
    "DSA-28",
    "DSA-29",
    "DSA-31",
    "DSA-40",
    "DSA-46",
    "DSA-75"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-tree-select documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved; color/skeleton and skeleton/background are on v/5.0.0, and the eight tree-select/* tokens come with this task, as the evidence explains.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-94/figma-docs-accepted-2026-11-18.md",
      "result": "passed",
      "verified_at": "2026-11-18",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec of the nph-tree-select, the tree-select/* tokens, the error row of the nph-tree and the nph-skeleton background pass the proof commands and are merged into v/5.0.0.",
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
      "question": "In the single mode (the field is not editable), what does a character key do? The accepted documentation and its appendix do not say. Recommended: with the panel closed, the letter opens the panel and makes active the next visible item after the chosen one whose label starts with it (from the first item when there is no value); with the panel open, it moves the active item to the next visible item after it that starts with it. The search wraps around to the top, as the nph-select does (nph-select.ts lines 524 to 527). Letters typed quickly form a prefix, the same letter repeated cycles through the items that start with it, a Space inside a quick typed search is part of the search and does not choose (nph-select.ts lines 565 to 567), the search looks only at the visible items and does not open a closed branch, and the value changes only by the keys that choose (Enter, Space outside a typed search, Alt+Up). It follows the WAI-ARIA select-only combobox and tree view, the nph-select and the nph-tree. Alternative: also search inside closed branches and open the path to the match; no source read does it, it changes the tree without being asked, and the single with search mode already finds deep items. Until the design owner answers, the code follows the recommendation. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-18"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-94/figma-docs-accepted-2026-11-18.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-16.md, nph-tree-select: adjustment round with the corrections of the design owner (soft outline on the panel)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-17.md, nph-tree-select: green light (visual acceptance of the root 6339:6323), documentation and appendix built and reviewed",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-18.md, nph-tree-select: the 7 approval items answered by the design owner, all as recommended: documentation accepted, tree-select/panel-offset straight to core/space/100, descriptions of five semantics, the soft outline on the list of the family in a task of its own (DSA-95), the error row of the nph-tree group that wraps, color/skeleton and skeleton/background, and the gray arrow on the open branch"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7145-9081",
    "date": "2026-11-18",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-tree-select documentation frame (7145:9081, page 4128:35276) was accepted as the API and behavior specification of the nph-tree-select, with the visual acceptance of the root (6339:6323). COMPONENT_SET nph-tree-select (6339:8107), 42 variants; COMPONENT_SET of the panel (6339:8110), 6 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-18"
}
```

# DSA-94 — nph-tree-select, a field that opens a tree

## Goal
Three pieces of work, in the contract accepted in Figma:

- **The component** `nph-tree-select` in `src/components/nph-tree-select/`, with CSS, tests, stories and the spec `fichas/nph-tree-select.md`: a form field that opens a panel with a tree, to choose one item (single, single with search) or several (multiple) from data in levels.
- **The error row of the `nph-tree` group** (approval item 5): the row takes the width it has, and Try again drops below the message when it does not fit. The tree select needs it, because its panel is 280 wide.
- **The background of the `nph-skeleton`** (approval item 6): the shape moves from `color/muted` to `skeleton/background` → `color/skeleton`. The tree select needs it, because in dark the old shape vanished on the panel of the first load.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-94/figma-docs-accepted-2026-11-18.md`. It carries the Figma documentation converted to text, the tokens with light and dark values, the anatomy part by part, the default behavior with the source of each line, the combined states, the icon and image rules, the limits, the inherited decisions, the two shared pieces changed by the approval and the 7 decisions answered. There is no need to open Figma.

## Specification to follow closely

### Field
- **By mode**: single = the field of the `nph-select` (start icon `globe`); single with search = the field of the `nph-combobox` (start `magnifying-glass`, clear target with text); multiple = the field of the `nph-multi-combobox` (chips, counter mode, 420 wide). Width, height, border, background, focus, arrow area and chips come from those pieces, as the anatomy of the evidence lists by state.
- **Size**: `default` and `large`, as the `nph-select`. The panel and the items do not change with the size.
- **States**: default, hover, focus, error, error-focus, disabled and open. Open keeps the focus border on the field; in multiple, open is the focus with the chips. Disabled with a value keeps the value and the chips under `state/disabled-opacity`; error + disabled shows only the disabled look (T11).
- **Value**: one line with an ellipsis (DSA-29 D3). The field shows only the label of the chosen item; the whole path goes in the accessible name (decided on 2026-11-18: appendix pending 7, approved with the page).

### Panel
- **Tokens** (`tree-select/*`, see "Tokens that come with this task"): background `tree-select/panel-background`, outline `tree-select/panel-border-width` in `tree-select/panel-border`, corner `tree-select/panel-radius`, maximum height `tree-select/panel-max-height` (above it the tree scrolls inside the panel), width `tree-select/panel-width` in single and `tree-select/panel-width-multiple` in multiple (the field width of the mode, never narrower; if the page stretches the field, the panel takes the field width, with the token as the minimum), distance from the field `tree-select/panel-offset`. Shadow `elevation/dropdown`.
- **Inside**: the `nph-tree`, at the top, filling the width, with `tree/padding` around it. Single selection in single and single with search; multiple selection, with the cascade, in multiple.
- **Contents**: items; search (the filtered tree with the ancestors of every match visible); no result and empty (the `nph-empty` of the `nph-tree`); first load (the skeleton rows of the `nph-tree`); the branch that loads (spinner) and the branch error (the error row, below).
- **Position**: below the field, aligned to its start; with no room below, above, at the same distance (DSA-29 D-2). Motion as DSA-29 D2.

### Behavior
The default behavior table of the evidence, line by line: the keys to open, the active item when the panel opens (the chosen one, with the path open; else the first), moving in the tree, choosing and checking, typing and filtering, Esc, Alt+Up, Tab, click outside, focus on close, pointer and focus, window edge, loading and error, clear. DOM focus stays on the field while the panel is open; the active item of the tree is pointed to by `aria-activedescendant` (APG combobox with a tree popup). In multiple, Enter checks and the panel stays open; checking a parent checks its children; a parent with part checked is mixed; a whole branch checked shows one chip, the parent's.

### Accessibility
Field: role `combobox`, the name from the label of the `nph-field`, `aria-haspopup="tree"`, `aria-expanded`. Panel: role `tree`; in multiple, `aria-multiselectable`. Item: `treeitem`, the label as the name, `aria-expanded` on a branch, `aria-selected` in single and `aria-checked` (`mixed` on the mixed parent) in multiple. Icons `aria-hidden`. The active item draws the focus of the `nph-tree` item (see "Open points": it has no DOM focus).

## Tokens that come with this task

In `src/tokens/source/semantic.tokens.json`, a new block `tree-select` (Figma variables `VariableID:7324:34` to `VariableID:7324:41`):

| Token | `$type` | `$value` |
|---|---|---|
| `panel-background` | `color` | `{color.popover}` |
| `panel-border` | `color` | `{color.border-subtle}` |
| `panel-border-width` | `dimension` | `{border.width}` |
| `panel-radius` | `dimension` | `{radius.container}` |
| `panel-max-height` | `dimension` | `{layout.max-list-height}` |
| `panel-offset` | `dimension` | `{core.space.100}` |
| `panel-width` | `dimension` | `{layout.input-width}` |
| `panel-width-multiple` | `dimension` | `{layout.multi-combobox-width}` |

In the `$extensions` of the semantic layer, raise `expectedCount` by eight and add to the `origin` that the `tree-select/*` tokens were read from Figma on 2026-11-18: seven alias semantics, and `panel-offset` goes straight to `core/space/100` by decision (no semantic of 4 has the function of distance from the anchor: `space/inline-tight` and `space/stack-tight` are gaps, `radius/inner` is a radius, `focus/ring-width` is the halo width; the same path as `popover/offset`). Regenerate `src/tokens/generated/tokens.css`. No new `core` value.

**Why they did not go first.** The test "consumes every one of the twenty-five tree/* tokens" in `src/components/nph-tree/nph-tree.test.ts` (lines 1812 and 1820) collects every `--nph-tree-*` property of `tokens.css`, and `--nph-tree-select-panel-*` starts with that prefix. In the same work, that collection leaves out the tree select (for example `/(--nph-tree-(?!select-)[a-z0-9-]+):/g`), so the count of the tree stays the count of `tree/*`. The same path as DSA-93.

`design.md` already names these tokens, marked "DSA-94", in the `use` of `color/popover`, `color/border-subtle`, `color/input`, `color/dropdown-border`, `border/width`, `radius/container`, `layout/max-list-height`, `layout/input-width`, `layout/multi-combobox-width`, in the note of `tokens_core_space`, in the table of 2d and in the known limitation of section 3. When the tokens land, drop the mark "DSA-94" from those lines.

## Change in the `nph-tree`: the error row that wraps (approval item 5)

Figma `nph-tree / grupo`, `conteúdo=erro` (`5485:413`); the anatomy is in the evidence ("The two shared pieces changed by the approval").

- **CSS** (`src/components/nph-tree/nph-tree.css`, "the error row"): the row takes the width it has, with the minimum height `tree/item-height` and the height growing with the content. The message and Try again sit in one group that wraps, with gap `tree/item-gap` between them and between the lines. The message is never cut: `.error-text` loses the ellipsis and the one-line rule, and it wraps. When the message and the action do not fit on one line, Try again drops below the message, at the same start. The chevron target (24) and the error icon (`tree/icon-size`) keep their place, centered on the height of the row. At 360, a one-line row is the same as today.
- **Tests** (`src/components/nph-tree/nph-tree.test.ts`): "a branch that failed shows the error row…" and "the error row is aligned to the indent of the children" stay. Add: in a narrow tree (the 280 panel of the tree select), the whole message and the whole Try again are visible, Try again below the message; in a 360 tree, side by side, in one row of `tree/item-height`. The row keeps the hover and the focus of an item.
- **Texts**: `fichas/nph-tree.md` (the error state, the anatomy of the error row, the limits), `src/shared/metadata/nph-tree.json` regenerated from the spec (`node scripts/verificar-operacao.mjs --gerar-metadata`), the Storybook texts of the error row in `.storybook/i18n/en.json`, `es.json` and `pt-BR.json`, if they describe one line.
- **Order with DSA-93**: DSA-93 (ready) moves the focus of the `nph-tree` item and touches the same CSS and test file. The task that lands later rebases on the other. DSA-93 raises the `tree/*` count from 25 to 28; the change of the collection above keeps the tree select out in both orders.

## Change in the `nph-skeleton`: `skeleton/background` (approval item 6)

`color/skeleton` and `skeleton/background` are already on `v/5.0.0` (light `#EDEEEF`, dark `#3C444F`).

- **CSS** (`src/components/nph-skeleton/nph-skeleton.css`, line 22): the shape background moves from `--nph-color-muted` to `--nph-skeleton-background`; the header comment (line 6) too.
- **Tests** (`src/components/nph-skeleton/nph-skeleton.test.ts`): "every shape is color/muted, with no border" and "the color follows the scheme: color/muted in dark mode" (lines 133 to 153) read `--nph-skeleton-background`; the dark check also tells that the shape differs from `color/popover`. The token contract (line 226) lists `--nph-skeleton-background` in place of `--nph-color-muted`.
- **Texts**: `fichas/nph-skeleton.md` says "always uses color/muted" (today lines 37, 40, 47, 68, 81, 131, 138, 179, 215, 216 and 220): it becomes `skeleton/background` (`color/skeleton`), the same as before in light and one step up in dark so the block does not vanish on a floating panel; the contrast: 1.16:1 in light; in dark 1.29:1 over `color/popover`, 1.62:1 over `color/card`, 1.92:1 over `color/background`. Regenerate `src/shared/metadata/nph-skeleton.json`; the Storybook texts of the `nph-skeleton` that name `color/muted`. `design.md` already has `color/skeleton` and `skeleton/background`, and `color/muted` says the skeleton left it.
- **Effect on the other pieces**: every `nph-skeleton` changes only in dark (`nph-tree`, `nph-table`, `nph-data-table`, `nph-notification`, `nph-scheduler`, `nph-sidebar`). No other CSS changes. Search the repository for "skeleton" next to `color/muted` or `--nph-color-muted` (specs, stories, tests, `docs/decisoes-tecnicas.md`) and leave `docs/operacao/evidencias/` and the other tasks as history.

## Decisions open with the design owner
D-1 came up in the review of this task: the accepted documentation does not say what a letter does in the single mode. A market read (2026-11-18) backs the recommendation. Until the design owner answers, the code follows it; it does not block the pull request.

| ID | Question | Recommended | Until she answers, the code |
|---|---|---|---|
| D-1 | A character key in the single mode (field not editable) | Closed: the letter opens the panel on the next visible item after the chosen one that starts with it (from the first item with no value). Open: it moves the active item to the next visible item after it that starts with it. The search wraps around, as the nph-select. Quick letters form a prefix; the same letter repeated cycles; a Space inside a quick typed search is part of it, as the nph-select; only visible items, no closed branch opens; the value changes only by Enter, Space outside a typed search, or Alt+Up. | Follows the recommendation. |

Sources of D-1: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ (select-only combobox: a character opens and moves to the option that starts with it; in a tree popup, to the next node whose name starts with it) ; https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/ (the letter opens the list and moves the highlight; quick letters form a string; the same letter cycles; the value changes only on Space, Enter, Tab or blur) ; https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ (type-ahead recommended; quick letters search the whole string) ; `fichas/nph-select.md` line 229 ; `fichas/nph-tree.md` line 290. Ant Design (https://ant.design/components/tree-select), Mantine (https://mantine.dev/core/tree-select) and Kendo (https://www.telerik.com/kendo-angular-ui/components/dropdowns/dropdowntree/keyboard-navigation) do not document the letter; that does not prove they lack it. "Only visible items" is a deduction: the APG arrows move between nodes without opening them, and the nph-tree says "next visible item". Where the search starts when there is a value is not in the sources read (market read of 2026-11-18); the recommendation takes the "next" of the APG and the code of the nph-select, which starts after the active or the chosen option and wraps around (`src/components/nph-select/nph-select.ts` lines 524 to 527), and keeps a Space inside a typed search as part of it (lines 565 to 567).

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- **The tree as a popup**: the APG keeps DOM focus on the combobox and points to the active `treeitem` by `aria-activedescendant`. Today the `nph-tree` draws its rows in its own shadow root and moves the DOM focus between them (one Tab stop, `fichas/nph-tree.md` line 251), and its focus shows on `:focus-visible` (line 293). An `aria-activedescendant` (or `ariaActiveDescendantElement`, as `nph-select.ts` line 824) set on the field cannot point into the shadow root of another element. One path: as the list of the `nph-combobox` (P95, `nph-combobox.list.ts`, a module the owner draws in its own shadow root), the rows of the tree come as a module the tree select draws in its own shadow root; the other: the `nph-tree` gains a popup mode. In both, the active item draws the focus of the `nph-tree` item (the one of DSA-93, once it lands) by a state, not by `:focus-visible`, and the item keeps the hover rule (the focus wins). The spec names the path.
- **The field of each mode**: the field of the `nph-select`, of the `nph-combobox` and of the `nph-multi-combobox` (chips, counter). How the tree select reuses each one, with its tokens, sizes and states, without copying it: the spec names it.
- **Value and form**: the value of single (the item id) and of multiple (a list of ids); when a whole branch is checked, whether the value carries the parent or the leaves (the accepted root decided one chip for the parent and left the value to the code: appendix pending 2, resolved; the field shows one chip, the parent's). Removing that chip unchecks the branch. The spec names it.
- **Filter**: which text matches the typed text and how (the same rule as the `nph-combobox`, DSA-46), keeping the ancestors of every match visible and open; the first match becomes active (DSA-46 D-5).
- **Load on demand**: a branch with no loaded children inside the panel asks the page as the `nph-tree` does (`nph-tree-load`); how the tree select passes the event and the items on: the spec names it.
- **The whole path in the accessible name** (decided on 2026-11-18, appendix pending 7; only the "how" is open): how the field tells the path of the chosen item (for example "Documents, Contracts, Contract 2025.pdf") while it shows only the label. The spec names it.
- **Halo at the panel edge**: the focus of the tree item (after DSA-93) reaches 5 px outside the row; `tree/padding` is 4. The outer 1 px of the halo is clipped by the scroll box of the panel on the first and last rows, as the list of DSA-91 and the tree of DSA-93; Figma draws the same. The spec says it.
- **Accessibility of the loading and error inside the panel**: `aria-busy` on the tree in the first load and on the loading branch, as the `nph-tree`; Enter on the error row tries again while DOM focus stays on the field.
- **Letter search in single (D-1, open with the design owner)**: two details the sources read do not give, named by the spec: the time that keeps quick letters together (the nph-select uses 500 ms, `TYPEAHEAD_MS`, `nph-select.ts` line 88); and which items count as visible when the panel is closed (recommended: the tree as it will open, with the path to the chosen item open, as the "Focus on open" row of the evidence).
- The translation strings of any hidden text the spec adds: their keys and where they sit. The spec names them.

## Why it is ready
The approval page of 2026-11-18 answered the 7 items, all as recommended. D-1 (a letter in the single mode) is open with the design owner and does not block: the code follows the recommendation. `color/skeleton` and `skeleton/background` are on `v/5.0.0`; the eight `tree-select/*` tokens are in Figma and in this task, with the reason they come with the code. No new `core` value. Every piece it uses is done: `nph-icon` (DSA-03), `nph-tooltip` (DSA-08, DSA-42, DSA-48), `nph-spinner` (DSA-09), `nph-checkbox` (DSA-17), `nph-skeleton` (DSA-26), `nph-field` (DSA-28), `nph-select` (DSA-29), `nph-multi-combobox` (DSA-31), `nph-empty` (DSA-40), `nph-combobox` (DSA-46), `nph-tree` (DSA-75). DSA-93 (focus of the tree item, ready) is not a dependency: the tree select takes the focus of the tree item, whatever it is at merge time.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec, the `tree-select/*` tokens, the error row of the `nph-tree` and the background of the `nph-skeleton` pass the proof commands in `docs/operacao/component-handoff.md` (`build:tokens` and `test:tokens` included); the whole test suite passes; in Storybook the panel, the error row at 280 and 360 and the skeleton on the panel show in the seven brands, light and dark; the work is merged into `v/5.0.0`.

## What this task does not do
It does not create a token beyond the eight `tree-select/*` of the table, and it changes no token value. It does not change Figma. It does not change the outline of the option list of the `nph-select`, the `nph-combobox` and the `nph-multi-combobox`: that is DSA-95. It does not change the distance of the `nph-select` list (`space/inline-tight`, DSA-29 D1). It does not move the focus of the `nph-tree` item: that is DSA-93. It does not build the tree table. It does not add a highlight of the searched part or a "+N" chip (decided on 2026-11-18, appendix pending 3 and 6: not in the v1), a small size or a warning status (out of the v1, in the out-of-scope list of the matrix).

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `4128:35276`: documentation frame `7145:9081`, root `6339:6323`, appendix `7149:38729` and the evidence of the `figma-docs-accepted` gate
- Component sets: `nph-tree-select` `6339:8107`; panel `6339:8110`; `nph-tree / grupo` error `5485:413`; `nph-skeleton` `1578:37`
- WAI-ARIA APG, combobox: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WAI-ARIA APG, tree view: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2, reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `docs/operacao/tarefas/DSA-93.md`: the focus of the `nph-tree` item and the reason its tokens came with the code
- `design.md` — the tokens named in the evidence
- `fichas/nph-tree.md`, `fichas/nph-skeleton.md`, `fichas/nph-select.md`, `fichas/nph-combobox.md`, `fichas/nph-multi-combobox.md`, `fichas/nph-field.md`, `fichas/nph-checkbox.md`, `fichas/nph-empty.md`, `fichas/nph-tooltip.md`
