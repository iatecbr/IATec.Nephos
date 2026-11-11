---
piece: nph-tree
level: component
status: active
solves: >-
  Shows items organized in levels, such as folders and files, so the person opens and closes each
  branch and chooses one item or several.
use_when:
  - "Data with two or more levels, where the person needs to see where each item is, open the branch that matters and choose one item or several."
  - "Choose a folder, a unit or a category inside a hierarchy: single selection."
  - "Check several branches at once, such as permissions by area: multiple selection, with the parent mixed when only part of the children is checked."
  - "Explore and open the levels with no choice: no selection."
  - "The data are folders and files: turn the icons on, on every node of the tree."
  - "Children that load on demand: a branch with no loaded children loads when it opens, and a branch that failed shows the error row with Try again."
do_not_use_when:
  - "For the main navigation menu of the product: use nph-sidebar."
  - "To show and hide the content of a section: use nph-accordion."
  - "For data with one level only: use a list or a table."
  - "For data with columns: use the tree of nph-table; the Tree Table is another piece."
  - "To choose a value from a list that opens in a layer: the Tree Select is another piece."
  - "For a structure deeper than five levels: review the structure before using it."
  - "To carry actions on each row, such as rename and delete: put them in an nph-context-menu opened by the item; the row carries no button."
api:
  items:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The nodes of the first level, as a list of { id, label, children, branch,
      disabled, loading, error }. id is required, a unique non-empty string in the whole tree, and
      it is the value that selected, checked, expanded and the events carry. label is required,
      already localized. A node is a branch when it has children or branch is true, and a leaf
      otherwise. branch true with no children is a branch that is not loaded yet: it opens and asks
      for them. disabled makes the item take focus and do nothing. loading says the branch is
      loading, whatever its children. error says the children could not be loaded: the error row
      takes their place. The list is replaced, never changed in place: the piece reads it again on
      each assignment. An empty list is a mount and draws the empty tree. A list that is not a list,
      a node with no id or label, a repeated id or children that is not a list draws nothing and
      emits console.error in development, one per cause.
  selection:
    type: enum
    values: [none, single, multiple]
    required: false
    default: none
    reflects: true
    constraint: >-
      The Figma property `seleção`. none opens and closes, with no choice. single chooses one item.
      multiple puts a checkbox on every item, with the parent mixed when part of the children is
      checked. Any other value draws nothing and emits console.error in development.
  selected:
    type: string
    required: false
    default: "null"
    reflects: false
    constraint: >-
      The id of the chosen item, in single selection. It is the current state: the person changes it
      and an event says so, and the code may set it too, which fires nothing. An id the tree does not
      know is ignored in silence, because the node may arrive later. Ignored in the other selections.
  checked:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      The ids of the checked items, in multiple selection. It is the current state, like selected.
      With the cascade on, a checked parent checks all its enabled children, and the list the person
      produces holds the ids that are in the checked state, a parent among them once all its enabled
      children are checked. A disabled item keeps its own state and stays out of the count of its
      parent; a disabled branch neither hands its mark to its children nor takes theirs. Ids the tree does not know are ignored. Ignored in the other selections.
  expanded:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      The ids of the open branches. The current state, like selected: the person opens and closes,
      and the code may set it. An id that is not a branch is ignored. A branch opened by the code
      with no children loaded shows as loading, and the page loads it: the event of load fires only
      when the person opens it.
  icons:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma boolean `ícone`. On, the folder (closed branch), the open folder (open branch) and the
      file (leaf), on every node of the tree: there is no way to mix nodes with and without icon.
  check-strictly:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Turns the cascade of the multiple selection off: every item is independent, and no parent is
      mixed. In code, checkStrictly.
  loading:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The first load of the tree: three nph-skeleton rows, each at the height of the item, in place of
      the list, and the tree is busy. It counts only while items is empty; with items it draws them.
      A branch that opens with no children loads on its own, with the spinner of the item.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the tree, already localized, when the host has no aria-label and no
      aria-labelledby. A tree with none of the three draws and warns once in development.
  aria-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the tree, set on the host. The host is the tree, so aria-label and
      aria-labelledby name it as they name any element. A property called ariaLabel is the native
      ARIA reflection, so the piece reads the attribute.
  empty-heading:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The title of the empty tree, already localized, such as No items. An empty tree without it
      draws and warns once in development.
  empty-description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The line under the title of the empty tree, already localized, such as This folder has no items
      yet.
  error-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The phrase of the error row, already localized, such as Couldn't load. An error row without it
      draws and warns once in development.
  retry-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The action of the error row, already localized, such as Try again. The name read for the error
      row is the two texts together. An error row without it draws and warns once in development.
  nph-tree-toggle:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person opens or closes a branch, with detail { id, expanded }. It bubbles and is
      composed. Setting expanded from code fires nothing.
  nph-tree-select:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires in single selection when the person chooses an item that was not the chosen one, with
      detail { id }. It bubbles and is composed. Setting selected from code fires nothing.
  nph-tree-check:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires in multiple selection when the person checks or unchecks an item, with detail { id,
      checked, value }: the item, its new state and the whole list of checked ids, the cascade
      included. It bubbles and is composed. Setting checked from code fires nothing.
  nph-tree-load:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fires when the person opens a branch that is not loaded (branch true, no children, no error)
      and when the person tries again on the error row, with detail { id, retry }. It bubbles and is
      composed. The page loads the children and replaces items: with them the branch gives the
      chevron back, and with error true the error row shows. After a Try again the row goes to
      loading until items brings that branch back as another object or without error; an update of some
      other branch keeps the retries still waiting.
  focus:
    type: method
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      focus(options) on the host puts the focus on the item that held it last, else on the Tab stop,
      because the host is not focusable itself. A menu opened on the tree (nph-context-menu) calls it
      when it closes, so the focus goes back to the item the menu was opened on.
  itemIdOf:
    type: method
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      itemIdOf(element) returns the id of the node whose row holds the element, or null. The error
      row answers with its branch. A menu opened on the tree (nph-context-menu, with the host as its
      object) reports the element under the pointer, or the focused item when opened from the
      keyboard, as origin: this says which node the menu is for.
