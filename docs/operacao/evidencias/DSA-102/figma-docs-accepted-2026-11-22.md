```json
{
  "task": "DSA-102",
  "gate": "figma-docs-accepted",
  "date": "2026-11-22",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7812-13461",
    "date": "2026-11-22",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-tree-table (green page 1626:47, root 7618:6203) and accepted its documentation frame (7812:13461), with the COMPONENT_SET nph-tree-table (7617:6784) and the branch error row set (7604:167). On the approval page of 2026-11-22 the design owner approved items 1 to 10: (1) root accepted; (2) documentation accepted; (3) the tree goes down to three levels; (4) the selection space of the error row takes the real width of the selection column, with no token of its own; (5) the error row has the height of the data rows; (6) tree-table/indent straight to core/control-height/compact, by decision; (7) tree-table/cell-padding-inline and tree-table/row-padding-block straight to core/space/300, by decision; (8) tree-table/row-height straight to core/space/800, by decision; (9) the focus radii stay on the focus semantics; (10) the changes the accepted proposals ask of other pieces (the tree cell state axis, the partial box on a row, the tree cell truncation), with the row hover of the table family, not a new one. The specification, converted to text, is below."
  }
}
```

# DSA-102 — `figma-docs-accepted`

The documentation of the nph-tree-table (frame `7812:13461`, page `1626:47`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `7618:6203`. The nph-tree-table is a data table whose rows have a parent and child hierarchy and the same data columns at every level. The first column carries the tree: an indent per level, the chevron that opens and closes the branch, and the text. The rest is the table of the `nph-data-table`: caption, toolbar, sortable header, selection box, footer with pagination, loading and empty by search. A branch whose children fail to load shows the branch error row in their place.

Its tokens came with this task and are on `v/5.0.0`.

Below, "Pend. N" names a point of the Figma appendix (the appendix leaves Figma in the cleanup; this evidence carries it). Every one of them is decided: by the proposals accepted with the root, or by an item of the approval page (see "Decisions answered"). No appendix point is open; the two cases with no drawing are the pending decisions D-1 and D-2 of the task (see "Limits").

What changed in the tokens with this task:

- New group `tree-table/*`, 20 tokens, all for the branch error row and for the row focus. 16 alias a token of the same function (rule 2 of T9). 4 point straight to the core by decision (rule 3 of T9), with no new value in the core:
  - `tree-table/indent` → `core/control-height/compact` (28), item 6: the level indent and the chevron space of the error row. The only semantic of 28 with a size function, `control/height-compact`, is "the control height in a dense screen", not an indent; the text role sizes of 12 and 28 (font size and line height of `text/*`) are typography, and the other tokens of 28 belong to other components. Precedent of an indent straight to the core: `tree/indent` → `core/space/600`.
  - `tree-table/cell-padding-inline` → `core/space/300` (12), item 7: the side padding of the error cell. `space/control-padding` (12) is the inner horizontal padding of a button, field and select; `space/inline-loose` (12) the gap between the actions of a footer; `layout/columns` (12) the grid count. All three refused by function; the text role sizes of 12 are typography.
  - `tree-table/row-padding-block` → `core/space/300` (12), item 7 with item 5: the breathing room above and below the error row. The same three semantics refused; `space/control-padding` is horizontal and does not cover the vertical breathing room.
  - `tree-table/row-height` → `core/space/800` (40), item 8: the minimum height of the error row, as `table/row-height`. No semantic is a row height: `avatar/size-lg` (40) is an avatar, `switch/track-width` (40) the switch track and `icon/duotone-opacity` (40, in Figma only; the code has no such token) an opacity. All three refused by function.
- Two tokens alias the table family on purpose (item 10, the hover of the design owner): `tree-table/row-background-hover` → `table/row-hover-background` and `tree-table/error-foreground-hover` → `table/foreground`. The chain is `tree-table` → `table` → semantic → core: the hover of the tree table is the row hover of the `nph-table` and of the `nph-data-table`, and it follows the family if the family changes. The `tree-table/*` token stays its own, so the error row can change without pulling the family (the trade-off of T9). A component token on another component token already exists (`panel-menu/subgroup-radius` on `sidebar/item-radius`). Only the hover follows the family: the rest background and the divider of the error row point to `color/background` and `color/border`, the same values as `table/background` and `table/border` today.
- No semantic changed value or description of function. `design.md` gains the nph-tree-table in the `use` of the semantics it binds (`color/background`, `color/foreground`, `color/border`, `focus/border`, `focus/halo`, `focus/ring-width`, `focus/border-radius-control`, `focus/radius-control-with-border`, `border/width`, `space/inline`, `space/inline-tight`, `status/error`, `icon/size-sm`), and the straight-to-core cases in the space and control height notes.

## Purpose

Data table with a hierarchy: each row can open its children without losing the columns, the selection, the sorting and the pagination of the table. The tree goes down to three levels, as the tree cell does; a screen that asks for four levels or more goes back to the UX review (item 3).

Selection of properties: nph-tree-table — state (default, loading, empty by search; default: default) and size (default, large; default: default). nph-tree-table branch error row — level (2, 3; default: 2), state (default, hover, focus; default: default), size (default: default) and selection (default: yes).

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| `nph-tree-table` | `7617:6784` | The table, 6 variants: state (`padrão` default, `carregando` loading, `vazio pela busca` empty by search) × size (default, large). Defaults: default, default. |
| `nph-tree-table / erro do galho` (branch error row) | `7604:167` | The error row, 12 variants: level (2, 3) × state (`padrão` default, `hover`, `foco` focus) × size (default, large); boolean property selection (`seleção`, on by default). Defaults: level 2, default, default, selection on. |

Root `7618:6203` (light `7618:6208`, dark `7618:7778`), documentation `7812:13461`, appendix `7816:17273` (it leaves Figma in the cleanup; this evidence carries it). Pieces by instance: `nph-data-table` (selection, header, loading, empty by search), `nph-table` (tree cell `2571:66335`, cell, composite cell), `nph-checkbox`, `nph-button` (icon only, ghost, compact, and its loading state), `nph-toolbar`, `nph-pagination`, `nph-select`, `nph-badge`, `nph-icon`, `nph-skeleton`, `nph-empty`, `nph-tooltip`.

## Tokens

Light and dark values are read in the `Sistemas` brand; the focus and the hover follow the active brand.

### `tree-table/*`

| Token | Points to | Value light · dark | Layer |
|---|---|---|---|
| `tree-table/focus-border` | `focus/border` | brand focus · `theme/brand-200` | focus border of the row and of the error row |
| `tree-table/focus-border-width` | `border/width` | 1 | focus border |
| `tree-table/focus-halo` | `focus/halo` | brand halo · dark halo | focus halo |
| `tree-table/focus-halo-width` | `focus/ring-width` | 4 | focus halo |
| `tree-table/focus-border-radius` | `focus/border-radius-control` | 7 | corners of the focus border |
| `tree-table/focus-halo-radius` | `focus/radius-control-with-border` | 11 | corners of the focus halo |
| `tree-table/indent` | `core/control-height/compact` (by decision) | 28 | level indent and chevron space of the error row |
| `tree-table/cell-padding-inline` | `core/space/300` (by decision) | 12 | sides of the error cell |
| `tree-table/row-padding-block` | `core/space/300` (by decision) | 12 | above and below the error row |
| `tree-table/cell-gap` | `space/inline` | 8 | inside the error cell, between the indent(s), the chevron space and the error block; the row itself has no gap |
| `tree-table/error-gap` | `space/inline-tight` | 4 | between icon, message and action |
| `tree-table/row-height` | `core/space/800` (by decision) | 40 | minimum height of the error row (a floor) |
| `tree-table/row-background` | `color/background` | `#FFFFFF` · `#0F1114` | error row background at rest and in focus |
| `tree-table/row-background-hover` | `table/row-hover-background` (→ `color/primary-surface`) | `#EBF2FE` · `#0C1A31` | error row background in hover |
| `tree-table/border` | `color/border` | `#C7C7C7` · `#6F7782` | divider at the base of the error row |
| `tree-table/border-width` | `border/width` | 1 | divider |
| `tree-table/error-icon-foreground` | `status/error` | `#B01E1E` · `#EA7D7D` (Figma) | `triangle-exclamation` icon |
| `tree-table/error-icon-size` | `icon/size-sm` | 16 | icon |
| `tree-table/error-foreground` | `color/foreground` | `#000000` · `#E3E3E3` (Figma) | message and action at rest and in focus |
| `tree-table/error-foreground-hover` | `table/foreground` (→ `color/foreground`) | `#000000` · `#E3E3E3` (Figma) | message and action in hover |

Every alias is the same in light and dark (no `modes` block); the value changes with the semantic. Where the Figma value and the code value differ in a brand tone, the code value counts (the contrast below is measured with the code values).

### Used directly or by instance, with no `tree-table/*` token

- **The table itself:** caption, toolbar, header, selection column, data rows, selected row, stripe, pagination, loading and empty by search are the `nph-data-table` and the `nph-table`, with their own tokens: `data-table/stack-gap` between caption, toolbar, table and footer; `table/cell-gap-tight` between the caption title and description, `table/caption-max-width`; `table/cell-gap` between the caption title and its badge; `table/foreground` (title, `text/heading-xs`) and `table/caption-foreground` (description, `text/body-sm`); `data-table/row-selected-background`, `data-table/row-selected-indicator` and `data-table/row-selected-indicator-width` (the 2 px bar at the start); `data-table/pagination-gap`, `data-table/page-size-label-foreground`, `data-table/page-size-width`; `data-table/empty-gap`, `table/empty-padding`.
- **The tree cell:** the `nph-table` tree cell, with `table/expand-indent` plus `table/cell-gap` per level below the first (36 px per level) and `table/cell-padding-inline` on its sides, in both sizes.
- **The row hover:** `table/row-hover-background` with the text in `table/foreground`, on the whole row, the tree cell included (item 10; the same hover as the `nph-table` and the `nph-data-table`).
- **Selection space of the error row** (item 4): in Figma, `data-table/selection-column-width` (48) in default; in large, `table/container-padding` on both sides and the box area in `core/target-size/minimum` (24), 56 in all; height `control/height-compact`. In the code it takes the real width of the selection column of the table, in both sizes, with no token of its own; the straight binding of the box area to `core/target-size/minimum` (a primitive with "do not consume directly") exists only in Figma.

## Anatomy, read part by part in Figma

Read by script, variant by variant, after the `tree-table/*` binding. "Horizontal" and "vertical" are the auto layout direction. Padding in the order top, right, bottom, left. Measures in px.

### Branch error row (`7604:167`)

One whole table row, its own part (not an instance):

| Layer | Direction and space | Measure | Token |
|---|---|---|---|
| the row (variant) | horizontal, gap 0; padding 12, 0, 12, 0; items at the start, vertically centered | default 806 × 53; large 830 × 53 (53 = 12 + 28 + 12 + 1 of the divider) | top and bottom padding `tree-table/row-padding-block`; minimum height `tree-table/row-height` (40, a floor); background `tree-table/row-background` (default and focus) or `tree-table/row-background-hover` (hover); divider only at the base, an inside stroke of 1 px (`tree-table/border`, thickness `tree-table/border-width`) |
| selection space | default: a fixed frame, no auto layout; large: horizontal, gap 0, padding 0, 16, 0, 16 | default 48 × 28; large 56 × 28 | default: width `data-table/selection-column-width`; large: sides `table/container-padding`; height `control/height-compact` in both. Its visibility is bound to the `selection` property (12 of 12). No `tree-table/*` token (item 4) |
| box area (large only, inside the selection space) | no auto layout | 24 × 28 | width `core/target-size/minimum` (Figma only; in code the real column width); height `control/height-compact` |
| error cell | horizontal, gap 8 between the indent(s), the chevron space and the error block; padding 0, 12, 0, 12; items at the start, vertically centered | default 758 × 28; large 774 × 28 | gap `tree-table/cell-gap`; sides `tree-table/cell-padding-inline` |
| indent | an empty frame | 28 × 28; level 2 = one indent, level 3 = two | width and height `tree-table/indent` |
| chevron space | an empty frame | 28 × 28 | width and height `tree-table/indent` |
| error block | horizontal, gap 4 between icon, message and action; padding 0; items at the start, vertically centered | 291 × 20 | gap `tree-table/error-gap` |
| error icon | `nph-icon` `triangle-exclamation`, light (12 of 12 variants) | 16 × 16 | box `tree-table/error-icon-size`; vector color `tree-table/error-icon-foreground` |
| message | text, `text/body-md` | 166 × 20 | `tree-table/error-foreground`; in hover `tree-table/error-foreground-hover` |
| action: try again | text, `text/label-md` | 101 × 20 | `tree-table/error-foreground`; in hover `tree-table/error-foreground-hover` |
| focus halo (focus state only) | a loose layer (absolute position), x 0, y 0 | default 806 × 52 (it stops 1 px above the divider) | inside stroke of 4 px: color `tree-table/focus-halo`, thickness `tree-table/focus-halo-width`, corners `tree-table/focus-halo-radius` (11) |
| focus border (focus state only) | a loose layer, x 4, y 4 (inset 4 px) | default 798 × 44 | inside stroke of 1 px: color `tree-table/focus-border`, thickness `tree-table/focus-border-width`, corners `tree-table/focus-border-radius` (7) |

Order of the children of the row: selection space, error cell, focus halo, focus border. In the cell: indent(s), chevron space, error block. In the block: icon, message, action. With the indent and the chevron space, the icon sits under the text of the sibling rows of the children's level: 36 px per level (28 + 8), the same step as the `nph-table` tree (`table/expand-indent` 28 + `table/cell-gap` 8).

### Table (`7617:6784`)

**Default state** (default 806 × 616; large 830 × 620):

| Layer | Direction and space | Token |
|---|---|---|
| the table (variant) | vertical, gap 8 between caption, toolbar, table and pagination | gap `data-table/stack-gap` |
| caption | vertical, gap 4 between title and description; maximum width 560 | gap `table/cell-gap-tight`; maximum width `table/caption-max-width` |
| caption title | horizontal, gap 8 between the text and the `nph-badge` | gap `table/cell-gap`; text `text/heading-xs`, `table/foreground`; the `nph-badge` (secondary, light) hidden on purpose (no total) |
| caption description | text, `text/body-sm` | `table/caption-foreground` |
| `nph-toolbar` | instance (page type, default size), the table width | the `toolbar/*` tokens |
| body | vertical, gap 0 | — |
| header row | horizontal, gap 0; 40 high in default, 44 in large | instances: the `nph-data-table` selection (header place) and the `nph-data-table` header (Unit ascending; Owner sortable; Status none; People sortable, at the end; Actions none) |
| data row | horizontal, gap 0, 53 high; a detached copy of the `nph-data-table` row | selected: background `data-table/row-selected-background` and a 2 px bar only at the start, inside stroke (`data-table/row-selected-indicator`, `data-table/row-selected-indicator-width`); cells by instance: the `nph-data-table` selection (row place), the `nph-table` tree cell (level 1, 2, 3; open yes, no, no children), the `nph-table` cell (start, end), the `nph-table` composite cell (mixed actions) |
| branch error row | instance (level 3, default; the size follows the table) | the `tree-table/*` of the master |
| pagination | horizontal, gap 8 between the label, the `nph-select` and the `nph-pagination` | gap `data-table/pagination-gap`; label `text/body-md`, `data-table/page-size-label-foreground`; `nph-select` width `data-table/page-size-width`; `nph-pagination` (range type) |

In large: the selection column is 56 wide and the cells take `table/container-padding` (16) on their sides; header `table/row-height-large` (44); the tree cell keeps `table/cell-padding-inline`; the row with actions measures 53 in both sizes.

**Loading and empty by search:** the variant is an instance of the `nph-data-table` (loading, or empty by search), 644 wide: loading shows the header row and skeleton rows (40 high); empty shows the header row and an empty body (vertical, gap 16 `data-table/empty-gap`, padding 32 above and below `table/empty-padding`) with the `nph-empty`. No part of the tree table's own.

### Row focus (composition, outside the sets)

In the root and in the documentation, the plain row with focus is a detached row with two loose layers, as in the error row: the focus halo (x 0, y 0, 806 × 52 in a 53 row; a 4 px stroke, corners 11) and the focus border (inset 4 px; a 1 px stroke, corners 7), both bound to the same `tree-table/focus-*` tokens. The selected row bar sits in a layer above the focus. A focused cell uses the ring of the `nph-table`; the chevron, the box and the buttons use the focus of their own piece.

### Example texts in Figma (translated in the prose)

Caption: title "People by region", description "Region, state and city, with the total of people". Header: "Unit", "Owner", "Status", "People", "Actions". Rows (default): "South Region" (level 1, partial), a first state (level 2, selected) with its two cities (level 3, selected), a second state (level 2, loading), a third state (level 2, open) with the error row, and "Southeast Region" (level 1); the states and the cities are Brazilian place names. Error row: message "Couldn't load." (as the `nph-tree` error row), action "Try again". Footer: "Items per page". The Figma texts are in Portuguese; the prose carries them in English.

## Anatomy (as in Figma)

Order, from top to bottom: caption, toolbar, header, body rows and footer. In the row, from start to end: selection box, tree cell (indent, chevron, text), data columns and actions.

1. **Caption** — at the top, aligned to the start: the title and the description of the table.
2. **Toolbar** — below the caption, the table width: search and filter at the start, actions at the end.
3. **Header** — at the top of the body: the select-all box at the start and the column titles, each aligned as its column, vertically centered.
4. **Selection box** — at the start of the row, in a column of its own and with no indent, vertically centered.
5. **Indent** — at the start of the tree cell, after the box: one step of `table/expand-indent` plus `table/cell-gap` per level below the first.
6. **Chevron** — after the indent, vertically centered: it points right on a closed branch and down on an open one; on a parent that loads it becomes the loading button; on a leaf the empty space of the same size stays.
7. **Text** — after the chevron, vertically centered, aligned to the start; it is cut to one line with an ellipsis, and the whole text goes to the tooltip.
8. **Data columns and actions** — after the tree cell, each column with its alignment, vertically centered; the actions at the end of the row.
9. **Selected row bar** — at the start of the row, the full height: 2 px in `data-table/row-selected-indicator`, above the focus.
10. **Row focus** — inside the row, from start to end: the halo at the edge and the border inset 4 px, both with corners, stopping 1 px above the base divider.
11. **Divider** — at the base of each row, 1 px in `table/border`.
12. **Branch error row** — in the place of the children of the branch that did not load, vertically centered: selection space, level indent, chevron space, icon, message and the Try again action, aligned to the start; the icon sits under the text of the sibling rows. The row has the height of the table rows (`tree-table/row-padding-block`, with `tree-table/row-height` as a floor), and the selection space has the width of the selection column.
13. **Footer** — at the base of the table: the pagination of the `nph-pagination`, which counts only the first level rows.

## Accessibility (as in Figma)

- **Contrast:** the text passes 4.5:1; the chevron, the error icon and the focus border pass 3:1, in light and dark, over the row background at rest, in hover and selected. Measured with the code values, `Sistemas` brand: the error message and action in `tree-table/error-foreground` (on `color/foreground`) 21:1 light and 14.73:1 dark over `tree-table/row-background`; in `tree-table/error-foreground-hover` (on `table/foreground`) 18.66:1 and 13.55:1 over `tree-table/row-background-hover`. The error icon in `tree-table/error-icon-foreground` (on `status/error`) 6.88:1 and 6.96:1 over the row, 6.12:1 and 6.40:1 over the hover; the lowest of the seven brands over the hover is 5.74:1 (`Gerencial`, light). The divider in `tree-table/border` is decorative (the row reads by its content).
- **Visible focus:** the row with the keyboard focus shows the border `tree-table/focus-border` (on `focus/border`), 1 px, inset 4 px, and the halo `tree-table/focus-halo` (on `focus/halo`), 4 px at the edge, inside the row. The border meets the 3:1; the halo is decoration. Against the row background the border measures 3.68:1 light and 11.70:1 dark; against the hover and the selected background (`table/row-hover-background` and `data-table/row-selected-background`, both on `color/primary-surface`) 3.27:1 light and 10.76:1 dark; these are the lowest of the seven brands (`Sistemas`). Against the halo, `tree-table/focus-border` (on `focus/border`) has the known `Sistemas` light limit of that semantic (2.92:1; `design.md`); dark 5.02:1. The selected row bar stays above the focus and in view. A focused cell uses the ring of the `nph-table`; the chevron, the box and the action buttons use the focus of their own piece.
- **Color is not the only sign:** the selected row has its box checked and the bar at the start, besides the background. A partial parent shows the dash in the box. An open branch changes the direction of the chevron. The error has an icon, a message and an action in text.
- **Touch target:** the chevron measures 28 × 28 px and the box has a 24 × 24 px area: they pass the 24 px minimum (WCAG 2.5.8). In the error row, the whole row is the target of Try again.
- **Accessible name:** the table has the name of the caption title. Each row says its level, its position among its siblings and whether it is open; the chevron has a name per row, from the data. The error row is read as the message and the action together.
- **Loading:** the row that loads its children is busy (`aria-busy`) and the chevron becomes the loading button.
- **Truncated text:** the cut text shows the whole text in a tooltip on hover and on focus, which closes with Esc (WCAG 1.4.13).
- **Usage demo (Figma):** focus on a row, focus on a selected row, focus on the error row, and long text with focus and tooltip, in light and dark.

## Properties, variants and states (as in Figma)

- **State (table):** default: rows with data. Loading: the first load of the table, with the header in view and skeleton rows. Empty by search: the toolbar search found nothing, and the `nph-empty` takes the place of the rows. Default: default.
- **Size:** default or large, as the `nph-data-table`: large gives more breathing room on the sides (`table/container-padding`) and makes the selection column 8 px wider; the row with actions measures 53 px in both. Default: default.
- **Level (error row):** 2 or 3: the level of the children that did not load; the icon sits under the text of the siblings of that level. Default: 2.
- **State (error row):** default; hover, with the background `tree-table/row-background-hover` (`table/row-hover-background`, the same hover as the `nph-table` and `nph-data-table` row) and the text in `tree-table/error-foreground-hover` (`table/foreground`); focus, with the same focus as the row. Default: default.
- **Selection (error row):** yes leaves the space of the selection column before the indent, so the icon aligns with the siblings; no, in a table with no selection. Default: yes.
- **What is not a property:** the level, the open and the closed of each row come from the tree cell (level and open properties). The hover, the selected and the stripe come from the `nph-data-table` row (the stripe exists on the data table row, but the tree table does not offer it in the v1, see "Limits"); the tree cell takes the background of its neighbors by override. The partial comes from the box in indeterminate. The focus and the loading parent are built in the composition.
- **Loading parent:** the chevron becomes the icon-only button in the loading state, with no skeleton row.
- **Long text:** cut to one line with an ellipsis; the whole text goes to the tooltip.

## Relations and context (as in Figma)

- **Base:** `nph-data-table`: caption, toolbar (`nph-toolbar`), sortable header, selection column (`nph-checkbox`), footer (`nph-pagination`), loading (`nph-skeleton`) and empty (`nph-empty`).
- **First column:** the `nph-table` tree cell: indent, chevron (`nph-button` icon only, ghost, compact) and text; the cut text uses the `nph-tooltip`.
- **Who controls what:** the row controls the background (rest, hover, selected), the selected bar and the focus; the tree cell takes the same background as its neighbors. The box, the chevron and the buttons have their own color, state and focus.
- **Space:** `data-table/stack-gap` between caption, toolbar, table and footer; `table/cell-gap` between indent, chevron and text. In the error row, `tree-table/cell-gap` between the blocks and `tree-table/error-gap` between icon, message and action.
- **Cascading selection:** checking the parent checks the loaded children; with only part of the children checked, the parent is partial, with the dash in the box.
- **Sorting, search and pagination:** the sorting works inside each level, with the children under the parent. The search shows the result with its parents. The pagination counts only the first level rows: the children stay on the page of the parent.

## When to use (as in Figma)

- Use it with a hierarchy of records that have the same columns at every level.
- Use the on-demand load when the children come from the server: the branch opens, the chevron becomes the loading button, and the children or the error row arrive.
- Use the loading state only on the first load of the table; in a branch, the loading stays in the chevron.
- Use the empty by search state when the toolbar search finds nothing.
- Choose the size as in the `nph-data-table`: large changes the breathing room on the sides, and the height of the row with actions does not change.
- From the description: use it when the records have parent and child and the columns are the same at every level: unit and sub-unit, account and sub-account, project and stage. It does not replace the `nph-tree`: with no data columns, the hierarchy is a navigation tree. It does not replace the `nph-data-table` with an expanding row: a detail that is not a table (text, a record card, a form) opens in the expanded item, not as a child. It does not replace the `nph-table`: data with no hierarchy stays in the flat table.

## Required examples (in Figma, light and dark)

- a) Units by region: "South Region" partial; the first state and its two cities checked; the second state loading; and the third state branch with the error row (default, default size).
- b) Search with no result: the toolbar search found no person, and the `nph-empty` explains what to do (empty by search, large).
- c) First load of the table: the header stays in view and the skeleton rows fill the body (loading, large).

