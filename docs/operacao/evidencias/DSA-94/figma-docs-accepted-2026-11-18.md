```json
{
  "task": "DSA-94",
  "gate": "figma-docs-accepted",
  "date": "2026-11-18",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7145-9081",
    "date": "2026-11-18",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-tree-select (green page 4128:35276, root 6339:6323), and its documentation frame (7145:9081) was accepted, with COMPONENT_SET nph-tree-select (6339:8107, the field) and the COMPONENT_SET of the panel (6339:8110). On the approval page of 2026-11-18 the design owner answered the 7 items, all as recommended: (1) documentation 7145:9081 accepted; (2) tree-select/panel-offset straight to core/space/100 by decision, as popover/offset; (3) five semantics gain the panel in their description, with no new semantic; (4) the soft outline color/border-subtle also on the option list of nph-select, nph-combobox and nph-multi-combobox, in one task of its own for the code owner; (5) the error row of the nph-tree group takes the panel width, and Try again drops below the message when it does not fit (option A); (6) new semantic color/skeleton, the same as today in light and one step up in dark, with skeleton/background on the nph-skeleton; (7) the arrow of the open branch stays gray, and blue stays only on the chosen item (option A)."
  }
}
```

# DSA-94 — `figma-docs-accepted`

The documentation of the nph-tree-select (frame `7145:9081`, page `4128:35276`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `6339:6323`. The nph-tree-select is a form field that opens a panel with a tree, to choose one item or several from data organized in levels, such as folders, departments and categories. It has two sets:

- **The field** (`nph-tree-select`): the field of the family, by instance. The field of the `nph-select` in single choice, of the `nph-combobox` in single choice with search, and of the `nph-multi-combobox` in multiple choice.
- **The panel** (`nph-tree-select / painel`, the panel set): a new shell below the field, with the `nph-tree` inside.

What changed in the tokens with this task:

- New semantic `color/skeleton` (item 6): light `core/surface/50`, the value of today; dark `core/surface/600`, one step above `color/muted` and `color/popover`. Both values already exist in the core (rule 4 of T9): no new primitive. It is on `v/5.0.0`.
- New component token `skeleton/background` → `color/skeleton` (item 6, rule 1 of T9): the background of the `nph-skeleton` shape. It is on `v/5.0.0`; the `nph-skeleton` CSS still draws `color/muted` until this task moves it (see the task).
- New group `tree-select/*`, 8 tokens of the panel. Seven alias semantics with the same function (rule 2 of T9); `tree-select/panel-offset` points straight to `core/space/100` by decision (rule 3 of T9, item 2). **These 8 tokens are in Figma and come with the code of this task**, not before it: the test "consumes every one of the twenty-five tree/* tokens" in `src/components/nph-tree/nph-tree.test.ts` (lines 1812 and 1820) counts every `--nph-tree-*` property in `tokens.css`, and `--nph-tree-select-panel-*` starts with that prefix. Eight tokens with no CSS would break it on `v/5.0.0`. The same path as DSA-93 ("Why the tokens did not go first"). The task gives the JSON and the test change.
- No semantic changed value. Seven Figma descriptions grew (items 2, 3 and 4), mirrored in the `use` of `design.md` without removing an accepted use: `layout/input-width`, `layout/multi-combobox-width`, `layout/max-list-height`, `radius/container`, `color/border-subtle`, `color/dropdown-border` (the field and the list of the select family, the combobox, the tree select and the date picker are not this token) and `core/space/100` (it gains `tree-select/panel-offset`).
- `design.md`: new entry `color/skeleton` and `skeleton/background`; `color/muted` says the `nph-skeleton` shape is now `color/skeleton`; `color/popover`, `border/width`, `color/border-subtle`, `color/input`, `color/dropdown-border`, `radius/container`, `layout/max-list-height`, `layout/input-width`, `layout/multi-combobox-width`, the note of `tokens_core_space`, the table of 2d and the known limitation of section 3 name the panel or the list of the family. The `tree-select/*` names carry "DSA-94" until the tokens land.

## Purpose

Field that opens a panel with a tree, to choose one item or several from data in levels, without leaving the form.

Use it when the choice depends on the place of the item in a hierarchy: a destination folder, a department of a unit, a category with subcategories. The field is the one of the family; the tree is the `nph-tree`, inside the panel. It does not replace the `nph-select` or the `nph-combobox`: a list with no levels stays with them. It does not replace the `nph-tree` on the page: to explore and open items without filling a field, use the `nph-tree` directly.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| `nph-tree-select` | `6339:8107` | The field, 42 variants: `modo` (mode: single, single with search, multiple) × `size` (default, large) × `state` (default, hover, focus, error, error-focus, disabled, open) |
| `nph-tree-select / painel` (panel set) | `6339:8110` | The panel, 6 variants: `seleção` (selection: single, multiple) × `conteúdo` (content: items, search, no result, first load, empty); the multiple selection has only items |

Root `6339:6323`, documentation `7145:9081`, appendix `7149:38729`.

## Tokens

Light and dark values are read in the `Sistemas` brand. `focus/border` and `focus/halo` follow the active brand.

### Panel: `tree-select/*` (in Figma; they come with this task)

| Token | Points to | Light | Dark | Where |
|---|---|---|---|---|
| `tree-select/panel-background` | `color/popover` | `#FFFFFF` | `#2D333B` | Panel background |
| `tree-select/panel-border` | `color/border-subtle` | `#F1F1F1` | white 10% | Panel outline; decorative (item 4) |
| `tree-select/panel-border-width` | `border/width` | 1 | 1 | Outline thickness |
| `tree-select/panel-radius` | `radius/container` | 8 | 8 | Panel corner |
| `tree-select/panel-max-height` | `layout/max-list-height` | 296 | 296 | Above it, the tree scrolls inside the panel |
| `tree-select/panel-offset` | `core/space/100` (by decision) | 4 | 4 | Distance between the field and the panel |
| `tree-select/panel-width` | `layout/input-width` | 280 | 280 | Panel width in single selection: the field width |
| `tree-select/panel-width-multiple` | `layout/multi-combobox-width` | 420 | 420 | Panel width in multiple selection: the width of the `nph-multi-combobox` field |

`tree-select/panel-offset` goes straight to `core/space/100` by decision (item 2): no semantic of 4 has the function of distance from the anchor. `space/inline-tight` and `space/stack-tight` are the gap of a unit and of a dense line; `radius/inner` is a radius; `focus/ring-width` is the width of the halo. The market treats this distance as a position number, as `popover/offset` already does. The `nph-select` stays on `space/inline-tight` (DSA-29 D1), with the same value, until the family decides.

The panel shadow is the effect style `elevation/dropdown` (a style is not a token, decision of 2026-11-04). The inner padding of the panel is the `tree/padding` of the `nph-tree`. The focus is the one of the field and of the item.

### Skeleton (item 6, on `v/5.0.0`)

| Token | Points to | Light | Dark | Where |
|---|---|---|---|---|
| `color/skeleton` | `core/surface/50` · `core/surface/600` | `#EDEEEF` | `#3C444F` | New semantic: background of the loading block |
| `skeleton/background` | `color/skeleton` | `#EDEEEF` | `#3C444F` | Background of the `nph-skeleton` shape (line, block, circle) |

Contrasts in this evidence that the documentation does not carry are computed from the `core` values (WCAG relative luminance; white 10% blended over its background). Before, the shape used `color/muted` (`#2D333B` in dark), the same value as `color/popover`: 1.00:1, it vanished on the panel of the first load. Now, 1.16:1 over `color/popover`, `color/background` and `color/card` in light (unchanged); in dark, 1.29:1 over `color/popover`, 1.62:1 over `color/card` and 1.92:1 over `color/background`. Decorative: the block carries no state and no text.

### Used by instance

The field and the tree use these pieces by instance; their tokens stay with each piece:

- `nph-select`, `nph-combobox` and `nph-multi-combobox`: the field, by mode (border, background, focus, arrow area, chips).
- `nph-tree`: the items, the chevron, the box of the multiple selection, the loading branch, the error row, the first load and the empty tree (`tree/*`).
- `nph-checkbox`: the box of the multiple selection, inside the item.
- `nph-icon`: every icon, `light`.
- `nph-empty`: the empty tree and the no-result panel, inside the `nph-tree`.
- `nph-skeleton`: the first load, inside the `nph-tree`.
- `nph-spinner`: the branch that loads, inside the `nph-tree`.
- `nph-tooltip`: the whole text of a cut label, from the `nph-tree`.
- Text styles: `text/body-md` (value, placeholder and items), `text/label-md` (the chosen item in single choice, and Try again), `text/label-sm` (chips), `text/heading-xs` and `text/body-sm` (empty and no result).

## Anatomy, read part by part in Figma

Read by script, variant by variant. The two sets are only the variant shell with instances inside: no inner piece is drawn in the tree select (no line, bar, dot or cell of its own).

### Field (`6339:8107`, the 42 variants)

- **Variant**: vertical, aligned to the start, hugs; the gap between the field and the panel is `tree-select/panel-offset`.
- **Field** (instance, by mode): horizontal, centered on the vertical axis; gap `space/inline`; start padding `space/control-padding`; corner `radius/control`; border `border/width`.
  - Single: the `nph-select` field with the start icon, width `layout/input-width` (280), height `control/height-default` (36) or `control/height-large` (44).
  - Single with search: the `nph-combobox` field with the magnifying glass; the same widths and heights.
  - Multiple: the `nph-multi-combobox` field, width `layout/multi-combobox-width` (420), minimum height `control/height-default` or `control/height-large`; top and bottom padding `space/inline-tight`; end padding `space/control-padding`.
- **Panel** (instance of the panel set, only in `state=aberto`, the open state).

Field color by state, read on the instance, the same in the 3 modes and the 2 sizes:

| State | Fill | Border | Other |
|---|---|---|---|
| default | `color/background` | `color/input` | — |
| hover | `color/background` | `color/input-hover` | — |
| focus | `color/background` | `focus/border` | halo `focus/halo`, from the field instance |
| error | `color/background` | `status/error` | — |
| error-focus | `color/background` | `status/error` | halo `focus/halo-error`, from the field instance |
| disabled | `color/muted` | `color/input` | opacity `state/disabled-opacity` |
| open | `color/background` | `focus/border` | single and single with search: the field instance in its open state; multiple: the field instance in focus with the chips |

The halo of the focus states was not read in the script; the documentation (`7147:60061`) names it.

Order in the field, left to right (appendix F):

1. **Start icon**: first; centered on the vertical axis. `globe` in single, `magnifying-glass` in single with search and in multiple; `icon/size-sm`, `light`.
2. **Value**: second; centered; fills the line up to the clear target or the arrow area. Placeholder in `color/muted-foreground`; the value on one line, with an ellipsis. In multiple, the chips of the `nph-multi-combobox`.
3. **Clear**: only in single with search, with text; before the arrow area; centered; 24 target.
4. **Arrow area**: at the end of the field, the whole height (stretch), with the divider and the `color/accent` background. In multiple, only the arrow, at the end, centered.

### Panel (`6339:8110`, the 6 variants)

- **Variant**: vertical, aligned to the start; fixed width, hugs the height. Width `tree-select/panel-width` (single, 280) or `tree-select/panel-width-multiple` (multiple, 420); the 4 corners `tree-select/panel-radius`; the 4 sides `tree-select/panel-border-width`; maximum height `tree-select/panel-max-height`; fill `tree-select/panel-background`; stroke `tree-select/panel-border`; effect style `elevation/dropdown`.
- **Content** (instance): vertical, aligned to the start, fills the width; the 4 paddings `tree/padding`, read on the instance.

| Variant | Size | Content (instance) |
|---|---|---|
| single · items | 280 × 262 | `nph-tree` (single selection, items) |
| multiple · items | 420 × 262 | `nph-tree` (multiple selection, items) |
| single · search | 280 × 154 | `nph-tree` (single selection, items), filtered |
| single · no result | 280 × 217 | `nph-tree` (no selection, empty) |
| single · first load | 280 × 118 | `nph-tree / grupo` (group, loading): the `nph-skeleton` shapes, fill `skeleton/background` |
| single · empty | 280 × 201 | `nph-tree` (no selection, empty) |

Order in the panel: the panel below the field, aligned to the start of the field, at `tree-select/panel-offset`, with the field width. The tree at the top of the panel, filling the width, items centered on the line, indent `tree/indent` per level. The empty and the no result: the `nph-empty` of the `nph-tree`, at the top of the panel, centered on the width (illustration, title, description).

### Texts and icons by variant

| Variants | Texts (style) | Icons (`nph-icon`, weight) |
|---|---|---|
| single, 12 closed | placeholder (`text/body-md`) | `globe` light · `chevron-down` light |
| single, open | field with the chosen file; panel with 7 items, the chosen one in `text/label-md`, the others in `text/body-md` | `globe` · `chevron-up` (field) · `chevron-down` ×2 and `chevron-right` ×2 (branches), all light |
| single with search, 12 closed | placeholder (`text/body-md`) | `magnifying-glass` light · `chevron-down` light |
| single with search, open | field with the typed text "Contr" (`text/body-md`); panel with 4 items, the chosen one in `text/label-md` | `magnifying-glass` · `xmark` (clear) · `chevron-up` · `chevron-down` ×2, all light |
| multiple, 12 closed | placeholder (`text/body-md`) | `magnifying-glass` light · `chevron-down` light |
| multiple, open | 2 chips (`text/label-sm`); panel with 7 items in `text/body-md` | `magnifying-glass` · `xmark` ×2 (remove chip) · `chevron-down` ×3 (field arrow and 2 branches) · `minus` ×2 (mixed parent) · `check` ×2 (checked) · `chevron-right` ×2, all light |

### Example texts in Figma (translated in the prose)

Placeholders: `Selecione uma opção` ("Select an option", single), `Buscar opção` ("Search for an option", single with search), `Buscar opções` ("Search for options", multiple). Tree items: `Documentos` ("Documents"), `Contratos` ("Contracts"), `Contrato 2025.pdf` ("Contract 2025.pdf", the chosen one), `Contrato 2026.pdf` ("Contract 2026.pdf"), `Relatórios` ("Reports"), `Imagens` ("Images"), `Leia-me.txt` ("Read-me.txt"). Typed search: "Contr". No result: `Nenhum resultado` ("No results") and `Confira o que digitou ou busque…` ("Check what you typed or search…"). Empty: `Nenhum item` ("No items") and `Esta pasta ainda não tem itens` ("This folder has no items yet"). Error row: `Não foi possível carregar.` ("Couldn't load.") and `Tentar de novo` ("Try again").

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The text of the field, of the chips and of the items passes 4.5:1 in both themes and in the brands; each piece carries its own contrast (`nph-select`, `nph-combobox`, `nph-multi-combobox`, `nph-tree`). The disabled field is exempt (WCAG 1.4.3). |
| Visible focus | Field with focus: border `focus/border` and the `focus/halo` halo outside; the border meets 3:1, the halo is decoration. Error with focus: border `status/error` and halo `focus/halo-error`. Open: the field keeps the focus border. Tree item active by the keyboard: the focus of the `nph-tree` item. The documentation (`7147:60061`) says "the focus border of the `nph-tree`, inside the row", as the code of today; the `nph-tree / item` set (`5485:350`) already draws the focus of the list items, a 1 px border outside the row and a 4 px halo outside it, and DSA-93 moves the code to it. The tree select inherits by instance; it draws no focus of its own. On a disabled item, the focus draws on top at full opacity (DSA-75 D-2). |
| Panel outline | Soft outline `tree-select/panel-border` (`color/border-subtle`, the same as the list of the `nph-select`, the `nph-combobox` and the `nph-multi-combobox` after DSA-95): 1.13:1 light over the panel; in dark, 1.36:1 over the panel and 2.02:1 against `color/background`. Decorative: the panel is set apart from the page by the shadow and the background, and each item carries its own contrast. WCAG 1.4.11 asks 3:1 on a border only when it is the only way to find the piece. |
| Color is not the only cue | Chosen item: a bar at the start and the weight of the label, besides the background. Parent with part of the children checked: a dash in the box. Error: the message of the `nph-field`, besides the border. |
| Target size | Field in `control/height-default` or `control/height-large`; tree item in `tree/item-height`. The chevron, the box, the clear and the remove chip targets: 24 × 24. |
| Accessible name | Field with role `combobox`, named by the label of the `nph-field`, `aria-haspopup` `tree` and `aria-expanded`. Panel with role `tree`; in multiple, `aria-multiselectable`. Item with role `treeitem` and the label as the name; `aria-expanded` on a branch; `aria-selected` in single and `aria-checked` in multiple, `mixed` on the mixed parent. Icons with `aria-hidden`. |
| Skeleton | Decorative, `skeleton/background`: 1.16:1 light; 1.29:1 dark over the panel (item 6). The loading is announced by `aria-busy` on the tree, as the `nph-tree` already does. |

## Properties, variants and states (as in Figma)

| Field | Rule |
|---|---|
| `modo` (mode) | `única` (single, default): the `nph-select` field, one item. `única com busca` (single with search): the `nph-combobox` field; typing filters the tree. `múltipla` (multiple): the `nph-multi-combobox` field, with a box in each item and chips in the field. |
| `size` | `default` (default) or `large`: changes the field height, as in the `nph-select`. The panel and the items do not change. |
| `state` | `default` (default), `hover`, `foco` (focus), `erro` (error), `erro-foco` (error-focus), `disabled` and `aberto` (open). Open: the field has the focus border and the panel sits below; in multiple, open is the focus of the field with the chips. |
| panel · `seleção` (selection) | `única` (single) or `múltipla` (multiple), the same as the field mode. The panel has the width of the field of the mode: the `nph-select` and `nph-combobox` width in single, the `nph-multi-combobox` width in multiple. |
| panel · `conteúdo` (content) | `itens` (items, default), `busca` (search: the filtered tree, with the ancestors visible), `sem resultado` (no result), `primeira carga` (first load: the skeleton of the `nph-tree`) and `vazio` (empty: the message of the `nph-tree`). |
| Combined states | Selected or checked + disabled: keeps the background and the mark, under `state/disabled-opacity`. Error + disabled: disabled wins, with no error border. |
| Not a property | Label, help and error: `nph-field`. Chips, several lines and counter: content of the `nph-multi-combobox`. Loading branch and branch error: states of the `nph-tree` in the panel. Panel above the field near the end of the window: position, no variant. |

## Usage (as in Figma)

- Code: `<nph-tree-select></nph-tree-select>`. Package path `@iatec/nephos/nph-tree-select`, as `docs/consuming` and the README say for every component.
- The panel has no tag of its own: it is part of the tree select.

## Relations and context

- It lives inside the `nph-field`: label above, help or error below.
- The panel opens just below the field, at `tree-select/panel-offset`, aligned to the start and with the same width. Near the end of the window, it opens above, at the same distance.
- Each piece controls its own color, state and focus: the field by the `nph-select`, the `nph-combobox` or the `nph-multi-combobox`; the items by the `nph-tree`; the box by the `nph-checkbox`; the empty by the `nph-empty`; the first load by the `nph-skeleton`; the loading branch by the `nph-spinner`.
- A cut label on an item: the `nph-tooltip` shows the whole text.
- In multiple, the field and the panel are wider, so the chips and the indent of the levels fit.

## When to use

- Single choice: one destination, one department, one category.
- Single with search: a large tree, where the person knows the name of the item. The search filters and keeps the ancestors visible.
- Multiple: several items or whole branches. Checking the parent checks the children; with part checked, the parent is mixed. A whole branch checked becomes one chip, the parent's.
- Size large: main form or touch screen, as in the other fields.
- A list with no levels: use the `nph-select` or the `nph-combobox`.

## Required examples (in Figma, light and dark)

- a) Choosing a file in a folder: single choice; the path to the chosen item stays open, and the item has the bar.
- b) Files that go in a submission: multiple choice; the checked ones become chips, and the folder with part checked is mixed.
- c) Finding a contract in a large tree: the person types "Contr", and the tree shows the items that match, with the ancestors.

