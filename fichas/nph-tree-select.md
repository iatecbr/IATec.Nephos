---
piece: nph-tree-select
level: component
status: active
solves: >-
  Gives the person a form field that opens a panel with a tree, to choose one item or several
  from data in levels, such as folders, departments or categories, without leaving the form.
use_when:
  - "When the choice depends on the place of the item in a hierarchy: a destination folder, a department of a unit, a category with subcategories."
  - "In single, when the form takes one item: one destination, one department, one category."
  - "In search, when the tree is large and the person knows the name of the item; the search keeps the ancestors of every match."
  - "In multiple, when the form takes several items or whole branches; checking a parent checks its children."
  - "Inside an nph-field, which gives the label, the help text and the error message."
  - "default in most forms; large when the form uses tall fields."
do_not_use_when:
  - "For a list with no levels: use nph-select or nph-combobox."
  - "To explore and open items without filling a field: use nph-tree directly."
  - "In multiple when the field takes one item only: use single."
  - "With a panel narrower than the field of the mode: the labels and the indent of the levels do not fit."
  - "Without the nph-field and a visible label: the placeholder goes away when a value is chosen."
api:
  mode:
    type: enum
    values: [single, search, multiple]
    required: false
    default: single
    reflects: true
    constraint: >-
      The Figma `modo`. single takes the field of the nph-select; search the field of the
      nph-combobox; multiple the field of the nph-multi-combobox, with chips. Reflects because the internal CSS reads it. Any other
      value draws nothing and emits console.error in development.
  size:
    type: enum
    values: [default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      The height of the field: the one of the field it mirrors (select/height in single,
      combobox/height in search, multi-combobox/height in multiple, as a minimum) or
      control/height-large. The panel and the items do not change with the size. Any other value draws
      nothing and emits console.error in development.
  items:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The nodes of the first level, as in nph-tree: id (unique), label,
      children, branch, disabled, loading and error. The list is replaced, not changed in
      place. A node with no id or label, a repeated id or children that is not a list draws
      nothing and emits console.error in development, once per cause.
  expanded:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The ids of the open branches. The person changes it, and so does the
      code; an event says what the person did. On opening, the path to the chosen item is
      added to it.
  value:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The id of the chosen item in single and search; empty for none. The value attribute is
      its default until the person or the code sets one. The field shows the label of the
      item, on one line with an ellipsis. Setting it from code fires no event.
  values:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The ids of the checked items in multiple. When a whole branch is checked
      it carries the parent and every enabled item under it, as checked of nph-tree does; the
      field shows one chip, the parent's. Setting it from code fires no event.
  query:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Property only. The text typed in search and multiple. Setting it from code filters the
      tree and fires no event. It is never a value: leaving the field and a choice clear it.
  placeholder:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The invitation before a choice, already localized. It hides with the first choice. It
      is not a name.
  counter:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      In multiple, the field stays on one line and shows subject and an nph-badge with how
      many chips there are, instead of the chips.
  subject:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The subject of the field in counter mode, already localized, such as "Folders".
  icons:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The folder on a branch and the file on a leaf, in the tree of the panel.
  loading:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The first load: while items is empty, the panel shows the skeleton rows of the nph-tree
      and the tree is aria-busy.
  remove-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The word the remove button of each chip says before the item, already localized, such
      as "Remove". Without it, the chips have no remove button.
  clear-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the clear target of search, already localized. Without it, the
      field draws no clear target.
  empty-heading:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The title of the nph-empty when items is empty.
  empty-description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The description of the nph-empty when items is empty.
  no-result-heading:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The title of the nph-empty when the search finds nothing.
  no-result-description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The description of the nph-empty when the search finds nothing.
  error-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The phrase of the error row of a branch that failed to load, already localized.
  retry-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The action of the error row, already localized, such as "Try again".
  open:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The panel is open. The piece opens and closes it; the consumer may set it. Opening and
      closing fire no event. A disabled field does not open.
  name:
    type: string
    required: false
    default: "none"
    reflects: true
    constraint: >-
      The name of the entries in the form data: one name=id in single and search, one per
      checked item in multiple, as a select multiple. Reflects because the form reads the
      attribute of the host. With no name, nothing is submitted.
  required:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      With nothing chosen, the piece is valueMissing, with the message of the browser.
      nph-field writes it.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The whole piece at state/disabled-opacity, on color/muted, out of the Tab order and of
      the form data; it does not open. A disabled fieldset disables it too. It wins over
      invalid.
  invalid:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The error state: the border becomes status/error and the field gets aria-invalid. The
      sentence belongs to nph-field.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name in text, never visible, for a field with no associated label;
      nph-field writes it. An associated label wins over it.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible description in text, never visible: the help or the error sentence that
      nph-field writes.
  input:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired by the host when the person changes the value: an item chosen, an item checked or
      unchecked, or a chip removed. It bubbles and crosses shadow roots. Typing does not fire
      it.
  change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired by the host right after input. It bubbles. Setting value, values, query or open
      from code fires neither event.
  nph-tree-toggle:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      With the detail of nph-tree, { id, expanded }, when the person opens or closes a branch
      in the panel. It bubbles and is composed.
  nph-tree-load:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      With the detail of nph-tree, { id, retry }: a branch with no loaded children asks for
      them when it opens, once, and Try again on its error row asks again. The page loads the
      children and replaces items.
variants:
  mode:
    axis: appearance
    choose_when: "single for one item; search for one item in a large tree; multiple for several items or whole branches."
    do_not_combine_with:
      - "multiple when the field takes one item only."
  size:
    axis: size
    choose_when: "default in most forms; large when the form uses tall fields. One size per form."
    do_not_combine_with:
      - "default and large fields in the same form."
  counter:
    axis: density
    choose_when: "The chips in most forms; counter when the field must stay on one line, as in a filter or a toolbar."
    do_not_combine_with:
      - "counter where the person needs to check each choice."
states:
  default:
    token: "select/border, select/border-bottom; combobox/* in search; multi-combobox/* in multiple"
    changes_for_user: "The resting border, on color/background: the top and the sides in <piece>/border, the bottom line in <piece>/border-bottom, with the start icon and the arrow in color/muted-foreground."
  hover:
    token: color/input-hover
    changes_for_user: "The whole border, on all four sides, goes one step darker under the pointer."
  focus:
    token: focus/border
    changes_for_user: "Focus on the field: the border takes focus/border with the focus/halo attached outside."
  open:
    token: focus/border
    changes_for_user: "The panel is open and the field keeps the focus border; in multiple, open is the focus with the chips."
  error:
    token: status/error
    changes_for_user: "The border is status/error, also on hover; the sentence is in nph-field."
  error-focus:
    token: focus/halo-error
    changes_for_user: "The border stays status/error and the halo is focus/halo-error."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole piece at state/disabled-opacity on color/muted; it keeps the value and the chips, does not open and wins over the error."
business_rules:
  - "DOM focus stays on the field while the panel is open; the active item is the treeitem the field points to by aria-activedescendant."
  - "On opening, the active item is the chosen one, with the path to it open; with no value, the first item."
  - "Hover paints an item and does not move the active item; with both on one item, the focus wins."
  - "single and search: Enter, a click or Alt+ArrowUp choose the item and close the panel; choosing the same item fires nothing."
  - "multiple: Enter or a click checks or unchecks the item and the panel stays open; the typed text is cleared and the item stays active."
  - "A click on the chevron only opens or closes the branch; the rest of the row chooses or checks."
  - "Checking a parent checks its enabled children; a parent with part checked is mixed; a disabled item stays out of the count."
  - "A whole branch checked is one chip, the parent's; removing that chip unchecks the branch; values carries the parent and the items under it. With icons on, the chip repeats the folder or the file of its item; with icons off it has no icon."
  - "Typing in search and multiple filters the tree, keeps the ancestors of every match visible and open, and makes the first match active."
  - "A letter in single (D-1): closed, it opens the panel on the next visible item after the chosen one that starts with it; open, it moves the active item; the search wraps, the same letter cycles, a Space inside a quick search is part of it; the value changes only by Enter, Space outside a search, or Alt+ArrowUp."
  - "Esc closes the panel with the focus on the field; closed with typed text, it clears the text. Tab closes without choosing and the focus moves on. A press outside closes and keeps the value."
  - "The whole label of a cut item shows in an nph-tooltip: on hover after motion/hover-delay, and at once for the active item when the keyboard put it there, since the focus stays on the field."
  - "A branch that opens with no children asks for them once with nph-tree-load; the spinner takes the place of the chevron. On a failed branch the error row says so and Enter tries again."
  - "With no room below the panel opens above, at the same distance; above layout/max-list-height the tree scrolls inside the panel."
  - "disabled wins over invalid."
domain_errors:
  - "invalid: the choice needs correction, such as a required field with nothing chosen; nph-field writes the sentence and passes it as description."
tokens:
  height: "select/height in single, combobox/height in search or control/height-large; in multiple multi-combobox/height, a minimum that grows with the lines of chips"
  width: "layout/input-width; layout/multi-combobox-width in multiple"
  radius: radius/control
  border: "border/width, at rest in select/border and select/border-bottom (single), combobox/border and combobox/border-bottom (search) or multi-combobox/border and multi-combobox/border-bottom (multiple); in color/input-hover, focus/border, status/error or color/input (disabled) on the whole border. By decision, as in Figma, where the field is an instance of those pieces, nph-tree-select reads the tokens of the piece it mirrors: a declared exception to rule T9"
  background: "color/background; color/muted when disabled"
  padding: "space/control-padding on the sides; space/inline-tight above and below in multiple"
  gap: "space/inline between the parts; space/inline-tight between the chips and the text"
  icons: "nph-icon globe, magnifying-glass, chevron-down, chevron-up and xmark, icon/size-sm in color/muted-foreground"
  arrow_area: "no background and no divider, also when disabled; the field background shows through it"
  text: "text/body-md in color/foreground; the placeholder in color/muted-foreground"
  chip: "color/primary-surface, radius/full, horizontal padding space/inline, gap space/inline-tight; the label text/label-sm in color/primary-on-surface; with icons, the nph-icon of the item at icon/size-sm"
  panel_background: tree-select/panel-background
  panel_outline: "tree-select/panel-border and tree-select/panel-border-width"
  panel_radius: tree-select/panel-radius
  panel_max_height: tree-select/panel-max-height
  panel_width: "tree-select/panel-width in single and search; tree-select/panel-width-multiple in multiple; the field width when it is larger"
  panel_offset: tree-select/panel-offset
  panel_shadow: elevation/dropdown
  tree: "tree/* of nph-tree: tree/padding around the rows, tree/item-height, tree/indent, the focus of the item; the balloon of a cut label is the nph-tooltip"
  skeleton: skeleton/background
  focus: "focus/border, focus/halo, focus/halo-error, focus/ring-width, focus/radius-control"
  disabled: state/disabled-opacity
ai_hints:
  - "Use nph-tree-select when the choice depends on the place of the item in a hierarchy; for a list with no levels, nph-select or nph-combobox."
  - "Put nph-tree-select inside nph-field, which gives the label, the help text and the error message."
  - "Give the data as items, never as children; set value (single, search) or values (multiple) as ids."
  - "Pick search for a large tree and multiple for several items; pick counter only when the field must stay on one line."
  - "Always set remove-label in multiple and clear-label in search, the localized words of the two buttons."
  - "Answer nph-tree-load by replacing items, as with nph-tree."
  - "Let the field take the width of the form; the panel takes the width of the field."
  - "Read the value from the host on input or change, or from the form data under its name."
  - "Never use the placeholder as the only name."
accessibility:
  semantics: "The APG combobox with a tree popup. The field has role combobox (the text field in search and multiple, the field itself in single), aria-haspopup tree, aria-expanded and aria-controls. The panel is role tree, aria-multiselectable in multiple, aria-busy on the first load; each item is a treeitem with aria-level, aria-setsize, aria-posinset, aria-expanded on a branch, aria-selected in single and search, aria-checked (mixed on a mixed parent) in multiple, aria-disabled on a disabled item and aria-busy on a branch that loads. Icons are hidden from the screen reader. The host is form-associated and labelable."
  accessible_name: "From the label associated with the host, else from label; the whole path of the chosen item (such as Documents, Contracts, Contract 2025.pdf) follows it in the name of the field in single and search, because the field shows only the label of the item. The tree has the same name. The placeholder is not a name. Each remove button is named by remove-label and the item it removes."
  keyboard:
    - "Closed, single: Enter, Space, ArrowDown, ArrowUp and Alt+ArrowDown open on the chosen item or the first; Home and End open on the first and the last; a letter opens on the next item that starts with it."
    - "Closed, search: ArrowDown and ArrowUp open on the chosen item, else on the first or the last; typing opens and filters; Alt+ArrowDown opens with no active item until the person moves."
    - "Closed, multiple: ArrowDown and ArrowUp open on the first or the last; typing opens and filters; Alt+ArrowDown opens with no active item until the person moves."
    - "Open: ArrowDown and ArrowUp move between the visible items; ArrowRight opens a closed branch or goes to its first child; ArrowLeft closes an open branch or goes to the parent."
    - "Open, single: Home and End go to the first and the last item; the asterisk opens the siblings of the level; a letter moves to the next item that starts with it; Enter, Space or Alt+ArrowUp choose and close."
    - "Open, search: Enter or Alt+ArrowUp choose and close; Home, End and Space are typed in the field. Open, multiple: Enter checks and unchecks and keeps the panel open; Alt+ArrowUp closes without choosing."
    - "Esc closes with the focus on the field; Tab closes without choosing and the focus moves on."
  focus: "DOM focus does not leave the field while the panel is open. The active item draws the focus border of the nph-tree item by a state, when the last input was the keyboard, with no DOM focus on it. The field shows the focus border and the halo while it has the focus and while the panel is open. On a click outside, focus goes where the person clicked."
  contrast: "The text of the field, the chips and the items meet 4.5:1 in both themes; the bottom line of the border of the field meets 3:1. The outline of the panel is decorative: the elevation/dropdown shadow and the background separate the layer. The skeleton is decorative. The disabled field is exempt."
  color_alternative: "The chosen item has a bar at the start and the weight of the label, besides the background; a parent with part checked shows a dash in the box; the error is said by the sentence of nph-field."
invalid_combinations:
  - "A mode outside single, search and multiple — the field draws nothing."
  - "A size outside default and large — the field draws nothing."
  - "items with a repeated id or a node with no label — the field draws nothing."
  - "Chips without remove-label — no remove button."
  - "counter without subject — the counter alone."
  - "invalid without the sentence in nph-field — red with no text."
relations:
  combines_with: [nph-field, nph-tree, nph-tooltip, nph-checkbox, nph-badge, nph-empty, nph-skeleton, nph-spinner, nph-icon]
  parents: [nph-field, "form"]
  children: [nph-tree, nph-checkbox, nph-badge, nph-empty, nph-skeleton, nph-spinner, nph-icon]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using it for a list with no levels."
  - "Using it to explore items without filling a field."
  - "Using multiple for a single choice."
  - "Making the panel narrower than the field of the mode."
  - "Putting the field on the screen without nph-field and a label."
  - "Writing the data as children."
  - "Fixing the width in pixels."
sources:
  design_md: "design.md, tree-select/*, layout/input-width, layout/multi-combobox-width, layout/max-list-height, color/popover, color/border-subtle, color/skeleton, skeleton/background, color/input, color/field-border, color/field-border-bottom, color/input-hover, color/background, color/muted, color/muted-foreground, color/foreground, color/accent, color/primary-surface, color/primary-on-surface, status/error, focus/*, state/disabled-opacity, control/height-*, space/control-padding, space/inline, space/inline-tight, radius/control, radius/container, radius/full, border/width, elevation/dropdown, text/body-md and text/label-sm; select/*, combobox/* and multi-combobox/* border and height in the token source"
  decision: "P138 — API and semantics of nph-tree-select; the tree rows are shared with nph-tree as a module (the same path as P95), the form pattern is P80 and the field contract is P83"
  tests: "src/components/nph-tree-select/nph-tree-select.test.ts"
  usage_evidence: "the Examples story of the nph-tree-select Validation page"
  storybook: "src/components/nph-tree-select/nph-tree-select.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-tree-select documentation frame 7145:9081, root 6339:6323, sets 6339:8107 (field) and 6339:8110 (panel), appendix 7149:38729"
---

# nph-tree-select

## Function

**The problem it solves:** gives the person a form field that opens a panel with a tree, to
choose one item or several from data in levels, such as folders, departments and categories,
without leaving the form. The field is the one of the family, by mode; the tree inside the
panel is the rows of `nph-tree`. The label, the help and the error message belong to
`nph-field`; the field shows only the `erro` state.

**When to use:**

- When the choice depends on the place of the item in a hierarchy: a destination folder, a
  department of a unit, a category with subcategories.
- `single` for one item: one destination, one department, one category.
- `search` for a large tree where the person knows the name of the item. The search filters
  and keeps the ancestors of every match visible.
- `multiple` for several items or whole branches. Checking the parent checks the children;
  with part checked, the parent is mixed. A whole branch checked becomes one chip, the
  parent's.
- Inside an `nph-field`, which gives the label, the help text and the error message.
- `large` in a main form or on a touch screen, as in the other fields.

**When NOT to use:**

- **For a list with no levels** — use `nph-select` or `nph-combobox`.
- **To explore and open items without filling a field** — use `nph-tree` directly.
- **In `multiple` when the field takes one item only** — use `single`.
- **With a panel narrower than the field of the mode** — the labels and the indent of the
  levels do not fit.
- **Without the `nph-field` and a visible label** — the placeholder goes away when a value is
  chosen.

## Variants

**By appearance:** the `mode`: `single`, `search` and `multiple`.

**By size:** `default` (the height of the mirrored field: `select/height` in `single`, `combobox/height` in `search`, `multi-combobox/height` in `multiple`) and `large` (`control/height-large`). The
panel and the items do not change with the size.

**By density:** in `multiple`, the chips, which go down to more lines and make the field
grow, or `counter`, which keeps the field on one line with the subject and how many chips
there are.

| Variant | Choose when |
|---|---|
| `single` | One item; no search needed |
| `search` | One item from a large tree, by name |
| `multiple` | Several items or whole branches |
| `default` | Most forms |
| `large` | The form uses tall fields |
| `counter` | The field must stay on one line: a filter, a toolbar |

**Do not combine with:** `multiple` for a single choice; `default` and `large` fields in the
same form; `counter` where the person needs to check each choice.

## States

| State | Token | What changes for the person |
|---|---|---|
| `default` | `select/border`, `select/border-bottom` (`combobox/*` in `search`, `multi-combobox/*` in `multiple`) | The resting border, on `color/background`: top and sides in `<piece>/border`, the bottom line in `<piece>/border-bottom`, with the start icon and the arrow in `color/muted-foreground` |
| `hover` | `color/input-hover` | The whole border goes one step darker under the pointer |
| `foco` | `focus/border`, `focus/halo` | The border takes `focus/border`, with the halo attached outside |
| `aberto` | `focus/border`, `focus/halo` | The panel is open and the field keeps the focus border; in `multiple`, open is the focus with the chips |
| `erro` | `status/error` | The border is `status/error`, also on hover |
| `erro-foco` | `status/error`, `focus/halo-error` | The border stays `status/error` and the halo is `focus/halo-error` |
| `disabled` | `state/disabled-opacity`, `color/muted` | The whole piece fades on `color/muted`; the value and the chips stay; it does not open; error + disabled shows only the disabled look |

**The panel (the Figma `conteúdo`):**

| Content | What shows |
|---|---|
| items | The tree, at the top, filling the width, with `tree/padding` around it |
| search | The filtered tree, with the ancestors of every match visible and open |
| no result | The `nph-empty` with `no-result-heading` and `no-result-description` |
| first load | The skeleton rows of the `nph-tree`, in `skeleton/background`; the tree is `aria-busy` |
| empty | The `nph-empty` with `empty-heading` and `empty-description` |
| branch that loads | The spinner in place of the chevron of the branch |
| branch error | The error row: the message is never cut and Try again drops below it when they do not fit |

**Business rule the piece carries:**

- DOM focus stays on the field while the panel is open; the active item is the `treeitem`
  the field points to by `aria-activedescendant`.
- On opening, the active item is the chosen one, with the path to it open; with no value,
  the first item.
- Hover paints an item and does not move the active item; with both on one item, the focus
  wins.
- `single` and `search`: Enter, a click or Alt+ArrowUp choose the item and close the panel;
  choosing the same item fires nothing.
- `multiple`: Enter or a click checks or unchecks the item and the panel stays open; the
  typed text is cleared and the item stays active.
- A click on the chevron only opens or closes the branch; the rest of the row chooses or
  checks.
- Checking a parent checks its enabled children; a parent with part checked is mixed; a
  disabled item stays out of the count.
- A whole branch checked is one chip, the parent's; removing that chip unchecks the branch.
  `values` carries the parent and every item under it, as `checked` of `nph-tree` does.
- Typing filters the tree, keeps the ancestors of every match visible and open, and makes the
  first match active.
- A letter in `single` (D-1): closed, it opens the panel on the next visible item after the
  chosen one that starts with it; open, it moves the active item. The search wraps, the same
  letter cycles, a Space inside a quick search is part of it, and the value changes only by
  Enter, Space outside a search, or Alt+ArrowUp.
- Esc closes with the focus on the field; closed with typed text, it clears the text. Tab
  closes without choosing and the focus moves on. A press outside closes and keeps the value.
- A branch that opens with no children asks for them once with `nph-tree-load`; on a failed
  branch the error row says so and Enter tries again.
- With no room below the panel opens above, at the same distance; above
  `layout/max-list-height` the tree scrolls inside the panel and the width does not shrink.
- `disabled` wins over `invalid`.

**Domain error states:** `invalid`, when the choice needs correction, such as a required
field with nothing chosen. `nph-field` writes the sentence and passes it to the field as
`description`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The APG combobox with a tree popup. The field is `role="combobox"` with `aria-haspopup="tree"`, `aria-expanded` and `aria-controls`; the panel is `role="tree"`, `aria-multiselectable` in `multiple`, `aria-busy` on the first load. Each item is a `treeitem` with `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded` on a branch, `aria-selected` in `single` and `search`, `aria-checked` (`mixed` on the mixed parent) in `multiple`, `aria-disabled` and `aria-busy`. The host is form-associated and labelable |
| Accessible name | From the label associated with the host, else from `label`. In `single` and `search` the whole path of the chosen item follows it, because the field shows only the label of the item. The placeholder is not a name. Each remove button is named by `remove-label` and the item it removes |
| Description | `description`, read when the field takes focus: the help or the error sentence of `nph-field` |
| Keyboard | Closed: the arrows, Enter and Space (`single`), Home and End (`single`), a letter (`single`) and typing (`search`, `multiple`) open the panel. Open: the arrows move between visible items; Right and Left open and close a branch or go to its first child or parent; in `single`, Home, End, `*` and a letter; Enter, Space or Alt+ArrowUp choose; in `multiple`, Enter checks and the panel stays open; Esc closes; Tab closes without choosing |
| Focus | DOM focus does not leave the field while the panel is open. The active item draws the focus border of the `nph-tree` item by a state, only when the last input was the keyboard. A press on the panel keeps the focus on the field |
| Contrast | The text, the chips and the items meet 4.5:1; the bottom line of the border of the field 3:1. The outline of the panel is decorative, as the list of the family. The skeleton is decorative. The disabled field is exempt |
| Alternative to color | The chosen item has a bar and the weight of the label; a parent with part checked shows a dash; the error is said by the sentence of `nph-field` |
| Hidden parts | The icons, the box of the item and the arrow are hidden from the screen reader |
| Touch target | The field has the height of the size; the chevron, the box, the clear and the remove targets are 24 × 24; the item is `tree/item-height` |
| Known limits | The outer 1 px of the focus halo of an item at the edge of the panel is clipped by its scroll box, as in the list of the family. The balloon of the active item closes when the pointer enters and leaves that item's balloon. Forced colors follow the rows of `nph-tree` |

## Relations

**Combines with:** `nph-field`, which gives it the label, the help and the error; `nph-tree`,
whose rows the panel draws; `nph-checkbox`, the box of each item in `multiple`; `nph-badge`,
the counter; `nph-empty`, `nph-skeleton` and `nph-spinner`, in the panel; `nph-icon`, in the
field and in the tree.

**What is the parent:** `nph-field`, or a form.

**What is the child:** `nph-checkbox`, `nph-empty`, `nph-skeleton`, `nph-spinner` and
`nph-icon` in the panel; `nph-badge` and `nph-icon` in the field. The rows are the module of
`nph-tree`, not an `nph-tree` element: an `aria-activedescendant` cannot point into the
shadow root of another element.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Field | `select/height` (`single`), `combobox/height` (`search`), `multi-combobox/height` (`multiple`, minimum) or `control/height-large`; border `select/border`, `combobox/border` or `multi-combobox/border` on top and sides and the `-bottom` token below at rest (the tokens of the mirrored field, a declared exception to rule T9); width `layout/input-width`, `layout/multi-combobox-width` in `multiple`; `radius/control`; `border/width`; padding `space/control-padding`; gap `space/inline`; background `color/background` |
| Icons | `nph-icon` `globe`, `magnifying-glass`, `chevron-down`, `chevron-up` and `xmark`, `icon/size-sm`, `color/muted-foreground` |
| Arrow area | No background and no divider, also when disabled; the field background shows through it |
| Text | `text/body-md`, `color/foreground`; the placeholder in `color/muted-foreground` |
| Chip | `color/primary-surface`; `radius/full`; horizontal padding `space/inline`; gap `space/inline-tight`; the label `text/label-sm` in `color/primary-on-surface` |
| Panel | `tree-select/panel-background`, `tree-select/panel-border`, `tree-select/panel-border-width`, `tree-select/panel-radius`, `tree-select/panel-max-height`, `tree-select/panel-offset`, `tree-select/panel-width`, `tree-select/panel-width-multiple`; shadow `elevation/dropdown` |
| Tree | The `tree/*` tokens of `nph-tree`, by the shared rows; the balloon of a cut label is the `nph-tooltip` |
| First load | `skeleton/background` |
| Focus | `focus/border`, `focus/halo`, `focus/halo-error`, `focus/ring-width`, `focus/radius-control` |
| Disabled | `state/disabled-opacity` on `color/muted` |

**Usage restrictions:** the `tree-select/*` tokens are for this panel only. `layout/multi-combobox-width`
is the width of the field in `multiple`; `nph-select` and `nph-combobox` use
`layout/input-width`. The width may stretch to the form, and the panel takes the width of the
field, with the token as the minimum.

**AI hints:**

- Use `nph-tree-select` when the choice depends on the place of the item in a hierarchy; for a
  list with no levels, `nph-select` or `nph-combobox`.
- Put `nph-tree-select` inside `nph-field`, which gives the label, the help text and the
  error message.
- Give the data as `items`, never as children; set `value` (`single`, `search`) or `values`
  (`multiple`) as ids.
- Pick `search` for a large tree and `multiple` for several items; pick `counter` only when
  the field must stay on one line.
- Always set `remove-label` in `multiple` and `clear-label` in `search`, the localized words
  of the two buttons.
- Answer `nph-tree-load` by replacing `items`, as with `nph-tree`.
- Let the field take the width of the form; the panel takes the width of the field.
- Read the value from the host on `input` or `change`, or from the form data under its name.
- Never use the placeholder as the only name.

## Examples

**Recommended case:** "Choosing a file in a folder" — `single`; the path to the chosen item
stays open and the item has the bar, inside an `nph-field` with a label.

**Alternative case:** "Files that go in a submission" — `multiple`; the checked ones become
chips and the folder with part checked is mixed. "Finding a contract in a large tree" —
`search`; the person types `Contr` and the tree shows the items that match, with the
ancestors.

## Anti-patterns

- **Do not use it for a list with no levels** — use `nph-select` or `nph-combobox`.
- **Do not use it to explore items without filling a field** — use `nph-tree`.
- **Do not use `multiple` for one item** — use `single`.
- **Do not make the panel narrower than the field of the mode** — the labels and the indent do
  not fit.
- **Do not put the field on the screen without `nph-field` and a label.**
- **Do not write the data as children** — the field draws it from `items`.
- **Do not fix the width in pixels** — use the width of the form.
- **Invalid combinations:** a `mode` or a `size` outside the lists; `items` with a repeated id
  or a node with no label; chips without `remove-label`; `counter` without `subject`;
  `invalid` without the sentence in `nph-field`.
- **Do not create without a decision:** checking the parent and the children independently, a
  small size, a warning status, a "+N" chip, a highlight of the searched part, showing the
  parent or the children as the value, a width property, a color property or an event for
  opening and closing.

## Sources and decisions

- **The repository `design.md`:** `tree-select/*`, `layout/input-width`,
  `layout/multi-combobox-width`, `layout/max-list-height`, `color/popover`,
  `color/border-subtle`, `color/skeleton`, `skeleton/background`, `color/input`,
  `color/field-border`, `color/field-border-bottom`, `color/input-hover`, `color/background`, `color/muted`, `color/muted-foreground`,
  `color/foreground`, `color/accent`, `color/primary-surface`, `color/primary-on-surface`,
  `status/error`, `focus/*`, `state/disabled-opacity`, `control/height-*`,
  `space/control-padding`, `space/inline`, `space/inline-tight`, `radius/control`,
  `radius/container`, `radius/full`, `border/width`, `elevation/dropdown`, `text/body-md` and
  `text/label-sm`. The `border`, `border-bottom` and `height` tokens of `select`, `combobox`
  and `multi-combobox` are in `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P138, the API and semantics of `nph-tree-select`; the
  form pattern is P80, the field contract is P83, the tree is P118 and the shared rows follow
  the path of P95.
- **Tests:** `src/components/nph-tree-select/nph-tree-select.test.ts`.
- **Usage evidence:** the Examples story of the `nph-tree-select` Validation page.
- **Storybook:** `src/components/nph-tree-select/nph-tree-select.stories.ts` (Validation).
- **Figma:** the `nph-tree-select` documentation frame (`7145:9081`), root `6339:6323`, sets
  `6339:8107` (field) and `6339:8110` (panel) and appendix `7149:38729` in
  `DS-IA-NEPHOS 5.0`.