## Do (as in Figma)

- Open the branch through the chevron or through the keyboard on the row: a click on the rest of the row does not open the branch, as in the `nph-table`.
- Keep the box in a column of its own, with no indent: the boxes stay aligned, as in the `nph-data-table`.
- Give the tree cell the background of its neighbors in each state: the whole row changes together in hover and when selected.
- Show the partial parent when only part of the children are checked: the person sees there is a choice inside the branch.
- Show the branch error in the children's row, with Try again: the person knows what failed and tries again without leaving the table.
- Cut the long text with an ellipsis and a tooltip: the neighbor column stays readable.

## Do not (as in Figma)

| Do not use | Use instead |
|---|---|
| For a hierarchy with no data columns. | The `nph-tree`: a hierarchy with no columns is a navigation tree. |
| For a detail that is not a table (text, a record card, a form) as a child of the branch. | The `nph-data-table` with the expanded item: the detail opens under the row, without becoming a level of the tree. |
| With the long text running into the next column. | The cut to one line with an ellipsis and the whole text in the tooltip. |

The three wrong examples in Figma are drawn on purpose ("error, on purpose").

## Default behavior (appendix, accepted with the documentation)

Base: the treegrid pattern of the WAI-ARIA APG (https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/), as the `nph-table` tree already does in code (P101), and the error row of the `nph-tree`. A code change, not an inheritance: today the `nph-data-table` leaves out a row with children (`fichas/nph-data-table.md`, lines 128 and 504) and the `nph-table` tree has no selection (P101); joining tree, selection, sorting, search and pagination is the work of this task.