In the examples the field shows without the `nph-field`, to show the panel; on a screen, it goes inside the `nph-field`.

## Do

- Use the `nph-field` with a visible label. The placeholder goes away when there is a value.
- Use single with search in a large tree. The search keeps the ancestors, and the item does not lose its context.
- In multiple, keep the cascade. Checking the parent checks the children, and the mixed parent shows that part is missing.
- Show the empty and the no result with the message of the `nph-tree`. So the person knows the search ran.
- Show the first load with the skeleton and the loading branch with the spinner in place of the chevron.

## Do not

- Do not put the field on the screen without the `nph-field`: with no label, the placeholder goes away when a value is chosen. Use the `nph-field` with a label. In the demos, the field shows without it to show the piece.
- Do not make the panel narrower: the labels and the indent of the levels do not fit. Use the panel with the field width.
- Do not use multiple when the field takes one item only. Use single choice.

## Default behavior (appendix, accepted with the documentation)

Base: the WAI-ARIA APG combobox with a tree popup and the tree view; the decisions already answered for the family (DSA-29, DSA-46, DSA-31) and for the `nph-tree` (DSA-75 and its approval of 2026-11-11). Each line names its source.

| Moment | What happens | Source |
|---|---|---|
| Open | A click on the field opens the panel. Single: Enter, Space, Down, Up or Alt+Down open on the chosen item, or on the first; Home and End open on the first and the last. Single with search: Down and Up open on the chosen item, or on the first and the last. Multiple: Down and Up open on the first and the last. In the two editable modes, typing opens and filters, and Alt+Down opens without moving the active item. | APG combobox; `fichas/nph-select.md` line 229, `fichas/nph-combobox.md` line 397 and `fichas/nph-multi-combobox.md` line 292 |
| Focus on open | DOM focus stays on the field (`aria-activedescendant` points to the active item of the tree). The active item is the chosen one, with the path to it open; with no value, the first item. | APG combobox, "DOM focus is maintained on the combobox"; `nph-tree` (focus on the selected item) |
| Moving in the tree | Up and Down: previous and next item. Right: opens a closed branch or goes to the first child. Left: closes an open branch or goes back to the parent. In single: Home and End go to the first and the last item, and the asterisk opens the siblings of the level. In single with search and in multiple the field is editable: Home and End move the caret in the text and the asterisk is typed in the field, as in the family. In the editable modes, with an active item, Right and Left act on the branch, as the APG asks for a tree popup; DOM focus stays on the field. | APG combobox (tree popup: "When focus is on a closed node, opens the node") and APG tree view; DSA-75; `fichas/nph-combobox.md` line 580 and `fichas/nph-multi-combobox.md` line 291 |
| Choosing (single and single with search) | Single: Enter, Space or Alt+Up choose the active item and close the panel. Single with search: Enter or Alt+Up choose and close; Space is typed in the field. The value stays in the field, on one line with an ellipsis; focus stays on the field. | `fichas/nph-select.md` line 231; `fichas/nph-combobox.md` line 345; APG combobox; DSA-29 D3 |
| Checking (multiple) | Enter checks and unchecks the active item, and the panel stays open; Space is typed in the field, as every character key. Checking the parent checks the children, and the parent with part checked is mixed. Each checked item becomes a chip; a whole branch becomes one chip, the parent's. | `fichas/nph-multi-combobox.md` lines 248, 291 and 293; APG combobox (a character is typed in the field); DSA-75 (cascade); parent chip: Proposal 2 A, accepted in the root |
| Click on an item | In single, chooses the item and closes the panel; in multiple, checks and unchecks. A click on the chevron only opens or closes the branch. | `nph-tree` ("the chevron opens and closes the branch; the rest of the row selects"); https://ant.design/components/tree-select |
| Cut label | The `nph-tooltip` shows the whole text of an item with a cut label: on focus, at once; on hover, after `motion/hover-delay`. It is the behavior of the `nph-tree`. | DSA-75; accepted documentation of the `nph-tree`, section 6 |
| Typing (search and multiple) | Filters the tree and keeps visible the ancestors of the item that matches; the first item that matches becomes active. In single with search, Enter chooses; in multiple, Enter checks, the panel stays open, the typed text is cleared and the item stays active. With no item that matches, the panel shows the no result. The APG does not cover a filter in a tree; keeping the ancestors follows the market. | DSA-46 D-5 (first item active); `fichas/nph-multi-combobox.md` line 248; https://ant.design/components/tree-select ; https://mantine.dev/core/tree-select |
| Esc | With the panel open: closes, and focus stays on the field. With the panel closed and typed text: clears the text; with no text, passes on. | APG combobox; DSA-46 D-4 |
| Alt+Up | Single and single with search: chooses the active item and closes. Multiple: closes without choosing. Focus stays on the field. | `fichas/nph-select.md` line 231, `fichas/nph-combobox.md` line 345 and `fichas/nph-multi-combobox.md` line 293; APG combobox |
| Tab | Closes the panel without choosing, and focus goes to the next element. | `fichas/nph-select.md` line 193, `fichas/nph-combobox.md` line 348 and `fichas/nph-multi-combobox.md` line 252 |
| Click outside | Closes the panel; the value stays as it was. The APG does not cover the click outside; the tree select follows the market. | https://ant.design/components/tree-select ; https://mantine.dev/core/tree-select ; the family sheets, the click outside fires no change event (`fichas/nph-select.md` line 192, `fichas/nph-multi-combobox.md` line 250) |
| Focus on close | DOM focus does not leave the field while the panel is open. On close by Esc or Alt+Up, and by Enter in single and single with search, it stays on the field. Tab closes and takes the focus forward. On a click outside, focus goes where the person clicked. | APG combobox; the family sheets (Tab) |
| Pointer and focus | Hover only paints the item; it does not move the active item. With both on the same item, the focus wins over the hover. | `nph-tree`, approval of 2026-11-11 (items 4 and 10) |
| Near the window edge | With no room below, the panel opens above, at the same distance. Above `layout/max-list-height`, it scrolls inside; the width does not shrink. | DSA-29 D-2 and D9; https://floating-ui.com/docs/flip |
| Loading branch and error | The spinner takes the place of the chevron of the branch that opens; the first load shows the skeleton. On a branch error, the row says the error and Try again; Enter tries again. The row takes the panel width; when it does not fit, Try again drops below the message, at the same indent (item 5). | `nph-tree`, approval of 2026-11-11 (items 5 and 6); approval of 2026-11-18, item 5 |
| A letter in single (field not editable) | Not in the accepted documentation nor in the appendix. Open with the design owner as D-1 of the task, with the recommendation: closed, the letter opens the panel on the first visible item that starts with it; open, it moves the active item to the next one; the value does not change. | Review of 2026-11-18; APG combobox (select-only) and tree view; `fichas/nph-select.md` line 229; `fichas/nph-tree.md` line 290 |
| Clear (single with search) | The clear target erases the text and gives the focus back to the field. | `nph-combobox` |
| Motion | The panel enters with a fade and a 4 px slide (`motion/enter-*`) and leaves with `motion/exit-*`. With reduced motion, opacity only. | DSA-29 D2 |
| Code | Event, aria, slot, property and console warning stay with the code owner, following the APG and the Custom Elements Manifest. | — |

