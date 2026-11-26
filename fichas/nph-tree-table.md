---
piece: nph-tree-table
level: component
status: active
solves: >-
  Lets the person read, search, sort and select records that have a parent and child hierarchy
  with the same columns at every level, such as unit and sub-unit, opening each branch in place
  and loading its children on demand, with the error of a branch shown in its own row.
use_when:
  - "Records with parent and child and the same columns at every level: unit and sub-unit, account and sub-account, project and stage."
  - "A hierarchy the person searches, sorts, selects and acts on, with the toolbar, the bulk bar, the row actions and the pagination of the data table."
  - "Children that come from the server: the branch opens, shows its loading in the chevron and receives its children or its error row."
  - "Selecting a whole branch with one box, or only part of it, with the parent shown as partial."
  - "Size large on a touch screen or for reading with more air; default in the other cases."
do_not_use_when:
  - "For a hierarchy with no data columns: use nph-tree, the navigation tree."
  - "For a detail that is not a table (text, a record card, a form) under a row: use nph-data-table with the expanded item, which does not become a level."
  - "For data with no hierarchy: use nph-data-table, or nph-table to only read."
  - "For a hierarchy deeper than three levels: take the screen back to the UX review."
  - "For a first load that fails: the table has no row for it; the page shows its own message."
api:
  inherits:
    type: string
    required: false
    default: "nph-data-table"
    reflects: false
    constraint: >-
      Every attribute, property, slot and event of nph-data-table, which builds on nph-table: size, framed, sticky-header,
      striped, grid, caption, description, total, label, no-value-label, empty-heading, empty-description, columns,
      rows, footer, sort-key, sort-direction, selectable, selected, select-all-label, select-label, selected-text,
      actions, actions-label, switch-header, switch-label, loading, clear-label, page, page-size, page-sizes,
      total-items, pagination-layout and the labels of the footer. Same cells, same toolbar and bulk slots, same events.
  rows:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The rows of nph-data-table, with key, name, cells, open, loading and toggleLabel, plus children, the rows
      of the next level (up to three levels in all), branch, a branch whose children the page has not loaded, and error,
      a branch whose load failed. children empty is a leaf. A row that opens needs toggleLabel, the name of its chevron. A row
      below the third level is left out and emits console.error in development. Rows arrive already searched, sorted and
      paged; sorting works inside each level, the search brings the parents of what it finds, and total-items counts only
      the first level.
  error-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The phrase of the branch error row, already localized, such as Could not load. Empty with an error row drawn warns
      once in development.
  retry-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The action of the branch error row, already localized, such as Try again. Empty with an error row drawn warns once in
      development.
  events:
    nph-row-load: "{ row, retry }: a branch that is not loaded was opened (retry false), or Try again was pressed on its error row (retry true). The page answers by replacing rows with the children or with error"
    nph-row-toggle: "{ row, open }: the person opened or closed a row. rows is replaced with a new list where that row has the new open"
    nph-selection-change: "{ selected }: the keys of every row checked, parents included, with the cascade applied. It also fires when children that arrive under a checked parent come checked"
    nph-sort-change: "{ key, direction }: as in nph-data-table"
    nph-page-change: "{ page, pageSize }: as in nph-data-table"
    nph-row-action: "{ row, action }: as in nph-data-table"
    nph-row-switch: "{ row, checked }: as in nph-data-table"
    nph-filter-clear: "the person pressed the button that clears the search in the empty body"
  slots:
    toolbar: "the nph-toolbar of the page type above the table"
    bulk: "the nph-toolbar of the bulk type that takes the place of the page bar while a row is selected"
    action: "the main action of the caption"
variants:
  size:
    axis: size
    choose_when: "Default on a mouse screen; large on a touch screen or for reading with more air. Large gives more air on the sides and a selection column wider than default; the row with actions keeps its height."
    do_not_combine_with: []
  state:
    axis: appearance
    choose_when: "Default with rows; loading for the first load of the whole table, with the header in view and skeleton rows; empty by search when the toolbar search finds nothing. A branch that loads uses the loading chevron, never the loading state."
    do_not_combine_with:
      - "state loading to show the load of a branch: the loading stays in the chevron, with no skeleton row."