variants:
  selection:
    axis: behavior
    choose_when: "none to explore and open; single to choose one folder, unit or category; multiple to check several branches at once, such as permissions by area."
    do_not_combine_with: ["a checkbox next to the selected item of single selection: they are two marks for the same choice"]
  icons:
    axis: appearance
    choose_when: "on when the data are folders and files; off with other data, and in multiple selection when the row is crowded."
    do_not_combine_with: ["nodes with icon and nodes without: the icon is on every node or on none"]
  content:
    axis: structure
    choose_when: "items by default; the first load (loading) while the first level comes; the empty tree when there is nothing to list; the error row under a branch that failed to load."
    do_not_combine_with: ["loading with items: the items draw"]
states:
  rest:
    token: "tree/item-foreground, tree/toggle-foreground, tree/icon-foreground"
    changes_for_user: "The label in the foreground color, the chevron and the folder or file icon muted."
  hover:
    token: "tree/item-background-hover, tree/item-foreground-hover"
    changes_for_user: "The row takes the accent background and its label the accent color; the chevron stays muted. Hover neither moves the focus nor selects. The item with focus and the selected item do not take it."
  focus:
    token: "tree/focus-border, tree/focus-border-width, tree/focus-border-radius"
    changes_for_user: "For keyboard users, a border drawn inside the whole row. The item with focus takes no hover background, even with the pointer over it. On the selected item it covers the bar."
  selected:
    token: "tree/item-background-selected, tree/item-foreground-selected, tree/toggle-foreground-selected, tree/icon-foreground-selected, tree/indicator-background, tree/indicator-width"
    changes_for_user: "In single selection, the chosen item takes the surface, a bar on the start edge, and its label, chevron and icon in the primary text color, with the label in medium weight."
  disabled:
    token: "tree/item-disabled-opacity"
    changes_for_user: "The whole item fades and does nothing, but it takes focus by the arrows. The focus border stays on top at full opacity."
  loading:
    token: "nph-spinner sm, color/primary"
    changes_for_user: "On an open branch whose children come, the spinner takes the place of the chevron and the branch is busy."
  error:
    token: "tree/error-icon-foreground, tree/item-foreground"
    changes_for_user: "Inside the group of the branch that failed, a row with a triangle, the phrase and the action Try again, which takes the hover and the focus of an item."