Sources: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ · https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

## Combined states (T11)

- Rule 1, selected or checked + disabled: the item keeps its background, its bar or its checked box, under `state/disabled-opacity`; the disabled field with a value keeps the value and the chips, under the same opacity.
- Rule 2, error + disabled: disabled wins; the error border goes away and only the opacity stays.
- The rules need no new token.

## Icon and image

| Icon (`nph-icon`) | Size | Where |
|---|---|---|
| `globe`, light | `icon/size-sm` | `nph-select` start icon |
| `chevron-down`, light | `icon/size-sm` | arrow of the `nph-select`, the `nph-combobox` and the `nph-multi-combobox` |
| `chevron-up`, light | `icon/size-sm` | arrow of the `nph-select` and the `nph-combobox`, open |
| `chevron-down`, light | `tree/toggle-icon-size` | chevron of the `nph-tree` item, open branch |
| `chevron-right`, light | `tree/toggle-icon-size` | chevron of the `nph-tree` item, closed branch |
| `magnifying-glass`, light | `icon/size-sm` | start icon of the `nph-combobox` and the `nph-multi-combobox` |
| `xmark`, light | `icon/size-sm` | clear of the `nph-combobox`; remove of the `nph-multi-combobox` chip |
| `minus`, light | `icon/size-sm` | mark of the mixed `nph-checkbox` |
| `check`, light | `icon/size-sm` | mark of the checked `nph-checkbox` |