states:
  open:
    token: table/expand-indent
    changes_for_user: "The chevron turns down and the children appear under the parent, one step of table/expand-indent plus table/cell-gap further in per level."
  loading-branch:
    token: not_applicable
    changes_for_user: "The chevron becomes the loading icon-only button and the row is busy. No skeleton row is drawn. The children or the error row arrive in its place."
  error-row:
    token: "tree-table/row-background, tree-table/error-foreground, tree-table/error-icon-foreground"
    changes_for_user: "A whole row at the level of the children shows an alert icon, the message and Try again, in place of the children. The whole row is the target."
  error-row-hover:
    token: "tree-table/row-background-hover, tree-table/error-foreground-hover"
    changes_for_user: "The row takes the hover background of the table family and the text keeps its contrast."
  row-focus:
    token: "tree-table/focus-halo, tree-table/focus-border"
    changes_for_user: "With the keyboard, the focused row shows a halo at its edge and a border inside it, both with corners and stopping one divider above the base. The selected bar stays above them."
  selected:
    token: "data-table/row-selected-background, data-table/row-selected-indicator"
    changes_for_user: "The whole row takes the selected background and a bar at the start; the box is checked."
  partial:
    token: not_applicable
    changes_for_user: "A parent with only part of its loaded children checked shows the dash in its box and takes no selected background."
  hover:
    token: table/row-hover-background
    changes_for_user: "The whole row, the tree cell included, takes the hover background. Hover only paints: it does not move the focus."
business_rules:
  - "A row opens only through its chevron or the keyboard. A click on the rest of the row neither opens the branch nor checks the box."
  - "The tree goes down to three levels. A row below the third is left out and a console.error is emitted in development."
  - "A branch that loads and comes back with no children becomes a leaf: the chevron leaves, its space stays and the row stops carrying aria-expanded."
  - "Opening a branch that is not loaded fires nph-row-load once and the row is busy until rows brings its children or its error."
  - "A failed branch shows the error row in the place of its children. Closing and opening it shows the error row again; only Try again asks for the load."
  - "Try again takes the error row out, puts the branch back to loading and fires nph-row-load with retry true. A focus on the error row goes to the branch row."
  - "Selection is by the box only, in a column of its own with no indent. Checking a parent checks its loaded children at any depth, open or not; unchecking it unchecks them."
  - "A parent whose loaded children are all checked is checked and is in selected; with only part of them checked it is partial and is not in selected."
  - "A parent whose children are not loaded is checked by itself. Children that arrive later under a checked parent come checked and nph-selection-change reports them."
  - "The header box checks the rows drawn, open children included; the bulk bar counts the keys of selected, parents and children together."
  - "The error row is not selectable and is not counted in aria-setsize or aria-posinset of its siblings."
  - "Sorting, search and pagination are the page's: the table keeps what the person chose and says so in events. total-items is the number of first level rows."
domain_errors:
  - "A branch whose children failed to load: the error row, with Try again."
  - "A first load of the whole table that fails has no row in the contract; the page shows its own message."
tokens:
  error-row: [tree-table/row-background, tree-table/row-background-hover, tree-table/border, tree-table/border-width, tree-table/row-padding-block, tree-table/row-height, tree-table/cell-padding-inline, tree-table/cell-gap, tree-table/indent, tree-table/error-gap]
  error-text: [tree-table/error-foreground, tree-table/error-foreground-hover, tree-table/error-icon-foreground, tree-table/error-icon-size]
  focus: [tree-table/focus-halo, tree-table/focus-halo-width, tree-table/focus-halo-radius, tree-table/focus-border, tree-table/focus-border-width, tree-table/focus-border-radius]
  selection: [data-table/row-selected-background, data-table/row-selected-indicator, data-table/row-selected-indicator-width]
  tree-column: tree-table/tree-column-min-width
  table: "every token of nph-table and nph-data-table, by composition, with no change"