business_rules:
  - "The chevron opens and closes a branch; the rest of the row chooses. With no selection, a click on the row opens and closes the branch. In single selection a click on the row chooses, a branch included. In multiple selection a click on the row checks and unchecks, as a click on the box, and a click on the chevron only opens and closes."
  - "In single selection the chosen item takes the background, the bar and the label in medium weight; the checkbox is never on there. In multiple selection every item has the checkbox, and checked, unchecked and mixed come from it."
  - "The cascade is on by default: checking a parent checks its enabled children, unchecking a child leaves the parent mixed, and a disabled item stays out of the calculation and out of the cascade. checkStrictly turns it off."
  - "The leaf keeps the place of the chevron empty, so the labels line up. The icon is on every node of the tree or on none."
  - "One Tab stop: the chosen item, or the first. The arrows, Home, End, the asterisk and a letter move the focus inside, as in the WAI-ARIA tree view pattern. A disabled item takes focus and does nothing."
  - "A branch that opens with no loaded children loads: the spinner takes the place of the chevron, the branch is busy and the page is asked once with nph-tree-load. If the load fails, the error row enters the group, aligned to the indent of the children; Enter or a click on it tries again, and the name read is the phrase and the action together."
  - "The first load of the tree shows three skeleton rows in the root group; a branch that opens later uses the spinner of the item."
  - "The label stays on one line and is cut with an ellipsis; the whole text shows in nph-tooltip on the focus of the item, at once, and on hover, after motion/hover-delay, and reaches the screen reader whole."
  - "The tree has no background, border or height of its own and sets no overflow: it lives in a card, panel or popover that gives the surface and the scroll. With many items the container scrolls and the item does not shrink; the item that scrolls to the edge shows with the focus border whole."
  - "There is no depth limit in the component; above five levels, review the structure."
  - "The chevron turns a quarter in motion/expand-duration and motion/expand-easing; with reduced motion it swaps with no turning."
  - "Combined states: selected + disabled keeps the background, the bar and the label under the disabled opacity, on the whole item. Multiple selection + disabled keeps the checked mark and fades the box once, with the item. Error + disabled does not apply: the item has no error state."
  - "Every text comes from the consumer, already localized: the piece writes no word of its own."
  - "Rename and delete belong to an nph-context-menu opened by the item: the row carries no button."
domain_errors:
  - "An items that is not a list, a node with no id or label, a repeated id, or children that is not a list: the tree draws nothing and emits console.error in development, one per cause."
  - "A selection outside none, single and multiple: the tree draws nothing and emits console.error in development."
  - "A tree with no accessible name, an error row with no phrase or no action, or an empty tree with no heading draws and warns once in development, because the texts may arrive after the first render."
tokens:
  item: "tree/item-height, tree/item-padding-inline, tree/item-gap, tree/item-radius, tree/padding, tree/indent"
  toggle: "tree/toggle-icon-size, tree/toggle-padding, tree/toggle-foreground, tree/toggle-foreground-selected"
  icon: "tree/icon-size, tree/icon-foreground, tree/icon-foreground-selected, tree/error-icon-foreground"
  label: "tree/item-foreground, tree/item-foreground-hover, tree/item-foreground-selected"
  background: "tree/item-background-hover, tree/item-background-selected, tree/item-disabled-opacity"
  indicator: "tree/indicator-background, tree/indicator-width"
  focus: "tree/focus-border, tree/focus-border-width, tree/focus-border-radius"
  motion: "motion/expand-duration, motion/expand-easing"
  typography: "text/body-md, text/label-md"
ai_hints:
  - "Use nph-tree for data in two or more levels where the person opens branches and chooses; for the main navigation menu use nph-sidebar, for showing and hiding content use nph-accordion, for one level use a list or a table."
  - "Give items as nodes with a unique id and a label; replace the list when it changes, never change it in place."
  - "Choose selection: none to explore, single to choose one item, multiple to check several with the parent mixed; listen to nph-tree-select or nph-tree-check."
  - "Turn icons on only when the data are folders and files, and never mix nodes with and without icon."
  - "Mark a branch that is not loaded with branch true, listen to nph-tree-load, load the children and replace items; on failure set error true on the branch."
  - "Give the tree an aria-label, aria-labelledby or label, and the texts it owes: empty-heading, error-text and retry-text."
  - "Put the tree inside a card, panel or popover that gives the surface and the scroll; rename and delete go to an nph-context-menu opened by the item, with the host of the tree as its object."