| Moment | What happens | Source |
|---|---|---|
| Tab | One body row is the Tab stop: the last one that had focus, or the first. Tab goes on to the box, the chevron, the buttons and the truncated text of that row only, and leaves the table. The sortable header, the select-all box, the toolbar and the footer stay in the Tab order before and after the body. A code change: in the `nph-data-table` the row takes no focus, and the `nph-table` tree has no box. | `fichas/nph-table.md`, lines 227 and 378 (P101); `fichas/nph-data-table.md`, line 496; the APG treegrid |
| Down and Up on a row | Go to the next and the previous row, among the visible ones; the footer last. | `fichas/nph-table.md`, line 227; the APG treegrid |
| Right on a row | Opens a closed row; on an open one, goes to the first cell. | `fichas/nph-table.md`, line 227 |
| Left on a row | Closes an open row; on a closed one or a leaf, goes to the parent row. | `fichas/nph-table.md`, line 227 |
| Home and End on a row | Go to the first and the last row. | `fichas/nph-table.md`, line 227 |
| Enter on a row | Opens and closes the branch. On the error row, tries again. | `fichas/nph-table.md`, line 227; `fichas/nph-tree.md`, line 252 |
| On a cell | Right and Left move along the row (Left on the first cell goes back to the row); Down and Up keep the column; Home and End go to the first and the last cell; Ctrl+Home and Ctrl+End to that column in the first and the last row. | `fichas/nph-table.md`, lines 227 and 378 |
| Space and Enter on the box | Check and uncheck the focused box, as in the `nph-data-table`. Checking the parent checks the loaded children; with only part of them checked, the parent is partial. | `fichas/nph-data-table.md`, line 496; Pend. 4 A; DSA-58 D-4, in part |
| Click | On the chevron, opens and closes the branch; a click on the rest of the row does not open the branch. On the error row, the click tries again. | `fichas/nph-table.md`, lines 201 and 363; `fichas/nph-tree.md`, line 252 |
| Pointer and focus | Hover only paints the row; it does not move the focus. With focus and hover on the same row, the focus stays above the hover background. | DSA-75, line 46 (answers of the `nph-tree`: hover that does not move the focus; focus above hover) |
| Opening a branch with no loaded children | The branch opens, the chevron becomes the loading button and the row is busy (`aria-busy`, a new rule in the tree table); opened by the keyboard, the focus stays on the row; the chevron that becomes the loading button keeps the focus it had. The children arrive under the parent or, if the load fails, the error row in their place. | P97, item 5; `fichas/nph-tree.md`, line 252; DSA-75, line 76; `fichas/nph-table.md`, lines 227 and 228; `fichas/nph-button.md`, line 345 |
| Focus on open and close | Through the keyboard on the row (Right, Left and Enter), the focus stays on the branch row. The chevron is an `nph-button`: on click, it follows the focus of its own piece. | `fichas/nph-table.md`, lines 227 and 228; the APG treegrid; `fichas/nph-button.md`, line 345 |
| Try again | On the error row, Enter or a click ask for the load again; the branch goes back to loading until the answer arrives. Figma draws no loading error row, so the drawn states apply: the error row leaves, and the parent row shows the loading chevron with `aria-busy`; then the children arrive, or the error row again. When the error row held the focus, the focus goes to the parent row, the nearest branch still drawn. Closing and opening a failed branch shows the error row again; only Try again asks for the load, as the `nph-tree`. The name read is the message and the action together. | `fichas/nph-tree.md`, lines 154, 187 to 190, 252 and 293 ("When the item that holds the focus leaves, the focus goes to the nearest branch that is still drawn") |
| First load that fails | No row in the contract, as in the `nph-data-table` ("Domain error states: none") and the `nph-tree` (known limit (h)): the page shows its own message. | `fichas/nph-data-table.md`, line 632; `fichas/nph-tree.md`, known limits |
| Truncated text | On hover and on focus, the tooltip shows the whole text; Esc closes the tooltip without moving the focus. The `nph-table` tree opens the hover tooltip only in the row that is the Tab stop (its known limit, P101); the tree table follows the documentation (hover and focus) as the `nph-tree` does: while the pointer is over a cut text, its row takes the Tab stop, and gives it back when the pointer goes to another row, leaves the table or the person presses Tab. | https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html ; `fichas/nph-table.md`, line 378 (P101); `fichas/nph-tree.md`, known limit (c); Pend. 9 A |
| Esc | Closes the open tooltip. Apart from that, the table has no layer to close. | WCAG 1.4.13 (above) |
| Outside click | Does not apply: the table opens no panel. The tooltip closes when the pointer and the focus leave it. | WCAG 1.4.13 (above) |
| Near the window edge | The table scrolls in its own scroll area, which takes the focus when it overflows; the tooltip follows the position of the `nph-tooltip`. | `fichas/nph-table.md`, line 227 |
| Sorting | A click on the header sorts the column in ascending order and makes it the sorted one; the order works inside each level, with the children under the parent. | DSA-58 D-3; https://mui.com/x/react-data-grid/tree-data/ |
| Search | Shows the rows that match the search and their parents. Whether a match under a closed parent shows that parent open is not drawn: an open point of the task. | https://js.devexpress.com/React/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/ |
| Pagination | Counts only the first level rows; the children stay on the page of the parent. | https://help.syncfusion.com/grid-sdk/angular/tree-grid/paging |
| Code | Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest. | Flow, step 11 |