Every icon comes from the `nph-icon` (Font Awesome), in the `light` weight, with no swap by state in the tree select; the color and the weight swap, when they exist, belong to the piece that brings them. Image: only the illustration of the `nph-empty` in the empty and the no result, light or dark by the theme (`scheme/is-light`), at the size of the piece. The tree select has no image of its own.

## Limits (the "Limites" row of the Figma matrix)

| Case | Rule |
|---|---|
| Minimum | A tree with one item. |
| Maximum | Five levels, with a cut label. |
| Cut label | The `nph-tooltip` shows the whole name. |
| Long text | The value in the field with an ellipsis. |
| Empty | No items: the empty message of the `nph-tree`. |
| Many items | The panel at its maximum height, with a scroll. |
| Short window | The panel opens upward. |

Out of the v1, with the reason (the out-of-scope list of the matrix):

- Checking the parent and the children independently: a business rule per screen; an open point of the code in DSA-75.
- A small size: the Nephos field has no such size; it would come for the whole family.
- A warning status: the Nephos fields have error and no warning; it would come for the whole family.
- A chip that counts the extra items: it does not exist as a piece (pending 6, approved with the page); the counter mode covers the case.
- Showing in the value the parent, the children or all as an option: a rule of the value, of the code (pending 2, resolved in the accepted root: one chip for the parent).