accessibility:
  semantics: "The host is role tree, set through ElementInternals, so its aria-label and aria-labelledby name it. Inside, each node is a treeitem and each open branch a group joined to its item by aria-owns. aria-expanded on the branches; aria-selected on every item in single selection and aria-checked (true, false or mixed) on every item in multiple, never both; aria-multiselectable in multiple; aria-level, aria-setsize and aria-posinset on every item; aria-disabled on a disabled item, which still takes focus; aria-busy on a branch that loads and on the tree during its first load. The error row is a treeitem. The chevron, the icon, the checkbox and the spinner are hidden from assistive technology."
  accessible_name: "The tree: its aria-label or aria-labelledby, else label. An item: its label, the children not included. The error row: the phrase and the action together, such as Couldn't load. Try again. The cut label reaches the screen reader whole."
  keyboard:
    - "Tab enters the tree on one Tab stop, the chosen item or the first, and the next Tab leaves it. When the focus leaves the tree, the stop goes back to the chosen item or the first, whatever item had the focus."
    - "Down and Up move to the next and the previous visible item, without opening or closing, and pass through a disabled item."
    - "Right opens a closed branch and keeps the focus; on an open branch goes down to the first child; on a leaf does nothing. Left closes an open branch; on a child goes up to its parent; on a closed root item does nothing. In right-to-left writing the two swap."
    - "Home and End go to the first and the last visible item. The asterisk opens all the siblings of the item. A letter goes to the next visible item whose label starts with it."
    - "Enter: single selection chooses; no selection opens or closes the branch; multiple selection opens or closes a branch and checks a leaf; on the error row it tries again. Space: single chooses; multiple checks and unchecks with the cascade; no selection does nothing."
    - "Esc and Tab are not the tree's: inside a popover or a Tree Select, Esc belongs to the container."
  focus: "Keyboard only: a border of tree/focus-border-width in tree/focus-border drawn inside the whole row, over the bar of the selected item, at full opacity even on a disabled item. The item with focus takes no hover background. When the item that holds the focus leaves, the focus goes to the nearest branch that is still drawn."
  contrast: "The label meets 4.5:1 in both themes in every active state; the chevron and the folder and file icon meet 3:1, on color/muted-foreground and on color/primary-text when selected (7.21:1 at least); the bar over the selected surface meets 3:1; the focus border meets 3:1 over the background and over the selected item, and over the popover. Over the hover background in dark in one brand it measures 2.56:1, which is why the focus wins over the hover. The disabled item is exempt."
  color_alternative: "Selected: the background, the bar on the start edge and the label in medium weight, never color alone. Checked and mixed: the checkbox itself. Open and closed: the chevron. Error: the triangle and the phrase."
invalid_combinations:
  - "An items that is not a list, a node with no id or label, a repeated id — the tree draws nothing."
  - "A selection outside none, single and multiple — the tree draws nothing."
  - "The checkbox on the selected item of single selection — two marks for the same choice."
  - "Nodes with icon and nodes without — the icon is on every node or on none."
  - "The tree as the main navigation menu — use nph-sidebar."
  - "A button inside the row — the node has one action; the others go to an nph-context-menu."
relations:
  combines_with: [nph-checkbox, nph-icon, nph-spinner, nph-skeleton, nph-empty, nph-tooltip, nph-context-menu]
  parents: ["a card, a panel or a popover that gives the surface and the scroll"]
  children: [nph-checkbox, nph-icon, nph-spinner, nph-skeleton, nph-empty, nph-tooltip]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the tree for the main navigation menu of the product."
  - "Mixing nodes with icon and nodes without."
  - "Turning the checkbox on in the selected item of single selection."
  - "Changing items in place instead of replacing it."
  - "Putting a button on the row for rename or delete."
  - "Nesting more than five levels without reviewing the structure."
  - "Leaving the tree without a name."
sources:
  design_md: "design.md, the tree/* tokens, the colors they point to and the global focus/* and motion/* tokens"
  decision: "P118 — nph-tree: API and semantics"
  tests: "src/components/nph-tree/nph-tree.test.ts"
  usage_evidence: "no screen consumes it yet; the Tree Select and the Tree Table will"
  storybook: "src/components/nph-tree/nph-tree.stories.ts and nph-tree.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-tree documentation 5876:216753, sets 5485:350, 5485:421 and 5485:766"
---

# nph-tree

## Function

**The problem it solves:** shows items organized in levels, such as folders and files. The person
sees where each item is, opens and closes each branch and chooses one item or several.