## Combined states (T11)

- Selected and disabled, and error and disabled, do not apply: the disabled row does not enter (type 29 of the plan: 0 of 14 systems confirm it; the `nph-data-table` has no disabled row).
- If the disabled row enters later, T11 applies: (1) selected or checked and disabled keeps the selected background and mark, under `state/disabled-opacity`; (2) error and disabled: disabled wins, the error border goes and only the opacity stays. T11 asks for no new token.
- Drawn combination: selected and focus. The selected bar sits in a layer above the focus and stays in view (root, `7618:7590` in light and `7618:7850` in dark).

## Order and alignment of the parts (appendix)

| Part | Order | Alignment |
|---|---|---|
| caption | first, at the top of the table | start; title over description |
| toolbar | after the caption | search and filter at the start, actions at the end; vertically centered |
| header | first row of the body | box at the start; each title as its column; vertically centered |
| selection box | first of the row, its own column | start, no indent; vertically centered |
| indent | after the box, at the start of the tree cell | start; one step per level below the first |
| chevron (or the leaf space, or the loading button) | after the indent | vertically centered |
| tree cell text | after the chevron | start; vertically centered; one line with an ellipsis |
| data columns | after the tree cell | each as its column; vertically centered |
| actions | last of the row | end; vertically centered |
| selected bar | a layer above the focus | row start, full height |
| row focus | a layer over the row | the whole row, inside; it stops 1 px above the base divider |
| divider | base of each row | base, 1 px |
| branch error row | in the place of the children of the branch that did not load | selection space, indent, chevron space, icon, message, action, at the start; vertically centered |
| footer | last, at the base of the table | pagination as `pagination-layout` |