## Inherited decisions

Family: select → combobox → multi-combobox (field and list); plus the `nph-tree` (items). Read on `v/5.0.0`, `docs/operacao/tarefas`.

| Decision | How it comes in |
|---|---|
| DSA-29 D1 | Follows: the panel opens 4 px below the field (`tree-select/panel-offset` → `core/space/100`, item 2). |
| DSA-29 D2 | Follows: enters with a fade and a 4 px slide; leaves with `motion/exit-*`; reduced motion = opacity only. |
| DSA-29 D3 | Follows: the value in the field on one line, with an ellipsis. |
| DSA-29 D4 | Follows: before the choice, the default start icon; no dot in the field. |
| DSA-29 D5 | Follows in part: the selected item keeps `color/primary-surface` with hover and with the keyboard; the item active by the keyboard shows the focus of the `nph-tree` (the focus wins over the hover). |
| DSA-29 D6 | Does not apply: the `nph-tree` item has no status dot. |
| DSA-29 D7 and D8 | Follow: the arrow area with the divider and `color/accent`, by instance of the `nph-select` and the `nph-combobox`. |
| DSA-29 D9 | Follows: `layout/max-list-height` inside the panel, outline outside. |
| DSA-29 D-1 | Follows: on the disabled field, the arrow area loses the `color/accent` background; the divider stays. |
| DSA-29 D-2 | Follows: near the end of the window, the panel opens above, at the same distance. |
| DSA-29 D-3 | Follows: the selected and disabled item keeps `color/primary-surface` under `state/disabled-opacity` (T11). |
| DSA-46 D-4 | Follows: Esc with the panel closed clears the typed text; with no text, passes on. |
| DSA-46 D-5 | Follows: on typing, the first item that matches becomes active; Enter chooses. |
| DSA-46 D-3 | Does not apply in the v1 (pending 3, approved with the page): the `nph-tree` item has no highlighted part. |
| DSA-46 D-1 and D-2 | Do not apply: the "create" row and the shortcut footer stay out of the tree. |
| DSA-67 D-1 to D-4 | Do not apply: the panel is not the `nph-popover` (no arrow, no button trigger, no title, no popover host). |
| DSA-17 D1 to D6 | Follow by instance of the `nph-checkbox` inside the item. |
| DSA-45 D-3 and DSA-17 D7 | Decided in the `nph-tree` (approval of 2026-11-11, item 12): the box takes its own hover, `color/input-hover`. Inherited with no new decision (it was pending 8). |
| DSA-45 D-5 | Follows in part: the chosen item takes `color/primary-text` and weight, with the bar at the start, not the check (Proposal 1 A, accepted in the root). |
| DSA-45 D-6 | Does not apply: in the tree, hover does not move the focus. |
| DSA-31 D1 | Follows: counter mode = subject of the field + number. |
| DSA-31 D2 | Follows: it builds no list of its own; it reuses the `nph-tree`. |
| DSA-31 D3 | Follows: a long chip on one line with an ellipsis, never past the end of the field. |
| DSA-31 D-1 | Does not apply: the checkbox sits in the place of the `nph-tree` item. |
| DSA-31 D-2, D-3 and D-4 | Follow the code of the `nph-multi-combobox` (pending 11, approved with the page). |
| DSA-75 | Follows by instance: parts, chevron and row, hover and focus, loading and error, keyboard and roles, combined states, icons. |
| DSA-75 D-2 | Decided in the `nph-tree`: on the disabled item with focus, the focus draws on top, at full opacity (it was pending 4). |
| DSA-75 D-1 | Does not apply: it belongs to the tree table. |