**When to use:**

- Data with two or more levels, where the person needs to see where each item is, open the branch
  that matters and choose one item or several.
- Choose a folder, a unit or a category inside a hierarchy: single selection.
- Check several branches at once, such as permissions by area: multiple selection, with the parent
  mixed when only part of the children is checked.
- Explore and open the levels with no choice: no selection.
- The data are folders and files: turn the icons on, on every node of the tree.
- Children that load on demand: a branch with no loaded children loads when it opens, and a branch
  that failed shows the error row with Try again.

**When NOT to use:**

- **For the main navigation menu of the product** — use `nph-sidebar`.
- **To show and hide the content of a section** — use `nph-accordion`.
- **For data with one level only** — use a list or a table.
- **For data with columns** — use the tree of `nph-table`; the Tree Table is another piece.
- **To choose a value from a list that opens in a layer** — the Tree Select is another piece.
- **For a structure deeper than five levels** — review the structure before using it.
- **To carry actions on each row**, such as rename and delete — put them in an `nph-context-menu`
  opened by the item; the row carries no button.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Selection | `none` (default), `single`, `multiple` | `none` to explore and open; `single` to choose one folder, unit or category; `multiple` to check several branches at once, with the parent mixed |
| Icons | off (default), `icons` | On when the data are folders and files; off with other data, and in multiple selection when the row is crowded |
| Content | items, first load (`loading`), empty, error row | Items by default; the first load while the first level comes; the empty tree when there is nothing to list; the error row under a branch that failed to load |
| Type of item | closed branch, open branch, leaf | Not a property: a branch has `children` or `branch`, a leaf has neither |

The three Figma sets are drawn parts of this one tag, not tags of their own (P118): the item
(`nph-tree / item`, with `tipo`, `estado`, `checkbox`, `ícone` and `rótulo`), the group
(`nph-tree / grupo`, with `conteúdo` as items, loading or error) and the tree (`nph-tree`, with
`seleção` and `conteúdo`). The level comes from the group inside the group and is not a property.

**By size and density:** `not_applicable`. The tree has a single size, with an item 36 high.

**Do not combine with:** a checkbox on the selected item of single selection; nodes with icon and
nodes without icon.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Item | Rest | `tree/item-foreground`, `tree/toggle-foreground`, `tree/icon-foreground` | The label in the foreground color; the chevron and the icon muted |
| Item | Hover | `tree/item-background-hover`, `tree/item-foreground-hover` | The row takes the background and the label the accent color; the chevron stays muted. It moves no focus and selects nothing |
| Item | Focus | `tree/focus-border`, `tree/focus-border-width`, `tree/focus-border-radius` | For keyboard users, a border inside the whole row; no hover background |
| Item | Selected | `tree/item-background-selected`, `tree/item-foreground-selected`, `tree/toggle-foreground-selected`, `tree/icon-foreground-selected`, `tree/indicator-background`, `tree/indicator-width` | In single selection: the surface, the bar and the label in medium weight |
| Item | Disabled | `tree/item-disabled-opacity` | The whole item fades and does nothing; it still takes focus |
| Open branch | Loading | `nph-spinner`, `color/primary` | The spinner takes the place of the chevron; the branch is busy |
| Group | Error | `tree/error-icon-foreground` | The error row: the triangle, the phrase and Try again |

In the Figma set of the item, `estado` has the values `padrão`, `hover`, `foco`, `selecionado`,
`selecionado foco`, `desabilitado`, `selecionado desabilitado` and `carregando` (the open branch
only). Selected with hover stays equal to selected.

**Combined states (rule T11):**

- **Selected + disabled:** keeps the background, the bar and the label of the selection under the
  disabled opacity, on the whole item.
- **Multiple selection + disabled:** the checkbox keeps its checked mark and is never disabled by the
  tree, so only the opacity of the item fades the box, once.
- **Selected + focus:** the focus border covers the bar; the selection stays by the background, the
  color and the weight of the label.
- **Focus + disabled:** the disabled item takes focus by the arrows. The border is drawn on top, at
  full opacity, while the face of the item fades. Whether the border fades with the item is open
  (D-2).
- **Focus + hover:** the focus wins; the item with focus takes no hover background.
- **Error + disabled:** does not apply. The item has no error state, and the error row is not
  disabled.

