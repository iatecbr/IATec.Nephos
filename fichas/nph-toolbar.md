---
piece: nph-toolbar
level: component
status: active
solves: >-
  Gathers, in a single line, the actions that apply to one area of the screen — the
  checked items, the page or the content being edited — and shows the applied filters
  in a strip below the page bar.
use_when:
  - "Bulk: the person checked items and will act on all of them at once."
  - "Page: at the top of a list or table, to search, filter and create."
  - "Tools: content being edited, with actions that apply to it."
  - "Floating: the selection is in a large area and the top bar goes out of view."
  - "Applied filters: the person filtered the list and needs to see each filter and take them away one by one or all at once."
do_not_use_when:
  - "For a single action: use nph-button where it belongs."
  - "To hold the actions that do not fit: that is nph-dropdown-menu, opened by More."
  - "To move between pages: the pagination is a sibling piece and stays outside the bar."
  - "For a vertical bar: there is none."
api:
  type:
    type: string
    required: false
    default: bulk
    reflects: true
    constraint: >-
      The Figma property `tipo`: bulk (`em massa`), page (`página`), tools
      (`ferramentas`), floating (`flutuante`) or applied-filters (`filtros aplicados`). It picks the
      background, the border and the layout. Any other value draws nothing and emits
      console.error in development.
  size:
    type: string
    required: false
    default: default
    reflects: true
    constraint: >-
      The Figma property `tamanho`: compact, default or large. The bar has no height of
      its own: it writes size on every direct child that has one — nph-button,
      nph-togglebutton, nph-toggle-group and nph-input — so they are 28, 36 or 44 px
      high, and a size set on such a child is overwritten. nph-chip, which has two
      sizes, takes compact in the compact bar and default in the other two. Any other
      value draws nothing and emits console.error in development.
  label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The name of the area, such as Table actions. It becomes the aria-label of the
      host, which is the role toolbar (the role group in applied-filters). A name the
      consumer puts on the host with aria-label or aria-labelledby also counts.
      Without any name, the bar draws nothing and emits console.error in development.
  count-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The Figma text `contagem`, "2 of 6 selected", already localized by the consuming
      application. The bar draws it after the checkbox, in text/label-md, with
      toolbar/bulk-count-foreground or toolbar/floating-count-foreground. Only in
      bulk and floating; in the other types it is not drawn and warns in development.
  trigger:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      applied-filters only: the id of the button that opens the filters, looked up in
      the same root as the bar, as the for of nph-tooltip. The focus goes there when
      no chip is left. Empty, it warns in development.
  removed-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      applied-filters only: the sentence a status region announces after a chip
      leaves by its X, with {text} for the text of the chip, already localized, such as
      "Filter removed: {text}". Empty, it warns in development and nothing is
      announced.
  cleared-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      applied-filters only: the sentence the status region announces after the clear
      button empties the strip, already localized, such as "All filters removed"
      (pending decision D-4).
  slot:
    type: "default slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The start of the bar: in bulk, the clear button after the count; in page, the
      search (nph-input) and the filter; in tools, groups of icon-only nph-button. In
      applied-filters, the removable nph-chip children and one nph-button, Clear
      filters, after the last chip. The pieces go in as direct children.
  checkbox:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      bulk only: one nph-checkbox, indeterminate, before the count (the Figma boolean
      `caixa de seleção`). Leave it empty when the table already has the checkbox in its
      header.
  center:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      One nph-toggle-group in the middle of the bar, to choose the view or turn on a
      mode (the Figma boolean `centro`). The zone shows only with content.
  end:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The actions on the right: nph-button in ghost, the main action in primary solid,
      the destructive action in danger ghost in a group of its own after an
      nph-separator, then More and Close last.