ai_hints:
  - "Use nph-tree-table when records have parent and child and the same columns at every level; use nph-tree for a navigation tree with no columns and nph-data-table for records with no hierarchy."
  - "Give every row that opens a toggleLabel already localized, such as Open Oregon: it names the chevron."
  - "Mark a branch whose children are not loaded with branch, listen to nph-row-load and answer by replacing rows with the children, or with error when the load fails."
  - "On nph-row-load with retry true, load again and answer the same way; do not draw your own error row."
  - "Give the table error-text and retry-text already localized whenever a branch can fail."
  - "Give the tree column a width: the page decides it, and the component keeps a floor. A long text is cut with an ellipsis and a tooltip."
  - "Cut the pages by first level rows and set total-items to their number; the children stay on the page of their parent."
  - "Do not build a fourth level, a disabled row, a stripe, expand all or a fixed tree column: they are out of this version."
accessibility:
  semantics: "The table is a treegrid. Each row carries aria-level, aria-posinset and aria-setsize and, when it opens, aria-expanded. The row that loads its children carries aria-busy. The error row is a row at the level of the children, read as its message and its action together."
  accessible_name: "The caption title names the table, with the description as its description; without a caption, label. The chevron takes its name from toggleLabel of each row, the box from select-label with the name of the record, and the error row from its text."
  keyboard:
    - "Tab reaches one body row, the last one that had the focus or the first, then its box, its chevron, its buttons and its cut text only, and leaves the table. The sortable header, the toolbar and the footer stay in the Tab order before and after the body."
    - "On a row: Down and Up go to the next and the previous row, among the visible ones, the error row included; Right opens a closed row or goes to the first cell; Left closes an open row or goes to the parent; Home and End go to the first and the last row; Enter opens and closes the branch."
    - "On the error row: Enter tries again; Left goes to its branch; Down and Up move among the rows."
    - "On a cell: Right and Left move along the row, Left on the first cell goes back to the row; Down and Up keep the column; Home and End go to the first and the last cell; Ctrl+Home and Ctrl+End go to that column in the first and the last row."
    - "Space and Enter on the box check and uncheck it. Opening a branch from the keyboard leaves the focus on its row."
    - "Esc closes the open tooltip of a cut text, without moving the focus."
  focus: "The focused row shows tree-table/focus-halo at the edge and tree-table/focus-border inside it, with corners, stopping one divider above the base. A focused cell keeps the ring of nph-table. The chevron, the box and the buttons keep the focus of their own piece. The selected bar stays above the focus."
  contrast: "Text passes 4.5:1; the chevron, the error icon and the focus border pass 3:1, in light and dark, over the row background at rest, in hover and selected. The divider of the error row is decorative."
  color_alternative: "A selected row has its box checked and a bar besides the background. A partial parent shows the dash. An open branch turns its chevron. The error has an icon, a message and an action in text."
invalid_combinations:
  - "A fourth level: the row is left out and console.error is emitted in development."
  - "A row that opens with no toggleLabel: the row is left out and console.error is emitted in development."
  - "A row with both detail and children: the row is left out and console.error is emitted in development."
  - "An error row with no error-text or retry-text: it draws empty and warns once in development."
  - "A row with branch and no children, with no answer from the page: it stays busy."
relations:
  combines_with: [nph-toolbar, nph-pagination, nph-checkbox, nph-empty, nph-tooltip]
  parents: ["a page or a card that shows records with a hierarchy"]
  children: [nph-checkbox, nph-button, nph-icon, nph-badge, nph-skeleton, nph-empty, nph-tooltip, nph-toolbar, nph-pagination, nph-select]
  complements_block: []
  appears_in: []