**Feedback and focus:** focus shows only for keyboard users and is not removed: a border drawn inside
the whole row, because the items stack with no space and a ring outside would be cut by the neighbor.
A mouse click puts the focus on the item with no border. Hover only paints. Only the chevron moves: it
turns a quarter in `motion/expand-duration`; with reduced motion it swaps with no turning.

**Business rule the piece carries:** see the rules above and the section on keyboard. The chevron
opens; the row chooses. The cascade of multiple selection leaves a disabled item out of the count.
The first load shows three skeleton rows; a branch that opens later shows the spinner. The label is
cut on one line, with the whole text in `nph-tooltip`.

**Domain error states:** an invalid `items` or `selection` draws nothing and emits `console.error` in
development, one per cause. A missing name or text draws and warns once in development.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is `role="tree"`, through `ElementInternals`, so its `aria-label` and `aria-labelledby` name it. Each node is a `treeitem`; each open branch is a `group` joined to its item by `aria-owns`. `aria-expanded` on the branches; `aria-selected` on every item in single selection, `aria-checked` in multiple, never both; `aria-multiselectable` in multiple; `aria-level`, `aria-setsize` and `aria-posinset` on every item; `aria-disabled` on a disabled item; `aria-busy` on a branch that loads and on the tree during the first load. The error row is a `treeitem`. Chevron, icon, box and spinner are hidden |
| Accessible name | The tree: `aria-label`, `aria-labelledby`, else `label`. An item: its label, children not included. The error row: "Couldn't load. Try again". The cut label reaches the screen reader whole |
| Keyboard | One Tab stop. Down, Up, Right, Left, Home, End, asterisk and a letter move; Enter and Space act by the selection. The full table is in the sheet YAML. Esc and Tab are not the tree's |
| Focus | Keyboard only, a border inside the whole row, over the bar, at full opacity even on a disabled item. When the item that holds the focus leaves, the focus goes to the nearest branch still drawn |
| Contrast | The label meets 4.5:1 in both themes; the chevron, the icons, the bar and the focus border meet 3:1; over `color/accent` the focus border measures 2.56:1 in dark in one brand, which is why the focus wins over the hover. The disabled item is exempt |
| Alternative to color | Selected: background, bar and weight. Checked and mixed: the checkbox. Open and closed: the chevron. Error: triangle and phrase |
| Touch target | The whole row is the target, 36 high. The chevron and the box have a target of 24 by 24 |
| Cut text | The whole label in `nph-tooltip`, at once on focus and after `motion/hover-delay` on hover |
| Known limits | (a) The box of `nph-checkbox` does not take its own hover when the pointer is over the row: the piece hovers only through `:hover` inside its own shadow root and has no way to be forced, the same limit as DSA-45 D-3 in the dropdown menu; the box is drawn `inert`. (b) The hover of a checked box (`state/hover-opacity`) is not reachable either (DSA-17 D7). (c) `nph-tooltip` opens only on an element in the Tab order, and only the Tab stop is one: so the item takes the stop by hand while the pointer is over a cut label, and gives it back when the pointer goes to another item, leaves the tree or the person presses Tab. (d) The focus border of the disabled item is on top at full opacity until Indiane decides D-2. (e) A branch opened by the code with no children loads, but the load event fires only when the person opens it. (f) The tree does not scroll by itself: it sets no overflow, and the container that holds it gives the scroll. (g) A branch with `branch: true` and `children: []` opens to an empty group. (h) The failure of the first load of the tree has no row in the contract: the page shows its own message. (i) Right-to-left writing is mirrored (indent, bar, closed chevron, Left and Right), but Figma draws only left-to-right. (j) `items` is replaced, never mutated: a change in place is not seen. (k) The Tree Table and the Tree Select are other pieces, and the tree of `nph-table` is not this one (D-1) |

## Relations

**Combines with:** `nph-checkbox`, which draws the box of multiple selection; `nph-icon`, the chevron,
the folder, the file and the triangle; `nph-spinner`, which takes the place of the chevron while a
branch loads; `nph-skeleton`, the rows of the first load; `nph-empty`, the empty tree; `nph-tooltip`,
the cut label; and `nph-context-menu`, which carries rename and delete.

**What is the parent:** a card, a panel or a popover. The tree has no background, border or height of
its own and sets no overflow: the container gives the surface and the scroll.

