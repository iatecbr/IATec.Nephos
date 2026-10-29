---
piece: nph-data-table
level: component
status: active
solves: >-
  Lets the person search, sort, select and act on records in a table, with a toolbar above
  it, the bulk action bar in its place while rows are selected, row actions and pagination.
use_when:
  - "For lists of records that the person searches, sorts or filters, such as people by unit."
  - "Bulk selection when there is an action on several rows at once, such as download or delete."
  - "Row actions in the more when the row has more than one action."
  - "A column with a switch when the person turns a value of the row on or off without opening another screen."
  - "Size large on a touch screen or for reading with more air; default in the other cases."
do_not_use_when:
  - "To only read and compare data, without searching, sorting or selecting: use nph-table."
  - "To lay out the page: the table holds records."
  - "With a search that finds nothing and a blank body: use the empty by search state."
  - "To mark a row by the background alone: select it, with the box checked too."
api:
  size:
    type: enum
    values: [default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      As in nph-table: the row in table/row-height or table/row-height-large. Large is for
      touch or reading with more air. A value outside the list draws nothing.
  framed:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      As in nph-table, the Figma `moldura`: the border and the corner of the scroll area, for a
      table standing alone on the page.
  sticky-header:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      As in nph-table, the Figma `cabeçalho fixo`: the body scrolls under the header, which stays.
  striped:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      As in nph-table, the Figma `faixa` of the row: every other row on the stripe background.
  grid:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      As in nph-table, the Figma `grade`: the vertical line between the columns of the body.
  caption:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      As in nph-table, the Figma `legenda` and `texto da legenda`: the title above the table,
      already localized, which names it.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      As in nph-table, the Figma `descrição`: the line under the caption title. Only with a caption.
  total:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      As in nph-table, the Figma total: an nph-badge secondary beside the caption title. With a
      single page, it carries the total in place of the footer.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      As in nph-table: the accessible name of a table without a caption.
  no-value-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      As in nph-table: what the screen reader reads in the no-value dash, such as `sem valor`.
  empty-heading:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      As in nph-table: the heading of the nph-empty when there is no row. In empty by search,
      it says the searched term, already written by the consumer.
  empty-description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      As in nph-table: the description of the nph-empty when there is no row.
  columns:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The columns of nph-table, each with key, header, align, group and width,
      plus sortable: the header becomes a button that sorts the column. The order of the columns
      comes from the data. An invalid list draws nothing, as in nph-table.
  rows:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The rows of nph-table, with key, cells, detail, open, loading and
      toggleLabel, plus name, the record that fills {name}, and switched, the state of the
      `ajuste`. They arrive already searched, sorted and paged: the table cuts or orders nothing.
      A row with children is drawn without them and emits console.error in development.
  footer:
    type: object
    required: false
    default: "null"
    reflects: false
    constraint: >-
      As in nph-table: a value per column key, drawn with the background of the header.
  sort-key:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The key of the sorted column, with sort-direction. A key that is not a sortable column
      draws no column sorted and warns in development.
  sort-direction:
    type: enum
    values: [ascending, descending]
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The direction of the column of sort-key, the value of its aria-sort. Empty, no column is
      sorted. A value outside the list draws no column sorted and emits console.error in
      development.
  selectable:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Adds the selection column, with an nph-checkbox in the header and in each row. It needs
      select-all-label and select-label; without them the column is left out and the table
      emits console.error in development.
  selected:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The keys of the selected rows, the ones on other pages too. The table
      changes it when the person checks a box.
  select-all-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The name of the header box, already localized, such as `Selecionar todas`.
  select-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The name of a row box, with the {name} marker filled by the row name, such as
      `Selecionar {name}`. A row without name has no box and the table emits console.error in
      development.
  selected-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The count of the bulk bar, with the {count} and {total} markers, filled with the numbers
      in the language of the page, such as `{count} de {total} selecionadas`. The table writes it
      as the count-text of the nph-toolbar in the slot bulk. {total} is total-items, or the rows
      drawn without it.
  actions:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The entries of the nph-dropdown-menu that the more of each row opens, with
      Delete last in destructive. Empty, there is no actions column. It needs actions-label.
  actions-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The name of the more of a row, with {name}, such as `Mais ações de {name}`. Without it the
      actions column is left out and the table emits console.error in development.
  switch-header:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The title of the `ajuste` column, already localized. Empty, there is no `ajuste` column. It
      needs switch-label.
  switch-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The name of the nph-switch of a row, with {name}. Without it the `ajuste` column is left
      out and the table emits console.error in development.
  loading:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma `estado` `carregando`: an nph-skeleton in the cells of data, as many rows as the
      rows shown or the page size, with the header visible and the header box disabled.
  clear-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The Figma `estado` `vazio pela busca`: with no row and an empty-heading, the body holds the
      nph-empty and an nph-button with this text, such as `Limpar filtro`, data-table/empty-gap
      apart. Empty, an empty body is the one of nph-table.
  page:
    type: number
    required: false
    default: "1"
    reflects: false
    constraint: >-
      The current page, a whole number from 1. The table changes it when the person moves.
  page-size:
    type: number
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The items per page, a whole number from 1. Required for the footer. The table changes
      it when the person picks another size, and the first item on screen stays on screen.
  page-sizes:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      The options of items per page, whole numbers from 1. As an attribute, a JSON list.
      Without it, the footer has no items per page.
  total-items:
    type: number
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The total of records, a whole number from 0. Required for the footer; with no more than
      one page, there is no footer.
  pagination-layout:
    type: enum
    values: [wide, middle, narrow]
    required: false
    default: middle
    reflects: true
    constraint: >-
      The footer for the width of the table's space (pending decision D-1): wide is the
      nph-pagination `tipo tabela`; middle, the label and the nph-select of items per page and
      `tipo intervalo`; narrow, `tipo intervalo` only. A value outside the list leaves the footer
      out and emits console.error in development.
  pagination-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The label of the nph-pagination, the name of its navigation.
  page-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The page-label of the nph-pagination, with {page}.
  first-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The first-label of the nph-pagination; required in wide.
  previous-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The previous-label of the nph-pagination.
  next-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The next-label of the nph-pagination.
  last-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The last-label of the nph-pagination; required in wide.
  position-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The position-text of the nph-pagination, with {start}, {end} and {total}.
  page-size-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The visible label of items per page, which names its nph-select, in
      data-table/page-size-label-foreground. In wide it goes to the nph-pagination.
  toolbar:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      One nph-toolbar `tipo página`, with the search, the filter and the table actions. It stays
      outside the scroll area and leaves its place to the bulk bar while a row is selected.
  bulk:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      One nph-toolbar `tipo em massa`, with its actions and without its own checkbox: the
      select-all box stays in the table header. It shows while a row is selected.
  action:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      As in nph-table: the main action of the caption.
  nph-sort-change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person sorts, with detail { key, direction }. A column that was not sorted
      goes ascending, and the sorted one turns around (pending decision D-3). Bubbles, not
      composed; setting the sort from code fires nothing.
  nph-selection-change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person checks or unchecks a box, with detail { selected }. The header box
      checks or unchecks the rows drawn (pending decision D-4). Bubbles, not composed.
  nph-row-action:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The event of nph-table, with detail { row, action }: also when the person picks an entry
      of the menu of the more, with action the value of the entry.
  nph-row-toggle:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      As in nph-table: the person opened or closed a row by its chevron, with detail { row, open }.
  nph-row-switch:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person turns the nph-switch of a row, with detail { row, checked }. The
      consumer keeps switched in the row. Bubbles, not composed.
  nph-filter-clear:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person activates the button of the empty by search state. The consumer
      clears the search and passes the rows again. Bubbles, not composed.
  nph-page-change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person moves in the footer, with detail { page, pageSize }: the one of the
      nph-pagination, and the same one from the items per page of the middle footer. Bubbles
      and composed.
variants:
  default:
    axis: size
    choose_when: "A screen with a pointer and a dense reading."
    do_not_combine_with: []
  large:
    axis: size
    choose_when: "A touch screen or a reading with more air."
    do_not_combine_with: []
  framed:
    axis: appearance
    choose_when: "A table standing alone on the page."
    do_not_combine_with: []
  sticky-header:
    axis: appearance
    choose_when: "A long list: the body scrolls and the column titles stay."
    do_not_combine_with: []
states:
  sorted:
    token: data-table/sort-icon-active-foreground
    changes_for_user: "The sorted header shows the arrow of the direction in the active color; the other sortable headers show the two-way arrow in data-table/sort-icon-foreground."
  focus:
    token: focus/border
    changes_for_user: "The sortable header takes the ring in table/focus-ring-width inside the cell, around the label and the arrow; the scroll area takes it as in nph-table."
  selected:
    token: data-table/row-selected-background
    changes_for_user: "The row takes the selected background and the mark data-table/row-selected-indicator in data-table/row-selected-indicator-width at the inline start, with its box checked."
  hover:
    token: table/row-hover-background
    changes_for_user: "The whole row under the pointer, as in nph-table; a selected row keeps its background."
  bulk:
    token: toolbar/bulk-background
    changes_for_user: "While a row is selected, the bulk bar takes the place of the page bar and says how many rows are selected."
  loading:
    token: table/foreground
    changes_for_user: "The cells of data hold an nph-skeleton line and the header stays visible."
  empty:
    token: data-table/empty-gap
    changes_for_user: "A search that finds nothing shows the nph-empty with the searched term and the button that clears it, with the header visible."
business_rules:
  - "The data is controlled: the rows arrive already searched, sorted and paged, and the table says what the person chose in events."
  - "A click on a column that is not sorted sorts it ascending; on the sorted column, it turns the direction around (pending decision D-3)."
  - "The header box checks and unchecks the rows drawn on the page; rows selected on other pages stay selected (pending decision D-4)."
  - "The bulk bar shows while one row or more is selected, in place of the page bar, with the count."
  - "When the selection empties while the focus is in the bulk bar, the focus goes to the header box."
  - "The footer stays outside the scroll area; with a single page, there is no footer and the total goes to the caption."
  - "The footer follows pagination-layout, set by the consumer for the width of the space, until the breakpoint tokens exist (pending decision D-1)."
  - "The `ajuste` column sits at the end of the row, before the actions (pending decision D-6)."
domain_errors: []
tokens:
  stack: data-table/stack-gap
  selection: "data-table/selection-column-width, data-table/checkbox-border"
  selected_row: "data-table/row-selected-background, data-table/row-selected-indicator in data-table/row-selected-indicator-width"
  sort: "data-table/sort-icon-foreground, data-table/sort-icon-active-foreground, at table/icon-size"
  actions: data-table/action-column-width
  empty: data-table/empty-gap
  pagination: "data-table/pagination-gap, data-table/page-size-label-foreground, data-table/page-size-width"
  focus: "focus/border in table/focus-ring-width"
  table: "the table/* tokens of nph-table"
ai_hints:
  - "Use nph-data-table when the person searches, sorts, selects or acts on records; to only read and compare data, use nph-table."
  - "Pass rows already searched, sorted and paged, and listen to nph-sort-change, nph-selection-change and nph-page-change to pass them again."
  - "Give each row a name, the record that fills {name} in the names of its box, its more and its switch."
  - "Put an nph-toolbar `tipo página` in slot toolbar and an nph-toolbar `tipo em massa`, without its checkbox, in slot bulk."
  - "Mark a number column with align end, in the cell and in the header, and make it sortable when the person compares values."
  - "Name the search after what it filters, such as `Filtrar por pessoa`."
  - "Use the empty by search state with clear-label when a search finds nothing; never leave the body blank."
  - "Choose pagination-layout by the width of the space: wide from the table's own items per page, middle in between, narrow on a phone."
accessibility:
  semantics: "The native table of nph-table. The sorted header carries aria-sort; the sortable header is a native button the size of the cell. The selection, actions and `ajuste` headers of the boxes and of the more are cells of the header row, not column headers."
  accessible_name: "The caption names the table. The header box is named select-all-label; each row box, select-label with the row name; each more, actions-label with the row name; each switch, switch-label with the row name. The sortable header is named by its title."
  keyboard: ["Tab reaches the sortable headers, the boxes, the switches, the more of each row and the pieces of the footer, in order; the row takes no focus", "Enter and Space sort from a sortable header and check a box", "The more opens its nph-dropdown-menu with Enter, Space or the down arrow, with the keyboard of that menu", "A header that does not sort takes no focus"]
  focus: "The sortable header takes the ring focus/border in table/focus-ring-width inside the cell, around the label and the arrow. The scroll area takes the ring of nph-table. The boxes, the switches, the more, the bars and the footer use the focus of their own piece."
  contrast: "Text and link pass AA over the background, the stripe, the hover, the selected row and the bulk bar, in light and dark. The sort arrow and the selected row mark pass 3:1. The unchecked box border in data-table/checkbox-border passes 3:1 over the background, the header, the stripe and the hover."
  color_alternative: "The selected row has its box checked and the mark at the start, besides the background. The sort shows the arrow in the direction, not only the color. The bulk bar says how many rows are selected. Empty by search explains in text."
invalid_combinations:
  - "What nph-table rejects — a size outside the list, no column, a column without key or header, a repeated key — draws nothing."
  - "A sort-direction outside ascending and descending — no column is drawn sorted."
  - "A pagination-layout outside wide, middle and narrow — the footer is left out."
  - "A row with children — the children are left out: the tree is nph-table's."
  - "selectable without select-all-label or select-label, actions without actions-label, switch-header without switch-label — that column is left out."
  - "A row without name next to boxes, more or switches — its controls are left out."
relations:
  combines_with: [nph-table, nph-toolbar, nph-input, nph-chip, nph-checkbox, nph-button, nph-dropdown-menu, nph-switch, nph-select, nph-pagination, nph-empty, nph-skeleton, nph-badge, nph-icon]
  parents: ["page", "card", "panel"]
  children: [nph-toolbar, nph-checkbox, nph-button, nph-dropdown-menu, nph-switch, nph-select, nph-pagination, nph-empty, nph-skeleton, nph-icon, nph-badge]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Leaving a search with no result with a blank body."
  - "Marking the row by the background alone, with the box empty."
  - "Aligning numbers to the start."
  - "Sorting, filtering or cutting the list inside the table: the rows arrive ready."
  - "Putting the select-all box in the bulk bar: it stays in the table header."
  - "Using the data table to only read and compare data."
sources:
  design_md: "design.md, the data-table/* and table/* tokens; the data-table/* tokens are in src/tokens/source/semantic.tokens.json"
  decision: "P105 — API and semantics of nph-data-table"
  tests: "src/components/nph-data-table/nph-data-table.test.ts and nph-data-table.docs.test.ts"
  usage_evidence: "the mandatory examples of the nph-data-table Docs page and of the Examples story"
  storybook: "src/components/nph-data-table/nph-data-table.stories.ts and nph-data-table.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page NPH — Data Table 1371:2, board 1371:282, documentation 2875:17577, set 2633:69628"
---

# nph-data-table

## Function

**The problem it solves:** lets the person search, sort, select and act on records, such as
the people of a unit: the table of `nph-table`, with a toolbar above it, sortable headers, a
selection column, row actions in the more, an optional `ajuste` column and the pagination below
it. While rows are selected, the bulk action bar takes the place of the toolbar. It does not
replace `nph-table`, which is for reading and comparing data without these actions, and it is
not for building the page layout.

**When to use:**

- For lists of records that the person searches, sorts or filters, such as people by unit.
- Bulk selection when there is an action on several rows at once, such as download or delete.
- Row actions in the more when the row has more than one action.
- A column with a switch when the person turns a value of the row on or off without opening another screen.
- Size `large` on a touch screen or for reading with more air; `default` in the other cases.

**When NOT to use:**

- **To only read and compare data**, without searching, sorting or selecting — use
  `nph-table`.
- **To lay out the page** — the table holds records.
- **With a search that finds nothing and a blank body** — use the empty by search state.
- **To mark a row by the background alone** — select it, with the box checked too.

## Variants

**By size:** `size`, as in `nph-table`: `default` takes the row `table/row-height`, `large`
takes `table/row-height-large`.

**By appearance:** `framed` (the `moldura`), `sticky-header` (the `cabeçalho fixo`),
`striped` (the `faixa`) and `grid` (the `grade`) are the ones of `nph-table`, with the same
rule; so is the row that opens by the chevron (the `expande`), with `detail` and `toggleLabel`.

**By density:** `not_applicable`; the size carries the density.

**The Figma `estado`:**

| `estado` | In the code |
|---|---|
| `padrão` | The default |
| `seleção em massa` | `selected` with one key or more: the bulk bar in place of the page bar |
| `vazio pela busca` | `rows` empty with `empty-heading` and `clear-label` |
| `carregando` | `loading` |

**The pieces of the Figma set:**

| Piece | In the code |
|---|---|
| `cabeçalho` | A column with `sortable`; the direction in `sort-key` and `sort-direction`; `align` `end` puts the label and the arrow at the end |
| `seleção` | `selectable`, with the header box and the row boxes |
| `linha` | The row of `nph-table`, with the class of the selected row |
| `ações` | `actions` and `actions-label`: the more, an icon-only `nph-button` secondary ghost, opens an `nph-dropdown-menu` |
| `ajuste` | `switch-header` and `switch-label`, with `switched` in each row |

**The footer:** `pagination-layout`, for the width of the table's space (pending decision D-1):

| Layout | Footer | For |
|---|---|---|
| `wide` | The `nph-pagination` `tipo tabela`, with its own items per page | From 850 px |
| `middle` (default) | The label and the `nph-select` of items per page, and the `nph-pagination` `tipo intervalo` | From 420 to 849 px |
| `narrow` | The `nph-pagination` `tipo intervalo` only | Below 420 px or on a phone |

**Choose this variant when:** the tables above say it.

**Do not combine with:** a row with `children`; the select-all box in the bulk bar.

## States

| State | Token | What changes for the person |
|---|---|---|
| Sorted | `data-table/sort-icon-active-foreground` | The arrow of the direction in the active color; the other sortable headers show the two-way arrow in `data-table/sort-icon-foreground` |
| Focus | `focus/border` | The sortable header takes the ring in `table/focus-ring-width` inside the cell |
| Selected | `data-table/row-selected-background` | The background and the mark `data-table/row-selected-indicator` in `data-table/row-selected-indicator-width` at the inline start, with the box checked |
| Hover | `table/row-hover-background` | The whole row under the pointer; a selected row keeps its background |
| Bulk | `toolbar/bulk-background` | The bulk bar in place of the page bar, with the count |
| Loading | `table/foreground` | An `nph-skeleton` line in the cells of data, the header visible |
| Empty by search | `data-table/empty-gap` | The `nph-empty` with the searched term and the button that clears it, the header visible |

**Feedback and focus:** `nph-sort-change` (`{ key, direction }`), `nph-selection-change`
(`{ selected }`), `nph-row-action` (`{ row, action }`, the event of `nph-table`, also for the
menu of the more), `nph-row-switch` (`{ row, checked }`) and `nph-filter-clear` bubble and
are not composed; `nph-page-change` (`{ page, pageSize }`) is the one of `nph-pagination`,
bubbles and is composed. Code never fires them. When the selection empties while the focus is
in the bulk bar, the focus goes to the header box.

**Business rule the piece carries:**

- The data is controlled: the rows arrive already searched, sorted and paged, and the table
  says what the person chose in events.
- A click on a column that is not sorted sorts it ascending; on the sorted column, it turns
  the direction around (D-3).
- The header box checks and unchecks the rows drawn on the page; rows selected on other pages
  stay selected (D-4).
- The bulk bar shows while one row or more is selected, in place of the page bar, with the
  count.
- The footer stays outside the scroll area; with a single page, there is no footer and the
  total goes to the caption.
- The `ajuste` column sits at the end of the row, before the actions (D-6).

**Domain error states:** none. Empty by search is the state of a search that finds nothing.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The native table of `nph-table`. The sorted header carries `aria-sort`; the sortable header is a native button the size of the cell. The cells above the boxes and the more are cells of the header row, not column headers |
| Accessible name | The caption names the table. The header box is `select-all-label`, such as `Selecionar todas`; each row box, `select-label` with the row name, such as `Selecionar Ana Souza`; each more, `actions-label`, such as `Mais ações de Ana Souza`; each switch, `switch-label`. The search field of the toolbar is named after what it filters, such as `Filtrar por pessoa` |
| Keyboard and focus | Tab reaches the sortable headers, the boxes, the switches, the more of each row and the pieces of the footer; the row takes no focus. Enter and Space sort and check. A header that does not sort takes no focus. The sortable header takes the ring `focus/border` in `table/focus-ring-width` inside the cell; the other pieces use their own focus |
| Contrast | Text and link pass AA over the background, the stripe, the hover, the selected row and the bulk bar, in light and dark. The sort arrow, the selected row mark and the unchecked box border pass 3:1 |
| Alternative to color | The selected row has its box checked and the mark, besides the background. The sort shows the arrow in the direction. The bulk bar says how many rows are selected. Empty by search explains in text |
| Touch target | The boxes, the more, the search field and the buttons keep the target of their own piece, above 24 by 24. The row is not a target. On a touch screen, use `large` |
| Motion | None of its own |

## Relations

**Combines with:** `nph-table`, whose class it extends; `nph-toolbar` `tipo página`, with the
search in `nph-input`, and `tipo em massa`; `nph-chip` in the applied filters strip of the
toolbar; `nph-checkbox`, `nph-button`, `nph-dropdown-menu`, `nph-switch`, `nph-select`,
`nph-pagination`, `nph-empty`, `nph-skeleton`, `nph-badge` and `nph-icon`. Each keeps its own
rules.

**What is the parent:** a page, a card or a panel.

**What is the child:** the two toolbars, in the slots `toolbar` and `bulk`; inside the
table, the pieces of `nph-table` and the boxes, the more with its menu and the switches; the
`nph-pagination` and the `nph-select` of the footer.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Space | `data-table/stack-gap` between caption, bar, table and footer |
| Selection | `data-table/selection-column-width`; the unchecked box border `data-table/checkbox-border` |
| Selected row | `data-table/row-selected-background`, the mark `data-table/row-selected-indicator` in `data-table/row-selected-indicator-width` |
| Sort | `data-table/sort-icon-foreground`, `data-table/sort-icon-active-foreground`, at `table/icon-size` |
| Actions | `data-table/action-column-width` |
| Empty by search | `data-table/empty-gap` |
| Footer | `data-table/pagination-gap`, `data-table/page-size-label-foreground`, `data-table/page-size-width` |
| Focus | `focus/border` in `table/focus-ring-width` |
| Table | The `table/*` tokens of `nph-table` |

**Usage restrictions:** the component does not choose a size, a color or a space: everything
comes from a token. It points the input border of its own `nph-checkbox` at
`data-table/checkbox-border`. The sort glyphs are `arrow-up-arrow-down`, `arrow-up` and
`arrow-up` turned half a turn for descending, because the core has no down arrow (D-2). In a
part of the screen with another brand, `data-nph-brand` and `data-nph-color-scheme` go on the
same element (P67).

**AI hints:**

- Use `nph-data-table` when the person searches, sorts, selects or acts on records; to only
  read and compare data, use `nph-table`.
- Pass `rows` already searched, sorted and paged, and listen to `nph-sort-change`,
  `nph-selection-change` and `nph-page-change` to pass them again.
- Give each row a `name`, the record that fills `{name}` in the names of its box, its more and
  its switch.
- Put an `nph-toolbar` `tipo página` in `slot="toolbar"` and an `nph-toolbar` `tipo em massa`,
  without its checkbox, in `slot="bulk"`.
- Mark a number column with `align: 'end'` and make it `sortable` when the person compares
  values.
- Name the search after what it filters, such as `Filtrar por pessoa`.
- Use the empty by search state with `clear-label` when a search finds nothing; never leave the
  body blank.
- Choose `pagination-layout` by the width of the space.

## Examples

**Recommended case:** people by unit, with the search and Filter in the page bar, the name
and the amount sortable, the amount aligned to the end, the selection column and the more of
each row, and the footer with items per page.

**Alternative case:** two rows selected, the bulk bar with `2 de 6 selecionadas`, Download
and Delete; or a search with no result, with the nph-empty that says the searched term and
the button that clears the filter.

## Anti-patterns

- **Do not leave a search with no result with a blank body** — use the empty by search state.
- **Do not mark the row by the background alone** — select it, with the box checked too.
- **Do not align numbers to the start** — use `align: 'end'`, in the cell and in the header.
- **Do not sort, filter or cut the list inside the table** — the rows arrive ready.
- **Do not put the select-all box in the bulk bar** — it stays in the table header.
- **Invalid combinations:** what `nph-table` rejects; a `sort-direction` or a
  `pagination-layout` outside the lists; a row with `children`; a column of controls without
  their names.
- **Do not create without a decision:** load more, infinite scroll, a color property, a
  `::part`, a tree of records or a footer that changes by itself before the breakpoint tokens.

## Sources and decisions

- **The repository `design.md`:** the `data-table/*` and `table/*` tokens; the
  `data-table/*` tokens are in `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P105, which also records the extension points of
  `nph-table` the table is drawn through.
- **Pending decisions:** D-1 to D-6 of the task DSA-58: the footer by width without
  breakpoint tokens, the sort glyphs, the click cycle, the reach of the header box, the
  skeleton rows and the place of the `ajuste` column.
- **Tests:** `src/components/nph-data-table/nph-data-table.test.ts` and
  `nph-data-table.docs.test.ts`.
- **Usage evidence:** the mandatory examples of the `nph-data-table` Docs page and of the
  Examples story.
- **Storybook:** `src/components/nph-data-table/nph-data-table.stories.ts` and
  `nph-data-table.docs.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, page `NPH — Data Table` `1371:2`, board `1371:282`,
  documentation `2875:17577`, set `2633:69628`.