## Icon and image

All from the `nph-icon` (Font Awesome), light style; none changes weight by state.

| Icon | When it shows | Size | Piece |
|---|---|---|---|
| `chevron-right` and `chevron-down` | right on a closed branch, down on an open one | `icon/size-sm` (16) | tree cell (`nph-button` icon only, ghost, compact) |
| `circle-notch` | loading parent, in place of the chevron | `icon/size-sm` (16) | icon-only button in the loading state |
| `triangle-exclamation` | branch error row, in `tree-table/error-icon-foreground` | `tree-table/error-icon-size` (16) | branch error row (new part) |
| `check` and `minus` | checked box and partial box | `icon/size-sm` (16) | the `nph-data-table` selection (DSA-17 D1) |
| `arrow-up-arrow-down` and `chevron-up` | sortable header and sorted column | `icon/size-sm` (16) | the `nph-data-table` header |
| `ellipsis-vertical` | more row actions | `icon/size-sm` (16) | the `nph-table` composite cell |
| `magnifying-glass`, `filter` and `plus` | search, filter and the create action | `icon/size-sm` (16) | `nph-toolbar` |
| `download` and `gear` | toolbar actions | `icon/size-md` (20) and `icon/size-lg` (24) | `nph-toolbar` and `nph-data-table` |
| `xmark` | remove the filter | `icon/size-sm` (16) | `nph-data-table` |
| `chevron-left` and `chevron-right` | previous and next page | `icon/size-md` (20) | `nph-pagination` |
| `chevron-down` | open the items per page list | `icon/size-sm` (16) | `nph-select` |