anti_patterns:
  - "A hierarchy with no data columns in a table."
  - "A detail that is not a table as a child of a branch."
  - "A long text that runs into the next column."
  - "Opening a branch by a click on the row."
  - "A box inside the indent: the boxes stay in a column of their own."
  - "Four levels or more."
sources:
  design_md: "design.md, the tree-table/* tokens, the table/* and data-table/* tokens, focus/border, focus/halo and status/error"
  decision: "P141 — nph-tree-table: API and semantics (DSA-102)"
  tests: "src/components/nph-tree-table/nph-tree-table.test.ts"
  usage_evidence: "the three required examples of the nph-tree-table Examples story"
  storybook: "src/components/nph-tree-table/nph-tree-table.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page 1626:47, documentation 7812:13461, root 7618:6203, sets 7617:6784 and 7604:167"
---

# nph-tree-table

## Function

**The problem it solves:** a data table whose rows have a parent and child hierarchy and the same
columns at every level. The first column carries the tree: an indent per level, the chevron that opens
and closes the branch, and the text. The rest is the table of `nph-data-table`: caption, toolbar,
sortable header, selection box, bulk bar, row actions, footer with pagination, loading and empty by
search. A branch can load its children on demand, and when the load fails the branch error row takes
their place.

**When to use:**

- Records with parent and child and the same columns at every level: unit and sub-unit, account and
  sub-account, project and stage.
- A hierarchy the person searches, sorts, selects and acts on.
- Children that come from the server: the branch opens, the chevron becomes the loading button and the
  children or the error row arrive.
- Selecting a whole branch with one box, or only part of it, with the parent shown as partial.

**When NOT to use:**

- **For a hierarchy with no data columns** — use `nph-tree`, the navigation tree.
- **For a detail that is not a table** (text, a record card, a form) under a row — use `nph-data-table`
  with the expanded item: the detail opens under the row and does not become a level.
- **For data with no hierarchy** — use `nph-data-table`, or `nph-table` to only read.
- **For more than three levels** — take the screen back to the UX review.
- **For a first load that fails** — the table has no row for it, as `nph-data-table` and `nph-tree`: the
  page shows its own message.

## Variants

| What | Values | Rule |
|---|---|---|
| Size | `default`, `large` | As `nph-data-table`. Large gives more air on the sides (`table/container-padding`) and makes the selection column wider; the row with actions keeps its height |
| State (Figma `estado`) | default, loading, empty by search | Default: rows with data. Loading: the first load of the table, with the header in view and skeleton rows. Empty by search: the search found nothing and the `nph-empty` takes the place of the rows |

The branch error row has its own properties in Figma: the level of the children (2 or 3), the state
(default, hover, focus) and whether the selection space is there. In code none is a property: the level
comes from the data, the hover and the focus from the pointer and the keyboard, and the selection space
from `selectable`.

**Do not combine with:** the loading state to show the load of a branch; a stripe, a disabled row,
expand and collapse all or a fixed tree column, which are out of this version.

## States

| State | Token | What changes for the person |
|---|---|---|
| Open | `table/expand-indent` | The chevron turns down and the children appear under the parent, one step of `table/expand-indent` plus `table/cell-gap` further in per level |
| Loading branch | `not_applicable` | The chevron becomes the loading icon-only button, the row is busy and no skeleton row is drawn. The opened branch keeps the focus on the row |
| Error row | `tree-table/row-background`, `tree-table/error-foreground`, `tree-table/error-icon-foreground` | A whole row at the level of the children, in place of the children, with the alert icon, the message and Try again |
| Error row hover | `tree-table/row-background-hover`, `tree-table/error-foreground-hover` | The hover background of the table family; the text keeps its contrast |
| Row focus | `tree-table/focus-halo`, `tree-table/focus-border` | A halo at the edge and a border inside it, with corners, stopping one divider above the base |
| Selected | `data-table/row-selected-background`, `data-table/row-selected-indicator` | The whole row takes the background and a bar at the start; the bar stays above the focus |
| Partial | `not_applicable` | A parent with part of its loaded children checked shows the dash in its box and no selected background |
| Hover | `table/row-hover-background` | The whole row, the tree cell included, takes the hover background |