## The two shared pieces changed by the approval (items 5 and 6)

### `nph-tree` group, error row (item 5, option A)

Before, the error row of the `nph-tree / grupo` set (group, `conteúdo=erro`, `5485:413`) had a fixed width of 336 and cut Try again in the 280 panel. Now, read by script:

- **Error row** (frame, the `treeitem`; Enter tries again): horizontal, centered on the vertical axis; width fill, height hugs; gap `tree/item-gap`; start and end padding `tree/item-padding-inline`; the 4 corners `tree/item-radius`; minimum height `tree/item-height`. The group around it keeps the start padding `tree/indent`.
  - Chevron target (empty frame): 24 × 24, fixed.
  - Error icon: `nph-icon` `triangle-exclamation` `light`, 16 × 16, width and height `tree/icon-size`, centered on the height of the row.
  - **Message and action** (new frame `7324:108107`): horizontal, with wrap; fills the width, hugs the height; gap `tree/item-gap`, between the items and between the wrapped lines.
    - Message: `Não foi possível carregar.` ("Couldn't load."), `text/body-md`, fill `tree/item-foreground`.
    - Action: `Tentar de novo` ("Try again"), `text/label-md`, fill `tree/item-foreground`.
- In the `nph-tree` (row 360), the message and the action stay side by side: 9 instances at 360 × 36, the same as before. In the tree select panel (row 270), Try again drops below the message, at the same indent: 5 instances at 270 × 40.
- The icon is centered on the height of the row (in the preview A it sat at the top), so a one-line row stays as the accepted `nph-tree`.
- The focus of the `nph-tree / item` (`5485:350`) was not touched.