Image: only the `nph-empty` illustration in the empty by search state, by instance (the light and the dark one switch by `scheme/is-light`). No image of its own: no export size or crop to define. DSA-40 D1 to D4 stay inherited.

## Limits (the "Limites" row of the Figma matrix, plus two cases not drawn)

- Minimum: a single row with no children: level 1 with no chevron, the text in its usual place.
- Maximum: level 3 is the bottom of the tree; there is no fourth level (P97, item 5; item 3). A screen that asks for more levels goes to the UX review.
- Long text: a long name at level 3, the case with the least room in the tree column: cut to one line with an ellipsis, as the `nph-table` cell.
- Tree column width (not drawn): the text of level 3 starts after 108 px (72 of indent, 28 of chevron, 8 of gap) plus the cell padding. Pending decision D-1 of the task is the empty branch; D-2 is this width: recommended, the page gives it, as any column, and the component keeps a floor of 240 px (a new value, so a token in Figma first); until the design owner answers, the page gives it and the component sets no floor.
- A branch that loads and comes back with no children (not drawn): pending decision D-1 of the task; recommended, the row becomes a leaf (the chevron leaves, its space stays), and the code follows that until the design owner answers.
- Empty: the search finds nothing: the `nph-data-table` shows the `nph-empty` by instance, with no change.
- Many items: the footer pagination counts only level 1: a child never falls on another page than its parent.
- Short window: no new drawing; the tree column is not fixed (type 21, out). In a narrow window the table scrolls horizontally in its own scroll area, as the `nph-table` does today (`fichas/nph-table.md`, line 227: the scroll area takes the focus when it overflows).

Out of the v1 (types of the benchmark that do not enter, with the reason): choosing the tree column (the tree is in the first column, P97, item 5); expand and collapse all (it would change the accepted header; v2); open up to level N (a data rule); open by a click on the row (P101, item 4: the row click does not open; in the tree table it does not check the box either, since the selection is only by the box, as in the `nph-data-table`); single selection (the `nph-data-table` selects only by box); independent selection (v2 if a product asks); cascade only on the filtered rows (a data rule); guide lines (the indent is enough in the soft style); a fixed tree column (the `nph-data-table` has no fixed column); a context menu (the actions column enters by instance); total per group (the `nph-table` total is of the whole table); in-cell editing (another component); drag to reorder (no drag piece in the Nephos); stripe (it competes with the indent in reading the level); vertical grid (heavy for the soft style); disabled row (the `nph-data-table` has none); virtual scrolling (no drawing); children count (a server data rule).

## What the tree table asks of other pieces

Read on `v/5.0.0` (`fichas/nph-table.md`, `src/components/nph-table/nph-table.ts` and `.css`, `fichas/nph-data-table.md`, `src/components/nph-data-table/nph-data-table.ts`, `fichas/nph-checkbox.md`, `fichas/nph-tree.md`). Item 10 approved these changes for the code and also new variants on two Figma pieces of other components: the `nph-table` tree cell `2571:66335` gains the state axis (default, hover, stripe) and the cut with the tooltip, and the `nph-data-table` selection `1371:68` gains the row place with the indeterminate box. The design side adds those variants in Figma, apart from this task; the code does not wait for them and does what the accepted composition draws.