**Feedback and focus rules:**

- Hover only paints the row; it does not move the focus. With focus and hover on the same row, the focus
  stays above the hover background.
- The tree cell has no background of its own: it takes the same background as the other cells of the row
  in rest, hover and selected.
- The row focus replaces, in the tree table only, the 2 px ring `nph-table` draws on a row of its tree. A
  focused cell keeps that ring; the chevron, the box and the buttons keep the focus of their own piece.

**Business rules the piece carries:**

- A row opens only through its chevron or the keyboard; a click on the rest of the row neither opens the
  branch nor checks the box.
- The tree goes down to three levels.
- A branch that loads and comes back with `children` empty becomes a leaf: the chevron leaves, its space
  stays so the text does not move, and the row stops carrying `aria-expanded`.
- Selection is by the box, with the cascade described below.
- Sorting, search and pagination are the page's. The sort works inside each level, the search shows the
  matching rows and their parents, and the pagination counts only the first level: the children stay on
  the page of their parent. Whether a match under a closed parent shows that parent open is the page's
  call: it sends `open` on the rows.

**Domain error states:** a branch whose children failed to load, shown in its error row. A first load of
the whole table that fails has no row: the page shows its own message.

## Using it

```html
<nph-tree-table
  caption="People by region"
  error-text="Could not load."
  retry-text="Try again"
  selectable
  select-all-label="Select all"
  select-label="Select {name}"
></nph-tree-table>
```

```ts
table.columns = [
  { key: 'unit', header: 'Unit', width: '320px' },
  { key: 'people', header: 'People', align: 'end' },
];
table.rows = [
  {
    key: 'south',
    name: 'West Region',
    cells: { unit: 'West Region', people: 920 },
    toggleLabel: 'Open West Region',
    open: true,
    children: [{ key: 'oregon', name: 'Oregon', cells: { unit: 'Oregon', people: 310 }, toggleLabel: 'Open Oregon', branch: true }],
  },
];
table.addEventListener('nph-row-load', async ({ detail }) => {
  const children = await load(detail.row);
  table.rows = withChildren(table.rows, detail.row, children);
});
```

- The first column is the tree column. Its plain text is cut to one line with an ellipsis and the whole
  text goes to the `nph-tooltip`; the width is the page's, and the component keeps a floor.
- `nph-row-load` fires when a branch with `branch` and no `children` is opened, and when Try again is
  pressed. Answer by replacing `rows` with the branch carrying `children`, or `error: true`.
- While the answer is on its way the branch is busy. A row the page already knows is loading can say so
  with `loading`.
- The table never filters, sorts or cuts a list: it says what the person chose in `nph-sort-change`,
  `nph-page-change` and `nph-selection-change`, and the page sends the rows again.

## Selection with the cascade

`selected` lists the keys of every checked row, the ones on other pages too. The table keeps it
consistent with the rows it knows:

1. Checking a parent checks its loaded children at any depth, open or closed. Unchecking it unchecks them.
2. A parent whose loaded children are all checked is checked, and its key is in `selected`.
3. A parent with only part of its loaded children checked is partial and its key is not in `selected`.
4. A parent whose children are not loaded is checked by itself. When its children arrive under it, they
   come checked and `nph-selection-change` reports it.
5. Unchecking one child takes its parents out of `selected`.
6. A `selected` given by the page with a parent and without its children is read as that parent checked.
7. The bulk bar counts the keys of `selected`, parents and children together; `{total}` is `total-items`,
   or the rows drawn when it is not given.