### `nph-skeleton` (item 6)

The 5 fills of the `nph-skeleton` shapes (`1578:37`) moved from `color/muted` to `skeleton/background` → `color/skeleton`. It changes only in dark. Figma instances: 1556 in 17 pages, none overridden (except the 6 of the approval preview, on purpose). Code consumers of the `nph-skeleton`: `nph-tree`, `nph-table`, `nph-data-table`, `nph-notification`, `nph-scheduler`, `nph-sidebar`.

## Decisions answered (approval page of 2026-11-18, all as recommended)

| Item | Decision |
|---|---|
| 1 | Documentation `7145:9081` accepted. |
| 2 | `tree-select/panel-offset` → `core/space/100` straight, by decision (rule 3 of T9), as `popover/offset`; the `nph-select` stays on `space/inline-tight` (DSA-29 D1) until the family decides. |
| 3 | Five semantics gain the panel in their description, with no new semantic: `layout/input-width` ("Width of a field and of the panel it opens: nph-select, nph-combobox, nph-tree-select."), `layout/multi-combobox-width` ("Width of the multiple-choice field and of the panel it opens."), `layout/max-list-height` (with the `nph-tree-select`), `radius/container` (the option list of the `nph-select`, the `nph-combobox` and the `nph-tree-select`) and `color/border-subtle` (the outline of the panel and the list of the family). `space/inline-tight` did not change (item 2). In `design.md` the `use` grows and keeps every accepted use (for example, `layout/input-width` still serves every form field). |
| 4 | The soft outline `color/border-subtle` also on the option list of the `nph-select`, the `nph-combobox` and the `nph-multi-combobox`, in one task of its own for the code owner: DSA-95. In Figma, the list `1357:137` and the 7 variants of the combobox list `1359:141` already draw it; the `nph-multi-combobox` uses the combobox list. |
| 5 | The error row of the `nph-tree` group takes the panel width; when it does not fit, Try again drops below the message, at the same indent (option A). It changes the accepted `nph-tree`; it goes in this task (see the task). |
| 6 | New semantic `color/skeleton` (light `core/surface/50`, dark `core/surface/600`) and `skeleton/background` → `color/skeleton` on the `nph-skeleton` (T9); it changes the `nph-skeleton` sheet only in dark. It goes in this task (see the task). |
| 7 | The arrow of the open branch that holds the chosen item stays gray, `tree/toggle-foreground`; the blue stays only on the chosen item, as the `nph-tree` (option A). Nothing changes in code. |