variants:
  type:
    axis: appearance
    choose_when: "bulk when items are checked; page at the top of a list or table; tools for content being edited; floating near a selection in a large area; applied-filters below the page bar, when filters are applied."
    do_not_combine_with:
      - "count-text outside bulk and floating."
      - "the checkbox slot outside bulk."
      - "the center and end slots in applied-filters."
  size:
    axis: size
    choose_when: "compact (28 px) on a dense screen used with a mouse; default (36 px) in general; large (44 px) on a touch screen."
    do_not_combine_with:
      - "compact: do not use as the main target on a touch screen."
states:
  bar:
    token: toolbar/background
    changes_for_user: "The bar has no state of its own: hover, focus, disabled and loading belong to the pieces. The icon of the ghost buttons becomes solid on hover and when checked."
  bulk-action-hover:
    token: toolbar/bulk-action-background-hover
    changes_for_user: "In the bulk bar, the hover of the secondary ghost actions uses the bar's own hover background, so it stays visible over the highlighted background (pending decision D-1)."
  applied-filters-empty:
    token: toolbar/gap
    changes_for_user: "With no chip, the strip is not shown and the page bar keeps its usual height. Clear filters shows from the first chip."
business_rules:
  - "The bar controls background, border, radius and space; each piece controls its own color, state and focus."
  - "The bar is the source of the height: it writes size on every direct child that has one."
  - "The actions are one Tab stop: the left and right arrows move between them, wrapping at the ends, and Home and End go to the first and the last (pending decision D-2)."
  - "The search field keeps its own Tab stop and its arrow keys (pending decision D-2)."
  - "The bar never removes a chip: the consumer takes the filter away on nph-remove and keeps the strip in the page while it is empty."
  - "After a chip leaves by its X, the focus goes to the next chip, else to the previous one, else to trigger; after Clear filters empties the strip, to trigger."
  - "The bar does not wrap and does not collapse by itself: on a narrow screen, the consumer drops the text of the buttons first, then sends the actions at the back to More (pending decision D-5). Only the applied filters strip wraps."
domain_errors: []
tokens:
  background: toolbar/background
  border: "toolbar/border in toolbar/border-width"
  radius: toolbar/radius
  padding: toolbar/padding
  gap: toolbar/gap
  bulk: "toolbar/bulk-background, toolbar/bulk-count-foreground, toolbar/bulk-padding-x and toolbar/bulk-action-background-hover"
  floating: "toolbar/floating-background, toolbar/floating-border, toolbar/floating-count-foreground, toolbar/floating-radius and elevation/dropdown"
  count: text/label-md
  height: "from the pieces: control/height-compact, control/height-default or control/height-large"
ai_hints:
  - "Pick type by the situation and size by the density of the screen; on a touch screen, use large."
  - "Name the bar with label, after the area it acts on, such as Table actions."
  - "Put the pieces as direct children: the default slot is the start, then slot center and slot end; the checkbox of the bulk bar goes in slot checkbox."
  - "Use one main action, primary solid, at the end; the others in ghost, never outline."
  - "Put the destructive action, danger ghost, in a group of its own after an nph-separator; More and Close come last."
  - "Set size on the bar, not on its pieces."
  - "For applied filters, keep the strip in the page, remove the chip on nph-remove, and give trigger, removed-text and cleared-text."
accessibility:
  semantics: "The host is role toolbar, named by label; the applied filters strip is role group (pending decision D-3). The divider is decorative. The applied filters strip has a status region that announces removed-text and cleared-text."
  accessible_name: "The bar is named with the area, such as Table actions. Each icon-only button has a label and its own tooltip with the same name. The X of each chip says remove-label and the text of the filter."
  keyboard:
    - "Tab enters the actions once, on the last action reached; the search field is a Tab stop of its own."
    - "The right and left arrows move to the next and the previous action, wrapping at the ends; in a right-to-left page they follow the reading direction."
    - "Home and End go to the first and the last action."
    - "A disabled action is skipped; a loading one is still an action."
    - "In the applied filters strip, each X and Clear filters are Tab stops of their own, with no arrow keys."
  focus: "Each piece shows its own focus, with border and halo. The bar draws no focus of its own and the host takes no focus."
  contrast: "Text and icon over the bar background pass 4.5:1 and 3:1 in light and dark. In the bulk bar, the hover of the actions uses toolbar/bulk-action-background-hover so it stays visible over the highlighted background."
  color_alternative: "The destructive action has a label or a trash icon besides the red. The checked item in the center changes its background and its icon becomes solid."