8. A row with no `name` has no box and stays out of the cascade.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | `role="treegrid"`. Each row carries `aria-level`, `aria-posinset`, `aria-setsize` and, when it opens, `aria-expanded`. The row that loads carries `aria-busy="true"`. The chevron does not carry the open state: the row does |
| Error row | A row at the level of the children (`aria-level` one above its branch), with `aria-posinset` and `aria-setsize` 1, not counted among its siblings. Its name is the message and the action together; the icon is decorative |
| Keyboard | The APG treegrid, rows first, with one body row as the Tab stop. The full list is in `accessibility.keyboard` |
| Focus | The row focus is a halo and a border with corners. When the error row that held the focus leaves because of Try again, the focus goes to the branch row, the nearest branch still drawn |
| Truncated text | The cut text shows the whole text in a tooltip on hover and on focus, and Esc closes it (WCAG 1.4.13). While the pointer is over a cut text, its row takes the Tab stop and gives it back when the pointer goes to another row, leaves the table or the person presses Tab |
| Contrast | Text 4.5:1; the chevron, the error icon and the focus border 3:1, in both themes, over rest, hover and selected |
| Touch target | The chevron is 28 px and the box has a 24 px area, above the 24 px of WCAG 2.5.8. The whole error row is the target of Try again |
| Alternative to color | Selected: box and bar. Partial: the dash. Open: the chevron turns. Error: icon, message and action in text |

## Relations

**Combines with:** `nph-toolbar` (the page bar and the bulk bar), `nph-pagination`, `nph-checkbox`,
`nph-empty` and `nph-tooltip`.

**What is the parent:** a page or a card that shows records with a hierarchy.

**What is the child:** `nph-checkbox`, `nph-button` (the chevron, with the loading state, and the more of
each row), `nph-icon`, `nph-badge`, `nph-skeleton`, `nph-empty`, `nph-tooltip`, `nph-toolbar`,
`nph-pagination` and `nph-select`.

**Which block this piece complements:** none.

**Appears in layouts:** none.

**What it takes from other pieces:** it builds on `nph-data-table`, which builds on `nph-table`, and takes
their cells, columns, header, selection column, bars, footer and states. The tree cell is the one of
`nph-table`; the treegrid and its keyboard are the ones of the `nph-table` tree. What it adds is the
selection with the cascade, the load of a branch with its error row, the row focus and the tree column
floor.

**Responsibility boundary:** the table draws, keeps what the person chose and says so in events. The page
loads the children, sorts, searches, cuts the pages and replaces `rows`.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Error row background, at rest and in focus | `tree-table/row-background` |
| Error row background, in hover | `tree-table/row-background-hover` |
| Error row divider | `tree-table/border` in `tree-table/border-width` |
| Error row sides | `tree-table/cell-padding-inline` |
| Error row above and below | `tree-table/row-padding-block`, with `tree-table/row-height` as a floor |
| Error row gap and indent | `tree-table/cell-gap` between the blocks, `tree-table/indent` for each indent and for the chevron space |
| Error block | `tree-table/error-gap` between icon, message and action |
| Error icon | `tree-table/error-icon-foreground` in `tree-table/error-icon-size` |
| Error text, at rest and in hover | `tree-table/error-foreground`, `tree-table/error-foreground-hover` |
| Row focus | `tree-table/focus-halo` in `tree-table/focus-halo-width` with `tree-table/focus-halo-radius`; `tree-table/focus-border` in `tree-table/focus-border-width` with `tree-table/focus-border-radius` |
| Selected row | `data-table/row-selected-background`, and the bar `data-table/row-selected-indicator` in `data-table/row-selected-indicator-width` |
| Title, caption and page size label | `table/foreground`, `table/caption-foreground`, `data-table/page-size-label-foreground`, from the data table |
| Floor of the tree column | `tree-table/tree-column-min-width` |
| The table itself | The tokens of `nph-table` and `nph-data-table`, with no change |

**Usage restrictions:** the tree table consumes only tokens of the semantic layer, never `core/*` or
`theme/*` directly. The row hover of the table family and the divider of the data rows stay with
`nph-table`. The error row height is the height of the data rows of the table: with no buttons in the
cells it takes the vertical padding of the table cell, and with a button in a cell it takes
`tree-table/row-padding-block`; `tree-table/row-height` is the floor in both cases.