Points of the appendix that were not approval items follow the recommendation, approved with the approval page of 2026-11-18 ("follows with no decision", the design owner could veto and did not):

- The 7 `tree-select/*` tokens that only alias an existing semantic, with no new value (pending 10 for the width of the multiple mode, 420 in the accepted root).
- Pending 3: no highlight of the searched part in the v1 (the accepted root has none).
- Pending 6: no "+N" chip; the counter of the family stays (DSA-31 D1).
- Pending 7: the field shows only the label of the chosen item; the whole path goes in the accessible name.
- Pending 9: the line of the decision map moves from "postpone" to "comes in", by the rule of the finished component (2026-11-06).
- Pending 11: the tree select follows what the code of the `nph-multi-combobox` adopts for DSA-31 D-2, D-3 and D-4, with no decision of its own; in D-3, the chip repeats the icon of the item when the tree has icons, and has no icon when it does not.
- Pending 15: the 80 gap of the presentation frame of the root stays loose (the same case as the `nph-popover`).

Pending 2 (one chip for a whole branch, the parent's), 4 (focus on the disabled item), 8 (box hover in the item) and 17 (the panel stays open when an item is checked in multiple) were resolved before the page, by the accepted root or by the `nph-tree` and `nph-multi-combobox` decisions. The default behavior, the combined states, the icon and image rules, the order of the parts and the inherited decisions above were accepted with the documentation (item 1).

## Hidden on purpose in Figma

- The panel shows only in `state=aberto` (the open state).
- The clear target shows only in single with search, with text.
- Error on purpose in the documentation: the narrow panel of section 10 ("Do not"), with the width overridden on the instance.
- The 4 hidden instances of section 10 of the documentation (`7148:2201`, `7148:2438`, `7148:2310`, `7148:2531`) and the 8 hidden instances of Proposal 2 (`6281:460`, `6281:509`, `6281:585`, `6281:614`, `6281:662`, `6281:691`, `6281:747`, `6281:776`) leave in the Figma cleanup.

## Sources

- Figma `DS-IA-NEPHOS 5.0`, page `4128:35276`: root `6339:6323`, documentation `7145:9081`, appendix `7149:38729` (sections A to K), matrix `6267:32` (the "Limites" row `6271:88`)
- Sets: `nph-tree-select` `6339:8107`; panel `6339:8110`; `nph-tree / grupo` error `5485:413`; `nph-tree / item` `5485:350`; `nph-skeleton` `1578:37`; `nph-select / lista` `1357:137`; `nph-combobox / lista` `1359:141`
- Figma variables `VariableID:7324:32` to `VariableID:7324:41` and the seven descriptions (`VariableID:1256:5`, `VariableID:1482:1083`, `VariableID:1397:677`, `VariableID:102:13`, `VariableID:4907:587`, `VariableID:2309:53969`, `core/space/100`)
- WAI-ARIA APG, combobox: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WAI-ARIA APG, tree view: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2, reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- Market, read for the approval items: https://raw.githubusercontent.com/ant-design/ant-design/master/components/select/mergedBuiltinPlacements.ts ; https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/styles/scss/components/list-box/_list-box.scss ; https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/new-york-v4/ui/skeleton.tsx ; https://fluent2.microsoft.design/components/web/react/core/messagebar/usage ; https://ant.design/components/tree-select ; https://mantine.dev/core/tree-select
- `design.md` — the tokens named above
- `fichas/nph-tree.md`, `fichas/nph-skeleton.md`, `fichas/nph-select.md`, `fichas/nph-combobox.md`, `fichas/nph-multi-combobox.md`