invalid_combinations:
  - "No name — no label, no aria-label and no aria-labelledby: the bar draws nothing."
  - "A type that is not bulk, page, tools, floating or applied-filters — the bar draws nothing."
  - "A size that is not compact, default or large — the bar draws nothing."
  - "count-text outside bulk and floating — it is not drawn; the bar warns in development."
  - "Content in the checkbox slot outside bulk, or anything but one nph-checkbox there — the bar warns in development."
  - "More than one main action, primary solid — the bar warns in development."
  - "A divider that opens or closes the bar — the bar warns in development."
  - "In applied-filters: content in another slot, a child that is not a removable nph-chip or the clear nph-button, more than one button, the button before a chip, no trigger or no removed-text — the bar warns in development."
relations:
  combines_with: [nph-checkbox, nph-input, nph-button, nph-toggle-group, nph-chip, nph-separator, nph-dropdown-menu]
  parents: ["the area it controls: table, list or editor"]
  children: [nph-checkbox, nph-input, nph-button, nph-toggle-group, nph-chip, nph-separator]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Two main actions."
  - "An outline on the secondary actions."
  - "Clear in text and clear in icon together."
  - "The destructive action next to the others, without a divider."
  - "A divider that opens or closes the bar."
  - "Wrapping the actions in an element of your own."
  - "Removing the applied filters strip when the last filter leaves."
sources:
  design_md: "design.md, the toolbar/* tokens, elevation/dropdown and text/label-md"
  decision: "P104 — API and semantics of nph-toolbar"
  tests: "src/components/nph-toolbar/nph-toolbar.test.ts and nph-toolbar.docs.test.ts"
  usage_evidence: "the mandatory examples of the nph-toolbar Docs page and of the Examples story"
  storybook: "src/components/nph-toolbar/nph-toolbar.stories.ts and nph-toolbar.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page NPH — Toolbar 1626:44, documentation 2944:6528, set 2105:426"
---

# nph-toolbar

## Function

**The problem it solves:** gathers, in a single line, the actions that apply to one area of
the screen — the checked items, the page or the content being edited — and shows the applied
filters in a strip below the page bar. The bar splits the actions into three zones, start,
center and end, and each zone takes Nephos pieces. It does not replace `nph-dropdown-menu`,
which holds the actions that do not fit, nor the pagination, a sibling piece that stays
outside the bar. The applied filters are not actions: they go in a strip of their own.

**When to use:**

- Bulk: the person checked items and will act on all of them at once.
- Page: at the top of a list or table, to search, filter and create.
- Tools: content being edited, with actions that apply to it.
- Floating: the selection is in a large area and the top bar goes out of view.
- Applied filters: the person filtered the list and needs to see each filter and take them
  away one by one or all at once.

**When NOT to use:**

- **For a single action** — use `nph-button` where it belongs.
- **To hold the actions that do not fit** — that is `nph-dropdown-menu`, opened by More.
- **To move between pages** — the pagination is a sibling piece and stays outside the bar.
- **For a vertical bar** — there is none.

## Variants

**By appearance:** `type`, the Figma property `tipo`.

| Variant | Choose when |
|---|---|
| `bulk` (`em massa`, default) | There are checked items; the bar shows the count |
| `page` (`página`) | Top of a list or table, with search, filter and create |
| `tools` (`ferramentas`) | Actions of content being edited, in groups |
| `floating` (`flutuante`) | Selection over the content, near it, with the dropdown shadow |
| `applied-filters` (`filtros aplicados`) | Strip below the page bar, one removable `nph-chip` per filter and Clear filters |