**What is the child:** `nph-checkbox`, `nph-icon`, `nph-spinner`, `nph-skeleton`, `nph-empty` and
`nph-tooltip`, drawn by the piece.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

**Family:** the tree of `nph-table` (DSA-49, DSA-56) leads to `nph-tree`, which leads to the Tree
Select (with `nph-select` and `nph-dropdown-menu`) and the Tree Table (with `nph-table`).

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Item | `tree/item-height`, `tree/item-padding-inline`, `tree/item-gap`, `tree/item-radius`, `tree/padding`, `tree/indent` |
| Chevron | `tree/toggle-icon-size`, `tree/toggle-padding`, `tree/toggle-foreground`, `tree/toggle-foreground-selected` |
| Icons | `tree/icon-size`, `tree/icon-foreground`, `tree/icon-foreground-selected`, `tree/error-icon-foreground` |
| Label | `tree/item-foreground`, `tree/item-foreground-hover`, `tree/item-foreground-selected` |
| Background | `tree/item-background-hover`, `tree/item-background-selected`, `tree/item-disabled-opacity` |
| Bar | `tree/indicator-background`, `tree/indicator-width` |
| Focus | `tree/focus-border`, `tree/focus-border-width`, `tree/focus-border-radius` |
| Motion | `motion/expand-duration`, `motion/expand-easing` |
| Typography | `text/body-md` (label), `text/label-md` (selected label and Try again) |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything comes
from a token. The pieces inside keep their own tokens, and the spinner takes `color/primary`. The
piece has no slot, no `::part` and no color property.

**AI hints:**

- Use `nph-tree` for data in two or more levels where the person opens branches and chooses; for the
  main navigation menu use `nph-sidebar`, for showing and hiding content use `nph-accordion`, for one
  level use a list or a table.
- Give `items` as nodes with a unique `id` and a `label`; replace the list when it changes, never
  change it in place.
- Choose `selection`: `none` to explore, `single` to choose one item, `multiple` to check several
  with the parent mixed; listen to `nph-tree-select` or `nph-tree-check`.
- Turn `icons` on only when the data are folders and files, and never mix nodes with and without icon.
- Mark a branch that is not loaded with `branch: true`, listen to `nph-tree-load`, load the children
  and replace `items`; on failure set `error: true` on the branch.
- Give the tree an `aria-label`, `aria-labelledby` or `label`, and the texts it owes: `empty-heading`,
  `error-text` and `retry-text`.
- Put the tree inside a card, panel or popover that gives the surface and the scroll; rename and
  delete go to an `nph-context-menu` opened by the item, with the host of the tree as its object.

## Examples

**Recommended case:** choose the destination folder, in single selection, with the icons on and the
open branch holding the chosen folder.

**Alternative case:** check permissions by area, in multiple selection, with the parent mixed; a
branch that loads next to a branch that failed to load, with its error row; the tree with no items;
the tree in a card with many items and a scroll; the three selections in light and dark.

## Anti-patterns

- **Do not use the tree as the main navigation menu** — use `nph-sidebar`.
- **Do not mix nodes with icon and nodes without** — the icon is on every node or on none.
- **Do not turn the checkbox on in the selected item** — they are two marks for the same choice: the
  checkbox belongs to multiple selection and the selected item to single selection.
- **Do not change `items` in place** — replace the list.
- **Do not put a button on the row** — the node has one action; rename and delete go to an
  `nph-context-menu` opened by the item.
- **Do not nest more than five levels without reviewing the structure.**
- **Do not leave the tree without a name** — give `aria-label`, `aria-labelledby` or `label`.
- **Invalid combinations:** an `items` that is not a list; a node with no `id` or `label`; a repeated
  `id`; a `selection` outside the list.
- **Do not create without a decision:** the Tree Select, the Tree Table, guide lines between levels,
  a depth limit, a button inside the row.

## Sources and decisions

- **The repository `design.md`:** the `tree/*` tokens, the colors they point to and the global
  `focus/*` and `motion/*` tokens.
- **The decision that originated it:** P118.
- **Tests:** `src/components/nph-tree/nph-tree.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-tree/nph-tree.stories.ts` and `nph-tree.docs.stories.ts`.
- **Figma:** the `nph-tree` documentation frame (`5876:216753`), the sets `5485:350`, `5485:421` and
  `5485:766` in `DS-IA-NEPHOS 5.0`.