| It asks | Does the piece do it today? |
|---|---|
| `nph-table`: the tree as a treegrid, with `aria-level`, `aria-posinset`, `aria-setsize`, `aria-expanded` on the row and the APG keyboard | Yes: P101 (`fichas/nph-table.md`, lines 225 and 227; `nph-table.ts`, `role="treegrid"`). |
| `nph-table`: the indent of 36 px per level and the chevron space on a leaf | Yes: `table/expand-indent` plus `table/cell-gap` per level, and the `tree-spacer` (`nph-table.css`, the "Tree" rules). |
| `nph-table`: the row focus as the border and halo with corners (Pend. 5 B, item 10), not the 2 px ring | No: the tree row and cell take the ring `focus/border` in `table/focus-ring-width` drawn inside (P101, item 3; `nph-table.css`, the treegrid rule). The change is only in the tree table: the row takes `tree-table/focus-border`, `-border-width`, `-border-radius`, `-halo`, `-halo-width`, `-halo-radius`, inside the row, stopping 1 px above the base divider; the `nph-table` tree keeps its ring. A focused cell keeps the ring of the `nph-table`. |
| `nph-table`: the loading parent in the chevron (the `nph-button` loading state) | Yes: a row with `loading` spins the chevron and does not toggle (`nph-table.ts`). New in the tree table: `aria-busy="true"` on the loading row (today only a loading cell carries it). |
| `nph-table`: the branch error row with Try again | No: the `nph-table` tree has no error row (P97 has no error). New part and rule in this task, as the error row of the `nph-tree` (`fichas/nph-tree.md`, lines 154, 187 to 190 and 252). |
| `nph-table` tree cell (Pend. 2 A, item 10): the tree cell takes the row background in default, hover and stripe | In code the cell sits inside the row and takes the row background (the row hover paints the whole row, `nph-table.test.ts`, "hover paints the whole row"); the Figma tree cell `2571:66335` has no state axis yet (it gains one by item 10, apart from this task), so the composition draws it by override. In code the `nph-table` hover paints each cell of the row (`nph-table.css`); the tree cell has no background of its own and takes the same background as the other cells in every state. |
| `nph-table` tree cell (Pend. 9 A, item 10): the text cut to one line with an ellipsis and the tooltip | In part: the `truncated` cell type cuts at the column width with the whole text in the tooltip (`nph-table.css`, `.cut`; `nph-table.test.ts`, "truncated"), and the tree cell takes any cell type as its content. The tree table cuts the tree cell text this way; the column width follows the rule of "Limits". Known limit of P101: in the `nph-table` tree, the hover tooltip opens only in the row that is the Tab stop; the tree table moves the Tab stop on hover, as the `nph-tree` (see "Default behavior"). |
| `nph-data-table` (Pend. 4 A, item 10): the row box in indeterminate for a partial parent | In part: the `nph-checkbox` has the indeterminate state (`fichas/nph-checkbox.md`, line 11: "only on the item that summarizes a group checked in part"), but the data table uses it only on the header box; the Figma selection set `1371:68` has no row place with indeterminate yet (it gains one by item 10, apart from this task). The tree table sets the parent row box to indeterminate. |
| `nph-data-table`: rows with children | No: "a row with children — the children are left out: the tree is nph-table's" (`fichas/nph-data-table.md`, lines 128 and 504; `nph-data-table.ts`, the `children` check), and "a tree of records" is listed under "do not create without a decision" (line 723). This task is that decision: the nph-tree-table joins the data table and the `nph-table` tree. See the open point on the API. |
| `nph-data-table`: the row hover (item 10) | Yes: `table/row-hover-background`, the whole row, a selected row keeps its background (`fichas/nph-data-table.md`, line 453). The tree table takes the same, through `tree-table/row-background-hover` on the error row. |
| `nph-data-table`: selection by box, select-all on the drawn rows, the bulk bar, sorting, pagination, loading and empty by search | Yes (DSA-58). The tree table changes "drawn rows" to include the open children, and the pagination to count level 1 only. |
| `nph-checkbox`, `nph-button`, `nph-toolbar`, `nph-pagination`, `nph-select`, `nph-badge`, `nph-icon`, `nph-skeleton`, `nph-empty`, `nph-tooltip` | Yes: existing variants (DSA-17, DSA-13 and later, DSA-55, DSA-54, DSA-29, DSA-12, DSA-03, DSA-26, DSA-40, DSA-48). |

## Inherited decisions

Family: `nph-data-table` → `nph-table` → tree table, with the `nph-tree` (navigation) and the `nph-tree-select` beside it. Read in the tasks on `v/5.0.0`.

- Follows DSA-75 D-1: the tree table reuses the `nph-table` tree cell (treegrid) and stays apart from the `nph-tree`. Answered on 2026-11-16; P118, item 1, said the tree table carried the whole `nph-tree`, and P118 itself records the answer.
- DSA-75 D-2 does not apply (focus border over a disabled item): the disabled row does not enter. If it enters, the answer applies: focus on top, at full opacity.
- Follows DSA-56 (no D-N) and P101 on the keyboard: the APG treegrid, with focus by row first (P101, item 4).
- Follows in part P105, item 9, and P101 ("Known limits"): today the `nph-data-table` draws no children and the `nph-table` tree has no selection; the tree table changes that in code.
- Follows DSA-93 (no D-N): the row focus is the 1 px border and the 4 px halo with corners, as the `nph-tree` item and the other list items (Pend. 5 B), here inside the row, because the rows touch. It does not follow the 2 px ring inside of P101, item 3, that the `nph-table` tree uses today: the tree table changes it, only in the tree table.
- Follows DSA-17 D1: check or minus light in `icon/size-sm`; the minus is the partial parent's (Pend. 4 A).
- Follows DSA-17 D2 (box colors by state), D3 (box focus with border and halo), D4 (16 px box and 24 px touch area), D5 (`space/inline` measured from the 24 px area; the box at the top with wrapping text) and D6 (plain text, no link inside the piece), by instance.
- Follows DSA-17 D7, open with the design owner: where `state/hover-opacity` goes on the checked box in hover. Inherited, no change.
- Follows DSA-26 D1, open (the skeleton line height), only on the first load of the table, through the `nph-data-table` loading; in a branch it does not apply, because Pend. 6 kept the loading chevron, with no skeleton row.
- Follows DSA-26 D2, open: the use of the skeleton shape tokens in `design.md`. Inherited.
- Follows DSA-40 D1 to D4, open: weight, dark illustration, shrinking box and delivery of the `nph-empty` images. Inherited in the empty by search state.
- Follows DSA-49 D1 to D8, open: content, typography, thumbnail, icons and tokens of the `nph-table`. Inherited in the data columns.
- Follows DSA-54 D-1 to D-5, open: native buttons, text role of the numbers, arrow icons, order of the types and the end of the pagination outline. Inherited in the footer.
- Follows DSA-58 D-1, open: the footer follows `pagination-layout`, with no switch by width on its own. Inherited.
- Follows DSA-58 D-2, open: descending is the up arrow turned half a turn. Inherited in the sortable header.
- Follows DSA-58 D-3, open: a click sorts another column in ascending order and makes it the sorted one. Inherited; in the tree table the order works inside each level.
- Follows in part DSA-58 D-4, open: the header box checks the rows drawn on the page. In the tree table, "drawn" includes the open children, and checking the parent checks the loaded children (Pend. 4 A).
- Follows DSA-58 D-5, open: skeleton rows when the whole table loads. Inherited; the loading parent stays in the chevron (Pend. 6 A).
- Follows DSA-58 D-6, open: a switch column at the end of the row, before the actions. Inherited.
- DSA-94 D-1 does not apply (letter key in the single choice tree select): the treegrid keyboard of P101, item 4, has no type-ahead.
- DSA-64 D-1 does not apply (secondary solid icon-only button inside the dialog): the chevron is ghost, not solid.
- No D-N to follow: DSA-03 (`nph-icon`), DSA-09 (`nph-spinner`).
- Register: T9 (token layers), T11 (combined states).

## Decisions answered (approval page of 2026-11-22, items 1 to 10, all approved)

