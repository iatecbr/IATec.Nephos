---
piece: nph-table
level: component
status: active
solves: >-
  Shows data that the person reads and compares in rows and columns, with caption, header,
  cells and footer, and lets a row open its detail or the next level of a hierarchy.
use_when:
  - "To read and compare data in rows and columns, such as a statement, a report or a list of items."
  - "framed for a table standing alone on the page; without the frame inside a card or panel, which already have a border."
  - "A fixed header when the list is long inside a panel; horizontal scroll when the columns do not fit."
  - "A two-level header to group columns of the same subject, such as accesses by channel."
  - "An expanding row for the detail that does not fit in the row, such as an order and its items. It opens only through the chevron."
  - "A tree, up to three levels, for a hierarchy, such as unit and sub-unit."
  - "Size large on a touch screen or for a more relaxed reading; default otherwise."
do_not_use_when:
  - "To sort, select, filter or paginate: that is the nph-data-table."
  - "To lay out the page: the table holds data."
  - "With an empty cell when data is missing: use the no-value dash."
  - "With numbers aligned to the start: align them to the end."
  - "With an action written as a link: use the button in the cell."
api:
  size:
    type: enum
    values: [default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      The Figma property `size`. Default takes the row table/row-height and the cell sides
      table/cell-padding-inline; large takes table/row-height-large and
      table/container-padding, for touch or a more relaxed reading. Reflects because the
      internal CSS reads it. A value outside the list draws nothing and emits console.error
      in development.
  framed:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma property `moldura`. The border table/border in table/border-width with the
      corner table/radius, for a table standing alone on the page; the last row leaves its
      divider to the frame.
  sticky-header:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma property `cabeçalho fixo`. The scroll area stops at table/body-max-height and
      the header stays while the body scrolls, with the line table/sticky-divider-* under it.
  striped:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma `estado` `faixa`, for the whole table: every other row of data in
      table/row-striped-background. An expanded item does not count. On the host is a
      technical proposal of P97.
  grid:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma property `grade`, for the whole table: the vertical line between the columns of
      the body, in table/border. On the host is a technical proposal of P97.
  caption:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The Figma `legenda` and `texto da legenda`: the title above the table, already localized.
      It is the accessible name of the table (aria-labelledby). Empty, there is no caption.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The Figma `descrição` and `texto da descrição`, under the caption title, in
      table/caption-foreground. It describes the table (aria-describedby). Only with a caption.
  total:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The Figma `total`: the text of an nph-badge secondary beside the caption title. Only with
      a caption.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of a table without a caption. With neither, the table renders and
      emits console.warn once in development.
  no-value-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      What the screen reader reads in the no-value dash, already localized, such as sem
      valor. Empty while a cell has no value, the dash is read as a dash and the table emits
      console.warn once in development.
  empty-heading:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The heading of the nph-empty that fills the body when rows is empty. Required then:
      without it the body stays blank and the table emits console.error in development.
  empty-description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The description of the nph-empty of the empty body.
  columns:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. Each column is key, header, align, group and width. key is unique and
      header names the column; align is start (default, text) or end (numbers, with tabular
      figures), and the header and the footer follow it; group puts a title above neighbor
      columns of the same group; width is the content width of the column, set in use. An
      empty list, a column without key or header, a repeated key or an align outside the two
      draws nothing and emits console.error in development, one per cause.
  rows:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. Each row is key, cells, detail, children, open, loading and toggleLabel.
      cells maps a column key to a cell; detail opens the expanded item; children makes the
      next level of the tree, up to three; open says whether it starts open; loading spins the
      chevron; toggleLabel names the chevron. Opening a row replaces rows with a new list
      where that row has the new open. An invalid row is left out and emits console.error in
      development.
  footer:
    type: object
    required: false
    default: "null"
    reflects: false
    constraint: >-
      Property only. A value per column key, such as the total, drawn with the background and
      the typography of the header. Without a value for any column, there is no footer.
variants:
  default:
    axis: size
    choose_when: "Otherwise: a screen with a pointer and a dense reading."
    do_not_combine_with: []
  large:
    axis: size
    choose_when: "On a touch screen or for a more relaxed reading."
    do_not_combine_with: []
  framed:
    axis: appearance
    choose_when: "A table standing alone on the page. Without it inside a card or panel, which already have a border."
    do_not_combine_with: []
  sticky-header:
    axis: appearance
    choose_when: "A long list inside a panel: the body scrolls and the column titles stay."
    do_not_combine_with: []
states:
  hover:
    token: table/row-hover-background
    changes_for_user: "The whole row under the pointer takes the hover background."
  striped:
    token: table/row-striped-background
    changes_for_user: "Every other row of data takes the stripe background."
  grid:
    token: table/border
    changes_for_user: "A vertical line separates the columns of the body."
  focus:
    token: focus/border
    changes_for_user: "The scroll area that overflows and the truncated text take the ring in table/focus-ring-width with the keyboard."
  open:
    token: table/expand-indent
    changes_for_user: "The chevron points down and the expanded item or the next level of the tree shows under the row."
  loading:
    token: table/foreground
    changes_for_user: "A cell shows an nph-skeleton line in place of its content; a row that loads spins its chevron."
  empty:
    token: table/empty-padding
    changes_for_user: "With no row, the body holds the nph-empty and the header stays visible."
business_rules:
  - "Text aligns to the start and numbers to the end, with the header and the footer of the column."
  - "A missing value is the no-value dash, read as no-value-label; the cell is never left empty."
  - "A truncated text carries a tooltip and the focus on the cell, and needs the column width."
  - "With two actions or more, the frequent one stays visible and the rest go in the more, with Delete last."
  - "The expanding row and the tree open only through the chevron; the tree goes down to three levels."
  - "The caption names the table; without it, label does."
  - "Sorting, selection, filtering and pagination belong to the nph-data-table."
domain_errors: []
tokens:
  surface: [table/background, table/header-background, table/row-striped-background, table/row-hover-background, table/muted-background]
  text: [table/foreground, table/muted-foreground, table/caption-foreground, table/link-foreground]
  border: [table/border, table/border-width, table/radius]
  status: [table/status-success-icon, table/status-error-icon, table/rating-foreground]
  size: [table/row-height, table/row-height-large, table/icon-size, table/thumbnail-size, table/thumbnail-size-large, table/thumbnail-radius, table/max-width, table/caption-max-width, table/body-max-height]
  space: [table/cell-padding-block, table/cell-padding-inline, table/action-cell-padding-block, table/container-padding, table/cell-gap, table/cell-gap-tight, table/stack-gap, table/empty-padding, table/expand-indent, table/caption-action-gap]
  focus: [focus/border, table/focus-ring-width]
  sticky: [table/sticky-divider-color, table/sticky-divider-width, table/sticky-divider-spread, table/sticky-divider-blur]
  scrollbar: [table/scrollbar-width, table/scrollbar-radius, table/scrollbar-thumb, table/scrollbar-track]
ai_hints:
  - "Use nph-table to read and compare data; to sort, select, filter or paginate, use the nph-data-table."
  - "Pass columns and rows as properties; give each row a unique key, which the events carry back."
  - "Align a number column with align end; give a column a width when it carries truncated text."
  - "Leave a missing value as null and set no-value-label to the text the screen reader reads, such as sem valor."
  - "Give the table a caption, or a label when there is no caption."
  - "Use the actions cell for Edit and more, the mixed-actions cell for a written Edit and more, and the button cell for one action; never a link for an action."
  - "Listen to nph-row-action for the buttons of the cells and nph-row-toggle for the chevron; load children or detail on open and pass rows again."
  - "Use framed for a table standing alone on the page, and sticky-header for a long list inside a panel."
accessibility:
  semantics: "A native table in the shadow root: column headers with scope col, the group header with scope colgroup over its colgroup, the body and the footer. The tree rows carry aria-level."
  accessible_name: "The caption title (aria-labelledby), with the description as aria-describedby; without a caption, label. The icon-only buttons and the chevron carry a name per row, from the data."
  keyboard: ["Tab reaches the scroll area when it overflows, and the arrows scroll it", "Tab reaches the truncated text, which opens its tooltip", "Tab reaches the links and the buttons of the cells and the chevron; Enter and Space activate the buttons"]
  focus: "The scroll area that overflows and the truncated text take the ring focus/border in table/focus-ring-width with the keyboard. The chevron, the buttons and the more use the focus of their own piece."
  contrast: "Text and link pass AA over background, stripe, header and hover, in light and dark; the status icons pass 3:1. Exception accepted in the evidence: the rating star in table/rating-foreground is below 3:1 in light, and the score stays as a number beside it."
  color_alternative: "The status has a shape and a name besides the color, the badge always has text, the link is underlined, and the no-value dash is read as text."
invalid_combinations:
  - "A size outside default and large — the table draws nothing."
  - "No column, a column without key or header, a repeated key, an align outside start and end — the table draws nothing."
  - "A row without key or with a repeated key, with both detail and children, with children at the third level, a row that opens without toggleLabel, a detail without name — the row is left out."
  - "A cell type outside the list, a composite cell without its required text, a badge severity or a status outside the list, an icon outside the core — the cell is drawn blank."
relations:
  combines_with: [nph-avatar, nph-badge, nph-button, nph-icon, nph-image, nph-skeleton, nph-tooltip, nph-empty]
  parents: ["page", "card", "panel", "dialog"]
  children: [nph-avatar, nph-badge, nph-button, nph-icon, nph-image, nph-skeleton, nph-tooltip, nph-empty]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Leaving a cell empty when data is missing."
  - "Aligning numbers to the start."
  - "Writing an action as a link."
  - "Truncating text without the tooltip and the focus."
  - "Using the table to lay out the page, or to sort, select, filter or paginate."
sources:
  design_md: "design.md has no entry yet for the table/* tokens (pending decision D8 of DSA-49); they are in src/tokens/source/semantic.tokens.json"
  decision: "P97 — API and semantics of nph-table, 26-10-2026"
  tests: "src/components/nph-table/nph-table.test.ts"
  usage_evidence: "none yet"
  storybook: "src/components/nph-table/nph-table.stories.ts and nph-table.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-table set 1370:113, documentation frame 2584:66651"
---

# nph-table

## Function

**The problem it solves:** shows data that the person reads and compares in rows and
columns, such as payments by unit, a statement or the items of an order, with caption,
header, cells and footer. A row can open its detail or the next level of a hierarchy. It does
not sort, select, filter or paginate: that is the `nph-data-table`.

**When to use:**

- To read and compare data in rows and columns, such as a statement, a report or a list of
  items.
- `framed` for a table standing alone on the page; without the frame inside a card or panel,
  which already have a border.
- A fixed header when the list is long inside a panel; horizontal scroll when the columns do
  not fit.
- A two-level header to group columns of the same subject, such as accesses by channel.
- An expanding row for the detail that does not fit in the row, such as an order and its
  items. It opens only through the chevron.
- A tree, up to three levels, for a hierarchy, such as unit and sub-unit.
- Size `large` on a touch screen or for a more relaxed reading; `default` otherwise.

**When NOT to use:**

- **To sort, select, filter or paginate** — that is the `nph-data-table`.
- **To lay out the page** — the table holds data.
- **With an empty cell when data is missing** — use the no-value dash.
- **With numbers aligned to the start** — align them to the end.
- **With an action written as a link** — use the button in the cell.

## Variants

**By size:** the Figma property `size`.

| Size | Row | Cell sides | Choose when |
|---|---|---|---|
| `default` | `table/row-height`, 40 px | `table/cell-padding-inline`, 12 px | A screen with a pointer |
| `large` | `table/row-height-large`, 44 px | `table/container-padding`, 16 px | A touch screen or a more relaxed reading |

**By appearance:** `framed` (the `moldura`) draws the border `table/border` in
`table/border-width` with the corner `table/radius`; `sticky-header` (the `cabeçalho fixo`)
stops the scroll area at `table/body-max-height` and keeps the header in place with the line
`table/sticky-divider-color` in `table/sticky-divider-width`, spread
`table/sticky-divider-spread` and blur `table/sticky-divider-blur`. `striped` and `grid` are
the stripe and the grid of the whole table.

**By density:** `not_applicable`; the size carries the density.

**The column:** `align` `start` for text and `end` for numbers, followed by the header and
the footer; `group` for the two-level header; `width` for the content width, set in use.

**The cell:** a string or a number is text; `null`, `undefined` or an empty string is the
no-value dash; a composite cell takes a `type`:

| Content (Figma `conteúdo`) | `type` | Fields | Piece |
|---|---|---|---|
| `duas linhas` | `text` | `text`, `secondary` | The second line in `table/muted-foreground` |
| `pessoa` | `person` | `text`, `secondary`, `src` | `nph-avatar` md |
| `selo` | `badge` | `text`, `severity` | `nph-badge` light |
| `ícone e texto` | `icon-text` | `icon`, `text` | `nph-icon` of the core at `table/icon-size` |
| `miniatura` | `thumbnail` | `src`, `alt`, `text` | `nph-image` sm |
| `link` | `link` | `text`, `href` | Underlined, in `table/link-foreground` |
| `texto cortado` | `truncated` | `text` | Focusable cell with an `nph-tooltip` |
| `sem valor` | `null` | — | The dash, read as `no-value-label` |
| `status` | `status` | `status` (`success`, `error`), `text` | `circle-check` or `circle-xmark` in `table/status-*-icon`, with the name |
| `botão` | `button` | `text`, `action` | `nph-button` secondary light compact |
| `ações` | `actions` | `editLabel`, `moreLabel` | Edit and more, icon-only `nph-button` secondary ghost |
| `ações mistas` | `mixed-actions` | `text`, `moreLabel` | Written Edit and more, `nph-button` secondary light compact |
| `avaliação` | `rating` | `text` | One solid `star` in `table/rating-foreground` and the score |
| `carregando` | `loading` | — | `nph-skeleton` line |
| `categoria` | — | — | Not yet: pending decision D1 |

**The row:** `detail` (`name`, `description`, `src`, `alt`, `values` with `label` and
`value`, `badge` with `text` and `severity`) opens the expanded item; `children` opens the
next level of the tree; `open` says whether it starts open; `loading` spins the chevron;
`toggleLabel` names the chevron.

**Choose this variant when:** the tables above say it.

**Do not combine with:** a row with both `detail` and `children`; children below the third
level.

## States

| State | Token | What changes for the person |
|---|---|---|
| Hover | `table/row-hover-background` | The whole row under the pointer |
| Stripe (`faixa`) | `table/row-striped-background` | Every other row of data; an expanded item does not count |
| Grid (`grade`) | `table/border` | The vertical line between the columns of the body |
| Focus (`foco`) | `focus/border` | The ring in `table/focus-ring-width` on the scroll area that overflows and on the truncated text |
| Open (`aberto`) | `table/expand-indent` | The chevron points down; the expanded item or the next level shows under the row |
| Loading (`carregando`) | `table/foreground` | An `nph-skeleton` line in the cell; the chevron spins in a row that loads |
| Empty body | `table/empty-padding` | The `nph-empty` in place of the rows, with the header visible |

**Feedback and focus:** `nph-row-action` (`{ row, action }`) fires when the person activates
a button of a cell — `action` is the one of a `button` cell, or `edit` and `more` of the
actions — and `nph-row-toggle` (`{ row, open }`) when the person opens or closes a row. Both
bubble, are not composed, and code never fires them. Opening replaces `rows` with a new list
where that row has the new `open`.

**Business rule the piece carries:**

- Text aligns to the start and numbers to the end, with the header and the footer.
- A missing value is the no-value dash; the cell is never left empty.
- A truncated text carries a tooltip and the focus on the cell, and needs the column width.
- The expanding row and the tree open only through the chevron; the tree goes down to three
  levels.
- The caption names the table; without it, `label` does.

**Domain error states:** none. The empty body is the state of a list with no row.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A native table in the shadow root: column headers with `scope="col"`, the group header with `scope="colgroup"` over its `colgroup`, the body and the footer |
| Accessible name | The caption title names the table and the description describes it; without a caption, `label`. The icon-only buttons and the chevron carry a name per row, from the data, such as `Editar Ana Souza` |
| No value | The dash is hidden and the `no-value-label` is read in its place, such as `sem valor` |
| Keyboard and focus | The scroll area takes the focus only when it overflows, so the keyboard can scroll it; the truncated text takes the focus and opens its tooltip. The ring is `focus/border` in `table/focus-ring-width`. The chevron, the buttons and the more use the focus of their own piece |
| Open and level | The chevron carries `aria-expanded` and `aria-controls` on the host of its `nph-button`, and the tree rows carry `aria-level` (known limits, P97) |
| Contrast | Text and link pass AA over background, stripe, header and hover, in light and dark; the status icons pass 3:1. Accepted exception: the rating star is below 3:1 in light, and the score stays as a number |
| Alternative to color | The status has a shape and a name, the badge always has text, the link is underlined, and Delete is written in the menu |
| Touch target | The chevron and the more of the mixed actions are 28 by 28; Edit and more of the actions are 36 by 36. On a touch screen, use `large` |
| Motion | None of its own |

## Relations

**Combines with:** `nph-avatar` md, `nph-badge` light, `nph-icon`, the icon-only
`nph-button` (the chevron, the actions and the more), the `nph-button` secondary light
compact, `nph-image` (the thumbnail and the photo of the expanded item), `nph-skeleton`,
`nph-tooltip` and `nph-empty`. Each keeps its own rules. The more will open the
`nph-dropdown-menu`, with Delete last in destructive, once that piece exists; until then it
fires `nph-row-action`. Sorting, selection, filtering and pagination belong to the
`nph-data-table`.

**What is the parent:** a page, a card, a panel or a dialog.

**What is the child:** the pieces above, inside the cells, and the `nph-empty` of the empty
body. The slot `action` holds the main action of the caption.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Surface | `table/background`, `table/header-background` (header and footer), `table/row-striped-background`, `table/row-hover-background` |
| Text | `table/foreground`, `table/muted-foreground`, `table/caption-foreground`, `table/link-foreground` |
| Typography | `text/heading-xs` (header and footer); `text/body-md` (cell); `text/heading-sm` and `text/body-sm` for the caption title and the second line until D2 |
| Border and frame | `table/border`, `table/border-width`, `table/radius` |
| Row and space | `table/row-height`, `table/row-height-large`, `table/cell-padding-block`, `table/cell-padding-inline`, `table/action-cell-padding-block`, `table/container-padding`, `table/cell-gap`, `table/cell-gap-tight`, `table/stack-gap`, `table/empty-padding`, `table/caption-action-gap` |
| Width and height | `table/max-width`, `table/caption-max-width`, `table/body-max-height` |
| Tree | `table/expand-indent` plus `table/cell-gap` per level |
| Icons | `table/icon-size`, `table/status-success-icon`, `table/status-error-icon`, `table/rating-foreground` |
| Thumbnail and photo | `table/thumbnail-size`, `table/thumbnail-size-large`, `table/thumbnail-radius`, `table/muted-background`, through `nph-image` sm and lg, whose tokens are the same aliases |
| Focus | `focus/border` in `table/focus-ring-width` |
| Fixed header | `table/sticky-divider-color`, `table/sticky-divider-width`, `table/sticky-divider-spread`, `table/sticky-divider-blur` |
| Scrollbar | `table/scrollbar-width`, `table/scrollbar-radius`, `table/scrollbar-thumb`, `table/scrollbar-track` |

**Usage restrictions:** the component does not choose a size, a color or a space: everything
comes from a token. The column width comes from whoever uses it. In a part of the screen with
another brand, `data-nph-brand` and `data-nph-color-scheme` go on the same element (P67).
`design.md` has no usage entry for the `table/*` tokens, the category content is not
defined, and a few typography roles, glyphs and the emphasis of the total wait for the design
owner: they are pending decisions recorded in P97.

**AI hints:**

- Use `nph-table` to read and compare data; to sort, select, filter or paginate, use the
  `nph-data-table`.
- Pass `columns` and `rows` as properties; give each row a unique `key`, which the events
  carry back.
- Align a number column with `align: 'end'`; give a column a `width` when it carries
  truncated text.
- Leave a missing value as `null` and set `no-value-label` to the text the screen reader
  reads, such as `sem valor`.
- Give the table a `caption`, or a `label` when there is no caption.
- Use the `actions` cell for Edit and more, the `mixed-actions` cell for a written Edit and
  more, and the `button` cell for one action; never a link for an action.
- Listen to `nph-row-action` for the buttons of the cells and `nph-row-toggle` for the
  chevron; load children or detail on open and pass `rows` again.
- Use `framed` for a table standing alone on the page, and `sticky-header` for a long list
  inside a panel.

## Examples

**Recommended case:** a table with caption, description and total in a frame, the unit as
text and the amount aligned to the end, the no-value dash where an amount is missing, and the
total in the footer.

**Alternative case:** items grouped by category with the total in the footer, the groups as
the first level of the tree until the category content is defined; an open order, the
expanding row with the item and its photo.

## Anti-patterns

- **Do not leave the cell empty when data is missing** — use the no-value dash.
- **Do not align numbers to the start** — use `align: 'end'`.
- **Do not write an action as a link** — use the button in the cell.
- **Do not truncate text without the tooltip and the focus** — use the `truncated` cell.
- **Do not use the table to lay out the page**, nor to sort, select, filter or paginate.
- **Invalid combinations:** a size or an align outside the lists; a column without key or
  header; a row with both `detail` and `children`; children below the third level.
- **Do not create without a decision:** a `::part`, a color property, a free slot in the
  cell, sorting, selection, filtering or pagination, a category content.

## Sources and decisions

- **The repository `design.md`:** no entry yet for the `table/*` tokens (a pending decision
  with the design owner); the tokens are in `src/tokens/source/semantic.tokens.json`. The
  typography roles of the header and of the cell are the ones `design.md` names for a table.
- **The decision that originated it:** P97. The data by property, the names of the API, the
  stripe and the grid on the host, the slot `action`, the scroll area that becomes a region
  only when it overflows and the events are a technical proposal of this implementation.
- **Tests:** `src/components/nph-table/nph-table.test.ts`.
- **Usage evidence:** none yet.
- **Storybook:** `src/components/nph-table/nph-table.stories.ts` (Validation) and
  `nph-table.docs.stories.ts` (Docs).
- **Figma:** set `1370:113` and frame `Documentação` (`2584:66651`) in `DS-IA-NEPHOS 5.0`.