**By size:** `size`, the Figma property `tamanho`: `compact` (28 px) on a dense screen used
with a mouse, `default` (36 px, the default) in general, `large` (44 px) on a touch screen.
The bar writes `size` on its pieces; `nph-chip` is `compact` in the compact strip and
`default` in the other two, because it has only these two sizes.

**By density:** the size above.

**Choose this variant when:** the table above says it.

**Do not combine with:** `count-text` outside `bulk` and `floating`; the `checkbox` slot
outside `bulk`; the `center` and `end` slots in `applied-filters`.

## States

The bar has no state of its own: hover, focus, disabled and loading belong to the pieces.
The icon of the ghost buttons becomes solid on hover and when checked.

| State | Token | What changes for the person |
|---|---|---|
| Bar | `toolbar/background` | The pieces sit on the bar's background, border and radius |
| Bulk action hover | `toolbar/bulk-action-background-hover` | The hover of the secondary ghost actions stays visible over the highlighted background (D-1) |
| Applied filters, empty | `toolbar/gap` | No chip: the strip is not shown and the page bar keeps its height |

**Feedback and focus:** each piece shows its own focus; the bar draws none.

**Business rule the bar carries:**

- The bar controls background, border, radius and space; each piece controls its own color,
  state and focus.
- The bar is the source of the height: it writes `size` on every direct child that has one.
- The actions are one Tab stop: the left and right arrows move between them, wrapping at the
  ends, and Home and End go to the first and the last (D-2).
- The search field keeps its own Tab stop and its arrow keys (D-2).
- The bar never removes a chip: the consumer takes the filter away on `nph-remove` and keeps
  the strip in the page while it is empty.
- After a chip leaves by its X, the focus goes to the next chip, else to the previous one,
  else to `trigger`; after Clear filters empties the strip, to `trigger`.
- The bar does not wrap and does not collapse by itself: on a narrow screen, the consumer
  drops the text of the buttons first, then sends the actions at the back to More (D-5).
  Only the applied filters strip wraps.

**Domain error states:** none.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is `role` toolbar, named by `label`; the applied filters strip is `role` group (D-3). The divider is decorative. The strip has a status region that announces `removed-text` and `cleared-text` |
| Accessible name | The bar is named with the area, such as "Table actions". Each icon-only button has a `label` and its own tooltip with the same name. The X of each chip says `remove-label` and the text of the filter |
| Keyboard | Tab enters the actions once, on the last action reached; the search field is a Tab stop of its own. The right and left arrows move between the actions, wrapping at the ends, and follow the reading direction in a right-to-left page. Home and End go to the first and the last. A disabled action is skipped. In the applied filters strip, each X and Clear filters are Tab stops of their own |
| Focus | Each piece shows its own focus, with border and halo. The bar draws no focus of its own |
| Contrast | Text and icon over the bar background pass 4.5:1 and 3:1, in light and dark. In the bulk bar, the hover of the actions uses `toolbar/bulk-action-background-hover` |
| Alternative to color | The destructive action has a label or a trash icon besides the red. The checked item in the center changes its background and its icon becomes solid |
| Touch target | The actions are 28, 36 or 44 px by `size`; the checkbox is 24 px; the X of each chip is at least 24 px. On a touch screen, use `large` |

## Relations

**Combines with:** `nph-checkbox`, `nph-input`, `nph-button`, `nph-toggle-group`,
`nph-chip` and `nph-separator`, inside it; `nph-dropdown-menu`, opened by More.

**What is the parent:** the area it controls — a table, a list or an editor. The floating bar
sits over the content, near the selection, or pinned to the foot of the area.