| Item | Decision |
|---|---|
| 1 | Root `7618:6203` accepted (light `7618:6208`, dark `7618:7778`), with the proposals accepted on 2026-11-21. |
| 2 | Documentation `7812:13461` accepted (ten sections and the matrix); the descriptions of the sets `7617:6784` and `7604:167` hold its summary. |
| 3 | Pend. 8: the tree goes down to three levels, as P97, item 5 ("up to three levels"), and the tree cell with levels 1, 2 and 3; a screen that asks for four levels or more goes to the UX review and reopens P97 with the code owner. A code rule, with no drawing. Source: https://mobbin.com/glossary/tree |
| 4 | Pend. 10: the selection space of the error row inherits the measure of the `nph-data-table` in both sizes, and the code uses the real width of the selection column of the table, with no `tree-table/selection-width` token; the box area binding to `core/target-size/minimum` stays only in Figma. Source: https://raw.githubusercontent.com/ant-design/ant-design/master/components/table/index.en-US.md (`rowSelection.columnWidth`) |
| 5 | Pend. 11: the error row has the height of the table's own rows (in code, the same row height as the data rows); in Figma `tree-table/row-padding-block` reproduces the table with actions (53 px in default and large), and `tree-table/row-height` (40) stays as a floor. Five of five systems read treat the state row as a plain row. In a table with no actions column the data rows are lower, and only the code rule follows. Sources: https://raw.githubusercontent.com/ag-grid/ag-grid/latest/documentation/ag-grid-docs/src/content/docs/server-side-model-loading-rows/index.mdoc , https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/styles/scss/components/data-table/_data-table.scss , https://unpkg.com/@atlaskit/table-tree/dist/es2019/components/internal/common-cell.compiled.css |
| 6 | Pend. 12: `tree-table/indent` → `core/control-height/compact` (28), by decision (T9, rule 3); `control/height-compact` refused by function (a control height, not an indent). Sources: https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-tree/library/src/components/TreeItemLayout/useTreeItemLayoutStyles.styles.ts , https://raw.githubusercontent.com/primefaces/primeuix/main/packages/themes/src/presets/aura/tree/index.ts , https://ant.design/components/table , https://app.unpkg.com/@chakra-ui/react@3.36.0/files/dist/esm/theme/recipes/tree-view.js |
| 7 | Pend. 13: `tree-table/cell-padding-inline` and `tree-table/row-padding-block` → `core/space/300` (12), by decision (T9, rule 3); `space/control-padding`, `space/inline-loose` and `layout/columns` refused by function. Sources: https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-table/library/src/components/TableCell/useTableCellStyles.styles.ts , https://carbondesignsystem.com/components/data-table/style/ , https://raw.githubusercontent.com/primefaces/primeuix/main/packages/themes/src/presets/aura/treetable/index.ts , https://ant.design/components/table |
| 8 | Pend. 14: `tree-table/row-height` → `core/space/800` (40), by decision (T9, rule 3), as `table/row-height`; `avatar/size-lg`, `switch/track-width` and `icon/duotone-opacity` refused by function. Sources: https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/styles/scss/utilities/_layout.scss , the Fluent table cell styles above, https://ant.design/components/table |
| 9 | Pend. 15: `tree-table/focus-border-radius` → `focus/border-radius-control` and `tree-table/focus-halo-radius` → `focus/radius-control-with-border`, as the `tree/focus-*` of the `nph-tree`: halo = border + thickness, and the focus follows if the control radius changes. Sources: https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-table/library/src/components/TableRow/useTableRowStyles.styles.ts , https://raw.githubusercontent.com/material-components/material-web/main/focus/internal/_focus-ring.scss |
| 10 | The changes the accepted proposals ask of other pieces go to the code (see "What the tree table asks of other pieces"), and the matching new variants go to the Figma pieces `2571:66335` and `1371:68`, apart from this task: Pend. 2 A, the tree cell with the background of its neighbors in default, hover and stripe; Pend. 4 A, the row box in indeterminate for the partial parent; Pend. 9 A, the tree cell text cut to one line with an ellipsis and the tooltip. Pend. 3: the gray hover proposal was refused; the hover of the tree table is the row hover of the `nph-table` and of the `nph-data-table` (`table/row-hover-background`, with the text in `table/foreground`), and the table family does not change. Sources: https://raw.githubusercontent.com/Tencent/tdesign-vue-next/develop/packages/components/table/table.en-US.md , https://www.ag-grid.com/javascript-data-grid/tree-data-selection/ , https://raw.githubusercontent.com/ant-design/ant-design/master/components/table/demo/tree-table-ellipsis.tsx |

**A matrix text superseded.** The "Out" list of the Figma matrix (type 7) says the row click stays with the selection (P101, item 4). The tree table selects only by the box, as the `nph-data-table`, which has no row click: a click on the rest of the row neither checks the box nor opens the branch. Source: `fichas/nph-data-table.md` (selection by box); the matrix leaves Figma in the cleanup.

**Points that followed the recommendation.** The pending points of the appendix that were not approval items (Pend. 1, 2, 4, 5, 6, 7 and 9) follow the recommendation, approved with the approval page of 2026-11-22, because the recommended option was already in the root the design owner accepted: Pend. 1 A, the box in a selection column at the start, with no indent (https://raw.githubusercontent.com/ant-design/ant-design/master/components/table/index.en-US.md); Pend. 2 A, the tree cell with the background of its neighbors; Pend. 4 A, the partial parent (https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/); Pend. 5 B, the row focus as border and halo with corners, from the design owner's correction of 2026-11-20 to the focus style of the `nph-tree` (https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/examples/treegrid-1/); Pend. 6 A, the loading parent only in the chevron, with `aria-busy` on the row (https://raw.githubusercontent.com/element-plus/element-plus/dev/packages/components/table/src/config.ts , https://atlassian.design/components/table-tree/examples); Pend. 7 A, the error row at the children's level, the whole row as the target (https://mui.com/x/react-data-grid/server-side-data/tree-data/ , https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html); Pend. 9 A, the cut with the tooltip. Pend. 2 A, 4 A and 9 A change pieces of other components, and the design owner confirmed them in item 10.

## Foundation findings, out of this task

- The selected bar `data-table/row-selected-indicator` measures 2.86:1 over `color/primary-surface` in the `Gerencial` brand in dark (the same finding as DSA-75). The tree table inherits it from the `nph-data-table` rows; the fix belongs to the family, in a foundation task. Source: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- The `table/*` divider: `color/border` under every row, stronger than the weakest tone and opaque in dark, where the soft style asks for a weak tone and fewer dividers. It is the `nph-table`, the `nph-data-table` and the tree table together. Source: https://ui.shadcn.com/docs/theming
- Row height with no semantic: `table/row-height` and `tree-table/row-height` point to `core/space/800`, whose description is about space (item 8: by decision, no new semantic). Source: https://m3.material.io/foundations/design-tokens
- In Figma, the large header of the `nph-data-table` has its titles written straight, not bound to the header text property (`7617:5686`); and `data-table/page-size-label-foreground` and `data-table/page-size-width` have no description. Figma only; no code change.

## Hidden on purpose in Figma

- The `nph-badge` of the caption title (no total).
- In the "Do not" examples of the documentation: the data columns of the first wrong example and the image of the expanded item of the second.
- The focus halo and the focus border exist only in the focus variants of the error row; in the root and in the documentation the row focus is two loose layers on a detached row.
- Known limit of the Figma API: the selection space of the large error row binds `core/target-size/minimum` straight; in code it is the real width of the selection column (item 4).