**AI hints:**

- Use `nph-tree-table` when records have parent and child and the same columns at every level; use
  `nph-tree` for a navigation tree with no columns and `nph-data-table` for records with no hierarchy.
- Give every row that opens a `toggleLabel` already localized, such as `Open Oregon`: it names the chevron.
- Mark a branch whose children are not loaded with `branch`, listen to `nph-row-load` and answer by
  replacing `rows` with the children, or with `error: true` when the load fails.
- On `nph-row-load` with `retry: true`, load again and answer the same way. Do not draw your own error row.
- Give the table `error-text` and `retry-text` already localized whenever a branch can fail.
- Give the tree column a `width`: the page decides it and the component keeps a floor.
- Cut the pages by first level rows and set `total-items` to their number.
- Do not build a fourth level, a disabled row, a stripe, expand all or a fixed tree column.

## Examples

**Recommended cases** (the three the contract requires):

- **Units by region:** West Region partial; the first state and its two cities checked; the second state
  loading; and the third state open with the branch error row.
- **A search with no result:** the toolbar search found nothing and the `nph-empty` explains what to do
  (empty by search, large).
- **The first load of the table:** the header stays in view and skeleton rows fill the body (loading,
  large).

**Alternative cases:** the error row at level 3 with and without the selection space; a long name at
level 3 cut with its tooltip; a branch that comes back with no children and becomes a leaf.

## Anti-patterns

- **Do not use a table for a hierarchy with no data columns** — use `nph-tree`.
- **Do not put a detail that is not a table under a branch** — use the expanded item of `nph-data-table`.
- **Do not let a long text run into the next column** — cut it with an ellipsis and the tooltip.
- **Do not open a branch by a click on the row** — the chevron and the keyboard open it.
- **Do not put the box inside the indent** — the boxes stay in a column of their own.
- **Do not go below the third level.**
- **Invalid combinations:** a fourth level; a row that opens with no `toggleLabel`; a row with both `detail`
  and `children`; an error row with no texts. The table emits `console.error` or `console.warn` in
  development.
- **Do not create or adapt without a decision:** a disabled row, expand and collapse all, a fixed tree
  column, a stripe, independent selection, single selection or a priority between the load and the error.

## Known limits

- **First load that fails:** no row; the page shows its own message.
- **Narrow window:** the table scrolls horizontally in its own scroll area, which takes the focus when it
  overflows. The tree column is not fixed.
- **The more of each row:** the buttons that open a menu on rows that are not the Tab stop leave the Tab
  order with `tabindex="-1"` on the host of the `nph-button`. A closed menu leaves no `aria-expanded` on that
  host, and the native button still reads `false`.
- **The tree cell state in Figma:** the tree cell of `nph-table` and the selection of `nph-data-table`
  gain, in Figma and apart from this piece, the state of the cell with the row background, the cut with
  the tooltip and the partial box on a row. The code already does what the accepted composition draws.
- **The nph-table tree:** its row focus stays the 2 px ring, and its hover tooltip opens only on the row
  that is the Tab stop. The tree table does not change either of them.

## Sources and decisions

- **The repository `design.md`:** the `tree-table/*` tokens, `table/*`, `data-table/*`, `focus/border`,
  `focus/halo` and `status/error`. The tokens are in `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P141, which closes the open points of the contract: the API over
  `nph-data-table`, the cascade of the selection, the roles of the error row, the load and Try again.
- **Pending decisions:** none.
- **Tests:** `src/components/nph-tree-table/nph-tree-table.test.ts`.
- **Usage evidence:** the three required examples of the `nph-tree-table` Examples story.
- **Storybook:** `src/components/nph-tree-table/nph-tree-table.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, page `1626:47`, documentation `7812:13461`, root `7618:6203`, sets
  `7617:6784` and `7604:167`.