**What is the child:** the pieces above, as direct children, in the default slot (the start),
`center`, `end` and, in the bulk bar, `checkbox`.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Bar | `toolbar/background`, `toolbar/border` in `toolbar/border-width`, `toolbar/radius`, `toolbar/padding` |
| Bulk bar | `toolbar/bulk-background`, no border, sides in `toolbar/bulk-padding-x`; actions hover in `toolbar/bulk-action-background-hover` |
| Floating bar | `toolbar/floating-background`, `toolbar/floating-border`, `toolbar/floating-radius`, `elevation/dropdown` |
| Count | `text/label-md`, in `toolbar/bulk-count-foreground` or `toolbar/floating-count-foreground` |
| Space | `toolbar/gap` between the items and between the zones |
| Applied filters strip | No background and no border; `toolbar/gap` between the items and the lines, `toolbar/padding` at the start only |
| Height | From the pieces: `control/height-compact`, `control/height-default` or `control/height-large` |

**Usage restrictions:** the bar consumes only the `toolbar/*` tokens, `elevation/dropdown` and
`text/label-md`. In the bulk bar it points the secondary ghost hover tokens of `nph-button` at
`toolbar/bulk-action-background-hover`, inherited by the pieces inside it. In a part of the
screen with another brand, `data-nph-brand` and `data-nph-color-scheme` go on the same element
(P67).

**AI hints:**

- Pick `type` by the situation and `size` by the density of the screen; on a touch screen,
  use `large`.
- Name the bar with `label`, after the area it acts on, such as "Table actions".
- Put the pieces as direct children: the default slot is the start, then `slot="center"` and
  `slot="end"`; the checkbox of the bulk bar goes in `slot="checkbox"`.
- Use one main action, primary solid, at the end; the others in ghost, never outline.
- Put the destructive action, danger ghost, in a group of its own after an `nph-separator`;
  More and Close come last.
- Set `size` on the bar, not on its pieces.
- For applied filters, keep the strip in the page, remove the chip on `nph-remove`, and give
  `trigger`, `removed-text` and `cleared-text`.

## Examples

**Recommended case:** a table with checked items: the bulk bar, with "3 of 12 selected",
Clear selection, Export and, after a divider, Delete in danger ghost; the checkbox is off,
because the table already has it in its header.

**Alternative case:** the top of a list, with the search and Filter at the start, the view
switch in the center and New person at the end, and the applied filters strip below it; or an
editor, with groups of icon-only actions, the trash apart and More at the end.

## Anti-patterns

- **Do not put two main actions** — use one primary solid and the others in ghost.
- **Do not use an outline on the secondary actions** — use ghost.
- **Do not turn on clear in text and clear in icon together** — choose one.
- **Do not leave the destructive action next to the others** — use the divider before it.
- **Do not open or close the bar with a divider** — it goes between groups.
- **Do not wrap the actions in an element of your own** — the bar reaches only its direct
  children for the size and the keyboard.
- **Do not remove the applied filters strip when the last filter leaves** — it hides itself,
  and it still has to announce and move the focus.
- **Invalid combinations:** no name; a `type`, or a `size`, outside the lists; `count-text`
  outside `bulk` and `floating`; the `checkbox` slot outside `bulk`; in `applied-filters`, a
  child that is not a removable chip or the clear button.
- **Do not create without a decision:** a vertical bar, an own event, a color property, a
  `::part` or a bar that collapses by itself.

## Sources and decisions

- **The repository `design.md`:** the `toolbar/*` tokens, `elevation/dropdown` and
  `text/label-md`. The `toolbar/*` tokens are in `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P104.
- **Pending decisions:** D-1 to D-5 of the task DSA-55: the bulk hover on the secondary ghost
  actions only, the arrow keys that wrap with the search out of them, the applied filters
  strip as a group with Tab stops, the announcement of Clear filters, and the narrow bar left
  to the consumer.
- **Tests:** `src/components/nph-toolbar/nph-toolbar.test.ts` and `nph-toolbar.docs.test.ts`.
- **Usage evidence:** the mandatory examples of the `nph-toolbar` Docs page and of the
  Examples story.
- **Storybook:** `src/components/nph-toolbar/nph-toolbar.stories.ts` and
  `nph-toolbar.docs.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, page `NPH — Toolbar` `1626:44`, documentation `2944:6528`,
  set `2105:426`.
